export interface AiConfig {
  apiKeys: string[];
  model: string;
}

const DEFAULT_MODEL = "openrouter/free";

function parseApiKeys(envValue: string | undefined): string[] {
  if (!envValue) {
    return [];
  }

  return envValue
    .split(",")
    .map((key) => key.trim())
    .filter((key) => key.length > 0);
}

export function getAiConfig(): AiConfig {
  const apiKeys = parseApiKeys(process.env.AI_API_KEYS);

  if (apiKeys.length === 0) {
    throw new Error(
      "API key AI tidak dikonfigurasi. Set AI_API_KEYS di environment variables."
    );
  }

  const model = process.env.AI_MODEL ?? DEFAULT_MODEL;

  return { apiKeys, model };
}
