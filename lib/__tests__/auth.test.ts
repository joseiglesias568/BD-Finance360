import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createSessionToken,
  verifySessionToken,
  verifyPassword,
} from '@/lib/auth';

describe('Auth Module', () => {
  beforeEach(() => {
    // Reset env vars to defaults before each test
    delete process.env.APP_PASSWORD;
    delete process.env.APP_SECRET;
  });

  describe('createSessionToken', () => {
    it('returns a valid token string', async () => {
      const token = await createSessionToken();

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      // Token should have the format: base64payload.base64signature
      const parts = token.split('.');
      expect(parts).toHaveLength(2);
      expect(parts[0].length).toBeGreaterThan(0);
      expect(parts[1].length).toBeGreaterThan(0);

      // First part should be valid base64 that decodes to JSON
      const payload = JSON.parse(atob(parts[0]));
      expect(payload).toHaveProperty('authenticated', true);
      expect(payload).toHaveProperty('iat');
      expect(payload).toHaveProperty('exp');
      expect(typeof payload.iat).toBe('number');
      expect(typeof payload.exp).toBe('number');
      expect(payload.exp).toBeGreaterThan(payload.iat);
    });
  });

  describe('verifySessionToken', () => {
    it('returns true for valid tokens', async () => {
      const token = await createSessionToken();
      const result = await verifySessionToken(token);

      expect(result).toBe(true);
    });

    it('returns false for tampered tokens (modified payload)', async () => {
      const token = await createSessionToken();
      const [encoded, signature] = token.split('.');

      // Decode, tamper, re-encode the payload
      const payload = JSON.parse(atob(encoded));
      payload.authenticated = false;
      const tamperedEncoded = btoa(JSON.stringify(payload));
      const tamperedToken = `${tamperedEncoded}.${signature}`;

      const result = await verifySessionToken(tamperedToken);
      expect(result).toBe(false);
    });

    it('returns false for tampered tokens (modified signature)', async () => {
      const token = await createSessionToken();
      const [encoded] = token.split('.');

      // Replace the signature with garbage
      const tamperedToken = `${encoded}.aW52YWxpZHNpZ25hdHVyZQ==`;

      const result = await verifySessionToken(tamperedToken);
      expect(result).toBe(false);
    });

    it('returns false for expired tokens', async () => {
      // Mock Date.now to create a token that appears to be from the past
      const realDateNow = Date.now;
      const pastTime = Date.now() - 200_000_000; // ~2.3 days ago

      // Create a token as if it were created in the past (already expired)
      Date.now = vi.fn(() => pastTime);
      const token = await createSessionToken();

      // Restore Date.now for verification (the exp will be in the past)
      Date.now = realDateNow;

      const result = await verifySessionToken(token);
      expect(result).toBe(false);
    });

    it('returns false for malformed tokens (no dot separator)', async () => {
      const result = await verifySessionToken('invalidtoken');
      expect(result).toBe(false);
    });

    it('returns false for empty string', async () => {
      const result = await verifySessionToken('');
      expect(result).toBe(false);
    });
  });

  describe('verifyPassword', () => {
    it('returns true for the correct default password', () => {
      const result = verifyPassword('Seethefuture');
      expect(result).toBe(true);
    });

    it('returns false for an incorrect password', () => {
      const result = verifyPassword('wrongpassword');
      expect(result).toBe(false);
    });

    it('returns false for an empty password', () => {
      const result = verifyPassword('');
      expect(result).toBe(false);
    });

    it('returns false for a password that is a substring of the correct one', () => {
      const result = verifyPassword('Seethe');
      expect(result).toBe(false);
    });

    it('returns false for a password that is the correct one with extra chars', () => {
      const result = verifyPassword('Seethefuture!');
      expect(result).toBe(false);
    });

    it('is case-sensitive', () => {
      const result = verifyPassword('seethefuture');
      expect(result).toBe(false);
    });

    it('uses APP_PASSWORD env var when set', () => {
      process.env.APP_PASSWORD = 'CustomPass123';

      expect(verifyPassword('CustomPass123')).toBe(true);
      expect(verifyPassword('Seethefuture')).toBe(false);
    });
  });
});
