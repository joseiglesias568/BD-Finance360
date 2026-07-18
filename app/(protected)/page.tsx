import { getActiveCompanyId, getKPIs, getFinancials } from '@/lib/db/repositories';
import HomeClient from './HomeClient';

// Force dynamic rendering — data comes from Neon PostgreSQL
export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const companyId = await getActiveCompanyId();
    const [kpiConfig, financials] = await Promise.all([
        getKPIs(companyId),
        getFinancials(companyId),
    ]);
    return (
        <HomeClient
            kpiConfig={kpiConfig}
            financials={financials}
        />
    );
}
