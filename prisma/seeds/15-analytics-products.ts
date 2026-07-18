import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed Analytics Products: ML Forecast Results + Anomaly Detections
// Layer 3: Data & Analytics Products
//
// Forecast horizon: Q1 FY25 → FY27E. Period labels use 'Q# FY##' format.
// BD FY2026 context: Q1 FY26 Revenue $4,486M, Q2 FY26 $4,714M, Adj. EPS $3.50.
// Segments: Medical Essentials | Connected Care | BioPharma Systems | Interventional
// FY2026 guidance: Adj. EPS $12.52–$12.72, adj. op. margin ~25%, revenue ~$18.0B
// =============================================================================

export async function seedAnalyticsProducts(prisma: PrismaClient, companyId: number) {
  // Delete existing records before creating new ones
  await prisma.anomalyDetection.deleteMany({ where: { companyId } });
  await prisma.forecastResult.deleteMany({ where: { companyId } });

  console.log('  Seeding BD ML forecast results...');

  const forecastData = [
    // ── Adjusted EPS ($) — BD quarterly; Q1 FY26 actual $3.35, Q2 FY26 $3.50 ──
    { metricName: 'Adjusted EPS', periodLabel: 'Q3 FY25', modelType: 'Ensemble', forecastValue: 3.24, lowerBound: 3.04, upperBound: 3.44, actualValue: 3.28, confidenceScore: 0.90, mape: 1.22 },
    { metricName: 'Adjusted EPS', periodLabel: 'Q4 FY25', modelType: 'Ensemble', forecastValue: 3.31, lowerBound: 3.12, upperBound: 3.50, actualValue: 3.34, confidenceScore: 0.91, mape: 0.90 },
    { metricName: 'Adjusted EPS', periodLabel: 'Q1 FY26', modelType: 'Ensemble', forecastValue: 3.28, lowerBound: 3.10, upperBound: 3.46, actualValue: 3.35, confidenceScore: 0.92, mape: 2.09 },
    { metricName: 'Adjusted EPS', periodLabel: 'Q2 FY26', modelType: 'Ensemble', forecastValue: 3.46, lowerBound: 3.28, upperBound: 3.64, actualValue: 3.50, confidenceScore: 0.93, mape: 1.14 },
    { metricName: 'Adjusted EPS', periodLabel: 'Q3 FY26', modelType: 'Ensemble', forecastValue: 3.02, lowerBound: 2.82, upperBound: 3.22, actualValue: null, confidenceScore: 0.88, mape: 0 },
    { metricName: 'Adjusted EPS', periodLabel: 'Q4 FY26', modelType: 'Ensemble', forecastValue: 2.90, lowerBound: 2.70, upperBound: 3.10, actualValue: null, confidenceScore: 0.85, mape: 0 },
    { metricName: 'Adjusted EPS', periodLabel: 'FY26', modelType: 'Ensemble', forecastValue: 12.62, lowerBound: 12.52, upperBound: 12.72, actualValue: null, confidenceScore: 0.94, mape: 0 },

    // ── Total Revenue ($M) — BD quarterly ──
    { metricName: 'Total Revenue ($M)', periodLabel: 'Q3 FY25', modelType: 'Ensemble', forecastValue: 4640, lowerBound: 4502, upperBound: 4778, actualValue: 4664, confidenceScore: 0.91, mape: 0.52 },
    { metricName: 'Total Revenue ($M)', periodLabel: 'Q4 FY25', modelType: 'Ensemble', forecastValue: 4668, lowerBound: 4528, upperBound: 4808, actualValue: 4685, confidenceScore: 0.92, mape: 0.36 },
    { metricName: 'Total Revenue ($M)', periodLabel: 'Q1 FY26', modelType: 'Ensemble', forecastValue: 4435, lowerBound: 4304, upperBound: 4566, actualValue: 4486, confidenceScore: 0.93, mape: 1.14 },
    { metricName: 'Total Revenue ($M)', periodLabel: 'Q2 FY26', modelType: 'Ensemble', forecastValue: 4680, lowerBound: 4544, upperBound: 4816, actualValue: 4714, confidenceScore: 0.94, mape: 0.72 },
    { metricName: 'Total Revenue ($M)', periodLabel: 'Q3 FY26', modelType: 'Ensemble', forecastValue: 4760, lowerBound: 4618, upperBound: 4902, actualValue: null, confidenceScore: 0.89, mape: 0 },
    { metricName: 'Total Revenue ($M)', periodLabel: 'Q4 FY26', modelType: 'Ensemble', forecastValue: 4805, lowerBound: 4661, upperBound: 4949, actualValue: null, confidenceScore: 0.87, mape: 0 },
    { metricName: 'Total Revenue ($M)', periodLabel: 'FY26', modelType: 'Ensemble', forecastValue: 18665, lowerBound: 18100, upperBound: 19230, actualValue: null, confidenceScore: 0.90, mape: 0 },

    // ── Adjusted Operating Margin (%) ──
    { metricName: 'Adjusted Operating Margin (%)', periodLabel: 'Q3 FY25', modelType: 'XGBoost', forecastValue: 24.6, lowerBound: 23.8, upperBound: 25.4, actualValue: 24.8, confidenceScore: 0.88, mape: 0.81 },
    { metricName: 'Adjusted Operating Margin (%)', periodLabel: 'Q4 FY25', modelType: 'XGBoost', forecastValue: 24.3, lowerBound: 23.5, upperBound: 25.1, actualValue: 24.5, confidenceScore: 0.89, mape: 0.82 },
    { metricName: 'Adjusted Operating Margin (%)', periodLabel: 'Q1 FY26', modelType: 'XGBoost', forecastValue: 24.6, lowerBound: 23.8, upperBound: 25.4, actualValue: 24.9, confidenceScore: 0.90, mape: 1.20 },
    { metricName: 'Adjusted Operating Margin (%)', periodLabel: 'Q2 FY26', modelType: 'XGBoost', forecastValue: 24.8, lowerBound: 24.0, upperBound: 25.6, actualValue: 25.0, confidenceScore: 0.91, mape: 0.80 },
    { metricName: 'Adjusted Operating Margin (%)', periodLabel: 'Q3 FY26', modelType: 'XGBoost', forecastValue: 24.5, lowerBound: 23.7, upperBound: 25.3, actualValue: null, confidenceScore: 0.86, mape: 0 },
    { metricName: 'Adjusted Operating Margin (%)', periodLabel: 'FY26', modelType: 'XGBoost', forecastValue: 25.0, lowerBound: 24.4, upperBound: 25.6, actualValue: null, confidenceScore: 0.88, mape: 0 },

    // ── BioPharma Systems Revenue ($M) — GLP-1 driven ──
    { metricName: 'BioPharma Systems Revenue ($M)', periodLabel: 'Q3 FY25', modelType: 'Prophet', forecastValue: 1042, lowerBound: 990, upperBound: 1094, actualValue: 1058, confidenceScore: 0.88, mape: 1.52 },
    { metricName: 'BioPharma Systems Revenue ($M)', periodLabel: 'Q4 FY25', modelType: 'Prophet', forecastValue: 1048, lowerBound: 996, upperBound: 1100, actualValue: 1062, confidenceScore: 0.89, mape: 1.32 },
    { metricName: 'BioPharma Systems Revenue ($M)', periodLabel: 'Q1 FY26', modelType: 'Prophet', forecastValue: 1120, lowerBound: 1064, upperBound: 1176, actualValue: 1140, confidenceScore: 0.90, mape: 1.75 },
    { metricName: 'BioPharma Systems Revenue ($M)', periodLabel: 'Q2 FY26', modelType: 'Prophet', forecastValue: 1148, lowerBound: 1090, upperBound: 1206, actualValue: 1168, confidenceScore: 0.91, mape: 1.72 },
    { metricName: 'BioPharma Systems Revenue ($M)', periodLabel: 'Q3 FY26', modelType: 'Prophet', forecastValue: 1195, lowerBound: 1135, upperBound: 1255, actualValue: null, confidenceScore: 0.87, mape: 0 },
    { metricName: 'BioPharma Systems Revenue ($M)', periodLabel: 'FY26', modelType: 'Prophet', forecastValue: 4640, lowerBound: 4400, upperBound: 4880, actualValue: null, confidenceScore: 0.86, mape: 0 },

    // ── PFS Capacity Utilization (%) — utilization constraint tracking ──
    { metricName: 'PFS Capacity Utilization (%)', periodLabel: 'Q3 FY25', modelType: 'XGBoost', forecastValue: 80.0, lowerBound: 77.0, upperBound: 83.0, actualValue: 82.0, confidenceScore: 0.87, mape: 2.44 },
    { metricName: 'PFS Capacity Utilization (%)', periodLabel: 'Q4 FY25', modelType: 'XGBoost', forecastValue: 81.5, lowerBound: 78.5, upperBound: 84.5, actualValue: 83.0, confidenceScore: 0.88, mape: 1.81 },
    { metricName: 'PFS Capacity Utilization (%)', periodLabel: 'Q1 FY26', modelType: 'XGBoost', forecastValue: 84.0, lowerBound: 81.0, upperBound: 87.0, actualValue: 86.0, confidenceScore: 0.87, mape: 2.33 },
    { metricName: 'PFS Capacity Utilization (%)', periodLabel: 'Q2 FY26', modelType: 'XGBoost', forecastValue: 85.5, lowerBound: 82.5, upperBound: 88.5, actualValue: 88.0, confidenceScore: 0.86, mape: 2.89 },
    { metricName: 'PFS Capacity Utilization (%)', periodLabel: 'Q3 FY26', modelType: 'XGBoost', forecastValue: 90.0, lowerBound: 87.0, upperBound: 93.0, actualValue: null, confidenceScore: 0.82, mape: 0 },
    { metricName: 'PFS Capacity Utilization (%)', periodLabel: 'Q4 FY26', modelType: 'XGBoost', forecastValue: 91.5, lowerBound: 88.5, upperBound: 94.5, actualValue: null, confidenceScore: 0.78, mape: 0 },

    // ── Alaris Annual Shipments (K units) — consent decree ramp tracking ──
    { metricName: 'Alaris Annual Shipments (K)', periodLabel: 'Q3 FY25', modelType: 'Prophet', forecastValue: 55.0, lowerBound: 44.0, upperBound: 66.0, actualValue: 56.0, confidenceScore: 0.78, mape: 1.79 },
    { metricName: 'Alaris Annual Shipments (K)', periodLabel: 'Q4 FY25', modelType: 'Prophet', forecastValue: 58.0, lowerBound: 46.0, upperBound: 70.0, actualValue: 60.0, confidenceScore: 0.80, mape: 3.33 },
    { metricName: 'Alaris Annual Shipments (K)', periodLabel: 'Q1 FY26', modelType: 'Prophet', forecastValue: 65.0, lowerBound: 52.0, upperBound: 78.0, actualValue: 68.0, confidenceScore: 0.82, mape: 4.41 },
    { metricName: 'Alaris Annual Shipments (K)', periodLabel: 'Q2 FY26', modelType: 'Prophet', forecastValue: 72.0, lowerBound: 57.6, upperBound: 86.4, actualValue: 72.0, confidenceScore: 0.83, mape: 0.00 },
    { metricName: 'Alaris Annual Shipments (K)', periodLabel: 'Q3 FY26', modelType: 'Prophet', forecastValue: 78.0, lowerBound: 62.4, upperBound: 93.6, actualValue: null, confidenceScore: 0.80, mape: 0 },
    { metricName: 'Alaris Annual Shipments (K)', periodLabel: 'FY26', modelType: 'Prophet', forecastValue: 75.0, lowerBound: 60.0, upperBound: 90.0, actualValue: null, confidenceScore: 0.78, mape: 0 },

    // ── Net Leverage (x) — 2.9x Q2 FY26; target <2.5x FY2028 ──
    { metricName: 'Net Leverage (x)', periodLabel: 'Q3 FY25', modelType: 'Ensemble', forecastValue: 3.05, lowerBound: 2.90, upperBound: 3.20, actualValue: 3.00, confidenceScore: 0.91, mape: 1.67 },
    { metricName: 'Net Leverage (x)', periodLabel: 'Q4 FY25', modelType: 'Ensemble', forecastValue: 3.00, lowerBound: 2.85, upperBound: 3.15, actualValue: 3.00, confidenceScore: 0.92, mape: 0.00 },
    { metricName: 'Net Leverage (x)', periodLabel: 'Q1 FY26', modelType: 'Ensemble', forecastValue: 2.98, lowerBound: 2.83, upperBound: 3.13, actualValue: 2.95, confidenceScore: 0.91, mape: 1.02 },
    { metricName: 'Net Leverage (x)', periodLabel: 'Q2 FY26', modelType: 'Ensemble', forecastValue: 2.92, lowerBound: 2.77, upperBound: 3.07, actualValue: 2.90, confidenceScore: 0.92, mape: 0.69 },
    { metricName: 'Net Leverage (x)', periodLabel: 'Q3 FY26', modelType: 'Ensemble', forecastValue: 2.84, lowerBound: 2.70, upperBound: 2.98, actualValue: null, confidenceScore: 0.89, mape: 0 },
    { metricName: 'Net Leverage (x)', periodLabel: 'FY26', modelType: 'Ensemble', forecastValue: 2.80, lowerBound: 2.65, upperBound: 2.95, actualValue: null, confidenceScore: 0.87, mape: 0 },

    // ── China VoBP Headwind ($M annual) — monitoring escalation risk ──
    { metricName: 'China VoBP Headwind ($M)', periodLabel: 'Q3 FY25', modelType: 'XGBoost', forecastValue: 128, lowerBound: 108, upperBound: 148, actualValue: 132, confidenceScore: 0.82, mape: 3.03 },
    { metricName: 'China VoBP Headwind ($M)', periodLabel: 'Q4 FY25', modelType: 'XGBoost', forecastValue: 138, lowerBound: 116, upperBound: 160, actualValue: 142, confidenceScore: 0.83, mape: 2.82 },
    { metricName: 'China VoBP Headwind ($M)', periodLabel: 'Q1 FY26', modelType: 'XGBoost', forecastValue: 158, lowerBound: 130, upperBound: 186, actualValue: 160, confidenceScore: 0.81, mape: 1.25 },
    { metricName: 'China VoBP Headwind ($M)', periodLabel: 'Q2 FY26', modelType: 'XGBoost', forecastValue: 160, lowerBound: 130, upperBound: 190, actualValue: 160, confidenceScore: 0.80, mape: 0.00 },
    { metricName: 'China VoBP Headwind ($M)', periodLabel: 'Q3 FY26', modelType: 'XGBoost', forecastValue: 165, lowerBound: 128, upperBound: 202, actualValue: null, confidenceScore: 0.76, mape: 0 },
    { metricName: 'China VoBP Headwind ($M)', periodLabel: 'FY26', modelType: 'XGBoost', forecastValue: 160, lowerBound: 120, upperBound: 235, actualValue: null, confidenceScore: 0.74, mape: 0 },
  ];

  await prisma.forecastResult.createMany({
    data: forecastData.map((f) => ({ companyId, ...f })),
  });
  console.log(`  Seeded ${forecastData.length} BD ML forecast results`);

  // ── Anomaly Detections ─────────────────────────────────────────────────────

  console.log('  Seeding BD anomaly detections...');

  const anomalies = [
    {
      metricName:    'PFS Capacity Utilization (%)',
      detectedAt:    '2026-05-15',
      severity:      'warning',
      direction:     'above_expected',
      actualValue:   88.0,
      expectedValue: 84.0,
      deviationPct:  4.76,
      explanation:   'BioPharma Systems PFS capacity at 88% vs 84% plan. GLP-1 volume +19% YoY driving above-plan utilization. Board authorization for FY2027 capex required this quarter.',
      status:        'new',
      relatedDrivers: ['GLP-1 volume growth', 'PFS manufacturing throughput'],
    },
    {
      metricName:    'Alaris Annual Shipments (K)',
      detectedAt:    '2026-05-15',
      severity:      'info',
      direction:     'below_expected',
      actualValue:   72.0,
      expectedValue: 75.0,
      deviationPct:  -4.0,
      explanation:   'Alaris at 72K annualized vs 75K plan. Within normal seasonal range. 32K unit backlog supports confidence.',
      status:        'acknowledged',
      relatedDrivers: ['Hospital capital budget cycle', 'Alaris consent decree resolution'],
    },
    {
      metricName:    'GAAP Operating Income ($M)',
      detectedAt:    '2026-05-15',
      severity:      'critical',
      direction:     'below_expected',
      actualValue:   601,
      expectedValue: 1082,
      deviationPct:  -44.5,
      explanation:   'GAAP OI $601M vs $1,082M plan. Entire variance from $450M goodwill impairment (Connected Care) + $85M restructuring. Adjusted OI $1,178M above plan.',
      status:        'resolved',
      relatedDrivers: ['Goodwill impairment Connected Care', 'Restructuring charges'],
    },
    {
      metricName:    'China VoBP Headwind ($M)',
      detectedAt:    '2026-05-15',
      severity:      'info',
      direction:     'above_expected',
      actualValue:   80,
      expectedValue: 80,
      deviationPct:  0.06,
      explanation:   'China VoBP H1 headwind $80M on track with $160M FY plan. No additional waves announced. Watch NHSA Q4 FY2026 cycle.',
      status:        'acknowledged',
      relatedDrivers: ['China VoBP tender waves', 'Medical Essentials China mix-shift'],
    },
    {
      metricName:    'FX Translation Headwind ($M)',
      detectedAt:    '2026-05-15',
      severity:      'info',
      direction:     'above_expected',
      actualValue:   116,
      expectedValue: 115,
      deviationPct:  0.87,
      explanation:   'H1 FX headwind $116M vs $115M pace on $230M annual plan. EUR/USD 1.082 vs plan 1.075. No guidance risk.',
      status:        'resolved',
      relatedDrivers: ['EUR/USD rate', 'CNY translation'],
    },
    {
      metricName:    'Net Leverage (x)',
      detectedAt:    '2026-05-15',
      severity:      'info',
      direction:     'below_expected',
      actualValue:   2.90,
      expectedValue: 2.95,
      deviationPct:  -1.69,
      explanation:   'Net leverage 2.9x vs 2.95x plan. Above-plan FCF conversion (96% vs 95%) driving outperformance. Confirms 2.5x FY2028 target on track.',
      status:        'acknowledged',
      relatedDrivers: ['FCF conversion rate', 'Gross debt retirement pace'],
    },
  ];

  await prisma.anomalyDetection.createMany({
    data: anomalies.map((a) => ({ companyId, ...a })),
  });
  console.log(`  Seeded ${anomalies.length} BD anomaly detections`);

  console.log('BD Analytics Products seed complete');
}