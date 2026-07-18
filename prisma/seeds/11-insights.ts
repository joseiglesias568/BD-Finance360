import { PrismaClient } from '@prisma/client';

// =============================================================================
// Personalized Insights for Becton, Dickinson and Company (BDX) executives
//
// SOURCE: Becton, Dickinson and Company (BDX) — Q2 FY26 earnings (May 2026),
//   FY2025 10-K, Q2 FY26 10-Q, FDA consent decree filings,
//   BD investor supplement materials. FY ends September 30.
//
// Insights span executive categories: Financial Performance, BioPharma Systems,
// Connected Care, Medical Essentials, Interventional, China & Emerging Markets,
// FX & International, Capital Structure, Enterprise Risk.
// Console links use the BD business console slug taxonomy from 12-business-consoles.ts.
// =============================================================================

export async function seedInsights(prisma: PrismaClient, companyId: number) {
  // Delete existing records before creating new ones
  await prisma.personalizedInsight.deleteMany({ where: { companyId } });

  const insights = [
    // ── Financial Performance ──────────────────────────────────────────
    {
      title: 'Q2 FY26 Adj. EPS $3.50 (+5.1% YoY) — On Track for $12.52–$12.72 Guidance',
      category: 'Financial Performance',
      kpiValue: '$3.50',
      trendDirection: 'up',
      priority: 'high',
      summary:
        'BD delivered Q2 FY26 adjusted EPS of $3.50, up 5.1% YoY from $3.33 in Q2 FY25. Total revenue $4,714M (+4.7% reported, +7.2% constant currency). H1 FY26 adj. EPS $6.85, putting FY2026 on track for the $12.52–$12.72 guidance range. BioPharma Systems was the growth leader (+12.0% CC) on GLP-1 PFS demand. Goodwill impairment $450M (non-cash, Connected Care unit) was the key GAAP headwind. FX translation headwind $58M in Q2 ($116M H1 cumulative vs $230M FY plan).',
      confidenceScore: 99,
      consoleLink: '/business-consoles/financial-performance',
      recommendations: [
        'Maintain H2 momentum: BioPharma Systems capacity utilization at 88% — Q3/Q4 seasonal hospital capital cycle expected to lift Connected Care',
        'Monitor FX trajectory — EUR/USD stabilization supports closing the gap between CC and reported growth',
      ],
      relatedDrivers: {
        kpiLabel: 'Adj. Diluted EPS',
        value: '$3.50 Q2 FY26 (+5.1% YoY)',
        dataSource: 'Q2 FY26 Earnings Release (May 2026)',
        impactedMetrics: [
          { metric: 'Adj. Diluted EPS Q2 FY26', value: '$3.50', trend: 'positive' },
          { metric: 'H1 FY26 Adj. EPS', value: '$6.85', trend: 'positive' },
          { metric: 'FY2026 Adj. EPS Guidance', value: '$12.52–$12.72', trend: 'stable' },
        ],
        historicalContext:
          'BD Q2 adj. EPS growth reflects BioPharma Systems GLP-1 demand strength, partially offset by $450M non-cash goodwill impairment on Connected Care (GAAP only) and $116M H1 FX headwind. On a constant currency basis, the underlying growth rate is +7.2%, above the reported +4.7%.',
        predictiveInsight:
          'H2 FY2026 adj. EPS requires ~$5.67–$5.87 to deliver on guidance. Hospital capital seasonality in Q3/Q4 should lift Connected Care (Alaris + Pyxis). BioPharma Systems GLP-1 trajectory at 88% utilization supports sustained revenue growth.',
        dataQuality: 'Very High',
        modelAccuracy: '98%',
      },
    },

    // ── BioPharma Systems — GLP-1 ─────────────────────────────────────
    {
      title: 'BioPharma Systems GLP-1 PFS Volume +19% YoY — Capacity Utilization Reaches 88%',
      category: 'BioPharma Systems',
      kpiValue: '+19% CC',
      trendDirection: 'up',
      priority: 'high',
      summary:
        'BD BioPharma Systems Q2 FY26 revenue $1,168M, +12.0% CC. GLP-1 prefillable syringe volumes grew +19% YoY in Q2, ahead of the +18% plan. Capacity utilization reached 88% across PFS manufacturing sites (Franklin Lakes, NJ and Pont-de-Claix, France), above the 84% plan. FY2027 capacity expansion decisions are required by Q3 FY2026 board meeting to avoid delivery risk above 92% utilization. Long-term supply agreements with Novo Nordisk (through 2030) and Eli Lilly (through 2029) underpin multi-year demand visibility.',
      confidenceScore: 95,
      consoleLink: '/business-consoles/biopharma-systems',
      recommendations: [
        'Accelerate FY2027–FY2028 PFS capacity expansion at NC and Ireland — current trajectory reaches constraint level by Q2 FY2027',
        'Initiate Novo Nordisk contract pricing renegotiation at next review — premium coated barrel specification commands 8–12% price premium',
      ],
      relatedDrivers: {
        kpiLabel: 'BioPharma Systems Revenue (CC Growth)',
        value: '+12.0% CC Q2 FY26',
        dataSource: 'Q2 FY26 Earnings Supplement',
        impactedMetrics: [
          { metric: 'BioPharma Systems Q2 Revenue', value: '$1,168M', trend: 'positive' },
          { metric: 'GLP-1 PFS Volume Growth', value: '+19% YoY', trend: 'positive' },
          { metric: 'PFS Capacity Utilization', value: '88%', trend: 'caution' },
        ],
        historicalContext:
          'BioPharma Systems has grown from ~$1,020M/quarter (Q1 FY25) to $1,168M in Q2 FY26, driven by GLP-1 drug delivery demand. The segment is BD\'s highest-margin business at ~32% adj. operating margin.',
        predictiveInsight:
          'At current GLP-1 demand growth (+19% YoY) and without new capacity, utilization reaches 92% by Q4 FY2026, creating delivery risk. FY2027 capex commitment of $1.2–1.5B for PFS capacity would provide a 3-year demand runway.',
        dataQuality: 'High',
        modelAccuracy: '91%',
      },
    },

    // ── Connected Care — Alaris ───────────────────────────────────────
    {
      title: 'Alaris Pump Shipments 72K Annualized — FDA Consent Decree Resolution Pathway Clear',
      category: 'Connected Care',
      kpiValue: '72K units/yr',
      trendDirection: 'up',
      priority: 'high',
      summary:
        'BD Connected Care Q2 FY26 Alaris pump shipments of 18K (72K annualized vs 75K plan) are tracking near plan with no new FDA 483 observations in Q2. Hospital deferred order backlog remains elevated at ~32K units, supporting FY2027 ramp confidence toward pre-decree levels of 120–140K units annually. Connected Care revenue $520M (+5.2% CC); software and services +11% YoY, above 9% plan. Q3/Q4 hospital capital budget release cycle historically drives 60%+ of annual Alaris placements.',
      confidenceScore: 88,
      consoleLink: '/business-consoles/connected-care',
      recommendations: [
        'Proactively communicate Alaris FY2027 ramp confidence to investors — 32K unit backlog depth is a compelling catalyst',
        'Accelerate Pyxis MedStation cross-sell alongside Alaris upgrade projects at large health systems',
      ],
      relatedDrivers: {
        kpiLabel: 'Alaris Unit Shipments (Annualized)',
        value: '72K units (vs 75K plan)',
        dataSource: 'BD Connected Care Business Unit Data Q2 FY26',
        impactedMetrics: [
          { metric: 'Alaris Annualized Shipments', value: '72K units', trend: 'positive' },
          { metric: 'Deferred Order Backlog', value: '~32K units', trend: 'positive' },
          { metric: 'Connected Care Software Growth', value: '+11% YoY', trend: 'positive' },
        ],
        historicalContext:
          'Pre-consent decree Alaris revenue was ~$500M annually at ~120–140K unit shipments. The ramp from ~48K units in FY25 to 72K annualized in H1 FY26 represents significant recovery progress. Full recovery is the primary Connected Care value-creation thesis.',
        predictiveInsight:
          'Probability of reaching 75K units FY2026: 74%. FY2027 could deliver 100–120K units if consent decree is formally resolved in Q1 FY2027, unlocking the full $300–350M revenue recovery potential.',
        dataQuality: 'High',
        modelAccuracy: '85%',
      },
    },

    // ── Medical Essentials — China VoBP ──────────────────────────────
    {
      title: 'China VoBP Headwind $80M H1 — No Incremental Waves Beyond Plan in Q2',
      category: 'Medical Essentials',
      kpiValue: '($80M) H1',
      trendDirection: 'flat',
      priority: 'high',
      summary:
        'Medical Essentials segment Q2 FY26 China VoBP headwind $40M (H1 cumulative $80M vs $160M FY plan), tracking in line with quarterly cadence. No additional VoBP tender waves beyond the original plan were announced in Q2. Key risk: NHSA tender pipeline signals suggest 35% probability of additional wave targeting insulin syringes or infusion sets in Q4 FY2026 or Q1 FY2027. India revenue +14% YoY and U.S. volume +3.5% are partially offsetting. Medical Essentials adj. op. margin 21.5%, on plan.',
      confidenceScore: 85,
      consoleLink: '/business-consoles/medical-essentials',
      recommendations: [
        'Pre-position mix-shift to premium non-tendered BD products in China to reduce VoBP-exposed revenue concentration',
        'Monitor NHSA tender notices monthly — early warning of new insulin syringe VoBP wave would trigger contingency plan execution',
      ],
      relatedDrivers: {
        kpiLabel: 'China VoBP Annual Headwind',
        value: '($80M) H1 FY26 vs ($160M) FY plan',
        dataSource: 'China Commercial Finance, Q2 FY26',
        impactedMetrics: [
          { metric: 'China VoBP H1 Headwind', value: '($80M)', trend: 'negative' },
          { metric: 'India Revenue Growth', value: '+14% YoY', trend: 'positive' },
          { metric: 'Medical Essentials Adj. Margin', value: '21.5%', trend: 'stable' },
        ],
        historicalContext:
          'China VoBP tender waves have progressively expanded scope from syringes to blood collection to diagnostics since 2020. BD China revenue has declined from ~12% of total (FY22) to ~10% (FY26) on a mix-adjusted basis as VoBP pricing concessions accumulate.',
        predictiveInsight:
          'Base case: FY2026 VoBP headwind $160M (Q3 and Q4 each ~$40M). Adverse case: additional insulin syringe tender adds $75–100M, bringing total to $235–260M and putting Medical Essentials margin at risk to below 20%.',
        dataQuality: 'High',
        modelAccuracy: '87%',
      },
    },

    // ── Capital Structure ─────────────────────────────────────────────
    {
      title: 'BD Net Leverage 2.9x Q2 FY26 — On Track for 2.5x Target by FY2028',
      category: 'Capital Structure',
      kpiValue: '2.9x',
      trendDirection: 'down',
      priority: 'high',
      summary:
        'BD net debt / adjusted EBITDA leverage of 2.9x in Q2 FY26, down from 3.1x in Q2 FY25. FCF conversion 96% of adjusted net income (H1 FCF $1,420M). Gross debt reduced $750M in H1 FY26 on track for $1,500M FY plan. Alaris remediation cash costs $145M H1 (vs $300M FY plan — on track). Credit rating: Baa1/BBB+. Target: <2.5x by FY2028, enabling potential share repurchase reinstatement and credit upgrade to A3/A-.',
      confidenceScore: 93,
      consoleLink: '/business-consoles/capital-allocation',
      recommendations: [
        'Prioritize higher-coupon debt tranche retirement in H2 as $800M+ of >4.5% coupon maturities are callable',
        'Present share repurchase reinstatement framework to board at next meeting — 2.3x leverage would be the target trigger',
      ],
      relatedDrivers: {
        kpiLabel: 'Net Debt / Adj. EBITDA',
        value: '2.9x Q2 FY26 (vs 3.1x Q2 FY25)',
        dataSource: 'BD Treasurer / Q2 FY26 10-Q',
        impactedMetrics: [
          { metric: 'Net Leverage Q2 FY26', value: '2.9x', trend: 'positive' },
          { metric: 'H1 FCF', value: '$1,420M', trend: 'positive' },
          { metric: 'H1 Gross Debt Reduction', value: '$750M', trend: 'positive' },
        ],
        historicalContext:
          'BD leverage has declined from ~3.4x post-C.R. Bard acquisition (FY19) to 2.9x in Q2 FY26. The Waters spin-off in Feb 2026 accelerated deleveraging by removing Waters-related debt. Continued FCF-to-debt paydown is the primary mechanism to reach <2.5x.',
        predictiveInsight:
          'At $3B+ annual FCF and $1.5B+ annual debt reduction, BD reaches 2.5x by FY2028 with high confidence (82%). Faster scenario (2.3x by FY2027) requires $2.5B debt reduction and 105% FCF conversion — achievable if GLP-1 capex peaks in FY2026.',
        dataQuality: 'Very High',
        modelAccuracy: '95%',
      },
    },

    // ── FX Impact ─────────────────────────────────────────────────────
    {
      title: 'FX Translation Headwind $116M H1 FY26 — CC Growth Exceeds Reported by 250bps',
      category: 'International & FX',
      kpiValue: '($116M) H1',
      trendDirection: 'down',
      priority: 'medium',
      summary:
        'BD H1 FY26 FX translation headwind $116M ($58M Q1, $58M Q2) vs $230M FY plan — tracking in line with plan at 50% pace. EUR/USD averaging 1.082 (plan: 1.075), slightly favorable. JPY/USD at 152 on plan. BD constant currency revenue growth of +7.2% in Q2 compares to +4.7% reported — a 250bps gap driven by FX. Hedge benefit $32M H1. International revenue 48.2% of total, on 48% plan.',
      confidenceScore: 90,
      consoleLink: '/business-consoles/fx-international',
      recommendations: [
        'Maintain current EUR hedge coverage ratio (60%) — forward rates do not support extending hedges at current cost',
        'Prepare investor messaging emphasizing constant currency growth for Q3 earnings call',
      ],
      relatedDrivers: {
        kpiLabel: 'FX Translation Headwind (Reported vs CC)',
        value: '($116M) H1; CC +7.2% vs Reported +4.7%',
        dataSource: 'BD Treasury / Q2 FY26 Earnings',
        impactedMetrics: [
          { metric: 'H1 FX Translation Headwind', value: '($116M)', trend: 'negative' },
          { metric: 'Q2 CC Revenue Growth', value: '+7.2%', trend: 'positive' },
          { metric: 'Q2 Reported Revenue Growth', value: '+4.7%', trend: 'positive' },
        ],
        historicalContext:
          'BD\'s ~48% international revenue creates meaningful FX sensitivity. USD strengthening since mid-2021 has been a persistent reported growth headwind. The BioPharma Systems business (heavy European pharma customer base) is the segment with highest EUR/USD sensitivity.',
        predictiveInsight:
          'If EUR/USD and JPY/USD remain stable at current levels through FY year-end, FY2026 total FX headwind is projected at $220–240M vs $230M plan — roughly in line, with no material guidance risk from FX.',
        dataQuality: 'High',
        modelAccuracy: '88%',
      },
    },

    // ── Interventional ────────────────────────────────────────────────
    {
      title: 'Interventional Q2 FY26 +6.1% CC — Peripheral Vascular Leads on DCB and Oncology',
      category: 'Interventional',
      kpiValue: '+6.1% CC',
      trendDirection: 'up',
      priority: 'medium',
      summary:
        'BD Interventional Q2 FY26 revenue $1,406M, +6.1% constant currency. Peripheral vascular +8% on Lutonix DCB market share gains and procedure volume recovery. Oncology +9% driven by biopsy and ablation device demand. Surgery +3% on laparoscopic instrument portfolio. Adj. operating margin 24.8%, +90bps YoY on favorable product mix. International Interventional +7.5% CC, outpacing U.S. on European and Asian procedure recovery. Full-year Interventional trajectory supports 6–8% CC growth target.',
      confidenceScore: 88,
      consoleLink: '/business-consoles/interventional',
      recommendations: [
        'Evaluate tuck-in EP mapping acquisition — electrophysiology catheter ablation is a high-growth adjacency to BD Interventional\'s vascular portfolio',
        'Lutonix DCB market share defense: Medtronic IN.PACT competitive response strategy needed for FY2027 planning',
      ],
      relatedDrivers: {
        kpiLabel: 'Interventional Revenue (CC Growth)',
        value: '+6.1% CC Q2 FY26',
        dataSource: 'Q2 FY26 Earnings Supplement',
        impactedMetrics: [
          { metric: 'Interventional Q2 Revenue', value: '$1,406M', trend: 'positive' },
          { metric: 'Peripheral Vascular Growth', value: '+8% CC', trend: 'positive' },
          { metric: 'Oncology Growth', value: '+9% CC', trend: 'positive' },
        ],
        historicalContext:
          'BD acquired C.R. Bard (2017) to create the Interventional segment. Revenue has grown from ~$3.5B annually post-Bard to ~$5.6B annualized in FY26, with consistent high-single-digit constant currency growth driven by vascular procedure volume and portfolio innovation.',
        predictiveInsight:
          'Interventional is on track for 6–7% full-year CC growth. Peripheral vascular procedure volume recovery (post-COVID backlog) and oncology diagnostics growth are structural tailwinds through FY2027.',
        dataQuality: 'High',
        modelAccuracy: '90%',
      },
    },

    // ── Enterprise Risk — Goodwill Impairment ─────────────────────────
    {
      title: 'Goodwill Impairment $450M Q2 FY26 (Connected Care) — Non-Cash; FY Guidance Maintained',
      category: 'Enterprise Risk',
      kpiValue: '$450M impairment',
      trendDirection: 'down',
      priority: 'high',
      summary:
        'BD recorded a non-cash goodwill impairment of $450M in Q2 FY26 for the Connected Care reporting unit, driven by an elongated timeline for the Alaris consent decree resolution and associated market recovery. This charge is non-cash and excluded from adjusted EPS. FY2026 adjusted EPS guidance $12.52–$12.72 was reaffirmed. The GAAP EPS impact is ~$1.58/share. Connected Care continues to show underlying business momentum (software +11%, Pyxis ahead of plan) — the impairment reflects the carrying value of legacy goodwill from the Alaris era, not current business deterioration.',
      confidenceScore: 99,
      consoleLink: '/business-consoles/connected-care',
      recommendations: [
        'Proactively communicate non-cash nature to investors — adjusted metrics exclude the impairment and underlying Connected Care momentum is positive',
        'Board should assess whether additional impairment testing is required if Alaris FY2027 ramp falls below 90K units',
      ],
      relatedDrivers: {
        kpiLabel: 'Goodwill Impairment (Non-Cash, Q2 FY26)',
        value: '$450M Connected Care reporting unit',
        dataSource: 'Q2 FY26 10-Q / ASC 350 Goodwill Testing',
        impactedMetrics: [
          { metric: 'Goodwill Impairment Q2 FY26', value: '$450M (non-cash)', trend: 'negative' },
          { metric: 'GAAP EPS Impact', value: '($1.58) per share', trend: 'negative' },
          { metric: 'Adj. EPS Impact', value: '$0 excluded', trend: 'stable' },
        ],
        historicalContext:
          'BD Connected Care goodwill originated primarily from the BD CareFusion acquisition (2015) and Alaris-related assets. The consent decree (effective 2020) has suppressed the reporting unit\'s fair value relative to book value, necessitating periodic impairment testing.',
        predictiveInsight:
          'Additional goodwill impairment in FY2027 is unlikely if Alaris reaches 100K+ units and consent decree is formally resolved. The remaining Connected Care goodwill ($1.8B post-impairment) would be supported at that volume level.',
        dataQuality: 'Very High',
        modelAccuracy: '99%',
      },
    },

    // ── Waters Spin-off ───────────────────────────────────────────────
    {
      title: 'Waters Spin-Off Completed February 2026 — BD Refocused on MedTech Core',
      category: 'Enterprise Risk',
      kpiValue: 'Completed Feb 2026',
      trendDirection: 'up',
      priority: 'medium',
      summary:
        'BD completed the spin-off of the BD Diagnostic Solutions (formerly BD Life Sciences, rebranded Waters Corporation) business in February 2026. All FY2026 BD financial results are reported on a continuing operations basis, excluding the divested business. The spin-off sharpens BD\'s focus on its four core MedTech segments: Medical Essentials, Connected Care, BioPharma Systems, and Interventional. Waters is now publicly traded independently. BD received no cash proceeds but achieved significant strategic clarity and capital allocation simplicity.',
      confidenceScore: 99,
      consoleLink: '/business-consoles/financial-performance',
      recommendations: [
        'Update all segment benchmarking to continuing-operations-only basis — prior year comparatives restated to exclude Waters',
        'Investor messaging should highlight the streamlined four-segment BD: pure-play MedTech positioned across device, drug delivery, and procedural markets',
      ],
      relatedDrivers: {
        kpiLabel: 'Waters Spin-Off Completion',
        value: 'Completed February 2026',
        dataSource: 'BD 8-K Filing (February 2026)',
        impactedMetrics: [
          { metric: 'BD Continuing Ops Revenue Base', value: '~$18.0B FY26E', trend: 'stable' },
          { metric: 'Segments Remaining Post-Spin', value: '4 segments', trend: 'stable' },
          { metric: 'Waters Revenue Removed', value: '~$1.4B annually', trend: 'neutral' },
        ],
        historicalContext:
          'BD announced the intention to spin off the Life Sciences segment in 2024 to unlock shareholder value and streamline the portfolio. The separation was completed as planned with Waters beginning independent trading on NYSE.',
        predictiveInsight:
          'Post-spin BD trades on a cleaner MedTech multiple. Four-segment organic growth profile of 6–8% CC CAGR supports a re-rating toward pure-play MedTech peer multiples (Becton\'s target: 20–22x adj. EPS vs current ~16x).',
        dataQuality: 'Very High',
        modelAccuracy: '99%',
      },
    },

    // ── Operational — BD Manufacturing ───────────────────────────────
    {
      title: 'BD Manufacturing Quality: Zero Class I Recalls in FY25 — FDA Readiness Score 94/100',
      category: 'Quality & Operations',
      kpiValue: '94/100',
      trendDirection: 'up',
      priority: 'medium',
      summary:
        'BD global manufacturing operations achieved zero Class I device recalls in FY2025, and the enterprise FDA Readiness composite score improved to 94/100, up from 89/100 in FY24. Alaris manufacturing remains under consent decree with ongoing remediation, but no new 483 observations were issued in Q2 FY26 at the Alaris production facility. BD\'s quality transformation program (BD Excellence) has reduced manufacturing non-conformances by 28% over 3 years. This quality performance underpins BioPharma Systems pharma customer confidence in BD as a critical drug delivery supply chain partner.',
      confidenceScore: 90,
      consoleLink: '/business-consoles/medical-essentials',
      recommendations: [
        'Highlight Alaris zero-483 Q2 performance in FDA consent decree status communications — reinforces resolution timeline credibility',
        'Leverage quality score improvement in BioPharma Systems customer negotiations — pharma customers use quality metrics in supplier selection',
      ],
      relatedDrivers: {
        kpiLabel: 'FDA Readiness Score',
        value: '94/100 (FY25)',
        dataSource: 'BD Quality Affairs / BD Excellence Program',
        impactedMetrics: [
          { metric: 'FDA Readiness Score', value: '94/100', trend: 'positive' },
          { metric: 'Class I Recalls FY25', value: '0', trend: 'positive' },
          { metric: 'Alaris 483 Observations Q2 FY26', value: '0', trend: 'positive' },
        ],
        historicalContext:
          'BD has invested $1.5B+ in quality system remediation and manufacturing upgrades since 2018. The improvement from 72/100 (FY21) to 94/100 (FY25) reflects the BD Excellence quality transformation, particularly in ERP-integrated quality management systems.',
        predictiveInsight:
          'Zero new 483 observations on Alaris in Q1–Q2 FY26 increases probability of consent decree formal resolution announcement from 55% to 70% by end of FY2026. Full resolution would remove ~$300M/year in ongoing remediation costs.',
        dataQuality: 'High',
        modelAccuracy: '85%',
      },
    },
  ];

  await prisma.personalizedInsight.createMany({
    data: insights.map((insight) => ({ companyId, ...insight })),
  });

  console.log(`Seeded ${insights.length} BD personalized insights`);
}
