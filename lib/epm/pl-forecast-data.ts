// =============================================================================
// 18-Month P&L Forecast Data Generator
// Generates realistic BD (Becton, Dickinson and Company) quarterly P&L forecasts
// All values in $M unless otherwise noted
// Calendar fiscal year (Oct-Sep), 4 segments: Medical Essentials, Connected Care,
// BioPharma Systems, Interventional
//
// BD consolidated P&L anchored to:
// FY25 actuals: Revenue ~$18.2B, Adj. Operating Income ~$4.5B, Adj. EPS $11.90
// FY26 guidance: Revenue $19.8-20.0B, Adj. EPS ~$13.25-13.50
// =============================================================================

// Canonical P&L line item order — Becton, Dickinson and Company
export const PL_LINE_ITEMS = [
  'Revenue',
  'Cost of Products Sold',
  'Gross Profit',
  'R&D Expense',
  'SG&A Expense',
  'Adjusted Operating Income',
  'Net Income',
  'Adjusted EPS',
] as const;

export type PLLineItem = (typeof PL_LINE_ITEMS)[number];

// Computed lines (derived from other lines, not directly forecasted)
export const COMPUTED_LINES: PLLineItem[] = [
  'Gross Profit',
  'Adjusted Operating Income',
  'Net Income',
];

export const INDENT_LINES: PLLineItem[] = [
  'Cost of Products Sold',
  'R&D Expense',
  'SG&A Expense',
];

export const BOLD_LINES: PLLineItem[] = [
  'Revenue',
  'Gross Profit',
  'Adjusted Operating Income',
  'Net Income',
  'Adjusted EPS',
];

// Driver definitions per P&L line — Becton, Dickinson and Company
export const REVENUE_DRIVERS = [
  'Medical Essentials Volume & Mix',
  'Connected Care (Alaris Ramp)',
  'BioPharma Systems GLP-1 Device Revenue',
  'Interventional Segment Revenue',
  'Organic Pricing Net of China VoBP',
  'FX Translation Impact',
  'BD Simplify Program Revenue Contribution',
] as const;

export const COGS_DRIVERS = [
  'Manufacturing Cost per Unit',
  'Raw Materials & Component Cost',
  'Supply Chain & Logistics COGS',
] as const;

export const OPEX_DRIVERS = [
  'R&D Investment',
  'SG&A Net of BD Simplify Savings',
  'D&A — Acquisition & PP&E Depreciation',
  'Restructuring & Integration Costs',
] as const;

export type DriverName = (typeof REVENUE_DRIVERS)[number] | (typeof COGS_DRIVERS)[number] | (typeof OPEX_DRIVERS)[number];

export function getDriversForLine(lineItem: PLLineItem): readonly string[] {
  switch (lineItem) {
    case 'Revenue': return REVENUE_DRIVERS;
    case 'Cost of Products Sold': return COGS_DRIVERS;
    case 'R&D Expense':
    case 'SG&A Expense':
    case 'Adjusted Operating Income': return OPEX_DRIVERS;
    default: return [];
  }
}

// Period types
export interface PLPeriod {
  label: string;       // "Oct '25"
  fiscalYear: string;  // "FY26"
  month: number;       // 1-12 (BD fiscal: 1=Oct, 12=Sep)
  isHistorical: boolean;
  isCurrent: boolean;
  isForecast: boolean;
}

export interface PLForecastRow {
  lineItem: PLLineItem;
  values: Record<string, number>;           // periodLabel -> value
  confidence: Record<string, number>;       // periodLabel -> 0-100 confidence
  lowerBound: Record<string, number>;       // periodLabel -> lower CI
  upperBound: Record<string, number>;       // periodLabel -> upper CI
}

export interface DriverForecastRow {
  driverName: string;
  parentLine: PLLineItem;
  unit: string;                             // "%", "$M", "count", "bps"
  values: Record<string, number>;           // periodLabel -> value
  impactOnParent: Record<string, number>;   // periodLabel -> $M contribution
}

export interface PLForecastData {
  periods: PLPeriod[];
  rows: PLForecastRow[];
  drivers: DriverForecastRow[];
  modelAccuracy: {
    lineItem: PLLineItem;
    mape: number;
    bestModel: string;
    confidence: number;
  }[];
}

