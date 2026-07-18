import { getActiveCompanyId, getAlerts } from '@/lib/db/repositories';
import AIAlertsClient from './AIAlertsClient';

export const dynamic = 'force-dynamic';

export default async function AIAlertsPage() {
    const companyId = await getActiveCompanyId();
    const alertsConfig = await getAlerts(companyId);
    return <AIAlertsClient alertsConfig={alertsConfig} />;
}
