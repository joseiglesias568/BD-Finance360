'use client';

import type { ScenarioLever } from '@/config/types';
import {
    DRIVER_ANALYTICS_TREE,
    collinearityBand,
    contributionScore,
    findLeverNode,
    getDriverCorrelation,
    peerLeverIds,
    timingLabel,
    type DriverTreeNode,
} from '@/lib/scenario/driver-analytics-model';
import { getDriverTimeseries } from '@/lib/scenario/driver-analytics-timeseries';
import DriverAnalyticsTrendChart from '../DriverAnalyticsTrendChart';
import DriverKpiHeatmap from '../DriverKpiHeatmap';
import { ChevronDown, ChevronRight, GitBranch } from 'lucide-react';
import { useMemo, useState } from 'react';

interface DriverAnalyticsTabProps {
    levers: ScenarioLever[];
}

function TreeSection({
    node,
    depth,
    expanded,
    toggle,
    onSelectLeaf,
    selectedId,
}: {
    node: DriverTreeNode;
    depth: number;
    expanded: Set<string>;
    toggle: (id: string) => void;
    onSelectLeaf: (leverId: string) => void;
    selectedId: string | null;
}) {
    const hasKids = Boolean(node.children?.length);
    const isLeaf = Boolean(node.leverIds?.length);
    const open = expanded.has(node.id);

    if (isLeaf && node.leverIds?.[0]) {
        const lid = node.leverIds[0];
        const active = selectedId === lid;
        return (
            <button
                type="button"
                onClick={() => onSelectLeaf(lid)}
                className={`w-full text-left pl-2 py-1.5 rounded-md text-sm flex items-center gap-2 ${
                    active ? 'bg-[#003B2C]/10 text-[#003B2C] font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{ paddingLeft: 8 + depth * 14 }}
            >
                <GitBranch className="w-3.5 h-3.5 shrink-0 opacity-60" />
                {node.label}
            </button>
        );
    }

    return (
        <div className="select-none">
            <button
                type="button"
                onClick={() => toggle(node.id)}
                className="w-full flex items-center gap-1 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-md"
                style={{ paddingLeft: 4 + depth * 12 }}
            >
                {hasKids ? (
                    open ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                    )
                ) : (
                    <span className="w-4" />
                )}
                <span>{node.label}</span>
            </button>
            {hasKids && open && (
                <div className="border-l border-gray-100 ml-3">
                    {node.children!.map((ch) => (
                        <TreeSection
                            key={ch.id}
                            node={ch}
                            depth={depth + 1}
                            expanded={expanded}
                            toggle={toggle}
                            onSelectLeaf={onSelectLeaf}
                            selectedId={selectedId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function DriverAnalyticsTab({ levers }: DriverAnalyticsTabProps) {
    const [expanded, setExpanded] = useState<Set<string>>(
        () => new Set(['cfo-root', 'revenue-growth-drivers', 'glp1-demand']),
    );
    const [selectedId, setSelectedId] = useState<string | null>('glp1-volume-growth');

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });
    };

    const meta = useMemo(() => levers.find((l) => l.id === selectedId), [levers, selectedId]);
    const node = selectedId ? findLeverNode(DRIVER_ANALYTICS_TREE, selectedId) : null;
    const peers = useMemo(
        () => (selectedId ? peerLeverIds(DRIVER_ANALYTICS_TREE, selectedId) : []),
        [selectedId],
    );

    const corrRows = useMemo(() => {
        if (!selectedId) return [];
        return peers
            .map((p) => ({
                id: p,
                name: levers.find((l) => l.id === p)?.name ?? p,
                r: getDriverCorrelation(selectedId, p),
            }))
            .sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
    }, [selectedId, peers, levers]);

    const colBand = selectedId ? collinearityBand(selectedId, peers) : 'low';
    const score = selectedId ? contributionScore(selectedId) : 0;
    const timeseries = useMemo(
        () => (selectedId ? getDriverTimeseries(selectedId) : null),
        [selectedId],
    );

    return (
        <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-[#003B2C]" />
                    Driver analytics — CFO cascade
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Tree follows the BD CFO driver hierarchy behind scenario levers. Each leaf includes an illustrative
                    quarterly trend (FY24–FY25 actual / disclosed, FY26–FY27 projected). Correlation scores remain
                    structural priors until empirical series are wired.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm max-h-[560px] overflow-y-auto min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Driver tree</p>
                    <TreeSection
                        node={DRIVER_ANALYTICS_TREE}
                        depth={0}
                        expanded={expanded}
                        toggle={toggle}
                        onSelectLeaf={setSelectedId}
                        selectedId={selectedId}
                    />
                </div>

                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 min-w-0">
                    {!selectedId || !node ? (
                        <p className="text-sm text-gray-500">Select a driver leaf.</p>
                    ) : (
                        <>
                            <div>
                                <h3 className="text-base font-bold text-[#003B2C]">{meta?.name ?? node.label}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{meta?.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                                    <p className="text-[10px] font-bold uppercase text-gray-400">P&amp;L bridge</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">{node.plBridge}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                                    <p className="text-[10px] font-bold uppercase text-gray-400">Lead / lag posture</p>
                                    <p className="text-xs text-gray-700 mt-1">{timingLabel(node.timing)}</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                                    <p className="text-[10px] font-bold uppercase text-gray-400">Contribution score</p>
                                    <p className="text-2xl font-bold text-[#003B2C] mt-0.5">{score}</p>
                                    <p className="text-[10px] text-gray-500">Structural salience vs OI (illustrative)</p>
                                </div>
                            </div>

                            {timeseries && <DriverAnalyticsTrendChart series={timeseries} />}

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                                    Multicollinearity (peer branch)
                                </p>
                                <p className="text-sm text-gray-700">
                                    Band:{' '}
                                    <span
                                        className={`font-semibold ${
                                            colBand === 'high'
                                                ? 'text-red-600'
                                                : colBand === 'moderate'
                                                  ? 'text-amber-600'
                                                  : 'text-green-700'
                                        }`}
                                    >
                                        {colBand.toUpperCase()}
                                    </span>{' '}
                                    — max |ρ| vs sibling drivers in this CFO branch (
                                    {colBand === 'high'
                                        ? 'treat regression-style attribution cautiously'
                                        : 'drivers relatively distinguishable'}
                                    ).
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                                    Correlation to peer drivers
                                </p>
                                <div className="rounded-lg border border-gray-100 overflow-hidden max-h-48 overflow-y-auto">
                                    <table className="min-w-full text-xs">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="text-left px-2 py-1.5">Driver</th>
                                                <th className="text-right px-2 py-1.5">ρ (prior)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {corrRows.map((row) => (
                                                <tr key={row.id} className="border-t border-gray-50">
                                                    <td className="px-2 py-1">{row.name}</td>
                                                    <td className="px-2 py-1 text-right font-mono">{row.r.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            {corrRows.length === 0 && (
                                                <tr>
                                                    <td colSpan={2} className="px-2 py-2 text-gray-500">
                                                        No peer correlations defined.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="text-[11px] text-gray-500 border-t border-gray-100 pt-3">
                                Drill-down maps each modeled lever to its superior P&amp;L category. Trend lines synthesize
                                public disclosures (10-K / 10-Q / earnings commentary); projections are directional — not
                                guidance. Replace correlation priors and series with empirical pipelines when available.
                            </div>
                        </>
                    )}
                </div>
            </div>

            <DriverKpiHeatmap levers={levers} />
        </div>
    );
}
