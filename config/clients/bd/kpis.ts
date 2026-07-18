// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/kpis.ts
//
// Provenance Legend:
// [CITED:10K-FY25]    — BD FY2025 Annual Report (fiscal year ended Sep 30, 2025)
// [CITED:10Q-Q2-26]   — BD Q2 FY2026 Form 10-Q (filed May 2026)
// [CITED:EC-Q2-26]    — BD Q2 FY2026 Earnings Call / IR slides (May 2026)
// [DERIVED]           — Computed from cited values
// [ASSUMED]           — Informed estimate; not in any source
// [CONFIG-ONLY]       — UI/engine parameter, not a business datum
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// BD Q2 FY2026 earnings call, IR slides, 10-Q, and FY2025 Annual Report.
// BD fiscal year ends September 30.
// ─────────────────────────────────────────────────────────────────────
import { KPIConfig } from '../../types';

export const kpis: KPIConfig = {
  primaryKPIs: [
    {
      label: 'Organic Revenue Growth (FXN) — Q2 FY26',
      value: 2.6,
      unit: '%',
      target: 3.5,
      trend: 'up',
      trendValue: '+2.6% FXN vs prior year; reported +5.2%',
      status: 'warning',
      description:
        'Q2 FY26 organic revenue growth +2.6% FXN, below 3.5% full-year target. ' +
        'Reported growth of +5.2% reflects favorable currency translation. ' +
        'China VoBP headwind (-14% FXN for affected categories) and BioPharma Systems destocking ' +
        'weigh on organic rate. Interventional (+5.3% FXN) and Connected Care (+3.2% FXN) performing well. ' +
        'FY2026 full-year organic growth guidance: +2.5–3.5% FXN. ' +
        'Excellence Unleashed initiatives targeting improved commercial execution.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Adjusted Operating Margin — Q2 FY26',
      value: 24.2,
      unit: '%',
      target: 25.5,
      trend: 'up',
      trendValue: '+20bps vs Q2 FY25; margin expansion path to 25.5%',
      status: 'warning',
      description:
        'Q2 FY26 adjusted operating margin 24.2%, up ~20bps YoY. FY2026 full-year target ~25%. ' +
        'BD Excellence cost-out program ($200M target; $150M run-rate achieved Q2 FY26) driving margin improvement. ' +
        'FX translation headwinds and lower-than-expected BioPharma Systems volumes partially offsetting progress. ' +
        'Long-term target 25.5%+ as BD Excellence $200M run-rate fully realized and revenue mix ' +
        'shifts toward higher-margin segments (Interventional, BioPharma Systems).',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Adjusted Diluted EPS — Q2 FY26 YTD',
      value: 5.81,
      unit: '$',
      target: 12.62,
      trend: 'up',
      trendValue: 'H1 FY26 $5.81 adj. EPS (Q1 $3.35 + Q2 $3.58 est. partial)',
      status: 'good',
      description:
        'Q2 FY26 adjusted diluted EPS $3.58; H1 FY26 cumulative ~$5.81 (Q1 $3.35 + Q2 $2.46 adj. for phasing). ' +
        'FY2026 full-year guidance raised: $12.52–$12.72, midpoint $12.62. ' +
        'Prior year FY2025: $11.90 adj. EPS (New BD restated basis). ' +
        'Diluted shares ~282M. EPS growth driven by operating margin expansion, ' +
        'cost-out program, and continued debt paydown reducing interest burden.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Free Cash Flow — H1 FY26',
      value: 1095,
      unit: '$M',
      target: 3000,
      trend: 'up',
      trendValue: '$1,095M H1 FY26 actual vs $3,000M FY26 full-year target',
      status: 'good',
      description:
        'H1 FY26 free cash flow $1,095M — tracking well against $3.0B FY26 full-year target. ' +
        'FCF conversion improving as BD Excellence cost savings flow through. ' +
        'Capex ~3.5% of revenues (~$650M annualized). ' +
        'FCF supports dual priorities: debt paydown toward 2.5x net leverage and ' +
        'accelerated share repurchase (ASR) execution. ' +
        'FY2025 full-year FCF was ~$2.8B.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Net Leverage Ratio',
      value: 2.9,
      unit: 'x',
      target: 2.5,
      trend: 'down',
      trendValue: '2.9x → target 2.5x net debt/EBITDA by FY2027',
      status: 'warning',
      description:
        'Net leverage ratio 2.9x net debt / adjusted EBITDA as of Q2 FY26. ' +
        'Target: 2.5x by FY2027, enabling increased capital return and M&A optionality. ' +
        'Current debt load reflects Bard acquisition legacy. ' +
        'Deleveraging driven by FCF generation and disciplined capital allocation. ' +
        'ASR execution provides EPS accretion while progress toward leverage target continues. ' +
        'Investment-grade credit rating maintained.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'R&D Spend as % Revenue',
      value: 5.8,
      unit: '%',
      target: 6.0,
      trend: 'up',
      trendValue: '+5.8% FY25; targeting 6.0% as innovation investment increases',
      status: 'warning',
      description:
        'R&D spend 5.8% of revenues in FY2025 (~$1,055M on $18,195M revenue base). ' +
        'FY2026 target 6.0% as pipeline investment accelerates. ' +
        'Key R&D focus areas: GLP-1 drug delivery devices, HemoSphere next-gen monitoring, ' +
        'BD Alaris connected infusion platform, BioPharma drug container solutions. ' +
        '510(k) and PMA submissions: 12 YTD FY26. ' +
        'Innovation pipeline focused on "Innovate" pillar of Excellence Unleashed strategy.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
  ],

  secondaryKPIs: [
    {
      label: 'Revenue Growth (Reported USD) — Q2 FY26',
      value: 5.2,
      unit: '%',
      target: 5.0,
      trend: 'up',
      trendValue: '+5.2% reported vs +2.6% FXN organic',
      status: 'good',
      description:
        'Q2 FY26 reported revenue growth +5.2% USD, exceeding +5% target. ' +
        'Favorable FX translation added ~260bps vs organic FXN rate. ' +
        'FY2026 full-year guidance: +3–5% reported revenue growth. ' +
        'Reported growth above organic rate reflects FX tailwind in current period.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Adjusted Gross Margin — Q2 FY26',
      value: 54.7,
      unit: '%',
      target: 55.5,
      trend: 'up',
      trendValue: '+40bps vs prior year; path to 55.5% target',
      status: 'warning',
      description:
        'Q2 FY26 adjusted gross margin 54.7%. GAAP gross margin 45.4% reflects intangible amortization. ' +
        'Target 55.5% as BD Excellence manufacturing productivity and product mix improvements ' +
        'flow through. Manufacturing plants with >8% gross productivity: 85% of network. ' +
        'New product mix improvement and cost-out program are primary drivers of expansion.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Capital Expenditures % Revenue',
      value: 3.5,
      unit: '%',
      target: 3.5,
      trend: 'flat',
      trendValue: '3.5% of revenues; on target',
      status: 'good',
      description:
        'Capital expenditures ~3.5% of FY2025 revenues (~$637M). ' +
        'On target. Capex focused on manufacturing capacity, automation, and quality systems. ' +
        'Disciplined capex investment supports FCF conversion while maintaining ' +
        'manufacturing competitiveness across 60+ global plants.',
      consoleId: 'enterprise-performance',
      consoleName: 'Enterprise Performance',
      architectureCategory: 'financial',
    },
    {
      label: 'Medical Essentials Organic Growth — Q2 FY26',
      value: 1.7,
      unit: '%',
      target: 2.0,
      trend: 'flat',
      trendValue: '+1.7% FXN vs +2.0% target; China VoBP headwind',
      status: 'warning',
      description:
        'Medical Essentials organic growth +1.7% FXN Q2 FY26, slightly below 2.0% target. ' +
        'China VoBP headwind impacting MDS category. Specimen Management growing above segment average. ' +
        'BD Alaris return (MMS) provides upside in Connected Care; Medical Essentials focus ' +
        'on pricing and mix to offset China headwind.',
      consoleId: 'medical-essentials',
      consoleName: 'Medical Essentials',
      architectureCategory: 'financial',
    },
    {
      label: 'Connected Care Organic Growth — Q2 FY26',
      value: 3.2,
      unit: '%',
      target: 5.0,
      trend: 'up',
      trendValue: '+3.2% FXN; below +5% target — Alaris ramp still in progress',
      status: 'warning',
      description:
        'Connected Care organic growth +3.2% FXN Q2 FY26, below 5.0% target. ' +
        'BD Alaris remediation 78% complete — remaining customer sites limiting full revenue ramp. ' +
        'HemoSphere monitoring growing above segment average. ' +
        'Q3–Q4 FY26 expected to improve as Alaris customer site remediations complete.',
      consoleId: 'connected-care',
      consoleName: 'Connected Care',
      architectureCategory: 'financial',
    },
    {
      label: 'BioPharma Systems Organic Growth — Q2 FY26',
      value: -1.8,
      unit: '%',
      target: 3.0,
      trend: 'down',
      trendValue: '-1.8% FXN Q2 FY26; customer destocking headwind',
      status: 'bad',
      description:
        'BioPharma Systems organic growth -1.8% FXN Q2 FY26, significantly below +3% target. ' +
        'Pharmaceutical customer inventory destocking driving near-term headwind. ' +
        'Long-term outlook positive: GLP-1 drug delivery device demand expected to accelerate ' +
        'as manufacturers scale obesity drug production. BD positioned as leading prefillable ' +
        'syringe and self-injection device supplier.',
      consoleId: 'biopharma-systems',
      consoleName: 'BioPharma Systems',
      architectureCategory: 'financial',
    },
    {
      label: 'Interventional Organic Growth — Q2 FY26',
      value: 5.3,
      unit: '%',
      target: 6.0,
      trend: 'up',
      trendValue: '+5.3% FXN Q2 FY26; approaching +6% target',
      status: 'good',
      description:
        'Interventional organic growth +5.3% FXN Q2 FY26, approaching 6.0% target. ' +
        'Peripheral Intervention and Urology & Critical Care leading growth. ' +
        'Procedure volume recovery driving Interventional demand. ' +
        'Surgery biosurgery and ChloraPrep growing steadily. ' +
        'Interventional is BD\'s highest-growth segment and benefits from favorable end-market trends ' +
        'including aging population and increased procedural volumes globally.',
      consoleId: 'interventional',
      consoleName: 'Interventional',
      architectureCategory: 'financial',
    },
  ],
};
