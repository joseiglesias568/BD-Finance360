import { getActiveCompanyId, getReports } from '@/lib/db/repositories';
import ReportHubClient from './ReportHubClient';

export const dynamic = 'force-dynamic';

export default async function ReportHubPage() {
    const companyId = await getActiveCompanyId();
    const reportsConfig = await getReports(companyId);
    return <ReportHubClient reportsConfig={reportsConfig} />;
}
