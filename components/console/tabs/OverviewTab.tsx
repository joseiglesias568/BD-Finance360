'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  ExternalLink,
  FileText,
  Brain,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import HeroKPIStrip from '../shared/HeroKPIStrip';
import type { HeroKPI } from '../shared/HeroKPIStrip';
import AIPulse from '../shared/AIPulse';
import DriverMatrix from '../shared/DriverMatrix';
import StatusBadge from '../shared/StatusBadge';
import type { PulseInsight, DriverMatrixRow } from '../types';

interface NeedsAttentionItem {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  actionLabel?: string;
  actionTab?: string;
}

export interface PerformanceSummary {
  title: string;
  period: string;
  summary: string;
  keyTakeaways: string[];
  overallStatus: 'good' | 'warning' | 'critical';
}

interface OverviewTabProps {
  heroKPIs: HeroKPI[];
  insights: PulseInsight[];
  drivers: DriverMatrixRow[];
  attentionItems?: NeedsAttentionItem[];
  performanceSummary?: PerformanceSummary;
  onNavigateToDrivers?: (driverId: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}

const severityStyles: Record<string, { border: string; icon: string; bg: string }> = {
  critical: { border: 'border-l-red-500', icon: 'text-red-500', bg: 'bg-red-50/50' },
  warning: { border: 'border-l-amber-500', icon: 'text-amber-500', bg: 'bg-amber-50/50' },
  info: { border: 'border-l-blue-500', icon: 'text-blue-500', bg: 'bg-blue-50/50' },
};

export default function OverviewTab({
  heroKPIs,
  insights,
  drivers,
  attentionItems = [],
  performanceSummary,
  onNavigateToDrivers,
  onNavigateToTab,
}: OverviewTabProps) {
  const [commentaryMode, setCommentaryMode] = useState<'analytics' | 'user'>('analytics');

  return (
    <div className="space-y-6">
      {/* Performance Summary — AI Insights-powered narrative */}
      {performanceSummary && (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#003B2C]">{performanceSummary.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{performanceSummary.period}</p>
              </div>
              <div className="flex items-center gap-3">
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
                <StatusBadge status={performanceSummary.overallStatus} />
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{performanceSummary.summary}</p>
            </div>

            <div className="mt-6 p-4 bg-[#F0F0F0]/30 rounded-lg border border-[#003B2C]/10">
              <h3 className="text-sm font-semibold text-[#003B2C] mb-3 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                Key Takeaways
              </h3>
              <ul className="space-y-2">
                {performanceSummary.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#003B2C]">
                    <CheckCircle2 className="w-4 h-4 text-[#003B2C] mt-0.5 flex-shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Zone A: Hero KPI Strip */}
      <section>
        <HeroKPIStrip kpis={heroKPIs} onNavigateToDrivers={onNavigateToDrivers} />
      </section>

      {/* Zone B: AI Pulse + Needs Attention */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <AIPulse
            insights={insights}
            onInvestigate={(insight) => {
              if (insight.actionTab && onNavigateToTab) {
                onNavigateToTab(insight.actionTab);
              }
            }}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-[#003B2C]">Needs Attention</h3>
              {attentionItems.length > 0 && (
                <span className="ml-auto px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                  {attentionItems.length}
                </span>
              )}
            </div>

            {attentionItems.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-sm text-gray-400">
                No items requiring attention
              </div>
            ) : (
              <div className="space-y-2">
                {attentionItems.slice(0, 4).map((item, idx) => {
                  const style = severityStyles[item.severity] || severityStyles.info;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`border-l-3 ${style.border} ${style.bg} rounded-r-lg p-2.5 cursor-pointer hover:shadow-sm transition-shadow`}
                      onClick={() => item.actionTab && onNavigateToTab?.(item.actionTab)}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`w-3.5 h-3.5 ${style.icon} mt-0.5 flex-shrink-0`} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{item.title}</p>
                          <p className="text-[10px] text-gray-500 truncate">{item.detail}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Zone C: Driver Performance Matrix */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-[#003B2C]">Driver Performance</h2>
            <p className="text-xs text-gray-500 mt-0.5">Click any driver to explore in the Drivers tab</p>
          </div>
        </div>
        <DriverMatrix drivers={drivers} onSelectDriver={onNavigateToDrivers} />
      </section>

      {/* Zone D: Related Reports */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#003B2C]" />
            <h3 className="text-sm font-semibold text-[#003B2C]">Related Reports</h3>
          </div>
          <Link href="/report-hub" className="text-xs text-[#003B2C] hover:underline flex items-center gap-1">
            View All Reports <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { id: 'fin-2', name: 'Revenue by Segment', freq: 'Weekly', desc: 'Revenue breakdown by NA, Intl, Channel Dev' },
            { id: 'fin-3', name: 'Organic Revenue Growth Report', freq: 'Weekly', desc: 'Fee revenue growth by region, volume vs rate' },
            { id: 'rev-5', name: 'Daily Sales Flash', freq: 'Daily', desc: 'Morning revenue summary across all channels' },
            { id: 'fin-1', name: 'Monthly P&L Statement', freq: 'Monthly', desc: 'Full GL-level P&L with variance analysis' },
          ].map(report => (
            <Link
              key={report.id}
              href={`/report-hub/${report.id}`}
              className="group bg-gray-50 hover:bg-[#F0F0F0]/30 border border-gray-200 hover:border-[#003B2C]/30 rounded-lg p-3 transition-all"
            >
              <div className="flex items-start justify-between mb-1.5">
                <h4 className="text-xs font-semibold text-gray-900 group-hover:text-[#003B2C] line-clamp-2">{report.name}</h4>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#003B2C] flex-shrink-0 mt-0.5" />
              </div>
              <p className="text-[10px] text-gray-500 mb-1.5 line-clamp-2">{report.desc}</p>
              <span className="inline-block px-1.5 py-0.5 bg-emerald-100 text-[#003B2C] text-[10px] font-medium rounded-full">{report.freq}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
