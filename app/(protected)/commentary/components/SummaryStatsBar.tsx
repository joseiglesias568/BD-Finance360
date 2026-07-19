'use client';

import {
  AlertTriangle, Bot, LayoutGrid, List, MessageSquare, Network, Sparkles, User,
} from 'lucide-react';
import type { ViewMode, UnifiedItem } from './shared';

interface SummaryStatsBarProps {
  items: UnifiedItem[];
  totalAI: number;
  totalHuman: number;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}

export default function SummaryStatsBar({ items, totalAI, totalHuman, view, onViewChange }: SummaryStatsBarProps) {
  const criticalCount = items.filter(i => i.priority === 'critical').length;
  const highCount = items.filter(i => i.priority === 'high').length;
  const consoleCount = new Set(items.map(i => i.consoleId).filter(Boolean)).size;
  const filtered = items.length !== (totalAI + totalHuman);

  const views: { key: ViewMode; icon: typeof List; label: string }[] = [
    { key: 'table', icon: List, label: 'Table' },
    { key: 'grid', icon: LayoutGrid, label: 'Grid' },
    { key: 'narrative', icon: MessageSquare, label: 'Narrative' },
    { key: 'hierarchy', icon: Network, label: 'Hierarchy' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      {/* Stats row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <Stat icon={Sparkles} label="AI Insights" value={totalAI} color="text-purple-600" bg="bg-purple-50" />
          <Stat icon={User} label="Human Commentary" value={totalHuman} color="text-[#1c519c]" bg="bg-[#F0F0F0]" />
          <div className="w-px h-8 bg-gray-200" />
          <Stat icon={AlertTriangle} label="Critical" value={criticalCount} color="text-red-600" bg="bg-red-50" />
          <Stat icon={Bot} label="High Priority" value={highCount} color="text-amber-600" bg="bg-amber-50" />
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-xs text-gray-500">
            <span className="font-semibold text-[#1c519c] text-sm">{consoleCount}</span> Consoles
          </div>
          {filtered && (
            <>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-xs font-medium text-[#1c519c] bg-[#F0F0F0] px-2 py-1 rounded">
                Showing {items.length.toLocaleString()} of {(totalAI + totalHuman).toLocaleString()}
              </div>
            </>
          )}
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {views.map(v => (
            <button
              key={v.key}
              onClick={() => onViewChange(v.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                view === v.key
                  ? 'bg-white text-[#1c519c] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <v.icon className="w-3.5 h-3.5" />
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color, bg }: {
  icon: typeof Sparkles; label: string; value: number; color: string; bg: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded ${bg}`}>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div className="leading-tight">
        <span className="font-semibold text-sm text-[#1c519c]">{value.toLocaleString()}</span>
        <span className="text-xs text-gray-500 ml-1">{label}</span>
      </div>
    </div>
  );
}
