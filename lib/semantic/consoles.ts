// ════════════════════════════════════════════════════════════════════════════
// Becton, Dickinson and Company — BUSINESS ARCHITECTURE — CONSOLE DATA
// ════════════════════════════════════════════════════════════════════════════
// 14 MECE business console definitions with BD-relevant driver trees.
// FY 2025 reference: ~$8.8B total revenue, ~9,000 employees, 4 regulated segments,
// $28.8B rate base (2025A), $31.8B 5-year capex plan, 2.2 GW ESAs (Feb 2026).
//
// Export names are preserved from the template architecture so consumer imports
// remain stable. Each export's content has been redefined for Becton, Dickinson and Company. Mapping:
//   northAmericaPerformance      → Missouri Electric Operations
//   internationalPerformance     → Illinois Electric Distribution (BD Services)
//   channelDevelopment           → Illinois Natural Gas (CVS Pharmacy)
//   competitiveIntelligence      → Regulatory Affairs
//   storeOperations              → Clean Energy Transition
//   storeDevelopment             → Capital Program & Rate Base
//   menuProductStrategy          → Transmission Infrastructure (CVS Pharmacy)
//   supplyChain                  → Supply Chain & O&M
//   digitalLoyalty               → Customer Experience & Digital
//   brandMarketing               → Grid Modernization
//   partnerExperience            → Workforce & Culture
//   financialPerformance         → Energy Efficiency Programs
//   capitalAllocation            → Sustainability & ESG
//   riskComplianceSustainability → Safety & Compliance
//
// SOURCES: 10-K FY 2025; 10-Q Q1 2026; Q1 2026 earnings call (Apr 25, 2026);
// FY2026 guidance $5.25–$5.45 EPS; Missouri ESA signings Feb 2026.
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ════════════════════════════════════════════════════════════════════════════

