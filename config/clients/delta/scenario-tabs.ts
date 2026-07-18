// Scenario tab-specific lever and scenario configurations
// Each tab has its own set of levers and pre-built scenarios for domain-specific what-if modeling
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Lever defaults and pre-built scenario assumptions are sourced from
// Delta Air Lines public disclosures: Form 10-K (FY 2025); Form 10-Q
// (Q1 2026); Q1 2026 earnings press release and transcript; JPM
// Industrials Conference deck (3-5 yr Value Creation Framework).
//
// DISCLAIMER
// Lever min/max ranges and step sizes are scenario-engine UI parameters,
// not Delta-disclosed figures. Pre-built scenario revenue/margin impact
// estimates and confidence percentages are editorial calibrations that
// reference Delta strategy commentary. Actual modeling outcomes would
// flow through the live scenario engine against current operating data.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────

export interface TabScenarioLever {
  id: string;
  name: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export interface TabPreBuiltScenario {
  id: string;
  name: string;
  description: string;
  leverSettings: Record<string, number>;
  revenueImpact: number;     // $M delta
  marginImpact: number;      // bps delta
  confidence: number;
  keyAssumptions: string[];
}

export interface ScenarioTabConfig {
  tabId: string;
  label: string;
  icon: string;
  description: string;
  levers: TabScenarioLever[];
  preBuiltScenarios: TabPreBuiltScenario[];
}

// ─── Tab 2: Fleet & Capacity ─────────────────────────────────────
export const fleetCapacityTab: ScenarioTabConfig = {
  tabId: 'fleet-capacity',
  label: 'Fleet & Capacity',
  icon: 'Plane',
  description: 'Model fleet renewal pace, capacity growth, premium seat share evolution, fuel efficiency gains, and retirement timing',
  levers: [
    {
      id: 'aircraft-deliveries',
      name: 'Aircraft Deliveries (per quarter)',
      category: 'Fleet Renewal',
      min: 4, max: 15, default: 8, step: 1,
      unit: 'aircraft / quarter',
      description: 'New aircraft deliveries per quarter (Q1 2026 actual: 8). 343 firm orders + 126 options at 3/31/26.',
      impact: 'high',
    },
    {
      id: 'capacity-growth-yoy',
      name: 'Capacity Growth (ASMs)',
      category: 'Capacity',
      min: -5, max: 8, default: 0, step: 0.5,
      unit: '% YoY',
      description: 'Year-over-year ASM growth. FY 2025 +3%; Q2 2026 flat with downward bias until fuel improves.',
      impact: 'high',
    },
    {
      id: 'premium-seat-share',
      name: 'Premium Seat Share (Fleet Avg)',
      category: 'Fleet Configuration',
      min: 30, max: 55, default: 37, step: 1,
      unit: '%',
      description: 'Average premium seats as % of total seats across mainline fleet. New aircraft: ~50%; retiring aircraft: ~30%.',
      impact: 'high',
    },
    {
      id: 'fuel-efficiency-gain',
      name: 'Fuel Efficiency Improvement',
      category: 'Sustainability',
      min: 0, max: 5, default: 1, step: 0.25,
      unit: '% / yr',
      description: 'Annual fuel-burn savings (operational + fleet renewal). FY 2025: 55M gallons saved vs 2019 (>$125M annual savings).',
      impact: 'medium',
    },
    {
      id: 'retirement-pace',
      name: 'Retirement Pace (older fleet)',
      category: 'Fleet Renewal',
      min: 0, max: 30, default: 15, step: 5,
      unit: 'aircraft / yr',
      description: 'Annual retirement of older aircraft (B-757, B-767-300ER, A319, etc.). Average mainline fleet age 15.0 yrs at 3/31/26.',
      impact: 'medium',
    },
    {
      id: 'load-factor',
      name: 'Load Factor',
      category: 'Capacity',
      min: 75, max: 90, default: 84, step: 0.5,
      unit: '%',
      description: 'Quarterly load factor (RPMs / ASMs). FY 2025 84%; Q1 2026 81.6%.',
      impact: 'high',
    },
    {
      id: 'utilization',
      name: 'Aircraft Utilization (block hours)',
      category: 'Asset Efficiency',
      min: 8, max: 13, default: 11, step: 0.25,
      unit: 'hrs / day',
      description: 'Average daily block hours per mainline aircraft. Industry benchmark: 10-12 narrow-body, 15-16 wide-body (McKinsey 2025).',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'accelerated-renewal',
      name: 'Accelerated Fleet Renewal',
      description: 'Bring forward A350-1000 and A330-900neo deliveries; accelerate retirement of older B-757 / B-767-300ER. Premium seat share rises faster.',
      leverSettings: {
        'aircraft-deliveries': 11,
        'capacity-growth-yoy': 2,
        'premium-seat-share': 42,
        'fuel-efficiency-gain': 2.5,
        'retirement-pace': 25,
        'load-factor': 84,
        'utilization': 11.5,
      },
      revenueImpact: 1500,
      marginImpact: 180,
      confidence: 50,
      keyAssumptions: [
        'OEM deliveries accelerate vs current ~2,000-aircraft global shortage',
        'Premium seat share reaches 42% (vs 37% baseline)',
        'Fuel efficiency 2.5%/yr; full-fleet annual fuel savings >$200M',
        'Older fleet exits accelerated by 25 aircraft/yr',
        'Capex increases ~15% above $5.5B baseline',
      ],
    },
    {
      id: 'capacity-discipline',
      name: 'Capacity Discipline (Sustained)',
      description: 'Hold capacity flat or slightly negative through 2026 in response to fuel volatility. Trim off-peak / red-eye flying. Yield expansion.',
      leverSettings: {
        'aircraft-deliveries': 6,
        'capacity-growth-yoy': -1,
        'premium-seat-share': 38,
        'fuel-efficiency-gain': 1.0,
        'retirement-pace': 20,
        'load-factor': 86,
        'utilization': 10.5,
      },
      revenueImpact: 600,
      marginImpact: 220,
      confidence: 60,
      keyAssumptions: [
        'Fuel persistence at $4+/gal forces continued capacity discipline',
        'Off-peak / red-eye flying cut (15-20% less valuable per CCO)',
        'Yield expansion offsets ASM reduction',
        'Load factor benefits from supply tightness',
        'Industry rationalization accelerates Delta share gain',
      ],
    },
    {
      id: 'aggressive-growth',
      name: 'Aggressive Growth',
      description: 'Fuel normalizes; Delta returns to ~5% capacity growth, exercises options. Premium expansion and international growth lead.',
      leverSettings: {
        'aircraft-deliveries': 12,
        'capacity-growth-yoy': 5,
        'premium-seat-share': 40,
        'fuel-efficiency-gain': 1.5,
        'retirement-pace': 12,
        'load-factor': 84,
        'utilization': 11.5,
      },
      revenueImpact: 2200,
      marginImpact: 60,
      confidence: 35,
      keyAssumptions: [
        'Fuel returns to $2.50-3.00/gal range',
        'Delta exercises 30+ A321neo options',
        'International capacity expansion (Atlantic + Pacific)',
        'Premium product expansion outpaces capacity adds',
        'CASM-Ex stays in low-single-digit growth range',
      ],
    },
  ],
};

// ─── Tab 3: Revenue Growth Pillars ──────────────────────────────────────────
export const revenueGrowthTab: ScenarioTabConfig = {
  tabId: 'revenue-growth',
  label: 'Revenue Growth Pillars',
  icon: 'TrendingUp',
  description: 'Model Delta\'s diverse-revenue growth pillars: premium products, AmEx co-brand loyalty, Delta TechOps MRO, corporate sales, and cargo',
  levers: [
    {
      id: 'premium-revenue-growth',
      name: 'Premium Product Revenue Growth',
      category: 'Premium',
      min: -5, max: 25, default: 14, step: 1,
      unit: '% YoY',
      description: 'Premium-product ticket revenue growth (Delta One, First Class, Premium Select, Comfort+). Q1 2026 +14%; FY 2025 +7%.',
      impact: 'high',
    },
    {
      id: 'amex-remuneration-growth',
      name: 'AmEx Remuneration Growth',
      category: 'Loyalty',
      min: -5, max: 20, default: 11, step: 1,
      unit: '% YoY',
      description: 'AmEx co-brand remuneration growth. FY 2025 $8.2B (+11%); long-term target $10B.',
      impact: 'high',
    },
    {
      id: 'mro-revenue-growth',
      name: 'Delta TechOps MRO Growth',
      category: 'MRO',
      min: 0, max: 200, default: 50, step: 5,
      unit: '% YoY',
      description: 'Third-party MRO revenue growth. FY 2025 $822M (+25%); FY 2026 outlook $1.2B (>50%).',
      impact: 'medium',
    },
    {
      id: 'corporate-sales-growth',
      name: 'Corporate Sales Growth',
      category: 'Corporate',
      min: -10, max: 25, default: 10, step: 1,
      unit: '% YoY',
      description: 'Corporate-contracted ticket sales growth. Q1 2026 record quarter; double-digit across all sectors.',
      impact: 'high',
    },
    {
      id: 'main-cabin-growth',
      name: 'Main Cabin Revenue Growth',
      category: 'Main Cabin',
      min: -15, max: 15, default: 1, step: 1,
      unit: '% YoY',
      description: 'Main cabin ticket revenue growth. Q1 2026 +1% (first positive since 2024). FY 2025 -5%.',
      impact: 'medium',
    },
    {
      id: 'cargo-revenue-growth',
      name: 'Cargo Revenue Growth',
      category: 'Cargo',
      min: -10, max: 25, default: 9, step: 1,
      unit: '% YoY',
      description: 'Belly-cargo revenue growth (Asia-led from new widebody capacity). Q1 2026 +9%.',
      impact: 'low',
    },
    {
      id: 'travel-related-services',
      name: 'Travel-Related Services Growth',
      category: 'Ancillary',
      min: -5, max: 15, default: 7, step: 1,
      unit: '% YoY',
      description: 'Travel-related services within passenger revenue (baggage, seat selection, etc.).',
      impact: 'low',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'premium-amex-acceleration',
      name: 'Premium + AmEx Acceleration',
      description: 'Premium segmentation rollout completes; AmEx remuneration grows toward $10B target faster than guidance. Diverse revenue >65%.',
      leverSettings: {
        'premium-revenue-growth': 15,
        'amex-remuneration-growth': 14,
        'mro-revenue-growth': 55,
        'corporate-sales-growth': 12,
        'main-cabin-growth': 3,
        'cargo-revenue-growth': 10,
        'travel-related-services': 9,
      },
      revenueImpact: 2400,
      marginImpact: 200,
      confidence: 50,
      keyAssumptions: [
        'AmEx remuneration trajectory $8.2B → $10B by 2027 (vs "next few years")',
        'Premium revenue growth sustained at 12-15% through 2026',
        'Diverse revenue streams >65% of adjusted revenue (vs 62% baseline)',
        'Q1 2026 corporate sales record momentum continues',
        'Delta Sync 110M+ logins target met; cardholder spend +12%',
      ],
    },
    {
      id: 'mro-breakout',
      name: 'MRO Margin Breakout',
      description: 'Delta TechOps revenue scales toward $2B+ multi-year target with mid-teens operating margin. LEAP-1A/B leadership monetizes.',
      leverSettings: {
        'premium-revenue-growth': 10,
        'amex-remuneration-growth': 11,
        'mro-revenue-growth': 80,
        'corporate-sales-growth': 8,
        'main-cabin-growth': 2,
        'cargo-revenue-growth': 8,
        'travel-related-services': 6,
      },
      revenueImpact: 1100,
      marginImpact: 130,
      confidence: 55,
      keyAssumptions: [
        'MRO revenue $822M → $1.5B by 2027 (ahead of guidance)',
        'Engine work scopes lead margin expansion (mid-teens target)',
        'LEAP-1A and LEAP-1B leadership maintained vs other airline MROs',
        'Backlog conversion stays strong with airline industry fleet renewal',
      ],
    },
    {
      id: 'main-cabin-pressure',
      name: 'Main Cabin Pricing Pressure',
      description: 'Industry capacity pressure on main cabin keeps yields flat; ULCC capacity adds re-pressure premium-vs-main differential. Diverse revenue carries the weight.',
      leverSettings: {
        'premium-revenue-growth': 8,
        'amex-remuneration-growth': 10,
        'mro-revenue-growth': 40,
        'corporate-sales-growth': 6,
        'main-cabin-growth': -3,
        'cargo-revenue-growth': 6,
        'travel-related-services': 4,
      },
      revenueImpact: -200,
      marginImpact: -40,
      confidence: 45,
      keyAssumptions: [
        'Main cabin revenue declines 3% (vs +1% baseline)',
        'ULCC competitive capacity adds re-pressure pricing',
        'Premium segment continues to outperform but at lower rate',
        'AmEx and MRO continue to support overall growth',
      ],
    },
  ],
};

// ─── Tab 4: Global Network ──────────────────────────────────────────────
export const globalNetworkTab: ScenarioTabConfig = {
  tabId: 'global-network',
  label: 'Global Network',
  icon: 'Globe',
  description: 'Model geographic passenger revenue growth across Domestic, Atlantic, Latin America, Pacific entities + JV partner contributions + FX exposure',
  levers: [
    {
      id: 'domestic-growth',
      name: 'Domestic Passenger Growth',
      category: 'Domestic',
      min: -10, max: 15, default: 1, step: 1,
      unit: '% YoY',
      description: 'Domestic passenger revenue growth. FY 2025 +1%; Q1 2026 +8%. ~71% of passenger revenue.',
      impact: 'high',
    },
    {
      id: 'atlantic-growth',
      name: 'Atlantic Revenue Growth',
      category: 'Atlantic',
      min: -10, max: 20, default: 2, step: 1,
      unit: '% YoY',
      description: 'Atlantic passenger revenue growth. "Largest and most profitable international entity." FY 2025 +2%; Q1 2026 +11%.',
      impact: 'high',
    },
    {
      id: 'latam-growth',
      name: 'Latin America Revenue Growth',
      category: 'Latin America',
      min: -15, max: 15, default: 0, step: 1,
      unit: '% YoY',
      description: 'Latin America passenger revenue growth. FY 2025 flat; Q1 2026 flat (Mexico leisure weakness offset by Caribbean/SA strength).',
      impact: 'medium',
    },
    {
      id: 'pacific-growth',
      name: 'Pacific Revenue Growth',
      category: 'Pacific',
      min: -10, max: 25, default: 10, step: 1,
      unit: '% YoY',
      description: 'Pacific passenger revenue growth. FY 2025 +10%; Q1 2026 +10%. Korean Air JV (~15% Hanjin-KAL).',
      impact: 'medium',
    },
    {
      id: 'jv-equity-mtm',
      name: 'JV Equity MTM Impact',
      category: 'Equity Investments',
      min: -1500, max: 1500, default: 0, step: 50,
      unit: '$M',
      description: 'Mark-to-market impact on equity investments (Virgin Atlantic 49%, Aeromexico 19%, LATAM 11%, Hanjin-KAL ~15%, China Eastern 2%, WestJet 12.7%). FY 2025 +$1,212M; Q1 2026 -$550M.',
      impact: 'medium',
    },
    {
      id: 'fx-impact',
      name: 'FX Revenue Translation Impact',
      category: 'Currency',
      min: -5, max: 5, default: 0, step: 0.25,
      unit: '%',
      description: 'Blended foreign-currency translation impact on international revenue (EUR, GBP, JPY, KRW, MXN dominant).',
      impact: 'low',
    },
    {
      id: 'aeromexico-jv-status',
      name: 'Aeromexico JV Status',
      category: 'Regulatory',
      min: 0, max: 100, default: 75, step: 5,
      unit: '% benefit retained',
      description: 'Percentage of Aeromexico JV economic benefit retained pending DOT antitrust appeal (Court stay granted Nov 2025).',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'international-acceleration',
      name: 'International Acceleration',
      description: 'New 2026 routes (BOS-MAD, BOS-NCE, JFK-OPO, JFK-OLB) + SLC-ICN drive Atlantic and Pacific outperformance. JV partners contribute strongly.',
      leverSettings: {
        'domestic-growth': 4,
        'atlantic-growth': 11,
        'latam-growth': 2,
        'pacific-growth': 14,
        'jv-equity-mtm': 200,
        'fx-impact': 1,
        'aeromexico-jv-status': 75,
      },
      revenueImpact: 1800,
      marginImpact: 100,
      confidence: 50,
      keyAssumptions: [
        'New Atlantic routes ramp ahead of schedule',
        'Pacific +14% on Korean Air JV strength + China capacity',
        'Aeromexico JV retains stay through 2026',
        'FX modestly favorable',
      ],
    },
    {
      id: 'aeromexico-loss',
      name: 'Aeromexico Antitrust Loss',
      description: 'DOT termination of Aeromexico antitrust immunity is upheld on appeal. JV economics partially impaired through wind-down. Capacity redirected.',
      leverSettings: {
        'domestic-growth': 1,
        'atlantic-growth': 3,
        'latam-growth': -8,
        'pacific-growth': 10,
        'jv-equity-mtm': -300,
        'fx-impact': -0.5,
        'aeromexico-jv-status': 25,
      },
      revenueImpact: -600,
      marginImpact: -45,
      confidence: 35,
      keyAssumptions: [
        'Aeromexico antitrust immunity loss confirmed in appeal',
        '~75% of JV synergies wind down by mid-2027',
        'Equity stake (~19%) carries MTM markdown',
        'LATAM JV (Delta owns ~11%) remains intact and grows share',
      ],
    },
    {
      id: 'pacific-leadership',
      name: 'Pacific Market Leadership',
      description: 'Korean Air JV expansion + China capacity rebuild + Japan demand drive Pacific to outsized growth. Atlantic stable; LatAm muted.',
      leverSettings: {
        'domestic-growth': 1,
        'atlantic-growth': 3,
        'latam-growth': 0,
        'pacific-growth': 18,
        'jv-equity-mtm': 100,
        'fx-impact': -0.5,
        'aeromexico-jv-status': 75,
      },
      revenueImpact: 900,
      marginImpact: 70,
      confidence: 50,
      keyAssumptions: [
        'Pacific revenue grows 18% (vs 10% baseline)',
        'Korean Air JV adds 1-2 new transcon US-Asia routes',
        'China capacity rebuilds as bilateral relations stabilize',
        'Japan premium leisure continues to outperform',
      ],
    },
  ],
};

// ─── Tab 5: Digital & AI ────────────────────────────────────────
export const digitalAITab: ScenarioTabConfig = {
  tabId: 'digital-ai',
  label: 'Digital & AI',
  icon: 'Sparkles',
  description: 'Model Delta\'s digital transformation: Delta Sync platform engagement, Delta Concierge AI rollout, AWS cloud completion, Wi-Fi expansion, and operational AI automation savings',
  levers: [
    {
      id: 'delta-sync-logins',
      name: 'Delta Sync Customer Logins',
      category: 'Digital Platform',
      min: 50, max: 200, default: 110, step: 5,
      unit: 'M / yr',
      description: 'Annual Delta Sync customer logins. Expected 110M+ in 2026 per CEO commentary.',
      impact: 'medium',
    },
    {
      id: 'concierge-adoption',
      name: 'Delta Concierge AI Adoption',
      category: 'GenAI',
      min: 0, max: 100, default: 10, step: 5,
      unit: '% SkyMiles members',
      description: 'Percentage of SkyMiles members actively using Delta Concierge AI assistant. Beta launched April 2026.',
      impact: 'high',
    },
    {
      id: 'wifi-aircraft-coverage',
      name: 'Free Wi-Fi Aircraft Coverage',
      category: 'In-Flight Experience',
      min: 1000, max: 2000, default: 1200, step: 50,
      unit: 'aircraft',
      description: 'Aircraft equipped with free Wi-Fi for SkyMiles members. 1,000th milestone Dec 2025; 1,200+ as of Q1 2026.',
      impact: 'medium',
    },
    {
      id: 'aws-migration-pct',
      name: 'AWS Cloud Migration Completion',
      category: 'Infrastructure',
      min: 60, max: 100, default: 85, step: 5,
      unit: '%',
      description: 'Percentage of technology infrastructure migrated to AWS cloud. Announced 2022; "mostly complete" as of 2025-26.',
      impact: 'medium',
    },
    {
      id: 'ai-operational-savings',
      name: 'Operational AI Cost Savings',
      category: 'Operations',
      min: 0, max: 30, default: 5, step: 1,
      unit: '% / yr',
      description: 'Operational cost savings from AI use cases (bag routing, gating decisions, predictive maintenance).',
      impact: 'medium',
    },
    {
      id: 'amex-cardholder-spend-growth',
      name: 'AmEx Cardholder Spend Growth',
      category: 'Loyalty Engagement',
      min: -5, max: 25, default: 12, step: 1,
      unit: '% YoY',
      description: 'Year-over-year cardholder spend growth on Delta-AmEx co-brand. Q1 2026 +12%. Leading indicator for AmEx remuneration.',
      impact: 'high',
    },
    {
      id: 'amazon-leo-coverage',
      name: 'Amazon Leo LEO Wi-Fi Coverage',
      category: 'Future Connectivity',
      min: 0, max: 1500, default: 500, step: 100,
      unit: 'aircraft',
      description: 'Amazon Leo LEO satellite Wi-Fi installation footprint. Initial 500 aircraft starting 2028.',
      impact: 'low',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'genai-leadership',
      name: 'GenAI Leadership',
      description: 'Delta Concierge scales rapidly post-beta; AWS migration completes; operational AI delivers margin expansion. Delta becomes the digital-first airline.',
      leverSettings: {
        'delta-sync-logins': 130,
        'concierge-adoption': 35,
        'wifi-aircraft-coverage': 1500,
        'aws-migration-pct': 100,
        'ai-operational-savings': 12,
        'amex-cardholder-spend-growth': 14,
        'amazon-leo-coverage': 500,
      },
      revenueImpact: 1200,
      marginImpact: 200,
      confidence: 45,
      keyAssumptions: [
        'Delta Concierge GA in 2026; 35% SkyMiles member adoption by YE',
        'AWS migration 100% complete; legacy datacenter decommissioned',
        'Operational AI savings 12% (bag, gating, maintenance)',
        'Cardholder spend +14% (vs +12% baseline)',
        'Amazon Leo LEO Wi-Fi rolls out as planned',
      ],
    },
    {
      id: 'measured-digital',
      name: 'Measured Digital Buildout',
      description: 'Steady technology adoption with focus on highest-ROI initiatives. Delta Concierge ramps gradually; AI operational savings reinvested in talent.',
      leverSettings: {
        'delta-sync-logins': 115,
        'concierge-adoption': 18,
        'wifi-aircraft-coverage': 1300,
        'aws-migration-pct': 95,
        'ai-operational-savings': 7,
        'amex-cardholder-spend-growth': 11,
        'amazon-leo-coverage': 500,
      },
      revenueImpact: 500,
      marginImpact: 120,
      confidence: 65,
      keyAssumptions: [
        'Concierge adoption grows 5pp/quarter from beta launch',
        'AWS migration last 5% takes longer than expected',
        'AI savings reinvested partially in talent and platforms',
        'Cardholder spend stays at FY 2025 pace',
      ],
    },
    {
      id: 'tech-execution-risk',
      name: 'Tech Execution Risk',
      description: 'Concierge user-experience issues delay GA; AWS migration faces unexpected friction; CrowdStrike-style vendor outage recurs. Cyber risk elevated.',
      leverSettings: {
        'delta-sync-logins': 95,
        'concierge-adoption': 5,
        'wifi-aircraft-coverage': 1200,
        'aws-migration-pct': 75,
        'ai-operational-savings': 2,
        'amex-cardholder-spend-growth': 8,
        'amazon-leo-coverage': 250,
      },
      revenueImpact: -400,
      marginImpact: -80,
      confidence: 30,
      keyAssumptions: [
        'Concierge GA delayed past 2026',
        'AWS migration stalls at 75%',
        'Vendor IT incident causes ~$200M revenue impact',
        'Cardholder spend growth decelerates to 8%',
        'CDTO Duggirala team rebuilds resilience',
      ],
    },
  ],
};

// All tab configs for easy iteration
export const allScenarioTabs: ScenarioTabConfig[] = [
  fleetCapacityTab,
  revenueGrowthTab,
  globalNetworkTab,
  digitalAITab,
];
