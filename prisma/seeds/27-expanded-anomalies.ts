import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 27: Expanded Anomaly Detections — Becton, Dickinson and Company (NYSE: BDX)
// ~25 anomalies covering financial, operational, regulatory, and strategic
// dimensions across FY25 and Q2 FY26.
//
// Severity: 'info' = noteworthy | 'warning' = below benchmark | 'critical' = risk
// Direction: 'above_expected' | 'below_expected'
// Status: 'new' | 'acknowledged' | 'resolved' | 'false-positive'
// =============================================================================

export async function seedExpandedAnomalies(prisma: PrismaClient, companyId: number) {
  console.log('  Seeding expanded anomaly detections (Becton, Dickinson and Company)...');

  const anomalies = [
    // ─────────────────────────────────────────────────────────────────────────
    // Q2 FY26 (Jan–Mar 2026) — KEY BEATS AND MISSES
    // ─────────────────────────────────────────────────────────────────────────
    {
      metricName: 'BioPharma Systems Q2 FY26 Revenue Miss — China VoBP + Vaccine Demand Shortfall',
      detectedAt: '2026-05-08T07:00:00Z',
      severity: 'warning',
      direction: 'below_expected',
      expectedValue: 1185.0,
      actualValue: 1098.0,
      deviationPct: -7.3,
      explanation:
        'BD BioPharma Systems segment revenue of $1,098M in Q2 FY26 missed the $1,185M plan by $87M (-7.3%). Two concurrent headwinds drove the shortfall: (1) China Volume-Based Procurement (VoBP) program — the Chinese government expanded VoBP to include prefilled syringe systems and drug delivery components, creating an estimated -9.8% FXN revenue decline in China for BioPharma Systems, roughly 500bps worse than the internal -5% headwind assumption; and (2) lower-than-expected global COVID and influenza vaccine demand reduced prefilled syringe orders from major pharmaceutical customers by approximately $55M vs. plan, as vaccine manufacturers reduced production volumes after Q1 FY26 inventory destocking. BD management disclosed on the Q2 earnings call that China VoBP pricing resets are expected to run through at least Q4 FY26, with an estimated full-year FY26 China revenue headwind of approximately $200-240M for the segment. Partially offsetting: injectables packaging demand for GLP-1 drug delivery components (Ozempic, Zepbound pen cartridges) was $38M above plan, contributing approximately 330bps of volume growth in North America and Europe. Management is guiding BioPharma Systems organic growth to approximately -3% to -5% for full-year FY26 vs. prior +2% guidance, reflecting the China VoBP deterioration.',
      status: 'acknowledged',
      relatedDrivers: ['BioPharma Systems Revenue', 'China Revenue Growth', 'Organic Revenue Growth', 'Volume-Based Procurement Headwind'],
    },
    {
      metricName: 'Q2 FY26 Adjusted Operating Margin 24.2% — Compressed 110bps vs 25.3% Prior Year',
      detectedAt: '2026-05-08T07:15:00Z',
      severity: 'warning',
      direction: 'below_expected',
      expectedValue: 25.0,
      actualValue: 24.2,
      deviationPct: -3.2,
      explanation:
        'BD Q2 FY26 adjusted operating margin of 24.2% declined 110 basis points year-over-year from 25.3% in Q2 FY25 and was 80 basis points below the 25.0% internal plan. Three factors drove the compression: (1) the $42M BD Alaris remediation charge recorded in Q2 FY26 COGS (pump firmware upgrades, supplier qualification, and labeling compliance) compressed gross margin by approximately 90bps before the adjusted EPS add-back — after adjustment the gross margin impact is approximately 30bps from non-cash remediation costs that are excluded from adjusted EPS but not from adjusted operating margin; (2) unfavorable segment mix shift — BioPharma Systems (the highest-margin segment at approximately 28% adjusted operating margin) underperformed while lower-margin Medical Essentials grew modestly, shifting consolidated mix unfavorably by approximately 40bps; and (3) increased SG&A investment in the Connected Care commercial expansion, adding approximately 30bps of expense vs. plan as BD accelerated hospital account penetration in the post-Alaris re-commercialization phase. CFO Christopher DelOrefice reiterated the full-year FY26 adjusted operating margin guidance of 24.5-25.0% — implying H2 FY26 requires 50-70bps of sequential margin expansion, primarily from BioPharma mix normalization and Alaris remediation charge abatement.',
      status: 'acknowledged',
      relatedDrivers: ['Adjusted Operating Margin', 'BD Alaris Remediation', 'Segment Mix', 'Adjusted EPS'],
    },
    {
      metricName: 'China Revenue -9.8% FXN Q2 FY26 — Accelerates from -5% Target; VoBP Expanding',
      detectedAt: '2026-05-08T07:30:00Z',
      severity: 'critical',
      direction: 'below_expected',
      expectedValue: -5.0,
      actualValue: -9.8,
      deviationPct: -96.0,
      explanation:
        'BD China total revenue declined -9.8% on a foreign exchange neutral (FXN) basis in Q2 FY26 — nearly double the -5.0% internal target and a significant acceleration from -6.2% FXN in Q1 FY26. The steeper-than-expected decline reflects three developments: (1) the Chinese government expanded the Volume-Based Procurement program in January 2026 to include additional BD product categories (drug delivery systems, diagnostic instruments), with procurement prices set at 40-60% discounts to prior list prices — a larger discount than the 25-35% BD had modeled in FY26 planning; (2) provincial implementation of VoBP was faster than anticipated, with 18 of 31 provinces completing procurement in Q2 FY26 vs. 12 provinces assumed in the plan; and (3) some Chinese hospital customers accelerated purchasing in Q4 FY25 ahead of VoBP pricing resets, creating a pull-forward that depressed Q2 FY26 reorder volumes. China represented approximately 10% of BD total revenue prior to VoBP, making each additional 500bps of China revenue decline approximately -0.5% headwind to consolidated organic growth. BD management is evaluating portfolio repositioning in China, including selective product rationalization in VoBP-affected categories and increased focus on premium product lines not subject to volume procurement. No goodwill impairment specific to China operations was recorded in Q2 FY26 — that risk is being monitored in Q3-Q4 FY26 planning.',
      status: 'open',
      relatedDrivers: ['China Revenue Growth', 'BioPharma Systems Revenue', 'Organic Revenue Growth', 'Volume-Based Procurement Headwind'],
    },
    {
      metricName: 'Connected Care APM +12% FXN Q2 FY26 — Beat +8% Target by 400bps; Post-Alaris Momentum',
      detectedAt: '2026-05-08T07:45:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 8.0,
      actualValue: 12.0,
      deviationPct: 50.0,
      explanation:
        'BD Connected Care segment Alaris Pump Management (APM) revenue grew +12% on a foreign exchange neutral basis in Q2 FY26, beating the +8% internal target by 400 basis points. This is the strongest Connected Care organic growth quarter since the Alaris consent decree restricted active marketing in 2020, and represents a structural inflection in post-consent-decree re-commercialization. The outperformance reflects: (1) the Alaris System 2.0 software update released in November 2025 restored full feature functionality to approximately 78% of the remediated installed base — the first time since the consent decree that BD could offer competitive feature parity with Baxter\'s Sigma Spectrum competitor; (2) US hospital purchasing cycle reactivation — approximately 340 hospitals that had deferred large infusion pump capital replacements during the Alaris remediation period restarted procurement in Q2 FY26, representing approximately $180M of pulled-forward demand above the $120M plan; and (3) international Connected Care growth of +8% FXN above plan, with particular strength in Germany (+18%), the UK (+14%), and Australia (+12%) as the remediation improvements were communicated to international customers. CEO Thomas Polen noted that Connected Care re-commercialization momentum is "ahead of plan" and that full-year FY26 Connected Care organic growth guidance is raised to approximately +10-12% FXN from the prior +7-9% guidance.',
      status: 'acknowledged',
      relatedDrivers: ['Connected Care Revenue', 'BD Alaris Remediation', 'Organic Revenue Growth', 'US Hospital Capital Spending'],
    },
    {
      metricName: 'Free Cash Flow H1 FY26 +305% YoY — Working Capital Release + Alaris Insurance Proceeds',
      detectedAt: '2026-05-08T08:00:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 850.0,
      actualValue: 1245.0,
      deviationPct: 46.5,
      explanation:
        'BD H1 FY26 (October 2025 – March 2026) free cash flow of $1,245M grew +305% year-over-year from $307M in H1 FY25 and was $395M above the $850M internal plan. The dramatic improvement has three primary drivers: (1) BD Alaris consent decree insurance recoveries — BD received $285M in product liability insurance proceeds in Q1 FY26 that partially offset cumulative Alaris remediation spending; (2) working capital normalization — inventory levels declined by approximately $320M as the BioPharma Systems production ramp-down (in response to China VoBP demand reduction) reduced raw material purchasing, and accounts receivable collections improved as the post-Waters spin-off customer billing consolidation was completed; and (3) lower cash restructuring charges — the Waters Medical Systems spin-off restructuring charges of approximately $180M that depressed H1 FY25 FCF were non-recurring. The +305% YoY FCF growth validates BD\'s capital allocation framework: the company deployed $420M of H1 FY26 FCF for debt reduction (net leverage improvement from 3.1x to 2.9x) and $380M for share repurchases at an average price of approximately $215/share. Management reaffirmed full-year FY26 free cash flow guidance of $2.4-2.6B, representing approximately 2× the FY25 free cash flow of $1.28B.',
      status: 'resolved',
      relatedDrivers: ['Free Cash Flow', 'Net Debt to EBITDA', 'BD Alaris Remediation', 'Working Capital'],
    },
    {
      metricName: 'BD Alaris Remediation COGS Charge $42M Q2 FY26 — Tracking Within Full-Year $160M Budget',
      detectedAt: '2026-05-08T08:15:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 35.0,
      actualValue: 42.0,
      deviationPct: 20.0,
      explanation:
        'BD recorded $42M of BD Alaris system remediation charges within Q2 FY26 COGS — $7M above the $35M quarterly plan, reflecting accelerated pump firmware validation testing to meet the accelerated FDA remediation timeline. The Q2 charge brings the H1 FY26 cumulative remediation COGS total to $78M against the full-year FY26 budget of $160M, positioning H2 FY26 at $82M — broadly on track with the full-year plan. The $42M Q2 charge comprises: (1) $18M of supplier qualification and materials testing for the Alaris guard rail software update to approximately 240,000 pump units in the US installed base; (2) $14M of field service labor and logistics for on-site firmware installation at 1,800 hospital accounts; and (3) $10M of regulatory documentation preparation and FDA correspondence costs. Cumulative Alaris consent decree remediation spending since FY21 has reached approximately $680M. BD estimates the consent decree will be fully resolved by Q4 FY26 or Q1 FY27, at which point the approximately $160M/year remediation cost burden is expected to cease — providing an immediate $0.50+/share EPS tailwind in FY27. As of Q2 FY26, approximately 78% of the US installed base is fully remediated, on track for 95% completion by September 30, 2026 (FY26 year-end).',
      status: 'acknowledged',
      relatedDrivers: ['BD Alaris Remediation', 'Adjusted Operating Margin', 'Connected Care Revenue', 'Adjusted EPS'],
    },
    {
      metricName: 'Net Leverage 2.9x Q2 FY26 — Above 2.5x Target; Waters Spin-Off Debt Allocation Impact',
      detectedAt: '2026-05-08T08:30:00Z',
      severity: 'warning',
      direction: 'above_expected',
      expectedValue: 2.5,
      actualValue: 2.9,
      deviationPct: 16.0,
      explanation:
        'BD net debt to adjusted EBITDA leverage ratio of 2.9x at Q2 FY26 is 40 basis points above the 2.5x target that management had communicated at the time of the Waters Medical Systems spin-off completion in February 2026. The above-target leverage reflects two factors: (1) the Waters spin-off transferred approximately $1.8B of debt to the new Waters entity, but BD retained approximately $400M of Waters-related transaction costs and tax liabilities on its balance sheet that were not anticipated in the initial leverage guidance — increasing BD net debt by $400M vs. the post-spin target; and (2) BD\'s adjusted EBITDA in the trailing twelve months was approximately $120M below plan due to the BioPharma Systems/China VoBP revenue shortfall, raising the ratio denominator shortfall. BD total net debt as of Q2 FY26 is approximately $11.8B. The path to 2.5x requires either approximately $900M of additional net debt reduction or approximately $380M of incremental EBITDA vs. trailing twelve months. Management has identified $600M of planned debt repayment from H2 FY26 free cash flow generation plus the approximately $1,245M H1 FCF already generated. Credit ratings (Moody\'s Baa2, S&P BBB) are stable; covenant maximum is 3.75x — the 2.9x ratio has 85bps of headroom.',
      status: 'acknowledged',
      relatedDrivers: ['Net Debt to EBITDA', 'Free Cash Flow', 'Waters Spin-Off', 'Adjusted EPS'],
    },
    {
      metricName: 'Goodwill Impairment $450M Q2 FY26 — BioPharma Systems China; Non-Cash; No Cash Impact',
      detectedAt: '2026-05-08T08:45:00Z',
      severity: 'warning',
      direction: 'below_expected',
      expectedValue: 0.0,
      actualValue: -450.0,
      deviationPct: -100.0,
      explanation:
        'BD recorded a $450M non-cash goodwill impairment charge in Q2 FY26 within the BioPharma Systems reporting unit, driven by the deterioration in the China VoBP revenue outlook and the downward revision to BioPharma Systems long-term organic growth assumptions from approximately +4% to approximately +1.5%. The charge is excluded from adjusted EPS and has no cash impact. The goodwill balance remaining in BioPharma Systems after the impairment is approximately $3.2B (from the original $3.65B allocation). Triggering factors for the impairment test: (1) the China VoBP expansion announced in January 2026 was a triggering event for an interim goodwill impairment assessment per ASC 350; (2) the discount rate used in the BioPharma Systems DCF increased from 8.5% to 9.2% reflecting higher risk-free rates and business risk; and (3) the terminal growth rate assumption was reduced from 3.5% to 2.8% reflecting VoBP structural pricing pressure. GAAP EPS was reduced by approximately -$1.57/share for Q2 FY26. BD management emphasized that the impairment does not affect the business unit\'s strategic importance or capital allocation priority — BioPharma Systems remains a core segment with strong free cash flow generation outside China. Full-year GAAP EPS guidance was revised to reflect the impairment while adjusted EPS guidance of $13.75-$14.05 for FY26 was maintained.',
      status: 'acknowledged',
      relatedDrivers: ['Goodwill Impairment', 'BioPharma Systems Revenue', 'China Revenue Growth', 'Adjusted EPS'],
    },
    {
      metricName: 'Q2 FY26 Adjusted EPS $2.90 — Broadly In Line; FX Drag Offset by Volume/Pricing',
      detectedAt: '2026-05-08T09:00:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 2.85,
      actualValue: 2.90,
      deviationPct: 1.8,
      explanation:
        'BD Q2 FY26 adjusted EPS of $2.90 modestly beat the $2.85 consensus estimate by $0.05 (+1.8%). The result reflects a dynamic offset: the BioPharma Systems revenue miss and margin compression were largely offset by Connected Care outperformance and tax benefits. Key EPS drivers: (1) revenue of $4,714M, +2.6% FXN organic growth, with a -1.8% FX headwind (net reported revenue growth of approximately +0.8%); (2) Connected Care above-plan performance contributed approximately +$0.08/share vs. consensus; (3) BioPharma Systems miss subtracted approximately -$0.09/share; (4) a lower-than-expected effective tax rate of 14.8% (vs. 16.5% plan) contributed approximately +$0.05/share; and (5) share count reduction from buybacks contributed approximately +$0.02/share. BD Q2 FY26 adjusted EPS of $2.90 compares to $2.74 in Q2 FY25 (+5.8% YoY). Full-year FY26 adjusted EPS guidance of $13.75-$14.05 was maintained — implying H2 FY26 requires approximately $8.40-$8.70 of adjusted EPS in two quarters, achievable with BioPharma seasonal H2 strength, Connected Care momentum, and Alaris remediation charge moderation.',
      status: 'acknowledged',
      relatedDrivers: ['Adjusted EPS', 'Organic Revenue Growth', 'FX Impact', 'Connected Care Revenue'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Q1 FY26 (Oct–Dec 2025) — QUARTERLY HIGHLIGHTS
    // ─────────────────────────────────────────────────────────────────────────
    {
      metricName: 'Waters Medical Systems Spin-Off Completed Feb 2026 — EPS Dilution Within Guidance',
      detectedAt: '2026-02-05T07:00:00Z',
      severity: 'info',
      direction: 'below_expected',
      expectedValue: 0.0,
      actualValue: -0.12,
      deviationPct: -100.0,
      explanation:
        'BD completed the spin-off of Waters Medical Systems as an independent publicly traded company on February 4, 2026, returning approximately $1.8B of allocated debt to the Waters entity and distributing Waters shares to BD shareholders on a 1-for-4 basis. The transaction is the final step in BD\'s strategic portfolio optimization following the CareFusion and C.R. Bard integrations. The EPS dilution from the spin-off of approximately -$0.12/share in Q1 FY26 (representing Waters\' contribution to BD adjusted EPS prior to separation) was within the $0.10-$0.15 guidance range. Post-spin, BD is a more focused medtech company across its four core segments: Medical Essentials, Connected Care, BioPharma Systems, and Interventional. Pro forma BD revenue for FY26 is approximately $19.8-$20.2B vs. approximately $22.2B pre-spin (Waters contributed approximately $2.2B of annual revenue). The spin-off eliminates the earnings drag of the lower-margin Waters dialysis business and focuses BD capital allocation on higher-growth medtech categories. Management expects the focused portfolio to deliver 200-300bps of adjusted operating margin improvement over FY27-FY29 as Waters\' lower-margin business is removed from the consolidated P&L.',
      status: 'resolved',
      relatedDrivers: ['Waters Spin-Off', 'Adjusted EPS', 'Organic Revenue Growth', 'Net Debt to EBITDA'],
    },
    {
      metricName: 'Interventional Q1 FY26 Revenue +6.8% FXN — Above +5% Target; Surgery Strength',
      detectedAt: '2026-02-05T07:15:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 5.0,
      actualValue: 6.8,
      deviationPct: 36.0,
      explanation:
        'BD Interventional segment Q1 FY26 revenue grew +6.8% FXN, exceeding the +5.0% internal target by 180 basis points and the +5.5% Street consensus by 130 basis points. The outperformance was driven by BD Surgery (hernia repair meshes and biosurgery) growing +9.2% FXN — significantly above the +6% plan — as procedure volumes at US ambulatory surgery centers expanded above market after GLP-1 obesity drug adoption reduced comorbidities and increased surgical candidacy. Peripheral Intervention grew +6.1% FXN on the strength of the Rotarex atherectomy system expansion in the US and EU, which gained 180 basis points of market share from Cardiovascular Systems and Philips competitors. Urology & Critical Care grew +5.8% FXN, driven by TrioVance ureteral access sheath and the Liberator single-use cystoscope expansion. Interventional operating margin of 22.8% was 60bps above plan, reflecting operating leverage from the volume outperformance. Management raised full-year Interventional organic growth guidance to approximately +6.5-7.5% FXN from the initial +5.0-6.0% guidance.',
      status: 'resolved',
      relatedDrivers: ['Interventional Revenue', 'Organic Revenue Growth', 'US Procedure Volume', 'Adjusted Operating Margin'],
    },
    {
      metricName: 'FX Headwind Q1 FY26 -220bps — Worse than -150bps Model; EUR/CNY Weakening',
      detectedAt: '2026-02-05T07:30:00Z',
      severity: 'warning',
      direction: 'below_expected',
      expectedValue: -1.5,
      actualValue: -2.2,
      deviationPct: -46.7,
      explanation:
        'The FX currency translation headwind in Q1 FY26 was -220 basis points on reported revenue growth (vs. FXN organic growth) — 70 basis points worse than the -150bps assumption embedded in FY26 initial guidance. BD generates approximately 55-60% of revenue outside the US, making it a meaningful FX-exposed company. The -220bps Q1 headwind reflects: (1) EUR/USD averaged $1.042 in Q1 FY26 vs. the $1.075 guidance assumption — European revenue (approximately 27% of total) translates at a -3.1% FX headwind vs. plan; (2) Chinese yuan (CNY) weakening to 7.35/USD vs. 7.15 guidance assumption, adding incremental FX headwind on top of the VoBP volume pressure; and (3) Japanese yen weakness (JPY 155/USD vs. 148/USD assumed) — Japan is approximately 6% of BD revenue. BD manages FX risk through natural hedging (manufacturing in local currencies) and limited derivatives hedging on recognized intercompany transactions. Each additional 100bps of FX headwind on revenue converts to approximately -$0.04/share adjusted EPS (approximately 50% revenue flow-through after hedging benefits). Full-year FY26 FX headwind guidance was updated to approximately -200 to -250bps from the initial -100 to -150bps assumption.',
      status: 'acknowledged',
      relatedDrivers: ['FX Impact', 'Organic Revenue Growth', 'International Revenue', 'Adjusted EPS'],
    },
    {
      metricName: 'R&D Spend Q1 FY26 6.8% of Revenue — 30bps Above 6.5% Plan; Pipeline Acceleration',
      detectedAt: '2026-02-05T07:45:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 6.5,
      actualValue: 6.8,
      deviationPct: 4.6,
      explanation:
        'BD R&D expense as a percentage of revenue was 6.8% in Q1 FY26 — 30 basis points above the 6.5% plan, reflecting a deliberate acceleration of three pipeline programs that management elected to fund ahead of schedule following the Waters spin-off capital reallocation. The incremental $15M of R&D spend above plan was directed to: (1) BD Liberator next-generation single-use flexible scope platform (connected endoscopy), where clinical evidence development for reimbursement expansion is being accelerated to capture the ambulatory surgery center shift from reusable to single-use scopes; (2) BD Pyxis MedStation 5.0 enterprise medication management platform, where AI-driven automated dispensing cabinet development was accelerated to counter Omnicell\'s new platform launch; and (3) next-generation BD Alaris infusion pump with integrated clinical decision support, targeting a 510(k) submission by Q2 FY27. BD management has communicated a targeted R&D intensity of 6.5-7.0% of revenue for FY26-FY28, reflecting the company\'s strategy of increasing organic innovation investment as portfolio complexity decreases post-Waters spin-off. The above-plan R&D investment is expected to generate approximately $400-600M of incremental annual revenue by FY29.',
      status: 'resolved',
      relatedDrivers: ['R&D Investment', 'Organic Revenue Growth', 'Adjusted Operating Margin', 'Connected Care Revenue'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Q4 FY25 (Jul–Sep 2025)
    // ─────────────────────────────────────────────────────────────────────────
    {
      metricName: 'FY25 Full-Year Organic Revenue Growth +5.1% FXN — Above +4.5% Guidance Midpoint',
      detectedAt: '2025-11-05T07:00:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 4.5,
      actualValue: 5.1,
      deviationPct: 13.3,
      explanation:
        'BD full-year FY25 organic revenue growth of +5.1% FXN exceeded the 4.0-5.0% guidance range midpoint (+4.5%) by 60 basis points. The outperformance was broad-based: Connected Care +8.2% FXN (Alaris re-commercialization and Pyxis dispensing growth); Interventional +6.8% FXN (surgery procedure volume recovery); Medical Essentials +4.2% FXN (medication management systems, infusion therapy); and BioPharma Systems +2.8% FXN (before China VoBP headwind accelerated in Q1 FY26). FY25 total revenue reached approximately $20.2B. The above-guidance growth reflects successful execution of BD\'s three strategic priorities: (1) accelerating Connected Care recovery post-Alaris consent decree; (2) expanding Interventional into high-growth procedural categories; and (3) sustaining BioPharma Systems through GLP-1 drug delivery demand growth. BD adjusted EPS of $13.14 for FY25 was at the high end of the $12.90-$13.20 guidance range. Management issued FY26 initial adjusted EPS guidance of $13.75-$14.05, representing +4.6-6.9% growth.',
      status: 'resolved',
      relatedDrivers: ['Organic Revenue Growth', 'Adjusted EPS', 'Connected Care Revenue', 'Interventional Revenue'],
    },
    {
      metricName: 'BD Alaris Consent Decree 78% Remediated — Q4 FY25 Progress Above 70% Milestone',
      detectedAt: '2025-11-05T07:15:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 70.0,
      actualValue: 78.0,
      deviationPct: 11.4,
      explanation:
        'BD Alaris pump system remediation progress reached 78% of the US installed base fully remediated as of September 30, 2025 (FY25 year-end) — 8 percentage points ahead of the 70% milestone that BD had communicated to the FDA and investors for Q4 FY25. Remediation activities completed in FY25: (1) approximately 185,000 pump units received the updated Guardrails firmware version 12.1.3 that addresses all 12 software deficiencies identified in the FDA 2020 Warning Letter; (2) approximately 12,000 hospital accounts completed the field service installation and sign-off documentation required by the consent decree; and (3) BD\'s quality management system (QMS) enhancements required by the consent decree — including enhanced supplier qualification protocols and post-market surveillance processes — received FDA acknowledgment in August 2025. The ahead-of-schedule remediation progress accelerated Connected Care re-commercialization: BD received FDA clearance in October 2025 to resume full active marketing of Alaris systems to new accounts (previously restricted to existing accounts only). Management expects to achieve 95% remediation and full consent decree closure by September 30, 2026.',
      status: 'resolved',
      relatedDrivers: ['BD Alaris Remediation', 'Connected Care Revenue', 'US Regulatory Compliance', 'Adjusted EPS'],
    },
    {
      metricName: 'Q4 FY25 Gross Margin 52.1% — 80bps Above 51.3% Prior Year; Pricing + Volume Leverage',
      detectedAt: '2025-11-05T07:30:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 51.8,
      actualValue: 52.1,
      deviationPct: 0.6,
      explanation:
        'BD Q4 FY25 adjusted gross margin of 52.1% improved 80 basis points year-over-year from 51.3% in Q4 FY24, exceeding the 51.8% plan by 30 basis points. The improvement reflects: (1) pricing contribution of +220bps — BD achieved 2.2% net price realization across the portfolio, with Connected Care (+3.1% pricing) and Interventional (+2.8%) above the corporate average; (2) manufacturing productivity (+60bps) from BD Excellence continuous improvement program lean initiatives; (3) partially offset by raw material inflation (-120bps, primarily in resins, stainless steel, and electronic components), and unfavorable mix from stronger growth in the lower-margin Medical Essentials segment (-80bps). Q4 FY25 gross margin of 52.1% is the highest in BD\'s recent history, recovering from the 49.8% trough in Q2 FY23 when supply chain disruption and Alaris remediation costs peaked. Management expects gross margin to continue improving to the 52.5-53.0% range by FY26 year-end as Alaris remediation costs moderate and higher-margin Connected Care and Interventional segments grow faster than Medical Essentials.',
      status: 'resolved',
      relatedDrivers: ['Gross Margin', 'Pricing Contribution', 'Adjusted Operating Margin', 'Adjusted EPS'],
    },
    {
      metricName: 'Medical Essentials Q4 FY25 +4.2% FXN — Medication Management Above Expectation',
      detectedAt: '2025-11-05T07:45:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 3.5,
      actualValue: 4.2,
      deviationPct: 20.0,
      explanation:
        'BD Medical Essentials segment Q4 FY25 organic growth of +4.2% FXN exceeded the +3.5% plan by 70 basis points, driven by medication management systems and infusion therapy consumables. Medical Essentials is BD\'s largest segment at approximately 40% of revenue. Key outperformance drivers: (1) BD Physio-Control AED and emergency resuscitation equipment grew +7.8% FXN in Q4 on strong public access defibrillation program demand from US municipalities and European workplace safety regulation compliance; (2) BD intravenous catheter and consumables business grew +4.5% FXN on the combination of hospital admission volume growth and BD\'s recently launched Venflon Pro Safety IV catheter gaining market share from Smiths Medical competitors; (3) medication management systems (BD Pyxis dispensing cabinets) grew +5.2% FXN on continued hospital system penetration, partially offset by a supply-constrained environment for electronic components limiting production capacity. The +4.2% Medical Essentials growth contributes positively to consolidated organic growth given the segment\'s large revenue base, though the segment\'s 19-21% adjusted operating margin is below the consolidated average of approximately 24%.',
      status: 'resolved',
      relatedDrivers: ['Medical Essentials Revenue', 'Organic Revenue Growth', 'US Hospital Capital Spending'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Q3 FY25 (Apr–Jun 2025)
    // ─────────────────────────────────────────────────────────────────────────
    {
      metricName: 'China VoBP First Significant Impact Q3 FY25 — BioPharma Systems -5.2% FXN',
      detectedAt: '2025-08-06T07:00:00Z',
      severity: 'warning',
      direction: 'below_expected',
      expectedValue: 0.5,
      actualValue: -5.2,
      deviationPct: -1140.0,
      explanation:
        'BD BioPharma Systems China revenue declined -5.2% FXN in Q3 FY25 — the first quarter of material VoBP headwind impact and the trigger for BD management\'s revision of China guidance for FY25-FY26. Prior to Q3 FY25, BD had modeled Chinese VoBP risk as a modest -1 to -2% annual headwind; the actual Q3 impact was significantly worse. The VoBP program introduced in China\'s key provinces in April 2025 covered BD prefilled syringe systems and drug delivery containers at discounts of 35-50% to prior pricing, eliminating the price premium BD had historically maintained for its quality and quality assurance advantages. Q3 FY25 BioPharma Systems China revenue of approximately $68M was $25M below the $93M plan. The Q3 surprise prompted an immediate commercial response from BD: (1) pricing strategy review for the 2026 contract year in China; (2) evaluation of local manufacturing joint venture options to compete on cost; and (3) portfolio repositioning toward premium biologics delivery systems not covered by VoBP (gene therapy delivery, high-precision prefilled systems for specialty drugs). Management guided the Q4 FY25 China BioPharma headwind to approximately -8% FXN (vs. -5.2% in Q3) as additional provinces implemented VoBP.',
      status: 'acknowledged',
      relatedDrivers: ['China Revenue Growth', 'BioPharma Systems Revenue', 'Volume-Based Procurement Headwind', 'Organic Revenue Growth'],
    },
    {
      metricName: 'Pricing Contribution Q3 FY25 +220bps — Above +180bps Target; List Price Realization',
      detectedAt: '2025-08-06T07:15:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 1.8,
      actualValue: 2.2,
      deviationPct: 22.2,
      explanation:
        'BD achieved +220 basis points of pricing contribution to organic revenue growth in Q3 FY25 — 40 basis points above the +180bps plan. This was the highest quarterly pricing achievement since BD began separately disclosing pricing vs. volume contribution in FY22. The above-plan pricing performance reflects: (1) Connected Care price realization of +3.1% — as Alaris pump re-commercialization allowed BD to restore list prices that had been discounted during the consent decree period when hospitals had pricing leverage; (2) Interventional pricing of +2.8% — premium procedure-enabling products (atherectomy, hernia mesh) maintain strong pricing power given limited substitute alternatives; and (3) Medical Essentials +1.8% pricing — consumables and disposables repriced annually with hospital contract escalators averaging CPI+0.5%. BD management has guided annual pricing contribution of +150-200bps for FY26, modestly below Q3 FY25 actuals as the Connected Care re-commercialization pricing uplift normalizes and as pricing pressure in some emerging markets limits international price realization.',
      status: 'resolved',
      relatedDrivers: ['Pricing Contribution', 'Organic Revenue Growth', 'Adjusted Operating Margin'],
    },
    {
      metricName: 'Operating Cash Flow Q3 FY25 $820M — Above $720M Plan; Working Capital Improvement',
      detectedAt: '2025-08-06T07:30:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 720.0,
      actualValue: 820.0,
      deviationPct: 13.9,
      explanation:
        'BD operating cash flow of $820M in Q3 FY25 was $100M above the $720M plan — the second consecutive quarter of above-plan cash generation. The $100M favorability reflects: (1) accounts receivable collections accelerating as BD implemented a new global AR management platform in Q2 FY25, reducing days sales outstanding from 72 days to 68 days — releasing approximately $55M of working capital; (2) inventory levels declined by approximately $85M as the Alaris pump manufacturing optimization right-sized the work-in-process inventory during the remediation phase transition from production ramp-down to re-commercialization build; and (3) capital expenditure came in $30M below plan as two manufacturing expansion projects (Singapore BioPharma expansion and Mexico Medical Essentials line) were deferred one quarter due to equipment delivery lead time delays. BD nine-month operating cash flow of $2.18B positions the company on track to achieve or exceed the full-year FY25 guidance of $2.8-3.0B operating cash flow. The above-plan Q3 cash flow was used to repay $500M of term debt, improving leverage from 3.2x to approximately 3.0x.',
      status: 'resolved',
      relatedDrivers: ['Free Cash Flow', 'Net Debt to EBITDA', 'Working Capital'],
    },
    {
      metricName: 'Emerging Markets Q3 FY25 +8.5% FXN — India +15%; Below Latin America Normalization',
      detectedAt: '2025-08-06T07:45:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 7.0,
      actualValue: 8.5,
      deviationPct: 21.4,
      explanation:
        'BD Emerging Markets revenue grew +8.5% FXN in Q3 FY25, exceeding the +7.0% plan by 150 basis points. India was the standout growth market at +15.2% FXN, driven by: (1) the Indian government\'s Ayushman Bharat hospital expansion program increasing disposable consumable demand at new hospital facilities; (2) BD\'s Jaipur manufacturing facility achieving full capacity utilization, enabling local market price competitiveness vs. domestic Indian competitors in the infusion therapy segment; and (3) BD diagnostics grew +18% FXN in India on expanded TB, malaria, and sexually transmitted infection diagnostic test adoption. Latin America grew +6.8% FXN — below the +9.2% in Q2 FY25 as Brazil faced foreign exchange volatility that suppressed local-currency purchasing budgets. Middle East & Africa grew +11.4% FXN on Gulf Cooperation Council healthcare infrastructure investment. BD\'s emerging market revenue diversification (approximately 12% of total revenue) provides a meaningful growth offset to the developed market pressure from China VoBP. Management targets emerging markets growing at approximately 200bps above consolidated organic growth sustainably through FY28.',
      status: 'resolved',
      relatedDrivers: ['Emerging Markets Revenue', 'Organic Revenue Growth', 'International Revenue'],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Q2 FY25 AND PRIOR — STRATEGIC ANOMALIES
    // ─────────────────────────────────────────────────────────────────────────
    {
      metricName: 'BioPharma GLP-1 Delivery Component Demand — +28% YoY Q2 FY25; Novo + Lilly Wins',
      detectedAt: '2025-05-07T08:00:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 18.0,
      actualValue: 28.0,
      deviationPct: 55.6,
      explanation:
        'BD BioPharma Systems GLP-1 drug delivery component revenue grew +28% year-over-year in Q2 FY25, exceeding the +18% plan by 10 percentage points. BD is a key manufacturing partner for prefilled pens, injection devices, and precision glass cartridges used by Novo Nordisk (Ozempic, Wegovy) and Eli Lilly (Mounjaro, Zepbound) — the two dominant GLP-1 pharmaceutical manufacturers. The above-plan growth reflects: (1) Novo Nordisk and Eli Lilly both expanded their supply chain procurement from BD following BD\'s 2024 capacity expansion at its Poznań, Poland and Columbus, Nebraska manufacturing sites; (2) the FDA approval of Zepbound (tirzepatide) for obesity in November 2023 triggered a step-change in demand for BD\'s autoinjector pen components as Lilly ramped production; and (3) BD secured a three-year supply agreement with a third GLP-1 manufacturer (undisclosed) in Q1 FY25 that began contributing volume in Q2 FY25. GLP-1 components are the fastest-growing product line within BioPharma Systems and partially offset the China VoBP headwind in the segment. BD management indicated that GLP-1 drug delivery component demand is expected to grow at approximately 20-25% annually through FY27 as GLP-1 market penetration expands globally.',
      status: 'resolved',
      relatedDrivers: ['BioPharma Systems Revenue', 'Organic Revenue Growth', 'GLP-1 Drug Delivery Components'],
    },
    {
      metricName: 'Share Repurchase Program Q2 FY25 $500M — Above $350M Target; Leverage Headroom Used',
      detectedAt: '2025-05-07T08:15:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 350.0,
      actualValue: 500.0,
      deviationPct: 42.9,
      explanation:
        'BD repurchased $500M of common shares in Q2 FY25 — $150M above the $350M quarterly plan — at an average price of approximately $231/share (approximately 2.2M shares retired). The above-plan repurchase activity was enabled by the above-plan free cash flow generation in Q2 FY25 ($680M vs. $580M plan) and management\'s judgment that BD shares were attractively valued following the 12% stock price decline from the January 2025 peak associated with the initial China VoBP news. The incremental $150M repurchase at approximately $231/share is approximately 8% below the 12-month average stock price, representing favorable capital allocation timing. BD management has communicated a capital allocation priority framework post-Waters spin-off: (1) organic R&D investment; (2) strategic tuck-in acquisitions ($500M-$2B range); (3) dividend maintenance (current yield approximately 1.6%); and (4) share repurchases. The Q2 FY25 buyback pace implies an annualized buyback rate of approximately $2B, which if sustained would reduce diluted share count by approximately 2.2% annually at current share prices. Full-year FY25 repurchase guidance was raised to approximately $1.8B from the prior $1.4B.',
      status: 'resolved',
      relatedDrivers: ['Share Repurchase', 'Adjusted EPS', 'Free Cash Flow', 'Net Debt to EBITDA'],
    },
    {
      metricName: 'Pyxis MedStation Market Share — BD 42.1% Q2 FY25 vs 40.8% Prior Year; Omnicell Displaced',
      detectedAt: '2025-05-07T08:30:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 41.5,
      actualValue: 42.1,
      deviationPct: 1.4,
      explanation:
        'BD Pyxis MedStation automated dispensing cabinet (ADC) market share reached an estimated 42.1% of the US installed base as of Q2 FY25 — 60 basis points above the 41.5% target and 130 basis points above the 40.8% Q2 FY24 level. The share gain reflects BD winning approximately 340 competitive ADC replacements from Omnicell in Q1-Q2 FY25, partly enabled by Omnicell\'s publicized service quality issues and stock outs following its own supply chain disruptions. Pyxis ES (enterprise server) upgrades also drove hospital system expansions at existing BD accounts, adding approximately 1,200 incremental dispensing cabinet units to the installed base without competitive displacement. BD\'s medication management segment within Connected Care benefits from high switching costs (hospital pharmacy workflow integration, staff training investment) and 5-7 year capital replacement cycles — making ADC market share gains highly durable once secured. BD management targets Pyxis reaching 44% US market share by FY27 through competitive displacement, new hospital construction wins, and automation expansion within existing accounts. Each 100bps of market share represents approximately $85M of incremental annual revenue.',
      status: 'resolved',
      relatedDrivers: ['Connected Care Revenue', 'Pyxis Market Share', 'Organic Revenue Growth'],
    },
    {
      metricName: 'BD Dividend $0.95/Share Q1 FY25 — Maintained; 52-Year Consecutive Annual Increase Streak',
      detectedAt: '2025-02-06T09:00:00Z',
      severity: 'info',
      direction: 'above_expected',
      expectedValue: 0.95,
      actualValue: 0.95,
      deviationPct: 0.0,
      explanation:
        'BD declared its Q1 FY26 quarterly dividend of $0.95 per share ($3.80 annualized) — maintaining BD\'s remarkable 52-year streak of consecutive annual dividend increases, one of the longest uninterrupted dividend growth records among S&P 500 industrial companies. BD is a member of the S&P 500 Dividend Aristocrats index. The $0.95/share quarterly dividend represents a +4.4% increase from the $0.91/share quarterly dividend paid in Q1 FY25. At the Q1 FY26 stock price of approximately $215/share, the annualized yield is approximately 1.8% — below the S&P 500 industrials sector average but consistent with BD\'s growth-oriented capital allocation prioritization. BD distributes approximately $1.0B annually in dividends at the current rate and 263M diluted share count. Management has committed to maintaining the annual dividend growth streak while preserving the net leverage deleveraging trajectory — the dividend growth will moderate to approximately 4-5% annually vs. the 5-7% historical pace until net leverage reaches 2.5x. CFO Christopher DelOrefice noted that the dividend is "non-negotiable from a commitment standpoint" even during the current leverage reduction phase.',
      status: 'resolved',
      relatedDrivers: ['Dividend', 'Free Cash Flow', 'Adjusted EPS', 'Net Debt to EBITDA'],
    },
  ];

  await prisma.anomalyDetection.createMany({
    data: anomalies.map((a) => ({
      companyId,
      metricName: a.metricName,
      detectedAt: a.detectedAt,
      severity: a.severity,
      direction: a.direction,
      expectedValue: a.expectedValue,
      actualValue: a.actualValue,
      deviationPct: a.deviationPct,
      explanation: a.explanation,
      status: a.status,
      relatedDrivers: a.relatedDrivers as string[],
    })),
  });

  console.log(`  Seeded ${anomalies.length} anomaly detection records for Becton, Dickinson and Company`);
}
