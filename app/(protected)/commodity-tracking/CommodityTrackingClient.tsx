'use client';

import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    BarChart3,
    Building2,
    DollarSign,
    Hammer,
    Minus,
    Package,
    Shield,
    SlidersHorizontal,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

// ── Color palette ─────────────────────────────────────────────────────
const BRAND = {
    delta: '#003B2C',
    deltaLight: '#009AC7',
    houseDark: '#003B2C',
    softGreen: '#F0F0F0',
};

const COMMODITY_COLORS: Record<string, { spot: string; hedge: string; icon: React.ElementType }> = {
    'Plastic Resins & Polymers': { spot: '#003B2C', hedge: '#10B981', icon: Package },
    'Stainless Steel & Metals': { spot: '#003B2C', hedge: '#34D399', icon: Shield },
    'Electronic Components': { spot: '#3B82F6', hedge: '#93C5FD', icon: Zap },
    'Energy (Manufacturing)': { spot: '#F59E0B', hedge: '#FCD34D', icon: Zap },
    'Logistics & Freight': { spot: '#8B5CF6', hedge: '#C4B5FD', icon: Package },
    'Specialty Chemicals': { spot: '#6B7280', hedge: '#D1D5DB', icon: Package },
};

function getCommodityConfig(name: string) {
    return COMMODITY_COLORS[name] || { spot: '#6B7280', hedge: '#D1D5DB', icon: Package };
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
interface CommodityRow {
    id: number;
    companyId: number;
    commodity: string;
    periodLabel: string;
    spotPrice: number;
    hedgedPrice: number | null;
    priorYearPrice: number;
    unit: string;
    hedgeCoverage: number | null;
    yoyChange: number;
    forecastNext: number | null;
}

interface Props {
    commodityGroups: Record<string, CommodityRow[]>;
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
    const match = label.match(/Q(\d)\s*FY(\d+)/);
    if (!match) return 0;
    return parseInt(match[2]) * 10 + parseInt(match[1]);
}

function getYoYColor(yoy: number): string {
    if (yoy > 15) return 'text-red-600';
    if (yoy > 5) return 'text-amber-600';
    return 'text-emerald-600';
}

function getYoYBg(yoy: number): string {
    if (yoy > 15) return 'bg-red-50 border-red-200';
    if (yoy > 5) return 'bg-amber-50 border-amber-200';
    return 'bg-emerald-50 border-emerald-200';
}

function getYoYDotColor(yoy: number): string {
    if (yoy > 15) return 'bg-red-500';
    if (yoy > 5) return 'bg-amber-500';
    return 'bg-emerald-500';
}

// Approximate annual cost exposure allocation (% of ~$7.04B total BD COGS input costs)
const SPEND_ALLOCATION: Record<string, number> = {
    'Plastic Resins & Polymers': 0.35,     // ~$2,463M — largest BD COGS input
    'Stainless Steel & Metals': 0.18,      // ~$1,268M — needles, surgical instruments
    'Electronic Components': 0.15,          // ~$1,057M — Connected Care / infusion pumps
    'Energy (Manufacturing)': 0.12,         // ~$845M — global manufacturing plants
    'Logistics & Freight': 0.12,            // ~$845M — global supply chain
    'Specialty Chemicals': 0.08,            // ~$563M — reagents, coatings, lubricants
};

const TOTAL_COMMODITY_SPEND = 7040; // $M annual BD COGS input cost exposure (~$18.2B revenue × 48% gross COGS × ~80% input cost component)

export default function CommodityTrackingClient({ commodityGroups }: Props) {
    // ── Slider state for COGS simulator ───────────────────────────────
    const commodityNames = useMemo(() => Object.keys(commodityGroups).sort(), [commodityGroups]);

    const [sliders, setSliders] = useState<Record<string, number>>(() => {
        const init: Record<string, number> = {};
        commodityNames.forEach(name => { init[name] = 0; });
        return init;
    });

    const handleSliderChange = useCallback((name: string, value: number) => {
        setSliders(prev => ({ ...prev, [name]: value }));
    }, []);

    // ── Derived data: latest quarter per commodity ────────────────────
    const latestByCommodity = useMemo(() => {
        const result: Record<string, CommodityRow> = {};
        for (const [name, rows] of Object.entries(commodityGroups)) {
            const sorted = [...rows].sort((a, b) => parsePeriodSort(b.periodLabel) - parsePeriodSort(a.periodLabel));
            if (sorted.length > 0) result[name] = sorted[0];
        }
        return result;
    }, [commodityGroups]);

    // ── Trend chart data per commodity ────────────────────────────────
    const trendData = useMemo(() => {
        const result: Record<string, { period: string; spot: number; hedged: number | null }[]> = {};
        for (const [name, rows] of Object.entries(commodityGroups)) {
            result[name] = [...rows]
                .sort((a, b) => parsePeriodSort(a.periodLabel) - parsePeriodSort(b.periodLabel))
                .map(r => ({
                    period: r.periodLabel,
                    spot: r.spotPrice,
                    hedged: r.hedgedPrice,
                }));
        }
        return result;
    }, [commodityGroups]);

    // ── Hedge coverage bar chart data ─────────────────────────────────
    const hedgeCoverageData = useMemo(() => {
        return commodityNames.map(name => ({
            name: name.replace('Specialty Chemicals', 'Chemicals'),
            coverage: latestByCommodity[name]?.hedgeCoverage ?? 0,
        }));
    }, [commodityNames, latestByCommodity]);

    // ── COGS impact calculation ───────────────────────────────────────
    const cogsImpact = useMemo(() => {
        let totalImpact = 0;
        const items = commodityNames.map(name => {
            const pct = sliders[name] || 0;
            const allocation = SPEND_ALLOCATION[name] || 0;
            const spend = TOTAL_COMMODITY_SPEND * allocation;
            const impact = (spend * pct) / 100;
            totalImpact += impact;
            return { name, pct, spend, impact };
        });
        return { items, totalImpact };
    }, [commodityNames, sliders]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <motion.div className="max-w-7xl mx-auto space-y-6" {...stagger} animate="animate" initial="initial">
                {/* ── Page Header ────────────────────────────────────────── */}
                <motion.div {...fadeUp} className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <div className="p-2 bg-[#003B2C]/10 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-[#003B2C]" />
                            </div>
                            <h1 className="text-2xl font-bold text-[#003B2C]">Cost Index Tracking</h1>
                        </div>
                        <p className="text-sm text-gray-500 ml-12">Market rate monitoring, hedging positions, and operating cost impact analysis</p>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 text-xs text-gray-400">
                        <span>Updated Q1 FY26</span>
                    </div>
                </motion.div>

                {/* ── 1. Summary Cards ───────────────────────────────────── */}
                <motion.div {...fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {commodityNames.map(name => {
                        const row = latestByCommodity[name];
                        if (!row) return null;
                        const config = getCommodityConfig(name);
                        const Icon = config.icon;
                        const yoyAbs = Math.abs(row.yoyChange);

                        return (
                            <div
                                key={name}
                                className={`rounded-xl border shadow-sm p-5 ${getYoYBg(yoyAbs)}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <Icon className="w-5 h-5" style={{ color: config.spot }} />
                                        <span className="text-sm font-semibold text-gray-900">{name}</span>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${getYoYDotColor(yoyAbs)}`} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Current Index</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {row.spotPrice.toFixed(2)} <span className="text-xs font-normal text-gray-400">{row.unit}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Prior Year</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {row.priorYearPrice.toFixed(2)} <span className="text-xs font-normal text-gray-400">{row.unit}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">YoY Change</p>
                                        <p className={`text-sm font-semibold flex items-center space-x-1 ${getYoYColor(yoyAbs)}`}>
                                            {row.yoyChange > 0 ? <ArrowUp className="w-3.5 h-3.5" /> : row.yoyChange < 0 ? <ArrowDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                                            <span>{row.yoyChange > 0 ? '+' : ''}{row.yoyChange.toFixed(1)}%</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Hedge Coverage</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {row.hedgeCoverage !== null ? `${row.hedgeCoverage.toFixed(0)}%` : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* ── 2. Cost Index Trend Charts (2x3 grid) ─────────────── */}
                <motion.div {...fadeUp}>
                    <h2 className="text-lg font-semibold text-[#003B2C] mb-4">Cost Index Trends</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {commodityNames.map(name => {
                            const data = trendData[name] || [];
                            const config = getCommodityConfig(name);
                            return (
                                <div key={name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                    <p className="text-sm font-semibold text-gray-900 mb-3">{name}</p>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <AreaChart data={data}>
                                            <defs>
                                                <linearGradient id={`trend-${name.replace(/[^a-z]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={config.spot} stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor={config.spot} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#6B7280' }} />
                                            <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} domain={['auto', 'auto']} />
                                            <Tooltip
                                                {...tooltipStyle}
                                                formatter={(value: number) => [value.toFixed(2), 'Cost Index']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="spot"
                                                stroke={config.spot}
                                                fill={`url(#trend-${name.replace(/[^a-z]/gi, '')})`}
                                                strokeWidth={2.5}
                                                dot={{ r: 3, fill: config.spot }}
                                                activeDot={{ r: 5 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* ── 3. Hedging Position Summary ────────────────────────── */}
                <motion.div {...fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Shield className="w-5 h-5 text-[#003B2C]" />
                        <h2 className="text-lg font-semibold text-[#003B2C]">Hedging Position Summary</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={hedgeCoverageData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tick={{ fontSize: 11, fill: '#6B7280' }}
                                tickFormatter={v => `${v}%`}
                            />
                            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: '#6B7280' }} />
                            <Tooltip
                                {...tooltipStyle}
                                formatter={(value: number) => [`${value.toFixed(0)}%`, 'Hedge Coverage']}
                            />
                            <ReferenceLine x={75} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Target: 75%', position: 'top', fill: '#EF4444', fontSize: 11 }} />
                            <Bar dataKey="coverage" radius={[0, 4, 4, 0]}>
                                {hedgeCoverageData.map((entry, idx) => (
                                    <Cell
                                        key={idx}
                                        fill={entry.coverage >= 75 ? '#10B981' : entry.coverage >= 50 ? '#F59E0B' : '#EF4444'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* ── 4. COGS Impact Simulator ───────────────────────────── */}
                <motion.div {...fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-2 mb-2">
                        <SlidersHorizontal className="w-5 h-5 text-[#003B2C]" />
                        <h2 className="text-lg font-semibold text-[#003B2C]">COGS Impact Simulator</h2>
                    </div>
                    <p className="text-xs text-gray-400 mb-6">
                        Adjust cost index changes to estimate impact on BD&apos;s annual COGS input cost exposure
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                        {cogsImpact.items.map(item => (
                            <div key={item.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                    <span className={`text-sm font-bold ${
                                        item.pct > 0 ? 'text-red-600' : item.pct < 0 ? 'text-emerald-600' : 'text-gray-500'
                                    }`}>
                                        {item.pct > 0 ? '+' : ''}{item.pct}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={-20}
                                    max={20}
                                    step={1}
                                    value={sliders[item.name] || 0}
                                    onChange={e => handleSliderChange(item.name, parseInt(e.target.value))}
                                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#003B2C]"
                                    style={{
                                        background: `linear-gradient(to right, #10B981 0%, #10B981 50%, #EF4444 50%, #EF4444 100%)`,
                                    }}
                                />
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span>-20%</span>
                                    <span className={`font-medium ${
                                        item.impact > 0 ? 'text-red-500' : item.impact < 0 ? 'text-emerald-500' : 'text-gray-400'
                                    }`}>
                                        {item.impact >= 0 ? '+' : ''}${Math.abs(item.impact).toFixed(0)}M
                                    </span>
                                    <span>+20%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total impact summary */}
                    <div className={`rounded-xl p-5 border-2 ${
                        cogsImpact.totalImpact > 0
                            ? 'bg-red-50 border-red-200'
                            : cogsImpact.totalImpact < 0
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-gray-50 border-gray-200'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {cogsImpact.totalImpact > 0 ? (
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                ) : cogsImpact.totalImpact < 0 ? (
                                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                                ) : (
                                    <DollarSign className="w-6 h-6 text-gray-400" />
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Estimated Annual COGS Impact</p>
                                    <p className="text-xs text-gray-500">Based on ~$7.0B annual BD COGS input cost exposure</p>
                                </div>
                            </div>
                            <p className={`text-3xl font-bold ${
                                cogsImpact.totalImpact > 0 ? 'text-red-600' : cogsImpact.totalImpact < 0 ? 'text-emerald-600' : 'text-gray-500'
                            }`}>
                                {cogsImpact.totalImpact >= 0 ? '+' : '-'}${Math.abs(cogsImpact.totalImpact).toFixed(0)}M
                            </p>
                        </div>
                        {cogsImpact.totalImpact !== 0 && (
                            <p className="text-xs text-gray-500 mt-3">
                                {cogsImpact.totalImpact > 0
                                    ? `A ${(cogsImpact.totalImpact / TOTAL_COMMODITY_SPEND * 100).toFixed(1)}% increase in total cost exposure — EBITDA margin headwind of ~${(cogsImpact.totalImpact / 1350).toFixed(0)} bps`
                                    : `A ${(Math.abs(cogsImpact.totalImpact) / TOTAL_COMMODITY_SPEND * 100).toFixed(1)}% decrease in total cost exposure — EBITDA margin tailwind of ~${(Math.abs(cogsImpact.totalImpact) / 1350).toFixed(0)} bps`}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* ── 5. YoY Price Change Table ──────────────────────────── */}
                <motion.div {...fadeUp} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-[#003B2C]" />
                        <h2 className="text-lg font-semibold text-[#003B2C]">Commodity Price Detail</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commodity</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Spot</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hedged</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prior Year</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">YoY Change</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Forecast Next</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commodityNames.flatMap(name => {
                                    const rows = [...(commodityGroups[name] || [])].sort(
                                        (a, b) => parsePeriodSort(b.periodLabel) - parsePeriodSort(a.periodLabel)
                                    );
                                    return rows.map((row, idx) => (
                                        <tr
                                            key={`${name}-${row.periodLabel}`}
                                            className={`border-b border-gray-50 ${idx === 0 ? 'bg-gray-50/50' : ''}`}
                                        >
                                            {idx === 0 ? (
                                                <td className="py-3 px-4 font-medium text-gray-900" rowSpan={rows.length}>
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: getCommodityConfig(name).spot }}
                                                        />
                                                        <span>{name}</span>
                                                    </div>
                                                </td>
                                            ) : null}
                                            <td className="py-2.5 px-4 text-gray-600">{row.periodLabel}</td>
                                            <td className="py-2.5 px-4 text-right text-gray-900 font-medium">
                                                {row.spotPrice.toFixed(2)} <span className="text-xs text-gray-400">{row.unit}</span>
                                            </td>
                                            <td className="py-2.5 px-4 text-right text-gray-700">
                                                {row.hedgedPrice !== null ? row.hedgedPrice.toFixed(2) : '--'}
                                            </td>
                                            <td className="py-2.5 px-4 text-right text-gray-500">
                                                {row.priorYearPrice.toFixed(2)}
                                            </td>
                                            <td className={`py-2.5 px-4 text-right font-medium ${getYoYColor(Math.abs(row.yoyChange))}`}>
                                                {row.yoyChange > 0 ? '+' : ''}{row.yoyChange.toFixed(1)}%
                                            </td>
                                            <td className="py-2.5 px-4 text-right text-gray-500">
                                                {row.forecastNext !== null ? row.forecastNext.toFixed(2) : '--'}
                                            </td>
                                        </tr>
                                    ));
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
