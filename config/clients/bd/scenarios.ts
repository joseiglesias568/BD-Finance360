// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/scenarios.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q2-26] [CITED:EC-Q2-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// BD Q2 FY2026 earnings call, IR slides, 10-Q, and FY2025 Annual Report.
// Scenario levers cover key BD drivers: Alaris ramp, GLP-1 demand, China VoBP,
// BioPharma destocking, FX rates, interest rates, and BD Excellence cost-out.
// Baseline = FY2026 management guidance midpoint ($12.62 adj. EPS).
// Revenue values in $M.
// ─────────────────────────────────────────────────────────────────────
import { ScenarioConfig } from '../../types';

export const scenarios: ScenarioConfig = {
  // FY2026 full-year baseline — revenues in $M
  baselineRevenue: 18933,              // FY2026 est. $M — low single-digit FXN growth from $18,195M [DERIVED]
  baselineMargin: 6.1,                 // FY2026 adj. net margin % (adj. EPS $12.62 × 282M shares / $18,933M) [DERIVED]

  levers: [
    // ─── GLP-1 Demand (BioPharma Systems) ───
    {
      id: 'glp1-demand',
      name: 'GLP-1 Drug Delivery Device Demand (BioPharma Systems, $M incremental revenue)',
      category: 'GLP-1 Demand Upside/Downside',
      min: -200,
      max: 800,
      default: 0,
      step: 50,
      unit: '$M incremental revenue',
      description:
        'BioPharma Systems GLP-1 delivery device upside/(downside) vs base plan. ' +
        'Base plan assumes destocking normalizes in H2 FY26 and GLP-1 orders begin ramping. ' +
        'Bull: pharmaceutical customers accelerate device orders as GLP-1 drug production scales — ' +
        '+$400–800M incremental BioPharma revenue by FY27 at ~35% operating margin. ' +
        'Bear: destocking persists; GLP-1 order placement delayed to FY27 (-$100–200M vs base).',
      impact: 'high',
    },
    {
      id: 'glp1-timing',
      name: 'GLP-1 Customer Ramp Timing (quarters of delay from base case)',
      category: 'GLP-1 Demand Upside/Downside',
      min: -2,
      max: 4,
      default: 0,
      step: 1,
      unit: 'quarters vs base',
      description:
        'GLP-1 order ramp timing relative to base case (0 = on schedule). ' +
        'Negative = ahead of schedule (upside); Positive = delayed (downside). ' +
        'Each 1-quarter delay in GLP-1 ramp ≈ -$75–100M annual BioPharma revenue. ' +
        'Timing uncertainty driven by drug manufacturer capacity planning and device qualification timelines.',
      impact: 'medium',
    },

    // ─── China VoBP Escalation ───
    {
      id: 'china-vobp-impact',
      name: 'China VoBP Headwind (%FXN impact on affected China revenues)',
      category: 'China VoBP Escalation',
      min: -30,
      max: 0,
      default: -14,
      step: 2,
      unit: '% FXN China headwind',
      description:
        'China Volume-Based Procurement headwind on affected BD product categories. ' +
        'Current: -14% FXN in Q2 FY26. Base case: stabilizes at -14% through FY26. ' +
        'Bear: VoBP expands to additional categories (-20% to -25% FXN headwind). ' +
        'Bull: new product cycles and private hospital channel partially offset to -8% or better. ' +
        'China represents ~10-12% of BD revenues. Each -5% incremental China headwind ≈ -$90–110M annual revenue.',
      impact: 'high',
    },
    {
      id: 'china-em-offset',
      name: 'Emerging Markets Organic Growth (% FXN — offset to China)',
      category: 'China VoBP Escalation',
      min: 3,
      max: 15,
      default: 7,
      step: 1,
      unit: '% FXN emerging markets growth',
      description:
        'Organic revenue growth in emerging markets (India, SE Asia, LatAm, ME) that partially offset China VoBP headwind. ' +
        'BD is accelerating emerging markets commercial investment. ' +
        'Each +2% emerging markets growth above base ≈ +$50M annual revenue offset. ' +
        'Base: +7% FXN. Bull: +12% if India and SE Asia programs gain traction. Bear: +4% if investments slow.',
      impact: 'medium',
    },

    // ─── Alaris Ramp-Up ───
    {
      id: 'alaris-completion-quarter',
      name: 'BD Alaris Remediation Completion (target quarter — FY quarter number)',
      category: 'Alaris Ramp-Up Acceleration',
      min: 7,
      max: 12,
      default: 8,
      step: 1,
      unit: 'FY quarter (Q4 FY26 = 8)',
      description:
        'BD Alaris customer site remediation completion quarter. Base case: Q4 FY26 (quarter 8 of FY). ' +
        'Each quarter of acceleration ≈ +$80–120M annualized Connected Care revenue. ' +
        'Delay to Q1 FY27 (quarter 9) would push revenue ramp into FY27. ' +
        '78% of sites complete as of Q2 FY26 — remaining 22% at risk of delay.',
      impact: 'high',
    },
    {
      id: 'connected-care-growth-rate',
      name: 'Connected Care Organic Growth Rate (% FXN)',
      category: 'Alaris Ramp-Up Acceleration',
      min: 0,
      max: 10,
      default: 4,
      step: 0.5,
      unit: '% FXN organic growth',
      description:
        'Connected Care full-year FY2026 organic growth rate FXN. ' +
        'Q2 FY26 actual: +3.2% FXN (below 5% target). Full Alaris ramp drives rate to 5%+. ' +
        'Each +1% Connected Care organic growth ≈ +$46M annual segment revenue (on $4,556M base). ' +
        'HemoSphere and Pyxis provide growth floor even with Alaris timing risk.',
      impact: 'medium',
    },

    // ─── FX Sensitivity ───
    {
      id: 'fx-impact-revenue',
      name: 'FX Translation Impact on Revenue vs Budget ($M)',
      category: 'FX Sensitivity Analysis',
      min: -600,
      max: 400,
      default: 0,
      step: 50,
      unit: '$M FX revenue impact',
      description:
        'Foreign currency translation impact on reported USD revenues vs FY2026 budget assumption. ' +
        'Positive = FX tailwind (weaker USD); Negative = FX headwind (stronger USD). ' +
        'Major exposure: EUR (~25% of revenue), JPY (~8%), CNY (~10%), GBP (~5%). ' +
        'BD has partial natural hedges via manufacturing costs in local currencies. ' +
        'Q2 FY26 FX added ~260bps to reported vs FXN growth rate.',
      impact: 'medium',
    },
    {
      id: 'fx-impact-eps',
      name: 'FX Transaction Impact on Adj. EPS ($ per share)',
      category: 'FX Sensitivity Analysis',
      min: -0.50,
      max: 0.30,
      default: 0.05,
      step: 0.05,
      unit: '$ per share FX impact',
      description:
        'Net FX transaction impact on adjusted EPS including hedging program. ' +
        'BD hedges significant transactional exposures. Primary residual risk: ' +
        'EUR/USD, JPY/USD, CNY/USD. Each $0.10 FX headwind ≈ ~$28M after-tax EPS impact.',
      impact: 'medium',
    },

    // ─── Interest Rate / Debt ───
    {
      id: 'interest-expense',
      name: 'Annual Interest Expense ($M)',
      category: 'Interest Rate / Debt Refinancing',
      min: 450,
      max: 750,
      default: 613,
      step: 25,
      unit: '$M interest expense',
      description:
        'Annual interest expense on BD long-term debt (Bard acquisition legacy). ' +
        'FY2025 actual: $613M. Debt paydown targets 2.5x leverage by FY2027. ' +
        'Each $50M reduction in interest expense ≈ +$0.13/share EPS (at ~25% tax rate, 282M shares). ' +
        'Bull: Fed rate cuts + debt paydown reduce to $500M. Bear: higher refinancing rates offset paydown savings.',
      impact: 'medium',
    },
    {
      id: 'debt-paydown',
      name: 'Annual Debt Paydown ($M)',
      category: 'Interest Rate / Debt Refinancing',
      min: 0,
      max: 2000,
      default: 800,
      step: 100,
      unit: '$M annual debt reduction',
      description:
        'Annual reduction in long-term debt principal from FCF allocation. ' +
        'Base: ~$800M annual paydown on path to 2.5x leverage. ' +
        'Each $200M additional paydown ≈ +$8M annual interest savings → +$0.02/share EPS. ' +
        'Tradeoff: additional debt paydown vs ASR execution.',
      impact: 'low',
    },

    // ─── BD Excellence Cost-Out ───
    {
      id: 'bd-excellence-savings',
      name: 'BD Excellence Cost-Out Run-Rate Achieved ($M)',
      category: 'M&A / Tuck-in Acquisition Impact',
      min: 100,
      max: 300,
      default: 200,
      step: 25,
      unit: '$M annualized cost savings',
      description:
        'BD Excellence program annualized cost-out run-rate. ' +
        'Q2 FY26: $150M achieved. Full target: $200M by Q4 FY26. ' +
        'Each $25M incremental savings ≈ +$0.07/share EPS (at ~25% tax rate). ' +
        'Upside potential: $250–300M if manufacturing productivity exceeds plan. ' +
        'Risk: lower revenue volume reduces cost absorption, partially offsetting savings.',
      impact: 'high',
    },
  ],

  preBuiltScenarios: [
    {
      id: 'base-case',
      name: 'Base Case — FY2026 Guidance Midpoint ($12.62 adj. EPS)',
      description:
        'FY2026 adj. EPS $12.62 (guidance midpoint $12.52–$12.72). ' +
        'Organic revenue growth ~3% FXN. BD Alaris 100% complete Q4 FY26. ' +
        'BD Excellence $200M cost-out achieved. China VoBP -14% FXN headwind stable. ' +
        'BioPharma destocking resolves H2 FY26. GLP-1 ramp on schedule. ' +
        'Net leverage improves from 2.9x toward 2.5x. FCF $3.0B.',
      icon: 'target',
      confidence: 60,
      revenueImpact: 0,
      marginImpact: 0,
      keyAssumptions: [
        'Organic revenue growth ~3% FXN (FY2026 guidance range)',
        'BD Alaris full commercial return Q4 FY26 — remediation on schedule',
        'BioPharma Systems destocking normalizes H2 FY26',
        'China VoBP headwind stable at ~-14% FXN; emerging markets +7% FXN',
        'BD Excellence: $200M cost-out run-rate by Q4 FY26',
        'GLP-1 delivery device orders beginning in H2 FY26',
        'FCF $3.0B; net leverage declining to ~2.7x by FY26 year-end',
        'Interest expense ~$613M; ASR execution on schedule',
      ],
      leverSettings: {
        'glp1-demand': 0,
        'glp1-timing': 0,
        'china-vobp-impact': -14,
        'china-em-offset': 7,
        'alaris-completion-quarter': 8,
        'connected-care-growth-rate': 4,
        'fx-impact-revenue': 0,
        'fx-impact-eps': 0.05,
        'interest-expense': 613,
        'debt-paydown': 800,
        'bd-excellence-savings': 200,
      },
    },
    {
      id: 'glp1-upside',
      name: 'GLP-1 Demand Upside — BioPharma Acceleration',
      description:
        'GLP-1 drug manufacturers accelerate device orders; destocking resolves early in Q3 FY26. ' +
        'BioPharma Systems swings from -1.8% to +5%+ FXN organic growth in H2 FY26. ' +
        'GLP-1 delivery platform wins multiple large pharma contracts. ' +
        'Adj. EPS approaches $13.00+ as BioPharma margin leverage is highest of all segments.',
      icon: 'trending-up',
      confidence: 20,
      revenueImpact: 350,
      marginImpact: 1.2,
      keyAssumptions: [
        'BioPharma destocking resolves by Q3 FY26 (1 quarter ahead of base)',
        'GLP-1 device orders begin ramping Q3 FY26 ($150M incremental H2 FY26)',
        'GLP-1 demand upside: +$200M above base in FY26; +$600M by FY27',
        'BioPharma Systems reaches +5% FXN organic for FY2026 full year',
        'All other levers at base case',
        'BioPharma operating margin 31%+ drives outsized EPS impact',
      ],
      leverSettings: {
        'glp1-demand': 200,
        'glp1-timing': -1,
        'china-vobp-impact': -14,
        'china-em-offset': 7,
        'alaris-completion-quarter': 8,
        'connected-care-growth-rate': 4,
        'fx-impact-revenue': 0,
        'fx-impact-eps': 0.05,
        'interest-expense': 613,
        'debt-paydown': 800,
        'bd-excellence-savings': 200,
      },
    },
    {
      id: 'china-vobp-escalation',
      name: 'China VoBP Escalation — Additional Categories Impacted',
      description:
        'China VoBP expands to additional BD Medical Essentials and Connected Care products, ' +
        'worsening headwind from -14% to -22% FXN. Emerging markets offset insufficient to compensate. ' +
        'BD organic growth drops to ~1.5% FXN for FY2026. ' +
        'Adj. EPS misses guidance at ~$12.10–12.25.',
      icon: 'trending-down',
      confidence: 15,
      revenueImpact: -320,
      marginImpact: -0.8,
      keyAssumptions: [
        'China VoBP expands — headwind worsens to -22% FXN',
        'Emerging markets growth only +5% FXN — insufficient offset',
        'Medical Essentials organic growth falls to near 0% FXN',
        'Connected Care organic growth 2% FXN (Alaris ramp partially offset)',
        'BioPharma and Interventional at base case',
        'BD management response: accelerated EM investment and private hospital China pivot',
      ],
      leverSettings: {
        'glp1-demand': 0,
        'glp1-timing': 0,
        'china-vobp-impact': -22,
        'china-em-offset': 5,
        'alaris-completion-quarter': 8,
        'connected-care-growth-rate': 2,
        'fx-impact-revenue': 0,
        'fx-impact-eps': 0.05,
        'interest-expense': 613,
        'debt-paydown': 800,
        'bd-excellence-savings': 200,
      },
    },
    {
      id: 'alaris-ramp-acceleration',
      name: 'Alaris Ramp-Up Acceleration — Q3 FY26 Full Return',
      description:
        'BD Alaris remediation completes 1 quarter ahead of schedule (Q3 FY26 vs Q4 base). ' +
        'Connected Care revenue acceleration in Q4 FY26 and FY27 exit run-rate. ' +
        'Connected Care reaches +5.5% FXN for FY2026 full year. ' +
        'EPS upside ~$0.15–0.20 from accelerated Alaris installed-base disposables revenue.',
      icon: 'zap',
      confidence: 25,
      revenueImpact: 180,
      marginImpact: 0.6,
      keyAssumptions: [
        'Alaris customer site remediation completes Q3 FY26 (Q7 vs Q8 base)',
        'Connected Care revenue acceleration in Q4 FY26 — full commercial return',
        'Connected Care full-year organic growth 5.5% FXN (vs 4% base)',
        'Pyxis dispensing and HemoSphere continue at base trajectory',
        'All other levers at base case',
        'Alaris installed-base disposables revenue ramp drives Connected Care sustainable growth',
      ],
      leverSettings: {
        'glp1-demand': 0,
        'glp1-timing': 0,
        'china-vobp-impact': -14,
        'china-em-offset': 7,
        'alaris-completion-quarter': 7,
        'connected-care-growth-rate': 5.5,
        'fx-impact-revenue': 0,
        'fx-impact-eps': 0.05,
        'interest-expense': 613,
        'debt-paydown': 800,
        'bd-excellence-savings': 200,
      },
    },
    {
      id: 'fx-headwind',
      name: 'FX Sensitivity — USD Strength Headwind',
      description:
        'USD strengthens significantly vs EUR, JPY, CNY — FX translation creates $300M revenue headwind ' +
        'and $0.25/share EPS headwind vs budget assumptions. ' +
        'Organic growth of 3% FXN unchanged, but reported revenue growth declines to ~1.5%. ' +
        'BD Excellence cost-out partially offsets FX margin impact.',
      icon: 'building-2',
      confidence: 20,
      revenueImpact: -300,
      marginImpact: -0.5,
      keyAssumptions: [
        'USD appreciates 8–10% vs EUR, JPY, and CNY vs FY2026 budget rates',
        'FX translation creates -$300M reported revenue headwind',
        'FX transaction impact -$0.20/share EPS after hedging',
        'Organic (FXN) growth unchanged at ~3% — all other levers at base',
        'BD manufacturing cost base partially hedged via EUR-denominated expenses',
        'BD hedging program reduces but does not eliminate FX EPS impact',
      ],
      leverSettings: {
        'glp1-demand': 0,
        'glp1-timing': 0,
        'china-vobp-impact': -14,
        'china-em-offset': 7,
        'alaris-completion-quarter': 8,
        'connected-care-growth-rate': 4,
        'fx-impact-revenue': -300,
        'fx-impact-eps': -0.20,
        'interest-expense': 613,
        'debt-paydown': 800,
        'bd-excellence-savings': 200,
      },
    },
    {
      id: 'tuck-in-acquisition',
      name: 'M&A / Tuck-in Acquisition — Bolt-On in Interventional or GLP-1',
      description:
        'BD executes a $1–2B tuck-in acquisition in Peripheral Intervention or GLP-1 delivery, ' +
        'accelerating inorganic growth. Near-term EPS dilution of ~$0.20–0.30 from interest/intangible amortization ' +
        'offset by ~$0.10 accretion by year 2. Net leverage ticks up to ~3.1x before recovering.',
      icon: 'building-2',
      confidence: 15,
      revenueImpact: 250,
      marginImpact: -0.4,
      keyAssumptions: [
        'Tuck-in acquisition of $1.5B in Interventional PI or BioPharma delivery',
        'Deal financed with mix of debt and FCF (~40/60 split)',
        'Net leverage increases temporarily to ~3.1x before continuing downward',
        'Revenue contribution: +$250M in year 1; +$500M+ run-rate',
        'Near-term EPS dilution -$0.25/share from interest and intangibles',
        '2.5x leverage target pushed 2 quarters beyond FY2027',
      ],
      leverSettings: {
        'glp1-demand': 150,
        'glp1-timing': 1,
        'china-vobp-impact': -14,
        'china-em-offset': 7,
        'alaris-completion-quarter': 8,
        'connected-care-growth-rate': 4,
        'fx-impact-revenue': 0,
        'fx-impact-eps': 0.05,
        'interest-expense': 680,
        'debt-paydown': 400,
        'bd-excellence-savings': 200,
      },
    },
  ],
};
