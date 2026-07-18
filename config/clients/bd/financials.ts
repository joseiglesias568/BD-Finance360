// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/financials.ts
//
// Provenance Legend:
// [CITED:10K-FY25]    — BD FY2025 Form 10-K / Annual Report (filed Nov 2025)
// [CITED:10Q-Q2-26]   — BD Q2 FY2026 Form 10-Q (filed May 2026)
// [CITED:EC-Q2-26]    — BD Q2 FY2026 Earnings Call / IR slides (May 2026)
// [DERIVED]           — Computed from cited values; math shown inline
// [INTERPOLATED]      — Extrapolated from trend or adjacent cited values
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter, not a business datum
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Becton, Dickinson and Company (BDX) public disclosures: Annual Report (FY2025,
// fiscal year ended September 30, 2025); Form 10-Q (Q2 FY2026, filed May 2026);
// Q2 FY2026 earnings call / IR slides (May 2026); FY2026 guidance.
// BD reports four segments effective October 1, 2025: Medical Essentials,
// Connected Care, BioPharma Systems, Interventional.
// All revenue values in $M.
// ─────────────────────────────────────────────────────────────────────
import { FinancialConfig } from '../../types';

export const financials: FinancialConfig = {
  fiscalYear: 'FY2025',
  annualRevenue: 18195,                // FY2025 continuing ops revenues $M [CITED:10K-FY25]
  annualRevenueYoY: 4.8,               // FY2025 reported revenue growth % [CITED:10K-FY25]
  annualOperatingIncome: 4549,         // FY2025 adj. operating income est. $M (~25% × $18,195M) [DERIVED]
  annualOperatingMargin: 25.0,         // FY2025 adj. operating margin % [CITED:10K-FY25]
  annualNetIncome: 3358,               // FY2025 adj. net income est. $M (adj. EPS $11.90 × 282M shares) [DERIVED]
  annualEPS: 11.90,                    // FY2025 adj. diluted EPS (New BD restated basis) [CITED:10K-FY25]

  quarters: [
    {
      quarter: 'Q1 FY25',
      revenue: 4332,                   // Q1 FY2025 continuing ops $M [INTERPOLATED]
      revenueYoY: 3.8,
      operatingIncome: 1083,           // est. adj. operating income $M [INTERPOLATED]
      operatingMargin: 25.0,
      eps: 2.97,                       // est. adj. diluted EPS [INTERPOLATED]
      feeRevenueGrowth: 3.5,           // proxy: Medical Essentials growth [INTERPOLATED]
    },
    {
      quarter: 'Q2 FY25',
      revenue: 4480,                   // Q2 FY2025 continuing ops $M [INTERPOLATED]
      revenueYoY: 4.5,
      operatingIncome: 1120,
      operatingMargin: 25.0,
      eps: 3.06,
      feeRevenueGrowth: 4.0,
    },
    {
      quarter: 'Q3 FY25',
      revenue: 4700,                   // Q3 FY2025 est. $M [INTERPOLATED]
      revenueYoY: 5.2,
      operatingIncome: 1175,
      operatingMargin: 25.0,
      eps: 3.18,
      feeRevenueGrowth: 4.8,
    },
    {
      quarter: 'Q4 FY25',
      revenue: 4683,                   // Q4 FY2025 est. $M [INTERPOLATED]
      revenueYoY: 5.5,
      operatingIncome: 1171,
      operatingMargin: 25.0,
      eps: 2.69,                       // seasonally lower due to FY-end timing [INTERPOLATED]
      feeRevenueGrowth: 4.5,
    },
    {
      quarter: 'Q1 FY26',
      revenue: 4486,                   // Q1 FY2026 continuing ops $M [CITED:EC-Q2-26]
      revenueYoY: 3.6,
      operatingIncome: 1054,           // adj. operating income $M [DERIVED: ~23.5% margin]
      operatingMargin: 23.5,
      eps: 3.35,                       // Q1 FY2026 adj. diluted EPS [CITED:EC-Q2-26]
      feeRevenueGrowth: 2.4,
    },
    {
      quarter: 'Q2 FY26',
      revenue: 4714,                   // Q2 FY2026 continuing ops $M [CITED:EC-Q2-26]
      revenueYoY: 5.2,
      operatingIncome: 1141,           // adj. operating income $M [DERIVED: ~24.2% margin]
      operatingMargin: 24.2,
      eps: 3.58,                       // Q2 FY2026 adj. diluted EPS [CITED:EC-Q2-26]
      feeRevenueGrowth: 3.2,
    },
  ],

  latestQuarter: {
    quarter: 'Q2 FY26',
    revenue: 4714,
    revenueYoY: 5.2,
    operatingIncome: 1141,
    operatingMargin: 24.2,
    eps: 3.58,
    feeRevenueGrowth: 3.2,
  },

  // Segments — BD four operating segments (new structure effective Oct 1, 2025)
  // Revenue values in $M for FY2025 full year
  segments: [
    {
      name: 'Medical Essentials',
      revenue: 6098,                   // FY2025 $M: MDS $4,575 + Specimen Mgmt $1,523 est. [CITED:10K-FY25/INTERPOLATED]
      revenuePercent: 33.5,            // 6,098 / 18,195 [DERIVED]
      yoyChange: 2.5,
      operatingMargin: 26.0,           // est. [ASSUMED]
      description:
        'Medical Essentials includes the former BD Medical – Medication Delivery Solutions (MDS) and ' +
        'Specimen Management sub-segments. MDS ($4,575M) covers prefillable drug delivery systems, ' +
        'safety-engineered injection and infusion devices, catheters, and sharps disposal. ' +
        'Specimen Management ($1,523M est.) covers vacutainers, specimen transport, and pre-analytical systems. ' +
        'FY2026 organic growth target: +2% FXN. Q2 FY26 actuals: +1.7% FXN. ' +
        'China VoBP headwind impacting MDS. ' +
        'BD Alaris infusion pump remediation and commercial return ongoing in MDS.',
    },
    {
      name: 'Connected Care',
      revenue: 4556,                   // FY2025 $M: MMS $3,474 + APM $1,082 [CITED:10K-FY25/INTERPOLATED]
      revenuePercent: 25.0,
      yoyChange: 3.8,
      operatingMargin: 24.5,
      description:
        'Connected Care includes Medication Management Solutions (MMS, $3,474M) and ' +
        'Advanced Patient Monitoring (APM, $1,082M). MMS covers BD Alaris infusion systems, ' +
        'dispensing cabinets (Pyxis), and connected medication administration. ' +
        'APM covers HemoSphere advanced monitoring and critical care solutions. ' +
        'FY2026 organic growth target: +5% FXN. Q2 FY26 actuals: +3.2% FXN. ' +
        'BD Alaris ramp-up is a key growth driver as remediation reaches customer sites. ' +
        'HemoSphere platform expansion driving APM growth. ' +
        'Dispensing (Pyxis) FDA Warning Letter is being actively remediated.',
    },
    {
      name: 'BioPharma Systems',
      revenue: 2324,                   // FY2025 $M [CITED:10K-FY25]
      revenuePercent: 12.8,
      yoyChange: 2.0,
      operatingMargin: 31.0,           // highest-margin segment [ASSUMED]
      description:
        'BioPharma Systems covers prefillable syringes, self-injection systems, drug delivery systems, ' +
        'and pharmaceutical packaging. Serves biopharmaceutical and pharmaceutical manufacturers. ' +
        'GLP-1 delivery systems (pen needles, autoinjectors) represent a significant growth opportunity. ' +
        'FY2026 organic growth target: +3% FXN. Q2 FY26 actuals: -1.8% FXN. ' +
        'Near-term headwind from customer inventory destocking. ' +
        'Long-term GLP-1 tailwind expected as drug manufacturers ramp delivery device orders.',
    },
    {
      name: 'Interventional',
      revenue: 5217,                   // FY2025 $M: Surgery $1,572 + PI $1,996 + UCC $1,649 [CITED:10K-FY25]
      revenuePercent: 28.7,
      yoyChange: 6.5,
      operatingMargin: 23.0,
      description:
        'Interventional comprises Surgery ($1,572M), Peripheral Intervention (PI, $1,996M), ' +
        'and Urology & Critical Care (UCC, $1,649M). ' +
        'Surgery covers BD ChloraPrep skin antiseptics, biosurgery products, and surgical instruments. ' +
        'PI covers peripheral vascular, oncology intervention, and electrophysiology catheters. ' +
        'UCC covers BD Liberator catheters, critical care drainage, and urological products. ' +
        'FY2026 organic growth target: +6% FXN. Q2 FY26 actuals: +5.3% FXN. ' +
        'Strongest-growing segment; PI and UCC driving share gains. ' +
        'New product launches contributing to revenue growth.',
    },
  ],

  // P&L Summary — Q2 FY2026 ($M consolidated continuing operations)
  plSummary: {
    revenue: {
      label: 'Total Revenues',
      actual: 4714,                    // Q2 FY26 [CITED:EC-Q2-26]
      plan: 4680,                      // est. consensus plan [ASSUMED]
      priorYear: 4480,                 // Q2 FY25 est. [INTERPOLATED]
      variance: 34,
      variancePercent: 0.7,
    },
    cogs: {
      label: 'Cost of Products Sold',
      actual: 2566,                    // est. Q2 FY26: $4,714 × (1 − 45.4% gross margin) [DERIVED]
      plan: 2548,
      priorYear: 2464,
      variance: 18,
      variancePercent: 0.7,
    },
    grossProfit: {
      label: 'Gross Profit',
      actual: 2148,                    // $4,714 × 45.6% GAAP gross margin [DERIVED]
      plan: 2132,
      priorYear: 2016,
      variance: 116,
      variancePercent: 5.8,
    },
    operatingExpenses: {
      label: 'R&D + SG&A + Other Operating Expenses',
      actual: 1007,                    // est. [ASSUMED: includes R&D ~$273M + SG&A + other]
      plan: 1020,
      priorYear: 960,
      variance: -13,
      variancePercent: -1.3,
    },
    operatingIncome: {
      label: 'Adjusted Operating Income',
      actual: 1141,                    // Q2 FY26 adj. OI [DERIVED: 24.2% × $4,714M]
      plan: 1100,
      priorYear: 1070,
      variance: 41,
      variancePercent: 3.8,
    },
    netIncome: {
      label: 'Adjusted Net Income',
      actual: 1010,                    // Q2 FY26 adj. EPS $3.58 × 282M shares [DERIVED]
      plan: 960,
      priorYear: 930,
      variance: 80,
      variancePercent: 8.6,
    },
  },

  // Revenue Bridge — Q2 FY26 vs Q2 FY25 (continuing ops)
  revenueBridge: [
    {
      label: 'Interventional — Organic Volume Growth',
      impact: 142,
      description: 'Interventional segment +5.3% FXN in Q2 FY26. Peripheral Intervention and Urology & Critical Care driving strong procedure-driven volume gains. Surgery biosurgery and skin prep also contributing.',
      category: 'volume',
    },
    {
      label: 'Connected Care — Alaris Ramp & Dispensing',
      impact: 94,
      description: 'Connected Care +3.2% FXN in Q2 FY26. BD Alaris infusion pump commercial return progressing (78% customer site remediation complete). Pyxis dispensing volumes growing despite regulatory headwind.',
      category: 'volume',
    },
    {
      label: 'Medical Essentials — Pricing & Mix',
      impact: 68,
      description: 'Medical Essentials +1.7% FXN in Q2 FY26. Pricing partially offsets China VoBP volume headwind. Specimen Management growing driven by oncology testing volumes.',
      category: 'pricing',
    },
    {
      label: 'China VoBP Volume-Based Procurement Headwind',
      impact: -112,
      description: 'China Volume-Based Procurement (VoBP) program created -14% FXN headwind in Q2 FY26 for affected product categories. Primarily impacts Medical Essentials and BioPharma Systems. Mitigation via emerging markets offset underway.',
      category: 'mix',
    },
    {
      label: 'BioPharma Systems — Customer Destocking',
      impact: -64,
      description: 'BioPharma Systems -1.8% FXN Q2 FY26 due to pharmaceutical customer inventory destocking. GLP-1 delivery device orders expected to recover in H2 FY26 and beyond.',
      category: 'mix',
    },
    {
      label: 'Foreign Currency Translation',
      impact: -52,
      description: 'FX translation headwind on reported USD revenues from stronger dollar vs euro, yen, and emerging market currencies. Organic growth rate significantly outpaces reported growth in constant-currency view.',
      category: 'mix',
    },
  ],

  ratios: {
    currentRatio: 1.2,                 // est. [ASSUMED — typical MedTech]
    currentRatioTarget: 1.5,
    debtToEquity: 1.8,                 // est. leverage 2.9x net debt/EBITDA; significant BD debt load [ASSUMED]
    debtToEquityTarget: 1.2,           // target as balance sheet deleverages to 2.5x
    returnOnEquity: 18.5,              // est. adj. ROE [ASSUMED]
    returnOnAssets: 6.2,               // est. adj. net income / total assets [ASSUMED]
    returnOnAssetsTarget: 7.0,
    freeCashFlow: 1095,                // H1 FY26 actual free cash flow $M [CITED:EC-Q2-26]
    freeCashFlowTarget: 3000,          // FY2026 FCF target $M [CITED:EC-Q2-26]
    dividendPerShare: 3.64,            // quarterly dividend ~$0.91/share × 4 [DERIVED]
  },

  workingCapital: {
    dso: 55,                           // est. MedTech typical DSO [ASSUMED]
    dsoTarget: 50,
    inventoryDays: 90,                 // est. MedTech device inventory [ASSUMED]
    inventoryDaysTarget: 80,
    dpo: 60,                           // est. MedTech payable days [ASSUMED]
    dpoTarget: 65,
  },

  executiveDisplayMetrics: {
    adjustedRevenueYoYPercent: 5.2,                   // Q2 FY26 reported revenue growth
    premiumProductRevenueYoYPercent: 5.3,             // Interventional segment growth (highest-growth segment)
    adjustedOperatingMarginPercent: 24.2,             // Q2 FY26 adj. operating margin [CITED:EC-Q2-26]
    adjustedEpsDollars: 3.58,                         // Q2 FY26 adj. diluted EPS [CITED:EC-Q2-26]
    freeCashFlowQuarterlyBillions: 1.095,             // H1 FY26 FCF $1,095M [CITED:EC-Q2-26]
    revenueFootnote: 'Q2 FY26: $4,714M (+5.2% reported, +2.6% organic FXN); adj. EPS $3.58; FY26 guidance adj. EPS $12.52–$12.72',
  },

  // Scenario engine baseline — values in $M (FY2026 full-year basis, segment revenues)
  // CRITICAL: segment names here must EXACTLY match lib/scenario-engine.ts sharedSegmentRevenue() calls
  scenarioBaseline: {
    segments: [
      { name: 'Medical Essentials', revenue: 6220 },        // FY2026 est. $M (+2% organic from $6,098M) [DERIVED]
      { name: 'Connected Care', revenue: 4784 },             // FY2026 est. $M (+5% organic from $4,556M) [DERIVED]
      { name: 'BioPharma Systems', revenue: 2394 },          // FY2026 est. $M (+3% organic from $2,324M) [DERIVED]
      { name: 'Interventional', revenue: 5535 },             // FY2026 est. $M (+6% organic from $5,217M) [DERIVED]
    ],
    cogs: {
      personnelCosts: 4000,            // est. FY2026 manufacturing / R&D labor ($M) [ASSUMED]
      subcontractorCosts: 600,         // est. contract manufacturing, professional services ($M) [ASSUMED]
      facilityCosts: 5800,             // est. manufacturing COGS excl. labor ($M) [ASSUMED]
    },
    opex: {
      technologyCosts: 800,            // est. IT and digital investments ($M) [ASSUMED]
      marketing: 900,                  // est. selling and marketing ($M) [ASSUMED]
      professionalDev: 200,            // est. training and organizational development ($M) [ASSUMED]
      sga: 1800,                       // est. G&A ($M) [ASSUMED]
      otherOpEx: 700,                  // est. other operating expenses including amortization ($M) [ASSUMED]
    },
    interestExpense: 613,              // FY2025 interest expense $M [CITED:10K-FY25]
    otherIncome: -80,                  // est. net other income/expense ($M) [ASSUMED]
    taxRate: 0.18,                     // est. effective tax rate for MedTech [ASSUMED]
    dAndA: 1800,                       // est. FY2026 D&A including intangible amortization ($M) [ASSUMED]
    revenuePerClient: 250,             // est. avg revenue per hospital system ($M) [CONFIG-ONLY]
    flowThrough: {
      transactionalPctOfRevenue: 0.45, // consumables and disposables (recurring)
      resilientPctOfRevenue: 0.55,     // capital equipment, long-term contracts, and systems
    },
    sensitivity: {
      churnRate_to_Revenue: -0.08,     // proxy: 1% pricing impact on MedTech revenues
      fwaNetAdds_to_Revenue: 0.4,      // proxy: 1% volume change in Interventional segment
      arpaDollar_to_Revenue: 1.0,      // proxy: new product contribution to revenue
    },
    monteCarlo: {
      volatilityFactor: 0.06,          // MedTech moderate revenue volatility
      baseOperatingMargin: 0.242,      // Q2 FY26 adj. operating margin [CITED:EC-Q2-26]
      netIncomeConversion: 0.70,       // adj. net income / adj. operating income [DERIVED]
    },
  },
};
