// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/reports.ts
//
// Report metadata (frequency, department, audience, rating, views) is
// illustrative for demonstration. Department names map to Verizon's
// known executive lineup (Vestberg/Skiadas/Malady/Dunne).
//
// See: VZN - Research & Analysis/02 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { ReportsConfig } from '../../types';

export const reports: ReportsConfig = {
  totalReports: 48,
  categories: [
    'Wireless Revenue & Subscribers',
    'Broadband & Network',
    'Financial Performance',
    'Competitive Intelligence',
    'Operations & Network Quality',
    'Strategy Execution',
    'Risk & Regulatory',
  ],
  reports: [
    // ──────────────────────────────────────────
    // Wireless Revenue & Subscribers (8 reports)
    // ──────────────────────────────────────────
    {
      id: 'ws-1', name: 'Wireless Service Revenue Tracker', category: 'Wireless Revenue & Subscribers', frequency: 'Weekly',
      description: 'Wireless service revenue vs plan: postpaid, prepaid, wholesale (MVNO). ARPA trend and myPlan adoption rate.',
      format: 'PowerBI', department: 'Finance', owner: 'Wireless FP&A', rating: 4.9, views: 2860, isNew: false, isTrending: true,
      relatedConsoleId: 'consumer-wireless', dataSource: 'Billing System', accessLevel: 'All Finance',
      audience: ['CFO', 'Wireless Finance', 'IR'], tags: ['wireless', 'service-revenue', 'arpa'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'ws-2', name: 'Postpaid Net Adds & Churn Dashboard', category: 'Wireless Revenue & Subscribers', frequency: 'Daily',
      description: 'Postpaid phone gross adds, churn (voluntary + involuntary), and net adds by region and channel.',
      format: 'PowerBI', department: 'Consumer', owner: 'Subscriber Analytics', rating: 4.9, views: 3100, isNew: false, isTrending: true,
      relatedConsoleId: 'consumer-wireless', dataSource: 'CRM / Billing', accessLevel: 'Consumer + Finance',
      audience: ['Consumer EVP', 'CFO', 'Network'], tags: ['churn', 'net-adds', 'postpaid'], nextUpdate: 'Daily 7:00 AM',
    },
    {
      id: 'ws-3', name: 'ARPA & myPlan Tier Analysis', category: 'Wireless Revenue & Subscribers', frequency: 'Weekly',
      description: 'Average Revenue Per Account by plan tier (myPlan Ultimate, Plus, Start), device payment plan attach, and perk revenue.',
      format: 'PowerBI', department: 'Finance', owner: 'Revenue Analytics', rating: 4.7, views: 1980, isNew: false, isTrending: false,
      relatedConsoleId: 'consumer-wireless', dataSource: 'Billing System', accessLevel: 'Finance + Consumer',
      audience: ['CFO', 'Consumer EVP', 'Marketing'], tags: ['arpa', 'myplan', 'pricing'], nextUpdate: 'Every Tuesday 6:00 AM',
    },
    {
      id: 'ws-4', name: 'Prepaid & MVNO Revenue Report', category: 'Wireless Revenue & Subscribers', frequency: 'Monthly',
      description: 'Visible by Verizon prepaid subscriber trends plus MVNO wholesale revenue (Spectrum Mobile, Xfinity Mobile, TracFone).',
      format: 'Excel', department: 'Finance', owner: 'Wholesale Finance', rating: 4.3, views: 890, isNew: false, isTrending: false,
      relatedConsoleId: 'consumer-wireless', dataSource: 'Billing / Wholesale', accessLevel: 'Finance',
      audience: ['CFO', 'Wholesale Team'], tags: ['prepaid', 'mvno', 'wholesale'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'ws-5', name: 'Competitive Switching Analysis', category: 'Wireless Revenue & Subscribers', frequency: 'Weekly',
      description: 'Subscriber flows: Verizon ↔ T-Mobile ↔ AT&T ↔ Cable MVNOs. Win/loss by region, plan tier, and switching reason.',
      format: 'PowerBI', department: 'Consumer', owner: 'Competitive Intelligence', rating: 4.8, views: 2240, isNew: false, isTrending: true,
      relatedConsoleId: 'competitive-intelligence', dataSource: 'Survey + CRM', accessLevel: 'Consumer + Finance + Strategy',
      audience: ['Consumer EVP', 'CFO', 'Strategy'], tags: ['switching', 'competitive', 'churn'], nextUpdate: 'Every Friday 6:00 AM',
    },
    {
      id: 'ws-6', name: 'Device Upgrade & Equipment Revenue', category: 'Wireless Revenue & Subscribers', frequency: 'Weekly',
      description: 'Handset upgrade cycle, device payment plan balances, equipment revenue, and Verizon Device Payment securitization.',
      format: 'PowerBI', department: 'Finance', owner: 'Equipment Finance', rating: 4.4, views: 1120, isNew: false, isTrending: false,
      relatedConsoleId: 'consumer-wireless', dataSource: 'Device Management System', accessLevel: 'Finance',
      audience: ['CFO', 'Consumer EVP'], tags: ['devices', 'upgrade-cycle', 'equipment-revenue'], nextUpdate: 'Every Wednesday 6:00 AM',
    },
    {
      id: 'ws-7', name: 'IoT Connections & Business Wireless', category: 'Wireless Revenue & Subscribers', frequency: 'Monthly',
      description: 'Business Solutions IoT connections (~55M), private network deployments, and enterprise wireless line trends.',
      format: 'PowerBI', department: 'Business', owner: 'Business Analytics', rating: 4.5, views: 1340, isNew: false, isTrending: false,
      relatedConsoleId: 'business-solutions', dataSource: 'BSS / IoT Platform', accessLevel: 'Business + Finance',
      audience: ['Business EVP', 'CFO', 'Enterprise Sales'], tags: ['iot', 'enterprise', 'private-network'], nextUpdate: 'Monthly Day 6',
    },
    {
      id: 'ws-8', name: 'Network Quality & Customer Experience', category: 'Wireless Revenue & Subscribers', frequency: 'Weekly',
      description: 'J.D. Power, RootMetrics, and internal network quality KPIs. Customer NPS and care first-call resolution trends.',
      format: 'PowerBI', department: 'Network', owner: 'Network Operations', rating: 4.6, views: 1650, isNew: false, isTrending: false,
      relatedConsoleId: 'network-operations', dataSource: 'Network OSS + NPS Platform', accessLevel: 'Network + Consumer',
      audience: ['CTO', 'Consumer EVP', 'CFO'], tags: ['network-quality', 'nps', 'customer-experience'], nextUpdate: 'Every Monday 8:00 AM',
    },

    // ──────────────────────────────────────────
    // Broadband & Network (7 reports)
    // ──────────────────────────────────────────
    {
      id: 'bb-1', name: 'FWA Net Adds & Coverage Tracker', category: 'Broadband & Network', frequency: 'Daily',
      description: 'Fixed Wireless Access daily gross adds, churn, and net adds. Coverage eligible households by market. vs guidance pace.',
      format: 'PowerBI', department: 'Consumer', owner: 'Broadband Analytics', rating: 4.9, views: 2780, isNew: false, isTrending: true,
      relatedConsoleId: 'broadband-fiber', dataSource: 'Order Management + Network', accessLevel: 'Consumer + Finance + Network',
      audience: ['Consumer EVP', 'CFO', 'CTO'], tags: ['fwa', 'home-internet', 'net-adds'], nextUpdate: 'Daily 7:00 AM',
    },
    {
      id: 'bb-2', name: 'Fios Internet Subscriber Report', category: 'Broadband & Network', frequency: 'Weekly',
      description: 'Fios Internet net adds, churn, penetration rate (subs/passings). Core territory vs Frontier territory comparison.',
      format: 'PowerBI', department: 'Consumer', owner: 'Fios Analytics', rating: 4.7, views: 2100, isNew: false, isTrending: false,
      relatedConsoleId: 'broadband-fiber', dataSource: 'Billing System', accessLevel: 'Consumer + Finance',
      audience: ['Consumer EVP', 'CFO', 'Frontier Integration Team'], tags: ['fios', 'fiber', 'broadband'], nextUpdate: 'Every Tuesday 6:00 AM',
    },
    {
      id: 'bb-3', name: 'Frontier Integration Progress Dashboard', category: 'Broadband & Network', frequency: 'Weekly',
      description: 'Frontier OSS/BSS integration milestones, synergy run-rate tracking, cross-sell wireless penetration in Frontier markets.',
      format: 'PowerBI', department: 'Integration', owner: 'Frontier Integration PMO', rating: 4.8, views: 1870, isNew: true, isTrending: true,
      relatedConsoleId: 'strategy-execution', dataSource: 'PMO Tracker', accessLevel: 'Executive + Integration Team',
      audience: ['CEO', 'CFO', 'Integration PMO'], tags: ['frontier', 'integration', 'synergies'], nextUpdate: 'Every Monday 9:00 AM',
    },
    {
      id: 'bb-4', name: 'C-Band Deployment Progress', category: 'Broadband & Network', frequency: 'Weekly',
      description: 'C-Band population coverage %, site activations, FWA eligible households unlocked. vs 90% year-end coverage target.',
      format: 'PowerBI', department: 'Network', owner: 'Network Engineering', rating: 4.6, views: 1540, isNew: false, isTrending: false,
      relatedConsoleId: 'network-operations', dataSource: 'Network OSS', accessLevel: 'Network + Finance',
      audience: ['CTO', 'CFO', 'Consumer EVP'], tags: ['c-band', '5g', 'coverage'], nextUpdate: 'Every Wednesday 6:00 AM',
    },
    {
      id: 'bb-5', name: 'Fios Video Trends & Cord-Cutting', category: 'Broadband & Network', frequency: 'Monthly',
      description: 'Fios Video subscriber trends, cord-cutting rate, and linear-to-streaming transition impact on bundled revenue.',
      format: 'Excel', department: 'Consumer', owner: 'Video Analytics', rating: 4.2, views: 780, isNew: false, isTrending: false,
      relatedConsoleId: 'broadband-fiber', dataSource: 'Billing System', accessLevel: 'Consumer + Finance',
      audience: ['Consumer EVP', 'Finance'], tags: ['fios-video', 'cord-cutting', 'streaming'], nextUpdate: 'Monthly Day 7',
    },
    {
      id: 'bb-6', name: 'Private Network Deployments — Enterprise', category: 'Broadband & Network', frequency: 'Monthly',
      description: 'Enterprise private network (CBRS + C-Band) pipeline, signed deals, and live deployments. Revenue and backlog.',
      format: 'PowerBI', department: 'Business', owner: 'Enterprise Sales', rating: 4.5, views: 1120, isNew: true, isTrending: true,
      relatedConsoleId: 'business-solutions', dataSource: 'CRM / Sales', accessLevel: 'Business + Finance',
      audience: ['Business EVP', 'CFO', 'Enterprise Sales'], tags: ['private-network', 'enterprise', 'cbrs'], nextUpdate: 'Monthly Day 5',
    },
    {
      id: 'bb-7', name: 'Total Broadband Market Share', category: 'Broadband & Network', frequency: 'Monthly',
      description: 'Verizon total broadband share (Fios + FWA) vs Comcast, Charter, AT&T Fiber. US broadband industry context.',
      format: 'PowerBI', department: 'Strategy', owner: 'Market Intelligence', rating: 4.7, views: 1680, isNew: false, isTrending: false,
      relatedConsoleId: 'competitive-intelligence', dataSource: 'Public Filings + Internal', accessLevel: 'Executive + Strategy',
      audience: ['CEO', 'CFO', 'Consumer EVP'], tags: ['broadband', 'market-share', 'competitive'], nextUpdate: 'Monthly Day 10',
    },

    // ──────────────────────────────────────────
    // Financial Performance (8 reports)
    // ──────────────────────────────────────────
    {
      id: 'fp-1', name: 'P&L vs Guidance Bridge', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Revenue, EBITDA, EPS actual vs FY2026 guidance. Waterfall of variance drivers by segment.',
      format: 'PowerBI', department: 'Finance', owner: 'FP&A', rating: 4.9, views: 3200, isNew: false, isTrending: true,
      relatedConsoleId: 'financial-performance', dataSource: 'Consolidation System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'FP&A', 'IR'], tags: ['p-and-l', 'guidance', 'bridge'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'fp-2', name: 'Adjusted EBITDA & Margin Trend', category: 'Financial Performance', frequency: 'Weekly',
      description: 'Consolidated and segment adj. EBITDA and margin trends. Frontier synergy contribution vs organic.',
      format: 'PowerBI', department: 'Finance', owner: 'FP&A', rating: 4.8, views: 2450, isNew: false, isTrending: false,
      relatedConsoleId: 'financial-performance', dataSource: 'Consolidation System', accessLevel: 'Finance',
      audience: ['CFO', 'Segment Finance Heads'], tags: ['ebitda', 'margin', 'segment'], nextUpdate: 'Every Monday 7:00 AM',
    },
    {
      id: 'fp-3', name: 'Free Cash Flow Tracker', category: 'Financial Performance', frequency: 'Weekly',
      description: 'FCF vs ≥$21.5B FY2026 guidance. Operating cash flow, CapEx, debt payments. Leverage trajectory.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury', rating: 4.9, views: 2890, isNew: false, isTrending: true,
      relatedConsoleId: 'capital-allocation', dataSource: 'Treasury / GL', accessLevel: 'Finance + Treasury',
      audience: ['CFO', 'Treasury', 'IR'], tags: ['fcf', 'leverage', 'deleverage'], nextUpdate: 'Every Monday 8:00 AM',
    },
    {
      id: 'fp-4', name: 'Capital Expenditure Tracker', category: 'Financial Performance', frequency: 'Monthly',
      description: 'CapEx vs $17.5B–$18.5B FY2026 guidance by category: wireless network, fiber (Frontier), IT/BSS, other.',
      format: 'PowerBI', department: 'Finance', owner: 'Capital Planning', rating: 4.7, views: 1760, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-allocation', dataSource: 'Project Accounting', accessLevel: 'Finance + Network',
      audience: ['CFO', 'CTO', 'Capital Planning'], tags: ['capex', 'network-investment', 'fiber'], nextUpdate: 'Monthly Day 5',
    },
    {
      id: 'fp-5', name: 'Adjusted EPS Bridge', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Adj. EPS vs $4.95–$4.99 FY2026 guidance. Bridge from EBITDA to EPS: D&A, interest, tax, shares.',
      format: 'Excel', department: 'Finance', owner: 'External Reporting', rating: 4.6, views: 1240, isNew: false, isTrending: false,
      relatedConsoleId: 'financial-performance', dataSource: 'Consolidation System', accessLevel: 'Finance + IR',
      audience: ['CFO', 'IR', 'CEO'], tags: ['eps', 'guidance', 'bridge'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'fp-6', name: 'Leverage & Debt Maturity Report', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Net leverage (Net Debt/EBITDA) vs 2.25x year-end target. Debt maturity profile and refinancing schedule.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury', rating: 4.7, views: 1560, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-allocation', dataSource: 'Treasury', accessLevel: 'Finance + Treasury',
      audience: ['CFO', 'Treasury', 'Rating Agencies'], tags: ['leverage', 'debt', 'refinancing'], nextUpdate: 'Monthly Day 6',
    },
    {
      id: 'fp-7', name: 'Dividend Coverage & Return Analysis', category: 'Financial Performance', frequency: 'Quarterly',
      description: 'Dividend coverage ratio (FCF / dividend). Payout ratio. 18-year increase track record. Buyback authorization status.',
      format: 'Excel', department: 'Finance', owner: 'IR', rating: 4.4, views: 940, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-allocation', dataSource: 'Finance + IR', accessLevel: 'Finance + IR',
      audience: ['CFO', 'CEO', 'Board'], tags: ['dividend', 'shareholder-returns', 'buybacks'], nextUpdate: 'Quarterly Day 10',
    },
    {
      id: 'fp-8', name: 'Segment P&L — Consumer vs Business', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Consumer vs Business segment revenue, EBITDA, and margin. Wireless vs broadband vs wireline breakdown.',
      format: 'PowerBI', department: 'Finance', owner: 'Segment Finance', rating: 4.8, views: 2100, isNew: false, isTrending: false,
      relatedConsoleId: 'financial-performance', dataSource: 'Consolidation System', accessLevel: 'Finance',
      audience: ['CFO', 'Consumer EVP', 'Business EVP'], tags: ['segment', 'consumer', 'business'], nextUpdate: 'Monthly Day 8',
    },
  ],
};
