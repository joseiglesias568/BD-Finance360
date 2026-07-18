// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/reports.ts
//
// Report metadata (frequency, department, audience, rating, views) is
// illustrative for demonstration. Department names map to BD's
// segment structure (HCB/Aetna, HSS/Caremark, PCW, Corporate).
// ─────────────────────────────────────────────────────────────────────
import { ReportsConfig } from '../../types';

export const reports: ReportsConfig = {
  totalReports: 42,
  categories: [
    'Health Care Benefits (Aetna)',
    'Health Services (Caremark)',
    'Pharmacy & Consumer Wellness',
    'Enterprise Finance & EPS',
    'Medicare Advantage & Government',
    'Specialty Pharmacy & Drug Trend',
    'Capital Structure & Treasury',
  ],
  reports: [
    // ──────────────────────────────────────────
    // Health Care Benefits (Aetna) — 8 reports
    // ──────────────────────────────────────────
    {
      id: 'hcb-1', name: 'Medical Benefit Ratio Weekly Monitor', category: 'Health Care Benefits (Aetna)', frequency: 'Weekly',
      description: 'Rolling MBR tracker vs 90.5% FY2026 guidance (±50bps). Prior year development quantification. MA vs commercial vs Medicaid MBR decomposition. Q1 2026: 84.6% — favorable development benefit tracked separately.',
      format: 'PowerBI', department: 'Finance', owner: 'HCB Actuarial / FP&A', rating: 4.9, views: 3100, isNew: false, isTrending: true,
      relatedConsoleId: 'health-care-benefits', dataSource: 'Aetna Claims Adjudication System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'HCB President', 'CEO', 'IR'], tags: ['mbr', 'medical-costs', 'aetna', 'guidance'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'hcb-2', name: 'Medical Membership Enrollment Dashboard', category: 'Health Care Benefits (Aetna)', frequency: 'Monthly',
      description: 'Total medical membership by plan type: Medicare Advantage, Medicaid, commercial insured, commercial fee-based. 26.0M Q1 2026 baseline. ACA exit and MA market dynamics tracked monthly.',
      format: 'PowerBI', department: 'Finance', owner: 'HCB Revenue Accounting', rating: 4.8, views: 2400, isNew: false, isTrending: false,
      relatedConsoleId: 'health-care-benefits', dataSource: 'Aetna Enrollment System', accessLevel: 'All Finance',
      audience: ['CFO', 'HCB President', 'IR', 'Actuary'], tags: ['membership', 'enrollment', 'ma', 'medicaid'], nextUpdate: 'Monthly Day 5',
    },
    {
      id: 'hcb-3', name: 'Medicare Advantage Margin Recovery Tracker', category: 'Health Care Benefits (Aetna)', frequency: 'Monthly',
      description: 'MA segment margin trajectory vs 3% target by 2028. Current: ~1.5%. Monthly margin bridge: premium rate adequacy, medical cost management, AEP membership mix. Exited ACA markets excluded.',
      format: 'PowerBI', department: 'Finance', owner: 'MA Finance', rating: 4.9, views: 2900, isNew: false, isTrending: true,
      relatedConsoleId: 'health-care-benefits', dataSource: 'MA Segment P&L System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'HCB President', 'CEO', 'Board'], tags: ['ma', 'margin', 'recovery', '2028-target'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'hcb-4', name: 'Prior Authorization Efficiency Monitor', category: 'Health Care Benefits (Aetna)', frequency: 'Weekly',
      description: 'PA approval rates, denial rates, and turnaround times. Correlation tracking: PA decision vs downstream medical cost outcomes. Regulatory compliance vs state mandates and CMS guidelines.',
      format: 'PowerBI', department: 'Medical Management', owner: 'HCB Medical Management', rating: 4.6, views: 1700, isNew: false, isTrending: false,
      relatedConsoleId: 'health-care-benefits', dataSource: 'PA Processing System', accessLevel: 'Finance + Clinical',
      audience: ['HCB President', 'CMO', 'CFO', 'Compliance'], tags: ['prior-auth', 'clinical', 'cost-management'], nextUpdate: 'Every Wednesday 7:00 AM',
    },
    {
      id: 'hcb-5', name: 'Aetna Premium Revenue & IBNR Tracker', category: 'Health Care Benefits (Aetna)', frequency: 'Monthly',
      description: 'HCB premium revenue recognition by plan type. IBNR reserve adequacy: actuarial triangle vs reserve balance. Prior year development favorable/unfavorable vs Q1 2026 precedent ($1.05B favorable).',
      format: 'PowerBI', department: 'Finance', owner: 'HCB Revenue Accounting', rating: 4.7, views: 1900, isNew: false, isTrending: false,
      relatedConsoleId: 'health-care-benefits', dataSource: 'Aetna Actuarial Reserve System', accessLevel: 'Finance + Actuarial',
      audience: ['CFO', 'Chief Actuary', 'HCB President'], tags: ['premiums', 'ibnr', 'reserves', 'actuarial'], nextUpdate: 'Monthly Day 6',
    },
    {
      id: 'hcb-6', name: 'Medical Cost Trend Analysis', category: 'Health Care Benefits (Aetna)', frequency: 'Monthly',
      description: 'Monthly medical cost trend by service category: inpatient, outpatient, physician, pharmacy. Trend vs CMS rate adequacy for 2027 MA bids. Industry benchmark vs UNH, ELV reported trends.',
      format: 'PowerBI', department: 'Actuarial', owner: 'HCB Actuarial', rating: 4.8, views: 2100, isNew: false, isTrending: true,
      relatedConsoleId: 'health-care-benefits', dataSource: 'Medical Claims Analytics', accessLevel: 'Actuarial + Finance',
      audience: ['Chief Actuary', 'CFO', 'HCB President', 'CEO'], tags: ['medical-trend', 'utilization', 'cost-management'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'hcb-7', name: 'HCB Segment AOI vs Guidance Bridge', category: 'Health Care Benefits (Aetna)', frequency: 'Monthly',
      description: 'HCB adjusted operating income waterfall vs FY2026 guidance ($4.00–$4.34B). Bridge: premium revenue, medical benefits expense (MBR), SG&A, other income. MA vs commercial vs Medicaid contribution.',
      format: 'PowerBI', department: 'Finance', owner: 'HCB FP&A', rating: 4.8, views: 2300, isNew: false, isTrending: false,
      relatedConsoleId: 'health-care-benefits', dataSource: 'HCB Segment P&L', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'HCB President', 'IR'], tags: ['aoi', 'guidance', 'bridge', 'hcb'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'hcb-8', name: 'Annual Enrollment Period (AEP) Membership Projection', category: 'Health Care Benefits (Aetna)', frequency: 'Quarterly',
      description: 'AEP and Special Enrollment Period membership flow modeling. MA plan-level bid competitiveness vs CMS benchmark. Market exit impact on total MA headcount vs FY2026 26.0M guidance.',
      format: 'PowerBI', department: 'Strategy', owner: 'HCB Growth Strategy', rating: 4.7, views: 1600, isNew: false, isTrending: false,
      relatedConsoleId: 'health-care-benefits', dataSource: 'CMS Enrollment Data / AEP Analytics', accessLevel: 'Finance + Executive',
      audience: ['HCB President', 'CFO', 'CEO', 'Board'], tags: ['aep', 'ma', 'enrollment', 'membership-forecast'], nextUpdate: 'Quarterly Day 15',
    },

    // ──────────────────────────────────────────
    // Health Services (Caremark) — 8 reports
    // ──────────────────────────────────────────
    {
      id: 'hss-1', name: 'Stelara Biosimilar Conversion Tracker', category: 'Health Services (Caremark)', frequency: 'Weekly',
      description: 'Stelara biosimilar conversion rate vs 85% target (Humira benchmark: >90%). Formulary exclusion effective July 1, 2026. Patient-level conversion by prescriber specialty, formulary tier, and geography. Each 10ppt ≈ $300–500M client savings.',
      format: 'PowerBI', department: 'Finance', owner: 'HSS Formulary Management', rating: 4.9, views: 3400, isNew: true, isTrending: true,
      relatedConsoleId: 'health-services', dataSource: 'Caremark Claims / Formulary System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'HSS President', 'CEO', 'IR'], tags: ['biosimilar', 'stelara', 'formulary', 'conversion'], nextUpdate: 'Every Monday 7:00 AM',
    },
    {
      id: 'hss-2', name: 'Pharmacy Claims Volume Dashboard', category: 'Health Services (Caremark)', frequency: 'Weekly',
      description: 'Caremark PBM weekly pharmacy claims vs ≥1.84B FY2026 guidance. Q1 2026: 464.7M. Claims by channel (retail, mail-order, specialty). New client ramp and book runoff monitoring.',
      format: 'PowerBI', department: 'Finance', owner: 'HSS Claims Analytics', rating: 4.8, views: 2600, isNew: false, isTrending: false,
      relatedConsoleId: 'health-services', dataSource: 'Caremark Adjudication System', accessLevel: 'All Finance',
      audience: ['CFO', 'HSS President', 'IR'], tags: ['claims', 'volume', 'caremark', 'pbm'], nextUpdate: 'Every Tuesday 6:00 AM',
    },
    {
      id: 'hss-3', name: 'TrueCost / Client Price Improvement Monitor', category: 'Health Services (Caremark)', frequency: 'Monthly',
      description: 'HSS AOI headwind from pharmacy client price improvements vs $800M FY2026 plan. TrueCost net-cost model transition: pass-through rebate vs retained economics. Q1 2026 Q2 pull-forward timing impact tracked separately.',
      format: 'PowerBI', department: 'Finance', owner: 'HSS Finance / Rebate Accounting', rating: 4.8, views: 2200, isNew: false, isTrending: true,
      relatedConsoleId: 'health-services', dataSource: 'Rebate Management System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'HSS President', 'IR'], tags: ['truecost', 'rebates', 'pbm-economics', 'headwind'], nextUpdate: 'Monthly Day 7',
    },
    {
      id: 'hss-4', name: 'Specialty Pharmacy Drug Mix & Revenue Report', category: 'Health Services (Caremark)', frequency: 'Monthly',
      description: 'Specialty pharmacy revenue mix (~50% of HSS revenue). Drug category breakdown: biologics, oncology, immunology, GLP-1. Purchasing economics by therapeutic category. Specialty vs traditional pharmacy revenue trend.',
      format: 'PowerBI', department: 'Finance', owner: 'Specialty Pharmacy Finance', rating: 4.7, views: 1800, isNew: false, isTrending: false,
      relatedConsoleId: 'health-services', dataSource: 'Specialty Pharmacy Analytics', accessLevel: 'Finance + Commercial',
      audience: ['CFO', 'HSS President', 'Specialty President'], tags: ['specialty', 'drug-mix', 'biologics', 'glp1'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'hss-5', name: 'Oak Street Health Performance Dashboard', category: 'Health Services (Caremark)', frequency: 'Monthly',
      description: 'Oak Street Health KPIs: patient visits, value-based care revenue, risk adjustment accruals (V28 model). Revenue growth tracking vs +15% FY2026 target. Medical cost savings attributable to primary care model.',
      format: 'PowerBI', department: 'Finance', owner: 'Health Care Delivery Finance', rating: 4.7, views: 1500, isNew: false, isTrending: false,
      relatedConsoleId: 'health-services', dataSource: 'Oak Street Health EMR / Finance', accessLevel: 'Finance + Clinical',
      audience: ['CFO', 'HSS President', 'Oak Street CEO'], tags: ['oak-street', 'vbc', 'primary-care', 'risk-adjustment'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'hss-6', name: 'GLP-1 Formulary & Client Coverage Monitor', category: 'Health Services (Caremark)', frequency: 'Weekly',
      description: '~50% of Caremark clients discontinuing obesity GLP-1 coverage. Weekly tracking of client coverage decisions, DTC channel impact, and specialty drug trend. Cost management vs member access tradeoff analysis.',
      format: 'PowerBI', department: 'Finance', owner: 'HSS Drug Trend Analytics', rating: 4.8, views: 2700, isNew: true, isTrending: true,
      relatedConsoleId: 'health-services', dataSource: 'Formulary Management / Claims Analytics', accessLevel: 'Finance + Commercial',
      audience: ['CFO', 'HSS President', 'Formulary Committee'], tags: ['glp1', 'obesity', 'formulary', 'drug-trend'], nextUpdate: 'Every Wednesday 7:00 AM',
    },
    {
      id: 'hss-7', name: 'Rebate Guarantee Commitment Tracker', category: 'Health Services (Caremark)', frequency: 'Monthly',
      description: 'Multi-year rebate guarantee commitments to employer and government clients. Actual rebate achievement vs guaranteed minimums. Risk exposure by client cohort and contract year. 2026 commitment fulfillment progress.',
      format: 'PowerBI', department: 'Finance', owner: 'HSS Rebate Accounting', rating: 4.6, views: 1400, isNew: false, isTrending: false,
      relatedConsoleId: 'health-services', dataSource: 'Rebate Guarantee System', accessLevel: 'Finance + Legal',
      audience: ['CFO', 'HSS President', 'Legal / Compliance'], tags: ['rebates', 'guarantee', 'commitments', 'pbm'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'hss-8', name: 'HSS Segment AOI vs Guidance Bridge', category: 'Health Services (Caremark)', frequency: 'Monthly',
      description: 'HSS adjusted operating income waterfall vs ≥$7.25B FY2026 guidance. Bridge: pharmacy revenues, purchasing economics, client price improvements, Oak Street contribution, SG&A. Q1 2026: $1.49B (Q2 pull-forward adjusted).',
      format: 'PowerBI', department: 'Finance', owner: 'HSS FP&A', rating: 4.8, views: 2100, isNew: false, isTrending: false,
      relatedConsoleId: 'health-services', dataSource: 'HSS Segment P&L', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'HSS President', 'IR'], tags: ['aoi', 'guidance', 'bridge', 'hss'], nextUpdate: 'Monthly Day 9',
    },

    // ──────────────────────────────────────────
    // Pharmacy & Consumer Wellness — 7 reports
    // ──────────────────────────────────────────
    {
      id: 'pcw-1', name: 'Same-Store Prescription Growth Dashboard', category: 'Pharmacy & Consumer Wellness', frequency: 'Weekly',
      description: 'Weekly same-store Rx growth vs +7% FY2026 target. Store-level script volumes across ~9,000 locations. Rite Aid asset contribution, GLP-1 DTC impact, weather/seasonal adjustment. Q1 2026: +7% YoY.',
      format: 'PowerBI', department: 'Finance', owner: 'PCW Revenue Analytics', rating: 4.8, views: 2800, isNew: false, isTrending: true,
      relatedConsoleId: 'pharmacy-consumer-wellness', dataSource: 'PCW Pharmacy Dispensing System', accessLevel: 'All Finance',
      audience: ['CFO', 'PCW President', 'IR'], tags: ['same-store', 'prescriptions', 'volume', 'pcw'], nextUpdate: 'Every Monday 8:00 AM',
    },
    {
      id: 'pcw-2', name: 'Retail Script Market Share Monitor', category: 'Pharmacy & Consumer Wellness', frequency: 'Monthly',
      description: 'CVS U.S. retail prescription market share vs Walgreens, Rite Aid, independents, mail-order. CVS >29% Q1 2026. Walgreens restructuring tailwind analysis. IQVIA Symphony data reconciliation.',
      format: 'PowerBI', department: 'Strategy', owner: 'PCW Market Intelligence', rating: 4.9, views: 3200, isNew: false, isTrending: true,
      relatedConsoleId: 'pharmacy-consumer-wellness', dataSource: 'IQVIA Symphony Health / Internal', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'PCW President', 'CEO', 'IR'], tags: ['script-share', 'market-share', 'walgreens', 'competitive'], nextUpdate: 'Monthly Day 12',
    },
    {
      id: 'pcw-3', name: 'GLP-1 DTC Channel Performance Tracker', category: 'Pharmacy & Consumer Wellness', frequency: 'Weekly',
      description: 'GLP-1 direct-to-consumer market share gain: +200bps Q1 2026 baseline. NovoCare partnership performance, $25/month insulin access traffic. DTC vs traditional channel GLP-1 script trends.',
      format: 'PowerBI', department: 'Finance', owner: 'PCW Growth Initiatives', rating: 4.8, views: 2500, isNew: true, isTrending: true,
      relatedConsoleId: 'pharmacy-consumer-wellness', dataSource: 'PCW DTC Analytics Platform', accessLevel: 'Finance + Marketing',
      audience: ['CFO', 'PCW President', 'CEO'], tags: ['glp1', 'dtc', 'market-share', 'novocare'], nextUpdate: 'Every Thursday 7:00 AM',
    },
    {
      id: 'pcw-4', name: 'CostVantage Reimbursement Performance Report', category: 'Pharmacy & Consumer Wellness', frequency: 'Monthly',
      description: 'CostVantage cost-plus reimbursement model performance. Branded drug margin neutralization vs pre-CostVantage baseline. Generic drug reimbursement pressure (−80bps FY2026 plan). Payer contract compliance.',
      format: 'PowerBI', department: 'Finance', owner: 'PCW Pharmacy Finance', rating: 4.7, views: 1900, isNew: false, isTrending: false,
      relatedConsoleId: 'pharmacy-consumer-wellness', dataSource: 'Pharmacy Reimbursement Analytics', accessLevel: 'Finance + Commercial',
      audience: ['CFO', 'PCW President', 'Pharmacy VP'], tags: ['costvantage', 'reimbursement', 'pricing', 'payer'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'pcw-5', name: 'PCW Store Operations KPI Dashboard', category: 'Pharmacy & Consumer Wellness', frequency: 'Weekly',
      description: '~9,000 location operational KPIs: pharmacy wait times, fill rates, front-store comps, shrink. MinuteClinic visit volume and revenue. HealthHUB patient throughput vs non-HealthHUB stores.',
      format: 'PowerBI', department: 'Operations', owner: 'PCW Store Operations', rating: 4.6, views: 1600, isNew: false, isTrending: false,
      relatedConsoleId: 'pharmacy-consumer-wellness', dataSource: 'Store Operations System / POS', accessLevel: 'All Finance',
      audience: ['PCW President', 'Operations VP', 'CFO'], tags: ['stores', 'operations', 'minuteclinic', 'healthhub'], nextUpdate: 'Every Monday 9:00 AM',
    },
    {
      id: 'pcw-6', name: 'MinuteClinic & HealthHUB Patient Analytics', category: 'Pharmacy & Consumer Wellness', frequency: 'Monthly',
      description: 'MinuteClinic visit volume, revenue, and prescription capture rates. HealthHUB store format performance vs standard CVS. Patient retention metrics and chronic condition management revenue.',
      format: 'PowerBI', department: 'Finance', owner: 'Health Services Delivery Finance', rating: 4.6, views: 1300, isNew: false, isTrending: false,
      relatedConsoleId: 'pharmacy-consumer-wellness', dataSource: 'MinuteClinic EMR / HealthHUB Analytics', accessLevel: 'Finance + Clinical',
      audience: ['PCW President', 'CFO', 'Clinical VP'], tags: ['minuteclinic', 'healthhub', 'patient', 'capture-rate'], nextUpdate: 'Monthly Day 11',
    },
    {
      id: 'pcw-7', name: 'PCW Segment AOI vs Guidance Bridge', category: 'Pharmacy & Consumer Wellness', frequency: 'Monthly',
      description: 'PCW adjusted operating income waterfall vs ≥$6.18B FY2026 guidance. Bridge: Rx revenue, front-store, reimbursement impact, SG&A. Q1 2026: $1.20B (weather/seasonal headwind quantified separately).',
      format: 'PowerBI', department: 'Finance', owner: 'PCW FP&A', rating: 4.7, views: 2000, isNew: false, isTrending: false,
      relatedConsoleId: 'pharmacy-consumer-wellness', dataSource: 'PCW Segment P&L', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'PCW President', 'IR'], tags: ['aoi', 'guidance', 'bridge', 'pcw'], nextUpdate: 'Monthly Day 9',
    },

    // ──────────────────────────────────────────
    // Enterprise Finance & EPS — 7 reports
    // ──────────────────────────────────────────
    {
      id: 'ent-1', name: 'Enterprise Adj. EPS vs FY2026 Guidance Dashboard', category: 'Enterprise Finance & EPS', frequency: 'Weekly',
      description: 'Annualized run-rate adj. EPS vs $7.30–$7.50 FY2026 guidance. Q1 2026: $2.57 (+14.2% YoY). 60-40 H1/H2 seasonality adjustment. Guidance raise/maintain/lower scenario tracking. Mid-teens EPS CAGR target through 2028.',
      format: 'PowerBI', department: 'Finance', owner: 'Enterprise FP&A / IR', rating: 4.9, views: 4100, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-finance', dataSource: 'Consolidated P&L System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'IR', 'Board'], tags: ['eps', 'guidance', 'run-rate', 'seasonality'], nextUpdate: 'Every Monday 6:00 AM',
    },
    {
      id: 'ent-2', name: 'Three-Segment Consolidated P&L', category: 'Enterprise Finance & EPS', frequency: 'Monthly',
      description: 'HCB + HSS + PCW + Corporate/Other consolidated P&L. Revenue $100.4B Q1 2026 (+6.2% YoY). Inter-segment elimination reconciliation ($15.5B HSS-to-HCB Q1 2026). AOI $5.15B (+12.1% vs plan).',
      format: 'PowerBI', department: 'Finance', owner: 'Corporate Accounting / FP&A', rating: 4.8, views: 2900, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-finance', dataSource: 'Enterprise Consolidation System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'Segment Presidents', 'IR'], tags: ['consolidated', 'pl', 'segments', 'aoi'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'ent-3', name: 'Inter-Segment Elimination Reconciliation', category: 'Enterprise Finance & EPS', frequency: 'Monthly',
      description: 'Caremark (HSS) services to Aetna (HCB) insured members elimination. Pharmacy services to PCW retail elimination. Gross segment revenues ($475B+ combined) vs consolidated ($405B FY2026 guidance). Elimination bridge and trend.',
      format: 'PowerBI', department: 'Finance', owner: 'Corporate Consolidation', rating: 4.6, views: 1200, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-finance', dataSource: 'Consolidation / Inter-Company System', accessLevel: 'Finance',
      audience: ['CFO', 'Controller', 'Corporate Accounting'], tags: ['elimination', 'consolidation', 'inter-segment', 'reconciliation'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'ent-4', name: 'GAAP to Non-GAAP EPS Bridge', category: 'Enterprise Finance & EPS', frequency: 'Quarterly',
      description: 'GAAP to adjusted EPS reconciliation: amortization of intangibles (Aetna + Oak Street), acquisition costs, restructuring charges, non-GAAP tax rate adjustments. Q1 2026: GAAP $1.98 vs adj. $2.57 ($0.59 delta).',
      format: 'PowerBI', department: 'Finance', owner: 'External Reporting / Tax', rating: 4.7, views: 1700, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-finance', dataSource: 'GAAP Reporting System / Tax', accessLevel: 'Finance + Legal',
      audience: ['CFO', 'Controller', 'Tax VP', 'IR'], tags: ['gaap', 'non-gaap', 'reconciliation', 'amortization'], nextUpdate: 'Quarterly Day 8',
    },
    {
      id: 'ent-5', name: 'Earnings Call Preparation Package', category: 'Enterprise Finance & EPS', frequency: 'Quarterly',
      description: 'CFO and CEO earnings call talking points, slide deck, and Q&A preparation. Segment performance vs guidance, guidance reaffirmation or raise analysis, analyst consensus vs actuals, key messaging framework.',
      format: 'PowerBI', department: 'Finance', owner: 'IR / FP&A', rating: 4.8, views: 2600, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-finance', dataSource: 'Consolidated P&L / Guidance Model', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'IR', 'Board'], tags: ['earnings', 'ir', 'guidance', 'analyst'], nextUpdate: 'Quarterly Day 11',
    },
    {
      id: 'ent-6', name: 'FY2026 Guidance Sensitivity Analysis', category: 'Enterprise Finance & EPS', frequency: 'Monthly',
      description: 'Monte Carlo and point-estimate sensitivity of FY2026 adj. EPS ($7.30–$7.50) to key levers: MBR ±50bps, HSS AOI timing, PCW same-store growth, Stelara conversion rate. Confidence interval modeling.',
      format: 'PowerBI', department: 'Finance', owner: 'Enterprise FP&A', rating: 4.8, views: 2400, isNew: false, isTrending: true,
      relatedConsoleId: 'enterprise-finance', dataSource: 'Planning Model / Scenario Engine', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'FP&A Leadership'], tags: ['sensitivity', 'eps', 'guidance', 'scenario'], nextUpdate: 'Monthly Day 12',
    },
    {
      id: 'ent-7', name: 'FY2026 vs FY2025 Annual Operating Plan Tracker', category: 'Enterprise Finance & EPS', frequency: 'Monthly',
      description: 'Full-year AOP vs actuals tracking across all three segments. Revenue, AOI, and EPS bridges. Segment-level beat/miss decomposition. H1 vs H2 seasonality tracking for 60-40 split assumption.',
      format: 'PowerBI', department: 'Finance', owner: 'Enterprise FP&A', rating: 4.7, views: 2100, isNew: false, isTrending: false,
      relatedConsoleId: 'enterprise-finance', dataSource: 'AOP Planning System / Actuals', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'Segment Presidents', 'FP&A Leadership'], tags: ['aop', 'plan', 'actuals', 'bridge'], nextUpdate: 'Monthly Day 11',
    },

    // ──────────────────────────────────────────
    // Medicare Advantage & Government — 4 reports
    // ──────────────────────────────────────────
    {
      id: 'gov-1', name: 'CMS Star Ratings & Quality Bonus Dashboard', category: 'Medicare Advantage & Government', frequency: 'Monthly',
      description: 'MA plan Star ratings by contract: plans above/below 4.0-star threshold. Quality bonus payment projections from CMS. Each 0.5-star improvement crossing 4.0 ≈ +5% quality bonus on applicable premium revenue.',
      format: 'PowerBI', department: 'Finance', owner: 'MA Quality Finance', rating: 4.7, views: 1800, isNew: false, isTrending: false,
      relatedConsoleId: 'health-care-benefits', dataSource: 'CMS Star Ratings / MA Quality System', accessLevel: 'Finance + Quality',
      audience: ['CFO', 'HCB President', 'Quality VP', 'IR'], tags: ['star-ratings', 'cms', 'quality-bonus', 'ma'], nextUpdate: 'Monthly Day 15',
    },
    {
      id: 'gov-2', name: 'MA Rate Adequacy & 2027 Bid Analysis', category: 'Medicare Advantage & Government', frequency: 'Quarterly',
      description: 'CMS MA benchmark rates vs Aetna bid pricing and medical cost trends. 2027 MA bid preparation: market-level profitability projections. Impact on 2027 membership and MA margin recovery trajectory.',
      format: 'PowerBI', department: 'Actuarial', owner: 'MA Actuarial / Finance', rating: 4.8, views: 2200, isNew: false, isTrending: true,
      relatedConsoleId: 'health-care-benefits', dataSource: 'CMS Benchmark Data / Bid System', accessLevel: 'Actuarial + Finance + Executive',
      audience: ['CFO', 'Chief Actuary', 'HCB President', 'CEO'], tags: ['ma-bids', 'cms-rates', '2027', 'rate-adequacy'], nextUpdate: 'Quarterly Day 20',
    },
    {
      id: 'gov-3', name: 'Medicaid & V28 Risk Adjustment Tracker', category: 'Medicare Advantage & Government', frequency: 'Monthly',
      description: 'Medicaid membership and premium revenue by state. MA V28 risk adjustment model accruals and actual settlements. HCC coding accuracy and risk score trend vs prior periods.',
      format: 'PowerBI', department: 'Finance', owner: 'Government Programs Finance', rating: 4.5, views: 1100, isNew: false, isTrending: false,
      relatedConsoleId: 'health-care-benefits', dataSource: 'CMS Risk Adjustment / State Medicaid', accessLevel: 'Finance + Actuarial',
      audience: ['CFO', 'HCB President', 'Chief Actuary'], tags: ['medicaid', 'risk-adjustment', 'v28', 'hcc'], nextUpdate: 'Monthly Day 12',
    },
    {
      id: 'gov-4', name: 'Government Program Regulatory Compliance Report', category: 'Medicare Advantage & Government', frequency: 'Monthly',
      description: 'CMS audit findings and remediation. State Medicaid contract compliance. Prior authorization regulatory requirements across states. Civil Monetary Penalty exposure monitoring.',
      format: 'PowerBI', department: 'Compliance', owner: 'Government Compliance', rating: 4.4, views: 900, isNew: false, isTrending: false,
      relatedConsoleId: 'health-care-benefits', dataSource: 'Compliance Management System', accessLevel: 'Finance + Legal + Compliance',
      audience: ['CFO', 'General Counsel', 'Compliance VP', 'HCB President'], tags: ['compliance', 'cms', 'regulatory', 'pa'], nextUpdate: 'Monthly Day 14',
    },

    // ──────────────────────────────────────────
    // Specialty Pharmacy & Drug Trend — 4 reports
    // ──────────────────────────────────────────
    {
      id: 'spc-1', name: 'Enterprise Drug Trend Analysis', category: 'Specialty Pharmacy & Drug Trend', frequency: 'Monthly',
      description: 'Full enterprise drug trend: specialty vs brand vs generic mix. Price, utilization, and mix effect decomposition. GLP-1 obesity drug as discrete trend driver. Trend vs PBM peer benchmarks (ESI, OptumRx).',
      format: 'PowerBI', department: 'Finance', owner: 'HSS Drug Trend / Actuarial', rating: 4.7, views: 2000, isNew: false, isTrending: true,
      relatedConsoleId: 'health-services', dataSource: 'Caremark Claims Analytics / Actuarial', accessLevel: 'Finance + Actuarial',
      audience: ['CFO', 'HSS President', 'HCB President', 'Chief Actuary'], tags: ['drug-trend', 'specialty', 'generic', 'glp1'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'spc-2', name: 'Biosimilar Pipeline & Launch Calendar', category: 'Specialty Pharmacy & Drug Trend', frequency: 'Quarterly',
      description: 'Upcoming biosimilar FDA approvals and Caremark formulary exclusion pipeline beyond Stelara (July 2026). Keytruda biosimilar outlook. Revenue and AOI opportunity sizing per biosimilar cohort.',
      format: 'PowerBI', department: 'Strategy', owner: 'HSS Formulary Strategy', rating: 4.7, views: 1700, isNew: true, isTrending: true,
      relatedConsoleId: 'health-services', dataSource: 'FDA Pipeline / Formulary Planning', accessLevel: 'Finance + Strategy',
      audience: ['CFO', 'HSS President', 'Formulary Committee', 'IR'], tags: ['biosimilar', 'pipeline', 'fda', 'formulary'], nextUpdate: 'Quarterly Day 10',
    },
    {
      id: 'spc-3', name: 'GLP-1 Obesity Drug Cost Impact Analysis', category: 'Specialty Pharmacy & Drug Trend', frequency: 'Monthly',
      description: 'Wegovy/Zepbound coverage rate (~50% discontinuing) and cost per member per month trend. Employer plan sponsor decisions: coverage vs non-coverage scenarios. Net impact on HSS revenue, HCB medical trend, PCW script volume.',
      format: 'PowerBI', department: 'Finance', owner: 'HSS Drug Trend / PCW Analytics', rating: 4.8, views: 2700, isNew: false, isTrending: true,
      relatedConsoleId: 'health-services', dataSource: 'Claims Analytics / Client Coverage Data', accessLevel: 'Finance + Commercial',
      audience: ['CFO', 'HSS President', 'HCB President', 'CEO'], tags: ['glp1', 'obesity', 'wegovy', 'drug-trend'], nextUpdate: 'Monthly Day 9',
    },
    {
      id: 'spc-4', name: 'Specialty Pharmacy Competitive Intelligence', category: 'Specialty Pharmacy & Drug Trend', frequency: 'Quarterly',
      description: 'Caremark specialty pharmacy market share vs Accredo (CI/ESI), AllianceRx (WBA), Optum Specialty. Specialty network design competitive positioning. Limited distribution drug access and manufacturer partnerships.',
      format: 'PowerBI', department: 'Strategy', owner: 'Specialty Pharmacy Strategy', rating: 4.6, views: 1300, isNew: false, isTrending: false,
      relatedConsoleId: 'health-services', dataSource: 'Market Intelligence / IQVIA', accessLevel: 'Finance + Strategy + Commercial',
      audience: ['CFO', 'HSS President', 'CEO'], tags: ['specialty', 'competitive', 'market-share', 'pbm'], nextUpdate: 'Quarterly Day 15',
    },

    // ──────────────────────────────────────────
    // Capital Structure & Treasury — 4 reports
    // ──────────────────────────────────────────
    {
      id: 'tsy-1', name: 'Leverage Ratio & Deleveraging Dashboard', category: 'Capital Structure & Treasury', frequency: 'Weekly',
      description: 'Net debt / EBITDA leverage ratio vs BBB target. Q1 2026: 3.84x — improving trajectory. Share repurchase suspended; CFO ≥$9.5B primary deleveraging mechanism. Rating agency covenant headroom. Target timeline to below 3.0x.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury / FP&A', rating: 4.8, views: 2500, isNew: false, isTrending: true,
      relatedConsoleId: 'capital-structure', dataSource: 'Treasury Management System / Debt Register', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'Treasury VP', 'IR', 'Board'], tags: ['leverage', 'debt', 'bbb', 'deleveraging'], nextUpdate: 'Every Friday 7:00 AM',
    },
    {
      id: 'tsy-2', name: 'Cash Flow from Operations Tracker', category: 'Capital Structure & Treasury', frequency: 'Monthly',
      description: 'YTD CFO vs ≥$9.5B FY2026 guidance. Q1 2026: $4.2B (+working capital improvement). Bridge: AOI, working capital (AR, AP, pharmacy rebate timing), taxes paid, capex. Quarterly seasonality adjusted.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury / Corporate FP&A', rating: 4.8, views: 2200, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Treasury Cash Management / ERP', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'Treasury VP', 'IR'], tags: ['cfo', 'cash-flow', 'working-capital', 'guidance'], nextUpdate: 'Monthly Day 10',
    },
    {
      id: 'tsy-3', name: 'Debt Maturity & Refinancing Calendar', category: 'Capital Structure & Treasury', frequency: 'Monthly',
      description: '~$60B long-term debt (Aetna acquisition legacy) maturity profile. Near-term refinancing schedule, interest rate environment impact on refinancing economics. Weighted average cost of debt trend.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury', rating: 4.6, views: 1400, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Debt Register / Treasury System', accessLevel: 'Finance + Treasury',
      audience: ['CFO', 'Treasury VP', 'Controller', 'Board'], tags: ['debt', 'maturity', 'refinancing', 'interest-rate'], nextUpdate: 'Monthly Day 8',
    },
    {
      id: 'tsy-4', name: 'Dividend Coverage & Capital Return Analysis', category: 'Capital Structure & Treasury', frequency: 'Quarterly',
      description: '~$850M quarterly dividend coverage: payout ratio vs CFO, earnings coverage ratio. Share repurchase suspension: conditions for reinstatement vs leverage target. Capital allocation framework vs BBB credit rating target.',
      format: 'PowerBI', department: 'Finance', owner: 'Treasury / IR', rating: 4.7, views: 1800, isNew: false, isTrending: false,
      relatedConsoleId: 'capital-structure', dataSource: 'Treasury / Dividend Payable System', accessLevel: 'Finance + Executive',
      audience: ['CFO', 'CEO', 'Board', 'IR'], tags: ['dividend', 'capital-return', 'buyback', 'bbb'], nextUpdate: 'Quarterly Day 12',
    },
  ],
};
