// =============================================================================
// Becton, Dickinson and Company (BD) P&L Scenario Calculation Engine
//
// Lever vocabulary matches the seeded ScenarioLever table
// (prisma/seeds/08-scenarios.ts). All impacts are computed as the delta
// between the user-selected slider value and the lever's seeded default.
//
// Segments: Medical Essentials, Connected Care, BioPharma Systems, Interventional
// Sensitivities anchored to BD investor disclosures, FY26 plan, and 10-Q filings.
//
// CRITICAL: sharedSegmentRevenue() arg strings must EXACTLY match
// config/clients/bd/financials.ts → scenarioBaseline.segments[].name
// A mismatch silently returns $0 with no runtime error.
// =============================================================================

import type { ScenarioBaselinePL } from '@/config/types';
import { financials } from '../config/clients/bd/financials';
import { computeSimulationStats, normalRandom } from '@/lib/engines/statistical-engine';

const SHARED_BASELINE = financials.scenarioBaseline;

// Hardcoded fallback defaults mirroring prisma/seeds/08-scenarios.ts BD levers.
// Used only when callers don't pass leverDefs (e.g. tests).
// CRITICAL: keys must EXACTLY match externalId values in 08-scenarios.ts
const FALLBACK_DEFAULTS: Record<string, number> = {
  'glp1-volume-growth':        18.0,   // % YoY GLP-1 device revenue growth (FY26 plan)
  'china-vobp-headwind':       150,    // $M annual China VoBP revenue headwind (FY26 plan)
  'alaris-ramp-rate':          80,     // BD Alaris placements/quarter (FY26 run rate)
  'fx-impact-revenue':        -50,     // $M FX translation headwind (quarterly)
  'fcf-conversion':            85,     // % FCF conversion rate (adj. net income to FCF)
  'biopharma-pricing':          3.0,   // % net pricing realization in BioPharma Systems
  'emerging-markets-offset':    2.0,   // % revenue offset from emerging markets growth
  'us-volume-growth':           4.5,   // % US organic volume growth rate
  'mms-capital-placements':    80,     // Alaris capital placements/quarter (same as alaris-ramp-rate)
  'connected-care-growth':      5.0,   // % Connected Care segment organic growth
  'international-mix-shift':    1.5,   // pp shift in international revenue mix
  'hedging-benefit':           30,     // $M FX hedging gain vs unhedged position
  'debt-paydown-rate':         500,    // $M annual debt reduction from FCF
  'interest-expense-savings':   15,    // $M quarterly interest savings from debt paydown
  'capacity-utilization':       82,    // % manufacturing capacity utilization
};

// BD P&L sensitivity constants anchored to investor disclosures and FY26 plan
const BD_SENSITIVITY = {
  // Revenue sensitivities (per $M unless noted)
  glp1RevenuePerGrowthPp:        25,   // $M quarterly revenue per +1pp GLP-1 device growth
  vobpRevenueHeadwind:            1,   // $M revenue per $1M VoBP headwind (direct 1:1)
  alarisRevenuePerPlacement:      0.6, // $M revenue per Alaris placement (avg ASP ~$0.6M)
  fxRevenuePerM:                  1,   // $M revenue per $1M FX impact (direct)
  usVolumeRevenuePerPp:          95,   // $M quarterly revenue per +1pp US volume growth
  connectedCareRevenuePerPp:     47,   // $M quarterly revenue per +1pp Connected Care growth
  // Margin sensitivities
  grossMarginBaselinePct:         0.52, // 52% gross margin baseline
  aoiMarginBaselinePct:           0.25, // 25% adj. operating margin baseline
  // Capital structure
  interestPerDebtPaydownM:        0.06, // $M quarterly interest savings per $100M debt reduction × 6%
  // Per-share (282M diluted shares, 16.5% tax)
  sharesOutstanding:              282,  // M diluted shares
  taxRate:                        0.165,// 16.5% adjusted effective tax rate
  quarterlyInterestExpense:       150,  // $M quarterly interest expense baseline
} as const;

