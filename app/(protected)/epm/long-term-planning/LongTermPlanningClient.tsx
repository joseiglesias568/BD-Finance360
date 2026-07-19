'use client';

import { motion } from 'framer-motion';
import {
  ChevronDown,
  RotateCcw,
  TrendingUp,
  DollarSign,
  BarChart3,
  Percent,
} from 'lucide-react';
import { useMemo, useReducer, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { calculateLongTermProjection } from '@/lib/epm/planning-engine';
import type { PlanningLever, PLResult, LongTermProjection } from '@/lib/epm/planning-engine';
import PlanningSlider from '@/components/epm/PlanningSlider';
import SummaryMetricCard from '@/components/epm/SummaryMetricCard';

interface LongTermPlanningClientProps {
  levers: PlanningLever[];
  baseline: PLResult;
}
import {
  CHART_COLORS,
  CHART_AXIS_STYLE,
  CHART_GRID_STYLE,
  CHART_TOOLTIP_DARK,
} from '@/lib/chart-theme';

// =============================================================================
// Types & Constants
// =============================================================================

type SelectedMetric = 'Revenue' | 'Operating Income' | 'Operating Margin' | 'EPS';

const METRIC_OPTIONS: SelectedMetric[] = [
  'Revenue',
  'Operating Income',
  'Operating Margin',
  'EPS',
];

const BRAND_GREEN = '#1c519c';
const HOUSE_GREEN = '#1c519c';
const SOFT_GREEN = '#F0F0F0';

// =============================================================================
// Lever Reducer (same pattern as short-term page)
// =============================================================================

type LeverAction =
  | { type: 'SET'; id: string; value: number }
  | { type: 'RESET'; defaults: Record<string, number> };

function leverReducer(
  state: Record<string, number>,
  action: LeverAction,
): Record<string, number> {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.id]: action.value };
    case 'RESET':
      return action.defaults;
    default:
      return state;
  }
}

// =============================================================================
// Helpers
// =============================================================================

/** Group levers by their category field */
function groupByCategory(levers: PlanningLever[]): Record<string, PlanningLever[]> {
  return levers.reduce(
    (groups, lever) => {
      (groups[lever.category] ??= []).push(lever);
      return groups;
    },
    {} as Record<string, PlanningLever[]>,
  );
}

const CATEGORY_ORDER = ['Growth', 'Profitability', 'Investment', 'Digital'];

/** Format values for the chart Y-axis based on the selected metric */
function formatYAxis(value: number, metric: SelectedMetric): string {
  if (metric === 'Revenue' || metric === 'Operating Income') {
    return `$${(value / 1000).toFixed(1)}B`;
  }
  if (metric === 'Operating Margin') {
    return `${value.toFixed(1)}%`;
  }
  // EPS
  return `$${value.toFixed(2)}`;
}

/** Format values for the tooltip */
function formatTooltipValue(value: number, metric: SelectedMetric): string {
  if (metric === 'Revenue' || metric === 'Operating Income') {
    return `$${(value / 1000).toFixed(2)}B`;
  }
  if (metric === 'Operating Margin') {
    return `${value.toFixed(1)}%`;
  }
  return `$${value.toFixed(2)}`;
}

