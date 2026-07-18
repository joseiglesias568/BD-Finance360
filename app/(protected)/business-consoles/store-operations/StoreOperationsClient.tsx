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
import type { StoreOperationsPageData } from './types';
import { storeOperationsConfig } from './config';

interface StoreOperationsClientProps {
  data: StoreOperationsPageData;
}

// =============================================================================
// Data Mappers — BD: Pharmacy & Consumer Wellness (PCW)
// SOURCE: BD Q1 FY26 Earnings (May 2026), FY2025 10-K, FY2026 Guidance
// ~9,000 CVS Pharmacy locations; ~1,100 HealthHUB; ~1,200 MinuteClinic
// =============================================================================

function buildHeroKPIs(_data: StoreOperationsPageData): HeroKPI[] {
  return [
    {
      id: 'same-store-rx', label: 'Same-Store Rx Growth',
      value: '+7.0%',
      change: '+7.0% YoY',
      changeDirection: 'up',
      sparkline: [4.2, 5.1, 6.0, 6.8, 7.0],
      target: '≥+6.0% FY26',
      gap: '+1.0pp above target',
      status: 'good',
      subDrivers: [
        { name: 'GLP-1 Volume Contribution', impact: '+3.2pp', direction: 'positive' as const },
        { name: 'Specialty Rx Pickup', impact: '+1.8pp', direction: 'positive' as const },
        { name: 'Reimbursement Rate Pressure', impact: '-1.2pp', direction: 'negative' as const },
      ],
      aiInsight: 'Same-store Rx growth of +7.0% YoY significantly exceeds the ≥6% target, driven by GLP-1 prescription surge (+34% vs +22% plan) and specialty drug pickup-at-retail growth. Reimbursement rate pressure from PBM contract renewals creates an ongoing -1.2pp drag; management expects this headwind to moderate in H2 FY26 as contract resets cycle through.',
      driversTabId: 'rx-volume',
    },
    {
      id: 'annual-rx-volume', label: 'Annual Rx Volume',
      value: '1.85B',
      unit: 'scripts (annualized)',
      change: '+7% YoY',
      changeDirection: 'up',
      sparkline: [1.72, 1.75, 1.80, 1.83, 1.85],
      target: '≥1.865B FY26',
      gap: '-15M scripts to target',
      status: 'good',
      subDrivers: [
        { name: 'Retail Pharmacy Scripts', impact: '~1.58B', direction: 'positive' as const },
        { name: 'Specialty Retail Scripts', impact: '~180M', direction: 'positive' as const },
        { name: 'Mail Order (Caremark)', impact: '~90M', direction: 'positive' as const },
      ],
      aiInsight: 'Annualized Rx volume of ~1.85B is tracking to the ≥1.865B FY26 target with Q2–Q4 seasonality supporting the trajectory. CVS holds >29% national prescription market share — the largest single retail pharmacy footprint in the US.',
      driversTabId: 'rx-volume',
    },
    {
      id: 'glp1-share', label: 'GLP-1 Market Share',
      value: '~29%',
      change: '+200bps initiative',
      changeDirection: 'up',
      sparkline: [26, 27, 28, 28.5, 29],
      target: '>31% by YE2026',
      gap: '-2pp to target',
      status: 'warning',
      subDrivers: [
        { name: 'GLP-1 Rx Volume Growth', impact: '+34% YoY', direction: 'positive' as const },
        { name: 'DTC Marketing Initiative', impact: '+1.2pp share lift', direction: 'positive' as const },
        { name: 'Competitor Capacity (Walgreens)', impact: 'Price pressure', direction: 'negative' as const },
      ],
      aiInsight: 'GLP-1 prescription market share at ~29%, tracking toward >31% target via the +200bps share gain initiative. GLP-1 volume growth of +34% YoY significantly exceeded the +22% plan, driven by Ozempic and Wegovy demand acceleration. DTC outreach and CVS Caremark formulary management are key share-gain levers.',
      driversTabId: 'glp1-specialty',
    },
    {
      id: 'pcw-aoi', label: 'PCW AOI',
      value: '$1.20B',
      unit: 'Q1 FY26',
      change: '+$80M YoY',
      changeDirection: 'up',
      sparkline: [1.05, 1.08, 1.14, 1.18, 1.20],
      target: '≥$6.18B FY26',
      gap: 'Q1 run-rate implies ~$4.8B annualized',
      status: 'warning',
      subDrivers: [
        { name: 'Rx Volume Leverage', impact: '+$180M', direction: 'positive' as const },
        { name: 'GLP-1 Mix (Lower Margin)', impact: '-$65M', direction: 'negative' as const },
        { name: 'Reimbursement Pressure', impact: '-$45M', direction: 'negative' as const },
      ],
      aiInsight: 'PCW AOI of $1.20B in Q1 FY26 reflects strong volume leverage partially offset by GLP-1 margin mix (GLP-1s carry lower gross margin % than traditional Rx) and ongoing reimbursement rate pressure. Full-year target of ≥$6.18B requires $5.0B+ in Q2–Q4, with GLP-1 volume growth and HealthHUB clinical services revenue as key swing factors.',
      driversTabId: 'pcw-profitability',
    },
  ];
}

