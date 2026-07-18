'use client';

import { X } from 'lucide-react';
import type { FilterAction, FilterState } from './shared';
import { CONSOLES } from './shared';

interface ActiveFiltersProps {
  filters: FilterState;
  dispatch: React.Dispatch<FilterAction>;
}

export default function ActiveFilters({ filters, dispatch }: ActiveFiltersProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.source !== 'all') {
    chips.push({
      label: `Source: ${filters.source === 'ai' ? 'AI Insights' : 'Commentary'}`,
      onRemove: () => dispatch({ type: 'SET_SOURCE', value: 'all' }),
    });
  }

  for (const c of filters.categories) {
    chips.push({
      label: c,
      onRemove: () => dispatch({ type: 'TOGGLE_CATEGORY', value: c }),
    });
  }

  for (const c of filters.consoles) {
    const name = CONSOLES.find(con => con.id === c)?.name ?? c;
    chips.push({
      label: name,
      onRemove: () => dispatch({ type: 'TOGGLE_CONSOLE', value: c }),
    });
  }

  for (const p of filters.priorities) {
    chips.push({
      label: `Priority: ${p}`,
      onRemove: () => dispatch({ type: 'TOGGLE_PRIORITY', value: p }),
    });
  }

  for (const p of filters.fiscalPeriods) {
    chips.push({
      label: p,
      onRemove: () => dispatch({ type: 'TOGGLE_PERIOD', value: p }),
    });
  }

  for (const t of filters.insightTypes) {
    chips.push({
      label: `Insight: ${t}`,
      onRemove: () => dispatch({ type: 'TOGGLE_INSIGHT_TYPE', value: t }),
    });
  }

  for (const t of filters.commentaryTypes) {
    chips.push({
      label: `Type: ${t}`,
      onRemove: () => dispatch({ type: 'TOGGLE_COMMENTARY_TYPE', value: t }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
      <span className="text-xs text-gray-500 font-medium mr-1">Active:</span>
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700"
        >
          {chip.label}
          <button onClick={chip.onRemove} className="hover:text-red-500">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={() => dispatch({ type: 'CLEAR_ALL' })}
        className="text-xs text-red-600 hover:text-red-700 font-medium ml-2"
      >
        Clear all
      </button>
    </div>
  );
}
