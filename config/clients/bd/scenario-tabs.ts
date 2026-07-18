// v2
// Scenario tab-specific lever and scenario configurations for BD Finance360
// Each tab has its own set of levers and pre-built scenarios for domain-specific what-if modeling
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

// ─── Tab 2: GLP-1 Demand ─────────────────────────────────────────────
export const glp1DemandTab: ScenarioTabConfig = {
  tabId: 'glp1-demand',
  label: 'GLP-1 Demand',
  icon: 'Syringe',
  description:
    'Model GLP-1 drug delivery device demand scenarios for BD BioPharma Systems — ' +
    'the upside/downside from GLP-1 manufacturer orders, destocking resolution timing, ' +
    'and long-term volume ramp as obesity drug production scales globally.',
  levers: [
    {
      id: 'tab-glp1-incremental',
      name: 'GLP-1 Device Incremental Revenue ($M vs base)',
      category: 'GLP-1 Demand',
      min: -200, max: 800, default: 0, step: 50,
      unit: '$M incremental',
      description:
        'Incremental BioPharma Systems revenue from GLP-1 delivery device orders vs base plan. ' +
        'Bull: +$400–800M as pharma manufacturers scale. Bear: -$100–200M if destocking extends.',
      impact: 'high',
    },
    {
      id: 'tab-glp1-timing',
      name: 'GLP-1 Ramp Timing (quarters ahead/behind base)',
      category: 'GLP-1 Demand',
      min: -2, max: 4, default: 0, step: 1,
      unit: 'quarters vs base',
      description:
        'Positive = delayed; Negative = ahead of schedule. ' +
        'Each 1-quarter delay ≈ -$75–100M annual revenue shift into future year.',
      impact: 'medium',
    },
    {
      id: 'tab-bps-destocking',
      name: 'BioPharma Destocking Duration (quarters remaining)',
      category: 'BioPharma Systems',
      min: 0, max: 4, default: 1, step: 1,
      unit: 'quarters of destocking',
      description:
        'Pharmaceutical customer inventory destocking duration. Current: Q2 FY26 still impacted (-1.8% FXN). ' +
        'Base: 1 more quarter (resolves Q3 FY26). Bear: 3 more quarters extends into FY27.',
      impact: 'high',
    },
    {
      id: 'tab-bps-margin',
      name: 'BioPharma Systems Operating Margin (%)',
      category: 'BioPharma Systems',
      min: 25, max: 38, default: 31, step: 1,
      unit: '% adj. operating margin',
      description:
        'BioPharma Systems has the highest operating margin of BD segments (~31% est.). ' +
        'GLP-1 upside amplified by margin leverage. Lower volume = deleverage → lower margin.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'glp1-base',
      name: 'GLP-1 Base — Destocking Resolves H2 FY26',
      description:
        'BioPharma Systems returns to growth as destocking normalizes. GLP-1 orders begin ramping. ' +
        'FY2026 BioPharma ends at ~+1% FXN, FY27 +5%+.',
      leverSettings: { 'tab-glp1-incremental': 0, 'tab-glp1-timing': 0, 'tab-bps-destocking': 1, 'tab-bps-margin': 31 },
      revenueImpact: 0, marginImpact: 0, confidence: 60,
      keyAssumptions: [
        'Destocking resolves Q3 FY26', 'GLP-1 orders begin Q4 FY26', 'BioPharma returns to +1% FXN FY26',
      ],
    },
    {
      id: 'glp1-bull',
      name: 'GLP-1 Bull — Demand Surge Ahead of Schedule',
      description:
        'GLP-1 manufacturers accelerate device orders 1–2 quarters ahead; destocking ends Q3 FY26. ' +
        'BioPharma +5%+ FXN in H2 FY26. FY27 step-change to double-digit BioPharma growth.',
      leverSettings: { 'tab-glp1-incremental': 250, 'tab-glp1-timing': -1, 'tab-bps-destocking': 0, 'tab-bps-margin': 33 },
      revenueImpact: 250, marginImpact: 1.1, confidence: 20,
      keyAssumptions: [
        'Destocking ends Q2 FY26 (one quarter early)', 'GLP-1 ramp 1 quarter ahead of base', '+$250M incremental BioPharma revenue',
      ],
    },
    {
      id: 'glp1-bear',
      name: 'GLP-1 Bear — Extended Destocking + Delayed Orders',
      description:
        'Pharmaceutical customers continue destocking through FY26. GLP-1 device orders delayed to FY27. ' +
        'BioPharma full-year -3% FXN. EPS impact ~-$0.20.',
      leverSettings: { 'tab-glp1-incremental': -150, 'tab-glp1-timing': 3, 'tab-bps-destocking': 3, 'tab-bps-margin': 28 },
      revenueImpact: -150, marginImpact: -0.7, confidence: 20,
      keyAssumptions: [
        'Destocking extends through Q4 FY26', 'GLP-1 ramp delayed 3 quarters', 'BioPharma -3% FXN full year',
      ],
    },
  ],
};