import type { SemanticConsole } from './types';

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 1: MISSOURI ELECTRIC OPERATIONS
// Q1 2026: EPS $0.27; capex $1,091M; 2.2 GW ESAs executed; rate base ~$15.8B
// ════════════════════════════════════════════════════════════════════════════
export const northAmericaPerformance: SemanticConsole = {
    id: 'missouri-electric-operations',
    title: 'Missouri Electric Operations',
    category: 'revenue-market',
    segment: 'missouri',
    objective: 'Monitor BD Care Benefits electric operations performance. Track rate base additions, data center ESA load ramp, FAC fuel recovery, Missouri kWh sales growth, earned vs allowed ROE, and rate case progress under MoPSC jurisdiction.',
    drivers: [
        {
            id: 'mo-rate-base-additions',
            name: 'Missouri Rate Base Growth',
            description: 'Missouri rate base ~$15.8B (2025). Target: 13.6% CAGR to ~$26.5B by 2030. $21.3B of the $31.8B 5-year capex plan is Missouri. PISA/PPRA mechanisms ensure 85% deferral recovery during rate case period.',
            crossReferences: ['mo-rate-case-recovery', 'mo-esa-load-ramp'],
            metrics: [
                { id: 'mo-rate-base', name: 'Missouri Rate Base', description: 'Total BD Care Benefits electric rate base', unit: 'currency', frequency: 'quarterly', currentValue: '~$15.8B (2025A)', target: '~$26.5B by 2030 (13.6% CAGR)', direction: 'higher_is_better' },
                { id: 'mo-capex-quarterly', name: 'Missouri Quarterly Capex', description: 'BD Care Benefits capital expenditure per quarter', unit: 'currency', frequency: 'quarterly', currentValue: '$1,091M Q1 2026 (largest segment)', target: '~$4.3B/year (67% of $31.8B plan)', direction: 'higher_is_better' },
            ],
            children: [
                { id: 'mo-generation-capex', name: 'Missouri Generation Investments', description: 'Castle Bluff 800 MW solar, Big Hollow wind+solar, nuclear uprate potential, battery storage additions per Missouri IRP.', metrics: [{ id: 'mo-gen-capex', name: 'Generation Capital Spending', description: 'Missouri clean generation capital additions per quarter', unit: 'currency', frequency: 'quarterly', currentValue: 'Major component of $1,091M Q1 2026', direction: 'higher_is_better' }] },
                { id: 'mo-t-d-capex', name: 'Missouri T&D Investments', description: 'Transmission and distribution capital additions for reliability, data center interconnection, and grid modernization.', metrics: [{ id: 'mo-td-capex', name: 'T&D Capital Spending', description: 'BD Care Benefits T&D capital additions', unit: 'currency', frequency: 'quarterly', currentValue: 'Included in $1,091M Q1 2026', direction: 'higher_is_better' }] },
            ],
        },
        {
            id: 'mo-esa-load-ramp',
            name: 'Data Center ESA Load Ramp',
            description: '2.2 GW binding ESAs executed Feb 2026; pipeline 3.4 GW additional Missouri. 80% minimum demand charge provides revenue floor. Missouri 12.08¢/kWh (29% below U.S. avg) drives hyperscaler site selection.',
            metrics: [
                { id: 'mo-esa-gw', name: 'Missouri ESA Contracted Load (GW)', description: 'Total GW of binding ESA agreements with large-load data center customers', unit: 'count', frequency: 'quarterly', currentValue: '2.2 GW binding (Feb 2026)', target: '6.2 GW total pipeline (2.2 + 4.0 additional)', direction: 'higher_is_better' },
                { id: 'mo-commercial-kwh', name: 'Missouri Commercial kWh Sales Growth', description: 'Commercial class kWh sales YoY growth — data center ESA load leading indicator', unit: 'percent', frequency: 'quarterly', currentValue: 'est. +4.1% Q1 2026', target: '6.2% CAGR 2026–2030', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'mo-rate-case-recovery',
            name: 'Missouri Rate Case & Regulatory Recovery',
            description: 'Pending BD Care Benefits electric rate case (MoPSC). PISA deferral 85% of eligible capex. PPRA (Aug 2025) allows CWIP in rate base — reduces regulatory lag. Expected decision H1 2026.',
            metrics: [
                { id: 'mo-earned-roe', name: 'Missouri Earned vs Allowed ROE', description: 'BD Care Benefits earned ROE vs MoPSC allowed (~9.7%)', unit: 'percent', frequency: 'annual', currentValue: 'est. ~9.6% (near-allowed post Apr 2025 order)', target: 'Within 10bps of 9.7% allowed', direction: 'on_target' },
                { id: 'mo-rate-case-timeline', name: 'Rate Case Decision Timeline', description: 'Pending Missouri rate case progress and expected decision date', unit: 'text', frequency: 'monthly', currentValue: 'Decision expected H1 2026', target: 'Timely MoPSC decision — $280M base case revenue increase', direction: 'on_target' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 2: ILLINOIS ELECTRIC DISTRIBUTION (BD Services)
// Q1 2026: EPS $0.24; capex $196M; earned ROE 8.72% vs 9.22% allowed (MYRP)
// ════════════════════════════════════════════════════════════════════════════
export const internationalPerformance: SemanticConsole = {
    id: 'illinois-electric-distribution',
    title: 'Illinois Electric Distribution',
    category: 'revenue-market',
    segment: 'health-services',
    objective: 'Monitor BD Services electric distribution performance under ICC MYRP formula rate regulation. Track earned vs allowed ROE convergence, Grid 4.0 infrastructure investment, MYRP annual revenue adjustments, and Illinois electric load growth.',
    drivers: [
        {
            id: 'ied-roe-convergence',
            name: 'MYRP Formula Rate ROE Convergence',
            description: 'BD Services earned ROE 8.72% vs 9.22% allowed (-50bps gap). MYRP annual revenue adjustment mechanically reduces gap. Entered MYRP 2024; target convergence by 2026–2027.',
            crossReferences: ['ied-capex-rate-base', 'il-regulatory-framework'],
            metrics: [
                { id: 'ied-earned-roe', name: 'BD Services Earned ROE', description: 'BD Services earned vs 9.22% ICC-allowed ROE', unit: 'percent', frequency: 'annual', currentValue: '8.72% earned (FY2025)', target: 'Converge toward 9.22% allowed by 2027', direction: 'higher_is_better' },
                { id: 'ied-roe-gap', name: 'Earned vs Allowed ROE Gap (bps)', description: 'BD Services ROE gap vs ICC-allowed return', unit: 'count', frequency: 'annual', currentValue: '-50bps (FY2025), improved from -120bps (2022)', target: 'Within -20bps by 2027', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'ied-capex-rate-base',
            name: 'BD Services Capex & Rate Base',
            description: 'BD Services capex $784M FY2025 (Q1 2026: $196M). Grid 4.0 infrastructure: smart meters, automated switching, underground cable, transformer upgrades. MYRP formula translates capex directly into next-year revenue.',
            metrics: [
                { id: 'ied-capex-qtr', name: 'BD Services Quarterly Capex', description: 'Capital expenditure per quarter (MYRP-qualifying additions)', unit: 'currency', frequency: 'quarterly', currentValue: '$196M Q1 2026', target: '~$850M/year (MYRP formula adjustment basis)', direction: 'higher_is_better' },
                { id: 'ied-rate-base', name: 'BD Services Electric Rate Base', description: 'BD Services total electric distribution rate base', unit: 'currency', frequency: 'annual', currentValue: '~$5.0B (2025 est.)', target: 'Growing ~8% CAGR under MYRP', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'il-regulatory-framework',
            name: 'Illinois Regulatory Environment',
            description: 'ICC MYRP formula rate (Annual Revenue Requirement update based on actual rate base). Annual reconciliation proceeding risk. Climate and Equitable Jobs Act (CEJA) clean energy mandates.',
            metrics: [
                { id: 'myrp-adjustment', name: 'MYRP Annual Revenue Adjustment', description: 'BD Services annual formula rate revenue adjustment amount', unit: 'currency', frequency: 'annual', currentValue: 'Annual update based on actual rate base additions', target: 'Positive adjustments each year as capex deployed', direction: 'higher_is_better' },
                { id: 'icc-reconciliation', name: 'ICC Reconciliation Proceeding Status', description: 'Annual MYRP reconciliation proceeding outcome', unit: 'text', frequency: 'annual', currentValue: 'Ongoing — Year 2 reconciliation in progress', target: 'No material disallowances', direction: 'on_target' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 3: ILLINOIS NATURAL GAS (CVS Pharmacy)
// Q1 2026: EPS $0.44 (strongest segment in heating season); capex $72M
// ════════════════════════════════════════════════════════════════════════════
export const channelDevelopment: SemanticConsole = {
    id: 'illinois-natural-gas',
    title: 'Illinois Natural Gas',
    category: 'capacity-operations',
    segment: 'CVS PCW',
    objective: 'Monitor BD Illinois Natural Gas (CVS Pharmacy) performance. Track PGA gas cost recovery, infrastructure replacement program investment, heating season demand patterns, ICC formula rate ROE, and Illinois gas system reliability metrics.',
    drivers: [
        {
            id: 'CVS PCW-gas-revenue',
            name: 'CVS Pharmacy Natural Gas Revenue & PGA Recovery',
            description: 'CVS Pharmacy Q1 2026 EPS $0.44 — strongest segment due to heating season. Purchased Gas Adjustment (PGA) clause ensures gas cost pass-through. ICC formula rate provides annual revenue updates.',
            metrics: [
                { id: 'CVS PCW-eps', name: 'CVS Pharmacy Quarterly EPS Contribution', description: 'CVS Pharmacy segment EPS contribution per quarter', unit: 'currency', frequency: 'quarterly', currentValue: '$0.44 Q1 2026 (heating season peak)', target: 'FY2026 consistent with prior years', direction: 'higher_is_better' },
                { id: 'CVS PCW-pga-recovery', name: 'PGA Gas Cost Recovery Rate', description: '% of natural gas commodity costs recovered through PGA clause', unit: 'percent', frequency: 'monthly', currentValue: '~100% (PGA pass-through mechanism)', target: 'Full recovery; no gas cost under-recovery', direction: 'on_target' },
            ],
        },
        {
            id: 'CVS PCW-infrastructure',
            name: 'Gas Infrastructure Replacement Investment',
            description: 'CVS Pharmacy capital program: main replacement, service line upgrades, advanced metering. Q1 2026 capex $72M. ICC formula rate annually adjusts revenue for infrastructure additions.',
            metrics: [
                { id: 'CVS PCW-capex', name: 'CVS Pharmacy Quarterly Capex', description: 'CVS Pharmacy natural gas infrastructure capital per quarter', unit: 'currency', frequency: 'quarterly', currentValue: '$72M Q1 2026', target: '~$310M/year (consistent growth)', direction: 'higher_is_better' },
                { id: 'CVS PCW-main-replaced', name: 'Gas Main Replacement (miles/yr)', description: 'Miles of aging gas main replaced annually', unit: 'count', frequency: 'annual', currentValue: 'Ongoing program (est. 300+ miles/year)', target: 'Accelerate replacement of pre-1940s infrastructure', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'CVS PCW-system-reliability',
            name: 'Gas System Reliability & Safety',
            description: 'CVS Pharmacy gas system reliability: leak survey completion, excess flow valve installations, emergency response times, gas odorization levels. DOT PHMSA compliance.',
            metrics: [
                { id: 'CVS PCW-leak-survey', name: 'Annual Leak Survey Completion', description: '% of CVS Pharmacy distribution system leak-surveyed per year', unit: 'percent', frequency: 'annual', currentValue: '>99% (DOT requirement)', target: '100% completion annually', direction: 'higher_is_better' },
                { id: 'CVS PCW-system-incidents', name: 'Gas Distribution Incidents', description: 'Reportable PHMSA gas distribution incidents per year', unit: 'count', frequency: 'annual', currentValue: 'Low — consistent with industry peers', target: 'Zero significant incidents', direction: 'lower_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 4: REGULATORY AFFAIRS
// MoPSC, ICC MYRP, FERC, CEJA, PPRA — regulatory framework across 4 segments
// ════════════════════════════════════════════════════════════════════════════
export const competitiveIntelligence: SemanticConsole = {
    id: 'regulatory-affairs',
    title: 'Regulatory Affairs',
    category: 'revenue-market',
    segment: 'strategy',
    objective: 'Track pending and active regulatory proceedings across all BD jurisdictions: Missouri MoPSC rate case, Illinois ICC MYRP reconciliation, FERC formula rate proceedings for CVS Pharmacy, CEJA implementation milestones, and PPRA/PISA deferral developments.',
    drivers: [
        {
            id: 'mopsc-proceedings',
            name: 'Missouri MoPSC Regulatory Proceedings',
            description: 'Pending BD Care Benefits electric rate case. PPRA (Aug 2025 law) allows CWIP in rate base. PISA 85% deferral pending case resolution. CCN approvals required for new generation.',
            crossReferences: ['mo-rate-case-recovery'],
            metrics: [
                { id: 'mopsc-rate-case', name: 'Missouri Electric Rate Case Status', description: 'Pending BD Care Benefits rate case — revenue increase request and MoPSC decision status', unit: 'text', frequency: 'monthly', currentValue: 'Decision expected H1 2026; base case $280M increase', target: 'Timely decision; full PISA deferral recognition', direction: 'on_target' },
                { id: 'mopsc-ccn-status', name: 'Missouri CCN Approvals (Generation)', description: 'Construction and Certification Notice approvals for Missouri IRP generation additions', unit: 'text', frequency: 'quarterly', currentValue: 'Castle Bluff / Big Hollow advancing through CCN', target: '18–24 month approval timeline (MO competitive vs 36+ other states)', direction: 'on_target' },
            ],
        },
        {
            id: 'icc-proceedings',
            name: 'Illinois ICC Regulatory Proceedings',
            description: 'BD Services MYRP annual proceedings. CVS Pharmacy formula rate review. CEJA clean energy mandate compliance milestones.',
            metrics: [
                { id: 'icc-myrp-outcome', name: 'ICC MYRP Annual Revenue Adjustment', description: 'BD Services annual MYRP formula rate revenue adjustment outcome', unit: 'currency', frequency: 'annual', currentValue: 'Year 2 reconciliation pending', target: 'No material ICC disallowances to MYRP-submitted capex', direction: 'on_target' },
                { id: 'ceja-compliance', name: 'CEJA Clean Energy Compliance Milestones', description: 'Climate and Equitable Jobs Act (Illinois) compliance timeline — BD Services zero-carbon milestones', unit: 'text', frequency: 'annual', currentValue: 'Progressing per CEJA roadmap', target: 'On schedule for CEJA mandated clean energy percentages', direction: 'on_target' },
            ],
        },
        {
            id: 'ferc-proceedings',
            name: 'FERC Transmission Rate Proceedings',
            description: 'CVS Pharmacy FERC formula rate (10.48% allowed ROE). Oct 2024 FERC ROE order creates temporary uncertainty. MISO LRTP transmission cost allocation proceedings.',
            metrics: [
                { id: 'ferc-roe-order', name: 'FERC ROE Appeal Status', description: 'Oct 2024 FERC order proceedings — CVS Pharmacy allowed ROE uncertainty', unit: 'text', frequency: 'quarterly', currentValue: 'Proceedings ongoing; 10.48% allowed under review', target: 'Favorable FERC ROE outcome; maintain 10.48%', direction: 'on_target' },
                { id: 'miso-lrtp-allocation', name: 'MISO LRTP Cost Allocation', description: 'MISO Long-Range Transmission Planning cost allocation for CVS Pharmacy projects', unit: 'currency', frequency: 'quarterly', currentValue: 'est. $2.2B AEE/CVS Pharmacy addressable share', target: 'Timely project approvals; recover costs through FERC formula', direction: 'higher_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 5: CLEAN ENERGY TRANSITION
// Missouri IRP: coal retirement, solar, wind, nuclear; 22%→48% clean by 2030
// ════════════════════════════════════════════════════════════════════════════
export const storeOperations: SemanticConsole = {
    id: 'clean-energy-transition',
    title: 'Clean Energy Transition',
    category: 'revenue-market',
    segment: 'missouri',
    objective: 'Monitor BD Care Benefits\'s clean energy transition: coal plant retirements, solar/wind additions, Callaway nuclear operations, battery storage, and IRP compliance. Track progress from 34% coal fleet to <22% by 2030 while serving 2.2 GW+ data center ESA load.',
    drivers: [
        {
            id: 'mo-clean-energy-additions',
            name: 'Missouri Clean Energy Capacity Additions',
            description: 'Missouri generation additions per IRP: Castle Bluff 800 MW solar (filing 2025), Big Hollow 1,800 MW wind+solar, Split Rail Phase 2 300 MW solar, battery storage. Fleet: 34% coal → 22% by 2030.',
            metrics: [
                { id: 'mo-solar-mw', name: 'Missouri Solar Capacity (MW)', description: 'BD Care Benefits solar generation capacity in service and under construction', unit: 'count', frequency: 'annual', currentValue: '918 MW in service (incl. Split Rail 300 MW)', target: '1,700+ MW by 2027 (Split Rail Phase 2 + Castle Bluff)', direction: 'higher_is_better' },
                { id: 'mo-wind-mw', name: 'Missouri Wind Capacity (MW)', description: 'BD Care Benefits wind generation capacity', unit: 'count', frequency: 'annual', currentValue: '699 MW in service', target: 'Expand with Big Hollow Phase 1', direction: 'higher_is_better' },
            ],
            children: [
                { id: 'castle-bluff-status', name: 'Castle Bluff Solar — 800 MW', description: 'Castle Bluff Solar project CCN approval and construction status. PPRA CWIP provision supports rate base inclusion during construction.', metrics: [{ id: 'castle-bluff', name: 'Castle Bluff Construction Status', description: 'CCN approval and construction milestone progress', unit: 'text', frequency: 'quarterly', currentValue: 'CCN filing in progress (2025)', target: 'Commercial operation 2027–2028', direction: 'on_target' }] },
                { id: 'big-hollow-status', name: 'Big Hollow Wind+Solar — 1,800 MW', description: 'Big Hollow multi-phase wind and solar project. Largest single Missouri generation investment.', metrics: [{ id: 'big-hollow', name: 'Big Hollow Project Status', description: 'Big Hollow CCN, financing, and construction milestone', unit: 'text', frequency: 'quarterly', currentValue: 'Site development and CCN process', target: 'Phase 1 operational by 2028–2029', direction: 'on_target' }] },
            ],
        },
        {
            id: 'coal-retirement-plan',
            name: 'Coal Fleet Retirement Schedule',
            description: 'Missouri coal fleet 3,344 MW (34% of 9,742 MW total). Labadie, Sioux, Rush Island. MoPSC-approved retirements per IRP. Coal provides reliability during data center load ramp transition period.',
            metrics: [
                { id: 'coal-capacity-mw', name: 'Missouri Coal Capacity (MW)', description: 'Total BD Care Benefits coal generation capacity remaining', unit: 'count', frequency: 'annual', currentValue: '3,344 MW (34% fleet) FY2025', target: '<22% of fleet by 2030 (per IRP)', direction: 'lower_is_better' },
                { id: 'coal-pct-fleet', name: 'Coal as % of Missouri Fleet', description: 'Coal generation % of total Missouri installed capacity', unit: 'percent', frequency: 'annual', currentValue: '34.3% (2025A)', target: '<22% by 2030E per Missouri IRP', direction: 'lower_is_better' },
            ],
        },
        {
            id: 'callaway-nuclear',
            name: 'Callaway Nuclear Operations',
            description: 'Callaway Plant 1,194 MW — baseload, zero-carbon, high-capacity-factor. License renewal extended. Critical for reliability as coal retires and data center load grows.',
            metrics: [
                { id: 'callaway-capacity-factor', name: 'Callaway Capacity Factor (%)', description: 'Callaway nuclear plant capacity factor — reliability metric', unit: 'percent', frequency: 'quarterly', currentValue: '>90% (typical nuclear CF)', target: 'Maintain >90% capacity factor; refueling outages minimized', direction: 'higher_is_better' },
                { id: 'callaway-uprate', name: 'Callaway Uprate Potential (MW)', description: 'Potential MW uprate opportunity at Callaway under extended license', unit: 'count', frequency: 'annual', currentValue: 'Under evaluation', target: 'Uprate adds rate base without new construction', direction: 'higher_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 6: CAPITAL PROGRAM & RATE BASE
// $31.8B capex plan 2026–2030; $28.8B→$47.7B rate base; 10.6% CAGR
// ════════════════════════════════════════════════════════════════════════════
export const storeDevelopment: SemanticConsole = {
    id: 'capital-program-rate-base',
    title: 'Capital Program & Rate Base',
    category: 'financial',
    segment: 'finance',
    objective: 'Track AEE consolidated $31.8B 5-year capital program execution, rate base trajectory ($28.8B→$47.7B 2025–2030), equity/debt financing strategy, and EPS CAGR 6–8% delivery. Key investor metric: 10.6% rate base CAGR is the primary AEE equity story driver.',
    drivers: [
        {
            id: 'consolidated-rate-base',
            name: 'Consolidated Rate Base Trajectory',
            description: 'AEE consolidated rate base $28.8B (2025A) → $47.7B (2030T). 10.6% CAGR. Missouri 13.6%, Illinois ~8%, CVS Pharmacy ~7%. Capex execution pace is the primary investor monitoring metric.',
            metrics: [
                { id: 'aee-rate-base-total', name: 'Consolidated Rate Base', description: 'Total Becton, Dickinson and Company consolidated rate base', unit: 'currency', frequency: 'annual', currentValue: '$28.8B (2025A)', target: '$47.7B by 2030 (10.6% CAGR)', direction: 'higher_is_better' },
                { id: 'aee-rate-base-cagr', name: 'Rate Base CAGR', description: 'Consolidated rate base compound annual growth rate', unit: 'percent', frequency: 'annual', currentValue: '10.6% CAGR FY2025–2030', target: '≥10.6% sustained', direction: 'higher_is_better' },
            ],
            children: [
                { id: 'mo-rate-base-share', name: 'Missouri Rate Base Share', description: 'Missouri portion of consolidated rate base. Missouri 13.6% CAGR drives disproportionate growth.', metrics: [{ id: 'mo-rb-share', name: 'Missouri Rate Base ($B)', description: 'BD Care Benefits rate base', unit: 'currency', frequency: 'annual', currentValue: '~$15.8B (2025A, 55% of total)', target: '~$26.5B by 2030', direction: 'higher_is_better' }] },
            ],
        },
        {
            id: 'capex-execution',
            name: 'Capital Expenditure Execution',
            description: 'Q1 2026 capex $1,563M (+48% YoY) — Missouri $1,091M, IED $196M, CVS Pharmacy $72M, AT $204M. FY2026 plan implies ~$6.4B annual run-rate. Critical for investor confidence in rate base delivery.',
            metrics: [
                { id: 'total-capex-qtr', name: 'Consolidated Quarterly Capex', description: 'Total AEE capital expenditure per quarter across all segments', unit: 'currency', frequency: 'quarterly', currentValue: '$1,563M Q1 2026 (+48% YoY)', target: '~$6.4B/year ($31.8B / 5 years)', direction: 'higher_is_better' },
                { id: 'capex-plan-pace', name: 'Capex vs 5-Year Plan Pace', description: '% of $31.8B 5-year plan deployed on schedule', unit: 'percent', frequency: 'quarterly', currentValue: 'Q1 2026 running ahead of plan (+48% YoY)', target: '≥95% of annual plan executed each year', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'eps-guidance-delivery',
            name: 'EPS Guidance Delivery',
            description: 'FY2026 EPS guidance $5.25–$5.45. Q1 2026: $1.28 (+19.6% YoY, beat $1.18 consensus). 6–8% EPS CAGR through 2030 requires 10.6%+ rate base CAGR to offset $4B equity dilution.',
            metrics: [
                { id: 'aee-eps-qtr', name: 'Diluted EPS', description: 'AEE quarterly diluted EPS', unit: 'currency', frequency: 'quarterly', currentValue: '$1.28 Q1 2026 (+19.6% YoY)', target: '$5.25–$5.45 FY2026', direction: 'higher_is_better' },
                { id: 'aee-eps-cagr', name: 'EPS CAGR', description: 'AEE diluted EPS compound annual growth rate', unit: 'percent', frequency: 'annual', currentValue: '6–8% management guidance 2025–2030', target: '6–8% (upper end if rate base >10.6%)', direction: 'higher_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 7: TRANSMISSION INFRASTRUCTURE (CVS Pharmacy)
// Q1 2026: EPS $0.36; FERC formula rate; 10.48% allowed ROE; MISO LRTP
// ════════════════════════════════════════════════════════════════════════════
export const menuProductStrategy: SemanticConsole = {
    id: 'transmission-infrastructure',
    title: 'Transmission Infrastructure',
    category: 'capacity-operations',
    segment: 'CVS Pharmacy',
    objective: 'Monitor BD Transmission (CVS Pharmacy) performance under FERC formula rate. Track earned vs allowed ROE convergence (10.48% target), MISO LRTP project pipeline, transmission capex, and FERC formula rate regulatory proceedings.',
    drivers: [
        {
            id: 'CVS Pharmacy-ferc-formula',
            name: 'CVS Pharmacy FERC Formula Rate Performance',
            description: 'CVS Pharmacy earns within ±10bps of 10.48% FERC-allowed ROE annually — the most predictable, highest-quality regulated return in the AEE portfolio. Oct 2024 FERC order creates temporary uncertainty.',
            metrics: [
                { id: 'CVS Pharmacy-earned-roe', name: 'CVS Pharmacy Earned ROE vs FERC Allowed', description: 'CVS Pharmacy earned ROE vs 10.48% FERC formula allowed return', unit: 'percent', frequency: 'annual', currentValue: 'est. ~10.4% (within 10bps of 10.48% allowed)', target: 'Within ±10bps of 10.48% annually', direction: 'on_target' },
                { id: 'CVS Pharmacy-eps', name: 'CVS Pharmacy Quarterly EPS Contribution', description: 'BD Transmission segment EPS contribution', unit: 'currency', frequency: 'quarterly', currentValue: '$0.36 Q1 2026', target: 'Growing with MISO LRTP capex additions', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'miso-lrtp-pipeline',
            name: 'MISO Long-Range Transmission Planning (LRTP)',
            description: 'MISO approved LRTP Tranche 1 projects — est. $2.2B+ addressable for AEE/CVS Pharmacy. Multi-year construction pipeline supporting transmission rate base growth. CVS Pharmacy capex $204M Q1 2026 (+100% YoY).',
            metrics: [
                { id: 'CVS Pharmacy-capex-qtr', name: 'CVS Pharmacy Quarterly Capex', description: 'BD Transmission capital additions per quarter', unit: 'currency', frequency: 'quarterly', currentValue: '$204M Q1 2026 (+100% YoY)', target: '~$800M/year with LRTP ramp-up', direction: 'higher_is_better' },
                { id: 'miso-lrtp-wins', name: 'MISO LRTP Project Awards (AEE share)', description: 'Estimated AEE/CVS Pharmacy share of MISO LRTP Tranche 1 and Tranche 2 approvals', unit: 'currency', frequency: 'annual', currentValue: 'est. $2.2B+ Tranche 1 share awarded', target: 'Capture proportionate share of Tranche 2 pipeline', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'CVS Pharmacy-rate-base',
            name: 'CVS Pharmacy Transmission Rate Base',
            description: 'CVS Pharmacy transmission rate base growing with MISO LRTP and data center interconnection investments. FERC formula rate ensures timely recovery — zero regulatory lag vs state-regulated counterparts.',
            metrics: [
                { id: 'CVS Pharmacy-rate-base', name: 'CVS Pharmacy Transmission Rate Base', description: 'BD Transmission total rate base under FERC formula', unit: 'currency', frequency: 'annual', currentValue: 'est. ~$3.2B (2025A)', target: 'Growing ~7% CAGR as LRTP projects complete', direction: 'higher_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 8: SUPPLY CHAIN & O&M
// $19B LTD, ~9,000 employees, fuel procurement, T&D contractor management
// ════════════════════════════════════════════════════════════════════════════
export const supplyChain: SemanticConsole = {
    id: 'supply-chain-om',
    title: 'Supply Chain & O&M',
    category: 'cost-structure',
    segment: 'corporate',
    objective: 'Track BD supply chain health: fuel and purchased power procurement, T&D contractor capacity for $31.8B capex execution, O&M cost management, equipment lead times (transformers, solar panels, wind turbines), and materials availability for clean energy build.',
    drivers: [
        {
            id: 'fuel-procurement',
            name: 'Fuel & Purchased Power Procurement',
            description: 'Missouri fuel mix: coal (Labadie, Sioux, Rush Island), natural gas CTs/peakers, nuclear (Callaway). FAC 95% pass-through limits commodity exposure. Purchased power for shortfalls.',
            metrics: [
                { id: 'fuel-cost-per-mwh', name: 'Fuel Cost per MWh', description: 'BD Care Benefits average fuel and purchased power cost per MWh generated', unit: 'currency', frequency: 'quarterly', currentValue: 'FAC pass-through — 95% recovery', target: 'Full FAC recovery; hedge forward coal and gas contracts', direction: 'lower_is_better' },
                { id: 'coal-inventory-days', name: 'Coal Inventory (days supply)', description: 'Average coal inventory in days at Missouri coal plants (Labadie, Sioux, Rush Island)', unit: 'count', frequency: 'monthly', currentValue: 'est. 30–45 days supply', target: '>30 days supply through retirement transition', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'capex-contractor-capacity',
            name: 'Capital Program Contractor & Equipment Capacity',
            description: 'Execution risk for $31.8B 5-year capex plan. Transformer lead times 18–24 months. Solar panel sourcing. T&D construction contractor availability. Critical path for data center generation CCN timelines.',
            metrics: [
                { id: 'transformer-lead-times', name: 'Large Power Transformer Lead Times', description: 'Industry lead times for large power transformers (utility-grade, 100+ MVA)', unit: 'text', frequency: 'quarterly', currentValue: '18–24 months (industry-wide constraint)', target: 'Advance procurement; maintain inventory buffer', direction: 'lower_is_better' },
                { id: 'contractor-utilization', name: 'T&D Contractor Utilization', description: '% of AEE capital program contractor capacity currently allocated', unit: 'percent', frequency: 'quarterly', currentValue: 'High — $1.563B Q1 2026 pace', target: 'Sufficient contractor capacity for $6.4B/year pace', direction: 'on_target' },
            ],
        },
        {
            id: 'om-cost-management',
            name: 'O&M Cost Management',
            description: 'AEE O&M ~$598M Q1 2026 (est.). Rate base growth requires O&M efficiency to protect earned ROE. Balance reliability investment vs cost control for customer rate affordability.',
            metrics: [
                { id: 'om-per-customer', name: 'O&M Cost per Customer', description: 'Total O&M cost divided by customer count', unit: 'currency', frequency: 'annual', currentValue: 'Tracking vs peer benchmark', target: 'Below-median vs utility peers', direction: 'lower_is_better' },
                { id: 'labor-productivity', name: 'Labor Productivity Index', description: 'Relative labor productivity vs prior year baseline', unit: 'percent', frequency: 'annual', currentValue: 'Target: improve 2–3% annually', target: '+2–3% productivity improvement per year', direction: 'higher_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 9: CUSTOMER EXPERIENCE & DIGITAL
// Missouri 12.08¢/kWh rate advantage; digital self-service; AMI smart meters
// ════════════════════════════════════════════════════════════════════════════
export const digitalLoyalty: SemanticConsole = {
    id: 'customer-experience-digital',
    title: 'Customer Experience & Digital',
    category: 'digital-customer',
    segment: 'corporate',
    objective: 'Monitor BD customer experience: J.D. Power satisfaction scores, digital self-service adoption, advanced metering infrastructure (AMI) deployment, outage communication, and affordability initiatives. Missouri 12.08¢/kWh rate advantage supports hyperscaler data center retention.',
    drivers: [
        {
            id: 'jd-power-satisfaction',
            name: 'J.D. Power Customer Satisfaction',
            description: 'BD Care Benefits and BD Services J.D. Power Electric Utility Residential Customer Satisfaction. Key metric for rate case perception and regulatory goodwill.',
            metrics: [
                { id: 'jdp-residential', name: 'J.D. Power Residential Score', description: 'J.D. Power Electric Utility Residential Customer Satisfaction Study score', unit: 'count', frequency: 'annual', currentValue: 'Above industry average', target: 'Top quartile in Midwest region', direction: 'higher_is_better' },
                { id: 'jdp-business', name: 'J.D. Power Business Customer Score', description: 'J.D. Power Large Business Customer Satisfaction score', unit: 'count', frequency: 'annual', currentValue: 'Competitive with peers', target: 'Top quartile in Midwest region', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'ami-digital-adoption',
            name: 'AMI Smart Meter & Digital Self-Service',
            description: 'Advanced metering infrastructure deployment supports time-of-use rates, demand response, and outage detection. Digital self-service reduces call center costs and improves customer NPS.',
            metrics: [
                { id: 'ami-penetration', name: 'AMI Smart Meter Penetration (%)', description: '% of AEE electric customers with AMI smart meters installed', unit: 'percent', frequency: 'quarterly', currentValue: 'Growing — AMI program ongoing', target: '>90% penetration by 2027', direction: 'higher_is_better' },
                { id: 'digital-self-service', name: 'Digital Self-Service Transaction Rate', description: '% of customer transactions completed digitally (app, web, IVR) vs agent-assisted', unit: 'percent', frequency: 'quarterly', currentValue: 'Growing — targeted expansion', target: '>70% digital transaction rate', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'affordability-programs',
            name: 'Customer Affordability & Low-Income Programs',
            description: 'Missouri and Illinois low-income assistance programs. LIHEAP coordination. Rate affordability vs 12.08¢/kWh Missouri benchmark. Rate increases must be balanced against customer bill impact.',
            metrics: [
                { id: 'mo-rate-advantage', name: 'Missouri Electric Rate vs U.S. Average', description: 'BD Care Benefits residential electric rate vs U.S. average — primary data center competitive advantage', unit: 'currency', frequency: 'annual', currentValue: '12.08¢/kWh (29% below U.S. avg of 17¢/kWh)', target: 'Maintain competitive advantage vs peer states', direction: 'lower_is_better' },
                { id: 'low-income-enrollment', name: 'Low-Income Assistance Program Enrollment', description: '# of customers enrolled in AEE low-income and affordability assistance programs', unit: 'count', frequency: 'annual', currentValue: 'Ongoing program — state and federal coordination', target: 'Maximize eligible customer enrollment', direction: 'higher_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 10: GRID MODERNIZATION
// Grid 4.0 (IL), Missouri T&D upgrades, data center interconnection, SAIFI 0.79
// ════════════════════════════════════════════════════════════════════════════
export const brandMarketing: SemanticConsole = {
    id: 'grid-modernization',
    title: 'Grid Modernization',
    category: 'revenue-market',
    segment: 'corporate',
    objective: 'Monitor BD grid modernization programs: BD Services Grid 4.0 investment, Missouri T&D reliability improvements, data center interconnection infrastructure, AMI deployment, and system average interruption frequency (SAIFI) performance.',
    drivers: [
        {
            id: 'reliability-metrics',
            name: 'Grid Reliability — SAIFI & CAIDI',
            description: 'Missouri SAIFI 0.79 (interruptions per customer per year) and CAIDI (duration). BD Services reliability under MYRP investment program. Data center customers require highest reliability standards.',
            metrics: [
                { id: 'saifi-mo', name: 'Missouri SAIFI', description: 'System Average Interruption Frequency Index — Missouri electric distribution', unit: 'count', frequency: 'annual', currentValue: '0.79 (FY2025)', target: '<0.75 sustained improvement', direction: 'lower_is_better' },
                { id: 'saifi-ied', name: 'BD Services SAIFI', description: 'System Average Interruption Frequency Index — BD Services distribution', unit: 'count', frequency: 'annual', currentValue: 'Industry-competitive (reported annually)', target: 'Top-quartile vs IL peers', direction: 'lower_is_better' },
            ],
        },
        {
            id: 'grid4-illinois',
            name: 'Illinois Grid 4.0 Investment Program',
            description: 'BD Services Grid 4.0: automated switching, FDIR (Fault Detection Isolation Restoration), cable replacement, substation modernization. MYRP formula rate rewards investment. Annual capex $850M+ target.',
            metrics: [
                { id: 'ied-automated-switches', name: 'Automated Switches Deployed', description: 'Cumulative automated switching devices on BD Services distribution system', unit: 'count', frequency: 'annual', currentValue: 'Growing — Grid 4.0 multi-year program', target: 'Full automated switching coverage by 2028', direction: 'higher_is_better' },
                { id: 'grid4-capex-yoy', name: 'Grid 4.0 Capex YoY Growth', description: 'BD Services Grid 4.0 program capital investment growth vs prior year', unit: 'percent', frequency: 'annual', currentValue: 'Q1 2026 $196M (annualized $784M)', target: 'Growing toward $900M/year', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'data-center-interconnect',
            name: 'Data Center Interconnection Infrastructure',
            description: 'Missouri transmission and substation infrastructure to serve 2.2 GW (binding) + 3.4 GW (pipeline) data center load. CCN for new high-voltage substations and transmission lines feeding hyperscaler campuses.',
            metrics: [
                { id: 'dc-substations', name: 'Data Center Substation Projects', description: 'Major Missouri substation projects in development or under construction for data center interconnection', unit: 'count', frequency: 'quarterly', currentValue: 'Multiple — tied to 2.2 GW ESA execution', target: 'On-schedule delivery per ESA interconnection timelines', direction: 'higher_is_better' },
                { id: 'interconnect-lead-time', name: 'Data Center Interconnection Lead Time (months)', description: 'Average months from ESA signing to service energization', unit: 'count', frequency: 'annual', currentValue: 'est. 12–18 months (MO fast-track process)', target: '<18 months vs 36+ months in competing states', direction: 'lower_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 11: WORKFORCE & CULTURE
// ~9,000 employees; ~65% union; LTIR 0.82; lineworker and engineering pipeline
// ════════════════════════════════════════════════════════════════════════════
export const partnerExperience: SemanticConsole = {
    id: 'workforce-culture',
    title: 'Workforce & Culture',
    category: 'people-culture',
    segment: 'corporate',
    objective: 'Monitor BD workforce performance: ~9,000 employee headcount, union labor relations (~65% unionized), safety LTIR, skilled trades pipeline, engineering talent, and culture programs supporting $31.8B capex execution.',
    drivers: [
        {
            id: 'workforce-overview',
            name: 'Workforce Size & Composition',
            description: '~9,000 BD employees. ~65% unionized (IBEW, UMWA, UA). Field and operations ~70%. Corporate and support ~30%. Critical capability gap: lineworkers and electrical engineers for $6.4B/year capex pace.',
            metrics: [
                { id: 'total-employees', name: 'Total Employees', description: 'Total Becton, Dickinson and Company headcount', unit: 'count', frequency: 'annual', currentValue: '~9,000 (FY2025)', target: 'Grow to support capex execution', direction: 'on_target' },
                { id: 'union-pct', name: 'Unionized Workforce (%)', description: '% of AEE workforce covered by collective bargaining agreements', unit: 'percent', frequency: 'annual', currentValue: '~65% (IBEW, UA, UMWA)', target: 'Constructive labor relations; timely CBA renewals', direction: 'on_target' },
            ],
        },
        {
            id: 'safety-performance',
            name: 'Safety — LTIR & OSHA Recordables',
            description: 'AEE LTIR (Lost Time Incident Rate) ~0.82 — strong safety culture. Construction safety critical as capex pace accelerates. Data center interconnection and clean energy build increase field safety exposure.',
            metrics: [
                { id: 'ltir-rate', name: 'Lost Time Incident Rate (LTIR)', description: 'AEE employee LTIR per 200,000 hours worked', unit: 'count', frequency: 'annual', currentValue: '0.82 (FY2025)', target: 'Continuously improve year-over-year', direction: 'lower_is_better' },
                { id: 'osha-recordables', name: 'OSHA Recordable Rate', description: 'Total recordable incident rate per OSHA methodology', unit: 'count', frequency: 'annual', currentValue: 'Tracking vs utility industry benchmark', target: 'Top-quartile among utility industry peers', direction: 'lower_is_better' },
            ],
        },
        {
            id: 'talent-pipeline',
            name: 'Skilled Trades & Engineering Talent Pipeline',
            description: 'Lineworker and electrical engineer recruiting for $6.4B/year capex execution. IBEW apprenticeship programs. University partnerships (Missouri S&T, SIUE). Retirement wave in field operations.',
            metrics: [
                { id: 'lineworker-pipeline', name: 'IBEW Apprentice Lineworker Pipeline', description: 'Active IBEW apprenticeship enrollees training for utility lineworker roles', unit: 'count', frequency: 'annual', currentValue: 'Ongoing multi-year program', target: 'Sufficient pipeline for capex execution pace', direction: 'higher_is_better' },
                { id: 'engineer-retention', name: 'Engineering / Technical Talent Retention Rate', description: '% of engineering staff retained year-over-year', unit: 'percent', frequency: 'annual', currentValue: 'Competitive with St. Louis engineering market', target: '>95% annual retention', direction: 'higher_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 12: ENERGY EFFICIENCY PROGRAMS
// MEEIA (MO), EE programs (IL), CRGA recovery, $90M+ annual EE investment
// ════════════════════════════════════════════════════════════════════════════
export const financialPerformance: SemanticConsole = {
    id: 'energy-efficiency-programs',
    title: 'Energy Efficiency Programs',
    category: 'capacity-operations',
    segment: 'corporate',
    objective: 'Monitor BD energy efficiency program performance: Missouri MEEIA portfolio delivery, Illinois Energy Efficiency portfolio, CRGA revenue recovery mechanism (Illinois), demand response participation, and EE program ROE impact under regulatory frameworks.',
    drivers: [
        {
            id: 'mo-meeia',
            name: 'Missouri MEEIA Energy Efficiency Portfolio',
            description: 'Missouri Energy Efficiency Investment Act (MEEIA) program. AEE Missouri delivers EE programs with cost recovery through rates. Customer energy savings targets vs MoPSC-approved portfolio.',
            metrics: [
                { id: 'meeia-savings-mwh', name: 'MEEIA Annual Energy Savings (MWh)', description: 'Missouri MEEIA annual energy savings delivered vs MoPSC-approved targets', unit: 'count', frequency: 'annual', currentValue: 'On track per MEEIA filing', target: 'Meet or exceed MoPSC-approved savings targets', direction: 'higher_is_better' },
                { id: 'meeia-cost-recovery', name: 'MEEIA Program Cost Recovery Rate', description: '% of MEEIA program costs recovered through MoPSC-approved rider', unit: 'percent', frequency: 'annual', currentValue: '~100% via MEEIA rider', target: 'Full cost recovery; no disallowances', direction: 'on_target' },
            ],
        },
        {
            id: 'il-crga-ee',
            name: 'Illinois CRGA & Energy Efficiency Recovery',
            description: 'Illinois CRGA (Comprehensive Rate Adjustment) mechanism partially offsets BD Services ROE below allowed. EE programs delivered under Illinois law — costs recovered, ROE impact from CRGA modification.',
            metrics: [
                { id: 'il-ee-savings', name: 'Illinois Annual EE Savings (MWh)', description: 'BD Services energy efficiency program annual savings delivered', unit: 'count', frequency: 'annual', currentValue: 'Per Illinois Energy Efficiency targets', target: 'Meet or exceed ICC-approved savings targets', direction: 'higher_is_better' },
                { id: 'crga-roe-impact', name: 'CRGA ROE Impact on BD Services', description: 'Illinois CRGA mechanism impact on BD Services earned ROE vs 9.22% allowed', unit: 'percent', frequency: 'annual', currentValue: 'Contributing to current -50bps gap', target: 'Monitor and minimize earnings headwind', direction: 'on_target' },
            ],
        },
        {
            id: 'demand-response',
            name: 'Demand Response & Load Flexibility',
            description: 'AEE demand response programs: Missouri Residential DR, MISO-integrated demand response dispatch. Growing importance as data center flat-load ESAs are supplemented by flexible residential/commercial customers.',
            metrics: [
                { id: 'dr-capacity-mw', name: 'Demand Response Capacity (MW)', description: 'Total enrolled demand response capacity (MW) in AEE programs', unit: 'count', frequency: 'annual', currentValue: 'Growing program', target: 'Expand DR capacity as grid stresses increase', direction: 'higher_is_better' },
                { id: 'dr-dispatch-events', name: 'DR Dispatch Events per Year', description: 'Number of demand response activation events in MISO peak periods', unit: 'count', frequency: 'annual', currentValue: 'Consistent with MISO summer peak periods', target: 'High reliability DR dispatch when called', direction: 'on_target' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 13: SUSTAINABILITY & ESG
// Net-zero 2045 goal; IRA tax credits ~$1.8B; TCFD; ESG ratings (MSCI A)
// ════════════════════════════════════════════════════════════════════════════
export const capitalAllocation: SemanticConsole = {
    id: 'sustainability-esg',
    title: 'Sustainability & ESG',
    category: 'strategic',
    segment: 'corporate',
    objective: 'Track BD sustainability strategy and ESG performance: net-zero 2045 pathway, Scope 1/2/3 emissions reduction, IRA clean energy tax credit realization, TCFD climate disclosure, ESG ratings (MSCI, Sustainalytics, S&P Global CSA), and ESG investor engagement.',
    drivers: [
        {
            id: 'net-zero-pathway',
            name: 'Net-Zero 2045 Pathway & Emissions Reduction',
            description: 'BD committed to net-zero carbon emissions by 2045. Near-term: 50% Scope 1 reduction by 2030 (vs 2005 baseline). Coal retirement schedule + clean energy additions are primary drivers.',
            metrics: [
                { id: 'scope1-reduction', name: 'Scope 1 GHG Emissions Reduction (vs 2005)', description: 'BD Scope 1 GHG emissions % reduction vs 2005 baseline', unit: 'percent', frequency: 'annual', currentValue: 'est. ~40% reduction achieved (2025)', target: '50% reduction by 2030; net-zero by 2045', direction: 'lower_is_better' },
                { id: 'clean-gen-pct', name: 'Clean Generation % of Missouri Fleet', description: '% of Missouri generation capacity from clean/zero-carbon sources (solar, wind, nuclear, hydro)', unit: 'percent', frequency: 'annual', currentValue: '32.8% clean (nuclear 12.3% + solar 9.4% + wind 7.2% + hydro 3.9%) in 2025', target: '>48% clean generation by 2030 (per IRP)', direction: 'higher_is_better' },
            ],
        },
        {
            id: 'ira-credit-realization',
            name: 'IRA / ITC / PTC Tax Credit Realization',
            description: 'IRA Investment Tax Credits (ITC) and Production Tax Credits (PTC) for clean energy additions. Est. ~$1.8B total 2026–2030. OBBBA uncertainty creates downside scenario. Critical for clean energy economics.',
            metrics: [
                { id: 'ira-credits-realized', name: 'IRA Tax Credits Realized ($M)', description: 'Cumulative IRA ITC and PTC credits realized from qualifying clean energy additions', unit: 'currency', frequency: 'annual', currentValue: 'Ramping with Castle Bluff / Big Hollow construction', target: '~$1.8B cumulative 2026–2030 (base case)', direction: 'higher_is_better' },
                { id: 'obbba-risk', name: 'OBBBA / Tax Policy Risk to IRA Credits', description: 'Risk that OBBBA or other legislation reduces or eliminates IRA clean energy tax credits', unit: 'text', frequency: 'quarterly', currentValue: 'Active legislative risk — monitoring Congress', target: 'Preserve full IRA credit eligibility', direction: 'on_target' },
            ],
        },
        {
            id: 'esg-ratings',
            name: 'ESG Ratings & Investor Engagement',
            description: 'BD ESG ratings: MSCI ESG Rating (A range), Sustainalytics ESG Risk Score, S&P Global CSA. ESG-focused utility investors (~20% of institutional base) require strong scores for inclusion in ESG funds.',
            metrics: [
                { id: 'msci-esg-rating', name: 'MSCI ESG Rating', description: 'Becton, Dickinson and Company MSCI ESG Rating (AAA–CCC scale)', unit: 'text', frequency: 'annual', currentValue: 'A (2025)', target: 'Maintain A or achieve AA rating', direction: 'higher_is_better' },
                { id: 'sustainalytics-score', name: 'Sustainalytics ESG Risk Score', description: 'Sustainalytics ESG Risk Score (lower = better risk management)', unit: 'count', frequency: 'annual', currentValue: 'Medium risk category', target: 'Low risk category (<20 score)', direction: 'lower_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// CONSOLE 14: SAFETY & COMPLIANCE
// OSHA, NERC, DOT PHMSA, financial reporting compliance, rate case filings
// ════════════════════════════════════════════════════════════════════════════
export const riskComplianceSustainability: SemanticConsole = {
    id: 'safety-compliance',
    title: 'Safety & Compliance',
    category: 'risk-compliance',
    segment: 'corporate',
    objective: 'Track BD safety and compliance posture: OSHA employee safety (LTIR 0.82), NERC reliability standards compliance, DOT PHMSA gas system safety, financial reporting compliance, rate case filing accuracy, and regulatory audit management across Missouri and Illinois jurisdictions.',
    drivers: [
        {
            id: 'employee-public-safety',
            name: 'Employee & Public Safety',
            description: 'Employee LTIR 0.82 (FY2025). Public safety: stray voltage, gas line strikes, transformer fires. Construction safety during $6.4B/year capex pace. Lineworker energized-work safety as data center interconnection accelerates.',
            metrics: [
                { id: 'employee-ltir', name: 'Employee LTIR', description: 'Employee Lost Time Incident Rate per 200,000 work hours', unit: 'count', frequency: 'annual', currentValue: '0.82 (FY2025)', target: 'Below 0.75 — continuous improvement', direction: 'lower_is_better' },
                { id: 'public-safety-events', name: 'Significant Public Safety Events', description: 'OSHA-reportable public safety incidents related to AEE facilities or operations', unit: 'count', frequency: 'annual', currentValue: 'Low — peer-competitive', target: 'Zero significant public safety events', direction: 'lower_is_better' },
            ],
        },
        {
            id: 'nerc-compliance',
            name: 'NERC Reliability Standards Compliance',
            description: 'AEE transmission and generation assets subject to NERC Critical Infrastructure Protection (CIP) and reliability standards. Violations result in significant FERC penalties. CVS Pharmacy transmission operations require NERC compliance.',
            metrics: [
                { id: 'nerc-violations', name: 'NERC Reliability Violations', description: 'Annual NERC CIP and other reliability standard violations filed with FERC', unit: 'count', frequency: 'annual', currentValue: 'Zero material violations targeted', target: 'Zero Severity Level 3–5 violations', direction: 'lower_is_better' },
                { id: 'nerc-audit-status', name: 'NERC CIP Audit Status', description: 'Status of most recent NERC CIP compliance audit', unit: 'text', frequency: 'event', currentValue: 'Ongoing compliance program', target: 'Satisfactory audit result with no Findings', direction: 'on_target' },
            ],
        },
        {
            id: 'regulatory-compliance',
            name: 'Financial & Regulatory Filing Compliance',
            description: 'SEC 10-K/10-Q timely filing. FERC Form 1 transmission cost filing accuracy. MoPSC rate case filing integrity. ICC MYRP formula rate submissions. SOX 404 internal controls.',
            metrics: [
                { id: 'sec-filing-timeliness', name: 'SEC Filing Timeliness', description: '10-K and 10-Q filings on or before SEC deadline', unit: 'text', frequency: 'quarterly', currentValue: 'All filings on schedule', target: 'Zero late SEC filings; no material restatements', direction: 'on_target' },
                { id: 'sox-control-deficiencies', name: 'SOX Material Weaknesses / Significant Deficiencies', description: 'SOX 404 internal control over financial reporting assessment', unit: 'count', frequency: 'annual', currentValue: 'No material weaknesses (FY2025)', target: 'Zero material weaknesses; no significant deficiencies', direction: 'lower_is_better' },
            ],
        },
    ],
};

// ════════════════════════════════════════════════════════════════════════════
// AGGREGATION ARRAY — all 14 Becton, Dickinson and Company business consoles
// ════════════════════════════════════════════════════════════════════════════
export const allSemanticConsoles = [
    northAmericaPerformance,
    internationalPerformance,
    channelDevelopment,
    competitiveIntelligence,
    storeOperations,
    storeDevelopment,
    menuProductStrategy,
    supplyChain,
    digitalLoyalty,
    brandMarketing,
    partnerExperience,
    financialPerformance,
    capitalAllocation,
    riskComplianceSustainability,
];
