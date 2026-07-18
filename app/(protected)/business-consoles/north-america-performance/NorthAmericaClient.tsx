'use client';

import { useCallback, useMemo } from 'react';
import ConsoleShell from '@/components/console/ConsoleShell';
import OverviewTab from '@/components/console/tabs/OverviewTab';
import DriversTab from '@/components/console/tabs/DriversTab';
import BridgeTab from '@/components/console/tabs/BridgeTab';
import DataTab from '@/components/console/tabs/DataTab';
import type { HeroKPI } from '@/components/console/shared/HeroKPIStrip';
import type { DriverNode } from '@/components/console/shared/DriverTreeNav';
import type { DriverDetailData } from '@/components/console/shared/DriverDetail';
import type { PulseInsight, DriverMatrixRow, BridgeCommentary } from '@/components/console/types';
import type { ConsolePageData } from './types';
import { northAmericaConfig } from './config';

interface NorthAmericaClientProps {
  data: ConsolePageData;
}

// =============================================================================
// Data Mappers — BD: Health Care Benefits (HCB / Aetna)
// SOURCE: BD Q1 FY26 Earnings (May 2026), FY2025 10-K, FY2026 Guidance
// =============================================================================

function buildHeroKPIs(data: ConsolePageData): HeroKPI[] {
  const { financials } = data;
  const revenueQtrData = financials.quarters.map((q) => q.revenue);
  const marginQtrData = financials.quarters.map((q) => q.operatingMargin);

  return [
    {
      id: 'revenue', label: 'HCB Revenue',
      value: `$${financials.latestQuarter.revenue}B`,
      change: `${financials.latestQuarter.revenueYoY >= 0 ? '+' : ''}${financials.latestQuarter.revenueYoY}%`,
      changeDirection: financials.latestQuarter.revenueYoY >= 0 ? 'up' : 'down',
      sparkline: revenueQtrData,
      target: '≥$144B FY26 annualized',
      gap: `${financials.latestQuarter.revenueYoY >= 0 ? '+' : ''}${financials.latestQuarter.revenueYoY}% YoY`,
      status: financials.latestQuarter.revenueYoY >= 3 ? 'good' : financials.latestQuarter.revenueYoY >= 0 ? 'warning' : 'critical',
      subDrivers: [
        { name: 'Medicare Advantage Premium', impact: '+5.2%', direction: 'positive' as const },
        { name: 'Commercial Group Premium', impact: '+3.8%', direction: 'positive' as const },
        { name: 'Membership Headwind', impact: '-0.4%', direction: 'negative' as const },
      ],
      aiInsight: `HCB revenue of $${financials.latestQuarter.revenue}B in Q1 FY26, up ${financials.latestQuarter.revenueYoY}% YoY. Medicare Advantage premium rate increases (+8–9% bid-year repricing) and commercial rate actions driving growth, partially offset by MA membership softness from 2025 redetermination cycle.`,
      driversTabId: 'mbr-management',
    },
    {
      id: 'comp-sales', label: 'Medical Benefit Ratio',
      value: '84.6%',
      change: '-180bps YoY',
      changeDirection: 'up',
      sparkline: financials.quarters.map((q) => q.feeRevenueGrowth),
      target: '90.5% FY26 guidance',
      gap: '-5.9pp vs FY guidance (Q1 deductible reset)',
      status: 'good',
      subDrivers: [
        { name: 'Prior-Year Development', impact: '-$0.3B favorable', direction: 'positive' as const },
        { name: 'Deductible Reset (Q1)', impact: '-3.0pp seasonal', direction: 'positive' as const },
        { name: 'Medical Cost Trend', impact: '+6.8% YoY', direction: 'negative' as const },
      ],
      aiInsight: 'Q1 MBR of 84.6% reflects seasonal deductible reset benefit — the strongest MBR quarter of the year for managed care. Prior-year favorable reserve development of $0.3B provided additional Q1 lift. Full-year guidance of 90.5% (±50bps) embeds Q3/Q4 seasonal deterioration as deductibles are met and utilization surges.',
      driversTabId: 'mbr-management',
    },
    {
      id: 'hcb-membership', label: 'Total HCB Membership',
      value: '26.0M',
      unit: 'members',
      change: '-200K YoY',
      changeDirection: 'down',
      sparkline: [26.8, 26.5, 26.2, 26.0],
      target: '26.5M+ by YE2026',
      gap: '-500K vs YE2026 target',
      status: 'warning',
      subDrivers: [
        { name: 'Medicare Advantage Lives', impact: '~11.5M', direction: 'positive' as const },
        { name: 'Medicaid Lives', impact: '~9.2M', direction: 'positive' as const },
        { name: 'Commercial Group Lives', impact: '~8.4M', direction: 'positive' as const },
      ],
      aiInsight: 'Total HCB membership at 26.0M, down ~200K YoY driven by MA market repositioning away from unprofitable 2024 bid cohorts and ACA exchange exit. Medicaid redetermination impact stabilizing. Management expects net membership growth to resume in 2025 bid year as repriced MA plans re-attract members at improved margins.',
      driversTabId: 'ma-growth',
    },
    {
      id: 'op-margin', label: 'HCB Operating Margin',
      value: `${financials.latestQuarter.operatingMargin}%`,
      change: '+80bps YoY',
      changeDirection: 'up',
      sparkline: marginQtrData,
      target: '≥3.5% FY26',
      gap: `${(financials.latestQuarter.operatingMargin - 3.5).toFixed(1)}pp`,
      status: financials.latestQuarter.operatingMargin >= 3.5 ? 'good' : financials.latestQuarter.operatingMargin >= 2.5 ? 'warning' : 'critical',
      subDrivers: [
        { name: 'MA Margin Recovery', impact: '+40bps', direction: 'positive' as const },
        { name: 'Prior-Year Development', impact: '+30bps', direction: 'positive' as const },
        { name: 'Medical Cost Trend', impact: '-25bps', direction: 'negative' as const },
      ],
      aiInsight: `HCB operating margin of ${financials.latestQuarter.operatingMargin}% improved 80bps YoY, driven by MA margin recovery from the 2025 bid-year repricing cycle (+8–9%) and favorable prior-year development. Full-year Q1 strength moderated by Q3/Q4 medical cost seasonality; management targeting FY26 HCB AOI of $4.00–$4.34B.`,
      driversTabId: 'profitability',
    },
  ];
}

function buildPulseInsights(_data: ConsolePageData): PulseInsight[] {
  return [
    {
      id: '1', severity: 'positive',
      headline: 'Q1 MBR 84.6% — seasonal strength from deductible reset supports HCB AOI',
      detail: 'Q1 FY26 Medical Benefit Ratio of 84.6% reflects the annual deductible reset dynamic: members pay out-of-pocket until deductibles are met, suppressing claims in Q1. This is the most profitable managed care quarter. Prior-year favorable reserve development of $0.3B provided additional lift. Full-year guidance remains 90.5% (±50bps).',
      action: 'View MBR Analysis', actionTab: 'drivers',
    },
    {
      id: '2', severity: 'warning',
      headline: 'MA margin recovery on track but membership -200K YoY vs prior year',
      detail: 'Medicare Advantage margin recovering toward target as 2025 bid-year repricing (+8–9%) takes effect. However, membership is down ~200K YoY as CVS repositioned away from 2024 underbid plans. Management expects net MA membership growth to resume in the 2026 plan year as repriced plans attract enrollment at sustainable margins.',
      action: 'View MA Driver Analysis', actionTab: 'drivers',
    },
    {
      id: '3', severity: 'info',
      headline: 'Medicaid redetermination impact stabilizing; commercial group enrollment steady',
      detail: `Medicaid lives at ~9.2M — down from peak but stabilizing as state redetermination cycles largely complete across CVS Aetna state contracts. Commercial group enrollment at ~8.4M remains steady with employer group retention above 95%. 4+ Star MA enrollment at ~88% supports CMS quality bonus payments (~5% revenue uplift on eligible lives.`,
      action: 'View Enrollment Drivers', actionTab: 'drivers',
    },
  ];
}

function formatUnit(unit: string): string {
  const map: Record<string, string> = { percent: '%', currency: '$', bps: 'bps', pp: 'pp', count: '' };
  return map[unit] ?? unit;
}

