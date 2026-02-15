import type { Database } from "../../src/lib/database.types";
import { createSupabaseClient } from "../lib/supabase-client";

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

const buildProfileSummary = (payload: RecommendationPayload) =>
  [
    "Ringkasan kebutuhan kampanye:",
    `- Niche: ${payload.niche}`,
    `- Ukuran bisnis: ${payload.company_size}`,
    `- Budget: Rp ${payload.budget.toLocaleString("id-ID")}`,
    `- Target audiens: ${payload.target_audience}`,
    `- Lokasi: ${payload.location}`,
    `- Jenis kampanye: ${payload.campaign_type}`,
  ].join("\n");

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
    const authUser = await dependencies.getAuthUser();
    if (!authUser) {
      return jsonResponse({ message: "Autentikasi tidak valid." }, 401);
    }

    const payload = await parsePayload(request);
    const validationError = validatePayload(payload);
    if (validationError) {
      return jsonResponse({ message: validationError }, 400);
    }

    try {
      const userProfile = await dependencies.getUserProfile(authUser.id);
      if (!userProfile) {
        return jsonResponse(
          { message: "Profil pengguna tidak ditemukan." },
          404
        );
      }

      if (userProfile.user_type !== "sme") {
        return jsonResponse(
          { message: "Hanya akun SME yang dapat meminta rekomendasi." },
          403
        );
      }

      return jsonResponse({
        message: "Data kampanye diterima.",
        data: {
          user: {
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
          },
          summary: buildProfileSummary(payload as RecommendationPayload),
        },
      });
    } catch (_error) {
      return jsonResponse(
        { message: "Terjadi kesalahan saat memproses rekomendasi." },
        500
      );
    }
  };

export const onRequest = createAiRecommendationsHandler();
