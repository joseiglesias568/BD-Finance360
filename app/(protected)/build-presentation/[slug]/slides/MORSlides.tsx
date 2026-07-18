'use client';

import React from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart,
  Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import WaterfallChart from './WaterfallChart';
import { TornadoChart, RangeSummary, AlertBanner, CalloutCard, StatusPill } from './SlideComponents';
import type { PlaceholderMap } from '@/lib/meetings-data';
import type { FullData } from '../MeetingViewer';
import { CHART_COLORS, CHART_AXIS_STYLE, CHART_TOOLTIP_DARK, CHART_GRID_STYLE, SEGMENT_COLORS } from '@/lib/chart-theme';

/* ═══════════════════════════════════════════════════
   SHARED: Slide data props — all slides receive
   the resolved placeholder map from the meeting data
   resolver.  `fullData` provides typed config
   objects for rich Recharts visualizations.
   ═══════════════════════════════════════════════════ */
interface SlideProps {
  data?: PlaceholderMap;
  fullData?: FullData;
}

/** Resolve a placeholder value or return the fallback */
function d(data: PlaceholderMap | undefined, key: string, fallback: string): string {
  if (!data) return fallback;
  const val = data[key];
  return (val !== undefined && val !== '') ? val : fallback;
}

/* ═══════════════════════════════════════════════════
   SHARED: Source metadata line
   ═══════════════════════════════════════════════════ */
function SourceLine({ text }: { text: string }) {
  return (
    <div className="mv-source-line">
      {text}
    </div>
  );
}

