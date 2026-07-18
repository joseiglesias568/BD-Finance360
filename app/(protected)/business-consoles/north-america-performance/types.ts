import type { FinancialConfig, KPIConfig, MarketConfig, StrategicConfig, OperationsConfig } from '@/config/types';
import type { DBConsole } from '@/lib/db/repositories/consoles';

/** Shape returned by getExecutiveNarrative */
export interface ExecutiveNarrativeData {
  overallStatus: string;
  statusColor: string;
  narrative: string;
  keyAchievements: string[];
  concerns: string[];
}

/**
 * Data passed from the server component (page.tsx) to all sub-components.
 * Each sub-component uses the fields it needs and falls back to hardcoded
 * values for any data not yet available in the database.
 */
export interface ConsolePageData {
  /** KPI metrics by category (primary, operational, digital, financial) */
  kpis: KPIConfig;
  /** Financial data: quarters, segments, P&L, revenue bridge, ratios */
  financials: FinancialConfig;
  /** Business console driver trees with metrics */
  consoles: DBConsole[];
  /** The specific North America console (if found) */
  naConsole: DBConsole | null;
  /** Market/competitive data: competitors, regional breakdown, drivers */
  market: MarketConfig;
  /** Strategic initiatives, risks, forward outlook, opportunities */
  strategic: StrategicConfig;
  /** Operations: locations, supply chain, digital metrics */
  operations: OperationsConfig;
  /** Executive narrative for the period */
  narrative: ExecutiveNarrativeData | null;
}
