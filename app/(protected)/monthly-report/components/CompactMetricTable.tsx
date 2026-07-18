'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricRow {
  label: string;
  value: string | number;
  target?: string | number;
  trend?: 'up' | 'down' | 'flat';
  status?: 'good' | 'warning' | 'critical';
}

interface CompactMetricTableProps {
  metrics: MetricRow[];
  showTrend?: boolean;
  showTarget?: boolean;
  className?: string;
}

const statusDot: Record<string, string> = {
  good: 'bg-emerald-400',
  warning: 'bg-amber-400',
  critical: 'bg-red-400',
};

const TrendIcon = ({ trend }: { trend?: string }) => {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-gray-300" />;
};

export default function CompactMetricTable({
  metrics,
  showTrend = true,
  showTarget = true,
  className = '',
}: CompactMetricTableProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Metric</th>
            <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
            {showTarget && <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>}
            {showTrend && <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">Trend</th>}
            <th className="text-center py-2 px-3 w-6" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {metrics.map((m, i) => (
            <tr key={i} className="hover:bg-gray-50/50">
              <td className="py-2 px-3 text-gray-700 font-medium">{m.label}</td>
              <td className="py-2 px-3 text-right font-semibold text-gray-900">{m.value}</td>
              {showTarget && <td className="py-2 px-3 text-right text-gray-500">{m.target ?? '—'}</td>}
              {showTrend && (
                <td className="py-2 px-3 text-center">
                  <TrendIcon trend={m.trend} />
                </td>
              )}
              <td className="py-2 px-3 text-center">
                {m.status && <span className={`inline-block w-2 h-2 rounded-full ${statusDot[m.status] || 'bg-gray-300'}`} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
