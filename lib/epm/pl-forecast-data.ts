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
  label: string;       // "Q1 FY25"
  fiscalYear: string;  // "FY25"
  quarter: number;     // 1-4
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
// All quarterly values in $M. Revenue scale: ~$4.3-5.4B/quarter.
// BD fiscal year: Q1=Oct-Dec, Q2=Jan-Mar, Q3=Apr-Jun, Q4=Jul-Sep.
// BioPharma Systems and Medical Essentials tend to be strongest in Q2/Q3.
// =============================================================================

function generatePeriods(): PLPeriod[] {
  return [
    { label: 'Q1 FY25', fiscalYear: 'FY25', quarter: 1, isHistorical: true, isCurrent: false, isForecast: false },
    { label: 'Q2 FY25', fiscalYear: 'FY25', quarter: 2, isHistorical: true, isCurrent: false, isForecast: false },
    { label: 'Q3 FY25', fiscalYear: 'FY25', quarter: 3, isHistorical: true, isCurrent: false, isForecast: false },
    { label: 'Q4 FY25', fiscalYear: 'FY25', quarter: 4, isHistorical: true, isCurrent: false, isForecast: false },
    { label: 'Q1 FY26', fiscalYear: 'FY26', quarter: 1, isHistorical: false, isCurrent: true, isForecast: false },
    { label: 'Q2 FY26', fiscalYear: 'FY26', quarter: 2, isHistorical: false, isCurrent: false, isForecast: true },
    { label: 'Q3 FY26', fiscalYear: 'FY26', quarter: 3, isHistorical: false, isCurrent: false, isForecast: true },
    { label: 'Q4 FY26', fiscalYear: 'FY26', quarter: 4, isHistorical: false, isCurrent: false, isForecast: true },
    { label: 'Q1 FY27', fiscalYear: 'FY27', quarter: 1, isHistorical: false, isCurrent: false, isForecast: true },
    { label: 'Q2 FY27', fiscalYear: 'FY27', quarter: 2, isHistorical: false, isCurrent: false, isForecast: true },
    { label: 'Q3 FY27', fiscalYear: 'FY27', quarter: 3, isHistorical: false, isCurrent: false, isForecast: true },
    { label: 'Q4 FY27', fiscalYear: 'FY27', quarter: 4, isHistorical: false, isCurrent: false, isForecast: true },
  ];
}

// Quarterly revenue ($M) — BD fiscal year (Oct-Sep)
// FY25 total ~$18.2B; FY26 guidance ~$19.8-20.0B
const QUARTERLY_REVENUE = [
  4334, 4480, 4676, 4705,    // FY25 Q1-Q4 (~$18.2B)
  4486, 4714, 4850, 4950,    // FY26 Q1-Q4 (~$19.0B guided)
  5000, 5150, 5250, 5350,    // FY27 Q1-Q4 (~$20.75B projected)
];

// Adjusted Operating Income ($M) — BD ~25% adj. operating margin
// FY25: ~$4.5B annual; FY26: guidance implies ~$4.8B; FY27: ~$5.4B
const QUARTERLY_AOI = [
  1083, 1120, 1169, 1175,   // FY25 (~$4.55B annual; ~25% margin)
  1121, 1202, 1261, 1311,   // FY26 (~$4.90B annual; margin expansion with BD Simplify)
  1350, 1390, 1417, 1498,   // FY27 (~$5.65B annual; full BD Simplify benefit)
];

// R&D Expense ($M) — BD ~6.8% of revenue; growing with pipeline investment
const RD_BASE = [
  295, 305, 318, 320,   // FY25 (~$1.24B annual; ~6.8% of revenue)
  305, 321, 330, 337,   // FY26 (~$1.29B annual; growing with BioPharma Systems pipeline)
  340, 350, 357, 364,   // FY27 (~$1.41B annual; continued pipeline investment)
];

// SG&A Expense ($M) — declining with BD Simplify savings program
const SGA_BASE = [
  780, 806, 841, 847,   // FY25 (~$3.27B annual; pre-BD Simplify full benefit)
  747, 785, 808, 825,   // FY26 (~$3.17B; BD Simplify Year 1 savings)
  750, 773, 788, 803,   // FY27 (~$3.11B; cumulative BD Simplify savings vs FY25 base)
];

// Interest expense ($M) — BD ~$17B net debt at blended ~3.5%; quarterly ~$150M
// BD FY26 interest ~$600M annual per guidance
const INTEREST_EXPENSE = 150;

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
    const rev = QUARTERLY_REVENUE[i];
    revenue.values[k] = rev;
    revenue.confidence[k] = conf;
    revenue.lowerBound[k] = Math.round(rev * (1 - bandWidth));
    revenue.upperBound[k] = Math.round(rev * (1 + bandWidth));

    // Adjusted Operating Income (target)
    const aoiVal = QUARTERLY_AOI[i];
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

  // Medical Essentials (~38-40% of total revenue): core med-surg, dispensing, lab
  const medEss = [1650, 1710, 1785, 1800, 1720, 1805, 1860, 1900, 1950, 2010, 2050, 2095];
  // Connected Care (~12% of revenue): Alaris infusion systems, digital health
  const cc = [520, 540, 565, 570, 540, 570, 590, 605, 625, 650, 670, 690];
  // BioPharma Systems (~18% of revenue): prefillable syringes, GLP-1 devices, injectables
  const bpGlp1 = [760, 790, 825, 840, 790, 840, 870, 895, 935, 975, 1010, 1050];
  // Interventional (~25% of revenue): Peripheral, Urology, Surgery
  const interv = [1070, 1105, 1155, 1165, 1100, 1160, 1200, 1230, 1275, 1315, 1350, 1390];
  // Organic pricing net of China VoBP headwind
  const orgPr = [200, 205, 215, 215, 210, 215, 210, 205, 200, 190, 185, 185];
  // FX translation impact (negative = headwind)
  const fx = [-65, -75, -85, -80, -70, -80, -85, -90, -75, -80, -85, -90];
  // BD Simplify program contribution
  const bdSimp = [199, 205, 216, 195, 196, 204, 205, 205, 90, 90, 90, 30];

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
    { name: 'Manufacturing Cost per Unit', unit: '$M', base: [1320, 1365, 1425, 1435, 1370, 1440, 1484, 1515, 1545, 1590, 1620, 1655] },
    { name: 'Raw Materials & Component Cost', unit: '$M', base: [680, 705, 735, 740, 708, 744, 766, 782, 795, 820, 837, 855] },
    { name: 'Supply Chain & Logistics COGS', unit: '$M', base: [280, 290, 305, 305, 292, 308, 318, 325, 333, 342, 350, 357] },
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
    { name: 'R&D Investment', unit: '$M', base: [295, 305, 318, 320, 305, 321, 330, 337, 340, 350, 357, 364] },
    { name: 'SG&A Net of BD Simplify Savings', unit: '$M', base: [780, 806, 841, 847, 747, 785, 808, 825, 750, 773, 788, 803] },
    { name: 'D&A — Acquisition & PP&E Depreciation', unit: '$M', base: [285, 290, 295, 298, 295, 300, 305, 308, 312, 316, 320, 324] },
    { name: 'Restructuring & Integration Costs', unit: '$M', base: [120, 115, 110, 125, 100, 95, 92, 90, 80, 75, 72, 70] },
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

export function getAnnualRollup(data: PLForecastData, fiscalYear: string): Record<PLLineItem, number> {
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
