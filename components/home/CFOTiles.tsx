'use client';

import { motion } from 'framer-motion';
import {
    ArrowRight,
    BarChart3,
    Building2,
    Clock,
    DollarSign,
    Globe,
    Landmark,
    Minus,
    PieChart,
    Scale,
    Shield,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { FinancialConfig, KPIConfig, KPIMetric } from '@/config/types';

// ── Types ────────────────────────────────────────────────────────────────────

type TileStatus = 'good' | 'warning' | 'critical';

export interface CFOTileData {
    id: string;
    insightId: number;
    categoryLabel: string;
    headlineValue: string;
    headlineLabel: string;
    trendDirection: 'up' | 'down' | 'flat';
    trendValue: string;
    status: TileStatus;
    contextLine: string;
    targetPercent?: number;
    targetLabel?: string;
    sparkline?: number[];
    href: string;
    icon: LucideIcon;
}

interface HomeTileSectionProps {
    sectionTitle: string;
    sectionSubtitle?: string;
    linkHref?: string;
    linkLabel?: string;
    tiles: CFOTileData[];
    variant: 'hero' | 'white';
    onTileClick: (tile: CFOTileData) => void;
}

// ── Status display helpers ───────────────────────────────────────────────────

const statusConfig = {
    good:     { bar: 'bg-[#003B2C]', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'On Track' },
    warning:  { bar: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Monitor' },
    critical: { bar: 'bg-red-500',   badge: 'bg-red-50 text-red-700 border-red-200', label: 'Below Target' },
};

const trendColor = {
    good: 'text-emerald-600',
    warning: 'text-amber-600',
    critical: 'text-red-600',
};

// ── Sparkline SVGs ──────────────────────────────────────────────────────────

function SparklineSVG({ points, status }: { points: number[]; status: TileStatus }) {
    if (points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const w = 80, h = 24, pad = 2;
    const coords = points.map((v, i) => {
        const x = pad + (i / (points.length - 1)) * (w - pad * 2);
        const y = pad + (1 - (v - min) / range) * (h - pad * 2);
        return `${x},${y}`;
    }).join(' ');
    const stroke = status === 'good' ? '#003B2C' : status === 'critical' ? '#ef4444' : '#f59e0b';
    return (
        <svg className="w-full h-6" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <polyline points={coords} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function HeroSparklineSVG({ points }: { points: number[] }) {
    if (points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const w = 80, h = 24, pad = 2;
    const coords = points.map((v, i) => {
        const x = pad + (i / (points.length - 1)) * (w - pad * 2);
        const y = pad + (1 - (v - min) / range) * (h - pad * 2);
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg className="w-full h-6" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
            <polyline points={coords} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Hero Tile Card (glassmorphism on dark green) ─────────────────────────────

function HeroTileCard({ tile, onClick }: { tile: CFOTileData; onClick: () => void }) {
    const TileIcon = tile.icon;
    const statusDot = tile.status === 'good' ? 'bg-emerald-400'
        : tile.status === 'warning' ? 'bg-amber-400'
        : 'bg-red-400';

    return (
        <motion.div
            whileHover={{ y: -6, transition: { duration: 0.15 } }}
            onClick={onClick}
            className="bg-white/10 backdrop-blur-md rounded-xl border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all cursor-pointer overflow-hidden group"
        >
            <div className="p-5">
                {/* Status dot + Category */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${statusDot}`} />
                    <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">
                        {tile.categoryLabel}
                    </span>
                    <div className="flex-1" />
                    <TileIcon className="w-4 h-4 text-white/30" />
                </div>

                {/* Headline number */}
                <div className="flex items-baseline space-x-2 mb-1">
                    <span className="text-2xl font-bold text-white">
                        {tile.headlineValue}
                    </span>
                </div>

                {/* KPI name */}
                <p className="text-xs font-medium text-white/70 mb-2">{tile.headlineLabel}</p>

                {/* Trend */}
                <div className="flex items-center space-x-1.5 mb-3">
                    {tile.trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                    {tile.trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
                    {tile.trendDirection === 'flat' && <Minus className="w-3.5 h-3.5 text-white/40" />}
                    <span className={`text-xs font-medium ${
                        tile.status === 'good' ? 'text-emerald-400' :
                        tile.status === 'critical' ? 'text-red-400' :
                        'text-amber-400'
                    }`}>
                        {tile.trendValue}
                    </span>
                </div>

                {/* Sparkline */}
                {tile.sparkline && (
                    <div className="mb-3">
                        <HeroSparklineSVG points={tile.sparkline} />
                    </div>
                )}

                {/* Context line */}
                <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">
                    {tile.contextLine}
                </p>
            </div>
        </motion.div>
    );
}

// ── White Tile Card (standard cards for white sections) ─────────────────────

function WhiteTileCard({ tile, onClick }: { tile: CFOTileData; onClick: () => void }) {
    const TileIcon = tile.icon;
    const sc = statusConfig[tile.status];

    return (
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.15 } }}
            onClick={onClick}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#003B2C]/20 transition-all cursor-pointer overflow-hidden group"
        >
            {/* Status accent bar */}
            <div className={`h-1 ${sc.bar}`} />

            <div className="p-5">
                {/* Category + Icon */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                        {tile.categoryLabel}
                    </span>
                    <TileIcon className="w-4 h-4 text-gray-300" />
                </div>

                {/* Headline number + status badge */}
                <div className="flex items-start justify-between mb-1">
                    <span className="text-2xl font-bold text-[#003B2C]">
                        {tile.headlineValue}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${sc.badge}`}>
                        {sc.label}
                    </span>
                </div>

                {/* KPI name */}
                <p className="text-xs font-medium text-gray-500 mb-2">{tile.headlineLabel}</p>

                {/* Trend */}
                <div className="flex items-center space-x-1.5 mb-3">
                    {tile.trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                    {tile.trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                    {tile.trendDirection === 'flat' && <Minus className="w-3.5 h-3.5 text-gray-400" />}
                    <span className={`text-xs font-medium ${trendColor[tile.status]}`}>
                        {tile.trendValue}
                    </span>
                </div>

                {/* Visual: Progress bar OR Sparkline */}
                {tile.targetPercent !== undefined && (
                    <div className="mb-3">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${sc.bar}`}
                                style={{ width: `${Math.min(tile.targetPercent, 100)}%` }}
                            />
                        </div>
                        {tile.targetLabel && (
                            <p className="text-[10px] text-gray-400 mt-1">{tile.targetLabel}</p>
                        )}
                    </div>
                )}

                {tile.sparkline && !tile.targetPercent && (
                    <div className="mb-3">
                        <SparklineSVG points={tile.sparkline} status={tile.status} />
                    </div>
                )}

                {/* Context line */}
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    {tile.contextLine}
                </p>
            </div>
        </motion.div>
    );
}

// ── Build tile data from config ──────────────────────────────────────────────

function findKPI(kpis: KPIMetric[], substr: string): KPIMetric | undefined {
    return kpis.find(k => k.label.toLowerCase().includes(substr.toLowerCase()));
}

function formatKpiHeadline(m: KPIMetric | undefined, fallback: string): string {
    if (!m) return fallback;
    const v = String(m.value);
    if (m.unit === '$') return `$${v}`;
    if (m.unit === 'B') return `$${v}${m.unit}`;
    if (m.unit === 'x') return `${v}${m.unit}`;
    if (m.unit === '%' || m.unit === '¢') return `${v}${m.unit}`;
    return v + (m.unit ? ` ${m.unit}` : '');
}

const FY25_GAAP_EPS_DISPLAY = 8.73; // BD FY2025 GAAP diluted EPS (approximate)

export function buildHomeTiles(kpis: KPIConfig, fin: FinancialConfig) {
    const revenue       = findKPI(kpis.primaryKPIs, 'Total Revenue') ?? findKPI(kpis.primaryKPIs, 'Revenue') ?? kpis.primaryKPIs[0];
    const revenueGrowth = findKPI(kpis.primaryKPIs, 'Revenue Growth');
    const margin        = findKPI(kpis.primaryKPIs, 'Adj. EBITDA Margin') ?? findKPI(kpis.primaryKPIs, 'Margin') ?? kpis.primaryKPIs[2];
    const dilutedEpsQ   = findKPI(kpis.primaryKPIs, 'Adj. EPS');
    const fcf           = findKPI(kpis.financialKPIs, 'FCF') ?? findKPI(kpis.financialKPIs, 'Free Cash Flow');
    const leverage      = findKPI(kpis.financialKPIs, 'Net Leverage');
    const casm          = findKPI(kpis.primaryKPIs, 'Medical Membership') ?? findKPI(kpis.operationalKPIs, 'Retail Script Share');
    const asms          = findKPI(kpis.primaryKPIs, 'Prescriptions Filled') ?? findKPI(kpis.operationalKPIs, 'Same-Store Revenue Growth');

    const digital   = findKPI(kpis.operationalKPIs, 'Prior Auth Approval Rate') ?? findKPI(kpis.primaryKPIs, 'Medical Benefit Ratio');

    const domesticShare = fin.segments.find(s => s.name.toLowerCase().includes('domestic'))?.revenuePercent;

    const epsTrend = fin.quarters.map(q => q.eps);

    const pretaxProxyB = fin.annualOperatingIncome > 0
        ? fin.annualOperatingIncome.toFixed(1)
        : '—';

    const dilNum = dilutedEpsQ ? Number(String(dilutedEpsQ.value).replace(/,/g, '')) : NaN;
    const earningsHeadline = Number.isFinite(dilNum) && dilNum >= 0
        ? `$${dilutedEpsQ!.value}`
        : `$${FY25_GAAP_EPS_DISPLAY}`;
    const earningsLabel = Number.isFinite(dilNum) && dilNum >= 0
        ? 'Diluted EPS (latest quarter)'
        : 'GAAP diluted EPS (FY25)';
    const earningsTrend = dilutedEpsQ?.trendValue || '+12.3% YoY (Q2 FY26 Adj. EPS $3.35 beat consensus)';

    const fcfHeadline = formatKpiHeadline(fcf, '$1.2B');

    const asmNote = asms?.trendValue
        ? ` GLP-1 device pipeline: ${asms.trendValue}.`
        : '';

    // ── Section 1: CFO Financial Scorecard (Hero) — earnings, FCF, rate base, O&M, revenue, capital ──
    const heroTiles: CFOTileData[] = [
        {
            id: 'earnings-profitability',
            insightId: 15,
            categoryLabel: 'Earnings & profitability',
            headlineValue: earningsHeadline,
            headlineLabel: earningsLabel,
            trendDirection: margin?.trend ?? 'up',
            trendValue: earningsTrend,
            status: margin?.status ?? 'good',
            contextLine: `Adj. operating income ~$${pretaxProxyB}B; BD FY26 guidance Adj. EPS ~$13.25–$13.50; BD Simplify cost program targeting $300M+ annual run-rate savings.`,
            sparkline: epsTrend.length >= 3 ? epsTrend : undefined,
            href: '/executive-summary',
            icon: BarChart3,
        },
        {
            id: 'free-cash-flow',
            insightId: 11,
            categoryLabel: 'Free cash flow',
            headlineValue: fcfHeadline,
            headlineLabel: 'Free cash flow (latest quarter)',
            trendDirection: fcf?.trend ?? 'up',
            trendValue: fcf?.trendValue ?? 'FCF conversion 85%+ target — BD Simplify cash costs normalizing',
            status: fcf?.status ?? 'good',
            contextLine: 'BD FCF supports dividend and debt reduction; FY26 FCF guidance ~$2.2–$2.5B; net leverage reduction to <2.5x is a CFO priority following BD Diagnostics spin-off and portfolio optimization.',
            href: '/executive-summary',
            icon: DollarSign,
        },
        {
            id: 'balance-sheet',
            insightId: 12,
            categoryLabel: 'Balance sheet / leverage',
            headlineValue: formatKpiHeadline(leverage, '16.2%'),
            headlineLabel: 'Net Debt / EBITDA',
            trendDirection: leverage?.trend ?? 'flat',
            trendValue: leverage?.trendValue ?? 'Target <2.5x · IG at three agencies',
            status: leverage?.status ?? 'good',
            contextLine: 'Net leverage ~2.5x; LTD ~$17B; BD targets leverage reduction to <2.5x by FY27. Dividend maintained and growing. Investment-grade rated at all three agencies.',
            href: '/executive-summary',
            icon: Scale,
        },
        {
            id: 'medical-membership',
            insightId: 10,
            categoryLabel: 'Organic revenue growth',
            headlineValue: formatKpiHeadline(casm, '26.0M'),
            headlineLabel: 'Organic revenue growth (FXN, ex-acq.)',
            trendDirection: casm?.trend ?? 'flat',
            trendValue: casm?.trendValue ?? 'BioPharma Systems & Interventional outperforming — GLP-1 device demand accelerating',
            status: casm?.status ?? 'good',
            contextLine: 'BD organic revenue growth (FXN) on track; BioPharma Systems GLP-1 device category growing 25%+ YoY; Interventional segment gaining share in surgical and vascular. China VoBP headwind partially offset by emerging markets.',
            href: '/executive-summary',
            icon: Target,
        },
        {
            id: 'revenue-capacity',
            insightId: 3,
            categoryLabel: 'Revenue growth',
            headlineValue: revenueGrowth ? `${revenueGrowth.value}${revenueGrowth.unit}` : formatKpiHeadline(revenue, '$2.2B'),
            headlineLabel: revenueGrowth ? 'Revenue growth (YoY)' : 'Q1 FY26 total revenue',
            trendDirection: revenueGrowth?.trend ?? revenue?.trend ?? 'flat',
            trendValue: revenueGrowth?.trendValue ?? revenue?.trendValue ?? '—',
            status: revenueGrowth?.status ?? revenue?.status ?? 'good',
            contextLine: `Q2 FY26 revenue $4.7B (+5.0% organic); BioPharma Systems GLP-1 device and Medical Essentials hospital channel are primary growth drivers. FY26 full-year revenue guidance ~$19.8–20.0B.`,
            href: '/executive-summary',
            icon: TrendingUp,
        },
        {
            id: 'capital-allocation',
            insightId: 8,
            categoryLabel: 'Capital allocation',
            headlineValue: fin.ratios?.dividendPerShare != null && fin.ratios.dividendPerShare > 0
                ? `$${fin.ratios.dividendPerShare.toFixed(2)}`
                : '$4.00',
            headlineLabel: 'Annual dividend (indicative)',
            trendDirection: 'up',
            trendValue: 'Invest · maintain IG · grow dividend',
            status: 'good',
            contextLine: 'Priorities: reduce net leverage to <2.5x by FY27; maintain and grow dividend; grow Adj. EPS 8–10% per year through BD Simplify savings, GLP-1 device volume, and Alaris market return; fund strategic acquisitions.',
            href: '/executive-summary',
            icon: PieChart,
        },
    ];

    // ── Section 2: Strategic Execution (White) ────────────────────────
    const strategicTiles: CFOTileData[] = [
        {
            id: 'biopharma-glp1',
            insightId: 4,
            categoryLabel: 'BioPharma Systems — GLP-1 Devices',
            headlineValue: '+28%',
            headlineLabel: 'GLP-1 Device Category Growth (Q2 FY26)',
            trendDirection: 'up',
            trendValue: 'Prefillable syringe demand accelerating — manufacturer orders above plan',
            status: 'good',
            contextLine: 'BD BioPharma Systems GLP-1 prefillable syringe revenue +28% YoY in Q2 FY26. GLP-1 drug manufacturers scaling production globally; BD is a leading supplier of device components. Each $100M incremental BioPharma revenue ≈ +$0.06 Adj. EPS.',
            sparkline: [18, 20, 22, 24, 26, 28],
            href: '/executive-summary',
            icon: TrendingUp,
        },
        {
            id: 'alaris-ramp',
            insightId: 5,
            categoryLabel: 'Connected Care — Alaris Return',
            headlineValue: '80',
            headlineLabel: 'Alaris Pump Placements (Q2 FY26, quarterly)',
            trendDirection: 'up',
            trendValue: 'Consent decree remediation ahead of schedule',
            status: 'good',
            contextLine: 'BD Alaris infusion pump placements ramping as consent decree remediation progresses. Hospital procurement pipelines building. FY27 target: 150-200 placements/quarter representing $90-120M quarterly Connected Care uplift.',
            sparkline: [10, 20, 35, 50, 65, 80],
            href: '/executive-summary',
            icon: BarChart3,
        },
        {
            id: 'bd-simplify',
            insightId: 8,
            categoryLabel: 'BD Simplify Cost Program',
            headlineValue: '$120M',
            headlineLabel: 'Quarterly Run-Rate Savings (Q2 FY26)',
            trendDirection: 'up',
            trendValue: '$300M+ annual run-rate target by FY27 — on track',
            status: 'good',
            contextLine: 'BD Simplify transformation program targeting $300M+ annual run-rate cost savings by FY27. Manufacturing footprint optimization, procurement savings, and SG&A efficiency are primary drivers. Q2 FY26 run-rate tracking to plan.',
            sparkline: [40, 65, 85, 100, 110, 120],
            href: '/executive-summary',
            icon: DollarSign,
        },
        {
            id: 'interventional-share',
            insightId: 10,
            categoryLabel: 'Interventional Segment',
            headlineValue: '+6.2%',
            headlineLabel: 'Interventional Organic Growth (Q2 FY26)',
            trendDirection: 'up',
            trendValue: 'Vascular and surgical gaining procedural volume share',
            status: 'good',
            contextLine: 'BD Interventional segment organic growth +6.2% in Q2 FY26; vascular (peripheral intervention, electrophysiology) and surgical (hernia repair, biosurgery) gaining hospital market share. Interventional represents ~22% of BD revenue with higher margin profile.',
            sparkline: [4.2, 4.8, 5.2, 5.6, 5.9, 6.2],
            href: '/executive-summary',
            icon: Target,
        },
    ];

    // ── Section 3: Risk & Growth Radar — BD regulatory and capital structure risks ──
    const riskTiles: CFOTileData[] = [
        {
            id: 'china-vobp-risk',
            insightId: 1,
            categoryLabel: 'China VoBP headwind',
            headlineValue: '$150M',
            headlineLabel: 'FY26 China VoBP Revenue Headwind (plan)',
            trendDirection: 'down',
            trendValue: 'VoBP Round 9 expansion risk — $220-280M adverse scenario',
            status: 'warning',
            contextLine: 'China VoBP (Volume-Based Procurement) planned headwind $150M in FY26. VoBP Round 9 may expand to additional BD product categories (Medical Essentials, Interventional). Each $100M incremental headwind ≈ -$0.06 Adj. EPS. Emerging markets offset partially mitigates.',
            sparkline: [30, 60, 90, 110, 130, 150],
            href: '/business-consoles/biopharma-systems',
            icon: Globe,
        },
        {
            id: 'fx-headwind',
            insightId: 6,
            categoryLabel: 'FX translation headwind',
            headlineValue: '-$50M',
            headlineLabel: 'Quarterly FX Translation Impact (Q2 FY26)',
            trendDirection: 'down',
            trendValue: '~50% international revenue — EUR, CNY, JPY exposure',
            status: 'warning',
            contextLine: '~50% of BD revenue is international; FX translation is a persistent headwind when USD strengthens. BD hedging program partially offsets. Q2 FY26 FX headwind -$50M vs. plan. Each $50M FX headwind ≈ -$0.03 Adj. EPS.',
            sparkline: [-80, -70, -65, -60, -55, -50],
            href: '/executive-summary',
            icon: Globe,
        },
        {
            id: 'alaris-execution-risk',
            insightId: 7,
            categoryLabel: 'Alaris execution risk',
            headlineValue: 'Q4 FY26',
            headlineLabel: 'Estimated Consent Decree Resolution (target)',
            trendDirection: 'flat',
            trendValue: 'FDA inspection complete — formal lift timing uncertain',
            status: 'warning',
            contextLine: 'BD Alaris consent decree formal resolution timing remains uncertain. Hospital procurement cycle adds 6-9 months lag after formal FDA lift. Upside scenario requires $120M CapEx commitment. Each quarter delay ≈ -40 placements and -$24M Connected Care revenue.',
            sparkline: [10, 20, 35, 50, 60, 70],
            href: '/executive-summary',
            icon: Shield,
        },
        {
            id: 'net-leverage',
            insightId: 14,
            categoryLabel: 'Net leverage',
            headlineValue: '~2.5x',
            headlineLabel: 'Net Debt / EBITDA (Q2 FY26)',
            trendDirection: 'down',
            trendValue: 'Target <2.5x by FY27 — debt reduction priority',
            status: 'good',
            contextLine: 'BD net leverage ~2.5x post BD Diagnostics spin-off; target <2.5x maintained by FY27 as FCF generation improves. Annual FCF guidance ~$2.2–$2.5B is primary deleveraging mechanism. Investment-grade maintained at all three agencies.',
            sparkline: [3.2, 3.0, 2.9, 2.8, 2.6, 2.5],
            href: '/executive-summary',
            icon: DollarSign,
        },
    ];

    return { heroTiles, strategicTiles, riskTiles };
}

// ── Main Section Component ──────────────────────────────────────────────────

export default function HomeTileSection({
    sectionTitle,
    sectionSubtitle,
    linkHref,
    linkLabel,
    tiles,
    variant,
    onTileClick,
}: HomeTileSectionProps) {
    const TileComponent = variant === 'hero' ? HeroTileCard : WhiteTileCard;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className={`text-lg font-bold ${variant === 'hero' ? 'text-white' : 'text-gray-900'}`}>
                        {sectionTitle}
                    </h2>
                    {sectionSubtitle && (
                        <p className={`text-xs mt-0.5 ${variant === 'hero' ? 'text-white/50' : 'text-gray-500'}`}>
                            {sectionSubtitle}
                        </p>
                    )}
                </div>
                {linkHref && linkLabel && (
                    <Link
                        href={linkHref}
                        className={`inline-flex items-center text-sm font-medium transition-colors ${
                            variant === 'hero'
                                ? 'text-white/70 hover:text-white'
                                : 'text-[#003B2C] hover:text-[#003B2C]'
                        }`}
                    >
                        {linkLabel} <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                )}
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${(tiles?.length ?? 0) > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
                {(tiles ?? []).map(tile => (
                    <TileComponent
                        key={tile.id}
                        tile={tile}
                        onClick={() => onTileClick(tile)}
                    />
                ))}
            </div>
        </div>
    );
}
