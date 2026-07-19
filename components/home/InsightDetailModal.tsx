'use client';

import type { InsightChartData } from '@/config/types';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ExternalLink,
    Link2,
    TrendingDown,
    TrendingUp,
    Minus,
    X
} from 'lucide-react';
import { InsightChart } from './InsightCharts';

interface InsightDetailModalProps {
    insight: any;
    onClose: () => void;
    onViewConsole: () => void;
    insightCharts?: InsightChartData[];
}

const insightCardColors = [
    { border: 'border-l-emerald-500', number: 'bg-emerald-500' },
    { border: 'border-l-blue-500', number: 'bg-blue-500' },
    { border: 'border-l-amber-500', number: 'bg-amber-500' },
    { border: 'border-l-red-500', number: 'bg-red-500' },
];

const cardTitles = ['Strategic Priority', 'Growth Opportunity', 'Operational Focus', 'Risk Mitigation'];

export default function InsightDetailModal({ insight, onClose, onViewConsole, insightCharts }: InsightDetailModalProps) {
    const recommendations = insight.aiRecommendations || [];
    const metrics = insight.impactedMetrics || [];
    const chartData = insightCharts?.find(c => c.id === insight.id);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-[1100px] overflow-hidden flex flex-col"
                    style={{ maxHeight: 'calc(100vh - 48px)' }}
                >
                    {/* Dark Header - compact */}
                    <div className="bg-[#1c519c] px-5 py-3 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-base font-bold text-white">{insight.title}</h2>
                        <div className="flex items-center space-x-4">
                            {insight.dataSource && (
                                <span className="text-[11px] text-white/50">
                                    <Link2 className="w-3 h-3 inline mr-1" />
                                    {insight.dataSource}
                                </span>
                            )}
                            {insight.lastUpdated && (
                                <span className="text-[11px] text-white/50">Updated: {insight.lastUpdated}</span>
                            )}
                            <button className="text-[11px] text-white/50 hover:text-white/80 flex items-center space-x-1 transition-colors">
                                <span>Share</span>
                                <ExternalLink className="w-3 h-3" />
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
                            >
                                <span>Close</span>
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar - compact */}
                    <div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                            {['Period', 'Segment', 'Region'].map((filter) => (
                                <div key={filter} className="flex items-center space-x-1 bg-[#1c519c] text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                                    <span>{filter}</span>
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            ))}
                            <span className="text-[11px] text-gray-400 ml-2">{insight.category}</span>
                        </div>
                        <button className="text-[11px] text-gray-400 hover:text-gray-600">Clear Filters</button>
                    </div>

                    {/* Body: Two columns - compact */}
                    <div className="flex-1 overflow-y-auto p-5">
                        <div className="grid grid-cols-3 gap-5">
                            {/* Left Column (2/3) */}
                            <div className="col-span-2 space-y-4">
                                {/* KPI Summary */}
                                <div className="bg-white rounded-xl border border-gray-200 p-4">
                                    <h3 className="text-xs font-semibold text-gray-900 mb-3">Current Period KPI Performance</h3>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {metrics.slice(0, 3).map((metric: any, idx: number) => (
                                            <div key={idx} className="text-center py-2 bg-gray-50 rounded-lg">
                                                <p className="text-[10px] text-gray-500 mb-0.5">{metric.metric}</p>
                                                <p className="text-base font-bold text-gray-900">{metric.value}</p>
                                                <div className="flex items-center justify-center space-x-1 mt-0.5">
                                                    {metric.trend === 'positive' ? (
                                                        <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                                                    ) : metric.trend === 'negative' ? (
                                                        <TrendingDown className="w-2.5 h-2.5 text-red-500" />
                                                    ) : (
                                                        <Minus className="w-2.5 h-2.5 text-gray-400" />
                                                    )}
                                                    <span className={`text-[10px] font-medium ${
                                                        metric.trend === 'positive' ? 'text-emerald-600' :
                                                        metric.trend === 'negative' ? 'text-red-600' :
                                                        'text-gray-500'
                                                    }`}>
                                                        {metric.trend === 'positive' ? 'Improving' : metric.trend === 'negative' ? 'Declining' : 'Stable'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Contextual Chart */}
                                    <div className="bg-gray-50 rounded-lg border border-gray-100 p-3">
                                        <InsightChart insightId={insight.id} chartData={chartData} />
                                    </div>
                                </div>

                                {/* Detail Table - compact */}
                                <div className="bg-white rounded-xl border border-gray-200 p-4">
                                    <h3 className="text-xs font-semibold text-gray-900 mb-2">Detail Breakdown</h3>
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left font-semibold text-gray-500 pb-1.5">Metric</th>
                                                <th className="text-right font-semibold text-gray-500 pb-1.5">Value</th>
                                                <th className="text-right font-semibold text-gray-500 pb-1.5">Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {metrics.map((metric: any, idx: number) => (
                                                <tr key={idx} className="border-b border-gray-50 last:border-0">
                                                    <td className="py-1.5 text-gray-600">{metric.metric}</td>
                                                    <td className="py-1.5 text-right font-medium text-gray-900">{metric.value}</td>
                                                    <td className="py-1.5 text-right">
                                                        {metric.trend === 'positive' ? (
                                                            <TrendingUp className="w-3 h-3 text-emerald-500 inline" />
                                                        ) : metric.trend === 'negative' ? (
                                                            <TrendingDown className="w-3 h-3 text-red-500 inline" />
                                                        ) : (
                                                            <Minus className="w-3 h-3 text-gray-400 inline" />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="border-b border-gray-50">
                                                <td className="py-1.5 text-gray-600">AI Confidence</td>
                                                <td className="py-1.5 text-right font-medium text-gray-900">{insight.confidenceScore}%</td>
                                                <td className="py-1.5 text-right">
                                                    <div className="inline-flex w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="bg-emerald-500 rounded-full" style={{ width: `${insight.confidenceScore}%` }} />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1.5 text-gray-600">Data Quality</td>
                                                <td className="py-1.5 text-right font-medium text-gray-900">{insight.dataQuality || 'High'}</td>
                                                <td className="py-1.5 text-right">
                                                    <span className="text-[10px] text-emerald-600 font-medium">Verified</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right Column (1/3) - Insight Cards */}
                            <div className="col-span-1 flex flex-col space-y-2.5">
                                {recommendations.map((rec: string, idx: number) => {
                                    const colorSet = insightCardColors[idx % insightCardColors.length];
                                    return (
                                        <div
                                            key={idx}
                                            className={`bg-[#1c519c] rounded-xl p-3.5 border-l-4 ${colorSet.border}`}
                                        >
                                            <div className="flex items-start space-x-2.5">
                                                <div className={`w-5 h-5 rounded-full ${colorSet.number} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                    <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-white mb-0.5">{cardTitles[idx] || 'Insight'}</p>
                                                    <p className="text-[11px] text-white/70 leading-relaxed">{rec}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Predictive Forecast */}
                                {insight.predictiveInsight && (
                                    <div className="bg-[#1c519c] rounded-xl p-3.5 border-l-4 border-l-purple-500">
                                        <div className="flex items-start space-x-2.5">
                                            <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <TrendingUp className="w-2.5 h-2.5 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-white mb-0.5">Predictive Forecast</p>
                                                <p className="text-[11px] text-white/70 leading-relaxed">{insight.predictiveInsight}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex-1" />

                                {/* View Console */}
                                <button
                                    onClick={onViewConsole}
                                    disabled={!insight?.consoleAvailable}
                                    className={`w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                                        insight?.consoleAvailable
                                            ? 'text-white bg-[#1c519c] hover:bg-[#1c519c] shadow-lg'
                                            : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                                    }`}
                                >
                                    View Console
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
