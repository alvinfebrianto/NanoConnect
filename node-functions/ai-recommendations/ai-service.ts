import type { Influencer } from "../../src/types";

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens?: number;
  };
}

interface OpenRouterError {
  error: {
    message: string;
    code?: number;
  };
}

export interface OpenRouterClient {
  complete: (
    prompt: string,
    options?: { temperature?: number; maxTokens?: number }
  ) => Promise<{ content: string; usage: OpenRouterResponse["usage"] }>;
}

interface OpenRouterConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export interface InfluencerMatch {
  influencerId: string;
  matchScore: number;
  reasons: string[];
  contentStrategy: string;
}

interface AiRecommendationResult {
  recommendations: InfluencerMatch[];
  summary: string;
}

interface CampaignPayload {
  niche: string;
  company_size: string;
  budget: number;
  target_audience: string;
  location: string;
  campaign_type: string;
}

const OPENROUTER_BASE_URL = "https://openrouter.ai";
const DEFAULT_OPENROUTER_MODEL = "gpt-oss-20b";

export const createOpenRouterClient = (
  config: OpenRouterConfig
): OpenRouterClient => {
  const apiKey = config.apiKey;
  const baseUrl = config.baseUrl ?? OPENROUTER_BASE_URL;
  const model = config.model ?? DEFAULT_OPENROUTER_MODEL;

  if (!apiKey) {
    throw new Error("OpenRouter API key diperlukan.");
  }

  const complete: OpenRouterClient["complete"] = async (
    prompt,
    options = {}
  ) => {
    const response = await fetch(`${baseUrl}/api/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nanoconnect.id",
        "X-Title": "NanoConnect AI Recommendations",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as
        | OpenRouterError
        | Record<string, never>;
      const errorMessage =
        "error" in errorData && errorData.error?.message
          ? errorData.error.message
          : `OpenRouter API error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = (await response.json()) as OpenRouterResponse;
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Respons dari AI tidak valid.");
    }

    return {
      content,
      usage: data.usage,
    };
  };

  return { complete };
};

export const generateRecommendationPrompt = (
  campaign: CampaignPayload,
  influencers: Influencer[]
): string => {
  const influencerList = influencers
    .map((inf, index) => {
      const userName = inf.user?.name ?? "Unknown";
      return `
${index + 1}. ${userName}
   - ID: ${inf.id}
   - Niche: ${inf.niche}
   - Lokasi: ${inf.location}
   - Followers: ${inf.followers_count.toLocaleString("id-ID")}
   - Engagement Rate: ${inf.engagement_rate}%
   - Harga per Post: Rp ${inf.price_per_post.toLocaleString("id-ID")}
   - Kategori Konten: ${inf.content_categories?.join(", ") ?? "N/A"}
   - Bahasa: ${inf.languages?.join(", ") ?? "N/A"}
   - Tersedia: ${inf.is_available ? "Ya" : "Tidak"}
`;
    })
    .join("\n");

  return `Kamu adalah AI Marketing Expert untuk platform NanoConnect yang menghubungkan UMKM (SME) dengan nano-influencer di Indonesia.

TUGAS: Analisis kebutuhan kampanye dan berikan rekomendasi influencer yang paling cocok.

DATA KAMPANYE:
- Niche/Industri: ${campaign.niche}
- Ukuran Perusahaan: ${campaign.company_size}
- Budget Total: Rp ${campaign.budget.toLocaleString("id-ID")}
- Target Audiens: ${campaign.target_audience}
- Lokasi Target: ${campaign.location}
- Jenis Kampanye: ${campaign.campaign_type}

DAFTAR INFLUENCER YANG TERSEDIA:
${influencerList}

INSTRUKSI:
1. Pilih 3-5 influencer terbaik yang cocok untuk kampanye ini
2. Berikan matchScore (0-100) untuk setiap influencer
3. Jelaskan alasan pemilihan (minimal 2 alasan)
4. Sarankan strategi konten spesifik
5. Berikan ringkasan kampanye dalam Bahasa Indonesia

KRITERIA PENILAIAN:
- Kesesuaian niche dengan jenis produk/layanan
- Kesesuaian lokasi dengan target pasar
- Budget yang tersedia vs harga influencer
- Engagement rate (lebih tinggi lebih baik)
- Relevansi audiens influencer dengan target kampanye

FORMAT OUTPUT (JSON):
{
  "recommendations": [
    {
      "influencerId": "ID influencer",
      "matchScore": 85,
      "reasons": ["Alasan 1", "Alasan 2"],
      "contentStrategy": "Strategi konten yang disarankan"
    }
  ],
  "summary": "Ringkasan analisis dan rekomendasi dalam Bahasa Indonesia"
}

Hanya kembalikan JSON, tanpa penjelasan tambahan.`;
};

