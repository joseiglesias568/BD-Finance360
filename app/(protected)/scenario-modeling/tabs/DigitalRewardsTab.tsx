'use client';

import { CHART_COLORS, CHART_TOOLTIP_DARK, CHART_GRID_STYLE, CHART_AXIS_STYLE } from '@/lib/chart-theme';
import { motion } from 'framer-motion';
import {
    Smartphone,
    Users,
    Sparkles,
    ArrowRight,
    Cpu,
    Zap,
    BarChart3,
} from 'lucide-react';
import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, ComposedChart, Line, Area,
} from 'recharts';

interface DigitalPlatformTabProps {
    leverValues: Record<string, number>;
    onLeverChange: (id: string, value: number) => void;
}

// Inlined CVS digital metrics — operations config lacks digitalMetrics field
const CVS_DIGITAL_METRICS = [
    { label: 'ExtraCare Active Members', value: '~75M', description: 'Loyalty program enrollment with personalized offers' },
    { label: 'Digital Rx Fill Rate', value: '~35%', description: 'Prescriptions ordered via CVS.com or mobile app' },
    { label: 'MyAetna Portal Registered', value: '~15M', description: 'HCB members with active digital engagement' },
    { label: 'MinuteClinic Digital Booking', value: '~35%', description: 'Appointments scheduled via digital channels' },
    { label: 'AI Prior Auth Rate', value: '~40%', description: 'Prior authorizations processed via AI automation' },
    { label: 'Health100 SG&A Progress', value: '$500M+', description: 'Cumulative savings toward $2B program target' },
];

// ─── Calculation Engine ─────────────────────────────────────────────────────
function calculateDigitalHealthImpact(values: Record<string, number>) {
    const health100Adoption = values['health100-member-adoption-pct'] ?? 62;
    const extracareMembers = values['extracare-active-members-m'] ?? 75;
    const digitalRxFill = values['digital-rx-fill-rate-pct'] ?? 35;
    const minuteclinicDigital = values['minuteclinic-digital-scheduling-pct'] ?? 35;
    const myaetnaEngagement = values['myaetna-portal-engagement-pct'] ?? 30;
    const aiPriorAuth = values['ai-prior-auth-approval-pct'] ?? 40;

    // Health100: each 1pp above 62% base → ~$12.5M additional SG&A savings toward $2B target
    const health100Savings = (health100Adoption - 62) * 12.5;

    // ExtraCare: each 1M additional members → ~$25M front-store revenue at 5% margin
    const extracareRevenue = (extracareMembers - 75) * 25;
    const extracareAOI = extracareRevenue * 0.05;

    // Digital Rx: each 1pp increase → ~$30M dispensing cost savings + adherence lift
    const digitalRxSavings = (digitalRxFill - 35) * 30;

    // MinuteClinic digital: each 1pp above 35% → ~$4M capacity/revenue at 20% margin
    const minuteclinicRevenue = (minuteclinicDigital - 35) * 4;
    const minuteclinicAOI = minuteclinicRevenue * 0.20;

    // MyAetna: each 1pp engagement → ~$8M medical cost reduction (adherence, care navigation)
    const myaetnaAOI = (myaetnaEngagement - 30) * 8;

    // AI prior auth: each 1pp automation → ~$18M savings ($1B annual cost base, 40% addressable)
    const aiSavings = (aiPriorAuth - 40) * 18;

    const totalRevenueDelta = extracareRevenue + minuteclinicRevenue;
    const totalCostSavings = health100Savings + digitalRxSavings + aiSavings;
    const totalAOI = extracareAOI + minuteclinicAOI + myaetnaAOI + health100Savings + digitalRxSavings + aiSavings;
    const marginImpactBps = Math.round((totalAOI / 372000) * 10000); // ~$372B total CVS revenues

    const techInvestment = 400 + (health100Adoption - 62) * 5 + (aiPriorAuth - 40) * 3;
    const roi = techInvestment > 0 ? (totalAOI / techInvestment * 100) : 0;

    return {
        totalRevenueDelta: Math.round(totalRevenueDelta),
        totalCostSavings: Math.round(totalCostSavings),
        totalAOI: Math.round(totalAOI),
        marginImpactBps,
        health100: { adoption: health100Adoption, savings: Math.round(health100Savings) },
        extracare: { members: extracareMembers, revenue: Math.round(extracareRevenue), aoi: Math.round(extracareAOI) },
        digitalRx: { fillRate: digitalRxFill, savings: Math.round(digitalRxSavings) },
        minuteclinic: { digitalPct: minuteclinicDigital, revenue: Math.round(minuteclinicRevenue), aoi: Math.round(minuteclinicAOI) },
        myaetna: { engagement: myaetnaEngagement, aoi: Math.round(myaetnaAOI) },
        aiAuth: { rate: aiPriorAuth, savings: Math.round(aiSavings) },
        investment: { total: Math.round(techInvestment), roi: Math.round(roi) },
    };
}

