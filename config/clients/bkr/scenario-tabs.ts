// Scenario tab-specific lever and scenario configurations for Baker Hughes Finance360
// Each tab has its own set of levers and pre-built scenarios for domain-specific what-if modeling
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
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

// ─── Tab 2: IET Gas Technology ───────────────────────────────────────
export const ietGasTechnologyTab: ScenarioTabConfig = {
  tabId: 'iet-gas-technology',
  label: 'IET Gas Technology',
  icon: 'Zap',
  description: 'Model LNG equipment orders, gas technology services growth, RPO trajectory, and IET margin expansion drivers',
  levers: [
    {
      id: 'lng-fid-count',
      name: 'LNG FIDs (Annual)',
      category: 'LNG Market',
      min: 0, max: 6, default: 2, step: 1,
      unit: '# major FIDs/year',
      description: 'Number of major LNG project final investment decisions per year. Each FID ≈ $500M–$2B in GTE orders entering IET RPO. Base case: 2 FIDs; Q1 2026 record $4.9B IET orders supports above-average FID cadence.',
      impact: 'high',
    },
    {
      id: 'gte-order-intake',
      name: 'GTE Quarterly Orders ($M)',
      category: 'GTE Equipment',
      min: 800, max: 3500, default: 1800, step: 100,
      unit: '$M / quarter',
      description: 'Gas Technology Equipment quarterly order intake. Q1 2026 GTE orders est. ~$1.8B. LNG train, gas compression, and turbomachinery orders. Each $200M quarterly GTE order improvement adds ~$800M annual forward revenue.',
      impact: 'high',
    },
    {
      id: 'gts-ltsa-renewal-rate',
      name: 'GTS LTSA Renewal Rate (%)',
      category: 'GTS Services',
      min: 70, max: 99, default: 90, step: 1,
      unit: '% renewal rate',
      description: 'Long-Term Service Agreement renewal rate for the GTE installed base. Current ~90% estimated. Each 5% improvement in renewal rate ≈ +$35M annual GTS revenue. High renewal = sustainable services flywheel.',
      impact: 'high',
    },
    {
      id: 'iet-margin-target',
      name: 'IET Adj. EBITDA Margin Target (%)',
      category: 'IET Margin',
      min: 18, max: 26, default: 21, step: 0.5,
      unit: '% EBITDA margin',
      description: 'IET segment Adj. EBITDA margin target. Q1 2026 actual 20.2%. Horizon 2 target ≥21%. Services mix (GTS/GTE ratio growing) and Chart synergies are primary expansion levers. Each +100bps IET margin ≈ +$135M IET EBITDA.',
      impact: 'high',
    },
    {
      id: 'aero-jv-supply-capacity',
      name: 'Aero JV Supply Capacity (% of demand)',
      category: 'Supply Chain',
      min: 50, max: 110, default: 80, step: 5,
      unit: '% supply coverage',
      description: 'GE Vernova 50/50 aero JV supply capacity as % of BKR demand. Current constrained (~80%). At 80%: some CTS data center orders face delivery delays. At 100%+: all demand fulfilled, upside orders possible.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'lng-fid-surge',
      name: 'LNG FID Surge — 4+ FIDs',
      description: 'Four or more major LNG FIDs in FY2026 (Qatar NFE, US Gulf Coast, East Africa, Asia). GTE orders $3B+/quarter. IET RPO grows toward $40B by end of year.',
      leverSettings: {
        'lng-fid-count': 4,
        'gte-order-intake': 2800,
        'gts-ltsa-renewal-rate': 92,
        'iet-margin-target': 21.5,
        'aero-jv-supply-capacity': 85,
      },
      revenueImpact: 2800,
      marginImpact: 140,
      confidence: 25,
      keyAssumptions: [
        '4 major LNG FIDs — Qatar North Field, 2x US Gulf Coast trains, Mozambique LNG restart',
        'GTE order intake $2.8B/quarter average — IET orders exceed $17B FY2026',
        'Aeroderivative supply partially constraining delivery but not order intake',
        'IET RPO grows from $33.1B to ~$38–40B by Q4 2026',
        'GTS LTSA renewals strong as customer confidence in LNG supercycle solidifies',
      ],
    },
    {
      id: 'iet-services-inflection',
      name: 'IET Services Mix Inflection',
      description: 'GTS services (LTSAs, aftermarket) grow to 55%+ of IET revenue, driving IET EBITDA margin to 22%+. GTE installed base compounding benefits fully materializing.',
      leverSettings: {
        'lng-fid-count': 2,
        'gte-order-intake': 1800,
        'gts-ltsa-renewal-rate': 95,
        'iet-margin-target': 22.5,
        'aero-jv-supply-capacity': 90,
      },
      revenueImpact: 800,
      marginImpact: 230,
      confidence: 35,
      keyAssumptions: [
        'GTS LTSA renewal rate improves to 95% as customer relationships deepen',
        'Services mix reaches 55% of IET — GTS revenue grows 35%+ YoY on installed base',
        'Chart Industries cryogenic services adds additional LTSA-like recurring revenue',
        'IET EBITDA margin reaches 22.5% — above Horizon 2 ≥21% target',
        'Long-term service agreement pricing improves 3–5% YoY on renewal',
      ],
    },
  ],
};