function buildPulseInsights(_data: StoreOperationsPageData): PulseInsight[] {
  return [
    {
      id: '1', severity: 'positive',
      headline: 'GLP-1 volume +34% vs +22% plan — CVS capturing outsized Ozempic/Wegovy share',
      detail: 'GLP-1 prescription growth significantly exceeded the +22% plan at +34% YoY in Q1 FY26. CVS Pharmacy\'s combination of retail access, Caremark PBM formulary influence, and digital convenience is driving outsized market share gains vs Walgreens. DTC marketing initiative targeting an additional +200bps market share to >31% by YE2026.',
      action: 'View GLP-1 Analysis', actionTab: 'drivers',
    },
    {
      id: '2', severity: 'warning',
      headline: 'Reimbursement rate pressure -$45M Q1 headwind — PBM contract renewals cycle',
      detail: 'Pharmacy reimbursement pressure from PBM contract renewals generated -$45M AOI headwind in Q1 FY26. This is an industry-wide dynamic as PBMs (including CVS Caremark itself) drive harder generic and specialty net cost terms. Management expects the rate pressure to moderate in H2 FY26 as the worst renewal cohorts cycle through. Generic dispensing rate at 89% mitigates impact.',
      action: 'View Cost Bridge', actionTab: 'bridge',
    },
    {
      id: '3', severity: 'positive',
      headline: 'HealthHUB driving +15% clinical revenue uplift vs standard CVS formats',
      detail: '~1,100 HealthHUB locations now generate an estimated 15% higher total revenue per store vs standard CVS Pharmacy format. MinuteClinic visits at ~3.2M/quarter. HealthHUB expansion to 1,300+ by YE2026 is a key PCW growth lever. Aetna member coinsurance waiver at HealthHUB locations is accelerating utilization.',
      action: 'View HealthHUB Drivers', actionTab: 'drivers',
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

function buildDriverMatrix(data: StoreOperationsPageData): DriverMatrixRow[] {
  const opsConsole = data.opsConsole;
  if (opsConsole?.keyDrivers?.length) {
    return opsConsole.keyDrivers.slice(0, 6).map((kd, idx) => {
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
    { id: 'rx-volume', name: 'Pharmacy Volume & Script Share', score: 88, trend: '+7.0%', trendDirection: 'up', gap: '+1pp to target', status: 'good', subDrivers: ['Same-Store Rx Growth', 'Market Share >29%', 'Annual Rx Volume 1.85B'] },
    { id: 'glp1-specialty', name: 'GLP-1 & Specialty Growth', score: 82, trend: '+34% GLP-1', trendDirection: 'up', gap: '-2pp share target', status: 'good', subDrivers: ['GLP-1 Volume', 'Specialty Pickup', 'DTC Initiative'] },
    { id: 'reimbursement', name: 'Reimbursement & Margin', score: 55, trend: '-1.2pp', trendDirection: 'down', gap: '-$45M Q1', status: 'warning', subDrivers: ['PBM Contract Terms', 'Generic Rate', 'Brand Spread'] },
    { id: 'healthhub', name: 'HealthHUB & Clinical Services', score: 80, trend: '~1,100', trendDirection: 'up', gap: '-200 to 1,300 target', status: 'good', subDrivers: ['HealthHUB Count', 'MinuteClinic Visits', 'Aetna Integration'] },
    { id: 'front-store', name: 'Front-Store & OTC Revenue', score: 65, trend: '~$4.8B/Q', trendDirection: 'up', gap: '-$0.2B to target', status: 'warning', subDrivers: ['OTC Revenue', 'Private Label Mix', 'Health Category'] },
    { id: 'pcw-profitability', name: 'PCW Profitability (AOI)', score: 70, trend: '$1.20B', trendDirection: 'up', gap: 'Q4 depends on GLP-1', status: 'warning', subDrivers: ['Rx Volume Leverage', 'GLP-1 Mix Drag', 'SG&A Efficiency'] },
  ];
}

function buildDriverTree(_data: StoreOperationsPageData): DriverNode[] {
  return [
    {
      id: 'rx-volume', name: 'Pharmacy Volume & Script Share', value: '+7.0%', unit: 'same-store Rx growth', status: 'good',
      children: [
        {
          id: 'same-store-growth', name: 'Same-Store Rx Growth', value: '+7.0%', status: 'good',
          children: [
            { id: 'glp1-volume', name: 'GLP-1 Volume (Ozempic/Wegovy)', value: '+34% YoY', status: 'good' },
            { id: 'specialty-retail', name: 'Specialty Retail Pickup', value: '+1.8pp contribution', status: 'good' },
            { id: 'reimbursement-drag', name: 'Reimbursement Rate Drag', value: '-1.2pp headwind', status: 'warning' },
          ],
        },
        { id: 'market-share', name: 'National Script Market Share', value: '>29%', status: 'good' },
        { id: 'annual-rx', name: 'Annual Rx Volume', value: '~1.85B (vs ≥1.865B target)', status: 'warning' },
      ],
    },
    {
      id: 'glp1-specialty', name: 'GLP-1 & Specialty Pharmacy', value: '~29% GLP-1 share', status: 'warning',
      children: [
        { id: 'glp1-market-share', name: 'GLP-1 Rx Market Share', value: '~29% (tgt >31%)', status: 'warning' },
        { id: 'glp1-volume-growth', name: 'GLP-1 Volume Growth', value: '+34% YoY vs +22% plan', status: 'good' },
        { id: 'specialty-claims', name: 'Specialty Drug Script Volume', value: '~180M annualized', status: 'good',
          children: [
            { id: 'oncology-rx', name: 'Oncology Specialty', value: '+12% YoY', status: 'good' },
            { id: 'immunology-rx', name: 'Immunology/Biosimilar', value: '+18% YoY', status: 'good' },
          ],
        },
      ],
    },
    {
      id: 'healthhub', name: 'HealthHUB & Clinical Services', value: '~1,100 locations', status: 'good',
      children: [
        { id: 'healthhub-count', name: 'HealthHUB Locations', value: '~1,100 (tgt 1,300+)', status: 'warning' },
        { id: 'minuteclinic', name: 'MinuteClinic Visits', value: '~3.2M/quarter', status: 'good' },
        { id: 'aetna-waiver', name: 'Aetna Member Copay Waiver Program', value: 'Active — driving HealthHUB utilization', status: 'good' },
      ],
    },
    {
      id: 'pcw-profitability', name: 'PCW Profitability (AOI)', value: '$1.20B Q1', status: 'warning',
      children: [
        { id: 'rx-margin', name: 'Pharmacy Gross Margin', value: '~21% blended', status: 'warning' },
        { id: 'glp1-margin-mix', name: 'GLP-1 Margin Mix Impact', value: '-$65M Q1 drag', status: 'warning' },
        { id: 'sga-efficiency', name: 'Store-Level SG&A', value: 'Health100 contributing', status: 'good' },
      ],
    },
    {
      id: 'front-store', name: 'Front-Store & OTC Revenue', value: '~$4.8B/quarter', status: 'warning',
      children: [
        { id: 'otc-health', name: 'OTC & Health Category', value: '+4.2% YoY', status: 'good' },
        { id: 'private-label', name: 'CVS Private Label Penetration', value: '~22% (tgt >25%)', status: 'warning' },
        { id: 'beauty-personal', name: 'Beauty & Personal Care', value: '+2.8% YoY', status: 'good' },
      ],
    },
  ];
}

function buildDriverDetail(id: string, _data: StoreOperationsPageData): DriverDetailData | null {
  const map: Record<string, DriverDetailData> = {
    'rx-volume': {
      id: 'rx-volume', name: 'Pharmacy Volume & Script Share',
      description: 'Same-store prescription growth and national market share — the primary PCW revenue driver.',
      value: '+7.0%', unit: 'same-store Rx growth', target: '≥+6.0% FY26', gap: '+1.0pp above target',
      trend: 'up', trendValue: '+7.0% YoY', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 4.2, target: 6.0 },
        { period: 'Q2 FY25', actual: 5.5, target: 6.0 },
        { period: 'Q3 FY25', actual: 6.3, target: 6.0 },
        { period: 'Q4 FY25', actual: 7.0, target: 6.0 },
      ],
      subDrivers: [
        { name: 'GLP-1 Volume Contribution', contribution: 3.2, unit: 'pp to same-store growth' },
        { name: 'Specialty Retail Pickup', contribution: 1.8, unit: 'pp to same-store growth' },
        { name: 'Core Rx Volume', contribution: 3.2, unit: 'pp to same-store growth' },
        { name: 'Reimbursement Rate Drag', contribution: -1.2, unit: 'pp headwind' },
      ],
      variance: { actual: '+7.0%', plan: '≥+6.0%', priorYear: '+4.2%' },
      aiInsight: 'Same-store Rx growth of +7.0% significantly exceeds the ≥6% FY26 target, driven by GLP-1 volume acceleration (+34% YoY vs +22% plan) and specialty drug pickup-at-retail growth. CVS Pharmacy holds >29% national script share — its largest retail network advantage. The +1.2pp reimbursement drag reflects ongoing PBM contract renegotiations; this headwind is expected to moderate in H2 FY26.',
      crossRefs: [{ label: 'Health Services (Caremark PBM)', consoleId: 'international-performance' }],
    },
    'glp1-specialty': {
      id: 'glp1-specialty', name: 'GLP-1 & Specialty Pharmacy Growth',
      description: 'GLP-1 prescription market share and specialty drug volume — the fastest-growing PCW segment.',
      value: '+34%', unit: 'GLP-1 volume growth YoY', target: '+22% plan', gap: '+12pp above plan',
      trend: 'up', trendValue: '+34% vs +22% plan', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 18, target: 22 },
        { period: 'Q2 FY25', actual: 24, target: 22 },
        { period: 'Q3 FY25', actual: 28, target: 22 },
        { period: 'Q4 FY25', actual: 34, target: 22 },
      ],
      subDrivers: [
        { name: 'GLP-1 Market Share', contribution: 29, unit: '%' },
        { name: 'GLP-1 Share Target (YE2026)', contribution: 31, unit: '%' },
        { name: 'Semaglutide Volume (Ozempic/Wegovy)', contribution: 34, unit: '% YoY growth' },
        { name: 'DTC Initiative Share Lift', contribution: 1.2, unit: 'pp YTD share gain' },
      ],
      variance: { actual: '+34%', plan: '+22%', priorYear: '+18%' },
      aiInsight: 'GLP-1 prescription growth of +34% YoY vastly exceeded the +22% plan, reflecting accelerating Ozempic and Wegovy demand as weight management treatment becomes mainstream. CVS Pharmacy\'s Caremark PBM formulary relationship and retail network density create a compounding advantage in GLP-1 dispensing share. GLP-1s now represent a meaningful share of same-store growth but carry lower gross margin % than traditional Rx — driving the margin mix headwind in PCW AOI.',
    },
    'reimbursement': {
      id: 'reimbursement', name: 'Reimbursement Rate & Margin',
      description: 'Pharmacy reimbursement rates from PBMs and government programs — the primary PCW margin pressure.',
      value: '-1.2pp', unit: 'drag on same-store growth', target: '<-0.5pp FY26 exit rate', gap: '-0.7pp worse than target',
      trend: 'up', trendValue: 'Improving from -1.5pp', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: -1.5, target: -0.5 },
        { period: 'Q2 FY25', actual: -1.4, target: -0.5 },
        { period: 'Q3 FY25', actual: -1.3, target: -0.5 },
        { period: 'Q4 FY25', actual: -1.2, target: -0.5 },
      ],
      subDrivers: [
        { name: 'PBM Reimbursement Rate Change', contribution: -0.8, unit: 'pp' },
        { name: 'Medicaid Managed Care Rate Change', contribution: -0.3, unit: 'pp' },
        { name: 'Medicare Part D DIR Fees', contribution: -0.1, unit: 'pp' },
      ],
      variance: { actual: '-1.2pp drag', plan: '<-0.5pp', priorYear: '-1.5pp' },
      aiInsight: 'Reimbursement pressure improving sequentially: -1.2pp drag vs -1.5pp in Q1 FY25. The primary headwind is PBM contract renewals (including CVS Caremark\'s own TrueCost net-cost model transition), which drives harder generic and specialty reimbursement terms. Generic dispensing rate at 89% partially mitigates the impact. DIR fee reform under Part D is creating near-term accounting complexity but long-term favorability.',
    },
    'healthhub': {
      id: 'healthhub', name: 'HealthHUB & Clinical Services',
      description: 'HealthHUB expanded format stores and MinuteClinic visit volumes — the PCW clinical services growth engine.',
      value: '~1,100', unit: 'HealthHUB locations', target: '1,300+ by YE2026', gap: '-200 locations',
      trend: 'up', trendValue: '+150 net new FY26 plan', status: 'good',
      trendData: [
        { period: 'Q1 FY25', actual: 900, target: 1300 },
        { period: 'Q2 FY25', actual: 970, target: 1300 },
        { period: 'Q3 FY25', actual: 1040, target: 1300 },
        { period: 'Q4 FY25', actual: 1100, target: 1300 },
      ],
      subDrivers: [
        { name: 'HealthHUB Revenue Premium', contribution: 15, unit: '% higher vs standard CVS' },
        { name: 'MinuteClinic Visits', contribution: 3.2, unit: 'M/quarter' },
        { name: 'Aetna Member Copay Waiver Utilization', contribution: 22, unit: '% of HealthHUB patient visits' },
      ],
      variance: { actual: '~1,100', plan: '1,300+ by YE2026', priorYear: '~900' },
      aiInsight: 'HealthHUB locations generate ~15% higher total revenue than standard CVS formats through expanded clinical services, chronic disease management, and health product assortment. Aetna member coinsurance waivers at HealthHUB locations are driving a 22% share of patient visits from Aetna membership — a powerful integrated care flywheel. MinuteClinic at 3.2M visits/quarter remains a key entry point for clinical care.',
    },
    'pcw-profitability': {
      id: 'pcw-profitability', name: 'PCW Adjusted Operating Income',
      description: 'PCW segment AOI — the financial output of pharmacy volume, mix, and margin management.',
      value: '$1.20B', unit: 'Q1 FY26 AOI', target: '≥$6.18B FY26', gap: 'Q1 run-rate ~$4.8B vs ≥$6.18B',
      trend: 'up', trendValue: '+$80M YoY', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 1.12, target: 1.55 },
        { period: 'Q2 FY25', actual: 1.40, target: 1.55 },
        { period: 'Q3 FY25', actual: 1.52, target: 1.55 },
        { period: 'Q4 FY25', actual: 1.20, target: 1.55 },
      ],
      subDrivers: [
        { name: 'Rx Volume Leverage', contribution: 180, unit: '$M benefit' },
        { name: 'GLP-1 Margin Mix Drag', contribution: -65, unit: '$M headwind' },
        { name: 'Reimbursement Pressure', contribution: -45, unit: '$M headwind' },
        { name: 'Front-Store & Clinical Revenue', contribution: 30, unit: '$M benefit' },
      ],
      variance: { actual: '$1.20B', plan: '≥$1.55B/quarter', priorYear: '$1.12B' },
      aiInsight: 'PCW AOI of $1.20B in Q1 FY26 reflects Q1 seasonal pattern (Q1 typically lower than Q2–Q4 due to front-store seasonality). Q1 run-rate of ~$4.8B annualized is below the ≥$6.18B FY26 target, requiring $5.0B+ in Q2–Q4 combined. Key swing factors: GLP-1 volume trajectory, reimbursement rate trajectory, and HealthHUB expansion clinical revenue ramp.',
    },
    'front-store': {
      id: 'front-store', name: 'Front-Store & OTC Revenue',
      description: 'CVS Pharmacy non-Rx merchandise revenue — health, beauty, and OTC categories.',
      value: '~$4.8B', unit: 'per quarter', target: '>$5.0B/quarter', gap: '-$0.2B',
      trend: 'up', trendValue: '+3.5% YoY', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 4.6, target: 5.0 },
        { period: 'Q2 FY25', actual: 4.7, target: 5.0 },
        { period: 'Q3 FY25', actual: 4.8, target: 5.0 },
        { period: 'Q4 FY25', actual: 4.8, target: 5.0 },
      ],
      subDrivers: [
        { name: 'OTC Health Category', contribution: 4.2, unit: '% YoY growth' },
        { name: 'Private Label Penetration', contribution: 22, unit: '% of front-store (tgt >25%)' },
        { name: 'Beauty & Personal Care', contribution: 2.8, unit: '% YoY growth' },
      ],
      variance: { actual: '~$4.8B', plan: '>$5.0B', priorYear: '~$4.6B' },
      aiInsight: 'Front-store revenue growing at +3.5% YoY, below the pharmacy growth rate. Private label penetration at 22% — 3pp below the >25% target, representing a margin improvement opportunity. Health category (OTC, vitamins, diagnostics) growing fastest at +4.2%.',
    },
  };

  return map[id] || null;
}

