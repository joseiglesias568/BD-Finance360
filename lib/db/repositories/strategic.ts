import prisma from '../prisma';
import type { StrategicConfig, StrategicInitiative, RiskItem, ForwardOutlookItem } from '@/config/types';
import { strategic as seedStrategic } from '@/config/clients/bkr/strategic';

// Converts "Q2 FY26" → 2602, "FY26" → 2650 for chronological sorting.
function periodOrder(period: string): number {
  const qMatch = period.match(/^Q(\d+)\s+FY(\d+)$/);
  if (qMatch) return parseInt(qMatch[2]) * 100 + parseInt(qMatch[1]);
  const fyMatch = period.match(/^FY(\d+)/);
  if (fyMatch) return parseInt(fyMatch[1]) * 100 + 50;
  return 9999;
}

export async function getStrategic(companyId: number = 1): Promise<StrategicConfig> {
  // Get initiatives with milestones and KPIs
  const initiatives = await prisma.strategicInitiative.findMany({
    where: { companyId },
    include: {
      milestones: true,
      kpis: true,
    },
  });

  const initiativeData: StrategicInitiative[] = initiatives.map(i => ({
    id: i.externalId,
    name: i.name,
    description: i.description,
    status: i.status as StrategicInitiative['status'],
    budget: i.budget,
    spent: i.spent,
    progress: i.progress,
    milestones: i.milestones.map(m => ({
      name: m.name,
      date: m.date,
      status: m.status as 'completed' | 'in-progress' | 'planned',
    })),
    kpis: i.kpis.map(k => ({
      label: k.label,
      target: k.target,
      actual: k.actual,
      status: k.status as 'good' | 'warning' | 'critical',
    })),
  }));

  // Get risks
  const risks = await prisma.riskItem.findMany({
    where: { companyId },
  });

  const riskData: RiskItem[] = risks.map(r => ({
    id: r.externalId,
    category: r.category,
    title: r.title,
    description: r.description,
    severity: r.severity as RiskItem['severity'],
    likelihood: r.likelihood as RiskItem['likelihood'],
    impact: r.impact,
    mitigation: r.mitigation,
    owner: r.owner,
  }));

  // Get forward outlook
  const outlook = await prisma.forwardOutlook.findMany({
    where: { companyId },
    orderBy: { id: 'asc' },
  });

  let forwardOutlook: ForwardOutlookItem[] = outlook.map(o => ({
    period: o.period,
    revenueForcast: o.revenueForecast,
    revenuePlan: o.revenuePlan,
    marginForecast: o.marginForecast,
    marginPlan: o.marginPlan,
    keyAssumptions: o.keyAssumptions as string[],
  }));

  // Augment DB forwardOutlook with any periods defined in the config but not yet
  // seeded into the DB (e.g. Q3 FY26, Q4 FY26, Q1 FY27, Q2 FY27).
  // Only applies to the Delta tenant (companyId === 1).
  if (companyId === 1 && seedStrategic.forwardOutlook?.length) {
    const dbPeriods = new Set(forwardOutlook.map(o => o.period));
    const extraPeriods = seedStrategic.forwardOutlook.filter(c => !dbPeriods.has(c.period));
    if (extraPeriods.length > 0) {
      forwardOutlook = [...forwardOutlook, ...extraPeriods].sort(
        (a, b) => periodOrder(a.period) - periodOrder(b.period),
      );
    }
  }

  // Get key opportunities
  const opportunities = await prisma.keyOpportunity.findMany({
    where: { companyId },
  });

  return {
    initiatives: initiativeData,
    risks: riskData,
    forwardOutlook,
    keyOpportunities: opportunities.map(o => ({
      title: o.title,
      revenueImpact: o.revenueImpact,
      description: o.description,
      timeline: o.timeline,
    })),
  };
}
