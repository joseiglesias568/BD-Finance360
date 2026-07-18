// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/strategic.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:Press-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Becton, Dickinson and Company public disclosures: Form 10-K (FY2025); Form
// 10-Q (Q1 2026); Q1 2026 earnings transcript; FY2026 guidance (April
// 2026 earnings call).
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { StrategicConfig } from '../../types';

export const strategic: StrategicConfig = {
  initiatives: [
    {
      id: 'frontier-integration',
      name: 'Frontier Acquisition Integration',
      description:
        'Largest acquisition in Verizon history ($20B cash, closed January 22, 2026). ' +
        'Added ~25M fiber passings, ~10M broadband subscribers, and operations in 31 states + DC. ' +
        'Expands Verizon\'s total fiber footprint from ~9 states to coast-to-coast. ' +
        'Year 1 synergy target ~$500M; full run-rate ~$1.5B by Year 3. Cross-sell wireless → fiber unlocked.',
      status: 'on-track',
      budget: 20000,                  // $20B acquisition price
      spent: 20000,                   // closed Jan 22, 2026
      progress: 15,                   // integration work in early stages
      milestones: [
        { name: 'Acquisition close', date: '2026-01-22', status: 'completed' },
        { name: 'Network integration — OSS/BSS systems', date: '2026-09-30', status: 'in-progress' },
        { name: 'Year 1 cost synergies $500M run-rate', date: '2026-12-31', status: 'in-progress' },
        { name: 'Consumer rebranding Frontier → Fios', date: '2027-03-31', status: 'planned' },
        { name: 'Full run-rate synergies $1.5B', date: '2029-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'Fiber Passings Added', target: '25M', actual: '25M (at close)', status: 'good' },
        { label: 'Q1 2026 Incremental Revenue', target: '$1.4B annualized', actual: '~$1.4B run-rate', status: 'good' },
        { label: 'Integration Milestones on Schedule', target: 'Q3 2026', actual: 'On track', status: 'good' },
      ],
    },
    {
      id: 'fwa-expansion',
      name: 'Fixed Wireless Access (FWA) Expansion',
      description:
        'FWA (Verizon Home Internet) is the fastest-growing segment. Target 700K–800K net adds in FY2026, ' +
        'reaching ~6.5M total subs by year-end. Long-term target 10M+ by 2028. ' +
        'Primarily serves rural and suburban markets underserved by fiber. C-Band mid-band network is the key enabler. ' +
        'Revenue per sub ~$50–55/mo; gross margins >40% with minimal incremental capex.',
      status: 'on-track',
      budget: 2500,                   // est. incremental network capex for FWA coverage expansion
      spent: 800,
      progress: 55,
      milestones: [
        { name: 'FWA 5M subscribers milestone', date: '2025-12-31', status: 'completed' },
        { name: 'FWA Q1 2026 net adds +339K', date: '2026-03-31', status: 'completed' },
        { name: 'FY2026 target 700K–800K net adds', date: '2026-12-31', status: 'in-progress' },
        { name: 'FWA 8M subscribers', date: '2027-12-31', status: 'planned' },
        { name: 'FWA 10M+ subscribers', date: '2028-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'Q1 2026 Net Adds', target: '300K', actual: '+339K', status: 'good' },
        { label: 'Total FWA Subs', target: '5.5M', actual: '5.7M', status: 'good' },
        { label: 'FWA Revenue per Sub', target: '$52/mo', actual: '~$50/mo', status: 'warning' },
      ],
    },
    {
      id: 'cband-densification',
      name: 'C-Band 5G Network Densification',
      description:
        'Verizon holds the largest C-Band spectrum position in the US (~$45B investment in Auction 107). ' +
        'C-Band densification (adding small cells and upgrading macro towers to full power C-Band) is the ' +
        'primary network investment priority for 2026–2028. Target: ~90% US population coverage by FY2026. ' +
        'C-Band enables Verizon Home FWA quality improvement, premium 5G UW products, and private network business.',
      status: 'on-track',
      budget: 12000,                  // est. remaining C-Band densification capex 2026–2028
      spent: 3500,
      progress: 70,                   // C-Band initial deployment mostly complete; densification ongoing
      milestones: [
        { name: 'C-Band initial deployment ~75% pop coverage', date: '2025-12-31', status: 'completed' },
        { name: 'C-Band 90% pop coverage target', date: '2026-12-31', status: 'in-progress' },
        { name: 'FWA quality parity with fiber in key markets', date: '2027-06-30', status: 'planned' },
        { name: 'C-Band full-power nationwide', date: '2028-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'C-Band Population Coverage', target: '90%', actual: '~75%', status: 'warning' },
        { label: 'vs T-Mobile Mid-Band Coverage', target: 'Close gap to <15 pts', actual: '~20 pts behind', status: 'warning' },
        { label: 'FWA Eligible Households', target: '50M+', actual: '~40M', status: 'warning' },
      ],
    },
    {
      id: 'ai-cost-transformation',
      name: 'AI-Driven Cost Efficiency & Network Automation',
      description:
        'Multi-year program to reduce OpEx by $1B+ by 2028 through AI and automation. ' +
        'Phase 1 (2026): Network operations automation (field dispatch reduction, predictive maintenance); ' +
        'Customer care (AI chatbot deflecting 30%+ contacts); BSS/OSS modernization. ' +
        'Phase 2 (2027–2028): Frontier network integration automation; workforce optimization; ' +
        'AI-driven marketing (personalized offers, churn prediction).',
      status: 'on-track',
      budget: 800,                    // est. transformation investment
      spent: 180,
      progress: 20,
      milestones: [
        { name: 'AI customer care deflection — Phase 1 launch', date: '2026-03-31', status: 'completed' },
        { name: 'Network automation Phase 1 ($200M OpEx savings)', date: '2026-12-31', status: 'in-progress' },
        { name: 'Frontier BSS/OSS integration AI tooling', date: '2027-03-31', status: 'planned' },
        { name: '$1B+ run-rate OpEx savings target', date: '2028-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'AI Care Deflection Rate', target: '30%', actual: '~20% (Phase 1)', status: 'warning' },
        { label: '2026 OpEx Savings Target', target: '$200M', actual: 'On track', status: 'good' },
        { label: 'Long-Term Savings Target', target: '$1B+ by 2028', actual: 'Phase 1 underway', status: 'good' },
      ],
    },
    {
      id: 'debt-reduction',
      name: 'Deleveraging — Post-Frontier Balance Sheet Repair',
      description:
        'Verizon entered 2026 with net leverage ~2.5x Net Debt/EBITDA post-Frontier close ($20B cash acquisition). ' +
        'FY2026 target: reduce to ≤2.25x through FCF allocation. No share buybacks until leverage target met. ' +
        'FY2026 FCF guidance ≥$21.5B provides primary deleveraging capacity. ' +
        'Rating agencies (Baa1/BBB+) are stable; investment-grade profile maintained throughout.',
      status: 'on-track',
      budget: 0,
      spent: 0,
      progress: 30,
      milestones: [
        { name: 'Post-Frontier leverage 2.5x (Q1 2026)', date: '2026-03-31', status: 'completed' },
        { name: 'Year-end 2026 leverage ≤2.25x target', date: '2026-12-31', status: 'in-progress' },
        { name: 'Year-end 2027 leverage ≤2.0x target', date: '2027-12-31', status: 'planned' },
        { name: 'Buyback authorization re-initiation (post-leverage target)', date: '2027-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'Net Debt / Adj. EBITDA', target: '≤2.25x by Dec 2026', actual: '~2.5x (Q1 2026)', status: 'warning' },
        { label: 'FY2026 FCF', target: '≥$21.5B', actual: 'On track', status: 'good' },
        { label: 'Investment-Grade Rating', target: 'Maintain Baa1/BBB+', actual: 'Maintained', status: 'good' },
      ],
    },
    {
      id: 'shareholder-returns',
      name: 'Progressive Dividend & Shareholder Returns',
      description:
        'Verizon has increased its dividend for 18 consecutive years (longest streak among S&P 500 telecom companies). ' +
        'FY2026 annual dividend ~$2.71/share (~6.5% yield). ' +
        'No share buybacks until leverage ≤2.25x target is met. ' +
        'Post-deleveraging: management has signaled buyback authorization would be considered. ' +
        'Dividend payout ratio ~55% of adj. EPS — sustainable at current earnings level.',
      status: 'on-track',
      budget: 0,
      spent: 0,
      progress: 100,
      milestones: [
        { name: '18th consecutive annual dividend increase', date: '2026-01-01', status: 'completed' },
        { name: 'FY2026 dividend $2.71/share paid', date: '2026-12-31', status: 'in-progress' },
        { name: 'Leverage target met — evaluate buybacks', date: '2027-06-30', status: 'planned' },
      ],
      kpis: [
        { label: 'Annual Dividend Per Share', target: '$2.77', actual: '$2.71', status: 'good' },
        { label: 'Dividend Yield', target: '>6%', actual: '~6.5%', status: 'good' },
        { label: 'Payout Ratio', target: '<60%', actual: '~55%', status: 'good' },
      ],
    },
  ],

  risks: [
    {
      id: 'tmobile-competition',
      category: 'Competitive',
      title: 'T-Mobile Pricing & Coverage Competition',
      description:
        'T-Mobile has ~95% mid-band 5G coverage vs Verizon ~75%. ' +
        'Consistently leading in postpaid phone net adds (~1.3M Q1 2026 vs Verizon +55K). ' +
        'Aggressive Un-carrier value pricing forces Verizon to match promotions, pressuring ARPA.',
      severity: 'high',
      likelihood: 'high',
      impact:
        'Churn risk if C-Band gap not closed. ARPA expansion limited by competitive promotions. ' +
        'FWA market share risk as T-Mobile FWA (~7M subs) exceeds Verizon (~5.7M) and growing faster.',
      mitigation:
        'C-Band densification to 90% pop coverage by year-end 2026. myPlan premium tier retention. ' +
        'Frontier fiber cross-sell as superior product in legacy Frontier footprint. ' +
        'Enterprise/private network differentiation where T-Mobile is weaker.',
      owner: 'Tony Skiadas (CFO)',
    },
    {
      id: 'frontier-integration-risk',
      category: 'Operations',
      title: 'Frontier Integration Execution Risk',
      description:
        'Complex OSS/BSS integration across 31 states + DC with target Q3 2026 system migration. ' +
        'Customer experience risk during re-branding from Frontier to Fios. ' +
        'Synergy timing dependent on successful technical integration.',
      severity: 'high',
      likelihood: 'medium',
      impact:
        'Synergy delays could reduce FY2026 FCF by $200–500M. Customer churn during re-brand. ' +
        'Regulatory scrutiny in California CPUC (separate fiber regulatory environment).',
      mitigation:
        'Dedicated integration management office. Phased migration approach (systems before brand). ' +
        'Frontier management retained for regional operational continuity. ' +
        'Year 1 synergy target $500M is conservative to allow execution headroom.',
      owner: 'Hans Vestberg (CEO)',
    },
    {
      id: 'mvno-dependency',
      category: 'Revenue Concentration',
      title: 'Charter/Comcast MVNO Dependency',
      description:
        'Spectrum Mobile (~10M lines) and Xfinity Mobile (~7M lines) run on Verizon\'s network as MVNOs. ' +
        'Charter+Cox merger pending (California CPUC, deadline Sep 15, 2026). ' +
        'Combined entity (~17M MVNO lines on Verizon) could seek new network partner or build own.',
      severity: 'medium',
      likelihood: 'low',
      impact:
        'Loss of MVNO revenue could be $1–2B annually. However, MVNO contract terms provide multi-year protection. ' +
        'Competitive risk is more likely to materialize in 2028–2030 renewal cycle.',
      mitigation:
        'Long-term MVNO agreements in place. Network quality is primary retention factor — C-Band investments reinforce this. ' +
        'Verizon\'s network remains preferred for cable MVNO performance vs T-Mobile/AT&T alternatives.',
      owner: 'Tony Skiadas (CFO)',
    },
    {
      id: 'leverage-and-rates',
      category: 'Financial',
      title: 'High Leverage in Rising Rate Environment',
      description:
        'Post-Frontier net leverage ~2.5x with ~$145B gross debt. ' +
        'Interest expense ~$5.8B annually. ' +
        'If interest rates remain elevated or FCF misses guidance, deleveraging timeline extends.',
      severity: 'medium',
      likelihood: 'medium',
      impact:
        'Rating agency downgrade risk if leverage >2.7x. Higher refinancing costs on upcoming debt maturities. ' +
        'Reduced financial flexibility for further M&A or buybacks.',
      mitigation:
        'FCF guidance ≥$21.5B provides meaningful annual debt reduction capacity. ' +
        'No buybacks until 2.25x target achieved. Long average debt maturity profile (~12 years). ' +
        'Investment-grade ratings (Baa1/BBB+) maintained throughout Frontier integration.',
      owner: 'Tony Skiadas (CFO)',
    },
    {
      id: 'spectrum-regulation',
      category: 'Regulatory',
      title: 'Spectrum Policy & 6 GHz / UHF Auction Risk',
      description:
        'FCC spectrum auctions determine future C-Band and mid-band capacity. ' +
        '6 GHz lower band (potential new Wi-Fi vs licensed mobile allocation) decision pending. ' +
        'CBRS (3.5 GHz) shared spectrum rules affect private network business model.',
      severity: 'low',
      likelihood: 'medium',
      impact:
        'Adverse spectrum allocation could limit Verizon capacity advantage. ' +
        'C-Band investment moat could be partially eroded if competitors acquire comparable spectrum.',
      mitigation:
        'Active FCC advocacy. Existing C-Band position is largest in US — significant lead even if allocation changes. ' +
        'Private network growth leverages licensed spectrum (not shared) for enterprise clients.',
      owner: 'Hans Vestberg (CEO)',
    },
    {
      id: 'cyber-network-resilience',
      category: 'Technology',
      title: 'Cybersecurity & Critical Infrastructure Risk',
      description:
        'As critical national infrastructure, Verizon\'s network is a high-value target for nation-state and criminal actors. ' +
        'Chinese telecom equipment exposure risk (FCC legacy equipment removal ongoing). ' +
        'Salt Typhoon (Chinese state-actor) intrusions reported at US carriers in 2024–2025.',
      severity: 'high',
      likelihood: 'medium',
      impact:
        'Major network outage or data breach could impact millions of customers. ' +
        'FCC mandated Chinese equipment removal ($1–2B+ industry cost). ' +
        'Reputational and regulatory exposure.',
      mitigation:
        'NIST cybersecurity framework implementation. Active FCC/CISA partnership. ' +
        'Network segmentation and zero-trust architecture rollout. ' +
        'Ongoing removal of Huawei/ZTE equipment under FCC program.',
      owner: 'Kyle Malady (CTO)',
    },
  ],

  forwardOutlook: [
    {
      period: 'Q2 FY26',
      revenueForcast: 34.8,            // est. — +1.5% YoY on Q2 FY25
      revenuePlan: 34.5,
      marginForecast: 39.0,            // adj. EBITDA margin est.
      marginPlan: 39.0,
      keyAssumptions: [
        'Wireless service revenue +2.0–2.8% YoY (FY2026 guidance on track)',
        'Frontier first full quarter — integration milestones on schedule',
        'FWA net adds ~175K–200K (Q2 seasonally strong)',
        'CapEx ~$4.5B (full year guidance $17.5B–$18.5B)',
        'FCF on track for ≥$21.5B full-year guidance',
        'Leverage reduction from $21.5B FCF minus dividends (~$11B)',
      ],
    },
    {
      period: 'Q3 FY26',
      revenueForcast: 35.2,
      revenuePlan: 35.0,
      marginForecast: 39.5,
      marginPlan: 39.5,
      keyAssumptions: [
        'C-Band densification completing — FWA quality improving in key markets',
        'Back-to-school device upgrade cycle supporting equipment revenue',
        'Frontier network integration OSS/BSS milestone Q3 target',
        'Business segment private network pipeline converting to revenue',
        'Wireless service revenue sustaining 2.5%+ YoY growth momentum',
        'AI OpEx savings Phase 1 fully realized (~$50M quarterly run-rate)',
      ],
    },
    {
      period: 'Q4 FY26',
      revenueForcast: 35.5,
      revenuePlan: 35.3,
      marginForecast: 40.0,
      marginPlan: 40.0,
      keyAssumptions: [
        'Holiday device upgrade cycle — premium 5G handsets (iPhone 18 cycle)',
        'Leverage target ≤2.25x expected to be met by year-end',
        'Frontier integration Year 1 synergy run-rate $500M achieved',
        'FY2026 FWA net adds 700K–800K guidance achievable',
        'Annual dividend increase #19 — expected January 2027',
        'Potential buyback announcement if leverage target met ahead of schedule',
      ],
    },
    {
      period: 'FY26',
      revenueForcast: 138.0,           // analyst consensus ~$138B
      revenuePlan: 137.5,
      marginForecast: 39.3,
      marginPlan: 39.5,
      keyAssumptions: [
        'Wireless service revenue growth +2.0–2.8% (FY2026 guidance)',
        'Adjusted EPS $4.95–$4.99 (FY2026 guidance)',
        'FCF ≥$21.5B (FY2026 guidance)',
        'CapEx $17.5B–$18.5B (FY2026 guidance)',
        'Frontier accretive from Day 1; $500M synergy run-rate by year-end',
        'Net leverage ≤2.25x by year-end 2026',
      ],
    },
    {
      period: 'Q1 FY27',
      revenueForcast: 35.5,
      revenuePlan: 35.0,
      marginForecast: 40.0,
      marginPlan: 39.5,
      keyAssumptions: [
        'Wireless service revenue sustaining 2.5%+ YoY as ARPA expands',
        'Frontier rebranding Frontier → Fios completed; cross-sell ramp accelerating',
        'FWA toward 8M subs; product quality parity with fiber established',
        'AI OpEx savings Phase 2 underway — $400M+ annual run-rate expected',
        'Leverage ≤2.0x; buyback program initiated if ahead of plan',
        'FY2027 adj. EPS consensus ~$5.15 (implied +3% YoY)',
      ],
    },
    {
      period: 'Q2 FY27',
      revenueForcast: 36.0,
      revenuePlan: 35.5,
      marginForecast: 40.5,
      marginPlan: 40.0,
      keyAssumptions: [
        'Verizon Home (FWA + Fios) approaching 18M total broadband subs',
        'C-Band densification fully complete — national FWA coverage maximized',
        'Enterprise private network revenue $1B+ annual run-rate achieved',
        'AI savings program at $600M+ annual run-rate',
        'Spectrum leadership advantage compounding as competitors play catch-up',
        'ROIC improving toward 10%+ as leverage decreases and EBITDA grows',
      ],
    },
  ],

  keyOpportunities: [
    {
      title: 'Frontier Cross-Sell: Wireless → Fiber Bundle',
      revenueImpact: '+$2B',
      description:
        'Frontier customer base (~10M subs) has significantly lower wireless penetration than legacy Verizon Fios territory. ' +
        'Cross-sell of Verizon wireless to existing Frontier fiber broadband customers is the largest near-term revenue opportunity. ' +
        'Bundle pricing creates churn protection for both services.',
      timeline: 'FY2026–FY2028',
    },
    {
      title: 'FWA Expansion to 10M+ Subscribers',
      revenueImpact: '+$1.2B',
      description:
        'Each 1M incremental FWA subscribers at ~$50/mo ARPU = ~$600M annualized revenue. ' +
        'Path to 10M+ subs by 2028 represents ~$2.5B cumulative revenue vs current $3.4B base. ' +
        'Gross margins on FWA >40% with minimal incremental capex after C-Band sunk cost.',
      timeline: 'FY2026–FY2028',
    },
    {
      title: 'Enterprise Private Networks',
      revenueImpact: '+$1B+',
      description:
        'Verizon\'s $1B+ private network pipeline (CBRS + C-Band) for manufacturing, logistics, healthcare. ' +
        'Industry 4.0 factory automation, hospital campus networks, smart ports. ' +
        'Average deal size $5–20M — high margin, long contract terms.',
      timeline: 'FY2026–FY2029',
    },
    {
      title: 'AI Cost Savings $1B+ by 2028',
      revenueImpact: '+$1B EBITDA',
      description:
        'Network automation, AI customer care, and BSS/OSS transformation. ' +
        'Every $100M OpEx reduction = ~15bps adj. EBITDA margin improvement. ' +
        '$1B savings by 2028 = ~150bps EBITDA margin expansion from cost base alone.',
      timeline: 'FY2026–FY2028',
    },
    {
      title: 'Frontier Synergy Realization $1.5B Run-Rate',
      revenueImpact: '+$1.5B EBITDA',
      description:
        'Cost synergies from network integration, procurement scale, and G&A consolidation. ' +
        'Revenue synergies from wireless/fiber bundle cross-sell. ' +
        'Year 1: $500M. Year 2: $1.0B. Year 3: $1.5B run-rate.',
      timeline: 'FY2026–FY2029',
    },
  ],
};
