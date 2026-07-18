// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/month-end.ts
//
// Close-process tasks are illustrative procedures aligned to Baker Hughes's
// segment structure (OFSE + IET), revenue recognition model (long-cycle
// equipment per ASC 606 POC, services, GTS LTSAs), and Chart acquisition
// integration accounting.
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
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
    { id: 'mc-1', phase: 'Pre-Close', name: 'IET GTE long-cycle equipment revenue percentage-of-completion cutoff review', status: 'completed', owner: 'IET Revenue Accounting', dueDate: 'Day 1' },
    { id: 'mc-2', phase: 'Pre-Close', name: 'Intercompany cutoff — IET and OFSE segment intercompany eliminations', status: 'completed', owner: 'Corporate Accounting', dueDate: 'Day 1' },
    { id: 'mc-3', phase: 'Pre-Close', name: 'Progress collections review — $5,999M advance payments balance reconciliation', status: 'completed', owner: 'Treasury / Revenue Accounting', dueDate: 'Day 1' },
    { id: 'mc-4', phase: 'Pre-Close', name: 'Chart Industries acquisition close accounting preparation (if Q2 2026 close)', status: 'completed', owner: 'Transaction Finance', dueDate: 'Day 1' },

    // Revenue Recognition
    { id: 'mc-5', phase: 'Revenue Recognition', name: 'IET GTE ASC 606 POC (percentage-of-completion) revenue recognition — LNG train deliveries', status: 'completed', owner: 'IET Revenue Accounting', dueDate: 'Day 2' },
    { id: 'mc-6', phase: 'Revenue Recognition', name: 'GTS long-term service agreements (LTSAs) — $326M contract assets recognition and amortization', status: 'completed', owner: 'GTS Revenue Accounting', dueDate: 'Day 2' },
    { id: 'mc-7', phase: 'Revenue Recognition', name: 'OFSE services revenue cutoff — Well Construction, CIM, Production Solutions, SSPS', status: 'completed', owner: 'OFSE Revenue Accounting', dueDate: 'Day 2' },
    { id: 'mc-8', phase: 'Revenue Recognition', name: 'IET CTS orders to revenue — aeroderivative turbine delivery milestone confirmations', status: 'in-progress', owner: 'CTS Finance', dueDate: 'Day 3' },
    { id: 'mc-9', phase: 'Revenue Recognition', name: 'PSI/SPC/Waygate divestiture gain/loss accounting and stub-period revenue cutoff', status: 'in-progress', owner: 'Corporate Development Finance', dueDate: 'Day 3' },

    // Journal Processing
    { id: 'mc-10', phase: 'Journal Processing', name: 'Payroll and employee benefits — ~53,000 employees; severance and restructuring charges', status: 'in-progress', owner: 'Cost Accounting', dueDate: 'Day 3' },
    { id: 'mc-11', phase: 'Journal Processing', name: 'PP&E depreciation — segment D&A (OFSE $278M + IET + Corp Q1 total $354M)', status: 'in-progress', owner: 'Asset Accounting', dueDate: 'Day 3' },
    { id: 'mc-12', phase: 'Journal Processing', name: 'GTE/GTS cost of goods sold — turbomachinery components, aero JV purchases ($210M Q1)', status: 'pending', owner: 'IET Cost Accounting', dueDate: 'Day 4' },
    { id: 'mc-13', phase: 'Journal Processing', name: 'Interest expense on debt — $16.2B total debt including $9.885B Chart acquisition notes', status: 'pending', owner: 'Treasury', dueDate: 'Day 4' },
    { id: 'mc-14', phase: 'Journal Processing', name: 'OFSE and IET restructuring charges ($37M Q1 2026: $11M OFSE + $28M IET) — separation from recurring', status: 'pending', owner: 'Restructuring Finance', dueDate: 'Day 4' },

    // Review & Analysis
    { id: 'mc-15', phase: 'Review & Analysis', name: 'IET revenue vs RPO release — is recognized revenue tracking in line with project delivery schedules?', status: 'pending', owner: 'IET FP&A', dueDate: 'Day 5' },
    { id: 'mc-16', phase: 'Review & Analysis', name: 'OFSE revenue variance vs plan — rig count, regional activity levels, vs budget assumption', status: 'pending', owner: 'OFSE FP&A', dueDate: 'Day 5' },
    { id: 'mc-17', phase: 'Review & Analysis', name: 'Working capital review — receivables $5,507M gross and inventory $4,868M vs targets', status: 'pending', owner: 'Treasury / FP&A', dueDate: 'Day 6' },
    { id: 'mc-18', phase: 'Review & Analysis', name: 'GAAP-vs-adjusted bridge — restructuring, acquisition costs, inventory charges, goodwill impairment', status: 'pending', owner: 'External Reporting', dueDate: 'Day 6' },

    // Consolidation
    { id: 'mc-19', phase: 'Consolidation', name: 'IET + OFSE segment consolidation — two-segment P&L and balance sheet', status: 'pending', owner: 'Corporate Accounting', dueDate: 'Day 7' },
    { id: 'mc-20', phase: 'Consolidation', name: 'Chart Industries consolidation (if closed) — purchase price allocation, goodwill, intangibles', status: 'pending', owner: 'Transaction Finance', dueDate: 'Day 7' },
    { id: 'mc-21', phase: 'Consolidation', name: 'Intercompany elimination — IET/OFSE shared services, aero JV equity income, Cactus JV', status: 'pending', owner: 'Corporate Accounting', dueDate: 'Day 8' },
    { id: 'mc-22', phase: 'Consolidation', name: 'Noncontrolling interests — Aero JV, Cactus JV, and other joint venture minority interests', status: 'pending', owner: 'Treasury', dueDate: 'Day 8' },

    // Reporting
    { id: 'mc-23', phase: 'Reporting', name: 'CFO flash report — IET/OFSE EBITDA, total orders, RPO, Adj. EPS vs guidance (for Ahmed Moghal)', status: 'pending', owner: 'FP&A', dueDate: 'Day 9' },
    { id: 'mc-24', phase: 'Reporting', name: 'Chart acquisition leverage ratio update — Net Debt/EBITDA post-close covenant compliance', status: 'pending', owner: 'Treasury', dueDate: 'Day 9' },
    { id: 'mc-25', phase: 'Reporting', name: 'Portfolio divestiture proceeds update — Waygate ($1.45B Hexagon) close status for Board', status: 'pending', owner: 'Corporate Development', dueDate: 'Day 10' },
    { id: 'mc-26', phase: 'Reporting', name: 'Board materials — P&L, FCF, leverage trajectory, IET RPO, IET orders vs Horizon 2 targets', status: 'pending', owner: 'FP&A + IR', dueDate: 'Day 12' },
  ],

  journalEntries: {
    total: 348,                      // est. — typical for a BKR-scale close (smaller than mega-cap telco)
    totalAmount: 6587,               // Q1 2026 total revenue $6,587M [CITED:10Q-Q1-26]
    automated: 261,                  // est. ~75% automation
    manual: 87,                      // est. — long-cycle revenue recognition requires manual judgment
  },

  trialBalance: [
    { label: 'Total Revenue', actual: 6587, priorMonth: 2196, budget: 6500 },           // [CITED:10Q-Q1-26]
    { label: 'Cost of Goods & Services Sold', actual: 5083, priorMonth: 1694, budget: 5050 }, // [CITED:10Q-Q1-26]
    { label: 'Selling, General & Administrative', actual: 562, priorMonth: 187, budget: 575 }, // SG&A [CITED:10Q-Q1-26]
    { label: 'Research & Development', actual: 133, priorMonth: 44, budget: 140 },       // R&D [CITED:10Q-Q1-26]
    { label: 'Depreciation and Amortization', actual: 354, priorMonth: 118, budget: 350 }, // est. from D&A disclosed
    { label: 'Total Operating Expense', actual: 6004, priorMonth: 2001, budget: 5975 },  // [DERIVED]
    { label: 'Operating Income', actual: 583, priorMonth: 194, budget: 525 },            // [DERIVED]
    { label: 'Gain on Dispositions', actual: 721, priorMonth: 0, budget: 0 },            // PSI + SPC Q1 2026 [CITED:10Q-Q1-26]
    { label: 'Net Income Attributable to BKR', actual: 930, priorMonth: 310, budget: 450 }, // [CITED:10Q-Q1-26]
    { label: 'Total Assets', actual: 57380, priorMonth: 57380, budget: 56000 },          // est. [ASSUMED]
    { label: 'Total Liabilities', actual: 37890, priorMonth: 37890, budget: 37000 },     // est. [ASSUMED]
    { label: 'Stockholders\' Equity', actual: 19490, priorMonth: 19490, budget: 19000 }, // [CITED:10Q-Q1-26]
  ],
};
