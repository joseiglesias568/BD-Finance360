// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/strategic.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// BD Q1 2026 earnings call, IR slides, 10-Q, and 10-K.
// Five strategic imperatives per CEO Joyner (Q1 2026 call).
// ─────────────────────────────────────────────────────────────────────
import { StrategicConfig } from '../../types';

export const strategic: StrategicConfig = {
  initiatives: [
    {
      id: 'health100-platform',
      name: 'Health100 — AI-Native Consumer Engagement Platform',
      description:
        'Health100 is BD\'s AI-native technology and service platform launching H2 2026. ' +
        'Any payer, PBM, pharmacy or provider can connect to the platform. ' +
        'Designed to be the consumer\'s front door to fully integrated health care regardless of the banner ' +
        'on their pharmacy or brand of their benefit card. ' +
        'BD scale, consumer trust, and position in the health care system differentiates the company. ' +
        'Few companies have the reach, data and engagement points with consumers necessary to bring a platform ' +
        'like this to market in a way that benefits consumers, clients, and the broader health care system. ' +
        'Three AI buckets: (1) cost structure/efficiency, (2) workflow improvement for colleagues, ' +
        '(3) consumer engagement and navigation (Informed Choice, Smart Compare, Care Pathways). ' +
        'Showcased to 500 largest Caremark clients at client forum — client response: "What took you so long?"',
      status: 'on-track',
      budget: 3500,                   // est. annual technology investment [ASSUMED]
      spent: 875,                     // est. Q1 2026 technology investment [ASSUMED]
      progress: 55,
      milestones: [
        { name: 'Investor Day — Health100 platform announced', date: '2025-12-31', status: 'completed' },
        { name: 'Informed Choice and Smart Compare products live', date: '2026-03-31', status: 'completed' },
        { name: 'AI academy launched for Aetna leaders', date: '2026-04-30', status: 'completed' },
        { name: 'AI academy enterprise rollout to all colleagues', date: '2026-06-30', status: 'in-progress' },
        { name: 'Health100 platform launch — H2 2026', date: '2026-09-30', status: 'planned' },
        { name: 'Open platform: any payer/PBM/provider can connect', date: '2026-12-31', status: 'planned' },
        { name: 'Member engagement scale — 2027 growth target', date: '2027-03-31', status: 'planned' },
      ],
      kpis: [
        { label: 'Prior Auth Real-Time Approval', target: '>85%', actual: '>80% (Q1 2026)', status: 'good' },
        { label: 'AI Deployment Buckets Active', target: '3', actual: '3 (cost, workflow, consumer)', status: 'good' },
        { label: 'Health100 Launch Timeline', target: 'H2 2026', actual: 'On track', status: 'good' },
      ],
    },
    {
      id: 'aetna-ma-margin-recovery',
      name: 'Medicare Advantage Margin Recovery — Target 3% by 2028',
      description:
        'Multi-year program to restore Aetna Medicare Advantage margins to target 3% adjusted operating margin by 2028. ' +
        'Q1 2026 represents strong start — AOI improved >$1B YoY driven by improved underlying performance in government business. ' +
        'MBR 84.6% Q1 2026 vs 87.3% Q1 2025 — substantial improvement. Full-year MBR guidance maintained at 90.5% ±50bps ' +
        'reflecting prudent and respectful view on cost trends. ' +
        'Execution levers: disciplined AEP underwriting, improved geographic mix, product mix optimization, ' +
        'prior authorization standardization, medical cost management. ' +
        'CMS 2027 rate notice: step in right direction but still insufficient to fully offset medical cost trends. ' +
        'Company working with CMS on constructive dialogue and continued program improvement. ' +
        'Confidence in 3% target by 2028 reaffirmed on Q1 2026 earnings call. ' +
        'Aetna named inaugural Health Plan of the Year by Press Ganey.',
      status: 'on-track',
      budget: 0,                      // cost reduction program; not a capex initiative
      spent: 0,
      progress: 40,                   // year 2 of multi-year journey
      milestones: [
        { name: 'ACA individual exchange exit — membership cleanup', date: '2026-01-01', status: 'completed' },
        { name: 'Q1 2026 MBR 84.6% — strong start to recovery', date: '2026-03-31', status: 'completed' },
        { name: 'Prior auth standardization — 88% procedures (industry-leading)', date: '2026-03-31', status: 'completed' },
        { name: 'AHIP commitment: 50%+ PA volume standardized by year-end', date: '2026-12-31', status: 'in-progress' },
        { name: 'FY2026 MBR within 90.5% ±50bps guidance', date: '2026-12-31', status: 'in-progress' },
        { name: 'MA margin meaningful progress toward 3% in 2027', date: '2027-12-31', status: 'planned' },
        { name: 'MA target margin 3% achieved', date: '2028-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'Q1 2026 MBR', target: '90.5% FY', actual: '84.6% Q1 (favorable prior year dev)', status: 'good' },
        { label: 'AOI Improvement YoY', target: '+$420M FY2026 vs prior guide', actual: '+$1.05B Q1 (ahead)', status: 'good' },
        { label: 'Star Ratings Position', target: 'Leading scores for 2027 AEP', actual: 'Leading — carried into 2027', status: 'good' },
      ],
    },
    {
      id: 'biosimilar-playbook',
      name: 'Biosimilar Playbook — Stelara Exclusion & Conversion',
      description:
        'BD applying proven Humira biosimilar playbook to Stelara. ' +
        'Humira: >90% conversion achieved — majority of patients paying $0 out of pocket (frictionless experience). ' +
        'Stelara: Excluded from Caremark commercial template formularies effective July 1, 2026. ' +
        'Replaced with low-cost, effective biosimilars. Target: similar conversion rates as Humira. ' +
        'Majority of customers expected to pay $0 out of pocket for biosimilar therapy. ' +
        'Caremark fully insured Aetna business has had point-of-sale rebates for 8+ years — passing value to consumers. ' +
        'Specialty pharmacy represents ~50% of pharmacy benefit revenues — biosimilars/generics are primary value lever. ' +
        'GLP-1 category: CVS managing competition through formulary management and DTC channel strength.',
      status: 'on-track',
      budget: 0,
      spent: 0,
      progress: 30,
      milestones: [
        { name: 'Humira biosimilar conversion >90% achieved', date: '2025-12-31', status: 'completed' },
        { name: 'Stelara exclusion announcement from commercial template formularies', date: '2026-03-31', status: 'completed' },
        { name: 'Stelara exclusion effective date — biosimilar replaces brand', date: '2026-07-01', status: 'in-progress' },
        { name: 'Stelara biosimilar conversion tracking >85%', date: '2026-09-30', status: 'planned' },
        { name: 'Next biosimilar opportunity identified and announced', date: '2026-12-31', status: 'planned' },
      ],
      kpis: [
        { label: 'Humira Conversion Rate', target: 'Maintain >90%', actual: '>90% achieved', status: 'good' },
        { label: 'Stelara Exclusion Timeline', target: 'July 1, 2026', actual: 'On schedule', status: 'good' },
        { label: 'Target Patient OOP Cost', target: '$0 out-of-pocket majority', actual: 'Model proven with Humira', status: 'good' },
      ],
    },
    {
      id: 'truecost-pbm-transition',
      name: 'TrueCost PBM — Net Cost Economics Transition',
      description:
        'TrueCost is Caremark\'s PBM offering launched 2+ years ago — net cost economics model. ' +
        'Shifting the industry from average gross prices to net price transparency. ' +
        'Clients receive the actual net cost of every drug — no opaque rebate structures. ' +
        'Federal and state regulatory changes (CAA, FTC settlement discussions) are reinforcing this direction. ' +
        'Caremark has been leading this transition — well-positioned for regulatory tailwinds. ' +
        'TrueCost creates headwind on reported HSS revenues and AOI as gross-to-net reconciliations reduce topline ' +
        'but this is the correct economic model for clients, members, and long-term PBM value. ' +
        'Company remains confident in ≥$7.25B HSS AOI FY2026 guidance. ' +
        'Tennessee PBM legislation effective mid-2028 — evaluating options including potential legal action.',
      status: 'on-track',
      budget: 500,                    // est. technology platform investment for TrueCost [ASSUMED]
      spent: 125,
      progress: 65,
      milestones: [
        { name: 'TrueCost PBM launched — net cost economics', date: '2024-01-01', status: 'completed' },
        { name: 'CAA federal regulations aligning with TrueCost model', date: '2026-01-01', status: 'completed' },
        { name: 'FTC settlement discussions underway', date: '2026-05-06', status: 'in-progress' },
        { name: 'AHIP PA standardization commitment: 50%+ volume by year-end', date: '2026-12-31', status: 'in-progress' },
        { name: 'Tennessee PBM legislation evaluation / legal options', date: '2026-12-31', status: 'in-progress' },
        { name: 'Tennessee legislation effective date (unless enjoined)', date: '2028-06-30', status: 'planned' },
      ],
      kpis: [
        { label: 'TrueCost Client Adoption', target: 'Grow market share', actual: 'Aetna fully insured 8yr POS rebate track record', status: 'good' },
        { label: 'HSS AOI FY2026', target: '≥$7.25B', actual: '$1.49B Q1 (rebate timing)', status: 'good' },
        { label: 'Regulatory Alignment', target: 'CAA + FTC direction supports net cost', actual: 'On track', status: 'good' },
      ],
    },
    {
      id: 'prior-auth-standardization',
      name: 'Prior Authorization Standardization — AHIP Industry Leadership',
      description:
        'BD / Aetna leading the industry in prior authorization standardization. ' +
        'Aetna already has the fewest medical services subject to PA in the industry. ' +
        '>95% of eligible prior authorizations approved within 24 hours; >80% in real time. ' +
        '88% of procedures already standardized — well ahead of AHIP industry commitment (50% by year-end 2026). ' +
        'Rallied industry peers through AHIP to commit to standardize the most common PA submissions, ' +
        'representing over 50% of PA volume by year-end. ' +
        'Medical and pharmacy decisions integrated; bundling solutions for certain conditions replace multiple approvals with one. ' +
        'Goal: reduce friction for providers and patients, improve member experience, lower administrative burden. ' +
        '"A better informed, more engaged, empowered member is a better health care consumer."',
      status: 'on-track',
      budget: 200,
      spent: 50,
      progress: 70,
      milestones: [
        { name: 'Aetna: >95% PA approvals within 24 hours achieved', date: '2025-12-31', status: 'completed' },
        { name: 'Aetna: >80% real-time PA approvals achieved', date: '2025-12-31', status: 'completed' },
        { name: '88% of procedures standardized — industry-leading', date: '2026-03-31', status: 'completed' },
        { name: 'AHIP commitment: industry standardize 50%+ PA volume', date: '2026-12-31', status: 'in-progress' },
        { name: 'Bundling solutions for multi-condition PA replacement', date: '2026-12-31', status: 'in-progress' },
      ],
      kpis: [
        { label: 'PA Approval Rate (24h)', target: '>97%', actual: '>95%', status: 'good' },
        { label: 'Procedures Standardized', target: '50% industry; 88% Aetna already', actual: '88% (ahead of industry)', status: 'good' },
        { label: 'Press Ganey Health Plan of the Year', target: 'Industry recognition', actual: 'Inaugural award winner', status: 'good' },
      ],
    },
  ],

  risks: [
    {
      id: 'ma-rate-adequacy',
      name: 'Medicare Advantage CMS Rate Inadequacy',
      description: 'CMS 2027 rate notice represents step in right direction but remains insufficient to offset underlying medical cost trends, which continue above historical levels. Industry-wide pressure for 2+ years. CVS confident in 3% MA margin target by 2028 despite rate headwind through disciplined geographic/product mix and medical cost management.',
      likelihood: 'high',
      impact: 'high',
      mitigations: [
        'Disciplined AEP underwriting — prioritizing margin over membership volume',
        'Improved geographic mix — exiting unprofitable MA markets',
        'Prior authorization standardization reducing medical cost leakage',
        'Strong CMS partnership and constructive dialogue on program sustainability',
        'Medical cost management fundamentals — not relying solely on favorable PYD',
      ],
    },
    {
      id: 'glp1-cost-trend',
      name: 'GLP-1 Medication Cost Trend',
      description: 'GLP-1 medications remain among the largest cost challenges for PBM clients. Over 90% of clients\' pharmacy costs come from 10% of branded drugs. ~50% of clients currently discontinuing obesity GLP-1 coverage due to cost. Affordability challenge is very real at both payer and retail level.',
      likelihood: 'high',
      impact: 'medium',
      mitigations: [
        'CostVantage model neutralizes branded drug margin volatility at retail',
        'Formulary management introducing GLP-1 competition through DTC/biosimilar alternatives',
        'NovoCare partnership and DTC distribution channel capturing off-benefit patients',
        'TrueCost net-cost model passing actual savings to PBM clients',
        'GLP-1 DTC market gaining share (+200bps) — CVS positioned as solution channel',
      ],
    },
    {
      id: 'pbm-regulation',
      name: 'PBM Regulation — Federal & State (Tennessee)',
      description: 'FTC settlement discussions ongoing. Tennessee PBM legislation effective mid-2028 — evaluated for potential legal action. Federal: CAA and FTC direction actually reinforces TrueCost / net-cost direction CVS has been on for 2+ years. State-by-state complexity creates operational challenges. Company disappointed with Tennessee\'s direction — believes it will raise costs for the state.',
      likelihood: 'medium',
      impact: 'medium',
      mitigations: [
        'TrueCost PBM model already aligned with federal net-cost regulatory direction',
        'FTC settlement discussions proceeding constructively',
        'Evaluating legal action in Tennessee as pursued in other states',
        'CAA federal framework provides structured transition with 2-year runway',
        'Operational continuity maintained — Tennessee pharmacies operating normally',
      ],
    },
    {
      id: 'leverage-capital-allocation',
      name: 'Leverage Ratio & Capital Return Capacity',
      description: 'CVS leverage ratio 3.84x as of Q1 2026. Share repurchase suspended. Balance sheet deleveraging is management priority before capital return expansion. Higher leverage limits financial flexibility and creates interest expense headwind. Strong CFO (≥$9.5B FY2026 guidance) is the primary deleveraging mechanism.',
      likelihood: 'low',
      impact: 'medium',
      mitigations: [
        'CFO ≥$9.5B FY2026 driving organic deleveraging',
        'No near-term debt maturity risk — long-duration debt structure',
        'Quarterly dividend maintained at ~$850M — no reduction expected',
        'Capital deployment opportunities to be evaluated as leverage improves through 2026',
        'BBB credit rating maintained — access to debt markets preserved',
      ],
    },
  ],
};
