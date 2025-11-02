import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize Redis if credentials are provided
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
  try {
    redis = new Redis({ 
      url: process.env.UPSTASH_REDIS_URL, 
      token: process.env.UPSTASH_REDIS_TOKEN 
    });
  } catch (error) {
    console.warn("Failed to initialize Redis for rate limiting:", error);
  }
}

// Create rate limiters only if Redis is available
const createRatelimit = (limiter: any) => {
  if (!redis) {
    // Return a mock rate limiter that always succeeds
    return {
      limit: async () => ({ success: true, limit: 10, remaining: 10, reset: Date.now() }),
    } as any;
  }
  return new Ratelimit({ redis, limiter });
};

export const postRatelimit = createRatelimit(Ratelimit.slidingWindow(10, "1 m"));
export const reportRatelimit = createRatelimit(Ratelimit.slidingWindow(5, "1 m"));
export const emailRateLimit = createRatelimit(Ratelimit.slidingWindow(1, "60 s"));

export async function limitOrThrow(key: string, rl: Ratelimit) {
  const { success, reset } = await rl.limit(key);
  if (!success) {
    const s = Math.ceil((reset - Date.now()) / 1000);
    const e = new Error(`Rate limit exceeded. Try again in ${s}s`);
    (e as any).status = 429;
    throw e;
  }
}
