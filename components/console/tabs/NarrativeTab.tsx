'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  MessageSquare,
  Lightbulb,
  Calendar,
  Swords,
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

// --- Sub-tab types ---
interface NarrativeBrief {
  title: string;
  period: string;
  summary: string;
  keyTakeaways: string[];
  overallStatus: 'good' | 'warning' | 'critical';
}

interface TimelineEvent {
  id: string;
  period: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

interface CompetitorAction {
  competitor: string;
  action: string;
  marketImpact: string;
  ourResponse: string;
}

interface CompetitiveData {
  strengths: string[];
  improvements: string[];
  competitors: CompetitorAction[];
}

interface StrategicTheme {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  initiatives: string[];
  kpis: { label: string; current: string; target: string; status: 'good' | 'warning' | 'critical' }[];
}

interface NarrativeTabProps {
  brief: NarrativeBrief;
  timeline: TimelineEvent[];
  competitive: CompetitiveData;
  strategic: StrategicTheme[];
}

const subTabs = [
  { id: 'brief', label: 'Executive Brief', icon: Lightbulb },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'competitive', label: 'Competitive', icon: Swords },
  { id: 'strategic', label: 'Strategic', icon: Target },
];

export default function NarrativeTab({ brief, timeline, competitive, strategic }: NarrativeTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('brief');
  const [commentaryMode, setCommentaryMode] = useState<'analytics' | 'user'>('analytics');

  return (
    <div className="space-y-4">
      {/* Sub-tab navigation + Commentary toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSubTab === tab.id
                    ? 'bg-white text-[#003B2C] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCommentaryMode('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              commentaryMode === 'analytics' ? 'bg-white text-[#003B2C] shadow-sm' : 'text-gray-500'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            AI Analytics
          </button>
          <button
            onClick={() => setCommentaryMode('user')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              commentaryMode === 'user' ? 'bg-white text-[#003B2C] shadow-sm' : 'text-gray-500'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            User Commentary
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div key={activeSubTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {activeSubTab === 'brief' && <BriefView brief={brief} />}
        {activeSubTab === 'timeline' && <TimelineView events={timeline} />}
        {activeSubTab === 'competitive' && <CompetitiveView data={competitive} />}
        {activeSubTab === 'strategic' && <StrategicView themes={strategic} />}
      </motion.div>
    </div>
  );
}

// --- Sub-views ---

function BriefView({ brief }: { brief: NarrativeBrief }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#003B2C]">{brief.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{brief.period}</p>
          </div>
          <StatusBadge status={brief.overallStatus} />
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{brief.summary}</p>
        </div>

        <div className="mt-6 p-4 bg-[#F0F0F0]/30 rounded-lg border border-[#003B2C]/10">
          <h3 className="text-sm font-semibold text-[#003B2C] mb-3 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {brief.keyTakeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#003B2C]">
                <CheckCircle2 className="w-4 h-4 text-[#003B2C] mt-0.5 flex-shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TimelineView({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-[#003B2C] mb-6">Key Developments</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {events.map((event, idx) => {
            const isPositive = event.impact === 'positive';
            const isNegative = event.impact === 'negative';
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="relative pl-12"
              >
                {/* Dot */}
                <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                  isPositive ? 'bg-emerald-500' : isNegative ? 'bg-red-500' : 'bg-gray-400'
                }`} />

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500">{event.period}</span>
                    {isPositive && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                    {isNegative && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                  </div>
                  <h3 className="text-sm font-semibold text-[#003B2C]">{event.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CompetitiveView({ data }: { data: CompetitiveData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Our Strengths
          </h3>
          <ul className="space-y-2">
            {data.strengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {data.improvements.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Competitor Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-[#003B2C] mb-4">Recent Competitor Activity</h3>
        <div className="space-y-3">
          {data.competitors.map((c, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-[#003B2C]">{c.competitor}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-600">{c.action}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Market Impact</p>
                  <p className="text-xs text-gray-700">{c.marketImpact}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Our Response</p>
                  <p className="text-xs text-gray-700">{c.ourResponse}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StrategicView({ themes }: { themes: StrategicTheme[] }) {
  return (
    <div className="space-y-4">
      {themes.map((theme, idx) => (
        <motion.div
          key={theme.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#003B2C]">{theme.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{theme.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={theme.status} />
              <span className="text-sm font-bold text-[#003B2C]">{theme.progress}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${theme.progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-[#003B2C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Initiatives */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Initiatives</p>
              <ul className="space-y-1.5">
                {theme.initiatives.map((init, i) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#003B2C] mt-0.5 flex-shrink-0" />
                    {init}
                  </li>
                ))}
              </ul>
            </div>

            {/* KPIs */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Performance Metrics</p>
              <div className="space-y-2">
                {theme.kpis.map((kpi, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{kpi.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#003B2C]">{kpi.current}</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-500">{kpi.target}</span>
                      <StatusBadge status={kpi.status} dotOnly />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
