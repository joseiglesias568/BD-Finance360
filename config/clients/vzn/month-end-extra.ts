// SEED REFERENCE ONLY — runtime data derived from DB via lib/db/repositories/month-end.ts deriveMonthEndExtra()
//
// P&L and balance-sheet figures use Verizon Q1 2026 reported financials.
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
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
      description: 'Wireless Service Revenue Accrual — Postpaid + Prepaid + MVNO',
      type: 'Recurring',
      amount: 20780000000,                  // Q1 2026 wireless service revenue $20,780M
      status: 'Posted',
      preparer: 'System',
      approver: 'Wireless Revenue Accounting Manager',
      postDate: '2026-04-03',
    },
    {
      id: 'JE-2026-002',
      description: 'Network Depreciation — Spectrum Licenses, Towers, Fiber Plant',
      type: 'Recurring',
      amount: 4375000000,                   // Q1 2026 D&A run-rate ($17.5B annual / 4)
      status: 'Posted',
      preparer: 'System',
      approver: 'Asset Accounting Manager',
      postDate: '2026-04-03',
    },
    {
      id: 'JE-2026-003',
      description: 'Frontier Acquisition Integration Costs — Q1 2026 One-Time',
      type: 'Manual',
      amount: 285000000,                    // est. Q1 2026 integration costs [ASSUMED]
      status: 'Posted',
      preparer: 'Integration Finance',
      approver: 'Controller',
      postDate: '2026-04-04',
    },
    {
      id: 'JE-2026-004',
      description: 'Device Payment Plan EIP Interest Revenue — Q1 2026',
      type: 'Recurring',
      amount: 180000000,                    // est. interest component on EIP portfolio [ASSUMED]
      status: 'Pending Approval',
      preparer: 'Equipment Finance',
      approver: 'Revenue Accounting Manager',
      postDate: '2026-04-05',
    },
    {
      id: 'JE-2026-005',
      description: 'Pension and Other Post-Retirement Benefits — Q1 Actuarial Accrual',
      type: 'Manual',
      amount: -320000000,                   // est. OPEB accrual [ASSUMED]
      status: 'Draft',
      preparer: 'Benefits Finance',
      approver: 'Controller',
      postDate: '2026-04-05',
    },
  ],

  volumeTrend: [
    { month: 'Nov 2025', count: 420, amount: 33500000000 },
    { month: 'Dec 2025', count: 435, amount: 33500000000 },
    { month: 'Jan 2026', count: 448, amount: 11480000000 },    // Q1 2026 monthly run-rate (~1/3 of $34,440M)
    { month: 'Feb 2026', count: 455, amount: 11480000000 },
    { month: 'Mar 2026', count: 462, amount: 11480000000 },
  ],

  financialResults: {
    pl: {
      netRevenues:              { actual: 34440000000, prior: 33500000000, budget: 34200000000 },
      costOfGoodsSold:          { actual: 14200000000, prior: 14000000000, budget: 14100000000 },
      operatingExpenses:        { actual: 7900000000,  prior: 7800000000,  budget: 7850000000 },
      gaExpenses:               { actual: 0,           prior: 0,           budget: 0 },            // included in SG&A above
      depreciationAmortization: { actual: 4375000000,  prior: 4300000000,  budget: 4350000000 },
      operatingIncome:          { actual: 4960000000,  prior: 4800000000,  budget: 5000000000 },
      netIncome:                { actual: 4500000000,  prior: 4300000000,  budget: 4400000000 },
    },
    bs: {
      totalAssets:        { current: 380000000000, prior: 360000000000 },  // est. post-Frontier [ASSUMED]
      totalLiabilities:   { current: 335000000000, prior: 315000000000 },  // est. [ASSUMED]
      stockholdersDeficit:{ current: 45000000000,  prior: 45000000000 },   // est. [ASSUMED]
    },
  },

  adjustmentQueue: [
    {
      id: 'ADJ-001',
      description: 'Frontier Purchase Price Allocation — Q1 2026 Finalization (intangible assets, goodwill)',
      impact: { pl: -45000000, bs: 45000000 },
      status: 'pending',
      priority: 'high',
      deadline: '2026-04-10',
      preparer: 'Transaction Finance',
    },
    {
      id: 'ADJ-002',
      description: 'FWA Device Subsidy Contra-Revenue True-Up (Q1 promotion period)',
      impact: { pl: -22000000, bs: 22000000 },
      status: 'approved',
      priority: 'medium',
      deadline: '2026-04-08',
      preparer: 'Consumer Finance',
    },
    {
      id: 'ADJ-003',
      description: 'MVNO Settlement Timing — Charter/Comcast Q1 Wholesale Revenue Deferral',
      impact: { pl: 18000000, bs: -18000000 },
      status: 'pending',
      priority: 'medium',
      deadline: '2026-04-08',
      preparer: 'Wholesale Finance',
    },
    {
      id: 'ADJ-004',
      description: 'Chinese Equipment Removal Costs — FCC Reimbursement Receivable',
      impact: { pl: 12000000, bs: -12000000 },
      status: 'pending',
      priority: 'low',
      deadline: '2026-04-10',
      preparer: 'Regulatory Finance',
    },
  ],
};
