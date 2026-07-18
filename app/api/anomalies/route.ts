import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import {
  getActiveCompanyId,
  getAnomalies,
} from '@/lib/db/repositories';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// Anomaly detections — Layer 3
// GET /api/anomalies?severity=critical&status=open
export async function GET(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const start = Date.now();

  const rateLimitResult = checkRateLimit(`anomalies:${ip}`, 60, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 60) }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const companyIdParam = searchParams.get('companyId');
    const severity = searchParams.get('severity') ?? undefined;
    const status = searchParams.get('status') ?? undefined;

    if (companyIdParam && (isNaN(Number(companyIdParam)) || Number(companyIdParam) < 1)) {
      return NextResponse.json({ error: 'Invalid companyId parameter' }, { status: 400 });
    }

    const companyId = companyIdParam ? Number(companyIdParam) : await getActiveCompanyId();

    const anomalies = await getAnomalies(companyId, severity, status);

    const bySeverity = {
      critical: anomalies.filter((a) => a.severity === 'critical').length,
      high: anomalies.filter((a) => a.severity === 'high').length,
      medium: anomalies.filter((a) => a.severity === 'medium').length,
      low: anomalies.filter((a) => a.severity === 'low').length,
    };

    logger.info('Anomalies API request', { ip, companyId, severity, status, durationMs: Date.now() - start });

    return NextResponse.json(
      {
        anomalies,
        summary: {
          total: anomalies.length,
          bySeverity,
          openCount: anomalies.filter((a) => a.status === 'open').length,
        },
        filters: { severity, status },
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=30',
          ...getRateLimitHeaders(rateLimitResult, 60),
        },
      }
    );
  } catch (error) {
    logger.error('Anomalies API error', { ip, error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
