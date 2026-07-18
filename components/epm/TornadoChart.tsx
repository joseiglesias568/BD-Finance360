'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { CHART_AXIS_STYLE, CHART_GRID_STYLE } from '@/lib/chart-theme';

interface TornadoChartProps {
  items: { label: string; low: number; high: number; expected: number }[];
  height?: number;
}

export default function TornadoChart({ items, height = 300 }: TornadoChartProps) {
  // Sort by total range (largest at top)
  const sorted = [...items].sort((a, b) =>
    (Math.abs(b.high) + Math.abs(b.low)) - (Math.abs(a.high) + Math.abs(a.low))
  );

  const chartData = sorted.map(item => ({
    name: item.label,
    downside: item.low, // negative values
    upside: item.high,  // positive values
    expected: item.expected,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 140, bottom: 5 }}
      >
        <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical={true} />
        <XAxis
          type="number"
          tick={CHART_AXIS_STYLE}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v > 0 ? '+' : ''}$${v}M`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ ...CHART_AXIS_STYLE, fontSize: 9, textAnchor: 'end' }}
          axisLine={false}
          tickLine={false}
          width={135}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0]?.payload;
            if (!d) return null;
            return (
              <div className="bg-[#003B2C] text-white rounded-lg px-3 py-2 text-xs shadow-lg">
                <p className="font-semibold mb-1">{d.name}</p>
                {d.downside !== 0 && (
                  <p className="text-red-300">Downside: ${d.downside}M</p>
                )}
                {d.upside !== 0 && (
                  <p className="text-emerald-300">Upside: +${d.upside}M</p>
                )}
                <p className="text-gray-300 mt-0.5">Expected: {d.expected > 0 ? '+' : ''}${d.expected}M</p>
              </div>
            );
          }}
        />
        <ReferenceLine x={0} stroke="#9CA3AF" strokeWidth={1.5} />
        <Bar dataKey="downside" radius={[3, 0, 0, 3]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill="#dc2626" opacity={0.8} />
          ))}
        </Bar>
        <Bar dataKey="upside" radius={[0, 3, 3, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill="#003B2C" opacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
