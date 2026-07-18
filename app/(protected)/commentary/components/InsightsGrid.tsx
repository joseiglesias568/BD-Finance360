'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { Sparkles, User } from 'lucide-react';
import { useRef } from 'react';
import type { UnifiedItem } from './shared';
import { PriorityDot, TrendIcon, PillBadge, PRIORITY_BADGE, PRIORITY_COLORS } from './shared';

interface InsightsGridProps {
  items: UnifiedItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  columns?: number;
}

export default function InsightsGrid({ items, selectedId, onSelect, columns = 2 }: InsightsGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowCount = Math.ceil(items.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140,
    overscan: 10,
  });

  return (
    <div ref={parentRef} className="flex-1 overflow-auto p-3">
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(vRow => {
          const startIdx = vRow.index * columns;
          const rowItems = items.slice(startIdx, startIdx + columns);

          return (
            <div
              key={vRow.key}
              data-index={vRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 right-0 flex gap-3"
              style={{ transform: `translateY(${vRow.start}px)` }}
            >
              {rowItems.map(item => {
                const isSelected = item.id === selectedId;
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={`flex-1 border-l-4 rounded-lg border border-gray-200 p-3 cursor-pointer transition-all ${
                      PRIORITY_COLORS[item.priority] ?? PRIORITY_COLORS.medium
                    } ${
                      isSelected
                        ? 'ring-2 ring-[#003B2C] shadow-md'
                        : 'hover:shadow-sm hover:border-gray-300'
                    }`}
                  >
                    {/* Top row: source + priority */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {item.source === 'ai' ? (
                        <PillBadge className="bg-purple-100 text-purple-700">
                          <Sparkles className="w-2.5 h-2.5 mr-0.5" />AI
                        </PillBadge>
                      ) : (
                        <PillBadge className="bg-[#F0F0F0] text-[#003B2C]">
                          <User className="w-2.5 h-2.5 mr-0.5" />Human
                        </PillBadge>
                      )}
                      <PillBadge className={PRIORITY_BADGE[item.priority] ?? ''}>
                        {item.priority}
                      </PillBadge>
                      <span className="text-[10px] text-gray-400 ml-auto">{item.fiscalPeriod}</span>
                    </div>

                    {/* Title + value */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#003B2C] line-clamp-1">{item.title}</h3>
                      {item.kpiValue && (
                        <div className="flex items-center gap-1 shrink-0">
                          <TrendIcon direction={item.trendDirection} className="w-3 h-3" />
                          <span className="text-xs font-semibold text-[#003B2C]">{item.kpiValue}</span>
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.summary}</p>

                    {/* Footer */}
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                      {item.consoleName && <span className="truncate">{item.consoleName}</span>}
                      {item.source === 'ai' && item.insightLevel && (
                        <>
                          <span>·</span>
                          <span>{item.insightLevel}</span>
                        </>
                      )}
                      {item.source === 'human' && item.authorName && (
                        <>
                          <span>·</span>
                          <span>{item.authorName}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Fill empty cells in last row */}
              {rowItems.length < columns && Array.from({ length: columns - rowItems.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex-1" />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
