'use client';

import type { DBCommentary } from '@/lib/db/repositories/commentary';
import type { DBInsight } from '@/lib/db/repositories/insights';
import type { ConsoleTree } from '@/lib/db/repositories/consoles';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Search } from 'lucide-react';

import HierarchyView from './HierarchyView';
import SummaryStatsBar from './components/SummaryStatsBar';
import InsightsSidebar from './components/InsightsSidebar';
import InsightsTable from './components/InsightsTable';
import InsightsGrid from './components/InsightsGrid';
import InsightDetailPanel from './components/InsightDetailPanel';
import NarrativeBuilder from './components/NarrativeBuilder';
import ActiveFilters from './components/ActiveFilters';
import type { UnifiedItem, ViewMode, FilterState } from './components/shared';
import { filterReducer, INITIAL_FILTERS, CONSOLES } from './components/shared';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CommentaryClientProps {
  commentary: DBCommentary[];
  insights: DBInsight[];
  consoleTrees: ConsoleTree[];
}

// ---------------------------------------------------------------------------
// Transform DB records to unified items
// ---------------------------------------------------------------------------

function insightToUnified(i: DBInsight): UnifiedItem {
  const rd = (i.relatedDrivers ?? {}) as Record<string, unknown>;
  return {
    id: `ai-${i.id}`,
    source: 'ai',
    title: i.title,
    summary: i.summary,
    category: i.category,
    priority: i.priority,
    trendDirection: i.trendDirection,
    kpiValue: i.kpiValue,
    confidenceScore: i.confidenceScore,
    consoleId: (rd.consoleId as string) ?? '',
    consoleName: (rd.consoleName as string) ?? '',
    driverId: (rd.driverId as string) ?? '',
    driverPath: (rd.driverPath as string[]) ?? [],
    metricId: (rd.metricId as string) ?? '',
    fiscalPeriod: (rd.fiscalPeriod as string) ?? '',
    insightType: (rd.insightType as string) ?? '',
    insightLevel: (rd as Record<string, string>).insightLevel ?? '',
    authorName: '',
    authorRole: '',
    consoleLink: i.consoleLink,
    recommendations: i.recommendations ?? [],
    tags: [],
    relatedKPIs: [],
    content: '',
    createdAt: '',
    rawInsight: i,
  };
}

function commentaryToUnified(c: DBCommentary): UnifiedItem {
  const consoleName = CONSOLES.find(con =>
    (c.relatedConsoles as string[])?.includes(con.id)
  )?.name ?? '';
  const consoleId = (c.relatedConsoles as string[])?.[0] ?? '';

  return {
    id: `human-${c.id}`,
    source: 'human',
    title: c.title,
    summary: c.contentPlain?.slice(0, 200) ?? '',
    category: c.category,
    priority: c.priority,
    trendDirection: '',
    kpiValue: '',
    confidenceScore: 0,
    consoleId,
    consoleName,
    driverId: '',
    driverPath: [],
    metricId: '',
    fiscalPeriod: c.fiscalPeriod,
    insightType: c.commentaryType,
    insightLevel: '',
    authorName: c.authorName,
    authorRole: c.authorRole,
    consoleLink: consoleId ? `/business-consoles/${consoleId}` : '',
    recommendations: [],
    tags: c.tags as string[],
    relatedKPIs: c.relatedKPIs as string[],
    content: c.content,
    createdAt: c.createdAt,
    rawCommentary: c,
  };
}

// ---------------------------------------------------------------------------
// Filtering logic
// ---------------------------------------------------------------------------

