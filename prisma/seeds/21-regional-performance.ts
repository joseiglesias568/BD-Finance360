import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed RegionalPerformance: 3 BD geographic regions x all quarters
// BD geographic breakdown for medical technology operations:
//   1. Americas (US, Canada, Latin America)
//      — Largest region ~45% of BD revenue; predominantly USD-denominated; lowest FX risk
//        BD's home market; Alaris consent decree impacts primarily in US; GLP-1 pharma demand
//   2. EMEA (Europe, Middle East, Africa)
//      — ~35% of BD revenue; significant FX headwind (EUR, GBP); strong BD Rowa pharmacy robotics
//        regulatory environment; Germany/France/UK largest sub-markets
//   3. Asia Pacific (China, Japan, ASEAN, ANZ, India)
//      — ~20% of BD revenue; China VoBP (Volume-Based Procurement) pricing headwind
//        China represents largest single-country headwind: -9.8% FXN Q2 FY26
//        Non-China APAC growing; India and ASEAN emerging markets offsetting partially
// BD fiscal year ends September 30; Q1=Oct-Dec, Q2=Jan-Mar, Q3=Apr-Jun, Q4=Jul-Sep
// =============================================================================

// Quarter labels in chronological order (must match periodMap keys)
const quarterLabels = [
  'Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24',
  'Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25',
  'Q1 FY26', 'Q2 FY26', 'Q3 FY26',
];

// ─── Region definitions with per-quarter data ─────────────────────────────────
// Each array has 11 entries: Q1 FY24 through Q3 FY26

interface RegionQuarterData {
  storeCount: number;        // sales territories / commercial units in region
  revenue: number;           // millions ($M) — BD revenue by region
  revenueYoY: number;        // percentage reported YoY growth
  compStoreSales: number;    // organic FXN growth YoY %
  compTransactions: number;  // instrument placement / unit volume growth %
  averageTicket: number;     // average order value ($K) — blended product mix
  operatingMargin: number;   // percentage (regional contribution margin)
  rewardsMemberPct: number | null;  // % under multi-year GPO/IDN contracts
  mobileOrderPct: number | null;    // digital ordering % of total transactions
  newStores: number | null;         // new sales territory additions
  closedStores: number | null;      // territory consolidations
}

interface RegionSeed {
  name: string;
  quarters: RegionQuarterData[];
}