function formatDriverValue(value: number, unit: string): string {
  const sign = value >= 0 ? '+' : '';
  const u = formatUnit(unit);
  if (u === '$') return `${sign}$${Math.abs(value).toFixed(1)}`;
  return `${sign}${value.toFixed(1)}${u}`;
}

function buildDriverMatrix(data: ConsolePageData): DriverMatrixRow[] {
  const naConsole = data.naConsole;
  if (naConsole?.keyDrivers?.length) {
    return naConsole.keyDrivers.slice(0, 6).map((kd, idx) => {
      const m = kd.metrics[0];
      const val = m ? parseFloat(m.currentValue) : 0;
      const tgt = m ? parseFloat(m.target) : 0;
      const safeVal = isNaN(val) ? 0 : val;
      const safeTgt = isNaN(tgt) ? 0 : tgt;
      const gap = safeTgt !== 0 ? safeVal - safeTgt : 0;
      return {
        id: `driver-${idx}`, name: kd.name,
        score: Math.max(0, Math.min(100, Math.round(50 + (gap / Math.abs(safeTgt || 1)) * 50))),
        trend: m ? formatDriverValue(safeVal, m.unit) : 'N/A',
        trendDirection: (m?.direction === 'up' ? 'up' : m?.direction === 'down' ? 'down' : 'flat') as 'up' | 'down' | 'flat',
        gap: m ? formatDriverValue(gap, m.unit) : 'N/A',
        status: (gap >= 0 ? 'good' : gap > -3 ? 'warning' : 'critical') as 'good' | 'warning' | 'critical',
        subDrivers: kd.subDrivers.slice(0, 3),
      };
    });
  }
  return [
    { id: 'mbr-management', name: 'Medical Benefit Ratio', score: 82, trend: '84.6%', trendDirection: 'up', gap: 'Q1 seasonal', status: 'good', subDrivers: ['Inpatient Trend', 'Outpatient Trend', 'Prior-Year Development'] },
    { id: 'ma-growth', name: 'Medicare Advantage Growth', score: 65, trend: '-200K', trendDirection: 'down', gap: '-500K to target', status: 'warning', subDrivers: ['MA Enrollment', 'Star Ratings', 'Bid-Year Repricing'] },
    { id: 'medicaid-commercial', name: 'Medicaid & Commercial', score: 74, trend: '17.6M', trendDirection: 'flat', gap: 'Stable', status: 'good', subDrivers: ['Medicaid Lives', 'Commercial Group', 'ACA Exits'] },
    { id: 'profitability', name: 'HCB Profitability', score: 80, trend: '+80bps', trendDirection: 'up', gap: '+0.3pp', status: 'good', subDrivers: ['AOI Margin', 'Cost Trend', 'SG&A Health100'] },
    { id: 'cost-trend', name: 'Medical Cost Trend', score: 60, trend: '+6.8%', trendDirection: 'down', gap: '-0.2pp', status: 'warning', subDrivers: ['Inpatient Utilization', 'Specialty Drug Cost', 'Behavioral Health'] },
    { id: 'star-quality', name: 'Star Quality & Retention', score: 78, trend: '~88%', trendDirection: 'up', gap: '+0.8pp', status: 'good', subDrivers: ['4+ Star Enrollment', 'Quality Bonus Revenue', 'Member Retention'] },
  ];
}

function buildDriverTree(data: ConsolePageData): DriverNode[] {
  const q = data.financials.latestQuarter;
  return [
    { id: 'mbr-management', name: 'Medical Benefit Ratio Management', value: '84.6%', status: 'good',
      children: [
        { id: 'inpatient-trend', name: 'Inpatient Medical Trend', value: '+7.2% YoY', status: 'warning',
          children: [
            { id: 'acute-admits', name: 'Acute Hospital Admissions', value: '+3.1% YoY', status: 'warning' },
            { id: 'los', name: 'Average Length of Stay', value: 'Stable', status: 'good' },
            { id: 'prior-auth', name: 'Prior Authorization Approval Rate', value: '~88%', status: 'good' },
          ],
        },
        { id: 'outpatient-trend', name: 'Outpatient & Pharmacy Trend', value: '+6.5% YoY', status: 'warning' },
        { id: 'prior-year-dev', name: 'Prior-Year Reserve Development', value: '+$0.3B favorable', status: 'good' },
        { id: 'seasonal-reset', name: 'Deductible Reset Benefit (Q1)', value: '-5.9pp vs FY avg', status: 'good' },
      ],
    },
    { id: 'ma-growth', name: 'Medicare Advantage Growth & Margin', value: '~11.5M lives', status: 'warning',
      children: [
        { id: 'ma-enrollment', name: 'MA Enrollment', value: '-200K YoY', status: 'warning' },
        { id: 'ma-margin', name: 'MA Operating Margin', value: '~1.5% (tgt 3% by 2028)', status: 'warning',
          children: [
            { id: 'bid-repricing', name: '2025 Bid-Year Repricing', value: '+8–9% premium', status: 'good' },
            { id: 'star-bonus', name: 'CMS Star Quality Bonus', value: '~5% on 4+ Star lives', status: 'good' },
          ],
        },
        { id: 'star-ratings', name: '4+ Star Plan Enrollment', value: '~88%', status: 'good' },
      ],
    },
    { id: 'medicaid-commercial', name: 'Medicaid & Commercial Enrollment', value: '17.6M lives', status: 'good',
      children: [
        { id: 'medicaid-lives', name: 'Medicaid Lives', value: '~9.2M', status: 'good' },
        { id: 'commercial-lives', name: 'Commercial Group Lives', value: '~8.4M', status: 'good' },
        { id: 'aca-impact', name: 'ACA Exchange Exit Impact', value: 'Managed exit complete', status: 'good' },
      ],
    },
    { id: 'profitability', name: 'HCB Profitability', value: `${q.operatingMargin}%`, status: q.operatingMargin >= 3.5 ? 'good' : 'warning',
      children: [
        { id: 'hcb-aoi', name: 'HCB Adjusted Operating Income', value: '$36.0B Q1 revenue base', status: 'good' },
        { id: 'sga-health100', name: 'SG&A (net of Health100 savings)', value: 'Health100 contributing $500M+', status: 'good' },
        { id: 'cost-trend-mgmt', name: 'Medical Cost Trend Management', value: '+6.8% vs <7% target', status: 'warning' },
      ],
    },
  ];
}

