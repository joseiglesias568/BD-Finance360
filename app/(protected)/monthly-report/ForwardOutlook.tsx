'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { StrategicConfig, FinancialConfig } from '@/config/types';
import { formatBudget } from '@/lib/engines/formatting-engine';
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_TOOLTIP_DARK, CHART_GRID_STYLE } from '@/lib/chart-theme';

interface ForwardOutlookProps {
  periodLabel: string;
  strategic: StrategicConfig;
  financials?: FinancialConfig;
}

export default function ForwardOutlook({ periodLabel, strategic, financials }: ForwardOutlookProps) {
  const forwardOutlook = strategic?.forwardOutlook ?? [];
  const keyOpportunities = strategic?.keyOpportunities ?? [];
  const quarters = financials?.quarters ?? [];
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>(null);

  // The last entry in quarters is the latest actual period (e.g. "Q1 FY26").
  // forwardOutlook may include that same period as its first entry (bridge point),
  // which would create a duplicate X label on the chart. Filter it out of the
  // forecast section so each period appears exactly once, with the actual value
  // shown for the last actual quarter and the forecast line starting from there.
  const lastActualLabel = quarters.length > 0 ? quarters[quarters.length - 1].quarter : null;

  // Build forecast trajectory data: actuals from quarters + forecast periods
  const trajectoryData = [
    ...quarters.map(q => ({
      period: q.quarter,
      revenue: q.revenue,
      margin: q.operatingMargin,
      type: 'actual' as const,
    })),
    ...forwardOutlook
      .filter(f => f.period !== lastActualLabel) // avoid duplicating the bridge quarter
      .map(f => ({
        period: f.period,
        revenue: f.revenueForcast,
        revenuePlan: f.revenuePlan,
        // ±5% sensitivity band around forecast revenue for forecast periods
        revenueHigh: f.revenueForcast ? parseFloat((f.revenueForcast * 1.05).toFixed(1)) : undefined,
        revenueLow: f.revenueForcast ? parseFloat((f.revenueForcast * 0.95).toFixed(1)) : undefined,
        margin: f.marginForecast,
        marginPlan: f.marginPlan,
        type: 'forecast' as const,
      })),
  ];

  // Opportunity pipeline data sorted by revenue impact.
  // Parse strings like "+$1.5B" → 1.5 or "+$800M" → 0.8 (normalise to $B).
  const opportunityData = [...keyOpportunities]
    .map(opp => {
      const match = opp.revenueImpact.match(/([\d.]+)\s*([MB]?)/i);
      const raw = match ? parseFloat(match[1]) : 0;
      const unit = match ? match[2].toUpperCase() : 'B';
      const numValue = unit === 'M' ? raw / 1000 : raw; // convert $M → $B
      return {
        name: opp.title.length > 28 ? opp.title.slice(0, 26) + '...' : opp.title,
        fullName: opp.title,
        impact: numValue,
        timeline: opp.timeline,
        description: opp.description,
      };
    })
    .sort((a, b) => b.impact - a.impact);

  return (
    <div className="space-y-8">
      {/* Section A: Forecast Trajectory Chart */}
      {trajectoryData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Revenue & Margin Trajectory</h2>
          <p className="text-xs text-gray-500 mb-4">Quarterly actuals with forward forecast — dashed line = plan</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trajectoryData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis
                  yAxisId="revenue"
                  tick={CHART_AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `$${v}B`}
                  domain={['auto', 'auto']}
                />
                <YAxis
                  yAxisId="margin"
                  orientation="right"
                  tick={CHART_AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}%`}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  {...CHART_TOOLTIP_DARK}
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue' || name === 'revenuePlan') return [`$${value.toFixed(1)}B`, name === 'revenuePlan' ? 'Revenue Plan' : 'Revenue'];
                    return [`${value.toFixed(1)}%`, name === 'marginPlan' ? 'Margin Plan' : 'Margin'];
                  }}
                />
                {/* Sensitivity band — ±5% around forecast revenue */}
                <Area
                  yAxisId="revenue"
                  dataKey="revenueHigh"
                  fill={CHART_COLORS.greenSoft}
                  stroke="none"
                  fillOpacity={0.15}
                  dot={false}
                  connectNulls={false}
                  legendType="none"
                  tooltipType="none"
                />
                <Area
                  yAxisId="revenue"
                  dataKey="revenueLow"
                  fill="#ffffff"
                  stroke="none"
                  fillOpacity={1}
                  dot={false}
                  connectNulls={false}
                  legendType="none"
                  tooltipType="none"
                />
                {/* Revenue area (solid for actuals, lighter for forecast) */}
                <Area
                  yAxisId="revenue"
                  dataKey="revenue"
                  fill={CHART_COLORS.greenSoft}
                  stroke={CHART_COLORS.green}
                  strokeWidth={2}
                  fillOpacity={0.3}
                  dot={{ fill: CHART_COLORS.green, r: 3, strokeWidth: 0 }}
                />
                {/* Revenue Plan (dashed) */}
                <Line
                  yAxisId="revenue"
                  dataKey="revenuePlan"
                  stroke={CHART_COLORS.gray}
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={false}
                  connectNulls={false}
                />
                {/* Margin line */}
                <Line
                  yAxisId="margin"
                  dataKey="margin"
                  stroke={CHART_COLORS.amber}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.amber, r: 3, strokeWidth: 0 }}
                />
                {/* Margin Plan (dashed) */}
                <Line
                  yAxisId="margin"
                  dataKey="marginPlan"
                  stroke={CHART_COLORS.amber}
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={false}
                  connectNulls={false}
                  opacity={0.5}
                />
                {/* Vertical line separating actuals from forecast */}
                {lastActualLabel && (
                  <ReferenceLine
                    x={lastActualLabel}
                    yAxisId="revenue"
                    stroke={CHART_COLORS.grayLight}
                    strokeDasharray="4 4"
                    label={{ value: 'Forecast →', position: 'top', fontSize: 9, fill: '#9CA3AF' }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#003087] rounded" /> Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-gray-400 rounded" style={{ borderBottom: '1px dashed #9CA3AF' }} /> Revenue Plan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500 rounded" /> Operating Margin
            </span>
          </div>
        </div>
      )}

      {/* Section B: Forecast Period Cards — only show periods after the last actual */}
      {forwardOutlook.filter(p => p.period !== lastActualLabel).length > 0 && (
        <div className="bg-gradient-to-r from-[#1c519c] to-[#2A2A2A] rounded-xl p-6 text-white">
          <h2 className="text-lg font-bold mb-1">Forward-Looking Forecast</h2>
          <p className="text-sm text-[#F0F0F0] mb-3">Financial outlook by period</p>
          {/* Stale guidance notice — FY26 EPS was issued Jan 13, 2026 and not updated post-fuel spike */}
          <div className="mb-5 flex items-start gap-2 bg-amber-400/15 border border-amber-400/30 rounded-lg px-3 py-2">
            <span className="text-amber-300 text-xs mt-0.5 shrink-0">⚠</span>
            <p className="text-[11px] text-amber-200 leading-snug">
              <span className="font-semibold text-amber-300">FY26 guidance current as of Q1 FY26 earnings.</span>{' '}
              The $5.25–$5.45 adj. EPS guidance was issued at Q1 FY26 earnings (Apr 25, 2026) and reflects current BD planning assumptions including Missouri rate case timing and capex program financing costs.
              FY26 guidance confirmed at Q1 FY26 earnings. EPS $5.25–$5.45, FFO/debt target 16–17%, capex $6.3B annual.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forwardOutlook.filter(p => p.period !== lastActualLabel).map((period) => {
              const revMax = Math.max(period.revenueForcast, period.revenuePlan);
              const marginMax = Math.max(period.marginForecast, period.marginPlan);
              return (
                <div key={period.period} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm font-semibold text-[#F0F0F0] mb-3">{period.period}</div>
                  {/* Revenue mini comparison */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Revenue</span>
                      <span className="font-semibold">{formatBudget(period.revenueForcast)} vs {formatBudget(period.revenuePlan)}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="bg-white/60 rounded-full" style={{ width: `${(period.revenueForcast / revMax) * 100}%` }} />
                      <div className="bg-white/25 rounded-full" style={{ width: `${(period.revenuePlan / revMax) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-white/50 mt-0.5">
                      <span>Forecast</span><span>Plan</span>
                    </div>
                  </div>
                  {/* Margin mini comparison */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Margin</span>
                      <span className="font-semibold">{period.marginForecast.toFixed(1)}% vs {period.marginPlan.toFixed(1)}%</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="bg-amber-300/60 rounded-full" style={{ width: `${(period.marginForecast / marginMax) * 100}%` }} />
                      <div className="bg-amber-300/25 rounded-full" style={{ width: `${(period.marginPlan / marginMax) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-white/50 mt-0.5">
                      <span>Forecast</span><span>Plan</span>
                    </div>
                  </div>
                  {/* Top 2 assumptions inline */}
                  {period.keyAssumptions.length > 0 && (
                    <div className="pt-2 border-t border-white/20">
                      {period.keyAssumptions.slice(0, 2).map((a, idx) => (
                        <div key={idx} className="text-[10px] text-white/70 mb-0.5">&bull; {a}</div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section C: Opportunities Pipeline Chart */}
      {opportunityData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Strategic Opportunities Pipeline</h2>
          <p className="text-xs text-gray-500 mb-4">Revenue impact potential ($B) by initiative</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opportunityData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
                <XAxis
                  type="number"
                  tick={CHART_AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `$${v}B`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#374151' }}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                />
                <Tooltip
                  {...CHART_TOOLTIP_DARK}
                  formatter={(value: any, _name: any, props: any) => {
                    return [`$${Number(value).toFixed(1)}B (${props?.payload?.timeline})`, 'Revenue Impact'];
                  }}
                />
                <Bar dataKey="impact" radius={[0, 6, 6, 0]} barSize={16}>
                  {opportunityData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? CHART_COLORS.green : i === 1 ? CHART_COLORS.greenLight : CHART_COLORS.teal} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Section D: Planning Assumptions (collapsible accordion) — only future periods */}
      {forwardOutlook.filter(p => p.period !== lastActualLabel).some(p => p.keyAssumptions.length > 0) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Key Planning Assumptions</h2>
          <p className="text-xs text-gray-500 mb-4">Assumptions underpinning the forward outlook by period</p>
          <div className="space-y-2">
            {forwardOutlook.filter(p => p.period !== lastActualLabel).map((period) => {
              const isOpen = expandedPeriod === period.period;
              return (
                <div key={period.period} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedPeriod(isOpen ? null : period.period)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-[#1c519c]">{period.period}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{period.keyAssumptions.length} assumptions</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 space-y-1.5">
                          {period.keyAssumptions.map((assumption, idx) => (
                            <div key={idx} className="flex items-start text-sm text-gray-600">
                              <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 mr-3 rounded-full bg-[#1c519c]" />
                              {assumption}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
