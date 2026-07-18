// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/strategic.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Baker Hughes Company public disclosures: Form 10-K (FY2025); Form 10-Q
// (Q1 2026); Q1 2026 earnings call (Apr 24, 2026); FY2026 guidance.
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { StrategicConfig } from '../../types';

export const strategic: StrategicConfig = {
  initiatives: [
    {
      id: 'chart-acquisition',
      name: 'Chart Industries Acquisition',
      description:
        'Transformational acquisition of Chart Industries (NYSE: GTLS) for ~$210/share cash (~$13.6B enterprise value), ' +
        'agreed July 28, 2025. Chart is a leading global manufacturer of highly engineered cryogenic equipment ' +
        'and systems for LNG, industrial gases, clean energy, and life sciences. ' +
        'Dramatically expands IET\'s cryogenic/LNG equipment portfolio, adding heat exchangers, tanks, ' +
        'cold boxes, and process equipment. Synergies in LNG project execution and aftermarket services. ' +
        'Financed: $6.5B USD + €3.0B EUR notes issued March 11, 2026. Expected close Q2 2026.',
      status: 'on-track',
      budget: 13600,                  // ~$13.6B enterprise value
      spent: 0,                       // pre-close; debt financing in place
      progress: 75,                   // regulatory reviews near completion
      milestones: [
        { name: 'Definitive agreement signed', date: '2025-07-28', status: 'completed' },
        { name: 'Chart shareholder approval', date: '2025-10-06', status: 'completed' },
        { name: 'Bridge facility entered ($14.9B)', date: '2025-07-28', status: 'completed' },
        { name: '$6.5B USD + €3.0B EUR notes issued', date: '2026-03-11', status: 'completed' },
        { name: 'Regulatory approvals (final jurisdictions)', date: '2026-06-30', status: 'in-progress' },
        { name: 'Acquisition close (expected Q2 2026)', date: '2026-06-30', status: 'in-progress' },
        { name: 'Integration — Year 1 synergies', date: '2027-06-30', status: 'planned' },
      ],
      kpis: [
        { label: 'Acquisition Financing', target: '$9.5B notes issued', actual: 'Complete (Mar 2026)', status: 'good' },
        { label: 'Expected Close', target: 'Q2 2026', actual: 'On track', status: 'good' },
        { label: 'Post-Close Leverage', target: '~2.0x Net Debt/EBITDA', actual: 'Pre-close: 0.3x', status: 'good' },
      ],
    },
    {
      id: 'iet-horizon2',
      name: 'IET Horizon 2 — LNG & Gas Infrastructure Leadership',
      description:
        'Horizon 2 strategy targets >$40B cumulative IET orders by 2028, driven by the global LNG supercycle, ' +
        'energy security investment, and growing demand for gas compression infrastructure. ' +
        'Q1 2026 IET RPO reached record $33.1B — on track for Horizon 2. ' +
        'Key growth vectors: LNG liquefaction trains, FSRU systems, gas compression for transport pipelines, ' +
        'aeroderivative turbines for industrial/power, and long-term service agreements (LTSAs) on growing installed base. ' +
        'Aero JV with GE Vernova (50/50) is a key supply partnership for aeroderivative engines.',
      status: 'on-track',
      budget: 0,
      spent: 0,
      progress: 60,                   // 33.1B RPO / 40B target
      milestones: [
        { name: 'IET RPO >$30B milestone', date: '2025-06-30', status: 'completed' },
        { name: 'Q1 2026 IET orders record $4.9B', date: '2026-03-31', status: 'completed' },
        { name: 'IET RPO $33.1B record', date: '2026-03-31', status: 'completed' },
        { name: 'FY2026 IET orders ≥$14.5B guidance', date: '2026-12-31', status: 'in-progress' },
        { name: 'IET EBITDA ≥$2.7B FY2026 guidance', date: '2026-12-31', status: 'in-progress' },
        { name: 'Horizon 2 cumulative orders >$40B', date: '2028-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'IET RPO', target: '>$40B by 2028', actual: '$33.1B (Q1 2026)', status: 'good' },
        { label: 'IET Q1 2026 Book-to-Bill', target: '>1.0x', actual: '1.46x', status: 'good' },
        { label: 'IET EBITDA Margin', target: '≥20%', actual: '20.2% (Q1 2026)', status: 'good' },
      ],
    },
    {
      id: 'climate-technology-growth',
      name: 'Climate Technology Solutions (CTS) — New Energy Markets',
      description:
        'CTS is the fastest-growing IET product line, capturing demand from data center power generation, ' +
        'CCUS (carbon capture, utilization and storage), hydrogen, geothermal, and emissions abatement solutions. ' +
        'Q1 2026 CTS orders $1,257M vs $148M Q1 2025 — a 9x surge reflecting major new energy contract wins. ' +
        'Data center power demand (aeroderivative turbines for on-site generation) is the largest near-term driver. ' +
        'Hydrogen and CCUS represent longer-term market development. ' +
        'BKR made a 2019 commitment: Scope 1 & 2 emissions -50% by 2030 vs 2019; net-zero by 2050.',
      status: 'on-track',
      budget: 1500,                   // est. annual investment in CTS product development and capacity
      spent: 400,
      progress: 45,
      milestones: [
        { name: 'CTS revenue run-rate >$600M/year', date: '2025-12-31', status: 'completed' },
        { name: 'Q1 2026 CTS orders record $1.26B', date: '2026-03-31', status: 'completed' },
        { name: 'Data center power pipeline >$2B orders', date: '2026-12-31', status: 'in-progress' },
        { name: 'Hydrogen project execution — first projects', date: '2027-06-30', status: 'planned' },
        { name: 'CCUS equipment — commercial deployments', date: '2028-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'Q1 2026 CTS Orders', target: '>$500M/quarter', actual: '$1,257M', status: 'good' },
        { label: 'CTS Revenue Growth', target: '+20% YoY', actual: '+22% (Q1 2026)', status: 'good' },
        { label: 'Scope 1&2 CO2 Reduction (vs 2019)', target: '-50% by 2030', actual: '-29.3% (2024 CSR)', status: 'good' },
      ],
    },
    {
      id: 'portfolio-simplification',
      name: 'Portfolio Simplification — Non-Core Asset Divestitures',
      description:
        'BKR is divesting non-core businesses to sharpen focus on OFSE and IET growth platforms. ' +
        'FY2026 portfolio proceeds targeted ~$3B: ' +
        '(1) PSI (Precision Sensors & Instrumentation, IET) → Crane Company for ~$1.2B (closed Q1 2026). ' +
        '(2) SPC (Surface Pressure Control, OFSE) → Cactus JV for ~$323M consideration (closed Q1 2026). ' +
        '(3) Waygate Technologies (industrial inspection, IET) → Hexagon AB for ~$1.45B (signed Apr 2026, expected H2 2026). ' +
        '(4) HMH (oilfield equipment, OFSE) IPO — pending. ' +
        'Proceeds fund Chart acquisition and reduce net leverage post-close.',
      status: 'on-track',
      budget: 0,
      spent: 0,
      progress: 65,
      milestones: [
        { name: 'PSI → Crane Company close', date: '2026-01-01', status: 'completed' },
        { name: 'SPC → Cactus JV close', date: '2026-01-01', status: 'completed' },
        { name: 'Waygate → Hexagon agreement signed', date: '2026-04-13', status: 'completed' },
        { name: 'Waygate close (expected H2 2026)', date: '2026-12-31', status: 'in-progress' },
        { name: 'HMH IPO', date: '2026-12-31', status: 'in-progress' },
        { name: '~$3B total proceeds FY2026', date: '2026-12-31', status: 'in-progress' },
      ],
      kpis: [
        { label: 'Proceeds Received YTD', target: '~$3B', actual: '~$1.5B (Q1 2026 closed)', status: 'good' },
        { label: 'PSI Gain', target: '>$400M', actual: '$497M recognized', status: 'good' },
        { label: 'SPC Gain', target: '>$200M', actual: '$225M recognized', status: 'good' },
      ],
    },
    {
      id: 'ofse-cost-competitiveness',
      name: 'OFSE Cost-Out & Margin Recovery',
      description:
        'OFSE segment EBITDA margin was 17.5% in Q1 2026 vs 17.8% Q1 2025. ' +
        'Management is executing cost-out initiatives to offset volume headwinds from SPC disposition and Middle East disruptions. ' +
        'Key actions: workforce restructuring ($26M Q1 2026 employee termination charges), ' +
        'manufacturing footprint optimization, supply chain efficiency, and digital field service tools. ' +
        'FY2026 OFSE EBITDA guidance ≥$2.325B (implied margin ~17.5%+). ' +
        'Recovery expected through 2H 2026 as international markets (ex-Middle East) improve.',
      status: 'on-track',
      budget: 150,                    // est. restructuring investment FY2026
      spent: 37,                      // Q1 2026 restructuring charges [CITED:10Q-Q1-26]
      progress: 25,
      milestones: [
        { name: 'Q1 2026 OFSE margin 17.5% despite volume decline', date: '2026-03-31', status: 'completed' },
        { name: 'Q2 2026 OFSE EBITDA ≥$580M guidance', date: '2026-06-30', status: 'in-progress' },
        { name: 'Full-year OFSE EBITDA ≥$2.325B guidance', date: '2026-12-31', status: 'in-progress' },
        { name: 'OFSE margin ≥18% sustained', date: '2027-06-30', status: 'planned' },
      ],
      kpis: [
        { label: 'OFSE EBITDA Margin', target: '≥17.5%', actual: '17.5% (Q1 2026)', status: 'good' },
        { label: 'OFSE Q1 2026 vs Guidance', target: '≥$560M', actual: '$565M', status: 'good' },
        { label: 'Cost Savings from Restructuring', target: '$100M+ FY2026', actual: 'Phase 1 underway', status: 'good' },
      ],
    },
    {
      id: 'capital-returns',
      name: 'Capital Returns — Dividend & Balance Sheet Discipline',
      description:
        'Baker Hughes maintains a stable quarterly dividend of $0.23/share ($0.92 annualized). ' +
        'No share buybacks in Q1 2026 as capital is being conserved for Chart acquisition. ' +
        'Post-Chart close, the capital allocation priority order: ' +
        '(1) Integration and synergy investment, (2) Deleveraging to ~2.0x, ' +
        '(3) Resume dividend growth, (4) Evaluate buyback reinstatement. ' +
        'Remaining buyback authorization: ~$1.35B. ' +
        'Portfolio divestiture proceeds (~$3B FY2026) provide meaningful offset to Chart consideration.',
      status: 'on-track',
      budget: 0,
      spent: 0,
      progress: 100,
      milestones: [
        { name: 'Q1 2026 dividend $0.23/share paid', date: '2026-03-31', status: 'completed' },
        { name: 'Chart acquisition close — leverage ~2.0x', date: '2026-06-30', status: 'in-progress' },
        { name: 'Post-close deleveraging toward 1.5x', date: '2027-12-31', status: 'planned' },
        { name: 'Buyback authorization — evaluate post-2.0x', date: '2027-06-30', status: 'planned' },
      ],
      kpis: [
        { label: 'Quarterly Dividend Per Share', target: '$0.23', actual: '$0.23', status: 'good' },
        { label: 'Pre-Close Net Debt / EBITDA', target: '<0.5x', actual: '0.3x', status: 'good' },
        { label: 'Buyback Authorization Remaining', target: '$1.35B', actual: '$1.35B available', status: 'good' },
      ],
    },
  ],

  risks: [
    {
      id: 'chart-integration-risk',
      category: 'Acquisition',
      title: 'Chart Industries Acquisition — Integration & Execution Risk',
      description:
        'Chart acquisition is BKR\'s largest-ever ($13.6B EV). Integration of a large, multi-product industrial ' +
        'equipment manufacturer into IET creates significant operational complexity. ' +
        'Chart has manufacturing in 40+ countries and a diverse product portfolio (LNG equipment, industrial gas, hydrogen, clean energy). ' +
        'Post-close leverage ~2.0x vs 0.3x pre-close — meaningful step-up in financial risk.',
      severity: 'high',
      likelihood: 'medium',
      impact:
        'Synergy shortfall could delay deleveraging. Customer disruption during integration. ' +
        'Regulatory conditions (asset disposals) could reduce deal value. ' +
        'Working capital absorption of Chart\'s progress payments/deferred income could strain FCF.',
      mitigation:
        'Dedicated integration management office. Chart management retained post-close. ' +
        'Conservative Year 1 synergy targets to allow execution headroom. ' +
        'Phased integration — financial and IT systems after operational stabilization. ' +
        '$3B portfolio proceeds (Waygate, HMH IPO) provide deleveraging offset.',
      owner: 'Ahmed Moghal (CFO)',
    },
    {
      id: 'middle-east-geopolitical',
      category: 'Geopolitical',
      title: 'Middle East Conflict & OFSE Revenue Headwinds',
      description:
        'Disruptions around the Strait of Hormuz and regional conflicts contributed to a $267M decline ' +
        'in OFSE international revenue Q1 2026 (Middle East/Asia -20% YoY). ' +
        'BKR\'s OFSE segment generates ~36% of revenue from Middle East/Asia — highest geographic concentration.',
      severity: 'high',
      likelihood: 'high',
      impact:
        'Continued Middle East disruption could reduce OFSE EBITDA below $2.325B FY2026 guidance. ' +
        'Saudi Aramco and ADNOC project timing uncertainty. ' +
        'Tighter oil/LNG balances support commodity prices (IET tailwind) but reduce upstream spending (OFSE headwind).',
      mitigation:
        'Geographic diversification — Latin America growing (+$32M Q1 2026). ' +
        'International markets ex-Middle East improving (North America rig count + Africa). ' +
        'Cost-out initiatives protect EBITDA margins despite revenue softness. ' +
        'OFSE revenue mix shifting toward more resilient production/services vs drilling.',
      owner: 'Lorenzo Simonelli (CEO)',
    },
    {
      id: 'oil-price-sensitivity',
      category: 'Market',
      title: 'Oil Price Decline — OFSE Capital Spending Risk',
      description:
        'OFSE revenues are correlated to E&P capital spending which is driven by oil price expectations. ' +
        'Brent was $80.72/bbl Q1 2026 vs $75.87 Q1 2025. ' +
        'If oil falls below ~$65/bbl, E&P companies typically cut discretionary upstream spending, ' +
        'disproportionately impacting drilling (Well Construction, CIM) vs production services.',
      severity: 'high',
      likelihood: 'medium',
      impact:
        'Every $10/bbl decline in Brent ≈ -3–5% OFSE revenue. ' +
        'North America rig count already down 7% YoY in Q1 2026 with Brent at $80/bbl. ' +
        'International rig counts (+20% YoY) are more resilient to oil price than N. America.',
      mitigation:
        'IET (50% of revenue) is largely insulated from oil prices — LNG infrastructure demand driven by energy security/LNG contracts. ' +
        'OFSE production services (PS, SSPS) are more resilient than drilling (WC, CIM) as operators focus on optimizing existing production. ' +
        'Leucipa digital platform creates switching costs in production operations.',
      owner: 'Ahmed Moghal (CFO)',
    },
    {
      id: 'lng-buildout-timing',
      category: 'Market',
      title: 'LNG Project FID Risk — IET Order Pipeline',
      description:
        'IET\'s long-cycle GTE orders depend on LNG project Final Investment Decisions (FIDs) by IOCs and NOCs. ' +
        'If LNG FIDs are delayed by macro uncertainty, tariffs, or permitting issues, ' +
        'IET order intake could slow and RPO growth could plateau. ' +
        'US LNG export permitting (DOE, FERC) adds uncertainty for Gulf Coast projects.',
      severity: 'medium',
      likelihood: 'medium',
      impact:
        'IET order growth could slow below guidance ≥$14.5B FY2026 if 2–3 major LNG FIDs slip to 2027. ' +
        'RPO could flatten vs record $33.1B Q1 2026 trajectory. ' +
        'However, existing RPO provides multi-year revenue coverage even without new orders.',
      mitigation:
        'Diversified geographic LNG pipeline (Middle East, Africa, Asia-Pacific, Europe). ' +
        'Non-LNG IET demand growing (data center power, industrial compression, CTS). ' +
        'Chart acquisition adds cryogenic and FSRU equipment to broaden IET LNG portfolio. ' +
        'GTS services revenue highly recurring from installed base (not dependent on new FIDs).',
      owner: 'Lorenzo Simonelli (CEO)',
    },
    {
      id: 'aeroderivative-supply-chain',
      category: 'Operations',
      title: 'Aeroderivative Supply Chain Tightness',
      description:
        'Extended lead times in the aeroderivative supply chain (per Q1 2026 10-Q management commentary) ' +
        'create risk of delivery delays for CTS and GTE equipment. ' +
        'Aero JV with GE Vernova supplies BKR with aeroderivative engines for industrial and data center power applications. ' +
        'CTS orders $1.26B Q1 2026 implies significant future delivery obligations.',
      severity: 'medium',
      likelihood: 'high',
      impact:
        'Revenue recognition delays if equipment deliveries slip quarters. ' +
        'Customer satisfaction risk on data center power project timelines. ' +
        'Potential for liquidated damages on fixed-delivery contracts.',
      mitigation:
        'Long-term supply agreements with GE Vernova Aero JV. ' +
        'Extended booking lead times factored into project schedules. ' +
        'Manufacturing capacity investments at BKR facilities. ' +
        'Pricing reflecting supply tightness — protects margins.',
      owner: 'Ahmed Moghal (CFO)',
    },
    {
      id: 'post-chart-leverage',
      category: 'Financial',
      title: 'Post-Chart Leverage & Refinancing Risk',
      description:
        'Chart acquisition raises gross debt to ~$16.2B (Q1 2026) with additional Chart debt to be assumed. ' +
        'Post-close net leverage expected ~2.0x Net Debt/Adj. EBITDA. ' +
        'Next debt maturity: $600M 2.06% Senior Notes due December 2026. ' +
        'Interest expense ~$145M per quarter (Q1 2026 net: $86M). ' +
        'Rising interest rates could increase refinancing costs on floating rate exposures.',
      severity: 'medium',
      likelihood: 'low',
      impact:
        'Rating agency downgrade if integration underperforms and FCF is below expectations. ' +
        'Higher interest cost on $600M Dec 2026 maturity refinancing in elevated rate environment. ' +
        'Limited capacity for additional M&A until leverage reduces to <1.5x.',
      mitigation:
        'Investment-grade credit ratings maintained. $3.0B revolving credit facility (undrawn, Nov 2028). ' +
        'Portfolio proceeds ($3B FY2026) partially offset acquisition cost. ' +
        'IET EBITDA growth provides natural deleveraging. ' +
        'No mandatory redemption on most notes unless Chart deal not completed.',
      owner: 'Ahmed Moghal (CFO)',
    },
  ],

  forwardOutlook: [
    {
      period: 'Q2 FY26',
      revenueForcast: 6.5,             // Q2 2026 guidance ~$6.5B [CITED:EC-Q1-26]
      revenuePlan: 6.4,
      marginForecast: 17.4,            // Q2 2026 Adj. EBITDA guidance ~$1.13B / $6.5B revenue [DERIVED]
      marginPlan: 17.5,
      keyAssumptions: [
        'Q2 2026 total revenue ~$6.5B (guidance)',
        'Q2 2026 Adj. EBITDA ~$1.13B (guidance)',
        'Chart Industries acquisition expected to close in Q2 2026',
        'IET orders sustaining >$4B/quarter on LNG and data center pipeline',
        'OFSE recovery in international markets ex-Middle East',
        'Waygate Technologies sale to Hexagon expected H2 2026',
      ],
    },
    {
      period: 'Q3 FY26',
      revenueForcast: 7.0,
      revenuePlan: 6.8,
      marginForecast: 18.0,
      marginPlan: 17.8,
      keyAssumptions: [
        'Chart Industries fully consolidated — adds ~$1B+ quarterly revenue to IET',
        'IET EBITDA margin expansion from Chart synergies beginning',
        'OFSE stabilization as Middle East conflict impact moderates',
        'CTS backlog ($1.26B Q1 orders) beginning to convert to revenue',
        'Waygate close proceeds (~$1.45B) received and applied to Chart debt reduction',
        'FY2026 IET EBITDA ≥$2.7B guidance on track',
      ],
    },
    {
      period: 'Q4 FY26',
      revenueForcast: 7.2,
      revenuePlan: 7.0,
      marginForecast: 18.5,
      marginPlan: 18.0,
      keyAssumptions: [
        'Chart integration progressing — Year 1 synergies beginning to materialize',
        'IET RPO potentially exceeding $35B with Chart contribution',
        'OFSE year-end seasonal strength in equipment delivery',
        'HMH IPO proceeds received (OFSE equipment JV)',
        'Net leverage reduction toward 1.7x as FCF and divestiture proceeds accumulate',
        'FY2026 OFSE EBITDA ≥$2.325B guidance achievable',
      ],
    },
    {
      period: 'FY26',
      revenueForcast: 27.5,            // FY2026 est.: Q1 $6.6B + Chart from Q3 + organic growth [ASSUMED]
      revenuePlan: 26.5,
      marginForecast: 18.0,
      marginPlan: 17.8,
      keyAssumptions: [
        'IET orders ≥$14.5B (FY2026 guidance)',
        'IET Adj. EBITDA ≥$2.7B (FY2026 guidance)',
        'OFSE Adj. EBITDA ≥$2.325B (FY2026 guidance)',
        'Chart close adds ~$5–6B annualized revenue (H2 contribution)',
        'Portfolio proceeds ~$3B (PSI, SPC, Waygate, HMH)',
        'Net leverage ~1.7–2.0x by year-end 2026',
      ],
    },
    {
      period: 'Q1 FY27',
      revenueForcast: 8.0,
      revenuePlan: 7.5,
      marginForecast: 19.0,
      marginPlan: 18.5,
      keyAssumptions: [
        'First full year with Chart fully consolidated in IET',
        'IET revenue run-rate >$5B/quarter with Chart contribution',
        'Chart Year 1 synergies fully recognized (~$100–150M run-rate)',
        'OFSE organic growth returning to positive YoY as Middle East stabilizes',
        'CTS growing toward $1B+ annual revenue ex-Chart',
        'Net leverage <1.5x trajectory as FCF exceeds capex + dividends',
      ],
    },
    {
      period: 'Q2 FY27',
      revenueForcast: 8.5,
      revenuePlan: 8.0,
      marginForecast: 19.5,
      marginPlan: 19.0,
      keyAssumptions: [
        'IET RPO potentially exceeding $40B Horizon 2 target (with Chart)',
        'GTS long-term services agreements from growing GTE installed base',
        'OFSE Production Solutions benefiting from Leucipa digital adoption',
        'Chart Year 2 synergies accelerating ($200M+ run-rate)',
        'Buyback program consideration if leverage <1.5x on track',
        'BKR positioned as full-spectrum energy technology company',
      ],
    },
  ],

  keyOpportunities: [
    {
      title: 'LNG Supercycle — GTE Order Pipeline >$15B',
      revenueImpact: '+$4B IET revenue/yr',
      description:
        'Global LNG demand is expected to grow 50% by 2040. Baker Hughes is the leading supplier of LNG ' +
        'liquefaction compression and turbomachinery. Each large-scale LNG train can represent $300–800M in GTE orders. ' +
        'Energy security focus post-Ukraine war is accelerating FIDs in Middle East, Africa, and US Gulf Coast. ' +
        'IET RPO $33.1B provides multi-year revenue visibility from this cycle.',
      timeline: 'FY2026–FY2030',
    },
    {
      title: 'Data Center Power — CTS Aeroderivative Turbines',
      revenueImpact: '+$2B CTS revenue/yr',
      description:
        'AI-driven data center expansion is creating unprecedented demand for on-site power generation. ' +
        'BKR\'s aeroderivative gas turbines (via GE Vernova Aero JV) provide fast-starting, ' +
        'fuel-flexible power for hyperscaler and colocation facilities. ' +
        'CTS orders $1.26B in Q1 2026 alone — this market is accelerating rapidly. ' +
        'Each large data center campus can require 100–300MW of on-site generation.',
      timeline: 'FY2026–FY2029',
    },
    {
      title: 'Chart Industries Synergies — IET Margin Expansion',
      revenueImpact: '+$300M EBITDA',
      description:
        'Chart Industries adds scale and complementary cryogenic equipment to IET. ' +
        'Cost synergies: procurement scale, shared manufacturing, G&A elimination. ' +
        'Revenue synergies: cross-sell into BKR\'s global LNG customer base, aftermarket expansion. ' +
        'Year 1 synergies expected ~$100M; Year 3 run-rate ~$300M+.',
      timeline: 'FY2027–FY2029',
    },
    {
      title: 'GTS Services Growth — Installed Base Expansion',
      revenueImpact: '+$1.5B GTS revenue/yr',
      description:
        'Gas Technology Services (GTS) revenue grows as the GTE installed base expands. ' +
        'Long-term service agreements (LTSAs) on LNG compression trains and aeroderivative turbines ' +
        'provide highly recurring, high-margin revenue. GTS Q1 2026 +34% YoY to $791M. ' +
        'As new LNG trains from current RPO are commissioned through 2028–2030, GTS revenue inflects upward.',
      timeline: 'FY2026–FY2030',
    },
    {
      title: 'Leucipa Digital Platform — Production Optimization',
      revenueImpact: '+$500M OFSE digital revenue',
      description:
        'Leucipa is Baker Hughes\'s AI-enabled autonomous production optimization platform. ' +
        'Creates switching costs and recurring SaaS-like revenue in OFSE Production Solutions. ' +
        'Opportunity to monetize BKR\'s proprietary data from >100,000 wells and millions of sensor data points. ' +
        'Digital revenue typically carries higher margins than equipment and services.',
      timeline: 'FY2026–FY2028',
    },
  ],
};
