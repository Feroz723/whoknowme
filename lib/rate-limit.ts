/**
 * Upstash Redis-backed rate limiter.
 *
 * Production-ready — shares state across all serverless instances.
 * Falls back to a permissive no-op when env vars are missing (local dev).
 *
 * Requires env vars:
 *   UPSTASH_REDIS_URL
 *   UPSTASH_REDIS_TOKEN
 *
 * Create a free Redis database at https://console.upstash.com
 */

type RedisClient = {
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
};

let redis: RedisClient | null = null;

function getClient(): RedisClient | null {
  if (redis !== null) return redis;

  const url = process.env.UPSTASH_REDIS_URL;
  const token = process.env.UPSTASH_REDIS_TOKEN;

  if (!url || !token) {
    redis = null;
    return null;
  }

  redis = { incr, expire };

  async function incr(key: string): Promise<number> {
    const res = await fetch(`${url}/incr/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json() as { result: number };
    return body.result;
  }

  async function expire(key: string, seconds: number): Promise<number> {
    const res = await fetch(`${url}/expire/${key}/${seconds}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json() as { result: number };
    return body.result;
  }

  return redis;
}

export async function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): Promise<{ allowed: boolean; remaining: number }> {
  const client = getClient();

  // No-op fallback when Redis isn't configured (local dev).
  if (!client) {
    return { allowed: true, remaining: limit };
  }

  const windowKey = Math.floor(Date.now() / windowMs);
  const redisKey = `ratelimit:${key}:${windowKey}`;

  const count = await client.incr(redisKey);
  if (count === 1) {
    await client.expire(redisKey, Math.ceil(windowMs / 1000));
  }

  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}

export function clientIpFrom(headers: Headers): string {
  // Vercel sets x-forwarded-for; fall back to a constant for local dev.
  const forwarded = headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "127.0.0.1";
}
