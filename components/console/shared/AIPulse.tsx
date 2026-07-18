'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, AlertTriangle, Info, TrendingUp, ChevronRight, ChevronLeft } from 'lucide-react';
import AIFeedback from '@/components/feedback/AIFeedback';
import type { PulseInsight } from '../types';

interface AIPulseProps {
  insights: PulseInsight[];
  onInvestigate?: (insight: PulseInsight) => void;
}

const severityConfig: Record<string, { icon: typeof AlertCircle; dot: string; accent: string }> = {
  critical: { icon: AlertCircle, dot: 'bg-red-400', accent: 'border-red-400/30' },
  warning: { icon: AlertTriangle, dot: 'bg-amber-400', accent: 'border-amber-400/30' },
  info: { icon: Info, dot: 'bg-blue-400', accent: 'border-blue-400/30' },
  positive: { icon: TrendingUp, dot: 'bg-emerald-400', accent: 'border-emerald-400/30' },
};

export default function AIPulse({ insights, onInvestigate }: AIPulseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || insights.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % insights.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [paused, insights.length]);

  if (!insights.length) return null;

  const current = insights[activeIndex];
  const config = severityConfig[current.severity] || severityConfig.info;
  const Icon = config.icon;

  return (
    <div
      className="bg-[#003B2C] rounded-xl p-5 text-white relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <Sparkles className="w-4 h-4 text-[#F0F0F0]" />
            </div>
            <span className="text-sm font-semibold text-[#F0F0F0]">AI Pulse</span>
            <span className="text-xs text-white/40">Auto-generated insights</span>
          </div>

          {/* Navigation dots */}
          {insights.length > 1 && (
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveIndex((i) => (i - 1 + insights.length) % insights.length)} className="text-white/40 hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {insights.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === activeIndex ? 'bg-[#F0F0F0] w-4' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <button onClick={() => setActiveIndex((i) => (i + 1) % insights.length)} className="text-white/40 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[80px]"
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 mt-0.5 w-2 h-2 rounded-full ${config.dot}`} />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white mb-1">{current.headline}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{current.detail}</p>
                <div className="flex items-center gap-3 mt-3">
                  {current.action && onInvestigate && (
                    <button
                      onClick={() => onInvestigate(current)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-[#F0F0F0] transition-colors"
                    >
                      {current.action}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  <AIFeedback contentId={`pulse-${activeIndex}`} contentType="insight" size="sm" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
