import { describe, expect, it } from "vitest";
import { createReviewsHandler } from "./index";

const createContext = (request: Request) => ({ request });

describe("reviews node function", () => {
  it("menolak metode selain GET", async () => {
    const handler = createReviewsHandler(() => ({
      getReviewsByInfluencer: async () => [],
    }));

    const response = await handler(
      createContext(
        new Request("https://example.com/api/reviews", {
          method: "POST",
        })
      )
    );
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(405);
    expect(payload.message).toBe("Metode tidak diizinkan.");
  });

  it("menolak permintaan tanpa influencer_id", async () => {
    const handler = createReviewsHandler(() => ({
      getReviewsByInfluencer: async () => [],
    }));

    const response = await handler(
      createContext(new Request("https://example.com/api/reviews"))
    );
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(400);
    expect(payload.message).toBe("ID influencer wajib diisi.");
  });

  it("mengembalikan ulasan influencer", async () => {
    const handler = createReviewsHandler(() => ({
      getReviewsByInfluencer: async () =>
        [
          {
            id: "rev-1",
            order_id: "ord-1",
            rating: 5,
            comment: "Bagus",
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
        ] as never,
    }));

    const response = await handler(
      createContext(
        new Request("https://example.com/api/reviews?influencer_id=inf-1")
      )
    );
    const payload = (await response.json()) as { data: Array<{ id: string }> };

    expect(response.status).toBe(200);
    expect(payload.data).toHaveLength(1);
    expect(payload.data[0].id).toBe("rev-1");
  });
});
