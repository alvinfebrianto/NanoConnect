import { describe, expect, it } from "vitest";
import { createInfluencersHandler } from "../index";

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
});
