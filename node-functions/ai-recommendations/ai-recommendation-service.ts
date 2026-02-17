import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, Output } from "ai";
import type { Influencer } from "../../src/types";
import type { AiConfig } from "./ai-config";
import {
  type RecommendationOutput,
  recommendationSchema,
} from "./ai-recommendation-schema";
import { type ApiKeyRotator, createApiKeyRotator } from "./api-key-rotator";

export interface AiRecommendationService {
  generateRecommendations: (
    campaign: CampaignPayload,
    influencers: Influencer[]
  ) => Promise<RecommendationOutput>;
}

export interface CampaignPayload {
  niche: string;
  company_size: string;
  budget: number;
  target_audience: string;
  location: string;
  campaign_type: string;
}

export type GenerateTextFn = (options: {
  model: unknown;
  system: string;
  prompt: string;
  output: unknown;
}) => Promise<{ output: RecommendationOutput }>;

export interface AiServiceDependencies {
  generateText: GenerateTextFn;
  createProvider: (apiKey: string) => { model: (id: string) => unknown };
}

function buildSystemPrompt(): string {
  return `Kamu adalah AI Marketing Expert untuk platform NanoConnect yang menghubungkan UMKM (SME) dengan nano-influencer di Indonesia.

TUGAS: Analisis kebutuhan kampanye dan berikan rekomendasi influencer yang paling cocok.

KRITERIA PENILAIAN:
- Kesesuaian niche dengan jenis produk/layanan
- Kesesuaian lokasi dengan target pasar
- Budget yang tersedia vs harga influencer
- Engagement rate (lebih tinggi lebih baik)
- Relevansi audiens influencer dengan target kampanye

INSTRUKSI:
1. Pilih 3-5 influencer terbaik yang cocok untuk kampanye ini
2. Berikan matchScore (0-100) untuk setiap influencer
3. Jelaskan alasan pemilihan (minimal 1 alasan)
4. Sarankan strategi konten spesifik
5. Berikan ringkasan kampanye dalam Bahasa Indonesia`;
}

function buildInfluencerList(influencers: Influencer[]): string {
  return influencers
    .map((inf, index) => {
      const userName = inf.user?.name ?? "Unknown";
      return `${index + 1}. ${userName}
   - ID: ${inf.id}
   - Niche: ${inf.niche}
   - Lokasi: ${inf.location}
   - Followers: ${inf.followers_count.toLocaleString("id-ID")}
   - Engagement Rate: ${inf.engagement_rate}%
   - Harga per Post: Rp ${inf.price_per_post.toLocaleString("id-ID")}
   - Kategori Konten: ${inf.content_categories?.join(", ") ?? "N/A"}
   - Bahasa: ${inf.languages?.join(", ") ?? "N/A"}
   - Tersedia: ${inf.is_available ? "Ya" : "Tidak"}`;
    })
    .join("\n\n");
}

function buildUserPrompt(
  campaign: CampaignPayload,
  influencers: Influencer[]
): string {
  return `DATA KAMPANYE:
- Niche/Industri: ${campaign.niche}
- Ukuran Perusahaan: ${campaign.company_size}
- Budget Total: Rp ${campaign.budget.toLocaleString("id-ID")}
- Target Audiens: ${campaign.target_audience}
- Lokasi Target: ${campaign.location}
- Jenis Kampanye: ${campaign.campaign_type}

DAFTAR INFLUENCER YANG TERSEDIA:
${buildInfluencerList(influencers)}

Pilih influencer terbaik untuk kampanye ini.`;
}

function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const httpError = error as unknown as Record<string, unknown>;
    if (httpError.status === 429) {
      return true;
    }
    if (error.message.toLowerCase().includes("rate limit")) {
      return true;
    }
    if (error.message.toLowerCase().includes("too many requests")) {
      return true;
    }
  }
  return false;
}

const RATE_LIMIT_ERROR_MSG =
  "Semua API key telah mencapai batas rate limit. Silakan coba lagi nanti.";

const defaultDependencies: AiServiceDependencies = {
  generateText: (options) =>
    generateText(options as Parameters<typeof generateText>[0]) as Promise<{
      output: RecommendationOutput;
    }>,
  createProvider: (apiKey: string) => {
    const openrouter = createOpenRouter({ apiKey });
    return { model: (id: string) => openrouter(id) };
  },
};

export function createAiRecommendationService(
  config: AiConfig,
  dependencies: AiServiceDependencies = defaultDependencies
): AiRecommendationService {
  const keyRotator: ApiKeyRotator = createApiKeyRotator(config.apiKeys);

  const attemptGeneration = async (
    campaign: CampaignPayload,
    influencers: Influencer[]
  ): Promise<RecommendationOutput> => {
    const currentKey = keyRotator.getNextKey();

    try {
      const provider = dependencies.createProvider(currentKey);
      const model = provider.model(config.model);

      const result = await dependencies.generateText({
        model,
        system: buildSystemPrompt(),
        prompt: buildUserPrompt(campaign, influencers),
        output: Output.object({ schema: recommendationSchema }),
      });

      return result.output;
    } catch (error) {
      if (isRateLimitError(error)) {
        keyRotator.markKeyFailed(currentKey);
        if (!keyRotator.hasAvailableKeys()) {
          throw new Error(RATE_LIMIT_ERROR_MSG);
        }
      }
      throw error;
    }
  };

  const generateWithRetry = async (
    campaign: CampaignPayload,
    influencers: Influencer[],
    maxRetries?: number
  ): Promise<RecommendationOutput> => {
    const retries = maxRetries ?? config.apiKeys.length;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await attemptGeneration(campaign, influencers);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (!isRateLimitError(error)) {
          throw error;
        }
      }
    }

    if (lastError && isRateLimitError(lastError)) {
      throw new Error(RATE_LIMIT_ERROR_MSG);
    }
    throw new Error("Gagal membuat rekomendasi setelah mencoba semua API key.");
  };

  const generateRecommendations = (
    campaign: CampaignPayload,
    influencers: Influencer[]
  ): Promise<RecommendationOutput> => {
    if (influencers.length === 0) {
      return Promise.resolve({
        recommendations: [],
        summary:
          "Tidak ada influencer yang tersedia untuk kriteria kampanye ini.",
      });
    }
    return generateWithRetry(campaign, influencers);
  };

  return { generateRecommendations };
}
