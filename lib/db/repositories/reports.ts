import prisma from '../prisma';
import type { ReportsConfig, ReportTemplate, ReportKeyMetric, ReportChartConfig, ReportTableData } from '@/config/types';

/** Fallback format when DB field is empty */
function inferFormat(category: string): string {
  const formatMap: Record<string, string> = {
    'Financial Performance': 'Excel',
    'Revenue & Market': 'PowerBI',
    'Property & Operations': 'Tableau',
    'Digital & Customer': 'PowerBI',
    'People & Culture': 'Excel',
    'Risk & Sustainability': 'PDF',
  };
  return formatMap[category] || 'Excel';
}

/** Fallback department when DB field is empty */
function inferDepartment(category: string): string {
  const deptMap: Record<string, string> = {
    'Financial Performance': 'Finance',
    'Revenue & Market': 'Finance',
    'Property & Operations': 'Property Operations',
    'Digital & Customer': 'Digital',
    'People & Culture': 'People & Culture',
    'Risk & Sustainability': 'Risk Management',
  };
  return deptMap[category] || 'Finance';
}

/** Fallback owner when DB field is empty */
function inferOwner(category: string): string {
  const ownerMap: Record<string, string> = {
    'Financial Performance': 'FP&A Team',
    'Revenue & Market': 'FP&A Team',
    'Property & Operations': 'Property Analytics',
    'Digital & Customer': 'Digital Analytics',
    'People & Culture': 'HR Analytics',
    'Risk & Sustainability': 'Compliance Team',
  };
  return ownerMap[category] || 'Finance Team';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapReport(r: any, idx?: number): ReportTemplate {
  // Deterministic hash for stable fallback values when DB fields are empty
  const hash = (r.name as string).split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  return {
    id: r.externalId,
    name: r.name,
    category: r.category,
    frequency: r.frequency,
    description: r.description,
    lastGenerated: r.lastGenerated ?? undefined,
    format: r.format || inferFormat(r.category),
    department: r.department || inferDepartment(r.category),
    owner: r.owner || inferOwner(r.category),
    rating: r.rating || (4.0 + ((hash % 10) / 10)),
    views: r.views || (500 + (hash % 2000)),
    isNew: r.isNew ?? (idx !== undefined ? idx < 3 : false),
    isTrending: r.isTrending ?? (hash % 5 === 0),

    // Business alignment
    relatedConsoleId: r.relatedConsoleId || undefined,
    relatedReportIds: Array.isArray(r.relatedReportIds) ? r.relatedReportIds as string[] : undefined,
    dataSource: r.dataSource || undefined,
    accessLevel: r.accessLevel || 'All Finance',
    audience: Array.isArray(r.audience) ? r.audience as string[] : undefined,
    tags: Array.isArray(r.tags) ? r.tags as string[] : undefined,

    // Detail page content
    executiveSummary: r.executiveSummary || undefined,
    aiInsight: r.aiInsight || undefined,
    recommendations: Array.isArray(r.recommendations) && r.recommendations.length > 0 ? r.recommendations as string[] : undefined,
    keyMetrics: Array.isArray(r.keyMetrics) && r.keyMetrics.length > 0 ? r.keyMetrics as ReportKeyMetric[] : undefined,
    chartData: Array.isArray(r.chartData) && r.chartData.length > 0 ? r.chartData as ReportChartConfig[] : undefined,
    tableData: r.tableData ? r.tableData as ReportTableData : undefined,

    // Scheduling
    nextUpdate: r.nextUpdate || undefined,
  };
}

export async function getReports(companyId: number = 1): Promise<ReportsConfig> {
  const reports = await prisma.reportTemplate.findMany({
    where: { companyId },
  });

  const reportData: ReportTemplate[] = reports.map((r, i) => mapReport(r, i));

  // Extract unique categories
  const categories = Array.from(new Set(reportData.map(r => r.category)));

  return {
    categories,
    reports: reportData,
    totalReports: reportData.length,
  };
}

/** Get a single report by its externalId */
export async function getReportById(companyId: number, externalId: string): Promise<ReportTemplate | null> {
  const report = await prisma.reportTemplate.findFirst({
    where: { companyId, externalId },
  });

  if (!report) return null;
  return mapReport(report);
}

/** Search reports by query string */
export async function searchReports(companyId: number, query: string): Promise<ReportTemplate[]> {
  const reports = await prisma.reportTemplate.findMany({
    where: {
      companyId,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
  });

  return reports.map((r, i) => mapReport(r, i));
}
