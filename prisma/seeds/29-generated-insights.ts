import { Prisma, PrismaClient } from '@prisma/client';
import { generateAllInsights, getInsightStatistics } from '../../lib/ai/insights-generator';

export async function seedGeneratedInsights(prisma: PrismaClient, companyId: number) {
  const insights = generateAllInsights();
  const stats = getInsightStatistics(insights);

  console.log(`Seeding ${insights.length} generated AI insights for Becton, Dickinson and Company (BDX)...`);
  console.log(`   By level: ${Object.entries(stats.byLevel).map(([k, v]) => `${k}=${v}`).join(', ')}`);
  console.log(`   By priority: ${Object.entries(stats.byPriority).map(([k, v]) => `${k}=${v}`).join(', ')}`);

  // Batch insert in chunks of 500 for performance
  const BATCH_SIZE = 500;
  let inserted = 0;

  for (let i = 0; i < insights.length; i += BATCH_SIZE) {
    const batch = insights.slice(i, i + BATCH_SIZE);

    await prisma.personalizedInsight.createMany({
      data: batch.map(insight => ({
        companyId,
        title: insight.title,
        category: insight.category,
        insightLevel: insight.insightLevel,
        metricId: insight.metricId,
        kpiValue: insight.kpiValue,
        trendDirection: insight.trendDirection,
        priority: insight.priority,
        summary: insight.summary,
        confidenceScore: insight.confidenceScore,
        consoleLink: insight.consoleLink,
        recommendations: insight.recommendations,
        relatedDrivers: insight.relatedDrivers as unknown as Prisma.InputJsonValue,
      })),
    });

    inserted += batch.length;
    if (inserted % 1000 === 0 || inserted === insights.length) {
      console.log(`   ... ${inserted}/${insights.length} insights inserted`);
    }
  }

  console.log(`${insights.length} AI insights seeded across ${Object.keys(stats.byCategory).length} categories`);
}
