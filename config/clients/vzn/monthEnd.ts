// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/month-end.ts
//
// Close-process tasks are illustrative procedures aligned to Verizon's segment
// structure (Consumer + Business), revenue recognition model (wireless service,
// equipment, broadband, enterprise), and Frontier integration accounting.
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
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
    { id: 'mc-1', phase: 'Pre-Close', name: 'Wireless service revenue cutoff — postpaid + prepaid + MVNO', status: 'completed', owner: 'Wireless Revenue Accounting', dueDate: 'Day 1' },
    { id: 'mc-2', phase: 'Pre-Close', name: 'Intercompany cutoff — Consumer, Business, Frontier, Corporate', status: 'completed', owner: 'Corporate Accounting', dueDate: 'Day 1' },
    { id: 'mc-3', phase: 'Pre-Close', name: 'Device payment plan portfolio review — EIP balance and securitization', status: 'completed', owner: 'Treasury / Equipment Finance', dueDate: 'Day 1' },
    { id: 'mc-4', phase: 'Pre-Close', name: 'Frontier integration cost accruals — synergy-to-date tracking', status: 'completed', owner: 'Integration Finance', dueDate: 'Day 1' },

    // Revenue Recognition
    { id: 'mc-5', phase: 'Revenue Recognition', name: 'Wireless service revenue recognition — ARPU × subscriber count reconciliation', status: 'completed', owner: 'Wireless Revenue Accounting', dueDate: 'Day 2' },
    { id: 'mc-6', phase: 'Revenue Recognition', name: 'Equipment revenue recognition (ASC 606 — standalone selling price allocation)', status: 'completed', owner: 'Revenue Accounting', dueDate: 'Day 2' },
    { id: 'mc-7', phase: 'Revenue Recognition', name: 'FWA and Fios broadband service revenue cutoff', status: 'completed', owner: 'Broadband Revenue Accounting', dueDate: 'Day 2' },
    { id: 'mc-8', phase: 'Revenue Recognition', name: 'MVNO wholesale revenue (Spectrum Mobile, Xfinity Mobile, TracFone) cutoff', status: 'in-progress', owner: 'Wholesale Finance', dueDate: 'Day 3' },
    { id: 'mc-9', phase: 'Revenue Recognition', name: 'Business Solutions — enterprise contract milestone billings and managed services', status: 'in-progress', owner: 'Business Revenue Accounting', dueDate: 'Day 3' },

    // Journal Processing
    { id: 'mc-10', phase: 'Journal Processing', name: 'Salaries and related costs — ~21% of revenue; union contract vs non-union splits', status: 'in-progress', owner: 'Cost Accounting', dueDate: 'Day 3' },
    { id: 'mc-11', phase: 'Journal Processing', name: 'Network depreciation — spectrum licenses, towers, fiber, switches', status: 'in-progress', owner: 'Asset Accounting', dueDate: 'Day 3' },
    { id: 'mc-12', phase: 'Journal Processing', name: 'Cost of services — network operations, tower leases, fiber access', status: 'pending', owner: 'Network Finance', dueDate: 'Day 4' },
    { id: 'mc-13', phase: 'Journal Processing', name: 'Interest expense on ~$145B gross debt — accrual and amortization', status: 'pending', owner: 'Treasury', dueDate: 'Day 4' },
    { id: 'mc-14', phase: 'Journal Processing', name: 'Frontier integration one-time costs — separation from synergy savings', status: 'pending', owner: 'Integration Finance', dueDate: 'Day 4' },

    // Review & Analysis
    { id: 'mc-15', phase: 'Review & Analysis', name: 'Wireless service revenue variance — ARPA × subscribers vs plan', status: 'pending', owner: 'FP&A', dueDate: 'Day 5' },
    { id: 'mc-16', phase: 'Review & Analysis', name: 'Subscriber metrics reconciliation — net adds, churn, total connections by segment', status: 'pending', owner: 'Subscriber Analytics', dueDate: 'Day 5' },
    { id: 'mc-17', phase: 'Review & Analysis', name: 'FWA and Fios broadband net adds vs guidance pace review', status: 'pending', owner: 'Broadband FP&A', dueDate: 'Day 6' },
    { id: 'mc-18', phase: 'Review & Analysis', name: 'GAAP-vs-adjusted bridge — Frontier integration costs, restructuring, pension MTM', status: 'pending', owner: 'External Reporting', dueDate: 'Day 6' },

    // Consolidation
    { id: 'mc-19', phase: 'Consolidation', name: 'Consumer + Business + Corporate segment consolidation', status: 'pending', owner: 'Corporate Accounting', dueDate: 'Day 7' },
    { id: 'mc-20', phase: 'Consolidation', name: 'Frontier subsidiary consolidation — legal entity integration', status: 'pending', owner: 'Integration Finance', dueDate: 'Day 7' },
    { id: 'mc-21', phase: 'Consolidation', name: 'Intercompany elimination — MVNO wholesale, shared services, spectrum transfers', status: 'pending', owner: 'Corporate Accounting', dueDate: 'Day 8' },
    { id: 'mc-22', phase: 'Consolidation', name: 'Minority interest and equity investments (Verizon Wireless joint interests)', status: 'pending', owner: 'Treasury', dueDate: 'Day 8' },

    // Reporting
    { id: 'mc-23', phase: 'Reporting', name: 'CFO flash report — wireless service revenue, EBITDA, FCF vs guidance', status: 'pending', owner: 'FP&A', dueDate: 'Day 9' },
    { id: 'mc-24', phase: 'Reporting', name: 'Leverage ratio calculation and debt covenant compliance certification', status: 'pending', owner: 'Treasury', dueDate: 'Day 9' },
    { id: 'mc-25', phase: 'Reporting', name: 'Frontier synergy run-rate update for integration PMO and Board', status: 'pending', owner: 'Integration Finance', dueDate: 'Day 10' },
    { id: 'mc-26', phase: 'Reporting', name: 'Board materials — P&L, FCF, leverage trajectory, FWA progress', status: 'pending', owner: 'FP&A + IR', dueDate: 'Day 12' },
  ],

  journalEntries: {
    total: 462,                     // est. — typical for a Verizon-scale close
    totalAmount: 34440,             // Q1 2026 total operating revenue, $M
    automated: 348,                 // est. ~75% automation
    manual: 114,                    // est.
  },

  trialBalance: [
    { label: 'Total Operating Revenue', actual: 34440, priorMonth: 11480, budget: 34200 },
    { label: 'Cost of Services & Sales', actual: 14200, priorMonth: 4733, budget: 14100 },
    { label: 'Selling, General & Administrative', actual: 7900, priorMonth: 2633, budget: 7850 },
    { label: 'Depreciation and Amortization', actual: 4375, priorMonth: 1458, budget: 4350 },
    { label: 'Total Operating Expense', actual: 29475, priorMonth: 9825, budget: 29300 },
    { label: 'Operating Income', actual: 4965, priorMonth: 1655, budget: 4900 },
    { label: 'Interest Expense', actual: 1450, priorMonth: 483, budget: 1440 },
    { label: 'Net Income', actual: 4500, priorMonth: 1500, budget: 4400 },
    { label: 'Total Assets', actual: 380000, priorMonth: 380000, budget: 375000 },
    { label: 'Total Liabilities', actual: 335000, priorMonth: 335000, budget: 330000 },
    { label: 'Stockholders\' Equity', actual: 45000, priorMonth: 45000, budget: 45000 },
  ],
};
