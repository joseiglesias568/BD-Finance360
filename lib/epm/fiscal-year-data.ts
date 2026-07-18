// =============================================================================
// Fiscal Year Plan Data — Becton, Dickinson and Company
// Annual plan targets + YTD actuals + full-year projections
// All values in $M unless otherwise noted
// BD fiscal year (Jan-Dec); regulated electric and gas utility
// Rate base: $28.8B (FY25A) → ~$30.5B (FY26E) → ~$33B (FY27E) → $47.7B (FY30T)
// =============================================================================

export interface FiscalYearMetric {
  metric: string;
  plan: number;
  ytdActual: number;
  fullYearForecast: number;
  priorYear: number;
  unit: '$M' | '%' | '$/share' | 'count';
  isCost: boolean;       // true = lower is favorable
}

export interface QuarterlyBreakdown {
  quarter: string;       // "Q1 FY26"
  plan: number;
  actual: number | null; // null for forecast quarters
  forecast: number | null;
  priorYear: number;
}

export interface FiscalYearPlanData {
  fiscalYear: string;
  currentQuarter: string;
  quartersComplete: number;
  totalQuarters: number;
  daysThroughYear: number;
  totalDaysInYear: 365;
  metrics: FiscalYearMetric[];
  revenueByQuarter: QuarterlyBreakdown[];
  operatingIncomeByQuarter: QuarterlyBreakdown[];
  marginByQuarter: QuarterlyBreakdown[];
}

