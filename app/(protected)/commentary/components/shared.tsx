'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';

// ---------------------------------------------------------------------------
// Constants shared across commentary components
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  'Revenue & Market',
  'Financial Performance',
  'Digital & Customer',
  'Property & Operations',
  'Risk & Sustainability',
  'Strategic',
] as const;

export const PRIORITIES = ['critical', 'high', 'medium', 'low'] as const;

export const COMMENTARY_TYPES = [
  { value: 'analysis', label: 'Analysis' },
  { value: 'action-item', label: 'Action Item' },
  { value: 'risk-flag', label: 'Risk Flag' },
  { value: 'context', label: 'Context' },
  { value: 'recommendation', label: 'Recommendation' },
] as const;

export const INSIGHT_TYPES = [
  { value: 'fact', label: 'Fact', level: 'L1' },
  { value: 'trend', label: 'Trend', level: 'L1' },
  { value: 'variance', label: 'Variance', level: 'L2' },
  { value: 'anomaly', label: 'Anomaly', level: 'L2' },
  { value: 'forecast', label: 'Forecast', level: 'L3' },
  { value: 'what-if', label: 'What-If', level: 'L4' },
  { value: 'root-cause', label: 'Root Cause', level: 'L5' },
  { value: 'cross-reference', label: 'Cross-Ref', level: 'L2' },
] as const;

export const FISCAL_PERIODS = [
  'Q1 FY26', 'Q4 FY25', 'Q3 FY25', 'Q2 FY25', 'Q1 FY25', 'Q4 FY24',
] as const;

export const CONSOLES = [
  { id: 'north-america-performance', name: 'North America Performance', category: 'Revenue & Market' },
  { id: 'international-performance', name: 'International Performance', category: 'Revenue & Market' },
  { id: 'channel-development', name: 'Project Management', category: 'Revenue & Market' },
  { id: 'competitive-intelligence', name: 'Competitive Intelligence', category: 'Revenue & Market' },
  { id: 'store-operations', name: 'Building Operations', category: 'Property & Operations' },
  { id: 'store-development', name: 'Portfolio Development', category: 'Property & Operations' },
  { id: 'menu-product-strategy', name: 'Service & Product Strategy', category: 'Property & Operations' },
  { id: 'supply-chain', name: 'Supply Chain', category: 'Property & Operations' },
  { id: 'digital-loyalty', name: 'Digital & Platform', category: 'Digital & Client' },
  { id: 'brand-marketing', name: 'Brand & Marketing', category: 'Digital & Client' },
  { id: 'partner-experience', name: 'Employee Experience', category: 'Property & Operations' },
  { id: 'financial-performance', name: 'Financial Performance', category: 'Financial Performance' },
  { id: 'capital-allocation', name: 'Capital Allocation', category: 'Financial Performance' },
  { id: 'risk-compliance-sustainability', name: 'Risk & Sustainability', category: 'Risk & Sustainability' },
] as const;

export const PRIORITY_COLORS: Record<string, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-amber-500',
  medium: 'border-l-emerald-500',
  low: 'border-l-gray-300',
};

export const PRIORITY_BG: Record<string, string> = {
  critical: 'bg-red-50/50',
  high: 'bg-amber-50/40',
  medium: '',
  low: '',
};

export const PRIORITY_BADGE: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-amber-100 text-amber-700',
  medium: 'bg-emerald-100 text-emerald-700',
  low: 'bg-gray-100 text-gray-600',
};

export const PRIORITY_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-emerald-500',
  low: 'bg-gray-400',
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ViewMode = 'table' | 'grid' | 'narrative' | 'hierarchy';
export type SourceFilter = 'all' | 'ai' | 'human';

export interface FilterState {
  search: string;
  categories: string[];
  consoles: string[];
  priorities: string[];
  fiscalPeriods: string[];
  source: SourceFilter;
  insightTypes: string[];
  commentaryTypes: string[];
}

export const INITIAL_FILTERS: FilterState = {
  search: '',
  categories: [],
  consoles: [],
  priorities: [],
  fiscalPeriods: [],
  source: 'all',
  insightTypes: [],
  commentaryTypes: [],
};

