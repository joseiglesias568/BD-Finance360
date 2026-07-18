// =============================================================================
// Enrichment Layer Repository — Dimensional data for rich AI analysis
// =============================================================================

import prisma from '../prisma';

/** Monthly financials by segment for a given quarter */
export async function getMonthlyFinancials(companyId: number, periodLabel?: string) {
  const where: Record<string, unknown> = { companyId };
  if (periodLabel) {
    where.period = { label: periodLabel };
  }
  return prisma.monthlyFinancial.findMany({
    where,
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }, { month: 'desc' }],
    take: 36, // 3 quarters × 3 months × 4 segments
  });
}

/** Regional performance data */
export async function getRegionalPerformance(companyId: number, region?: string) {
  const where: Record<string, unknown> = { companyId };
  if (region) {
    where.region = { contains: region, mode: 'insensitive' };
  }
  return prisma.regionalPerformance.findMany({
    where,
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }],
    take: 50,
  });
}

/** Product category performance */
export async function getProductPerformance(companyId: number, category?: string) {
  const where: Record<string, unknown> = { companyId };
  if (category) {
    where.category = { contains: category, mode: 'insensitive' };
  }
  return prisma.productCategoryPerformance.findMany({
    where,
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }],
    take: 50,
  });
}

/** Daypart performance */
export async function getDaypartPerformance(companyId: number, daypart?: string) {
  const where: Record<string, unknown> = { companyId };
  if (daypart) {
    where.daypart = { contains: daypart, mode: 'insensitive' };
  }
  return prisma.daypartPerformance.findMany({
    where,
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }],
    take: 40,
  });
}

/** Cost driver decomposition */
export async function getCostDrivers(companyId: number, costCategory?: string) {
  const where: Record<string, unknown> = { companyId };
  if (costCategory) {
    where.costCategory = { contains: costCategory, mode: 'insensitive' };
  }
  return prisma.costDriverDetail.findMany({
    where,
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }],
    take: 50,
  });
}

/** Pre-computed variance explanations */
export async function getVarianceExplanations(companyId: number, metricName?: string, varianceType?: string) {
  const where: Record<string, unknown> = { companyId };
  if (metricName) {
    where.metricName = { contains: metricName, mode: 'insensitive' };
  }
  if (varianceType) {
    where.varianceType = varianceType;
  }
  return prisma.varianceExplanation.findMany({
    where,
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }],
    take: 20,
  });
}

/** Weekly KPI snapshots */
export async function getWeeklySnapshots(companyId: number, metricName?: string) {
  const where: Record<string, unknown> = { companyId };
  if (metricName) {
    where.metricName = { contains: metricName, mode: 'insensitive' };
  }
  return prisma.weeklySnapshot.findMany({
    where,
    orderBy: [{ weekNumber: 'desc' }],
    take: 50,
  });
}

/** Store cluster analysis */
export async function getStoreClusters(companyId: number) {
  return prisma.storeCluster.findMany({
    where: { companyId },
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }, { clusterName: 'asc' }],
    take: 40,
  });
}

/** Elasticity / sensitivity factors */
export async function getElasticityFactors(companyId: number, driverMetric?: string) {
  const where: Record<string, unknown> = { companyId };
  if (driverMetric) {
    where.OR = [
      { driverMetric: { contains: driverMetric, mode: 'insensitive' } },
      { impactedMetric: { contains: driverMetric, mode: 'insensitive' } },
    ];
  }
  return prisma.elasticityFactor.findMany({
    where,
    take: 25,
  });
}

/** Competitor quarterly metrics */
export async function getCompetitorMetrics(companyId: number, competitorName?: string) {
  const where: Record<string, unknown> = { companyId };
  if (competitorName) {
    where.competitorName = { contains: competitorName, mode: 'insensitive' };
  }
  return prisma.competitorQuarterlyMetric.findMany({
    where,
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }],
    take: 50,
  });
}
