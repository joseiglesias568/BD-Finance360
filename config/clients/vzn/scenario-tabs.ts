// Scenario tab-specific lever and scenario configurations for BD Finance360
// Each tab has its own set of levers and pre-built scenarios for domain-specific what-if modeling
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
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
  revenueImpact: number;
  marginImpact: number;
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

// ─── Tab 2: Network & Coverage ──────────────────────────────────────
export const networkCoverageTab: ScenarioTabConfig = {
  tabId: 'network-coverage',
  label: 'Network & Coverage',
  icon: 'Radio',
  description: 'Model C-Band densification pace, FWA eligible household expansion, network quality improvements, and CapEx efficiency',
  levers: [
    {
      id: 'cband-coverage',
      name: 'C-Band Population Coverage (%)',
      category: 'Spectrum Deployment',
      min: 60, max: 99, default: 75, step: 1,
      unit: '% US pop',
      description: 'C-Band 5G population coverage. Current ~75%. Year-end 2026 target 90%. Directly drives FWA addressable households.',
      impact: 'high',
    },
    {
      id: 'fwa-eligible-households',
      name: 'FWA Eligible Households (M)',
      category: 'Fixed Wireless',
      min: 30, max: 60, default: 40, step: 2,
      unit: 'M households',
      description: 'Total US households eligible for Verizon FWA home internet. C-Band coverage expansion is primary driver.',
      impact: 'high',
    },
    {
      id: 'network-capex',
      name: 'Network CapEx ($B annual)',
      category: 'Capital Allocation',
      min: 12, max: 22, default: 18, step: 0.5,
      unit: '$B annual',
      description: 'Annual wireless network capital expenditure. FY2026 guidance $17.5B–$18.5B. Frontier fiber adds incremental spend.',
      impact: 'high',
    },
    {
      id: 'small-cell-deployment',
      name: 'New Small Cell Deployments (K/yr)',
      category: 'Network Densification',
      min: 5, max: 30, default: 15, step: 1,
      unit: 'K sites / yr',
      description: 'New small cell node deployments annually. Primary C-Band densification vehicle in urban/suburban markets.',
      impact: 'medium',
    },
    {
      id: 'vran-adoption',
      name: 'vRAN Adoption (% of sites)',
      category: 'Network Efficiency',
      min: 10, max: 80, default: 20, step: 5,
      unit: '% of cell sites',
      description: 'Virtualized RAN as % of all cell sites. Higher vRAN = lower network operating cost and faster software upgrades.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'accelerated-cband',
      name: 'Accelerated C-Band Densification',
      description: 'Double small cell deployment pace; reach 90% C-Band coverage by Q2 2026 (one quarter ahead). FWA eligible households expand to 48M.',
      leverSettings: {
        'cband-coverage': 92,
        'fwa-eligible-households': 48,
        'network-capex': 19.5,
        'small-cell-deployment': 25,
        'vran-adoption': 30,
      },
      revenueImpact: 1800,
      marginImpact: 60,
      confidence: 40,
      keyAssumptions: [
        'Site acquisition and zoning approvals accelerate (+30% faster)',
        'Equipment supply from Ericsson/Samsung not constrained',
        'FWA net adds increase to 900K+ FY2026 from larger eligible base',
        'CapEx increases $1.5B vs guidance — offset by FWA ARPU over 12–18 months',
        'C-Band quality parity with cable broadband achieved in key markets Q3 2026',
      ],
    },
    {
      id: 'capex-efficiency',
      name: 'CapEx Efficiency — Post-Peak Savings',
      description: 'C-Band peak investment behind us; network CapEx reduces to $16B with vRAN cost savings and shared infrastructure.',
      leverSettings: {
        'cband-coverage': 88,
        'fwa-eligible-households': 42,
        'network-capex': 16.0,
        'small-cell-deployment': 10,
        'vran-adoption': 45,
      },
      revenueImpact: 0,
      marginImpact: 150,
      confidence: 35,
      keyAssumptions: [
        'C-Band densification pace slows — coverage targets met with less spend',
        'vRAN at 45% of sites reduces ongoing network OpEx by ~$300M/yr',
        'FWA net adds moderate to 600K/yr as coverage expansion slows',
        'FCF improves $2B vs guidance from CapEx reduction',
        'Rating agencies view lower leverage trajectory positively',
      ],
    },
  ],
};

