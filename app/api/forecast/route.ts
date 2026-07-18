import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import {
  getActiveCompanyId,
  getForecasts,
  getForecastAccuracy,
} from '@/lib/db/repositories';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// ML Forecast results — Layer 3
// GET /api/forecast?metric=Revenue&model=Ensemble
export async function GET(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const start = Date.now();

  const rateLimitResult = checkRateLimit(`forecast:${ip}`, 60, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 60) }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const companyIdParam = searchParams.get('companyId');
    const metric = searchParams.get('metric') ?? undefined;
    const model = searchParams.get('model') ?? undefined;

    if (companyIdParam && (isNaN(Number(companyIdParam)) || Number(companyIdParam) < 1)) {
      return NextResponse.json({ error: 'Invalid companyId parameter' }, { status: 400 });
    }

    const companyId = companyIdParam ? Number(companyIdParam) : await getActiveCompanyId();

    const [forecasts, accuracy] = await Promise.all([
      getForecasts(companyId, metric, model),
      getForecastAccuracy(companyId),
    ]);

    logger.info('Forecast API request', { ip, companyId, metric, model, durationMs: Date.now() - start });

    return NextResponse.json(
      {
        forecasts,
        accuracy,
        filters: { metric, model },
        totalResults: forecasts.length,
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60',
          ...getRateLimitHeaders(rateLimitResult, 60),
        },
      }
    );
  } catch (error) {
    logger.error('Forecast API error', { ip, error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