// =============================================================================
// DATA GENERATION — Becton, Dickinson and Company
// All monthly values in $M. Revenue scale: ~$1.5-1.8B/month.
// BD fiscal year: M1=Oct, M9=Jun, M12=Sep.
// 18-month window: Oct '25 (FY26 M1) through Mar '27 (FY27 M6).
// Monthly values derived from quarterly actuals/guidance ÷ 3 with intra-quarter ramp.
// =============================================================================

function generatePeriods(): PLPeriod[] {
  return [
    // FY26: Oct 2025 – Sep 2026 (BD fiscal year Oct–Sep)
    { label: "Oct '25", fiscalYear: 'FY26', month: 1,  isHistorical: true,  isCurrent: false, isForecast: false },
    { label: "Nov '25", fiscalYear: 'FY26', month: 2,  isHistorical: true,  isCurrent: false, isForecast: false },
    { label: "Dec '25", fiscalYear: 'FY26', month: 3,  isHistorical: true,  isCurrent: false, isForecast: false },
    { label: "Jan '26", fiscalYear: 'FY26', month: 4,  isHistorical: true,  isCurrent: false, isForecast: false },
    { label: "Feb '26", fiscalYear: 'FY26', month: 5,  isHistorical: true,  isCurrent: false, isForecast: false },
    { label: "Mar '26", fiscalYear: 'FY26', month: 6,  isHistorical: true,  isCurrent: false, isForecast: false },
    { label: "Apr '26", fiscalYear: 'FY26', month: 7,  isHistorical: true,  isCurrent: false, isForecast: false },
    { label: "May '26", fiscalYear: 'FY26', month: 8,  isHistorical: true,  isCurrent: false, isForecast: false },
    { label: "Jun '26", fiscalYear: 'FY26', month: 9,  isHistorical: false, isCurrent: true,  isForecast: false },
    { label: "Jul '26", fiscalYear: 'FY26', month: 10, isHistorical: false, isCurrent: false, isForecast: true  },
    { label: "Aug '26", fiscalYear: 'FY26', month: 11, isHistorical: false, isCurrent: false, isForecast: true  },
    { label: "Sep '26", fiscalYear: 'FY26', month: 12, isHistorical: false, isCurrent: false, isForecast: true  },
    // FY27: Oct 2026 – Mar 2027 (6-month forward horizon)
    { label: "Oct '26", fiscalYear: 'FY27', month: 1,  isHistorical: false, isCurrent: false, isForecast: true  },
    { label: "Nov '26", fiscalYear: 'FY27', month: 2,  isHistorical: false, isCurrent: false, isForecast: true  },
    { label: "Dec '26", fiscalYear: 'FY27', month: 3,  isHistorical: false, isCurrent: false, isForecast: true  },
    { label: "Jan '27", fiscalYear: 'FY27', month: 4,  isHistorical: false, isCurrent: false, isForecast: true  },
    { label: "Feb '27", fiscalYear: 'FY27', month: 5,  isHistorical: false, isCurrent: false, isForecast: true  },
    { label: "Mar '27", fiscalYear: 'FY27', month: 6,  isHistorical: false, isCurrent: false, isForecast: true  },
  ];
}

// Monthly revenue ($M) — 18 months: Oct '25 through Mar '27
// Quarterly anchors: Q1 FY26=4486, Q2=4714, Q3=4850, Q4=4950; Q1 FY27=5000, Q2 FY27(partial)=5150
const MONTHLY_REVENUE = [
  1471, 1495, 1520,   // Oct-Dec '25  (Q1 FY26 = 4486)
  1546, 1570, 1598,   // Jan-Mar '26  (Q2 FY26 = 4714)
  1591, 1616, 1643,   // Apr-Jun '26  (Q3 FY26 = 4850)
  1624, 1649, 1677,   // Jul-Sep '26  (Q4 FY26 = 4950)
  1640, 1665, 1695,   // Oct-Dec '26  (Q1 FY27 = 5000)
  1689, 1716, 1745,   // Jan-Mar '27  (Q2 FY27 pace = 5150/qtr)
];