function matchesFilters(item: UnifiedItem, filters: FilterState): boolean {
  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const searchable = `${item.title} ${item.summary} ${item.category} ${item.consoleName} ${item.tags.join(' ')} ${item.relatedKPIs.join(' ')} ${item.authorName}`.toLowerCase();
    if (!searchable.includes(q)) return false;
  }

  // Source
  if (filters.source === 'ai' && item.source !== 'ai') return false;
  if (filters.source === 'human' && item.source !== 'human') return false;

  // Category
  if (filters.categories.length > 0 && !filters.categories.includes(item.category)) return false;

  // Console
  if (filters.consoles.length > 0 && !filters.consoles.includes(item.consoleId)) return false;

  // Priority
  if (filters.priorities.length > 0 && !filters.priorities.includes(item.priority)) return false;

  // Fiscal period
  if (filters.fiscalPeriods.length > 0 && !filters.fiscalPeriods.includes(item.fiscalPeriod)) return false;

  // Insight type (AI only)
  if (filters.insightTypes.length > 0 && item.source === 'ai' && !filters.insightTypes.includes(item.insightType)) return false;

  // Commentary type (human only)
  if (filters.commentaryTypes.length > 0 && item.source === 'human' && !filters.commentaryTypes.includes(item.insightType)) return false;

  return true;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function CommentaryClient({ commentary, insights, consoleTrees }: CommentaryClientProps) {
  const [filters, dispatch] = useReducer(filterReducer, INITIAL_FILTERS);
  const [view, setView] = useState<ViewMode>('table');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Build unified items
  const allItems = useMemo<UnifiedItem[]>(() => {
    const aiItems = insights.map(insightToUnified);
    const humanItems = commentary.map(commentaryToUnified);
    return [...aiItems, ...humanItems];
  }, [insights, commentary]);

  // Filter
  const filteredItems = useMemo(
    () => allItems.filter(item => matchesFilters(item, filters)),
    [allItems, filters]
  );

  // Count totals
  const totalAI = insights.length;
  const totalHuman = commentary.length;

  // Compute filter counts (from ALL items, not filtered)
  const counts = useMemo(() => {
    const byCategory: Record<string, number> = {};
    const byConsole: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byPeriod: Record<string, number> = {};
    const byInsightType: Record<string, number> = {};
    const byCommentaryType: Record<string, number> = {};

    for (const item of allItems) {
      byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
      if (item.consoleId) byConsole[item.consoleId] = (byConsole[item.consoleId] ?? 0) + 1;
      byPriority[item.priority] = (byPriority[item.priority] ?? 0) + 1;
      if (item.fiscalPeriod) byPeriod[item.fiscalPeriod] = (byPeriod[item.fiscalPeriod] ?? 0) + 1;
      if (item.source === 'ai' && item.insightType) {
        byInsightType[item.insightType] = (byInsightType[item.insightType] ?? 0) + 1;
      }
      if (item.source === 'human' && item.insightType) {
        byCommentaryType[item.insightType] = (byCommentaryType[item.insightType] ?? 0) + 1;
      }
    }

    return { byCategory, byConsole, byPriority, byPeriod, byInsightType, byCommentaryType };
  }, [allItems]);

  // Selected item
  const selectedItem = useMemo(
    () => filteredItems.find(i => i.id === selectedId) ?? null,
    [filteredItems, selectedId]
  );

  // Related items (same console + driver, opposite source)
  const relatedItems = useMemo(() => {
    if (!selectedItem) return [];
    return allItems.filter(i =>
      i.id !== selectedItem.id &&
      i.source !== selectedItem.source &&
      (
        (i.consoleId && i.consoleId === selectedItem.consoleId) ||
        (i.driverId && i.driverId === selectedItem.driverId)
      )
    ).slice(0, 10);
  }, [selectedItem, allItems]);

  // Close detail panel on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(prev => prev === id ? null : id);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Page header */}
      <div className="px-4 pt-4 pb-2 bg-white border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#1c519c]">AI Insights & Human Commentary</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Intelligence layer combining AI-generated insights with analyst commentary across {totalAI.toLocaleString()} insights and {totalHuman.toLocaleString()} commentary entries
        </p>
      </div>

      {/* Summary stats + view switcher */}
      <SummaryStatsBar
        items={filteredItems}
        totalAI={totalAI}
        totalHuman={totalHuman}
        view={view}
        onViewChange={setView}
      />

      {/* Active filters chip bar */}
      <ActiveFilters filters={filters} dispatch={dispatch} />

      {/* Main three-panel layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar */}
        <InsightsSidebar filters={filters} dispatch={dispatch} counts={counts} />

        {/* Main content area */}
        <main className="flex-1 flex flex-col min-w-0">
          {filteredItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No insights or commentary match your filters</p>
                <button
                  onClick={() => dispatch({ type: 'CLEAR_ALL' })}
                  className="mt-2 text-sm text-[#1c519c] hover:text-[#1c519c] font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : view === 'table' ? (
            <InsightsTable items={filteredItems} selectedId={selectedId} onSelect={handleSelect} />
          ) : view === 'grid' ? (
            <InsightsGrid items={filteredItems} selectedId={selectedId} onSelect={handleSelect} />
          ) : view === 'narrative' ? (
            <NarrativeBuilder items={filteredItems} selectedId={selectedId} onSelect={handleSelect} />
          ) : view === 'hierarchy' ? (
            <div className="flex-1 overflow-y-auto p-4">
              <HierarchyView consoleTrees={consoleTrees} allCommentary={commentary} />
            </div>
          ) : null}
        </main>

        {/* Right detail panel */}
        <InsightDetailPanel
          item={selectedItem}
          relatedItems={relatedItems}
          onClose={() => setSelectedId(null)}
          onSelectRelated={handleSelect}
        />
      </div>
    </div>
  );
}
