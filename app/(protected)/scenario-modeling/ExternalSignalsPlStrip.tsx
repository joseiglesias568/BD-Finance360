'use client';

import {
    EXTERNAL_COMPETITIVE_SIGNALS,
    type SignalImportance,
} from '@/lib/scenario/external-competitive-signals';
import { ChevronRight, Link2, Radar } from 'lucide-react';

function bandShort(lowM: number, highM: number): string {
    const fmt = (v: number) => {
        const sign = v < 0 ? '−' : '';
        const abs = Math.abs(v);
        if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(1)}B`;
        return `${sign}${Math.round(abs)}M`;
    };
    return `${fmt(lowM)}–${fmt(highM)} OI`;
}

function dotClass(level: SignalImportance): string {
    switch (level) {
        case 'critical':
            return 'bg-red-500';
        case 'high':
            return 'bg-orange-500';
        case 'elevated':
            return 'bg-amber-400';
        default:
            return 'bg-slate-400';
    }
}

interface ExternalSignalsPlStripProps {
    onDeepDiveSignal: (signalId: string) => void;
    onSyncPreset: (signalId: string) => void;
    onOpenExternalTab: () => void;
}

export default function ExternalSignalsPlStrip({
    onDeepDiveSignal,
    onSyncPreset,
    onOpenExternalTab,
}: ExternalSignalsPlStripProps) {
    return (
        <div className="bg-gradient-to-b from-gray-50/80 to-white border-b border-gray-200/80">
            <div className="max-w-7xl mx-auto px-6 py-3">
                <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <Radar className="w-4 h-4 text-[#003B2C] shrink-0" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 truncate">
                            External signals
                        </span>
                        <span className="text-[11px] text-gray-400 hidden sm:inline">— top monitors</span>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenExternalTab}
                        className="text-[11px] font-semibold text-[#003B2C] hover:text-[#003B2C] flex items-center gap-0.5 shrink-0"
                    >
                        Full analysis
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {EXTERNAL_COMPETITIVE_SIGNALS.map((s) => (
                        <div
                            key={s.id}
                            className="flex shrink-0 rounded-xl border border-gray-200/90 bg-white shadow-sm hover:border-[#003B2C]/25 hover:shadow transition-all overflow-hidden"
                        >
                            <button
                                type="button"
                                onClick={() => onDeepDiveSignal(s.id)}
                                className="flex items-center gap-2 pl-2.5 pr-2 py-2 text-left max-w-[220px] sm:max-w-none"
                                title={`${s.title} — open SWOT detail`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass(s.importance)}`}
                                    aria-hidden
                                />
                                <span className="text-[10px] font-bold text-[#003B2C] tabular-nums w-4 shrink-0">
                                    {s.rank}
                                </span>
                                <span className="text-xs font-medium text-gray-900 truncate">{s.shortTitle}</span>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap hidden md:inline">
                                    {bandShort(s.impactRange.lowM, s.impactRange.highM)}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSyncPreset(s.id);
                                }}
                                className="px-2.5 border-l border-gray-100 text-gray-400 hover:text-[#003B2C] hover:bg-gray-50 transition-colors"
                                title="Sync lever preset to P&L Impact"
                            >
                                <Link2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
