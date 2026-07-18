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

// ─── Tab 2: Health Care Benefits (Aetna) ─────────────────────────────
export const healthCareBenefitsTab: ScenarioTabConfig = {
  tabId: 'health-care-benefits',
  label: 'Health Care Benefits',
  icon: 'Heart',
  description: 'Model Medical Benefit Ratio, medical membership, Medicare Advantage margin recovery, and prior authorization efficiency impacts on Aetna segment AOI and enterprise EPS',
  levers: [
    {
      id: 'tab-mbr',
      name: 'Medical Benefit Ratio (%)',
      category: 'Medical Costs',
      min: 88.0, max: 94.0, default: 90.5, step: 0.25,
      unit: '% MBR',
      description: 'Full-year MBR guidance 90.5% ±50bps. Q1 2026: 84.6% (favorable prior year development). Each +100bps MBR ≈ −$1.42B HCB AOI / −$0.83/share EPS. Full-year view prudently maintained.',
      impact: 'high',
    },
    {
      id: 'tab-membership',
      name: 'Total Medical Membership (M)',
      category: 'Membership',
      min: 24.0, max: 28.0, default: 26.0, step: 0.25,
      unit: 'M members',
      description: 'Medical membership 26.0M Q1 2026. ACA exit reduced membership intentionally. Each +0.5M members ≈ +$2.7B HCB revenue and +$225M AOI (at 8.4% margin).',
      impact: 'high',
    },
    {
      id: 'tab-ma-margin',
      name: 'Medicare Advantage Margin (%)',
      category: 'MA Profitability',
      min: 0.0, max: 4.0, default: 1.5, step: 0.25,
      unit: '% MA adj. margin',
      description: 'MA margin recovery trajectory. Target 3% by 2028 (reaffirmed). Each +0.5% ≈ +$350–500M annual AOI improvement.',
      impact: 'high',
    },
    {
      id: 'tab-star-rating',
      name: 'MA Star Rating Average',
      category: 'Quality',
      min: 3.0, max: 5.0, default: 4.0, step: 0.25,
      unit: 'Stars (1–5)',
      description: 'Medicare Advantage Star ratings determine quality bonus payments from CMS. Each 0.5 star improvement for a plan crossing 4.0 threshold ≈ +5% quality bonus on applicable premium revenue.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'hcb-base',
      name: 'HCB Base — 90.5% MBR, 26M Members',
      description: 'FY2026 HCB guidance midpoint: MBR 90.5%, 26.0M members, AOI $4.00–$4.34B.',
      leverSettings: { 'tab-mbr': 90.5, 'tab-membership': 26.0, 'tab-ma-margin': 1.5, 'tab-star-rating': 4.0 },
      revenueImpact: 0, marginImpact: 0, confidence: 65,
      keyAssumptions: ['MBR 90.5% ±50bps', '26.0M medical members', 'MA margin recovering toward 3% by 2028', 'Star ratings maintained'],
    },
    {
      id: 'hcb-bull',
      name: 'HCB Bull — MBR Outperforms, Membership Stable',
      description: 'MBR 89.5% driven by sustained medical cost management. Commercial membership grows to 26.5M. MA margin 2.0%.',
      leverSettings: { 'tab-mbr': 89.5, 'tab-membership': 26.5, 'tab-ma-margin': 2.0, 'tab-star-rating': 4.25 },
      revenueImpact: 2700, marginImpact: 1400, confidence: 25,
      keyAssumptions: ['MBR outperformance sustained beyond Q1 prior year development', 'Commercial fee-based membership growth', 'MA margin ahead of schedule'],
    },
    {
      id: 'hcb-bear',
      name: 'HCB Bear — MBR 93%, Membership Erosion',
      description: 'Medical cost trends worsen to 93% MBR. Membership 25.0M from MA competitive losses. AOI ~$2.5B.',
      leverSettings: { 'tab-mbr': 93.0, 'tab-membership': 25.0, 'tab-ma-margin': 0.0, 'tab-star-rating': 3.5 },
      revenueImpact: -8000, marginImpact: -2200, confidence: 15,
      keyAssumptions: ['Medical cost trends worsen significantly', 'MA membership losses accelerate', 'Star rating pressure'],
    },
  ],
};

