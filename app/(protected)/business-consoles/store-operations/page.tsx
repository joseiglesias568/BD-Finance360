import {
  getActiveCompanyId,
  getKPIs,
  getOperations,
  getBusinessConsoles,
  getStoreClusters,
} from '@/lib/db/repositories';
import prisma from '@/lib/db/prisma';
import StoreOperationsClient from './StoreOperationsClient';
import type { StoreOperationsPageData } from './types';

export const dynamic = 'force-dynamic';

export default async function StoreOperationsPage() {
  const companyId = await getActiveCompanyId();

  // Inline queries for newer models not yet in the repository layer
  const getLaborMetrics = (cId: number) =>
    prisma.laborMetric.findMany({
      where: { companyId: cId },
      include: { period: true },
      orderBy: [{ period: { year: 'desc' } }],
      take: 30,
    });

  const getCustomerSatisfaction = (cId: number) =>
    prisma.customerSatisfaction.findMany({
      where: { companyId: cId },
      include: { period: true },
      orderBy: [{ period: { year: 'desc' } }],
      take: 30,
    });

  const getStoreRenovations = (cId: number) =>
    prisma.storeRenovation.findMany({
      where: { companyId: cId },
      orderBy: [{ quarterLabel: 'desc' }],
      take: 20,
    });

  const getStoreFormatMix = (cId: number) =>
    prisma.storeFormatMix.findMany({
      where: { companyId: cId },
      include: { period: true },
      orderBy: [{ period: { year: 'desc' } }],
      take: 30,
    });

  const [kpis, consoles, operations, storeClusters, laborMetrics, customerSatisfaction, storeRenovations, storeFormatMix] = await Promise.all([
    getKPIs(companyId),
    getBusinessConsoles(companyId),
    getOperations(companyId),
    getStoreClusters(companyId),
    getLaborMetrics(companyId),
    getCustomerSatisfaction(companyId),
    getStoreRenovations(companyId),
    getStoreFormatMix(companyId),
  ]);

  // Find the Network Operations & Reliability console
  const opsConsole = consoles.find(
    (c) =>
      c.segment.toLowerCase().includes('network') ||
      c.title.toLowerCase().includes('network operations') ||
      c.title.toLowerCase().includes('operations')
  ) ?? null;

  const data: StoreOperationsPageData = {
    kpis,
    consoles,
    opsConsole,
    operations,
    storeClusters,
    laborMetrics,
    customerSatisfaction,
    storeRenovations,
    storeFormatMix,
  };

  return <StoreOperationsClient data={data} />;
}
