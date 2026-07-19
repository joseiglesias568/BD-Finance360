'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3 } from 'lucide-react';

import type { BridgePLLine, BridgeQuarter } from '@/lib/epm/bridge-data';
import { BRIDGE_PL_LINES } from '@/lib/epm/bridge-data';
import SummaryMetricCard from '@/components/epm/SummaryMetricCard';
import PLLineSelector from '@/components/epm/PLLineSelector';
import QuarterSelector from '@/components/epm/QuarterSelector';
import WaterfallBridge from '@/components/epm/WaterfallBridge';

interface BridgeWalksClientProps {
  bridgeData: BridgeQuarter[];
}

export default function BridgeWalksClient({ bridgeData }: BridgeWalksClientProps) {
  const quarters = useMemo(
    () => Array.from(new Set(bridgeData.map(b => b.periodLabel))),
    [bridgeData]
  );
  const [selectedQuarter, setSelectedQuarter] = useState(quarters[quarters.length - 1] || 'Q2 FY26');
  const [selectedLine, setSelectedLine] = useState<BridgePLLine>('Revenue');

  const bridge = useMemo(
    () => bridgeData.find(b => b.periodLabel === selectedQuarter && b.plLine === selectedLine),
    [bridgeData, selectedQuarter, selectedLine]
  );

  // Compute summary metrics
  const summary = useMemo(() => {
    if (!bridge) return { totalVariance: 0, largestDriver: '', favorableCount: 0, unfavorableCount: 0 };
    const items = bridge.items;
    const totalVariance = bridge.actualValue - bridge.forecastValue;
    const sorted = [...items].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    const largestDriver = sorted[0]?.driverLabel || 'N/A';
    const favorableCount = items.filter(i => i.impact > 0).length;
    const unfavorableCount = items.filter(i => i.impact < 0).length;
    return { totalVariance, largestDriver, favorableCount, unfavorableCount };
  }, [bridge]);

  const isEPS = selectedLine === 'Adjusted EPS';
  const formatVal = (v: number) => {
    if (isEPS) return `$${v.toFixed(2)}`;
    if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}B`;
    return `$${v.toLocaleString()}M`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold text-gray-900">Quarterly Bridge Walk</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Forecast-to-actual variance analysis by P&L line
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <QuarterSelector quarters={quarters} selected={selectedQuarter} onSelect={setSelectedQuarter} />
        <div className="h-4 w-px bg-gray-200 hidden sm:block" />
        <PLLineSelector lines={[...BRIDGE_PL_LINES]} selected={selectedLine} onSelect={(l) => setSelectedLine(l as BridgePLLine)} />
      </div>

      {/* Summary Cards */}
      {bridge && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SummaryMetricCard
            label="Total Variance"
            value={`${summary.totalVariance >= 0 ? '+' : ''}${formatVal(summary.totalVariance)}`}
            subtitle={`${selectedQuarter} ${selectedLine}`}
            icon={GitBranch}
            trend={summary.totalVariance >= 0 ? 'up' : 'down'}
            index={0}
          />
          <SummaryMetricCard
            label="Largest Driver"
            value={summary.largestDriver}
            subtitle="By absolute impact"
            icon={BarChart3}
            accentColor="#1c519c"
            index={1}
          />
          <SummaryMetricCard
            label="Favorable Drivers"
            value={`${summary.favorableCount}`}
            subtitle="Positive variance items"
            icon={ArrowUpRight}
            accentColor="#10b981"
            index={2}
          />
          <SummaryMetricCard
            label="Unfavorable Drivers"
            value={`${summary.unfavorableCount}`}
            subtitle="Negative variance items"
            icon={ArrowDownRight}
            accentColor="#ef4444"
            index={3}
          />
        </div>
      )}

      {/* Waterfall Chart */}
      {bridge ? (
        <motion.div
          key={`${selectedQuarter}-${selectedLine}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-[#1c519c]" />
            <h2 className="text-sm font-bold text-gray-900">
              {selectedLine} Bridge — {selectedQuarter}
            </h2>
            <span className="text-[10px] text-gray-400 ml-1">
              Forecast {formatVal(bridge.forecastValue)} → Actual {formatVal(bridge.actualValue)}
            </span>
          </div>

          <WaterfallBridge
            startLabel={`${selectedQuarter} Forecast`}
            startValue={bridge.forecastValue}
            endLabel={`${selectedQuarter} Actual`}
            endValue={bridge.actualValue}
            items={bridge.items.map(i => ({
              label: i.driverLabel,
              impact: i.impact,
              description: i.description,
            }))}
            isEPS={isEPS}
            height={340}
          />
        </motion.div>
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-500">No bridge data available for {selectedQuarter} — {selectedLine}</p>
        </div>
      )}
    </div>
  );
}
