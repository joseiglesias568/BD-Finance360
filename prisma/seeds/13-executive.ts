import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed Executive Summary & Monthly Report Data
// Becton, Dickinson and Company (BDX) — FY ends September 30
// Source: BD Q2 FY26 earnings (May 2026), FY2025 10-K, BD investor materials
// =============================================================================

export async function seedExecutive(prisma: PrismaClient, companyId: number) {
  console.log('Seeding BD executive summary & monthly report data...');

  // Delete existing records before creating new ones
  await prisma.riskOpportunity.deleteMany({ where: { companyId } });
  await prisma.businessInsight.deleteMany({ where: { companyId } });
  await prisma.executiveBriefing.deleteMany({ where: { companyId } });
  await prisma.forwardInsight.deleteMany({ where: { companyId } });
  await prisma.criticalAction.deleteMany({ where: { companyId } });
  await prisma.businessPillar.deleteMany({ where: { companyId } });
  await prisma.executiveNarrative.deleteMany({ where: { companyId } });

  // 1. Executive Narrative (State of the Business — Q2 FY26)
  await prisma.executiveNarrative.create({
    data: {
      companyId,
      periodLabel:   'Q2 FY26',
      overallStatus: 'Growing',
      statusColor:   'green',
      narrative:
        'Becton, Dickinson and Company delivered Q2 FY26 adjusted EPS of $3.50 (+5.1% YoY), with total revenue of $4,714M (+4.7% reported / +7.2% constant currency). H1 FY26 adjusted EPS of $6.85 puts BD on track for the $12.52–$12.72 FY2026 guidance range. BioPharma Systems led growth at +12.0% CC, driven by sustained GLP-1 prefillable syringe demand (+19% volume), with capacity utilization at 88% — approaching the level requiring FY2027 capex acceleration. Connected Care executed steadily at 72K annualized Alaris pump shipments vs 75K plan, with the hospital capital backlog of ~32K units providing confidence in the FY2027 ramp. Interventional grew +6.1% CC on peripheral vascular and oncology procedure strength. The key GAAP item was a $450M non-cash goodwill impairment on the Connected Care unit (excluded from adjusted metrics). China VoBP headwind tracked at $80M H1 vs $160M FY plan, with no additional waves beyond plan in Q2. FX translation headwind $116M H1 vs $230M FY plan. Leverage declined to 2.9x, on track for <2.5x by FY2028. Three H2 FY2026 catalysts: (1) hospital capital release cycle historically strongest in Q3/Q4 lifting Alaris and Pyxis volumes, (2) BioPharma Systems Q3/Q4 GLP-1 pharma customer build-to-stock seasonality, (3) continued debt reduction toward credit upgrade threshold at 2.5x.',
      keyAchievements: [
        'Q2 FY26 Adj. EPS $3.50 (+5.1% YoY) — H1 $6.85 on track for $12.52–$12.72 FY guidance',
        'BioPharma Systems +12% CC on GLP-1 PFS demand; capacity utilization 88%, above 84% plan',
        'Connected Care 72K annualized Alaris units — 32K deferred backlog provides H2 FY26 / FY2027 visibility',
        'Net leverage 2.9x, down from 3.1x Q2 FY25 — FCF conversion 96%, gross debt reduction $750M H1',
        'Zero new FDA 483 observations on Alaris manufacturing Q1–Q2 FY26 — consent decree resolution pathway clear',
      ],
      concerns: [
        'BioPharma Systems at 88% PFS capacity — risk of delivery constraint if GLP-1 demand accelerates before new capacity online',
        'Alaris pump ramp 72K annualized vs 75K plan — consent decree formal resolution required for full recovery to 120K+',
        'China VoBP $160M FY headwind tracking in line, but 35% probability of additional wave in Q4 FY2026 / Q1 FY2027',
        '$450M non-cash goodwill impairment on Connected Care — signals elongated Alaris recovery vs original acquisition thesis',
      ],
    },
  });
  console.log('  BD executive narrative seeded');

  // 2. Business Pillars (4 pillars — one per BD segment)
  const pillars = [
    {
      externalId:    'biopharma',
      label:         'BioPharma Systems',
      value:         '$1,168M Revenue Q2',
      change:        12.0,
      target:        '~$4,500M FY26',
      status:        'above',
      color:         'green',
      keyInsight:
        'GLP-1 PFS volume +19% YoY; capacity utilization 88%; pricing realization +2.8%; adj. op. margin 32.1%',
      actionRequired: false,
      metrics: [
        { label: 'BioPharma Systems Rev Q2', value: '$1,168M', change: 12.0, vsTarget: '+12% CC vs plan' },
        { label: 'PFS Capacity Utilization', value: '88%', change: 4.0, vsTarget: 'vs 84% plan — approaching constraint' },
      ],
      forecast:
        'BioPharma Systems on track for ~$4,500M FY26. Capacity acceleration needed by Q3 FY2026 board decision to avoid FY2027 delivery risk.',
      sparkline: [1020, 1042, 1058, 1062, 1140, 1168],
      subMetrics: [
        { name: 'GLP-1 Volume Growth', value: '+19% YoY' },
        { name: 'Adj. Op. Margin', value: '32.1%' },
      ],
      sortOrder: 1,
    },
    {
      externalId:    'connected-care',
      label:         'Connected Care',
      value:         '$520M Revenue Q2',
      change:        5.2,
      target:        '~$2,100M FY26',
      status:        'on-track',
      color:         'yellow',
      keyInsight:
        'Alaris 72K annualized units vs 75K plan; Pyxis MedStation placements ahead of plan; software +11% YoY',
      actionRequired: false,
      metrics: [
        { label: 'Connected Care Rev Q2', value: '$520M', change: 5.2, vsTarget: '+5.2% CC vs plan' },
        { label: 'Alaris Annualized Shipments', value: '72K units', change: -4.0, vsTarget: 'vs 75K plan (below by 3K)' },
      ],
      forecast:
        'Q3/Q4 hospital capital release expected to close gap to 75K annual target. FY2027 Alaris ramp to 100–120K units remains the key value catalyst.',
      sparkline: [470, 482, 495, 498, 495, 520],
      subMetrics: [
        { name: 'Pyxis Placements', value: '1,840 annualized' },
        { name: 'Software Growth', value: '+11% YoY' },
      ],
      sortOrder: 2,
    },
    {
      externalId:    'medical-essentials',
      label:         'Medical Essentials',
      value:         '$1,620M Revenue Q2',
      change:        3.8,
      target:        '~$6,300M FY26',
      status:        'on-track',
      color:         'green',
      keyInsight:
        'U.S. volume +3.5% on GPO wins; China VoBP $80M H1 tracking in line; India +14% YoY; adj. margin 21.5%',
      actionRequired: false,
      metrics: [
        { label: 'Medical Essentials Rev Q2', value: '$1,620M', change: 3.8, vsTarget: '+3.8% CC on plan' },
        { label: 'China VoBP H1', value: '($80M)', change: 0, vsTarget: 'vs ($160M) FY plan — on track' },
      ],
      forecast:
        'Medical Essentials on track for ~$6,300M FY26. China VoBP at plan pace; India and SE Asia emerging market growth partially offsetting.',
      sparkline: [1558, 1580, 1597, 1601, 1584, 1620],
      subMetrics: [
        { name: 'India Growth', value: '+14% YoY' },
        { name: 'Adj. Op. Margin', value: '21.5%' },
      ],
      sortOrder: 3,
    },
    {
      externalId:    'interventional',
      label:         'Interventional',
      value:         '$1,406M Revenue Q2',
      change:        6.1,
      target:        '~$5,600M FY26',
      status:        'above',
      color:         'green',
      keyInsight:
        'Peripheral vascular +8% CC on Lutonix DCB gains; oncology +9% CC; international +7.5% CC; margin +90bps YoY',
      actionRequired: false,
      metrics: [
        { label: 'Interventional Rev Q2', value: '$1,406M', change: 6.1, vsTarget: '+6.1% CC, above plan' },
        { label: 'Adj. Op. Margin', value: '24.8%', change: 0.9, vsTarget: '+90bps YoY' },
      ],
      forecast:
        'Interventional tracking above plan on procedure growth; 6–8% CC full-year target achievable. EP catheter tuck-in opportunity supports FY2027 growth.',
      sparkline: [1320, 1345, 1368, 1374, 1380, 1406],
      subMetrics: [
        { name: 'PV Growth', value: '+8% CC' },
        { name: 'Oncology Growth', value: '+9% CC' },
      ],
      sortOrder: 4,
    },
  ];

  for (const p of pillars) {
    await prisma.businessPillar.create({ data: { companyId, periodLabel: 'Q2 FY26', ...p } });
  }
  console.log('  BD business pillars seeded');

  // 3. Critical Actions (5 BD-specific actions)
  const criticalActions = [
    {
      title:          'GLP-1 Capacity Expansion Authorization',
      priority:       'critical',
      urgency:        'immediate',
      owner:          'CEO Thomas E. Polen / CFO Christopher J. DelOrefice',
      dueDate:        'Q3 FY2026 Board Meeting',
      status:         'pending',
      category:       'Strategic',
      businessOutcome:'Financial',
      description:    'Authorize FY2027 BioPharma Systems GLP-1 capacity expansion — board approval required by Q3 FY2026 board meeting to avoid delivery risk at 92%+ utilization by Q4 FY2026.',
      impact:         'Approx. $80M incremental revenue per additional PFS manufacturing line commissioned',
      financialImpact:'$80M+ incremental annual revenue per new PFS manufacturing line',
      riskLevel:      'high',
      riskAssessment: 'Delivery commitment failures on Novo Nordisk / Eli Lilly supply agreements; customer defection to Gerresheimer or Schott',
      sortOrder:      1,
    },
    {
      title:          'Alaris Consent Decree FDA Resolution',
      priority:       'high',
      urgency:        'urgent',
      owner:          'BD Regulatory Affairs / Legal',
      dueDate:        'Q4 FY2026',
      status:         'in-progress',
      category:       'Strategic',
      businessOutcome:'Risk',
      description:    'Confirm Alaris consent decree resolution timeline with FDA — zero-483 track record in Q1–Q2 FY2026 supports petition for formal Consent Decree termination by Q1 FY2027.',
      impact:         'Full market return to 120K+ annual Alaris units adding ~$200–300M Connected Care revenue',
      financialImpact:'$200–300M Connected Care revenue recovery; $450M goodwill impairment reversal potential',
      riskLevel:      'high',
      riskAssessment: 'FY2027 revenue shortfall vs hospital backlog expectations; competitive loss to ICU Medical and B. Braun',
      sortOrder:      2,
    },
    {
      title:          'H2 FY26 High-Coupon Debt Retirement',
      priority:       'high',
      urgency:        'planned',
      owner:          'CFO Christopher J. DelOrefice / Treasurer',
      dueDate:        'Q3–Q4 FY2026',
      status:         'in-progress',
      category:       'Financial',
      businessOutcome:'Financial',
      description:    'Execute H2 FY2026 high-coupon debt retirement — retire $800M+ of >4.5% coupon BD long-term debt tranches maturing in FY2026–FY2027 to reduce annual interest expense by ~$40M.',
      impact:         '$40M annual interest expense savings; accelerates leverage decline toward 2.5x FY2028 target',
      financialImpact:'$40M annual interest savings; leverage decline from 2.9x toward 2.5x target',
      riskLevel:      'medium',
      riskAssessment: 'Higher interest expense burden delays credit upgrade from Baa1/BBB+ to A3/A-',
      sortOrder:      3,
    },
    {
      title:          'China VoBP Premium Mix-Shift Initiative',
      priority:       'medium',
      urgency:        'planned',
      owner:          'Medical Essentials President / China Country President',
      dueDate:        'Q4 FY2026',
      status:         'pending',
      category:       'Commercial',
      businessOutcome:'Commercial',
      description:    'Implement China VoBP mitigation: accelerate premium product mix-shift to non-tendered BD products, targeting 35%+ premium mix by FY2027 from current 28%.',
      impact:         'Reduces VoBP-exposed China revenue from 62% to <50%, decreasing headwind sensitivity by ~$60M',
      financialImpact:'$60M reduction in VoBP headwind sensitivity; mitigates future tender wave risk',
      riskLevel:      'medium',
      riskAssessment: 'Additional VoBP wave on insulin syringes or infusion sets could add $80–100M headwind',
      sortOrder:      4,
    },
    {
      title:          'Interventional EP Catheter Tuck-In Acquisition',
      priority:       'medium',
      urgency:        'planned',
      owner:          'CEO Thomas E. Polen / Chief Strategy Officer',
      dueDate:        'FY2027 Planning',
      status:         'pending',
      category:       'Strategic',
      businessOutcome:'Commercial',
      description:    'Finalize Interventional segment EP catheter acquisition strategy — evaluate targeted tuck-in of electrophysiology mapping or catheter ablation company.',
      impact:         'Adds $150–300M revenue in high-growth EP ablation market',
      financialImpact:'$150–300M revenue in EP ablation; supports 8–10% CC growth target by FY2027',
      riskLevel:      'low',
      riskAssessment: 'Abbott and Medtronic expand EP dominance; BD misses catheter ablation growth wave',
      sortOrder:      5,
    },
  ];

  for (const ca of criticalActions) {
    await prisma.criticalAction.create({ data: { companyId, ...ca } });
  }
  console.log('  BD critical actions seeded');

  // 4. Forward Insights (4 BD-specific)
  const forwardInsights = [
    {
      type:       'opportunity',
      title:      'Alaris Hospital Capital Release — Q3/Q4 Seasonal Uplift',
      insight:    'Hospital capital budget release cycle (Q3/Q4 strongest) expected to lift Alaris pump shipments from 72K annualized pace to 75K+ annual run-rate.',
      impact:     '$15–20M Connected Care revenue acceleration in Q3/Q4 FY26',
      timeframe:  'Q3–Q4 FY2026',
      confidence: '74%',
    },
    {
      type:       'risk',
      title:      'BioPharma Systems GLP-1 Capacity Constraint by Q2 FY2027',
      insight:    'BD BioPharma Systems GLP-1 PFS capacity constraint becomes binding by Q2 FY2027 without board-authorized expansion. Current 88% utilization at +19% demand growth reaches 92% threshold within 2 quarters.',
      impact:     '$150–200M missed revenue risk vs Novo Nordisk and Eli Lilly supply agreements',
      timeframe:  'FY2027',
      confidence: '82%',
    },
    {
      type:       'risk',
      title:      'China VoBP Additional Wave — Insulin Syringe Tender Risk',
      insight:    'China NHSA is expected to advance the next VoBP tender cycle covering insulin syringes and infusion sets, with 35% probability of launch in Q4 FY2026 or Q1 FY2027.',
      impact:     '$75–100M additional VoBP headwind beyond the $160M FY2026 plan',
      timeframe:  'Q4 FY2026 / Q1 FY2027',
      confidence: '35%',
    },
    {
      type:       'opportunity',
      title:      'Credit Upgrade Inflection — Share Repurchase Reinstatement by FY2028',
      insight:    'BD is on track to reach 2.5x net leverage by FY2028, triggering A3/A- credit upgrade and enabling share repurchase program reinstatement with $25–35M annual interest savings.',
      impact:     '$0.30–$0.50/share EPS accretion; BD could approach $14–15 adj. EPS by FY2028',
      timeframe:  'FY2027–FY2028',
      confidence: '78%',
    },
  ];

  for (const fi of forwardInsights) {
    await prisma.forwardInsight.create({ data: { companyId, ...fi } });
  }
  console.log('  BD forward insights seeded');

  // 5. Executive Briefing (monthly summary for CEO Thomas E. Polen)
  await prisma.executiveBriefing.create({
    data: {
      companyId,
      periodLabel: 'Q2 FY26',
      summary:
        'BD delivered Q2 FY26 adjusted EPS of $3.50 (+5.1% YoY), with $4,714M total revenue (+7.2% CC). H1 FY26 adjusted EPS of $6.85 is on track for $12.52–$12.72 FY guidance. BioPharma Systems leads at +12% CC on GLP-1 drug delivery; capacity at 88% requires FY2027 expansion decision this quarter. Connected Care executing near plan with Alaris at 72K annualized units. Net leverage declined to 2.9x on strong FCF ($1,420M H1).',
      keyHighlights: [
        { type: 'positive', text: 'BioPharma Systems +12% CC on GLP-1 PFS demand; above plan' },
        { type: 'positive', text: 'Adj. EPS $3.50 (+5.1% YoY); H1 $6.85 on track for FY guidance $12.52–$12.72' },
        { type: 'positive', text: 'FCF conversion 96%; H1 FCF $1,420M; gross debt reduction $750M H1' },
        { type: 'neutral', text: 'Connected Care Alaris at 72K annualized units vs 75K plan; 32K backlog provides H2 visibility' },
        { type: 'risk', text: 'BioPharma Systems PFS capacity at 88% — board authorization required Q3 FY2026' },
        { type: 'risk', text: '$450M non-cash goodwill impairment on Connected Care (excluded from adjusted metrics)' },
      ],
      recommendations: [
        'Authorize BioPharma Systems GLP-1 capacity expansion — board vote required Q3 FY2026',
        'Drive hospital capital release for Alaris and Pyxis in Q3/Q4 — seasonal peak window',
        'Retire $800M+ high-coupon debt in H2 — accelerate path to 2.5x leverage',
        'China VoBP contingency plan — pre-position against potential insulin syringe tender wave',
        'Alaris FDA consent decree formal resolution — petition pathway clear after zero-483 Q1–Q2 track',
      ],
    },
  });
  console.log('  BD executive briefing seeded');

  // 6. Business Insights (6 items)
  const businessInsights = [
    {
      category:       'BioPharma Systems',
      businessOutcome:'Financial',
      title:          'GLP-1 PFS Volumes +19% YoY — Capacity at 88%, Action Required',
      metric:         '$1,168M Q2 revenue (+12.0% CC)',
      change:         12.0,
      status:         'high',
      insight:        'BioPharma Systems GLP-1 prefillable syringe volume growth of +19% YoY in Q2 FY26 is outpacing the 18% plan. Capacity at 88% approaches the 92% safety threshold — without expansion, delivery risk to Novo Nordisk and Eli Lilly emerges in Q2 FY2027.',
      drivers:        ['GLP-1 drug volume growth +19% YoY', 'Capacity utilization 88% vs 84% plan', 'PFS pricing realization +2.8%'],
      actions:        ['Board authorization for FY2027–FY2028 GLP-1 capacity capex ($1.2–1.5B) required Q3 FY2026'],
      relatedMetrics: { utilization: '88%', margin: '32.1%', growth: '+12% CC' },
      sortOrder:      1,
    },
    {
      category:       'Connected Care',
      businessOutcome:'Risk',
      title:          'Alaris Zero-483 Streak Creates FDA Consent Decree Resolution Opportunity',
      metric:         '72K annualized units; zero 483 observations Q1–Q2 FY26',
      change:         5.2,
      status:         'medium',
      insight:        'BD has achieved zero FDA 483 observations on Alaris manufacturing in Q1–Q2 FY2026, creating a credible pathway to petition the FDA for formal consent decree termination in Q1 FY2027, which would remove ~$300M/year in remediation costs.',
      drivers:        ['Zero 483 observations Q1–Q2 FY26', '32K deferred hospital backlog', '$145M remediation H1 on plan'],
      actions:        ['BD Regulatory Affairs to prepare formal petition timeline for consent decree termination'],
      relatedMetrics: { backlog: '32K units', remediation: '$145M H1', target: '120K+ units/year' },
      sortOrder:      2,
    },
    {
      category:       'Financial',
      businessOutcome:'Financial',
      title:          'FCF Conversion 96% — H1 FCF $1,420M Supports $1,500M Annual Debt Reduction Plan',
      metric:         'H1 FCF $1,420M; 96% conversion',
      change:         1.0,
      status:         'medium',
      insight:        'BD H1 FY26 FCF of $1,420M represents 96% conversion of adjusted net income — ahead of the 95% plan. Gross debt reduction of $750M in H1 is on track for the $1,500M annual plan.',
      drivers:        ['FCF conversion 96% vs 95% plan', 'DSO reduction in BioPharma Systems', 'Medical Essentials inventory normalization'],
      actions:        ['Evaluate H2 prepayment of additional $200M high-coupon debt to accelerate toward 2.7x leverage by FY26 year-end'],
      relatedMetrics: { fcf: '$1,420M H1', debtPaid: '$750M H1', leverage: '2.9x' },
      sortOrder:      3,
    },
    {
      category:       'Medical Essentials',
      businessOutcome:'Commercial',
      title:          'India Revenue +14% YoY — Strongest Single-Market Offset to China VoBP',
      metric:         '+14% YoY India growth',
      change:         14.0,
      status:         'medium',
      insight:        'BD India revenue grew +14% YoY in Q2 FY26, the single strongest market offset to China VoBP headwinds. Indian government hospital infrastructure investment is creating sustained demand for BD Medical Essentials at full market pricing.',
      drivers:        ['Government hospital infrastructure investment', 'Domestic manufacturing preferences', 'BD brand leadership in syringes / IV'],
      actions:        ['Evaluate incremental India commercial team investment; assess in-country assembly for government tender qualification'],
      relatedMetrics: { indiaGrowth: '+14% YoY', seAsia: '~$215M/quarter combined', vobpOffset: 'partial' },
      sortOrder:      4,
    },
    {
      category:       'Interventional',
      businessOutcome:'Commercial',
      title:          'Oncology +9% CC — Fastest-Growing Interventional Sub-Segment',
      metric:         '$420M oncology Q2 revenue (+9% CC)',
      change:         9.0,
      status:         'medium',
      insight:        'BD Interventional Oncology grew +9% CC in Q2 FY26 on biopsy system and ablation device demand, now the fastest-growing sub-segment within Interventional. Rising cancer screening rates and community hospital procedure adoption are structural tailwinds.',
      drivers:        ['Biopsy system volume growth', 'Ablation device adoption in community hospitals', 'Cancer screening rate increase'],
      actions:        ['Assess portfolio gaps in thermal ablation; evaluate tuck-in in laser ablation or EP-adjacent oncology'],
      relatedMetrics: { oncologyRev: '$420M Q2', pvGrowth: '+8% CC', totalIntl: '$1,406M Q2' },
      sortOrder:      5,
    },
    {
      category:       'FX',
      businessOutcome:'Financial',
      title:          'CC vs Reported Growth Gap 250bps — Investor Communication Opportunity',
      metric:         '+7.2% CC vs +4.7% reported Q2 FY26',
      change:         -2.5,
      status:         'low',
      insight:        'BD Q2 FY26 constant currency revenue growth of +7.2% vs reported growth of +4.7% — a 250bps differential from FX headwinds. BioPharma Systems EUR-denominated pharma contracts drive a higher CC premium than peers.',
      drivers:        ['EUR weakness vs USD', 'CNY translation headwind', '>60% BioPharma Systems Europe revenue in EUR'],
      actions:        ['Emphasize CC growth in Q3 earnings messaging; consider 3-year CC CAGR graphics in investor presentation'],
      relatedMetrics: { ccGrowth: '+7.2%', reported: '+4.7%', fxH1: '($116M)' },
      sortOrder:      6,
    },
  ];

  for (const bi of businessInsights) {
    await prisma.businessInsight.create({ data: { companyId, ...bi } });
  }
  console.log('  BD business insights seeded');

  // 7. Risk & Opportunity (4 items)
  const risksOpportunities = [
    {
      type:        'risk',
      title:       'China VoBP Escalation — Additional Wave Risk for Insulin Syringes',
      probability: 'Medium (35%)',
      impact:      '$75–100M additional VoBP headwind; Medical Essentials margin –1.5–2.5pp',
      mitigation:  'Accelerate premium product mix-shift in China to <50% VoBP-exposed revenue; redirect volume to India and SE Asia',
      action:      '',
      trend:       'increasing',
      sortOrder:   1,
    },
    {
      type:        'opportunity',
      title:       'GLP-1 Demand Upside — Volume Exceeds +20% if New Drug Launches Accelerate',
      probability: 'Medium (32%)',
      impact:      '$90–130M incremental BioPharma Systems revenue above plan',
      mitigation:  '',
      action:      'Pre-authorize capacity expansion to capture upside; accelerate engineering procurement for new PFS lines',
      trend:       'increasing',
      sortOrder:   2,
    },
    {
      type:        'opportunity',
      title:       'Alaris Consent Decree Resolution — $300M Cost Removal and Full Market Re-Entry',
      probability: 'High (65%)',
      impact:      '~$300M/year remediation cost elimination; 32K unit backlog release; $450M impairment reversal potential',
      mitigation:  '',
      action:      'BD Regulatory Affairs to prepare formal petition for consent decree termination targeting Q1 FY2027',
      trend:       'stable',
      sortOrder:   3,
    },
    {
      type:        'risk',
      title:       'FX Headwind Escalation — USD Strengthening Beyond $300M Plan Threshold',
      probability: 'Low (28%)',
      impact:      '$70–120M additional FX headwind above $230M plan; –0.3pp reported margin per $50M',
      mitigation:  'Increase EUR forward contract coverage to 70% for FY2027; accelerate local currency pricing initiatives',
      action:      '',
      trend:       'stable',
      sortOrder:   4,
    },
  ];

  for (const ro of risksOpportunities) {
    await prisma.riskOpportunity.create({ data: { companyId, ...ro } });
  }
  console.log('  BD risks & opportunities seeded');
  console.log('BD executive summary seed complete');
}
