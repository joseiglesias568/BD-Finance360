'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Copy,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  MessageSquare,
  Save,
  Search,
} from 'lucide-react';
import Link from 'next/link';

// --- Types ---
interface PLRow {
  label: string;
  isCategory?: boolean;
  isTotal?: boolean;
  children?: PLRow[];
  quarters: { actual: string; variance: string; varianceColor: 'green' | 'red' | 'neutral' }[];
}

interface DriverDataRow {
  driver: string;
  actual: string;
  plan: string;
  variance: string;
  varianceColor: 'green' | 'red' | 'neutral';
  trend: 'up' | 'down' | 'flat';
}

interface DataTabProps {
  quarterLabels: string[];
  plData: PLRow[];
  driverData: { category: string; rows: DriverDataRow[] }[];
  consoleSlug?: string;
}

const varianceColors = {
  green: 'text-emerald-600',
  red: 'text-red-500',
  neutral: 'text-gray-500',
};

export default function DataTab({ quarterLabels, plData, driverData, consoleSlug = '' }: DataTabProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const saveNoteToCommentary = async () => {
    if (!noteText.trim()) return;
    setNoteSaving(true);
    try {
      const res = await fetch('/api/commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Data Note: ${consoleSlug ? consoleSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'General'}`,
          content: noteText,
          category: 'Financial Performance',
          commentaryType: 'context',
          priority: 'low',
          relatedConsoles: consoleSlug ? [consoleSlug] : [],
          tags: ['data-note', 'analyst-note'],
        }),
      });
      if (res.ok) {
        setNoteSaved(true);
        setNoteText('');
        setTimeout(() => setNoteSaved(false), 2500);
      }
    } finally {
      setNoteSaving(false);
    }
  };
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(plData.filter((r) => r.isCategory).map((r) => r.label))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDriverCats, setExpandedDriverCats] = useState<Set<string>>(
    new Set(driverData.map((d) => d.category))
  );

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const toggleDriverCat = (cat: string) => {
    setExpandedDriverCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {/* Export Toolbar */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search data..."
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c519c]/20 focus:border-[#1c519c] w-48"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1c519c] text-white rounded-lg hover:bg-[#1c519c] transition-colors">
            <Download className="w-3.5 h-3.5" />
            Generate Report
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button
            onClick={() => { setSavedToast(true); setTimeout(() => setSavedToast(false), 2000); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {savedToast ? 'Saved!' : 'Save View'}
          </button>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${showNotes ? 'bg-[#1c519c] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Notes
          </button>
        </div>
      </div>

      {/* P&L Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-[#1c519c]">Financial Performance</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-2.5 w-48 sticky left-0 bg-gray-50/80 z-[1]">
                  Item
                </th>
                {quarterLabels.map((q) => (
                  <th key={q} colSpan={2} className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2.5 border-l border-gray-100">
                    {q}
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50/50">
                <th className="sticky left-0 bg-gray-50/50 z-[1]" />
                {quarterLabels.map((q) => (
                  <th key={q} className="contents">
                    <th className="text-right text-[10px] font-medium text-gray-400 px-3 py-1.5 border-l border-gray-100">Actual</th>
                    <th className="text-right text-[10px] font-medium text-gray-400 px-3 py-1.5">Var %</th>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {plData.map((row) => {
                const isExpanded = expandedCategories.has(row.label);

                return (
                  <PLRowComponent
                    key={row.label}
                    row={row}
                    isExpanded={isExpanded}
                    onToggle={() => toggleCategory(row.label)}
                    quarterCount={quarterLabels.length}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Metrics Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-[#1c519c]">Driver-Based Metrics</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-2.5">Driver</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-2.5">Actual</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-2.5">Plan</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-2.5">Variance</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-2.5">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {driverData.map((cat) => (
                <DriverCategoryRows
                  key={cat.category}
                  category={cat.category}
                  rows={cat.rows}
                  isExpanded={expandedDriverCats.has(cat.category)}
                  onToggle={() => toggleDriverCat(cat.category)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analyst Notes Panel */}
      {showNotes && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#1c519c] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#1c519c]" />
              Analyst Notes
            </h4>
            <span className="text-xs text-gray-400">Auto-saved</span>
          </div>
          <div className="space-y-3">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-yellow-800">Sarah Johnson — Mar 5, 2026</span>
                <span className="text-xs text-yellow-600">Q1 Close</span>
              </div>
              <p className="text-xs text-yellow-900">Revenue variance driven by 2.1% ticket increase from January pricing. Transaction count still showing -0.8% drag. Flag for CFO in MOR section 2.</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-blue-800">Mike Chen — Mar 3, 2026</span>
                <span className="text-xs text-blue-600">Data Validation</span>
              </div>
              <p className="text-xs text-blue-900">Verified comp sales against POS daily extracts. Small ~$2.1M discrepancy in Southwest — reconciliation ticket JIRA-4521 open.</p>
            </div>
            <textarea
              placeholder="Add a note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1c519c] focus:border-[#1c519c] resize-none"
              rows={2}
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-400">
                {noteSaved ? '✓ Saved to Commentary Engine' : 'Save to sync with Commentary Engine'}
              </span>
              <button
                onClick={saveNoteToCommentary}
                disabled={!noteText.trim() || noteSaving}
                className="px-3 py-1 text-xs font-medium text-white bg-[#1c519c] rounded-lg hover:bg-[#1c519c] disabled:opacity-40 transition-colors"
              >
                {noteSaving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drill to Detailed Reports */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-[#1c519c] flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#1c519c]" />
            Drill to Detailed Reports
          </h4>
          <Link href="/report-hub" className="text-xs text-[#1c519c] hover:underline">
            Browse Report Hub
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { id: 'fin-1', name: 'Monthly P&L Statement', desc: 'Full GL-level P&L with variance analysis' },
            { id: 'fin-2', name: 'Revenue by Segment', desc: 'NA, International, Channel Dev breakdown' },
            { id: 'fin-4', name: 'Property-Level P&L', desc: 'Individual property profitability detail' },
          ].map(report => (
            <Link
              key={report.id}
              href={`/report-hub/${report.id}`}
              className="group flex items-center gap-2.5 bg-gray-50 hover:bg-[#F0F0F0]/30 border border-gray-200 hover:border-[#1c519c]/30 rounded-lg p-3 transition-all"
            >
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-gray-900 group-hover:text-[#1c519c]">{report.name}</div>
                <div className="text-[10px] text-gray-500 truncate">{report.desc}</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1c519c] flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function PLRowComponent({
  row,
  isExpanded,
  onToggle,
  quarterCount,
}: {
  row: PLRow;
  isExpanded: boolean;
  onToggle: () => void;
  quarterCount: number;
}) {
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <tr
        className={`
          ${row.isTotal ? 'bg-[#1c519c]' : row.isCategory ? 'bg-gray-50/60' : 'hover:bg-gray-50/40'}
          ${hasChildren ? 'cursor-pointer' : ''}
        `}
        onClick={hasChildren ? onToggle : undefined}
      >
        <td className={`px-5 py-2.5 text-sm font-medium sticky left-0 z-[1] ${
          row.isTotal ? 'text-white bg-[#1c519c]' : row.isCategory ? 'text-[#1c519c] font-semibold bg-gray-50/60' : 'text-gray-700'
        }`}>
          <div className="flex items-center gap-2">
            {hasChildren && (
              isExpanded ? <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            {!hasChildren && !row.isCategory && <span className="w-3.5" />}
            {row.label}
          </div>
        </td>
        {row.quarters.map((q, qi) => (
          <>
            <td key={`${qi}-a`} className={`text-right px-3 py-2.5 text-xs font-medium border-l border-gray-100 ${
              row.isTotal ? 'text-white' : 'text-gray-800'
            }`}>
              {q.actual}
            </td>
            <td key={`${qi}-v`} className={`text-right px-3 py-2.5 text-xs font-semibold ${
              row.isTotal ? 'text-white/80' : varianceColors[q.varianceColor]
            }`}>
              {q.variance}
            </td>
          </>
        ))}
      </tr>

      {/* Children */}
      {hasChildren && isExpanded && row.children!.map((child) => (
        <tr key={child.label} className="hover:bg-gray-50/40">
          <td className="px-5 py-2 text-xs text-gray-600 pl-12 sticky left-0 bg-white z-[1]">{child.label}</td>
          {child.quarters.map((q, qi) => (
            <>
              <td key={`${qi}-a`} className="text-right px-3 py-2 text-xs text-gray-700 border-l border-gray-100">{q.actual}</td>
              <td key={`${qi}-v`} className={`text-right px-3 py-2 text-xs font-medium ${varianceColors[q.varianceColor]}`}>{q.variance}</td>
            </>
          ))}
        </tr>
      ))}
    </>
  );
}

function DriverCategoryRows({
  category,
  rows,
  isExpanded,
  onToggle,
}: {
  category: string;
  rows: DriverDataRow[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const TrendArrow = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <span className="text-emerald-600">&#9650;</span>;
    if (trend === 'down') return <span className="text-red-500">&#9660;</span>;
    return <span className="text-gray-400">&#8212;</span>;
  };

  return (
    <>
      <tr className="bg-gray-50/60 cursor-pointer" onClick={onToggle}>
        <td colSpan={5} className="px-5 py-2.5 text-xs font-semibold text-[#1c519c]">
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            {category}
          </div>
        </td>
      </tr>
      {isExpanded && rows.map((row) => (
        <tr key={row.driver} className="hover:bg-gray-50/40">
          <td className="px-5 py-2 text-xs text-gray-700 pl-10">{row.driver}</td>
          <td className="text-right px-5 py-2 text-xs font-medium text-gray-800">{row.actual}</td>
          <td className="text-right px-5 py-2 text-xs text-gray-500">{row.plan}</td>
          <td className={`text-right px-5 py-2 text-xs font-semibold ${varianceColors[row.varianceColor]}`}>{row.variance}</td>
          <td className="text-center px-5 py-2 text-xs"><TrendArrow trend={row.trend} /></td>
        </tr>
      ))}
    </>
  );
}
