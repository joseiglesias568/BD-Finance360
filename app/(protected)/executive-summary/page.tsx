import {
    getActiveCompanyId,
    getBusinessPillars,
    getExecutiveBriefing,
    getCriticalActions,
    getBusinessInsights,
    getRiskOpportunities,
    getKPIs,
    getFinancials,
} from '@/lib/db/repositories';
import ExecutiveSummaryClient from './ExecutiveSummaryClient';

export const dynamic = 'force-dynamic';

export default async function ExecutiveSummaryPage() {
    const companyId = await getActiveCompanyId();

    const [pillars, briefing, decisions, insights, riskOpps, kpis, financials] = await Promise.all([
        getBusinessPillars(companyId),
        getExecutiveBriefing(companyId),
        getCriticalActions(companyId),
        getBusinessInsights(companyId),
        getRiskOpportunities(companyId),
        getKPIs(companyId),
        getFinancials(companyId),
    ]);

    return (
        <ExecutiveSummaryClient
            pillars={pillars}
            briefing={briefing}
            decisions={decisions}
            insights={insights}
            riskOpportunities={riskOpps}
            kpis={kpis}
            financials={financials}
        />
    );
}
