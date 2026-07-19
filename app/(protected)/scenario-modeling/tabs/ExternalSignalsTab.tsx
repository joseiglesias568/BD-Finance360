'use client';

import {
    EXTERNAL_COMPETITIVE_SIGNALS,
    EXTERNAL_COMPETITIVE_SIGNALS_INTRO,
    type ExternalCompetitiveSignal,
    type SignalImportance,
} from '@/lib/scenario/external-competitive-signals';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronRight,
    Link2,
    Minus,
    Radar,
    ShieldAlert,
    Sparkles,
    Target,
    TrendingDown,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

function importanceStyles(level: SignalImportance): { badge: string; bar: string } {
    switch (level) {
        case 'critical':
            return { badge: 'bg-red-100 text-red-800 border-red-200', bar: 'bg-red-500' };
        case 'high':
            return { badge: 'bg-orange-100 text-orange-900 border-orange-200', bar: 'bg-orange-500' };
        case 'elevated':
            return { badge: 'bg-amber-100 text-amber-900 border-amber-200', bar: 'bg-amber-500' };
        default:
            return { badge: 'bg-slate-100 text-slate-800 border-slate-200', bar: 'bg-slate-400' };
    }
}

function importanceLabel(level: SignalImportance): string {
    switch (level) {
        case 'critical':
            return 'Critical materiality';
        case 'high':
            return 'High materiality';
        case 'elevated':
            return 'Elevated';
        default:
            return 'Moderate';
    }
}

