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
 * Data passed from the server component (page.tsx) to the International client.
 */
export interface InternationalPageData {
  kpis: KPIConfig;
  financials: FinancialConfig;
  consoles: DBConsole[];
  intlConsole: DBConsole | null;
  market: MarketConfig;
  strategic: StrategicConfig;
  operations: OperationsConfig;
  narrative: ExecutiveNarrativeData | null;
  regionalPerformance: unknown[];
  competitorMetrics: unknown[];
}
