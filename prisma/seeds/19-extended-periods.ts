import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed 19: Extended Fiscal Periods — Becton, Dickinson and Company (BDX)
//
// BD FY ends September 30. BD quarterly calendar:
//   Q1 = Oct–Dec   Q2 = Jan–Mar   Q3 = Apr–Jun   Q4 = Jul–Sep
//
// Creates FiscalPeriod, QuarterlyResult, FinancialStatement, SegmentResult,
// RevenueBridgeItem, and KPIValue records for 14 periods.
//
// Revenue values in $M (not $B). Segments:
//   Medical Essentials | Connected Care | BioPharma Systems | Interventional
//
// Periods created:
//   Q1–Q4 FY24 actuals, FY24 annual, Q1–Q4 FY25 actuals, Q1–Q2 FY26 actuals,
//   Q3–Q4 FY26 forecasts, Q1–Q2 FY27 forecasts
//
// Returns periodMap used by 20-monthly-financials.ts.
// =============================================================================

// ─── Period label → key metadata ─────────────────────────────────────────────

const PERIOD_DEFS: Array<{
  label: string;
  year: number;
  quarter: number | null;
  type: string;
}> = [
  // FY24 history (actuals)
  { label: 'Q1 FY24', year: 2024, quarter: 1, type: 'quarter' }, // Oct-Dec 2023
  { label: 'Q2 FY24', year: 2024, quarter: 2, type: 'quarter' }, // Jan-Mar 2024
  { label: 'Q3 FY24', year: 2024, quarter: 3, type: 'quarter' }, // Apr-Jun 2024
  { label: 'Q4 FY24', year: 2024, quarter: 4, type: 'quarter' }, // Jul-Sep 2024
  { label: 'FY24',    year: 2024, quarter: null, type: 'annual' },
  // FY25 history (actuals)
  { label: 'Q1 FY25', year: 2025, quarter: 1, type: 'quarter' }, // Oct-Dec 2024
  { label: 'Q2 FY25', year: 2025, quarter: 2, type: 'quarter' }, // Jan-Mar 2025
  { label: 'Q3 FY25', year: 2025, quarter: 3, type: 'quarter' }, // Apr-Jun 2025
  { label: 'Q4 FY25', year: 2025, quarter: 4, type: 'quarter' }, // Jul-Sep 2025
  // FY26 (Q1-Q2 actuals, Q3-Q4 forecast)
  { label: 'Q1 FY26', year: 2026, quarter: 1, type: 'quarter' }, // Oct-Dec 2025
  { label: 'Q2 FY26', year: 2026, quarter: 2, type: 'quarter' }, // Jan-Mar 2026
  { label: 'Q3 FY26', year: 2026, quarter: 3, type: 'quarter' }, // Apr-Jun 2026
  { label: 'Q4 FY26', year: 2026, quarter: 4, type: 'quarter' }, // Jul-Sep 2026 (forecast)
  // FY27 (forecast)
  { label: 'Q1 FY27', year: 2027, quarter: 1, type: 'quarter' }, // Oct-Dec 2026 (forecast)
  { label: 'Q2 FY27', year: 2027, quarter: 2, type: 'quarter' }, // Jan-Mar 2027 (forecast)
];

const ALL_PERIOD_LABELS = PERIOD_DEFS.map((p) => p.label);

// ─── Quarterly Results (in $M; compStoreSales = adj. op. margin %; netNewStores = Alaris K) ──

const quarterlyResults: Array<{
  period:           string;
  revenue:          number;
  revenueYoY:       number;
  operatingIncome:  number;
  operatingMargin:  number;
  eps:              number;
  compStoreSales:   number; // repurposed: adj. operating margin (%)
  netNewStores:     number; // repurposed: Alaris annualized shipments (K) or 0 if not relevant
}> = [
  {
    period: 'Q1 FY24', // Oct-Dec 2023 — pre-Waters; BD legacy full company
    revenue: 3909, revenueYoY: 3.0, operatingIncome: 865, operatingMargin: 22.1,
    eps: 3.12, compStoreSales: 24.8, netNewStores: 52,
  },
  {
    period: 'Q2 FY24', // Jan-Mar 2024
    revenue: 4106, revenueYoY: 3.8, operatingIncome: 940, operatingMargin: 22.9,
    eps: 3.28, compStoreSales: 25.0, netNewStores: 54,
  },
  {
    period: 'Q3 FY24', // Apr-Jun 2024
    revenue: 4216, revenueYoY: 4.5, operatingIncome: 975, operatingMargin: 23.1,
    eps: 3.38, compStoreSales: 25.2, netNewStores: 56,
  },
  {
    period: 'Q4 FY24', // Jul-Sep 2024 — FY24 close
    revenue: 4224, revenueYoY: 4.5, operatingIncome: 985, operatingMargin: 23.3,
    eps: 3.44, compStoreSales: 25.5, netNewStores: 58,
  },
  {
    period: 'Q1 FY25', // Oct-Dec 2024
    revenue: 4438, revenueYoY: 6.6, operatingIncome: 1068, operatingMargin: 24.1,
    eps: 3.22, compStoreSales: 25.8, netNewStores: 58,
  },
  {
    period: 'Q2 FY25', // Jan-Mar 2025
    revenue: 4579, revenueYoY: 5.4, operatingIncome: 1108, operatingMargin: 24.2,
    eps: 3.35, compStoreSales: 25.9, netNewStores: 60,
  },
  {
    period: 'Q3 FY25', // Apr-Jun 2025 — GLP-1 growth accelerating
    revenue: 4664, revenueYoY: 5.4, operatingIncome: 1157, operatingMargin: 24.8,
    eps: 3.28, compStoreSales: 26.0, netNewStores: 56,
  },
  {
    period: 'Q4 FY25', // Jul-Sep 2025 — FY25 close; Waters spin announced
    revenue: 4685, revenueYoY: 4.8, operatingIncome: 1169, operatingMargin: 24.9,
    eps: 3.38, compStoreSales: 26.1, netNewStores: 62,
  },
  {
    period: 'Q1 FY26', // Oct-Dec 2025 — Waters spin completed Feb 2026; continuing ops basis
    revenue: 4486, revenueYoY: 1.1, operatingIncome: 1116, operatingMargin: 24.9,
    eps: 3.35, compStoreSales: 24.8, netNewStores: 68,
  },
  {
    period: 'Q2 FY26', // Jan-Mar 2026 — ACTUAL; $450M CC goodwill impairment (non-cash, non-adj)
    revenue: 4714, revenueYoY: 2.9, operatingIncome: 1178, operatingMargin: 25.0,
    eps: 3.50, compStoreSales: 25.0, netNewStores: 72,
  },
  {
    period: 'Q3 FY26', // Apr-Jun 2026 — CLOSE IN PROGRESS; hospital capital Q3 lift
    revenue: 4760, revenueYoY: 2.1, operatingIncome: 1162, operatingMargin: 24.4,
    eps: 3.08, compStoreSales: 24.4, netNewStores: 78,
  },
  {
    period: 'Q4 FY26', // Jul-Sep 2026 — FORECAST; Alaris ramp, BioPharma year-end
    revenue: 4805, revenueYoY: 2.6, operatingIncome: 1213, operatingMargin: 25.2,
    eps: 3.28, compStoreSales: 25.2, netNewStores: 86,
  },
  {
    period: 'Q1 FY27', // Oct-Dec 2026 — FORECAST; consent decree petition filed
    revenue: 4850, revenueYoY: 8.1, operatingIncome: 1262, operatingMargin: 26.0,
    eps: 3.58, compStoreSales: 26.0, netNewStores: 90,
  },
  {
    period: 'Q2 FY27', // Jan-Mar 2027 — FORECAST; full GLP-1 new capacity benefit
    revenue: 5020, revenueYoY: 6.5, operatingIncome: 1333, operatingMargin: 26.5,
    eps: 3.78, compStoreSales: 26.5, netNewStores: 95,
  },
];

