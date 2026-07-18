import { getActiveCompanyId, getFiscalYearData } from '@/lib/db/repositories';
import FiscalYearPlanClient from './FiscalYearPlanClient';

export const dynamic = 'force-dynamic';

export default async function FiscalYearPlanPage() {
  const companyId = await getActiveCompanyId();
  const planData = await getFiscalYearData(companyId);

  return <FiscalYearPlanClient data={planData} />;
}
