import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("ApiKeyRotator", () => {
  describe("round-robin rotation", () => {
    it("returns keys in round-robin order", async () => {
      const { createApiKeyRotator } = await import("./api-key-rotator");

      const rotator = createApiKeyRotator(["key-a", "key-b", "key-c"]);

      expect(rotator.getNextKey()).toBe("key-a");
      expect(rotator.getNextKey()).toBe("key-b");
      expect(rotator.getNextKey()).toBe("key-c");
      expect(rotator.getNextKey()).toBe("key-a");
    });

    it("works with single key", async () => {
      const { createApiKeyRotator } = await import("./api-key-rotator");

      const rotator = createApiKeyRotator(["only-key"]);

      expect(rotator.getNextKey()).toBe("only-key");
      expect(rotator.getNextKey()).toBe("only-key");
      expect(rotator.getNextKey()).toBe("only-key");
    });
  });

  describe("failure tracking", () => {
    it("skips failed keys on next rotation", async () => {
      const { createApiKeyRotator } = await import("./api-key-rotator");

      const rotator = createApiKeyRotator(["key-a", "key-b", "key-c"]);

      rotator.markKeyFailed("key-b");

      expect(rotator.getNextKey()).toBe("key-a");
      expect(rotator.getNextKey()).toBe("key-c");
      expect(rotator.getNextKey()).toBe("key-a");
    });

    it("restores previously failed key after all other keys are exhausted", async () => {
      const { createApiKeyRotator } = await import("./api-key-rotator");

      const rotator = createApiKeyRotator(["key-a", "key-b"]);

      rotator.markKeyFailed("key-a");

      expect(rotator.getNextKey()).toBe("key-b");
      expect(rotator.getNextKey()).toBe("key-a");
    });

    it("throws when all keys are exhausted", async () => {
      const { createApiKeyRotator } = await import("./api-key-rotator");

      const rotator = createApiKeyRotator(["key-a"]);

      rotator.markKeyFailed("key-a");

      expect(() => rotator.getNextKey()).toThrow(
        "Semua API key telah mencapai batas. Coba lagi nanti."
      );
    });
  });

  describe("status tracking", () => {
    it("reports active key count", async () => {
      const { createApiKeyRotator } = await import("./api-key-rotator");

      const rotator = createApiKeyRotator(["key-a", "key-b", "key-c"]);

      expect(rotator.getActiveKeyCount()).toBe(3);

      rotator.markKeyFailed("key-a");
      expect(rotator.getActiveKeyCount()).toBe(2);

      rotator.markKeyFailed("key-b");
      expect(rotator.getActiveKeyCount()).toBe(1);
    });

    it("can check if keys are available", async () => {
      const { createApiKeyRotator } = await import("./api-key-rotator");

      const rotator = createApiKeyRotator(["key-a"]);

      expect(rotator.hasAvailableKeys()).toBe(true);

      rotator.markKeyFailed("key-a");
      expect(rotator.hasAvailableKeys()).toBe(false);
    });
  });
});

describe("getAiConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("loads config from environment variables", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "key-1,key-2,key-3";
    process.env.AI_MODEL = "gemini-2.5-flash";

    const { getAiConfig } = await import("./ai-config");

    const config = getAiConfig();

    expect(config.apiKeys).toEqual(["key-1", "key-2", "key-3"]);
    expect(config.model).toBe("gemini-2.5-flash");
  });

  it("falls back to AI_API_KEYS when GOOGLE_GENERATIVE_AI_API_KEY is not set", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = undefined;
    process.env.AI_API_KEYS = "fallback-key-1,fallback-key-2";

    const { getAiConfig } = await import("./ai-config");

    const config = getAiConfig();

    expect(config.apiKeys).toEqual(["fallback-key-1", "fallback-key-2"]);
  });

  it("uses default model gemini-2.5-flash-lite when AI_MODEL is not set", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "key-1";
    process.env.AI_MODEL = undefined;

    const { getAiConfig } = await import("./ai-config");

    const config = getAiConfig();

    expect(config.model).toBe("gemini-2.5-flash-lite");
  });

  it("trims whitespace from keys", async () => {
    process.env.AI_API_KEYS = "  key-1  ,  key-2  ";

    const { getAiConfig } = await import("./ai-config");

    const config = getAiConfig();

    expect(config.apiKeys).toEqual(["key-1", "key-2"]);
  });

  it("filters empty keys", async () => {
    process.env.AI_API_KEYS = "key-1,,key-2,  ,key-3";

    const { getAiConfig } = await import("./ai-config");

    const config = getAiConfig();

    expect(config.apiKeys).toEqual(["key-1", "key-2", "key-3"]);
  });

  it("throws when no API keys are configured", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = undefined;
    process.env.AI_API_KEYS = undefined;

    const { getAiConfig } = await import("./ai-config");

    expect(() => getAiConfig()).toThrow("API key AI tidak dikonfigurasi");
  });
});
