// =============================================================================
// EPM Configuration Repository — Planning Milestones, Config, Driver Forecasts
// =============================================================================

import prisma from '../prisma';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PlanningMilestoneSummary {
  label: string;
  description: string;
  month: string;
  status: string;
  category: string;
  sortOrder: number;
  fiscalYear: string;
}

export interface DriverForecastSummary {
  driverName: string;
  metricName: string;
  periodLabel: string;
  forecastValue: number;
  actualValue: number | null;
  budgetValue: number | null;
  priorYearValue: number | null;
  elasticity: number | null;
  elasticityUnit: string;
  causalityWeight: number | null;
  impactDirection: string;
}

export type ParsedConfig = Record<string, string | number | boolean | unknown>;

// ─── Planning Milestones ────────────────────────────────────────────────────

export async function getPlanningMilestones(
  companyId: number,
  fiscalYear?: string,
): Promise<PlanningMilestoneSummary[]> {
  const where: Record<string, unknown> = { companyId };
  if (fiscalYear) where.fiscalYear = fiscalYear;

  const results = await prisma.planningMilestone.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
  });

  return results.map((r) => ({
    label: r.label,
    description: r.description,
    month: r.month,
    status: r.status,
    category: r.category,
    sortOrder: r.sortOrder,
    fiscalYear: r.fiscalYear,
  }));
}

// ─── Platform Config ────────────────────────────────────────────────────────

export async function getPlatformConfig(
  companyId: number,
  module: string,
): Promise<ParsedConfig> {
  const results = await prisma.platformConfig.findMany({
    where: { companyId, module },
  });

  const config: ParsedConfig = {};
  for (const r of results) {
    switch (r.type) {
      case 'number':
        config[r.key] = parseFloat(r.value);
        break;
      case 'boolean':
        config[r.key] = r.value === 'true';
        break;
      case 'json':
        try {
          config[r.key] = JSON.parse(r.value);
        } catch {
          config[r.key] = r.value;
        }
        break;
      default:
        config[r.key] = r.value;
    }
  }

  return config;
}

// ─── Driver Forecasts with Elasticity ───────────────────────────────────────

export async function getDriverForecasts(
  companyId: number,
  periodLabel?: string,
): Promise<DriverForecastSummary[]> {
  const where: Record<string, unknown> = { companyId };
  if (periodLabel) where.periodLabel = periodLabel;

  const results = await prisma.driverForecast.findMany({
    where,
    include: {
      driver: {
        select: {
          name: true,
          causalityWeight: true,
          impactDirection: true,
        },
      },
    },
    orderBy: { id: 'asc' },
  });

  return results.map((r) => ({
    driverName: r.driver.name,
    metricName: r.metricName,
    periodLabel: r.periodLabel,
    forecastValue: r.forecastValue,
    actualValue: r.actualValue,
    budgetValue: r.budgetValue,
    priorYearValue: r.priorYearValue,
    elasticity: r.elasticity,
    elasticityUnit: r.elasticityUnit,
    causalityWeight: r.driver.causalityWeight,
    impactDirection: r.driver.impactDirection,
  }));
}