// Monthly Adjusted Operating Income ($M) — ~25% adj. operating margin
// Quarterly anchors: Q1 FY26=1121, Q2=1202, Q3=1261, Q4=1311; Q1 FY27=1350, Q2 FY27=1390
const MONTHLY_AOI = [
  368, 373, 380,   // Oct-Dec '25  (Q1 FY26 = 1121)
  394, 400, 408,   // Jan-Mar '26  (Q2 FY26 = 1202)
  413, 420, 428,   // Apr-Jun '26  (Q3 FY26 = 1261)
  430, 436, 445,   // Jul-Sep '26  (Q4 FY26 = 1311)
  442, 449, 459,   // Oct-Dec '26  (Q1 FY27 = 1350)
  456, 463, 471,   // Jan-Mar '27  (Q2 FY27 pace = 1390/qtr)
];

// Monthly R&D Expense ($M) — ~6.8% of revenue
const RD_BASE = [
  101, 102, 102,   // Oct-Dec '25  (Q1 FY26 = 305)
  106, 107, 108,   // Jan-Mar '26  (Q2 FY26 = 321)
  109, 110, 111,   // Apr-Jun '26  (Q3 FY26 = 330)
  112, 112, 113,   // Jul-Sep '26  (Q4 FY26 = 337)
  112, 113, 115,   // Oct-Dec '26  (Q1 FY27 = 340)
  115, 117, 118,   // Jan-Mar '27  (Q2 FY27 pace = 350/qtr)
];

// Monthly SG&A Expense ($M) — declining with BD Simplify savings
const SGA_BASE = [
  245, 249, 253,   // Oct-Dec '25  (Q1 FY26 = 747)
  259, 263, 263,   // Jan-Mar '26  (Q2 FY26 = 785)
  266, 270, 272,   // Apr-Jun '26  (Q3 FY26 = 808)
  272, 276, 277,   // Jul-Sep '26  (Q4 FY26 = 825)
  247, 250, 253,   // Oct-Dec '26  (Q1 FY27 = 750)
  254, 258, 261,   // Jan-Mar '27  (Q2 FY27 pace = 773/qtr)
];

// Interest expense ($M) — BD ~$17B net debt at blended ~3.5%; monthly ~$50M
// BD FY26 interest ~$600M annual per guidance
const INTEREST_EXPENSE = 50;

// Effective tax rate — BD 16.5%
const EFFECTIVE_TAX_RATE = 0.165;

// Diluted shares ($M) — BD ~282M shares
const SHARES_OUTSTANDING = 282;

