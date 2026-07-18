// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/reports.ts
//
// Report metadata (frequency, department, audience, rating, views) is
// illustrative for demonstration. Department names map to Baker Hughes's
// known executive lineup (Simonelli/Moghal/IET leadership/OFSE leadership).
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { ReportsConfig } from '../../types';

export const reports: ReportsConfig = {
  totalReports: 48,
  categories: [
    'IET Performance',
    'OFSE Performance',
    'Financial Performance',
    'Strategy & Portfolio',
    'Operations & Supply Chain',
    'Competitive Intelligence',
    'Risk & Regulatory',
  ],
  reports: [
    // ──────────────────────────────────────────
    // IET Performance (8 reports)
    // ──────────────────────────────────────────
    {
      id: 'iet-1', name: 'IET Orders & Book-to-Bill Tracker', category: 'IET Performance', frequency: 'Weekly',
      description: 'IET quarterly orders vs $14.5B+ FY2026 guidance. Book-to-bill ratio by product line: GTE, GTS, CTS, IP, IS.',
      format: 'PowerBI', department: 'Finance', owner: 'IET FP&A', rating: 4.9, views: 3100, isNew: false, isTrending: true,
      relatedConsoleId: 'iet-performance', dataSource: 'Order Management System', accessLevel: 'All Finance',
      audience: ['CFO', 'IET President', 'CEO', 'IR'], tags: ['iet', 'orders', 'book-to-bill'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'iet-2', name: 'IET RPO (Remaining Performance Obligations)', category: 'IET Performance', frequency: 'Monthly',
      description: 'IET RPO trend vs $33.1B Q1 2026 record. Recognition timeline (2-yr, 5-yr, 15-yr buckets). GTE vs GTS split.',
      format: 'PowerBI', department: 'Finance', owner: 'Revenue Accounting', rating: 4.9, views: 2780, isNew: false, isTrending: true,
      relatedConsoleId: 'iet-performance', dataSource: 'Revenue Recognition System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'IET President', 'CEO', 'IR'], tags: ['rpo', 'backlog', 'revenue-visibility'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'iet-3', name: 'Gas Technology Equipment Revenue & Margin', category: 'IET Performance', frequency: 'Monthly',
      description: 'GTE revenue vs $1.7B Q2 target. LNG liquefaction train deliveries, gas compression, turbomachinery. Margin trend.',
      format: 'PowerBI', department: 'Finance', owner: 'IET FP&A', rating: 4.8, views: 2340, isNew: false, isTrending: false,
      relatedConsoleId: 'iet-performance', dataSource: 'Project Accounting', accessLevel: 'IET + Finance',
      audience: ['CFO', 'IET President', 'GTE Business Leader'], tags: ['gte', 'lng', 'turbomachinery'], nextUpdate: 'Monthly Day 7',
    },
    {
      id: 'iet-4', name: 'Gas Technology Services & LTSA Dashboard', category: 'IET Performance', frequency: 'Monthly',
      description: 'GTS revenue +34% YoY trend. LTSA contract asset balance ($326M Q1 2026). Aftermarket services and upgrade pipeline.',
      format: 'PowerBI', department: 'Finance', owner: 'GTS Finance', rating: 4.9, views: 2560, isNew: false, isTrending: true,
      relatedConsoleId: 'iet-performance', dataSource: 'Service Management System', accessLevel: 'IET + Finance',
      audience: ['CFO', 'IET President', 'GTS Business Leader'], tags: ['gts', 'ltsa', 'services', 'recurring'], nextUpdate: 'Monthly Day 6',
    },
    {
      id: 'iet-5', name: 'CTS Data Center Power Orders Tracker', category: 'IET Performance', frequency: 'Weekly',
      description: 'Climate Technology Solutions quarterly order intake vs $1B+ target. Data center aeroderivative, CCUS, hydrogen, geothermal breakdown.',
      format: 'PowerBI', department: 'Finance', owner: 'CTS Finance', rating: 4.9, views: 3200, isNew: true, isTrending: true,
      relatedConsoleId: 'iet-performance', dataSource: 'CRM / Order Management', accessLevel: 'IET + Finance + Strategy',
      audience: ['CFO', 'CEO', 'IET President', 'IR'], tags: ['cts', 'data-center', 'new-energy', 'climate'], nextUpdate: 'Every Friday 6:00 AM',
    },
    {
      id: 'iet-6', name: 'IET EBITDA & Margin Bridge', category: 'IET Performance', frequency: 'Monthly',
      description: 'IET Adj. EBITDA $678M Q1 2026 (20.2% margin). Bridge from Q1 2025 +310bps expansion. FY2026 ≥$2.7B guidance tracking.',
      format: 'PowerBI', department: 'Finance', owner: 'IET FP&A', rating: 4.8, views: 2190, isNew: false, isTrending: false,
      relatedConsoleId: 'iet-performance', dataSource: 'Consolidation System', accessLevel: 'Finance',
      audience: ['CFO', 'IET President', 'Segment Finance'], tags: ['iet', 'ebitda', 'margin'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'iet-7', name: 'Aeroderivative Supply Chain Tracker', category: 'IET Performance', frequency: 'Weekly',
      description: 'GE Vernova 50/50 JV turbine supply status. Lead time trends for data center and LNG CTS orders. On-time delivery KPI.',
      format: 'PowerBI', department: 'Supply Chain', owner: 'Aero JV Program Manager', rating: 4.7, views: 1870, isNew: true, isTrending: true,
      relatedConsoleId: 'iet-performance', dataSource: 'Supply Chain System', accessLevel: 'IET + Supply Chain + Finance',
      audience: ['COO', 'IET President', 'CFO'], tags: ['aeroderivative', 'supply-chain', 'cts-delivery'], nextUpdate: 'Every Wednesday 7:00 AM',
    },
    {
      id: 'iet-8', name: 'IET iCenter Remote Monitoring Performance', category: 'IET Performance', frequency: 'Monthly',
      description: 'IET global iCenter monitoring centers: GTE/GTS installed base uptime, LTSA performance KPIs, predictive maintenance outcomes.',
      format: 'PowerBI', department: 'Operations', owner: 'IET Service Operations', rating: 4.5, views: 1320, isNew: false, isTrending: false,
      relatedConsoleId: 'iet-performance', dataSource: 'iCenter Monitoring Platform', accessLevel: 'IET + Operations',
      audience: ['IET President', 'GTS Business Leader', 'COO'], tags: ['icenter', 'monitoring', 'ltsa-performance'], nextUpdate: 'Monthly Day 5',
    },

    // ──────────────────────────────────────────
    // OFSE Performance (7 reports)
    // ──────────────────────────────────────────
    {
      id: 'ofse-1', name: 'OFSE Revenue & Activity Dashboard', category: 'OFSE Performance', frequency: 'Weekly',
      description: 'OFSE Q1 2026 $3.24B revenue by product line (WC, CIM, PS, SSPS) and region. Rig count vs revenue trend.',
      format: 'PowerBI', department: 'Finance', owner: 'OFSE FP&A', rating: 4.8, views: 2650, isNew: false, isTrending: true,
      relatedConsoleId: 'ofse-performance', dataSource: 'Segment Reporting', accessLevel: 'OFSE + Finance',
      audience: ['CFO', 'OFSE President', 'Regional Leaders'], tags: ['ofse', 'revenue', 'rig-count'], nextUpdate: 'Every Monday 7:00 AM',
    },
    {
      id: 'ofse-2', name: 'International Rig Count & Activity Monitor', category: 'OFSE Performance', frequency: 'Daily',
      description: 'International rig count (Q1 2026: 1,083 avg, +20% YoY) and NA rig count (749, -7% YoY). Baker Hughes Rig Count publication.',
      format: 'PowerBI', department: 'Strategy', owner: 'Market Intelligence', rating: 4.9, views: 3450, isNew: false, isTrending: true,
      relatedConsoleId: 'ofse-performance', dataSource: 'Baker Hughes Rig Count Database', accessLevel: 'All',
      audience: ['CEO', 'CFO', 'OFSE President', 'IR'], tags: ['rig-count', 'international', 'activity'], nextUpdate: 'Daily 7:00 AM (weekly for publication)',
    },
    {
      id: 'ofse-3', name: 'OFSE EBITDA & Cost-Out Tracker', category: 'OFSE Performance', frequency: 'Monthly',
      description: 'OFSE EBITDA $565M Q1 2026 (17.5% margin). Cost-out program savings vs plan. Restructuring charges Q1 $11M OFSE.',
      format: 'PowerBI', department: 'Finance', owner: 'OFSE FP&A', rating: 4.7, views: 1980, isNew: false, isTrending: false,
      relatedConsoleId: 'ofse-performance', dataSource: 'Consolidation System', accessLevel: 'Finance',
      audience: ['CFO', 'OFSE President', 'Segment Finance'], tags: ['ofse', 'ebitda', 'cost-out', 'restructuring'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'ofse-4', name: 'Middle East & Asia Activity Report', category: 'OFSE Performance', frequency: 'Weekly',
      description: 'Middle East/Asia OFSE revenue ($1,152M Q1 2026, -19% YoY). Saudi Aramco, ADNOC, PTTEP activity levels. Recovery outlook.',
      format: 'PowerBI', department: 'Finance', owner: 'Middle East Regional Finance', rating: 4.7, views: 2100, isNew: false, isTrending: true,
      relatedConsoleId: 'ofse-performance', dataSource: 'Regional ERP', accessLevel: 'OFSE + Finance + Strategy',
      audience: ['CFO', 'OFSE President', 'Middle East VP'], tags: ['middle-east', 'ofse', 'saudi-aramco', 'adnoc'], nextUpdate: 'Every Tuesday 7:00 AM',
    },
    {
      id: 'ofse-5', name: 'Latin America OFSE — Brazil Deepwater', category: 'OFSE Performance', frequency: 'Monthly',
      description: 'Latin America OFSE $600M Q1 2026 (+6% YoY). Brazil deepwater subsea activity (Petrobras). SSPS order pipeline.',
      format: 'PowerBI', department: 'Finance', owner: 'LatAm Regional Finance', rating: 4.5, views: 1450, isNew: false, isTrending: false,
      relatedConsoleId: 'ofse-performance', dataSource: 'Regional ERP', accessLevel: 'OFSE + Finance',
      audience: ['CFO', 'OFSE President', 'LatAm VP'], tags: ['latam', 'brazil', 'deepwater', 'ssps'], nextUpdate: 'Monthly Day 7',
    },
    {
      id: 'ofse-6', name: 'Leucipa AI Platform Deployment Tracker', category: 'OFSE Performance', frequency: 'Monthly',
      description: 'Leucipa AI production optimization platform deployments. Fields deployed, production uplift achieved, customer expansion pipeline.',
      format: 'PowerBI', department: 'Digital', owner: 'OFSE Digital Team', rating: 4.6, views: 1230, isNew: true, isTrending: true,
      relatedConsoleId: 'ofse-performance', dataSource: 'Leucipa Platform', accessLevel: 'OFSE + Digital + Finance',
      audience: ['CTO', 'OFSE President', 'CFO'], tags: ['leucipa', 'ai', 'digital', 'production-optimization'], nextUpdate: 'Monthly Day 6',
    },
    {
      id: 'ofse-7', name: 'OFSE LTA Renewal & Contract Status', category: 'OFSE Performance', frequency: 'Quarterly',
      description: 'Long-term agreement renewal pipeline with major NOCs and IOCs. Revenue at risk from expiring LTAs. Win rates vs competitors.',
      format: 'PowerBI', department: 'Commercial', owner: 'OFSE Commercial Finance', rating: 4.6, views: 1560, isNew: false, isTrending: false,
      relatedConsoleId: 'ofse-performance', dataSource: 'CRM / Contract Management', accessLevel: 'OFSE + Finance + Strategy',
      audience: ['CFO', 'OFSE President', 'Key Account Managers'], tags: ['lta', 'contracts', 'noc', 'ofse'], nextUpdate: 'Quarterly Day 8',
    },

    // ──────────────────────────────────────────
    // Financial Performance (8 reports)
    // ──────────────────────────────────────────
    {
      id: 'fp-1', name: 'P&L vs Guidance Bridge', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Revenue, Adj. EBITDA, EPS actual vs FY2026 guidance. Waterfall of variance by segment (IET vs OFSE).',
      format: 'PowerBI', department: 'Finance', owner: 'FP&A', rating: 4.9, views: 3400, isNew: false, isTrending: true,
      relatedConsoleId: 'financial-performance', dataSource: 'Consolidation System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'FP&A', 'IR'], tags: ['p-and-l', 'guidance', 'bridge'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'fp-2', name: 'Adjusted EBITDA & Margin Trend', category: 'Financial Performance', frequency: 'Weekly',
      description: 'Consolidated Adj. EBITDA $1,160M Q1 2026 (17.6% margin, +140bps YoY). IET 20.2% vs OFSE 17.5%. FY2026 ≥$5.0B guidance.',
      format: 'PowerBI', department: 'Finance', owner: 'FP&A', rating: 4.8, views: 2890, isNew: false, isTrending: false,
      relatedConsoleId: 'financial-performance', dataSource: 'Consolidation System', accessLevel: 'Finance',
      audience: ['CFO', 'Segment Finance Heads'], tags: ['ebitda', 'margin', 'segment'], nextUpdate: 'Every Monday 7:00 AM',
    },
    {
      id: 'fp-3', name: 'Free Cash Flow Tracker', category: 'Financial Performance', frequency: 'Weekly',
      description: 'FCF $210M Q1 2026 vs ~$1.5B FY2026 target. Operating cash flow, CapEx ($336M Q1), working capital. Leverage trajectory.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury', rating: 4.9, views: 3100, isNew: false, isTrending: true,
      relatedConsoleId: 'capital-allocation', dataSource: 'Treasury / GL', accessLevel: 'Finance + Treasury',
      audience: ['CFO', 'Treasury', 'IR'], tags: ['fcf', 'leverage', 'capex'], nextUpdate: 'Every Monday 8:00 AM',
    },
    {
      id: 'fp-4', name: 'Capital Expenditure Tracker', category: 'Financial Performance', frequency: 'Monthly',
      description: 'CapEx vs ≤5% of revenue FY2026 guidance. OFSE $218M + IET $104M + Corp $14M = $336M Q1 2026. Project-level breakdown.',
      format: 'PowerBI', department: 'Finance', owner: 'Capital Planning', rating: 4.7, views: 1890, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-allocation', dataSource: 'Project Accounting', accessLevel: 'Finance + Operations',
      audience: ['CFO', 'COO', 'Capital Planning'], tags: ['capex', 'capital-allocation', 'investment'], nextUpdate: 'Monthly Day 5',
    },
    {
      id: 'fp-5', name: 'Adjusted EPS Bridge', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Adj. EPS $0.58 Q1 2026 (+13% YoY). Bridge: EBITDA → D&A → interest → tax → shares (~996M diluted).',
      format: 'Excel', department: 'Finance', owner: 'External Reporting', rating: 4.6, views: 1560, isNew: false, isTrending: false,
      relatedConsoleId: 'financial-performance', dataSource: 'Consolidation System', accessLevel: 'Finance + IR',
      audience: ['CFO', 'IR', 'CEO'], tags: ['eps', 'guidance', 'bridge'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'fp-6', name: 'Net Leverage & Debt Maturity Report', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Net leverage 0.3x pre-Chart; ~2.0x post-Chart. Debt maturity profile. $9.885B Chart acquisition notes issued Mar 2026.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury', rating: 4.7, views: 1780, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-allocation', dataSource: 'Treasury', accessLevel: 'Finance + Treasury',
      audience: ['CFO', 'Treasury', 'Rating Agencies'], tags: ['leverage', 'debt', 'chart-financing'], nextUpdate: 'Monthly Day 6',
    },
    {
      id: 'fp-7', name: 'Dividend & Share Buyback Report', category: 'Financial Performance', frequency: 'Quarterly',
      description: 'Quarterly dividend $0.23/share ($0.92 annualized). $1.35B buyback authorization (paused for Chart). Payout ratio and coverage.',
      format: 'Excel', department: 'Finance', owner: 'IR', rating: 4.4, views: 1120, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-allocation', dataSource: 'Finance + IR', accessLevel: 'Finance + IR',
      audience: ['CFO', 'CEO', 'Board'], tags: ['dividend', 'buybacks', 'shareholder-returns'], nextUpdate: 'Quarterly Day 10',
    },
    {
      id: 'fp-8', name: 'Segment P&L — IET vs OFSE', category: 'Financial Performance', frequency: 'Monthly',
      description: 'IET $3.35B (50.9%) vs OFSE $3.24B (49.1%) Q1 2026 revenue. Segment EBITDA, margin, and YoY change.',
      format: 'PowerBI', department: 'Finance', owner: 'Segment Finance', rating: 4.8, views: 2340, isNew: false, isTrending: false,
      relatedConsoleId: 'financial-performance', dataSource: 'Consolidation System', accessLevel: 'Finance',
      audience: ['CFO', 'IET President', 'OFSE President'], tags: ['segment', 'iet', 'ofse'], nextUpdate: 'Monthly Day 8',
    },

    // ──────────────────────────────────────────
    // Strategy & Portfolio (5 reports)
    // ──────────────────────────────────────────
    {
      id: 'sp-1', name: 'Chart Industries Integration Dashboard', category: 'Strategy & Portfolio', frequency: 'Weekly',
      description: 'Chart acquisition ($13.6B EV) progress: regulatory approvals, close timeline, integration workstreams, synergy tracking.',
      format: 'PowerBI', department: 'Strategy', owner: 'Chart Integration PMO', rating: 4.9, views: 2980, isNew: true, isTrending: true,
      relatedConsoleId: 'strategy-execution', dataSource: 'PMO Tracker', accessLevel: 'Executive + Integration Team',
      audience: ['CEO', 'CFO', 'Integration PMO'], tags: ['chart', 'acquisition', 'integration', 'synergies'], nextUpdate: 'Every Monday 9:00 AM',
    },
    {
      id: 'sp-2', name: 'Portfolio Divestiture Proceeds Tracker', category: 'Strategy & Portfolio', frequency: 'Monthly',
      description: 'PSI $1.2B (closed), SPC $323M (closed), Waygate $1.45B (signed Apr 2026, pending close). Total ~$3.0B vs $3.0B target.',
      format: 'PowerBI', department: 'Finance', owner: 'Corporate Development', rating: 4.7, views: 1890, isNew: true, isTrending: true,
      relatedConsoleId: 'strategy-execution', dataSource: 'Transaction Finance', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'Corporate Development'], tags: ['divestiture', 'portfolio', 'proceeds'], nextUpdate: 'Monthly Day 6',
    },
    {
      id: 'sp-3', name: 'IET Horizon 2 Target Tracking', category: 'Strategy & Portfolio', frequency: 'Quarterly',
      description: 'IET Horizon 2: RPO >$40B by 2028, margin >21%, CTS $1B+/quarter. Q1 2026 progress vs targets.',
      format: 'PowerBI', department: 'Strategy', owner: 'IET Strategy', rating: 4.8, views: 2210, isNew: false, isTrending: false,
      relatedConsoleId: 'strategy-execution', dataSource: 'Strategy Tracker', accessLevel: 'Executive + IET + Finance',
      audience: ['CEO', 'CFO', 'IET President'], tags: ['horizon2', 'strategy', 'iet', 'targets'], nextUpdate: 'Quarterly Day 12',
    },
    {
      id: 'sp-4', name: 'Climate Technology Solutions Strategy Report', category: 'Strategy & Portfolio', frequency: 'Monthly',
      description: 'CTS market sizing: data center power, CCUS, hydrogen, geothermal. Competitive positioning vs GE Vernova, Siemens Energy.',
      format: 'PowerBI', department: 'Strategy', owner: 'CTS Strategy', rating: 4.7, views: 1670, isNew: true, isTrending: true,
      relatedConsoleId: 'strategy-execution', dataSource: 'Market Intelligence + CRM', accessLevel: 'Strategy + Finance + IET',
      audience: ['CEO', 'CFO', 'IET President', 'CTS Business Leader'], tags: ['cts', 'new-energy', 'data-center', 'strategy'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'sp-5', name: 'Competitive Landscape — IET & OFSE', category: 'Strategy & Portfolio', frequency: 'Quarterly',
      description: 'BKR vs SLB, HAL, GE Vernova, Siemens Energy. Market share trends, earnings comparison, strategic moves.',
      format: 'PowerBI', department: 'Strategy', owner: 'Market Intelligence', rating: 4.7, views: 1980, isNew: false, isTrending: false,
      relatedConsoleId: 'strategy-execution', dataSource: 'Public Filings + Internal', accessLevel: 'Executive + Strategy',
      audience: ['CEO', 'CFO', 'IET President', 'OFSE President'], tags: ['competitive', 'slb', 'halliburton', 'ge-vernova'], nextUpdate: 'Quarterly Day 10',
    },
  ],
};
