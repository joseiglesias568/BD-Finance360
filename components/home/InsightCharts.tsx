'use client';

import type { InsightChartData, InsightChartDataPoint, InsightChartTrendPoint, WaterfallStep } from '@/config/types';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

// ── Shared styling ─────────────────────────────────────────────────────────────

const COLORS = {
    green: '#003B2C',
    greenLight: '#007A3D',
    emerald: '#10B981',
    blue: '#3B82F6',
    amber: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    gray: '#9CA3AF',
    grayLight: '#E5E7EB',
    teal: '#14B8A6',
    indigo: '#6366F1',
};

const FILL_COLORS = [COLORS.green, COLORS.amber, COLORS.blue, COLORS.teal, COLORS.gray, COLORS.grayLight];

const axisStyle = { fontSize: 10, fill: '#6B7280' };
const tooltipStyle = {
    contentStyle: {
        background: '#003B2C',
        border: 'none',
        borderRadius: 8,
        fontSize: 11,
        color: '#fff',
        padding: '6px 10px',
    },
    itemStyle: { color: '#fff', fontSize: 11 },
    labelStyle: { color: '#fff', fontSize: 11, fontWeight: 600 },
};

// ── 1. Global network revenue share (id=1) — Horizontal bar: share-of-market breakdown ──

