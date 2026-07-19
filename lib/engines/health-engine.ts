// =============================================================================
// Shared Health / Status Determination Engine
// Single source of truth for RAG status, threshold classification,
// and health score calculations across the platform
// =============================================================================

/**
 * Standard status types used across the platform.
 */
export type HealthStatus = 'good' | 'warning' | 'critical';

/**
 * Determine health status based on actual vs target comparison.
 * For "higher is better" metrics (revenue, margin): actual >= target → good.
 * For "lower is better" metrics (costs, DSO): actual <= target → good.
 */
export function getMetricHealth(
  actual: number,
  target: number,
  lowerIsBetter: boolean = false,
): HealthStatus {
  if (lowerIsBetter) {
    return actual <= target ? 'good' : 'warning';
  }
  return actual >= target ? 'good' : 'warning';
}

/**
 * Determine health status using a tiered threshold system.
 * Returns 'good' if within the favorable threshold, 'warning' if marginal,
 * and 'critical' if beyond the critical threshold.
 */
export function getTieredHealth(
  value: number,
  thresholds: { good: number; warning: number },
  lowerIsBetter: boolean = false,
): HealthStatus {
  if (lowerIsBetter) {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'critical';
  }
  if (value >= thresholds.good) return 'good';
  if (value >= thresholds.warning) return 'warning';
  return 'critical';
}

/**
 * Get a heatmap color class based on a percentage value.
 * Used for segment performance heatmaps, organic growth, etc.
 */
export function getHeatmapColor(value: number): string {
  if (value > 5) return 'bg-green-600';
  if (value > 2) return 'bg-green-400';
  if (value > 0) return 'bg-green-200';
  if (value > -2) return 'bg-red-200';
  if (value > -5) return 'bg-red-400';
  return 'bg-red-600';
}

/**
 * Get the status color CSS classes for a given health status.
 */
export function getStatusColorClasses(status: HealthStatus | string): string {
  switch (status) {
    case 'good':
    case 'above':
    case 'excellent':
    case 'favorable':
    case 'completed':
      return 'text-green-600 bg-green-50';
    case 'warning':
    case 'below':
    case 'unfavorable':
    case 'at-risk':
      return 'text-yellow-600 bg-yellow-50';
    case 'on-track':
      return 'text-[#1c519c] bg-[#F0F0F0]';
    case 'critical':
    case 'behind':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * Get the status color CSS classes with border (for badge styling).
 */
export function getStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'good':
    case 'above':
    case 'excellent':
    case 'favorable':
    case 'on-track':
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'warning':
    case 'at-risk':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'critical':
    case 'behind':
    case 'below':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'in-progress':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'planned':
    case 'pending':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Get priority badge CSS classes (for high/medium/low priority labels).
 */
export function getPriorityColorClasses(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Get risk/severity badge CSS classes with border.
 */
export function getRiskSeverityClasses(level: string): string {
  switch (level.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Normalize a status string to a human-readable label.
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'on-track': return 'On Track';
    case 'at-risk': return 'At Risk';
    case 'behind': return 'Behind';
    case 'completed': return 'Completed';
    case 'in-progress': return 'In Progress';
    case 'planned': return 'Planned';
    case 'good': case 'above': case 'excellent': return 'Good';
    case 'warning': return 'Watch';
    case 'critical': case 'below': return 'Below';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

/**
 * Get the variance status display label.
 */
export function getVarianceLabel(
  variance: number,
  isExpense: boolean = false,
): { label: string; status: string } {
  const favorable = isExpense ? variance <= 0 : variance >= 0;
  return {
    label: favorable ? 'Above Plan' : 'Below Plan',
    status: favorable ? 'above' : 'below',
  };
}

/**
 * Classify a confidence score into a tier for display.
 */
export type ConfidenceTier = 'high' | 'medium' | 'low';

export function getConfidenceTier(
  score: number,
  thresholds: { high: number; medium: number } = { high: 85, medium: 70 },
): ConfidenceTier {
  if (score >= thresholds.high) return 'high';
  if (score >= thresholds.medium) return 'medium';
  return 'low';
}

/**
 * Get the confidence tier color for display.
 */
export function getConfidenceColor(tier: ConfidenceTier): string {
  switch (tier) {
    case 'high':
      return '#1c519c';
    case 'medium':
      return '#d97706';
    case 'low':
      return '#ef4444';
  }
}

/**
 * Classify MAPE (Mean Absolute Percentage Error) into quality tiers.
 */
export function getMAPETier(
  mape: number,
  thresholds: { excellent: number; acceptable: number } = { excellent: 3, acceptable: 7 },
): HealthStatus {
  if (mape <= thresholds.excellent) return 'good';
  if (mape <= thresholds.acceptable) return 'warning';
  return 'critical';
}

/**
 * Get close status label from completion percentage.
 */
export function getCloseStatus(completionPercent: number): string {
  if (completionPercent >= 90) return 'Almost Done';
  if (completionPercent >= 50) return 'On Track';
  return 'In Progress';
}
