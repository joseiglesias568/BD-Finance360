'use client';

import type { DBConsole } from '@/lib/db/repositories/consoles';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Building2,
    ChevronRight,
    CreditCard,
    DollarSign,
    Globe,
    Grid,
    Heart,
    MapPin,
    Minus,
    Package,
    Scissors,
    Search,
    Shield,
    Smartphone,
    Layers,
    Target,
    TrendingDown,
    TrendingUp,
    Truck,
    Users
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const categories = [
    { id: 'all', name: 'All Consoles', icon: Grid },
    { id: 'revenue-market', name: 'Revenue & Market', icon: TrendingUp },
    { id: 'operations', name: 'Operations & Service Delivery', icon: Building2 },
    { id: 'investment-management', name: 'Investment Management', icon: Layers },
    { id: 'digital-tech', name: 'Digital & Technology', icon: Smartphone },
    { id: 'people-culture', name: 'People & Culture', icon: Heart },
    { id: 'financial', name: 'Financial Performance', icon: DollarSign },
    { id: 'risk-sustainability', name: 'Risk & Sustainability', icon: Shield },
    { id: 'strategy', name: 'Strategy Execution', icon: Target },
];

const categoryToFilterId: Record<string, string> = {
    'Revenue & Market': 'revenue-market',
    'Operations & Service Delivery': 'operations',
    'Investment Management': 'investment-management',
    'Digital & Technology': 'digital-tech',
    'People & Culture': 'people-culture',
    'Financial Performance': 'financial',
    'Risk & Sustainability': 'risk-sustainability',
    'Strategy Execution': 'strategy',
};

const titleToSegmentId: Record<string, string> = {
    'Medical Essentials': 'medical-essentials',
    'Connected Care': 'connected-care',
    'BioPharma Systems': 'biopharma-systems',
    'Interventional': 'interventional',
};

const consoleIconMap: Record<string, LucideIcon> = {
    'Medical Essentials': Package,
    'Connected Care': Activity,
    'BioPharma Systems': Shield,
    'Interventional': Scissors,
};

const categoryColorMap: Record<string, { bg: string; icon: string; border: string }> = {
    'Revenue & Market': { bg: 'bg-emerald-50', icon: 'text-emerald-700', border: 'border-emerald-200' },
    'Operations & Service Delivery': { bg: 'bg-orange-50', icon: 'text-orange-700', border: 'border-orange-200' },
    'Investment Management': { bg: 'bg-indigo-50', icon: 'text-indigo-700', border: 'border-indigo-200' },
    'Digital & Technology': { bg: 'bg-blue-50', icon: 'text-blue-700', border: 'border-blue-200' },
    'People & Culture': { bg: 'bg-pink-50', icon: 'text-pink-700', border: 'border-pink-200' },
    'Financial Performance': { bg: 'bg-purple-50', icon: 'text-purple-700', border: 'border-purple-200' },
    'Risk & Sustainability': { bg: 'bg-amber-50', icon: 'text-amber-700', border: 'border-amber-200' },
    'Strategy Execution': { bg: 'bg-teal-50', icon: 'text-teal-700', border: 'border-teal-200' },
};

const viewableConsoles = new Set([
    'Medical Essentials',
    'Connected Care',
    'BioPharma Systems',
    'Interventional',
]);

function generateMetrics(console: DBConsole): { label: string; value: string; change: number; trend: 'up' | 'down' | 'stable'; target?: string }[] {
    const realMetrics: { label: string; value: string; change: number; trend: 'up' | 'down' | 'stable'; target?: string }[] = [];
    for (const driver of console.keyDrivers) {
        for (const m of driver.metrics) {
            if (!m.currentValue) continue;
            const trend: 'up' | 'down' | 'stable' = m.direction === 'higher' ? 'up' : m.direction === 'lower' ? 'down' : 'stable';
            realMetrics.push({
                label: m.name.length > 28 ? m.name.substring(0, 25) + '...' : m.name,
                value: m.currentValue,
                change: m.variancePercent ?? 0,
                trend,
                target: m.target ?? undefined,
            });
        }
        if (realMetrics.length >= 4) break;
    }
    if (realMetrics.length > 0) return realMetrics.slice(0, 4);
    return console.keyDrivers.slice(0, 4).map(d => ({
        label: d.name.length > 28 ? d.name.substring(0, 25) + '...' : d.name,
        value: '--',
        change: 0,
        trend: 'stable' as const,
    }));
}

