import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed Commentary: BD Executive Commentary
// Thomas E. Polen — CEO, Christopher J. DelOrefice — CFO
//
// Commentary records are linked to ConsoleDriver records via findFirst() lookups.
// Driver names MUST exactly match the parent driver names defined in
// 12-business-consoles.ts. Commentary covers Q2 FY26 actuals and Q3-Q4 FY26
// forward-looking perspective.
//
// BD FY ends September 30. BD segments:
//   Medical Essentials | Connected Care | BioPharma Systems | Interventional
// =============================================================================

export async function seedCommentary(prisma: PrismaClient, companyId: number) {
  console.log('  Seeding BD executive commentary...');

  // Delete existing records before creating new ones
  await prisma.commentary.deleteMany({ where: { companyId } });

  // ─── Helper: resolve driver ID from name (defined in 12-business-consoles.ts) ──

  async function getDriverId(driverName: string): Promise<number | null> {
    const driver = await prisma.consoleDriver.findFirst({
      where: { name: driverName, console: { companyId } },
      select: { id: true },
    });
    if (!driver) {
      console.warn(`  WARNING: ConsoleDriver "${driverName}" not found for companyId=${companyId}`);
    }
    return driver?.id ?? null;
  }

  // ─── Pre-resolve all driver IDs ──────────────────────────────────────────

  const [
    glp1DriverId,
    alarisDriverId,
    chinaVobpDriverId,
    fxTranslationDriverId,
    leverageDriverId,
    fcfDriverId,
    epsDriverId,
    interventionalDriverId,
    biopharmaCapacityDriverId,
    interestDriverId,
    mmsDriverId,
    capexDriverId,
    internationalMixDriverId,
    usVolumeDriverId,
  ] = await Promise.all([
    getDriverId('GLP-1 Drug Delivery Demand'),
    getDriverId('Alaris Infusion Pump Recovery'),
    getDriverId('China VoBP Headwind Management'),
    getDriverId('FX Translation Impact'),
    getDriverId('Leverage & Debt Reduction'),
    getDriverId('Free Cash Flow & Capital Returns'),
    getDriverId('EPS & Guidance Delivery'),
    getDriverId('Interventional Procedure Growth'),
    getDriverId('BioPharma Capacity Expansion'),
    getDriverId('Interest Expense & Cost of Capital'),
    getDriverId('Smart Medication Management (MMS) Growth'),
    getDriverId('Capital Expenditure Management'),
    getDriverId('International Revenue Mix'),
    getDriverId('U.S. Medical Essentials Volume Growth'),
  ]);

  // ─── Commentary records ───────────────────────────────────────────────────

  const commentaryRecords = [

    // ── EPS & Guidance Delivery ───────────────────────────────────────────────
    {
      driverId:       epsDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Christopher J. DelOrefice',
      authorRole:    'CFO',
      commentaryType: 'review',
      title:          'H1 FY26 EPS Delivery: On Track to Guidance Midpoint',
      content:
        'BD delivered H1 FY26 adjusted EPS of $6.85, representing approximately 54% of the $12.52-$12.72 full-year guidance range midpoint of $12.62. Q2 FY26 adjusted EPS of $3.50 represents 4.5% growth over Q2 FY25, driven by BioPharma Systems outperformance (+19% GLP-1 CC growth), continued Alaris ramp (+20% unit volume YoY), and operational leverage on SG&A. The $450M non-cash goodwill impairment in Connected Care had no impact on adjusted EPS. We reaffirm our FY2026 guidance range of $12.52-$12.72 adjusted EPS. H2 requires adjusted EPS of approximately $5.67-$5.87, implying a run-rate of $2.84-$2.94 per quarter in Q3-Q4. We expect Q3 to be slightly below Q2 on a seasonal basis (hospital capital cycle, Alaris summer order patterns) before a stronger Q4 exit driven by full Alaris ramp and BioPharma year-end demand.',
      status:         'approved',
      tags:           ['EPS', 'guidance', 'H1 FY26', 'FY26 outlook', 'financial performance'],
    },

    // ── GLP-1 Drug Delivery Demand ────────────────────────────────────────────
    {
      driverId:       glp1DriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Christopher J. DelOrefice',
      authorRole:    'CFO',
      commentaryType: 'review',
      title:          'BioPharma Systems GLP-1: 88% PFS Capacity Requires Immediate Expansion Decision',
      content:
        'BioPharma Systems posted Q2 FY26 revenue of approximately $1,180M, representing 19% constant-currency growth driven entirely by GLP-1 prefillable syringe (PFS) volumes. PFS capacity utilization reached 88% in Q2 versus our 84% planning assumption — a 400-basis-point beat that creates both an opportunity and an operational risk. At 88% utilization, delivery lead times to Novo Nordisk and Eli Lilly are extending toward 14-16 weeks, approaching the 18-week threshold beyond which customers begin dual-sourcing. We are requesting board authorization for a capacity expansion program of $1.2-1.5B in capex spanning FY2027-FY2028, targeting 35-40% additional PFS capacity through greenfield investment at our North Carolina and Ireland sites. Without this authorization, BioPharma Systems growth will be capacity-constrained in H2 FY27, capping the segment at approximately $5.2B vs. our $6.0B+ FY2029 target.',
      status:         'approved',
      tags:           ['GLP-1', 'PFS', 'BioPharma Systems', 'capacity', 'growth'],
    },

    // ── Alaris Infusion Pump Recovery ─────────────────────────────────────────
    {
      driverId:       alarisDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Thomas E. Polen',
      authorRole:    'CEO',
      commentaryType: 'review',
      title:          'Alaris Consent Decree: Two Consecutive Quarters of Zero FDA 483 Observations',
      content:
        'BD completed Q2 FY26 with zero FDA 483 observations for the second consecutive quarter under the Alaris consent decree — a significant quality milestone that demonstrates the effectiveness of our remediation investments. Alaris achieved annualized shipment pace of approximately 72,000 units in Q2 FY26, up from 60,000 in Q2 FY25, reflecting continued market re-entry as hospital procurement teams regain confidence in Alaris device quality and supply reliability. The remaining 32,000-unit hospital backlog represents approximately $128M in deferred revenue recoverable over the next 18-24 months. We are targeting filing a formal petition for consent decree termination in Q4 FY2026, which, if approved by FDA on a six-month review timeline, would eliminate approximately $300M in annual remediation costs beginning in FY2028 and unlock full Alaris market re-entry at 120,000+ annual units.',
      status:         'approved',
      tags:           ['Alaris', 'consent decree', 'FDA', 'quality', 'Connected Care'],
    },

    // ── China VoBP Headwind Management ────────────────────────────────────────
    {
      driverId:       chinaVobpDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Christopher J. DelOrefice',
      authorRole:    'CFO',
      commentaryType: 'review',
      title:          'China VoBP: H1 On Track at $80M; Monitoring NHSA Insulin Syringe Tender Risk',
      content:
        'China volume-based procurement (VoBP) headwinds were approximately $80M in H1 FY26, tracking in-line with our full-year $160M guidance assumption. Q2 FY26 VoBP impact was approximately $42M, largely driven by IV set and blood glucose strip tender pricing. We are actively monitoring NHSA announcements for a potential insulin syringe VoBP tender, which we estimate would add $75-100M in incremental annual headwind (35% probability in Q4 FY2026). Our China mitigation playbook includes redirecting 10-15% of at-risk China volume to India and Southeast Asia, accelerating premium product mix toward 35%+ of China revenue, and leveraging BD Medication Management solutions in Tier-1 China hospital networks not subject to VoBP tender pricing.',
      status:         'approved',
      tags:           ['China', 'VoBP', 'Medical Essentials', 'emerging markets', 'risk management'],
    },

    // ── FX Translation Impact ─────────────────────────────────────────────────
    {
      driverId:       fxTranslationDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Christopher J. DelOrefice',
      authorRole:    'CFO',
      commentaryType: 'review',
      title:          'FX Translation: H1 $116M Headwind; Full-Year $230M Forecast Maintained',
      content:
        'BD experienced a $116M FX translation headwind in H1 FY26, approximately $114M of which was driven by EUR/USD and JPY/USD weakness. Q2 FY26 FX translation impact was approximately $62M, slightly favorable versus our $65M quarterly assumption as the EUR partially recovered versus the USD in March 2026. Our full-year FY2026 FX headwind forecast of $230M is maintained, implying an H2 run-rate of approximately $114M. BD\'s international revenue mix of approximately 48% creates meaningful FX exposure, but our forward hedging program (approximately 75% of European revenue hedged on a 12-month rolling basis) limits translation volatility. Reported CC growth of 7.0% in Q2 FY26 versus reported growth of 5.8% demonstrates the FX drag impact.',
      status:         'approved',
      tags:           ['FX', 'currency', 'international', 'hedging', 'translation'],
    },

    // ── Leverage & Debt Reduction ─────────────────────────────────────────────
    {
      driverId:       leverageDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Christopher J. DelOrefice',
      authorRole:    'CFO',
      commentaryType: 'review',
      title:          'Leverage at 2.9x: H1 Debt Reduction $750M; FY2028 Target <2.5x on Track',
      content:
        'BD\'s net leverage stood at 2.9x adjusted EBITDA at Q2 FY26 end (March 31, 2026), down from 3.1x at September 30, 2025. H1 FY26 gross debt reduction of $750M represents 50% of our $1,500M full-year gross debt reduction target, with $750M of remaining maturities and optional repayments targeted for H2 FY26. Our deleveraging path toward the <2.5x FY2028 target is supported by FCF generation of approximately $3.0B+ annually, Alaris remediation cost relief as consent decree moves toward resolution (approximately $300M run-rate savings by FY2028), and elimination of Waters spin-off integration costs. Each 0.1x leverage reduction generates approximately $10M of annual interest savings at our current weighted-average cost of debt of approximately 4.2%.',
      status:         'approved',
      tags:           ['leverage', 'debt reduction', 'capital structure', 'FCF', 'credit rating'],
    },

    // ── Free Cash Flow & Capital Returns ──────────────────────────────────────
    {
      driverId:       fcfDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Christopher J. DelOrefice',
      authorRole:    'CFO',
      commentaryType: 'review',
      title:          'FCF Conversion 96% H1 FY26; Dividend Maintained; Buyback Deferred Pending Leverage',
      content:
        'BD generated H1 FY26 free cash flow of approximately $1,420M (96% conversion of adjusted net income — above our 95% full-year target), driven by working capital discipline (DSO flat YoY at 48 days, inventory turns improving 0.2x), capital expenditure phasing ($680M H1 vs $1,020M H2), and lower Alaris remediation capex ($145M H1 of $300M FY plan). The quarterly dividend of $0.96 per share ($3.84 annualized, representing approximately $900M annually) is maintained and well-covered at 31% of adjusted EPS. Share repurchases remain deferred until leverage reaches <2.5x, consistent with our capital allocation framework prioritizing: (1) deleveraging, (2) organic growth capex, (3) tuck-in M&A, and (4) buybacks. At <2.5x leverage, we expect to resume buybacks in FY2028 at approximately $500-750M per year.',
      status:         'approved',
      tags:           ['FCF', 'cash flow', 'dividend', 'capital allocation', 'buyback'],
    },

    // ── Interventional Procedure Growth ──────────────────────────────────────
    {
      driverId:       interventionalDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Thomas E. Polen',
      authorRole:    'CEO',
      commentaryType: 'review',
      title:          'Interventional Achieves +5.8% CC Growth; EP Catheter Tuck-In Under Evaluation',
      content:
        'BD Interventional posted Q2 FY26 revenue of approximately $1,430M, representing 5.8% constant-currency growth. Peripheral vascular (PV) led with high single-digit CC growth driven by Lutonix drug-coated balloon (DCB) penetration of complex peripheral arterial disease (PAD) cases, with U.S. DCB reimbursement pathway clarity supporting procedure volume recovery. BD Surgery grew mid-single digits on laparoscopic and robotic procedure volume normalization. We are in active evaluation of an electrophysiology (EP) catheter tuck-in acquisition in the $800M-$1.2B enterprise value range that would establish a meaningful presence in the high-growth EP ablation market (15%+ CAGR). We expect to reach a decision by Q4 FY2026 Board meeting.',
      status:         'approved',
      tags:           ['Interventional', 'vascular', 'EP catheter', 'M&A', 'procedure growth'],
    },

    // ── BioPharma Capacity Expansion ──────────────────────────────────────────
    {
      driverId:       biopharmaCapacityDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Thomas E. Polen',
      authorRole:    'CEO',
      commentaryType: 'planning',
      title:          'FY2027-FY2028 BioPharma Capacity Expansion: Site Selection in Progress',
      content:
        'BD is actively evaluating three sites for the FY2027-FY2028 GLP-1 PFS capacity expansion: (1) Canaan, CT existing facility — lowest startup risk, 18-month expansion lead time, $420M capex; (2) Greenfield North Carolina campus — 30 months, $750M capex, maximum flexibility; (3) Ireland Drogheda expansion — 22 months, $580M capex, serves European market proximity. A hybrid approach combining Canaan near-term expansion ($200M) with Ireland longer-term capacity ($500M) is the current recommended option. Customer supply agreements from Novo Nordisk, Eli Lilly, and an undisclosed third GLP-1 manufacturer totaling approximately $2.8B in contracted demand through FY2029 have been secured. Final site selection decision is targeted for Q4 FY2026 board meeting with groundbreaking in Q1 FY2027.',
      status:         'approved',
      tags:           ['BioPharma Systems', 'GLP-1', 'capacity', 'capex', 'FY2027', 'planning'],
    },

    // ── Interest Expense & Cost of Capital ────────────────────────────────────
    {
      driverId:       interestDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Christopher J. DelOrefice',
      authorRole:    'CFO',
      commentaryType: 'review',
      title:          'Interest Expense: H1 Savings $30M; High-Coupon Bond Refinancing Opportunity',
      content:
        'BD realized approximately $30M in annual interest expense savings from gross debt reduction in H1 FY26, on track toward the $60M full-year savings target. Our weighted-average cost of debt is approximately 4.2% on $17.8B gross debt (approximately $750M in interest expense annually). We have identified a refinancing opportunity: two BD senior note issuances (5.0% coupon, matured 2026/2027, total $2.1B). However, an accelerated paydown approach — retiring $1.5B of these notes from FCF over FY2026-FY2027 — would save approximately $75M annually and reduce leverage by 0.15x, making paydown preferable to refinancing given current rate environment. This approach is consistent with our capital allocation priority of deleveraging to <2.5x.',
      status:         'approved',
      tags:           ['interest expense', 'debt', 'refinancing', 'cost of capital', 'leverage'],
    },

    // ── Smart Medication Management (MMS) Growth ──────────────────────────────
    {
      driverId:       mmsDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Thomas E. Polen',
      authorRole:    'CEO',
      commentaryType: 'review',
      title:          'BD MMS: 1,780 Capital Placements in Q2; Software ARR Ahead of Plan',
      content:
        'BD\'s Smart Medication Management (MMS) segment posted 1,780 capital system placements in Q2 FY26 (versus 1,800 plan; 1,650 prior year). The slight miss versus plan reflects extended Q2 hospital budget approval timelines that pushed approximately 120 placements into Q3 FY26. BD MMS software Annual Recurring Revenue (ARR) grew 12% YoY, ahead of our 9% Connected Care software growth assumption, as hospitals accelerate adoption of Pyxis Connect II (cloud-based medication management) and BD HealthSight workflow intelligence. MMS is a consent-decree-independent product line with no restrictions — the timing delay is budget-cycle-driven, not market demand-driven.',
      status:         'approved',
      tags:           ['MMS', 'Pyxis', 'medication management', 'Connected Care', 'capital placements', 'ARR'],
    },

    // ── Capital Expenditure Management ────────────────────────────────────────
    {
      driverId:       capexDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Christopher J. DelOrefice',
      authorRole:    'CFO',
      commentaryType: 'review',
      title:          'H1 FY26 Capex $680M; GLP-1 Expansion Permitting Drives H2 Back-Loading',
      content:
        'BD invested $680M in capital expenditures in H1 FY26, representing 40% of our $1,700M full-year capex guidance. The H1 underspend reflects (1) GLP-1 expansion site permitting delays at our Ireland facility adding 4-6 weeks to site preparation (approximately $120M of capex shifted from H1 to H2), (2) Alaris remediation capex of $145M tracking below $175M H1 plan due to supplier lead time improvements, and (3) BD Manufacturing Excellence program providing H1 capacity relief. H2 FY26 capex will be approximately $1,020M — concentrated in Q4 FY26 — as GLP-1 permitting clears and Ireland expansion begins. We maintain the $1,700M full-year guidance.',
      status:         'approved',
      tags:           ['capex', 'GLP-1', 'Alaris', 'capital expenditures', 'cash flow'],
    },

    // ── International Revenue Mix ──────────────────────────────────────────────
    {
      driverId:       internationalMixDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Christopher J. DelOrefice',
      authorRole:    'CFO',
      commentaryType: 'planning',
      title:          'International Mix Target 50%+ by FY2028; Emerging Markets Offset China VoBP',
      content:
        'BD\'s international revenue mix was approximately 48% of total revenue in Q2 FY26. Our FY2028 target is 50%+ international mix, driven by BioPharma Systems European GLP-1 volume growth (Ireland and Germany supply), India and Southeast Asia Medical Essentials volume growth of 12-15% CC annually, and Middle East hospital system buildout supporting BD Infusion and BD Diagnostics growth. Emerging market growth is directly linked to China VoBP offset: as China Medical Essentials revenue is diluted by VoBP pricing pressure, India, Vietnam, Thailand, and Saudi Arabia are absorbing incremental BD supply at premium pricing. BD India delivered 18% CC revenue growth in Q2 FY26, making it our fastest-growing individual country market.',
      status:         'approved',
      tags:           ['international', 'emerging markets', 'India', 'mix shift', 'FY2028'],
    },

    // ── U.S. Medical Essentials Volume Growth ─────────────────────────────────
    {
      driverId:       usVolumeDriverId,
      fiscalPeriod:  'Q2 FY26',
      authorName:    'Christopher J. DelOrefice',
      authorRole:    'CFO',
      commentaryType: 'review',
      title:          'U.S. Medical Essentials: +3.2% CC Growth; Needle & Syringe Volumes Recovering',
      content:
        'U.S. Medical Essentials delivered 3.2% constant-currency volume growth in Q2 FY26, modestly above our 3.0% plan, driven by diagnostic specimen collection kits (+8% CC), IV access products (+4% CC), and diabetes care (+2% CC). Needle and syringe volumes are recovering from prior-year inventory normalization, tracking +2.5% unit volume for Q2 FY26. BD AutoShield Duo (pre-fillable pen needle) is gaining share in the self-injection diabetes market ahead of GLP-1 adoption tailwinds. U.S. Medical Essentials pricing realization was +1.8% YoY, below our +2.5% target due to competitive pressure in acute care IV access. We have initiated a premium product mix-shift program targeting 40% of U.S. Medical Essentials revenue in advanced specification products by FY2028.',
      status:         'approved',
      tags:           ['Medical Essentials', 'U.S. volume', 'needle syringe', 'pricing', 'mix'],
    },

  ];

  // ─── Create commentary records ────────────────────────────────────────────

  let created = 0;
  for (const rec of commentaryRecords) {
    if (rec.driverId === null) {
      console.warn(`  Skipping commentary "${rec.title}" — driver not found`);
      continue;
    }
    await prisma.commentary.create({
      data: {
        companyId,
        driverId:       rec.driverId,
        fiscalPeriod:   rec.fiscalPeriod  ?? 'Q2 FY26',
        authorName:     rec.authorName    ?? 'Christopher J. DelOrefice',
        authorRole:     rec.authorRole    ?? 'CFO',
        commentaryType: rec.commentaryType ?? 'review',
        category:       rec.category      ?? 'Financial Performance',
        title:          rec.title,
        content:        rec.content,
        status:         rec.status        ?? 'published',
        tags:           rec.tags          ?? [],
      },
    });
    created++;
  }

  console.log(`  Seeded ${created} BD commentary records (Q2 FY26)`);
}
