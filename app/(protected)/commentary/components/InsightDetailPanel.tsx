'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle, ArrowRight, CheckCircle, ChevronRight, ExternalLink, FileText,
  Lightbulb, Sparkles, Target, User, X,
} from 'lucide-react';
import type { UnifiedItem } from './shared';
import {
  ConfidenceBar, PillBadge, TrendIcon, PRIORITY_BADGE,
  renderMarkdown,
} from './shared';

interface InsightDetailPanelProps {
  item: UnifiedItem | null;
  relatedItems: UnifiedItem[];
  onClose: () => void;
  onSelectRelated: (id: string) => void;
}

const TYPE_ICONS: Record<string, typeof FileText> = {
  analysis: FileText,
  'action-item': Target,
  'risk-flag': AlertTriangle,
  context: Lightbulb,
  recommendation: CheckCircle,
};

export default function InsightDetailPanel({ item, relatedItems, onClose, onSelectRelated }: InsightDetailPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {item && (
        <motion.aside
          key={item.id}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 400, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 border-l border-gray-200 bg-white overflow-hidden h-full"
        >
          <div className="w-[400px] h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                {item.source === 'ai' ? (
                  <PillBadge className="bg-purple-100 text-purple-700">
                    <Sparkles className="w-3 h-3 mr-1" />AI Insight
                  </PillBadge>
                ) : (
                  <PillBadge className="bg-[#F0F0F0] text-[#003B2C]">
                    <User className="w-3 h-3 mr-1" />Commentary
                  </PillBadge>
                )}
                <PillBadge className={PRIORITY_BADGE[item.priority] ?? ''}>
                  {item.priority}
                </PillBadge>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Title + value */}
              <div>
                <h2 className="text-lg font-semibold text-[#003B2C]">{item.title}</h2>
                {item.kpiValue && (
                  <div className="flex items-center gap-2 mt-1">
                    <TrendIcon direction={item.trendDirection} className="w-4 h-4" />
                    <span className="text-xl font-bold text-[#003B2C]">{item.kpiValue}</span>
                  </div>
                )}
              </div>

              {/* Driver path breadcrumb */}
              {item.driverPath && item.driverPath.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap text-xs text-gray-500">
                  {item.driverPath.map((p, i) => (
                    <span key={i} className="flex items-center gap-1">
                      {i > 0 && <ChevronRight className="w-3 h-3" />}
                      <span className={i === item.driverPath.length - 1 ? 'text-[#003B2C] font-medium' : ''}>
                        {p}
                      </span>
                    </span>
                  ))}
                </div>
              )}

              {/* Metadata chips */}
              <div className="flex flex-wrap gap-1.5">
                {item.category && (
                  <PillBadge className="bg-gray-100 text-gray-600">{item.category}</PillBadge>
                )}
                {item.consoleName && (
                  <PillBadge className="bg-blue-50 text-blue-600">{item.consoleName}</PillBadge>
                )}
                {item.fiscalPeriod && (
                  <PillBadge className="bg-gray-100 text-gray-600">{item.fiscalPeriod}</PillBadge>
                )}
                {item.insightLevel && item.source === 'ai' && (
                  <PillBadge className="bg-purple-50 text-purple-600">
                    {item.insightLevel} — {item.insightType}
                  </PillBadge>
                )}
                {item.source === 'human' && (
                  <PillBadge className="bg-emerald-50 text-emerald-600">{item.insightType}</PillBadge>
                )}
              </div>

              {/* AI confidence */}
              {item.source === 'ai' && item.confidenceScore > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Confidence Score</p>
                  <ConfidenceBar score={item.confidenceScore} />
                </div>
              )}

              {/* Author (for human) */}
              {item.source === 'human' && item.authorName && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-[#003B2C] text-white flex items-center justify-center text-xs font-semibold">
                    {item.authorName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#003B2C]">{item.authorName}</p>
                    <p className="text-xs text-gray-500">{item.authorRole}</p>
                  </div>
                </div>
              )}

              {/* Summary / Content */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {item.source === 'ai' ? 'Analysis' : 'Commentary'}
                </p>
                {item.source === 'human' && item.content ? (
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content) }}
                  />
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">{item.summary}</p>
                )}
              </div>

              {/* Impacted metrics (from relatedDrivers) */}
              {!!(item.rawInsight?.relatedDrivers && (item.rawInsight.relatedDrivers as Record<string, unknown>).impactedMetrics) && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Impacted Metrics</p>
                  <div className="space-y-1">
                    {((item.rawInsight.relatedDrivers as Record<string, unknown>).impactedMetrics as Array<{metric: string; value: string; trend: string}>).map((m, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1.5">
                        <span className="text-gray-700">{m.metric}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-[#003B2C]">{m.value}</span>
                          <TrendIcon direction={m.trend === 'positive' ? 'up' : m.trend === 'negative' ? 'down' : 'flat'} className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historical context */}
              {!!(item.rawInsight?.relatedDrivers && (item.rawInsight.relatedDrivers as Record<string, unknown>).historicalContext) && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Historical Context</p>
                  <p className="text-sm text-gray-600">
                    {(item.rawInsight.relatedDrivers as Record<string, unknown>).historicalContext as string}
                  </p>
                </div>
              )}

              {/* Predictive insight */}
              {!!(item.rawInsight?.relatedDrivers && (item.rawInsight.relatedDrivers as Record<string, unknown>).predictiveInsight) && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Forward Outlook</p>
                  <p className="text-sm text-gray-600 italic">
                    {(item.rawInsight.relatedDrivers as Record<string, unknown>).predictiveInsight as string}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              {item.recommendations.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Recommendations</p>
                  <ol className="space-y-2">
                    {item.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-[#F0F0F0] text-[#003B2C] flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5">
                          {i + 1}
                        </span>
                        {r}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related KPIs */}
              {item.relatedKPIs.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Related KPIs</p>
                  <div className="flex flex-wrap gap-1">
                    {item.relatedKPIs.map(k => (
                      <span key={k} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Console link */}
              {item.consoleLink && (
                <a
                  href={item.consoleLink}
                  className="inline-flex items-center gap-1.5 text-sm text-[#003B2C] hover:text-[#007A3D] font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View in Business Console
                </a>
              )}

              {/* Related Items */}
              {relatedItems.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Related {item.source === 'ai' ? 'Commentary' : 'AI Insights'} ({relatedItems.length})
                  </p>
                  <div className="space-y-2">
                    {relatedItems.slice(0, 8).map(ri => (
                      <button
                        key={ri.id}
                        onClick={() => onSelectRelated(ri.id)}
                        className="w-full text-left flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                      >
                        {ri.source === 'ai' ? (
                          <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-[#003B2C] shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-[#003B2C] truncate">{ri.title}</p>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{ri.summary}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-gray-400 shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
