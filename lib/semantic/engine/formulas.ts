// ════════════════════════════════════════════════════════════════════════════
// SEMANTIC ENGINE — FORMULA REGISTRY & EVALUATOR
// ════════════════════════════════════════════════════════════════════════════
// Defines executable formulas that encode Becton, Dickinson and Company business logic:
//   - Revenue decomposition (Total = Passenger + Cargo + Other Revenue)
//   - Passenger by geography (Domestic + Atlantic + LatAm + Pacific)
//   - Other revenue mix (Refinery 3rd-party + Loyalty + MRO + Misc)
//   - Unit economics (TRASM = Revenue / ASMs; CASM = Cost / ASMs)
//   - Fuel cost = gallons × price/gal × (1 - refinery offset%)
//   - Operating margin (= Op Income / Total Operating Revenue)
//   - AmEx contribution (cardholder spend × remuneration rate)
//   - Profit-sharing (10% first $2.5B + 20% above)
//
// Formula language:
//   ref(metric-id)        → lookup a metric value
//   ref(a) + ref(b)       → arithmetic on metric values
//   children.sum          → sum of all children's primary metric
//   children.weightedAvg  → weighted average using causal weights
// ════════════════════════════════════════════════════════════════════════════

import type { FormulaDefinition, FormulaContext, MetricUnit } from './types';

// ── Formula Registry ──────────────────────────────────────────────────────

/**
 * Registry of all executable formulas, keyed by metric ID.
 * Each formula encodes a real Becton, Dickinson and Company business relationship.
 */
export class FormulaRegistry {
  private formulas: Map<string, FormulaDefinition> = new Map();

  constructor() {
    this.registerCoreFormulas();
  }

  /** Get a formula for a metric ID */
  get(metricId: string): FormulaDefinition | undefined {
    return this.formulas.get(metricId);
  }

  /** Check if a metric has a registered formula */
  has(metricId: string): boolean {
    return this.formulas.has(metricId);
  }

  /** Get all registered formulas */
  getAll(): FormulaDefinition[] {
    return Array.from(this.formulas.values());
  }

  /** Get all metric IDs that have formulas */
  getFormulaMetricIds(): string[] {
    return Array.from(this.formulas.keys());
  }

  /** Register a new formula */
  register(formula: FormulaDefinition): void {
    this.formulas.set(formula.metricId, formula);
  }

  // ── Core Becton, Dickinson and Company Business Logic Formulas ─────────────────

