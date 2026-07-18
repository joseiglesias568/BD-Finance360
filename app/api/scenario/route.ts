import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import { getActiveCompanyId, getScenarios } from '@/lib/db/repositories';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import {
  calculateImpact,
  runMonteCarloSimulation,
  type PLImpactResult,
  type MonteCarloResults,
} from '@/lib/scenario-engine';
import {
  computeMarginalOperatingIncomeGradients,
  sampleAllocationFrontier,
} from '@/lib/scenario/allocation-frontier';

// =============================================================================
// POST /api/scenario
//
// Modes (selected via `body.mode`):
//   "impact"      — Full BD P&L / rate base calculation (default)
//   "montecarlo"  — Monte Carlo on calculateImpact engine
//   "analytics"   — Monte Carlo + marginal OI gradients + frontier scatter
//
// Request body:
//   { leverValues: Record<string, number>, mode?: "impact" | "montecarlo" }
//
// Response:
//   mode=impact      → { impact: PLImpactResult, leverValues }
//   mode=montecarlo  → { simulation: MonteCarloResults, leverValues }
//   mode=analytics   → { simulation, frontier: { marginal, scatter }, leverValues }
// =============================================================================

export async function POST(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const start = Date.now();

  const rateLimitResult = checkRateLimit(`scenario:${ip}`, 30, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 30) }
    );
  }

  try {
    const body = await request.json();
    const mode: string = body.mode ?? 'impact';
    const leverValues: Record<string, number> = body.leverValues ?? body.leverSettings ?? {};

    if (typeof leverValues !== 'object' || Array.isArray(leverValues)) {
      return NextResponse.json(
        { error: 'leverValues must be an object of { leverId: number }' },
        { status: 400 }
      );
    }

    if (mode !== 'impact' && mode !== 'montecarlo' && mode !== 'analytics') {
      return NextResponse.json(
        { error: 'mode must be "impact", "montecarlo", or "analytics"' },
        { status: 400 }
      );
    }

    const companyId = body.companyId ? Number(body.companyId) : await getActiveCompanyId();
    const scenarioData = await getScenarios(companyId);
    const { baselineRevenue, levers, baselinePL } = scenarioData;

    // Validate lever keys and clamp values
    const validatedValues: Record<string, number> = {};
    for (const [key, value] of Object.entries(leverValues)) {
      const lever = levers.find((l) => l.id === key);
      if (!lever) continue;
      const num = Number(value);
      if (isNaN(num)) continue;
      validatedValues[key] = Math.max(lever.min, Math.min(lever.max, num));
    }

    // Fill in defaults for any levers not provided
    for (const lever of levers) {
      if (validatedValues[lever.id] === undefined) {
        validatedValues[lever.id] = lever.default;
      }
    }

    const headers = {
      'Cache-Control': 'no-store',
      ...getRateLimitHeaders(rateLimitResult, 30),
    };

    if (mode === 'montecarlo' || mode === 'analytics') {
      const leverDefs = levers.map((l) => ({
        id: l.id,
        min: l.min,
        max: l.max,
        default: l.default,
      }));

      const simulation: MonteCarloResults = runMonteCarloSimulation(
        validatedValues,
        leverDefs,
        baselinePL,
        baselineRevenue * 1000,
      );

      if (mode === 'analytics') {
        const marginal = computeMarginalOperatingIncomeGradients(
          validatedValues,
          levers,
          baselineRevenue,
          baselinePL,
        );
        const scatter = sampleAllocationFrontier(
          validatedValues,
          levers,
          baselineRevenue,
          baselinePL,
          96,
        );

        logger.info('Scenario analytics API request', {
          ip,
          companyId,
          leversUsed: Object.keys(validatedValues).length,
          durationMs: Date.now() - start,
        });

        return NextResponse.json(
          {
            simulation,
            frontier: { marginal, scatter },
            leverValues: validatedValues,
          },
          { headers }
        );
      }

      logger.info('Scenario Monte Carlo API request', {
        ip,
        companyId,
        leversUsed: Object.keys(validatedValues).length,
        durationMs: Date.now() - start,
      });

      return NextResponse.json(
        { simulation, leverValues: validatedValues },
        { headers }
      );
    }

    // -------------------------------------------------------------------------
    // P&L Impact calculation (default)
    // -------------------------------------------------------------------------
    const leverDefs = levers.map((l) => ({
      id: l.id,
      min: l.min,
      max: l.max,
      default: l.default,
    }));
    const impact: PLImpactResult = calculateImpact(validatedValues, baselineRevenue, baselinePL, leverDefs);

    logger.info('Scenario Impact API request', {
      ip,
      companyId,
      leversUsed: Object.keys(validatedValues).length,
      revenueImpact: impact.revenue,
      durationMs: Date.now() - start,
    });

    return NextResponse.json(
      { impact, leverValues: validatedValues },
      { headers }
    );
  } catch (error) {
    logger.error('Scenario API error', {
      ip,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
