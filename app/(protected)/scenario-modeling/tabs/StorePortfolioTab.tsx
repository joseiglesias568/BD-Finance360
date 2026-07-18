'use client';

import { market } from '@/config/clients/cvs/market';
import { CHART_COLORS, CHART_TOOLTIP_DARK, CHART_GRID_STYLE, CHART_AXIS_STYLE } from '@/lib/chart-theme';
import { motion } from 'framer-motion';
import {
    MapPin,
    TrendingUp,
    TrendingDown,
    Sparkles,
} from 'lucide-react';
import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, ComposedChart,
} from 'recharts';

interface StorePortfolioTabProps {
    leverValues: Record<string, number>;
    onLeverChange: (id: string, value: number) => void;
}

// ─── Calculation Engine ─────────────────────────────────────────────────────
function calculatePCWPortfolioImpact(values: Record<string, number>) {
    const sameStoreRxGrowth     = values['same-store-rx-growth'] ?? 7.0;       // %
    const healthHubCount        = values['healthhub-conversion-count'] ?? 1500; // stores
    const glp1MarketShare       = values['glp1-market-share-pct'] ?? 29;        // %
    const reimbursementHeadwind = values['reimbursement-headwind-m'] ?? -45;    // $M/quarter
    const storeOptSavings       = values['store-optimization-savings'] ?? 150;  // $M annual
    const minuteClinicVisits    = values['minuteclinic-visits'] ?? 2800;        // K visits/quarter

    // PCW base metrics
    const pcwBaseRevenue = 26500;          // $M quarterly PCW revenue (Q1 2026 annualized)
    const rxBaseVolume = 451200;           // K prescriptions (Q1 2026 quarterly)
    const rxBaseRevenue = 21500;           // $M quarterly Rx revenue
    const baseHealthHubs = 1500;           // current HealthHUB count
    const baseGlp1Share = 29;             // % Q1 2026
    const baseClinicVisits = 2800;         // K visits/quarter

    // Same-store Rx growth: on $21.5B quarterly Rx revenue
    const rxGrowthRevenue = rxBaseRevenue * (sameStoreRxGrowth / 100);

    // HealthHUB premium: +15% revenue vs. standard store, $3M avg annual revenue uplift per conversion
    const hubDelta = healthHubCount - baseHealthHubs;
    const hubRevenue = hubDelta * 3 * 0.25; // quarterly portion of $3M/store annual delta
    const hubAOI = hubRevenue * 0.12; // ~12% margin on incremental HealthHUB revenue

    // GLP-1 market share: each 1pp on ~$120B annual US GLP-1 market at 29% CVS share
    // ~$34.8B addressable × 1pp share = +$348M annual CVS revenue (low margin: ~3-4% net)
    const glp1ShareDelta = glp1MarketShare - baseGlp1Share;
    const glp1Revenue = glp1ShareDelta * 87; // $87M per 1pp quarterly
    const glp1AOI = glp1Revenue * 0.035; // ~3.5% net margin on GLP-1 (high ingredient cost)

    // Reimbursement headwind: quarterly impact (negative = headwind)
    const reimbAOI = reimbursementHeadwind; // direct AOI impact

    // Store optimization savings: direct annual AOI benefit (quarterly portion)
    const optSavingsAOI = storeOptSavings * 0.25;

    // MinuteClinic: each 100K visits at $95 avg revenue = $9.5M quarterly revenue at 20% margin
    const clinicVisitDelta = minuteClinicVisits - baseClinicVisits;
    const clinicRevenue = (clinicVisitDelta / 100) * 9.5;
    const clinicAOI = clinicRevenue * 0.20;

    const totalRevenueImpact = rxGrowthRevenue + hubRevenue + glp1Revenue + clinicRevenue;
    const totalAOI = rxGrowthRevenue * 0.045 + hubAOI + glp1AOI + reimbAOI + optSavingsAOI + clinicAOI;
    const marginImpactBps = Math.round((totalAOI / pcwBaseRevenue) * 10000);

    return {
        totalRevenueImpact: Math.round(totalRevenueImpact),
        totalAOI: Math.round(totalAOI),
        marginImpactBps,
        healthHubCount,
        glp1MarketShare,
        minuteClinicVisits,
        components: {
            rxGrowthRevenue: Math.round(rxGrowthRevenue),
            rxGrowthAOI: Math.round(rxGrowthRevenue * 0.045),
            hubRevenue: Math.round(hubRevenue),
            hubAOI: Math.round(hubAOI),
            glp1Revenue: Math.round(glp1Revenue),
            glp1AOI: Math.round(glp1AOI),
            reimbAOI: Math.round(reimbAOI),
            optSavingsAOI: Math.round(optSavingsAOI),
            clinicRevenue: Math.round(clinicRevenue),
            clinicAOI: Math.round(clinicAOI),
        },
    };
}

