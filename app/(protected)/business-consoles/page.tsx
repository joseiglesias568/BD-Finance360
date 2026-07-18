import { getActiveCompanyId, getBusinessConsoles } from '@/lib/db/repositories';
import type { DBConsole } from '@/lib/db/repositories/consoles';
import { calculateVariancePercent } from '@/lib/engines';
import BusinessConsolesClient from './BusinessConsolesClient';

export const dynamic = 'force-dynamic';

/** Pre-compute variance percentages for all driver metrics on the server */
function enrichConsolesWithVariance(consoles: DBConsole[]): DBConsole[] {
    return consoles.map(c => ({
        ...c,
        keyDrivers: c.keyDrivers.map(driver => ({
            ...driver,
            metrics: driver.metrics.map(m => {
                const numVal = parseFloat((m.currentValue || '0').replace(/[^0-9.-]/g, ''));
                const numTarget = parseFloat((m.target || '0').replace(/[^0-9.-]/g, ''));
                const variancePercent = !isNaN(numVal) && !isNaN(numTarget) && numTarget !== 0
                    ? calculateVariancePercent(numVal, numTarget)
                    : 0;
                return { ...m, variancePercent };
            }),
        })),
    }));
}

export default async function BusinessConsolesPage() {
    const companyId = await getActiveCompanyId();
    const dbConsoles = await getBusinessConsoles(companyId);
    const enrichedConsoles = enrichConsolesWithVariance(dbConsoles);
    return <BusinessConsolesClient dbConsoles={enrichedConsoles} />;
}
