'use client';

import { motion } from 'framer-motion';
import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { FinancialConfig } from '@/config/types';
import { calculateMargin } from '@/lib/engines/financial-engine';
import { formatMillions } from '@/lib/engines/formatting-engine';
import { getMetricHealth, getStatusColorClasses } from '@/lib/engines/health-engine';
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_TOOLTIP_DARK, CHART_GRID_STYLE, SEGMENT_COLORS } from '@/lib/chart-theme';
import CompactMetricTable from './components/CompactMetricTable';

interface FinancialPerformanceProps {
  periodLabel: string;
  financials: FinancialConfig;
}

export default function FinancialPerformance({ periodLabel, financials }: FinancialPerformanceProps) {
  const pl = financials?.plSummary;
  const ratios = financials?.ratios;
  const wc = financials?.workingCapital;
  const quarters = financials?.quarters ?? [];
  const segments = financials?.segments ?? [];
  const bridge = financials?.revenueBridge ?? [];

  // ── P&L Variance Data ────────────────────────────────────────────
  const plItems = [
    { ...pl?.revenue, label: pl?.revenue?.label || 'Revenue', isExpense: false },
    { ...pl?.cogs, label: pl?.cogs?.label || 'COGS', isExpense: true },
    { ...pl?.grossProfit, label: pl?.grossProfit?.label || 'Gross Profit', isExpense: false },
    { ...pl?.operatingExpenses, label: pl?.operatingExpenses?.label || 'OpEx', isExpense: true },
    { ...pl?.operatingIncome, label: pl?.operatingIncome?.label || 'Operating Income', isExpense: false },
    { ...pl?.netIncome, label: pl?.netIncome?.label || 'Net Income', isExpense: false },
  ];

  const varianceData = plItems.map(item => {
    const variance = item.variance ?? 0;
    // For expenses, negative variance is favorable (green), positive is unfavorable (red)
    const favorable = item.isExpense ? variance <= 0 : variance >= 0;
    return {
      name: item.label,
      variance,
      variancePercent: item.variancePercent ?? 0,
      favorable,
    };
  });

  // ── Summary metrics row ──────────────────────────────────────────
  const revenue = pl?.revenue;
  const opIncome = pl?.operatingIncome;
  const opMarginActual = calculateMargin(opIncome?.actual ?? 0, revenue?.actual ?? 0);
  const opMarginPlan = calculateMargin(opIncome?.plan ?? 0, revenue?.plan ?? 0);
  const marginDelta = opMarginActual - opMarginPlan;

  // ── Revenue Waterfall Data ───────────────────────────────────────
  const priorYearRev = revenue?.priorYear ?? (revenue?.actual ?? 0) - (revenue?.variance ?? 0);
  const waterfallData: Array<{ name: string; base: number; value: number; color: string; total?: boolean }> = [];
  if (bridge.length > 0) {
    let running = priorYearRev;
    waterfallData.push({ name: 'Prior Year', base: 0, value: priorYearRev, color: CHART_COLORS.greenDark, total: true });
    bridge.forEach(item => {
      const impact = item.impact;
      if (impact >= 0) {
        waterfallData.push({ name: item.label, base: running, value: impact, color: CHART_COLORS.green });
      } else {
        waterfallData.push({ name: item.label, base: running + impact, value: Math.abs(impact), color: CHART_COLORS.red });
      }
      running += impact;
    });
    waterfallData.push({ name: 'Actual', base: 0, value: revenue?.actual ?? running, color: CHART_COLORS.greenDark, total: true });
  }

  // ── Quarterly Trend Data ─────────────────────────────────────────
  const quarterlyData = quarters.map(q => ({
    q: q.quarter,
    revenue: q.revenue,
    margin: q.operatingMargin,
  }));

  // ── Working Capital bar data ─────────────────────────────────────
  const wcData = [
    { name: 'DSO', actual: wc?.dso ?? 0, target: wc?.dsoTarget ?? 0 },
    { name: 'Inv. Days', actual: wc?.inventoryDays ?? 0, target: wc?.inventoryDaysTarget ?? 0 },
    { name: 'DPO', actual: wc?.dpo ?? 0, target: wc?.dpoTarget ?? 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Revenue', value: formatMillions(revenue?.actual ?? 0), sub: `Plan: ${formatMillions(revenue?.plan ?? 0)}`, delta: `${(revenue?.variancePercent ?? 0) >= 0 ? '+' : ''}${(revenue?.variancePercent ?? 0).toFixed(1)}%`, positive: (revenue?.variancePercent ?? 0) >= 0 },
          { label: 'Operating Income', value: formatMillions(opIncome?.actual ?? 0), sub: `Plan: ${formatMillions(opIncome?.plan ?? 0)}`, delta: `${(opIncome?.variancePercent ?? 0) >= 0 ? '+' : ''}${(opIncome?.variancePercent ?? 0).toFixed(1)}%`, positive: (opIncome?.variancePercent ?? 0) >= 0 },
          { label: 'Operating Margin', value: `${opMarginActual.toFixed(1)}%`, sub: `Plan: ${opMarginPlan.toFixed(1)}%`, delta: `${marginDelta >= 0 ? '+' : ''}${(marginDelta * 100).toFixed(0)} bps`, positive: marginDelta >= 0 },
          { label: 'Net Income', value: formatMillions(pl?.netIncome?.actual ?? 0), sub: `Plan: ${formatMillions(pl?.netIncome?.plan ?? 0)}`, delta: `${(pl?.netIncome?.variancePercent ?? 0) >= 0 ? '+' : ''}${(pl?.netIncome?.variancePercent ?? 0).toFixed(1)}%`, positive: (pl?.netIncome?.variancePercent ?? 0) >= 0 },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-[#003B2C]">{m.value}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">{m.sub}</span>
              <span className={`text-xs font-semibold ${m.positive ? 'text-emerald-600' : 'text-red-500'}`}>{m.delta}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Plan-value provenance note */}
      <p className="text-[10px] text-gray-400 -mt-1">
        * Plan values reflect internal management budget estimates. BD does not publicly file quarterly budgets — these figures are not independently verifiable from SEC filings.
      </p>

      {/* Section A: P&L Variance Horizontal Bars */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">P&L Variance vs Plan</h2>
        <p className="text-xs text-gray-500 mb-4">{periodLabel} — Favorable (green) / Unfavorable (red)</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={varianceData} layout="vertical" margin={{ top: 5, right: 40, left: 10, bottom: 5 }}>
              <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
              <XAxis type="number" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip {...CHART_TOOLTIP_DARK} formatter={(value: number) => [`${value >= 0 ? '+' : ''}$${value}M`, 'Variance']} />
              <ReferenceLine x={0} stroke="#D1D5DB" />
              <Bar dataKey="variance" radius={[0, 4, 4, 0]} barSize={18}>
                {varianceData.map((entry, i) => (
                  <Cell key={i} fill={entry.favorable ? CHART_COLORS.green : CHART_COLORS.red} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section B: Revenue Waterfall Bridge */}
      {waterfallData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Revenue Bridge</h2>
          <p className="text-xs text-gray-500 mb-4">Prior Year → Actual ($M) — Key drivers of revenue change</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid {...CHART_GRID_STYLE} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}B`} />
                <Tooltip
                  {...CHART_TOOLTIP_DARK}
                  formatter={(value: number, name: string) => {
                    if (name === 'base') return [null, null];
                    return [`$${value}M`, 'Amount'];
                  }}
                />
                <Bar dataKey="base" stackId="waterfall" fill="transparent" />
                <Bar dataKey="value" stackId="waterfall" radius={[3, 3, 0, 0]}>
                  {waterfallData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Section C: Two-column — Quarterly Trend + Segment Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quarterly Revenue & Margin Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Quarterly Revenue & Margin</h2>
          <p className="text-xs text-gray-500 mb-4">Revenue ($B) and Operating Margin (%)</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={quarterlyData} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} />
                <XAxis dataKey="q" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
                <YAxis yAxisId="right" orientation="right" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip
                  {...CHART_TOOLTIP_DARK}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${value.toFixed(1)}B` : `${value.toFixed(1)}%`,
                    name === 'revenue' ? 'Revenue' : 'Op Margin',
                  ]}
                />
                <Bar yAxisId="left" dataKey="revenue" fill={CHART_COLORS.green} radius={[4, 4, 0, 0]} barSize={32} />
                <Line yAxisId="right" type="monotone" dataKey="margin" stroke={CHART_COLORS.greenLight} strokeWidth={2.5} dot={{ r: 3, fill: CHART_COLORS.greenLight }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segment Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Revenue by Segment</h2>
          <p className="text-xs text-gray-500 mb-4">Operating segments with YoY growth</p>
          {segments.length > 0 && (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segments} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                  <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
                  <XAxis type="number" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip {...CHART_TOOLTIP_DARK} formatter={(value: number) => [`$${value.toFixed(1)}B`, 'Revenue']} />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={18}>
                    {segments.map((_, i) => (
                      <Cell key={i} fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {/* YoY annotations */}
          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
            {segments.map((seg, i) => (
              <div key={seg.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm" style={{ background: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }} />
                <span className="text-xs text-gray-600">{seg.name}</span>
                <span className={`text-xs font-semibold ${seg.yoyChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {seg.yoyChange >= 0 ? '+' : ''}{seg.yoyChange.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section D: Financial Ratios + Working Capital (compact) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Ratios Table */}
        <CompactMetricTable
          metrics={[
            { label: 'Return on Equity', value: `${ratios?.returnOnEquity?.toFixed(1) ?? '—'}%`, trend: 'flat', status: 'good' },
            { label: 'Return on Assets', value: `${ratios?.returnOnAssets?.toFixed(1) ?? '—'}%`, target: `${ratios?.returnOnAssetsTarget?.toFixed(1) ?? '—'}%`, trend: (ratios?.returnOnAssets ?? 0) >= (ratios?.returnOnAssetsTarget ?? 0) ? 'up' : 'down', status: getMetricHealth(ratios?.returnOnAssets ?? 0, ratios?.returnOnAssetsTarget ?? 0) },
            { label: 'Free Cash Flow', value: `$${ratios?.freeCashFlow?.toFixed(1) ?? '—'}B`, target: ratios?.freeCashFlowTarget ? `$${ratios.freeCashFlowTarget.toFixed(1)}B` : undefined, trend: 'up', status: 'good' },
            { label: 'Debt to Equity', value: `${ratios?.debtToEquity?.toFixed(1) ?? '—'}x`, target: ratios?.debtToEquityTarget ? `${ratios.debtToEquityTarget.toFixed(1)}x` : undefined, trend: 'flat', status: 'warning' },
            { label: 'Current Ratio', value: `${ratios?.currentRatio?.toFixed(2) ?? '—'}`, target: ratios?.currentRatioTarget ? `${ratios.currentRatioTarget.toFixed(2)}` : undefined, trend: (ratios?.currentRatio ?? 0) >= (ratios?.currentRatioTarget ?? 1) ? 'up' : 'down', status: getMetricHealth(ratios?.currentRatio ?? 0, ratios?.currentRatioTarget ?? 1) },
            { label: 'Dividend / Share', value: `$${ratios?.dividendPerShare?.toFixed(2) ?? '—'}`, trend: 'up', status: 'good' },
          ]}
          className="bg-white"
        />

        {/* Working Capital Bars */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Working Capital</h2>
          <p className="text-xs text-gray-500 mb-4">Days outstanding vs target</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wcData} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} />
                <XAxis dataKey="name" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `${v}d`} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(value: number, name: string) => [`${value} days`, name === 'actual' ? 'Actual' : 'Target']} />
                <Bar dataKey="target" fill={CHART_COLORS.grayLight} radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="actual" radius={[4, 4, 0, 0]} barSize={24}>
                  {wcData.map((d, i) => {
                    // For DSO and Inventory, lower is better; for DPO, higher is better
                    const good = i === 2 ? d.actual >= d.target : d.actual <= d.target;
                    return <Cell key={i} fill={good ? CHART_COLORS.green : CHART_COLORS.amber} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
