'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import PillarCard from './PillarCard';
import type { PillarData, PillarKPI } from './PillarCard';
import type { KPIConfig, StrategicConfig, StrategicInitiative } from '@/config/types';

interface StrategyExecutionRecord {
  id: number;
  companyId: number;
  pillar: string;
  kpiName: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  status: string;
  quarterLabel: string;
  commentary: string;
}

interface StoreRenovationRecord {
  id: number;
  companyId: number;
  renovationType: string;
  segment: string;
  storesComplete: number;
  storesInProgress: number;
  storesPlanned: number;
  totalTarget: number;
  completionPct: number;
  avgCost: number;
  avgRevenueUplift: number | null;
  avgThroughputImprovement: number | null;
  quarterLabel: string;
}

interface StrategyExecutionClientProps {
  kpis: KPIConfig;
  strategic: StrategicConfig;
  strategyExecution: StrategyExecutionRecord[];
  storeRenovations: StoreRenovationRecord[];
}

const PILLAR_ORDER = [
  'JPM Value Creation Framework',
  'Premium & Loyalty Compounding',
  'AI Cost Transformation',
  'Capital Allocation & Leverage',
  'Network & Fiber Build-Out',
];

const PILLAR_DISPLAY_NAMES: Record<string, string> = {
  'JPM Value Creation Framework': 'JPM Value Creation — ROIC 15%+ Path',
  'Premium & Loyalty Compounding': 'Premium & Loyalty Revenue Compounding',
  'AI Cost Transformation': 'AI Cost Transformation & Operational Efficiency',
  'Capital Allocation & Leverage': 'Capital Allocation & Balance Sheet Strength',
  'Network & Fiber Build-Out': 'Network & Fiber Scale-Up & Sustainability',
};

const PILLAR_SPARKLINES: Record<string, number[]> = {
  'JPM Value Creation Framework': [65, 68, 72, 75, 78, 82],
  'Premium & Loyalty Compounding': [52, 58, 64, 68, 74, 80],
  'AI Cost Transformation': [58, 62, 65, 68, 72, 75],
  'Capital Allocation & Leverage': [35, 42, 50, 58, 65, 72],
  'Network & Fiber Build-Out': [45, 52, 60, 66, 72, 78],
};

function computeOverallStatus(kpis: PillarKPI[]): 'on-track' | 'at-risk' | 'behind' | 'ahead' {
  if (!kpis.length) return 'on-track';
  const behindCount = kpis.filter(k => k.status === 'behind').length;
  const atRiskCount = kpis.filter(k => k.status === 'at-risk').length;
  const aheadCount = kpis.filter(k => k.status === 'ahead').length;
  if (behindCount >= 2) return 'behind';
  if (behindCount >= 1 || atRiskCount >= 2) return 'at-risk';
  if (aheadCount >= kpis.length / 2) return 'ahead';
  return 'on-track';
}

function computeOnTrackPercent(kpis: PillarKPI[]): number {
  if (!kpis.length) return 0;
  const onTrack = kpis.filter(k => k.status === 'on-track' || k.status === 'ahead').length;
  return Math.round((onTrack / kpis.length) * 100);
}

