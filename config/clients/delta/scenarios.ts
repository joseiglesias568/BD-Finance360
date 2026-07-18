// SEED REFERENCE ONLY -- runtime data comes from DB via lib/db/repositories/scenarios.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Lever defaults and baseline values use Delta Air Lines public
// disclosures: Form 10-K (FY 2025); Form 10-Q (Q1 2026); Q1 2026 earnings
// press release and transcript; JPM Industrials Conference deck.
//
// DISCLAIMER
// Lever min/max ranges, step sizes, and pre-built scenario revenue/margin
// impact estimates are scenario-engine UI parameters, not Delta-disclosed
// figures. Pre-built scenario assumptions are illustrative narratives
// grounded in Delta strategy commentary. Confidence percentages are
// editorial estimates.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { ScenarioConfig } from '../../types';

export const scenarios: ScenarioConfig = {
  baselineRevenue: 63.364,             // FY 2025 total operating revenue, $B
  baselineMargin: 9.2,                 // FY 2025 GAAP operating margin (10.0% adjusted)

  levers: [
    // ─── Revenue & Demand ───
    {
      id: 'capacity-growth',
      name: 'Capacity Growth (ASMs)',
      category: 'Revenue & Demand',
      min: -5,
      max: 10,
      default: 0,                       // Q2 2026 guided flat
      step: 0.5,
      unit: '% YoY',
      description: 'Year-over-year ASM growth. FY 2025 +3%. Q2 2026 flat with downward bias until fuel improves.',
      impact: 'high',
    },
    {
      id: 'premium-revenue-growth',
      name: 'Premium Product Revenue Growth',
      category: 'Revenue & Demand',
      min: -10,
      max: 25,
      default: 14,                      // Q1 2026 actual
      step: 1,
      unit: '% YoY',
      description: 'Year-over-year growth in premium-product ticket revenue (Delta One, First Class, Premium Select, Comfort+).',
      impact: 'high',
    },
    {
      id: 'main-cabin-growth',
      name: 'Main Cabin Revenue Growth',
      category: 'Revenue & Demand',
      min: -15,
      max: 15,
      default: 1,                       // Q1 2026 first positive in 5 quarters
      step: 1,
      unit: '% YoY',
      description: 'Year-over-year growth in main-cabin ticket revenue. Q1 2026 +1% (first positive since end-2024).',
      impact: 'high',
    },
    {
      id: 'corporate-sales-growth',
      name: 'Corporate Sales Growth',
      category: 'Revenue & Demand',
      min: -10,
      max: 25,
      default: 10,                      // Q1 2026 "double-digit"
      step: 1,
      unit: '% YoY',
      description: 'Corporate-contracted ticket sales growth. Q1 2026 quarterly record; double-digit across all sectors.',
      impact: 'high',
    },
    // ─── Loyalty & Diverse Revenue ───
    {
      id: 'amex-growth',
      name: 'AmEx Remuneration Growth',
      category: 'Loyalty & Diverse Revenue',
      min: -5,
      max: 25,
      default: 11,                      // FY 2025 +11% YoY
      step: 1,
      unit: '% YoY',
      description: 'Delta-AmEx co-brand remuneration growth. FY 2025 $8.2B (+11%); Q1 2026 $2.2B (+10%); target $10B.',
      impact: 'high',
    },
    {
      id: 'mro-revenue-growth',
      name: 'Delta TechOps MRO Revenue Growth',
      category: 'Loyalty & Diverse Revenue',
      min: 0,
      max: 200,
      default: 50,                      // FY 2026 outlook $1.2B vs $822M = +46%
      step: 5,
      unit: '% YoY',
      description: 'Third-party MRO revenue growth. FY 2025 +25%; FY 2026 outlook >+50% to $1.2B; long-term toward >2x.',
      impact: 'medium',
    },
    {
      id: 'cargo-growth',
      name: 'Cargo Revenue Growth',
      category: 'Loyalty & Diverse Revenue',
      min: -10,
      max: 20,
      default: 9,                       // Q1 2026 actual
      step: 1,
      unit: '% YoY',
      description: 'Cargo revenue growth (Asia-led from new widebody belly capacity).',
      impact: 'low',
    },
    // ─── Cost Inputs ───
    {
      id: 'fuel-price',
      name: 'Jet Fuel Price (adjusted)',
      category: 'Cost Inputs',
      min: 1.50,
      max: 5.50,                         // covers 2024 low through Q2 2026 spike
      default: 2.62,                     // Q1 2026 adjusted average
      step: 0.05,
      unit: '$/gal',
      description: 'Adjusted average price per fuel gallon. FY 2025 $2.30; Q1 2026 $2.62; Q2 2026 forward curve ~$4.30 incl. ~$300M refinery benefit.',
      impact: 'high',
    },
    {
      id: 'refinery-offset',
      name: 'Monroe Refinery Quarterly Benefit',
      category: 'Cost Inputs',
      min: -100,
      max: 600,
      default: -39,                      // Q1 2026 refinery operating loss
      step: 25,
      unit: '$M / quarter',
      description: 'Trainer refinery quarterly operating result. Q1 2026 $(39)M (hedge timing); Q2 2026 expected ~$300M benefit at forward fuel curve.',
      impact: 'medium',
    },
    {
      id: 'salaries-growth',
      name: 'Salaries and Related Costs Growth',
      category: 'Cost Inputs',
      min: -5,
      max: 15,
      default: 8,                        // FY 2025 +8% YoY
      step: 0.5,
      unit: '% YoY',
      description: 'Salaries growth. Recent step-ups: 5% Jun 2024, 4% Jun 2025 (eligible employees); 4% Jan 2025 + 4% Jan 2026 (pilots). ALPA contract amendable Dec 2026.',
      impact: 'high',
    },
    {
      id: 'profit-sharing',
      name: 'Profit-Sharing Payout',
      category: 'Cost Inputs',
      min: 0,
      max: 2000,
      default: 1300,                     // FY 2025 paid in Feb 2026
      step: 50,
      unit: '$M / annual',
      description: 'Annual profit-sharing payout. FY 2025 $1.3B; FY 2024 $1.4B. Formula: 10% first $2.5B pre-tax + 20% above.',
      impact: 'medium',
    },
    {
      id: 'regional-carrier-cost',
      name: 'Regional Carrier Expense Growth',
      category: 'Cost Inputs',
      min: -10,
      max: 15,
      default: 10,                       // FY 2025 +10% YoY
      step: 1,
      unit: '% YoY',
      description: 'Capacity Purchase Agreement (CPA) costs to Endeavor (wholly owned), SkyWest, Republic. FY 2025 $2,553M.',
      impact: 'medium',
    },
    // ─── Strategic / Discretionary ───
    {
      id: 'fuel-recapture-rate',
      name: 'Fuel-Recapture Rate (Pricing)',
      category: 'Strategic / Discretionary',
      min: 0,
      max: 100,
      default: 45,                       // 40-50% Q2 target midpoint
      step: 5,
      unit: '% recovered',
      description: 'Percentage of incremental fuel cost recovered through fare increases. Q2 2026 target 40-50%; 100% goal over time. Historical lag 60-90 days.',
      impact: 'high',
    },
    {
      id: 'capex-investment',
      name: 'Annual Capex Investment',
      category: 'Strategic / Discretionary',
      min: 3500,
      max: 7500,
      default: 5500,                     // FY 2026 expected ~$5.5B
      step: 100,
      unit: '$M / annual',
      description: 'Capital expenditures (mostly aircraft + fleet mods + technology). FY 2025 $4.5B; FY 2026 ~$5.5B expected. Aircraft commitments at YE 2025 $15.4B.',
      impact: 'medium',
    },
    {
      id: 'debt-paydown',
      name: 'Debt Paydown Pace',
      category: 'Strategic / Discretionary',
      min: 0,
      max: 6000,
      default: 4800,                     // FY 2025 actual
      step: 200,
      unit: '$M / annual',
      description: 'Annual debt and finance lease repayments. FY 2025 $4.8B; long-term target 1.0x gross leverage (currently 2.4x). Investment-grade at all 3 agencies.',
      impact: 'medium',
    },
  ],

  preBuiltScenarios: [
    {
      id: 'fuel-spike-persists',
      name: 'Fuel Spike Persists Through 2026',
      description:
        'Middle East conflict keeps jet fuel elevated at ~$4.00+/gal through 2026. Delta executes capacity discipline + accelerated fuel recapture. Refinery offset partially compensates. Industry rationalization accelerates as weak peers cannot earn cost of capital.',
      icon: 'Flame',
      confidence: 45,
      revenueImpact: -1500,               // est. — capacity cuts net of recapture
      marginImpact: -200,                 // est. bps
      keyAssumptions: [
        'Average jet fuel $4.00+/gal full year 2026 (vs $2.30 FY 2025)',
        'Q2 capacity flat → downward bias H2 2026',
        'Fuel-recapture pace 40-50% → 70%+ by Q4 2026',
        'Refinery offset $300M+ per quarter at sustained crack spreads',
        '40-50% of >$2B Q2 incremental fuel cost recaptured',
        'Industry consolidation pressure on AAL/LUV/ULCC competitors',
        'Delta share of industry profit grows from >55% baseline',
      ],
      leverSettings: {
        'fuel-price': 4.20,
        'refinery-offset': 300,
        'capacity-growth': -1,
        'fuel-recapture-rate': 60,
        'premium-revenue-growth': 12,
        'main-cabin-growth': 5,
      },
    },
    {
      id: 'fuel-normalizes-h2',
      name: 'Fuel Normalizes by H2 2026',
      description:
        'Middle East conflict de-escalates; fuel returns toward $2.50-$3.00/gal by Q3 2026. Delta retains fare-recapture pricing power; back-half margin expansion exceeds Q1 baseline. Free cash flow tracks toward $3-4B target. Continued execution of premium and AmEx growth pillars.',
      icon: 'TrendingUp',
      confidence: 35,
      revenueImpact: 800,
      marginImpact: 150,
      keyAssumptions: [
        'Jet fuel returns to $2.75/gal range by Q3 2026',
        'Capacity growth resumes ~3% in Q3-Q4 2026',
        'Pricing power retained — fuel recapture sticks even as fuel falls',
        'Free cash flow tracks toward $3-4B FY 2026 target',
        'Industry profit margin reaches 4%+ (IATA 2026 base case)',
        'Delta on track to FY 2026 EPS guidance midpoint $7.00',
        'Q1 2026 corporate sales record momentum continues',
      ],
      leverSettings: {
        'fuel-price': 2.75,
        'refinery-offset': 100,
        'capacity-growth': 3,
        'fuel-recapture-rate': 80,
        'premium-revenue-growth': 12,
        'main-cabin-growth': 4,
        'amex-growth': 12,
      },
    },
    {
      id: 'premium-amex-acceleration',
      name: 'Premium + AmEx Acceleration',
      description:
        'Premium cabin segmentation rollout completes ahead of plan; new aircraft deliveries shift premium seat share decisively above 40%. AmEx remuneration accelerates toward $10B target faster than expected. Loyalty deferred revenue and brand-usage revenue both grow double-digit.',
      icon: 'Sparkles',
      confidence: 50,
      revenueImpact: 1800,
      marginImpact: 220,
      keyAssumptions: [
        'Premium revenue growth sustained at 12-15% through 2026',
        'AmEx remuneration grows 13%+ — pace toward $10B target by 2027 (vs "next few years" guidance)',
        'New aircraft deliveries on schedule (8/quarter run-rate)',
        'Cardholder spend growth 12%+; new acquisitions double-digit',
        'Delta Sync 110M+ logins target met',
        'Diverse revenue streams remain >62% of adjusted revenue',
        'Fortune Best Companies #9 → top 5; talent retention strong',
      ],
      leverSettings: {
        'premium-revenue-growth': 15,
        'amex-growth': 14,
        'mro-revenue-growth': 55,
        'corporate-sales-growth': 12,
        'main-cabin-growth': 3,
        'capacity-growth': 2,
      },
    },
    {
      id: 'alpa-renegotiation-pressure',
      name: 'ALPA Contract Renegotiation Cost Pressure',
      description:
        'ALPA pilot contract amendable Dec 31, 2026. Renegotiation produces material wage increase plus enhanced work rules. Delta absorbs through productivity, capacity discipline, and AmEx/MRO revenue offset. Operating reliability friction during negotiation period.',
      icon: 'Users',
      confidence: 55,
      revenueImpact: -400,
      marginImpact: -150,
      keyAssumptions: [
        'Pilot wage rates increase 12-18% over 4-year term',
        'Negotiation period creates ~6 months of reliability friction',
        'Salaries growth 10-12% in 2027 vs 8% baseline',
        'Capacity discipline offsets some unit cost impact',
        'AmEx + MRO + Premium revenue offset most labor pressure',
        'Industry-wide ripple — UAL/AAL pilots also amendable in nearby periods',
        'Delta retains ~20% mainline-workforce-unionization advantage vs peers',
      ],
      leverSettings: {
        'salaries-growth': 12,
        'profit-sharing': 1500,
        'capacity-growth': 1,
        'premium-revenue-growth': 10,
        'amex-growth': 10,
        'mro-revenue-growth': 40,
      },
    },
  ],
};
