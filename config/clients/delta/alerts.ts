// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/alerts.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Alert thresholds and categories are operational settings. Threshold
// values are calibrated against Delta Air Lines disclosed metrics:
// Form 10-K (FY 2025); Form 10-Q (Q1 2026); JPM Industrials Conference
// deck. Suggested actions reference the Delta playbook surfaced in the
// Q1 2026 earnings call (capacity discipline, fuel recapture, refinery
// offset, premium mix, AmEx growth).
//
// DISCLAIMER
// Alert thresholds are operational parameters, not Delta-disclosed
// figures. Threshold levels are estimates calibrated to current Delta
// performance bands. Severity assignments and frequency settings are
// editorial defaults. Real production alerts would be tuned by the
// CFO/COO organizations against operating plan.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { AlertsConfig } from '../../types';

export const alerts: AlertsConfig = {
  templates: [
    // ═══════════════════════════════════════════
    // REVENUE & CAPACITY — The CFO's first look every morning
    // ═══════════════════════════════════════════
    {
      id: 'passenger-revenue-decline',
      title: 'Passenger Revenue Decline',
      category: 'Revenue & Capacity',
      threshold: 'Passenger revenue < -5% QoQ',
      parsedThreshold: -5,
      parsedUnit: '% QoQ',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'Passenger ticket revenue fell below the -5% QoQ threshold. Most-watched leading indicator for the Airline segment — triggers immediate executive review of premium vs main cabin mix, geographic split, and capacity vs yield decomposition.',
      suggestedActions: [
        'Decompose into Main Cabin vs Premium Products vs Loyalty Travel Awards',
        'Pull geographic split: Domestic vs Atlantic vs Latin America vs Pacific',
        'Compare ASMs vs RPMs to isolate capacity vs demand driver',
        'Review corporate sales pipeline vs prior quarter',
        'Cross-reference with industry capacity (UAL, AAL, LUV) to detect share-shift signal',
      ],
    },
    {
      id: 'booking-velocity-reversal',
      title: 'Forward Booking Velocity Trend Reversal',
      category: 'Revenue & Capacity',
      threshold: '3+ week declining trend in cash sales detected by ML',
      parsedThreshold: 3,
      parsedUnit: ' consecutive weeks',
      severity: 'critical',
      alertType: 'forecast',
      frequency: 'daily',
      conditionPrefix: 'ML model detects',
      description: 'Machine learning model detected a sustained decline in cash sales over 3+ consecutive weeks. Per CEO commentary, "cash sales are the clearest indicator of demand." Predictive analysis indicates continued erosion probability of 78% unless corrective action is taken within 10 days.',
      suggestedActions: [
        'Review AI-generated root cause analysis for booking decline drivers',
        'Cross-reference with fuel price movements — is fuel pass-through pricing too aggressive?',
        'Pull close-in vs forward booking curve split to identify deterioration timing',
        'Check premium vs main cabin booking pace differential',
        'Model revenue impact if trend continues for 2 additional weeks',
      ],
    },
    {
      id: 'yield-erosion',
      title: 'Passenger Mile Yield Erosion',
      category: 'Revenue & Capacity',
      threshold: 'Yield < seasonal norm by 5%+',
      parsedThreshold: 5,
      parsedUnit: '% below norm',
      severity: 'warning',
      alertType: 'anomaly',
      frequency: 'daily',
      conditionPrefix: 'Deviates from seasonal norm by',
      description: 'Passenger mile yield (cents/RPM) is trending 5%+ below seasonal expectations, signaling potential pricing pressure, mix shift toward main cabin, or competitor capacity additions on key routes.',
      suggestedActions: [
        'Decompose yield by geographic entity to isolate weakness',
        'Review premium product mix — is it the structural driver or pricing?',
        'Cross-reference competitor capacity (Diio Mi or similar) on overlapping O&Ds',
        'Assess if hub-by-hub local share is shifting',
        'Pull off-peak vs peak yield split — is the issue concentrated in red-eye/edge-of-day flying?',
      ],
    },

    // ═══════════════════════════════════════════
    // FUEL & COST INPUTS — Where the operating margin lives
    // ═══════════════════════════════════════════
    {
      id: 'fuel-price-spike',
      title: 'Jet Fuel Price Spike',
      category: 'Fuel & Cost Inputs',
      threshold: 'Avg jet fuel price > $3.50/gal weekly avg',
      parsedThreshold: 3.50,
      parsedUnit: '$/gallon',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Exceeds',
      description: 'Weekly-avg jet fuel price exceeded the $3.50/gal alert threshold (vs Q1 2026 actual $2.62, Q2 2026 forward ~$4.30). Triggers refinery-capture forecast review (Monroe), capacity-discipline activation (off-peak / red-eye trim), and fuel-recapture surcharge timing analysis.',
      suggestedActions: [
        'Pull current Trainer refinery crack spread and quantify Q+1 offset',
        'Update forward fuel curve and refresh Q+1 EPS bridge',
        'Activate capacity-discipline playbook — identify off-peak / red-eye candidates',
        'Coordinate with CCO Esposito on fare-recapture timing (40-50% Q2 target playbook)',
        'Model 90 vs 180-day fuel persistence at current level — back-half capacity decisions',
      ],
    },
    {
      id: 'refinery-hedge-divergence',
      title: 'Refinery Offset Below Forecast',
      category: 'Fuel & Cost Inputs',
      threshold: 'Quarterly refinery benefit < forecast by 25%+',
      parsedThreshold: 25,
      parsedUnit: '% below forecast',
      severity: 'warning',
      alertType: 'anomaly',
      frequency: 'weekly',
      conditionPrefix: 'Below forecast by',
      description: 'Trainer refinery quarterly contribution is tracking 25%+ below the implied forecast (Q2 2026 expected ~$300M). Could indicate hedge-settlement timing mismatch, crack-spread compression, or unexpected throughput issue.',
      suggestedActions: [
        'Pull crack spread vs forecast assumption used in guidance',
        'Review Monroe Energy throughput — is it at or near 200K bpd capacity?',
        'Assess hedge-inventory carrying balance and timing of inventory sale',
        'Coordinate with Treasury on MTM adjustments and settlement deferrals',
        'Update Q+1 EPS bridge and brief IR on potential variance from guidance',
      ],
    },
    {
      id: 'salaries-ratio-breach',
      title: 'Salaries Cost Ratio Breach',
      category: 'Fuel & Cost Inputs',
      threshold: 'Salaries + profit-sharing > 32% of revenue',
      parsedThreshold: 32,
      parsedUnit: '% of revenue',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Exceeds',
      description: 'Salaries + profit-sharing has exceeded 32% of revenue (FY 2025 actual ~30%). Largest single cost line. Could signal pay-step-up impact, headcount drift, or unexpected profit-sharing accrual movement.',
      suggestedActions: [
        'Decompose into Salaries (10-K line) vs Profit Sharing (10-K line) movement',
        'Pull headcount trend by major function (flight ops, ground ops, tech ops, corporate)',
        'Assess profit-sharing accrual against 10%/20% formula and revised pre-tax projection',
        'Review pay-step-up timing (4% pilot Jan 2026; 4% eligible Jun 2025)',
        'Cross-reference with ALPA negotiation timeline (amendable Dec 31, 2026)',
      ],
    },

    // ═══════════════════════════════════════════
    // OPERATING MARGIN & UNIT ECONOMICS
    // ═══════════════════════════════════════════
    {
      id: 'operating-margin-compression',
      title: 'Operating Margin Compression',
      category: 'Margin & Profitability',
      threshold: 'Adjusted op margin < 6% or -200bps YoY',
      parsedThreshold: 6,
      parsedUnit: '% adjusted operating margin',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'daily',
      conditionPrefix: 'Falls below',
      description: 'Consolidated adjusted operating margin compressed below 6% or declined more than 200 basis points year-over-year. Threatens path to mid-teens 3-5 year target per JPM Value Creation Framework.',
      suggestedActions: [
        'Run waterfall: salaries, fuel, refinery, contracted services, regional carrier — which bucket?',
        'Decompose by segment: Airline vs Refinery vs Loyalty/MRO/Other',
        'Geographic split: Domestic / Atlantic / LatAm / Pacific',
        'Pull TRASM vs CASM-Ex spread — is it revenue or cost-driven?',
        'Compare to peer adj pre-tax margin (UAL ~7.8%, AAL ~6%) for relative-positioning context',
      ],
    },
    {
      id: 'casm-ex-spike',
      title: 'CASM-Ex (Non-Fuel Unit Cost) Spike',
      category: 'Margin & Profitability',
      threshold: 'Quarterly CASM-Ex growth > 7% YoY',
      parsedThreshold: 7,
      parsedUnit: '% YoY growth',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Exceeds',
      description: 'Non-fuel unit cost growing >7% YoY (Q1 2026 actual +6%). Long-term target is low-single-digit growth. Likely drivers: capacity discipline (denominator effect), crew-related recovery costs, or contract pay step-ups.',
      suggestedActions: [
        'Decompose: capacity-driven (denominator) vs cost-base (numerator)',
        'Review crew-related recovery costs from PWA reliability friction',
        'Assess regional carrier expense growth (FY 2025 +10%)',
        'Pull contracted services and maintenance growth — Sky Club expansion impact?',
        'Update FY guidance on non-fuel CASM with revised range',
      ],
    },
    {
      id: 'segment-margin-divergence',
      title: 'Geographic Segment Margin Divergence',
      category: 'Margin & Profitability',
      threshold: 'Any geography deviating >300bps from plan',
      parsedThreshold: 300,
      parsedUnit: ' bps from plan',
      severity: 'warning',
      alertType: 'trend',
      frequency: 'weekly',
      conditionPrefix: 'Deviating by',
      description: 'One or more geographies (Domestic, Atlantic, Latin America, Pacific) showing margin deviation of more than 300 basis points from plan. Could signal Aeromexico antitrust impact, Mexico leisure weakness, or competitive capacity actions.',
      suggestedActions: [
        'Identify which geography(ies) are driving divergence',
        'Decompose into PRASM vs CASM-Ex variance by region',
        'Check Aeromexico JV status (DOT antitrust appeal pending under Court stay)',
        'Review Mexico leisure recovery vs Caribbean/Florida redirection',
        'Assess Pacific Korean Air JV trajectory and China capacity impact',
      ],
    },

    // ═══════════════════════════════════════════
    // CAPACITY & LOAD FACTOR — Network intelligence
    // ═══════════════════════════════════════════
    {
      id: 'load-factor-decline',
      title: 'Load Factor Decline',
      category: 'Capacity & Load Factor',
      threshold: 'Quarterly load factor < 80%',
      parsedThreshold: 80,
      parsedUnit: '% load factor',
      severity: 'warning',
      alertType: 'forecast',
      frequency: 'daily',
      conditionPrefix: 'Predicted to fall below',
      description: 'Predictive model forecasts quarterly load factor declining below 80% (vs FY 2025 84%, Q1 2026 81.6%). Could indicate capacity overshoot vs demand or competitive capacity additions.',
      suggestedActions: [
        'Review forward booking curve and close-in build trajectory',
        'Pull capacity-by-region split — is the issue concentrated in one entity?',
        'Assess capacity-discipline lever — accelerate off-peak/red-eye trims?',
        'Cross-reference with peer capacity announcements (UAL, AAL)',
        'Model revenue impact if load factor declines further by 2 pts',
      ],
    },
    {
      id: 'corporate-share-loss',
      title: 'Corporate Customer Share Loss Signal',
      category: 'Capacity & Load Factor',
      threshold: 'Corporate sales growth < +5% QoQ in coastal hubs',
      parsedThreshold: 5,
      parsedUnit: '% QoQ growth',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'weekly',
      conditionPrefix: 'Falls below',
      description: 'Corporate sales growth in coastal hubs (NY, LAX, BOS, SEA) tracking below 5% QoQ. Coastal hubs are the corporate-share growth engine; Q1 2026 hit a quarterly record with double-digit growth.',
      suggestedActions: [
        'Pull corporate-contracted ticket revenue by hub and by industry sector',
        'Review competitive RFP win rate vs UAL, AAL on key corporate accounts',
        'Assess Banking, Aerospace & Defense, Tech sector momentum (Q1 2026 leaders)',
        'Cross-reference with corporate survey results (85% expect Q2 spend up or flat)',
        'Brief commercial team on retention plays for at-risk accounts',
      ],
    },

    // ═══════════════════════════════════════════
    // CASH FLOW & CAPITAL — The balance sheet story
    // ═══════════════════════════════════════════
    {
      id: 'fcf-below-guidance',
      title: 'Free Cash Flow Below Guidance',
      category: 'Cash Flow & Capital',
      threshold: 'TTM FCF tracking < $3.0B guidance floor',
      parsedThreshold: 3.0,
      parsedUnit: 'B TTM FCF',
      severity: 'critical',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Tracking below',
      description: 'Trailing twelve-month free cash flow tracking below the $3.0B 3-5 year target floor (target range $3-5B per JPM deck). FY 2025 actual was $4.6B record. Impacts debt-paydown trajectory toward 1.0x gross leverage.',
      suggestedActions: [
        'Reconcile FCF shortfall: operating cash flow vs capex overrun?',
        'Review fleet capex phasing — can deliveries push to next quarter?',
        'Assess Air Traffic Liability seasonal trajectory vs prior year',
        'Evaluate debt-paydown pace vs $4.8B FY 2025 baseline',
        'Brief IR on potential variance from JPM Value Creation Framework',
      ],
    },
    {
      id: 'leverage-target-breach',
      title: 'Gross Leverage Trajectory Off-Target',
      category: 'Cash Flow & Capital',
      threshold: 'Gross leverage > 2.5x or +0.2x QoQ',
      parsedThreshold: 2.5,
      parsedUnit: 'x gross leverage',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Exceeds',
      description: 'Gross leverage (Adjusted Debt / EBITDAR) exceeded 2.5x or grew +0.2x QoQ. Q1 2026 baseline 2.4x. Long-term target 1.0x. Investment-grade rating at all three agencies depends on continued deleveraging trajectory.',
      suggestedActions: [
        'Review EBITDAR run-rate vs trailing four quarters',
        'Pull debt-issuance vs paydown net position',
        'Cross-reference rating agency outlook (Moody\'s Baa2 since Feb 2025; Fitch Positive Sep 2025; S&P Positive Jan 2026)',
        'Evaluate share-buyback pacing under $1B opportunistic authorization',
        'Update Treasury on revised leverage trajectory and refinancing plan',
      ],
    },
    {
      id: 'capex-deviation',
      title: 'Capex Run Rate Deviation',
      category: 'Cash Flow & Capital',
      threshold: 'Capex pace > 110% of $5.5B annual budget',
      parsedThreshold: 110,
      parsedUnit: '% of annual budget',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Pacing above',
      description: 'Capital expenditure run rate tracking above 110% of the $5.5B FY 2026 expected budget. Aircraft commitments at YE 2025 ~$15.4B; deliveries are back-loaded but advance deposits and fleet mods continue.',
      suggestedActions: [
        'Review aircraft delivery schedule — early delivery vs delay?',
        'Pull fleet-modification spending vs plan',
        'Assess airport-construction project funding (restricted cash component)',
        'Check technology capex against AWS migration / Delta Concierge rollout milestones',
        'Update Treasury on revised capex guidance range',
      ],
    },

    // ═══════════════════════════════════════════
    // LOYALTY & DIGITAL — AmEx + Delta Sync growth
    // ═══════════════════════════════════════════
    {
      id: 'amex-spend-growth-stall',
      title: 'AmEx Cardholder Spend Growth Stall',
      category: 'Loyalty & Digital',
      threshold: 'Cardholder spend growth < +6% YoY',
      parsedThreshold: 6,
      parsedUnit: '% YoY',
      severity: 'warning',
      alertType: 'anomaly',
      frequency: 'monthly',
      conditionPrefix: 'Falls below',
      description: 'Delta-AmEx cardholder spend growth tracking below 6% YoY (vs Q1 2026 actual +12%, FY 2025 +11%). Threatens trajectory to $10B AmEx remuneration target. Cardholder spend is the leading indicator for AmEx remuneration and loyalty deferred revenue.',
      suggestedActions: [
        'Review acquisition vs retention drivers in cardholder portfolio',
        'Pull spend by cardholder tier and travel-vs-non-travel split',
        'Assess Delta Sync platform engagement metrics (110M logins target)',
        'Cross-reference with Sphere/AmEx/T-Mobile/NYT partnership performance',
        'Brief Goswami (CMO) on at-risk segments and retention plays',
      ],
    },
    {
      id: 'delta-sync-adoption-stall',
      title: 'Delta Sync Engagement Below Target',
      category: 'Loyalty & Digital',
      threshold: 'Quarterly login pace < 25M (toward 110M annual)',
      parsedThreshold: 25,
      parsedUnit: 'M logins / quarter',
      severity: 'warning',
      alertType: 'anomaly',
      frequency: 'monthly',
      conditionPrefix: 'Tracking below',
      description: 'Delta Sync customer logins tracking below ~25M/quarter pace required for 110M+ annual target. Engagement is the leading indicator for cross-sell into AmEx, premium products, and loyalty redemption.',
      suggestedActions: [
        'Review Delta Concierge AI beta adoption funnel and feedback',
        'Pull Delta Sync logins by source (mobile, web, partners)',
        'Assess in-flight Wi-Fi connectivity rates (1,200+ aircraft baseline)',
        'Cross-reference with new partnership engagement (NYT, Paramount+, etc.)',
        'Evaluate AWS migration impact on user-experience reliability',
      ],
    },

    // ═══════════════════════════════════════════
    // OPERATIONAL RELIABILITY — Delta\'s brand promise
    // ═══════════════════════════════════════════
    {
      id: 'reliability-friction',
      title: 'Operational Reliability Friction',
      category: 'Operations & Reliability',
      threshold: 'Cancellation rate > 2% weekly avg or 3+ week trend',
      parsedThreshold: 2,
      parsedUnit: '% cancellation rate',
      severity: 'critical',
      alertType: 'trend',
      frequency: 'daily',
      conditionPrefix: 'Exceeds threshold or',
      description: 'Cancellation rate exceeded 2% weekly average or sustained 3+ week elevation. Cirium #1 N.A. on-time ranking 5 consecutive years is at risk. Active focus area post-PWA implementation friction.',
      suggestedActions: [
        'Decompose: weather, ATC, mechanical, crew availability — root cause split',
        'Review ALPA scheduling-rule constraints from PWA changes',
        'Pull crew-recovery cost run-rate impact',
        'Cross-reference with US industry on-time average (78% per McKinsey 2025)',
        'Brief Snell (CFO) and Ausband (CPO) on union partnership status',
      ],
    },
    {
      id: 'aircraft-delivery-delay',
      title: 'Aircraft Delivery Schedule Slippage',
      category: 'Operations & Reliability',
      threshold: 'Delivered aircraft < 8/quarter pace',
      parsedThreshold: 8,
      parsedUnit: 'aircraft / quarter',
      severity: 'warning',
      alertType: 'threshold',
      frequency: 'monthly',
      conditionPrefix: 'Falls below',
      description: 'Aircraft delivery pace below 8/quarter (Q1 2026 actual). Industry-wide OEM constraints (~2,000-aircraft global shortage per McKinsey). Slippage delays premium-mix shift and fuel-efficiency benefits.',
      suggestedActions: [
        'Review delivery schedule by manufacturer (Airbus / Boeing) and aircraft type',
        'Pull engine availability (LEAP-1A/B, Trent XWB EP, Trent 7000) for incoming fleet',
        'Assess capex phasing impact on full-year FCF',
        'Coordinate with TechOps on delayed-fleet maintenance vs new-fleet commissioning',
        'Brief Snell (CFO) on capacity-growth implications',
      ],
    },

    // ═══════════════════════════════════════════
    // PREDICTIVE ANALYTICS — The AI differentiator
    // ═══════════════════════════════════════════
    {
      id: 'revenue-forecast-confidence',
      title: 'Revenue Forecast Confidence Degradation',
      category: 'Predictive Analytics',
      threshold: 'Forecast confidence interval widens beyond +/-3%',
      parsedThreshold: 3,
      parsedUnit: '% confidence band',
      severity: 'critical',
      alertType: 'forecast',
      frequency: 'daily',
      conditionPrefix: 'Confidence band widened beyond',
      description: 'AI revenue-forecasting model\'s confidence interval for the current quarter widened beyond +/-3%, indicating multiple input signals diverging from historical patterns. Early warning that consensus estimates may need revision.',
      suggestedActions: [
        'Identify which input variables are driving confidence degradation',
        'Compare current quarter actuals-to-date against forecast midpoint',
        'Assess whether macro indicators (fuel curve, tariff actions) are the source',
        'Run sensitivity analysis on top 5 contributing variables',
        'Prepare scenario-based guidance ranges for CFO Snell review pre-earnings',
      ],
    },
    {
      id: 'demand-prediction-miss',
      title: 'Demand Prediction Miss',
      category: 'Predictive Analytics',
      threshold: 'Demand forecast accuracy < 90%',
      parsedThreshold: 90,
      parsedUnit: '% forecast accuracy',
      severity: 'warning',
      alertType: 'forecast',
      frequency: 'weekly',
      conditionPrefix: 'Accuracy dropped below',
      description: 'ML-powered demand model accuracy dropped below 90%, meaning capacity allocations, fleet plans, and crew assignments may be misaligned with actual demand patterns.',
      suggestedActions: [
        'Identify which routes / regions have the largest forecast-actual gaps',
        'Review whether geopolitical events (Middle East, Mexico unrest) explain the miss',
        'Assess if emerging demand patterns (premium leisure shift) skew the model',
        'Evaluate capacity rebalancing needs across geographies',
        'Update strategic capacity decisions for back-half 2026 based on revised curve',
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
      description: 'Unsupervised anomaly detection model flagged an unusual pattern in operational data deviating >2.5 standard deviations from expected behavior. Could indicate emerging opportunity or risk not captured by rule-based alerts.',
      suggestedActions: [
        'Review the anomaly detail report for the specific pattern flagged',
        'Determine if anomaly is localized (specific hub/route) or systemic',
        'Cross-reference with external events (rate decisions, geopolitical, weather, competitor moves)',
        'Assess whether anomaly represents opportunity (corporate-share gain) or risk (MTM swing)',
        'Add to watchlist for next 7 days to determine if one-time or trend',
      ],
    },
  ],
};
