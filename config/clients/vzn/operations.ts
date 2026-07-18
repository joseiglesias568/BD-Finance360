// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/operations.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Becton, Dickinson and Company public disclosures: Form 10-K (FY2025); Form
// 10-Q (Q1 2026); Q1 2026 earnings press release. Network coverage
// statistics from public FCC filings and Verizon IR materials.
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { OperationsConfig } from '../../types';

export const operations: OperationsConfig = {
  totalLocations: 50,                 // ~50 states served (national wireless); Fios in 9 core + 31 Frontier states
  locationGrowth: 22,                 // +22 additional states from Frontier acquisition (closed Jan 22, 2026)
  locationGrowthPercent: 78.0,        // 31 Frontier states / 9 legacy Fios states

  // Network footprint and key market presence
  locations: [
    {
      name: 'Northeast — Core Fios Territory (NY, NJ, PA)',
      type: 'Core Fiber HQ Region',
      region: 'Consumer',
      metrics: [
        { label: 'Fios Internet Subs (approx)', value: '~5.0M', target: '5.2M', status: 'good' },
        { label: 'Fios Penetration (passings)', value: '~43%', target: '45%', status: 'good' },
        { label: 'Fios Video Subs', value: '~1.5M', target: 'Manage decline', status: 'good' },
        { label: 'Enterprise Accounts (HQ Region)', value: 'Fortune 500 dense', target: 'Maintain #1 share', status: 'good' },
      ],
    },
    {
      name: 'Mid-Atlantic & New England (DC, VA, MD, MA, CT, RI)',
      type: 'Core Fios Territory',
      region: 'Consumer',
      metrics: [
        { label: 'Fios Internet Subs (approx)', value: '~1.7M', target: '1.8M', status: 'good' },
        { label: 'Government & Defense Accounts', value: 'Primary provider', target: 'Maintain', status: 'good' },
        { label: 'C-Band Deployment', value: '80%+ pop coverage', target: '90%+', status: 'good' },
        { label: 'FirstNet Competition (AT&T)', value: 'Moderate', target: 'Retain enterprise', status: 'warning' },
      ],
    },
    {
      name: 'Sun Belt + Southeast (FL, TX, CA — Frontier States)',
      type: 'Frontier Acquisition Territory',
      region: 'Consumer',
      metrics: [
        { label: 'Frontier Subs Acquired', value: '~3.3M', target: '3.5M by YE 2026', status: 'good' },
        { label: 'Fiber Passings (Frontier)', value: '~15M', target: 'Maintain', status: 'good' },
        { label: 'Wireless Cross-Sell Penetration', value: '<10% (early)', target: '25% by 2028', status: 'warning' },
        { label: 'OSS/BSS Integration Target', value: 'Q3 2026', target: 'On schedule', status: 'good' },
      ],
    },
    {
      name: 'National Wireless Network (5G Nationwide)',
      type: 'National Network',
      region: 'Consumer + Business',
      metrics: [
        { label: '5G Nationwide Coverage', value: '99% US pop', target: 'Maintain', status: 'good' },
        { label: 'C-Band (5G UW) Coverage', value: '~75% US pop', target: '90% by YE 2026', status: 'warning' },
        { label: '5G UW (mmWave) Cities', value: '35+ cities', target: '40 cities', status: 'good' },
        { label: 'Network Reliability Score', value: 'Top tier', target: 'Maintain #1 or #2', status: 'good' },
      ],
    },
    {
      name: 'Enterprise & Business Solutions (National)',
      type: 'Business Segment',
      region: 'Business',
      metrics: [
        { label: 'Private Network Pipeline', value: '$1B+', target: 'Convert to revenue', status: 'good' },
        { label: 'IoT Connections', value: '~55M+', target: '60M by YE 2026', status: 'good' },
        { label: 'SD-WAN / Network-as-a-Service', value: 'Growing', target: 'Grow >10% YoY', status: 'good' },
        { label: 'Managed Network Services', value: 'Fortune 500 focused', target: 'Maintain margin', status: 'good' },
      ],
    },
    {
      name: 'Fixed Wireless Access (FWA) — Rural & Suburban',
      type: 'Broadband Growth Market',
      region: 'Consumer',
      metrics: [
        { label: 'Total FWA Subscribers', value: '5.7M', target: '6.5M by YE 2026', status: 'good' },
        { label: 'Q1 2026 Net Adds', value: '+339K', target: '+700K–800K FY2026', status: 'good' },
        { label: 'FWA ARPU', value: '~$50/mo', target: '$52/mo', status: 'warning' },
        { label: 'Eligible Households', value: '~40M', target: '50M+ with C-Band buildout', status: 'warning' },
      ],
    },
    {
      name: 'Retail Distribution (National)',
      type: 'Distribution',
      region: 'Consumer + Business',
      metrics: [
        { label: 'Verizon-owned Stores', value: '~1,600', target: 'Optimize', status: 'good' },
        { label: 'Authorized Retailers', value: '~7,000+', target: 'Maintain', status: 'good' },
        { label: 'Digital/Self-Serve Channel Mix', value: '~35%', target: '45%', status: 'warning' },
        { label: 'myVerizon App Active Users', value: '75M+', target: '80M', status: 'good' },
      ],
    },
  ],

  // Network infrastructure supply chain
  supplyChain: [
    { label: 'Tower Sites (owned + leased)', value: '~25,000', target: 'Optimize', trend: 'flat', status: 'good' },
    { label: 'Small Cell Nodes', value: '75,000+', target: '100,000 by 2027', trend: 'up', status: 'good' },
    { label: 'Fiber Route Miles', value: '1.8M+', target: '2.0M+ with Frontier', trend: 'up', status: 'good' },
    { label: 'C-Band Spectrum (MHz-PoPs)', value: 'Largest in US', target: 'Maintain #1 position', trend: 'flat', status: 'good' },
    { label: 'Network Energy Consumption (annual)', value: '~11 TWh', target: 'Carbon-neutral by 2030', trend: 'down', status: 'warning' },
    { label: 'Legacy TDM/Copper Retirement', value: 'Ongoing', target: '100% IP by 2028', trend: 'up', status: 'good' },
    { label: 'Network Virtualization (vRAN)', value: '~20% sites', target: '50% by 2027', trend: 'up', status: 'warning' },
    { label: 'Chinese Equipment Removal (FCC)', value: 'In progress', target: 'Complete by 2026', trend: 'up', status: 'warning' },
  ],

  digitalMetrics: [
    { label: 'myVerizon App Monthly Active Users', value: '75M+', description: 'Self-serve account management, plan customization (myPlan), bill pay, device upgrades.' },
    { label: 'myPlan Subscriber Adoption', value: '~55% of postpaid', description: 'Custom plan with add-on perks (Disney+, Apple One, travel pass). Key ARPA expansion tool.' },
    { label: 'AI Customer Care Deflection', value: '~20% (Phase 1)', description: 'AI chatbot + virtual assistant deflecting care contacts. Phase 2 target: 30%+ by end-2026.' },
    { label: 'Verizon Business Digital Platform', value: 'ThingSpace IoT', description: 'IoT device management platform for enterprise. ~55M+ connected devices.' },
    { label: 'Network Automation (AI-Driven)', value: 'Phase 1 live', description: 'Predictive maintenance, automated field dispatch, anomaly detection on network infrastructure.' },
    { label: 'Virtual Network Functions (VNF)', value: '~20% vRAN', description: 'Network function virtualization on general-purpose hardware. Target 50% by 2027 for cost flexibility.' },
  ],

  industryKPIs: [
    {
      label: 'Postpaid Phone Churn (Monthly)',
      value: '0.89%',
      target: '0.85%',
      benchmark: '~0.82% (AT&T, T-Mobile)',
      description: 'Q1 2026. Slightly above AT&T and T-Mobile. Improving from 2024 levels. C-Band quality improvements and myPlan sticky ecosystem are mitigation levers.',
    },
    {
      label: 'ARPA (Avg Revenue Per Account)',
      value: '~$139/mo',
      target: '$142/mo',
      benchmark: '~$130/mo (industry blended)',
      description: 'FY2026 ARPA expansion driven by myPlan premium perks and multi-line household bundling. Each $1 ARPA increase = ~$1.4B annualized wireless revenue.',
    },
    {
      label: 'Wireless Service Revenue Growth',
      value: '+2.7% Q1 2026',
      target: '+2.0–2.8% FY2026',
      benchmark: '+2–3% (US wireless industry)',
      description: 'Q1 2026 +2.7% YoY. FY2026 guidance +2.0–2.8%. In line with AT&T; T-Mobile service revenue growing faster (~8% YoY) due to subscriber adds.',
    },
    {
      label: 'Adj. EBITDA Margin',
      value: '39.0%',
      target: '40.0%',
      benchmark: '~35% (US telecom avg)',
      description: 'Q1 2026 industry-leading margin. Frontier synergies and AI cost savings are expected to drive toward 40% over 2 years.',
    },
    {
      label: 'FWA Net Adds (Quarterly)',
      value: '+339K',
      target: '175K–200K (quarterly avg for FY2026)',
      benchmark: '~500K (T-Mobile, Q1 2026)',
      description: 'Q1 2026 +339K net adds. T-Mobile leading FWA race. Verizon #2. C-Band quality improvements are closing the performance gap.',
    },
    {
      label: 'CapEx Intensity (% Revenue)',
      value: '~13%',
      target: '~13%',
      benchmark: '~17–19% (peak C-Band)',
      description: 'FY2026 CapEx $17.5B–$18.5B / ~$138B revenue ≈ 13%. Post-peak C-Band. Frontier adds infrastructure spend but also increases revenue base.',
    },
  ],

  peopleMetrics: [
    {
      label: 'Full-Time Equivalent Employees',
      value: '101,000+',              // Verizon + Frontier combined (est.)
      target: 'Optimize via AI',
      trend: 'flat',
      status: 'good',
      description: 'YE 2025 ~105,000 FTE (Verizon standalone) + ~16,000 Frontier employees. Integration workforce optimization underway for synergy realization.',
    },
    {
      label: 'CWA/IBEW Union Workforce',
      value: '~50%',
      target: 'Maintain agreements',
      trend: 'flat',
      status: 'good',
      description: 'Approximately half of Verizon employees are represented by CWA and IBEW unions. Frontier has separate union agreements in various states.',
    },
    {
      label: 'Glassdoor Rating',
      value: '3.8 / 5.0',
      target: '4.0',
      trend: 'up',
      status: 'good',
      description: 'Employee satisfaction reflects competitive compensation, stability of employment, and investment in digital tools. Integration of Frontier adds complexity.',
    },
    {
      label: 'Diversity & Inclusion',
      value: 'Top quartile',
      target: 'Maintain/improve',
      trend: 'flat',
      status: 'good',
      description: 'Recognized on Fortune 100 Best Companies for Diversity. ~50% of US workforce are people of color or women.',
    },
  ],

  customerExperience: [
    {
      label: 'J.D. Power Network Quality (National)',
      value: '#1 or #2',
      target: 'Maintain top 2',
      trend: 'flat',
      status: 'good',
      description: 'Verizon historically leads or is tied for #1 in J.D. Power U.S. Wireless Network Quality Study. C-Band densification is key to maintaining advantage.',
    },
    {
      label: 'Rootmetrics Network Reliability',
      value: '#1 Reliability',
      target: 'Maintain',
      trend: 'flat',
      status: 'good',
      description: 'Consistently #1 in RootMetrics national network reliability assessments. Primary brand differentiator vs T-Mobile (coverage) and AT&T (fiber).',
    },
    {
      label: 'Consumer NPS (Est.)',
      value: '~28',
      target: '32',
      trend: 'up',
      status: 'good',
      description: 'Net Promoter Score improving as C-Band quality gains recognition. myPlan personalization improving satisfaction vs legacy unlimited plans.',
    },
    {
      label: 'Customer Care First-Call Resolution',
      value: '~72%',
      target: '78%',
      trend: 'up',
      status: 'warning',
      description: 'AI-driven care improvements targeting higher first-call resolution. Agent augmentation and deflection from AI chatbot are primary levers.',
    },
    {
      label: 'Total Consumer Wireless Customers',
      value: '~116M postpaid',
      target: 'Net positive adds',
      trend: 'up',
      status: 'good',
      description: 'Q1 2026 total postpaid connections ~116M. First positive postpaid phone net adds quarter (Q1) since 2013. Prepaid ~20M additional.',
    },
    {
      label: 'myPlan Satisfaction vs Legacy Plans',
      value: '+8 NPS points',
      target: 'Expand myPlan adoption',
      trend: 'up',
      status: 'good',
      description: 'myPlan customers show higher NPS and lower churn vs legacy unlimited plan customers. ~55% adoption; target 70% by end-2026.',
    },
  ],
};
