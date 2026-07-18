'use client';

import { strategic } from '@/config/clients/cvs/strategic';
import { CHART_COLORS, CHART_TOOLTIP_DARK, CHART_GRID_STYLE, CHART_AXIS_STYLE } from '@/lib/chart-theme';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    AlertTriangle,
    Clock,
    TrendingUp,
    Sparkles,
} from 'lucide-react';
import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    ComposedChart,
} from 'recharts';

interface StrategyInvestmentTabProps {
    leverValues: Record<string, number>;
    onLeverChange: (id: string, value: number) => void;
}

// ─── Calculation Engine ─────────────────────────────────────────────────────
function calculateMARecoveryImpact(values: Record<string, number>) {
    const maPremiumRate    = values['ma-bid-year-premium-rate'] ?? 8.5;   // %
    const health100Savings = values['health100-sga-savings'] ?? 500;      // $M cumulative
    const oakStreetClinics = values['oak-street-clinic-count'] ?? 170;    // # clinics
    const medicaidMLR      = values['medicaid-mlr-improvement'] ?? 50;    // bps favorable
    const priorAuthRate    = values['prior-auth-automation-rate'] ?? 85;  // %
    const commercialGrowth = values['commercial-enrollment-growth'] ?? 1.5; // %

    // MA premium revenue: +1pp rate on ~$26B MA premium base = +$260M
    const maPremiumBase = 26000; // $M annualized
    const maPremiumRevenue = maPremiumBase * (maPremiumRate / 100);

    // Health100 SG&A savings: direct AOI benefit
    const sgaSavings = health100Savings;

    // Oak Street Health: 170 clinics at $5M avg revenue per mature clinic
    // Delta vs. 170 clinic baseline
    const clinicDelta = oakStreetClinics - 170;
    const oakStreetRevenue = clinicDelta * 5; // $5M per clinic
    const oakStreetAOI = oakStreetRevenue * 0.12; // ~12% AOI margin on Oak Street

    // Medicaid MLR improvement: each 100bps improvement on $25B Medicaid = +$250M AOI
    const medicaidAOI = (medicaidMLR / 100) * 250;

    // Prior auth automation: each 1pp from 85% baseline = $20M admin savings
    const priorAuthSavings = (priorAuthRate - 85) * 20;

    // Commercial enrollment: each 1% growth on 11M lives × $2,200/member = +$242M revenue at ~8% margin
    const commercialBase = 11000; // M members × $2,200 PMPY = $24.2B annualized
    const commercialRevenue = commercialBase * (commercialGrowth / 100);
    const commercialAOI = commercialRevenue * 0.08;

    const totalRevenueImpact = maPremiumRevenue + oakStreetRevenue + commercialRevenue;
    const totalCostSavings = sgaSavings + priorAuthSavings + Math.max(0, medicaidAOI);
    const totalAOI = maPremiumRevenue * 0.10 + sgaSavings + oakStreetAOI + medicaidAOI + priorAuthSavings + commercialAOI;
    const marginImpactBps = Math.round((totalAOI / 395000) * 10000); // vs ~$395B annual revenue base

    return {
        totalRevenueImpact: Math.round(totalRevenueImpact),
        totalCostSavings: Math.round(totalCostSavings),
        totalAOI: Math.round(totalAOI),
        marginImpactBps,
        components: {
            maPremiumRevenue: Math.round(maPremiumRevenue),
            sgaSavings: Math.round(sgaSavings),
            oakStreetRevenue: Math.round(oakStreetRevenue),
            oakStreetAOI: Math.round(oakStreetAOI),
            medicaidAOI: Math.round(medicaidAOI),
            priorAuthSavings: Math.round(priorAuthSavings),
            commercialRevenue: Math.round(commercialRevenue),
            commercialAOI: Math.round(commercialAOI),
        },
    };
}