function buildBridgeItems(_data: StoreOperationsPageData): BridgeCommentary[] {
  return [
    {
      id: 'b1', component: 'Rx Volume & Same-Store Growth Leverage', value: 480, percentImpact: '+3.1%',
      aiSuggestion: 'Same-store prescription growth of +7.0% YoY generated +$480M AOI contribution through volume leverage on fixed pharmacy infrastructure costs. GLP-1 and specialty volume drove the majority of incremental script growth.',
      status: 'approved' as const,
      subItems: [
        { name: 'GLP-1 Volume Contribution', value: 190, description: '+34% GLP-1 growth, ~29% market share' },
        { name: 'Core & Specialty Rx Volume', value: 290, description: '+5.2% ex-GLP-1 same-store growth' },
      ],
    },
    {
      id: 'b2', component: 'GLP-1 Gross Margin Mix Drag', value: -65, percentImpact: '-0.4%',
      aiSuggestion: 'GLP-1 prescriptions carry lower gross margin % than traditional branded or generic Rx due to limited reimbursement spread and high acquisition cost. As GLP-1 becomes a larger share of total Rx volume, it creates a structural margin mix headwind even as total volume grows.',
      status: 'submitted' as const,
      subItems: [],
    },
    {
      id: 'b3', component: 'PBM Reimbursement Rate Pressure', value: -145, percentImpact: '-0.9%',
      aiSuggestion: 'PBM contract renewals (including TrueCost transitions on Caremark side) driving -$145M reimbursement rate headwind. Medicare Part D DIR fee impact also contributing. Management expects H2 FY26 exit rate to improve as worst cohorts anniversary.',
      status: 'submitted' as const,
      subItems: [],
    },
    {
      id: 'b4', component: 'HealthHUB & MinuteClinic Revenue', value: 95, percentImpact: '+0.6%',
      aiSuggestion: '~1,100 HealthHUB locations contributed +$95M incremental AOI vs prior year from expanded clinical services. MinuteClinic visit growth and Aetna coinsurance waiver program driving patient throughput. HealthHUB stores average 15% higher total revenue than standard format.',
      status: 'approved' as const,
      subItems: [],
    },
    {
      id: 'b5', component: 'Front-Store Revenue & Private Label Mix', value: 45, percentImpact: '+0.3%',
      aiSuggestion: 'Front-store revenue contribution of +$45M from OTC health category (+4.2%), beauty/personal care (+2.8%), and continued private label penetration gain (now 22%). Private label gross margin differential vs national brands is the primary mix uplift driver.',
      status: 'draft' as const,
      subItems: [],
    },
    {
      id: 'b6', component: 'Store Optimization & Health100 SG&A Savings', value: 70, percentImpact: '+0.4%',
      aiSuggestion: 'Store-level SG&A efficiency improved +$70M YoY from Health100 program savings, digital work order improvements, and store count optimization (closure of ~300 underperforming locations in FY25). Remaining store base now has stronger average economics.',
      status: 'approved' as const,
      subItems: [],
    },
  ];
}