// ─── Tab 3: OFSE Oilfield Services ──────────────────────────────────
export const ofseOilfieldTab: ScenarioTabConfig = {
  tabId: 'ofse-oilfield',
  label: 'OFSE Oilfield Services',
  icon: 'Drill',
  description: 'Model oil price, rig count, OFSE cost structure, and geographic mix impacts on oilfield services performance',
  levers: [
    {
      id: 'brent-crude',
      name: 'Brent Crude Oil Price ($/bbl)',
      category: 'Oil Price',
      min: 45, max: 110, default: 72, step: 2,
      unit: '$/bbl',
      description: 'Brent crude oil price. Primary driver of E&P capex budgets and OFSE activity levels with ~6-month lag. Every +$10/bbl sustained ≈ +$150–200M OFSE annual revenue. <$60/bbl triggers meaningful E&P budget cuts.',
      impact: 'high',
    },
    {
      id: 'intl-rig-count',
      name: 'International Rig Count (avg quarterly)',
      category: 'Activity Level',
      min: 800, max: 1400, default: 1100, step: 25,
      unit: 'active rigs',
      description: 'International rig count quarterly average. Q1 2026: 1,083 (+20% YoY). BKR OFSE international revenue (71% of OFSE) correlates strongly. Every +50 international rigs ≈ +$65M OFSE quarterly revenue.',
      impact: 'high',
    },
    {
      id: 'na-rig-count',
      name: 'North America Rig Count (avg quarterly)',
      category: 'Activity Level',
      min: 500, max: 1000, default: 750, step: 25,
      unit: 'active rigs',
      description: 'North America rig count quarterly average. Q1 2026: 749 (-7% YoY). NA OFSE revenue ~29% of total OFSE. Every +50 NA rigs ≈ +$25M OFSE quarterly revenue.',
      impact: 'medium',
    },
    {
      id: 'ofse-cost-reduction',
      name: 'OFSE Cost Reduction Program ($M/yr)',
      category: 'Cost Structure',
      min: 0, max: 400, default: 150, step: 25,
      unit: '$M annual savings',
      description: 'OFSE structural cost reduction program annualized savings. Target $150–250M FY2026 from restructuring ($37M Q1 charges) and footprint optimization. Every $50M savings ≈ +25bps OFSE EBITDA margin.',
      impact: 'medium',
    },
    {
      id: 'middle-east-recovery',
      name: 'Middle East Activity Recovery (% of prior year)',
      category: 'Regional Mix',
      min: 70, max: 115, default: 95, step: 5,
      unit: '% of prior year activity',
      description: 'Middle East/Asia OFSE activity level as % of prior year. Q1 2026 was 81% of Q1 2025 (-19%). Recovery to 100% = ~+$200M quarterly OFSE revenue. Key customers: Saudi Aramco, ADNOC, PTTEP.',
      impact: 'high',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'ofse-recovery',
      name: 'OFSE Recovery — Middle East Normalization',
      description: 'Middle East activity returns to pre-disruption levels in H2 2026. International rig count sustains +15%. OFSE EBITDA margin improves to 18.5%.',
      leverSettings: {
        'brent-crude': 75,
        'intl-rig-count': 1150,
        'na-rig-count': 760,
        'ofse-cost-reduction': 200,
        'middle-east-recovery': 105,
      },
      revenueImpact: 1400,
      marginImpact: 100,
      confidence: 40,
      keyAssumptions: [
        'Regional conflict impacts diminish in H2 2026; Saudi Aramco and ADNOC activity normalizes',
        'International rig count holds at 1,150+ on sustained E&P budgets at $72–80/bbl',
        'OFSE cost-out program delivers $200M annualized savings by Q3 2026',
        'Brazil deepwater continues +6%+ YoY supporting LatAm growth',
        'OFSE EBITDA ≥$2.5B FY2026 — above ≥$2.325B guidance',
      ],
    },
    {
      id: 'oil-price-downturn',
      name: 'Oil Price Downturn — $55–60/bbl',
      description: 'Brent falls to $55–60/bbl. E&P capex budgets cut 15%. International rig count -10% to ~975. OFSE EBITDA misses guidance by $400M.',
      leverSettings: {
        'brent-crude': 58,
        'intl-rig-count': 975,
        'na-rig-count': 680,
        'ofse-cost-reduction': 100,
        'middle-east-recovery': 80,
      },
      revenueImpact: -2100,
      marginImpact: -190,
      confidence: 15,
      keyAssumptions: [
        'Brent sustained at $55–60/bbl from China demand weakness or OPEC+ supply surge',
        'International rig count -10% as E&P budgets cut; Middle East activity under further pressure',
        'NA rig count falls to 680 as US shale producers cut completions activity',
        'OFSE EBITDA misses ≥$2.325B guidance by ~$400M; restructuring accelerated',
        'BKR IET partially offsets (RPO-backed revenue) but total EBITDA guidance at risk',
      ],
    },
  ],
};

