'use client';

import { market } from '@/config/clients/cvs/market';
import { CHART_COLORS, CHART_TOOLTIP_DARK, CHART_GRID_STYLE, CHART_AXIS_STYLE } from '@/lib/chart-theme';
import { motion } from 'framer-motion';
import {
    Pill,
    TrendingUp,
    Sparkles,
    AlertTriangle,
} from 'lucide-react';
import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, LineChart, Line,
} from 'recharts';

interface GlobalMarketsTabProps {
    leverValues: Record<string, number>;
    onLeverChange: (id: string, value: number) => void;
}

// ─── Calculation Engine ─────────────────────────────────────────────────────
function calculateCaremarkPBMImpact(values: Record<string, number>) {
    const claimsGrowth = values['pharmacy-claims-growth-pct'] ?? 4;
    const specialtyGrowth = values['specialty-rx-growth-pct'] ?? 12;
    const truecostConversion = values['truecost-client-conversion'] ?? 62;
    const stelaraBiosimilar = values['stelara-biosimilar-conversion-pct'] ?? 50;
    const glp1VolumeGrowth = values['glp1-volume-growth-pct'] ?? 34;
    const oakStreetPatients = values['oak-street-vbc-patients'] ?? 38000;

    // Base revenues ($M annual run-rate)
    const standardRxBase = 100000; // ~$100B standard PBM claims processed
    const specialtyBase = 70000;   // ~$70B specialty pharmacy annual

    // Standard PBM claims: each 1pp growth → ~$1B revenue at ~0.5% net margin
    const claimsRevenueDelta = standardRxBase * (claimsGrowth / 100);
    const claimsAOIDelta = claimsRevenueDelta * 0.005;

    // Specialty Rx: each 1pp growth at ~3% net specialty margin
    const specialtyRevenueDelta = specialtyBase * (specialtyGrowth / 100);
    const specialtyAOIDelta = specialtyRevenueDelta * 0.03;

    // TrueCost conversion: each 1pp above 62% baseline → -$8M gross revenue, AOI-neutral
    const truecostDelta = truecostConversion - 62;
    const truecostRevenueDelta = truecostDelta * -8;

    // Stelara biosimilar: each 1pp above 50% baseline → ~$4M AOI
    const stelaraAOIDelta = (stelaraBiosimilar - 50) * 4;

    // GLP-1 volume: each 1pp above plan rate (22%) → ~$15M specialty revenue at 2% net margin
    const glp1RevenueDelta = (glp1VolumeGrowth - 22) * 15;
    const glp1AOIDelta = glp1RevenueDelta * 0.02;

    // Oak Street VBC: each 1K patients above 38K → ~$12M revenue at 8% margin
    const oakStreetDelta = (oakStreetPatients - 38000) / 1000;
    const oakStreetRevenueDelta = oakStreetDelta * 12;
    const oakStreetAOIDelta = oakStreetRevenueDelta * 0.08;

    const totalRevenueDelta = claimsRevenueDelta + specialtyRevenueDelta + truecostRevenueDelta + glp1RevenueDelta + oakStreetRevenueDelta;
    const totalAOIDelta = claimsAOIDelta + specialtyAOIDelta + stelaraAOIDelta + glp1AOIDelta + oakStreetAOIDelta;
    const marginImpactBps = Math.round((totalAOIDelta / 170000) * 10000);

    return {
        totalRevenueDelta: Math.round(totalRevenueDelta),
        totalAOIDelta: Math.round(totalAOIDelta),
        marginImpactBps,
        claims: { delta: Math.round(claimsRevenueDelta), aoiDelta: Math.round(claimsAOIDelta), growth: claimsGrowth },
        specialty: { delta: Math.round(specialtyRevenueDelta), aoiDelta: Math.round(specialtyAOIDelta), growth: specialtyGrowth },
        truecost: { delta: Math.round(truecostRevenueDelta), conversionPct: truecostConversion },
        stelara: { aoiDelta: Math.round(stelaraAOIDelta), conversionPct: stelaraBiosimilar },
        glp1: { delta: Math.round(glp1RevenueDelta), aoiDelta: Math.round(glp1AOIDelta), growth: glp1VolumeGrowth },
        oakStreet: { delta: Math.round(oakStreetRevenueDelta), aoiDelta: Math.round(oakStreetAOIDelta), patients: oakStreetPatients },
    };
}