// ─── Financial Statements (P&L lines in $M) ───────────────────────────────────
// BD cost structure:
//   COGS: ~50–52% of revenue (consumables, hardware, drug delivery components)
//   SG&A: ~22–24% of revenue
//   R&D:  ~6% of revenue
//   Adj. OI: ~24–25% margin; GAAP OI lower (D&A $615M/Q, Alaris remediation, amortization)

const plData: Array<{
  period: string;
  lines: Array<{
    lineItem: string; label: string;
    actual: number; plan: number; priorYear: number;
    variance: number; variancePercent: number;
  }>;
}> = [
  {
    period: 'Q1 FY24',
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 3909,  plan: 3850,  priorYear: 3795,  variance: 59,   variancePercent: 1.5  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2005,  plan: 1978,  priorYear: 1945,  variance: -27,  variancePercent: -1.4 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 1904,  plan: 1872,  priorYear: 1850,  variance: 32,   variancePercent: 1.7  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1039,  plan: 1025,  priorYear: 1010,  variance: -14,  variancePercent: -1.4 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 865,  plan: 847,  priorYear: 840,  variance: 18,   variancePercent: 2.1  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 678,   plan: 665,   priorYear: 658,   variance: 13,   variancePercent: 2.0  },
    ],
  },
  {
    period: 'Q2 FY24',
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 4106,  plan: 4050,  priorYear: 3957,  variance: 56,   variancePercent: 1.4  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2101,  plan: 2074,  priorYear: 2024,  variance: -27,  variancePercent: -1.3 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 2005,  plan: 1976,  priorYear: 1933,  variance: 29,   variancePercent: 1.5  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1065,  plan: 1052,  priorYear: 1032,  variance: -13,  variancePercent: -1.2 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 940,  plan: 924,  priorYear: 901,  variance: 16,   variancePercent: 1.7  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 717,   plan: 703,   priorYear: 688,   variance: 14,   variancePercent: 2.0  },
    ],
  },
  {
    period: 'Q3 FY24',
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 4216,  plan: 4160,  priorYear: 4034,  variance: 56,   variancePercent: 1.3  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2153,  plan: 2124,  priorYear: 2062,  variance: -29,  variancePercent: -1.4 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 2063,  plan: 2036,  priorYear: 1972,  variance: 27,   variancePercent: 1.3  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1088,  plan: 1073,  priorYear: 1044,  variance: -15,  variancePercent: -1.4 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 975,  plan: 963,  priorYear: 928,  variance: 12,   variancePercent: 1.2  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 737,   plan: 727,   priorYear: 703,   variance: 10,   variancePercent: 1.4  },
    ],
  },
  {
    period: 'Q4 FY24',
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 4224,  plan: 4180,  priorYear: 4042,  variance: 44,   variancePercent: 1.1  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2158,  plan: 2135,  priorYear: 2067,  variance: -23,  variancePercent: -1.1 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 2066,  plan: 2045,  priorYear: 1975,  variance: 21,   variancePercent: 1.0  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1081,  plan: 1068,  priorYear: 1048,  variance: -13,  variancePercent: -1.2 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 985,  plan: 977,  priorYear: 927,  variance: 8,    variancePercent: 0.8  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 744,   plan: 738,   priorYear: 703,   variance: 6,    variancePercent: 0.8  },
    ],
  },
  {
    period: 'FY24',
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 16455, plan: 16240, priorYear: 15828, variance: 215,  variancePercent: 1.3  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 8417,  plan: 8311,  priorYear: 8098,  variance: -106, variancePercent: -1.3 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 8038,  plan: 7929,  priorYear: 7730,  variance: 109,  variancePercent: 1.4  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 4273,  plan: 4218,  priorYear: 4134,  variance: -55,  variancePercent: -1.3 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 3765, plan: 3711, priorYear: 3596, variance: 54,  variancePercent: 1.5  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 2876,  plan: 2833,  priorYear: 2752,  variance: 43,   variancePercent: 1.5  },
    ],
  },
  {
    period: 'Q1 FY25',
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 4438,  plan: 4380,  priorYear: 3909,  variance: 58,   variancePercent: 1.3  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2261,  plan: 2228,  priorYear: 2005,  variance: -33,  variancePercent: -1.5 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 2177,  plan: 2152,  priorYear: 1904,  variance: 25,   variancePercent: 1.2  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1109,  plan: 1096,  priorYear: 1039,  variance: -13,  variancePercent: -1.2 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 1068, plan: 1056, priorYear: 865, variance: 12,   variancePercent: 1.1  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 811,   plan: 802,   priorYear: 678,   variance: 9,    variancePercent: 1.1  },
    ],
  },
  {
    period: 'Q2 FY25',
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 4579,  plan: 4520,  priorYear: 4106,  variance: 59,   variancePercent: 1.3  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2328,  plan: 2294,  priorYear: 2101,  variance: -34,  variancePercent: -1.5 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 2251,  plan: 2226,  priorYear: 2005,  variance: 25,   variancePercent: 1.1  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1143,  plan: 1131,  priorYear: 1065,  variance: -12,  variancePercent: -1.1 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 1108, plan: 1095, priorYear: 940, variance: 13,   variancePercent: 1.2  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 839,   plan: 829,   priorYear: 717,   variance: 10,   variancePercent: 1.2  },
    ],
  },
  {
    period: 'Q3 FY25',
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 4664,  plan: 4600,  priorYear: 4216,  variance: 64,   variancePercent: 1.4  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2365,  plan: 2332,  priorYear: 2153,  variance: -33,  variancePercent: -1.4 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 2299,  plan: 2268,  priorYear: 2063,  variance: 31,   variancePercent: 1.4  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1142,  plan: 1130,  priorYear: 1088,  variance: -12,  variancePercent: -1.1 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 1157, plan: 1138, priorYear: 975, variance: 19,   variancePercent: 1.7  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 875,   plan: 861,   priorYear: 737,   variance: 14,   variancePercent: 1.6  },
    ],
  },
  {
    period: 'Q4 FY25',
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 4685,  plan: 4640,  priorYear: 4224,  variance: 45,   variancePercent: 1.0  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2374,  plan: 2351,  priorYear: 2158,  variance: -23,  variancePercent: -1.0 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 2311,  plan: 2289,  priorYear: 2066,  variance: 22,   variancePercent: 1.0  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1142,  plan: 1131,  priorYear: 1081,  variance: -11,  variancePercent: -1.0 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 1169, plan: 1158, priorYear: 985, variance: 11,   variancePercent: 1.0  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 884,   plan: 876,   priorYear: 744,   variance: 8,    variancePercent: 0.9  },
    ],
  },
  {
    period: 'Q1 FY26',
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 4486,  plan: 4450,  priorYear: 4438,  variance: 36,   variancePercent: 0.8  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2275,  plan: 2255,  priorYear: 2261,  variance: -20,  variancePercent: -0.9 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 2211,  plan: 2195,  priorYear: 2177,  variance: 16,   variancePercent: 0.7  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1095,  plan: 1088,  priorYear: 1109,  variance: -7,   variancePercent: -0.6 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 1116, plan: 1107, priorYear: 1068, variance: 9,  variancePercent: 0.8  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 843,   plan: 836,   priorYear: 811,   variance: 7,    variancePercent: 0.8  },
    ],
  },
  {
    period: 'Q2 FY26', // ACTUAL — $450M goodwill impairment excluded from adj. figures
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 4714,  plan: 4660,  priorYear: 4579,  variance: 54,   variancePercent: 1.2  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2386,  plan: 2355,  priorYear: 2328,  variance: -31,  variancePercent: -1.3 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 2328,  plan: 2305,  priorYear: 2251,  variance: 23,   variancePercent: 1.0  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1150,  plan: 1143,  priorYear: 1143,  variance: -7,   variancePercent: -0.6 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 1178, plan: 1162, priorYear: 1108, variance: 16,  variancePercent: 1.4  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 893,   plan: 880,   priorYear: 839,   variance: 13,   variancePercent: 1.5  },
    ],
  },
  {
    period: 'Q3 FY26', // CLOSE IN PROGRESS — Q3 close actuals ~July 17, 2026
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 4760,  plan: 4740,  priorYear: 4664,  variance: 20,   variancePercent: 0.4  },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 2423,  plan: 2413,  priorYear: 2365,  variance: -10,  variancePercent: -0.4 },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 2337,  plan: 2327,  priorYear: 2299,  variance: 10,   variancePercent: 0.4  },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 1175,  plan: 1170,  priorYear: 1142,  variance: -5,   variancePercent: -0.4 },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 1162, plan: 1157, priorYear: 1157, variance: 5,   variancePercent: 0.4  },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 878,   plan: 875,   priorYear: 875,   variance: 3,    variancePercent: 0.3  },
    ],
  },
  {
    period: 'Q4 FY26', // FORECAST
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 0,     plan: 4800,  priorYear: 4685,  variance: 0,    variancePercent: 0    },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 0,     plan: 2430,  priorYear: 2374,  variance: 0,    variancePercent: 0    },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 0,     plan: 2370,  priorYear: 2311,  variance: 0,    variancePercent: 0    },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 0,     plan: 1157,  priorYear: 1142,  variance: 0,    variancePercent: 0    },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 0, plan: 1213,  priorYear: 1169,  variance: 0,    variancePercent: 0    },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 0,     plan: 918,   priorYear: 884,   variance: 0,    variancePercent: 0    },
    ],
  },
  {
    period: 'Q1 FY27', // FORECAST
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 0,     plan: 4850,  priorYear: 4486,  variance: 0,    variancePercent: 0    },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 0,     plan: 2449,  priorYear: 2275,  variance: 0,    variancePercent: 0    },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 0,     plan: 2401,  priorYear: 2211,  variance: 0,    variancePercent: 0    },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 0,     plan: 1139,  priorYear: 1095,  variance: 0,    variancePercent: 0    },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 0, plan: 1262,  priorYear: 1116,  variance: 0,    variancePercent: 0    },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 0,     plan: 954,   priorYear: 843,   variance: 0,    variancePercent: 0    },
    ],
  },
  {
    period: 'Q2 FY27', // FORECAST
    lines: [
      { lineItem: 'revenue',           label: 'Total Net Revenues ($M)',    actual: 0,     plan: 5020,  priorYear: 4714,  variance: 0,    variancePercent: 0    },
      { lineItem: 'cogs',              label: 'Cost of Products Sold ($M)', actual: 0,     plan: 2535,  priorYear: 2386,  variance: 0,    variancePercent: 0    },
      { lineItem: 'grossProfit',       label: 'Gross Profit ($M)',          actual: 0,     plan: 2485,  priorYear: 2328,  variance: 0,    variancePercent: 0    },
      { lineItem: 'operatingExpenses', label: 'SG&A + R&D ($M)',            actual: 0,     plan: 1152,  priorYear: 1150,  variance: 0,    variancePercent: 0    },
      { lineItem: 'operatingIncome',   label: 'Adjusted Operating Income ($M)', actual: 0, plan: 1333,  priorYear: 1178,  variance: 0,    variancePercent: 0    },
      { lineItem: 'netIncome',         label: 'Adjusted Net Income ($M)',   actual: 0,     plan: 1007,  priorYear: 893,   variance: 0,    variancePercent: 0    },
    ],
  },
];

