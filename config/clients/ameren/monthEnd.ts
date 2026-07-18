// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/month-end.ts
//
// Close-process tasks aligned to Becton, Dickinson and Company's accounting model:
// medical claims incurred-but-not-reported (IBNR) reserve estimation,
// pharmacy rebate accruals, PBM client price adjustments, inter-segment
// eliminations, and segment P&L consolidation.
// ─────────────────────────────────────────────────────────────────────
import { MonthEndConfig } from '../../types';

export const monthEnd: MonthEndConfig = {
  phases: [
    'Pre-Close',
    'Revenue Recognition',
    'Journal Processing',
    'Review & Analysis',
    'Consolidation',
    'Reporting',
  ],

  tasks: [
    // Pre-Close
    { id: 'mc-1', phase: 'Pre-Close', name: 'HCB premium revenue cutoff — Aetna insured and ASO premiums; verify enrollment data feeds from all plan types (MA, Medicaid, commercial)', status: 'completed', owner: 'HCB Revenue Accounting', dueDate: 'Day 1' },
    { id: 'mc-2', phase: 'Pre-Close', name: 'Pharmacy claims data cutoff — Caremark PBM claims processing; adjudication cycle complete; 90-day prescription conversion to 30-day equivalent', status: 'completed', owner: 'HSS Claims Accounting', dueDate: 'Day 1' },
    { id: 'mc-3', phase: 'Pre-Close', name: 'Retail pharmacy inventory cutoff — PCW store-level inventory count and pharmacy dispensing cost cutoff across ~9,000 locations', status: 'completed', owner: 'PCW Store Accounting', dueDate: 'Day 1' },
    { id: 'mc-4', phase: 'Pre-Close', name: 'Medical claims IBNR reserve estimate — Aetna claims triangle actuarial update; prior year development calculation vs reserved amounts', status: 'in-progress', owner: 'HCB Actuarial', dueDate: 'Day 2' },

    // Revenue Recognition
    { id: 'mc-5', phase: 'Revenue Recognition', name: 'Aetna health insurance premiums — insured plan premium recognition; ASO fee revenue recognition; reinsurance ceded adjustment', status: 'completed', owner: 'HCB Revenue Accounting', dueDate: 'Day 2' },
    { id: 'mc-6', phase: 'Revenue Recognition', name: 'Caremark PBM revenues — pharmacy dispensing fees, admin fees, specialty pharmacy revenues; inter-segment elimination with Aetna insured business', status: 'in-progress', owner: 'HSS Revenue Accounting', dueDate: 'Day 2' },
    { id: 'mc-7', phase: 'Revenue Recognition', name: 'Pharmacy rebate revenue accrual — manufacturer rebates earned under formulary contracts; TrueCost pass-through vs retained rebate split', status: 'in-progress', owner: 'HSS Rebate Accounting', dueDate: 'Day 3' },
    { id: 'mc-8', phase: 'Revenue Recognition', name: 'Oak Street Health revenues — visit-based and value-based care revenue recognition; V28 risk adjustment accrual', status: 'in-progress', owner: 'Health Care Delivery Accounting', dueDate: 'Day 3' },
    { id: 'mc-9', phase: 'Revenue Recognition', name: 'PCW retail and front-store revenue — pharmacy dispensing revenue, front-store product sales, MinuteClinic visit fees', status: 'completed', owner: 'PCW Revenue Accounting', dueDate: 'Day 2' },

    // Journal Processing
    { id: 'mc-10', phase: 'Journal Processing', name: 'Medical benefits expense — Aetna claims paid and IBNR reserve accrual (MBR calculation basis)', status: 'in-progress', owner: 'HCB Medical Cost Accounting', dueDate: 'Day 3' },
    { id: 'mc-11', phase: 'Journal Processing', name: 'Pharmacy cost of products sold — Caremark drug purchase cost; specialty drug acquisition cost; purchasing economics adjustments', status: 'in-progress', owner: 'HSS COGS Accounting', dueDate: 'Day 3' },
    { id: 'mc-12', phase: 'Journal Processing', name: 'Goodwill and intangible asset amortization — Aetna acquisition ($69B 2018) intangibles; Oak Street Health intangibles; other acquisition amortization', status: 'pending', owner: 'Corporate Accounting', dueDate: 'Day 4' },
    { id: 'mc-13', phase: 'Journal Processing', name: 'Interest expense on long-term debt — segment allocation; new debt issuances; credit facility fees', status: 'pending', owner: 'Treasury', dueDate: 'Day 4' },
    { id: 'mc-14', phase: 'Journal Processing', name: 'Dividend payable accrual — ~$850M quarterly dividend; ex-dividend date and record date verification', status: 'pending', owner: 'Treasury', dueDate: 'Day 4' },

    // Review & Analysis
    { id: 'mc-15', phase: 'Review & Analysis', name: 'MBR analysis vs 90.5% FY2026 guidance — prior year development quantification; underlying trend vs reserve timing', status: 'pending', owner: 'HCB FP&A', dueDate: 'Day 5' },
    { id: 'mc-16', phase: 'Review & Analysis', name: 'HSS AOI bridge vs guidance — pharmacy client price improvement tracking vs 2026 rebate guarantee commitments', status: 'pending', owner: 'HSS FP&A', dueDate: 'Day 5' },
    { id: 'mc-17', phase: 'Review & Analysis', name: 'PCW same-store Rx growth and script share analysis vs +7% target; reimbursement rate tracking', status: 'pending', owner: 'PCW FP&A', dueDate: 'Day 6' },
    { id: 'mc-18', phase: 'Review & Analysis', name: 'Leverage ratio update — net debt recalculation; EBITDA trailing twelve months; BBB target tracking', status: 'pending', owner: 'Treasury / FP&A', dueDate: 'Day 6' },

    // Consolidation
    { id: 'mc-19', phase: 'Consolidation', name: 'Three-segment P&L consolidation — HCB + HSS + PCW + Corporate/Other; inter-segment pharmacy eliminations', status: 'pending', owner: 'Corporate Accounting', dueDate: 'Day 7' },
    { id: 'mc-20', phase: 'Consolidation', name: 'Inter-segment elimination — Caremark services to Aetna insured members (HSS-to-HCB elimination); pharmacy services to PCW', status: 'pending', owner: 'Corporate Consolidation', dueDate: 'Day 7' },
    { id: 'mc-21', phase: 'Consolidation', name: 'GAAP to non-GAAP reconciliation — amortization of intangibles, acquisition costs, restructuring charges, non-GAAP tax rate adjustments', status: 'pending', owner: 'External Reporting', dueDate: 'Day 8' },

    // Reporting
    { id: 'mc-22', phase: 'Reporting', name: 'Quarterly earnings press release preparation — consolidated P&L, segment results, EPS, guidance reaffirmation', status: 'pending', owner: 'IR / External Reporting', dueDate: 'Day 10' },
    { id: 'mc-23', phase: 'Reporting', name: 'Form 10-Q / 10-K filing preparation — MD&A, segment financials, risk factors, reserve disclosures', status: 'pending', owner: 'SEC Reporting', dueDate: 'Day 12' },
    { id: 'mc-24', phase: 'Reporting', name: 'Earnings call presentation materials — IR slide deck; CFO and CEO talking points; segment deep-dive slides', status: 'pending', owner: 'IR', dueDate: 'Day 11' },
  ],

  financialResults: {
    revenue: { label: 'Total Revenues', actual: 100400, plan: 99500, priorYear: 94600, variance: 900, variancePercent: 0.9 },
    cogs: { label: 'Medical Costs + Pharmacy COGS', actual: 87300, plan: 86700, priorYear: 83100, variance: 600, variancePercent: 0.7 },
    grossProfit: { label: 'Gross Profit', actual: 13100, plan: 12800, priorYear: 11500, variance: 300, variancePercent: 2.3 },
    operatingExpenses: { label: 'SG&A + D&A + Other', actual: 7950, plan: 8100, priorYear: 6920, variance: -150, variancePercent: -1.9 },
    operatingIncome: { label: 'Adjusted Operating Income', actual: 5150, plan: 4700, priorYear: 4580, variance: 570, variancePercent: 12.1 },
    netIncome: { label: 'Adjusted Net Income', actual: 2570, plan: 2250, priorYear: 2250, variance: 320, variancePercent: 14.2 },
  },
};
