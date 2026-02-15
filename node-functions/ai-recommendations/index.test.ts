import { describe, expect, it } from "vitest";
import { createAiRecommendationsHandler } from "./index";

const createRequest = (body: Record<string, unknown>) =>
  new Request("https://example.com/ai-recommendations", {
    method: "POST",
    headers: {
      Authorization: "Bearer test-token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

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

const payload = {
  niche: "Kuliner & Makanan",
  company_size: "1-5 orang",
  budget: 10_000_000,
  target_audience: "Ibu muda di Jakarta",
  location: "Jakarta",
  campaign_type: "Brand awareness",
};

describe("ai recommendations handler", () => {
  it("menerima brief SME dan mengembalikan ringkasan", async () => {
    const handler = createAiRecommendationsHandler(() => ({
      getAuthUser: async () => ({ id: baseUser.id }),
      getUserProfile: async () => baseUser,
    }));

    const response = await handler({ request: createRequest(payload) });

    expect(response.status).toBe(200);
    const data = (await response.json()) as {
      data: { summary: string; user: { name: string } };
    };
    expect(data.data.user.name).toBe("Toko Rasa");
    expect(data.data.summary).toContain("Kuliner & Makanan");
    expect(data.data.summary).toContain("Rp 10.000.000");
  });

  it("menolak akun non-SME", async () => {
    const handler = createAiRecommendationsHandler(() => ({
      getAuthUser: async () => ({ id: baseUser.id }),
      getUserProfile: async () => ({ ...baseUser, user_type: "influencer" }),
    }));

    const response = await handler({ request: createRequest(payload) });
    const data = (await response.json()) as { message?: string };

    expect(response.status).toBe(403);
    expect(data.message).toBe("Hanya akun SME yang dapat meminta rekomendasi.");
  });
});
