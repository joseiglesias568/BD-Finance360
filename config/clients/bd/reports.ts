// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/reports.ts
//
// Report metadata is illustrative for demonstration.
// Department names map to BD's segment structure and corporate functions.
// ─────────────────────────────────────────────────────────────────────
import { ReportsConfig } from '../../types';

export const reports: ReportsConfig = {
  totalReports: 40,
  categories: [
    'Monthly Operating Review',
    'Segment Performance',
    'Adjusted EPS Bridge',
    'Free Cash Flow Analysis',
    'R&D Pipeline',
    'Competitive Benchmarking',
    'Regulatory Compliance',
  ],
  reports: [
    // ──────────────────────────────────────────
    // Monthly Operating Review — 7 reports
    // ──────────────────────────────────────────
    {
      id: 'mor-1', name: 'Monthly Enterprise Operating Review', category: 'Monthly Operating Review', frequency: 'Monthly',
      description: 'Enterprise consolidated P&L vs AOP: revenue, adj. gross margin, adj. operating income, adj. EPS. FY2026 guidance tracking. Segment contributions and bridges. BD Excellence program scorecard.',
      format: 'PowerBI', department: 'Finance', owner: 'Enterprise FP&A', rating: 4.9, views: 4200, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-performance', dataSource: 'Enterprise ERP / Consolidation System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'Segment Presidents', 'IR'], tags: ['monthly-review', 'aop', 'eps', 'guidance'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'mor-2', name: 'Organic Revenue Growth (FXN) Dashboard', category: 'Monthly Operating Review', frequency: 'Monthly',
      description: 'Organic revenue growth by segment and geography. FXN vs reported growth bridge. China VoBP headwind quantification. Emerging markets offset tracking vs plan.',
      format: 'PowerBI', department: 'Finance', owner: 'Revenue Analytics FP&A', rating: 4.8, views: 3100, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-performance', dataSource: 'Revenue Management System / FX Module', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'Segment Presidents', 'IR'], tags: ['organic-growth', 'fxn', 'china', 'emerging-markets'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'mor-3', name: 'BD Excellence Program Scorecard', category: 'Monthly Operating Review', frequency: 'Monthly',
      description: 'BD Excellence cost-out program: $200M target tracking ($150M run-rate Q2 FY26). Manufacturing productivity by plant (target >8%). OTIF service level. Commercial excellence leading indicators.',
      format: 'PowerBI', department: 'Operations', owner: 'BD Excellence PMO', rating: 4.8, views: 2600, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-performance', dataSource: 'BD Excellence Tracking System', accessLevel: 'Finance + Operations',
      audience: ['CFO', 'COO', 'CEO', 'Segment Presidents'], tags: ['bd-excellence', 'cost-out', 'productivity', 'otif'], nextUpdate: 'Monthly Day 7',
    },
    {
      id: 'mor-4', name: 'China Revenue & VoBP Tracker', category: 'Monthly Operating Review', frequency: 'Monthly',
      description: 'China revenue by segment and product category. VoBP program impact: affected vs unaffected categories. Private hospital channel development. Emerging markets offset (India, SE Asia, LatAm) tracking.',
      format: 'PowerBI', department: 'Finance', owner: 'APAC Finance / Corporate FP&A', rating: 4.7, views: 2300, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-performance', dataSource: 'Geographic Revenue System / China Ops', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'APAC President', 'IR'], tags: ['china', 'vobp', 'emerging-markets', 'geographic'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'mor-5', name: 'BD Alaris Commercial Return Tracker', category: 'Monthly Operating Review', frequency: 'Weekly',
      description: 'BD Alaris infusion pump remediation: customer site completion progress (78% Q2 FY26 baseline). Weekly milestone vs 100% Q4 FY26 target. Connected Care revenue ramp projection. FDA consent decree compliance.',
      format: 'PowerBI', department: 'Finance', owner: 'Connected Care Finance / Regulatory Affairs', rating: 4.9, views: 3800, isNew: false, isTrending: true,
      relatedConsoleId: 'connected-care', dataSource: 'Alaris Remediation Program Management System', accessLevel: 'Finance + Regulatory',
      audience: ['CFO', 'Connected Care President', 'CEO', 'IR'], tags: ['alaris', 'remediation', 'connected-care', 'fda'], nextUpdate: 'Every Monday 7:00 AM',
    },
    {
      id: 'mor-6', name: 'Free Cash Flow Monthly Tracker', category: 'Monthly Operating Review', frequency: 'Monthly',
      description: 'FCF YTD vs $3.0B FY2026 target. H1 FY26 actual $1,095M. Bridge: EBITDA, capex (~3.5% revenue), working capital, restructuring. Net leverage trajectory to 2.5x.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury / Corporate FP&A', rating: 4.8, views: 2700, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Treasury Cash Management / ERP', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'Treasury VP', 'IR'], tags: ['fcf', 'cash-flow', 'leverage', 'capex'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'mor-7', name: 'New Product Revenue (NPI) Tracker', category: 'Monthly Operating Review', frequency: 'Monthly',
      description: 'Revenue from products launched in past 3 years as % of total. Current: 18%, target >20%. GLP-1 delivery device pipeline. Interventional new launch contribution. R&D investment vs NPI revenue correlation.',
      format: 'PowerBI', department: 'Finance', owner: 'R&D Finance / Commercial Analytics', rating: 4.7, views: 1900, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-performance', dataSource: 'New Product Revenue Tracking System', accessLevel: 'Finance + R&D',
      audience: ['CFO', 'CTO', 'Segment Presidents', 'IR'], tags: ['npi', 'innovation', 'new-products', 'pipeline'], nextUpdate: 'Monthly Day 11',
    },

    // ──────────────────────────────────────────
    // Segment Performance — 8 reports
    // ──────────────────────────────────────────
    {
      id: 'seg-1', name: 'Medical Essentials Segment Performance Report', category: 'Segment Performance', frequency: 'Monthly',
      description: 'Medical Essentials revenue: MDS $4,575M and Specimen Management $1,523M FY25. Organic growth +1.7% FXN Q2 FY26. China VoBP impact by product category. Pricing realization and mix.',
      format: 'PowerBI', department: 'Finance', owner: 'Medical Essentials FP&A', rating: 4.7, views: 1800, isNew: false, isTrending: false,
      relatedConsoleId: 'medical-essentials', dataSource: 'Segment P&L System', accessLevel: 'All Finance',
      audience: ['CFO', 'Medical Essentials President', 'IR'], tags: ['medical-essentials', 'mds', 'specimen', 'segment'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'seg-2', name: 'Connected Care Segment Performance Report', category: 'Segment Performance', frequency: 'Monthly',
      description: 'Connected Care revenue: MMS $3,474M and APM $1,082M FY25. Alaris remediation milestones. HemoSphere growth. Pyxis dispensing volumes. FDA Warning Letter remediation status.',
      format: 'PowerBI', department: 'Finance', owner: 'Connected Care FP&A', rating: 4.8, views: 2200, isNew: false, isTrending: true,
      relatedConsoleId: 'connected-care', dataSource: 'Segment P&L System', accessLevel: 'All Finance',
      audience: ['CFO', 'Connected Care President', 'IR'], tags: ['connected-care', 'alaris', 'hemosphere', 'pyxis'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'seg-3', name: 'BioPharma Systems Segment Performance Report', category: 'Segment Performance', frequency: 'Monthly',
      description: 'BioPharma Systems revenue $2,324M FY25. Organic growth -1.8% FXN Q2 FY26 (destocking). GLP-1 order pipeline and device platform development milestones. Prefillable syringe capacity utilization.',
      format: 'PowerBI', department: 'Finance', owner: 'BioPharma Systems FP&A', rating: 4.7, views: 1700, isNew: false, isTrending: false,
      relatedConsoleId: 'biopharma-systems', dataSource: 'Segment P&L System', accessLevel: 'All Finance',
      audience: ['CFO', 'BioPharma Systems President', 'IR'], tags: ['biopharma', 'glp1', 'prefillable', 'destocking'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'seg-4', name: 'Interventional Segment Performance Report', category: 'Segment Performance', frequency: 'Monthly',
      description: 'Interventional revenue: Surgery $1,572M, PI $1,996M, UCC $1,649M FY25. Organic growth +5.3% FXN Q2 FY26. Procedure volume trends. New product launch contribution. Geographic performance.',
      format: 'PowerBI', department: 'Finance', owner: 'Interventional FP&A', rating: 4.8, views: 2400, isNew: false, isTrending: true,
      relatedConsoleId: 'interventional', dataSource: 'Segment P&L System', accessLevel: 'All Finance',
      audience: ['CFO', 'Interventional President', 'IR'], tags: ['interventional', 'surgery', 'peripheral', 'urology'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'seg-5', name: 'Segment Organic Growth Waterfall', category: 'Segment Performance', frequency: 'Quarterly',
      description: 'Quarterly organic growth contribution by segment: Medical Essentials, Connected Care, BioPharma Systems, Interventional. FXN price, volume, and mix decomposition. China VoBP isolation. Portfolio bridge.',
      format: 'PowerBI', department: 'Finance', owner: 'Enterprise FP&A', rating: 4.9, views: 3200, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-performance', dataSource: 'Revenue Management / Segment P&L', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'Segment Presidents', 'IR'], tags: ['waterfall', 'organic-growth', 'segments', 'bridge'], nextUpdate: 'Quarterly Day 8',
    },
    {
      id: 'seg-6', name: 'GLP-1 Drug Delivery Market Opportunity Report', category: 'Segment Performance', frequency: 'Quarterly',
      description: 'GLP-1 delivery device market: TAM sizing, BD BioPharma Systems positioning, competitor landscape (Owen Mumford, Ypsomed). Customer pipeline — BD commercial discussions with GLP-1 drug manufacturers. Revenue ramp timeline.',
      format: 'PowerBI', department: 'Strategy', owner: 'BioPharma Strategy / Corporate Development', rating: 4.8, views: 2900, isNew: true, isTrending: true,
      relatedConsoleId: 'biopharma-systems', dataSource: 'Market Research / Customer Pipeline', accessLevel: 'Finance + Strategy',
      audience: ['CFO', 'CEO', 'BioPharma Systems President', 'IR'], tags: ['glp1', 'biopharma', 'drug-delivery', 'market-opportunity'], nextUpdate: 'Quarterly Day 12',
    },
    {
      id: 'seg-7', name: 'Interventional Growth — Procedure Volume Tracker', category: 'Segment Performance', frequency: 'Monthly',
      description: 'Interventional end-market procedure volumes: peripheral vascular, oncology intervention, electrophysiology, urology, critical care. Hospital procedure recovery trend. BD market share by procedure category.',
      format: 'PowerBI', department: 'Finance', owner: 'Interventional Market Analytics', rating: 4.7, views: 2100, isNew: false, isTrending: false,
      relatedConsoleId: 'interventional', dataSource: 'Market Intelligence / Procedure Database', accessLevel: 'Finance + Commercial',
      audience: ['CFO', 'Interventional President', 'CEO'], tags: ['interventional', 'procedures', 'volume', 'market-share'], nextUpdate: 'Monthly Day 12',
    },
    {
      id: 'seg-8', name: 'Connected Care Digital Health KPI Report', category: 'Segment Performance', frequency: 'Monthly',
      description: 'Connected medication management KPIs: Alaris installations, Pyxis dispenses, HemoSphere monitoring sessions, medication error prevention rate. Customer satisfaction and contract renewal metrics.',
      format: 'PowerBI', department: 'Finance', owner: 'Connected Care Product Finance', rating: 4.6, views: 1500, isNew: false, isTrending: false,
      relatedConsoleId: 'connected-care', dataSource: 'MedConnect Platform / CRM', accessLevel: 'Finance + Product Management',
      audience: ['CFO', 'Connected Care President', 'Product VP'], tags: ['connected-care', 'digital-health', 'alaris', 'hemosphere'], nextUpdate: 'Monthly Day 10',
    },

    // ──────────────────────────────────────────
    // Adjusted EPS Bridge — 5 reports
    // ──────────────────────────────────────────
    {
      id: 'eps-1', name: 'Quarterly Adj. EPS Bridge vs Guidance', category: 'Adjusted EPS Bridge', frequency: 'Quarterly',
      description: 'Quarterly adj. EPS waterfall vs $12.52–$12.72 FY2026 guidance. Bridge: revenue growth, gross margin, R&D, SG&A, interest expense, tax rate, share count. Q2 FY26: $3.58. FY25 baseline: $11.90.',
      format: 'PowerBI', department: 'Finance', owner: 'Enterprise FP&A / IR', rating: 4.9, views: 4100, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-performance', dataSource: 'Consolidated P&L / EPS Model', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'IR', 'Board'], tags: ['eps', 'bridge', 'guidance', 'waterfall'], nextUpdate: 'Quarterly Day 8',
    },
    {
      id: 'eps-2', name: 'GAAP to Adjusted EPS Reconciliation', category: 'Adjusted EPS Bridge', frequency: 'Quarterly',
      description: 'GAAP to adjusted EPS bridge: intangible amortization (Bard + CareFusion acquisitions), restructuring charges, acquisition-related costs, non-GAAP tax adjustments. Delta quantified and year-over-year change explained.',
      format: 'PowerBI', department: 'Finance', owner: 'External Reporting / Tax', rating: 4.7, views: 1900, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-performance', dataSource: 'GAAP Reporting System / Tax', accessLevel: 'Finance + Legal',
      audience: ['CFO', 'Controller', 'Tax VP', 'IR'], tags: ['gaap', 'non-gaap', 'reconciliation', 'amortization'], nextUpdate: 'Quarterly Day 9',
    },
    {
      id: 'eps-3', name: 'Currency Impact on EPS — FX Sensitivity', category: 'Adjusted EPS Bridge', frequency: 'Quarterly',
      description: 'FX translation and transaction impact on adj. EPS. Major currencies: EUR, JPY, CNY, GBP. Hedging program effectiveness. FX-neutral vs reported EPS delta. FY2026 currency assumption vs spot rates.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury / FX Risk Management', rating: 4.7, views: 1700, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-performance', dataSource: 'Treasury FX System / EPS Model', accessLevel: 'Finance + Treasury',
      audience: ['CFO', 'Treasury VP', 'IR'], tags: ['fx', 'currency', 'eps', 'hedging'], nextUpdate: 'Quarterly Day 7',
    },
    {
      id: 'eps-4', name: 'Share Repurchase (ASR) Impact on EPS', category: 'Adjusted EPS Bridge', frequency: 'Quarterly',
      description: 'Accelerated Share Repurchase program execution: shares retired, average price, remaining authorization. EPS accretion from share count reduction. Diluted share count trend (target ~280M). ASR vs debt paydown capital allocation tradeoff.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury / IR', rating: 4.7, views: 2000, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Treasury / Share Register', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'Treasury VP', 'Board'], tags: ['asr', 'buyback', 'eps', 'share-count'], nextUpdate: 'Quarterly Day 10',
    },
    {
      id: 'eps-5', name: 'Interest Expense and Debt Cost Tracker', category: 'Adjusted EPS Bridge', frequency: 'Monthly',
      description: 'Interest expense vs $613M FY2025 baseline. Debt paydown impact on quarterly interest burden. Weighted average cost of debt. Leverage ratio improvement vs interest expense savings. Path to EPS benefit as leverage declines.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury', rating: 4.6, views: 1400, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Debt Register / Treasury System', accessLevel: 'Finance + Treasury',
      audience: ['CFO', 'Treasury VP', 'Controller'], tags: ['interest-expense', 'debt', 'leverage', 'cost-of-capital'], nextUpdate: 'Monthly Day 8',
    },

    // ──────────────────────────────────────────
    // Free Cash Flow Analysis — 4 reports
    // ──────────────────────────────────────────
    {
      id: 'fcf-1', name: 'Free Cash Flow vs $3B Target Dashboard', category: 'Free Cash Flow Analysis', frequency: 'Monthly',
      description: 'Monthly FCF vs $3.0B FY2026 target. H1 FY26: $1,095M. FCF bridge: operating cash flow, capex, restructuring payments. Quarterly seasonality analysis. FY2025 baseline $2.8B.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury / Corporate FP&A', rating: 4.8, views: 2800, isNew: false, isTrending: true,
      relatedConsoleId: 'capital-structure', dataSource: 'Cash Management / ERP', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'Treasury VP', 'IR'], tags: ['fcf', 'cash-flow', '3b-target', 'working-capital'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'fcf-2', name: 'Capital Expenditure vs 3.5% Revenue Target', category: 'Free Cash Flow Analysis', frequency: 'Monthly',
      description: 'Monthly capex vs 3.5% of revenues target. Capex by category: manufacturing, quality systems, IT/digital, R&D facilities. Major project tracking. Return on invested capital for capital projects.',
      format: 'PowerBI', department: 'Finance', owner: 'Capital Planning / Corporate FP&A', rating: 4.6, views: 1500, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Capital Project Management System', accessLevel: 'Finance + Operations',
      audience: ['CFO', 'COO', 'Segment Presidents'], tags: ['capex', 'capital-expenditure', 'roic', 'manufacturing'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'fcf-3', name: 'Working Capital Efficiency Report', category: 'Free Cash Flow Analysis', frequency: 'Monthly',
      description: 'DSO, inventory days, DPO trends by segment. Working capital as % of revenue. BD Excellence supply chain improvements impact on cash conversion. Quarterly working capital cycle.',
      format: 'PowerBI', department: 'Finance', owner: 'Working Capital FP&A', rating: 4.6, views: 1400, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'ERP / A/R and A/P Systems', accessLevel: 'Finance + Operations',
      audience: ['CFO', 'COO', 'Controller'], tags: ['working-capital', 'dso', 'inventory', 'dpo'], nextUpdate: 'Monthly Day 11',
    },
    {
      id: 'fcf-4', name: 'Debt Maturity and Deleveraging Plan', category: 'Free Cash Flow Analysis', frequency: 'Quarterly',
      description: 'BD long-term debt maturity schedule (Bard/CareFusion legacy). Net leverage 2.9x → 2.5x target path. Debt paydown timeline and interest savings. ASR vs debt prepayment capital allocation decision framework.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury', rating: 4.7, views: 1700, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Debt Register / Treasury System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'Treasury VP', 'CEO', 'Board'], tags: ['debt', 'leverage', 'deleverage', 'maturity'], nextUpdate: 'Quarterly Day 12',
    },

    // ──────────────────────────────────────────
    // R&D Pipeline — 5 reports
    // ──────────────────────────────────────────
    {
      id: 'rd-1', name: 'R&D Pipeline Status and Milestone Tracker', category: 'R&D Pipeline', frequency: 'Monthly',
      description: 'Active R&D programs by segment and stage (Discovery/Development/Submission/Approval). FDA 510(k)/PMA submissions YTD: 12 H1 FY26. Key pipeline: GLP-1 delivery, HemoSphere next-gen, BD Alaris next-generation platform.',
      format: 'PowerBI', department: 'R&D Finance', owner: 'R&D Finance / Regulatory', rating: 4.8, views: 2400, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-performance', dataSource: 'R&D Project Management System', accessLevel: 'Finance + R&D + Regulatory',
      audience: ['CFO', 'CTO', 'CEO', 'Segment Presidents'], tags: ['rd', 'pipeline', 'fda', '510k'], nextUpdate: 'Monthly Day 12',
    },
    {
      id: 'rd-2', name: 'R&D Spend vs 6.0% Revenue Target', category: 'R&D Pipeline', frequency: 'Monthly',
      description: 'Monthly R&D expense vs 6.0% of revenue target (FY25: 5.8% = $1,055M). By segment and program. R&D headcount. Capitalized vs expensed split. BD Excellence R&D efficiency program tracking.',
      format: 'PowerBI', department: 'R&D Finance', owner: 'R&D Finance', rating: 4.7, views: 1800, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-performance', dataSource: 'R&D Spend Tracking / ERP', accessLevel: 'Finance + R&D',
      audience: ['CFO', 'CTO', 'CEO'], tags: ['rd-spend', 'innovation', 'investment', '6percent'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'rd-3', name: 'GLP-1 Delivery Device Pipeline Status', category: 'R&D Pipeline', frequency: 'Monthly',
      description: 'GLP-1 drug delivery pipeline: prefillable syringes, autoinjectors, and next-gen self-injection platforms. Customer commercial discussions timeline. TAM sizing ($5B+ addressable). Revenue ramp assumptions vs destocking timeline.',
      format: 'PowerBI', department: 'Strategy / R&D Finance', owner: 'BioPharma Systems Strategy', rating: 4.9, views: 3200, isNew: true, isTrending: true,
      relatedConsoleId: 'biopharma-systems', dataSource: 'Customer Pipeline / R&D System', accessLevel: 'Finance + Strategy + R&D',
      audience: ['CFO', 'CEO', 'BioPharma Systems President', 'IR'], tags: ['glp1', 'drug-delivery', 'pipeline', 'biopharma'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'rd-4', name: 'FDA Regulatory Submissions and Approvals Log', category: 'R&D Pipeline', frequency: 'Monthly',
      description: 'All FDA 510(k), PMA, and De Novo submissions: status, expected approval date, commercial launch timeline. Warning Letter remediation status. Regulatory intelligence on pending guidance affecting BD products.',
      format: 'PowerBI', department: 'Regulatory Affairs / Finance', owner: 'Regulatory Affairs', rating: 4.7, views: 2000, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-performance', dataSource: 'FDA Regulatory Tracking System', accessLevel: 'Finance + Regulatory',
      audience: ['CFO', 'Chief Regulatory Officer', 'CEO'], tags: ['fda', 'regulatory', 'submissions', 'clearances'], nextUpdate: 'Monthly Day 14',
    },
    {
      id: 'rd-5', name: 'New Product Introduction (NPI) Revenue Ramp', category: 'R&D Pipeline', frequency: 'Quarterly',
      description: 'Revenue ramp for new product launches by cohort year. NPI revenue as % of total (current 18%, target >20%). Launch performance vs forecast by product and geography. BD Excellence commercial launch playbook effectiveness.',
      format: 'PowerBI', department: 'Finance / Commercial', owner: 'Commercial Excellence / R&D Finance', rating: 4.7, views: 1900, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-performance', dataSource: 'NPI Revenue Tracking / CRM', accessLevel: 'Finance + Commercial + R&D',
      audience: ['CFO', 'CTO', 'Segment Presidents'], tags: ['npi', 'new-products', 'launch', 'ramp'], nextUpdate: 'Quarterly Day 11',
    },

    // ──────────────────────────────────────────
    // Competitive Benchmarking — 4 reports
    // ──────────────────────────────────────────
    {
      id: 'cmp-1', name: 'MedTech Peer Revenue Growth Benchmarking', category: 'Competitive Benchmarking', frequency: 'Quarterly',
      description: 'BD organic revenue growth vs MedTech peers: Baxter (BAX), Abbott (ABT), Medtronic (MDT), Stryker (SYK), Boston Scientific (BSX). Reported and FXN organic rates. BD relative performance positioning.',
      format: 'PowerBI', department: 'Finance', owner: 'Corporate Strategy / IR', rating: 4.8, views: 2700, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-performance', dataSource: 'Bloomberg / Peer Earnings Data', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'IR', 'Board'], tags: ['competitive', 'peers', 'benchmarking', 'growth'], nextUpdate: 'Quarterly Day 15',
    },
    {
      id: 'cmp-2', name: 'MedTech Peer Margin Benchmarking', category: 'Competitive Benchmarking', frequency: 'Quarterly',
      description: 'BD adjusted operating margin vs MedTech peers. Gross margin comparison. R&D investment rate benchmarking. BD Excellence progress toward closing margin gap with higher-margin peers (Stryker 28%+, BSX 26%+).',
      format: 'PowerBI', department: 'Finance', owner: 'Corporate Strategy / FP&A', rating: 4.7, views: 2200, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-performance', dataSource: 'Peer Public Filings / Bloomberg', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'IR', 'Board'], tags: ['competitive', 'margin', 'peers', 'benchmarking'], nextUpdate: 'Quarterly Day 15',
    },
    {
      id: 'cmp-3', name: 'Peripheral Intervention Competitive Intelligence', category: 'Competitive Benchmarking', frequency: 'Quarterly',
      description: 'BD vs Boston Scientific, Medtronic, Abbott in peripheral vascular, oncology intervention, electrophysiology markets. Win/loss rate in competitive PI bids. Market share dynamics and new product positioning.',
      format: 'PowerBI', department: 'Strategy', owner: 'Interventional Market Intelligence', rating: 4.7, views: 1800, isNew: false, isTrending: false,
      relatedConsoleId: 'interventional', dataSource: 'Market Intelligence / Win-Loss Database', accessLevel: 'Finance + Commercial',
      audience: ['CFO', 'Interventional President', 'CEO'], tags: ['interventional', 'competitive', 'pi', 'market-share'], nextUpdate: 'Quarterly Day 16',
    },
    {
      id: 'cmp-4', name: 'BioPharma Delivery Device Competitive Landscape', category: 'Competitive Benchmarking', frequency: 'Semi-Annual',
      description: 'Prefillable syringe and drug delivery device market: BD vs Gerresheimer, Schott, Owen Mumford, Ypsomed. Capacity comparison. GLP-1 device contract wins and pipeline by manufacturer. BD differentiation on quality and scale.',
      format: 'PowerBI', department: 'Strategy', owner: 'BioPharma Systems Strategy', rating: 4.6, views: 1400, isNew: false, isTrending: false,
      relatedConsoleId: 'biopharma-systems', dataSource: 'Market Research / Customer Intelligence', accessLevel: 'Finance + Strategy + Commercial',
      audience: ['CFO', 'BioPharma Systems President', 'CEO'], tags: ['biopharma', 'competitive', 'drug-delivery', 'prefillable'], nextUpdate: 'Semi-Annual',
    },

    // ──────────────────────────────────────────
    // Regulatory Compliance — 4 reports
    // ──────────────────────────────────────────
    {
      id: 'reg-1', name: 'FDA Enforcement Action & Warning Letter Status', category: 'Regulatory Compliance', frequency: 'Weekly',
      description: '2 active FDA Warning Letters: Dispensing (Pyxis) and Specimen Management. Remediation milestones, inspection readiness. Response timelines. BD Alaris FDA consent decree compliance tracking.',
      format: 'PowerBI', department: 'Regulatory Affairs / Finance', owner: 'Global Regulatory Affairs', rating: 4.9, views: 3000, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-performance', dataSource: 'FDA Regulatory Compliance System', accessLevel: 'Finance + Regulatory + Executive',
      audience: ['CFO', 'Chief Regulatory Officer', 'CEO', 'Board'], tags: ['fda', 'warning-letter', 'compliance', 'enforcement'], nextUpdate: 'Every Monday 8:00 AM',
    },
    {
      id: 'reg-2', name: 'Product Quality and Recall Rate Monitor', category: 'Regulatory Compliance', frequency: 'Monthly',
      description: 'Product recall rate vs 0.3% baseline (below 0.5% industry benchmark). Recall type (Class I/II/III) trend. Field corrective action tracking. Quality complaint rate and CAPA (corrective and preventive action) closure.',
      format: 'PowerBI', department: 'Quality / Finance', owner: 'Global Quality Assurance', rating: 4.8, views: 2200, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-performance', dataSource: 'Quality Management System (QMS)', accessLevel: 'Finance + Quality + Regulatory',
      audience: ['CFO', 'Chief Quality Officer', 'Regulatory Affairs VP'], tags: ['quality', 'recalls', 'capa', 'compliance'], nextUpdate: 'Monthly Day 7',
    },
    {
      id: 'reg-3', name: 'Global Regulatory Intelligence Report', category: 'Regulatory Compliance', frequency: 'Monthly',
      description: 'EU MDR compliance status. China NMPA regulatory changes — VoBP regulatory framework updates. ANVISA Brazil, CDSCO India, PDMA Japan. Global regulatory pathway changes affecting BD products and market access.',
      format: 'PowerBI', department: 'Regulatory Affairs', owner: 'Global Regulatory Intelligence', rating: 4.6, views: 1400, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-performance', dataSource: 'Regulatory Intelligence Database', accessLevel: 'Regulatory + Finance + Legal',
      audience: ['Chief Regulatory Officer', 'CFO', 'General Counsel'], tags: ['regulatory', 'global', 'eu-mdr', 'nmpa'], nextUpdate: 'Monthly Day 15',
    },
    {
      id: 'reg-4', name: 'BD Alaris Consent Decree Compliance Report', category: 'Regulatory Compliance', frequency: 'Monthly',
      description: 'BD Alaris consent decree compliance milestones and corrective action deadlines. Quality system improvements. FDA inspection readiness. Remediation cost accruals. Customer notification obligations progress.',
      format: 'PowerBI', department: 'Regulatory Affairs / Finance', owner: 'Alaris Regulatory Program', rating: 4.8, views: 2500, isNew: false, isTrending: true,
      relatedConsoleId: 'connected-care', dataSource: 'Alaris Consent Decree Tracking System', accessLevel: 'Finance + Regulatory + Executive',
      audience: ['CFO', 'Chief Regulatory Officer', 'CEO', 'Board'], tags: ['alaris', 'consent-decree', 'fda', 'compliance'], nextUpdate: 'Monthly Day 8',
    },
  ],
};
