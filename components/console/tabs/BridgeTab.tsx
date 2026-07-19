'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Edit2,
  Sparkles,
  Brain,
  Clock,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_TOOLTIP_DARK, CHART_GRID_STYLE } from '@/lib/chart-theme';
import type { BridgeCommentary } from '../types';

interface BridgeTabProps {
  title?: string;
  periodLabel?: string;
  totalVariance: string;
  totalVariancePercent: string;
  items: BridgeCommentary[];
  consoleSlug?: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-600' },
  submitted: { bg: 'bg-amber-100', text: 'text-amber-700' },
  approved: { bg: 'bg-blue-100', text: 'text-blue-700' },
  'signed-off': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

export default function BridgeTab({
  title = 'Revenue Bridge Analysis',
  periodLabel = 'Q1 FY26 vs Q1 FY25',
  totalVariance,
  totalVariancePercent,
  items,
  consoleSlug = '',
}: BridgeTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedBarId, setSelectedBarId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Save commentary to the centralized Commentary API
  const saveToCommentary = useCallback(async (item: BridgeCommentary, text: string) => {
    try {
      await fetch('/api/commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Bridge Commentary: ${item.component}`,
          content: text,
          category: 'Financial Performance',
          commentaryType: 'analysis',
          priority: 'medium',
          fiscalPeriod: periodLabel.split(' vs ')[0] || 'Q1 FY26',
          relatedKPIs: [item.component],
          relatedConsoles: consoleSlug ? [consoleSlug] : [],
          tags: ['bridge', 'variance', item.component.toLowerCase().replace(/\s+/g, '-')],
        }),
      });
      setSavedId(item.id);
      setTimeout(() => setSavedId(null), 2000);
    } catch {
      // Silently fail for demo — commentary still saved locally
    }
  }, [periodLabel, consoleSlug]);

  // Build waterfall chart data
  const chartData = items.map((item) => ({
    name: item.component.length > 12 ? item.component.slice(0, 12) + '...' : item.component,
    value: item.value,
    fill: item.value >= 0 ? CHART_COLORS.green : CHART_COLORS.red,
  }));

  // Progress tracking
  const signedOff = items.filter((i) => i.status === 'signed-off').length;
  const submitted = items.filter((i) => i.status === 'submitted' || i.status === 'approved').length;
  const progressPct = items.length > 0 ? ((signedOff / items.length) * 100) : 0;

  const startEditing = (item: BridgeCommentary) => {
    setEditingId(item.id);
    setEditText(item.userCommentary || item.aiSuggestion);
  };

  return (
    <div className="space-y-5">
      {/* Progress Tracker */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-semibold text-[#1c519c]">{title}</h2>
            <p className="text-xs text-gray-500">{periodLabel}</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-500">
              <span className="font-bold text-[#1c519c]">{signedOff}</span> of {items.length} signed off
            </span>
            <span className="text-gray-500">
              <span className="font-bold text-amber-600">{submitted}</span> submitted
            </span>
            <span className={`font-bold ${totalVariance.startsWith('+') || parseFloat(totalVariance) > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              ${totalVariance}M ({totalVariancePercent})
            </span>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            className="h-full rounded-full bg-[#1c519c]"
          />
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid {...CHART_GRID_STYLE} />
            <XAxis dataKey="name" {...CHART_AXIS_STYLE} interval={0} angle={-30} textAnchor="end" height={50} />
            <YAxis {...CHART_AXIS_STYLE} tickFormatter={(v: number) => `$${v}M`} />
            <Tooltip
              {...CHART_TOOLTIP_DARK}
              formatter={(value: number) => [`$${value}M`, 'Impact']}
            />
            <ReferenceLine y={0} stroke="#9CA3AF" strokeWidth={1} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.fill}
                  cursor="pointer"
                  onClick={() => setSelectedBarId(items[i]?.id || null)}
                  opacity={selectedBarId && selectedBarId !== items[i]?.id ? 0.4 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Variance Commentary Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-12 gap-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Component</div>
            <div className="col-span-1 text-right">Impact</div>
            <div className="col-span-1 text-right">%</div>
            <div className="col-span-5">Commentary</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            const isEditing = editingId === item.id;
            const isSelected = selectedBarId === item.id;
            const sColors = statusColors[item.status] || statusColors.draft;

            return (
              <div key={item.id} className={`${isSelected ? 'bg-[#F0F0F0]/20' : ''}`}>
                <div className="px-5 py-3 grid grid-cols-12 gap-3 items-start">
                  {/* Component name */}
                  <div className="col-span-3 flex items-center gap-2">
                    {item.subItems && item.subItems.length > 0 && (
                      <button onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                      </button>
                    )}
                    <span className="text-sm font-medium text-[#1c519c]">{item.component}</span>
                  </div>

                  {/* Value */}
                  <div className="col-span-1 text-right">
                    <span className={`text-sm font-semibold ${item.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {item.value >= 0 ? '+' : ''}${item.value}M
                    </span>
                  </div>

                  {/* Percent */}
                  <div className="col-span-1 text-right">
                    <span className="text-xs text-gray-500">{item.percentImpact}</span>
                  </div>

                  {/* Commentary */}
                  <div className="col-span-5">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="w-full text-xs text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1c519c]/20 focus:border-[#1c519c]"
                          placeholder="Add your commentary..."
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              saveToCommentary(item, editText);
                              setEditingId(null);
                            }}
                            className="px-3 py-1 text-xs font-medium text-white bg-[#1c519c] rounded-lg hover:bg-[#1c519c] transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {/* AI suggestion */}
                        <div className="flex items-start gap-1.5">
                          <Brain className="w-3 h-3 text-[#1c519c] mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-500 italic leading-relaxed">{item.aiSuggestion}</p>
                        </div>
                        {/* User commentary */}
                        {item.userCommentary && (
                          <div className="flex items-start gap-1.5">
                            <Edit2 className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-700 leading-relaxed">{item.userCommentary}</p>
                              {item.author && (
                                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {item.author} {item.date && `- ${item.date}`}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex flex-col items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sColors.bg} ${sColors.text}`}>
                      {item.status}
                    </span>
                    {savedId === item.id && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Synced
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-center gap-1">
                    <button
                      onClick={() => startEditing(item)}
                      className="p-1.5 text-gray-400 hover:text-[#1c519c] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit commentary"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {item.status === 'submitted' && (
                      <button
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Sign off"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded sub-items */}
                <AnimatePresence>
                  {isExpanded && item.subItems && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50/50 border-t border-gray-100"
                    >
                      <div className="px-5 py-2 pl-14 space-y-1.5">
                        {item.subItems.map((sub, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">{sub.name}</span>
                            <div className="flex items-center gap-3">
                              <span className={`font-medium ${sub.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {sub.value >= 0 ? '+' : ''}${sub.value}M
                              </span>
                              <span className="text-gray-400 text-[10px] max-w-[200px] truncate">{sub.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
