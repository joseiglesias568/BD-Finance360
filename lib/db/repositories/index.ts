// =============================================================================
// Data Access Layer — Repository Pattern
// All functions return data shaped to match existing ClientConfig interfaces
// =============================================================================

import prisma from '../prisma';

/** Resolve the active company ID (first company in the DB) */
let _cachedCompanyId: number | null = null;
export async function getActiveCompanyId(): Promise<number> {
  if (_cachedCompanyId !== null) return _cachedCompanyId;
  const company = await prisma.company.findFirst({ select: { id: true } });
  _cachedCompanyId = company?.id ?? 1;
  return _cachedCompanyId;
}

export { getCompanyBranding } from './company';
export { getFinancials } from './financials';
export { getKPIs, getKPITimeSeries } from './kpis';
export { getOperations } from './operations';
export { getStrategic } from './strategic';
export { getMarket } from './market';
export { getScenarios } from './scenarios';
export { getAlerts } from './alerts';
export { getReports, getReportById, searchReports } from './reports';
export { getMonthEnd, deriveMonthEndExtra } from './month-end';
export { getPersonalizedInsights, searchInsights } from './insights';
export { getCommentary, searchCommentary, createCommentary, updateCommentary, deleteCommentary, getCommentaryByDriver, getCommentaryByConsole } from './commentary';
export { getBusinessConsoles, getConsoleWithDrivers, getConsoleDriverTree } from './consoles';
export {
  getExecutiveNarrative,
  getBusinessPillars,
  getCriticalActions,
  getForwardInsights,
  getExecutiveBriefing,
  getBusinessInsights,
  getRiskOpportunities,
} from './executive';

// Layer 1+2: Data Platform
export {
  getDataSources,
  getDataFlows,
  getDataQualityDashboard,
  getMasterDataOverview,
} from './data-platform';

// Layer 3+4: Analytics Products + EPM
export {
  getForecasts,
  getForecastAccuracy,
  getAnomalies,
  getInCycleEstimates,
} from './analytics';

// EPM Configuration
export {
  getPlanningMilestones,
  getPlatformConfig,
  getDriverForecasts,
} from './epm-config';

// EPM Page Data (DB-backed)
export { getBridgeWalkData } from './epm-bridge';
export { getROData } from './epm-risks';
export { getMLForecastData } from './epm-forecasting';
export { getFiscalYearData } from './epm-fiscal-year';
export { getShortTermPlanningData, getLongTermPlanningData } from './epm-planning';

// Chat
export { listThreads, createThread, getThread, deleteThread, renameThread, addMessage, autoTitleThread } from './chat';

// Enrichment Layer: Dimensional data for rich AI analysis
export {
  getMonthlyFinancials,
  getRegionalPerformance,
  getProductPerformance,
  getDaypartPerformance,
  getCostDrivers,
  getVarianceExplanations,
  getWeeklySnapshots,
  getStoreClusters,
  getElasticityFactors,
  getCompetitorMetrics,
} from './enrichment';

// Enhancement Layer: Strategy, commodity, FX, labor, CSAT, promotions, store format/renovation
export {
  getStrategyExecution,
  getCommodityPrices,
  getFXImpacts,
  getLaborMetrics,
  getCustomerSatisfactionData,
  getPromotionalCalendarData,
  getStoreFormatMixData,
  getStoreRenovationData,
} from './enhancement-queries';

// Types
export type { DBInsight } from './insights';
export type { DBCommentary } from './commentary';
export type { DBConsole, ConsoleTree, DriverTreeNode } from './consoles';
export type { DataSourceSummary, DataFlowSummary, DQDashboard, MDMOverview } from './data-platform';
export type { ForecastSummary, AnomalySummary, InCycleSummary } from './analytics';
export type { PlanningMilestoneSummary, DriverForecastSummary, ParsedConfig } from './epm-config';
export type { BridgeQuarter, BridgeItem, BridgePLLine } from './epm-bridge';
export type { ROItem, ROAdjustmentResult, ROData } from './epm-risks';
export type { PLForecastData, PLPeriod, PLForecastRow, DriverForecastRow } from './epm-forecasting';
export type { FiscalYearPlanData, FiscalYearMetric, QuarterlyBreakdown } from './epm-fiscal-year';
export type { ShortTermPlanningData, LongTermPlanningData, PlanningLever, PLResult, PlanningImpact, LongTermProjection } from './epm-planning';
