// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/financials.ts
//
// Provenance Legend:
// [CITED:10K-FY25]    — Baker Hughes FY2025 Form 10-K (filed Feb 2026)
// [CITED:10Q-Q1-26]   — Baker Hughes Q1 2026 Form 10-Q (filed Apr 2026)
// [CITED:EC-Q1-26]    — Baker Hughes Q1 2026 earnings call transcript (Apr 24, 2026)
// [DERIVED]           — Computed from cited values; math shown inline
// [INTERPOLATED]      — Extrapolated from trend or adjacent cited values
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter, not a business datum
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Baker Hughes Company public disclosures: Form 10-K (FY2025, filed Feb
// 2026); Form 10-Q (Q1 2026, filed Apr 24, 2026); Q1 2026 earnings call
// transcript (Apr 24, 2026); FY2026 guidance issued April 2026.
// Two segments: OFSE (Oilfield Services & Equipment) and
// IET (Industrial & Energy Technology).
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { FinancialConfig } from '../../types';

export const financials: FinancialConfig = {
  fiscalYear: 'FY2025',
  annualRevenue: 116.4,               // FY2025 total revenue est. ~$116.4B [INTERPOLATED from Q1 run-rate × 4 adj.]
  annualRevenueYoY: 4.2,              // FY2025 revenue growth est. [INTERPOLATED]
  annualOperatingIncome: 8.8,         // FY2025 GAAP operating income est. [ASSUMED]
  annualOperatingMargin: 7.6,         // est.
  annualNetIncome: 3.2,               // FY2025 net income attributable to BKR est. [ASSUMED]
  annualEPS: 3.20,                    // FY2025 EPS est. [ASSUMED]

  quarters: [
    {
      quarter: 'Q1 2025',
      revenue: 6.427,                 // Q1 2025 total revenue $6,427M [CITED:10Q-Q1-26]
      revenueYoY: 4.5,                // est. YoY growth [INTERPOLATED]
      operatingIncome: 0.56,          // Q1 2025 GAAP pre-tax income $561M [CITED:10Q-Q1-26]
      operatingMargin: 8.7,
      eps: 0.40,                      // Q1 2025 diluted EPS $0.40 [CITED:10Q-Q1-26]
      feeRevenueGrowth: 17.1,         // IET segment EBITDA margin Q1 2025 [CITED:10Q-Q1-26]
    },
    {
      quarter: 'Q2 2025',
      revenue: 6.9,                   // est. [INTERPOLATED]
      revenueYoY: 5.0,
      operatingIncome: 0.65,
      operatingMargin: 9.4,
      eps: 0.52,                      // est. [INTERPOLATED]
      feeRevenueGrowth: 18.0,
    },
    {
      quarter: 'Q3 2025',
      revenue: 7.1,                   // est. [INTERPOLATED]
      revenueYoY: 5.5,
      operatingIncome: 0.70,
      operatingMargin: 9.9,
      eps: 0.54,                      // est. [INTERPOLATED]
      feeRevenueGrowth: 18.5,
    },
    {
      quarter: 'Q4 2025',
      revenue: 7.2,                   // est. [INTERPOLATED]
      revenueYoY: 6.0,
      operatingIncome: 0.75,
      operatingMargin: 10.4,
      eps: 0.58,                      // est. [INTERPOLATED]
      feeRevenueGrowth: 19.2,
    },
    {
      quarter: 'Q1 2026',
      revenue: 6.587,                 // Q1 2026 total revenue $6,587M [CITED:10Q-Q1-26]
      revenueYoY: 2.5,                // +2.5% vs Q1 2025 ($6,427M) [DERIVED]
      operatingIncome: 1.274,         // Q1 2026 GAAP income before taxes $1,274M [CITED:10Q-Q1-26]
      operatingMargin: 19.3,          // 1,274 / 6,587 [DERIVED] — elevated due to $721M gain on dispositions
      eps: 0.93,                      // Q1 2026 diluted EPS $0.93 [CITED:10Q-Q1-26]
      feeRevenueGrowth: 20.2,         // IET segment EBITDA margin Q1 2026 [CITED:10Q-Q1-26]
    },
  ],

  latestQuarter: {
    quarter: 'Q1 2026',
    revenue: 6.587,
    revenueYoY: 2.5,
    operatingIncome: 1.274,
    operatingMargin: 19.3,
    eps: 0.93,
    feeRevenueGrowth: 20.2,
  },

  // Segments — Baker Hughes reports two segments: OFSE and IET
  segments: [
    {
      name: 'Oilfield Services & Equipment (OFSE)',
      revenue: 3.237,                 // Q1 2026 OFSE revenue $3,237M [CITED:10Q-Q1-26]
      revenuePercent: 49.1,           // 3,237 / 6,587 [DERIVED]
      yoyChange: -7.5,                // vs Q1 2025 $3,499M [DERIVED]
      operatingMargin: 17.5,          // OFSE segment EBITDA margin 565/3237 [DERIVED]
      description:
        'Products and services for onshore and offshore oilfield operations across the full well lifecycle. ' +
        'Four product lines: Well Construction, Completions/Intervention/Measurements (CIM), ' +
        'Production Solutions, and Subsea & Surface Pressure Systems (SSPS). ' +
        'Q1 2026 revenue -7% YoY driven by SPC JV disposition and Middle East disruptions. ' +
        'Segment EBITDA $565M (17.5% margin). Geographic mix: Middle East/Asia 36%, N. America 29%.',
    },
    {
      name: 'Industrial & Energy Technology (IET)',
      revenue: 3.350,                 // Q1 2026 IET revenue $3,350M [CITED:10Q-Q1-26]
      revenuePercent: 50.9,           // 3,350 / 6,587 [DERIVED]
      yoyChange: 14.4,                // vs Q1 2025 $2,928M (+$422M) [DERIVED]
      operatingMargin: 20.2,          // IET segment EBITDA margin 678/3350 [DERIVED]
      description:
        'Technology solutions for mechanical-drive, compression, and power-generation across energy and industrial markets. ' +
        'Five product lines: Gas Technology Equipment (GTE), Gas Technology Services (GTS), ' +
        'Industrial Products, Industrial Solutions, and Climate Technology Solutions (CTS). ' +
        'Q1 2026 revenue +14% YoY driven by GTE (+14%) and GTS (+34%). ' +
        'Segment EBITDA $678M (20.2% margin). IET RPO $33.1B (record). Book-to-bill 1.46x.',
    },
  ],

  // P&L Summary — Q1 2026 ($M)
  plSummary: {
    revenue: {
      label: 'Total Revenue',
      actual: 6587,                   // [CITED:10Q-Q1-26]
      plan: 6500,                     // est. internal plan
      priorYear: 6427,                // Q1 2025 [CITED:10Q-Q1-26]
      variance: 160,
      variancePercent: 2.5,
    },
    cogs: {
      label: 'Cost of Goods & Services Sold',
      actual: 5083,                   // COGS goods $3,431M + services $1,652M [CITED:10Q-Q1-26]
      plan: 5050,
      priorYear: 4952,                // $3,329M + $1,623M Q1 2025 [CITED:10Q-Q1-26]
      variance: -131,
      variancePercent: -2.6,
    },
    grossProfit: {
      label: 'Gross Profit',
      actual: 1504,                   // 6587 - 5083 [DERIVED]
      plan: 1450,
      priorYear: 1475,
      variance: 29,
      variancePercent: 2.0,
    },
    operatingExpenses: {
      label: 'SG&A + R&D',
      actual: 695,                    // SG&A $562M + R&D $133M [CITED:10Q-Q1-26]
      plan: 710,
      priorYear: 723,                 // $577M + $146M Q1 2025 [CITED:10Q-Q1-26]
      variance: 15,
      variancePercent: 2.1,
    },
    operatingIncome: {
      label: 'Adjusted EBITDA (Segment)',
      actual: 1160,                   // Q1 2026 Adj. EBITDA $1,160M [CITED:EC-Q1-26]
      plan: 1100,
      priorYear: 1030,                // Q1 2025 Adj. EBITDA est. [INTERPOLATED]
      variance: 130,
      variancePercent: 12.6,
    },
    netIncome: {
      label: 'Net Income Attributable to Baker Hughes',
      actual: 930,                    // Q1 2026 [CITED:10Q-Q1-26]
      plan: 450,                      // est. (before $721M disposition gain)
      priorYear: 402,                 // Q1 2025 [CITED:10Q-Q1-26]
      variance: 528,
      variancePercent: 131.3,         // elevated by $721M gain on PSI + SPC dispositions
    },
  },

  // Revenue Bridge — Q1 2026 vs Q1 2025 (+$160M total)
  revenueBridge: [
    {
      label: 'IET Gas Technology Growth',
      impact: 409,
      description: 'GTE +$210M (+14%) and GTS +$199M (+34%) driven by LNG equipment deliveries and long-term service agreement revenue. Strong global LNG infrastructure buildout.',
      category: 'volume',
    },
    {
      label: 'IET Climate Technology Solutions',
      impact: 40,
      description: 'CTS revenue +$40M (+22%) as data center power, CCUS, and hydrogen project revenues ramp. Fastest-growing IET sub-segment by percentage.',
      category: 'pricing',
    },
    {
      label: 'OFSE Production Solutions & Well Construction',
      impact: -50,
      description: 'Well Construction -$48M (-5%) and CIM -$42M (-5%) from Middle East activity disruptions and North America rig count decline (-7% YoY).',
      category: 'volume',
    },
    {
      label: 'SSPS — SPC Divestiture Impact',
      impact: -170,
      description: 'Surface Pressure Control (SPC) business contributed to Cactus JV (closed Q1 2026). Structural revenue reduction of ~$170M per quarter going forward.',
      category: 'mix',
    },
    {
      label: 'IET Industrial Products Growth',
      impact: 46,
      description: 'Industrial Products +$46M (+10%) driven by pumps, valves, and compression equipment for industrial markets.',
      category: 'volume',
    },
    {
      label: 'FX and Other',
      impact: -115,
      description: 'Foreign currency translation headwinds and PSI Industrial Solutions disposition (-$73M from PSI sold to Crane Company in Q1 2026).',
      category: 'mix',
    },
  ],

  ratios: {
    currentRatio: 2.13,               // 28,591 / 13,413 Q1 2026 [DERIVED:10Q-Q1-26]
    currentRatioTarget: 2.0,
    debtToEquity: 0.83,               // 16,164 / 19,490 Q1 2026 [DERIVED:10Q-Q1-26]
    debtToEquityTarget: 1.2,          // post-Chart acquisition expected leverage
    returnOnEquity: 19.1,             // 930 Q1 / 19,490 equity × 4 quarters (annualized) [DERIVED]
    returnOnAssets: 7.3,              // est. annualized
    returnOnAssetsTarget: 8.0,
    freeCashFlow: 0.21,               // Q1 2026 FCF $210M [CITED:EC-Q1-26]
    freeCashFlowTarget: 1.5,          // FY2026 FCF target implied by guidance
    dividendPerShare: 0.92,           // $0.23 quarterly × 4 [CITED:10Q-Q1-26]
  },

  workingCapital: {
    dso: 37,                          // est. customer receivables / (revenue / 91 days)
    dsoTarget: 35,
    inventoryDays: 67,                // 4,868 / (5,083/91 days) [DERIVED]
    inventoryDaysTarget: 60,
    dpo: 58,                          // est. AP days — capital-intensive industrial co.
    dpoTarget: 55,
  },

  executiveDisplayMetrics: {
    adjustedRevenueYoYPercent: 2.5,
    premiumProductRevenueYoYPercent: 14.4,  // IET segment revenue growth Q1 2026
    adjustedOperatingMarginPercent: 17.6,   // Adj. EBITDA margin Q1 2026 [CITED:EC-Q1-26]
    adjustedEpsDollars: 0.58,               // Adj. EPS Q1 2026 [CITED:EC-Q1-26]
    freeCashFlowQuarterlyBillions: 0.21,
    revenueFootnote: 'Q1 2026: IET +14% YoY on LNG strength; OFSE -7% from SPC divestiture and Middle East disruptions',
  },

  // Scenario engine baseline — values in $M (FY2025 full-year basis)
  scenarioBaseline: {
    segments: [
      { name: 'Oilfield Services & Equipment (OFSE)', revenue: 14500 },  // FY2025 est. [INTERPOLATED]
      { name: 'Industrial & Energy Technology (IET)', revenue: 12500 },  // FY2025 est. [INTERPOLATED]
    ],
    cogs: {
      personnelCosts: 8500,           // est. FY2025 salary + benefits for ~53,000 employees
      subcontractorCosts: 4200,       // est. manufacturing and field services subcontractors
      facilityCosts: 6800,            // est. manufacturing plants, service centers, energy
    },
    opex: {
      technologyCosts: 800,           // digital platforms, Leucipa, cloud infrastructure
      marketing: 500,                 // global marketing and bids
      professionalDev: 300,           // training and workforce development
      sga: 2200,                      // corporate G&A
      otherOpEx: 600,                 // restructuring and other
    },
    interestExpense: 350,             // FY2025 interest expense (pre-Chart financing)
    otherIncome: -200,                // net other income
    taxRate: 0.27,                    // effective tax rate (higher than US statutory due to intl mix)
    dAndA: 1350,                      // FY2025 D&A est. (~$354M Q1 × 4 less some variability)
    revenuePerClient: 15000,          // est. avg contract value per major OFSE customer relationship
    flowThrough: {
      transactionalPctOfRevenue: 0.35,   // equipment sales (one-time)
      resilientPctOfRevenue: 0.65,       // services and long-term contracts (GTS LTSAs, OFSE recurring services)
    },
    sensitivity: {
      churnRate_to_Revenue: -0.5,        // proxy: +10% oil price change ≈ ±3–5% OFSE revenue
      fwaNetAdds_to_Revenue: 0.6,        // proxy: IET book-to-bill +0.1x ≈ +$200M forward revenue signal
      arpaDollar_to_Revenue: 1.0,        // proxy: +$100M IET EBITDA ≈ +15bps IET margin
    },
    monteCarlo: {
      volatilityFactor: 0.18,            // energy technology co. — moderate volatility
      baseOperatingMargin: 0.176,        // Adj. EBITDA margin Q1 2026
      netIncomeConversion: 0.80,         // net income / Adj. EBITDA (Q1 2026: 930/1160)
    },
  },
};