// ─── Segment Results ──────────────────────────────────────────────────────────
// Revenue in $M. BD four-segment structure.
// Historical segment split context:
//   Medical Essentials: ~38% of revenue (~$1,470–1,790M per quarter)
//   Connected Care:     ~13–14% (~$500–660M per quarter)
//   BioPharma Systems:  ~25–27% (~$975–1,270M per quarter; GLP-1 driving rapid growth)
//   Interventional:     ~25–26% (~$975–1,235M per quarter)

const segmentData: Array<{
  period: string;
  me: { rev: number; yoy: number; margin: number };
  cc: { rev: number; yoy: number; margin: number };
  bps: { rev: number; yoy: number; margin: number };
  int: { rev: number; yoy: number; margin: number };
}> = [
  {
    period: 'Q1 FY24',
    me:  { rev: 1485, yoy: 2.5, margin: 22.0 },
    cc:  { rev: 585,  yoy: -1.5, margin: 12.0 },
    bps: { rev: 838,  yoy: 8.5, margin: 34.5 },
    int: { rev: 1001, yoy: 4.2, margin: 24.2 },
  },
  {
    period: 'Q2 FY24',
    me:  { rev: 1565, yoy: 3.0, margin: 22.5 },
    cc:  { rev: 610,  yoy: -1.0, margin: 12.5 },
    bps: { rev: 895,  yoy: 9.5, margin: 35.0 },
    int: { rev: 1036, yoy: 4.5, margin: 24.5 },
  },
  {
    period: 'Q3 FY24',
    me:  { rev: 1595, yoy: 3.5, margin: 22.8 },
    cc:  { rev: 620,  yoy: -0.5, margin: 13.0 },
    bps: { rev: 952,  yoy: 10.5, margin: 35.5 },
    int: { rev: 1049, yoy: 5.0, margin: 25.0 },
  },
  {
    period: 'Q4 FY24',
    me:  { rev: 1575, yoy: 3.2, margin: 23.0 },
    cc:  { rev: 625,  yoy: 0.5, margin: 13.5 },
    bps: { rev: 978,  yoy: 11.2, margin: 36.0 },
    int: { rev: 1046, yoy: 5.2, margin: 25.5 },
  },
  {
    period: 'Q1 FY25',
    me:  { rev: 1620, yoy: 4.0, margin: 23.2 },
    cc:  { rev: 590,  yoy: 0.8, margin: 12.8 },
    bps: { rev: 1042, yoy: 12.0, margin: 36.5 },
    int: { rev: 1186, yoy: 5.5, margin: 25.8 },
  },
  {
    period: 'Q2 FY25',
    me:  { rev: 1680, yoy: 4.0, margin: 23.5 },
    cc:  { rev: 600,  yoy: -1.6, margin: 12.0 },
    bps: { rev: 1075, yoy: 13.5, margin: 37.0 },
    int: { rev: 1224, yoy: 5.8, margin: 26.0 },
  },
  {
    period: 'Q3 FY25',
    me:  { rev: 1597, yoy: 3.5, margin: 23.8 },
    cc:  { rev: 495,  yoy: 3.5, margin: 12.5 },
    bps: { rev: 1158, yoy: 14.5, margin: 37.5 },
    int: { rev: 1368, yoy: 6.2, margin: 26.5 },
  },
  {
    period: 'Q4 FY25',
    me:  { rev: 1608, yoy: 3.2, margin: 24.0 },
    cc:  { rev: 512,  yoy: 5.0, margin: 13.0 },
    bps: { rev: 1172, yoy: 14.8, margin: 38.0 },
    int: { rev: 1393, yoy: 6.5, margin: 27.0 },
  },
  {
    period: 'Q1 FY26',
    me:  { rev: 1622, yoy: 0.1, margin: 23.0 },
    cc:  { rev: 536,  yoy: 0.2, margin: 12.2 },
    bps: { rev: 1125, yoy: 3.0, margin: 37.8 },
    int: { rev: 1203, yoy: 0.8, margin: 25.5 },
  },
  {
    period: 'Q2 FY26',
    me:  { rev: 1669, yoy: 2.0, margin: 23.5 },
    cc:  { rev: 535,  yoy: 3.0, margin: 10.5 }, // CC margin impacted by $450M GW impairment (excluded from adj.)
    bps: { rev: 1178, yoy: 8.5, margin: 38.5 },
    int: { rev: 1332, yoy: 2.2, margin: 26.0 },
  },
  {
    period: 'Q3 FY26',
    me:  { rev: 1628, yoy: 1.9, margin: 23.5 },
    cc:  { rev: 548,  yoy: 10.7, margin: 13.5 },
    bps: { rev: 1195, yoy: 3.2, margin: 38.8 },
    int: { rev: 1440, yoy: 5.3, margin: 26.5 },
  },
  {
    period: 'Q4 FY26',
    me:  { rev: 1650, yoy: 2.6, margin: 24.0 },
    cc:  { rev: 578,  yoy: 12.9, margin: 15.0 },
    bps: { rev: 1240, yoy: 5.8, margin: 39.2 },
    int: { rev: 1337, yoy: -4.0, margin: 26.8 }, // Q4 FY26 slightly lower Interventional on timing
  },
  {
    period: 'Q1 FY27',
    me:  { rev: 1690, yoy: 4.2, margin: 24.2 },
    cc:  { rev: 608,  yoy: 13.4, margin: 16.5 }, // Alaris ramp: consent decree resolution H2 FY27
    bps: { rev: 1320, yoy: 17.3, margin: 39.5 }, // GLP-1 new capacity benefit starting
    int: { rev: 1232, yoy: 2.4, margin: 27.0 },
  },
  {
    period: 'Q2 FY27',
    me:  { rev: 1720, yoy: 3.1, margin: 24.5 },
    cc:  { rev: 638,  yoy: 19.3, margin: 17.5 }, // Alaris full market re-entry
    bps: { rev: 1380, yoy: 17.1, margin: 40.0 }, // GLP-1 capacity fully contributing
    int: { rev: 1282, yoy: -3.8, margin: 27.2 }, // prior year EP catheter acquisition lapping effect
  },
];

