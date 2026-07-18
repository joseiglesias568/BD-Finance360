'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight, X, ExternalLink } from 'lucide-react';
import AIFeedback from '@/components/feedback/AIFeedback';
import Link from 'next/link';

export interface DrillDownTileProps {
  title: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  status?: 'on-track' | 'at-risk' | 'behind' | 'neutral';
  /** L2: Detail content shown when expanded */
  detail?: {
    description: string;
    chartData?: { label: string; value: number }[];
    drivers?: { name: string; impact: string; direction: 'positive' | 'negative' | 'neutral' }[];
    aiInsight?: string;
  };
  /** L3: Full report link */
  reportLink?: string;
  reportLabel?: string;
  className?: string;
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  'on-track': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  'at-risk': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  'behind': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
  'neutral': { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' },
};

const TrendIcon = ({ trend }: { trend?: string }) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-600" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
};

export default function DrillDownTile({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = 'neutral',
  detail,
  reportLink,
  reportLabel,
  className = '',
}: DrillDownTileProps) {
  const [expanded, setExpanded] = useState(false);
  const colors = statusColors[status];

  return (
    <div className={`relative ${className}`}>
      {/* Level 1: Compact Tile */}
      <motion.button
        onClick={() => detail && setExpanded(!expanded)}
        className={`w-full text-left bg-white rounded-xl border border-gray-200 p-4 shadow-sm transition-all ${
          detail ? 'cursor-pointer hover:shadow-md hover:border-[#003B2C]/30' : ''
        } ${expanded ? 'ring-2 ring-[#003B2C]/20' : ''}`}
        whileTap={detail ? { scale: 0.98 } : undefined}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-[#003B2C]">{value}</span>
              {unit && <span className="text-sm text-gray-500">{unit}</span>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {status !== 'neutral' && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {status.replace('-', ' ')}
              </span>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                <TrendIcon trend={trend} />
                {trendValue && (
                  <span className={`text-xs font-medium ${
                    trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {trendValue}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {detail && !expanded && (
          <div className="flex items-center gap-1 mt-2 text-xs text-[#003B2C]">
            <span>View details</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        )}
      </motion.button>

      {/* Level 2: Expanded Detail Panel */}
      <AnimatePresence>
        {expanded && detail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-white rounded-xl border border-gray-200 shadow-md p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Detail Analysis</h4>
                <button onClick={() => setExpanded(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{detail.description}</p>

              {/* Mini bar chart */}
              {detail.chartData && detail.chartData.length > 0 && (
                <div className="mb-4">
                  <div className="space-y-2">
                    {detail.chartData.map((d) => {
                      const maxVal = Math.max(...detail.chartData!.map((x) => Math.abs(x.value)));
                      const pct = maxVal > 0 ? (Math.abs(d.value) / maxVal) * 100 : 0;
                      return (
                        <div key={d.label} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-20 text-right truncate">{d.label}</span>
                          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className={`h-full rounded-full ${d.value >= 0 ? 'bg-[#003B2C]' : 'bg-red-400'}`}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 w-12">{d.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Drivers */}
              {detail.drivers && detail.drivers.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Drivers</p>
                  <div className="space-y-1.5">
                    {detail.drivers.map((driver) => (
                      <div key={driver.name} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{driver.name}</span>
                        <span className={`font-medium ${
                          driver.direction === 'positive' ? 'text-emerald-600' :
                          driver.direction === 'negative' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {driver.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insight */}
              {detail.aiInsight && (
                <div className="p-3 bg-[#F0F0F0]/40 rounded-lg border border-[#003B2C]/10 mb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#003B2C] mb-1">AI Insight</p>
                      <p className="text-sm text-[#003B2C]">{detail.aiInsight}</p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <AIFeedback contentId={`drilldown-${title}-insight`} contentType="insight" size="sm" />
                    </div>
                  </div>
                </div>
              )}

              {/* Level 3: Report Link */}
              {reportLink && (
                <Link
                  href={reportLink}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#003B2C] hover:text-[#003B2C] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {reportLabel || 'View full report'}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