export default function DigitalPlatformTab({ leverValues, onLeverChange }: DigitalPlatformTabProps) {
    const impact = useMemo(() => calculateDigitalHealthImpact(leverValues), [leverValues]);

    // Digital adoption trend projection
    const adoptionTrend = useMemo(() => {
        const targetRx = leverValues['digital-rx-fill-rate-pct'] ?? 35;
        const targetAuth = leverValues['ai-prior-auth-approval-pct'] ?? 40;
        return [
            { quarter: 'Q4 FY24', digitalRx: 28, aiAuth: 25 },
            { quarter: 'Q1 FY25', digitalRx: 30, aiAuth: 30 },
            { quarter: 'Q2 FY25', digitalRx: 32, aiAuth: 35 },
            { quarter: 'Q3 FY25', digitalRx: 34, aiAuth: 38 },
            { quarter: 'Q4 FY25', digitalRx: 35, aiAuth: 40 },
            { quarter: 'Q1 FY26E', digitalRx: 35 + (targetRx - 35) * 0.25, aiAuth: 40 + (targetAuth - 40) * 0.25 },
            { quarter: 'Q2 FY26E', digitalRx: 35 + (targetRx - 35) * 0.5, aiAuth: 40 + (targetAuth - 40) * 0.5 },
            { quarter: 'Q3 FY26E', digitalRx: 35 + (targetRx - 35) * 0.75, aiAuth: 40 + (targetAuth - 40) * 0.75 },
            { quarter: 'Q4 FY26E', digitalRx: targetRx, aiAuth: targetAuth },
        ];
    }, [leverValues]);

    // AOI/savings waterfall by digital lever
    const valueWaterfall = useMemo(() => [
        { name: 'Health100 SG&A', value: impact.health100.savings, fill: CHART_COLORS.green },
        { name: 'Digital Rx Savings', value: impact.digitalRx.savings, fill: CHART_COLORS.blue },
        { name: 'AI Prior Auth', value: impact.aiAuth.savings, fill: CHART_COLORS.teal },
        { name: 'MyAetna Mgmt', value: impact.myaetna.aoi, fill: CHART_COLORS.amber },
        { name: 'ExtraCare Revenue', value: impact.extracare.aoi, fill: CHART_COLORS.purple },
        { name: 'MinuteClinic', value: impact.minuteclinic.aoi, fill: CHART_COLORS.gray },
    ], [impact]);

    // Digital initiative economics table
    const techEconomics = useMemo(() => [
        {
            capability: 'Health100 SG&A Program',
            icon: <Sparkles className="w-4 h-4 text-green-600" />,
            investment: '$300M',
            impact: `$${Math.abs(impact.health100.savings)}M`,
            type: 'Direct savings',
            payback: '1.8 yrs',
            color: CHART_COLORS.green,
        },
        {
            capability: 'AI Prior Authorization',
            icon: <Cpu className="w-4 h-4 text-blue-500" />,
            investment: '$85M',
            impact: `$${Math.abs(impact.aiAuth.savings)}M`,
            type: 'Cost avoidance',
            payback: '1.4 yrs',
            color: CHART_COLORS.blue,
        },
        {
            capability: 'Digital Rx Platform',
            icon: <Smartphone className="w-4 h-4 text-teal-500" />,
            investment: '$65M',
            impact: `$${Math.abs(impact.digitalRx.savings)}M`,
            type: 'Efficiency gains',
            payback: '2.2 yrs',
            color: CHART_COLORS.teal,
        },
        {
            capability: 'MyAetna Care Navigation',
            icon: <BarChart3 className="w-4 h-4 text-amber-500" />,
            investment: '$50M',
            impact: `$${Math.abs(impact.myaetna.aoi)}M`,
            type: 'Medical cost',
            payback: '1.6 yrs',
            color: CHART_COLORS.amber,
        },
    ], [impact]);

    const flywheelSteps = [
        { label: 'Health100', value: `${impact.health100.adoption}%`, icon: Sparkles, sublabel: 'adoption' },
        { label: 'Digital Rx', value: `${impact.digitalRx.fillRate}%`, icon: Smartphone, sublabel: 'fill rate' },
        { label: 'AI Auth', value: `${impact.aiAuth.rate}%`, icon: Cpu, sublabel: 'automated' },
        { label: 'AOI Savings', value: `$${impact.totalAOI}M`, icon: Zap, sublabel: 'annualized' },
    ];

    return (
        <motion.div
            key="digital-platform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Summary Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Health & Health100 Adoption Impact</h3>
                <div className="grid grid-cols-5 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Total AOI Impact</p>
                        <p className={`text-xl font-bold ${impact.totalAOI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.totalAOI >= 0 ? '+' : ''}${impact.totalAOI}M
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Cost Savings</p>
                        <p className="text-xl font-bold text-green-600">
                            +${impact.totalCostSavings}M
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Health100 Adoption</p>
                        <p className="text-xl font-bold text-[#003B2C]">
                            {impact.health100.adoption}%
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Tech ROI</p>
                        <p className="text-xl font-bold text-gray-900">
                            {impact.investment.roi}%
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Margin Impact</p>
                        <p className={`text-xl font-bold ${impact.marginImpactBps >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.marginImpactBps >= 0 ? '+' : ''}{impact.marginImpactBps}bps
                        </p>
                    </div>
                </div>

                {/* Digital Health Flywheel */}
                <div className="bg-[#003B2C] rounded-xl p-6">
                    <h4 className="text-sm font-semibold text-white mb-4">Digital Health Flywheel</h4>
                    <div className="flex items-center justify-between">
                        {flywheelSteps.map((step, idx) => (
                            <div key={idx} className="flex items-center">
                                <motion.div
                                    className="text-center"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.15 }}
                                >
                                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                                        <step.icon className="w-6 h-6 text-[#F0F0F0]" />
                                    </div>
                                    <p className="text-white font-bold text-sm">{step.value}</p>
                                    <p className="text-[#F0F0F0] text-xs">{step.label}</p>
                                    <p className="text-gray-400 text-[10px]">{step.sublabel}</p>
                                </motion.div>
                                {idx < flywheelSteps.length - 1 && (
                                    <ArrowRight className="w-5 h-5 text-[#F0F0F0]/50 mx-3" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Digital Adoption Trend + Initiative Economics */}
            <div className="grid grid-cols-2 gap-6">
                {/* Digital Adoption Trend Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Digital Rx Fill Rate & AI Auth Trajectory</h3>
                    <p className="text-xs text-gray-500 mb-4">Digital fill rate (%) & AI prior auth automation (%)</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <ComposedChart data={adoptionTrend}>
                            <CartesianGrid {...CHART_GRID_STYLE} />
                            <XAxis dataKey="quarter" tick={{ ...CHART_AXIS_STYLE, fontSize: 8 }} />
                            <YAxis
                                tick={CHART_AXIS_STYLE}
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                            />
                            <Tooltip
                                {...CHART_TOOLTIP_DARK}
                                formatter={(value: number, name: string) => [
                                    `${(value as number).toFixed(0)}%`,
                                    name === 'digitalRx' ? 'Digital Rx Fill Rate' : 'AI Prior Auth Rate'
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="digitalRx"
                                fill={CHART_COLORS.greenSoft}
                                stroke={CHART_COLORS.green}
                                strokeWidth={2}
                                name="digitalRx"
                            />
                            <Line
                                type="monotone"
                                dataKey="aiAuth"
                                stroke={CHART_COLORS.blue}
                                strokeWidth={2}
                                dot={{ r: 3, fill: CHART_COLORS.blue }}
                                name="aiAuth"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center space-x-6 mt-2 text-xs">
                        <div className="flex items-center space-x-1.5">
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.greenSoft }} />
                            <span className="text-gray-600">Digital Rx Fill Rate</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <span className="w-4 h-0.5 rounded" style={{ backgroundColor: CHART_COLORS.blue }} />
                            <span className="text-gray-600">AI Prior Auth Rate</span>
                        </div>
                    </div>
                </div>

                {/* Digital Initiative Economics Table */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Digital Initiative Economics</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2 text-xs font-medium text-gray-500">Initiative</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-500">Invest</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-500">AOI Impact</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-500">Type</th>
                                <th className="text-right py-2 text-xs font-medium text-gray-500">Payback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {techEconomics.map((item) => (
                                <tr key={item.capability} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 flex items-center space-x-2">
                                        {item.icon}
                                        <span className="font-medium text-gray-900">{item.capability}</span>
                                    </td>
                                    <td className="py-3 text-right text-gray-700">{item.investment}</td>
                                    <td className="py-3 text-right text-gray-700">{item.impact}</td>
                                    <td className="py-3 text-right text-gray-700">{item.type}</td>
                                    <td className="py-3 text-right font-semibold" style={{ color: item.color }}>{item.payback}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm">
                        <span className="text-gray-600">Total Digital Investment:</span>
                        <span className="font-bold text-[#003B2C]">${impact.investment.total}M ({impact.investment.roi}% ROI)</span>
                    </div>
                </div>
            </div>

            {/* Value Driver Waterfall + CVS Digital KPIs */}
            <div className="grid grid-cols-2 gap-6">
                {/* Value Driver Waterfall */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Digital AOI Drivers ($M Impact)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={valueWaterfall} layout="vertical">
                            <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical={true} />
                            <XAxis
                                type="number"
                                tick={CHART_AXIS_STYLE}
                                tickFormatter={(v) => `$${v}M`}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ ...CHART_AXIS_STYLE, fontSize: 10 }}
                                width={110}
                            />
                            <Tooltip
                                {...CHART_TOOLTIP_DARK}
                                formatter={(value: number) => [`$${value}M`, 'AOI Impact']}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {valueWaterfall.map((entry, index) => (
                                    <Cell key={index} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* CVS Digital KPIs (inlined) */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">BD Digital KPIs</h3>
                    <div className="space-y-3">
                        {CVS_DIGITAL_METRICS.map((metric, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                                    <p className="text-xs text-gray-500">{metric.description}</p>
                                </div>
                                <p className="text-sm font-bold text-[#003B2C]">{metric.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Insight */}
            <div className="bg-[#F0F0F0] rounded-lg p-4 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-[#003B2C] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[#003B2C]">
                    <span className="font-semibold">AI Insight:</span>{' '}
                    {impact.health100.adoption > 80
                        ? `Strong Health100 adoption at ${impact.health100.adoption}% drives $${impact.health100.savings}M in SG&A savings — on pace toward the $2B program target. AI prior authorization at ${impact.aiAuth.rate}% automation generates $${impact.aiAuth.savings}M in administrative savings. Combined digital efficiency delivers $${impact.totalAOI}M total AOI improvement.`
                        : impact.aiAuth.savings > 200
                        ? `AI-led strategy: ${impact.aiAuth.rate}% prior auth automation saves $${impact.aiAuth.savings}M, with digital Rx at ${impact.digitalRx.fillRate}% adding $${impact.digitalRx.savings}M in dispensing efficiency. Health100 at ${impact.health100.adoption}% has $${Math.round((100 - impact.health100.adoption) * 12.5)}M additional savings still to unlock.`
                        : `Digital adoption trajectory delivers $${impact.totalAOI}M AOI with ${impact.health100.adoption}% Health100 adoption. Key opportunity: each 10pp increase in AI prior auth (currently ${impact.aiAuth.rate}%) saves ~$180M annually. Accelerating digital Rx fills from ${impact.digitalRx.fillRate}% drives both cost efficiency and medication adherence outcomes.`
                    }
                </div>
            </div>
        </motion.div>
    );
}
