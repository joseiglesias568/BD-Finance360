import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed Market Data, Competitors, and Regional Breakdown
//
// SOURCE: Becton, Dickinson and Company (BDX) — Q2 FY2026 earnings (May 2026),
// FY2025 10-K (filed Nov 2025), competitor public filings
// (MDT, ABT, SYK, BSX, BAX, ICUI).
// Regional breakdown maps to BD's 4-segment reporting structure:
// Medical Essentials, Connected Care, BioPharma Systems, Interventional.
// Geographic split approximately: U.S. 55%, International 45%.
// =============================================================================

export async function seedMarket(prisma: PrismaClient, companyId: number) {
  await prisma.marketData.create({
    data: {
      companyId,
      totalMarketSize: '$650B+ Global Medical Technology Addressable Market',
      companyMarketShare: 2.8,
      marketShareTarget: 3.0,
      marketShareYoY: 0.1,
      segmentGrowth: 5.2,
      marketDrivers: [
        'Global Aging Population Driving Hospital Procedure Volume (+3–4% annually)',
        'GLP-1 Injectable Drug Adoption Creating BioPharma Systems Demand ($65B+ GLP-1 market by 2030)',
        'Connected Care / Hospital Medication Management Digitization',
        'Emerging Market Hospital Infrastructure Investment (India, SE Asia, Middle East)',
        'Minimally Invasive Procedure Shift — Interventional Market Growth',
        'BD Alaris Return to Market — Recovering Installed Base',
        'Biosimilar and Complex Drug Delivery Systems Expansion',
        'Drug Shortage Risk Driving Hospital Preference for Reliable MedTech Suppliers',
      ],
      marketChallenges: [
        'China VBP (Volume-Based Procurement) Pricing Pressure — -9.8% FXN Q2 FY26',
        'BD Alaris Remediation Behind Schedule (78% vs 85% target)',
        'BioPharma Systems Order Lumpiness — Pharma Customer Inventory Destocking',
        'APM Integration Synergy Execution Risk',
        'FDA Warning Letters (2 Active) — Quality System Compliance',
        'Net Leverage 2.9x — Above 2.5x Target; Constrains Capital Return',
        'Adjusted Operating Margin Below Peer Median (24.2% vs 25–26%)',
        'Emerging Markets Growth Below Target (3.5% vs 5% FXN goal)',
      ],
    },
  });

  console.log('Seeded market data');

  await prisma.competitor.createMany({
    data: [
      {
        companyId,
        name: 'Medtronic (MDT)',
        marketShare: 5.0,
        yoyChange: -0.1,
        strengths: [
          'Largest dedicated MedTech company by revenue (~$32.4B FY2025)',
          'Strong infusion pump portfolio (MiniMed, hospital infusion) competing with BD Alaris',
          'Peripheral vascular leadership (IN.PACT Admiral DCB competes with BD Lutonix)',
          'Deep neurology, cardiac rhythm, and surgical robotics portfolio (Mazor)',
          'Global distribution scale and 85,000+ employee commercial reach',
        ],
      },
      {
        companyId,
        name: 'Abbott Laboratories (ABT)',
        marketShare: 3.5,
        yoyChange: 0.2,
        strengths: [
          'Diversified MedTech + diagnostics model (~$22.9B FY2025 revenue)',
          'Vascular devices (Xience, Navitor TAVR) competing in interventional space',
          'Point-of-care diagnostics (ID NOW, BinaxNOW) in hospital accounts BD also serves',
          'Libre continuous glucose monitor driving hospital relationship depth',
          'Strong emerging markets commercial infrastructure (competing in BD EM growth markets)',
        ],
      },
      {
        companyId,
        name: 'Stryker Corporation (SYK)',
        marketShare: 3.5,
        yoyChange: 0.3,
        strengths: [
          'Largest U.S. surgical instruments and equipment company (~$22.6B FY2025)',
          'Mako robotic surgery platform creating strong surgical suite relationships',
          'Patient handling, hospital beds, and ICU equipment compete in BD hospital accounts',
          'Medical (EMS, emergency, hospital beds) segment overlaps BD Connected Care customers',
          'Best-in-class commercial excellence model (BD Excellence Unleashed benchmark)',
        ],
      },
      {
        companyId,
        name: 'Boston Scientific (BSX)',
        marketShare: 2.6,
        yoyChange: 0.3,
        strengths: [
          'Peripheral vascular leadership (Ranger DCB, Jetstream atherectomy) — direct Lutonix competitor',
          'Urology portfolio (competing with BD Purewick in continence care)',
          'Interventional oncology and electrophysiology driving hospital account depth',
          'Rapid new product cycle and innovation pipeline — ~$17.2B FY2025 revenue',
          'Strong U.S. structural heart and electrophysiology position reduces BD Interventional share',
        ],
      },
      {
        companyId,
        name: 'Baxter International (BAX)',
        marketShare: 1.8,
        yoyChange: -0.3,
        strengths: [
          'BD\'s former APM segment customer base — Baxter Spectrum infusion pump installed base',
          'IV fluids and infusion therapy supply — hospital sourcing relationship competitor',
          'Hillrom (acquired 2021) patient monitoring overlaps BD HealthSight analytics',
          'Kidney care (Vantive spin-off 2024) creates focused hospital products division',
          'Pricing competition on commodity IV solutions and needleless connectors',
        ],
      },
      {
        companyId,
        name: 'ICU Medical (ICUI)',
        marketShare: 0.9,
        yoyChange: 0.1,
        strengths: [
          'Infusion systems competitor — Plum 360 infusion pump competes directly with BD Alaris',
          'Aggressive pricing strategy targeting hospitals during BD Alaris remediation window',
          'Critical care catheter and vascular access products compete with BD Medical Essentials',
          'Pure-play infusion focus allows faster product cycle vs. BD diversified portfolio',
          '~$5.8B FY2025 revenue — smaller but nimble competitor in BD core infusion market',
        ],
      },
    ],
  });

  console.log('Seeded 6 competitors');

  // BD segment and geographic breakdown. Revenue in $M (continuing ops, Q2 FY26).
  // Approximately 55% U.S. / 45% International (reported by BD management).
  await prisma.regionalBreakdown.createMany({
    data: [
      {
        companyId,
        region: 'Medical Essentials',
        revenue: 1647,
        growth: 5.2,  // reported growth Q2 FY26 YoY
        keyInsight:
          'BD Medical Essentials Q2 FY26 revenue $1,647M — largest segment by volume. Core products: BD Vacutainer blood collection, BD Nexiva IV catheter, BD PosiFlush prefilled syringe. FXN organic growth +1.7%, pressured by China VBP pricing on needles/syringes (-9.8% China FXN). U.S. market stable with hospital volume recovery; international emerging markets gaining traction (+3.5% FXN ex-China). Manufacturing Gross Productivity Improvement (GPI) +8.2% is above +8.0% target — offsetting VBP pricing pressure through cost efficiency. OTIF service level 93% vs. 95% target requires supply chain improvement.',
      },
      {
        companyId,
        region: 'Connected Care',
        revenue: 1120,
        growth: 5.5,  // reported growth including APM full-year vs partial prior year
        keyInsight:
          'BD Connected Care Q2 FY26 revenue $1,120M — includes full APM (Hospital Products) contribution. BD Alaris infusion system return-to-market: 78% complete (3,120 of 4,000 target hospital accounts). Alaris FXN organic growth +3.2% — below +5.0% target; limited by remediation pace and competitive displacement during warning letter period. New product: HemoSphere Stream Module launched Q2 FY26, adds non-invasive cardiac output monitoring capability. APM integration: Pyxis dispensing cabinets cross-sell to Alaris accounts progressing — $45M synergies realized vs. $80M H1 target. BD HealthSight analytics deployed in 180+ health systems, creating EMR integration competitive moat.',
      },
      {
        companyId,
        region: 'BioPharma Systems',
        revenue: 590,
        growth: 2.6,  // reported Q2 FY26 YoY (negative FXN organic, but FX tailwind)
        keyInsight:
          'BD BioPharma Systems Q2 FY26 revenue $590M — FXN organic growth -1.8% due to pharmaceutical customer inventory destocking cycle. Hypak prefillable syringe platform remains the market-leading drug delivery system with >25% global market share in prefillable glass syringes. Key strategic focus: GLP-1 drug delivery platform — 3 pharmaceutical partner agreements signed for semaglutide/tirzepatide delivery systems; $200M+ annual revenue opportunity at full scale (FY2028). BPS revenue is inherently lumpy — single large pharma customer orders can shift quarterly revenue by $100M+. Recovery expected H2 FY26 as pharma customer ordering patterns normalize.',
      },
      {
        companyId,
        region: 'Interventional',
        revenue: 1357,
        growth: 7.4,  // reported growth Q2 FY26
        keyInsight:
          'BD Interventional Q2 FY26 revenue $1,357M — fastest-growing BD segment at +5.3% FXN organic. Three sub-units performing above BD average: Surgery ($1,572M FY25, new Avitene Flowable hemostatic Q1 FY26 launch), Peripheral Intervention ($1,996M FY25, Lutonix DCB procedure growth +7.2%), Urology & Critical Care ($1,649M FY25, BD Purewick >35% U.S. market share). Interventional\'s higher-margin profile (approx. 25.3% adj. operating margin Q2 FY26) and faster organic growth make it BD\'s most attractive segment for targeted investment. HemoSphere hemodynamic monitoring (launching in Interventional surgical suites) extends the segment\'s connected care capabilities.',
      },
    ],
  });

  console.log('Seeded 4 regional breakdowns');
}
