import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'session';
const SESSION_MAX_AGE = 86400; // 24 hours

function getSecret(): string {
  const secret = process.env.APP_SECRET || 'dev-secret-change-in-production';
  return secret;
}

async function hmacSign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const bytes = new Uint8Array(signature);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function hmacVerify(payload: string, signature: string): Promise<boolean> {
  const expected = await hmacSign(payload);
  // Constant-time comparison
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionToken(): Promise<string> {
  const payload = JSON.stringify({
    authenticated: true,
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const signature = await hmacSign(payload);
  const encoded = btoa(payload);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return false;

    const payload = atob(encoded);
    const valid = await hmacVerify(payload, signature);
    if (!valid) return false;

    const data = JSON.parse(payload);
    if (!data.authenticated) return false;
    if (data.exp < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

export async function validateSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function getSessionCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly;${secure} SameSite=Strict; Max-Age=${SESSION_MAX_AGE}`;
}

export function getClearSessionCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    console.error('APP_PASSWORD environment variable is not set');
    return false;
  }
  if (password.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export { COOKIE_NAME, SESSION_MAX_AGE };
