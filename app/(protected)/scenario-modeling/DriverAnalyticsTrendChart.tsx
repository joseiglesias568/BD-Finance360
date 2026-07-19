'use client';

import type { DriverTimeSeries } from '@/lib/scenario/driver-analytics-timeseries';

interface DriverAnalyticsTrendChartProps {
    series: DriverTimeSeries;
}

function formatTick(v: number, axisLabel: string): string {
    if (axisLabel.includes('$/gal')) return `$${v.toFixed(2)}`;
    if (axisLabel.includes('$B')) return `$${v.toFixed(1)}B`;
    if (axisLabel.includes('M logins')) return `${v.toFixed(0)}M`;
    if (axisLabel.includes('leverage')) return `${v.toFixed(2)}x`;
    if (axisLabel.includes('%')) return `${v.toFixed(1)}%`;
    return v.toFixed(1);
}

export default function DriverAnalyticsTrendChart({ series }: DriverAnalyticsTrendChartProps) {
    const { values, splitIndex, valueAxisLabel } = series;
    const n = values.length;
    if (n < 2) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.08 || Math.abs(max) * 0.02 || 0.5;
    const y0 = min - pad;
    const y1 = max + pad;
    const yRange = y1 - y0 || 1;

    const w = 360;
    const h = 112;
    const left = 36;
    const right = 10;
    const top = 10;
    const bottom = 22;
    const pw = w - left - right;
    const ph = h - top - bottom;

    const xAt = (i: number) => left + (i / (n - 1)) * pw;
    const yAt = (v: number) => top + (1 - (v - y0) / yRange) * ph;

    const pointsToPath = (slice: { i: number; v: number }[]) => {
        if (slice.length === 0) return '';
        const first = slice[0];
        let d = `M ${xAt(first.i)} ${yAt(first.v)}`;
        for (let k = 1; k < slice.length; k++) {
            const p = slice[k];
            d += ` L ${xAt(p.i)} ${yAt(p.v)}`;
        }
        return d;
    };

    const histPts = values.slice(0, splitIndex).map((v, i) => ({ i, v }));
    const projPts = values.slice(splitIndex - 1).map((v, j) => ({ i: splitIndex - 1 + j, v }));

    const boundaryX = xAt(splitIndex - 0.5);

    return (
        <div className="rounded-lg border border-gray-100 bg-slate-50/80 p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Quarterly trajectory</p>
                <p className="text-[10px] text-gray-500">
                    <span className="text-[#1c519c] font-semibold">Solid</span> = FY24–FY25 actual / disclosed{' '}
                    <span className="text-[#009AC7] font-semibold">Dashed</span> = FY26–FY27 projected
                </p>
            </div>
            <svg
                width="100%"
                height={h}
                viewBox={`0 0 ${w} ${h}`}
                preserveAspectRatio="xMidYMid meet"
                className="overflow-visible"
                role="img"
                aria-label={`Historical and projected trend for ${valueAxisLabel}`}
            >
                {/* Grid */}
                <line x1={left} y1={yAt(min)} x2={left + pw} y2={yAt(min)} stroke="#e2e8f0" strokeWidth={1} />
                <line x1={left} y1={yAt(max)} x2={left + pw} y2={yAt(max)} stroke="#e2e8f0" strokeWidth={1} />

                {/* Y ticks */}
                <text x={4} y={yAt(max) + 3} fontSize={9} fill="#64748b">
                    {formatTick(max, valueAxisLabel)}
                </text>
                <text x={4} y={yAt(min) + 3} fontSize={9} fill="#64748b">
                    {formatTick(min, valueAxisLabel)}
                </text>

                {/* Boundary FY25 | FY26 */}
                <line
                    x1={boundaryX}
                    y1={top}
                    x2={boundaryX}
                    y2={top + ph}
                    stroke="#94a3b8"
                    strokeWidth={1}
                    strokeDasharray="4 3"
                    opacity={0.85}
                />

                {/* Historical path */}
                <path
                    d={pointsToPath(histPts)}
                    fill="none"
                    stroke="#1c519c"
                    strokeWidth={2.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Projected path */}
                <path
                    d={pointsToPath(projPts)}
                    fill="none"
                    stroke="#009AC7"
                    strokeWidth={2.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="5 4"
                />

                {/* Points */}
                {values.map((v, i) => (
                    <circle
                        key={i}
                        cx={xAt(i)}
                        cy={yAt(v)}
                        r={i === splitIndex || i === splitIndex - 1 ? 3 : 2}
                        fill={i < splitIndex ? '#1c519c' : '#009AC7'}
                        opacity={0.9}
                    />
                ))}

                {/* X labels — FY boundaries */}
                <text x={left + pw * 0.22} y={h - 4} fontSize={9} fill="#475569" textAnchor="middle">
                    FY24–25
                </text>
                <text x={left + pw * 0.72} y={h - 4} fontSize={9} fill="#475569" textAnchor="middle">
                    FY26–27 (proj.)
                </text>
            </svg>
            <p className="text-[10px] text-gray-500 mt-2 leading-snug">{series.footnote}</p>
        </div>
    );
}
