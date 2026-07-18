'use client';

import { motion } from 'framer-motion';
import {
    ArrowDown,
    ArrowUp,
    Building2,
    Globe,
    MapPin,
    Minus,
    Shield,
    Swords,
    Target,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    Cell,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    PieChart,
    Pie,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { MarketConfig, CompetitorData } from '@/config/types';

// ── Color palette ─────────────────────────────────────────────────────
const BRAND = {
    'BD': '#003087',
    navy: '#002060',
    red: '#CC0000',
    softBlue: '#E8EDF8',
};

const COMPETITOR_COLORS: Record<string, string> = {
    'BD': '#003087',
    // UnitedHealth Group
    'UnitedHealth Group': '#E3872D',
    // Humana
    'Humana': '#0066B2',
    // Elevance Health
    'Elevance Health': '#009999',
    // Cigna
    'Cigna': '#6366F1',
    // Walgreens
    'Walgreens Boots Alliance': '#A855F7',
    Others: '#9CA3AF',
};

function getCompetitorColor(name: string): string {
    return COMPETITOR_COLORS[name] || '#6B7280';
}

// ── Animation presets ─────────────────────────────────────────────────
const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const stagger = {
    animate: { transition: { staggerChildren: 0.08 } },
};

// ── Types ─────────────────────────────────────────────────────────────
interface CompetitorMetric {
    id: number;
    companyId: number;
    periodId: number;
    competitorName: string;
    metricName: string;
    value: number;
    unit: string;
    yoyChange: number | null;
    period: { id: number; label: string; quarter: number | null; year: number; type: string; companyId: number; startDate: string; endDate: string };
}

interface Props {
    market: MarketConfig;
    competitorMetrics: CompetitorMetric[];
}

// ── Custom tooltip ────────────────────────────────────────────────────
const tooltipStyle = {
    contentStyle: {
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        fontSize: 12,
        color: '#003B2C',
        padding: '8px 12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
};

// ── Helpers ───────────────────────────────────────────────────────────
function parsePeriodSort(label: string): number {
    // "Q1 FY25" => 2025 * 10 + 1
    const match = label.match(/Q(\d)\s*FY(\d+)/);
    if (!match) return 0;
    return parseInt(match[2]) * 10 + parseInt(match[1]);
}

function formatDollar(v: number, unit: string): string {
    if (unit === '$B') return `$${v.toFixed(1)}B`;
    if (unit === '$') return `$${v.toFixed(2)}`;
    return v.toLocaleString();
}

function formatPercent(v: number | null): string {
    if (v === null || v === undefined) return 'N/A';
    const sign = v > 0 ? '+' : '';
    return `${sign}${v.toFixed(1)}%`;
}

export default function CompetitiveIntelClient({ market, competitorMetrics }: Props) {
    // ── Derived data ──────────────────────────────────────────────────

    // Market share pie data
    const marketSharePie = useMemo(() => {
        const bkrShare = market.companyMarketShare;
        const competitorShares = market.competitors.map(c => ({
            name: c.name,
            value: c.marketShare,
        }));
        const othersShare = Math.max(
            0,
            100 - bkrShare - competitorShares.reduce((s, c) => s + c.value, 0)
        );
        return [
            { name: 'BD', value: bkrShare },
            ...competitorShares,
            { name: 'Others', value: parseFloat(othersShare.toFixed(1)) },
        ];
    }, [market]);

    // YoY share change bar chart
    const shareChangeBars = useMemo(() => {
        return [
            { name: 'BD', change: market.marketShareYoY },
            ...market.competitors.map(c => ({
                name: c.name,
                change: c.yoyChange,
            })),
        ];
    }, [market]);

    // Revenue growth trend (by quarter)
    const compSalesTrend = useMemo(() => {
        const compMetrics = competitorMetrics.filter(m => m.metricName === 'Revenue Growth (%)');
        const periodSet = new Map<string, Record<string, number>>();

        compMetrics.forEach(m => {
            const key = m.period.label;
            if (!periodSet.has(key)) periodSet.set(key, {});
            const row = periodSet.get(key)!;
            row[m.competitorName] = m.value;
        });

        return Array.from(periodSet.entries())
            .map(([label, values]) => ({ period: label, ...values }))
            .sort((a, b) => parsePeriodSort(a.period) - parsePeriodSort(b.period));
    }, [competitorMetrics]);

    const compSalesCompetitors = useMemo(() => {
        const names = new Set<string>();
        competitorMetrics.filter(m => m.metricName === 'Revenue Growth (%)').forEach(m => names.add(m.competitorName));
        return Array.from(names);
    }, [competitorMetrics]);

    // Postpaid subscriber growth (grouped bar)
    const storeCountData = useMemo(() => {
        const storeMetrics = competitorMetrics.filter(m => m.metricName === 'Postpaid Subscribers (M)');
        const periodSet = new Map<string, Record<string, number>>();

        storeMetrics.forEach(m => {
            const key = m.period.label;
            if (!periodSet.has(key)) periodSet.set(key, {});
            periodSet.get(key)![m.competitorName] = m.value;
        });

        return Array.from(periodSet.entries())
            .map(([label, values]) => ({ period: label, ...values }))
            .sort((a, b) => parsePeriodSort(a.period) - parsePeriodSort(b.period));
    }, [competitorMetrics]);

    const storeCountCompetitors = useMemo(() => {
        const names = new Set<string>();
        competitorMetrics.filter(m => m.metricName === 'Postpaid Subscribers (M)').forEach(m => names.add(m.competitorName));
        return Array.from(names);
    }, [competitorMetrics]);

    // Revenue benchmarking table — Revenue from DB, Market Share + YoY from config
    const revBenchmark = useMemo(() => {
        const latestPeriod = competitorMetrics.reduce((best, m) => {
            const s = parsePeriodSort(m.period.label);
            return s > best ? s : best;
        }, 0);
        const latest = competitorMetrics.filter(
            m => parsePeriodSort(m.period.label) === latestPeriod
        );
        const byCompetitor = new Map<string, Record<string, { value: number; unit: string }>>();
        latest.forEach(m => {
            if (!byCompetitor.has(m.competitorName)) byCompetitor.set(m.competitorName, {});
            byCompetitor.get(m.competitorName)![m.metricName] = { value: m.value, unit: m.unit };
        });

        // Build a lookup from config competitors (market share + yoy always present)
        const configByName = new Map(market.competitors.map(c => [c.name, c]));

        return Array.from(byCompetitor.entries()).map(([name, metrics]) => {
            const cfg = configByName.get(name);
            return {
                name,
                revenue: metrics['Revenue ($B)']?.value ?? metrics['Revenue']?.value ?? null,
                revenueUnit: metrics['Revenue ($B)']?.unit ?? '$B',
                marketShare: cfg?.marketShare ?? metrics['Market Share (%)']?.value ?? null,
                yoyChange: cfg?.yoyChange ?? null,
            };
        });
    }, [competitorMetrics, market.competitors]);

    // Regional competitive data from competitorMetrics (grouping by competitor)
    const regionalSpotlight = useMemo(() => {
        const apacCompetitors = ['T-Mobile (TMUS)'];
        const usCompetitors = ['AT&T (T)', 'Charter (CHTR)'];

        function getRegionData(names: string[]): Array<Record<string, unknown> & { name: string }> {
            return names.map(name => {
                const metrics = competitorMetrics.filter(m => m.competitorName === name);
                const latestSort = metrics.reduce((best, m) => {
                    const s = parsePeriodSort(m.period.label);
                    return s > best ? s : best;
                }, 0);
                const latest = metrics.filter(m => parsePeriodSort(m.period.label) === latestSort);
                const metricMap: Record<string, number> = {};
                latest.forEach(m => { metricMap[m.metricName] = m.value; });
                return { name, ...metricMap } as Record<string, unknown> & { name: string };
            });
        }

        return {
            apac: getRegionData(apacCompetitors),
            us: getRegionData(usCompetitors),
        };
    }, [competitorMetrics]);

    // Strengths/weaknesses from Competitor model
    const strengthsTable = useMemo(() => {
        return market.competitors.map(c => ({
            name: c.name,
            strengths: c.strengths || [],
        }));
    }, [market]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <motion.div className="max-w-7xl mx-auto space-y-6" {...stagger} animate="animate" initial="initial">
                {/* ── Page Header ────────────────────────────────────────── */}
                <motion.div {...fadeUp} className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <div className="p-2 bg-[#003B2C]/10 rounded-lg">
                                <Swords className="w-6 h-6 text-[#003B2C]" />
                            </div>
                            <h1 className="text-2xl font-bold text-[#003B2C]">Competitive Intelligence</h1>
                        </div>
                        <p className="text-sm text-gray-500 ml-12">US wireless industry competitive landscape and market share benchmarking</p>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 text-xs text-gray-400">
                        <span>Updated Q1 FY26</span>
                    </div>
                </motion.div>

                {/* ── 1. Market Overview Header ──────────────────────────── */}
                <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        {
                            label: 'Total Addressable Market',
                            value: market.totalMarketSize || '$340B',
                            sub: `${market.segmentGrowth > 0 ? '+' : ''}${market.segmentGrowth}% CAGR`,
                            icon: Globe,
                            color: 'text-[#003B2C]',
                            bg: 'bg-[#003B2C]/5',
                        },
                        {
                            label: 'BD Market Position',
                            value: `${market.companyMarketShare}%`,
                            sub: `Target: ${market.marketShareTarget}%`,
                            icon: Target,
                            color: 'text-[#003087]',
                            bg: 'bg-[#003087]/5',
                        },
                        {
                            label: 'Share YoY Change',
                            value: formatPercent(market.marketShareYoY),
                            sub: market.marketShareYoY >= 0 ? 'Gaining share' : 'Losing share',
                            icon: market.marketShareYoY >= 0 ? TrendingUp : ArrowDown,
                            color: market.marketShareYoY >= 0 ? 'text-emerald-600' : 'text-red-500',
                            bg: market.marketShareYoY >= 0 ? 'bg-emerald-50' : 'bg-red-50',
                        },
                        {
                            label: 'Competitors Tracked',
                            value: market.competitors.length.toString(),
                            sub: 'Major US wireless peers',
                            icon: Users,
                            color: 'text-blue-600',
                            bg: 'bg-blue-50',
                        },
                    ].map((card, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</span>
                                <div className={`p-1.5 rounded-lg ${card.bg}`}>
                                    <card.icon className={`w-4 h-4 ${card.color}`} />
                                </div>
                            </div>
                            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                        </div>
                    ))}
                </motion.div>

                {/* ── 2. Market Share Comparison ─────────────────────────── */}
                <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-[#003B2C] mb-4">Market Share Distribution</h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={marketSharePie}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={120}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}%`}
                                    labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                                >
                                    {marketSharePie.map((entry, idx) => (
                                        <Cell key={idx} fill={getCompetitorColor(entry.name)} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    {...tooltipStyle}
                                    formatter={(value: number) => [`${value}%`, 'Share']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* YoY Share Change Bar Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-[#003B2C] mb-4">YoY Market Share Change (bps)</h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={shareChangeBars} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: '#6B7280' }} />
                                <Tooltip
                                    {...tooltipStyle}
                                    formatter={(value: number) => [`${value > 0 ? '+' : ''}${value} bps`, 'Change']}
                                />
                                <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                                    {shareChangeBars.map((entry, idx) => (
                                        <Cell
                                            key={idx}
                                            fill={entry.change >= 0 ? '#10B981' : '#EF4444'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* ── 3. Revenue Growth Comparison ─────────────────────── */}
                {compSalesTrend.length > 0 && (
                    <motion.div {...fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-[#003B2C] mb-4">Revenue Growth Trend (%)</h2>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={compSalesTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#6B7280' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={v => `${v}%`} />
                                <Tooltip
                                    {...tooltipStyle}
                                    formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                {compSalesCompetitors.map(name => (
                                    <Line
                                        key={name}
                                        type="monotone"
                                        dataKey={name}
                                        stroke={getCompetitorColor(name)}
                                        strokeWidth={name === 'BD' ? 3 : 2}
                                        dot={{ r: name === 'BD' ? 5 : 3 }}
                                        activeDot={{ r: 6 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {/* ── 4. Postpaid Subscriber Growth ──────────────────────── */}
                {storeCountData.length > 0 && (
                    <motion.div {...fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-[#003B2C] mb-4">Postpaid Subscribers by Quarter (M)</h2>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={storeCountData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#6B7280' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                                <Tooltip
                                    {...tooltipStyle}
                                    formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                {storeCountCompetitors.map(name => (
                                    <Bar key={name} dataKey={name} fill={getCompetitorColor(name)} radius={[4, 4, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {/* ── 5. Competitor Benchmarking ──────────────────────────── */}
                {revBenchmark.length > 0 && (
                    <motion.div {...fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-[#003B2C]">Competitor Benchmarking (Latest Quarter)</h2>
                            <span className="text-xs text-gray-400">Revenue from DB · Market share from public filings</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Operator</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quarterly Revenue</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">US Market Share</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Share YoY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {revBenchmark.map((row) => (
                                        <tr key={row.name} className="border-b border-gray-100">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCompetitorColor(row.name) }} />
                                                    <span className="font-medium text-gray-900">{row.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-right py-3 px-4 text-gray-700">
                                                {row.revenue !== null ? formatDollar(row.revenue, row.revenueUnit) : '--'}
                                            </td>
                                            <td className="text-right py-3 px-4 text-gray-700">
                                                {row.marketShare !== null ? `${row.marketShare.toFixed(1)}%` : '--'}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {row.yoyChange !== null ? (
                                                    <span className={row.yoyChange >= 0 ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
                                                        {row.yoyChange > 0 ? '+' : ''}{row.yoyChange.toFixed(1)} bps
                                                    </span>
                                                ) : '--'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* ── 6. Competitive Spotlight — static cited data ── */}
                <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Caremark PBM Biosimilar Advantage */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center space-x-2 mb-1">
                            <MapPin className="w-5 h-5 text-[#003087]" />
                            <h2 className="text-lg font-semibold text-gray-800">Caremark PBM Biosimilar Program</h2>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">CVS Caremark vs. peers — Stelara biosimilar adoption rate · Q1 FY 2026</p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {[
                                { label: 'CVS Caremark', sub: 'Stelara biosimilar substitution rate', value: '~65%', note: 'Leading PBM biosimilar adoption nationally', color: '#003087', bg: '#EFF6FF' },
                                { label: 'Industry Average', sub: 'Biosimilar substitution rate', value: '~45%', note: 'U.S. PBM industry average biosimilar fill rate', color: '#E3872D', bg: '#FFF7ED' },
                            ].map(c => (
                                <div key={c.label} className="rounded-lg p-4 text-center" style={{ backgroundColor: c.bg }}>
                                    <p className="text-xs font-semibold text-gray-500 mb-1">{c.label}</p>
                                    <p className="text-xl font-bold mb-0.5" style={{ color: c.color }}>{c.value}</p>
                                    <p className="text-[10px] text-gray-400">{c.sub}</p>
                                    <p className="text-[10px] font-medium mt-1" style={{ color: c.color }}>{c.note}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 border-t border-gray-100 pt-3">
                            {[
                                { label: 'Stelara biosimilar annualized savings (full adoption)', value: '$450M+', note: 'Caremark formulary — plan sponsor benefit' },
                                { label: 'GLP-1 scripts Q1 FY26 growth vs. plan', value: '+12ppt', note: '34% actual vs. 22% plan — margin pressure' },
                                { label: 'Each 100K additional GLP-1 scripts/month', value: '+$280M', note: 'Annualized specialty spend at current WAC' },
                            ].map(r => (
                                <div key={r.label} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{r.label}</span>
                                    <div className="text-right">
                                        <span className="font-semibold text-[#003087]">{r.value}</span>
                                        <span className="text-gray-400 text-xs ml-2">{r.note}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MA Medical Benefit Ratio Comparison */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center space-x-2 mb-1">
                            <MapPin className="w-5 h-5 text-[#003087]" />
                            <h2 className="text-lg font-semibold text-gray-800">Medicare Advantage MBR Benchmark</h2>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">CVS Aetna vs. MA peers — Medical Benefit Ratio · Q1 FY 2026</p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {[
                                { label: 'CVS Aetna', value: '84.6%', share: 'Q1 FY26 MBR', color: '#003087', bg: '#EFF6FF' },
                                { label: 'UHG (UHC)', value: '~83.5%', share: 'Optum integration lift', color: '#E3872D', bg: '#FFF7ED' },
                                { label: 'Humana', value: '~89%+', share: 'Exiting select markets', color: '#6366F1', bg: '#F5F3FF' },
                            ].map(c => (
                                <div key={c.label} className="rounded-lg p-3 text-center" style={{ backgroundColor: c.bg }}>
                                    <p className="text-[10px] font-semibold text-gray-500 mb-1">{c.label}</p>
                                    <p className="text-base font-bold mb-0.5" style={{ color: c.color }}>{c.value}</p>
                                    <p className="text-[10px] font-medium" style={{ color: c.color }}>{c.share}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 border-t border-gray-100 pt-3">
                            {[
                                { label: 'Aetna MA FY27 repricing target', value: '200–300 bps', note: 'MBR improvement vs. FY26 actual' },
                                { label: 'Each 100bps MBR shift ≈ HCB AOI impact', value: '~$550M', note: 'Annualized on $55B+ HCB premium base' },
                                { label: 'CMS Star Rating threshold (quality bonus)', value: '≥4.0★', note: 'Required for full MA quality bonus revenue' },
                            ].map(r => (
                                <div key={r.label} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{r.label}</span>
                                    <div className="text-right">
                                        <span className="font-semibold text-[#003B2C]">{r.value}</span>
                                        <span className="text-gray-400 text-xs ml-2">{r.note}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── 7. Competitive Strengths & Weaknesses ──────────────── */}
                <motion.div {...fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Shield className="w-5 h-5 text-[#003B2C]" />
                        <h2 className="text-lg font-semibold text-[#003B2C]">Competitor Strengths</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Competitor</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Key Strengths</th>
                                </tr>
                            </thead>
                            <tbody>
                                {strengthsTable.map((row, i) => (
                                    <tr key={row.name} className="border-b border-gray-100">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: getCompetitorColor(row.name) }}
                                                />
                                                <span className="font-medium text-gray-900">{row.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-2">
                                                {row.strengths.length > 0 ? (
                                                    row.strengths.map((s, j) => (
                                                        <span
                                                            key={j}
                                                            className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                        >
                                                            {s}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">No data</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* ── Market Drivers & Challenges ─────────────────────────── */}
                <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                            <h2 className="text-lg font-semibold text-[#003B2C]">Market Drivers</h2>
                        </div>
                        <ul className="space-y-2">
                            {market.marketDrivers.map((d, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                    <ArrowUp className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{d}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Shield className="w-5 h-5 text-amber-500" />
                            <h2 className="text-lg font-semibold text-[#003B2C]">Market Challenges</h2>
                        </div>
                        <ul className="space-y-2">
                            {market.marketChallenges.map((c, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                    <Minus className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{c}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
