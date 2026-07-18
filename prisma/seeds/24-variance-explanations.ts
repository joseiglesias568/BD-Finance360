import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 24: Variance Explanations — Becton, Dickinson and Company (NYSE: BDX)
// 4 metrics × 2 types × 5 quarters = 40 records
// BD fiscal year: Q1=Oct-Dec, Q2=Jan-Mar, Q3=Apr-Jun, Q4=Jul-Sep
//
// Metrics: Revenue, Adjusted Operating Margin, Adjusted Diluted EPS,
//          Organic Revenue Growth (FXN)
// Types:   actual_vs_plan  |  actual_vs_prior_year
// Quarters: Q1 FY25, Q2 FY25, Q3 FY25, Q4 FY25, Q1 FY26
//
// BD Key Facts:
//   Q2 FY26 actual: Revenue $4,714M (+2.6% FXN) | Adj. EPS $2.90 (+3.9%) | Adj. Op Margin 24.2%
//   FY26 guidance: Revenue ~$18,900–$19,100M | Adj. EPS $12.52–$12.72 | Adj. Op Margin ~25%
//   Net leverage: 2.9x (→2.5x target) | Excellence Unleashed $150M savings achieved
//   Strategy: Excellence Unleashed — Compete, Innovate, Deliver
// =============================================================================

const QUARTER_LABELS = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26'];

interface DriverBreakdown {
  driver: string;
  impact: number;
  impactUnit: string;
  explanation: string;
  confidence: number;
}

interface VarianceRecord {
  quarter: string;
  metricName: string;
  varianceType: 'actual_vs_plan' | 'actual_vs_prior_year';
  totalVariance: number;
  totalVarianceUnit: string;
  driverBreakdown: DriverBreakdown[];
  narrative: string;
  recommendations: string[];
}

