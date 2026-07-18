import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed MonthlyFinancial table — Becton, Dickinson and Company (NYSE: BDX)
// 11 quarters x 3 months x 5 segments (ME, CC, BPS, Int, Consolidated) = 165 records
// BD fiscal year: Q1=Oct-Dec, Q2=Jan-Mar, Q3=Apr-Jun, Q4=Jul-Sep
//
// Covers FY24 (Q1-Q4), FY25 (Q1-Q4), FY26 (Q1-Q3)
// BD seasonal pattern:
//   Q1 weakest (Oct-Dec): hospital budget resets, lower capital equipment orders
//   Q2 (Jan-Mar): even quarter; contract renewal period
//   Q3 (Apr-Jun): moderate pickup; Jun stronger for year-end hospital orders
//   Q4 strongest (Jul-Sep): fiscal year-end push, hospital capital spending, Sep peak
// Segments: Medical Essentials (ME), Connected Care (CC/Alaris),
//           BioPharma Systems (BPS/Pharmaceutical Systems), Interventional
// Strategy: Excellence Unleashed — Compete, Innovate, Deliver
// =============================================================================

// ── Quarter metadata ─────────────────────────────────────────────────────────

interface QuarterDef {
  label: string;           // e.g. "Q1 FY24"
  quarter: 1 | 2 | 3 | 4;
  cyYear: number;          // calendar year of the first month
  totalRevenue: number;    // quarterly total in $M (all segments, pre-elimination)
  rxGrowth: number;        // enterprise organic FXN growth %
}

const QUARTERS: QuarterDef[] = [
  // FY24 — full year $16,455M (Q1-Q4 actuals); BD fiscal Q1=Oct, Q2=Jan, Q3=Apr, Q4=Jul
  { label: 'Q1 FY24', quarter: 1, cyYear: 2023, totalRevenue: 3909, rxGrowth: 3.0 },
  { label: 'Q2 FY24', quarter: 2, cyYear: 2024, totalRevenue: 4106, rxGrowth: 3.8 },
  { label: 'Q3 FY24', quarter: 3, cyYear: 2024, totalRevenue: 4216, rxGrowth: 4.5 },
  { label: 'Q4 FY24', quarter: 4, cyYear: 2024, totalRevenue: 4224, rxGrowth: 4.5 },
  // FY25 — full year $18,366M (actuals); GLP-1 acceleration
  { label: 'Q1 FY25', quarter: 1, cyYear: 2024, totalRevenue: 4438, rxGrowth: 6.6 },
  { label: 'Q2 FY25', quarter: 2, cyYear: 2025, totalRevenue: 4579, rxGrowth: 5.4 },
  { label: 'Q3 FY25', quarter: 3, cyYear: 2025, totalRevenue: 4664, rxGrowth: 5.4 },
  { label: 'Q4 FY25', quarter: 4, cyYear: 2025, totalRevenue: 4685, rxGrowth: 4.8 },
  // FY26 — guidance ~$18.0B (continuing ops, post-Waters spin Feb 2026)
  { label: 'Q1 FY26', quarter: 1, cyYear: 2025, totalRevenue: 4486, rxGrowth: 2.1 },
  { label: 'Q2 FY26', quarter: 2, cyYear: 2026, totalRevenue: 4714, rxGrowth: 2.6 }, // ACTUAL
  { label: 'Q3 FY26', quarter: 3, cyYear: 2026, totalRevenue: 4760, rxGrowth: 2.1 }, // CLOSE IN PROGRESS
];

// ── Segment revenue splits ───────────────────────────────────────────────────

const SEGMENTS = ['Medical Essentials', 'Connected Care', 'BioPharma Systems', 'Interventional'] as const;

// Revenue share by segment — BD-appropriate seasonal weights
// Medical Essentials (~38%): consumables, diagnostics, medication management; steady across quarters
// Connected Care (~18%): BD Alaris infusion systems; capital equipment softer Q1 (budget resets)
// BioPharma Systems (~22%): prefillable syringes, drug delivery; GLP-1 pharma driving growth
// Interventional (~22%): vascular, surgical; Q4 strongest (hospital capital year-end spend)
// Note: Inter-segment eliminations reduce consolidated total; segment totals sum above 100%
interface SeasonalShares {
  'Medical Essentials': number;
  'Connected Care': number;
  'BioPharma Systems': number;
  'Interventional': number;
}

