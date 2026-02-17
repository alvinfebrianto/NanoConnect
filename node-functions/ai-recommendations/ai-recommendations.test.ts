import { describe, expect, it, vi } from "vitest";
import type { Influencer } from "../../src/types";
import type { AiRecommendationService } from "./ai-recommendation-service";
import {
  generateRecommendationPrompt,
  type InfluencerMatch,
} from "./ai-service";
import { createAiRecommendationsHandler } from "./index";

const baseUser = {
  id: "user-1",
  name: "Toko Rasa",
  email: "sme@example.com",
  password_hash: "managed_by_supabase",
  user_type: "sme" as const,
  avatar_url: null,
  bio: null,
  phone: null,
  email_verified: true,
  status: "active" as const,
  last_login_at: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const baseInfluencers: Influencer[] = [
  {
    id: "inf-1",
    user_id: "user-inf-1",
    followers_count: 150_000,
    engagement_rate: 4.5,
    niche: "Fashion & Lifestyle",
    price_per_post: 500_000,
    instagram_handle: "@fashionista_jkt",
    tiktok_handle: "@fashionista.tiktok",
    location: "Jakarta",
    languages: ["Indonesian", "English"],
    content_categories: ["Fashion", "Beauty", "Lifestyle"],
    is_available: true,
    avg_delivery_days: 5,
    portfolio_url: "https://example.com/portfolio1",
    verification_status: "verified",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user: {
      id: "user-inf-1",
      name: "Sarah Fashion",
      email: "sarah@example.com",
      user_type: "influencer",
      email_verified: true,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "inf-2",
    user_id: "user-inf-2",
    followers_count: 85_000,
    engagement_rate: 6.2,
    niche: "Technology",
    price_per_post: 350_000,
    instagram_handle: "@techreview_id",
    tiktok_handle: "@techreview.tiktok",
    location: "Bandung",
    languages: ["Indonesian"],
    content_categories: ["Technology", "Gaming", "Reviews"],
    is_available: true,
    avg_delivery_days: 3,
    portfolio_url: "https://example.com/portfolio2",
    verification_status: "verified",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user: {
      id: "user-inf-2",
      name: "Tech Reviewer",
      email: "tech@example.com",
      user_type: "influencer",
      email_verified: true,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "inf-3",
    user_id: "user-inf-3",
    followers_count: 250_000,
    engagement_rate: 3.8,
    niche: "Kuliner & Makanan",
    price_per_post: 750_000,
    instagram_handle: "@foodie_jakarta",
    tiktok_handle: "@foodie.tiktok",
    location: "Jakarta",
    languages: ["Indonesian"],
    content_categories: ["Food", "Restaurant Reviews", "Cooking"],
    is_available: true,
    avg_delivery_days: 7,
    portfolio_url: "https://example.com/portfolio3",
    verification_status: "verified",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user: {
      id: "user-inf-3",
      name: "Food Explorer",
      email: "food@example.com",
      user_type: "influencer",
      email_verified: true,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "inf-4",
    user_id: "user-inf-4",
    followers_count: 45_000,
    engagement_rate: 7.5,
    niche: "Kecantikan & Perawatan Kulit",
    price_per_post: 280_000,
    instagram_handle: "@skincare.enthusiast",
    tiktok_handle: "@skincare.tiktok",
    location: "Surabaya",
    languages: ["Indonesian"],
    content_categories: ["Skincare", "Beauty", "Product Reviews"],
    is_available: true,
    avg_delivery_days: 4,
    portfolio_url: "https://example.com/portfolio4",
    verification_status: "verified",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user: {
      id: "user-inf-4",
      name: "Beauty Blogger",
      email: "beauty@example.com",
      user_type: "influencer",
      email_verified: true,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  },
];

const campaignPayload = {
  niche: "Kuliner & Makanan",
  company_size: "1-5 orang",
  budget: 10_000_000,
  target_audience: "Ibu muda di Jakarta yang suka kuliner",
  location: "Jakarta",
  campaign_type: "Brand awareness",
};

const createRequest = (
  body: Record<string, unknown>,
  options?: {
    method?: string;
    authorization?: string | null;
    withBody?: boolean;
  }
) => {
  const method = options?.method ?? "POST";
  const authorization =
    options?.authorization === undefined
      ? "Bearer test-token"
      : options.authorization;
  const withBody = options?.withBody ?? true;

  const headers: HeadersInit = {};
  if (authorization) {
    headers.Authorization = authorization;
  }

  if (withBody) {
    headers["Content-Type"] = "application/json";
  }

  return new Request("https://example.com/ai-recommendations", {
    method,
    headers,
    body: withBody ? JSON.stringify(body) : undefined,
  });
};

const createMockAiService = (
  recommendations: Array<{
    influencerId: string;
    matchScore: number;
    reasons: string[];
    contentStrategy: string;
  }>,
  summary: string
): AiRecommendationService => ({
  generateRecommendations: vi.fn().mockResolvedValue({
    recommendations,
    summary,
  }),
});

const createDependencies = (overrides?: {
  getAuthUser?: () => Promise<{ id: string } | null>;
  getUserProfile?: () => Promise<typeof baseUser | null>;
  getAvailableInfluencers?: () => Promise<Influencer[]>;
  getAiService?: () => AiRecommendationService;
}) => ({
  getAuthUser: overrides?.getAuthUser ?? (async () => ({ id: baseUser.id })),
  getUserProfile: overrides?.getUserProfile ?? (async () => baseUser),
  getAvailableInfluencers:
    overrides?.getAvailableInfluencers ?? (async () => baseInfluencers),
  getAiService:
    overrides?.getAiService ??
    (() =>
      createMockAiService(
        [
          {
            influencerId: "inf-1",
            matchScore: 85,
            reasons: ["Niche cocok"],
            contentStrategy: "Review produk",
          },
        ],
        "Rekomendasi berhasil"
      )),
});

const createHandler = (overrides?: {
  getAuthUser?: () => Promise<{ id: string } | null>;
  getUserProfile?: () => Promise<typeof baseUser | null>;
  getAvailableInfluencers?: () => Promise<Influencer[]>;
  getAiService?: () => AiRecommendationService;
}) => createAiRecommendationsHandler(() => createDependencies(overrides));

describe("ai recommendations handler with OpenRouter integration", () => {
  describe("basic integration", () => {
    it("menerima brief SME dan mengembalikan rekomendasi AI dengan influencer yang cocok", async () => {
      const mockAiService = createMockAiService(
        [
          {
            influencerId: "inf-3",
            matchScore: 95,
            reasons: [
              "Spesialisasi kuliner cocok dengan niche kampanye",
              "Lokasi Jakarta sesuai target",
              "Budget sesuai dengan harga per post",
            ],
            contentStrategy: "Fokus pada review makanan lokal Jakarta",
          },
          {
            influencerId: "inf-1",
            matchScore: 72,
            reasons: [
              "High engagement rate meskipun niche berbeda",
              "Bisa menjangkau audiens lifestyle yang suka kuliner",
            ],
            contentStrategy: "Konten lifestyle dengan sentuhan kuliner",
          },
        ],
        "Kampanye brand awareness untuk UMKM kuliner di Jakarta akan paling efektif dengan influencer spesialis kuliner lokal."
      );

      const handler = createHandler({
        getAiService: () => mockAiService,
      });

      const response = await handler({
        request: createRequest(campaignPayload),
      });

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
        data: {
          recommendations: InfluencerMatch[];
          summary: string;
          user: { name: string };
        };
      };

      expect(data.data.user.name).toBe("Toko Rasa");
      expect(data.data.summary).toContain("Kampanye");
      expect(data.data.recommendations).toHaveLength(2);
      expect(data.data.recommendations[0].influencerId).toBe("inf-3");
      expect(data.data.recommendations[0].matchScore).toBe(95);
    });

    it("menangani error dari AI service dengan grace", async () => {
      const mockAiService: AiRecommendationService = {
        generateRecommendations: vi
          .fn()
          .mockRejectedValue(new Error("API Error")),
      };

      const handler = createHandler({
        getAiService: () => mockAiService,
      });

      const response = await handler({
        request: createRequest(campaignPayload),
      });

      expect(response.status).toBe(500);
      const data = (await response.json()) as { message: string };
      expect(data.message.toLowerCase()).toContain("gagal");
    });
  });

  describe("prompt generation", () => {
    it("menghasilkan prompt yang lengkap dengan data kampanye dan influencer", () => {
      const prompt = generateRecommendationPrompt(
        campaignPayload,
        baseInfluencers
      );

      expect(prompt).toContain(campaignPayload.niche);
      expect(prompt).toContain(campaignPayload.target_audience);
      expect(prompt).toContain(campaignPayload.location);
      expect(prompt).toContain("Food Explorer");
      expect(prompt).toContain("Sarah Fashion");
      expect(prompt).toContain("Rp 10.000.000");
      expect(prompt).toContain("JSON");
    });

    it("menyertakan instruksi khusus untuk menghitung match score", () => {
      const prompt = generateRecommendationPrompt(
        campaignPayload,
        baseInfluencers
      );

      expect(prompt).toContain("matchScore");
      expect(prompt).toContain("0-100");
      expect(prompt).toContain("reasons");
    });
  });

  describe("influencer matching", () => {
    it("mempertimbangkan lokasi influencer dalam rekomendasi", () => {
      const jakartaInfluencers = baseInfluencers.filter(
        (inf) => inf.location === "Jakarta"
      );

      expect(jakartaInfluencers).toHaveLength(2);
      expect(jakartaInfluencers.map((i) => i.id)).toContain("inf-1");
      expect(jakartaInfluencers.map((i) => i.id)).toContain("inf-3");
    });
  });

  describe("authentication dan authorization", () => {
    it("menolak metode selain POST", async () => {
      const handler = createHandler();

      const methods = ["GET", "PUT", "DELETE"] as const;
      for (const method of methods) {
        const response = await handler({
          request: createRequest(campaignPayload, {
            method,
            withBody: false,
          }),
        });
        const data = (await response.json()) as { message?: string };

        expect(response.status).toBe(405);
        expect(data.message).toBe("Metode tidak diizinkan.");
      }
    });

    it("menolak request tanpa bearer token", async () => {
      const handler = createHandler();

      const noHeaderResponse = await handler({
        request: createRequest(campaignPayload, { authorization: null }),
      });
      expect(noHeaderResponse.status).toBe(401);

      const invalidSchemeResponse = await handler({
        request: createRequest(campaignPayload, {
          authorization: "Token abc",
        }),
      });
      expect(invalidSchemeResponse.status).toBe(401);
    });

    it("menolak token tidak valid", async () => {
      const handler = createHandler({ getAuthUser: async () => null });

      const response = await handler({
        request: createRequest(campaignPayload),
      });
      const data = (await response.json()) as { message?: string };

      expect(response.status).toBe(401);
      expect(data.message).toBe("Autentikasi tidak valid.");
    });

    it("menolak akun non-SME", async () => {
      const handler = createHandler({
        getUserProfile: async () => ({
          ...baseUser,
          user_type: "influencer",
        }),
      });

      const response = await handler({
        request: createRequest(campaignPayload),
      });
      const data = (await response.json()) as { message?: string };

      expect(response.status).toBe(403);
      expect(data.message).toBe(
        "Hanya akun SME yang dapat meminta rekomendasi."
      );
    });
  });

  describe("payload validation", () => {
    const requiredFields = [
      "niche",
      "company_size",
      "budget",
      "target_audience",
      "location",
      "campaign_type",
    ] as const;

    for (const field of requiredFields) {
      it(`menolak payload tanpa field ${field}`, async () => {
        const handler = createHandler();
        const invalidPayload = { ...campaignPayload };
        delete invalidPayload[field];

        const response = await handler({
          request: createRequest(invalidPayload),
        });
        const data = (await response.json()) as { message?: string };

        expect(response.status).toBe(400);
        expect(data.message).toBe("Lengkapi seluruh data kampanye.");
      });
    }

    it("menolak tipe data field yang tidak valid", async () => {
      const handler = createHandler();
      const invalidCases: { body: Record<string, unknown>; message: string }[] =
        [
          {
            body: { ...campaignPayload, niche: 1 },
            message: "Niche tidak valid.",
          },
          {
            body: { ...campaignPayload, company_size: 123 },
            message: "Ukuran bisnis tidak valid.",
          },
          {
            body: { ...campaignPayload, target_audience: 123 },
            message: "Target audiens tidak valid.",
          },
          {
            body: { ...campaignPayload, location: 99 },
            message: "Lokasi tidak valid.",
          },
          {
            body: { ...campaignPayload, campaign_type: false },
            message: "Jenis kampanye tidak valid.",
          },
          {
            body: { ...campaignPayload, budget: "1000000" },
            message: "Budget harus berupa angka.",
          },
          {
            body: { ...campaignPayload, budget: 0 },
            message: "Budget harus lebih besar dari 0.",
          },
          {
            body: { ...campaignPayload, budget: -1 },
            message: "Budget harus lebih besar dari 0.",
          },
        ];

      for (const testCase of invalidCases) {
        const response = await handler({
          request: createRequest(testCase.body),
        });
        const data = (await response.json()) as { message?: string };

        expect(response.status).toBe(400);
        expect(data.message).toBe(testCase.message);
      }
    });
  });

  describe("recommendation structure", () => {
    it("mengembalikan struktur rekomendasi yang lengkap", async () => {
      const mockAiService = createMockAiService(
        [
          {
            influencerId: "inf-1",
            matchScore: 85,
            reasons: ["Reason 1", "Reason 2"],
            contentStrategy: "Strategy detail",
          },
        ],
        "Test summary"
      );

      const handler = createHandler({
        getAiService: () => mockAiService,
      });

      const response = await handler({
        request: createRequest(campaignPayload),
      });
      const data = (await response.json()) as {
        data: {
          recommendations: InfluencerMatch[];
          summary: string;
        };
      };

      expect(data.data.recommendations[0]).toHaveProperty("influencerId");
      expect(data.data.recommendations[0]).toHaveProperty("matchScore");
      expect(data.data.recommendations[0]).toHaveProperty("reasons");
      expect(data.data.recommendations[0]).toHaveProperty("contentStrategy");
    });

    it("menyertakan detail influencer lengkap dalam response", async () => {
      const mockAiService = createMockAiService(
        [
          {
            influencerId: "inf-3",
            matchScore: 90,
            reasons: ["Cocok"],
            contentStrategy: "Review makanan",
          },
        ],
        "Summary"
      );

      const handler = createHandler({
        getAiService: () => mockAiService,
      });

      const response = await handler({
        request: createRequest(campaignPayload),
      });
      const data = (await response.json()) as {
        data: {
          recommendations: (InfluencerMatch & { influencer: Influencer })[];
        };
      };

      const rec = data.data.recommendations[0];
      expect(rec.influencer).toBeDefined();
      expect(rec.influencer.user?.name).toBe("Food Explorer");
      expect(rec.influencer.niche).toBe("Kuliner & Makanan");
    });
  });
});

describe("OpenRouter client (legacy)", () => {
  it("membuat request dengan header yang benar", async () => {
    const { createOpenRouterClient } = await import("./ai-service");
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: "Test response",
              },
            },
          ],
          usage: { prompt_tokens: 100, completion_tokens: 50 },
        }),
    });

    global.fetch = mockFetch;

    const client = createOpenRouterClient({
      apiKey: "test-key",
      baseUrl: "https://api.test.com",
    });

    await client.complete("Test prompt");

    const requestPayload = JSON.parse(mockFetch.mock.calls[0][1].body) as {
      model: string;
    };

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.test.com/api/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
          "Content-Type": "application/json",
        }),
      })
    );
    expect(requestPayload.model).toBe("gpt-oss-20b");
  });

  it("menggunakan model OpenRouter yang disediakan", async () => {
    const { createOpenRouterClient } = await import("./ai-service");
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: "Test response",
              },
            },
          ],
          usage: { prompt_tokens: 100, completion_tokens: 50 },
        }),
    });

    global.fetch = mockFetch;

    const client = createOpenRouterClient({
      apiKey: "test-key",
      baseUrl: "https://api.test.com",
      model: "custom-model",
    });

    await client.complete("Test prompt");

    const requestPayload = JSON.parse(mockFetch.mock.calls[0][1].body) as {
      model: string;
    };

    expect(requestPayload.model).toBe("custom-model");
  });

  it("melempar error saat API mengembalikan error", async () => {
    const { createOpenRouterClient } = await import("./ai-service");
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
      json: () =>
        Promise.resolve({
          error: { message: "Rate limit exceeded" },
        }),
    });

    global.fetch = mockFetch;

    const client = createOpenRouterClient({
      apiKey: "test-key",
      baseUrl: "https://api.test.com",
    });

    await expect(client.complete("Test")).rejects.toThrow("Rate limit");
  });
});
