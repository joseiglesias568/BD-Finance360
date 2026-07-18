'use client';

import { useReducer, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Save, DollarSign, TrendingUp, Percent } from 'lucide-react';

import { calculateShortTermImpact } from '@/lib/epm/planning-engine';
import type { PlanningLever, PLResult } from '@/lib/epm/planning-engine';
import PlanningSlider from '@/components/epm/PlanningSlider';
import WaterfallBridge from '@/components/epm/WaterfallBridge';
import SummaryMetricCard from '@/components/epm/SummaryMetricCard';

interface ShortTermPlanningClientProps {
  levers: PlanningLever[];
  baseline: PLResult;
}

// =============================================================================
// Reducer for lever values
// =============================================================================

type LeverAction =
  | { type: 'SET_LEVER'; id: string; value: number }
  | { type: 'RESET'; defaults: Record<string, number> };

function leverReducer(state: Record<string, number>, action: LeverAction): Record<string, number> {
  switch (action.type) {
    case 'SET_LEVER':
      return { ...state, [action.id]: action.value };
    case 'RESET':
      return action.defaults;
    default:
      return state;
  }
}

// =============================================================================
// P&L line items for the comparison table
// =============================================================================

interface PLLineItem {
  label: string;
  key: string;
  format: 'currency' | 'percent' | 'eps';
  favorable: 'higher' | 'lower';
}

const PL_LINES: PLLineItem[] = [
  { label: 'Revenue', key: 'revenue', format: 'currency', favorable: 'higher' },
  { label: 'Cost of Sales', key: 'costOfSales', format: 'currency', favorable: 'lower' },
  { label: 'Gross Profit', key: 'grossProfit', format: 'currency', favorable: 'higher' },
  { label: 'Operating Expenses', key: 'operatingExpenses', format: 'currency', favorable: 'lower' },
  { label: 'Operating Income', key: 'operatingIncome', format: 'currency', favorable: 'higher' },
  { label: 'Operating Margin', key: 'operatingMargin', format: 'percent', favorable: 'higher' },
  { label: 'Net Income', key: 'netIncome', format: 'currency', favorable: 'higher' },
  { label: 'EPS', key: 'eps', format: 'eps', favorable: 'higher' },
];

// =============================================================================
// Formatting helpers
// =============================================================================

