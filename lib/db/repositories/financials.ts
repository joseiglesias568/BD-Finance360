import prisma from '../prisma';
import type { FinancialConfig, QuarterData, SegmentData, PLLineItem, BridgeItem } from '@/config/types';
import { calculateOperatingMargin, roundFinancial, sumField } from '@/lib/engines/financial-engine';
import { financials as seedFinancials } from '@/config/clients/bkr/financials';
import { mergeFinancialsFromSeed } from './financial-merge';

const EMPTY_QUARTER: QuarterData = {
  quarter: 'N/A',
  revenue: 0,
  revenueYoY: 0,
  operatingIncome: 0,
  operatingMargin: 0,
  eps: 0,
  feeRevenueGrowth: 0,
};

export async function getFinancials(companyId: number = 1): Promise<FinancialConfig> {
  // Get all fiscal periods for this company
  const periods = await prisma.fiscalPeriod.findMany({
    where: { companyId },
    orderBy: [{ year: 'asc' }, { quarter: 'asc' }],
  });

  const annualPeriod = periods.find(p => p.type === 'annual');
  const quarterPeriods = periods.filter(p => p.type === 'quarter');

  // Get quarterly results — order by year then quarter for correct multi-year trend ordering
  const quarterlyResults = await prisma.quarterlyResult.findMany({
    where: { period: { companyId } },
    include: { period: true },
    orderBy: [{ period: { year: 'asc' } }, { period: { quarter: 'asc' } }],
  });

  const allQuarters: QuarterData[] = quarterlyResults.map(qr => ({
    quarter: qr.period.label,
    revenue: qr.revenue,
    revenueYoY: qr.revenueYoY,
    operatingIncome: qr.operatingIncome,
    operatingMargin: qr.operatingMargin,
    eps: qr.eps,
    feeRevenueGrowth: qr.compStoreSales,
    netNewClients: qr.netNewStores ?? undefined,
  }));

  // Determine the latest period that has actual financial data.
  // Seed 19 adds future forecast quarters (e.g. Q2/Q3 FY26) with actual=0.
  // Using the chronologically last period would point to a forecast-only quarter,
  // making plan vs actual tiles and variance charts appear empty.
  // Instead, find the most recent quarter whose FinancialStatement revenue is > 0.
  const latestActualPLRow = await prisma.financialStatement.findFirst({
    where: { companyId, lineItem: 'revenue', actual: { gt: 0 } },
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }, { period: { quarter: 'desc' } }],
  });
  const latestQPeriod = latestActualPLRow?.period ?? quarterPeriods[quarterPeriods.length - 1];

  // Slice quarters to only include up to the latest actual period.
  // Seed 19 stores forecast Q2/Q3 FY26 in QuarterlyResult with CRE-era revenue
  // values (~$10B) that are wrong for Delta. Excluding them from the quarters
  // array prevents them appearing in trend charts and the ForwardOutlook trajectory.
  const latestActualIdx = allQuarters.findIndex(q => q.quarter === latestQPeriod?.label);
  const quarters = latestActualIdx >= 0
    ? allQuarters.slice(0, latestActualIdx + 1)
    : allQuarters;

  const latestQuarter = quarters[quarters.length - 1] ?? null;

  // Get segments with latest ACTUAL period results
  const segments = await prisma.businessSegment.findMany({
    where: { companyId },
    include: {
      segmentResults: {
        where: { periodId: latestQPeriod?.id },
        take: 1,
      },
    },
  });

  const segmentData: SegmentData[] = segments.map(s => ({
    name: s.name,
    revenue: s.segmentResults[0]?.revenue ?? 0,
    revenuePercent: s.revenuePercent,
    yoyChange: s.segmentResults[0]?.yoyChange ?? 0,
    operatingMargin: s.segmentResults[0]?.operatingMargin ?? undefined,
    description: s.description,
  }));

  // Get P&L for latest quarter with actual data (latestQPeriod resolved above)
  const plLines = await prisma.financialStatement.findMany({
    where: { companyId, periodId: latestQPeriod?.id },
  });

  const plMap: Record<string, PLLineItem> = {};
  for (const line of plLines) {
    plMap[line.lineItem] = {
      label: line.label,
      actual: line.actual,
      plan: line.plan,
      priorYear: line.priorYear,
      variance: line.variance,
      variancePercent: line.variancePercent,
    };
  }

  const defaultPL: PLLineItem = { label: '', actual: 0, plan: 0, priorYear: 0, variance: 0, variancePercent: 0 };

  // Get revenue bridge for latest quarter
  const bridgeItems = await prisma.revenueBridgeItem.findMany({
    where: { companyId, periodId: latestQPeriod?.id },
    orderBy: { sortOrder: 'asc' },
  });

  const revenueBridge: BridgeItem[] = bridgeItems.map(b => ({
    label: b.label,
    impact: b.impact,
    description: b.description,
    category: b.category as BridgeItem['category'],
  }));

  // Get ratios for latest quarter
  const ratios = await prisma.financialRatio.findMany({
    where: { companyId, periodId: latestQPeriod?.id },
  });

  const ratioMap: Record<string, number> = {};
  for (const r of ratios) {
    ratioMap[r.name] = r.value;
  }

  // Get working capital for latest quarter
  const wcMetrics = await prisma.workingCapitalMetric.findMany({
    where: { companyId, periodId: latestQPeriod?.id },
  });

  const wcMap: Record<string, { actual: number; target: number }> = {};
  for (const wc of wcMetrics) {
    wcMap[wc.name] = { actual: wc.actual, target: wc.target };
  }

  // Compute annual values from quarterly results or use annual period data
  const annualRevenue = sumField(quarters, 'revenue');
  const annualOI = sumField(quarters, 'operatingIncome');

  return mergeFinancialsFromSeed(
    {
      fiscalYear: annualPeriod?.label ?? 'FY25',
      annualRevenue: roundFinancial(annualRevenue),
      annualRevenueYoY: latestQuarter?.revenueYoY ?? 0,
      annualOperatingIncome: roundFinancial(annualOI),
      annualOperatingMargin: calculateOperatingMargin(annualOI, annualRevenue),
      annualNetIncome: plMap['netIncome']?.actual ? plMap['netIncome'].actual * 4 / 1000 : 0,
      annualEPS: latestQuarter?.eps ? roundFinancial(latestQuarter.eps * 4, 2) : 0,
      quarters,
      latestQuarter: latestQuarter ?? EMPTY_QUARTER,
      segments: segmentData,
      plSummary: {
        revenue: plMap['revenue'] ?? defaultPL,
        cogs: plMap['cogs'] ?? defaultPL,
        grossProfit: plMap['grossProfit'] ?? defaultPL,
        operatingExpenses: plMap['operatingExpenses'] ?? defaultPL,
        operatingIncome: plMap['operatingIncome'] ?? defaultPL,
        netIncome: plMap['netIncome'] ?? defaultPL,
      },
      revenueBridge,
      ratios: {
        currentRatio: ratioMap['currentRatio'] ?? 0,
        currentRatioTarget: ratioMap['currentRatioTarget'] ?? 1.0,
        debtToEquity: ratioMap['debtToEquity'] ?? 0,
        debtToEquityTarget: ratioMap['debtToEquityTarget'] ?? 3.0,
        returnOnEquity: ratioMap['returnOnEquity'] ?? 0,
        returnOnAssets: ratioMap['returnOnAssets'] ?? 0,
        returnOnAssetsTarget: ratioMap['returnOnAssetsTarget'] ?? 13.5,
        freeCashFlow: ratioMap['freeCashFlow'] ?? 0,
        freeCashFlowTarget: ratioMap['freeCashFlowTarget'] ?? 0.75,
        dividendPerShare: ratioMap['dividendPerShare'] ?? 0,
      },
      workingCapital: {
        dso: wcMap['dso']?.actual ?? 0,
        dsoTarget: wcMap['dso']?.target ?? 0,
        inventoryDays: wcMap['inventoryDays']?.actual ?? 0,
        inventoryDaysTarget: wcMap['inventoryDays']?.target ?? 0,
        dpo: wcMap['dpo']?.actual ?? 0,
        dpoTarget: wcMap['dpo']?.target ?? 0,
      },
      scenarioBaseline: seedFinancials.scenarioBaseline,
    },
    seedFinancials,
    companyId,
  );
}
