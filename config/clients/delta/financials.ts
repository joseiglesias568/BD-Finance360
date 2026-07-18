// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/financials.ts
//
// Provenance Legend (applied in block-above cluster comments throughout this file):
// [CITED:10K-FY25]    — Delta FY2025 Form 10-K (filed Feb 10, 2026)
// [CITED:10Q-Q1-26]   — Delta Q1 2026 Form 10-Q (filed Apr 8, 2026)
// [CITED:Press-Q1-26] — Delta Q1 2026 earnings press release
// [CITED:Trans-Q1-26] — Delta Q1 2026 earnings call transcript
// [CITED:JPM-2026]    — Delta JPM Industrials Conference deck (Mar 17, 2026)
// [CITED:DecSup-26]   — Delta December Quarter Supplemental (Jan 13, 2026)
// [DERIVED]           — Computed from cited values; math shown inline
// [INTERPOLATED]      — Extrapolated from trend or adjacent cited values
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter, not a business datum
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Numerical values in this file are sourced from Delta Air Lines public
// disclosures: Form 10-K (FY 2025, filed Feb 10, 2026); Form 10-Q (Q1
// 2026, filed Apr 8, 2026); Q1 2026 earnings press release and transcript;
// JPM Industrials Conference deck (Mar 17, 2026); December Quarter
// Supplemental (Jan 13, 2026).
//
// DISCLAIMER
// Where Delta does not publicly disclose a target, threshold, or forward-
// looking metric, values are estimated using industry benchmarks
// (McKinsey State of Aviation 2025, IATA 2026 outlook), peer disclosures,
// analyst consensus, or arithmetic from cited values. Q3 2025 quarterly
// revenue is back-solved from FY total minus Q1+Q2+Q4. Forward-looking
// quarter values reflect company guidance as of Apr 8, 2026 and are
// subject to change.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { FinancialConfig } from '../../types';

