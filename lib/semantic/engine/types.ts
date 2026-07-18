// ════════════════════════════════════════════════════════════════════════════
// SEMANTIC ENGINE — TYPE DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════
// Core types for the computation engine layer that sits between the static
// semantic definitions and consumers (AI, UI, API).
// ════════════════════════════════════════════════════════════════════════════

import type { SemanticMetric, SemanticDriver, SemanticConsole } from '../types';

// Re-export base types for convenience
export type { SemanticMetric, SemanticDriver, SemanticConsole };

// ── Unit & Direction Types ────────────────────────────────────────────────

export type MetricUnit = SemanticMetric['unit'];
export type MetricDirection = SemanticMetric['direction'];
export type MetricStatus = 'good' | 'warning' | 'critical';

// ── Numeric Value ─────────────────────────────────────────────────────────

/** A parsed, numeric representation of a metric value */
export interface NumericValue {
  /** The raw numeric value (e.g., 6.85, -2, 450) */
  raw: number;
  /** The unit type from the semantic model */
  unit: MetricUnit;
  /** Formatted display string (e.g., "$6.85", "-2%", "450") */
  display: string;
  /** Optional period identifier */
  periodId?: string;
}

/** Parsed target range (handles ranges like "+4-6%") */
export interface TargetRange {
  low: number;
  high: number;
  midpoint: number;
  display: string;
}

/** Gap computation result */
export interface GapResult {
  gap: number;
  gapPercent: number;
  status: MetricStatus;
  display: string;
}

// ── Computed Metric ───────────────────────────────────────────────────────

/** A metric enriched with parsed numeric values and computed status */
export interface ComputedMetric {
  /** Original metric ID */
  id: string;
  name: string;
  description: string;
  /** Parsed numeric value */
  value: NumericValue;
  /** Parsed target (midpoint of range if applicable) */
  target?: NumericValue;
  /** Computed gap: value vs target */
  gap?: GapResult;
  direction: MetricDirection;
  /** Computed from gap analysis */
  status: MetricStatus;
  /** Formula expression if this metric is computed */
  formula?: string;
  /** Where the value came from */
  source: 'static' | 'computed' | 'database';
  /** Original frequency from semantic model */
  frequency: SemanticMetric['frequency'];
  /** Original unit */
  unit: MetricUnit;
}

// ── Computed Driver ───────────────────────────────────────────────────────

/** A driver node enriched with computed metrics, resolved cross-references, and graph metadata */
export interface ComputedDriver {
  id: string;
  name: string;
  description: string;
  /** Which console this driver belongs to */
  consoleId: string;
  /** Computed metrics with numeric values and status */
  metrics: ComputedMetric[];
  /** Computed child drivers (recursive) */
  children: ComputedDriver[];
  /** Resolved cross-references with full context */
  crossReferences: CrossReference[];
  /** Contribution weight to parent (0-1) */
  causalWeight?: number;
  /** Whether this driver pushes parent up or down */
  impactDirection?: 'positive' | 'negative' | 'mixed';
  /** Aggregate health score (0-100) from metrics */
  healthScore: number;
  /** Depth in the driver tree (0 = top-level) */
  depth: number;
  /** Breadcrumb path: ["North America Performance", "Organic Growth", "Transactions"] */
  path: string[];
}

/** Computed console with aggregate statistics */
export interface ComputedConsole {
  id: string;
  title: string;
  category: string;
  segment: SemanticConsole['segment'];
  objective: string;
  drivers: ComputedDriver[];
  /** Aggregate stats */
  totalDrivers: number;
  totalMetrics: number;
  avgHealthScore: number;
  criticalCount: number;
  warningCount: number;
}

// ── Cross-References ──────────────────────────────────────────────────────

/** A resolved cross-reference with full context (not just an ID) */
export interface CrossReference {
  sourceDriverId: string;
  sourceDriverName: string;
  sourceConsoleId: string;
  targetDriverId: string;
  targetDriverName: string;
  targetConsoleId: string;
  targetConsoleName: string;
  /** Inferred relationship type */
  relationship: 'drives' | 'correlated' | 'component-of' | 'related';
  weight?: number;
}

// ── Driver Graph ──────────────────────────────────────────────────────────

/** An edge in the driver relationship graph */
export interface DriverEdge {
  from: string;
  to: string;
  type: 'parent-child' | 'cross-reference';
  /** Causal weight (0-1, defaults to equal weight among siblings) */
  weight: number;
  direction: 'positive' | 'negative' | 'mixed';
  /** For cross-references: which console the target is in */
  targetConsoleId?: string;
}

/** Node metadata stored in the graph */
export interface GraphNode {
  id: string;
  name: string;
  consoleId: string;
  depth: number;
  parentId: string | null;
  metricIds: string[];
}

// ── Formulas ──────────────────────────────────────────────────────────────

/** A formula definition mapping a metric to its computation */
export interface FormulaDefinition {
  /** The metric ID this formula computes */
  metricId: string;
  /** Formula expression (e.g., "ref(na-txn-growth) + ref(na-ticket-growth)") */
  expression: string;
  /** Metric IDs that this formula depends on */
  inputs: string[];
  /** Expected output unit */
  outputUnit: MetricUnit;
  /** Human-readable description */
  description?: string;
}

/** Context for formula evaluation: a map of metric-id → numeric value */
export type FormulaContext = Map<string, number>;

// ── What-If Scenarios ─────────────────────────────────────────────────────

/** A single assumption in a what-if scenario */
export interface WhatIfAssumption {
  driverId: string;
  metricId: string;
  originalValue: NumericValue;
  newValue: NumericValue;
  changePercent: number;
}

/** A single impact result from what-if propagation */
export interface WhatIfResult {
  driverId: string;
  driverName: string;
  metricId: string;
  metricName: string;
  originalValue: NumericValue;
  projectedValue: NumericValue;
  impact: NumericValue;
  /** The chain of drivers through which the impact propagated */
  impactPath: string[];
  /** Confidence based on causal weight chain (product of weights) */
  confidence: number;
}

/** A complete what-if scenario with assumptions and results */
export interface WhatIfScenario {
  id: string;
  name: string;
  assumptions: WhatIfAssumption[];
  results: WhatIfResult[];
  /** Summary: total impact on key P&L metrics */
  summary: {
    revenueImpact?: NumericValue;
    marginImpactBps?: number;
    epsImpact?: NumericValue;
  };
  timestamp: number;
}

// ── Data Connector Interface ──────────────────────────────────────────────

/** Abstract interface for data sources (static, Prisma, Databricks) */
export interface DataConnector {
  readonly name: string;
  /** Get a single metric value */
  getMetricValue(metricId: string, periodId?: string): NumericValue | null;
  /** Get time series for a metric */
  getMetricTimeSeries(metricId: string, periods: number): NumericValue[];
  /** Get all metric values for a driver */
  getDriverMetrics(driverId: string): Map<string, NumericValue>;
  /** Get elasticity factor between two metrics */
  getElasticity(driverMetric: string, impactedMetric: string): number | null;
}

// ── Engine Configuration ──────────────────────────────────────────────────

export interface SemanticEngineConfig {
  /** Which data connector to use */
  connector?: DataConnector;
  /** Whether to eagerly compute all metrics on init */
  eagerCompute?: boolean;
  /** Max depth for graph traversal in what-if */
  maxWhatIfDepth?: number;
  /** Max depth for related driver searches */
  maxGraphSearchDepth?: number;
}
