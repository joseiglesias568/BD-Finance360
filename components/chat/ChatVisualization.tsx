'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';

interface YKeySpec {
  key: string;
  color?: string;
  label?: string;
}

interface VisualizationSpec {
  type: 'bar' | 'line' | 'area' | 'pie' | 'mermaid';
  title: string;
  data?: Record<string, unknown>[];
  xKey?: string;
  yKeys?: YKeySpec[];
  mermaidCode?: string;
}

const COLORS = ['#003B2C', '#007A3D', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
const TOOLTIP_STYLE = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11, padding: '6px 10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' };

export default function ChatVisualization({ spec }: { spec: VisualizationSpec }) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, '');
  const [mermaidSvg, setMermaidSvg] = useState<string | null>(null);

  useEffect(() => {
    if (spec.type === 'mermaid' && spec.mermaidCode) {
      import('mermaid').then((m) => {
        m.default.initialize({ startOnLoad: false, theme: 'neutral', themeVariables: { primaryColor: '#F0F0F0', primaryTextColor: '#003B2C', primaryBorderColor: '#003B2C', lineColor: '#003B2C' } });
        m.default.render(`mermaid-${uid}-${Date.now()}`, spec.mermaidCode!).then(({ svg }) => {
          setMermaidSvg(svg);
        }).catch(() => {
          setMermaidSvg('<p style="color:#EF4444;font-size:12px">Failed to render diagram</p>');
        });
      });
    }
  }, [spec, uid]);

  if (spec.type === 'mermaid') {
    return (
      <div className="my-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <p className="text-xs font-semibold text-[#003B2C] mb-2">{spec.title}</p>
        {mermaidSvg ? (
          <div ref={mermaidRef} className="overflow-x-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: mermaidSvg }} />
        ) : (
          <div className="flex items-center gap-2 py-4">
            <div className="w-4 h-4 border-2 border-[#003B2C] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-500">Rendering diagram...</span>
          </div>
        )}
      </div>
    );
  }

  // Recharts rendering
  const data = spec.data || [];
  const xKey = spec.xKey || 'name';
  const yKeys = spec.yKeys || (data.length > 0 ? Object.keys(data[0]).filter(k => k !== xKey).map((k, i) => ({ key: k, color: COLORS[i % COLORS.length], label: k })) : [{ key: 'value', color: COLORS[0], label: 'Value' }]);

  const formatValue = (v: number) => {
    if (Math.abs(v) >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
    if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return v.toFixed(1);
  };

  return (
    <div className="my-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <p className="text-xs font-semibold text-[#003B2C] mb-2">{spec.title}</p>
      <ResponsiveContainer width="100%" height={200}>
        {spec.type === 'bar' ? (
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={formatValue} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => formatValue(v)} />
            {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} />}
            {yKeys.map((yk, i) => (
              <Bar key={yk.key} dataKey={yk.key} name={yk.label || yk.key} fill={yk.color || COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        ) : spec.type === 'line' ? (
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={formatValue} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => formatValue(v)} />
            {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} />}
            {yKeys.map((yk, i) => (
              <Line key={yk.key} type="monotone" dataKey={yk.key} name={yk.label || yk.key} stroke={yk.color || COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        ) : spec.type === 'area' ? (
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={formatValue} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => formatValue(v)} />
            {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} />}
            {yKeys.map((yk, i) => (
              <Area key={yk.key} type="monotone" dataKey={yk.key} name={yk.label || yk.key} stroke={yk.color || COLORS[i % COLORS.length]} fill={yk.color || COLORS[i % COLORS.length]} fillOpacity={0.2} />
            ))}
          </AreaChart>
        ) : spec.type === 'pie' ? (
          <PieChart>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Pie data={data} dataKey={yKeys[0]?.key || 'value'} nameKey={xKey} cx="50%" cy="50%" outerRadius={70} label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#9CA3AF' }} style={{ fontSize: 10 }}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <BarChart data={data}><Bar dataKey="value" fill="#003B2C" /></BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