function fmtCurrency(v: number): string {
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}B`;
  return `$${v.toLocaleString()}M`;
}

function fmtDelta(v: number, format: 'currency' | 'percent' | 'eps'): string {
  const sign = v > 0 ? '+' : '';
  if (format === 'currency') {
    return `${sign}${fmtCurrency(v)}`;
  }
  if (format === 'percent') {
    const bps = Math.round(v * 10);
    return `${bps > 0 ? '+' : ''}${bps} bps`;
  }
  // eps
  return `${sign}$${v.toFixed(2)}`;
}

function fmtValue(v: number, format: 'currency' | 'percent' | 'eps'): string {
  if (format === 'currency') return fmtCurrency(v);
  if (format === 'percent') return `${v.toFixed(1)}%`;
  return `$${v.toFixed(2)}`;
}

function isFavorable(delta: number, direction: 'higher' | 'lower'): boolean {
  if (direction === 'higher') return delta > 0;
  return delta < 0;
}

// =============================================================================
// Component
// =============================================================================

export default function ShortTermPlanningClient({ levers, baseline }: ShortTermPlanningClientProps) {
  // Build defaults from props
  const defaultValues = useMemo(() => {
    const defaults: Record<string, number> = {};
    for (const lever of levers) {
      defaults[lever.id] = lever.default;
    }
    return defaults;
  }, [levers]);

  const [leverValues, dispatch] = useReducer(leverReducer, defaultValues);
  const [savedBadge, setSavedBadge] = useState(false);

  const impact = useMemo(() => calculateShortTermImpact(leverValues), [leverValues]);

  // Group levers by category
  const leversByCategory = useMemo(() => {
    const map = new Map<string, PlanningLever[]>();
    for (const lever of levers) {
      const group = map.get(lever.category) || [];
      group.push(lever);
      map.set(lever.category, group);
    }
    return Array.from(map.entries());
  }, [levers]);

  // Summary computations
  const revenueDelta = impact.adjusted.revenue - impact.baseline.revenue;
  const oiDelta = impact.adjusted.operatingIncome - impact.baseline.operatingIncome;
  const marginDelta = impact.adjusted.operatingMargin - impact.baseline.operatingMargin;

  const handleSave = useCallback(() => {
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  }, []);

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Short-Term Planning (Q3&ndash;Q4 FY26)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Adjust operational levers and see real-time P&amp;L impact for the next two quarters
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch({ type: 'RESET', defaults: defaultValues })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to ML Forecast
          </button>

          <div className="relative">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#003B2C] px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#007A3D] transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              Save Scenario
            </button>
            <AnimatePresence>
              {savedBadge && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow"
                >
                  Saved
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ---- Main two-column layout ---- */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ---- Left Panel: Levers (40%) ---- */}
        <div className="w-full lg:w-[40%] space-y-5">
          {leversByCategory.map(([category, levers]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <h3 className="text-xs font-semibold text-[#003B2C] uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-4">
                {levers.map((lever) => (
                  <PlanningSlider
                    key={lever.id}
                    label={lever.label}
                    value={leverValues[lever.id]}
                    min={lever.min}
                    max={lever.max}
                    step={lever.step}
                    unit={lever.unit}
                    defaultValue={lever.default}
                    onChange={(v) =>
                      dispatch({ type: 'SET_LEVER', id: lever.id, value: v })
                    }
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ---- Right Panel: Results (60%) ---- */}
        <div className="w-full lg:w-[60%] space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SummaryMetricCard
              label="Revenue Impact"
              value={fmtDelta(revenueDelta, 'currency')}
              subtitle={`Adjusted: ${fmtCurrency(impact.adjusted.revenue)}`}
              icon={DollarSign}
              accentColor={revenueDelta >= 0 ? '#003B2C' : '#dc2626'}
              trend={revenueDelta > 0 ? 'up' : revenueDelta < 0 ? 'down' : 'flat'}
              trendLabel={`vs ${fmtCurrency(impact.baseline.revenue)} baseline`}
              index={0}
            />
            <SummaryMetricCard
              label="OI Impact"
              value={fmtDelta(oiDelta, 'currency')}
              subtitle={`Adjusted: ${fmtCurrency(impact.adjusted.operatingIncome)}`}
              icon={TrendingUp}
              accentColor={oiDelta >= 0 ? '#003B2C' : '#dc2626'}
              trend={oiDelta > 0 ? 'up' : oiDelta < 0 ? 'down' : 'flat'}
              trendLabel={`vs ${fmtCurrency(impact.baseline.operatingIncome)} baseline`}
              index={1}
            />
            <SummaryMetricCard
              label="Margin Change"
              value={fmtDelta(marginDelta, 'percent')}
              subtitle={`Adjusted: ${impact.adjusted.operatingMargin.toFixed(1)}%`}
              icon={Percent}
              accentColor={marginDelta >= 0 ? '#003B2C' : '#dc2626'}
              trend={marginDelta > 0 ? 'up' : marginDelta < 0 ? 'down' : 'flat'}
              trendLabel={`vs ${impact.baseline.operatingMargin.toFixed(1)}% baseline`}
              index={2}
            />
          </div>

          {/* Waterfall chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Revenue Bridge &mdash; ML Baseline to Your Plan
            </h2>
            {impact.waterfall.filter((w) => Math.abs(w.impact) > 0).length > 0 ? (
              <WaterfallBridge
                startLabel="ML Baseline"
                startValue={impact.baseline.revenue}
                endLabel="Your Adjusted Plan"
                endValue={impact.adjusted.revenue}
                items={impact.waterfall.filter((w) => Math.abs(w.impact) > 0)}
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
                Adjust levers to see the revenue bridge
              </div>
            )}
          </motion.div>

          {/* Side-by-side P&L comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">
                P&amp;L Comparison &mdash; Q3 + Q4 FY26
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-600">
                      Line Item
                    </th>
                    <th className="text-right py-2.5 px-4 font-semibold text-gray-600">
                      ML Forecast
                    </th>
                    <th className="text-right py-2.5 px-4 font-semibold text-gray-600">
                      Your Plan
                    </th>
                    <th className="text-right py-2.5 px-4 font-semibold text-gray-600">
                      Variance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PL_LINES.map((line) => {
                    const baseVal =
                      impact.baseline[line.key as keyof typeof impact.baseline] as number;
                    const adjVal =
                      impact.adjusted[line.key as keyof typeof impact.adjusted] as number;
                    const delta = adjVal - baseVal;
                    const favorable = isFavorable(delta, line.favorable);
                    const isSubtotal =
                      line.key === 'grossProfit' ||
                      line.key === 'operatingIncome' ||
                      line.key === 'netIncome';

                    return (
                      <tr
                        key={line.key}
                        className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                          isSubtotal ? 'bg-gray-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2 px-4 text-gray-800">{line.label}</td>
                        <td className="py-2 px-4 text-right text-gray-700 font-mono tabular-nums">
                          {fmtValue(baseVal, line.format)}
                        </td>
                        <td className="py-2 px-4 text-right text-gray-900 font-mono tabular-nums font-medium">
                          {fmtValue(adjVal, line.format)}
                        </td>
                        <td
                          className={`py-2 px-4 text-right font-mono tabular-nums font-semibold ${
                            Math.abs(delta) < 0.01
                              ? 'text-gray-400'
                              : favorable
                              ? 'text-emerald-600'
                              : 'text-red-600'
                          }`}
                        >
                          {Math.abs(delta) < 0.01 ? '\u2014' : fmtDelta(delta, line.format)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
