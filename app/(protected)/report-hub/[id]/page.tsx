import { getActiveCompanyId, getStrategic } from '@/lib/db/repositories';
import ReportDetailClient from './ReportDetailClient';

export const dynamic = 'force-dynamic';

interface ReportDetailPageProps {
  params: { id: string };
}

export default async function ReportDetailPage({ params: _params }: ReportDetailPageProps) {
  const companyId = await getActiveCompanyId();
  const strategic = await getStrategic(companyId).catch(() => null);

  return (
    <ReportDetailClient
      periodLabel="Q1 FY26"
      strategic={strategic ?? { initiatives: [], risks: [], forwardOutlook: [], keyOpportunities: [] }}
    />
  );
}
