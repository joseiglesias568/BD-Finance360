// BD scenario tab-specific lever and scenario configurations
// Four domain tabs: MA Margin Recovery, PCW Portfolio, Caremark PBM, Digital Health
//
// Tab IDs match the AnalysisTab union in ScenarioModelingClient:
//   strategy-investment | real-estate-portfolio | global-markets | digital-platform
//
// Provenance: BD Q1 2026 earnings call, 10-Q, 10-K, FY2026 guidance.
// Figures are editorial ranges for CFO discussion — not BD guidance.

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

// ─── Tab 1: Strategic Investment — MA Margin Recovery & Health100 ────────────
export const maMarginRecoveryTab: ScenarioTabConfig = {
  tabId: 'strategy-investment',
  label: 'MA Margin Recovery & Health100',
  icon: 'Target',
  description: 'Model Medicare Advantage margin recovery trajectory, Health100 SG&A savings, Oak Street Health expansion, and Medicaid stabilization economics',
  levers: [
    {
      id: 'ma-bid-year-premium-rate',
      name: 'MA Bid-Year Premium Rate Increase',
      category: 'Medicare Advantage',
      min: 0, max: 15, default: 8.5, step: 0.5,
      unit: '%',
      description: 'MA premium rate increase for the upcoming bid year. Base case +8–9% (FY2027 bids). Each +1pp ≈ +$180–220M HCB revenue. CMS 2027 rate notice: step in right direction but still insufficient to fully offset medical cost trends.',
      impact: 'high',
    },
    {
      id: 'health100-sga-savings',
      name: 'Health100 Cumulative SG&A Savings',
      category: 'Health100 / SG&A',
      min: 0, max: 1500, default: 500, step: 50,
      unit: '$M',
      description: 'Cumulative SG&A savings from Health100 AI-efficiency program. Target $2B+ total; $500M+ achieved as of Q1 2026. Each $100M savings ≈ +$0.08 adj. EPS impact on ~1,278M diluted shares.',
      impact: 'high',
    },
    {
      id: 'oak-street-clinic-count',
      name: 'Oak Street Health Clinic Count',
      category: 'Oak Street Health',
      min: 100, max: 250, default: 170, step: 5,
      unit: 'clinics',
      description: 'Oak Street Health clinic footprint. Currently 170+ clinics, ~38,000 VBC patients. Each mature clinic ≈ $4–6M annual revenue contribution. Q1 2026 Oak Street revenue +15% YoY.',
      impact: 'medium',
    },
    {
      id: 'medicaid-mlr-improvement',
      name: 'Medicaid MLR Improvement',
      category: 'Medicaid',
      min: -200, max: 300, default: 50, step: 25,
      unit: 'bps',
      description: 'Medicaid medical loss ratio improvement vs. prior year (positive = favorable). Q1 2026 Medicaid stabilization underway. Each 100bps improvement on ~$25B Medicaid revenue ≈ +$250M AOI.',
      impact: 'medium',
    },
    {
      id: 'prior-auth-automation-rate',
      name: 'Prior Auth AI Real-Time Approval',
      category: 'Health100 / AI',
      min: 70, max: 99, default: 85, step: 1,
      unit: '%',
      description: 'Percentage of prior authorizations approved in real-time via AI. Q1 2026: >80%. Target: >85%. Each 1pp improvement reduces admin burden ~$15–25M annually across the enterprise.',
      impact: 'medium',
    },
    {
      id: 'commercial-enrollment-growth',
      name: 'Commercial / Employer Enrollment Growth',
      category: 'Health Care Benefits',
      min: -5, max: 8, default: 1.5, step: 0.5,
      unit: '%',
      description: 'Commercial insurance membership growth rate. Q1 2026 commercial membership growth supporting HCB revenue diversification. Each 1% growth on ~11M commercial lives ≈ +$220M revenue.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'ma-recovery-bull',
      name: 'MA Recovery Bull Case',
      description: 'Accelerated MA margin recovery with Health100 savings outperforming',
      leverSettings: {
        'ma-bid-year-premium-rate': 10.0,
        'health100-sga-savings': 750,
        'oak-street-clinic-count': 185,
        'medicaid-mlr-improvement': 150,
        'prior-auth-automation-rate': 90,
        'commercial-enrollment-growth': 2.5,
      },
      revenueImpact: 3200,
      marginImpact: 180,
      confidence: 70,
      keyAssumptions: [
        'CMS 2027 rate improvement accelerates recovery timeline',
        'Health100 savings front-loaded into FY2026',
        'Oak Street 185 clinics at higher maturity faster than expected',
        'Medicaid stabilization confirmed across key states by Q3 2026',
      ],
    },
    {
      id: 'ma-recovery-base',
      name: 'Base Case Recovery',
      description: 'In-line with management guidance — 3% MA margin by 2028',
      leverSettings: {
        'ma-bid-year-premium-rate': 8.5,
        'health100-sga-savings': 500,
        'oak-street-clinic-count': 170,
        'medicaid-mlr-improvement': 50,
        'prior-auth-automation-rate': 85,
        'commercial-enrollment-growth': 1.5,
      },
      revenueImpact: 1800,
      marginImpact: 95,
      confidence: 85,
      keyAssumptions: [
        'MA margin recovering to 3% by 2028 as guided',
        'Health100 $2B+ cumulative target by 2027',
        'Full-year MBR 90.5% ±50bps (management guidance)',
        'Oak Street on current 170+ clinic expansion pace',
      ],
    },
    {
      id: 'ma-recovery-bear',
      name: 'Extended Headwind Scenario',
      description: 'CMS rates disappoint; medical cost trend accelerates into H2',
      leverSettings: {
        'ma-bid-year-premium-rate': 6.0,
        'health100-sga-savings': 300,
        'oak-street-clinic-count': 155,
        'medicaid-mlr-improvement': -100,
        'prior-auth-automation-rate': 80,
        'commercial-enrollment-growth': 0.5,
      },
      revenueImpact: -800,
      marginImpact: -85,
      confidence: 55,
      keyAssumptions: [
        'CMS rate notice below expectation pressures MA economics',
        'Medical cost trend exceeds 90.5% FY2026 MBR guidance',
        'Medicaid redetermination creates unexpected membership churn',
        'Health100 savings delayed 1–2 quarters vs. plan',
      ],
    },
  ],
};