export type FilterAction =
  | { type: 'SET_SEARCH'; value: string }
  | { type: 'TOGGLE_CATEGORY'; value: string }
  | { type: 'TOGGLE_CONSOLE'; value: string }
  | { type: 'TOGGLE_PRIORITY'; value: string }
  | { type: 'TOGGLE_PERIOD'; value: string }
  | { type: 'SET_SOURCE'; value: SourceFilter }
  | { type: 'TOGGLE_INSIGHT_TYPE'; value: string }
  | { type: 'TOGGLE_COMMENTARY_TYPE'; value: string }
  | { type: 'CLEAR_ALL' };

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.value };
    case 'TOGGLE_CATEGORY': {
      const s = new Set(state.categories);
      if (s.has(action.value)) s.delete(action.value);
      else s.add(action.value);
      return { ...state, categories: Array.from(s) };
    }
    case 'TOGGLE_CONSOLE': {
      const s = new Set(state.consoles);
      if (s.has(action.value)) s.delete(action.value);
      else s.add(action.value);
      return { ...state, consoles: Array.from(s) };
    }
    case 'TOGGLE_PRIORITY': {
      const s = new Set(state.priorities);
      if (s.has(action.value)) s.delete(action.value);
      else s.add(action.value);
      return { ...state, priorities: Array.from(s) };
    }
    case 'TOGGLE_PERIOD': {
      const s = new Set(state.fiscalPeriods);
      if (s.has(action.value)) s.delete(action.value);
      else s.add(action.value);
      return { ...state, fiscalPeriods: Array.from(s) };
    }
    case 'SET_SOURCE':
      return { ...state, source: action.value };
    case 'TOGGLE_INSIGHT_TYPE': {
      const s = new Set(state.insightTypes);
      if (s.has(action.value)) s.delete(action.value);
      else s.add(action.value);
      return { ...state, insightTypes: Array.from(s) };
    }
    case 'TOGGLE_COMMENTARY_TYPE': {
      const s = new Set(state.commentaryTypes);
      if (s.has(action.value)) s.delete(action.value);
      else s.add(action.value);
      return { ...state, commentaryTypes: Array.from(s) };
    }
    case 'CLEAR_ALL':
      return INITIAL_FILTERS;
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Unified item type for the feed
// ---------------------------------------------------------------------------

export interface UnifiedItem {
  id: string;           // "ai-123" or "human-456"
  source: 'ai' | 'human';
  title: string;
  summary: string;      // short text
  category: string;
  priority: string;
  trendDirection: string;
  kpiValue: string;
  confidenceScore: number;
  consoleId: string;
  consoleName: string;
  driverId: string;
  driverPath: string[];
  metricId: string;
  fiscalPeriod: string;
  insightType: string;  // for AI: fact/trend/variance etc, for human: commentaryType
  insightLevel: string; // L1-L5 for AI, empty for human
  authorName: string;
  authorRole: string;
  consoleLink: string;
  recommendations: string[];
  tags: string[];
  relatedKPIs: string[];
  content: string;      // full markdown content (for human commentary)
  createdAt: string;
  // Original data reference
  rawInsight?: import('@/lib/db/repositories/insights').DBInsight;
  rawCommentary?: import('@/lib/db/repositories/commentary').DBCommentary;
}

// ---------------------------------------------------------------------------
// Small reusable components
// ---------------------------------------------------------------------------

export function TrendIcon({ direction, className = 'w-3.5 h-3.5' }: { direction: string; className?: string }) {
  if (direction === 'up') return <TrendingUp className={`${className} text-emerald-600`} />;
  if (direction === 'down') return <TrendingDown className={`${className} text-red-500`} />;
  return <span className={`${className} text-gray-400 inline-block text-center`}>—</span>;
}

export function ConfidenceBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-[#1c519c]" style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-gray-500 tabular-nums w-8">{score}%</span>
    </div>
  );
}

export function PriorityDot({ priority }: { priority: string }) {
  return <span className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[priority] ?? PRIORITY_DOT.medium}`} />;
}

export function PillBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

// Simple markdown to HTML
export function renderMarkdown(md: string): string {
  const html = md
    .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-gray-900 mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="font-semibold text-gray-900 text-lg mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-700">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-gray-700 text-sm leading-relaxed mb-2">')
    .replace(/\n/g, '<br />');
  return `<p class="text-gray-700 text-sm leading-relaxed mb-2">${html}</p>`;
}
