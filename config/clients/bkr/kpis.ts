// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/kpis.ts
//
// Provenance Legend:
// [CITED:10K-FY25]    — Baker Hughes FY2025 Form 10-K (filed Feb 2026)
// [CITED:10Q-Q1-26]   — Baker Hughes Q1 2026 Form 10-Q (filed Apr 2026)
// [CITED:EC-Q1-26]    — Baker Hughes Q1 2026 earnings call transcript (Apr 24, 2026)
// [DERIVED]           — Computed from cited values; math shown inline
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter, not a business datum
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// Baker Hughes Company public disclosures: Form 10-K (FY2025); Form 10-Q
// (Q1 2026); Q1 2026 earnings call (Apr 24, 2026); FY2026 guidance.
// KPI consoleId values map to BKR console schema (lib/semantic/consoles.ts).
//
// See: CLIENT - Research & Analysis/01 - Internal Document Analysis.md
// ─────────────────────────────────────────────────────────────────────
import { KPIConfig } from '../../types';

export const kpis: KPIConfig = {
  primaryKPIs: [
    {
      label: 'IET Segment Revenue',
      value: 3.35,
      unit: 'B',
      target: 3.6,                    // Q2 2026 guidance implies ~$3.5B+ per quarter
      trend: 'up',
      trendValue: '+14% YoY',
      status: 'good',
      description: 'Q1 2026 IET revenue $3,350M (+14% YoY). Driven by Gas Technology Equipment +14% and Gas Technology Services +34%. LNG supercycle and data center power demand are primary tailwinds.',
      consoleId: 'iet-performance',
      consoleName: 'IET Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Adjusted EBITDA',
      value: 1.16,
      unit: 'B',
      target: 1.13,                   // Q2 2026 guidance $1.13B [CITED:EC-Q1-26]
      trend: 'up',
      trendValue: '+12% YoY',
      status: 'good',
      description: 'Q1 2026 Adjusted EBITDA $1,160M (+12% YoY). Margin 17.6% (+140 bps YoY). FY2026 guidance: IET ≥$2.7B + OFSE ≥$2.325B = ≥$5.0B total.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'IET Book-to-Bill',
      value: 1.46,
      unit: 'x',
      target: 1.3,                    // sustained >1.0x indicates backlog building
      trend: 'up',
      trendValue: 'IET orders $4.9B',
      status: 'good',
      description: 'Q1 2026 IET book-to-bill 1.46x ($4,887M orders / $3,350M revenue). Record IET quarterly orders driven by CTS (+9x YoY) and Gas Technology Equipment (+37% YoY). Horizon 2 target >$40B cumulative by 2028.',
      consoleId: 'iet-performance',
      consoleName: 'IET Performance',
      architectureCategory: 'revenue-market',
    },
    {
      label: 'Total Remaining Performance Obligations',
      value: 36.1,
      unit: 'B',
      target: 38.0,                   // IET Horizon 2 target trajectory
      trend: 'up',
      trendValue: 'Record IET RPO',
      status: 'good',
      description: 'Total RPO $36.1B (Mar 31, 2026): OFSE $3.0B + IET $33.1B (record). IET RPO growth underpins long-cycle revenue visibility through 2030+. 58% recognized within 2 years.',
      consoleId: 'iet-performance',
      consoleName: 'IET Performance',
      architectureCategory: 'revenue-market',
    },
    {
      label: 'Adj. EBITDA Margin',
      value: 17.6,
      unit: '%',
      target: 18.5,                   // FY2026 implied margin improvement as IET mix grows
      trend: 'up',
      trendValue: '+140 bps YoY',
      status: 'good',
      description: 'Q1 2026 Adj. EBITDA margin 17.6% (+140 bps YoY). IET margin 20.2% (+310 bps); OFSE margin 17.5% (-30 bps from SPC disposition. Chart acquisition expected to be accretive to IET margins.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Free Cash Flow',
      value: 0.21,
      unit: 'B',
      target: 1.5,                    // FY2026 FCF target [ASSUMED based on guidance]
      trend: 'up',
      trendValue: 'Q1 2026',
      status: 'warning',
      description: 'Q1 2026 FCF $210M. Lower than prior year ($709M operating - $300M capex = $409M) due to working capital timing. Capex $336M Q1 2026 (guidance: ≤5% of annual revenue).',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
  ],

  operationalKPIs: [
    {
      label: 'IET Segment EBITDA',
      value: 678,
      unit: 'M',
      target: 675,                    // Q2 2026 IET EBITDA est. [ASSUMED]
      trend: 'up',
      trendValue: '+35% YoY',
      status: 'good',
      description: 'Q1 2026 IET segment EBITDA $678M (+35% YoY, +$177M). IET EBITDA margin 20.2% vs 17.1% Q1 2025. FY2026 IET EBITDA guidance ≥$2.7B (implied ~$675M per quarter).',
      consoleId: 'iet-performance',
      consoleName: 'IET Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'OFSE Segment EBITDA',
      value: 565,
      unit: 'M',
      target: 581,                    // Q2 2026 OFSE EBITDA est. from FY2026 guidance ≥$2.325B / 4
      trend: 'down',
      trendValue: '-9% YoY',
      status: 'warning',
      description: 'Q1 2026 OFSE segment EBITDA $565M (-9% YoY, -$58M). EBITDA margin 17.5% vs 17.8% Q1 2025. Lower volume from SPC disposition and Middle East disruptions, partially offset by cost savings.',
      consoleId: 'ofse-performance',
      consoleName: 'OFSE Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Total Orders',
      value: 8.159,
      unit: 'B',
      target: 7.5,                    // FY2026 quarterly run-rate implied by ≥$14.5B IET guidance
      trend: 'up',
      trendValue: '+26% YoY',
      status: 'good',
      description: 'Q1 2026 total orders $8,159M: OFSE $3,272M (-flat YoY) + IET $4,887M (+54% YoY). IET CTS orders $1,257M vs $148M Q1 2025 (9x surge from data center power deals).',
      consoleId: 'iet-performance',
      consoleName: 'IET Performance',
      architectureCategory: 'revenue-market',
    },
    {
      label: 'Gas Technology Equipment Revenue',
      value: 1.665,
      unit: 'B',
      target: 1.7,                    // est. Q2 2026 [ASSUMED]
      trend: 'up',
      trendValue: '+14% YoY',
      status: 'good',
      description: 'Q1 2026 GTE revenue $1,665M (+$210M, +14% YoY). LNG liquefaction trains, gas compression, and turbomachinery. Key driver of IET growth and long-cycle backlog.',
      consoleId: 'iet-performance',
      consoleName: 'IET Performance',
      architectureCategory: 'capacity-operations',
    },
    {
      label: 'Gas Technology Services Revenue',
      value: 0.791,
      unit: 'B',
      target: 0.82,                   // est. growing as installed base expands
      trend: 'up',
      trendValue: '+34% YoY',
      status: 'good',
      description: 'Q1 2026 GTS revenue $791M (+$199M, +34% YoY). Aftermarket services, upgrades, and LTSAs on the growing global GTE fleet. Highly recurring, high-margin revenue stream.',
      consoleId: 'iet-performance',
      consoleName: 'IET Performance',
      architectureCategory: 'capacity-operations',
    },
    {
      label: 'IET RPO (Backlog)',
      value: 33.1,
      unit: 'B',
      target: 35.0,                   // trajectory toward Horizon 2 >$40B by 2028
      trend: 'up',
      trendValue: 'Record high',
      status: 'good',
      description: 'IET RPO $33.1B (March 31, 2026) — record. Up from $32.4B at Dec 31, 2025. 89% of RPO expected to be recognized within 15 years; provides exceptional long-cycle visibility.',
      consoleId: 'iet-performance',
      consoleName: 'IET Performance',
      architectureCategory: 'revenue-market',
    },
  ],

  digitalKPIs: [
    {
      label: 'Leucipa Platform Deployments',
      value: 'Growing',
      unit: '',
      target: 'Expand install base',
      trend: 'up',
      trendValue: 'AI production opt.',
      status: 'good',
      description: 'Leucipa is Baker Hughes\'s AI-enabled autonomous production optimization platform. Deployed at multiple E&P operators for real-time well and field optimization. Key digital product within OFSE Production Solutions.',
      consoleId: 'ofse-performance',
      consoleName: 'OFSE Performance',
      architectureCategory: 'digital-customer',
    },
    {
      label: 'CTS Orders — Data Center & New Energy',
      value: '$1.26B',
      unit: '',
      target: '$1B+ per quarter',
      trend: 'up',
      trendValue: '9x YoY surge',
      status: 'good',
      description: 'Climate Technology Solutions Q1 2026 orders $1,257M vs $148M Q1 2025. Driven by data center power (aeroderivative turbines), CCUS, hydrogen, and geothermal projects. Fastest-growing order category.',
      consoleId: 'iet-performance',
      consoleName: 'IET Performance',
      architectureCategory: 'digital-customer',
    },
    {
      label: 'Chart Industries Acquisition',
      value: '$13.6B',
      unit: '',
      target: 'Q2 2026 close',
      trend: 'up',
      trendValue: 'Expected Q2 2026',
      status: 'good',
      description: 'BKR acquiring Chart Industries ($210/share, ~$13.6B EV). Expands IET\'s cryogenic and LNG equipment portfolio. Financed with $6.5B USD + €3.0B EUR notes (issued March 2026). Transformational for IET scale.',
      consoleId: 'strategy-execution',
      consoleName: 'Strategy Execution',
      architectureCategory: 'digital-customer',
    },
    {
      label: 'Portfolio Divestiture Proceeds (2026)',
      value: '~$3B',
      unit: '',
      target: '$3B total',
      trend: 'up',
      trendValue: 'PSI + SPC + Waygate',
      status: 'good',
      description: 'FY2026 portfolio proceeds: PSI → Crane ($1.2B, closed Q1), SPC → Cactus JV ($0.3B, closed Q1), Waygate → Hexagon ($1.45B, signed Apr 2026, expected H2). Sharpening focus on core IET and OFSE.',
      consoleId: 'strategy-execution',
      consoleName: 'Strategy Execution',
      architectureCategory: 'digital-customer',
    },
  ],

  financialKPIs: [
    {
      label: 'Adjusted EPS',
      value: 0.58,
      unit: '$',
      target: 2.40,                   // FY2026 implied ($0.58–0.65 × 4 quarters est.)
      trend: 'up',
      trendValue: '+13% YoY',
      status: 'good',
      description: 'Q1 2026 adjusted EPS $0.58 (+13% YoY vs $0.52 Q1 2025 est.). GAAP diluted EPS $0.93 (includes $721M gain on dispositions). Diluted shares ~996M.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Capital Expenditures',
      value: 0.336,
      unit: 'B',
      target: 1.3,                    // FY2026 est. ≤5% of annual revenue (~$26B)
      trend: 'up',
      trendValue: '+12% YoY',
      status: 'good',
      description: 'Q1 2026 capex $336M (OFSE $218M + IET $104M + corporate $14M). FY2026 guidance: capex ≤5% of annual revenue. Asset-light model vs prior cycle.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Dividend Per Share (Annual)',
      value: 0.92,
      unit: '$',
      target: 0.96,                   // est. next annual raise
      trend: 'flat',
      trendValue: '$0.23 quarterly',
      status: 'good',
      description: 'Quarterly dividend $0.23/share (annualized $0.92). Maintained stable through industry cycle. Yield ~1.8% (low payout, growth-oriented capital allocation). No buybacks in Q1 2026 (conserving cash for Chart).',
      consoleId: 'capital-allocation',
      consoleName: 'Capital Allocation',
      architectureCategory: 'financial',
    },
    {
      label: 'Net Debt / Adj. EBITDA',
      value: 0.3,
      unit: 'x',
      target: 2.0,                    // post-Chart close leverage target
      trend: 'up',
      trendValue: 'Pre-Chart close',
      status: 'good',
      description: 'Pre-Chart net leverage ~0.3x (Q1 2026 — cash $14.8B vs debt $16.2B). Post-Chart close leverage expected ~2.0x as $13.6B acquisition closes Q2 2026. Strong balance sheet provides confidence.',
      consoleId: 'financial-performance',
      consoleName: 'Financial Performance',
      architectureCategory: 'financial',
    },
  ],
};
