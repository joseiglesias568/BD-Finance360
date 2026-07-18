// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/month-end.ts
//
// Close-process tasks aligned to BD's MedTech accounting model:
// revenue recognition by segment, product remediation accruals, FX translation,
// R&D capitalization, intangible amortization, and segment P&L consolidation.
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
    {
      id: 'mc-1', phase: 'Pre-Close',
      name: 'Segment revenue data cutoff — Medical Essentials, Connected Care, BioPharma Systems, Interventional; verify shipment cutoff and channel inventory data',
      status: 'completed', owner: 'Segment Revenue Accounting', dueDate: 'Day 1',
    },
    {
      id: 'mc-2', phase: 'Pre-Close',
      name: 'FX rates cutoff — month-end spot rates for all significant currencies (EUR, JPY, CNY, GBP, BRL, AUD); confirm with Treasury hedging rates',
      status: 'completed', owner: 'Treasury / FP&A', dueDate: 'Day 1',
    },
    {
      id: 'mc-3', phase: 'Pre-Close',
      name: 'BD Alaris remediation accrual update — review customer site completion milestones; update estimated completion cost accrual and warranty reserve',
      status: 'in-progress', owner: 'Connected Care Finance / Regulatory', dueDate: 'Day 2',
    },
    {
      id: 'mc-4', phase: 'Pre-Close',
      name: 'R&D project capitalization cutoff — identify qualifying internal-use software and product development projects meeting ASC 350 capitalization criteria',
      status: 'completed', owner: 'R&D Finance', dueDate: 'Day 1',
    },

    // Revenue Recognition
    {
      id: 'mc-5', phase: 'Revenue Recognition',
      name: 'Medical Essentials revenue recognition — MDS and Specimen Management shipment-based revenue; distributor sell-through verification; China VoBP price adjustment journals',
      status: 'completed', owner: 'Medical Essentials Revenue Accounting', dueDate: 'Day 2',
    },
    {
      id: 'mc-6', phase: 'Revenue Recognition',
      name: 'Connected Care revenue recognition — Alaris pump system revenue (capital vs consumable split); Pyxis dispensing software/service revenue; HemoSphere subscription and capital recognition',
      status: 'in-progress', owner: 'Connected Care Revenue Accounting', dueDate: 'Day 2',
    },
    {
      id: 'mc-7', phase: 'Revenue Recognition',
      name: 'BioPharma Systems revenue recognition — prefillable syringe and drug delivery system shipment to pharmaceutical manufacturers; long-term supply agreement percentage completion',
      status: 'in-progress', owner: 'BioPharma Systems Revenue Accounting', dueDate: 'Day 2',
    },
    {
      id: 'mc-8', phase: 'Revenue Recognition',
      name: 'Interventional revenue recognition — Surgery, Peripheral Intervention, and UCC procedure-based and unit-based revenue; consignment inventory revenue cutoff at procedure date',
      status: 'completed', owner: 'Interventional Revenue Accounting', dueDate: 'Day 2',
    },
    {
      id: 'mc-9', phase: 'Revenue Recognition',
      name: 'FX translation of international subsidiary revenues — apply month-end FX rates to all non-USD subsidiary P&Ls; calculate FXN organic growth bridge',
      status: 'in-progress', owner: 'International Finance / Consolidation', dueDate: 'Day 3',
    },

    // Journal Processing
    {
      id: 'mc-10', phase: 'Journal Processing',
      name: 'Cost of products sold — manufacturing cost of goods, variances vs standard cost, inventory obsolescence reserve; BD Excellence productivity adjustment',
      status: 'in-progress', owner: 'Manufacturing Finance / Cost Accounting', dueDate: 'Day 3',
    },
    {
      id: 'mc-11', phase: 'Journal Processing',
      name: 'R&D expense accrual — contracted research milestones, clinical trial costs, regulatory submission fees; R&D capitalization reclassification for qualifying projects',
      status: 'in-progress', owner: 'R&D Finance', dueDate: 'Day 3',
    },
    {
      id: 'mc-12', phase: 'Journal Processing',
      name: 'Intangible asset amortization — Bard ($24B 2017) and CareFusion ($12B 2015) acquisition intangibles; acquired technology, customer relationships, trademarks amortization schedule',
      status: 'pending', owner: 'Corporate Accounting', dueDate: 'Day 4',
    },
    {
      id: 'mc-13', phase: 'Journal Processing',
      name: 'Product remediation accrual — BD Alaris consent decree compliance costs; FDA Warning Letter remediation project expense; estimated remaining remediation reserve',
      status: 'pending', owner: 'Legal / Regulatory Finance', dueDate: 'Day 4',
    },
    {
      id: 'mc-14', phase: 'Journal Processing',
      name: 'Interest expense and debt journal — interest on long-term debt ($613M annual base); amortization of debt issuance costs; hedging gain/loss reclassification',
      status: 'pending', owner: 'Treasury', dueDate: 'Day 4',
    },
    {
      id: 'mc-15', phase: 'Journal Processing',
      name: 'BD Excellence restructuring accrual — cost-out program severance, facility exit, and transformation costs; separate from recurring operating expenses per GAAP vs non-GAAP policy',
      status: 'pending', owner: 'Corporate Accounting / FP&A', dueDate: 'Day 4',
    },

    // Review & Analysis
    {
      id: 'mc-16', phase: 'Review & Analysis',
      name: 'Segment organic growth analysis — FXN price/volume/mix bridge by segment; China VoBP headwind isolation; Alaris remediation revenue impact quantification',
      status: 'pending', owner: 'Enterprise FP&A', dueDate: 'Day 5',
    },
    {
      id: 'mc-17', phase: 'Review & Analysis',
      name: 'Adjusted gross margin analysis vs 54.7% Q2 FY26 baseline; manufacturing productivity (BD Excellence target >8% per plant); COGS variance investigation',
      status: 'pending', owner: 'Manufacturing Finance / FP&A', dueDate: 'Day 5',
    },
    {
      id: 'mc-18', phase: 'Review & Analysis',
      name: 'FCF reconciliation — operating cash flow to net income bridge; capex vs 3.5% revenue target; working capital changes (AR, inventory, AP); BD Excellence cash conversion',
      status: 'pending', owner: 'Treasury / Corporate FP&A', dueDate: 'Day 6',
    },
    {
      id: 'mc-19', phase: 'Review & Analysis',
      name: 'Net leverage update — trailing 12-month adjusted EBITDA; net debt calculation; progress toward 2.5x leverage target',
      status: 'pending', owner: 'Treasury / FP&A', dueDate: 'Day 6',
    },

    // Consolidation
    {
      id: 'mc-20', phase: 'Consolidation',
      name: 'Four-segment P&L consolidation — Medical Essentials + Connected Care + BioPharma Systems + Interventional + Corporate/Other; inter-segment elimination',
      status: 'pending', owner: 'Corporate Accounting', dueDate: 'Day 7',
    },
    {
      id: 'mc-21', phase: 'Consolidation',
      name: 'FX translation of balance sheet — CTA (Cumulative Translation Adjustment) update; remeasurement of monetary items in non-functional currency entities',
      status: 'pending', owner: 'International Finance / Consolidation', dueDate: 'Day 7',
    },
    {
      id: 'mc-22', phase: 'Consolidation',
      name: 'GAAP to non-GAAP reconciliation — intangible amortization, restructuring/BD Excellence charges, acquisition-related costs, non-GAAP tax adjustment; adj. EPS calculation',
      status: 'pending', owner: 'External Reporting / Tax', dueDate: 'Day 8',
    },

    // Reporting
    {
      id: 'mc-23', phase: 'Reporting',
      name: 'Quarterly earnings press release — consolidated P&L, segment revenues, adj. EPS ($12.52–$12.72 guidance), organic growth rates, FY2026 guidance update',
      status: 'pending', owner: 'IR / External Reporting', dueDate: 'Day 10',
    },
    {
      id: 'mc-24', phase: 'Reporting',
      name: 'Form 10-Q / 10-K filing — MD&A, segment financials, risk factors, remediation disclosures, China VoBP discussion, Alaris progress update',
      status: 'pending', owner: 'SEC Reporting', dueDate: 'Day 12',
    },
    {
      id: 'mc-25', phase: 'Reporting',
      name: 'Earnings call materials — IR slide deck; CFO talking points on organic growth, margin, and FCF; segment deep-dives; Alaris, China, GLP-1 messaging',
      status: 'pending', owner: 'IR', dueDate: 'Day 11',
    },
  ],

  financialResults: {
    revenue: { label: 'Total Revenues ($M)', actual: 4714, plan: 4680, priorYear: 4480, variance: 34, variancePercent: 0.7 },
    cogs: { label: 'Cost of Products Sold ($M)', actual: 2566, plan: 2548, priorYear: 2464, variance: 18, variancePercent: 0.7 },
    grossProfit: { label: 'Gross Profit ($M)', actual: 2148, plan: 2132, priorYear: 2016, variance: 116, variancePercent: 5.8 },
    operatingExpenses: { label: 'R&D + SG&A + Other OpEx ($M)', actual: 1007, plan: 1020, priorYear: 960, variance: -13, variancePercent: -1.3 },
    operatingIncome: { label: 'Adjusted Operating Income ($M)', actual: 1141, plan: 1100, priorYear: 1070, variance: 41, variancePercent: 3.8 },
    netIncome: { label: 'Adjusted Net Income ($M)', actual: 1010, plan: 960, priorYear: 930, variance: 80, variancePercent: 8.6 },
  },
};
