import {
    getActiveCompanyId,
    getExecutiveNarrative,
    getCriticalActions,
    getForwardInsights,
    getFinancials,
    getKPIs,
    getOperations,
    getStrategic,
    getMarket,
} from '@/lib/db/repositories';
import MonthlyReportClient from './MonthlyReportClient';

export const dynamic = 'force-dynamic';

export default async function MonthlyReportPage() {
    const companyId = await getActiveCompanyId();

    const [narrative, criticalActions, forwardInsights, financials, kpis, operations, strategic, market] = await Promise.all([
        getExecutiveNarrative(companyId),
        getCriticalActions(companyId),
        getForwardInsights(companyId),
        getFinancials(companyId),
        getKPIs(companyId),
        getOperations(companyId),
        getStrategic(companyId),
        getMarket(companyId),
    ]);

    return (
        <MonthlyReportClient
            narrative={narrative}
            criticalActions={criticalActions}
            forwardInsights={forwardInsights}
            financials={financials}
            kpis={kpis}
            operations={operations}
            strategic={strategic}
            market={market}
        />
    );
}