function buildDriverDetail(id: string, data: ConsolePageData): DriverDetailData | null {
  const quarters = data.financials.quarters;
  const q = quarters[quarters.length - 1];

  const map: Record<string, DriverDetailData> = {
    'mbr-management': {
      id: 'mbr-management', name: 'Medical Benefit Ratio Management',
      description: 'HCB MBR trajectory — the primary HCB profitability driver. Q1 seasonally lowest MBR due to deductible reset; Q3/Q4 highest due to post-deductible utilization surge.',
      value: '84.6%', target: '90.5% FY26 guidance', gap: '-5.9pp (Q1 seasonal)',
      trend: 'up', trendValue: '-180bps YoY improvement', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 86.4, target: 90.5 },
        { period: 'Q2 FY25', actual: 89.0, target: 90.5 },
        { period: 'Q3 FY25', actual: 91.2, target: 90.5 },
        { period: 'Q4 FY25', actual: 90.8, target: 90.5 },
      ],
      subDrivers: [
        { name: 'Inpatient Medical Trend', contribution: 7.2, unit: '% YoY cost trend' },
        { name: 'Outpatient & Rx Trend', contribution: 6.5, unit: '% YoY cost trend' },
        { name: 'Prior-Year Development', contribution: -0.3, unit: '$B favorable' },
        { name: 'Q1 Deductible Reset', contribution: -5.9, unit: 'pp seasonal benefit' },
      ],
      variance: { actual: '84.6%', plan: '90.5% FY26', priorYear: '86.4%' },
      aiInsight: 'Q1 MBR of 84.6% is the seasonal low — members pay out-of-pocket in Q1 as annual deductibles reset, reducing claims. This pattern is structural to managed care: Q1 is BD\'s strongest HCB earnings quarter, Q3/Q4 the weakest. Prior-year favorable reserve development of $0.3B provided $150M+ AOI uplift. Full-year MBR guidance of 90.5% (±50bps) reflects the Q3/Q4 utilization surge as deductibles are exhausted.',
      crossRefs: [{ label: 'Health Services PBM', consoleId: 'international-performance' }],
    },
    'ma-growth': {
      id: 'ma-growth', name: 'Medicare Advantage Growth & Margin Recovery',
      description: 'MA enrollment trajectory and bid-year margin recovery from <1% toward 3% target by 2028.',
      value: '~11.5M', unit: 'MA covered lives', target: '12.0M+ by YE2026', gap: '-500K',
      trend: 'down', trendValue: '-200K YoY (repositioning)', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 11.7, target: 12.0 },
        { period: 'Q2 FY25', actual: 11.6, target: 12.0 },
        { period: 'Q3 FY25', actual: 11.5, target: 12.0 },
        { period: 'Q4 FY25', actual: 11.5, target: 12.0 },
      ],
      subDrivers: [
        { name: 'MA Margin Recovery (2025 bid)', contribution: 1.5, unit: '% operating margin' },
        { name: '4+ Star Enrollment', contribution: 88, unit: '% of MA lives' },
        { name: 'CMS Star Quality Bonus', contribution: 5, unit: '% revenue uplift on eligible' },
        { name: 'AEP Net Enrollment Impact', contribution: -200, unit: 'K lives YoY' },
      ],
      variance: { actual: '~11.5M', plan: '12.0M+', priorYear: '~11.7M' },
      aiInsight: 'MA enrollment declined ~200K as CVS deliberately exited 2024 underbid plan cohorts as part of the margin recovery strategy. The 2025 bid-year repricing (+8–9% premium increase) is absorbing medical cost trend. MA margin is recovering from <1% toward the 3% target by 2028. Management expects net MA enrollment growth to resume in 2026 AEP as repriced plans become competitive again at sustainable margins.',
    },
    'medicaid-commercial': {
      id: 'medicaid-commercial', name: 'Medicaid & Commercial Enrollment',
      description: 'Medicaid managed care lives across state contracts and commercial group employer-sponsored plan enrollment.',
      value: '17.6M', unit: 'Medicaid + Commercial lives', target: '18.0M+', gap: '-400K',
      trend: 'flat', trendValue: 'Stable YoY', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 17.8, target: 18.0 },
        { period: 'Q2 FY25', actual: 17.7, target: 18.0 },
        { period: 'Q3 FY25', actual: 17.6, target: 18.0 },
        { period: 'Q4 FY25', actual: 17.6, target: 18.0 },
      ],
      subDrivers: [
        { name: 'Medicaid Lives', contribution: 9.2, unit: 'M' },
        { name: 'Commercial Group Lives', contribution: 8.4, unit: 'M' },
        { name: 'Medicaid Redetermination Impact', contribution: -0.3, unit: 'M (stabilizing)' },
        { name: 'Commercial Group Retention', contribution: 95, unit: '% retention rate' },
      ],
      variance: { actual: '17.6M', plan: '18.0M+', priorYear: '17.8M' },
      aiInsight: 'Medicaid at 9.2M lives: state redetermination cycles largely complete. Commercial group at 8.4M with 95%+ retention — employer group business is the most stable HCB segment. ACA exchange exit impact has been fully absorbed.',
    },
    'profitability': {
      id: 'profitability', name: 'HCB Profitability',
      description: 'HCB adjusted operating income margin and cost structure analysis.',
      value: `${q?.operatingMargin || 0}%`, target: '≥3.5% FY26', gap: `${((q?.operatingMargin || 0) - 3.5).toFixed(1)}pp`,
      trend: 'up', trendValue: '+80bps YoY', status: 'good',
      trendData: quarters.map((qu) => ({ period: qu.quarter, actual: qu.operatingMargin, target: 3.5 })),
      subDrivers: [
        { name: 'MA Margin Recovery', contribution: 0.4, unit: 'pp' },
        { name: 'Prior-Year Development', contribution: 0.3, unit: 'pp' },
        { name: 'Medical Cost Trend Pressure', contribution: -0.25, unit: 'pp' },
        { name: 'Health100 SG&A Savings', contribution: 0.15, unit: 'pp' },
      ],
      variance: { actual: `${q?.operatingMargin}%`, plan: '≥3.5%', priorYear: `${(q?.operatingMargin || 0) - 0.8}%` },
      aiInsight: `HCB operating margin of ${q?.operatingMargin}% improved 80bps YoY. Key drivers: bid-year MA repricing benefit flowing through, favorable prior-year reserve development, and Health100 SG&A savings contribution. Full-year FY26 HCB AOI guidance of $4.00–$4.34B requires Q2–Q4 discipline against medical cost trend as deductibles are met.`,
    },
    'cost-trend': {
      id: 'cost-trend', name: 'Medical Cost Trend',
      description: 'Year-over-year medical cost trend — the primary pricing input for annual MA and commercial bid cycles.',
      value: '+6.8%', target: '<7.0% FY26', gap: '-0.2pp to target',
      trend: 'down', trendValue: '+6.8% YoY (within guidance)', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 7.2, target: 7.0 },
        { period: 'Q2 FY25', actual: 7.0, target: 7.0 },
        { period: 'Q3 FY25', actual: 6.9, target: 7.0 },
        { period: 'Q4 FY25', actual: 6.8, target: 7.0 },
      ],
      subDrivers: [
        { name: 'Inpatient Trend', contribution: 7.2, unit: '%' },
        { name: 'Outpatient Trend', contribution: 6.8, unit: '%' },
        { name: 'Specialty Drug (Pharmacy) Trend', contribution: 9.5, unit: '%' },
        { name: 'GLP-1 Drug Cost Trend', contribution: 12.0, unit: '%' },
      ],
      variance: { actual: '+6.8%', plan: '<7.0%', priorYear: '+7.5%' },
      aiInsight: 'Medical cost trend of +6.8% is within the <7.0% FY26 target and improving from +7.5% last year. Specialty drug trend at +9.5% remains the fastest-growing component, with GLP-1 at +12% YoY driven by Ozempic and Wegovy utilization expansion. Inpatient trend normalizing from COVID-era disruptions. Prior authorization discipline (88% approval rate) is moderating unnecessary utilization.',
    },
    'star-quality': {
      id: 'star-quality', name: 'Star Quality & Member Retention',
      description: 'CMS MA Star rating enrollment share and associated quality bonus revenue.',
      value: '~88%', unit: 'of MA in 4+ Star plans', target: '>90%', gap: '-2pp',
      trend: 'up', trendValue: '+1pp YoY', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 87, target: 90 },
        { period: 'Q2 FY25', actual: 87.5, target: 90 },
        { period: 'Q3 FY25', actual: 88, target: 90 },
        { period: 'Q4 FY25', actual: 88, target: 90 },
      ],
      subDrivers: [
        { name: 'CMS Quality Bonus Rate', contribution: 5, unit: '% revenue uplift on 4+ Star' },
        { name: 'Member Retention Rate', contribution: 92, unit: '% annual retention' },
        { name: 'HEDIS Quality Scores', contribution: 85, unit: '% measures at or above benchmark' },
      ],
      variance: { actual: '~88%', plan: '>90%', priorYear: '~87%' },
      aiInsight: '88% of MA members enrolled in 4+ Star plans drives meaningful CMS quality bonus payments (~5% revenue uplift). This quality premium is a key competitive differentiator for MA bid pricing — plans with >4 Stars can bid more attractively while maintaining margins. Closing the 2pp gap to >90% is a key FY2027 priority.',
    },

    // ── MBR children ──────────────────────────────────────────────────────────

    'inpatient-trend': {
      id: 'inpatient-trend', name: 'Inpatient Medical Trend',
      description: 'Year-over-year inpatient hospital cost trend — acute admissions and unit cost per admission across Medicare Advantage and commercial populations.',
      value: '+7.2%', target: '<7.0%', gap: '+0.2pp above target',
      trend: 'down', trendValue: 'Improving from +8.1% in Q1 FY25', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 8.1, target: 7.0 },
        { period: 'Q2 FY25', actual: 7.8, target: 7.0 },
        { period: 'Q3 FY25', actual: 7.5, target: 7.0 },
        { period: 'Q4 FY25', actual: 7.2, target: 7.0 },
      ],
      subDrivers: [
        { name: 'Acute Admissions Rate', contribution: 3.1, unit: '% YoY' },
        { name: 'Unit Cost per Admission', contribution: 4.1, unit: '% YoY' },
        { name: 'Prior Auth Impact', contribution: -1.2, unit: '% YoY offset' },
        { name: 'Case Management Savings', contribution: -0.8, unit: '% YoY offset' },
      ],
      variance: { actual: '+7.2%', plan: '<7.0%', priorYear: '+8.1%' },
      aiInsight: 'Inpatient trend of +7.2% YoY remains slightly above the <7.0% target but is improving from the +8.1% peak in Q1 FY25. Primary drivers are acute admission rate growth (+3.1%) and unit cost inflation (+4.1%). Prior authorization (88% approval rate) and case management programs provide offsetting benefits. Oak Street Health value-based primary care is showing measurable impact: MA members attributed to OSH clinics have materially lower acute admission rates than non-attributed MA members.',
    },

    'outpatient-trend': {
      id: 'outpatient-trend', name: 'Outpatient & Pharmacy Trend',
      description: 'Outpatient facility cost trend and pharmacy (non-specialty) benefit expense trend across HCB plan types.',
      value: '+6.5%', target: '<7.0%', gap: '-0.5pp favorable',
      trend: 'down', trendValue: 'Improving from +7.3% in Q1 FY25', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 7.3, target: 7.0 },
        { period: 'Q2 FY25', actual: 7.0, target: 7.0 },
        { period: 'Q3 FY25', actual: 6.8, target: 7.0 },
        { period: 'Q4 FY25', actual: 6.5, target: 7.0 },
      ],
      subDrivers: [
        { name: 'Ambulatory Surgery', contribution: 7.8, unit: '% YoY trend' },
        { name: 'Emergency Department Visits', contribution: 5.9, unit: '% YoY trend' },
        { name: 'Pharmacy Benefit (non-specialty)', contribution: 4.2, unit: '% YoY trend' },
        { name: 'Formulary Management Savings', contribution: -1.5, unit: '% YoY offset' },
      ],
      variance: { actual: '+6.5%', plan: '<7.0%', priorYear: '+7.3%' },
      aiInsight: 'Outpatient trend of +6.5% is within the <7.0% target and improving. Ambulatory surgery (+7.8%) and ED utilization (+5.9%) are the primary cost drivers. Pharmacy benefit trend (+4.2%) is held below specialty drug inflation by formulary management and generic substitution. Caremark PBM integration provides Aetna HCB with clinical programs that moderate outpatient pharmacy trend relative to standalone health plans.',
    },

    'prior-year-dev': {
      id: 'prior-year-dev', name: 'Prior-Year Reserve Development',
      description: 'Favorable or adverse development of prior-period incurred-but-not-reported (IBNR) medical cost reserves — a non-recurring P&L adjustment.',
      value: '+$0.3B', target: 'Neutral', gap: '+$0.3B favorable',
      trend: 'up', trendValue: '+$310M favorable to Q1 FY26', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 0.15, target: 0 },
        { period: 'Q2 FY25', actual: 0.08, target: 0 },
        { period: 'Q3 FY25', actual: -0.05, target: 0 },
        { period: 'Q4 FY25', actual: 0.31, target: 0 },
      ],
      subDrivers: [
        { name: 'Q3/Q4 FY25 IBNR Release', contribution: 0.31, unit: '$B favorable' },
        { name: 'MA Population Reserve Adj.', contribution: 0.12, unit: '$B' },
        { name: 'Medicaid Settlement Adj.', contribution: -0.07, unit: '$B adverse' },
        { name: 'Commercial Reserve Adj.', contribution: 0.05, unit: '$B' },
      ],
      variance: { actual: '+$0.3B', plan: 'Neutral', priorYear: '+$0.15B' },
      aiInsight: 'Q1 FY26 prior-year favorable reserve development of $310M reflects Q3/Q4 FY25 medical costs coming in below initial IBNR reserve estimates. This is largely non-recurring — managed care companies routinely set conservative IBNR reserves and release favorable development in subsequent quarters. The $310M represents approximately $0.24/share EPS benefit in Q1 that will not repeat in Q2–Q4. Management guidance does not assume recurring favorable development in the full-year FY26 targets.',
    },

    'seasonal-reset': {
      id: 'seasonal-reset', name: 'Deductible Reset Benefit (Q1)',
      description: 'Structural Q1 MBR benefit from annual deductible resets — members pay out-of-pocket until deductibles are met, suppressing Q1 claims.',
      value: '-5.9pp', target: 'Structural benefit', gap: 'Q1 seasonal low',
      trend: 'flat', trendValue: 'Structural annual pattern', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 86.4, target: 90.5 },
        { period: 'Q2 FY25', actual: 89.0, target: 90.5 },
        { period: 'Q3 FY25', actual: 91.2, target: 90.5 },
        { period: 'Q4 FY25', actual: 90.8, target: 90.5 },
      ],
      subDrivers: [
        { name: 'Member Deductible Payments', contribution: -5.9, unit: 'pp MBR Q1 benefit' },
        { name: 'Q3 Deductible Exhaustion', contribution: 2.2, unit: 'pp MBR headwind' },
        { name: 'Q4 Utilization Surge', contribution: 1.8, unit: 'pp MBR headwind' },
        { name: 'Prior-Year Dev. Lift', contribution: -0.8, unit: 'pp additional Q1 benefit' },
      ],
      variance: { actual: '84.6%', plan: '90.5% FY avg', priorYear: '86.4%' },
      aiInsight: 'The deductible reset is the most reliable structural feature of managed care P&L seasonality. In Q1, members pay 100% of costs until their deductible is met, substantially reducing insurer claims. CVS Aetna\'s Q1 MBR of 84.6% is the seasonal floor; Q3 is typically the ceiling at 91–93% as member deductibles exhaust. Full-year guidance of 90.5% accurately reflects the annual average across all four seasonal quarters.',
    },

    // ── Inpatient children ────────────────────────────────────────────────────

    'acute-admits': {
      id: 'acute-admits', name: 'Acute Hospital Admissions',
      description: 'Year-over-year growth in acute inpatient admissions per 1,000 members — the primary volume driver of inpatient medical trend.',
      value: '+3.1%', target: '<3.0%', gap: '+0.1pp',
      trend: 'down', trendValue: 'Improving from +4.2% in Q1 FY25', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 4.2, target: 3.0 },
        { period: 'Q2 FY25', actual: 3.8, target: 3.0 },
        { period: 'Q3 FY25', actual: 3.4, target: 3.0 },
        { period: 'Q4 FY25', actual: 3.1, target: 3.0 },
      ],
      subDrivers: [
        { name: 'MA Population Admit Rate', contribution: 3.5, unit: '% YoY' },
        { name: 'Commercial Admit Rate', contribution: 2.4, unit: '% YoY' },
        { name: 'Oak Street Health Impact', contribution: -0.6, unit: '% YoY offset' },
        { name: 'Prior Auth Denial Rate', contribution: -0.2, unit: '% YoY offset' },
      ],
      variance: { actual: '+3.1%', plan: '<3.0%', priorYear: '+4.2%' },
      aiInsight: 'Acute admissions +3.1% YoY is marginally above target but a significant improvement from +4.2% in Q1 FY25. Oak Street Health value-based primary care is showing measurable impact: MA members attributed to OSH clinics have materially lower acute admission rates than non-attributed MA members. Reducing avoidable admissions through proactive chronic disease management is the core clinical strategy supporting the MA margin recovery thesis.',
    },

    'los': {
      id: 'los', name: 'Average Length of Stay',
      description: 'Average inpatient days per admission — a key determinant of inpatient unit cost and total claims expense.',
      value: '~4.7 days', target: '≤4.8 days', gap: 'On target',
      trend: 'flat', trendValue: 'Stable YoY at ~4.7 days', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 4.8, target: 4.8 },
        { period: 'Q2 FY25', actual: 4.75, target: 4.8 },
        { period: 'Q3 FY25', actual: 4.7, target: 4.8 },
        { period: 'Q4 FY25', actual: 4.7, target: 4.8 },
      ],
      subDrivers: [
        { name: 'Medical-Surgical LOS', contribution: 4.2, unit: 'days avg' },
        { name: 'Behavioral Health LOS', contribution: 6.8, unit: 'days avg' },
        { name: 'Case Mgmt Discharge Rate', contribution: 88, unit: '% timely discharge' },
        { name: 'SNF Transition Success', contribution: 92, unit: '% avoid 30d readmit' },
      ],
      variance: { actual: '~4.7 days', plan: '≤4.8 days', priorYear: '~4.8 days' },
      aiInsight: 'Average length of stay has stabilized at ~4.7 days, meeting the ≤4.8-day target and slightly improving YoY. Case management programs achieve 88% timely discharge rate. SNF transition programs maintain 92% 30-day readmission avoidance rate. Behavioral health LOS at 6.8 days remains the highest-acuity segment. LOS is not the primary inpatient cost driver — admission volume and unit cost inflation per day are larger contributors.',
    },

    'prior-auth': {
      id: 'prior-auth', name: 'Prior Authorization Approval Rate',
      description: 'Percentage of prior authorization requests approved — balances clinical appropriateness with member access to care.',
      value: '~88%', target: '87–90%', gap: 'Within target range',
      trend: 'flat', trendValue: 'Stable at 88%', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 87.5, target: 88.5 },
        { period: 'Q2 FY25', actual: 88.0, target: 88.5 },
        { period: 'Q3 FY25', actual: 88.0, target: 88.5 },
        { period: 'Q4 FY25', actual: 88.0, target: 88.5 },
      ],
      subDrivers: [
        { name: 'Inpatient Procedure Approvals', contribution: 91, unit: '% approved' },
        { name: 'Specialty Rx Prior Auth', contribution: 84, unit: '% approved' },
        { name: 'Imaging & Diagnostics', contribution: 93, unit: '% approved' },
        { name: 'Behavioral Health Auth', contribution: 89, unit: '% approved' },
      ],
      variance: { actual: '~88%', plan: '87–90%', priorYear: '~87.5%' },
      aiInsight: 'Prior authorization approval rate of 88% is within the 87–90% clinical appropriateness target. Specialty Rx PA at 84% is the most selective — driven by high-cost biologics and GLP-1 agents where clinical criteria review is most intensive. CMS has increased scrutiny on MA prior auth practices; Aetna\'s compliance program aims to maintain approval rates above industry minimum thresholds to avoid regulatory action.',
    },

    // ── MA Growth children ────────────────────────────────────────────────────

    'ma-enrollment': {
      id: 'ma-enrollment', name: 'MA Enrollment',
      description: 'Medicare Advantage covered lives — year-over-year enrollment trajectory and AEP (Annual Enrollment Period) outcomes.',
      value: '~11.5M', target: '12.0M+ by YE2026', gap: '-500K',
      trend: 'down', trendValue: '-200K YoY (deliberate repositioning)', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 11.7, target: 12.0 },
        { period: 'Q2 FY25', actual: 11.6, target: 12.0 },
        { period: 'Q3 FY25', actual: 11.5, target: 12.0 },
        { period: 'Q4 FY25', actual: 11.5, target: 12.0 },
      ],
      subDrivers: [
        { name: 'Individual MA Lives', contribution: 8.2, unit: 'M' },
        { name: 'Group MA (Employer Sponsored)', contribution: 3.3, unit: 'M' },
        { name: '2024 Underbid Cohort Exit', contribution: -0.35, unit: 'M (deliberate)' },
        { name: '2026 AEP Projected Growth', contribution: 0.3, unit: 'M forward-looking' },
      ],
      variance: { actual: '~11.5M', plan: '12.0M+', priorYear: '~11.7M' },
      aiInsight: 'MA enrollment at 11.5M is down ~200K YoY — a deliberate strategic choice, not market share loss. CVS exited unprofitable 2024 plan-year cohorts as part of the bid-year margin recovery strategy. Group MA at 3.3M provides more stable enrollment. The 2026 AEP (Oct–Dec 2025) is the first test of whether repriced plans attract net new enrollment at sustainable margins. Management targets 12.0M+ by YE2026.',
    },

    'ma-margin': {
      id: 'ma-margin', name: 'MA Operating Margin',
      description: 'Medicare Advantage operating margin recovery trajectory — from near-zero in FY24 toward the 3% target by FY2028.',
      value: '~1.5%', target: '3.0% by FY2028', gap: '-1.5pp',
      trend: 'up', trendValue: '+80bps YoY (recovery on track)', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 0.7, target: 2.0 },
        { period: 'Q2 FY25', actual: 1.0, target: 2.2 },
        { period: 'Q3 FY25', actual: 1.2, target: 2.5 },
        { period: 'Q4 FY25', actual: 1.5, target: 2.8 },
      ],
      subDrivers: [
        { name: '2025 Bid-Year Repricing', contribution: 0.8, unit: 'pp margin improvement' },
        { name: 'CMS Star Quality Bonus', contribution: 0.4, unit: 'pp margin benefit' },
        { name: 'Medical Cost Trend Headwind', contribution: -0.3, unit: 'pp pressure' },
        { name: 'Membership Mix Improvement', contribution: 0.2, unit: 'pp (lower-acuity exits)' },
      ],
      variance: { actual: '~1.5%', plan: '3.0% by FY28', priorYear: '~0.7%' },
      aiInsight: 'MA operating margin of ~1.5% represents meaningful recovery from near-zero levels in FY24. The 2025 bid-year repricing of +8–9% is the primary mechanism — each annual repricing cycle adds ~80–100bps of margin as premium rate increases outpace medical cost trend. The 3% target by FY2028 requires two additional repricing cycles plus continued GLP-1 and specialty cost management.',
    },

    // ── MA Margin children ────────────────────────────────────────────────────

    'bid-repricing': {
      id: 'bid-repricing', name: '2025 Bid-Year Repricing',
      description: 'CVS Aetna Medicare Advantage premium rate increase for the 2025 plan year — the primary MA margin recovery mechanism.',
      value: '+8–9%', target: 'Cover medical cost trend', gap: '+1–2pp above trend',
      trend: 'up', trendValue: '+8–9% premium increase vs +3.2% FY24 underbid', status: 'good',
      trendData: [
        { period: 'FY22 Bids', actual: 4.0, target: 6.0 },
        { period: 'FY23 Bids', actual: 5.5, target: 6.5 },
        { period: 'FY24 Bids', actual: 3.2, target: 7.5 },
        { period: 'FY25 Bids', actual: 8.5, target: 7.0 },
      ],
      subDrivers: [
        { name: 'MA Premium Rate Increase', contribution: 8.5, unit: '% FY25 average' },
        { name: 'Medical Cost Trend Covered', contribution: 6.8, unit: '% YoY trend' },
        { name: 'Margin Recovery Buffer', contribution: 1.7, unit: 'pp above trend' },
        { name: 'Enrollment Impact of Higher Rates', contribution: -0.2, unit: 'M lives (deliberate)' },
      ],
      variance: { actual: '+8–9%', plan: 'Cover trend + build margin', priorYear: '+3.2% FY24 underbid' },
      aiInsight: 'The FY24 underbid (+3.2% rate increase vs. +7.5% medical cost trend) created the MA margin crisis. The FY25 correction of +8–9% deliberately over-covers medical cost trend by ~1–2pp, providing the runway for margin recovery. CMS sets MA benchmark rates based on prior-year cost data, so the annual repricing cycle is the primary tool available. FY26 bid rates are expected to continue margin recovery momentum with another repricing cycle above cost trend.',
    },

    'star-bonus': {
      id: 'star-bonus', name: 'CMS Star Quality Bonus',
      description: 'CMS Medicare Advantage quality bonus payments for plans achieving 4+ Star ratings — adds ~5% revenue uplift on eligible member lives.',
      value: '~5%', target: '>5% on 4+ Star lives', gap: 'On target',
      trend: 'up', trendValue: '+1pp YoY in 4+ Star enrollment share', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 4.8, target: 5.0 },
        { period: 'Q2 FY25', actual: 4.9, target: 5.0 },
        { period: 'Q3 FY25', actual: 5.0, target: 5.0 },
        { period: 'Q4 FY25', actual: 5.0, target: 5.0 },
      ],
      subDrivers: [
        { name: '4+ Star Lives Share', contribution: 88, unit: '% of MA lives eligible' },
        { name: 'Quality Bonus Revenue Uplift', contribution: 5.0, unit: '% per eligible life' },
        { name: 'HEDIS Score Improvement', contribution: 1.5, unit: 'pp YoY' },
        { name: 'Member Experience (CAHPS)', contribution: 82, unit: '% favorable' },
      ],
      variance: { actual: '~5% on 88% of lives', plan: '>5% on >90% of lives', priorYear: '~4.8% on 87% of lives' },
      aiInsight: 'CMS Star quality bonus payments represent a meaningful revenue advantage for 4+ Star plans. With 88% of MA members in 4+ Star plans, Aetna captures quality bonus payments on the vast majority of its MA book. Each percentage point of 4+ Star enrollment share translates to ~$200M incremental quality bonus revenue annually. The 2-year lag in Star ratings means investments in quality today pay financial dividends in FY27+.',
    },

    // ── MA Growth sibling ─────────────────────────────────────────────────────

    'star-ratings': {
      id: 'star-ratings', name: '4+ Star Plan Enrollment',
      description: 'Percentage of Medicare Advantage members enrolled in plans rated 4.0 Stars or higher by CMS — determines quality bonus revenue eligibility.',
      value: '~88%', target: '>90%', gap: '-2pp',
      trend: 'up', trendValue: '+1pp YoY', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 87.0, target: 90.0 },
        { period: 'Q2 FY25', actual: 87.5, target: 90.0 },
        { period: 'Q3 FY25', actual: 88.0, target: 90.0 },
        { period: 'Q4 FY25', actual: 88.0, target: 90.0 },
      ],
      subDrivers: [
        { name: '5-Star Plan Lives', contribution: 12, unit: '% of MA lives' },
        { name: '4-Star Plan Lives', contribution: 76, unit: '% of MA lives' },
        { name: '3.5-Star Plan Lives', contribution: 10, unit: '% of MA lives (below threshold)' },
        { name: 'New Plan Years (below threshold)', contribution: 2, unit: '% of MA lives' },
      ],
      variance: { actual: '~88%', plan: '>90%', priorYear: '~87%' },
      aiInsight: '88% of MA members enrolled in 4+ Star plans is competitive with industry peers and improving. The 2pp gap to >90% primarily reflects plan-year transitions and the 2-year lag in Star rating updates. HEDIS quality measure improvements and CAHPS member experience investments are the primary levers for closing the gap. Achieving >90% 4+ Star enrollment would generate an additional ~$400M in annual quality bonus revenue.',
    },

    // ── Medicaid & Commercial children ───────────────────────────────────────

    'medicaid-lives': {
      id: 'medicaid-lives', name: 'Medicaid Lives',
      description: 'Medicaid managed care covered lives across state contracts — Aetna manages approximately 9.2M members through comprehensive and specialty state programs.',
      value: '~9.2M', target: '9.5M+', gap: '-300K',
      trend: 'flat', trendValue: 'Stabilizing post-redetermination', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 9.5, target: 9.5 },
        { period: 'Q2 FY25', actual: 9.4, target: 9.5 },
        { period: 'Q3 FY25', actual: 9.3, target: 9.5 },
        { period: 'Q4 FY25', actual: 9.2, target: 9.5 },
      ],
      subDrivers: [
        { name: 'Comprehensive Medicaid Lives', contribution: 7.1, unit: 'M' },
        { name: 'Dual-Eligible (D-SNP) Lives', contribution: 1.4, unit: 'M' },
        { name: 'CHIP Enrollment', contribution: 0.7, unit: 'M' },
        { name: 'Redetermination Impact', contribution: -0.3, unit: 'M (stabilizing)' },
      ],
      variance: { actual: '~9.2M', plan: '9.5M+', priorYear: '~9.5M' },
      aiInsight: 'Medicaid lives at 9.2M reflect the post-pandemic redetermination cycle impact: states resumed disenrollment of ineligible members in FY23–FY24, reducing enrollment by ~300K from peak. The redetermination cycle is now largely complete and Medicaid enrollment is stabilizing. Dual-eligible (D-SNP) lives at ~1.4M represent an attractive growth segment where Aetna\'s integrated MA/Medicaid capabilities provide a competitive advantage.',
    },

    'commercial-lives': {
      id: 'commercial-lives', name: 'Commercial Group Lives',
      description: 'Employer-sponsored group health insurance covered lives — Aetna serves large, mid-market, and small group employers.',
      value: '~8.4M', target: '8.5M+', gap: '-100K',
      trend: 'flat', trendValue: '>95% employer group retention', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 8.5, target: 8.5 },
        { period: 'Q2 FY25', actual: 8.45, target: 8.5 },
        { period: 'Q3 FY25', actual: 8.42, target: 8.5 },
        { period: 'Q4 FY25', actual: 8.4, target: 8.5 },
      ],
      subDrivers: [
        { name: 'Large Group (2,000+ employees)', contribution: 5.1, unit: 'M' },
        { name: 'Mid-Market (50–1,999 employees)', contribution: 2.4, unit: 'M' },
        { name: 'Small Group (<50 employees)', contribution: 0.9, unit: 'M' },
        { name: 'Group Retention Rate', contribution: 95, unit: '% annual' },
      ],
      variance: { actual: '~8.4M', plan: '8.5M+', priorYear: '~8.5M' },
      aiInsight: 'Commercial group lives at 8.4M with >95% employer retention is the strongest retention metric in the HCB portfolio. Large group (5.1M) is the most stable, with multi-year contracts and high switching costs. The marginal decline from ~8.5M reflects deliberate exits from ACA small group exchange business. Commercial premium rate increases of +3.8% are fully covering medical cost trend for this segment, making it accretive to HCB operating margin.',
    },

    'aca-impact': {
      id: 'aca-impact', name: 'ACA Exchange Exit Impact',
      description: 'Impact of Aetna\'s strategic exit from ACA individual exchange markets — a deliberate portfolio optimization to improve HCB margin quality.',
      value: 'Complete', target: 'Fully absorbed', gap: 'Exit anniversary-ed',
      trend: 'up', trendValue: 'Margin accretive — exit complete', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: -145, target: 0 },
        { period: 'Q2 FY25', actual: -80, target: 0 },
        { period: 'Q3 FY25', actual: -30, target: 0 },
        { period: 'Q4 FY25', actual: 0, target: 0 },
      ],
      subDrivers: [
        { name: 'Revenue Impact from Exit', contribution: -145, unit: '$M one-time Q1 FY25' },
        { name: 'Margin Benefit (exits were loss-making)', contribution: 0.4, unit: 'pp HCB margin' },
        { name: 'Residual Risk Pool Adjustment', contribution: -20, unit: '$M (absorbed)' },
        { name: 'Net FY26 Impact (base year)', contribution: 0, unit: '(fully anniversary-ed)' },
      ],
      variance: { actual: 'Complete', plan: 'Exit complete', priorYear: '-$145M revenue impact (Q1 FY25)' },
      aiInsight: 'The ACA exchange exit is fully anniversary-ed with no ongoing P&L impact. The individual exchange segment was loss-making due to adverse selection and regulatory risk pool dynamics. Exiting improved HCB operating margin by approximately 40bps and simplified the portfolio. CVS Aetna\'s commercial enrollment strategy now focuses on employer group (large/mid/small) where underwriting risk is more predictable and margins are sustainable.',
    },

    // ── Profitability children ────────────────────────────────────────────────

    'hcb-aoi': {
      id: 'hcb-aoi', name: 'HCB Adjusted Operating Income',
      description: 'Health Care Benefits segment adjusted operating income — the primary HCB P&L bottom line metric and key contributor to BD consolidated Adj. EPS.',
      value: `~$${(q.revenue * 0.035).toFixed(1)}B`, target: '$4.00–$4.34B FY26 full-year', gap: 'Q1 run-rate tracking above FY guidance',
      trend: 'up', trendValue: '+$150M YoY Q1 FY26', status: 'good',
      trendData: quarters.map((qu) => ({ period: qu.quarter, actual: parseFloat((qu.revenue * 0.035).toFixed(2)), target: 1.0 })),
      subDrivers: [
        { name: 'MBR Improvement (Q1 seasonal)', contribution: 150, unit: '$M YoY' },
        { name: 'Premium Revenue Growth', contribution: 200, unit: '$M YoY' },
        { name: 'Medical Cost Trend Pressure', contribution: -180, unit: '$M YoY' },
        { name: 'Health100 SG&A Savings', contribution: 95, unit: '$M YoY' },
      ],
      variance: { actual: `~$${(q.revenue * 0.035).toFixed(1)}B Q1`, plan: '$4.00–$4.34B FY26', priorYear: `~$${((q.revenue * 0.035) - 0.15).toFixed(1)}B Q1 FY25` },
      aiInsight: `HCB Adjusted Operating Income is tracking ahead of full-year guidance in Q1, driven by seasonal MBR strength and prior-year favorable reserve development. Full-year FY26 AOI guidance of $4.00–$4.34B reflects Q3/Q4 medical cost seasonality normalization as deductibles exhaust. Management's guidance implies an average operating margin of ~2.8–3.0% on the HCB revenue base — a meaningful improvement from FY24 levels but still short of the 3.5%+ long-term target.`,
    },

    'sga-health100': {
      id: 'sga-health100', name: 'SG&A (Health100 Savings Program)',
      description: 'HCB SG&A expense management — Health100 transformation program targeting $2B cumulative SG&A savings by FY27.',
      value: '$500M+', target: '$2B cumulative by FY27', gap: '$1.5B remaining FY26–FY27',
      trend: 'up', trendValue: '$500M+ cumulative savings realized FY25', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 50, target: 125 },
        { period: 'Q2 FY25', actual: 150, target: 250 },
        { period: 'Q3 FY25', actual: 320, target: 375 },
        { period: 'Q4 FY25', actual: 500, target: 500 },
      ],
      subDrivers: [
        { name: 'Technology & Systems Consolidation', contribution: 200, unit: '$M savings FY25' },
        { name: 'Workforce Optimization', contribution: 180, unit: '$M savings FY25' },
        { name: 'Real Estate Footprint Reduction', contribution: 70, unit: '$M savings FY25' },
        { name: 'Vendor & Procurement Savings', contribution: 50, unit: '$M savings FY25' },
      ],
      variance: { actual: '$500M+ FY25', plan: '$500M FY25 target', priorYear: '$200M FY24 initial savings' },
      aiInsight: 'Health100 has realized $500M+ in cumulative SG&A savings through FY25, meeting the FY25 milestone. Technology consolidation (merging Aetna, Caremark, and CVS legacy platforms) and workforce optimization are the largest drivers. The remaining $1.5B to reach the $2B FY27 target requires continued execution across systems decommissioning, procurement leverage, and administrative efficiency. Health100 savings represent a structural cost reduction — the annualized run-rate improvement compounds over time.',
    },

    'cost-trend-mgmt': {
      id: 'cost-trend-mgmt', name: 'Medical Cost Trend Management',
      description: 'Aggregate medical cost trend management — year-over-year change in per-member-per-month (PMPM) medical benefit expense across all HCB plan types.',
      value: '+6.8%', target: '<7.0%', gap: '-0.2pp below target',
      trend: 'down', trendValue: 'Improving from +7.5% prior year', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 7.5, target: 7.0 },
        { period: 'Q2 FY25', actual: 7.2, target: 7.0 },
        { period: 'Q3 FY25', actual: 7.0, target: 7.0 },
        { period: 'Q4 FY25', actual: 6.8, target: 7.0 },
      ],
      subDrivers: [
        { name: 'Inpatient Medical Trend', contribution: 7.2, unit: '%' },
        { name: 'Outpatient & Physician Trend', contribution: 6.5, unit: '%' },
        { name: 'Specialty Pharmacy Trend', contribution: 9.5, unit: '%' },
        { name: 'GLP-1 Cost Trend', contribution: 12.0, unit: '%' },
      ],
      variance: { actual: '+6.8%', plan: '<7.0%', priorYear: '+7.5%' },
      aiInsight: 'Aggregate medical cost trend of +6.8% is within the <7.0% FY26 target and improving from +7.5% in the prior year. Specialty pharmacy at +9.5% and GLP-1 at +12% are the fastest-growing components and the primary risk to the trend target. Caremark PBM integration provides clinical programs (formulary management, step therapy, prior authorization) that moderate specialty cost trend relative to unmanaged competitors. Each 100bps of medical cost trend above plan equals approximately $550M in HCB AOI headwind and ~$0.42 EPS impact.',
    },
  };

  return map[id] || null;
}