function generatePLRows(periods: PLPeriod[]): PLForecastRow[] {
  const makeRow = (lineItem: PLLineItem): PLForecastRow => ({
    lineItem,
    values: {},
    confidence: {},
    lowerBound: {},
    upperBound: {},
  });

  const revenue = makeRow('Revenue');
  const costOfProducts = makeRow('Cost of Products Sold');
  const grossProfit = makeRow('Gross Profit');
  const rd = makeRow('R&D Expense');
  const sga = makeRow('SG&A Expense');
  const aoi = makeRow('Adjusted Operating Income');
  const netIncome = makeRow('Net Income');
  const eps = makeRow('Adjusted EPS');

  periods.forEach((p, i) => {
    const k = p.label;
    const forecastDist = p.isForecast ? Math.min(i - 4, 7) : 0;
    const conf = p.isHistorical ? 100 : p.isCurrent ? 97 : Math.max(60, 95 - forecastDist * 5);
    // BD MedTech: moderate variability (China VoBP and FX are key swing factors)
    const bandWidth = p.isHistorical ? 0 : p.isCurrent ? 0.003 : 0.018 + forecastDist * 0.010;

    // Revenue
    const rev = MONTHLY_REVENUE[i];
    revenue.values[k] = rev;
    revenue.confidence[k] = conf;
    revenue.lowerBound[k] = Math.round(rev * (1 - bandWidth));
    revenue.upperBound[k] = Math.round(rev * (1 + bandWidth));

    // Adjusted Operating Income (target)
    const aoiVal = MONTHLY_AOI[i];
    aoi.values[k] = aoiVal;
    aoi.confidence[k] = Math.max(conf - 5, 55); // AOI sensitive to China VoBP and FX
    aoi.lowerBound[k] = Math.round(aoiVal * (1 - bandWidth * 2.2));
    aoi.upperBound[k] = Math.round(aoiVal * (1 + bandWidth * 1.5));

    // R&D and SG&A
    const rdVal = RD_BASE[i];
    rd.values[k] = rdVal;
    rd.confidence[k] = Math.min(conf + 3, 100); // R&D relatively predictable once budget set
    rd.lowerBound[k] = Math.round(rdVal * (1 - bandWidth * 0.3));
    rd.upperBound[k] = Math.round(rdVal * (1 + bandWidth * 0.3));

    const sgaVal = SGA_BASE[i];
    sga.values[k] = sgaVal;
    sga.confidence[k] = Math.max(conf - 2, 62); // BD Simplify savings variable but trending lower
    sga.lowerBound[k] = Math.round(sgaVal * (1 - bandWidth * 0.7));
    sga.upperBound[k] = Math.round(sgaVal * (1 + bandWidth * 0.7));

    // Gross Profit = AOI + R&D + SG&A (derived, not independently forecasted)
    const gp = aoiVal + rdVal + sgaVal;
    grossProfit.values[k] = gp;
    grossProfit.confidence[k] = conf;
    grossProfit.lowerBound[k] = aoi.lowerBound[k] + rd.lowerBound[k] + sga.lowerBound[k];
    grossProfit.upperBound[k] = aoi.upperBound[k] + rd.upperBound[k] + sga.upperBound[k];

    // Cost of Products Sold = Revenue - Gross Profit
    const cogsVal = rev - gp;
    costOfProducts.values[k] = cogsVal;
    costOfProducts.confidence[k] = Math.max(conf - 6, 54); // most volatile: raw materials & FX
    costOfProducts.lowerBound[k] = revenue.lowerBound[k] - grossProfit.upperBound[k];
    costOfProducts.upperBound[k] = revenue.upperBound[k] - grossProfit.lowerBound[k];

    // Net Income = (AOI - Interest) × (1 - tax rate)
    const ni = Math.round((aoiVal - INTEREST_EXPENSE) * (1 - EFFECTIVE_TAX_RATE));
    netIncome.values[k] = ni;
    netIncome.confidence[k] = Math.max(conf - 6, 53);
    netIncome.lowerBound[k] = Math.round((aoi.lowerBound[k] - INTEREST_EXPENSE) * (1 - EFFECTIVE_TAX_RATE));
    netIncome.upperBound[k] = Math.round((aoi.upperBound[k] - INTEREST_EXPENSE) * (1 - EFFECTIVE_TAX_RATE));

    // Adjusted EPS = NI ÷ Diluted Shares (~282M)
    const epsVal = parseFloat((ni / SHARES_OUTSTANDING).toFixed(2));
    eps.values[k] = epsVal;
    eps.confidence[k] = netIncome.confidence[k];
    eps.lowerBound[k] = parseFloat((netIncome.lowerBound[k] / SHARES_OUTSTANDING).toFixed(2));
    eps.upperBound[k] = parseFloat((netIncome.upperBound[k] / SHARES_OUTSTANDING).toFixed(2));
  });

  return [revenue, costOfProducts, grossProfit, rd, sga, aoi, netIncome, eps];
}

