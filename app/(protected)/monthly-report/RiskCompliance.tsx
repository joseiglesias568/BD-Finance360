'use client';

import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { StrategicConfig, MarketConfig } from '@/config/types';
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_TOOLTIP_DARK, CHART_GRID_STYLE } from '@/lib/chart-theme';
import RiskHeatMap from './components/RiskHeatMap';

interface RiskComplianceProps {
  periodLabel: string;
  strategic: StrategicConfig;
  market: MarketConfig;
}

export default function RiskCompliance({ periodLabel, strategic, market }: RiskComplianceProps) {
  const risks = strategic?.risks ?? [];
  const competitors = market?.competitors ?? [];
  const marketChallenges = market?.marketChallenges ?? [];
  const marketDrivers = market?.marketDrivers ?? [];
  const regionalBreakdown = market?.regionalBreakdown ?? [];

  const highRisks = risks.filter(r => r.severity === 'high');
  const mediumRisks = risks.filter(r => r.severity === 'medium');
  const overallRating = highRisks.length >= 3 ? 'High' : highRisks.length >= 1 ? 'Medium' : 'Low';
  const ratingColor = overallRating === 'High' ? 'text-red-600' : overallRating === 'Medium' ? 'text-amber-600' : 'text-emerald-600';

  // Sort competitors by market share descending for chart, include BD
  const companyEntry = {
    name: 'BD',
    share: market?.companyMarketShare ?? 0,
    yoy: market?.marketShareYoY ?? 0,
    isCompany: true,
  };
  const competitorData = [
    companyEntry,
    ...competitors.map(c => ({
      name: c.name,
      share: c.marketShare,
      yoy: c.yoyChange,
      isCompany: false,
    })),
  ].sort((a, b) => b.share - a.share);

  // Sort regions by revenue descending for chart
  const regionalData = [...regionalBreakdown]
    .sort((a, b) => b.revenue - a.revenue)
    .map(r => ({
      name: r.region,
      revenue: r.revenue,
      growth: r.growth,
      insight: r.keyInsight,
    }));

  return (
    <div className="space-y-8">
      {/* Section A: Risk Profile Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Risk Rating</p>
          <p className={`text-2xl font-bold ${ratingColor}`}>{overallRating}</p>
          <p className="text-[10px] text-gray-400">{risks.length} risk areas identified</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">High Severity</p>
          <p className="text-2xl font-bold text-red-600">{highRisks.length}</p>
          <p className="text-[10px] text-gray-400">Requiring immediate attention</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Medium Severity</p>
          <p className="text-2xl font-bold text-amber-600">{mediumRisks.length}</p>
          <p className="text-[10px] text-gray-400">Active monitoring</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Market Share</p>
          <p className="text-2xl font-bold text-[#003B2C]">{market?.companyMarketShare?.toFixed(1) ?? 0}%</p>
          <p className="text-[10px] text-gray-400">
            Target: {market?.marketShareTarget?.toFixed(1) ?? 0}% | YoY: {(market?.marketShareYoY ?? 0) >= 0 ? '+' : ''}{market?.marketShareYoY?.toFixed(1) ?? 0}%
          </p>
        </div>
      </div>

      {/* Section B: Risk Heat Map */}
      {risks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Risk Assessment Matrix</h2>
          <p className="text-xs text-gray-500 mb-4">Click a risk to view details and mitigation strategy</p>
          <RiskHeatMap risks={risks} />
        </div>
      )}

      {/* Section C: Competitive Landscape Chart */}
      {competitorData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Competitive Landscape</h2>
          <p className="text-xs text-gray-500 mb-4">Market share by competitor — {market?.totalMarketSize ?? 'N/A'} total market</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitorData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
                <XAxis
                  type="number"
                  tick={CHART_AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip
                  {...CHART_TOOLTIP_DARK}
                  formatter={(value: any, _name: any, props: any) => {
                    const yoy = props?.payload?.yoy ?? 0;
                    return [`${Number(value).toFixed(1)}% (YoY: ${yoy >= 0 ? '+' : ''}${yoy.toFixed(1)}%)`, 'Market Share'];
                  }}
                />
                <Bar dataKey="share" radius={[0, 4, 4, 0]} barSize={14}>
                  {competitorData.map((d, i) => (
                    <Cell key={i} fill={d.isCompany ? CHART_COLORS.green : CHART_COLORS.grayLight} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Section D: Regional Performance Chart */}
      {regionalData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Regional Performance</h2>
          <p className="text-xs text-gray-500 mb-4">Revenue by region ($B) with YoY growth</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
                <XAxis
                  type="number"
                  tick={CHART_AXIS_STYLE}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `$${v}B`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#374151' }}
                  axisLine={false}
                  tickLine={false}
                  width={130}
                />
                <Tooltip
                  {...CHART_TOOLTIP_DARK}
                  formatter={(value: any, _name: any, props: any) => {
                    const g = props?.payload?.growth ?? 0;
                    return [`$${Number(value).toFixed(1)}B (${g >= 0 ? '+' : ''}${g.toFixed(1)}%)`, 'Revenue'];
                  }}
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={14}>
                  {regionalData.map((d, i) => (
                    <Cell key={i} fill={d.growth >= 0 ? CHART_COLORS.green : CHART_COLORS.red} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Key insights below chart */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
            {regionalData.slice(0, 6).map(r => (
              <div key={r.name} className="text-[10px] text-gray-500">
                <span className="font-semibold text-gray-700">{r.name}:</span> {r.insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section E: Market Drivers & Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {marketChallenges.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">Market Challenges</h2>
            <div className="space-y-2">
              {marketChallenges.map((challenge, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{challenge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {marketDrivers.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">Market Drivers</h2>
            <div className="space-y-2">
              {marketDrivers.map((driver, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
