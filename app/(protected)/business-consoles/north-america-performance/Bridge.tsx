'use client';

import { sumField, calculateMargin, roundFinancial } from '@/lib/engines';
import { motion } from 'framer-motion';
import {
    Brain,
    Check,
    ChevronDown,
    ChevronRight,
    Edit2,
    Eye,
    FileText,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import type { ConsolePageData } from './types';

interface BridgeProps {
    dbData?: ConsolePageData;
}

interface CommentaryItem {
    id: string;
    metric: string;
    variance: number;
    variancePercent: number;
    userCommentary: string;
    aiSuggestion: string;
    author: string;
    timestamp: string;
    status: 'draft' | 'submitted' | 'approved' | 'signed-off';
    tags: string[];
    signedOffBy?: string;
    signedOffDate?: string;
}

interface BridgeDetailItem {
    id: string;
    name: string;
    value: number;
    type: 'start' | 'positive' | 'negative' | 'end';
    details?: {
        subCategory: string;
        amount: number;
        description: string;
    }[];
    commentary: CommentaryItem;
}

export default function Bridge({ dbData }: BridgeProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('current-month');
    const [expandedSections, setExpandedSections] = useState<string[]>(['revenue']);
    const [editingCommentary, setEditingCommentary] = useState<string | null>(null);
    const [expandedDetails, setExpandedDetails] = useState<string[]>([]);
    const [showDetailModal, setShowDetailModal] = useState<string | null>(null);

    // Build bridge data from DB revenue bridge directly
    const buildBridgeFromDB = (): BridgeDetailItem[] => {
        const bridge = dbData?.financials?.revenueBridge;
        if (bridge && bridge.length > 0) {
            const annualRev = dbData?.financials?.annualRevenue ?? 9.6;
            // Prior period = current revenue minus sum of all bridge impacts
            const totalImpact = sumField(bridge, 'impact');
            const priorRev = roundFinancial((annualRev * 1000) - totalImpact, 0);
            const currentRev = roundFinancial(annualRev * 1000, 0);

            const items: BridgeDetailItem[] = [
                {
                    id: 'revenue-start',
                    name: 'Prior Period',
                    value: priorRev,
                    type: 'start',
                    commentary: {
                        id: 'revenue-start',
                        metric: 'Prior Period Revenue',
                        variance: 0,
                        variancePercent: 0,
                        userCommentary: `Prior period baseline revenue of $${(priorRev / 1000).toFixed(1)}B`,
                        aiSuggestion: 'Starting baseline for period-over-period analysis',
                        author: 'System',
                        timestamp: new Date().toISOString(),
                        status: 'approved',
                        tags: ['baseline']
                    }
                },
                ...bridge.map((b, idx) => ({
                    id: `revenue-bridge-${idx}`,
                    name: b.label,
                    value: b.impact,
                    type: (b.impact >= 0 ? 'positive' : 'negative') as 'positive' | 'negative',
                    commentary: {
                        id: `revenue-bridge-${idx}`,
                        metric: b.label,
                        variance: b.impact,
                        variancePercent: priorRev > 0 ? calculateMargin(b.impact, priorRev) : 0,
                        userCommentary: b.description,
                        aiSuggestion: `${b.label}: ${b.impact >= 0 ? '+' : ''}$${Math.abs(b.impact)}M impact (${b.category})`,
                        author: '',
                        timestamp: '',
                        status: 'draft' as const,
                        tags: [b.category]
                    }
                })),
                {
                    id: 'revenue-end',
                    name: 'Current Period',
                    value: currentRev,
                    type: 'end',
                    commentary: {
                        id: 'revenue-end',
                        metric: 'Current Period Revenue',
                        variance: totalImpact,
                        variancePercent: priorRev > 0 ? calculateMargin(totalImpact, priorRev) : 0,
                        userCommentary: `Current period revenue of $${(currentRev / 1000).toFixed(1)}B`,
                        aiSuggestion: `Revenue of $${(currentRev / 1000).toFixed(1)}B represents ${priorRev > 0 ? calculateMargin(totalImpact, priorRev) : 0}% growth over prior year`,
                        author: 'System',
                        timestamp: new Date().toISOString(),
                        status: 'approved',
                        tags: ['current-period']
                    }
                }
            ];
            return items;
        }

        // Fallback to hardcoded data
        return [
            {
                id: 'revenue-start',
                name: 'Prior Period',
                value: 9100,
                type: 'start',
                commentary: {
                    id: 'revenue-start', metric: 'Prior Period Revenue', variance: 0, variancePercent: 0,
                    userCommentary: 'Q4 FY2024 baseline revenue', aiSuggestion: 'Starting baseline for period-over-period analysis',
                    author: 'System', timestamp: '2025-09-01T00:00:00', status: 'approved', tags: ['baseline']
                }
            },
            {
                id: 'revenue-comp-sales',
                name: 'Organic Fee Growth',
                value: 96,
                type: 'positive',
                details: [
                    { subCategory: 'Average Fee Increase', amount: 182, description: 'Higher fee rates driven by advisory complexity and premium services' },
                    { subCategory: 'Volume Decline', amount: -86, description: 'Transaction volume headwinds partially offset by fee growth' }
                ],
                commentary: {
                    id: 'revenue-comp-sales', metric: 'Organic Fee Growth Impact', variance: 96, variancePercent: 1.1,
                    userCommentary: 'Organic fee growth turned positive at +1% driven by fee increases offsetting transaction volume declines',
                    aiSuggestion: 'Organic fee growth contributed +$96M (+1.1%)',
                    author: 'Rachel Kim', timestamp: '2025-10-15T14:30:00', status: 'signed-off',
                    tags: ['organic-growth', 'volume', 'fee-rate'], signedOffBy: 'Cathy Smith', signedOffDate: '2025-10-15T16:45:00'
                }
            },
            {
                id: 'revenue-new-stores',
                name: 'New Client Revenue',
                value: 285,
                type: 'positive',
                commentary: {
                    id: 'revenue-new-stores', metric: 'New Client Revenue', variance: 285, variancePercent: 3.1,
                    userCommentary: 'Net new client wins contributed $285M in incremental revenue across all regions',
                    aiSuggestion: 'New client revenue of +$285M (+3.1%) from expanded market coverage globally.',
                    author: 'Business Development Team', timestamp: '2025-10-14T15:00:00', status: 'signed-off',
                    tags: ['new-clients', 'expansion'], signedOffBy: 'Cathy Smith', signedOffDate: '2025-10-15T10:00:00'
                }
            },
            {
                id: 'revenue-price',
                name: 'Fee Rate Increases',
                value: 192,
                type: 'positive',
                commentary: {
                    id: 'revenue-price', metric: 'Fee Rate Impact', variance: 192, variancePercent: 2.1,
                    userCommentary: 'Strategic fee adjustments of ~2% on core advisory services with additional scope expansion',
                    aiSuggestion: 'Fee rate increases contributed +$192M (+2.1%).',
                    author: 'Finance Team', timestamp: '2025-10-13T10:00:00', status: 'approved',
                    tags: ['pricing', 'customization']
                }
            },
            {
                id: 'revenue-mix',
                name: 'Service Mix Shift',
                value: 115,
                type: 'positive',
                commentary: {
                    id: 'revenue-mix', metric: 'Service Mix Impact', variance: 115, variancePercent: 1.3,
                    userCommentary: 'Favorable shift toward capital markets and project management driving higher average fees',
                    aiSuggestion: 'Favorable service mix contributed +$115M (+1.3%).',
                    author: 'Strategy Team', timestamp: '2025-10-12T15:00:00', status: 'submitted',
                    tags: ['service-mix', 'capital-markets', 'project-mgmt']
                }
            },
            {
                id: 'revenue-channel',
                name: 'Project Management',
                value: -106,
                type: 'negative',
                commentary: {
                    id: 'revenue-channel', metric: 'Project Management Impact', variance: -106, variancePercent: -1.2,
                    userCommentary: '', aiSuggestion: 'Project Management segment declined -$106M (-1.2%).',
                    author: '', timestamp: '', status: 'draft', tags: ['channel-development', 'cpg']
                }
            },
            {
                id: 'revenue-fx',
                name: 'FX Impact',
                value: -82,
                type: 'negative',
                commentary: {
                    id: 'revenue-fx', metric: 'FX Translation', variance: -82, variancePercent: -0.9,
                    userCommentary: 'Unfavorable FX primarily from China RMB weakness and Japanese Yen depreciation',
                    aiSuggestion: 'Currency headwinds of -$82M (-0.9%).',
                    author: 'Treasury Team', timestamp: '2025-10-14T10:00:00', status: 'approved',
                    tags: ['fx', 'currency']
                }
            },
            {
                id: 'revenue-end',
                name: 'Current Period',
                value: 9600,
                type: 'end',
                commentary: {
                    id: 'revenue-end', metric: 'Current Period Revenue', variance: 500, variancePercent: 5.5,
                    userCommentary: 'Q4 FY2025 revenue of $9.6B, +5% YoY and exceeding plan by 2.1%',
                    aiSuggestion: 'Q4 FY2025 revenue of $9.6B represents 5.5% growth over prior year',
                    author: 'System', timestamp: '2025-09-30T23:59:59', status: 'approved',
                    tags: ['current-period']
                }
            }
        ];
    };

    const [bridgeDetailData, setBridgeDetailData] = useState<Record<string, BridgeDetailItem[]>>({
        revenue: buildBridgeFromDB()
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const toggleDetail = (id: string) => {
        setExpandedDetails(prev =>
            prev.includes(id)
                ? prev.filter(d => d !== id)
                : [...prev, id]
        );
    };

    const handleCommentaryEdit = (section: string, itemId: string, newText: string) => {
        setBridgeDetailData(prev => ({
            ...prev,
            [section]: prev[section].map(item =>
                item.id === itemId
                    ? {
                        ...item,
                        commentary: {
                            ...item.commentary,
                            userCommentary: newText,
                            author: 'Current User',
                            timestamp: new Date().toISOString(),
                            status: 'draft'
                        }
                    }
                    : item
            )
        }));
    };

    const saveCommentary = (section: string, itemId: string) => {
        setBridgeDetailData(prev => ({
            ...prev,
            [section]: prev[section].map(item =>
                item.id === itemId
                    ? {
                        ...item,
                        commentary: {
                            ...item.commentary,
                            status: 'submitted'
                        }
                    }
                    : item
            )
        }));
        setEditingCommentary(null);
    };

    const signOffCommentary = (section: string, itemId: string) => {
        setBridgeDetailData(prev => ({
            ...prev,
            [section]: prev[section].map(item =>
                item.id === itemId
                    ? {
                        ...item,
                        commentary: {
                            ...item.commentary,
                            status: 'signed-off',
                            signedOffBy: 'Current User',
                            signedOffDate: new Date().toISOString()
                        }
                    }
                    : item
            )
        }));
    };

    const renderBridgeChart = (data: BridgeDetailItem[], title: string) => {
        // Calculate cumulative values and positions
        const chartData = data.map((item, index) => {
            let cumulative = 0;
            let startY = 0;
            let endY = 0;

            // Calculate cumulative values up to this point
            for (let i = 0; i <= index; i++) {
                if (data[i].type === 'start') {
                    cumulative = data[i].value;
                } else if (data[i].type === 'positive' && i < index) {
                    cumulative += data[i].value;
                } else if (data[i].type === 'negative' && i < index) {
                    cumulative -= Math.abs(data[i].value);
                }
            }

            // Calculate bar positions
            if (item.type === 'start') {
                startY = 0;
                endY = item.value;
            } else if (item.type === 'end') {
                startY = 0;
                endY = item.value;
            } else if (item.type === 'positive') {
                startY = cumulative;
                endY = cumulative + item.value;
            } else if (item.type === 'negative') {
                startY = cumulative;
                endY = cumulative - Math.abs(item.value);
            }

            return { ...item, startY, endY, cumulative };
        });

        // Find min and max values for scaling
        const allValues = chartData.flatMap(d => [d.startY, d.endY]);
        const minValue = Math.min(...allValues, 0);
        const maxValue = Math.max(...allValues);
        const range = maxValue - minValue;
        const scale = 250 / range;
        const baseline = 270 - (0 - minValue) * scale;

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
                <div className="relative">
                    <svg className="w-full" height="350" viewBox="0 0 1000 350">
                        {/* Grid lines */}
                        <line x1="50" y1={baseline} x2="950" y2={baseline} stroke="#e5e7eb" strokeWidth="1" />

                        {/* Bars */}
                        {chartData.map((item, index) => {
                            const x = 60 + index * 120;
                            const width = 80;
                            const y1 = baseline - (item.endY - minValue) * scale;
                            const y2 = baseline - (item.startY - minValue) * scale;
                            const height = Math.abs(y2 - y1);
                            const y = Math.min(y1, y2);

                            const color = item.type === 'start' || item.type === 'end' ? '#003B2C' :
                                item.type === 'positive' ? '#10b981' : '#ef4444';

                            return (
                                <g key={item.id}>
                                    {/* Bar */}
                                    <rect
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        fill={color}
                                        opacity="0.8"
                                    />

                                    {/* Connector lines */}
                                    {index > 0 && index < data.length - 1 && (
                                        <line
                                            x1={x}
                                            y1={item.type === 'positive' ? y : y + height}
                                            x2={x - 40}
                                            y2={chartData[index - 1].type === 'positive' ?
                                                baseline - (chartData[index - 1].endY - minValue) * scale :
                                                baseline - (chartData[index - 1].startY - minValue) * scale}
                                            stroke="#94a3b8"
                                            strokeWidth="1"
                                            strokeDasharray="2,2"
                                        />
                                    )}

                                    {/* Value labels */}
                                    <text
                                        x={x + width / 2}
                                        y={y - 5}
                                        textAnchor="middle"
                                        className="text-sm font-semibold"
                                        fill={item.type === 'start' || item.type === 'end' ? '#1f2937' :
                                            item.type === 'negative' ? '#ef4444' : '#10b981'}
                                    >
                                        {item.type === 'positive' ? '+' : item.type === 'negative' ? '-' : ''}
                                        ${Math.abs(item.value).toFixed(0)}M
                                    </text>

                                    {/* Category labels */}
                                    <text
                                        x={x + width / 2}
                                        y={310}
                                        textAnchor="middle"
                                        className="text-xs"
                                        fill="#6b7280"
                                    >
                                        {item.name.split(' ').map((word, i) => (
                                            <tspan key={i} x={x + width / 2} dy={i * 12}>
                                                {word}
                                            </tspan>
                                        ))}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Y-axis */}
                        <line x1="50" y1="20" x2="50" y2="300" stroke="#e5e7eb" strokeWidth="1" />

                        {/* Y-axis labels */}
                        {[0, 2000, 4000, 6000, 8000, 10000].map(val => {
                            const y = baseline - ((val - minValue) * scale);
                            if (y >= 20 && y <= 300) {
                                return (
                                    <g key={val}>
                                        <line x1="45" y1={y} x2="50" y2={y} stroke="#6b7280" strokeWidth="1" />
                                        <text x="40" y={y + 4} textAnchor="end" className="text-xs" fill="#6b7280">
                                            {(val / 1000).toFixed(0)}B
                                        </text>
                                    </g>
                                );
                            }
                            return null;
                        })}
                    </svg>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">Bridge Analysis & Commentary</h3>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003B2C]"
                        >
                            <option value="current-month">Current Quarter</option>
                            <option value="current-quarter">Year to Date</option>
                            <option value="ytd">Full Year</option>
                            <option value="custom">Custom Period</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">Auto-save enabled</span>
                        <button className="px-4 py-2 bg-[#003B2C] text-white rounded-lg font-medium hover:bg-[#007A3D] transition-all flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Submit for Review</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Revenue Bridge Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
                <button
                    onClick={() => toggleSection('revenue')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        {expandedSections.includes('revenue') ?
                            <ChevronDown className="w-5 h-5 text-gray-400" /> :
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        }
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Bridge</h3>
                        {(() => {
                            const startVal = bridgeDetailData.revenue[0]?.value ?? 0;
                            const endVal = bridgeDetailData.revenue[bridgeDetailData.revenue.length - 1]?.value ?? 0;
                            const yoyPct = startVal > 0 ? (((endVal - startVal) / startVal) * 100).toFixed(1) : '0.0';
                            const isPositive = endVal > startVal;
                            return (
                                <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? '+' : ''}{yoyPct}% YoY
                                </span>
                            );
                        })()}
                    </div>
                    <div className="flex items-center space-x-2">
                        {bridgeDetailData.revenue.filter(item =>
                            item.commentary.status === 'signed-off' ||
                            item.commentary.status === 'approved'
                        ).length === bridgeDetailData.revenue.filter(item =>
                            item.type !== 'start' && item.type !== 'end'
                        ).length && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                    All Commentary Complete
                                </span>
                            )}
                    </div>
                </button>

                {expandedSections.includes('revenue') && (
                    <div className="px-4 pb-4 space-y-6">
                        {/* Bridge Chart */}
                        {renderBridgeChart(bridgeDetailData.revenue, 'Revenue Bridge Analysis ($M)')}

                        {/* Detailed Variance Table */}
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <h4 className="font-semibold text-gray-900">Variance Analysis & Commentary</h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Component</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Value ($M)</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">% Impact</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Commentary</th>
                                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {bridgeDetailData.revenue.map((item) => (
                                            <React.Fragment key={item.id}>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center space-x-2">
                                                            {item.details && (
                                                                <button
                                                                    onClick={() => toggleDetail(item.id)}
                                                                    className="p-1 hover:bg-gray-200 rounded"
                                                                >
                                                                    {expandedDetails.includes(item.id) ?
                                                                        <ChevronDown className="w-4 h-4" /> :
                                                                        <ChevronRight className="w-4 h-4" />
                                                                    }
                                                                </button>
                                                            )}
                                                            <span className="font-medium text-gray-900">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className={`text-right py-3 px-4 font-medium ${item.type === 'positive' ? 'text-green-600' :
                                                        item.type === 'negative' ? 'text-red-600' :
                                                            'text-gray-900'
                                                        }`}>
                                                        {item.type === 'positive' ? '+' : item.type === 'negative' ? '-' : ''}
                                                        {item.type === 'start' || item.type === 'end'
                                                            ? `$${(item.value / 1000).toFixed(1)}B`
                                                            : `$${Math.abs(item.value).toFixed(0)}M`
                                                        }
                                                    </td>
                                                    <td className={`text-right py-3 px-4 text-sm ${item.type === 'positive' ? 'text-green-600' :
                                                        item.type === 'negative' ? 'text-red-600' :
                                                            'text-gray-600'
                                                        }`}>
                                                        {item.commentary.variancePercent !== 0 && (
                                                            <>
                                                                {item.commentary.variancePercent > 0 ? '+' : ''}
                                                                {item.commentary.variancePercent.toFixed(1)}%
                                                            </>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="space-y-2">
                                                            {/* AI Suggestion */}
                                                            {item.commentary.aiSuggestion && (
                                                                <div className="flex items-start space-x-2 text-sm">
                                                                    <Brain className="w-4 h-4 text-[#003B2C] mt-0.5 flex-shrink-0" />
                                                                    <p className="text-gray-600 italic">{item.commentary.aiSuggestion}</p>
                                                                </div>
                                                            )}
                                                            {/* User Commentary */}
                                                            {editingCommentary === item.id ? (
                                                                <div className="space-y-2">
                                                                    <textarea
                                                                        value={item.commentary.userCommentary}
                                                                        onChange={(e) => handleCommentaryEdit('revenue', item.id, e.target.value)}
                                                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003B2C]"
                                                                        rows={3}
                                                                        placeholder="Add your commentary..."
                                                                    />
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => saveCommentary('revenue', item.id)}
                                                                            className="px-3 py-1 bg-[#003B2C] text-white rounded text-sm font-medium hover:bg-[#007A3D]"
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingCommentary(null)}
                                                                            className="px-3 py-1 border border-gray-300 rounded text-sm"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                item.commentary.userCommentary && (
                                                                    <div className="text-sm text-gray-700">
                                                                        <p>{item.commentary.userCommentary}</p>
                                                                        {item.commentary.author && (
                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                -- {item.commentary.author}, {new Date(item.commentary.timestamp).toLocaleDateString()}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-center py-3 px-4">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.commentary.status === 'signed-off' ? 'bg-green-100 text-green-800' :
                                                            item.commentary.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                                                item.commentary.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {item.commentary.status === 'signed-off' && <Check className="w-3 h-3 mr-1" />}
                                                            {item.commentary.status}
                                                        </span>
                                                        {item.commentary.signedOffBy && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {item.commentary.signedOffBy}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="text-center py-3 px-4">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            {item.type !== 'start' && item.type !== 'end' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => setEditingCommentary(item.id)}
                                                                        className="p-1 hover:bg-gray-200 rounded"
                                                                        title="Edit Commentary"
                                                                    >
                                                                        <Edit2 className="w-4 h-4 text-gray-600" />
                                                                    </button>
                                                                    {item.commentary.status === 'submitted' && (
                                                                        <button
                                                                            onClick={() => signOffCommentary('revenue', item.id)}
                                                                            className="p-1 hover:bg-gray-200 rounded"
                                                                            title="Sign Off"
                                                                        >
                                                                            <FileText className="w-4 h-4 text-[#003B2C]" />
                                                                        </button>
                                                                    )}
                                                                    {item.details && (
                                                                        <button
                                                                            onClick={() => setShowDetailModal(item.id)}
                                                                            className="p-1 hover:bg-gray-200 rounded"
                                                                            title="View Details"
                                                                        >
                                                                            <Eye className="w-4 h-4 text-gray-600" />
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* Expanded Details */}
                                                {expandedDetails.includes(item.id) && item.details && (
                                                    <tr>
                                                        <td colSpan={6} className="bg-gray-50 px-8 py-4">
                                                            <div className="space-y-2">
                                                                <h5 className="font-medium text-gray-900 mb-2">Breakdown:</h5>
                                                                {item.details.map((detail, idx) => (
                                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                                        <div>
                                                                            <span className="font-medium">{detail.subCategory}:</span>
                                                                            <span className="text-gray-600 ml-2">{detail.description}</span>
                                                                        </div>
                                                                        <span className={`font-medium ${detail.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                            {detail.amount >= 0 ? '+' : ''}${detail.amount.toFixed(0)}M
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                    </div>
                )}
            </motion.div>



            {/* Commentary Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Commentary Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Total Variances</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {bridgeDetailData.revenue.filter(item =>
                                    item.type !== 'start' && item.type !== 'end'
                                ).length}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">Requiring commentary</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Signed Off</span>
                            <span className="text-2xl font-bold text-green-600">
                                {bridgeDetailData.revenue.filter(item =>
                                    item.commentary.status === 'signed-off'
                                ).length}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">Fully approved</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Submitted</span>
                            <span className="text-2xl font-bold text-yellow-600">
                                {bridgeDetailData.revenue.filter(item =>
                                    item.commentary.status === 'submitted'
                                ).length}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">Awaiting sign-off</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Draft</span>
                            <span className="text-2xl font-bold text-orange-600">
                                {bridgeDetailData.revenue.filter(item =>
                                    item.commentary.status === 'draft' &&
                                    item.type !== 'start' &&
                                    item.type !== 'end'
                                ).length}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">Needs completion</div>
                    </div>
                </div>
            </div>
        </div>
    );
}