function fmtSignedMoneyM(v: number): string {
    const sign = v < 0 ? '−' : v > 0 ? '+' : '';
    const abs = Math.abs(v);
    if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}B`;
    return `${sign}$${Math.round(abs)}M`;
}

function formatImpactBandM(lowM: number, highM: number): string {
    return `${fmtSignedMoneyM(lowM)} to ${fmtSignedMoneyM(highM)}`;
}

function SignalDetailModal({
    signal,
    onClose,
    onApplyToPl,
}: {
    signal: ExternalCompetitiveSignal;
    onClose: () => void;
    onApplyToPl?: () => void;
}) {
    const styles = importanceStyles(signal.importance);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signal-modal-title"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#1c519c] to-[#1c519c] text-white shrink-0">
                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wide text-white/70 mb-1">{signal.category}</p>
                        <h2 id="signal-modal-title" className="text-lg font-semibold leading-snug">
                            {signal.title}
                        </h2>
                        <p className="text-sm text-white/85 mt-2">{signal.summary}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 min-h-0 px-6 py-5 space-y-5">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles.badge}`}>
                            {importanceLabel(signal.importance)}
                        </span>
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                            <Target className="w-3.5 h-3.5 text-[#1c519c]" />
                            {signal.materialityNote}
                        </span>
                    </div>

                    <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                            Illustrative impact band
                        </p>
                        <p className="text-sm text-gray-600 mb-2">{signal.impactRange.label}</p>
                        <p className="text-2xl font-bold text-gray-900 tracking-tight">
                            {formatImpactBandM(signal.impactRange.lowM, signal.impactRange.highM)}
                            <span className="text-sm font-normal text-gray-500 ml-2">operating income</span>
                        </p>
                        {signal.impactRange.marginBpsLow != null && signal.impactRange.marginBpsHigh != null && (
                            <p className="text-xs text-gray-500 mt-2">
                                Margin bridge (indicative):{' '}
                                {signal.impactRange.marginBpsLow} to {signal.impactRange.marginBpsHigh} bps vs.{' '}
                                ~$63B revenue scale
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                            What to monitor
                        </p>
                        <ul className="space-y-1.5">
                            {signal.indicatorsToWatch.map((ind) => (
                                <li key={ind} className="text-sm text-gray-700 flex gap-2">
                                    <ChevronRight className="w-4 h-4 text-[#1c519c] shrink-0 mt-0.5" />
                                    <span>{ind}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <SwotColumn
                            title="Strengths"
                            icon={<ShieldAlert className="w-4 h-4 text-emerald-600" />}
                            items={signal.swot.strengths}
                            tone="border-emerald-100 bg-emerald-50/60"
                        />
                        <SwotColumn
                            title="Weaknesses"
                            icon={<TrendingDown className="w-4 h-4 text-amber-700" />}
                            items={signal.swot.weaknesses}
                            tone="border-amber-100 bg-amber-50/50"
                        />
                        <SwotColumn
                            title="Opportunities"
                            icon={<ArrowUpRight className="w-4 h-4 text-[#1c519c]" />}
                            items={signal.swot.opportunities}
                            tone="border-sky-100 bg-sky-50/50"
                        />
                        <SwotColumn
                            title="Threats"
                            icon={<ArrowDownRight className="w-4 h-4 text-red-600" />}
                            items={signal.swot.threats}
                            tone="border-red-100 bg-red-50/40"
                        />
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                            Research traceability
                        </p>
                        <ul className="space-y-1">
                            {signal.researchRefs.map((ref) => (
                                <li key={ref} className="text-xs text-gray-500 leading-relaxed">
                                    • {ref}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="text-[11px] text-gray-400 italic leading-relaxed">
                        Illustrative ranges support scenario discussion only; they do not represent Delta management
                        guidance or audited sensitivities beyond disclosed fuel and demand narratives.
                    </p>
                </div>

                {onApplyToPl && (
                    <div className="border-t border-gray-200 px-6 py-3 flex justify-end bg-gray-50/95 shrink-0">
                        <button
                            type="button"
                            onClick={() => {
                                onApplyToPl();
                                onClose();
                            }}
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#1c519c] text-white hover:bg-[#1c519c] transition-colors"
                        >
                            Sync preset to P&L Impact
                        </button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

function SwotColumn({
    title,
    icon,
    items,
    tone,
}: {
    title: string;
    icon: ReactNode;
    items: string[];
    tone: string;
}) {
    return (
        <div className={`rounded-lg border p-3 ${tone}`}>
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-xs font-semibold text-gray-900">{title}</span>
            </div>
            <ul className="space-y-1.5">
                {items.map((item) => (
                    <li key={item} className="text-xs text-gray-700 leading-snug flex gap-2">
                        <Minus className="w-3 h-3 shrink-0 mt-0.5 opacity-40" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export interface ExternalSignalsTabProps {
    /** When set, opens this signal’s modal once (parent clears via callback). */
    pendingOpenSignalId?: string | null;
    onPendingOpenHandled?: () => void;
    /** Applies editorial lever preset and returns user to P&L Impact (parent-owned). */
    onSyncPresetToPl?: (signal: ExternalCompetitiveSignal) => void;
}

export default function ExternalSignalsTab({
    pendingOpenSignalId,
    onPendingOpenHandled,
    onSyncPresetToPl,
}: ExternalSignalsTabProps) {
    const [openId, setOpenId] = useState<string | null>(null);
    const openSignal = useMemo(
        () => EXTERNAL_COMPETITIVE_SIGNALS.find((s) => s.id === openId) ?? null,
        [openId],
    );

    useEffect(() => {
        if (!pendingOpenSignalId) return;
        setOpenId(pendingOpenSignalId);
        onPendingOpenHandled?.();
    }, [pendingOpenSignalId, onPendingOpenHandled]);

    useEffect(() => {
        if (!openId) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpenId(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [openId]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-6"
            >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[#1c519c] text-white shrink-0">
                            <Radar className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {EXTERNAL_COMPETITIVE_SIGNALS_INTRO.headline}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{EXTERNAL_COMPETITIVE_SIGNALS_INTRO.subtext}</p>
                            <p className="text-xs text-gray-500 mt-3 leading-relaxed flex gap-2">
                                <Sparkles className="w-4 h-4 text-[#1c519c] shrink-0 mt-0.5" />
                                <span>{EXTERNAL_COMPETITIVE_SIGNALS_INTRO.methodology}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    {EXTERNAL_COMPETITIVE_SIGNALS.map((signal) => {
                        const styles = importanceStyles(signal.importance);
                        const barWidth =
                            signal.importance === 'critical'
                                ? 'w-full'
                                : signal.importance === 'high'
                                  ? 'w-4/5'
                                  : signal.importance === 'elevated'
                                    ? 'w-3/5'
                                    : 'w-2/5';

                        return (
                            <div
                                key={signal.id}
                                className="flex bg-white rounded-xl shadow-sm border border-gray-200 hover:border-[#1c519c]/40 hover:shadow-md transition-all overflow-hidden group"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenId(signal.id)}
                                    className="flex-1 text-left p-5 min-w-0"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-3 min-w-0">
                                            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1c519c] text-white text-sm font-bold shrink-0">
                                                {signal.rank}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#1c519c]">
                                                    {signal.category}
                                                </p>
                                                <h4 className="text-base font-semibold text-gray-900 mt-0.5 group-hover:text-[#1c519c] transition-colors">
                                                    {signal.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-2 leading-snug">{signal.summary}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1c519c] shrink-0 mt-1" />
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${styles.badge}`}>
                                            {importanceLabel(signal.importance)}
                                        </span>
                                        <span className="text-xs text-gray-500">{signal.materialityNote}</span>
                                    </div>

                                    <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                        <div className={`h-full rounded-full ${styles.bar} ${barWidth}`} />
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-between gap-2">
                                        <span className="text-xs text-gray-500">{signal.impactRange.label}</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {formatImpactBandM(signal.impactRange.lowM, signal.impactRange.highM)}
                                            <span className="text-xs font-normal text-gray-500 ml-1">OI</span>
                                        </span>
                                    </div>
                                </button>
                                {onSyncPresetToPl && (
                                    <button
                                        type="button"
                                        title="Sync editorial lever preset to P&L Impact tab"
                                        onClick={() => onSyncPresetToPl(signal)}
                                        className="shrink-0 px-4 border-l border-gray-100 text-gray-400 hover:text-[#1c519c] hover:bg-gray-50 transition-colors flex items-center"
                                    >
                                        <Link2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            <AnimatePresence>
                {openSignal && (
                    <SignalDetailModal
                        signal={openSignal}
                        onClose={() => setOpenId(null)}
                        onApplyToPl={
                            onSyncPresetToPl ? () => onSyncPresetToPl(openSignal) : undefined
                        }
                    />
                )}
            </AnimatePresence>
        </>
    );
}