// ─── Tab 2: Strategic Analysis — PCW Pharmacy & HealthHUB Portfolio ──────────
export const pcwPortfolioTab: ScenarioTabConfig = {
  tabId: 'real-estate-portfolio',
  label: 'PCW Pharmacy & HealthHUB Portfolio',
  icon: 'Building2',
  description: 'Model CVS pharmacy same-store script growth, HealthHUB conversion economics, GLP-1 market share, and reimbursement headwinds on PCW segment AOI',
  levers: [
    {
      id: 'same-store-rx-growth',
      name: 'Same-Store Rx Volume Growth',
      category: 'Pharmacy Volume',
      min: -3, max: 12, default: 7.0, step: 0.5,
      unit: '%',
      description: 'Same-store prescription volume growth YoY. Q1 2026: +7.0% (vs. ≥6% target). Driven by GLP-1 +34%, senior script capture, and Walgreens closure-driven market share gains.',
      impact: 'high',
    },
    {
      id: 'healthhub-conversion-count',
      name: 'HealthHUB Conversions (Stores)',
      category: 'HealthHUB',
      min: 0, max: 3000, default: 1500, step: 50,
      unit: 'stores',
      description: 'Number of CVS locations converted to HealthHUB format. HealthHUBs generate +15% revenue premium over standard stores via clinical services, health screenings, and chronic disease management.',
      impact: 'medium',
    },
    {
      id: 'glp1-market-share-pct',
      name: 'GLP-1 Retail Market Share',
      category: 'GLP-1 / Specialty',
      min: 22, max: 40, default: 29, step: 0.5,
      unit: '%',
      description: 'CVS retail pharmacy GLP-1 market share. Q1 2026: ~29%. Target: >31% by year-end 2026. GLP-1 volume +34% vs. +22% plan. Each 1pp share gain ≈ +$85–120M revenue (high volume, compressed net margin).',
      impact: 'high',
    },
    {
      id: 'reimbursement-headwind-m',
      name: 'PBM Reimbursement Headwind (Quarterly)',
      category: 'Reimbursement',
      min: -300, max: 0, default: -45, step: 15,
      unit: '$M/quarter',
      description: 'Quarterly PBM reimbursement rate headwind. Q1 2026: -$45M. DIR fee reform, direct and indirect remuneration, and network spread compression create systemic pressure. Annual run-rate ~$150–200M.',
      impact: 'high',
    },
    {
      id: 'store-optimization-savings',
      name: 'Store Optimization Annual Savings',
      category: 'Cost Management',
      min: 0, max: 400, default: 150, step: 25,
      unit: '$M',
      description: 'Annual savings from store format optimization and efficiency improvements. Includes labor productivity, inventory, and clinical services gross margin improvement. Major closure program paused pending strategy review.',
      impact: 'medium',
    },
    {
      id: 'minuteclinic-visits',
      name: 'MinuteClinic Quarterly Visits',
      category: 'MinuteClinic',
      min: 1000, max: 5000, default: 2800, step: 100,
      unit: 'K visits',
      description: 'MinuteClinic quarterly visit volume. Revenue per visit ~$75–120. Digital scheduling through Health100 drives visit capture. Integrated with Aetna benefits for member engagement and care navigation.',
      impact: 'low',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'pcw-bull',
      name: 'PCW Outperformance',
      description: 'GLP-1 share gains + HealthHUB premium + reimbursement stabilization',
      leverSettings: {
        'same-store-rx-growth': 9.0,
        'healthhub-conversion-count': 2000,
        'glp1-market-share-pct': 32,
        'reimbursement-headwind-m': -20,
        'store-optimization-savings': 220,
        'minuteclinic-visits': 3200,
      },
      revenueImpact: 2400,
      marginImpact: 120,
      confidence: 65,
      keyAssumptions: [
        'Walgreens closures accelerate CVS script market share capture',
        'GLP-1 volume continues above plan throughout FY2026',
        'Reimbursement headwind moderates from Q1 pace to ~$20M/quarter',
        'HealthHUB revenue premium validates conversion investment',
      ],
    },
    {
      id: 'pcw-base',
      name: 'Base Case Growth',
      description: 'In-line with Q1 trajectory and FY2026 management guidance',
      leverSettings: {
        'same-store-rx-growth': 7.0,
        'healthhub-conversion-count': 1500,
        'glp1-market-share-pct': 29,
        'reimbursement-headwind-m': -45,
        'store-optimization-savings': 150,
        'minuteclinic-visits': 2800,
      },
      revenueImpact: 1200,
      marginImpact: 60,
      confidence: 82,
      keyAssumptions: [
        'Same-store Rx growth sustains at +7% level through FY2026',
        'GLP-1 retail market share holds above 29%',
        'Reimbursement headwind continues at ~$45M/quarter run-rate',
        'HealthHUB conversions proceed at current cadence',
      ],
    },
    {
      id: 'pcw-bear',
      name: 'Reimbursement Pressure Scenario',
      description: 'DIR reform accelerates; GLP-1 margin drag intensifies; script growth moderates',
      leverSettings: {
        'same-store-rx-growth': 4.5,
        'healthhub-conversion-count': 1000,
        'glp1-market-share-pct': 26,
        'reimbursement-headwind-m': -90,
        'store-optimization-savings': 75,
        'minuteclinic-visits': 2200,
      },
      revenueImpact: -400,
      marginImpact: -80,
      confidence: 50,
      keyAssumptions: [
        'DIR fee reform creates larger-than-expected reimbursement headwind',
        'GLP-1 margin dilution intensifies as volume surges with low-net-price formularies',
        'Same-store script growth moderates from Q1 pace',
        'HealthHUB conversion economics disappoint vs. 15% premium assumption',
      ],
    },
  ],
};

