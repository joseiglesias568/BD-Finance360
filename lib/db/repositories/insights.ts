import prisma from '../prisma';

// Return shape matches the PersonalizedInsight interface from lib/ai-search-engine.ts
// (minus the React icon components which are mapped on the client side)
export interface DBInsight {
  id: number;
  title: string;
  category: string;
  kpiValue: string;
  trendDirection: string;
  priority: string;
  summary: string;
  confidenceScore: number;
  consoleLink: string;
  recommendations: string[];
  relatedDrivers: Record<string, unknown>;
}

export async function getPersonalizedInsights(companyId: number = 1): Promise<DBInsight[]> {
  const insights = await prisma.personalizedInsight.findMany({
    where: { companyId },
    orderBy: { id: 'asc' },
  });

  return insights.map(i => ({
    id: i.id,
    title: i.title,
    category: i.category,
    kpiValue: i.kpiValue,
    trendDirection: i.trendDirection,
    priority: i.priority,
    summary: i.summary,
    confidenceScore: i.confidenceScore,
    consoleLink: i.consoleLink,
    recommendations: i.recommendations as string[],
    relatedDrivers: i.relatedDrivers as Record<string, unknown>,
  }));
}

/** Search insights by query */
export async function searchInsights(companyId: number, query: string): Promise<DBInsight[]> {
  const insights = await prisma.personalizedInsight.findMany({
    where: {
      companyId,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
  });

  return insights.map(i => ({
    id: i.id,
    title: i.title,
    category: i.category,
    kpiValue: i.kpiValue,
    trendDirection: i.trendDirection,
    priority: i.priority,
    summary: i.summary,
    confidenceScore: i.confidenceScore,
    consoleLink: i.consoleLink,
    recommendations: i.recommendations as string[],
    relatedDrivers: i.relatedDrivers as Record<string, unknown>,
  }));
}
