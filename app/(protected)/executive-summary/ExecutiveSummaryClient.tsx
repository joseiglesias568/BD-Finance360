'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Calendar,
    DollarSign,
    Maximize2,
    Shield,
    Sparkles,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
    X,
    Zap
} from 'lucide-react';
import AIFeedback from '@/components/feedback/AIFeedback';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { KPIConfig, FinancialConfig } from '@/config/types';
import { ensureExecutiveOverviewFinancials } from '@/lib/engines/exec-overview-financials';

import {
    AreaChart, Area, BarChart, Bar, ComposedChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, ReferenceLine, Legend,
} from 'recharts';

// ── Chart constants ──────────────────────────────────────────────────
const CK = { green: '#1c519c', greenLight: '#1c519c', emerald: '#10B981', blue: '#3B82F6', amber: '#F59E0B', red: '#EF4444', gray: '#9CA3AF', grayLight: '#E5E7EB' };
const darkAxis = { fontSize: 9, fill: 'rgba(255,255,255,0.5)' };
const lightAxis = { fontSize: 10, fill: '#6B7280' };
const darkTooltip = { contentStyle: { background: '#1c519c', border: 'none', borderRadius: 8, fontSize: 11, color: '#fff', padding: '6px 10px' } };
const lightTooltip = { contentStyle: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11, color: '#1c519c', padding: '6px 10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } };

// ── Data transformation helpers ──────────────────────────────────────
function buildRevenueTrend(fin: FinancialConfig) {
    return (fin.quarters ?? [])
        .filter(q => q.revenue > 0)
        .map(q => ({
            q: q.quarter.replace('FY', "'"),
            rev: q.revenue,
            yoy: q.revenueYoY,
            margin: q.operatingMargin ?? null,
        }));
}
function buildMarginTrend(fin: FinancialConfig) {
    return (fin.quarters ?? []).map(q => ({ q: q.quarter.replace('FY', "'"), margin: q.operatingMargin }));
}
function buildSegmentMix(fin: FinancialConfig) {
    const abbrev = (name: string) =>
        name
            .replace(' Passenger', '')
            .replace(' (Third-Party Sales)', '')
            .replace('Loyalty / MRO / Other', 'Loyalty/MRO');
    return (fin.segments ?? []).map((s) => ({
        name: abbrev(s.name).length > 12 ? `${abbrev(s.name).slice(0, 11)}…` : abbrev(s.name),
        pct: s.revenuePercent,
        yoy: s.yoyChange,
        full: s.name,
    }));
}
function buildWaterfall(fin: FinancialConfig) {
    const py = fin.plSummary?.revenue?.priorYear ?? 9100;
    const steps: { name: string; base: number; value: number; color: string }[] = [{ name: 'PY Rev', base: 0, value: py, color: '#6B7280' }];
    let running = py;
    (fin.revenueBridge ?? []).forEach(item => {
        if (item.impact >= 0) {
            steps.push({ name: item.label.length > 10 ? item.label.slice(0, 10) + '…' : item.label, base: running, value: item.impact, color: CK.green });
        } else {
            steps.push({ name: item.label.length > 10 ? item.label.slice(0, 10) + '…' : item.label, base: running + item.impact, value: Math.abs(item.impact), color: CK.red });
        }
        running += item.impact;
    });
    steps.push({ name: 'Actual', base: 0, value: running, color: '#1c519c' });
    return steps;
}

/** Compress waterfall Y-range by clipping below ~$14B (14,000 $M) so bridge steps read clearly vs PY/Actual. */
function waterfallDisplayFloorM(steps: { base: number; value: number }[]): number {
    if (!steps.length) return 0;
    const py = steps[0].value;
    const actual = steps[steps.length - 1].value;
    const anchor = Math.min(py, actual);
    return Math.floor(anchor / 1000) * 1000;
}

function zoomWaterfallStepsForAxis(
    steps: { name: string; base: number; value: number; color: string }[],
    floor: number,
): Array<{ name: string; base: number; value: number; color: string; absTop: number }> {
    return steps.map((s) => {
        const absTop = s.base + s.value;
        const lo = s.base - floor;
        const hi = absTop - floor;
        const loC = Math.max(0, lo);
        const hiC = Math.max(0, hi);
        return {
            name: s.name,
            base: loC,
            value: hiC - loC,
            color: s.color,
            absTop,
        };
    });
}
/** Same quarter axis label as Operational chart (`buildCompEps`). */
function quarterChartLabel(quarter: string): string {
    return quarter.replace('FY', "'");
}

/**
 * Quarter-over-quarter changes vs prior fiscal quarter, aligned to the same `q` series as Operational.
 * First quarter has no in-window prior — metrics are null (no dot / break).
 * Revenue & operating income: QoQ % from consolidated figures ($B in source).
 * EPS: QoQ % when prior-quarter EPS magnitude is material.
 * Operating margin: absolute change in percentage points (not a % of margin).
 */

/** Quarterly revenue ($B) bars + operating margin (%) line.
 *  Accepts width/height injected by ResponsiveContainer via cloneElement. */
function FinancialPerformanceChart({
    data,
    width,
    height,
}: {
    data: ReturnType<typeof buildRevenueTrend>;
    width?: number;
    height?: number;
}) {
    return (
        <ComposedChart data={data} width={width} height={height} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="q" tick={lightAxis} axisLine={false} tickLine={false} />
            <YAxis
                yAxisId="left"
                tick={lightAxis}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${v}B`}
                domain={[0, 'auto']}
                label={{ value: 'Revenue ($B)', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: '#9CA3AF' } }}
            />
            <YAxis
                yAxisId="right"
                orientation="right"
                tick={lightAxis}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
                label={{ value: 'Op Margin %', angle: 90, position: 'insideRight', style: { fontSize: 9, fill: '#9CA3AF' } }}
            />
            <Tooltip
                {...lightTooltip}
                formatter={(value: unknown, name: string) => {
                    if (value == null || typeof value !== 'number') return ['—', name];
                    if (String(name).includes('Margin')) return [`${value.toFixed(1)}%`, name];
                    return [`$${value.toFixed(2)}B`, name];
                }}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} iconSize={8} />
            <Bar yAxisId="left" dataKey="rev" name="Revenue ($B)" fill={CK.green} radius={[2, 2, 0, 0]} barSize={26} fillOpacity={0.85} />
            <Line yAxisId="right" type="monotone" dataKey="margin" name="Op Margin %" stroke={CK.amber} strokeWidth={2} dot={{ r: 3, fill: CK.amber }} connectNulls />
        </ComposedChart>
    );
}

function buildCompEps(fin: FinancialConfig) {
    return (fin.quarters ?? []).map(q => ({ q: quarterChartLabel(q.quarter), comp: q.feeRevenueGrowth, eps: q.eps }));
}

/**
 * Working capital & liquidity: single comparable score (% vs target), positive = favorable.
 * Lower-is-better metrics use (target − actual) / |target|; higher-is-better use (actual − target) / |target|.
 */
function buildLiquidityVsTargetScores(fin: FinancialConfig) {
    const wc = fin.workingCapital;
    const r = fin.ratios;
    if (!wc || !r) return [];
    const rows: {
        label: string;
        scorePct: number;
        actual: number;
        target: number;
        unit: string;
    }[] = [];

    const lowerBetter = (label: string, actual: number, target: number, unit: string) => {
        const t = Math.abs(target) < 1e-9 ? 1 : Math.abs(target);
        const scorePct = ((target - actual) / t) * 100;
        rows.push({ label, scorePct, actual, target, unit });
    };
    const higherBetter = (label: string, actual: number, target: number, unit: string) => {
        const t = Math.abs(target) < 1e-9 ? 1 : Math.abs(target);
        const scorePct = ((actual - target) / t) * 100;
        rows.push({ label, scorePct, actual, target, unit });
    };

    lowerBetter('DSO', wc.dso, wc.dsoTarget, 'days');
    lowerBetter('Inventory days', wc.inventoryDays, wc.inventoryDaysTarget, 'days');
    higherBetter('DPO', wc.dpo, wc.dpoTarget, 'days');
    higherBetter('Current ratio', r.currentRatio, r.currentRatioTarget ?? 0.5, 'x');
    higherBetter('FCF (LTM)', r.freeCashFlow, r.freeCashFlowTarget ?? 4, '$B');

    return rows;
}

function marginQoQBps(fin: FinancialConfig): number | null {
    const q = fin.quarters ?? [];
    if (q.length < 2) return null;
    return Math.round((q[q.length - 1].operatingMargin - q[q.length - 2].operatingMargin) * 100);
}

function operatingMarginChartDomain(fin: FinancialConfig): [number, number] {
    const margins = (fin.quarters ?? []).map((x) => x.operatingMargin);
    if (!margins.length) return [0, 12];
    const lo = Math.min(...margins);
    const hi = Math.max(...margins);
    const pad = Math.max(0.75, (hi - lo) * 0.12);
    return [Math.max(0, lo - pad), hi + pad];
}

const OUTCOME_OVERVIEW_UI: Record<string, { sectionTitle: string; chartTitle: string }> = {
    Commercial: {
        sectionTitle: 'Commercial performance',
        chartTitle: 'Revenue bridge: prior-year → actual ($M)',
    },
    Operational: {
        sectionTitle: 'Operational performance',
        chartTitle: 'Other revenue growth % & diluted EPS ($)',
    },
    Financial: {
        sectionTitle: 'Financial performance',
        chartTitle: 'Quarterly revenue ($B) & operating margin (%)',
    },
    Risk: {
        sectionTitle: 'Liquidity & working capital',
        chartTitle: 'Vs target (score) + operating margin trend',
    },
};
interface DBPillar {
    id: string;
    label: string;
    value: string;
    change: number;
    target: string;
    status: string;
    color: string;
    keyInsight: string;
    actionRequired: boolean;
    metrics: Array<{ label: string; value: string; change: number; vsTarget: string }>;
    forecast: string;
    sparkline: number[];
    subMetrics: Array<{ name: string; value: string }>;
}

interface DBBriefing {
    summary: string;
    keyHighlights: Array<{ type: string; text: string }>;
    recommendations: string[];
}

interface DBDecision {
    id: number;
    title: string;
    priority: string;
    urgency: string;
    owner: string;
    dueDate: string;
    description: string;
    financialImpact: string;
    riskLevel: string;
    status: string;
    category: string;
    businessOutcome: string;
    impact: string;
    riskAssessment: string;
    stakeholders: string[];
    dependencies: string[];
}

interface DBInsightItem {
    id: number;
    category: string;
    businessOutcome: string;
    title: string;
    metric: string;
    change: number;
    status: string;
    insight: string;
    drivers: string[];
    actions: string[];
    relatedMetrics: Record<string, string>;
}

interface DBRiskOpps {
    risks: Array<{ title: string; probability: string; impact: string; mitigation: string; trend: string }>;
    opportunities: Array<{ title: string; probability: string; impact: string; action: string; trend: string }>;
}

interface ExecutiveSummaryClientProps {
    pillars: DBPillar[];
    briefing: DBBriefing | null;
    decisions: DBDecision[];
    insights: DBInsightItem[];
    riskOpportunities: DBRiskOpps;
    kpis: KPIConfig;
    financials: FinancialConfig;
}


export default function ExecutiveSummaryClient({ pillars: _pillars, briefing, decisions, insights, riskOpportunities, kpis, financials }: ExecutiveSummaryClientProps) {
    const router = useRouter();
    const [selectedInsight, setSelectedInsight] = useState<DBInsightItem | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeView, setActiveView] = useState('overview');

    const overviewFin = useMemo(() => ensureExecutiveOverviewFinancials(financials), [financials]);

    const dm = financials.executiveDisplayMetrics;
    const latest = financials.latestQuarter;
    const qoqMarginBps = marginQoQBps(financials);
    const [marginChartLo, marginChartHi] = operatingMarginChartDomain(financials);

    const adjRevYoY = dm?.adjustedRevenueYoYPercent ?? latest?.adjustedRevenueYoY;
    // Overview shows all outcomes expanded (no accordion)

    // Client-only time state to avoid hydration mismatch
    const [currentTime, setCurrentTime] = useState<string>('');
    const [timeGreeting, setTimeGreeting] = useState('Good afternoon');
    useEffect(() => {
        const update = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
            const h = now.getHours();
            setTimeGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
        };
        update();
        const interval = setInterval(update, 60_000);
        return () => clearInterval(interval);
    }, []);

    // Use DB data directly (already shaped correctly by repository)
    const rawBriefing = briefing ?? { summary: '', keyHighlights: [], recommendations: [] };
    const executiveBriefing = rawBriefing;
    const keyDecisions = decisions;
    const risksOpportunities = riskOpportunities;
    const businessInsights = insights;

    const handleInsightClick = (insight: DBInsightItem) => {
        setSelectedInsight(insight);
        setShowModal(true);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Executive Summary - {financials.latestQuarter?.quarter ?? 'Current Quarter'}</h1>
                            <p className="text-sm text-gray-500">{timeGreeting}, Team • Real-time insights as of {currentTime || '--:--:--'}</p>
                        </div>

                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-4">
                {/* AI Financial Snapshot — Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 bg-gradient-to-br from-[#1c519c] via-[#1c519c] to-[#1c519c] rounded-xl p-6 border border-emerald-600/30 shadow-lg shadow-emerald-500/10"
                >
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-[#F0F0F0] rounded-lg">
                                <Sparkles className="w-4 h-4 text-[#1c519c]" />
                            </div>
                            <h2 className="text-base font-bold text-white">AI Financial Snapshot</h2>
                            <span className="text-xs text-white/40 ml-2">— {financials.latestQuarter?.quarter ?? 'Current Quarter'}</span>
                        </div>
                        <span className="text-xs text-emerald-200">As of {currentTime}</span>
                    </div>

                    {/* AI Briefing prose — readable text, not in a tile */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <p className="text-[15px] text-white/90 leading-relaxed flex-1">{executiveBriefing.summary}</p>
                        <div className="flex-shrink-0 mt-1">
                            <AIFeedback contentId="exec-summary-ai-briefing" contentType="insight" size="sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3 mb-6">
                        {executiveBriefing.keyHighlights.slice(0, 4).map((h, i) => (
                            <div key={i} className="flex items-start space-x-2.5">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${h.type === 'positive' ? 'bg-emerald-400' : h.type === 'warning' ? 'bg-amber-400' : 'bg-red-400'}`} />
                                <span className="text-[13px] text-white/80 leading-snug">{h.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Separator */}
                    <div className="border-t border-white/10 pt-6" />

                    {/* 4-column business tiles */}
                    <div className="grid grid-cols-4 gap-5">

                        {/* Tile 1: Revenue & Growth */}
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                            <p className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-1">Revenue</p>
                            <div className="flex items-baseline space-x-2 mb-1">
                                <span className="text-4xl font-extrabold text-white">${financials.latestQuarter?.revenue}B</span>
                                <span className="text-sm font-bold text-emerald-400">+{financials.latestQuarter?.revenueYoY}% YoY</span>
                            </div>
                            <p className="text-xs text-white/40 mb-4">
                                {dm?.revenueFootnote ?? `${latest?.quarter ?? 'Latest'} · Total operating revenue`}
                            </p>
                            {/* Supporting KPIs */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                                <div>
                                    <p className="text-[11px] text-white/40">GAAP rev. YoY</p>
                                    <p className="text-base font-bold text-emerald-400">
                                        +{latest?.revenueYoY ?? '—'}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-white/40">Adjusted rev. YoY</p>
                                    <p className="text-base font-bold text-white">
                                        {adjRevYoY !== undefined ? `+${adjRevYoY}%` : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-white/40">Health Services Rev. YoY</p>
                                    <p className="text-base font-bold text-white">
                                        {dm?.premiumProductRevenueYoYPercent !== undefined
                                            ? `+${dm.premiumProductRevenueYoYPercent}%`
                                            : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-white/40">Other revenue YoY</p>
                                    <p className="text-base font-bold text-white/90">
                                        {latest?.feeRevenueGrowth !== undefined ? `+${latest.feeRevenueGrowth}%` : '—'}
                                    </p>
                                </div>
                            </div>
                            {/* Chart */}
                            <div className="h-[80px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={buildRevenueTrend(financials)} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                                        <XAxis dataKey="q" tick={darkAxis} axisLine={false} tickLine={false} />
                                        <YAxis tick={darkAxis} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                                        <Tooltip {...darkTooltip} />
                                        <Bar dataKey="rev" fill="#F0F0F0" radius={[2, 2, 0, 0]} barSize={18} name="Revenue ($B)" />
                                        <Line type="monotone" dataKey="yoy" stroke="#10B981" strokeWidth={2} dot={{ r: 2, fill: '#10B981' }} name="YoY %" yAxisId={0} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Tile 2: Profitability */}
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                            <p className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-1">Profitability</p>
                            <div className="flex items-baseline space-x-2 mb-1">
                                <span className="text-4xl font-extrabold text-white">{financials.latestQuarter?.operatingMargin}%</span>
                                <span className="text-sm font-bold text-emerald-400">
                                    {qoqMarginBps === null
                                        ? '—'
                                        : `${qoqMarginBps >= 0 ? '+' : ''}${qoqMarginBps}bps QoQ`}
                                </span>
                            </div>
                            <p className="text-xs text-white/40 mb-4">
                                {latest?.quarter} · GAAP {latest?.operatingMargin}% · Adj{' '}
                                {dm?.adjustedOperatingMarginPercent ?? '—'}%
                            </p>
                            {/* Supporting KPIs */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                                <div>
                                    <p className="text-[11px] text-white/40">GAAP diluted EPS</p>
                                    <p className="text-base font-bold text-white">
                                        {latest?.eps !== undefined ? `$${latest.eps.toFixed(2)}` : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-white/40">Adjusted EPS</p>
                                    <p className="text-base font-bold text-emerald-400">
                                        {dm?.adjustedEpsDollars !== undefined
                                            ? `$${dm.adjustedEpsDollars.toFixed(2)}`
                                            : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-white/40">FCF proxy (near-term)</p>
                                    <p className="text-base font-bold text-white">
                                        {dm?.freeCashFlowQuarterlyBillions !== undefined
                                            ? `$${dm.freeCashFlowQuarterlyBillions.toFixed(2)}B`
                                            : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-white/40">FY FCF (baseline)</p>
                                    <p className="text-base font-bold text-white/90">
                                        {financials.ratios?.freeCashFlow != null
                                            ? `$${financials.ratios.freeCashFlow.toFixed(2)}B`
                                            : '—'}
                                    </p>
                                </div>
                            </div>
                            {/* Chart */}
                            <div className="h-[80px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={buildMarginTrend(financials)} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                                        <defs>
                                            <linearGradient id="marginGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F0F0F0" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#F0F0F0" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="q" tick={darkAxis} axisLine={false} tickLine={false} />
                                        <YAxis tick={darkAxis} axisLine={false} tickLine={false} domain={[marginChartLo, marginChartHi]} />
                                        <Tooltip {...darkTooltip} />
                                        <Area type="monotone" dataKey="margin" stroke="#F0F0F0" strokeWidth={2} fill="url(#marginGrad)" dot={{ r: 3, fill: '#F0F0F0', stroke: '#F0F0F0' }} name="Op Margin %" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Tile 3: Health Operations */}
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                            <p className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-1">Operations</p>
                            <div className="flex items-baseline space-x-2 mb-1">
                                <span className="text-4xl font-extrabold text-white">~40%</span>
                                <span className="text-sm font-bold text-emerald-400">→ 80% FY28 target</span>
                            </div>
                            <p className="text-xs text-white/40 mb-4">AI prior auth automation · Health100 digital efficiency</p>
                            {/* Supporting KPIs */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                                <div>
                                    <p className="text-[11px] text-white/40">Oak Street VBC Pts</p>
                                    <p className="text-base font-bold text-emerald-400">~38K</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-white/40">Store Optimization</p>
                                    <p className="text-base font-bold text-white">$300M+</p>
                                </div>
                            </div>
                            {/* Sparkline-style metric bars */}
                            <div className="space-y-2.5 mt-1">
                                <div>
                                    <div className="flex justify-between text-[10px] mb-1">
                                        <span className="text-white/40">GLP-1 Volume vs Plan</span>
                                        <span className="text-white/70">+34% <span className="text-emerald-400">vs +22% plan</span></span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400/60 rounded-full" style={{ width: '92%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] mb-1">
                                        <span className="text-white/40">Digital Rx Fill Rate</span>
                                        <span className="text-white/70">35% <span className="text-amber-400">vs 40% target</span></span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400/60 rounded-full" style={{ width: '88%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tile 4: Loyalty & Reach */}
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                            <p className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-1">Loyalty &amp; Reach</p>
                            <div className="flex items-baseline space-x-2 mb-1">
                                <span className="text-4xl font-extrabold text-white">75M</span>
                                <span className="text-sm font-bold text-amber-400">→ 80M target</span>
                            </div>
                            <p className="text-xs text-white/40 mb-4">ExtraCare active members · HealthHUB 1,300+ locations</p>
                            {/* Segment stacked bar */}
                            <div className="mb-3">
                                <div className="flex h-6 rounded-full overflow-hidden">
                                    {buildSegmentMix(overviewFin).map((seg, i) => (
                                        <div
                                            key={seg.name}
                                            className="flex items-center justify-center text-[9px] font-bold"
                                            style={{
                                                width: `${seg.pct}%`,
                                                backgroundColor: i === 0 ? '#F0F0F0' : i === 1 ? '#3B82F6' : '#F59E0B',
                                                color: i === 0 ? '#1c519c' : '#fff',
                                            }}
                                        >
                                            {seg.pct}%
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Segment legend */}
                            <div className="space-y-2">
                                {buildSegmentMix(overviewFin).map((seg, i) => (
                                    <div key={seg.name} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: i === 0 ? '#F0F0F0' : i === 1 ? '#3B82F6' : '#F59E0B' }} />
                                            <span className="text-xs text-white/70">{seg.full}</span>
                                        </div>
                                        <span className={`text-xs font-bold ${seg.yoy >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {seg.yoy >= 0 ? '+' : ''}{seg.yoy}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* View Tabs */}
                <div className="flex items-center space-x-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
                    {['overview', 'decisions', 'risks'].map((view) => (
                        <button
                            key={view}
                            onClick={() => setActiveView(view)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === view
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {view.charAt(0).toUpperCase() + view.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content based on active view */}
                <AnimatePresence mode="wait">
                    {activeView === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <p className="text-xs text-gray-500 px-1 max-w-4xl leading-relaxed">
                                Performance charts use merged quarterly data from Finance360&apos;s BD dataset (aligned to{' '}
                                <span className="font-medium text-gray-700">FY2025 Form 10-K</span>,{' '}
                                <span className="font-medium text-gray-700">Q1 2026 Form 10-Q</span>, and cited earnings /
                                supplemental materials in <code className="text-[11px] bg-gray-100 px-1 rounded">config/clients/aee/financials.ts</code>
                                ). Replace with live Edgar / data-lake ingest when available.
                            </p>
                            {['Commercial', 'Operational', 'Financial', 'Risk'].map((outcome) => {
                                const outcomeInsights = businessInsights.filter(insight => insight.businessOutcome === outcome);
                                const criticalCount = outcomeInsights.filter(i => i.status === 'critical' || i.status === 'high').length;

                                const outcomeColor = outcome === 'Commercial' ? 'border-l-[#1c519c]' :
                                    outcome === 'Operational' ? 'border-l-emerald-500' :
                                        outcome === 'Financial' ? 'border-l-green-500' : 'border-l-red-500';

                                const outcomeIcon = outcome === 'Commercial' ? <TrendingUp className="w-4 h-4 text-[#1c519c]" /> :
                                    outcome === 'Operational' ? <Activity className="w-4 h-4 text-emerald-600" /> :
                                        outcome === 'Financial' ? <DollarSign className="w-4 h-4 text-green-600" /> :
                                            <Shield className="w-4 h-4 text-red-600" />;

                                const overviewUi = OUTCOME_OVERVIEW_UI[outcome] ?? {
                                    sectionTitle: `${outcome} performance`,
                                    chartTitle: 'Performance trend',
                                };

                                const wfRaw = outcome === 'Commercial' ? buildWaterfall(overviewFin) : [];
                                const commercialBridgeThin = outcome === 'Commercial' && wfRaw.length < 4;
                                const commercialWaterfallFloor =
                                    outcome === 'Commercial' && wfRaw.length >= 4 ? waterfallDisplayFloorM(wfRaw) : 0;
                                const wfData =
                                    outcome === 'Commercial' && wfRaw.length >= 4
                                        ? zoomWaterfallStepsForAxis(wfRaw, commercialWaterfallFloor)
                                        : wfRaw;
                                const commercialChartTitle = commercialBridgeThin
                                    ? 'Total revenue ($B) & YoY % — quarterly (seed / merged)'
                                    : overviewUi.chartTitle;

                                const liqData = buildLiquidityVsTargetScores(overviewFin);

                                return (
                                    <div key={outcome} className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${outcomeColor} overflow-hidden`}>
                                        {/* Section header */}
                                        <div className="px-5 py-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {outcomeIcon}
                                                <h3 className="text-sm font-bold text-[#1c519c]">{overviewUi.sectionTitle}</h3>
                                                <span className="text-xs text-gray-400">
                                                    {outcomeInsights.length}{' '}
                                                    {outcomeInsights.length === 1 ? 'insight' : 'insights'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                {criticalCount > 0 && (
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                        {criticalCount} attention
                                                    </span>
                                                )}
                                                <div className="flex items-center space-x-2">
                                                    {outcomeInsights.map((ins) => (
                                                        <span key={ins.id} className={`text-xs font-semibold ${ins.change > 0 ? 'text-green-600' : ins.change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                                            {ins.change > 0 ? '+' : ''}{ins.change}%
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chart + condensed insights — 2 column */}
                                        <div className="px-5 pb-4 pt-1 border-t border-gray-100">
                                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                                {/* Left: Chart (3/5) */}
                                                <div className="lg:col-span-3">
                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{commercialChartTitle}</p>
                                                    <div className={`w-full ${outcome === 'Risk' ? 'min-h-[232px] h-[232px]' : 'min-h-[180px] h-[180px]'}`}>
                                                        {outcome === 'Risk' ? (
                                                            <div className="flex flex-col h-full w-full gap-1">
                                                                <div className="h-[128px] min-h-[128px] w-full">
                                                                    <ResponsiveContainer width="100%" height="100%">
                                                                        <BarChart data={liqData} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 4 }}>
                                                                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                                                            <XAxis type="number" tick={lightAxis} axisLine={false} tickLine={false} />
                                                                            <YAxis type="category" dataKey="label" tick={lightAxis} axisLine={false} tickLine={false} width={82} />
                                                                            <Tooltip
                                                                                {...lightTooltip}
                                                                                formatter={(value: number, _name: string, item: { payload?: { actual?: number; target?: number; unit?: string } }) => {
                                                                                    const p = item?.payload;
                                                                                    const u = p?.unit ?? '';
                                                                                    const act = p?.actual;
                                                                                    const tgt = p?.target;
                                                                                    const detail = act != null && tgt != null ? ` (${act} vs ${tgt}${u === '$B' ? ' $B' : u === 'days' ? 'd' : u === 'x' ? 'x' : ''})` : '';
                                                                                    return [`${value >= 0 ? '+' : ''}${value.toFixed(1)}% vs target${detail}`, 'Score'];
                                                                                }}
                                                                            />
                                                                            <ReferenceLine x={0} stroke="#e5e7eb" />
                                                                            <Bar dataKey="scorePct" name="Vs target" radius={[0, 2, 2, 0]} barSize={10}>
                                                                                {liqData.map((row, i) => (
                                                                                    <Cell key={i} fill={row.scorePct >= 0 ? CK.green : CK.red} />
                                                                                ))}
                                                                            </Bar>
                                                                        </BarChart>
                                                                    </ResponsiveContainer>
                                                                </div>
                                                                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">Operating margin trend (GAAP %, quarterly)</p>
                                                                <div className="flex-1 min-h-[88px] w-full">
                                                                    <ResponsiveContainer width="100%" height="100%">
                                                                        <AreaChart data={buildMarginTrend(overviewFin)} margin={{ top: 2, right: 10, bottom: 2, left: -18 }}>
                                                                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                                                            <XAxis dataKey="q" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                                                            <YAxis tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                                                                            <Tooltip {...lightTooltip} formatter={(v: number) => [`${v}%`, 'Op margin']} />
                                                                            <Area type="monotone" dataKey="margin" stroke={CK.green} fill={CK.green} fillOpacity={0.12} name="Op margin %" />
                                                                        </AreaChart>
                                                                    </ResponsiveContainer>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                {outcome === 'Commercial' ? (
                                                                commercialBridgeThin ? (
                                                                    <ComposedChart data={buildRevenueTrend(overviewFin)} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                                                        <XAxis dataKey="q" tick={lightAxis} axisLine={false} tickLine={false} />
                                                                        <YAxis yAxisId="left" tick={lightAxis} axisLine={false} tickLine={false} label={{ value: '$B', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: '#9CA3AF' } }} />
                                                                        <YAxis yAxisId="right" orientation="right" tick={lightAxis} axisLine={false} tickLine={false} label={{ value: 'YoY %', angle: 90, position: 'insideRight', style: { fontSize: 9, fill: '#9CA3AF' } }} />
                                                                        <Tooltip {...lightTooltip} />
                                                                        <Bar dataKey="rev" yAxisId="left" name="Revenue ($B)" fill={CK.green} radius={[2, 2, 0, 0]} barSize={22} />
                                                                        <Line type="monotone" dataKey="yoy" yAxisId="right" stroke={CK.amber} strokeWidth={2} dot={{ r: 3, fill: CK.amber }} name="YoY %" />
                                                                    </ComposedChart>
                                                                ) : (
                                                                    <BarChart data={wfData} margin={{ top: 5, right: 10, bottom: 5, left: 6 }}>
                                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                                                        <XAxis dataKey="name" tick={lightAxis} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={40} />
                                                                        <YAxis
                                                                            tick={lightAxis}
                                                                            axisLine={false}
                                                                            tickLine={false}
                                                                            tickFormatter={(v: number) => {
                                                                                const abs = v + commercialWaterfallFloor;
                                                                                return abs >= 1000 ? `$${(abs / 1000).toFixed(1)}B` : `$${abs}M`;
                                                                            }}
                                                                            label={{ value: `Revenue ($M, axis from ~$${(commercialWaterfallFloor / 1000).toFixed(0)}B)`, angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: '#9CA3AF' } }}
                                                                        />
                                                                        <Tooltip
                                                                            content={({ active, payload }) => {
                                                                                if (!active || !payload?.length) return null;
                                                                                const row = payload[0]?.payload as { name?: string; absTop?: number } | undefined;
                                                                                if (!row?.name || row.absTop == null) return null;
                                                                                const t = row.absTop;
                                                                                const s = t >= 1000 ? `$${(t / 1000).toFixed(2)}B` : `$${t}M`;
                                                                                return (
                                                                                    <div
                                                                                        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-[#1c519c]"
                                                                                        style={lightTooltip.contentStyle}
                                                                                    >
                                                                                        <p className="font-semibold">{row.name}</p>
                                                                                        <p className="text-gray-600 mt-0.5">Cumulative revenue {s} ($M scale)</p>
                                                                                    </div>
                                                                                );
                                                                            }}
                                                                        />
                                                                        <Bar dataKey="base" stackId="stack" fill="transparent" />
                                                                        <Bar dataKey="value" stackId="stack" radius={[2, 2, 0, 0]}>
                                                                            {wfData.map((entry, i) => (
                                                                                <Cell key={i} fill={entry.color} />
                                                                            ))}
                                                                        </Bar>
                                                                    </BarChart>
                                                                )
                                                            ) : outcome === 'Operational' ? (
                                                                <ComposedChart data={buildCompEps(overviewFin)} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                                                    <XAxis dataKey="q" tick={lightAxis} axisLine={false} tickLine={false} />
                                                                    <YAxis yAxisId="left" tick={lightAxis} axisLine={false} tickLine={false} label={{ value: 'Other rev. YoY %', angle: -90, position: 'insideLeft', style: { fontSize: 9, fill: '#9CA3AF' } }} />
                                                                    <YAxis yAxisId="right" orientation="right" tick={lightAxis} axisLine={false} tickLine={false} label={{ value: 'EPS $', angle: 90, position: 'insideRight', style: { fontSize: 9, fill: '#9CA3AF' } }} />
                                                                    <Tooltip {...lightTooltip} />
                                                                    <ReferenceLine y={0} yAxisId="left" stroke="#e5e7eb" />
                                                                    <Bar dataKey="comp" yAxisId="left" name="Other revenue YoY %" radius={[2, 2, 0, 0]} barSize={24}>
                                                                        {buildCompEps(overviewFin).map((entry, i) => (
                                                                            <Cell key={i} fill={entry.comp >= 0 ? CK.green : CK.red} />
                                                                        ))}
                                                                    </Bar>
                                                                    <Line type="monotone" dataKey="eps" yAxisId="right" stroke={CK.amber} strokeWidth={2} dot={{ r: 3, fill: CK.amber }} name="EPS ($)" />
                                                                </ComposedChart>
                                                            ) : (
                                                                    <FinancialPerformanceChart data={buildRevenueTrend(overviewFin)} />
                                                                )}
                                                        </ResponsiveContainer>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right: Condensed insight cards (2/5) */}
                                                <div className="lg:col-span-2 space-y-2">
                                                    {outcomeInsights.length > 0 ? (
                                                        outcomeInsights.map((insight) => (
                                                            <div
                                                                key={insight.id}
                                                                className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition-all border bg-gray-50 ${insight.status === 'critical' ? 'border-red-200' :
                                                                    insight.status === 'high' ? 'border-amber-200' :
                                                                        insight.status === 'medium' ? 'border-blue-200' : 'border-gray-200'
                                                                    }`}
                                                                onClick={() => handleInsightClick(insight)}
                                                            >
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${insight.status === 'critical' ? 'bg-red-100 text-red-700' :
                                                                            insight.status === 'high' ? 'bg-amber-100 text-amber-700' :
                                                                                insight.status === 'medium' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                                            }`}>
                                                                            {insight.category}
                                                                        </span>
                                                                        <span className="text-sm font-bold text-[#1c519c]">{insight.metric}</span>
                                                                    </div>
                                                                    <span className={`text-xs font-bold ${insight.change > 0 ? 'text-green-600' : insight.change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                                                        {insight.change > 0 ? '+' : ''}{insight.change}%
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 line-clamp-1">{insight.insight}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-4 rounded-lg border border-dashed border-gray-200 bg-gray-50/80 text-xs text-gray-500 leading-relaxed">
                                                            No AI insights tagged for this lane in the current seed. The chart still reflects the latest merged financial series (10-Q / internal bridge where populated).
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}

                    {activeView === 'decisions' && (
                        <motion.div
                            key="decisions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Decision Summary Bar */}
                            {(() => {
                                const total = keyDecisions.length;
                                const critical = keyDecisions.filter(d => d.urgency === 'critical').length;
                                const high = keyDecisions.filter(d => d.urgency === 'high').length;
                                const medium = total - critical - high;
                                const pending = keyDecisions.filter(d => d.status === 'pending').length;
                                const avgDays = total > 0 ? Math.round(keyDecisions.reduce((sum, d) => sum + Math.max(0, Math.ceil((new Date(d.dueDate).getTime() - Date.now()) / 86_400_000)), 0) / total) : 0;
                                return (
                                    <div className="bg-white rounded-xl shadow-sm p-4 mb-2 flex items-center justify-between">
                                        <div className="flex items-center space-x-6">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-[#1c519c]">{total}</span>
                                                <span className="text-sm text-gray-500">decisions</span>
                                            </div>
                                            <div className="h-8 w-px bg-gray-200" />
                                            <div className="flex items-center space-x-2">
                                                {critical > 0 && <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">{critical} critical</span>}
                                                {high > 0 && <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">{high} high</span>}
                                                {medium > 0 && <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{medium} medium</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-[#1c519c]">{pending}</p>
                                                <p className="text-xs text-gray-500">pending</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-emerald-600">{total - pending}</p>
                                                <p className="text-xs text-gray-500">approved</p>
                                            </div>
                                            <div className="h-8 w-px bg-gray-200" />
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-[#1c519c]">{avgDays}</p>
                                                <p className="text-xs text-gray-500">avg days left</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Group decisions by business outcome */}
                            {['Commercial', 'Operational', 'Financial', 'Risk'].map((outcome) => {
                                const outcomeDecisions = keyDecisions.filter(d => d.businessOutcome === outcome);
                                if (outcomeDecisions.length === 0) return null;

                                return (
                                    <div key={outcome} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                        <div className={`p-4 border-b ${outcome === 'Commercial' ? 'bg-emerald-50 border-emerald-200' :
                                            outcome === 'Operational' ? 'bg-[#F0F0F0] border-emerald-200' :
                                                outcome === 'Financial' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                            }`}>
                                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                                {outcome === 'Commercial' && <TrendingUp className="w-5 h-5 mr-2 text-[#1c519c]" />}
                                                {outcome === 'Operational' && <Activity className="w-5 h-5 mr-2 text-emerald-600" />}
                                                {outcome === 'Financial' && <DollarSign className="w-5 h-5 mr-2 text-green-600" />}
                                                {outcome === 'Risk' && <Shield className="w-5 h-5 mr-2 text-red-600" />}
                                                {outcome} Decisions
                                            </h2>
                                        </div>
                                        <div className="divide-y divide-gray-200">
                                            {outcomeDecisions.map((decision) => (
                                                <div key={decision.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <h3 className="text-base font-medium text-[#1c519c]">{decision.title}</h3>
                                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${decision.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                                                                    decision.urgency === 'high' ? 'bg-amber-100 text-amber-700' :
                                                                        'bg-blue-100 text-blue-700'
                                                                    }`}>
                                                                    {decision.urgency}
                                                                </span>
                                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${decision.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                                                                    'bg-emerald-100 text-emerald-700'
                                                                    }`}>
                                                                    {decision.status}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                                <div>
                                                                    <p className="text-sm text-gray-600 mb-1">{decision.impact}</p>
                                                                    <p className="text-sm font-medium text-green-600">{decision.financialImpact}</p>
                                                                </div>
                                                                <div className="text-sm">
                                                                    <span className="text-gray-600">Risk: </span>
                                                                    <span className={`font-medium ${decision.riskAssessment.includes('Critical') ? 'text-red-600' :
                                                                        decision.riskAssessment.includes('High') ? 'text-amber-600' :
                                                                            decision.riskAssessment.includes('Medium') ? 'text-yellow-600' : 'text-green-600'
                                                                        }`}>{decision.riskAssessment}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center space-x-6 text-xs text-gray-500 mb-3">
                                                                <span className="flex items-center">
                                                                    <Calendar className="w-3 h-3 mr-1" />
                                                                    Due: {decision.dueDate}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Users className="w-3 h-3 mr-1" />
                                                                    Owner: {decision.owner}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Users className="w-3 h-3 mr-1" />
                                                                    {decision.stakeholders.length} stakeholders
                                                                </span>
                                                            </div>

                                                            {decision.dependencies && (
                                                                <div className="text-xs bg-gray-50 rounded p-2">
                                                                    <span className="font-medium text-gray-700">Dependencies: </span>
                                                                    <span className="text-gray-600">{decision.dependencies.join(', ')}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4 text-right">
                                                            <button className="px-4 py-2 bg-[#F0F0F0] text-[#1c519c] text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all border border-emerald-400">
                                                                Review Decision
                                                            </button>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {Math.max(0, Math.ceil((new Date(decision.dueDate).getTime() - Date.now()) / 86_400_000))} days left
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}

                    {activeView === 'risks' && (
                        <motion.div
                            key="risks"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Risk Heat Map */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                                    <Target className="w-4 h-4 mr-2 text-[#1c519c]" />
                                    Risk &amp; Opportunity Heat Map
                                </h2>
                                <div className="flex items-start space-x-8">
                                    {/* Heat map grid */}
                                    <div className="flex-1">
                                        <div className="flex">
                                            {/* Y axis label */}
                                            <div className="flex flex-col justify-between pr-2 py-1" style={{ width: 56 }}>
                                                <span className="text-[10px] text-gray-400 text-right">High</span>
                                                <span className="text-[10px] text-gray-400 text-right">Med</span>
                                                <span className="text-[10px] text-gray-400 text-right">Low</span>
                                            </div>
                                            {/* Grid */}
                                            <div className="flex-1">
                                                <div className="grid grid-cols-3 gap-px bg-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '3/3', maxHeight: 140 }}>
                                                    {/* Row 1: High probability */}
                                                    <div className="bg-amber-50 relative flex items-center justify-center p-1">
                                                        {/* High prob / Low impact */}
                                                        {risksOpportunities.risks.filter(r => r.probability === 'High' && r.impact.includes('Low')).map((r, i) => (
                                                            <div key={`r-hl-${i}`} className="w-3 h-3 rounded-full bg-amber-500 border border-white" title={r.title} />
                                                        ))}
                                                        {risksOpportunities.opportunities.filter(o => (o.probability === 'High' || o.probability === 'Very High') && o.impact.includes('Low')).map((o, i) => (
                                                            <div key={`o-hl-${i}`} className="w-3 h-3 rounded-full bg-emerald-500 border border-white" title={o.title} />
                                                        ))}
                                                    </div>
                                                    <div className="bg-orange-50 relative flex flex-wrap items-center justify-center gap-0.5 p-1">
                                                        {/* High prob / Med impact */}
                                                        {risksOpportunities.risks.filter(r => r.probability === 'High' && (r.impact.includes('Medium') || r.impact.includes('Moderate'))).map((r, i) => (
                                                            <div key={`r-hm-${i}`} className="w-3 h-3 rounded-full bg-orange-500 border border-white" title={r.title} />
                                                        ))}
                                                        {risksOpportunities.opportunities.filter(o => (o.probability === 'High' || o.probability === 'Very High') && (o.impact.includes('Medium') || o.impact.includes('Moderate'))).map((o, i) => (
                                                            <div key={`o-hm-${i}`} className="w-3 h-3 rounded-full bg-emerald-500 border border-white" title={o.title} />
                                                        ))}
                                                    </div>
                                                    <div className="bg-red-50 relative flex flex-wrap items-center justify-center gap-0.5 p-1">
                                                        {/* High prob / High impact */}
                                                        {risksOpportunities.risks.filter(r => r.probability === 'High' && (r.impact.includes('High') || r.impact.includes('Severe') || r.impact.includes('Major') || r.impact.includes('$'))).map((r, i) => (
                                                            <div key={`r-hh-${i}`} className="w-3 h-3 rounded-full bg-red-500 border border-white" title={r.title} />
                                                        ))}
                                                        {risksOpportunities.opportunities.filter(o => (o.probability === 'High' || o.probability === 'Very High') && (o.impact.includes('High') || o.impact.includes('$') || o.impact.includes('Major'))).map((o, i) => (
                                                            <div key={`o-hh-${i}`} className="w-3 h-3 rounded-full bg-emerald-500 border border-white" title={o.title} />
                                                        ))}
                                                    </div>
                                                    {/* Row 2: Medium probability */}
                                                    <div className="bg-green-50 relative flex items-center justify-center p-1">
                                                        {risksOpportunities.risks.filter(r => r.probability === 'Medium' && r.impact.includes('Low')).map((r, i) => (
                                                            <div key={`r-ml-${i}`} className="w-3 h-3 rounded-full bg-amber-500 border border-white" title={r.title} />
                                                        ))}
                                                        {risksOpportunities.opportunities.filter(o => o.probability === 'Medium' && o.impact.includes('Low')).map((o, i) => (
                                                            <div key={`o-ml-${i}`} className="w-3 h-3 rounded-full bg-emerald-500 border border-white" title={o.title} />
                                                        ))}
                                                    </div>
                                                    <div className="bg-amber-50 relative flex flex-wrap items-center justify-center gap-0.5 p-1">
                                                        {risksOpportunities.risks.filter(r => r.probability === 'Medium' && (r.impact.includes('Medium') || r.impact.includes('Moderate'))).map((r, i) => (
                                                            <div key={`r-mm-${i}`} className="w-3 h-3 rounded-full bg-amber-500 border border-white" title={r.title} />
                                                        ))}
                                                        {risksOpportunities.opportunities.filter(o => o.probability === 'Medium' && (o.impact.includes('Medium') || o.impact.includes('Moderate'))).map((o, i) => (
                                                            <div key={`o-mm-${i}`} className="w-3 h-3 rounded-full bg-emerald-500 border border-white" title={o.title} />
                                                        ))}
                                                    </div>
                                                    <div className="bg-orange-50 relative flex flex-wrap items-center justify-center gap-0.5 p-1">
                                                        {risksOpportunities.risks.filter(r => r.probability === 'Medium' && (r.impact.includes('High') || r.impact.includes('Severe') || r.impact.includes('Major') || r.impact.includes('$'))).map((r, i) => (
                                                            <div key={`r-mh-${i}`} className="w-3 h-3 rounded-full bg-orange-500 border border-white" title={r.title} />
                                                        ))}
                                                        {risksOpportunities.opportunities.filter(o => o.probability === 'Medium' && (o.impact.includes('High') || o.impact.includes('$') || o.impact.includes('Major'))).map((o, i) => (
                                                            <div key={`o-mh-${i}`} className="w-3 h-3 rounded-full bg-emerald-500 border border-white" title={o.title} />
                                                        ))}
                                                    </div>
                                                    {/* Row 3: Low probability */}
                                                    <div className="bg-green-50 relative flex items-center justify-center p-1">
                                                        {risksOpportunities.risks.filter(r => r.probability === 'Low' && r.impact.includes('Low')).map((r, i) => (
                                                            <div key={`r-ll-${i}`} className="w-3 h-3 rounded-full bg-green-400 border border-white" title={r.title} />
                                                        ))}
                                                    </div>
                                                    <div className="bg-green-50 relative flex items-center justify-center p-1">
                                                        {risksOpportunities.risks.filter(r => r.probability === 'Low' && (r.impact.includes('Medium') || r.impact.includes('Moderate'))).map((r, i) => (
                                                            <div key={`r-lm-${i}`} className="w-3 h-3 rounded-full bg-green-400 border border-white" title={r.title} />
                                                        ))}
                                                    </div>
                                                    <div className="bg-amber-50 relative flex items-center justify-center p-1">
                                                        {risksOpportunities.risks.filter(r => r.probability === 'Low' && (r.impact.includes('High') || r.impact.includes('Severe') || r.impact.includes('Major') || r.impact.includes('$'))).map((r, i) => (
                                                            <div key={`r-lh-${i}`} className="w-3 h-3 rounded-full bg-amber-500 border border-white" title={r.title} />
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* X axis labels */}
                                                <div className="grid grid-cols-3 mt-1">
                                                    <span className="text-[10px] text-gray-400 text-center">Low</span>
                                                    <span className="text-[10px] text-gray-400 text-center">Medium</span>
                                                    <span className="text-[10px] text-gray-400 text-center">High</span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 text-center mt-0.5">IMPACT →</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-0.5 ml-14">↑ PROBABILITY</p>
                                    </div>
                                    {/* Legend + summary */}
                                    <div className="w-48 space-y-3">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                                <span className="text-xs text-gray-600">Critical risk</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                                <span className="text-xs text-gray-600">Elevated risk</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                                <span className="text-xs text-gray-600">Moderate risk</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                <span className="text-xs text-gray-600">Opportunity</span>
                                            </div>
                                        </div>
                                        <div className="border-t pt-2 space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Risks tracked</span>
                                                <span className="font-semibold text-red-600">{risksOpportunities.risks.length}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Opportunities</span>
                                                <span className="font-semibold text-emerald-600">{risksOpportunities.opportunities.length}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Increasing trend</span>
                                                <span className="font-semibold text-amber-600">{risksOpportunities.risks.filter(r => r.trend === 'increasing').length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Risks & Opportunities Lists */}
                            <div className="grid grid-cols-2 gap-6">
                            {/* Risks */}
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                                        Top Risks
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {risksOpportunities.risks.map((risk, idx) => (
                                        <div key={idx} className="p-6">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-base font-medium text-gray-900">{risk.title}</h3>
                                                <div className="flex items-center">
                                                    {risk.trend === 'increasing' && <TrendingUp className="w-4 h-4 text-red-500" />}
                                                    {risk.trend === 'stable' && <Activity className="w-4 h-4 text-gray-500" />}
                                                    {risk.trend === 'decreasing' && <TrendingDown className="w-4 h-4 text-green-500" />}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <span className="text-xs text-gray-500">Probability</span>
                                                    <p className={`text-sm font-medium ${risk.probability === 'High' ? 'text-red-600' :
                                                        risk.probability === 'Medium' ? 'text-amber-600' : 'text-green-600'
                                                        }`}>{risk.probability}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500">Impact</span>
                                                    <p className="text-sm font-medium text-gray-900">{risk.impact}</p>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <span className="text-xs font-medium text-gray-700">Mitigation:</span>
                                                <p className="text-xs text-gray-600 mt-1">{risk.mitigation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Opportunities */}
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Zap className="w-5 h-5 mr-2 text-green-600" />
                                        Top Opportunities
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {risksOpportunities.opportunities.map((opp, idx) => (
                                        <div key={idx} className="p-6">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-base font-medium text-gray-900">{opp.title}</h3>
                                                <div className="flex items-center">
                                                    {opp.trend === 'increasing' && <TrendingUp className="w-4 h-4 text-green-500" />}
                                                    {opp.trend === 'stable' && <Activity className="w-4 h-4 text-gray-500" />}
                                                    {opp.trend === 'decreasing' && <TrendingDown className="w-4 h-4 text-red-500" />}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <span className="text-xs text-gray-500">Probability</span>
                                                    <p className={`text-sm font-medium ${opp.probability === 'Very High' || opp.probability === 'High' ? 'text-green-600' :
                                                        opp.probability === 'Medium' ? 'text-amber-600' : 'text-red-600'
                                                        }`}>{opp.probability}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500">Potential</span>
                                                    <p className="text-sm font-medium text-gray-900">{opp.impact}</p>
                                                </div>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-3">
                                                <span className="text-xs font-medium text-green-700">Action:</span>
                                                <p className="text-xs text-green-600 mt-1">{opp.action}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Enhanced Modal for Insight Details */}
            <AnimatePresence>
                {showModal && selectedInsight && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-gray-50 to-white border-b px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedInsight.title}</h2>
                                        <p className="text-sm text-gray-500">{selectedInsight.category} Analysis</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                            onClick={() => {/* Full screen logic */ }}
                                        >
                                            <Maximize2 className="w-5 h-5 text-gray-500" />
                                        </button>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
                                {/* Performance Overview */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-1">Current</p>
                                        <p className="text-3xl font-bold text-gray-900">{selectedInsight.metric}</p>
                                        <p className={`text-sm font-medium mt-2 ${selectedInsight.change > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {selectedInsight.change > 0 ? '+' : ''}{selectedInsight.change}% MTD
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-1">Forecast</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {(() => {
                                                const allKpis = [...kpis.primaryKPIs, ...kpis.operationalKPIs, ...kpis.digitalKPIs, ...kpis.financialKPIs];
                                                const matchedKpi = allKpis.find(k => k.label === selectedInsight.category || k.description === selectedInsight.category);
                                                return matchedKpi?.target ?? matchedKpi?.trendValue ?? 'Improving';
                                            })()}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">End of quarter</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-1">vs Target</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {(() => {
                                                const allKpis = [...kpis.primaryKPIs, ...kpis.operationalKPIs, ...kpis.digitalKPIs, ...kpis.financialKPIs];
                                                const matchedKpi = allKpis.find(k => k.label === selectedInsight.category || k.description === selectedInsight.category);
                                                if (matchedKpi?.trendValue) return matchedKpi.trendValue;
                                                return 'N/A';
                                            })()}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">Performance gap</p>
                                    </div>
                                </div>

                                {/* Key Drivers */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Performance Drivers</h3>
                                    <div className="space-y-2">
                                        {selectedInsight.drivers.map((driver: string, idx: number) => (
                                            <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#003087]' : idx === 1 ? 'bg-amber-500' : 'bg-emerald-400'
                                                    }`} />
                                                <span className="text-sm font-medium text-gray-700">{driver}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Related Metrics */}
                                {selectedInsight.relatedMetrics && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Metrics</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {Object.entries(selectedInsight.relatedMetrics).map(([key, value]) => (
                                                <div key={key} className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                    <p className="text-sm font-bold text-gray-900 mt-1">{String(value)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Detailed Chart */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Trend Analysis</h3>
                                    <div className="h-64 bg-gray-50 rounded-lg p-4">
                                        {(() => {
                                            const qData = financials.quarters.map(q => ({
                                                q: q.quarter.replace('FY25', '').trim(),
                                                revenue: q.revenue,
                                                margin: q.operatingMargin,
                                                comp: q.feeRevenueGrowth,
                                                eps: q.eps,
                                            }));
                                            const outcome = selectedInsight.businessOutcome;
                                            if (outcome === 'Commercial') {
                                                return (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <ComposedChart data={qData}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                            <XAxis dataKey="q" tick={lightAxis} />
                                                            <YAxis yAxisId="left" tick={lightAxis} domain={[8, 10]} unit="B" />
                                                            <YAxis yAxisId="right" orientation="right" tick={lightAxis} unit="%" />
                                                            <Tooltip {...lightTooltip} />
                                                            <Bar yAxisId="left" dataKey="revenue" fill={CK.green} radius={[4,4,0,0]} name="Revenue ($B)" />
                                                            <Line yAxisId="right" dataKey="comp" stroke={CK.amber} strokeWidth={2} dot={{ r: 4 }} name="Organic Growth %" />
                                                        </ComposedChart>
                                                    </ResponsiveContainer>
                                                );
                                            }
                                            if (outcome === 'Operational') {
                                                return (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <ComposedChart data={qData}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                            <XAxis dataKey="q" tick={lightAxis} />
                                                            <YAxis yAxisId="left" tick={lightAxis} unit="%" />
                                                            <YAxis yAxisId="right" orientation="right" tick={lightAxis} />
                                                            <Tooltip {...lightTooltip} />
                                                            <Bar yAxisId="left" dataKey="comp" name="Organic Growth %">
                                                                {qData.map((d, i) => <Cell key={i} fill={d.comp >= 0 ? CK.emerald : CK.red} />)}
                                                            </Bar>
                                                            <Line yAxisId="right" dataKey="eps" stroke={CK.blue} strokeWidth={2} dot={{ r: 4 }} name="EPS ($)" />
                                                        </ComposedChart>
                                                    </ResponsiveContainer>
                                                );
                                            }
                                            if (outcome === 'Financial') {
                                                return (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <FinancialPerformanceChart data={buildRevenueTrend(overviewFin)} />
                                                    </ResponsiveContainer>
                                                );
                                            }
                                            const liqModal = buildLiquidityVsTargetScores(overviewFin);
                                            const marginModal = buildMarginTrend(overviewFin);
                                            return (
                                                <div className="flex flex-col h-full w-full gap-1">
                                                    <div className="h-[52%] min-h-[100px] w-full">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <BarChart data={liqModal} layout="vertical" margin={{ top: 4, right: 20, bottom: 4, left: 4 }}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                                                                <XAxis type="number" tick={lightAxis} />
                                                                <YAxis type="category" dataKey="label" tick={lightAxis} width={88} />
                                                                <Tooltip {...lightTooltip} />
                                                                <ReferenceLine x={0} stroke="#e5e7eb" />
                                                                <Bar dataKey="scorePct" name="Vs target" radius={[0, 4, 4, 0]} barSize={12}>
                                                                    {liqModal.map((row, i) => (
                                                                        <Cell key={i} fill={row.scorePct >= 0 ? CK.green : CK.red} />
                                                                    ))}
                                                                </Bar>
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide shrink-0">Operating margin (GAAP %)</p>
                                                    <div className="flex-1 min-h-[88px] w-full">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <AreaChart data={marginModal} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
                                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                                                <XAxis dataKey="q" tick={lightAxis} />
                                                                <YAxis tick={lightAxis} domain={['auto', 'auto']} />
                                                                <Tooltip {...lightTooltip} formatter={(v: number) => [`${v}%`, 'Op margin']} />
                                                                <Area type="monotone" dataKey="margin" stroke={CK.green} fill={CK.green} fillOpacity={0.12} name="Op margin %" />
                                                            </AreaChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Recommended Actions */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Actions</h3>
                                    <div className="space-y-3">
                                        {selectedInsight.actions.map((action: string, idx: number) => (
                                            <div key={idx} className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                                <div className="flex-shrink-0 w-8 h-8 bg-[#003087] text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{action}</p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Priority: {idx === 0 ? 'Immediate' : idx === 1 ? 'High' : 'Medium'}
                                                    </p>
                                                </div>
                                                <button className="text-sm font-medium text-[#1c519c] hover:text-[#1c519c]">
                                                    Assign →
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        Export Analysis
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        Schedule Review
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        router.push('/business-consoles');
                                    }}
                                    className="px-6 py-2 text-sm font-medium text-white bg-[#003087] rounded-lg hover:bg-[#004A80] transition-colors flex items-center space-x-2"
                                >
                                    <span>Deep Dive Analysis</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    );
}
