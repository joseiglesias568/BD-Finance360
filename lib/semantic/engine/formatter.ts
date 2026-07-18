// ════════════════════════════════════════════════════════════════════════════
// SEMANTIC ENGINE — VALUE FORMATTER
// ════════════════════════════════════════════════════════════════════════════
// Bidirectional conversion between display strings and numeric values.
// Handles the full range of formats found in the semantic model:
//   "$6.85", "+1%", "~450", "$9.4B", "31.4%", "+120bps", "57%", "1.6"
// ════════════════════════════════════════════════════════════════════════════

import type {
  MetricUnit,
  MetricDirection,
  MetricStatus,
  NumericValue,
  TargetRange,
  GapResult,
  ComputedMetric,
} from './types';

// ── Parse Display String → NumericValue ───────────────────────────────────

/**
 * Parse a display string like "$6.85", "+1%", "~450", "$9.4B" into a NumericValue.
 * Handles: currency prefixes, percent suffixes, tilde approximations, B/M/K suffixes,
 * basis points (bps), and plus/minus signs.
 */
export function parseDisplayValue(displayStr: string | undefined, unit: MetricUnit): NumericValue | null {
  if (!displayStr || displayStr.trim() === '' || displayStr === 'N/A') return null;

  let s = displayStr.trim();

  // Remove tilde approximation
  s = s.replace(/^~/, '');

  // Remove currency symbol
  s = s.replace(/^\$/, '');

  // Handle suffixes (B = billions, M = millions, K = thousands)
  let multiplier = 1;
  if (/[Bb]$/.test(s)) {
    multiplier = 1_000_000_000;
    s = s.replace(/[Bb]$/, '');
  } else if (/[Mm]$/.test(s)) {
    multiplier = 1_000_000;
    s = s.replace(/[Mm]$/, '');
  } else if (/[Kk]$/.test(s)) {
    multiplier = 1_000;
    s = s.replace(/[Kk]$/, '');
  }

  // Remove percent sign and bps
  const isBps = /bps$/i.test(s);
  s = s.replace(/%$/, '').replace(/bps$/i, '');

  // Remove commas
  s = s.replace(/,/g, '');

  // Remove any trailing non-numeric chars (e.g., "x", "+")
  s = s.replace(/[^0-9.+-]/g, '');

  const raw = parseFloat(s);
  if (isNaN(raw)) return null;

  const value = raw * (multiplier > 1 ? multiplier : 1);
  // For display purposes, keep the original raw when multiplier is used for B/M/K
  const displayRaw = multiplier > 1 ? raw : value;

  return {
    raw: isBps ? raw / 100 : (multiplier > 1 ? value : raw),
    unit,
    display: displayStr.trim(),
  };
}

// ── Format NumericValue → Display String ──────────────────────────────────

export interface FormatOptions {
  /** Number of decimal places */
  decimals?: number;
  /** Show + for positive numbers */
  showSign?: boolean;
  /** Use B/M/K abbreviation */
  abbreviate?: boolean;
}

/**
 * Format a raw number into a display string based on unit type.
 */
export function formatValue(raw: number, unit: MetricUnit, opts: FormatOptions = {}): string {
  const { decimals, showSign = false, abbreviate = true } = opts;

  const sign = showSign && raw > 0 ? '+' : '';

  switch (unit) {
    case 'currency': {
      if (abbreviate) {
        if (Math.abs(raw) >= 1_000_000_000) {
          const d = decimals ?? 1;
          return `${sign}$${(raw / 1_000_000_000).toFixed(d)}B`;
        }
        if (Math.abs(raw) >= 1_000_000) {
          const d = decimals ?? 0;
          return `${sign}$${(raw / 1_000_000).toFixed(d)}M`;
        }
        if (Math.abs(raw) >= 1_000) {
          const d = decimals ?? 0;
          return `${sign}$${(raw / 1_000).toFixed(d)}K`;
        }
      }
      const d = decimals ?? 2;
      return `${sign}$${raw.toFixed(d)}`;
    }

    case 'percent': {
      const d = decimals ?? 1;
      return `${sign}${raw.toFixed(d)}%`;
    }

    case 'count': {
      if (abbreviate && Math.abs(raw) >= 1_000_000) {
        return `${sign}${(raw / 1_000_000).toFixed(decimals ?? 1)}M`;
      }
      if (abbreviate && Math.abs(raw) >= 1_000) {
        return `${sign}${(raw / 1_000).toFixed(decimals ?? 0)}K`;
      }
      return `${sign}${Math.round(raw).toLocaleString()}`;
    }

    case 'ratio': {
      const d = decimals ?? 2;
      return `${sign}${raw.toFixed(d)}`;
    }

    case 'time': {
      const d = decimals ?? 1;
      return `${sign}${raw.toFixed(d)} min`;
    }

    case 'score':
    case 'index': {
      const d = decimals ?? 1;
      return `${sign}${raw.toFixed(d)}`;
    }

    default:
      return `${sign}${raw.toFixed(decimals ?? 2)}`;
  }
}

