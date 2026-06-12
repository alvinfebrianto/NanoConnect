export interface AiConfig {
  apiKeys: string[];
  model: string;
}

const DEFAULT_MODEL = "gemini-2.5-flash-lite";

function parseApiKeys(envValue: string | undefined): string[] {
  if (!envValue) {
    return [];
  }

  return envValue
    .split(",")
    .map((key) => key.trim())
    .filter((key) => key.length > 0);
}

function resolveApiKeysFromEnv(): string[] {
  const supportedKeySources = [
    process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    process.env.AI_API_KEYS,
  ];

  for (const envValue of supportedKeySources) {
    const parsedKeys = parseApiKeys(envValue);
    if (parsedKeys.length > 0) {
      return parsedKeys;
    }
  }

  return [];
}

export function getAiConfig(): AiConfig {
  const apiKeys = resolveApiKeysFromEnv();

  if (apiKeys.length === 0) {
    throw new Error(
      "API key AI tidak dikonfigurasi. Set GOOGLE_GENERATIVE_AI_API_KEY di environment variables."
    );
  }

  const model = process.env.AI_MODEL ?? DEFAULT_MODEL;

  return { apiKeys, model };
}
