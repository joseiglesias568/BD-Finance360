// =============================================================================
// Planning Engine
// Calculates P&L impact from planning lever adjustments (short-term & long-term)
// Becton, Dickinson and Company — Medical Essentials, Connected Care,
// BioPharma Systems, Interventional
// Pattern based on lib/scenario-engine.ts
// =============================================================================

export interface PlanningLever {
  id: string;
  label: string;
  category: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
  description: string;
}

export interface PLResult {
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  operatingMargin: number;
  netIncome: number;
  eps: number;
}

export interface PlanningImpact {
  baseline: PLResult;
  adjusted: PLResult;
  waterfall: { label: string; impact: number }[];
}

// =============================================================================
// SHORT-TERM LEVERS (0-6 months)
// =============================================================================

export const SHORT_TERM_LEVERS: PlanningLever[] = [
  { id: 'organic-revenue-growth', label: 'Organic Revenue Growth Rate', category: 'Revenue Drivers', min: -2, max: 8, default: 4.5, step: 0.5, unit: '%', description: 'BD consolidated organic revenue growth vs prior year, excluding FX and acquisitions/divestitures. Q2 FY26 reported 4.7% organic.' },
  { id: 'china-vobp-headwind', label: 'China VoBP Headwind ($M)', category: 'Revenue Drivers', min: 0, max: 400, default: 150, step: 25, unit: '$M', description: 'Revenue headwind from China Volume-Based Procurement rounds. Each $100M headwind ≈ -$0.35 Adj. EPS (at 16.5% tax, 282M shares).' },
  { id: 'alaris-ramp-volume', label: 'Alaris Pump Placement Rate', category: 'Revenue Drivers', min: 0, max: 200, default: 80, step: 10, unit: 'placements/quarter', description: 'BD Alaris infusion pump placements per quarter following consent decree resolution. Full ramp target: 150-200 placements/quarter by FY27.' },
  { id: 'glp1-device-growth', label: 'GLP-1 Device Revenue Growth', category: 'Revenue Drivers', min: 0, max: 40, default: 18, step: 2, unit: '%', description: 'BioPharma Systems GLP-1 prefillable syringe and auto-injector revenue growth YoY. Driven by GLP-1 drug manufacturer demand.' },
  { id: 'bd-simplify-savings', label: 'BD Simplify Cost Savings ($M)', category: 'Cost Drivers', min: 0, max: 300, default: 120, step: 20, unit: '$M', description: 'Quarterly cost savings from BD Simplify restructuring program. Target $300M+ annual run-rate savings by FY27.' },
  { id: 'fx-impact', label: 'FX Translation Impact ($M)', category: 'Market Conditions', min: -200, max: 50, default: -50, step: 25, unit: '$M', description: 'FX translation revenue impact vs. plan. ~50% of BD revenue is international; EUR and CNY are primary exposures.' },
  { id: 'interest-rate-impact', label: 'Interest Rate Shift', category: 'Market Conditions', min: -150, max: 150, default: 0, step: 25, unit: 'bps', description: 'Interest rate shift vs plan baseline. BD net debt ~$17B; each +100bps ≈ +$40M annual interest expense.' },
];

// =============================================================================
// LONG-TERM LEVERS (12-36 months)
// =============================================================================