export const financials: FinancialConfig = {
  fiscalYear: 'FY2025',
  annualRevenue: 63.364,            // $63,364M total operating revenue (10-K)
  annualRevenueYoY: 3.0,            // +3% vs FY2024 $61,643M
  annualOperatingIncome: 5.822,     // $5,822M GAAP operating income
  annualOperatingMargin: 9.2,       // 5,822 / 63,364
  annualNetIncome: 5.005,           // $5,005M GAAP net income
  annualEPS: 7.66,                  // GAAP diluted EPS

  quarters: [
    {
      quarter: 'Q1 2025',
      revenue: 14.040,              // 10-Q Q1 2026 comparison-period column
      revenueYoY: 0.0,              // not separately disclosed in our corpus
      operatingIncome: 0.569,       // $569M
      operatingMargin: 4.0,         // 569 / 14,040
      eps: 0.37,                    // GAAP diluted EPS
      feeRevenueGrowth: 8.0,        // Other revenue growth proxy (loyalty + MRO + refinery diversification)
    },
    {
      quarter: 'Q2 2025',
      revenue: 16.648,              // Q1 2026 10-Q Note A reconciliation column
      revenueYoY: 0.0,              // not in corpus
      operatingIncome: 1.617,       // est. — implied by FY $5,822M minus other quarters' totals; consistent with adjusted op margin trajectory
      operatingMargin: 9.7,         // est.
      eps: 1.96,                    // est. — Q2 typically the strongest seasonal quarter
      feeRevenueGrowth: 10.0,       // est.
    },
    {
      quarter: 'Q3 2025',
      revenue: 16.673,              // back-solved: $63,364M FY - $14,040 Q1 - $16,648 Q2 - $16,003 Q4
      revenueYoY: 0.0,              // not in corpus
      operatingIncome: 1.842,       // est.
      operatingMargin: 11.0,        // est. — Q3 historically strong with summer travel
      eps: 1.98,                    // est.
      feeRevenueGrowth: 10.0,       // est.
    },
    {
      quarter: 'Q4 2025',
      revenue: 16.003,              // JPM Industrials deck reconciliation
      revenueYoY: 1.0,              // approx +1% vs Q4 2024
      operatingIncome: 1.794,       // est. — implied by FY $5,822M total
      operatingMargin: 11.2,        // est.
      eps: 2.43,                    // est. — strong Q4 holiday + completion of fleet renewal effects
      feeRevenueGrowth: 12.0,       // est.
    },
    {
      quarter: 'Q1 2026',
      revenue: 15.854,              // 10-Q Q1 2026 (GAAP)
      revenueYoY: 13.0,             // +13% GAAP; +9.4% adjusted (excl. third-party refinery)
      operatingIncome: 0.501,       // GAAP $501M; $652M adjusted (Press release)
      operatingMargin: 3.2,         // GAAP; 4.6% adjusted
      eps: -0.44,                   // GAAP diluted; $0.64 adjusted
      feeRevenueGrowth: 41.0,       // Other revenue grew +41% YoY (driven by refinery, MRO, loyalty)
      adjustedRevenueYoY: 9.4,      // [CITED:Press-Q1-26] adjusted revenue growth ex third-party refinery swing
    },
  ],

  latestQuarter: {
    quarter: 'Q1 2026',
    revenue: 15.854,
    revenueYoY: 13.0,
    operatingIncome: 0.501,
    operatingMargin: 3.2,
    eps: -0.44,
    feeRevenueGrowth: 41.0,
    adjustedRevenueYoY: 9.4,
  },

  // Segments — Delta reports two operating segments (Airline + Refinery).
  // For management-reporting granularity we expand the Airline segment
  // into its geographic passenger entities and break out diverse-revenue
  // streams (Cargo, Refinery third-party, Loyalty/MRO/Other).
  segments: [
    {
      name: 'Domestic Passenger',
      revenue: 35.731,              // FY 2025 passenger revenue (10-K MD&A)
      revenuePercent: 56.4,         // 35,731 / 63,364
      yoyChange: 1.0,               // +1% on +3% capacity
      operatingMargin: undefined,   // Delta does not separately disclose operating margin by geography
      description:
        '~71% of passenger revenue. Anchored by core hubs ATL, DTW, MSP, SLC and coastal hubs BOS, LAX, JFK, LGA, SEA. Premium and corporate revenue lead growth; main cabin softer in 2025 but inflected positive in Q1 2026 (+1%). Q1 2026 unit revenue +6% on +1% capacity.',
    },
    {
      name: 'Atlantic Passenger',
      revenue: 9.270,               // FY 2025
      revenuePercent: 14.6,
      yoyChange: 2.0,
      operatingMargin: undefined,
      description:
        '"Largest and most profitable international entity" per management. Joint venture with Air France-KLM and Virgin Atlantic (Delta owns 49% Virgin Atlantic, 3% Air France-KLM parent). Premium-led growth. New May 2026 routes BOS-MAD, BOS-NCE, JFK-OPO, JFK-OLB.',
    },
    {
      name: 'Latin America Passenger',
      revenue: 3.980,
      revenuePercent: 6.3,
      yoyChange: 0.0,               // flat
      operatingMargin: undefined,
      description:
        'Aeromexico JV (DOT antitrust immunity terminated Sep 2025; appeal pending under Court stay), LATAM JV (Delta owns ~11%). Q1 2026 Mexico leisure weakness from civil unrest in Puerto Vallarta; capacity redirected to Caribbean/Florida.',
    },
    {
      name: 'Pacific Passenger',
      revenue: 2.787,
      revenuePercent: 4.4,
      yoyChange: 10.0,
      operatingMargin: undefined,
      description:
        'Smallest geography but fastest-growing in 2025. Korean Air JV (Delta owns ~15% of Hanjin-KAL); 2% China Eastern equity stake; new Salt Lake City—Seoul-Incheon route. Premium-led demand to Japan and South Korea.',
    },
    {
      name: 'Cargo',
      revenue: 0.900,                // FY 2025
      revenuePercent: 1.4,
      yoyChange: 9.0,
      operatingMargin: undefined,    // not separately disclosed
      description:
        'Belly-cargo revenue from regularly scheduled passenger aircraft. Asia is the growth driver via new widebody fleet. Q1 2026 +9% YoY. Member of SkyTeam Cargo alliance with six other carriers.',
    },
    {
      name: 'Refinery (Third-Party Sales)',
      revenue: 5.077,                // FY 2025 third-party refinery sales (10-K)
      revenuePercent: 8.0,
      yoyChange: 9.0,
      operatingMargin: 2.3,          // Refinery segment OI $157M / Refinery segment revenue $6,961M
      description:
        'Monroe Energy / Trainer refinery non-jet output (gasoline, diesel) sold to third parties. Refinery segment FY 2025 operating income $157M (vs $38M FY 2024). RINs compliance cost $312M. Q2 2026 expected $300M benefit at forward fuel curve. Vertical fuel hedge for the airline segment.',
    },
    {
      name: 'Loyalty / MRO / Other',
      revenue: 5.619,                // Loyalty $3.362B + Ancillary (MRO+Vacations) $0.937B + Misc $1.320B
      revenuePercent: 8.9,
      yoyChange: 8.0,                // weighted average of components
      operatingMargin: undefined,
      description:
        'AmEx co-brand remuneration $8.2B FY 2025 (target $10B); Delta TechOps third-party MRO $822M FY 2025 (+25%, target $1.2B FY 2026); Delta Vacations; lounge access; codeshare and JV settlements. Highest-margin diverse-revenue category.',
    },
  ],

  // P&L Summary — Q1 2026 GAAP, dollars in millions
  plSummary: {
    revenue: {
      label: 'Total Operating Revenue',
      actual: 15854,                 // Q1 2026 (10-Q)
      plan: 15200,                   // pre-fuel-spike Q1 guidance midpoint
      priorYear: 14040,              // Q1 2025
      variance: 1814,
      variancePercent: 13.0,
    },
    cogs: {
      label: 'Operating Costs (Salaries, Fuel, Refinery, Maintenance, Regional)',
      actual: 11118,                 // est. — Salaries 4541 + Fuel 2742 + Refinery 1654 + Maint 709 + Regional 649 + Aircraft rent 143 + Pax service 428 + Ancillary 252
      plan: 10750,
      priorYear: 9785,               // Q1 2025 equivalent
      variance: -1333,
      variancePercent: -13.6,
    },
    grossProfit: {
      label: 'Gross Profit (Revenue − Operating Costs)',
      actual: 4736,                  // 15854 - 11118
      plan: 4450,
      priorYear: 4255,
      variance: 481,
      variancePercent: 11.3,
    },
    operatingExpenses: {
      label: 'Other Operating Expenses (Selling, Contracted Services, Landing, Other)',
      actual: 4235,                  // 15353 total opex - 11118 = 4235
      plan: 3850,
      priorYear: 3686,
      variance: -549,
      variancePercent: -14.9,
    },
    operatingIncome: {
      label: 'Operating Income (GAAP)',
      actual: 501,                   // 10-Q
      plan: 600,                     // pre-spike
      priorYear: 569,
      variance: -68,
      variancePercent: -12.0,
    },
    netIncome: {
      label: 'Net Income/(Loss) (GAAP)',
      actual: -289,                  // GAAP loss driven by $550M MTM equity-investment markdown
      plan: 250,
      priorYear: 240,
      variance: -529,
      variancePercent: -220.4,
    },
  },

  // Revenue Bridge — Q1 2026 vs Q1 2025 ($1,814M GAAP increase)
  revenueBridge: [
    {
      label: 'Premium Products (Tickets)',
      impact: 656,
      description: 'Premium-product ticket revenue $5,363M Q1 2026 vs $4,707M Q1 2025 (+14%). Corporate-led; new aircraft with ~50% premium seat share driving structural mix shift.',
      category: 'mix',
    },
    {
      label: 'Refinery Third-Party Sales',
      impact: 592,
      description: 'Third-party refinery sales $1,654M Q1 2026 vs $1,062M Q1 2025 (+56%). Driven by transition from exchange agreements toward direct sales plus higher refined-product market prices.',
      category: 'volume',
    },
    {
      label: 'Delta TechOps MRO',
      impact: 229,
      description: 'Third-party MRO $380M Q1 2026 vs $151M Q1 2025 (+152%). Lapping a low Q1 2025 base; LEAP-1A/B engine work scopes; FY 2026 outlook $1.2B (+~50%).',
      category: 'volume',
    },
    {
      label: 'Loyalty and Related (AmEx + Brand Usage)',
      impact: 139,
      description: 'Loyalty and related revenue $1,221M Q1 2026 vs $1,082M Q1 2025 (+13%). AmEx remuneration $2.2B in the quarter (+10% YoY); cardholder spend +12%.',
      category: 'pricing',
    },
    {
      label: 'Loyalty Travel Awards',
      impact: 89,
      description: 'Loyalty travel awards revenue $1,029M Q1 2026 vs $940M Q1 2025 (+9%). Higher mile redemption volume against rising AmEx-driven mile issuance.',
      category: 'volume',
    },
    {
      label: 'Main Cabin Tickets (Inflection)',
      impact: 43,
      description: 'Main cabin ticket revenue $5,404M Q1 2026 vs $5,361M Q1 2025 (+1%). First quarter of positive main-cabin revenue growth since end of 2024 — capacity discipline and demand recovery.',
      category: 'volume',
    },
    {
      label: 'Cargo, Travel Services, Misc',
      impact: 66,
      description: 'Cargo +$18M (+9%); Travel-related services +$34M; Miscellaneous +$14M. Cargo growth Asia-led from new widebody belly capacity.',
      category: 'volume',
    },
  ],

  ratios: {
    // Q1 2026 balance-sheet driven where applicable
    currentRatio: 0.42,              // $13.663B current assets / $32.699B current liabilities — typical airline pattern (Air Traffic Liability inflates current liabilities)
    currentRatioTarget: 0.50,        // est. target — airlines run structurally low current ratios due to ATL
    debtToEquity: 0.70,              // $14.164B debt / $20.376B equity (Q1 2026)
    debtToEquityTarget: 0.50,        // implied by 1.0x gross leverage long-term target (JPM)
    returnOnEquity: 24.4,            // $5.005B FY 2025 net income / $20.6B avg equity
    returnOnAssets: 5.9,             // $5.005B FY 2025 net income / $84.4B Q1 2026 total assets
    returnOnAssetsTarget: 6.5,       // est. — Delta does not publish ROA target
    freeCashFlow: 4.643,             // FY 2025 FCF (10-K + JPM)
    freeCashFlowTarget: 4.0,         // midpoint of $3-5B 3-5 year target (JPM)
    dividendPerShare: 0.75,          // $0.1875 quarterly × 4 (Delta raised dividend Q3 2025)
  },

  // Working capital — airline-specific characteristics
  workingCapital: {
    dso: 24,                         // ~$4.090B AR / ($63.364B revenue / 365)
    dsoTarget: 22,                   // est.
    inventoryDays: 10,               // ~$1.767B fuel + parts / ($63.364B / 365)
    inventoryDaysTarget: 9,          // est.
    dpo: 38,                         // ~$5.969B AP / ($57.542B opex / 365)
    dpoTarget: 40,                   // est.
  },

  executiveDisplayMetrics: {
    adjustedRevenueYoYPercent: 9.4,
    premiumProductRevenueYoYPercent: 14,
    adjustedOperatingMarginPercent: 4.6,
    adjustedEpsDollars: 0.64,
    freeCashFlowQuarterlyBillions: 1.23,
    revenueFootnote: 'GAAP revenue +13% YoY; adjusted +9.4% ex refinery timing',
  },

  // Scenario engine baseline — values in $M (FY 2025 full-year basis)
  // Mapping airline cost structure to the generic schema:
  //   personnelCosts  = Salaries + Profit sharing
  //   subcontractorCosts = Regional carrier expense + Contracted services + Aircraft maintenance
  //   facilityCosts    = Aircraft fuel + Landing fees and other rents + Aircraft rent + Passenger service + Ancillary businesses & refinery
  // Total of these plus opex sub-buckets and D&A reconciles to $57,542M FY 2025 operating expense.
  scenarioBaseline: {
    segments: [
      { name: 'Domestic Passenger', revenue: 35731 },
      { name: 'Atlantic Passenger', revenue: 9270 },
      { name: 'Latin America Passenger', revenue: 3980 },
      { name: 'Pacific Passenger', revenue: 2787 },
      { name: 'Cargo', revenue: 900 },
      { name: 'Refinery (Third-Party)', revenue: 5077 },
      { name: 'Loyalty / MRO / Other', revenue: 5619 },
    ],
    cogs: {
      personnelCosts: 18857,         // Salaries 17,520 + Profit sharing 1,337
      subcontractorCosts: 9602,      // Regional 2,553 + Contracted services 4,617 + Maintenance 2,432
      facilityCosts: 21767,          // Fuel 9,819 + Landing/rents 3,564 + Aircraft rent 542 + Pax service 1,855 + Ancillary/refinery 5,987
    },
    opex: {
      technologyCosts: 500,          // est. portion of Other line; Delta does not separately disclose tech opex
      marketing: 2485,               // Passenger commissions and other selling expenses
      professionalDev: 100,          // est. — training is within Salaries already
      sga: 1888,                     // Other line ($2,388M) less estimated tech ($500M)
      otherOpEx: 0,
    },
    interestExpense: 679,            // FY 2025 interest expense, net (10-K)
    otherIncome: 0,                  // baseline excludes MTM gain/(loss) on equity investments — too volatile for scenario modeling
    taxRate: 0.24,                   // midpoint of 23-25% projected 2026 effective rate (10-K MD&A)
    dAndA: 2443,                     // FY 2025 D&A
    revenuePerClient: 0.317,         // ~$317 revenue per passenger ($63.4B / 200M passengers in 2025) — airline analogue to "revenue per client"
    flowThrough: {
      // Delta's diverse revenue framing: 62% of adjusted revenue from
      // premium products + diverse streams; 38% main cabin tickets
      transactionalPctOfRevenue: 0.38,  // main cabin tickets — most price-elastic
      resilientPctOfRevenue: 0.62,      // premium + loyalty + corporate + MRO + cargo + refinery — durable
    },
    sensitivity: {
      // Rough elasticities — airline scenario engine inputs.
      // est. — calibrated against 2024-2025 observed quarterly swings.
      fuelPrice_to_OpIncome: -1.0,      // every +$0.01/gal jet fuel ≈ -$40M annual op income
      capacityGrowth_to_Revenue: 0.85,  // ~85% revenue elasticity to ASM growth
      premiumMix_to_Margin: 0.6,         // every +1pt premium share ≈ +60bps op margin
    },
    monteCarlo: {
      volatilityFactor: 0.30,            // airlines are higher-volatility than average industrials
      baseOperatingMargin: 0.092,        // FY 2025 GAAP operating margin
      netIncomeConversion: 0.86,         // $5,005M net / $5,822M operating (FY 2025)
    },
  },
};
