'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryMetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?: string;
  trend?: 'up' | 'down' | 'flat';
  trendLabel?: string;
  index?: number;
}

export default function SummaryMetricCard({
  label, value, subtitle, icon: Icon, accentColor = '#003B2C',
  trend, trendLabel, index = 0,
}: SummaryMetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${accentColor}10` }}
        >
          <Icon className="h-4 w-4" style={{ color: accentColor }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            {trendLabel && <span>{trendLabel}</span>}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}