const regionData: RegionSeed[] = [
  // ── 1. Americas ──────────────────────────────────────────────────────────
  // ~840 sales territories; BD's largest region (~45% of total revenue)
  // Predominantly USD-denominated — minimal FX headwind vs EMEA/APAC
  // Alaris consent decree primarily a US market issue (78% remediated by Q2 FY26)
  // PureWick external catheter strong US growth; GLP-1 syringe demand from US pharma customers
  // IDN/GPO contract coverage ~70%+ of US hospital market
  {
    name: 'Americas',
    quarters: [
      {
        storeCount: 822,
        revenue: 2058,
        revenueYoY: 4.8,
        compStoreSales: 4.2,
        compTransactions: 3.2,
        averageTicket: 288,
        operatingMargin: 29.5,
        rewardsMemberPct: 68.0,
        mobileOrderPct: 22,
        newStores: 9,
        closedStores: 4,
      },
      {
        storeCount: 827,
        revenue: 2092,
        revenueYoY: 5.0,
        compStoreSales: 4.5,
        compTransactions: 3.4,
        averageTicket: 292,
        operatingMargin: 29.8,
        rewardsMemberPct: 69.0,
        mobileOrderPct: 23,
        newStores: 9,
        closedStores: 4,
      },
      {
        storeCount: 832,
        revenue: 2124,
        revenueYoY: 5.2,
        compStoreSales: 4.8,
        compTransactions: 3.5,
        averageTicket: 296,
        operatingMargin: 30.2,
        rewardsMemberPct: 69.5,
        mobileOrderPct: 24,
        newStores: 10,
        closedStores: 4,
      },
      {
        storeCount: 837,
        revenue: 2214,
        revenueYoY: 5.5,
        compStoreSales: 5.0,
        compTransactions: 3.8,
        averageTicket: 302,
        operatingMargin: 31.0,
        rewardsMemberPct: 70.0,
        mobileOrderPct: 25,
        newStores: 10,
        closedStores: 4,
      },
      {
        storeCount: 840,
        revenue: 2094,
        revenueYoY: 4.2,
        compStoreSales: 3.8,
        compTransactions: 2.8,
        averageTicket: 295,
        operatingMargin: 29.2,
        rewardsMemberPct: 70.5,
        mobileOrderPct: 26,
        newStores: 8,
        closedStores: 4,
      },
      {
        storeCount: 842,
        revenue: 2109,
        revenueYoY: 4.0,
        compStoreSales: 3.6,
        compTransactions: 2.6,
        averageTicket: 298,
        operatingMargin: 29.5,
        rewardsMemberPct: 71.0,
        mobileOrderPct: 27,
        newStores: 8,
        closedStores: 3,
      },
      {
        storeCount: 843,
        revenue: 2138,
        revenueYoY: 3.8,
        compStoreSales: 3.4,
        compTransactions: 2.5,
        averageTicket: 302,
        operatingMargin: 29.8,
        rewardsMemberPct: 71.5,
        mobileOrderPct: 28,
        newStores: 8,
        closedStores: 3,
      },
      {
        storeCount: 845,
        revenue: 2169,
        revenueYoY: 4.5,
        compStoreSales: 4.2,
        compTransactions: 3.0,
        averageTicket: 306,
        operatingMargin: 30.5,
        rewardsMemberPct: 72.0,
        mobileOrderPct: 29,
        newStores: 9,
        closedStores: 3,
      },
      {
        storeCount: 845,
        revenue: 2084,
        revenueYoY: 3.5,
        compStoreSales: 3.0,
        compTransactions: 2.2,
        averageTicket: 302,
        operatingMargin: 28.8,
        rewardsMemberPct: 72.5,
        mobileOrderPct: 30,
        newStores: 8,
        closedStores: 3,
      },
      {
        storeCount: 847,
        revenue: 2121,
        revenueYoY: 3.8,
        compStoreSales: 3.4,
        compTransactions: 2.4,
        averageTicket: 305,
        operatingMargin: 29.2,
        rewardsMemberPct: 73.0,
        mobileOrderPct: 32,
        newStores: 9,
        closedStores: 4,
      },
      {
        storeCount: 849,
        revenue: 2183,
        revenueYoY: 4.0,
        compStoreSales: 3.6,
        compTransactions: 2.6,
        averageTicket: 309,
        operatingMargin: 30.0,
        rewardsMemberPct: 73.5,
        mobileOrderPct: 33,
        newStores: 10,
        closedStores: 4,
      },
    ],
  },

  // ── 2. EMEA ───────────────────────────────────────────────────────────────
  // ~600 distribution territories; second largest region (~35% of BD revenue)
  // EUR/USD and GBP/USD headwind -2-3% reported; FXN growth higher than reported
  // BD Rowa pharmacy robotics strong in Germany and UK; Pharmaceutical Systems
  // growing in European pharma customers; strong Vacutainer and diagnostics base
  // Healthcare austerity in some markets moderating capital equipment spend
  {
    name: 'EMEA',
    quarters: [
      {
        storeCount: 582,
        revenue: 1610,
        revenueYoY: 2.8,
        compStoreSales: 3.5,
        compTransactions: 1.8,
        averageTicket: 228,
        operatingMargin: 25.2,
        rewardsMemberPct: 56.0,
        mobileOrderPct: 15,
        newStores: 5,
        closedStores: 3,
      },
      {
        storeCount: 584,
        revenue: 1635,
        revenueYoY: 3.0,
        compStoreSales: 3.8,
        compTransactions: 2.0,
        averageTicket: 232,
        operatingMargin: 25.5,
        rewardsMemberPct: 56.5,
        mobileOrderPct: 16,
        newStores: 5,
        closedStores: 3,
      },
      {
        storeCount: 586,
        revenue: 1658,
        revenueYoY: 3.2,
        compStoreSales: 4.0,
        compTransactions: 2.2,
        averageTicket: 235,
        operatingMargin: 25.8,
        rewardsMemberPct: 57.0,
        mobileOrderPct: 17,
        newStores: 6,
        closedStores: 3,
      },
      {
        storeCount: 588,
        revenue: 1722,
        revenueYoY: 3.5,
        compStoreSales: 4.5,
        compTransactions: 2.5,
        averageTicket: 240,
        operatingMargin: 26.5,
        rewardsMemberPct: 57.5,
        mobileOrderPct: 18,
        newStores: 6,
        closedStores: 2,
      },
      {
        storeCount: 590,
        revenue: 1635,
        revenueYoY: 2.5,
        compStoreSales: 3.2,
        compTransactions: 1.6,
        averageTicket: 232,
        operatingMargin: 24.5,
        rewardsMemberPct: 58.0,
        mobileOrderPct: 19,
        newStores: 5,
        closedStores: 3,
      },
      {
        storeCount: 592,
        revenue: 1647,
        revenueYoY: 2.8,
        compStoreSales: 3.5,
        compTransactions: 1.8,
        averageTicket: 235,
        operatingMargin: 24.8,
        rewardsMemberPct: 58.5,
        mobileOrderPct: 20,
        newStores: 5,
        closedStores: 3,
      },
      {
        storeCount: 593,
        revenue: 1665,
        revenueYoY: 3.0,
        compStoreSales: 3.8,
        compTransactions: 2.0,
        averageTicket: 238,
        operatingMargin: 25.2,
        rewardsMemberPct: 59.0,
        mobileOrderPct: 21,
        newStores: 5,
        closedStores: 2,
      },
      {
        storeCount: 595,
        revenue: 1688,
        revenueYoY: 3.2,
        compStoreSales: 4.0,
        compTransactions: 2.2,
        averageTicket: 242,
        operatingMargin: 25.8,
        rewardsMemberPct: 59.5,
        mobileOrderPct: 22,
        newStores: 6,
        closedStores: 2,
      },
      {
        storeCount: 597,
        revenue: 1635,
        revenueYoY: 3.5,
        compStoreSales: 4.2,
        compTransactions: 2.4,
        averageTicket: 238,
        operatingMargin: 24.2,
        rewardsMemberPct: 60.0,
        mobileOrderPct: 24,
        newStores: 6,
        closedStores: 3,
      },
      {
        storeCount: 598,
        revenue: 1658,
        revenueYoY: 3.2,
        compStoreSales: 4.0,
        compTransactions: 2.2,
        averageTicket: 241,
        operatingMargin: 24.5,
        rewardsMemberPct: 61.0,
        mobileOrderPct: 25,
        newStores: 6,
        closedStores: 3,
      },
      {
        storeCount: 600,
        revenue: 1698,
        revenueYoY: 3.5,
        compStoreSales: 4.5,
        compTransactions: 2.5,
        averageTicket: 245,
        operatingMargin: 25.5,
        rewardsMemberPct: 62.0,
        mobileOrderPct: 26,
        newStores: 7,
        closedStores: 3,
      },
    ],
  },

  // ── 3. Asia Pacific ───────────────────────────────────────────────────────
  // ~365 territories; ~20% of BD revenue
  // China VoBP (Volume-Based Procurement) is the dominant headwind
  // China VoBP Rounds 7-9 impacting BD diagnostics, specimen collection, infusion
  // Q2 FY26: China -9.8% FXN; total APAC -0.8% reported (FX + VoBP)
  // Non-China APAC (Japan, ASEAN, India, ANZ) growing to offset partially
  // India: strong emerging market growth; ASEAN healthcare infrastructure expanding
  {
    name: 'Asia Pacific',
    quarters: [
      {
        storeCount: 352,
        revenue: 855,
        revenueYoY: 5.5,
        compStoreSales: 4.5,
        compTransactions: 3.2,
        averageTicket: 185,
        operatingMargin: 20.5,
        rewardsMemberPct: 42.0,
        mobileOrderPct: 18,
        newStores: 6,
        closedStores: 2,
      },
      {
        storeCount: 354,
        revenue: 880,
        revenueYoY: 5.8,
        compStoreSales: 5.0,
        compTransactions: 3.5,
        averageTicket: 188,
        operatingMargin: 21.0,
        rewardsMemberPct: 42.5,
        mobileOrderPct: 19,
        newStores: 6,
        closedStores: 2,
      },
      {
        storeCount: 356,
        revenue: 895,
        revenueYoY: 5.2,
        compStoreSales: 4.8,
        compTransactions: 3.2,
        averageTicket: 190,
        operatingMargin: 21.2,
        rewardsMemberPct: 43.0,
        mobileOrderPct: 20,
        newStores: 6,
        closedStores: 2,
      },
      {
        storeCount: 358,
        revenue: 920,
        revenueYoY: 4.8,
        compStoreSales: 4.5,
        compTransactions: 3.0,
        averageTicket: 192,
        operatingMargin: 21.5,
        rewardsMemberPct: 43.5,
        mobileOrderPct: 21,
        newStores: 6,
        closedStores: 2,
      },
      {
        storeCount: 360,
        revenue: 912,
        revenueYoY: 4.8,
        compStoreSales: 3.8,
        compTransactions: 2.5,
        averageTicket: 190,
        operatingMargin: 20.8,
        rewardsMemberPct: 44.0,
        mobileOrderPct: 22,
        newStores: 5,
        closedStores: 2,
      },
      {
        storeCount: 361,
        revenue: 905,
        revenueYoY: 4.2,
        compStoreSales: 2.8,
        compTransactions: 1.8,
        averageTicket: 188,
        operatingMargin: 20.2,
        rewardsMemberPct: 44.0,
        mobileOrderPct: 22,
        newStores: 5,
        closedStores: 3,
      },
      {
        storeCount: 362,
        revenue: 888,
        revenueYoY: 3.5,
        compStoreSales: 1.5,
        compTransactions: 0.8,
        averageTicket: 185,
        operatingMargin: 19.8,
        rewardsMemberPct: 44.0,
        mobileOrderPct: 23,
        newStores: 5,
        closedStores: 3,
      },
      {
        storeCount: 362,
        revenue: 875,
        revenueYoY: 2.8,
        compStoreSales: 0.5,
        compTransactions: -0.2,
        averageTicket: 182,
        operatingMargin: 19.5,
        rewardsMemberPct: 43.5,
        mobileOrderPct: 23,
        newStores: 4,
        closedStores: 3,
      },
      {
        storeCount: 362,
        revenue: 850,
        revenueYoY: 2.2,
        compStoreSales: -2.8,
        compTransactions: -1.5,
        averageTicket: 178,
        operatingMargin: 19.2,
        rewardsMemberPct: 43.0,
        mobileOrderPct: 24,
        newStores: 4,
        closedStores: 3,
      },
      {
        storeCount: 362,
        revenue: 838,
        revenueYoY: -0.8,
        compStoreSales: -9.8,
        compTransactions: -4.2,
        averageTicket: 175,
        operatingMargin: 18.8,
        rewardsMemberPct: 42.5,
        mobileOrderPct: 24,
        newStores: 4,
        closedStores: 4,
      },
      {
        storeCount: 363,
        revenue: 855,
        revenueYoY: 0.5,
        compStoreSales: -4.5,
        compTransactions: -1.8,
        averageTicket: 177,
        operatingMargin: 19.0,
        rewardsMemberPct: 43.0,
        mobileOrderPct: 25,
        newStores: 5,
        closedStores: 3,
      },
    ],
  },
];

