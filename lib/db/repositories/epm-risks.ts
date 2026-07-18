// =============================================================================
// EPM Risks & Opportunities Repository
// Queries RiskOpportunity table and maps to the ROItem / ROAdjustmentResult
// interfaces that the client component expects.
// Falls back to hardcoded data if the DB is empty.
// =============================================================================

import prisma from '../prisma';
import type { ROItem, ROAdjustmentResult } from '@/lib/epm/ro-adjustment-engine';
import {
  getRisks as getHardcodedRisks,
  getOpportunities as getHardcodedOpportunities,
  calculateROAdjustment as hardcodedCalculateROAdjustment,
  getTornadoData as hardcodedGetTornadoData,
} from '@/lib/epm/ro-adjustment-engine';

// Re-export types
export type { ROItem, ROAdjustmentResult } from '@/lib/epm/ro-adjustment-engine';

// Probability text -> numeric mapping
const PROBABILITY_MAP: Record<string, number> = {
  'very high': 85,
  'high': 70,
  'medium': 50,
  'medium-high': 60,
  'low': 25,
  'very low': 10,
};

// Impact text -> numeric mapping (parse "$150-200M" style strings)
function parseImpactAmount(impact: string, type: 'risk' | 'opportunity'): number {
  // Try to extract numeric value from strings like "$150-200M", "$1.35B", "$980M"
  const cleaned = impact.replace(/[,$]/g, '').trim();

  // Range like "150-200M"
  const rangeMatch = cleaned.match(/([\d.]+)-([\d.]+)\s*([MB])/i);
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1]);
    const high = parseFloat(rangeMatch[2]);
    const multiplier = rangeMatch[3].toUpperCase() === 'B' ? 1000 : 1;
    const avg = ((low + high) / 2) * multiplier;
    return type === 'risk' ? -avg : avg;
  }

  // Single value like "980M" or "1.35B"
  const singleMatch = cleaned.match(/([\d.]+)\s*([MB])/i);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    const multiplier = singleMatch[2].toUpperCase() === 'B' ? 1000 : 1;
    const amount = val * multiplier;
    return type === 'risk' ? -amount : amount;
  }

  // Fallback: try plain number
  const num = parseFloat(cleaned);
  if (!isNaN(num)) {
    return type === 'risk' ? -Math.abs(num) : Math.abs(num);
  }

  return 0;
}

/**
 * Maps a DB RiskOpportunity row to the ROItem interface.
 */
function mapToROItem(
  row: {
    id: number;
    type: string;
    title: string;
    probability: string;
    impact: string;
    mitigation: string;
    action: string;
    trend: string;
    sortOrder: number;
  },
  index: number,
): ROItem {
  const type = row.type as 'risk' | 'opportunity';
  const probabilityPct = PROBABILITY_MAP[row.probability.toLowerCase()] ?? 50;
  const impactAmount = parseImpactAmount(row.impact, type);
  const expectedValue = Math.round((probabilityPct / 100) * impactAmount);

  // Infer category from mitigation/action text or use generic
  let category = 'Market';
  const text = (row.mitigation || row.action || row.title).toLowerCase();
  if (text.includes('cost') || text.includes('labor') || text.includes('commodity') || text.includes('supply')) {
    category = 'Cost';
  } else if (text.includes('revenue') || text.includes('sales') || text.includes('leasing') || text.includes('advisory')) {
    category = 'Revenue';
  } else if (text.includes('tech') || text.includes('digital') || text.includes('tariff') || text.includes('operation')) {
    category = 'Operational';
  }

  // Infer plLineAffected
  let plLineAffected = 'Revenue';
  if (category === 'Cost') plLineAffected = 'Cost of Sales';
  else if (category === 'Operational') plLineAffected = 'Operating Expenses';

  return {
    id: `${type[0]}${index + 1}`,
    type,
    title: row.title,
    probabilityPct,
    impactAmount,
    expectedValue,
    category,
    owner: type === 'risk' ? 'CFO' : 'VP Strategy',
    plLineAffected,
    trend: (row.trend as 'increasing' | 'stable' | 'decreasing') || 'stable',
    description: row.mitigation || row.action || row.title,
  };
}

