// v2
// SEED REFERENCE ONLY — runtime data derived from DB via lib/db/repositories/month-end.ts deriveMonthEndExtra()
//
// P&L and balance-sheet figures use Becton, Dickinson and Company Q1 2026 reported financials.
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
      description: 'Aetna Health Insurance Premiums — Q1 2026 Insured Plan Premium Recognition (MA, Medicaid, Commercial)',
      type: 'Recurring',
      amount: 36000000000,
      status: 'Posted',
      preparer: 'System',
      approver: 'HCB Revenue Accounting Manager',
      postDate: '2026-04-03',
    },
    {
      id: 'JE-2026-002',
      description: 'Medical Claims IBNR Reserve — Aetna Q1 2026 Incurred But Not Reported Actuarial Estimate (MBR 84.6%)',
      type: 'Accrual',
      amount: 30465600000,
      status: 'Posted',
      preparer: 'HCB Actuarial',
      approver: 'Chief Actuary',
      postDate: '2026-04-04',
    },
    {
      id: 'JE-2026-003',
      description: 'Caremark PBM Revenue — Q1 2026 Pharmacy Dispensing Fees and Admin Fees (464.7M Claims)',
      type: 'Recurring',
      amount: 48200000000,
      status: 'Posted',
      preparer: 'HSS Revenue Accounting',
      approver: 'HSS Revenue Manager',
      postDate: '2026-04-03',
    },
    {
      id: 'JE-2026-004',
      description: 'Pharmacy Rebate Accrual — Q1 2026 Manufacturer Rebates Earned Under Formulary Contracts (TrueCost Pass-Through)',
      type: 'Accrual',
      amount: -4200000000,
      status: 'Posted',
      preparer: 'HSS Rebate Accounting',
      approver: 'Rebate Accounting Manager',
      postDate: '2026-04-05',
    },
    {
      id: 'JE-2026-005',
      description: 'PCW Retail Pharmacy Revenue — Q1 2026 Dispensing Revenue and Front-Store Sales (451.2M Prescriptions)',
      type: 'Recurring',
      amount: 32000000000,
      status: 'Posted',
      preparer: 'PCW Revenue Accounting',
      approver: 'PCW Finance Manager',
      postDate: '2026-04-03',
    },
    {
      id: 'JE-2026-006',
      description: 'Goodwill and Intangible Amortization — Aetna Acquisition Intangibles + Oak Street Health (Q1 2026)',
      type: 'Recurring',
      amount: 1050000000,
      status: 'In-Review',
      preparer: 'Corporate Accounting',
      approver: 'Corporate Controller',
      postDate: '2026-04-06',
    },
    {
      id: 'JE-2026-007',
      description: 'Quarterly Dividend Payable — ~$850M declared for Q1 2026 payment',
      type: 'Non-Recurring',
      amount: -850000000,
      status: 'In-Review',
      preparer: 'Treasury',
      approver: 'CFO',
      postDate: '2026-04-07',
    },
    {
      id: 'JE-2026-008',
      description: 'Inter-Segment Elimination — HSS pharmacy services to HCB Aetna insured members (gross-to-net elimination)',
      type: 'Elimination',
      amount: -15500000000,
      status: 'Pending',
      preparer: 'Corporate Consolidation',
      approver: 'Corporate Controller',
      postDate: '2026-04-08',
    },
  ],

  adjustmentItems: [
    {
      category: 'HCB MBR Tracking',
      description: 'Q1 2026 MBR 84.6% vs 87.3% Q1 2025 — 270bps improvement. Full-year guidance maintained at 90.5% ±50bps. Prior year development contributed — prudent view maintained.',
      amount: 1050000000,
      type: 'favorable',
    },
    {
      category: 'HSS AOI Timing Pull-Forward',
      description: 'Q1 2026 HSS AOI included early recognition of value previously expected in Q2. Ex-timing, HSS modestly beat expectations. Full-year ≥$7.25B guidance reaffirmed.',
      amount: -200000000,
      type: 'timing',
    },
    {
      category: 'PCW Weather & Seasonal',
      description: 'Q1 2026 PCW impacted by milder seasonal illness and greater weather disruption vs Q1 2025. Underlying business performance exceeded expectations — provided flexibility for incremental investment.',
      amount: -110000000,
      type: 'unfavorable',
    },
    {
      category: 'Leverage Ratio Update',
      description: 'Q1 2026 leverage ratio 3.84x — improving trajectory toward BBB target. Share repurchase suspended; deleveraging via CFO ≥$9.5B FY2026.',
      amount: 0,
      type: 'informational',
    },
  ],

  balanceSheetHighlights: [
    { label: 'Cash (Parent + Unrestricted Subs)', value: '$2.2B', status: 'good', note: 'As of Q1 2026 end' },
    { label: 'Quarterly Dividend', value: '~$850M', status: 'good', note: 'Maintained; ~$850M/quarter' },
    { label: 'Leverage Ratio', value: '3.84x', status: 'warning', note: 'Improving; target BBB' },
    { label: 'Share Repurchase', value: 'Suspended', status: 'warning', note: 'Not in FY2026 guidance' },
    { label: 'Long-Term Debt (est.)', value: '~$60B', status: 'warning', note: 'Aetna acquisition legacy' },
    { label: 'CFO FY2026 Guidance', value: '≥$9.5B', status: 'good', note: 'Updated Q1 2026 call' },
  ],
};
