import {
    getActiveCompanyId,
    getMarket,
    getCompetitorMetrics,
} from '@/lib/db/repositories';
import CompetitiveIntelClient from './CompetitiveIntelClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Competitive Intelligence | Delta',
};

export default async function CompetitiveIntelligencePage() {
    const companyId = await getActiveCompanyId();

    const [market, competitorMetrics] = await Promise.all([
        getMarket(companyId),
        getCompetitorMetrics(companyId),
    ]);

    return (
        <CompetitiveIntelClient
            market={market}
            competitorMetrics={competitorMetrics}
        />
    );
}
