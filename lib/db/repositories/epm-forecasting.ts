// =============================================================================
// EPM ML Forecasting Repository
// Queries ForecastResult, DriverForecast, FinancialStatement, InCycleEstimate
// and maps to PLForecastData interface that the client component expects.
// Falls back to hardcoded data if the DB is empty.
// =============================================================================

import prisma from '../prisma';
import type { PLForecastData, PLPeriod, PLForecastRow, DriverForecastRow, PLLineItem } from '@/lib/epm/pl-forecast-data';
import { getPLForecastData as getHardcodedForecastData, getAnnualRollup } from '@/lib/epm/pl-forecast-data';

// Re-export types and constants the client needs
export type { PLForecastData, PLPeriod, PLForecastRow, DriverForecastRow, PLLineItem } from '@/lib/epm/pl-forecast-data';
export { PL_LINE_ITEMS, BOLD_LINES, INDENT_LINES, COMPUTED_LINES, getAnnualRollup } from '@/lib/epm/pl-forecast-data';

/**
 * Fetch the full P&L forecast cascade from the database.
 * Returns PLForecastData shaped identically to the hardcoded pl-forecast-data.ts output.
 * Falls back to hardcoded data when the DB has insufficient data.
 */
export async function getMLForecastData(companyId: number): Promise<PLForecastData> {
  // ── 1. Try to build from ForecastResult rows ───────────────────────────────
  const forecasts = await prisma.forecastResult.findMany({
    where: { companyId },
    orderBy: [{ metricName: 'asc' }, { periodLabel: 'asc' }],
  });

  // If we have fewer than 10 rows, fall back to hardcoded
  if (forecasts.length < 10) {
    return getHardcodedForecastData();
  }

  // ── 2. Build periods from fiscal periods table ────────────────────────────
  const dbPeriods = await prisma.fiscalPeriod.findMany({
    where: { companyId, type: 'quarter' },
    orderBy: [{ year: 'asc' }, { quarter: 'asc' }],
  });

  // Determine which period labels we have forecasts for
  const forecastPeriodLabels = new Set(forecasts.map((f) => f.periodLabel));

  // Build period list from DB, flagging historical/current/forecast
  const currentQuarter = 'Q2 FY26'; // could be dynamic in a real app
  const periods: PLPeriod[] = dbPeriods
    .filter((p) => p.quarter !== null && forecastPeriodLabels.has(p.label))
    .map((p) => {
      const isHistorical = p.label < currentQuarter || (p.year < 2026);
      const isCurrent = p.label === currentQuarter;
      const isForecast = !isHistorical && !isCurrent;
      return {
        label: p.label,
        fiscalYear: `FY${p.year % 100}`,
        quarter: p.quarter!,
        isHistorical: isHistorical && !isCurrent,
        isCurrent,
        isForecast,
      };
    });

  // If we don't have enough periods, fall back
  if (periods.length < 4) {
    return getHardcodedForecastData();
  }

  // ── 3. Map ForecastResult rows to PLForecastRow[] ─────────────────────────
  // Group by metricName (which maps to P&L line items)
  const metricGroups = new Map<string, typeof forecasts>();
  for (const f of forecasts) {
    if (!metricGroups.has(f.metricName)) metricGroups.set(f.metricName, []);
    metricGroups.get(f.metricName)!.push(f);
  }

  // P&L line mapping from ForecastResult.metricName to PLLineItem
  // Becton, Dickinson and Company canonical line items — must match PLLineItem union in pl-forecast-data.ts
  const METRIC_TO_PL: Record<string, PLLineItem> = {
    'Revenue': 'Revenue',
    'Cost of Sales': 'Cost of Service',
    'Cost of Service': 'Cost of Service',
    'Fuel & Related Costs': 'Cost of Service',       // legacy template alias
    'Gross Revenue less Fuel': 'Gross Profit',        // legacy template alias
    'Gross Profit': 'Gross Profit',
    'SGA': 'Labor & Benefits',
    'SG&A': 'Labor & Benefits',
    'Labor & Benefits': 'Labor & Benefits',
    'Depreciation': 'Depreciation & Amortization',
    'Depreciation & Amortization': 'Depreciation & Amortization',
    'Restructuring': 'Maintenance & Other Ops',
    'Restructuring & Other': 'Maintenance & Other Ops',
    'Maintenance & Other Ops': 'Maintenance & Other Ops',
    'Total Operating Expenses': 'Total Operating Expenses',
    'Operating Income': 'Operating Income',
    'Net Income': 'Net Income',
    'EPS': 'EPS',
  };

  const rows: PLForecastRow[] = [];
  for (const [metricName, items] of Array.from(metricGroups.entries())) {
    const plLine = METRIC_TO_PL[metricName];
    if (!plLine) continue; // skip non-P&L metrics

    const row: PLForecastRow = {
      lineItem: plLine,
      values: {},
      confidence: {},
      lowerBound: {},
      upperBound: {},
    };

    for (const item of items) {
      const val = item.actualValue ?? item.forecastValue;
      row.values[item.periodLabel] = val;
      row.confidence[item.periodLabel] = Math.round(item.confidenceScore * 100);
      row.lowerBound[item.periodLabel] = item.lowerBound;
      row.upperBound[item.periodLabel] = item.upperBound;
    }

    rows.push(row);
  }

  // If we ended up with fewer than 3 P&L lines, fall back
  if (rows.length < 3) {
    return getHardcodedForecastData();
  }

  // ── 4. Build driver data from DriverForecast ──────────────────────────────
  const dbDrivers = await prisma.driverForecast.findMany({
    where: { companyId },
    include: {
      driver: { select: { name: true, impactDirection: true } },
    },
    orderBy: { id: 'asc' },
  });

  const drivers: DriverForecastRow[] = [];
  const driverGroups = new Map<string, typeof dbDrivers>();
  for (const d of dbDrivers) {
    const key = d.driver.name;
    if (!driverGroups.has(key)) driverGroups.set(key, []);
    driverGroups.get(key)!.push(d);
  }

  for (const [driverName, items] of Array.from(driverGroups.entries())) {
    // Determine parent line from metric name
    const firstMetric = items[0]?.metricName ?? '';
    let parentLine: PLLineItem = 'Revenue';
    if (firstMetric.toLowerCase().includes('cost') || firstMetric.toLowerCase().includes('labor')) {
      parentLine = 'Cost of Service';
    } else if (firstMetric.toLowerCase().includes('sga') || firstMetric.toLowerCase().includes('opex')) {
      parentLine = 'Total Operating Expenses';
    }

    const driverRow: DriverForecastRow = {
      driverName,
      parentLine,
      unit: items[0]?.elasticityUnit ?? '$M',
      values: {},
      impactOnParent: {},
    };

    for (const item of items) {
      driverRow.values[item.periodLabel] = item.forecastValue;
      // Impact on parent: if elasticity is available, use it; otherwise just the value
      driverRow.impactOnParent[item.periodLabel] = item.elasticity
        ? item.forecastValue * item.elasticity
        : item.forecastValue;
    }

    drivers.push(driverRow);
  }

  // ── 5. Build model accuracy from ForecastResult aggregation ───────────────
  const modelAccuracyMap = new Map<
    string,
    { mapes: number[]; confidences: number[]; models: Map<string, number> }
  >();

  for (const f of forecasts) {
    const plLine = METRIC_TO_PL[f.metricName];
    if (!plLine) continue;
    if (!modelAccuracyMap.has(plLine)) {
      modelAccuracyMap.set(plLine, { mapes: [], confidences: [], models: new Map() });
    }
    const entry = modelAccuracyMap.get(plLine)!;
    if (f.mape > 0) entry.mapes.push(f.mape);
    entry.confidences.push(f.confidenceScore * 100);
    const count = entry.models.get(f.modelType) ?? 0;
    entry.models.set(f.modelType, count + 1);
  }

  const modelAccuracy = Array.from(modelAccuracyMap.entries()).map(([lineItem, data]) => {
    const avgMape = data.mapes.length > 0
      ? data.mapes.reduce((s, v) => s + v, 0) / data.mapes.length
      : 0;
    const avgConf = data.confidences.length > 0
      ? data.confidences.reduce((s, v) => s + v, 0) / data.confidences.length
      : 0;
    // Best model is the one with the most entries
    let bestModel = 'XGBoost Ensemble';
    let bestCount = 0;
    for (const [model, count] of Array.from(data.models.entries())) {
      if (count > bestCount) {
        bestModel = model;
        bestCount = count;
      }
    }

    return {
      lineItem: lineItem as PLLineItem,
      mape: parseFloat(avgMape.toFixed(1)),
      bestModel,
      confidence: Math.round(avgConf),
    };
  });

  return {
    periods,
    rows,
    drivers,
    modelAccuracy,
  };
}
