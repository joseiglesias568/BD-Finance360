import { getMeetingBySlug } from '@/lib/meetings-config';
import { getMeetingWithDataBySlug, getMeetingPlaceholders } from '@/lib/meetings-data';
import {
  getActiveCompanyId,
  getFinancials,
  getKPIs,
  getOperations,
  getStrategic,
  getMarket,
} from '@/lib/db/repositories';
import MeetingViewer from './MeetingViewer';
import Link from 'next/link';
import { ArrowLeft, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MeetingPresentationPage({ params }: PageProps) {
  const { slug } = await params;

  // Try to resolve with live DB data; fall back to static config
  let meeting = getMeetingBySlug(slug);
  let placeholders: Record<string, string> = {};

  try {
    const [resolvedMeeting, resolvedPlaceholders] = await Promise.all([
      getMeetingWithDataBySlug(slug),
      getMeetingPlaceholders(),
    ]);
    if (resolvedMeeting) meeting = resolvedMeeting;
    placeholders = resolvedPlaceholders;
  } catch {
    // Silently fall back to static config
  }

  // Full typed data for rich slide visualizations (fetched separately so meeting still works if DB is down)
  let fullData: {
    financials: Awaited<ReturnType<typeof getFinancials>> | null;
    kpis: Awaited<ReturnType<typeof getKPIs>> | null;
    operations: Awaited<ReturnType<typeof getOperations>> | null;
    strategic: Awaited<ReturnType<typeof getStrategic>> | null;
    market: Awaited<ReturnType<typeof getMarket>> | null;
  } = { financials: null, kpis: null, operations: null, strategic: null, market: null };

  try {
    const companyId = await getActiveCompanyId();
    const [financials, kpis, operations, strategic, market] = await Promise.all([
      getFinancials(companyId),
      getKPIs(companyId),
      getOperations(companyId),
      getStrategic(companyId),
      getMarket(companyId),
    ]);
    fullData = { financials, kpis, operations, strategic, market };
  } catch {
    // Silently fall back — slides will render without charts
  }

  if (!meeting) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 flex justify-center"><BarChart3 size={48} strokeWidth={1.5} className="text-gray-400" /></div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Meeting Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">
            The meeting &quot;{slug}&quot; doesn&apos;t exist or hasn&apos;t been configured yet.
          </p>
          <Link
            href="/build-presentation"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#003B2C] text-white text-sm font-semibold rounded-lg hover:bg-[#003B2C] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Meeting Hub
          </Link>
        </div>
      </div>
    );
  }

  return <MeetingViewer meeting={meeting} placeholders={placeholders} fullData={fullData} />;
}
