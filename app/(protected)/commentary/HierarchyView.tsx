'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Loader2,
  MessageSquare,
  Sparkles,
  Zap,
  Layers,
} from 'lucide-react';
import type { DBCommentary } from '@/lib/db/repositories/commentary';
import type { ConsoleTree, DriverTreeNode } from '@/lib/db/repositories/consoles';

interface HierarchyViewProps {
  consoleTrees: ConsoleTree[];
  allCommentary: DBCommentary[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Revenue & Market': 'border-l-emerald-500',
  'Property & Operations': 'border-l-blue-500',
  'Digital & Customer': 'border-l-violet-500',
  'People & Culture': 'border-l-amber-500',
  'Financial Stewardship': 'border-l-[#003B2C]',
  'Risk & Sustainability': 'border-l-red-400',
};

export default function HierarchyView({ consoleTrees, allCommentary }: HierarchyViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [aggregatingNode, setAggregatingNode] = useState<number | null>(null);
  const [localCommentary, setLocalCommentary] = useState<DBCommentary[]>(allCommentary);
  const [expandedConsoles, setExpandedConsoles] = useState<Set<number>>(new Set());

  // Index commentary by driverId for fast lookup
  const commentaryByDriver = useMemo(() => {
    const map = new Map<number, DBCommentary[]>();
    localCommentary.forEach(c => {
      if (c.driverId !== null) {
        if (!map.has(c.driverId)) map.set(c.driverId, []);
        map.get(c.driverId)!.push(c);
      }
    });
    return map;
  }, [localCommentary]);

  // Count total commentary under a driver (recursive)
  const countCommentary = useCallback((node: DriverTreeNode): number => {
    let count = commentaryByDriver.get(node.id)?.length ?? 0;
    node.children.forEach(child => { count += countCommentary(child); });
    return count;
  }, [commentaryByDriver]);

  const toggleNode = useCallback((key: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleConsole = useCallback((id: number) => {
    setExpandedConsoles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAggregate = useCallback(async (driverId: number) => {
    setAggregatingNode(driverId);
    try {
      const res = await fetch('/api/commentary/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId,
          aggregationLevel: 'driver',
          fiscalPeriod: 'Q2 FY26',
        }),
      });
      if (res.ok) {
        const { aggregation } = await res.json();
        setLocalCommentary(prev => [aggregation, ...prev]);
      }
    } finally {
      setAggregatingNode(null);
    }
  }, []);

  // Group consoles by category
  const grouped = useMemo(() => {
    const map = new Map<string, ConsoleTree[]>();
    consoleTrees.forEach(c => {
      if (!map.has(c.category)) map.set(c.category, []);
      map.get(c.category)!.push(c);
    });
    return map;
  }, [consoleTrees]);

  // Total driver-linked commentary
  const driverLinked = localCommentary.filter(c => c.driverId !== null).length;
  const aiAggregated = localCommentary.filter(c => c.isAiGenerated).length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-4 text-xs text-gray-500 px-1">
        <span className="flex items-center gap-1">
          <GitBranch className="w-3.5 h-3.5 text-[#003B2C]" />
          <strong className="text-[#003B2C]">{driverLinked}</strong> driver-linked entries
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <strong className="text-[#003B2C]">{aiAggregated}</strong> AI aggregations
        </span>
        <span className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-gray-400" />
          <strong className="text-[#003B2C]">{consoleTrees.length}</strong> consoles
        </span>
      </div>

      {/* Console tree */}
      {Array.from(grouped.entries()).map(([category, consoles]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
            {category}
          </h3>
          {consoles.map(console => {
            const isOpen = expandedConsoles.has(console.id);
            const totalCount = console.drivers.reduce((sum, d) => sum + countCommentary(d), 0);

            return (
              <div
                key={console.id}
                className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden border-l-4 ${CATEGORY_COLORS[category] ?? 'border-l-gray-300'}`}
              >
                {/* Console header */}
                <button
                  onClick={() => toggleConsole(console.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-gray-400" />
                      : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <span className="text-sm font-semibold text-[#003B2C]">{console.title}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {console.drivers.length} drivers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {totalCount > 0 && (
                      <span className="text-[10px] font-medium text-[#003B2C] bg-[#F0F0F0] px-2 py-0.5 rounded-full">
                        {totalCount} commentary
                      </span>
                    )}
                  </div>
                </button>

                {/* Expanded driver tree */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 space-y-0.5">
                        {console.drivers.map(driver => (
                          <DriverNode
                            key={driver.id}
                            node={driver}
                            depth={0}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                            commentaryByDriver={commentaryByDriver}
                            countCommentary={countCommentary}
                            onAggregate={handleAggregate}
                            aggregatingNode={aggregatingNode}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ))}

      {consoleTrees.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No business consoles found</p>
        </div>
      )}
    </div>
  );
}

// ─── Recursive Driver Node Component ────────────────────────────────────────

interface DriverNodeProps {
  node: DriverTreeNode;
  depth: number;
  expandedNodes: Set<string>;
  toggleNode: (key: string) => void;
  commentaryByDriver: Map<number, DBCommentary[]>;
  countCommentary: (node: DriverTreeNode) => number;
  onAggregate: (driverId: number) => void;
  aggregatingNode: number | null;
}

function DriverNode({
  node,
  depth,
  expandedNodes,
  toggleNode,
  commentaryByDriver,
  countCommentary,
  onAggregate,
  aggregatingNode,
}: DriverNodeProps) {
  const nodeKey = `driver-${node.id}`;
  const isExpanded = expandedNodes.has(nodeKey);
  const directCommentary = commentaryByDriver.get(node.id) ?? [];
  const totalCount = countCommentary(node);
  const hasChildren = node.children.length > 0;
  const isAggregating = aggregatingNode === node.id;

  return (
    <div className="relative">
      {/* Indent guide line */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 border-l border-gray-200"
          style={{ marginLeft: `${depth * 20 - 10}px` }}
        />
      )}

      {/* Driver row */}
      <div
        className="flex items-center gap-1.5 py-1.5 group"
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        {/* Expand toggle */}
        {hasChildren ? (
          <button
            onClick={() => toggleNode(nodeKey)}
            className="p-0.5 hover:bg-gray-100 rounded"
          >
            {isExpanded
              ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        ) : (
          <span className="w-4.5" />
        )}

        {/* Driver name */}
        <span className={`text-xs font-medium ${totalCount > 0 ? 'text-[#003B2C]' : 'text-gray-500'}`}>
          {node.name}
        </span>

        {/* Weight badge */}
        {node.causalityWeight && node.causalityWeight > 0 && (
          <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded" title="Causality weight">
            {(node.causalityWeight * 100).toFixed(0)}%
          </span>
        )}

        {/* Commentary count */}
        {directCommentary.length > 0 && (
          <button
            onClick={() => toggleNode(`commentary-${node.id}`)}
            className="flex items-center gap-0.5 text-[10px] text-[#003B2C] bg-[#F0F0F0] px-1.5 py-0.5 rounded-full hover:bg-[#003B2C]/20 transition-colors"
          >
            <MessageSquare className="w-2.5 h-2.5" />
            {directCommentary.length}
          </button>
        )}

        {/* AI aggregated indicator */}
        {directCommentary.some(c => c.isAiGenerated) && (
          <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" />
            AI
          </span>
        )}

        {/* Aggregate button (only for drivers with children that have commentary) */}
        {hasChildren && totalCount > 0 && (
          <button
            onClick={() => onAggregate(node.id)}
            disabled={isAggregating}
            className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] font-medium text-[#003B2C] bg-[#F0F0F0] px-2 py-0.5 rounded-full hover:bg-[#003B2C] hover:text-white transition-all disabled:opacity-50"
          >
            {isAggregating ? (
              <>
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Aggregating...
              </>
            ) : (
              <>
                <Zap className="w-2.5 h-2.5" />
                Aggregate ({totalCount})
              </>
            )}
          </button>
        )}
      </div>

      {/* Expanded commentary entries */}
      <AnimatePresence>
        {expandedNodes.has(`commentary-${node.id}`) && directCommentary.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="space-y-1.5 pb-2"
              style={{ paddingLeft: `${depth * 20 + 24}px` }}
            >
              {directCommentary.map(c => (
                <CommentaryCard key={c.id} commentary={c} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children.map(child => (
              <DriverNode
                key={child.id}
                node={child}
                depth={depth + 1}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                commentaryByDriver={commentaryByDriver}
                countCommentary={countCommentary}
                onAggregate={onAggregate}
                aggregatingNode={aggregatingNode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Commentary Card (compact) ──────────────────────────────────────────────

function CommentaryCard({ commentary: c }: { commentary: DBCommentary }) {
  const isAI = c.isAiGenerated;
  return (
    <div className={`p-2.5 rounded-lg border text-xs ${
      isAI
        ? 'bg-amber-50/50 border-amber-200'
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {isAI ? (
            <Brain className="w-3 h-3 text-amber-500 flex-shrink-0" />
          ) : (
            <MessageSquare className="w-3 h-3 text-gray-400 flex-shrink-0" />
          )}
          <span className="font-medium text-[#003B2C] truncate">{c.title}</span>
        </div>
        <span className={`flex-shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
          c.priority === 'critical' ? 'bg-red-100 text-red-700' :
          c.priority === 'high' ? 'bg-amber-100 text-amber-700' :
          'bg-gray-100 text-gray-600'
        }`}>
          {c.priority}
        </span>
      </div>
      <p className="text-gray-600 mt-1 line-clamp-2 leading-relaxed">
        {c.contentPlain.slice(0, 200)}
      </p>
      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
        <span>{c.authorName}</span>
        {c.fiscalPeriod && <span>· {c.fiscalPeriod}</span>}
        {isAI && c.sourceCommentaryIds.length > 0 && (
          <span className="text-amber-500">
            · Synthesized from {c.sourceCommentaryIds.length} entries
          </span>
        )}
      </div>
    </div>
  );
}
