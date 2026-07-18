'use client';

import { motion } from 'framer-motion';
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { PersonalizedInsight } from '@/lib/ai-search-engine';

interface InsightStripProps {
    insights: PersonalizedInsight[];
    onInsightClick: (insight: PersonalizedInsight) => void;
}

type InsightStatus = 'green' | 'yellow' | 'red';

interface CategorizedInsight extends PersonalizedInsight {
    status: InsightStatus;
}

function categorizeInsights(insights: PersonalizedInsight[]): CategorizedInsight[] {
    const red = insights
        .filter(i => i.trend === 'down' || i.priority === 'critical')
        .map(i => ({ ...i, status: 'red' as InsightStatus }));

    const green = insights
        .filter(i => i.trend === 'up' && (i.priority === 'high' || i.priority === 'critical'))
        .filter(i => !red.find(r => r.id === i.id))
        .map(i => ({ ...i, status: 'green' as InsightStatus }));

    const yellow = insights
        .filter(i => i.trend === 'up' && (i.priority === 'medium' || i.priority === 'low'))
        .filter(i => !red.find(r => r.id === i.id) && !green.find(g => g.id === i.id))
        .map(i => ({ ...i, status: 'yellow' as InsightStatus }));

    return [
        ...green.slice(0, 2),
        ...yellow.slice(0, 2),
        ...red.slice(0, 2),
    ];
}

const statusIndicator = {
    green: { color: 'bg-emerald-400', trendColor: 'text-emerald-300' },
    yellow: { color: 'bg-amber-400', trendColor: 'text-amber-300' },
    red: { color: 'bg-red-400', trendColor: 'text-red-300' },
};

export default function InsightStrip({ insights, onInsightClick }: InsightStripProps) {
    const router = useRouter();
    const categorized = categorizeInsights(insights);

    return (
        <div className="grid grid-cols-6 gap-3">
            {categorized.map((insight, index) => {
                const indicator = statusIndicator[insight.status];
                return (
                    <motion.div
                        key={insight.id}
                        whileHover={{ y: -3, transition: { duration: 0.15 } }}
                        onClick={() => onInsightClick(insight)}
                        className="bg-white/10 backdrop-blur-md rounded-xl border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all cursor-pointer overflow-hidden group"
                    >
                        <div className="p-4">
                            {/* Status dot + Number */}
                            <div className="flex items-center space-x-2 mb-3">
                                <div className={`w-2 h-2 rounded-full ${indicator.color}`} />
                                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">{insight.category}</span>
                            </div>

                            {/* KPI Value */}
                            <div className="flex items-baseline space-x-1.5 mb-1.5">
                                <span className="text-xl font-bold text-white">{insight.kpi}</span>
                                <div className="flex items-center space-x-0.5">
                                    {insight.trend === 'down' ? (
                                        <TrendingDown className="w-3 h-3 text-red-400" />
                                    ) : (
                                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                                    )}
                                    <span className={`text-xs font-semibold ${insight.trend === 'down' ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {insight.value}
                                    </span>
                                </div>
                            </div>

                            {/* Title */}
                            <p className="text-sm font-medium text-white/90 mb-0.5 truncate">{insight.title}</p>

                            {/* Insight detail */}
                            <p className="text-xs text-white/50 truncate">{insight.insight}</p>

                            {/* Console link on hover */}
                            {insight.consoleLink && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(insight.consoleLink!);
                                    }}
                                    className="flex items-center space-x-0.5 mt-2 text-[10px] font-medium text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <span>View Console</span>
                                    <ChevronRight className="w-2.5 h-2.5" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
