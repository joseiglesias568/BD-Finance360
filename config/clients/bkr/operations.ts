// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/operations.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Baker Hughes Company public disclosures: Form 10-K (FY2025); Form 10-Q
// (Q1 2026); Q1 2026 earnings call (Apr 24, 2026).
// Baker Hughes operates in 120+ countries with ~53,000 employees.
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { OperationsConfig } from '../../types';

export const operations: OperationsConfig = {
  totalLocations: 120,                // 120+ countries of operation [CITED:10Q-Q1-26]
  locationGrowth: 5,                  // est. new market entries / expansions in 2025–2026
  locationGrowthPercent: 4.2,

  // Key geographic and product-line market presence
  locations: [
    {
      name: 'Middle East & Asia — OFSE Core Region',
      type: 'Primary OFSE Market',
      region: 'International',
      metrics: [
        { label: 'OFSE Revenue Q1 2026', value: '$1,152M', target: '$1,300M', status: 'warning' },
        { label: 'YoY Revenue Change', value: '-19% (conflict impact)', target: 'Recovery H2 2026', status: 'warning' },
        { label: 'Geographic Revenue Share', value: '36% of OFSE', target: '35%+', status: 'good' },
        { label: 'Key Customers', value: 'Saudi Aramco, ADNOC, PTTEP', target: 'Maintain LTAs', status: 'good' },
      ],
    },
    {
      name: 'North America — OFSE & IET',
      type: 'Dual-Segment Market',
      region: 'North America',
      metrics: [
        { label: 'OFSE Revenue Q1 2026', value: '$927M', target: '$950M', status: 'good' },
        { label: 'NA Rig Count (avg Q1 2026)', value: '749', target: '800+', status: 'warning' },
        { label: 'YoY Rig Count Change', value: '-7% (E&P capex caution)', target: 'Flat/recovery', status: 'warning' },
        { label: 'IET Data Center Power Pipeline', value: 'Growing rapidly', target: '$2B+ orders', status: 'good' },
      ],
    },
    {
      name: 'Latin America — OFSE Growth Region',
      type: 'Growth OFSE Market',
      region: 'International',
      metrics: [
        { label: 'OFSE Revenue Q1 2026', value: '$600M', target: '$620M', status: 'good' },
        { label: 'YoY Revenue Change', value: '+6% (Brazil deepwater)', status: 'good', target: '+5%+' },
        { label: 'Key Markets', value: 'Brazil, Mexico, Argentina', target: 'Expand Brazil deepwater', status: 'good' },
        { label: 'Subsea Equipment Demand', value: 'Strong (Petrobras projects)', target: 'Capture SSPS orders', status: 'good' },
      ],
    },
    {
      name: 'Europe / CIS / Sub-Saharan Africa — OFSE',
      type: 'Diversified OFSE Market',
      region: 'International',
      metrics: [
        { label: 'OFSE Revenue Q1 2026', value: '$558M', target: '$580M', status: 'warning' },
        { label: 'YoY Revenue Change', value: '-4% (Russia/CIS headwinds)', status: 'warning', target: 'Flat' },
        { label: 'Africa Growth Markets', value: 'Nigeria, Angola, Mozambique', target: 'Capture LNG equipment', status: 'good' },
        { label: 'IET LNG Demand (Africa)', value: 'Mozambique LNG pipeline', target: 'GTE orders', status: 'good' },
      ],
    },
    {
      name: 'Global LNG Infrastructure — IET Gas Technology',
      type: 'IET Core Market',
      region: 'Global',
      metrics: [
        { label: 'GTE Revenue Q1 2026', value: '$1,665M (+14% YoY)', target: '$1,700M', status: 'good' },
        { label: 'GTS Revenue Q1 2026', value: '$791M (+34% YoY)', target: '$820M', status: 'good' },
        { label: 'Total Gas Technology RPO', value: 'Majority of IET $33.1B', target: 'Growing', status: 'good' },
        { label: 'Aero JV Purchases Q1 2026', value: '$210M from GE Vernova', target: 'Managed LT contracts', status: 'good' },
      ],
    },
    {
      name: 'Industrial & Power Markets — IET Industrial Technology',
      type: 'IET Diversification Market',
      region: 'Global',
      metrics: [
        { label: 'Industrial Products Revenue Q1 2026', value: '$491M (+10% YoY)', target: '$510M', status: 'good' },
        { label: 'Climate Technology Solutions Revenue', value: '$218M (+22% YoY)', target: '$250M', status: 'good' },
        { label: 'CTS Orders Q1 2026', value: '$1,257M (9x YoY)', target: '>$1B/quarter', status: 'good' },
        { label: 'Data Center Power Market', value: 'Rapidly growing', target: 'Capture 10% share', status: 'good' },
      ],
    },
    {
      name: 'Manufacturing & Service Centers — OFSE',
      type: 'Manufacturing Footprint',
      region: 'Global',
      metrics: [
        { label: 'OFSE D&A Q1 2026', value: '$278M', target: 'Stable', status: 'good' },
        { label: 'OFSE PP&E (Net)', value: '$18.6B total segment assets', target: 'Optimize', status: 'good' },
        { label: 'Capex Q1 2026 (OFSE)', value: '$218M', target: '≤5% revenue', status: 'good' },
        { label: 'Inventory Levels', value: '$4,868M (consolidated)', target: 'Reduce days outstanding', status: 'warning' },
      ],
    },
  ],

  // Supply chain and manufacturing metrics
  supplyChain: [
    { label: 'Global Manufacturing Locations', value: '40+ countries', target: 'Optimize footprint', trend: 'flat', status: 'good' },
    { label: 'Total Employees', value: '~53,000', target: 'Optimize via AI/automation', trend: 'down', status: 'good' },
    { label: 'Aeroderivative Engine Supply (Aero JV)', value: 'GE Vernova 50/50 JV', target: 'Secure long lead times', trend: 'flat', status: 'warning' },
    { label: 'LNG Turbomachinery Lead Times', value: 'Extended (supply tightness)', target: 'Manage to contract schedule', trend: 'up', status: 'warning' },
    { label: 'Inventory — Finished Goods', value: '$2,361M', target: 'Reduce to <$2,200M', trend: 'down', status: 'warning' },
    { label: 'Progress Collections (Advance Payments)', value: '$5,999M', target: 'Maintain on long-cycle contracts', trend: 'up', status: 'good' },
    { label: 'Customer Receivables', value: '$5,507M gross', target: '<$5,200M', trend: 'flat', status: 'warning' },
    { label: 'R&D Investment (Q1 2026)', value: '$133M quarterly', target: '~$550M FY2026', trend: 'down', status: 'good' },
  ],

  digitalMetrics: [
    { label: 'Leucipa Platform — AI Production Optimization', value: 'Growing deployments', description: 'AI-enabled autonomous production optimization platform for oil and gas operators. Enables real-time well performance management, production forecasting, and intervention recommendations.' },
    { label: 'Digital Subsea Solutions', value: 'SSPS digital twins', description: 'Digital twin technology for subsea equipment health monitoring and predictive maintenance. Reduces unplanned downtime for offshore operators.' },
    { label: 'IET iCenter Remote Monitoring', value: 'Global monitoring centers', description: 'Remote operation and monitoring centers for GTE/GTS installed base. Enables predictive maintenance and performance optimization for LNG compression trains globally.' },
    { label: 'Measurement & Sensing (Waygate/Panametrics)', value: 'Divesting to Hexagon', description: 'Waygate Technologies industrial inspection platform being sold to Hexagon AB (~$1.45B). Panametrics measurement sensing retained within IET for now.' },
    { label: 'Industrial IoT — Field Service Automation', value: 'Expanding', description: 'Connected field service tools for OFSE technicians. Mobile workflows, AI-assisted diagnostics, and remote collaboration for well intervention and completions services.' },
    { label: 'OFSE Production Digital (AI Lift Optimization)', value: 'Deployed at >100 fields', description: 'AI-driven artificial lift optimization within Production Solutions. Maximizes hydrocarbon recovery per well while reducing energy consumption of lift equipment.' },
  ],

  industryKPIs: [
    {
      label: 'Worldwide Rig Count (Q1 2026 avg)',
      value: '1,832',
      target: '1,900+',
      benchmark: '1,706 (Q1 2025)',
      description: 'International rig count +20% YoY (1,083 vs 903). North America -7% (749 vs 803). Total worldwide +7%. International strength partially offsets NA softness for OFSE.',
    },
    {
      label: 'IET Book-to-Bill',
      value: '1.46x',
      target: '>1.0x sustained',
      benchmark: 'GE Vernova ~1.2–1.4x (comparable energy equipment peer)',
      description: 'Q1 2026 IET book-to-bill 1.46x — orders $4,887M vs revenue $3,350M. Consistently >1.0x indicates growing backlog. Key leading indicator for IET revenue growth 12–36 months forward.',
    },
    {
      label: 'OFSE EBITDA Margin',
      value: '17.5%',
      target: '≥18%',
      benchmark: 'SLB OFSE ~20%, HAL ~17%',
      description: 'Q1 2026 OFSE EBITDA margin 17.5%. Below SLB\'s services margins (~20%+) but competitive with Halliburton (~17%). Room for improvement as SPC disposition impact fully absorbed and cost-out program delivers.',
    },
    {
      label: 'IET EBITDA Margin',
      value: '20.2%',
      target: '≥21%',
      benchmark: 'GE Vernova Power Segment ~15–18%',
      description: 'Q1 2026 IET EBITDA margin 20.2% (+310 bps YoY). Significantly above GE Vernova\'s power equipment margins. Scale, mix shift to GTS services, and Chart synergies are expected to push toward 21%+.',
    },
    {
      label: 'Total RPO / Annual Revenue Multiple',
      value: '~3.5x',
      target: '>3.5x',
      benchmark: 'GE Vernova ~3x, SLB OFSE <1x',
      description: 'Total RPO $36.1B / est. FY2026 revenue ~$26B = ~3.5x. IET RPO $33.1B provides extraordinary long-cycle visibility. Well above oilfield services peers which have shorter revenue visibility.',
    },
    {
      label: 'Net Debt / Adj. EBITDA',
      value: '0.3x (pre-Chart)',
      target: '~2.0x (post-Chart)',
      benchmark: 'SLB ~1.5x, HAL ~1.2x',
      description: 'Pre-Chart close balance sheet is exceptionally clean at 0.3x. Post-Chart acquisition (~Q2 2026) leverage steps up to ~2.0x but remains investment-grade. Strong FCF generation provides clear deleveraging path.',
    },
  ],

  peopleMetrics: [
    {
      label: 'Total Employees',
      value: '~53,000',
      target: 'Optimize with Chart integration',
      trend: 'down',
      status: 'good',
      description: 'Q1 2026 approximately 53,000 employees globally (down from ~56,000 FY2025 YE due to PSI and SPC divestitures and restructuring). Chart acquisition will add employees post-close.',
    },
    {
      label: 'R&D as % of Revenue',
      value: '~2.0%',
      target: '~2.0%',
      trend: 'flat',
      status: 'good',
      description: 'Q1 2026 R&D $133M = 2.0% of $6,587M revenue. FY2025 ~$600M total R&D (~2.1% of revenue). Focused on LNG technology, downhole measurement, digital platforms (Leucipa), and hydrogen/CCUS.',
    },
    {
      label: 'Q1 2026 Restructuring Charges',
      value: '$37M',
      target: '<$50M/quarter',
      trend: 'up',
      status: 'warning',
      description: 'Q1 2026 restructuring $37M: $26M employee-related, $11M other incremental costs. OFSE $11M + IET $28M. Part of broader OFSE cost-out program to maintain margins despite volume headwinds.',
    },
    {
      label: 'Employee Distribution (Est.)',
      value: '60% field/manufacturing',
      target: 'Optimize field ratio',
      trend: 'flat',
      status: 'good',
      description: 'Majority of workforce in field operations (OFSE technicians, field engineers) and manufacturing (IET). Corporate/overhead approximately 40%. Restructuring focused on overhead and non-core divested businesses.',
    },
  ],

  customerExperience: [
    {
      label: 'IET Long-Term Service Agreements (LTSAs)',
      value: '$326M contract assets',
      target: 'Grow LTSA base',
      trend: 'up',
      status: 'good',
      description: 'Long-term product service agreements for GTE fleet generate highly recurring GTS revenue. Q1 2026 LTSA contract assets $326M. As GTE installed base grows, LTSA base compounds.',
    },
    {
      label: 'OFSE Major Contract Wins',
      value: 'Multiple long-term agreements',
      target: 'Maintain LTA share',
      trend: 'flat',
      status: 'good',
      description: 'Baker Hughes maintains long-term agreements (LTAs) with major NOCs (Saudi Aramco, ADNOC) and IOCs for OFSE services. LTAs provide baseline revenue stability during cyclical downturns.',
    },
    {
      label: 'IET Customer Satisfaction — On-Time Delivery',
      value: 'Key focus area',
      target: '>95% on-time delivery',
      trend: 'flat',
      status: 'warning',
      description: 'Aeroderivative supply chain tightness (per management commentary) creates delivery timing risk for CTS and GTE orders. On-time delivery is a critical customer satisfaction metric for LNG project schedules.',
    },
    {
      label: 'Customer Concentration — IET',
      value: 'UAE 10% of receivables',
      target: 'Diversify customer base',
      trend: 'flat',
      status: 'good',
      description: 'As of Q1 2026: US customers = 18% of gross receivables; UAE = 10% of gross receivables. No other single country >10%. Reasonable geographic diversification for an energy equipment company.',
    },
    {
      label: 'Net Promoter / Customer Satisfaction',
      value: 'Not publicly reported',
      target: 'Monitor via LTA renewals',
      trend: 'flat',
      status: 'good',
      description: 'BKR does not publicly report NPS. Key indicators of customer satisfaction are LTA renewal rates, repeat order win rates, and market share trends in key product lines.',
    },
    {
      label: 'Credit Default Swap (CDS) Mexico Customer',
      value: '$159M notional remaining',
      target: 'Reduce to zero by Sep 2026',
      trend: 'down',
      status: 'warning',
      description: 'BKR issued CDS to facilitate borrowings for a Mexican customer. Notional $159M remaining (down from $287M at Dec 2025). Reduces each month through Sep 2026. Credit risk being retired on schedule.',
    },
  ],
};
