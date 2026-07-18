// SEED REFERENCE ONLY — runtime data derived from DB via lib/db/repositories/month-end.ts deriveMonthEndExtra()
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// P&L and balance-sheet figures use Delta Q1 2026 reported financials
// per the Form 10-Q (Statements of Operations and Balance Sheets, filed
// Apr 8, 2026). Period-over-period prior-quarter figures are illustrative.
//
// DISCLAIMER
// Adjustment queue entries, journal entry IDs, and preparer/approver
// assignments are estimated for demonstration. The phase-progress
// percentages reflect a typical mid-close state, not actual close status.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { MonthEndExtraConfig } from '../../types';

export const monthEndExtra: MonthEndExtraConfig = {
  phaseDisplayMap: {
    'Pre-Close': { id: 'pre-close', days: '1-2', status: 'completed', progress: 100 },
    'Revenue Recognition': { id: 'revenue-recognition', days: '2-3', status: 'completed', progress: 100 },
    'Journal Processing': { id: 'journals', days: '3-4', status: 'in-progress', progress: 65 },
    'Review & Analysis': { id: 'review', days: '5-6', status: 'pending', progress: 0 },
    'Consolidation': { id: 'consolidation', days: '7', status: 'pending', progress: 0 },
    'Reporting': { id: 'reporting', days: '8-10', status: 'pending', progress: 0 },
  },

  recentEntries: [
    {
      id: 'JE-2026-001',
      description: 'Salaries and Related Costs — Allocation',
      type: 'Recurring',
      amount: 4541000000,                  // Q1 2026 line, $M → $
      status: 'Posted',
      preparer: 'System',
      approver: 'Cost Accounting Manager',
      postDate: '2026-04-03',
    },
    {
      id: 'JE-2026-002',
      description: 'Profit-Sharing Accrual (10%/20% formula)',
      type: 'Manual',
      amount: 165000000,                   // Q1 2026 accrual
      status: 'Posted',
      preparer: 'Comp Accounting',
      approver: 'VP Finance',
      postDate: '2026-04-04',
    },
    {
      id: 'JE-2026-003',
      description: 'Air Traffic Liability Roll — Q1 2026 Net Build $3.584B',
      type: 'Recurring',
      amount: 3584000000,                  // Q1 2026 cash-flow change in ATL
      status: 'Posted',
      preparer: 'System',
      approver: 'Revenue Accounting Manager',
      postDate: '2026-04-03',
    },
    {
      id: 'JE-2026-004',
      description: 'Equity-Investment MTM — Q1 2026 Net Loss',
      type: 'Manual',
      amount: -550000000,                  // 10-Q gain/(loss) on investments line
      status: 'Pending Approval',
      preparer: 'Treasury',
      approver: 'Controller',
      postDate: '2026-04-05',
    },
    {
      id: 'JE-2026-005',
      description: 'Refinery Hedge Settlement — Inventory-Timing Deferral',
      type: 'Manual',
      amount: -151000000,                  // MTM and hedge-settlement reconciliation item
      status: 'Draft',
      preparer: 'Monroe Finance',
      approver: 'Controller',
      postDate: '2026-04-05',
    },
  ],

  // Volume trend illustrative — values trend up modestly through the
  // quarter as revenue and operations volume scaled.
  volumeTrend: [
    { month: 'Nov 2025', count: 445, amount: 14200000000 },
    { month: 'Dec 2025', count: 458, amount: 16003000000 },   // FY 2025 Q4 revenue
    { month: 'Jan 2026', count: 465, amount: 5285000000 },    // Q1 2026 monthly run-rate (~1/3 of $15.854B)
    { month: 'Feb 2026', count: 475, amount: 5285000000 },
    { month: 'Mar 2026', count: 482, amount: 5285000000 },
  ],

  // P&L results — Q1 2026 GAAP figures, $-denominated.
  // Prior column = Q4 2025 (per JPM deck reconciliation, $16,003M revenue;
  //   other lines estimated as quarterly run-rates from FY 2025 totals).
  // Budget = pre-fuel-spike Q1 guidance from Jan 2026.
  financialResults: {
    pl: {
      netRevenues:              { actual: 15854000000, prior: 16003000000, budget: 15200000000 },
      costOfGoodsSold:          { actual: 11118000000, prior: 11200000000, budget: 10750000000 },  // est. variable+semi-variable bucket
      operatingExpenses:        { actual: 3600000000,  prior: 3500000000,  budget: 3450000000 },   // est.
      gaExpenses:               { actual: 0,           prior: 0,           budget: 0 },            // Delta does not separately disclose G&A line
      depreciationAmortization: { actual: 635000000,   prior: 600000000,   budget: 625000000 },    // 10-Q
      operatingIncome:          { actual: 501000000,   prior: 1500000000,  budget: 600000000 },    // Q1 2026 GAAP; Q4 2025 est.
      netIncome:                { actual: -289000000,  prior: 1100000000,  budget: 250000000 },    // Q1 2026 GAAP loss on MTM; Q4 2025 est.
    },
    bs: {
      totalAssets:        { current: 84431000000, prior: 81317000000 },        // 10-Q balance sheet
      totalLiabilities:   { current: 64055000000, prior: 60464000000 },        // = total - equity
      stockholdersDeficit:{ current: 20376000000, prior: 20853000000 },        // 10-Q
    },
  },

  adjustmentQueue: [
    {
      id: 'ADJ-001',
      description: 'Aeromexico JV Wind-Down Provision (DOT antitrust termination — under Court stay)',
      impact: { pl: -15000000, bs: 15000000 },
      status: 'pending',
      priority: 'high',
      deadline: '2026-04-07',
      preparer: 'External Reporting',
    },
    {
      id: 'ADJ-002',
      description: 'WestJet Equity Stake — Q1 2026 Fair-Value Mark (post-Oct 2025 acquisition)',
      impact: { pl: -22000000, bs: 22000000 },
      status: 'approved',
      priority: 'medium',
      deadline: '2026-04-08',
      preparer: 'Treasury',
    },
    {
      id: 'ADJ-003',
      description: 'Q2 2026 Fuel-Recapture Estimate (revenue accrual — 40-50% target)',
      impact: { pl: 25000000, bs: -25000000 },
      status: 'pending',
      priority: 'high',
      deadline: '2026-04-07',
      preparer: 'Revenue Accounting',
    },
    {
      id: 'ADJ-004',
      description: 'Capacity-Reduction Crew Recovery Cost True-Up',
      impact: { pl: -8000000, bs: 8000000 },
      status: 'pending',
      priority: 'medium',
      deadline: '2026-04-08',
      preparer: 'Operations Finance',
    },
  ],
};
