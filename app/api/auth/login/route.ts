import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, getSessionCookieHeader, verifyPassword } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  // Rate limit: 10 login attempts per minute per IP
  const rateLimitResult = checkRateLimit(`login:${ip}`, 10, 60_000);
  if (!rateLimitResult.allowed) {
    logger.warn('Login rate limit exceeded', { ip });
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 10) }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      logger.info('Failed login attempt', { ip });
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await createSessionToken();
    logger.info('Successful login', { ip });

    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', getSessionCookieHeader(token));
    return response;
  } catch {
    logger.error('Login error', { ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
