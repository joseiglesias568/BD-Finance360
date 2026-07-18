import prisma from '../prisma';
import type { ScenarioConfig, ScenarioLever, PreBuiltScenario, ScenarioBaselinePL } from '@/config/types';

export type { ScenarioBaselinePL };

export async function getScenarios(companyId: number = 1): Promise<ScenarioConfig> {
  // Get baseline
  const baseline = await prisma.scenarioBaseline.findUnique({
    where: { companyId },
  });

  // Get levers
  const levers = await prisma.scenarioLever.findMany({
    where: { companyId },
  });

  const leverData: ScenarioLever[] = levers.map(l => ({
    id: l.externalId,
    name: l.name,
    category: l.category,
    min: l.min,
    max: l.max,
    default: l.defaultVal,
    step: l.step,
    unit: l.unit,
    description: l.description,
  }));

  // Get pre-built scenarios
  const scenarios = await prisma.preBuiltScenario.findMany({
    where: { companyId },
  });

  const scenarioData: PreBuiltScenario[] = scenarios.map(s => ({
    id: s.externalId,
    name: s.name,
    description: s.description,
    icon: s.icon,
    confidence: s.confidence,
    revenueImpact: s.revenueImpact,
    marginImpact: s.marginImpact,
    keyAssumptions: s.keyAssumptions as string[],
    leverSettings: s.leverSettings as Record<string, number>,
  }));

  // Parse detailed baseline if available
  const detailedRaw = (baseline as Record<string, unknown>)?.detailedBaseline;
  const baselinePL = detailedRaw ? (detailedRaw as ScenarioBaselinePL) : undefined;

  return {
    levers: leverData,
    preBuiltScenarios: scenarioData,
    baselineRevenue: baseline?.baselineRevenue ?? 0,
    baselineMargin: baseline?.baselineMargin ?? 0,
    baselinePL,
  };
}
