'use client';

import type { ScenarioLever } from '@/config/types';
import {
    buildDriverKpiHeatmapMatrix,
    orderedDriverLeverIds,
} from '@/lib/scenario/driver-kpi-predictive-heatmap';
import { useMemo, useState, type CSSProperties } from 'react';

function cellStyle(v: number): CSSProperties {
    const t = Math.max(-1, Math.min(1, v));
    if (Math.abs(t) < 0.06) return { background: '#f1f5f9', color: '#475569' };
    if (t >= 0) {
        const L = 96 - t * 54;
        return { background: `hsl(210 72% ${L}%)`, color: L < 52 ? '#fff' : '#0f172a' };
    }
    const x = -t;
    const L = 96 - x * 52;
    return { background: `hsl(0 58% ${L}%)`, color: L < 54 ? '#fff' : '#0f172a' };
}

interface DriverKpiHeatmapProps {
    levers: ScenarioLever[];
}

export default function DriverKpiHeatmap({ levers }: DriverKpiHeatmapProps) {
    const driverIds = useMemo(() => orderedDriverLeverIds(), []);
    const { columns, matrix } = useMemo(() => buildDriverKpiHeatmapMatrix(driverIds), [driverIds]);

    const nameOf = (id: string) => levers.find((l) => l.id === id)?.name ?? id;

    const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3 min-w-0">
            <div>
                <h3 className="text-base font-bold text-gray-900">Driver × executive KPI linkage (prior)</h3>
                <p className="text-sm text-gray-600 mt-1">
                    Heat shows an illustrative association index between each modeled driver and KPI lenses used on the
                    executive summary / monthly bridge — blending CFO pillar fit, structural contribution salience, and
                    pairwise driver correlation priors. Values are{' '}
                    <span className="font-medium text-gray-800">not</span> out-of-sample forecast correlations; swap in
                    empirical ICs or factor loadings when data pipelines land.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 border border-gray-100 rounded-lg px-3 py-2 bg-gray-50/80">
                <span className="font-semibold text-gray-600">Scale</span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-6 h-3 rounded-sm" style={cellStyle(-0.85)} />
                    <span>Negative</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-6 h-3 rounded-sm bg-slate-100 border border-gray-200" />
                    <span>~0</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-6 h-3 rounded-sm" style={cellStyle(0.85)} />
                    <span>Positive</span>
                </span>
            </div>

            <div className="overflow-x-auto -mx-1 px-1 pb-1">
                <table className="text-xs border-collapse min-w-[640px] w-full">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-20 bg-white border-b border-r border-gray-200 px-2 py-2 text-left font-semibold text-gray-700 w-[168px] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
                                Driver
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className="border-b border-gray-200 px-1.5 py-2 text-center font-semibold text-gray-700 align-bottom min-w-[76px]"
                                    title={col.executiveLens}
                                >
                                    <span className="block leading-tight">{col.label}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {driverIds.map((rowId, r) => (
                            <tr key={rowId}>
                                <th
                                    scope="row"
                                    className="sticky left-0 z-10 bg-white border-r border-b border-gray-100 px-2 py-1.5 text-left font-medium text-gray-800 whitespace-nowrap shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]"
                                >
                                    {nameOf(rowId)}
                                </th>
                                {columns.map((col, c) => {
                                    const v = matrix[r][c];
                                    const active = hover?.r === r && hover?.c === c;
                                    return (
                                        <td
                                            key={col.id}
                                            className={`border-b border-gray-100 p-0 text-center tabular-nums ${active ? 'ring-2 ring-[#003B2C] ring-inset z-[1] relative' : ''}`}
                                            onMouseEnter={() => setHover({ r, c })}
                                            onMouseLeave={() => setHover(null)}
                                            title={`${nameOf(rowId)} × ${col.label}: ${v.toFixed(2)} (${col.executiveLens})`}
                                        >
                                            <div
                                                className="py-2 px-1 font-mono text-[11px] leading-none min-h-[2.25rem] flex items-center justify-center"
                                                style={cellStyle(v)}
                                            >
                                                {v.toFixed(2)}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-gray-500">
                {columns.map((col) => (
                    <p key={col.id}>
                        <span className="font-semibold text-gray-600">{col.label}:</span> {col.executiveLens}
                    </p>
                ))}
            </div>
        </div>
    );
}