/** Format a summary table cell */
function formatTableValue(value: number, metric: string): string {
  if (metric === 'Operating Margin') {
    return `${value.toFixed(1)}%`;
  }
  if (metric === 'EPS') {
    return `$${value.toFixed(2)}`;
  }
  // Dollar values in $M
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(2)}B`;
  }
  return `$${value.toFixed(0)}M`;
}

// =============================================================================
// Animation Variants
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// =============================================================================
// Component
// =============================================================================

export default function LongTermPlanningClient({ levers, baseline }: LongTermPlanningClientProps) {
  // Build defaults from props
  const defaultValues = useMemo(
    () => levers.reduce((acc, l) => ({ ...acc, [l.id]: l.default }), {} as Record<string, number>),
    [levers],
  );

  const [leverValues, dispatch] = useReducer(leverReducer, defaultValues);
  const [selectedMetric, setSelectedMetric] = useState<SelectedMetric>('Revenue');
  const [metricDropdownOpen, setMetricDropdownOpen] = useState(false);

  // Compute projection whenever lever values change
  const projection: LongTermProjection = useMemo(
    () => calculateLongTermProjection(leverValues),
    [leverValues],
  );

  // Group levers by category
  const leverGroups = useMemo(() => groupByCategory(levers), [levers]);

  // Build chart data from projection
  const chartData = useMemo(() => {
    return projection.years.map((yr) => {
      const metricKey = (scenario: 'conservative' | 'base' | 'optimistic') => {
        const pl = yr[scenario];
        switch (selectedMetric) {
          case 'Revenue':
            return pl.revenue;
          case 'Operating Income':
            return pl.operatingIncome;
          case 'Operating Margin':
            return pl.operatingMargin;
          case 'EPS':
            return pl.eps;
        }
      };

      return {
        year: yr.year,
        Conservative: metricKey('conservative'),
        Base: metricKey('base'),
        Optimistic: metricKey('optimistic'),
      };
    });
  }, [projection, selectedMetric]);

  // Summary table rows
  const tableRows = useMemo(() => {
    const metrics = [
      { label: 'Revenue', key: 'revenue' as const },
      { label: 'Operating Income', key: 'operatingIncome' as const },
      { label: 'Operating Margin', key: 'operatingMargin' as const },
      { label: 'Net Income', key: 'netIncome' as const },
      { label: 'EPS', key: 'eps' as const },
    ];

    return metrics.map((m) => {
      const fy26 = projection.years[0]?.base[m.key] ?? 0;
      const fy27 = projection.years[1]?.base[m.key] ?? 0;
      const fy28 = projection.years[2]?.base[m.key] ?? 0;

      let cagr = 0;
      if (m.key === 'operatingMargin') {
        // Margin: just show change in percentage points
        cagr = fy28 - fy26;
      } else if (fy26 > 0) {
        cagr = (Math.pow(fy28 / fy26, 1 / 2) - 1) * 100;
      }

      return {
        label: m.label,
        fy26: formatTableValue(fy26, m.label),
        fy27: formatTableValue(fy27, m.label),
        fy28: formatTableValue(fy28, m.label),
        cagr,
        isMargin: m.key === 'operatingMargin',
      };
    });
  }, [projection]);

  // Check if any lever has been changed from default
  const hasChanges = useMemo(
    () => levers.some((l) => Math.abs(leverValues[l.id] - l.default) > l.step * 0.1),
    [levers, leverValues],
  );

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ---- Header ---- */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Strategic Planning (FY26-FY28)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Long-term financial projections across growth, profitability, and investment levers
          </p>
        </div>

        {/* Metric selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setMetricDropdownOpen(!metricDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors shadow-sm"
          >
            <BarChart3 className="h-4 w-4" style={{ color: BRAND_GREEN }} />
            {selectedMetric}
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${metricDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {metricDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMetricDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1"
              >
                {METRIC_OPTIONS.map((metric) => (
                  <button
                    key={metric}
                    onClick={() => {
                      setSelectedMetric(metric);
                      setMetricDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedMetric === metric
                        ? 'font-semibold text-[#1c519c] bg-[#F0F0F0]/40'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {metric}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {/* ---- Main 40/60 Split ---- */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Levers (40%) */}
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-[40%] space-y-5"
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-6">
            {/* Panel header with reset */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: SOFT_GREEN }}
                >
                  <TrendingUp className="h-4 w-4" style={{ color: BRAND_GREEN }} />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Strategic Levers
                </span>
              </div>
              {hasChanges && (
                <button
                  onClick={() => dispatch({ type: 'RESET', defaults: defaultValues })}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#1c519c] transition-colors px-2 py-1 rounded-md border border-gray-200 hover:border-[#1c519c]/30"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset All
                </button>
              )}
            </div>

            {/* Lever groups by category */}
            {CATEGORY_ORDER.filter((cat) => leverGroups[cat]).map((category) => (
              <div key={category} className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1.5">
                  {category}
                </h3>
                {leverGroups[category].map((lever) => (
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
                      dispatch({ type: 'SET', id: lever.id, value: v })
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel - Chart + Summary (60%) */}
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-[60%] space-y-5"
        >
          {/* Multi-year Line Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">
                {selectedMetric} &mdash; 3-Year Projection
              </h2>
              <div className="flex items-center gap-3 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <span
                    className="w-5 h-0.5 rounded"
                    style={{
                      backgroundColor: CHART_COLORS.gray,
                      borderTop: `2px dashed ${CHART_COLORS.gray}`,
                    }}
                  />
                  Conservative
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-5 h-0.5 rounded"
                    style={{ backgroundColor: CHART_COLORS.green }}
                  />
                  Base
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-5 h-0.5 rounded"
                    style={{ backgroundColor: CHART_COLORS.emerald }}
                  />
                  Optimistic
                </span>
              </div>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 8, right: 16, bottom: 4, left: 8 }}
                >
                  <CartesianGrid
                    vertical={CHART_GRID_STYLE.vertical}
                    stroke={CHART_GRID_STYLE.stroke}
                  />
                  <XAxis
                    dataKey="year"
                    tick={CHART_AXIS_STYLE}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={CHART_AXIS_STYLE}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => formatYAxis(v, selectedMetric)}
                    width={56}
                  />
                  <Tooltip
                    {...CHART_TOOLTIP_DARK}
                    formatter={(value: number, name: string) => [
                      formatTooltipValue(value, selectedMetric),
                      name,
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="Conservative"
                    stroke={CHART_COLORS.gray}
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={{ r: 4, fill: CHART_COLORS.gray }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Base"
                    stroke={CHART_COLORS.green}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: CHART_COLORS.green }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Optimistic"
                    stroke={CHART_COLORS.emerald}
                    strokeWidth={2}
                    dot={{ r: 4, fill: CHART_COLORS.emerald }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3-Year CAGR Badges */}
          <div className="grid grid-cols-3 gap-3">
            {projection.cagr.map((c, i) => {
              const isPositive = c.value > 0;
              const icon =
                c.metric === 'Revenue'
                  ? DollarSign
                  : c.metric === 'EPS'
                  ? DollarSign
                  : Percent;

              return (
                <SummaryMetricCard
                  key={c.metric}
                  label={`${c.metric} CAGR`}
                  value={`${isPositive ? '+' : ''}${c.value.toFixed(1)}%`}
                  subtitle="3-Year Compound Growth"
                  icon={icon}
                  accentColor={isPositive ? BRAND_GREEN : '#EF4444'}
                  trend={isPositive ? 'up' : c.value < 0 ? 'down' : 'flat'}
                  trendLabel={isPositive ? 'Growth' : c.value < 0 ? 'Decline' : 'Flat'}
                  index={i}
                />
              );
            })}
          </div>

          {/* Summary Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                Financial Summary &mdash; Base Scenario
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">
                All figures based on current lever settings
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="px-5 py-2.5">Metric</th>
                    <th className="px-4 py-2.5 text-right">FY26</th>
                    <th className="px-4 py-2.5 text-right">FY27</th>
                    <th className="px-4 py-2.5 text-right">FY28</th>
                    <th className="px-4 py-2.5 text-right">3-Year CAGR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tableRows.map((row) => {
                    const cagrPositive = row.cagr > 0;
                    const cagrDisplay = row.isMargin
                      ? `${row.cagr >= 0 ? '+' : ''}${row.cagr.toFixed(1)}pp`
                      : `${row.cagr >= 0 ? '+' : ''}${row.cagr.toFixed(1)}%`;

                    return (
                      <tr
                        key={row.label}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-5 py-2.5 font-medium text-gray-900 text-xs">
                          {row.label}
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs text-gray-600 tabular-nums">
                          {row.fy26}
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs text-gray-600 tabular-nums">
                          {row.fy27}
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs font-medium text-gray-900 tabular-nums">
                          {row.fy28}
                        </td>
                        <td
                          className={`px-4 py-2.5 text-right text-xs font-semibold tabular-nums ${
                            cagrPositive
                              ? 'text-emerald-600'
                              : row.cagr < 0
                              ? 'text-red-500'
                              : 'text-gray-400'
                          }`}
                        >
                          {cagrDisplay}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