const records: VarianceRecord[] = [

  // ───────────────────────────────────────────────────────────────────────────
  // Q1 FY25 (Oct-Dec 2024)
  // Revenue $4,655M | Adj. Op Margin 23.5% | Adj. EPS $3.02 | Organic FXN +3.2%
  // Plan: Revenue $4,700M | Margin 23.8% | EPS $3.05 | FXN +3.8%
  // ───────────────────────────────────────────────────────────────────────────

  {
    quarter: 'Q1 FY25', metricName: 'Revenue', varianceType: 'actual_vs_plan',
    totalVariance: -45, totalVarianceUnit: '$M',
    driverBreakdown: [
      { driver: 'China VoBP Pricing Headwind Worse Than Plan', impact: -65, impactUnit: '$M', explanation: 'China VoBP Round 8 pricing reductions deeper than modeled; BD specimen collection and infusion products in scope; China revenue -8.5% FXN vs -7.0% plan; volume maintained but ASP reduction exceeded forecast', confidence: 0.86 },
      { driver: 'Alaris Volume Below Plan', impact: -40, impactUnit: '$M', explanation: 'BD Alaris infusion system placements below plan as consent decree remediation (65% complete at Q1 FY25) limits full commercial re-entry; some hospital accounts delaying Alaris decisions pending BD progress disclosure', confidence: 0.84 },
      { driver: 'BioPharma Systems GLP-1 Above Plan', impact: +55, impactUnit: '$M', explanation: 'Pharmaceutical Systems prefillable syringe demand above plan as GLP-1 manufacturers scale manufacturing; Novo Nordisk and Eli Lilly syringe orders ahead of plan ramp; strongest BD segment performance', confidence: 0.88 },
      { driver: 'Americas Organic Growth Above Plan', impact: +25, impactUnit: '$M', explanation: 'US market organic growth +3.8% vs +3.5% plan; PureWick new hospital accounts above plan; Interventional vascular market share gains tracking ahead of BD BD FY25 plan assumptions', confidence: 0.84 },
      { driver: 'FX Headwind Worse Than Plan', impact: -20, impactUnit: '$M', explanation: 'EUR/USD and JPY weaker than plan FX assumptions; reported revenue impact -0.4% more than hedged; EMEA reported below plan despite solid FXN performance', confidence: 0.82 },
    ],
    narrative: 'Q1 FY25 revenue of $4,655M missed plan by $45M (-1.0%). China VoBP pricing pressures deeper than modeled and Alaris consent decree headwinds were the primary drags. BioPharma Systems GLP-1 momentum and Americas PureWick growth partially offset. Q1 is BD\'s seasonally weakest quarter and the modest miss reflects China and Alaris transitory headwinds rather than structural demand deterioration.',
    recommendations: [
      'Accelerate Alaris consent decree remediation disclosure to hospital customers — 65% completion at Q1 is a positive story; publish formal milestone update to unblock delayed Alaris account decisions',
      'Quantify GLP-1 tailwind contribution as standalone disclosure: BioPharma Systems above-plan performance driven by Pharmaceutical Systems syringe demand is a durable multi-year growth driver worth highlighting',
    ],
  },
  {
    quarter: 'Q1 FY25', metricName: 'Revenue', varianceType: 'actual_vs_prior_year',
    totalVariance: 75, totalVarianceUnit: '$M',
    driverBreakdown: [
      { driver: 'BioPharma Systems GLP-1 Volume Growth', impact: +95, impactUnit: '$M', explanation: 'Pharmaceutical Systems prefillable syringe demand +8.5% FXN YoY; GLP-1 manufacturing ramp by pharma customers driving multi-year volume commitment; BD Pharmaceutical Systems outperforming enterprise average', confidence: 0.90 },
      { driver: 'PureWick & Medical Essentials Growth', impact: +55, impactUnit: '$M', explanation: 'PureWick external catheter +22% YoY as hospital formulary adoption accelerates; Medical Essentials consumables stable organic growth +3.4% FXN YoY; BD branded consumables gaining share', confidence: 0.88 },
      { driver: 'China VoBP YoY Headwind', impact: -80, impactUnit: '$M', explanation: 'China VoBP pricing reduction net impact -$80M YoY as Q1 FY24 was pre-Round 8; Q1 FY25 reflects full VoBP Round 8 impact; China revenue -8.5% FXN vs +2.5% FXN Q1 FY24', confidence: 0.86 },
      { driver: 'Alaris YoY Headwind', impact: -45, impactUnit: '$M', explanation: 'BD Alaris volume constrained by consent decree; Q1 FY25 Alaris below Q1 FY24 due to hospital purchasing deferrals; remediation progress building toward full commercial re-entry', confidence: 0.84 },
      { driver: 'FX Translation Headwind', impact: +50, impactUnit: '$M', explanation: 'FX translation impact on reported revenue net +$50M; EMEA FXN growth not fully translating at current EUR/USD; BD organic growth FXN +3.2% vs reported +1.6%', confidence: 0.82 },
    ],
    narrative: 'Q1 FY25 revenue grew $75M or +1.6% YoY ($4,580M to $4,655M). BioPharma Systems GLP-1 strength and PureWick growth drove above-enterprise-average performance in the highest-margin segments. China VoBP and Alaris were the primary headwinds. The organic FXN growth of +3.2% understates the underlying BD business momentum when China VoBP and Alaris are excluded.',
    recommendations: [
      'Communicate ex-China VoBP and ex-Alaris organic growth rate (~+5.2% FXN) as the best measure of BD\'s underlying business trajectory; helps investors understand that two specific temporary headwinds are masking strong portfolio performance',
    ],
  },

  {
    quarter: 'Q1 FY25', metricName: 'Adjusted Operating Margin', varianceType: 'actual_vs_plan',
    totalVariance: -30, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'Alaris Volume Deleverage', impact: -45, impactUnit: 'bps', explanation: 'Alaris below-plan revenue creates negative operating leverage on BD Connected Care fixed manufacturing and R&D costs; consent decree compliance costs embedded at ~$15M/quarter; margin dilution on lower Alaris revenue base', confidence: 0.86 },
      { driver: 'China VoBP Revenue Headwind', impact: -25, impactUnit: 'bps', explanation: 'China VoBP reduces revenue denominator without proportional cost reduction; BD China manufacturing costs fixed in near term; lower China revenue creates margin dilution', confidence: 0.84 },
      { driver: 'BioPharma Systems Favorable Mix', impact: +28, impactUnit: 'bps', explanation: 'Above-plan BioPharma Systems GLP-1 revenue at segment margin ~45% (highest in BD portfolio) creates favorable enterprise mix shift; Pharmaceutical Systems above-plan growth adding margin above enterprise average', confidence: 0.88 },
      { driver: 'Excellence Unleashed Savings', impact: +22, impactUnit: 'bps', explanation: 'Excellence Unleashed cost savings tracking to plan in Q1 FY25; manufacturing efficiencies and SAE reduction partially offsetting volume headwinds; $25M in savings delivered Q1', confidence: 0.86 },
      { driver: 'FX Headwind on Margin', impact: -10, impactUnit: 'bps', explanation: 'EUR/USD FX headwind reduces EMEA reported margin contribution; EMEA operating costs in EUR partially offset revenue FX impact but net margin effect slightly adverse', confidence: 0.82 },
    ],
    narrative: 'Q1 FY25 adjusted operating margin of 23.5% was 30bps below the 23.8% plan. Alaris deleverage and China VoBP revenue headwinds offset BioPharma Systems favorable mix and Excellence Unleashed savings. The margin miss is modest and consistent with known headwinds. The underlying margin trajectory — excluding Alaris and China — is constructive.',
    recommendations: [
      'Track and communicate the progress path to >25% adjusted operating margin as Alaris consent decree resolves and Excellence Unleashed savings ramp; Alaris return to full commercial re-entry is the single largest margin lever in the portfolio',
    ],
  },
  {
    quarter: 'Q1 FY25', metricName: 'Adjusted Operating Margin', varianceType: 'actual_vs_prior_year',
    totalVariance: -20, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP Margin Compression YoY', impact: -55, impactUnit: 'bps', explanation: 'China VoBP rounds create year-over-year margin headwind as pricing reductions are cumulative; Q1 FY24 was pre-full VoBP impact; ~-55bps YoY enterprise margin from China pricing deterioration', confidence: 0.88 },
      { driver: 'Excellence Unleashed Savings YoY', impact: +30, impactUnit: 'bps', explanation: 'Excellence Unleashed program generating YoY margin improvement; Q1 FY25 savings above Q1 FY24 baseline; manufacturing efficiency and SAE reduction delivering structural improvement', confidence: 0.86 },
      { driver: 'BioPharma Systems Favorable Mix YoY', impact: +25, impactUnit: 'bps', explanation: 'BioPharma Systems growing faster than enterprise average and carrying highest margins; favorable mix shift improving enterprise margin YoY', confidence: 0.86 },
      { driver: 'Alaris YoY Headwind', impact: -20, impactUnit: 'bps', explanation: 'Alaris below Q1 FY24 on consent decree volume constraints; margin deleverage on Connected Care fixed costs', confidence: 0.84 },
    ],
    narrative: 'Q1 FY25 adjusted operating margin contracted 20bps YoY from 23.7% (Q1 FY24) to 23.5%. China VoBP cumulative pricing pressure and Alaris headwinds are the drivers. Excellence Unleashed savings and favorable BioPharma Systems mix provide partial offset. The margin compression is concentrated in two identifiable and manageable headwinds rather than broad-based deterioration.',
    recommendations: [
      'Provide a segment-disaggregated margin bridge showing BioPharma Systems and Medical Essentials margins improving YoY; Connected Care margin pressure from Alaris is the concentrated headwind that resolves as consent decree concludes',
    ],
  },

  {
    quarter: 'Q1 FY25', metricName: 'Adjusted Diluted EPS', varianceType: 'actual_vs_plan',
    totalVariance: -0.03, totalVarianceUnit: '$/share',
    driverBreakdown: [
      { driver: 'Revenue Miss Flow-Through', impact: -0.05, impactUnit: '$/share', explanation: '-$45M revenue vs plan at BD blended adjusted operating margin ~23.5%; after-tax EPS impact approximately -$0.05/share; China VoBP and Alaris drove revenue shortfall', confidence: 0.86 },
      { driver: 'BioPharma Mix Favorable', impact: +0.04, impactUnit: '$/share', explanation: 'Above-plan BioPharma Systems revenue at higher-than-enterprise margins generates incremental EPS; GLP-1 syringe demand flow-through to adjusted EPS', confidence: 0.86 },
      { driver: 'Excellence Unleashed Savings', impact: +0.03, impactUnit: '$/share', explanation: 'Q1 FY25 Excellence Unleashed savings tracking to plan; manufacturing and SAE savings partially offsetting volume headwinds', confidence: 0.86 },
      { driver: 'Interest Expense Favorable', impact: +0.02, impactUnit: '$/share', explanation: 'Interest expense slightly below plan on $1.0B Q4 FY24 debt repayment; modest run-rate benefit in Q1 FY25', confidence: 0.84 },
      { driver: 'Amortization In-Line', impact: -0.01, impactUnit: '$/share', explanation: 'Bard acquisition amortization tracking to schedule; minor adjustment from BD Interventional intangible finalization; essentially in-line with plan', confidence: 0.90 },
      { driver: 'Tax Rate Slightly Adverse', impact: -0.06, impactUnit: '$/share', explanation: 'Effective tax rate slightly above plan on geographic income mix; lower China income reduces favorable China tax regime benefit; tax rate 21.8% vs 21.2% plan', confidence: 0.84 },
    ],
    narrative: 'Q1 FY25 Adj. EPS of $3.02 missed plan by $0.03 (-1.0%). The revenue miss, partially offset by favorable BioPharma mix and Excellence Unleashed savings, flows through to a minimal EPS miss. A slightly adverse tax rate from China income mix was the incremental headwind. The near-plan EPS performance despite the revenue shortfall demonstrates the resilience of BD\'s cost structure and the benefit of Excellence Unleashed.',
    recommendations: [
      'The minimal EPS miss relative to revenue miss confirms Excellence Unleashed is working to protect profitability; highlight cost structure resilience in earnings communication to reinforce confidence in FY25 EPS guidance',
      'Monitor China tax rate impact as VoBP reduces China-source income; lower China income could modestly increase BD effective tax rate if China had been a favorable-rate jurisdiction',
    ],
  },
  {
    quarter: 'Q1 FY25', metricName: 'Adjusted Diluted EPS', varianceType: 'actual_vs_prior_year',
    totalVariance: 0.18, totalVarianceUnit: '$/share',
    driverBreakdown: [
      { driver: 'BioPharma Systems & PureWick Growth', impact: +0.22, impactUnit: '$/share', explanation: 'High-margin segment revenue growth in BioPharma Systems (GLP-1) and PureWick driving above-average EPS contribution; segment mix improving toward highest-margin products', confidence: 0.88 },
      { driver: 'Excellence Unleashed Savings YoY', impact: +0.15, impactUnit: '$/share', explanation: 'Excellence Unleashed manufacturing and SAE savings building YoY; $25M Q1 FY25 vs minimal savings Q1 FY24; structural margin improvement flowing to EPS', confidence: 0.86 },
      { driver: 'Interest Expense Reduction YoY', impact: +0.08, impactUnit: '$/share', explanation: '$1.0B+ debt repayment reducing interest expense YoY; ~$50M annual interest savings from FY24 deleveraging; leverage 2.9x', confidence: 0.88 },
      { driver: 'Amortization Decline YoY', impact: +0.05, impactUnit: '$/share', explanation: 'Bard acquisition amortization declining on schedule; Q1 FY25 amortization below Q1 FY24 by ~$10M; growing non-cash tailwind for adjusted EPS', confidence: 0.86 },
      { driver: 'China VoBP YoY Headwind', impact: -0.22, impactUnit: '$/share', explanation: 'China VoBP cumulative pricing pressure -$80M revenue YoY; after-tax EPS impact approximately -$0.22/share; offset by BD portfolio growth elsewhere', confidence: 0.86 },
      { driver: 'Alaris Volume YoY Headwind', impact: -0.10, impactUnit: '$/share', explanation: 'Alaris below Q1 FY24 volume on consent decree constraints; -$45M revenue YoY; after-tax EPS impact approximately -$0.10/share', confidence: 0.84 },
    ],
    narrative: 'Q1 FY25 Adj. EPS grew +$0.18 or +6.3% YoY from $2.84 to $3.02. BD\'s portfolio diversification is working — BioPharma Systems GLP-1, PureWick growth, Excellence Unleashed savings, interest reduction, and declining amortization more than offset China VoBP and Alaris headwinds. The YoY EPS growth despite significant headwinds demonstrates BD\'s underlying earnings power.',
    recommendations: [
      'Frame Q1 FY25 YoY EPS growth as evidence of portfolio resilience; +6.3% EPS growth despite China VoBP (-$0.22/share) and Alaris (-$0.10/share) headwinds demonstrates that BD\'s growing segments and cost savings are more than offsetting known challenges',
    ],
  },

  {
    quarter: 'Q1 FY25', metricName: 'Organic Revenue Growth (FXN)', varianceType: 'actual_vs_plan',
    totalVariance: -60, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP Worse Than Plan', impact: -80, impactUnit: 'bps', explanation: 'China VoBP FXN impact -8.5% vs -7.0% plan; China ~6% of BD revenue; incremental VoBP miss = approximately -0.09% on total BD organic growth', confidence: 0.86 },
      { driver: 'Alaris Volume Below Plan', impact: -40, impactUnit: 'bps', explanation: 'BD Alaris FXN growth below plan due to consent decree volume constraints; Connected Care segment organic growth below FY25 plan assumption', confidence: 0.84 },
      { driver: 'BioPharma Systems Above Plan', impact: +35, impactUnit: 'bps', explanation: 'Pharmaceutical Systems GLP-1 syringe demand +8.5% FXN vs +7.0% plan; above-plan organic growth in highest-margin segment partially offsetting China and Alaris', confidence: 0.88 },
      { driver: 'PureWick & Interventional Above Plan', impact: +25, impactUnit: 'bps', explanation: 'PureWick +22% FXN YoY above plan; Interventional vascular market share gains ahead of plan; two growth products offsetting a portion of China/Alaris drag', confidence: 0.86 },
    ],
    narrative: 'Q1 FY25 organic FXN growth of +3.2% missed the +3.8% plan by 60bps. China VoBP deeper-than-expected pricing and Alaris volume constraints account for the full miss. Excluding China VoBP and Alaris, BD underlying organic growth would have been approximately +5.2% FXN — above plan. The plan variance is entirely attributable to two known, manageable headwinds.',
    recommendations: [
      'Provide ex-China and ex-Alaris organic growth reporting as a supplemental metric; the ~+5.2% underlying BD organic FXN growth story is being masked by China VoBP and Alaris — transparency builds investor confidence in the business trajectory',
    ],
  },
  {
    quarter: 'Q1 FY25', metricName: 'Organic Revenue Growth (FXN)', varianceType: 'actual_vs_prior_year',
    totalVariance: -50, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP YoY Incremental Headwind', impact: -120, impactUnit: 'bps', explanation: 'China VoBP Round 8 creating incremental headwind vs Q1 FY24 (which was largely pre-Round 8); cumulative price decline ~10-15% on covered products vs prior year organic baseline', confidence: 0.88 },
      { driver: 'Alaris YoY Volume Decline', impact: -60, impactUnit: 'bps', explanation: 'Alaris Q1 FY25 organic FXN below Q1 FY24; consent decree restrictions moderating total BD connected care growth vs prior year', confidence: 0.86 },
      { driver: 'BioPharma Systems GLP-1 Acceleration', impact: +80, impactUnit: 'bps', explanation: 'Pharmaceutical Systems organic FXN growth +8.5% vs +5.2% Q1 FY24; GLP-1 manufacturing ramp driving significant acceleration; multi-year tailwind becoming visible in BD organic growth rate', confidence: 0.90 },
      { driver: 'PureWick & Medical Essentials Growth', impact: +50, impactUnit: 'bps', explanation: 'PureWick organic growth above Q1 FY24 pace; Medical Essentials stable organic growth above prior year on branded consumable penetration gains', confidence: 0.86 },
    ],
    narrative: 'Q1 FY25 organic FXN growth of +3.2% was 50bps below Q1 FY24\'s +3.7%. China VoBP escalation (VoBP Round 8) and Alaris constraints are the drivers of deceleration. BioPharma Systems GLP-1 and PureWick acceleration are partially offsetting. The YoY deceleration in organic growth is explained by two identifiable headwinds, not broad-based demand weakness.',
    recommendations: [
      'Communicate the organic growth deceleration story accurately: BD\'s underlying portfolio excluding China VoBP and Alaris is growing +5.2% FXN in Q1 FY25 vs +3.7% Q1 FY24 — actually accelerating; the two headwinds make the headline rate misleading',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Q2 FY25 (Jan-Mar 2025)
  // Revenue $4,680M | Adj. Op Margin 23.8% | Adj. EPS $3.10 | Organic FXN +3.0%
  // Plan: Revenue $4,720M | Margin 24.0% | EPS $3.15 | FXN +3.5%
  // ───────────────────────────────────────────────────────────────────────────

  {
    quarter: 'Q2 FY25', metricName: 'Revenue', varianceType: 'actual_vs_plan',
    totalVariance: -40, totalVarianceUnit: '$M',
    driverBreakdown: [
      { driver: 'China VoBP Ongoing Pressure', impact: -55, impactUnit: '$M', explanation: 'China VoBP Round 8 full-quarter impact with Round 9 announcement adding uncertainty; BD China -9.0% FXN vs -7.5% plan; BD APAC below plan as non-China APAC cannot fully offset China headwind', confidence: 0.86 },
      { driver: 'Connected Care / Alaris Below Plan', impact: -35, impactUnit: '$M', explanation: 'Alaris placements tracking below BD BD FY25 commercial plan despite 70% consent decree remediation; hospital procurement committees requiring 80%+ completion threshold before resuming full Alaris purchases', confidence: 0.84 },
      { driver: 'BioPharma Systems GLP-1 Beat', impact: +58, impactUnit: '$M', explanation: 'Pharmaceutical Systems syringe demand for GLP-1 manufacturing above Q2 plan; Eli Lilly tirzepatide (Zepbound/Mounjaro) volume acceleration and Novo Nordisk semaglutide capacity additions driving above-plan BD syringe orders', confidence: 0.88 },
      { driver: 'FX Headwind', impact: -8, impactUnit: '$M', explanation: 'EUR/USD slightly below plan FX assumption; EMEA reported revenue modestly below plan despite FXN in-line; minor absolute impact', confidence: 0.82 },
    ],
    narrative: 'Q2 FY25 revenue of $4,680M missed plan by $40M. China VoBP headwinds and Alaris constraints remain the primary sources of variance. BioPharma Systems GLP-1 momentum is accelerating and partially offsetting. The pattern is consistent with Q1 FY25 — two specific headwinds masking underlying BD portfolio strength. The GLP-1 beat signals that the BioPharma growth thesis is exceeding initial plan assumptions.',
    recommendations: [
      'Update FY25 BioPharma Systems guidance upward to reflect above-plan GLP-1 syringe demand; quantify the multi-year GLP-1 tailwind runway — pharma manufacturers scaling capacity through FY27+ is a durable secular tailwind',
    ],
  },
  {
    quarter: 'Q2 FY25', metricName: 'Revenue', varianceType: 'actual_vs_prior_year',
    totalVariance: 30, totalVarianceUnit: '$M',
    driverBreakdown: [
      { driver: 'BioPharma Systems Volume Growth', impact: +95, impactUnit: '$M', explanation: 'Pharmaceutical Systems GLP-1 syringe demand +9.0% FXN YoY; BD securing incremental volume from expanded GLP-1 manufacturer supply agreements; above-market organic growth in highest-margin BD segment', confidence: 0.90 },
      { driver: 'Medical Essentials & PureWick Growth', impact: +60, impactUnit: '$M', explanation: 'Medical Essentials +3.0% FXN YoY stable growth; PureWick +25% YoY FXN as home health and LTC channel adoption accelerates; Interventional +3.5% FXN on vascular market share gains', confidence: 0.88 },
      { driver: 'China VoBP YoY Headwind', impact: -90, impactUnit: '$M', explanation: 'Q2 FY25 China VoBP full Round 8 vs Q2 FY24 early Round 7/8 transition; net YoY pricing headwind ~-$90M; BD China revenue -9.0% FXN vs +2.0% FXN Q2 FY24', confidence: 0.86 },
      { driver: 'Alaris YoY Headwind', impact: -35, impactUnit: '$M', explanation: 'Alaris Q2 FY25 volume below Q2 FY24 on consent decree constraints; hospital capital equipment deferrals waiting for 80%+ remediation milestone', confidence: 0.84 },
    ],
    narrative: 'Q2 FY25 revenue grew +$30M or +0.6% YoY ($4,650M to $4,680M). The underlying organic growth story is stronger than this headline suggests — BioPharma Systems GLP-1 and PureWick are growing well above enterprise average, offset by China VoBP and Alaris headwinds. BD is successfully growing earnings despite modest revenue growth through mix improvement and Excellence Unleashed savings.',
    recommendations: [
      'Reinforce the earnings quality story at Q2: modest revenue growth (+0.6% YoY) generating EPS growth (+7.7% YoY) through favorable mix (BioPharma Systems, PureWick) and Excellence Unleashed — demonstrates BD\'s operating model leverage',
    ],
  },

  {
    quarter: 'Q2 FY25', metricName: 'Adjusted Operating Margin', varianceType: 'actual_vs_plan',
    totalVariance: -20, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'Revenue Volume Miss Deleverage', impact: -30, impactUnit: 'bps', explanation: '-$40M revenue vs plan creates negative operating leverage on BD semi-fixed cost base; primarily from China VoBP and Alaris; minor absolute impact on enterprise margin', confidence: 0.86 },
      { driver: 'Excellence Unleashed Savings Above Plan', impact: +15, impactUnit: 'bps', explanation: 'Excellence Unleashed Phase 1 delivering slightly above plan in Q2; manufacturing efficiency savings and SAE reduction tracking toward FY25 target; $45M cumulative through Q2', confidence: 0.86 },
      { driver: 'BioPharma Mix Favorable', impact: +18, impactUnit: 'bps', explanation: 'Above-plan BioPharma Systems revenue at ~45% segment margin creates positive enterprise mix; Pharmaceutical Systems GLP-1 beat contributing above-average margin', confidence: 0.88 },
      { driver: 'Connected Care Deleverage', impact: -23, impactUnit: 'bps', explanation: 'Alaris below plan volume with fixed cost base in Connected Care creating segment margin pressure; consent decree compliance costs ~$15M/quarter embedded in Connected Care margin', confidence: 0.84 },
    ],
    narrative: 'Q2 FY25 adjusted operating margin of 23.8% missed plan by 20bps. Revenue volume deleverage and Connected Care Alaris headwinds are the drivers. BioPharma Systems favorable mix and Excellence Unleashed savings partially offset. The 20bps miss is modest and improving from the 30bps Q1 miss, suggesting the underlying margin trajectory is heading in the right direction.',
    recommendations: [
      'Highlight that the quarterly margin miss is narrowing (30bps Q1 → 20bps Q2); the trend suggests Excellence Unleashed savings are increasingly offsetting China VoBP and Alaris headwinds; on track for FY25 margin of ~23.8% despite headwinds',
    ],
  },
  {
    quarter: 'Q2 FY25', metricName: 'Adjusted Operating Margin', varianceType: 'actual_vs_prior_year',
    totalVariance: 10, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'Excellence Unleashed Savings YoY', impact: +55, impactUnit: 'bps', explanation: 'Excellence Unleashed delivering meaningful YoY margin improvement; $45M savings Q2 FY25 vs minimal savings Q2 FY24; manufacturing and SAE reduction structural benefit compounding', confidence: 0.88 },
      { driver: 'BioPharma Systems Mix YoY', impact: +30, impactUnit: 'bps', explanation: 'Growing BioPharma Systems share of BD revenue at highest segment margin driving favorable mix vs Q2 FY24 portfolio composition; GLP-1 tailwind is a structural positive', confidence: 0.88 },
      { driver: 'China VoBP Margin Compression YoY', impact: -55, impactUnit: 'bps', explanation: 'China VoBP pricing reducing APAC segment margin and enterprise margin vs Q2 FY24 pre-Round 8 baseline; cumulative pricing pressure creating persistent YoY headwind', confidence: 0.86 },
      { driver: 'Alaris Margin Deleverage YoY', impact: -20, impactUnit: 'bps', explanation: 'Alaris below Q2 FY24 volume creating Connected Care deleverage vs prior year; consent decree compliance costs not present in Q2 FY24 at same level', confidence: 0.84 },
    ],
    narrative: 'Q2 FY25 adjusted operating margin expanded 10bps YoY from 23.7% to 23.8%. Excellence Unleashed savings and BioPharma Systems favorable mix are more than offsetting China VoBP and Alaris headwinds at the margin level. The YoY margin expansion — even modest — signals that BD\'s structural improvement program is working against known headwinds.',
    recommendations: [
      'Frame Q2 FY25 YoY margin expansion as the beginning of BD\'s structural margin improvement; Excellence Unleashed + BioPharma Systems mix are generating +85bps of gross margin tailwind, more than offsetting the -75bps from China VoBP and Alaris',
    ],
  },

  {
    quarter: 'Q2 FY25', metricName: 'Adjusted Diluted EPS', varianceType: 'actual_vs_plan',
    totalVariance: -0.05, totalVarianceUnit: '$/share',
    driverBreakdown: [
      { driver: 'Revenue Miss Flow-Through', impact: -0.05, impactUnit: '$/share', explanation: '-$40M revenue vs plan at blended adjusted operating margin ~24%; after-tax EPS impact approximately -$0.05/share; margin miss on volume deleverage also contributing', confidence: 0.86 },
      { driver: 'BioPharma Mix Beat', impact: +0.04, impactUnit: '$/share', explanation: 'Above-plan BioPharma Systems revenue at higher segment margin generating incremental EPS vs plan', confidence: 0.86 },
      { driver: 'Excellence Unleashed Savings', impact: +0.03, impactUnit: '$/share', explanation: 'Cost savings above plan in Q2; manufacturing and SAE contribution to EPS outperformance', confidence: 0.86 },
      { driver: 'Tax / Other Items', impact: -0.07, impactUnit: '$/share', explanation: 'Effective tax rate 22.2% vs 21.5% plan on geographic income mix; China lower income reduces favorable tax jurisdiction benefit; small negative items net', confidence: 0.84 },
    ],
    narrative: 'Q2 FY25 Adj. EPS of $3.10 missed plan by $0.05 (-1.6%). The minimal EPS miss reflects the combination of revenue shortfall, partially offset by BioPharma Systems mix and Excellence Unleashed savings. Tax rate variance is the incremental driver. H1 FY25 Adj. EPS of $6.12 vs $6.20 plan is essentially in line, demonstrating BD\'s earnings resilience.',
    recommendations: [
      'Confirm FY25 Adj. EPS guidance — H1 tracking to ~$12.30+ annual run-rate suggests FY25 guidance of ~$12.50-12.60 is achievable; communicate the H2 improvement drivers (Excellence Unleashed ramp, BioPharma Systems continued growth, Alaris milestones)',
    ],
  },
  {
    quarter: 'Q2 FY25', metricName: 'Adjusted Diluted EPS', varianceType: 'actual_vs_prior_year',
    totalVariance: 0.24, totalVarianceUnit: '$/share',
    driverBreakdown: [
      { driver: 'Excellence Unleashed Savings YoY', impact: +0.18, impactUnit: '$/share', explanation: '$45M cumulative FY25 savings through Q2 vs minimal Q2 FY24 baseline; manufacturing and SAE savings structurally improving BD earnings power; ~$0.18/share YoY EPS contribution', confidence: 0.88 },
      { driver: 'BioPharma & PureWick Growth', impact: +0.20, impactUnit: '$/share', explanation: 'High-margin segment growth in Pharmaceutical Systems and PureWick; revenue growth at above-average margins generating incremental EPS vs Q2 FY24', confidence: 0.88 },
      { driver: 'Interest and Amortization Reduction', impact: +0.10, impactUnit: '$/share', explanation: 'Debt repayment reducing interest expense YoY; Bard amortization declining on schedule; combined ~$0.10/share structural EPS tailwind', confidence: 0.88 },
      { driver: 'China VoBP YoY EPS Headwind', impact: -0.20, impactUnit: '$/share', explanation: 'China VoBP -$90M revenue YoY; after-tax EPS impact approximately -$0.20/share; partially offset by portfolio growth elsewhere', confidence: 0.86 },
      { driver: 'Alaris YoY EPS Headwind', impact: -0.04, impactUnit: '$/share', explanation: 'Alaris volume below Q2 FY24; consent decree constraints; after-tax EPS impact approximately -$0.04/share', confidence: 0.84 },
    ],
    narrative: 'Q2 FY25 Adj. EPS grew $0.24 or +8.4% YoY from $2.86 to $3.10. Excellence Unleashed, BioPharma Systems and PureWick growth, and structural financial leverage improvement (interest + amortization) together generate $0.48/share of EPS uplift, more than offsetting China VoBP (-$0.20) and Alaris (-$0.04) headwinds. BD is growing EPS well above revenue growth, demonstrating the quality of the BD earnings model.',
    recommendations: [
      'Communicate EPS growth significantly exceeding revenue growth (+8.4% EPS vs +0.6% revenue) as the core BD investment thesis: Excellence Unleashed + favorable segment mix are driving structural margin and earnings expansion that will persist as China VoBP stabilizes and Alaris recovers',
    ],
  },

  {
    quarter: 'Q2 FY25', metricName: 'Organic Revenue Growth (FXN)', varianceType: 'actual_vs_plan',
    totalVariance: -50, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP Below Plan', impact: -70, impactUnit: 'bps', explanation: 'China VoBP FXN -9.0% vs -7.5% plan; 150bps worse than plan in China; China represents ~6% of BD revenue; enterprise impact approximately -0.09%', confidence: 0.86 },
      { driver: 'Alaris Below Plan', impact: -25, impactUnit: 'bps', explanation: 'Connected Care organic FXN below plan on Alaris volume constraints; 70% consent decree completion vs 75% plan milestone for Q2; commercial recovery pace slightly slower than modeled', confidence: 0.84 },
      { driver: 'BioPharma Systems Above Plan', impact: +32, impactUnit: 'bps', explanation: 'Pharmaceutical Systems FXN +9.0% vs +7.0% plan; GLP-1 acceleration above plan; positive contribution to enterprise organic growth vs plan', confidence: 0.88 },
      { driver: 'Americas Organic Growth', impact: +13, impactUnit: 'bps', explanation: 'Americas excluding China organic FXN +4.2% vs +4.0% plan; PureWick and Interventional driving modest above-plan contribution to enterprise organic growth', confidence: 0.84 },
    ],
    narrative: 'Q2 FY25 organic FXN growth of +3.0% missed plan by 50bps. Same pattern as Q1: China VoBP and Alaris accounting for the full miss; BioPharma and Americas partially offsetting. Underlying ex-China ex-Alaris organic growth is approximately +5.5% FXN, well above plan.',
    recommendations: [
      'Update FY25 organic FXN guidance to reflect China VoBP tracking at -9% rather than -7.5% plan; adjust segment organic growth targets to reflect Alaris consent decree commercial re-entry timeline; maintain guidance for ex-China ex-Alaris portfolio performance',
    ],
  },
  {
    quarter: 'Q2 FY25', metricName: 'Organic Revenue Growth (FXN)', varianceType: 'actual_vs_prior_year',
    totalVariance: -70, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP YoY Incremental', impact: -140, impactUnit: 'bps', explanation: 'Q2 FY25 China VoBP full Round 8 vs Q2 FY24 early Round 7-8 transition; net cumulative pricing YoY headwind approximately -140bps on BD enterprise organic FXN rate', confidence: 0.88 },
      { driver: 'Alaris YoY Deceleration', impact: -40, impactUnit: 'bps', explanation: 'Alaris FXN growth below Q2 FY24 pace; BD Connected Care segment organic decelerating vs prior year on consent decree constraints', confidence: 0.86 },
      { driver: 'BioPharma Systems Acceleration YoY', impact: +75, impactUnit: 'bps', explanation: 'Pharmaceutical Systems FXN +9.0% Q2 FY25 vs +5.5% Q2 FY24; GLP-1 demand materially accelerating vs prior year; growing share of BD revenue', confidence: 0.90 },
      { driver: 'PureWick & Interventional Acceleration', impact: +35, impactUnit: 'bps', explanation: 'PureWick FXN growth accelerating vs Q2 FY24; Interventional vascular market share gains building; both products contributing above-enterprise-average FXN growth', confidence: 0.86 },
    ],
    narrative: 'Q2 FY25 organic FXN growth decelerated to +3.0% vs +3.5% in Q2 FY24. China VoBP escalation is the primary cause of deceleration. BioPharma Systems and PureWick are accelerating YoY, demonstrating the portfolio\'s inherent growth momentum. The headline organic growth rate is structurally impaired by China VoBP; resolving or stabilizing this headwind would reveal the underlying +5%+ portfolio growth trajectory.',
    recommendations: [
      'Provide multi-year organic growth framework showing FY26-FY27 trajectory as China VoBP stabilizes (headwind diminishing) and Alaris re-enters the market (recovery contributing); the ~+5% ex-headwind organic growth rate should materialize as headline organic FXN as these issues resolve',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Q3 FY25 (Apr-Jun 2025)
  // Revenue $4,740M | Adj. Op Margin 24.0% | Adj. EPS $3.18 | Organic FXN +2.8%
  // Plan: Revenue $4,760M | Margin 24.3% | EPS $3.22 | FXN +3.2%
  // ───────────────────────────────────────────────────────────────────────────

  {
    quarter: 'Q3 FY25', metricName: 'Revenue', varianceType: 'actual_vs_plan',
    totalVariance: -20, totalVarianceUnit: '$M',
    driverBreakdown: [
      { driver: 'China VoBP Round 9 Announced', impact: -45, impactUnit: '$M', explanation: 'China VoBP Round 9 announcement in Q3 created customer purchasing deferrals in anticipation of new pricing; BD China -9.0% FXN; some Chinese hospital customers delaying orders pending new VoBP price list', confidence: 0.86 },
      { driver: 'BioPharma Systems GLP-1 Above Plan', impact: +65, impactUnit: '$M', explanation: 'Pharmaceutical Systems syringe demand continuing above plan; GLP-1 manufacturer expansions ongoing; BD securing incremental long-term supply agreements; fastest-growing BD segment', confidence: 0.90 },
      { driver: 'Alaris Q3 Recovery Below Plan', impact: -25, impactUnit: '$M', explanation: 'Alaris commercial recovery pacing at 74% consent decree completion; hospitals continuing to defer full Alaris programs; Q3 Alaris below plan by ~$25M; BD management guiding for acceleration in Q4 FY25', confidence: 0.84 },
      { driver: 'Waters Spin-Off Preparation Revenue Impact', impact: -15, impactUnit: '$M', explanation: 'Waters spin-off separation activities creating minor customer ordering disruption; some Waters-adjacent BD products temporarily in customer uncertainty on supply continuity; minimal but measurable', confidence: 0.80 },
    ],
    narrative: 'Q3 FY25 revenue of $4,740M was essentially in line with plan, missing by $20M (-0.4%). BioPharma Systems GLP-1 acceleration is offsetting China VoBP and Alaris headwinds more effectively in Q3. The pattern is improving — plan variance narrowing from -$45M Q1 to -$40M Q2 to -$20M Q3 — demonstrating that BD\'s strategic portfolio is gaining momentum.',
    recommendations: [
      'Highlight the improving trend in plan variance (Q1 -$45M → Q2 -$40M → Q3 -$20M); the narrowing gap reflects BioPharma Systems GLP-1 and PureWick growth increasingly offsetting China VoBP and Alaris; H1 FY26 should see first plan beats as headwinds stabilize',
    ],
  },
  {
    quarter: 'Q3 FY25', metricName: 'Revenue', varianceType: 'actual_vs_prior_year',
    totalVariance: 20, totalVarianceUnit: '$M',
    driverBreakdown: [
      { driver: 'BioPharma Systems GLP-1 Growth', impact: +100, impactUnit: '$M', explanation: 'Pharmaceutical Systems FXN +10.0% YoY; GLP-1 demand above Q3 FY24 as pharma manufacturers scale to meet obesity treatment demand; BD supply agreements driving multi-year volume commits', confidence: 0.90 },
      { driver: 'Medical Essentials & PureWick', impact: +55, impactUnit: '$M', explanation: 'Medical Essentials +3.2% FXN YoY; PureWick +26% YoY; Interventional +4.0% FXN on vascular market share; three segments growing above BD enterprise average', confidence: 0.88 },
      { driver: 'China VoBP YoY Headwind', impact: -95, impactUnit: '$M', explanation: 'Q3 FY25 China VoBP Round 8 + Round 9 preparation vs Q3 FY24 lower VoBP impact; cumulative pricing headwind ~-$95M YoY; BD China -9.0% FXN vs +3.0% FXN Q3 FY24', confidence: 0.86 },
      { driver: 'FX Translation Benefit', impact: -40, impactUnit: '$M', explanation: 'FX translation on net basis; EUR strengthening slightly favorable but JPY and EM currencies net negative; FXN growth +2.8% vs reported +0.4%', confidence: 0.82 },
    ],
    narrative: 'Q3 FY25 revenue grew +$20M or +0.4% YoY. The underlying FXN organic story (+2.8%) is dampened by China VoBP headwinds and FX. BioPharma Systems and PureWick remain the portfolio growth engines. Q3 FY25 continues the pattern of modest reported growth masking a stronger underlying BD business when China VoBP and currency effects are excluded.',
    recommendations: [
      'Waters spin-off (Feb 2026) will simplify BD\'s portfolio reporting; post-Waters organic growth will benefit from removal of lower-growth Water segments and allow BioPharma Systems, PureWick, and BD core to shine through in headline organic growth rates',
    ],
  },

  {
    quarter: 'Q3 FY25', metricName: 'Adjusted Operating Margin', varianceType: 'actual_vs_plan',
    totalVariance: -30, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'Revenue Mix Below Plan', impact: -18, impactUnit: 'bps', explanation: 'Modest revenue miss creates minor deleverage; lower-than-plan Alaris volume in Connected Care segment is highest fixed cost headwind', confidence: 0.84 },
      { driver: 'Excellence Unleashed Below Plan', impact: -20, impactUnit: 'bps', explanation: 'Excellence Unleashed Q3 savings slightly below plan as Waters spin-off preparation activities absorb some management bandwidth and create one-time costs (~$30M advisory fees in Q3); core savings on track', confidence: 0.84 },
      { driver: 'BioPharma Systems Mix Favorable', impact: +22, impactUnit: 'bps', explanation: 'Above-plan BioPharma Systems revenue at highest segment margins partially offsetting overall margin miss; GLP-1 syringe volume favorable mix contribution', confidence: 0.88 },
      { driver: 'China Margin Compression', impact: -14, impactUnit: 'bps', explanation: 'China VoBP pricing reducing APAC segment contribution; APAC margin below plan on lower China ASP; APAC fixed costs partially reducing BD operating margin', confidence: 0.84 },
    ],
    narrative: 'Q3 FY25 adjusted operating margin of 24.0% missed the 24.3% plan by 30bps. Waters spin-off preparation costs absorbed some Excellence Unleashed savings, and China VoBP continues to compress APAC margins. BioPharma Systems favorable mix provides meaningful offset. The Waters spin-off (completed Feb 2026) will eliminate these transaction costs and stranded cost burden in FY26.',
    recommendations: [
      'Separate one-time Waters transaction costs (~$30M Q3) from recurring cost performance; excluding Waters preparation costs, Q3 adjusted operating margin would have been ~24.2% — only 10bps below plan and reflecting improving underlying cost performance',
    ],
  },
  {
    quarter: 'Q3 FY25', metricName: 'Adjusted Operating Margin', varianceType: 'actual_vs_prior_year',
    totalVariance: 20, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'Excellence Unleashed Savings YoY', impact: +65, impactUnit: 'bps', explanation: 'Excellence Unleashed delivering growing YoY margin benefit; $80M cumulative FY25 savings through Q3 vs minimal Q3 FY24 baseline; structural cost improvement increasingly visible', confidence: 0.88 },
      { driver: 'BioPharma Systems Mix YoY', impact: +35, impactUnit: 'bps', explanation: 'Growing BioPharma Systems share of BD revenue driving favorable mix; segment growing faster than enterprise at highest margins; structural mix tailwind building', confidence: 0.88 },
      { driver: 'China VoBP Margin Compression YoY', impact: -55, impactUnit: 'bps', explanation: 'Cumulative China VoBP rounds creating growing YoY margin headwind; APAC segment margin declining; enterprise margin impact accumulating with each VoBP round', confidence: 0.86 },
      { driver: 'Waters Costs vs Q3 FY24 Clean Baseline', impact: -25, impactUnit: 'bps', explanation: 'Q3 FY25 includes ~$30M Waters preparation costs; Q3 FY24 had no comparable transaction costs; YoY comparison penalizes Q3 FY25 by ~25bps for one-time item', confidence: 0.84 },
    ],
    narrative: 'Q3 FY25 adjusted operating margin expanded 20bps YoY from 23.8% to 24.0%. Excellence Unleashed and BioPharma Systems mix are driving structural margin improvement. China VoBP and Waters one-time costs are headwinds. Excluding Waters transaction costs, YoY margin expansion would have been ~45bps — demonstrating strong underlying progress toward BD\'s >25% adjusted operating margin target.',
    recommendations: [
      'Communicate FY26 adjusted operating margin guidance in context of: (1) Waters stranded cost elimination adding ~40bps, (2) Excellence Unleashed ramp adding ~50bps, (3) BioPharma Systems mix adding ~30bps; the path to >25% adjusted operating margin is increasingly quantifiable',
    ],
  },

  {
    quarter: 'Q3 FY25', metricName: 'Adjusted Diluted EPS', varianceType: 'actual_vs_plan',
    totalVariance: -0.04, totalVarianceUnit: '$/share',
    driverBreakdown: [
      { driver: 'Revenue and Margin Miss', impact: -0.06, impactUnit: '$/share', explanation: 'Combined -$20M revenue miss and -30bps margin miss flowing through to adjusted EPS; after-tax impact approximately -$0.06/share', confidence: 0.86 },
      { driver: 'BioPharma Mix Offset', impact: +0.04, impactUnit: '$/share', explanation: 'Above-plan BioPharma Systems volume at higher margins offsetting the revenue mix headwind; GLP-1 syringe demand flow-through to adjusted EPS', confidence: 0.86 },
      { driver: 'Interest and Amortization In-Line', impact: 0.00, impactUnit: '$/share', explanation: 'Interest expense and Bard amortization tracking to plan in Q3; no material variance from financial cost lines', confidence: 0.90 },
      { driver: 'Tax/Other Slight Adverse', impact: -0.02, impactUnit: '$/share', explanation: 'Effective tax rate slightly above plan; geographic income mix shift from China lower income; minor discrete tax items', confidence: 0.84 },
    ],
    narrative: 'Q3 FY25 Adj. EPS of $3.18 missed plan by $0.04 (-1.2%) — the narrowest quarterly plan miss of FY25. The improving trend in EPS plan variance (Q1 -$0.03, Q2 -$0.05, Q3 -$0.04) is consistent with BioPharma Systems and Excellence Unleashed increasingly offsetting China VoBP and Alaris headwinds. BD is tracking well toward FY25 Adj. EPS guidance.',
    recommendations: [
      'Confirm FY25 Adj. EPS guidance range; three-quarter performance of $9.30 cumulative implies Q4 FY25 of ~$3.20-$3.35 needed to reach FY25 guidance; Q4 is BD\'s seasonally strongest quarter — guidance confirmation is appropriate',
    ],
  },
  {
    quarter: 'Q3 FY25', metricName: 'Adjusted Diluted EPS', varianceType: 'actual_vs_prior_year',
    totalVariance: 0.28, totalVarianceUnit: '$/share',
    driverBreakdown: [
      { driver: 'Excellence Unleashed Cumulative Savings', impact: +0.22, impactUnit: '$/share', explanation: '$80M cumulative FY25 savings through Q3 vs minimal Q3 FY24 baseline; structural manufacturing and SAE improvements generating growing EPS tailwind; ~$0.22/share YoY EPS contribution', confidence: 0.88 },
      { driver: 'BioPharma Systems & PureWick EPS Growth', impact: +0.25, impactUnit: '$/share', explanation: 'High-margin segment growth in Pharmaceutical Systems GLP-1 and PureWick driving significant incremental EPS vs Q3 FY24; fastest-growing, highest-margin products compounding EPS', confidence: 0.88 },
      { driver: 'Interest and Amortization Reduction', impact: +0.12, impactUnit: '$/share', explanation: 'Cumulative debt repayment reducing interest expense; Bard amortization declining on schedule; combined structural EPS tailwind growing as deleveraging progresses', confidence: 0.88 },
      { driver: 'China VoBP YoY EPS Headwind', impact: -0.28, impactUnit: '$/share', explanation: 'China VoBP -$95M revenue YoY; largest quarterly YoY revenue headwind; after-tax EPS impact approximately -$0.28/share; offset by portfolio strength elsewhere', confidence: 0.86 },
      { driver: 'Waters Transaction Costs YoY', impact: -0.03, impactUnit: '$/share', explanation: '~$30M Waters preparation costs in Q3 FY25 vs no comparable Q3 FY24 costs; one-time after-tax EPS impact -$0.03/share', confidence: 0.84 },
    ],
    narrative: 'Q3 FY25 Adj. EPS grew +$0.28 or +9.7% YoY from $2.90 to $3.18 — the strongest YoY EPS growth of FY25. Excellence Unleashed savings, BioPharma Systems GLP-1, and structural financial improvements together generate $0.59/share of EPS uplift, decisively more than the China VoBP and Waters headwinds. BD\'s earnings growth is accelerating despite revenue growth remaining modest.',
    recommendations: [
      'Q3 FY25 +9.7% YoY EPS growth is a standout performance metric for investor communications; the combination of Excellence Unleashed, GLP-1 tailwind, and financial leverage reduction is generating a compounding EPS growth machine that should persist into FY26 and FY27',
    ],
  },

  {
    quarter: 'Q3 FY25', metricName: 'Organic Revenue Growth (FXN)', varianceType: 'actual_vs_plan',
    totalVariance: -40, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP Deeper Than Plan', impact: -65, impactUnit: 'bps', explanation: 'China FXN -9.0% vs -7.5% plan; Round 9 announcement creating purchase deferrals; incremental VoBP miss contributing -0.09% to enterprise organic miss vs plan', confidence: 0.86 },
      { driver: 'BioPharma Systems Above Plan', impact: +40, impactUnit: 'bps', explanation: 'Pharmaceutical Systems FXN +10.0% vs +8.0% plan; GLP-1 above-plan contributing +0.04% to enterprise organic rate above plan; partially offsetting China VoBP miss', confidence: 0.88 },
      { driver: 'Alaris Still Below Plan', impact: -15, impactUnit: 'bps', explanation: 'Alaris volume recovery pacing below plan; consent decree 74% complete vs 78% plan target; minor enterprise organic growth impact', confidence: 0.84 },
    ],
    narrative: 'Q3 FY25 organic FXN growth of +2.8% missed plan by 40bps — again driven by China VoBP exceeding plan assumptions. Excluding China VoBP and Alaris, BD underlying organic FXN is approximately +5.5%+ — a strong performance. The plan miss has been consistent at 40-60bps for three consecutive quarters, all attributable to China VoBP deeper than modeled at plan time.',
    recommendations: [
      'Update FY25 organic FXN growth guidance to ~3.0% reflecting China VoBP tracking at -9%+ rather than original plan assumption; reaffirm that ex-China ex-Alaris organic growth remains at ~+5.5% demonstrating portfolio health',
    ],
  },
  {
    quarter: 'Q3 FY25', metricName: 'Organic Revenue Growth (FXN)', varianceType: 'actual_vs_prior_year',
    totalVariance: -100, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP YoY Escalation', impact: -160, impactUnit: 'bps', explanation: 'Q3 FY25 China VoBP cumulative rounds vs Q3 FY24 early-round impact; incremental YoY headwind from Round 8 + Round 9 announcement; approximately -160bps on BD enterprise organic rate', confidence: 0.88 },
      { driver: 'BioPharma Systems Acceleration', impact: +90, impactUnit: 'bps', explanation: 'Pharmaceutical Systems GLP-1 syringe demand FXN growth materially above Q3 FY24 pace; BD securing above-plan pharma customer volume; multi-year tailwind compounding', confidence: 0.90 },
      { driver: 'PureWick & Interventional Acceleration', impact: +40, impactUnit: 'bps', explanation: 'PureWick and Interventional growing faster in Q3 FY25 vs Q3 FY24; outpacing enterprise average growth; positive contribution to enterprise organic FXN rate', confidence: 0.86 },
      { driver: 'Connected Care / Alaris Deceleration', impact: -70, impactUnit: 'bps', explanation: 'Alaris FXN declining vs prior year on consent decree constraints; Q3 FY24 had residual above-plan Alaris placements before consent decree limitations tightened', confidence: 0.84 },
    ],
    narrative: 'Q3 FY25 organic FXN growth of +2.8% was 100bps below Q3 FY24\'s +3.8%. China VoBP escalation and Alaris deceleration account for the full YoY deceleration. BioPharma Systems GLP-1 and PureWick are actually accelerating vs prior year. The headline organic growth deceleration is structurally driven by two specific headwinds that are both in resolution phase: China VoBP stabilizing and Alaris remediation progressing.',
    recommendations: [
      'Frame Q3 FY25 as the likely trough of BD organic FXN growth; Q4 FY25 and FY26 should show organic FXN recovery as China VoBP comparisons become easier and Alaris consent decree approaches completion; provide FY26 organic FXN guidance of 3-4%+ as recovery thesis',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Q4 FY25 (Jul-Sep 2025)
  // Revenue $4,820M | Adj. Op Margin 24.5% | Adj. EPS $3.35 | Organic FXN +3.5%
  // Plan: Revenue $4,850M | Margin 24.8% | EPS $3.38 | FXN +4.0%
  // ───────────────────────────────────────────────────────────────────────────

  {
    quarter: 'Q4 FY25', metricName: 'Revenue', varianceType: 'actual_vs_plan',
    totalVariance: -30, totalVarianceUnit: '$M',
    driverBreakdown: [
      { driver: 'China VoBP Round 9 Full Impact', impact: -55, impactUnit: '$M', explanation: 'China VoBP Round 9 fully implemented in Q4 FY25; BD China -9.5% FXN vs -8.0% plan; additional product categories in scope including some Interventional products; BD China revenue under continued pressure', confidence: 0.86 },
      { driver: 'BioPharma Systems Continuing Beat', impact: +60, impactUnit: '$M', explanation: 'Pharmaceutical Systems GLP-1 syringe demand +12% FXN vs +9% plan; Q4 FY25 pharma customer order volume above plan as GLP-1 manufacturers increase manufacturing capacity through year-end', confidence: 0.90 },
      { driver: 'Alaris Q4 Recovery Partial', impact: -20, impactUnit: '$M', explanation: 'Alaris 76% consent decree remediation by Q4 FY25; commercial recovery progressing but below optimistic plan; hospital accounts approving Alaris purchases but ramp timing delayed into Q1 FY26', confidence: 0.84 },
      { driver: 'Americas Q4 Seasonal Strength Above Plan', impact: +15, impactUnit: '$M', explanation: 'Q4 is BD\'s strongest seasonal quarter (fiscal year-end hospital capital spending); Americas hospital capital equipment orders above plan in Q4; Interventional devices and BD Pyxis above plan', confidence: 0.86 },
      { driver: 'FX Slight Tailwind', impact: -30, impactUnit: '$M', explanation: 'EUR slightly favorable vs plan in Q4; JPY persistent headwind; net FX modest adverse impact on reported revenue vs plan', confidence: 0.82 },
    ],
    narrative: 'Q4 FY25 revenue of $4,820M missed plan by $30M — the narrowest quarterly plan miss of FY25. BioPharma Systems GLP-1 beat and Americas Q4 seasonal strength offset China VoBP and remaining Alaris constraints. FY25 full-year revenue of ~$18,895M is approximately in line with guidance, demonstrating BD\'s ability to manage through specific headwinds while maintaining enterprise performance.',
    recommendations: [
      'Q4 FY25 represents the best BD quarterly performance vs plan for FY25; confirm full-year FY25 results in line with guidance and provide FY26 guidance that incorporates Waters spin-off (Feb 2026), Excellence Unleashed ramp, and continued BioPharma GLP-1 momentum',
    ],
  },
  {
    quarter: 'Q4 FY25', metricName: 'Revenue', varianceType: 'actual_vs_prior_year',
    totalVariance: -100, totalVarianceUnit: '$M',
    driverBreakdown: [
      { driver: 'China VoBP YoY Peak Pressure', impact: -100, impactUnit: '$M', explanation: 'Q4 FY25 China VoBP Round 9 full impact vs Q4 FY24 (pre-Round 9); cumulative YoY headwind from multiple rounds; China -9.5% FXN vs +4.0% FXN Q4 FY24; most adverse YoY China comparison of FY25', confidence: 0.88 },
      { driver: 'Alaris YoY Shortfall', impact: -50, impactUnit: '$M', explanation: 'Alaris Q4 FY25 volume below Q4 FY24 which had a stronger Alaris pipeline; consent decree commercial re-entry slower than prior-year pace; Q4 FY24 had some pre-constraint Alaris placements', confidence: 0.84 },
      { driver: 'BioPharma Systems Growth', impact: +115, impactUnit: '$M', explanation: 'Pharmaceutical Systems GLP-1 demand +12% FXN YoY; strongest quarterly GLP-1 beat of FY25; BD securing above-plan pharma supply contracts through FY27; highest-growth BD segment significantly above Q4 FY24', confidence: 0.90 },
      { driver: 'PureWick & Medical Essentials Growth', impact: +55, impactUnit: '$M', explanation: 'PureWick +28% FXN YoY; Medical Essentials +3.5% FXN; Interventional +4.5% FXN; three segments growing above enterprise average and offsetting China/Alaris headwinds', confidence: 0.88 },
      { driver: 'Waters Revenue Excluded from Comparison', impact: -120, impactUnit: '$M', explanation: 'Q4 FY25 BD continuing operations revenue excludes some Waters pre-spin revenue; YoY comparison becomes cleaner as Waters separation progresses; slight technical headwind on reported comparison', confidence: 0.80 },
    ],
    narrative: 'Q4 FY25 revenue declined -$100M or -2.0% YoY from $4,920M to $4,820M. China VoBP peak pressure (Round 9 full impact) and Alaris YoY headwinds are the drivers. BioPharma Systems GLP-1 and PureWick are growing strongly but cannot fully offset the China headwind in Q4. Q4 FY25 is the trough of BD\'s YoY revenue comparison; FY26 should show YoY revenue recovery as China VoBP comparisons ease and Alaris returns to growth.',
    recommendations: [
      'Frame Q4 FY25 as the revenue comparison trough; FY26 Q4 (Jul-Sep 2026) will compare against this weak Q4 FY25 baseline — favorable comps plus Alaris recovery + BioPharma GLP-1 continuation should produce strong YoY revenue growth in Q4 FY26',
    ],
  },

  {
    quarter: 'Q4 FY25', metricName: 'Adjusted Operating Margin', varianceType: 'actual_vs_plan',
    totalVariance: -30, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'Revenue Miss Deleverage', impact: -20, impactUnit: 'bps', explanation: '-$30M revenue vs plan creates minor deleverage on BD semi-fixed cost structure; minor impact given modest revenue miss magnitude', confidence: 0.84 },
      { driver: 'Excellence Unleashed Below Plan', impact: -22, impactUnit: 'bps', explanation: 'Excellence Unleashed full-year FY25 savings of $120M vs $140M plan; Q4 FY25 savings slightly below plan as Waters preparation activities and restructuring timing created one-time headwinds', confidence: 0.84 },
      { driver: 'BioPharma Favorable Mix', impact: +28, impactUnit: 'bps', explanation: 'Q4 BioPharma Systems strongest quarter for GLP-1 syringe demand; above-plan volume at highest segment margin driving favorable enterprise mix; most significant mix benefit of FY25', confidence: 0.90 },
      { driver: 'Q4 Volume Leverage Partially Favorable', impact: +10, impactUnit: 'bps', explanation: 'Q4 is BD\'s highest-volume quarter; operating leverage on fixed manufacturing and SAE costs partially offsetting other headwinds; seasonal benefit', confidence: 0.84 },
      { driver: 'China VoBP Impact', impact: -26, impactUnit: 'bps', explanation: 'China VoBP Round 9 reducing APAC segment contribution; APAC margin below plan on lower ASP; enterprise margin impact approximately -26bps', confidence: 0.84 },
    ],
    narrative: 'Q4 FY25 adjusted operating margin of 24.5% missed plan by 30bps. Excellence Unleashed tracking slightly below $140M plan ($120M actual) and China VoBP are the drivers. BioPharma mix and seasonal volume leverage provide offset. FY25 full-year adjusted operating margin is approximately in line with guidance, demonstrating BD\'s ability to maintain near-plan profitability despite external headwinds.',
    recommendations: [
      'Provide FY26 adjusted operating margin guidance of 24.5-25% reflecting: Q1 FY26 Waters stranded costs absorbing some savings, then improvement in H2 FY26 as stranded costs eliminated and Excellence Unleashed hits $150M+ milestone; full >25% target achievable FY27',
    ],
  },
  {
    quarter: 'Q4 FY25', metricName: 'Adjusted Operating Margin', varianceType: 'actual_vs_prior_year',
    totalVariance: 50, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'Excellence Unleashed YoY Savings', impact: +95, impactUnit: 'bps', explanation: '$120M FY25 savings, heavily weighted toward H2; Q4 FY25 quarterly savings most impactful quarter; structural manufacturing and SAE improvement generating significant YoY margin benefit', confidence: 0.88 },
      { driver: 'BioPharma Systems Mix YoY', impact: +50, impactUnit: 'bps', explanation: 'BioPharma Systems growing share of revenue at highest margins creates favorable enterprise mix vs Q4 FY24; GLP-1 tailwind most visible in Q4 on strongest volume quarter', confidence: 0.90 },
      { driver: 'China VoBP YoY Headwind', impact: -65, impactUnit: 'bps', explanation: 'Cumulative China VoBP rounds creating peak YoY margin headwind in Q4 FY25 vs Q4 FY24; China revenue and margin contribution significantly below Q4 FY24 level', confidence: 0.86 },
      { driver: 'Q4 Operating Leverage Favorable YoY', impact: +20, impactUnit: 'bps', explanation: 'Q4 revenue above prior year on BioPharma and PureWick growth; operating leverage on fixed costs more favorable vs Q4 FY24 despite lower absolute revenue on China VoBP', confidence: 0.84 },
      { driver: 'Waters Costs YoY', impact: -50, impactUnit: 'bps', explanation: 'Q4 FY25 Waters transaction and preparation costs ($40M) vs minimal Q4 FY24 comparable costs; one-time YoY margin compression that resolves at Waters spin close Feb 9 2026', confidence: 0.84 },
    ],
    narrative: 'Q4 FY25 adjusted operating margin expanded 50bps YoY from 24.0% to 24.5% — the strongest quarterly YoY margin improvement of FY25. Excellence Unleashed and BioPharma Systems mix are delivering structural margin uplift. China VoBP and Waters transaction costs are headwinds. Excluding Waters one-time costs, Q4 FY25 margin expansion would have been ~100bps YoY — demonstrating the underlying margin trajectory as BD approaches FY26.',
    recommendations: [
      'Frame Q4 FY25 as the beginning of sustained margin expansion: Excellence Unleashed delivering, BioPharma Systems growing, Alaris approaching resolution; FY26 should show full-year YoY margin expansion as all drivers compound',
    ],
  },

  {
    quarter: 'Q4 FY25', metricName: 'Adjusted Diluted EPS', varianceType: 'actual_vs_plan',
    totalVariance: -0.03, totalVarianceUnit: '$/share',
    driverBreakdown: [
      { driver: 'Revenue and Margin Miss Flow-Through', impact: -0.06, impactUnit: '$/share', explanation: 'Combined -$30M revenue miss and -30bps margin miss; after-tax EPS impact approximately -$0.06/share; China VoBP and Excellence Unleashed timing primary causes', confidence: 0.86 },
      { driver: 'BioPharma Beat Flow-Through', impact: +0.06, impactUnit: '$/share', explanation: 'Above-plan BioPharma Systems GLP-1 revenue at highest segment margins generating $0.06/share incremental EPS vs plan; offsetting aggregate revenue/margin miss', confidence: 0.88 },
      { driver: 'Interest and Amortization Favorable', impact: +0.02, impactUnit: '$/share', explanation: 'Debt repayment and amortization schedule decline generating modest EPS beat vs plan in Q4; structural financial improvements in-line or slightly better', confidence: 0.86 },
      { driver: 'Tax Rate Adverse', impact: -0.05, impactUnit: '$/share', explanation: 'Q4 effective tax rate above plan on geographic income mix; China lower income reducing favorable tax regime contribution; also year-end tax true-up items', confidence: 0.84 },
    ],
    narrative: 'Q4 FY25 Adj. EPS of $3.35 missed plan by $0.03 (-0.9%) — the narrowest quarterly plan miss and the strongest EPS quarter of FY25. BioPharma Systems beat and favorable financial items largely offset the revenue/margin miss. FY25 full-year Adj. EPS of approximately $12.65 is tracking to guidance, with BD demonstrating consistent earnings delivery despite significant China VoBP and Alaris headwinds throughout the year.',
    recommendations: [
      'FY25 Adj. EPS of ~$12.65 essentially at guidance demonstrates BD\'s earnings resilience; use Q4 FY25 release to provide FY26 guidance of $12.52-$12.72 (consistent with prior indication) as BD enters the Waters spin-off, Excellence Unleashed ramp, and Alaris recovery convergence period',
    ],
  },
  {
    quarter: 'Q4 FY25', metricName: 'Adjusted Diluted EPS', varianceType: 'actual_vs_prior_year',
    totalVariance: 0.35, totalVarianceUnit: '$/share',
    driverBreakdown: [
      { driver: 'Excellence Unleashed Cumulative Impact', impact: +0.35, impactUnit: '$/share', explanation: '$120M FY25 annual savings heavily weighted toward H2 and Q4; Q4 FY25 quarterly savings contribution most significant quarter; structural cost improvement compounding through FY25 year-end', confidence: 0.88 },
      { driver: 'BioPharma Systems & PureWick Growth', impact: +0.35, impactUnit: '$/share', explanation: 'GLP-1 syringe demand and PureWick at peak YoY growth rates in Q4; combined incremental EPS vs Q4 FY24 approximately +$0.35/share from high-margin growth segments', confidence: 0.90 },
      { driver: 'Interest and Amortization', impact: +0.14, impactUnit: '$/share', explanation: 'FY25 full cumulative debt repayment (~$1.5B) and Bard amortization declining; Q4 benefit most visible as full-year savings realized; structural EPS tailwind growing', confidence: 0.88 },
      { driver: 'China VoBP YoY Peak Headwind', impact: -0.38, impactUnit: '$/share', explanation: 'China VoBP Round 9 creates peak YoY revenue headwind in Q4 FY25; -$100M BD China YoY revenue impact in Q4; largest single-quarter China EPS headwind in coverage period', confidence: 0.86 },
      { driver: 'Waters Transaction Costs YoY', impact: -0.11, impactUnit: '$/share', explanation: '~$40M Waters Q4 preparation costs vs zero Q4 FY24; after-tax EPS impact approximately -$0.11/share; one-time charge that completes at Waters spin close Feb 9 2026', confidence: 0.84 },
    ],
    narrative: 'Q4 FY25 Adj. EPS grew $0.35 or +11.7% YoY from $3.00 to $3.35 — the strongest quarterly YoY EPS growth of FY25. Excellence Unleashed, BioPharma GLP-1 demand, and structural financial improvements generate $0.84/share of EPS uplift, more than offsetting China VoBP (-$0.38) and Waters costs (-$0.11). The Q4 FY25 result confirms BD\'s multi-year EPS growth trajectory driven by structural drivers that will continue to compound through FY26 and FY27.',
    recommendations: [
      'Q4 FY25 +11.7% YoY EPS growth is the culmination of BD\'s FY25 execution: Excellence Unleashed, BioPharma GLP-1, and financial deleveraging are all working; communicate the FY26 incremental catalysts — Waters stranded cost elimination + Alaris recovery + China VoBP stabilization adding to the existing structural EPS drivers',
    ],
  },

  {
    quarter: 'Q4 FY25', metricName: 'Organic Revenue Growth (FXN)', varianceType: 'actual_vs_plan',
    totalVariance: -50, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP Round 9 Deeper Than Plan', impact: -75, impactUnit: 'bps', explanation: 'China VoBP Round 9 FXN -9.5% vs -8.0% plan; BD China Q4 organic FXN substantially below plan; enterprise impact approximately -0.09% on total organic FXN', confidence: 0.86 },
      { driver: 'BioPharma Systems Beat', impact: +45, impactUnit: 'bps', explanation: 'Pharmaceutical Systems FXN +12% vs +9% plan; above-plan GLP-1 syringe demand in Q4; approximately +0.045% contribution to enterprise organic FXN above plan', confidence: 0.90 },
      { driver: 'Alaris Still Below Plan', impact: -20, impactUnit: 'bps', explanation: 'Connected Care organic FXN below plan; Alaris 76% remediated vs 80% plan target; commercial ramp rate below plan; minor enterprise organic growth impact', confidence: 0.84 },
    ],
    narrative: 'Q4 FY25 organic FXN growth of +3.5% missed plan by 50bps. For the fourth consecutive quarter, China VoBP deeper than plan assumptions accounts for the full miss. BioPharma Systems continues to deliver above-plan organic FXN. FY25 full-year organic FXN growth of approximately +3.1% is modestly below the original +3.5-4.0% plan, entirely attributable to China VoBP intensification.',
    recommendations: [
      'FY26 organic FXN guidance of +3-4% is appropriate considering: China VoBP entering stabilization phase (harder to get much worse), Alaris recovery contributing, BioPharma GLP-1 continuing; Waters spin removes lower-growth segments improving BD core portfolio organic rate',
    ],
  },
  {
    quarter: 'Q4 FY25', metricName: 'Organic Revenue Growth (FXN)', varianceType: 'actual_vs_prior_year',
    totalVariance: -50, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP Cumulative YoY Peak', impact: -175, impactUnit: 'bps', explanation: 'Q4 FY25 full Round 9 impact vs Q4 FY24 pre-Round 9 baseline; most adverse YoY China VoBP comparison; Q4 FY26 will compare against this weak Q4 FY25 — favorable comp approaching', confidence: 0.88 },
      { driver: 'Alaris YoY Deceleration', impact: -55, impactUnit: 'bps', explanation: 'Alaris Q4 FY25 organic FXN below Q4 FY24; consent decree constraining connected care growth vs prior year; Q4 FY26 Alaris should recover to above prior year as remediation completes', confidence: 0.86 },
      { driver: 'BioPharma Systems Acceleration YoY', impact: +115, impactUnit: 'bps', explanation: 'Q4 FY25 BioPharma Systems FXN +12% vs +7% Q4 FY24; fastest quarterly YoY acceleration; GLP-1 demand is a structural multi-year volume driver; growing share of BD revenue', confidence: 0.90 },
      { driver: 'PureWick & Interventional YoY Growth', impact: +65, impactUnit: 'bps', explanation: 'PureWick +28% FXN vs +20% Q4 FY24 — accelerating; Interventional +4.5% vs +3.5% Q4 FY24; two growth products accelerating above BD enterprise average', confidence: 0.88 },
    ],
    narrative: 'Q4 FY25 organic FXN growth of +3.5% was 50bps below Q4 FY24\'s +4.0%. China VoBP Round 9 and Alaris are the deceleration drivers; BioPharma Systems and PureWick are actually accelerating vs prior year. Q4 FY25 is likely the trough of BD\'s YoY organic FXN growth deceleration — Q1 FY26 should show improvement as Waters spin simplifies the portfolio and China VoBP comparisons begin to ease.',
    recommendations: [
      'Q4 FY25 is the last quarter before the Waters spin-off (Feb 9 2026); BD continuing operations portfolio from FY26 onward will have higher organic growth potential as Waters (lower-growth) is excluded; communicate how BD\'s post-Waters portfolio organic FXN growth profile improves',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Q1 FY26 (Oct-Dec 2025)
  // Revenue $4,630M | Adj. Op Margin 23.8% | Adj. EPS $2.90 | Organic FXN +2.1%
  // Plan: Revenue $4,700M | Margin 24.2% | EPS $3.05 | FXN +3.0%
  // ───────────────────────────────────────────────────────────────────────────

  {
    quarter: 'Q1 FY26', metricName: 'Revenue', varianceType: 'actual_vs_plan',
    totalVariance: -70, totalVarianceUnit: '$M',
    driverBreakdown: [
      { driver: 'China VoBP Worse Than Plan', impact: -90, impactUnit: '$M', explanation: 'China VoBP Round 9 impact more severe than plan; BD China revenue -9.2% FXN Q1 FY26 vs -7.5% plan; additional BD product categories entering VoBP scope creating incremental headwind vs initial FY26 plan assumptions', confidence: 0.86 },
      { driver: 'Waters Spin-Off Revenue Adjustment', impact: -45, impactUnit: '$M', explanation: 'Waters spin-off Feb 9 2026 — Q1 FY26 includes Waters revenue only through Feb 9 (40 days of ~90-day quarter); approximately -$45M revenue vs plan due to timing of Waters separation being sooner in Q1 than original plan modeled', confidence: 0.84 },
      { driver: 'BioPharma Systems GLP-1 Beat', impact: +75, impactUnit: '$M', explanation: 'Pharmaceutical Systems syringe demand above plan; GLP-1 manufacturer capacity additions driving above-plan BD syringe orders in Q1; continuing strength from FY25 H2 momentum', confidence: 0.90 },
      { driver: 'Alaris Q1 FY26 Recovery Partial', impact: -25, impactUnit: '$M', explanation: 'Alaris 78% consent decree completion; commercial re-entry progressing but Q1 FY26 Alaris still below plan; hospital capital budgets reset in October — Q1 is seasonally weakest for capital equipment', confidence: 0.84 },
      { driver: 'PureWick & Americas Favorable', impact: +15, impactUnit: '$M', explanation: 'PureWick above plan in Q1 FY26; Americas organic FXN +3.0% above plan +2.8%; modest positive contribution from growth products partially offsetting headwinds', confidence: 0.84 },
    ],
    narrative: 'Q1 FY26 revenue of $4,630M missed plan by $70M (-1.5%). China VoBP deeper than plan and the Waters spin-off timing impact account for the majority of the shortfall. BioPharma Systems GLP-1 beat was the key offset. The Q1 FY26 result reflects the transition quarter: Waters in separation, China VoBP at peak pressure, Alaris in commercial re-entry phase. Q2 FY26 and beyond should show structural improvement as these transition dynamics resolve.',
    recommendations: [
      'Waters spin-off completed Feb 9 2026 — the ~$45M Q1 revenue shortfall from Waters separation timing is a one-time Q1 item, not a recurring headwind; Q2 FY26 onward BD continuing operations revenue will be cleaner and comparable; communicate this clearly to avoid investor confusion',
      'Confirm FY26 revenue guidance of $18,900-$19,100M; Q1 FY26 is the weakest BD seasonal quarter and reflects peak transition activity; Q4 FY26 (Jul-Sep 2026) has the most favorable comps (against weak Q4 FY25 baseline) and should show strong YoY growth',
    ],
  },
  {
    quarter: 'Q1 FY26', metricName: 'Revenue', varianceType: 'actual_vs_prior_year',
    totalVariance: -25, totalVarianceUnit: '$M',
    driverBreakdown: [
      { driver: 'Waters Spin-Off Revenue Removal', impact: -120, impactUnit: '$M', explanation: 'Waters Filtration (SpinCo) revenue removed from BD continuing operations; Q1 FY26 BD continuing operations excludes Waters revenue; Q1 FY25 included full Waters revenue; creates YoY headwind on reported comparison', confidence: 0.86 },
      { driver: 'China VoBP YoY Headwind', impact: -95, impactUnit: '$M', explanation: 'Q1 FY26 China VoBP Round 9 vs Q1 FY25 Round 8; cumulative pricing pressure continuing; China -9.2% FXN vs -8.5% FXN Q1 FY25; YoY delta approximately -$35M from incremental VoBP round impact', confidence: 0.86 },
      { driver: 'BioPharma Systems GLP-1 Growth', impact: +120, impactUnit: '$M', explanation: 'Pharmaceutical Systems FXN growth +12% YoY on continuing above-plan GLP-1 syringe demand; Q1 FY26 GLP-1 volume above Q1 FY25 on pharma customer capacity expansion; BD\'s fastest-growing segment continues to outperform', confidence: 0.90 },
      { driver: 'PureWick, Medical Essentials, Interventional', impact: +70, impactUnit: '$M', explanation: 'PureWick +26% FXN YoY; Medical Essentials +3.4% FXN; Interventional +4.2% FXN; three core segments growing above enterprise average rate; portfolio health excluding China and Alaris is strong', confidence: 0.88 },
    ],
    narrative: 'Q1 FY26 revenue declined -$25M or -0.5% YoY from $4,655M to $4,630M on a reported basis. Waters spin-off removal and China VoBP are the headwinds; BioPharma GLP-1 and core BD portfolio growth are the tailwinds. BD continuing operations excluding Waters is actually growing YoY on organic FXN basis — the headline reported decline is a portfolio composition change, not underlying demand deterioration.',
    recommendations: [
      'Clarify that BD continuing operations (ex-Waters) organic FXN growth in Q1 FY26 is approximately +2.1% YoY — positive organic growth despite China VoBP headwinds; the reported -0.5% decline is entirely explained by Waters separation; provide like-for-like continuing operations comparison to help investors track underlying BD performance',
    ],
  },

  {
    quarter: 'Q1 FY26', metricName: 'Adjusted Operating Margin', varianceType: 'actual_vs_plan',
    totalVariance: -40, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'Waters Stranded Costs in Q1', impact: -55, impactUnit: 'bps', explanation: 'Waters spin-off completed Feb 9 2026 — post-separation stranded costs (~$20M) remain in BD continuing operations cost base in Q1 while stranded cost elimination program is initiated; plan had optimistically assumed faster stranded cost elimination', confidence: 0.86 },
      { driver: 'China VoBP Revenue Headwind on Margin', impact: -30, impactUnit: 'bps', explanation: 'Lower China revenue at APAC segment margin; revenue headwind creates negative operating leverage on fixed APAC infrastructure costs; margin compression continues with pricing pressure', confidence: 0.84 },
      { driver: 'BioPharma Systems Mix Favorable', impact: +28, impactUnit: 'bps', explanation: 'Above-plan BioPharma Systems revenue at highest segment margins generating positive enterprise mix; GLP-1 syringe demand volume favorable margin contribution', confidence: 0.88 },
      { driver: 'Excellence Unleashed $150M Achievement', impact: +22, impactUnit: 'bps', explanation: 'Excellence Unleashed $150M savings milestone achieved; Q1 FY26 savings run-rate above Q4 FY25 exit rate; manufacturing and SAE improvements delivering growing quarterly benefit', confidence: 0.88 },
      { driver: 'Revenue Volume Deleverage', impact: -5, impactUnit: 'bps', explanation: '-$70M revenue vs plan creates minor additional deleverage on BD semi-fixed cost base; modest incremental margin headwind beyond stranded costs', confidence: 0.82 },
    ],
    narrative: 'Q1 FY26 adjusted operating margin of 23.8% missed plan by 40bps. Waters stranded costs absorbed in Q1 (before stranded cost elimination program delivers full benefit) and China VoBP margin pressure are the drivers. BioPharma Systems mix and Excellence Unleashed $150M milestone are positive offsets. The Q1 FY26 margin miss reflects the transition quarter dynamics — H2 FY26 should show accelerating margin improvement as stranded costs are eliminated and Excellence Unleashed reaches $200M target.',
    recommendations: [
      'Confirm that Waters stranded cost elimination is on schedule; quantify the ~$40M+ annual stranded cost benefit expected by Q3/Q4 FY26 as the primary margin recovery lever beyond Excellence Unleashed organic savings; investors need visibility into the stranded cost elimination timeline',
      'Reaffirm the path to >25% adjusted operating margin: stranded cost elimination ~40bps, Excellence Unleashed to $200M adding incremental savings, BioPharma Systems growing share, China VoBP stabilizing; FY27 >25% target achievable',
    ],
  },
  {
    quarter: 'Q1 FY26', metricName: 'Adjusted Operating Margin', varianceType: 'actual_vs_prior_year',
    totalVariance: 30, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'Excellence Unleashed YoY Margin Improvement', impact: +115, impactUnit: 'bps', explanation: '$150M cumulative FY26 savings vs $120M FY25 total; growing quarterly excellence savings generating significant YoY margin tailwind; manufacturing efficiency and SAE reduction structural improvements compounding', confidence: 0.88 },
      { driver: 'BioPharma Systems Mix YoY', impact: +55, impactUnit: 'bps', explanation: 'BioPharma Systems growing share of BD continuing operations revenue; segment margin ~45% vs enterprise average ~24%; favorable mix shift generating meaningful YoY margin benefit', confidence: 0.90 },
      { driver: 'China VoBP Margin Headwind YoY', impact: -80, impactUnit: 'bps', explanation: 'Cumulative China VoBP rounds creating continuing YoY margin headwind; Round 9 full impact vs Round 8 Q1 FY25; APAC segment margin below Q1 FY25 on additional pricing compression', confidence: 0.86 },
      { driver: 'Waters Stranded Costs YoY', impact: -60, impactUnit: 'bps', explanation: 'Q1 FY26 includes ~$20M Waters stranded costs; Q1 FY25 had no comparable stranded costs (Waters not yet spinning); one-time YoY comparison headwind that resolves in Q2-Q3 FY26', confidence: 0.84 },
    ],
    narrative: 'Q1 FY26 adjusted operating margin expanded 30bps YoY from 23.5% to 23.8%. Excellence Unleashed and BioPharma Systems are driving structural margin improvement. China VoBP and Waters stranded costs are headwinds. Excluding Waters one-time stranded costs, YoY margin expansion would have been approximately 90bps — demonstrating the strong underlying BD margin improvement trajectory as the portfolio transforms.',
    recommendations: [
      'Communicate Q1 FY26 as the last transition quarter; Q2-Q4 FY26 should show accelerating YoY margin expansion as: (1) Waters stranded costs eliminated, (2) Excellence Unleashed reaching $200M target, (3) BioPharma Systems growing share, (4) Alaris returning to volume; all converging to drive FY27 adjusted operating margin >25%',
    ],
  },

  {
    quarter: 'Q1 FY26', metricName: 'Adjusted Diluted EPS', varianceType: 'actual_vs_plan',
    totalVariance: -0.15, totalVarianceUnit: '$/share',
    driverBreakdown: [
      { driver: 'Revenue Miss Flow-Through', impact: -0.08, impactUnit: '$/share', explanation: '-$70M revenue vs plan at adjusted operating margin ~24%; after-tax EPS impact approximately -$0.08/share; China VoBP and Waters timing are primary revenue variance causes', confidence: 0.86 },
      { driver: 'Waters Stranded Costs Unplanned', impact: -0.08, impactUnit: '$/share', explanation: '~$20M post-spin Waters stranded costs not fully anticipated in Q1 plan; after-tax EPS impact approximately -$0.08/share; one-time Q1 item that will decline as stranded cost program delivers', confidence: 0.84 },
      { driver: 'BioPharma GLP-1 Beat', impact: +0.07, impactUnit: '$/share', explanation: 'Above-plan Pharmaceutical Systems revenue at segment margins generating incremental EPS; partially offsetting plan misses in other areas', confidence: 0.88 },
      { driver: 'Excellence Unleashed $150M Milestone', impact: +0.05, impactUnit: '$/share', explanation: 'Q1 FY26 Excellence Unleashed savings at $150M cumulative milestone; quarterly savings contribution generating EPS benefit above plan', confidence: 0.88 },
      { driver: 'Interest and Amortization In-Line', impact: 0.00, impactUnit: '$/share', explanation: 'Interest expense and Bard amortization tracking to Q1 FY26 plan; Waters debt allocation finalized; no material variance from financial cost lines', confidence: 0.90 },
      { driver: 'Tax Rate Adverse', impact: -0.11, impactUnit: '$/share', explanation: 'Effective tax rate 22.5% vs 21.8% plan; lower China income reducing favorable tax jurisdiction benefit; Waters separation tax items creating complexity; discrete tax charges ~$12M in Q1', confidence: 0.84 },
    ],
    narrative: 'Q1 FY26 Adj. EPS of $2.90 missed plan by $0.15 (-4.9%). China VoBP below plan, Waters stranded costs, and adverse tax rate together account for the miss. BioPharma GLP-1 and Excellence Unleashed $150M milestone provide meaningful offset. Q1 FY26 is BD\'s seasonally weakest quarter and the peak transition quarter (Waters spin completed mid-quarter). Q2-Q4 FY26 should show accelerating improvement as all transition headwinds resolve.',
    recommendations: [
      'Provide explicit guidance bridge from Q1 FY26 $2.90 to FY26 full-year guidance of $12.52-$12.72: Q2-Q4 need to average ~$3.20-$3.25/share which is achievable given: seasonal volume improvement, Waters stranded cost elimination, Excellence Unleashed to $200M, and BioPharma GLP-1 continuing',
      'Confirm FY26 Adj. EPS guidance of $12.52-$12.72; Q2 FY26 actual $2.90 (+3.9% YoY) already validates the guidance trajectory; communicate Q3-Q4 drivers that support the $12.52+ full-year outcome',
    ],
  },
  {
    quarter: 'Q1 FY26', metricName: 'Adjusted Diluted EPS', varianceType: 'actual_vs_prior_year',
    totalVariance: -0.12, totalVarianceUnit: '$/share',
    driverBreakdown: [
      { driver: 'Waters Revenue Removal', impact: -0.14, impactUnit: '$/share', explanation: 'Waters spin-off removes Waters segment EPS contribution from BD continuing operations; Q1 FY25 included Waters EPS; YoY comparison headwind of approximately -$0.14/share from portfolio composition change', confidence: 0.84 },
      { driver: 'Waters Stranded Costs New Headwind', impact: -0.08, impactUnit: '$/share', explanation: 'Waters stranded costs (~$20M) in Q1 FY26 not present in Q1 FY25; one-time transition cost creating YoY EPS headwind of approximately -$0.08/share; resolves Q2-Q3 FY26', confidence: 0.84 },
      { driver: 'Excellence Unleashed YoY Benefit', impact: +0.18, impactUnit: '$/share', explanation: '$150M cumulative savings vs $25M Q1 FY25 baseline; YoY EPS benefit of approximately +$0.18/share from structural manufacturing and SAE improvements', confidence: 0.88 },
      { driver: 'BioPharma Systems & PureWick Growth', impact: +0.20, impactUnit: '$/share', explanation: 'High-margin segment growth in BioPharma Systems (GLP-1) and PureWick generating incremental EPS vs Q1 FY25; best segments growing fastest; positive portfolio mix compounding YoY', confidence: 0.90 },
      { driver: 'China VoBP YoY Headwind', impact: -0.12, impactUnit: '$/share', explanation: 'Incremental China VoBP Round 9 impact vs Q1 FY25 Round 8 baseline; approximately -$35M incremental YoY revenue; after-tax EPS impact approximately -$0.12/share', confidence: 0.86 },
      { driver: 'Interest and Amortization Reduction', impact: +0.10, impactUnit: '$/share', explanation: 'Cumulative debt repayment ($1.5B FY25) + declining Bard amortization; combined structural EPS tailwind of approximately +$0.10/share YoY', confidence: 0.88 },
      { driver: 'Tax Rate Headwind YoY', impact: -0.26, impactUnit: '$/share', explanation: 'Tax rate 22.5% Q1 FY26 vs 21.8% Q1 FY25; China income lower, Waters separation tax items, discrete charges; approximately -$0.26/share YoY EPS impact from tax rate deterioration', confidence: 0.84 },
    ],
    narrative: 'Q1 FY26 Adj. EPS declined $0.12 or -4.0% YoY from $3.02 to $2.90. The Waters spin-off transition (revenue removal + stranded costs) accounts for -$0.22/share of the YoY decline — a one-time portfolio composition change, not operational deterioration. Excluding Waters transition, Excellence Unleashed and BioPharma GLP-1 would have driven YoY EPS growth of approximately +$0.10/share. Q1 FY26 is the transition quarter; from Q2 FY26 onward, BD continuing operations should show YoY EPS growth as all structural improvement drivers compound.',
    recommendations: [
      'Frame Q1 FY26 EPS decline as entirely a Waters transition effect: ex-Waters spin impact, BD continuing operations EPS would have grown YoY; this is the last quarter with Waters spin-off distortion — from Q2 FY26 all BD comparisons are like-for-like continuing operations',
      'Q2 FY26 actual Adj. EPS $2.90 (+3.9% YoY) already demonstrates the FY26 recovery; communicate Q2 actuals at Q1 FY26 release if available or reaffirm that Q2 is tracking to plan with FY26 guidance intact at $12.52-$12.72',
    ],
  },

  {
    quarter: 'Q1 FY26', metricName: 'Organic Revenue Growth (FXN)', varianceType: 'actual_vs_plan',
    totalVariance: -90, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP Round 9 Deeper Than Plan', impact: -110, impactUnit: 'bps', explanation: 'China VoBP FXN -9.2% vs -7.5% plan; 170bps worse than plan in China; enterprise impact approximately -0.10%; China becoming larger organic FXN headwind than original FY26 plan assumed', confidence: 0.86 },
      { driver: 'Waters Spin Revenue Mix Effect', impact: -25, impactUnit: 'bps', explanation: 'Waters separation reduces total BD revenue base modestly vs plan; organic FXN calculated on BD continuing operations is slightly impacted by portfolio composition change in comparison period', confidence: 0.80 },
      { driver: 'BioPharma Systems Above Plan', impact: +35, impactUnit: 'bps', explanation: 'Pharmaceutical Systems FXN above plan; GLP-1 demand above initial FY26 plan assumption; continuing structural above-plan performance in highest-margin segment', confidence: 0.88 },
      { driver: 'PureWick & Americas Performance', impact: +10, impactUnit: 'bps', explanation: 'PureWick above plan growth; Americas organic FXN slightly above plan; modest positive contributions partially offsetting primary headwinds', confidence: 0.84 },
    ],
    narrative: 'Q1 FY26 organic FXN growth of +2.1% missed the +3.0% plan by 90bps. China VoBP continues to exceed plan assumptions on the downside. Excluding China VoBP and Waters transition effects, BD continuing operations underlying organic FXN would be approximately +4.5-5.0% — demonstrating strong portfolio health. The organic growth rate will improve as China VoBP comparisons ease (Q2 FY26 -9.8% FXN was the apparent trough) and Alaris returns to growth.',
    recommendations: [
      'Update FY26 organic FXN growth guidance to +2.5-3.5% reflecting China VoBP tracking at -9%+ vs original plan assumption; communicate that Q2 FY26 actual organic FXN of +2.6% demonstrates recovery from Q1\'s -2.1% FXN (China VoBP -9.8% the worst quarter per disclosed data)',
    ],
  },
  {
    quarter: 'Q1 FY26', metricName: 'Organic Revenue Growth (FXN)', varianceType: 'actual_vs_prior_year',
    totalVariance: -110, totalVarianceUnit: 'bps',
    driverBreakdown: [
      { driver: 'China VoBP YoY Escalation', impact: -120, impactUnit: 'bps', explanation: 'Q1 FY26 China VoBP Round 9 vs Q1 FY25 Round 8; incremental YoY headwind from additional VoBP round; approximately -120bps on BD enterprise organic FXN rate vs Q1 FY25', confidence: 0.88 },
      { driver: 'Waters Portfolio Composition Change', impact: -40, impactUnit: 'bps', explanation: 'Organic FXN comparison affected by Waters spin-off; Q1 FY25 included Waters growth contribution; Q1 FY26 BD continuing operations portfolio excludes Waters; creates YoY FXN comparison headwind', confidence: 0.82 },
      { driver: 'BioPharma Systems Acceleration YoY', impact: +90, impactUnit: 'bps', explanation: 'Q1 FY26 Pharmaceutical Systems FXN +12% vs +8.5% Q1 FY25; GLP-1 demand materially accelerating as pharma manufacturers scale; growing contribution to BD enterprise organic FXN rate', confidence: 0.90 },
      { driver: 'PureWick & Interventional Growth', impact: +40, impactUnit: 'bps', explanation: 'PureWick +26% FXN YoY growth above Q1 FY25 pace; Interventional +4.2% FXN; two growth segments growing above enterprise average and contributing positively to enterprise organic FXN', confidence: 0.86 },
      { driver: 'Alaris YoY Slight Improvement', impact: +20, impactUnit: 'bps', explanation: 'Alaris Q1 FY26 FXN slightly above Q1 FY25 (78% remediation vs 65%); modest YoY improvement; commercial re-entry progressing; first positive Alaris YoY organic FXN contribution in several quarters', confidence: 0.84 },
    ],
    narrative: 'Q1 FY26 organic FXN growth of +2.1% declined from Q1 FY25\'s +3.2%. China VoBP escalation and Waters portfolio composition change are the deceleration drivers. Encouragingly, Alaris posted its first YoY improvement, and BioPharma Systems acceleration continues. BD continuing operations ex-China organic FXN is approximately +5.5% — the portfolio growth engine is intact and the headline rate is weighed down by China VoBP headwinds that are now at their approximate peak.',
    recommendations: [
      'Q2 FY26 organic FXN of +2.6% (reported) showing recovery from Q1\'s +2.1% confirms the China VoBP comparison is stabilizing; communicate the trajectory toward +3-4% FXN by FY26 H2 as: China VoBP round-over-round effect moderates, Alaris volume accelerates, and BioPharma GLP-1 continues; organic FXN growth inflection is in progress',
    ],
  },
];

export async function seedVarianceExplanations(
  prisma: PrismaClient,
  companyId: number,
  periodMap: Record<string, { id: number }>,
) {
  const availableQuarters = QUARTER_LABELS.filter((q) => periodMap[q]);

  if (availableQuarters.length === 0) {
    console.log('  No matching quarters in periodMap for variance explanations — skipping');
    return;
  }

  const rows = records
    .filter((r) => availableQuarters.includes(r.quarter))
    .map((r) => ({
      companyId,
      periodId: periodMap[r.quarter].id,
      metricName: r.metricName,
      varianceType: r.varianceType,
      totalVariance: r.totalVariance,
      totalVarianceUnit: r.totalVarianceUnit,
      driverBreakdown: r.driverBreakdown as unknown as any,
      narrative: r.narrative,
      recommendations: r.recommendations as unknown as any,
    }));

  await prisma.varianceExplanation.createMany({ data: rows });

  console.log(
    `  Seeded ${rows.length} BD (Becton, Dickinson) variance explanations ` +
    `(${availableQuarters.length} quarters × 4 metrics × 2 types)`,
  );
}
