'use client';

import {
  ChevronDown, ChevronRight, Filter, Search, Sparkles, User, X,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import type { FilterState, FilterAction, SourceFilter } from './shared';
import {
  CATEGORIES, PRIORITIES, FISCAL_PERIODS, CONSOLES,
  INSIGHT_TYPES, COMMENTARY_TYPES, PRIORITY_DOT,
} from './shared';

interface InsightsSidebarProps {
  filters: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  counts: {
    byCategory: Record<string, number>;
    byConsole: Record<string, number>;
    byPriority: Record<string, number>;
    byPeriod: Record<string, number>;
    byInsightType: Record<string, number>;
    byCommentaryType: Record<string, number>;
  };
}

export default function InsightsSidebar({ filters, dispatch, counts }: InsightsSidebarProps) {
  const activeCount = [
    filters.categories.length, filters.consoles.length, filters.priorities.length,
    filters.fiscalPeriods.length, filters.insightTypes.length, filters.commentaryTypes.length,
    filters.source !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <aside className="w-[280px] shrink-0 border-r border-gray-200 bg-gray-50/50 overflow-y-auto h-full">
      <div className="p-3 space-y-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#003B2C]" />
            <span className="text-sm font-semibold text-[#003B2C]">Filters</span>
            {activeCount > 0 && (
              <span className="bg-[#003B2C] text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={() => dispatch({ type: 'CLEAR_ALL' })}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', value: e.target.value })}
            placeholder="Search insights..."
            className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#003B2C] focus:border-[#003B2C]"
          />
          {filters.search && (
            <button
              onClick={() => dispatch({ type: 'SET_SEARCH', value: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Source toggle */}
        <Section title="Source" defaultOpen>
          <div className="flex gap-1">
            {([['all', 'All'], ['ai', 'AI Insights'], ['human', 'Commentary']] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => dispatch({ type: 'SET_SOURCE', value: val as SourceFilter })}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                  filters.source === val
                    ? 'bg-[#003B2C] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {val === 'ai' && <Sparkles className="w-3 h-3" />}
                {val === 'human' && <User className="w-3 h-3" />}
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* Category */}
        <Section title="Category" defaultOpen>
          {CATEGORIES.map(cat => (
            <CheckItem
              key={cat}
              label={cat}
              checked={filters.categories.includes(cat)}
              count={counts.byCategory[cat] ?? 0}
              onToggle={() => dispatch({ type: 'TOGGLE_CATEGORY', value: cat })}
            />
          ))}
        </Section>

        {/* Console */}
        <Section title="Business Console" defaultOpen={false}>
          {CONSOLES.map(c => (
            <CheckItem
              key={c.id}
              label={c.name}
              checked={filters.consoles.includes(c.id)}
              count={counts.byConsole[c.id] ?? 0}
              onToggle={() => dispatch({ type: 'TOGGLE_CONSOLE', value: c.id })}
            />
          ))}
        </Section>

        {/* Priority */}
        <Section title="Priority" defaultOpen>
          {PRIORITIES.map(p => (
            <CheckItem
              key={p}
              label={p.charAt(0).toUpperCase() + p.slice(1)}
              checked={filters.priorities.includes(p)}
              count={counts.byPriority[p] ?? 0}
              onToggle={() => dispatch({ type: 'TOGGLE_PRIORITY', value: p })}
              dot={<span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[p]}`} />}
            />
          ))}
        </Section>

        {/* Fiscal Period */}
        <Section title="Fiscal Period" defaultOpen>
          <div className="flex flex-wrap gap-1">
            {FISCAL_PERIODS.map(p => (
              <button
                key={p}
                onClick={() => dispatch({ type: 'TOGGLE_PERIOD', value: p })}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  filters.fiscalPeriods.includes(p)
                    ? 'bg-[#003B2C] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </Section>

        {/* Insight Type (only when source != human) */}
        {filters.source !== 'human' && (
          <Section title="Insight Type" defaultOpen={false}>
            {INSIGHT_TYPES.map(t => (
              <CheckItem
                key={t.value}
                label={`${t.label} (${t.level})`}
                checked={filters.insightTypes.includes(t.value)}
                count={counts.byInsightType[t.value] ?? 0}
                onToggle={() => dispatch({ type: 'TOGGLE_INSIGHT_TYPE', value: t.value })}
              />
            ))}
          </Section>
        )}

        {/* Commentary Type (only when source != ai) */}
        {filters.source !== 'ai' && (
          <Section title="Commentary Type" defaultOpen={false}>
            {COMMENTARY_TYPES.map(t => (
              <CheckItem
                key={t.value}
                label={t.label}
                checked={filters.commentaryTypes.includes(t.value)}
                count={counts.byCommentaryType[t.value] ?? 0}
                onToggle={() => dispatch({ type: 'TOGGLE_COMMENTARY_TYPE', value: t.value })}
              />
            ))}
          </Section>
        )}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Collapsible section
// ---------------------------------------------------------------------------

function Section({ title, defaultOpen = true, children }: {
  title: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-200 pt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
      >
        {title}
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>
      {open && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checkbox item
// ---------------------------------------------------------------------------

function CheckItem({ label, checked, count, onToggle, dot }: {
  label: string; checked: boolean; count: number; onToggle: () => void; dot?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 py-1 px-1 rounded hover:bg-gray-100 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="w-3.5 h-3.5 rounded border-gray-300 text-[#003B2C] focus:ring-[#003B2C] accent-[#003B2C]"
      />
      {dot}
      <span className="text-xs text-gray-700 flex-1 truncate">{label}</span>
      {count > 0 && (
        <span className="text-[10px] text-gray-400 tabular-nums">{count.toLocaleString()}</span>
      )}
    </label>
  );
}
