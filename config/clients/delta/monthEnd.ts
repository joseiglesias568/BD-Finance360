// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/month-end.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Trial balance reflects Delta Q1 2026 reported financials per the
// Q1 2026 10-Q (Statements of Operations) and reconciliation tables in
// the JPM Industrials deck. Close-process tasks are illustrative
// month-end procedures aligned to Delta's segment structure (Airline +
// Refinery), revenue recognition model (passenger, cargo, MRO, loyalty,
// refinery), and consolidation footprint.
//
// DISCLAIMER
// Specific task assignments, owner names, and day-by-day timing are
// estimated for demonstration. Real close calendar would come from the
// Controller's organization. UI parameters (phase ordering, status
// values) are operational settings, not Delta disclosures.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
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
    { id: 'mc-1', phase: 'Pre-Close', name: 'Passenger ticket revenue cutoff (Air Traffic Liability roll)', status: 'completed', owner: 'Revenue Accounting', dueDate: 'Day 1' },
    { id: 'mc-2', phase: 'Pre-Close', name: 'Intercompany cutoff — Monroe Energy / Delta TechOps / Endeavor', status: 'completed', owner: 'Corporate Accounting', dueDate: 'Day 1' },
    { id: 'mc-3', phase: 'Pre-Close', name: 'Profit-sharing accrual review (10%/20% formula)', status: 'completed', owner: 'Compensation Accounting', dueDate: 'Day 1' },
    { id: 'mc-4', phase: 'Pre-Close', name: 'Fuel hedge MTM cutoff and inventory hedge timing', status: 'completed', owner: 'Treasury / Fuel Hedging', dueDate: 'Day 1' },

    // Revenue Recognition
    { id: 'mc-5', phase: 'Revenue Recognition', name: 'Passenger revenue recognition (flight-flown basis)', status: 'completed', owner: 'Revenue Accounting', dueDate: 'Day 2' },
    { id: 'mc-6', phase: 'Revenue Recognition', name: 'Cargo revenue recognition (shipment-completed basis)', status: 'completed', owner: 'Revenue Accounting', dueDate: 'Day 2' },
    { id: 'mc-7', phase: 'Revenue Recognition', name: 'SkyMiles award redemption revenue and brand-usage allocation', status: 'completed', owner: 'Loyalty Accounting', dueDate: 'Day 2' },
    { id: 'mc-8', phase: 'Revenue Recognition', name: 'Delta TechOps MRO revenue (work-scope completion)', status: 'in-progress', owner: 'TechOps Finance', dueDate: 'Day 3' },
    { id: 'mc-9', phase: 'Revenue Recognition', name: 'Monroe refinery third-party sales and intersegment transfers', status: 'in-progress', owner: 'Monroe Finance', dueDate: 'Day 3' },

    // Journal Processing
    { id: 'mc-10', phase: 'Journal Processing', name: 'Salaries and related costs allocation (~30% of opex)', status: 'in-progress', owner: 'Cost Accounting', dueDate: 'Day 3' },
    { id: 'mc-11', phase: 'Journal Processing', name: 'Aircraft fuel expense + refinery offset entries', status: 'in-progress', owner: 'Fuel Accounting', dueDate: 'Day 3' },
    { id: 'mc-12', phase: 'Journal Processing', name: 'Regional carrier expense (Endeavor, SkyWest, Republic CPAs)', status: 'pending', owner: 'Capacity Purchase Accounting', dueDate: 'Day 4' },
    { id: 'mc-13', phase: 'Journal Processing', name: 'Aircraft depreciation, finance lease amortization, sale-leaseback', status: 'pending', owner: 'Fleet Accounting', dueDate: 'Day 4' },
    { id: 'mc-14', phase: 'Journal Processing', name: 'Equity-investment MTM entries (Virgin Atlantic, AeroMexico, LATAM, Hanjin-KAL, China Eastern, WestJet)', status: 'pending', owner: 'Treasury', dueDate: 'Day 4' },

    // Review & Analysis
    { id: 'mc-15', phase: 'Review & Analysis', name: 'Geographic P&L variance — Domestic / Atlantic / LatAm / Pacific', status: 'pending', owner: 'FP&A', dueDate: 'Day 5' },
    { id: 'mc-16', phase: 'Review & Analysis', name: 'Unit-economics review — TRASM, PRASM, CASM-Ex, load factor, yield', status: 'pending', owner: 'FP&A', dueDate: 'Day 5' },
    { id: 'mc-17', phase: 'Review & Analysis', name: 'Air Traffic Liability waterfall and forward-bookings outlook', status: 'pending', owner: 'Revenue Accounting', dueDate: 'Day 6' },
    { id: 'mc-18', phase: 'Review & Analysis', name: 'GAAP-vs-adjusted bridge (third-party refinery, MTM, hedge settlements)', status: 'pending', owner: 'External Reporting', dueDate: 'Day 6' },

    // Consolidation
    { id: 'mc-19', phase: 'Consolidation', name: 'Airline / Refinery segment elimination', status: 'pending', owner: 'Consolidation', dueDate: 'Day 7' },
    { id: 'mc-20', phase: 'Consolidation', name: 'Foreign-equity-investment translation (multiple non-USD partners)', status: 'pending', owner: 'Treasury', dueDate: 'Day 7' },
    { id: 'mc-21', phase: 'Consolidation', name: 'Endeavor Air subsidiary consolidation', status: 'pending', owner: 'Consolidation', dueDate: 'Day 7' },

    // Reporting
    { id: 'mc-22', phase: 'Reporting', name: 'Management reporting package — segments, KPIs, capacity discipline', status: 'pending', owner: 'FP&A', dueDate: 'Day 8' },
    { id: 'mc-23', phase: 'Reporting', name: 'Earnings release / press release content prep', status: 'pending', owner: 'IR / Controller', dueDate: 'Day 9' },
    { id: 'mc-24', phase: 'Reporting', name: 'Form 10-Q drafting and EY review coordination', status: 'pending', owner: 'SEC Reporting', dueDate: 'Day 10' },
  ],

  journalEntries: {
    total: 482,                    // est. — typical for a Delta-scale close
    totalAmount: 15854,            // Q1 2026 GAAP total operating revenue, $M
    automated: 358,                // est. — ~75% automation typical
    manual: 124,                   // est.
  },

  // Trial-balance values use Q1 2026 GAAP figures from 10-Q Statements of
  // Operations. Prior-month values are illustrative monthly run-rates from
  // the same quarter; budget values are estimated against Delta's January
  // 2026 initial Q1 guidance (5-7% revenue growth, mid-single-digit
  // non-fuel CASM growth) before the March-April fuel spike.
  trialBalance: [
    { label: 'Total Operating Revenue', actual: 15854, priorMonth: 5285, budget: 15200 },        // Q1 2026 actual; PM = ~1/3 of quarter; budget = pre-spike midpoint
    { label: 'Salaries and Related Costs', actual: 4541, priorMonth: 1514, budget: 4480 },        // 10-Q line
    { label: 'Aircraft Fuel and Related Taxes', actual: 2742, priorMonth: 914, budget: 2520 },    // 10-Q line; budget pre-spike
    { label: 'Refinery Expense', actual: 1654, priorMonth: 551, budget: 1300 },                   // 10-Q line
    { label: 'Contracted Services', actual: 1190, priorMonth: 397, budget: 1170 },
    { label: 'Landing Fees and Other Rents', actual: 913, priorMonth: 304, budget: 895 },
    { label: 'Aircraft Maintenance Materials and Outside Repairs', actual: 709, priorMonth: 236, budget: 680 },
    { label: 'Regional Carrier Expense', actual: 649, priorMonth: 216, budget: 635 },
    { label: 'Depreciation and Amortization', actual: 635, priorMonth: 212, budget: 625 },
    { label: 'Total Operating Expense', actual: 15353, priorMonth: 5118, budget: 14600 },
    { label: 'Operating Income', actual: 501, priorMonth: 167, budget: 600 },                     // GAAP
    { label: 'Net Income', actual: -289, priorMonth: -96, budget: 250 },                          // GAAP — drag from MTM equity-investment loss
    { label: 'Total Assets', actual: 84431, priorMonth: 84431, budget: 81000 },                    // 10-Q balance sheet
    { label: 'Total Liabilities', actual: 64055, priorMonth: 64055, budget: 60000 },               // = total assets - stockholders' equity
    { label: 'Stockholders\' Equity', actual: 20376, priorMonth: 20376, budget: 21000 },
  ],
};