export default function StorePortfolioTab({ leverValues, onLeverChange }: StorePortfolioTabProps) {
    const impact = useMemo(() => calculatePCWPortfolioImpact(leverValues), [leverValues]);

    // PCW channel revenue waterfall
    const channelWaterfall = useMemo(() => [
        { name: 'Rx Volume', revenue: 21500, delta: impact.components.rxGrowthRevenue, fill: CHART_COLORS.green, type: 'channel' },
        { name: 'GLP-1 Share', revenue: 2900, delta: impact.components.glp1Revenue, fill: CHART_COLORS.blue, type: 'channel' },
        { name: 'HealthHUB', revenue: 4500, delta: impact.components.hubRevenue, fill: CHART_COLORS.teal, type: 'channel' },
        { name: 'MinuteClinic', revenue: 800, delta: impact.components.clinicRevenue, fill: CHART_COLORS.amber, type: 'channel' },
    ], [impact]);

    // PCW quarterly revenue trend (FY25-FY26E)
    const quarterlyRevData = useMemo(() => {
        const ssg = leverValues['same-store-rx-growth'] ?? 7.0;
        return [
            { quarter: 'Q1 FY25', rx: 19800, front: 5200, clinic: 720 },
            { quarter: 'Q2 FY25', rx: 20200, front: 5400, clinic: 760 },
            { quarter: 'Q3 FY25', rx: 20800, front: 5600, clinic: 780 },
            { quarter: 'Q4 FY25', rx: 21000, front: 5800, clinic: 800 },
            { quarter: 'Q1 FY26', rx: 21500, front: 6000, clinic: 820 },
            { quarter: 'Q2 FY26E', rx: Math.round(21500 * (1 + ssg / 100) * 0.25), front: 6100, clinic: 840 },
            { quarter: 'Q3 FY26E', rx: Math.round(21500 * (1 + ssg / 100) * 0.25), front: 6200, clinic: 860 },
        ];
    }, [leverValues]);

    // PCW channel economics
    const channelEconomics = [
        {
            channel: 'Retail Pharmacy (Rx)',
            revenue: `$${(21500 / 1000).toFixed(1)}B`,
            growth: `+${leverValues['same-store-rx-growth'] ?? 7.0}%`,
            margin: '4.5%',
            outlook: (leverValues['same-store-rx-growth'] ?? 7.0) >= 7 ? 'On Target' : 'Below Target',
            color: CHART_COLORS.green,
        },
        {
            channel: 'GLP-1 / Specialty Rx',
            revenue: `$${(2900 / 1000).toFixed(1)}B`,
            growth: `${(leverValues['glp1-market-share-pct'] ?? 29).toFixed(1)}% share`,
            margin: '3.5%',
            outlook: (leverValues['glp1-market-share-pct'] ?? 29) >= 29 ? 'Growing' : 'Competitive',
            color: CHART_COLORS.blue,
        },
        {
            channel: 'HealthHUB Premium',
            revenue: `${leverValues['healthhub-conversion-count'] ?? 1500} stores`,
            growth: '+15% vs. standard',
            margin: '12%',
            outlook: (leverValues['healthhub-conversion-count'] ?? 1500) >= 1500 ? 'Expanding' : 'On Pace',
            color: CHART_COLORS.teal,
        },
        {
            channel: 'MinuteClinic',
            revenue: `${((leverValues['minuteclinic-visits'] ?? 2800) / 1000).toFixed(1)}M visits/qtr`,
            growth: `$95 avg. revenue`,
            margin: '20%',
            outlook: (leverValues['minuteclinic-visits'] ?? 2800) >= 2800 ? 'Stable' : 'Moderate',
            color: CHART_COLORS.amber,
        },
    ];

    // Competitors from CVS config (managed care competitors — shown for market context)
    const competitors = market.competitors;

    // Regional pharmacy performance
    const regionData = useMemo(() => [
        { region: 'Northeast', base: 7200, incremental: Math.round(impact.totalRevenueImpact * 0.28) },
        { region: 'Southeast', base: 5800, incremental: Math.round(impact.totalRevenueImpact * 0.22) },
        { region: 'Midwest', base: 5100, incremental: Math.round(impact.totalRevenueImpact * 0.19) },
        { region: 'Southwest', base: 4200, incremental: Math.round(impact.totalRevenueImpact * 0.16) },
        { region: 'West', base: 4200, incremental: Math.round(impact.totalRevenueImpact * 0.15) },
    ], [impact]);

    return (
        <motion.div
            key="pcw-portfolio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Summary Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">PCW Pharmacy & HealthHUB Portfolio Impact</h3>
                <div className="grid grid-cols-5 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Revenue Impact</p>
                        <p className={`text-xl font-bold ${impact.totalRevenueImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.totalRevenueImpact >= 0 ? '+' : ''}${(impact.totalRevenueImpact / 1000).toFixed(1)}B
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">HealthHUBs</p>
                        <p className="text-xl font-bold text-gray-900">
                            {impact.healthHubCount.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">AOI Impact</p>
                        <p className={`text-xl font-bold ${impact.totalAOI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.totalAOI >= 0 ? '+' : ''}${(Math.abs(impact.totalAOI) / 1000).toFixed(2)}B
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">GLP-1 Share</p>
                        <p className="text-xl font-bold text-[#003B2C]">
                            {impact.glp1MarketShare}%
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Margin Impact</p>
                        <p className={`text-xl font-bold ${impact.marginImpactBps >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.marginImpactBps >= 0 ? '+' : ''}{impact.marginImpactBps}bps
                        </p>
                    </div>
                </div>

                {/* AI Insight */}
                <div className="bg-[#F0F0F0] rounded-lg p-4 flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-[#003B2C] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-[#003B2C]">
                        <span className="font-semibold">AI Insight:</span>{' '}
                        {impact.components.glp1Revenue > 200
                            ? `GLP-1 market share at ${impact.glp1MarketShare}% drives +$${impact.components.glp1Revenue}M revenue, but net AOI contribution is modest ($${impact.components.glp1AOI}M) due to compressed margins on high-ingredient-cost scripts. Same-store Rx growth of ${leverValues['same-store-rx-growth'] ?? 7.0}% generates +$${impact.components.rxGrowthRevenue}M — the highest-ROI PCW driver.`
                            : impact.components.reimbAOI < -100
                            ? `Reimbursement headwind of $${Math.abs(impact.components.reimbAOI)}M/quarter is a material offset to script growth. Store optimization savings of $${Math.round((leverValues['store-optimization-savings'] ?? 150) * 0.25)}M/quarter and HealthHUB conversions (+$${impact.components.hubAOI}M AOI) are the key controllable offsets.`
                            : `Balanced PCW scenario: same-store Rx +${leverValues['same-store-rx-growth'] ?? 7.0}% generates +$${impact.components.rxGrowthRevenue}M. HealthHUB premium across ${impact.healthHubCount.toLocaleString()} stores adds $${impact.components.hubAOI}M AOI. Reimbursement headwind: $${Math.abs(impact.components.reimbAOI)}M/quarter.`
                        }
                    </div>
                </div>
            </div>

            {/* Channel Revenue + Regional Breakdown */}
            <div className="grid grid-cols-2 gap-6">
                {/* Regional Performance */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Regional Pharmacy Revenue ($M)</h3>
                    <div className="space-y-3">
                        {regionData.map((region, idx) => (
                            <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:border-[#003B2C]/20 transition-colors">
                                <MapPin className="w-4 h-4 text-[#003B2C]" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900">{region.region}</p>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xs text-gray-500">${(region.base / 1000).toFixed(1)}B base</span>
                                            <span className={`text-xs font-medium flex items-center ${region.incremental >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {region.incremental >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                                {region.incremental >= 0 ? '+' : ''}${region.incremental}M
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                                        <div
                                            className="bg-[#003B2C] h-1.5 rounded-full"
                                            style={{ width: `${(region.base / 7500) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Channel Revenue Impact */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue Impact by Channel ($M)</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={channelWaterfall}>
                            <CartesianGrid {...CHART_GRID_STYLE} />
                            <XAxis dataKey="name" tick={{ ...CHART_AXIS_STYLE, fontSize: 10 }} />
                            <YAxis
                                tick={CHART_AXIS_STYLE}
                                tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}B` : `$${v}M`}
                            />
                            <Tooltip
                                {...CHART_TOOLTIP_DARK}
                                formatter={(value: number, name: string, props: any) => {
                                    const item = props.payload;
                                    return [`$${(item.revenue / 1000).toFixed(1)}B base | ${item.delta >= 0 ? '+' : ''}$${item.delta}M delta`, item.name];
                                }}
                            />
                            <Bar dataKey="delta" radius={[4, 4, 0, 0]}>
                                {channelWaterfall.map((entry, index) => (
                                    <Cell key={index} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Channel Economics Table + AOI Bridge */}
            <div className="grid grid-cols-2 gap-6">
                {/* Channel Economics Table */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">PCW Channel Economics</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2 text-xs font-medium text-gray-500">Channel</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-500">Revenue</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-500">Growth</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-500">Margin</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-500">Outlook</th>
                            </tr>
                        </thead>
                        <tbody>
                            {channelEconomics.map((item) => (
                                <tr key={item.channel} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-2.5 flex items-center space-x-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="font-medium text-gray-900">{item.channel}</span>
                                    </td>
                                    <td className="py-2.5 text-right text-gray-700">{item.revenue}</td>
                                    <td className={`py-2.5 text-right font-medium text-green-600`}>{item.growth}</td>
                                    <td className="py-2.5 text-right text-gray-700">{item.margin}</td>
                                    <td className="py-2.5 text-right font-medium text-gray-900">{item.outlook}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PCW AOI Bridge */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Quarterly AOI Bridge ($M)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={[
                            { name: 'Rx Volume', value: impact.components.rxGrowthAOI, fill: CHART_COLORS.green },
                            { name: 'GLP-1 Share', value: impact.components.glp1AOI, fill: CHART_COLORS.blue },
                            { name: 'HealthHUB', value: impact.components.hubAOI, fill: CHART_COLORS.teal },
                            { name: 'Reimbursement', value: impact.components.reimbAOI, fill: impact.components.reimbAOI >= 0 ? CHART_COLORS.green : CHART_COLORS.red },
                            { name: 'Optimization', value: impact.components.optSavingsAOI, fill: CHART_COLORS.amber },
                            { name: 'MinuteClinic', value: impact.components.clinicAOI, fill: CHART_COLORS.purple },
                        ]} layout="vertical">
                            <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical={true} />
                            <XAxis type="number" tick={CHART_AXIS_STYLE} tickFormatter={(v) => `$${v}M`} />
                            <YAxis type="category" dataKey="name" tick={{ ...CHART_AXIS_STYLE, fontSize: 10 }} width={90} />
                            <Tooltip
                                {...CHART_TOOLTIP_DARK}
                                formatter={(value: number) => [`${value >= 0 ? '+' : ''}$${value}M`, 'AOI Impact']}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {[
                                    { value: impact.components.rxGrowthAOI },
                                    { value: impact.components.glp1AOI },
                                    { value: impact.components.hubAOI },
                                    { value: impact.components.reimbAOI },
                                    { value: impact.components.optSavingsAOI },
                                    { value: impact.components.clinicAOI },
                                ].map((entry, index) => (
                                    <Cell key={index} fill={entry.value >= 0 ? [CHART_COLORS.green, CHART_COLORS.blue, CHART_COLORS.teal, CHART_COLORS.red, CHART_COLORS.amber, CHART_COLORS.purple][index] : CHART_COLORS.red} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Portfolio Summary Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">PCW Portfolio Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600 mb-1">CVS Store Locations</p>
                        <p className="text-lg font-bold text-[#003B2C]">~9,000</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600 mb-1">HealthHUB Conversions</p>
                        <p className={`text-lg font-bold ${impact.components.hubRevenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.healthHubCount.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600 mb-1">MinuteClinic Visits</p>
                        <p className="text-lg font-bold text-gray-900">{(impact.minuteClinicVisits / 1000).toFixed(1)}M/qtr</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600 mb-1">Reimbursement Headwind</p>
                        <p className="text-lg font-bold text-red-600">${Math.abs(impact.components.reimbAOI)}M/qtr</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