/**
 * Fetch R&O data from the DB. Returns { risks, opportunities, adjustment, tornadoData }.
 * Falls back to hardcoded data when the DB has no RiskOpportunity rows.
 */
export interface ROData {
  risks: ROItem[];
  opportunities: ROItem[];
  adjustment: ROAdjustmentResult;
  tornadoData: { label: string; low: number; high: number; expected: number }[];
}

export async function getROData(companyId: number): Promise<ROData> {
  const dbRows = await prisma.riskOpportunity.findMany({
    where: { companyId },
    orderBy: { sortOrder: 'asc' },
  });

  // If DB has no data, fall back to hardcoded data
  if (dbRows.length === 0) {
    const risks = getHardcodedRisks();
    const opportunities = getHardcodedOpportunities();
    return {
      risks,
      opportunities,
      adjustment: hardcodedCalculateROAdjustment(),
      tornadoData: hardcodedGetTornadoData(),
    };
  }

  // Map DB rows to ROItem[]
  const allItems: ROItem[] = dbRows.map((row, i) => mapToROItem(row, i));
  const risks = allItems
    .filter((i) => i.type === 'risk')
    .sort((a, b) => b.probabilityPct - a.probabilityPct);
  const opportunities = allItems
    .filter((i) => i.type === 'opportunity')
    .sort((a, b) => b.probabilityPct - a.probabilityPct);

  const adjustment = calculateROAdjustment(risks, opportunities);
  const tornadoData = getTornadoData(risks, opportunities);

  return { risks, opportunities, adjustment, tornadoData };
}

/**
 * Pure computation: calculate the R&O adjustment result from item lists.
 */
export function calculateROAdjustment(
  risks: ROItem[],
  opportunities: ROItem[],
  mlForecastRevenue: number = 38850,
): ROAdjustmentResult {
  const totalRiskImpact = risks.reduce((sum, r) => sum + r.expectedValue, 0);
  const totalOppImpact = opportunities.reduce((sum, o) => sum + o.expectedValue, 0);

  const waterfall: ROAdjustmentResult['waterfall'] = [];

  for (const r of [...risks].sort((a, b) => a.expectedValue - b.expectedValue)) {
    waterfall.push({ label: r.title, impact: r.expectedValue, type: 'risk' });
  }
  for (const o of [...opportunities].sort((a, b) => b.expectedValue - a.expectedValue)) {
    waterfall.push({ label: o.title, impact: o.expectedValue, type: 'opportunity' });
  }

  const adjustedForecast = mlForecastRevenue + totalRiskImpact + totalOppImpact;
  const bestCase = mlForecastRevenue + opportunities.reduce((sum, o) => sum + o.impactAmount, 0);
  const worstCase = mlForecastRevenue + risks.reduce((sum, r) => sum + r.impactAmount, 0);

  return {
    mlForecast: mlForecastRevenue,
    totalRiskImpact,
    totalOppImpact,
    adjustedForecast,
    bestCase,
    worstCase,
    expectedCase: adjustedForecast,
    waterfall,
  };
}

/**
 * Build tornado chart data from item lists.
 */
export function getTornadoData(
  risks: ROItem[],
  opportunities: ROItem[],
): { label: string; low: number; high: number; expected: number }[] {
  const items = [...risks, ...opportunities];
  return items
    .map((item) => ({
      label: item.title,
      low: item.type === 'risk' ? item.impactAmount : 0,
      high: item.type === 'opportunity' ? item.impactAmount : 0,
      expected: item.expectedValue,
    }))
    .sort(
      (a, b) =>
        Math.abs(b.high - b.low + Math.abs(b.expected)) -
        Math.abs(a.high - a.low + Math.abs(a.expected)),
    );
}
