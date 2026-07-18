import prisma from '../prisma';
import type { AlertsConfig, AlertTemplate } from '@/config/types';

/** Extract the first numeric value from a threshold string */
function parseThreshold(threshold: string): number {
  const match = threshold.match(/-?\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

/** Extract the unit portion from a threshold string */
function parseUnit(threshold: string): string {
  // Remove the numeric part and leading/trailing symbols to get the unit
  const cleaned = threshold
    .replace(/^[<>]=?\s*/, '')     // remove leading comparators
    .replace(/-?\d+(?:\.\d+)?/, '') // remove first number
    .replace(/^\s*/, '')            // trim leading space
    .split(' or ')[0]              // take first clause only
    .trim();
  return cleaned || '%';
}

export async function getAlerts(companyId: number = 1): Promise<AlertsConfig> {
  const templates = await prisma.alertTemplate.findMany({
    where: { companyId },
  });

  const templateData: AlertTemplate[] = templates.map(t => ({
    id: t.externalId,
    title: t.title,
    category: t.category,
    threshold: t.threshold,
    parsedThreshold: parseThreshold(t.threshold),
    parsedUnit: parseUnit(t.threshold),
    severity: t.severity as AlertTemplate['severity'],
    description: t.description,
    suggestedActions: t.suggestedActions as string[],
    alertType: (t.alertType || 'threshold') as AlertTemplate['alertType'],
    frequency: (t.frequency || 'weekly') as AlertTemplate['frequency'],
    conditionPrefix: t.conditionPrefix || '',
  }));

  return {
    templates: templateData,
  };
}
