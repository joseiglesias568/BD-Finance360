import { motion } from 'framer-motion';
import {
    Download,
    Layers,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { getHeatmapColor } from '@/lib/engines/health-engine';
import type { ConsolePageData } from './types';

interface AnalyticsProps {
    dbData?: ConsolePageData;
}

export default function Analytics({ dbData }: AnalyticsProps) {
    const [selectedMetric, setSelectedMetric] = useState('feeRevenueGrowth');
    const [selectedView, setSelectedView] = useState('trend');
    const [selectedTimeframe, setSelectedTimeframe] = useState('12M');

    // Driver contribution analysis for Delta
    const driverContributions = {
        feeRevenueGrowth: [
            { driver: 'Fee Rate Improvement', contribution: 3.5, value: 2.0, trend: 'up' },
            { driver: 'Transaction Volume', contribution: -2.5, value: -1.0, trend: 'down' },
            { driver: 'Service Mix Shift (Advisory)', contribution: 2.2, value: 1.2, trend: 'up' },
            { driver: 'Cross-Sell Attach Rate', contribution: 1.5, value: 0.8, trend: 'up' },
            { driver: 'Capital Markets Recovery', contribution: -1.0, value: -0.5, trend: 'down' }
        ],
        segmentGrowth: [
            { driver: 'Premium Revenue', contribution: 5.2, value: 3.5, trend: 'up' },
            { driver: 'Flight Operations', contribution: 2.8, value: 1.8, trend: 'up' },
            { driver: 'Project Management', contribution: -1.5, value: -0.8, trend: 'down' },
            { driver: 'Equipment Revenue', contribution: -2.2, value: -1.5, trend: 'down' },
            { driver: 'Other Services', contribution: 0.9, value: 0.4, trend: 'up' }
        ],
        rewardsGrowth: [
            { driver: 'New Client Acquisition', contribution: 4.5, value: 2.3, trend: 'up' },
            { driver: 'Client Retention Rate', contribution: -1.2, value: -0.6, trend: 'down' },
            { driver: 'Revenue per Client', contribution: 3.1, value: 1.8, trend: 'up' },
            { driver: 'Platform Adoption Rate', contribution: 1.9, value: 0.9, trend: 'up' },
            { driver: 'Contract Renewal Rate', contribution: -0.5, value: -0.3, trend: 'down' }
        ],
        demandForecast: [
            { driver: 'Market Cycle Patterns', contribution: 3.8, value: 1.2, trend: 'up' },
            { driver: 'Regional Pipeline Activity', contribution: 2.5, value: 0.8, trend: 'up' },
            { driver: 'Interest Rate Sensitivity', contribution: -1.8, value: -0.6, trend: 'down' },
            { driver: 'Macro Economic Factors', contribution: 1.2, value: 0.4, trend: 'up' },
            { driver: 'New Service Line Launches', contribution: -0.9, value: -0.3, trend: 'down' }
        ]
    };

    // Waterfall chart data - Market share bridge
    // Revenue waterfall — use DB bridge items when available
    const waterfallData = useMemo(() => {
        const bridge = dbData?.financials?.revenueBridge;
        if (bridge && bridge.length > 0) {
            // Build waterfall from DB bridge: start = annualRevenue prior, items = bridge, end = current
            const priorRev = (dbData.financials.annualRevenue ?? 9.6) - bridge.reduce((s, b) => s + b.impact, 0);
            const items = [
                { name: 'Prior Period', value: Math.round(priorRev * 10) / 10, type: 'start' as const },
                ...bridge.map((b) => ({
                    name: b.label,
                    value: b.impact,
                    type: (b.impact >= 0 ? 'positive' : 'negative') as 'positive' | 'negative',
                })),
                { name: 'Current Period', value: dbData.financials.annualRevenue ?? 9.6, type: 'end' as const },
            ];
            return items;
        }
        return [
            { name: 'Prior Period', value: 8.7, type: 'start' as const },
            { name: 'Adjusted Revenue Growth', value: 0.3, type: 'positive' as const },
            { name: 'New Clients', value: 0.3, type: 'positive' as const },
            { name: 'Capital Markets Softness', value: -0.4, type: 'negative' as const },
            { name: 'Global Markets Growth', value: 0.2, type: 'positive' as const },
            { name: 'Current Period', value: 8.5, type: 'end' as const }
        ];
    }, [dbData]);

    // Competitive analysis data — from DB market data when available
    const competitiveData = useMemo(() => {
        const market = dbData?.market;
        if (market?.competitors && market.competitors.length > 0) {
            const companyEntry = {
                competitor: 'Delta',
                share: market.companyMarketShare,
                change: market.marketShareYoY,
            };
            const compEntries = market.competitors.map((c) => ({
                competitor: c.name,
                share: c.marketShare,
                change: c.yoyChange,
            }));
            return [companyEntry, ...compEntries.sort((a, b) => b.share - a.share)];
        }
        return [
            { competitor: 'Delta', share: 24.5, change: 0.3 },
            { competitor: 'TMUS', share: 28.1, change: 1.2 },
            { competitor: 'Cushman & Wakefield', share: 12.8, change: -0.3 },
            { competitor: 'Colliers', share: 8.5, change: 0.4 },
            { competitor: 'Savills', share: 6.2, change: 0.2 },
        ];
    }, [dbData]);

    // Segment performance heatmap — enriched from DB segments when available
    const segmentHeatmap = useMemo(() => {
        const segments = dbData?.financials?.segments;
        if (segments && segments.length > 0) {
            // Use DB segment YoY changes for the "total" column; quarterly breakdown stays hardcoded as
            // the DB currently only stores latest-quarter results (not per-quarter breakdown)
            return segments.map((seg) => ({
                segment: seg.name,
                q1: 0, q2: 0, q3: 0, q4: seg.yoyChange,
                total: seg.yoyChange,
            }));
        }
        return [
            { segment: 'Premium Revenue', q1: 4.0, q2: 5.2, q3: 6.1, q4: 6.8, total: 5.5 },
            { segment: 'Flight Operations', q1: 2.5, q2: 3.0, q3: 3.5, q4: 3.2, total: 3.1 },
            { segment: 'Project Management', q1: 3.0, q2: 4.5, q3: 5.2, q4: 5.0, total: 4.4 },
            { segment: 'Equipment Revenue', q1: -2.0, q2: -1.0, q3: 0.5, q4: 1.5, total: -0.3 },
            { segment: 'Global Markets', q1: 1.5, q2: 2.0, q3: 3.5, q4: 3.2, total: 2.6 }
        ];
    }, [dbData]);

    return (
        <div className="space-y-6">
            {/* Analytics Header with Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">Market & Demand Analytics</h3>
                        <div className="flex items-center space-x-2">
                            <select
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003B2C]"
                            >
                                <option value="feeRevenueGrowth">Adjusted Revenue Growth</option>
                                <option value="segmentGrowth">Segment Growth</option>
                                <option value="rewardsGrowth">Client Growth</option>
                                <option value="demandForecast">Market Forecast</option>
                            </select>

                            <select
                                value={selectedView}
                                onChange={(e) => setSelectedView(e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003B2C]"
                            >
                                <option value="trend">Trend Analysis</option>
                                <option value="drivers">Driver Contribution</option>
                                <option value="competitive">Competitive View</option>
                                <option value="segments">Segment Analysis</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setSelectedTimeframe('1M')}
                                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${selectedTimeframe === '1M' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                    }`}
                            >
                                1M
                            </button>
                            <button
                                onClick={() => setSelectedTimeframe('3M')}
                                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${selectedTimeframe === '3M' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                    }`}
                            >
                                3M
                            </button>
                            <button
                                onClick={() => setSelectedTimeframe('12M')}
                                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${selectedTimeframe === '12M' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                    }`}
                            >
                                12M
                            </button>
                        </div>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Driver Contribution Analysis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Key Driver Contributions</h4>
                        <span className="text-sm text-gray-500">
                            Impact on {
                                selectedMetric === 'feeRevenueGrowth' ? 'Adjusted Revenue Growth' :
                                    selectedMetric === 'segmentGrowth' ? 'Segment Growth' :
                                        selectedMetric === 'rewardsGrowth' ? 'Client Growth' :
                                            'Market Forecast'
                            }
                        </span>
                    </div>

                    <div className="space-y-3">
                        {driverContributions[selectedMetric as keyof typeof driverContributions].map((driver) => (
                            <div key={driver.driver} className="relative">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">{driver.driver}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-sm font-semibold ${driver.value > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {driver.value > 0 ? '+' : ''}{driver.value}pp
                                        </span>
                                        {driver.trend === 'up' ? (
                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 text-red-500" />
                                        )}
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${driver.contribution > 0 ? 'bg-[#003B2C]' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${Math.abs(driver.contribution) * 10}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                            Total driver impact accounts for {
                                selectedMetric === 'feeRevenueGrowth' ? '+2.0% revenue growth' :
                                    selectedMetric === 'segmentGrowth' ? '+5.2% segment growth' :
                                        selectedMetric === 'rewardsGrowth' ? '+4.0% client growth' :
                                            '+3.2% forecast accuracy improvement'
                            }
                        </p>
                    </div>
                </motion.div>

                {/* Waterfall Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Market Share Bridge Analysis</h4>
                        <span className="text-sm text-gray-500">{selectedTimeframe} Performance</span>
                    </div>

                    <div className="relative h-64">
                        <div className="absolute inset-0 flex items-end justify-between space-x-2">
                            {waterfallData.map((item, index) => {
                                const isStart = item.type === 'start';
                                const isEnd = item.type === 'end';
                                const height = Math.abs(item.value) * 10;

                                return (
                                    <div key={item.name} className="flex-1 flex flex-col items-center">
                                        <div className="relative w-full">
                                            <div
                                                className={`w-full rounded-t-lg transition-all ${isStart || isEnd ? 'bg-[#003B2C]' :
                                                    item.type === 'positive' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}
                                                style={{ height: `${height}px` }}
                                            >
                                                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                                                    {item.value > 0 ? '+' : ''}{item.value}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2 text-center">{item.name}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Competitive Landscape */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Competitive Market Share</h4>
                        <button className="text-sm text-[#003B2C] hover:text-[#007A3D] font-medium">
                            View Details
                        </button>
                    </div>

                    <div className="space-y-3">
                        {competitiveData.map((comp) => (
                            <div key={comp.competitor} className="relative">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium ${comp.competitor === 'Delta' ? 'text-[#003B2C]' : 'text-gray-700'
                                        }`}>
                                        {comp.competitor}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-semibold text-gray-900">{comp.share}%</span>
                                        <span className={`text-xs ${comp.change > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {comp.change > 0 ? '+' : ''}{comp.change}%
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all ${comp.competitor === 'Delta' ? 'bg-[#003B2C]' : 'bg-gray-400'
                                            }`}
                                        style={{ width: `${comp.share * 8}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Segment Performance Heatmap */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Segment Adjusted Revenue Growth Heatmap</h4>
                        <span className="text-sm text-gray-500">Quarterly Performance (%)</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-gray-600">
                                    <th className="text-left py-2">Region</th>
                                    <th className="text-center px-2">Q1</th>
                                    <th className="text-center px-2">Q2</th>
                                    <th className="text-center px-2">Q3</th>
                                    <th className="text-center px-2">Q4</th>
                                    <th className="text-center px-2 font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {segmentHeatmap.map((segment) => (
                                    <tr key={segment.segment} className="border-t border-gray-100">
                                        <td className="py-2 text-sm font-medium text-gray-700">{segment.segment}</td>
                                        <td className="text-center px-2">
                                            <div className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getHeatmapColor(segment.q1)}`}>
                                                {segment.q1 > 0 ? '+' : ''}{segment.q1}
                                            </div>
                                        </td>
                                        <td className="text-center px-2">
                                            <div className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getHeatmapColor(segment.q2)}`}>
                                                {segment.q2 > 0 ? '+' : ''}{segment.q2}
                                            </div>
                                        </td>
                                        <td className="text-center px-2">
                                            <div className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getHeatmapColor(segment.q3)}`}>
                                                {segment.q3 > 0 ? '+' : ''}{segment.q3}
                                            </div>
                                        </td>
                                        <td className="text-center px-2">
                                            <div className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getHeatmapColor(segment.q4)}`}>
                                                {segment.q4 > 0 ? '+' : ''}{segment.q4}
                                            </div>
                                        </td>
                                        <td className="text-center px-2">
                                            <div className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${getHeatmapColor(segment.total)}`}>
                                                {segment.total > 0 ? '+' : ''}{segment.total}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                            Wireless Service Revenue showing strongest growth trajectory; Equipment Revenue recovering
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Driver Insights Panel — sourced from DB market + strategic data */}
            <div className="bg-gradient-to-r from-[#F0F0F0] to-emerald-50 rounded-xl p-6 border border-[#003B2C]/20">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-[#003B2C]" />
                    Driver-Based Insights & Recommendations
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    {/* Top driver from market drivers */}
                    <div className="bg-white rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Top Market Driver</h5>
                        <p className="text-lg font-semibold text-gray-900">
                            {dbData?.market?.marketDrivers?.[0] ?? 'Premium Revenue Fee Growth'}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                            {dbData?.market?.regionalBreakdown?.[0]
                                ? `+${dbData.market.regionalBreakdown[0].growth}% growth`
                                : '+5.2pp contribution'}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            {dbData?.market?.marketDrivers?.[1] ?? 'Continue investing in premium revenue capabilities and cross-sell infrastructure'}
                        </p>
                    </div>
                    {/* Biggest challenge from market challenges */}
                    <div className="bg-white rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Biggest Risk Factor</h5>
                        <p className="text-lg font-semibold text-gray-900">
                            {dbData?.market?.marketChallenges?.[0] ?? 'Capital Markets Cyclicality'}
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                            {dbData?.strategic?.risks?.[0]
                                ? dbData.strategic.risks[0].impact
                                : '-$150M revenue risk from volume decline'}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            {dbData?.strategic?.risks?.[0]?.mitigation ?? 'Diversify revenue mix and accelerate recurring revenue streams'}
                        </p>
                    </div>
                    {/* Top opportunity from strategic key opportunities */}
                    <div className="bg-white rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Emerging Opportunity</h5>
                        <p className="text-lg font-semibold text-gray-900">
                            {dbData?.strategic?.keyOpportunities?.[0]?.title ?? 'Digital Platform Monetization'}
                        </p>
                        <p className="text-sm text-[#003B2C] mt-1">
                            {dbData?.strategic?.keyOpportunities?.[0]?.revenueImpact ?? '+$300M incremental revenue potential'}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            {dbData?.strategic?.keyOpportunities?.[0]?.description ?? 'Scale AMI digital platform and AI-powered analytics across Missouri/Illinois customer base'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}