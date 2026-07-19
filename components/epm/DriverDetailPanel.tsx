'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_GRID_STYLE, CHART_TOOLTIP_DARK } from '@/lib/chart-theme';
import type { PLLineItem, PLForecastRow, PLPeriod, DriverForecastRow } from '@/lib/epm/pl-forecast-data';

interface DriverDetailPanelProps {
  lineItem: PLLineItem;
  row: PLForecastRow;
  periods: PLPeriod[];
  drivers: DriverForecastRow[];
}

export default function DriverDetailPanel({ lineItem, row, periods, drivers }: DriverDetailPanelProps) {
  // Build time-series data for the main chart
  const chartData = periods.map(p => {
    const isActual = p.isHistorical || p.isCurrent;
    return {
      period: p.label.replace(' FY', '\nFY'),
      shortLabel: p.label,
      forecast: row.values[p.label],
      actual: isActual ? row.values[p.label] : null,
      lower: row.lowerBound[p.label],
      upper: row.upperBound[p.label],
    };
  });

  const isEPS = lineItem === 'EPS';
  const formatVal = (v: number) => {
    if (isEPS) return `$${v.toFixed(2)}`;
    if (Math.abs(v) >= 10000) return `$${(v / 1000).toFixed(1)}B`;
    return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}M`;
  };

  const lineDrivers = drivers.filter(d => d.parentLine === lineItem);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1c519c]/5 rounded-xl p-5 mt-3 space-y-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-5 rounded-full bg-[#1c519c]" />
        <h3 className="text-sm font-bold text-gray-900">{lineItem} — 18-Month Forecast with Confidence Band</h3>
      </div>

      {/* Main forecast chart */}
      <div className="bg-white rounded-lg p-3 border border-gray-100">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid {...CHART_GRID_STYLE} />
            <XAxis dataKey="shortLabel" tick={{ ...CHART_AXIS_STYLE, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => formatVal(v)} />
            <Tooltip
              {...CHART_TOOLTIP_DARK}
              formatter={(value: number, name: string) => [formatVal(value), name === 'forecast' ? 'Forecast' : name === 'actual' ? 'Actual' : name]}
            />
            {/* Confidence band */}
            <Area dataKey="upper" stackId="band" stroke="none" fill={CHART_COLORS.greenSoft} />
            <Area dataKey="lower" stackId="band" stroke="none" fill="#fff" />
            {/* Forecast line */}
            <Line
              type="monotone" dataKey="forecast" stroke={CHART_COLORS.green}
              strokeWidth={2} dot={false} connectNulls
            />
            {/* Actual line */}
            <Line
              type="monotone" dataKey="actual" stroke={CHART_COLORS.greenDark}
              strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3, fill: CHART_COLORS.greenDark }}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 px-2">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <div className="w-4 h-0.5 bg-[#1c519c] rounded" />
            <span>ML Forecast</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <div className="w-4 h-0.5 bg-[#1c519c] rounded" style={{ borderTop: '2px dashed #1c519c' }} />
            <span>Actuals</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <div className="w-4 h-2 bg-[#F0F0F0] rounded" />
            <span>90% Confidence</span>
          </div>
        </div>
      </div>

      {/* Driver breakdown grid */}
      {lineDrivers.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Drivers</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {lineDrivers.map((driver) => {
              const vals = periods.map(p => driver.values[p.label]).filter(Boolean);
              const latest = vals[vals.length - 1];
              const first = vals[0];
              const trend = latest > first ? 'up' : latest < first ? 'down' : 'flat';

              return (
                <div key={driver.driverName} className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-medium mb-0.5">{driver.driverName}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-sm font-bold text-gray-900">
                      {driver.unit === '%' ? `${latest?.toFixed(1)}%` :
                       driver.unit === '$M' ? `$${latest?.toLocaleString()}M` :
                       driver.unit === '$/txn' ? `$${latest?.toFixed(2)}` :
                       driver.unit === 'M' ? `${latest?.toLocaleString()}M` :
                       latest?.toLocaleString()}
                    </p>
                    <span className={`text-[10px] font-medium ${
                      trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {trend === 'up' ? '\u2191' : trend === 'down' ? '\u2193' : '\u2192'}
                    </span>
                  </div>
                  {/* Mini sparkline via simple SVG */}
                  <svg viewBox={`0 0 ${vals.length * 10} 20`} className="w-full h-4 mt-1">
                    <polyline
                      points={vals.map((v, i) => {
                        const min = Math.min(...vals);
                        const max = Math.max(...vals);
                        const range = max - min || 1;
                        const y = 18 - ((v - min) / range) * 16;
                        return `${i * 10 + 5},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke={CHART_COLORS.green}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
