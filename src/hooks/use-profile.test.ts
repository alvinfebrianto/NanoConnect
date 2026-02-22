import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

describe("fetchProfile", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("calls /api/profile with bearer token", async () => {
    const { supabase } = await import("@/lib/supabase");
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { access_token: "test-token" } },
      error: null,
    } as never);

    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { user: { id: "u1", name: "Test" } } }),
    });

    const { fetchProfile } = await import("./use-profile");
    await fetchProfile();

    expect(fetchSpy).toHaveBeenCalledWith("/api/profile", {
      headers: { Authorization: "Bearer test-token" },
    });
  });

  it("returns null when no session exists", async () => {
    const { supabase } = await import("@/lib/supabase");
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    } as never);

    const { fetchProfile } = await import("./use-profile");
    const result = await fetchProfile();

    expect(result).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
