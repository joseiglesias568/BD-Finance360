import {
  getActiveCompanyId,
  getKPIs,
  getStrategic,
} from '@/lib/db/repositories';
import prisma from '@/lib/db/prisma';
import StrategyExecutionClient from './StrategyExecutionClient';

export const dynamic = 'force-dynamic';

export default async function StrategyExecutionPage() {
  const companyId = await getActiveCompanyId();

  // Inline query for StrategyExecution table
  const getStrategyExecution = (cId: number) =>
    prisma.strategyExecution.findMany({
      where: { companyId: cId },
      orderBy: [{ pillar: 'asc' }, { kpiName: 'asc' }],
    });

  // Inline query for StoreRenovation table
  const getStoreRenovations = (cId: number) =>
    prisma.storeRenovation.findMany({
      where: { companyId: cId },
      orderBy: [{ quarterLabel: 'desc' }],
      take: 20,
    });

  const [kpis, strategic, strategyExecution, storeRenovations] = await Promise.all([
    getKPIs(companyId),
    getStrategic(companyId),
    getStrategyExecution(companyId),
    getStoreRenovations(companyId),
  ]);

  return (
    <StrategyExecutionClient
      kpis={kpis}
      strategic={strategic}
      strategyExecution={strategyExecution}
      storeRenovations={storeRenovations}
    />
  );
}
