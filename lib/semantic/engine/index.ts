// ════════════════════════════════════════════════════════════════════════════
// SEMANTIC ENGINE — BARREL EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// Core engine
export { SemanticEngine } from './engine';

// Types
export type {
  NumericValue,
  TargetRange,
  GapResult,
  ComputedMetric,
  ComputedDriver,
  ComputedConsole,
  CrossReference,
  DriverEdge,
  GraphNode,
  FormulaDefinition,
  FormulaContext,
  WhatIfAssumption,
  WhatIfResult,
  WhatIfScenario,
  DataConnector,
  SemanticEngineConfig,
  MetricUnit,
  MetricDirection,
  MetricStatus,
} from './types';

// Sub-modules (for advanced usage)
export { DriverGraph } from './graph';
export { FormulaRegistry, evaluateFormula, getFormulaDescriptions } from './formulas';
export { WhatIfEngine } from './what-if';
export { StaticConnector } from './connectors/static-connector';
export { PrismaConnector } from './connectors/prisma-connector';

// Formatter utilities
export {
  parseDisplayValue,
  formatValue,
  parseTargetRange,
  computeGap,
  computeHealthScore,
  inferStatus,
} from './formatter';