// =============================================================================
// Main seed function
// =============================================================================

export async function seedRegionalPerformance(
  prisma: PrismaClient,
  companyId: number,
  periodMap: Record<string, { id: number }>,
) {
  const availableQuarters = quarterLabels.filter((q) => periodMap[q]);

  if (availableQuarters.length === 0) {
    console.log('No matching quarters found in periodMap for regional performance — skipping');
    return;
  }

  let recordCount = 0;

  for (const region of regionData) {
    for (let qi = 0; qi < availableQuarters.length; qi++) {
      const quarterLabel = availableQuarters[qi];
      const periodId = periodMap[quarterLabel].id;

      const dataIndex = quarterLabels.indexOf(quarterLabel);
      if (dataIndex === -1 || dataIndex >= region.quarters.length) continue;

      const q = region.quarters[dataIndex];

      await prisma.regionalPerformance.create({
        data: {
          companyId,
          periodId,
          region: region.name,
          storeCount: q.storeCount,
          revenue: q.revenue,
          revenueYoY: q.revenueYoY,
          compStoreSales: q.compStoreSales,
          compTransactions: q.compTransactions,
          averageTicket: q.averageTicket,
          operatingMargin: q.operatingMargin,
          rewardsMemberPct: q.rewardsMemberPct,
          mobileOrderPct: q.mobileOrderPct,
          newStores: q.newStores,
          closedStores: q.closedStores,
        },
      });
      recordCount++;
    }
  }

  console.log(
    `Seeded ${recordCount} BD (Becton, Dickinson) regional performance records ` +
    `(${regionData.length} regions x ${availableQuarters.length} quarters)`,
  );
}
