// SEED REFERENCE ONLY — runtime data derived from DB via lib/db/repositories/month-end.ts deriveMonthEndExtra()
//
// P&L and balance-sheet figures use Baker Hughes Q1 2026 reported financials.
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { MonthEndExtraConfig } from '../../types';

export const monthEndExtra: MonthEndExtraConfig = {
  phaseDisplayMap: {
    'Pre-Close': { id: 'pre-close', days: '1-2', status: 'completed', progress: 100 },
    'Revenue Recognition': { id: 'revenue-recognition', days: '2-3', status: 'completed', progress: 100 },
    'Journal Processing': { id: 'journals', days: '3-4', status: 'in-progress', progress: 60 },
    'Review & Analysis': { id: 'review', days: '5-6', status: 'pending', progress: 0 },
    'Consolidation': { id: 'consolidation', days: '7-8', status: 'pending', progress: 0 },
    'Reporting': { id: 'reporting', days: '9-12', status: 'pending', progress: 0 },
  },

  recentEntries: [
    {
      id: 'JE-2026-001',
      description: 'IET GTE Percentage-of-Completion Revenue — Q1 2026 LNG Equipment Deliveries',
      type: 'Recurring',
      amount: 1665000000,                  // Q1 2026 GTE revenue $1,665M [CITED:10Q-Q1-26]
      status: 'Posted',
      preparer: 'System',
      approver: 'IET Revenue Accounting Manager',
      postDate: '2026-04-03',
    },
    {
      id: 'JE-2026-002',
      description: 'GTS Long-Term Service Agreement (LTSA) Revenue Recognition — Q1 2026',
      type: 'Recurring',
      amount: 791000000,                   // Q1 2026 GTS revenue $791M [CITED:10Q-Q1-26]
      status: 'Posted',
      preparer: 'System',
      approver: 'GTS Revenue Accounting Manager',
      postDate: '2026-04-03',
    },
    {
      id: 'JE-2026-003',
      description: 'Gain on Disposition — PSI (Crane Company) and SPC (Cactus JV) Q1 2026',
      type: 'Manual',
      amount: 721000000,                   // Q1 2026 gain on dispositions $721M [CITED:10Q-Q1-26]
      status: 'Posted',
      preparer: 'Corporate Development Finance',
      approver: 'Controller',
      postDate: '2026-04-04',
    },
    {
      id: 'JE-2026-004',
      description: 'Chart Industries Acquisition Notes — Interest Accrual on $9.885B Debt (March 2026 Issuance)',
      type: 'Recurring',
      amount: 120000000,                   // est. one month interest on $9.885B notes [ASSUMED]
      status: 'Pending Approval',
      preparer: 'Treasury Finance',
      approver: 'Treasurer',
      postDate: '2026-04-05',
    },
    {
      id: 'JE-2026-005',
      description: 'OFSE + IET Restructuring Charges — Q1 2026 ($11M OFSE + $28M IET = $37M)',
      type: 'Manual',
      amount: 37000000,                    // Q1 2026 restructuring $37M [CITED:10Q-Q1-26]
      status: 'Draft',
      preparer: 'Restructuring Finance',
      approver: 'Controller',
      postDate: '2026-04-05',
    },
  ],

  volumeTrend: [
    { month: 'Nov 2025', count: 302, amount: 6900000000 },    // est. Q4 2025 monthly run-rate [ASSUMED]
    { month: 'Dec 2025', count: 318, amount: 7200000000 },    // est. higher Q4 seasonality [ASSUMED]
    { month: 'Jan 2026', count: 325, amount: 2196000000 },    // Q1 2026 monthly run-rate (~1/3 of $6,587M)
    { month: 'Feb 2026', count: 334, amount: 2196000000 },
    { month: 'Mar 2026', count: 348, amount: 2196000000 },    // [CITED:10Q-Q1-26] Q1 total / 3
  ],

  financialResults: {
    pl: {
      netRevenues:              { actual: 6587000000,  prior: 6427000000,  budget: 6500000000 },  // [CITED:10Q-Q1-26]
      costOfGoodsSold:          { actual: 5083000000,  prior: 4952000000,  budget: 5050000000 },  // [CITED:10Q-Q1-26]
      operatingExpenses:        { actual: 695000000,   prior: 723000000,   budget: 710000000 },   // SG&A $562M + R&D $133M [CITED:10Q-Q1-26]
      gaExpenses:               { actual: 0,           prior: 0,           budget: 0 },            // included in SG&A above
      depreciationAmortization: { actual: 354000000,   prior: 340000000,   budget: 350000000 },   // est. [ASSUMED]
      operatingIncome:          { actual: 583000000,   prior: 560000000,   budget: 525000000 },   // [DERIVED]
      netIncome:                { actual: 930000000,   prior: 402000000,   budget: 450000000 },   // [CITED:10Q-Q1-26] — elevated by $721M gain
    },
    bs: {
      totalAssets:        { current: 57380000000, prior: 55000000000 },   // est. [ASSUMED]
      totalLiabilities:   { current: 37890000000, prior: 36000000000 },   // est. [ASSUMED]
      stockholdersDeficit:{ current: 19490000000, prior: 19000000000 },   // BKR equity est. [ASSUMED]
    },
  },

  adjustmentQueue: [
    {
      id: 'ADJ-001',
      description: 'Chart Industries Purchase Price Allocation — Preliminary Intangibles & Goodwill (Post-Q2 Close)',
      impact: { pl: -85000000, bs: 85000000 },
      status: 'pending',
      priority: 'high',
      deadline: '2026-07-10',
      preparer: 'Transaction Finance',
    },
    {
      id: 'ADJ-002',
      description: 'OFSE Inventory Valuation — Finished Goods Mark-Down to Net Realizable Value ($2,361M balance)',
      impact: { pl: -28000000, bs: 28000000 },
      status: 'approved',
      priority: 'medium',
      deadline: '2026-04-08',
      preparer: 'OFSE Cost Accounting',
    },
    {
      id: 'ADJ-003',
      description: 'Mexico Customer CDS Mark-to-Market — Notional $159M (down from $287M Dec 2025)',
      impact: { pl: 12000000, bs: -12000000 },
      status: 'pending',
      priority: 'medium',
      deadline: '2026-04-08',
      preparer: 'Treasury Finance',
    },
    {
      id: 'ADJ-004',
      description: 'IET GTE Contract Loss Reserve — Q1 Review of Loss Contract Provisions on Active Projects',
      impact: { pl: -18000000, bs: 18000000 },
      status: 'pending',
      priority: 'low',
      deadline: '2026-04-10',
      preparer: 'IET Project Finance',
    },
  ],
};
