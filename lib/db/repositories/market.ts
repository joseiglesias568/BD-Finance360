import prisma from '../prisma';
import type { MarketConfig, CompetitorData } from '@/config/types';

export async function getMarket(companyId: number = 1): Promise<MarketConfig> {
  // Get market data (latest)
  const marketData = await prisma.marketData.findFirst({
    where: { companyId },
    orderBy: { id: 'desc' },
  });

  // Get competitors
  const competitors = await prisma.competitor.findMany({
    where: { companyId },
  });

  const competitorData: CompetitorData[] = competitors.map(c => ({
    name: c.name,
    marketShare: c.marketShare,
    yoyChange: c.yoyChange,
    strengths: c.strengths as string[],
  }));

  // Get regional breakdown
  const regions = await prisma.regionalBreakdown.findMany({
    where: { companyId },
  });

  return {
    totalMarketSize: marketData?.totalMarketSize ?? '$0',
    companyMarketShare: marketData?.companyMarketShare ?? 0,
    marketShareTarget: marketData?.marketShareTarget ?? 0,
    marketShareYoY: marketData?.marketShareYoY ?? 0,
    segmentGrowth: marketData?.segmentGrowth ?? 0,
    competitors: competitorData,
    marketDrivers: (marketData?.marketDrivers as string[]) ?? [],
    marketChallenges: (marketData?.marketChallenges as string[]) ?? [],
    regionalBreakdown: regions.map(r => ({
      region: r.region,
      revenue: r.revenue,
      growth: r.growth,
      keyInsight: r.keyInsight,
    })),
  };
}
