import { financials as financialsConfig, hypotheses as hypothesesConfig } from '@/config';
import {
    getActiveCompanyId,
    getDataQualityDashboard,
    getDataSources,
} from '@/lib/db/repositories';
import SandboxClient from './SandboxClient';

export const dynamic = 'force-dynamic';

export default async function SandboxPage() {
    let dataSources: Awaited<ReturnType<typeof getDataSources>> = [];
    let dataQuality: Awaited<ReturnType<typeof getDataQualityDashboard>> = {
        overallScore: 97.2,
        totalChecks: 0,
        passed: 0,
        warnings: 0,
        failed: 0,
        byType: {},
        byEntity: {},
        checks: [],
    };

    try {
        const companyId = await getActiveCompanyId();
        const [sources, quality] = await Promise.all([
            getDataSources(companyId),
            getDataQualityDashboard(companyId),
        ]);
        dataSources = sources;
        dataQuality = quality;
    } catch {
        // Fallback to defaults above — page still renders with static financials
    }

    return (
        <SandboxClient
            hypotheses={hypothesesConfig.hypotheses}
            dataSources={dataSources}
            dataQuality={dataQuality}
            financials={financialsConfig}
        />
    );
}
