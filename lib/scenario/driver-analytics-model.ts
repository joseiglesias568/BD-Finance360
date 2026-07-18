/**
 * BD CFO driver tree + illustrative correlation / multicollinearity scaffolding.
 * Four-segment cascade: Medical Essentials, Connected Care, BioPharma Systems, Interventional.
 * Correlations are structural priors for dialogue — replace with empirical covariances when time-series are wired.
 */

import type { ScenarioLever } from '@/config/types';

export type DriverTiming = 'leading' | 'lagging' | 'coincident';

export interface DriverTreeNode {
    id: string;
    label: string;
    subtitle?: string;
    /** Bridge target on the BD P&L */
    plBridge: string;
    timing?: DriverTiming;
    leverIds?: string[];
    children?: DriverTreeNode[];
}

export const DRIVER_ANALYTICS_TREE: DriverTreeNode = {
    id: 'cfo-root',
    label: 'CFO value creation lens',
    subtitle: 'BD four-segment bridge: Medical Essentials, Connected Care, BioPharma Systems, Interventional',
    plBridge: 'Adjusted Operating Income',
    timing: 'coincident',
    children: [
        {
            id: 'revenue-growth-drivers',
            label: 'Organic Revenue Growth Drivers',
            plBridge: 'BD consolidated organic revenue (ex-FX, ex-acquisitions)',
            timing: 'leading',
            children: [
                {
                    id: 'glp1-demand',
                    label: 'GLP-1 device demand (BioPharma Systems)',
                    plBridge: 'BioPharma Systems revenue (prefillable syringe & auto-injector)',
                    timing: 'leading',
                    leverIds: ['glp1-volume-growth'],
                },
                {
                    id: 'alaris-ramp',
                    label: 'Alaris market return (Connected Care)',
                    plBridge: 'Connected Care revenue (Alaris infusion + dispensing)',
                    timing: 'lagging',
                    leverIds: ['alaris-ramp-rate'],
                },
                {
                    id: 'us-volume',
                    label: 'US core volume growth',
                    plBridge: 'BD North America segment organic volume growth',
                    timing: 'coincident',
                    leverIds: ['us-volume-growth'],
                },
                {
                    id: 'emerging-markets',
                    label: 'Emerging markets offset to China VoBP',
                    plBridge: 'BD international revenue ex-China (offset to VoBP headwind)',
                    timing: 'leading',
                    leverIds: ['emerging-markets-offset'],
                },
            ],
        },
        {
            id: 'china-vobp-risk',
            label: 'China VoBP Headwind Management',
            plBridge: 'BD China revenue (Volume-Based Procurement impact)',
            timing: 'lagging',
            children: [
                {
                    id: 'vobp-headwind-node',
                    label: 'China VoBP round impact ($M)',
                    plBridge: 'BD China revenue — VoBP pricing headwind across targeted product categories',
                    timing: 'coincident',
                    leverIds: ['china-vobp-headwind'],
                },
                {
                    id: 'international-mix',
                    label: 'International portfolio mix shift',
                    plBridge: 'BD international revenue mix (shift away from VoBP-impacted categories)',
                    timing: 'lagging',
                    leverIds: ['international-mix-shift'],
                },
            ],
        },
        {
            id: 'margin-efficiency',
            label: 'Operating Margin & Cost Efficiency',
            plBridge: 'BD adjusted operating income margin (~25% baseline)',
            timing: 'coincident',
            children: [
                {
                    id: 'biopharma-pricing-node',
                    label: 'BioPharma Systems net pricing',
                    plBridge: 'BioPharma Systems revenue — net price realization after VoBP',
                    timing: 'leading',
                    leverIds: ['biopharma-pricing'],
                },
                {
                    id: 'capacity-node',
                    label: 'Manufacturing capacity utilization',
                    plBridge: 'BD cost of products sold (fixed cost absorption)',
                    timing: 'coincident',
                    leverIds: ['capacity-utilization'],
                },
                {
                    id: 'connected-care-growth-node',
                    label: 'Connected Care organic growth',
                    plBridge: 'Connected Care segment revenue and margin',
                    timing: 'coincident',
                    leverIds: ['connected-care-growth'],
                },
            ],
        },
        {
            id: 'capital-structure',
            label: 'Capital Structure & Free Cash Flow',
            plBridge: 'BD net income and free cash flow generation',
            timing: 'lagging',
            children: [
                {
                    id: 'fcf-node',
                    label: 'FCF conversion rate',
                    plBridge: 'BD free cash flow (adj. net income × conversion rate)',
                    timing: 'coincident',
                    leverIds: ['fcf-conversion'],
                },
                {
                    id: 'debt-paydown-node',
                    label: 'Debt paydown from FCF',
                    plBridge: 'BD balance sheet — net debt reduction and interest savings',
                    timing: 'lagging',
                    leverIds: ['debt-paydown-rate'],
                },
                {
                    id: 'fx-hedging-node',
                    label: 'FX impact & hedging benefit',
                    plBridge: 'BD other income (hedging gains vs. translation headwind)',
                    timing: 'coincident',
                    leverIds: ['fx-impact-revenue', 'hedging-benefit'],
                },
            ],
        },
    ],
};