export interface ScenarioImpactResult {
  revenueImpact: number;        // $M delta vs baseline
  ebitdaImpact: number;         // $M delta
  epsImpact: number;            // $/share delta
  rateBaseImpact: number;       // $B delta (leverage ratio proxy for CVS)
  ffoDebtImpact: number;        // bps delta to leverage ratio (vs 3.84x baseline)
  capexImpact: number;          // $M delta (CFO proxy)
  segments: {
    hcb: { revenue: number; aoi: number };
    hss: { revenue: number; aoi: number };
    pcw: { revenue: number; aoi: number };
    corp: { aoi: number };
  };
  scenarios: { name: string; probability: number; epsOutcome: number }[];
  summary: string;
}

export interface PLImpactResult {
  // Revenue impacts ($M deltas from baseline)
  // Field names preserved for frontend compatibility; CVS segment mapping in comments
  revenue: number;
  advisoryServices: number;       // HCB (Health Care Benefits / Aetna) revenue impact
  buildingOperations: number;     // HSS (Health Services / Caremark) revenue impact
  projectManagement: number;      // PCW (Pharmacy & Consumer Wellness) revenue impact
  realEstateInvestments: number;  // Health100 / Other digital revenue impact

  // COGS impacts
  personnelCosts: number;
  subcontractorCosts: number;
  facilityCosts: number;
  cogs: number;
  grossProfit: number;

  // Operating expense impacts
  technologyCosts: number;
  marketing: number;
  professionalDev: number;
  sga: number;
  otherOpEx: number;
  opEx: number;

  // Bottom-line impacts
  operatingIncome: number;
  interest: number;
  ebt: number;
  tax: number;
  netIncome: number;
  operatingMargin: number;

  // Base values for display
  baseRevenue: number;
  baseAdvisoryServices: number;
  baseBuildingOperations: number;
  baseProjectManagement: number;
  baseRealEstateInvestments: number;
  basePersonnelCosts: number;
  baseSubcontractorCosts: number;
  baseFacilityCosts: number;
  baseCOGS: number;
  baseGrossProfit: number;
  baseTechnologyCosts: number;
  baseMarketing: number;
  baseProfessionalDev: number;
  baseSGandA: number;
  baseOtherOpEx: number;
  baseOpEx: number;
  baseOperatingIncome: number;
  baseInterest: number;
  baseOtherIncome: number;
  baseEBT: number;
  baseTax: number;
  baseNetIncome: number;
}

export interface SimulationResult {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  mean: number;
  stdDev: number;
  confidence95Lower: number;
  confidence95Upper: number;
}

export type MonteCarloResults = Record<string, SimulationResult>;

export interface LeverDef {
  id: string;
  min: number;
  max: number;
  default: number;
}

function segmentRevenue(
  baselinePL: ScenarioBaselinePL | undefined,
  name: string,
  fallback: number,
): number {
  return baselinePL?.segments?.find(s => s.name === name)?.revenue ?? fallback;
}

function sharedSegmentRevenue(segmentName: string): number {
  const hit = SHARED_BASELINE.segments.find((s) => s.name === segmentName);
  if (!hit) {
    throw new Error(`scenario-engine: missing segment "${segmentName}" in scenarioBaseline`);
  }
  return hit.revenue;
}

// =============================================================================
// P&L IMPACT CALCULATION
//
// Sign convention (must stay aligned with ScenarioModelingClient.tsx):
// - Revenue, gross profit, operating income, net income: delta >= 0 -> green.
// - COGS & OpEx breakdown rows: delta > 0 -> higher expense vs baseline -> red.
// - Interest expense row: delta > 0 -> higher interest vs baseline -> red.
// - Tax row: delta <= 0 -> green (lower incremental tax vs scenario delta).
// =============================================================================

