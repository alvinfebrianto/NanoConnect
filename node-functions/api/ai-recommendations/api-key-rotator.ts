export interface ApiKeyRotator {
  getNextKey: () => string;
  markKeyFailed: (key: string) => void;
  getActiveKeyCount: () => number;
  hasAvailableKeys: () => boolean;
}

const ALL_KEYS_EXHAUSTED_ERROR =
  "Semua API key telah mencapai batas. Coba lagi nanti.";

export function createApiKeyRotator(keys: string[]): ApiKeyRotator {
  const allKeys = [...keys];
  const failedKeys = new Set<string>();
  const usedKeysThisCycle = new Set<string>();
  let currentIndex = 0;

  if (allKeys.length === 0) {
    throw new Error("Minimal satu API key diperlukan.");
  }

  const getAvailableKeys = (): string[] =>
    allKeys.filter((key) => !failedKeys.has(key));

  const getUnusedAvailableKeys = (): string[] =>
    getAvailableKeys().filter((key) => !usedKeysThisCycle.has(key));

  const resetAndGetFirstKey = (): string => {
    failedKeys.clear();
    usedKeysThisCycle.clear();
    const firstKey = allKeys.at(0);
    if (firstKey) {
      currentIndex = 1;
      usedKeysThisCycle.add(firstKey);
      return firstKey;
    }
    throw new Error(ALL_KEYS_EXHAUSTED_ERROR);
  };

  const findNextUsableKey = (): string | null => {
    const startIndex = currentIndex;
    let iterations = 0;

    while (iterations < allKeys.length) {
      const key = allKeys[currentIndex];
      currentIndex = (currentIndex + 1) % allKeys.length;
      iterations++;

      if (key && !failedKeys.has(key) && !usedKeysThisCycle.has(key)) {
        usedKeysThisCycle.add(key);
        return key;
      }
    }

    currentIndex = startIndex;
    return null;
  };

  const getNextKey = (): string => {
    const availableKeys = getAvailableKeys();

    if (availableKeys.length === 0) {
      if (allKeys.length === 1) {
        throw new Error(ALL_KEYS_EXHAUSTED_ERROR);
      }
      return resetAndGetFirstKey();
    }

    const unusedAvailableKeys = getUnusedAvailableKeys();

    if (unusedAvailableKeys.length === 0) {
      return resetAndGetFirstKey();
    }

    const foundKey = findNextUsableKey();
    if (foundKey) {
      return foundKey;
    }

    return resetAndGetFirstKey();
  };

  const markKeyFailed = (key: string): void => {
    failedKeys.add(key);
    usedKeysThisCycle.delete(key);
  };

  const getActiveKeyCount = (): number => getAvailableKeys().length;

  const hasAvailableKeys = (): boolean => getActiveKeyCount() > 0;

  return {
    getNextKey,
    markKeyFailed,
    getActiveKeyCount,
    hasAvailableKeys,
  };
}
