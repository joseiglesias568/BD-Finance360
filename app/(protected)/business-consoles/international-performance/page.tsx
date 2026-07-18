import {
  getActiveCompanyId,
  getKPIs,
  getFinancials,
  getBusinessConsoles,
  getMarket,
  getStrategic,
  getOperations,
  getExecutiveNarrative,
  getRegionalPerformance,
  getCompetitorMetrics,
} from '@/lib/db/repositories';
import InternationalClient from './InternationalClient';
import type { InternationalPageData } from './types';

export const dynamic = 'force-dynamic';

export default async function InternationalPerformancePage() {
  const companyId = await getActiveCompanyId();

  const [kpis, financials, consoles, market, strategic, operations, narrative, regionalPerformance, competitorMetrics] = await Promise.all([
    getKPIs(companyId),
    getFinancials(companyId),
    getBusinessConsoles(companyId),
    getMarket(companyId),
    getStrategic(companyId),
    getOperations(companyId),
    getExecutiveNarrative(companyId),
    getRegionalPerformance(companyId),
    getCompetitorMetrics(companyId),
  ]);

  // Find the International console specifically
  const intlConsole = consoles.find(
    (c) => c.segment.toLowerCase().includes('international') || c.title.toLowerCase().includes('international')
  ) ?? null;

  const data: InternationalPageData = {
    kpis,
    financials,
    consoles,
    intlConsole,
    market,
    strategic,
    operations,
    narrative,
    regionalPerformance,
    competitorMetrics,
  };

  return <InternationalClient data={data} />;
}
