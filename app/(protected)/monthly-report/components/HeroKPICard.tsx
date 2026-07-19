'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, YAxis } from 'recharts';
import { CHART_COLORS } from '@/lib/chart-theme';

interface SparklinePoint {
  label: string;
  value: number;
}

export interface HeroKPICardProps {
  title: string;
  value: string;
  unit?: string;
  trend: 'up' | 'down' | 'flat';
  trendValue: string;
  status: 'good' | 'warning' | 'critical';
  sparklineData?: SparklinePoint[];
  targetValue?: number;
  detail?: string;
  className?: string;
}

const statusConfig = {
  good: { dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'On Track' },
  warning: { dot: 'bg-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Watch' },
  critical: { dot: 'bg-red-400', bg: 'bg-red-50', text: 'text-red-700', label: 'Below' },
};

const trendConfig = {
  up: { Icon: TrendingUp, color: 'text-emerald-600' },
  down: { Icon: TrendingDown, color: 'text-red-500' },
  flat: { Icon: Minus, color: 'text-gray-400' },
};

export default function HeroKPICard({
  title,
  value,
  unit,
  trend,
  trendValue,
  status,
  sparklineData,
  targetValue,
  detail,
  className = '',
}: HeroKPICardProps) {
  const [expanded, setExpanded] = useState(false);
  const sc = statusConfig[status];
  const tc = trendConfig[trend];
  const TrendIcon = tc.Icon;

  // Compute domain for sparkline
  const values = sparklineData?.map(d => d.value) ?? [];
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) : 100;
  const padding = (maxVal - minVal) * 0.3 || 1;

  return (
    <div className={className}>
      <motion.div
        className={`bg-white rounded-xl border border-gray-200 p-5 transition-all hover:shadow-md ${
          detail ? 'cursor-pointer' : ''
        } ${expanded ? 'ring-2 ring-[#1c519c]/20' : ''}`}
        onClick={() => detail && setExpanded(!expanded)}
        whileTap={detail ? { scale: 0.98 } : undefined}
      >
        {/* Header row: title + status badge */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>
        </div>

        {/* Value row */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-3xl font-bold text-[#1c519c]">{value}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>

        {/* Trend row */}
        <div className="flex items-center gap-1.5 mb-3">
          <TrendIcon className={`w-3.5 h-3.5 ${tc.color}`} />
          <span className={`text-xs font-semibold ${tc.color}`}>{trendValue}</span>
        </div>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 1 && (
          <div className="h-10 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                <defs>
                  <linearGradient id={`spark-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.green} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <YAxis domain={[minVal - padding, maxVal + padding]} hide />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={CHART_COLORS.green}
                  strokeWidth={1.5}
                  fill={`url(#spark-${title.replace(/\s/g, '')})`}
                  dot={false}
                  activeDot={{ r: 2.5, fill: CHART_COLORS.green }}
                />
                {targetValue !== undefined && (
                  <ReferenceLine
                    y={targetValue}
                    stroke={CHART_COLORS.gray}
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expand hint */}
        {detail && (
          <div className="flex items-center justify-center mt-2 text-[10px] text-gray-400">
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </div>
        )}
      </motion.div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && detail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1 px-5 py-3 bg-[#F0F0F0]/30 rounded-lg border border-[#1c519c]/10 text-sm text-[#1c519c]">
              {detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
