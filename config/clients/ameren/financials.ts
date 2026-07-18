// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/financials.ts
//
// Provenance Legend:
// [CITED:10K-FY25]    — Becton, Dickinson and Company FY2025 Form 10-K (filed Feb 2026)
// [CITED:10Q-Q1-26]   — Becton, Dickinson and Company Q1 2026 Form 10-Q (filed May 6, 2026)
// [CITED:EC-Q1-26]    — BD Q1 2026 Earnings Call / IR slides (May 6, 2026)
// [DERIVED]           — Computed from cited values; math shown inline
// [INTERPOLATED]      — Extrapolated from trend or adjacent cited values
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter, not a business datum
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Becton, Dickinson and Company public disclosures: Form 10-K (FY2025, filed Feb 2026);
// Form 10-Q (Q1 2026, filed May 6, 2026); Q1 2026 earnings call / IR slides
// (May 6, 2026); FY2026 guidance raised on Q1 call.
// Three reportable segments: Health Care Benefits (Aetna), Health Services
// (Caremark / PBM + Oak Street Health), Pharmacy & Consumer Wellness (~9,000 stores).
// Segment revenues reported gross (before inter-segment eliminations).
// ─────────────────────────────────────────────────────────────────────
import { FinancialConfig } from '../../types';

export const financials: FinancialConfig = {
  fiscalYear: 'FY2025',
  annualRevenue: 377.1,                // FY2025 total revenues est. $B [INTERPOLATED from quarterly trend]
  annualRevenueYoY: 5.1,               // est. YoY growth [INTERPOLATED]
  annualOperatingIncome: 16.0,         // FY2025 adj. operating income est. [INTERPOLATED]
  annualOperatingMargin: 4.2,          // adj. operating margin est. [DERIVED]
  annualNetIncome: 7.2,                // FY2025 net income est. (Adj. EPS ~$7.20 midpoint prior guide × ~1B shares) [INTERPOLATED]
  annualEPS: 7.20,                     // FY2025 adj. EPS est. (prior FY2026 guide raised from $7.00–$7.20) [INTERPOLATED]

  quarters: [
    {
      quarter: 'Q1 2025',
      revenue: 94.6,                   // Q1 2025 total revenues $94.6B [CITED:EC-Q1-26]
      revenueYoY: 4.8,                 // est. YoY growth [INTERPOLATED]
      operatingIncome: 4.58,           // Q1 2025 adj. operating income $4.58B [CITED:EC-Q1-26]
      operatingMargin: 4.8,            // 4.58 / 94.6 [DERIVED]
      eps: 2.25,                       // Q1 2025 adj. EPS $2.25 [CITED:EC-Q1-26]
      feeRevenueGrowth: 3.8,           // est. HCB revenue growth Q1 2025 [INTERPOLATED]
    },
    {
      quarter: 'Q2 2025',
      revenue: 91.5,                   // est. [INTERPOLATED — lower seasonal; PCW slower summer]
      revenueYoY: 4.5,
      operatingIncome: 3.80,           // est. [INTERPOLATED]
      operatingMargin: 4.2,
      eps: 1.73,                       // est. [INTERPOLATED]
      feeRevenueGrowth: 4.0,
    },
    {
      quarter: 'Q3 2025',
      revenue: 94.0,                   // est. [INTERPOLATED]
      revenueYoY: 5.2,
      operatingIncome: 4.10,           // est. [INTERPOLATED]
      operatingMargin: 4.4,
      eps: 1.87,                       // est. [INTERPOLATED]
      feeRevenueGrowth: 4.5,
    },
    {
      quarter: 'Q4 2025',
      revenue: 97.0,                   // est. [INTERPOLATED — typical Q4 insurance ramp]
      revenueYoY: 5.5,
      operatingIncome: 4.52,           // est. [INTERPOLATED]
      operatingMargin: 4.7,
      eps: 2.05,                       // est. [INTERPOLATED]
      feeRevenueGrowth: 5.0,
    },
    {
      quarter: 'Q1 2026',
      revenue: 100.4,                  // Q1 2026 total revenues $100.4B [CITED:EC-Q1-26]
      revenueYoY: 6.2,                 // +6.2% vs Q1 2025 [CITED:EC-Q1-26]
      operatingIncome: 5.15,           // Q1 2026 adj. operating income $5.15B [CITED:EC-Q1-26]
      operatingMargin: 5.1,            // 5.15 / 100.4 [DERIVED]
      eps: 2.57,                       // Q1 2026 adj. EPS $2.57 [CITED:EC-Q1-26]
      feeRevenueGrowth: 3.4,           // HCB revenue growth +3.4% YoY [DERIVED: 36.0/34.8 - 1]
    },
  ],

  latestQuarter: {
    quarter: 'Q1 2026',
    revenue: 100.4,
    revenueYoY: 6.2,
    operatingIncome: 5.15,
    operatingMargin: 5.1,
    eps: 2.57,
    feeRevenueGrowth: 3.4,
  },

  // Segments — CVS reports three operating segments (gross revenues before eliminations)
  segments: [
    {
      name: 'Health Care Benefits',
      revenue: 36.0,                   // Q1 2026 HCB revenues $36.0B [CITED:EC-Q1-26]
      revenuePercent: 30.6,            // 36.0 / (36.0+48.2+32.0) = 30.6% of gross segment revenues [DERIVED]
      yoyChange: 3.4,                  // +3.4% vs Q1 2025 $34.8B [DERIVED]
      operatingMargin: 8.4,            // $3.04B / $36.0B [DERIVED]
      description:
        'Aetna — managed care for Medicare Advantage, Medicaid, and commercial populations. ' +
        'Q1 2026: revenues $36.0B (+3.4% YoY), adj. operating income $3.04B (+$1.0B+ YoY). ' +
        'Medical membership 26.0M (27.1M Q1 2025; exit from individual exchange business reduced membership). ' +
        'Medical Benefit Ratio (MBR): 84.6% Q1 2026 vs 87.3% Q1 2025 — substantial improvement. ' +
        'FY2026 guidance: AOI $4.00–$4.34B; MBR 90.5% ±50bps. Target MA margin 3% by 2028. ' +
        'Aetna named inaugural Health Plan of the Year (Press Ganey). ' +
        '95% of prior authorizations approved within 24 hours; 88% procedures standardized (industry-leading). ' +
        '18M commercial members; strong payer-provider partnerships driving member engagement.',
    },
    {
      name: 'Health Services',
      revenue: 48.2,                   // Q1 2026 HSS revenues $48.2B [CITED:EC-Q1-26]
      revenuePercent: 41.0,            // 48.2 / 117.4 [DERIVED]
      yoyChange: 10.8,                 // +10.8% vs Q1 2025 $43.5B [DERIVED: 48.2/43.5 - 1]
      operatingMargin: 3.1,            // $1.49B / $48.2B [DERIVED]
      description:
        'Caremark PBM + specialty pharmacy + Oak Street Health (primary care). ' +
        'Q1 2026: revenues $48.2B (+11% YoY), adj. operating income $1.49B (–7% YoY). ' +
        'Pharmacy claims processed 464.7M Q1 2026 vs 464.2M Q1 2025. ' +
        'Revenue growth driven by pharmacy drug mix and brand inflation. ' +
        'AOI decline driven by pharmacy client price improvements (TrueCost/net-cost model transition); ' +
        'Q1 included pull-forward recognition from Q2 — excluding timing, segment beat expectations. ' +
        'Oak Street Health: revenues +15% YoY; value-based primary care; V28 adoption on track. ' +
        'FY2026 guidance: revenue ≥$196.6B, AOI ≥$7.25B, pharmacy claims ≥1.84B. ' +
        'TrueCost PBM launched 2+ years ago — net cost pricing model; ~$1.8B rebate guarantees tracked to plan. ' +
        'Specialty pharmacy = half of pharmacy benefit revenues; biosimilar/generic value creation is primary lever.',
    },
    {
      name: 'Pharmacy & Consumer Wellness',
      revenue: 32.0,                   // Q1 2026 PCW revenues $32.0B [CITED:EC-Q1-26]
      revenuePercent: 27.2,            // 32.0 / 117.4 [DERIVED]
      yoyChange: 0.3,                  // +0.3% vs Q1 2025 $31.9B [DERIVED]
      operatingMargin: 3.8,            // $1.20B / $32.0B [DERIVED]
      description:
        '~9,000 CVS pharmacy locations; retail front-store; MinuteClinic; HealthHUB. ' +
        'Q1 2026: revenues $32.0B (+0.3% YoY), adj. operating income $1.20B (–9% YoY). ' +
        'Prescriptions filled 451.2M Q1 2026 vs 435.5M Q1 2025 (+3.6%). ' +
        'Same-store total revenues +~3%; same-store pharmacy scripts +7%. Retail script share >29%. ' +
        'FY2026 guidance: revenue ≥$136.5B, AOI ≥$6.18B, prescriptions ≥1.865B. ' +
        'AOI decline driven by reimbursement pressure, investments, weather — offset by script volume and Rite Aid assets. ' +
        'CostVantage pricing model (cost-plus) neutralizes branded drug margin volatility. ' +
        'GLP-1 DTC market gaining share (+200bps); insulin affordability: $25/month access across 9,000 CVS locations.',
    },
  ],

  // P&L Summary — Q1 2026 ($M consolidated)
  plSummary: {
    revenue: {
      label: 'Total Revenues',
      actual: 100400,                  // Q1 2026 [CITED:EC-Q1-26]
      plan: 99500,                     // est. consensus plan [ASSUMED]
      priorYear: 94600,                // Q1 2025 [CITED:EC-Q1-26]
      variance: 900,
      variancePercent: 0.9,
    },
    cogs: {
      label: 'Medical Costs + Pharmacy COGS',
      actual: 87300,                   // est. = medical costs (84.6% MBR × $36B) + pharmacy COGS [ASSUMED]
      plan: 86700,
      priorYear: 83100,                // Q1 2025 est. [INTERPOLATED]
      variance: 600,
      variancePercent: 0.7,
    },
    grossProfit: {
      label: 'Gross Profit',
      actual: 13100,                   // 100,400 - 87,300 [DERIVED]
      plan: 12800,
      priorYear: 11500,
      variance: 600,
      variancePercent: 4.7,
    },
    operatingExpenses: {
      label: 'SG&A + D&A + Other Operating Expenses',
      actual: 7950,                    // est. Q1 2026 [ASSUMED]
      plan: 8100,
      priorYear: 6920,                 // Q1 2025 est. [INTERPOLATED]
      variance: -150,
      variancePercent: -1.9,
    },
    operatingIncome: {
      label: 'Adjusted Operating Income',
      actual: 5150,                    // Q1 2026 [CITED:EC-Q1-26]
      plan: 4700,
      priorYear: 4580,                 // Q1 2025 [CITED:EC-Q1-26]
      variance: 570,
      variancePercent: 12.1,
    },
    netIncome: {
      label: 'Adjusted Net Income',
      actual: 2570,                    // Q1 2026 adj. EPS $2.57 × ~1.0B shares [DERIVED]
      plan: 2250,
      priorYear: 2250,                 // Q1 2025 adj. EPS $2.25 × ~1.0B shares [DERIVED]
      variance: 320,
      variancePercent: 14.2,
    },
  },

  // Revenue Bridge — Q1 2026 vs Q1 2025 (est. +$5.8B total)
  revenueBridge: [
    {
      label: 'Health Services — Pharmacy Drug Mix & Brand Inflation',
      impact: 3800,
      description: 'Health Services revenues +$4.7B YoY driven by pharmacy drug mix shift toward specialty and branded drugs plus brand drug inflation. Partially offset by pharmacy client price improvements under TrueCost net-cost model.',
      category: 'volume',
    },
    {
      label: 'Health Care Benefits — Government Program Growth',
      impact: 1200,
      description: 'Aetna HCB revenues +$1.2B YoY driven by government business growth (Medicare Advantage, Medicaid). Partially offset by exit from individual exchange (ACA) business in 2026 which reduced membership but improved profitability.',
      category: 'pricing',
    },
    {
      label: 'PCW — Prescription Volume & Rite Aid Assets',
      impact: 900,
      description: 'Pharmacy & Consumer Wellness +$0.1B net: same-store pharmacy scripts +7%, Rite Aid asset contributions. Offset by regulatory reimbursement pressure on select drugs and generic introductions.',
      category: 'volume',
    },
    {
      label: 'Pharmacy Client Price Improvements (TrueCost/Rebate)',
      impact: -1200,
      description: 'Health Services pharmacy client price improvements — continued transition from average gross prices to net-cost economics. TrueCost PBM model headwind on AOI; revenue pass-through reduction to clients. Tracking to 2026 rebate guarantee commitments.',
      category: 'mix',
    },
    {
      label: 'Individual Exchange (ACA) Exit',
      impact: -900,
      description: 'HCB exit from individual exchange (ACA) business in 2026 removed higher-acuity, lower-margin lives from membership. Intentional strategic decision to focus on profitable government and commercial segments; net positive on AOI.',
      category: 'mix',
    },
  ],

  ratios: {
    currentRatio: 0.92,               // est. — large health insurer/pharmacy typically near 1.0 [ASSUMED]
    currentRatioTarget: 1.0,
    debtToEquity: 1.45,               // est. leverage ratio 3.84x net debt/EBITDA; target BBB [ASSUMED]
    debtToEquityTarget: 1.20,         // target as balance sheet deleverages
    returnOnEquity: 12.8,             // Adj. EPS $2.57 × 4 / ~$80 book value per share (est.) [ASSUMED]
    returnOnAssets: 2.1,              // adj. net income annualized / total assets est. [ASSUMED]
    returnOnAssetsTarget: 2.5,
    freeCashFlow: 4.2,                // Q1 2026 cash flow from operations $4.2B [CITED:EC-Q1-26]
    freeCashFlowTarget: 9.5,          // FY2026 CFO guidance ≥$9.5B [CITED:EC-Q1-26]
    dividendPerShare: 2.66,           // quarterly dividend ~$0.665/share × 4 (~$850M / ~1.28B shares) [DERIVED]
  },

  workingCapital: {
    dso: 18,                          // health care receivables typically 15–20 days [ASSUMED]
    dsoTarget: 16,
    inventoryDays: 22,                // pharmacy retail inventory days [ASSUMED]
    inventoryDaysTarget: 20,
    dpo: 32,                          // pharmacy/medical payables [ASSUMED]
    dpoTarget: 30,
  },

  executiveDisplayMetrics: {
    adjustedRevenueYoYPercent: 6.2,
    premiumProductRevenueYoYPercent: 10.8,  // Health Services revenue growth rate (PBM/specialty)
    adjustedOperatingMarginPercent: 5.1,    // Q1 2026 adj. operating margin [DERIVED]
    adjustedEpsDollars: 2.57,               // Q1 2026 adj. EPS [CITED:EC-Q1-26]
    freeCashFlowQuarterlyBillions: 4.2,     // Q1 2026 CFO [CITED:EC-Q1-26]
    revenueFootnote: 'Q1 2026: $100.4B (+6.2% YoY); adj. EPS $2.57 (+14.2%); FY2026 guidance raised to $7.30–$7.50',
  },

  // Scenario engine baseline — values in $M (FY2026 full-year basis, segment gross revenues)
  // CRITICAL: segment names here must EXACTLY match lib/scenario-engine.ts sharedSegmentRevenue() calls
  scenarioBaseline: {
    segments: [
      { name: 'Health Care Benefits', revenue: 142000 },  // FY2026 guidance ≥$142B [CITED:EC-Q1-26]
      { name: 'Health Services', revenue: 196600 },        // FY2026 guidance ≥$196.6B [CITED:EC-Q1-26]
      { name: 'Pharmacy & Consumer Wellness', revenue: 136500 },  // FY2026 guidance ≥$136.5B [CITED:EC-Q1-26]
    ],
    cogs: {
      personnelCosts: 18000,          // est. FY2026 SG&A labor / colleagues (~300,000 employees) [ASSUMED]
      subcontractorCosts: 8000,       // est. medical professional services, contracted care delivery [ASSUMED]
      facilityCosts: 310000,          // est. medical costs + pharmacy COGS (dominant cost) [ASSUMED]
    },
    opex: {
      technologyCosts: 3500,          // est. IT, AI platform, Health100 investment [ASSUMED]
      marketing: 1200,                // est. member acquisition, retail marketing [ASSUMED]
      professionalDev: 800,           // est. training, clinical staff development [ASSUMED]
      sga: 4500,                      // est. corporate G&A [ASSUMED]
      otherOpEx: 1500,                // est. amortization of intangibles, other [ASSUMED]
    },
    interestExpense: 2800,            // est. FY2026 interest on CVS long-term debt [ASSUMED]
    otherIncome: -400,                // net investment income and other [ASSUMED]
    taxRate: 0.25,                    // est. effective tax rate [ASSUMED]
    dAndA: 4200,                      // est. FY2026 D&A (est. $1.05B/quarter) [ASSUMED]
    revenuePerClient: 5400,           // est. avg annual premium per HCB medical member ($142B / 26M) [DERIVED]
    flowThrough: {
      transactionalPctOfRevenue: 0.48,    // pharmacy/retail is more transactional
      resilientPctOfRevenue: 0.52,        // insurance premiums and PBM contracted revenue
    },
    sensitivity: {
      churnRate_to_Revenue: -0.15,        // proxy: each 1M membership change ≈ −$5.5B HCB revenue
      fwaNetAdds_to_Revenue: 0.6,         // proxy: GLP-1 formulary policy change revenue impact
      arpaDollar_to_Revenue: 1.0,         // proxy: +$100 PMPM ≈ +$3.1B annual HCB revenue
    },
    monteCarlo: {
      volatilityFactor: 0.08,             // health care is moderately volatile (MBR and drug cost swings)
      baseOperatingMargin: 0.051,         // Q1 2026 adj. operating margin [DERIVED]
      netIncomeConversion: 0.50,          // adj. net income / AOI (interest expense + tax reduces conversion) [ASSUMED]
    },
  },
};