// ─── Tab 3: Global Markets — Caremark PBM & HSS Specialty Growth ─────────────
export const caremarkPbmTab: ScenarioTabConfig = {
  tabId: 'global-markets',
  label: 'Caremark PBM & HSS Specialty Growth',
  icon: 'Package',
  description: 'Model Caremark pharmacy claims volume, specialty Rx growth, TrueCost client transition, Stelara biosimilar conversion, and GLP-1 economics on HSS segment AOI',
  levers: [
    {
      id: 'pharmacy-claims-growth-pct',
      name: 'Pharmacy Claims Volume Growth',
      category: 'PBM Volume',
      min: -5, max: 10, default: 2.0, step: 0.5,
      unit: '%',
      description: 'Caremark PBM pharmacy claims volume growth YoY. Q1 2026: 464.7M claims. Claims growth largely driven by specialty volume; commercial claims relatively stable with GLP-1 volume uplift.',
      impact: 'high',
    },
    {
      id: 'specialty-rx-growth-pct',
      name: 'Specialty Rx Revenue Growth',
      category: 'Specialty Pharmacy',
      min: 5, max: 35, default: 18, step: 1,
      unit: '%',
      description: 'Specialty pharmacy revenue growth YoY. Q1 2026: +18% (vs. >15% target). Driven by GLP-1 +34%, oncology, immunology, and biosimilar transition. Specialty carries significantly higher revenue per claim vs. traditional Rx.',
      impact: 'high',
    },
    {
      id: 'truecost-client-conversion',
      name: 'TrueCost Client Conversion Rate',
      category: 'TrueCost / PBM Model',
      min: 30, max: 100, default: 62, step: 2,
      unit: '%',
      description: 'Percentage of Caremark PBM clients transitioned to TrueCost pass-through model. Currently 62%. Full transition creates ~$800M gross revenue headwind that is net-neutral to AOI. Improves client trust and long-term retention.',
      impact: 'medium',
    },
    {
      id: 'stelara-biosimilar-conversion-pct',
      name: 'Stelara Biosimilar Conversion Rate',
      category: 'Biosimilar / Formulary',
      min: 50, max: 95, default: 72, step: 2,
      unit: '%',
      description: 'Stelara biosimilar conversion rate by July 1, 2026 formulary exclusion date. Target: >85%. Stelara branded: $5,000+/dose; biosimilar: ~$2,500–3,000/dose. 85%+ conversion = $200–400M+ annual AOI catalyst.',
      impact: 'high',
    },
    {
      id: 'glp1-volume-growth-pct',
      name: 'GLP-1 PBM Volume Growth YoY',
      category: 'GLP-1',
      min: 10, max: 60, default: 34, step: 2,
      unit: '%',
      description: 'GLP-1 (Ozempic/Wegovy/Mounjaro) pharmacy volume growth through Caremark PBM. Q1 2026: +34% vs. +22% plan. High ingredient cost drives specialty revenue; net revenue per claim is lower than traditional Rx.',
      impact: 'high',
    },
    {
      id: 'oak-street-vbc-patients',
      name: 'Oak Street VBC Patient Count',
      category: 'Oak Street Health',
      min: 25000, max: 60000, default: 38000, step: 1000,
      unit: 'patients',
      description: 'Oak Street Health value-based care patients enrolled. Currently ~38,000. Each VBC patient generates ~$15,000–20,000 annual revenue. Oak Street Q1 2026 revenue +15% YoY. Disciplined expansion to 170+ clinics.',
      impact: 'medium',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'hss-bull',
      name: 'HSS Acceleration Scenario',
      description: 'Stelara biosimilar exceeds target + specialty maintains outperformance',
      leverSettings: {
        'pharmacy-claims-growth-pct': 4.5,
        'specialty-rx-growth-pct': 24,
        'truecost-client-conversion': 75,
        'stelara-biosimilar-conversion-pct': 88,
        'glp1-volume-growth-pct': 42,
        'oak-street-vbc-patients': 45000,
      },
      revenueImpact: 2800,
      marginImpact: 160,
      confidence: 68,
      keyAssumptions: [
        'Stelara conversion hits >85% by July 1, 2026 exclusion date',
        'Specialty Rx maintains +20%+ growth momentum through FY2026',
        'GLP-1 employer coverage expansion continues above plan',
        'Oak Street patient acquisition accelerates in newly opened clinics',
      ],
    },
    {
      id: 'hss-base',
      name: 'Base Case HSS Growth',
      description: 'In-line with Q1 trajectory and FY2026 HSS guidance (≥$7.25B AOI)',
      leverSettings: {
        'pharmacy-claims-growth-pct': 2.0,
        'specialty-rx-growth-pct': 18,
        'truecost-client-conversion': 62,
        'stelara-biosimilar-conversion-pct': 72,
        'glp1-volume-growth-pct': 34,
        'oak-street-vbc-patients': 38000,
      },
      revenueImpact: 1600,
      marginImpact: 90,
      confidence: 85,
      keyAssumptions: [
        'HSS AOI ≥$7.25B FY2026 guidance on track',
        'TrueCost transition continues at current ~62% pace',
        'Specialty growth sustains at >15% target',
        'Oak Street at 170+ clinics, +15% revenue YoY',
      ],
    },
    {
      id: 'hss-bear',
      name: 'PBM Competitive Pressure',
      description: 'Client losses to Express Scripts/Optum + biosimilar conversion below target',
      leverSettings: {
        'pharmacy-claims-growth-pct': -1.5,
        'specialty-rx-growth-pct': 12,
        'truecost-client-conversion': 50,
        'stelara-biosimilar-conversion-pct': 65,
        'glp1-volume-growth-pct': 22,
        'oak-street-vbc-patients': 32000,
      },
      revenueImpact: -600,
      marginImpact: -70,
      confidence: 50,
      keyAssumptions: [
        'Caremark loses large PBM client to Express Scripts or Optum',
        'Stelara biosimilar conversion lags — branded volume persists post-exclusion',
        'GLP-1 growth decelerates from Q1 pace as employer cost concerns mount',
        'Oak Street expansion pauses on near-term cost discipline',
      ],
    },
  ],
};

