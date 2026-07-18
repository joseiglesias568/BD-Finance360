// Simple in-memory rate limiter for API routes
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every 60 seconds
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((value, key) => {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    });
  }, 60_000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // ms until reset
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  record.count++;
  const remaining = Math.max(0, maxRequests - record.count);
  const resetIn = record.resetTime - now;

  return {
    allowed: record.count <= maxRequests,
    remaining,
    resetIn,
  };
}

export function getRateLimitHeaders(result: RateLimitResult, maxRequests: number): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(maxRequests),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
  };
}
