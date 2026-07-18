// =============================================================================
// Shared Variance Calculation Engine
// Single source of truth for all variance computations across the platform
// =============================================================================

/**
 * Calculate variance between actual and baseline values.
 * Returns the absolute difference.
 */
export function calculateVariance(actual: number, baseline: number): number {
  return actual - baseline;
}

/**
 * Calculate variance percentage between actual and baseline.
 * Uses Math.abs(baseline) in the denominator to handle negative baselines correctly.
 * Returns one decimal place precision (e.g. 5.3 for 5.3%).
 */
export function calculateVariancePercent(actual: number, baseline: number): number {
  if (baseline === 0) return 0;
  return Math.round(((actual - baseline) / Math.abs(baseline)) * 1000) / 10;
}

/**
 * Determine if a variance is favorable based on metric type.
 * For cost metrics (COGS, expenses, etc.), lower actual is favorable.
 * For revenue/income metrics, higher actual is favorable.
 */
export function isFavorable(variance: number, isCostMetric: boolean): boolean {
  return isCostMetric ? variance <= 0 : variance >= 0;
}

/**
 * Check if a metric name represents a cost metric (where lower is better).
 * Uses config-driven keywords for matching.
 */
export function isCostMetricByName(
  metricName: string,
  costKeywords: string[] = ['cogs', 'expense', 'sg&a', 'cost', 'labor', 'occupancy'],
): boolean {
  const lower = metricName.toLowerCase();
  return costKeywords.some((kw) => lower.includes(kw.toLowerCase()));
}

/**
 * Get the variance status label based on the variance percentage and thresholds.
 */
export type VarianceStatus = 'on-track' | 'favorable' | 'unfavorable';

export function getVarianceStatus(
  variancePct: number,
  isCostMetric: boolean,
  onTrackThreshold: number = 1,
): VarianceStatus {
  if (Math.abs(variancePct) < onTrackThreshold) return 'on-track';
  return isFavorable(variancePct, isCostMetric) ? 'favorable' : 'unfavorable';
}

/**
 * Calculate period completion percentage.
 */
export function calculatePctComplete(
  daysThroughPeriod: number,
  totalDaysInPeriod: number,
): number {
  if (totalDaysInPeriod <= 0) return 0;
  return Math.round((daysThroughPeriod / totalDaysInPeriod) * 1000) / 10;
}

/**
 * Batch-compute flash vs forecast/budget/prior year variances for in-cycle estimates.
 */
export interface InCycleVariances {
  pctComplete: number;
  flashVsForecast: number;
  flashVsBudget: number;
  flashVsPriorYear: number;
}

export function calculateInCycleVariances(
  flashEstimate: number,
  forecastValue: number,
  budgetValue: number,
  priorYearActual: number,
  daysThroughPeriod: number,
  totalDaysInPeriod: number,
): InCycleVariances {
  return {
    pctComplete: calculatePctComplete(daysThroughPeriod, totalDaysInPeriod),
    flashVsForecast: calculateVariancePercent(flashEstimate, forecastValue),
    flashVsBudget: calculateVariancePercent(flashEstimate, budgetValue),
    flashVsPriorYear: calculateVariancePercent(flashEstimate, priorYearActual),
  };
}