function getOverallStatus(console: DBConsole): 'On Track' | 'At Risk' | 'Behind' {
    let atRisk = 0;
    let total = 0;
    for (const driver of console.keyDrivers) {
        for (const m of driver.metrics) {
            total++;
            if (m.direction === 'lower') atRisk++;
        }
    }
    if (total === 0) return 'On Track';
    const pct = atRisk / total;
    if (pct > 0.4) return 'Behind';
    if (pct > 0.2) return 'At Risk';
    return 'On Track';
}

interface BusinessConsolesClientProps {
    dbConsoles: DBConsole[];
}

export default function BusinessConsolesClient({ dbConsoles }: BusinessConsolesClientProps) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const defaultConsoleId = (dbConsoles[0] && titleToSegmentId[dbConsoles[0].title]) ?? 'medical-essentials';
    const [selectedConsole, setSelectedConsole] = useState(defaultConsoleId);

    const enrichedConsoles = dbConsoles.map(c => {
        const segmentId = titleToSegmentId[c.title] ?? c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const filterId = categoryToFilterId[c.category] ?? 'revenue-market';
        const colors = categoryColorMap[c.category] ?? { bg: 'bg-gray-50', icon: 'text-gray-700', border: 'border-gray-200' };
        const Icon = consoleIconMap[c.title] ?? BarChart3;
        const metrics = generateMetrics(c);
        const status = getOverallStatus(c);

        return {
            id: segmentId,
            title: c.title,
            objective: c.objective,
            description: c.objective,
            icon: Icon,
            bgColor: colors.bg,
            iconColor: colors.icon,
            borderColor: colors.border,
            metrics,
            overallStatus: status,
            isViewable: viewableConsoles.has(c.title),
            keyDrivers: c.keyDrivers,
            filterId,
            category: c.category,
        };
    });

    const filteredConsoles = enrichedConsoles.filter(c => {
        const matchesCategory = selectedCategory === 'all' || c.filterId === selectedCategory;
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const selectedConsoleData = enrichedConsoles.find(c => c.id === selectedConsole);

    const handleConsoleSelect = (consoleId: string) => setSelectedConsole(consoleId);
    const handleViewConsole = (consoleId: string) => router.push(`/business-consoles/${consoleId}`);

    const statusBadge = (status: string) => {
        if (status === 'On Track') return 'bg-green-100 text-green-800 border border-green-200';
        if (status === 'At Risk') return 'bg-amber-100 text-amber-800 border border-amber-200';
        return 'bg-red-100 text-red-800 border border-red-200';
    };

    const healthScore = (trend: 'up' | 'down' | 'stable', change: number) => {
        if (trend === 'up' && change > 0) return Math.min(95, 70 + Math.abs(change) * 2);
        if (trend === 'down') return Math.max(40, 70 - Math.abs(change) * 3);
        return 65;
    };

    const healthColor = (score: number) => {
        if (score >= 80) return { ring: 'stroke-green-500', text: 'text-green-600', bg: 'bg-green-50' };
        if (score >= 60) return { ring: 'stroke-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' };
        return { ring: 'stroke-red-500', text: 'text-red-600', bg: 'bg-red-50' };
    };

    function HealthGauge({ score }: { score: number }) {
        const r = 16;
        const circ = 2 * Math.PI * r;
        const offset = circ - (score / 100) * circ;
        const colors = healthColor(score);
        return (
            <div className="relative inline-flex items-center justify-center w-10 h-10">
                <svg width="40" height="40" className="-rotate-90">
                    <circle cx="20" cy="20" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle cx="20" cy="20" r={r} fill="none" className={colors.ring} strokeWidth="3"
                        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
                </svg>
                <span className={`absolute text-[10px] font-bold ${colors.text}`}>{score}</span>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-[#1c519c]">Business Insight Consoles</h1>
                    <p className="mt-1 text-gray-500">
                        Comprehensive business intelligence across all key performance areas
                    </p>
                </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="px-4 sm:px-6 lg:px-8 py-3 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search consoles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c519c] focus:border-transparent"
                        />
                    </div>
                    <div className="flex space-x-1 overflow-x-auto pb-1">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const count = cat.id === 'all'
                                ? enrichedConsoles.length
                                : enrichedConsoles.filter(c => c.filterId === cat.id).length;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all whitespace-nowrap border-2
                                        ${selectedCategory === cat.id
                                            ? 'bg-black text-white border-black'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-transparent'
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{cat.name}</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                                        ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid lg:grid-cols-5 gap-6">

                    {/* Left: Console card list (2 cols of 5) */}
                    <div className="lg:col-span-2 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                            {filteredConsoles.length} Console{filteredConsoles.length !== 1 ? 's' : ''}
                        </p>
                        <AnimatePresence mode="popLayout">
                            {filteredConsoles.map((c, index) => {
                                const Icon = c.icon;
                                const isSelected = selectedConsole === c.id;

                                return (
                                    <motion.div
                                        key={c.id}
                                        layout
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        transition={{ delay: index * 0.04 }}
                                        className={`rounded-xl border-2 cursor-pointer transition-all
                                            ${isSelected
                                                ? 'bg-[#1c519c] border-[#1c519c] shadow-lg'
                                                : `${c.bgColor} ${c.borderColor} hover:shadow-md`
                                            }
                                            ${!c.isViewable && !isSelected ? 'opacity-60' : ''}
                                        `}
                                        onClick={() => handleConsoleSelect(c.id)}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg flex-shrink-0 ${isSelected ? 'bg-white/15' : `${c.bgColor}`}`}>
                                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : c.iconColor}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className={`font-semibold text-sm leading-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                                            {c.title}
                                                        </h3>
                                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0
                                                            ${isSelected
                                                                ? (c.overallStatus === 'On Track' ? 'bg-green-500/30 text-green-200' : c.overallStatus === 'At Risk' ? 'bg-amber-500/30 text-amber-200' : 'bg-red-500/30 text-red-200')
                                                                : statusBadge(c.overallStatus)
                                                            }`}>
                                                            {c.overallStatus}
                                                        </span>
                                                    </div>
                                                    <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                                                        {c.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Metric summary chips */}
                                            {c.isViewable && c.metrics.length > 0 && (
                                                <div className="mt-3 grid grid-cols-2 gap-2">
                                                    {c.metrics.slice(0, 2).map((m) => (
                                                        <div key={m.label} className={`rounded-lg px-2.5 py-2 ${isSelected ? 'bg-white/10' : 'bg-white border border-gray-100'}`}>
                                                            <p className={`text-[10px] truncate ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>{m.label}</p>
                                                            <div className="flex items-baseline gap-1 mt-0.5">
                                                                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{m.value}</span>
                                                                <span className={`text-[10px] font-medium ${
                                                                    m.trend === 'up' ? (isSelected ? 'text-green-300' : 'text-green-600')
                                                                    : m.trend === 'down' ? (isSelected ? 'text-red-300' : 'text-red-600')
                                                                    : (isSelected ? 'text-white/50' : 'text-gray-400')
                                                                }`}>
                                                                    {m.change > 0 ? '+' : ''}{m.change}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Action row */}
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className={`text-[10px] font-medium uppercase tracking-wide ${isSelected ? 'text-white/50' : 'text-gray-400'}`}>
                                                    {c.category}
                                                </span>
                                                {c.isViewable ? (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleViewConsole(c.id); }}
                                                        className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg transition-all
                                                            ${isSelected
                                                                ? 'bg-white/20 text-white hover:bg-white/30'
                                                                : 'bg-black text-white hover:bg-gray-800'
                                                            }`}
                                                    >
                                                        Open <ChevronRight className="w-3 h-3" />
                                                    </button>
                                                ) : (
                                                    <span className={`text-[10px] px-2 py-1 rounded-md ${isSelected ? 'bg-white/10 text-white/50' : 'bg-gray-100 text-gray-400'}`}>
                                                        Coming Soon
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Right: Rich console detail panel (3 cols of 5) */}
                    <div className="lg:col-span-3 lg:sticky lg:top-[104px] lg:self-start space-y-4">
                        {selectedConsoleData ? (
                            <>
                                {/* Console header */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Business Console</span>
                                                <span className="text-xs text-gray-300">·</span>
                                                <span className="text-xs font-medium text-gray-400">Q1 FY26</span>
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">{selectedConsoleData.title}</h2>
                                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{selectedConsoleData.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadge(selectedConsoleData.overallStatus)}`}>
                                                {selectedConsoleData.overallStatus === 'At Risk' && <AlertTriangle className="inline w-3 h-3 mr-1" />}
                                                {selectedConsoleData.overallStatus}
                                            </span>
                                            {selectedConsoleData.isViewable && (
                                                <button
                                                    onClick={() => handleViewConsole(selectedConsoleData.id)}
                                                    className="text-xs font-medium text-black underline underline-offset-2 hover:no-underline"
                                                >
                                                    Open full console →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Metric tiles */}
                                {selectedConsoleData.metrics.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {selectedConsoleData.metrics.map((m, i) => (
                                            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{m.label}</p>
                                                <p className="text-xl font-bold text-gray-900">{m.value}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {m.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                                                    {m.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                                                    {m.trend === 'stable' && <Minus className="w-3 h-3 text-gray-400" />}
                                                    <span className={`text-xs font-semibold ${
                                                        m.trend === 'up' ? 'text-green-600' : m.trend === 'down' ? 'text-red-600' : 'text-gray-400'
                                                    }`}>
                                                        {m.change > 0 ? '+' : ''}{m.change}% YoY
                                                    </span>
                                                </div>
                                                {m.target && (
                                                    <p className="text-[10px] text-gray-400 mt-1">Target: {m.target}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Driver Performance table */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900">Driver Performance</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">Key drivers and their current health — click any row to open the console</p>
                                        </div>
                                    </div>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 px-5 py-2.5">Driver Area</th>
                                                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-2.5">Health</th>
                                                <th className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-2.5">Trend</th>
                                                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-2.5">Gap to Target</th>
                                                <th className="text-right text-[10px] font-bold uppercase tracking-wider text-gray-400 px-5 py-2.5">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {selectedConsoleData.keyDrivers.map((driver, i) => {
                                                const firstMetric = driver.metrics?.[0];
                                                const trend: 'up' | 'down' | 'stable' = firstMetric?.direction === 'higher' ? 'up' : firstMetric?.direction === 'lower' ? 'down' : 'stable';
                                                const change = firstMetric?.variancePercent ?? 0;
                                                const score = healthScore(trend, change);
                                                const hc = healthColor(score);
                                                const driverStatus = trend === 'up' ? 'On Track' : trend === 'down' ? 'At Risk' : 'Monitor';
                                                const gapDisplay = firstMetric?.target
                                                    ? (change > 0 ? `+${change.toFixed(1)}pp` : `${change.toFixed(1)}pp`)
                                                    : '—';

                                                return (
                                                    <tr
                                                        key={i}
                                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                        onClick={() => selectedConsoleData.isViewable && handleViewConsole(selectedConsoleData.id)}
                                                    >
                                                        <td className="px-5 py-3">
                                                            <p className="font-medium text-gray-900 text-sm">{driver.name}</p>
                                                            {driver.subDrivers && driver.subDrivers.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {driver.subDrivers.slice(0, 3).map((sd, si) => (
                                                                        <span key={si} className="text-[10px] bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">{sd}</span>
                                                                    ))}
                                                                    {driver.subDrivers.length > 3 && (
                                                                        <span className="text-[10px] text-gray-400">+{driver.subDrivers.length - 3}</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            <div className="flex justify-center">
                                                                <HealthGauge score={score} />
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                                {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                                                                {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                                                                {trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
                                                                <span className={`text-xs font-semibold ${
                                                                    trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400'
                                                                }`}>
                                                                    {change > 0 ? '+' : ''}{change.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-3 text-right">
                                                            <span className={`text-sm font-semibold ${
                                                                change >= 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}>{gapDisplay}</span>
                                                        </td>
                                                        <td className="px-5 py-3 text-right">
                                                            <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full
                                                                ${driverStatus === 'On Track' ? 'bg-green-100 text-green-700'
                                                                : driverStatus === 'At Risk' ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-gray-100 text-gray-600'}`}>
                                                                {driverStatus === 'At Risk' && '● '}
                                                                {driverStatus === 'On Track' && '● '}
                                                                {driverStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {selectedConsoleData.isViewable && (
                                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                                            <button
                                                onClick={() => handleViewConsole(selectedConsoleData.id)}
                                                className="w-full text-sm font-medium text-center text-black hover:underline"
                                            >
                                                Open full {selectedConsoleData.title} console →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-400">
                                <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Select a console to view performance details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
