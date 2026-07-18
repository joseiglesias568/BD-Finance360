// =============================================================================
// EPM Fiscal Year Plan Repository
// Queries QuarterlyResult, FinancialStatement, InCycleEstimate to build
// FiscalYearPlanData that the client component expects.
// Falls back to hardcoded data if the DB is empty.
// =============================================================================

import prisma from '../prisma';
import type { FiscalYearPlanData, FiscalYearMetric, QuarterlyBreakdown } from '@/lib/epm/fiscal-year-data';
import { getFiscalYearPlanData as getHardcodedFiscalYearData } from '@/lib/epm/fiscal-year-data';

// Re-export types
export type { FiscalYearPlanData, FiscalYearMetric, QuarterlyBreakdown } from '@/lib/epm/fiscal-year-data';

/**
 * Fetch fiscal year plan data from the database.
 * Returns FiscalYearPlanData shaped identically to the hardcoded fiscal-year-data.ts output.
 * Falls back to hardcoded data when the DB has insufficient data.
 */
export async function getFiscalYearData(
  companyId: number,
  fiscalYear: string = 'FY26',
): Promise<FiscalYearPlanData> {
  // ── 1. Fetch fiscal periods for the target year ───────────────────────────
  const yearNum = parseInt(fiscalYear.replace('FY', '20'));
  const priorFY = `FY${(yearNum - 1) % 100}`;

  const periods = await prisma.fiscalPeriod.findMany({
    where: {
      companyId,
      type: 'quarter',
      label: { startsWith: 'Q' },
      year: { in: [yearNum, yearNum - 1] },
    },
    orderBy: [{ year: 'asc' }, { quarter: 'asc' }],
  });

  // ── 2. Fetch financial statements for these periods ───────────────────────
  const periodIds = periods.map((p) => p.id);
  const financials = await prisma.financialStatement.findMany({
    where: { companyId, periodId: { in: periodIds } },
    include: { period: true },
  });

  // ── 3. Fetch in-cycle estimates ───────────────────────────────────────────
  const inCycle = await prisma.inCycleEstimate.findMany({
    where: { companyId },
    orderBy: { metricName: 'asc' },
  });

  // ── 4. Fetch quarterly results ────────────────────────────────────────────
  const qResults = await prisma.quarterlyResult.findMany({
    where: { periodId: { in: periodIds } },
    include: { period: true },
  });

  // If insufficient data, fall back
  if (financials.length < 4 && inCycle.length < 4) {
    return getHardcodedFiscalYearData();
  }

  // ── 5. Build lookup structures ────────────────────────────────────────────
  // Financial statements: periodLabel -> lineItem -> { actual, plan, priorYear, variance }
  const finLookup = new Map<string, Map<string, { actual: number; plan: number; priorYear: number }>>();
  for (const f of financials) {
    const pl = f.period.label;
    if (!finLookup.has(pl)) finLookup.set(pl, new Map());
    finLookup.get(pl)!.set(f.lineItem, {
      actual: f.actual,
      plan: f.plan,
      priorYear: f.priorYear,
    });
  }

  // In-cycle estimates by metricName
  const icMap = new Map<string, typeof inCycle[0]>();
  for (const ic of inCycle) {
    icMap.set(ic.metricName, ic);
  }

  // Quarterly results by periodLabel
  const qrMap = new Map<string, typeof qResults[0]>();
  for (const qr of qResults) {
    qrMap.set(qr.period.label, qr);
  }

  // ── 6. Determine current state ────────────────────────────────────────────
  const currentQuarter = 'Q2 FY26';
  const quartersComplete = 1; // Q1 is complete
  const totalQuarters = 4;
  const daysThroughYear = 135;
  const totalDaysInYear = 364;

  // ── 7. Build metrics array ────────────────────────────────────────────────
  const currentYearPeriods = periods.filter((p) => p.year === yearNum);
  const priorYearPeriods = periods.filter((p) => p.year === yearNum - 1);

  // Helper to sum financials for a lineItem across periods
  function sumFinancials(
    periodLabels: string[],
    lineItem: string,
    field: 'actual' | 'plan' | 'priorYear',
  ): number {
    let total = 0;
    for (const pl of periodLabels) {
      const fin = finLookup.get(pl)?.get(lineItem);
      if (fin) total += fin[field];
    }
    return total;
  }

  const cyLabels = currentYearPeriods.map((p) => p.label);
  const pyLabels = priorYearPeriods.map((p) => p.label);

  // Build metric rows from DB data or in-cycle estimates
  const metrics: FiscalYearMetric[] = [];

  const metricDefs: Array<{
    metric: string;
    lineItem: string;
    icName: string;
    unit: '$M' | '%' | '$/share' | 'count';
    isCost: boolean;
  }> = [
    { metric: 'Net Revenue', lineItem: 'revenue', icName: 'Revenue', unit: '$M', isCost: false },
    { metric: 'Cost of Sales', lineItem: 'cogs', icName: 'Cost of Sales', unit: '$M', isCost: true },
    { metric: 'Gross Revenue less Fuel', lineItem: 'grossProfit', icName: 'Gross Revenue less Fuel', unit: '$M', isCost: false },
    { metric: 'Operating Expenses', lineItem: 'operatingExpenses', icName: 'Operating Expenses', unit: '$M', isCost: true },
    { metric: 'Operating Income', lineItem: 'operatingIncome', icName: 'Operating Income', unit: '$M', isCost: false },
    { metric: 'Net Income', lineItem: 'netIncome', icName: 'Net Income', unit: '$M', isCost: false },
    { metric: 'EPS', lineItem: 'eps', icName: 'EPS', unit: '$/share', isCost: false },
  ];

  for (const def of metricDefs) {
    const ic = icMap.get(def.icName);
    const plan = ic?.budgetValue ?? sumFinancials(cyLabels, def.lineItem, 'plan');
    const ytdActual = ic?.qtdActual ?? sumFinancials(cyLabels.slice(0, quartersComplete + 1), def.lineItem, 'actual');
    const fullYearForecast = ic?.flashEstimate ?? sumFinancials(cyLabels, def.lineItem, 'actual');
    const priorYear = sumFinancials(pyLabels, def.lineItem, 'actual');

    metrics.push({
      metric: def.metric,
      plan,
      ytdActual,
      fullYearForecast: fullYearForecast || plan * 0.99, // reasonable default
      priorYear: priorYear || plan * 0.92,
      unit: def.unit,
      isCost: def.isCost,
    });
  }

  // Operating Margin (derived)
  const revMetric = metrics.find((m) => m.metric === 'Net Revenue');
  const oiMetric = metrics.find((m) => m.metric === 'Operating Income');
  if (revMetric && oiMetric) {
    metrics.push({
      metric: 'Operating Margin',
      plan: revMetric.plan > 0 ? parseFloat(((oiMetric.plan / revMetric.plan) * 100).toFixed(1)) : 0,
      ytdActual: revMetric.ytdActual > 0 ? parseFloat(((oiMetric.ytdActual / revMetric.ytdActual) * 100).toFixed(1)) : 0,
      fullYearForecast: revMetric.fullYearForecast > 0 ? parseFloat(((oiMetric.fullYearForecast / revMetric.fullYearForecast) * 100).toFixed(1)) : 0,
      priorYear: revMetric.priorYear > 0 ? parseFloat(((oiMetric.priorYear / revMetric.priorYear) * 100).toFixed(1)) : 0,
      unit: '%',
      isCost: false,
    });
  }

  // Organic Revenue Growth and Global Service Line Count from in-cycle or quarterly results
  const compIc = icMap.get('Organic Revenue Growth');
  if (compIc) {
    metrics.push({
      metric: 'Organic Revenue Growth',
      plan: compIc.budgetValue,
      ytdActual: compIc.qtdActual,
      fullYearForecast: compIc.flashEstimate,
      priorYear: compIc.priorYearActual,
      unit: '%',
      isCost: false,
    });
  }

  const storeIc = icMap.get('Office Count');
  if (storeIc) {
    metrics.push({
      metric: 'Global Office Count',
      plan: storeIc.budgetValue,
      ytdActual: storeIc.qtdActual,
      fullYearForecast: storeIc.flashEstimate,
      priorYear: storeIc.priorYearActual,
      unit: 'count',
      isCost: false,
    });
  }

  // If we didn't get enough metrics from DB, fall back
  if (metrics.length < 5) {
    return getHardcodedFiscalYearData();
  }

  // ── 8. Build quarterly breakdowns ─────────────────────────────────────────
  function buildQuarterlyBreakdown(lineItem: string): QuarterlyBreakdown[] {
    return currentYearPeriods.map((p, idx) => {
      const fin = finLookup.get(p.label)?.get(lineItem);
      const priorLabel = pyLabels[idx]; // same quarter in prior year
      const priorFin = priorLabel ? finLookup.get(priorLabel)?.get(lineItem) : undefined;

      const isComplete = idx < quartersComplete;
      const isCurrent = idx === quartersComplete;

      return {
        quarter: p.label,
        plan: fin?.plan ?? 0,
        actual: isComplete ? (fin?.actual ?? null) : null,
        forecast: !isComplete ? (fin?.actual ?? fin?.plan ?? null) : null,
        priorYear: priorFin?.actual ?? 0,
      };
    });
  }

  const revenueByQuarter = buildQuarterlyBreakdown('revenue');
  const operatingIncomeByQuarter = buildQuarterlyBreakdown('operatingIncome');

  // Margin by quarter (derived)
  const marginByQuarter: QuarterlyBreakdown[] = currentYearPeriods.map((p, idx) => {
    const rev = revenueByQuarter[idx];
    const oi = operatingIncomeByQuarter[idx];
    const calcMargin = (a: number | null, b: number | null) =>
      a && b && b !== 0 ? parseFloat(((a / b) * 100).toFixed(1)) : 0;

    return {
      quarter: p.label,
      plan: calcMargin(oi.plan, rev.plan),
      actual: rev.actual ? calcMargin(oi.actual, rev.actual) : null,
      forecast: !rev.actual && rev.forecast ? calcMargin(oi.forecast, rev.forecast) : null,
      priorYear: calcMargin(oi.priorYear, rev.priorYear),
    };
  });

  return {
    fiscalYear,
    currentQuarter,
    quartersComplete,
    totalQuarters,
    daysThroughYear,
    totalDaysInYear,
    metrics,
    revenueByQuarter,
    operatingIncomeByQuarter,
    marginByQuarter,
  };
}