export const LONG_TERM_LEVERS: PlanningLever[] = [
  { id: 'organic-growth-rate-lt', label: 'Long-Term Organic Revenue Growth', category: 'Growth', min: 3, max: 8, default: 5.5, step: 0.5, unit: '%', description: 'BD long-term organic revenue CAGR target. Management mid-term target: 5.5-6.5% organic growth. Driven by Medical Essentials, BioPharma Systems, and Interventional mix shift.' },
  { id: 'biopharma-glp1-cagr', label: 'BioPharma Systems GLP-1 CAGR', category: 'Growth', min: 10, max: 35, default: 20, step: 2, unit: '%', description: 'Multi-year GLP-1 device revenue CAGR for BioPharma Systems. Driven by GLP-1 drug global adoption, new delivery formats, and BD capacity expansion.' },
  { id: 'adj-operating-margin-target', label: 'Adjusted Operating Margin Target', category: 'Profitability', min: 22, max: 30, default: 25, step: 0.5, unit: '%', description: 'BD adjusted operating margin target by FY28. FY25 actual: ~25.0%. Each +1pp ≈ +$185M Adj. OI at $18.5B revenue base.' },
  { id: 'bd-simplify-target', label: 'BD Simplify Cumulative Savings', category: 'Profitability', min: 0.5, max: 1.5, default: 1.0, step: 0.1, unit: '$B cumulative savings', description: 'BD Simplify program cumulative savings target. Program targets $250-300M annual run-rate by FY27.' },
  { id: 'capex-lt', label: 'Annual CapEx', category: 'Investment', min: 0.8, max: 1.8, default: 1.2, step: 0.1, unit: '$B', description: 'Annual capital expenditure (manufacturing capacity, GLP-1 device capacity expansion, IT systems, and BD Simplify infrastructure).' },
  { id: 'net-leverage-target', label: 'Net Leverage Target', category: 'Capital Structure', min: 2.0, max: 4.0, default: 2.5, step: 0.25, unit: 'x Net Debt/EBITDA', description: 'Net leverage target. BD currently ~2.5x; management targeting <2.5x by FY27 as FCF generation accelerates.' },
  { id: 'rd-investment', label: 'R&D Investment Rate', category: 'Investment', min: 5, max: 9, default: 7, step: 0.5, unit: '% of revenue', description: 'R&D as % of revenue. BD FY25 ~6.8%. Higher R&D supports product pipeline in BioPharma Systems, Interventional devices, and digital health.' },
  { id: 'alaris-market-share-lt', label: 'Alaris Market Share Target', category: 'Investment', min: 15, max: 35, default: 25, step: 2, unit: '% US infusion market share', description: 'BD Alaris US infusion pump market share target post consent decree. Pre-2020 share was ~35%; target is 25%+ recapture by FY28.' },
];

// =============================================================================
// BASELINE P&L (next 2 quarters combined for short-term)
// =============================================================================

const SHORT_TERM_BASELINE: PLResult = {
  revenue: 9764,         // Q3 + Q4 FY26 combined estimated ($4,850M + $4,914M)
  costOfSales: 4687,     // Cost of Products Sold Q3+Q4 combined (~48% of revenue)
  grossProfit: 5077,     // Gross Profit Q3+Q4
  operatingExpenses: 3420, // R&D + SG&A Q3+Q4 combined
  operatingIncome: 2550, // Adj. OI Q3+Q4 combined (~26.1% margin)
  operatingMargin: 26.1,
  netIncome: 1820,       // After interest and 16.5% tax
  eps: 6.46,             // Adj. EPS Q3+Q4 combined ($3.20+$3.26)
};

const ANNUAL_BASELINE: PLResult = {
  revenue: 19200,        // FY26 full year estimated
  costOfSales: 9216,     // ~48% of revenue
  grossProfit: 9984,     // ~52% gross margin
  operatingExpenses: 6720, // R&D + SG&A
  operatingIncome: 4800, // ~25% adj. operating margin
  operatingMargin: 25.0,
  netIncome: 3640,       // After ~$600M interest, 16.5% tax
  eps: 12.90,            // Adj. EPS FY26 estimated
};

// =============================================================================
// SHORT-TERM IMPACT CALCULATION
// =============================================================================

