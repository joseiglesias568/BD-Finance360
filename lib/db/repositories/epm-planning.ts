// =============================================================================
// EPM Planning Repository — Short-Term & Long-Term Planning
// Queries ScenarioLever for lever definitions, ScenarioBaseline + InCycleEstimate
// for baseline values.
// Falls back to hardcoded data if the DB is empty.
// =============================================================================

import prisma from '../prisma';
import type { PlanningLever, PLResult, LongTermProjection } from '@/lib/epm/planning-engine';
import {
  SHORT_TERM_LEVERS as HARDCODED_ST_LEVERS,
  LONG_TERM_LEVERS as HARDCODED_LT_LEVERS,
  calculateShortTermImpact as hardcodedCalcShortTerm,
  calculateLongTermProjection as hardcodedCalcLongTerm,
} from '@/lib/epm/planning-engine';

// Re-export types and computation functions the client needs
export type { PlanningLever, PLResult, PlanningImpact, LongTermProjection } from '@/lib/epm/planning-engine';
export { calculateShortTermImpact, calculateLongTermProjection } from '@/lib/epm/planning-engine';

// ── Types for the data returned to server pages ─────────────────────────────

export interface ShortTermPlanningData {
  levers: PlanningLever[];
  baseline: PLResult;
}

export interface LongTermPlanningData {
  levers: PlanningLever[];
  baseline: PLResult;
}

// ── Short-term lever category filter ────────────────────────────────────────

const SHORT_TERM_CATEGORIES = new Set([
  'Property Operations',
  'Revenue Drivers',
  'Cost Drivers',
  'Pricing',
]);

const LONG_TERM_CATEGORIES = new Set([
  'Growth',
  'Profitability',
  'Investment',
  'Digital',
]);

/**
 * Map a ScenarioLever DB row to the PlanningLever interface.
 */
function mapLever(row: {
  externalId: string;
  name: string;
  category: string;
  min: number;
  max: number;
  defaultVal: number;
  step: number;
  unit: string;
  description: string;
}): PlanningLever {
  return {
    id: row.externalId,
    label: row.name,
    category: row.category,
    min: row.min,
    max: row.max,
    default: row.defaultVal,
    step: row.step,
    unit: row.unit,
    description: row.description,
  };
}

/**
 * Build a PLResult baseline from ScenarioBaseline + InCycleEstimate.
 */
async function getBaseline(
  companyId: number,
  fallback: PLResult,
): Promise<PLResult> {
  const baseline = await prisma.scenarioBaseline.findUnique({
    where: { companyId },
  });

  if (!baseline) return fallback;

  // Try detailed baseline first
  const detailed = (baseline as Record<string, unknown>)?.detailedBaseline;
  if (detailed && typeof detailed === 'object') {
    const d = detailed as Record<string, number>;
    return {
      revenue: d.revenue ?? fallback.revenue,
      costOfSales: d.costOfSales ?? d.cogs ?? fallback.costOfSales,
      grossProfit: d.grossProfit ?? fallback.grossProfit,
      operatingExpenses: d.operatingExpenses ?? fallback.operatingExpenses,
      operatingIncome: d.operatingIncome ?? fallback.operatingIncome,
      operatingMargin: d.operatingMargin ?? fallback.operatingMargin,
      netIncome: d.netIncome ?? fallback.netIncome,
      eps: d.eps ?? fallback.eps,
    };
  }

  // Minimal baseline: just revenue and margin
  return {
    ...fallback,
    revenue: baseline.baselineRevenue || fallback.revenue,
    operatingMargin: baseline.baselineMargin || fallback.operatingMargin,
  };
}

/**
 * Fetch short-term planning data (levers + baseline).
 * Falls back to hardcoded data when the DB has no matching levers.
 */
export async function getShortTermPlanningData(
  companyId: number,
): Promise<ShortTermPlanningData> {
  const dbLevers = await prisma.scenarioLever.findMany({
    where: { companyId },
    orderBy: { id: 'asc' },
  });

  // Filter to short-term categories
  const stLevers = dbLevers.filter((l) => SHORT_TERM_CATEGORIES.has(l.category));

  if (stLevers.length === 0) {
    // Fall back to hardcoded levers
    const baseline: PLResult = {
      revenue: 19100,
      costOfSales: 5816,
      grossProfit: 13284,
      operatingExpenses: 5860,
      operatingIncome: 7424,
      operatingMargin: 15.6,
      netIncome: 4976,
      eps: 1.64,
    };

    return {
      levers: HARDCODED_ST_LEVERS,
      baseline,
    };
  }

  const levers = stLevers.map(mapLever);
  const fallbackBaseline: PLResult = {
    revenue: 19100,
    costOfSales: 5816,
    grossProfit: 13284,
    operatingExpenses: 5860,
    operatingIncome: 7424,
    operatingMargin: 15.6,
    netIncome: 4976,
    eps: 1.64,
  };

  const baseline = await getBaseline(companyId, fallbackBaseline);

  return { levers, baseline };
}

/**
 * Fetch long-term planning data (levers + baseline).
 * Falls back to hardcoded data when the DB has no matching levers.
 */
export async function getLongTermPlanningData(
  companyId: number,
): Promise<LongTermPlanningData> {
  const dbLevers = await prisma.scenarioLever.findMany({
    where: { companyId },
    orderBy: { id: 'asc' },
  });

  // Filter to long-term categories
  const ltLevers = dbLevers.filter((l) => LONG_TERM_CATEGORIES.has(l.category));

  if (ltLevers.length === 0) {
    const baseline: PLResult = {
      revenue: 38850,
      costOfSales: 11890,
      grossProfit: 26960,
      operatingExpenses: 20810,
      operatingIncome: 6150,
      operatingMargin: 15.8,
      netIncome: 4120,
      eps: 3.61,
    };

    return {
      levers: HARDCODED_LT_LEVERS,
      baseline,
    };
  }

  const levers = ltLevers.map(mapLever);
  const fallbackBaseline: PLResult = {
    revenue: 38850,
    costOfSales: 11890,
    grossProfit: 26960,
    operatingExpenses: 20810,
    operatingIncome: 6150,
    operatingMargin: 15.8,
    netIncome: 4120,
    eps: 3.61,
  };

  const baseline = await getBaseline(companyId, fallbackBaseline);

  return { levers, baseline };
}
