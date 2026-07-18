import prisma from '../prisma';

// ---------- Executive Narrative ----------
export async function getExecutiveNarrative(companyId: number, periodLabel = 'Q4 FY25') {
  const row = await prisma.executiveNarrative.findUnique({
    where: { companyId_periodLabel: { companyId, periodLabel } },
  });
  if (!row) return null;
  return {
    overallStatus: row.overallStatus,
    statusColor: row.statusColor,
    narrative: row.narrative,
    keyAchievements: row.keyAchievements as string[],
    concerns: row.concerns as string[],
  };
}

// ---------- Business Pillars ----------
export async function getBusinessPillars(companyId: number, periodLabel = 'Q4 FY25') {
  const rows = await prisma.businessPillar.findMany({
    where: { companyId, periodLabel },
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map((r) => ({
    id: r.externalId,
    label: r.label,
    value: r.value,
    change: r.change,
    target: r.target,
    status: r.status,
    color: r.color,
    keyInsight: r.keyInsight,
    actionRequired: r.actionRequired,
    metrics: r.metrics as Array<{ label: string; value: string; change: number; vsTarget: string }>,
    // Extra fields used by Executive Summary but not Monthly Report
    forecast: r.forecast,
    sparkline: r.sparkline as number[],
    subMetrics: r.subMetrics as Array<{ name: string; value: string }>,
  }));
}

// ---------- Critical Actions ----------
export async function getCriticalActions(companyId: number) {
  const rows = await prisma.criticalAction.findMany({
    where: { companyId },
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    priority: r.priority,
    urgency: r.urgency,
    owner: r.owner,
    dueDate: r.dueDate,
    description: r.description,
    financialImpact: r.financialImpact,
    riskLevel: r.riskLevel,
    status: r.status,
    category: r.category,
    businessOutcome: r.businessOutcome,
    impact: r.impact,
    riskAssessment: r.riskAssessment,
    stakeholders: r.stakeholders as string[],
    dependencies: r.dependencies as string[],
  }));
}

// ---------- Forward Insights ----------
export async function getForwardInsights(companyId: number) {
  const rows = await prisma.forwardInsight.findMany({
    where: { companyId },
  });
  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    insight: r.insight,
    impact: r.impact,
    timeframe: r.timeframe,
    confidence: r.confidence,
  }));
}

// ---------- Executive Briefing ----------
export async function getExecutiveBriefing(companyId: number, periodLabel = 'Q4 FY25') {
  const row = await prisma.executiveBriefing.findUnique({
    where: { companyId_periodLabel: { companyId, periodLabel } },
  });
  if (!row) return null;
  return {
    summary: row.summary,
    keyHighlights: row.keyHighlights as Array<{ type: string; text: string }>,
    recommendations: row.recommendations as string[],
  };
}

// ---------- Business Insights ----------
export async function getBusinessInsights(companyId: number) {
  const rows = await prisma.businessInsight.findMany({
    where: { companyId },
    orderBy: { sortOrder: 'asc' },
  });
  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    businessOutcome: r.businessOutcome,
    title: r.title,
    metric: r.metric,
    change: r.change,
    status: r.status,
    insight: r.insight,
    drivers: r.drivers as string[],
    actions: r.actions as string[],
    relatedMetrics: r.relatedMetrics as Record<string, string>,
  }));
}

// ---------- Risk & Opportunities ----------
export async function getRiskOpportunities(companyId: number) {
  const rows = await prisma.riskOpportunity.findMany({
    where: { companyId },
    orderBy: { sortOrder: 'asc' },
  });
  const risks = rows
    .filter((r) => r.type === 'risk')
    .map((r) => ({
      title: r.title,
      probability: r.probability,
      impact: r.impact,
      mitigation: r.mitigation,
      trend: r.trend,
    }));
  const opportunities = rows
    .filter((r) => r.type === 'opportunity')
    .map((r) => ({
      title: r.title,
      probability: r.probability,
      impact: r.impact,
      action: r.action,
      trend: r.trend,
    }));
  return { risks, opportunities };
}
