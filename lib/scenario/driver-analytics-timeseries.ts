/**
 * Quarterly driver trends for BD Driver Analytics — illustrative actuals through FY25
 * and directional projections FY26–FY27 aligned to public disclosure narratives.
 * Replace with DB-backed series when operational metrics are wired.
 */

export interface DriverTimeSeries {
    /** Quarter labels, oldest → newest */
    labels: string[];
    values: number[];
    /** First index of projected / extrapolated segment */
    splitIndex: number;
    /** Short axis descriptor */
    valueAxisLabel: string;
    footnote: string;
}

const HIST_LABELS = [
    'Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24',
    'Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25',
];
const PROJ_LABELS = [
    'Q1 FY26', 'Q2 FY26', 'Q3 FY26', 'Q4 FY26',
    'Q1 FY27', 'Q2 FY27', 'Q3 FY27', 'Q4 FY27',
];

const ALL_LABELS = [...HIST_LABELS, ...PROJ_LABELS];
const SPLIT = HIST_LABELS.length;

const SERIES: Record<string, Omit<DriverTimeSeries, 'labels' | 'splitIndex'>> = {
    'glp1-volume-growth': {
        values: [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
        valueAxisLabel: '% YoY growth',
        footnote: 'BioPharma Systems GLP-1 device revenue growth YoY; driven by GLP-1 drug manufacturer procurement ramp for prefillable syringes and auto-injectors. FY24-FY25 baseline growth; FY26-FY27 acceleration as obesity drug production scales globally.',
    },
    'alaris-ramp-rate': {
        values: [0, 0, 0, 10, 20, 30, 40, 55, 70, 80, 90, 100, 115, 130, 145, 160],
        valueAxisLabel: 'placements/quarter',
        footnote: 'BD Alaris infusion pump capital placements per quarter following consent decree resolution. FY24 pre-ramp; FY25 early ramp as FDA remediation completes; FY26-FY27 acceleration toward 150-200 placements/quarter target.',
    },
    'china-vobp-headwind': {
        values: [0, 20, 45, 70, 90, 100, 110, 120, 130, 140, 145, 148, 150, 150, 148, 145],
        valueAxisLabel: '$M headwind',
        footnote: 'China VoBP (Volume-Based Procurement) annual revenue headwind ($M). FY24 rounds begin affecting BD products; FY25-FY26 headwind plateaus as VoBP coverage stabilizes. Emerging market offsets partially mitigate over time.',
    },
    'us-volume-growth': {
        values: [2.0, 2.2, 2.5, 2.8, 3.0, 3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.7, 5.0, 5.2, 5.5, 5.8],
        valueAxisLabel: '% YoY',
        footnote: 'BD North America core volume growth YoY; driven by hospital channel recovery, GPO contract wins, and procedural volume normalization post-COVID. FY26-FY27 acceleration from Alaris ramp and Medical Essentials market share gains.',
    },
    'connected-care-growth': {
        values: [1.5, 1.8, 2.0, 2.2, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 5.8, 6.0, 6.2, 6.5, 6.8],
        valueAxisLabel: '% YoY',
        footnote: 'Connected Care segment organic revenue growth YoY; includes medication management systems and infusion therapy. FY25 recovery as Alaris returns to market; FY26-FY27 growth accelerates with hospital replacements and new accounts.',
    },
    'biopharma-pricing': {
        values: [2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5],
        valueAxisLabel: '% net pricing',
        footnote: 'BioPharma Systems net pricing realization % — BD price increases net of VoBP headwind and customer contract adjustments. Positive pricing maintained through product mix and geographic diversification.',
    },
    'emerging-markets-offset': {
        values: [1.0, 1.2, 1.4, 1.5, 1.6, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8],
        valueAxisLabel: '% revenue offset',
        footnote: 'BD emerging markets revenue growth as offset to China VoBP headwind. Growth in India, Southeast Asia, and Middle East partially replaces lost China revenue. BD targeting double-digit emerging markets growth through FY27.',
    },
    'fcf-conversion': {
        values: [75, 76, 78, 79, 80, 81, 82, 83, 84, 85, 85, 86, 86, 87, 87, 88],
        valueAxisLabel: '% conversion',
        footnote: 'BD FCF conversion rate (FCF as % of adj. net income). FY24 lower due to restructuring cash outflows; FY25-FY27 improvement as BD Simplify program cash costs normalize and working capital optimizes.',
    },
    'capacity-utilization': {
        values: [74, 75, 76, 77, 78, 79, 80, 80, 81, 82, 82, 82, 83, 83, 84, 85],
        valueAxisLabel: '% utilization',
        footnote: 'BD manufacturing capacity utilization %. FY24-FY25 optimization from BD Simplify manufacturing footprint rationalization; FY26-FY27 volume ramp (GLP-1 demand, Alaris) drives utilization higher toward target 85%+.',
    },
    'fx-impact-revenue': {
        values: [-80, -70, -60, -55, -50, -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5],
        valueAxisLabel: '$M headwind',
        footnote: 'BD FX translation revenue headwind ($M quarterly). ~50% of BD revenue is international; EUR, CNY, JPY are primary exposures. Gradual improvement as USD weakens vs FY24-FY25 peaks and hedging program matures.',
    },
    'hedging-benefit': {
        values: [5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 30, 30, 30, 30, 30],
        valueAxisLabel: '$M benefit',
        footnote: 'BD FX hedging program benefit ($M quarterly) from forward contracts and options. BD has expanded hedging coverage through FY27; benefit grows as program matures and covers larger share of international revenue.',
    },
    'debt-paydown-rate': {
        values: [200, 250, 300, 350, 400, 450, 500, 500, 500, 500, 550, 550, 600, 600, 600, 650],
        valueAxisLabel: '$M annual paydown',
        footnote: 'BD annual gross debt reduction from FCF allocation ($M). FY25 ramp-up as FCF improves; FY26-FY27 sustains $500-650M annual paydown targeting <2.5x net leverage by FY27.',
    },
    'mms-capital-placements': {
        values: [0, 0, 5, 10, 20, 30, 40, 55, 70, 80, 90, 100, 115, 130, 145, 160],
        valueAxisLabel: 'placements/quarter',
        footnote: 'BD Alaris MMS (Medication Management System) capital placements per quarter — same as alaris-ramp-rate; shown separately for MMS portfolio tracking vs. broader connected care volume.',
    },
    'international-mix-shift': {
        values: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0],
        valueAxisLabel: 'pp mix shift',
        footnote: 'International revenue mix shift (pp) away from VoBP-impacted categories (primarily China) toward emerging markets and developed market growth. Gradual multi-year portfolio rebalancing.',
    },
    'interest-expense-savings': {
        values: [0, 2, 5, 8, 10, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        valueAxisLabel: '$M quarterly savings',
        footnote: 'BD quarterly interest expense savings ($M) from cumulative debt paydown. Each $1B debt reduction at ~6% saves ~$15M quarterly. Grows as debt reduction compounds.',
    },
};

export function getDriverTimeseries(leverId: string): DriverTimeSeries | null {
    const row = SERIES[leverId];
    if (!row) return null;
    if (row.values.length !== ALL_LABELS.length) {
        throw new Error(`driver-analytics-timeseries: length mismatch for ${leverId}`);
    }
    return {
        labels: ALL_LABELS,
        values: row.values,
        splitIndex: SPLIT,
        valueAxisLabel: row.valueAxisLabel,
        footnote: row.footnote,
    };
}
