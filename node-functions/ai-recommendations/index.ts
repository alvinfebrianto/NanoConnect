import type { Database } from "../../src/lib/database.types";
import type { Influencer } from "../../src/types";
import { createSupabaseClient } from "../lib/supabase-client";
import {
  type AiRecommendationResult,
  createOpenRouterClient,
  generateRecommendations,
  type OpenRouterClient,
} from "./ai-service";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

interface RecommendationPayload {
  niche: string;
  company_size: string;
  budget: number;
  target_audience: string;
  location: string;
  campaign_type: string;
}

interface AiRecommendationsDependencies {
  getAuthUser: () => Promise<{ id: string } | null>;
  getUserProfile: (userId: string) => Promise<UserRow | null>;
  getAvailableInfluencers: () => Promise<Influencer[]>;
  getOpenRouterClient: () => OpenRouterClient;
}

type AiRecommendationsDependenciesFactory = (
  accessToken: string
) => AiRecommendationsDependencies;

const createAiRecommendationsDependencies: AiRecommendationsDependenciesFactory =
  (accessToken) => {
    const supabase = createSupabaseClient(accessToken);

    return {
      async getAuthUser() {
        const { data, error } = await supabase.auth.getUser(accessToken);
        if (error || !data.user) {
          return null;
        }
        return data.user;
      },

      async getUserProfile(userId: string) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error?.code === "PGRST116") {
          return null;
        }

        if (error) {
          throw error;
        }

        return data as UserRow;
      },

      async getAvailableInfluencers() {
        const { data, error } = await supabase
          .from("influencers")
          .select(`
            *,
            user:users (*)
          `)
          .eq("is_available", true)
          .eq("verification_status", "verified")
          .order("followers_count", { ascending: false })
          .limit(20);

        if (error) {
          throw error;
        }

        return (data as Influencer[]) ?? [];
      },

      getOpenRouterClient() {
        const apiKey = process.env.OPENROUTER_API_KEY;
        const model = process.env.OPENROUTER_MODEL ?? "gpt-oss-20b";
        if (!apiKey) {
          throw new Error("Konfigurasi API AI tidak lengkap.");
        }

        return createOpenRouterClient({
          apiKey,
          model,
        });
      },
    };
  };

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const parsePayload = async (request: Request) => {
  try {
    return (await request.json()) as Partial<RecommendationPayload>;
  } catch {
    return null;
  }
};

const validatePayload = (payload: ReturnType<typeof parsePayload>) => {
  if (!payload) {
    return "Payload tidak valid.";
  }

  const requiredFields: (keyof RecommendationPayload)[] = [
    "niche",
    "company_size",
    "budget",
    "target_audience",
    "location",
    "campaign_type",
  ];

  for (const field of requiredFields) {
    const value = payload[field];
    if (value === undefined || value === null || value === "") {
      return "Lengkapi seluruh data kampanye.";
    }
  }

  if (typeof payload.niche !== "string") {
    return "Niche tidak valid.";
  }

  if (typeof payload.company_size !== "string") {
    return "Ukuran bisnis tidak valid.";
  }

  if (typeof payload.target_audience !== "string") {
    return "Target audiens tidak valid.";
  }

  if (typeof payload.location !== "string") {
    return "Lokasi tidak valid.";
  }

  if (typeof payload.campaign_type !== "string") {
    return "Jenis kampanye tidak valid.";
  }

  if (typeof payload.budget !== "number" || Number.isNaN(payload.budget)) {
    return "Budget harus berupa angka.";
  }

  if (payload.budget <= 0) {
    return "Budget harus lebih besar dari 0.";
  }

  return null;
};

const parseBearerToken = (
  authorizationHeader: string | null
): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const formatErrorResponse = (error: unknown): Response => {
  console.error("AI Recommendations Error:", error);

  const errorMessage =
    error instanceof Error ? error.message : "Terjadi kesalahan.";

  if (errorMessage.includes("Rate limit")) {
    return jsonResponse(
      { message: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
      429
    );
  }

  if (errorMessage.includes("API key")) {
    return jsonResponse(
      { message: "Konfigurasi AI tidak valid. Hubungi administrator." },
      500
    );
  }

  return jsonResponse(
    {
      message: `Gagal membuat rekomendasi AI: ${errorMessage}`,
    },
    500
  );
};

const enrichRecommendationsWithInfluencers = (
  aiResult: AiRecommendationResult,
  influencers: Influencer[]
): Array<
  AiRecommendationResult["recommendations"][number] & {
    influencer: Influencer;
  }
> => {
  const influencerMap = new Map(influencers.map((inf) => [inf.id, inf]));

  return aiResult.recommendations
    .map((rec) => {
      const influencer = influencerMap.get(rec.influencerId);
      if (!influencer) {
        return null;
      }

      return {
        ...rec,
        influencer,
      };
    })
    .filter(
      (
        item
      ): item is AiRecommendationResult["recommendations"][number] & {
        influencer: Influencer;
      } => item !== null
    );
};

const processRecommendationRequest = async (
  request: Request,
  dependencies: AiRecommendationsDependencies
): Promise<Response> => {
  const authUser = await dependencies.getAuthUser();
  if (!authUser) {
    return jsonResponse({ message: "Autentikasi tidak valid." }, 401);
  }

  const payload = await parsePayload(request);
  const validationError = validatePayload(payload);
  if (validationError) {
    return jsonResponse({ message: validationError }, 400);
  }

  const userProfile = await dependencies.getUserProfile(authUser.id);
  if (!userProfile) {
    return jsonResponse({ message: "Profil pengguna tidak ditemukan." }, 404);
  }

  if (userProfile.user_type !== "sme") {
    return jsonResponse(
      { message: "Hanya akun SME yang dapat meminta rekomendasi." },
      403
    );
  }

  const [influencers, openRouterClient] = await Promise.all([
    dependencies.getAvailableInfluencers(),
    dependencies.getOpenRouterClient(),
  ]);

  if (influencers.length === 0) {
    return jsonResponse({
      message: "Data kampanye diterima.",
      data: {
        user: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
        },
        summary:
          "Saat ini tidak ada influencer yang tersedia untuk direkomendasikan.",
        recommendations: [],
      },
    });
  }

  const aiResult = await generateRecommendations(
    payload as RecommendationPayload,
    influencers,
    openRouterClient
  );

  const enrichedRecommendations = enrichRecommendationsWithInfluencers(
    aiResult,
    influencers
  );

  return jsonResponse({
    message: "Rekomendasi AI berhasil dibuat.",
    data: {
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
      },
      summary: aiResult.summary,
      recommendations: enrichedRecommendations,
    },
  });
};

export const createAiRecommendationsHandler = (
  dependenciesFactory: AiRecommendationsDependenciesFactory = createAiRecommendationsDependencies
) =>
  async function onRequest(context: { request: Request }) {
    const { request } = context;

    if (request.method !== "POST") {
      return jsonResponse({ message: "Metode tidak diizinkan." }, 405);
    }

    const accessToken = parseBearerToken(request.headers.get("Authorization"));
    if (!accessToken) {
      return jsonResponse({ message: "Autentikasi diperlukan." }, 401);
    }

    const dependencies = dependenciesFactory(accessToken);

    try {
      return await processRecommendationRequest(request, dependencies);
    } catch (error) {
      return formatErrorResponse(error);
    }
  };

export const onRequest = createAiRecommendationsHandler();
