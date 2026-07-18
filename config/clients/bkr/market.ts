// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/market.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Baker Hughes Company public disclosures: Form 10-K (FY2025); Form 10-Q
// (Q1 2026); Q1 2026 earnings call (Apr 24, 2026). Competitor data from
// SLB Q1 2026 earnings, Halliburton Q1 2026 earnings, GE Vernova Q1 2026
// earnings, Siemens Energy Q2 FY2026 results. Market sizing from IEA,
// Wood Mackenzie, and analyst consensus (April–May 2026).
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { MarketConfig } from '../../types';

export const market: MarketConfig = {
  // Global oilfield services + energy technology equipment addressable market
  // OFS ~$150B + energy technology/equipment (LNG, compression, power) ~$120B = ~$270B
  totalMarketSize: '~$270B global oilfield services & energy technology',
  // BKR FY2025 est. ~$27B revenue / ~$270B TAM [DERIVED / ASSUMED]
  companyMarketShare: 10.0,
  marketShareTarget: 11.5,             // IET Horizon 2 + OFSE stabilization trajectory [ASSUMED]
  marketShareYoY: 0.4,                 // gains driven by IET / LNG share capture [ASSUMED]
  segmentGrowth: 6.5,                  // energy technology market CAGR 2024–2028 [ASSUMED]

  competitors: [
    {
      name: 'SLB (formerly Schlumberger)',
      marketShare: 18.5,               // SLB ~$36B FY2025 revenue / $270B TAM est. [ASSUMED]
      yoyChange: 0.2,
      strengths: [
        'Largest OFS company by revenue — ~$36B FY2025; broadest geographic footprint (100+ countries)',
        'Digital & Integration segment (Delfi platform) — AI-driven reservoir modeling and production optimization',
        'Leading OFSE margin at ~20%+ EBITDA; best-in-class operational efficiency benchmark for BKR',
        'Strong international NOC relationships (Saudi Aramco, ADNOC, Petrobras, TotalEnergies)',
        'New Energy ventures in CCS, geothermal, and hydrogen via SLB New Energy subsidiary',
      ],
    },
    {
      name: 'Halliburton (HAL)',
      marketShare: 13.0,               // HAL ~$23B FY2025 revenue / $270B TAM est. [ASSUMED]
      yoyChange: -0.2,
      strengths: [
        'North America completions leader (Completion & Production segment ~50% of revenue)',
        'iEnergy digital platform and ZEUS electric frac fleet — technology differentiation in NA',
        'Competitive OFSE margin ~17% EBITDA — comparable to BKR OFSE performance',
        'Strong US shale customer relationships (ExxonMobil, Pioneer/XOM, ConocoPhillips)',
        'Sperry Drilling measurement-while-drilling technology — strong downhole IP portfolio',
      ],
    },
    {
      name: 'GE Vernova',
      marketShare: 9.5,                // GEV ~$20B FY2025 revenue focused on power/grid [ASSUMED]
      yoyChange: 1.5,
      strengths: [
        'Gas Power segment leader: 7,000+ installed gas turbines; dominant Class F/H gas turbine installed base',
        'Offshore/onshore wind and grid equipment; direct competitor in power segment vs BKR IET',
        'Aeroderivative JV (50/50 with BKR) — both companies share aero turbine supply chain dependency',
        'Electrification segment (Grid Solutions) capturing data center power wave with transformers and switchgear',
        'Higher revenue but lower EBITDA margin (~15–18%) vs BKR IET (20.2%) — BKR IET more profitable per $ revenue',
      ],
    },
    {
      name: 'Siemens Energy',
      marketShare: 8.0,                // ~$17B relevant energy technology revenue [ASSUMED]
      yoyChange: 0.8,
      strengths: [
        'Siemens Gamesa wind turbines (recovering from blade quality issues) — renewable energy exposure',
        'Industrial gas turbines and compression — direct IET competitor in European LNG and industrial markets',
        'Grid Technologies segment benefiting from same data center electrification tailwind',
        'Strong European and Middle East presence (ADNOC Gas compression contracts)',
        'Dresser-Rand acquisition legacy gives compression IP portfolio competing with BKR GTE',
      ],
    },
    {
      name: 'TechnipFMC (FTI)',
      marketShare: 3.5,                // ~$9B subsea/surface revenue [ASSUMED]
      yoyChange: 0.5,
      strengths: [
        'Subsea leader: iEPCI (integrated EPCI) model captures full subsea tie-back projects',
        'Direct subsea competitor to BKR SSPS product line (subsea trees, manifolds, control systems)',
        'Flexible pipe and umbilicals via Technip Energies spin-off technology sharing',
        'Brazilian deepwater expertise (Petrobras partner) — competing for same LatAm subsea orders as BKR',
        'Flexible backlog model; growing subsea services as installed base expands',
      ],
    },
  ],

  marketDrivers: [
    'LNG supercycle: global LNG capacity additions require ~$400B investment through 2030 — BKR IET GTE/GTS direct beneficiary; IET RPO $33.1B reflects structural demand capture [CITED:EC-Q1-26]',
    'Data center power demand: hyperscaler (Microsoft, Google, Meta, Amazon) investment in gas-fired backup and primary power driving CTS orders 9x YoY ($1.26B Q1 2026); aeroderivative turbine demand exceeding supply [CITED:10Q-Q1-26]',
    'Energy security & supply diversification: European LNG import terminal buildout accelerated post-Russia/Ukraine; Middle East and African gas monetization (Mozambique, Qatar, UAE) requiring BKR GTE turbomachinery [CITED:EC-Q1-26]',
    'International rig count recovery: international rig count +20% YoY (Q1 2026 avg 1,083 vs 903 Q1 2025) — OFSE international revenue direct beneficiary despite NA softness [CITED:10Q-Q1-26]',
    'Brazil deepwater buildout: Petrobras 5-year plan >$100B capex through 2028; subsea equipment (SSPS), completion systems, and production chemicals demand in pre-salt Santos Basin [CITED:EC-Q1-26]',
    'Climate technology transition: CCUS, geothermal, and hydrogen projects represent $5B+ annual global equipment market; BKR CTS positioned as solutions provider across energy transition technologies',
    'Gas turbine installed base monetization: as GTE fleet grows, GTS long-term service agreements (LTSAs) compound — high-margin recurring services revenue with 15-year+ contract tenors [CITED:10Q-Q1-26]',
    'Artificial intelligence / digital optimization: Leucipa AI production platform and iCenter remote monitoring enabling operators to maximize recovery and reduce downtime — creates technology differentiation vs pure OFS peers',
    'Chart Industries acquisition: cryogenic heat exchangers and cold box technology expand BKR IET into full LNG modular train scope — from turbomachinery to complete liquefaction systems [CITED:10Q-Q1-26]',
  ],

  marketChallenges: [
    'North America rig count softness: NA rig count -7% YoY (749 avg Q1 2026 vs 803 Q1 2025) — E&P operators cautious on capex amid $65–75/bbl WTI price range; OFSE NA revenue headwind [CITED:10Q-Q1-26]',
    'Middle East geopolitical disruptions: regional conflict impacts on activity levels in key OFSE markets (Middle East/Asia -19% OFSE revenue YoY Q1 2026); customer activity uncertainty in H1 2026 [CITED:10Q-Q1-26]',
    'Aeroderivative supply chain tightness: GE Vernova JV (50/50 aero turbine manufacturing) constrained by long lead times; limits near-term CTS delivery and data center power order fulfillment [CITED:EC-Q1-26]',
    'Post-Chart acquisition leverage: closing ~$13.6B Chart acquisition raises net leverage to ~2.0x from 0.3x; reduces balance sheet flexibility during integration period through 2026–2027 [CITED:10Q-Q1-26]',
    'OFSE margin pressure from divestitures: SPC (Cactus JV) and PSI (Crane) dispositions removed ~$170M/quarter OFSE revenue; remaining OFSE must absorb fixed cost base with lower volume [CITED:10Q-Q1-26]',
    'Oil price sensitivity: Brent crude cycle uncertainty — sustained <$60/bbl would reduce E&P budgets and OFSE demand materially; OFSE revenue highly correlated to oil price with ~6-month lag',
    'SLB competitive pressure on OFSE margins: SLB commanding ~20%+ EBITDA margin in OFS vs BKR OFSE 17.5%; cost-out program must deliver to narrow the gap without sacrificing market share',
    'LNG FID timing risk: LNG final investment decisions (FIDs) subject to regulatory approvals, permitting, and gas pricing; delay of major LNG projects could slow GTE order intake after current record backlog depletes',
  ],

  regionalBreakdown: [
    {
      region: 'Middle East & Asia (OFSE Core)',
      revenue: 36.0,                   // ~36% of OFSE Q1 2026 ($1,152M / $3,237M) [CITED:10Q-Q1-26]
      growth: -19.0,                   // YoY decline from conflict disruptions Q1 2026 [CITED:10Q-Q1-26]
      keyInsight:
        'Largest OFSE region by revenue share (36%). Q1 2026 revenue $1,152M — down 19% YoY from ' +
        'regional conflict impacts, partially offset by strong ADNOC and PTTEP activity. Recovery ' +
        'expected H2 2026 as project activity normalizes. Saudi Aramco, ADNOC, and PTTEP are anchor ' +
        'customers under long-term agreements. International rig count +20% YoY supports recovery outlook.',
    },
    {
      region: 'North America (OFSE + IET)',
      revenue: 29.0,                   // ~29% of OFSE Q1 2026 ($927M / $3,237M) [CITED:10Q-Q1-26]
      growth: -3.0,                    // NA rig count -7% YoY; OFSE revenue moderately lower [ASSUMED]
      keyInsight:
        'North America OFSE Q1 2026 revenue $927M. Rig count headwind (-7% YoY, avg 749) from E&P ' +
        'capex caution at current oil prices. IET data center power demand rapidly growing in NA — CTS ' +
        'orders accelerating driven by hyperscaler gas turbine purchases. US = 18% of gross receivables. ' +
        'Deepwater GoM and offshore activity partially offsetting land drilling softness.',
    },
    {
      region: 'Latin America (OFSE Growth)',
      revenue: 18.5,                   // ~18.5% of OFSE Q1 2026 ($600M / $3,237M) [CITED:10Q-Q1-26]
      growth: 6.0,                     // +6% YoY Brazil deepwater strength [CITED:10Q-Q1-26]
      keyInsight:
        'OFSE revenue $600M Q1 2026, +6% YoY — strongest OFSE regional growth driven by Brazil ' +
        'deepwater pre-salt activity (Petrobras). Subsea and Surface Pressure Systems (SSPS) orders ' +
        'growing as Petrobras expands Santos Basin capacity. Argentina (Vaca Muerta shale) and Mexico ' +
        'are secondary growth markets. BKR has CDS exposure to a Mexican customer ($159M notional ' +
        'declining to zero by Sep 2026).',
    },
    {
      region: 'Europe / CIS / Sub-Saharan Africa (OFSE)',
      revenue: 17.2,                   // ~17.2% of OFSE Q1 2026 ($558M / $3,237M) [CITED:10Q-Q1-26]
      growth: -4.0,                    // -4% YoY Russia/CIS headwinds [CITED:10Q-Q1-26]
      keyInsight:
        'OFSE revenue $558M Q1 2026, -4% YoY from Russia/CIS headwinds. African LNG development ' +
        '(Mozambique, Nigeria, Angola) is key medium-term growth driver for IET GTE equipment. ' +
        'Mozambique LNG (TotalEnergies) represents multi-billion-dollar GTE pipeline opportunity. ' +
        'European energy security investments support IET gas infrastructure demand. North Sea mature ' +
        'field production chemistry and completions services provide stable OFSE base.',
    },
    {
      region: 'Global IET — Gas Technology (LNG & Industrial)',
      revenue: 50.9,                   // IET = 50.9% of BKR total Q1 2026 [DERIVED:10Q-Q1-26]
      growth: 14.4,                    // IET total +14.4% YoY [CITED:10Q-Q1-26]
      keyInsight:
        'IET now represents majority of BKR revenue (50.9% Q1 2026) and highest-margin segment ' +
        '(20.2% EBITDA). Gas Technology Equipment +14% YoY ($1,665M) and Gas Technology Services ' +
        '+34% YoY ($791M) driven by global LNG supercycle and LTSA installed base compounding. ' +
        'IET RPO $33.1B (record) underpins 3–5 years of revenue visibility. Chart Industries ' +
        'acquisition (expected Q2 2026) adds cryogenic/cold box scope to full LNG train capability.',
    },
  ],
};
