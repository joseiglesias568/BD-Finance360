'use client';

import {
  Bar, BarChart, CartesianGrid, Cell, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { StrategicConfig } from '@/config/types';
import { sumField, calculateMargin } from '@/lib/engines';
import { formatBudget } from '@/lib/engines/formatting-engine';
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_TOOLTIP_DARK, CHART_GRID_STYLE } from '@/lib/chart-theme';
import InitiativeRow from '@/app/(protected)/monthly-report/components/InitiativeRow';

interface StrategicInitiativesProps {
  periodLabel: string;
  strategic: StrategicConfig;
}

export default function StrategicInitiatives({ periodLabel, strategic }: StrategicInitiativesProps) {
  const initiatives = strategic?.initiatives ?? [];
  const totalBudget = sumField(initiatives, 'budget');
  const totalSpent = sumField(initiatives, 'spent');
  const onTrack = initiatives.filter(i => i.status === 'on-track' || i.status === 'completed').length;
  const atRisk = initiatives.filter(i => i.status === 'at-risk' || i.status === 'behind').length;

  // Donut data for portfolio split
  const donutData = [
    { name: 'On Track', value: onTrack, color: CHART_COLORS.emerald },
    { name: 'At Risk', value: atRisk, color: CHART_COLORS.amber },
  ];

  // Budget comparison chart data
  const budgetData = initiatives.map(i => ({
    name: i.name.length > 20 ? i.name.slice(0, 18) + '...' : i.name,
    budget: i.budget,
    spent: i.spent,
    status: i.status,
  }));

  // Cross-initiative KPIs flattened
  const allKpis = initiatives.flatMap(init =>
    init.kpis.map(kpi => ({
      initiative: init.name.length > 20 ? init.name.slice(0, 18) + '...' : init.name,
      ...kpi,
    }))
  );

  return (
    <div className="space-y-8">
      {/* Section A: Portfolio Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total with donut */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-14 h-14 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} innerRadius={16} outerRadius={24} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Total</p>
            <p className="text-2xl font-bold text-[#003B2C]">{initiatives.length}</p>
            <p className="text-[10px] text-gray-400">Strategic programs</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">On Track</p>
          <p className="text-2xl font-bold text-emerald-600">{onTrack}</p>
          <p className="text-[10px] text-gray-400">Meeting targets</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">At Risk / Behind</p>
          <p className="text-2xl font-bold text-amber-600">{atRisk}</p>
          <p className="text-[10px] text-gray-400">Requiring attention</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Total Investment</p>
          <p className="text-2xl font-bold text-[#003B2C]">{formatBudget(totalBudget)}</p>
          <p className="text-[10px] text-gray-400">
            {formatBudget(totalSpent)} spent ({totalBudget > 0 ? calculateMargin(totalSpent, totalBudget).toFixed(0) : 0}%)
          </p>
        </div>
      </div>

      {/* Section B: Initiative Progress Matrix */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">Initiative Progress</h2>
        <div className="space-y-2">
          {initiatives.map(init => (
            <InitiativeRow key={init.id} initiative={init} />
          ))}
        </div>
      </div>

      {/* Section C: Budget Overview + Cross-Initiative KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Budget vs Spend</h2>
          <p className="text-xs text-gray-500 mb-4">By initiative ($M)</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
                <XAxis type="number" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#374151' }} axisLine={false} tickLine={false} width={130} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(value: number) => [`$${value}M`, '']} />
                <Bar dataKey="budget" fill={CHART_COLORS.grayLight} radius={[0, 4, 4, 0]} barSize={10} name="Budget" />
                <Bar dataKey="spent" radius={[0, 4, 4, 0]} barSize={10} name="Spent">
                  {budgetData.map((d, i) => (
                    <Cell key={i} fill={d.status === 'on-track' || d.status === 'completed' ? CHART_COLORS.green : d.status === 'at-risk' ? CHART_COLORS.amber : CHART_COLORS.red} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cross-Initiative KPI Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Cross-Initiative KPIs</h2>
          <p className="text-xs text-gray-500 mb-4">Key metrics across all programs</p>
          <div className="overflow-hidden rounded-lg border border-gray-200 max-h-[300px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0">
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-semibold text-gray-500 uppercase">Initiative</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-500 uppercase">KPI</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-500 uppercase">Target</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-500 uppercase">Actual</th>
                  <th className="text-center py-2 px-2 w-6" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allKpis.map((kpi, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="py-1.5 px-2 text-gray-600">{kpi.initiative}</td>
                    <td className="py-1.5 px-2 text-gray-700 font-medium">{kpi.label}</td>
                    <td className="py-1.5 px-2 text-right text-gray-500">{kpi.target}</td>
                    <td className="py-1.5 px-2 text-right font-semibold text-gray-900">{kpi.actual}</td>
                    <td className="py-1.5 px-2 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${kpi.status === 'good' ? 'bg-emerald-400' : kpi.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
