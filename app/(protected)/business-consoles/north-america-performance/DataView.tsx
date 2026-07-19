import {
    ArrowDown,
    ArrowUp,
    Bookmark,
    Calendar,
    ChevronDown,
    ChevronRight,
    Download,
    ExternalLink,
    Filter,
    MessageSquare,
    Minus,
    Save,
    Table
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import type { ConsolePageData } from './types';

interface DataViewProps {
    dbData?: ConsolePageData;
}

export default function DataView({ dbData }: DataViewProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['market-share']));
    const [selectedTimeRange, setSelectedTimeRange] = useState('YTD');
    const [selectedView, setSelectedView] = useState('actual');
    const [expandedPLCategories, setExpandedPLCategories] = useState<Set<string>>(new Set());
    const [showNotes, setShowNotes] = useState(false);
    const [savedToast, setSavedToast] = useState(false);

    // Build P&L Data from DB financials.plSummary when available
    const plData = React.useMemo(() => {
        const pl = dbData?.financials?.plSummary;
        const quarters = dbData?.financials?.quarters ?? [];

        // Helper: create quarterly values from a PLLineItem
        const plLineToQuarterValues = (item: { actual: number; plan: number; priorYear: number; variancePercent: number }) => {
            // Spread across quarters if available, otherwise use the single value
            return quarters.length > 0
                ? quarters.map((q, idx) => ({
                    month: q.quarter,
                    actual: idx < quarters.length - 1 ? (item.actual / quarters.length).toFixed(1) : (item.actual / quarters.length).toFixed(1),
                    forecast: (item.plan / (quarters.length || 1)).toFixed(1),
                    variance: item.variancePercent.toFixed(1),
                    isActual: true,
                }))
                : [{ month: 'Total', actual: item.actual.toFixed(1), forecast: item.plan.toFixed(1), variance: item.variancePercent.toFixed(1), isActual: true }];
        };

        if (pl) {
            return {
                'revenue': {
                    name: 'Net Revenues',
                    rows: [
                        { name: 'Total Net Revenues', isTotal: true },
                        { name: 'Net Revenues', values: plLineToQuarterValues(pl.revenue) },
                    ]
                },
                'storeOperating': {
                    name: 'Cost of Goods Sold',
                    rows: [
                        { name: 'Total COGS', isTotal: true },
                        { name: 'Cost of Goods Sold', values: plLineToQuarterValues(pl.cogs) },
                    ]
                },
                'corporateCosts': {
                    name: 'Operating Expenses',
                    rows: [
                        { name: 'Total Operating Expenses', isTotal: true },
                        { name: 'Operating Expenses', values: plLineToQuarterValues(pl.operatingExpenses) },
                    ]
                },
                'profitability': {
                    name: 'Profitability',
                    rows: [
                        { name: 'Gross Profit', isCalculated: true, values: plLineToQuarterValues(pl.grossProfit) },
                        { name: 'Operating Income', isCalculated: true, values: plLineToQuarterValues(pl.operatingIncome) },
                        { name: 'Net Income', isTotal: true, values: plLineToQuarterValues(pl.netIncome) }
                    ]
                }
            };
        }

        // Fallback to generated data
        function generateMonthlyData(min: number, max: number) {
            const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
            return months.map((month, index) => ({
                month,
                actual: index < 10 ? (Math.random() * (max - min) + min).toFixed(1) : null,
                forecast: (Math.random() * (max - min) + min).toFixed(1),
                variance: index < 10 ? ((Math.random() - 0.5) * 10).toFixed(1) : null,
                isActual: index < 10
            }));
        }

        return {
            'revenue': {
                name: 'Net Revenues',
                rows: [
                    { name: 'Total Net Revenues', isTotal: true },
                    { name: 'Premium Revenue Revenue', values: generateMonthlyData(6800, 7200) },
                    { name: 'Operations Revenue', values: generateMonthlyData(1100, 1300) },
                    { name: 'Other Revenue', values: generateMonthlyData(400, 500) },
                    { name: 'Equipment Revenue', values: generateMonthlyData(420, 480) }
                ]
            },
            'storeOperating': {
                name: 'Direct Operating Costs',
                rows: [
                    { name: 'Total Direct Operating Costs', isTotal: true },
                    { name: 'Cost of Services (COGS)', values: generateMonthlyData(-2800, -3100) },
                    { name: 'Professional Staff Costs', values: generateMonthlyData(-2200, -2400) },
                    { name: 'Occupancy Costs', values: generateMonthlyData(-680, -720) },
                    { name: 'Other Operating Expenses', values: generateMonthlyData(-450, -520) }
                ]
            },
            'corporateCosts': {
                name: 'Corporate & Other Costs',
                rows: [
                    { name: 'Total Corporate Costs', isTotal: true },
                    { name: 'Depreciation & Amortization', values: generateMonthlyData(-480, -520) },
                    { name: 'General & Administrative', values: generateMonthlyData(-560, -620) },
                    { name: 'Restructuring & Integration', values: generateMonthlyData(-45, -80) },
                    { name: 'Interest Expense (Net)', values: generateMonthlyData(-120, -135) },
                    { name: 'Income Tax Provision', values: generateMonthlyData(-180, -220) }
                ]
            },
            'profitability': {
                name: 'Profitability',
                rows: [
                    { name: 'Gross Profit', isCalculated: true },
                    { name: 'Operating Income', isCalculated: true },
                    { name: 'EBITDA', isCalculated: true },
                    { name: 'Net Income', isTotal: true }
                ]
            }
        };
    }, [dbData]);

    // Driver-based data structure — sourced from DB console drivers when available
    const driverData = React.useMemo(() => {
        const naDrivers = dbData?.naConsole?.keyDrivers;
        const segments = dbData?.financials?.segments;

        // Build market-share section from console drivers
        const marketShareMetrics = naDrivers && naDrivers.length > 0
            ? naDrivers.map((driver) => ({
                driver: driver.name,
                subDrivers: driver.metrics.map((m) => {
                    const actual = parseFloat(m.currentValue) || 0;
                    const target = parseFloat(m.target) || 0;
                    const variance = parseFloat((actual - target).toFixed(2));
                    const trend = m.direction === 'up' ? 'up' : m.direction === 'down' ? 'down' : 'stable';
                    return { name: m.name, actual, plan: target, variance, trend };
                })
            }))
            : [
                {
                    driver: 'Client Pipeline & Transactions',
                    subDrivers: [
                        { name: 'Deal Volume Growth', actual: -1.0, plan: 2.0, variance: -3.0, trend: 'down' },
                        { name: 'Digital Platform Adoption %', actual: 31, plan: 35, variance: -4, trend: 'up' },
                        { name: 'Avg Deal Cycle (days)', actual: 245, plan: 220, variance: 25, trend: 'down' }
                    ]
                },
                {
                    driver: 'Client Engagement',
                    subDrivers: [
                        { name: 'Active Client Accounts (K)', actual: 34.6, plan: 36, variance: -1.4, trend: 'up' },
                        { name: 'Top 200 Account Revenue %', actual: 57, plan: 60, variance: -3, trend: 'up' },
                        { name: 'Avg Revenue per Client ($K)', actual: 7.85, plan: 7.50, variance: 0.35, trend: 'up' }
                    ]
                },
                {
                    driver: 'Competitive Position',
                    subDrivers: [
                        { name: 'Brand Perception Index', actual: 78, plan: 82, variance: -4, trend: 'stable' },
                        { name: 'Value Perception Score', actual: 62, plan: 72, variance: -10, trend: 'down' },
                        { name: 'NPS Score', actual: 42, plan: 55, variance: -13, trend: 'stable' }
                    ]
                }
            ];

        // Build segment performance from DB segments
        const segmentMetrics = segments && segments.length > 0
            ? segments.map((seg) => ({
                driver: seg.name,
                subDrivers: [
                    { name: 'Revenue ($B)', actual: seg.revenue, plan: seg.revenue * (1 - seg.yoyChange / 100), variance: parseFloat((seg.revenue * (seg.yoyChange / 100)).toFixed(2)), trend: seg.yoyChange >= 0 ? 'up' : 'down' },
                    { name: 'YoY Change (%)', actual: seg.yoyChange, plan: 0, variance: seg.yoyChange, trend: seg.yoyChange >= 0 ? 'up' : 'down' },
                    { name: 'Operating Margin (%)', actual: seg.operatingMargin ?? 0, plan: 0, variance: 0, trend: 'stable' }
                ]
            }))
            : [
                {
                    driver: 'North America',
                    subDrivers: [
                        { name: 'Revenue ($B)', actual: 27.01, plan: 26.5, variance: 0.51, trend: 'up' },
                        { name: 'Adjusted Revenue Growth (%)', actual: 1.0, plan: 2.0, variance: -1.0, trend: 'up' },
                        { name: 'Operating Margin (%)', actual: 18.2, plan: 19.0, variance: -0.8, trend: 'stable' }
                    ]
                },
                {
                    driver: 'International',
                    subDrivers: [
                        { name: 'Revenue ($B)', actual: 7.34, plan: 7.8, variance: -0.46, trend: 'down' },
                        { name: 'Adjusted Revenue Growth (%)', actual: -2.0, plan: 1.0, variance: -3.0, trend: 'down' },
                        { name: 'Operating Margin (%)', actual: 12.5, plan: 14.0, variance: -1.5, trend: 'down' }
                    ]
                },
                {
                    driver: 'Equipment Revenue',
                    subDrivers: [
                        { name: 'Revenue ($B)', actual: 1.77, plan: 1.9, variance: -0.13, trend: 'down' },
                        { name: 'Growth Rate (%)', actual: -6.0, plan: 2.0, variance: -8.0, trend: 'down' },
                        { name: 'Operating Margin (%)', actual: 52.0, plan: 50.0, variance: 2.0, trend: 'up' }
                    ]
                }
            ];

        return {
            'market-share': {
                name: 'Market Share Drivers',
                metrics: marketShareMetrics
            },
            'segment-performance': {
                name: 'Segment Performance',
                metrics: segmentMetrics
            },
            'demand-forecast': {
                name: 'Demand Forecast Accuracy',
                metrics: [
                    {
                        driver: 'Property-Level Forecasting',
                        subDrivers: [
                            { name: 'Weekly Forecast Accuracy (%)', actual: 92.5, plan: 95.0, variance: -2.5, trend: 'up' },
                            { name: 'Waste Reduction (%)', actual: 8.2, plan: 6.0, variance: -2.2, trend: 'up' },
                            { name: 'Out-of-Stock Rate (%)', actual: 2.1, plan: 1.5, variance: -0.6, trend: 'stable' }
                        ]
                    },
                    {
                        driver: 'Regional Forecasts',
                        subDrivers: [
                            { name: 'U.S. Accuracy (%)', actual: 94.2, plan: 96.0, variance: -1.8, trend: 'up' },
                            { name: 'China Accuracy (%)', actual: 86.5, plan: 92.0, variance: -5.5, trend: 'down' },
                            { name: 'International Accuracy (%)', actual: 91.8, plan: 94.0, variance: -2.2, trend: 'stable' }
                        ]
                    }
                ]
            }
        };
    }, [dbData]);

    // Quarterly trend data — built from DB quarters when available
    const monthlyData = React.useMemo(() => {
        const quarters = dbData?.financials?.quarters;
        const mktShare = dbData?.market?.companyMarketShare ?? 8.5;
        if (quarters && quarters.length > 0) {
            return quarters.map((q) => ({
                month: q.quarter,
                marketShare: mktShare,
                aum: 0,
                feeGrowth: q.feeRevenueGrowth,
                forecastAcc: 0,
            }));
        }
        // Fallback
        return [
            { month: 'Oct', marketShare: 8.8, aum: 32.1, feeGrowth: -4.0, forecastAcc: 89.5 },
            { month: 'Nov', marketShare: 8.7, aum: 32.5, feeGrowth: -3.5, forecastAcc: 90.1 },
            { month: 'Dec', marketShare: 8.7, aum: 32.8, feeGrowth: -3.0, forecastAcc: 90.8 },
            { month: 'Jan', marketShare: 8.6, aum: 33.0, feeGrowth: -2.0, forecastAcc: 91.2 },
            { month: 'Feb', marketShare: 8.6, aum: 33.2, feeGrowth: -1.5, forecastAcc: 91.5 },
            { month: 'Mar', marketShare: 8.5, aum: 33.5, feeGrowth: -1.0, forecastAcc: 91.8 },
            { month: 'Apr', marketShare: 8.5, aum: 33.7, feeGrowth: -0.5, forecastAcc: 92.0 },
            { month: 'May', marketShare: 8.5, aum: 33.9, feeGrowth: 0.0, forecastAcc: 92.2 },
            { month: 'Jun', marketShare: 8.5, aum: 34.1, feeGrowth: 0.5, forecastAcc: 92.5 },
            { month: 'Jul', marketShare: 8.5, aum: 34.6, feeGrowth: 1.0, forecastAcc: 92.0 }
        ];
    }, [dbData]);

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const togglePLCategory = (category: string) => {
        const newExpanded = new Set(expandedPLCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedPLCategories(newExpanded);
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <ArrowUp className="w-3 h-3 text-green-500" />;
            case 'down':
                return <ArrowDown className="w-3 h-3 text-red-500" />;
            default:
                return <Minus className="w-3 h-3 text-gray-400" />;
        }
    };

    const getVarianceColor = (variance: number) => {
        if (variance > 0) return 'text-green-600';
        if (variance < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">Market & Demand Data View</h3>
                        <div className="flex items-center space-x-2">
                            <select
                                value={selectedView}
                                onChange={(e) => setSelectedView(e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c519c]"
                            >
                                <option value="actual">Actual vs Plan</option>
                                <option value="trend">Trend Analysis</option>
                                <option value="variance">Variance Analysis</option>
                                <option value="forecast">Forecast View</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setSelectedTimeRange('MTD')}
                                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${selectedTimeRange === 'MTD' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                    }`}
                            >
                                MTD
                            </button>
                            <button
                                onClick={() => setSelectedTimeRange('QTD')}
                                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${selectedTimeRange === 'QTD' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                    }`}
                            >
                                QTD
                            </button>
                            <button
                                onClick={() => setSelectedTimeRange('YTD')}
                                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${selectedTimeRange === 'YTD' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                                    }`}
                            >
                                YTD
                            </button>
                        </div>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comprehensive P&L-Style Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">Delta Financial Performance by Month</h4>
                    <p className="text-sm text-gray-600 mt-1">All values in millions ($M) - Fiscal Year ending September</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-3 px-4 font-medium text-gray-700 w-48">Item</th>
                                <th className="text-center py-3 px-4 font-medium text-gray-700 border-l border-gray-200" colSpan={2}>
                                    <div className="flex items-center justify-center space-x-1">
                                        <span className="w-2 h-2 bg-[#1c519c] rounded-full"></span>
                                        <span>Actual</span>
                                    </div>
                                    Q1 FY25
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-700 border-l border-gray-200" colSpan={2}>
                                    <div className="flex items-center justify-center space-x-1">
                                        <span className="w-2 h-2 bg-[#1c519c] rounded-full"></span>
                                        <span>Actual</span>
                                    </div>
                                    Q2 FY25
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-700 border-l border-gray-200" colSpan={2}>
                                    <div className="flex items-center justify-center space-x-1">
                                        <span className="w-2 h-2 bg-[#1c519c] rounded-full"></span>
                                        <span>Actual</span>
                                    </div>
                                    Q3 FY25
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-700 border-l border-gray-200" colSpan={2}>
                                    <div className="flex items-center justify-center space-x-1">
                                        <span className="w-2 h-2 bg-[#1c519c] rounded-full"></span>
                                        <span>Actual</span>
                                    </div>
                                    Q4 FY25
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-700 border-l border-gray-200" colSpan={2}>
                                    <div className="flex items-center justify-center space-x-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                        <span>Forecast</span>
                                    </div>
                                    Q1 FY26
                                </th>
                                <th className="text-center py-3 px-4 font-medium text-gray-700 border-l border-gray-200" colSpan={2}>
                                    <div className="flex items-center justify-center space-x-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                        <span>Forecast</span>
                                    </div>
                                    Q2 FY26
                                </th>
                            </tr>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="text-left py-2 px-4 font-medium text-gray-600"></th>
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <React.Fragment key={i}>
                                        <th className="text-right py-2 px-2 font-medium text-gray-600 border-l border-gray-200">Act/Fcst</th>
                                        <th className="text-right py-2 px-2 font-medium text-gray-600">Var</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(plData).map(([categoryKey, category]) => (
                                <React.Fragment key={categoryKey}>
                                    <tr className="bg-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => togglePLCategory(categoryKey)}>
                                        <td className="py-2 px-4 font-semibold text-gray-900 flex items-center">
                                            {expandedPLCategories.has(categoryKey) ? (
                                                <ChevronDown className="w-4 h-4 mr-2" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 mr-2" />
                                            )}
                                            {category.name}
                                        </td>
                                        {(() => {
                                            // Use first data row with values for the summary
                                            const dataRow = category.rows.find(r => 'values' in r && r.values);
                                            const vals = dataRow && 'values' in dataRow ? (dataRow as any).values?.slice(0, 6) : null;
                                            if (vals && vals.length > 0) {
                                                return vals.map((v: any, i: number) => (
                                                    <React.Fragment key={i}>
                                                        <td className="text-right py-2 px-2 font-semibold text-gray-900 border-l border-gray-200">
                                                            {v.actual ?? v.forecast ?? '-'}
                                                        </td>
                                                        <td className={`text-right py-2 px-2 font-medium ${v.variance && parseFloat(v.variance) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {v.variance ? `${v.variance}%` : '-'}
                                                        </td>
                                                    </React.Fragment>
                                                ));
                                            }
                                            return [1, 2, 3, 4, 5, 6].map((i) => (
                                                <React.Fragment key={i}>
                                                    <td className="text-right py-2 px-2 font-semibold text-gray-900 border-l border-gray-200">-</td>
                                                    <td className="text-right py-2 px-2 font-medium text-gray-600">-</td>
                                                </React.Fragment>
                                            ));
                                        })()}
                                    </tr>
                                    {expandedPLCategories.has(categoryKey) && category.rows.map((row, idx) => (
                                        <tr key={idx} className={`hover:bg-gray-50 ${row.isTotal ? 'font-semibold bg-gray-100' :
                                                'isSubtotal' in row && row.isSubtotal ? 'font-medium' : ''
                                            }`}>
                                            <td className={`py-1.5 px-4 text-gray-700 ${row.isTotal || ('isSubtotal' in row && row.isSubtotal) ? '' : 'pl-8'
                                                }`}>
                                                {row.name}
                                            </td>
                                            {'values' in row && row.values ? row.values.slice(0, 6).map((val, i) => (
                                                <React.Fragment key={i}>
                                                    <td className="text-right py-1.5 px-2 text-gray-900 border-l border-gray-100">
                                                        {val.actual || val.forecast}
                                                    </td>
                                                    <td className={`text-right py-1.5 px-2 ${val.variance && parseFloat(val.variance) > 0 ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {val.variance ? `${val.variance}%` : '-'}
                                                    </td>
                                                </React.Fragment>
                                            )) : (
                                                [1, 2, 3, 4, 5, 6].map((i) => (
                                                    <React.Fragment key={i}>
                                                        <td className="text-right py-1.5 px-2 text-gray-900 border-l border-gray-100">
                                                            -
                                                        </td>
                                                        <td className="text-right py-1.5 px-2">
                                                            -
                                                        </td>
                                                    </React.Fragment>
                                                ))
                                            )}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                            {(() => {
                                const quarters = dbData?.financials?.quarters ?? [];
                                const opMargin = dbData?.financials?.annualOperatingMargin ?? null;
                                const cols = quarters.length > 0 ? quarters.slice(0, 6) : [null, null, null, null, null, null];
                                return (
                                    <tr className="bg-[#1c519c] text-white font-semibold">
                                        <td className="py-3 px-4">Operating Margin (%)</td>
                                        {cols.map((q, i) => (
                                            <React.Fragment key={i}>
                                                <td className="text-right py-3 px-2 border-l border-[#2D4B43]">
                                                    {q ? `${q.operatingMargin.toFixed(1)}%` : opMargin != null ? `${opMargin.toFixed(1)}%` : '-'}
                                                </td>
                                                <td className="text-right py-3 px-2 text-gray-300">-</td>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                );
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Driver-Based Data Tables */}
            <div className="space-y-4">
                {Object.entries(driverData).map(([key, category]) => (
                    <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCategory(key)}
                            className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-3">
                                {expandedCategories.has(key) ? (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                )}
                                <h4 className="font-semibold text-gray-900">{category.name}</h4>
                            </div>
                            <span className="text-sm text-gray-500">{category.metrics.length} drivers</span>
                        </button>

                        {/* Expanded Content */}
                        {expandedCategories.has(key) && (
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Driver / Sub-Driver
                                                </th>
                                                <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Actual
                                                </th>
                                                <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Plan
                                                </th>
                                                <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Variance
                                                </th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Trend
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {category.metrics.map((metric, idx) => (
                                                <React.Fragment key={`${key}-${idx}`}>
                                                    <tr className="border-b border-gray-100 bg-gray-50">
                                                        <td className="py-3 px-4 font-medium text-sm text-gray-900">
                                                            {metric.driver}
                                                        </td>
                                                        <td className="text-right py-3 px-4 text-sm text-gray-700">-</td>
                                                        <td className="text-right py-3 px-4 text-sm text-gray-700">-</td>
                                                        <td className="text-right py-3 px-4 text-sm text-gray-700">-</td>
                                                        <td className="text-center py-3 px-4">-</td>
                                                    </tr>
                                                    {metric.subDrivers.map((subDriver, subIdx) => (
                                                        <tr key={`${key}-${idx}-${subIdx}`} className="border-b border-gray-50 hover:bg-gray-50">
                                                            <td className="py-3 px-4 pl-8 text-sm text-gray-700">
                                                                {subDriver.name}
                                                            </td>
                                                            <td className="text-right py-3 px-4 text-sm font-medium text-gray-900">
                                                                {subDriver.actual}
                                                                {subDriver.name.includes('Rate') || subDriver.name.includes('Score') || subDriver.name.includes('Accuracy') || subDriver.name.includes('Margin') || subDriver.name.includes('%') ? '%' : ''}
                                                            </td>
                                                            <td className="text-right py-3 px-4 text-sm text-gray-600">
                                                                {subDriver.plan}
                                                                {subDriver.name.includes('Rate') || subDriver.name.includes('Score') || subDriver.name.includes('Accuracy') || subDriver.name.includes('Margin') || subDriver.name.includes('%') ? '%' : ''}
                                                            </td>
                                                            <td className={`text-right py-3 px-4 text-sm font-medium ${getVarianceColor(subDriver.variance)}`}>
                                                                {subDriver.variance > 0 ? '+' : ''}{subDriver.variance}
                                                                {subDriver.name.includes('Rate') || subDriver.name.includes('Score') || subDriver.name.includes('Accuracy') || subDriver.name.includes('Margin') || subDriver.name.includes('%') ? '%' : ''}
                                                            </td>
                                                            <td className="text-center py-3 px-4">
                                                                {getTrendIcon(subDriver.trend)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Monthly Trend Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Monthly Performance Trends</h4>
                    <button className="text-sm text-[#1c519c] hover:text-[#1c519c] font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        View Full History
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Month
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Market Share (%)
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    AUM ($B)
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                    Adjusted Revenue Growth (%)
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Forecast Acc (%)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyData.map((month, idx) => (
                                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{month.month}</td>
                                    <td className="text-right py-3 px-4 text-sm text-gray-900">{month.marketShare}</td>
                                    <td className="text-right py-3 px-4 text-sm text-gray-900">{month.aum}</td>
                                    <td className={`text-right py-3 px-4 text-sm font-medium ${month.feeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {month.feeGrowth > 0 ? '+' : ''}{month.feeGrowth}
                                    </td>
                                    <td className="text-right py-3 px-4 text-sm text-gray-900">{month.forecastAcc}</td>
                                </tr>
                            ))}
                            {(() => {
                                const n = monthlyData.length || 1;
                                const avgMktShare = parseFloat((monthlyData.reduce((s, m) => s + m.marketShare, 0) / n).toFixed(1));
                                const avgAum = parseFloat((monthlyData.reduce((s, m) => s + m.aum, 0) / n).toFixed(1));
                                const avgFeeGrowth = parseFloat((monthlyData.reduce((s, m) => s + m.feeGrowth, 0) / n).toFixed(1));
                                const avgForecast = parseFloat((monthlyData.reduce((s, m) => s + m.forecastAcc, 0) / n).toFixed(1));
                                return (
                                    <tr className="bg-gray-50 font-semibold">
                                        <td className="py-3 px-4 text-sm text-gray-900">Average</td>
                                        <td className="text-right py-3 px-4 text-sm text-gray-900">{avgMktShare}</td>
                                        <td className="text-right py-3 px-4 text-sm text-gray-900">{avgAum}</td>
                                        <td className={`text-right py-3 px-4 text-sm ${avgFeeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>{avgFeeGrowth}</td>
                                        <td className="text-right py-3 px-4 text-sm text-gray-900">{avgForecast}</td>
                                    </tr>
                                );
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Analyst Toolbar — Export, Save View, Notes */}
            <div className="bg-gradient-to-r from-[#F0F0F0] to-emerald-50 rounded-xl p-6 border border-[#1c519c]/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Analyst Tools</h4>
                        <p className="text-sm text-gray-600">Export, annotate, and drill into detailed reports</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                            <Table className="w-4 h-4 mr-2" />
                            Export to Excel
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Export to PDF
                        </button>
                        <button
                            onClick={() => { setSavedToast(true); setTimeout(() => setSavedToast(false), 2000); }}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {savedToast ? 'View Saved!' : 'Save View'}
                        </button>
                        <button
                            onClick={() => setShowNotes(!showNotes)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center ${showNotes ? 'bg-[#1c519c] text-white border-[#1c519c]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Notes
                        </button>
                    </div>
                </div>
            </div>

            {/* Analyst Notes Panel */}
            {showNotes && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2 text-[#1c519c]" />
                            Analyst Notes
                        </h4>
                        <span className="text-xs text-gray-400">Auto-saved</span>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-yellow-800">Sarah Johnson — Mar 5, 2026</span>
                                <span className="text-xs text-yellow-600">Q1 Close</span>
                            </div>
                            <p className="text-sm text-yellow-900">Revenue variance driven primarily by 2.1% ticket increase from January pricing action. Transaction count still showing -0.8% drag from reduced morning traffic. Need to flag for CFO in MOR section 2.</p>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-blue-800">Mike Chen — Mar 3, 2026</span>
                                <span className="text-xs text-blue-600">Data Validation</span>
                            </div>
                            <p className="text-sm text-blue-900">Verified comp sales against POS daily extracts. Small discrepancy (~$2.1M) in Southwest region — reconciliation ticket JIRA-4521 open with data engineering.</p>
                        </div>
                        <textarea
                            placeholder="Add a note..."
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1c519c] focus:border-[#1c519c] resize-none"
                            rows={2}
                        />
                    </div>
                </div>
            )}

            {/* Drill to Reports */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                        <Bookmark className="w-4 h-4 mr-2 text-[#1c519c]" />
                        Drill to Detailed Reports
                    </h4>
                    <Link href="/report-hub" className="text-sm text-[#1c519c] hover:underline">
                        Browse Report Hub
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { id: 'fin-1', name: 'Monthly P&L Statement', desc: 'Full GL-level P&L with variance analysis' },
                        { id: 'fin-2', name: 'Revenue by Segment', desc: 'NA, International, Channel Dev breakdown' },
                        { id: 'fin-6', name: 'Property-Level P&L', desc: 'Individual property profitability detail' },
                    ].map(report => (
                        <Link
                            key={report.id}
                            href={`/report-hub/${report.id}`}
                            className="group flex items-center space-x-3 bg-gray-50 hover:bg-[#F0F0F0]/30 border border-gray-200 hover:border-[#1c519c]/30 rounded-lg p-3 transition-all"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 group-hover:text-[#1c519c]">{report.name}</div>
                                <div className="text-xs text-gray-500 truncate">{report.desc}</div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#1c519c] flex-shrink-0" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}