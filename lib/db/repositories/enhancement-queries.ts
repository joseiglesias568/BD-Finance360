// =============================================================================
// Enhancement Queries — New data tables for strategy, commodity, FX, labor,
// customer satisfaction, promotions, store format, and renovations
// =============================================================================

import prisma from '../prisma';

/** Strategy Execution — Finance2030 pillar progress */
export async function getStrategyExecution(companyId: number, pillar?: string) {
  const where: Record<string, unknown> = { companyId };
  if (pillar) {
    where.pillar = { contains: pillar, mode: 'insensitive' };
  }
  return prisma.strategyExecution.findMany({
    where,
    orderBy: [{ pillar: 'asc' }, { quarterLabel: 'desc' }],
    take: 50,
  });
}

/** Commodity Prices — spot, hedged, YoY, coverage */
export async function getCommodityPrices(companyId: number, commodity?: string) {
  const where: Record<string, unknown> = { companyId };
  if (commodity) {
    where.commodity = { contains: commodity, mode: 'insensitive' };
  }
  return prisma.commodityPrice.findMany({
    where,
    orderBy: [{ periodLabel: 'desc' }],
    take: 30,
  });
}

/** FX Impacts — currency pair revenue/operating impacts */
export async function getFXImpacts(companyId: number) {
  return prisma.fXImpact.findMany({
    where: { companyId },
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }, { revenueImpact: 'asc' }],
    take: 30,
  });
}

/** Labor Metrics — wage, turnover, hours by region */
export async function getLaborMetrics(companyId: number, region?: string) {
  const where: Record<string, unknown> = { companyId };
  if (region) {
    where.region = { contains: region, mode: 'insensitive' };
  }
  return prisma.laborMetric.findMany({
    where,
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }],
    take: 50,
  });
}

/** Customer Satisfaction — NPS, CSAT by region */
export async function getCustomerSatisfactionData(companyId: number, region?: string) {
  const where: Record<string, unknown> = { companyId };
  if (region) {
    where.region = { contains: region, mode: 'insensitive' };
  }
  return prisma.customerSatisfaction.findMany({
    where,
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }],
    take: 50,
  });
}

/** Promotional Calendar — campaign data with revenue impact */
export async function getPromotionalCalendarData(companyId: number, status?: string) {
  const where: Record<string, unknown> = { companyId };
  if (status) {
    where.status = status;
  }
  return prisma.promotionalCalendar.findMany({
    where,
    orderBy: [{ startDate: 'desc' }],
    take: 30,
  });
}

/** Store Format Mix — format distribution by segment */
export async function getStoreFormatMixData(companyId: number, segment?: string) {
  const where: Record<string, unknown> = { companyId };
  if (segment) {
    where.segment = { contains: segment, mode: 'insensitive' };
  }
  return prisma.storeFormatMix.findMany({
    where,
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }, { segment: 'asc' }],
    take: 40,
  });
}

/** Store Renovation — platform upgrades, remodels, format changes */
export async function getStoreRenovationData(companyId: number, renovationType?: string) {
  const where: Record<string, unknown> = { companyId };
  if (renovationType) {
    where.renovationType = { contains: renovationType, mode: 'insensitive' };
  }
  return prisma.storeRenovation.findMany({
    where,
    orderBy: [{ quarterLabel: 'desc' }],
    take: 30,
  });
}
