import { getActiveCompanyId, getROData } from '@/lib/db/repositories';
import RisksOpportunitiesClient from './RisksOpportunitiesClient';

export const dynamic = 'force-dynamic';

export default async function RisksOpportunitiesPage() {
  const companyId = await getActiveCompanyId();
  const roData = await getROData(companyId);

  return (
    <RisksOpportunitiesClient
      risks={roData.risks}
      opportunities={roData.opportunities}
      adjustment={roData.adjustment}
      tornadoData={roData.tornadoData}
    />
  );
}