/**
 * Pairwise Pearson-like correlation priors (−1 … 1) for BD drivers that co-move across cycles.
 * Priors reflect GLP-1 demand, Alaris ramp, China VoBP, FX, and capital structure dynamics.
 */
const CORR: Record<string, Record<string, number>> = {
    'glp1-volume-growth': {
        'biopharma-pricing': 0.62,               // volume growth and pricing both driven by GLP-1 drug demand
        'us-volume-growth': 0.55,                // GLP-1 device demand supports US volume broadly
        'capacity-utilization': 0.70,            // higher GLP-1 volume drives manufacturing utilization
        'emerging-markets-offset': 0.38,         // EM expansion partially driven by global GLP-1 penetration
    },
    'alaris-ramp-rate': {
        'mms-capital-placements': 0.95,          // essentially same metric from different portfolio view
        'connected-care-growth': 0.85,           // Alaris placements directly drive Connected Care revenue
        'us-volume-growth': 0.48,                // Alaris ramp supports overall US hospital volume recovery
        'capacity-utilization': 0.42,            // higher Alaris production drives utilization
    },
    'mms-capital-placements': {
        'alaris-ramp-rate': 0.95,
        'connected-care-growth': 0.80,
        'us-volume-growth': 0.45,
    },
    'connected-care-growth': {
        'alaris-ramp-rate': 0.85,
        'mms-capital-placements': 0.80,
        'us-volume-growth': 0.55,                // Connected Care growth co-moves with US hospital volume
    },
    'us-volume-growth': {
        'glp1-volume-growth': 0.55,
        'alaris-ramp-rate': 0.48,
        'connected-care-growth': 0.55,
        'capacity-utilization': 0.65,            // volume growth drives utilization
    },
    'biopharma-pricing': {
        'glp1-volume-growth': 0.62,
        'china-vobp-headwind': -0.45,            // VoBP pricing headwind offsets BD's pricing power in China
        'emerging-markets-offset': 0.35,         // EM pricing supports overall BioPharma pricing realization
    },
    'china-vobp-headwind': {
        'biopharma-pricing': -0.45,
        'international-mix-shift': 0.58,         // VoBP headwind directly drives mix shift away from China
        'emerging-markets-offset': 0.42,         // VoBP drives EM growth investment as partial offset
    },
    'international-mix-shift': {
        'china-vobp-headwind': 0.58,
        'emerging-markets-offset': 0.65,         // mix shift and EM growth are complementary strategies
        'fx-impact-revenue': -0.38,              // diversified international mix partially offsets FX concentration
    },
    'emerging-markets-offset': {
        'china-vobp-headwind': 0.42,
        'international-mix-shift': 0.65,
        'glp1-volume-growth': 0.38,
        'biopharma-pricing': 0.35,
    },
    'capacity-utilization': {
        'glp1-volume-growth': 0.70,
        'us-volume-growth': 0.65,
        'alaris-ramp-rate': 0.42,
    },
    'fcf-conversion': {
        'debt-paydown-rate': 0.72,               // higher FCF conversion directly enables debt paydown
        'interest-expense-savings': 0.65,        // debt paydown drives interest savings
        'capacity-utilization': 0.38,            // higher utilization improves operating leverage and FCF
    },
    'debt-paydown-rate': {
        'fcf-conversion': 0.72,
        'interest-expense-savings': 0.88,        // debt paydown is the primary driver of interest savings
    },
    'interest-expense-savings': {
        'debt-paydown-rate': 0.88,
        'fcf-conversion': 0.65,
    },
    'fx-impact-revenue': {
        'hedging-benefit': -0.60,                // hedging program partially offsets FX headwind
        'international-mix-shift': -0.38,
    },
    'hedging-benefit': {
        'fx-impact-revenue': -0.60,
    },
};