export function calculateImpact(
  leverValues: Record<string, number>,
  baselineRevenueB: number,
  baselinePL?: ScenarioBaselinePL,
  leverDefs?: LeverDef[],
): PLImpactResult {
  const baseRevenue = baselineRevenueB * 1000;
  const bl = baselinePL ?? SHARED_BASELINE;

  // ─── Resolve segment baselines ───────────────────────────────────────────
  // Medical Essentials: BD's largest segment by revenue
  const baseAdvisoryServices = segmentRevenue(
    bl, 'Medical Essentials', sharedSegmentRevenue('Medical Essentials'),
  );
  // Connected Care: Alaris infusion + medication management systems
  const baseBuildingOperations = segmentRevenue(
    bl, 'Connected Care', sharedSegmentRevenue('Connected Care'),
  );
  // BioPharma Systems: prefillable syringes, auto-injectors, GLP-1 devices
  const baseProjectManagement = segmentRevenue(
    bl, 'BioPharma Systems', sharedSegmentRevenue('BioPharma Systems'),
  );
  // Interventional: surgical, peripheral intervention, urology
  const baseRealEstateInvestments = segmentRevenue(
    bl, 'Interventional', sharedSegmentRevenue('Interventional'),
  );

  // ─── Resolve cost baselines ──────────────────────────────────────────────
  // SG&A labor / colleagues (~300,000 employees)
  const basePersonnelCosts = bl.cogs?.personnelCosts ?? SHARED_BASELINE.cogs.personnelCosts;
  // Medical professional services, contracted care
  const baseSubcontractorCosts = bl.cogs?.subcontractorCosts ?? SHARED_BASELINE.cogs.subcontractorCosts;
  // Medical costs + pharmacy COGS (dominant cost item)
  const baseFacilityCosts = bl.cogs?.facilityCosts ?? SHARED_BASELINE.cogs.facilityCosts;
  const baseCOGS = basePersonnelCosts + baseSubcontractorCosts + baseFacilityCosts;
  const baseGrossProfit = baseRevenue - baseCOGS;

  // Technology / Health100 investment
  const baseTechnologyCosts = bl.opex?.technologyCosts ?? SHARED_BASELINE.opex.technologyCosts;
  // Member acquisition, retail marketing
  const baseMarketing = bl.opex?.marketing ?? SHARED_BASELINE.opex.marketing;
  const baseProfessionalDev = bl.opex?.professionalDev ?? SHARED_BASELINE.opex.professionalDev;
  const baseSGandA = bl.opex?.sga ?? SHARED_BASELINE.opex.sga;
  // Intangible amortization + other (Aetna + Oak Street acquisitions)
  const baseOtherOpEx = bl.opex?.otherOpEx ?? SHARED_BASELINE.opex.otherOpEx;
  const baseOpEx = baseTechnologyCosts + baseMarketing + baseProfessionalDev + baseSGandA + baseOtherOpEx;

  const baseOperatingIncome = baseGrossProfit - baseOpEx;
  const baseInterest = bl.interestExpense ?? SHARED_BASELINE.interestExpense;
  const baseOtherIncome = bl.otherIncome ?? SHARED_BASELINE.otherIncome;
  const baseEBT = baseOperatingIncome - baseInterest + baseOtherIncome;
  const taxRate = bl.taxRate ?? SHARED_BASELINE.taxRate;
  const baseTax = Math.round(baseEBT * taxRate);
  const baseNetIncome = baseEBT - baseTax;

  // ─── Build defaults map for delta-from-default math ──────────────────────
  const defaults: Record<string, number> = { ...FALLBACK_DEFAULTS };
  if (leverDefs) {
    leverDefs.forEach(l => { defaults[l.id] = l.default; });
  }

  // delta() returns (current - default) in the lever's native unit
  const delta = (id: string): number => {
    const d = defaults[id] ?? 0;
    const v = leverValues[id];
    return (v ?? d) - d;
  };

  // ─── MEDICAL ESSENTIALS REVENUE IMPACT ──────────────────────────────────
  // US volume growth: each +1pp = +$95M quarterly revenue
  const usVolumeDelta = delta('us-volume-growth');
  const usVolumeImpact = usVolumeDelta * BD_SENSITIVITY.usVolumeRevenuePerPp;

  // Capacity utilization: higher utilization improves fixed cost absorption and supports volume
  const capacityDelta = delta('capacity-utilization');
  const capacityImpact = capacityDelta * 2.5; // $M quarterly revenue per +1pp utilization

  const medEssentialsRevenueImpact = usVolumeImpact + capacityImpact;

  // ─── CONNECTED CARE REVENUE IMPACT ──────────────────────────────────────
  // Alaris placements: each +1 placement = +$0.6M revenue
  const alarisPlacementDelta = delta('alaris-ramp-rate');
  const alarisRevenueImpact = alarisPlacementDelta * BD_SENSITIVITY.alarisRevenuePerPlacement;

  // Connected Care organic growth: each +1pp = +$47M quarterly revenue
  const connectedCareDelta = delta('connected-care-growth');
  const connectedCareImpact = connectedCareDelta * BD_SENSITIVITY.connectedCareRevenuePerPp;

  // MMS capital placements (Alaris MMS portfolio)
  const mmsPlacementDelta = delta('mms-capital-placements');
  const mmsImpact = mmsPlacementDelta * BD_SENSITIVITY.alarisRevenuePerPlacement;

  const connectedCareRevenueImpact = alarisRevenueImpact + connectedCareImpact + mmsImpact;

  // ─── BIOPHARMA SYSTEMS REVENUE IMPACT ───────────────────────────────────
  // GLP-1 device volume growth: each +1pp = +$25M quarterly revenue
  const glp1Delta = delta('glp1-volume-growth');
  const glp1RevenueImpact = glp1Delta * BD_SENSITIVITY.glp1RevenuePerGrowthPp;

  // BioPharma net pricing: each +1pp net pricing realization
  const biopharmaPrice = delta('biopharma-pricing');
  const biopharmaPriceImpact = biopharmaPrice * 15; // $M quarterly per +1pp net pricing

  // Emerging markets offset to China VoBP headwind
  const emergingMarketsDelta = delta('emerging-markets-offset');
  const emergingMarketsImpact = emergingMarketsDelta * 20; // $M quarterly per +1pp EM growth

  // China VoBP headwind: each +$1M headwind = -$1M revenue (direct 1:1)
  const vobpDelta = delta('china-vobp-headwind');
  const vobpImpact = -vobpDelta * BD_SENSITIVITY.vobpRevenueHeadwind;

  // International mix shift
  const intlMixDelta = delta('international-mix-shift');
  const intlMixImpact = intlMixDelta * 10; // $M quarterly per +1pp mix shift

  const biopharmaRevenueImpact = glp1RevenueImpact + biopharmaPriceImpact + emergingMarketsImpact + vobpImpact + intlMixImpact;

  // ─── FX & HEDGING IMPACT ─────────────────────────────────────────────────
  // FX translation headwind: direct revenue impact
  const fxDelta = delta('fx-impact-revenue');
  const fxImpact = fxDelta * BD_SENSITIVITY.fxRevenuePerM;

  // Hedging benefit: positive = gain vs unhedged position
  const hedgingDelta = delta('hedging-benefit');
  const hedgingImpact = hedgingDelta; // direct $M benefit

  const interventionalRevenueImpact = fxImpact + hedgingImpact;

  // ─── TOTAL REVENUE IMPACT ────────────────────────────────────────────────
  const totalRevenueImpact = medEssentialsRevenueImpact + connectedCareRevenueImpact + biopharmaRevenueImpact + interventionalRevenueImpact;

  // ─── COGS IMPACT ─────────────────────────────────────────────────────────
  // COGS scales at ~48% of incremental revenue (52% gross margin baseline)
  const cogsRatio = 1 - BD_SENSITIVITY.grossMarginBaselinePct;
  const facilityImpact = (medEssentialsRevenueImpact + connectedCareRevenueImpact + biopharmaRevenueImpact) * cogsRatio;
  // Capacity utilization: higher utilization lowers unit COGS via fixed cost absorption
  const personnelImpact = -capacityDelta * 1.5; // $M COGS improvement per +1pp utilization
  const subcontractorImpact = alarisPlacementDelta * 0.1; // incremental service cost per placement

  const cogsImpact = facilityImpact + personnelImpact + subcontractorImpact;
  const grossProfitImpact = totalRevenueImpact - cogsImpact;

  // ─── OPERATING EXPENSES IMPACT ───────────────────────────────────────────
  // BD Simplify program keeps SG&A relatively fixed; incremental revenue drops through
  const technologyImpact = glp1Delta * 2;      // $M digital health investment per +1pp GLP-1 growth
  const marketingImpact = emergingMarketsDelta * 3; // $M commercial investment in EM expansion
  const profDevImpact = alarisPlacementDelta * 0.05; // $M field service / training per placement
  const sgaImpact = 0;                           // BD Simplify: G&A relatively fixed near term

  const otherOpExImpact = 0; // D&A on fixed intangibles; not lever-sensitive

  const opExImpact = technologyImpact + marketingImpact + profDevImpact + sgaImpact + otherOpExImpact;

  const operatingIncomeImpact = grossProfitImpact - opExImpact;

  // ─── BELOW THE LINE ──────────────────────────────────────────────────────
  // Interest expense savings from debt paydown
  const debtPaydownDelta = delta('debt-paydown-rate');
  const interestSavingsDelta = delta('interest-expense-savings');
  // Each $100M additional annual debt paydown at 6% saves ~$1.5M quarterly
  const debtInterestSavings = (debtPaydownDelta / 100) * (BD_SENSITIVITY.interestPerDebtPaydownM * 100 / 4);
  const totalInterestSavings = interestSavingsDelta + debtInterestSavings;

  // FCF conversion improvement
  const fcfDelta = delta('fcf-conversion');

  const interestImpactValue = -totalInterestSavings; // positive savings = negative interest expense delta
  const ebtImpact = operatingIncomeImpact - interestImpactValue;
  const taxImpact = ebtImpact * taxRate;
  const netIncomeImpact = ebtImpact - taxImpact;

  const newRevenue = baseRevenue + totalRevenueImpact;
  const newOperatingIncome = baseOperatingIncome + operatingIncomeImpact;

  return {
    revenue: totalRevenueImpact,
    advisoryServices: medEssentialsRevenueImpact,       // Medical Essentials
    buildingOperations: connectedCareRevenueImpact,     // Connected Care
    projectManagement: biopharmaRevenueImpact,          // BioPharma Systems
    realEstateInvestments: interventionalRevenueImpact, // Interventional / FX & hedging
    personnelCosts: personnelImpact,
    subcontractorCosts: subcontractorImpact,
    facilityCosts: facilityImpact,
    cogs: cogsImpact,
    grossProfit: grossProfitImpact,
    technologyCosts: technologyImpact,
    marketing: marketingImpact,
    professionalDev: profDevImpact,
    sga: sgaImpact,
    otherOpEx: otherOpExImpact,
    opEx: opExImpact,
    operatingIncome: operatingIncomeImpact,
    interest: interestImpactValue,
    ebt: ebtImpact,
    tax: taxImpact,
    netIncome: netIncomeImpact,
    operatingMargin: newRevenue > 0 ? (newOperatingIncome / newRevenue) * 100 : 5.1,
    baseRevenue,
    baseAdvisoryServices,
    baseBuildingOperations,
    baseProjectManagement,
    baseRealEstateInvestments,
    basePersonnelCosts,
    baseSubcontractorCosts,
    baseFacilityCosts,
    baseCOGS,
    baseGrossProfit,
    baseTechnologyCosts,
    baseMarketing,
    baseProfessionalDev,
    baseSGandA,
    baseOtherOpEx,
    baseOpEx,
    baseOperatingIncome,
    baseInterest,
    baseOtherIncome,
    baseEBT,
    baseTax,
    baseNetIncome,
  };
}