const QUARTERLY_SEGMENT_SHARES: Record<number, SeasonalShares> = {
  1: { 'Medical Essentials': 0.380, 'Connected Care': 0.175, 'BioPharma Systems': 0.215, 'Interventional': 0.230 }, // Q1 Oct-Dec: hospital budget resets, lower capital
  2: { 'Medical Essentials': 0.382, 'Connected Care': 0.178, 'BioPharma Systems': 0.218, 'Interventional': 0.222 }, // Q2 Jan-Mar: even quarter, contract renewals
  3: { 'Medical Essentials': 0.378, 'Connected Care': 0.180, 'BioPharma Systems': 0.222, 'Interventional': 0.220 }, // Q3 Apr-Jun: moderate pickup
  4: { 'Medical Essentials': 0.375, 'Connected Care': 0.182, 'BioPharma Systems': 0.225, 'Interventional': 0.218 }, // Q4 Jul-Sep: fiscal year-end push
};

// ── Monthly revenue distribution within each quarter ─────────────────────────

// Month weights within BD fiscal quarter [month1, month2, month3]
// Q1 (Oct-Dec): Oct slow (hospital budget start), Nov/Dec pickup as orders accelerate
// Q2 (Jan-Mar): Even quarter; Mar slightly stronger on quarter-end contract closures
// Q3 (Apr-Jun): Jun slightly stronger as hospitals finalize H1 orders
// Q4 (Jul-Sep): Sep strongest (fiscal year-end push, hospital capital budget year-end)
const MONTH_WEIGHTS: Record<1 | 2 | 3 | 4, [number, number, number]> = {
  1: [0.31, 0.35, 0.34], // Q1: Oct 31% (budget start), Nov 35%, Dec 34%
  2: [0.33, 0.33, 0.34], // Q2: Jan 33%, Feb 33%, Mar 34%
  3: [0.32, 0.34, 0.34], // Q3: Apr 32%, May 34%, Jun 34%
  4: [0.30, 0.33, 0.37], // Q4: Jul 30%, Aug 33%, Sep 37% (fiscal year-end push)
};

// BD fiscal month names mapped to quarter + month index
// Q1 = Oct, Nov, Dec; Q2 = Jan, Feb, Mar; Q3 = Apr, May, Jun; Q4 = Jul, Aug, Sep
function getMonthLabel(quarter: 1 | 2 | 3 | 4, monthIdx: 0 | 1 | 2, cyYear: number): string {
  // For BD fiscal year: Q1 starts in October of the prior calendar year
  // cyYear stored as the first month's calendar year
  const MONTH_NAMES: Record<number, string[]> = {
    1: ['Oct', 'Nov', 'Dec'], // Q1 BD fiscal (Oct-Dec)
    2: ['Jan', 'Feb', 'Mar'], // Q2 BD fiscal (Jan-Mar)
    3: ['Apr', 'May', 'Jun'], // Q3 BD fiscal (Apr-Jun)
    4: ['Jul', 'Aug', 'Sep'], // Q4 BD fiscal (Jul-Sep)
  };
  const names = MONTH_NAMES[quarter];
  return `${names[monthIdx]} ${cyYear}`;
}

// ── Cost structure by segment ────────────────────────────────────────────────

interface CostProfile {
  cogsPercent: number;      // Cost of products sold as % of segment revenue
  storeOpexPercent: number; // Selling and administrative expense (SAE) %
  otherOpexPercent: number; // R&D + other operating costs %
}

// Base cost profiles (FY24 baseline) — BD medical technology cost structure
// Medical Essentials: higher-volume consumables, moderate COGS, stable SAE
// Connected Care: Alaris infusion systems; hardware COGS ~52%, software improving margins
// BioPharma Systems: prefillable syringes; lowest COGS (38%) — highest margin segment
// Interventional: vascular/surgical devices; balanced COGS ~50%
const BASE_COST_PROFILES: Record<typeof SEGMENTS[number], CostProfile> = {
  'Medical Essentials': {
    cogsPercent: 0.535,      // Manufacturing COGS for consumables and diagnostics
    storeOpexPercent: 0.240, // SAE — field sales force, marketing, distribution
    otherOpexPercent: 0.055, // R&D + other operating costs
  },
  'Connected Care': {
    cogsPercent: 0.520,      // Alaris hardware + software COGS (improving on software mix)
    storeOpexPercent: 0.235, // SAE — clinical specialists, consent decree compliance costs
    otherOpexPercent: 0.055, // R&D for next-gen Alaris + smart pump software
  },
  'BioPharma Systems': {
    cogsPercent: 0.380,      // Pharmaceutical Systems — prefillable syringes; highest margin
    storeOpexPercent: 0.200, // SAE — pharma customer relationships, regulatory support
    otherOpexPercent: 0.060, // R&D for GLP-1 device platforms, biologics delivery
  },
  'Interventional': {
    cogsPercent: 0.500,      // Vascular access, surgical specialty COGS
    storeOpexPercent: 0.240, // SAE — surgical sales force, clinical education
    otherOpexPercent: 0.058, // R&D for vascular and surgical innovation
  },
};

