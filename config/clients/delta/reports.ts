// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/reports.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:JPM-2026]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Report categories and naming reference Delta Air Lines public
// disclosures: Form 10-K (FY 2025); Form 10-Q (Q1 2026); JPM Industrials
// Conference deck. Report metadata (frequency, department, audience,
// rating, views) is illustrative for demonstration.
//
// DISCLAIMER
// Report rating and view counts are seed/demo values, not real usage data.
// Department names and audiences map to Delta's known executive lineup
// (Bastian/Snell/Janki/Carter/Goswami/Ausband/Esposito/Duggirala) where
// applicable. Specific report content (executiveSummary / aiInsight /
// keyMetrics / chartData / tableData) for detail pages is generated at
// runtime by the AI engine against current Delta data.
//
// See: Delta - Research & Analysis/01 - Comprehensive Client Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { ReportsConfig } from '../../types';

export const reports: ReportsConfig = {
  totalReports: 48,
  categories: [
    'Revenue & Capacity',
    'Network & Commercial',
    'Operations & Reliability',
    'Digital & Technology',
    'People & Culture',
    'Financial Performance',
    'Risk & Sustainability',
  ],
  reports: [
    // ──────────────────────────────────────────
    // Revenue & Capacity (7 reports)
    // ──────────────────────────────────────────
    {
      id: 'rev-1', name: 'Revenue by Geography', category: 'Revenue & Capacity', frequency: 'Weekly',
      description: 'Passenger revenue split: Domestic, Atlantic, Latin America, Pacific. Plus Cargo, Refinery (3rd-party), Loyalty/MRO/Other.',
      format: 'PowerBI', department: 'Finance', owner: 'FP&A Team', rating: 4.8, views: 2340, isNew: false, isTrending: true,
      relatedConsoleId: 'capacity-network', dataSource: 'Revenue Accounting System', accessLevel: 'All Finance',
      audience: ['FP&A', 'CFO', 'Geography Heads'], tags: ['revenue', 'geography', 'segments'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'rev-2', name: 'Premium Cabin Revenue Tracker', category: 'Revenue & Capacity', frequency: 'Weekly',
      description: 'Premium-product ticket revenue (Delta One, First Class, Premium Select, Comfort+) by route and aircraft type.',
      format: 'PowerBI', department: 'Finance', owner: 'Revenue Analytics', rating: 4.9, views: 2480, isNew: false, isTrending: true,
      relatedConsoleId: 'capacity-network', dataSource: 'Revenue Management System', accessLevel: 'All Finance',
      audience: ['CCO', 'CFO', 'Revenue Management'], tags: ['premium', 'segmentation', 'mix-shift'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'rev-3', name: 'MRO Pipeline & Backlog', category: 'Revenue & Capacity', frequency: 'Monthly',
      description: 'Delta TechOps third-party MRO revenue pipeline by engine type (LEAP-1A, LEAP-1B, etc.) and customer.',
      format: 'Excel', department: 'Delta TechOps', owner: 'TechOps Finance', rating: 4.3, views: 1120, isNew: false, isTrending: false,
      relatedConsoleId: 'mro-techops', dataSource: 'TechOps Operations', accessLevel: 'All Finance',
      audience: ['TechOps Leadership', 'FP&A', 'CFO'], tags: ['mro', 'engines', 'pipeline', 'leap'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'rev-4', name: 'Equity-Investment MTM Report', category: 'Revenue & Capacity', frequency: 'Monthly',
      description: 'Mark-to-market on equity stakes (Virgin Atlantic 49%, Aeromexico 19%, LATAM 11%, Hanjin-KAL ~15%, China Eastern 2%, WestJet 12.7%).',
      format: 'Excel', department: 'Treasury', owner: 'Treasury', rating: 4.1, views: 780, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Treasury Systems', accessLevel: 'Leadership Only',
      audience: ['Treasury', 'CFO', 'External Reporting'], tags: ['mtm', 'equity-investments', 'jv-partners'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'rev-5', name: 'Daily Revenue Flash', category: 'Revenue & Capacity', frequency: 'Daily',
      description: 'Same-day passenger revenue, cargo, MRO, and refinery sales by region with anomaly flags.',
      format: 'PowerBI', department: 'Finance', owner: 'FP&A Team', rating: 4.7, views: 2680, isNew: true, isTrending: true,
      relatedConsoleId: 'capacity-network', dataSource: 'Revenue Accounting System', accessLevel: 'All Finance',
      audience: ['FP&A', 'CFO', 'CCO'], tags: ['daily', 'revenue', 'flash'], nextUpdate: 'Every day 10:00 PM',
    },
    {
      id: 'rev-6', name: 'Yield & TRASM Analysis', category: 'Revenue & Capacity', frequency: 'Weekly',
      description: 'Passenger mile yield, TRASM (adj.), PRASM by geography and route. Industry-standard unit-economics tracking.',
      format: 'PowerBI', department: 'Revenue Management', owner: 'Revenue Analytics', rating: 4.4, views: 1320, isNew: true, isTrending: false,
      relatedConsoleId: 'capacity-network', dataSource: 'Revenue Management System', accessLevel: 'All Finance',
      audience: ['Revenue Mgmt', 'FP&A', 'CCO'], tags: ['yield', 'trasm', 'prasm', 'unit-economics'], nextUpdate: 'Every Monday 8:00 AM',
    },
    {
      id: 'rev-7', name: 'International Geography Performance', category: 'Revenue & Capacity', frequency: 'Monthly',
      description: 'Atlantic / Latin America / Pacific revenue, capacity, and JV-partner contributions. Includes Aeromexico antitrust status.',
      format: 'PowerBI', department: 'Finance', owner: 'International FP&A', rating: 4.5, views: 1540, isNew: true, isTrending: false,
      relatedConsoleId: 'capacity-network', dataSource: 'Revenue Accounting System', accessLevel: 'Leadership Only',
      audience: ['CFO', 'President-International', 'FP&A'], tags: ['international', 'atlantic', 'pacific', 'latam', 'jv'], nextUpdate: 'Mar 15, 2026',
    },

    // ──────────────────────────────────────────
    // Network & Commercial (5 reports)
    // ──────────────────────────────────────────
    {
      id: 'comm-1', name: 'Daily Booking & Yield Performance', category: 'Network & Commercial', frequency: 'Daily',
      description: 'Cash sales, booking velocity, close-in build, yield by entity. CEO\'s "clearest indicator of demand".',
      format: 'Tableau', department: 'Revenue Management', owner: 'Revenue Analytics', rating: 4.7, views: 2450, isNew: false, isTrending: true,
      relatedConsoleId: 'capacity-network', dataSource: 'Revenue Management System', accessLevel: 'All Finance',
      audience: ['CCO', 'Revenue Management', 'FP&A'], tags: ['bookings', 'cash-sales', 'forward-curve'], nextUpdate: 'Every day 6:00 AM',
    },
    {
      id: 'comm-2', name: 'Hub Performance Report', category: 'Network & Commercial', frequency: 'Weekly',
      description: 'Hub-by-hub performance: ATL, DTW, MSP, SLC (core) + BOS, LAX, JFK, LGA, SEA (coastal) + AMS, ICN (international JV).',
      format: 'PowerBI', department: 'Network Planning', owner: 'Network Planning', rating: 4.6, views: 1860, isNew: false, isTrending: false,
      relatedConsoleId: 'capacity-network', dataSource: 'Network Planning System', accessLevel: 'All Finance',
      audience: ['Network Planning', 'CCO', 'Hub Leadership'], tags: ['hubs', 'core', 'coastal', 'jv'], nextUpdate: 'Every Monday 8:00 AM',
    },
    {
      id: 'comm-3', name: 'Premium Cabin Mix Tracker', category: 'Network & Commercial', frequency: 'Monthly',
      description: 'Premium seat share evolution by aircraft type. New aircraft ~50% premium vs ~30% retiring.',
      format: 'Excel', department: 'Network Planning', owner: 'Fleet Planning', rating: 4.4, views: 1340, isNew: true, isTrending: false,
      relatedConsoleId: 'fleet-modernization', dataSource: 'Fleet Planning System', accessLevel: 'All Finance',
      audience: ['Fleet Planning', 'CCO', 'Revenue Mgmt'], tags: ['premium', 'fleet-renewal', 'mix-shift'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'comm-4', name: 'Corporate RFP & Win-Rate Tracker', category: 'Network & Commercial', frequency: 'Weekly',
      description: 'Corporate-contracted ticket pursuits, win rate by sector (Banking, Aerospace & Defense, Tech). Q1 2026 record quarter.',
      format: 'PowerBI', department: 'Sales', owner: 'Global Sales', rating: 4.5, views: 1620, isNew: false, isTrending: true,
      relatedConsoleId: 'capacity-network', dataSource: 'CRM / SalesForce', accessLevel: 'All Finance',
      audience: ['Global Sales', 'CCO', 'Account Mgmt'], tags: ['corporate', 'rfp', 'win-rate', 'pursuits'], nextUpdate: 'Every Monday 8:00 AM',
    },
    {
      id: 'comm-5', name: 'AmEx & Loyalty Cross-Sell Performance', category: 'Network & Commercial', frequency: 'Weekly',
      description: 'Cardholder spend, acquisitions, Delta Sync engagement, loyalty deferred revenue trend. Trajectory toward $10B AmEx target.',
      format: 'PowerBI', department: 'Loyalty', owner: 'Loyalty Analytics', rating: 4.7, views: 1980, isNew: true, isTrending: true,
      relatedConsoleId: 'loyalty-amex', dataSource: 'Loyalty Platform', accessLevel: 'All Finance',
      audience: ['CMO', 'Loyalty Team', 'CCO'], tags: ['amex', 'loyalty', 'cardholder', 'cross-sell'], nextUpdate: 'Every Monday 8:00 AM',
    },

    // ──────────────────────────────────────────
    // Operations & Reliability (6 reports)
    // ──────────────────────────────────────────
    {
      id: 'ops-1', name: 'Capacity Purchase Agreement Performance', category: 'Operations & Reliability', frequency: 'Monthly',
      description: 'Endeavor (wholly owned), SkyWest, Republic regional carrier performance. CPA cost trends and reliability.',
      format: 'PowerBI', department: 'Network Operations', owner: 'CPA Management', rating: 4.4, views: 1450, isNew: false, isTrending: false,
      relatedConsoleId: 'operations-reliability', dataSource: 'Operations Systems', accessLevel: 'All Finance',
      audience: ['Network Ops', 'CPA Mgmt', 'COO'], tags: ['regional', 'cpa', 'endeavor', 'skywest', 'republic'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'ops-2', name: 'Aircraft Performance & Reliability', category: 'Operations & Reliability', frequency: 'Weekly',
      description: 'Mainline fleet (997 aircraft) reliability metrics by fleet type. Cancellation rates, on-time, maintenance KPIs.',
      format: 'Tableau', department: 'TechOps', owner: 'Reliability Engineering', rating: 4.6, views: 1890, isNew: false, isTrending: true,
      relatedConsoleId: 'operations-reliability', dataSource: 'TechOps Systems', accessLevel: 'All Finance',
      audience: ['TechOps', 'COO', 'Reliability Eng'], tags: ['reliability', 'fleet', 'cancellations', 'on-time'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'ops-3', name: 'Load Factor Trend Report', category: 'Operations & Reliability', frequency: 'Daily',
      description: 'Daily load factor by entity and route bank. Tracks against 84% FY 2025 baseline and seasonal targets.',
      format: 'PowerBI', department: 'Network Planning', owner: 'Network Planning', rating: 4.5, views: 1620, isNew: false, isTrending: false,
      relatedConsoleId: 'capacity-network', dataSource: 'Network Planning System', accessLevel: 'All Finance',
      audience: ['Network Planning', 'Revenue Mgmt', 'CCO'], tags: ['load-factor', 'capacity', 'demand'], nextUpdate: 'Every day 6:00 AM',
    },
    {
      id: 'ops-4', name: 'Aviation Market Intelligence', category: 'Operations & Reliability', frequency: 'Monthly',
      description: 'Industry context: peer financials (UAL, AAL, LUV), McKinsey/IATA data, ULCC pressure, aircraft supply.',
      format: 'PowerBI', department: 'Strategy', owner: 'Strategy Team', rating: 4.3, views: 1080, isNew: true, isTrending: false,
      relatedConsoleId: 'capacity-network', dataSource: 'External Data Feeds', accessLevel: 'Leadership Only',
      audience: ['CEO', 'CFO', 'CCO', 'Strategy'], tags: ['industry', 'peer', 'mckinsey', 'iata'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'ops-5', name: 'Fleet Modernization Tracker', category: 'Operations & Reliability', frequency: 'Monthly',
      description: 'Aircraft delivery schedule (343 firm + 126 options), retirements, average fleet age, capex pace.',
      format: 'Excel', department: 'Fleet Planning', owner: 'Fleet Planning', rating: 4.5, views: 1240, isNew: false, isTrending: false,
      relatedConsoleId: 'fleet-modernization', dataSource: 'Fleet Management', accessLevel: 'All Finance',
      audience: ['Fleet Planning', 'TechOps', 'Treasury'], tags: ['fleet', 'aircraft', 'deliveries', 'retirements'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'ops-6', name: 'Fuel Procurement & Refinery Report', category: 'Operations & Reliability', frequency: 'Weekly',
      description: 'Jet fuel cost vs forward curve, Trainer refinery throughput and crack spread, RIN compliance cost.',
      format: 'PowerBI', department: 'Fuel & Treasury', owner: 'Fuel Hedging', rating: 4.7, views: 2120, isNew: false, isTrending: true,
      relatedConsoleId: 'cost-discipline', dataSource: 'Fuel Operations + Monroe Energy', accessLevel: 'All Finance',
      audience: ['Treasury', 'Fuel Hedging', 'CFO'], tags: ['fuel', 'refinery', 'monroe', 'rins'], nextUpdate: 'Every Monday 6:00 AM',
    },

    // ──────────────────────────────────────────
    // Digital & Technology (6 reports)
    // ──────────────────────────────────────────
    {
      id: 'dig-1', name: 'Delta Sync Platform Dashboard', category: 'Digital & Technology', frequency: 'Weekly',
      description: 'Customer logins (110M+ target), partner engagement (AmEx, T-Mobile, NYT, YouTube Premium, Paramount+), in-flight Wi-Fi metrics.',
      format: 'PowerBI', department: 'Digital', owner: 'Digital Product', rating: 4.6, views: 1750, isNew: true, isTrending: true,
      relatedConsoleId: 'digital-experience', dataSource: 'Delta Sync Platform', accessLevel: 'All Finance',
      audience: ['CDTO', 'CMO', 'Digital Product'], tags: ['delta-sync', 'logins', 'partners'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'dig-2', name: 'Delta Concierge AI Adoption', category: 'Digital & Technology', frequency: 'Weekly',
      description: 'GenAI virtual assistant beta adoption, intent coverage, satisfaction scores. Beta launched April 2026.',
      format: 'PowerBI', department: 'Digital', owner: 'AI/ML Team', rating: 4.4, views: 1180, isNew: true, isTrending: true,
      relatedConsoleId: 'digital-experience', dataSource: 'Delta Concierge', accessLevel: 'All Finance',
      audience: ['CDTO', 'AI/ML', 'Customer Experience'], tags: ['ai', 'genai', 'concierge', 'beta'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'dig-3', name: 'Loyalty Data Monetization', category: 'Digital & Technology', frequency: 'Monthly',
      description: 'Loyalty program revenue from brand-usage and partner agreements. Cash sales from marketing agreements: $8.0B FY 2025.',
      format: 'Excel', department: 'Loyalty', owner: 'Loyalty Analytics', rating: 4.4, views: 1080, isNew: false, isTrending: false,
      relatedConsoleId: 'loyalty-amex', dataSource: 'Loyalty Platform', accessLevel: 'All Finance',
      audience: ['CMO', 'Loyalty', 'FP&A'], tags: ['loyalty', 'brand-usage', 'partners'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'dig-4', name: 'Delta App / Customer Portal Performance', category: 'Digital & Technology', frequency: 'Monthly',
      description: 'Delta app monthly active users, conversion funnels, post-flight satisfaction, biometric ID adoption.',
      format: 'PowerBI', department: 'Digital', owner: 'Mobile Product', rating: 4.5, views: 1320, isNew: false, isTrending: false,
      relatedConsoleId: 'digital-experience', dataSource: 'Delta App Analytics', accessLevel: 'All Finance',
      audience: ['CDTO', 'Mobile Product', 'Customer Experience'], tags: ['app', 'mau', 'biometric', 'kiosk'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'dig-5', name: 'Customer NPS & Cirium Tracking', category: 'Digital & Technology', frequency: 'Monthly',
      description: 'Customer NPS, Cirium on-time ranking trend (#1 N.A. 5 yrs), Skytrax / BTN / Forbes survey results.',
      format: 'Tableau', department: 'Customer Experience', owner: 'CX Analytics', rating: 4.6, views: 1480, isNew: false, isTrending: false,
      relatedConsoleId: 'operations-reliability', dataSource: 'CX Surveys + Cirium', accessLevel: 'All Finance',
      audience: ['CMO', 'CX', 'COO'], tags: ['nps', 'cirium', 'on-time', 'csat'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'dig-6', name: 'Marketing & Brand Report', category: 'Digital & Technology', frequency: 'Monthly',
      description: 'Brand health, share of voice, campaign ROI. Sphere SKY360° Club, Amazon Leo announcement coverage.',
      format: 'PowerBI', department: 'Marketing', owner: 'Brand Marketing', rating: 4.4, views: 1140, isNew: false, isTrending: false,
      relatedConsoleId: 'digital-experience', dataSource: 'Marketing Analytics', accessLevel: 'All Finance',
      audience: ['CMO', 'Brand', 'CMO Office'], tags: ['brand', 'marketing', 'campaigns', 'sphere'], nextUpdate: 'Mar 15, 2026',
    },

    // ──────────────────────────────────────────
    // People & Culture (5 reports)
    // ──────────────────────────────────────────
    {
      id: 'hr-1', name: 'Voluntary Turnover Report', category: 'People & Culture', frequency: 'Monthly',
      description: 'Turnover by function (flight ops, ground, tech ops, corporate). 103,000 FTE; ~20% unionized.',
      format: 'PowerBI', department: 'People', owner: 'HR Analytics', rating: 4.3, views: 980, isNew: false, isTrending: false,
      relatedConsoleId: 'people-culture', dataSource: 'HRIS', accessLevel: 'Leadership Only',
      audience: ['CPO', 'HR Leadership'], tags: ['turnover', 'attrition', 'workforce'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'hr-2', name: 'Pilot Training & Certification', category: 'People & Culture', frequency: 'Monthly',
      description: 'Pilot training pipeline, type ratings, currency, simulator hours. 17,260 pilots (ALPA).',
      format: 'Excel', department: 'Flight Ops', owner: 'Pilot Training', rating: 4.5, views: 1180, isNew: false, isTrending: false,
      relatedConsoleId: 'operations-reliability', dataSource: 'Flight Ops Training', accessLevel: 'All Finance',
      audience: ['Flight Ops', 'COO', 'CPO'], tags: ['pilots', 'training', 'alpa', 'currency'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'hr-3', name: 'Employee Engagement Survey', category: 'People & Culture', frequency: 'Quarterly',
      description: 'Annual employee survey. Fortune Best Companies #9 (2026); Forbes World\'s Best Employers #2 (2025).',
      format: 'PowerBI', department: 'People', owner: 'HR Analytics', rating: 4.5, views: 1280, isNew: false, isTrending: false,
      relatedConsoleId: 'people-culture', dataSource: 'Engagement Survey', accessLevel: 'Leadership Only',
      audience: ['CPO', 'CEO', 'Leadership'], tags: ['engagement', 'culture', 'survey'], nextUpdate: 'Apr 15, 2026',
    },
    {
      id: 'hr-4', name: 'Compensation & Profit-Sharing', category: 'People & Culture', frequency: 'Monthly',
      description: 'Pay-step-up impact, profit-sharing accrual ($165M Q1 2026), Shared Rewards ($67M FY 2025), ALPA contract status.',
      format: 'Excel', department: 'Compensation', owner: 'Comp & Benefits', rating: 4.4, views: 1080, isNew: false, isTrending: false,
      relatedConsoleId: 'people-culture', dataSource: 'Payroll + HRIS', accessLevel: 'Leadership Only',
      audience: ['CPO', 'CFO', 'Comp Committee'], tags: ['compensation', 'profit-sharing', 'alpa'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'hr-5', name: 'Workforce Planning & Headcount', category: 'People & Culture', frequency: 'Monthly',
      description: 'FTE by function, hiring plan, ALPA pilots, flight attendants, tech ops. Cabin crew + ground ops + corporate breakdown.',
      format: 'PowerBI', department: 'People', owner: 'Workforce Planning', rating: 4.2, views: 920, isNew: false, isTrending: false,
      relatedConsoleId: 'people-culture', dataSource: 'HRIS + Operations', accessLevel: 'All Finance',
      audience: ['CPO', 'Functional Leaders'], tags: ['workforce', 'headcount', 'planning'], nextUpdate: 'Mar 15, 2026',
    },

    // ──────────────────────────────────────────
    // Financial Performance (10 reports)
    // ──────────────────────────────────────────
    {
      id: 'fin-1', name: 'Monthly P&L Statement', category: 'Financial Performance', frequency: 'Monthly',
      description: 'GAAP and adjusted P&L with variance to plan and prior year. Q1 2026 GAAP: $501M op income, 3.2% margin.',
      format: 'Excel', department: 'Finance', owner: 'Controller', rating: 4.9, views: 3240, isNew: false, isTrending: true,
      relatedConsoleId: 'financial-performance', dataSource: 'GL System', accessLevel: 'All Finance',
      audience: ['Controller', 'CFO', 'FP&A'], tags: ['pl', 'monthly', 'gaap', 'adjusted'], nextUpdate: 'Apr 5, 2026',
    },
    {
      id: 'fin-2', name: 'Segment-Level P&L (Airline + Refinery)', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Two-segment P&L per Note 14. Airline + Refinery (Monroe) with intersegment eliminations.',
      format: 'Excel', department: 'External Reporting', owner: 'Segment Reporting', rating: 4.7, views: 1860, isNew: false, isTrending: false,
      relatedConsoleId: 'financial-performance', dataSource: 'GL System', accessLevel: 'All Finance',
      audience: ['Controller', 'CFO', 'External Reporting'], tags: ['segment', 'airline', 'refinery', 'monroe'], nextUpdate: 'Apr 5, 2026',
    },
    {
      id: 'fin-3', name: 'Cash Flow Statement', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Operating, investing, financing cash flows. Free cash flow trend toward $3-4B FY 2026 target.',
      format: 'Excel', department: 'Treasury', owner: 'Treasury', rating: 4.7, views: 1740, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Treasury Systems', accessLevel: 'All Finance',
      audience: ['Treasury', 'CFO'], tags: ['cash-flow', 'fcf'], nextUpdate: 'Apr 5, 2026',
    },
    {
      id: 'fin-4', name: 'Balance Sheet', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Q1 2026: Total assets $84.4B; Air Traffic Liability $10.7B; debt $14.2B; equity $20.4B; adjusted net debt $13.5B.',
      format: 'Excel', department: 'Finance', owner: 'Controller', rating: 4.8, views: 2080, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'GL System', accessLevel: 'All Finance',
      audience: ['Controller', 'CFO', 'Treasury'], tags: ['balance-sheet', 'atl', 'debt'], nextUpdate: 'Apr 5, 2026',
    },
    {
      id: 'fin-5', name: 'Aircraft Capex Tracker', category: 'Financial Performance', frequency: 'Monthly',
      description: '$5.5B FY 2026 expected capex. $15.4B aircraft commitments. Q1 2026 actual capex $1.2B.',
      format: 'Excel', department: 'Treasury', owner: 'Capital Planning', rating: 4.5, views: 1380, isNew: false, isTrending: false,
      relatedConsoleId: 'fleet-modernization', dataSource: 'Capital Planning', accessLevel: 'All Finance',
      audience: ['Treasury', 'Fleet Planning', 'CFO'], tags: ['capex', 'aircraft', 'fleet'], nextUpdate: 'Apr 5, 2026',
    },
    {
      id: 'fin-6', name: 'Working Capital & Liquidity', category: 'Financial Performance', frequency: 'Weekly',
      description: 'Q1 2026 liquidity $8.1B. Air Traffic Liability seasonality. DSO 24 days, DPO 38 days.',
      format: 'PowerBI', department: 'Treasury', owner: 'Treasury', rating: 4.6, views: 1620, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Treasury Systems', accessLevel: 'All Finance',
      audience: ['Treasury', 'CFO'], tags: ['liquidity', 'working-capital', 'atl'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'fin-7', name: 'Weekly Revenue Flash', category: 'Financial Performance', frequency: 'Weekly',
      description: 'Weekly revenue tracking against quarterly guidance. Q2 2026 outlook: low-teens YoY growth.',
      format: 'PowerBI', department: 'FP&A', owner: 'FP&A Team', rating: 4.7, views: 2280, isNew: false, isTrending: true,
      relatedConsoleId: 'financial-performance', dataSource: 'Revenue Accounting', accessLevel: 'All Finance',
      audience: ['FP&A', 'CFO', 'CCO'], tags: ['revenue', 'weekly', 'guidance'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'fin-8', name: 'Daily Cash Position', category: 'Financial Performance', frequency: 'Daily',
      description: 'Cash balances, restricted cash, revolver utilization. $5.053B cash at 3/31/26.',
      format: 'PowerBI', department: 'Treasury', owner: 'Cash Management', rating: 4.8, views: 1860, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Treasury Systems', accessLevel: 'All Finance',
      audience: ['Treasury', 'Cash Mgmt', 'CFO'], tags: ['cash', 'liquidity', 'daily'], nextUpdate: 'Every day 9:00 AM',
    },
    {
      id: 'fin-9', name: 'Equity Investments Performance', category: 'Financial Performance', frequency: 'Monthly',
      description: 'JV partner equity stakes: Virgin Atlantic, Aeromexico, LATAM, Hanjin-KAL, China Eastern, WestJet ($3.696B FV at 3/31/26).',
      format: 'Excel', department: 'Treasury', owner: 'Investments', rating: 4.4, views: 1180, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Investment Tracking', accessLevel: 'Leadership Only',
      audience: ['Treasury', 'CFO', 'Investments'], tags: ['equity', 'jv', 'mtm'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'fin-10', name: 'Salaries & Profit-Sharing Expense', category: 'Financial Performance', frequency: 'Monthly',
      description: 'Salaries 30% of opex. FY 2025 $17.5B salaries + $1.3B profit sharing. ALPA contract amendable Dec 31, 2026.',
      format: 'PowerBI', department: 'Finance', owner: 'Compensation Accounting', rating: 4.6, views: 1640, isNew: false, isTrending: false,
      relatedConsoleId: 'cost-discipline', dataSource: 'Payroll + GL', accessLevel: 'All Finance',
      audience: ['Comp Accounting', 'CFO', 'CPO'], tags: ['salaries', 'profit-sharing', 'cost-of-sales'], nextUpdate: 'Apr 5, 2026',
    },

    // ──────────────────────────────────────────
    // Risk & Sustainability (9 reports)
    // ──────────────────────────────────────────
    {
      id: 'risk-1', name: 'SOX Controls Report', category: 'Risk & Sustainability', frequency: 'Quarterly',
      description: 'Internal control over financial reporting, EY auditor coordination, key controls testing status.',
      format: 'Excel', department: 'Internal Audit', owner: 'SOX', rating: 4.4, views: 940, isNew: false, isTrending: false,
      relatedConsoleId: 'risk-compliance', dataSource: 'Audit Management System', accessLevel: 'Leadership Only',
      audience: ['Audit Committee', 'Controller', 'Internal Audit'], tags: ['sox', 'controls', 'audit'], nextUpdate: 'Apr 30, 2026',
    },
    {
      id: 'risk-2', name: 'Cybersecurity & IT Resilience', category: 'Risk & Sustainability', frequency: 'Monthly',
      description: 'NIST framework + ISO 27001 status. TSA implementation plan compliance. AWS cloud migration progress. CrowdStrike-style vendor IT risk monitoring.',
      format: 'PowerBI', department: 'Cybersecurity', owner: 'CISO', rating: 4.6, views: 1480, isNew: true, isTrending: true,
      relatedConsoleId: 'risk-compliance', dataSource: 'Security Operations Center', accessLevel: 'Leadership Only',
      audience: ['CDTO', 'CISO', 'Audit Committee'], tags: ['cyber', 'nist', 'iso27001', 'resilience'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'risk-3', name: 'Enterprise Risk Register', category: 'Risk & Sustainability', frequency: 'Quarterly',
      description: 'Top enterprise risks: fuel volatility, ALPA negotiation, Aeromexico antitrust, climate, cyber, supply chain.',
      format: 'PowerBI', department: 'Risk Management', owner: 'Enterprise Risk', rating: 4.5, views: 1120, isNew: false, isTrending: false,
      relatedConsoleId: 'risk-compliance', dataSource: 'Risk Management Platform', accessLevel: 'Leadership Only',
      audience: ['CEO', 'Risk Committee', 'Board'], tags: ['risk', 'enterprise', 'register'], nextUpdate: 'Apr 30, 2026',
    },
    {
      id: 'risk-4', name: 'Regulatory Compliance Tracker', category: 'Risk & Sustainability', frequency: 'Quarterly',
      description: 'DOT, FAA, TSA, CBP compliance. Aeromexico antitrust appeal status. Slot allocations at JFK, LGA, DCA.',
      format: 'Excel', department: 'External Affairs', owner: 'Regulatory Affairs', rating: 4.3, views: 880, isNew: false, isTrending: false,
      relatedConsoleId: 'risk-compliance', dataSource: 'Regulatory Tracking', accessLevel: 'Leadership Only',
      audience: ['President-External Affairs', 'Legal', 'Government Affairs'], tags: ['regulatory', 'dot', 'faa', 'antitrust'], nextUpdate: 'Apr 30, 2026',
    },
    {
      id: 'risk-5', name: 'Sustainability & SAF Tracker', category: 'Risk & Sustainability', frequency: 'Quarterly',
      description: 'Net-zero 2050 progress. SAF procurement, EU mandate compliance (2% rising to 70%). 55M gallons saved 2025.',
      format: 'PowerBI', department: 'Sustainability', owner: 'Chief Sustainability Officer', rating: 4.4, views: 1080, isNew: false, isTrending: false,
      relatedConsoleId: 'sustainability', dataSource: 'Sustainability Tracking', accessLevel: 'All Finance',
      audience: ['CSO', 'Operations', 'IR'], tags: ['saf', 'sustainability', 'net-zero', 'corsia'], nextUpdate: 'Apr 30, 2026',
    },
    {
      id: 'risk-6', name: 'Earnings Pre-Read Package', category: 'Risk & Sustainability', frequency: 'Quarterly',
      description: 'IR pre-read for earnings calls. Q&A prep, peer comparison, analyst sentiment, stock-price target context.',
      format: 'PDF', department: 'Investor Relations', owner: 'VP-Investor Relations', rating: 4.7, views: 1820, isNew: false, isTrending: true,
      relatedConsoleId: 'investor-relations', dataSource: 'IR + Multiple Systems', accessLevel: 'Leadership Only',
      audience: ['CEO', 'CFO', 'IR Team'], tags: ['ir', 'earnings', 'pre-read'], nextUpdate: 'Apr 30, 2026',
    },
    {
      id: 'risk-7', name: 'SEC Filing Checklist', category: 'Risk & Sustainability', frequency: 'Quarterly',
      description: '10-K, 10-Q, 8-K filing checklist. EY review coordination. XBRL tagging status.',
      format: 'Excel', department: 'External Reporting', owner: 'SEC Reporting', rating: 4.5, views: 720, isNew: false, isTrending: false,
      relatedConsoleId: 'investor-relations', dataSource: 'External Reporting', accessLevel: 'Leadership Only',
      audience: ['SEC Reporting', 'Controller', 'Legal'], tags: ['sec', '10-k', '10-q', 'xbrl'], nextUpdate: 'Apr 30, 2026',
    },
    {
      id: 'risk-8', name: 'Internal Audit Tracker', category: 'Risk & Sustainability', frequency: 'Monthly',
      description: 'Internal audit plan execution, findings, management responses, remediation status.',
      format: 'PowerBI', department: 'Internal Audit', owner: 'Chief Audit Executive', rating: 4.4, views: 880, isNew: false, isTrending: false,
      relatedConsoleId: 'risk-compliance', dataSource: 'Audit Management', accessLevel: 'Leadership Only',
      audience: ['Audit Committee', 'CAE', 'Functional Leaders'], tags: ['internal-audit', 'findings'], nextUpdate: 'Mar 15, 2026',
    },
    {
      id: 'risk-9', name: 'Safety & Reliability Compliance', category: 'Risk & Sustainability', frequency: 'Monthly',
      description: 'Safety Management System, FAA compliance, incident tracking, mainline + regional carrier safety metrics.',
      format: 'PowerBI', department: 'Safety', owner: 'Chief Safety Officer', rating: 4.7, views: 1240, isNew: false, isTrending: false,
      relatedConsoleId: 'operations-reliability', dataSource: 'Safety Management System', accessLevel: 'All Finance',
      audience: ['Safety', 'COO', 'Flight Ops'], tags: ['safety', 'sms', 'faa', 'compliance'], nextUpdate: 'Mar 15, 2026',
    },
  ],
};