// =============================================================================
// SCENARIO IMPACT RESULT (BD-specific)
// =============================================================================

export function computeScenarioImpact(
  leverValues: Record<string, number>,
  leverDefs?: LeverDef[],
  baselinePL?: ScenarioBaselinePL,
): ScenarioImpactResult {
  // BD FY2026 annualized baseline: Revenue ~$21.9B, AOI ~$5.4B, NI ~$2.7B, EPS ~$9.60 midpoint
  const baselineRevenueB = 21.9; // $B FY2026 guidance
  const baselinePLResult = calculateImpact(leverValues, baselineRevenueB, baselinePL, leverDefs);

  const defaults: Record<string, number> = { ...FALLBACK_DEFAULTS };
  if (leverDefs) leverDefs.forEach(l => { defaults[l.id] = l.default; });

  const delta = (id: string): number => {
    const d = defaults[id] ?? 0;
    const v = leverValues[id];
    return (v ?? d) - d;
  };

  // EPS impact: NI delta ÷ ~282M diluted shares (BD FY2026)
  const sharesM = BD_SENSITIVITY.sharesOutstanding;
  const epsImpact = baselinePLResult.netIncome / sharesM;

  // Leverage ratio impact: leverage = Net Debt / EBITDA
  // BD Net Debt ~$17B; each $100M NI improvement ≈ -0.06x leverage ratio
  // In bps: -6bps per $100M NI improvement
  const leverageImpact = (baselinePLResult.netIncome / 100) * (-6); // bps improvement (negative = better leverage)

  // CFO impact proxy: NI delta × FCF conversion rate (~85%)
  const cfoImpact = baselinePLResult.netIncome * (FALLBACK_DEFAULTS['fcf-conversion'] / 100);

  // Segment breakdown (BD four-segment structure)
  const segments = {
    hcb: {
      revenue: baselinePLResult.advisoryServices,
      aoi: baselinePLResult.advisoryServices * 0.22, // ~22% Medical Essentials AOI margin
    },
    hss: {
      revenue: baselinePLResult.buildingOperations,
      aoi: baselinePLResult.buildingOperations * 0.20, // ~20% Connected Care AOI margin
    },
    pcw: {
      revenue: baselinePLResult.projectManagement,
      aoi: baselinePLResult.projectManagement * 0.30, // ~30% BioPharma Systems AOI margin
    },
    corp: {
      aoi: -120, // ~$120M quarterly BD corporate / unallocated drag
    },
  };

  // Bull/Base/Bear EPS outcomes
  const baseEPS = 9.60; // BD FY2026 guidance midpoint ~$9.45–$9.75 adj. EPS
  const scenarios = [
    {
      name: 'Bull — GLP-1 demand accelerates, Alaris ramp outperforms',
      probability: 20,
      epsOutcome: baseEPS + epsImpact + 0.40,
    },
    {
      name: 'Base — FY2026 guidance midpoint (~$9.60 adj. EPS)',
      probability: 55,
      epsOutcome: baseEPS + epsImpact,
    },
    {
      name: 'Bear — China VoBP headwind worse than plan, FX headwinds persist',
      probability: 25,
      epsOutcome: baseEPS + epsImpact - 0.60,
    },
  ];

  const epsSign = epsImpact >= 0 ? '+' : '';
  const leverageSign = leverageImpact <= 0 ? '' : '+';
  const summary = `Scenario levers imply ${epsSign}$${epsImpact.toFixed(2)} EPS delta vs $${baseEPS.toFixed(2)} BD FY2026 baseline, with ${leverageSign}${leverageImpact.toFixed(0)}bps leverage ratio impact targeting <2.5x net leverage by FY27.`;

  return {
    revenueImpact: baselinePLResult.revenue,
    ebitdaImpact: baselinePLResult.operatingIncome + (baselinePLResult.baseOtherOpEx * 0.20),
    epsImpact,
    rateBaseImpact: leverageImpact / 100,      // repurposed: leverage ratio delta (not rate base)
    ffoDebtImpact: leverageImpact,              // bps leverage improvement
    capexImpact: cfoImpact,                     // repurposed: CFO impact proxy
    segments,
    scenarios,
    summary,
  };
}