// =============================================================================
// Main Component
// =============================================================================

export default function StoreOperationsClient({ data }: StoreOperationsClientProps) {
  const heroKPIs = useMemo(() => buildHeroKPIs(data), [data]);
  const insights = useMemo(() => buildPulseInsights(data), [data]);
  const driverMatrix = useMemo(() => buildDriverMatrix(data), [data]);
  const driverTree = useMemo(() => buildDriverTree(data), [data]);
  const bridgeItems = useMemo(() => buildBridgeItems(data), [data]);
  const getDriverDetail = useCallback((id: string) => buildDriverDetail(id, data), [data]);

  const narrativeBrief = useMemo(() => ({
    title: 'PCW & Pharmacy Operations Summary',
    period: 'Q1 FY26',
    summary: `CVS Pharmacy & Consumer Wellness delivered same-store prescription growth of +7.0% YoY in Q1 FY26 — significantly exceeding the ≥6% plan, driven by GLP-1 prescription surge (+34% vs +22% plan) and specialty drug pickup-at-retail growth.\n\nAnnualized Rx volume tracking at ~1.85B vs the ≥1.865B FY26 target. CVS holds >29% national script market share — the largest single retail pharmacy network in the US. GLP-1 market share at ~29%, with the +200bps DTC initiative targeting >31% by YE2026.\n\nPCW AOI of $1.20B in Q1 reflects volume leverage partially offset by GLP-1 margin mix drag (-$65M) and ongoing PBM reimbursement pressure (-$145M annualized). HealthHUB expansion to ~1,100 locations contributing 15% revenue premium vs standard format. Full-year PCW AOI target of ≥$6.18B requires H2 acceleration as GLP-1 volume trajectory and HealthHUB clinical revenue ramp.`,
    keyTakeaways: [
      'Same-store Rx growth +7.0% YoY — 1pp above ≥6% target; GLP-1 +34% vs +22% plan driving majority of outperformance',
      'GLP-1 Rx market share at ~29%; +200bps DTC initiative targeting >31% vs Walgreens by YE2026',
      'Annualized Rx volume ~1.85B vs ≥1.865B FY26 target; national script share >29%',
      'PCW AOI $1.20B Q1 — GLP-1 margin mix drag and reimbursement pressure partially offset volume leverage',
      'HealthHUB ~1,100 locations (+15% revenue premium vs standard); MinuteClinic 3.2M visits/quarter',
    ],
    overallStatus: 'warning' as const,
  }), []);

  const quarterLabels = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25'];
  const plData = useMemo(() => [
    {
      label: 'PCW Revenue', isCategory: true,
      quarters: [
        { actual: '$27.1B', variance: '+5.8%', varianceColor: 'green' as const },
        { actual: '$29.5B', variance: '+6.2%', varianceColor: 'green' as const },
        { actual: '$30.2B', variance: '+7.0%', varianceColor: 'green' as const },
        { actual: '$28.8B', variance: '+7.0%', varianceColor: 'green' as const },
      ],
      children: [
        {
          label: 'Pharmacy Revenue', quarters: [
            { actual: '$23.8B', variance: '+7.0%', varianceColor: 'green' as const },
            { actual: '$25.9B', variance: '+7.5%', varianceColor: 'green' as const },
            { actual: '$26.5B', variance: '+8.0%', varianceColor: 'green' as const },
            { actual: '$25.2B', variance: '+7.5%', varianceColor: 'green' as const },
          ],
        },
        {
          label: 'Front-Store & Clinical Revenue', quarters: [
            { actual: '$3.3B', variance: '+2.8%', varianceColor: 'green' as const },
            { actual: '$3.6B', variance: '+3.5%', varianceColor: 'green' as const },
            { actual: '$3.7B', variance: '+3.2%', varianceColor: 'green' as const },
            { actual: '$3.6B', variance: '+3.8%', varianceColor: 'green' as const },
          ],
        },
      ],
    },
    {
      label: 'Cost of Goods (Drug Acquisition + Reimbursement)', isCategory: true,
      quarters: [
        { actual: '$24.1B', variance: '+6.5%', varianceColor: 'red' as const },
        { actual: '$26.3B', variance: '+6.8%', varianceColor: 'red' as const },
        { actual: '$26.9B', variance: '+7.2%', varianceColor: 'red' as const },
        { actual: '$25.7B', variance: '+7.0%', varianceColor: 'red' as const },
      ],
      children: [
        {
          label: 'Drug Acquisition Cost (GLP-1 / Specialty)', quarters: [
            { actual: 'Embedded in COGS', variance: 'GLP-1 +34%', varianceColor: 'red' as const },
            { actual: 'Embedded in COGS', variance: 'GLP-1 +34%', varianceColor: 'red' as const },
            { actual: 'Embedded in COGS', variance: 'GLP-1 +34%', varianceColor: 'red' as const },
            { actual: 'Embedded in COGS', variance: 'GLP-1 +34%', varianceColor: 'red' as const },
          ],
        },
      ],
    },
    {
      label: 'PCW Adjusted Operating Income', isTotal: true,
      quarters: [
        { actual: '$1.12B', variance: '+$80M YoY', varianceColor: 'green' as const },
        { actual: '$1.42B', variance: '+$95M YoY', varianceColor: 'green' as const },
        { actual: '$1.52B', variance: '+$110M YoY', varianceColor: 'green' as const },
        { actual: '$1.20B', variance: '+$80M YoY', varianceColor: 'green' as const },
      ],
    },
  ], []);

  const driverDataForTable = useMemo(() => [
    {
      category: 'Pharmacy Volume & Rx Metrics', rows: [
        { driver: 'Same-Store Rx Growth', actual: '+7.0%', plan: '≥+6.0%', variance: '+1.0pp', varianceColor: 'green' as const, trend: 'up' as const },
        { driver: 'GLP-1 Rx Volume Growth', actual: '+34%', plan: '+22%', variance: '+12pp', varianceColor: 'green' as const, trend: 'up' as const },
        { driver: 'Annual Rx Volume', actual: '~1.85B', plan: '≥1.865B', variance: '-15M scripts', varianceColor: 'red' as const, trend: 'up' as const },
        { driver: 'National Script Market Share', actual: '>29%', plan: '>29%', variance: 'On target', varianceColor: 'green' as const, trend: 'flat' as const },
      ],
    },
    {
      category: 'Margin & Reimbursement', rows: [
        { driver: 'Reimbursement Rate Drag', actual: '-1.2pp', plan: '<-0.5pp', variance: '-0.7pp worse', varianceColor: 'red' as const, trend: 'up' as const },
        { driver: 'Generic Dispensing Rate', actual: '89%', plan: '>89%', variance: 'On target', varianceColor: 'green' as const, trend: 'flat' as const },
        { driver: 'GLP-1 Margin Mix Drag', actual: '-$65M', plan: '-$40M', variance: '-$25M worse', varianceColor: 'red' as const, trend: 'down' as const },
      ],
    },
    {
      category: 'HealthHUB & Clinical', rows: [
        { driver: 'HealthHUB Locations', actual: '~1,100', plan: '1,300+ YE2026', variance: '-200 locations', varianceColor: 'red' as const, trend: 'up' as const },
        { driver: 'MinuteClinic Visits', actual: '~3.2M/quarter', plan: '≥3.5M/quarter', variance: '-0.3M', varianceColor: 'red' as const, trend: 'up' as const },
        { driver: 'Private Label Penetration', actual: '~22%', plan: '>25%', variance: '-3pp', varianceColor: 'red' as const, trend: 'up' as const },
      ],
    },
  ], []);

  const attentionItems = useMemo(() => [
    { id: 'a1', severity: 'warning' as const, title: 'PCW AOI Q1 run-rate below ≥$6.18B FY26 target', detail: 'Q1 $1.20B annualizes to ~$4.8B vs ≥$6.18B. Q2–Q4 requires $5.0B+ combined. GLP-1 volume and HealthHUB ramp are key swing factors.', actionTab: 'bridge' },
    { id: 'a2', severity: 'warning' as const, title: 'Reimbursement pressure -$145M annualized headwind', detail: 'PBM contract renewals and Medicare DIR fees creating ongoing margin drag. H2 FY26 expected to improve as worst cohorts anniversary.', actionTab: 'drivers' },
    { id: 'a3', severity: 'positive' as const, title: 'GLP-1 volume +34% vs +22% plan — significant upside surprise', detail: 'Ozempic/Wegovy demand accelerating faster than modeled. DTC initiative targeting additional +200bps market share to >31% by YE2026 vs Walgreens.', actionTab: 'drivers' },
  ], []);

  return (
    <ConsoleShell config={storeOperationsConfig}>
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
                title="PCW & Pharmacy Operations AOI Bridge"
                periodLabel="Q1 FY26 vs Q1 FY25"
                totalVariance="480"
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