// ─── Revenue Bridge Items ─────────────────────────────────────────────────────
// Bridge from prior year same period to current period (impact in $M).

const bridgeData: Array<{
  period: string;
  items: Array<{ label: string; impact: number; category: string }>;
}> = [
  {
    period: 'Q1 FY24',
    items: [
      { label: 'BioPharma Systems GLP-1 Volume Growth (+8.5% CC)',                 impact: 66,   category: 'volume'  },
      { label: 'Medical Essentials U.S. Volume Growth (+3.0% CC)',                 impact: 44,   category: 'volume'  },
      { label: 'Interventional Procedure Volume Recovery (+4.2% CC)',              impact: 40,   category: 'volume'  },
      { label: 'China VoBP Revenue Headwind (Medical Essentials)',                 impact: -42,  category: 'mix'     },
      { label: 'Alaris Consent Decree — Market Access Restriction (Connected Care)', impact: -28, category: 'mix'   },
      { label: 'FX Translation Headwind (EUR/JPY/CNY)',                            impact: -55,  category: 'fx'      },
      { label: 'Net Pricing Realization (+1.8% blended)',                          impact: 90,   category: 'pricing' },
    ],
  },
  {
    period: 'Q2 FY24',
    items: [
      { label: 'BioPharma Systems GLP-1 Volume Growth (+9.5% CC)',                 impact: 78,   category: 'volume'  },
      { label: 'Medical Essentials U.S. Volume Growth (+3.0% CC)',                 impact: 48,   category: 'volume'  },
      { label: 'Interventional Procedure Volume Recovery (+4.5% CC)',              impact: 44,   category: 'volume'  },
      { label: 'China VoBP Revenue Headwind (Medical Essentials)',                 impact: -38,  category: 'mix'     },
      { label: 'Alaris Consent Decree — Market Access Restriction',               impact: -30,  category: 'mix'     },
      { label: 'FX Translation Headwind',                                          impact: -58,  category: 'fx'      },
      { label: 'Net Pricing Realization (+2.0% blended)',                          impact: 94,   category: 'pricing' },
    ],
  },
  {
    period: 'Q3 FY24',
    items: [
      { label: 'BioPharma Systems GLP-1 Volume Growth (+10.5% CC)',                impact: 91,   category: 'volume'  },
      { label: 'Medical Essentials U.S. Volume Growth (+3.5% CC)',                 impact: 54,   category: 'volume'  },
      { label: 'Interventional Procedure Volume Recovery (+5.0% CC)',              impact: 50,   category: 'volume'  },
      { label: 'China VoBP Revenue Headwind',                                      impact: -35,  category: 'mix'     },
      { label: 'Alaris Consent Decree — Market Access Restriction',               impact: -28,  category: 'mix'     },
      { label: 'FX Translation Headwind',                                          impact: -52,  category: 'fx'      },
      { label: 'Net Pricing Realization (+2.2% blended)',                          impact: 97,   category: 'pricing' },
    ],
  },
  {
    period: 'Q4 FY24',
    items: [
      { label: 'BioPharma Systems GLP-1 Volume Growth (+11.2% CC)',                impact: 98,   category: 'volume'  },
      { label: 'Medical Essentials U.S. Volume Growth (+3.2% CC)',                 impact: 49,   category: 'volume'  },
      { label: 'Interventional Procedure Volume Recovery (+5.2% CC)',              impact: 52,   category: 'volume'  },
      { label: 'China VoBP Revenue Headwind',                                      impact: -36,  category: 'mix'     },
      { label: 'Alaris Consent Decree — Market Access Restriction',               impact: -22,  category: 'mix'     },
      { label: 'FX Translation Headwind',                                          impact: -48,  category: 'fx'      },
      { label: 'Net Pricing Realization (+2.3% blended)',                          impact: 95,   category: 'pricing' },
    ],
  },
  {
    period: 'Q1 FY26',
    items: [
      { label: 'BioPharma Systems GLP-1 Volume Growth (+3.0% CC)',                 impact: 31,   category: 'volume'  },
      { label: 'Medical Essentials U.S. Volume Growth (+1.5% CC)',                 impact: 24,   category: 'volume'  },
      { label: 'Interventional Procedure Volume Growth (+0.8% CC)',                impact: 10,   category: 'volume'  },
      { label: 'Alaris Infusion Pump Recovery (Q1 hospital capital budget reset)', impact: 35,   category: 'volume'  },
      { label: 'China VoBP Revenue Headwind (Q1 FY26: ~$38M)',                    impact: -38,  category: 'mix'     },
      { label: 'FX Translation Headwind (EUR/JPY/CNY; Q1 FY26)',                  impact: -54,  category: 'fx'      },
      { label: 'Waters Spin-Off Revenue Reduction (continuing ops basis)',         impact: -420, category: 'mix'     },
      { label: 'Net Pricing Realization (+1.5% blended)',                          impact: 65,   category: 'pricing' },
    ],
  },
  {
    period: 'Q2 FY26',
    items: [
      { label: 'BioPharma Systems GLP-1 Volume Growth (+8.5% CC)',                 impact: 89,   category: 'volume'  },
      { label: 'Medical Essentials U.S. Volume Growth (+2.0% CC)',                 impact: 33,   category: 'volume'  },
      { label: 'Interventional Procedure Volume Growth (+2.2% CC)',                impact: 30,   category: 'volume'  },
      { label: 'Alaris Infusion Pump Recovery (72K pace vs 60K PY)',               impact: 48,   category: 'volume'  },
      { label: 'China VoBP Revenue Headwind (Q2 FY26: ~$42M)',                    impact: -42,  category: 'mix'     },
      { label: 'FX Translation Headwind (EUR/JPY/CNY; Q2 FY26: ~$62M)',           impact: -62,  category: 'fx'      },
      { label: 'Net Pricing Realization (+2.5% blended)',                          impact: 117,  category: 'pricing' },
    ],
  },
  {
    period: 'Q3 FY26',
    items: [
      { label: 'BioPharma Systems GLP-1 Volume Growth (Q3 FY26)',                  impact: 88,   category: 'volume'  },
      { label: 'Medical Essentials U.S. Volume Growth (+3.2% CC)',                 impact: 52,   category: 'volume'  },
      { label: 'Interventional Procedure Volume Growth (+5.3% CC)',                impact: 72,   category: 'volume'  },
      { label: 'Alaris Hospital Capital Q3 Lift (78K pace vs 56K PY)',             impact: 88,   category: 'volume'  },
      { label: 'China VoBP Revenue Headwind (Q3 FY26: ~$40M)',                    impact: -40,  category: 'mix'     },
      { label: 'FX Translation Headwind (Q3 FY26: ~$60M)',                         impact: -60,  category: 'fx'      },
      { label: 'Net Pricing Realization (+2.0% blended)',                          impact: 95,   category: 'pricing' },
    ],
  },
  {
    period: 'Q4 FY26',
    items: [
      { label: 'BioPharma Systems GLP-1 Volume Growth Forecast',                   impact: 112,  category: 'volume'  },
      { label: 'Alaris Year-End Hospital Capital Push (86K pace)',                  impact: 75,   category: 'volume'  },
      { label: 'Medical Essentials U.S. Volume Growth Forecast',                   impact: 50,   category: 'volume'  },
      { label: 'Interventional Procedure Volume Growth Forecast',                   impact: 40,   category: 'volume'  },
      { label: 'China VoBP Revenue Headwind Forecast (Q4 FY26: ~$40M)',            impact: -40,  category: 'mix'     },
      { label: 'FX Translation Headwind Forecast',                                 impact: -54,  category: 'fx'      },
      { label: 'Net Pricing Realization Forecast',                                 impact: 118,  category: 'pricing' },
    ],
  },
  {
    period: 'Q2 FY27',
    items: [
      { label: 'BioPharma Systems GLP-1 New Capacity Revenue',                     impact: 202,  category: 'volume'  },
      { label: 'Alaris Full Market Re-Entry (95K+ annualized)',                     impact: 103,  category: 'volume'  },
      { label: 'Medical Essentials Emerging Markets + U.S. Growth',                impact: 72,   category: 'volume'  },
      { label: 'Interventional Procedure Volume + EP Catheter',                    impact: 60,   category: 'volume'  },
      { label: 'China VoBP Revenue Headwind Forecast',                             impact: -45,  category: 'mix'     },
      { label: 'FX Translation Impact Forecast',                                   impact: -58,  category: 'fx'      },
      { label: 'Net Pricing Realization Forecast',                                 impact: 123,  category: 'pricing' },
    ],
  },
];

