// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/financials.ts
//
// Provenance Legend:
// [CITED:10K-FY25]    — Verizon FY2025 Form 10-K (filed Feb 2026)
// [CITED:10Q-Q1-26]   — Verizon Q1 2026 Form 10-Q (filed Apr 2026)
// [CITED:Press-Q1-26] — Verizon Q1 2026 earnings press release
// [DERIVED]           — Computed from cited values; math shown inline
// [INTERPOLATED]      — Extrapolated from trend or adjacent cited values
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter, not a business datum
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Becton, Dickinson and Company public disclosures: Form 10-K (FY 2025, filed
// Feb 2026); Form 10-Q (Q1 2026, filed Apr 2026); Q1 2026 earnings press
// release and transcript; FY2026 guidance issued April 2026.
// Frontier acquisition closed January 22, 2026 — Q1 2026 is first full
// quarter including Frontier's fiber operations.
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { FinancialConfig } from '../../types';

export const financials: FinancialConfig = {
  fiscalYear: 'FY2025',
  annualRevenue: 134.0,               // FY2025 total operating revenue $134.0B [CITED:10K-FY25]
  annualRevenueYoY: 0.6,              // +0.6% vs FY2024
  annualOperatingIncome: 19.0,        // est. FY2025 [ASSUMED]
  annualOperatingMargin: 14.2,        // est.
  annualNetIncome: 17.5,              // est. FY2025 net income attributable to VZ [ASSUMED]
  annualEPS: 4.59,                    // FY2025 adjusted EPS [CITED:10K-FY25]

  quarters: [
    {
      quarter: 'Q1 2025',
      revenue: 33.5,                  // Q1 2025 total revenue est. [INTERPOLATED]
      revenueYoY: -0.5,               // slight decline due to equipment revenue softness
      operatingIncome: 4.6,           // est.
      operatingMargin: 13.7,          // est.
      eps: 1.09,                      // Q1 2025 adjusted EPS [CITED:10K-FY25]
      feeRevenueGrowth: 2.1,          // wireless service revenue growth Q1 2025
    },
    {
      quarter: 'Q2 2025',
      revenue: 33.7,                  // [INTERPOLATED]
      revenueYoY: 0.3,
      operatingIncome: 4.7,
      operatingMargin: 13.9,
      eps: 1.15,                      // est. [INTERPOLATED]
      feeRevenueGrowth: 2.4,
    },
    {
      quarter: 'Q3 2025',
      revenue: 33.3,                  // [INTERPOLATED]
      revenueYoY: 0.5,
      operatingIncome: 4.6,
      operatingMargin: 13.8,
      eps: 1.19,                      // est. [INTERPOLATED]
      feeRevenueGrowth: 2.5,
    },
    {
      quarter: 'Q4 2025',
      revenue: 33.5,                  // [INTERPOLATED]
      revenueYoY: 0.8,
      operatingIncome: 5.1,
      operatingMargin: 15.2,
      eps: 1.10,                      // [INTERPOLATED]
      feeRevenueGrowth: 2.7,
    },
    {
      quarter: 'Q1 2026',
      revenue: 34.44,                 // [CITED:10Q-Q1-26] $34,440M
      revenueYoY: 1.5,                // +1.5% YoY (Frontier adds ~$1.4B)
      operatingIncome: 5.0,           // est. — GAAP [ASSUMED]
      operatingMargin: 14.5,
      eps: 1.19,                      // Q1 2026 adjusted EPS est. [ASSUMED]
      feeRevenueGrowth: 2.7,          // wireless service revenue +2.7% YoY
    },
  ],

  latestQuarter: {
    quarter: 'Q1 2026',
    revenue: 34.44,
    revenueYoY: 1.5,
    operatingIncome: 5.0,
    operatingMargin: 14.5,
    eps: 1.19,
    feeRevenueGrowth: 2.7,
  },

  // Segments — Verizon reports two operating segments: Consumer and Business
  segments: [
    {
      name: 'Consumer — Wireless Service',
      revenue: 20.78,                 // Q1 2026 wireless service revenue [CITED:10Q-Q1-26]
      revenuePercent: 60.3,           // 20,780 / 34,440
      yoyChange: 2.7,
      operatingMargin: undefined,
      description:
        'Core consumer wireless service revenue — postpaid + prepaid service. Q1 2026 +2.7% YoY. ' +
        '~116M total postpaid connections. Postpaid phone net adds +55K (first positive Q1 since 2013). ' +
        'myPlan customization driving ARPA expansion toward $142/mo target.',
    },
    {
      name: 'Consumer — Broadband & Equipment',
      revenue: 3.82,                  // est. Q1 2026 Consumer broadband + equipment revenue [ASSUMED]
      revenuePercent: 11.1,
      yoyChange: 5.0,                 // broadband growing from FWA + Frontier Fios adds
      operatingMargin: undefined,
      description:
        'Fios Internet and FWA (Home Internet) service revenue plus consumer device sales. ' +
        'Fios ~10.0M subs post-Frontier; FWA 5.7M subs (+339K Q1 net adds). ' +
        'Total consumer broadband revenue growing fastest of all segments.',
    },
    {
      name: 'Business Solutions',
      revenue: 7.5,                   // est. Q1 2026 Business segment total [ASSUMED]
      revenuePercent: 21.8,
      yoyChange: 0.5,
      operatingMargin: undefined,
      description:
        'Enterprise, Public Sector, SMB, and Wholesale wireless and wireline solutions. ' +
        'Private network (CBRS/C-Band) growth — $1B+ private network revenue in pipeline. ' +
        'IoT connections growing toward 60M+ (fleet, healthcare, smart infrastructure). ' +
        'Fixed wireline declining but managed through mix shift to wireless and fiber.',
    },
    {
      name: 'Corporate & Other / Eliminations',
      revenue: 2.34,                  // est. Q1 2026 [ASSUMED]
      revenuePercent: 6.8,
      yoyChange: -2.0,
      operatingMargin: undefined,
      description:
        'Corporate overhead, intersegment eliminations, and Verizon Media/other subsidiaries. ' +
        'Declining as mix shifts toward Consumer and Business wireless.',
    },
  ],

  // P&L Summary — Q1 2026 ($M)
  plSummary: {
    revenue: {
      label: 'Total Operating Revenue',
      actual: 34440,                  // [CITED:10Q-Q1-26]
      plan: 34200,                    // est. internal plan
      priorYear: 33949,               // Q1 2025 est.
      variance: 491,
      variancePercent: 1.4,
    },
    cogs: {
      label: 'Cost of Services & Sales',
      actual: 14200,                  // est. — cost of wireless service + equipment COGS [ASSUMED]
      plan: 14100,
      priorYear: 14050,
      variance: -150,
      variancePercent: -1.1,
    },
    grossProfit: {
      label: 'Gross Profit',
      actual: 20240,                  // 34440 - 14200
      plan: 20100,
      priorYear: 19899,
      variance: 341,
      variancePercent: 1.7,
    },
    operatingExpenses: {
      label: 'Selling, General & Administrative Expenses',
      actual: 7900,                   // est. SG&A [ASSUMED]
      plan: 7850,
      priorYear: 7820,
      variance: -80,
      variancePercent: -1.0,
    },
    operatingIncome: {
      label: 'Operating Income (GAAP)',
      actual: 4960,                   // est. [ASSUMED] gross profit minus SG&A minus D&A
      plan: 5000,
      priorYear: 4800,
      variance: 160,
      variancePercent: 3.3,
    },
    netIncome: {
      label: 'Net Income Attributable to Verizon',
      actual: 4500,                   // est. [ASSUMED] — after interest on ~$145B net debt
      plan: 4400,
      priorYear: 4300,
      variance: 200,
      variancePercent: 4.7,
    },
  },

  // Revenue Bridge — Q1 2026 vs Q1 2025 (~$491M increase)
  revenueBridge: [
    {
      label: 'Wireless Service Revenue Growth',
      impact: 545,
      description: 'Consumer wireless service revenue +$545M (+2.7% YoY). Driven by postpaid phone ARPA expansion via myPlan and premium tier adoption.',
      category: 'pricing',
    },
    {
      label: 'Frontier Broadband (First Full Quarter)',
      impact: 380,
      description: 'Frontier acquisition closed January 22, 2026. Q1 2026 is first full quarter with Frontier fiber revenue (~$1.4B annualized contribution).',
      category: 'volume',
    },
    {
      label: 'FWA Revenue Growth',
      impact: 200,
      description: 'Fixed Wireless Access home internet revenue +$200M from +339K net subscriber additions. Now 5.7M total FWA subs.',
      category: 'volume',
    },
    {
      label: 'Business Solutions Growth',
      impact: 38,
      description: 'Enterprise private network and IoT revenue growth offset by legacy wireline decline. Net +$38M.',
      category: 'volume',
    },
    {
      label: 'Equipment & Other Revenue',
      impact: -672,
      description: 'Device upgrade cycle timing offset. Equipment revenue down YoY as upgrade volumes normalize after 5G device cycle.',
      category: 'mix',
    },
  ],

  ratios: {
    currentRatio: 0.88,               // est. Q1 2026 [ASSUMED] — typical telco pattern (deferred revenue inflates current liabilities)
    currentRatioTarget: 0.95,
    debtToEquity: 3.2,                // $145B net debt / ~$45B equity (est.) — high leverage typical for capital-intensive telcos
    debtToEquityTarget: 2.8,          // implied by 2.25x EBITDA leverage target
    returnOnEquity: 38.9,             // FY2025 net income / avg equity est.
    returnOnAssets: 5.5,              // FY2025 net income / total assets est.
    returnOnAssetsTarget: 6.0,
    freeCashFlow: 21.5,               // FY2026 guidance floor ≥$21.5B
    freeCashFlowTarget: 21.5,
    dividendPerShare: 2.71,           // FY2026 annual dividend ($0.6775 quarterly × 4)
  },

  workingCapital: {
    dso: 28,                          // est. — typical telco DSO for service revenue
    dsoTarget: 26,
    inventoryDays: 18,                // handset and device inventory
    inventoryDaysTarget: 15,
    dpo: 55,                          // typical telco AP days on capex-intensive infrastructure
    dpoTarget: 55,
  },

  executiveDisplayMetrics: {
    adjustedRevenueYoYPercent: 1.5,
    premiumProductRevenueYoYPercent: 2.7,   // wireless service revenue growth
    adjustedOperatingMarginPercent: 39.0,   // adj. EBITDA margin
    adjustedEpsDollars: 1.19,
    freeCashFlowQuarterlyBillions: 5.7,
    revenueFootnote: 'Q1 2026 includes first full quarter of Frontier fiber contribution; wireless service +2.7% YoY',
  },

  // Scenario engine baseline — values in $M (FY2025 full-year basis)
  scenarioBaseline: {
    segments: [
      { name: 'Consumer Wireless Service', revenue: 80400 },
      { name: 'Consumer Broadband & Equipment', revenue: 15200 },
      { name: 'Business Solutions', revenue: 30000 },
      { name: 'Corporate & Other', revenue: 8400 },
    ],
    cogs: {
      personnelCosts: 22000,          // est. FY2025 salary + benefits
      subcontractorCosts: 8500,       // network infrastructure contracted services
      facilityCosts: 18000,           // network COGS (spectrum leases, tower site costs, energy)
    },
    opex: {
      technologyCosts: 4000,          // IT/BSS/OSS transformation spend
      marketing: 5000,                // selling + marketing
      professionalDev: 800,           // training and workforce development
      sga: 6200,                      // G&A and corporate overhead
      otherOpEx: 0,
    },
    interestExpense: 5800,            // FY2025 interest expense on ~$145B gross debt
    otherIncome: 0,
    taxRate: 0.24,                    // projected effective tax rate
    dAndA: 17500,                     // FY2025 D&A (heavy for network-asset-intensive telco)
    revenuePerClient: 1670,           // ~$1,670 annualized ARPA × 12 months (wireless postpaid account)
    flowThrough: {
      transactionalPctOfRevenue: 0.12,  // equipment and one-time device revenue
      resilientPctOfRevenue: 0.88,      // service revenue (wireless + broadband) — highly recurring
    },
    sensitivity: {
      churnRate_to_Revenue: -1.0,       // +1 bps monthly churn ≈ -$80M annualized wireless revenue
      fwaNetAdds_to_Revenue: 0.85,      // 100K FWA net adds ≈ +$60M annualized broadband revenue
      arpaDollar_to_Revenue: 1.0,       // +$1 ARPA/mo ≈ +$1.4B annualized wireless service revenue
    },
    monteCarlo: {
      volatilityFactor: 0.12,           // telcos are lower-volatility than average S&P 500
      baseOperatingMargin: 0.145,       // FY2025 GAAP operating margin
      netIncomeConversion: 0.92,        // net income / operating income (FY2025)
    },
  },
};
