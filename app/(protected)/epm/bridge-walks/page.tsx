import { getActiveCompanyId, getBridgeWalkData } from '@/lib/db/repositories';
import BridgeWalksClient from './BridgeWalksClient';

export const dynamic = 'force-dynamic';

export default async function BridgeWalksPage() {
  const companyId = await getActiveCompanyId();
  const bridgeData = await getBridgeWalkData(companyId);

  return <BridgeWalksClient bridgeData={bridgeData} />;
}