function KpiCard({ label, value, sub, kpi, trend, sparkData }: {
  label: string; value: string; sub: string;
  kpi?: string; trend?: 'up' | 'down' | 'flat';
  sparkData?: number[];
}) {
  return (
    <div className={`mv-card mv-kpi-card ${kpi || ''}`}>
      <div className="mv-kpi-label">{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="mv-kpi-value">{value}</div>
        {sparkData && sparkData.length > 1 && (
          <div style={{ width: 72, height: 28, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData.map((v, i) => ({ v, i }))} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <Area
                  dataKey="v" type="monotone"
                  stroke={trend === 'down' ? CHART_COLORS.red : CHART_COLORS.green}
                  fill={trend === 'down' ? '#FEE2E2' : CHART_COLORS.greenSoft}
                  strokeWidth={1.5} dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {trend ? (
        <div className={`mv-kpi-trend ${trend}`}>
          {trend === 'up' ? '\u25B2' : trend === 'down' ? '\u25BC' : '\u2014'} {sub}
        </div>
      ) : (
        <div className="mv-kpi-sub">{sub}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 0 — Executive Summary
   ═══════════════════════════════════════════════════ */
export function ExecSummarySlide({ data, fullData }: SlideProps) {
  const rev = d(data, 'consolidated_revenue', '$10.1B');
  const revYoY = d(data, 'consolidated_revenue_yoy', '+6.8%');
  const margin = d(data, 'operating_margin', '17.2%');
  const marginBps = d(data, 'operating_margin_bps_yoy', '+55 bps');
  const comp = d(data, 'organic_revenue_growth', '+13.4%');
  const members = d(data, 'aum', '$155B');
  const membersYoY = d(data, 'aum_yoy', '+12%');
  const mop = d(data, 'digital_platform_adoption', '72%');
  const naComp = d(data, 'americas_revenue_growth', '+7.1%');
  const netNew = d(data, 'new_client_wins', '42');
  const quarter = d(data, 'fiscal_quarter', 'Q2 FY26');

  // Sparkline data from quarterly history
  const quarters = fullData?.financials?.quarters ?? [];
  const revSpark = quarters.map(q => q.revenue);
  const marginSpark = quarters.map(q => q.operatingMargin);
  const compSpark = quarters.map(q => q.feeRevenueGrowth);

  return (
    <>
      <AlertBanner type="positive">
        {quarter} results tracking ahead of plan — revenue {revYoY} YoY, organic fee revenue growth {comp} globally, operating margin expanding {marginBps}
      </AlertBanner>

      <div className="mv-kpi-grid">
        <KpiCard label="Revenue" value={rev} sub={`${revYoY} YoY`} kpi="kpi-positive" trend="up" sparkData={revSpark} />
        <KpiCard label="Operating Margin" value={margin} sub={`${marginBps} YoY`} kpi="kpi-positive" trend="up" sparkData={marginSpark} />
        <KpiCard label="Fee Revenue Growth" value={comp} sub="Global" kpi="kpi-positive" trend="up" sparkData={compSpark} />
        <KpiCard label="AUM" value={members} sub={`${membersYoY} YoY`} kpi="kpi-positive" trend="up" />
      </div>

      {/* Quarterly Revenue Trend Chart */}
      {quarters.length > 1 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 4 }}>Quarterly Revenue Trend ($B)</div>
          <div style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={quarters} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} />
                <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} domain={['auto', 'auto']} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(v: number) => [`$${v.toFixed(1)}B`, 'Revenue']} />
                <Bar dataKey="revenue" fill={CHART_COLORS.greenSoft} radius={[4, 4, 0, 0]} barSize={24}>
                  {quarters.map((_, i) => (
                    <Cell key={i} fill={i === quarters.length - 1 ? CHART_COLORS.green : CHART_COLORS.greenSoft} />
                  ))}
                </Bar>
                <Line dataKey="operatingMargin" stroke={CHART_COLORS.amber} strokeWidth={2} dot={{ fill: CHART_COLORS.amber, r: 3, strokeWidth: 0 }} yAxisId={0} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mv-split-layout">
        <div className="mv-commentary">
          <h3>Key Highlights</h3>
          <div className="mv-commentary-bullet"><strong>Revenue growth of {revYoY}</strong> driven by Domestic Mainline Revenue growth of {naComp} and {netNew} acquisitions closed.</div>
          <div className="mv-commentary-bullet"><strong>Margin expansion of {marginBps}</strong> — outsourcing leverage and operational efficiencies offset compensation investments.</div>
          <div className="mv-commentary-bullet"><strong>Digital momentum</strong> — PropTech adoption at {mop} of managed portfolio; AUM up {membersYoY} to {members}.</div>
        </div>

        <div>
          <CalloutCard title="Finance2030 Transformation" type="positive">
            <strong>$45M Q2 savings</strong> — on track for $200M+ annualized by FY27.
          </CalloutCard>
          <div style={{ height: 6 }} />
          <CalloutCard title="EMEA Watch" type="negative">
            Fee revenue +1.5% — improving but below Americas. Macro headwinds persist.
          </CalloutCard>
        </div>
      </div>

      <SourceLine text={`Source: Delta Internal FP&A — ${quarter} Flash`} />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 1 — Revenue by Segment
   ═══════════════════════════════════════════════════ */
export function RevenueBySegmentSlide({ data, fullData }: SlideProps) {
  const rev = d(data, 'consolidated_revenue', '$9.8B');
  const revYoY = d(data, 'consolidated_revenue_yoy', '+4.2%');
  const naRev = d(data, 'na_revenue', '$7.2B');
  const naYoY = d(data, 'na_revenue_yoy', '+5.1%');
  const intlRev = d(data, 'intl_revenue', '$1.9B');
  const intlYoY = d(data, 'intl_revenue_yoy', '+2.8%');
  const chRev = d(data, 'channel_revenue', '$0.7B');
  const chYoY = d(data, 'channel_revenue_yoy', '-1.2%');
  const quarter = d(data, 'fiscal_quarter', 'Q2 FY26');

  const segments = fullData?.financials?.segments ?? [];
  const bridgeItems = fullData?.financials?.revenueBridge ?? [];

  return (
    <>
      {/* Segment Bar Chart */}
      {segments.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 4 }}>Revenue by Segment ($B)</div>
          <div style={{ height: 90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segments} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
                <XAxis type="number" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#374151', fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(v: number) => [`$${v.toFixed(1)}B`, 'Revenue']} />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={16}>
                  {segments.map((_, i) => (
                    <Cell key={i} fill={SEGMENT_COLORS[i] || CHART_COLORS.gray} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Revenue Bridge */}
      {bridgeItems.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 4 }}>Revenue Bridge — YoY Drivers ($M)</div>
          <div style={{ height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bridgeItems} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} />
                <XAxis dataKey="label" tick={{ fontSize: 8, fill: '#6B7280' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(v: number) => [`$${v}M`, 'Impact']} />
                <Bar dataKey="impact" radius={[4, 4, 0, 0]} barSize={20}>
                  {bridgeItems.map((item, i) => (
                    <Cell key={i} fill={item.impact >= 0 ? CHART_COLORS.green : CHART_COLORS.red} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <table className="mv-data-table">
        <thead>
          <tr>
            <th>Segment</th>
            <th>{quarter}</th>
            <th>Prior Year</th>
            <th>YoY Change</th>
            <th>% of Total</th>
            <th>vs. Budget</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Domestic Mainline Revenue</td>
            <td>{naRev}</td>
            <td>$6.8B</td>
            <td className="positive-cell">{naYoY}</td>
            <td>41.2%</td>
            <td className="positive-cell">+$120M</td>
          </tr>
          <tr>
            <td>Refinery &amp; Fuel Operations</td>
            <td>{intlRev}</td>
            <td>$1.85B</td>
            <td className="positive-cell">{intlYoY}</td>
            <td>32.6%</td>
            <td className="negative-cell">-$30M</td>
          </tr>
          <tr>
            <td>Cargo & Other Revenue</td>
            <td>{chRev}</td>
            <td>$0.71B</td>
            <td className="negative-cell">{chYoY}</td>
            <td>15.8%</td>
            <td>Flat</td>
          </tr>
          <tr className="total-row mv-highlight-row">
            <td>Total Consolidated</td>
            <td>{rev}</td>
            <td>$9.4B</td>
            <td className="positive-cell">{revYoY}</td>
            <td>100%</td>
            <td className="positive-cell">+$90M</td>
          </tr>
        </tbody>
      </table>

      <div className="mv-commentary" style={{ marginTop: 8 }}>
        <h3>Segment Commentary</h3>
        <div className="mv-commentary-bullet"><strong>Advisory ({naYoY}):</strong> Leasing volume {d(data, 'na_comp_sales', '+7.1%')}, capital markets rebounding. Office leasing +4.2%.</div>
        <div className="mv-commentary-bullet"><strong>Building Ops ({intlYoY}):</strong> FM sq ft managed growing steadily. EMEA/APAC expanding.</div>
        <div className="mv-commentary-bullet"><strong>RE Investments ({chYoY}):</strong> AUM growth slowing on valuation headwinds. Fundraising stable.</div>
      </div>

      <SourceLine text="Source: SAP BPC Consolidation · Unaudited" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 2 — Organic Revenue Growth
   ═══════════════════════════════════════════════════ */
export function OrganicGrowthSlide({ data, fullData }: SlideProps) {
  const comp = d(data, 'organic_revenue_growth', '+13.4%');
  const naComp = d(data, 'americas_revenue_growth', '+14.2%');
  const txn = d(data, 'transaction_growth', '+8.1%');
  const ticket = d(data, 'fee_rate_growth', '+5.3%');

  const quarters = fullData?.financials?.quarters ?? [];

  return (
    <>
      <div className="mv-kpi-grid">
        <KpiCard label="Global Fee Revenue" value={comp} sub={`${txn} volume, ${ticket} pricing`} kpi="kpi-positive" trend="up" sparkData={quarters.map(q => q.feeRevenueGrowth)} />
        <KpiCard label="Americas" value={naComp} sub="+4.2% volume, +2.9% rate" kpi="kpi-positive" trend="up" />
        <KpiCard label="EMEA" value="+3.2%" sub="UK strong, Continental recovering" kpi="kpi-watch" trend="flat" />
        <KpiCard label="APAC" value="+8.1%" sub="Strongest since Q1 FY25" kpi="kpi-positive" trend="up" />
      </div>

      {/* Quarterly Fee Revenue Trend Chart */}
      {quarters.length > 1 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 4 }}>Fee Revenue Growth Trend (%)</div>
          <div style={{ height: 110 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={quarters} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} />
                <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(v: number) => [`${v.toFixed(1)}%`, 'Organic Growth']} />
                <Bar dataKey="feeRevenueGrowth" radius={[4, 4, 0, 0]} barSize={24}>
                  {quarters.map((q, i) => (
                    <Cell key={i} fill={q.feeRevenueGrowth >= 0 ? CHART_COLORS.green : CHART_COLORS.red} />
                  ))}
                </Bar>
                <Line dataKey="feeRevenueGrowth" stroke={CHART_COLORS.greenDark} strokeWidth={2} dot={{ fill: CHART_COLORS.greenDark, r: 3, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mv-split-layout">
        <div>
          <table className="mv-data-table">
            <thead>
              <tr>
                <th>Service Line</th>
                <th>Growth %</th>
                <th>Volume %</th>
                <th>Rate %</th>
                <th>Mix of Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr className="mv-highlight-row">
                <td>Leasing</td>
                <td className="positive-cell">+8.2%</td>
                <td className="positive-cell">+5.5%</td>
                <td className="positive-cell">+2.7%</td>
                <td>35%</td>
              </tr>
              <tr>
                <td>Capital Markets</td>
                <td className="positive-cell">+4.8%</td>
                <td className="positive-cell">+3.1%</td>
                <td className="positive-cell">+1.7%</td>
                <td>28%</td>
              </tr>
              <tr>
                <td>Property Management</td>
                <td className="positive-cell">+6.1%</td>
                <td className="positive-cell">+4.2%</td>
                <td className="positive-cell">+1.9%</td>
                <td>22%</td>
              </tr>
              <tr>
                <td>Valuation &amp; Advisory</td>
                <td className="positive-cell">+3.5%</td>
                <td className="positive-cell">+2.0%</td>
                <td className="positive-cell">+1.5%</td>
                <td>15%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mv-commentary">
          <h3>Service Line Insights</h3>
          <div className="mv-commentary-item"><strong>Leasing dominance:</strong> Office return-to-office trends driving volume growth.</div>
          <div className="mv-commentary-item"><strong>Capital Markets recovery:</strong> Investment sales rebounding, +200 bps from Q1.</div>
          <div className="mv-commentary-item"><strong>Property Mgmt at 22% mix</strong> — recurring fee base providing stability.</div>
        </div>
      </div>

      <SourceLine text="Source: Delta Revenue Analytics — Organic revenue base" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 3 — Operating Margin Analysis
   ═══════════════════════════════════════════════════ */
export function OperatingMarginSlide({ data, fullData }: SlideProps) {
  const margin = d(data, 'operating_margin', '16.8%');
  const marginBps = d(data, 'operating_margin_bps_yoy', '+40 bps');
  const cogs = d(data, 'cogs_pct_revenue', '30.2%');
  const cogsBps = d(data, 'cogs_bps_yoy', '-50 bps');
  const ga = d(data, 'ga_pct_revenue', '6.2%');

  const quarters = fullData?.financials?.quarters ?? [];

  return (
    <>
      <div className="mv-kpi-grid">
        <KpiCard label="Operating Margin" value={margin} sub={`${marginBps} YoY`} kpi="kpi-positive" trend="up" sparkData={quarters.map(q => q.operatingMargin)} />
        <KpiCard label="Compensation Ratio" value="43.2%" sub="-30 bps (leverage)" kpi="kpi-positive" trend="up" />
        <KpiCard label="COGS" value={cogs} sub={`${cogsBps} (supply chain)`} kpi="kpi-positive" trend="up" />
        <KpiCard label="G&A % Revenue" value={ga} sub="-20 bps improvement" kpi="kpi-positive" trend="up" />
      </div>

      {/* Revenue + Margin Dual-Axis Chart */}
      {quarters.length > 1 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C' }}>Revenue ($B) &amp; Operating Margin (%)</div>
            <div style={{ display: 'flex', gap: 10, fontSize: 9, color: '#6B7280' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 8, height: 8, background: CHART_COLORS.greenSoft, borderRadius: 2, display: 'inline-block' }} /> Revenue</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 8, height: 2, background: CHART_COLORS.amber, display: 'inline-block' }} /> Margin</span>
            </div>
          </div>
          <div style={{ height: 110 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={quarters} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} />
                <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="rev" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} domain={['auto', 'auto']} />
                <YAxis yAxisId="margin" orientation="right" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={['auto', 'auto']} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(v: number, name: string) => name === 'revenue' ? [`$${v.toFixed(1)}B`, 'Revenue'] : [`${v.toFixed(1)}%`, 'Margin']} />
                <Bar yAxisId="rev" dataKey="revenue" fill={CHART_COLORS.greenSoft} radius={[4, 4, 0, 0]} barSize={24} />
                <Line yAxisId="margin" dataKey="operatingMargin" stroke={CHART_COLORS.amber} strokeWidth={2} dot={{ fill: CHART_COLORS.amber, r: 3, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <WaterfallChart
        data={[
          { label: 'Prior Year\nMargin', value: 16.4, type: 'total' },
          { label: 'Revenue\nLeverage', value: 0.30, type: 'positive' },
          { label: 'Outsourcing\nEfficiency', value: 0.25, type: 'positive' },
          { label: 'G&A\nDiscipline', value: 0.20, type: 'positive' },
          { label: 'Compensation\nInvestments', value: -0.15, type: 'negative' },
          { label: 'Segment Mix\n/ Other', value: -0.20, type: 'negative' },
          { label: 'Current Qtr\nMargin', value: 16.8, type: 'total' },
        ]}
        height={150}
        unit=""
        legend={[
          { label: 'Baseline / Result', type: 'total' },
          { label: 'Tailwind', type: 'positive' },
          { label: 'Headwind', type: 'negative' },
        ]}
        annotation={{
          text: `Net ${marginBps} YoY expansion — strongest in 5 quarters`,
          style: 'info',
        }}
      />

      <SourceLine text="Source: FP&A Margin Walk Analysis" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 4 — Digital Platform & PropTech
   ═══════════════════════════════════════════════════ */
export function PlatformDigitalSlide({ data, fullData }: SlideProps) {
  const members = d(data, 'platform_clients', '$155B');
  const membersYoY = d(data, 'platform_clients_yoy', '+12%');
  const mop = d(data, 'proptech_adoption_pct', '72%');

  // Digital KPIs from operations
  const digitalMetrics = fullData?.operations?.digitalMetrics ?? [];

  return (
    <>
      <div className="mv-kpi-grid">
        <KpiCard label="AUM Under Platform" value={members} sub={`${membersYoY} YoY`} kpi="kpi-positive" trend="up" />
        <KpiCard label="PropTech Adoption" value={mop} sub="of managed portfolio" kpi="kpi-positive" trend="up" />
        <KpiCard label="Digital Engagement" value="42%" sub="+3 pts YoY" kpi="kpi-positive" trend="up" />
        <KpiCard label="Platform Revenue Lift" value="+2.3%" sub="Incremental fee/client" kpi="kpi-positive" trend="up" />
      </div>

      {/* Digital Metrics Visual Cards */}
      {digitalMetrics.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 6 }}>Digital Platform KPIs</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {digitalMetrics.slice(0, 6).map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', background: '#f9fafb', borderRadius: 6, border: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: CHART_COLORS.green, minWidth: 48 }}>{m.value}</div>
                <div style={{ fontSize: 9, fontWeight: 500, color: '#374151', lineHeight: 1.3 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mv-split-layout">
        <div className="mv-commentary">
          <h3>Digital Performance</h3>
          <div className="mv-commentary-bullet"><strong>AUM growth</strong> — {members} under digital platform, strongest YoY in 6 quarters.</div>
          <div className="mv-commentary-bullet"><strong>AMI digital at {mop}</strong> of eligible customers. Expanding smart grid analytics capabilities.</div>
          <div className="mv-commentary-bullet"><strong>AI-powered insights</strong> +2.3% incremental fee/client. Next-gen analytics Q3.</div>
        </div>

        <div className="mv-commentary">
          <h3>Key Initiatives</h3>
          <table className="mv-data-table">
            <thead>
              <tr><th>Initiative</th><th>Timeline</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>CTS Data Center Platform Expansion</td><td>Q3 FY26</td><td><StatusPill status="On Track" /></td></tr>
              <tr><td>Digital Twin +500 Properties</td><td>Q3 FY26</td><td><StatusPill status="In Progress" /></td></tr>
              <tr><td>AI Valuation Platform</td><td>Q3 FY26</td><td><StatusPill status="On Track" /></td></tr>
              <tr><td>Client Portal Relaunch</td><td>Complete</td><td><StatusPill status="Favorable" /></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <SourceLine text="Source: BD Finance360 · AMI Digital Platform" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 5 — Portfolio Development Pipeline
   ═══════════════════════════════════════════════════ */
export function OfficeDevelopmentSlide({ data, fullData }: SlideProps) {
  const totalStores = d(data, 'total_office_count', '41,280');
  const netNew = d(data, 'net_new_mandates', '290');

  // Regional breakdown for chart
  const regions = fullData?.market?.regionalBreakdown ?? [];

  return (
    <>
      <div className="mv-kpi-grid">
        <KpiCard label="Global Offices" value={totalStores} sub={`+${netNew} acquisitions in Q2`} kpi="kpi-neutral" trend="up" />
        <KpiCard label="Americas" value="285" sub="+22 new locations" kpi="kpi-positive" trend="up" />
        <KpiCard label="EMEA/APAC" value="245" sub="+20 new locations" kpi="kpi-positive" trend="up" />
        <KpiCard label="Managed Sq Ft" value="7.2B" sub="vs. 7.5B FY target" kpi="kpi-watch" trend="flat" />
      </div>

      {/* Regional Revenue Chart */}
      {regions.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 4 }}>Regional Revenue Contribution ($B)</div>
          <div style={{ height: Math.min(130, Math.max(80, regions.length * 22)) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...regions].sort((a, b) => b.revenue - a.revenue)} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
                <XAxis type="number" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
                <YAxis type="category" dataKey="region" tick={{ fontSize: 9, fill: '#374151' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(v: any, _: any, props: any) => [`$${Number(v).toFixed(1)}B (${props?.payload?.growth >= 0 ? '+' : ''}${props?.payload?.growth}%)`, 'Revenue']} />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={12}>
                  {[...regions].sort((a, b) => b.revenue - a.revenue).map((r, i) => (
                    <Cell key={i} fill={r.growth >= 0 ? CHART_COLORS.green : CHART_COLORS.red} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mv-split-layout">
        <table className="mv-data-table">
          <thead>
            <tr>
              <th>Market</th>
              <th>Start</th>
              <th>Opened</th>
              <th>Closed</th>
              <th>Net New</th>
              <th>FY Target</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Americas Advisory</td>
              <td>185</td>
              <td>12</td>
              <td>-2</td>
              <td className="positive-cell">+10</td>
              <td>40</td>
            </tr>
            <tr>
              <td>Americas Building Ops</td>
              <td>100</td>
              <td>10</td>
              <td>-1</td>
              <td className="positive-cell">+9</td>
              <td>35</td>
            </tr>
            <tr>
              <td>EMEA</td>
              <td>130</td>
              <td>12</td>
              <td>-3</td>
              <td className="positive-cell">+9</td>
              <td>30</td>
            </tr>
            <tr>
              <td>APAC</td>
              <td>115</td>
              <td>15</td>
              <td>-1</td>
              <td className="positive-cell">+14</td>
              <td>45</td>
            </tr>
            <tr className="total-row mv-highlight-row">
              <td>Total Global</td>
              <td>530</td>
              <td>49</td>
              <td>-7</td>
              <td className="positive-cell">+{netNew}</td>
              <td>150</td>
            </tr>
          </tbody>
        </table>

        <div className="mv-commentary">
          <h3>Highlights</h3>
          <div className="mv-commentary-item"><strong>T&amp;T integration</strong> +6-8% fee revenue lift per office.</div>
          <div className="mv-commentary-item"><strong>Acquisition ROI</strong> 55% cash-on-cash vs. 50% target.</div>
          <div className="mv-commentary-item"><strong>Flex space expansion:</strong> Industrious co-working in 12 markets.</div>
        </div>
      </div>

      <SourceLine text="Source: Portfolio Development Pipeline System" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 6 — Supply Chain & COGS
   ═══════════════════════════════════════════════════ */
export function SupplyChainSlide({ data, fullData }: SlideProps) {
  const cogs = d(data, 'cogs_pct_revenue', '30.2%');
  const cogsBps = d(data, 'cogs_bps_yoy', '-50 bps');

  // Supply chain metrics for horizontal bar chart
  const scMetrics = fullData?.operations?.supplyChain ?? [];

  return (
    <>
      <div className="mv-kpi-grid">
        <KpiCard label="Cost of Services % Revenue" value={cogs} sub={`${cogsBps} YoY`} kpi="kpi-positive" trend="up" />
        <KpiCard label="Interest Rate Env." value="4.75%" sub="Fed Funds rate, stable" kpi="kpi-watch" trend="flat" />
        <KpiCard label="Platform Automation" value="2,500" sub="+15% efficiency" kpi="kpi-positive" trend="up" />
        <KpiCard label="SLA Compliance" value="98.2%" sub="vs. 97.5% target" kpi="kpi-positive" trend="up" />
      </div>

      <AlertBanner type="warning">
        FY27 compensation pressure: Professional talent retention costs rising 8-10% — market competition for senior advisors
      </AlertBanner>

      {/* Supply Chain Metrics Visual */}
      {scMetrics.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 6 }}>Supply Chain Scorecard</div>
          <div style={{ display: 'grid', gap: 4 }}>
            {scMetrics.map((m, i) => {
              const statusColor = m.status === 'good' ? CHART_COLORS.green : m.status === 'warning' ? CHART_COLORS.amber : CHART_COLORS.red;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', borderBottom: i < scMetrics.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 10, fontWeight: 500, color: '#374151' }}>{m.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', minWidth: 60, textAlign: 'right' }}>{m.value}</div>
                  <div style={{ fontSize: 9, color: '#6B7280', minWidth: 60, textAlign: 'right' }}>Tgt: {m.target}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: m.trend === 'up' ? CHART_COLORS.green : m.trend === 'down' ? CHART_COLORS.red : CHART_COLORS.gray }}>
                    {m.trend === 'up' ? '\u25B2' : m.trend === 'down' ? '\u25BC' : '\u2014'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <WaterfallChart
        data={[
          { label: 'Prior Year\nCOGS', value: 2.88, type: 'total' },
          { label: 'Volume\nGrowth', value: 0.12, type: 'negative' },
          { label: 'Compensation\nCosts', value: 0.04, type: 'negative' },
          { label: 'Outsourcing\nInflation', value: 0.06, type: 'negative' },
          { label: 'Shared Services\nSavings', value: -0.10, type: 'positive' },
          { label: 'Platform\nAutomation', value: -0.08, type: 'positive' },
          { label: 'Mix / Other', value: -0.03, type: 'positive' },
          { label: 'Current Qtr\nCOGS', value: 2.89, type: 'total' },
        ]}
        height={140}
        unit="$"
        legend={[
          { label: 'Baseline / Result', type: 'total' },
          { label: 'Cost Increase', type: 'negative' },
          { label: 'Savings', type: 'positive' },
        ]}
        annotation={{
          text: `COGS flat YoY in $ but ${cogsBps} as % of revenue — top-line growth`,
          style: 'info',
        }}
      />

      <div className="mv-commentary" style={{ marginTop: 8 }}>
        <h3>Supply Chain Update</h3>
        <div className="mv-commentary-bullet"><strong>Compensation:</strong> Average producer comp up 6% YoY. Retention programs effective in top quartile.</div>
        <div className="mv-commentary-bullet"><strong>Outsourcing:</strong> GCC costs up 8% YoY, offset by automation (now 18% of routine tasks).</div>
        <div className="mv-commentary-bullet"><strong>Platform automation:</strong> 2,500 processes automated, +15% efficiency. Target 5K by FY26 end.</div>
      </div>

      <SourceLine text="Source: Cost Analytics — Shared Services & Procurement" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 7 — Risks & Opportunities
   ═══════════════════════════════════════════════════ */
export function RisksOpportunitiesSlide({ data, fullData }: SlideProps) {
  const revForecast = d(data, 'revenue_forecast', '$38.8B');
  const annualRev = d(data, 'annual_revenue', '$38.4B');

  // Risk data for mini heat map
  const risks = fullData?.strategic?.risks ?? [];

  return (
    <>
      {/* Mini Risk Summary */}
      {risks.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C' }}>Risk Summary</div>
            {['high', 'medium', 'low'].map(sev => {
              const count = risks.filter(r => r.severity === sev).length;
              const color = sev === 'high' ? '#EF4444' : sev === 'medium' ? '#F59E0B' : '#10B981';
              return (
                <div key={sev} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: `${color}10`, borderRadius: 6, fontSize: 10, fontWeight: 600, color: '#374151', textTransform: 'capitalize' as const }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{count}</span>
                  {sev}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'grid', gap: 2 }}>
            {risks.filter(r => r.severity === 'high').slice(0, 3).map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#374151' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                <strong>{r.title}</strong> — {r.mitigation?.slice(0, 60)}
              </div>
            ))}
          </div>
        </div>
      )}

      <TornadoChart
        title="Key Risk & Opportunity Drivers — Revenue Impact ($B)"
        data={[
          { category: 'CRE Market Recovery', risk: 0.20, opportunity: 0.35, note: 'Macro dependent' },
          { category: 'Capital Markets Rebound', risk: 0.05, opportunity: 0.30, note: 'Rate stabilization' },
          { category: 'Industrious Integration', risk: 0.02, opportunity: 0.20, note: 'Flex space growth' },
          { category: 'Interest Rate Impact', risk: 0.18, opportunity: 0.08, note: 'Cap rate pressure' },
          { category: 'Talent Retention', risk: 0.12, opportunity: 0.03, note: 'Comp market pressure' },
          { category: 'Digital Transformation', risk: 0.03, opportunity: 0.40, note: 'Full deploy FY27' },
        ]}
      />

      <RangeSummary
        baselineLabel="FY Baseline"
        baselineValue={annualRev}
        resultLabel="Expected"
        resultValue={revForecast}
        low="$37.8B"
        high="$39.6B"
        fillLeft={12}
        fillRight={8}
      />

      <div className="mv-exec-panels" style={{ marginTop: 8 }}>
        <div className="mv-card mv-exec-panel mv-risk-panel">
          <h3>Key Risks</h3>
          <div className="mv-commentary-item" style={{ color: '#C62828' }}><strong>CRE downturn:</strong> $150-200M revenue risk</div>
          <div className="mv-commentary-item" style={{ color: '#C62828' }}><strong>Talent costs:</strong> -15 bps margin (key markets)</div>
          <div className="mv-commentary-item" style={{ color: '#C62828' }}><strong>Rate volatility:</strong> Cap rate uncertainty</div>
        </div>

        <div className="mv-card mv-exec-panel mv-opp-panel">
          <h3>Opportunities</h3>
          <div className="mv-commentary-item" style={{ color: '#0B8043' }}><strong>Capital markets rebound:</strong> +$300M potential</div>
          <div className="mv-commentary-item" style={{ color: '#0B8043' }}><strong>Industrious:</strong> Flex space scale, +$200M target</div>
          <div className="mv-commentary-item" style={{ color: '#0B8043' }}><strong>Digital platform:</strong> $400M+ productivity</div>
        </div>

        <div className="mv-card mv-exec-panel mv-mit-panel">
          <h3>Mitigations</h3>
          <div className="mv-commentary-item"><strong>CRE cycle:</strong> 3 scenarios, downside provisioned</div>
          <div className="mv-commentary-item"><strong>Diversification:</strong> Target 65% recurring revenue by Q4</div>
          <div className="mv-commentary-item"><strong>Cost program:</strong> $200M+ annual run-rate</div>
        </div>
      </div>

      <SourceLine text="Source: Enterprise Risk Management & FP&A Scenario Models" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 8 — Guidance vs. Consensus
   ═══════════════════════════════════════════════════ */
export function GuidanceConsensusSlide({ data, fullData }: SlideProps) {
  const revForecast = d(data, 'revenue_forecast', '$38.8B');
  const annualMargin = d(data, 'annual_operating_margin', '17.0%');
  const annualEPS = d(data, 'annual_eps', '$4.15-$4.25');

  const quarters = fullData?.financials?.quarters ?? [];
  const forwardOutlook = fullData?.strategic?.forwardOutlook ?? [];

  // Build forecast trajectory
  const trajectoryData = [
    ...quarters.map(q => ({
      period: q.quarter,
      revenue: q.revenue,
      margin: q.operatingMargin,
      type: 'actual' as const,
    })),
    ...forwardOutlook.map(f => ({
      period: f.period,
      revenue: f.revenueForcast,
      margin: f.marginForecast,
      type: 'forecast' as const,
    })),
  ];

  return (
    <>
      <AlertBanner type="info">
        Internal forecast across all key metrics above Street consensus — update planned at Q3 earnings call
      </AlertBanner>

      {/* Forecast Trajectory Chart */}
      {trajectoryData.length > 2 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C' }}>Revenue Trajectory — Actuals &amp; Forecast</div>
            <div style={{ display: 'flex', gap: 10, fontSize: 9, color: '#6B7280' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 8, height: 2, background: CHART_COLORS.green, display: 'inline-block' }} /> Revenue</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 8, height: 2, background: CHART_COLORS.amber, display: 'inline-block' }} /> Margin</span>
            </div>
          </div>
          <div style={{ height: 110 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trajectoryData} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} />
                <XAxis dataKey="period" tick={{ fontSize: 8, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="rev" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} domain={['auto', 'auto']} />
                <YAxis yAxisId="margin" orientation="right" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={['auto', 'auto']} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(v: number, name: string) => name === 'revenue' ? [`$${v.toFixed(1)}B`, 'Revenue'] : [`${v.toFixed(1)}%`, 'Margin']} />
                <Area yAxisId="rev" dataKey="revenue" fill={CHART_COLORS.greenSoft} stroke={CHART_COLORS.green} strokeWidth={2} fillOpacity={0.3} dot={{ fill: CHART_COLORS.green, r: 3, strokeWidth: 0 }} />
                <Line yAxisId="margin" dataKey="margin" stroke={CHART_COLORS.amber} strokeWidth={2} dot={{ fill: CHART_COLORS.amber, r: 3, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <table className="mv-data-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Internal Forecast</th>
            <th>Street Consensus</th>
            <th>Delta</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          <tr className="mv-highlight-row">
            <td>FY Revenue</td>
            <td>{revForecast}</td>
            <td>$38.4B</td>
            <td className="positive-cell">+$400M</td>
            <td><StatusPill status="Favorable" /></td>
          </tr>
          <tr>
            <td>Operating Margin</td>
            <td>{annualMargin}</td>
            <td>16.7%</td>
            <td className="positive-cell">+30 bps</td>
            <td><StatusPill status="Favorable" /></td>
          </tr>
          <tr className="mv-highlight-row">
            <td>EPS</td>
            <td>{annualEPS}</td>
            <td>$4.10</td>
            <td className="positive-cell">+$0.05-$0.15</td>
            <td><StatusPill status="Favorable" /></td>
          </tr>
          <tr>
            <td>Fee Revenue Growth</td>
            <td>+7-9%</td>
            <td>+6.2%</td>
            <td className="positive-cell">+80-280 bps</td>
            <td><StatusPill status="On Track" /></td>
          </tr>
          <tr>
            <td>AUM Growth</td>
            <td>$160B</td>
            <td>$155B</td>
            <td className="positive-cell">+$5B</td>
            <td><StatusPill status="Favorable" /></td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
        <CalloutCard title="Upside Driver" type="positive">
          Revenue +$400M vs. consensus — stronger Americas advisory + capital markets rebound. $2B buyback.
        </CalloutCard>
        <CalloutCard title="Swing Factor" type="negative">
          CRE cycle: bull +$200M, bear -$150M. Interest rate trajectory key uncertainty.
        </CalloutCard>
      </div>

      <div style={{ marginTop: 6 }} className="mv-commentary">
        <h3>Guidance Commentary</h3>
        <div className="mv-commentary-bullet"><strong>Revenue favorable</strong> — forecast {revForecast} above consensus on U.S. comps + growth.</div>
        <div className="mv-commentary-bullet"><strong>Updated guidance</strong> planned at Q3 earnings call.</div>
      </div>

      <SourceLine text="Source: FP&A Guidance Model vs. Bloomberg Consensus · Confidential" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE 9 — Decisions & Next Steps
   ═══════════════════════════════════════════════════ */
export function DecisionsNextStepsSlide({ data, fullData }: SlideProps) {
  // Strategic initiatives for progress bars
  const initiatives = fullData?.strategic?.initiatives ?? [];

  return (
    <>
      {/* Top Initiative Progress Bars */}
      {initiatives.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 6 }}>Strategic Initiative Progress</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {initiatives.slice(0, 3).map(init => {
              const statusColor = init.status === 'on-track' ? CHART_COLORS.green : init.status === 'at-risk' ? CHART_COLORS.red : CHART_COLORS.amber;
              return (
                <div key={init.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#003B2C' }}>{init.name}</div>
                    <div style={{ fontSize: 9, color: '#6B7280' }}>{init.progress}% · ${init.spent}M/${init.budget}M</div>
                  </div>
                  <div style={{ height: 5, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${init.progress}%`, background: statusColor, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mv-split-layout">
        <div>
          <AlertBanner type="warning">
            3 decisions required by April 10 — Fee pricing, Industrious acceleration, FY27 capital plan
          </AlertBanner>

          <div className="mv-commentary">
            <h3>Decisions Required</h3>
            <div className="mv-commentary-item"><strong>Fee Pricing:</strong> 2-3% increase in premium service tiers. <em>By Mar 25.</em></div>
            <div className="mv-commentary-item"><strong>Industrious:</strong> Raise FY26 flex space target to 500 locations (+$50M). <em>By Apr 1.</em></div>
            <div className="mv-commentary-item"><strong>FY27 Capital Plan:</strong> Extend acquisition pipeline to 65% coverage. <em>By Apr 10.</em></div>
          </div>

          <div className="mv-commentary" style={{ marginTop: 8 }}>
            <h3>Action Items</h3>
            <table className="mv-data-table">
              <thead><tr><th>Action</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>Q3 fee pricing by segment</td><td>Rev Mgmt</td><td>Mar 20</td><td><StatusPill status="On Track" /></td></tr>
                <tr><td>EMEA market deep-dive</td><td>Global Ops</td><td>Apr 5</td><td><StatusPill status="On Track" /></td></tr>
                <tr><td>Digital platform Q3 deployment</td><td>PropTech</td><td>Mar 28</td><td><StatusPill status="On Track" /></td></tr>
                <tr><td>Industrious integration plan</td><td>Strategy</td><td>Apr 12</td><td><StatusPill status="In Progress" /></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mv-commentary">
          <h3>Next Meeting — Apr 15</h3>
          <div className="mv-commentary-bullet">Q3 outlook &amp; pre-earnings guidance</div>
          <div className="mv-commentary-bullet">EMEA market deep-dive findings</div>
          <div className="mv-commentary-bullet">Capital markets recovery strategy approval</div>
          <div className="mv-commentary-bullet">FY27 preliminary budget assumptions</div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE: Title Slide
   ═══════════════════════════════════════════════════ */
export function TitleSlide({ data }: SlideProps) {
  const quarter = d(data, 'fiscal_quarter', 'Q2 FY26');
  return (
    <div className="mv-title-slide">
      <div className="mv-title-slide-logo">CVS</div>
      <div className="mv-title-slide-heading">Monthly Operating Review</div>
      <div className="mv-title-slide-quarter">{quarter} &middot; Becton, Dickinson and Company</div>
      <div className="mv-title-slide-divider" />
      <div className="mv-title-slide-desc">
        CFO review of P&amp;L performance, segment results, and key operating metrics across Health Care Benefits, Health Services, and Pharmacy &amp; Consumer Wellness segments.
      </div>
      <div className="mv-title-slide-footer-line">
        <span>Becton, Dickinson and Company — Confidential</span>
        <span>{quarter}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE: Revenue Overview (quarterly trend + P&L)
   ═══════════════════════════════════════════════════ */
export function RevenueOverviewSlide({ data, fullData }: SlideProps) {
  const rev = d(data, 'consolidated_revenue', '$9.8B');
  const revYoY = d(data, 'consolidated_revenue_yoy', '+4.2%');
  const quarter = d(data, 'fiscal_quarter', 'Q2 FY26');
  const quarters = fullData?.financials?.quarters ?? [];
  const pl = fullData?.financials?.plSummary;

  const plRows = pl ? [pl.revenue, pl.cogs, pl.grossProfit, pl.operatingExpenses, pl.operatingIncome, pl.netIncome] : [];

  return (
    <>
      <div className="mv-kpi-grid">
        <KpiCard label="Consolidated Revenue" value={rev} sub={`${revYoY} YoY`} kpi="kpi-positive" trend="up" sparkData={quarters.map(q => q.revenue)} />
        <KpiCard label="Operating Income" value={pl ? `$${(pl.operatingIncome.actual / 1000).toFixed(1)}B` : '$1.35B'} sub={pl ? `${pl.operatingIncome.variancePercent > 0 ? '+' : ''}${pl.operatingIncome.variancePercent}% vs Plan` : '+2.6% vs Plan'} kpi="kpi-positive" trend="up" />
        <KpiCard label="Net Income" value={pl ? `$${(pl.netIncome.actual / 1000).toFixed(1)}B` : '$0.88B'} sub={pl ? `${pl.netIncome.variancePercent > 0 ? '+' : ''}${pl.netIncome.variancePercent}% vs Plan` : '+1.7% vs Plan'} kpi="kpi-positive" trend="up" />
        <KpiCard label="EPS" value={quarters.length > 0 ? `$${quarters[quarters.length - 1].eps.toFixed(2)}` : '$0.12'} sub="Latest quarter" kpi="kpi-neutral" />
      </div>

      {quarters.length > 1 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 4 }}>Quarterly Revenue Trend ($B)</div>
          <div style={{ height: 90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quarters} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} />
                <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} domain={['auto', 'auto']} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(v: number) => [`$${v.toFixed(1)}B`, 'Revenue']} />
                <Area dataKey="revenue" type="monotone" stroke={CHART_COLORS.green} fill={CHART_COLORS.greenSoft} strokeWidth={2} dot={{ fill: CHART_COLORS.green, r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {plRows.length > 0 && (
        <table className="mv-data-table">
          <thead>
            <tr><th>P&amp;L Line</th><th>{quarter} Actual</th><th>Plan</th><th>Prior Year</th><th>Var $</th><th>Var %</th></tr>
          </thead>
          <tbody>
            {plRows.map((row, i) => (
              <tr key={row.label} className={i === 4 || i === 5 ? 'mv-highlight-row' : ''}>
                <td>{row.label}</td>
                <td>${(row.actual / 1000).toFixed(2)}B</td>
                <td>${(row.plan / 1000).toFixed(2)}B</td>
                <td>${(row.priorYear / 1000).toFixed(2)}B</td>
                <td className={row.variance >= 0 ? 'positive-cell' : 'negative-cell'}>{row.variance >= 0 ? '+' : ''}${row.variance}M</td>
                <td className={row.variancePercent >= 0 ? 'positive-cell' : 'negative-cell'}>{row.variancePercent >= 0 ? '+' : ''}{row.variancePercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <SourceLine text="Source: SAP BPC Consolidation · Unaudited" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE: Service Innovation & Pipeline
   ═══════════════════════════════════════════════════ */
export function ServiceInnovationSlide({ fullData }: SlideProps) {
  const industryKPIs = fullData?.operations?.industryKPIs ?? [];

  return (
    <>
      <div className="mv-kpi-grid">
        <KpiCard label="Leasing Volume" value="$42B" sub="+8pp YoY" kpi="kpi-positive" trend="up" />
        <KpiCard label="Cross-Sell Rate" value="34%" sub="vs 40% target" kpi="kpi-watch" trend="flat" />
        <KpiCard label="Project Pipeline" value="+14%" sub="Rev growth YoY" kpi="kpi-positive" trend="up" />
        <KpiCard label="Avg Fee/Engagement" value="$6.85M" sub="vs $7.00M target" kpi="kpi-watch" trend="flat" />
      </div>

      {industryKPIs.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 6 }}>Industry KPI Scorecard</div>
          <div style={{ display: 'grid', gap: 3 }}>
            {industryKPIs.map((kpi, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 70px', alignItems: 'center', padding: '3px 0', borderBottom: i < industryKPIs.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ fontSize: 10, fontWeight: 500, color: '#374151' }}>{kpi.label}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', textAlign: 'right' }}>{kpi.value}</div>
                <div style={{ fontSize: 9, color: '#6B7280', textAlign: 'right' }}>Tgt: {kpi.target ?? '—'}</div>
                <div style={{ fontSize: 9, color: '#8C95A6', textAlign: 'right' }}>Bench: {kpi.benchmark ?? '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mv-split-layout">
        <div className="mv-commentary">
          <h3>Service Highlights</h3>
          <div className="mv-commentary-bullet"><strong>Leasing volume $42B</strong> — office and industrial leading growth.</div>
          <div className="mv-commentary-bullet"><strong>Project pipeline</strong> +14% YoY. ESG retrofit services piloting in 12 markets.</div>
          <div className="mv-commentary-bullet"><strong>Cross-sell 34%</strong> vs. 40% target — integrated solutions program Q3.</div>
        </div>
        <div className="mv-commentary">
          <h3>Service Innovation Pipeline</h3>
          <table className="mv-data-table">
            <thead><tr><th>Service</th><th>Launch</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>ESG Advisory Suite</td><td>Launched</td><td><StatusPill status="Favorable" /></td></tr>
              <tr><td>AI-Powered Valuation</td><td>Q3 FY26</td><td><StatusPill status="In Progress" /></td></tr>
              <tr><td>Flex Space Analytics</td><td>Q3 FY26</td><td><StatusPill status="In Progress" /></td></tr>
              <tr><td>Digital Twin Platform</td><td>Launched</td><td><StatusPill status="Favorable" /></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <SourceLine text="Source: Delta Revenue Analytics · Revenue Segment Dashboard" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE: Customer Experience
   ═══════════════════════════════════════════════════ */
export function CustomerExperienceSlide({ fullData }: SlideProps) {
  const cxMetrics = fullData?.operations?.customerExperience ?? [];

  return (
    <>
      <div className="mv-kpi-grid">
        {cxMetrics.slice(0, 4).map((m, i) => {
          const status = m.status === 'good' ? 'kpi-positive' : m.status === 'warning' ? 'kpi-watch' : 'kpi-negative';
          return <KpiCard key={i} label={m.label} value={String(m.value)} sub={`Target: ${m.target ?? '—'}`} kpi={status} trend={m.trend} />;
        })}
      </div>

      {cxMetrics.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 6 }}>Customer Experience Scorecard</div>
          <div style={{ display: 'grid', gap: 4 }}>
            {cxMetrics.map((m, i) => {
              const statusColor = m.status === 'good' ? CHART_COLORS.green : m.status === 'warning' ? CHART_COLORS.amber : CHART_COLORS.red;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', borderBottom: i < cxMetrics.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 10, fontWeight: 500, color: '#374151' }}>{m.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#003B2C', minWidth: 60, textAlign: 'right' }}>{m.value}</div>
                  <div style={{ fontSize: 9, color: '#6B7280', minWidth: 70, textAlign: 'right' }}>Tgt: {m.target ?? '—'}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: m.trend === 'up' ? CHART_COLORS.green : m.trend === 'down' ? CHART_COLORS.red : CHART_COLORS.gray }}>
                    {m.trend === 'up' ? '\u25B2' : m.trend === 'down' ? '\u25BC' : '\u2014'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mv-commentary">
        <h3>CX Commentary</h3>
        <div className="mv-commentary-bullet"><strong>NPS at 62</strong> — improving, below 70 target. Advisory excellence program driving gains in key markets.</div>
        <div className="mv-commentary-bullet"><strong>Response time</strong> improving with digital platform. Target &lt;24hr within reach by Q4.</div>
        <div className="mv-commentary-bullet"><strong>SLA compliance 96.8%</strong> — AI-powered service monitoring pilot +1.5pp in test markets.</div>
      </div>

      <SourceLine text="Source: Customer Insights · NPS/CSAT Surveys · Property Operations" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE: People & Culture
   ═══════════════════════════════════════════════════ */
export function PeopleCultureSlide({ fullData }: SlideProps) {
  const people = fullData?.operations?.peopleMetrics ?? [];

  return (
    <>
      <div className="mv-kpi-grid">
        {people.slice(0, 4).map((m, i) => {
          const status = m.status === 'good' ? 'kpi-positive' : m.status === 'warning' ? 'kpi-watch' : 'kpi-negative';
          return <KpiCard key={i} label={m.label} value={String(m.value)} sub={`Target: ${m.target ?? '—'}`} kpi={status} trend={m.trend} />;
        })}
      </div>

      {people.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 6 }}>People &amp; Culture Scorecard</div>
          <div style={{ display: 'grid', gap: 4 }}>
            {people.map((m, i) => {
              const statusColor = m.status === 'good' ? CHART_COLORS.green : m.status === 'warning' ? CHART_COLORS.amber : CHART_COLORS.red;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', borderBottom: i < people.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 10, fontWeight: 500, color: '#374151' }}>{m.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#003B2C', minWidth: 50, textAlign: 'right' }}>{m.value}</div>
                  <div style={{ fontSize: 9, color: '#6B7280', minWidth: 70, textAlign: 'right' }}>Tgt: {m.target ?? '—'}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: m.trend === 'up' ? CHART_COLORS.green : m.trend === 'down' ? CHART_COLORS.red : CHART_COLORS.gray }}>
                    {m.trend === 'up' ? '\u25B2' : m.trend === 'down' ? '\u25BC' : '\u2014'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mv-commentary">
        <h3>Partner Update</h3>
        <div className="mv-commentary-bullet"><strong>Satisfaction 78%</strong> — up from 72% at FY25 start. Leadership development improving.</div>
        <div className="mv-commentary-bullet"><strong>Retention improving</strong> at 85% annual vs. ~78% industry avg.</div>
        <div className="mv-commentary-bullet"><strong>Internal promotion 22%</strong> — equity compensation and development programs driving engagement.</div>
      </div>

      <SourceLine text="Source: Human Resources · Partner Engagement Surveys" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE: Competitive Landscape
   ═══════════════════════════════════════════════════ */
export function CompetitiveLandscapeSlide({ fullData }: SlideProps) {
  const competitors = fullData?.market?.competitors ?? [];
  const deltaShare = fullData?.market?.companyMarketShare ?? 55.0;
  const totalMarket = fullData?.market?.totalMarketSize ?? '$340B';

  const chartData = [
    { name: 'Delta', share: deltaShare, fill: CHART_COLORS.green },
    ...competitors.map((c, i) => ({
      name: c.name,
      share: c.marketShare,
      fill: [CHART_COLORS.red, CHART_COLORS.blue, CHART_COLORS.amber, CHART_COLORS.purple, CHART_COLORS.teal][i] || CHART_COLORS.gray,
    })),
  ].sort((a, b) => b.share - a.share);

  return (
    <>
      <div className="mv-kpi-grid">
        <KpiCard label="US Airline Industry Revenue" value={totalMarket} sub="Airline industry +5.2% YoY" kpi="kpi-neutral" />
        <KpiCard label="Delta Pre-Tax Profit Share" value={`${deltaShare}%`} sub={`${(fullData?.market?.marketShareYoY ?? 0.3) >= 0 ? '+' : ''}${fullData?.market?.marketShareYoY ?? 0.3}pp YoY`} kpi="kpi-watch" trend="flat" />
        <KpiCard label="# Competitors Tracked" value={String(competitors.length)} sub="Key global players" kpi="kpi-neutral" />
        <KpiCard label="Share Target" value={`${fullData?.market?.marketShareTarget ?? 10.0}%`} sub="Medium-term goal" kpi="kpi-neutral" />
      </div>

      {chartData.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 4 }}>Market Share (%)</div>
          <div style={{ height: Math.min(120, Math.max(80, chartData.length * 20)) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
                <XAxis type="number" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#374151', fontWeight: 500 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(v: number) => [`${v.toFixed(1)}%`, 'Share']} />
                <Bar dataKey="share" radius={[0, 4, 4, 0]} barSize={14}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {competitors.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {competitors.slice(0, 3).map(c => (
            <div key={c.name} className="mv-card" style={{ padding: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: CHART_COLORS.green }}>{c.marketShare}%</div>
              <div style={{ fontSize: 9, color: c.yoyChange >= 0 ? CHART_COLORS.green : CHART_COLORS.red, fontWeight: 600 }}>{c.yoyChange >= 0 ? '+' : ''}{c.yoyChange}pp YoY</div>
              <div style={{ fontSize: 9, color: '#6B7280', marginTop: 2, lineHeight: 1.3 }}>{c.strengths.slice(0, 2).join(' · ')}</div>
            </div>
          ))}
        </div>
      )}

      <SourceLine text="Source: Euromonitor · Company Filings · Internal Analysis" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE: International Deep-Dive
   ═══════════════════════════════════════════════════ */
export function InternationalDeepDiveSlide({ fullData }: SlideProps) {
  const regions = fullData?.market?.regionalBreakdown ?? [];

  return (
    <>
      {regions.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 4 }}>Regional Revenue ($B) &amp; Growth</div>
          <div style={{ height: Math.min(120, Math.max(80, regions.length * 20)) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...regions].sort((a, b) => b.revenue - a.revenue)} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} vertical />
                <XAxis type="number" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} />
                <YAxis type="category" dataKey="region" tick={{ fontSize: 9, fill: '#374151' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip {...CHART_TOOLTIP_DARK} formatter={(v: number) => [`$${v.toFixed(1)}B`, 'Revenue']} />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={12}>
                  {[...regions].sort((a, b) => b.revenue - a.revenue).map((r, i) => (
                    <Cell key={i} fill={r.growth >= 0 ? CHART_COLORS.green : CHART_COLORS.red} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {regions.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {regions.map(r => (
            <div key={r.region} className="mv-card" style={{ padding: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#003B2C' }}>{r.region}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: CHART_COLORS.green }}>${r.revenue.toFixed(1)}B</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: r.growth >= 0 ? CHART_COLORS.green : CHART_COLORS.red }}>
                  {r.growth >= 0 ? '+' : ''}{r.growth}%
                </div>
              </div>
              <div style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.3 }}>{r.keyInsight.slice(0, 70)}{r.keyInsight.length > 70 ? '...' : ''}</div>
            </div>
          ))}
        </div>
      )}

      <SourceLine text="Source: International Segment Reporting · Licensed Partner Reports" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE: Strategic Initiatives Tracker
   ═══════════════════════════════════════════════════ */
export function StrategicTrackerSlide({ fullData }: SlideProps) {
  const initiatives = fullData?.strategic?.initiatives ?? [];
  const totalBudget = initiatives.reduce((s, i) => s + i.budget, 0);
  const totalSpent = initiatives.reduce((s, i) => s + i.spent, 0);

  return (
    <>
      <div className="mv-kpi-grid">
        <KpiCard label="Active Initiatives" value={String(initiatives.length)} sub="Under Finance2030" kpi="kpi-neutral" />
        <KpiCard label="Total Program Budget" value={`$${(totalBudget / 1000).toFixed(1)}B`} sub={`$${totalSpent}M deployed`} kpi="kpi-neutral" />
        <KpiCard label="On Track" value={String(initiatives.filter(i => i.status === 'on-track' || i.status === 'completed').length)} sub="of total initiatives" kpi="kpi-positive" />
        <KpiCard label="At Risk" value={String(initiatives.filter(i => i.status === 'at-risk' || i.status === 'behind').length)} sub="Needs attention" kpi={initiatives.some(i => i.status === 'at-risk') ? 'kpi-watch' : 'kpi-positive'} />
      </div>

      {initiatives.length > 0 && (
        <div className="mv-card" style={{ padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#003B2C', marginBottom: 6 }}>Initiative Progress</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {initiatives.map(init => {
              const statusColor = init.status === 'on-track' ? CHART_COLORS.green : init.status === 'completed' ? CHART_COLORS.green : init.status === 'at-risk' ? CHART_COLORS.red : CHART_COLORS.amber;
              return (
                <div key={init.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#003B2C' }}>{init.name}</div>
                      <StatusPill status={init.status === 'on-track' ? 'On Track' : init.status === 'completed' ? 'Favorable' : init.status === 'at-risk' ? 'At Risk' : 'Watch'} />
                    </div>
                    <div style={{ fontSize: 9, color: '#6B7280' }}>{init.progress}% · ${init.spent}M/${init.budget}M</div>
                  </div>
                  <div style={{ height: 5, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${init.progress}%`, background: statusColor, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <SourceLine text="Source: Strategy Office · Initiative PMO Dashboard" />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE: Appendix / Q&A
   ═══════════════════════════════════════════════════ */
export function AppendixSlide() {
  const links = [
    { label: 'Executive Summary', href: '/executive-summary' },
    { label: 'Monthly Report', href: '/monthly-report' },
    { label: 'Business Consoles', href: '/business-consoles' },
    { label: 'Scenario Modeling', href: '/scenario-modeling' },
    { label: 'AI Agents', href: '/ai-agents' },
    { label: 'Report Hub', href: '/report-hub' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 16 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#003B2C' }}>Appendix &amp; Q&amp;A</div>
      <div style={{ fontSize: 12, color: '#5F6B7A', maxWidth: 440 }}>
        Explore deeper analytics and insights across the Delta Finance360 platform.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4, width: '100%', maxWidth: 480 }}>
        {links.map(l => (
          <div key={l.label} className="mv-card" style={{ padding: '10px 12px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#003B2C' }}>{l.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#8C95A6', marginTop: 4 }}>
        Becton, Dickinson and Company &middot; Confidential &middot; For internal use only
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SLIDE MAP — maps slide IDs to components
   All components accept optional `data` and `fullData`
   props containing resolved placeholder values and
   typed config objects for Recharts visualizations.
   ═══════════════════════════════════════════════════ */
export const MOR_SLIDE_COMPONENTS: Record<string, React.ComponentType<SlideProps>> = {
  'mor-title': TitleSlide,
  'mor-exec': ExecSummarySlide,
  'mor-revenue': RevenueOverviewSlide,
  'mor-segments': RevenueBySegmentSlide,
  'mor-comps': OrganicGrowthSlide,
  'mor-margin': OperatingMarginSlide,
  'mor-digital': PlatformDigitalSlide,
  'mor-stores': OfficeDevelopmentSlide,
  'mor-menu': ServiceInnovationSlide,
  'mor-supply': SupplyChainSlide,
  'mor-cx': CustomerExperienceSlide,
  'mor-people': PeopleCultureSlide,
  'mor-compete': CompetitiveLandscapeSlide,
  'mor-intl': InternationalDeepDiveSlide,
  'mor-risks': RisksOpportunitiesSlide,
  'mor-strategy': StrategicTrackerSlide,
  'mor-outlook': GuidanceConsensusSlide,
  'mor-actions': DecisionsNextStepsSlide,
  'mor-appendix': AppendixSlide,
};