function generateDrivers(periods: PLPeriod[]): DriverForecastRow[] {
  const drivers: DriverForecastRow[] = [];

  // Revenue drivers — BD segment decomposition
  const medEssentials: DriverForecastRow = { driverName: 'Medical Essentials Volume & Mix', parentLine: 'Revenue', unit: '$M', values: {}, impactOnParent: {} };
  const connectedCare: DriverForecastRow = { driverName: 'Connected Care (Alaris Ramp)', parentLine: 'Revenue', unit: '$M', values: {}, impactOnParent: {} };
  const bioPharmaGlp1: DriverForecastRow = { driverName: 'BioPharma Systems GLP-1 Device Revenue', parentLine: 'Revenue', unit: '$M', values: {}, impactOnParent: {} };
  const interventional: DriverForecastRow = { driverName: 'Interventional Segment Revenue', parentLine: 'Revenue', unit: '$M', values: {}, impactOnParent: {} };
  const organicPricing: DriverForecastRow = { driverName: 'Organic Pricing Net of China VoBP', parentLine: 'Revenue', unit: '$M', values: {}, impactOnParent: {} };
  const fxImpact: DriverForecastRow = { driverName: 'FX Translation Impact', parentLine: 'Revenue', unit: '$M', values: {}, impactOnParent: {} };
  const bdSimplifyRev: DriverForecastRow = { driverName: 'BD Simplify Program Revenue Contribution', parentLine: 'Revenue', unit: '$M', values: {}, impactOnParent: {} };

  // Medical Essentials (~38-40% of total revenue) — monthly values
  const medEss = [541, 549, 560, 561, 569, 580, 585, 594, 606, 590, 599, 611, 564, 572, 584, 591, 601, 613];
  // Connected Care (~12% of revenue) — monthly values
  const cc = [170, 173, 177, 177, 180, 183, 185, 188, 192, 187, 190, 193, 177, 180, 183, 187, 191, 192];
  // BioPharma Systems GLP-1 (~18% of revenue) — monthly values
  const bpGlp1 = [249, 253, 258, 259, 263, 268, 270, 274, 281, 275, 280, 285, 259, 263, 268, 275, 280, 285];
  // Interventional (~25% of revenue) — monthly values
  const interv = [351, 356, 363, 362, 368, 375, 379, 384, 392, 382, 387, 396, 361, 366, 373, 380, 387, 393];
  // Organic pricing net of China VoBP headwind — monthly values
  const orgPr = [66, 67, 67, 67, 68, 70, 71, 71, 73, 70, 72, 73, 69, 70, 71, 70, 72, 73];
  // FX translation impact (negative = headwind) — monthly values
  const fx = [-21, -22, -22, -25, -25, -25, -28, -28, -29, -26, -27, -27, -23, -23, -24, -26, -27, -27];
  // BD Simplify program contribution — monthly values
  const bdSimp = [65, 66, 68, 67, 68, 70, 71, 72, 73, 64, 65, 66, 64, 65, 67, 67, 68, 69];

  periods.forEach((p, i) => {
    const k = p.label;
    medEssentials.values[k] = medEss[i];
    medEssentials.impactOnParent[k] = medEss[i] - (medEss[i - 1] || medEss[0]);
    connectedCare.values[k] = cc[i];
    connectedCare.impactOnParent[k] = cc[i] - (cc[i - 1] || cc[0]);
    bioPharmaGlp1.values[k] = bpGlp1[i];
    bioPharmaGlp1.impactOnParent[k] = bpGlp1[i] - (bpGlp1[i - 1] || bpGlp1[0]);
    interventional.values[k] = interv[i];
    interventional.impactOnParent[k] = interv[i] - (interv[i - 1] || interv[0]);
    organicPricing.values[k] = orgPr[i];
    organicPricing.impactOnParent[k] = orgPr[i] - (orgPr[i - 1] || orgPr[0]);
    fxImpact.values[k] = fx[i];
    fxImpact.impactOnParent[k] = fx[i];
    bdSimplifyRev.values[k] = bdSimp[i];
    bdSimplifyRev.impactOnParent[k] = bdSimp[i] - (bdSimp[i - 1] || bdSimp[0]);
  });

  drivers.push(medEssentials, connectedCare, bioPharmaGlp1, interventional, organicPricing, fxImpact, bdSimplifyRev);

  // Cost of Products Sold drivers
  const cogsDriverDefs = [
    { name: 'Manufacturing Cost per Unit', unit: '$M', base: [433, 440, 447, 448, 454, 463, 467, 474, 484, 471, 478, 486, 449, 456, 465, 472, 480, 488] },
    { name: 'Raw Materials & Component Cost', unit: '$M', base: [223, 226, 231, 231, 235, 239, 241, 245, 249, 243, 246, 251, 232, 236, 240, 244, 248, 252] },
    { name: 'Supply Chain & Logistics COGS', unit: '$M', base: [92, 93, 95, 95, 97, 98, 100, 101, 104, 100, 102, 103, 96, 97, 99, 101, 103, 104] },
  ];

  for (const def of cogsDriverDefs) {
    const d: DriverForecastRow = { driverName: def.name, parentLine: 'Cost of Products Sold', unit: def.unit, values: {}, impactOnParent: {} };
    periods.forEach((p, i) => {
      d.values[p.label] = def.base[i];
      d.impactOnParent[p.label] = def.base[i] - (def.base[i - 1] || def.base[0]);
    });
    drivers.push(d);
  }

  // OpEx drivers — BD cost decomposition
  const opexDriverDefs = [
    { name: 'R&D Investment', unit: '$M', base: [101, 102, 102, 106, 107, 108, 109, 110, 111, 112, 112, 113, 112, 113, 115, 115, 117, 118] },
    { name: 'SG&A Net of BD Simplify Savings', unit: '$M', base: [245, 249, 253, 259, 263, 263, 266, 270, 272, 272, 276, 277, 247, 250, 253, 254, 258, 261] },
    { name: 'D&A — Acquisition & PP&E Depreciation', unit: '$M', base: [93, 95, 97, 95, 97, 98, 97, 98, 100, 98, 99, 101, 97, 98, 100, 99, 100, 101] },
    { name: 'Restructuring & Integration Costs', unit: '$M', base: [39, 40, 41, 38, 38, 39, 36, 37, 37, 41, 42, 42, 33, 33, 34, 31, 32, 32] },
  ];

  for (const def of opexDriverDefs) {
    const d: DriverForecastRow = { driverName: def.name, parentLine: 'SG&A Expense', unit: def.unit, values: {}, impactOnParent: {} };
    periods.forEach((p, i) => {
      d.values[p.label] = def.base[i];
      d.impactOnParent[p.label] = def.base[i] - (def.base[i - 1] || def.base[0]);
    });
    drivers.push(d);
  }

  return drivers;
}

