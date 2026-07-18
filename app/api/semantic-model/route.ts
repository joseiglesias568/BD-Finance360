import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import {
  allSemanticConsoles,
  getAllDrivers,
  getAllMetrics,
  getDriverById,
  getCrossReferences,
  getModelStatistics,
  SemanticEngine,
} from '@/lib/delta-business-architecture';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// Query the business architecture semantic model / driver tree — Layer 3
// GET /api/semantic-model?q=revenue&console=north-america-performance&driver=na-comp-sales
// NEW: ?compute=true (computed metrics with gaps/health), ?graph=true&depth=2, ?whatif=true&metric=X&value=Y
export async function GET(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const start = Date.now();

  const rateLimitResult = checkRateLimit(`semantic:${ip}`, 60, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 60) }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase();
    const consoleId = searchParams.get('console');
    const driverId = searchParams.get('driver');
    const compute = searchParams.get('compute') === 'true';
    const graph = searchParams.get('graph') === 'true';
    const whatif = searchParams.get('whatif') === 'true';

    const engine = SemanticEngine.getInstance();

    // ── What-If Analysis ────────────────────────────────────────────────
    if (whatif) {
      const metricId = searchParams.get('metric');
      const newValue = parseFloat(searchParams.get('value') ?? '');

      if (!metricId || isNaN(newValue)) {
        return NextResponse.json(
          { error: 'What-if requires ?metric=<id>&value=<number>' },
          { status: 400 }
        );
      }

      const assumption = engine.createAssumption(metricId, newValue);
      if (!assumption) {
        return NextResponse.json(
          { error: `Metric "${metricId}" not found in semantic model` },
          { status: 404 }
        );
      }

      const scenario = engine.whatIfAnalysis([assumption]);
      return NextResponse.json({
        scenario: scenario.name,
        assumptions: scenario.assumptions.map(a => ({
          metricId: a.metricId,
          from: a.originalValue.display,
          to: a.newValue.display,
          changePercent: a.changePercent,
        })),
        impacts: scenario.results.map(r => ({
          driver: r.driverName,
          metric: r.metricName,
          from: r.originalValue.display,
          to: r.projectedValue.display,
          impact: r.impact.display,
          confidence: r.confidence,
          path: r.impactPath,
        })),
        summary: scenario.summary,
      });
    }

    // ── Computed Driver Lookup ───────────────────────────────────────────
    if (driverId && compute) {
      const computed = engine.getDriver(driverId);
      if (!computed) {
        return NextResponse.json({ error: `Driver "${driverId}" not found` }, { status: 404 });
      }
      return NextResponse.json({ driver: computed });
    }

    // ── Graph Traversal ─────────────────────────────────────────────────
    if (driverId && graph) {
      const depth = parseInt(searchParams.get('depth') ?? '2', 10);
      const direction = (searchParams.get('direction') ?? 'related') as 'upstream' | 'downstream' | 'related';

      let related;
      switch (direction) {
        case 'upstream':
          related = engine.getUpstream(driverId);
          break;
        case 'downstream':
          related = engine.getDownstream(driverId).slice(0, 20);
          break;
        default:
          related = engine.getRelatedDrivers(driverId, depth);
      }

      return NextResponse.json({
        source: driverId,
        direction,
        depth,
        related: related.map(d => ({
          id: d.id,
          name: d.name,
          consoleId: d.consoleId,
          healthScore: d.healthScore,
          metrics: d.metrics.map(m => ({
            id: m.id,
            name: m.name,
            value: m.value.display,
            status: m.status,
          })),
        })),
      });
    }

    // ── Standard Driver Lookup (backward compatible) ────────────────────
    if (driverId) {
      const driver = getDriverById(driverId);
      if (!driver) {
        return NextResponse.json({ error: `Driver "${driverId}" not found` }, { status: 404 });
      }
      const crossRefs = getCrossReferences(driverId);
      return NextResponse.json({
        driver,
        crossReferences: crossRefs,
      });
    }

    // ── Computed Console Lookup ──────────────────────────────────────────
    if (consoleId && compute) {
      const computed = engine.getConsole(consoleId);
      if (!computed) {
        return NextResponse.json({ error: `Console "${consoleId}" not found` }, { status: 404 });
      }
      return NextResponse.json({ console: computed });
    }

    // ── Standard Console Lookup (backward compatible) ───────────────────
    if (consoleId) {
      const console = allSemanticConsoles.find((c) => c.id === consoleId);
      if (!console) {
        return NextResponse.json({ error: `Console "${consoleId}" not found` }, { status: 404 });
      }
      return NextResponse.json({ console });
    }

    // ── Search with optional computed enrichment ────────────────────────
    if (query) {
      if (compute) {
        const drivers = engine.searchDrivers(query);
        const metrics = engine.searchMetrics(query);

        return NextResponse.json(
          {
            query,
            results: {
              drivers: drivers.slice(0, 25).map(d => ({
                id: d.id,
                name: d.name,
                description: d.description,
                consoleId: d.consoleId,
                healthScore: d.healthScore,
                metrics: d.metrics.map(m => ({
                  id: m.id,
                  name: m.name,
                  value: m.value.display,
                  numericValue: m.value.raw,
                  target: m.target?.display,
                  gap: m.gap?.display,
                  status: m.status,
                })),
              })),
              metrics: metrics.slice(0, 25).map(m => ({
                id: m.id,
                name: m.name,
                description: m.description,
                value: m.value.display,
                numericValue: m.value.raw,
                target: m.target?.display,
                gap: m.gap?.display,
                status: m.status,
                formula: m.formula,
              })),
            },
            totalResults: drivers.length + metrics.length,
          },
          { headers: { 'Cache-Control': 'private, max-age=300', ...getRateLimitHeaders(rateLimitResult, 60) } }
        );
      }

      // Standard search (backward compatible)
      const allDrivers = getAllDrivers();
      const allMetrics = getAllMetrics();

      const matchingDrivers = allDrivers.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.id.toLowerCase().includes(query)
      );

      const matchingMetrics = allMetrics.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query)
      );

      const matchingConsoles = allSemanticConsoles.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.objective.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      );

      logger.info('Semantic Model search', { ip, query, results: matchingDrivers.length + matchingMetrics.length, durationMs: Date.now() - start });

      return NextResponse.json(
        {
          query,
          results: {
            consoles: matchingConsoles.map((c) => ({ id: c.id, title: c.title, category: c.category, segment: c.segment })),
            drivers: matchingDrivers.slice(0, 25).map((d) => ({
              id: d.id,
              name: d.name,
              description: d.description,
              hasChildren: (d.children?.length ?? 0) > 0,
              metricCount: d.metrics?.length ?? 0,
            })),
            metrics: matchingMetrics.slice(0, 25).map((m) => ({
              id: m.id,
              name: m.name,
              description: m.description,
              unit: m.unit,
              currentValue: m.currentValue,
              target: m.target,
              direction: m.direction,
            })),
          },
          totalResults: matchingConsoles.length + matchingDrivers.length + matchingMetrics.length,
        },
        {
          headers: {
            'Cache-Control': 'private, max-age=300',
            ...getRateLimitHeaders(rateLimitResult, 60),
          },
        }
      );
    }

    // Default: return model overview with enhanced statistics
    const stats = getModelStatistics();
    return NextResponse.json(
      {
        statistics: stats,
        consoles: allSemanticConsoles.map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
          segment: c.segment,
          objective: c.objective,
          driverCount: c.drivers.length,
        })),
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=300',
          ...getRateLimitHeaders(rateLimitResult, 60),
        },
      }
    );
  } catch (error) {
    logger.error('Semantic Model API error', { ip, error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
