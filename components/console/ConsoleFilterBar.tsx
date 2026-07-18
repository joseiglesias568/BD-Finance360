'use client';

import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterDef, ConsoleFilters } from './types';

interface ConsoleFilterBarProps {
  primaryFilters: FilterDef[];
  secondaryFilters: FilterDef[];
  filters: ConsoleFilters;
  onFilterChange: (key: string, value: string) => void;
}

export default function ConsoleFilterBar({
  primaryFilters,
  secondaryFilters,
  filters,
  onFilterChange,
}: ConsoleFilterBarProps) {
  const [showSecondary, setShowSecondary] = useState(false);

  // Detect non-default filter chips
  const activeChips = [...primaryFilters, ...secondaryFilters].filter(
    (f) => filters[f.id] && filters[f.id] !== f.defaultValue
  );

  const renderFilter = (f: FilterDef) => {
    const val = filters[f.id] || f.defaultValue;

    if (f.type === 'pills') {
      return (
        <div key={f.id} className="flex items-center bg-gray-100 rounded-lg p-0.5">
          {f.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange(f.id, opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                val === opt.value
                  ? 'bg-white text-[#003B2C] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      );
    }

    // Default: select dropdown
    return (
      <select
        key={f.id}
        value={val}
        onChange={(e) => onFilterChange(f.id, e.target.value)}
        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white
          focus:outline-none focus:ring-2 focus:ring-[#003B2C]/20 focus:border-[#003B2C] transition-all"
      >
        {f.options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Tier 1: Primary Filters */}
        <div className="flex items-center justify-between py-2.5 gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {primaryFilters.map(renderFilter)}
          </div>

          <div className="flex items-center gap-2">
            {secondaryFilters.length > 0 && (
              <button
                onClick={() => setShowSecondary(!showSecondary)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  showSecondary ? 'bg-[#F0F0F0] text-[#003B2C]' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>More Filters</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showSecondary ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="flex items-center gap-2 pb-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Active:</span>
            {activeChips.map((f) => {
              const opt = f.options.find((o) => o.value === filters[f.id]);
              return (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F0F0F0]/50 text-[#003B2C] rounded-full text-xs font-medium"
                >
                  {f.label}: {opt?.label || filters[f.id]}
                  <button
                    onClick={() => onFilterChange(f.id, f.defaultValue)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Tier 2: Secondary Filters */}
        <AnimatePresence>
          {showSecondary && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 pb-3 pt-1 border-t border-gray-100 flex-wrap">
                {secondaryFilters.map(renderFilter)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
