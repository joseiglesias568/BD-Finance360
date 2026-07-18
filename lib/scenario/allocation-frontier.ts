/**
 * Marginal operating-income sensitivities and illustrative allocation samples
 * for "last dollar" CFO framing (growth vs productivity vs balance sheet vs digital health).
 */

import type { ScenarioBaselinePL, ScenarioLever } from '@/config/types';
import { calculateImpact, type LeverDef } from '@/lib/scenario-engine';

export type AllocationPillar =
    | 'revenue_growth'
    | 'productivity_cost'
    | 'balance_sheet'
    | 'loyalty_digital';

export const LEVER_TO_PILLAR: Record<string, AllocationPillar> = {
    // Revenue growth drivers
    'glp1-volume-growth': 'revenue_growth',
    'us-volume-growth': 'revenue_growth',
    'connected-care-growth': 'revenue_growth',
    'biopharma-pricing': 'revenue_growth',
    'alaris-ramp-rate': 'revenue_growth',
    'mms-capital-placements': 'revenue_growth',
    'emerging-markets-offset': 'revenue_growth',
    // Productivity & cost management
    'china-vobp-headwind': 'productivity_cost',
    'capacity-utilization': 'productivity_cost',
    'international-mix-shift': 'productivity_cost',
    // Balance sheet / capital structure
    'debt-paydown-rate': 'balance_sheet',
    'interest-expense-savings': 'balance_sheet',
    'fcf-conversion': 'balance_sheet',
    // Digital & innovation
    'fx-impact-revenue': 'loyalty_digital',
    'hedging-benefit': 'loyalty_digital',
};

export function leverAllocationPillar(leverId: string): AllocationPillar {
    return LEVER_TO_PILLAR[leverId] ?? 'productivity_cost';
}

/** Drivers where a higher lever value is adverse — improvement direction is decreasing the lever. */
const LOWER_IS_IMPROVEMENT = new Set(['china-vobp-headwind', 'fx-impact-revenue']);

export interface LeverMarginalOi {
    leverId: string;
    name: string;
    pillar: AllocationPillar;
    unit: string;
    /** Δ operating income ($M) for a one-step move at the current position (signed). */
    marginalOiPerStep: number;
    pillarLabel: string;
}

export interface FrontierPoint {
    weights: Record<AllocationPillar, number>;
    operatingIncomeDelta: number;
    revenueDelta: number;
}

const PILLAR_LABEL: Record<AllocationPillar, string> = {
    revenue_growth: 'Revenue & organic growth',
    productivity_cost: 'Cost management & VoBP mitigation',
    balance_sheet: 'Capital structure & FCF',
    loyalty_digital: 'FX management & digital health',
};

function leverDefsFromLevers(levers: ScenarioLever[]): LeverDef[] {
    return levers.map((l) => ({ id: l.id, min: l.min, max: l.max, default: l.default }));
}

/**
 * Central finite-difference gradient for each lever vs current scenario OI.
 */
export function computeMarginalOperatingIncomeGradients(
    leverValues: Record<string, number>,
    levers: ScenarioLever[],
    baselineRevenueB: number,
    baselinePL: ScenarioBaselinePL | undefined,
): LeverMarginalOi[] {
    const leverDefs = leverDefsFromLevers(levers);
    const out: LeverMarginalOi[] = [];

    for (const L of levers) {
        const cur = leverValues[L.id] ?? L.default;
        const span = L.max - L.min;
        const step = Math.max(L.step, span * 0.003);
        const up = Math.min(L.max, cur + step);
        const down = Math.max(L.min, cur - step);
        const effStep = up - down || step;

        const oiUp = calculateImpact({ ...leverValues, [L.id]: up }, baselineRevenueB, baselinePL, leverDefs).operatingIncome;
        const oiDown = calculateImpact({ ...leverValues, [L.id]: down }, baselineRevenueB, baselinePL, leverDefs).operatingIncome;

        const derivative = effStep > 0 ? (oiUp - oiDown) / effStep : 0;
        const marginalOiPerStep = derivative * L.step;
        const pillar = leverAllocationPillar(L.id);

        out.push({
            leverId: L.id,
            name: L.name,
            pillar,
            unit: L.unit,
            marginalOiPerStep,
            pillarLabel: PILLAR_LABEL[pillar],
        });
    }

    return out.sort((a, b) => Math.abs(b.marginalOiPerStep) - Math.abs(a.marginalOiPerStep));
}

/**
 * Random convex combinations of pillar weights → small coordinated lever bumps → scatter of OI vs revenue deltas.
 * Illustrative efficient-set visualization, not an optimizer.
 */
export function sampleAllocationFrontier(
    leverValues: Record<string, number>,
    levers: ScenarioLever[],
    baselineRevenueB: number,
    baselinePL: ScenarioBaselinePL | undefined,
    samples = 100,
): FrontierPoint[] {
    const leverDefs = leverDefsFromLevers(levers);
    const pillars: AllocationPillar[] = [
        'revenue_growth',
        'productivity_cost',
        'balance_sheet',
        'loyalty_digital',
    ];
    const points: FrontierPoint[] = [];

    for (let i = 0; i < samples; i++) {
        const raw = pillars.map(() => Math.random());
        const s = raw.reduce((a, b) => a + b, 0) || 1;
        const weights = Object.fromEntries(pillars.map((p, j) => [p, raw[j] / s])) as Record<
            AllocationPillar,
            number
        >;

        const perturbed = { ...leverValues };
        const intensity = 0.015;

        for (const L of levers) {
            const pillar = LEVER_TO_PILLAR[L.id];
            if (!pillar) continue;
            const w = weights[pillar];
            const span = L.max - L.min;
            const cur = perturbed[L.id] ?? L.default;
            let bump = w * intensity * span;
            if (LOWER_IS_IMPROVEMENT.has(L.id)) {
                bump = -bump;
            }
            perturbed[L.id] = Math.max(L.min, Math.min(L.max, cur + bump));
        }

        const r = calculateImpact(perturbed, baselineRevenueB, baselinePL, leverDefs);
        points.push({
            weights,
            operatingIncomeDelta: r.operatingIncome,
            revenueDelta: r.revenue,
        });
    }

    return points;
}

export function pillarMarginalTotals(gradients: LeverMarginalOi[]): Record<AllocationPillar, number> {
    const acc: Record<AllocationPillar, number> = {
        revenue_growth: 0,
        productivity_cost: 0,
        balance_sheet: 0,
        loyalty_digital: 0,
    };
    for (const g of gradients) {
        acc[g.pillar] += g.marginalOiPerStep;
    }
    return acc;
}
