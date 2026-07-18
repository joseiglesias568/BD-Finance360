// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/scenarios.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { ScenarioConfig } from '../../types';

export const scenarios: ScenarioConfig = {
  baselineRevenue: 134.0,             // FY2025 total operating revenue, $B [CITED:10K-FY25]
  baselineMargin: 39.0,               // FY2025 adj. EBITDA margin (%) [ASSUMED]

  levers: [
    // ─── Wireless Revenue ───
    {
      id: 'wireless-service-growth',
      name: 'Wireless Service Revenue Growth',
      category: 'Wireless Revenue',
      min: -2,
      max: 6,
      default: 2.7,                   // Q1 2026 actual
      step: 0.1,
      unit: '% YoY',
      description: 'Year-over-year wireless service revenue growth. FY2026 guidance +2.0–2.8%. Most closely watched investor metric.',
      impact: 'high',
    },
    {
      id: 'arpa-change',
      name: 'ARPA Change ($/month)',
      category: 'Wireless Revenue',
      min: -5,
      max: 8,
      default: 1,                     // typical annual ARPA improvement
      step: 0.25,
      unit: '$/month YoY',
      description: 'Change in average revenue per account per month. Every +$1 ARPA = ~$1.4B annualized wireless revenue.',
      impact: 'high',
    },
    {
      id: 'postpaid-net-adds',
      name: 'Postpaid Phone Net Adds (Quarterly)',
      category: 'Wireless Revenue',
      min: -300,
      max: 500,
      default: 55,                    // Q1 2026 actual
      step: 25,
      unit: 'K subscribers',
      description: 'Quarterly postpaid phone net subscriber adds. First positive Q1 since 2013 at +55K. T-Mobile consistently adding 1.3M+/quarter.',
      impact: 'high',
    },
    {
      id: 'churn-rate',
      name: 'Monthly Postpaid Phone Churn Rate',
      category: 'Wireless Revenue',
      min: 0.60,
      max: 1.20,
      default: 0.89,                  // Q1 2026 actual
      step: 0.01,
      unit: '%',
      description: 'Monthly postpaid phone churn rate. AT&T/T-Mobile benchmark ~0.82%. Verizon Q1 2026 0.89%. Every +1 bps churn ≈ -$80M annualized revenue.',
      impact: 'high',
    },
    // ─── Broadband ───
    {
      id: 'fwa-net-adds',
      name: 'FWA Net Adds (Quarterly)',
      category: 'Broadband Growth',
      min: 0,
      max: 600,
      default: 175,                   // FY2026 quarterly avg implied by 700K–800K guidance
      step: 25,
      unit: 'K subscribers',
      description: 'Quarterly Fixed Wireless Access net subscriber adds. FY2026 guidance 700K–800K total (~175–200K/quarter). T-Mobile averaging 500K/quarter.',
      impact: 'high',
    },
    {
      id: 'fios-penetration',
      name: 'Fios Fiber Penetration Rate',
      category: 'Broadband Growth',
      min: 25,
      max: 50,
      default: 38,                    // est. blended (core ~43%, Frontier ~30%)
      step: 1,
      unit: '% of passings',
      description: 'Fios Internet subscribers as % of homes passed. Core territory ~43%; Frontier territory ~30% (low initial rate). Cross-sell and re-branding expand penetration.',
      impact: 'medium',
    },
    {
      id: 'frontier-synergies',
      name: 'Frontier Integration Synergies',
      category: 'Cost & Synergies',
      min: 0,
      max: 1500,
      default: 500,                   // Year 1 target
      step: 50,
      unit: '$M annual run-rate',
      description: 'Frontier acquisition cost synergies annualized run-rate. Year 1 target $500M; full run-rate $1.5B by Year 3. Drives adj. EBITDA margin expansion.',
      impact: 'high',
    },
    // ─── Cost Structure ───
    {
      id: 'ai-savings',
      name: 'AI & Automation Cost Savings',
      category: 'Cost & Synergies',
      min: 0,
      max: 1000,
      default: 200,                   // FY2026 Phase 1 target
      step: 50,
      unit: '$M annual savings',
      description: 'AI-driven OpEx reduction (network automation, care deflection, BSS/OSS). FY2026 target ~$200M. Long-term target $1B+ by 2028.',
      impact: 'medium',
    },
    {
      id: 'capex-intensity',
      name: 'CapEx as % of Revenue',
      category: 'Capital Allocation',
      min: 10,
      max: 20,
      default: 13,                    // FY2026 guidance midpoint
      step: 0.5,
      unit: '% of revenue',
      description: 'Annual CapEx as percentage of revenue. FY2026 guidance $17.5B–$18.5B on ~$138B revenue = ~13%. Post-peak C-Band investment. Frontier adds capex but also revenue.',
      impact: 'medium',
    },
    // ─── Competitive Scenarios ───
    {
      id: 'competitive-price-pressure',
      name: 'Competitive Pricing Pressure',
      category: 'Competitive',
      min: -200,
      max: 0,
      default: -50,                   // est. baseline promotional spend to maintain competitiveness
      step: 25,
      unit: '$M EBITDA headwind',
      description: 'EBITDA headwind from competitive promotional offers needed to defend subscriber base vs T-Mobile and AT&T pricing. More negative = more aggressive competition.',
      impact: 'medium',
    },
  ],

  preBuiltScenarios: [
    {
      id: 'base-case',
      name: 'FY2026 Base Case — Guidance Midpoint',
      icon: 'Target',
      description: 'Management guidance midpoint. Wireless service revenue +2.4%, FWA +750K net adds, Frontier synergies $500M, AI savings $200M. FCF ≥$21.5B, EPS $4.97.',
      leverSettings: {
        'wireless-service-growth': 2.4,
        'arpa-change': 1.0,
        'postpaid-net-adds': 70,
        'churn-rate': 0.89,
        'fwa-net-adds': 188,
        'frontier-synergies': 500,
        'ai-savings': 200,
        'capex-intensity': 13.0,
        'competitive-price-pressure': -50,
      },
      revenueImpact: 0,
      marginImpact: 0,
      confidence: 70,
      keyAssumptions: [
        'Wireless service revenue growth +2.4% (midpoint of +2.0–2.8% guidance)',
        'FWA net adds 750K total for FY2026',
        'Frontier integration on schedule; $500M synergy run-rate by year-end',
        'C-Band reaches 90% pop coverage by year-end 2026',
        'AI savings $200M Phase 1 fully realized',
      ],
    },
    {
      id: 'bull-case',
      name: 'Bull Case — C-Band + Frontier Upside',
      icon: 'TrendingUp',
      description: 'C-Band densification outperforms, FWA approaches 800K net adds, churn improves to benchmark level. Frontier synergies front-loaded. EPS ~$5.10.',
      leverSettings: {
        'wireless-service-growth': 3.0,
        'arpa-change': 2.0,
        'postpaid-net-adds': 150,
        'churn-rate': 0.84,
        'fwa-net-adds': 200,
        'frontier-synergies': 750,
        'ai-savings': 300,
        'capex-intensity': 12.5,
        'competitive-price-pressure': -30,
      },
      revenueImpact: 1200,
      marginImpact: 80,
      confidence: 25,
      keyAssumptions: [
        'C-Band quality improvements drive churn to AT&T/T-Mobile parity (0.84%)',
        'FWA exceeds 800K net adds — C-Band quality parity with cable broadband',
        'Frontier synergies front-loaded to $750M run-rate by year-end',
        'Postpaid phone momentum sustains +150K/quarter average',
        'Competitive pricing environment stabilizes — less aggressive T-Mobile promotions',
      ],
    },
    {
      id: 'bear-case',
      name: 'Bear Case — T-Mobile Price War + Frontier Delays',
      icon: 'TrendingDown',
      description: 'T-Mobile aggressive discounting drives churn to 0.95%+, ARPA declines. Frontier integration slips to Q1 2027. FWA misses 600K adds. EPS ~$4.75.',
      leverSettings: {
        'wireless-service-growth': 1.2,
        'arpa-change': -1.0,
        'postpaid-net-adds': -100,
        'churn-rate': 0.97,
        'fwa-net-adds': 150,
        'frontier-synergies': 250,
        'ai-savings': 100,
        'capex-intensity': 14.0,
        'competitive-price-pressure': -200,
      },
      revenueImpact: -2100,
      marginImpact: -200,
      confidence: 15,
      keyAssumptions: [
        'T-Mobile launches aggressive $25–30/line promotion driving material switching',
        'Frontier OSS/BSS integration slips to Q1 2027 — $250M synergy miss',
        'ARPA declines as Verizon matches competitive promotional pricing',
        'FWA misses guidance — T-Mobile FWA quality advantage in key markets',
        'Leverage stays above 2.5x through year-end; rating agency negative watch',
      ],
    },
    {
      id: 'network-outage',
      name: 'Major Network Outage Scenario',
      icon: 'AlertTriangle',
      description: '48-hour national 5G outage (similar to 2022 AT&T incident). ~$200M direct revenue impact, elevated churn 2–4 quarters post-event.',
      leverSettings: {
        'wireless-service-growth': 1.5,
        'arpa-change': 0.5,
        'postpaid-net-adds': -200,
        'churn-rate': 1.05,
        'fwa-net-adds': 100,
        'frontier-synergies': 500,
        'ai-savings': 200,
        'capex-intensity': 13.5,
        'competitive-price-pressure': -150,
      },
      revenueImpact: -800,
      marginImpact: -80,
      confidence: 5,
      keyAssumptions: [
        '48-hour national 5G outage affecting ~30M+ customers',
        'Customer SLA credits and one-time bill adjustments ~$200M',
        'Churn spike to 1.05% in outage quarter and elevated 0.93–0.95% next 2 quarters',
        'Regulatory scrutiny (FCC) and potential fines',
        'Recovery requires accelerated myPlan retention promotions — additional EBITDA headwind',
      ],
    },
    {
      id: 'frontier-synergy-acceleration',
      name: 'Frontier Synergy Acceleration',
      icon: 'Sparkles',
      description: 'Integration completes Q2 2026 (one quarter ahead). Cross-sell ramp delivers $1B synergies in Year 1. FCF exceeds guidance by $1B+.',
      leverSettings: {
        'wireless-service-growth': 2.8,
        'arpa-change': 1.5,
        'postpaid-net-adds': 100,
        'churn-rate': 0.87,
        'fwa-net-adds': 200,
        'frontier-synergies': 1000,
        'ai-savings': 250,
        'capex-intensity': 12.5,
        'competitive-price-pressure': -40,
      },
      revenueImpact: 1500,
      marginImpact: 120,
      confidence: 20,
      keyAssumptions: [
        'OSS/BSS integration completes Q2 2026 — one quarter ahead of Q3 2026 target',
        'Cross-sell wireless to Frontier fiber base ramps faster — 15% penetration by year-end',
        'Procurement synergies (network equipment scale) realized ahead of plan',
        'Frontier brand removal earlier enables Verizon marketing scale economies',
        'Year 1 synergies $1.0B vs $500M base case — front-loaded to tech and procurement',
      ],
    },
  ],
};
