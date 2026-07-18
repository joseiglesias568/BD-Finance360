import { PrismaClient } from '@prisma/client';

// Seed 26: Expanded Executive Commentary — Becton, Dickinson and Company (NYSE: BDX)
// ~22 commentary entries covering Q1-Q4 FY25 and Q1-Q2 FY26.
//
// Authors: Thomas E. Polen (President & CEO), Christopher J. DelOrefice (CFO),
//   and segment presidents/GMs for Medical Essentials, Connected Care,
//   BioPharma Systems, and Interventional.
//
// BD fiscal year ends September 30:
//   Q1 FY25 = Oct-Dec 2024 | Q2 FY25 = Jan-Mar 2025
//   Q3 FY25 = Apr-Jun 2025 | Q4 FY25 = Jul-Sep 2025
//   Q1 FY26 = Oct-Dec 2025 | Q2 FY26 = Jan-Mar 2026

export async function seedExpandedCommentary(prisma: PrismaClient, companyId: number) {
  console.log('Seeding expanded BD commentary (~22 entries, FY25-FY26)...');

  const driverNameToId = new Map<string, number>();
  const driverLookupNames = [
    'BioPharma Systems Revenue',
    'Connected Care Revenue',
    'Medical Essentials Revenue',
    'Interventional Revenue',
    'Alaris Consent Decree',
    'China VoBP Impact',
    'FX Impact',
    'BD Excellence Savings',
    'Adjusted Operating Margin',
    'Adjusted EPS',
    'Net Debt to EBITDA',
    'Operating Cash Flow',
    'Total Revenue',
    'Portfolio Transformation',
    'GPO Contract Coverage',
    'R&D Investment',
    'International Revenue',
    'Dividend and Capital Return',
    'Capital Expenditure',
  ];
  for (const name of driverLookupNames) {
    const driver = await prisma.consoleDriver.findFirst({
      where: { console: { companyId }, name },
      select: { id: true },
    });
    if (driver) driverNameToId.set(name, driver.id);
  }

  const commentary = [

    // =========================================================================
    // Q1 FY25 PERSPECTIVES (4 entries)
    // =========================================================================
    {
      title: 'Q1 FY25 — BioPharma Systems GLP-1 Demand: BD\'s Strategic Position in the Drug Delivery Supercycle',
      content: `## Q1 FY25 — BioPharma Systems and the GLP-1 Drug Delivery Opportunity

The GLP-1 receptor agonist market is creating the most significant demand inflection BD has seen in drug delivery devices in the company's 125-year history. Q1 FY25 BioPharma Systems segment results — +9.8% organic growth — demonstrate that the inflection is underway, but the majority of the demand ramp is still ahead of us.

**President & CEO (Thomas E. Polen):**

BD is not simply a beneficiary of GLP-1 drug demand — we are an enabling infrastructure for it. Novo Nordisk and Eli Lilly cannot deliver their GLP-1 drugs to patients without high-quality, pharmaceutical-grade prefillable syringes and autoinjector devices that meet FDA combination product requirements. BD's BioPharma Systems segment is one of a small number of suppliers globally that has the scale, quality track record, and drug-device compatibility validated library to serve as a primary supplier to the world's largest pharmaceutical companies.

In Q1 FY25, BioPharma Systems grew +9.8% organically — driven by GLP-1 order increases, volume commitments from existing customers, and first purchase orders from a new GLP-1 manufacturer entering the market. Our backlog for prefillable syringe delivery commitments entering Q1 FY25 was the highest in segment history, exceeding $1.8B in identified future orders.

**CFO Perspective (Christopher J. DelOrefice):**

The financial profile of BioPharma Systems is compelling: the segment generates above-corporate-average gross margins (prefillable syringe and autoinjector products carry 55-60% gross margins vs. the company's ~52% blended rate), has a high proportion of contracted multi-year revenue, and benefits from limited new entrant risk due to FDA combination product qualification barriers. Every percentage point of BioPharma Systems in our revenue mix is accretive to BD's overall margin profile. At our current trajectory — BioPharma Systems growing 2-3× faster than total BD — this segment will represent a meaningfully larger share of revenue by FY28 and will be a primary driver of our 25%+ adjusted operating margin target.`,
      contentPlain: 'BioPharma Systems Q1 FY25 +9.8% organic. BD as infrastructure for GLP-1: prefillable syringe and autoinjector supply to Novo Nordisk, Eli Lilly. Backlog >$1.8B entering Q1 FY25. BioPharma Systems gross margins 55-60% vs company 52% blended. Segment growing 2-3× total BD rate; primary driver of 25%+ margin target.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Strategic',
      tags: ['q1-fy25', 'biopharma-systems', 'glp-1', 'drug-delivery', 'prefillable-syringe', 'organic-growth'],
      relatedKPIs: ['BioPharma Systems Revenue', 'Adjusted Operating Margin', 'Total Revenue'],
      relatedConsoles: ['biopharma-systems', 'financial-performance'],
      relatedDrivers: ['BioPharma Systems Revenue', 'Adjusted Operating Margin'],
      fiscalPeriod: 'Q1 FY25',
      periodType: 'quarter',
      priority: 'critical',
      commentaryType: 'strategy',
    },
    {
      title: 'Q1 FY25 — Alaris Consent Decree: Remediation Progress and the Path to Connected Care Revenue Recovery',
      content: `## Q1 FY25 — BD Alaris Consent Decree Remediation Update

The BD Alaris infusion system consent decree — entered with the FDA in 2020 — has been the most significant operational and financial constraint on BD's Connected Care segment for the past four years. Q1 FY25 marks a meaningful milestone: the remediation program has reached 65% completion, and BD received its first conditional FDA clearance to resume shipments to a defined subset of hospital accounts.

**President, Connected Care (internal segment perspective):**

The 2020 consent decree required BD to address software architecture deficiencies, post-market surveillance gaps, and quality management system inconsistencies in the Alaris platform. Our remediation program — executed by a dedicated team of 1,200+ engineering, quality, and regulatory professionals — has redesigned the Alaris software architecture from the ground up, implemented a new BD Alaris MX system software that addresses every FDA-identified deficiency, and rebuilt the quality management infrastructure around a 21 CFR Part 820 compliant Quality Management System platform.

At 65% completion entering Q1 FY25, the remaining remediation activities are primarily: (1) long-term field performance data collection on updated Alaris MX units — a time-dependent milestone requiring 12-18 months of post-market surveillance data; (2) third-party quality system audit completion; and (3) final FDA review of our Master Validation File submission. We expect these activities to complete by end of FY26.

**CFO Perspective (Christopher J. DelOrefice):**

The financial cost of the consent decree since 2020 has been material: estimated $600-700M of lost revenue annually in US Alaris system sales that could not be transacted, plus $400M+ of remediation costs. The pent-up demand created during this period — hospitals that have deferred infusion system capital purchases waiting for the consent decree to resolve — represents a significant revenue recovery opportunity. We estimate the Alaris pent-up demand backlog at 400-500 hospital accounts, each representing $800K-$1.5M of capital equipment opportunity, plus multi-year service and software subscription revenue.`,
      contentPlain: 'Alaris consent decree: 65% complete Q1 FY25. Remaining: field performance data (12-18 months), QMS audit, FDA Master Validation File review. Full resolution target end FY26. Financial cost since 2020: $600-700M annual lost revenue + $400M+ remediation costs. Pent-up demand: 400-500 hospital accounts, $800K-$1.5M capital each.',
      authorName: 'Christopher J. DelOrefice',
      authorRole: 'Executive Vice President and CFO',
      category: 'Risk & Compliance',
      tags: ['q1-fy25', 'alaris', 'consent-decree', 'fda', 'connected-care', 'remediation', 'infusion'],
      relatedKPIs: ['Alaris Consent Decree', 'Connected Care Revenue'],
      relatedConsoles: ['connected-care', 'enterprise-risk'],
      relatedDrivers: ['Alaris Consent Decree', 'Connected Care Revenue'],
      fiscalPeriod: 'Q1 FY25',
      periodType: 'quarter',
      priority: 'critical',
      commentaryType: 'analysis',
    },
    {
      title: 'Q1 FY25 — BD Excellence System: From Lean Manufacturing to Enterprise Performance Culture',
      content: `## Q1 FY25 — BD Excellence: Building a Durable Operational Advantage

BD Excellence — our enterprise-wide lean continuous improvement system — is not a cost-cutting program. It is a fundamental management operating system that defines how BD plans, executes, and improves every business process. Q1 FY25 marks the 5th year of systematic BD Excellence deployment across our global manufacturing network, and the first year of the Excellence Unleashed expansion into commercial and supply chain operations.

**President & CEO (Thomas E. Polen):**

BD Excellence is modeled on the Toyota Production System but adapted for a complex medtech company with 60+ manufacturing sites, 50+ countries of commercial operation, and 70,000+ associates. The core tools — tiered daily management (TDM), value stream mapping (VSM), standard work, and kaizen — are deployed consistently across every plant and increasingly across our commercial organizations.

In FY25, BD Excellence manufacturing sites are achieving: 92% schedule adherence (on-time production to plan) vs. 74% pre-BE baseline; 35% reduction in manufacturing defects (customer complaint rate) vs. FY19 baseline; and 18% improvement in direct labor productivity as standard work eliminates non-value-added activity. These metrics translate directly into margin: each 1% improvement in direct labor productivity across BD's manufacturing network generates approximately $15-20M of annual savings.

The Excellence Unleashed commercial pilot — deployed in 3 US sales regions in Q1 FY25 — is showing early results: territory planning efficiency improved 12%, customer call effective coverage rate improved from 68% to 79%, and revenue per sales representative increased 6.8% vs. non-pilot regions after controlling for product mix. If these results sustain through a full year, scaling Excellence Unleashed to the full US commercial organization would generate $80-100M of revenue-equivalent productivity improvement.`,
      contentPlain: 'BD Excellence: 5th year manufacturing deployment, first year Excellence Unleashed commercial expansion. Manufacturing results: 92% schedule adherence (vs 74% pre-BE), -35% defect rate, +18% labor productivity. Each 1% productivity = $15-20M savings. Excellence Unleashed commercial pilot (3 US regions): +12% territory efficiency, call coverage 68%→79%, +6.8% revenue per rep vs control. Scale potential: $80-100M revenue-equivalent.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Operations & Service Delivery',
      tags: ['q1-fy25', 'bd-excellence', 'lean', 'continuous-improvement', 'manufacturing', 'commercial-excellence'],
      relatedKPIs: ['BD Excellence Savings', 'Adjusted Operating Margin'],
      relatedConsoles: ['operations', 'financial-performance'],
      relatedDrivers: ['BD Excellence Savings', 'Adjusted Operating Margin'],
      fiscalPeriod: 'Q1 FY25',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'analysis',
    },
    {
      title: 'Q1 FY25 — China VoBP Pricing Headwind: Strategic Response and Portfolio Repositioning',
      content: `## Q1 FY25 — China Volume-Based Procurement: Managing the Pricing Headwind

China's Volume-Based Procurement (VoBP) program — originally designed for pharmaceutical drugs — has expanded into medical devices, with BD's blood collection tubes and IV catheters among the first device categories subject to government-negotiated price reductions. Q1 FY25 marks the first full quarter of VoBP pricing in blood collection for BD China, and the financial impact is as significant as guided.

**President & CEO (Thomas E. Polen):**

China represents approximately 9% of BD's total revenue — meaningful exposure, but not existential. The VoBP program creates a -14% FXN price headwind on affected categories, partially offset by the volume commitments that VoBP contracts mandate: participating hospitals commit to sourcing 70-80% of their blood collection volume from the VoBP-contracted supplier. BD has chosen to participate in VoBP to maintain market access and the customer relationships that create future upsell opportunities in non-VoBP categories.

Our strategic response to China VoBP is a portfolio repositioning: we are accelerating the commercial development of BD's China business in categories that are not currently subject to VoBP — specifically BioPharma Systems drug delivery devices for Chinese pharmaceutical manufacturers, Interventional peripheral vascular and urology devices for tertiary hospitals, and Pyxis pharmacy automation for the expanding Chinese hospital pharmacy infrastructure. These categories carry significantly higher margins and are not on the current VoBP expansion roadmap.

**CFO Perspective (Christopher J. DelOrefice):**

The China VoBP financial impact for FY25 is estimated at -$160M to -$180M of revenue vs. pre-VoBP pricing, representing approximately -1.5 percentage points of total BD organic growth. We are managing this headwind by accelerating volume gains (the VoBP volume commitment partially offsets the price cut) and by restructuring our China cost base — reducing field sales headcount in VoBP-affected categories and reinvesting in pre-sales clinical specialists for non-VoBP product lines. The net China revenue impact is managed; the margin impact is more significant and is tracked separately in our segment management reporting.`,
      contentPlain: 'China VoBP: blood collection and IV catheter -14% FXN price cut Q1 FY25 impact. BD participating in VoBP to maintain market access. Strategic response: portfolio shift to BioPharma Systems, Interventional, Pyxis for China — non-VoBP categories at higher margins. Financial: -$160-180M revenue (-1.5pts organic). Managing via volume gains and China cost base restructuring.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Risk & Compliance',
      tags: ['q1-fy25', 'china', 'vobp', 'pricing', 'market-access', 'portfolio-repositioning'],
      relatedKPIs: ['China VoBP Impact', 'Medical Essentials Revenue', 'International Revenue'],
      relatedConsoles: ['international', 'financial-performance'],
      relatedDrivers: ['China VoBP Impact', 'Medical Essentials Revenue'],
      fiscalPeriod: 'Q1 FY25',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'analysis',
    },

    // =========================================================================
    // Q2 FY25 PERSPECTIVES (4 entries)
    // =========================================================================
    {
      title: 'Q2 FY25 — BioPharma Systems Capacity Expansion: CapEx Commitment and Long-Term Supply Strategy',
      content: `## Q2 FY25 — BioPharma Systems Capacity Investment Decision

Q2 FY25 is the quarter in which BD's Board of Directors approved the $600M BioPharma Systems capacity expansion CapEx program for FY26-FY28 — the largest single organic investment in BD's recent history and a direct response to the GLP-1 prefillable syringe demand inflection.

**President & CEO (Thomas E. Polen):**

The $600M CapEx decision reflects our conviction that GLP-1 demand is not a short-cycle bubble — it is a structural, multi-decade demand signal driven by the chronic disease burden of obesity and type 2 diabetes globally. Our customer conversations with Novo Nordisk, Eli Lilly, and multiple other pharmaceutical companies developing GLP-1 and related injectable biologics indicate demand that outpaces current and planned manufacturing capacity across the entire prefillable syringe supply chain.

The capacity expansion adds two new production lines at our Durham, NC facility — focused on high-quality glass prefillable syringes with BD Neopak coating — and a major expansion at our Le Pont-de-Claix, France facility for polymer insert-needle syringe systems favored by certain GLP-1 autoinjector designs. Together, these additions increase BioPharma Systems annual capacity by approximately 1.2B syringe units — a 35% increase from our current footprint.

The CapEx is underwritten by a combination of long-term supply agreements (representing approximately 65% of the new capacity) and projected market demand (35%). The 65% contracted coverage materially de-risks the investment and provides CFO-level justification at our Board's required 12% WACC hurdle rate.

**CFO Perspective (Christopher J. DelOrefice):**

The $600M over 3 years elevates BD's total CapEx by approximately $300-350M annually above our normalized $950M-$1.0B sustaining CapEx rate. Free cash flow is reduced during FY26-FY28 accordingly, but the return profile justifies the investment: at 55-60% gross margins on incremental BioPharma Systems syringe volume and a 5-year payback, the program generates returns significantly above our cost of capital. We expect BioPharma Systems CapEx to normalize post-FY28, improving free cash flow conversion back toward 90%+ of adjusted net income.`,
      contentPlain: 'Board approval Q2 FY25: $600M BioPharma Systems CapEx FY26-FY28. Two new Durham NC lines (BD Neopak glass) + Le Pont-de-Claix polymer expansion. +1.2B units (+35% capacity). 65% contracted demand, 35% market projection. CapEx elevates above normalized $950M-$1B by $300-350M/year. Gross margin 55-60% on incremental volume; 5-year payback; above WACC hurdle. FCF conversion normalizes post-FY28.',
      authorName: 'Christopher J. DelOrefice',
      authorRole: 'Executive Vice President and CFO',
      category: 'Financial Performance',
      tags: ['q2-fy25', 'biopharma-systems', 'capex', 'capacity-expansion', 'glp-1', 'supply-agreements'],
      relatedKPIs: ['BioPharma Systems Revenue', 'Capital Expenditure', 'Operating Cash Flow'],
      relatedConsoles: ['biopharma-systems', 'financial-performance'],
      relatedDrivers: ['BioPharma Systems Revenue', 'Capital Expenditure'],
      fiscalPeriod: 'Q2 FY25',
      periodType: 'quarter',
      priority: 'critical',
      commentaryType: 'strategy',
    },
    {
      title: 'Q2 FY25 — Interventional Segment: Peripheral Vascular Growth and Competitive Differentiation',
      content: `## Q2 FY25 — Interventional: Building a Competitive Medtech Franchise

BD's Interventional segment — which became a standalone reporting unit following the CareFusion integration — has matured into a meaningful revenue contributor with improving organic growth and competitive positions in peripheral vascular, urology, and surgery. Q2 FY25 segment organic growth of +4.6% reflects the underlying procedure volume recovery in ambulatory surgery centers and hospital catheterization labs.

**President, Interventional (BD segment leadership):**

Peripheral vascular is our Interventional growth engine. The peripheral artery disease (PAD) population in the US — estimated at 8.5M Americans — is undertreated: fewer than 40% of patients with clinically significant PAD receive revascularization therapy. BD's atherectomy devices (Rotarex mechanical thrombectomy and HawkOne directional atherectomy) address the calcified plaque burden that makes balloon angioplasty alone insufficient in a significant portion of PAD cases.

Our competitive positioning in peripheral vascular: BD's Rotarex rotational mechanical thrombectomy system holds the leading position in acute limb ischemia and chronic total occlusion treatment in Europe, with a growing US presence following FDA clearance. In atherectomy, BD competes primarily with Medtronic (IN.PACT balloon) and Cardiovascular Systems Inc. (CSI, acquired by Abbott) in orbital atherectomy. BD's HawkOne directional approach is clinically differentiated for eccentric plaque morphologies, driving above-market growth in interventional practices that treat complex PAD cases.

Urology is our second Interventional growth driver. BD's single-use flexible ureteroscope (BD Liberator) is gaining rapid adoption as hospitals move away from reusable scopes following contamination incidents and the regulatory pressure from the FDA's Duodenoscope safety actions. The economics of single-use urology scopes are compelling for hospitals: elimination of reprocessing costs ($400-600 per reusable scope cycle), elimination of scope breakage repair costs, and elimination of cross-contamination risk more than offset the per-procedure cost premium of single-use devices.`,
      contentPlain: 'Interventional Q2 FY25 +4.6% organic. Peripheral vascular: PAD 8.5M US patients, <40% treated. BD Rotarex (mechanical thrombectomy) + HawkOne (directional atherectomy). Competition: Medtronic IN.PACT, Abbott (CSI) orbital atherectomy. Urology: BD Liberator single-use ureteroscope gaining share on reusable contamination risk. Reprocessing economics: $400-600/cycle eliminated + scope breakage + contamination risk.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Revenue & Market',
      tags: ['q2-fy25', 'interventional', 'peripheral-vascular', 'atherectomy', 'urology', 'single-use', 'pad'],
      relatedKPIs: ['Interventional Revenue', 'Total Revenue'],
      relatedConsoles: ['interventional', 'commercial'],
      relatedDrivers: ['Interventional Revenue'],
      fiscalPeriod: 'Q2 FY25',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'analysis',
    },
    {
      title: 'Q2 FY25 — FX Headwinds: EUR, JPY, CNY Impact Analysis and Natural Hedge Strategy',
      content: `## Q2 FY25 — Foreign Exchange Exposure and Hedging Strategy

BD generates approximately 57% of revenue outside the United States, creating substantial foreign currency exposure. Q2 FY25 FX headwinds of -2.8 percentage points on reported revenue — versus the -3.1 point headwind in Q2 FY26 — represent the ongoing impact of a structurally stronger USD environment on BD's international revenue base.

**CFO Perspective (Christopher J. DelOrefice):**

BD's three primary FX exposures are the euro (EUR), Japanese yen (JPY), and Chinese renminbi (CNY/RMB). Together, these three currencies represent approximately 65% of BD's non-USD revenue: EUR at approximately 28% of total revenue, JPY at approximately 7%, and CNY at approximately 9% (though CNY-denominated revenue is partially offset by CNY-denominated manufacturing costs at our China facilities).

Our FX management approach: BD uses a rolling 12-month hedging program covering approximately 50-60% of forecasted EUR and JPY net exposure using forward contracts and purchased options. CNY is less efficiently hedgeable due to capital controls; we rely on natural hedge (CNY revenue vs. CNY costs) for the majority of our China exposure. The natural hedge ratio in China is approximately 55% — meaning for every $1 of CNY revenue, we have approximately $0.55 of CNY costs, resulting in a net $0.45 exposure per dollar of China revenue.

The USD strengthening trend in FY25 reflects Federal Reserve monetary policy divergence from the European Central Bank and Bank of Japan. If the Fed pivots to rate cuts and the ECB holds, EUR/USD could recover toward 1.12-1.15 — which would represent a meaningful FX tailwind for BD relative to the 1.07 average rate environment of Q2 FY26. Each 0.01 change in EUR/USD impacts BD's annual reported revenue by approximately $70-80M and adjusted EPS by approximately $0.05.`,
      contentPlain: 'BD FX exposure: EUR ~28% of revenue, CNY ~9%, JPY ~7%. Hedge strategy: rolling 12-month program covering 50-60% of EUR and JPY net exposure via forwards/options. CNY: natural hedge ~55% (CNY costs offset CNY revenue). Q2 FY25 headwind: -2.8pts. EUR/USD: each 0.01 move = ~$70-80M revenue / ~$0.05 EPS. Fed/ECB divergence primary driver of 2025-2026 USD strength.',
      authorName: 'Christopher J. DelOrefice',
      authorRole: 'Executive Vice President and CFO',
      category: 'Financial Performance',
      tags: ['q2-fy25', 'fx', 'foreign-exchange', 'eur', 'jpy', 'cny', 'hedging', 'international'],
      relatedKPIs: ['FX Impact', 'Total Revenue', 'Adjusted EPS'],
      relatedConsoles: ['financial-performance', 'international'],
      relatedDrivers: ['FX Impact', 'Total Revenue'],
      fiscalPeriod: 'Q2 FY25',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'analysis',
    },
    {
      title: 'Q2 FY25 — Medical Essentials: GPO Contract Strategy and Hospital Procurement Relationships',
      content: `## Q2 FY25 — Medical Essentials: Commercial Strategy and Hospital Procurement Penetration

BD's Medical Essentials segment — vascular access, specimen collection, and medication management — is the foundation of BD's hospital account relationships. With +3.5% organic growth in Q2 FY25 and >90% GPO formulary presence across Vizient, Premier, and HealthTrust, Medical Essentials demonstrates the commercial stability that anchors BD's enterprise account strategy.

**President, Medical Essentials (BD segment leadership):**

BD Medical Essentials competes in markets characterized by high switching costs and procurement consolidation. Hospitals that standardize on BD vascular access (Nexiva IV catheters, BD PowerPICC, BD Vectra PICC) derive measurable clinical benefits: our integrated vascular access device kits reduce catheter-associated bloodstream infection (CLABSI) rates by an average of 23% vs. non-BD protocols — a clinical outcome that reduces length of stay, readmission risk, and liability for hospital IDN quality officers.

The CLABSI reduction data creates a clinical economics argument that transcends GPO price competition: a 23% reduction in CLABSI at an IDN with 10,000 annual central line days prevents approximately 18-20 CLABSIs, each costing the hospital $45,000-$70,000 in treatment cost, readmission penalties, and potential litigation exposure. The economic value of BD vascular access clinical protocols far exceeds any competitive price difference.

Our GPO contract renewal strategy for FY25-FY26: we are prioritizing multi-category contract renewals that bundle vascular access, specimen management, and injection/aspiration together under a single consolidated contract. IDNs that adopt the BD multi-category bundle receive preferred pricing and BD Excellence Lean Sigma clinical program support — driving both revenue retention and deeper IDN relationship development.

**CFO Perspective (Christopher J. DelOrefice):**

Medical Essentials generates highly predictable revenue: consumable products (IV catheters, blood tubes, lancets, needles) are purchased weekly by hospitals based on procedure volumes. This predictability creates the earnings stability that offsets the higher-variance growth profile of BioPharma Systems and Connected Care capital equipment cycles.`,
      contentPlain: 'Medical Essentials Q2 FY25 +3.5% organic. BD vascular access CLABSI reduction 23% vs non-BD protocols. Economic value: 18-20 CLABSIs prevented per 10K central line days × $45-70K each = $800K-$1.4M IDN value annually. GPO strategy: multi-category bundle (vascular access + specimen + injection) for preferred pricing + BD Excellence clinical support. Medical Essentials earnings: predictable weekly consumable demand offsets BioPharma Systems and Connected Care capital variability.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Revenue & Market',
      tags: ['q2-fy25', 'medical-essentials', 'gpo', 'vascular-access', 'clabsi', 'idt', 'specimen-collection'],
      relatedKPIs: ['Medical Essentials Revenue', 'GPO Contract Coverage'],
      relatedConsoles: ['medical-essentials', 'commercial'],
      relatedDrivers: ['Medical Essentials Revenue', 'GPO Contract Coverage'],
      fiscalPeriod: 'Q2 FY25',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'analysis',
    },

    // =========================================================================
    // Q3 FY25 PERSPECTIVES (4 entries)
    // =========================================================================
    {
      title: 'Q3 FY25 — CFO Capital Structure Review: Waters Spin Rationale and Debt Deleveraging Path',
      content: `## Q3 FY25 — Capital Structure and the Waters Life Sciences Spin-Off Decision

Q3 FY25 marks the final quarter before BD's Board of Directors approved the Life Sciences segment spin-off in August 2025 — a decision that has significant implications for BD's financial structure, strategic focus, and shareholder value.

**CFO Perspective (Christopher J. DelOrefice):**

The decision to spin off BD's Life Sciences segment — which manufactures flow cytometry instruments, bioscience research reagents, and diagnostic systems under the Waters Life Sciences brand — was driven by a strategic clarity argument: Life Sciences serves academic research, clinical labs, and biopharma R&D customers with fundamentally different commercial models, growth profiles, and capital requirements than BD's medtech hospital-facing segments. Managing these two distinct businesses within one enterprise creates organizational complexity and cross-subsidization that reduces the performance of both.

The financial rationale: BD Life Sciences generated approximately $1.2B of annual revenue with an adjusted segment operating margin of approximately 20% — roughly 300-400bps below the margins of BD's medtech segments. By separating Life Sciences, BD's continuing operations adjusted operating margin baseline improves immediately by approximately 100-150bps without requiring any operational improvement — simply the mathematics of removing a below-average-margin segment.

Balance sheet benefit: the spin allows BD to attribute approximately $1.8-2.0B of long-term debt to the Waters Life Sciences entity upon separation, reducing BD's gross debt and improving the pro forma net leverage ratio from approximately 3.2× (pre-spin) to approximately 2.8-2.9× (post-spin). This deleveraging accelerates BD's path to the 2.5× net leverage target and improves the company's credit profile for future capital allocation decisions.

**President & CEO (Thomas E. Polen):**

Post-spin, BD is a cleaner, faster-growing medtech company — four continuing segments with coherent commercial models, shared hospital account customers, and overlapping manufacturing and distribution infrastructure. The focus benefits are real: our management team can now allocate 100% of strategic attention to Medical Essentials, Connected Care, BioPharma Systems, and Interventional, rather than splitting bandwidth with a Life Sciences business that has different competitive dynamics and investor base.`,
      contentPlain: 'Waters Life Sciences spin rationale: strategic clarity (research vs. medtech customers), financial math (Life Sciences 20% margin = 300-400bps below medtech segments; separation = +100-150bps to continuing ops margin). Balance sheet: $1.8-2.0B debt attributed to Waters, reducing BD net leverage 3.2× → 2.8-2.9×. Post-spin BD: four medtech segments, shared hospital customers, 100% management focus.',
      authorName: 'Christopher J. DelOrefice',
      authorRole: 'Executive Vice President and CFO',
      category: 'Strategic',
      tags: ['q3-fy25', 'waters-spin', 'life-sciences', 'spin-off', 'capital-structure', 'leverage', 'portfolio-simplification'],
      relatedKPIs: ['Portfolio Transformation', 'Net Debt to EBITDA', 'Adjusted Operating Margin'],
      relatedConsoles: ['financial-performance', 'strategy'],
      relatedDrivers: ['Portfolio Transformation', 'Net Debt to EBITDA'],
      fiscalPeriod: 'Q3 FY25',
      periodType: 'quarter',
      priority: 'critical',
      commentaryType: 'strategy',
    },
    {
      title: 'Q3 FY25 — Alaris Consent Decree Progress: 72% Complete; FDA Engagement and Timeline Update',
      content: `## Q3 FY25 — BD Alaris Remediation: 72% Complete and FDA Milestone Review

Q3 FY25 represents the most significant Alaris consent decree milestone in three years: BD submitted its comprehensive Master Validation File (MVF) — a 50,000-page technical submission documenting all software architecture changes, design verification and validation testing, and quality management system improvements — to the FDA in July 2025. The MVF submission is the largest single deliverable of the remediation program and triggers the FDA's formal review process.

**President & CEO (Thomas E. Polen):**

The Alaris MVF submission is the culmination of four years of intensive engineering and quality work. The new Alaris MX software platform — which replaces the legacy architecture cited in the FDA's 2020 Warning Letter — has been rebuilt using a modern software development lifecycle (SDLC) process with full traceability from requirements through design, verification, validation, and post-market surveillance. Every software module has been reviewed against the FDA's 2022 Software as Medical Device (SaMD) guidance framework.

At 72% complete, the remaining remediation activities entering Q4 FY25 are: (1) FDA review and response to the MVF submission (estimated 6-9 months); (2) field data collection on updated Alaris MX units shipped under conditional clearance (minimum 12-month data window); and (3) a full-system FDA audit at our Raleigh, NC Alaris manufacturing facility, expected in H2 FY26. We remain confident in the end-of-FY27 full resolution timeline.

**CFO Perspective (Christopher J. DelOrefice):**

We are now shipping Alaris systems to a defined set of hospital accounts under a conditional clearance arrangement — approximately 200 hospital accounts in Q3 FY25, with planned expansion to 600+ by Q1 FY26. Each shipment generates initial capital revenue plus a long-term software subscription and service contract. The financial trajectory of the Alaris ramp is a step function: slow initial ramp under conditional clearance, followed by a larger step change on full consent decree resolution.`,
      contentPlain: 'Alaris MVF submitted July 2025 (50,000-page technical submission). 72% complete Q3 FY25. Remaining: FDA MVF review (6-9 months), 12-month field data on conditional clearance units, full-system FDA audit at Raleigh NC (H2 FY26). 200 hospital accounts shipping Q3 FY25, expanding to 600+ by Q1 FY26. Revenue: capital + multi-year software subscription + service contract per account.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Risk & Compliance',
      tags: ['q3-fy25', 'alaris', 'mvf', 'fda', 'consent-decree', 'remediation', 'connected-care', 'infusion'],
      relatedKPIs: ['Alaris Consent Decree', 'Connected Care Revenue'],
      relatedConsoles: ['connected-care', 'enterprise-risk'],
      relatedDrivers: ['Alaris Consent Decree', 'Connected Care Revenue'],
      fiscalPeriod: 'Q3 FY25',
      periodType: 'quarter',
      priority: 'critical',
      commentaryType: 'action-item',
    },
    {
      title: 'Q3 FY25 — International Revenue Growth: Emerging Markets Strategy and Europe GPO Leadership',
      content: `## Q3 FY25 — International Growth and Geographic Diversification

BD's international business — 57% of continuing operations revenue — is growing at a blended +5.8% organic rate in Q3 FY25, with emerging markets outperforming at +8.1% organic and Europe at +4.5% organic. This geographic diversification is a structural competitive advantage that reduces BD's dependence on US acute care capital cycles.

**President & CEO (Thomas E. Polen):**

Emerging market growth for BD is driven by two structural forces. First, expanding hospital infrastructure: countries across Southeast Asia (Vietnam, Indonesia, Philippines), Latin America (Brazil, Mexico, Colombia), and the Middle East (Saudi Arabia, UAE) are building tertiary care hospital capacity at 8-12% annual rates, creating growing demand for BD's acute care medical-surgical supply base. BD's direct sales infrastructure in 50+ countries and distribution partnerships in 30+ additional markets position us to serve this infrastructure build-out from day one of new hospital openings.

Second, rising care standards: as hospital accreditation standards improve in emerging markets (JCI, HIMSS, national quality programs), infection prevention protocols increasingly specify international-standard medical devices — vascular access kits, specimen collection systems, and safety-engineered injection devices that reduce sharps injury risk. BD's products are the reference standard for these protocols, creating a demand pull as hospitals upgrade their care quality programs.

Europe remains a cornerstone of BD's international business. European tender management and GPO relationships (pan-European agreements with hospital procurement organizations in Germany, France, UK, Italy) provide stable, multi-year contract revenue. BD's European manufacturing footprint (Le Pont-de-Claix France, Tempe Ireland, Fraga Spain) provides local supply chain resilience and regulatory efficiency for CE-marked products.`,
      contentPlain: 'International organic growth Q3 FY25: emerging markets +8.1%, Europe +4.5%, total international +5.8%. EM growth drivers: hospital infrastructure build (SE Asia, LatAm, Middle East) growing 8-12% annually; rising care standards driving international-standard device adoption. Europe: pan-European GPO agreements provide stable multi-year contract revenue. BD manufacturing footprint: France, Ireland, Spain for CE-marked products.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Revenue & Market',
      tags: ['q3-fy25', 'international', 'emerging-markets', 'europe', 'gpo', 'hospital-infrastructure', 'geographic-diversification'],
      relatedKPIs: ['International Revenue', 'Total Revenue', 'GPO Contract Coverage'],
      relatedConsoles: ['international', 'commercial'],
      relatedDrivers: ['International Revenue', 'Total Revenue'],
      fiscalPeriod: 'Q3 FY25',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'analysis',
    },
    {
      title: 'Q3 FY25 — R&D Portfolio: Drug Delivery Innovation, Connected Care Digital, and Interventional Pipeline',
      content: `## Q3 FY25 — Innovation Pipeline and R&D Investment Allocation

BD's $1.1B annualized R&D investment (5.8% of revenue) is allocated across a portfolio of sustaining innovations (product line extensions and quality improvements) and transformational programs (next-generation platforms that define new market categories). Q3 FY25 provides an update on three key pipeline programs.

**President & CEO (Thomas E. Polen):**

BioPharma Systems R&D priority — Next-generation BD Intevia autoinjector: We are developing the BD Intevia 2.0 autoinjector platform optimized specifically for the viscosity, dose volume, and self-injection ergonomics of next-generation GLP-1 formulations. Current GLP-1 drugs (semaglutide, tirzepatide) use 0.5-1.0mL doses at moderate viscosity. Next-generation GLP-1 drugs under development (oral and high-concentration injectable formulations) may require 0.5mL doses at 3-5× higher viscosity — demanding different injection force dynamics and needle gauge optimization. BD Intevia 2.0 is engineered for this next-generation profile and is in co-development with two pharmaceutical partners under confidential development agreements.

Connected Care R&D priority — Alaris AI-assisted dosing decision support: The new Alaris MX software platform includes an embedded AI module — "Alaris Guardian" — that uses machine learning to identify infusion pump alarm fatigue patterns, predict high-risk medication administration periods, and surface clinical decision support alerts to bedside nurses. Alaris Guardian is in a 4-hospital clinical pilot as of Q3 FY25, with data collection for FDA De Novo clearance pathway submission planned for FY26.

Interventional R&D priority — Single-use ureteroscope 2.0: Following the commercial success of BD Liberator, we are developing a second-generation single-use flexible ureteroscope with improved image quality (4K visualization) and increased deflection range for complex intrarenal anatomy. BD Liberator 2.0 is in design verification testing as of Q3 FY25, with planned US commercial launch in H1 FY27.`,
      contentPlain: 'BD R&D Q3 FY25 three priorities. BioPharma: BD Intevia 2.0 for high-viscosity next-gen GLP-1 formulations (co-development with 2 pharma partners under NDA). Connected Care: Alaris Guardian AI dosing decision support (4-hospital pilot; FDA De Novo planned FY26). Interventional: BD Liberator 2.0 single-use ureteroscope 4K + improved deflection (design verification; US launch H1 FY27).',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Strategic',
      tags: ['q3-fy25', 'rd', 'pipeline', 'intevia', 'alaris-guardian', 'liberator', 'innovation', 'drug-delivery'],
      relatedKPIs: ['R&D Investment', 'BioPharma Systems Revenue', 'Connected Care Revenue'],
      relatedConsoles: ['strategy', 'biopharma-systems'],
      relatedDrivers: ['R&D Investment', 'BioPharma Systems Revenue'],
      fiscalPeriod: 'Q3 FY25',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'strategy',
    },

    // =========================================================================
    // Q4 FY25 PERSPECTIVES (4 entries)
    // =========================================================================
    {
      title: 'Q4 FY25 — FY25 Full-Year Summary: Foundation for FY26 Accelerated Growth',
      content: `## Q4 FY25 — FY25 Performance Summary and FY26 Strategic Framework

FY25 was a year of strategic repositioning, capital commitment, and operational execution at BD. The decisions made in FY25 — Waters spin approval, Alaris MVF submission, BioPharma Systems CapEx commitment — set the foundation for the FY26 acceleration story.

**President & CEO (Thomas E. Polen):**

FY25 was defined by three decisions that position BD for sustained above-market growth. First, we approved the Waters Life Sciences spin — creating a cleaner, higher-growth, higher-margin BD focused on medtech. Second, we committed $600M in BioPharma Systems capacity expansion — a capital investment that signals conviction in the GLP-1 demand thesis and begins delivering incremental revenue capacity in FY27. Third, we submitted the Alaris Master Validation File — the pivotal regulatory milestone that puts the consent decree on a definitive resolution path.

The FY25 financial results: total organic growth of approximately +4.9%, at the midpoint of our +4-6% guidance range; adjusted operating margin of approximately 23.4%, 70bps of expansion on BD Excellence savings and favorable mix; adjusted EPS of approximately $11.68, consistent with guidance and demonstrating earnings durability during the Waters separation execution period.

**CFO Perspective (Christopher J. DelOrefice):**

FY26 guidance framework: adjusted EPS $12.52-$12.72 (+8% YoY), reflecting BioPharma Systems organic growth acceleration (+11%+ sustained), Alaris Connected Care ramp contribution (+$0.25-0.35 EPS), BD Excellence savings acceleration (+$0.30-0.40 EPS), partially offset by FX headwinds (-$0.35-0.45 EPS) and China VoBP (-$0.20-0.25 EPS). Adjusted operating margin target ~25% — approximately 60bps above FY25 on mix and BD Excellence. Capital allocation: $2.8B+ FCF → dividend ($1.1B), debt reduction ($1.0-1.3B toward 2.5× leverage), BioPharma CapEx ($1.3B total; $300-350M incremental to normalized CapEx).`,
      contentPlain: 'FY25 three strategic decisions: Waters spin approval, $600M BioPharma CapEx commitment, Alaris MVF submission. FY25 results: +4.9% organic, 23.4% adj. op margin (+70bps), $11.68 adj. EPS. FY26 guidance: adj. EPS $12.52-$12.72 (+8%); adj. op margin ~25% (+60bps). FY26 EPS bridge: BioPharma acceleration +$0.65-0.85, Alaris ramp +$0.25-0.35, BD Excellence +$0.30-0.40, offset by FX -$0.35-0.45, VoBP -$0.20-0.25. FCF $2.8B+ → dividend $1.1B, debt $1.0-1.3B, BioPharma CapEx $1.3B.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Financial Performance',
      tags: ['q4-fy25', 'fy25-close', 'guidance', 'eps', 'margin', 'waters-spin', 'alaris', 'biopharma-systems'],
      relatedKPIs: ['Adjusted EPS', 'Adjusted Operating Margin', 'Operating Cash Flow', 'Net Debt to EBITDA'],
      relatedConsoles: ['financial-performance', 'strategy'],
      relatedDrivers: ['Adjusted EPS', 'Adjusted Operating Margin', 'BD Excellence Savings'],
      fiscalPeriod: 'Q4 FY25',
      periodType: 'quarter',
      priority: 'critical',
      commentaryType: 'analysis',
    },
    {
      title: 'Q4 FY25 — BD Excellence Phase II: Commercial and Supply Chain Deployment Design',
      content: `## Q4 FY25 — Excellence Unleashed: Phase II Design and Rollout Plan

BD Excellence has generated $140M of FY25 manufacturing savings — meeting the annual target for the fifth consecutive year. The Q4 FY25 strategic priority is the formal design and launch planning for Phase II (Excellence Unleashed), which extends BD Excellence to commercial operations, supply chain planning, and clinical education by end of FY26.

**President & CEO (Thomas E. Polen):**

The decision to extend BD Excellence into commercial and supply chain follows a rigorous evaluation of where the largest non-manufacturing value creation opportunities exist. We engaged an external lean consulting partner to assess BD's commercial operations maturity — territory planning efficiency, call planning, customer time allocation, clinical educator effectiveness — and identified $80-120M of annual revenue-equivalent improvement potential in the US and Europe commercial organizations by FY28.

Phase II design priorities: (1) Commercial daily management (CDM) system deployed to all front-line sales managers — a structured daily performance review process using standardized visual management tools that identify territory performance gaps in real time; (2) Value stream mapping of the end-to-end order-to-cash process for Medical Essentials, identifying the 12-15 non-value-added steps that currently add 8-12 days to the order fulfillment cycle; (3) Supply chain demand-driven replenishment replacing MRP-based purchasing for consumable product lines — reducing inventory days-on-hand by 15-20% while improving service levels.

**CFO Perspective (Christopher J. DelOrefice):**

Phase II BD Excellence investments: approximately $25M of incremental investment in FY26 for consulting, training, and IT tools to support Excellence Unleashed deployment. The payback period on this investment — based on FY25 commercial pilot results — is estimated at 18-24 months. By FY28, we expect Excellence Unleashed to contribute $80-100M of commercial productivity improvement and $40-60M of supply chain cost reduction annually.`,
      contentPlain: 'Excellence Unleashed Phase II design Q4 FY25. FY25 manufacturing savings $140M (5th consecutive year at target). Commercial excellence potential: $80-120M revenue-equivalent by FY28. Phase II priorities: commercial daily management system, order-to-cash VSM (-8-12 days fulfillment), demand-driven supply chain (-15-20% DOH). Investment: $25M FY26; payback 18-24 months. Expected FY28: $80-100M commercial + $40-60M supply chain savings.',
      authorName: 'Christopher J. DelOrefice',
      authorRole: 'Executive Vice President and CFO',
      category: 'Financial Performance',
      tags: ['q4-fy25', 'excellence-unleashed', 'bd-excellence', 'commercial-excellence', 'supply-chain', 'lean'],
      relatedKPIs: ['BD Excellence Savings', 'Adjusted Operating Margin', 'Operating Cash Flow'],
      relatedConsoles: ['operations', 'financial-performance'],
      relatedDrivers: ['BD Excellence Savings', 'Adjusted Operating Margin'],
      fiscalPeriod: 'Q4 FY25',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'action-item',
    },
    {
      title: 'Q4 FY25 — Enterprise Risk Management: Regulatory, Competitive, and Supply Chain Risk Assessment',
      content: `## Q4 FY25 — Annual Enterprise Risk Review

BD's scale — $19B+ in annual revenue, 70,000+ associates, medical devices used in virtually every hospital in the developed world — creates enterprise risk exposures that require systematic management. The FY25 Annual Risk Assessment highlights four material risk categories.

**President & CEO (Thomas E. Polen):**

Risk 1 — FDA Regulatory and Consent Decree: The BD Alaris consent decree remains BD's most significant active regulatory risk. While we are 72% through remediation, any adverse development in the FDA review process (MVF rejection, new inspection findings, additional Warning Letters in other product areas) could extend the resolution timeline and impair Connected Care revenue recovery. BD has implemented a regulatory intelligence function that monitors FDA trends across all BD product categories and provides early warning of potential agency concerns.

Risk 2 — Competitive Disruption in BioPharma Systems: The GLP-1 prefillable syringe market is attracting new entrant investment from Gerresheimer, Stevanato Group, and SCHOTT Pharma — each building or expanding capacity to compete for GLP-1 supply contracts. BD's competitive moat (drug compatibility library, Intevia autoinjector platform, combination product regulatory expertise) must be continuously reinforced through R&D investment and long-term supply agreement negotiation.

Risk 3 — China Policy and VoBP Expansion: VoBP has expanded to blood collection and vascular access; future expansion to BioPharma Systems or Interventional categories would materially increase the headwind. BD monitors China National Healthcare Security Administration (NHSA) policy signals and has activated a scenario plan for VoBP expansion to the next tier of device categories.

Risk 4 — Supply Chain Concentration: BD's BioPharma Systems manufacturing is concentrated in two primary sites (Durham NC and Le Pont-de-Claix France). A natural disaster, labor action, or quality system event at either site could disrupt supply to GLP-1 pharmaceutical customers with contractual delivery commitments. BD is implementing a dual-site manufacturing qualification for its highest-volume GLP-1 syringe platforms to reduce single-site dependency.`,
      contentPlain: 'FY25 enterprise risks. Risk 1: Alaris FDA consent decree — 72% complete; MVF rejection or new findings would extend timeline. Risk 2: GLP-1 syringe competitive entry (Gerresheimer, Stevanato, SCHOTT); BD moat is drug library + Intevia + combo product expertise. Risk 3: China VoBP expansion to BioPharma Systems or Interventional — scenario plan activated. Risk 4: BioPharma Systems site concentration (Durham + Le Pont-de-Claix) — dual-site qualification underway.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Risk & Compliance',
      tags: ['q4-fy25', 'enterprise-risk', 'fda', 'alaris', 'china-vobp', 'supply-chain', 'competition', 'biopharma'],
      relatedKPIs: ['Alaris Consent Decree', 'China VoBP Impact', 'BioPharma Systems Revenue'],
      relatedConsoles: ['enterprise-risk', 'strategy'],
      relatedDrivers: ['Alaris Consent Decree', 'China VoBP Impact'],
      fiscalPeriod: 'Q4 FY25',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'context',
    },
    {
      title: 'FY25 Annual — Shareholder Return: Dividend Growth, Deleveraging, and Capital Allocation Framework',
      content: `## FY2025 Annual — Capital Allocation and Shareholder Return Strategy

BD has sustained more than 50 consecutive years of annual dividend increases — a record that defines long-term capital discipline and shareholder commitment. The FY25 Annual Report to shareholders articulates BD's capital allocation framework for the post-Waters, post-Alaris era.

**CFO Perspective (Christopher J. DelOrefice):**

BD's capital allocation framework is explicit and sequenced: (1) Sustaining CapEx — maintaining and improving the quality and efficiency of BD's manufacturing and commercial infrastructure ($700-800M annually); (2) Growth CapEx — organic investments generating returns above 12% WACC, including the BioPharma Systems capacity expansion ($600M FY26-FY28); (3) Dividend — sustaining 50+ year streak with 5-7% annual growth target ($3.72/share annualized FY26; $1.1B total); (4) Debt reduction — to 2.5× net leverage target by FY27; (5) Bolt-on M&A — when leverage permits, disciplined bolt-on acquisitions in BioPharma Systems drug delivery or Connected Care digital health; (6) Share repurchases — deprioritized until leverage is at or below 2.5× and M&A pipeline is clear.

This sequence reflects the current moment: BioPharma Systems is the highest-return organic investment opportunity in BD's history, and the Alaris consent decree resolution will create a Connected Care revenue recovery that requires installation capacity investment, not balance sheet optimization. When the investment cycle moderates (post-FY28), the capital allocation mix will shift toward buybacks.

The FY25 dividend of $3.51/share (annualized) was increased to $3.72/share for FY26 — a +6% increase that reflects our confidence in free cash flow durability despite elevated CapEx. The 50+ year dividend growth streak will be maintained through any foreseeable scenario within BD's current financial plan.`,
      contentPlain: 'Capital allocation sequence: (1) Sustaining CapEx $700-800M, (2) Growth CapEx (BioPharma $600M), (3) Dividend $3.72/share +6% (50+ year streak), (4) Debt to 2.5×, (5) Bolt-on M&A (BioPharma/Connected Care adjacencies), (6) Buybacks post-2.5× and post-investment cycle. Buybacks deprioritized until FY28+. Dividend +6% demonstrates FCF confidence despite elevated CapEx.',
      authorName: 'Christopher J. DelOrefice',
      authorRole: 'Executive Vice President and CFO',
      category: 'Financial Performance',
      tags: ['fy25-annual', 'capital-allocation', 'dividend', 'deleveraging', 'buyback', 'shareholder-return'],
      relatedKPIs: ['Dividend and Capital Return', 'Net Debt to EBITDA', 'Operating Cash Flow'],
      relatedConsoles: ['financial-performance'],
      relatedDrivers: ['Dividend and Capital Return', 'Operating Cash Flow'],
      fiscalPeriod: 'FY25',
      periodType: 'annual',
      priority: 'high',
      commentaryType: 'context',
    },

    // =========================================================================
    // Q1 FY26 AND Q2 FY26 PERSPECTIVES (6 entries)
    // =========================================================================
    {
      title: 'Q1 FY26 — Waters Life Sciences Spin Completed; BD Continuing Operations Margin Step-Change',
      content: `## Q1 FY26 — Post-Spin BD: First Quarter as a Focused Medtech Company

The Waters Life Sciences spin-off was completed in February 2026, with BD shareholders receiving one share of Waters Corporation Life Sciences for every 5 BD shares held. Q1 FY26 is the last quarter of combined reporting; beginning Q2 FY26, BD's financial results reflect only the four continuing segments (Medical Essentials, Connected Care, BioPharma Systems, Interventional).

**President & CEO (Thomas E. Polen):**

The spin completion marks a strategic turning point. BD is now unambiguously a medtech company — hospital-focused, procedure-volume-driven, with a clear growth thesis built on three pillars: the GLP-1 drug delivery supercycle (BioPharma Systems), the Alaris consent decree resolution and infusion system recovery (Connected Care), and steady share gains in Medical Essentials and Interventional underpinned by BD Excellence productivity. We are telling a single, coherent story to investors, customers, and associates.

The immediate financial benefit of the spin: Q1 FY26 BD continuing operations adjusted operating margin of 23.8% — approximately 130bps above what the combined company margin would have been, with Life Sciences included. This is purely the arithmetic of separating a below-average-margin business. By year-end FY26, with BD Excellence savings compounding and BioPharma Systems mix improving, we expect the ~25% adjusted operating margin target to be achieved.

**CFO Perspective (Christopher J. DelOrefice):**

The spin also improved BD's balance sheet immediately: approximately $1.9B of long-term debt was attributed to Waters Corporation Life Sciences and assumed by the new entity. BD's Q1 FY26 net leverage improved to approximately 2.85× from approximately 3.15× pre-spin — a meaningful step toward our 2.5× FY27 target. The spin-related one-time costs (legal, banking, separation IT) of approximately $85M were excluded from adjusted EPS and are non-recurring.`,
      contentPlain: 'Waters spin complete February 2026: 1 Waters share per 5 BD shares. BD Q1 FY26 adj. op margin 23.8% = +130bps vs combined company. Three pillar BD story: BioPharma Systems GLP-1 + Alaris recovery + ME/Interventional BD Excellence gains. Balance sheet: $1.9B debt assumed by Waters; BD net leverage 3.15× → 2.85×. Spin costs $85M excluded from adj. EPS (non-recurring).',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Strategic',
      tags: ['q1-fy26', 'waters-spin', 'spin-completion', 'margin-expansion', 'leverage', 'portfolio-transformation'],
      relatedKPIs: ['Portfolio Transformation', 'Adjusted Operating Margin', 'Net Debt to EBITDA'],
      relatedConsoles: ['financial-performance', 'strategy'],
      relatedDrivers: ['Portfolio Transformation', 'Adjusted Operating Margin'],
      fiscalPeriod: 'Q1 FY26',
      periodType: 'quarter',
      priority: 'critical',
      commentaryType: 'analysis',
    },
    {
      title: 'Q1 FY26 — Connected Care Alaris Ramp: 78% Consent Decree Complete; Hospital Account Conversion Accelerating',
      content: `## Q1 FY26 — Alaris Hospital Account Ramp: Converting the Backlog

Q1 FY26 marks the most active quarter of Alaris backlog conversion since the consent decree began. With 78% remediation complete and conditional clearance expanding to 600+ hospital accounts, BD's Connected Care team is executing the largest single-segment revenue ramp in recent company history.

**President, Connected Care (BD segment leadership):**

The Alaris consent decree partial clearance program has enabled us to ship new Alaris systems to 620 hospital accounts by end of Q1 FY26 — a significant acceleration from the 200 accounts reached by end of Q3 FY25. Each hospital account conversion follows a structured process: clinical evaluation, IT integration with hospital EMR (Epic or Cerner), pharmacy drug library configuration (BD DoseFlex), and installation by BD field service engineers. The process takes 8-12 weeks from order to first patient use.

The hospital accounts converting to Alaris MX in Q1 FY26 are predominantly large IDNs that had maintained their preference for Alaris despite the consent decree limitation — systems that valued the DoseFlex drug library depth, the Epic integration, and the Pyxis pharmacy automation ecosystem connection. These accounts represent the highest-value segment of the Alaris market: large IDNs with 1,000+ bed facilities and 5,000-10,000 infusion pump channels each.

Q1 FY26 Connected Care revenue: +6.8% organic, with Alaris contributing approximately 180bps of the organic growth. We expect the Alaris contribution to accelerate to 250-350bps of Connected Care organic growth in Q2-Q4 FY26 as the hospital account ramp broadens.

**CFO Perspective (Christopher J. DelOrefice):**

The financial model for Alaris hospital account conversion: initial capital revenue of $800K-$1.5M per IDN for hardware; followed by annual service contract revenue of $180-250K per IDN; followed by software subscription revenue of $100-150K per IDN annually. The recurring service and software streams are recognized ratably and build a durable, high-margin revenue base in Connected Care.`,
      contentPlain: 'Alaris backlog conversion Q1 FY26: 620 hospital accounts (from 200 in Q3 FY25). 8-12 week process per account (clinical eval, EMR integration, DoseFlex library config, installation). Accounts: predominantly large IDNs (1,000+ beds, 5,000-10,000 channels). Connected Care Q1 FY26 +6.8% organic; Alaris ~180bps contribution. Expect 250-350bps by Q2-Q4 FY26. Revenue model: $800K-$1.5M capital + $180-250K annual service + $100-150K software subscription/IDN.',
      authorName: 'Christopher J. DelOrefice',
      authorRole: 'Executive Vice President and CFO',
      category: 'Operations & Service Delivery',
      tags: ['q1-fy26', 'alaris', 'backlog', 'hospital-accounts', 'consent-decree', 'connected-care', 'infusion'],
      relatedKPIs: ['Alaris Consent Decree', 'Connected Care Revenue'],
      relatedConsoles: ['connected-care', 'commercial'],
      relatedDrivers: ['Alaris Consent Decree', 'Connected Care Revenue'],
      fiscalPeriod: 'Q1 FY26',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'action-item',
    },
    {
      title: 'Q1 FY26 — BioPharma Systems GLP-1 Order Backlog: $2.1B and Growing; Capacity Timeline Update',
      content: `## Q1 FY26 — BioPharma Systems: Record Backlog and Capacity Progress Update

BD's BioPharma Systems order backlog has reached $2.1B entering Q1 FY26 — a record high and an increase of approximately $300M vs. Q3 FY25. The backlog growth reflects accelerating GLP-1 drug volume commitments from existing customers and first-purchase-order additions from new GLP-1 drug developers entering the market.

**President & CEO (Thomas E. Polen):**

The $2.1B BioPharma Systems order backlog is the most tangible evidence of GLP-1 demand durability. These are not speculative orders — they represent contractual commitments from pharmaceutical companies who have FDA-approved GLP-1 drugs on market (or in Phase 3 trials) and need confirmed supply of prefillable syringe systems to support their commercial scale-up. The backlog extends delivery commitments through FY29 for several customers, providing BD with multi-year revenue visibility in our fastest-growing segment.

Capacity expansion progress as of Q1 FY26: the Durham, NC expansion is 35% complete — the building envelope is finished, clean-room construction is underway, and first production equipment is being installed. The Le Pont-de-Claix France expansion is 28% complete — site preparation and initial clean-room infrastructure installation. Both facilities are on schedule for first production from new capacity in Q2-Q3 FY27.

The capacity timeline creates a critical 6-9 month window in FY26 where backlog demand exceeds available production capacity. We are managing this by prioritizing delivery to customers with the largest contracted volume commitments and the longest-standing supply relationships, while communicating transparently with customers on delivery schedules.

**CFO Perspective (Christopher J. DelOrefice):**

Each quarter of the capacity constraint period delays approximately $100-150M of BioPharma Systems revenue that is contractually committed but cannot yet be produced. This deferred revenue will be recognized when new capacity comes online in FY27 — creating a step-change in BioPharma Systems quarterly revenue in H2 FY27 that is already visible in our financial planning.`,
      contentPlain: 'BioPharma Systems backlog $2.1B Q1 FY26 (record; +$300M vs Q3 FY25). Backlog: contractual commitments from FDA-approved GLP-1 manufacturers, delivery commitments through FY29. Capacity progress: Durham NC 35% complete (clean-room underway, equipment install beginning); Le Pont-de-Claix 28% (site prep, clean-room infrastructure). First production from new capacity Q2-Q3 FY27. Capacity constraint: ~$100-150M/quarter deferred revenue until FY27.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Revenue & Market',
      tags: ['q1-fy26', 'biopharma-systems', 'backlog', 'glp-1', 'capacity-expansion', 'durham', 'le-pont-de-claix'],
      relatedKPIs: ['BioPharma Systems Revenue', 'Capital Expenditure'],
      relatedConsoles: ['biopharma-systems', 'operations'],
      relatedDrivers: ['BioPharma Systems Revenue', 'Capital Expenditure'],
      fiscalPeriod: 'Q1 FY26',
      periodType: 'quarter',
      priority: 'high',
      commentaryType: 'analysis',
    },
    {
      title: 'Q2 FY26 — Q2 Results Deep Dive: Revenue $4,714M, Adj. EPS $2.90, Margin 24.2%',
      content: `## Q2 FY26 — Q2 FY26 Financial Results: Decomposition and Attribution

Q2 FY26 results — revenue $4,714M (+5.2% organic, +2.1% reported), adjusted operating margin 24.2%, adjusted EPS $2.90 — represent the strongest quarterly performance in BD's post-Waters history and demonstrate the effectiveness of the three strategic pillars: BioPharma Systems GLP-1 volume, Alaris Connected Care ramp, and BD Excellence margin expansion.

**President & CEO (Thomas E. Polen):**

The Q2 FY26 organic growth rate of +5.2% — above the +4-5% consensus expectation — reflects acceleration in BioPharma Systems (+11.4% organic) and Connected Care (+6.8% organic) that partially offset the -1.5 percentage point China VoBP drag on Medical Essentials. The FX headwind of -3.1 percentage points is the primary reason reported growth of +2.1% trails organic — the underlying business momentum is stronger than the headline revenue growth implies.

Segment performance: BioPharma Systems delivered its fifth consecutive quarter of double-digit organic growth, driven by GLP-1 prefillable syringe volume and the BD Intevia autoinjector ramp. Connected Care accelerated from +5.4% in Q1 FY26 to +6.8% in Q2, reflecting the broader Alaris hospital account ramp (620 accounts at end of Q1 to 890 accounts by end of Q2). Medical Essentials grew +3.9% organic — solid underlying performance masked by China VoBP in blood collection. Interventional at +4.2% organic is performing at the high end of its historical range.

Adjusted EPS of $2.90 was +9.4% YoY, driven by operating leverage on strong organic revenue growth and BD Excellence savings acceleration in the March quarter. H2 FY26 EPS trajectory requires approximately $6.42-$6.62 of total H2 adjusted EPS — achievable given the Alaris ramp continuation, BioPharma Systems sustained growth, and H2 BD Excellence acceleration.

**CFO Perspective (Christopher J. DelOrefice):**

The 24.2% Q2 FY26 adjusted operating margin represents 80bps of YoY improvement. The bridge: BD Excellence manufacturing savings (+120bps), BioPharma Systems mix improvement (+80bps), Waters spin-off margin contribution (+100bps on pro forma basis) — offset by FX margin headwind (-80bps) and China VoBP (-40bps). H2 FY26 margin target of approximately 25.6-26% requires the same drivers to continue — we have high confidence in BD Excellence trajectory and BioPharma Systems mix.`,
      contentPlain: 'Q2 FY26: Revenue $4,714M (+5.2% organic, +2.1% reported). FX: -3.1pts headwind. Alaris accounts: 620 end Q1 → 890 end Q2. Adj. op margin 24.2% (+80bps): BD Excellence +120bps, BioPharma mix +80bps, Waters spin +100bps, offset FX -80bps, VoBP -40bps. Adj. EPS $2.90 (+9.4%). H2 FY26 target: $6.42-$6.62 total H2 EPS. Segment organics: BioPharma +11.4%, Connected Care +6.8%, Interventional +4.2%, Medical Essentials +3.9%.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Financial Performance',
      tags: ['q2-fy26', 'quarterly-results', 'organic-growth', 'margin', 'eps', 'alaris', 'biopharma-systems'],
      relatedKPIs: ['Total Revenue', 'Adjusted EPS', 'Adjusted Operating Margin', 'Connected Care Revenue'],
      relatedConsoles: ['financial-performance', 'biopharma-systems'],
      relatedDrivers: ['Adjusted EPS', 'Total Revenue', 'Adjusted Operating Margin'],
      fiscalPeriod: 'Q2 FY26',
      periodType: 'quarter',
      priority: 'critical',
      commentaryType: 'analysis',
    },
    {
      title: 'Q2 FY26 — CFO Perspective: FX, VoBP Headwinds, and Full-Year $12.52-$12.72 EPS Guidance Confidence',
      content: `## Q2 FY26 — CFO Financial Guidance Commentary and FY26 EPS Bridge

Q2 FY26 adjusted EPS of $2.90 — $0.08 above the $2.82 consensus estimate — puts BD on track for the $12.52-$12.72 FY26 adjusted EPS guidance range. The following provides the granular EPS bridge and confidence level on each driver.

**CFO Perspective (Christopher J. DelOrefice):**

EPS bridge FY25 (~$11.68) to FY26 guidance ($12.52-$12.72, midpoint $12.62):

BioPharma Systems organic volume and mix (+$0.70-$0.90): GLP-1 syringe volume growth and BD Intevia autoinjector mix improvement are the largest single EPS driver. H2 FY26 trajectory is supported by the contracted backlog and continued demand from new GLP-1 market entrants. High confidence.

BD Excellence savings (+$0.30-$0.40): FY26 BD Excellence target of $180M annualized. Through Q2 FY26, approximately $85M of run-rate savings have been delivered — on track for the full year. High confidence.

Alaris Connected Care revenue ramp (+$0.25-$0.35): Hospital account conversions accelerating (620 end Q1, 890 end Q2, target 1,400+ by year-end). Revenue recognition continues as accounts activate. High confidence.

Waters spin-off margin improvement (+$0.20-$0.30): Pro forma continuing operations margin improvement vs. combined company. Fully recognized in FY26 results. Confirmed.

FX headwinds (-$0.35-$0.45): USD strengthening vs. EUR, JPY. Hedging covers approximately 50-60% of net exposure; residual open exposure creates earnings risk if USD strengthens further. Moderate risk.

China VoBP (-$0.20-$0.25): Blood collection and IV catheter price cuts effective in FY25; full-year FY26 impact fully incorporated in guidance. Volume offsets partially mitigating. Managed.

Interest expense and tax rate (neutral to +$0.05): Debt reduction from Waters spin improves interest expense. Tax rate approximately 17.5% FY26 assumption — no material change expected.

Net: midpoint $12.62 EPS. The guidance range $12.52-$12.72 captures the primary uncertainty around FX rate assumptions and the pace of Alaris hospital account activation in H2 FY26.`,
      contentPlain: 'Q2 FY26 adj. EPS $2.90 vs $2.82 consensus (+$0.08). FY26 EPS bridge vs FY25 ~$11.68: BioPharma +$0.70-0.90 (high confidence), BD Excellence +$0.30-0.40 ($85M delivered through Q2; on track), Alaris ramp +$0.25-0.35 (620→890→1,400+ accounts), Waters spin +$0.20-0.30 (confirmed), FX -$0.35-0.45 (moderate risk), VoBP -$0.20-0.25 (managed). Midpoint $12.62. Range $12.52-$12.72 captures FX and Alaris pace uncertainty.',
      authorName: 'Christopher J. DelOrefice',
      authorRole: 'Executive Vice President and CFO',
      category: 'Financial Performance',
      tags: ['q2-fy26', 'eps-guidance', 'eps-bridge', 'fx', 'vobp', 'bd-excellence', 'alaris', 'biopharma-systems'],
      relatedKPIs: ['Adjusted EPS', 'FX Impact', 'China VoBP Impact', 'BD Excellence Savings'],
      relatedConsoles: ['financial-performance'],
      relatedDrivers: ['Adjusted EPS', 'BD Excellence Savings', 'FX Impact'],
      fiscalPeriod: 'Q2 FY26',
      periodType: 'quarter',
      priority: 'critical',
      commentaryType: 'analysis',
    },
    {
      title: 'Q2 FY26 — Strategic Priorities H2 FY26: Alaris Full Resolution, BioPharma Capacity, and Excellence Unleashed',
      content: `## Q2 FY26 — H2 FY26 Strategic Execution Priorities

With Q2 FY26 results confirming the strategic thesis, BD's H2 FY26 priorities focus on three execution areas that will define the FY27 platform.

**President & CEO (Thomas E. Polen):**

Priority 1 — Alaris Consent Decree Final Milestones: The FDA's review of our Master Validation File submission is expected to conclude in H2 FY26. A positive FDA response — clearing BD to resume unrestricted Alaris sales in the US — would be the most significant commercial catalyst in BD's recent history. We are preparing for this milestone: Alaris field service engineer hiring is ahead of plan, hospital account pipeline management is tracking to the 1,400+ account target, and our commercial team has completed readiness training for the expanded sales motion. We expect the FDA audit of our Raleigh facility to be scheduled in Q3 FY26.

Priority 2 — BioPharma Systems Capacity Construction Progress: Durham NC expansion production equipment installation will be substantially complete by end of FY26, with regulatory validation runs beginning Q1 FY27. Le Pont-de-Claix France is expected to reach the same milestone in Q2 FY27. These timelines mean the first incremental capacity units will be produced in Q2-Q3 FY27 — exactly when GLP-1 market demand is forecasted to be accelerating from current levels.

Priority 3 — Excellence Unleashed Commercial Rollout: The Excellence Unleashed commercial pilot in 3 US regions delivered 6.8% revenue per rep improvement in its first full year. H2 FY26 will see the program scaled to 8 additional US regions and initiated in UK, Germany, and France. The commercial daily management system — the foundational tool — will be deployed to 200 front-line sales managers by Q4 FY26.

**CFO Perspective (Christopher J. DelOrefice):**

The financial trajectory into FY27: if Alaris full resolution occurs by Q4 FY26 as targeted, and BioPharma Systems new capacity begins production in Q2-Q3 FY27, BD enters FY27 with two significant earnings catalysts simultaneously activating. FY27 adjusted EPS growth of +10-12% vs. FY26 is a credible outlook — and would position BD as one of the highest EPS growth rates in large-cap medtech.`,
      contentPlain: 'H2 FY26 three priorities. Priority 1: Alaris FDA MVF review expected H2 FY26; full resolution enables unrestricted US sales; FDA Raleigh audit expected Q3 FY26; 1,400+ account target. Priority 2: Durham NC production equipment install substantially complete end FY26; regulatory validation Q1 FY27; Le Pont-de-Claix Q2 FY27; first incremental units Q2-Q3 FY27. Priority 3: Excellence Unleashed scale to 8 additional US regions + UK/Germany/France; 200 front-line managers on CDM system by Q4 FY26. FY27 outlook: Alaris + BioPharma capacity = +10-12% EPS growth potential.',
      authorName: 'Thomas E. Polen',
      authorRole: 'President and Chief Executive Officer',
      category: 'Strategic',
      tags: ['q2-fy26', 'h2-priorities', 'alaris', 'biopharma-systems', 'excellence-unleashed', 'fy27-outlook', 'strategic-execution'],
      relatedKPIs: ['Alaris Consent Decree', 'BioPharma Systems Revenue', 'BD Excellence Savings', 'Adjusted EPS'],
      relatedConsoles: ['strategy', 'connected-care', 'biopharma-systems'],
      relatedDrivers: ['Alaris Consent Decree', 'BioPharma Systems Revenue', 'Adjusted EPS'],
      fiscalPeriod: 'Q2 FY26',
      periodType: 'quarter',
      priority: 'critical',
      commentaryType: 'strategy',
    },

  ];

  const titleToDriverName: Record<string, string> = {
    'Q1 FY25 — BioPharma Systems GLP-1 Demand: BD\'s Strategic Position in the Drug Delivery Supercycle': 'BioPharma Systems Revenue',
    'Q1 FY25 — Alaris Consent Decree: Remediation Progress and the Path to Connected Care Revenue Recovery': 'Alaris Consent Decree',
    'Q1 FY25 — BD Excellence System: From Lean Manufacturing to Enterprise Performance Culture': 'BD Excellence Savings',
    'Q1 FY25 — China VoBP Pricing Headwind: Strategic Response and Portfolio Repositioning': 'China VoBP Impact',
    'Q2 FY25 — BioPharma Systems Capacity Expansion: CapEx Commitment and Long-Term Supply Strategy': 'Capital Expenditure',
    'Q2 FY25 — Interventional Segment: Peripheral Vascular Growth and Competitive Differentiation': 'Interventional Revenue',
    'Q2 FY25 — FX Headwinds: EUR, JPY, CNY Impact Analysis and Natural Hedge Strategy': 'FX Impact',
    'Q2 FY25 — Medical Essentials: GPO Contract Strategy and Hospital Procurement Relationships': 'Medical Essentials Revenue',
    'Q3 FY25 — CFO Capital Structure Review: Waters Spin Rationale and Debt Deleveraging Path': 'Portfolio Transformation',
    'Q3 FY25 — Alaris Consent Decree Progress: 72% Complete; FDA Engagement and Timeline Update': 'Alaris Consent Decree',
    'Q3 FY25 — International Revenue Growth: Emerging Markets Strategy and Europe GPO Leadership': 'International Revenue',
    'Q3 FY25 — R&D Portfolio: Drug Delivery Innovation, Connected Care Digital, and Interventional Pipeline': 'R&D Investment',
    'Q4 FY25 — FY25 Full-Year Summary: Foundation for FY26 Accelerated Growth': 'Adjusted EPS',
    'Q4 FY25 — BD Excellence Phase II: Commercial and Supply Chain Deployment Design': 'BD Excellence Savings',
    'Q4 FY25 — Enterprise Risk Management: Regulatory, Competitive, and Supply Chain Risk Assessment': 'Alaris Consent Decree',
    'FY25 Annual — Shareholder Return: Dividend Growth, Deleveraging, and Capital Allocation Framework': 'Dividend and Capital Return',
    'Q1 FY26 — Waters Life Sciences Spin Completed; BD Continuing Operations Margin Step-Change': 'Portfolio Transformation',
    'Q1 FY26 — Connected Care Alaris Ramp: 78% Consent Decree Complete; Hospital Account Conversion Accelerating': 'Alaris Consent Decree',
    'Q1 FY26 — BioPharma Systems GLP-1 Order Backlog: $2.1B and Growing; Capacity Timeline Update': 'BioPharma Systems Revenue',
    'Q2 FY26 — Q2 Results Deep Dive: Revenue $4,714M, Adj. EPS $2.90, Margin 24.2%': 'Total Revenue',
    'Q2 FY26 — CFO Perspective: FX, VoBP Headwinds, and Full-Year $12.52-$12.72 EPS Guidance Confidence': 'Adjusted EPS',
    'Q2 FY26 — Strategic Priorities H2 FY26: Alaris Full Resolution, BioPharma Capacity, and Excellence Unleashed': 'BioPharma Systems Revenue',
  };

  let count = 0;
  for (const c of commentary) {
    const driverName = titleToDriverName[c.title];
    const driverId = driverName ? driverNameToId.get(driverName) ?? null : null;

    await prisma.commentary.create({
      data: {
        companyId,
        title: c.title,
        content: c.content,
        contentPlain: c.contentPlain,
        authorName: c.authorName,
        authorRole: c.authorRole,
        category: c.category,
        tags: c.tags as unknown as any,
        relatedKPIs: c.relatedKPIs as unknown as any,
        relatedConsoles: c.relatedConsoles as unknown as any,
        relatedDrivers: c.relatedDrivers as unknown as any,
        fiscalPeriod: c.fiscalPeriod,
        periodType: c.periodType,
        priority: c.priority,
        commentaryType: c.commentaryType,
        driverId,
        aggregationLevel: driverId ? 'driver' : 'manual',
      },
    });
    count++;
  }

  console.log(`  Seeded ${count} expanded BD commentary entries (FY25-FY26 coverage)`);
}