export function calculateShortTermImpact(leverValues: Record<string, number>): PlanningImpact {
  const b = { ...SHORT_TERM_BASELINE };
  const waterfall: { label: string; impact: number }[] = [];

  // Organic revenue growth: delta vs 4.5% plan baseline over 2-quarter horizon
  const organicGrowthDelta = (leverValues['organic-revenue-growth'] ?? 4.5) - 4.5; // delta vs plan
  const organicRevenueImpact = b.revenue * organicGrowthDelta / 100;
  const organicAoiImpact = organicRevenueImpact * 0.25; // ~25% incremental margin
  if (Math.abs(organicRevenueImpact) > 50) waterfall.push({ label: 'Organic Revenue Growth', impact: Math.round(organicAoiImpact) });

  // China VoBP headwind: each $100M headwind ≈ -$25M AOI (25% margin)
  const chinaVobpDelta = (leverValues['china-vobp-headwind'] ?? 150) - 150; // delta vs plan
  const chinaAoiImpact = -chinaVobpDelta * 0.25;
  if (Math.abs(chinaAoiImpact) > 20) waterfall.push({ label: 'China VoBP Headwind', impact: Math.round(chinaAoiImpact) });

  // Alaris ramp volume: each 10 placements/quarter above 80 base ≈ +$8M revenue / +$2.5M AOI
  const alarisPlacementDelta = (leverValues['alaris-ramp-volume'] ?? 80) - 80;
  const alarisRevImpact = alarisPlacementDelta * 0.8; // ~$0.8M revenue per incremental placement
  const alarisAoiImpact = alarisRevImpact * 0.30; // ~30% margin on Alaris placements
  if (Math.abs(alarisAoiImpact) > 10) waterfall.push({ label: 'Alaris Placement Volume', impact: Math.round(alarisAoiImpact) });

  // GLP-1 device revenue growth: BioPharma Systems is ~18% of revenue; GLP-1 ~40% of BioPharma
  const glp1GrowthDelta = (leverValues['glp1-device-growth'] ?? 18) - 18; // delta vs plan
  const bioPharmaRevenue = b.revenue * 0.18;
  const glp1RevImpact = bioPharmaRevenue * 0.40 * glp1GrowthDelta / 100;
  const glp1AoiImpact = glp1RevImpact * 0.35; // ~35% margin on incremental GLP-1 devices
  if (Math.abs(glp1AoiImpact) > 20) waterfall.push({ label: 'GLP-1 Device Revenue', impact: Math.round(glp1AoiImpact) });

  // BD Simplify savings (direct cost reduction — favorable)
  const simplifyDelta = (leverValues['bd-simplify-savings'] ?? 120) - 120; // delta vs plan ($M)
  if (Math.abs(simplifyDelta) > 10) waterfall.push({ label: 'BD Simplify Savings', impact: Math.round(simplifyDelta) });

  // FX translation impact (direct revenue/OI impact)
  const fxDelta = (leverValues['fx-impact'] ?? -50) - (-50); // delta vs plan ($M)
  const fxAoiImpact = fxDelta * 0.25; // ~25% OI margin on incremental FX revenue
  if (Math.abs(fxAoiImpact) > 10) waterfall.push({ label: 'FX Translation Impact', impact: Math.round(fxAoiImpact) });

  // Interest rate: each +100bps ≈ +$40M annual interest / +$20M for 2 quarters
  const rateShift = (leverValues['interest-rate-impact'] ?? 0) / 100;
  const rateAoiImpact = rateShift * -40 * 0.5; // $M, 2-quarter horizon
  if (Math.abs(rateAoiImpact) > 5) waterfall.push({ label: 'Interest Rate Effect', impact: Math.round(rateAoiImpact) });

  // Aggregate AOI impact
  const totalAoiImpact = organicAoiImpact + chinaAoiImpact + alarisAoiImpact
    + glp1AoiImpact + simplifyDelta + fxAoiImpact + rateAoiImpact;
  const totalRevenueImpact = organicRevenueImpact - chinaVobpDelta + alarisRevImpact + glp1RevImpact + fxDelta;
  const totalCostImpact = -(simplifyDelta);

  const adjRevenue = b.revenue + totalRevenueImpact;
  const adjCOGS = b.costOfSales + totalCostImpact;
  const adjGrossProfit = adjRevenue - adjCOGS;
  const adjOpEx = b.operatingExpenses; // R&D and SG&A don't scale linearly with revenue in short term
  const adjOI = b.operatingIncome + totalAoiImpact;
  const adjMargin = adjRevenue > 0 ? (adjOI / adjRevenue) * 100 : 0;
  // Net Income = (AOI - ~$300M interest for 2 quarters) × (1 - 16.5%)
  const interestQ3Q4 = 300; // Q3+Q4 FY26 interest ~$300M
  const adjNI = Math.round((adjOI - interestQ3Q4) * (1 - 0.165));
  const adjEPS = parseFloat((adjNI / 282).toFixed(2)); // ~282M shares

  return {
    baseline: b,
    adjusted: {
      revenue: Math.round(adjRevenue),
      costOfSales: Math.round(adjCOGS),
      grossProfit: Math.round(adjGrossProfit),
      operatingExpenses: adjOpEx,
      operatingIncome: Math.round(adjOI),
      operatingMargin: parseFloat(adjMargin.toFixed(1)),
      netIncome: adjNI,
      eps: adjEPS,
    },
    waterfall,
  };
}

// =============================================================================
// LONG-TERM PROJECTION
// =============================================================================

export interface LongTermProjection {
  years: { year: string; conservative: PLResult; base: PLResult; optimistic: PLResult }[];
  cagr: { metric: string; value: number }[];
}