export default function ChinaInternationalTab({ leverValues, onLeverChange }: GlobalMarketsTabProps) {
    const impact = useMemo(() => calculateCaremarkPBMImpact(leverValues), [leverValues]);

    // PBM claims + specialty revenue growth projection
    const revenueGrowthData = useMemo(() => {
        const claimsG = leverValues['pharmacy-claims-growth-pct'] ?? 4;
        const specialtyG = leverValues['specialty-rx-growth-pct'] ?? 12;
        return [
            { year: 'FY23', standard: 88000, specialty: 56000 },
            { year: 'FY24', standard: 93000, specialty: 63000 },
            { year: 'FY25', standard: 100000, specialty: 70000 },
            { year: 'FY26E', standard: Math.round(100000 * (1 + claimsG / 100)), specialty: Math.round(70000 * (1 + specialtyG / 100)) },
            { year: 'FY27E', standard: Math.round(100000 * Math.pow(1 + claimsG / 100, 2)), specialty: Math.round(70000 * Math.pow(1 + specialtyG / 100, 2)) },
        ];
    }, [leverValues]);

    // AOI impact waterfall by driver
    const aoiWaterfall = useMemo(() => [
        { name: 'Standard PBM', value: impact.claims.aoiDelta, fill: CHART_COLORS.blue },
        { name: 'Specialty Rx', value: impact.specialty.aoiDelta, fill: CHART_COLORS.teal },
        { name: 'Stelara Biosimilar', value: impact.stelara.aoiDelta, fill: CHART_COLORS.green },
        { name: 'GLP-1 Volume', value: impact.glp1.aoiDelta, fill: CHART_COLORS.amber },
        { name: 'Oak Street VBC', value: impact.oakStreet.aoiDelta, fill: CHART_COLORS.purple },
        { name: 'TrueCost Rev', value: impact.truecost.delta, fill: impact.truecost.delta >= 0 ? CHART_COLORS.green : CHART_COLORS.red },
    ], [impact]);

    // Competitor data from CVS market config
    const competitors = market.competitors;

    // Biosimilar conversion × specialty growth sensitivity matrix
    const biosimilarMatrix = useMemo(() => {
        const conversionScenarios = [
            { label: 'Conv. 95%', conv: 95 },
            { label: 'Conv. 75%', conv: 75 },
            { label: 'Conv. 50%', conv: 50 },
        ];
        const specialtyScenarios = [
            { label: 'Specialty +15%', growth: 15 },
            { label: 'Specialty +12%', growth: 12 },
            { label: 'Specialty +8%', growth: 8 },
        ];
        return specialtyScenarios.map(s =>
            conversionScenarios.map(c => ({
                specialtyLabel: s.label,
                convLabel: c.label,
                value: Math.round((c.conv - 50) * 4 + 70000 * (s.growth / 100) * 0.03 / 4),
            }))
        );
    }, []);

    return (
        <motion.div
            key="global-markets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Summary Impact Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Caremark PBM & Health Services P&L Impact</h3>
                <div className="grid grid-cols-5 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Total Revenue Delta</p>
                        <p className={`text-xl font-bold ${impact.totalRevenueDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.totalRevenueDelta >= 0 ? '+' : ''}${(impact.totalRevenueDelta / 1000).toFixed(1)}B
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Specialty Rx Revenue</p>
                        <p className={`text-xl font-bold ${impact.specialty.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.specialty.delta >= 0 ? '+' : ''}${(impact.specialty.delta / 1000).toFixed(1)}B
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Stelara Biosimilar AOI</p>
                        <p className={`text-xl font-bold ${impact.stelara.aoiDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.stelara.aoiDelta >= 0 ? '+' : ''}${impact.stelara.aoiDelta}M
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Total AOI Delta</p>
                        <p className={`text-xl font-bold ${impact.totalAOIDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.totalAOIDelta >= 0 ? '+' : ''}${impact.totalAOIDelta}M
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
                        {impact.stelara.aoiDelta > 150
                            ? `Strong biosimilar conversion at ${impact.stelara.conversionPct}% drives $${impact.stelara.aoiDelta}M AOI uplift — the highest-margin Health Services catalyst in FY2026. Specialty Rx growth at +${impact.specialty.growth}% adds $${(impact.specialty.delta / 1000).toFixed(1)}B revenue at ~3% net margin. Oak Street VBC at ${impact.oakStreet.patients.toLocaleString()} patients is scaling toward profitability.`
                            : impact.glp1.growth > 30
                            ? `GLP-1 volume at +${impact.glp1.growth}% YoY outpacing plan drives $${impact.glp1.delta}M incremental Health Services revenue. Stelara biosimilar conversion at ${impact.stelara.conversionPct}% adds $${impact.stelara.aoiDelta}M AOI. TrueCost transition at ${impact.truecost.conversionPct}% client adoption remains on schedule.`
                            : `Moderate Health Services trajectory: standard PBM claims +${impact.claims.growth}% on $100B base, specialty +${impact.specialty.growth}% YoY. Key upside: accelerating Stelara biosimilar to >85% from ${impact.stelara.conversionPct}% could add $${Math.round((85 - impact.stelara.conversionPct) * 4)}M additional AOI.`
                        }
                    </div>
                </div>
            </div>

            {/* Revenue Growth Chart + AOI Waterfall */}
            <div className="grid grid-cols-2 gap-6">
                {/* PBM Revenue Trajectory */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Health Services Revenue Trajectory ($M)</h3>
                    <p className="text-xs text-gray-500 mb-4">Standard PBM claims processed vs. specialty pharmacy</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={revenueGrowthData}>
                            <CartesianGrid {...CHART_GRID_STYLE} />
                            <XAxis dataKey="year" tick={CHART_AXIS_STYLE} />
                            <YAxis
                                tick={CHART_AXIS_STYLE}
                                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}B`}
                            />
                            <Tooltip
                                {...CHART_TOOLTIP_DARK}
                                formatter={(value: number, name: string) => [
                                    `$${(value / 1000).toFixed(1)}B`,
                                    name === 'standard' ? 'Standard PBM' : 'Specialty Rx'
                                ]}
                            />
                            <Line type="monotone" dataKey="standard" stroke={CHART_COLORS.blue} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS.blue }} name="standard" />
                            <Line type="monotone" dataKey="specialty" stroke={CHART_COLORS.teal} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS.teal }} name="specialty" />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center space-x-6 mt-2 text-xs">
                        <div className="flex items-center space-x-1.5">
                            <span className="w-4 h-0.5 rounded" style={{ backgroundColor: CHART_COLORS.blue }} />
                            <span className="text-gray-600">Standard PBM</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <span className="w-4 h-0.5 rounded" style={{ backgroundColor: CHART_COLORS.teal }} />
                            <span className="text-gray-600">Specialty Rx</span>
                        </div>
                    </div>
                </div>

                {/* AOI Impact Waterfall */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">AOI Impact by Driver ($M)</h3>
                    <p className="text-xs text-gray-500 mb-4">Incremental AOI delta from lever changes</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={aoiWaterfall}>
                            <CartesianGrid {...CHART_GRID_STYLE} />
                            <XAxis dataKey="name" tick={{ ...CHART_AXIS_STYLE, fontSize: 9 }} />
                            <YAxis tick={CHART_AXIS_STYLE} tickFormatter={(v) => `$${v}M`} />
                            <Tooltip
                                {...CHART_TOOLTIP_DARK}
                                formatter={(value: number) => [
                                    `${value >= 0 ? '+' : ''}$${value}M`,
                                    'AOI Delta'
                                ]}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {aoiWaterfall.map((entry, index) => (
                                    <Cell key={index} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Competitive Landscape + Biosimilar Sensitivity */}
            <div className="grid grid-cols-2 gap-6">
                {/* PBM Competitive Landscape */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">PBM & Health Services Competitive Landscape</h3>
                    <div className="space-y-3">
                        {competitors.map((comp, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                                <div className="w-24 text-sm font-medium text-gray-900 truncate">{comp.name}</div>
                                <div className="flex-1">
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div
                                            className="h-3 rounded-full transition-all"
                                            style={{
                                                width: `${(comp.marketShare / 40) * 100}%`,
                                                backgroundColor: idx === 0 ? CHART_COLORS.red : idx === 1 ? CHART_COLORS.blue : CHART_COLORS.gray,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right w-20">
                                    <span className="text-sm font-semibold text-gray-900">{comp.marketShare}%</span>
                                    <span className={`text-xs ml-1 ${comp.yoyChange > 0 ? 'text-green-600' : comp.yoyChange < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                        {comp.yoyChange > 0 ? '+' : ''}{comp.yoyChange}pp
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center space-x-3 pt-2 border-t border-gray-200">
                            <div className="w-24 text-sm font-bold text-[#003087]">CVS/Caremark</div>
                            <div className="flex-1">
                                <div className="w-full bg-gray-100 rounded-full h-3">
                                    <div
                                        className="h-3 rounded-full bg-[#003087] transition-all"
                                        style={{ width: `${(33 / 40) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="text-right w-20">
                                <span className="text-sm font-bold text-[#003087]">~33%</span>
                                <span className="text-xs ml-1 text-gray-500">TrueCost</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Biosimilar & Specialty Sensitivity Matrix */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Biosimilar Conv. × Specialty Growth Sensitivity ($M AOI)</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="text-left py-2 text-xs font-medium text-gray-500"></th>
                                <th className="text-center py-2 text-xs font-medium text-gray-500">Conv. 95%</th>
                                <th className="text-center py-2 text-xs font-medium text-gray-500">Conv. 75%</th>
                                <th className="text-center py-2 text-xs font-medium text-gray-500">Conv. 50%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {biosimilarMatrix.map((row, rowIdx) => (
                                <tr key={rowIdx} className="border-t border-gray-100">
                                    <td className="py-3 text-xs font-medium text-gray-700">{row[0].specialtyLabel}</td>
                                    {row.map((cell, cellIdx) => (
                                        <td key={cellIdx} className="py-3 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                cell.value > 600 ? 'bg-green-100 text-green-700' :
                                                cell.value > 300 ? 'bg-green-50 text-green-600' :
                                                cell.value > 0 ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                                {cell.value >= 0 ? '+' : ''}${cell.value}M
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="text-xs text-gray-500 mt-3">
                        Quarterly AOI sensitivity from Stelara biosimilar conversion rate and specialty pharmacy growth combination
                    </p>
                </div>
            </div>

            {/* Business Line Mix */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Health Services Revenue Mix by Channel</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">Standard PBM (~$100B base)</p>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between"><span className="text-gray-600">Commercial</span><span className="font-semibold">45%</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Medicare Part D</span><span className="font-semibold">30%</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Medicaid</span><span className="font-semibold">15%</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Retail Carve-out</span><span className="font-semibold">10%</span></div>
                        </div>
                    </div>
                    <div className="text-center p-4 bg-[#F0F0F0] rounded-lg border-2 border-[#003B2C]">
                        <p className="text-xs text-[#003B2C] font-medium mb-2">Specialty Rx (~$70B base)</p>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between"><span className="text-gray-600">Oncology</span><span className="font-semibold">28%</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Immunology</span><span className="font-semibold">25%</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Neurology</span><span className="font-semibold">18%</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Other Specialty</span><span className="font-semibold">29%</span></div>
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">Oak Street & HSS (~$3.5B)</p>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between"><span className="text-gray-600">VBC Capitation</span><span className="font-semibold">55%</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Fee-for-Service</span><span className="font-semibold">30%</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Shared Savings</span><span className="font-semibold">10%</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Infusion/Other</span><span className="font-semibold">5%</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
