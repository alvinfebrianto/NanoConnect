import { describe, expect, it } from "vitest";
import { createInMemoryRateLimiter } from "./rate-limiter";

describe("createInMemoryRateLimiter", () => {
  it("membatasi request sesuai window dan maxRequests", () => {
    const limiter = createInMemoryRateLimiter();
    const config = { windowMs: 60_000, maxRequests: 2 };
    const now = Date.now();

    const first = limiter.consume("user-1", config, now);
    const second = limiter.consume("user-1", config, now + 1000);
    const third = limiter.consume("user-1", config, now + 2000);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it("membersihkan bucket lama agar key tidak tersimpan selamanya", () => {
    const limiter = createInMemoryRateLimiter();
    const longWindowConfig = { windowMs: 24 * 60 * 60 * 1000, maxRequests: 1 };
    const now = Date.now();

    const first = limiter.consume("stale-key", longWindowConfig, now);
    const cleanupTrigger = limiter.consume(
      "cleanup-key",
      { windowMs: 60_000, maxRequests: 10 },
      now + 24 * 60 * 60 * 1000 + 60_001
    );
    const afterCleanup = limiter.consume(
      "stale-key",
      longWindowConfig,
      now + 24 * 60 * 60 * 1000 + 60_002
    );

    expect(first.allowed).toBe(true);
    expect(cleanupTrigger.allowed).toBe(true);
    expect(afterCleanup.allowed).toBe(true);
  });
});
