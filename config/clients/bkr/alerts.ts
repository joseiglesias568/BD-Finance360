// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/alerts.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// Alert thresholds calibrated against Baker Hughes disclosed performance
// bands and FY2026 guidance (IET ≥$2.7B EBITDA; OFSE ≥$2.325B EBITDA;
// total Adj. EBITDA ≥$5.0B; FCF guidance; Chart close Q2 2026).
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { AlertsConfig } from '../../types';

export const alerts: AlertsConfig = {
  templates: [
    // ═══════════════════════════════════════════
    // IET PERFORMANCE — Primary growth driver
    // ═══════════════════════════════════════════
    {
      id: 'iet-orders-miss',
      title: 'IET Quarterly Orders Below $3.5B',
      category: 'IET Performance',
      threshold: 'IET quarterly orders < $3.5B (below ~$3.6B quarterly pace for ≥$14.5B FY2026 guidance)',
      parsedThreshold: 3.5,
      parsedUnit: '$B quarterly orders',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'IET quarterly orders below $3.5B would put FY2026 ≥$14.5B IET orders guidance at risk. Q1 2026 actual was $4,887M (1.46x book-to-bill). Sustained weakness signals LNG FID delays, data center power demand softness, or competitive share loss.',
      suggestedActions: [
        'Decompose by product line: GTE (LNG equipment), GTS (services), CTS (data center), IP, IS',
        'Review CTS data center pipeline — hyperscaler order timing or aeroderivative supply constraints?',
        'Assess LNG FID pipeline — are projects slipping to 2027? Which customers/regions?',
        'Pull IET RPO change — is backlog consuming faster than orders are replacing it?',
        'Cross-reference GE Vernova and Siemens Energy orders for industry context on LNG demand',
      ],
    },
    {
      id: 'iet-margin-compression',
      title: 'IET EBITDA Margin Below 19%',
      category: 'IET Performance',
      threshold: 'IET segment EBITDA margin < 19% (vs Q1 2026 actual 20.2% and FY2026 target ≥20%)',
      parsedThreshold: 19,
      parsedUnit: '% EBITDA margin',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'IET segment EBITDA margin below 19% signals cost overruns, mix shift to lower-margin equipment vs services, or price erosion. Q1 2026 IET margin was 20.2% (+310bps YoY). FY2026 guidance implies IET ≥$2.7B / ~$13.5B revenue = ~20% margin.',
      suggestedActions: [
        'Decompose IET margin by product line: GTE vs GTS vs IP vs IS vs CTS',
        'GTE margin often lower (equipment delivery) vs GTS (services) — check mix shift',
        'Review aeroderivative supply chain costs — any premium procurement impacting margins?',
        'Assess whether large one-time project deliveries are skewing margin lower in the quarter',
        'Pull Chart Industries impact (if closed) — is integration diluting near-term IET margin?',
      ],
    },
    {
      id: 'iet-rpo-decline',
      title: 'IET Remaining Performance Obligations (RPO) Decline',
      category: 'IET Performance',
      threshold: 'IET RPO < $32B (below Q1 2026 record $33.1B — signals book-to-bill <1.0x)',
      parsedThreshold: 32,
      parsedUnit: '$B RPO',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Falls below',
      description: 'IET RPO declining below $32B would indicate orders not keeping pace with revenue recognition — book-to-bill <1.0x. The $33.1B record RPO (Q1 2026) provides 2–3+ year revenue visibility. Sustained RPO erosion is a leading indicator of IET revenue deceleration 12–24 months forward.',
      suggestedActions: [
        'Calculate trailing-quarter book-to-bill — orders vs revenue recognized in same period',
        'Identify which LNG projects are being delivered vs new orders entering RPO',
        'Review GTE order backlog: which projects are ahead vs behind original schedules?',
        'Assess GTS LTSA renewal rate — are long-term service agreements renewing at expected rates?',
        'Model RPO trajectory under different FID cadence assumptions for FY2026–2027',
      ],
    },

    // ═══════════════════════════════════════════
    // OFSE PERFORMANCE — Volume & margin watch
    // ═══════════════════════════════════════════
    {
      id: 'ofse-margin-below-guidance',
      title: 'OFSE EBITDA Margin Below 17%',
      category: 'OFSE Performance',
      threshold: 'OFSE segment EBITDA margin < 17% (vs FY2026 guidance ≥$2.325B on ~$13B revenue ≈ 17.9%)',
      parsedThreshold: 17,
      parsedUnit: '% EBITDA margin',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'OFSE EBITDA margin below 17% puts FY2026 ≥$2.325B guidance at risk. Q1 2026 OFSE margin was 17.5% (-30bps YoY). SPC divestiture removed some fixed costs but also revenue. Further margin pressure from lower Middle East activity or NA rig count declines would require accelerated cost action.',
      suggestedActions: [
        'Decompose OFSE margin by product line: Well Construction, CIM, Production Solutions, SSPS',
        'Review geographic mix — Middle East recovery vs NA weakness changing revenue mix?',
        'Assess cost-out program progress — is the $150–250M annual savings target on track?',
        'Pull restructuring charge run-rate — Q1 2026 was $37M total ($11M OFSE + $28M IET)',
        'Compare to SLB (~20%) and HAL (~17%) margins — competitive benchmarking',
      ],
    },
    {
      id: 'oil-price-shock',
      title: 'Brent Crude Below $60/bbl',
      category: 'OFSE Performance',
      threshold: 'Brent crude oil price sustained < $60/bbl for >2 weeks',
      parsedThreshold: 60,
      parsedUnit: '$/bbl Brent crude',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Sustained below',
      description: 'Brent crude below $60/bbl for a sustained period would trigger E&P capex reductions globally — a direct OFSE headwind with ~6-month lag. Historical evidence: sub-$60 oil causes 15–25% E&P budget cuts and international rig count -10 to -15%. OFSE revenue sensitivity is approximately -$150–200M per $10/bbl sustained decline.',
      suggestedActions: [
        'Assess E&P customer capex budget sensitivity — monitor public statements from key customers',
        'Review OFSE international rig count leading indicators by region',
        'Identify OFSE variable cost structure — how quickly can cost actions offset volume decline?',
        'Pull Saudi Aramco activity signals — Aramco has floor activity levels under LTA terms',
        'Model OFSE EBITDA guidance sensitivity: bear case with Brent at $55–60/bbl for rest of year',
      ],
    },
    {
      id: 'middle-east-activity-decline',
      title: 'Middle East & Asia OFSE Revenue -25% vs Prior Year',
      category: 'OFSE Performance',
      threshold: 'Middle East/Asia OFSE quarterly revenue decline >25% YoY (vs Q1 2026 -19%)',
      parsedThreshold: 25,
      parsedUnit: '% YoY revenue decline',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Exceeds decline of',
      description: 'Middle East/Asia is BKR\'s largest OFSE region (36% of OFSE revenue, $1,152M Q1 2026). A >25% YoY decline would suggest regional conflict escalation, NOC activity cuts, or competitive share loss. Q1 2026 was -19% YoY; further deterioration puts OFSE margin guidance at serious risk.',
      suggestedActions: [
        'Identify specific conflict/disruption geography and customer affected (Saudi Aramco, ADNOC, PTTEP)',
        'Review force majeure clauses in LTA contracts — what activity minimums are protected?',
        'Assess alternative geographic redeployment of equipment and personnel',
        'Pull Latin America and North America OFSE trends for partial offset assessment',
        'Update OFSE full-year guidance tracking based on revised activity assumptions',
      ],
    },

    // ═══════════════════════════════════════════
    // FINANCIAL PERFORMANCE — EBITDA & FCF
    // ═══════════════════════════════════════════
    {
      id: 'adj-ebitda-below-guidance',
      title: 'Adj. EBITDA Pacing Below $5.0B FY2026 Guidance',
      category: 'Margin & Profitability',
      threshold: 'Total Adj. EBITDA annual run-rate < $4.8B (below ≥$5.0B FY2026 guidance)',
      parsedThreshold: 4.8,
      parsedUnit: '$B annual run-rate',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Tracking below',
      description: 'Consolidated Adj. EBITDA pacing below $4.8B annualized puts FY2026 ≥$5.0B guidance at risk. Q1 2026 actual was $1,160M ($4.64B annualized — below guidance pace but typical for seasonality). Full-year requires IET ≥$2.7B + OFSE ≥$2.325B. Guidance miss would likely prompt negative stock reaction.',
      suggestedActions: [
        'Decompose variance: IET vs OFSE — which segment is below guidance pace?',
        'Review IET order-to-revenue conversion timing — are delayed deliveries compressing Q2–Q3?',
        'Assess OFSE cost-out savings realization — are restructuring savings flowing through on time?',
        'Pull Chart Industries close timing — revenue and EBITDA uplift delayed if close slips?',
        'Brief Ahmed Moghal (CFO) on guidance risk and update investor relations communication strategy',
      ],
    },
    {
      id: 'fcf-below-target',
      title: 'Free Cash Flow Quarterly Run-Rate Below $250M',
      category: 'Cash Flow & Capital',
      threshold: 'FCF quarterly run-rate < $250M (annualizes to <$1.0B vs estimated FY2026 target ~$1.5B)',
      parsedThreshold: 250,
      parsedUnit: '$M quarterly FCF',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Tracking below',
      description: 'Q1 2026 FCF was $210M — below FY2026 target trajectory, though Q1 is typically lighter due to working capital seasonality. BKR FCF target ~$1.5B FY2026 (post-Chart). Sustained FCF shortfall limits deleveraging post-Chart and signals potential working capital or capex discipline issues.',
      suggestedActions: [
        'Reconcile FCF shortfall: EBITDA, capex, working capital, or tax/interest timing?',
        'Review customer receivables ($5,507M gross Q1 2026) — collections pace vs plan',
        'Check progress collections (advance payments $5,999M) — new contracts contributing?',
        'Assess capex pacing: Q1 2026 was $336M — on track vs ≤5% of revenue guidance?',
        'Update post-Chart leverage trajectory based on revised FCF outlook',
      ],
    },
    {
      id: 'post-chart-leverage',
      title: 'Post-Chart Leverage Tracking Above 2.5x',
      category: 'Cash Flow & Capital',
      threshold: 'Net Debt / Adj. EBITDA > 2.5x post-Chart close (above ~2.0x target)',
      parsedThreshold: 2.5,
      parsedUnit: 'x Net Debt/EBITDA',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Exceeds',
      description: 'Post-Chart acquisition close, net leverage is expected at ~2.0x. Leverage above 2.5x would indicate EBITDA shortfall vs expectations, delayed Chart EBITDA contribution, or additional debt. Investment-grade ratings require leverage below 2.5–3.0x; sustained elevation risks agency action.',
      suggestedActions: [
        'Review Chart Industries Q1 EBITDA contribution vs acquisition model assumptions',
        'Assess Chart integration cost overruns vs synergy delivery — net impact on EBITDA',
        'Review $9.885B Chart acquisition debt terms — covenant headroom at 2.5x',
        'Pull Moody\'s/S&P rating agency triggers for BKR rating — what level risks downgrade?',
        'Update deleveraging timeline: FCF available for debt paydown vs other capital allocation',
      ],
    },

    // ═══════════════════════════════════════════
    // CHART ACQUISITION & PORTFOLIO
    // ═══════════════════════════════════════════
    {
      id: 'chart-close-delay',
      title: 'Chart Industries Acquisition Close Delay',
      category: 'Strategy Execution',
      threshold: 'Chart close extends beyond Q3 2026 (one quarter beyond Q2 2026 expected close)',
      parsedThreshold: 0,
      parsedUnit: 'Binary: close timing milestone',
      severity: 'critical',
      alertType: 'anomaly',
      frequency: 'daily',
      conditionPrefix: 'Milestone at risk:',
      description: 'Chart Industries acquisition ($13.6B EV) expected to close Q2 2026. Delay to Q3 2026 or beyond would defer ~$400M EBITDA contribution and Chart revenue consolidation, directly impacting FY2026 results. $9.885B in acquisition financing (notes issued March 2026) begins accruing interest regardless of close timing.',
      suggestedActions: [
        'Identify delay driver: regulatory (antitrust), financing, or due diligence/conditions',
        'Assess impact on FY2026 revenue and EBITDA guidance — restate if close slips >1 quarter',
        'Review antitrust filing status in US, EU, and other required jurisdictions',
        'Model interest cost carrying on $9.885B notes during delay period',
        'Communicate updated close timeline to IR and investor community proactively',
      ],
    },
    {
      id: 'waygate-close-status',
      title: 'Waygate Technologies Divestiture Status',
      category: 'Strategy Execution',
      threshold: 'Waygate → Hexagon close delayed beyond Q3 2026 expected close',
      parsedThreshold: 0,
      parsedUnit: 'Binary: divestiture close milestone',
      severity: 'info',
      alertType: 'anomaly',
      frequency: 'daily',
      conditionPrefix: 'Milestone update:',
      description: 'BKR signed agreement to sell Waygate Technologies to Hexagon AB for ~$1.45B (announced April 2026). Expected close H2 2026. Proceeds fund post-Chart debt reduction. Delay would impact deleveraging timeline and net leverage trajectory.',
      suggestedActions: [
        'Review Hexagon regulatory approvals status across required jurisdictions',
        'Model post-Waygate-close net leverage trajectory — $1.45B proceeds for debt paydown',
        'Assess any customer or employee retention risks during divestiture transition period',
        'Compare to PSI ($1.2B Crane, closed Q1) and SPC ($323M Cactus JV, closed Q1) timing',
        'Update portfolio simplification tracker for Board and IR',
      ],
    },

    // ═══════════════════════════════════════════
    // LNG & DATA CENTER MARKET
    // ═══════════════════════════════════════════
    {
      id: 'cts-data-center-slowdown',
      title: 'CTS Data Center Power Orders Drop Below $500M/Quarter',
      category: 'IET Performance',
      threshold: 'Climate Technology Solutions quarterly orders < $500M (vs Q1 2026 record $1,257M)',
      parsedThreshold: 500,
      parsedUnit: '$M quarterly CTS orders',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Falls below',
      description: 'CTS orders $1,257M in Q1 2026 (9x YoY surge). Sustained quarterly orders below $500M would signal hyperscaler gas turbine procurement slowdown — the primary CTS demand driver. This could reflect aeroderivative supply constraints delivering backlogs, reduced data center build pace, or alternative power solutions displacing BKR.',
      suggestedActions: [
        'Decompose CTS by product: data center aeroderivative turbines vs CCUS vs hydrogen vs geothermal',
        'Check aeroderivative supply chain — is constrained supply limiting order intake or delivery?',
        'Survey hyperscaler capex signals: Microsoft, Google, Meta, Amazon power investment pace',
        'Review IET CTS backlog delivery — are existing orders being shipped, reducing new intake?',
        'Assess competitive landscape: GE Vernova aeroderivative availability vs BKR',
      ],
    },
    {
      id: 'lng-fid-calendar-miss',
      title: 'No Major LNG Final Investment Decisions in Trailing 6 Months',
      category: 'IET Performance',
      threshold: 'Zero major LNG project FIDs (>$5B investment) over any rolling 6-month period',
      parsedThreshold: 0,
      parsedUnit: '# major LNG FIDs in 6-month window',
      severity: 'warning',
      alertType: 'forecast',
      frequency: 'monthly',
      conditionPrefix: 'Count falls to',
      description: 'LNG final investment decisions are the leading indicator of GTE equipment orders 12–24 months forward. An extended FID drought would signal future IET RPO growth stalling. Current RPO $33.1B provides 2–3 year buffer but sustained FID absence would compress the longer-term IET growth narrative.',
      suggestedActions: [
        'Review global LNG FID pipeline: Qatar North Field, US Gulf Coast, East Africa, Australia',
        'Identify delay drivers: permitting, gas pricing, financing, geopolitical, or LNG oversupply concerns',
        'Model IET RPO trajectory if 0 vs 2 vs 4 major FIDs occur in next 12 months',
        'Check with IET commercial team on late-stage project awards not yet at FID',
        'Review Chart Industries pipeline impact — combined portfolio changes LNG project economics',
      ],
    },

    // ═══════════════════════════════════════════
    // PREDICTIVE ANALYTICS
    // ═══════════════════════════════════════════
    {
      id: 'revenue-forecast-confidence',
      title: 'Revenue Forecast Confidence Degradation',
      category: 'Predictive Analytics',
      threshold: 'Forecast confidence interval widens beyond +/-3% (broader range for industrial co.)',
      parsedThreshold: 3,
      parsedUnit: '% confidence band',
      severity: 'critical',
      alertType: 'forecast',
      frequency: 'daily',
      conditionPrefix: 'Confidence band widened beyond',
      description: 'AI revenue-forecasting model confidence interval for current quarter widened beyond +/-3%. BKR revenue is long-cycle and generally predictable (IET RPO visibility); widening confidence bands likely driven by OFSE macro uncertainty (oil price, rig count) or IET delivery timing shifts. Warrants CFO review before any external guidance confirmation.',
      suggestedActions: [
        'Identify input variables driving confidence degradation: IET delivery timing, OFSE rig count, oil price?',
        'Separate IET (RPO-backed, predictable) vs OFSE (macro-sensitive) confidence contributions',
        'Review current-quarter delivery schedule vs original IET backlog plan — any project slippage?',
        'Assess OFSE booking pace: is order-to-revenue lag changing?',
        'Prepare scenario-based guidance ranges for Ahmed Moghal (CFO) review pre-earnings',
      ],
    },
    {
      id: 'anomaly-detection',
      title: 'Anomalous Operational or Financial Pattern Detected',
      category: 'Predictive Analytics',
      threshold: 'Statistical anomaly score > 2.5 sigma from expected seasonal pattern',
      parsedThreshold: 2.5,
      parsedUnit: 'sigma deviation',
      severity: 'info',
      alertType: 'anomaly',
      frequency: 'daily',
      conditionPrefix: 'Anomaly score exceeds',
      description: 'Unsupervised anomaly detection flagged an unusual pattern in BKR operational or financial data deviating >2.5 standard deviations from expected behavior. Could indicate project cancellation, unusual customer prepayment, regional disruption, or emerging margin opportunity.',
      suggestedActions: [
        'Review anomaly detail: which segment (IET vs OFSE), product line, and geography?',
        'Determine if anomaly is an emerging risk (customer credit, delivery disruption) or opportunity',
        'Cross-reference with external events: oil price, geopolitical, competitor news, FID announcements',
        'Assess whether anomaly warrants escalation to segment CFO or Lorenzo Simonelli (CEO)',
        'Add to watchlist for 7 days to determine if one-time or sustained trend',
      ],
    },
  ],
};