function generateFiscalYearPlan(): FiscalYearPlanData {
  return {
    fiscalYear: 'FY26',
    currentQuarter: 'Q1 FY26',
    quartersComplete: 1, // Q1 FY26 reported (May 2026)
    totalQuarters: 4,
    daysThroughYear: 120, // ~day 120 of calendar year (early May)
    totalDaysInYear: 365,

    metrics: [
      {
        // FY26 guidance ~$9.2B; Q1 FY26 actual $2,176M
        metric: 'Total Revenue',
        plan: 9150, ytdActual: 2176, fullYearForecast: 9196,
        priorYear: 8799, unit: '$M', isCost: false,
      },
      {
        // Fuel & Purchased Power ~35% of revenue
        metric: 'Fuel & Purchased Power',
        plan: 3200, ytdActual: 762, fullYearForecast: 3192,
        priorYear: 3080, unit: '$M', isCost: true,
      },
      {
        // Gross Margin ~65% of revenue
        metric: 'Gross Margin',
        plan: 5950, ytdActual: 1414, fullYearForecast: 6004,
        priorYear: 5719, unit: '$M', isCost: false,
      },
      {
        // O&M ~25% of revenue; growing with asset base
        metric: 'O&M Expense',
        plan: 2270, ytdActual: 544, fullYearForecast: 2271,
        priorYear: 2191, unit: '$M', isCost: true,
      },
      {
        // D&A growing with rate base: ~$1,368M FY26E vs ~$1,294M FY25A
        metric: 'Depreciation & Amortization',
        plan: 1355, ytdActual: 330, fullYearForecast: 1368,
        priorYear: 1294, unit: '$M', isCost: true,
      },
      {
        // Taxes OTI ~8% of revenue (property, gross receipts)
        metric: 'Taxes Other Than Income',
        plan: 720, ytdActual: 175, fullYearForecast: 727,
        priorYear: 698, unit: '$M', isCost: true,
      },
      {
        // Operating income: Q1 FY26 actual $532M; FY26E ~$2,128M
        metric: 'Operating Income',
        plan: 2090, ytdActual: 532, fullYearForecast: 2128,
        priorYear: 2020, unit: '$M', isCost: false,
      },
      {
        // OI margin: Q1 FY26 24.4%; FY26E ~23.1%
        metric: 'Operating Margin',
        plan: 22.8, ytdActual: 24.4, fullYearForecast: 23.1,
        priorYear: 22.9, unit: '%', isCost: false,
      },
      {
        // Net income: Q1 FY26 $357M; FY26E ~$1,498M (EPS $5.35 × ~280M shares)
        metric: 'Net Income',
        plan: 1470, ytdActual: 357, fullYearForecast: 1498,
        priorYear: 1452, unit: '$M', isCost: false,
      },
      {
        // EPS: Q1 FY26 actual $1.28; FY26 guidance $5.25-$5.45; midpoint $5.35
        metric: 'Diluted EPS',
        plan: 5.30, ytdActual: 1.28, fullYearForecast: 5.35,
        priorYear: 5.07, unit: '$/share', isCost: false,
      },
      {
        // FY26 capex guidance ~$6.3B; Q1 FY26 actual $1,563M (+48% YoY)
        metric: 'Capital Expenditures',
        plan: 6300, ytdActual: 1563, fullYearForecast: 6360,
        priorYear: 5300, unit: '$M', isCost: true,
      },
      {
        // Missouri rate base: ~$15.8B at year-end FY25; ~$17.5B FY26E at 13.6% CAGR
        metric: 'Missouri Rate Base (Year-End)',
        plan: 17200, ytdActual: 16100, fullYearForecast: 17500,
        priorYear: 15800, unit: '$M', isCost: false,
      },
      {
        // Total AEE rate base: $28.8B (FY25A) → ~$30.5B (FY26E)
        metric: 'Total Rate Base (Year-End)',
        plan: 30200, ytdActual: 29200, fullYearForecast: 30500,
        priorYear: 28800, unit: '$M', isCost: false,
      },
      {
        // ESA contracted load: 2.2 GW binding Feb 2026; 3.4 GW MO total pipeline
        metric: 'ESA Contracted Load (GW)',
        plan: 2.5, ytdActual: 2.2, fullYearForecast: 2.8,
        priorYear: 1.2, unit: 'count', isCost: false,
      },
      {
        // FFO/debt target 16-17%
        metric: 'FFO / Debt (%)',
        plan: 16.5, ytdActual: 16.2, fullYearForecast: 16.4,
        priorYear: 16.0, unit: '%', isCost: false,
      },
    ],

    revenueByQuarter: [
      // Q1 FY26: actual $2,176M vs plan $2,190M; prior year Q1 FY25 $2,100M
      { quarter: 'Q1 FY26', plan: 2190, actual: 2176, forecast: 2176, priorYear: 2100 },
      // Q2 FY26: shoulder season; forecast $2,050M
      { quarter: 'Q2 FY26', plan: 2030, actual: null, forecast: 2050, priorYear: 1960 },
      // Q3 FY26: AC peak season; forecast $2,620M
      { quarter: 'Q3 FY26', plan: 2580, actual: null, forecast: 2620, priorYear: 2500 },
      // Q4 FY26: heating season; forecast $2,350M
      { quarter: 'Q4 FY26', plan: 2350, actual: null, forecast: 2350, priorYear: 2163 },
    ],

    operatingIncomeByQuarter: [
      // Q1 FY26: actual $532M vs plan $510M; prior year Q1 FY25 $278M
      { quarter: 'Q1 FY26', plan: 510, actual: 532, forecast: 532, priorYear: 278 },
      // Q2 FY26: seasonally weakest OI quarter
      { quarter: 'Q2 FY26', plan: 390, actual: null, forecast: 395, priorYear: 228 },
      // Q3 FY26: summer peak; highest OI quarter
      { quarter: 'Q3 FY26', plan: 655, actual: null, forecast: 665, priorYear: 620 },
      // Q4 FY26: heating/rate base additions
      { quarter: 'Q4 FY26', plan: 520, actual: null, forecast: 536, priorYear: 470 },
    ],

    marginByQuarter: [
      // Q1 FY26: actual OI margin 24.4% vs plan 23.3%
      { quarter: 'Q1 FY26', plan: 23.3, actual: 24.4, forecast: 24.4, priorYear: 13.2 },
      // Q2 FY26: shoulder season; lower margin
      { quarter: 'Q2 FY26', plan: 19.2, actual: null, forecast: 19.3, priorYear: 11.6 },
      // Q3 FY26: summer peak margin
      { quarter: 'Q3 FY26', plan: 25.4, actual: null, forecast: 25.4, priorYear: 24.8 },
      // Q4 FY26: full year exits with good margin
      { quarter: 'Q4 FY26', plan: 22.1, actual: null, forecast: 22.8, priorYear: 21.7 },
    ],
  };
}

