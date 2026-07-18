import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import {
  getActiveCompanyId,
  getCompanyBranding,
  getFinancials,
  getKPIs,
  getOperations,
  getStrategic,
  getMarket,
  getScenarios,
  getAlerts,
  getReports,
  getMonthEnd,
  getPersonalizedInsights,
  getBusinessConsoles,
} from '@/lib/db/repositories';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// Full data dump — returns the entire ClientConfig from DB
// GET /api/data
export async function GET(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const start = Date.now();

  // Rate limit: 30 requests per minute
  const rateLimitResult = checkRateLimit(`data:${ip}`, 30, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 30) }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const companyIdParam = searchParams.get('companyId');

    // Validate companyId if provided
    if (companyIdParam && (isNaN(Number(companyIdParam)) || Number(companyIdParam) < 1)) {
      return NextResponse.json({ error: 'Invalid companyId parameter' }, { status: 400 });
    }

    const companyId = companyIdParam ? Number(companyIdParam) : await getActiveCompanyId();

    const [
      branding,
      financials,
      kpis,
      operations,
      strategic,
      market,
      scenarios,
      alerts,
      reports,
      monthEnd,
      insights,
      consoles,
    ] = await Promise.all([
      getCompanyBranding(companyId),
      getFinancials(companyId),
      getKPIs(companyId),
      getOperations(companyId),
      getStrategic(companyId),
      getMarket(companyId),
      getScenarios(companyId),
      getAlerts(companyId),
      getReports(companyId),
      getMonthEnd(companyId),
      getPersonalizedInsights(companyId),
      getBusinessConsoles(companyId),
    ]);

    logger.info('Data API request', { ip, companyId, durationMs: Date.now() - start });

    return NextResponse.json({
      branding,
      financials,
      kpis,
      operations,
      strategic,
      market,
      scenarios,
      alerts,
      reports,
      monthEnd,
      insights,
      consoles,
    }, {
      headers: {
        'Cache-Control': 'private, no-store',
        ...getRateLimitHeaders(rateLimitResult, 30),
      },
    });
  } catch (error) {
    logger.error('Data API error', { ip, error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
