// =============================================================================
// Analytics Repository — Layer 3 (ML Models, Forecasting, Anomaly Detection)
// + Layer 4 EPM (In-Cycle Estimates)
// =============================================================================

import prisma from '../prisma';
import { calculateVariancePercent, calculatePctComplete } from '@/lib/engines/variance-engine';
import { roundFinancial, averageField } from '@/lib/engines/financial-engine';

export interface ForecastSummary {
  id: number;
  metricName: string;
  periodLabel: string;
  modelType: string;
  forecastValue: number;
  lowerBound: number;
  upperBound: number;
  actualValue: number | null;
  confidenceScore: number;
  mape: number;
}

export interface AnomalySummary {
  id: number;
  metricName: string;
  detectedAt: string;
  severity: string;
  direction: string;
  expectedValue: number;
  actualValue: number;
  deviationPct: number;
  explanation: string;
  status: string;
  relatedDrivers: string[];
}

export interface InCycleSummary {
  metricName: string;
  periodLabel: string;
  mtdActual: number;
  qtdActual: number;
  flashEstimate: number;
  forecastValue: number;
  budgetValue: number;
  priorYearActual: number;
  daysThroughPeriod: number;
  totalDaysInPeriod: number;
  lastUpdated: string;
  // Computed fields
  pctComplete: number;
  flashVsForecast: number;
  flashVsBudget: number;
  flashVsPriorYear: number;
}

export async function getForecasts(
  companyId: number,
  metricName?: string,
  modelType?: string,
): Promise<ForecastSummary[]> {
  const where: Record<string, unknown> = { companyId };
  if (metricName) where.metricName = metricName;
  if (modelType) where.modelType = modelType;

  const results = await prisma.forecastResult.findMany({
    where,
    orderBy: [{ metricName: 'asc' }, { periodLabel: 'asc' }],
  });

  return results.map((r) => ({
    id: r.id,
    metricName: r.metricName,
    periodLabel: r.periodLabel,
    modelType: r.modelType,
    forecastValue: r.forecastValue,
    lowerBound: r.lowerBound,
    upperBound: r.upperBound,
    actualValue: r.actualValue,
    confidenceScore: r.confidenceScore,
    mape: r.mape,
  }));
}

export async function getForecastAccuracy(companyId: number): Promise<{
  byMetric: Record<string, { avgMape: number; avgConfidence: number; count: number }>;
  byModel: Record<string, { avgMape: number; avgConfidence: number; count: number }>;
  overall: { avgMape: number; avgConfidence: number; totalForecasts: number };
}> {
  const results = await prisma.forecastResult.findMany({
    where: { companyId, actualValue: { not: null } },
  });

  const byMetric: Record<string, { avgMape: number; avgConfidence: number; count: number }> = {};
  const byModel: Record<string, { avgMape: number; avgConfidence: number; count: number }> = {};

  for (const r of results) {
    // By metric
    if (!byMetric[r.metricName]) byMetric[r.metricName] = { avgMape: 0, avgConfidence: 0, count: 0 };
    byMetric[r.metricName].avgMape += r.mape;
    byMetric[r.metricName].avgConfidence += r.confidenceScore;
    byMetric[r.metricName].count++;

    // By model
    if (!byModel[r.modelType]) byModel[r.modelType] = { avgMape: 0, avgConfidence: 0, count: 0 };
    byModel[r.modelType].avgMape += r.mape;
    byModel[r.modelType].avgConfidence += r.confidenceScore;
    byModel[r.modelType].count++;
  }

  for (const key of Object.keys(byMetric)) {
    byMetric[key].avgMape = roundFinancial(byMetric[key].avgMape / byMetric[key].count, 2);
    byMetric[key].avgConfidence = roundFinancial(byMetric[key].avgConfidence / byMetric[key].count, 2);
  }
  for (const key of Object.keys(byModel)) {
    byModel[key].avgMape = roundFinancial(byModel[key].avgMape / byModel[key].count, 2);
    byModel[key].avgConfidence = roundFinancial(byModel[key].avgConfidence / byModel[key].count, 2);
  }

  const totalMape = results.reduce((s, r) => s + r.mape, 0);
  const totalConf = results.reduce((s, r) => s + r.confidenceScore, 0);

  return {
    byMetric,
    byModel,
    overall: {
      avgMape: results.length > 0 ? roundFinancial(totalMape / results.length, 2) : 0,
      avgConfidence: results.length > 0 ? roundFinancial(totalConf / results.length, 2) : 0,
      totalForecasts: results.length,
    },
  };
}

export async function getAnomalies(
  companyId: number,
  severity?: string,
  status?: string,
): Promise<AnomalySummary[]> {
  const where: Record<string, unknown> = { companyId };
  if (severity) where.severity = severity;
  if (status) where.status = status;

  const results = await prisma.anomalyDetection.findMany({
    where,
    orderBy: { detectedAt: 'desc' },
  });

  return results.map((r) => ({
    id: r.id,
    metricName: r.metricName,
    detectedAt: r.detectedAt,
    severity: r.severity,
    direction: r.direction,
    expectedValue: r.expectedValue,
    actualValue: r.actualValue,
    deviationPct: r.deviationPct,
    explanation: r.explanation,
    status: r.status,
    relatedDrivers: r.relatedDrivers as string[],
  }));
}

export async function getInCycleEstimates(
  companyId: number,
  periodLabel?: string,
): Promise<InCycleSummary[]> {
  const where: Record<string, unknown> = { companyId };
  if (periodLabel) where.periodLabel = periodLabel;

  const results = await prisma.inCycleEstimate.findMany({
    where,
    orderBy: { metricName: 'asc' },
  });

  return results.map((r) => {
    const pctComplete = calculatePctComplete(r.daysThroughPeriod, r.totalDaysInPeriod);
    const flashVsForecast = calculateVariancePercent(r.flashEstimate, r.forecastValue);
    const flashVsBudget = calculateVariancePercent(r.flashEstimate, r.budgetValue);
    const flashVsPriorYear = calculateVariancePercent(r.flashEstimate, r.priorYearActual);

    return {
      metricName: r.metricName,
      periodLabel: r.periodLabel,
      mtdActual: r.mtdActual,
      qtdActual: r.qtdActual,
      flashEstimate: r.flashEstimate,
      forecastValue: r.forecastValue,
      budgetValue: r.budgetValue,
      priorYearActual: r.priorYearActual,
      daysThroughPeriod: r.daysThroughPeriod,
      totalDaysInPeriod: r.totalDaysInPeriod,
      lastUpdated: r.lastUpdated,
      pctComplete,
      flashVsForecast,
      flashVsBudget,
      flashVsPriorYear,
    };
  });
}
