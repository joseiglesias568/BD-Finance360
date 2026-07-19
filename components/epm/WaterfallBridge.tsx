'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_AXIS_STYLE, CHART_GRID_STYLE } from '@/lib/chart-theme';

interface WaterfallDatum {
  name: string;
  base: number;
  value: number;
  rawImpact: number;
  isTotal: boolean;
  isPositive: boolean;
  description?: string;
}

interface WaterfallBridgeProps {
  startLabel: string;
  startValue: number;
  endLabel: string;
  endValue: number;
  items: { label: string; impact: number; description?: string }[];
  height?: number;
  isEPS?: boolean;
  showTable?: boolean;
}

function formatVal(v: number, isEPS: boolean): string {
  if (isEPS) return `$${v.toFixed(2)}`;
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}B`;
  return `$${v.toLocaleString()}M`;
}

/**
 * Compute "nice" tick values for the Y-axis within [floor, ceiling].
 * Returns 4-6 evenly spaced ticks rounded to clean numbers.
 */
function computeTicks(floor: number, ceiling: number, isEPS: boolean): number[] {
  const range = ceiling - floor;
  if (range <= 0) return [floor];

  // Determine a "nice" step size
  const rawStep = range / 5;
  let step: number;
  if (isEPS) {
    step = rawStep < 0.05 ? 0.02 : rawStep < 0.1 ? 0.05 : 0.1;
  } else {
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const normalized = rawStep / magnitude;
    if (normalized <= 1.5) step = 1 * magnitude;
    else if (normalized <= 3) step = 2 * magnitude;
    else if (normalized <= 7) step = 5 * magnitude;
    else step = 10 * magnitude;
  }

  const ticks: number[] = [];
  const start = Math.ceil(floor / step) * step;
  for (let t = start; t <= ceiling; t += step) {
    ticks.push(Math.round(t * 1000) / 1000); // avoid floating point drift
  }
  return ticks;
}

export default function WaterfallBridge({
  startLabel, startValue, endLabel, endValue, items,
  height = 320, isEPS = false, showTable = true,
}: WaterfallBridgeProps) {
  const { chartData, domain, ticks } = useMemo(() => {
    // First pass: compute running values to find the range of bridge items
    let running = startValue;
    let runMin = startValue;
    let runMax = startValue;

    for (const item of items) {
      if (Math.abs(item.impact) < 0.001) continue;
      running += item.impact;
      runMin = Math.min(runMin, running);
      runMax = Math.max(runMax, running);
    }

    // Include end value in range
    runMin = Math.min(runMin, endValue);
    runMax = Math.max(runMax, startValue, endValue);

    // Calculate a "floor" so the chart is zoomed into the interesting range
    // The bridge items should take up ~40-60% of the chart height
    const bridgeRange = runMax - runMin;
    const totalPadding = Math.max(bridgeRange * 0.8, Math.abs(startValue) * 0.02);
    const floor = runMin - totalPadding;
    const ceiling = runMax + totalPadding * 0.6;

    const axisTicks = computeTicks(floor, ceiling, isEPS);

    const data: WaterfallDatum[] = [];

    // Starting total — bar starts from the floor, not from 0
    data.push({
      name: startLabel,
      base: floor,
      value: startValue - floor,
      rawImpact: startValue,
      isTotal: true,
      isPositive: true,
    });

    // Bridge items — positioned relative to running total
    running = startValue;
    for (const item of items) {
      const impact = item.impact;
      if (Math.abs(impact) < 0.001) continue;
      const isPositive = impact > 0;
      data.push({
        name: item.label,
        base: isPositive ? running : running + impact,
        value: Math.abs(impact),
        rawImpact: impact,
        isTotal: false,
        isPositive,
        description: item.description,
      });
      running += impact;
    }

    // Ending total — bar starts from the floor
    data.push({
      name: endLabel,
      base: floor,
      value: endValue - floor,
      rawImpact: endValue,
      isTotal: true,
      isPositive: endValue >= startValue,
    });

    return {
      chartData: data,
      domain: [floor, ceiling] as [number, number],
      ticks: axisTicks,
    };
  }, [startLabel, startValue, endLabel, endValue, items]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid {...CHART_GRID_STYLE} />
          <XAxis
            dataKey="name"
            tick={{ ...CHART_AXIS_STYLE, fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis
            type="number"
            tick={CHART_AXIS_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatVal(v, isEPS)}
            domain={domain}
            ticks={ticks}
            allowDataOverflow={true}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[1]) return null;
              const d = payload[1].payload as WaterfallDatum;
              return (
                <div className="bg-[#1c519c] text-white rounded-lg px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold">{d.name}</p>
                  {d.isTotal ? (
                    <p>{formatVal(d.rawImpact, isEPS)}</p>
                  ) : (
                    <p className={d.isPositive ? 'text-emerald-300' : 'text-red-300'}>
                      {d.isPositive ? '+' : ''}{formatVal(d.rawImpact, isEPS)}
                    </p>
                  )}
                  {d.description && <p className="text-gray-300 mt-1 max-w-[200px]">{d.description}</p>}
                </div>
              );
            }}
          />
          {/* Invisible spacer bar */}
          <Bar dataKey="base" stackId="stack" fill="transparent" isAnimationActive={false} />
          {/* Visible bar */}
          <Bar dataKey="value" stackId="stack" radius={[3, 3, 0, 0]}>
            {chartData.map((d, i) => (
              <Cell
                key={i}
                fill={d.isTotal ? '#1c519c' : d.isPositive ? '#1c519c' : '#dc2626'}
                opacity={d.isTotal ? 1 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {showTable && items.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Driver</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-600">Impact</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600 hidden md:table-cell">Description</th>
              </tr>
            </thead>
            <tbody>
              {items.filter(it => Math.abs(it.impact) > 0.001).map((item, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-800">{item.label}</td>
                  <td className={`py-2 px-3 text-right font-mono font-semibold tabular-nums ${
                    item.impact > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {item.impact > 0 ? '+' : ''}{formatVal(item.impact, isEPS)}
                  </td>
                  <td className="py-2 px-3 text-gray-500 hidden md:table-cell">{item.description}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-2 px-3 text-gray-800">Net Variance</td>
                <td className={`py-2 px-3 text-right font-mono tabular-nums ${
                  endValue - startValue >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {endValue - startValue >= 0 ? '+' : ''}{formatVal(endValue - startValue, isEPS)}
                </td>
                <td className="py-2 px-3 hidden md:table-cell" />
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
