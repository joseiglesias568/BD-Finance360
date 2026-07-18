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
import type { DigitalLoyaltyPageData } from './types';
import { digitalLoyaltyConfig } from './config';

interface DigitalLoyaltyClientProps {
  data: DigitalLoyaltyPageData;
}

// =============================================================================
// Data Mappers
// =============================================================================

function buildHeroKPIs(data: DigitalLoyaltyPageData): HeroKPI[] {
  const { kpis } = data;
  const allKPIs = [...kpis.primaryKPIs, ...kpis.operationalKPIs, ...kpis.digitalKPIs, ...kpis.financialKPIs];
  const platformKPI = allKPIs.find((k) => k.label.toLowerCase().includes('platform') || k.label.toLowerCase().includes('proptech'));

  return [
    {
      id: 'platform-users', label: 'Platform Users',
      value: platformKPI ? String(platformKPI.value) : '42.5K',
      unit: platformKPI?.unit || 'active clients',
      change: platformKPI?.trendValue || '+12% YoY',
      changeDirection: 'up',
      sparkline: [32, 34, 36, 38, 40, 41.5, 42.5],
      target: '50K',
      gap: '-7.5K',
      status: 'good',
      subDrivers: [
        { name: '90-day Active Rate', impact: '72%', direction: 'positive' as const },
        { name: 'New Onboardings', impact: '+15% QoQ', direction: 'positive' as const },
        { name: 'Enterprise Tier %', impact: '38%', direction: 'positive' as const },
      ],
      aiInsight: 'AMI reached 1.4M active smart meters (tracking toward 2.0M 2026 milestone), representing 68% engagement on AMI platform. Growth driven by Missouri/Illinois customer onboarding and expanded smart grid digital capabilities.',
      driversTabId: 'platform-growth',
    },
    {
      id: 'proptech-adoption', label: 'AMI Adoption',
      value: '62%',
      change: '+8pp YoY',
      changeDirection: 'up',
      sparkline: [42, 46, 50, 54, 57, 60, 62],
      target: '70%',
      gap: '-8pp',
      status: 'good',
      subDrivers: [
        { name: 'Client Portal Usage', impact: '78%', direction: 'positive' as const },
        { name: 'Digital Twin Adoption', impact: '45%', direction: 'positive' as const },
        { name: 'AI Analytics Usage', impact: '38%', direction: 'positive' as const },
      ],
      aiInsight: 'AMI adoption reached 62% of AMI-enabled customers, up 8pp YoY. Subscriber portal leads at 78% penetration. Platform automation driving 15% efficiency improvement in account management workflows.',
      driversTabId: 'proptech-penetration',
    },
    {
      id: 'platform-revenue', label: 'Platform Revenue Share',
      value: '18%',
      change: '+4pp YoY',
      changeDirection: 'up',
      sparkline: [10, 11.5, 13, 14.5, 15.8, 17, 18],
      target: '22%',
      gap: '-4pp',
      status: 'good',
      subDrivers: [
        { name: 'Avg Fee Premium (Digital)', impact: '+12% vs traditional', direction: 'positive' as const },
        { name: 'Client Retention Rate', impact: '96%', direction: 'positive' as const },
        { name: 'Cross-Sell Rate', impact: '+34%', direction: 'positive' as const },
      ],
      aiInsight: 'Platform-enabled services now drive 18% of total revenue, with 12% fee premium over traditional delivery. Client retention rate of 96% for platform users creates strong recurring revenue base.',
      driversTabId: 'digital-revenue',
    },
    {
      id: 'client-onboardings', label: 'Client Onboardings',
      value: '850',
      unit: '/month',
      change: '+22% YoY',
      changeDirection: 'up',
      sparkline: [580, 620, 680, 720, 780, 820, 850],
      target: '1,000/mo',
      gap: '-150',
      status: 'warning',
      subDrivers: [
        { name: 'Enterprise Clients', impact: '320', direction: 'positive' as const },
        { name: 'Mid-Market Clients', impact: '530', direction: 'positive' as const },
        { name: '30-Day Activation', impact: '68%', direction: 'positive' as const },
      ],
      aiInsight: 'Client onboardings at 850/month (+22% YoY) with improving 30-day activation at 68%. Automated onboarding flow driving 25% reduction in time-to-value for new platform clients.',
      driversTabId: 'client-engagement',
    },
  ];
}