// ─── KPI Values for Extended Periods ─────────────────────────────────────────
// Labels must exactly match KPIDefinition labels seeded in the BD KPI seed file.
// Actuals only for periods with confirmed data; null = forecast-only period.
// Leveraged KPI labels from 15-analytics-products.ts forecast metric names.

type ExtKPIEntry = {
  value: string;
  target: string | null;
  trend: string;
  trendValue: string;
  status: string;
};

// Period index map: 0=Q1 FY24, 1=Q2 FY24, 2=Q3 FY24, 3=Q4 FY24, 4=Q1 FY25,
//   5=Q2 FY25, 6=Q3 FY25, 7=Q4 FY25, 8=Q1 FY26, 9=Q2 FY26, 10=Q3 FY26,
//   11=Q4 FY26, 12=Q1 FY27, 13=Q2 FY27

const extendedKPIData: Record<string, {
  actuals:   (ExtKPIEntry | null)[];
  forecasts: ExtKPIEntry[];
  budgets:   ExtKPIEntry[];
}> = {
  'Adjusted EPS': {
    actuals: [
      { value: '3.12', target: '3.00', trend: 'up',   trendValue: 'Q1 FY24 adj. EPS above plan', status: 'good' },
      { value: '3.28', target: '3.15', trend: 'up',   trendValue: 'Q2 FY24 +4.0% YoY; GLP-1 growth', status: 'good' },
      { value: '3.38', target: '3.25', trend: 'up',   trendValue: 'Q3 FY24 +4.4% YoY; strong BioPharma', status: 'good' },
      { value: '3.44', target: '3.35', trend: 'up',   trendValue: 'Q4 FY24 FY close; strong year', status: 'good' },
      { value: '3.22', target: '3.15', trend: 'up',   trendValue: 'Q1 FY25 continuing ops basis', status: 'good' },
      { value: '3.35', target: '3.28', trend: 'up',   trendValue: 'Q2 FY25 +2.1% YoY CC growth', status: 'good' },
      { value: '3.28', target: '3.30', trend: 'flat', trendValue: 'Q3 FY25 slightly below plan; Alaris', status: 'warning' },
      { value: '3.38', target: '3.35', trend: 'up',   trendValue: 'Q4 FY25 FY25 close; on track', status: 'good' },
      { value: '3.35', target: '3.30', trend: 'up',   trendValue: 'Q1 FY26 continuing ops +4.0%', status: 'good' },
      { value: '3.50', target: '3.45', trend: 'up',   trendValue: 'Q2 FY26 +4.5% YoY; reaffirm guidance', status: 'good' },
      { value: '3.08', target: '3.14', trend: 'down', trendValue: 'Q3 FY26 close; seasonal Q3 dip', status: 'warning' },
      null, // Q4 FY26 forecast
      null, // Q1 FY27 forecast
      null, // Q2 FY27 forecast
    ],
    forecasts: [
      { value: '3.10', target: '3.00', trend: 'up',   trendValue: 'Q1 FY24 projected', status: 'good' },
      { value: '3.26', target: '3.15', trend: 'up',   trendValue: 'Q2 FY24 projected', status: 'good' },
      { value: '3.36', target: '3.25', trend: 'up',   trendValue: 'Q3 FY24 projected', status: 'good' },
      { value: '3.42', target: '3.35', trend: 'up',   trendValue: 'Q4 FY24 projected', status: 'good' },
      { value: '3.20', target: '3.15', trend: 'up',   trendValue: 'Q1 FY25 projected', status: 'good' },
      { value: '3.33', target: '3.28', trend: 'up',   trendValue: 'Q2 FY25 projected', status: 'good' },
      { value: '3.26', target: '3.30', trend: 'flat', trendValue: 'Q3 FY25 projected; slightly below', status: 'warning' },
      { value: '3.36', target: '3.35', trend: 'up',   trendValue: 'Q4 FY25 projected', status: 'good' },
      { value: '3.33', target: '3.30', trend: 'up',   trendValue: 'Q1 FY26 projected', status: 'good' },
      { value: '3.48', target: '3.45', trend: 'up',   trendValue: 'Q2 FY26 projected; guidance reaffirm', status: 'good' },
      { value: '3.08', target: '3.14', trend: 'down', trendValue: 'Q3 FY26 close; seasonal', status: 'warning' },
      { value: '3.28', target: '3.25', trend: 'up',   trendValue: 'Q4 FY26 forecast; H2 recovery', status: 'good' },
      { value: '3.58', target: '3.55', trend: 'up',   trendValue: 'Q1 FY27 forecast; Alaris + GLP-1', status: 'good' },
      { value: '3.78', target: '3.75', trend: 'up',   trendValue: 'Q2 FY27 forecast; full capacity', status: 'good' },
    ],
    budgets: [
      { value: '3.00', target: '3.00', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.15', target: '3.15', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.25', target: '3.25', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.35', target: '3.35', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.15', target: '3.15', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.28', target: '3.28', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.30', target: '3.30', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.35', target: '3.35', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.30', target: '3.30', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.45', target: '3.45', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.14', target: '3.14', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.25', target: '3.25', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.55', target: '3.55', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.75', target: '3.75', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
    ],
  },
  'Total Revenue ($M)': {
    actuals: [
      { value: '3909',  target: '3850', trend: 'up',   trendValue: '$3,909M Q1 FY24; +3.0% YoY CC', status: 'good' },
      { value: '4106',  target: '4050', trend: 'up',   trendValue: '$4,106M Q2 FY24; +3.8% YoY CC', status: 'good' },
      { value: '4216',  target: '4160', trend: 'up',   trendValue: '$4,216M Q3 FY24; +4.5% YoY CC', status: 'good' },
      { value: '4224',  target: '4180', trend: 'up',   trendValue: '$4,224M Q4 FY24; +4.5% YoY CC', status: 'good' },
      { value: '4438',  target: '4380', trend: 'up',   trendValue: '$4,438M Q1 FY25; +6.6% CC', status: 'good' },
      { value: '4579',  target: '4520', trend: 'up',   trendValue: '$4,579M Q2 FY25; +5.4% CC', status: 'good' },
      { value: '4664',  target: '4600', trend: 'up',   trendValue: '$4,664M Q3 FY25; +5.4% CC', status: 'good' },
      { value: '4685',  target: '4640', trend: 'up',   trendValue: '$4,685M Q4 FY25; +4.8% CC', status: 'good' },
      { value: '4486',  target: '4450', trend: 'up',   trendValue: '$4,486M Q1 FY26; continuing ops +1.1%', status: 'good' },
      { value: '4714',  target: '4660', trend: 'up',   trendValue: '$4,714M Q2 FY26 ACTUAL; +2.9% reported', status: 'good' },
      { value: '4760',  target: '4740', trend: 'up',   trendValue: '$4,760M Q3 FY26 close-in-progress', status: 'good' },
      null,
      null,
      null,
    ],
    forecasts: [
      { value: '3900',  target: '3850', trend: 'up',   trendValue: 'Q1 FY24 projected', status: 'good' },
      { value: '4096',  target: '4050', trend: 'up',   trendValue: 'Q2 FY24 projected', status: 'good' },
      { value: '4206',  target: '4160', trend: 'up',   trendValue: 'Q3 FY24 projected', status: 'good' },
      { value: '4215',  target: '4180', trend: 'up',   trendValue: 'Q4 FY24 projected', status: 'good' },
      { value: '4428',  target: '4380', trend: 'up',   trendValue: 'Q1 FY25 projected', status: 'good' },
      { value: '4568',  target: '4520', trend: 'up',   trendValue: 'Q2 FY25 projected', status: 'good' },
      { value: '4653',  target: '4600', trend: 'up',   trendValue: 'Q3 FY25 projected', status: 'good' },
      { value: '4674',  target: '4640', trend: 'up',   trendValue: 'Q4 FY25 projected', status: 'good' },
      { value: '4476',  target: '4450', trend: 'up',   trendValue: 'Q1 FY26 projected', status: 'good' },
      { value: '4704',  target: '4660', trend: 'up',   trendValue: 'Q2 FY26 projected; guidance aligned', status: 'good' },
      { value: '4756',  target: '4740', trend: 'up',   trendValue: 'Q3 FY26 forecast; seasonal pickup', status: 'good' },
      { value: '4800',  target: '4780', trend: 'up',   trendValue: 'Q4 FY26 forecast; Alaris year-end', status: 'good' },
      { value: '4850',  target: '4830', trend: 'up',   trendValue: 'Q1 FY27 forecast; +8.1% YoY', status: 'good' },
      { value: '5015',  target: '4990', trend: 'up',   trendValue: 'Q2 FY27 forecast; +6.5% YoY', status: 'good' },
    ],
    budgets: [
      { value: '3850',  target: '3850', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4050',  target: '4050', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4160',  target: '4160', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4180',  target: '4180', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4380',  target: '4380', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4520',  target: '4520', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4600',  target: '4600', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4640',  target: '4640', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4450',  target: '4450', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4660',  target: '4660', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4740',  target: '4740', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4780',  target: '4780', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4830',  target: '4830', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '4990',  target: '4990', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
    ],
  },
  'Adjusted Operating Margin (%)': {
    actuals: [
      { value: '24.8', target: '24.5', trend: 'up',   trendValue: '24.8% Q1 FY24; above plan', status: 'good' },
      { value: '25.0', target: '24.7', trend: 'up',   trendValue: '25.0% Q2 FY24; strong margins', status: 'good' },
      { value: '25.2', target: '24.9', trend: 'up',   trendValue: '25.2% Q3 FY24; improving', status: 'good' },
      { value: '25.5', target: '25.0', trend: 'up',   trendValue: '25.5% Q4 FY24; strong close', status: 'good' },
      { value: '25.8', target: '25.5', trend: 'up',   trendValue: '25.8% Q1 FY25; operational leverage', status: 'good' },
      { value: '25.9', target: '25.6', trend: 'up',   trendValue: '25.9% Q2 FY25; Excellence Unleashed', status: 'good' },
      { value: '26.0', target: '25.8', trend: 'up',   trendValue: '26.0% Q3 FY25; strong mid-year', status: 'good' },
      { value: '26.1', target: '25.9', trend: 'up',   trendValue: '26.1% Q4 FY25; FY25 close', status: 'good' },
      { value: '24.8', target: '24.8', trend: 'flat', trendValue: '24.8% Q1 FY26; continuing ops basis', status: 'good' },
      { value: '25.0', target: '24.9', trend: 'up',   trendValue: '25.0% Q2 FY26 ACTUAL; guidance midpoint', status: 'good' },
      { value: '24.4', target: '25.0', trend: 'down', trendValue: '24.4% Q3 FY26 close; seasonal Alaris mix', status: 'warning' },
      null,
      null,
      null,
    ],
    forecasts: [
      { value: '24.7', target: '24.5', trend: 'up',   trendValue: 'Q1 FY24 projected', status: 'good' },
      { value: '24.9', target: '24.7', trend: 'up',   trendValue: 'Q2 FY24 projected', status: 'good' },
      { value: '25.1', target: '24.9', trend: 'up',   trendValue: 'Q3 FY24 projected', status: 'good' },
      { value: '25.4', target: '25.0', trend: 'up',   trendValue: 'Q4 FY24 projected', status: 'good' },
      { value: '25.7', target: '25.5', trend: 'up',   trendValue: 'Q1 FY25 projected', status: 'good' },
      { value: '25.8', target: '25.6', trend: 'up',   trendValue: 'Q2 FY25 projected', status: 'good' },
      { value: '25.9', target: '25.8', trend: 'up',   trendValue: 'Q3 FY25 projected', status: 'good' },
      { value: '26.0', target: '25.9', trend: 'up',   trendValue: 'Q4 FY25 projected', status: 'good' },
      { value: '24.7', target: '24.8', trend: 'flat', trendValue: 'Q1 FY26 projected', status: 'good' },
      { value: '24.9', target: '24.9', trend: 'flat', trendValue: 'Q2 FY26 projected', status: 'good' },
      { value: '24.4', target: '25.0', trend: 'down', trendValue: 'Q3 FY26 forecast; seasonal', status: 'warning' },
      { value: '25.2', target: '25.2', trend: 'up',   trendValue: 'Q4 FY26 forecast; recovery', status: 'good' },
      { value: '26.0', target: '25.8', trend: 'up',   trendValue: 'Q1 FY27 forecast; leverage expansion', status: 'good' },
      { value: '26.5', target: '26.2', trend: 'up',   trendValue: 'Q2 FY27 forecast; full capacity', status: 'good' },
    ],
    budgets: [
      { value: '24.5', target: '24.5', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '24.7', target: '24.7', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '24.9', target: '24.9', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '25.0', target: '25.0', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '25.5', target: '25.5', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '25.6', target: '25.6', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '25.8', target: '25.8', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '25.9', target: '25.9', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '24.8', target: '24.8', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '24.9', target: '24.9', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '25.0', target: '25.0', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '25.2', target: '25.2', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '25.8', target: '25.8', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '26.2', target: '26.2', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
    ],
  },
  'Net Leverage (x)': {
    actuals: [
      { value: '3.40', target: '<3.5', trend: 'down', trendValue: '3.40x Q1 FY24; deleveraging', status: 'good' },
      { value: '3.35', target: '<3.5', trend: 'down', trendValue: '3.35x Q2 FY24; improving', status: 'good' },
      { value: '3.20', target: '<3.5', trend: 'down', trendValue: '3.20x Q3 FY24; ahead of plan', status: 'good' },
      { value: '3.10', target: '<3.0', trend: 'down', trendValue: '3.10x Q4 FY24 close; on path', status: 'good' },
      { value: '3.10', target: '<3.0', trend: 'flat', trendValue: '3.10x Q1 FY25; Waters spin preparation', status: 'good' },
      { value: '3.05', target: '<3.0', trend: 'down', trendValue: '3.05x Q2 FY25; FCF improving', status: 'good' },
      { value: '3.00', target: '<3.0', trend: 'down', trendValue: '3.00x Q3 FY25; at target', status: 'good' },
      { value: '3.10', target: '<3.0', trend: 'up',   trendValue: '3.10x Q4 FY25; Waters spin costs', status: 'warning' },
      { value: '3.00', target: '<3.0', trend: 'down', trendValue: '3.00x Q1 FY26; continuing ops deleveraging', status: 'good' },
      { value: '2.90', target: '<2.9', trend: 'down', trendValue: '2.90x Q2 FY26 ACTUAL; $750M H1 debt paydown', status: 'good' },
      { value: '2.84', target: '<2.85', trend: 'down', trendValue: '2.84x Q3 FY26 close; improving trajectory', status: 'good' },
      null,
      null,
      null,
    ],
    forecasts: [
      { value: '3.42', target: '<3.5', trend: 'down', trendValue: 'Q1 FY24 projected', status: 'good' },
      { value: '3.37', target: '<3.5', trend: 'down', trendValue: 'Q2 FY24 projected', status: 'good' },
      { value: '3.22', target: '<3.5', trend: 'down', trendValue: 'Q3 FY24 projected', status: 'good' },
      { value: '3.12', target: '<3.0', trend: 'down', trendValue: 'Q4 FY24 projected', status: 'good' },
      { value: '3.12', target: '<3.0', trend: 'down', trendValue: 'Q1 FY25 projected', status: 'good' },
      { value: '3.07', target: '<3.0', trend: 'down', trendValue: 'Q2 FY25 projected', status: 'good' },
      { value: '3.02', target: '<3.0', trend: 'down', trendValue: 'Q3 FY25 projected', status: 'good' },
      { value: '3.12', target: '<3.0', trend: 'up',   trendValue: 'Q4 FY25 projected', status: 'warning' },
      { value: '3.02', target: '<3.0', trend: 'down', trendValue: 'Q1 FY26 projected', status: 'good' },
      { value: '2.92', target: '<2.9', trend: 'down', trendValue: 'Q2 FY26 projected', status: 'good' },
      { value: '2.84', target: '<2.85', trend: 'down', trendValue: 'Q3 FY26 forecast', status: 'good' },
      { value: '2.78', target: '<2.80', trend: 'down', trendValue: 'Q4 FY26 forecast; $1.5B FY debt paydown', status: 'good' },
      { value: '2.68', target: '<2.70', trend: 'down', trendValue: 'Q1 FY27 forecast; deleveraging continues', status: 'good' },
      { value: '2.58', target: '<2.60', trend: 'down', trendValue: 'Q2 FY27 forecast; toward <2.5x FY28 target', status: 'good' },
    ],
    budgets: [
      { value: '3.45', target: '<3.5', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.40', target: '<3.5', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.25', target: '<3.5', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.15', target: '<3.0', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.15', target: '<3.0', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.10', target: '<3.0', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.05', target: '<3.0', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '3.15', target: '<3.0', trend: 'flat', trendValue: 'Budget baseline', status: 'warning' },
      { value: '3.05', target: '<3.0', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '2.95', target: '<2.9', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '2.85', target: '<2.85', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '2.80', target: '<2.80', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '2.70', target: '<2.70', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
      { value: '2.60', target: '<2.60', trend: 'flat', trendValue: 'Budget baseline', status: 'good' },
    ],
  },
};

// ─── Index aligned to PERIOD_DEFS order ──────────────────────────────────────
const EXT_QUARTER_LABELS = PERIOD_DEFS
  .filter((p) => p.type === 'quarter')
  .map((p) => p.label);

// =============================================================================
// Main seed function
// =============================================================================

export async function seedExtendedPeriods(
  prisma: PrismaClient,
  companyId: number,
): Promise<Record<string, { id: number }>> {

  // ── 0. Delete existing records to ensure idempotency ─────────────────────

  // Find any existing FiscalPeriod IDs for our labels (may have been seeded before)
  const existingPeriods = await prisma.fiscalPeriod.findMany({
    where: { companyId, label: { in: ALL_PERIOD_LABELS } },
    select: { id: true },
  });
  const existingPeriodIds = existingPeriods.map((p) => p.id);

  if (existingPeriodIds.length > 0) {
    // Delete child records in reverse dependency order
    await prisma.kPIValue.deleteMany({
      where: { periodId: { in: existingPeriodIds } },
    });
    await prisma.monthlyFinancial.deleteMany({
      where: { periodId: { in: existingPeriodIds } },
    });
    await prisma.revenueBridgeItem.deleteMany({
      where: { periodId: { in: existingPeriodIds } },
    });
    await prisma.segmentResult.deleteMany({
      where: { periodId: { in: existingPeriodIds } },
    });
    await prisma.financialStatement.deleteMany({
      where: { periodId: { in: existingPeriodIds } },
    });
    await prisma.quarterlyResult.deleteMany({
      where: { periodId: { in: existingPeriodIds } },
    });
    await prisma.fiscalPeriod.deleteMany({
      where: { id: { in: existingPeriodIds } },
    });
    console.log(`  Deleted ${existingPeriodIds.length} existing BD extended fiscal periods and child records`);
  }

  // ── Resolve segment and KPI definition maps ───────────────────────────────

  const segments = await prisma.businessSegment.findMany({ where: { companyId } });
  const segmentMap: Record<string, number> = {};
  for (const seg of segments) {
    segmentMap[seg.name] = seg.id;
  }

  const kpiDefs = await prisma.kPIDefinition.findMany({ where: { companyId } });
  const kpiDefMap: Record<string, number> = {};
  for (const kpi of kpiDefs) {
    kpiDefMap[kpi.label] = kpi.id;
  }

  // ── 1. Create FiscalPeriod records ────────────────────────────────────────

  const periodMap: Record<string, { id: number }> = {};

  for (const period of PERIOD_DEFS) {
    const created = await prisma.fiscalPeriod.create({
      data: {
        companyId,
        label:   period.label,
        year:    period.year,
        quarter: period.quarter,
        type:    period.type,
      },
    });
    periodMap[period.label] = { id: created.id };
  }
  console.log(`  Created ${PERIOD_DEFS.length} BD extended fiscal periods`);

  // ── 2. Create QuarterlyResult records ─────────────────────────────────────

  for (const qr of quarterlyResults) {
    const pid = periodMap[qr.period];
    if (!pid) continue;
    await prisma.quarterlyResult.create({
      data: {
        periodId:        pid.id,
        revenue:         qr.revenue,
        revenueYoY:      qr.revenueYoY,
        operatingIncome: qr.operatingIncome,
        operatingMargin: qr.operatingMargin,
        eps:             qr.eps,
        compStoreSales:  qr.compStoreSales, // adj. operating margin %
        netNewStores:    qr.netNewStores,   // Alaris K annualized
      },
    });
  }
  console.log(`  Created ${quarterlyResults.length} BD quarterly results`);

  // ── 3. Create FinancialStatement records ──────────────────────────────────

  let fsCount = 0;
  for (const q of plData) {
    const pid = periodMap[q.period];
    if (!pid) continue;
    await prisma.financialStatement.createMany({
      data: q.lines.map((l) => ({
        companyId,
        periodId:        pid.id,
        lineItem:        l.lineItem,
        label:           l.label,
        actual:          l.actual,
        plan:            l.plan,
        priorYear:       l.priorYear,
        variance:        l.variance,
        variancePercent: l.variancePercent,
      })),
    });
    fsCount += q.lines.length;
  }
  console.log(`  Created ${fsCount} BD financial statement lines`);

  // ── 4. Create SegmentResult records ───────────────────────────────────────

  let segCount = 0;
  for (const q of segmentData) {
    const pid = periodMap[q.period];
    if (!pid) continue;
    const rows = [];

    if (segmentMap['Medical Essentials']) {
      rows.push({ segmentId: segmentMap['Medical Essentials'], periodId: pid.id, revenue: q.me.rev,  yoyChange: q.me.yoy,  operatingMargin: q.me.margin  });
    }
    if (segmentMap['Connected Care']) {
      rows.push({ segmentId: segmentMap['Connected Care'],     periodId: pid.id, revenue: q.cc.rev,  yoyChange: q.cc.yoy,  operatingMargin: q.cc.margin  });
    }
    if (segmentMap['BioPharma Systems']) {
      rows.push({ segmentId: segmentMap['BioPharma Systems'],  periodId: pid.id, revenue: q.bps.rev, yoyChange: q.bps.yoy, operatingMargin: q.bps.margin });
    }
    if (segmentMap['Interventional']) {
      rows.push({ segmentId: segmentMap['Interventional'],     periodId: pid.id, revenue: q.int.rev, yoyChange: q.int.yoy, operatingMargin: q.int.margin });
    }

    if (rows.length > 0) {
      await prisma.segmentResult.createMany({ data: rows });
      segCount += rows.length;
    }
  }
  console.log(`  Created ${segCount} BD segment results`);

  // ── 5. Create RevenueBridgeItem records ───────────────────────────────────

  let bridgeCount = 0;
  for (const q of bridgeData) {
    const pid = periodMap[q.period];
    if (!pid) continue;
    await prisma.revenueBridgeItem.createMany({
      data: q.items.map((item, idx) => ({
        companyId,
        periodId:  pid.id,
        label:     item.label,
        impact:    item.impact,
        category:  item.category,
        sortOrder: idx,
      })),
    });
    bridgeCount += q.items.length;
  }
  console.log(`  Created ${bridgeCount} BD revenue bridge items`);

  // ── 6. Create KPIValue records ────────────────────────────────────────────

  let kpiCount = 0;
  for (const [kpiLabel, kpiData] of Object.entries(extendedKPIData)) {
    const definitionId = kpiDefMap[kpiLabel];
    if (!definitionId) {
      console.warn(`  KPI definition not found for label "${kpiLabel}" — skipping`);
      continue;
    }

    for (let qi = 0; qi < EXT_QUARTER_LABELS.length; qi++) {
      const label = EXT_QUARTER_LABELS[qi];
      const pid   = periodMap[label];
      if (!pid) continue;

      // Actual
      const actualEntry = kpiData.actuals[qi];
      if (actualEntry !== null) {
        await prisma.kPIValue.create({
          data: {
            kpiDefinitionId: definitionId,
            periodId:        pid.id,
            dataType:        'actual',
            value:           actualEntry.value,
            target:          actualEntry.target,
            trend:           actualEntry.trend,
            trendValue:      actualEntry.trendValue,
            status:          actualEntry.status,
          },
        });
        kpiCount++;
      }

      // Forecast
      const forecastEntry = kpiData.forecasts[qi];
      if (forecastEntry) {
        await prisma.kPIValue.create({
          data: {
            kpiDefinitionId: definitionId,
            periodId:        pid.id,
            dataType:        'forecast',
            value:           forecastEntry.value,
            target:          forecastEntry.target,
            trend:           forecastEntry.trend,
            trendValue:      forecastEntry.trendValue,
            status:          forecastEntry.status,
          },
        });
        kpiCount++;
      }

      // Budget
      const budgetEntry = kpiData.budgets[qi];
      if (budgetEntry) {
        await prisma.kPIValue.create({
          data: {
            kpiDefinitionId: definitionId,
            periodId:        pid.id,
            dataType:        'budget',
            value:           budgetEntry.value,
            target:          budgetEntry.target,
            trend:           budgetEntry.trend,
            trendValue:      budgetEntry.trendValue,
            status:          budgetEntry.status,
          },
        });
        kpiCount++;
      }
    }
  }
  console.log(`  Created ${kpiCount} BD KPI values for extended periods`);
  console.log('BD extended periods seed complete');

  return periodMap;
}
