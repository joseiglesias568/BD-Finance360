import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import {
  getActiveCompanyId,
  getDataSources,
  getDataFlows,
  getDataQualityDashboard,
  getMasterDataOverview,
} from '@/lib/db/repositories';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// Full data platform overview — Layers 1 + 2
// GET /api/data-platform
export async function GET(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const start = Date.now();

  const rateLimitResult = checkRateLimit(`data-platform:${ip}`, 30, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 30) }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const companyIdParam = searchParams.get('companyId');

    if (companyIdParam && (isNaN(Number(companyIdParam)) || Number(companyIdParam) < 1)) {
      return NextResponse.json({ error: 'Invalid companyId parameter' }, { status: 400 });
    }

    const companyId = companyIdParam ? Number(companyIdParam) : await getActiveCompanyId();

    const [dataSources, dataFlows, dataQuality, masterData] = await Promise.all([
      getDataSources(companyId),
      getDataFlows(companyId),
      getDataQualityDashboard(companyId),
      getMasterDataOverview(companyId),
    ]);

    logger.info('Data Platform API request', { ip, companyId, durationMs: Date.now() - start });

    return NextResponse.json(
      {
        layer1: {
          label: 'Data Inputs',
          sources: dataSources,
          totalSources: dataSources.length,
          activeSources: dataSources.filter((s) => s.status === 'active').length,
        },
        layer2: {
          label: 'Finance Data Lake',
          dataFlows,
          dataQuality,
          masterData,
          totalFlows: dataFlows.length,
          healthyFlows: dataFlows.filter((f) => f.lastRunStatus === 'success').length,
        },
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60',
          ...getRateLimitHeaders(rateLimitResult, 30),
        },
      }
    );
  } catch (error) {
    logger.error('Data Platform API error', { ip, error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