// ─── Tab 3: Health Services (Caremark) ───────────────────────────────
export const healthServicesTab: ScenarioTabConfig = {
  tabId: 'health-services',
  label: 'Health Services',
  icon: 'Pill',
  description: 'Model Caremark pharmacy claims, biosimilar conversion, pharmacy client price improvements, GLP-1 coverage, and Oak Street Health performance impacts on HSS segment AOI',
  levers: [
    {
      id: 'tab-biosimilar',
      name: 'Stelara Biosimilar Conversion Rate (%)',
      category: 'Biosimilars',
      min: 50, max: 95, default: 85, step: 5,
      unit: '% conversion',
      description: 'Stelara excluded from commercial formularies July 1, 2026. Humira achieved >90%. Each 10ppt ≈ +$300–500M client savings. Caremark retains AOI via purchasing economics.',
      impact: 'high',
    },
    {
      id: 'tab-client-price',
      name: 'Pharmacy Client Price Improvement Headwind ($M)',
      category: 'PBM Economics',
      min: 0, max: 2000, default: 800, step: 100,
      unit: '$M AOI headwind',
      description: 'Annual HSS AOI headwind from TrueCost transition. Each $200M reduction ≈ +$200M HSS AOI. Q1 2026 included Q2 pull-forward; ex-timing, HSS beat.',
      impact: 'high',
    },
    {
      id: 'tab-claims',
      name: 'Annual Pharmacy Claims (B)',
      category: 'Volume',
      min: 1.7, max: 2.0, default: 1.84, step: 0.02,
      unit: 'B claims',
      description: 'Caremark annual pharmacy claims. FY2026 guidance ≥1.84B. Q1: 464.7M. Each 50M additional ≈ +$1.2–1.5B HSS revenue.',
      impact: 'medium',
    },
    {
      id: 'tab-glp1',
      name: 'GLP-1 Client Coverage Rate (%)',
      category: 'Drug Trend',
      min: 30, max: 80, default: 50, step: 5,
      unit: '% clients covering GLP-1 obesity',
      description: '~50% of clients discontinuing obesity GLP-1 coverage. Higher coverage = more specialty revenue; lower = lower trend but DTC channel opportunity.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'hss-base',
      name: 'HSS Base — ≥$7.25B AOI',
      description: 'FY2026 HSS guidance: AOI ≥$7.25B, claims ≥1.84B. Stelara 85% conversion. Client price headwind ~$800M.',
      leverSettings: { 'tab-biosimilar': 85, 'tab-client-price': 800, 'tab-claims': 1.84, 'tab-glp1': 50 },
      revenueImpact: 0, marginImpact: 0, confidence: 65,
      keyAssumptions: ['Rebate guarantee commitments tracking', 'Stelara exclusion executes July 1', 'Oak Street +15% revenue growth'],
    },
    {
      id: 'hss-bull',
      name: 'HSS Bull — Biosimilar Acceleration',
      description: 'Stelara hits 92% conversion like Humira. HSS AOI headwind moderates. Claims volume grows.',
      leverSettings: { 'tab-biosimilar': 92, 'tab-client-price': 600, 'tab-claims': 1.90, 'tab-glp1': 50 },
      revenueImpact: 2500, marginImpact: 700, confidence: 30,
      keyAssumptions: ['Stelara conversion replicates Humira', 'Rebate guarantee headwind moderates in H2', 'Claims growth from new wins'],
    },
    {
      id: 'hss-bear',
      name: 'HSS Bear — Headwinds Exceed Plan',
      description: 'Stelara conversion only 65%. Client price pressure $1.5B. GLP-1 coverage expands costs.',
      leverSettings: { 'tab-biosimilar': 65, 'tab-client-price': 1500, 'tab-claims': 1.82, 'tab-glp1': 65 },
      revenueImpact: -4000, marginImpact: -1200, confidence: 15,
      keyAssumptions: ['Stelara resistance delays conversion', 'PBM client price pressure exceeds plan', 'GLP-1 cost trend accelerates'],
    },
  ],
};

