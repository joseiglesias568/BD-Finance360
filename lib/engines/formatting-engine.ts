// =============================================================================
// Shared Formatting Engine
// Single source of truth for number, currency, and percentage formatting
// across the platform
// =============================================================================

/**
 * Format a number with locale-aware separators and fixed decimal places.
 */
export function formatNumber(value: number, decimals: number = 1): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a value as currency with automatic scale (B/M/K).
 * Handles billions, millions, and thousands.
 */
export function formatCurrency(value: number, decimals: number = 1): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(decimals)}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(decimals)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(decimals)}K`;
  return `$${value.toFixed(decimals)}`;
}

/**
 * Format billions — input is already in billions.
 */
export function formatBillions(value: number, decimals: number = 1): string {
  return `$${formatNumber(value, decimals)}B`;
}

/**
 * Format millions — input is already in millions.
 */
export function formatMillions(value: number, decimals: number = 0): string {
  return `$${value.toFixed(decimals)}M`;
}

/**
 * Format a percentage value with optional sign indicator.
 * When signed is true (default), positive values get a '+' prefix.
 */
export function formatPercent(value: number, decimals: number = 1, signed: boolean = true): string {
  const sign = signed && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format a number with automatic scale (B/M/K) but no currency symbol.
 * Useful for chart labels and non-dollar metrics.
 */
export function formatCompact(value: number, decimals: number = 1): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(decimals)}B`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(decimals)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(decimals)}K`;
  return value.toFixed(decimals);
}

/**
 * Format basis points with sign (e.g. 40 → "+40 bps", -15 → "-15 bps").
 */
export function formatBasisPoints(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${Math.round(value)} bps`;
}

/**
 * Format a metric value based on its name (auto-detect currency vs percentage).
 */
export function formatMetricValue(
  value: number,
  metricName: string,
  dollarKeywords: string[] = ['Revenue', 'Operating Income', 'COGS', 'Net Income', 'SG&A', 'Gross Revenue less Fuel'],
): string {
  const lower = metricName.toLowerCase();

  // Check if it's a dollar metric
  if (dollarKeywords.some((kw) => lower.includes(kw.toLowerCase()))) {
    return formatCurrency(value);
  }

  // Check if it's a percentage metric
  if (lower.includes('%') || lower.includes('margin') || lower.includes('rate')) {
    return `${value.toFixed(1)}%`;
  }

  // Large numbers get abbreviated
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(1);
}

/**
 * Get the text color class for a variance value.
 */
export function getVarianceColor(value: number): string {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
}

/**
 * Get the text color class for a percentage change.
 */
export function getPctColor(value: number): string {
  return value >= 0 ? 'text-emerald-600' : 'text-red-500';
}

/**
 * Format a budget value in millions. >=1000 displays as billions.
 */
export function formatBudget(value: number, decimals: number = 1): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(decimals)}B`;
  return `$${value}M`;
}

/**
 * Safely format a value, returning '--' for null/undefined/NaN.
 */
export function formatOrDash(
  value: number | null | undefined,
  formatter: (v: number) => string = (v) => v.toString(),
): string {
  if (value == null || Number.isNaN(value)) return '--';
  return formatter(value);
}
