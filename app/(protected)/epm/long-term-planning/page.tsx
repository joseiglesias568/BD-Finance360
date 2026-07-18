import { getActiveCompanyId, getLongTermPlanningData } from '@/lib/db/repositories';
import LongTermPlanningClient from './LongTermPlanningClient';

export const dynamic = 'force-dynamic';

export default async function LongTermPlanningPage() {
  const companyId = await getActiveCompanyId();
  const planningData = await getLongTermPlanningData(companyId);

  return (
    <LongTermPlanningClient
      levers={planningData.levers}
      baseline={planningData.baseline}
    />
  );
}