export function getDriverCorrelation(a: string, b: string): number {
    if (a === b) return 1;
    return CORR[a]?.[b] ?? CORR[b]?.[a] ?? 0;
}

/** Simple multicollinearity alert: max |r| with peers in same branch. */
export function collinearityBand(leverId: string, peers: string[]): 'low' | 'moderate' | 'high' {
    let maxR = 0;
    for (const p of peers) {
        if (p === leverId) continue;
        maxR = Math.max(maxR, Math.abs(getDriverCorrelation(leverId, p)));
    }
    if (maxR >= 0.65) return 'high';
    if (maxR >= 0.4) return 'moderate';
    return 'low';
}

/** Structural contribution score (0–100) — BD driver salience vs AOI bridge. */
const CONTRIBUTION_SCORE: Record<string, number> = {
    'glp1-volume-growth': 95,                    // primary BioPharma Systems EPS driver; GLP-1 device demand acceleration
    'alaris-ramp-rate': 90,                      // Alaris market return; direct Connected Care revenue catalyst
    'us-volume-growth': 85,                      // broad US organic volume; anchors Medical Essentials base
    'china-vobp-headwind': 82,                   // largest single risk; $150M annual headwind plan
    'connected-care-growth': 80,                 // Connected Care organic growth; MMS + infusion therapy
    'fcf-conversion': 78,                        // FCF conversion drives deleveraging and capital return
    'biopharma-pricing': 75,                     // net pricing realization in high-margin BioPharma Systems
    'debt-paydown-rate': 72,                     // balance sheet deleveraging toward <2.5x target
    'fx-impact-revenue': 70,                     // ~50% international revenue; FX headwind management
    'mms-capital-placements': 68,                // MMS capital placements; Alaris portfolio tracker
    'capacity-utilization': 65,                  // fixed cost absorption; GLP-1 + Alaris volume ramp
    'emerging-markets-offset': 62,               // EM growth as structural China VoBP offset
    'hedging-benefit': 58,                       // FX hedging program maturity; $30M+ quarterly target
    'international-mix-shift': 55,               // portfolio rebalancing away from VoBP-impacted categories
    'interest-expense-savings': 52,              // interest savings from cumulative debt paydown
};

export function contributionScore(leverId: string): number {
    return CONTRIBUTION_SCORE[leverId] ?? 50;
}

export function timingLabel(t: DriverTiming | undefined): string {
    switch (t) {
        case 'leading':
            return 'Leading — tends to move before the parent P&L line fully reflects it.';
        case 'lagging':
            return 'Lagging — often confirms after clinical, formulary, or regulatory proceedings work through cost and revenue bases.';
        default:
            return 'Coincident — moves in the same reporting window as the bridged line item.';
    }
}

export function flattenLeverNodes(root: DriverTreeNode): DriverTreeNode[] {
    const out: DriverTreeNode[] = [];
    const walk = (n: DriverTreeNode) => {
        if (n.leverIds?.length) out.push(n);
        n.children?.forEach(walk);
    };
    walk(root);
    return out;
}

export function findLeverNode(root: DriverTreeNode, leverId: string): DriverTreeNode | null {
    const hit = flattenLeverNodes(root).find((n) => n.leverIds?.includes(leverId));
    return hit ?? null;
}

/** Peer drivers = other levers under the same major CFO branch (sibling subtree). */
export function peerLeverIds(root: DriverTreeNode, leverId: string): string[] {
    function collectAllLeverIdsUnder(node: DriverTreeNode): string[] {
        const ids = [...(node.leverIds ?? [])];
        node.children?.forEach((ch) => ids.push(...collectAllLeverIdsUnder(ch)));
        return ids;
    }

    for (const branch of root.children ?? []) {
        const ids = collectAllLeverIdsUnder(branch);
        if (ids.includes(leverId)) {
            return ids.filter((id) => id !== leverId);
        }
    }
    return [];
}

export function leverMetaFromDb(levers: ScenarioLever[], leverId: string): ScenarioLever | undefined {
    return levers.find((l) => l.id === leverId);
}
