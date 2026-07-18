import { PrismaClient } from '@prisma/client';

// =============================================================================
// 8 Becton, Dickinson and Company (BDX) business consoles, each with 3 key
// drivers and 3 sub-drivers per driver. Each sub-driver has one DriverMetric.
//
// SOURCE: Becton, Dickinson and Company (BDX)
//   - Q2 FY26 Earnings (May 2026), FY2025 10-K, FY2026 Guidance,
//     FDA consent decree filings, BD investor supplement materials.
//
// Consoles map to BD's four segments plus enterprise financial consoles:
//   medical-essentials, connected-care, biopharma-systems, interventional,
//   finance, strategy
// Title→slug mapping lives in app/business-consoles/BusinessConsolesClient.tsx.
//
// CRITICAL: Driver names defined here are referenced in:
//   - 17-epm-config.ts (causalityWeight updates via driver name)
//   - 18-commentary.ts (driver ID lookups via prisma.consoleDriver.findFirst)
// Any name change here must be reflected in both 17 and 18.
// =============================================================================

interface MetricDef {
  name: string;
  unit: 'currency' | 'percent' | 'count' | 'time' | 'score' | 'ratio' | 'index';
  currentValue: string;
  target: string;
  frequency: 'quarterly' | 'monthly' | 'daily' | 'weekly';
  direction: 'higher' | 'lower' | 'on_target';
}

interface SubDriverDef {
  name: string;
  description: string;
  metric: MetricDef;
}

interface KeyDriverDef {
  name: string;
  description: string;
  subDrivers: SubDriverDef[];
}

interface ConsoleDef {
  slug: string;
  title: string;
  category: string;
  segment: string;
  objective: string;
  keyDrivers: KeyDriverDef[];
}