function buildPulseInsights(_data: DigitalLoyaltyPageData): PulseInsight[] {
  return [
    { id: '1', severity: 'positive', headline: 'Platform member growth accelerating', detail: 'New member onboardings up 15% QoQ driven by streamlined Health100 digital onboarding and member portal enhancements. 90-day active rate at 72% suggests strong engagement quality. On track to reach 50K Health100 enrollment target by Q2 FY26.', action: 'View Member Trends', actionTab: 'drivers' },
    { id: '2', severity: 'positive', headline: 'Health100 adoption driving care premium', detail: 'Health100 digital adoption at 62% of eligible members with +12% care coordination engagement premium vs traditional delivery. Platform automation reducing care management cycle times by 15%, driving member engagement improvement.', action: 'Explore Health100 Metrics', actionTab: 'drivers' },
    { id: '3', severity: 'info', headline: 'Digital twin capability expanding revenue opportunity', detail: 'Digital twin adoption at 45% of enterprise clients vs 78% for client portal represents significant upside. AI-powered analytics showing 3x engagement rate. Testing premium analytics tier with top 100 accounts.', action: 'View Digital Revenue', actionTab: 'drivers' },
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

function buildDriverMatrix(data: DigitalLoyaltyPageData): DriverMatrixRow[] {
  const digitalConsole = data.digitalConsole;
  if (digitalConsole?.keyDrivers?.length) {
    return digitalConsole.keyDrivers.slice(0, 6).map((kd, idx) => {
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
    { id: 'platform-growth', name: 'Health100 Growth', score: 82, trend: '+12% YoY', trendDirection: 'up', gap: '-7.5K', status: 'good', subDrivers: ['Active Members', 'Onboarding Rate', '90-Day Active'] },
    { id: 'proptech-penetration', name: 'Digital Health Penetration', score: 76, trend: '+8pp YoY', trendDirection: 'up', gap: '-8pp', status: 'good', subDrivers: ['Adoption %', 'Automation Rate', 'Member Portal Usage'] },
    { id: 'client-engagement', name: 'Member Engagement', score: 72, trend: '+22%', trendDirection: 'up', gap: '-150/mo', status: 'warning', subDrivers: ['Onboardings', 'DAU/MAU', 'Feature Adoption'] },
    { id: 'digital-revenue', name: 'Digital Revenue', score: 85, trend: '+4pp', trendDirection: 'up', gap: '-4pp', status: 'good', subDrivers: ['Platform Revenue %', 'Care Premium', 'Retention Rate'] },
    { id: 'ai-analytics', name: 'AI Analytics', score: 78, trend: '+28%', trendDirection: 'up', gap: '+3pp', status: 'good', subDrivers: ['Analytics Usage', 'Prediction Accuracy', 'Member Satisfaction'] },
    { id: 'client-tier-mix', name: 'Member Tier Mix', score: 68, trend: '38% MA', trendDirection: 'up', gap: '-2pp', status: 'warning', subDrivers: ['MA Members %', 'Upgrade Rate', 'Member Attrition Rate'] },
  ];
}

function buildDriverTree(data: DigitalLoyaltyPageData): DriverNode[] {
  const allKPIs = [...data.kpis.primaryKPIs, ...data.kpis.operationalKPIs, ...data.kpis.digitalKPIs, ...data.kpis.financialKPIs];
  const platformKPI = allKPIs.find((k) => k.label.toLowerCase().includes('platform') || k.label.toLowerCase().includes('proptech'));
  const platformValue = platformKPI ? String(platformKPI.value) : '42.5';

  return [
    { id: 'platform-growth', name: 'Health100 Growth', value: `${platformValue}K`, status: 'good',
      children: [
        { id: 'active-clients', name: 'Active Members', value: `${platformValue}K`, status: 'good',
          children: [
            { id: 'new-onboardings', name: 'New Member Onboardings', value: '+15% QoQ', status: 'good' },
            { id: 'active-rate', name: '90-Day Active Rate', value: '72%', status: 'good' },
            { id: 'churn-rate', name: 'Member Attrition Rate', value: '4.2%', status: 'good' },
          ],
        },
        { id: 'enterprise-tier', name: 'Enterprise Tier', value: '38%', status: 'warning',
          children: [
            { id: 'upgrade-rate', name: 'Upgrade Rate', value: '+5.2%', status: 'good' },
            { id: 'enterprise-retention', name: 'Enterprise Retention', value: '96%', status: 'good' },
          ],
        },
      ],
    },
    { id: 'proptech-penetration', name: 'Health100 Digital Penetration', value: '62%', status: 'good',
      children: [
        { id: 'portal-adoption', name: 'Member Digital Login Rate', value: '78%', status: 'good' },
        { id: 'digital-twin', name: 'Digital Twin Adoption', value: '45%', status: 'warning' },
        { id: 'smart-building', name: 'Smart Building Integration', value: '35%', status: 'warning' },
      ],
    },
    { id: 'digital-revenue', name: 'Digital Revenue', value: '18%', unit: 'of total', status: 'good',
      children: [
        { id: 'fee-premium', name: 'Digital Fee Premium', value: '+12%', status: 'good' },
        { id: 'client-frequency', name: 'Engagement Frequency', value: '4.2x/mo', status: 'good' },
        { id: 'cross-sell', name: 'Cross-sell Rate', value: '+34%', status: 'good' },
      ],
    },
    { id: 'personalization', name: 'AI Personalization Engine', value: '+22%', unit: 'lift', status: 'good',
      children: [
        { id: 'recommendation-accuracy', name: 'Recommendation Accuracy', value: '72%', status: 'warning' },
        { id: 'alert-ctr', name: 'Alert Click-Through Rate', value: '8.5%', status: 'good' },
        { id: 'insight-adoption', name: 'Insight Adoption Rate', value: '34%', status: 'good' },
      ],
    },
    { id: 'portal-engagement', name: 'Portal Engagement', value: '78%', unit: 'adoption', status: 'good',
      children: [
        { id: 'dau-mau', name: 'DAU/MAU Ratio', value: '35%', status: 'warning' },
        { id: 'session-duration', name: 'Avg Session', value: '8.5 min', status: 'good' },
        { id: 'day30-retention', name: 'Day 30 Retention', value: '68%', status: 'good' },
      ],
    },
  ];
}

function buildDriverDetail(id: string, _data: DigitalLoyaltyPageData): DriverDetailData | null {
  const map: Record<string, DriverDetailData> = {
    'platform-growth': {
      id: 'platform-growth', name: 'Platform Growth', description: 'AMI platform login growth and subscriber engagement metrics.',
      value: '42.5K', unit: 'active clients', target: '50K', gap: '-7.5K',
      trend: 'up', trendValue: '+12% YoY', status: 'good',
      trendData: [{ period: 'Q1 FY25', actual: 36, target: 40 }, { period: 'Q2 FY25', actual: 38.5, target: 43 }, { period: 'Q3 FY25', actual: 40.8, target: 46 }, { period: 'Q4 FY25', actual: 42.5, target: 50 }],
      subDrivers: [
        { name: 'New Onboardings', contribution: 15, unit: '% QoQ' },
        { name: '90-Day Active Rate', contribution: 72, unit: '%' },
        { name: 'Enterprise Tier %', contribution: 38, unit: '%' },
        { name: 'Churn Rate', contribution: -4.2, unit: '%' },
      ],
      variance: { actual: '42.5K', plan: '50K', priorYear: '38K' },
      aiInsight: 'Platform clients grew 12% YoY to 42.5K, with new onboarding acceleration (+15% QoQ) driven by streamlined digital twin deployment and client portal enhancements. 90-day active rate at 72% indicates strong engagement quality.',
      crossRefs: [{ label: 'North America', consoleId: 'north-america-performance' }],
    },
    'proptech-penetration': {
      id: 'proptech-penetration', name: 'AMI Penetration', description: 'AMI platform adoption across AMI-enabled plans.',
      value: '62%', target: '70%', gap: '-8pp',
      trend: 'up', trendValue: '+8pp YoY', status: 'good',
      trendData: [{ period: 'Q1 FY25', actual: 54, target: 62 }, { period: 'Q2 FY25', actual: 57, target: 64 }, { period: 'Q3 FY25', actual: 60, target: 67 }, { period: 'Q4 FY25', actual: 62, target: 70 }],
      subDrivers: [
        { name: 'AMI Login Rate', contribution: 78, unit: '%' },
        { name: 'Digital Twin Adoption', contribution: 45, unit: '%' },
        { name: 'Smart Building Integration', contribution: 35, unit: '%' },
        { name: 'Onboarding Friction Rate', contribution: -4.5, unit: '%' },
      ],
      variance: { actual: '62%', plan: '70%', priorYear: '54%' },
      aiInsight: 'AMI adoption reached 62% with subscriber portal leading at 78%. AMI platform integration reduced service request cycle time by 25%, decreasing client escalations by 12%. Digital twin at 45% represents significant growth opportunity.',
    },
    'portal-engagement': {
      id: 'portal-engagement', name: 'Portal Engagement', description: 'AMI app and BD.com/smartgrid usage, session depth, and subscriber retention.',
      value: '78%', unit: 'adoption', target: '85%', gap: '-7pp',
      trend: 'up', trendValue: '+10pp YoY', status: 'good',
      trendData: [{ period: 'Q1 FY25', actual: 68, target: 76 }, { period: 'Q2 FY25', actual: 72, target: 79 }, { period: 'Q3 FY25', actual: 75, target: 82 }, { period: 'Q4 FY25', actual: 78, target: 85 }],
      subDrivers: [
        { name: 'Large Industrial Clients', contribution: 92, unit: '% adoption' },
        { name: 'Residential Clients', contribution: 65, unit: '% adoption' },
        { name: 'Day 30 Retention', contribution: 68, unit: '%' },
        { name: 'DAU/MAU Ratio', contribution: 35, unit: '%' },
      ],
      variance: { actual: '78%', plan: '85%', priorYear: '68%' },
      aiInsight: 'Portal adoption growing 10pp YoY to 78%. Large industrial clients lead at 92% adoption. Day-30 retention at 68% improving from AI-powered insights and personalized dashboards. DAU/MAU at 35% suggests room for deeper daily engagement.',
    },
    'digital-revenue': {
      id: 'digital-revenue', name: 'Digital Revenue', description: 'Revenue contribution from platform-enabled services and digital channels.',
      value: '18%', unit: 'of total revenue', target: '22%', gap: '-4pp',
      trend: 'up', trendValue: '+4pp YoY', status: 'good',
      trendData: [{ period: 'Q1 FY25', actual: 14.5, target: 18 }, { period: 'Q2 FY25', actual: 15.8, target: 19 }, { period: 'Q3 FY25', actual: 17, target: 20.5 }, { period: 'Q4 FY25', actual: 18, target: 22 }],
      subDrivers: [
        { name: 'Digital Fee Premium', contribution: 12, unit: '%' },
        { name: 'Engagement Frequency', contribution: 4.2, unit: 'x/mo' },
        { name: 'Cross-sell Revenue', contribution: 34, unit: '% higher' },
        { name: 'Client Retention Rate', contribution: 96, unit: '%' },
      ],
      variance: { actual: '18%', plan: '22%', priorYear: '14%' },
      aiInsight: 'Platform-enabled services drive 18% of total revenue, up 4pp YoY. Fee premium of +12% vs traditional delivery combined with 4.2x monthly engagement creates a durable competitive advantage. Cross-sell rate among platform clients is 34% higher.',
    },
    'personalization': {
      id: 'personalization', name: 'AI Personalization', description: 'AI-driven personalization engine performance across insights and recommendations.',
      value: '+22%', unit: 'revenue lift', target: '+25%', gap: '-3pp',
      trend: 'up', trendValue: '+22% lift', status: 'good',
      trendData: [{ period: 'Q1 FY25', actual: 15, target: 20 }, { period: 'Q2 FY25', actual: 18, target: 22 }, { period: 'Q3 FY25', actual: 20, target: 24 }, { period: 'Q4 FY25', actual: 22, target: 25 }],
      subDrivers: [
        { name: 'Insight Adoption Rate', contribution: 34, unit: '%' },
        { name: 'Alert Click-Through Rate', contribution: 8.5, unit: '%' },
        { name: 'Recommendation Accuracy', contribution: 72, unit: '%' },
      ],
      variance: { actual: '+22%', plan: '+25%', priorYear: '+14%' },
      aiInsight: 'AI personalization engine delivering +22% revenue lift, up from +14% prior year. Insight adoption rate at 34% with alert CTR of 8.5%. Machine learning recommendation accuracy improving to 72%.',
    },
    'client-tier-mix': {
      id: 'client-tier-mix', name: 'Client Tier Mix', description: 'Distribution of clients across service tiers and upgrade dynamics.',
      value: '38%', unit: 'enterprise tier', target: '40%', gap: '-2pp',
      trend: 'up', trendValue: '+3pp YoY', status: 'warning',
      trendData: [{ period: 'Q1 FY25', actual: 35, target: 37 }, { period: 'Q2 FY25', actual: 36, target: 38 }, { period: 'Q3 FY25', actual: 37, target: 39 }, { period: 'Q4 FY25', actual: 38, target: 40 }],
      subDrivers: [
        { name: 'Enterprise Upgrade Rate', contribution: 5.2, unit: '%' },
        { name: 'Enterprise Retention', contribution: 96, unit: '%' },
        { name: 'Mid-Market Engagement', contribution: 65, unit: '% active' },
      ],
      variance: { actual: '38%', plan: '40%', priorYear: '35%' },
      aiInsight: 'Enterprise tier at 38% of clients, 2pp below 40% target. Upgrade rate at 5.2% improving but mid-market engagement (65% active) suggests onboarding friction. Enterprise retention strong at 96%.',
    },
  };

  return map[id] || null;
}

function buildBridgeItems(_data: DigitalLoyaltyPageData): BridgeCommentary[] {
  return [
    { id: 'b1', component: 'Platform Client Revenue', value: 520, percentImpact: '+5.8%', aiSuggestion: 'Platform clients contributed incremental $520M through higher fee rates (+12%), engagement frequency (4.2x/mo), and cross-sell (+34%).', status: 'approved' as const, subItems: [{ name: 'Fee Premium', value: 285, description: '+12% higher average fee rate for platform clients' }, { name: 'Engagement Uplift', value: 235, description: '4.2x monthly engagement vs 1.8x non-platform clients' }] },
    { id: 'b2', component: 'Client Portal Revenue', value: 185, percentImpact: '+2.1%', aiSuggestion: 'Client portal channel grew to 78% adoption, contributing $185M incremental through self-service efficiency and expanded engagement.', status: 'submitted' as const, subItems: [] },
    { id: 'b3', component: 'AI Personalization Lift', value: 142, percentImpact: '+1.6%', aiSuggestion: 'AI personalization engine contributed $142M through targeted insights (34% adoption), proactive alerts (8.5% CTR), and service recommendations.', status: 'draft' as const, subItems: [] },
    { id: 'b4', component: 'New Client Acquisition', value: 95, percentImpact: '+1.1%', aiSuggestion: 'New platform client acquisition contributed $95M, with streamlined onboarding driving 15% QoQ growth in new activations.', status: 'draft' as const, subItems: [] },
    { id: 'b5', component: 'Digital Twin Revenue', value: 68, percentImpact: '+0.8%', aiSuggestion: 'Digital twin capabilities including building analytics and predictive maintenance contributed $68M incremental revenue.', status: 'draft' as const, subItems: [] },
    { id: 'b6', component: 'Platform Investment Costs', value: -32, percentImpact: '-0.4%', aiSuggestion: 'Increased platform development and digital acquisition spend reduced net contribution by $32M, offset by higher client lifetime value.', status: 'draft' as const, subItems: [] },
  ];
}

// =============================================================================
// Main Component
// =============================================================================

export default function DigitalLoyaltyClient({ data }: DigitalLoyaltyClientProps) {
  const heroKPIs = useMemo(() => buildHeroKPIs(data), [data]);
  const insights = useMemo(() => buildPulseInsights(data), [data]);
  const driverMatrix = useMemo(() => buildDriverMatrix(data), [data]);
  const driverTree = useMemo(() => buildDriverTree(data), [data]);
  const bridgeItems = useMemo(() => buildBridgeItems(data), [data]);
  const getDriverDetail = useCallback((id: string) => buildDriverDetail(id, data), [data]);

  const narrativeBrief = useMemo(() => ({
    title: 'Digital & Platform Performance Summary',
    period: data.financials.latestQuarter.quarter,
    summary: `AMI platform reached 47M active smart meters in ${data.financials.latestQuarter.quarter}, growing 12% YoY and representing 68% engagement on AMI platform. Subscriber portal adoption hit 78%, with large industrial customers leading at 92%.\n\nAMI-enabled plans drive 18% digital revenue premium per subscriber with +12% average plan attachment vs. non-AMI. The AI personalization engine delivered +22% digital revenue lift through targeted plan upgrade offers and partner recommendations.\n\nNew subscriber acquisition via AMI reached 850/month (+22% YoY) with improving 30-day activation at 68%. AMI analytics at 45% of large industrial partnership capacity represents the largest near-term digital monetization opportunity.`,
    keyTakeaways: [
      'Platform at 42.5K active clients (+12% YoY), 62% of AMI-enabled customers',
      'Subscriber portal at 78% adoption, large industrial tier leading at 92%',
      'Platform revenue share at 18% with +12% fee premium vs traditional delivery',
      'AI personalization engine delivering +22% revenue lift, up from +14% prior year',
      'Client onboardings 850/mo (+22% YoY) with 68% 30-day activation',
    ],
    overallStatus: 'good' as const,
  }), [data]);

  const quarterLabels = data.financials.quarters.map((q) => q.quarter);
  const plData = useMemo(() => [
    { label: 'Digital Revenue Contribution', isCategory: true,
      quarters: data.financials.quarters.map((q, i) => ({ actual: `$${(q.revenue * [0.145, 0.158, 0.17, 0.18][i]!).toFixed(1)}B`, variance: `+${[2, 3, 3.5, 4][i]}pp`, varianceColor: 'green' as 'green' | 'red' | 'neutral' })),
      children: [
        { label: 'Platform Client Revenue', quarters: data.financials.quarters.map((q) => ({ actual: `$${(q.revenue * 0.18).toFixed(1)}B`, variance: '+4pp YoY', varianceColor: 'green' as const })) },
        { label: 'Client Portal Revenue', quarters: data.financials.quarters.map((q) => ({ actual: `$${(q.revenue * 0.12).toFixed(1)}B`, variance: '+3pp YoY', varianceColor: 'green' as const })) },
        { label: 'AI Personalization Lift', quarters: data.financials.quarters.map(() => ({ actual: '+22%', variance: '+8pp YoY', varianceColor: 'green' as const })) },
      ],
    },
    { label: 'Client Metrics', isCategory: true,
      quarters: data.financials.quarters.map((_q, i) => ({ actual: `${[36, 38.5, 40.8, 42.5][i]}K`, variance: `+${[8, 9, 10.5, 12][i]}%`, varianceColor: 'green' as 'green' | 'red' | 'neutral' })),
      children: [
        { label: 'Enterprise Tier %', quarters: data.financials.quarters.map((_q, i) => ({ actual: `${[35, 36, 37, 38][i]}%`, variance: `+${[1, 1.5, 2, 3][i]}pp`, varianceColor: 'green' as const })) },
        { label: '90-Day Active Rate', quarters: data.financials.quarters.map((_q, i) => ({ actual: `${[65, 68, 70, 72][i]}%`, variance: `+${[3, 4, 5, 7][i]}pp`, varianceColor: 'green' as const })) },
      ],
    },
    { label: 'Platform Revenue % of Total', isTotal: true,
      quarters: data.financials.quarters.map((_q, i) => ({ actual: `${[14.5, 15.8, 17, 18][i]}%`, variance: `+${[2, 3, 3.5, 4][i]}pp`, varianceColor: 'green' as 'green' | 'red' | 'neutral' })),
    },
  ], [data]);

  const driverDataForTable = useMemo(() => [
    { category: 'Platform Clients', rows: [
      { driver: 'Active Platform Clients', actual: '42.5K', plan: '50K', variance: '-7.5K', varianceColor: 'red' as const, trend: 'up' as const },
      { driver: 'New Onboardings', actual: '+15% QoQ', plan: '+10%', variance: '+5pp', varianceColor: 'green' as const, trend: 'up' as const },
      { driver: 'Enterprise Tier %', actual: '38%', plan: '40%', variance: '-2pp', varianceColor: 'red' as const, trend: 'up' as const },
    ]},
    { category: 'Digital & Loyalty', rows: [
      { driver: 'AMI Adoption', actual: '62%', plan: '70%', variance: '-8pp', varianceColor: 'red' as const, trend: 'up' as const },
      { driver: 'AMI Login Rate', actual: '78%', plan: '85%', variance: '-7pp', varianceColor: 'red' as const, trend: 'up' as const },
      { driver: 'DAU/MAU Ratio', actual: '35%', plan: '40%', variance: '-5pp', varianceColor: 'red' as const, trend: 'up' as const },
    ]},
    { category: 'Revenue & Engagement', rows: [
      { driver: 'Platform Revenue Share', actual: '18%', plan: '22%', variance: '-4pp', varianceColor: 'red' as const, trend: 'up' as const },
      { driver: 'AI Personalization Lift', actual: '+22%', plan: '+25%', variance: '-3pp', varianceColor: 'red' as const, trend: 'up' as const },
      { driver: 'Insight Adoption Rate', actual: '34%', plan: '30%', variance: '+4pp', varianceColor: 'green' as const, trend: 'up' as const },
    ]},
  ], []);

  const attentionItems = useMemo(() => [
    { id: 'a1', severity: 'warning' as const, title: 'Client onboardings 15% below 1K/month target', detail: '30-day activation improving but acquisition pace needs acceleration', actionTab: 'drivers' },
    { id: 'a2', severity: 'info' as const, title: 'Digital twin at 45% vs 78% portal adoption', detail: 'Largest digital growth opportunity - testing bundled analytics tier with enterprise accounts', actionTab: 'drivers' },
    { id: 'a3', severity: 'warning' as const, title: 'Enterprise tier at 38%, 2pp below target', detail: 'Mid-market onboarding friction identified - streamlined upgrade flow in test', actionTab: 'bridge' },
  ], []);

  return (
    <ConsoleShell config={digitalLoyaltyConfig}>
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
                title="Digital Revenue Contribution Bridge"
                periodLabel={`${data.financials.latestQuarter.quarter} vs Prior Year`}
                totalVariance="978"
                totalVariancePercent="+10.9%"
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
