export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

interface RateLimitBucket {
  timestamps: number[];
  windowMs: number;
}

export const createInMemoryRateLimiter = () => {
  const buckets = new Map<string, RateLimitBucket>();
  const CLEANUP_INTERVAL_MS = 60_000;
  let lastCleanupAt = Date.now();

  const cleanupStaleBuckets = (now: number) => {
    if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) {
      return;
    }

    for (const [key, bucket] of buckets.entries()) {
      const newestTimestamp = bucket.timestamps.at(-1);
      if (!newestTimestamp || newestTimestamp <= now - bucket.windowMs) {
        buckets.delete(key);
      }
    }

    lastCleanupAt = now;
  };

  const consume = (
    key: string,
    config: RateLimitConfig,
    now = Date.now()
  ): RateLimitResult => {
    cleanupStaleBuckets(now);

    const windowStart = now - config.windowMs;
    const existingBucket = buckets.get(key);
    const timestamps = (existingBucket?.timestamps ?? []).filter(
      (timestamp) => timestamp > windowStart
    );
    const windowMs = Math.max(existingBucket?.windowMs ?? 0, config.windowMs);

    if (timestamps.length >= config.maxRequests) {
      const oldest = timestamps[0] ?? now;
      const retryAfterMs = Math.max(1, oldest + config.windowMs - now);
      buckets.set(key, { timestamps, windowMs });

      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
        remaining: 0,
      };
    }

    timestamps.push(now);
    buckets.set(key, { timestamps, windowMs });

    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: Math.max(0, config.maxRequests - timestamps.length),
    };
  };

  return { consume };
};
