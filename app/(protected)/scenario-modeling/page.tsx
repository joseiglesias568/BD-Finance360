import { getActiveCompanyId, getScenarios } from '@/lib/db/repositories';
import ScenarioModelingClient from './ScenarioModelingClient';

export const dynamic = 'force-dynamic';

export default async function ScenarioModelingPage() {
    const companyId = await getActiveCompanyId();
    const scenarioConfig = await getScenarios(companyId);
    return <ScenarioModelingClient scenarioConfig={scenarioConfig} />;
}
