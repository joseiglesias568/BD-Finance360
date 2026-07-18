// =============================================================================
// Shared Financial Calculation Engine
// Single source of truth for margin, ratio, and P&L computations
// =============================================================================

/**
 * Calculate a margin percentage (e.g., gross margin, operating margin).
 * Returns the margin as a percentage with one decimal place.
 */
export function calculateMargin(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

/**
 * Calculate operating margin from operating income and revenue.
 */
export function calculateOperatingMargin(operatingIncome: number, revenue: number): number {
  return calculateMargin(operatingIncome, revenue);
}

/**
 * Calculate gross margin from gross profit and revenue.
 */
export function calculateGrossMargin(grossProfit: number, revenue: number): number {
  return calculateMargin(grossProfit, revenue);
}

/**
 * Annualize a quarterly value by multiplying by 4.
 */
export function annualizeQuarterlyValue(quarterlyValue: number): number {
  return quarterlyValue * 4;
}

/**
 * Round a financial value to N decimal places.
 * Default: 1 decimal place.
 */
export function roundFinancial(value: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Sum an array of numbers from a specific field on objects.
 */
export function sumField<T>(items: T[], field: keyof T): number {
  return items.reduce((sum, item) => {
    const val = item[field];
    return sum + (typeof val === 'number' ? val : 0);
  }, 0);
}

/**
 * Average an array of numbers from a specific field on objects.
 */
export function averageField<T>(items: T[], field: keyof T): number {
  if (items.length === 0) return 0;
  return sumField(items, field) / items.length;
}

/**
 * Calculate gross profit from revenue and COGS.
 */
export function calculateGrossProfit(revenue: number, cogs: number): number {
  return revenue - cogs;
}

/**
 * Calculate operating income from gross profit and operating expenses.
 */
export function calculateOperatingIncome(grossProfit: number, opEx: number): number {
  return grossProfit - opEx;
}

/**
 * Calculate net income from EBT and tax rate.
 */
export function calculateNetIncome(ebt: number, taxRate: number): number {
  const tax = Math.round(ebt * taxRate);
  return ebt - tax;
}

/**
 * Calculate EBT from operating income, interest expense, and other income.
 */
export function calculateEBT(
  operatingIncome: number,
  interestExpense: number,
  otherIncome: number = 0,
): number {
  return operatingIncome - interestExpense + otherIncome;
}
