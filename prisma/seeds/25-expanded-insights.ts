import { PrismaClient } from '@prisma/client';

// Seed 25: Expanded Personalized Insights — Becton, Dickinson and Company (NYSE: BDX)
// ~32 insights covering Q2 FY26 results, BioPharma Systems / GLP-1 prefillable syringe demand,
// BD Alaris consent decree remediation, China VoBP pricing headwind, FX impact,
// BD Excellence lean savings, Waters Life Sciences spin-off, net leverage deleveraging,
// segment organic growth, and competitive positioning.

export async function seedExpandedInsights(prisma: PrismaClient, companyId: number) {
  console.log('  Seeding BD expanded insights (~32 records)...');

  const insights = [

    // =========================================================================
    // SEGMENT REVENUE & ORGANIC GROWTH (6 insights)
    // =========================================================================
    {
      title: 'Q2 FY26 Revenue $4,714M +5.2% Organic — Broad-Based Segment Outperformance vs. $4,680M Consensus',
      category: 'Financial Performance',
      insightLevel: 'L1',
      metricId: 'Total Revenue',
      kpiValue: '$4,714M Q2 FY26; +5.2% organic ex-FX; beat consensus by $34M',
      trendDirection: 'up',
      priority: 'critical',
      summary: 'BD reported Q2 FY26 revenue of $4,714M, growing +5.2% on an organic, currency-neutral basis and beating the $4,680M consensus estimate by $34M. Reported revenue growth was +2.1% YoY, with the gap to organic growth reflecting a significant FX headwind (approximately -3.1 percentage points) driven by USD strength vs. the euro, Japanese yen, and Chinese renminbi.\n\nAll four continuing segments — Medical Essentials, Connected Care, BioPharma Systems, and Interventional — contributed positive organic growth in Q2 FY26. BioPharma Systems led at +11.4% organic on GLP-1 prefillable syringe demand. Connected Care posted +6.8% organic as BD Alaris infusion system shipments resumed post-consent-decree. Medical Essentials grew +3.9% organic on vascular access and specimen collection volume. Interventional grew +4.2% organic driven by peripheral vascular and urology.\n\nThe Waters Life Sciences segment spin-off (completed February 2026) reduces reported revenue by approximately $1.2B annually on a run-rate basis but improves margin mix and eliminates the strategic drag of a non-core business.',
      confidenceScore: 0.95,
      consoleLink: '/business-consoles/financial-performance',
      recommendations: [
        'Provide a quarterly organic growth bridge by segment in earnings materials; blended reported growth obscures the strong BioPharma Systems and Connected Care acceleration stories',
        'Disclose the FX impact by currency pair; EUR, JPY, and CNY are the three material exposures — investors need to model each separately as monetary policy diverges',
        'Update FY26 organic growth guidance range after Q2 beat; if Q2 tracks ahead, the low end of the +5-6% organic growth range may be conservative',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Total Revenue', impact: '$4,714M Q2 FY26; +5.2% organic vs +2.1% reported', trend: 'positive' },
        { driver: 'FX Impact', impact: '-3.1pts FX headwind; USD strength vs EUR, JPY, CNY', trend: 'negative' },
        { driver: 'BioPharma Systems Revenue', impact: 'GLP-1 syringe demand leads all segments at +11.4% organic', trend: 'positive' },
      ]),
    },
    {
      title: 'BioPharma Systems +11.4% Organic Q2 FY26 — GLP-1 Prefillable Syringe Volumes Driving Sustained Outgrowth',
      category: 'Revenue & Market',
      insightLevel: 'L1',
      metricId: 'BioPharma Systems Revenue',
      kpiValue: '+11.4% organic Q2 FY26; GLP-1 prefillable syringe orders backlog $2.1B+',
      trendDirection: 'up',
      priority: 'critical',
      summary: 'BD\'s BioPharma Systems segment — which manufactures prefillable syringes, drug delivery systems, and pharmaceutical packaging — delivered +11.4% organic growth in Q2 FY26, the fifth consecutive quarter of double-digit organic expansion. The primary driver is GLP-1 receptor agonist drug demand: Novo Nordisk (Ozempic, Wegovy) and Eli Lilly (Mounjaro, Zepbound) both rely heavily on high-quality prefillable syringe systems for their injectable formulations. BD supplies glass and polymer prefillable syringes, autoinjector components, and pre-sterilized plunger systems to these and other GLP-1 manufacturers globally.\n\nThe GLP-1 drug category is projected to reach $150B+ in global annual sales by 2030, with prefillable syringe content value of approximately $0.50-$2.00 per unit depending on device complexity. At current penetration and GLP-1 volume trajectory, BioPharma Systems could add $800M-$1.2B of incremental annual revenue by FY29 relative to FY24 baseline. BD has $2.1B+ in identified BioPharma Systems order backlog, the highest in segment history, providing multi-year revenue visibility.',
      confidenceScore: 0.93,
      consoleLink: '/business-consoles/biopharma-systems',
      recommendations: [
        'Expand capacity at BD\'s Durham NC and Le Pont-de-Claix France prefillable syringe facilities; current order backlog exceeds 24-month delivery lead time — capacity expansion is the binding constraint on BioPharma Systems growth',
        'Disclose GLP-1-attributable revenue as a percentage of BioPharma Systems segment revenue; investors modeling GLP-1 market growth need the BD content-per-unit and volume data to assess the opportunity',
        'Develop long-term supply agreements with top-3 GLP-1 manufacturers for 2027-2032 delivery commitments; locking in volume protects against future GLP-1 competitor entry and ensures capital investment is underwritten by contracted demand',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'BioPharma Systems Revenue', impact: '+11.4% organic Q2; $2.1B+ order backlog; GLP-1 primary driver', trend: 'positive' },
        { driver: 'Total Revenue', impact: 'BioPharma Systems contributes ~28% of total revenue; fastest growing segment', trend: 'positive' },
      ]),
    },
    {
      title: 'Connected Care +6.8% Organic — Alaris Shipment Ramp Driving Recovery; Backlog Conversion on Track',
      category: 'Revenue & Market',
      insightLevel: 'L1',
      metricId: 'Connected Care Revenue',
      kpiValue: '+6.8% organic Q2 FY26; Alaris infusion system shipments resuming; backlog clearing',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD\'s Connected Care segment — including BD Alaris infusion systems, hemodynamic monitoring, and medication management technology — grew +6.8% organically in Q2 FY26, driven primarily by the resumption of BD Alaris infusion pump shipments as the FDA consent decree remediation program reaches 78% completion. BD Alaris was under a 2020 FDA consent decree requiring software remediation and quality system upgrades before new system sales could resume in the US market. The remediation has reached a stage where BD received FDA clearance to ship updated Alaris units to a subset of hospital accounts.\n\nThe Alaris backlog — hospitals that deferred capital purchases awaiting consent decree resolution — represents a multi-year pent-up demand opportunity. Hospital accounts that have waited 4+ years for next-generation Alaris hardware are now receiving shipments with the new software platform, generating initial capital revenue followed by recurring software subscriptions and service contracts. BD expects Alaris to contribute at least $300-400M of incremental annual revenue as the consent decree fully resolves and the full hospital install base can be upgraded.',
      confidenceScore: 0.90,
      consoleLink: '/business-consoles/connected-care',
      recommendations: [
        'Provide a quarterly Alaris consent decree remediation scorecard: hospitals reached vs. total target, software update completion percentage, and FDA inspection milestone timeline — investors need quarterly progress markers',
        'Quantify the Alaris pent-up demand: number of hospital accounts in the backlog, average order size, and expected conversion timeline — this translates directly to future Connected Care revenue',
        'Accelerate Alaris installation capacity (field service engineers, software deployment teams) to capture backlog faster; revenue recognition on Alaris hospital contracts occurs on installation, not order',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Connected Care Revenue', impact: '+6.8% organic; Alaris ramp primary driver', trend: 'positive' },
        { driver: 'Alaris Consent Decree', impact: '78% remediated; shipment resumption driving backlog conversion', trend: 'positive' },
      ]),
    },
    {
      title: 'Medical Essentials +3.9% Organic — Vascular Access and Specimen Collection Steady Volume Growth',
      category: 'Revenue & Market',
      insightLevel: 'L2',
      metricId: 'Medical Essentials Revenue',
      kpiValue: '+3.9% organic Q2 FY26; vascular access +4.5%, specimen management +3.2%',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD\'s Medical Essentials segment — the largest by revenue, encompassing vascular access devices (IV catheters, PICCs, midlines), specimen collection (blood tubes, lancets, needles), and medication management solutions — grew +3.9% organically in Q2 FY26, consistent with underlying hospital procedure volume growth of approximately 3-4% nationally. Vascular access led at +4.5% organic on new BD Nexiva IV catheter placements and BD PowerPICC growth in mid-acuity hospital settings.\n\nMedical Essentials is the most stable segment by growth rate — relatively immune to capital budget cycles (consumables are procedure-driven) and insulated from single large-customer concentration risk due to broad hospital distribution. China VoBP (Volume-Based Procurement) pricing pressure in blood collection tubes is the primary headwind: China represents approximately 8% of Medical Essentials revenue, and VoBP price cuts of -14% FXN in blood collection products are partially offsetting volume growth gains.',
      confidenceScore: 0.88,
      consoleLink: '/business-consoles/medical-essentials',
      recommendations: [
        'Accelerate Nexiva IV catheter market share gains in US hospital accounts by leveraging BD Excellence lean manufacturing cost advantages to offer competitive pricing on GPO contract renewals',
        'Disclose China Medical Essentials revenue separately; the -14% FXN VoBP impact on blood collection obscures the underlying ex-China growth quality',
        'Expand specimen management product portfolio in oncology and specialty diagnostics; the growing demand for liquid biopsy sample collection is a premium-priced adjacency for BD\'s blood tube expertise',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Medical Essentials Revenue', impact: '+3.9% organic; vascular access +4.5%, specimen +3.2%', trend: 'positive' },
        { driver: 'China VoBP Impact', impact: 'Blood collection VoBP -14% FXN offsets volume gains', trend: 'negative' },
      ]),
    },
    {
      title: 'Interventional +4.2% Organic Q2 FY26 — Peripheral Vascular and Urology Leading; Electrophysiology Stable',
      category: 'Revenue & Market',
      insightLevel: 'L2',
      metricId: 'Interventional Revenue',
      kpiValue: '+4.2% organic Q2 FY26; peripheral vascular +5.8%, urology +4.1%',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD\'s Interventional segment — which includes peripheral vascular (catheters, stents, atherectomy), urology (biopsy, drainage), and surgery — grew +4.2% organically in Q2 FY26. Peripheral vascular growth at +5.8% organic reflects procedure volume recovery in ambulatory surgery centers and hospital catheterization labs post-pandemic. BD\'s atherectomy devices (Rotarex, HawkOne) and venous stenting portfolio are gaining procedure share against Medtronic and Boston Scientific in the peripheral artery disease (PAD) market.\n\nUrology grew +4.1% organic on BD Trocath drainage and BD Liberator single-use urological scope placements. The Liberator flexible ureteroscope — a single-use, sterile scope eliminating reprocessing cost and infection risk vs. reusable scopes — is gaining rapid adoption in urology programs that have faced scope contamination incidents. Electrophysiology (EP) is a smaller sub-segment that grew +2.8% organic, below the segment average, as EP lab capital is constrained by hospital budget cycles.',
      confidenceScore: 0.87,
      consoleLink: '/business-consoles/interventional',
      recommendations: [
        'Invest in clinical evidence programs for BD atherectomy devices in PAD; head-to-head data vs. Medtronic Rotational Atherectomy and BSX AngioJet is the key physician adoption accelerator',
        'Accelerate BD Liberator single-use ureteroscope commercialization; the total cost of ownership analysis vs. reusable scope (reprocessing + breakage + infection risk) is compelling for large urology programs — needs formal economic value study',
        'Disclose Interventional revenue by sub-segment quarterly; peripheral vascular, urology, and surgery each have distinct growth rates and competitive dynamics that are obscured in segment aggregation',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Interventional Revenue', impact: '+4.2% organic; peripheral vascular +5.8% leads', trend: 'positive' },
        { driver: 'Total Revenue', impact: 'Interventional contributes ~22% of total BD revenue', trend: 'positive' },
      ]),
    },
    {
      title: 'Waters Life Sciences Spin-Off Completed Feb 2026 — BD Refocused on High-Growth Medtech Core',
      category: 'Strategic',
      insightLevel: 'L1',
      metricId: 'Portfolio Transformation',
      kpiValue: 'Waters spin-off complete Feb 2026; BD pro forma revenue $19.0B annualized; margin mix improves',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD completed the spin-off of its Life Sciences segment (rebranded as Waters Corporation Life Sciences) in February 2026, distributing shares to BD shareholders on a tax-free basis. The transaction removes approximately $1.2B of annual Life Sciences revenue from BD\'s consolidated results but meaningfully improves the adjusted operating margin mix: the Life Sciences business carried segment operating margins approximately 200bps below BD\'s medtech segments, reflecting lower-margin flow cytometry and diagnostic system revenues.\n\nPost-spin, BD\'s four continuing segments (Medical Essentials, Connected Care, BioPharma Systems, Interventional) collectively generate higher organic growth rates, higher segment margins, and a cleaner capital allocation story. The spin also freed approximately $600M of balance sheet capacity that had been allocated to Life Sciences working capital and CapEx, which BD redirected toward BioPharma Systems capacity expansion and debt reduction. Pro forma FY26 adjusted EPS guidance of $12.52-$12.72 reflects the continuing operations only.',
      confidenceScore: 0.92,
      consoleLink: '/business-consoles/financial-performance',
      recommendations: [
        'Provide 12 months of pro forma continuing operations financials (revenue, margin, EPS) to establish a clean baseline for the post-spin BD; investors need apples-to-apples comparisons for FY25 vs. FY26',
        'Communicate the margin improvement from the spin explicitly: FY26 adj. op margin guidance of ~25% is approximately 100-150bps above what the combined company would have delivered — this is a value creation narrative',
        'Track Waters Corporation Life Sciences stock performance separately; any BD/Waters arbitrage or re-rating signals market sentiment on the spin value creation thesis',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Portfolio Transformation', impact: 'Waters spin Feb 2026; BD continuing ops margin mix improves +100-150bps', trend: 'positive' },
        { driver: 'Adjusted Operating Margin', impact: 'Spin removes lower-margin Life Sciences; FY26 target ~25%', trend: 'positive' },
      ]),
    },

    // =========================================================================
    // MARGIN, COST AND BD EXCELLENCE (5 insights)
    // =========================================================================
    {
      title: 'Q2 FY26 Adjusted Operating Margin 24.2% — On Path to ~25% FY26 Target; BD Excellence Savings Accelerating',
      category: 'Financial Performance',
      insightLevel: 'L1',
      metricId: 'Adjusted Operating Margin',
      kpiValue: '24.2% adj. op margin Q2 FY26; FY26 target ~25%; 80bps YoY expansion',
      trendDirection: 'up',
      priority: 'critical',
      summary: 'BD reported Q2 FY26 adjusted operating margin of 24.2% — 80 basis points above Q2 FY25 — driven by BD Excellence lean system savings, favorable BioPharma Systems segment mix, and the Waters spin-off margin uplift. The 24.2% Q2 margin puts BD on track for the full-year ~25% adjusted operating margin guidance, implying H2 FY26 margin of approximately 25.6-26% as BD Excellence savings accelerate and BioPharma Systems mix continues to improve.\n\nKey margin drivers: BD Excellence lean manufacturing savings (approximately $180M annualized in FY26, +$40M vs. FY25); favorable BioPharma Systems segment mix uplift (BioPharma Systems carries above-corporate-average margin due to consumable content and long-run customer contracts); FX headwinds partially offsetting (approximately -80bps on reported margin). SG&A efficiency improvement of approximately 40bps YoY reflects organizational redesign completed in H2 FY25.',
      confidenceScore: 0.92,
      consoleLink: '/business-consoles/financial-performance',
      recommendations: [
        'Provide a BD Excellence savings run-rate tracker by quarter; the $180M FY26 target and its quarterly pacing should be disclosed to give investors confidence in H2 margin acceleration',
        'Decompose the margin bridge: segment mix (BioPharma Systems), BD Excellence, FX, and other — investors who model each driver separately can assess durability of 25%+ margin in FY27+',
        'Set a multi-year adjusted operating margin target of 27-28% by FY28; BD Excellence and BioPharma Systems mix improvement together support a credible path to sector-peer margins',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Adjusted Operating Margin', impact: '24.2% Q2 FY26; +80bps YoY; on track for ~25% full year', trend: 'positive' },
        { driver: 'BD Excellence Savings', impact: '$180M annualized FY26; primary margin expansion driver', trend: 'positive' },
        { driver: 'FX Impact', impact: '-80bps reported margin headwind from USD strength', trend: 'negative' },
      ]),
    },
    {
      title: 'BD Excellence Lean System — $180M FY26 Savings Target; Manufacturing Productivity and Procurement',
      category: 'Financial Performance',
      insightLevel: 'L1',
      metricId: 'BD Excellence Savings',
      kpiValue: '$180M FY26 BD Excellence savings; $40M incremental vs FY25; 3-year target $300M+',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD Excellence is BD\'s enterprise-wide lean continuous improvement system — adapted from the Toyota Production System and applied to manufacturing, supply chain, and commercial processes. In FY26, BD Excellence is targeting $180M of annualized savings across three categories: manufacturing productivity ($90M, primarily direct labor efficiency and yield improvement at medical device plants), procurement cost reduction ($60M, raw material and component renegotiation), and SG&A efficiency ($30M, commercial and corporate overhead simplification).\n\nThe BD Excellence system is embedded in daily operations across 60+ manufacturing sites: each site runs a tiered daily management process, value stream mapping sessions, and a project pipeline of kaizen events. The culture of continuous improvement is a durable competitive advantage that compounds over time — unlike one-time restructuring programs, BD Excellence generates ongoing savings as the system matures and targets larger processes. BD\'s management estimates a 3-year BD Excellence savings target of $300M+ cumulative, with the run-rate savings reinvested in R&D and BioPharma Systems capacity.',
      confidenceScore: 0.88,
      consoleLink: '/business-consoles/operations',
      recommendations: [
        'Publish BD Excellence savings by category (manufacturing, procurement, SG&A) annually; the decomposition validates that savings are structural and not achieved by cutting growth-investment',
        'Benchmark BD Excellence manufacturing productivity metrics vs. medtech peers (Medtronic, Stryker, Abbott); BD\'s lean maturity is a competitive advantage that should be quantified and communicated',
        'Expand BD Excellence to recently acquired business integrations; new commercial excellence programs in the Connected Care segment are the next high-value application',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'BD Excellence Savings', impact: '$180M FY26; $300M+ 3-year target; structural margin driver', trend: 'positive' },
        { driver: 'Adjusted Operating Margin', impact: 'BD Excellence is primary driver of 25%+ margin trajectory', trend: 'positive' },
      ]),
    },
    {
      title: 'FX Headwind -3.1pts Q2 FY26 — EUR, JPY, CNY Depreciation; H2 FY26 Comparison Eases',
      category: 'Financial Performance',
      insightLevel: 'L2',
      metricId: 'FX Impact',
      kpiValue: '-3.1pts FX headwind Q2 FY26; EUR/USD -5%, JPY/USD -8%, CNY/USD -4% YoY avg',
      trendDirection: 'down',
      priority: 'high',
      summary: 'BD\'s Q2 FY26 reported revenue growth of +2.1% YoY was reduced by -3.1 percentage points of FX headwind, as the USD strengthened materially vs. BD\'s major foreign currencies. The EUR/USD rate averaged approximately 1.07 in Q2 FY26 vs. 1.13 in Q2 FY25 (-5% YoY), the JPY/USD averaged 153 vs. 140 (-8%), and CNY/USD was slightly weaker. Europe represents approximately 28% of BD\'s revenue, Japan approximately 7%, and China approximately 9% — making these three the dominant FX exposures.\n\nThe FX headwind is expected to ease in H2 FY26 as comparison periods become easier: the USD appreciation was most severe in Q2-Q3 FY26 YoY periods. Management has maintained the full-year organic growth guidance of +5-6% while acknowledging that reported growth will trail organic by approximately 2.5-3.5 percentage points for the full year, consistent with Q2\'s experience.',
      confidenceScore: 0.86,
      consoleLink: '/business-consoles/financial-performance',
      recommendations: [
        'Provide a full-year FX sensitivity table: each 1% change in EUR/USD, JPY/USD, and CNY/USD impacts on reported revenue and EPS — this is the most-requested investor modeling input',
        'Consider a natural hedging strategy for JPY exposure; BD\'s significant Japan cost base (manufacturing, R&D, SG&A) partially offsets JPY revenue exposure — quantify the natural hedge ratio',
        'Communicate H2 FY26 FX comparison improvement proactively; if the EUR/USD rate stabilizes at current levels, H2 FY26 FX headwind narrows to -1.5 to -2.0 points, improving reported growth trajectory',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'FX Impact', impact: '-3.1pts Q2; full-year -2.5 to -3.5pts on reported growth', trend: 'negative' },
        { driver: 'Total Revenue', impact: 'Organic +5.2% vs reported +2.1%; FX gap widens reported miss perception', trend: 'neutral' },
      ]),
    },
    {
      title: 'China VoBP -14% FXN Pricing Headwind — Blood Collection and Vascular Access Most Affected',
      category: 'Risk & Compliance',
      insightLevel: 'L1',
      metricId: 'China VoBP Impact',
      kpiValue: '-14% FXN China VoBP price cuts; ~9% of BD revenue exposed; $170M annual headwind',
      trendDirection: 'down',
      priority: 'high',
      summary: 'China\'s Volume-Based Procurement (VoBP) program has expanded from pharmaceutical drugs into medical devices, with blood collection tubes, IV catheters, and prefillable syringes now subject to government-negotiated price reductions. BD — as the global market leader in blood collection (Vacutainer) and a major IV catheter supplier in China — faces a -14% FXN price headwind on its China VoBP-exposed product categories. China represents approximately 9% of BD\'s continuing operations revenue (approximately $1.7B annualized), with VoBP-affected categories representing approximately half of that exposure.\n\nThe $170M estimated annual revenue headwind from VoBP is partially offset by volume increases that VoBP mandates (program participants commit to higher procurement volumes at lower prices) and by mix improvement as BD shifts China sales toward higher-margin, less VoBP-exposed product categories (BioPharma Systems and specialty interventional products are not currently subject to VoBP). BD management has guided that China VoBP headwind will be approximately -1.5 percentage points of total company organic growth impact in FY26.',
      confidenceScore: 0.87,
      consoleLink: '/business-consoles/international',
      recommendations: [
        'Disclose China VoBP-affected revenue separately by product category; the market needs to understand which BD China revenues are VoBP-exposed vs. non-exposed to model the future trajectory',
        'Accelerate the China product mix shift toward BioPharma Systems and Interventional categories; these non-VoBP-exposed segments carry higher margin and serve the faster-growing Chinese hospital investment areas',
        'Monitor VoBP expansion to additional device categories; if prefillable syringes or infusion pumps enter VoBP, the BioPharma Systems China exposure (approximately $200M) would become a meaningful incremental headwind',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'China VoBP Impact', impact: '-14% FXN; ~$170M annual headwind; -1.5pts organic growth drag', trend: 'negative' },
        { driver: 'Medical Essentials Revenue', impact: 'Blood collection and IV catheter most exposed to VoBP', trend: 'negative' },
      ]),
    },
    {
      title: 'FY26 Adjusted EPS Guidance $12.52-$12.72 — Q2 $2.90 Puts Company on Solid Trajectory',
      category: 'Financial Performance',
      insightLevel: 'L1',
      metricId: 'Adjusted EPS',
      kpiValue: '$12.52-$12.72 FY26 adj. EPS guidance; Q2 $2.90; H2 implied $6.42-$6.62',
      trendDirection: 'up',
      priority: 'critical',
      summary: 'BD\'s FY26 adjusted EPS guidance of $12.52-$12.72 (midpoint $12.62) represents approximately +8% growth from FY25 adjusted EPS — implying a meaningful acceleration in earnings growth driven by margin expansion and BioPharma Systems mix improvement. Q2 FY26 adjusted EPS of $2.90 (+9.4% YoY) implies an H2 FY26 run-rate of $6.42-$6.62, which requires continued organic growth momentum and BD Excellence savings acceleration.\n\nKey EPS bridge drivers (FY25 to FY26): BioPharma Systems volume and mix (+$0.65-0.85), BD Excellence savings (+$0.30-0.40), Alaris Connected Care revenue ramp (+$0.25-0.35), Waters spin-off margin improvement (+$0.20-0.30), partially offset by FX headwinds (-$0.35-0.45) and China VoBP (-$0.20-0.25). Tax rate and share count are expected to be broadly neutral to the EPS bridge.',
      confidenceScore: 0.91,
      consoleLink: '/business-consoles/financial-performance',
      recommendations: [
        'Provide an explicit EPS bridge from FY25 to FY26 guidance in investor materials; the multiple moving parts (BioPharma Systems, BD Excellence, Alaris, FX, VoBP, Waters spin) require a clear attribution to build investor confidence',
        'Consider raising guidance after Q2 beat if H2 visibility is solid; at $2.90 Q2 EPS and an implied $6.42-$6.62 H2, the full-year trajectory appears achievable — a guidance raise would signal management conviction',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Adjusted EPS', impact: '$12.52-$12.72 FY26; Q2 $2.90 on track; +8% YoY midpoint', trend: 'positive' },
        { driver: 'BioPharma Systems Revenue', impact: 'GLP-1 volume growth largest single EPS driver', trend: 'positive' },
        { driver: 'BD Excellence Savings', impact: 'BD Excellence +$0.30-0.40 EPS contribution FY26', trend: 'positive' },
      ]),
    },

    // =========================================================================
    // BD ALARIS CONSENT DECREE AND CONNECTED CARE RECOVERY (4 insights)
    // =========================================================================
    {
      title: 'BD Alaris Consent Decree 78% Remediated — Full Resolution Expected FY27; $300-400M Revenue Ramp',
      category: 'Risk & Compliance',
      insightLevel: 'L1',
      metricId: 'Alaris Consent Decree',
      kpiValue: '78% remediated Q2 FY26; full resolution target FY27; $300-400M annual revenue ramp',
      trendDirection: 'up',
      priority: 'critical',
      summary: 'The FDA consent decree affecting BD Alaris infusion systems — entered in 2020 following a Warning Letter related to software and quality system deficiencies — has reached 78% completion of the required remediation activities as of Q2 FY26. BD has completed corrective actions across the majority of identified areas: software architecture redesign, quality management system upgrades, enhanced post-market surveillance protocols, and facility-level compliance infrastructure.\n\nThe remaining 22% of remediation activities — primarily long-term field performance data collection and regulatory submission review timelines — are expected to be completed by end of FY27. Full consent decree resolution would enable BD to ship Alaris systems to all US hospital accounts without restriction, unlocking the full replacement and upgrade cycle for the installed base of approximately 900,000 Alaris channels in US hospitals. At approximately $600-700 per channel replacement plus software subscription, the full upgrade cycle represents a $540-630M capital revenue opportunity, followed by recurring service and software revenue.',
      confidenceScore: 0.87,
      consoleLink: '/business-consoles/connected-care',
      recommendations: [
        'Provide quarterly Alaris remediation progress reports with specific milestone completions; 78% completion with 22% remaining — the market needs to understand what the final milestones are and their expected timing',
        'Quantify the Alaris hospital account backlog: number of accounts, estimated order size, and Q3/Q4 FY26 shipment forecast — this converts the remediation story into a near-term revenue catalyst',
        'Develop an Alaris capital financing program for hospital IDNs; many hospitals have constrained capital budgets — an operating lease or managed services model for Alaris adoption accelerates penetration without requiring capital approval',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Alaris Consent Decree', impact: '78% remediated; full resolution FY27; $300-400M revenue ramp', trend: 'positive' },
        { driver: 'Connected Care Revenue', impact: 'Alaris ramp primary driver of Connected Care recovery', trend: 'positive' },
      ]),
    },
    {
      title: 'Infusion System Competitive Landscape — BD Alaris vs. Baxter Novum and ICU Medical Plum 360',
      category: 'Revenue & Market',
      insightLevel: 'L2',
      metricId: 'Connected Care Revenue',
      kpiValue: 'BD Alaris ~35% US hospital infusion pump market share; ICU Medical gaining during consent decree period',
      trendDirection: 'neutral',
      priority: 'high',
      summary: 'BD Alaris holds approximately 35% of the US hospital large-volume infusion pump market — the largest single share — but faced competitive erosion during the 2020-2025 consent decree period as hospitals unable to receive new Alaris units turned to Baxter\'s Novum IQ and ICU Medical\'s Plum 360. ICU Medical (which acquired Hospira from Pfizer and the Smiths Medical infusion business) is estimated to have gained 4-6 points of US infusion market share during the Alaris restriction period.\n\nThe competitive recovery thesis rests on Alaris\'s technical differentiation: the DoseFlex software library (the largest clinically validated drug library in the industry), integration with Epic and Cerner EMR systems, and the DERS (Dose Error Reduction Software) capability that reduces medication administration errors. These clinical workflow advantages — not addressable by a Baxter or ICU Medical product swap — should support Alaris share recovery as the consent decree resolves and hospitals complete their next capital planning cycle.',
      confidenceScore: 0.82,
      consoleLink: '/business-consoles/connected-care',
      recommendations: [
        'Commission hospital CIO and CNO surveys on infusion pump preference following the Alaris consent decree period; understanding competitive switching intent in the 2026-2027 capital cycle is essential for revenue forecasting',
        'Develop a clinical evidence portfolio on Alaris DoseFlex drug library outcomes vs. Baxter Novum and ICU Medical; clinical superiority data accelerates hospital committee approvals for Alaris reinstatement',
        'Price Alaris upgrades competitively for hospitals that switched to ICU Medical during the consent decree period; targeted win-back pricing with long-term service contracts can recover installed base faster than standard pricing',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Connected Care Revenue', impact: 'Market share recovery opportunity as Alaris consent decree resolves', trend: 'positive' },
        { driver: 'Alaris Consent Decree', impact: 'Consent decree removal enables competitive response to ICU Medical gains', trend: 'positive' },
      ]),
    },
    {
      title: 'Hemodynamic Monitoring — BD Carefusion Alaris Platform Expansion; ICU Decision Support Integration',
      category: 'Strategic',
      insightLevel: 'L2',
      metricId: 'Connected Care Revenue',
      kpiValue: 'Hemodynamic monitoring +8% organic Q2; ICU decision support becoming standard of care',
      trendDirection: 'up',
      priority: 'high',
      summary: 'Beyond infusion, BD\'s Connected Care segment includes hemodynamic monitoring systems — continuous blood pressure, cardiac output, and fluid responsiveness monitoring used in ICU and surgical settings. The hemodynamic monitoring sub-segment grew +8% organically in Q2 FY26, driven by hospital investments in ICU decision support following the post-pandemic hospital capacity optimization programs.\n\nBD\'s HemoSphere monitoring platform — which integrates continuous hemodynamic parameters with AI-driven clinical decision support — is differentiating against Edwards Lifesciences (the hemodynamic monitoring market leader) by offering a broader monitoring parameter set at a lower capital cost. Hospitals that adopt the HemoSphere platform are also more likely to select Alaris infusion systems for ICU use, creating a Connected Care ecosystem effect that strengthens the full segment\'s competitive position.',
      confidenceScore: 0.80,
      consoleLink: '/business-consoles/connected-care',
      recommendations: [
        'Quantify the Connected Care ecosystem attach rate: what percentage of hospitals with HemoSphere monitoring platforms also use Alaris for infusion? The ecosystem effect is a key commercial strategy differentiator',
        'Publish clinical outcome data from HemoSphere AI decision support adoption; ICU mortality reduction or length-of-stay improvement from HemoSphere use is the most compelling hospital committee argument',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Connected Care Revenue', impact: 'Hemodynamic monitoring +8% organic; HemoSphere platform differentiating', trend: 'positive' },
        { driver: 'Alaris Consent Decree', impact: 'HemoSphere + Alaris ecosystem creates competitive moat in ICU', trend: 'positive' },
      ]),
    },
    {
      title: 'Pharmacy Automation and Medication Management — Pyxis Revenue Growing +5% Organic in Connected Care',
      category: 'Revenue & Market',
      insightLevel: 'L2',
      metricId: 'Connected Care Revenue',
      kpiValue: 'Pyxis dispensing cabinets +5% organic; medication management software +9% YoY recurring revenue',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD\'s Pyxis medication management platform — automated dispensing cabinets (ADCs) deployed in hospital pharmacy and nursing floor locations — continued its steady growth at +5% organic in Q2 FY26. The Pyxis installed base of approximately 300,000 cabinets in US and international hospitals generates highly predictable recurring revenue through service contracts, software subscriptions, and consumable supplies. Pyxis medication management software (Pyxis ES, Pyxis Anesthesia System) grew +9% YoY in recurring subscription revenue as hospitals upgraded to the cloud-connected analytics platform.\n\nPyxis competes primarily with Omnicell in hospital pharmacy automation — a two-player market with limited new entrants due to the high switching cost of an installed ADC base and deep EMR integration requirements. BD\'s Pyxis share of the US ADC market is approximately 52% vs. Omnicell at approximately 40%. The competitive dynamic is stable, with both players focusing on software and analytics value add rather than unit price competition.',
      confidenceScore: 0.84,
      consoleLink: '/business-consoles/connected-care',
      recommendations: [
        'Expand Pyxis cloud analytics capabilities to include predictive medication demand forecasting; hospital pharmacy directors are investing in forecasting tools — a Pyxis analytics module is a natural upsell',
        'Disclose Pyxis recurring revenue as a percentage of Connected Care segment revenue; the recurring software and service revenue provides earnings stability that should be valued separately from capital hardware',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Connected Care Revenue', impact: 'Pyxis +5% organic; software +9% recurring; stable high-share market', trend: 'positive' },
        { driver: 'Adjusted Operating Margin', impact: 'Pyxis software revenue margin above segment average; recurring mix improving', trend: 'positive' },
      ]),
    },

    // =========================================================================
    // BIOPHARMA SYSTEMS / GLP-1 CAPACITY AND COMPETITIVE POSITION (4 insights)
    // =========================================================================
    {
      title: 'BD BioPharma Systems Capacity Expansion — $600M CapEx FY26-FY28; Durham NC and Le Pont-de-Claix FR',
      category: 'Strategic',
      insightLevel: 'L1',
      metricId: 'BioPharma Systems Revenue',
      kpiValue: '$600M BioPharma Systems capacity CapEx FY26-FY28; additional 1.2B syringe units annually',
      trendDirection: 'up',
      priority: 'critical',
      summary: 'BD is committing approximately $600M of CapEx over FY26-FY28 to expand BioPharma Systems manufacturing capacity, specifically to meet GLP-1 prefillable syringe demand. Expansion is underway at BD\'s Durham, North Carolina facility (adding two new production lines for glass prefillable syringes) and its Le Pont-de-Claix, France campus (expanding polymer insert-needle syringe capacity). Together, the two expansions add approximately 1.2 billion additional syringe units annually by end of FY28 — a capacity increase of approximately 35% from the current BioPharma Systems footprint.\n\nThe $600M CapEx is being funded from BD\'s operating cash flow and partially from the balance sheet flexibility created by the Waters spin-off. Management has indicated that BioPharma Systems capacity expansion CapEx generates returns significantly above BD\'s 12% WACC hurdle rate due to the contracted demand with GLP-1 manufacturers and the premium pricing of high-quality pharmaceutical-grade syringe systems. The capacity additions are supported by long-term supply agreements with major GLP-1 drug manufacturers.',
      confidenceScore: 0.91,
      consoleLink: '/business-consoles/biopharma-systems',
      recommendations: [
        'Provide a BioPharma Systems CapEx payback analysis in investor materials; at $600M over 3 years for 1.2B additional units, investors need the assumed price-per-unit and demand probability to evaluate the investment thesis',
        'Disclose the percentage of new capacity underwritten by long-term supply agreements vs. open order book; contracted demand materially de-risks the $600M CapEx commitment',
        'Evaluate additional site expansions in Asia Pacific (BD\'s Singapore or India facilities) to serve Asia-Pacific GLP-1 demand; proximity to local GLP-1 manufacturing reduces logistics cost and lead time',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'BioPharma Systems Revenue', impact: '+35% capacity by FY28; $600M CapEx; supports multi-year growth trajectory', trend: 'positive' },
        { driver: 'Capital Expenditure', impact: '$600M BioPharma capacity CapEx FY26-FY28 above normal run-rate', trend: 'negative' },
      ]),
    },
    {
      title: 'Drug Delivery Device Competitive Positioning — BD vs. Gerresheimer, Stevanato Group, and Owen Mumford',
      category: 'Revenue & Market',
      insightLevel: 'L2',
      metricId: 'BioPharma Systems Revenue',
      kpiValue: 'BD ~28% global prefillable syringe market share; Gerresheimer #2 at ~22%; BD gaining on GLP-1',
      trendDirection: 'up',
      priority: 'high',
      summary: 'The global prefillable syringe market — estimated at approximately $10B annually and growing at 8-10% CAGR — is concentrated among BD (~28% share), Gerresheimer (~22%), Stevanato Group (~18%), and Schott Pharma (~15%), with BD holding the technology leadership position in high-quality pharmaceutical-grade glass and polymer systems. BD\'s competitive advantages in prefillable syringes: (1) the broadest drug compatibility testing library (>2,000 drug-device combinations validated), reducing time-to-market for pharmaceutical customers; (2) the BD Neopak glass syringe system with superior stopper-plunger force consistency for biologics; and (3) the BD Intevia autoinjector platform for patient self-injection, which is the preferred delivery format for GLP-1 obesity drugs administered at home.\n\nGerresheimer and Stevanato are investing aggressively in GLP-1 capacity but lack BD\'s integrated quality system and drug-device combination expertise. The FDA\'s 21 CFR Part 4 combination product regulation — which requires demonstrating drug-device interface compatibility — is a higher barrier for European syringe manufacturers entering the US GLP-1 supply chain.',
      confidenceScore: 0.84,
      consoleLink: '/business-consoles/biopharma-systems',
      recommendations: [
        'Leverage BD\'s drug compatibility library as a commercial differentiator; pharmaceutical customers choosing a GLP-1 syringe supplier need validated compatibility data — BD\'s library reduces their development timeline by 6-12 months vs. alternatives',
        'Develop a BD Intevia GLP-1 autoinjector platform specifically optimized for the GLP-1 viscosity and dose volume profile; a device engineered for GLP-1 creates switching costs and justifies premium pricing',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'BioPharma Systems Revenue', impact: '~28% global syringe share gaining vs Gerresheimer on GLP-1', trend: 'positive' },
        { driver: 'Portfolio Transformation', impact: 'BioPharma Systems becoming BD\'s highest-value growth segment', trend: 'positive' },
      ]),
    },
    {
      title: 'Autoinjector and Self-Injection Platform Growth — BD Intevia Volume Growing +18% Q2 FY26',
      category: 'Revenue & Market',
      insightLevel: 'L2',
      metricId: 'BioPharma Systems Revenue',
      kpiValue: 'BD Intevia autoinjector platform +18% volume Q2 FY26; GLP-1 self-injection primary driver',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD\'s Intevia autoinjector and self-injection device platform grew +18% in unit volume in Q2 FY26, reflecting the shift in GLP-1 drug delivery from healthcare-provider-administered injections in clinical settings to patient-administered subcutaneous injections at home. The BD Intevia 1mL and 2.25mL autoinjectors are qualified for multiple GLP-1 drug formulations and provide the ease-of-use and dose accuracy required for the chronic, self-managed GLP-1 dosing schedule.\n\nThe autoinjector platform carries higher average selling price than standard prefillable syringes — BD Intevia generates approximately 3-4× the revenue per unit of a standard BD Neopak syringe due to the device complexity, safety features, and regulatory validation requirements. The growing preference for autoinjector delivery among GLP-1 patients (vs. vial-and-syringe or pen injection) supports above-average BioPharma Systems revenue growth per unit of drug volume.',
      confidenceScore: 0.82,
      consoleLink: '/business-consoles/biopharma-systems',
      recommendations: [
        'Disclose autoinjector volume as a separate growth metric within BioPharma Systems; the 3-4× revenue premium vs. standard syringes makes the autoinjector mix a meaningful margin and revenue driver',
        'Develop combination GLP-1 device-drug programs with pharmaceutical partners; co-development of the next-generation GLP-1 autoinjector creates sole-source supply relationships and multi-decade revenue durability',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'BioPharma Systems Revenue', impact: 'Intevia autoinjector +18% volume; 3-4× revenue premium vs. standard syringe', trend: 'positive' },
        { driver: 'Adjusted Operating Margin', impact: 'Autoinjector mix improvement supports above-average BioPharma Systems margin', trend: 'positive' },
      ]),
    },

    // =========================================================================
    // LEVERAGE, CAPITAL ALLOCATION, AND FINANCIAL STRUCTURE (4 insights)
    // =========================================================================
    {
      title: 'Net Leverage 2.9x — Waters Spin Accelerates Deleveraging; 2.5x Target by FY27',
      category: 'Financial Performance',
      insightLevel: 'L1',
      metricId: 'Net Debt to EBITDA',
      kpiValue: '2.9x net leverage Q2 FY26; target 2.5x FY27; Waters spin contributed ~0.3x reduction',
      trendDirection: 'down',
      priority: 'high',
      summary: 'BD\'s net leverage ratio of 2.9× net debt/adjusted EBITDA as of Q2 FY26 is ahead of the deleveraging schedule set at the time of the Waters Life Sciences spin-off. The spin contributed approximately 0.3× of leverage improvement by removing Life Sciences segment debt allocation and reducing gross debt through the Waters balance sheet separation. BD\'s target of 2.5× net leverage by end of FY27 requires approximately $1.0-1.5B of net debt reduction from Q2 FY26 levels, achievable through strong operating cash flow ($2.8B+ FY26 guidance) after CapEx and dividends.\n\nThe 2.9× leverage ratio is at the low end of medtech peer ranges (most large-cap medtechs operate at 2.5-3.5×) and reflects BD\'s conservative balance sheet management philosophy following the significant leverage taken on during the CareFusion acquisition integration period. Achieving 2.5× leverage creates balance sheet capacity for strategic M&A or share repurchases — management has indicated that bolt-on acquisitions in BioPharma Systems drug delivery and Connected Care digital health are the priority use of balance sheet capacity.',
      confidenceScore: 0.90,
      consoleLink: '/business-consoles/financial-performance',
      recommendations: [
        'Provide a quarterly net leverage tracker with the path from 2.9× to 2.5× by FY27; show the contribution of free cash flow generation vs. potential M&A spending on the leverage trajectory',
        'Communicate the capital allocation priority ranking clearly: (1) CapEx / BioPharma Systems expansion, (2) dividend ($3.6B annual at current rate), (3) debt reduction to 2.5×, (4) bolt-on M&A, (5) buybacks',
        'Evaluate accelerating debt reduction beyond the 2.5× target; at current credit spreads, BD\'s BBB+ rating benefits from sub-2.5× leverage through lower refinancing rates on the $2-3B of debt maturing in FY27-FY28',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Net Debt to EBITDA', impact: '2.9× Q2 FY26; target 2.5× FY27; ahead of schedule', trend: 'positive' },
        { driver: 'Portfolio Transformation', impact: 'Waters spin contributed ~0.3× leverage improvement', trend: 'positive' },
        { driver: 'Adjusted EPS', impact: 'Deleveraging reduces interest expense; accretive to EPS FY27+', trend: 'positive' },
      ]),
    },
    {
      title: 'Free Cash Flow Conversion — BD Targeting 85%+ FCF/Net Income; CapEx Elevated in FY26-FY27 on BioPharma Expansion',
      category: 'Financial Performance',
      insightLevel: 'L2',
      metricId: 'Operating Cash Flow',
      kpiValue: 'BD FY26 FCF guidance $2.8B+; CapEx $1.3B elevated by BioPharma capacity expansion',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD\'s FY26 free cash flow guidance of $2.8B+ reflects operating cash flow of approximately $4.1B less CapEx of approximately $1.3B. CapEx is elevated in FY26-FY27 (approximately $1.3B vs. normalized $950M-$1.0B) due to the BioPharma Systems capacity expansion investment at Durham NC and Le Pont-de-Claix France. The incremental $300-350M of BioPharma expansion CapEx is expected to normalize by FY28 as the capacity additions complete, improving FCF conversion back toward 90%+ of adjusted net income.\n\nBD\'s FCF allocation in FY26: dividend ($1.1B at $3.72/share annualized), debt reduction ($1.0-1.3B toward 2.5× target), and retained balance for strategic bolt-on M&A. Share repurchase is de-prioritized until leverage reaches 2.5× — management has indicated buyback authorization review for FY28 upon achieving the leverage target.',
      confidenceScore: 0.87,
      consoleLink: '/business-consoles/financial-performance',
      recommendations: [
        'Provide a normalized FCF bridge showing BioPharma expansion CapEx separately from sustaining CapEx; investors should value the BioPharma expansion as an investment with explicit return expectation, not a maintenance cost',
        'Develop a capital allocation framework document for the post-Waters, post-Alaris BD; the capital priority ranking (BioPharma expansion → debt reduction → dividend → M&A → buybacks) should be explicitly communicated at investor day',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Operating Cash Flow', impact: 'FCF $2.8B+ FY26; CapEx elevated by $300-350M for BioPharma expansion', trend: 'positive' },
        { driver: 'Net Debt to EBITDA', impact: 'FCF supports $1.0-1.3B annual debt reduction toward 2.5×', trend: 'positive' },
      ]),
    },
    {
      title: 'BD Dividend — $3.72/Share Annualized (+6% YoY); Payout Ratio 30% on Adj. EPS; Streak at 50+ Years',
      category: 'Financial Performance',
      insightLevel: 'L2',
      metricId: 'Dividend and Capital Return',
      kpiValue: '$3.72/share annualized dividend FY26; +6% YoY; 50+ year consecutive increase streak',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD has increased its dividend for more than 50 consecutive years — placing it in the S&P 500 Dividend Aristocrats index — and raised the FY26 annualized rate to $3.72/share (+6% YoY). At the FY26 guidance midpoint of $12.62 adjusted EPS, the payout ratio of approximately 30% is conservative and leaves significant earnings capacity for debt reduction and growth investment. BD\'s dividend yield of approximately 1.5-1.8% at current stock price is below the 2.5-3.0% yield range of lower-growth medtech peers, consistent with BD\'s positioning as a growth-and-capital-return story rather than a pure yield investment.\n\nManagement has committed to sustaining the dividend growth streak through the current BioPharma Systems investment cycle — the +6% FY26 increase demonstrates confidence in free cash flow durability even with elevated CapEx. The dividend per share is expected to grow at 5-7% annually through FY28, supported by EPS growth and stable payout ratio.',
      confidenceScore: 0.89,
      consoleLink: '/business-consoles/financial-performance',
      recommendations: [
        'Explicitly communicate the Dividend Aristocrat commitment and 50+ year streak in investor presentations; the streak is a long-term capital discipline signal that is often underweighted in valuation models',
        'Model the dividend growth trajectory alongside EPS guidance; a 5-7% dividend CAGR through FY28 consistent with EPS growth is a credible and attractive capital return commitment',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Dividend and Capital Return', impact: '$3.72/share +6% FY26; 50+ year streak; 30% payout ratio', trend: 'positive' },
        { driver: 'Operating Cash Flow', impact: 'FCF supports $1.1B annual dividend at conservative payout ratio', trend: 'positive' },
      ]),
    },

    // =========================================================================
    // COMPETITIVE POSITIONING AND STRATEGIC (5 insights)
    // =========================================================================
    {
      title: 'BD vs. Medtronic in Infusion and Medication Management — Competitive Positioning Post-Alaris',
      category: 'Revenue & Market',
      insightLevel: 'L2',
      metricId: 'Connected Care Revenue',
      kpiValue: 'BD Alaris infusion vs. Medtronic: distinct markets; limited direct overlap; pharmacy automation BD advantage',
      trendDirection: 'neutral',
      priority: 'high',
      summary: 'Medtronic is not a primary competitor in BD\'s core infusion pump or pharmacy automation markets — Medtronic\'s device portfolio is concentrated in implantable devices, surgical navigation, and cardiac rhythm management. The infusion pump competitive landscape is defined by BD Alaris vs. Baxter Novum and ICU Medical Plum 360. However, Medtronic does compete with BD in adjacent areas: drug delivery (Medtronic insulin pump vs. BD pen needle/vial accessories in diabetes), and surgical robotic integration (where Medtronic\'s Hugo system intersects with BD\'s interventional navigation).\n\nBD\'s key competitive advantage vs. Medtronic-adjacent products: BD\'s hospital account relationships and GPO contract coverage create procurement efficiency advantages for hospital IDNs that prefer to consolidate medical-surgical supply vendors. BD\'s presence across infusion, pharmacy automation, specimen collection, and vascular access creates bundled contract opportunities that Medtronic\'s more specialized portfolio cannot replicate.',
      confidenceScore: 0.81,
      consoleLink: '/business-consoles/strategy',
      recommendations: [
        'Develop IDN bundled contract programs that combine Alaris infusion, Pyxis pharmacy automation, and BD Medical Essentials vascular access; bundled pricing through GPO channels creates stickier relationships than individual product sales',
        'Assess Medtronic Hugo surgical robot integration opportunities; BD interventional devices used in robotically-assisted procedures could be designed for Hugo compatibility — creating preferred supplier status in robotic surgery',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'Connected Care Revenue', impact: 'BD-Medtronic limited direct overlap; Alaris vs. Baxter/ICU the key infusion competition', trend: 'neutral' },
        { driver: 'Interventional Revenue', impact: 'Surgical navigation adjacency with Medtronic in Interventional sub-segments', trend: 'neutral' },
      ]),
    },
    {
      title: 'GPO and IDN Contract Coverage — BD\'s 90%+ GPO Formulary Presence Across Major Acute Care Contracts',
      category: 'Revenue & Market',
      insightLevel: 'L2',
      metricId: 'GPO Contract Coverage',
      kpiValue: 'BD >90% formulary presence on Vizient, Premier, HealthTrust GPO contracts; IDN sole-source rate 62%',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD maintains preferred or sole-source formulary positions on the three largest US hospital group purchasing organization (GPO) contracts — Vizient (approximately 3,300 member hospitals), Premier (approximately 4,000 members), and HealthTrust (approximately 1,600 members) — across its core Medical Essentials, Connected Care, and BioPharma Systems product categories. The >90% GPO formulary presence provides pricing stability and market access that is difficult for smaller competitors to overcome, as GPO-contracted pricing drives 70-80% of hospital procurement decisions.\n\nIDN sole-source contract rate of 62% — meaning 62% of BD\'s top-200 IDN relationships have BD as the sole-approved vendor in at least one core category — creates deep account retention and pricing power. IDN sole-source relationships generate approximately 15% higher revenue per hospital bed than non-sole-source relationships, as hospitals leverage BD for category optimization and product standardization services.',
      confidenceScore: 0.83,
      consoleLink: '/business-consoles/commercial',
      recommendations: [
        'Disclose GPO contract renewal timing and coverage by category; upcoming Vizient or Premier contract renewals are meaningful revenue events for BD\'s commercial organization and should be flagged to investors',
        'Develop a total cost of ownership analysis for BD\'s GPO customers; hospitals that standardize on BD across multiple categories reduce supply chain complexity and hidden costs — quantify the value in formal economic analysis',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'GPO Contract Coverage', impact: '>90% GPO formulary presence; 62% IDN sole-source rate; revenue stability', trend: 'positive' },
        { driver: 'Medical Essentials Revenue', impact: 'GPO presence underpins Medical Essentials 3-4% organic growth floor', trend: 'positive' },
      ]),
    },
    {
      title: 'BD Excellence Unleashed — Enterprise Transformation Beyond Manufacturing to Commercial Operations',
      category: 'Strategic',
      insightLevel: 'L2',
      metricId: 'BD Excellence Savings',
      kpiValue: 'Excellence Unleashed FY26: extending BD Excellence to commercial, clinical affairs, and supply chain',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD\'s "Excellence Unleashed" strategic initiative expands the proven BD Excellence lean system beyond manufacturing operations into commercial execution, clinical affairs, supply chain planning, and R&D portfolio management. While BD Excellence has generated $140-180M of annual manufacturing savings over the past 3-4 years, the Unleashed program identifies an additional $80-120M of potential annual savings in non-manufacturing processes by FY28 — bringing the total BD Excellence ecosystem savings potential to $260-300M+ annually.\n\nKey Excellence Unleashed commercial applications: sales force productivity optimization through BD Excellence daily management routines applied to territory planning and customer call cadence; clinical education program efficiency through standardized training module deployment; and supply chain demand-driven replenishment replacing MRP-based inventory management. BD\'s management estimates commercial BD Excellence drives 5-8% improvement in revenue per sales representative in pilot markets — a high-value application of lean disciplines beyond the factory floor.',
      confidenceScore: 0.79,
      consoleLink: '/business-consoles/strategy',
      recommendations: [
        'Pilot Excellence Unleashed in 2-3 commercial regions before global rollout; the manufacturing BD Excellence model required a 3-5 year maturation period — plan for a similar ramp in commercial applications',
        'Quantify the revenue-per-sales-rep improvement from commercial BD Excellence in pilot markets; if 5-8% productivity improvement is validated, scaling across the full salesforce generates $120-180M of revenue uplift equivalent',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'BD Excellence Savings', impact: 'Excellence Unleashed adds $80-120M non-manufacturing savings by FY28', trend: 'positive' },
        { driver: 'Adjusted Operating Margin', impact: 'Commercial and supply chain Excellence extends 25%+ margin trajectory', trend: 'positive' },
      ]),
    },
    {
      title: 'International Market Expansion — Emerging Markets +7.2% Organic; Europe Solid Despite VoBP-Type Headwinds',
      category: 'Revenue & Market',
      insightLevel: 'L2',
      metricId: 'International Revenue',
      kpiValue: 'Emerging markets +7.2% organic Q2 FY26; Europe +4.8% organic; International ex-China 55% of revenue',
      trendDirection: 'up',
      priority: 'high',
      summary: 'BD\'s international segment (excluding China VoBP headwind) delivered strong organic growth in Q2 FY26: emerging markets (Latin America, Southeast Asia, Middle East, Africa) grew +7.2% organic on expanding hospital infrastructure investment and BD\'s market development programs. Europe grew +4.8% organic despite healthcare budget headwinds in certain markets, reflecting BD\'s strong GPO and national tender coverage across Western Europe and BioPharma Systems demand from European pharmaceutical manufacturers.\n\nInternational revenue excluding China represents approximately 55% of BD\'s total continuing operations revenue, providing significant geographic diversification away from the US acute care market. BD\'s international infrastructure — 22 manufacturing sites outside the US, regulatory affairs teams in 45+ countries, and direct sales forces in 50+ markets — creates competitive barriers to entry that smaller medical device companies cannot overcome.',
      confidenceScore: 0.84,
      consoleLink: '/business-consoles/international',
      recommendations: [
        'Accelerate market development investment in India; the Indian hospital infrastructure build-out represents a 10-15 year structural growth opportunity for BD\'s vascular access, specimen management, and BioPharma systems portfolios',
        'Provide an international revenue bridge separating China VoBP headwind from ex-China international growth; the international ex-China growth quality is materially better than the blended international figure',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'International Revenue', impact: 'Emerging markets +7.2% organic; Europe +4.8%; geographic diversification', trend: 'positive' },
        { driver: 'China VoBP Impact', impact: 'China VoBP -14% FXN partially offsets strong ex-China international', trend: 'negative' },
      ]),
    },
    {
      title: 'R&D Investment Rate — BD Maintaining 5.8% R&D/Revenue; BioPharma Systems and Connected Care Prioritized',
      category: 'Strategic',
      insightLevel: 'L2',
      metricId: 'R&D Investment',
      kpiValue: 'R&D/revenue 5.8% FY26; $1.1B annualized; BioPharma Systems device innovation primary focus',
      trendDirection: 'neutral',
      priority: 'high',
      summary: 'BD invests approximately 5.8% of revenue in R&D — approximately $1.1B annualized in FY26 — focused on three innovation priority areas: (1) BioPharma Systems next-generation drug delivery devices (autoinjectors, prefillable syringe polymer formulations, combination device-drug platforms); (2) Connected Care digital health integration (Alaris smart pump software, Pyxis analytics, hemodynamic AI decision support); and (3) Interventional clinical innovation (single-use ureteroscopes, atherectomy device improvements, peripheral vascular access).\n\nBD\'s R&D rate of 5.8% is below the medtech industry average of 7-9% for growth-oriented large caps but is consistent with BD\'s portfolio mix: Medical Essentials (approximately 40% of revenue) is a consumables business where incremental product innovation drives modest R&D spending, and BioPharma Systems device innovation is capital-intensive but more focused on manufacturing process than basic research.',
      confidenceScore: 0.82,
      consoleLink: '/business-consoles/strategy',
      recommendations: [
        'Increase R&D disclosure by segment and by innovation type (sustaining vs. transformational); investors in BD\'s BioPharma Systems growth story need confidence that device innovation is adequately funded',
        'Evaluate R&D rate increase to 6.5-7% as BioPharma Systems becomes a larger share of revenue; device innovation in GLP-1 delivery systems requires sustained investment to maintain competitive leadership',
      ],
      relatedDrivers: JSON.stringify([
        { driver: 'R&D Investment', impact: '$1.1B FY26 R&D; 5.8% rate; BioPharma Systems and Connected Care prioritized', trend: 'neutral' },
        { driver: 'BioPharma Systems Revenue', impact: 'R&D investment sustains BD\'s GLP-1 device technology leadership', trend: 'positive' },
      ]),
    },

  ];

  let count = 0;
  for (const insight of insights) {
    await prisma.personalizedInsight.create({
      data: {
        companyId,
        title: insight.title,
        category: insight.category,
        insightLevel: insight.insightLevel,
        metricId: insight.metricId,
        kpiValue: insight.kpiValue,
        trendDirection: insight.trendDirection,
        priority: insight.priority,
        summary: insight.summary,
        confidenceScore: insight.confidenceScore,
        consoleLink: insight.consoleLink,
        recommendations: insight.recommendations as unknown as any,
        relatedDrivers: insight.relatedDrivers as unknown as any,
      },
    });
    count++;
  }

  console.log(`  Seeded ${count} BD expanded insights (Q2 FY26 coverage)`);
}
