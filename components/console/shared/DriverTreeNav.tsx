'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import StatusBadge from './StatusBadge';

export interface DriverNode {
  id: string;
  name: string;
  value?: string;
  unit?: string;
  status: 'good' | 'warning' | 'critical';
  children?: DriverNode[];
}

interface DriverTreeNavProps {
  drivers: DriverNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
  expandedIds,
  onToggle,
}: {
  node: DriverNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <div>
      <button
        onClick={() => {
          onSelect(node.id);
          if (hasChildren) onToggle(node.id);
        }}
        className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all group
          ${isSelected
            ? 'bg-[#F0F0F0] border-l-3 border-[#1c519c]'
            : 'hover:bg-gray-50 border-l-3 border-transparent'
          }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {/* Expand/collapse icon */}
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            )
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm truncate ${isSelected ? 'font-semibold text-[#1c519c]' : 'font-medium text-gray-700 group-hover:text-[#1c519c]'}`}>
              {node.name}
            </span>
            <StatusBadge status={node.status} dotOnly />
          </div>
          {node.value && (
            <span className="text-xs text-gray-500">
              {node.value}{node.unit ? ` ${node.unit}` : ''}
            </span>
          )}
        </div>
      </button>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DriverTreeNav({ drivers, selectedId, onSelect }: DriverTreeNavProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Auto-expand first level
    return new Set(drivers.map((d) => d.id));
  });

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-0.5">
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver Tree</h3>
      </div>
      {drivers.map((driver) => (
        <TreeNode
          key={driver.id}
          node={driver}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
          expandedIds={expandedIds}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
