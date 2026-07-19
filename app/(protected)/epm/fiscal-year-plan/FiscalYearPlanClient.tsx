'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Target, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import SummaryMetricCard from '@/components/epm/SummaryMetricCard';
import { CHART_AXIS_STYLE, CHART_GRID_STYLE, CHART_TOOLTIP_DARK } from '@/lib/chart-theme';
import type { FiscalYearPlanData, FiscalYearMetric } from '@/lib/epm/fiscal-year-data';

const GREEN = '#1c519c';
const GREEN_DARK = '#1c519c';
const RED = '#dc2626';

function fmtCurrency(value: number, unit: string): string {
  if (unit === '%') return `${value.toFixed(1)}%`;
  if (unit === '$/share') return `$${value.toFixed(2)}`;
  if (unit === 'count') return value.toLocaleString();
  if (value >= 10000) return `$${(value / 1000).toFixed(1)}B`;
  return `$${value.toLocaleString()}M`;
}

function fmtShortCurrency(value: number): string {
  if (value >= 10000) return `$${(value / 1000).toFixed(1)}B`;
  return `$${value.toLocaleString()}M`;
}

interface FiscalYearPlanClientProps {
  data: FiscalYearPlanData;
}

export default function FiscalYearPlanClient({ data }: FiscalYearPlanClientProps) {
  const pctComplete = Math.round((data.daysThroughYear / data.totalDaysInYear) * 100);

  const chartData = useMemo(() =>
    data.revenueByQuarter.map((q) => ({
      quarter: q.quarter.replace(' FY26', ''),
      Plan: q.plan,
      'Actual / Forecast': q.actual ?? q.forecast ?? 0,
      'Prior Year': q.priorYear,
      isActual: q.actual !== null,
    })),
  [data.revenueByQuarter]);

  const yoyMetrics = useMemo(() => {
    const picks = ['Net Revenue', 'Operating Income', 'Operating Margin', 'EPS'];
    return data.metrics.filter((m) => picks.includes(m.metric));
  }, [data.metrics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-gray-900">FY26 Fiscal Year Plan</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Through {data.currentQuarter} &mdash; {data.quartersComplete} of {data.totalQuarters} quarters complete
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-4"
      >
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span className="font-semibold text-gray-700">{data.fiscalYear}</span>
          <span className="font-medium" style={{ color: GREEN }}>{pctComplete}% complete</span>
          <span className="text-gray-400">End of FY26</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: GREEN }}
            initial={{ width: 0 }}
            animate={{ width: `${pctComplete}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>Oct 2025</span>
          <span>Sep 2026</span>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryMetricCard label="YTD Revenue vs Plan" value="$18,950M" subtitle="vs Plan $19,200M" icon={Target} trend="down" trendLabel="-1.3%" index={0} />
        <SummaryMetricCard label="Full-Year Forecast" value="$38.9B" subtitle="vs Plan $39.2B" icon={TrendingUp} trend="down" trendLabel="-0.9%" index={1} />
        <SummaryMetricCard label="Operating Margin" value="15.0%" subtitle="Plan: 15.1%" icon={BarChart3} accentColor="#1c519c" trend="flat" trendLabel="-0.1pp" index={2} />
        <SummaryMetricCard label="Annual Target Progress" value="48%" subtitle="YTD Revenue / Full Year Plan" icon={Activity} accentColor="#1c519c" index={3} />
      </div>

      {/* Quarterly Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-xl border border-gray-200 p-5"
      >
        <h2 className="text-sm font-semibold text-gray-800 mb-4">
          Quarterly Revenue &mdash; Plan vs Actual / Forecast vs Prior Year
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} barCategoryGap="20%" barGap={4}>
            <CartesianGrid {...CHART_GRID_STYLE} />
            <XAxis dataKey="quarter" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}B`} />
            <Tooltip {...CHART_TOOLTIP_DARK} formatter={(value: number, name: string) => [fmtShortCurrency(value), name]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Plan" fill={GREEN_DARK} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Actual / Forecast" radius={[3, 3, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={GREEN} fillOpacity={entry.isActual ? 1 : 0.5} />
              ))}
            </Bar>
            <Bar dataKey="Prior Year" fill="#9CA3AF" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400 justify-center">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: GREEN }} /> Actual</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: GREEN, opacity: 0.5 }} /> Forecast</span>
        </div>
      </motion.div>

      {/* P&L Metrics Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-sm font-bold text-gray-900 mb-3">P&L Metrics &mdash; Plan vs Forecast</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Metric</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Plan</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">YTD Actual</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Full-Year Fcst</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Var</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Var %</th>
                <th className="px-3 py-2 font-semibold text-gray-600 w-28">Progress</th>
              </tr>
            </thead>
            <tbody>
              {data.metrics.map((m: FiscalYearMetric, idx: number) => {
                const varAbs = m.fullYearForecast - m.plan;
                const varPct = m.plan !== 0 ? ((m.fullYearForecast - m.plan) / Math.abs(m.plan)) * 100 : 0;
                const isFav = m.isCost ? varAbs <= 0 : varAbs >= 0;
                const varColor = isFav ? GREEN : RED;
                const progress = m.plan !== 0 ? Math.min(Math.round((m.ytdActual / Math.abs(m.plan)) * 100), 100) : 0;

                return (
                  <tr key={m.metric} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800">{m.metric}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{fmtCurrency(m.plan, m.unit)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">{fmtCurrency(m.ytdActual, m.unit)}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{fmtCurrency(m.fullYearForecast, m.unit)}</td>
                    <td className="px-3 py-2 text-right font-medium" style={{ color: varColor }}>
                      {varAbs >= 0 ? '+' : ''}{m.unit === '%' ? `${varAbs.toFixed(1)}pp` : m.unit === '$/share' ? `$${varAbs.toFixed(2)}` : fmtCurrency(varAbs, m.unit)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium" style={{ color: varColor }}>
                      {varPct >= 0 ? '+' : ''}{varPct.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: progress >= 45 ? GREEN : '#F59E0B' }} />
                        </div>
                        <span className="text-[10px] text-gray-400 w-6 text-right">{progress}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* YoY Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h2 className="text-sm font-bold text-gray-900 mb-3">Year-over-Year &mdash; FY26 Forecast vs FY25 Actual</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {yoyMetrics.map((m, idx) => {
            const change = m.priorYear !== 0 ? ((m.fullYearForecast - m.priorYear) / Math.abs(m.priorYear)) * 100 : 0;
            const isFav = m.isCost ? change <= 0 : change >= 0;
            return (
              <motion.div
                key={m.metric}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
                className="bg-white rounded-lg border border-gray-200 p-3"
              >
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">{m.metric}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400">FY25</p>
                    <p className="text-sm font-semibold text-gray-500">{fmtCurrency(m.priorYear, m.unit)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">FY26 Fcst</p>
                    <p className="text-sm font-bold text-gray-900">{fmtCurrency(m.fullYearForecast, m.unit)}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold mt-1.5" style={{ color: isFav ? GREEN : RED }}>
                  {change >= 0 ? '+' : ''}{change.toFixed(1)}% YoY
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
