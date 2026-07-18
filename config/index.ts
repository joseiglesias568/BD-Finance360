// ============================================================
// Client Configuration
// ============================================================
// To switch clients, change the import below to the desired
// client config directory. Each client has their own folder
// under /config/clients/<client-name>/
// ============================================================

import clientConfig from './clients/bd';

// Re-export all types for convenience
export type {
  AdjustmentEntry,
  AlertsConfig,
  AlertTemplate,
  BalanceSheetLineItem,
  BrandColors,
  BrandingConfig,
  BridgeItem,
  ClientConfig,
  CloseTask,
  CompetitorData,
  FinancialConfig,
  FinancialLineItem,
  ForwardOutlookItem,
  HypothesesConfig,
  HypothesisTest,
  InsightChartData,
  InsightChartDataPoint,
  InsightChartsConfig,
  InsightChartStats,
  InsightChartTrendPoint,
  JournalEntryDetail,
  KPIConfig,
  KPIMetric,
  Location,
  MarketConfig,
  MonthEndConfig,
  MonthEndExtraConfig,
  MonthEndFinancialResults,
  OperationsConfig,
  PhaseDisplay,
  PLLineItem,
  PreBuiltScenario,
  QuarterData,
  ReportTemplate,
  ReportsConfig,
  RiskItem,
  ScenarioConfig,
  ScenarioLever,
  SegmentData,
  StrategicConfig,
  StrategicInitiative,
  SupplyChainMetric,
  VolumeTrendPoint,
  WaterfallStep,
} from './types';

// Export the active client configuration
export const config = clientConfig;

// Export individual config sections for convenience
// NOTE: Most DB-backed data (financials, kpis, operations, strategic, market,
// alerts, reports, scenarios, monthEnd) should be fetched at runtime via
// lib/db/repositories/ in server components. These static exports are used
// only by: login page (branding), home page (insightCharts), sandbox (hypotheses).
export const {
  branding,
  financials,
  kpis,
  operations,
  scenarios,
  strategic,
  market,
  alerts,
  reports,
  monthEnd,
  insightCharts,
  hypotheses,
  monthEndExtra,
} = clientConfig;

export default clientConfig;
