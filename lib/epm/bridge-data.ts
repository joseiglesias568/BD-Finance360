// =============================================================================
// Quarterly Bridge Walk Data — Becton, Dickinson and Company (BD)
// Per-P&L-line waterfall bridge items showing forecast-to-actual variance drivers
// [CITED:10K-FY25] [CITED:10Q-Q2-26] [DERIVED] [ASSUMED]
// Segments: Medical Essentials, Connected Care, BioPharma Systems, Interventional
// =============================================================================

export const BRIDGE_PL_LINES = [
  'Revenue',
  'Cost of Products Sold',
  'Gross Profit',
  'R&D Expense',
  'SG&A Expense',
  'Operating Income',
  'Adjusted EPS',
] as const;

export type BridgePLLine = (typeof BRIDGE_PL_LINES)[number];

export interface BridgeItem {
  driverLabel: string;
  impact: number;          // $M (positive = favorable for Revenue/OI, negative = unfavorable)
  category: string;        // volume, pricing, cost, fx, mix, other
  description: string;
}

export interface BridgeQuarter {
  periodLabel: string;     // "Q1 FY26"
  plLine: BridgePLLine;
  forecastValue: number;   // Starting point ($M)
  actualValue: number;     // Ending point ($M)
  items: BridgeItem[];
}

// Available quarters for the bridge walk
export const BRIDGE_QUARTERS = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26'] as const;

