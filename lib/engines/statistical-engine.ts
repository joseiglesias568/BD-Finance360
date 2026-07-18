// =============================================================================
// Shared Statistical Calculation Engine
// Single source of truth for percentiles, distributions, confidence intervals,
// and Monte Carlo helpers across the platform
// =============================================================================

/**
 * Calculate a percentile from a sorted array of values.
 */
export function calculatePercentile(sortedValues: number[], p: number): number {
  const idx = Math.floor(sortedValues.length * (p / 100));
  return sortedValues[Math.min(idx, sortedValues.length - 1)];
}

/**
 * Calculate the mean (average) of an array of numbers.
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate population standard deviation.
 */
export function calculateStdDev(values: number[], mean?: number): number {
  if (values.length === 0) return 0;
  const m = mean ?? calculateMean(values);
  const variance = values.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculate a 95% confidence interval for the mean.
 */
export function calculateConfidence95(
  mean: number,
  stdDev: number,
  n: number,
): { lower: number; upper: number } {
  const margin = (1.96 * stdDev) / Math.sqrt(n);
  return { lower: mean - margin, upper: mean + margin };
}

/**
 * Generate a standard deviation estimate from confidence interval bounds.
 * Assumes the CI was constructed at a given z-level (default: 90% CI → z = 1.645).
 */
export function stdDevFromCI(
  lowerBound: number,
  upperBound: number,
  z: number = 1.645,
): number {
  return (upperBound - lowerBound) / (2 * z);
}

/**
 * Build a discrete normal-distribution bell-curve dataset.
 * Used for Monte Carlo distribution visualization.
 */
export function buildNormalDistribution(
  mean: number,
  stdDev: number,
  points: number = 50,
): { x: number; density: number }[] {
  if (stdDev <= 0) return [{ x: mean, density: 1 }];

  const data: { x: number; density: number }[] = [];
  const lo = mean - 3.5 * stdDev;
  const hi = mean + 3.5 * stdDev;
  const step = (hi - lo) / (points - 1);

  for (let i = 0; i < points; i++) {
    const x = lo + i * step;
    const z = (x - mean) / stdDev;
    const density =
      (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
    data.push({ x: parseFloat(x.toFixed(2)), density });
  }
  return data;
}

/**
 * Calculate a percentile value from a normal distribution using z-score lookup.
 * Beasley-Springer-Moro approximation for common percentiles.
 */
const Z_SCORES: Record<number, number> = {
  1: -2.3263,
  5: -1.6449,
  10: -1.2816,
  25: -0.6745,
  50: 0,
  75: 0.6745,
  90: 1.2816,
  95: 1.6449,
  99: 2.3263,
};

export function normalPercentile(mean: number, stdDev: number, p: number): number {
  const z = Z_SCORES[p] ?? 0;
  return mean + z * stdDev;
}

/**
 * Generate a normally-distributed random number using the Box-Muller-like
 * central limit theorem approximation (sum of 3 uniforms).
 * Returns a value centered on 0 with approximate stdDev of `volatility`.
 */
export function normalRandom(volatility: number = 1): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) * volatility;
}

/**
 * Compute summary statistics for an array of simulation results.
 */
export interface SimulationStats {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  mean: number;
  stdDev: number;
  confidence95Lower: number;
  confidence95Upper: number;
}

export function computeSimulationStats(values: number[]): SimulationStats {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = calculateMean(sorted);
  const stdDev = calculateStdDev(sorted, mean);
  const ci = calculateConfidence95(mean, stdDev, n);

  return {
    p10: sorted[Math.floor(n * 0.1)],
    p25: sorted[Math.floor(n * 0.25)],
    p50: sorted[Math.floor(n * 0.5)],
    p75: sorted[Math.floor(n * 0.75)],
    p90: sorted[Math.floor(n * 0.9)],
    mean,
    stdDev,
    confidence95Lower: ci.lower,
    confidence95Upper: ci.upper,
  };
}