function buildBridgeItems(data: ConsolePageData): BridgeCommentary[] {
  const bridge = data.financials.revenueBridge;
  if (bridge?.length) {
    return bridge.map((b, i) => ({
      id: `bridge-${i}`,
      component: b.label,
      value: b.impact,
      percentImpact: `${((b.impact / (data.financials.latestQuarter.revenue * 1000)) * 100).toFixed(1)}%`,
      aiSuggestion: b.description,
      status: 'draft' as const, subItems: [],
    }));
  }
  return [
    { id: 'b1', component: 'MA & Commercial Premium Rate Increases', value: 1820, percentImpact: '+5.1%', aiSuggestion: 'Medicare Advantage bid-year repricing (+8–9%) and commercial group premium rate actions contributed +$1.82B to HCB revenue vs Q1 FY25. This is the primary driver of HCB revenue growth and margin recovery.', userCommentary: 'Consistent with FY26 guidance — repricing on track.', author: 'HCB Finance', date: 'May 2026', status: 'signed-off' as const, subItems: [{ name: 'MA Premium Rate Increase (+8–9%)', value: 1250, description: 'Bid-year repricing on ~11.5M MA lives' }, { name: 'Commercial Rate Actions', value: 570, description: 'Employer group rate increases offsetting cost trend' }] },
    { id: 'b2', component: 'Membership Volume Headwind (MA)', value: -285, percentImpact: '-0.8%', aiSuggestion: 'MA enrollment declined ~200K as CVS repositioned away from 2024 underbid plan cohorts. Membership headwind of -$285M is the deliberate cost of margin recovery strategy.', status: 'submitted' as const, subItems: [] },
    { id: 'b3', component: 'Prior-Year Favorable Reserve Development', value: 310, percentImpact: '+0.9%', aiSuggestion: 'Favorable prior-year medical cost reserve development of $310M — claims for Q3/Q4 FY25 came in below initially estimated reserves, releasing positive development to Q1 FY26 earnings.', status: 'approved' as const, subItems: [] },
    { id: 'b4', component: 'Medical Cost Trend (inpatient + outpatient)', value: -720, percentImpact: '-2.0%', aiSuggestion: 'Medical cost trend of +6.8% YoY added -$720M in HCB costs vs Q1 FY25. Within <7% guidance. GLP-1 and specialty drug cost acceleration the fastest-growing components.', status: 'draft' as const, subItems: [] },
    { id: 'b5', component: 'Medicaid Redetermination & ACA Exit', value: -145, percentImpact: '-0.4%', aiSuggestion: 'Medicaid lives down YoY from state redetermination cycles; ACA exchange exit impact absorbed. Combined -$145M revenue headwind now largely anniversary-ed; Medicaid enrollment stabilizing.', status: 'draft' as const, subItems: [] },
    { id: 'b6', component: 'Health100 SG&A Savings Benefit', value: 95, percentImpact: '+0.3%', aiSuggestion: 'Health100 SG&A savings program contributed +$95M benefit to HCB operating income in Q1 FY26, tracking toward the $500M+ cumulative savings target.', status: 'draft' as const, subItems: [] },
  ];
}

