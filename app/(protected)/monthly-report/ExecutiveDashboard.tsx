'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronUp, Target, Eye } from 'lucide-react';
import AIFeedback from '@/components/feedback/AIFeedback';
import { getPriorityColorClasses } from '@/lib/engines/health-engine';
import HeroKPICard from './components/HeroKPICard';
import type { FinancialConfig, KPIConfig } from '@/config/types';

interface ExecutiveDashboardProps {
  periodLabel: string;
  narrative?: {
    overallStatus: string;
    statusColor: string;
    narrative: string;
    keyAchievements: string[];
    concerns: string[];
  } | null;
  criticalActions?: Array<{
    id: number;
    title: string;
    priority: string;
    urgency: string;
    owner: string;
    dueDate: string;
    description: string;
    financialImpact: string;
    riskLevel: string;
    status: string;
    category: string;
  }>;
  forwardInsights?: Array<{
    id: number;
    type: string;
    title: string;
    insight: string;
    impact: string;
    timeframe: string;
    confidence: string;
  }>;
  financials?: FinancialConfig;
  kpis?: KPIConfig;
}

export default function ExecutiveDashboard({
  periodLabel,
  narrative,
  criticalActions = [],
  forwardInsights = [],
  financials,
  kpis,
}: ExecutiveDashboardProps) {
  const [expandedAction, setExpandedAction] = useState<number | null>(null);

  const summary = narrative ?? {
    overallStatus: 'Loading...',
    statusColor: 'green',
    narrative: '',
    keyAchievements: [],
    concerns: [],
  };

  // Build sparkline data from quarterly data
  const quarters = financials?.quarters ?? [];
  const buildSparkline = (metric: 'revenue' | 'feeRevenueGrowth' | 'operatingMargin' | 'netNewClients') =>
    quarters.map(q => ({ label: q.quarter, value: metric === 'netNewClients' ? (q.netNewClients ?? 0) : q[metric] as number }));

  // Map primary KPIs to hero cards
  const primaryKPIs = kpis?.primaryKPIs ?? [];
  const kpiCardData = primaryKPIs.map((kpi, i) => {
    const sparklineMetrics: Array<'revenue' | 'feeRevenueGrowth' | 'operatingMargin' | 'netNewClients'> = [
      'revenue', 'feeRevenueGrowth', 'operatingMargin', 'revenue',
    ];
    const targetValues = [
      parseFloat(String(kpi.target ?? 0)),
      parseFloat(String(kpi.target ?? 0)),
      parseFloat(String(kpi.target ?? 0)),
      parseFloat(String(kpi.target ?? 0)),
    ];
    return {
      title: kpi.label,
      value: String(kpi.value),
      unit: kpi.unit,
      trend: kpi.trend,
      trendValue: kpi.trendValue,
      status: kpi.status,
      sparklineData: buildSparkline(sparklineMetrics[i]),
      targetValue: targetValues[i] || undefined,
      detail: kpi.description,
    };
  });

  // Show only top 3 critical actions sorted by priority
  const priorityOrder: Record<string, number> = { high: 0, critical: 0, medium: 1, low: 2 };
  const topActions = [...criticalActions]
    .sort((a, b) => (priorityOrder[a.priority.toLowerCase()] ?? 2) - (priorityOrder[b.priority.toLowerCase()] ?? 2))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Section A: State of the Business Banner */}
      <div className="bg-gradient-to-r from-[#003B2C] to-[#003B2C] rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm text-sm font-semibold">
            State of the Business
          </span>
          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
            summary.statusColor === 'green' ? 'bg-emerald-500/90' : 'bg-amber-500/90'
          }`}>
            {summary.overallStatus}
          </span>
          <span className="ml-auto text-sm text-white/60">{periodLabel}</span>
        </div>
        <p className="text-base leading-relaxed text-white/90 line-clamp-2">{summary.narrative}</p>
        <div className="mt-3 flex justify-end">
          <AIFeedback contentId="state-of-business-narrative" contentType="narrative" size="sm" />
        </div>
      </div>

      {/* Section B: Hero KPI Cards */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCardData.map((kpi) => (
            <HeroKPICard key={kpi.title} {...kpi} />
          ))}
        </div>
      </div>

      {/* Section C: Critical Actions (top 3, compact) */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-red-100 rounded-lg">
            <Target className="w-4 h-4 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Critical Actions & Decisions</h2>
          <span className="ml-auto px-2.5 py-0.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800">
            {criticalActions.length} Active
          </span>
        </div>
        <div className="space-y-2">
          {topActions.map((action) => {
            const isExpanded = expandedAction === action.id;
            return (
              <div key={action.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#003B2C]/30 transition-colors">
                <button
                  onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-gray-50/50"
                >
                  <div className={`w-1 h-8 rounded-full ${action.priority.toLowerCase() === 'high' ? 'bg-red-500' : action.priority.toLowerCase() === 'medium' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{action.title}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${getPriorityColorClasses(action.priority)}`}>
                    {action.priority.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 bg-[#F0F0F0] text-[#003B2C] rounded text-[10px] font-semibold shrink-0">
                    {action.category}
                  </span>
                  <span className="text-xs text-gray-500 shrink-0 w-16 text-right">{action.owner}</span>
                  <span className="text-xs text-gray-500 shrink-0 w-14 text-right">{action.dueDate}</span>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  }
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50/50">
                        <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-xs text-gray-500">Financial Impact</span>
                            <p className="font-semibold text-emerald-600">{action.financialImpact}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Risk Level</span>
                            <p className="font-semibold text-gray-900">{action.riskLevel}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section D: What to Watch (forward insights) */}
      {forwardInsights.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-1.5 bg-[#F0F0F0] rounded-lg">
              <Eye className="w-4 h-4 text-[#003B2C]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">What to Watch</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {forwardInsights.slice(0, 6).map((insight) => (
              <div
                key={insight.id}
                className={`rounded-lg p-4 border-l-4 bg-white border border-gray-200 ${
                  insight.type === 'opportunity' ? 'border-l-emerald-500' : 'border-l-red-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-semibold uppercase ${
                    insight.type === 'opportunity' ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {insight.type}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-auto">{insight.timeframe}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{insight.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{insight.insight}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900">{insight.impact}</span>
                  <span className="text-[10px] text-gray-400">{insight.confidence} confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
