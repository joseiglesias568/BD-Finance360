import prisma from '../prisma';
import type { KPIConfig, KPIMetric } from '@/config/types';

export async function getKPIs(
  companyId: number = 1,
  periodLabel?: string,
  dataType: string = 'actual'
): Promise<KPIConfig> {
  // Find the target period
  let periodId: number;

  if (periodLabel) {
    const period = await prisma.fiscalPeriod.findFirst({
      where: { companyId, label: periodLabel },
    });
    periodId = period!.id;
  } else {
    // Find the latest quarter that actually has KPI values for the requested dataType.
    // Future quarters may exist without actuals, so we can't just take the latest period.
    const latestValue = await prisma.kPIValue.findFirst({
      where: {
        dataType,
        kpiDefinition: { companyId },
        period: { companyId, type: 'quarter' },
      },
      include: { period: true },
      orderBy: { period: { year: 'desc' } },
    });
    if (!latestValue) {
      // No data at all — return empty config
      return { primaryKPIs: [], operationalKPIs: [], digitalKPIs: [], financialKPIs: [] };
    }
    periodId = latestValue.periodId;
  }

  // Get all KPI definitions with their values for the target period
  const kpiDefs = await prisma.kPIDefinition.findMany({
    where: { companyId },
    include: {
      values: {
        where: { periodId, dataType },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  const toMetric = (def: typeof kpiDefs[0]): KPIMetric => {
    const val = def.values[0];
    return {
      label: def.label,
      value: val?.value ?? '',
      unit: def.unit || '',
      target: val?.target ?? undefined,
      trend: (val?.trend ?? 'flat') as KPIMetric['trend'],
      trendValue: val?.trendValue || '',
      status: (val?.status ?? 'good') as KPIMetric['status'],
      description: def.description || undefined,
    };
  };

  return {
    primaryKPIs: kpiDefs.filter(d => d.category === 'primary').map(toMetric),
    operationalKPIs: kpiDefs.filter(d => d.category === 'operational').map(toMetric),
    digitalKPIs: kpiDefs.filter(d => d.category === 'digital').map(toMetric),
    financialKPIs: kpiDefs.filter(d => d.category === 'financial').map(toMetric),
  };
}

/** Get time-series data for a specific KPI across multiple periods */
export async function getKPITimeSeries(
  companyId: number,
  kpiLabel: string,
  dataType: string = 'actual'
) {
  const kpiDef = await prisma.kPIDefinition.findFirst({
    where: { companyId, label: kpiLabel },
    include: {
      values: {
        where: { dataType },
        include: { period: true },
        orderBy: { period: { year: 'asc' } },
      },
    },
  });

  if (!kpiDef) return null;

  return kpiDef.values.map(v => ({
    period: v.period.label,
    value: v.value,
    target: v.target,
    trend: v.trend,
    status: v.status,
  }));
}
