// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/scenarios.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Baker Hughes Company public disclosures: Form 10-K (FY2025); Form 10-Q
// (Q1 2026); Q1 2026 earnings call (Apr 24, 2026); FY2026 guidance.
// Scenario levers cover both OFSE (oil price/rig count dependent) and IET
// (LNG/data center driven) segments. Baseline = FY2026 management guidance.
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { ScenarioConfig } from '../../types';

export const scenarios: ScenarioConfig = {
  // FY2026 full-year baseline based on management guidance midpoint
  // IET guidance ≥$13.0B revenue + OFSE guidance ≥$13.0B revenue = ~$26B [CITED:EC-Q1-26]
  baselineRevenue: 26.0,               // FY2026 est. total revenue $B (management guidance) [ASSUMED]
  baselineMargin: 19.3,                // FY2026 Adj. EBITDA margin % (IET + OFSE blended) [ASSUMED]

  levers: [
    // ─── IET / Gas Technology ───
    {
      id: 'iet-orders-growth',
      name: 'IET Orders Growth Rate',
      category: 'IET Gas Technology',
      min: -10,
      max: 40,
      default: 15,                     // FY2026 guidance ≥$14.5B IET orders vs ~$13.5B FY2025 [ASSUMED]
      step: 1,
      unit: '% YoY',
      description: 'Year-over-year growth in IET total orders. FY2026 guidance ≥$14.5B (est. +15%). Driven by LNG FIDs, CTS data center power, and GTS LTSA renewals. Each +5% order growth ≈ +$650M revenue 12–24 months forward.',
      impact: 'high',
    },
    {
      id: 'cts-quarterly-orders',
      name: 'CTS Quarterly Orders (Data Center & New Energy)',
      category: 'IET Gas Technology',
      min: 200,
      max: 2000,
      default: 1000,                   // $1B+/quarter target [CITED:EC-Q1-26]
      step: 50,
      unit: '$M/quarter',
      description: 'Climate Technology Solutions quarterly order intake. Q1 2026 actual $1,257M (9x YoY). BKR target ≥$1B/quarter sustained. Aeroderivative supply constraints cap upside near-term. High confidence in $800M–$1.2B quarterly range.',
      impact: 'high',
    },
    {
      id: 'gte-revenue-growth',
      name: 'Gas Technology Equipment Revenue Growth',
      category: 'IET Gas Technology',
      min: -5,
      max: 25,
      default: 12,                     // est. FY2026 trajectory from IET guidance [ASSUMED]
      step: 1,
      unit: '% YoY',
      description: 'Gas Technology Equipment annual revenue growth. Q1 2026 +14% YoY ($1,665M). Driven by LNG train deliveries, gas compression equipment, and turbomachinery. RPO $33.1B provides 2–3 year visibility. Each +1% GTE growth ≈ +$66M annual revenue.',
      impact: 'high',
    },
    {
      id: 'gts-margin-expansion',
      name: 'Gas Technology Services Margin Expansion',
      category: 'IET Gas Technology',
      min: -100,
      max: 300,
      default: 100,                    // GTS mix growing toward higher-margin services [ASSUMED]
      step: 25,
      unit: 'bps YoY',
      description: 'Gas Technology Services EBITDA margin improvement in basis points. GTS (LTSAs, aftermarket) is highest-margin IET product line — scale and mix shift drive expansion. Every +50bps GTS margin ≈ +$20M IET EBITDA annually.',
      impact: 'medium',
    },
    // ─── OFSE / Oilfield Services ───
    {
      id: 'brent-crude-price',
      name: 'Brent Crude Oil Price',
      category: 'OFSE / Oilfield Services',
      min: 50,
      max: 110,
      default: 72,                     // est. FY2026 consensus Brent [ASSUMED]
      step: 2,
      unit: '$/bbl',
      description: 'Brent crude oil price assumption for OFSE revenue sensitivity. OFSE revenue correlates with oil price with ~6-month lag. Every +$10/bbl sustained ≈ +$150–200M OFSE revenue (1–1.5% of segment revenue). <$60/bbl triggers meaningful E&P capex cuts.',
      impact: 'high',
    },
    {
      id: 'international-rig-count-growth',
      name: 'International Rig Count Growth',
      category: 'OFSE / Oilfield Services',
      min: -10,
      max: 15,
      default: 5,                      // est. FY2026 international rig count growth [ASSUMED]
      step: 1,
      unit: '% YoY',
      description: 'International rig count year-over-year change. Q1 2026 international rig count +20% YoY (1,083 vs 903). BKR OFSE international revenue closely tracks this metric. Each +5% international rig count ≈ +$130M OFSE annual revenue.',
      impact: 'high',
    },
    {
      id: 'ofse-cost-savings',
      name: 'OFSE Cost-Out Program Savings',
      category: 'OFSE / Oilfield Services',
      min: 0,
      max: 400,
      default: 150,                    // est. FY2026 OFSE cost-out program run-rate [ASSUMED]
      step: 25,
      unit: '$M annual savings',
      description: 'OFSE structural cost reduction program annualized savings. Q1 2026 restructuring $37M ($11M OFSE + $28M IET). Management targeting margin improvement despite volume headwinds. Every $50M OFSE cost-out ≈ +25bps OFSE EBITDA margin.',
      impact: 'medium',
    },
    // ─── Chart Industries / M&A ───
    {
      id: 'chart-synergies',
      name: 'Chart Industries Integration Synergies',
      category: 'Chart Acquisition',
      min: 0,
      max: 500,
      default: 100,                    // Year 1 synergy estimate post-close [ASSUMED]
      step: 25,
      unit: '$M annual run-rate',
      description: 'Chart Industries post-acquisition cost and revenue synergies. BKR expects synergies from procurement scale, cross-sell (Chart cryogenic + BKR GTE LNG train), and SG&A overlap reduction. Full synergy potential $300–500M by Year 3. Year 1 target ~$100M.',
      impact: 'high',
    },
    {
      id: 'chart-close-timing',
      name: 'Chart Close & Integration Timing',
      category: 'Chart Acquisition',
      min: 0,
      max: 4,
      default: 1,                      // Q2 2026 close assumed; 1 = on time [CONFIG-ONLY]
      step: 1,
      unit: 'quarter delay',
      description: 'Quarters of delay to Chart Industries acquisition close relative to Q2 2026 base case. 0 = closes Q2 2026 on schedule; 1 = Q3 2026 close; 2 = Q4 2026 close. Each quarter delay = ~$200M revenue not consolidated, $40M EBITDA loss.',
      impact: 'medium',
    },
    // ─── Capital Allocation ───
    {
      id: 'capex-intensity',
      name: 'CapEx as % of Revenue',
      category: 'Capital Allocation',
      min: 3,
      max: 8,
      default: 5,                      // FY2026 guidance ≤5% of annual revenue [CITED:EC-Q1-26]
      step: 0.25,
      unit: '% of revenue',
      description: 'Annual CapEx as percentage of revenue. FY2026 guidance: capex ≤5% of annual revenue (~$26B). Q1 2026 capex $336M = 5.1% annualized. Asset-light model maintained. Every +1% of capex intensity (on $26B revenue) = -$260M FCF.',
      impact: 'medium',
    },
    // ─── Macro / Commodity ───
    {
      id: 'lng-fid-timing',
      name: 'LNG Final Investment Decisions (FIDs)',
      category: 'LNG Market',
      min: -3,
      max: 5,
      default: 2,                      // est. # of major LNG FIDs expected FY2026 [ASSUMED]
      step: 1,
      unit: '# new FIDs',
      description: 'Number of major LNG project final investment decisions in FY2026. Each major LNG FID ≈ $500M–$2B in GTE equipment orders entering IET RPO. Base case = 2 major FIDs. Upside = Qatar North Field expansion, US Gulf Coast LNG trains.',
      impact: 'high',
    },
  ],

  preBuiltScenarios: [
    {
      id: 'base-case',
      name: 'FY2026 Base Case — Management Guidance',
      icon: 'Target',
      description: 'Management FY2026 guidance midpoint. IET EBITDA ≥$2.7B, OFSE EBITDA ≥$2.325B, total Adj. EBITDA ~$5.0B+. Chart closes Q2 2026. Oil at ~$72/bbl. IET orders ≥$14.5B.',
      leverSettings: {
        'iet-orders-growth': 15,
        'cts-quarterly-orders': 1000,
        'gte-revenue-growth': 12,
        'gts-margin-expansion': 100,
        'brent-crude-price': 72,
        'international-rig-count-growth': 5,
        'ofse-cost-savings': 150,
        'chart-synergies': 100,
        'chart-close-timing': 0,
        'capex-intensity': 5,
        'lng-fid-timing': 2,
      },
      revenueImpact: 0,
      marginImpact: 0,
      confidence: 65,
      keyAssumptions: [
        'IET EBITDA ≥$2.7B FY2026 (IET margin ~20%+)',
        'OFSE EBITDA ≥$2.325B FY2026 despite volume headwinds (margin 17.5–18%)',
        'Chart Industries acquisition closes Q2 2026 on schedule; initial synergies $100M',
        'Brent crude ~$70–75/bbl sustained; international rig count +5% YoY',
        'CTS orders maintain $800M–$1.0B+ quarterly cadence from data center power',
      ],
    },
    {
      id: 'bull-case',
      name: 'Bull Case — LNG Supercycle + Data Center Surge',
      icon: 'TrendingUp',
      description: 'Multiple LNG FIDs accelerate, CTS data center orders sustain $1.5B+/quarter, OFSE recovers in H2. Chart synergies front-loaded. Adj. EBITDA approaches $5.8B.',
      leverSettings: {
        'iet-orders-growth': 30,
        'cts-quarterly-orders': 1500,
        'gte-revenue-growth': 20,
        'gts-margin-expansion': 200,
        'brent-crude-price': 85,
        'international-rig-count-growth': 10,
        'ofse-cost-savings': 250,
        'chart-synergies': 200,
        'chart-close-timing': 0,
        'capex-intensity': 4.5,
        'lng-fid-timing': 4,
      },
      revenueImpact: 2500,
      marginImpact: 130,
      confidence: 20,
      keyAssumptions: [
        '4+ major LNG FIDs in FY2026 (Qatar NFE, US Gulf LNG, East Africa); IET orders >$17B',
        'CTS data center power orders $1.5B+/quarter — hyperscalers accelerate turbine procurement',
        'Brent crude $80–90/bbl range — OPEC+ discipline; Middle East activity normalizes',
        'Chart synergies front-loaded to $200M Year 1; cross-sell LNG full-train wins',
        'OFSE Middle East recovery in H2 2026 as regional conflict impacts diminish',
      ],
    },
    {
      id: 'bear-case',
      name: 'Bear Case — Oil Price Shock + LNG Delay',
      icon: 'TrendingDown',
      description: 'Brent falls to $55–60/bbl on demand weakness. LNG FIDs slip to 2027. OFSE revenue -15% vs guidance. Chart integration challenges. Adj. EBITDA ~$4.2B.',
      leverSettings: {
        'iet-orders-growth': 2,
        'cts-quarterly-orders': 600,
        'gte-revenue-growth': 5,
        'gts-margin-expansion': 0,
        'brent-crude-price': 58,
        'international-rig-count-growth': -5,
        'ofse-cost-savings': 75,
        'chart-synergies': 25,
        'chart-close-timing': 2,
        'capex-intensity': 5.5,
        'lng-fid-timing': 0,
      },
      revenueImpact: -3200,
      marginImpact: -220,
      confidence: 15,
      keyAssumptions: [
        'Brent crude falls to $55–60/bbl on China demand slowdown or OPEC+ supply surge',
        'International rig count -5% as E&P budgets cut; OFSE revenue -15% vs guidance',
        'No major LNG FIDs in 2026 — permitting delays and gas pricing uncertainty',
        'CTS data center orders drop to $500–700M/quarter as hyperscalers pause',
        'Chart close delays to Q4 2026; integration challenges suppress synergy realization',
      ],
    },
    {
      id: 'lng-fid-delay',
      name: 'LNG FID Delay Scenario',
      icon: 'Clock',
      description: 'Major LNG projects slip to 2027 FIDs. GTE equipment order intake drops 20%. IET RPO growth stalls. CTS partially offsets. Adj. EBITDA ~$4.6B.',
      leverSettings: {
        'iet-orders-growth': 3,
        'cts-quarterly-orders': 1200,
        'gte-revenue-growth': 8,
        'gts-margin-expansion': 75,
        'brent-crude-price': 70,
        'international-rig-count-growth': 3,
        'ofse-cost-savings': 150,
        'chart-synergies': 100,
        'chart-close-timing': 0,
        'capex-intensity': 5,
        'lng-fid-timing': 0,
      },
      revenueImpact: -1500,
      marginImpact: -90,
      confidence: 20,
      keyAssumptions: [
        'No major new LNG FIDs in FY2026 — permits, regulatory delays, and gas price softness',
        'GTE orders drop 20% from base case; IET RPO growth stalls near $33B',
        'CTS partially offsets at $1.2B/quarter from data center power (aeroderivative)',
        'GTS services continue strong (+25% YoY) as installed base executes LTSAs',
        'BKR stock re-rates lower on IET order miss; management lowers FY2027 guidance',
      ],
    },
    {
      id: 'chart-upside',
      name: 'Chart Acquisition Upside — Full Integration',
      icon: 'Sparkles',
      description: 'Chart closes Q2 on schedule, cross-sell wins full LNG train orders (Chart cold box + BKR GTE turbomachinery). Synergies $300M Year 1. Adj. EBITDA ~$5.5B.',
      leverSettings: {
        'iet-orders-growth': 22,
        'cts-quarterly-orders': 1100,
        'gte-revenue-growth': 15,
        'gts-margin-expansion': 150,
        'brent-crude-price': 75,
        'international-rig-count-growth': 6,
        'ofse-cost-savings': 175,
        'chart-synergies': 300,
        'chart-close-timing': 0,
        'capex-intensity': 4.75,
        'lng-fid-timing': 3,
      },
      revenueImpact: 2000,
      marginImpact: 110,
      confidence: 25,
      keyAssumptions: [
        'Chart closes Q2 2026 on schedule; integration program delivers $300M Year 1 synergies',
        'Combined BKR+Chart wins full LNG modular train scope on 3+ major projects in 2026',
        'IET margin expansion to 22%+ as Chart higher-margin cryogenic products mix in',
        'Revenue synergies from Chart distribution network accessing new OFSE markets',
        '3 LNG FIDs capture $1.5B+ of combined GTE + Chart scope per project',
      ],
    },
  ],
};
