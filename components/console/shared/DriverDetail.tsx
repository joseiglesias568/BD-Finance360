'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_TOOLTIP_DARK, CHART_GRID_STYLE } from '@/lib/chart-theme';
import StatusBadge from './StatusBadge';

export interface DriverDetailData {
  id: string;
  name: string;
  description: string;
  value: string;
  unit?: string;
  target?: string;
  gap?: string;
  trend: 'up' | 'down' | 'flat';
  trendValue: string;
  status: 'good' | 'warning' | 'critical';
  // Trend chart data
  trendData: { period: string; actual: number; target?: number }[];
  // Sub-driver contributions
  subDrivers: { name: string; contribution: number; unit: string }[];
  // Variance
  variance?: { actual: string; plan: string; priorYear: string };
  // AI insight
  aiInsight?: string;
  // Cross-references to other consoles
  crossRefs?: { label: string; consoleId: string }[];
}

interface DriverDetailProps {
  driver: DriverDetailData | null;
}

const TrendIcon = ({ direction }: { direction: string }) => {
  if (direction === 'up') return <TrendingUp className="w-4 h-4 text-emerald-600" />;
  if (direction === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
};

export default function DriverDetail({ driver }: DriverDetailProps) {
  if (!driver) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3 opacity-30">
            <TrendingUp className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm font-medium">Select a driver from the tree</p>
          <p className="text-xs mt-1">Click any driver to view its detailed analysis</p>
        </div>
      </div>
    );
  }

  const maxContribution = Math.max(...driver.subDrivers.map((d) => Math.abs(d.contribution)), 1);

  return (
    <motion.div
      key={driver.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1c519c]">{driver.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{driver.description}</p>
        </div>
        <StatusBadge status={driver.status} />
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Current</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-[#1c519c]">{driver.value}</span>
            {driver.unit && <span className="text-xs text-gray-500">{driver.unit}</span>}
          </div>
        </div>
        {driver.target && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Target</p>
            <p className="text-xl font-bold text-[#1c519c] mt-1">{driver.target}</p>
          </div>
        )}
        {driver.gap && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Gap</p>
            <p className={`text-xl font-bold mt-1 ${
              driver.gap.startsWith('+') ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {driver.gap}
            </p>
          </div>
        )}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Trend</p>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendIcon direction={driver.trend} />
            <span className={`text-xl font-bold ${
              driver.trend === 'up' ? 'text-emerald-600' :
              driver.trend === 'down' ? 'text-red-500' : 'text-gray-600'
            }`}>
              {driver.trendValue}
            </span>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      {driver.trendData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-[#1c519c] mb-3">Trend Analysis</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={driver.trendData}>
              <CartesianGrid {...CHART_GRID_STYLE} />
              <XAxis dataKey="period" {...CHART_AXIS_STYLE} />
              <YAxis {...CHART_AXIS_STYLE} />
              <Tooltip {...CHART_TOOLTIP_DARK} />
              <Line
                type="monotone"
                dataKey="actual"
                stroke={CHART_COLORS.green}
                strokeWidth={2}
                dot={{ r: 3, fill: CHART_COLORS.green }}
                name="Actual"
              />
              {driver.trendData.some((d) => d.target != null) && (
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke={CHART_COLORS.gray}
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={false}
                  name="Target"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sub-Driver Contributions */}
      {driver.subDrivers.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-[#1c519c] mb-3">Driver Contributions</h3>
          <div className="space-y-2.5">
            {driver.subDrivers.map((sd) => {
              const pct = (Math.abs(sd.contribution) / maxContribution) * 100;
              const isPositive = sd.contribution >= 0;
              return (
                <div key={sd.name} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-36 text-right truncate">{sd.name}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full rounded-full ${isPositive ? 'bg-[#1c519c]' : 'bg-red-400'}`}
                    />
                  </div>
                  <span className={`text-xs font-semibold w-16 text-right ${
                    isPositive ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {isPositive ? '+' : ''}{sd.contribution}{sd.unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Variance Card */}
      {driver.variance && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1c519c] rounded-lg p-3 text-white">
            <p className="text-xs text-white/70">Actual</p>
            <p className="text-lg font-bold mt-1">{driver.variance.actual}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">vs Plan</p>
            <p className="text-lg font-bold text-[#1c519c] mt-1">{driver.variance.plan}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">vs Prior Year</p>
            <p className="text-lg font-bold text-[#1c519c] mt-1">{driver.variance.priorYear}</p>
          </div>
        </div>
      )}

      {/* AI Insight */}
      {driver.aiInsight && (
        <div className="p-4 bg-[#F0F0F0]/40 rounded-xl border border-[#1c519c]/10">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-[#1c519c]" />
            <span className="text-xs font-semibold text-[#1c519c]">AI Analysis</span>
          </div>
          <p className="text-sm text-[#1c519c] leading-relaxed">{driver.aiInsight}</p>
        </div>
      )}

      {/* Cross-references */}
      {driver.crossRefs && driver.crossRefs.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Related Consoles</h4>
          <div className="flex flex-wrap gap-2">
            {driver.crossRefs.map((ref) => (
              <span
                key={ref.consoleId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-[#1c519c]/30 hover:text-[#1c519c] cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {ref.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
