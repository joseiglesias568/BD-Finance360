'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, Clock, Calendar } from 'lucide-react';
import type { StrategicInitiative } from '@/config/types';
import { getStatusBadgeClasses, getStatusLabel } from '@/lib/engines/health-engine';
import { formatBudget } from '@/lib/engines/formatting-engine';

interface InitiativeRowProps {
  initiative: StrategicInitiative;
}

const progressColors: Record<string, string> = {
  'on-track': 'bg-emerald-500',
  'completed': 'bg-blue-500',
  'at-risk': 'bg-amber-500',
  'behind': 'bg-red-500',
};

const milestoneIcons: Record<string, { Icon: typeof CheckCircle; color: string }> = {
  completed: { Icon: CheckCircle, color: 'text-emerald-500' },
  'in-progress': { Icon: Clock, color: 'text-blue-500' },
  planned: { Icon: Calendar, color: 'text-gray-400' },
};

export default function InitiativeRow({ initiative }: InitiativeRowProps) {
  const [expanded, setExpanded] = useState(false);
  const budgetUsed = initiative.budget > 0 ? Math.round((initiative.spent / initiative.budget) * 100) : 0;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#1c519c]/30 transition-colors">
      {/* Compact row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
      >
        {/* Name */}
        <div className="w-52 min-w-[13rem] shrink-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{initiative.name}</p>
        </div>

        {/* Progress bar */}
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${initiative.progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${progressColors[initiative.status] || 'bg-gray-400'}`}
            />
          </div>
          <span className="text-xs font-semibold text-gray-600 w-10 text-right">{initiative.progress}%</span>
        </div>

        {/* Budget */}
        <div className="w-28 text-right shrink-0">
          <p className="text-xs text-gray-500">{formatBudget(initiative.spent)} / {formatBudget(initiative.budget)}</p>
        </div>

        {/* Status badge */}
        <div className="w-20 shrink-0 text-right">
          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeClasses(initiative.status)}`}>
            {getStatusLabel(initiative.status)}
          </span>
        </div>

        {/* Expand */}
        <div className="w-5 shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50/50">
              <p className="text-sm text-gray-600 mb-4">{initiative.description}</p>

              {/* Budget detail */}
              <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="font-semibold text-gray-900">{formatBudget(initiative.budget)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Spent</p>
                  <p className="font-semibold text-gray-900">{formatBudget(initiative.spent)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Progress</p>
                  <p className="font-semibold text-gray-900">{initiative.progress}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Budget Used</p>
                  <p className={`font-semibold ${budgetUsed > 80 ? 'text-red-600' : 'text-gray-900'}`}>{budgetUsed}%</p>
                </div>
              </div>

              {/* Milestones */}
              {initiative.milestones.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Milestones</p>
                  <div className="flex flex-wrap gap-2">
                    {initiative.milestones.map((m, i) => {
                      const mi = milestoneIcons[m.status] || milestoneIcons.planned;
                      const MIcon = mi.Icon;
                      return (
                        <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-md border border-gray-200 text-xs">
                          <MIcon className={`w-3 h-3 ${mi.color}`} />
                          <span className="text-gray-700">{m.name}</span>
                          <span className="text-gray-400">{m.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* KPIs */}
              {initiative.kpis.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Performance Indicators</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {initiative.kpis.map((kpi, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 bg-white rounded-md border border-gray-200 text-xs">
                        <span className="text-gray-700">{kpi.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{kpi.target}</span>
                          <span className="font-semibold text-gray-900">{kpi.actual}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${kpi.status === 'good' ? 'bg-emerald-400' : kpi.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
