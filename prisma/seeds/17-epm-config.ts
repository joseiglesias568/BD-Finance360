import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed EPM Configuration: Planning Milestones, Platform Config, Driver Forecasts
// Becton, Dickinson and Company (BDX) FY2026 planning calendar; driver-based planning
// aligned to BD capital allocation framework: Revenue ~$18.0B, Adj. EPS $12.52–$12.72,
// FCF ~$3.0B+ FY2026 guidance, deleveraging from 2.9x to <2.5x leverage target.
// Segments: Medical Essentials | Connected Care | BioPharma Systems | Interventional
//
// NOTE: Driver names in causalityUpdates and driverForecasts below MUST exactly
// match the parent driver names defined in 12-business-consoles.ts.
// =============================================================================

export async function seedEpmConfig(prisma: PrismaClient, companyId: number) {
  console.log('  Seeding BD EPM configuration...');

  // Delete existing records before creating new ones
  await prisma.driverForecast.deleteMany({ where: { companyId } });
  await prisma.platformConfig.deleteMany({ where: { companyId } });
  await prisma.planningMilestone.deleteMany({ where: { companyId } });

  // ─── Planning Milestones (FY26 calendar) ──────────────────────────────────

  const milestones = [
    {
      fiscalYear:   'FY26',
      label:        'Q2 FY26 Close & H1 Review',
      description:
        'Q2 FY26 close (Mar 31, 2026); H1 actuals: Revenue $9,200M, Adj. EPS $6.85, FCF $1,420M (96% conversion), leverage 2.9x. BioPharma Systems 88% PFS capacity utilization — triggered FY2027 expansion authorization discussion. Alaris 72K annualized units; 32K hospital backlog intact. $450M goodwill impairment (Connected Care, non-cash). China VoBP $80M H1, on plan. FY2026 guidance reaffirmed: $12.52–$12.72 adj. EPS.',
      month:        'May',
      status:       'complete',
      sortOrder:    1,
      category:     'close',
    },
    {
      fiscalYear:   'FY26',
      label:        'FY26 Annual Guidance Reaffirmation',
      description:
        'BD FY2026 full-year guidance confirmed: Adj. EPS $12.52–$12.72; revenue ~$18.0B continuing ops; adj. op. margin ~25%; FCF ~$3.0B+; gross debt reduction $1,500M; leverage target <2.9x by YE FY26. Waters spin-off complete (Feb 2026) — all guidance on continuing ops basis.',
      month:        'Feb',
      status:       'complete',
      sortOrder:    2,
      category:     'board',
    },
    {
      fiscalYear:   'FY26',
      label:        'BioPharma Systems Capacity Expansion Authorization',
      description:
        'Board authorization required for FY2027–FY2028 GLP-1 PFS capacity expansion ($1.2–1.5B capex). PFS utilization reached 88% in Q2 FY26 vs 84% plan — approaching 92% delivery risk threshold. North Carolina and Ireland greenfield site selection, contractor procurement, and environmental review to begin immediately post-authorization. Supply agreement demand confirmation from Novo Nordisk and Eli Lilly required to finalize capex scope.',
      month:        'Aug',
      status:       'upcoming',
      sortOrder:    3,
      category:     'board',
    },
    {
      fiscalYear:   'FY26',
      label:        'Q3 FY26 Earnings & Guidance Review',
      description:
        'Q3 FY26 close (Jun 30, 2026); results expected ~August 2026. Key items: Hospital capital release (Q3 seasonal peak — expect Alaris ramp toward 78K+ annualized), BioPharma Systems Q3 GLP-1 seasonality, China VoBP H3 tracking vs $120M 9M cumulative plan. Adj. EPS Q3 expected ~$3.08. FY2026 guidance reaffirmation or narrowing decision.',
      month:        'Aug',
      status:       'upcoming',
      sortOrder:    4,
      category:     'close',
    },
    {
      fiscalYear:   'FY26',
      label:        'FDA Alaris Consent Decree Resolution Petition',
      description:
        'BD targets filing formal petition for FDA Consent Decree termination following zero-483 Q1–Q2 FY26 track record. Consent decree resolution eliminates ~$300M annual remediation costs and unlocks full Alaris market re-entry (120K+ units). Process requires FDA district office coordination, third-party expert verification, and six-month FDA review timeline. Filing in Q4 FY2026 targets resolution in Q2 FY2027.',
      month:        'Sep',
      status:       'upcoming',
      sortOrder:    5,
      category:     'planning',
    },
    {
      fiscalYear:   'FY26',
      label:        'Q4 FY26 Budget Cycle & FY27 Annual Plan',
      description:
        'FY2027 annual plan cycle: Revenue ~$19.5B (8% CC growth); Adj. EPS ~$13.80–$14.20 (growing from $12.62 FY26 midpoint); FCF ~$3.3B+; leverage target 2.6–2.7x; GLP-1 PFS volumes +18–20%; Alaris 95K+ units (consent decree resolved); China VoBP mitigation via premium mix achieving <55% VoBP-exposed mix. FY2027 capex $1.7B (GLP-1 expansion + maintenance).',
      month:        'Sep',
      status:       'upcoming',
      sortOrder:    6,
      category:     'planning',
    },
    {
      fiscalYear:   'FY26',
      label:        'FY27–FY29 Long-Range Plan',
      description:
        'FY2029 Adj. EPS target $16.50–$17.50 (12% CAGR from FY26 midpoint). Revenue $22B+. Leverage <2.0x by FY2029 enabling full capital return program. BioPharma Systems GLP-1 capacity fully on-stream by FY2028 supporting $6B+ segment revenue. Alaris full market return: 130K+ units, $550M+ Connected Care segment revenue from device. EP catheter tuck-in acquisition under evaluation for $800M–$1.2B incremental Interventional revenue by FY2029.',
      month:        'Oct',
      status:       'upcoming',
      sortOrder:    7,
      category:     'planning',
    },
    {
      fiscalYear:   'FY26',
      label:        'China VoBP Contingency Plan Execution',
      description:
        'If NHSA announces insulin syringe VoBP tender in Q4 FY2026 (35% probability), execute: (1) redirect 10–15% China insulin syringe volume to India/SE Asia, (2) accelerate premium product mix-shift to 35% of China revenue, (3) update Medical Essentials FY2027 plan to reflect $235–260M total VoBP headwind scenario. Contingency plan has been pre-authorized for immediate execution pending NHSA announcement.',
      month:        'Oct',
      status:       'upcoming',
      sortOrder:    8,
      category:     'planning',
    },
  ];

  await prisma.planningMilestone.createMany({
    data: milestones.map((m) => ({ companyId, ...m })),
  });
  console.log(`  Created ${milestones.length} BD planning milestones`);

  // ─── Platform Config (all EPM module thresholds & parameters) ─────────────

  const configs = [
    // Forecasting module
    { module: 'forecasting', key: 'mape_threshold_good', value: '2', type: 'number' },
    { module: 'forecasting', key: 'mape_threshold_warn', value: '5', type: 'number' },
    { module: 'forecasting', key: 'confidence_threshold_high', value: '90', type: 'number' },
    { module: 'forecasting', key: 'confidence_threshold_medium', value: '75', type: 'number' },

    // In-cycle reporting module
    { module: 'in-cycle', key: 'status_favorable_threshold', value: '0', type: 'number' },
    { module: 'in-cycle', key: 'status_at_risk_threshold', value: '-1', type: 'number' },
    { module: 'in-cycle', key: 'chart_metrics', value: '["Total Revenue","Adjusted EPS","Adjusted Operating Margin","BioPharma Systems Revenue","Alaris Pump Shipments (K annualized)","Net Leverage"]', type: 'json' },

    // Bridge walks module
    { module: 'bridge', key: 'default_base_revenue', value: '4714', type: 'number' },
    { module: 'bridge', key: 'categories', value: '["medical-essentials-volume","connected-care-alaris","biopharma-systems-glp1","interventional-procedures","fx-translation","china-vobp","interest-expense","other"]', type: 'json' },

    // Forecast simulations module
    { module: 'simulation', key: 'monte_carlo_points', value: '50', type: 'number' },
    { module: 'simulation', key: 'sensitivity_impact_factor', value: '0.10', type: 'number' },

    // Planning & budgeting module
    { module: 'planning', key: 'dollar_metrics', value: '["Total Revenue","Medical Essentials Revenue","Connected Care Revenue","BioPharma Systems Revenue","Interventional Revenue","Adjusted Operating Income","Free Cash Flow","Capital Expenditures"]', type: 'json' },
    { module: 'planning', key: 'cost_metric_keywords', value: '["cogs","sg-a","r-d","alaris-remediation","interest","amortization","depreciation"]', type: 'json' },
    { module: 'planning', key: 'variance_on_track_threshold', value: '0.5', type: 'number' },
    { module: 'planning', key: 'chart_metrics', value: '["Total Revenue","Adjusted EPS","Adjusted Operating Margin","Net Leverage"]', type: 'json' },

    // Capital & returns module (BD deleveraging and capital allocation)
    { module: 'capital', key: 'capex_guidance_annual', value: '1700', type: 'number' },
    { module: 'capital', key: 'eps_cagr_target', value: '12', type: 'number' },
    { module: 'capital', key: 'leverage_target', value: '2.5', type: 'number' },
    { module: 'capital', key: 'fcf_conversion_target', value: '95', type: 'number' },
  ];

  await prisma.platformConfig.createMany({
    data: configs.map((c) => ({ companyId, ...c })),
  });
  console.log(`  Created ${configs.length} BD platform config entries`);

  // ─── Update causalityWeight on existing ConsoleDriver records ─────────────

  // Driver names MUST exactly match those defined in 12-business-consoles.ts
  const causalityUpdates: { name: string; weight: number }[] = [
    // Medical Essentials drivers
    { name: 'China VoBP Headwind Management',               weight: 0.45 },
    { name: 'U.S. Medical Essentials Volume Growth',        weight: 0.30 },
    { name: 'Medical Essentials Segment Margin',            weight: 0.25 },

    // Connected Care drivers
    { name: 'Alaris Infusion Pump Recovery',                weight: 0.50 },
    { name: 'Smart Medication Management (MMS) Growth',     weight: 0.25 },
    { name: 'Connected Care Software & Services',           weight: 0.25 },

    // BioPharma Systems drivers
    { name: 'GLP-1 Drug Delivery Demand',                   weight: 0.50 },
    { name: 'BioPharma Systems Pricing & Mix',              weight: 0.25 },
    { name: 'BioPharma Capacity Expansion',                 weight: 0.25 },

    // Interventional drivers
    { name: 'Interventional Procedure Growth',              weight: 0.45 },
    { name: 'Lutonix DCB & Vascular Innovation',            weight: 0.30 },
    { name: 'BD Surgery & Urology',                         weight: 0.25 },

    // Financial Performance drivers
    { name: 'EPS & Guidance Delivery',                      weight: 0.40 },
    { name: 'BD Segment Operating Income Bridge',           weight: 0.40 },
    { name: 'Free Cash Flow & Capital Returns',             weight: 0.20 },

    // Capital Allocation drivers
    { name: 'Leverage & Debt Reduction',                    weight: 0.45 },
    { name: 'Capital Expenditure Management',               weight: 0.30 },
    { name: 'Interest Expense & Cost of Capital',           weight: 0.25 },
  ];

  let weightUpdates = 0;
  for (const update of causalityUpdates) {
    const result = await prisma.consoleDriver.updateMany({
      where: { name: update.name, console: { companyId } },
      data:  { causalityWeight: update.weight },
    });
    weightUpdates += result.count;
  }
  console.log(`  Updated causalityWeight on ${weightUpdates} BD drivers`);

  // ─── Driver Forecasts with Elasticity ─────────────────────────────────────

  // Build a cross-console driver map for elasticity forecasts
  const allDrivers = await prisma.consoleDriver.findMany({
    where:  { console: { companyId } },
    select: { id: true, name: true },
  });
  const driverMap = new Map(allDrivers.map((d) => [d.name, d.id]));

  // Driver names MUST exactly match parent driver names in 12-business-consoles.ts
  const driverForecasts: {
    driverName:       string;
    metricName:       string;
    forecastValue:    number;
    actualValue:      number | null;
    budgetValue:      number | null;
    priorYearValue:   number | null;
    elasticity:       number;
    elasticityUnit:   string;
  }[] = [
    {
      driverName:     'GLP-1 Drug Delivery Demand',
      metricName:     'GLP-1 PFS Volume Growth YoY (%)',
      forecastValue:  19.0, actualValue: 19.0, budgetValue: 18.0, priorYearValue: 14.0,
      elasticity:     55,
      elasticityUnit: '$M BioPharma Systems revenue per +1pp GLP-1 volume growth above plan',
    },
    {
      driverName:     'Alaris Infusion Pump Recovery',
      metricName:     'Alaris Annual Shipment Units (K)',
      forecastValue:  72.0, actualValue: 72.0, budgetValue: 75.0, priorYearValue: 60.0,
      elasticity:     40,
      elasticityUnit: '$M Connected Care revenue per +10K annual Alaris units above plan',
    },
    {
      driverName:     'China VoBP Headwind Management',
      metricName:     'China VoBP Annual Revenue Headwind ($M)',
      forecastValue:  160.0, actualValue: 80.0, budgetValue: 160.0, priorYearValue: 142.0,
      elasticity:     -0.006,
      elasticityUnit: 'adj. operating margin pp per $100M additional VoBP headwind (negative impact)',
    },
    {
      driverName:     'Leverage & Debt Reduction',
      metricName:     'Net Debt / Adj. EBITDA Leverage (x)',
      forecastValue:  2.9, actualValue: 2.9, budgetValue: 2.95, priorYearValue: 3.1,
      elasticity:     15,
      elasticityUnit: 'bps credit spread tightening per 0.1x leverage reduction (Baa1 → A3 threshold)',
    },
    {
      driverName:     'Free Cash Flow & Capital Returns',
      metricName:     'FCF Conversion Rate (% of adj. net income)',
      forecastValue:  96.0, actualValue: 96.0, budgetValue: 95.0, priorYearValue: 94.0,
      elasticity:     30,
      elasticityUnit: '$M additional annual FCF per +1pp FCF conversion rate at current adj. net income',
    },
    {
      driverName:     'BioPharma Systems Pricing & Mix',
      metricName:     'BioPharma Systems Net Pricing Realization (% YoY)',
      forecastValue:  2.8, actualValue: 2.8, budgetValue: 2.5, priorYearValue: 2.2,
      elasticity:     22,
      elasticityUnit: '$M BioPharma Systems OI per +0.5pp pricing realization above plan',
    },
    {
      driverName:     'Interventional Procedure Growth',
      metricName:     'Peripheral Vascular CC Growth (%)',
      forecastValue:  8.0, actualValue: 8.0, budgetValue: 7.0, priorYearValue: 5.8,
      elasticity:     14,
      elasticityUnit: '$M Interventional revenue per +1pp PV CC growth above plan',
    },
    {
      driverName:     'Interest Expense & Cost of Capital',
      metricName:     'Annual Interest Expense Savings from Debt Reduction ($M)',
      forecastValue:  60.0, actualValue: 30.0, budgetValue: 60.0, priorYearValue: 0.0,
      elasticity:     0.21,
      elasticityUnit: 'EPS cents per $10M annual interest expense savings at current tax rate and shares',
    },
  ];

  const forecastRecords = driverForecasts
    .filter((df) => driverMap.has(df.driverName))
    .map((df) => ({
      companyId,
      driverId:       driverMap.get(df.driverName)!,
      metricName:     df.metricName,
      periodLabel:    'Q2 FY26',
      forecastValue:  df.forecastValue,
      actualValue:    df.actualValue,
      budgetValue:    df.budgetValue,
      priorYearValue: df.priorYearValue,
      elasticity:     df.elasticity,
      elasticityUnit: df.elasticityUnit,
    }));

  if (forecastRecords.length > 0) {
    await prisma.driverForecast.createMany({ data: forecastRecords });
  }
  console.log(`  Created ${forecastRecords.length} BD driver forecasts with elasticity`);

  console.log('BD EPM Configuration seed complete');
}
