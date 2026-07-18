// ════════════════════════════════════════════════════════════════════════════
// PRISMA DATA CONNECTOR
// ════════════════════════════════════════════════════════════════════════════
// Reads metric values from Prisma database tables: DriverMetric,
// DriverForecast, ElasticityFactor. Provides live data when available,
// falls back to null (letting the engine use StaticConnector as backup).
// ════════════════════════════════════════════════════════════════════════════

import type { DataConnector, NumericValue, MetricUnit } from '../types';
import { parseDisplayValue, formatValue } from '../formatter';

// Lazy import to avoid pulling Prisma into static-only contexts
let prismaModule: any = null;

async function getPrisma() {
  if (!prismaModule) {
    try {
      prismaModule = (await import('@/lib/db/prisma')).default;
    } catch {
      return null;
    }
  }
  return prismaModule;
}

export class PrismaConnector implements DataConnector {
  readonly name = 'prisma';
  private companyId: number;

  /** Cache to avoid repeated DB hits within a single computation cycle */
  private cache: Map<string, NumericValue | null> = new Map();
  private elasticityCache: Map<string, number | null> = new Map();

  constructor(companyId: number) {
    this.companyId = companyId;
  }

  /** Clear all caches (call at start of each computation cycle) */
  clearCache(): void {
    this.cache.clear();
    this.elasticityCache.clear();
  }

  getMetricValue(metricId: string, periodId?: string): NumericValue | null {
    // Synchronous cache check
    const cacheKey = `${metricId}:${periodId ?? 'latest'}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) ?? null;
    }
    // For synchronous interface compatibility, return null if not cached
    // The engine should pre-warm via loadMetrics()
    return null;
  }

  getMetricTimeSeries(_metricId: string, _periods: number): NumericValue[] {
    // Synchronous interface — return empty, use loadTimeSeries() for async
    return [];
  }

  getDriverMetrics(driverId: string): Map<string, NumericValue> {
    // Synchronous interface — return empty, use loadDriverMetrics() for async
    return new Map();
  }

  getElasticity(driverMetric: string, impactedMetric: string): number | null {
    const cacheKey = `${driverMetric}→${impactedMetric}`;
    if (this.elasticityCache.has(cacheKey)) {
      return this.elasticityCache.get(cacheKey) ?? null;
    }
    return null;
  }

  // ── Async Loading Methods (call before computation) ─────────────────

  /** Pre-load all driver metrics for a company into cache */
  async loadAllMetrics(): Promise<void> {
    const prisma = await getPrisma();
    if (!prisma) return;

    try {
      const metrics = await prisma.driverMetric.findMany({
        where: {
          driver: {
            console: {
              companyId: this.companyId,
            },
          },
        },
        include: {
          driver: true,
          period: true,
        },
        orderBy: { id: 'desc' },
      });

      for (const m of metrics) {
        const unit = (m.unit || 'count') as MetricUnit;
        const parsed = parseDisplayValue(m.currentValue, unit);
        if (parsed) {
          const periodKey = m.period?.id ? String(m.period.id) : 'latest';
          this.cache.set(`${m.name}:${periodKey}`, parsed);
          // Also cache by a normalized key
          this.cache.set(`${m.name}:latest`, parsed);
        }
      }
    } catch {
      // Fail silently — engine will fall back to static connector
    }
  }

  /** Pre-load all elasticity factors into cache */
  async loadElasticities(): Promise<void> {
    const prisma = await getPrisma();
    if (!prisma) return;

    try {
      const factors = await prisma.elasticityFactor.findMany({
        where: { companyId: this.companyId },
      });

      for (const f of factors) {
        const key = `${f.driverMetric}→${f.impactedMetric}`;
        const value = f.direction === 'negative' ? -Math.abs(f.elasticity) : f.elasticity;
        this.elasticityCache.set(key, value);
      }
    } catch {
      // Fail silently
    }
  }

  /** Get all cached elasticity factors (for what-if propagation) */
  getAllElasticities(): Map<string, number> {
    const result = new Map<string, number>();
    for (const [key, value] of Array.from(this.elasticityCache.entries())) {
      if (value !== null) result.set(key, value);
    }
    return result;
  }
}
