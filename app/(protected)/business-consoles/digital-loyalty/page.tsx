import {
  getActiveCompanyId,
  getKPIs,
  getFinancials,
  getBusinessConsoles,
  getOperations,
} from '@/lib/db/repositories';
import DigitalLoyaltyClient from './DigitalLoyaltyClient';
import type { DigitalLoyaltyPageData } from './types';

export const dynamic = 'force-dynamic';

export default async function DigitalLoyaltyPage() {
  const companyId = await getActiveCompanyId();

  const [kpis, financials, consoles, operations] = await Promise.all([
    getKPIs(companyId),
    getFinancials(companyId),
    getBusinessConsoles(companyId),
    getOperations(companyId),
  ]);

  // Find the Digital/Platform console
  const digitalConsole = consoles.find(
    (c) => c.segment.toLowerCase().includes('digital') || c.title.toLowerCase().includes('digital') || c.title.toLowerCase().includes('platform')
  ) ?? null;

  const data: DigitalLoyaltyPageData = {
    kpis,
    financials,
    consoles,
    digitalConsole,
    operations,
  };

  return <DigitalLoyaltyClient data={data} />;
}
