'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Building2, DollarSign, Globe, Smartphone, TrendingDown, TrendingUp, Minus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { KPIConfig, KPIMetric } from '@/config/types';
import type { LucideIcon } from 'lucide-react';

// ── Business Architecture KPI Mapping ─────────────────────────────────────────
// Each KPI is mapped to a specific console from the business architecture.
// Categories match the 6 console groupings from the semantic model.

interface ArchitectureKPI extends KPIMetric {
    consoleId: string;
    consoleName: string;
    architectureCategory: string;
}

interface ArchitectureCategory {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    borderColor: string;
    bgColor: string;
    kpis: ArchitectureKPI[];
}

// Category display config by architecture category id
const categoryDisplayMap: Record<string, { name: string; icon: LucideIcon; color: string; borderColor: string; bgColor: string }> = {
    'revenue-market': { name: 'Revenue & Market', icon: Globe, color: 'text-emerald-700', borderColor: 'border-emerald-200', bgColor: 'bg-emerald-50' },
    'store-operations': { name: 'Property & Operations', icon: Building2, color: 'text-amber-700', borderColor: 'border-amber-200', bgColor: 'bg-amber-50' },
    'digital-customer': { name: 'Digital & Customer', icon: Smartphone, color: 'text-indigo-700', borderColor: 'border-indigo-200', bgColor: 'bg-indigo-50' },
    'financial': { name: 'Financial Performance', icon: DollarSign, color: 'text-blue-700', borderColor: 'border-blue-200', bgColor: 'bg-blue-50' },
};

function getArchitectureCategories(kpis: KPIConfig): ArchitectureCategory[] {
    // Enrich each KPI using the consoleId, consoleName, and architectureCategory from the config
    const enrichKPI = (kpi: KPIMetric): ArchitectureKPI => ({
        ...kpi,
        consoleId: kpi.consoleId ?? 'north-america-performance',
        consoleName: kpi.consoleName ?? 'Overview',
        architectureCategory: kpi.architectureCategory ?? 'revenue-market',
    });

    // Collect all KPIs from all groups
    const allKPIs: KPIMetric[] = [
        ...kpis.primaryKPIs,
        ...kpis.operationalKPIs,
        ...kpis.digitalKPIs,
        ...kpis.financialKPIs,
    ];

    // Group KPIs by their architectureCategory from the config
    const grouped: Record<string, ArchitectureKPI[]> = {};
    for (const kpi of allKPIs) {
        const catId = kpi.architectureCategory ?? 'revenue-market';
        if (!grouped[catId]) grouped[catId] = [];
        grouped[catId].push(enrichKPI(kpi));
    }

    // Build categories in display order, limiting to 3 KPIs per category
    const categoryOrder = ['revenue-market', 'store-operations', 'digital-customer', 'financial'];
    return categoryOrder
        .filter(id => grouped[id] && grouped[id].length > 0)
        .map(id => {
            const display = categoryDisplayMap[id] ?? categoryDisplayMap['revenue-market'];
            return {
                id,
                name: display.name,
                icon: display.icon,
                color: display.color,
                borderColor: display.borderColor,
                bgColor: display.bgColor,
                kpis: grouped[id].slice(0, 3),
            };
        });
}

// Generate a simple sparkline path from synthetic data
function getSparklinePath(trend: 'up' | 'down' | 'flat'): string {
    if (trend === 'up') return 'M2,18 L10,15 L18,12 L26,10 L34,7 L42,5 L50,3';
    if (trend === 'down') return 'M2,4 L10,6 L18,9 L26,11 L34,14 L42,16 L50,18';
    return 'M2,10 L10,11 L18,9 L26,10 L34,10 L42,11 L50,10';
}

function formatValue(kpi: KPIMetric): string {
    const val = kpi.value;
    const unit = kpi.unit;
    if (unit === 'B') return `$${val}B`;
    if (unit === '%') return `${val}%`;
    if (unit === '$') return `$${val}`;
    if (unit === '$/share') return `$${val}`;
    if (unit === 'min') return `${val} min`;
    if (unit === 'M') return `$${val}M`;
    return String(val);
}

interface DashboardKPIGridProps {
    kpiConfig: KPIConfig;
}