  private registerCoreFormulas(): void {
    const formulas: FormulaDefinition[] = [
      // ── Total Operating Revenue Decomposition ─────────────────────
      // FY 2025 baseline: $63,364M = $51,768M Passenger + $900M Cargo + $10,696M Other
      {
        metricId: 'fp-total-revenue',
        expression: 'ref(fp-passenger-rev) + ref(fp-cargo-rev) + ref(fp-other-rev)',
        inputs: ['fp-passenger-rev', 'fp-cargo-rev', 'fp-other-rev'],
        outputUnit: 'currency',
        description: 'Total operating revenue = Passenger + Cargo + Other revenue (per 10-K MD&A)',
      },

      // ── Passenger Revenue by Geography ────────────────────────────
      // FY 2025: $51,768M = $35,731M Domestic + $9,270M Atlantic + $3,980M LatAm + $2,787M Pacific
      {
        metricId: 'fp-passenger-rev',
        expression: 'ref(fp-domestic-rev) + ref(fp-atlantic-rev) + ref(fp-latam-rev) + ref(fp-pacific-rev)',
        inputs: ['fp-domestic-rev', 'fp-atlantic-rev', 'fp-latam-rev', 'fp-pacific-rev'],
        outputUnit: 'currency',
        description: 'Passenger revenue = Domestic + Atlantic + Latin America + Pacific',
      },
      {
        metricId: 'fp-passenger-rev-by-cabin',
        expression: 'ref(fp-main-cabin-rev) + ref(fp-premium-rev) + ref(fp-loyalty-travel-awards) + ref(fp-travel-services)',
        inputs: ['fp-main-cabin-rev', 'fp-premium-rev', 'fp-loyalty-travel-awards', 'fp-travel-services'],
        outputUnit: 'currency',
        description: 'Passenger revenue by cabin = Main Cabin + Premium products + Loyalty travel awards + Travel-related services',
      },

      // ── Other Revenue Decomposition ───────────────────────────────
      // FY 2025: $10,696M = $5,077M Refinery + $3,362M Loyalty + $937M Ancillary (incl MRO) + $1,320M Misc
      {
        metricId: 'fp-other-rev',
        expression: 'ref(fp-refinery-3p-rev) + ref(fp-loyalty-rev) + ref(fp-mro-rev) + ref(fp-misc-rev)',
        inputs: ['fp-refinery-3p-rev', 'fp-loyalty-rev', 'fp-mro-rev', 'fp-misc-rev'],
        outputUnit: 'currency',
        description: 'Other revenue = Refinery (3rd-party) + Loyalty program + MRO + Miscellaneous',
      },

      // ── Unit Economics: TRASM, PRASM, CASM ────────────────────────
      {
        metricId: 'fp-trasm',
        expression: 'ref(fp-total-revenue) / ref(fp-asms) * 100',
        inputs: ['fp-total-revenue', 'fp-asms'],
        outputUnit: 'percent',
        description: 'TRASM (cents) = Total Revenue ÷ Available Seat Miles × 100',
      },
      {
        metricId: 'fp-prasm',
        expression: 'ref(fp-passenger-rev) / ref(fp-asms) * 100',
        inputs: ['fp-passenger-rev', 'fp-asms'],
        outputUnit: 'percent',
        description: 'PRASM (cents) = Passenger Revenue ÷ Available Seat Miles × 100',
      },
      {
        metricId: 'fp-yield',
        expression: 'ref(fp-passenger-rev) / ref(fp-rpms) * 100',
        inputs: ['fp-passenger-rev', 'fp-rpms'],
        outputUnit: 'percent',
        description: 'Passenger mile yield (cents) = Passenger Revenue ÷ Revenue Passenger Miles × 100',
      },
      {
        metricId: 'fp-casm',
        expression: 'ref(fp-total-opex) / ref(fp-asms) * 100',
        inputs: ['fp-total-opex', 'fp-asms'],
        outputUnit: 'percent',
        description: 'CASM (cents) = Total Operating Expense ÷ Available Seat Miles × 100',
      },
      {
        metricId: 'fp-load-factor',
        expression: 'ref(fp-rpms) / ref(fp-asms) * 100',
        inputs: ['fp-rpms', 'fp-asms'],
        outputUnit: 'percent',
        description: 'Load factor = RPMs ÷ ASMs × 100',
      },

      // ── Fuel Cost & Refinery Offset ───────────────────────────────
      // FY 2025: 4,269M gallons × $2.30/gal (adjusted) = $9,819M
      {
        metricId: 'fp-fuel-cost',
        expression: 'ref(fp-fuel-gallons) * ref(fp-fuel-price-per-gal)',
        inputs: ['fp-fuel-gallons', 'fp-fuel-price-per-gal'],
        outputUnit: 'currency',
        description: 'Fuel cost = gallons consumed × adjusted price per gallon (includes refinery & hedge impact)',
      },
      {
        metricId: 'fp-fuel-cost-with-offset',
        expression: 'ref(fp-fuel-cost-gross) - ref(fp-refinery-benefit)',
        inputs: ['fp-fuel-cost-gross', 'fp-refinery-benefit'],
        outputUnit: 'currency',
        description: 'All-in fuel cost = market fuel cost − Trainer refinery benefit (when crack spreads widen)',
      },

      // ── Total Operating Expense Decomposition ─────────────────────
      // FY 2025: $57,542M = Salaries 17,520 + Fuel 9,819 + Refinery 5,987 + Contracted 4,617 +
      //   Landing 3,564 + Regional 2,553 + Selling 2,485 + D&A 2,443 + Maintenance 2,432 +
      //   Pax service 1,855 + Profit sharing 1,337 + Aircraft rent 542 + Other 2,388
      {
        metricId: 'fp-total-opex',
        expression: 'ref(fp-salaries) + ref(fp-fuel-cost) + ref(fp-refinery-expense) + ref(fp-contracted-services) + ref(fp-landing-rents) + ref(fp-regional-carrier) + ref(fp-selling) + ref(fp-da) + ref(fp-maintenance) + ref(fp-pax-service) + ref(fp-profit-sharing) + ref(fp-aircraft-rent) + ref(fp-other-opex)',
        inputs: ['fp-salaries', 'fp-fuel-cost', 'fp-refinery-expense', 'fp-contracted-services', 'fp-landing-rents', 'fp-regional-carrier', 'fp-selling', 'fp-da', 'fp-maintenance', 'fp-pax-service', 'fp-profit-sharing', 'fp-aircraft-rent', 'fp-other-opex'],
        outputUnit: 'currency',
        description: 'Total operating expense = sum of 13 line items per 10-K Statements of Operations',
      },

      // ── Operating Margin ──────────────────────────────────────────
      {
        metricId: 'fp-operating-margin-calc',
        expression: '(ref(fp-total-revenue) - ref(fp-total-opex)) / ref(fp-total-revenue) * 100',
        inputs: ['fp-total-revenue', 'fp-total-opex'],
        outputUnit: 'percent',
        description: 'Operating margin = (Revenue - Operating Expense) ÷ Revenue × 100',
      },

      // ── Adjusted Operating Margin (excludes 3rd-party refinery) ───
      {
        metricId: 'fp-adj-operating-margin',
        expression: '(ref(fp-total-revenue) - ref(fp-refinery-3p-rev) - ref(fp-total-opex) + ref(fp-refinery-expense)) / (ref(fp-total-revenue) - ref(fp-refinery-3p-rev)) * 100',
        inputs: ['fp-total-revenue', 'fp-refinery-3p-rev', 'fp-total-opex', 'fp-refinery-expense'],
        outputUnit: 'percent',
        description: 'Adjusted operating margin excludes 3rd-party refinery sales and matching expense (airline-comparable view)',
      },

      // ── EPS from Net Income ───────────────────────────────────────
      // FY 2025: $5,005M net income / ~653M diluted shares = $7.66
      {
        metricId: 'fp-eps-from-net-income',
        expression: 'ref(fp-net-income) / ref(fp-diluted-shares) * 1000',
        inputs: ['fp-net-income', 'fp-diluted-shares'],
        outputUnit: 'currency',
        description: 'Diluted EPS = Net Income ÷ Diluted Weighted Avg Shares (output as $; net income in $M, shares in M)',
      },

      // ── Chart Integration Synergies ─────────────────────────────
      // FY26: Chart integration synergy run-rate $35M (Q1); target $65M FY26, $150M YE2027
      {
        metricId: 'amex-remuneration-implied',
        expression: 'ref(amex-cardholder-spend) * ref(amex-remuneration-rate) / 100',
        inputs: ['amex-cardholder-spend', 'amex-remuneration-rate'],
        outputUnit: 'currency',
        description: 'Chart synergies ≈ procurement savings + cross-sell revenue × operational efficiency rate (per integration plan)',
      },

      // ── Profit-Sharing Formula ────────────────────────────────────
      // 10% of first $2.5B + 20% above — per 10-K MD&A
      {
        metricId: 'fp-profit-sharing-implied',
        expression: '(ref(fp-pretax-pre-ps) > 2500) ? (250 + (ref(fp-pretax-pre-ps) - 2500) * 0.20) : (ref(fp-pretax-pre-ps) * 0.10)',
        inputs: ['fp-pretax-pre-ps'],
        outputUnit: 'currency',
        description: 'Profit sharing = 10% of first $2.5B pre-tax (program-defined) + 20% above $2.5B. Note: ternary not yet supported by evaluator; use as documentation.',
      },

      // ── MRO Revenue Trajectory ────────────────────────────────────
      // FY 2025 $822M → FY 2026 outlook $1.2B (>50%)
      {
        metricId: 'mro-revenue-from-growth',
        expression: 'ref(mro-prior-revenue) * (1 + ref(mro-growth-pct) / 100)',
        inputs: ['mro-prior-revenue', 'mro-growth-pct'],
        outputUnit: 'currency',
        description: 'MRO revenue projection = prior-period revenue × (1 + growth %)',
      },

      // ── Free Cash Flow ────────────────────────────────────────────
      // FY 2025 $4.643B FCF (per JPM deck reconciliation)
      {
        metricId: 'fp-free-cash-flow',
        expression: 'ref(fp-operating-cash-flow) - ref(fp-capex) + ref(fp-fcf-adjustments)',
        inputs: ['fp-operating-cash-flow', 'fp-capex', 'fp-fcf-adjustments'],
        outputUnit: 'currency',
        description: 'Free cash flow = Operating CF − Capex + adjustments (pension, airport-construction, strategic investments)',
      },

      // ── Adjusted Net Debt ─────────────────────────────────────────
      // Q1 2026: $13.540B = $15.916B adj debt + $2.715B fleet leases - $5.053B cash - $0.038B LGA
      {
        metricId: 'fp-adj-net-debt',
        expression: 'ref(fp-adj-debt) + ref(fp-fleet-op-leases) + ref(fp-pension-unfunded) - ref(fp-cash) - ref(fp-lga-restricted)',
        inputs: ['fp-adj-debt', 'fp-fleet-op-leases', 'fp-pension-unfunded', 'fp-cash', 'fp-lga-restricted'],
        outputUnit: 'currency',
        description: 'Adjusted net debt = adjusted debt + fleet operating leases + unfunded pension - cash - LGA restricted',
      },

      // ── Revenue per Passenger ──────────────────────────────────────
      // FY 2025: $63.4B / 200M passengers = ~$317
      {
        metricId: 'fp-rev-per-passenger',
        expression: 'ref(fp-total-revenue) / ref(fp-passengers-served)',
        inputs: ['fp-total-revenue', 'fp-passengers-served'],
        outputUnit: 'currency',
        description: 'Revenue per passenger = total operating revenue ÷ passengers served',
      },

      // ── Revenue per Employee ───────────────────────────────────────
      // FY 2025: $63.4B / 103,000 FTE = ~$615K
      {
        metricId: 'fp-rev-per-employee',
        expression: 'ref(fp-total-revenue) / ref(fp-fte-headcount)',
        inputs: ['fp-total-revenue', 'fp-fte-headcount'],
        outputUnit: 'currency',
        description: 'Revenue per FTE = total revenue ÷ ~103,000 full-time equivalents (10-K)',
      },

      // ── Diverse Revenue Mix ────────────────────────────────────────
      // Per management framing: 62% diverse, 38% main cabin
      {
        metricId: 'diverse-revenue-pct',
        expression: '(ref(fp-total-revenue) - ref(fp-refinery-3p-rev) - ref(fp-main-cabin-rev)) / (ref(fp-total-revenue) - ref(fp-refinery-3p-rev)) * 100',
        inputs: ['fp-total-revenue', 'fp-refinery-3p-rev', 'fp-main-cabin-rev'],
        outputUnit: 'percent',
        description: 'Diverse revenue % = (Adjusted revenue − Main cabin) ÷ Adjusted revenue. Q1 2026: 62%.',
      },
    ];

    for (const f of formulas) {
      this.formulas.set(f.metricId, f);
    }
  }
}

