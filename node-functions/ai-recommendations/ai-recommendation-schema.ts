import { z } from "zod";

const influencerMatchSchema = z.object({
  influencerId: z.string().min(1, "Influencer ID diperlukan"),
  matchScore: z.number().int().min(0).max(100),
  reasons: z.array(z.string().min(1)).min(1, "Minimal satu alasan diperlukan"),
  contentStrategy: z.string().min(1, "Strategi konten diperlukan"),
});

export const recommendationSchema = z.object({
  recommendations: z.array(influencerMatchSchema).min(1),
  summary: z.string().min(1, "Ringkasan diperlukan"),
});

export type RecommendationOutput = z.infer<typeof recommendationSchema>;

export const influencerMatchOutputSchema = influencerMatchSchema;
export type InfluencerMatchOutput = z.infer<typeof influencerMatchOutputSchema>;
