import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed Scenario Baseline, Levers, and Pre-Built Scenarios
//
// SOURCE: Becton, Dickinson and Company (BDX) — Q2 FY26 earnings (May 2026),
// FY2025 10-K, and investor guidance materials. FY ends September 30.
//
// Baseline anchored to FY2025 actuals + FY2026 guidance midpoint:
//   Revenue ~$18.0B guidance | Adj. EPS $12.52–$12.72 | Adj. op. margin ~25%
//   Waters spin-off completed Feb 2026 (continuing operations basis)
//
// CRITICAL: externalId values below ARE the FALLBACK_DEFAULTS keys used in
// lib/scenario-engine.ts. These must match exactly — any mismatch silently
// returns $0 impact without an error.
// =============================================================================

export async function seedScenarios(prisma: PrismaClient, companyId: number) {
  // Delete existing records before creating new ones
  await prisma.preBuiltScenario.deleteMany({ where: { companyId } });
  await prisma.scenarioLever.deleteMany({ where: { companyId } });
  await prisma.scenarioBaseline.deleteMany({ where: { companyId } });

  // Scenario Baseline (FY2026 guidance midpoint, in $M)
  await prisma.scenarioBaseline.create({
    data: {
      companyId,
      baselineRevenue:  18000, // FY2026 revenue guidance midpoint ($M, continuing ops)
      baselineMargin:   25.0,  // adjusted operating margin ~25% FY2026 guidance
      detailedBaseline: {
        revenue: {
          medicalEssentials:  6300, // Medical Essentials segment FY2026 est. ($M)
          connectedCare:      2160, // Connected Care segment FY2026 est. ($M)
          bioPharmaSystemsR:  4500, // BioPharma Systems segment FY2026 est. ($M)
          interventional:     5040, // Interventional segment FY2026 est. ($M)
        },
        opex: {
          costOfRevenue:      8820, // COGS ~49% of revenue ($M)
          sgaExpense:         2700, // SG&A ($M)
          rdExpense:           990, // R&D ($M)
          interestExpense:     620, // interest on ~$19.0B gross debt ($M)
        },
        taxRate:     0.155,
        shareCount:  285.0,  // diluted shares outstanding (M)
        sensitivity: {
          // BD earnings sensitivity constants for scenario engine
          eps_per_100M_revenue:   0.22,  // $ EPS per $100M revenue at ~25% margin
          eps_per_100M_opex:      0.24,  // $ EPS per $100M opex reduction
          eps_per_fx_1pct:       -0.08,  // $ EPS per +1% USD strengthening
          margin_per_vobp_100M: -0.006,  // margin pp per $100M China VoBP headwind
          revenue_per_alaris_q:  120,    // $M quarterly revenue when Alaris fully ramped
        },
      },
    },
  });

  console.log('Seeded BD scenario baseline');

  // Scenario Levers
  // CRITICAL: externalId must EXACTLY match FALLBACK_DEFAULTS keys in lib/scenario-engine.ts
  await prisma.scenarioLever.createMany({
    data: [
      // ── Scenario 1: GLP-1 / Drug Delivery Demand ──────────────────────
      {
        companyId,
        externalId: 'glp1-volume-growth',
        name: 'GLP-1 Drug Delivery Volume Growth (%)',
        category: 'BioPharma Systems',
        min:        0,
        max:       40,
        defaultVal: 18,
        step:       2,
        unit:       '% YoY volume growth',
        description:
          'Annual volume growth in prefillable syringes and drug delivery devices driven by GLP-1 agonist (Ozempic, Wegovy, Mounjaro) demand. BD is a primary supplier of prefillable syringe systems (PFS) and auto-injectors to Novo Nordisk and Eli Lilly. FY2026 plan: ~18% growth. Each +2% volume growth ≈ +$45–55M BioPharma Systems revenue. Capacity expansions at Franklin Lakes and Pont-de-Claix support demand ramp. Supply agreements extend through 2030.',
      },
      {
        companyId,
        externalId: 'biopharma-pricing',
        name: 'BioPharma Systems Pricing Realization (%)',
        category: 'BioPharma Systems',
        min:       -2.0,
        max:        5.0,
        defaultVal: 2.5,
        step:       0.5,
        unit:       '% net price realization',
        description:
          'Net average selling price realization across BD BioPharma Systems prefillable syringe, vial, and drug delivery portfolio. Pricing power reflects long-term supply agreements with pharmaceutical customers, mix shift toward premium components (coated barrels, nested PFS for automated fill-finish), and limited competition for high-precision drug delivery devices. FY2026 plan: +2.5%. Each +0.5pp pricing = ~+$22M BioPharma Systems operating income.',
      },
      {
        companyId,
        externalId: 'capacity-utilization',
        name: 'Manufacturing Capacity Utilization (%)',
        category: 'BioPharma Systems',
        min:       70,
        max:       95,
        defaultVal: 84,
        step:        2,
        unit:       '% utilization',
        description:
          'BD BioPharma Systems global manufacturing capacity utilization across PFS, vial, and closures facilities. FY2026 plan: ~84%. Each +5pp utilization ≈ +$60–80M incremental revenue without additional capex, given high fixed-cost manufacturing base. Capacity expansions underway in North Carolina and Ireland to support GLP-1 demand through FY2028. Utilization above 92% introduces delivery risk and quality compliance headwinds.',
      },
      // ── Scenario 2: China VoBP ────────────────────────────────────────
      {
        companyId,
        externalId: 'china-vobp-headwind',
        name: 'China Volume-Based Procurement Headwind ($M)',
        category: 'Medical Essentials',
        min:        50,
        max:       350,
        defaultVal: 160,
        step:       25,
        unit:       '$M annual revenue headwind',
        description:
          'Annual revenue headwind from China National Volume-Based Procurement (VoBP) price cuts on BD syringes, needles, blood collection, and diagnostics products. FY2026 plan: ~$160M headwind. Additional VoBP waves targeting infusion sets, insulin syringes, and diagnostics consumables are planned. Each additional $50M headwind = approximately −0.3pp BD consolidated adjusted operating margin. Mitigation: mix shift to premium non-tendered products, digital solutions, and diagnostics platforms.',
      },
      {
        companyId,
        externalId: 'emerging-markets-offset',
        name: 'Emerging Markets (ex-China) Revenue Growth (%)',
        category: 'Medical Essentials',
        min:        2,
        max:       15,
        defaultVal:  8,
        step:        1,
        unit:       '% YoY emerging markets growth',
        description:
          'Revenue growth across emerging markets excluding China (India, Southeast Asia, Latin America, Middle East, Africa). BD Medical Essentials (syringes, IV catheters, blood management) benefits from healthcare infrastructure investment and BD Life Sciences diagnostics expansion in these markets. FY2026 plan: ~8%. Each +1pp emerging market growth above plan ≈ +$28M revenue, partially offsetting China VoBP headwinds.',
      },
      {
        companyId,
        externalId: 'us-volume-growth',
        name: 'U.S. Medical Essentials Volume Growth (%)',
        category: 'Medical Essentials',
        min:        0,
        max:        8,
        defaultVal:  3,
        step:       0.5,
        unit:       '% U.S. volume growth',
        description:
          'U.S. volume growth for BD Medical Essentials consumables (syringes, needles, IV catheters, blood collection, sharps disposal). FY2026 plan: ~3% driven by GPO contract wins, hospital census growth, and insulin pen needle adoption with GLP-1 demand ramp. Each +1pp U.S. volume growth ≈ +$35M Medical Essentials revenue. Competitive pressure from B. Braun and ICU Medical on IV therapy consumables is the primary risk.',
      },
      // ── Scenario 3: Alaris Market Return ─────────────────────────────
      {
        companyId,
        externalId: 'alaris-ramp-rate',
        name: 'Alaris Infusion Pump Annual Shipment Units (K)',
        category: 'Connected Care',
        min:        20,
        max:       140,
        defaultVal: 75,
        step:       10,
        unit:       'K units shipped annually',
        description:
          'Annual Alaris infusion pump shipment units following FDA consent decree resolution. BD Alaris has cleared the 510(k) backlog and obtained FDA remediation approval. FY2026 plan: ~75K units. Pre-consent decree Alaris revenue run-rate was ~$500M. Full market return to pre-decree levels (~120–140K units) expected in FY2027–FY2028. Each +10K units above plan ≈ +$35–45M Connected Care revenue. Backlog of deferred capital orders at healthcare systems represents significant pent-up demand.',
      },
      {
        companyId,
        externalId: 'mms-capital-placements',
        name: 'Smart Medication Management Capital Placements (units)',
        category: 'Connected Care',
        min:         500,
        max:        4000,
        defaultVal: 1800,
        step:        200,
        unit:       'dispensing cabinet & system placements',
        description:
          'Annual placements of BD Pyxis MedStation, BD Roper, and Dispensing robotics systems (Smart Medication Management). FY2026 plan: ~1,800 units. Each placement generates $50–90K upfront capital revenue plus $12–18K annual recurring software/service revenue. Capital cycle replacements and new U.S. hospital openings drive volume. EMR/EPIC integration and pharmacy automation trends support demand. Recurring revenue base growing toward $600M+ annually.',
      },
      {
        companyId,
        externalId: 'connected-care-growth',
        name: 'Connected Care Software & Services Growth (%)',
        category: 'Connected Care',
        min:        2,
        max:       18,
        defaultVal:  9,
        step:        1,
        unit:       '% YoY software & services revenue growth',
        description:
          'Annual growth rate for BD Connected Care recurring software, analytics, and service revenue (Pyxis software, Alaris software, nursing analytics, BD HealthSight). FY2026 plan: ~9% growth. Connected Care software represents ~30% of segment revenue with gross margins >70%, versus ~35% on hardware. Mix shift toward software improves segment operating margin by 50–80bps annually. EMR integration capabilities and real-time medication management analytics drive retention and upsell.',
      },
      // ── Scenario 4: FX Sensitivity ────────────────────────────────────
      {
        companyId,
        externalId: 'fx-impact-revenue',
        name: 'FX Translation Impact on Revenue ($M)',
        category: 'International',
        min:       -600,
        max:        200,
        defaultVal: -230,
        step:        50,
        unit:       '$M annual FX translation headwind/(tailwind)',
        description:
          'Annual FX translation impact on BD consolidated revenue from USD strengthening vs euro, yen, Chinese yuan, Brazilian real, and other currencies. BD generates ~48% of revenue internationally. FY2026 plan: ~($230M) headwind on reported revenue basis. Each $50M shift in FX impact = approximately +/− 0.3pp adjusted operating margin (constant currency vs reported). Principal exposures: EUR (~18% of revenue), CNY (~10%), JPY (~4%), BRL (~3%).',
      },
      {
        companyId,
        externalId: 'international-mix-shift',
        name: 'International Revenue Mix (%)',
        category: 'International',
        min:       42,
        max:       56,
        defaultVal: 48,
        step:        1,
        unit:       '% of total revenue from international',
        description:
          'International revenue as a percentage of BD total revenue. FY2026 plan: ~48%. Higher international mix increases FX exposure but reflects growth in higher-margin BioPharma Systems (mostly international pharma customers) and emerging market Medical Essentials. Each +1pp international mix shift = ~$180M additional international revenue at current total revenue base. BioPharma Systems (European pharma customers) and China diagnostics are the primary mix drivers.',
      },
      {
        companyId,
        externalId: 'hedging-benefit',
        name: 'Net Hedging & Pricing Benefit ($M)',
        category: 'International',
        min:         0,
        max:       200,
        defaultVal:  65,
        step:        15,
        unit:       '$M hedging offset to FX headwind',
        description:
          'Net benefit from BD FX hedging programs and international pricing adjustments offsetting currency translation headwinds. BD uses a combination of natural hedging (local currency costs), cross-currency swaps, and forward contracts. FY2026 plan: ~$65M net hedge benefit. Local pricing increases in high-inflation emerging markets (Argentina, Turkey, Brazil) provide an additional ~$40–60M partial offset to reported FX headwinds.',
      },
      // ── Scenario 5: Debt Reduction Acceleration ──────────────────────
      {
        companyId,
        externalId: 'fcf-conversion',
        name: 'Free Cash Flow Conversion Rate (% of adj. net income)',
        category: 'Capital Structure',
        min:        70,
        max:       115,
        defaultVal: 95,
        step:        5,
        unit:       '% FCF / adj. net income conversion',
        description:
          'BD free cash flow conversion as a percentage of adjusted net income. FY2026 plan: ~95%. BD generates ~$3.0B+ annual FCF. Higher conversion driven by working capital discipline (DSO improvement, inventory reduction post-supply chain normalization) and lower capex intensity as GLP-1 capacity build matures. Each +5pp FCF conversion ≈ +$150M additional annual free cash flow available for debt reduction.',
      },
      {
        companyId,
        externalId: 'debt-paydown-rate',
        name: 'Annual Gross Debt Reduction ($M)',
        category: 'Capital Structure',
        min:         500,
        max:        3500,
        defaultVal: 1500,
        step:        250,
        unit:       '$M annual gross debt reduction',
        description:
          'Annual gross debt reduction through FCF-funded debt maturities and optional prepayments. FY2026 plan: ~$1,500M. BD leverage (net debt / adj. EBITDA) at ~2.9x Q2 FY26; target <2.5x by FY2028. Alaris remediation cash costs (~$300M FY26) and Waters-related transaction costs reduce capacity. Each additional $250M debt reduction ≈ −0.06x leverage ratio improvement. Credit rating upgrade from Baa1/BBB+ is catalyzed at ≤2.5x leverage.',
      },
      {
        companyId,
        externalId: 'interest-expense-savings',
        name: 'Annual Interest Expense Savings from Refinancing ($M)',
        category: 'Capital Structure',
        min:         0,
        max:       250,
        defaultVal:  60,
        step:        20,
        unit:       '$M annual interest expense savings',
        description:
          'Annual interest expense savings from maturing high-coupon debt retirement and opportunistic refinancing at current market rates. FY2026 plan: ~$60M savings. BD has ~$2.0B of debt maturities in FY2026–FY2027 where refinancing at lower coupon is feasible as rates moderate. Each $20M interest expense reduction ≈ +$0.05/share adjusted EPS. Combined with FCF debt paydown, BD targets >$100M annual interest savings by FY2028.',
      },
    ],
  });

  console.log('Seeded 15 BD scenario levers');

  // Pre-Built Scenarios (5 BD-specific scenarios)
  await prisma.preBuiltScenario.createMany({
    data: [
      {
        companyId,
        externalId: 'base-case',
        name: 'FY2026 Base — Guidance Midpoint',
        description:
          'FY2026 guidance midpoint: adj. EPS $12.62 (midpoint $12.52–$12.72), adj. op. margin ~25%, revenue ~$18.0B on continuing ops basis. GLP-1 PFS volume +18%, Alaris pump ramp 75K units, China VoBP headwind $160M, FX headwind ~$230M. FCF conversion ~95%, gross debt reduction ~$1,500M toward 2.5x leverage target by FY2028.',
        leverSettings: {
          'glp1-volume-growth':      18,
          'biopharma-pricing':        2.5,
          'capacity-utilization':    84,
          'china-vobp-headwind':    160,
          'emerging-markets-offset':  8,
          'us-volume-growth':         3,
          'alaris-ramp-rate':        75,
          'mms-capital-placements': 1800,
          'connected-care-growth':    9,
          'fx-impact-revenue':     -230,
          'international-mix-shift': 48,
          'hedging-benefit':         65,
          'fcf-conversion':          95,
          'debt-paydown-rate':     1500,
          'interest-expense-savings': 60,
        },
        revenueImpact:   0,
        marginImpact:    0,
        confidence:     65,
        keyAssumptions: [
          'GLP-1 prefillable syringe demand sustains +18% volume growth through FY2026',
          'Alaris pump ramp to 75K units with no incremental consent decree setbacks',
          'China VoBP at $160M headwind — no additional tender waves beyond plan',
          'FX headwind ~$230M at current USD/EUR/CNY rates',
          'Leverage declining from 2.9x toward 2.5x target by FY2028',
          'Waters spin-off completed Feb 2026 — continuing ops basis throughout',
        ],
      },
      {
        companyId,
        externalId: 'glp1-demand-upside',
        name: 'GLP-1 Demand Upside — BioPharma Systems Outperforms',
        description:
          'GLP-1 prefillable syringe volume growth accelerates to +28% as Novo Nordisk and Eli Lilly expand next-generation obesity drug launches. BD capacity utilization reaches 91%. BioPharma Systems pricing realization improves to +3.5%. Revenue upside ~$450M above base case, adj. EPS approaching $13.40+. Capacity constraint risk emerges above 92% utilization.',
        leverSettings: {
          'glp1-volume-growth':      28,
          'biopharma-pricing':        3.5,
          'capacity-utilization':    91,
          'china-vobp-headwind':    160,
          'emerging-markets-offset':  9,
          'us-volume-growth':         3,
          'alaris-ramp-rate':        75,
          'mms-capital-placements': 1800,
          'connected-care-growth':   10,
          'fx-impact-revenue':     -180,
          'international-mix-shift': 50,
          'hedging-benefit':         80,
          'fcf-conversion':          98,
          'debt-paydown-rate':     1750,
          'interest-expense-savings': 80,
        },
        revenueImpact:  450,
        marginImpact:   135,
        confidence:      25,
        keyAssumptions: [
          'Novo Nordisk and Lilly GLP-1 supply agreements expand with additional PFS volumes',
          'BD capacity additions (North Carolina, Ireland) come online 2 quarters ahead of plan',
          'Pricing realization improves as pharma customers accept premium coated barrel specifications',
          'FX headwind moderates as EUR/USD and CNY/USD stabilize',
          'No competitor capacity additions from Gerresheimer or Schott before FY2027',
        ],
      },
      {
        companyId,
        externalId: 'china-vobp-escalation',
        name: 'China VoBP Escalation — Headwind Doubles to $320M',
        description:
          'China National Healthcare Security Administration launches two additional VoBP tender waves covering insulin syringes, IV catheters, and diagnostics consumables. Total annual VoBP headwind escalates to $320M vs $160M plan. Medical Essentials operating margin compresses by ~2pp. EPS at risk to $12.10 or below. Emerging market offset and U.S. share gains partially mitigate.',
        leverSettings: {
          'glp1-volume-growth':      18,
          'biopharma-pricing':        2.5,
          'capacity-utilization':    84,
          'china-vobp-headwind':    320,
          'emerging-markets-offset':  6,
          'us-volume-growth':         4,
          'alaris-ramp-rate':        75,
          'mms-capital-placements': 1800,
          'connected-care-growth':    9,
          'fx-impact-revenue':     -280,
          'international-mix-shift': 46,
          'hedging-benefit':         50,
          'fcf-conversion':          92,
          'debt-paydown-rate':     1250,
          'interest-expense-savings': 50,
        },
        revenueImpact:  -320,
        marginImpact:   -200,
        confidence:       15,
        keyAssumptions: [
          'China NHSA expands VoBP to cover insulin syringes and IV therapy consumables in FY2026',
          'Average price cuts of 55–65% on newly tendered BD products',
          'Emerging market growth moderates to 6% as global macro softens',
          'U.S. volume growth partially compensates at +4% on GPO contract wins',
          'China revenue share declines from ~10% to ~7% of total over 2 years',
          'Guidance risk: adj. EPS $12.10 floor if VoBP escalation materializes in H2 FY2026',
        ],
      },
      {
        companyId,
        externalId: 'alaris-market-return',
        name: 'Alaris Full Market Return — Connected Care Re-Acceleration',
        description:
          'Alaris infusion pump volumes ramp to 120K units annually as deferred hospital capital orders materialize and consent decree constraints lift fully. Connected Care revenue accelerates +18% with Pyxis MedStation capital cycle replacement synergies. Revenue upside ~$280M, EPS run-rate toward $13.20+. Alaris software attach rates and recurring revenue provide high-quality incremental earnings.',
        leverSettings: {
          'glp1-volume-growth':      18,
          'biopharma-pricing':        2.5,
          'capacity-utilization':    84,
          'china-vobp-headwind':    160,
          'emerging-markets-offset':  8,
          'us-volume-growth':         3,
          'alaris-ramp-rate':       120,
          'mms-capital-placements': 2600,
          'connected-care-growth':   18,
          'fx-impact-revenue':     -230,
          'international-mix-shift': 48,
          'hedging-benefit':         65,
          'fcf-conversion':          97,
          'debt-paydown-rate':     1650,
          'interest-expense-savings': 70,
        },
        revenueImpact:  280,
        marginImpact:    98,
        confidence:      30,
        keyAssumptions: [
          'FDA confirmation of full consent decree resolution by Q1 FY2027',
          'Hospital capital budgets release deferred Alaris orders (est. 40–50K units backlogged)',
          'Pyxis MedStation capital cycle replacement accelerates alongside Alaris upgrade projects',
          'Connected Care software attach rate increases to 85% of hardware placements',
          'No incremental FDA 483 observations or warning letters on Alaris manufacturing',
        ],
      },
      {
        companyId,
        externalId: 'debt-reduction-acceleration',
        name: 'Debt Reduction Acceleration — Leverage to 2.3x by FY2027',
        description:
          'BD accelerates gross debt reduction to $2,500M annually by directing all excess FCF to debt retirement, prioritizing higher-coupon tranches. Leverage reaches 2.3x by FY2027, triggering credit upgrade and enabling share repurchase reinstatement. Interest expense savings reach $120M/year. EPS accretion of $0.25–$0.35/share from combined interest savings and capital return.',
        leverSettings: {
          'glp1-volume-growth':      18,
          'biopharma-pricing':        2.5,
          'capacity-utilization':    84,
          'china-vobp-headwind':    160,
          'emerging-markets-offset':  8,
          'us-volume-growth':         3,
          'alaris-ramp-rate':        75,
          'mms-capital-placements': 1800,
          'connected-care-growth':    9,
          'fx-impact-revenue':     -230,
          'international-mix-shift': 48,
          'hedging-benefit':         65,
          'fcf-conversion':         105,
          'debt-paydown-rate':     2500,
          'interest-expense-savings': 120,
        },
        revenueImpact:    0,
        marginImpact:   120,
        confidence:      30,
        keyAssumptions: [
          'FCF conversion improves to 105% through working capital discipline',
          'No material acquisitions divert FCF from debt paydown through FY2027',
          'Higher-coupon legacy debt tranches ($1.5B+ above 4.5%) retired ahead of schedule',
          'Credit rating upgrade from Baa1/BBB+ unlocks ~15bps lower spread on new issuance',
          'Share repurchase program reinstated at 2.3x leverage, adding $0.15–0.20/share EPS by FY2028',
        ],
      },
    ],
  });

  console.log('Seeded 5 BD pre-built scenarios');
}
