import { getActiveCompanyId, getShortTermPlanningData } from '@/lib/db/repositories';
import ShortTermPlanningClient from './ShortTermPlanningClient';

export const dynamic = 'force-dynamic';

export default async function ShortTermPlanningPage() {
  const companyId = await getActiveCompanyId();
  const planningData = await getShortTermPlanningData(companyId);

  return (
    <ShortTermPlanningClient
      levers={planningData.levers}
      baseline={planningData.baseline}
    />
  );
}