// =============================================================================
// Main Component
// =============================================================================

export default function NorthAmericaClient({ data }: NorthAmericaClientProps) {
  const heroKPIs = useMemo(() => buildHeroKPIs(data), [data]);
  const insights = useMemo(() => buildPulseInsights(data), [data]);
  const driverMatrix = useMemo(() => buildDriverMatrix(data), [data]);
  const driverTree = useMemo(() => buildDriverTree(data), [data]);
  const bridgeItems = useMemo(() => buildBridgeItems(data), [data]);
  const getDriverDetail = useCallback((id: string) => buildDriverDetail(id, data), [data]);

  const narrativeBrief = useMemo(() => ({
    title: 'Health Care Benefits Performance Summary',
    period: data.financials.latestQuarter.quarter,
    summary: `Health Care Benefits delivered revenue of $${data.financials.latestQuarter.revenue}B in ${data.financials.latestQuarter.quarter} FY26, with a Medical Benefit Ratio of 84.6% — the seasonally strongest quarter driven by the annual deductible reset. Prior-year favorable reserve development of $0.3B provided an additional $150M+ AOI uplift.\n\nMedicare Advantage margin recovery is on track: the 2025 bid-year repricing of +8–9% is flowing through as planned. MA enrollment is down ~200K YoY as CVS deliberately repositioned away from unprofitable 2024 underbid cohorts — a necessary step in the multi-year margin recovery toward 3% by 2028.\n\nTotal HCB membership stands at 26.0M across MA (~11.5M), Medicaid (~9.2M), and Commercial Group (~8.4M). Medical cost trend of +6.8% is within the <7% FY26 target. Full-year MBR guidance of 90.5% (±50bps) reflects Q3/Q4 seasonal deterioration as member deductibles are met and utilization surges.`,
    keyTakeaways: data.narrative?.keyAchievements || [
      'Q1 MBR 84.6% — seasonal low from deductible reset; $0.3B prior-year favorable development added $150M+ AOI',
      'MA margin recovery on track: +8–9% bid-year repricing; targeting 3% MA operating margin by 2028',
      'HCB revenue +5.1% YoY driven by premium rate actions; medical cost trend +6.8% within <7% target',
      '88% of MA members in 4+ Star plans — supports ~5% CMS quality bonus revenue uplift on eligible lives',
      'Total HCB membership 26.0M — MA -200K from margin repositioning; Medicaid stabilizing post-redetermination',
    ],
    overallStatus: 'warning' as const,
  }), [data]);

  const quarterLabels = data.financials.quarters.map((q) => q.quarter);
  const plData = useMemo(() => [
    { label: 'HCB Revenues (Premiums)', isCategory: true,
      quarters: data.financials.quarters.map((q) => ({ actual: `$${q.revenue}B`, variance: `${q.revenueYoY >= 0 ? '+' : ''}${q.revenueYoY}%`, varianceColor: (q.revenueYoY >= 0 ? 'green' : 'red') as 'green' | 'red' | 'neutral' })),
      children: [
        { label: 'Medicare Advantage Premium', quarters: data.financials.quarters.map((q) => ({ actual: `$${(q.revenue * 0.44).toFixed(1)}B`, variance: '+5.2%', varianceColor: 'green' as const })) },
        { label: 'Medicaid Capitation Revenue', quarters: data.financials.quarters.map((q) => ({ actual: `$${(q.revenue * 0.34).toFixed(1)}B`, variance: '+3.1%', varianceColor: 'green' as const })) },
        { label: 'Commercial Group Premium', quarters: data.financials.quarters.map((q) => ({ actual: `$${(q.revenue * 0.32).toFixed(1)}B`, variance: '+3.8%', varianceColor: 'green' as const })) },
      ],
    },
    { label: 'Medical Costs (Benefits Expense)', isCategory: true,
      quarters: data.financials.quarters.map((q) => ({
        actual: `$${(q.revenue * (q.operatingMargin < 5 ? 0.846 : 0.905)).toFixed(1)}B`,
        variance: '+6.8%',
        varianceColor: 'red' as const,
      })),
      children: [
        { label: 'Inpatient Medical Costs', quarters: data.financials.quarters.map(() => ({ actual: 'Embedded in MBR', variance: '+7.2%', varianceColor: 'red' as const })) },
        { label: 'Outpatient & Rx Costs', quarters: data.financials.quarters.map(() => ({ actual: 'Embedded in MBR', variance: '+6.5%', varianceColor: 'red' as const })) },
      ],
    },
    { label: 'HCB Operating Margin', isTotal: true,
      quarters: data.financials.quarters.map((q) => ({ actual: `${q.operatingMargin}%`, variance: '+80bps YoY', varianceColor: 'green' as 'green' | 'red' | 'neutral' })),
    },
  ], [data]);

  const driverDataForTable = useMemo(() => [
    { category: 'MBR & Medical Costs', rows: [
      { driver: 'Medical Benefit Ratio', actual: '84.6%', plan: '90.5% FY26', variance: 'Q1 seasonal', varianceColor: 'green' as const, trend: 'up' as const },
      { driver: 'Medical Cost Trend', actual: '+6.8%', plan: '<7.0%', variance: '-0.2pp', varianceColor: 'green' as const, trend: 'up' as const },
      { driver: 'Prior-Year Development', actual: '+$0.3B', plan: 'Neutral', variance: 'Favorable', varianceColor: 'green' as const, trend: 'up' as const },
    ]},
    { category: 'Medicare Advantage', rows: [
      { driver: 'MA Enrollment', actual: '~11.5M', plan: '12.0M+', variance: '-500K', varianceColor: 'red' as const, trend: 'down' as const },
      { driver: 'MA Operating Margin', actual: '~1.5%', plan: '3.0% by 2028', variance: 'In recovery', varianceColor: 'green' as const, trend: 'up' as const },
      { driver: '4+ Star Plan Enrollment', actual: '~88%', plan: '>90%', variance: '-2pp', varianceColor: 'red' as const, trend: 'up' as const },
    ]},
    { category: 'Medicaid & Commercial', rows: [
      { driver: 'Total HCB Membership', actual: '26.0M', plan: '26.5M+', variance: '-500K', varianceColor: 'red' as const, trend: 'up' as const },
      { driver: 'Commercial Group Retention', actual: '>95%', plan: '>95%', variance: 'On target', varianceColor: 'green' as const, trend: 'flat' as const },
      { driver: 'HCB Revenue YoY', actual: `+${data.financials.latestQuarter.revenueYoY}%`, plan: '+4%', variance: `${(data.financials.latestQuarter.revenueYoY - 4).toFixed(1)}pp`, varianceColor: data.financials.latestQuarter.revenueYoY >= 4 ? 'green' as const : 'red' as const, trend: 'up' as const },
    ]},
  ], [data]);

  const attentionItems = useMemo(() => [
    { id: 'a1', severity: 'warning' as const, title: 'MBR will deteriorate to ~90-92% in Q3/Q4 FY26', detail: 'Q1 84.6% is seasonal; full-year FY26 guidance is 90.5% (±50bps). Q3/Q4 historically 91–93% as member deductibles exhaust and utilization surges.', actionTab: 'drivers' },
    { id: 'a2', severity: 'warning' as const, title: 'MA enrollment -200K vs prior year; target gap remains', detail: 'Deliberate margin repositioning away from 2024 underbid cohorts. 2026 AEP enrollment will be the first test of repriced plan competitiveness.', actionTab: 'drivers' },
    { id: 'a3', severity: 'info' as const, title: 'GLP-1 cost trend +12% YoY — largest single medical cost accelerant', detail: 'Ozempic and Wegovy utilization growth driving specialty pharmacy and medical cost trend above overall +6.8% rate. Prior-auth discipline and formulary management are primary mitigants.', actionTab: 'bridge' },
  ], []);

  return (
    <ConsoleShell config={northAmericaConfig}>
      {({ activeTab, setActiveTab, selectedDriverId, setSelectedDriverId }) => {
        switch (activeTab) {
          case 'overview':
            return (
              <OverviewTab
                heroKPIs={heroKPIs}
                insights={insights}
                drivers={driverMatrix}
                attentionItems={attentionItems}
                performanceSummary={narrativeBrief}
                onNavigateToDrivers={(id) => { setSelectedDriverId(id); setActiveTab('drivers'); }}
                onNavigateToTab={setActiveTab}
              />
            );
          case 'drivers':
            return (
              <DriversTab
                driverTree={driverTree}
                selectedDriverId={selectedDriverId}
                onSelectDriver={setSelectedDriverId}
                getDriverDetail={getDriverDetail}
              />
            );
          case 'bridge':
            return (
              <BridgeTab
                title="HCB Revenue & AOI Bridge"
                periodLabel={`${data.financials.latestQuarter.quarter} vs Prior Year`}
                totalVariance="1075"
                totalVariancePercent="+3.1%"
                items={bridgeItems}
              />
            );
          case 'data':
            return (
              <DataTab
                quarterLabels={quarterLabels}
                plData={plData}
                driverData={driverDataForTable}
              />
            );
          default:
            return (
              <OverviewTab
                heroKPIs={heroKPIs}
                insights={insights}
                drivers={driverMatrix}
                attentionItems={attentionItems}
                performanceSummary={narrativeBrief}
                onNavigateToDrivers={(id) => { setSelectedDriverId(id); setActiveTab('drivers'); }}
                onNavigateToTab={setActiveTab}
              />
            );
        }
      }}
    </ConsoleShell>
  );
}
