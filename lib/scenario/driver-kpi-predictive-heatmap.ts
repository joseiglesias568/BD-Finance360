/**
 * Illustrative driver × executive-KPI linkage priors for the BD Driver Analytics heat map.
 * Combines CFO pillar alignment, contribution salience, and pairwise driver correlation priors.
 * Not empirical forecast accuracy — replace with rolling regression / IC when series exist.
 */

import type { AllocationPillar } from '@/lib/scenario/allocation-frontier';
import { leverAllocationPillar } from '@/lib/scenario/allocation-frontier';
import {
    DRIVER_ANALYTICS_TREE,
    contributionScore,
    flattenLeverNodes,
    getDriverCorrelation,
} from '@/lib/scenario/driver-analytics-model';

export interface DriverKpiHeatmapColumn {
    id: string;
    /** Short header for grid cells */
    label: string;
    /** Maps to themes called out on Executive Summary / monthly bridge */
    executiveLens: string;
    /** Weights sum to 1 — which CFO pillars this KPI draws signal from */
    pillarWeights: Partial<Record<AllocationPillar, number>>;
}

const KPI_COLUMNS: DriverKpiHeatmapColumn[] = [
    {
        id: 'organic_revenue',
        label: 'Organic Rev.',
        executiveLens: 'BD organic revenue growth (ex-FX, ex-acquisitions)',
        pillarWeights: { revenue_growth: 1 },
    },
    {
        id: 'adj_operating_margin',
        label: 'Adj. Op. Margin',
        executiveLens: 'Adjusted operating income margin (~25% baseline)',
        pillarWeights: { productivity_cost: 0.65, revenue_growth: 0.35 },
    },
    {
        id: 'biopharma_glp1',
        label: 'BioPharma / GLP-1',
        executiveLens: 'BioPharma Systems GLP-1 device revenue & pipeline growth',
        pillarWeights: { revenue_growth: 0.70, productivity_cost: 0.30 },
    },
    {
        id: 'bd_simplify',
        label: 'BD Simplify',
        executiveLens: 'SG&A efficiency & BD Simplify cost savings progress',
        pillarWeights: { productivity_cost: 0.60, loyalty_digital: 0.40 },
    },
    {
        id: 'leverage_fcf',
        label: 'Leverage / FCF',
        executiveLens: 'Balance sheet deleveraging (<2.5x target) & free cash flow conversion',
        pillarWeights: { balance_sheet: 0.75, productivity_cost: 0.25 },
    },
    {
        id: 'alaris_connected_care',
        label: 'Alaris / CC',
        executiveLens: 'BD Alaris market return & Connected Care segment organic growth',
        pillarWeights: { revenue_growth: 0.60, balance_sheet: 0.40 },
    },
];

function pillarAlignment(leverPillar: AllocationPillar, col: DriverKpiHeatmapColumn): number {
    let num = 0;
    let den = 0;
    for (const [p, w] of Object.entries(col.pillarWeights)) {
        if (!w) continue;
        den += w;
        if (p === leverPillar) num += w;
    }
    return den > 0 ? num / den : 0;
}

function peerCorrBlend(driverId: string, col: DriverKpiHeatmapColumn, allDriverIds: string[]): number {
    let sum = 0;
    let den = 0;
    for (const [p, w] of Object.entries(col.pillarWeights)) {
        if (!w) continue;
        const pillar = p as AllocationPillar;
        const peers = allDriverIds.filter((id) => id !== driverId && leverAllocationPillar(id) === pillar);
        const avg =
            peers.length === 0
                ? 0
                : peers.reduce((acc, id) => acc + getDriverCorrelation(driverId, id), 0) / peers.length;
        sum += avg * w;
        den += w;
    }
    return den > 0 ? sum / den : 0;
}

/** Economic sign: when a higher lever value is adverse for this KPI lens, flip to negative association. */
function expectNegativeAssociation(driverId: string, kpiId: string): boolean {
    // China VoBP headwind: higher value = larger drag on revenue and AOI
    if (driverId === 'china-vobp-headwind') {
        return ['organic_revenue', 'adj_operating_margin', 'biopharma_glp1', 'leverage_fcf'].includes(kpiId);
    }
    // FX headwind: higher (less negative / more positive) headwind hurts revenue KPIs
    if (driverId === 'fx-impact-revenue' && kpiId === 'organic_revenue') {
        return true; // FX headwind reduces reported organic revenue
    }
    // International mix shift: portfolio rebalancing away from high-margin China is margin-dilutive near term
    if (driverId === 'international-mix-shift' && kpiId === 'adj_operating_margin') {
        return true; // near-term margin dilution as EM mix increases
    }
    return false;
}

export function orderedDriverLeverIds(): string[] {
    return flattenLeverNodes(DRIVER_ANALYTICS_TREE).map((n) => n.leverIds![0]);
}

export function buildDriverKpiHeatmapMatrix(driverIds: string[]): {
    columns: DriverKpiHeatmapColumn[];
    matrix: number[][];
} {
    const matrix = driverIds.map((d) => {
        const lp = leverAllocationPillar(d);
        const contrib = contributionScore(d) / 100;
        return KPI_COLUMNS.map((col) => {
            const align = pillarAlignment(lp, col);
            const peer = peerCorrBlend(d, col, driverIds);
            let v = 0.58 * align * contrib + 0.42 * peer * (0.28 + 0.72 * align);
            if (expectNegativeAssociation(d, col.id)) v = -Math.abs(v);
            return Math.max(-1, Math.min(1, v));
        });
    });
    return { columns: KPI_COLUMNS, matrix };
}