// ── Formula Evaluator ─────────────────────────────────────────────────────

/**
 * Evaluate a formula expression given a context of metric values.
 *
 * Supports:
 *   ref(metric-id)     → lookup from context
 *   +, -, *, /         → arithmetic
 *   numeric literals   → constants (e.g., 100, 365, 1140)
 *   children.sum       → requires special handling by caller
 *   children.weightedAvg → requires special handling by caller
 */
export function evaluateFormula(
  expression: string,
  context: FormulaContext
): number | null {
  // Handle aggregation expressions (caller resolves these)
  if (expression === 'children.sum' || expression === 'children.weightedAvg') {
    return null; // Must be handled by the engine
  }

  try {
    // Replace ref(xxx) with actual values
    const resolved = expression.replace(/ref\(([^)]+)\)/g, (_match, metricId: string) => {
      const value = context.get(metricId.trim());
      if (value === undefined) return 'NaN';
      return String(value);
    });

    // Safety: only allow numbers, operators, parentheses, whitespace, decimal points, NaN
    if (!/^[0-9+\-*/().eE\s,NaN]+$/.test(resolved)) {
      return null;
    }

    // Check for NaN (missing metric values)
    if (resolved.includes('NaN')) {
      return null;
    }

    // Evaluate the arithmetic expression safely
    // Using Function constructor instead of eval for slightly better isolation
    const fn = new Function(`return (${resolved});`);
    const result = fn();

    if (typeof result !== 'number' || !isFinite(result)) {
      return null;
    }

    return result;
  } catch {
    return null;
  }
}