// ─── Tab 4: Pharmacy & Consumer Wellness ─────────────────────────────
export const pharmacyConsumerWellnessTab: ScenarioTabConfig = {
  tabId: 'pharmacy-consumer-wellness',
  label: 'Pharmacy & Consumer Wellness',
  icon: 'Store',
  description: 'Model PCW same-store Rx growth, reimbursement pressure, retail script share, and GLP-1 DTC market share impacts on segment AOI',
  levers: [
    {
      id: 'tab-ss-rx',
      name: 'Same-Store Prescription Growth (%)',
      category: 'Volume',
      min: 0.0, max: 10.0, default: 7.0, step: 0.5,
      unit: '% same-store Rx',
      description: 'Q1 2026: +7%. FY target ≥1.865B prescriptions. Each +1% ≈ +$1.36B annual PCW revenue.',
      impact: 'medium',
    },
    {
      id: 'tab-reimb',
      name: 'Reimbursement Rate Change (bps)',
      category: 'Pricing',
      min: -200, max: 50, default: -80, step: 25,
      unit: 'bps',
      description: 'Ongoing reimbursement pressure from PBM/payer negotiations. CostVantage neutralizes branded drug headwind but generic drug reimbursement pressure persists.',
      impact: 'medium',
    },
    {
      id: 'tab-script-share',
      name: 'Retail Script Share (%)',
      category: 'Market Share',
      min: 27.0, max: 32.0, default: 29.0, step: 0.5,
      unit: '% U.S. script share',
      description: 'CVS >29% script share; meaningful growth YoY. GLP-1 DTC gaining +200bps. Walgreens restructuring may provide tailwind.',
      impact: 'medium',
    },
    {
      id: 'tab-glp1-dtc',
      name: 'GLP-1 DTC Market Share Gain (bps)',
      category: 'Growth Initiatives',
      min: 0, max: 500, default: 200, step: 50,
      unit: 'bps share gain',
      description: 'CVS gaining +200bps GLP-1 DTC market share. ~9,000 locations; $25/month insulin access driving traffic. NovoCare and other DTC partnerships expanding.',
      impact: 'low',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'pcw-base',
      name: 'PCW Base — ≥$6.18B AOI',
      description: 'FY2026 PCW guidance: AOI ≥$6.18B. Same-store Rx +7%. Script share >29%. Prescriptions ≥1.865B.',
      leverSettings: { 'tab-ss-rx': 7.0, 'tab-reimb': -80, 'tab-script-share': 29.0, 'tab-glp1-dtc': 200 },
      revenueImpact: 0, marginImpact: 0, confidence: 65,
      keyAssumptions: ['Same-store Rx +7%', 'Script share >29%', 'CostVantage neutralizes branded headwind'],
    },
    {
      id: 'pcw-bull',
      name: 'PCW Bull — Share Gains Accelerate',
      description: 'Script share 30%+. Walgreens restructuring drives CVS gains. Same-store Rx +8.5%.',
      leverSettings: { 'tab-ss-rx': 8.5, 'tab-reimb': -50, 'tab-script-share': 30.5, 'tab-glp1-dtc': 350 },
      revenueImpact: 3000, marginImpact: 800, confidence: 25,
      keyAssumptions: ['Walgreens WBA restructuring accelerates CVS script share gains', 'GLP-1 DTC continues to outperform', 'Rite Aid assets fully integrated'],
    },
    {
      id: 'pcw-bear',
      name: 'PCW Bear — Reimbursement Pressure Intensifies',
      description: 'Reimbursement pressure −150bps. Script growth slows to 4%. AOI misses guidance.',
      leverSettings: { 'tab-ss-rx': 4.0, 'tab-reimb': -150, 'tab-script-share': 28.5, 'tab-glp1-dtc': 100 },
      revenueImpact: -5000, marginImpact: -1500, confidence: 20,
      keyAssumptions: ['PBM reimbursement headwinds exceed plan', 'Script volume growth decelerates', 'GLP-1 DTC competition intensifies'],
    },
  ],
};

export const cvsScenarioTabs: ScenarioTabConfig[] = [
  healthCareBenefitsTab,
  healthServicesTab,
  pharmacyConsumerWellnessTab,
];
