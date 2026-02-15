import { describe, expect, it } from "vitest";
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

const payload = {
  niche: "Kuliner & Makanan",
  company_size: "1-5 orang",
  budget: 10_000_000,
  target_audience: "Ibu muda di Jakarta",
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

const createDependencies = (overrides?: {
  getAuthUser?: () => Promise<{ id: string } | null>;
  getUserProfile?: () => Promise<typeof baseUser | null>;
}) => ({
  getAuthUser: overrides?.getAuthUser ?? (async () => ({ id: baseUser.id })),
  getUserProfile: overrides?.getUserProfile ?? (async () => baseUser),
});

const createHandler = (overrides?: {
  getAuthUser?: () => Promise<{ id: string } | null>;
  getUserProfile?: () => Promise<typeof baseUser | null>;
}) => createAiRecommendationsHandler(() => createDependencies(overrides));

const payloadWithout = (field: keyof typeof payload) => {
  const clone = { ...payload };
  delete clone[field];
  return clone;
};

describe("ai recommendations handler", () => {
  it("menerima brief SME dan mengembalikan ringkasan", async () => {
    const handler = createHandler();

    const response = await handler({ request: createRequest(payload) });

    expect(response.status).toBe(200);
    const data = (await response.json()) as {
      data: { summary: string; user: { name: string } };
    };
    expect(data.data.user.name).toBe("Toko Rasa");
    expect(data.data.summary).toContain("Kuliner & Makanan");
    expect(data.data.summary).toContain("Rp 10.000.000");
  });

  it("menolak metode selain POST", async () => {
    const handler = createHandler({
      getAuthUser: () => {
        throw new Error("Tidak boleh dipanggil untuk metode non-POST");
      },
    });

    const methods = ["GET", "PUT", "DELETE"] as const;
    for (const method of methods) {
      const response = await handler({
        request: createRequest(payload, { method, withBody: false }),
      });
      const data = (await response.json()) as { message?: string };

      expect(response.status).toBe(405);
      expect(data.message).toBe("Metode tidak diizinkan.");
    }
  });

  it("menolak request tanpa bearer token", async () => {
    const handler = createHandler();

    const noHeaderResponse = await handler({
      request: createRequest(payload, { authorization: null }),
    });
    expect(noHeaderResponse.status).toBe(401);

    const invalidSchemeResponse = await handler({
      request: createRequest(payload, { authorization: "Token abc" }),
    });
    expect(invalidSchemeResponse.status).toBe(401);
  });

  it("menolak token tidak valid", async () => {
    const handler = createHandler({ getAuthUser: async () => null });

    const response = await handler({ request: createRequest(payload) });
    const data = (await response.json()) as { message?: string };

    expect(response.status).toBe(401);
    expect(data.message).toBe("Autentikasi tidak valid.");
  });

  it("mengembalikan 404 jika profil pengguna tidak ditemukan", async () => {
    const handler = createHandler({ getUserProfile: async () => null });

    const response = await handler({ request: createRequest(payload) });
    const data = (await response.json()) as { message?: string };

    expect(response.status).toBe(404);
    expect(data.message).toBe("Profil pengguna tidak ditemukan.");
  });

  it("menolak akun non-SME", async () => {
    const handler = createHandler({
      getUserProfile: async () => ({ ...baseUser, user_type: "influencer" }),
    });

    const response = await handler({ request: createRequest(payload) });
    const data = (await response.json()) as { message?: string };

    expect(response.status).toBe(403);
    expect(data.message).toBe("Hanya akun SME yang dapat meminta rekomendasi.");
  });

  it("menolak payload yang kehilangan field wajib", async () => {
    const requiredFields = [
      "niche",
      "company_size",
      "budget",
      "target_audience",
      "location",
      "campaign_type",
    ] as const;

    const handler = createHandler();

    for (const field of requiredFields) {
      const response = await handler({
        request: createRequest(payloadWithout(field)),
      });
      const data = (await response.json()) as { message?: string };

      expect(response.status).toBe(400);
      expect(data.message).toBe("Lengkapi seluruh data kampanye.");
    }
  });

  it("menolak tipe data field yang tidak valid", async () => {
    const invalidCases: { body: Record<string, unknown>; message: string }[] = [
      { body: { ...payload, niche: 1 }, message: "Niche tidak valid." },
      {
        body: { ...payload, company_size: 123 },
        message: "Ukuran bisnis tidak valid.",
      },
      {
        body: { ...payload, target_audience: 123 },
        message: "Target audiens tidak valid.",
      },
      { body: { ...payload, location: 99 }, message: "Lokasi tidak valid." },
      {
        body: { ...payload, campaign_type: false },
        message: "Jenis kampanye tidak valid.",
      },
      {
        body: { ...payload, budget: "1000000" },
        message: "Budget harus berupa angka.",
      },
      {
        body: { ...payload, budget: 0 },
        message: "Budget harus lebih besar dari 0.",
      },
      {
        body: { ...payload, budget: -1 },
        message: "Budget harus lebih besar dari 0.",
      },
    ];

    const handler = createHandler();
    for (const testCase of invalidCases) {
      const response = await handler({ request: createRequest(testCase.body) });
      const data = (await response.json()) as { message?: string };

      expect(response.status).toBe(400);
      expect(data.message).toBe(testCase.message);
    }
  });
});