// ─── Tab 3: China VoBP ────────────────────────────────────────────────
export const chinaVoBPTab: ScenarioTabConfig = {
  tabId: 'china-vobp',
  label: 'China VoBP',
  icon: 'Globe',
  description:
    'Model China Volume-Based Procurement program scenarios — ' +
    'escalation risk, emerging markets offset effectiveness, and private hospital channel development ' +
    'for BD Medical Essentials and other affected segments.',
  levers: [
    {
      id: 'tab-vobp-headwind',
      name: 'China VoBP Headwind (% FXN affected categories)',
      category: 'China VoBP',
      min: -30, max: 0, default: -14, step: 2,
      unit: '% FXN headwind',
      description:
        'VoBP headwind on affected China product categories. Base: -14% FXN Q2 FY26. ' +
        'Bear: -22% to -28% if new categories added. Bull: -8% if private hospital channel offsets.',
      impact: 'high',
    },
    {
      id: 'tab-em-growth',
      name: 'Emerging Markets Organic Growth (% FXN)',
      category: 'Emerging Markets Offset',
      min: 3, max: 15, default: 7, step: 1,
      unit: '% FXN emerging markets growth',
      description:
        'BD growth in India, SE Asia, LatAm, ME as offset to China headwind. ' +
        'Each +2% above base ≈ +$50M revenue offset. Bull: +12% with India/SE Asia acceleration.',
      impact: 'medium',
    },
    {
      id: 'tab-china-private',
      name: 'China Private Hospital Revenue Growth (% FXN)',
      category: 'China Strategy',
      min: 0, max: 25, default: 8, step: 2,
      unit: '% FXN private hospital growth',
      description:
        'China private hospital and retail channel — not subject to VoBP. ' +
        'Faster private channel growth partially offsets public hospital VoBP impact. ' +
        'Bull: +20% if private market accelerates with BD commercial investment.',
      impact: 'low',
    },
    {
      id: 'tab-medical-essentials-fxn',
      name: 'Medical Essentials Total Organic Growth (% FXN)',
      category: 'Segment Impact',
      min: -2, max: 6, default: 2, step: 0.5,
      unit: '% FXN Medical Essentials',
      description:
        'Medical Essentials full-year organic growth inclusive of China headwind and offset. ' +
        'Q2 FY26: +1.7% FXN. Base: +2.0% FY26. Bear: negative if VoBP escalates.',
      impact: 'high',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'vobp-base',
      name: 'VoBP Base — -14% FXN Headwind Stable',
      description: 'China VoBP headwind stays at -14% FXN through FY2026. Emerging markets +7% FXN offsets partially. Medical Essentials +2% FXN.',
      leverSettings: { 'tab-vobp-headwind': -14, 'tab-em-growth': 7, 'tab-china-private': 8, 'tab-medical-essentials-fxn': 2 },
      revenueImpact: 0, marginImpact: 0, confidence: 60,
      keyAssumptions: ['VoBP scope unchanged', 'EM +7% FXN', 'Medical Essentials +2% FXN'],
    },
    {
      id: 'vobp-escalation',
      name: 'VoBP Escalation — New Categories (-22% FXN)',
      description: 'VoBP expands to Connected Care and additional MDS categories. Headwind worsens to -22% FXN. EM offset insufficient. Medical Essentials 0% FXN.',
      leverSettings: { 'tab-vobp-headwind': -22, 'tab-em-growth': 5, 'tab-china-private': 6, 'tab-medical-essentials-fxn': 0 },
      revenueImpact: -320, marginImpact: -0.8, confidence: 20,
      keyAssumptions: ['VoBP expands to additional BD categories', 'EM growth slows to 5% FXN', 'Medical Essentials near 0% FXN'],
    },
    {
      id: 'vobp-stabilization',
      name: 'VoBP Stabilization + EM Acceleration',
      description: 'New VoBP procurement cycle resets at higher base prices. EM markets accelerate to +10% FXN. Medical Essentials reaches +3% FXN.',
      leverSettings: { 'tab-vobp-headwind': -8, 'tab-em-growth': 10, 'tab-china-private': 15, 'tab-medical-essentials-fxn': 3 },
      revenueImpact: 200, marginImpact: 0.5, confidence: 20,
      keyAssumptions: ['VoBP stabilizes at lower headwind', 'EM acceleration to +10% FXN', 'Private hospital China contributing'],
    },
  ],
};

