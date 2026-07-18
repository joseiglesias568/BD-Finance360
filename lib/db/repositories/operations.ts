import prisma from '../prisma';
import type { OperationsConfig, Location as LocationType, SupplyChainMetric } from '@/config/types';
import { config as clientConfig } from '@/config';

export async function getOperations(companyId: number = 1): Promise<OperationsConfig> {
  // Get operations summary
  const summary = await prisma.operationsSummary.findUnique({
    where: { companyId },
  });

  // Get locations with metrics
  const locations = await prisma.location.findMany({
    where: { companyId },
    include: { metrics: true },
  });

  const locationData: LocationType[] = locations.map(loc => ({
    name: loc.name,
    type: loc.type,
    region: loc.region,
    metrics: loc.metrics.map(m => ({
      label: m.label,
      value: m.value,
      target: m.target ?? undefined,
      status: m.status as 'good' | 'warning' | 'critical',
    })),
  }));

  // Get supply chain metrics
  const scMetrics = await prisma.supplyChainMetric.findMany({
    where: { companyId },
  });

  const supplyChain: SupplyChainMetric[] = scMetrics.map(m => ({
    label: m.label,
    value: m.value,
    target: m.target,
    trend: m.trend as SupplyChainMetric['trend'],
    status: m.status as SupplyChainMetric['status'],
  }));

  // Get digital metrics
  const digitalMetrics = await prisma.digitalMetric.findMany({
    where: { companyId },
  });

  // Get industry KPIs
  const industryKPIs = await prisma.industryKPI.findMany({
    where: { companyId },
  });

  return {
    totalLocations: summary?.totalLocations ?? 0,
    locationGrowth: summary?.locationGrowth ?? 0,
    locationGrowthPercent: summary?.locationGrowthPercent ?? 0,
    locations: locationData,
    supplyChain,
    digitalMetrics: digitalMetrics.map(d => ({
      label: d.label,
      value: d.value,
      description: d.description,
    })),
    industryKPIs: industryKPIs.map(k => ({
      label: k.label,
      value: k.value,
      target: k.target ?? undefined,
      benchmark: k.benchmark ?? undefined,
      description: k.description,
    })),
    // People & Culture and Customer Experience — falls back to seed config until DB tables are added
    peopleMetrics: clientConfig.operations.peopleMetrics,
    customerExperience: clientConfig.operations.customerExperience,
  };
}
