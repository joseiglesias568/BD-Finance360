import type { KPIConfig, OperationsConfig } from '@/config/types';
import type { DBConsole } from '@/lib/db/repositories/consoles';

/**
 * Data passed from the server component (page.tsx) to the Building Operations client.
 */
export interface StoreOperationsPageData {
  kpis: KPIConfig;
  consoles: DBConsole[];
  opsConsole: DBConsole | null;
  operations: OperationsConfig;
  storeClusters: unknown[];
  laborMetrics: unknown[];
  customerSatisfaction: unknown[];
  storeRenovations: unknown[];
  storeFormatMix: unknown[];
}
