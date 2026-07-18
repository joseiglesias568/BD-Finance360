import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed Strategic Initiatives, Risk Items, Forward Outlook, Key Opportunities
//
// SOURCE: Becton, Dickinson and Company (BDX) — Q2 FY2026 earnings (May 2026),
// FY2025 10-K (filed Nov 2025), investor conferences, and public guidance.
//
// BD "Excellence Unleashed" strategic framework — three pillars:
//   Compete: Commercial Excellence, new vertical business unit model, Chief Revenue Officer
//   Innovate: Pipeline acceleration, GLP-1 delivery, HemoSphere, Avitene, Alaris return
//   Deliver: $200M cost-out program, supply chain transformation, margin expansion
// Plus: Waters spin-off capital allocation ($2B debt paydown), China mitigation strategy.
// FY2026 adj. diluted EPS guidance: $13.00–$13.20 (full year continuing ops).
// =============================================================================

export async function seedStrategic(prisma: PrismaClient, companyId: number) {
  // ── Strategic Initiatives ─────────────────────────────────────────────────

  const commercialExcellence = await prisma.strategicInitiative.create({
    data: {
      companyId,
      externalId: 'compete-commercial-excellence',
      name: 'Commercial Excellence — BD Excellence Deployed to Sales Org',
      description:
        'BD is deploying the BD Excellence management system to its commercial organization as part of the "Compete" pillar of Excellence Unleashed. Key elements: (1) new vertical business unit model replacing the legacy geography-first organization — now organized around hospital, health system, and government segments; (2) Chief Revenue Officer role established to drive commercial accountability and KPI discipline; (3) BD Excellence sales methodology deployment with structured opportunity management, win/loss analysis, and channel partner optimization. Q2 FY26 status: 45% of commercial organization deployed. Target: 80% by end of FY2026. Expected impact: +100–150bps organic FXN revenue growth improvement by FY2027 as commercial model drives share gains in key accounts. BD benchmark: peer MedTech companies that deployed similar commercial models (e.g., Stryker) saw 200–300bps sustained organic growth improvement within 2–3 years.',
      status: 'in-progress',
      budget: 280,
      spent: 126,
      progress: 45,
    },
  });

  await prisma.initiativeMilestone.createMany({
    data: [
      { initiativeId: commercialExcellence.id, name: 'Chief Revenue Officer Appointed', date: '2025-10-01', status: 'completed' },
      { initiativeId: commercialExcellence.id, name: 'Q2 FY26 — 45% Commercial Org Deployed', date: '2026-03-31', status: 'completed' },
      { initiativeId: commercialExcellence.id, name: 'Q4 FY26 — 80% Deployment Target', date: '2026-09-30', status: 'in-progress' },
      { initiativeId: commercialExcellence.id, name: 'FY2027 — Full Commercial Excellence Operating Model', date: '2027-09-30', status: 'planned' },
    ],
  });

  await prisma.initiativeKPI.createMany({
    data: [
      { initiativeId: commercialExcellence.id, label: 'Commercial Org Deployment', target: '80% by Q4 FY26', actual: '45% Q2 FY26', status: 'warning' },
      { initiativeId: commercialExcellence.id, label: 'BD Organic FXN Growth', target: '+3.5%+ by FY27', actual: '+2.6% Q2 FY26', status: 'warning' },
    ],
  });

  const pipelineAcceleration = await prisma.strategicInitiative.create({
    data: {
      companyId,
      externalId: 'innovate-pipeline-acceleration',
      name: 'Pipeline Acceleration — GLP-1 Platform, HemoSphere, Avitene',
      description:
        'BD "Innovate" pillar focuses on accelerating near-term product launches and positioning the pipeline for long-term organic growth above industry average. Key programs in FY2026: (1) GLP-1 delivery platform — BD has won contracts with 3 pharmaceutical partners (target 5) to supply prefillable syringes and auto-injector components for semaglutide and tirzepatide GLP-1 drugs; expected to contribute $200M+ incremental BioPharma Systems revenue annually by FY2028 as GLP-1 market scales; (2) HemoSphere Stream Module — launched Q2 FY26 within Connected Care; extends BD\'s hemodynamic monitoring platform with non-invasive cardiac output monitoring; targets 2,000+ additional ICU placements; (3) Avitene Flowable hemostatic agent — launched Q1 FY26 in BD Interventional Surgery; addresses $450M U.S. market for biocompatible hemostatic products; (4) BD Alaris Gen 2 platform — development underway for FY2027–FY2028 launch; will include cloud-connected drug library management and enhanced safety software. Pipeline vitality target: >20% of revenue from new products by FY2027.',
      status: 'on-track',
      budget: 650,
      spent: 385,
      progress: 60,
    },
  });

  await prisma.initiativeMilestone.createMany({
    data: [
      { initiativeId: pipelineAcceleration.id, name: 'Avitene Flowable Launched — Q1 FY26', date: '2025-12-31', status: 'completed' },
      { initiativeId: pipelineAcceleration.id, name: 'HemoSphere Stream Module Launched — Q2 FY26', date: '2026-03-31', status: 'completed' },
      { initiativeId: pipelineAcceleration.id, name: 'GLP-1 Platform: 3 Partners Live, Expanding to 5', date: '2026-09-30', status: 'in-progress' },
      { initiativeId: pipelineAcceleration.id, name: 'BD Alaris Gen 2 Dev Complete — FY2027', date: '2027-09-30', status: 'planned' },
    ],
  });

  await prisma.initiativeKPI.createMany({
    data: [
      { initiativeId: pipelineAcceleration.id, label: 'New Product Revenue Vitality', target: '>20% by FY27', actual: '18% Q2 FY26', status: 'warning' },
      { initiativeId: pipelineAcceleration.id, label: 'GLP-1 Partner Wins', target: '5 partners by FY27', actual: '3 partners active', status: 'warning' },
    ],
  });

  const costOut = await prisma.strategicInitiative.create({
    data: {
      companyId,
      externalId: 'deliver-200m-cost-out',
      name: '$200M Cost-Out Program — BD Excellence "Deliver" Pillar',
      description:
        'BD is executing a $200M cost-out / gross productivity improvement program as the financial backbone of the Excellence Unleashed "Deliver" pillar. The program targets: (1) manufacturing efficiency — $80M through lean manufacturing, automation, and plant network optimization; (2) procurement savings — $60M through supplier consolidation, raw material renegotiation, and strategic sourcing; (3) SG&A efficiency — $40M through span-of-control improvements, shared services expansion, and real estate consolidation; (4) supply chain optimization — $20M through inventory reduction and distribution network efficiency. Q2 FY26 status: $150M run-rate achieved (75% complete). Full $200M run-rate expected by Q2 FY27. Cost-out savings are critical to supporting BD\'s adjusted operating margin expansion target of 25.5% by FY2027 — a 130bps improvement from Q2 FY26 level of 24.2%.',
      status: 'on-track',
      budget: 200,
      spent: 150,
      progress: 75,
    },
  });

  await prisma.initiativeMilestone.createMany({
    data: [
      { initiativeId: costOut.id, name: 'Q2 FY26 — $150M Run-Rate Achieved (75%)', date: '2026-03-31', status: 'completed' },
      { initiativeId: costOut.id, name: 'Q4 FY26 — $175M Run-Rate Target', date: '2026-09-30', status: 'in-progress' },
      { initiativeId: costOut.id, name: 'Q2 FY27 — $200M Full Run-Rate Complete', date: '2027-03-31', status: 'planned' },
    ],
  });

  await prisma.initiativeKPI.createMany({
    data: [
      { initiativeId: costOut.id, label: 'Cost-Out Run-Rate ($M)', target: '$200M by Q2 FY27', actual: '$150M Q2 FY26 (75%)', status: 'good' },
      { initiativeId: costOut.id, label: 'Adj. Operating Margin', target: '25.5% by FY27', actual: '24.2% Q2 FY26', status: 'warning' },
    ],
  });

  const debtReduction = await prisma.strategicInitiative.create({
    data: {
      companyId,
      externalId: 'capital-allocation-debt-reduction',
      name: 'Debt Reduction to 2.5x Net Leverage — Capital Allocation Priority',
      description:
        'Following the Waters Corporation spin-off in February 2026 and the APM acquisition in September 2024, BD is prioritizing debt reduction as its primary capital allocation goal. The Waters spin-off generated approximately $2.0B in proceeds which were applied to long-term debt paydown in Q2 FY26. BD\'s net leverage ratio as of Q2 FY26 (March 31, 2026) is 2.9x — down from 3.1x at Q2 FY25 but still above the 2.5x target. Long-term debt at September 30, 2025: $16,622M. BD total assets: $55,325M; goodwill: $26,612M. Strategy: apply free cash flow ($2,600–$2,800M annually) primarily to debt paydown until 2.5x is reached. Post-2.5x: resume opportunistic share repurchases and potential bolt-on MedTech M&A in Interventional or BioPharma Systems. Each $500M debt reduction ≈ -0.05x leverage and ~$18M interest expense reduction annually.',
      status: 'in-progress',
      budget: 2000,
      spent: 2000,
      progress: 40,
    },
  });

  await prisma.initiativeMilestone.createMany({
    data: [
      { initiativeId: debtReduction.id, name: 'Waters Spin-Off — $2B Debt Paydown Applied Q2 FY26', date: '2026-02-28', status: 'completed' },
      { initiativeId: debtReduction.id, name: 'Q4 FY26 — Net Leverage Target 2.7x', date: '2026-09-30', status: 'in-progress' },
      { initiativeId: debtReduction.id, name: 'FY2027 — Net Leverage 2.5x Target', date: '2027-09-30', status: 'planned' },
    ],
  });

  await prisma.initiativeKPI.createMany({
    data: [
      { initiativeId: debtReduction.id, label: 'Net Leverage Ratio', target: '2.5x by FY2027', actual: '2.9x Q2 FY26', status: 'warning' },
      { initiativeId: debtReduction.id, label: 'Annual FCF for Debt Paydown', target: '$1.8B+/yr', actual: '$2,670M FY25 FCF', status: 'good' },
    ],
  });

  const chinaStrategy = await prisma.strategicInitiative.create({
    data: {
      companyId,
      externalId: 'china-mitigation-strategy',
      name: 'China VBP Mitigation — Emerging Markets Offset Strategy',
      description:
        'China Volume-Based Procurement (VBP) policies are placing significant pricing pressure on BD\'s core Medical Essentials products in China, including needles, syringes, and IV catheters. Q2 FY26 China FXN growth: -9.8% vs. -5.0% target. BD is executing a three-part mitigation strategy: (1) Medical Essentials pricing — navigating VBP bid cycles with minimum viable pricing while protecting gross margin through manufacturing cost efficiency; (2) Portfolio diversification in China — shifting China hospital customer relationships toward higher-value Interventional and Connected Care products not subject to current VBP cycles; (3) Emerging market offset — accelerating growth in India (+8% FXN target), Southeast Asia, Middle East, and Africa to replace China growth shortfall. BD China revenue represents approximately 8–10% of total BD revenue. The -9.8% FXN trajectory implies a $120–150M annual revenue headwind vs. pre-VBP base. BD expects China VBP headwind to moderate to -3% to -5% FXN by FY2028 as new VBP cycles stabilize.',
      status: 'in-progress',
      budget: 180,
      spent: 55,
      progress: 30,
    },
  });

  await prisma.initiativeMilestone.createMany({
    data: [
      { initiativeId: chinaStrategy.id, name: 'China Interventional Sales Force Expansion', date: '2026-03-31', status: 'completed' },
      { initiativeId: chinaStrategy.id, name: 'Q4 FY26 — China FXN Trend Target -5%', date: '2026-09-30', status: 'in-progress' },
      { initiativeId: chinaStrategy.id, name: 'FY2027 — Emerging Markets Offset: +$200M vs China Headwind', date: '2027-09-30', status: 'planned' },
    ],
  });

  await prisma.initiativeKPI.createMany({
    data: [
      { initiativeId: chinaStrategy.id, label: 'China FXN Revenue Growth', target: '-5.0% full-year FY26', actual: '-9.8% Q2 FY26', status: 'danger' },
      { initiativeId: chinaStrategy.id, label: 'Emerging Markets FXN Growth', target: '+5.0%', actual: '+3.5% Q2 FY26', status: 'warning' },
    ],
  });

  console.log('Seeded 5 strategic initiatives with milestones and KPIs');

  // ── Risk Items ──────────────────────────────────────────────────────────

  await prisma.riskItem.createMany({
    data: [
      {
        companyId,
        externalId: 'china-vbp-escalation',
        category: 'Commercial',
        title: 'China VBP Price Escalation — Medical Essentials Headwind',
        description:
          'China\'s National Healthcare Security Administration (NHSA) Volume-Based Procurement program is systematically reducing prices for high-volume medical devices including needles, syringes, IV catheters, and blood collection tubes — BD\'s core Medical Essentials products. China represents ~8–10% of BD total revenue. Additional VBP rounds covering BD products in interventional or Connected Care categories would compound the headwind beyond current -9.8% FXN trajectory.',
        severity: 'high',
        likelihood: 'high',
        impact:
          'Current China VBP headwind: approximately -$150M annual revenue. A second VBP round covering Interventional (BD Lutonix, peripheral intervention) would add approximately -$80–100M additional annual revenue headwind. Each additional -5% China FXN ≈ -$50M revenue and -$12M adjusted operating income.',
        mitigation:
          'Portfolio diversification to higher-value Interventional/Connected Care in China; manufacturing cost reduction to maintain margin at VBP prices; emerging markets growth to offset China revenue decline; China local production for domestic pricing compliance',
        owner: 'Asia Pacific Regional President / Medical Essentials Business Unit',
      },
      {
        companyId,
        externalId: 'alaris-remediation-delay',
        category: 'Operational',
        title: 'BD Alaris Remediation Behind Schedule — FDA Compliance Risk',
        description:
          'BD Alaris return-to-market remediation is 78% complete vs. 85% target as of Q2 FY26. The program requires site-by-site software validation, drug library updates, and clinical specialist support at 4,000+ U.S. hospital accounts. Delays beyond FDA-committed milestones could result in FDA enforcement action, restrictions on Alaris sales, or reputational damage at hospital customer accounts that reduces Alaris renewal rates.',
        severity: 'high',
        likelihood: 'low',
        impact:
          'If FDA issues a second Warning Letter due to remediation delays, BD Alaris new sales could be restricted — a potential -$400–600M annual Connected Care revenue impact. Failure to complete remediation by end of FY2026 would signal execution risk to investors and could cause hospital customers to accelerate competitive evaluation of Baxter and ICU Medical alternatives.',
        mitigation:
          'Increased clinical specialist headcount; hospital IT scheduling task force; weekly FDA progress reporting; contingency hospital scheduling software to compress 2H FY26 timeline',
        owner: 'Connected Care Business Unit / Chief Medical Officer',
      },
      {
        companyId,
        externalId: 'bps-customer-concentration',
        category: 'Commercial',
        title: 'BioPharma Systems Customer Concentration & Order Lumpiness',
        description:
          'BD BioPharma Systems relies on a concentrated pharma/biotech customer base for prefillable syringe and drug delivery systems orders. Top 5 BPS customers represent approximately 45% of segment revenue. Large annual supply agreements result in lumpy quarterly ordering patterns — BPS revenue can swing ±$100M quarter to quarter based on pharmaceutical partner production schedules and inventory buffers. Q2 FY26 BPS at -1.8% FXN reflects customer inventory correction cycle.',
        severity: 'medium',
        likelihood: 'medium',
        impact:
          'A large BPS customer inventory destocking cycle (as seen in FY2024) can reduce BPS quarterly revenue by $100–150M, pushing segment FXN growth from +3% to -5%. A loss of a top-3 BPS pharma customer relationship could reduce BPS annual revenue by $150–250M.',
        mitigation:
          'GLP-1 delivery platform diversification (3+ new partners); contract terms with minimum annual purchase commitments; supply chain visibility program with top 5 BPS customers; multi-year supply agreements with GLP-1 drug manufacturers',
        owner: 'BioPharma Systems President / Commercial',
      },
      {
        companyId,
        externalId: 'apm-integration-synergies',
        category: 'Financial',
        title: 'APM (Alarm Management) Integration Synergy Realization Risk',
        description:
          'BD acquired the Hospital Products Division from Baxter International (APM — medication management, infusion systems) in September 2024 for approximately $4.0B. Integration synergies target $250M by FY2027 through cross-selling Alaris + Pyxis to APM customer base, eliminating duplicate back-office functions, and rationalizing product portfolios. Q2 FY26 synergy realization: $45M of $80M H1 target — below plan. Integration complexity includes migrating APM onto BD ERP systems, retaining APM commercial talent, and managing customer communication during transition.',
        severity: 'medium',
        likelihood: 'medium',
        impact:
          'Each $25M synergy shortfall vs. plan = -$0.09/share adj. EPS. Full integration delay of 2 years beyond plan would defer $150M+ cumulative synergies, requiring BD to hold higher leverage ratio for longer. APM revenue attrition risk during integration: customer churn to ICU Medical or Baxter replacements if service quality drops.',
        mitigation:
          'Dedicated APM integration management office; commercial retention incentives for APM sales force; customer success team for top 200 APM accounts; monthly synergy tracking vs. financial plan',
        owner: 'CFO / SVP Integration Management Office',
      },
      {
        companyId,
        externalId: 'fda-warning-letters',
        category: 'Regulatory',
        title: 'FDA Warning Letters — 2 Active Letters, Quality System Risk',
        description:
          'BD currently has 2 active FDA Warning Letters (Q2 FY26) — one related to BD Alaris device manufacturing quality systems and one related to a Medical Essentials production facility. Each Warning Letter can restrict product launches from affected facilities, require third-party quality system auditors, and triggers heightened FDA inspection activity across BD\'s global manufacturing network. Warning Letters also create customer perception risk — hospital GPO contracts sometimes require Warning Letter-free status.',
        severity: 'high',
        likelihood: 'low',
        impact:
          'Active Warning Letters restrict new product approvals from affected facilities. BD Alaris Gen 2 development timeline depends on clearing the Alaris-related Warning Letter before FY2027 launch. A Consent Decree (escalation from Warning Letter) would require independent certification of quality systems and could restrict affected facility shipments — a potential -$200–400M revenue impact.',
        mitigation:
          'FDA Consent Decree avoidance program; CAPA (Corrective and Preventive Action) management; third-party Quality Management System audit; senior executive FDA relationship management; proactive FDA communication on remediation progress',
        owner: 'Chief Quality Officer / VP Regulatory Affairs',
      },
      {
        companyId,
        externalId: 'glp1-delivery-platform-competition',
        category: 'Commercial',
        title: 'GLP-1 Drug Delivery Platform — Competitive Win Rate Risk',
        description:
          'The GLP-1 drug delivery market (semaglutide/tirzepatide injectable devices, auto-injectors, prefillable syringes) represents a significant growth opportunity for BD BioPharma Systems. However, German-listed Gerresheimer AG, Schott Pharma, and Stevanato Group are also aggressively pursuing GLP-1 supply contracts. BD has won 3 pharma partner agreements; target is 5 by FY2027. If BD fails to secure preferred supplier status with the top 3 GLP-1 drug manufacturers (Novo Nordisk, Eli Lilly, Sanofi), the long-term BPS revenue opportunity would be reduced.',
        severity: 'medium',
        likelihood: 'medium',
        impact:
          'Each GLP-1 partnership win represents approximately $60–100M annual incremental BPS revenue at scale (2027–2029). Missing the 5-partner target and achieving only 3–4 partners = -$60–200M annual BPS revenue vs. plan by FY2028.',
        mitigation:
          'Dedicated GLP-1 commercial development team; technology differentiation (Intevia auto-injector, BD Uniject platform); long-term supply security commitments to pharma partners; regulatory pathway support for GLP-1 combination products',
        owner: 'BioPharma Systems President / Business Development',
      },
    ],
  });

  console.log('Seeded 6 risk items');

  // ── Forward Outlook ───────────────────────────────────────────────────
  // Revenue in $M (continuing operations). Based on BD FY2026 guidance and estimates.

  await prisma.forwardOutlook.createMany({
    data: [
      {
        companyId,
        period: 'Q3 FY26',
        revenueForecast: 4800,
        revenuePlan: 4820,
        marginForecast: 24.5,
        marginPlan: 25.0,
        keyAssumptions: [
          'Interventional seasonal strength Q3',
          'BD Alaris remediation continued progress to 88%',
          'BioPharma Systems order timing recovery expected',
          'China FXN trend improves to -7% from -9.8%',
        ],
      },
      {
        companyId,
        period: 'Q4 FY26',
        revenueForecast: 4900,
        revenuePlan: 4950,
        marginForecast: 24.8,
        marginPlan: 25.2,
        keyAssumptions: [
          'Cost-out program at $175M run-rate',
          'Emerging markets growth accelerating to +5% FXN',
          'BioPharma Systems H2 recovery as pharma restocking',
          'FX tailwind moderating in Q4',
        ],
      },
      {
        companyId,
        period: 'Q1 FY27',
        revenueForecast: 4600,
        revenuePlan: 4650,
        marginForecast: 24.2,
        marginPlan: 25.0,
        keyAssumptions: [
          'Seasonally lighter Q1 for Interventional',
          'BD Alaris Gen 2 development investment increases Q1 R&D',
          'Commercial Excellence model fully deployed (100%)',
          'GLP-1 delivery platform ramp beginning',
        ],
      },
      {
        companyId,
        period: 'Q2 FY27',
        revenueForecast: 4900,
        revenuePlan: 4950,
        marginForecast: 25.2,
        marginPlan: 25.5,
        keyAssumptions: [
          '$200M cost-out program at full run-rate',
          'BD net leverage 2.5x target achieved',
          'GLP-1 platform contributing $50M+ quarterly',
          'China VBP trend stabilizes at -5% FXN',
        ],
      },
      {
        companyId,
        period: 'Q3 FY27',
        revenueForecast: 5000,
        revenuePlan: 5050,
        marginForecast: 25.5,
        marginPlan: 25.8,
        keyAssumptions: [
          'New product revenue >20% of total (innovation target achieved)',
          'Interventional at mid-to-high single digit organic growth',
          'APM integration synergies at $200M+ run-rate',
          'Share repurchase program may resume at 2.5x leverage',
        ],
      },
      {
        companyId,
        period: 'Q4 FY27',
        revenueForecast: 5100,
        revenuePlan: 5150,
        marginForecast: 25.8,
        marginPlan: 26.0,
        keyAssumptions: [
          'BD Alaris Gen 2 launch in pilot phase',
          'BioPharma Systems above 3% FXN on GLP-1 ramp',
          'Double-digit adj. EPS growth target achieved',
          'Free cash flow $2,900M+ to fund capital return',
        ],
      },
    ],
  });

  console.log('Seeded 6 forward outlook periods');

  // ── Key Opportunities ─────────────────────────────────────────────────

  await prisma.keyOpportunity.createMany({
    data: [
      {
        companyId,
        title: 'GLP-1 Drug Delivery Platform — $500M+ BioPharma Systems Opportunity',
        revenueImpact: '$200M–$500M incremental BPS revenue by FY2028 at 5 partner wins',
        description:
          'GLP-1 receptor agonists (Ozempic, Wegovy, Mounjaro, Zepbound) are the fastest-growing drug category globally, with Novo Nordisk and Eli Lilly each committing to multi-billion dollar manufacturing expansion. BD BioPharma Systems is positioned to supply prefillable syringes (Hypak platform) and auto-injectors (Intevia 1mL and 2.25mL) as the primary delivery device components for GLP-1 injectable drugs. BD has secured supply agreements with 3 pharmaceutical partners; target is 5 by FY2027. At full scale (2028), BD GLP-1 delivery platform revenue could contribute $200–500M annually to BPS, reversing the segment\'s current -1.8% FXN growth to +5%+ by FY2028. Competitive moat: BD\'s clean manufacturing, regulatory filing support, and scale make it a preferred partner for GLP-1 drug launch timelines.',
        timeline: 'FY2026–FY2028',
      },
      {
        companyId,
        title: 'BD Alaris Return to Market — $400M Connected Care Revenue Recovery',
        revenueImpact: '$400M+ Connected Care annual revenue recovery as installed base restores to pre-warning letter level',
        description:
          'BD Alaris voluntary field correction (2021–2023) and subsequent return-to-market program is recovering the Alaris installed base. Pre-warning letter, BD Alaris had >4,500 U.S. hospital accounts; the correction and sales restriction cost BD approximately 600–800 accounts. With 510(k) clearance secured (May 2023), BD is systematically re-engaging lapsed accounts. Each 200 additional Alaris hospital accounts recovered ≈ $80M annual Connected Care revenue (hardware + software + consumable attach rate). Full account recovery by FY2028 represents a $400M+ revenue opportunity. Additionally, BD Alaris Gen 2 launch (planned FY2027) will refresh the installed base and drive competitive displacement vs. Baxter Spectrum and ICU Medical Plum 360.',
        timeline: 'FY2026–FY2028',
      },
      {
        companyId,
        title: 'BD Interventional — Purewick & Lutonix Market Share Expansion',
        revenueImpact: '$150M+ incremental Interventional revenue from market share gains in UCC and PI',
        description:
          'BD Interventional has two high-growth product platforms with strong competitive positioning. BD Purewick external urinary catheter: currently >35% U.S. UCC market share; growing +HSD as hospitals adopt for both male and female patients. Purewick reduces catheter-associated UTI rates (CAUTI) and nursing time, driving rapid hospital adoption; the category is expanding from ICU to general med/surg floors. BD Lutonix drug-coated balloon: leading position in peripheral artery disease (PAD) treatment; U.S. Lutonix procedure growth +7.2% YoY. Lutonix competing for share vs. Medtronic IN.PACT Admiral in a market growing 8–10% annually as PAD diagnosis rates increase in aging population. Together, these two platforms have $150M+ incremental revenue opportunity through FY2027 at current growth trajectories.',
        timeline: 'FY2026–FY2027',
      },
      {
        companyId,
        title: 'APM (Hospital Products) Cross-Sell Synergies — $250M Integrated Platform',
        revenueImpact: '$250M integrated platform revenue from cross-selling Alaris + Pyxis + HealthSight to APM customer base',
        description:
          'BD\'s acquisition of Baxter Hospital Products Division (APM, September 2024) brought BD Pyxis medication dispensing cabinets, BD Alaris infusion pumps, and BD HealthSight analytics under a single customer relationship framework for the first time. APM has ~3,800 U.S. hospital accounts; BD Alaris has ~4,000; overlap is approximately 2,200 shared accounts. Cross-selling BD Pyxis to 1,600 Alaris-only accounts and BD Alaris to 1,600 APM-only accounts represents a $120M incremental annual revenue opportunity. HealthSight analytics upsell to the combined base adds $60M+. Integrated medication management (Pyxis dispense + Alaris infusion + HealthSight analytics) creates a comprehensive "closed-loop medication management" solution that is BD\'s key competitive differentiation vs. Medtronic and ICU Medical.',
        timeline: 'FY2026–FY2027',
      },
      {
        companyId,
        title: 'Waters Spin-Off Capital Unlock — Deleveraging to 2.5x Enables M&A Optionality',
        revenueImpact: '$500M–$2B bolt-on M&A capacity by FY2027 once 2.5x leverage achieved',
        description:
          'Waters Corporation spin-off (February 2026) simplified BD\'s portfolio to focus on MedTech and applied $2.0B to debt reduction. Once BD reaches 2.5x net leverage (FY2027 target), the company will have significant capital allocation flexibility: (1) resume share buyback program (approximately $300–500M/year based on 3–4% float); (2) pursue bolt-on MedTech acquisitions in strategic adjacencies (BioPharma Systems delivery systems, Interventional procedural platforms, Connected Care software/analytics); (3) increase dividend. BD targets acquisitions in the $500M–$2B range that are immediately accretive to organic growth in existing segments. Primary M&A focus areas: minimally invasive surgery tools, catheter-based interventional platforms, and pharmaceutical delivery systems (GLP-1 adjacency).',
        timeline: 'FY2027–FY2028',
      },
    ],
  });

  console.log('Seeded 5 key opportunities');
}
