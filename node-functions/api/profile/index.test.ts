import { describe, expect, it, vi } from "vitest";
import { createProfileHandler } from "./index";

vi.mock("../../lib/supabase-client", () => ({
  createSupabaseClient: vi.fn(),
}));

const createContext = (request: Request) => ({ request });

const createAuthenticatedRequest = (options?: {
  method?: string;
  body?: Record<string, unknown>;
}) =>
  new Request("https://example.com/api/profile", {
    method: options?.method ?? "GET",
    headers: {
      Authorization: "Bearer token",
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

const setAuthUser = async (userId: string | null) => {
  const { createSupabaseClient } = await import("../../lib/supabase-client");
  vi.mocked(createSupabaseClient).mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userId ? { id: userId } : null },
        error: null,
      }),
    },
  } as never);
};

describe("profile node function", () => {
  it("menolak permintaan tanpa token", async () => {
    const handler = createProfileHandler(() => ({
      getUser: async () => null,
      getInfluencerProfile: async () => null,
      updateUser: async () => undefined,
    }));

    const response = await handler(
      createContext(new Request("https://example.com/api/profile"))
    );
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(401);
    expect(payload.message).toBe("Autentikasi diperlukan.");
  });

  it("mengembalikan 404 ketika profil pengguna tidak ditemukan", async () => {
    await setAuthUser("user-1");

    const handler = createProfileHandler(() => ({
      getUser: async () => null,
      getInfluencerProfile: async () => null,
      updateUser: async () => undefined,
    }));

    const response = await handler(createContext(createAuthenticatedRequest()));
    const payload = (await response.json()) as { message: string };

    expect(response.status).toBe(404);
    expect(payload.message).toBe("Pengguna tidak ditemukan.");
  });

  it("menyembunyikan field sensitif saat mengembalikan profil", async () => {
    await setAuthUser("user-1");

    const handler = createProfileHandler(() => ({
      getUser: async () =>
        ({
          id: "user-1",
          name: "Toko Nusantara",
          email: "owner@example.com",
          password_hash: "secret-hash",
          user_type: "sme",
          avatar_url: null,
          bio: "Pemilik UMKM",
          phone: "+6281234567890",
          email_verified: true,
          status: "active",
          last_login_at: null,
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        }) as never,
      getInfluencerProfile: async () => null,
      updateUser: async () => undefined,
    }));

    const response = await handler(createContext(createAuthenticatedRequest()));
    const payload = (await response.json()) as {
      data: { user: Record<string, unknown> };
    };

    expect(response.status).toBe(200);
    expect(payload.data.user).toEqual({
      id: "user-1",
      name: "Toko Nusantara",
      email: "owner@example.com",
      user_type: "sme",
      avatar_url: null,
      bio: "Pemilik UMKM",
      phone: "+6281234567890",
      email_verified: true,
      status: "active",
      last_login_at: null,
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z",
    });
    expect(payload.data.user).not.toHaveProperty("password_hash");
  });
});
