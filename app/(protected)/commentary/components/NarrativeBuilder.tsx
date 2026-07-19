'use client';

import { ChevronDown, ChevronRight, Sparkles, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { UnifiedItem } from './shared';
import { PillBadge, PriorityDot, TrendIcon, PRIORITY_BADGE, CONSOLES } from './shared';

interface NarrativeBuilderProps {
  items: UnifiedItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

interface TopicGroup {
  key: string;
  consoleId: string;
  consoleName: string;
  category: string;
  items: UnifiedItem[];
  aiCount: number;
  humanCount: number;
  criticalCount: number;
  topPriority: string;
}

const PRIORITY_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export default function NarrativeBuilder({ items, selectedId, onSelect }: NarrativeBuilderProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  // Group by console
  const groups = useMemo(() => {
    const map = new Map<string, TopicGroup>();

    for (const item of items) {
      const key = item.consoleId || 'uncategorized';
      if (!map.has(key)) {
        const consoleDef = CONSOLES.find(c => c.id === key);
        map.set(key, {
          key,
          consoleId: key,
          consoleName: item.consoleName || consoleDef?.name || 'Other',
          category: item.category || consoleDef?.category || 'Other',
          items: [],
          aiCount: 0,
          humanCount: 0,
          criticalCount: 0,
          topPriority: 'low',
        });
      }
      const g = map.get(key)!;
      g.items.push(item);
      if (item.source === 'ai') g.aiCount++;
      else g.humanCount++;
      if (item.priority === 'critical') g.criticalCount++;
      if ((PRIORITY_RANK[item.priority] ?? 3) < (PRIORITY_RANK[g.topPriority] ?? 3)) {
        g.topPriority = item.priority;
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      // Sort by critical count desc, then total items desc
      if (a.criticalCount !== b.criticalCount) return b.criticalCount - a.criticalCount;
      return b.items.length - a.items.length;
    });
  }, [items]);

  const displayGroups = showAll ? groups : groups.slice(0, 20);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Group categories
  const byCategory = useMemo(() => {
    const catMap = new Map<string, TopicGroup[]>();
    for (const g of displayGroups) {
      const cat = g.category;
      if (!catMap.has(cat)) catMap.set(cat, []);
      catMap.get(cat)!.push(g);
    }
    return Array.from(catMap.entries());
  }, [displayGroups]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {byCategory.map(([category, consoleGroups]) => (
        <div key={category}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sticky top-0 bg-white py-1 z-10">
            {category}
          </h2>

          <div className="space-y-2">
            {consoleGroups.map(group => {
              const isExpanded = expandedGroups.has(group.key);

              return (
                <div key={group.key} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Group header */}
                  <button
                    onClick={() => toggleGroup(group.key)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50/80 hover:bg-gray-100/80 transition-colors text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <PriorityDot priority={group.topPriority} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#1c519c]">{group.consoleName}</h3>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1 text-xs text-purple-600">
                        <Sparkles className="w-3 h-3" />{group.aiCount}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#1c519c]">
                        <User className="w-3 h-3" />{group.humanCount}
                      </span>
                      {group.criticalCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">
                          {group.criticalCount} critical
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{group.items.length} total</span>
                    </div>
                  </button>

                  {/* Expanded items */}
                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      {/* Sub-group by driver */}
                      {(() => {
                        const driverMap = new Map<string, UnifiedItem[]>();
                        for (const item of group.items) {
                          const dKey = item.driverId || item.title;
                          if (!driverMap.has(dKey)) driverMap.set(dKey, []);
                          driverMap.get(dKey)!.push(item);
                        }
                        return Array.from(driverMap.entries()).map(([driverId, driverItems]) => {
                          const driverName = driverItems[0]?.driverPath?.[driverItems[0].driverPath.length - 1] || driverItems[0]?.title;
                          const hasAI = driverItems.some(i => i.source === 'ai');
                          const hasHuman = driverItems.some(i => i.source === 'human');

                          return (
                            <div key={driverId} className="border-b border-gray-100 last:border-b-0">
                              {/* Driver header */}
                              <div className="px-4 py-2 bg-white flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">{driverName}</span>
                                <span className="text-[10px] text-gray-400">({driverItems.length} items)</span>
                                {hasAI && hasHuman && (
                                  <span className="text-[10px] bg-[#F0F0F0] text-[#1c519c] px-1.5 py-0.5 rounded font-medium">
                                    Combined
                                  </span>
                                )}
                              </div>

                              {/* Items */}
                              <div className="divide-y divide-gray-50">
                                {driverItems
                                  .sort((a, b) => (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3))
                                  .slice(0, 10)
                                  .map(item => (
                                    <button
                                      key={item.id}
                                      onClick={() => onSelect(item.id)}
                                      className={`w-full text-left flex items-start gap-3 px-6 py-2.5 hover:bg-gray-50 transition-colors ${
                                        item.id === selectedId ? 'bg-[#F0F0F0]/30' : ''
                                      }`}
                                    >
                                      <PriorityDot priority={item.priority} />
                                      {item.source === 'ai' ? (
                                        <Sparkles className="w-3 h-3 text-purple-500 shrink-0 mt-0.5" />
                                      ) : (
                                        <User className="w-3 h-3 text-[#1c519c] shrink-0 mt-0.5" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-medium text-[#1c519c] truncate">{item.title}</span>
                                          {item.kpiValue && (
                                            <span className="flex items-center gap-0.5 shrink-0">
                                              <TrendIcon direction={item.trendDirection} className="w-3 h-3" />
                                              <span className="text-xs font-semibold text-[#1c519c]">{item.kpiValue}</span>
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.summary}</p>
                                      </div>
                                      <span className="text-[10px] text-gray-400 shrink-0">{item.fiscalPeriod}</span>
                                    </button>
                                  ))}
                                {driverItems.length > 10 && (
                                  <div className="px-6 py-2 text-xs text-gray-400">
                                    +{driverItems.length - 10} more items
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Show all button */}
      {!showAll && groups.length > 20 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 text-sm text-[#1c519c] font-medium hover:bg-[#F0F0F0]/30 rounded-lg border border-dashed border-[#1c519c]/30"
        >
          Show all {groups.length} console groups
        </button>
      )}
    </div>
  );
}
