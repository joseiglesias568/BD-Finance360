'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ArrowDown, ArrowUp, ArrowUpDown, Sparkles, User,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import type { UnifiedItem } from './shared';
import { PriorityDot, TrendIcon } from './shared';

interface InsightsTableProps {
  items: UnifiedItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

type SortField = 'priority' | 'title' | 'console' | 'value' | 'period' | 'confidence' | 'type';
type SortDir = 'asc' | 'desc';

const PRIORITY_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export default function InsightsTable({ items, selectedId, onSelect }: InsightsTableProps) {
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const parentRef = useRef<HTMLDivElement>(null);

  const sorted = [...items].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'priority':
        cmp = (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3);
        break;
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'console':
        cmp = (a.consoleName || '').localeCompare(b.consoleName || '');
        break;
      case 'value':
        cmp = a.kpiValue.localeCompare(b.kpiValue);
        break;
      case 'period':
        cmp = a.fiscalPeriod.localeCompare(b.fiscalPeriod);
        break;
      case 'confidence':
        cmp = a.confidenceScore - b.confidenceScore;
        break;
      case 'type':
        cmp = a.insightType.localeCompare(b.insightType);
        break;
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 20,
  });

  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }, [sortField]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-gray-300" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-[#1c519c]" />
      : <ArrowDown className="w-3 h-3 text-[#1c519c]" />;
  };

  // Normalize confidence: if <=1 treat as 0-1 scale, otherwise 0-100
  const normalizeConf = (score: number) => score <= 1 ? Math.round(score * 100) : Math.round(score);

  return (
    <div className="flex flex-col h-full overflow-x-auto">
      {/* Table header */}
      <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50/80 sticky top-0 z-10 select-none" style={{ minWidth: 760 }}>
        <div className="w-7 shrink-0" />
        <ColHeader width="w-10 shrink-0" label="" field="type" sortField={sortField} onClick={toggleSort}>
          <SortIcon field="type" />
        </ColHeader>
        <ColHeader width="flex-1 min-w-[200px]" label="Title" field="title" sortField={sortField} onClick={toggleSort}>
          <SortIcon field="title" />
        </ColHeader>
        <ColHeader width="w-[120px] shrink-0" label="Console" field="console" sortField={sortField} onClick={toggleSort}>
          <SortIcon field="console" />
        </ColHeader>
        <ColHeader width="w-16 shrink-0" label="Value" field="value" sortField={sortField} onClick={toggleSort}>
          <SortIcon field="value" />
        </ColHeader>
        <div className="w-6 shrink-0" />
        <ColHeader width="w-14 shrink-0" label="Period" field="period" sortField={sortField} onClick={toggleSort}>
          <SortIcon field="period" />
        </ColHeader>
        <ColHeader width="w-16 shrink-0" label="Conf." field="confidence" sortField={sortField} onClick={toggleSort}>
          <SortIcon field="confidence" />
        </ColHeader>
        <ColHeader width="w-14 shrink-0" label="Priority" field="priority" sortField={sortField} onClick={toggleSort}>
          <SortIcon field="priority" />
        </ColHeader>
      </div>

      {/* Virtual rows */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative', minWidth: 760 }}>
          {virtualizer.getVirtualItems().map(vRow => {
            const item = sorted[vRow.index];
            const isSelected = item.id === selectedId;
            const conf = normalizeConf(item.confidenceScore);
            return (
              <div
                key={vRow.key}
                data-index={vRow.index}
                ref={virtualizer.measureElement}
                onClick={() => onSelect(item.id)}
                className={`absolute left-0 right-0 flex items-center text-xs border-b border-gray-100 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#F0F0F0]/60 border-l-2 border-l-[#1c519c]'
                    : 'hover:bg-gray-50 border-l-2 border-l-transparent'
                }`}
                style={{
                  height: '44px',
                  transform: `translateY(${vRow.start}px)`,
                }}
              >
                {/* Priority dot */}
                <div className="w-7 shrink-0 flex justify-center">
                  <PriorityDot priority={item.priority} />
                </div>

                {/* Source icon */}
                <div className="w-10 shrink-0 flex items-center gap-0.5">
                  {item.source === 'ai' ? (
                    <span className="flex items-center gap-0.5 text-purple-600">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-[10px] font-medium uppercase">{item.insightLevel || 'AI'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[#1c519c]">
                      <User className="w-3 h-3" />
                      <span className="text-[10px] font-medium uppercase truncate">
                        {item.insightType.slice(0, 4)}
                      </span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-[200px] pr-2 overflow-hidden">
                  <p className="truncate text-[#1c519c] font-medium">{item.title}</p>
                </div>

                {/* Console */}
                <div className="w-[120px] shrink-0 truncate text-gray-500 pr-2">
                  {item.consoleName}
                </div>

                {/* KPI value */}
                <div className="w-16 shrink-0 font-semibold text-[#1c519c] tabular-nums">
                  {item.kpiValue}
                </div>

                {/* Trend */}
                <div className="w-6 shrink-0 flex justify-center">
                  <TrendIcon direction={item.trendDirection} className="w-3.5 h-3.5" />
                </div>

                {/* Period */}
                <div className="w-14 shrink-0 text-gray-500 text-[10px] leading-tight">
                  {item.fiscalPeriod}
                </div>

                {/* Confidence */}
                <div className="w-16 shrink-0">
                  {item.source === 'ai' && item.confidenceScore > 0 ? (
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#1c519c]"
                          style={{ width: `${conf}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 tabular-nums">{conf}%</span>
                    </div>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </div>

                {/* Priority label */}
                <div className="w-14 shrink-0">
                  <span className={`text-[10px] font-medium uppercase ${
                    item.priority === 'critical' ? 'text-red-600'
                    : item.priority === 'high' ? 'text-amber-600'
                    : item.priority === 'medium' ? 'text-emerald-600'
                    : 'text-gray-400'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Column header helper
// ---------------------------------------------------------------------------

function ColHeader({ width, label, field, sortField, onClick, children }: {
  width: string;
  label?: string;
  field?: SortField;
  sortField?: SortField;
  onClick?: (f: SortField) => void;
  children?: React.ReactNode;
}) {
  const interactive = field && onClick;
  return (
    <div
      className={`${width} px-1 py-2 flex items-center gap-1 ${interactive ? 'cursor-pointer hover:text-gray-700' : ''}`}
      onClick={interactive ? () => onClick(field) : undefined}
    >
      {label && <span>{label}</span>}
      {children}
    </div>
  );
}
