import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import { getActiveCompanyId, getCommentaryByDriver } from '@/lib/db/repositories';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ driverId: string }> }
) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = checkRateLimit(`commentary-driver:${ip}`, 60, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 60) }
    );
  }

  try {
    const { driverId } = await params;
    const { searchParams } = new URL(request.url);
    const includeChildren = searchParams.get('includeChildren') !== 'false';
    const companyId = await getActiveCompanyId();

    const items = await getCommentaryByDriver(companyId, Number(driverId), includeChildren);

    logger.info('commentary:by-driver', { driverId, count: items.length, includeChildren });
    return NextResponse.json({ commentary: items, count: items.length });
  } catch (err) {
    logger.error('commentary:by-driver:error', { error: String(err) });
    return NextResponse.json({ error: 'Failed to fetch driver commentary' }, { status: 500 });
  }
}
