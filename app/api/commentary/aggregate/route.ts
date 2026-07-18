import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { aggregateCommentary } from '@/lib/engines/commentary-aggregation-engine';

export async function POST(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = checkRateLimit(`commentary-aggregate:${ip}`, 10, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 10) }
    );
  }

  try {
    const body = await request.json();
    const { driverId, aggregationLevel, fiscalPeriod } = body;

    if (!driverId) {
      return NextResponse.json({ error: 'driverId is required' }, { status: 400 });
    }

    const result = await aggregateCommentary(Number(driverId), {
      aggregationLevel,
      fiscalPeriod,
    });

    logger.info('commentary:aggregate', {
      driverId,
      level: aggregationLevel,
      sourceCount: result.sourceCount,
    });

    return NextResponse.json({
      aggregation: result.commentary,
      sourceCount: result.sourceCount,
      driverName: result.driverName,
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('commentary:aggregate:error', { error: message });

    if (message.includes('No child commentary found') || message.includes('not found')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to aggregate commentary' }, { status: 500 });
  }
}