// ─── Tab 4: Alaris & Connected Care ──────────────────────────────────
export const alarisRampTab: ScenarioTabConfig = {
  tabId: 'alaris-connected-care',
  label: 'Alaris & Connected Care',
  icon: 'Activity',
  description:
    'Model BD Alaris infusion pump commercial return timeline, HemoSphere platform expansion, ' +
    'and Connected Care segment organic growth scenarios. ' +
    'Alaris is the single largest revenue recovery opportunity in BD\'s near-term pipeline.',
  levers: [
    {
      id: 'tab-alaris-completion',
      name: 'Alaris Site Remediation Completion (FY quarter)',
      category: 'Alaris Remediation',
      min: 7, max: 12, default: 8, step: 1,
      unit: 'FY quarter (Q4 FY26 = 8)',
      description:
        'Quarter in which BD Alaris 100% site remediation is achieved. Q4 FY26 = quarter 8. ' +
        'Each quarter of acceleration ≈ +$80–120M annualized Connected Care revenue.',
      impact: 'high',
    },
    {
      id: 'tab-alaris-revenue-ramp',
      name: 'Alaris Post-Remediation Revenue Ramp ($M incremental FY27)',
      category: 'Alaris Remediation',
      min: 100, max: 600, default: 300, step: 50,
      unit: '$M incremental FY27 revenue',
      description:
        'Incremental Connected Care revenue in FY27 as Alaris installed base + disposables ramp post full remediation. ' +
        'Bull: $500–600M if all pending hospital commitments activate. Base: $300M.',
      impact: 'high',
    },
    {
      id: 'tab-hemosphere-growth',
      name: 'HemoSphere Advanced Monitoring Growth (% FXN)',
      category: 'Advanced Patient Monitoring',
      min: 5, max: 25, default: 12, step: 1,
      unit: '% FXN HemoSphere growth',
      description:
        'HemoSphere hemodynamic monitoring platform organic growth. Currently growing double-digit. ' +
        'Next-gen platform FDA submission expected. Bull: +20%+ FXN if new monitoring parameters gain adoption.',
      impact: 'medium',
    },
    {
      id: 'tab-connected-care-fxn',
      name: 'Connected Care Full-Year Organic Growth (% FXN)',
      category: 'Connected Care Segment',
      min: 0, max: 10, default: 4, step: 0.5,
      unit: '% FXN Connected Care',
      description:
        'Q2 FY26: +3.2% FXN. Target: +5.0% FXN. Full Alaris return enables 5%+ FXN. ' +
        'Each +1% ≈ +$46M annual segment revenue.',
      impact: 'high',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'alaris-base',
      name: 'Alaris Base — Q4 FY26 Full Return',
      description: 'Alaris completes remediation Q4 FY26 as planned. Connected Care +4% FXN full year. FY27 ramp $300M incremental.',
      leverSettings: { 'tab-alaris-completion': 8, 'tab-alaris-revenue-ramp': 300, 'tab-hemosphere-growth': 12, 'tab-connected-care-fxn': 4 },
      revenueImpact: 0, marginImpact: 0, confidence: 60,
      keyAssumptions: ['Alaris Q4 FY26 completion', 'Connected Care +4% FXN FY26', 'HemoSphere +12% FXN'],
    },
    {
      id: 'alaris-acceleration',
      name: 'Alaris Ahead of Schedule — Q3 FY26 Full Return',
      description: 'Alaris completes 1 quarter early. Connected Care +5.5% FXN full year. Strong FY27 exit rate with $450M ramp.',
      leverSettings: { 'tab-alaris-completion': 7, 'tab-alaris-revenue-ramp': 450, 'tab-hemosphere-growth': 15, 'tab-connected-care-fxn': 5.5 },
      revenueImpact: 180, marginImpact: 0.6, confidence: 25,
      keyAssumptions: ['Alaris Q3 FY26 completion (1Q early)', 'Connected Care +5.5% FXN', 'HemoSphere accelerating'],
    },
    {
      id: 'alaris-delay',
      name: 'Alaris Delay — Q1 FY27 Full Return',
      description: 'Remaining 22% of hospital sites take 2 additional quarters. Connected Care +2% FXN FY26. FY27 ramp delayed.',
      leverSettings: { 'tab-alaris-completion': 9, 'tab-alaris-revenue-ramp': 150, 'tab-hemosphere-growth': 10, 'tab-connected-care-fxn': 2 },
      revenueImpact: -160, marginImpact: -0.5, confidence: 20,
      keyAssumptions: ['Alaris delayed to Q1 FY27', 'Connected Care +2% FXN FY26', 'FY27 ramp $150M (reduced)'],
    },
  ],
};

