import type { FinancialConfig, KPIConfig, OperationsConfig } from '@/config/types';
import type { DBConsole } from '@/lib/db/repositories/consoles';

/**
 * Data passed from the server component (page.tsx) to the Digital & Platform client.
 */
export interface DigitalLoyaltyPageData {
  kpis: KPIConfig;
  financials: FinancialConfig;
  consoles: DBConsole[];
  digitalConsole: DBConsole | null;
  operations: OperationsConfig;
}
