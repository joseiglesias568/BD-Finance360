import { PrismaClient } from '@prisma/client';

// SOURCE: Becton, Dickinson and Company (BDX) — Q2 FY2026 earnings (May 2026),
// FY2025 10-K (filed Nov 2025).
// BD uses a fiscal year ending September 30.
// Q1 = Oct–Dec, Q2 = Jan–Mar, Q3 = Apr–Jun, Q4 = Jul–Sep.
// Seed periods: Q1 FY24 through Q2 FY26 as actuals (10 quarters).
// BD fiscal year mapping:
//   FY2024: Oct 2023 – Sep 2024
//   FY2025: Oct 2024 – Sep 2025
//   FY2026: Oct 2025 – Sep 2026 (in progress)

export async function seedFiscalPeriods(prisma: PrismaClient, companyId: number) {
  const periods = [
    // FY2024
    { label: 'Q1 FY24', year: 2024, quarter: 1, type: 'quarter' },
    { label: 'Q2 FY24', year: 2024, quarter: 2, type: 'quarter' },
    { label: 'Q3 FY24', year: 2024, quarter: 3, type: 'quarter' },
    { label: 'Q4 FY24', year: 2024, quarter: 4, type: 'quarter' },
    { label: 'FY24',    year: 2024, quarter: null, type: 'annual' },
    // FY2025
    { label: 'Q1 FY25', year: 2025, quarter: 1, type: 'quarter' },
    { label: 'Q2 FY25', year: 2025, quarter: 2, type: 'quarter' },
    { label: 'Q3 FY25', year: 2025, quarter: 3, type: 'quarter' },
    { label: 'Q4 FY25', year: 2025, quarter: 4, type: 'quarter' },
    { label: 'FY25',    year: 2025, quarter: null, type: 'annual' },
    // FY2026 (in progress)
    { label: 'Q1 FY26', year: 2026, quarter: 1, type: 'quarter' },
    { label: 'Q2 FY26', year: 2026, quarter: 2, type: 'quarter' },
  ];

  const periodMap: Record<string, { id: number }> = {};

  for (const period of periods) {
    const created = await prisma.fiscalPeriod.create({
      data: {
        companyId,
        label: period.label,
        year: period.year,
        quarter: period.quarter,
        type: period.type,
      },
    });
    periodMap[period.label] = { id: created.id };
  }

  console.log(`Seeded ${periods.length} fiscal periods (Q1 FY24 through Q2 FY26)`);

  return periodMap;
}