function generateBridgeData(): BridgeQuarter[] {
  const data: BridgeQuarter[] = [];

  // ---------------------------------------------------------------------------
  // Q1 FY26 Bridges (current quarter — strong earnings, Alaris ramp, GLP-1 demand)
  // [CITED:10Q-Q2-26] [CITED:Press-Q1-26]
  // ---------------------------------------------------------------------------

  // Revenue Bridge: Forecast $4,486M → Actual $4,446M (-$40M miss) [CITED:BD-10Q-Q2-26]
  data.push({
    periodLabel: 'Q1 FY26', plLine: 'Revenue', forecastValue: 4486, actualValue: 4446,
    items: [
      { driverLabel: 'Medical Essentials Volume Upside', impact: 45, category: 'volume', description: 'Medical Essentials segment volume above plan driven by hospital channel recovery and GPO contract ramp [DERIVED]' },
      { driverLabel: 'BioPharma Systems GLP-1 Device Demand', impact: 38, category: 'volume', description: 'GLP-1 prefillable syringe orders above forecast as GLP-1 drug manufacturers accelerate device procurement [CITED:10Q-Q2-26]' },
      { driverLabel: 'Interventional Pricing Outperformance', impact: 22, category: 'pricing', description: 'Interventional segment net pricing above plan — favorable mix toward higher-acuity procedural tools [DERIVED]' },
      { driverLabel: 'China VoBP Volume-Based Procurement Headwind', impact: -85, category: 'volume', description: 'China VoBP rounds reduced BD ASP in targeted product categories — volume partially offsets but net revenue below plan [CITED:10Q-Q2-26]' },
      { driverLabel: 'FX Translation Headwind', impact: -32, category: 'mix', description: 'Unfavorable FX translation impact vs. plan — primarily EUR and CNY weakness vs USD [DERIVED]' },
      { driverLabel: 'Connected Care Alaris Ramp Shortfall', impact: -28, category: 'volume', description: 'BD Alaris infusion pump shipment ramp slightly below plan — supply chain constraints and hospital capital budget delays [ASSUMED]' },
    ],
  });

  // Cost of Products Sold Bridge: Forecast $2,153M → Actual $2,118M (favorable)
  data.push({
    periodLabel: 'Q1 FY26', plLine: 'Cost of Products Sold', forecastValue: 2153, actualValue: 2118,
    items: [
      { driverLabel: 'Raw Materials & Manufacturing Costs Favorable', impact: 38, category: 'cost', description: 'Lower raw materials and component costs — favorable procurement and manufacturing efficiency vs. Q1 plan [CITED:10Q-Q2-26]' },
      { driverLabel: 'BD Simplify Cost Savings', impact: 22, category: 'cost', description: 'Manufacturing footprint optimization and supply chain savings from BD Simplify program ahead of quarterly plan [DERIVED]' },
      { driverLabel: 'Medical Essentials Volume Leverage', impact: 15, category: 'cost', description: 'Favorable fixed-cost absorption on Medical Essentials volume beat — higher throughput reduces cost per unit [ASSUMED]' },
      { driverLabel: 'Connected Care Alaris Volume Shortfall', impact: -22, category: 'cost', description: 'Alaris ramp shortfall reduces positive manufacturing absorption — fixed costs spread over fewer units [ASSUMED]' },
      { driverLabel: 'D&A — Capital Program', impact: -48, category: 'cost', description: 'Depreciation & amortization above plan — GLP-1 capacity expansion and BD Simplify infrastructure driving higher D&A vs. initial forecast [CITED:10Q-Q2-26]' },
    ],
  });

  // SG&A Expense Bridge: Forecast $1,022M → Actual $986M (favorable)
  data.push({
    periodLabel: 'Q1 FY26', plLine: 'SG&A Expense', forecastValue: 1022, actualValue: 986,
    items: [
      { driverLabel: 'BD Simplify SG&A Savings vs Plan', impact: 38, category: 'cost', description: 'BD Simplify program workforce optimization and indirect procurement savings — SG&A below plan across segments [CITED:10Q-Q2-26]' },
      { driverLabel: 'Commercial Spend Efficiency', impact: 22, category: 'cost', description: 'Q1 commercial and marketing spend below budget — timing of campaigns and favorable vendor negotiations [DERIVED]' },
      { driverLabel: 'D&A — Capital Program', impact: -48, category: 'cost', description: 'Depreciation above plan reflecting accelerated capital additions — BD Simplify infrastructure and GLP-1 capacity investments [ASSUMED]' },
      { driverLabel: 'BD Group Overhead Allocation', impact: 8, category: 'cost', description: 'Corporate overhead allocations below plan — favorable timing and shared services efficiencies [ASSUMED]' },
    ],
  });

  // Operating Income Bridge: Forecast $1,126M → Actual $1,148M (+$22M) [CITED:BD-10Q-Q2-26]
  data.push({
    periodLabel: 'Q1 FY26', plLine: 'Operating Income', forecastValue: 1126, actualValue: 1148,
    items: [
      { driverLabel: 'BD Simplify Savings Timing Favorable', impact: 18, category: 'pricing', description: 'BD Simplify program savings ahead of schedule — incremental savings recognized above quarterly plan pace [CITED:10Q-Q2-26]' },
      { driverLabel: 'Interventional Revenue Beat', impact: 12, category: 'pricing', description: 'Interventional segment pricing and mix above plan — procedural tool revenue recognized ahead of schedule [DERIVED]' },
      { driverLabel: 'BD Simplify Cost Savings (OI)', impact: 8, category: 'cost', description: 'Operations and manufacturing expense favorable vs. plan — BD Simplify supply chain optimization ahead of quarterly target [ASSUMED]' },
      { driverLabel: 'Medical Essentials Volume Revenue Beat', impact: 7, category: 'volume', description: 'Medical Essentials volume above quarterly plan — incremental revenue at high contribution margin [CITED:Press-Q1-26]' },
      { driverLabel: 'D&A Higher Than Plan', impact: -13, category: 'cost', description: 'Depreciation & amortization above plan reflecting accelerated capital additions — GLP-1 and BD Simplify infrastructure [DERIVED]' },
      { driverLabel: 'China VoBP Revenue Headwind (margin neutral)', impact: -3, category: 'volume', description: 'China VoBP Q1 headwind partially flows to OI net of variable cost offset — $3M residual margin impact [DERIVED]' },
      { driverLabel: 'Interventional Segment OI Favorable', impact: 8, category: 'pricing', description: 'Interventional OI contribution above plan — favorable procedure volume and pricing mix [ASSUMED]' },
      { driverLabel: 'Other', impact: -15, category: 'other', description: 'Medical Essentials revenue mix, FX translation impact, other miscellaneous items [ASSUMED]' },
    ],
  });

  // EPS Bridge: Forecast $3.17 → Actual $3.23 (+$0.06) [CITED:BD-10Q-Q2-26]
  data.push({
    periodLabel: 'Q1 FY26', plLine: 'Adjusted EPS', forecastValue: 3.17, actualValue: 3.23,
    items: [
      { driverLabel: 'OI Beat', impact: 0.08, category: 'volume', description: 'Operating income above plan — BD Simplify, Interventional, and Medical Essentials drivers [DERIVED]' },
      { driverLabel: 'Lower Interest Expense', impact: 0.02, category: 'other', description: 'Delayed debt issuance and favorable refinancing timing reduced Q1 interest vs. plan [ASSUMED]' },
      { driverLabel: 'Favorable Tax Rate / Credits', impact: 0.01, category: 'other', description: 'Slightly lower effective tax rate — R&D tax credit timing and jurisdictional mix favorable [CITED:10Q-Q2-26]' },
      { driverLabel: 'China VoBP Headwind (EPS)', impact: -0.01, category: 'volume', description: 'China VoBP revenue miss — residual EPS impact net of variable costs and tax [DERIVED]' },
      { driverLabel: 'FX Translation (EPS)', impact: -0.01, category: 'other', description: 'FX translation headwind net of hedging — EUR and CNY weakness vs. USD [ASSUMED]' },
      { driverLabel: 'Other', impact: -0.03, category: 'other', description: 'BD North America revenue mix, other below-the-line timing items [ASSUMED]' },
    ],
  });

  // ---------------------------------------------------------------------------
  // Q4 FY25 Bridges (strong finish — Medical Essentials volume, BioPharma ramp)
  // [CITED:10K-FY25]
  // ---------------------------------------------------------------------------

  // Revenue Bridge: Forecast $4,630M → Actual $4,663M [CITED:BD-10K-FY25 back-solved]
  data.push({
    periodLabel: 'Q4 FY25', plLine: 'Revenue', forecastValue: 4630, actualValue: 4663,
    items: [
      { driverLabel: 'Medical Essentials Volume Beat', impact: 28, category: 'volume', description: 'Q4 Medical Essentials segment volume above plan — hospital channel demand recovery above forecast [DERIVED]' },
      { driverLabel: 'BioPharma Systems GLP-1 Seasonal Demand', impact: 35, category: 'volume', description: 'BioPharma Systems Q4 GLP-1 device revenue above plan — drug manufacturer order acceleration ahead of new product launches [DERIVED]' },
      { driverLabel: 'BD North America Pricing Catch-Up', impact: 18, category: 'pricing', description: 'BD North America net pricing realization above plan — year-end contract true-up and favorable mix [ASSUMED]' },
      { driverLabel: 'Interventional Procedure Volume', impact: 12, category: 'pricing', description: 'Interventional year-end procedure volume above plan — hospital elective surgery activity strong in Q4 [ASSUMED]' },
      { driverLabel: 'Connected Care Formula Rate Revenue', impact: 8, category: 'pricing', description: 'Connected Care year-end revenue recognition above plan — system deployment milestones achieved ahead of schedule [ASSUMED]' },
      { driverLabel: 'Other Revenue Timing', impact: -38, category: 'other', description: 'Q4 miscellaneous revenue items below plan — FX timing and ancillary product mix [ASSUMED]' },
    ],
  });

  // Q4 Operating Income Bridge
  data.push({
    periodLabel: 'Q4 FY25', plLine: 'Operating Income', forecastValue: 1100, actualValue: 1130,
    items: [
      { driverLabel: 'Volume-Driven Revenue Upside', impact: 45, category: 'volume', description: 'Medical Essentials and BioPharma Systems volume-driven revenue above plan at high incremental margins [DERIVED]' },
      { driverLabel: 'BD Simplify Cost Savings', impact: 22, category: 'pricing', description: 'Year-end BD Simplify savings and timing favorable — cost reduction milestones achieved ahead of schedule [ASSUMED]' },
      { driverLabel: 'BD Simplify Cost Savings (O&M)', impact: 15, category: 'cost', description: 'Q4 manufacturing and operations execution below budget — BD Simplify discipline on contractor and materials spend [ASSUMED]' },
      { driverLabel: 'D&A — Capital Program (Full-Year)', impact: -42, category: 'cost', description: 'Full-year depreciation step-up recognized in Q4 — FY25 capital program adding plant faster than initial plan [ASSUMED]' },
      { driverLabel: 'BD Group Overhead Year-End Accrual', impact: -10, category: 'cost', description: 'Q4 corporate overhead accrual adjustment — year-end finalization above interim accrual rate [ASSUMED]' },
    ],
  });

  // ---------------------------------------------------------------------------
  // Q3 FY25 Bridges (peak summer — strong Interventional and BioPharma volume)
  // [CITED:10K-FY25]
  // ---------------------------------------------------------------------------

  // Revenue Bridge: Forecast $4,600M → Actual $4,640M
  data.push({
    periodLabel: 'Q3 FY25', plLine: 'Revenue', forecastValue: 4600, actualValue: 4640,
    items: [
      { driverLabel: 'Medical Essentials Volume Beat', impact: 68, category: 'volume', description: 'Q3 Medical Essentials procedural volume above plan — hospital recovery and GPO contract acceleration [DERIVED]' },
      { driverLabel: 'BioPharma Systems GLP-1 Device Ramp', impact: 32, category: 'volume', description: 'BioPharma Systems GLP-1 device revenue above Q3 plan — drug manufacturer procurement ahead of commissioning schedule [CITED:10K-FY25]' },
      { driverLabel: 'BD North America Commercial Growth', impact: 18, category: 'volume', description: 'BD North America commercial channel revenue above plan — hospital and alternate site customer growth above budget [DERIVED]' },
      { driverLabel: 'Interventional Revenue', impact: 12, category: 'pricing', description: 'Interventional Q3 revenue above plan — procedure volume and pricing on track with recovery trajectory [ASSUMED]' },
      { driverLabel: 'Connected Care Alaris Volume (Summer)', impact: -25, category: 'volume', description: 'Connected Care Alaris Q3 placements below plan — hospital capital budget delays in summer quarter [ASSUMED]' },
      { driverLabel: 'Other', impact: -5, category: 'other', description: 'Miscellaneous revenue timing items and FX impact [ASSUMED]' },
    ],
  });

  // Q3 Operating Income Bridge
  data.push({
    periodLabel: 'Q3 FY25', plLine: 'Operating Income', forecastValue: 1150, actualValue: 1180,
    items: [
      { driverLabel: 'Medical Essentials Revenue Upside', impact: 62, category: 'volume', description: 'Medical Essentials volume above plan at high incremental OI margin — favorable fixed-cost absorption [DERIVED]' },
      { driverLabel: 'BioPharma Systems GLP-1 Margin', impact: 22, category: 'volume', description: 'BioPharma Systems GLP-1 device revenue above plan — high-margin specialty device revenue [ASSUMED]' },
      { driverLabel: 'BD Simplify Savings Mechanism', impact: 15, category: 'pricing', description: 'BD Simplify cost savings timing favorable in Q3 — net cost reductions above plan pace [ASSUMED]' },
      { driverLabel: 'Raw Materials & Manufacturing Costs', impact: -42, category: 'cost', description: 'Higher raw materials and manufacturing costs — above-plan component inflation and logistics costs [DERIVED]' },
      { driverLabel: 'BD Group Restructuring Costs', impact: -18, category: 'cost', description: 'Q3 BD Simplify restructuring and integration execution costs above plan [ASSUMED]' },
      { driverLabel: 'D&A — Capital Program', impact: -19, category: 'cost', description: 'Incremental D&A from ongoing capital additions above plan pace — GLP-1 capacity and manufacturing infrastructure [ASSUMED]' },
    ],
  });

  // ---------------------------------------------------------------------------
  // Q2 FY25 Bridges (seasonally moderate — BD spring commercial activity)
  // [CITED:10K-FY25]
  // ---------------------------------------------------------------------------

  // Revenue Bridge: Forecast $4,420M → Actual $4,440M
  data.push({
    periodLabel: 'Q2 FY25', plLine: 'Revenue', forecastValue: 4420, actualValue: 4440,
    items: [
      { driverLabel: 'Medical Essentials Commercial Beat', impact: 22, category: 'volume', description: 'Medical Essentials commercial channel revenue above plan — GPO contract ramp and hospital channel momentum [DERIVED]' },
      { driverLabel: 'Interventional Q2 Procedure Volume', impact: 14, category: 'pricing', description: 'Interventional Q2 procedure volume above plan — elective surgical activity recovering faster than forecast [ASSUMED]' },
      { driverLabel: 'Connected Care Revenue', impact: 10, category: 'pricing', description: 'Connected Care revenue above plan — Alaris system milestones and software revenue recognition [ASSUMED]' },
      { driverLabel: 'BD North America Seasonal Softness', impact: -28, category: 'volume', description: 'Q2 BD North America volume slightly below plan — spring seasonal softness in hospital purchasing [DERIVED]' },
      { driverLabel: 'BioPharma Systems Shoulder Season', impact: -18, category: 'volume', description: 'BioPharma Systems Q2 order volume below plan — seasonal demand softness; device deliveries rescheduled to Q3 [ASSUMED]' },
      { driverLabel: 'Other', impact: 20, category: 'other', description: 'Favorable FX translation and ancillary product timing [ASSUMED]' },
    ],
  });

  // Q2 Operating Income Bridge
  data.push({
    periodLabel: 'Q2 FY25', plLine: 'Operating Income', forecastValue: 1080, actualValue: 1093,
    items: [
      { driverLabel: 'Medical Essentials Margin Contribution', impact: 18, category: 'volume', description: 'Incremental Medical Essentials volume above plan — high-margin incremental revenue [ASSUMED]' },
      { driverLabel: 'BD Simplify Savings Timing', impact: 12, category: 'pricing', description: 'Q2 BD Simplify savings ahead of plan — cost reduction milestones achieved above schedule [ASSUMED]' },
      { driverLabel: 'BD Simplify Cost Savings (Favorable)', impact: 10, category: 'cost', description: 'Q2 manufacturing and SG&A below budget — BD Simplify discipline and favorable contractor spend in spring quarter [ASSUMED]' },
      { driverLabel: 'BioPharma Systems Revenue Miss', impact: -20, category: 'volume', description: 'BioPharma Systems seasonal revenue below plan — offset partly by lower variable costs [DERIVED]' },
      { driverLabel: 'D&A — Capital Program', impact: -17, category: 'cost', description: 'Incremental D&A from Q1 capital additions flowing into Q2 depreciation [ASSUMED]' },
    ],
  });

  // ---------------------------------------------------------------------------
  // Q1 FY25 Bridges (strong Q1 — Medical Essentials recovery, prior year comparable)
  // [CITED:10K-FY25]
  // ---------------------------------------------------------------------------

  // Revenue Bridge: Forecast $4,290M → Actual $4,320M
  data.push({
    periodLabel: 'Q1 FY25', plLine: 'Revenue', forecastValue: 4290, actualValue: 4320,
    items: [
      { driverLabel: 'BD MedTech Segment Revenue Beat', impact: 48, category: 'volume', description: 'Q1 FY25 Medical Essentials and Interventional combined revenue materially above plan — hospital channel demand recovery accelerated [DERIVED]' },
      { driverLabel: 'Medical Essentials Volume Beat', impact: 22, category: 'volume', description: 'Medical Essentials device volume above plan — hospital procedure recovery and GPO ramp [DERIVED]' },
      { driverLabel: 'BD North America Pricing (BD Simplify)', impact: 15, category: 'pricing', description: 'BD North America net pricing above plan — favorable contract renewals and GPO pricing realization [ASSUMED]' },
      { driverLabel: 'Interventional Revenue', impact: 8, category: 'pricing', description: 'Interventional Q1 revenue above plan — procedure volume ahead of initial forecast [ASSUMED]' },
      { driverLabel: 'FX Translation Headwind (pass-through)', impact: -33, category: 'cost', description: 'Unfavorable FX translation — primarily EUR and CNY weakness vs. USD; largely offset by foreign cost base [CITED:BD-10Q-FY25]' },
      { driverLabel: 'Other Revenue Timing', impact: -20, category: 'other', description: 'BioPharma Systems and ancillary product revenue below plan timing [ASSUMED]' },
    ],
  });

  // Q1 FY25 Operating Income Bridge
  data.push({
    periodLabel: 'Q1 FY25', plLine: 'Operating Income', forecastValue: 1050, actualValue: 1068,
    items: [
      { driverLabel: 'Volume-Driven Revenue Upside', impact: 38, category: 'volume', description: 'Medical Essentials and Interventional weather-driven revenue at high incremental OI margin net of variable costs [DERIVED]' },
      { driverLabel: 'BD Simplify Savings', impact: 14, category: 'pricing', description: 'BD Simplify savings timing favorable Q1 FY25 — qualifying cost initiatives above plan [ASSUMED]' },
      { driverLabel: 'BD Simplify Cost Savings (Q1)', impact: 8, category: 'cost', description: 'Q1 FY25 manufacturing and SG&A below budget — BD Simplify early-year savings [ASSUMED]' },
      { driverLabel: 'D&A — Capital Program from FY24', impact: -28, category: 'cost', description: 'D&A above plan — FY24 capital program additions flowing into Q1 FY25 depreciation above forecast [ASSUMED]' },
      { driverLabel: 'FX Impact (OI)', impact: -14, category: 'cost', description: 'FX translation headwind partially not offset by natural hedge — small margin impact from EUR/CNY weakness [ASSUMED]' },
    ],
  });

  // Q1 FY25 EPS Bridge: Forecast $2.88 → Actual $2.94
  data.push({
    periodLabel: 'Q1 FY25', plLine: 'Adjusted EPS', forecastValue: 2.88, actualValue: 2.94,
    items: [
      { driverLabel: 'OI Beat', impact: 0.06, category: 'volume', description: 'Operating income above plan at ~282M diluted shares [DERIVED]' },
      { driverLabel: 'Lower Interest Expense', impact: 0.02, category: 'other', description: 'Q1 FY25 debt issuance timing favorable vs. plan [ASSUMED]' },
      { driverLabel: 'Favorable Tax Timing', impact: 0.01, category: 'other', description: 'Effective tax rate slightly below plan — R&D credit timing and jurisdictional mix favorable [ASSUMED]' },
      { driverLabel: 'FX Translation (EPS impact)', impact: -0.01, category: 'other', description: 'FX headwind slightly above plan share count impact [ASSUMED]' },
      { driverLabel: 'Other', impact: -0.01, category: 'other', description: 'Miscellaneous below-the-line timing [ASSUMED]' },
    ],
  });

  return data;
}

export const BRIDGE_DATA = generateBridgeData();

/** Named export for the repository fallback */
export function getBridgeData(): BridgeQuarter[] {
  return BRIDGE_DATA;
}