export function calculateLongTermProjection(leverValues: Record<string, number>): LongTermProjection {
  const organicGrowthRate = (leverValues['organic-growth-rate-lt'] ?? 5.5) / 100;
  const glp1Cagr = (leverValues['biopharma-glp1-cagr'] ?? 20) / 100;
  const adjOiMarginTarget = (leverValues['adj-operating-margin-target'] ?? 25) / 100;
  const bdSimplifyTarget = leverValues['bd-simplify-target'] ?? 1.0; // $B cumulative savings
  const rdRate = (leverValues['rd-investment'] ?? 7) / 100;

  const baseRevenue = 19200; // FY26 full year estimated ($M)
  const baseSGA = 3170;      // FY26 annual SG&A baseline ($M)
  const baseAOI = 4800;      // FY26 annual AOI baseline ($M)
  const annualInterest = 600; // FY26 annual interest expense ($M)
  const dilutedShares = 282;  // FY26 diluted shares (M)

  const years: LongTermProjection['years'] = [];

  // Project 3 years: FY26 (base), FY27, FY28
  for (let y = 0; y < 3; y++) {
    const yearLabel = `FY${26 + y}`;

    const buildPL = (revMultiplier: number): PLResult => {
      // Revenue: organic growth + BioPharma Systems GLP-1 acceleration
      const organicRev = baseRevenue * Math.pow(1 + organicGrowthRate, y);
      // BioPharma Systems GLP-1 grows faster than organic (~18% of revenue, GLP-1 ~40% of BioPharma)
      const glp1Lift = baseRevenue * 0.18 * 0.40 * (Math.pow(1 + glp1Cagr, y) - Math.pow(1 + organicGrowthRate, y));
      const rev = Math.round((organicRev + glp1Lift) * revMultiplier);

      // COGS: ~48% of revenue, improving with BD Simplify manufacturing savings
      const cogsRate = 0.480 - (y * 0.006); // gradual margin improvement
      const cos = Math.round(rev * cogsRate);
      const gp = rev - cos;

      // R&D: grows with revenue at target rate
      const rdVal = Math.round(rev * rdRate);

      // SG&A: declining with BD Simplify cumulative savings
      const annualSavings = Math.min(bdSimplifyTarget * 1000 * (y / 2), bdSimplifyTarget * 1000);
      const sga = Math.round(baseSGA - annualSavings + rev * 0.001); // slight volume-driven growth offset
      const opex = rdVal + sga;
      const oi = gp - opex;
      const margin = rev > 0 ? parseFloat(((oi / rev) * 100).toFixed(1)) : 0;

      // Stretch towards target operating margin
      const targetOI = Math.round(rev * adjOiMarginTarget);
      const blendedOI = Math.round(oi + (targetOI - oi) * Math.min(y * 0.4, 1.0));

      // Net income: (AOI - interest declining with leverage) × (1 - 16.5%)
      const interest = Math.round(annualInterest * (1 - y * 0.05)); // ~5%/yr reduction
      const ni = Math.round((blendedOI - interest) * (1 - 0.165));
      const eps = parseFloat((ni / dilutedShares).toFixed(2));

      return { revenue: rev, costOfSales: cos, grossProfit: gp, operatingExpenses: opex, operatingIncome: blendedOI, operatingMargin: margin, netIncome: ni, eps };
    };

    years.push({
      year: yearLabel,
      conservative: buildPL(0.97),
      base: buildPL(1.0),
      optimistic: buildPL(1.04),
    });
  }

  // Calculate CAGRs
  const fy26Rev = years[0].base.revenue;
  const fy28Rev = years[2].base.revenue;
  const revCAGR = fy26Rev > 0 ? (Math.pow(fy28Rev / fy26Rev, 1 / 2) - 1) * 100 : 0;

  const fy26OI = years[0].base.operatingIncome;
  const fy28OI = years[2].base.operatingIncome;
  const oiCAGR = fy26OI > 0 ? (Math.pow(fy28OI / fy26OI, 1 / 2) - 1) * 100 : 0;

  const fy26EPS = years[0].base.eps;
  const fy28EPS = years[2].base.eps;
  const epsCAGR = fy26EPS > 0 ? (Math.pow(fy28EPS / fy26EPS, 1 / 2) - 1) * 100 : 0;

  return {
    years,
    cagr: [
      { metric: 'Revenue', value: parseFloat(revCAGR.toFixed(1)) },
      { metric: 'Adjusted Operating Income', value: parseFloat(oiCAGR.toFixed(1)) },
      { metric: 'Adjusted EPS', value: parseFloat(epsCAGR.toFixed(1)) },
    ],
  };
}
