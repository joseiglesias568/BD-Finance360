import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed In-Cycle Estimates: Current period tracking for BD EPM
// Layer 4: EPM — In-Cycle Reporting
//
// BD FY ends September 30. Current quarter is Q3 FY26 (Apr 1 – Jun 30, 2026).
// Today is July 17, 2026 — Q3 FY26 just closed (day 107 of 91, close in progress).
// Q2 FY26 actual values: Revenue $4,714M, Adj. EPS $3.50, Adj. OI $1,178M.
// FY2026 guidance: Adj. EPS $12.52–$12.72, adj. op. margin ~25%, revenue ~$18.0B
// H1 FY26 adj. EPS: $6.85 (Q1 $3.35 + Q2 $3.50)
// Q3 FY26 estimates based on quarter-end close in progress.
// =============================================================================

export async function seedInCycleEstimates(prisma: PrismaClient, companyId: number) {
  // Delete existing records before creating new ones
  await prisma.inCycleEstimate.deleteMany({ where: { companyId } });

  console.log('  Seeding BD in-cycle estimates...');

  const estimates = [
    // ── Revenue ($M) ──────────────────────────────────────────────────────────
    {
      periodLabel:        'Q3 FY26',
      metricName:         'Revenue',
      mtdActual:          4754,          // Q3 FY26 close-in-progress estimate ($M); Apr-Jun 2026
      qtdActual:          4754,
      flashEstimate:      4758,          // Flash estimate as of close; CC growth +7.0% implies $4,758M at plan FX
      forecastValue:      4760,          // Official Q3 FY26 forecast ($M); seasonal lift from hospital capital
      budgetValue:        4740,          // Budget/plan for Q3 FY26 set at FY2026 planning
      priorYearActual:    4664,          // Q3 FY25 actual revenue ($M)
      daysThroughPeriod:  91,
      totalDaysInPeriod:  91,
    },

    // ── Adjusted Operating Income ($M) ────────────────────────────────────────
    {
      periodLabel:        'Q3 FY26',
      metricName:         'Adjusted Operating Income',
      mtdActual:          1162,          // Q3 FY26 adj. OI close estimate ($M); ~24.4% adj. margin
      qtdActual:          1162,
      flashEstimate:      1164,          // Flash to close; below Q2 seasonally (hospital capital mix)
      forecastValue:      1165,          // Official Q3 FY26 adj. OI forecast ($M)
      budgetValue:        1185,          // Budget baseline ($M)
      priorYearActual:    1157,          // Q3 FY25 actual adj. OI ($M)
      daysThroughPeriod:  91,
      totalDaysInPeriod:  91,
    },

    // ── Adjusted EPS ($) ──────────────────────────────────────────────────────
    {
      periodLabel:        'Q3 FY26',
      metricName:         'Adjusted EPS',
      mtdActual:          3.08,          // Q3 FY26 adj. EPS close estimate ($); Q3 seasonally lower on mixed segment
      qtdActual:          3.08,
      flashEstimate:      3.08,          // Flash Q3 EPS
      forecastValue:      3.08,          // Official Q3 FY26 Adj. EPS forecast; H1+Q3 = $9.93, H2 needs ~$2.68 more
      budgetValue:        3.14,          // Budget baseline; slightly above due to Alaris ramp expectations
      priorYearActual:    3.28,          // Q3 FY25 actual Adj. EPS
      daysThroughPeriod:  91,
      totalDaysInPeriod:  91,
    },

    // ── BioPharma Systems Revenue ($M) ────────────────────────────────────────
    {
      periodLabel:        'Q3 FY26',
      metricName:         'BioPharma Systems Revenue',
      mtdActual:          1195,          // Q3 FY26 BioPharma close estimate ($M); GLP-1 +19% CC continuing
      qtdActual:          1195,
      flashEstimate:      1196,
      forecastValue:      1200,          // Official Q3 FY26 forecast ($M)
      budgetValue:        1180,          // Budget baseline
      priorYearActual:    1058,          // Q3 FY25 actual BioPharma Systems revenue ($M)
      daysThroughPeriod:  91,
      totalDaysInPeriod:  91,
    },

    // ── Connected Care Revenue ($M) ───────────────────────────────────────────
    {
      periodLabel:        'Q3 FY26',
      metricName:         'Connected Care Revenue',
      mtdActual:          548,           // Q3 close estimate ($M); Alaris hospital capital Q3 lift
      qtdActual:          548,
      flashEstimate:      549,
      forecastValue:      550,           // Official Q3 forecast; hospital capital budget release seasonality
      budgetValue:        540,           // Budget baseline
      priorYearActual:    495,           // Q3 FY25 actual
      daysThroughPeriod:  91,
      totalDaysInPeriod:  91,
    },

    // ── Medical Essentials Revenue ($M) ──────────────────────────────────────
    {
      periodLabel:        'Q3 FY26',
      metricName:         'Medical Essentials Revenue',
      mtdActual:          1628,          // Q3 close estimate ($M); stable +4% CC; no new VoBP waves
      qtdActual:          1628,
      flashEstimate:      1630,
      forecastValue:      1632,          // Official Q3 forecast
      budgetValue:        1620,          // Budget baseline
      priorYearActual:    1597,          // Q3 FY25 actual
      daysThroughPeriod:  91,
      totalDaysInPeriod:  91,
    },

    // ── Interventional Revenue ($M) ───────────────────────────────────────────
    {
      periodLabel:        'Q3 FY26',
      metricName:         'Interventional Revenue',
      mtdActual:          1440,          // Q3 close estimate ($M); +5.8% CC; procedure volume growth
      qtdActual:          1440,
      flashEstimate:      1441,
      forecastValue:      1442,          // Official Q3 forecast
      budgetValue:        1430,          // Budget baseline
      priorYearActual:    1368,          // Q3 FY25 actual
      daysThroughPeriod:  91,
      totalDaysInPeriod:  91,
    },

    // ── FX Translation Headwind ($M annual run-rate) ──────────────────────────
    {
      periodLabel:        'Q3 FY26',
      metricName:         'FX Translation Headwind',
      mtdActual:          176,           // H1+Q3 cumulative headwind through Q3 FY26 ($M); Q3 ~$60M
      qtdActual:          176,
      flashEstimate:      178,
      forecastValue:      230,           // Full-year FX headwind forecast ($M) — maintained at plan
      budgetValue:        230,           // Budget baseline ($M)
      priorYearActual:    185,           // Q3 FY25 cumulative H1+Q3 FX headwind ($M)
      daysThroughPeriod:  91,
      totalDaysInPeriod:  91,
    },

    // ── Net Leverage (x) ──────────────────────────────────────────────────────
    {
      periodLabel:        'Q3 FY26',
      metricName:         'Net Leverage',
      mtdActual:          2.84,          // Q3 FY26 estimated net leverage; improving from 2.9x Q2
      qtdActual:          2.84,
      flashEstimate:      2.84,
      forecastValue:      2.82,          // Official Q3 FY26 leverage forecast
      budgetValue:        2.85,          // Budget baseline
      priorYearActual:    3.00,          // Q3 FY25 actual leverage
      daysThroughPeriod:  91,
      totalDaysInPeriod:  91,
    },

    // ── Alaris Pump Shipments (K annualized) ──────────────────────────────────
    {
      periodLabel:        'Q3 FY26',
      metricName:         'Alaris Pump Shipments (K annualized)',
      mtdActual:          78,            // Q3 FY26 annualized pace: hospital capital Q3 lift adds ~20K units
      qtdActual:          78,
      flashEstimate:      78,
      forecastValue:      80,            // Official Q3 forecast; hospital capital budget release
      budgetValue:        82,            // Budget (hospital capital Q3 peak seasonal)
      priorYearActual:    56,            // Q3 FY25 annualized pace
      daysThroughPeriod:  91,
      totalDaysInPeriod:  91,
    },
  ];

  await prisma.inCycleEstimate.createMany({
    data: estimates.map((e) => ({ companyId, ...e })),
  });

  console.log(`  Seeded ${estimates.length} BD in-cycle estimates for Q3 FY26`);
}