export default function StrategyInvestmentTab({ leverValues, onLeverChange }: StrategyInvestmentTabProps) {
    const impact = useMemo(() => calculateMARecoveryImpact(leverValues), [leverValues]);

    // Strategic initiatives from CVS config
    const initiatives = strategic.initiatives;

    // Investment allocation donut: MA recovery priorities
    const allocationData = useMemo(() => [
        { name: 'MA Repricing / Underwriting', value: Math.round(leverValues['ma-bid-year-premium-rate'] ?? 8.5) * 40, spent: 180, color: CHART_COLORS.green },
        { name: 'Health100 SG&A Program', value: leverValues['health100-sga-savings'] ?? 500, spent: Math.round((leverValues['health100-sga-savings'] ?? 500) * 0.55), color: CHART_COLORS.blue },
        { name: 'Oak Street Expansion', value: (leverValues['oak-street-clinic-count'] ?? 170) * 3, spent: (170 * 3), color: CHART_COLORS.teal },
        { name: 'Medicaid Stabilization', value: 400, spent: 200, color: CHART_COLORS.amber },
        { name: 'Prior Auth AI Automation', value: 350, spent: Math.round(350 * ((leverValues['prior-auth-automation-rate'] ?? 85) - 70) / 29), color: CHART_COLORS.purple },
        { name: 'Commercial Growth', value: 250, spent: 120, color: CHART_COLORS.gray },
    ], [leverValues]);

    // MA margin bridge waterfall
    const waterfallData = useMemo(() => [
        { name: 'Q1 2026 MBR', value: 84.6, fill: CHART_COLORS.grayDark, isBaseline: true },
        { name: 'Seasonal Norm.', value: 5.9, fill: CHART_COLORS.red },
        { name: 'MA Repricing', value: -((leverValues['ma-bid-year-premium-rate'] ?? 8.5) * 0.15), fill: CHART_COLORS.green },
        { name: 'Health100 Eff.', value: -((leverValues['health100-sga-savings'] ?? 500) / 10000), fill: CHART_COLORS.blue },
        { name: 'Med. Mgmt.', value: -0.3, fill: CHART_COLORS.teal },
        { name: 'FY26E MBR', value: 90.5, fill: CHART_COLORS.grayDark, isBaseline: true },
    ], [leverValues]);

    // Revenue projection FY25-28 (HCB segment)
    const projectionData = useMemo(() => {
        const hcbBase = 113000; // annualized HCB revenue $M
        const annualLift = impact.totalRevenueImpact;
        return [
            { year: 'FY24', base: 106000, incremental: 0 },
            { year: 'FY25', base: hcbBase, incremental: 0 },
            { year: 'FY26E', base: hcbBase, incremental: Math.round(annualLift * 0.35) },
            { year: 'FY27E', base: hcbBase, incremental: Math.round(annualLift * 0.70) },
            { year: 'FY28E', base: hcbBase, incremental: annualLift },
        ];
    }, [impact]);

    const statusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case 'on-track': return <TrendingUp className="w-4 h-4 text-green-600" />;
            case 'at-risk': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            default: return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'on-track': return 'bg-green-100 text-green-700';
            case 'at-risk': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <motion.div
            key="strategy-investment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Summary Impact Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">MA Margin Recovery & Health100 — Strategic Impact</h3>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">HCB Revenue Uplift</p>
                        <p className={`text-xl font-bold ${impact.totalRevenueImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.totalRevenueImpact >= 0 ? '+' : ''}${(impact.totalRevenueImpact / 1000).toFixed(1)}B
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">SG&A / Cost Savings</p>
                        <p className="text-xl font-bold text-green-600">
                            +${(impact.totalCostSavings / 1000).toFixed(1)}B
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Adj. Operating Income</p>
                        <p className={`text-xl font-bold ${impact.totalAOI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {impact.totalAOI >= 0 ? '+' : ''}${(impact.totalAOI / 1000).toFixed(1)}B
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Margin Impact</p>
                        <p className="text-xl font-bold text-gray-900">
                            {impact.marginImpactBps >= 0 ? '+' : ''}{impact.marginImpactBps}bps
                        </p>
                    </div>
                </div>

                {/* AI Insight */}
                <div className="bg-[#F0F0F0] rounded-lg p-4 flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-[#003B2C] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-[#003B2C]">
                        <span className="font-semibold">AI Insight:</span>{' '}
                        {impact.totalAOI > 2000
                            ? `Bull case: MA bid-year premium increase of ${leverValues['ma-bid-year-premium-rate'] ?? 8.5}% combined with $${leverValues['health100-sga-savings'] ?? 500}M Health100 savings and ${leverValues['oak-street-clinic-count'] ?? 170} Oak Street clinics projects +$${(impact.totalAOI / 1000).toFixed(1)}B AOI uplift. Prior auth automation at ${leverValues['prior-auth-automation-rate'] ?? 85}% adds $${impact.components.priorAuthSavings}M admin savings.`
                            : impact.totalAOI > 500
                            ? `Base scenario: ${leverValues['ma-bid-year-premium-rate'] ?? 8.5}% MA repricing generates +$${(impact.components.maPremiumRevenue / 1000).toFixed(1)}B revenue, partially offset by cost trends. Health100 $${leverValues['health100-sga-savings'] ?? 500}M SG&A savings supports MA margin recovery trajectory toward 3% by 2028.`
                            : `Headwind scenario: below-plan MA rate increase at ${leverValues['ma-bid-year-premium-rate'] ?? 8.5}% limits HCB revenue upside. Health100 savings of $${leverValues['health100-sga-savings'] ?? 500}M remain the primary controllable lever — accelerating to $750M+ would provide meaningful margin support.`
                        }
                    </div>
                </div>
            </div>

            {/* Initiative Scorecard Grid */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Initiative Scorecard</h3>
                <div className="grid grid-cols-2 gap-4">
                    {initiatives.slice(0, 4).map((initiative) => (
                        <div key={initiative.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#003B2C]/30 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-gray-900 truncate flex-1 mr-2">{initiative.name}</h4>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center space-x-1 ${statusColor(initiative.status)}`}>
                                    {statusIcon(initiative.status)}
                                    <span className="ml-1">{initiative.status}</span>
                                </span>
                            </div>

                            {/* Budget Progress Bar */}
                            <div className="mb-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>${initiative.spent}M spent</span>
                                    <span>${initiative.budget}M budget</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-[#003B2C] h-2 rounded-full transition-all"
                                        style={{ width: `${Math.min(100, initiative.progress)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{initiative.progress}% complete</p>
                            </div>

                            {/* KPIs */}
                            <div className="space-y-1">
                                {initiative.kpis.slice(0, 2).map((kpi, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">{kpi.label}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-900">{kpi.actual}</span>
                                            <span className="text-gray-400">/</span>
                                            <span className="text-gray-500">{kpi.target}</span>
                                            <span className={`w-2 h-2 rounded-full ${
                                                kpi.status === 'good' ? 'bg-green-500' : kpi.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                                            }`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-6">
                {/* Investment Priority Donut */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Recovery Investment Priorities ($M)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={allocationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {allocationData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                {...CHART_TOOLTIP_DARK}
                                formatter={(value: number, name: string, props: any) => [
                                    `$${value}M (${Math.round((props.payload.spent / props.payload.value) * 100)}% deployed)`,
                                    name
                                ]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {allocationData.map((item) => (
                            <div key={item.name} className="flex items-center space-x-1 text-xs">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-gray-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* HCB Revenue Projection */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">HCB Revenue Impact Projection ($M)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <ComposedChart data={projectionData}>
                            <CartesianGrid {...CHART_GRID_STYLE} />
                            <XAxis dataKey="year" tick={CHART_AXIS_STYLE} />
                            <YAxis
                                tick={CHART_AXIS_STYLE}
                                domain={[100000, 130000]}
                                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}B`}
                            />
                            <Tooltip
                                {...CHART_TOOLTIP_DARK}
                                formatter={(value: number, name: string) => [
                                    `$${(value / 1000).toFixed(1)}B`,
                                    name === 'base' ? 'Base Revenue' : 'Recovery Uplift'
                                ]}
                            />
                            <Bar dataKey="base" stackId="a" fill={CHART_COLORS.gray} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="incremental" stackId="a" fill={CHART_COLORS.green} radius={[4, 4, 0, 0]} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* MA Margin Recovery Bridge */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Medical Benefit Ratio Context (Q1 2026 Actual → FY2026 Guidance)</h3>
                <p className="text-xs text-gray-500 mb-4">Q1 reflects seasonal deductible reset (best quarter); FY2026 guidance 90.5% ±50bps accounts for H2 acceleration.</p>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                        <p className="text-xs text-green-700 font-medium mb-1">Q1 2026 MBR (Actual)</p>
                        <p className="text-2xl font-bold text-green-700">84.6%</p>
                        <p className="text-xs text-green-600 mt-1">Best quarter — deductible reset</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                        <p className="text-xs text-gray-600 font-medium mb-1">FY2026 Guidance</p>
                        <p className="text-2xl font-bold text-gray-900">90.5%</p>
                        <p className="text-xs text-gray-500 mt-1">±50bps — prudent view</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 text-center border border-amber-200">
                        <p className="text-xs text-amber-700 font-medium mb-1">MA Target (2028)</p>
                        <p className="text-2xl font-bold text-amber-700">3.0%</p>
                        <p className="text-xs text-amber-600 mt-1">AOI margin — multi-year recovery</p>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-end text-sm">
                    <span className="text-gray-500 mr-2">Scenario MA Repricing Impact:</span>
                    <span className="font-bold text-[#003B2C]">
                        +${(impact.components.maPremiumRevenue / 1000).toFixed(1)}B HCB revenue @ {leverValues['ma-bid-year-premium-rate'] ?? 8.5}% rate increase
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
