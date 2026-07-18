'use client';

import { useCallback, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import ConsoleShell from '@/components/console/ConsoleShell';
import OverviewTab from '@/components/console/tabs/OverviewTab';
import DriversTab from '@/components/console/tabs/DriversTab';
import BridgeTab from '@/components/console/tabs/BridgeTab';
import DataTab from '@/components/console/tabs/DataTab';
import type { HeroKPI } from '@/components/console/shared/HeroKPIStrip';
import type { DriverNode } from '@/components/console/shared/DriverTreeNav';
import type { DriverDetailData } from '@/components/console/shared/DriverDetail';
import type { PulseInsight, DriverMatrixRow, BridgeCommentary, ConsoleConfig } from '@/components/console/types';
import type { PerformanceSummary } from '@/components/console/tabs/OverviewTab';
import type { DBConsole } from '@/lib/db/repositories/consoles';

interface Props {
  console: DBConsole;
  consoleid: string;
}

// ─── Config builder ────────────────────────────────────────────────────────────

function buildConfig(con: DBConsole, id: string): ConsoleConfig {
  return {
    id,
    title: con.title,
    subtitle: con.objective,
    icon: TrendingUp,
    segment: id,
    heroKPIs: [],
    primaryFilters: [
      {
        id: 'geography',
        label: 'Segment',
        type: 'pills',
        options: [
          { value: 'All Network', label: 'All Segments' },
          { value: 'Consumer', label: 'Consumer' },
          { value: 'Business', label: 'Business' },
        ],
        defaultValue: 'All Network',
      },
      {
        id: 'period',
        label: 'Period',
        type: 'pills',
        options: [
          { value: 'D', label: 'Daily' },
          { value: 'M', label: 'Monthly' },
          { value: 'Q', label: 'Quarterly' },
        ],
        defaultValue: 'Q',
      },
      {
        id: 'comparison',
        label: 'Compare',
        type: 'select',
        options: [
          { value: 'YoY', label: 'vs Last Year' },
          { value: 'QoQ', label: 'vs Last Quarter' },
          { value: 'Plan', label: 'vs Plan' },
          { value: 'Budget', label: 'vs Budget' },
        ],
        defaultValue: 'YoY',
      },
    ],
    secondaryFilters: [
      {
        id: 'segment',
        label: 'Product Segment',
        type: 'select',
        options: [
          { value: 'All', label: 'All Products' },
          { value: 'IET', label: 'Missouri Electric & Gas' },
          { value: 'Illinois Electric & Gas', label: 'Illinois Electric & Gas' },
          { value: 'GTE', label: 'Gas Technology Equipment' },
          { value: 'CTS', label: 'Climate Technology Solutions' },
          { value: 'Chart', label: 'Illinois Grid Modernization Program' },
        ],
        defaultValue: 'All',
      },
      {
        id: 'geography',
        label: 'Geography',
        type: 'select',
        options: [
          { value: 'All', label: 'All Regions' },
          { value: 'NA', label: 'North America' },
          { value: 'ME', label: 'Middle East & Africa' },
          { value: 'EU', label: 'Europe / Russia / Caspian' },
          { value: 'APAC', label: 'Asia Pacific' },
          { value: 'LatAm', label: 'Latin America' },
        ],
        defaultValue: 'All',
      },
      {
        id: 'planTier',
        label: 'Contract Type',
        type: 'select',
        options: [
          { value: 'All', label: 'All Contracts' },
          { value: 'LTSA', label: 'Long-Term Service (LTSA)' },
          { value: 'Spot', label: 'Spot / Project' },
          { value: 'Digital', label: 'Digital Subscription' },
          { value: 'Integrated', label: 'Integrated Services' },
        ],
        defaultValue: 'All',
      },
      {
        id: 'valueView',
        label: 'View',
        type: 'pills',
        options: [
          { value: 'Total $', label: 'Total $' },
          { value: 'Per Unit', label: 'Per Sub' },
        ],
        defaultValue: 'Total $',
      },
    ],
  };
}

// ─── Data builders ─────────────────────────────────────────────────────────────

function buildHeroKPIs(con: DBConsole): HeroKPI[] {
  const kpis: HeroKPI[] = [];
  for (const driver of con.keyDrivers) {
    for (const m of driver.metrics) {
      if (!m.currentValue) continue;
      const dir = m.direction === 'higher' ? 'up' : m.direction === 'lower' ? 'down' : 'flat';
      const change = m.variancePercent ?? 0;
      kpis.push({
        id: `${driver.name}-${m.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        label: m.name,
        value: m.currentValue,
        change: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        changeDirection: dir,
        sparkline: generateSparkline(change),
        target: m.target || undefined,
        gap: m.target ? gapFromMetric(m.currentValue, m.target) : undefined,
        status: dir === 'up' ? 'good' : dir === 'down' ? 'critical' : 'warning',
        driversTabId: driver.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        aiInsight: `${m.name} is currently ${m.currentValue}, ${dir === 'up' ? 'tracking ahead of' : dir === 'down' ? 'below' : 'in line with'} the ${m.target || 'target'}.`,
      });
      if (kpis.length >= 4) break;
    }
    if (kpis.length >= 4) break;
  }
  // Pad with driver-level placeholders if fewer than 4 metrics available
  for (const driver of con.keyDrivers) {
    if (kpis.length >= 4) break;
    const already = kpis.find(k => k.label === driver.name);
    if (!already) {
      kpis.push({
        id: driver.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        label: driver.name,
        value: '—',
        change: '—',
        changeDirection: 'flat',
        sparkline: [50, 52, 51, 53, 54, 53, 55],
        status: 'warning',
        driversTabId: driver.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
    }
  }
  return kpis.slice(0, 4);
}

function generateSparkline(trend: number): number[] {
  const base = 50;
  return [base, base + trend * 0.1, base + trend * 0.2, base + trend * 0.35,
          base + trend * 0.5, base + trend * 0.7, base + trend];
}

// ─── Value parsing helpers ────────────────────────────────────────────────────

type ValueSuffix = 'B' | 'M' | 'K' | '%' | 'mo' | 'flat';

function parseMetricNum(val: string): { num: number; suffix: ValueSuffix } {
  if (!val || val === '—') return { num: 0, suffix: 'flat' };
  const cleaned = val.replace(/~|,|\s/g, '');
  // Handle ranges like "700K–800K" → midpoint
  const rangeParts = cleaned.split(/[–-](?=[0-9])/);
  const base = rangeParts.length === 2
    ? (parseFloat(rangeParts[0].replace(/[^0-9.]/g, '')) + parseFloat(rangeParts[1].replace(/[^0-9.]/g, ''))) / 2
    : NaN;
  const sign = cleaned.startsWith('-') ? -1 : 1;
  const numStr = rangeParts.length === 2 ? base.toString() : cleaned.replace(/[^0-9.]/g, '');
  const num = (rangeParts.length === 2 ? base : parseFloat(numStr)) * (rangeParts.length === 2 ? 1 : sign);
  if (/B/i.test(cleaned)) return { num, suffix: 'B' };
  if (/\/mo/i.test(cleaned)) return { num, suffix: 'mo' };
  if (/M(?!o)/i.test(cleaned)) return { num, suffix: 'M' };
  if (/K/i.test(cleaned)) return { num, suffix: 'K' };
  if (/%/.test(cleaned)) return { num, suffix: '%' };
  return { num: isNaN(num) ? 0 : num, suffix: 'flat' };
}

// Convert a current→target delta into a quarterly $M variance.
// Conservative estimates calibrated to BD scale (Q1 FY26 ~$2.2B quarterly revenue).
function computeImpactM(cur: string, tgt: string, direction: string): number {
  const c = parseMetricNum(cur);
  const t = parseMetricNum(tgt);
  if (c.suffix !== t.suffix && c.suffix !== 'flat' && t.suffix !== 'flat') return 0;
  const suffix = c.suffix !== 'flat' ? c.suffix : t.suffix;
  // delta = current − target; positive means beat (for 'higher'), negative means missed
  let delta = c.num - t.num;
  // For 'lower-is-better' metrics (churn, opex), flip sign so positive = favorable
  if (direction === 'lower') delta = -delta;

  switch (suffix) {
    case 'B': return Math.round(delta * 1000);          // $B → $M direct
    case 'M': return Math.round(delta);                  // already $M
    // Per unit (BD ESA contract ~$280M/GW AEE scale proxy)
    // Simplified: K units × $4.2 → $M quarterly
    case 'K': return Math.round(delta * 4.2);
    // % growth on ~$2.2B AEE quarterly revenue base → 1pp ≈ $22M quarterly
    case '%': return Math.round(delta * 22);
    // ESA contract value change: average ESA contract ~$280M/GW
    case 'mo': return Math.round(delta * 28.5);
    default: return 0;
  }
}

// Compute variance % between current and target (sign-adjusted for direction).
function computeVariancePct(cur: string, tgt: string, direction: string): number {
  const c = parseMetricNum(cur);
  const t = parseMetricNum(tgt);
  if (t.num === 0 || isNaN(t.num) || isNaN(c.num)) return 0;
  const raw = ((c.num - t.num) / Math.abs(t.num)) * 100;
  return direction === 'lower' ? -raw : raw;
}

function gapFromMetric(current: string, target: string, direction = 'higher'): string {
  const pct = computeVariancePct(current, target, direction);
  if (pct === 0) return '—';
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
}

function buildPulseInsights(con: DBConsole): PulseInsight[] {
  const insights: PulseInsight[] = [];
  const atRiskDrivers = con.keyDrivers.filter(d => d.metrics.some(m => m.direction === 'lower'));
  const onTrackDrivers = con.keyDrivers.filter(d => d.metrics.every(m => m.direction !== 'lower'));

  if (atRiskDrivers.length > 0) {
    const d = atRiskDrivers[0];
    const m = d.metrics.find(m => m.direction === 'lower');
    insights.push({
      id: 'at-risk-1',
      severity: 'warning',
      headline: `${d.name} is below target — action may be required`,
      detail: m ? `${m.name} at ${m.currentValue} vs target of ${m.target}. This driver is impacting overall console health.` : `${d.name} performance is tracking below expectations based on latest data.`,
      action: 'View Driver Analysis',
      actionTab: 'drivers',
    });
  }

  if (onTrackDrivers.length > 0) {
    const d = onTrackDrivers[0];
    const m = d.metrics[0];
    insights.push({
      id: 'positive-1',
      severity: 'positive',
      headline: `${d.name} performing ahead of expectations`,
      detail: m ? `${m.name} at ${m.currentValue} vs target of ${m.target}. Continued momentum here creates strategic optionality for the quarter.` : `${d.name} is showing positive trajectory and tracking ahead of plan.`,
      action: 'Explore Details',
      actionTab: 'drivers',
    });
  }

  if (con.keyDrivers.length > 2) {
    const d = con.keyDrivers[2];
    insights.push({
      id: 'info-1',
      severity: 'info',
      headline: `${d.name} — monitor for Q2 FY26 trend continuation`,
      detail: `${d.name} represents a key strategic lever for ${con.title}. Sub-drivers include: ${d.subDrivers.slice(0, 3).join(', ')}.`,
      action: 'View Trend Data',
      actionTab: 'data',
    });
  }

  return insights;
}

function buildDriverMatrix(con: DBConsole): DriverMatrixRow[] {
  return con.keyDrivers.map((driver, idx) => {
    const m = driver.metrics[0];
    const change = m?.variancePercent ?? 0;
    const trendDir: 'up' | 'down' | 'flat' = m?.direction === 'higher' ? 'up' : m?.direction === 'lower' ? 'down' : 'flat';
    const score = trendDir === 'up' ? Math.min(95, 65 + Math.abs(change) * 2) : trendDir === 'down' ? Math.max(35, 65 - Math.abs(change) * 3) : 60;
    const gap = m ? gapFromMetric(m.currentValue, m.target) : '—';
    return {
      id: `driver-${idx}-${driver.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: driver.name,
      score: Math.round(score),
      trend: m ? `${change >= 0 ? '+' : ''}${change.toFixed(1)}%` : '—',
      trendDirection: trendDir,
      gap: gap !== '—' ? `${parseFloat(gap) >= 0 ? '+' : ''}${gap}pp` : '—',
      status: trendDir === 'up' ? 'good' : trendDir === 'down' ? 'critical' : 'warning',
      subDrivers: driver.subDrivers.slice(0, 3),
    };
  });
}

function buildDriverTree(con: DBConsole): DriverNode[] {
  return con.keyDrivers.map((driver, idx) => {
    const m = driver.metrics[0];
    const status: 'good' | 'warning' | 'critical' = m?.direction === 'higher' ? 'good' : m?.direction === 'lower' ? 'critical' : 'warning';
    return {
      id: `driver-${idx}-${driver.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: driver.name,
      value: m?.currentValue || '—',
      status,
      children: driver.subDrivers.map((sd, si) => ({
        id: `subdriver-${idx}-${si}`,
        name: sd,
        value: '—',
        status: 'warning' as const,
      })),
    };
  });
}

function buildDriverDetailMap(con: DBConsole): Record<string, DriverDetailData> {
  const map: Record<string, DriverDetailData> = {};
  const quarters = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25'];

  con.keyDrivers.forEach((driver, idx) => {
    const m = driver.metrics[0];
    const change = m?.variancePercent ?? 0;
    const trendDir = m?.direction === 'higher' ? 'up' : m?.direction === 'lower' ? 'down' : 'flat';
    const cur = m?.currentValue || '—';
    const tgt = m?.target || '—';
    const driverId = `driver-${idx}-${driver.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const trendData = quarters.map((q, qi) => ({
      period: q,
      actual: parseFloat(cur.replace(/[^0-9.-]/g, '')) * (0.85 + qi * 0.05) || (50 + qi * 3),
      target: parseFloat(tgt.replace(/[^0-9.-]/g, '')) || 55,
    }));

    map[driverId] = {
      id: driverId,
      name: driver.name,
      description: `${driver.name} is a key performance driver for ${con.title}. Monitors ${driver.subDrivers.slice(0, 3).join(', ')}.`,
      value: cur,
      target: tgt,
      gap: gapFromMetric(cur, tgt),
      trend: trendDir as 'up' | 'down' | 'flat',
      trendValue: `${change >= 0 ? '+' : ''}${change.toFixed(1)}% YoY`,
      status: trendDir === 'up' ? 'good' : trendDir === 'down' ? 'critical' : 'warning',
      trendData,
      subDrivers: driver.subDrivers.slice(0, 5).map((sd, si) => ({
        name: sd,
        contribution: (change / (driver.subDrivers.length || 1)) * (1 - si * 0.15),
        unit: '%',
      })),
      variance: { actual: cur, plan: tgt, priorYear: '—' },
      aiInsight: `${driver.name} is ${trendDir === 'up' ? 'performing above target' : trendDir === 'down' ? 'below target and requires attention' : 'tracking in line with expectations'}. Key sub-drivers include ${driver.subDrivers.slice(0, 2).join(' and ')}.`,
    };

    // Also register sub-driver entries
    driver.subDrivers.forEach((sd, si) => {
      const sdId = `subdriver-${idx}-${si}`;
      map[sdId] = {
        id: sdId,
        name: sd,
        description: `Sub-driver of ${driver.name}`,
        value: '—',
        target: '—',
        gap: '—',
        trend: 'flat',
        trendValue: '—',
        status: 'warning',
        trendData: quarters.map((q, qi) => ({ period: q, actual: 50 + qi * 2, target: 55 })),
        subDrivers: [],
        variance: { actual: '—', plan: '—', priorYear: '—' },
        aiInsight: `${sd} is a component of the ${driver.name} driver. Detailed metrics will appear as data is loaded.`,
      };
    });
  });

  return map;
}

function buildAttentionItems(con: DBConsole) {
  return con.keyDrivers
    .filter(d => d.metrics.some(m => m.direction === 'lower'))
    .slice(0, 3)
    .map((d, i) => {
      const m = d.metrics.find(mm => mm.direction === 'lower')!;
      return {
        id: `attn-${i}`,
        severity: 'warning' as const,
        title: `${m?.name || d.name} below target`,
        detail: m ? `${m.name} at ${m.currentValue} vs target ${m.target}. ${d.subDrivers.length > 0 ? `Sub-drivers: ${d.subDrivers.slice(0, 2).join(', ')}.` : ''}` : `${d.name} requires attention.`,
        actionTab: 'drivers',
      };
    });
}

function buildPerformanceSummary(con: DBConsole): PerformanceSummary {
  const atRisk = con.keyDrivers.filter(d => d.metrics.some(m => m.direction === 'lower'));
  const onTrack = con.keyDrivers.filter(d => d.metrics.every(m => m.direction !== 'lower'));
  const overallStatus: 'good' | 'warning' | 'critical' =
    atRisk.length === 0 ? 'good' : atRisk.length > con.keyDrivers.length / 2 ? 'critical' : 'warning';

  return {
    title: `${con.title} — Performance Summary`,
    period: 'Q1 FY26',
    summary: `${con.title} is ${overallStatus === 'good' ? 'tracking well across all key drivers' : overallStatus === 'critical' ? 'facing headwinds across multiple drivers that require attention' : 'showing mixed performance with some areas requiring focus'}. ${con.objective}\n\n${onTrack.length > 0 ? `Strong performance in ${onTrack.slice(0, 2).map(d => d.name).join(' and ')}.` : ''} ${atRisk.length > 0 ? `Areas needing attention include ${atRisk.slice(0, 2).map(d => d.name).join(' and ')}.` : ''}`,
    keyTakeaways: [
      ...onTrack.slice(0, 3).map(d => {
        const m = d.metrics[0];
        return m ? `${d.name}: ${m.name} at ${m.currentValue} vs target ${m.target}` : `${d.name} tracking on plan`;
      }),
      ...atRisk.slice(0, 2).map(d => {
        const m = d.metrics.find(mm => mm.direction === 'lower');
        return m ? `${d.name}: ${m.name} at ${m.currentValue} — below target of ${m.target}` : `${d.name} below expectations`;
      }),
    ].slice(0, 5),
    overallStatus,
  };
}

function buildBridgeItems(con: DBConsole): BridgeCommentary[] {
  // Use all sub-driver metrics (more granular and more likely to have real values)
  const items: BridgeCommentary[] = [];

  con.keyDrivers.slice(0, 6).forEach((driver, i) => {
    // Aggregate impact across all metrics in this driver
    const totalImpact = driver.metrics.reduce((sum, m) => {
      return sum + computeImpactM(m.currentValue, m.target, m.direction);
    }, 0);

    const primaryMetric = driver.metrics[0];
    const pct = totalImpact !== 0
      ? `${totalImpact >= 0 ? '+' : ''}${(Math.abs(totalImpact) / 33490 * 100).toFixed(2)}%`
      : '—';

    const dirLabel = totalImpact >= 0 ? 'favorable' : 'unfavorable';
    const absM = Math.abs(totalImpact);

    items.push({
      id: `bridge-${i}`,
      component: driver.name,
      value: totalImpact,
      percentImpact: pct,
      aiSuggestion: primaryMetric
        ? `${driver.name} had a ${dirLabel} variance of $${absM}M vs plan. ${primaryMetric.name} at ${primaryMetric.currentValue} vs target ${primaryMetric.target}${driver.metrics.length > 1 ? ` across ${driver.metrics.length} tracked metrics` : ''}.`
        : `${driver.name} variance requires further data to quantify precisely.`,
      status: (totalImpact > 0 ? 'approved' : totalImpact < 0 ? 'submitted' : 'draft') as BridgeCommentary['status'],
      subItems: driver.metrics.slice(0, 3).map((m) => {
        const subImpact = computeImpactM(m.currentValue, m.target, m.direction);
        return {
          name: m.name,
          value: subImpact,
          description: `${m.currentValue} actual vs ${m.target} target`,
        };
      }),
    });
  });

  return items;
}

// Format a parsed numeric value back to a display string
function formatMetricDisplay(num: number, suffix: ValueSuffix, originalVal: string): string {
  if (suffix === 'B') return `$${num.toFixed(2)}B`;
  if (suffix === 'M' && originalVal.includes('$')) return `$${Math.round(num).toLocaleString()}M`;
  if (suffix === 'M') return `${num.toFixed(1)}M`;
  if (suffix === 'K') return `${num >= 0 ? '+' : ''}${Math.round(num)}K`;
  if (suffix === '%') return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  if (suffix === 'mo') return `$${num.toFixed(0)}/mo`;
  return `${num.toFixed(1)}`;
}

function buildDataTabPayload(con: DBConsole) {
  const quarterLabels = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26'];
  // Conservative quarterly growth factors (index 4 = current Q1 FY26 = 1.0)
  const growthFactors = [0.908, 0.931, 0.955, 0.979, 1.0];

  const plData = [
    {
      label: 'Key Performance Drivers', isCategory: true,
      children: con.keyDrivers.map(d => {
        const m = d.metrics[0];
        const parsed = m ? parseMetricNum(m.currentValue) : { num: 0, suffix: 'flat' as ValueSuffix };
        const tParsed = m ? parseMetricNum(m.target) : { num: 0, suffix: 'flat' as ValueSuffix };
        const varPct = m ? computeVariancePct(m.currentValue, m.target, m.direction) : 0;
        const varColor: 'green' | 'red' | 'neutral' = varPct > 0.5 ? 'green' : varPct < -0.5 ? 'red' : 'neutral';

        return {
          label: d.name,
          quarters: quarterLabels.map((_, qi) => {
            const isCurrentQ = qi === 4;
            const factor = growthFactors[qi];
            const histVal = isNaN(parsed.num) ? 0 : parsed.num * factor;
            const displayVal = formatMetricDisplay(histVal, parsed.suffix as ValueSuffix, m?.currentValue || '');

            return {
              actual: isCurrentQ ? (m?.currentValue || '—') : displayVal,
              variance: isCurrentQ
                ? (varPct !== 0 ? `${varPct >= 0 ? '+' : ''}${varPct.toFixed(1)}%` : '—')
                : '—',
              varianceColor: isCurrentQ ? varColor : 'neutral' as const,
            };
          }),
        };
      }),
      quarters: quarterLabels.map(() => ({ actual: '—', variance: '—', varianceColor: 'neutral' as const })),
    },
  ];

  const driverData = [
    {
      category: 'Performance vs Plan — Q1 FY26',
      rows: con.keyDrivers.flatMap(d =>
        d.metrics.map(m => {
          const varPct = computeVariancePct(m.currentValue, m.target, m.direction);
          const varColor: 'green' | 'red' | 'neutral' = varPct > 0.5 ? 'green' : varPct < -0.5 ? 'red' : 'neutral';
          const trendDir = varPct > 0 ? 'up' : varPct < 0 ? 'down' : 'flat';
          return {
            driver: m.name,
            actual: m.currentValue,
            plan: m.target,
            variance: varPct !== 0 ? `${varPct >= 0 ? '+' : ''}${varPct.toFixed(1)}%` : '—',
            varianceColor: varColor,
            trend: trendDir as 'up' | 'down' | 'flat',
          };
        })
      ),
    },
  ];

  return { quarterLabels, plData, driverData };
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ConsoleDetailClient({ console: con, consoleid }: Props) {
  const config = useMemo(() => buildConfig(con, consoleid), [con, consoleid]);
  const heroKPIs = useMemo(() => buildHeroKPIs(con), [con]);
  const insights = useMemo(() => buildPulseInsights(con), [con]);
  const driverMatrix = useMemo(() => buildDriverMatrix(con), [con]);
  const driverTree = useMemo(() => buildDriverTree(con), [con]);
  const driverDetailMap = useMemo(() => buildDriverDetailMap(con), [con]);
  const attentionItems = useMemo(() => buildAttentionItems(con), [con]);
  const performanceSummary = useMemo(() => buildPerformanceSummary(con), [con]);
  const bridgeItems = useMemo(() => buildBridgeItems(con), [con]);
  const { quarterLabels, plData, driverData } = useMemo(() => buildDataTabPayload(con), [con]);

  const totalVariance = bridgeItems.reduce((s, b) => s + b.value, 0);
  const getDriverDetail = useCallback((id: string): DriverDetailData | null => driverDetailMap[id] ?? null, [driverDetailMap]);

  return (
    <ConsoleShell config={config}>
      {({ activeTab, setActiveTab, selectedDriverId, setSelectedDriverId }) => {
        if (activeTab === 'overview') {
          return (
            <OverviewTab
              heroKPIs={heroKPIs}
              insights={insights}
              drivers={driverMatrix}
              attentionItems={attentionItems}
              performanceSummary={performanceSummary}
              onNavigateToDrivers={(id) => { setSelectedDriverId(id); setActiveTab('drivers'); }}
              onNavigateToTab={setActiveTab}
            />
          );
        }
        if (activeTab === 'drivers') {
          return (
            <DriversTab
              driverTree={driverTree}
              selectedDriverId={selectedDriverId}
              onSelectDriver={setSelectedDriverId}
              getDriverDetail={getDriverDetail}
            />
          );
        }
        if (activeTab === 'bridge') {
          return (
            <BridgeTab
              title={`${con.title} — Variance Analysis`}
              periodLabel="Q1 FY26 vs Q1 FY25"
              totalVariance={totalVariance >= 0 ? `+${Math.round(totalVariance)}` : `${Math.round(totalVariance)}`}
              totalVariancePercent={`${totalVariance >= 0 ? '+' : ''}${(totalVariance / 33490 * 100).toFixed(2)}%`}
              items={bridgeItems}
              consoleSlug={consoleid}
            />
          );
        }
        if (activeTab === 'data') {
          return (
            <DataTab
              quarterLabels={quarterLabels}
              plData={plData}
              driverData={driverData}
              consoleSlug={consoleid}
            />
          );
        }
        return null;
      }}
    </ConsoleShell>
  );
}
