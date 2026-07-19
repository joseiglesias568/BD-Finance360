'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight, X, Sparkles } from 'lucide-react';
import SparklineChart from './SparklineChart';
import StatusBadge from './StatusBadge';

export interface HeroKPI {
  id: string;
  label: string;
  value: string;
  unit?: string;
  change: string;
  changeDirection: 'up' | 'down' | 'flat';
  sparkline: number[];
  target?: string;
  gap?: string;
  status: 'good' | 'warning' | 'critical';
  subDrivers?: { name: string; impact: string; direction: 'positive' | 'negative' | 'neutral' }[];
  aiInsight?: string;
  driversTabId?: string; // ID to pre-select in Drivers tab
}

interface HeroKPIStripProps {
  kpis: HeroKPI[];
  onNavigateToDrivers?: (driverId: string) => void;
}

const TrendIcon = ({ direction, className = 'w-3.5 h-3.5' }: { direction: string; className?: string }) => {
  if (direction === 'up') return <TrendingUp className={`${className} text-emerald-600`} />;
  if (direction === 'down') return <TrendingDown className={`${className} text-red-500`} />;
  return <Minus className={`${className} text-gray-400`} />;
};

const statusBorderColors: Record<string, string> = {
  good: 'border-l-emerald-500',
  warning: 'border-l-amber-500',
  critical: 'border-l-red-500',
};

export default function HeroKPIStrip({ kpis, onNavigateToDrivers }: HeroKPIStripProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map((kpi, idx) => {
        const isExpanded = expandedId === kpi.id;
        const borderColor = statusBorderColors[kpi.status] || 'border-l-gray-300';

        return (
          <div key={kpi.id} className="relative">
            {/* L1: Compact KPI Card */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              onClick={() => setExpandedId(isExpanded ? null : kpi.id)}
              className={`w-full text-left bg-white rounded-xl border border-gray-200 border-l-4 ${borderColor} p-4 shadow-sm
                hover:shadow-md hover:border-gray-300 transition-all cursor-pointer
                ${isExpanded ? 'ring-2 ring-[#1c519c]/20 shadow-md' : ''}`}
            >
              <div className="flex items-start justify-between mb-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider leading-tight">{kpi.label}</p>
                <StatusBadge status={kpi.status} dotOnly size="sm" />
              </div>

              <div className="flex items-end justify-between mt-2">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#1c519c]">{kpi.value}</span>
                    {kpi.unit && <span className="text-sm text-gray-500">{kpi.unit}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon direction={kpi.changeDirection} className="w-3 h-3" />
                    <span className={`text-xs font-semibold ${
                      kpi.changeDirection === 'up' ? 'text-emerald-600' :
                      kpi.changeDirection === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-xs text-gray-400">YoY</span>
                  </div>
                </div>
                <SparklineChart
                  data={kpi.sparkline}
                  width={64}
                  height={24}
                  color={kpi.status === 'critical' ? '#EF4444' : kpi.status === 'warning' ? '#F59E0B' : '#1c519c'}
                />
              </div>

              {kpi.target && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Target: {kpi.target}</span>
                  {kpi.gap && (
                    <span className={`text-xs font-semibold ${
                      kpi.gap.startsWith('+') ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {kpi.gap}
                    </span>
                  )}
                </div>
              )}

              {!isExpanded && (
                <div className="flex items-center gap-1 mt-2 text-xs text-[#1c519c] opacity-60">
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </motion.button>

            {/* L2: Expanded Detail */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 bg-white rounded-xl border border-gray-200 shadow-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-[#1c519c]">Key Drivers</h4>
                      <button onClick={(e) => { e.stopPropagation(); setExpandedId(null); }} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {kpi.subDrivers && kpi.subDrivers.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {kpi.subDrivers.map((d) => (
                          <div key={d.name} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{d.name}</span>
                            <span className={`font-medium ${
                              d.direction === 'positive' ? 'text-emerald-600' :
                              d.direction === 'negative' ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              {d.impact}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {kpi.aiInsight && (
                      <div className="p-2.5 bg-[#F0F0F0]/40 rounded-lg border border-[#1c519c]/10 mb-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-3 h-3 text-[#1c519c]" />
                          <span className="text-xs font-semibold text-[#1c519c]">AI Insight</span>
                        </div>
                        <p className="text-xs text-[#1c519c] leading-relaxed">{kpi.aiInsight}</p>
                      </div>
                    )}

                    {kpi.driversTabId && onNavigateToDrivers && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onNavigateToDrivers(kpi.driversTabId!); }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1c519c] hover:text-[#1c519c] transition-colors"
                      >
                        <span>View full analysis</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
