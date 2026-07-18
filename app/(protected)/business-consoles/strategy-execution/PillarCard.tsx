'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';

export interface PillarKPI {
  kpiName: string;
  baseline: number;
  current: number;
  target: number;
  unit: string;
  status: string;
  commentary: string;
}

export interface PillarData {
  name: string;
  overallStatus: 'on-track' | 'at-risk' | 'behind' | 'ahead';
  kpis: PillarKPI[];
  onTrackPercent: number;
  keyMetricValue: string;
  sparkline: number[];
}

interface PillarCardProps {
  pillar: PillarData;
  isExpanded: boolean;
  onToggle: () => void;
}

const statusConfig = {
  'on-track': { color: '#003B2C', bg: 'bg-[#F0F0F0]', text: 'text-[#003B2C]', label: 'On Track', icon: CheckCircle2, ring: 'stroke-[#003B2C]' },
  'ahead': { color: '#003B2C', bg: 'bg-[#F0F0F0]', text: 'text-[#003B2C]', label: 'Ahead', icon: TrendingUp, ring: 'stroke-[#003B2C]' },
  'at-risk': { color: '#D97706', bg: 'bg-amber-50', text: 'text-amber-700', label: 'At Risk', icon: AlertTriangle, ring: 'stroke-amber-500' },
  'behind': { color: '#DC2626', bg: 'bg-red-50', text: 'text-red-700', label: 'Behind', icon: XCircle, ring: 'stroke-red-500' },
};

const kpiStatusColors: Record<string, { bg: string; text: string; border: string }> = {
  'on-track': { bg: 'bg-[#F0F0F0]', text: 'text-[#003B2C]', border: 'border-[#003B2C]/20' },
  'ahead': { bg: 'bg-[#F0F0F0]', text: 'text-[#003B2C]', border: 'border-[#003B2C]/20' },
  'at-risk': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'behind': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

function ProgressRing({ percent, size = 56, strokeWidth = 5, statusKey }: { percent: number; size?: number; strokeWidth?: number; statusKey: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const cfg = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig['on-track'];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={cfg.color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-900">{percent}%</span>
      </div>
    </div>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 24;
  const w = 60;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');

  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline fill="none" stroke={color} strokeWidth={1.5} points={points} />
    </svg>
  );
}

function formatKPIValue(value: number, unit: string): string {
  if (unit === '%') return `${value.toFixed(1)}%`;
  if (unit === 'min') return `${value.toFixed(1)} min`;
  if (unit === '$') return `$${value.toFixed(2)}`;
  if (unit === 'score') return `${value.toFixed(0)}`;
  if (unit === 'count') return value.toLocaleString();
  return `${value}`;
}

export default function PillarCard({ pillar, isExpanded, onToggle }: PillarCardProps) {
  const cfg = statusConfig[pillar.overallStatus] || statusConfig['on-track'];
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      layout
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-shadow ${isExpanded ? 'shadow-md ring-1 ring-[#003B2C]/10' : 'hover:shadow-md'}`}
    >
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 focus:outline-none focus:ring-2 focus:ring-[#003B2C]/20 rounded-xl"
      >
        <div className="flex items-start gap-4">
          {/* Progress Ring */}
          <ProgressRing percent={pillar.onTrackPercent} statusKey={pillar.overallStatus} />

          {/* Title + Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-[#003B2C] truncate">{pillar.name}</h3>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                <StatusIcon className="w-3 h-3" />
                {cfg.label}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-lg font-bold text-gray-900">{pillar.keyMetricValue}</span>
              <MiniSparkline data={pillar.sparkline} color={cfg.color} />
            </div>

            <p className="text-[10px] text-gray-500 mt-1">
              {pillar.kpis.filter(k => k.status === 'on-track' || k.status === 'ahead').length} of {pillar.kpis.length} KPIs on track
            </p>
          </div>

          {/* Expand indicator */}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expanded KPI Detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
              {pillar.kpis.map((kpi) => {
                const kpiCfg = kpiStatusColors[kpi.status] || kpiStatusColors['on-track'];
                const progress = kpi.target !== 0 ? Math.min(100, Math.max(0, ((kpi.current - kpi.baseline) / (kpi.target - kpi.baseline)) * 100)) : 0;

                return (
                  <div key={kpi.kpiName} className={`rounded-lg border ${kpiCfg.border} p-3`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-800">{kpi.kpiName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${kpiCfg.bg} ${kpiCfg.text}`}>
                        {kpi.status.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Baseline -> Current -> Target */}
                    <div className="flex items-center gap-3 text-[11px] mb-2">
                      <div className="text-gray-500">
                        Baseline: <span className="font-medium text-gray-700">{formatKPIValue(kpi.baseline, kpi.unit)}</span>
                      </div>
                      <div className="text-gray-900 font-bold">
                        Current: {formatKPIValue(kpi.current, kpi.unit)}
                      </div>
                      <div className="text-gray-500">
                        Target: <span className="font-medium text-gray-700">{formatKPIValue(kpi.target, kpi.unit)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`h-full rounded-full ${
                          kpi.status === 'on-track' || kpi.status === 'ahead' ? 'bg-[#003B2C]' :
                          kpi.status === 'at-risk' ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      />
                    </div>

                    {/* Commentary */}
                    {kpi.commentary && (
                      <p className="text-[10px] text-gray-500 mt-2 leading-relaxed italic">{kpi.commentary}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