// ── Parse Target Range ────────────────────────────────────────────────────

/**
 * Parse target strings which may be ranges: "+4-6%", "$6.50-$7.00", "450-500"
 * or single values: "+2%", "$6.85", "450"
 */
export function parseTargetRange(targetStr: string | undefined, unit: MetricUnit): TargetRange | null {
  if (!targetStr || targetStr.trim() === '' || targetStr === 'N/A') return null;

  const s = targetStr.trim();

  // Check for range pattern: "X-Y" (but not negative like "-2%")
  // Match patterns like "+4-6%", "4-6%", "$6.50-$7.00", "450-500", "2-3%"
  const rangeMatch = s.match(/^([+$]?\d+\.?\d*)\s*[-–]\s*\$?(\d+\.?\d*)\s*(%?)$/);
  if (rangeMatch) {
    const lowStr = rangeMatch[1].replace(/^[+$]/, '');
    const highStr = rangeMatch[2];
    const low = parseFloat(lowStr);
    const high = parseFloat(highStr);
    if (!isNaN(low) && !isNaN(high)) {
      return {
        low,
        high,
        midpoint: (low + high) / 2,
        display: s,
      };
    }
  }

  // Single value — parse as NumericValue
  const parsed = parseDisplayValue(s, unit);
  if (parsed) {
    return {
      low: parsed.raw,
      high: parsed.raw,
      midpoint: parsed.raw,
      display: s,
    };
  }

  return null;
}

// ── Gap Computation ───────────────────────────────────────────────────────

/**
 * Compute the gap between actual value and target, and determine status.
 */
export function computeGap(
  value: NumericValue,
  target: TargetRange,
  direction: MetricDirection
): GapResult {
  const gap = value.raw - target.midpoint;
  const absTarget = Math.abs(target.midpoint);
  const gapPercent = absTarget > 0 ? (gap / absTarget) * 100 : 0;

  let status: MetricStatus;
  if (direction === 'on_target') {
    // For on_target metrics, being close to target is good
    const deviation = Math.abs(gapPercent);
    status = deviation <= 5 ? 'good' : deviation <= 15 ? 'warning' : 'critical';
  } else if (direction === 'higher_is_better') {
    // Positive gap is good (actual > target)
    if (gap >= 0) {
      status = 'good';
    } else if (gapPercent >= -15) {
      status = 'warning';
    } else {
      status = 'critical';
    }
  } else {
    // lower_is_better: negative gap is good (actual < target)
    if (gap <= 0) {
      status = 'good';
    } else if (gapPercent <= 15) {
      status = 'warning';
    } else {
      status = 'critical';
    }
  }

  const unit = value.unit;
  return {
    gap,
    gapPercent,
    status,
    display: formatValue(gap, unit, { showSign: true, decimals: 1 }),
  };
}

// ── Health Score ───────────────────────────────────────────────────────────

/**
 * Compute an aggregate health score (0-100) from a set of computed metrics.
 * Good = 100, Warning = 50, Critical = 0, averaged across metrics.
 */
export function computeHealthScore(metrics: ComputedMetric[]): number {
  if (metrics.length === 0) return 50; // Neutral if no metrics

  const scores = metrics.map(m => {
    switch (m.status) {
      case 'good': return 100;
      case 'warning': return 50;
      case 'critical': return 0;
    }
  });

  return Math.round((scores as number[]).reduce((sum, s) => sum + s, 0) / scores.length);
}

// ── Infer Status Without Target ───────────────────────────────────────────

/**
 * When no target is available, infer status from the value itself.
 * Positive growth → good, flat → warning, negative → critical.
 */
export function inferStatus(value: NumericValue, direction: MetricDirection): MetricStatus {
  if (direction === 'higher_is_better') {
    if (value.raw > 0) return 'good';
    if (value.raw === 0) return 'warning';
    return 'critical';
  }
  if (direction === 'lower_is_better') {
    if (value.raw < 0) return 'good';
    if (value.raw === 0) return 'warning';
    return 'critical';
  }
  return 'warning'; // on_target without target → unknown
}