function generateModelAccuracy(): PLForecastData['modelAccuracy'] {
  return [
    { lineItem: 'Revenue', mape: 1.2, bestModel: 'XGBoost Ensemble', confidence: 96 },
    { lineItem: 'Cost of Products Sold', mape: 2.8, bestModel: 'Raw Materials Regression + FX Curve', confidence: 88 },
    { lineItem: 'Gross Profit', mape: 2.1, bestModel: 'XGBoost Ensemble', confidence: 92 },
    { lineItem: 'R&D Expense', mape: 1.0, bestModel: 'Linear Regression', confidence: 97 },
    { lineItem: 'SG&A Expense', mape: 1.5, bestModel: 'ARIMA + BD Simplify Tracker', confidence: 94 },
    { lineItem: 'Adjusted Operating Income', mape: 4.0, bestModel: 'XGBoost Ensemble', confidence: 86 },
    { lineItem: 'Net Income', mape: 4.5, bestModel: 'XGBoost Ensemble', confidence: 84 },
    { lineItem: 'Adjusted EPS', mape: 4.6, bestModel: 'XGBoost Ensemble', confidence: 83 },
  ];
}

// =============================================================================
// PUBLIC API
// =============================================================================

let _cached: PLForecastData | null = null;

export function getPLForecastData(): PLForecastData {
  if (_cached) return _cached;
  const periods = generatePeriods();
  _cached = {
    periods,
    rows: generatePLRows(periods),
    drivers: generateDrivers(periods),
    modelAccuracy: generateModelAccuracy(),
  };
  return _cached;
}

// FY25 hardcoded actuals ($M) — used as prior-year comparison since FY25 months are outside the 18-month window
const FY25_ACTUALS: Record<PLLineItem, number> = {
  'Revenue': 18195,
  'Cost of Products Sold': 9274,
  'Gross Profit': 8921,
  'R&D Expense': 1238,
  'SG&A Expense': 3273,
  'Adjusted Operating Income': 4547,
  'Net Income': 3236,
  'Adjusted EPS': 11.47,
};

export function getAnnualRollup(data: PLForecastData, fiscalYear: string): Record<PLLineItem, number> {
  if (fiscalYear === 'FY25') return FY25_ACTUALS;
  const result = {} as Record<PLLineItem, number>;
  const fyPeriods = data.periods.filter(p => p.fiscalYear === fiscalYear).map(p => p.label);

  for (const row of data.rows) {
    result[row.lineItem] = fyPeriods.reduce((sum, k) => sum + (row.values[k] || 0), 0);
  }
  return result;
}

export function getTimeSeriesForLine(
  data: PLForecastData,
  lineItem: PLLineItem,
): { period: string; forecast: number; actual: number | null; lower: number; upper: number; confidence: number }[] {
  const row = data.rows.find(r => r.lineItem === lineItem);
  if (!row) return [];

  return data.periods.map(p => ({
    period: p.label,
    forecast: row.values[p.label],
    actual: (p.isHistorical || p.isCurrent) ? row.values[p.label] : null,
    lower: row.lowerBound[p.label],
    upper: row.upperBound[p.label],
    confidence: row.confidence[p.label],
  }));
}
