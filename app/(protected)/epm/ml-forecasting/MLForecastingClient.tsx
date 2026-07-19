'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Brain, Target, Zap, BarChart3 } from 'lucide-react';

import { getAnnualRollup } from '@/lib/epm/pl-forecast-data';
import type { PLLineItem, PLForecastData } from '@/lib/epm/pl-forecast-data';
import { BOLD_LINES, INDENT_LINES } from '@/lib/epm/pl-forecast-data';
import SummaryMetricCard from '@/components/epm/SummaryMetricCard';
import PLTable from '@/components/epm/PLTable';
import DriverDetailPanel from '@/components/epm/DriverDetailPanel';

interface MLForecastingClientProps {
  data: PLForecastData;
}

export default function MLForecastingClient({ data }: MLForecastingClientProps) {
  const [selectedLine, setSelectedLine] = useState<PLLineItem | null>(null);
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');

  // Computed metrics for summary cards
  const fy26Rollup = useMemo(() => getAnnualRollup(data, 'FY26'), [data]);
  const fy25Rollup = useMemo(() => getAnnualRollup(data, 'FY25'), [data]);

  const avgConfidence = useMemo(() => {
    const forecastPeriods = data.periods.filter(p => p.isForecast);
    const allConf = data.rows.flatMap(r => forecastPeriods.map(p => r.confidence[p.label]));
    return Math.round(allConf.reduce((s, c) => s + c, 0) / allConf.length);
  }, [data]);

  const revGrowth = fy25Rollup.Revenue > 0
    ? ((fy26Rollup.Revenue - fy25Rollup.Revenue) / fy25Rollup.Revenue * 100).toFixed(1)
    : '0';

  const fy26Margin = fy26Rollup.Revenue > 0
    ? (fy26Rollup['Adjusted Operating Income'] / fy26Rollup.Revenue * 100).toFixed(1)
    : '0';

  // Best model accuracy
  const bestAccuracy = useMemo(() => {
    const sorted = [...data.modelAccuracy].sort((a, b) => a.mape - b.mape);
    return sorted[0];
  }, [data]);

  const selectedRow = selectedLine ? data.rows.find(r => r.lineItem === selectedLine) : null;
  const selectedDrivers = selectedLine
    ? data.drivers.filter(d => d.parentLine === selectedLine)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-xl font-bold text-gray-900">18-Month Rolling Forecast</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Full P&L cascade with ML-predicted drivers &bull; Oct &apos;25 through Mar &apos;27 (18 months)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewMode('annual')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'annual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Annual
            </button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryMetricCard
          label="FY26 Revenue Forecast"
          value={`$${(fy26Rollup.Revenue / 1000).toFixed(1)}B`}
          subtitle={`${revGrowth}% YoY growth vs FY25`}
          icon={TrendingUp}
          trend="up"
          trendLabel={`+${revGrowth}%`}
          index={0}
        />
        <SummaryMetricCard
          label="Operating Margin Trajectory"
          value={`${fy26Margin}%`}
          subtitle={`FY25: ${(fy25Rollup['Operating Income'] / fy25Rollup.Revenue * 100).toFixed(1)}% → FY26: ${fy26Margin}%`}
          icon={Target}
          trend="up"
          trendLabel="Expanding"
          accentColor="#1c519c"
          index={1}
        />
        <SummaryMetricCard
          label="Avg Model Confidence"
          value={`${avgConfidence}%`}
          subtitle="Across all forecast periods"
          icon={Brain}
          trend={avgConfidence >= 80 ? 'up' : 'flat'}
          accentColor="#1c519c"
          index={2}
        />
        <SummaryMetricCard
          label="Most Accurate Line"
          value={bestAccuracy?.lineItem || 'N/A'}
          subtitle={`MAPE: ${bestAccuracy?.mape}% (${bestAccuracy?.bestModel})`}
          icon={Zap}
          accentColor="#1c519c"
          index={3}
        />
      </div>

      {/* P&L Cascade Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-[#1c519c]" />
          <h2 className="text-sm font-bold text-gray-900">P&L Forecast Cascade</h2>
          <span className="text-[10px] text-gray-400 ml-1">Click any line item to expand driver detail</span>
        </div>

        {viewMode === 'quarterly' ? (
          <PLTable
            rows={data.rows}
            periods={data.periods}
            selectedLine={selectedLine}
            onRowClick={(line) => setSelectedLine(selectedLine === line ? null : line)}
          />
        ) : (
          <AnnualView data={data} selectedLine={selectedLine} onRowClick={(line) => setSelectedLine(selectedLine === line ? null : line)} />
        )}

        {/* Driver Detail Panel (expands below table) */}
        <AnimatePresence>
          {selectedLine && selectedRow && (
            <DriverDetailPanel
              lineItem={selectedLine}
              row={selectedRow}
              periods={data.periods}
              drivers={selectedDrivers}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Model Accuracy Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-sm font-bold text-gray-900 mb-3">Model Accuracy by P&L Line</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-600">P&L Line</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-600">MAPE</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Best Model</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-600">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {data.modelAccuracy.map((m, i) => (
                <motion.tr
                  key={m.lineItem}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.03 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2 px-3 font-medium text-gray-800">{m.lineItem}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      m.mape <= 3 ? 'bg-emerald-50 text-emerald-700' :
                      m.mape <= 6 ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {m.mape.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-600">{m.bestModel}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      m.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' :
                      m.confidence >= 75 ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {m.confidence}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <span>Historical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-300" />
          <span>Current Quarter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>High Confidence (&ge;90%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Medium (&ge;75%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span>Low (&lt;75%)</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Annual View sub-component
// =============================================================================

function AnnualView({ data, selectedLine, onRowClick }: {
  data: PLForecastData;
  selectedLine: PLLineItem | null;
  onRowClick: (line: PLLineItem) => void;
}) {
  const fiscalYears = ['FY25', 'FY26', 'FY27'];

  const rollups = useMemo(() => {
    return fiscalYears.map(fy => ({
      fy,
      values: getAnnualRollup(data, fy),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function formatCell(value: number, lineItem: PLLineItem): string {
    if (lineItem === 'EPS') return `$${value.toFixed(2)}`;
    if (Math.abs(value) >= 10000) return `$${(value / 1000).toFixed(1)}B`;
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}M`;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-600 min-w-[180px]">P&L Line Item</th>
            {rollups.map(r => (
              <th key={r.fy} className={`text-right py-2 px-4 font-semibold min-w-[100px] ${
                r.fy === 'FY25' ? 'text-gray-400' : r.fy === 'FY26' ? 'text-amber-700 bg-amber-50/50' : 'text-gray-600'
              }`}>
                {r.fy}
              </th>
            ))}
            <th className="text-right py-2 px-4 font-semibold text-gray-600 min-w-[80px]">YoY %</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map(row => {
            const isBold = BOLD_LINES.includes(row.lineItem);
            const isIndent = INDENT_LINES.includes(row.lineItem);
            const isSelected = selectedLine === row.lineItem;

            const fy25Val = rollups[0].values[row.lineItem] || 0;
            const fy26Val = rollups[1].values[row.lineItem] || 0;
            const yoy = fy25Val !== 0 ? ((fy26Val - fy25Val) / Math.abs(fy25Val) * 100) : 0;

            return (
              <tr
                key={row.lineItem}
                className={`border-b border-gray-100 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#1c519c]/5' : 'hover:bg-gray-50'
                }`}
                onClick={() => onRowClick(row.lineItem)}
              >
                <td className={`py-2 px-3 ${isBold ? 'font-bold text-gray-900' : 'text-gray-700'} ${isIndent ? 'pl-6' : ''}`}>
                  {row.lineItem}
                </td>
                {rollups.map(r => (
                  <td key={r.fy} className={`py-2 px-4 text-right font-mono tabular-nums ${isBold ? 'font-bold' : ''}`}>
                    {formatCell(r.values[row.lineItem] || 0, row.lineItem)}
                  </td>
                ))}
                <td className={`py-2 px-4 text-right font-mono tabular-nums ${
                  yoy > 0 ? 'text-emerald-600' : yoy < 0 ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {yoy > 0 ? '+' : ''}{yoy.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
