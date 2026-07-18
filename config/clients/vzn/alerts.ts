// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/alerts.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// Alert thresholds calibrated against Verizon's disclosed performance
// bands and FY2026 guidance. Real production alerts would be tuned by
// the CFO/COO organizations against the operating plan.
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { AlertsConfig } from '../../types';

export const alerts: AlertsConfig = {
  templates: [
    // ═══════════════════════════════════════════
    // WIRELESS SERVICE REVENUE — Primary KPI
    // ═══════════════════════════════════════════
    {
      id: 'wireless-service-revenue-miss',
      title: 'Wireless Service Revenue Growth Miss',
      category: 'Revenue & Subscribers',
      threshold: 'Wireless service revenue growth < 1.5% YoY',
      parsedThreshold: 1.5,
      parsedUnit: '% YoY growth',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'Wireless service revenue growth dropped below 1.5% YoY (vs Q1 2026 +2.7% and FY2026 guidance +2.0–2.8%). Primary investor focus metric. Below 1.5% signals ARPA compression or churn exceeding plan.',
      suggestedActions: [
        'Decompose: postpaid service revenue vs prepaid vs wholesale (MVNO)',
        'Review ARPA by plan tier — is myPlan premium adoption stalling?',
        'Pull postpaid phone net adds vs plan — churn or gross add shortfall?',
        'Cross-reference T-Mobile and AT&T wireless service revenue growth for industry context',
        'Assess myPlan promotion offers — is competitive discounting eroding ARPA?',
      ],
    },
    {
      id: 'postpaid-churn-spike',
      title: 'Postpaid Phone Churn Spike',
      category: 'Revenue & Subscribers',
      threshold: 'Postpaid phone churn > 0.95% monthly',
      parsedThreshold: 0.95,
      parsedUnit: '% monthly churn',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Exceeds',
      description: 'Postpaid phone churn exceeded 0.95% monthly (vs Q1 2026 actual 0.89% and AT&T/T-Mobile benchmark ~0.82%). High churn directly reduces wireless service revenue and requires elevated promotional spend to replace subscribers.',
      suggestedActions: [
        'Identify churn by region — is there a competitive hot spot (T-Mobile price promotion)?',
        'Review myPlan sticky ecosystem penetration — churners vs stayers',
        'Pull C-Band quality improvement data — is network quality driving churn in specific markets?',
        'Assess promotion counter-offers — retention economics vs new subscriber acquisition cost',
        'Review Frontier customer churn — is integration friction a driver?',
      ],
    },
    {
      id: 'arpa-compression',
      title: 'ARPA Compression Warning',
      category: 'Revenue & Subscribers',
      threshold: 'Monthly ARPA < $136/account',
      parsedThreshold: 136,
      parsedUnit: '$/month per account',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Falls below',
      description: 'Average Revenue Per Account compressed below $136/mo (vs ~$139 current). ARPA compression signals plan downgrading, competitive promotional activity, or myPlan perk revenue declining. Every $1 ARPA decline = ~$1.4B annualized wireless revenue impact.',
      suggestedActions: [
        'Decompose ARPA: plan tier mix vs perk attach rate vs device payment plans',
        'Review myPlan premium tier vs standard mix — is premium adoption declining?',
        'Assess multi-line account dynamics — are households adding or removing lines?',
        'Compare to competitor ARPU trends (T-Mobile, AT&T) for market-rate context',
        'Model promotional impact on ARPA — are new-subscriber promotions diluting existing base?',
      ],
    },

    // ═══════════════════════════════════════════
    // BROADBAND & FWA — Growth business watch
    // ═══════════════════════════════════════════
    {
      id: 'fwa-net-adds-miss',
      title: 'FWA Net Adds Below Quarterly Pace',
      category: 'Broadband & FWA',
      threshold: 'FWA net adds < 150K in a quarter',
      parsedThreshold: 150,
      parsedUnit: 'K net adds / quarter',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Falls below',
      description: 'Fixed Wireless Access quarterly net adds below 150K (vs Q1 2026 +339K and FY2026 guidance 700K–800K, implying ~175K/quarter). Risks missing full-year guidance and signals competitive pressure from T-Mobile FWA or cable broadband pricing actions.',
      suggestedActions: [
        'Review FWA gross adds vs churn — is it a pipeline or retention issue?',
        'Pull C-Band network coverage by eligible household — quality gap vs plan?',
        'Assess T-Mobile FWA competitive activity in key markets',
        'Review FWA pricing vs cable broadband alternatives — are customers choosing Comcast/Charter?',
        'Check ACP expiry impact — any low-income subscriber churn persisting?',
      ],
    },
    {
      id: 'fios-penetration-stall',
      title: 'Fios Broadband Penetration Stall',
      category: 'Broadband & FWA',
      threshold: 'Fios subs as % of passings < 34%',
      parsedThreshold: 34,
      parsedUnit: '% fiber penetration',
      severity: 'warning',
      alertType: 'trend',
      frequency: 'monthly',
      conditionPrefix: 'Falls below',
      description: 'Fios Internet penetration rate (subs/passings) falling below 34% signals competitive overbuild pressure (Comcast, Optimum, or new fiber entrant in Fios footprint). Frontier markets have lower initial penetration (~30%) as baseline.',
      suggestedActions: [
        'Identify which geographies have sub-34% penetration and overbuild competition',
        'Review Frontier territory penetration separately (lower base, improvement expected)',
        'Assess Fios pricing vs cable broadband in affected markets',
        'Review fiber-to-wireless bundle cross-sell success rate in lower-penetration areas',
        'Pull Fios video vs internet-only trends — is video cord-cutting driving total Fios churn?',
      ],
    },

    // ═══════════════════════════════════════════
    // FINANCIAL PERFORMANCE — EBITDA & FCF
    // ═══════════════════════════════════════════
    {
      id: 'ebitda-margin-compression',
      title: 'Adj. EBITDA Margin Compression',
      category: 'Margin & Profitability',
      threshold: 'Adj. EBITDA margin < 37% or -150bps YoY',
      parsedThreshold: 37,
      parsedUnit: '% adj. EBITDA margin',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'Consolidated adjusted EBITDA margin below 37% (vs Q1 2026 ~39%). Industry-leading margin is Verizon\'s primary valuation differentiator. 150bps compression risks consensus EPS miss and dividend sustainability concerns.',
      suggestedActions: [
        'Decompose margin: Consumer vs Business vs Corporate — which segment driving compression?',
        'Review cost of service — network labor, energy, roaming costs trending above plan?',
        'Assess SG&A — promotional spend, subscriber acquisition costs elevated?',
        'Pull Frontier integration cost synergy run-rate — on track vs slipping?',
        'Review AI/automation savings — are Phase 1 savings materializing as planned?',
      ],
    },
    {
      id: 'fcf-below-guidance',
      title: 'Free Cash Flow Below Guidance Pace',
      category: 'Cash Flow & Capital',
      threshold: 'FCF tracking < $20B annual run-rate (below $21.5B guidance floor)',
      parsedThreshold: 20.0,
      parsedUnit: 'B annual run-rate',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Tracking below',
      description: 'Annual FCF run-rate below $20B (vs FY2026 guidance ≥$21.5B). FCF is primary source of debt paydown to reach 2.25x leverage target. Miss would delay deleveraging timeline and pressure dividend coverage ratio.',
      suggestedActions: [
        'Reconcile FCF shortfall: EBITDA shortfall, CapEx overrun, or working capital issue?',
        'Review CapEx phasing — is Frontier network integration spending ahead of plan?',
        'Assess spectrum license payments — any accelerated payments in the period?',
        'Pull interest expense trajectory — any refinancing activity increasing cash interest?',
        'Update leverage trajectory and deleveraging timeline based on revised FCF projection',
      ],
    },
    {
      id: 'leverage-creep',
      title: 'Net Leverage Above Target Path',
      category: 'Cash Flow & Capital',
      threshold: 'Net Debt / Adj. EBITDA > 2.6x',
      parsedThreshold: 2.6,
      parsedUnit: 'x Net Debt/EBITDA',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Exceeds',
      description: 'Net leverage above 2.6x (vs post-Frontier ~2.5x baseline and FY2026 target ≤2.25x). Rating agency trigger levels are ~2.7–2.8x for a downgrade watch. Exceeding 2.6x signals YE 2026 target at risk.',
      suggestedActions: [
        'Review EBITDA run-rate vs trailing four quarters',
        'Pull debt issuance vs maturity schedule — any incremental debt in the quarter?',
        'Cross-reference credit agency outlooks (Baa1/BBB+ target maintained)',
        'Update deleveraging timeline with revised FCF and EBITDA assumptions',
        'Assess dividend payout ratio — is dividend growth sustainable at current leverage?',
      ],
    },
    {
      id: 'capex-overshoot',
      title: 'CapEx Pace Above Annual Guidance',
      category: 'Cash Flow & Capital',
      threshold: 'CapEx pacing > 110% of $18.5B annual guidance ceiling',
      parsedThreshold: 110,
      parsedUnit: '% of guidance ceiling',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Pacing above',
      description: 'Capital expenditure run rate tracking above 110% of the $18.5B FY2026 guidance ceiling. Frontier integration and C-Band densification are the two largest variable buckets.',
      suggestedActions: [
        'Decompose CapEx: wireless network (C-Band) vs fiber (Frontier) vs IT/BSS vs other',
        'Review Frontier integration network upgrade timing — accelerated vs plan?',
        'Assess small cell deployment pace — on track vs ahead vs behind?',
        'Pull Chinese equipment removal spend (FCC mandate) vs plan',
        'Update FCF guidance impact of CapEx variance and brief IR',
      ],
    },

    // ═══════════════════════════════════════════
    // NETWORK & TECHNOLOGY
    // ═══════════════════════════════════════════
    {
      id: 'network-outage-major',
      title: 'Major Network Outage — Critical Infrastructure',
      category: 'Network & Operations',
      threshold: 'Service-affecting outage impacting >1M customers or >4 hours in major metro',
      parsedThreshold: 1,
      parsedUnit: 'M customers affected',
      severity: 'critical',
      alertType: 'anomaly',
      frequency: 'daily',
      conditionPrefix: 'Outage affecting',
      description: 'Major network outage affecting critical infrastructure threshold. Revenue impact ~$200M for 48hr national outage (est.). Reputational impact significant given network reliability brand positioning.',
      suggestedActions: [
        'Activate network operations incident response protocol immediately',
        'Identify root cause: power, fiber cut, equipment failure, cyberattack, or weather',
        'Assess regulatory notification requirements (FCC, CISA critical infrastructure)',
        'Deploy customer communications via myVerizon app and media relations',
        'Quantify revenue impact — customer SLA credits and churn risk modeling',
      ],
    },
    {
      id: 'cband-deployment-delay',
      title: 'C-Band Densification Milestone Slip',
      category: 'Network & Operations',
      threshold: 'C-Band coverage <80% population by Q3 2026',
      parsedThreshold: 80,
      parsedUnit: '% population coverage',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Coverage below',
      description: 'C-Band population coverage below 80% by Q3 2026 checkpoint (target 90% by year-end 2026). Slippage jeopardizes FWA quality improvements and premium 5G UW competitive positioning vs T-Mobile.',
      suggestedActions: [
        'Review tower site upgrade backlog by market and identify bottlenecks',
        'Assess equipment delivery schedules (Ericsson/Samsung) — supply chain delays?',
        'Pull zoning/permitting status for key small cell sites',
        'Evaluate impact on FWA quality and FWA net add trajectory',
        'Model FWA guidance risk if C-Band coverage target slips to Q1 2027',
      ],
    },

    // ═══════════════════════════════════════════
    // COMPETITIVE INTELLIGENCE
    // ═══════════════════════════════════════════
    {
      id: 'tmo-competitive-action',
      title: 'T-Mobile Competitive Price/Product Action',
      category: 'Competitive Intelligence',
      threshold: 'T-Mobile launches <$30/line promotion or new FWA offer in Verizon core markets',
      parsedThreshold: 30,
      parsedUnit: '$/line promotion price',
      severity: 'warning',
      alertType: 'anomaly',
      frequency: 'daily',
      conditionPrefix: 'Competitive action detected:',
      description: 'T-Mobile launched a material promotional offer or product change in Verizon\'s core markets. T-Mobile is the primary churn risk — consistently adding 1.3M+ postpaid phone net adds per quarter vs Verizon\'s +55K.',
      suggestedActions: [
        'Analyze T-Mobile offer structure and target segments (prepaid, specific markets, FWA)',
        'Model churn and gross add impact on Verizon if 10–20% of at-risk base switches',
        'Review Verizon retention toolkit — targeted myPlan promotions, device deals',
        'Assess competitive response options — matching, differentiating, or conceding segment',
        'Pull recent Verizon switching data — inflows from T-Mobile vs outflows',
      ],
    },
    {
      id: 'charter-cox-merger-progression',
      title: 'Charter+Cox Merger Regulatory Progression',
      category: 'Competitive Intelligence',
      threshold: 'California CPUC approval granted or denied',
      parsedThreshold: 0,
      parsedUnit: 'Binary: approval/denial',
      severity: 'info',
      alertType: 'anomaly',
      frequency: 'daily',
      conditionPrefix: 'Regulatory update:',
      description: 'Charter+Cox merger (FCC approved Feb 27, 2026) awaiting California CPUC approval (deadline Sep 15, 2026). Post-merger entity would have ~17M MVNO lines on Verizon. Approval/denial is a material competitive event.',
      suggestedActions: [
        'If approved: model combined Charter+Cox MVNO leverage for contract renegotiation risk',
        'If denied: assess impact on Charter standalone competitive positioning',
        'Review Verizon MVNO contract terms and renewal timeline for Spectrum Mobile and Xfinity',
        'Assess whether combined entity would seek alternative network partner or self-build',
        'Brief IR on potential MVNO revenue risk if contracts are renegotiated post-merger',
      ],
    },

    // ═══════════════════════════════════════════
    // PREDICTIVE ANALYTICS
    // ═══════════════════════════════════════════
    {
      id: 'revenue-forecast-confidence',
      title: 'Revenue Forecast Confidence Degradation',
      category: 'Predictive Analytics',
      threshold: 'Forecast confidence interval widens beyond +/-2%',
      parsedThreshold: 2,
      parsedUnit: '% confidence band',
      severity: 'critical',
      alertType: 'forecast',
      frequency: 'daily',
      conditionPrefix: 'Confidence band widened beyond',
      description: 'AI revenue-forecasting model confidence interval for current quarter widened beyond +/-2%, indicating input signals (churn, ARPA, FWA adds) diverging from historical patterns. Telco revenue is highly recurring — widening confidence bands are unusual and warrant investigation.',
      suggestedActions: [
        'Identify which input variables are driving confidence degradation (churn, ARPA, FWA, equipment)',
        'Compare current quarter actuals-to-date against forecast midpoint by segment',
        'Assess whether macro indicators (consumer confidence, competitive promotions) are drivers',
        'Run sensitivity on top 5 contributing variables — churn and ARPA are most impactful',
        'Prepare scenario-based guidance ranges for CFO Skiadas review pre-earnings',
      ],
    },
    {
      id: 'churn-prediction-elevated',
      title: 'Churn Prediction Model — Elevated Risk Cohort',
      category: 'Predictive Analytics',
      threshold: 'ML model flags >500K subscribers at elevated churn risk in rolling 30 days',
      parsedThreshold: 500,
      parsedUnit: 'K subscribers at elevated risk',
      severity: 'warning',
      alertType: 'forecast',
      frequency: 'weekly',
      conditionPrefix: 'At-risk cohort exceeds',
      description: 'Churn prediction model flagged >500K postpaid subscribers with elevated probability of churn in next 30 days. Predictive intervention (proactive retention offers) typically has 20–40% conversion rate.',
      suggestedActions: [
        'Segment at-risk cohort: contract end dates, service quality issues, competitive exposure',
        'Activate proactive retention campaigns via myVerizon app push notifications',
        'Deploy targeted myPlan upgrade offers to at-risk premium tier customers',
        'Review C-Band coverage in at-risk customer locations — network quality intervention',
        'Assess retention offer economics vs predicted CLV of at-risk cohort',
      ],
    },
    {
      id: 'anomaly-detection',
      title: 'Anomalous Operational Pattern Detected',
      category: 'Predictive Analytics',
      threshold: 'Statistical anomaly score > 2.5 sigma from expected',
      parsedThreshold: 2.5,
      parsedUnit: 'sigma deviation',
      severity: 'info',
      alertType: 'anomaly',
      frequency: 'daily',
      conditionPrefix: 'Anomaly score exceeds',
      description: 'Unsupervised anomaly detection flagged an unusual pattern in operational or financial data deviating >2.5 standard deviations from expected behavior. Could indicate network event, competitive action, or emerging opportunity.',
      suggestedActions: [
        'Review anomaly detail report for the specific pattern and geography flagged',
        'Determine if anomaly is localized (specific region/segment) or systemic',
        'Cross-reference with external events (competitor launch, regulatory, weather, cyberattack)',
        'Assess whether anomaly represents opportunity (churn inflow from competitor) or risk',
        'Add to watchlist for next 7 days to determine if one-time or sustained trend',
      ],
    },
  ],
};