function MarketShareChart({ data, trendData }: { data: InsightChartDataPoint[]; trendData?: InsightChartTrendPoint[] }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Global U.S. Network Airline Revenue Share</span>
                <span className="text-[10px] text-gray-400">FY2025</span>
            </div>
            <ResponsiveContainer width="100%" height={130}>
                <BarChart data={data as any[]} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 15]} tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#374151' }} axisLine={false} tickLine={false} width={75} />
                    <Tooltip {...tooltipStyle} formatter={(value: number) => [`${value}%`, 'Share']} />
                    <Bar dataKey="share" radius={[0, 4, 4, 0]} barSize={14}>
                        {data.map((entry, i) => (
                            <Cell key={i} fill={FILL_COLORS[i % FILL_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            {/* Trend sparkline */}
            {trendData && trendData.length > 0 && (
                <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
                    <span className="text-[9px] text-gray-400 w-16">4Q Trend</span>
                    <ResponsiveContainer width="100%" height={28}>
                        <AreaChart data={trendData as any[]} margin={{ top: 2, right: 4, left: 4, bottom: 2 }}>
                            <Area type="monotone" dataKey="delta" stroke={COLORS.green} fill={COLORS.green} fillOpacity={0.1} strokeWidth={1.5} dot={false} />
                            <Area type="monotone" dataKey="united" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.1} strokeWidth={1.5} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#003B2C]" />
                            <span className="text-[8px] text-gray-400">BD</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-[8px] text-gray-400">Peer</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 2. Industry revenue / volume trend (id=2) — Quarterly trend with recovery trajectory ─────

function TransactionVolumeChart({ data, breakdowns }: { data: InsightChartDataPoint[]; breakdowns?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Industry Passenger Revenue (% YoY)</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-[#003B2C] rounded" /><span className="text-[9px] text-gray-400">Actual</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-amber-400 rounded" style={{ borderTop: '1px dashed #F59E0B' }} /><span className="text-[9px] text-gray-400">Forecast</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-gray-300 rounded" /><span className="text-[9px] text-gray-400">Target</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <ComposedChart data={data as any[]} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="q" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[-20, 15]} />
                    <Tooltip {...tooltipStyle} formatter={(value: number, name: string) => [`${value}%`, name === 'comp' ? 'Volume Change' : 'Target']} />
                    <ReferenceLine y={0} stroke="#D1D5DB" strokeWidth={1.5} />
                    <Bar dataKey="comp" radius={[3, 3, 0, 0]} barSize={24}>
                        {data.map((entry, i) => (
                            <Cell key={i} fill={(entry.comp as number) >= 0 ? COLORS.emerald : COLORS.red} opacity={String(entry.q).includes('E') ? 0.5 : 1} />
                        ))}
                    </Bar>
                    <Line type="monotone" dataKey="target" stroke={COLORS.grayLight} strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>
            {breakdowns && (
                <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Domestic</p>
                        <p className={`text-xs font-bold ${breakdowns.ticket?.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{breakdowns.ticket}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Atlantic</p>
                        <p className={`text-xs font-bold ${breakdowns.traffic?.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{breakdowns.traffic}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Latin</p>
                        <p className={`text-xs font-bold ${breakdowns.morning?.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{breakdowns.morning}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Pacific</p>
                        <p className={`text-xs font-bold ${breakdowns.afternoon?.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{breakdowns.afternoon}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 3. Revenue by Segment (id=3) — Stacked bar by segment ───────────────────────

function RevenueChart({ data, growth }: { data: InsightChartDataPoint[]; growth?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Revenue by Segment ($B)</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#003B2C]" /><span className="text-[9px] text-gray-400">Mainline</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-blue-500" /><span className="text-[9px] text-gray-400">Regional</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-400" /><span className="text-[9px] text-gray-400">Loyalty / Other</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <BarChart data={data as any[]} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="q" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}B`} domain={[0, 12]} />
                    <Tooltip
                        {...tooltipStyle}
                        formatter={(value: number, name: string) => [`$${value.toFixed(2)}B`, name === 'NA' ? 'Mainline passenger' : name === 'Intl' ? 'Regional & intl' : 'Loyalty / other']}
                    />
                    <Bar dataKey="NA" stackId="a" fill={COLORS.green} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Intl" stackId="a" fill={COLORS.blue} />
                    <Bar dataKey="Channel" stackId="a" fill={COLORS.amber} radius={[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            {growth && (
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-[9px] text-gray-400">Mainline</p>
                        <p className={`text-xs font-bold ${growth.na?.startsWith('+') ? 'text-emerald-600' : 'text-gray-500'}`}>{growth.na}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] text-gray-400">Regional / intl</p>
                        <p className={`text-xs font-bold ${growth.intl?.startsWith('+') ? 'text-emerald-600' : 'text-gray-500'}`}>{growth.intl}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] text-gray-400">Loyalty / other</p>
                        <p className={`text-xs font-bold ${growth.channel?.startsWith('+') ? 'text-emerald-600' : 'text-gray-500'}`}>{growth.channel}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 4. Loyalty & digital engagement (id=4) — Area chart: portfolio + retention ─

function PortfolioRetentionChart({ data, stats }: { data: InsightChartDataPoint[]; stats?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Managed Portfolio (B sqft) & Retention (%)</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#003B2C]" /><span className="text-[9px] text-gray-400">Portfolio</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-indigo-500" /><span className="text-[9px] text-gray-400">Retention</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <ComposedChart data={data as any[]} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="q" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={axisStyle} axisLine={false} tickLine={false} domain={[6, 10]} tickFormatter={(v) => `${v}B`} />
                    <YAxis yAxisId="right" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} domain={[85, 98]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip {...tooltipStyle} formatter={(value: number, name: string) => [name === 'members' ? `${value}B sqft` : `${value}%`, name === 'members' ? 'Portfolio Size' : 'Client Retention']} />
                    <Area yAxisId="left" type="monotone" dataKey="members" stroke={COLORS.green} fill={COLORS.green} fillOpacity={0.12} strokeWidth={2} dot={{ r: 2, fill: COLORS.green }} />
                    <Line yAxisId="right" type="monotone" dataKey="revShare" stroke={COLORS.indigo} strokeWidth={2} dot={{ r: 2, fill: COLORS.indigo }} />
                </ComposedChart>
            </ResponsiveContainer>
            {stats && (
                <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Net Growth</p>
                        <p className="text-xs font-bold text-emerald-600">{stats.netGrowth}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Digital Pct</p>
                        <p className="text-xs font-bold text-emerald-600">{stats.mopMix}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Rev/Client</p>
                        <p className="text-xs font-bold text-gray-900">{stats.spendPerMember}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 5. Office Occupancy & Leasing (id=5) — Line chart: occupancy trend ──────

function OccupancyChart({ data, stats }: { data: InsightChartDataPoint[]; stats?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Office Occupancy Rate (%) & Leasing Volume</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-[#003B2C] rounded" /><span className="text-[9px] text-gray-400">Occupancy</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-gray-300 rounded" /><span className="text-[9px] text-gray-400">Target</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-teal-400 opacity-40" /><span className="text-[9px] text-gray-400">Leasing Vol</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <ComposedChart data={data as any[]} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={axisStyle} axisLine={false} tickLine={false} domain={[75, 95]} tickFormatter={(v) => `${v}%`} />
                    <YAxis yAxisId="right" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} domain={[50, 120]} tickFormatter={(v) => `${v}M`} />
                    <Tooltip
                        {...tooltipStyle}
                        formatter={(value: number, name: string) => {
                            if (name === 'throughput') return [`${value}M sqft`, 'Leasing Vol'];
                            return [`${value}%`, name === 'time' ? 'Occupancy' : 'Target'];
                        }}
                    />
                    <Area yAxisId="right" type="monotone" dataKey="throughput" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.1} strokeWidth={0} />
                    <Line yAxisId="left" type="monotone" dataKey="time" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 2, fill: COLORS.green }} />
                    <Line yAxisId="left" type="monotone" dataKey="target" stroke={COLORS.grayLight} strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>
            {stats && (
                <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">RTO Trend</p>
                        <p className="text-xs font-bold text-emerald-600">{stats.primaryStat}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Leasing Vol</p>
                        <p className="text-xs font-bold text-emerald-600">{stats.peakThroughput}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Client NPS</p>
                        <p className="text-xs font-bold text-gray-900">{stats.csatScore}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 6. Regional Revenue & Market Position (id=6) — Dual: revenue trend + competitive ───

function RegionalChart({ data, stats }: { data: InsightChartDataPoint[]; stats?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Regional Revenue Growth & Market Position</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#003087]" /><span className="text-[9px] text-gray-400">BD</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-red-400" /><span className="text-[9px] text-gray-400">Peer</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <ComposedChart data={data as any[]} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="q" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[-5, 15]} />
                    <YAxis yAxisId="right" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}B`} domain={[8000, 12000]} />
                    <Tooltip
                        {...tooltipStyle}
                        formatter={(value: number, name: string) => {
                            if (name === 'comp') return [`${value}%`, 'Revenue Growth'];
                            return [`$${(value / 1000).toFixed(1)}B`, name === 'vznRevenue' ? 'BD Revenue' : 'Peer Revenue'];
                        }}
                    />
                    <ReferenceLine yAxisId="left" y={0} stroke="#D1D5DB" strokeWidth={1} />
                    <Bar yAxisId="left" dataKey="comp" fill={COLORS.green} radius={[3, 3, 0, 0]} barSize={20} opacity={0.8} />
                    <Line yAxisId="right" type="monotone" dataKey="vznRevenue" stroke={COLORS.green} strokeWidth={2} dot={{ r: 2.5, fill: COLORS.green }} />
                    <Line yAxisId="right" type="monotone" dataKey="peerRevenue" stroke={COLORS.red} strokeWidth={2} dot={{ r: 2.5, fill: COLORS.red }} />
                </ComposedChart>
            </ResponsiveContainer>
            {stats && (
                <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">BD Rev</p>
                        <p className="text-xs font-bold text-gray-900">{stats.vznRevenue}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Peer avg</p>
                        <p className="text-xs font-bold text-red-500">{stats.peerRevenue}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Share Gap</p>
                        <p className="text-xs font-bold text-emerald-600">{stats.qRevenue}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 7. Operating Margin (id=7) — Waterfall / bridge showing margin recovery ───

function MarginChart({ waterfallSteps, stats }: { waterfallSteps: WaterfallStep[]; stats?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Margin Bridge: FY24 &rarr; FY26E</span>
                <span className="text-[10px] text-gray-400">Operating Margin %</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <BarChart data={waterfallSteps} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 14]} />
                    <Tooltip
                        {...tooltipStyle}
                        formatter={(value: number, name: string) => {
                            if (name === 'base') return null;
                            return [`${value.toFixed(1)}%`, 'Change'];
                        }}
                    />
                    <Bar dataKey="base" stackId="a" fill="transparent" />
                    <Bar dataKey="value" stackId="a" radius={[3, 3, 0, 0]}>
                        {waterfallSteps.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            {stats && (
                <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Personnel</p>
                        <p className="text-xs font-bold text-red-500">{stats.personnelCost}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Tech Invest</p>
                        <p className="text-xs font-bold text-emerald-600">{stats.laborPctRev}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Target</p>
                        <p className="text-xs font-bold text-gray-900">{stats.target}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 8. Service Line Mix (id=8) — Stacked area: transactional vs resilient mix ────

function ServiceMixChart({ data, stats }: { data: InsightChartDataPoint[]; stats?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Transactional vs Resilient Revenue Mix</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-blue-500" /><span className="text-[9px] text-gray-400">Resilient</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-400" /><span className="text-[9px] text-gray-400">Transact.</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-[#003B2C] rounded" /><span className="text-[9px] text-gray-400">Margin</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <ComposedChart data={data as any[]} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="q" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[7, 12]} />
                    <Tooltip
                        {...tooltipStyle}
                        formatter={(value: number, name: string) => {
                            if (name === 'ticket') return [`${value.toFixed(1)}%`, 'Op Margin'];
                            return [`${value}%`, name === 'cold' ? 'Resilient' : 'Transactional'];
                        }}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="cold" stackId="1" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.3} strokeWidth={0} />
                    <Area yAxisId="left" type="monotone" dataKey="hot" stackId="1" stroke={COLORS.amber} fill={COLORS.amber} fillOpacity={0.2} strokeWidth={0} />
                    <Line yAxisId="right" type="monotone" dataKey="ticket" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 2.5, fill: COLORS.green }} />
                </ComposedChart>
            </ResponsiveContainer>
            {stats && (
                <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Resilient %</p>
                        <p className="text-xs font-bold text-emerald-600">{stats.coldTicket}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Transact. %</p>
                        <p className="text-xs font-bold text-gray-500">{stats.hotTicket}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Mix Shift</p>
                        <p className="text-xs font-bold text-emerald-600">{stats.mixShiftImpact}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 10. Digital Transformation Progress (id=10) — Platform adoption progress ────────────

function DigitalProgressChart({ data, breakdowns }: { data: InsightChartDataPoint[]; breakdowns?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Digital Transformation Progress</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#003B2C]" /><span className="text-[9px] text-gray-400">Adoption</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-gray-300 rounded" /><span className="text-[9px] text-gray-400">Target</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <ComposedChart data={data as any[]} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="q" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip {...tooltipStyle} formatter={(value: number, name: string) => [`${value}%`, name === 'comp' ? 'Platform Adoption' : 'Target']} />
                    <Bar dataKey="comp" radius={[3, 3, 0, 0]} barSize={24}>
                        {data.map((entry, i) => (
                            <Cell key={i} fill={COLORS.green} opacity={String(entry.q).includes('E') ? 0.5 : 1} />
                        ))}
                    </Bar>
                    <Line type="monotone" dataKey="target" stroke={COLORS.grayLight} strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>
            {breakdowns && (
                <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Adoption</p>
                        <p className="text-xs font-bold text-emerald-600">{breakdowns.ticket}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Target</p>
                        <p className="text-xs font-bold text-gray-500">{breakdowns.traffic}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Revenue</p>
                        <p className="text-xs font-bold text-emerald-600">{breakdowns.morning}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Progress</p>
                        <p className="text-xs font-bold text-blue-600">{breakdowns.afternoon}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 12. Interest Rate Sensitivity (id=12) — Rate trend & demand proxy ─────────────

function InterestRateChart({ data, stats }: { data: InsightChartDataPoint[]; stats?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Fed Funds Rate vs. Industry Demand Proxy</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-red-500 rounded" /><span className="text-[9px] text-gray-400">Fed Rate</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-gray-300 rounded" /><span className="text-[9px] text-gray-400">Neutral</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <LineChart data={data as any[]} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v.toFixed(1)}%`} domain={[2, 6]} />
                    <Tooltip {...tooltipStyle} formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name === 'time' ? 'Fed Funds Rate' : 'Neutral Rate']} />
                    <Line type="monotone" dataKey="time" stroke={COLORS.red} strokeWidth={2} dot={{ r: 2.5, fill: COLORS.red }} />
                    <Line type="monotone" dataKey="target" stroke={COLORS.grayLight} strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                </LineChart>
            </ResponsiveContainer>
            {stats && (
                <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Current Rate</p>
                        <p className="text-xs font-bold text-red-500">{stats.primaryStat}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Year-End Est</p>
                        <p className="text-xs font-bold text-emerald-600">{stats.peakThroughput}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Tx Vol Impact</p>
                        <p className="text-xs font-bold text-blue-600">{stats.csatScore}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 14. Revenue by Service Line (id=14) — Revenue by service mix ────────────────────

function ServiceLineChart({ data, growth }: { data: InsightChartDataPoint[]; growth?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Revenue by Service Line (%)</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#003B2C]" /><span className="text-[9px] text-gray-400">Leasing</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-blue-500" /><span className="text-[9px] text-gray-400">Cap Mkts</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-400" /><span className="text-[9px] text-gray-400">FM</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <BarChart data={data as any[]} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="q" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip
                        {...tooltipStyle}
                        formatter={(value: number, name: string) => [`${value}%`, name === 'NA' ? 'Leasing' : name === 'Intl' ? 'Capital Markets' : 'Facilities Mgmt']}
                    />
                    <Bar dataKey="NA" stackId="a" fill={COLORS.green} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Intl" stackId="a" fill={COLORS.blue} />
                    <Bar dataKey="Channel" stackId="a" fill={COLORS.amber} radius={[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            {growth && (
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-[9px] text-gray-400">{growth.na}</p>
                        <p className="text-xs font-bold text-gray-500">28%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] text-gray-400">{growth.intl}</p>
                        <p className="text-xs font-bold text-blue-600">15%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] text-gray-400">{growth.channel}</p>
                        <p className="text-xs font-bold text-emerald-600">57% (+2pp)</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── 15. Non-GAAP EPS (id=15) — Quarterly EPS trajectory ──────────────────────

function EPSChart({ data, breakdowns }: { data: InsightChartDataPoint[]; breakdowns?: Record<string, string> }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Non-GAAP EPS Trajectory ($/share)</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#003B2C]" /><span className="text-[9px] text-gray-400">Actual</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-gray-300 rounded" /><span className="text-[9px] text-gray-400">Target</span></div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
                <ComposedChart data={data as any[]} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="q" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toFixed(2)}`} domain={[0, 4.0]} />
                    <Tooltip {...tooltipStyle} formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === 'comp' ? 'Non-GAAP EPS' : 'Target']} />
                    <Bar dataKey="comp" radius={[3, 3, 0, 0]} barSize={24}>
                        {data.map((entry, i) => (
                            <Cell key={i} fill={COLORS.green} opacity={String(entry.q).includes('E') ? 0.5 : 1} />
                        ))}
                    </Bar>
                    <Line type="monotone" dataKey="target" stroke={COLORS.amber} strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>
            {breakdowns && (
                <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Non-GAAP</p>
                        <p className="text-xs font-bold text-emerald-600">{breakdowns.ticket}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">GAAP</p>
                        <p className="text-xs font-bold text-red-500">{breakdowns.traffic}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">Gap</p>
                        <p className="text-xs font-bold text-amber-600">{breakdowns.morning}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-400">FY26 Est</p>
                        <p className="text-xs font-bold text-blue-600">{breakdowns.afternoon}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Export: map insight id -> chart ─────────────────────────────────────────────

export function InsightChart({ insightId, chartData }: { insightId: number; chartData?: InsightChartData }) {
    if (!chartData) {
        return <div className="text-xs text-gray-400 text-center py-8">No chart data available</div>;
    }

    switch (insightId) {
        case 1: return <MarketShareChart data={chartData.data} trendData={chartData.trendData} />;
        case 2: return <TransactionVolumeChart data={chartData.data} breakdowns={chartData.breakdowns} />;
        case 3: return <RevenueChart data={chartData.data} growth={chartData.growth} />;
        case 4: return <PortfolioRetentionChart data={chartData.data} stats={chartData.stats} />;
        case 5: return <OccupancyChart data={chartData.data} stats={chartData.stats} />;
        case 6: return <RegionalChart data={chartData.data} stats={chartData.stats} />;
        case 7: return <MarginChart waterfallSteps={chartData.waterfallSteps || []} stats={chartData.stats} />;
        case 8: return <ServiceMixChart data={chartData.data} stats={chartData.stats} />;
        case 10: return <DigitalProgressChart data={chartData.data} breakdowns={chartData.breakdowns} />;
        case 12: return <InterestRateChart data={chartData.data} stats={chartData.stats} />;
        case 14: return <ServiceLineChart data={chartData.data} growth={chartData.growth} />;
        case 15: return <EPSChart data={chartData.data} breakdowns={chartData.breakdowns} />;
        default: return <TransactionVolumeChart data={chartData.data} breakdowns={chartData.breakdowns} />;
    }
}
