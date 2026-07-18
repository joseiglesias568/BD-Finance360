import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, getRateLimitHeaders, type RateLimitResult } from '@/lib/rate-limit';

describe('Rate Limiter', () => {
  // Use unique keys per test to avoid state leakage between tests
  let keyCounter = 0;
  const uniqueKey = () => `test-key-${Date.now()}-${++keyCounter}`;

  describe('checkRateLimit', () => {
    it('allows first request within a window', () => {
      const result = checkRateLimit(uniqueKey(), 10, 60_000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
    });

    it('decrements remaining count on subsequent requests', () => {
      const key = uniqueKey();
      checkRateLimit(key, 5, 60_000);
      const result = checkRateLimit(key, 5, 60_000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(3); // 5 - 2 = 3
    });

    it('denies requests beyond the max limit', () => {
      const key = uniqueKey();
      // Exhaust all allowed requests
      for (let i = 0; i < 3; i++) {
        checkRateLimit(key, 3, 60_000);
      }
      // This should be denied
      const result = checkRateLimit(key, 3, 60_000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('returns remaining as 0 when over limit', () => {
      const key = uniqueKey();
      for (let i = 0; i < 10; i++) {
        checkRateLimit(key, 2, 60_000);
      }
      const result = checkRateLimit(key, 2, 60_000);
      expect(result.remaining).toBe(0);
    });

    it('returns positive resetIn value', () => {
      const key = uniqueKey();
      const result = checkRateLimit(key, 10, 60_000);
      expect(result.resetIn).toBeGreaterThan(0);
      expect(result.resetIn).toBeLessThanOrEqual(60_000);
    });

    it('resets count after window expires', async () => {
      const key = uniqueKey();
      // Use a very short window (50ms)
      checkRateLimit(key, 1, 50);
      // First request consumed the budget
      const denied = checkRateLimit(key, 1, 50);
      expect(denied.allowed).toBe(false);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 60));

      const afterReset = checkRateLimit(key, 1, 50);
      expect(afterReset.allowed).toBe(true);
      expect(afterReset.remaining).toBe(0); // 1 - 1 = 0
    });

    it('tracks different keys independently', () => {
      const keyA = uniqueKey();
      const keyB = uniqueKey();

      // Exhaust key A
      checkRateLimit(keyA, 1, 60_000);
      const resultA = checkRateLimit(keyA, 1, 60_000);
      expect(resultA.allowed).toBe(false);

      // Key B should still be allowed
      const resultB = checkRateLimit(keyB, 1, 60_000);
      expect(resultB.allowed).toBe(true);
    });

    it('handles limit of 1 correctly', () => {
      const key = uniqueKey();
      const first = checkRateLimit(key, 1, 60_000);
      expect(first.allowed).toBe(true);
      expect(first.remaining).toBe(0);

      const second = checkRateLimit(key, 1, 60_000);
      expect(second.allowed).toBe(false);
      expect(second.remaining).toBe(0);
    });
  });

  describe('getRateLimitHeaders', () => {
    it('returns correct header names and values', () => {
      const result: RateLimitResult = { allowed: true, remaining: 7, resetIn: 30_000 };
      const headers = getRateLimitHeaders(result, 10);

      expect(headers['X-RateLimit-Limit']).toBe('10');
      expect(headers['X-RateLimit-Remaining']).toBe('7');
      expect(headers['X-RateLimit-Reset']).toBe('30'); // 30000ms / 1000 = 30s
    });

    it('rounds reset time up to nearest second', () => {
      const result: RateLimitResult = { allowed: true, remaining: 5, resetIn: 1500 };
      const headers = getRateLimitHeaders(result, 10);
      expect(headers['X-RateLimit-Reset']).toBe('2'); // ceil(1.5) = 2
    });

    it('returns string values for all headers', () => {
      const result: RateLimitResult = { allowed: false, remaining: 0, resetIn: 60_000 };
      const headers = getRateLimitHeaders(result, 60);

      for (const value of Object.values(headers)) {
        expect(typeof value).toBe('string');
      }
    });
  });
});
