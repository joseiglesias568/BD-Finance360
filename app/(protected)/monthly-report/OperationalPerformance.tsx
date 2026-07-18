'use client';

import { Building } from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { OperationsConfig, KPIConfig } from '@/config/types';
import { getStatusColorClasses } from '@/lib/engines/health-engine';
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_TOOLTIP_DARK, CHART_GRID_STYLE } from '@/lib/chart-theme';
import HeroKPICard from './components/HeroKPICard';
import CompactMetricTable from './components/CompactMetricTable';

interface OperationalPerformanceProps {
  periodLabel: string;
  operations: OperationsConfig;
  kpis: KPIConfig;
}

export default function OperationalPerformance({ periodLabel, operations, kpis }: OperationalPerformanceProps) {
  const operationalKPIs = kpis?.operationalKPIs ?? [];
  const digitalKPIs = kpis?.digitalKPIs ?? [];
  const locations = operations?.locations ?? [];
  const supplyChainMetrics = operations?.supplyChain ?? [];
  const peopleMetrics = operations?.peopleMetrics ?? [];
  const customerExperience = operations?.customerExperience ?? [];

  // Supply chain bar chart data
  const scBarData = supplyChainMetrics.map(m => ({
    name: String(m.label).length > 18 ? String(m.label).slice(0, 16) + '...' : String(m.label),
    actual: parseFloat(String(m.value)) || 0,
    target: parseFloat(String(m.target)) || 0,
    status: m.status,
  }));

  return (
    <div className="space-y-8">
      {/* Section A: Operational KPI Hero Cards */}
      {operationalKPIs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {operationalKPIs.slice(0, 4).map((kpi) => (
            <HeroKPICard
              key={kpi.label}
              title={kpi.label}
              value={`${kpi.value}${kpi.unit && !String(kpi.value).includes(kpi.unit) ? kpi.unit : ''}`}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
              status={kpi.status}
              detail={kpi.description}
            />
          ))}
        </div>
      )}

      {/* Section B: Facility Performance (heat-map style table) */}
      {locations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-1.5 bg-[#F0F0F0] rounded-lg">
              <Building className="w-4 h-4 text-[#003B2C]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Facility Performance</h2>
              <p className="text-xs text-gray-500">{operations?.totalLocations?.toLocaleString() ?? 0} total locations</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Facility</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Region</th>
                  {locations[0]?.metrics?.map((m, i) => (
                    <th key={i} className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase">{m.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {locations.map((loc) => (
                  <tr key={loc.name} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{loc.name}</td>
                    <td className="py-2.5 px-3 text-gray-600">{loc.type}</td>
                    <td className="py-2.5 px-3 text-gray-600">{loc.region}</td>
                    {loc.metrics.map((m, i) => {
                      const statusBg = m.status === 'good' ? 'bg-emerald-50 text-emerald-800' : m.status === 'warning' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800';
                      return (
                        <td key={i} className="py-2.5 px-3 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusBg}`}>
                            {m.value}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section C: Supply Chain + Digital (two-column) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supply Chain Health */}
        {scBarData.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-1">Supply Chain Health</h2>
            <p className="text-xs text-gray-500 mb-4">Actual vs target by metric</p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scBarData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
                  <XAxis type="number" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#374151' }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip {...CHART_TOOLTIP_DARK} />
                  <Bar dataKey="target" fill={CHART_COLORS.grayLight} radius={[0, 4, 4, 0]} barSize={10} />
                  <Bar dataKey="actual" radius={[0, 4, 4, 0]} barSize={10}>
                    {scBarData.map((d, i) => (
                      <Cell key={i} fill={d.status === 'good' ? CHART_COLORS.green : CHART_COLORS.amber} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Digital & Platform */}
        {digitalKPIs.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-1">Digital & Platform</h2>
            <p className="text-xs text-gray-500 mb-4">Client platform adoption and digital engagement</p>
            <div className="grid grid-cols-2 gap-3">
              {digitalKPIs.slice(0, 4).map((kpi) => (
                <div key={kpi.label} className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
                  <p className="text-xl font-bold text-[#003B2C]">
                    {kpi.value}{kpi.unit && !String(kpi.value).includes(kpi.unit) ? kpi.unit : ''}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    {kpi.target && <span className="text-[10px] text-gray-400">Target: {kpi.target}{kpi.unit && !String(kpi.target).includes(kpi.unit) ? kpi.unit : ''}</span>}
                    <span className={`w-2 h-2 rounded-full ${kpi.status === 'good' ? 'bg-emerald-400' : kpi.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section D: Customer Experience + People (two-column compact tables) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {customerExperience.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">Customer Experience</h2>
            <CompactMetricTable
              metrics={customerExperience.map(m => ({
                label: m.label,
                value: String(m.value),
                target: m.target ? String(m.target) : undefined,
                trend: m.trend,
                status: m.status,
              }))}
              className="bg-white"
            />
          </div>
        )}
        {peopleMetrics.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">People & Culture</h2>
            <CompactMetricTable
              metrics={peopleMetrics.map(m => ({
                label: m.label,
                value: String(m.value),
                target: m.target ? String(m.target) : undefined,
                trend: m.trend,
                status: m.status,
              }))}
              className="bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