// =============================================================================
// MONTE CARLO SIMULATION
// =============================================================================

export function runMonteCarloSimulation(
  leverValues: Record<string, number>,
  levers: LeverDef[],
  baselinePL?: ScenarioBaselinePL,
  baselineRevenueM?: number,
  iterations = 3500,
): MonteCarloResults {
  const results: Record<string, number[]> = {
    revenue: [],
    operatingIncome: [],
    netIncome: [],
    operatingMargin: [],
    cashFlow: [],
  };

  const bl = baselinePL ?? SHARED_BASELINE;
  const volatilityFactor = bl.monteCarlo?.volatilityFactor ?? SHARED_BASELINE.monteCarlo.volatilityFactor;
  const dAndA = bl.dAndA ?? SHARED_BASELINE.dAndA;
  // BD annualized revenue baseline: FY2026 guidance ~$21.9B
  const baseRevM = baselineRevenueM ?? (bl.segments?.reduce((s, seg) => s + seg.revenue, 0) ?? 21900);
  const baseOIMargin = bl.monteCarlo?.baseOperatingMargin ?? SHARED_BASELINE.monteCarlo.baseOperatingMargin;
  const niConversion = bl.monteCarlo?.netIncomeConversion ?? SHARED_BASELINE.monteCarlo.netIncomeConversion;

  // Build defaults
  const defaults: Record<string, number> = { ...FALLBACK_DEFAULTS };
  levers.forEach(l => { defaults[l.id] = l.default; });

  for (let i = 0; i < iterations; i++) {
    // Perturb lever values with normally distributed noise scaled by volatility
    // Health care: moderate volatility — MBR and drug cost trend are primary uncertainty sources
    const perturbedValues: Record<string, number> = {};
    levers.forEach(lever => {
      const range = lever.max - lever.min;
      const noise = normalRandom(range * volatilityFactor * 0.10);
      const base = leverValues[lever.id] ?? defaults[lever.id] ?? (lever.min + lever.max) / 2;
      perturbedValues[lever.id] = Math.max(lever.min, Math.min(lever.max, base + noise));
    });

    const impact = calculateImpact(perturbedValues, baseRevM / 1000, baselinePL, levers);
    const simRevenue = baseRevM + impact.revenue;
    const simOI = baseRevM * baseOIMargin + impact.operatingIncome;
    const simNI = simOI * niConversion;
    const simMargin = simRevenue > 0 ? (simOI / simRevenue) * 100 : 0;
    // BD FCF = NI + D&A − capex (medical device company; capex ~$700M annually for manufacturing)
    const capexM = 700; // BD annual capex estimate ($M)
    const simFCF = simNI + dAndA - capexM;

    results.revenue.push(simRevenue);
    results.operatingIncome.push(simOI);
    results.netIncome.push(simNI);
    results.operatingMargin.push(simMargin);
    results.cashFlow.push(simFCF);
  }

  const output: MonteCarloResults = {};
  for (const [key, arr] of Object.entries(results)) {
    output[key] = computeSimulationStats(arr);
  }
  return output;
}
