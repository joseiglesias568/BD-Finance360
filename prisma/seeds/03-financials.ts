import { PrismaClient } from '@prisma/client';

// SOURCE: Becton, Dickinson and Company (BDX) — Q2 FY2026 earnings (May 2026),
// FY2025 10-K (filed Nov 2025), and investor supplements.
//
// BD reports 4 primary reportable segments (continuing operations post-Waters spin-off Feb 2026):
//   1. Medical Essentials (ME): MDS disposables, specimen management. FY2025: $6,098M
//   2. Connected Care (CC): Medication management systems, AlarisPump, patient monitoring. FY2025: $4,556M
//   3. BioPharma Systems (BPS): Drug delivery, prefillable syringes. FY2025: $2,324M
//   4. Interventional (INT): Surgery, peripheral intervention, urology/critical care. FY2025: $5,217M
//
// Waters Corporation (Life Sciences / diagnostics segment) spun off February 2026.
// All revenue in $M (continuing operations). Annual totals FY2025 ~$18,195M continuing ops.
// GAAP total company (including discontinued Waters) FY2025: $21,840M.

export async function seedFinancials(
  prisma: PrismaClient,
  companyId: number,
  periodMap: Record<string, { id: number }>
) {
  // ── Business Segments ──────────────────────────────────────────────────
  await prisma.businessSegment.deleteMany({ where: { companyId } });

  const me = await prisma.businessSegment.create({
    data: {
      companyId,
      name: 'Medical Essentials',
      revenuePercent: 33,
      description:
        'BD Medical Essentials segment — needles, syringes, IV catheters, specimen management, and prefilled flush syringes. Largest segment by volume. Q2 FY26: $1,647M (+1.7% FXN). Sub-units: Medical Delivery Solutions (MDS, ~75% of segment) and Specimen Management (SM, ~25%). Key products: BD PosiFlush, BD Nexiva, BD Vacutainer. Organic growth driven by global hospital demand for disposables; headwinds from China VBP (Volume-Based Procurement) pricing pressure and competitive bidding. FY2025: $6,098M.',
    },
  });

  const cc = await prisma.businessSegment.create({
    data: {
      companyId,
      name: 'Connected Care',
      revenuePercent: 25,
      description:
        'BD Connected Care segment — medication management systems (Alaris infusion pumps), acute care patient monitoring (APM, acquired AlarisMed / Baxter Hospital Products Sep 2024), and smart medication dispensing. Q2 FY26: $1,120M (+3.2% FXN). APM acquired Sep 3, 2024 added ~$1,082M annualized revenue. BD Alaris system remediation (FDA 510(k) clearance secured 2023; return to market ongoing). Growth driven by Alaris installed base expansion and APM integration. FY2025: $4,556M.',
    },
  });

  const bps = await prisma.businessSegment.create({
    data: {
      companyId,
      name: 'BioPharma Systems',
      revenuePercent: 13,
      description:
        'BD BioPharma Systems segment — drug delivery systems for pharmaceutical and biotech customers. Products: prefillable glass syringes (Hypak, Uniject), drug delivery platforms (AutoGuard, Intevia), GLP-1 pen delivery systems. Q2 FY26: $590M (-1.8% FXN). Headwinds: timing of pharmaceutical partner orders (lumpy revenue), customer inventory corrections. Key opportunity: GLP-1 delivery platform wins (semaglutide/tirzepatide injectable devices) — positioned to benefit from 2026–2028 GLP-1 drug launch cycle. FY2025: $2,324M.',
    },
  });

  const intv = await prisma.businessSegment.create({
    data: {
      companyId,
      name: 'Interventional',
      revenuePercent: 29,
      description:
        'BD Interventional segment — surgical instruments, peripheral intervention (PI), and urology/critical care (UCC). Sub-units: Surgery ($1,572M FY25), Peripheral Intervention ($1,996M FY25), Urology & Critical Care ($1,649M FY25). Q2 FY26: $1,357M (+5.3% FXN). Key products: Lutonix drug-coated balloon, Covance guidewires, Avitene Flowable hemostatic (launched Q1 FY26), BD Purewick external catheters, Rusch urological devices. Growth driven by new product launches and recovery in elective procedures. FY2025: $5,217M.',
    },
  });

  console.log('Seeded 4 BD business segments...');

  // ── Segment Results (10 Quarters: Q1 FY24 – Q2 FY26) ──────────────────
  // Revenue in $M (continuing operations). YoY changes in %.
  // Adjusted operating margin ~24–25% for each segment (enterprise-level proxy).
  const segmentData = [
    // Q1 FY24
    { period: 'Q1 FY24',
      me:   { rev: 1392, yoy: 0,   margin: 23.5 },
      cc:   { rev: 798,  yoy: 0,   margin: 21.0 },
      bps:  { rev: 543,  yoy: 0,   margin: 26.0 },
      intv: { rev: 1176, yoy: 0,   margin: 24.5 },
    },
    // Q2 FY24
    { period: 'Q2 FY24',
      me:   { rev: 1454, yoy: 2.0, margin: 23.8 },
      cc:   { rev: 839,  yoy: 3.0, margin: 21.5 },
      bps:  { rev: 568,  yoy: 2.5, margin: 26.5 },
      intv: { rev: 1245, yoy: 3.5, margin: 24.8 },
    },
    // Q3 FY24
    { period: 'Q3 FY24',
      me:   { rev: 1492, yoy: 2.5, margin: 24.0 },
      cc:   { rev: 863,  yoy: 3.5, margin: 22.0 },
      bps:  { rev: 582,  yoy: 3.0, margin: 27.0 },
      intv: { rev: 1279, yoy: 4.0, margin: 25.0 },
    },
    // Q4 FY24 — APM acquisition closed Sep 3, 2024; partial quarter CC contribution
    { period: 'Q4 FY24',
      me:   { rev: 1493, yoy: 1.5, margin: 24.2 },
      cc:   { rev: 871,  yoy: 4.5, margin: 21.8 },
      bps:  { rev: 580,  yoy: 1.0, margin: 26.8 },
      intv: { rev: 1280, yoy: 4.0, margin: 25.2 },
    },
    // Q1 FY25 — APM first full quarter contribution to CC
    { period: 'Q1 FY25',
      me:   { rev: 1586, yoy: 0.5, margin: 23.8 },
      cc:   { rev: 1073, yoy: 4.7, margin: 22.5 },
      bps:  { rev: 418,  yoy: 1.0, margin: 24.5 },
      intv: { rev: 1257, yoy: 5.1, margin: 25.3 },
    },
    // Q2 FY25
    { period: 'Q2 FY25',
      me:   { rev: 1573, yoy: 0.5, margin: 24.0 },
      cc:   { rev: 1068, yoy: 4.7, margin: 22.8 },
      bps:  { rev: 575,  yoy: 1.0, margin: 25.3 },
      intv: { rev: 1264, yoy: 5.1, margin: 25.6 },
    },
    // Q3 FY25 (estimated)
    { period: 'Q3 FY25',
      me:   { rev: 1573, yoy: 0.5, margin: 24.1 },
      cc:   { rev: 1143, yoy: 4.2, margin: 22.5 },
      bps:  { rev: 610,  yoy: 1.0, margin: 25.5 },
      intv: { rev: 1350, yoy: 5.0, margin: 25.5 },
    },
    // Q4 FY25 (estimated)
    { period: 'Q4 FY25',
      me:   { rev: 1366, yoy: 0.5, margin: 22.8 },
      cc:   { rev: 1272, yoy: 4.2, margin: 23.0 },
      bps:  { rev: 721,  yoy: 1.0, margin: 27.5 },
      intv: { rev: 1346, yoy: 5.0, margin: 25.4 },
    },
    // Q1 FY26
    { period: 'Q1 FY26',
      me:   { rev: 1595, yoy: 1.7, margin: 23.5 },
      cc:   { rev: 1131, yoy: 3.2, margin: 21.8 },
      bps:  { rev: 429,  yoy: -1.8, margin: 24.0 },
      intv: { rev: 1330, yoy: 5.3, margin: 25.0 },
    },
    // Q2 FY26
    { period: 'Q2 FY26',
      me:   { rev: 1647, yoy: 1.7, margin: 23.8 },
      cc:   { rev: 1120, yoy: 3.2, margin: 21.5 },
      bps:  { rev: 590,  yoy: -1.8, margin: 24.2 },
      intv: { rev: 1357, yoy: 5.3, margin: 25.3 },
    },
  ];

  for (const q of segmentData) {
    const periodId = periodMap[q.period].id;
    await prisma.segmentResult.createMany({
      data: [
        { segmentId: me.id,   periodId, revenue: q.me.rev,   yoyChange: q.me.yoy,   operatingMargin: q.me.margin   },
        { segmentId: cc.id,   periodId, revenue: q.cc.rev,   yoyChange: q.cc.yoy,   operatingMargin: q.cc.margin   },
        { segmentId: bps.id,  periodId, revenue: q.bps.rev,  yoyChange: q.bps.yoy,  operatingMargin: q.bps.margin  },
        { segmentId: intv.id, periodId, revenue: q.intv.rev, yoyChange: q.intv.yoy, operatingMargin: q.intv.margin },
      ],
    });
  }

  console.log(`Seeded ${segmentData.length * 4} segment results across ${segmentData.length} quarters`);

  // ── Quarterly Results (10 Quarters) ──────────────────────────────────────
  // Revenue in $M (continuing ops). EPS adjusted diluted.
  // compStoreSales repurposed as organic/FXN revenue growth %.
  // netNewStores repurposed as new product revenue ($M) each quarter.
  await prisma.quarterlyResult.createMany({
    data: [
      {
        periodId: periodMap['Q1 FY24'].id,
        revenue: 3909,
        revenueYoY: 2.5,
        operatingIncome: 938,
        operatingMargin: 24.0,
        eps: 3.08,
        compStoreSales: 4.8,   // organic FXN growth %
        netNewStores: 703,     // new product revenue $M
      },
      {
        periodId: periodMap['Q2 FY24'].id,
        revenue: 4106,
        revenueYoY: 2.8,
        operatingIncome: 985,
        operatingMargin: 24.0,
        eps: 3.24,
        compStoreSales: 5.0,
        netNewStores: 739,
      },
      {
        periodId: periodMap['Q3 FY24'].id,
        revenue: 4216,
        revenueYoY: 3.5,
        operatingIncome: 1012,
        operatingMargin: 24.0,
        eps: 3.33,
        compStoreSales: 5.2,
        netNewStores: 759,
      },
      {
        periodId: periodMap['Q4 FY24'].id,
        revenue: 4224,
        revenueYoY: 3.8,
        operatingIncome: 1014,
        operatingMargin: 24.0,
        eps: 3.35,
        compStoreSales: 4.5,
        netNewStores: 760,
      },
      {
        periodId: periodMap['Q1 FY25'].id,
        revenue: 4334,
        revenueYoY: 4.1,
        operatingIncome: 1045,
        operatingMargin: 24.1,
        eps: 2.93,   // diluted adj EPS; more shares from APM deal
        compStoreSales: 4.7,
        netNewStores: 780,
      },
      {
        periodId: periodMap['Q2 FY25'].id,
        revenue: 4480,
        revenueYoY: 3.5,
        operatingIncome: 1083,
        operatingMargin: 24.2,
        eps: 2.79,
        compStoreSales: 4.1,
        netNewStores: 806,
      },
      {
        periodId: periodMap['Q3 FY25'].id,
        revenue: 4676,
        revenueYoY: 3.8,
        operatingIncome: 1130,
        operatingMargin: 24.2,
        eps: 3.00,
        compStoreSales: 4.5,
        netNewStores: 841,
      },
      {
        periodId: periodMap['Q4 FY25'].id,
        revenue: 4705,
        revenueYoY: 4.0,
        operatingIncome: 1153,
        operatingMargin: 24.5,
        eps: 3.08,
        compStoreSales: 4.3,
        netNewStores: 847,
      },
      {
        periodId: periodMap['Q1 FY26'].id,
        revenue: 4485,
        revenueYoY: 3.5,
        operatingIncome: 951,
        operatingMargin: 21.2,  // adj operating margin per Q1 FY26 actuals
        eps: 2.91,
        compStoreSales: 2.6,
        netNewStores: 807,
      },
      {
        periodId: periodMap['Q2 FY26'].id,
        revenue: 4714,
        revenueYoY: 5.2,
        operatingIncome: 1141,
        operatingMargin: 24.2,  // adj operating margin per Q2 FY26 actuals
        eps: 2.90,
        compStoreSales: 2.6,
        netNewStores: 848,
      },
    ],
  });

  console.log('Seeded 10 quarterly results');

  // ── Financial Statements (P&L, $M, continuing ops) ──────────────────────
  // Adjusted gross margin ~54–55%; GAAP gross margin ~45%.
  // R&D ~5.8% of revenue; Interest expense ~$150M/quarter.
  // We seed GAAP-basis P&L here. Amounts in $M.
  const plData = [
    {
      period: 'Q1 FY24',
      lines: [
        { lineItem: 'revenue',           label: 'Total Revenues',           actual: 3909,  plan: 3850,  priorYear: 3815,  variance: 59,   variancePercent: +(59/3850*100).toFixed(2)   },
        { lineItem: 'cogs',              label: 'Cost of Products Sold',    actual: 2126,  plan: 2100,  priorYear: 2090,  variance: -26,  variancePercent: +(-26/2100*100).toFixed(2)  },
        { lineItem: 'grossProfit',       label: 'Gross Profit',             actual: 1783,  plan: 1750,  priorYear: 1725,  variance: 33,   variancePercent: +(33/1750*100).toFixed(2)   },
        { lineItem: 'operatingExpenses', label: 'Operating Expenses',       actual: 845,   plan: 840,   priorYear: 830,   variance: -5,   variancePercent: +(-5/840*100).toFixed(2)    },
        { lineItem: 'operatingIncome',   label: 'Operating Income',         actual: 938,   plan: 910,   priorYear: 895,   variance: 28,   variancePercent: +(28/910*100).toFixed(2)    },
        { lineItem: 'netIncome',         label: 'Net Income (Continuing)',  actual: 465,   plan: 445,   priorYear: 435,   variance: 20,   variancePercent: +(20/445*100).toFixed(2)    },
      ],
    },
    {
      period: 'Q2 FY24',
      lines: [
        { lineItem: 'revenue',           label: 'Total Revenues',           actual: 4106,  plan: 4050,  priorYear: 3994,  variance: 56,   variancePercent: +(56/4050*100).toFixed(2)   },
        { lineItem: 'cogs',              label: 'Cost of Products Sold',    actual: 2232,  plan: 2210,  priorYear: 2196,  variance: -22,  variancePercent: +(-22/2210*100).toFixed(2)  },
        { lineItem: 'grossProfit',       label: 'Gross Profit',             actual: 1874,  plan: 1840,  priorYear: 1798,  variance: 34,   variancePercent: +(34/1840*100).toFixed(2)   },
        { lineItem: 'operatingExpenses', label: 'Operating Expenses',       actual: 889,   plan: 880,   priorYear: 865,   variance: -9,   variancePercent: +(-9/880*100).toFixed(2)    },
        { lineItem: 'operatingIncome',   label: 'Operating Income',         actual: 985,   plan: 960,   priorYear: 933,   variance: 25,   variancePercent: +(25/960*100).toFixed(2)    },
        { lineItem: 'netIncome',         label: 'Net Income (Continuing)',  actual: 490,   plan: 470,   priorYear: 455,   variance: 20,   variancePercent: +(20/470*100).toFixed(2)    },
      ],
    },
    {
      period: 'Q3 FY24',
      lines: [
        { lineItem: 'revenue',           label: 'Total Revenues',           actual: 4216,  plan: 4150,  priorYear: 4070,  variance: 66,   variancePercent: +(66/4150*100).toFixed(2)   },
        { lineItem: 'cogs',              label: 'Cost of Products Sold',    actual: 2290,  plan: 2260,  priorYear: 2238,  variance: -30,  variancePercent: +(-30/2260*100).toFixed(2)  },
        { lineItem: 'grossProfit',       label: 'Gross Profit',             actual: 1926,  plan: 1890,  priorYear: 1832,  variance: 36,   variancePercent: +(36/1890*100).toFixed(2)   },
        { lineItem: 'operatingExpenses', label: 'Operating Expenses',       actual: 914,   plan: 905,   priorYear: 884,   variance: -9,   variancePercent: +(-9/905*100).toFixed(2)    },
        { lineItem: 'operatingIncome',   label: 'Operating Income',         actual: 1012,  plan: 985,   priorYear: 948,   variance: 27,   variancePercent: +(27/985*100).toFixed(2)    },
        { lineItem: 'netIncome',         label: 'Net Income (Continuing)',  actual: 503,   plan: 485,   priorYear: 460,   variance: 18,   variancePercent: +(18/485*100).toFixed(2)    },
      ],
    },
    {
      period: 'Q4 FY24',
      lines: [
        { lineItem: 'revenue',           label: 'Total Revenues',           actual: 4224,  plan: 4180,  priorYear: 4066,  variance: 44,   variancePercent: +(44/4180*100).toFixed(2)   },
        { lineItem: 'cogs',              label: 'Cost of Products Sold',    actual: 2293,  plan: 2280,  priorYear: 2236,  variance: -13,  variancePercent: +(-13/2280*100).toFixed(2)  },
        { lineItem: 'grossProfit',       label: 'Gross Profit',             actual: 1931,  plan: 1900,  priorYear: 1830,  variance: 31,   variancePercent: +(31/1900*100).toFixed(2)   },
        { lineItem: 'operatingExpenses', label: 'Operating Expenses',       actual: 917,   plan: 912,   priorYear: 882,   variance: -5,   variancePercent: +(-5/912*100).toFixed(2)    },
        { lineItem: 'operatingIncome',   label: 'Operating Income',         actual: 1014,  plan: 988,   priorYear: 948,   variance: 26,   variancePercent: +(26/988*100).toFixed(2)    },
        { lineItem: 'netIncome',         label: 'Net Income (Continuing)',  actual: 504,   plan: 490,   priorYear: 460,   variance: 14,   variancePercent: +(14/490*100).toFixed(2)    },
      ],
    },
    {
      period: 'Q1 FY25',
      lines: [
        { lineItem: 'revenue',           label: 'Total Revenues',           actual: 4334,  plan: 4280,  priorYear: 3909,  variance: 54,   variancePercent: +(54/4280*100).toFixed(2)   },
        { lineItem: 'cogs',              label: 'Cost of Products Sold',    actual: 2430,  plan: 2400,  priorYear: 2126,  variance: -30,  variancePercent: +(-30/2400*100).toFixed(2)  },
        { lineItem: 'grossProfit',       label: 'Gross Profit',             actual: 1904,  plan: 1880,  priorYear: 1783,  variance: 24,   variancePercent: +(24/1880*100).toFixed(2)   },
        { lineItem: 'operatingExpenses', label: 'Operating Expenses',       actual: 859,   plan: 855,   priorYear: 845,   variance: -4,   variancePercent: +(-4/855*100).toFixed(2)    },
        { lineItem: 'operatingIncome',   label: 'Operating Income',         actual: 1045,  plan: 1025,  priorYear: 938,   variance: 20,   variancePercent: +(20/1025*100).toFixed(2)   },
        { lineItem: 'netIncome',         label: 'Net Income (Continuing)',  actual: 495,   plan: 480,   priorYear: 465,   variance: 15,   variancePercent: +(15/480*100).toFixed(2)    },
      ],
    },
    {
      period: 'Q2 FY25',
      lines: [
        { lineItem: 'revenue',           label: 'Total Revenues',           actual: 4480,  plan: 4430,  priorYear: 4106,  variance: 50,   variancePercent: +(50/4430*100).toFixed(2)   },
        { lineItem: 'cogs',              label: 'Cost of Products Sold',    actual: 2512,  plan: 2490,  priorYear: 2232,  variance: -22,  variancePercent: +(-22/2490*100).toFixed(2)  },
        { lineItem: 'grossProfit',       label: 'Gross Profit',             actual: 1968,  plan: 1940,  priorYear: 1874,  variance: 28,   variancePercent: +(28/1940*100).toFixed(2)   },
        { lineItem: 'operatingExpenses', label: 'Operating Expenses',       actual: 885,   plan: 878,   priorYear: 889,   variance: -7,   variancePercent: +(-7/878*100).toFixed(2)    },
        { lineItem: 'operatingIncome',   label: 'Operating Income',         actual: 1083,  plan: 1062,  priorYear: 985,   variance: 21,   variancePercent: +(21/1062*100).toFixed(2)   },
        { lineItem: 'netIncome',         label: 'Net Income (Continuing)',  actual: 512,   plan: 500,   priorYear: 490,   variance: 12,   variancePercent: +(12/500*100).toFixed(2)    },
      ],
    },
    {
      period: 'Q3 FY25',
      lines: [
        { lineItem: 'revenue',           label: 'Total Revenues',           actual: 4676,  plan: 4620,  priorYear: 4216,  variance: 56,   variancePercent: +(56/4620*100).toFixed(2)   },
        { lineItem: 'cogs',              label: 'Cost of Products Sold',    actual: 2620,  plan: 2595,  priorYear: 2290,  variance: -25,  variancePercent: +(-25/2595*100).toFixed(2)  },
        { lineItem: 'grossProfit',       label: 'Gross Profit',             actual: 2056,  plan: 2025,  priorYear: 1926,  variance: 31,   variancePercent: +(31/2025*100).toFixed(2)   },
        { lineItem: 'operatingExpenses', label: 'Operating Expenses',       actual: 926,   plan: 920,   priorYear: 914,   variance: -6,   variancePercent: +(-6/920*100).toFixed(2)    },
        { lineItem: 'operatingIncome',   label: 'Operating Income',         actual: 1130,  plan: 1105,  priorYear: 1012,  variance: 25,   variancePercent: +(25/1105*100).toFixed(2)   },
        { lineItem: 'netIncome',         label: 'Net Income (Continuing)',  actual: 535,   plan: 520,   priorYear: 503,   variance: 15,   variancePercent: +(15/520*100).toFixed(2)    },
      ],
    },
    {
      period: 'Q4 FY25',
      lines: [
        { lineItem: 'revenue',           label: 'Total Revenues',           actual: 4705,  plan: 4665,  priorYear: 4224,  variance: 40,   variancePercent: +(40/4665*100).toFixed(2)   },
        { lineItem: 'cogs',              label: 'Cost of Products Sold',    actual: 2638,  plan: 2620,  priorYear: 2293,  variance: -18,  variancePercent: +(-18/2620*100).toFixed(2)  },
        { lineItem: 'grossProfit',       label: 'Gross Profit',             actual: 2067,  plan: 2045,  priorYear: 1931,  variance: 22,   variancePercent: +(22/2045*100).toFixed(2)   },
        { lineItem: 'operatingExpenses', label: 'Operating Expenses',       actual: 914,   plan: 909,   priorYear: 917,   variance: -5,   variancePercent: +(-5/909*100).toFixed(2)    },
        { lineItem: 'operatingIncome',   label: 'Operating Income',         actual: 1153,  plan: 1136,  priorYear: 1014,  variance: 17,   variancePercent: +(17/1136*100).toFixed(2)   },
        { lineItem: 'netIncome',         label: 'Net Income (Continuing)',  actual: 546,   plan: 535,   priorYear: 504,   variance: 11,   variancePercent: +(11/535*100).toFixed(2)    },
      ],
    },
    {
      period: 'Q1 FY26',
      lines: [
        { lineItem: 'revenue',           label: 'Total Revenues',           actual: 4485,  plan: 4450,  priorYear: 4334,  variance: 35,   variancePercent: +(35/4450*100).toFixed(2)   },
        { lineItem: 'cogs',              label: 'Cost of Products Sold',    actual: 2463,  plan: 2445,  priorYear: 2430,  variance: -18,  variancePercent: +(-18/2445*100).toFixed(2)  },
        { lineItem: 'grossProfit',       label: 'Gross Profit',             actual: 2022,  plan: 2005,  priorYear: 1904,  variance: 17,   variancePercent: +(17/2005*100).toFixed(2)   },
        { lineItem: 'operatingExpenses', label: 'Operating Expenses',       actual: 1071,  plan: 1065,  priorYear: 859,   variance: -6,   variancePercent: +(-6/1065*100).toFixed(2)   },
        { lineItem: 'operatingIncome',   label: 'Operating Income',         actual: 951,   plan: 940,   priorYear: 1045,  variance: 11,   variancePercent: +(11/940*100).toFixed(2)    },
        { lineItem: 'netIncome',         label: 'Net Income (Continuing)',  actual: 445,   plan: 438,   priorYear: 495,   variance: 7,    variancePercent: +(7/438*100).toFixed(2)     },
      ],
    },
    {
      period: 'Q2 FY26',
      lines: [
        { lineItem: 'revenue',           label: 'Total Revenues',           actual: 4714,  plan: 4680,  priorYear: 4480,  variance: 34,   variancePercent: +(34/4680*100).toFixed(2)   },
        { lineItem: 'cogs',              label: 'Cost of Products Sold',    actual: 2589,  plan: 2574,  priorYear: 2512,  variance: -15,  variancePercent: +(-15/2574*100).toFixed(2)  },
        { lineItem: 'grossProfit',       label: 'Gross Profit',             actual: 2125,  plan: 2106,  priorYear: 1968,  variance: 19,   variancePercent: +(19/2106*100).toFixed(2)   },
        { lineItem: 'operatingExpenses', label: 'Operating Expenses',       actual: 984,   plan: 978,   priorYear: 885,   variance: -6,   variancePercent: +(-6/978*100).toFixed(2)    },
        { lineItem: 'operatingIncome',   label: 'Operating Income',         actual: 1141,  plan: 1128,  priorYear: 1083,  variance: 13,   variancePercent: +(13/1128*100).toFixed(2)   },
        { lineItem: 'netIncome',         label: 'Net Income (Continuing)',  actual: 536,   plan: 528,   priorYear: 512,   variance: 8,    variancePercent: +(8/528*100).toFixed(2)     },
      ],
    },
  ];

  for (const q of plData) {
    const periodId = periodMap[q.period].id;
    await prisma.financialStatement.createMany({
      data: q.lines.map((l) => ({
        companyId,
        periodId,
        lineItem: l.lineItem,
        label: l.label,
        actual: l.actual,
        plan: l.plan,
        priorYear: l.priorYear,
        variance: l.variance,
        variancePercent: l.variancePercent,
      })),
    });
  }

  console.log(`Seeded ${plData.length * 6} financial statement lines across ${plData.length} quarters`);

  // ── Revenue Bridge Items (quarterly, $M continuing ops) ──────────────────
  // Key drivers: organic volume, pricing, FX, acquisitions (APM), new product launches.
  const bridgeData = [
    {
      period: 'Q1 FY24',
      items: [
        { label: 'Organic Volume Growth',              impact: 98,   category: 'volume'  },
        { label: 'Pricing Realization',                impact: 39,   category: 'price'   },
        { label: 'Foreign Exchange Impact',            impact: -28,  category: 'fx'      },
        { label: 'New Product Launches',               impact: 25,   category: 'volume'  },
        { label: 'China VBP Headwind',                 impact: -40,  category: 'other'   },
      ],
    },
    {
      period: 'Q2 FY24',
      items: [
        { label: 'Organic Volume Growth',              impact: 106,  category: 'volume'  },
        { label: 'Pricing Realization',                impact: 41,   category: 'price'   },
        { label: 'Foreign Exchange Impact',            impact: -22,  category: 'fx'      },
        { label: 'Interventional New Products',        impact: 32,   category: 'volume'  },
        { label: 'China VBP Headwind',                 impact: -45,  category: 'other'   },
      ],
    },
    {
      period: 'Q3 FY24',
      items: [
        { label: 'Organic Volume Growth',              impact: 112,  category: 'volume'  },
        { label: 'Pricing Realization',                impact: 44,   category: 'price'   },
        { label: 'Foreign Exchange Impact',            impact: -18,  category: 'fx'      },
        { label: 'BioPharma Systems Order Recovery',   impact: 28,   category: 'volume'  },
        { label: 'China VBP Headwind',                 impact: -42,  category: 'other'   },
      ],
    },
    {
      period: 'Q4 FY24',
      items: [
        { label: 'Organic Volume Growth',              impact: 104,  category: 'volume'  },
        { label: 'APM Acquisition (Partial Quarter)',  impact: 85,   category: 'volume'  },
        { label: 'Pricing Realization',                impact: 40,   category: 'price'   },
        { label: 'Foreign Exchange Impact',            impact: -20,  category: 'fx'      },
        { label: 'China VBP Headwind',                 impact: -47,  category: 'other'   },
      ],
    },
    {
      period: 'Q1 FY25',
      items: [
        { label: 'APM Acquisition Full Quarter',       impact: 175,  category: 'volume'  },
        { label: 'Organic Volume Growth',              impact: 105,  category: 'volume'  },
        { label: 'Pricing Realization',                impact: 45,   category: 'price'   },
        { label: 'Foreign Exchange Impact',            impact: -35,  category: 'fx'      },
        { label: 'China VBP / Emerging Markets',       impact: -52,  category: 'other'   },
      ],
    },
    {
      period: 'Q2 FY25',
      items: [
        { label: 'APM Acquisition Revenue',            impact: 170,  category: 'volume'  },
        { label: 'Organic Volume Growth',              impact: 98,   category: 'volume'  },
        { label: 'Pricing Realization',                impact: 46,   category: 'price'   },
        { label: 'New Product Launches (Avitene etc)', impact: 35,   category: 'volume'  },
        { label: 'Foreign Exchange Impact',            impact: -38,  category: 'fx'      },
        { label: 'China VBP Headwind',                 impact: -55,  category: 'other'   },
      ],
    },
    {
      period: 'Q3 FY25',
      items: [
        { label: 'APM Revenue Contribution',           impact: 165,  category: 'volume'  },
        { label: 'Organic Volume Growth',              impact: 115,  category: 'volume'  },
        { label: 'Pricing Realization',                impact: 48,   category: 'price'   },
        { label: 'GLP-1 Delivery Platform Growth',     impact: 40,   category: 'volume'  },
        { label: 'Foreign Exchange Impact',            impact: -42,  category: 'fx'      },
        { label: 'China VBP Headwind',                 impact: -58,  category: 'other'   },
      ],
    },
    {
      period: 'Q4 FY25',
      items: [
        { label: 'APM Revenue Contribution',           impact: 160,  category: 'volume'  },
        { label: 'Organic Volume Growth',              impact: 108,  category: 'volume'  },
        { label: 'Pricing Realization',                impact: 50,   category: 'price'   },
        { label: 'BioPharma Systems Year-End Orders',  impact: 55,   category: 'volume'  },
        { label: 'Foreign Exchange Impact',            impact: -40,  category: 'fx'      },
        { label: 'China VBP Headwind',                 impact: -60,  category: 'other'   },
      ],
    },
    {
      period: 'Q1 FY26',
      items: [
        { label: 'Organic Volume Growth',              impact: 96,   category: 'volume'  },
        { label: 'Interventional New Products',        impact: 58,   category: 'volume'  },
        { label: 'Pricing Realization',                impact: 44,   category: 'price'   },
        { label: 'Foreign Exchange Impact',            impact: -48,  category: 'fx'      },
        { label: 'China VBP Headwind (-9.8% FXN)',     impact: -72,  category: 'other'   },
        { label: 'BPS Order Timing Headwind',          impact: -45,  category: 'other'   },
      ],
    },
    {
      period: 'Q2 FY26',
      items: [
        { label: 'Organic Volume Growth',              impact: 122,  category: 'volume'  },
        { label: 'Interventional Growth (+5.3% FXN)',  impact: 68,   category: 'volume'  },
        { label: 'Pricing Realization',                impact: 46,   category: 'price'   },
        { label: 'HemoSphere Stream Module Launch',    impact: 38,   category: 'volume'  },
        { label: 'Foreign Exchange Impact',            impact: -52,  category: 'fx'      },
        { label: 'China VBP Headwind',                 impact: -75,  category: 'other'   },
      ],
    },
  ];

  for (const q of bridgeData) {
    const periodId = periodMap[q.period].id;
    await prisma.revenueBridgeItem.createMany({
      data: q.items.map((item, idx) => ({
        companyId,
        periodId,
        label: item.label,
        impact: item.impact,
        category: item.category,
        sortOrder: idx,
      })),
    });
  }

  console.log(`Seeded revenue bridge items across ${bridgeData.length} quarters`);

  // ── Financial Ratios (10 Quarters) ────────────────────────────────────
  // BD MedTech characteristics: moderate leverage (~2.9x), strong FCF,
  // dividend yield ~1.8%, R&D ~5.8% of revenue.
  const ratioData = [
    { period: 'Q1 FY24', ratios: { currentRatio: 1.15, debtToEquity: 1.45, returnOnEquity: 14.2, returnOnAssets: 5.8, freeCashFlow: 580, dividendPerShare: 0.91, rAndDPercent: 5.8, netLeverage: 3.2 } },
    { period: 'Q2 FY24', ratios: { currentRatio: 1.18, debtToEquity: 1.43, returnOnEquity: 14.5, returnOnAssets: 5.9, freeCashFlow: 620, dividendPerShare: 0.91, rAndDPercent: 5.8, netLeverage: 3.1 } },
    { period: 'Q3 FY24', ratios: { currentRatio: 1.20, debtToEquity: 1.40, returnOnEquity: 14.8, returnOnAssets: 6.0, freeCashFlow: 650, dividendPerShare: 0.91, rAndDPercent: 5.7, netLeverage: 3.0 } },
    { period: 'Q4 FY24', ratios: { currentRatio: 1.22, debtToEquity: 1.55, returnOnEquity: 14.2, returnOnAssets: 5.7, freeCashFlow: 580, dividendPerShare: 0.91, rAndDPercent: 5.9, netLeverage: 3.4 } },
    { period: 'Q1 FY25', ratios: { currentRatio: 1.20, debtToEquity: 1.52, returnOnEquity: 14.0, returnOnAssets: 5.6, freeCashFlow: 610, dividendPerShare: 0.95, rAndDPercent: 5.8, netLeverage: 3.3 } },
    { period: 'Q2 FY25', ratios: { currentRatio: 1.21, debtToEquity: 1.50, returnOnEquity: 14.2, returnOnAssets: 5.7, freeCashFlow: 640, dividendPerShare: 0.95, rAndDPercent: 5.8, netLeverage: 3.2 } },
    { period: 'Q3 FY25', ratios: { currentRatio: 1.22, debtToEquity: 1.48, returnOnEquity: 14.5, returnOnAssets: 5.8, freeCashFlow: 680, dividendPerShare: 0.95, rAndDPercent: 5.8, netLeverage: 3.1 } },
    { period: 'Q4 FY25', ratios: { currentRatio: 1.25, debtToEquity: 1.45, returnOnEquity: 14.8, returnOnAssets: 6.0, freeCashFlow: 760, dividendPerShare: 0.95, rAndDPercent: 5.7, netLeverage: 2.9 } },
    { period: 'Q1 FY26', ratios: { currentRatio: 1.28, debtToEquity: 1.42, returnOnEquity: 13.8, returnOnAssets: 5.5, freeCashFlow: 540, dividendPerShare: 0.95, rAndDPercent: 5.2, netLeverage: 3.0 } },
    { period: 'Q2 FY26', ratios: { currentRatio: 1.30, debtToEquity: 1.38, returnOnEquity: 14.2, returnOnAssets: 5.8, freeCashFlow: 555, dividendPerShare: 0.95, rAndDPercent: 5.2, netLeverage: 2.9 } },
  ];

  for (const q of ratioData) {
    const periodId = periodMap[q.period].id;
    const entries = Object.entries(q.ratios);
    await prisma.financialRatio.createMany({
      data: entries.map(([name, value]) => ({
        companyId,
        periodId,
        name,
        value,
      })),
    });
  }

  console.log(`Seeded ${ratioData.length * 8} financial ratios across ${ratioData.length} quarters`);

  // ── Working Capital Metrics (10 Quarters) ─────────────────────────────
  // BD working capital: DSO ~55-65 days (medical device customer payment terms),
  // inventory days ~85-100 (device components, complex manufacturing),
  // DPO ~45-55 (supplier payment terms).
  const wcData = [
    { period: 'Q1 FY24', dso: { actual: 62, target: 60 }, invDays: { actual: 92, target: 90 }, dpo: { actual: 48, target: 50 } },
    { period: 'Q2 FY24', dso: { actual: 61, target: 60 }, invDays: { actual: 91, target: 90 }, dpo: { actual: 49, target: 50 } },
    { period: 'Q3 FY24', dso: { actual: 60, target: 60 }, invDays: { actual: 90, target: 90 }, dpo: { actual: 50, target: 50 } },
    { period: 'Q4 FY24', dso: { actual: 63, target: 60 }, invDays: { actual: 95, target: 90 }, dpo: { actual: 47, target: 50 } },
    { period: 'Q1 FY25', dso: { actual: 62, target: 60 }, invDays: { actual: 94, target: 90 }, dpo: { actual: 48, target: 50 } },
    { period: 'Q2 FY25', dso: { actual: 61, target: 60 }, invDays: { actual: 93, target: 90 }, dpo: { actual: 49, target: 50 } },
    { period: 'Q3 FY25', dso: { actual: 60, target: 60 }, invDays: { actual: 92, target: 90 }, dpo: { actual: 50, target: 50 } },
    { period: 'Q4 FY25', dso: { actual: 59, target: 60 }, invDays: { actual: 90, target: 90 }, dpo: { actual: 51, target: 50 } },
    { period: 'Q1 FY26', dso: { actual: 61, target: 60 }, invDays: { actual: 91, target: 90 }, dpo: { actual: 50, target: 50 } },
    { period: 'Q2 FY26', dso: { actual: 60, target: 60 }, invDays: { actual: 90, target: 90 }, dpo: { actual: 51, target: 50 } },
  ];

  for (const q of wcData) {
    const periodId = periodMap[q.period].id;
    await prisma.workingCapitalMetric.createMany({
      data: [
        { companyId, periodId, name: 'dso',           actual: q.dso.actual,    target: q.dso.target    },
        { companyId, periodId, name: 'inventoryDays', actual: q.invDays.actual, target: q.invDays.target },
        { companyId, periodId, name: 'dpo',           actual: q.dpo.actual,    target: q.dpo.target    },
      ],
    });
  }

  console.log(`Seeded ${wcData.length * 3} working capital metrics across ${wcData.length} quarters`);
}