// =============================================================================
// FY24 / FY25 HISTORICAL DATA
// =============================================================================

export interface HistoricalFiscalYear {
  fiscalYear: string;
  revenue: number;
  operatingIncome: number;
  netIncome: number;
  eps: number;
  capex: number;
  rateBase: number;
  quarters: {
    quarter: string;
    revenue: number;
    operatingIncome: number;
    eps: number;
  }[];
}

export const HISTORICAL_FISCAL_YEARS: HistoricalFiscalYear[] = [
  {
    // FY24: Revenue ~$7,846M, EPS ~$4.70 [DERIVED]
    fiscalYear: 'FY24',
    revenue: 7846,
    operatingIncome: 1820,
    netIncome: 1290,
    eps: 4.70,
    capex: 4800,
    rateBase: 25200,
    quarters: [
      { quarter: 'Q1 FY24', revenue: 2050, operatingIncome: 258, eps: 0.95 },
      { quarter: 'Q2 FY24', revenue: 1760, operatingIncome: 195, eps: 0.72 },
      { quarter: 'Q3 FY24', revenue: 2110, operatingIncome: 568, eps: 1.35 },
      { quarter: 'Q4 FY24', revenue: 1926, operatingIncome: 425, eps: 1.68 },
    ],
  },
  {
    // FY25: Revenue ~$8,799M, EPS ~$5.35 (FY25 full year at prior plan guidance)
    fiscalYear: 'FY25',
    revenue: 8723,
    operatingIncome: 1596,
    netIncome: 1452,
    eps: 5.21,
    capex: 5300,
    rateBase: 28800,
    quarters: [
      { quarter: 'Q1 FY25', revenue: 2100, operatingIncome: 278, eps: 1.07 },
      { quarter: 'Q2 FY25', revenue: 1960, operatingIncome: 228, eps: 0.88 },
      { quarter: 'Q3 FY25', revenue: 2500, operatingIncome: 620, eps: 1.55 },
      { quarter: 'Q4 FY25', revenue: 2163, operatingIncome: 470, eps: 1.85 },
    ],
  },
  {
    // FY26: Q1 actual + Q2-Q4 forecast; EPS guidance $5.25-$5.45
    fiscalYear: 'FY26',
    revenue: 9196,
    operatingIncome: 2128,
    netIncome: 1498,
    eps: 5.35,
    capex: 6360,
    rateBase: 30500,
    quarters: [
      { quarter: 'Q1 FY26', revenue: 2176, operatingIncome: 532, eps: 1.28 },
      { quarter: 'Q2 FY26', revenue: 2050, operatingIncome: 395, eps: 0.95 },
      { quarter: 'Q3 FY26', revenue: 2620, operatingIncome: 665, eps: 1.68 },
      { quarter: 'Q4 FY26', revenue: 2350, operatingIncome: 536, eps: 1.44 },
    ],
  },
];

let _cached: FiscalYearPlanData | null = null;

export function getFiscalYearPlanData(): FiscalYearPlanData {
  if (_cached) return _cached;
  _cached = generateFiscalYearPlan();
  return _cached;
}

export function getHistoricalFiscalYear(fy: string): HistoricalFiscalYear | undefined {
  return HISTORICAL_FISCAL_YEARS.find(h => h.fiscalYear === fy);
}
