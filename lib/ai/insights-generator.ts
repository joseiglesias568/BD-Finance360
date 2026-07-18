// ════════════════════════════════════════════════════════════════════════════
// AMEREN CORPORATION AI INSIGHTS GENERATOR
// ════════════════════════════════════════════════════════════════════════════
// Deterministic generator that traverses the semantic business architecture
// to produce 3,000-4,500 rich, analyst-quality AI insights for seeding.
//
// Each insight maps to the Prisma PersonalizedInsight model (minus id/companyId).
// The generator is pure TypeScript with no external dependencies.
// ════════════════════════════════════════════════════════════════════════════

import type { SemanticMetric, SemanticDriver, SemanticConsole } from '../semantic/types';
import { allSemanticConsoles } from '../semantic';
import { SemanticEngine } from '../semantic/engine';
import type { ComputedMetric, MetricStatus } from '../semantic/engine';

// ════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════

export type InsightType =
    | 'fact'
    | 'trend'
    | 'variance'
    | 'anomaly'
    | 'forecast'
    | 'what-if'
    | 'root-cause'
    | 'cross-reference';

export type InsightLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type TrendDirection = 'up' | 'down' | 'flat';

export interface RelatedDrivers {
    consoleId: string;
    consoleName: string;
    driverId: string;
    driverPath: string[];
    metricId: string;
    metricName: string;
    fiscalPeriod: string;
    segment: string;
    insightType: InsightType;
    crossReferenceDriverIds: string[];
    kpiLabel: string;
    value: string;
    dataSource: string;
    impactedMetrics: Array<{ metric: string; value: string; trend: string }>;
    historicalContext: string;
    predictiveInsight: string;
}

export interface InsightSeed {
    title: string;
    category: string;
    insightLevel: InsightLevel;
    metricId: string;
    kpiValue: string;
    trendDirection: TrendDirection;
    priority: Priority;
    summary: string;
    confidenceScore: number;
    consoleLink: string;
    recommendations: string[];
    relatedDrivers: RelatedDrivers;
}

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════

const FISCAL_PERIODS = ['Q4 FY24', 'Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26'] as const;
const CURRENT_PERIOD = 'Q1 FY26';

export const INSIGHT_TYPE_TO_LEVEL: Record<InsightType, InsightLevel> = {
    'fact': 'L1',
    'trend': 'L1',
    'variance': 'L2',
    'anomaly': 'L2',
    'forecast': 'L3',
    'what-if': 'L4',
    'root-cause': 'L5',
    'cross-reference': 'L2',
};

const CATEGORY_MAP: Record<string, string> = {
    'revenue-market': 'Revenue & Market',
    'store-operations': 'Service Delivery & Operations',
    'digital-customer': 'Digital & Client Experience',
    'people-culture': 'Service Delivery & Operations',
    'financial-stewardship': 'Financial Performance',
    'financial': 'Financial Performance',
    'risk-sustainability': 'Risk & Sustainability',
};

// Segment display names
const SEGMENT_DISPLAY: Record<string, string> = {
    'north-america': 'BD Care Benefits',
    'international': 'BD Services',
    'channel-development': 'CVS Pharmacy Gas Transmission',
    'corporate': 'Corporate',
    'cross-cutting': 'Enterprise',
};

// ════════════════════════════════════════════════════════════════════════════
// DETERMINISTIC HASH AND RANDOM UTILITIES
// ════════════════════════════════════════════════════════════════════════════