// Cost efficiency improvement per year — Excellence Unleashed program ($200M cost-out target)
// COGS: -0.003/year from manufacturing optimization, procurement, automation
// SAE: -0.005/year from field sales efficiency, digital tools, corporate overhead reduction
function getCostProfile(segment: typeof SEGMENTS[number], cyYear: number): CostProfile {
  const base = BASE_COST_PROFILES[segment];
  const yearsFromBaseline = cyYear - 2023;
  return {
    cogsPercent: base.cogsPercent - yearsFromBaseline * 0.003,
    storeOpexPercent: base.storeOpexPercent - yearsFromBaseline * 0.005,
    otherOpexPercent: base.otherOpexPercent,
  };
}

// ── Organic FXN growth by segment ────────────────────────────────────────────

function getSegmentRxGrowth(
  consolidatedGrowth: number,
  segment: typeof SEGMENTS[number],
): number | null {
  switch (segment) {
    case 'BioPharma Systems':
      // GLP-1 tailwind driving above-average growth in Pharmaceutical Systems
      return +(consolidatedGrowth + 1.5).toFixed(1);
    case 'Connected Care':
      // Alaris consent decree headwinds (78% remediated) moderating growth
      return +(consolidatedGrowth - 0.5).toFixed(1);
    case 'Medical Essentials':
      // Stable consumables and diagnostics tracking slightly above consolidated
      return +(consolidatedGrowth + 0.2).toFixed(1);
    case 'Interventional':
      // Vascular and surgical market share gains driving above-average growth
      return +(consolidatedGrowth + 0.8).toFixed(1);
  }
}

// ── Customer/unit metrics by segment ─────────────────────────────────────────

interface CustomerMetrics {
  transactions: number; // units shipped (thousands) per segment per month
  averageTicket: number; // average selling price ($) per unit
}

function getCustomerMetrics(
  monthRevenue: number,
  segment: typeof SEGMENTS[number],
  cyYear: number,
): CustomerMetrics {
  const yearDelta = cyYear - 2023;
  let baseAvgPrice: number;
  switch (segment) {
    case 'Medical Essentials':
      // High-volume consumables — Vacutainer, needles, syringes, diagnostics reagents
      baseAvgPrice = 20 + yearDelta * 0.5; // avg price ~$20-25 per unit, modest inflation
      break;
    case 'Connected Care':
      // BD Alaris infusion systems and annual software licenses — capital equipment
      baseAvgPrice = 3200 + yearDelta * 150; // Alaris pump system $2,800-4,500
      break;
    case 'BioPharma Systems':
      // Prefillable syringes and drug delivery components — high-volume pharma supply
      baseAvgPrice = 10 + yearDelta * 0.3; // per unit $8-15; GLP-1 tailwind increasing ASP slightly
      break;
    case 'Interventional':
      // Vascular access, catheters, surgical specialty devices
      baseAvgPrice = 145 + yearDelta * 5; // avg selling price $120-180 per device
      break;
  }
  // transactions in thousands (units shipped per month)
  const transactions = +(monthRevenue * 1000 / baseAvgPrice / 1000).toFixed(0);
  return { transactions, averageTicket: +baseAvgPrice.toFixed(0) };
}

// ── Slight monthly variation noise ───────────────────────────────────────────

function jitter(value: number, pct: number = 0.01): number {
  const hash = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
  const noise = (hash - Math.floor(hash)) * 2 - 1;
  return +(value * (1 + noise * pct)).toFixed(1);
}

// =============================================================================
// Main seed function
// =============================================================================

