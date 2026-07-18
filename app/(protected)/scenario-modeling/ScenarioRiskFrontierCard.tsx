'use client';

import type { MonteCarloResults } from '@/lib/scenario-engine';
import type { FrontierPoint, LeverMarginalOi } from '@/lib/scenario/allocation-frontier';
import { Loader2, Shuffle } from 'lucide-react';
import { useMemo } from 'react';

interface ScenarioRiskFrontierCardProps {
    loading: boolean;
    onRun: () => void;
    simulation: MonteCarloResults | null;
    marginal: LeverMarginalOi[] | null;
    frontier: FrontierPoint[] | null;
}

function StatRow({ label, v }: { label: string; v: string }) {
    return (
        <div className="flex justify-between text-xs py-0.5 border-b border-gray-100 last:border-0">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-900 tabular-nums">{v}</span>
        </div>
    );
}

export default function ScenarioRiskFrontierCard({
    loading,
    onRun,
    simulation,
    marginal,
    frontier,
}: ScenarioRiskFrontierCardProps) {
    const frontierSvg = useMemo(() => {
        if (!frontier?.length) return null;
        const xs = frontier.map((p) => p.revenueDelta);
        const ys = frontier.map((p) => p.operatingIncomeDelta);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const pad = 8;
        const w = 280;
        const h = 140;
        const sx = (x: number) =>
            pad + ((x - minX) / (maxX - minX || 1)) * (w - pad * 2);
        const sy = (y: number) =>
            h - pad - ((y - minY) / (maxY - minY || 1)) * (h - pad * 2);
        return (
            <svg width={w} height={h} className="text-[#003B2C]" aria-hidden>
                <rect width={w} height={h} fill="#f8fafc" rx={6} />
                {frontier.map((p, i) => (
                    <circle
                        key={i}
                        cx={sx(p.revenueDelta)}
                        cy={sy(p.operatingIncomeDelta)}
                        r={3}
                        fill="currentColor"
                        opacity={0.55}
                    />
                ))}
            </svg>
        );
    }, [frontier]);

    return (
        <div className="mt-6 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-[#f8fafc] to-white border-b border-gray-100">
                <div>
                    <p className="text-sm font-semibold text-[#003B2C]">Risk & allocation analytics</p>
                    <p className="text-xs text-gray-500">
                        Monte Carlo uses the same P&amp;L engine as sliders; frontier scatter explores random CFO-style
                        budget mixes across growth, productivity, leverage, and loyalty.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onRun}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#003B2C] text-white text-sm font-medium hover:bg-[#003B2C] disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
                    Run simulation
                </button>
            </div>

            <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                        Monte Carlo — outcomes ($M)
                    </p>
                    {!simulation ? (
                        <p className="text-sm text-gray-500">Run to populate distributions.</p>
                    ) : (
                        <div className="space-y-3">
                            {(['operatingIncome', 'netIncome', 'revenue'] as const).map((k) => (
                                <div key={k}>
                                    <p className="text-[11px] font-semibold text-gray-600 capitalize mb-1">
                                        {k === 'operatingIncome'
                                            ? 'Operating income'
                                            : k === 'netIncome'
                                              ? 'Net income'
                                              : 'Revenue'}
                                    </p>
                                    <StatRow label="P10" v={`${simulation[k].p10.toFixed(0)}`} />
                                    <StatRow label="P50" v={`${simulation[k].p50.toFixed(0)}`} />
                                    <StatRow label="P90" v={`${simulation[k].p90.toFixed(0)}`} />
                                    <StatRow label="Mean" v={`${simulation[k].mean.toFixed(0)}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                        Marginal Δ operating income (one lever step at current position)
                    </p>
                    {!marginal?.length ? (
                        <p className="text-sm text-gray-500">Run simulation to compute gradients.</p>
                    ) : (
                        <div className="overflow-x-auto max-h-52 overflow-y-auto rounded-lg border border-gray-100">
                            <table className="min-w-full text-xs">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="text-left px-2 py-1.5 font-semibold text-gray-600">Lever</th>
                                        <th className="text-left px-2 py-1.5 font-semibold text-gray-600">Pillar</th>
                                        <th className="text-right px-2 py-1.5 font-semibold text-gray-600">Δ OI ($M)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marginal.slice(0, 14).map((row) => (
                                        <tr key={row.leverId} className="border-t border-gray-50">
                                            <td className="px-2 py-1 text-gray-800">{row.name}</td>
                                            <td className="px-2 py-1 text-gray-500">{row.pillarLabel}</td>
                                            <td
                                                className={`px-2 py-1 text-right font-medium tabular-nums ${
                                                    row.marginalOiPerStep >= 0 ? 'text-green-700' : 'text-red-700'
                                                }`}
                                            >
                                                {row.marginalOiPerStep >= 0 ? '+' : ''}
                                                {row.marginalOiPerStep.toFixed(1)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-4 items-start">
                        <div>
                            <p className="text-[11px] font-semibold text-gray-600 mb-1">
                                Illustrative frontier (Δ revenue vs Δ OI)
                            </p>
                            {frontierSvg}
                            <p className="text-[10px] text-gray-400 mt-1 max-w-[280px]">
                                Each dot is a random split of incremental focus across pillars applied to levers.
                                Not an optimizer — shows feasible trade-offs under the scenario engine.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
