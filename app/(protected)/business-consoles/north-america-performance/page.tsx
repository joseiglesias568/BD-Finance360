import {
  getActiveCompanyId,
  getKPIs,
  getFinancials,
  getBusinessConsoles,
  getMarket,
  getStrategic,
  getOperations,
  getExecutiveNarrative,
} from '@/lib/db/repositories';
import NorthAmericaClient from './NorthAmericaClient';
import type { ConsolePageData } from './types';

export const dynamic = 'force-dynamic';

export default async function NorthAmericaPerformancePage() {
  const companyId = await getActiveCompanyId();

  const [kpis, financials, consoles, market, strategic, operations, narrative] = await Promise.all([
    getKPIs(companyId),
    getFinancials(companyId),
    getBusinessConsoles(companyId),
    getMarket(companyId),
    getStrategic(companyId),
    getOperations(companyId),
    getExecutiveNarrative(companyId),
  ]);

  // Find the North America console specifically
  const naConsole = consoles.find(
    (c) => c.segment.toLowerCase().includes('north america') || c.title.toLowerCase().includes('north america')
  ) ?? null;

  const data: ConsolePageData = {
    kpis,
    financials,
    consoles,
    naConsole,
    market,
    strategic,
    operations,
    narrative,
  };

  return <NorthAmericaClient data={data} />;
}