export async function seedMonthlyFinancials(
  prisma: PrismaClient,
  companyId: number,
  periodMap: Record<string, { id: number }>,
) {
  // Delete existing monthly financial records before creating new ones
  await prisma.monthlyFinancial.deleteMany({ where: { companyId } });

  const records: Array<{
    companyId: number;
    periodId: number;
    month: number;
    monthLabel: string;
    segment: string;
    revenue: number;
    cogs: number;
    grossProfit: number;
    storeOpex: number;
    otherOpex: number;
    operatingIncome: number;
    compStoreSales: number | null;
    transactions: number | null;
    averageTicket: number | null;
  }> = [];

  for (const qtr of QUARTERS) {
    if (!periodMap[qtr.label]) {
      console.log(`  Skipping ${qtr.label} (not in periodMap)`);
      continue;
    }

    const periodId = periodMap[qtr.label].id;
    const weights = MONTH_WEIGHTS[qtr.quarter];
    const segShares = QUARTERLY_SEGMENT_SHARES[qtr.quarter];

    const consolidatedMonths: Array<{
      month: number;
      monthLabel: string;
      revenue: number;
      cogs: number;
      grossProfit: number;
      storeOpex: number;
      otherOpex: number;
      operatingIncome: number;
      transactions: number;
    }> = [];

    for (let m = 0; m < 3; m++) {
      consolidatedMonths.push({
        month: m + 1,
        monthLabel: getMonthLabel(qtr.quarter, m as 0 | 1 | 2, qtr.cyYear),
        revenue: 0,
        cogs: 0,
        grossProfit: 0,
        storeOpex: 0,
        otherOpex: 0,
        operatingIncome: 0,
        transactions: 0,
      });
    }

    for (const segment of SEGMENTS) {
      const segmentRevenue = qtr.totalRevenue * segShares[segment];
      const costProfile = getCostProfile(segment, qtr.cyYear);
      const organicGrowth = getSegmentRxGrowth(qtr.rxGrowth, segment);

      for (let m = 0; m < 3; m++) {
        const monthRevBase = segmentRevenue * weights[m];
        const monthRev = jitter(monthRevBase, 0.008);
        const cogs = jitter(monthRev * costProfile.cogsPercent, 0.005);
        const grossProfit = +(monthRev - cogs).toFixed(1);
        const storeOpex = jitter(monthRev * costProfile.storeOpexPercent, 0.005);
        const otherOpex = jitter(monthRev * costProfile.otherOpexPercent, 0.005);
        const operatingIncome = +(grossProfit - storeOpex - otherOpex).toFixed(1);

        const customerMetrics = getCustomerMetrics(monthRev, segment, qtr.cyYear);

        // Organic growth varies slightly by month within quarter
        let monthOrganicGrowth: number | null = null;
        if (organicGrowth !== null) {
          const growthOffsets = [-0.2, 0.0, 0.2];
          monthOrganicGrowth = +(organicGrowth + growthOffsets[m]).toFixed(1);
        }

        const monthLabel = getMonthLabel(qtr.quarter, m as 0 | 1 | 2, qtr.cyYear);

        records.push({
          companyId,
          periodId,
          month: m + 1,
          monthLabel,
          segment,
          revenue: monthRev,
          cogs,
          grossProfit,
          storeOpex,
          otherOpex,
          operatingIncome,
          compStoreSales: monthOrganicGrowth, // organic FXN growth % by segment
          transactions: customerMetrics.transactions > 0 ? customerMetrics.transactions : null,
          averageTicket: customerMetrics.averageTicket > 0 ? customerMetrics.averageTicket : null,
        });

        consolidatedMonths[m].revenue += monthRev;
        consolidatedMonths[m].cogs += cogs;
        consolidatedMonths[m].grossProfit += grossProfit;
        consolidatedMonths[m].storeOpex += storeOpex;
        consolidatedMonths[m].otherOpex += otherOpex;
        consolidatedMonths[m].operatingIncome += operatingIncome;
        consolidatedMonths[m].transactions += customerMetrics.transactions;
      }
    }

    // Add consolidated rows
    for (let m = 0; m < 3; m++) {
      const c = consolidatedMonths[m];
      const growthOffsets = [-0.1, 0.0, 0.1];
      const consolidatedOrganicGrowth = +(qtr.rxGrowth + growthOffsets[m]).toFixed(1);

      const avgFee = c.transactions > 0
        ? +(c.revenue * 1000 / c.transactions / 1000).toFixed(0)
        : null;

      records.push({
        companyId,
        periodId,
        month: c.month,
        monthLabel: c.monthLabel,
        segment: 'Consolidated',
        revenue: +c.revenue.toFixed(1),
        cogs: +c.cogs.toFixed(1),
        grossProfit: +c.grossProfit.toFixed(1),
        storeOpex: +c.storeOpex.toFixed(1),
        otherOpex: +c.otherOpex.toFixed(1),
        operatingIncome: +c.operatingIncome.toFixed(1),
        compStoreSales: consolidatedOrganicGrowth, // enterprise organic FXN growth proxy
        transactions: c.transactions > 0 ? +c.transactions.toFixed(0) : null,
        averageTicket: avgFee,
      });
    }
  }

  await prisma.monthlyFinancial.createMany({ data: records });

  const quartersSeeded = QUARTERS.filter((q) => periodMap[q.label]).length;
  console.log(
    `Seeded ${records.length} BD (Becton, Dickinson) monthly financial records ` +
    `(${quartersSeeded} quarters x 3 months x 5 segments including Consolidated)`,
  );
}
