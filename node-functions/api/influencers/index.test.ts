import { describe, expect, it } from "vitest";
import type { Influencer } from "../../../src/types";
import { createInfluencersHandler } from "./index";

const createContext = (url: string) => ({
  request: new Request(url, { method: "GET" }),
});

describe("influencers node function", () => {
  it("menolak permintaan tanpa id", async () => {
    const handler = createInfluencersHandler(() => ({
      getInfluencer: async () => null,
    }));

    const response = await handler(createContext("https://example.com/api/in"));
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(400);
    expect(payload.message).toBe("ID influencer wajib diisi.");
  });

  it("mengembalikan 404 saat influencer tidak ditemukan", async () => {
    const handler = createInfluencersHandler(() => ({
      getInfluencer: async () => null,
    }));

    const response = await handler(
      createContext("https://example.com/api/in?id=inf-1")
    );
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(404);
    expect(payload.message).toBe("Influencer tidak ditemukan.");
  });

  it("hanya mengembalikan profil publik influencer", async () => {
    const handler = createInfluencersHandler(() => ({
      getInfluencer: async () =>
        ({
          id: "inf-1",
          user_id: "user-1",
          followers_count: 12_000,
          engagement_rate: 4.2,
          niche: "Kuliner & Makanan",
          price_per_post: 300_000,
          location: "Jakarta",
          languages: ["Indonesian"],
          content_categories: ["Food"],
          is_available: true,
          avg_delivery_days: 5,
          verification_status: "verified",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
          user: {
            id: "user-1",
            name: "Food Creator",
            email: "food@example.com",
            avatar_url: "https://example.com/food.jpg",
            bio: "Food reviewer",
            phone: "+6281234567890",
            password_hash: "secret-hash",
          },
        }) as unknown as Influencer,
    }));

    const response = await handler(
      createContext("https://example.com/api/in?id=inf-1")
    );
    const payload = (await response.json()) as {
      data: { user?: Record<string, unknown> };
    };

    expect(response.status).toBe(200);
    expect(payload.data.user).toEqual({
      id: "user-1",
      name: "Food Creator",
      avatar_url: "https://example.com/food.jpg",
      bio: "Food reviewer",
    });
    expect(payload.data.user).not.toHaveProperty("email");
    expect(payload.data.user).not.toHaveProperty("password_hash");
  });
});