export default function DashboardKPIGrid({ kpiConfig }: DashboardKPIGridProps) {
    const router = useRouter();
    const categories = getArchitectureCategories(kpiConfig);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(categories.map(c => c.id)) // All expanded by default
    );

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-900 tracking-tight">Your Dashboard</h3>
                    <p className="text-xs text-gray-500 mt-0.5">KPIs organized by business architecture</p>
                </div>
            </div>

            <div className="space-y-4">
                {categories.map((category) => {
                    const CategoryIcon = category.icon;
                    const isExpanded = expandedCategories.has(category.id);

                    return (
                        <div key={category.id} className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-1.5 rounded-lg ${category.bgColor}`}>
                                        <CategoryIcon className={`w-4 h-4 ${category.color}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{category.name}</span>
                                    <span className="text-xs text-gray-400">{category.kpis.length} metrics</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {/* Quick status summary */}
                                    <div className="flex items-center space-x-1.5">
                                        {category.kpis.map((kpi, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full ${
                                                    kpi.status === 'critical' ? 'bg-red-500' :
                                                    kpi.status === 'warning' ? 'bg-yellow-500' :
                                                    'bg-emerald-500'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {/* KPI Cards */}
                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {category.kpis.map((kpi, idx) => (
                                                    <motion.div
                                                        key={`${kpi.label}-${idx}`}
                                                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                                                        className="bg-gray-50/80 rounded-xl border border-gray-100 hover:border-[#1c519c]/20 hover:shadow-md hover:bg-white transition-all cursor-pointer overflow-hidden group"
                                                    >
                                                        {/* Status bar */}
                                                        <div className={`h-0.5 ${
                                                            kpi.status === 'critical' ? 'bg-red-500' :
                                                            kpi.status === 'warning' ? 'bg-yellow-500' :
                                                            'bg-[#1c519c]'
                                                        }`} />

                                                        <div className="p-4">
                                                            {/* Header: Title + Console badge */}
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="text-xs font-medium text-gray-500 truncate">{kpi.label}</p>
                                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${category.bgColor} ${category.color}`}>
                                                                    {kpi.consoleName.split(' ')[0]}
                                                                </span>
                                                            </div>

                                                            {/* Large metric */}
                                                            <div className="flex items-baseline space-x-2 mb-1">
                                                                <span className="text-2xl font-bold text-gray-900">
                                                                    {formatValue(kpi)}
                                                                </span>
                                                            </div>

                                                            {/* Variance badge */}
                                                            <div className="flex items-center space-x-1.5 mb-3">
                                                                {kpi.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                                                                {kpi.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                                                                {kpi.trend === 'flat' && <Minus className="w-3 h-3 text-gray-400" />}
                                                                <span className={`text-xs font-medium ${
                                                                    kpi.status === 'good' ? 'text-green-600' :
                                                                    kpi.status === 'critical' ? 'text-red-600' :
                                                                    'text-yellow-600'
                                                                }`}>
                                                                    {kpi.trendValue}
                                                                </span>
                                                            </div>

                                                            {/* Sparkline */}
                                                            <div className="h-8 mb-3">
                                                                <svg className="w-full h-full" viewBox="0 0 52 22" preserveAspectRatio="none">
                                                                    <polyline
                                                                        points={getSparklinePath(kpi.trend)}
                                                                        fill="none"
                                                                        stroke={kpi.status === 'critical' ? '#ef4444' : kpi.status === 'good' ? '#10b981' : '#f59e0b'}
                                                                        strokeWidth="1.5"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>

                                                            {/* Target comparison */}
                                                            {kpi.target && (
                                                                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                                                    <span>Target: {typeof kpi.target === 'number' && kpi.unit === 'B' ? `$${kpi.target}B` :
                                                                        typeof kpi.target === 'number' && kpi.unit === '%' ? `${kpi.target}%` :
                                                                        String(kpi.target)}</span>
                                                                    <span className={`font-medium ${kpi.status === 'good' ? 'text-green-500' : kpi.status === 'critical' ? 'text-red-500' : 'text-yellow-500'}`}>
                                                                        {kpi.status === 'good' ? 'On Track' : kpi.status === 'critical' ? 'Below Target' : 'Monitor'}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Console link */}
                                                            <div
                                                                onClick={() => router.push(`/business-consoles/${kpi.consoleId}`)}
                                                                className="flex items-center justify-between text-xs font-medium text-[#1c519c] group-hover:text-[#1c519c] transition-colors"
                                                            >
                                                                <span>{kpi.consoleName}</span>
                                                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
