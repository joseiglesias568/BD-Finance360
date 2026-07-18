// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/strategic.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q2-26] [CITED:EC-Q2-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// BD Q2 FY2026 earnings call, IR slides, 10-Q, and FY2025 Annual Report.
// "Excellence Unleashed" strategic framework: Compete, Innovate, Deliver pillars.
// ─────────────────────────────────────────────────────────────────────
import { StrategicConfig } from '../../types';

export const strategic: StrategicConfig = {
  initiatives: [
    {
      id: 'compete-commercial-excellence',
      name: 'Compete — Commercial Excellence via BD Excellence Deployment',
      description:
        'BD Excellence is BD\'s enterprise-wide operating system for continuous improvement, ' +
        'encompassing commercial excellence, lean manufacturing, and quality systems. ' +
        'Under the "Compete" pillar of Excellence Unleashed, BD is deploying BD Excellence ' +
        'fully to the global sales force — standardizing selling motions, improving win rates, ' +
        'and increasing customer penetration across all four segments. ' +
        'Commercial Excellence encompasses: CRM optimization, key account management, ' +
        'value-based contracting with hospital systems and IDNs, and market development ' +
        'for underpenetrated geographies. ' +
        'BD Excellence is the foundation enabling margin expansion and organic growth acceleration.',
      status: 'on-track',
      budget: 500,                     // est. annual investment in BD Excellence commercial deployment [ASSUMED]
      spent: 250,
      progress: 55,
      milestones: [
        { name: 'BD Excellence commercial framework developed and piloted', date: '2025-09-30', status: 'completed' },
        { name: 'Sales force deployment begun across all four segments', date: '2025-12-31', status: 'completed' },
        { name: 'BD Excellence CRM integration — Phase 1 complete', date: '2026-03-31', status: 'completed' },
        { name: 'IDN key account management program launched', date: '2026-06-30', status: 'in-progress' },
        { name: 'Full global sales force BD Excellence deployment', date: '2026-09-30', status: 'planned' },
        { name: 'Commercial Excellence measurable revenue contribution FY27', date: '2027-09-30', status: 'planned' },
      ],
      kpis: [
        { label: 'Organic Revenue Growth (FXN) Target', target: '+3.5% FXN', actual: '+2.6% FXN Q2 FY26', status: 'warning' },
        { label: 'OTIF Service Level', target: '95%', actual: '93% (record)', status: 'good' },
        { label: 'IDN Contract Wins FY26 YTD', target: 'Grow penetration', actual: 'In progress', status: 'good' },
      ],
    },
    {
      id: 'innovate-pipeline-acceleration',
      name: 'Innovate — Pipeline Acceleration (GLP-1, HemoSphere, Alaris)',
      description:
        'The "Innovate" pillar of Excellence Unleashed focuses on accelerating BD\'s new product pipeline ' +
        'with three priority platforms: ' +
        '(1) GLP-1 Drug Delivery: BD is the leading prefillable syringe and autoinjector manufacturer — ' +
        'GLP-1 obesity drugs (Wegovy, Zepbound, Mounjaro) require billions of delivery devices annually. ' +
        'BD is ramping capacity and new platform development to capture this secular growth opportunity. ' +
        '(2) HemoSphere Advanced Monitoring: Next-generation hemodynamic monitoring platform ' +
        'expanding into new monitoring parameters and care settings. ' +
        '(3) BD Alaris Next Generation: Following the successful remediation and commercial return ' +
        'of current Alaris platform, BD is developing next-gen connected infusion with enhanced ' +
        'cybersecurity, connectivity, and AI-assisted dosing. ' +
        'R&D spend target: 6.0% of revenues. 12 FDA 510(k)/PMA submissions YTD FY26.',
      status: 'on-track',
      budget: 1100,                    // est. FY2026 R&D budget $M (6% × ~$18.5B) [DERIVED]
      spent: 550,
      progress: 45,
      milestones: [
        { name: 'GLP-1 delivery platform development — Phase 1 capacity commitment', date: '2025-09-30', status: 'completed' },
        { name: 'HemoSphere next-gen platform FDA submission', date: '2026-06-30', status: 'in-progress' },
        { name: 'BD Alaris remediation 100% complete — full commercial return', date: '2026-09-30', status: 'in-progress' },
        { name: 'GLP-1 device ramp — first meaningful revenue contribution', date: '2026-09-30', status: 'planned' },
        { name: 'BD Alaris next-generation development milestone', date: '2027-03-31', status: 'planned' },
        { name: 'GLP-1 delivery at scale — multi-hundred million dollar contribution', date: '2027-09-30', status: 'planned' },
      ],
      kpis: [
        { label: 'R&D Spend % Revenue', target: '6.0%', actual: '5.8% FY25', status: 'warning' },
        { label: 'New Product Revenue % (<3 years)', target: '>20%', actual: '18%', status: 'warning' },
        { label: 'FDA Regulatory Submissions FY26 YTD', target: '~20 full year', actual: '12 H1 FY26', status: 'warning' },
      ],
    },
    {
      id: 'deliver-cost-out-program',
      name: 'Deliver — $200M Cost-Out Program (BD Excellence)',
      description:
        'The "Deliver" pillar targets $200M in annualized cost savings under the BD Excellence ' +
        'operating system. As of Q2 FY26, $150M run-rate has been achieved. ' +
        'Cost-out levers: (1) Manufacturing productivity — lean, automation, yield improvement; ' +
        '(2) Procurement — supplier consolidation, global category management; ' +
        '(3) SG&A efficiency — spans and layers, shared services, zero-based budgeting; ' +
        '(4) Supply chain optimization — network rationalization, logistics improvement. ' +
        'Savings are reinvested partially into R&D (pipeline acceleration) and ' +
        'partially flow through to operating margin expansion. ' +
        'Full $200M run-rate targeted by Q4 FY26 — supports path to 25.5%+ adj. operating margin.',
      status: 'on-track',
      budget: 0,                       // cost reduction initiative — not a capex program
      spent: 0,
      progress: 75,                    // $150M of $200M = 75% achieved
      milestones: [
        { name: 'BD Excellence cost-out program launched', date: '2025-03-31', status: 'completed' },
        { name: '$50M run-rate savings achieved — Phase 1', date: '2025-09-30', status: 'completed' },
        { name: '$100M run-rate savings achieved — Phase 2', date: '2026-03-31', status: 'completed' },
        { name: '$150M run-rate savings achieved — Q2 FY26', date: '2026-06-30', status: 'completed' },
        { name: '$200M full run-rate target achieved', date: '2026-09-30', status: 'in-progress' },
        { name: 'Adj. operating margin reaches 25.0% FY2026 full year', date: '2026-09-30', status: 'planned' },
        { name: 'Adj. operating margin 25.5%+ FY2027', date: '2027-09-30', status: 'planned' },
      ],
      kpis: [
        { label: 'Cost-Out Run-Rate Achieved', target: '$200M full year', actual: '$150M Q2 FY26', status: 'warning' },
        { label: 'Adj. Operating Margin', target: '25.0% FY2026', actual: '24.2% Q2 FY26', status: 'warning' },
        { label: 'Manufacturing Productivity (>8% plants)', target: '90%', actual: '85%', status: 'good' },
      ],
    },
    {
      id: 'capital-allocation-deleverage-asr',
      name: 'Capital Allocation — Debt Paydown to 2.5x Leverage + ASR Execution',
      description:
        'BD\'s capital allocation framework for FY2026 prioritizes: ' +
        '(1) Organic investment (capex ~3.5% of revenues, R&D ~6%); ' +
        '(2) Deleveraging — targeting net leverage of 2.5x net debt/adjusted EBITDA (from 2.9x); ' +
        '(3) Accelerated Share Repurchase (ASR) program — reduces diluted share count, ' +
        'enhancing per-share EPS. ' +
        'BD does not target M&A as a primary capital use in the near term; ' +
        'bolt-in tuck-in acquisitions evaluated opportunistically. ' +
        'FCF guidance $3.0B FY2026 provides strong foundation for the above priorities. ' +
        'H1 FY26 FCF: $1,095M — on track.',
      status: 'on-track',
      budget: 3000,                    // FY2026 FCF available for capital allocation $M [CITED:EC-Q2-26]
      spent: 1095,
      progress: 37,
      milestones: [
        { name: 'FY2026 capital allocation framework communicated to investors', date: '2025-11-30', status: 'completed' },
        { name: 'H1 FY26 FCF $1,095M — on track for $3.0B target', date: '2026-06-30', status: 'completed' },
        { name: 'ASR execution progressing — shares retired', date: '2026-06-30', status: 'in-progress' },
        { name: 'Net leverage below 2.75x', date: '2026-09-30', status: 'planned' },
        { name: 'Net leverage reaches 2.5x target', date: '2027-09-30', status: 'planned' },
        { name: 'Capital return framework expansion evaluated', date: '2027-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'Free Cash Flow FY26 Target', target: '$3,000M', actual: '$1,095M H1 FY26', status: 'good' },
        { label: 'Net Leverage Ratio', target: '2.5x target', actual: '2.9x current', status: 'warning' },
        { label: 'ASR Execution', target: 'On schedule', actual: 'In progress', status: 'good' },
      ],
    },
    {
      id: 'china-strategy-vobp-mitigation',
      name: 'China Strategy — VoBP Mitigation + Emerging Markets Growth Offset',
      description:
        'China\'s Volume-Based Procurement (VoBP) program applies government-mandated price ' +
        'reductions to medical devices and consumables procured by public hospitals. ' +
        'BD experienced a -14% FXN headwind in Q2 FY26 in affected categories. ' +
        'BD\'s China mitigation strategy has three components: ' +
        '(1) Portfolio upgrade — shifting mix to VoBP-excluded products and new launches; ' +
        '(2) Private hospital and private payer market — growing alternative channels; ' +
        '(3) Emerging markets offset — accelerating growth in India, Southeast Asia, ' +
        'the Middle East, and Latin America to partially replace China volume. ' +
        'BD expects VoBP to stabilize by FY2027 as new procurement cycles incorporate adjusted pricing ' +
        'and as BD\'s portfolio evolves toward less-VoBP-exposed products.',
      status: 'on-track',
      budget: 200,                     // est. investment in emerging markets expansion $M [ASSUMED]
      spent: 100,
      progress: 40,
      milestones: [
        { name: 'China VoBP impact quantified and disclosed to investors', date: '2026-02-28', status: 'completed' },
        { name: 'Emerging markets acceleration plan launched', date: '2026-03-31', status: 'completed' },
        { name: 'Private hospital China channel development', date: '2026-09-30', status: 'in-progress' },
        { name: 'India and Southeast Asia commercial build-out', date: '2026-09-30', status: 'in-progress' },
        { name: 'China VoBP stabilization — new procurement cycle', date: '2027-03-31', status: 'planned' },
        { name: 'Emerging markets fully offsetting China headwind', date: '2027-09-30', status: 'planned' },
      ],
      kpis: [
        { label: 'China VoBP Revenue Headwind', target: 'Stabilize at 0% by FY27', actual: '-14% FXN Q2 FY26', status: 'bad' },
        { label: 'Emerging Markets Revenue Growth', target: '+8%+ FXN', actual: 'In acceleration', status: 'warning' },
        { label: 'Medical Essentials Organic Growth', target: '+2% FXN', actual: '+1.7% FXN Q2 FY26', status: 'warning' },
      ],
    },
  ],

  risks: [
    {
      id: 'alaris-remediation-delay',
      name: 'BD Alaris Remediation Delay — Connected Care Revenue Risk',
      description:
        'BD Alaris infusion pump remediation is 78% complete as of Q2 FY26. ' +
        'Any delay in completing remaining customer site remediations would push out ' +
        'Connected Care revenue ramp and delay full commercial return of the Alaris platform. ' +
        'FDA Warning Letter on Dispensing (Pyxis) adds regulatory complexity. ' +
        'Connected Care is below its +5% FXN organic growth target partly due to Alaris timing.',
      likelihood: 'medium',
      impact: 'high',
      mitigations: [
        'Dedicated remediation project management team with weekly milestone tracking',
        'Hospital system priority scheduling to complete remaining 22% of sites',
        'Field service resource deployment increased to accelerate completion',
        'FDA engagement and consent decree compliance monitored carefully',
        'HemoSphere and Pyxis growth partially offset Alaris revenue timing',
      ],
    },
    {
      id: 'china-vobp-escalation',
      name: 'China VoBP Escalation — Additional Product Categories Affected',
      description:
        'China Volume-Based Procurement program could expand to additional BD product categories ' +
        'beyond those already subject to VoBP. Current -14% FXN headwind in Q2 FY26 is material. ' +
        'VoBP expansion to Interventional products or BioPharma Systems packaging would ' +
        'represent a significant additional revenue risk.',
      likelihood: 'medium',
      impact: 'high',
      mitigations: [
        'Portfolio upgrade to VoBP-excluded or new-generation products',
        'Emerging markets acceleration (India, Southeast Asia, LatAm) as offset',
        'Private hospital and retail channel development in China',
        'VoBP monitoring via BD Government Affairs China team',
        'Geographic diversification of revenue base reducing China concentration',
      ],
    },
    {
      id: 'biopharma-destocking-prolonged',
      name: 'BioPharma Systems Destocking Prolonged',
      description:
        'BioPharma Systems organic growth was -1.8% FXN in Q2 FY26 due to pharmaceutical ' +
        'customer inventory destocking. If destocking continues into H2 FY26 or FY27, ' +
        'the segment would miss its +3% organic growth target and delay GLP-1 upside. ' +
        'BioPharma Systems has the highest margins of BD\'s segments — prolonged weakness ' +
        'would have outsized impact on enterprise operating margin.',
      likelihood: 'medium',
      impact: 'medium',
      mitigations: [
        'GLP-1 device demand expected to accelerate as drug manufacturers scale production',
        'Proactive customer demand planning engagement with top 20 pharma customers',
        'New self-injection platform launches creating demand independent of inventory cycles',
        'Emerging biologic pipeline (oncology, immunology) supporting medium-term demand',
        'Geographic expansion into emerging market pharma manufacturers',
      ],
    },
    {
      id: 'fda-warning-letters',
      name: 'FDA Warning Letters — Dispensing and Specimen Management',
      description:
        '2 active FDA Warning Letters: Dispensing (Pyxis) and Specimen Management. ' +
        'Warning Letters restrict commercial expansion in affected categories and create ' +
        'reputational risk with hospital customers. Resolution requires demonstrated ' +
        'quality system improvements and FDA re-inspection. ' +
        'Pyxis Warning Letter may slow Connected Care growth in U.S. hospital market.',
      likelihood: 'medium',
      impact: 'medium',
      mitigations: [
        'Dedicated FDA remediation teams and Quality Management System upgrades',
        'Third-party consultants engaged for remediation validation',
        'Regular FDA communication and pre-inspection readiness',
        'Hospital customer communication program to maintain relationships during remediation',
        'Revenue growth from non-Warning Letter categories to offset impact',
      ],
    },
  ],
};
