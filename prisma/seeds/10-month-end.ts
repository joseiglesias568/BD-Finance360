import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed Month-End Close Tasks, Journal Entry Stats, Trial Balance Items
//
// SOURCE: Becton, Dickinson and Company (BDX) — Q2 FY26 earnings (May 2026),
// Q2 FY26 10-Q (Mar 31, 2026), FY2025 10-K. FY ends September 30.
//
// Close tasks reflect BD's medical technology accounting model:
//   Four-segment P&L (Medical Essentials, Connected Care, BioPharma Systems,
//   Interventional); product revenue recognition per ASC 606 on device shipment;
//   Alaris remediation accrual ~$42M Q2 FY26 (consent decree costs);
//   FX remeasurement ~$116M Q2 FY26 headwind;
//   Goodwill impairment $450M Q2 FY26 (non-cash, Connected Care unit);
//   D&A ~$615M/quarter (FY25 total ~$2,462M);
//   Interest expense ~$155M/quarter (~$620M annualized);
//   Waters spin-off completed Feb 2026 — discontinued operations cleared.
// Trial balance values reflect Q2 FY26 GAAP from the 10-Q.
// =============================================================================

export async function seedMonthEnd(prisma: PrismaClient, companyId: number) {
  // Delete existing records before creating new ones
  await prisma.trialBalanceItem.deleteMany({ where: { companyId } });
  await prisma.journalEntryStats.deleteMany({ where: { companyId } });
  await prisma.closeTask.deleteMany({ where: { companyId } });

  // Close Tasks (10 BD MedTech-specific tasks across 6 phases)
  await prisma.closeTask.createMany({
    data: [
      // Phase 1: Pre-Close (2 tasks)
      {
        companyId,
        externalId: 'mc-1',
        phase: 'Pre-Close',
        name: 'Product revenue cutoff — BD Medical Essentials, Connected Care, BioPharma Systems, and Interventional shipment/delivery cutoff for quarter-end; FOB shipping point vs FOB destination contract review for 6,000+ SKUs',
        status: 'completed',
        owner: 'Revenue Accounting / Segment Controllers',
        dueDate: 'Day 1',
      },
      {
        companyId,
        externalId: 'mc-2',
        phase: 'Pre-Close',
        name: 'Consignment and field inventory cutoff — BD Connected Care (Alaris, Pyxis) field consignment inventory physical verification; BioPharma Systems customer-consigned PFS inventory balance reconciliation',
        status: 'completed',
        owner: 'Supply Chain Accounting / Segment Controllers',
        dueDate: 'Day 1',
      },

      // Phase 2: Revenue Recognition (2 tasks)
      {
        companyId,
        externalId: 'mc-3',
        phase: 'Revenue Recognition',
        name: 'BD four-segment product revenue recognition — Medical Essentials $1,620M Q2 FY26; Connected Care $520M (Alaris 18K units, Pyxis MedStation 460 placements); BioPharma Systems $1,168M (GLP-1 PFS +19% YoY); Interventional $1,406M; ASC 606 variable consideration (volume rebates, chargebacks) accrual',
        status: 'completed',
        owner: 'Revenue Accounting',
        dueDate: 'Day 2',
      },
      {
        companyId,
        externalId: 'mc-4',
        phase: 'Revenue Recognition',
        name: 'Connected Care software and services revenue — Pyxis MedStation software subscription recognition; Alaris DERS (Drug Error Reduction Software) license amortization; SaaS and managed services monthly ratable recognition; multi-element arrangement allocation for hardware + software bundles',
        status: 'completed',
        owner: 'Connected Care Revenue Accounting',
        dueDate: 'Day 2',
      },

      // Phase 3: Journal Processing (2 tasks)
      {
        companyId,
        externalId: 'mc-5',
        phase: 'Journal Processing',
        name: 'Alaris consent decree remediation accrual — Q2 FY26 accrual ~$42M for ongoing FDA consent decree costs (remediation activities, third-party consultants, quality system upgrades, legal monitoring costs); cumulative FY26 tracking vs $300M FY plan',
        status: 'in-progress',
        owner: 'Legal / Regulatory Accounting',
        dueDate: 'Day 3',
      },
      {
        companyId,
        externalId: 'mc-6',
        phase: 'Journal Processing',
        name: 'D&A and goodwill impairment — quarterly D&A ~$615M (FY25: $2,462M); Q2 FY26 goodwill impairment $450M (Connected Care reporting unit, driven by Alaris market recovery elongation); intangible amortization schedule (acquisition-related intangibles: customer relationships, technology, brand)',
        status: 'in-progress',
        owner: 'Corporate Accounting / Valuation',
        dueDate: 'Day 4',
      },

      // Phase 4: Review & Analysis (1 task)
      {
        companyId,
        externalId: 'mc-7',
        phase: 'Review & Analysis',
        name: 'FX remeasurement and segment margin variance analysis — Q2 FY26 FX translation headwind ~$116M ($58M Q2, $116M H1 cumulative vs $230M FY plan); segment constant currency vs reported growth bridge; China VoBP headwind tracking $80M H1 vs $160M FY plan; BioPharma Systems capacity utilization 88% vs 84% plan; Connected Care margin 18.2% vs 18.0% plan',
        status: 'pending',
        owner: 'FP&A / Treasury',
        dueDate: 'Day 5',
      },

      // Phase 5: Consolidation (1 task)
      {
        companyId,
        externalId: 'mc-8',
        phase: 'Consolidation',
        name: 'Four-segment P&L consolidation and intercompany elimination — Medical Essentials + Connected Care + BioPharma Systems + Interventional to $4,714M enterprise revenue Q2 FY26; intercompany transfer pricing eliminations between BD Manufacturing (BD Industrial) and commercial segments; interest expense ~$155M quarterly allocation; income tax provision (adjusted effective rate ~15.5%)',
        status: 'pending',
        owner: 'Corporate Accounting / Controller',
        dueDate: 'Day 6',
      },

      // Phase 6: Reporting (2 tasks)
      {
        companyId,
        externalId: 'mc-9',
        phase: 'Reporting',
        name: 'CFO flash report — four-segment revenue and adj. operating income; enterprise adj. EPS run-rate vs $12.52–$12.72 guidance; FX headwind tracking; China VoBP; Alaris shipments; leverage ratio 2.9x; FCF conversion 96% (for Christopher J. DelOrefice)',
        status: 'pending',
        owner: 'FP&A',
        dueDate: 'Day 8',
      },
      {
        companyId,
        externalId: 'mc-10',
        phase: 'Reporting',
        name: 'Board materials and earnings release — Q2 FY26 adj. EPS $3.50; revenue $4,714M (+4.7% reported / +7.2% CC); segment operating income bridge; goodwill impairment disclosure $450M; Alaris remediation cost update; FY2026 guidance reaffirmation ($12.52–$12.72 adj. EPS); leverage path to 2.5x by FY2028',
        status: 'pending',
        owner: 'FP&A + IR',
        dueDate: 'Day 10',
      },
    ],
  });

  console.log('Seeded 10 BD close tasks across 6 phases');

  // Journal Entry Stats
  // BD scale: ~$4,714M quarterly revenue, 4 business segments plus Corporate.
  // MedTech close includes: product revenue recognition, ASC 606 variable
  // consideration (rebates, chargebacks), Alaris consent decree accruals, FX
  // remeasurement, goodwill impairment testing, D&A schedules, intercompany
  // transfer pricing. Automated: shipment revenue recognition, standard costing,
  // rebate accruals. Manual: Alaris remediation, goodwill impairment, FX, warranty.

  await prisma.journalEntryStats.create({
    data: {
      companyId,
      total:       420,
      totalAmount: 4714,
      automated:   310,
      manual:      110,
    },
  });

  console.log('Seeded journal entry stats');

  // Trial Balance Items (Q2 FY26 GAAP, $M)
  // Source: BD Q2 FY26 earnings release and 10-Q (Mar 31, 2026)
  // Revenue: $4,714M (+4.7% reported / +7.2% CC)
  // Adj. Op. Income: ~$1,178M (25.0% adj. op. margin)
  // GAAP Op. Income lower by ~$450M goodwill impairment + ~$42M Alaris accrual + ~$85M restructuring
  // Net Debt: ~$17.5B; Net Leverage: 2.9x adj. EBITDA
  // Diluted shares: ~285M; Adj. EPS Q2 FY26: $3.50

  await prisma.trialBalanceItem.createMany({
    data: [
      {
        companyId,
        label: 'Total Revenues',
        actual:     4714,
        priorMonth: 4486,
        budget:     4680,
      },
      {
        companyId,
        label: 'Cost of Products Sold',
        actual:     2380,
        priorMonth: 2262,
        budget:     2360,
      },
      {
        companyId,
        label: 'Gross Profit',
        actual:     2334,
        priorMonth: 2224,
        budget:     2320,
      },
      {
        companyId,
        label: 'Selling, General & Administrative',
        actual:      720,
        priorMonth:  695,
        budget:      715,
      },
      {
        companyId,
        label: 'Research & Development',
        actual:      248,
        priorMonth:  241,
        budget:      250,
      },
      {
        companyId,
        label: 'Alaris Remediation Costs',
        actual:       42,
        priorMonth:   38,
        budget:       40,
      },
      {
        companyId,
        label: 'Goodwill Impairment (Non-Cash)',
        actual:      450,
        priorMonth:    0,
        budget:        0,
      },
      {
        companyId,
        label: 'Amortization of Intangibles',
        actual:      188,
        priorMonth:  185,
        budget:      188,
      },
      {
        companyId,
        label: 'Restructuring & Other',
        actual:       85,
        priorMonth:   48,
        budget:       45,
      },
      {
        companyId,
        label: 'Total Operating Expenses',
        actual:     4113,
        priorMonth: 3469,
        budget:     3598,
      },
      {
        companyId,
        label: 'Operating Income (GAAP)',
        actual:      601,
        priorMonth: 1017,
        budget:     1082,
      },
      {
        companyId,
        label: 'Adjusted Operating Income',
        actual:     1178,
        priorMonth: 1118,
        budget:     1170,
      },
      {
        companyId,
        label: 'Interest Expense (Net)',
        actual:      155,
        priorMonth:  157,
        budget:      155,
      },
      {
        companyId,
        label: 'Net Income Attributable to BD',
        actual:      365,
        priorMonth:  782,
        budget:      862,
      },
      {
        companyId,
        label: 'Adjusted Net Income',
        actual:      998,
        priorMonth:  955,
        budget:      992,
      },
      {
        companyId,
        label: 'Adjusted EPS (Diluted)',
        actual:     3.50,
        priorMonth: 3.35,
        budget:     3.48,
      },
      {
        companyId,
        label: 'Total Assets',
        actual:    39800,
        priorMonth: 40200,
        budget:    40000,
      },
      {
        companyId,
        label: 'Total Liabilities',
        actual:    27600,
        priorMonth: 27900,
        budget:    27800,
      },
      {
        companyId,
        label: "Stockholders' Equity",
        actual:    12200,
        priorMonth: 12300,
        budget:    12200,
      },
      {
        companyId,
        label: 'Long-Term Debt',
        actual:    18800,
        priorMonth: 19200,
        budget:    19000,
      },
      {
        companyId,
        label: 'Net Debt',
        actual:    17500,
        priorMonth: 17900,
        budget:    17700,
      },
    ],
  });

  console.log('Seeded 21 BD trial balance items');
}