const statusIcons = {
  'on-track': { Icon: CheckCircle2, color: 'text-[#1c519c]', bg: 'bg-[#F0F0F0]' },
  'ahead': { Icon: TrendingUp, color: 'text-[#1c519c]', bg: 'bg-[#F0F0F0]' },
  'at-risk': { Icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-50' },
  'behind': { Icon: XCircle, color: 'text-red-700', bg: 'bg-red-50' },
  'completed': { Icon: CheckCircle2, color: 'text-[#1c519c]', bg: 'bg-[#F0F0F0]' },
};

export default function StrategyExecutionClient({
  kpis: _kpis,
  strategic,
  strategyExecution,
  storeRenovations: _storeRenovations,
}: StrategyExecutionClientProps) {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  // Build pillar data from DB records
  const pillars: PillarData[] = useMemo(() => {
    // Group strategy execution records by pillar
    const pillarMap = new Map<string, StrategyExecutionRecord[]>();
    for (const record of strategyExecution) {
      const existing = pillarMap.get(record.pillar) || [];
      existing.push(record);
      pillarMap.set(record.pillar, existing);
    }

    return PILLAR_ORDER.map(pillarName => {
      const records = pillarMap.get(pillarName) || [];
      const kpis: PillarKPI[] = records.map(r => ({
        kpiName: r.kpiName,
        baseline: r.baseline,
        current: r.current,
        target: r.target,
        unit: r.unit,
        status: r.status,
        commentary: r.commentary,
      }));

      // If no DB records, provide fallback KPIs
      if (kpis.length === 0) {
        return createFallbackPillar(pillarName);
      }

      const overallStatus = computeOverallStatus(kpis);
      const onTrackPercent = computeOnTrackPercent(kpis);
      const keyMetric = kpis[0];
      const keyMetricValue = keyMetric
        ? `${keyMetric.current}${keyMetric.unit === '%' ? '%' : keyMetric.unit === 'min' ? ' min' : keyMetric.unit === '$' ? '' : ''}`
        : '--';

      return {
        name: PILLAR_DISPLAY_NAMES[pillarName] || pillarName,
        overallStatus,
        kpis,
        onTrackPercent,
        keyMetricValue,
        sparkline: PILLAR_SPARKLINES[pillarName] || [50, 55, 60, 65, 70, 75],
      };
    });
  }, [strategyExecution]);

  // Aggregate stats
  const overallOnTrack = useMemo(() => {
    const totalKPIs = pillars.reduce((sum, p) => sum + p.kpis.length, 0);
    const onTrack = pillars.reduce((sum, p) => sum + p.kpis.filter(k => k.status === 'on-track' || k.status === 'ahead').length, 0);
    return totalKPIs > 0 ? Math.round((onTrack / totalKPIs) * 100) : 0;
  }, [pillars]);

  const pillarStatusCounts = useMemo(() => ({
    onTrack: pillars.filter(p => p.overallStatus === 'on-track' || p.overallStatus === 'ahead').length,
    atRisk: pillars.filter(p => p.overallStatus === 'at-risk').length,
    behind: pillars.filter(p => p.overallStatus === 'behind').length,
  }), [pillars]);

  // Strategic initiatives for timeline
  const initiatives: StrategicInitiative[] = useMemo(() => {
    if (strategic?.initiatives?.length) {
      return strategic.initiatives.slice(0, 8);
    }
    return [];
  }, [strategic]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/business-consoles" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-4 h-4 text-gray-500" />
            </Link>
            <Target className="w-6 h-6 text-[#1c519c]" />
            <div>
              <h1 className="text-2xl font-bold text-[#1c519c]">BD Finance360 Value Creation Strategy</h1>
              <p className="text-sm text-gray-500 mt-0.5">CEO Martin J. Lyons Jr.&apos;s value creation framework: Missouri rate base CAGR, ESA data center expansion, Illinois ROE recovery, FFO/debt discipline</p>
            </div>
          </div>

          {/* Overall Status Bar */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-[#F0F0F0]/30 rounded-lg p-4 border border-[#1c519c]/10">
              <p className="text-xs text-gray-500 mb-1">Overall KPI Achievement</p>
              <p className="text-2xl font-bold text-[#1c519c]">{overallOnTrack}%</p>
              <p className="text-xs text-gray-500 mt-1">{pillars.reduce((s, p) => s + p.kpis.length, 0)} KPIs tracked</p>
            </div>
            <div className="bg-[#F0F0F0]/30 rounded-lg p-4 border border-[#1c519c]/10">
              <p className="text-xs text-gray-500 mb-1">Pillars On Track</p>
              <p className="text-2xl font-bold text-[#1c519c]">{pillarStatusCounts.onTrack} / {pillars.length}</p>
              <div className="flex gap-1 mt-2">
                {pillars.map((p, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      p.overallStatus === 'on-track' || p.overallStatus === 'ahead' ? 'bg-[#1c519c]' :
                      p.overallStatus === 'at-risk' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100">
              <p className="text-xs text-gray-500 mb-1">At Risk</p>
              <p className="text-2xl font-bold text-amber-700">{pillarStatusCounts.atRisk}</p>
              <p className="text-xs text-gray-500 mt-1">pillars requiring attention</p>
            </div>
            <div className="bg-red-50/50 rounded-lg p-4 border border-red-100">
              <p className="text-xs text-gray-500 mb-1">Behind Schedule</p>
              <p className="text-2xl font-bold text-red-700">{pillarStatusCounts.behind}</p>
              <p className="text-xs text-gray-500 mt-1">pillars needing intervention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] mx-auto">
        {/* Pillar Cards Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#1c519c] mb-4">Strategy Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map((pillar) => (
              <PillarCard
                key={pillar.name}
                pillar={pillar}
                isExpanded={expandedPillar === pillar.name}
                onToggle={() => setExpandedPillar(expandedPillar === pillar.name ? null : pillar.name)}
              />
            ))}
          </div>
        </div>

        {/* Timeline View */}
        {initiatives.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-[#1c519c]" />
              <h2 className="text-lg font-bold text-[#1c519c]">Strategic Initiative Timeline</h2>
            </div>

            <div className="space-y-3">
              {initiatives.map((initiative, idx) => {
                const statusCfg = statusIcons[initiative.status as keyof typeof statusIcons] || statusIcons['on-track'];
                const StatusIcon = statusCfg.Icon;

                return (
                  <motion.div
                    key={initiative.id ?? idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    {/* Status Icon */}
                    <div className={`p-2 rounded-lg ${statusCfg.bg} flex-shrink-0`}>
                      <StatusIcon className={`w-4 h-4 ${statusCfg.color}`} />
                    </div>

                    {/* Initiative Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{initiative.name}</h4>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                          {initiative.status.replace('-', ' ')}
                        </span>
                      </div>
                      {initiative.description && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{initiative.description}</p>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                          <span>Progress</span>
                          <span className="font-medium">{initiative.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              initiative.status === 'on-track' || initiative.status === 'completed' ? 'bg-[#1c519c]' :
                              initiative.status === 'at-risk' ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${initiative.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right text-[10px] text-gray-500 w-16">
                        <p>${initiative.spent}M</p>
                        <p className="text-gray-400">of ${initiative.budget}M</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Fallback data when DB records are not available
// =============================================================================

function createFallbackPillar(pillarName: string): PillarData {
  const fallbacks: Record<string, PillarData> = {
    'JPM Value Creation Framework': {
      name: 'BD Value Creation — AOI Margin Recovery Path',
      overallStatus: 'on-track',
      onTrackPercent: 75,
      keyMetricValue: '5.1%',
      sparkline: [48, 52, 58, 62, 68, 75],
      kpis: [
        { kpiName: 'Adj. Operating Income Margin', baseline: 4.5, current: 5.1, target: 6.0, unit: '%', status: 'on-track', commentary: 'Q1 FY26 AOI margin 5.1% ($5.15B on $100.4B revenue). Long-term 6%+ target via Health100 SG&A savings and MA margin recovery to ~3%.' },
        { kpiName: 'After-tax ROIC', baseline: 7.5, current: 8.1, target: 10.0, unit: '%', status: 'on-track', commentary: 'ROIC improving; Health100 $2B cumulative savings + MA repricing 200-300bps + biosimilar program drive margin expansion through FY27.' },
        { kpiName: 'Annual Free Cash Flow', baseline: 7.5, current: 1.8, target: 9.5, unit: '$B', status: 'on-track', commentary: 'Q1 FY26 FCF ~$1.8B; FY2026 guidance CFO ≥$9.5B. Priority: debt reduction toward <4.0× net leverage, then dividend ($2.66/share), then selective buybacks.' },
        { kpiName: 'Adjusted Net Income ($B, TTM)', baseline: 8.0, current: 9.4, target: 11.0, unit: '$B', status: 'on-track', commentary: 'TTM Adj. Net Income tracking to $9.4B (midpoint $7.40 EPS × 1.27B shares). FY27 target $11B+ on Health100 + MA repricing delivery.' },
      ],
    },
    'Premium & Loyalty Compounding': {
      name: 'Integrated Health Growth Compounding',
      overallStatus: 'on-track',
      onTrackPercent: 80,
      keyMetricValue: '+18%',
      sparkline: [55, 60, 65, 70, 76, 82],
      kpis: [
        { kpiName: 'HCB Medical Benefit Ratio (%)', baseline: 86.5, current: 84.6, target: 83.0, unit: '% MBR', status: 'ahead', commentary: 'Q1 FY26 MA MBR 84.6% — improved vs. prior year FY25 peak as FY27 repricing cycles begin. Target: 82-83% by FY28. Each 100bps improvement ≈ +$1.42B HCB AOI / +$0.83 Adj. EPS.' },
        { kpiName: 'Caremark Specialty Rx Growth YoY (%)', baseline: 12.0, current: 18.0, target: 20.0, unit: '%', status: 'on-track', commentary: 'Q1 FY26 specialty Rx +18% YoY — GLP-1 volume +34% vs. +22% plan; Stelara biosimilar formulary exclusion targeting >85% conversion rate in H2 2026.' },
        { kpiName: 'PCW Same-Store Rx Growth (%)', baseline: 5.0, current: 7.0, target: 8.0, unit: '%', status: 'on-track', commentary: 'Q1 FY26 same-store Rx +7% YoY — Walgreens restructuring share capture and HealthHUB patient growth driving front-end market share gains across 9,000+ locations.' },
        { kpiName: 'Aetna Medical Membership (M)', baseline: 26.5, current: 26.0, target: 26.5, unit: 'M members', status: 'at-risk', commentary: 'Medical membership stable at 26.0M; ACA exits complete. MA growth in targeted geographies anticipated to offset commercial attrition. FY27 tied to AEP enrollment outcomes.' },
      ],
    },
    'AI Cost Transformation': {
      name: 'Health100 & Digital Transformation',
      overallStatus: 'on-track',
      onTrackPercent: 70,
      keyMetricValue: '$500M+',
      sparkline: [30, 38, 45, 52, 60, 68],
      kpis: [
        { kpiName: 'Health100 SG&A Savings ($B, cumulative)', baseline: 0, current: 0.5, target: 2.0, unit: '$B cumulative', status: 'on-track', commentary: 'Health100 program: $500M+ savings identified in FY25; $2B cumulative target by FY27. Workforce optimization and supply chain initiatives are leading contributors.' },
        { kpiName: 'Oak Street Health Clinics (count)', baseline: 169, current: 200, target: 220, unit: 'clinics', status: 'on-track', commentary: 'Oak Street at 200+ clinics (Q1 FY26). Value-based care model generating per-clinic economics above plan. MA patient retention 94% vs. industry ~78% benchmark.' },
        { kpiName: 'Biosimilar Adoption Rate (%)', baseline: 55.0, current: 65.0, target: 85.0, unit: '% conversion', status: 'at-risk', commentary: 'Caremark biosimilar adoption 65% vs. 85% target. Stelara formulary exclusion effective July 1, 2026. Humira >90% benchmark already achieved — Stelara playbook established.' },
        { kpiName: 'Health100 Member Adoption (%)', baseline: 0, current: 5, target: 15, unit: '% Aetna members enrolled', status: 'on-track', commentary: 'Health100 digital platform launched H2 2026 — targeting 15% Aetna member enrollment (~3.9M) by FY27. AI-driven care management showing 12% reduction in avoidable ER visits in pilots.' },
      ],
    },
    'Capital Allocation & Leverage': {
      name: 'Capital Allocation & Balance Sheet Strength',
      overallStatus: 'on-track',
      onTrackPercent: 75,
      keyMetricValue: '3.84×',
      sparkline: [28, 35, 42, 50, 58, 67],
      kpis: [
        { kpiName: 'Net Leverage Ratio (×)', baseline: 4.2, current: 3.84, target: 3.0, unit: '×', status: 'on-track', commentary: 'Q1 FY26 net leverage 3.84× (improved from ~4.2× FY25 peak). Target <4.0× to unlock buyback reinstatement; <3.0× by FY28. $70B LTD being amortized via ≥$9.5B CFO.' },
        { kpiName: 'Long-Term Debt ($B)', baseline: 72.0, current: 69.5, target: 60.0, unit: '$B', status: 'on-track', commentary: 'LTD $69.5B; steady reduction via disciplined free cash flow generation. Aetna acquisition debt on path to paydown. BBB investment-grade rating maintained (Moody\'s Baa2).' },
        { kpiName: 'Annual Dividend Per Share ($)', baseline: 2.66, current: 2.66, target: 2.66, unit: '$/share', status: 'on-track', commentary: '$2.66/share annual dividend maintained; buybacks suspended pending <4.0× net leverage milestone. Dividend coverage ratio 3.5× on Adj. Net Income basis.' },
        { kpiName: 'CFO Conversion (% of AOI)', baseline: 55.0, current: 61.0, target: 65.0, unit: '% CFO/AOI', status: 'on-track', commentary: 'CFO conversion improving as working capital normalizes post-Aetna integration. Target: 65% CFO/AOI ratio demonstrating high-quality earnings to cash conversion.' },
      ],
    },
    'Network & Fiber Build-Out': {
      name: 'CVS Pharmacy & Clinical Network Capacity',
      overallStatus: 'on-track',
      onTrackPercent: 78,
      keyMetricValue: '9,000+',
      sparkline: [48, 53, 60, 65, 72, 78],
      kpis: [
        { kpiName: 'Oak Street Health Revenue ($M, qtrly)', baseline: 600, current: 700, target: 900, unit: '$M qtrly', status: 'on-track', commentary: 'Oak Street generating $700M quarterly revenue with improving unit economics as 200+ clinic cohort matures. CMS ACO REACH participation driving shared savings above plan in FY26.' },
        { kpiName: 'MinuteClinic Visits (M, qtrly)', baseline: 4.0, current: 4.5, target: 5.0, unit: 'M visits', status: 'on-track', commentary: 'Q1 FY26 MinuteClinic 4.5M visits — PCW as the front door to CVS integrated care model. GLP-1 monitoring and chronic care management driving 22% incremental visit growth.' },
        { kpiName: 'HealthHUB Pharmacy Locations', baseline: 1200, current: 1500, target: 2000, unit: 'locations', status: 'on-track', commentary: 'HealthHUB expanded to 1,500+ locations — clinical health services (A1C, heart health, mental health screening) driving 22% higher revenue per location vs. standard pharmacy.' },
        { kpiName: 'Prescription Volume (B, annualized)', baseline: 1.70, current: 1.86, target: 2.00, unit: 'B Rx', status: 'on-track', commentary: 'Caremark annualized Rx volume 1.86B on track toward 2.0B target. New PBM client wins for FY26 benefit year + GLP-1 volume surge driving claim count growth ahead of plan.' },
      ],
    },
  };

  return fallbacks[pillarName] || {
    name: pillarName,
    overallStatus: 'on-track',
    onTrackPercent: 50,
    keyMetricValue: '--',
    sparkline: [50, 55, 60, 65, 70, 75],
    kpis: [],
  };
}