// ─── Tab 3: Wireless Business ────────────────────────────────────────
export const wirelessBusinessTab: ScenarioTabConfig = {
  tabId: 'wireless-business',
  label: 'Wireless Business',
  icon: 'Signal',
  description: 'Model wireless service revenue growth, ARPA trajectory, churn dynamics, and postpaid subscriber trends',
  levers: [
    {
      id: 'monthly-churn',
      name: 'Monthly Postpaid Phone Churn (%)',
      category: 'Subscriber Retention',
      min: 0.65, max: 1.20, default: 0.89, step: 0.01,
      unit: '%',
      description: 'Monthly postpaid phone churn rate. AT&T/T-Mobile benchmark ~0.82%. Every +1bps ≈ -$80M annualized revenue.',
      impact: 'high',
    },
    {
      id: 'arpa-monthly',
      name: 'ARPA ($/month)',
      category: 'Pricing & Mix',
      min: 125, max: 155, default: 139, step: 1,
      unit: '$/month',
      description: 'Average monthly revenue per postpaid account. Current ~$139. myPlan premium adoption is primary expansion driver.',
      impact: 'high',
    },
    {
      id: 'myplan-adoption',
      name: 'myPlan Premium Tier Adoption (%)',
      category: 'Pricing & Mix',
      min: 30, max: 85, default: 55, step: 5,
      unit: '% of postpaid base',
      description: 'Postpaid base on myPlan with ≥1 premium perk. Higher adoption → higher ARPA and lower churn.',
      impact: 'high',
    },
    {
      id: 'quarterly-net-adds',
      name: 'Postpaid Phone Net Adds (K/quarter)',
      category: 'Subscriber Growth',
      min: -300, max: 500, default: 55, step: 25,
      unit: 'K subscribers',
      description: 'Postpaid phone net subscriber adds per quarter. First positive Q1 since 2013 at +55K. T-Mobile averaging 1.3M+/quarter.',
      impact: 'high',
    },
    {
      id: 'mvno-wholesale-growth',
      name: 'MVNO Wholesale Revenue Growth (%)',
      category: 'Wholesale',
      min: -10, max: 15, default: 2, step: 1,
      unit: '% YoY',
      description: 'MVNO wholesale revenue growth (Spectrum Mobile, Xfinity Mobile, TracFone). Charter+Cox merger creates renegotiation risk at contract renewal.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'churn-parity',
      name: 'Churn Parity with AT&T/T-Mobile',
      description: 'C-Band quality improvements and myPlan ecosystem drive churn to 0.82% — parity with AT&T and T-Mobile. 60bps improvement = ~$840M annualized revenue benefit.',
      leverSettings: {
        'monthly-churn': 0.82,
        'arpa-monthly': 141,
        'myplan-adoption': 70,
        'quarterly-net-adds': 150,
        'mvno-wholesale-growth': 3,
      },
      revenueImpact: 900,
      marginImpact: 100,
      confidence: 35,
      keyAssumptions: [
        'C-Band 90%+ coverage eliminates network quality gap vs T-Mobile',
        'myPlan 70% adoption — sticky ecosystem reduces switching motivation',
        'Verizon competitive promotions maintain gross add competitiveness',
        'Postpaid phone net adds improve to +150K/quarter average',
        'T-Mobile does not launch new more aggressive pricing in response',
      ],
    },
    {
      id: 'price-war',
      name: 'T-Mobile Price War',
      description: 'T-Mobile launches $25/line promotion forcing Verizon to match. ARPA declines $3/mo; churn spikes to 0.97%. Wireless service revenue growth stalls at 1%.',
      leverSettings: {
        'monthly-churn': 0.97,
        'arpa-monthly': 136,
        'myplan-adoption': 50,
        'quarterly-net-adds': -100,
        'mvno-wholesale-growth': -2,
      },
      revenueImpact: -2200,
      marginImpact: -230,
      confidence: 20,
      keyAssumptions: [
        'T-Mobile $25/line promo forces Verizon to match or accept elevated churn',
        'ARPA compression as customers downgrade to promotional plans',
        'Net adds turn negative as T-Mobile takes 200K/quarter switching share',
        'myPlan adoption slows — customers unwilling to pay for perks at lower base prices',
        'EBITDA margin pressure from higher promotional spending',
      ],
    },
  ],
};

