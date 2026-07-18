// =============================================================================
// EPM Bridge Walk Repository — queries RevenueBridgeItem, FinancialStatement,
// and VarianceExplanation to build BridgeQuarter[] for the client.
// Falls back to hardcoded data if the DB is empty.
// =============================================================================

import prisma from '../prisma';
import type { BridgeQuarter, BridgePLLine } from '@/lib/epm/bridge-data';
import { getBridgeData as getHardcodedBridgeData } from '@/lib/epm/bridge-data';

// Re-export types the client needs
export type { BridgeQuarter, BridgeItem, BridgePLLine } from '@/lib/epm/bridge-data';
export { BRIDGE_PL_LINES } from '@/lib/epm/bridge-data';

// P&L line mapping: FinancialStatement lineItem -> BridgePLLine
const LINE_ITEM_MAP: Record<string, BridgePLLine> = {
  revenue: 'Revenue',
  cogs: 'Network Operating Expenses',
  operatingExpenses: 'Operating Expenses',
  operatingIncome: 'Operating Income',
  eps: 'Adjusted EPS',
};

/**
 * Fetch bridge walk data from the database.
 * Returns BridgeQuarter[] shaped identically to the hardcoded bridge-data.ts output.
 * Falls back to hardcoded data when the DB has no RevenueBridgeItem rows.
 */
export async function getBridgeWalkData(companyId: number): Promise<BridgeQuarter[]> {
  // ── 1. Fetch bridge items with their fiscal period ────────────────────────
  const dbItems = await prisma.revenueBridgeItem.findMany({
    where: { companyId },
    include: { period: true },
    orderBy: [{ period: { year: 'desc' } }, { sortOrder: 'asc' }],
  });

  // If DB has no data, return hardcoded data as fallback
  if (dbItems.length === 0) {
    return getHardcodedBridgeData();
  }

  // ── 2. Fetch financial statements for forecast/actual values ──────────────
  const periodIds = Array.from(new Set(dbItems.map((i) => i.periodId)));
  const financials = await prisma.financialStatement.findMany({
    where: { companyId, periodId: { in: periodIds } },
    include: { period: true },
  });

  // Build a lookup: periodLabel -> lineItem -> { actual, plan }
  const finLookup = new Map<string, Map<string, { actual: number; plan: number }>>();
  for (const f of financials) {
    const pLabel = f.period.label;
    if (!finLookup.has(pLabel)) finLookup.set(pLabel, new Map());
    finLookup.get(pLabel)!.set(f.lineItem, { actual: f.actual, plan: f.plan });
  }

  // ── 3. Group bridge items by (periodLabel) ────────────────────────────────
  // The DB RevenueBridgeItem table does NOT have a plLine field — the items
  // are general-purpose per period. We replicate the hardcoded pattern by
  // assigning all bridge items to the "Revenue" P&L line (since they originally
  // represent revenue bridge drivers). For other P&L lines (COGS, OpEx, OI, EPS)
  // we derive bridges from FinancialStatement data.
  const periodGroups = new Map<string, typeof dbItems>();
  for (const item of dbItems) {
    const label = item.period.label;
    if (!periodGroups.has(label)) periodGroups.set(label, []);
    periodGroups.get(label)!.push(item);
  }

  const quarters: BridgeQuarter[] = [];

  for (const [periodLabel, items] of Array.from(periodGroups.entries())) {
    const finMap = finLookup.get(periodLabel);

    // Revenue bridge from DB items
    const revFin = finMap?.get('revenue');
    quarters.push({
      periodLabel,
      plLine: 'Revenue',
      forecastValue: revFin?.plan ?? 0,
      actualValue: revFin?.actual ?? 0,
      items: items.map((item) => ({
        driverLabel: item.label,
        impact: item.impact,
        category: item.category,
        description: item.description,
      })),
    });

    // For other P&L lines, build synthetic bridges from FinancialStatement variances
    const otherLines: Array<{ plLine: BridgePLLine; lineItem: string }> = [
      { plLine: 'Network Operating Expenses', lineItem: 'cogs' },
      { plLine: 'Operating Expenses', lineItem: 'operatingExpenses' },
      { plLine: 'Operating Income', lineItem: 'operatingIncome' },
      { plLine: 'Adjusted EPS', lineItem: 'eps' },
    ];

    for (const { plLine, lineItem } of otherLines) {
      const fin = finMap?.get(lineItem);
      if (!fin) continue;

      const variance = fin.actual - fin.plan;
      // Create a single bridge item representing the total variance
      quarters.push({
        periodLabel,
        plLine,
        forecastValue: fin.plan,
        actualValue: fin.actual,
        items: [
          {
            driverLabel: `${plLine} Variance`,
            impact: variance,
            category: 'other',
            description: `Total ${plLine} variance for ${periodLabel}`,
          },
        ],
      });
    }
  }

  return quarters;
}