const consoleDefinitions: ConsoleDef[] = [
  // =========================================================================
  // 1. MEDICAL ESSENTIALS
  // =========================================================================
  {
    slug: 'medical-essentials',
    title: 'Medical Essentials',
    category: 'Revenue & Market',
    segment: 'medical-essentials',
    objective:
      'Grow Medical Essentials revenue at mid-single-digit constant currency while managing China VoBP headwinds through emerging market offset and U.S. share gains, targeting segment adj. operating margin of 21–22%.',
    keyDrivers: [
      {
        name: 'China VoBP Headwind Management',
        description: 'China Volume-Based Procurement tender wave impact on BD syringe, blood collection, and IV therapy revenues; mix-shift mitigation strategy',
        subDrivers: [
          {
            name: 'China VoBP Annual Revenue Headwind ($M)',
            description: 'Cumulative annual revenue headwind from NHSA VoBP tenders; FY2026 plan $160M; additional wave risk',
            metric: { name: 'China VoBP Headwind', unit: 'currency', currentValue: '$80M H1 FY26 ($160M FY plan)', target: '≤$160M FY26 (no new waves)', frequency: 'quarterly', direction: 'lower' },
          },
          {
            name: 'China Premium Product Mix (%)',
            description: 'Revenue share from premium non-tendered BD products in China — higher margin and lower VoBP exposure',
            metric: { name: 'China Premium Mix', unit: 'percent', currentValue: '~28%', target: '>35% by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Emerging Markets Offset Revenue Growth (% YoY)',
            description: 'Revenue growth in India, SE Asia, LATAM to offset China VoBP headwind; India +14% YoY Q2 FY26',
            metric: { name: 'EM Offset Growth', unit: 'percent', currentValue: '+11% YoY (ex-China EM)', target: '>10% sustained', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'U.S. Medical Essentials Volume Growth',
        description: 'Domestic volume growth in BD syringes, IV catheters, blood collection, and sharps disposal driven by GPO contract wins and hospital census',
        subDrivers: [
          {
            name: 'U.S. Volume Growth (% YoY)',
            description: 'Year-over-year U.S. Medical Essentials volume growth — GPO contract wins, hospital census, GLP-1 pen needle demand',
            metric: { name: 'U.S. Volume Growth', unit: 'percent', currentValue: '+3.5% YoY Q2 FY26', target: '≥+3.0% sustained FY26', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'GPO Contract Win Rate (%)',
            description: 'BD Medical Essentials success rate in U.S. GPO contract competitions — primary mechanism for U.S. share gains',
            metric: { name: 'GPO Win Rate', unit: 'percent', currentValue: '~72%', target: '>75%', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Insulin Pen Needle Volume (M units/quarter)',
            description: 'BD insulin pen needle volumes — growing with GLP-1 agonist (Ozempic, Mounjaro) patient adoption requiring daily injections',
            metric: { name: 'Insulin Pen Needle Volume', unit: 'count', currentValue: '~850M units/quarter', target: '>900M by Q4 FY26', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'Medical Essentials Segment Margin',
        description: 'Medical Essentials adjusted operating margin; cost efficiency through BD Excellence manufacturing program; mix improvement',
        subDrivers: [
          {
            name: 'Medical Essentials Adj. Operating Margin (%)',
            description: 'Segment adjusted operating margin — balancing VoBP headwinds vs volume growth and mix improvement',
            metric: { name: 'Medical Essentials Adj. Margin', unit: 'percent', currentValue: '21.5% Q2 FY26', target: '21–22% FY26 guidance', frequency: 'quarterly', direction: 'on_target' },
          },
          {
            name: 'Manufacturing Cost per Unit Index',
            description: 'BD Medical Essentials manufacturing cost per unit vs prior-year baseline — BD Excellence program efficiency metric',
            metric: { name: 'Mfg Cost per Unit Index', unit: 'index', currentValue: '97.2 (vs 100 baseline)', target: '<96 by FY2027', frequency: 'quarterly', direction: 'lower' },
          },
          {
            name: 'BD Diagnostics Consumables Growth (% YoY)',
            description: 'BD pre-analytical systems (Vacutainer, specimen collection) revenue growth — high-frequency clinical lab consumables',
            metric: { name: 'Diagnostics Consumables Growth', unit: 'percent', currentValue: '+4.2% YoY', target: '>4.0% sustained', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 2. CONNECTED CARE
  // =========================================================================
  {
    slug: 'connected-care',
    title: 'Connected Care',
    category: 'Revenue & Market',
    segment: 'connected-care',
    objective:
      'Execute Alaris infusion pump market re-entry toward 75K annual units in FY2026 and 120K+ in FY2027, while growing Pyxis MedStation placements and Connected Care software to >30% of segment revenue.',
    keyDrivers: [
      {
        name: 'Alaris Infusion Pump Recovery',
        description: 'FDA consent decree resolution pathway; Alaris pump unit shipments vs 75K FY2026 plan; hospital capital order backlog realization',
        subDrivers: [
          {
            name: 'Alaris Annual Shipment Units (K)',
            description: 'Annual Alaris infusion pump unit shipments — primary Connected Care revenue recovery metric; FY2026 plan 75K',
            metric: { name: 'Alaris Annual Shipments', unit: 'count', currentValue: '72K annualized (H1 FY26)', target: '75K FY2026 / 120K+ FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'FDA Consent Decree Status',
            description: 'Current FDA consent decree compliance status for Alaris manufacturing — zero new 483 observations is prerequisite for full resolution',
            metric: { name: 'FDA Consent Decree Status', unit: 'score', currentValue: 'Active (Zero new 483s Q1-Q2 FY26)', target: 'Formal resolution by Q1 FY2027', frequency: 'quarterly', direction: 'on_target' },
          },
          {
            name: 'Deferred Alaris Order Backlog (K units)',
            description: 'Estimated deferred hospital capital orders for Alaris replacements — represents pent-up demand to be released post-consent decree',
            metric: { name: 'Deferred Alaris Backlog', unit: 'count', currentValue: '~32K units backlogged', target: '≤20K by YE2027 (released)', frequency: 'quarterly', direction: 'lower' },
          },
        ],
      },
      {
        name: 'Smart Medication Management (MMS) Growth',
        description: 'Pyxis MedStation capital placements, BD Roper robotic dispensing, and medication management ecosystem expansion',
        subDrivers: [
          {
            name: 'Pyxis MedStation Annual Placements (units)',
            description: 'Annual Pyxis MedStation automated dispensing cabinet placements — FY2026 plan 1,800 units',
            metric: { name: 'Pyxis Placements', unit: 'count', currentValue: '1,840 annualized (H1 FY26)', target: '1,800 FY2026 / 2,200 FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'MMS Capital Revenue ($M/quarter)',
            description: 'Smart Medication Management hardware capital revenue per quarter — Pyxis + Alaris hardware placements combined',
            metric: { name: 'MMS Capital Revenue', unit: 'currency', currentValue: '~$268M/quarter', target: '>$320M/quarter by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'EMR Integration Penetration (%)',
            description: 'Share of BD Pyxis/Alaris installed base with full EPIC/Cerner EMR integration — key retention and upsell driver',
            metric: { name: 'EMR Integration Rate', unit: 'percent', currentValue: '~68%', target: '>80% by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'Connected Care Software & Services',
        description: 'Recurring software, analytics, and service revenue growth — Pyxis software, Alaris DERS, BD HealthSight nursing analytics',
        subDrivers: [
          {
            name: 'Software & Services Revenue Growth (% YoY)',
            description: 'Year-over-year growth in BD Connected Care recurring software, analytics, and service revenue',
            metric: { name: 'Software & Services Growth', unit: 'percent', currentValue: '+11% YoY Q2 FY26', target: '>9% sustained FY26', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Software as % of Connected Care Revenue (%)',
            description: 'Software and services as share of Connected Care total revenue — mix shift to higher-margin recurring revenue',
            metric: { name: 'Software Revenue Mix', unit: 'percent', currentValue: '~31%', target: '>35% by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'BD HealthSight Active Customer Sites (count)',
            description: 'Active customer deployments of BD HealthSight real-time medication management and nursing analytics platform',
            metric: { name: 'HealthSight Sites', unit: 'count', currentValue: '~520 sites', target: '>700 sites by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 3. BIOPHARMA SYSTEMS
  // =========================================================================
  {
    slug: 'biopharma-systems',
    title: 'BioPharma Systems',
    category: 'Revenue & Market',
    segment: 'biopharma-systems',
    objective:
      'Sustain BioPharma Systems as BD\'s highest-margin segment (~32% adj. op. margin) by capturing GLP-1 drug delivery demand growth and expanding capacity ahead of pharmaceutical customer requirements through FY2028.',
    keyDrivers: [
      {
        name: 'GLP-1 Drug Delivery Demand',
        description: 'Prefillable syringe (PFS) volume growth driven by GLP-1 agonist drug supply agreements with Novo Nordisk and Eli Lilly; capacity utilization tracking',
        subDrivers: [
          {
            name: 'GLP-1 PFS Volume Growth (% YoY)',
            description: 'Year-over-year volume growth in GLP-1 prefillable syringe shipments — primary BioPharma Systems growth driver through FY2028',
            metric: { name: 'GLP-1 PFS Volume Growth', unit: 'percent', currentValue: '+19% YoY Q2 FY26', target: '+18% FY2026 plan / +20%+ FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'PFS Manufacturing Capacity Utilization (%)',
            description: 'BD global PFS manufacturing capacity utilization — at 88%, approaching capacity constraint requiring FY2027 expansion decision',
            metric: { name: 'PFS Capacity Utilization', unit: 'percent', currentValue: '88% Q2 FY26', target: '84% plan / <92% safety threshold', frequency: 'quarterly', direction: 'on_target' },
          },
          {
            name: 'BioPharma Customer Revenue Concentration (%)',
            description: 'Top 3 pharma customer revenue as % of BioPharma Systems — concentration risk metric for supply agreement dependency',
            metric: { name: 'Top-3 Customer Concentration', unit: 'percent', currentValue: '~58%', target: '<55% by FY2027 (diversification)', frequency: 'quarterly', direction: 'lower' },
          },
        ],
      },
      {
        name: 'BioPharma Systems Pricing & Mix',
        description: 'Net average selling price realization, premium product mix (coated barrels, nested PFS), and drug delivery device portfolio pricing power',
        subDrivers: [
          {
            name: 'Net Pricing Realization (% YoY)',
            description: 'Year-over-year net average selling price realization across BD BioPharma Systems PFS and drug delivery portfolio',
            metric: { name: 'BioPharma Pricing Realization', unit: 'percent', currentValue: '+2.8% Q2 FY26', target: '+2.5% FY2026 plan', frequency: 'quarterly', direction: 'on_target' },
          },
          {
            name: 'Premium PFS Revenue Mix (%)',
            description: 'Premium coated barrel and specialty nested PFS as share of total BD PFS revenue — higher margin and customer stickiness',
            metric: { name: 'Premium PFS Mix', unit: 'percent', currentValue: '~42%', target: '>48% by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'BioPharma Systems Adj. Operating Margin (%)',
            description: 'Segment adjusted operating margin — BD\'s highest margin segment at ~32%, driven by PFS mix and pricing power',
            metric: { name: 'BioPharma Adj. Margin', unit: 'percent', currentValue: '32.1% Q2 FY26', target: '32–33% FY2026 guidance', frequency: 'quarterly', direction: 'on_target' },
          },
        ],
      },
      {
        name: 'BioPharma Capacity Expansion',
        description: 'FY2026–FY2028 capital investment in PFS and drug delivery capacity at Franklin Lakes, North Carolina, and Pont-de-Claix, France',
        subDrivers: [
          {
            name: 'GLP-1 Capacity Capex ($M YTD)',
            description: 'Year-to-date capital expenditure on GLP-1 PFS capacity expansion — FY2026 plan $900M across NC and Ireland sites',
            metric: { name: 'GLP-1 Capex YTD', unit: 'currency', currentValue: '$420M YTD (H1 FY26)', target: '$900M FY2026 plan', frequency: 'quarterly', direction: 'on_target' },
          },
          {
            name: 'New Capacity Lines On-Stream (count)',
            description: 'Number of new PFS manufacturing lines commissioned and qualified — each line adds ~$80M annual capacity',
            metric: { name: 'New PFS Lines On-Stream', unit: 'count', currentValue: '2 lines commissioned FY26', target: '4 additional by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Supply Agreement Coverage (% of FY2028 capacity committed)',
            description: 'Share of incremental FY2028 PFS capacity covered by long-term pharma supply agreements — demand visibility',
            metric: { name: 'Supply Agreement Coverage', unit: 'percent', currentValue: '~76%', target: '>85% before greenfield commitment', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 4. INTERVENTIONAL
  // =========================================================================
  {
    slug: 'interventional',
    title: 'Interventional',
    category: 'Revenue & Market',
    segment: 'interventional',
    objective:
      'Deliver Interventional segment revenue growth of 6–8% constant currency annually, driven by peripheral vascular procedure recovery, oncology device growth, and innovation pipeline commercialization.',
    keyDrivers: [
      {
        name: 'Interventional Procedure Growth',
        description: 'Peripheral vascular, oncology intervention, and surgical procedure volume trends — primary demand driver for BD Interventional devices',
        subDrivers: [
          {
            name: 'Peripheral Vascular Revenue Growth (% CC)',
            description: 'Constant currency revenue growth for BD peripheral vascular portfolio — Lutonix DCB, angioplasty, atherectomy, thrombectomy',
            metric: { name: 'PV Revenue Growth CC', unit: 'percent', currentValue: '+8.0% CC Q2 FY26', target: '6–9% CC sustained', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Oncology Revenue Growth (% CC)',
            description: 'BD Interventional Oncology segment revenue growth — biopsy, ablation, vascular access for cancer treatment',
            metric: { name: 'Oncology Revenue Growth CC', unit: 'percent', currentValue: '+9.0% CC Q2 FY26', target: '>8% CC sustained', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'International Interventional CC Growth (%)',
            description: 'Interventional constant currency growth outside the U.S. — Europe and Asia procedure recovery post-COVID backlog',
            metric: { name: 'Intl Interventional Growth', unit: 'percent', currentValue: '+7.5% CC Q2 FY26', target: '>7% CC FY2026', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'Lutonix DCB & Vascular Innovation',
        description: 'Lutonix drug-coated balloon market share in superficial femoral artery (SFA); BD vascular portfolio pipeline innovations',
        subDrivers: [
          {
            name: 'Lutonix DCB U.S. Market Share (%)',
            description: 'BD Lutonix drug-coated balloon U.S. market share in SFA/popliteal artery segment — competitive with Medtronic IN.PACT',
            metric: { name: 'Lutonix U.S. Market Share', unit: 'percent', currentValue: '~31%', target: '>33%', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'New Interventional Product Revenue ($M)',
            description: 'Revenue from products launched in last 3 years — pipeline vitality metric for Interventional segment',
            metric: { name: 'New Product Revenue', unit: 'currency', currentValue: '~$185M/quarter', target: '>$220M/quarter by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Interventional Adj. Operating Margin (%)',
            description: 'Interventional segment adjusted operating margin — improving on mix shift to higher-margin oncology and vascular products',
            metric: { name: 'Interventional Adj. Margin', unit: 'percent', currentValue: '24.8% Q2 FY26', target: '25–26% FY2026 guidance', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'BD Surgery & Urology',
        description: 'BD Surgery (laparoscopic, bariatric, hernia) and Urology (BD Bard catheters, continence) revenue growth and margin',
        subDrivers: [
          {
            name: 'BD Surgery Revenue Growth (% CC)',
            description: 'BD surgical instruments and procedure-enabling devices constant currency growth — laparoscopic, bariatric, hernia',
            metric: { name: 'BD Surgery CC Growth', unit: 'percent', currentValue: '+3.0% CC Q2 FY26', target: '>3.5% CC FY2026', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'BD Bard Urology Revenue ($M/quarter)',
            description: 'BD Bard urological catheters and continence products quarterly revenue — resilient consumable franchise',
            metric: { name: 'BD Bard Urology Revenue', unit: 'currency', currentValue: '~$151M/quarter', target: '>$160M/quarter', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Interventional Revenue per Procedure ($)',
            description: 'Average BD Interventional revenue captured per relevant vascular or surgical procedure performed — pricing efficiency metric',
            metric: { name: 'Revenue per Procedure', unit: 'currency', currentValue: '~$285/procedure', target: '>$300/procedure', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 5. FINANCIAL PERFORMANCE
  // =========================================================================
  {
    slug: 'financial-performance',
    title: 'Financial Performance',
    category: 'Financial',
    segment: 'finance',
    objective:
      'Deliver BD FY2026 adj. EPS $12.52–$12.72 and adj. operating margin ~25%, supported by all four segment contributions, disciplined FX management, and interest expense reduction as leverage declines toward 2.5x.',
    keyDrivers: [
      {
        name: 'EPS & Guidance Delivery',
        description: 'Adjusted EPS progression tracking vs $12.52–$12.72 FY2026 guidance; consensus beat cadence; four-segment contribution',
        subDrivers: [
          {
            name: 'Adjusted EPS (Quarterly)',
            description: 'BD quarterly adjusted EPS — Q1 FY26 $3.35, Q2 FY26 $3.50; H1 $6.85 of $12.52–$12.72 FY target',
            metric: { name: 'Adjusted EPS', unit: 'currency', currentValue: '$3.50 Q2 FY26', target: '$12.52–$12.72 FY2026', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Adjusted EPS vs Consensus',
            description: 'Quarterly adjusted EPS vs Bloomberg consensus — guidance credibility and investor confidence metric',
            metric: { name: 'EPS vs Consensus', unit: 'currency', currentValue: '+$0.04 Q2 beat', target: 'Beat consensus each quarter', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Enterprise Revenue ($M)',
            description: 'BD total continuing operations revenue — Q2 FY26 $4,714M; FY2026 guidance ~$18.0B',
            metric: { name: 'Enterprise Revenue', unit: 'currency', currentValue: '$4,714M Q2 FY26', target: '~$18.0B FY2026', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'BD Segment Operating Income Bridge',
        description: 'Adjusted operating income contribution by segment; blended margin tracking vs ~25% guidance',
        subDrivers: [
          {
            name: 'Adj. Operating Margin (%)',
            description: 'BD enterprise adjusted operating margin — all four segments combined; FY2026 guidance ~25%',
            metric: { name: 'Adj. Operating Margin', unit: 'percent', currentValue: '25.0% Q2 FY26', target: '~25% FY2026 guidance', frequency: 'quarterly', direction: 'on_target' },
          },
          {
            name: 'BioPharma Systems Adj. OI ($M)',
            description: 'Highest-margin BD segment adj. operating income — primary margin quality driver at ~32% margin',
            metric: { name: 'BioPharma Adj. OI', unit: 'currency', currentValue: '~$375M/quarter', target: '~$1,500M FY2026', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Connected Care Adj. OI ($M)',
            description: 'Connected Care adj. operating income — recovering as Alaris ramps; currently lowest segment margin at ~18%',
            metric: { name: 'Connected Care Adj. OI', unit: 'currency', currentValue: '~$95M/quarter', target: '~$400M FY2026', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'Free Cash Flow & Capital Returns',
        description: 'FCF generation ~$3B+ FY2026; dividend sustainability; share repurchase pathway after leverage reaches 2.5x',
        subDrivers: [
          {
            name: 'Free Cash Flow ($M/quarter)',
            description: 'BD quarterly free cash flow — primary funding source for debt reduction and capital returns',
            metric: { name: 'Free Cash Flow', unit: 'currency', currentValue: '$785M Q2 FY26', target: '~$3.0B+ FY2026', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'FCF Conversion (% adj. net income)',
            description: 'FCF as percentage of adjusted net income — BD targets ~95% conversion through working capital discipline',
            metric: { name: 'FCF Conversion', unit: 'percent', currentValue: '96% Q2 FY26', target: '≥95% FY2026', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Annual Dividend per Share ($)',
            description: 'BD annual dividend per share — maintained through deleveraging period; $3.80 annualized FY2026',
            metric: { name: 'Annual Dividend', unit: 'currency', currentValue: '$3.80/share ($0.95/quarter)', target: 'Maintained ($3.80+)', frequency: 'quarterly', direction: 'on_target' },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 6. CAPITAL ALLOCATION & LEVERAGE
  // =========================================================================
  {
    slug: 'capital-allocation',
    title: 'Capital Allocation',
    category: 'Financial',
    segment: 'finance',
    objective:
      'Reduce BD net leverage from 2.9x to <2.5x by FY2028 through disciplined FCF allocation to debt reduction, while investing $1.7B annually in capex supporting GLP-1 capacity expansion and Alaris remediation.',
    keyDrivers: [
      {
        name: 'Leverage & Debt Reduction',
        description: 'Net debt / adj. EBITDA trajectory from 2.9x toward <2.5x by FY2028; gross debt paydown cadence; Baa1/BBB+ credit maintenance',
        subDrivers: [
          {
            name: 'Net Leverage Ratio (x)',
            description: 'BD net debt to adj. EBITDA leverage ratio — Q2 FY26 2.9x; target <2.5x by FY2028 for share repurchase reinstatement',
            metric: { name: 'Net Leverage Ratio', unit: 'ratio', currentValue: '2.9x Q2 FY26', target: '<2.5x by FY2028', frequency: 'quarterly', direction: 'lower' },
          },
          {
            name: 'Gross Debt Reduction ($M YTD)',
            description: 'Year-to-date gross debt reduction through FCF-funded maturities and optional prepayments',
            metric: { name: 'Gross Debt Reduction YTD', unit: 'currency', currentValue: '$750M YTD (H1 FY26)', target: '$1,500M FY2026 plan', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'BD Credit Rating',
            description: 'BD credit rating from Moody\'s and S&P — Baa1/BBB+; target Baa1 upgrade to A3 at ≤2.5x leverage',
            metric: { name: 'BD Credit Rating', unit: 'score', currentValue: 'Baa1 (Moody\'s) / BBB+ (S&P)', target: 'A3/A- at ≤2.5x leverage', frequency: 'quarterly', direction: 'on_target' },
          },
        ],
      },
      {
        name: 'Capital Expenditure Management',
        description: 'BD capex discipline: GLP-1 capacity ($900M FY26 plan), Alaris remediation ($300M FY26), and base maintenance capex; return on invested capital tracking',
        subDrivers: [
          {
            name: 'GLP-1 Capacity Capex ($M FY26)',
            description: 'FY2026 capital investment in BioPharma Systems GLP-1 PFS capacity at NC, Ireland, and existing sites',
            metric: { name: 'GLP-1 Capex', unit: 'currency', currentValue: '$420M YTD (vs $900M FY plan)', target: '$900M FY2026', frequency: 'quarterly', direction: 'on_target' },
          },
          {
            name: 'Alaris Remediation Cash Costs ($M FY26)',
            description: 'Cash outflows for Alaris FDA consent decree remediation — quality system upgrades, consultants, monitoring costs',
            metric: { name: 'Alaris Remediation Costs', unit: 'currency', currentValue: '$145M YTD (vs $300M FY plan)', target: '≤$300M FY2026', frequency: 'quarterly', direction: 'lower' },
          },
          {
            name: 'Return on Invested Capital (%)',
            description: 'BD ROIC — target improvement as high-return BioPharma Systems capacity generates incremental revenue',
            metric: { name: 'ROIC', unit: 'percent', currentValue: '~11.8%', target: '>13% by FY2028', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'Interest Expense & Cost of Capital',
        description: 'Quarterly interest expense trajectory as leverage declines; refinancing economics; impact on EPS and FCF',
        subDrivers: [
          {
            name: 'Net Interest Expense ($M/quarter)',
            description: 'BD net interest expense per quarter — declining as gross debt reduces toward $15B by FY2028',
            metric: { name: 'Net Interest Expense', unit: 'currency', currentValue: '~$155M/quarter', target: '<$130M/quarter by FY2028', frequency: 'quarterly', direction: 'lower' },
          },
          {
            name: 'Weighted Average Debt Cost (%)',
            description: 'BD weighted average cost of outstanding long-term debt — target reduction through refinancing and paydown of high-coupon tranches',
            metric: { name: 'Weighted Avg Debt Cost', unit: 'percent', currentValue: '~3.8%', target: '<3.5% by FY2028', frequency: 'quarterly', direction: 'lower' },
          },
          {
            name: 'Annual Interest Expense Savings ($M)',
            description: 'Cumulative annual interest savings from gross debt reduction and maturing high-coupon tranche replacement',
            metric: { name: 'Interest Expense Savings', unit: 'currency', currentValue: '$30M annualized YTD', target: '$60M+ FY2026 plan', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 7. CHINA & EMERGING MARKETS
  // =========================================================================
  {
    slug: 'china-emerging-markets',
    title: 'China & Emerging Markets',
    category: 'Strategy & Markets',
    segment: 'strategy',
    objective:
      'Limit China VoBP headwind to ≤$160M FY2026 through proactive mix-shift to premium non-tendered products, while sustaining 10%+ growth in India, SE Asia, and LATAM to partially offset China headwinds.',
    keyDrivers: [
      {
        name: 'China Revenue & VoBP Management',
        description: 'China revenue composition; VoBP tender exposure management; premium product mix-shift strategy',
        subDrivers: [
          {
            name: 'China Revenue ($M/quarter)',
            description: 'BD total China revenue per quarter — ~10% of total BD revenue; declining on VoBP pricing concessions but partially offset by mix',
            metric: { name: 'China Revenue', unit: 'currency', currentValue: '~$471M/quarter (Q2 FY26)', target: 'Stabilize at ≥$420M/quarter', frequency: 'quarterly', direction: 'on_target' },
          },
          {
            name: 'China VoBP-Exposed Revenue (%)',
            description: 'Share of BD China revenue in products under active VoBP tender — higher = more pricing risk in new waves',
            metric: { name: 'VoBP-Exposed Revenue Share', unit: 'percent', currentValue: '~62%', target: '<50% by FY2027 (mix-shift)', frequency: 'quarterly', direction: 'lower' },
          },
          {
            name: 'China Premium Product Revenue ($M)',
            description: 'BD China revenue from premium, non-tendered product categories — diagnostics, specialty consumables, Connected Care',
            metric: { name: 'China Premium Revenue', unit: 'currency', currentValue: '~$132M/quarter', target: '>$165M/quarter by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'India & Southeast Asia Growth',
        description: 'India revenue growth trajectory; SE Asia government healthcare investment; distributor and GPO expansion in high-growth markets',
        subDrivers: [
          {
            name: 'India Revenue Growth (% YoY)',
            description: 'BD India year-over-year revenue growth — government healthcare expansion and hospital infrastructure investment',
            metric: { name: 'India Revenue Growth', unit: 'percent', currentValue: '+14% YoY Q2 FY26', target: '>12% sustained FY26', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'SE Asia Revenue ($M/quarter)',
            description: 'BD Southeast Asia (Singapore, Thailand, Vietnam, Indonesia, Philippines) quarterly revenue — healthcare infrastructure build-out',
            metric: { name: 'SE Asia Revenue', unit: 'currency', currentValue: '~$105M/quarter', target: '>$120M/quarter by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Emerging Market Revenue as % of International (%)',
            description: 'Share of BD international revenue from emerging markets (ex-China) — mix shift toward higher-growth markets',
            metric: { name: 'EM Revenue Share of International', unit: 'percent', currentValue: '~32%', target: '>35% by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'LATAM Revenue Growth',
        description: 'Latin America revenue growth — Brazil, Mexico, Colombia key markets; government tender performance; distributor management',
        subDrivers: [
          {
            name: 'LATAM Revenue Growth (% CC)',
            description: 'BD Latin America constant currency revenue growth — strong nominal growth in Brazil/Argentina offset by currency',
            metric: { name: 'LATAM CC Growth', unit: 'percent', currentValue: '+8.2% CC Q2 FY26', target: '>7% CC sustained', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Brazil Revenue ($M/quarter)',
            description: 'BD Brazil quarterly revenue — largest LATAM market; hospital tender wins and BD diagnostics expansion',
            metric: { name: 'Brazil Revenue', unit: 'currency', currentValue: '~$78M/quarter', target: '>$90M/quarter by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'LATAM Government Tender Win Rate (%)',
            description: 'BD win rate on government healthcare tender bids in key LATAM markets — primary revenue access mechanism',
            metric: { name: 'LATAM Tender Win Rate', unit: 'percent', currentValue: '~68%', target: '>72%', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 8. FX & INTERNATIONAL
  // =========================================================================
  {
    slug: 'fx-international',
    title: 'FX & International',
    category: 'Financial',
    segment: 'finance',
    objective:
      'Manage BD\'s ~$230M FY2026 FX translation headwind through hedging programs and international pricing, while maintaining ~48% international revenue mix as BioPharma Systems and Medical Essentials international growth outpaces domestic.',
    keyDrivers: [
      {
        name: 'FX Translation Impact',
        description: 'EUR/USD, CNY/USD, JPY/USD, BRL/USD translation headwinds; BD hedge portfolio coverage; CC vs reported growth differential',
        subDrivers: [
          {
            name: 'FX Translation Annual Headwind ($M)',
            description: 'Total annual FX translation headwind on BD revenue — FY2026 plan ($230M); H1 FY26 ($116M) on track',
            metric: { name: 'FX Translation Headwind', unit: 'currency', currentValue: '($116M) H1 FY26', target: '($230M) FY2026 plan', frequency: 'quarterly', direction: 'on_target' },
          },
          {
            name: 'CC Revenue Growth Premium (bps vs Reported)',
            description: 'Basis points premium of constant currency growth over reported growth — reflects FX drag on reported metrics',
            metric: { name: 'CC vs Reported Premium', unit: 'index', currentValue: '+250bps CC premium Q2 FY26', target: 'Disclosed and communicated', frequency: 'quarterly', direction: 'on_target' },
          },
          {
            name: 'Net Hedge Benefit ($M/quarter)',
            description: 'Net benefit from BD FX forward contracts, cross-currency swaps, and natural hedges',
            metric: { name: 'Net Hedge Benefit', unit: 'currency', currentValue: '$16M/quarter Q2 FY26', target: '>$15M/quarter sustained', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
      {
        name: 'International Revenue Mix',
        description: 'International revenue as % of BD total; BioPharma Systems European pharma customer growth; international margin profile',
        subDrivers: [
          {
            name: 'International Revenue Mix (%)',
            description: 'BD international revenue as percentage of total consolidated revenue — FY2026 plan ~48%',
            metric: { name: 'International Revenue Mix', unit: 'percent', currentValue: '48.2% Q2 FY26', target: '~48% FY2026 / ~50% by FY2028', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'Europe Revenue Growth (% CC)',
            description: 'BD Europe constant currency revenue growth — largest international region; BioPharma Systems PFS pharma customers',
            metric: { name: 'Europe CC Growth', unit: 'percent', currentValue: '+6.8% CC Q2 FY26', target: '>6% CC FY2026', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'EUR/USD Average Rate',
            description: 'Average EUR/USD exchange rate for reporting period — primary BD FX sensitivity (~$45M revenue per $0.01 EUR/USD)',
            metric: { name: 'EUR/USD Average Rate', unit: 'ratio', currentValue: '1.082 Q2 FY26', target: '1.075 plan rate assumption', frequency: 'quarterly', direction: 'on_target' },
          },
        ],
      },
      {
        name: 'International Pricing Strategy',
        description: 'Local currency pricing adjustments in high-inflation markets; international gross margin management; emerging market pricing discipline',
        subDrivers: [
          {
            name: 'International Gross Margin (%)',
            description: 'BD international segment gross margin — typically lower than U.S. due to distributor margins and local pricing in EM',
            metric: { name: 'International Gross Margin', unit: 'percent', currentValue: '~46.8%', target: '>47% by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'High-Inflation Market Pricing Offset ($M)',
            description: 'Revenue benefit from BD local currency price increases in high-inflation markets (Brazil, Argentina, Turkey) — partial FX offset',
            metric: { name: 'HI Market Pricing Offset', unit: 'currency', currentValue: '~$42M/quarter partial offset', target: 'Maximize as policy permits', frequency: 'quarterly', direction: 'higher' },
          },
          {
            name: 'International Revenue per Sales FTE ($K)',
            description: 'BD international revenue per commercial full-time equivalent — efficiency metric for international sales organization',
            metric: { name: 'International Rev per FTE', unit: 'currency', currentValue: '~$1,850K/year', target: '>$2,000K/year by FY2027', frequency: 'quarterly', direction: 'higher' },
          },
        ],
      },
    ],
  },
];

// =============================================================================
// Seed function: Creates consoles with their full driver trees
// =============================================================================

export async function seedBusinessConsoles(prisma: PrismaClient, companyId: number) {
  // Delete existing records in dependency order (metrics first, then drivers, then consoles)
  await prisma.driverMetric.deleteMany({ where: { driver: { console: { companyId } } } });
  await prisma.consoleDriver.deleteMany({ where: { console: { companyId } } });
  await prisma.businessConsole.deleteMany({ where: { companyId } });

  for (const def of consoleDefinitions) {
    // 1) Create the console
    const console_record = await prisma.businessConsole.create({
      data: {
        companyId,
        title:     def.title,
        category:  def.category,
        segment:   def.segment,
        objective: def.objective,
      },
    });

    // 2) For each key driver
    for (const kd of def.keyDrivers) {
      const driver = await prisma.consoleDriver.create({
        data: {
          consoleId:      console_record.id,
          name:           kd.name,
          description:    kd.description,
          parentDriverId: null,
        },
      });

      // 3) Sub-drivers + their metric
      for (const sd of kd.subDrivers) {
        const subDriver = await prisma.consoleDriver.create({
          data: {
            consoleId:      console_record.id,
            name:           sd.name,
            description:    sd.description,
            parentDriverId: driver.id,
          },
        });

        await prisma.driverMetric.create({
          data: {
            driverId:     subDriver.id,
            name:         sd.metric.name,
            unit:         sd.metric.unit,
            currentValue: sd.metric.currentValue,
            target:       sd.metric.target,
            frequency:    sd.metric.frequency,
            direction:    sd.metric.direction,
          },
        });
      }
    }
  }

  console.log(`Seeded ${consoleDefinitions.length} BD business consoles with full driver trees`);
}
