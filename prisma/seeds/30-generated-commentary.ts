import { PrismaClient } from '@prisma/client';
import { generateAllCommentary, getCommentaryStatistics } from '../../lib/ai/commentary-generator';

export async function seedGeneratedCommentary(prisma: PrismaClient, companyId: number) {
  const entries = generateAllCommentary();
  const stats = getCommentaryStatistics(entries);

  console.log(`Seeding ${entries.length} generated commentary entries for Becton, Dickinson and Company (BDX)...`);
  console.log(`   By type: ${Object.entries(stats.byType).map(([k, v]) => `${k}=${v}`).join(', ')}`);
  console.log(`   By author: ${Object.entries(stats.byAuthor).map(([k, v]) => `${k}=${v}`).join(', ')}`);

  // Batch insert in chunks of 200 for performance
  const BATCH_SIZE = 200;
  let inserted = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);

    await prisma.commentary.createMany({
      data: batch.map(entry => ({
        companyId,
        externalId: entry.externalId,
        title: entry.title,
        content: entry.content,
        contentPlain: entry.contentPlain,
        authorName: entry.authorName,
        authorRole: entry.authorRole,
        category: entry.category,
        tags: entry.tags,
        relatedKPIs: entry.relatedKPIs,
        relatedConsoles: entry.relatedConsoles,
        relatedDrivers: entry.relatedDrivers,
        linkedInsightId: entry.linkedInsightId,
        fiscalPeriod: entry.fiscalPeriod,
        periodType: entry.periodType,
        status: entry.status,
        priority: entry.priority,
        commentaryType: entry.commentaryType,
        driverId: entry.driverId,
        aggregationLevel: entry.aggregationLevel,
        isAiGenerated: entry.isAiGenerated,
        sourceCommentaryIds: entry.sourceCommentaryIds,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      })),
    });

    inserted += batch.length;
    if (inserted % 500 === 0 || inserted === entries.length) {
      console.log(`   ... ${inserted}/${entries.length} commentary inserted`);
    }
  }

  console.log(`${entries.length} commentary entries seeded across ${Object.keys(stats.byCategory).length} categories and ${Object.keys(stats.byAuthor).length} personas`);
}
