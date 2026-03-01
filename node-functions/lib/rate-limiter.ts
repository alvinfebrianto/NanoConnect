export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

export const createInMemoryRateLimiter = () => {
  const buckets = new Map<string, number[]>();

  const consume = (
    key: string,
    config: RateLimitConfig,
    now = Date.now()
  ): RateLimitResult => {
    const windowStart = now - config.windowMs;
    const timestamps = (buckets.get(key) ?? []).filter(
      (timestamp) => timestamp > windowStart
    );

    if (timestamps.length >= config.maxRequests) {
      const oldest = timestamps[0] ?? now;
      const retryAfterMs = Math.max(1, oldest + config.windowMs - now);
      buckets.set(key, timestamps);

      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
        remaining: 0,
      };
    }

    timestamps.push(now);
    buckets.set(key, timestamps);

    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: Math.max(0, config.maxRequests - timestamps.length),
    };
  };

  return { consume };
};