// ─── Tab 4: Broadband & Fiber ────────────────────────────────────────
export const broadbandFiberTab: ScenarioTabConfig = {
  tabId: 'broadband-fiber',
  label: 'Broadband & Fiber',
  icon: 'Wifi',
  description: 'Model FWA expansion, Fios penetration, Frontier integration progress, and fiber cross-sell dynamics',
  levers: [
    {
      id: 'fwa-quarterly-net-adds',
      name: 'FWA Quarterly Net Adds (K)',
      category: 'Fixed Wireless',
      min: 50, max: 600, default: 175, step: 25,
      unit: 'K / quarter',
      description: 'Fixed Wireless Access quarterly net adds. FY2026 guidance implies ~175K/quarter average. T-Mobile doing ~500K/quarter.',
      impact: 'high',
    },
    {
      id: 'fios-penetration-rate',
      name: 'Fios Fiber Penetration (% passings)',
      category: 'Fios Fiber',
      min: 25, max: 52, default: 38, step: 1,
      unit: '% of homes passed',
      description: 'Fios Internet subscribers / homes passed. Core territory ~43%, Frontier territory ~30% initial. Cross-sell improves blended rate.',
      impact: 'medium',
    },
    {
      id: 'frontier-crosssell-rate',
      name: 'Frontier Wireless Cross-Sell Rate (%)',
      category: 'Frontier Integration',
      min: 5, max: 40, default: 10, step: 2,
      unit: '% of Frontier fiber base',
      description: 'Verizon wireless take-rate among Frontier broadband customers. Early target ~15%; long-term goal ~25%. Each 5% = ~150K wireless net adds.',
      impact: 'high',
    },
    {
      id: 'fwa-arpu',
      name: 'FWA Monthly ARPU ($/month)',
      category: 'Fixed Wireless',
      min: 40, max: 65, default: 50, step: 1,
      unit: '$/month',
      description: 'Average monthly revenue per FWA subscriber. Current ~$50. Premium plans with higher speeds command $55–60/mo.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'fwa-leadership',
      name: 'FWA Market Leadership Regained',
      description: 'C-Band quality improvements drive FWA net adds to 500K+/quarter — matching T-Mobile pace. Total FWA subs reach 8M by Q4 2026.',
      leverSettings: {
        'fwa-quarterly-net-adds': 500,
        'fios-penetration-rate': 40,
        'frontier-crosssell-rate': 15,
        'fwa-arpu': 52,
      },
      revenueImpact: 2400,
      marginImpact: 80,
      confidence: 20,
      keyAssumptions: [
        'C-Band achieves quality parity with cable broadband in key suburban markets',
        'FWA marketing spend increases to capture cable-to-wireless switchers',
        'Frontier FWA launch in 31 new states adds incremental eligible market',
        'ARPU improves to $52 as premium speed tier adoption grows',
        'Competitive cable broadband pricing does not materially undercut FWA value proposition',
      ],
    },
    {
      id: 'frontier-crosssell-acceleration',
      name: 'Frontier Cross-Sell Acceleration',
      description: 'Frontier fiber customers adopt Verizon wireless at 20% rate by year-end 2026 (vs 10% base case). Adds ~300K wireless subscribers.',
      leverSettings: {
        'fwa-quarterly-net-adds': 200,
        'fios-penetration-rate': 42,
        'frontier-crosssell-rate': 20,
        'fwa-arpu': 51,
      },
      revenueImpact: 1200,
      marginImpact: 90,
      confidence: 30,
      keyAssumptions: [
        'Frontier re-branding to Fios accelerated to Q3 2026 (ahead of Q1 2027 plan)',
        'Bundle discount ($10/mo for wireless + fiber) drives rapid adoption',
        'Verizon wireless retail presence in 31 new Frontier states activates',
        'Frontier base has limited prior Verizon wireless exposure — greenfield opportunity',
        'Each wireless add in Frontier territory = $1,668/yr ARPA × 300K = ~$500M incremental',
      ],
    },
  ],
};

// Export all tabs for use in the scenario engine
export const scenarioTabs: ScenarioTabConfig[] = [
  networkCoverageTab,
  wirelessBusinessTab,
  broadbandFiberTab,
];