// ─── Tab 5: FX & Interest Rate ────────────────────────────────────────
export const fxInterestTab: ScenarioTabConfig = {
  tabId: 'fx-interest',
  label: 'FX & Interest Rate',
  icon: 'TrendingUp',
  description:
    'Model foreign currency translation and transaction impacts on BD revenue and EPS, ' +
    'and interest rate / debt refinancing scenarios as BD deleverages from 2.9x toward 2.5x target.',
  levers: [
    {
      id: 'tab-fx-revenue',
      name: 'FX Translation Revenue Impact ($M vs budget)',
      category: 'FX Sensitivity',
      min: -600, max: 400, default: 0, step: 50,
      unit: '$M FX revenue impact',
      description: 'Positive = USD weakens (tailwind). Negative = USD strengthens (headwind). Q2 FY26 FX added ~+$120M reported vs organic.',
      impact: 'medium',
    },
    {
      id: 'tab-fx-eps',
      name: 'FX Net Impact on Adj. EPS ($ per share)',
      category: 'FX Sensitivity',
      min: -0.50, max: 0.30, default: 0.05, step: 0.05,
      unit: '$ per share',
      description: 'Net FX impact after hedging. EUR/USD is the largest driver; CNY and JPY also material. Each -$0.10 ≈ -$28M after-tax.',
      impact: 'medium',
    },
    {
      id: 'tab-interest-expense',
      name: 'Annual Interest Expense ($M)',
      category: 'Debt / Interest Rate',
      min: 450, max: 750, default: 613, step: 25,
      unit: '$M interest expense',
      description: 'FY25 actual: $613M. Each $50M reduction ≈ +$0.13/share EPS. Debt paydown + rate cuts = downside. Higher refinancing rates = upside headwind.',
      impact: 'medium',
    },
    {
      id: 'tab-net-leverage',
      name: 'Net Leverage Ratio (end of FY2026)',
      category: 'Debt / Interest Rate',
      min: 2.0, max: 3.5, default: 2.7, step: 0.1,
      unit: 'x net debt/EBITDA',
      description: 'Expected net leverage at FY2026 year-end. Current 2.9x. Target 2.5x by FY2027. 2.5x unlocks expanded capital return.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'fx-base',
      name: 'FX & Rates Base — Neutral FX, $613M Interest',
      description: 'FX at budget rates; interest expense $613M FY26; net leverage improves to 2.7x.',
      leverSettings: { 'tab-fx-revenue': 0, 'tab-fx-eps': 0.05, 'tab-interest-expense': 613, 'tab-net-leverage': 2.7 },
      revenueImpact: 0, marginImpact: 0, confidence: 60,
      keyAssumptions: ['FX at budget rates', 'Interest $613M', 'Leverage 2.7x FY26 year-end'],
    },
    {
      id: 'fx-headwind-rates-high',
      name: 'USD Strength + Higher Refinancing Rates',
      description: 'Strong USD creates -$300M FX revenue headwind; higher rates prevent interest expense decline. EPS -$0.35 vs base.',
      leverSettings: { 'tab-fx-revenue': -300, 'tab-fx-eps': -0.20, 'tab-interest-expense': 650, 'tab-net-leverage': 2.9 },
      revenueImpact: -300, marginImpact: -0.7, confidence: 20,
      keyAssumptions: ['USD appreciates 8–10% vs EUR/JPY/CNY', 'Refinancing rates prevent savings', 'Leverage improvement stalls'],
    },
    {
      id: 'fx-tailwind-rates-low',
      name: 'USD Weakness + Rate Cuts Accelerate Deleverage',
      description: 'USD weakens, providing +$250M FX tailwind. Fed cuts reduce BD refinancing cost; interest savings +$80M. EPS +$0.28.',
      leverSettings: { 'tab-fx-revenue': 250, 'tab-fx-eps': 0.18, 'tab-interest-expense': 540, 'tab-net-leverage': 2.5 },
      revenueImpact: 250, marginImpact: 0.6, confidence: 20,
      keyAssumptions: ['USD weakens vs EUR and JPY', 'Rate cuts reduce BD interest ~$80M', 'Leverage reaches 2.5x target FY26'],
    },
  ],
};

export const bdScenarioTabs: ScenarioTabConfig[] = [
  glp1DemandTab,
  chinaVoBPTab,
  alarisRampTab,
  fxInterestTab,
];