// ── Computation Order ─────────────────────────────────────────────────────

/**
 * Determine the order in which formulas should be evaluated
 * (topological sort based on dependencies).
 */
export function getComputationOrder(registry: FormulaRegistry): string[] {
  const formulas = registry.getAll();
  const formulaMap = new Map(formulas.map(f => [f.metricId, f]));
  const order: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>(); // For cycle detection

  function visit(metricId: string): void {
    if (visited.has(metricId)) return;
    if (visiting.has(metricId)) {
      // Circular dependency — skip
      return;
    }

    visiting.add(metricId);

    const formula = formulaMap.get(metricId);
    if (formula) {
      for (const input of formula.inputs) {
        if (formulaMap.has(input)) {
          visit(input);
        }
      }
    }

    visiting.delete(metricId);
    visited.add(metricId);
    order.push(metricId);
  }

  for (const f of formulas) {
    visit(f.metricId);
  }

  return order;
}

/**
 * Validate formulas for circular dependencies.
 * Returns array of cycle paths found (empty = valid).
 */
export function validateFormulas(registry: FormulaRegistry): string[][] {
  const formulas = registry.getAll();
  const formulaMap = new Map(formulas.map(f => [f.metricId, f]));
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const path: string[] = [];

  function dfs(metricId: string): void {
    if (path.includes(metricId)) {
      const cycleStart = path.indexOf(metricId);
      cycles.push([...path.slice(cycleStart), metricId]);
      return;
    }
    if (visited.has(metricId)) return;

    path.push(metricId);
    const formula = formulaMap.get(metricId);
    if (formula) {
      for (const input of formula.inputs) {
        if (formulaMap.has(input)) {
          dfs(input);
        }
      }
    }
    path.pop();
    visited.add(metricId);
  }

  for (const f of formulas) {
    dfs(f.metricId);
  }

  return cycles;
}

/**
 * Get a human-readable description of all registered formulas.
 * Useful for injecting into AI system prompts.
 */
export function getFormulaDescriptions(registry: FormulaRegistry): string[] {
  return registry.getAll().map(f => {
    const desc = f.description ? ` — ${f.description}` : '';
    return `${f.metricId} = ${f.expression}${desc}`;
  });
}