// ─── Tab 4: Chart Acquisition & Integration ─────────────────────────
export const chartIntegrationTab: ScenarioTabConfig = {
  tabId: 'chart-integration',
  label: 'Chart Acquisition',
  icon: 'Building2',
  description: 'Model Chart Industries acquisition close timing, synergy realization, leverage trajectory, and combined BKR+Chart IET portfolio impact',
  levers: [
    {
      id: 'chart-close-quarter',
      name: 'Chart Close Quarter (0=Q2, 1=Q3, 2=Q4)',
      category: 'Close Timing',
      min: 0, max: 3, default: 0, step: 1,
      unit: 'quarters delay from Q2',
      description: 'Quarters of delay to Chart close from Q2 2026 base case. Each quarter delay = ~$400M revenue not consolidated, ~$80M EBITDA impact, additional interest on $9.885B notes during wait.',
      impact: 'high',
    },
    {
      id: 'chart-revenue-contribution',
      name: 'Chart Annual Revenue Contribution ($B)',
      category: 'Financial Impact',
      min: 3.0, max: 5.0, default: 3.8, step: 0.1,
      unit: '$B annual revenue',
      description: 'Chart Industries annual revenue to be consolidated post-close. Chart FY2025 est. ~$3.8B. Combined BKR+Chart IET segment becomes ~$17B+ annual revenue base.',
      impact: 'high',
    },
    {
      id: 'chart-synergy-year1',
      name: 'Year 1 Synergies ($M)',
      category: 'Synergies',
      min: 0, max: 500, default: 100, step: 25,
      unit: '$M annual run-rate',
      description: 'Chart acquisition year-1 synergy run-rate. Sources: procurement scale, SG&A overlap reduction, cross-sell LNG full-train (Chart cryogenics + BKR GTE turbomachinery). Year 3 target $300–500M.',
      impact: 'high',
    },
    {
      id: 'chart-integration-costs',
      name: 'Integration Costs Year 1 ($M)',
      category: 'Integration',
      min: 50, max: 400, default: 150, step: 25,
      unit: '$M one-time costs',
      description: 'One-time Chart integration costs (systems, restructuring, re-branding, facility consolidation). Charged as adjusting items; impact on GAAP but not Adj. EBITDA.',
      impact: 'medium',
    },
    {
      id: 'post-chart-leverage',
      name: 'Post-Chart Net Leverage Target (x)',
      category: 'Balance Sheet',
      min: 1.5, max: 3.0, default: 2.0, step: 0.1,
      unit: 'x Net Debt/EBITDA',
      description: 'Net leverage post-Chart close target. Expected ~2.0x at close. FCF generation and Waygate divestiture ($1.45B) provide deleveraging path. Investment grade requires <2.5–3.0x.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'chart-on-schedule',
      name: 'Chart Closes On Schedule — Q2 2026',
      description: 'Chart closes Q2 2026 as planned. Year 1 synergies $100M. Combined IET becomes 65%+ of BKR revenue. FY2026 revenue ~$30B.',
      leverSettings: {
        'chart-close-quarter': 0,
        'chart-revenue-contribution': 3.8,
        'chart-synergy-year1': 100,
        'chart-integration-costs': 150,
        'post-chart-leverage': 2.0,
      },
      revenueImpact: 1900,
      marginImpact: 20,
      confidence: 55,
      keyAssumptions: [
        'All regulatory approvals obtained by Q2 2026 (US, EU, required jurisdictions)',
        'Chart FY2025 revenue ~$3.8B consolidated from Q2 close; ~$1.9B H2 2026 contribution',
        'Year 1 synergies $100M — procurement and SG&A rationalization beginning',
        'Chart IET margin accretive to BKR blended IET margin (cryogenic margins >20%)',
        'Net leverage ~2.0x post-close; Waygate proceeds ($1.45B) deleverages to ~1.6x by YE 2026',
      ],
    },
    {
      id: 'chart-synergy-acceleration',
      name: 'Chart Synergy Acceleration — Full-Train LNG Wins',
      description: 'BKR+Chart wins 3+ full LNG train contracts (Chart cold box + BKR GTE turbomachinery). Year 1 synergies $300M. IET margin expands to 22%+.',
      leverSettings: {
        'chart-close-quarter': 0,
        'chart-revenue-contribution': 4.0,
        'chart-synergy-year1': 300,
        'chart-integration-costs': 120,
        'post-chart-leverage': 1.9,
      },
      revenueImpact: 3000,
      marginImpact: 190,
      confidence: 25,
      keyAssumptions: [
        'BKR+Chart combined scope wins 3 major LNG modular train contracts in H2 2026',
        'Revenue synergies: Chart cold box + BKR GTE = $500M+ incremental per LNG project scope',
        'Procurement synergies front-loaded: combined IET buying power reduces COGS by $150M',
        'SG&A overlap from Chart being rapidly rationalized; duplicate functions eliminated in 2 quarters',
        'IET EBITDA margin reaches 22%+ as Chart higher-margin cryogenic products integrate',
      ],
    },
    {
      id: 'chart-delay',
      name: 'Chart Close Delays to Q4 2026',
      description: 'Regulatory delays push Chart close to Q4 2026. H2 revenue contribution minimal. Interest on $9.885B notes for 2 extra quarters (~$240M).',
      leverSettings: {
        'chart-close-quarter': 2,
        'chart-revenue-contribution': 3.8,
        'chart-synergy-year1': 50,
        'chart-integration-costs': 100,
        'post-chart-leverage': 2.2,
      },
      revenueImpact: -800,
      marginImpact: -40,
      confidence: 20,
      keyAssumptions: [
        'Antitrust review delayed in EU or US — remedies required that take 2 quarters to resolve',
        'Only 1 quarter of Chart revenue consolidated in FY2026 (Q4 only, ~$950M)',
        '$9.885B notes carry ~$120M/quarter interest with no Chart EBITDA to offset during delay',
        'Net leverage remains 0.3x until close — temporarily better-looking but misses Chart EBITDA',
        'Integration program delayed; Year 1 synergies only $50M vs $100M base case',
      ],
    },
  ],
};

// Export all tabs for use in the scenario engine
export const scenarioTabs: ScenarioTabConfig[] = [
  ietGasTechnologyTab,
  ofseOilfieldTab,
  chartIntegrationTab,
];
