import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import {
  getActiveCompanyId,
  getDataSources,
  getDataFlows,
  getDataQualityDashboard,
  getForecasts,
  getAnomalies,
  getInCycleEstimates,
} from '@/lib/db/repositories';
import { getModelStatistics } from '@/lib/delta-business-architecture';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// Aggregated platform health status across all 4 layers — Cross-cutting
// GET /api/platform-status
export async function GET(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const start = Date.now();

  const rateLimitResult = checkRateLimit(`platform-status:${ip}`, 30, 60_000);
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

    const [sources, flows, dq, forecasts, anomalies, inCycle] = await Promise.all([
      getDataSources(companyId),
      getDataFlows(companyId),
      getDataQualityDashboard(companyId),
      getForecasts(companyId),
      getAnomalies(companyId),
      getInCycleEstimates(companyId),
    ]);

    const semanticStats = getModelStatistics();

    // Layer 1: Data Inputs health
    const activeSources = sources.filter((s) => s.status === 'active').length;
    const layer1Score = sources.length > 0 ? Math.round((activeSources / sources.length) * 100) : 0;
    const layer1Status = layer1Score >= 90 ? 'healthy' : layer1Score >= 70 ? 'warning' : 'critical';

    // Layer 2: Finance Data Lake health
    const healthyFlows = flows.filter((f) => f.lastRunStatus === 'success').length;
    const flowScore = flows.length > 0 ? Math.round((healthyFlows / flows.length) * 100) : 0;
    const dqScore = Math.round(dq.overallScore);
    const layer2Score = Math.round((flowScore + dqScore) / 2);
    const layer2Status = layer2Score >= 90 ? 'healthy' : layer2Score >= 70 ? 'warning' : 'critical';

    // Layer 3: Analytics Products health
    const totalForecasts = forecasts.length;
    const openAnomalies = anomalies.filter((a) => a.status === 'open').length;
    const criticalAnomalies = anomalies.filter((a) => a.severity === 'critical' && a.status === 'open').length;
    const layer3Score = criticalAnomalies > 0 ? 60 : openAnomalies > 3 ? 75 : 90;
    const layer3Status = layer3Score >= 90 ? 'healthy' : layer3Score >= 70 ? 'warning' : 'critical';

    // Layer 4: Consumption Layer health (always healthy for static demo)
    const layer4Score = inCycle.length > 0 ? 95 : 80;
    const layer4Status = layer4Score >= 90 ? 'healthy' : 'warning';

    const overallScore = Math.round((layer1Score + layer2Score + layer3Score + layer4Score) / 4);
    const overallStatus = overallScore >= 90 ? 'healthy' : overallScore >= 70 ? 'warning' : 'critical';

    logger.info('Platform Status API request', { ip, companyId, overallScore, durationMs: Date.now() - start });

    return NextResponse.json(
      {
        overall: { score: overallScore, status: overallStatus },
        layers: {
          layer1: {
            label: 'Data Inputs',
            score: layer1Score,
            status: layer1Status,
            details: {
              totalSources: sources.length,
              activeSources,
              staleSourceCount: sources.filter((s) => s.status === 'stale').length,
            },
          },
          layer2: {
            label: 'Finance Data Lake',
            score: layer2Score,
            status: layer2Status,
            details: {
              totalFlows: flows.length,
              healthyFlows,
              failedFlows: flows.filter((f) => f.lastRunStatus === 'failed').length,
              dqScore,
              dqChecks: dq.totalChecks,
              dqPassed: dq.passed,
              dqFailed: dq.failed,
            },
          },
          layer3: {
            label: 'Analytics Products',
            score: layer3Score,
            status: layer3Status,
            details: {
              totalForecasts,
              totalAnomalies: anomalies.length,
              openAnomalies,
              criticalAnomalies,
              semanticModel: semanticStats,
            },
          },
          layer4: {
            label: 'Consumption Layer',
            score: layer4Score,
            status: layer4Status,
            details: {
              inCycleMetrics: inCycle.length,
              pagesActive: 12, // approximate count of active pages
              epmModulesActive: inCycle.length > 0 ? 5 : 0,
            },
          },
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=30',
          ...getRateLimitHeaders(rateLimitResult, 30),
        },
      }
    );
  } catch (error) {
    logger.error('Platform Status API error', { ip, error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
