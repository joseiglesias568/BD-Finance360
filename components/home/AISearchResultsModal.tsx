'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    BarChart3,
    Brain,
    Building,
    LineChart,
    Target,
    X
} from 'lucide-react';

interface AISearchResultsModalProps {
    searchQuery: string;
    searchResults: any;
    isSearching: boolean;
    onClose: () => void;
}

export default function AISearchResultsModal({
    searchQuery,
    searchResults,
    isSearching,
    onClose,
}: AISearchResultsModalProps) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#1c519c] to-[#1c519c] p-6 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <Brain className="w-8 h-8" />
                                    <h2 className="text-2xl font-bold">AI Analysis Results</h2>
                                </div>
                                <p className="text-emerald-100">Query: &quot;{searchQuery}&quot;</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {isSearching ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-16 h-16 border-4 border-[#1c519c] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600">Analyzing business data and generating insights...</p>
                            </div>
                        ) : searchResults ? (
                            <div className="space-y-6">
                                {/* Summary */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                                    <h3 className="font-semibold text-gray-900 mb-2">Executive Summary</h3>
                                    <p className="text-gray-700">{searchResults.summary}</p>
                                </div>

                                {/* Key Findings */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                        <Target className="w-5 h-5 mr-2 text-[#1c519c]" />
                                        Key Findings
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {searchResults.keyFindings?.map((finding: any, idx: number) => (
                                            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900 text-sm">{finding.title}</h4>
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-xs text-gray-500">Confidence</span>
                                                        <span className="text-xs font-bold text-[#1c519c]">{finding.confidence}%</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600">{finding.detail}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Data Visualizations */}
                                {searchResults.visualizations && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <BarChart3 className="w-5 h-5 mr-2 text-[#1c519c]" />
                                            Data Visualizations
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {Object.entries(searchResults.visualizations).map(([key, viz]: [string, any]) => (
                                                <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-3">{viz.title}</h4>

                                                    {/* Line Chart */}
                                                    {viz.type === 'line' && (
                                                        <div className="h-32 relative">
                                                            <svg className="w-full h-full" viewBox="0 0 300 120">
                                                                {/* Grid lines */}
                                                                <line x1="0" y1="100" x2="300" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                                                                <line x1="0" y1="60" x2="300" y2="60" stroke="#e5e7eb" strokeWidth="1" />
                                                                <line x1="0" y1="20" x2="300" y2="20" stroke="#e5e7eb" strokeWidth="1" />

                                                                {/* Actual line */}
                                                                <polyline
                                                                    points={viz.data.map((d: any, i: number) =>
                                                                        `${i * 25},${100 - (d.value - 17) * 20}`
                                                                    ).join(' ')}
                                                                    fill="none"
                                                                    stroke="#06b6d4"
                                                                    strokeWidth="2"
                                                                />

                                                                {/* Benchmark line */}
                                                                <polyline
                                                                    points={viz.data.map((d: any, i: number) =>
                                                                        `${i * 25},${100 - (d.benchmark - 17) * 20}`
                                                                    ).join(' ')}
                                                                    fill="none"
                                                                    stroke="#94a3b8"
                                                                    strokeWidth="2"
                                                                    strokeDasharray="5,5"
                                                                />

                                                                {/* Data points */}
                                                                {viz.data.map((d: any, i: number) => (
                                                                    <circle
                                                                        key={i}
                                                                        cx={i * 25}
                                                                        cy={100 - (d.value - 17) * 20}
                                                                        r="3"
                                                                        fill="#06b6d4"
                                                                    />
                                                                ))}
                                                            </svg>
                                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                                <span>{viz.data[0].month}</span>
                                                                <span>{viz.data[Math.floor(viz.data.length / 2)].month}</span>
                                                                <span>{viz.data[viz.data.length - 1].month}</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Bar Chart */}
                                                    {viz.type === 'bar' && (
                                                        <div className="space-y-2">
                                                            {viz.data.map((d: any, i: number) => {
                                                                // Handle different data structures
                                                                const label = d.region || d.segment || d.quarter || d.segment;
                                                                const value = d.free || d.share || Math.abs(d.change) || d.atp || 0;
                                                                const displayValue = d.free ? `$${d.free}M` :
                                                                    d.atp ? `$${(d.atp / 1000).toFixed(0)}K` :
                                                                        d.change !== undefined ? `${d.change > 0 ? '+' : ''}${d.change}%` :
                                                                            `${d.share}%`;
                                                                const maxValue = Math.max(...viz.data.map((item: any) =>
                                                                    item.free || item.share || Math.abs(item.change) || item.atp / 1000 || 0
                                                                ));
                                                                const percentage = (value / maxValue) * 100;

                                                                return (
                                                                    <div key={i}>
                                                                        <div className="flex justify-between text-xs mb-1">
                                                                            <span className="text-gray-600">{label}</span>
                                                                            <span className={`font-medium ${d.change !== undefined && d.change < 0 ? 'text-red-600' : 'text-green-600'
                                                                                }`}>
                                                                                {displayValue}
                                                                            </span>
                                                                        </div>
                                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className={`h-2 rounded-full ${d.change !== undefined && d.change < 0 ? 'bg-red-400' : 'bg-[#1c519c]'
                                                                                    }`}
                                                                                style={{ width: `${percentage}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Pie Chart */}
                                                    {viz.type === 'pie' && (
                                                        <div className="flex items-center justify-center">
                                                            <div className="relative w-32 h-32">
                                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                                    {(() => {
                                                                        let cumulativePercent = 0;
                                                                        return viz.data.map((d: any, i: number) => {
                                                                            const startAngle = cumulativePercent * 3.6;
                                                                            cumulativePercent += d.value;
                                                                            const endAngle = cumulativePercent * 3.6;
                                                                            const largeArc = d.value > 50 ? 1 : 0;
                                                                            const x1 = 50 + 40 * Math.cos(startAngle * Math.PI / 180);
                                                                            const y1 = 50 + 40 * Math.sin(startAngle * Math.PI / 180);
                                                                            const x2 = 50 + 40 * Math.cos(endAngle * Math.PI / 180);
                                                                            const y2 = 50 + 40 * Math.sin(endAngle * Math.PI / 180);

                                                                            return (
                                                                                <path
                                                                                    key={i}
                                                                                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                                                    fill={d.color}
                                                                                    stroke="white"
                                                                                    strokeWidth="2"
                                                                                />
                                                                            );
                                                                        });
                                                                    })()}
                                                                </svg>
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="text-center">
                                                                        <p className="text-xs text-gray-500">Total</p>
                                                                        <p className="text-sm font-bold">100%</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4 space-y-1">
                                                                {viz.data.map((d: any, i: number) => (
                                                                    <div key={i} className="flex items-center space-x-2">
                                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                                                        <span className="text-xs text-gray-600">{d.name}: {d.value}%</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Gauge Chart */}
                                                    {viz.type === 'gauge' && (
                                                        <div className="flex items-center justify-center">
                                                            <div className="relative w-40 h-20">
                                                                <svg className="w-full h-full" viewBox="0 0 100 50">
                                                                    {/* Background arc */}
                                                                    <path
                                                                        d="M 10 45 A 35 35 0 0 1 90 45"
                                                                        fill="none"
                                                                        stroke="#e5e7eb"
                                                                        strokeWidth="8"
                                                                        strokeLinecap="round"
                                                                    />
                                                                    {/* Progress arc */}
                                                                    <path
                                                                        d="M 10 45 A 35 35 0 0 1 90 45"
                                                                        fill="none"
                                                                        stroke="#06b6d4"
                                                                        strokeWidth="8"
                                                                        strokeLinecap="round"
                                                                        strokeDasharray={`${viz.data.current * 1.8} 180`}
                                                                    />
                                                                    {/* Target marker */}
                                                                    <line
                                                                        x1="50"
                                                                        y1="10"
                                                                        x2="50"
                                                                        y2="15"
                                                                        stroke="#ef4444"
                                                                        strokeWidth="2"
                                                                        transform={`rotate(${(viz.data.target / 100) * 180 - 90} 50 45)`}
                                                                    />
                                                                </svg>
                                                                <div className="absolute inset-0 flex items-end justify-center pb-1">
                                                                    <div className="text-center">
                                                                        <p className="text-lg font-bold text-gray-900">{viz.data.current}%</p>
                                                                        <p className="text-xs text-gray-500">Target: {viz.data.target}%</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Waterfall Chart */}
                                                    {viz.type === 'waterfall' && (
                                                        <div className="h-48">
                                                            <svg className="w-full h-full" viewBox="0 0 400 180">
                                                                {(() => {
                                                                    let cumulative = 0;
                                                                    const maxValue = Math.max(...viz.data.map((d: any) => Math.abs(d.value)));
                                                                    const scale = 120 / maxValue;

                                                                    return viz.data.map((d: any, i: number) => {
                                                                        const barHeight = Math.abs(d.value) * scale;
                                                                        const barY = d.value > 0 ? 150 - cumulative * scale - barHeight : 150 - cumulative * scale;
                                                                        const previousCumulative = cumulative;
                                                                        if (d.category !== 'Current Year' && d.category !== 'Prior Year') {
                                                                            cumulative += d.value;
                                                                        }

                                                                        return (
                                                                            <g key={i}>
                                                                                <rect
                                                                                    x={i * 55 + 10}
                                                                                    y={barY}
                                                                                    width={45}
                                                                                    height={barHeight}
                                                                                    fill={d.value > 0 ? '#10b981' : '#ef4444'}
                                                                                    opacity="0.8"
                                                                                />
                                                                                {i < viz.data.length - 1 && i > 0 && (
                                                                                    <line
                                                                                        x1={i * 55 + 55}
                                                                                        y1={150 - cumulative * scale}
                                                                                        x2={(i + 1) * 55 + 10}
                                                                                        y2={150 - cumulative * scale}
                                                                                        stroke="#94a3b8"
                                                                                        strokeWidth="1"
                                                                                        strokeDasharray="2,2"
                                                                                    />
                                                                                )}
                                                                                <text
                                                                                    x={i * 55 + 32}
                                                                                    y={barY - 5}
                                                                                    textAnchor="middle"
                                                                                    className="text-xs font-medium fill-gray-700"
                                                                                >
                                                                                    {d.value > 0 ? '+' : ''}{d.value.toFixed(1)}
                                                                                </text>
                                                                            </g>
                                                                        );
                                                                    });
                                                                })()}
                                                                {/* X-axis labels */}
                                                                {viz.data.map((d: any, i: number) => (
                                                                    <text
                                                                        key={`label-${i}`}
                                                                        x={i * 55 + 32}
                                                                        y={170}
                                                                        textAnchor="middle"
                                                                        className="text-xs fill-gray-600"
                                                                        fontSize="10"
                                                                    >
                                                                        {d.category.length > 10 ? d.category.substring(0, 8) + '...' : d.category}
                                                                    </text>
                                                                ))}
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* Area Chart */}
                                                    {viz.type === 'area' && (
                                                        <div className="h-32 relative">
                                                            <svg className="w-full h-full" viewBox="0 0 300 120">
                                                                {/* Grid lines */}
                                                                <line x1="0" y1="100" x2="300" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                                                                <line x1="0" y1="60" x2="300" y2="60" stroke="#e5e7eb" strokeWidth="1" />
                                                                <line x1="0" y1="20" x2="300" y2="20" stroke="#e5e7eb" strokeWidth="1" />

                                                                {/* Area fill */}
                                                                <path
                                                                    d={`M 0,100 ${viz.data.map((d: any, i: number) =>
                                                                        `L ${i * 50},${100 - (d.value / Math.max(...viz.data.map((x: any) => x.value))) * 80}`
                                                                    ).join(' ')} L ${(viz.data.length - 1) * 50},100 Z`}
                                                                    fill="#06b6d4"
                                                                    opacity="0.2"
                                                                />

                                                                {/* Line */}
                                                                <polyline
                                                                    points={viz.data.map((d: any, i: number) =>
                                                                        `${i * 50},${100 - (d.value / Math.max(...viz.data.map((x: any) => x.value))) * 80}`
                                                                    ).join(' ')}
                                                                    fill="none"
                                                                    stroke="#06b6d4"
                                                                    strokeWidth="2"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* Combo Chart */}
                                                    {viz.type === 'combo' && (
                                                        <div className="h-32 relative">
                                                            <svg className="w-full h-full" viewBox="0 0 300 120">
                                                                {/* Bars */}
                                                                {viz.data.map((d: any, i: number) => (
                                                                    <rect
                                                                        key={`bar-${i}`}
                                                                        x={i * 50 + 10}
                                                                        y={100 - (d.cost / Math.max(...viz.data.map((x: any) => x.cost))) * 80}
                                                                        width={30}
                                                                        height={(d.cost / Math.max(...viz.data.map((x: any) => x.cost))) * 80}
                                                                        fill="#94a3b8"
                                                                        opacity="0.6"
                                                                    />
                                                                ))}

                                                                {/* Line for incidents */}
                                                                <polyline
                                                                    points={viz.data.map((d: any, i: number) =>
                                                                        `${i * 50 + 25},${100 - (d.incidents / Math.max(...viz.data.map((x: any) => x.incidents))) * 80}`
                                                                    ).join(' ')}
                                                                    fill="none"
                                                                    stroke="#ef4444"
                                                                    strokeWidth="2"
                                                                />

                                                                {/* Data points */}
                                                                {viz.data.map((d: any, i: number) => (
                                                                    <circle
                                                                        key={`point-${i}`}
                                                                        cx={i * 50 + 25}
                                                                        cy={100 - (d.incidents / Math.max(...viz.data.map((x: any) => x.incidents))) * 80}
                                                                        r="3"
                                                                        fill="#ef4444"
                                                                    />
                                                                ))}
                                                            </svg>
                                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                                <span>{viz.data[0].month}</span>
                                                                <span>{viz.data[viz.data.length - 1].month}</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Heatmap Chart */}
                                                    {viz.type === 'heatmap' && (
                                                        <div className="h-48">
                                                            <svg className="w-full h-full" viewBox="0 0 500 200">
                                                                {/* Risk heatmap grid */}
                                                                {viz.data.map((d: any, i: number) => {
                                                                    const x = (d.likelihood - 1) * 100 + 50;
                                                                    const y = 150 - (d.impact - 1) * 30;
                                                                    const color = d.impact * d.likelihood > 12 ? '#ef4444' :
                                                                        d.impact * d.likelihood > 6 ? '#f59e0b' :
                                                                            '#10b981';

                                                                    return (
                                                                        <g key={i}>
                                                                            <rect
                                                                                x={x - 40}
                                                                                y={y - 25}
                                                                                width={80}
                                                                                height={50}
                                                                                fill={color}
                                                                                opacity="0.7"
                                                                                stroke="#fff"
                                                                                strokeWidth="2"
                                                                            />
                                                                            <text
                                                                                x={x}
                                                                                y={y}
                                                                                textAnchor="middle"
                                                                                dominantBaseline="middle"
                                                                                className="text-xs font-medium fill-white"
                                                                            >
                                                                                {d.risk.substring(0, 10)}
                                                                            </text>
                                                                        </g>
                                                                    );
                                                                })}

                                                                {/* Axes */}
                                                                <text x="250" y={190} textAnchor="middle" className="text-xs fill-gray-600 font-medium">
                                                                    Likelihood →
                                                                </text>
                                                                <text x="20" y={75} textAnchor="middle" className="text-xs fill-gray-600 font-medium" transform="rotate(-90 20 75)">
                                                                    Impact →
                                                                </text>
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* Stacked Chart */}
                                                    {viz.type === 'stacked' && (
                                                        <div className="h-32 relative">
                                                            <svg className="w-full h-full" viewBox="0 0 300 120">
                                                                {/* Stacked bars for efficiency components */}
                                                                {viz.data.map((d: any, i: number) => {
                                                                    const availabilityHeight = (d.availability / 100) * 100;
                                                                    const performanceHeight = (d.performance / 100) * 100;
                                                                    const qualityHeight = (d.quality / 100) * 100;
                                                                    const totalHeight = (d.availability * d.performance * d.quality) / 10000 * 100;

                                                                    return (
                                                                        <g key={i}>
                                                                            <rect
                                                                                x={i * 75 + 20}
                                                                                y={120 - totalHeight}
                                                                                width={50}
                                                                                height={totalHeight}
                                                                                fill="#06b6d4"
                                                                                opacity="0.8"
                                                                            />
                                                                            <text
                                                                                x={i * 75 + 45}
                                                                                y={115 - totalHeight}
                                                                                textAnchor="middle"
                                                                                className="text-xs font-medium fill-gray-700"
                                                                            >
                                                                                {((d.availability * d.performance * d.quality) / 10000).toFixed(0)}%
                                                                            </text>
                                                                            <text
                                                                                x={i * 75 + 45}
                                                                                y={135}
                                                                                textAnchor="middle"
                                                                                className="text-xs fill-gray-600"
                                                                            >
                                                                                {d.month}
                                                                            </text>
                                                                        </g>
                                                                    );
                                                                })}
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* Other chart types as placeholders */}
                                                    {['donut', 'sankey', 'bubble', 'radar', 'funnel', 'growth', 'pathway'].includes(viz.type) && (
                                                        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                                                            <div className="text-center">
                                                                <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                <p className="text-xs text-gray-500">{viz.title}</p>
                                                                <p className="text-xs text-gray-400 mt-1">Chart visualization</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Related Business Drivers */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                        <Building className="w-5 h-5 mr-2 text-[#1c519c]" />
                                        Related Business Drivers
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {searchResults.relatedDrivers?.map((driver: any, idx: number) => (
                                            <div key={idx} className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900">{driver.category}</h4>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${driver.impact === 'Critical' ? 'bg-red-100 text-red-700' :
                                                        driver.impact === 'High' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {driver.impact} Impact
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {driver.drivers.map((d: string, i: number) => (
                                                        <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                                            {d}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Recommendations */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                        <Brain className="w-5 h-5 mr-2 text-[#1c519c]" />
                                        AI Recommendations
                                    </h3>
                                    <div className="bg-gradient-to-br from-[#F0F0F0] to-emerald-50 rounded-xl p-5 border border-[#1c519c]/20">
                                        <div className="space-y-3">
                                            {searchResults.recommendations?.map((rec: string, idx: number) => (
                                                <div key={idx} className="flex items-start space-x-3">
                                                    <div className="w-7 h-7 rounded-full bg-[#1c519c] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-sm text-gray-700">{rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Data Quality & Transparency */}
                                {searchResults.dataQuality && (
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <LineChart className="w-5 h-5 mr-2 text-[#1c519c]" />
                                            Data Quality & Transparency
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Completeness</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{ width: `${searchResults.dataQuality.completeness}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700">{searchResults.dataQuality.completeness}%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Accuracy</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-[#1c519c] h-2 rounded-full"
                                                            style={{ width: `${searchResults.dataQuality.accuracy}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700">{searchResults.dataQuality.accuracy}%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Timeliness</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-[#1c519c] h-2 rounded-full"
                                                            style={{ width: `${searchResults.dataQuality.timeliness}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700">{searchResults.dataQuality.timeliness}%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Overall Score</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-[#1c519c] h-2 rounded-full"
                                                            style={{ width: `${Math.round((searchResults.dataQuality.completeness + searchResults.dataQuality.accuracy + searchResults.dataQuality.timeliness) / 3)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {Math.round((searchResults.dataQuality.completeness + searchResults.dataQuality.accuracy + searchResults.dataQuality.timeliness) / 3)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            <p><strong>Methodology:</strong> {searchResults.dataQuality.methodology}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Footer info */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span><strong>Data Source:</strong> {searchResults.dataSource}</span>
                                        <span><strong>Last Updated:</strong> {searchResults.lastUpdated}</span>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-[#1c519c] text-white rounded-lg hover:bg-[#1c519c] transition-colors text-sm font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