interface JsonScanState {
  startIndex: number;
  depth: number;
  inString: boolean;
  isEscaped: boolean;
}

const updateStringState = (
  character: string,
  state: Pick<JsonScanState, "inString" | "isEscaped">
): void => {
  if (state.isEscaped) {
    state.isEscaped = false;
    return;
  }

  if (character === "\\") {
    state.isEscaped = true;
    return;
  }

  if (character === '"') {
    state.inString = !state.inString;
  }
};

const updateBraceState = (
  character: string,
  index: number,
  state: Pick<JsonScanState, "startIndex" | "depth">
): void => {
  if (character === "{") {
    if (state.startIndex === -1) {
      state.startIndex = index;
    }
    state.depth += 1;
    return;
  }

  if (character === "}" && state.depth > 0) {
    state.depth -= 1;
  }
};

const extractFirstJsonObject = (content: string): string => {
  const state: JsonScanState = {
    startIndex: -1,
    depth: 0,
    inString: false,
    isEscaped: false,
  };

  for (let index = 0; index < content.length; index++) {
    const character = content[index];
    updateStringState(character, state);

    if (!(state.inString || state.isEscaped)) {
      updateBraceState(character, index, state);
      if (state.depth === 0 && state.startIndex !== -1) {
        return content.slice(state.startIndex, index + 1);
      }
    }
  }

  throw new Error("Tidak dapat menemukan JSON dalam respons.");
};

const parseAiResponse = (content: string): AiRecommendationResult => {
  try {
    const parsed = JSON.parse(extractFirstJsonObject(content)) as unknown;

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("recommendations" in parsed) ||
      !("summary" in parsed)
    ) {
      throw new Error("Format respons AI tidak valid.");
    }

    const result = parsed as {
      recommendations: unknown[];
      summary: string;
    };

    if (!Array.isArray(result.recommendations)) {
      throw new Error("Recommendations harus berupa array.");
    }

    const validRecommendations: InfluencerMatch[] = [];

    for (const rec of result.recommendations) {
      if (
        typeof rec === "object" &&
        rec !== null &&
        "influencerId" in rec &&
        "matchScore" in rec &&
        "reasons" in rec &&
        "contentStrategy" in rec
      ) {
        const typedRec = rec as {
          influencerId: string;
          matchScore: number;
          reasons: string[];
          contentStrategy: string;
        };

        validRecommendations.push({
          influencerId: String(typedRec.influencerId),
          matchScore: Math.min(100, Math.max(0, Number(typedRec.matchScore))),
          reasons: Array.isArray(typedRec.reasons)
            ? typedRec.reasons.map(String)
            : [],
          contentStrategy: String(typedRec.contentStrategy),
        });
      }
    }

    return {
      recommendations: validRecommendations,
      summary: String(result.summary),
    };
  } catch (error) {
    throw new Error(
      `Gagal memparsing respons AI: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

const _generateRecommendations = async (
  campaign: CampaignPayload,
  influencers: Influencer[],
  openRouterClient: OpenRouterClient
): Promise<AiRecommendationResult> => {
  if (influencers.length === 0) {
    return {
      recommendations: [],
      summary:
        "Tidak ada influencer yang tersedia untuk kriteria kampanye ini.",
    };
  }

  const prompt = generateRecommendationPrompt(campaign, influencers);

  const { content } = await openRouterClient.complete(prompt, {
    temperature: 0.7,
    maxTokens: 2500,
  });

  return parseAiResponse(content);
};