// ─── Tab 4: Digital Platform — Digital Health & Health100 Adoption ───────────
export const digitalHealthTab: ScenarioTabConfig = {
  tabId: 'digital-platform',
  label: 'Digital Health & Health100 Adoption',
  icon: 'Smartphone',
  description: 'Model Health100 member adoption, ExtraCare+ loyalty economics, digital Rx fulfillment, MinuteClinic digital scheduling, and AI prior authorization automation',
  levers: [
    {
      id: 'health100-member-adoption-pct',
      name: 'Health100 Member Adoption Rate',
      category: 'Health100 Platform',
      min: 0, max: 40, default: 8, step: 1,
      unit: '%',
      description: 'Percentage of BD members actively using Health100 platform. H2 2026 launch. Each 1pp adoption on ~26M HCB + 70M ExtraCare members ≈ +$80–120M incremental engagement and care navigation revenue.',
      impact: 'high',
    },
    {
      id: 'extracare-active-members-m',
      name: 'ExtraCare+ Active Members',
      category: 'ExtraCare+ / Loyalty',
      min: 15, max: 45, default: 22, step: 1,
      unit: 'M members',
      description: 'ExtraCare+ active paying members. Current: ~22M. ExtraCare+ members spend ~2.5x vs. non-members. Annual membership generates $5–7/member fee revenue. Health100 integration is the primary growth catalyst.',
      impact: 'high',
    },
    {
      id: 'digital-rx-fill-rate-pct',
      name: 'Digital Rx Fill Rate',
      category: 'Digital Pharmacy',
      min: 20, max: 65, default: 38, step: 2,
      unit: '%',
      description: 'Percentage of CVS prescriptions initiated or managed digitally (app, web, auto-refill). Digital fills carry ~15% lower dispensing cost and drive +8% medication adherence, improving PCW margin and member outcomes.',
      impact: 'medium',
    },
    {
      id: 'minuteclinic-digital-scheduling-pct',
      name: 'MinuteClinic Digital Scheduling Rate',
      category: 'MinuteClinic',
      min: 20, max: 75, default: 45, step: 5,
      unit: '%',
      description: 'Percentage of MinuteClinic visits booked via digital channels (app, Health100). Higher digital booking reduces no-show rate, improves clinician utilization, and drives pharmacy script cross-sell attachment.',
      impact: 'low',
    },
    {
      id: 'myaetna-portal-engagement-pct',
      name: 'MyAetna Portal Monthly Engagement',
      category: 'Aetna Digital',
      min: 25, max: 70, default: 42, step: 2,
      unit: '%',
      description: 'Aetna member portal (MyAetna) monthly active engagement rate. Higher engagement reduces call center cost ~$3–5/member/month and drives preventive care uptake that improves MBR long-term.',
      impact: 'medium',
    },
    {
      id: 'ai-prior-auth-approval-pct',
      name: 'AI Prior Auth Real-Time Approval',
      category: 'Health100 / AI',
      min: 70, max: 99, default: 85, step: 1,
      unit: '%',
      description: 'Percentage of prior authorizations resolved in real-time via AI. Q1 2026: >80%. Target: >85%. Each 1pp improvement eliminates ~$15–25M in admin burden. Full automation = industry-leading standard.',
      impact: 'high',
    },
  ],
  preBuiltScenarios: [
    {
      id: 'digital-bull',
      name: 'Health100 Launch Outperformance',
      description: 'Strong H2 2026 Health100 adoption drives member engagement and digital economics',
      leverSettings: {
        'health100-member-adoption-pct': 18,
        'extracare-active-members-m': 28,
        'digital-rx-fill-rate-pct': 50,
        'minuteclinic-digital-scheduling-pct': 60,
        'myaetna-portal-engagement-pct': 54,
        'ai-prior-auth-approval-pct': 92,
      },
      revenueImpact: 1800,
      marginImpact: 140,
      confidence: 65,
      keyAssumptions: [
        'Health100 H2 2026 launch captures 18% member adoption by year-end',
        'ExtraCare+ cross-sell accelerated via Health100 platform integration',
        'Digital Rx fill rate improvement drives dispensing cost reduction',
        'AI prior auth saves $200M+ annually in enterprise admin burden',
      ],
    },
    {
      id: 'digital-base',
      name: 'Base Digitization Case',
      description: 'Gradual improvement consistent with current rollout pace',
      leverSettings: {
        'health100-member-adoption-pct': 8,
        'extracare-active-members-m': 22,
        'digital-rx-fill-rate-pct': 38,
        'minuteclinic-digital-scheduling-pct': 45,
        'myaetna-portal-engagement-pct': 42,
        'ai-prior-auth-approval-pct': 85,
      },
      revenueImpact: 750,
      marginImpact: 65,
      confidence: 80,
      keyAssumptions: [
        'Health100 adoption gradual through FY2026 launch period',
        'Digital Rx fill rate grows at current trajectory',
        'ExtraCare+ active member base stable at ~22M',
        'AI prior auth reaches >85% real-time approval target',
      ],
    },
    {
      id: 'digital-bear',
      name: 'Slower Digitization Scenario',
      description: 'Health100 delayed; digital pharmacy competitors capture engagement share',
      leverSettings: {
        'health100-member-adoption-pct': 3,
        'extracare-active-members-m': 19,
        'digital-rx-fill-rate-pct': 28,
        'minuteclinic-digital-scheduling-pct': 30,
        'myaetna-portal-engagement-pct': 32,
        'ai-prior-auth-approval-pct': 78,
      },
      revenueImpact: -200,
      marginImpact: -30,
      confidence: 55,
      keyAssumptions: [
        'Health100 H2 2026 launch delayed or underperforms adoption targets',
        'Amazon Pharmacy / Mark Cuban Cost Plus capture digital Rx share',
        'ExtraCare+ churn exceeds new member acquisition rate',
        'AI prior auth implementation takes longer than planned',
      ],
    },
  ],
};
