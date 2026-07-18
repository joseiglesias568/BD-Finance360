import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed Alert Templates and Report Templates
// SOURCE: Becton, Dickinson and Company (BDX) — Q2 FY26 earnings (May 2026),
// FY2025 10-K, and investor guidance materials. FY ends September 30.
//
// BD FY2026 guidance: Adj. EPS $12.52–$12.72 | Adj. op. margin ~25%
// Revenue continuing ops ~$18.0B | FCF ~$3.0B+
// Segments: Medical Essentials | Connected Care | BioPharma Systems | Interventional
// =============================================================================

export async function seedAlertsAndReports(prisma: PrismaClient, companyId: number) {
  // Delete existing records before creating new ones
  await prisma.alertTemplate.deleteMany({ where: { companyId } });
  await prisma.reportTemplate.deleteMany({ where: { companyId } });

  // ── Alert Templates (7 BD-specific alerts) ───────────────────────────

  await prisma.alertTemplate.createMany({
    data: [
      // ═══════════════════════════════════════════
      // FINANCIAL PERFORMANCE — EPS & GUIDANCE
      // ═══════════════════════════════════════════
      {
        companyId,
        externalId: 'eps-guidance-risk',
        title: 'Quarterly Adj. EPS Run-Rate Below $12.52 Annual Guidance Floor',
        category: 'Financial Performance',
        threshold: '$12.52',
        severity: 'critical',
        alertType: 'threshold',
        frequency: 'weekly',
        conditionPrefix: 'Falls below',
        description:
          'Quarterly adjusted EPS run-rate below $3.13 annualizes to <$12.52, putting the floor of FY2026 adjusted EPS guidance ($12.52–$12.72) at risk. Q1 FY26 actual was $3.35 and Q2 FY26 was $3.50. Monitor segment operating margin trajectory, China VoBP headwind absorption, Alaris ramp pace, and FX impact. Key drivers: BioPharma Systems GLP-1 volume, Alaris unit shipments, China VoBP ($160M plan headwind), and FX (~$230M headwind).',
        suggestedActions: [
          'Decompose by segment: Medical Essentials margin vs Connected Care vs BioPharma Systems vs Interventional',
          'Assess China VoBP headwind — any additional tender waves beyond the $160M plan assumption?',
          'Review Alaris ramp pace — unit shipments vs 75K annual plan and ASP realization',
          'Check FX translation headwind vs $230M plan — EUR/USD, CNY/USD, JPY/USD current rates',
          'Quantify BioPharma Systems GLP-1 volume tracking vs +18% plan for H2 FY2026',
        ],
      },
      {
        companyId,
        externalId: 'eps-guidance-beat',
        title: 'Quarterly Adj. EPS Tracking Above $12.72 Annual Guidance Ceiling',
        category: 'Financial Performance',
        threshold: '$12.72',
        severity: 'info',
        alertType: 'forecast',
        frequency: 'monthly',
        conditionPrefix: 'Exceeds',
        description:
          'Quarterly adjusted EPS run-rate above $3.18 would put FY2026 adjusted EPS above $12.72 guidance ceiling. Prepare management communications on guidance raise or reaffirmation. Assess whether outperformance is driven by GLP-1 volume upside, Alaris ramp ahead of plan, favorable FX, or lower China VoBP than anticipated. Structural vs timing distinctions matter for forward guidance.',
        suggestedActions: [
          'Confirm whether GLP-1 volume upside is structural (new supply agreements) vs pull-forward',
          'Prepare guidance revision analysis for CFO Christopher J. DelOrefice review',
          'Assess Alaris ramp — if 120K+ units is achievable in FY2026, revise Connected Care guidance',
          'Review China VoBP — if headwind moderating below $160M plan, quantify full-year benefit',
          'Prepare messaging for next earnings call: guidance raise vs narrowing vs reaffirmation',
        ],
      },
      // ═══════════════════════════════════════════
      // CHINA VoBP (VOLUME-BASED PROCUREMENT)
      // ═══════════════════════════════════════════
      {
        companyId,
        externalId: 'china-vobp-risk',
        title: 'China VoBP Headwind Tracking Above $200M Annual Threshold',
        category: 'China & Emerging Markets',
        threshold: '$200M',
        severity: 'critical',
        alertType: 'threshold',
        frequency: 'monthly',
        conditionPrefix: 'Exceeds',
        description:
          'China VoBP headwind exceeding $200M (vs $160M plan) signals incremental tender waves beyond plan. BD Medical Essentials (syringes, blood collection, IV therapy) and Connected Care are the most exposed. Each additional $50M VoBP headwind = approximately −0.3pp BD consolidated adjusted operating margin. New categories under tender review: insulin syringes, infusion sets, diagnostics consumables. Mitigation: mix shift to premium non-tendered products, digital solutions, and diagnostics platforms.',
        suggestedActions: [
          'Identify which new VoBP categories are being tendered beyond original plan assumptions',
          'Quantify revenue and margin impact by BD segment: Medical Essentials vs Connected Care vs BioPharma',
          'Accelerate mix-shift strategy to premium, non-tendered BD products in China',
          'Assess emerging market offset capacity — can India/SE Asia/LATAM volume compensate?',
          'Prepare investor communication on revised China VoBP exposure for next earnings call',
        ],
      },
      // ═══════════════════════════════════════════
      // ALARIS / CONNECTED CARE
      // ═══════════════════════════════════════════
      {
        companyId,
        externalId: 'alaris-ramp-risk',
        title: 'Alaris Annual Pump Shipments Tracking Below 65K Units Plan',
        category: 'Connected Care',
        threshold: '65K units',
        severity: 'critical',
        alertType: 'threshold',
        frequency: 'monthly',
        conditionPrefix: 'Falls below',
        description:
          'Alaris infusion pump annual shipment pace below 65K units (vs 75K plan) signals ongoing consent decree constraints or hospital capital spending delays. Pre-decree Alaris revenues were ~$500M annually. Full recovery to pre-decree levels (~120–140K units) is the key Connected Care growth catalyst. Each 10K unit shortfall vs plan ≈ −$35–45M Connected Care revenue. Monitor FDA 510(k) clearance pipeline and hospital capital budget cycles.',
        suggestedActions: [
          'Confirm FDA consent decree status — any new 483 observations or warning letters on Alaris manufacturing?',
          'Review hospital customer pipeline: booked orders vs backlog vs deferred purchasing decisions',
          'Assess capital budget cycles — Q1 is typically weakest for hospital capital; Q3/Q4 budget flush expected',
          'Quantify revenue shortfall impact on Connected Care segment operating income at current margins',
          'Prepare contingency plan communication for investors if Alaris ramp tracks below plan by >15%',
        ],
      },
      // ═══════════════════════════════════════════
      // BIOPHARMA SYSTEMS — GLP-1 SUPPLY
      // ═══════════════════════════════════════════
      {
        companyId,
        externalId: 'glp1-volume-risk',
        title: 'BioPharma Systems GLP-1 PFS Volume Growth Below +12% YoY',
        category: 'BioPharma Systems',
        threshold: '+12%',
        severity: 'warning',
        alertType: 'trend',
        frequency: 'monthly',
        conditionPrefix: 'Falls below',
        description:
          'BD prefillable syringe (PFS) volume growth for GLP-1 drugs (Ozempic, Wegovy, Mounjaro, Zepbound) below +12% YoY signals demand slowdown, pharmaceutical customer production adjustments, or competitor capacity gains. FY2026 plan: +18%. BD has long-term supply agreements with Novo Nordisk and Eli Lilly. Shortfall below +12% puts BioPharma Systems at risk of missing its operating margin target of ~32%. Capacity investments at NC and Ireland facilities represent sunk costs.',
        suggestedActions: [
          'Contact key GLP-1 pharma accounts (Novo Nordisk, Lilly) to confirm demand forecast revision if any',
          'Assess whether volume shortfall is demand-driven vs supply-side capacity timing issues',
          'Review competitor PFS suppliers (Gerresheimer, Schott) — are they gaining share on BD customers?',
          'Model BioPharma Systems segment operating income impact at 12% vs 18% GLP-1 volume growth',
          'Brief CEO Thomas E. Polen and CFO on full-year BioPharma Systems guidance risk',
        ],
      },
      // ═══════════════════════════════════════════
      // FX & INTERNATIONAL
      // ═══════════════════════════════════════════
      {
        companyId,
        externalId: 'fx-headwind-alert',
        title: 'FX Translation Headwind Exceeds $300M Annual Threshold',
        category: 'International & FX',
        threshold: '$300M',
        severity: 'warning',
        alertType: 'threshold',
        frequency: 'monthly',
        conditionPrefix: 'Exceeds',
        description:
          'Annual FX translation headwind exceeding $300M (vs $230M plan) signals meaningful USD strengthening vs BD\'s major currency exposures (EUR ~18% of revenue, CNY ~10%, JPY ~4%, BRL ~3%). BD\'s ~48% international revenue makes it highly sensitive to DXY movements. Each $50M incremental FX headwind ≈ −0.3pp reported operating margin. Constant currency growth will diverge materially from reported growth at this level — investor communication required.',
        suggestedActions: [
          'Update FX sensitivity analysis for current EUR/USD, CNY/USD, JPY/USD forward curves',
          'Quantify hedge portfolio coverage ratio and net remaining exposure for remainder of FY2026',
          'Review international pricing — can local currency price increases in high-inflation markets offset?',
          'Prepare constant currency vs reported growth bridge for CFO and IR team',
          'Assess whether to increase hedge ratio on next fiscal year exposures given current rate environment',
        ],
      },
      // ═══════════════════════════════════════════
      // CAPITAL STRUCTURE & LEVERAGE
      // ═══════════════════════════════════════════
      {
        companyId,
        externalId: 'leverage-alert',
        title: 'Net Leverage Ratio Above 3.2x — Deleveraging Path at Risk',
        category: 'Credit & Balance Sheet',
        threshold: '3.2x',
        severity: 'critical',
        alertType: 'threshold',
        frequency: 'monthly',
        conditionPrefix: 'Exceeds',
        description:
          'Net debt / adjusted EBITDA above 3.2x (vs 2.9x Q2 FY26 actual; target <2.5x by FY2028) signals FCF shortfall or unexpected cash outflows delaying deleveraging. BD\'s Baa1/BBB+ credit rating is supported by leverage declining trajectory. Key risks: Alaris remediation cash costs (~$300M FY26), Waters transaction costs, working capital drag. Rating agency scrutiny intensifies if leverage trajectory stalls above 3.0x.',
        suggestedActions: [
          'Reconcile actual leverage vs plan: is EBITDA miss or FCF shortfall driving ratio increase?',
          'Review FCF conversion rate — on track for ~95% of adjusted net income conversion?',
          'Check Alaris remediation cash spend — any cost overruns vs $300M FY26 plan?',
          'Engage rating agencies (Moody\'s/S&P) proactively if leverage trajectory stalls',
          'Prepare deleveraging path update for CFO Christopher J. DelOrefice: leverage scenarios to 2.5x by FY2028',
        ],
      },
    ],
  });

  console.log('Seeded 7 BD alert templates');

  // ── Report Templates (7 BD-specific reports) ─────────────────────────

  await prisma.reportTemplate.createMany({
    data: [
      // ══════════════════════════════════════════════════════════════════
      // BD SEGMENT P&L DASHBOARD
      // ══════════════════════════════════════════════════════════════════
      {
        companyId,
        externalId: 'bd-segment-pl',
        name: 'BD Four-Segment P&L Dashboard',
        category: 'Segment Performance',
        frequency: 'Weekly',
        description:
          'BD four-segment revenue, gross profit, and operating income dashboard: Medical Essentials, Connected Care, BioPharma Systems, Interventional. Tracking vs FY2026 guidance (adj. op. margin ~25%, EPS $12.52–$12.72). Constant currency and reported growth rates. Quarterly and year-to-date actuals vs budget vs prior year.',
        format: 'PowerBI',
        department: 'Finance',
        owner: 'BD FP&A',
        rating: 4.9,
        views: 3800,
        isNew: false,
        isTrending: true,
        relatedConsoleId: 'medical-essentials',
        relatedReportIds: ['bd-biopharma-glp1', 'bd-fx-bridge'],
        dataSource: 'SAP S/4HANA (BD ERP)',
        accessLevel: 'Finance + Executive',
        audience: ['CEO', 'CFO', 'Segment Presidents', 'IR'],
        tags: ['segment', 'p&l', 'revenue', 'operating-income', 'margin'],
        nextUpdate: 'Every Monday 6:00 AM',
        executiveSummary:
          'Q2 FY26: BD total revenue $4,714M (+4.7% reported, +7.2% constant currency). Adj. operating income $1,178M, adj. operating margin 25.0%. BioPharma Systems led with +12% CC growth on GLP-1 PFS demand. Alaris ramp on track at ~18K units Q2. China VoBP headwind $40M in quarter ($80M H1 cumulative vs $160M FY plan). FX translation headwind $58M in quarter.',
        aiInsight:
          'Predictive margin model indicates 78% probability FY2026 adj. operating margin finishes at 25.0–25.5%, within or above guidance range. Key upside: BioPharma Systems capacity utilization tracking ahead of 84% plan. Key risk: China VoBP escalation probability 22% based on NHSA tender pipeline signals.',
        recommendations: [
          'Monitor BioPharma Systems capacity utilization weekly — approaching 88% signals need for FY2027 capex acceleration',
          'Alaris Connected Care ramp Q3/Q4 seasonal hospital capital cycle typically strongest — maintain focus',
          'China VoBP H2 wave risk: pre-position mix-shift to non-tendered premium products in China',
          'Brief IR on FX constant currency vs reported growth differential for Q3 earnings preparation',
        ],
        keyMetrics: [
          { label: 'Q2 FY26 Revenue', value: '$4,714M', trend: 'up', trendValue: '+4.7% reported / +7.2% CC' },
          { label: 'Adj. Op. Margin', value: '25.0%', trend: 'up', trendValue: '+60bps YoY' },
          { label: 'BioPharma Systems Growth', value: '+12% CC', trend: 'up', trendValue: 'GLP-1 demand' },
          { label: 'China VoBP H1 Impact', value: '($80M)', trend: 'down', trendValue: 'vs ($160M) FY plan' },
          { label: 'FX Headwind Q2', value: '($58M)', trend: 'down', trendValue: 'vs ($230M) FY plan' },
        ],
        chartData: [
          {
            type: 'bar',
            title: 'BD Quarterly Revenue ($M)',
            data: [
              { period: 'Q1 FY25', value: 4438 },
              { period: 'Q2 FY25', value: 4579 },
              { period: 'Q3 FY25', value: 4664 },
              { period: 'Q4 FY25', value: 4685 },
              { period: 'Q1 FY26', value: 4486 },
              { period: 'Q2 FY26', value: 4714 },
            ],
          },
          {
            type: 'line',
            title: 'Adj. Operating Margin (%)',
            data: [
              { period: 'Q1 FY25', value: 23.8 },
              { period: 'Q2 FY25', value: 24.2 },
              { period: 'Q3 FY25', value: 24.8 },
              { period: 'Q4 FY25', value: 24.5 },
              { period: 'Q1 FY26', value: 24.9 },
              { period: 'Q2 FY26', value: 25.0 },
            ],
          },
        ],
        tableData: {
          headers: ['Segment', 'Q2 FY26 Rev ($M)', 'YoY Growth (CC)', 'Adj. Op. Margin', 'Key Driver'],
          rows: [
            ['Medical Essentials', '1,620', '+3.8%', '21.5%', 'GPO contract wins; China VoBP ($40M) headwind'],
            ['Connected Care', '520', '+5.2%', '18.2%', 'Alaris 18K units; Pyxis MedStation placements'],
            ['BioPharma Systems', '1,168', '+12.0%', '32.1%', 'GLP-1 PFS demand; 88% capacity utilization'],
            ['Interventional', '1,406', '+6.1%', '24.8%', 'Peripheral vascular procedures growth; Lutonix'],
            ['BD Total', '4,714', '+7.2%', '25.0%', 'Broad-based growth; FX headwind ($58M)'],
          ],
        },
      },

      // ══════════════════════════════════════════════════════════════════
      // BIOPHARMA SYSTEMS — GLP-1 TRACKER
      // ══════════════════════════════════════════════════════════════════
      {
        companyId,
        externalId: 'bd-biopharma-glp1',
        name: 'BioPharma Systems GLP-1 & Drug Delivery Tracker',
        category: 'BioPharma Systems',
        frequency: 'Weekly',
        description:
          'BD BioPharma Systems prefillable syringe (PFS) and drug delivery device volume tracking for GLP-1 agonist drugs (Novo Nordisk, Eli Lilly supply agreements). Capacity utilization at Franklin Lakes NJ and Pont-de-Claix France. Pricing realization vs +2.5% plan. Customer delivery schedules and supply agreement milestones.',
        format: 'PowerBI',
        department: 'Finance',
        owner: 'BioPharma Systems FP&A',
        rating: 4.8,
        views: 2900,
        isNew: false,
        isTrending: true,
        relatedConsoleId: 'biopharma-systems',
        relatedReportIds: ['bd-segment-pl', 'bd-capex-tracker'],
        dataSource: 'SAP S/4HANA + Manufacturing Execution System',
        accessLevel: 'Finance + Executive',
        audience: ['CEO', 'CFO', 'BioPharma Systems President', 'IR'],
        tags: ['glp1', 'biopharma', 'pfs', 'drug-delivery', 'capacity'],
        nextUpdate: 'Every Monday 7:00 AM',
        executiveSummary:
          'BioPharma Systems Q2 FY26 revenue $1,168M (+12.0% CC). GLP-1 PFS volumes tracking at +19% YoY in Q2, slightly above 18% plan. Capacity utilization at 88%, above 84% plan — accelerating FY2027 capacity expansion discussions with BD board. Pricing realization +2.8%, ahead of +2.5% plan. Long-term supply agreements with Novo Nordisk extended through 2030; Lilly agreement through 2029.',
        aiInsight:
          'ML demand model forecasts 82% probability GLP-1 PFS volumes sustain +18–22% growth through FY2027 based on Novo Nordisk and Lilly production ramp schedules. Capacity constraint risk emerges at 92% utilization (est. Q4 FY2026 at current growth rate). FY2027 capex acceleration decision required by Q3 FY2026 board meeting.',
        recommendations: [
          'Accelerate FY2027–FY2028 capacity expansion decisions given 88% current utilization and +19% volume trajectory',
          'Pursue pricing renegotiation on Novo Nordisk contract at next renewal — premium coated barrel specification commands 8–12% premium',
          'Monitor Gerresheimer and Schott PFS capacity additions — competitive threat timeline for FY2027+',
          'Consider BD BD-MAX and nested PFS technology as upsell into automated fill-finish customers',
        ],
        keyMetrics: [
          { label: 'Q2 FY26 Revenue', value: '$1,168M', trend: 'up', trendValue: '+12.0% CC' },
          { label: 'GLP-1 Volume Growth', value: '+19% YoY', trend: 'up', trendValue: 'vs +18% plan' },
          { label: 'Capacity Utilization', value: '88%', trend: 'up', trendValue: 'vs 84% plan' },
          { label: 'Pricing Realization', value: '+2.8%', trend: 'up', trendValue: 'vs +2.5% plan' },
          { label: 'Adj. Op. Margin', value: '32.1%', trend: 'up', trendValue: '+140bps YoY' },
        ],
        chartData: [
          {
            type: 'bar',
            title: 'BioPharma Systems Revenue ($M) by Quarter',
            data: [
              { period: 'Q1 FY25', value: 1020 },
              { period: 'Q2 FY25', value: 1042 },
              { period: 'Q3 FY25', value: 1058 },
              { period: 'Q4 FY25', value: 1062 },
              { period: 'Q1 FY26', value: 1140 },
              { period: 'Q2 FY26', value: 1168 },
            ],
          },
          {
            type: 'line',
            title: 'PFS Capacity Utilization (%)',
            data: [
              { period: 'Q1 FY25', value: 76 },
              { period: 'Q2 FY25', value: 79 },
              { period: 'Q3 FY25', value: 82 },
              { period: 'Q4 FY25', value: 83 },
              { period: 'Q1 FY26', value: 86 },
              { period: 'Q2 FY26', value: 88 },
            ],
          },
        ],
        tableData: {
          headers: ['Product Category', 'Q2 FY26 Rev ($M)', 'YoY Growth', 'Margin %', 'Capacity Headroom'],
          rows: [
            ['Prefillable Syringes (PFS)', '680', '+18%', '35.2%', '12% remaining'],
            ['Vials & Cartridges', '280', '+5%', '28.4%', '22% remaining'],
            ['Drug Delivery Devices', '145', '+9%', '31.0%', '18% remaining'],
            ['Closures & Components', '63', '+3%', '22.1%', '28% remaining'],
            ['BioPharma Systems Total', '1,168', '+12%', '32.1%', '12% avg remaining'],
          ],
        },
      },

      // ══════════════════════════════════════════════════════════════════
      // CONNECTED CARE — ALARIS RECOVERY REPORT
      // ══════════════════════════════════════════════════════════════════
      {
        companyId,
        externalId: 'bd-alaris-recovery',
        name: 'Connected Care — Alaris Recovery & MMS Performance Report',
        category: 'Connected Care',
        frequency: 'Weekly',
        description:
          'BD Alaris infusion pump unit shipments vs 75K annual plan. FDA consent decree status. Hospital customer order pipeline. Pyxis MedStation capital placements vs 1,800 plan. Connected Care software and services recurring revenue growth (+9% plan). Backlog analysis for deferred hospital capital orders.',
        format: 'PowerBI',
        department: 'Finance',
        owner: 'Connected Care FP&A',
        rating: 4.8,
        views: 2600,
        isNew: false,
        isTrending: true,
        relatedConsoleId: 'connected-care',
        relatedReportIds: ['bd-segment-pl'],
        dataSource: 'SAP CRM + Order Management System',
        accessLevel: 'Finance + Executive',
        audience: ['CEO', 'CFO', 'Connected Care President', 'IR'],
        tags: ['alaris', 'connected-care', 'infusion', 'mms', 'pyxis'],
        nextUpdate: 'Every Tuesday 7:00 AM',
        executiveSummary:
          'Connected Care Q2 FY26 revenue $520M (+5.2% CC). Alaris pump shipments 18K in Q2 (72K annualized vs 75K plan). Pyxis MedStation placements 460 in Q2 (1,840 annualized vs 1,800 plan). Software and services +11% YoY, above 9% plan. Hospital capital order backlog remains elevated at ~32K deferred units, supporting FY2027 ramp confidence. No new FDA observations on Alaris manufacturing.',
        aiInsight:
          'Q3/Q4 FY2026 hospital capital budget flush typically drives 60%+ of annual Alaris placements. Order backlog model forecasts 74% probability FY2026 finishes at 73–78K units — within ±5% of 75K plan. Software attach rate improving to 84% of hardware placements; recurring revenue compounding at 11% should exceed hardware revenue within 3 years.',
        recommendations: [
          'Monitor Q3 hospital capital release timing — early Q3 capital budget approvals are a leading indicator',
          'Accelerate Alaris software upsell to existing installed base — DERS integration is high-value retention tool',
          'Pyxis MedStation ahead of plan: assess capacity for additional sales team resources to capture momentum',
          'Prepare Q3 earnings messaging on Alaris FY2027 ramp confidence — backlog depth supports narrative',
        ],
        keyMetrics: [
          { label: 'Q2 Alaris Units', value: '18K', trend: 'up', trendValue: '72K annualized vs 75K plan' },
          { label: 'Pyxis Placements Q2', value: '460 units', trend: 'up', trendValue: '1,840 annualized vs 1,800 plan' },
          { label: 'Software & Services', value: '+11% YoY', trend: 'up', trendValue: 'vs +9% plan' },
          { label: 'Deferred Order Backlog', value: '~32K units', trend: 'flat', trendValue: 'Hospital capital pent-up demand' },
          { label: 'Connected Care Margin', value: '18.2%', trend: 'up', trendValue: '+80bps YoY' },
        ],
        chartData: [
          {
            type: 'bar',
            title: 'Alaris Quarterly Unit Shipments (K)',
            data: [
              { period: 'Q1 FY25', value: 8 },
              { period: 'Q2 FY25', value: 10 },
              { period: 'Q3 FY25', value: 14 },
              { period: 'Q4 FY25', value: 16 },
              { period: 'Q1 FY26', value: 17 },
              { period: 'Q2 FY26', value: 18 },
            ],
          },
        ],
        tableData: {
          headers: ['Product', 'Q2 FY26 Rev ($M)', 'YoY Growth', 'Plan Tracking', 'Key Metric'],
          rows: [
            ['Alaris Infusion Systems', '195', '+9.2%', 'On track', '18K units shipped'],
            ['Pyxis MedStation', '178', '+6.1%', 'Above plan', '460 placements'],
            ['Software & Services', '112', '+11.0%', 'Above plan', '84% attach rate'],
            ['Other Connected Care', '35', '+2.4%', 'On track', 'Accessories, service'],
            ['Connected Care Total', '520', '+5.2%', 'On track', '72K Alaris annualized'],
          ],
        },
      },

      // ══════════════════════════════════════════════════════════════════
      // MEDICAL ESSENTIALS — CHINA VoBP EXPOSURE
      // ══════════════════════════════════════════════════════════════════
      {
        companyId,
        externalId: 'bd-china-vobp',
        name: 'China VoBP Exposure & Medical Essentials Competitive Report',
        category: 'Medical Essentials',
        frequency: 'Monthly',
        description:
          'China Volume-Based Procurement tender tracking: current waves, pricing concessions, BD product exposure. Medical Essentials segment China revenue vs $160M annual VoBP headwind plan. Emerging market offset analysis (India, SE Asia, LATAM). U.S. GPO contract performance vs +3% domestic volume plan.',
        format: 'PowerBI',
        department: 'Finance',
        owner: 'Medical Essentials FP&A',
        rating: 4.6,
        views: 1800,
        isNew: false,
        isTrending: true,
        relatedConsoleId: 'medical-essentials',
        relatedReportIds: ['bd-segment-pl', 'bd-fx-bridge'],
        dataSource: 'SAP S/4HANA + China Market Data',
        accessLevel: 'Finance + Executive',
        audience: ['CEO', 'CFO', 'Medical Essentials President', 'IR'],
        tags: ['china', 'vobp', 'medical-essentials', 'emerging-markets', 'gpO'],
        nextUpdate: 'Monthly Day 8',
        executiveSummary:
          'Medical Essentials Q2 FY26 revenue $1,620M (+3.8% CC). China VoBP headwind $40M in Q2 ($80M H1 cumulative). No additional tender waves beyond original plan announced in Q2. U.S. volume +3.5% YoY on BD Vacutainer and IV catheter GPO wins. India revenue +14% YoY on government healthcare infrastructure investment. Segment adj. operating margin 21.5%, in line with plan.',
        aiInsight:
          'NHSA tender pipeline analysis suggests 35% probability of additional VoBP wave targeting insulin syringes in Q4 FY2026 or Q1 FY2027. Early mitigation action recommended: accelerate premium product mix in China and quantify supply flexibility to redirect volume to other markets if needed.',
        recommendations: [
          'Increase sales coverage for premium, non-tendered BD products in China (Luer-lock syringes, specialty diagnostics)',
          'Accelerate India commercial team expansion — +14% growth trajectory supports incremental investment',
          'Monitor NHSA published tender notices monthly for new BD product category inclusions',
          'Prepare China VoBP contingency: if additional wave materializes, quantify redirect of 10–15% of China volume to other EM markets',
        ],
        keyMetrics: [
          { label: 'Q2 FY26 Revenue', value: '$1,620M', trend: 'up', trendValue: '+3.8% CC' },
          { label: 'China VoBP H1', value: '($80M)', trend: 'down', trendValue: 'vs ($160M) FY plan' },
          { label: 'India Revenue Growth', value: '+14% YoY', trend: 'up', trendValue: 'EM offset momentum' },
          { label: 'U.S. Volume Growth', value: '+3.5%', trend: 'up', trendValue: 'vs +3.0% plan' },
          { label: 'Adj. Op. Margin', value: '21.5%', trend: 'flat', trendValue: 'In line with plan' },
        ],
        chartData: [
          {
            type: 'bar',
            title: 'China VoBP Cumulative Headwind ($M)',
            data: [
              { period: 'Q1 FY25', value: 28 },
              { period: 'Q2 FY25', value: 32 },
              { period: 'Q3 FY25', value: 38 },
              { period: 'Q4 FY25', value: 42 },
              { period: 'Q1 FY26', value: 40 },
              { period: 'Q2 FY26', value: 40 },
            ],
          },
        ],
        tableData: {
          headers: ['Geography', 'Q2 FY26 Rev ($M)', 'YoY Growth (CC)', 'VoBP Risk', 'Priority Action'],
          rows: [
            ['United States', '680', '+3.5%', 'None', 'GPO contract retention'],
            ['China', '185', '-8.2%', 'High — $40M Q2', 'Mix-shift to premium'],
            ['Europe', '390', '+5.0%', 'None', 'BD Diagnostics expansion'],
            ['India & SE Asia', '215', '+13.8%', 'Low', 'Accelerate investment'],
            ['Other International', '150', '+4.2%', 'Low', 'LATAM GPO wins'],
          ],
        },
      },

      // ══════════════════════════════════════════════════════════════════
      // INTERNATIONAL FX BRIDGE
      // ══════════════════════════════════════════════════════════════════
      {
        companyId,
        externalId: 'bd-fx-bridge',
        name: 'BD International Revenue & FX Bridge Report',
        category: 'International & FX',
        frequency: 'Monthly',
        description:
          'BD FX translation impact vs $230M annual headwind plan. Constant currency vs reported growth bridge by segment and geography. EUR/USD, CNY/USD, JPY/USD, BRL/USD sensitivity. Hedge program coverage and net benefit. International revenue mix tracking vs 48% plan.',
        format: 'PowerBI',
        department: 'Finance / Treasury',
        owner: 'Treasury / IR FP&A',
        rating: 4.7,
        views: 2200,
        isNew: false,
        isTrending: false,
        relatedConsoleId: 'medical-essentials',
        relatedReportIds: ['bd-segment-pl', 'bd-china-vobp'],
        dataSource: 'SAP Treasury + Reval Hedging System',
        accessLevel: 'Finance + Executive',
        audience: ['CFO', 'Treasurer', 'CEO', 'IR'],
        tags: ['fx', 'international', 'hedging', 'constant-currency', 'bridge'],
        nextUpdate: 'Monthly Day 10',
        executiveSummary:
          'Q2 FY26 FX translation headwind $58M ($116M H1 cumulative vs $230M FY plan). EUR/USD averaged 1.082 in Q2 vs 1.085 H1 average — broadly in line with plan rate assumption. JPY continued weak at 152 vs USD. Net hedge benefit $16M in Q2 ($32M H1). Constant currency growth of +7.2% materially above +4.7% reported growth — investor communications emphasizing CC growth is appropriate.',
        recommendations: [
          'Prepare constant currency vs reported growth bridge for Q3 earnings script and slides',
          'Consider increasing EUR hedge ratio for FY2027 at current forward rates to lock favorable economics',
          'Brief IR on JPY exposure — JPY weakness beyond 155/USD would add incremental headwind',
          'Review BRL hedging — Brazil ~3% of BD revenue with elevated inflation; assess natural hedge vs derivative',
        ],
        keyMetrics: [
          { label: 'Q2 FX Headwind', value: '($58M)', trend: 'down', trendValue: '($116M) H1 vs ($230M) FY plan' },
          { label: 'Reported Revenue Growth', value: '+4.7%', trend: 'up', trendValue: 'Q2 FY26 YoY' },
          { label: 'CC Revenue Growth', value: '+7.2%', trend: 'up', trendValue: '+250bps CC premium to reported' },
          { label: 'Net Hedge Benefit', value: '$16M Q2', trend: 'flat', trendValue: '$32M H1 cumulative' },
          { label: 'International Mix', value: '48.2%', trend: 'flat', trendValue: 'vs 48% plan' },
        ],
        chartData: [
          {
            type: 'bar',
            title: 'CC vs Reported Revenue Growth (%) by Quarter',
            data: [
              { period: 'Q1 FY26 CC', value: 7.4 },
              { period: 'Q1 FY26 Reported', value: 4.9 },
              { period: 'Q2 FY26 CC', value: 7.2 },
              { period: 'Q2 FY26 Reported', value: 4.7 },
            ],
          },
        ],
        tableData: {
          headers: ['Currency', 'Revenue Exposure', 'Q2 FX Impact ($M)', 'Hedge Coverage', 'Net Impact'],
          rows: [
            ['EUR (~18%)', '~$850M/qtr', '($28M)', '60%', '($11M) net'],
            ['CNY (~10%)', '~$472M/qtr', '($16M)', '40%', '($10M) net'],
            ['JPY (~4%)', '~$189M/qtr', '($9M)', '50%', '($5M) net'],
            ['BRL (~3%)', '~$141M/qtr', '($3M)', '30%', '($2M) net'],
            ['All Others', '~$430M/qtr', '($2M)', 'Varied', '($2M) net'],
          ],
        },
      },

      // ══════════════════════════════════════════════════════════════════
      // CAPITAL ALLOCATION & LEVERAGE
      // ══════════════════════════════════════════════════════════════════
      {
        companyId,
        externalId: 'bd-capex-tracker',
        name: 'BD Capital Allocation, FCF & Leverage Dashboard',
        category: 'Capital Structure',
        frequency: 'Monthly',
        description:
          'BD free cash flow generation vs ~$3.0B+ FY2026 plan. Gross debt reduction tracking vs $1,500M annual plan. Net leverage 2.9x Q2 FY26 vs 2.5x FY2028 target. Capex tracking (BD Manufacturing capacity expansions for GLP-1 demand). Share repurchase / dividend return. Alaris remediation cash costs.',
        format: 'PowerBI',
        department: 'Finance / Treasury',
        owner: 'Treasury / FP&A',
        rating: 4.7,
        views: 2100,
        isNew: false,
        isTrending: false,
        relatedConsoleId: 'interventional',
        relatedReportIds: ['bd-segment-pl', 'bd-fx-bridge'],
        dataSource: 'SAP Treasury + Debt Management System',
        accessLevel: 'Finance + Executive',
        audience: ['CFO', 'CEO', 'Treasurer', 'IR', 'Board'],
        tags: ['fcf', 'leverage', 'capex', 'debt', 'capital-allocation'],
        nextUpdate: 'Monthly Day 12',
        executiveSummary:
          'BD Q2 FY26 FCF $785M (H1 $1,420M vs ~$1,500M H1 plan). FCF conversion 96% of adj. net income. Gross debt reduced $750M H1 (vs $1,500M FY plan — on track). Net leverage 2.9x Q2 FY26, down from 3.1x Q2 FY25. Alaris remediation cash costs $145M H1 (vs $300M FY plan — on track). GLP-1 capacity capex $420M H1 (vs $900M FY plan). Dividend maintained at $0.95/quarter ($3.80 annualized).',
        recommendations: [
          'Accelerate H2 debt paydown on higher-coupon tranches — rate cut environment supports early redemption',
          'Review GLP-1 capacity capex pacing — $900M FY plan, ensure contractor execution on NC and Ireland sites',
          'Consider share repurchase runway if leverage reaches 2.5x ahead of FY2028 target — board pre-authorization advised',
          'Monitor Alaris remediation cash costs — $300M FY plan vs $145M H1 track; H2 front-loaded settlements expected',
        ],
        keyMetrics: [
          { label: 'H1 FCF', value: '$1,420M', trend: 'up', trendValue: 'vs ~$1,500M H1 plan' },
          { label: 'FCF Conversion', value: '96%', trend: 'up', trendValue: 'vs 95% plan' },
          { label: 'Net Leverage Q2', value: '2.9x', trend: 'down', trendValue: 'vs 3.1x Q2 FY25' },
          { label: 'H1 Gross Debt Paid', value: '$750M', trend: 'up', trendValue: 'vs $1,500M FY plan (on track)' },
          { label: 'GLP-1 Capex H1', value: '$420M', trend: 'up', trendValue: 'vs $900M FY plan (on track)' },
        ],
        chartData: [
          {
            type: 'line',
            title: 'Net Debt / Adj. EBITDA Leverage Ratio',
            data: [
              { period: 'Q1 FY25', value: 3.2 },
              { period: 'Q2 FY25', value: 3.1 },
              { period: 'Q3 FY25', value: 3.0 },
              { period: 'Q4 FY25', value: 3.0 },
              { period: 'Q1 FY26', value: 2.95 },
              { period: 'Q2 FY26', value: 2.9 },
            ],
          },
        ],
        tableData: {
          headers: ['Cash Flow Component', 'Q2 FY26 ($M)', 'H1 FY26 ($M)', 'FY2026 Plan ($M)', 'Tracking'],
          rows: [
            ['Adj. Net Income', '818', '1,479', '3,100', 'On track'],
            ['D&A Add-back', '618', '1,231', '2,462', 'On track'],
            ['Working Capital (Use)', '(218)', '(420)', '(650)', 'On track'],
            ['Capex (GLP-1 + Other)', '(480)', '(870)', '(1,700)', 'On track'],
            ['Free Cash Flow', '785', '1,420', '3,050', 'On track'],
            ['Gross Debt Repayment', '(750)', '(750)', '(1,500)', 'On track'],
          ],
        },
      },

      // ══════════════════════════════════════════════════════════════════
      // INTERVENTIONAL SEGMENT PERFORMANCE
      // ══════════════════════════════════════════════════════════════════
      {
        companyId,
        externalId: 'bd-interventional',
        name: 'Interventional Segment — Peripheral Vascular & Oncology Report',
        category: 'Interventional',
        frequency: 'Monthly',
        description:
          'BD Interventional segment revenue tracking: peripheral vascular (PV), endovascular surgery, peripheral intervention, oncology. Lutonix drug-coated balloon market performance. Electrophysiology and EP mapping revenue. Procedure volume trends in CRM-adjacent markets. Geographic performance: U.S. vs international hospital procedures.',
        format: 'PowerBI',
        department: 'Finance',
        owner: 'Interventional FP&A',
        rating: 4.6,
        views: 1950,
        isNew: false,
        isTrending: false,
        relatedConsoleId: 'interventional',
        relatedReportIds: ['bd-segment-pl'],
        dataSource: 'SAP S/4HANA + Salesforce CRM',
        accessLevel: 'Finance + Executive',
        audience: ['CEO', 'CFO', 'Interventional President', 'IR'],
        tags: ['interventional', 'peripheral-vascular', 'oncology', 'ep', 'surgery'],
        nextUpdate: 'Monthly Day 8',
        executiveSummary:
          'Interventional Q2 FY26 revenue $1,406M (+6.1% CC). Peripheral vascular +8% on procedure volume recovery and Lutonix DCB share gains. Oncology +9% on biopsy and ablation device demand. Surgical +3% on bariatric and laparoscopic instrument portfolio. Adj. operating margin 24.8%, +90bps YoY on product mix improvement. International +7.5% CC driven by Europe and Asia procedure recovery.',
        recommendations: [
          'Monitor Lutonix DCB competitive landscape — Medtronic and B. Braun share in SFA segment requires quarterly tracking',
          'Evaluate tuck-in acquisition opportunities in EP mapping/electrophysiology to strengthen catheter ablation portfolio',
          'Assess China procedure volume recovery — if hospital procedure volumes return, Interventional has upside beyond plan',
          'Review BD-XB Percutaneous Transluminal Angioplasty launch timing — regulatory clearance expected Q4 FY2026',
        ],
        keyMetrics: [
          { label: 'Q2 FY26 Revenue', value: '$1,406M', trend: 'up', trendValue: '+6.1% CC' },
          { label: 'Peripheral Vascular', value: '+8% CC', trend: 'up', trendValue: 'DCB + PV procedure recovery' },
          { label: 'Oncology Growth', value: '+9% CC', trend: 'up', trendValue: 'Biopsy & ablation demand' },
          { label: 'Adj. Op. Margin', value: '24.8%', trend: 'up', trendValue: '+90bps YoY' },
          { label: 'International CC Growth', value: '+7.5%', trend: 'up', trendValue: 'Europe & Asia procedure recovery' },
        ],
        chartData: [
          {
            type: 'bar',
            title: 'Interventional Revenue ($M) by Sub-Segment',
            data: [
              { period: 'Peripheral Vascular', value: 590 },
              { period: 'Oncology', value: 420 },
              { period: 'Surgery', value: 245 },
              { period: 'Urology & Critical Care', value: 151 },
            ],
          },
        ],
        tableData: {
          headers: ['Sub-Segment', 'Q2 FY26 Rev ($M)', 'YoY CC Growth', 'Adj. Margin', 'Key Product'],
          rows: [
            ['Peripheral Vascular', '590', '+8.0%', '26.2%', 'Lutonix DCB, Rotarex'],
            ['Oncology', '420', '+9.0%', '28.1%', 'BD Inrad Biopsy, SpyGlass'],
            ['Surgery', '245', '+3.0%', '20.4%', 'Laparoscopic instruments'],
            ['Urology & Critical Care', '151', '+4.5%', '22.0%', 'BD Bard catheters'],
            ['Interventional Total', '1,406', '+6.1%', '24.8%', 'Diversified MedTech portfolio'],
          ],
        },
      },
    ],
  });

  console.log('Seeded 7 BD report templates');
}
