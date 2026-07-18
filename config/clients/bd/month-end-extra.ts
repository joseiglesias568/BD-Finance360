// v2
// SEED REFERENCE ONLY — runtime data derived from DB via lib/db/repositories/month-end.ts deriveMonthEndExtra()
//
// P&L and balance-sheet figures use BD Q2 FY2026 reported financials ($M).
// ─────────────────────────────────────────────────────────────────────
import { MonthEndExtraConfig } from '../../types';

export const monthEndExtra: MonthEndExtraConfig = {
  phaseDisplayMap: {
    'Pre-Close': { id: 'pre-close', days: '1-2', status: 'completed', progress: 100 },
    'Revenue Recognition': { id: 'revenue-recognition', days: '2-3', status: 'completed', progress: 100 },
    'Journal Processing': { id: 'journals', days: '3-4', status: 'in-progress', progress: 55 },
    'Review & Analysis': { id: 'review', days: '5-6', status: 'pending', progress: 0 },
    'Consolidation': { id: 'consolidation', days: '7-8', status: 'pending', progress: 0 },
    'Reporting': { id: 'reporting', days: '9-12', status: 'pending', progress: 0 },
  },

  recentEntries: [
    {
      id: 'JE-FY26Q2-001',
      description: 'Medical Essentials Segment Revenue — Q2 FY2026 MDS and Specimen Management Net Revenue (FX-adjusted)',
      type: 'Recurring',
      amount: 1548000000,
      status: 'Posted',
      preparer: 'Medical Essentials Revenue Accounting',
      approver: 'Medical Essentials Finance Director',
      postDate: '2026-07-03',
    },
    {
      id: 'JE-FY26Q2-002',
      description: 'Connected Care Segment Revenue — Q2 FY2026 MMS (Alaris + Pyxis) and APM (HemoSphere) Net Revenue',
      type: 'Recurring',
      amount: 1186000000,
      status: 'Posted',
      preparer: 'Connected Care Revenue Accounting',
      approver: 'Connected Care Finance Director',
      postDate: '2026-07-03',
    },
    {
      id: 'JE-FY26Q2-003',
      description: 'BioPharma Systems Segment Revenue — Q2 FY2026 Prefillable Syringe and Drug Delivery System Net Revenue',
      type: 'Recurring',
      amount: 573000000,
      status: 'Posted',
      preparer: 'BioPharma Systems Revenue Accounting',
      approver: 'BioPharma Systems Finance Director',
      postDate: '2026-07-03',
    },
    {
      id: 'JE-FY26Q2-004',
      description: 'Interventional Segment Revenue — Q2 FY2026 Surgery, Peripheral Intervention, and UCC Net Revenue',
      type: 'Recurring',
      amount: 1407000000,
      status: 'Posted',
      preparer: 'Interventional Revenue Accounting',
      approver: 'Interventional Finance Director',
      postDate: '2026-07-03',
    },
    {
      id: 'JE-FY26Q2-005',
      description: 'BD Alaris Remediation Accrual — Q2 FY2026 Estimated Remaining Customer Site Remediation Costs and Warranty Reserve Update',
      type: 'Accrual',
      amount: -45000000,
      status: 'In-Review',
      preparer: 'Connected Care Finance / Legal',
      approver: 'Chief Financial Officer',
      postDate: '2026-07-05',
    },
    {
      id: 'JE-FY26Q2-006',
      description: 'Intangible Asset Amortization — Q2 FY2026 Bard Acquisition ($24B, 2017) and CareFusion ($12B, 2015) Intangibles',
      type: 'Recurring',
      amount: -420000000,
      status: 'Posted',
      preparer: 'Corporate Accounting',
      approver: 'Corporate Controller',
      postDate: '2026-07-04',
    },
    {
      id: 'JE-FY26Q2-007',
      description: 'R&D Expense Accrual — Q2 FY2026 Contracted Research, Clinical Trials, and Regulatory Submissions (~5.8% of revenues)',
      type: 'Accrual',
      amount: -273000000,
      status: 'Posted',
      preparer: 'R&D Finance',
      approver: 'R&D Finance Director',
      postDate: '2026-07-04',
    },
    {
      id: 'JE-FY26Q2-008',
      description: 'FX Translation Adjustment — Q2 FY2026 CTA Update for International Subsidiaries (EUR, JPY, CNY, GBP)',
      type: 'Recurring',
      amount: 62000000,
      status: 'In-Review',
      preparer: 'International Finance',
      approver: 'Corporate Controller',
      postDate: '2026-07-06',
    },
  ],

  adjustmentItems: [
    {
      category: 'Organic Growth vs Reported Growth Bridge',
      description:
        'Q2 FY26 organic growth +2.6% FXN vs reported +5.2% USD. ' +
        'FX translation contributed +260bps. China VoBP (-14% FXN affected categories) is primary drag on organic rate. ' +
        'Interventional (+5.3% FXN) and Connected Care (+3.2% FXN) performing at or near targets.',
      amount: 120000000,
      type: 'informational',
    },
    {
      category: 'BD Alaris Remediation Cost Accrual',
      description:
        'Q2 FY26 accrual for estimated remaining BD Alaris customer site remediation costs. ' +
        '78% of sites complete; remaining 22% represents ~$45M estimated incremental cost. ' +
        'Full accrual expected to reverse as remediation completes in Q4 FY26.',
      amount: -45000000,
      type: 'unfavorable',
    },
    {
      category: 'BD Excellence Cost-Out Progress',
      description:
        '$150M annualized run-rate savings achieved Q2 FY26 — on path to $200M full target by Q4 FY26. ' +
        'Manufacturing productivity improvements (+50bps gross margin) and SG&A efficiency driving results. ' +
        'Incremental $50M savings expected in Q3–Q4 FY26.',
      amount: 37500000,
      type: 'favorable',
    },
    {
      category: 'BioPharma Systems Destocking Impact',
      description:
        'BioPharma Systems -1.8% FXN Q2 FY26 due to pharmaceutical customer inventory destocking. ' +
        'Revenue shortfall vs plan approximately $42M in Q2 FY26. ' +
        'Destocking expected to resolve in Q3 FY26, with GLP-1 orders beginning to ramp.',
      amount: -42000000,
      type: 'unfavorable',
    },
  ],

  balanceSheetHighlights: [
    { label: 'Free Cash Flow H1 FY26', value: '$1,095M', status: 'good', note: 'On track for $3.0B FY26 target' },
    { label: 'Net Leverage Ratio', value: '2.9x', status: 'warning', note: 'Target 2.5x by FY2027' },
    { label: 'Capital Expenditures (% Revenue)', value: '3.5%', status: 'good', note: 'On target; ~$637M annual run-rate' },
    { label: 'ASR Execution', value: 'In Progress', status: 'good', note: 'Shares being retired per schedule' },
    { label: 'Interest Expense (Annualized)', value: '~$613M', status: 'warning', note: 'FY25 baseline; improving with debt paydown' },
    { label: 'Adj. Operating Margin Q2 FY26', value: '24.2%', status: 'warning', note: 'Below 25% FY26 full-year target' },
  ],
};