/** Simple deterministic hash (djb2) producing a 32-bit integer */
function hash(str: string): number {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

/** Seeded pseudo-random float in [0,1) */
function seededRandom(seed: string): number {
    return (hash(seed) % 10000) / 10000;
}

/** Seeded pseudo-random float in [min, max) */
function seededRange(seed: string, min: number, max: number): number {
    return min + seededRandom(seed) * (max - min);
}

/** Seeded pseudo-random integer in [min, max] inclusive */
function seededInt(seed: string, min: number, max: number): number {
    return Math.floor(seededRange(seed, min, max + 1));
}

/** Seeded boolean with given probability of true */
function seededBool(seed: string, probability: number): boolean {
    return seededRandom(seed) < probability;
}

/** Pick an element from an array using a seed */
function seededPick<T>(seed: string, arr: readonly T[]): T {
    return arr[hash(seed) % arr.length];
}

// ════════════════════════════════════════════════════════════════════════════
// DRIVER TREE TRAVERSAL
// ════════════════════════════════════════════════════════════════════════════

interface FlattenedMetricContext {
    console: SemanticConsole;
    driver: SemanticDriver;
    metric: SemanticMetric;
    driverPath: string[];
    depth: number;
    parentDriver?: SemanticDriver;
    crossReferences: string[];
    computedMetric?: ComputedMetric;
    computedStatus?: MetricStatus;
    healthScore?: number;
}

/** Recursively flatten a driver tree, collecting metrics with their context */
function flattenDriverMetrics(
    console: SemanticConsole,
    driver: SemanticDriver,
    path: string[],
    depth: number,
    parentDriver?: SemanticDriver,
): FlattenedMetricContext[] {
    const results: FlattenedMetricContext[] = [];
    const currentPath = [...path, driver.name];
    const crossRefs = driver.crossReferences ?? [];

    if (driver.metrics) {
        for (const metric of driver.metrics) {
            results.push({
                console,
                driver,
                metric,
                driverPath: currentPath,
                depth,
                parentDriver,
                crossReferences: crossRefs,
            });
        }
    }

    if (driver.children) {
        for (const child of driver.children) {
            results.push(
                ...flattenDriverMetrics(console, child, currentPath, depth + 1, driver),
            );
        }
    }

    return results;
}

/** Flatten all metrics across all consoles and enrich with computed data */
function getAllMetricContexts(): FlattenedMetricContext[] {
    const contexts: FlattenedMetricContext[] = [];
    const engine = SemanticEngine.getInstance();

    for (const console of allSemanticConsoles) {
        for (const driver of console.drivers) {
            contexts.push(
                ...flattenDriverMetrics(console, driver, [console.title], 0),
            );
        }
    }

    // Enrich each context with computed metric data from the engine
    for (const ctx of contexts) {
        const computedMetric = engine.getMetric(ctx.metric.id);
        if (computedMetric) {
            ctx.computedMetric = computedMetric;
            ctx.computedStatus = computedMetric.status;
        }
        const computedDriver = engine.getDriver(ctx.driver.id);
        if (computedDriver) {
            ctx.healthScore = computedDriver.healthScore;
        }
    }

    return contexts;
}

// ════════════════════════════════════════════════════════════════════════════
// VALUE SIMULATION
// ════════════════════════════════════════════════════════════════════════════

/** Parse a display value string to extract the numeric portion and sign */
function parseMetricValue(value: string | undefined): { num: number; prefix: string; suffix: string; isNeg: boolean } | null {
    if (!value) return null;
    // Handle ranges like "80-100", "$15.50-$22.00", "$3.35-$4.00"
    // Take the first number
    const cleaned = value.replace(/[~+]/g, '').trim();
    const match = cleaned.match(/^([^0-9\-.]*)([-]?\d+[,.]?\d*[KMB]?)(.*)$/);
    if (!match) return null;

    let prefix = match[1];
    let numStr = match[2].replace(/,/g, '');
    const suffix = match[3].trim();
    const isNeg = numStr.startsWith('-');
    if (isNeg) numStr = numStr.substring(1);

    // Handle K/M/B suffixes
    let multiplier = 1;
    if (numStr.endsWith('K')) { multiplier = 1000; numStr = numStr.slice(0, -1); }
    else if (numStr.endsWith('M')) { multiplier = 1000000; numStr = numStr.slice(0, -1); }
    else if (numStr.endsWith('B')) { multiplier = 1000000000; numStr = numStr.slice(0, -1); }

    const num = parseFloat(numStr) * multiplier;
    if (isNaN(num)) return null;

    // Normalize prefix
    if (!prefix && value.includes('$')) prefix = '$';

    return { num: isNeg ? -num : num, prefix, suffix, isNeg };
}

/** Generate a simulated value for a prior period */
function simulateValue(
    metric: SemanticMetric,
    periodIndex: number,
    seed: string,
): string {
    const base = parseMetricValue(metric.currentValue);
    if (!base) return metric.currentValue ?? 'N/A';

    // Periods are 0-5, current period (Q1 FY26) is index 5
    const periodsBack = 5 - periodIndex;
    const direction = metric.direction;

    // Calculate a drift: for "higher_is_better" the trend should generally improve
    // towards current. For "lower_is_better", the prior values should be higher.
    const volatility = seededRange(seed + ':vol', 0.02, 0.08);
    const noise = seededRange(seed + ':noise', -0.03, 0.03);

    let drift: number;
    if (direction === 'higher_is_better') {
        drift = -volatility * periodsBack + noise;
    } else if (direction === 'lower_is_better') {
        drift = volatility * periodsBack + noise;
    } else {
        drift = noise * periodsBack;
    }

    const simulated = base.num * (1 + drift);

    return formatSimulatedValue(simulated, metric, base);
}

/** Format a simulated numeric value back into display string */
function formatSimulatedValue(
    value: number,
    metric: SemanticMetric,
    base: { prefix: string; suffix: string },
): string {
    const absVal = Math.abs(value);
    const sign = value < 0 ? '-' : (metric.currentValue?.startsWith('+') ? '+' : '');

    if (metric.unit === 'percent') {
        if (absVal >= 100) return `${sign}${absVal.toFixed(0)}%`;
        if (absVal >= 10) return `${sign}${absVal.toFixed(1)}%`;
        return `${sign}${absVal.toFixed(1)}%`;
    }

    if (metric.unit === 'currency') {
        if (absVal >= 1_000_000_000) return `${sign}$${(absVal / 1_000_000_000).toFixed(1)}B`;
        if (absVal >= 1_000_000) return `${sign}$${(absVal / 1_000_000).toFixed(0)}M`;
        if (absVal >= 1_000) return `${sign}$${(absVal / 1_000).toFixed(1)}K`;
        return `${sign}$${absVal.toFixed(2)}`;
    }

    if (metric.unit === 'count') {
        if (absVal >= 1_000_000) return `${sign}${(absVal / 1_000_000).toFixed(1)}M`;
        if (absVal >= 1_000) return `${sign}${absVal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        return `${sign}${absVal.toFixed(0)}`;
    }

    if (metric.unit === 'ratio') {
        return `${sign}${absVal.toFixed(1)}x`;
    }

    if (metric.unit === 'time') {
        // For time values, return as minutes:seconds or just the number
        if (base.suffix.includes(':') || (metric.currentValue?.includes(':'))) {
            const mins = Math.floor(absVal);
            const secs = Math.round((absVal - mins) * 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        return `${absVal.toFixed(0)}`;
    }

    if (metric.unit === 'score' || metric.unit === 'index') {
        return `${sign}${absVal.toFixed(0)}`;
    }

    return `${sign}${base.prefix}${absVal.toFixed(1)}${base.suffix}`;
}

// ════════════════════════════════════════════════════════════════════════════
// TREND DIRECTION COMPUTATION
// ════════════════════════════════════════════════════════════════════════════

function computeTrend(metric: SemanticMetric, periodIndex: number, seed: string): TrendDirection {
    const r = seededRandom(seed + ':trend');
    if (metric.direction === 'higher_is_better') {
        // Generally trending up towards current, but with some noise
        if (periodIndex >= 4) return r < 0.7 ? 'up' : (r < 0.85 ? 'flat' : 'down');
        if (periodIndex >= 2) return r < 0.4 ? 'up' : (r < 0.7 ? 'flat' : 'down');
        return r < 0.3 ? 'up' : (r < 0.5 ? 'flat' : 'down');
    }
    if (metric.direction === 'lower_is_better') {
        // For lower_is_better, "down" is the favorable direction
        if (periodIndex >= 4) return r < 0.7 ? 'down' : (r < 0.85 ? 'flat' : 'up');
        return r < 0.4 ? 'down' : (r < 0.7 ? 'flat' : 'up');
    }
    return r < 0.33 ? 'up' : (r < 0.66 ? 'flat' : 'down');
}

// ════════════════════════════════════════════════════════════════════════════
// PRIORITY ASSIGNMENT
// ════════════════════════════════════════════════════════════════════════════

function assignPriority(seed: string, insightType: InsightType, hasTarget: boolean, computedStatus?: MetricStatus): Priority {
    const r = seededRandom(seed + ':priority');

    // Use computed metric status to ground priority in actual performance
    if (computedStatus === 'critical') {
        // Critical metrics get higher priority distribution
        if (r < 0.25) return 'critical';
        if (r < 0.65) return 'high';
        if (r < 0.90) return 'medium';
        return 'low';
    }
    if (computedStatus === 'good') {
        // Good metrics get lower priority (informational)
        if (r < 0.02) return 'critical';
        if (r < 0.12) return 'high';
        if (r < 0.55) return 'medium';
        return 'low';
    }

    // Root cause and anomaly insights tend to be higher priority
    if (insightType === 'root-cause' || insightType === 'anomaly') {
        if (r < 0.12) return 'critical';
        if (r < 0.50) return 'high';
        if (r < 0.85) return 'medium';
        return 'low';
    }

    // Variance with target = potentially higher priority
    if (insightType === 'variance' && hasTarget) {
        if (r < 0.08) return 'critical';
        if (r < 0.35) return 'high';
        if (r < 0.80) return 'medium';
        return 'low';
    }

    // Default distribution: ~5% critical, ~20% high, ~50% medium, ~25% low
    if (r < 0.05) return 'critical';
    if (r < 0.25) return 'high';
    if (r < 0.75) return 'medium';
    return 'low';
}

// ════════════════════════════════════════════════════════════════════════════
// CONFIDENCE SCORE
// ════════════════════════════════════════════════════════════════════════════

function assignConfidence(seed: string, insightType: InsightType): number {
    const base = {
        'fact': 95,
        'trend': 90,
        'variance': 92,
        'anomaly': 82,
        'forecast': 78,
        'what-if': 76,
        'root-cause': 80,
        'cross-reference': 85,
    }[insightType];

    const noise = seededRange(seed + ':conf', -5, 5);
    return Math.round(Math.min(98, Math.max(75, base + noise)) * 10) / 10;
}

// ════════════════════════════════════════════════════════════════════════════
// TEMPLATE-BASED TEXT GENERATION
// ════════════════════════════════════════════════════════════════════════════

// --- FACT templates ---
const FACT_TITLES: string[] = [
    '{metricName} at {value} in {period}',
    '{metricName} stands at {value} — {period}',
    '{segment}: {metricName} recorded at {value}',
    '{metricName} reported {value} for {period}',
    '{metricName} closes {period} at {value}',
];

const FACT_SUMMARIES: string[] = [
    '{metricName} came in at {value} for {period}, {trendWord} from the prior quarter. {consoleTitle} dashboards reflect this as {impactDescription}.',
    'For {period}, {metricName} was reported at {value}. This represents the latest data point in the {driverName} driver tree within {consoleTitle}.',
    '{segment} segment data shows {metricName} at {value} in {period}. The metric is tracked {frequency} and feeds into {driverName} analysis.',
    'The {period} reading for {metricName} is {value}, reflecting ongoing {trendWord2} dynamics in {consoleTitle}. Management is monitoring closely.',
    '{metricName} registered {value} during {period}. Within the {driverName} framework, this data point is {significanceNote}.',
];

// --- TREND templates ---
const TREND_TITLES: string[] = [
    '{metricName} {trendVerb} — {trendDetail}',
    '{trendAdj} trend in {metricName} across recent quarters',
    '{metricName}: {trendNarrative}',
    '{segment} {metricName} shows {trendAdj2} momentum',
    'Sequential {trendWord} in {metricName} — {period}',
];

const TREND_SUMMARIES: string[] = [
    '{metricName} has been {trendVerb2} over the past {numPeriods} quarters, moving from {priorValue} to {value}. {trendImplication}',
    'The {trendAdj} trajectory in {metricName} continues through {period}. Current value of {value} {comparedToPrior}. {strategicContext}',
    'Across the trailing {numPeriods}-quarter window, {metricName} shows a {trendAdj2} pattern. {period} came in at {value}, {trendNarrative2}.',
    '{consoleTitle} data reveals a {trendAdj} trend in {metricName}: {value} as of {period}. {trendDrivers}',
    '{metricName} {trendWord} momentum is {trendStrength} — the metric moved {trendDirection} to {value} in {period}. {outlookNote}',
];

// --- VARIANCE templates ---
const VARIANCE_TITLES: string[] = [
    '{metricName} {value} vs {target} target — {gapDescription}',
    'Gap to plan: {metricName} at {value} against {target}',
    '{metricName} trails target by {gapAmount}',
    '{segment}: {metricName} variance of {gapAmount} to plan',
    '{metricName} {gapDirection} target — {value} vs {target}',
];

const VARIANCE_SUMMARIES: string[] = [
    '{metricName} at {value} versus the {target} target represents a {gapAmount} gap. {varianceExplanation} Management has identified {actionCount} corrective actions.',
    'The {period} reading of {value} for {metricName} falls {gapDirection2} the {target} target. Within {consoleTitle}, this variance is driven by {varianceDrivers}.',
    '{segment} segment reports {metricName} at {value}, compared to the {target} plan. The {gapAmount} delta reflects {varianceNarrative}. {closingPath}',
    'Plan adherence for {metricName}: {value} actual vs {target} target ({gapAmount} variance). {varianceContext}',
    '{metricName} is tracking at {value} against a {target} target for {period}. The {gapDirection} variance of {gapAmount} is attributed to {varianceFactors}.',
];

// --- ANOMALY templates ---
const ANOMALY_TITLES: string[] = [
    'Unusual {trendWord} detected in {metricName} — {period}',
    '{metricName} deviation: {value} signals potential anomaly',
    'Alert: {metricName} outside expected range in {period}',
    '{segment} {metricName} shows atypical movement',
    'Statistical outlier: {metricName} at {value}',
];

const ANOMALY_SUMMARIES: string[] = [
    '{metricName} recorded {value} in {period}, deviating significantly from the trailing {numPeriods}-quarter average. {anomalyExplanation}',
    'An unusual reading of {value} in {metricName} was flagged during {period}. The {trendWord} movement exceeds 2 standard deviations from trend. {investigationNote}',
    '{consoleTitle} anomaly detection identified {metricName} at {value} in {period} as an outlier. {anomalyContext} Root cause investigation is recommended.',
    'The {period} value of {value} for {metricName} represents an atypical {trendWord} shift. {anomalyDrivers} The analytics team has flagged this for review.',
    '{metricName} moved to {value} in {period}, triggering an anomaly alert in the {driverName} monitoring system. {anomalyImpact}',
];

// --- FORECAST templates ---
const FORECAST_TITLES: string[] = [
    'Projecting {metricName} at {forecastValue} by {forecastPeriod}',
    '{metricName} forecast: {forecastValue} expected {forecastPeriod}',
    '{segment} outlook: {metricName} trajectory to {forecastValue}',
    'Forward view: {metricName} trending toward {forecastValue}',
    'FY26 projection for {metricName}: {forecastValue}',
];

const FORECAST_SUMMARIES: string[] = [
    'Based on trailing {numPeriods}-quarter trends and current momentum, {metricName} is projected to reach {forecastValue} by {forecastPeriod}. {forecastBasis}',
    'AI forecasting models project {metricName} at {forecastValue} for {forecastPeriod}, assuming {forecastAssumptions}. Confidence interval: {confidenceBand}.',
    '{consoleTitle} forward outlook places {metricName} at {forecastValue} by {forecastPeriod}. The projection incorporates {forecastInputs}. {forecastRisk}',
    'Machine learning models indicate {metricName} reaching {forecastValue} within {forecastHorizon}. Key drivers: {forecastDrivers}. {scenarioNote}',
    'The {metricName} trajectory suggests {forecastValue} is achievable by {forecastPeriod}. {forecastNarrative} {achievabilityNote}',
];

// --- WHAT-IF templates ---
const WHATIF_TITLES: string[] = [
    'If {scenarioCondition}, {scenarioOutcome}',
    'Scenario: {scenarioLabel} — {scenarioImpact}',
    'What-if analysis: {scenarioCondition} impact on {metricName}',
    '{segment} scenario: {scenarioLabel}',
    'Modeling {scenarioCondition} effect on {driverName}',
];

const WHATIF_SUMMARIES: string[] = [
    'Scenario modeling shows that if {scenarioCondition}, {metricName} would move from {value} to approximately {scenarioTarget}. {scenarioImplication} Net impact: {scenarioNetImpact}.',
    'What-if analysis: Assuming {scenarioCondition}, the model projects {scenarioOutcome2}. This scenario affects {impactedCount} downstream metrics across {consoleTitle}.',
    'Under the "{scenarioLabel}" scenario where {scenarioCondition}, {metricName} is modeled at {scenarioTarget}. {scenarioProbability} {scenarioRecommendation}',
    'If management executes on {scenarioCondition}, the projected impact is {scenarioOutcome2}. Sensitivity analysis shows {sensitivityNote}.',
    'Scenario analysis for {driverName}: {scenarioCondition} would result in {scenarioOutcome2}. {timelineNote} {dependencyNote}',
];

// --- ROOT CAUSE templates ---
const ROOTCAUSE_TITLES: string[] = [
    '{metricName} {trendWord} driven by {rootCauseShort}',
    'Root cause: {rootCauseShort} behind {metricName} {trendWord}',
    'Why {metricName} is {trendVerb2}: {rootCauseShort}',
    'Driver decomposition reveals {rootCauseShort} as primary factor',
    'Causal analysis: {metricName} {trendWord} attributed to {rootCauseShort}',
];

const ROOTCAUSE_SUMMARIES: string[] = [
    'Deep analysis of {metricName} {trendWord} reveals {rootCauseDetail}. The primary contributing factor ({contributionPct}% of variance) is {rootCauseShort}. {secondaryFactors}',
    'Driver decomposition for {metricName}: {rootCauseDetail}. The {driverName} tree shows {treeDecomposition}. {actionableInsight}',
    'The {trendWord} in {metricName} from {priorValue} to {value} is primarily attributable to {rootCauseDetail}. {quantifiedImpact} {mitigationStatus}',
    'Root cause analysis within {consoleTitle} identifies {rootCauseShort} as the dominant driver of {metricName} performance. {rootCauseEvidence} {forwardLook}',
    'Causal chain: {rootCauseDetail}. This {rootCauseImpact} accounts for {contributionPct}% of the observed movement in {metricName}. {crossConsoleEffects}',
];

// --- CROSS-REFERENCE templates ---
const CROSSREF_TITLES: string[] = [
    '{crossMetricName} driving {metricName} {trendWord} in {period}',
    'Cross-console impact: {crossDriverName} affects {metricName}',
    'Linkage: {crossConsoleName} to {consoleName} via {crossMetricName}',
    '{crossMetricName} correlation with {metricName} strengthening',
    'Connected signal: {crossDriverName} impact on {driverName}',
];

const CROSSREF_SUMMARIES: string[] = [
    'Cross-console analysis reveals {crossMetricName} is correlated with {metricName} performance. {correlationDetail} This linkage between {crossConsoleName} and {consoleName} has a {correlationStrength} correlation coefficient.',
    'The {crossDriverName} driver in {crossConsoleName} is showing {crossTrend} that directly impacts {metricName} in {consoleName}. {impactMechanism} Net effect estimated at {netEffect}.',
    'Data from {crossConsoleName} ({crossMetricName}) indicates {crossSignal} which is feeding through to {metricName}. {transmissionMechanism} {lagNote}',
    'Cross-reference between {crossDriverName} and {driverName} shows {relationshipNarrative}. As {crossMetricName} {crossTrend2}, {metricName} responds with a {lagPeriod} lag. {implicationNote}',
    '{consoleName} and {crossConsoleName} share a documented linkage through {driverName}/{crossDriverName}. In {period}, {crossMetricName} {crossTrend2} which {impactDescription2}.',
];

// ════════════════════════════════════════════════════════════════════════════
// TEMPLATE CONTEXT BUILDERS
// ════════════════════════════════════════════════════════════════════════════

/** Build the base template context available to all insight types */
function buildBaseContext(ctx: FlattenedMetricContext, period: string, periodIndex: number, seed: string) {
    // Use computed value from engine for current period when available
    const computed = ctx.computedMetric;
    const value = periodIndex === 5
        ? (computed?.value.display ?? ctx.metric.currentValue ?? 'N/A')
        : simulateValue(ctx.metric, periodIndex, seed + ':sim');

    // Use computed status to inform trend direction for current period
    let trend: TrendDirection;
    if (periodIndex === 5 && computed?.status) {
        trend = computed.status === 'good' ? 'up' : computed.status === 'critical' ? 'down' : 'flat';
    } else {
        trend = computeTrend(ctx.metric, periodIndex, seed);
    }
    const trendWord = trend === 'up' ? 'increase' : trend === 'down' ? 'decline' : 'stability';
    const trendVerb = trend === 'up' ? 'improving' : trend === 'down' ? 'declining' : 'holding steady';
    const trendAdj = trend === 'up' ? 'positive' : trend === 'down' ? 'negative' : 'flat';

    // Use computed target/gap when available
    const target = computed?.target?.display ?? ctx.metric.target ?? '';
    const gap = computed?.gap?.display;

    return {
        value,
        trend,
        trendWord,
        trendVerb,
        trendAdj,
        metricName: ctx.metric.name,
        metricId: ctx.metric.id,
        driverName: ctx.driver.name,
        driverId: ctx.driver.id,
        consoleName: ctx.console.title,
        consoleId: ctx.console.id,
        consoleTitle: ctx.console.title,
        segment: SEGMENT_DISPLAY[ctx.console.segment] ?? ctx.console.segment,
        period,
        periodIndex,
        target,
        gap,
        computedStatus: ctx.computedStatus,
        healthScore: ctx.healthScore,
        frequency: ctx.metric.frequency,
        unit: ctx.metric.unit,
        direction: ctx.metric.direction,
        driverPath: ctx.driverPath,
        crossReferences: ctx.crossReferences,
    };
}

// ════════════════════════════════════════════════════════════════════════════
// ENRICHMENT DATA BANKS — Contextual fragments for template interpolation
// ════════════════════════════════════════════════════════════════════════════

const VARIANCE_EXPLANATIONS = [
    'BD Care Benefits electric distribution capex timing shift reduced rate base additions vs plan',
    'PISA deferral rate (85%) limiting immediate revenue recognition on Missouri infrastructure spend',
    'BD Services regulatory lag on new transmission projects widening the gap to authorized ROE',
    'CVS Pharmacy gas distribution operating cost escalation from higher O&M and pipeline integrity spend',
    'ATXI FERC formula rate true-up timing creating quarter-to-quarter revenue variability',
    'The gap reflects below-plan ESA contracted load additions and delayed Missouri rate case settlement',
    'Eversource and WEC Energy peer benchmarking showing BD Care Benefits below-median FFO/debt ratio',
    'Missouri MYRP filing timing delaying recovery of incremental grid modernization investment',
    'The shortfall traces to below-plan BD Care Benefits residential and commercial load growth',
    'Higher-than-planned financing costs on $31.8B five-year capex program widened the interest expense gap',
];

const TREND_IMPLICATIONS = [
    'This trajectory aligns with the BD FY26 EPS guidance range of $5.25–$5.45',
    'If sustained, this would support achieving the 16–17% FFO/debt target by Q4 FY26',
    'The pace of improvement has accelerated since the Missouri MYRP filing approval in Q3 FY25',
    'Management views this as early evidence of PISA and PPRA regulatory recovery gains',
    'This trend needs to accelerate to fully offset higher financing costs on the $31.8B capex program',
    'Sequential improvement is encouraging but remains below the WEC Energy and Eversource peer FFO/debt benchmarks',
    'The trend correlates with increased Missouri rate base growth and ESA contracted load additions',
    'ATXI FERC formula rate true-up and Missouri rate case settlement are cited as catalysts',
    'BD Services transmission revenue growth is the primary contributor to sequential operating income improvement',
    'The trend is stronger in BD Care Benefits electric than CVS Pharmacy gas distribution operations',
];

const FORECAST_ASSUMPTIONS = [
    'continuation of current Missouri rate base growth trajectory and PISA 85% deferral mechanism',
    'Missouri MYRP multi-year rate plan approval on schedule in H2 FY26',
    'stable regulatory environment and FERC formula rate framework for ATXI transmission',
    'maintained ESA contracted load additions of 2.2 GW and data center interconnection pipeline',
    'current grid modernization capex pace of $31.8B over five years proceeding on plan',
    'sustained BD Services transmission revenue growth and FERC 10.48% authorized ROE',
    'Missouri rate case settlement achieved in H2 FY26 as guided by management on Q1 FY26 earnings call',
    'PPRA annual adjustment mechanism delivering timely fuel and purchased power cost recovery',
    'BD Care Benefits clean energy transition capex ($5.2B renewable additions) on schedule',
    'no significant adverse weather or load disruption materially impacting Missouri electric distribution',
];

const SCENARIO_CONDITIONS = [
    'Missouri rate base growth sustains above 8% annually through all four quarters of FY2026',
    'ESA contracted load additions accelerate beyond the current 2.2 GW through new data center agreements',
    'BD Services transmission capex additions exceed plan with accelerated grid interconnection approvals',
    'Missouri MYRP approval achieved in Q2 2026 on plan with constructive multi-year rate path',
    'FERC formula rate ROE for ATXI increases above 10.48% through complaint resolution',
    'BD Care Benefits clean energy additions exceed plan in H2 2026 ahead of IRP schedule',
    'CVS Pharmacy gas distribution rate case settlement achieves above-plan revenue requirement recovery',
    'FFO/debt ratio improves to top-quartile of Eversource, PPL Corp, and WEC Energy peer group',
    'Missouri legislature passes constructive infrastructure investment legislation in H2 2026',
    'PPRA annual adjustment achieves full fuel and purchased power cost recovery by Q3 FY26',
    'BD Care Benefits large commercial and industrial load growth exceeds 3% YoY from electrification',
    'ATXI regional transmission expansion captures $1.5B+ incremental projects beyond current plan',
    'Missouri rate case settlement achieves authorized ROE at or above 10.0%',
    'BD Services FERC formula rate true-up results in above-plan revenue recovery in H2 2026',
    'EPS guidance range narrows to $5.35–$5.45 top-half of FY26 guidance on strong H1 execution',
];

const SCENARIO_OUTCOMES = [
    '+$400M incremental rate base from accelerated Missouri grid modernization investment',
    '+$300M incremental BD Services transmission revenue from new MISO-approved projects',
    '+15bps improvement in consolidated FFO/debt ratio from constructive Missouri rate case settlement',
    '+$0.15 incremental EPS from accelerated ESA data center load additions above current 2.2 GW',
    '+20bps ATXI operating margin improvement from FERC formula rate authorized ROE increase',
    '+$200M per year in incremental BD Care Benefits distribution revenue from MYRP approval',
    '+10bps FFO/debt improvement from PPRA full cost-recovery mechanism optimization',
    '-$150M in annual financing costs from optimized long-term debt issuance timing',
    '+$250M annual revenue from BD Care Benefits large commercial electrification load growth',
    '+$180M annual revenue from CVS Pharmacy gas distribution rate case constructive outcome',
    '-$100M in annual O&M costs from grid automation and operational efficiency program',
    '+$120M annual revenue from BD Care Benefits clean energy capacity additions ahead of IRP',
    '+$350M incremental BD Services transmission capex contribution from regional expansion',
    '+5% organic BD Care Benefits rate base growth from accelerated infrastructure investment',
    '+$0.10 incremental EPS from ATXI FERC formula rate true-up resolution',
];

const ROOT_CAUSES = [
    'Eversource and PPL Corp peer rate case outcomes setting lower constructive ROE benchmarks',
    'Missouri regulatory lag on infrastructure recovery reducing near-term earned ROE',
    'PISA 85% deferral timing creating gap between spending and revenue recognition',
    'rising long-term interest rates increasing financing costs on BD Care Benefits debt issuances',
    'BD Services project permitting delays limiting transmission capex execution vs plan',
    'adverse weather driving higher-than-planned O&M and storm restoration costs in Missouri',
    'FERC ROE complaint proceedings creating uncertainty around ATXI authorized return',
    'Missouri commercial and industrial load growth below plan from slower regional economic activity',
    'CVS Pharmacy gas distribution O&M cost escalation from pipeline integrity and leak detection programs',
    'below-plan ESA contracted load additions due to data center interconnection queue delays',
    'Missouri coal plant retirement costs creating incremental regulatory asset balances',
    'MYRP filing timeline delays pushing constructive rate recovery into future periods',
    'BD Care Benefits renewable energy integration costs exceeding IRP modeling assumptions',
    'PPRA annual adjustment underfunding fuel and purchased power cost recovery vs actuals',
    'corporate G&A cost escalation outpacing Missouri rate base revenue growth trajectory',
];

const RECOMMENDATIONS_BANK = {
    'revenue': [
        'Accelerate Missouri rate base additions by resolving MYRP regulatory timeline and construction permitting',
        'Expand ESA contracted load pipeline beyond 2.2 GW — pursue new data center interconnection agreements',
        'Prioritize BD Services MISO transmission project pipeline: approved projects represent $1.5B+ capex opportunity',
        'Develop bundled BD Care Benefits clean energy + transmission offering for large commercial electrification customers',
        'Launch integrated grid modernization + ESA offerings for industrial and data center load growth customers',
        'Deploy targeted Missouri large commercial account campaigns to accelerate H2 2026 load growth recovery',
        'Expand ATXI regional transmission footprint — target new FERC-approved projects beyond current plan',
        'Optimize BD Services capex execution by product line — track transmission and substation additions quarterly',
        'Introduce BD Care Benefits energy advisory services for large C&I customers on electrification pathways',
        'Invest in CVS Pharmacy gas distribution capabilities to capture industrial electrification and hydrogen pilot opportunities',
    ],
    'operations': [
        'Accelerate BD Care Benefits grid automation program to close gap to WEC Energy and Eversource O&M benchmarks',
        'Implement advanced distribution management system to improve storm restoration efficiency and reduce O&M costs',
        'Reduce BD Services transmission project delivery cycle time through enhanced project management practices',
        'Deploy AI-driven predictive maintenance across BD Care Benefits distribution assets to reduce field service costs',
        'Accelerate clean energy integration program to align Missouri coal retirement schedule with IRP milestones',
        'Invest in CVS Pharmacy pipeline integrity talent retention through career development in gas distribution specialty',
        'Roll out enhanced BD Care Benefits public safety and reliability program across all distribution regions',
        'Standardize BD Services transmission operating metrics aligned to FERC formula rate KPI requirements',
        'Implement real-time rate base investment monitoring dashboards for Missouri regulatory and finance leadership',
        'Pilot autonomous grid operations in select BD Care Benefits substation and switching infrastructure',
    ],
    'financial': [
        'Optimize long-term debt issuance timing to lock in favorable rates ahead of $31.8B capex program draws',
        'Apply PISA regulatory asset monetization strategy to reduce balance sheet pressure from deferred Missouri costs',
        'Evaluate CVS Pharmacy gas distribution rate case timing optimization to minimize regulatory lag on infrastructure recovery',
        'Reallocate capital toward highest-ROIC segments: ATXI FERC transmission and BD Care Benefits ESA load growth',
        'Reduce corporate G&A overhead through shared services consolidation across Missouri, IED, and CVS Pharmacy segments',
        'Reallocate capital from low-priority maintenance capex toward high-return Missouri grid modernization projects',
        'Negotiate improved transmission construction procurement terms for ATXI and BD Services equipment sourcing',
        'Implement zero-based budgeting for corporate G&A cost categories to protect FFO/debt improvement trajectory',
        'Review CVS Pharmacy underperforming gas distribution sub-regions for consolidation or rate treatment optimization',
        'Optimize BD Care Benefits working capital through improved regulatory asset billing and PPRA collection cycles',
    ],
    'digital': [
        'Expand Finance360 data platform capabilities for BD Care Benefits grid analytics recurring reporting',
        'Deploy advanced metering infrastructure analytics across Missouri AMI footprint for predictive load management',
        'Pilot digital customer engagement platform with top-50 BD Care Benefits commercial accounts for energy advisory',
        'Increase BD Care Benefits smart grid sensor coverage — target full AMI deployment to enable load forecasting',
        'Launch data analytics products for real-time ATXI transmission performance intelligence for FERC reporting',
        'Implement AI-driven Missouri distribution grid quality control and outage scheduling optimization',
        'Expand smart monitoring platform across BD Care Benefits substation and switching infrastructure',
        'Deploy predictive maintenance AI models to reduce BD Services field service response time and cost',
        'Invest in unified Finance360 data platform integrating Missouri rate base, FERC transmission, and regulatory data',
        'Optimize digital customer communications to highlight BD Care Benefits clean energy transition progress',
    ],
    'people': [
        'Accelerate BD Care Benefits field engineering compensation to close gap to WEC Energy and Eversource talent rates',
        'Implement flexible rotational arrangements to improve ATXI and BD Services transmission engineer satisfaction',
        'Expand BD leadership development programs and Missouri engineering career progression pathways',
        'Launch wellbeing benefits enhancement for BD Care Benefits field professionals in outdoor working conditions',
        'Reduce first-year CVS Pharmacy gas distribution specialist turnover through improved pipeline operations onboarding',
        'Increase internal promotion rate for BD Care Benefits operations director roles to strengthen field leadership',
        'Deploy digital learning platform with grid modernization and clean energy transition certification tracks',
        'Implement stay interviews for high-performing BD Services transmission engineers at risk of attrition',
        'Standardize professional development paths across Missouri, IED, CVS Pharmacy, and ATXI engineering disciplines',
        'Invest in regional leadership coaching for BD Care Benefits and CVS Pharmacy gas distribution management teams',
    ],
    'risk': [
        'Strengthen cybersecurity posture for BD Care Benefits operational technology and smart grid digital infrastructure',
        'Expand Missouri and Illinois regulatory compliance monitoring to quarterly cadence in all service territories',
        'Develop contingency plans for top scenarios: adverse rate case outcomes, extreme weather, FERC ROE challenge',
        'Accelerate ESG/sustainability reporting capabilities to meet growing institutional investor and SEC requirements',
        'Increase MYRP filing governance to manage Missouri multi-year rate plan complexity and stakeholder engagement',
        'Implement enhanced ethics and compliance training for BD regulatory and government affairs leadership',
        'Expand diversity and inclusion programs across Becton, Dickinson and Company 8,600-person workforce',
        'Deploy advanced risk monitoring for $31.8B five-year capex program execution and delivery risk',
        'Strengthen data privacy compliance infrastructure for BD Care Benefits and CVS Pharmacy customer data (state PUC, FERC)',
        'Reduce BD Care Benefits field operational risk through standardized safety and reliability assurance frameworks',
    ],
};

/** Select 2-4 recommendations appropriate to the console category */
function selectRecommendations(seed: string, category: string, insightType: InsightType): string[] {
    const count = seededInt(seed + ':recCount', 2, 4);
    let pool: string[];

    if (category === 'Revenue & Market') {
        pool = [...RECOMMENDATIONS_BANK.revenue, ...RECOMMENDATIONS_BANK.digital.slice(0, 3)];
    } else if (category === 'Property & Operations') {
        pool = [...RECOMMENDATIONS_BANK.operations, ...RECOMMENDATIONS_BANK.people.slice(0, 3)];
    } else if (category === 'Digital & Customer') {
        pool = [...RECOMMENDATIONS_BANK.digital, ...RECOMMENDATIONS_BANK.revenue.slice(0, 3)];
    } else if (category === 'Financial Performance') {
        pool = [...RECOMMENDATIONS_BANK.financial, ...RECOMMENDATIONS_BANK.operations.slice(0, 3)];
    } else if (category === 'Risk & Sustainability') {
        pool = [...RECOMMENDATIONS_BANK.risk];
    } else {
        pool = [
            ...RECOMMENDATIONS_BANK.revenue.slice(0, 2),
            ...RECOMMENDATIONS_BANK.operations.slice(0, 2),
            ...RECOMMENDATIONS_BANK.financial.slice(0, 2),
        ];
    }

    const results: string[] = [];
    for (let i = 0; i < count && i < pool.length; i++) {
        const idx = hash(seed + ':rec:' + i) % pool.length;
        const pick = pool[idx];
        if (!results.includes(pick)) {
            results.push(pick);
        } else {
            // Pick the next one that is not a duplicate
            for (let j = 1; j < pool.length; j++) {
                const alt = pool[(idx + j) % pool.length];
                if (!results.includes(alt)) {
                    results.push(alt);
                    break;
                }
            }
        }
    }

    return results;
}

// ════════════════════════════════════════════════════════════════════════════
// INSIGHT TEXT GENERATORS
// ════════════════════════════════════════════════════════════════════════════

function generateFactInsight(ctx: FlattenedMetricContext, period: string, periodIndex: number, seed: string): InsightSeed {
    const base = buildBaseContext(ctx, period, periodIndex, seed);
    const category = CATEGORY_MAP[ctx.console.category] ?? 'Revenue & Market';

    const titleTemplate = seededPick(seed + ':title', FACT_TITLES);
    const summaryTemplate = seededPick(seed + ':sum', FACT_SUMMARIES);

    const trendWord2 = base.trend === 'up' ? 'improving' : base.trend === 'down' ? 'softening' : 'stabilizing';
    const impactDesc = base.trend === 'up' ? 'a positive contributor to segment performance' : base.trend === 'down' ? 'an area requiring management attention' : 'a stable metric within expected ranges';
    const sigNote = base.target ? `being monitored against the ${base.target} target` : 'a key performance indicator for this driver';

    const title = titleTemplate
        .replace('{metricName}', base.metricName)
        .replace('{value}', base.value)
        .replace('{period}', period)
        .replace('{segment}', base.segment);

    const summary = summaryTemplate
        .replace('{metricName}', base.metricName)
        .replace(/{value}/g, base.value)
        .replace('{period}', period)
        .replace('{trendWord}', base.trendWord)
        .replace('{trendWord2}', trendWord2)
        .replace('{consoleTitle}', base.consoleTitle)
        .replace('{driverName}', base.driverName)
        .replace('{segment}', base.segment)
        .replace('{frequency}', base.frequency)
        .replace('{impactDescription}', impactDesc)
        .replace('{significanceNote}', sigNote);

    return {
        title,
        category,
        insightLevel: 'L1',
        metricId: base.metricId,
        kpiValue: base.value,
        trendDirection: base.trend,
        priority: assignPriority(seed, 'fact', !!base.target, base.computedStatus),
        summary,
        confidenceScore: assignConfidence(seed, 'fact'),
        consoleLink: `/business-consoles/${base.consoleId}`,
        recommendations: selectRecommendations(seed, category, 'fact'),
        relatedDrivers: buildRelatedDrivers(ctx, base, 'fact', period),
    };
}

function generateTrendInsight(ctx: FlattenedMetricContext, period: string, periodIndex: number, seed: string): InsightSeed {
    const base = buildBaseContext(ctx, period, periodIndex, seed);
    const category = CATEGORY_MAP[ctx.console.category] ?? 'Revenue & Market';

    const numPeriods = seededInt(seed + ':np', 2, 4);
    const priorPeriodIdx = Math.max(0, periodIndex - numPeriods);
    const priorValue = simulateValue(ctx.metric, priorPeriodIdx, seed + ':prior');

    const trendVerb2 = base.trend === 'up' ? 'improving' : base.trend === 'down' ? 'declining' : 'consolidating';
    const trendAdj2 = base.trend === 'up' ? 'upward' : base.trend === 'down' ? 'downward' : 'sideways';
    const trendDetail = base.trend === 'up'
        ? `${numPeriods} consecutive quarters of improvement`
        : base.trend === 'down'
            ? `${numPeriods}-quarter downtrend continues`
            : `range-bound for ${numPeriods} quarters`;
    const trendNarrative = base.trend === 'up'
        ? `first positive momentum in ${numPeriods + seededInt(seed + ':addq', 1, 4)} quarters`
        : base.trend === 'down'
            ? `softening trend persisting from prior fiscal year`
            : `consolidation phase as new strategy takes hold`;
    const comparedToPrior = base.trend === 'up' ? `represents improvement from ${priorValue}` : base.trend === 'down' ? `is lower than the ${priorValue} reading ${numPeriods} quarters ago` : `is roughly in line with the ${priorValue} level from ${numPeriods} quarters ago`;
    const trendImplication = seededPick(seed + ':impl', TREND_IMPLICATIONS);
    const trendStrength = base.trend === 'flat' ? 'neutral' : seededPick(seed + ':str', ['building', 'strengthening', 'moderating', 'stabilizing']);

    const titleTemplate = seededPick(seed + ':title', TREND_TITLES);
    const summaryTemplate = seededPick(seed + ':sum', TREND_SUMMARIES);

    const title = titleTemplate
        .replace('{metricName}', base.metricName)
        .replace('{trendVerb}', trendVerb2)
        .replace('{trendDetail}', trendDetail)
        .replace('{trendAdj}', base.trendAdj)
        .replace('{trendAdj2}', trendAdj2)
        .replace('{trendNarrative}', trendNarrative)
        .replace('{segment}', base.segment)
        .replace('{trendWord}', base.trendWord)
        .replace('{period}', period);

    const summary = summaryTemplate
        .replace('{metricName}', base.metricName)
        .replace(/{trendVerb2}/g, trendVerb2)
        .replace(/{numPeriods}/g, numPeriods.toString())
        .replace('{priorValue}', priorValue)
        .replace(/{value}/g, base.value)
        .replace(/{trendAdj}/g, base.trendAdj)
        .replace('{trendAdj2}', trendAdj2)
        .replace('{period}', period)
        .replace('{comparedToPrior}', comparedToPrior)
        .replace('{trendImplication}', trendImplication)
        .replace('{strategicContext}', seededPick(seed + ':sc', TREND_IMPLICATIONS))
        .replace('{trendNarrative2}', trendNarrative)
        .replace('{consoleTitle}', base.consoleTitle)
        .replace('{trendDrivers}', seededPick(seed + ':td', TREND_IMPLICATIONS))
        .replace('{trendWord}', base.trendWord)
        .replace('{trendStrength}', trendStrength)
        .replace('{trendDirection}', base.trend)
        .replace('{outlookNote}', seededPick(seed + ':on', TREND_IMPLICATIONS));

    return {
        title,
        category,
        insightLevel: 'L1',
        metricId: base.metricId,
        kpiValue: base.value,
        trendDirection: base.trend,
        priority: assignPriority(seed, 'trend', !!base.target, base.computedStatus),
        summary,
        confidenceScore: assignConfidence(seed, 'trend'),
        consoleLink: `/business-consoles/${base.consoleId}`,
        recommendations: selectRecommendations(seed, category, 'trend'),
        relatedDrivers: buildRelatedDrivers(ctx, base, 'trend', period),
    };
}

function generateVarianceInsight(ctx: FlattenedMetricContext, period: string, periodIndex: number, seed: string): InsightSeed {
    const base = buildBaseContext(ctx, period, periodIndex, seed);
    const category = CATEGORY_MAP[ctx.console.category] ?? 'Revenue & Market';
    const target = base.target;

    // Calculate gap
    const parsedValue = parseMetricValue(base.value);
    const parsedTarget = parseMetricValue(target);
    let gapAmount = 'material';
    let gapDirection = 'below';
    let gapDirection2 = 'short of';

    if (parsedValue && parsedTarget) {
        const diff = parsedTarget.num - parsedValue.num;
        if (base.direction === 'lower_is_better') {
            gapDirection = parsedValue.num > parsedTarget.num ? 'above' : 'below';
            gapDirection2 = parsedValue.num > parsedTarget.num ? 'above' : 'ahead of';
        } else {
            gapDirection = parsedValue.num < parsedTarget.num ? 'below' : 'above';
            gapDirection2 = parsedValue.num < parsedTarget.num ? 'short of' : 'ahead of';
        }
        if (base.unit === 'percent') {
            gapAmount = `${Math.abs(diff * 100).toFixed(0)}bps`;
        } else if (base.unit === 'currency') {
            gapAmount = `$${Math.abs(diff) >= 1_000_000 ? (Math.abs(diff) / 1_000_000).toFixed(0) + 'M' : Math.abs(diff).toFixed(0)}`;
        } else {
            gapAmount = Math.abs(diff).toFixed(1);
        }
    }

    const gapDesc = `${gapAmount} ${gapDirection} plan`;
    const varianceExp = seededPick(seed + ':ve', VARIANCE_EXPLANATIONS);
    const actionCount = seededInt(seed + ':ac', 2, 5);
    const closingPath = seededPick(seed + ':cp', [
        'Management sees a path to close the gap by Q4 FY26.',
        'The variance is expected to narrow as strategic initiatives gain traction.',
        'Corrective actions have been deployed; impact expected in 1-2 quarters.',
        'Gap closure is contingent on capital markets recovery and execution velocity.',
        'Leadership views this as a timing lag rather than a structural issue.',
    ]);

    const titleTemplate = seededPick(seed + ':title', VARIANCE_TITLES);
    const summaryTemplate = seededPick(seed + ':sum', VARIANCE_SUMMARIES);

    const title = titleTemplate
        .replace('{metricName}', base.metricName)
        .replace('{value}', base.value)
        .replace('{target}', target)
        .replace('{gapDescription}', gapDesc)
        .replace('{gapAmount}', gapAmount)
        .replace('{segment}', base.segment)
        .replace('{gapDirection}', gapDirection);

    const summary = summaryTemplate
        .replace(/{metricName}/g, base.metricName)
        .replace(/{value}/g, base.value)
        .replace(/{target}/g, target)
        .replace(/{gapAmount}/g, gapAmount)
        .replace('{varianceExplanation}', varianceExp)
        .replace('{actionCount}', actionCount.toString())
        .replace('{period}', period)
        .replace('{gapDirection2}', gapDirection2)
        .replace(/{gapDirection}/g, gapDirection)
        .replace('{consoleTitle}', base.consoleTitle)
        .replace('{varianceDrivers}', varianceExp.toLowerCase())
        .replace('{segment}', base.segment)
        .replace('{varianceNarrative}', varianceExp.toLowerCase())
        .replace('{closingPath}', closingPath)
        .replace('{varianceContext}', closingPath)
        .replace('{varianceFactors}', varianceExp.toLowerCase());

    return {
        title,
        category,
        insightLevel: 'L2',
        metricId: base.metricId,
        kpiValue: base.value,
        trendDirection: base.trend,
        priority: assignPriority(seed, 'variance', true, base.computedStatus),
        summary,
        confidenceScore: assignConfidence(seed, 'variance'),
        consoleLink: `/business-consoles/${base.consoleId}`,
        recommendations: selectRecommendations(seed, category, 'variance'),
        relatedDrivers: buildRelatedDrivers(ctx, base, 'variance', period),
    };
}

function generateAnomalyInsight(ctx: FlattenedMetricContext, period: string, periodIndex: number, seed: string): InsightSeed {
    const base = buildBaseContext(ctx, period, periodIndex, seed);
    const category = CATEGORY_MAP[ctx.console.category] ?? 'Revenue & Market';
    const numPeriods = seededInt(seed + ':np', 3, 6);

    const anomalyExplanation = seededPick(seed + ':ae', [
        'Preliminary investigation points to a regional concentration of the anomaly.',
        'The deviation appears to be driven by a single-quarter event rather than a trend change.',
        'External factors including weather and macro conditions may explain the outlier.',
        'Internal operational changes coincided with the anomaly window.',
        'The deviation exceeds the 95th percentile of historical quarterly variation.',
    ]);
    const anomalyContext = seededPick(seed + ':ac', [
        'Similar anomalies have been observed 2 times in the past 8 quarters.',
        'This is the first instance of this magnitude in the trailing 12-quarter window.',
        'The anomaly is concentrated in advisory services in urban markets.',
        'Regional data suggests the anomaly is broad-based rather than localized.',
    ]);

    const titleTemplate = seededPick(seed + ':title', ANOMALY_TITLES);
    const summaryTemplate = seededPick(seed + ':sum', ANOMALY_SUMMARIES);

    const title = titleTemplate
        .replace('{trendWord}', base.trendWord)
        .replace('{metricName}', base.metricName)
        .replace('{period}', period)
        .replace('{value}', base.value)
        .replace('{segment}', base.segment);

    const summary = summaryTemplate
        .replace(/{metricName}/g, base.metricName)
        .replace(/{value}/g, base.value)
        .replace(/{period}/g, period)
        .replace(/{numPeriods}/g, numPeriods.toString())
        .replace('{anomalyExplanation}', anomalyExplanation)
        .replace('{trendWord}', base.trendWord)
        .replace('{investigationNote}', anomalyContext)
        .replace('{consoleTitle}', base.consoleTitle)
        .replace('{anomalyContext}', anomalyContext)
        .replace('{anomalyDrivers}', anomalyExplanation)
        .replace('{driverName}', base.driverName)
        .replace('{anomalyImpact}', anomalyContext);

    return {
        title,
        category,
        insightLevel: 'L2',
        metricId: base.metricId,
        kpiValue: base.value,
        trendDirection: base.trend,
        priority: assignPriority(seed, 'anomaly', !!base.target, base.computedStatus),
        summary,
        confidenceScore: assignConfidence(seed, 'anomaly'),
        consoleLink: `/business-consoles/${base.consoleId}`,
        recommendations: selectRecommendations(seed, category, 'anomaly'),
        relatedDrivers: buildRelatedDrivers(ctx, base, 'anomaly', period),
    };
}

function generateForecastInsight(ctx: FlattenedMetricContext, period: string, periodIndex: number, seed: string): InsightSeed {
    const base = buildBaseContext(ctx, period, periodIndex, seed);
    const category = CATEGORY_MAP[ctx.console.category] ?? 'Revenue & Market';

    // Project forward
    const forecastPeriods = ['Q2 FY26', 'Q3 FY26', 'Q4 FY26', 'Q1 FY27'];
    const forecastPeriod = seededPick(seed + ':fp', forecastPeriods);
    const forecastHorizon = seededPick(seed + ':fh', ['2-3 quarters', '3-4 quarters', 'by end of FY26', 'within the next fiscal year']);

    // Generate a forecast value that trends toward target (if exists) or continues current trajectory
    const parsedCurrent = parseMetricValue(base.value);
    let forecastValue = base.target || base.value;
    if (parsedCurrent && base.target) {
        const parsedTarget = parseMetricValue(base.target);
        if (parsedTarget) {
            const progress = seededRange(seed + ':prog', 0.3, 0.8);
            const projected = parsedCurrent.num + (parsedTarget.num - parsedCurrent.num) * progress;
            forecastValue = formatSimulatedValue(projected, ctx.metric, parsedCurrent);
        }
    } else if (parsedCurrent) {
        const drift = base.direction === 'higher_is_better' ? seededRange(seed + ':drift', 0.03, 0.12) : seededRange(seed + ':drift', -0.12, -0.03);
        forecastValue = formatSimulatedValue(parsedCurrent.num * (1 + drift), ctx.metric, parsedCurrent);
    }

    const forecastAssumption = seededPick(seed + ':fa', FORECAST_ASSUMPTIONS);
    const numPeriods = seededInt(seed + ':np', 3, 6);
    const confidenceBand = seededPick(seed + ':cb', ['+/-5% around central estimate', '+/-3% range', '+/-8% range reflecting elevated uncertainty', 'narrow band suggesting high model confidence']);
    const forecastRisk = seededPick(seed + ':fr', [
        'Downside risk: adverse Missouri rate case outcome reducing authorized ROE below 9.5% or regulatory lag widening.',
        'Key risk: MYRP approval delay pushing constructive rate recovery beyond the FY26 planning horizon.',
        'Risk factors include higher long-term interest rates increasing financing costs on the $31.8B capex program.',
        'Model risk: ESA data center load growth is accelerating rapidly — limited historical analogues for current interconnection cycle.',
    ]);

    const titleTemplate = seededPick(seed + ':title', FORECAST_TITLES);
    const summaryTemplate = seededPick(seed + ':sum', FORECAST_SUMMARIES);

    const title = titleTemplate
        .replace('{metricName}', base.metricName)
        .replace('{forecastValue}', forecastValue)
        .replace('{forecastPeriod}', forecastPeriod)
        .replace('{segment}', base.segment);

    const summary = summaryTemplate
        .replace(/{metricName}/g, base.metricName)
        .replace(/{forecastValue}/g, forecastValue)
        .replace(/{forecastPeriod}/g, forecastPeriod)
        .replace(/{numPeriods}/g, numPeriods.toString())
        .replace('{forecastBasis}', forecastRisk)
        .replace('{forecastAssumptions}', forecastAssumption)
        .replace('{confidenceBand}', confidenceBand)
        .replace('{consoleTitle}', base.consoleTitle)
        .replace('{forecastInputs}', forecastAssumption)
        .replace('{forecastRisk}', forecastRisk)
        .replace('{forecastDrivers}', forecastAssumption)
        .replace('{forecastHorizon}', forecastHorizon)
        .replace('{scenarioNote}', forecastRisk)
        .replace('{forecastNarrative}', `Current momentum plus ${forecastAssumption} supports this projection.`)
        .replace('{achievabilityNote}', seededPick(seed + ':an', ['Probability-weighted analysis supports this outlook.', 'Achieving this requires consistent execution across all strategic pillars.', 'Management confidence in this projection is moderate-to-high.']));

    return {
        title,
        category,
        insightLevel: 'L3',
        metricId: base.metricId,
        kpiValue: base.value,
        trendDirection: base.trend,
        priority: assignPriority(seed, 'forecast', !!base.target, base.computedStatus),
        summary,
        confidenceScore: assignConfidence(seed, 'forecast'),
        consoleLink: `/business-consoles/${base.consoleId}`,
        recommendations: selectRecommendations(seed, category, 'forecast'),
        relatedDrivers: buildRelatedDrivers(ctx, base, 'forecast', period),
    };
}

function generateWhatIfInsight(ctx: FlattenedMetricContext, period: string, periodIndex: number, seed: string): InsightSeed {
    const base = buildBaseContext(ctx, period, periodIndex, seed);
    const category = CATEGORY_MAP[ctx.console.category] ?? 'Revenue & Market';

    const scenarioCondition = seededPick(seed + ':cond', SCENARIO_CONDITIONS);
    const scenarioOutcome = seededPick(seed + ':out', SCENARIO_OUTCOMES);
    const scenarioLabel = seededPick(seed + ':label', [
        'Capital Markets Recovery',
        'Base Plus',
        'Upside Case',
        'Strategic Breakthrough',
        'Operational Excellence',
        'Digital Platform Acceleration',
        'Talent Investment Payoff',
        'Market Share Expansion',
    ]);

    // Calculate a scenario target
    const parsedCurrent = parseMetricValue(base.value);
    let scenarioTarget = base.value;
    if (parsedCurrent) {
        const lift = seededRange(seed + ':lift', 0.05, 0.25);
        const dir = base.direction === 'lower_is_better' ? -1 : 1;
        scenarioTarget = formatSimulatedValue(parsedCurrent.num * (1 + lift * dir), ctx.metric, parsedCurrent);
    }

    const scenarioImplication = seededPick(seed + ':impl', [
        'This represents a meaningful acceleration of the recovery trajectory.',
        'The incremental impact would significantly close the gap to long-term targets.',
        'Management views this scenario as achievable with focused execution.',
        'This scenario requires coordinated action across multiple business units.',
    ]);
    const scenarioProbability = seededPick(seed + ':prob', [
        'Probability assessment: 35-45% under current trajectory.',
        'Probability assessment: 50-60% if key enablers are accelerated.',
        'Probability assessment: 25-35% given execution complexity.',
        'Probability assessment: 40-55% based on leading indicators.',
    ]);

    const titleTemplate = seededPick(seed + ':title', WHATIF_TITLES);
    const summaryTemplate = seededPick(seed + ':sum', WHATIF_SUMMARIES);

    const title = titleTemplate
        .replace('{scenarioCondition}', scenarioCondition)
        .replace('{scenarioOutcome}', scenarioOutcome)
        .replace('{scenarioLabel}', scenarioLabel)
        .replace('{scenarioImpact}', scenarioOutcome)
        .replace('{metricName}', base.metricName)
        .replace('{segment}', base.segment)
        .replace('{driverName}', base.driverName);

    const summary = summaryTemplate
        .replace(/{scenarioCondition}/g, scenarioCondition)
        .replace(/{metricName}/g, base.metricName)
        .replace(/{value}/g, base.value)
        .replace(/{scenarioTarget}/g, scenarioTarget)
        .replace('{scenarioImplication}', scenarioImplication)
        .replace('{scenarioNetImpact}', scenarioOutcome)
        .replace(/{scenarioOutcome2}/g, scenarioOutcome)
        .replace('{impactedCount}', seededInt(seed + ':ic', 3, 8).toString())
        .replace('{consoleTitle}', base.consoleTitle)
        .replace(/{scenarioLabel}/g, scenarioLabel)
        .replace('{scenarioProbability}', scenarioProbability)
        .replace('{scenarioRecommendation}', scenarioImplication)
        .replace('{sensitivityNote}', seededPick(seed + ':sn', ['high sensitivity to input assumptions', 'moderate sensitivity within realistic parameter ranges', 'low sensitivity, suggesting a robust outcome']))
        .replace('{driverName}', base.driverName)
        .replace('{timelineNote}', seededPick(seed + ':tn', ['Expected timeline: 2-3 quarters to materialize.', 'Full impact would be realized over 4-6 quarters.', 'Near-term impact visible within 1-2 quarters.']))
        .replace('{dependencyNote}', seededPick(seed + ':dn', ['Dependent on Missouri MYRP approval timeline and constructive regulatory commission outcome.', 'Requires aligned execution from BD Care Benefits operations and BD Services transmission project teams.', 'Contingent on favorable interest rate environment and FERC formula rate true-up timing.']));

    return {
        title,
        category,
        insightLevel: 'L4',
        metricId: base.metricId,
        kpiValue: base.value,
        trendDirection: base.trend,
        priority: assignPriority(seed, 'what-if', !!base.target, base.computedStatus),
        summary,
        confidenceScore: assignConfidence(seed, 'what-if'),
        consoleLink: `/business-consoles/${base.consoleId}`,
        recommendations: selectRecommendations(seed, category, 'what-if'),
        relatedDrivers: buildRelatedDrivers(ctx, base, 'what-if', period),
    };
}

function generateRootCauseInsight(ctx: FlattenedMetricContext, period: string, periodIndex: number, seed: string): InsightSeed {
    const base = buildBaseContext(ctx, period, periodIndex, seed);
    const category = CATEGORY_MAP[ctx.console.category] ?? 'Revenue & Market';

    const rootCause = seededPick(seed + ':rc', ROOT_CAUSES);
    const rootCauseShort = rootCause.length > 60 ? rootCause.substring(0, 57) + '...' : rootCause;
    const contributionPct = seededInt(seed + ':cp', 35, 75);
    const priorValue = simulateValue(ctx.metric, Math.max(0, periodIndex - 2), seed + ':pv');

    const secondaryFactors = seededPick(seed + ':sf', [
        `Secondary factors include ${seededPick(seed + ':sf2', ROOT_CAUSES).substring(0, 50)}.`,
        'Ancillary drivers are less quantifiable but directionally aligned.',
        `A secondary contributor (${100 - contributionPct}%) is seasonal pattern disruption.`,
        'Other contributing factors are captured in the driver decomposition analysis.',
    ]);
    const actionableInsight = seededPick(seed + ':ai', [
        'Addressing the root cause requires targeted intervention within 1-2 quarters.',
        'Cross-functional task force recommended to address the primary driver.',
        'The root cause is partially addressable through current strategic initiatives.',
        'Management action plan is in place; monitoring for lead indicator improvement.',
    ]);
    const quantifiedImpact = seededPick(seed + ':qi', [
        `The primary factor accounts for approximately ${contributionPct}% of the variance.`,
        `Quantified impact: ${contributionPct}% attribution to the identified root cause.`,
        `Driver decomposition assigns ${contributionPct}% weight to this factor.`,
    ]);

    const titleTemplate = seededPick(seed + ':title', ROOTCAUSE_TITLES);
    const summaryTemplate = seededPick(seed + ':sum', ROOTCAUSE_SUMMARIES);

    const title = titleTemplate
        .replace('{metricName}', base.metricName)
        .replace(/{trendWord}/g, base.trendWord)
        .replace(/{rootCauseShort}/g, rootCauseShort)
        .replace('{trendVerb2}', base.trendVerb);

    const summary = summaryTemplate
        .replace(/{metricName}/g, base.metricName)
        .replace(/{trendWord}/g, base.trendWord)
        .replace(/{rootCauseDetail}/g, rootCause)
        .replace(/{rootCauseShort}/g, rootCauseShort)
        .replace(/{contributionPct}/g, contributionPct.toString())
        .replace('{secondaryFactors}', secondaryFactors)
        .replace('{driverName}', base.driverName)
        .replace('{treeDecomposition}', `the primary pathway from ${base.driverPath.join(' > ')}`)
        .replace('{actionableInsight}', actionableInsight)
        .replace('{priorValue}', priorValue)
        .replace(/{value}/g, base.value)
        .replace('{quantifiedImpact}', quantifiedImpact)
        .replace('{mitigationStatus}', actionableInsight)
        .replace('{consoleTitle}', base.consoleTitle)
        .replace('{rootCauseEvidence}', `Evidence: ${contributionPct}% attribution based on driver tree decomposition.`)
        .replace('{forwardLook}', secondaryFactors)
        .replace('{rootCauseImpact}', `${base.trendWord} pressure`)
        .replace('{crossConsoleEffects}', actionableInsight);

    return {
        title,
        category,
        insightLevel: 'L5',
        metricId: base.metricId,
        kpiValue: base.value,
        trendDirection: base.trend,
        priority: assignPriority(seed, 'root-cause', !!base.target, base.computedStatus),
        summary,
        confidenceScore: assignConfidence(seed, 'root-cause'),
        consoleLink: `/business-consoles/${base.consoleId}`,
        recommendations: selectRecommendations(seed, category, 'root-cause'),
        relatedDrivers: buildRelatedDrivers(ctx, base, 'root-cause', period),
    };
}

function generateCrossReferenceInsight(ctx: FlattenedMetricContext, period: string, periodIndex: number, seed: string): InsightSeed {
    const base = buildBaseContext(ctx, period, periodIndex, seed);
    const category = CATEGORY_MAP[ctx.console.category] ?? 'Revenue & Market';

    // Find a cross-referenced console/driver
    const crossRefId = ctx.crossReferences.length > 0
        ? seededPick(seed + ':cr', ctx.crossReferences)
        : ctx.driver.id;

    // Find cross-referenced driver info from all consoles
    let crossConsoleName = base.consoleTitle;
    let crossDriverName = base.driverName;
    let crossMetricName = base.metricName;
    for (const c of allSemanticConsoles) {
        for (const d of flattenAllDrivers(c.drivers)) {
            if (d.id === crossRefId) {
                crossConsoleName = c.title;
                crossDriverName = d.name;
                crossMetricName = d.metrics?.[0]?.name ?? d.name;
                break;
            }
        }
    }

    const crossTrend = seededPick(seed + ':ct', ['positive momentum', 'improving performance', 'notable growth', 'accelerating progress', 'emerging strength']);
    const crossTrend2 = seededPick(seed + ':ct2', ['improves', 'accelerates', 'shifts', 'strengthens', 'expands']);
    const correlationStrength = seededPick(seed + ':cs', ['0.72', '0.81', '0.68', '0.76', '0.85']);
    const lagPeriod = seededPick(seed + ':lp', ['1-quarter', '2-quarter', '1-2 quarter', 'near-zero']);
    const netEffect = seededPick(seed + ':ne', ['+50-80bps contribution', '+$15-25M quarterly impact', '+1.5-2.5% improvement', 'material positive effect']);

    const titleTemplate = seededPick(seed + ':title', CROSSREF_TITLES);
    const summaryTemplate = seededPick(seed + ':sum', CROSSREF_SUMMARIES);

    const title = titleTemplate
        .replace('{crossMetricName}', crossMetricName)
        .replace('{metricName}', base.metricName)
        .replace('{trendWord}', base.trendWord)
        .replace('{period}', period)
        .replace('{crossDriverName}', crossDriverName)
        .replace('{crossConsoleName}', crossConsoleName)
        .replace('{consoleName}', base.consoleName)
        .replace('{driverName}', base.driverName);

    const summary = summaryTemplate
        .replace(/{crossMetricName}/g, crossMetricName)
        .replace(/{metricName}/g, base.metricName)
        .replace('{correlationDetail}', `The trailing ${seededInt(seed + ':tq', 4, 8)}-quarter correlation coefficient is ${correlationStrength}.`)
        .replace(/{crossConsoleName}/g, crossConsoleName)
        .replace(/{consoleName}/g, base.consoleName)
        .replace('{correlationStrength}', correlationStrength)
        .replace(/{crossDriverName}/g, crossDriverName)
        .replace(/{crossTrend}/g, crossTrend)
        .replace('{impactMechanism}', `The transmission mechanism runs through ${base.driverName} in the driver hierarchy.`)
        .replace('{netEffect}', netEffect)
        .replace('{crossSignal}', `${crossTrend} in ${crossDriverName}`)
        .replace('{transmissionMechanism}', `This cross-console linkage is well-documented in the business architecture.`)
        .replace('{lagNote}', `Historical lag is approximately ${lagPeriod}.`)
        .replace('{relationshipNarrative}', `a ${correlationStrength} correlation that has strengthened over the past year`)
        .replace(/{crossTrend2}/g, crossTrend2)
        .replace('{lagPeriod}', lagPeriod)
        .replace('{implicationNote}', `Strategic implication: actions in ${crossConsoleName} have measurable downstream effects.`)
        .replace('{period}', period)
        .replace(/{driverName}/g, base.driverName)
        .replace('{impactDescription2}', `contributed to the observed ${base.trendWord} in ${base.metricName}`);

    return {
        title,
        category,
        insightLevel: 'L2',
        metricId: base.metricId,
        kpiValue: base.value,
        trendDirection: base.trend,
        priority: assignPriority(seed, 'cross-reference', !!base.target, base.computedStatus),
        summary,
        confidenceScore: assignConfidence(seed, 'cross-reference'),
        consoleLink: `/business-consoles/${base.consoleId}`,
        recommendations: selectRecommendations(seed, category, 'cross-reference'),
        relatedDrivers: buildRelatedDrivers(ctx, base, 'cross-reference', period),
    };
}

// ════════════════════════════════════════════════════════════════════════════
// HELPER: Flatten all drivers (without metrics context)
// ════════════════════════════════════════════════════════════════════════════

function flattenAllDrivers(drivers: SemanticDriver[]): SemanticDriver[] {
    const result: SemanticDriver[] = [];
    for (const d of drivers) {
        result.push(d);
        if (d.children) {
            result.push(...flattenAllDrivers(d.children));
        }
    }
    return result;
}

// ════════════════════════════════════════════════════════════════════════════
// RELATED DRIVERS BUILDER
// ════════════════════════════════════════════════════════════════════════════

function buildRelatedDrivers(
    ctx: FlattenedMetricContext,
    base: ReturnType<typeof buildBaseContext>,
    insightType: InsightType,
    period: string,
): RelatedDrivers {
    const seed = `${ctx.metric.id}:${period}:${insightType}:rd`;

    // Build impacted metrics from sibling metrics in the same driver
    const impactedMetrics: Array<{ metric: string; value: string; trend: string }> = [];
    if (ctx.driver.metrics) {
        for (const m of ctx.driver.metrics) {
            if (m.id !== ctx.metric.id) {
                const trend = computeTrend(m, base.periodIndex, seed + m.id);
                impactedMetrics.push({
                    metric: m.name,
                    value: m.currentValue ?? 'N/A',
                    trend,
                });
            }
        }
    }
    // Also check parent driver metrics
    if (ctx.parentDriver?.metrics) {
        for (const m of ctx.parentDriver.metrics) {
            if (m.id !== ctx.metric.id && impactedMetrics.length < 3) {
                impactedMetrics.push({
                    metric: m.name,
                    value: m.currentValue ?? 'N/A',
                    trend: computeTrend(m, base.periodIndex, seed + m.id),
                });
            }
        }
    }

    // Historical context
    const historicalContexts = [
        `${base.metricName} has been tracked since FY2019 with quarterly granularity`,
        `Historical range for ${base.metricName}: observed between ${seededPick(seed + ':hr1', ['the 25th and 75th percentile', 'seasonal highs and lows', 'growth and contraction phases'])}`,
        `Pre-pandemic average for this metric was approximately ${seededPick(seed + ':hr2', ['15-20% higher', '10-15% higher', 'comparable to current levels', 'materially different'])}`,
        `The ${base.driverName} driver tree has been in the architecture since FY2023`,
        `This metric gained strategic importance under the Becton, Dickinson and Company five-year $31.8B capital investment plan and clean energy transition strategy`,
    ];

    // Predictive insight
    const predictiveInsights = [
        `Leading indicators suggest ${base.trend === 'up' ? 'continued improvement' : base.trend === 'down' ? 'potential stabilization' : 'steady-state'} in the next 1-2 quarters`,
        `AI models project a ${seededPick(seed + ':pi1', ['65%', '72%', '58%', '80%'])} probability of ${base.trend === 'down' ? 'recovery' : 'sustained performance'} by Q3 FY26`,
        `Seasonal patterns suggest ${seededPick(seed + ':pi2', ['Q2 strength', 'Q3 acceleration', 'year-end closing activity lift', 'capital markets recovery tailwinds'])} ahead`,
        `The machine learning confidence interval narrows beyond Q2 FY26, suggesting higher predictability`,
        `Cross-console signals from ${seededPick(seed + ':pi3', ['BD Care Benefits Rate Base Growth', 'BD Services Transmission Operations', 'ESA Contracted Load Pipeline', 'Capital Allocation'])} are ${seededPick(seed + ':pi4', ['constructive', 'mixed', 'encouraging', 'cautiously positive'])}`,
    ];

    return {
        consoleId: ctx.console.id,
        consoleName: ctx.console.title,
        driverId: ctx.driver.id,
        driverPath: ctx.driverPath,
        metricId: ctx.metric.id,
        metricName: ctx.metric.name,
        fiscalPeriod: period,
        segment: ctx.console.segment,
        insightType,
        crossReferenceDriverIds: ctx.crossReferences,
        kpiLabel: ctx.metric.name,
        value: base.value,
        dataSource: seededPick(seed + ':ds', [
            'Becton, Dickinson and Company 10-Q Filing',
            'Internal Management Reporting',
            'Earnings Call Transcript (Q1 FY26)',
            'Board of Directors Package',
            'Missouri/IED/CVS Pharmacy/ATXI Operational Data Warehouse',
            'Financial Planning & Analysis',
            'Strategic Planning Office',
            'Finance360 Management Dashboard',
        ]),
        impactedMetrics,
        historicalContext: seededPick(seed + ':hc', historicalContexts),
        predictiveInsight: seededPick(seed + ':pi', predictiveInsights),
    };
}

// ════════════════════════════════════════════════════════════════════════════
// MASTER GENERATOR
// ════════════════════════════════════════════════════════════════════════════

/**
 * Generates 3,000-4,500 deterministic AI insights by traversing the semantic
 * business architecture. Calling this function multiple times produces the
 * exact same output.
 *
 * Returns InsightSeed[] — each entry maps to Prisma PersonalizedInsight
 * fields (minus id and companyId, which are added at seed/insert time).
 */
export function generateAllInsights(): InsightSeed[] {
    const insights: InsightSeed[] = [];
    const allContexts = getAllMetricContexts();

    for (const ctx of allContexts) {
        const metricSeed = ctx.metric.id;
        const hasCurrentValue = !!ctx.metric.currentValue;
        const hasTarget = !!ctx.metric.target;
        const hasCrossRefs = ctx.crossReferences.length > 0;
        const isTopLevel = ctx.depth <= 1;

        for (let pi = 0; pi < FISCAL_PERIODS.length; pi++) {
            const period = FISCAL_PERIODS[pi];
            const baseSeed = `${metricSeed}:${period}`;

            // ── FACT insights ──────────────────────────────────────────
            // Every metric with currentValue gets fact for current period and 1-2 prior
            if (hasCurrentValue) {
                if (pi === 5) {
                    // Current period — always generate
                    insights.push(generateFactInsight(ctx, period, pi, baseSeed + ':fact'));
                } else if (pi >= 3) {
                    // 1-2 prior periods — generate for ~70% of metrics
                    if (seededBool(baseSeed + ':factPrior', 0.70)) {
                        insights.push(generateFactInsight(ctx, period, pi, baseSeed + ':fact'));
                    }
                } else if (pi >= 1) {
                    // Older periods — only for ~20% of metrics
                    if (seededBool(baseSeed + ':factOld', 0.20)) {
                        insights.push(generateFactInsight(ctx, period, pi, baseSeed + ':fact'));
                    }
                }
            }

            // ── TREND insights ─────────────────────────────────────────
            // Every metric gets trend for 2-3 recent periods
            if (pi >= 3) {
                // Recent periods — ~80% chance
                if (seededBool(baseSeed + ':trendRecent', 0.80)) {
                    insights.push(generateTrendInsight(ctx, period, pi, baseSeed + ':trend'));
                }
            } else if (pi >= 1) {
                // Older periods — ~25% chance
                if (seededBool(baseSeed + ':trendOld', 0.25)) {
                    insights.push(generateTrendInsight(ctx, period, pi, baseSeed + ':trend'));
                }
            }

            // ── VARIANCE insights ──────────────────────────────────────
            // Every metric with target gets variance for current period
            if (hasTarget && pi === 5) {
                insights.push(generateVarianceInsight(ctx, period, pi, baseSeed + ':var'));
            }
            // Also ~40% chance for recent prior periods with targets
            if (hasTarget && pi >= 3 && pi < 5) {
                if (seededBool(baseSeed + ':varPrior', 0.40)) {
                    insights.push(generateVarianceInsight(ctx, period, pi, baseSeed + ':var'));
                }
            }

            // ── ANOMALY insights ───────────────────────────────────────
            // ~15% of metrics randomly across recent periods
            if (pi >= 2 && seededBool(baseSeed + ':anomaly', 0.15)) {
                insights.push(generateAnomalyInsight(ctx, period, pi, baseSeed + ':anom'));
            }

            // ── FORECAST insights ──────────────────────────────────────
            // Only top-level/important drivers (~30%), only for current period
            if (pi === 5 && (isTopLevel || seededBool(baseSeed + ':forecastElig', 0.30))) {
                insights.push(generateForecastInsight(ctx, period, pi, baseSeed + ':fore'));
            }

            // ── WHAT-IF insights ───────────────────────────────────────
            // Only top-level (~30%), only current period
            if (pi === 5 && (isTopLevel || seededBool(baseSeed + ':whatifElig', 0.25))) {
                insights.push(generateWhatIfInsight(ctx, period, pi, baseSeed + ':whatif'));
            }

            // ── ROOT CAUSE insights ────────────────────────────────────
            // Only top-level (~30%), only current and one prior period
            if (pi >= 4 && (isTopLevel || seededBool(baseSeed + ':rcElig', 0.25))) {
                insights.push(generateRootCauseInsight(ctx, period, pi, baseSeed + ':rc'));
            }

            // ── CROSS-REFERENCE insights ───────────────────────────────
            // Only drivers with crossReferences, recent periods
            if (hasCrossRefs && pi >= 3) {
                if (seededBool(baseSeed + ':xref', 0.65)) {
                    insights.push(generateCrossReferenceInsight(ctx, period, pi, baseSeed + ':xref'));
                }
            }
        }
    }

    return insights;
}

// ════════════════════════════════════════════════════════════════════════════
// UTILITY EXPORTS
// ════════════════════════════════════════════════════════════════════════════

/** Get a summary count of insights by type/level/category */
export function getInsightStatistics(insights: InsightSeed[]) {
    const byLevel: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byTrend: Record<string, number> = {};

    for (const i of insights) {
        byLevel[i.insightLevel] = (byLevel[i.insightLevel] ?? 0) + 1;
        byCategory[i.category] = (byCategory[i.category] ?? 0) + 1;
        byPriority[i.priority] = (byPriority[i.priority] ?? 0) + 1;
        byTrend[i.trendDirection] = (byTrend[i.trendDirection] ?? 0) + 1;
    }

    return {
        total: insights.length,
        byLevel,
        byCategory,
        byPriority,
        byTrend,
    };
}
