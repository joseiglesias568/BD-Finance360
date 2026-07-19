'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, AlertTriangle, Target, BarChart3, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

import type { ROItem, ROAdjustmentResult } from '@/lib/epm/ro-adjustment-engine';
import SummaryMetricCard from '@/components/epm/SummaryMetricCard';
import WaterfallBridge from '@/components/epm/WaterfallBridge';
import TornadoChart from '@/components/epm/TornadoChart';

interface RisksOpportunitiesClientProps {
  risks: ROItem[];
  opportunities: ROItem[];
  adjustment: ROAdjustmentResult;
  tornadoData: { label: string; low: number; high: number; expected: number }[];
}

export default function RisksOpportunitiesClient({
  risks,
  opportunities,
  adjustment,
  tornadoData,
}: RisksOpportunitiesClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'risks' | 'opportunities'>('all');

  const allItems = useMemo(() => {
    if (activeTab === 'risks') return risks;
    if (activeTab === 'opportunities') return opportunities;
    return [...risks, ...opportunities];
  }, [activeTab, risks, opportunities]);

  const formatM = (v: number) => {
    if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}B`;
    return `$${Math.abs(v).toLocaleString()}M`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-gray-900">Risks & Opportunities</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Management adjustments to ML forecast &bull; Probability-weighted impact analysis
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryMetricCard
          label="ML Forecast (FY26 Revenue)"
          value={formatM(adjustment.mlForecast)}
          subtitle="Baseline from 18-month forecast"
          icon={Target}
          index={0}
        />
        <SummaryMetricCard
          label="Risk Exposure"
          value={`-${formatM(Math.abs(adjustment.totalRiskImpact))}`}
          subtitle={`${risks.length} identified risks`}
          icon={ArrowDownRight}
          accentColor="#ef4444"
          trend="down"
          trendLabel="Downside"
          index={1}
        />
        <SummaryMetricCard
          label="Opportunity Upside"
          value={`+${formatM(adjustment.totalOppImpact)}`}
          subtitle={`${opportunities.length} identified opportunities`}
          icon={ArrowUpRight}
          accentColor="#10b981"
          trend="up"
          trendLabel="Upside"
          index={2}
        />
        <SummaryMetricCard
          label="Management-Adjusted Forecast"
          value={formatM(adjustment.adjustedForecast)}
          subtitle={`Net: ${adjustment.adjustedForecast - adjustment.mlForecast >= 0 ? '+' : ''}${formatM(adjustment.adjustedForecast - adjustment.mlForecast)}`}
          icon={Shield}
          accentColor="#1c519c"
          trend={adjustment.adjustedForecast >= adjustment.mlForecast ? 'up' : 'down'}
          index={3}
        />
      </div>

      {/* Adjustment Waterfall */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-[#1c519c]" />
          <h2 className="text-sm font-bold text-gray-900">Forecast Adjustment Waterfall</h2>
          <span className="text-[10px] text-gray-400 ml-1">ML Forecast → Risk/Opportunity adjustments → Management-Adjusted Forecast</span>
        </div>

        <WaterfallBridge
          startLabel="ML Forecast"
          startValue={adjustment.mlForecast}
          endLabel="Adjusted Forecast"
          endValue={adjustment.adjustedForecast}
          items={adjustment.waterfall.map(w => ({
            label: w.label,
            impact: w.impact,
            description: w.type === 'risk' ? 'Risk (probability-weighted)' : 'Opportunity (probability-weighted)',
          }))}
          height={340}
          showTable={false}
        />
      </motion.div>

      {/* Tornado Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-[#1c519c]" />
          <h2 className="text-sm font-bold text-gray-900">Impact Range Analysis</h2>
          <span className="text-[10px] text-gray-400 ml-1">Full downside/upside impact at 100% probability</span>
        </div>

        <TornadoChart items={tornadoData} height={Math.max(250, tornadoData.length * 35)} />

        {/* Range Summary */}
        <div className="mt-4 flex items-center justify-center gap-6 pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wider">Worst Case</p>
            <p className="text-lg font-bold text-red-600">{formatM(adjustment.worstCase)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-red-300" />
            <div className="h-2 w-2 rounded-full bg-red-400" />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-[#1c519c] font-semibold uppercase tracking-wider">Expected</p>
            <p className="text-lg font-bold text-[#1c519c]">{formatM(adjustment.expectedCase)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <div className="h-px w-8 bg-emerald-300" />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Best Case</p>
            <p className="text-lg font-bold text-emerald-600">{formatM(adjustment.bestCase)}</p>
          </div>
        </div>
      </motion.div>

      {/* R&O Register */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">R&O Register</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {(['all', 'risks', 'opportunities'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                  activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                }`}
              >
                {tab === 'all' ? 'All R&Os' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Type</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600 min-w-[180px]">Title</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-600">Probability</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-600">Impact</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-600">Expected Value</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Category</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Owner</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Trend</th>
              </tr>
            </thead>
            <tbody>
              {allItems.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.type === 'risk' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {item.type === 'risk' ? 'Risk' : 'Opp'}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-medium text-gray-800">{item.title}</td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.probabilityPct >= 70 ? 'bg-red-500' :
                            item.probabilityPct >= 40 ? 'bg-amber-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${item.probabilityPct}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-gray-700">{item.probabilityPct}%</span>
                    </div>
                  </td>
                  <td className={`py-2 px-3 text-right font-mono tabular-nums font-semibold ${
                    item.impactAmount > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {item.impactAmount > 0 ? '+' : ''}{formatM(item.impactAmount)}
                  </td>
                  <td className={`py-2 px-3 text-right font-mono tabular-nums font-semibold ${
                    item.expectedValue > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {item.expectedValue > 0 ? '+' : ''}{formatM(item.expectedValue)}
                  </td>
                  <td className="py-2 px-3 text-gray-600">{item.category}</td>
                  <td className="py-2 px-3 text-gray-600">{item.owner}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      {item.trend === 'increasing' ? (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      ) : item.trend === 'decreasing' ? (
                        <TrendingDown className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Minus className="h-3 w-3 text-gray-400" />
                      )}
                      <span className="text-gray-500 capitalize">{item.trend}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
