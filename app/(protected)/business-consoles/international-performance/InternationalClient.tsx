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
import type { InternationalPageData } from './types';
import { internationalConfig } from './config';

interface InternationalClientProps {
  data: InternationalPageData;
}

// =============================================================================
// Data Mappers — BD: Health Services (HSS / Caremark PBM)
// SOURCE: BD Q1 FY26 Earnings (May 2026), FY2025 10-K, FY2026 Guidance
// Caremark PBM: ~460M claims/quarter; Specialty: ~28M specialty claims/quarter
// Oak Street Health: 170+ clinics, ~38,000 VBC patients
// =============================================================================

function buildHeroKPIs(data: InternationalPageData): HeroKPI[] {
  const { financials } = data;
  const revenueQtrData = financials.quarters.map((q) => q.revenue * 0.38);

  return [
    {
      id: 'hss-revenue', label: 'Health Services Revenue',
      value: `$${(financials.latestQuarter.revenue * 0.38).toFixed(1)}B`,
      change: `${financials.latestQuarter.revenueYoY >= 0 ? '+' : ''}${financials.latestQuarter.revenueYoY}%`,
      changeDirection: financials.latestQuarter.revenueYoY >= 0 ? 'up' : 'down',
      sparkline: revenueQtrData,
      target: '≥$152B FY26 annualized',
      gap: `${financials.latestQuarter.revenueYoY >= 0 ? '+' : ''}${financials.latestQuarter.revenueYoY}% YoY`,
      status: financials.latestQuarter.revenueYoY >= 2 ? 'good' : 'warning',
      subDrivers: [
        { name: 'Caremark PBM Claims Volume', impact: '+7% YoY', direction: 'positive' as const },
        { name: 'Specialty Rx Revenue', impact: '+18% YoY', direction: 'positive' as const },
        { name: 'TrueCost Transition Headwind', impact: '-$800M absorbing', direction: 'negative' as const },
      ],
      aiInsight: `HSS revenue of $${(financials.latestQuarter.revenue * 0.38).toFixed(1)}B in Q1 FY26, driven by Caremark PBM claims volume growth (+7% YoY), specialty pharmacy expansion (+18%), and Oak Street Health revenue growth (+15%). The TrueCost net-cost model transition is absorbing a ~$800M revenue headwind on a gross basis as clients shift to transparent pricing, though the economics pass through to clients at lower net cost.`,
      driversTabId: 'pbm-claims',
    },
    {
      id: 'pharmacy-claims', label: 'Pharmacy Claims Volume',
      value: '464.7M',
      unit: 'Q1 claims',
      change: '+7% YoY',
      changeDirection: 'up',
      sparkline: [430, 440, 452, 465],
      target: '≥460M/quarter (≥1.84B FY26)',
      gap: '+4.7M above quarterly target',
      status: 'good',
      subDrivers: [
        { name: 'Commercial PBM Claims', impact: '+6% YoY', direction: 'positive' as const },
        { name: 'Government / Part D', impact: '+9% YoY', direction: 'positive' as const },
        { name: 'GLP-1 New Claim Volume', impact: '+34% YoY', direction: 'positive' as const },
      ],
      aiInsight: 'Pharmacy claims of 464.7M in Q1 FY26 exceeded the ≥460M quarterly target. Volume growth is broad-based: commercial PBM +6%, government Part D +9%, with GLP-1 claim additions as the fastest-growing incremental category. TrueCost client transitions absorbing gross revenue but not impacting claim count.',
      driversTabId: 'pbm-claims',
    },
    {
      id: 'specialty-growth', label: 'Specialty Rx Revenue Growth',
      value: '+18%',
      change: '+18% YoY',
      changeDirection: 'up',
      sparkline: [10, 12, 15, 18],
      target: '>15% FY26',
      gap: '+3pp above target',
      status: 'good',
      subDrivers: [
        { name: 'GLP-1 Specialty Claims', impact: '+34% YoY', direction: 'positive' as const },
        { name: 'Oncology Claims Growth', impact: '+12% YoY', direction: 'positive' as const },
        { name: 'Immunology/Biosimilar', impact: '+8% YoY (pre-Stelara launch)', direction: 'positive' as const },
      ],
      aiInsight: 'Specialty pharmacy revenue growth of +18% YoY significantly exceeds the >15% target. GLP-1 drugs (Ozempic, Wegovy, Mounjaro) are the fastest-growing category at +34%, now representing a substantial share of specialty Rx revenue. Stelara (ustekinumab) biosimilar launch in July 2026 will be the next major specialty event — targeting >85% conversion rate from branded to biosimilar.',
      driversTabId: 'specialty-pharmacy',
    },
    {
      id: 'hss-aoi', label: 'HSS Adjusted Operating Income',
      value: '$1.49B',
      unit: 'Q1 FY26',
      change: '+$120M YoY',
      changeDirection: 'up',
      sparkline: [1.28, 1.35, 1.42, 1.49],
      target: '≥$7.25B FY26',
      gap: '$1.49B × 4 ≈ $5.96B vs ≥$7.25B target',
      status: 'warning',
      subDrivers: [
        { name: 'PBM Claims Volume Leverage', impact: '+$280M', direction: 'positive' as const },
        { name: 'TrueCost Margin Absorption', impact: '-$195M transitional', direction: 'negative' as const },
        { name: 'Oak Street Health AOI', impact: 'Expanding toward positive', direction: 'positive' as const },
      ],
      aiInsight: 'HSS AOI of $1.49B in Q1 FY26 (+$120M YoY) reflects PBM claims volume leverage and specialty mix growth, partially offset by TrueCost model transition costs. Full-year target of ≥$7.25B requires strong Q2–Q4 execution — particularly the Stelara biosimilar conversion (July 2026) which could contribute $200–400M+ annual net savings to HSS economics.',
      driversTabId: 'hss-profitability',
    },
  ];
}

function buildPulseInsights(_data: InternationalPageData): PulseInsight[] {
  return [
    {
      id: '1', severity: 'positive',
      headline: 'Specialty Rx +18% YoY — exceeding >15% target; Stelara biosimilar launch July 2026',
      detail: 'Specialty pharmacy revenue growth at +18% YoY vs >15% target, driven by GLP-1 surge (+34%), oncology growth (+12%), and immunology expansion. The Stelara (ustekinumab) biosimilar formulary exclusion launching July 1, 2026 targets >85% conversion from branded ($5,000+/dose) to biosimilar — a major HSS AOI catalyst in H2 FY26 and FY27.',
      action: 'View Specialty Analysis', actionTab: 'drivers',
    },
    {
      id: '2', severity: 'warning',
      headline: 'TrueCost PBM transition absorbing $800M gross revenue headwind — 62% converted',
      detail: 'Caremark\'s TrueCost net-cost pricing model transition is 62% complete (~100% target by YE2026). The transition moves clients from spread-based to transparent net-cost pricing, reducing gross revenue but improving client retention and competitive positioning. The $800M gross revenue headwind is substantially neutral to net AOI, but creates revenue line noise vs prior-year comparisons.',
      action: 'View PBM Bridge', actionTab: 'bridge',
    },
    {
      id: '3', severity: 'positive',
      headline: 'Oak Street Health +15% revenue growth; VBC patient enrollment toward 45,000 target',
      detail: 'Oak Street Health delivered +15% revenue growth YoY, with VBC patient enrollment at ~38,000 (vs 45,000+ YE2026 target). The 170+ clinic network is scaling toward profitability as cohort economics mature. Oak Street integration with CVS Aetna MA members (value-based care risk-share) is a multi-year integrated care margin expansion lever.',
      action: 'View Oak Street Drivers', actionTab: 'drivers',
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

function buildDriverMatrix(data: InternationalPageData): DriverMatrixRow[] {
  const intlConsole = data.intlConsole;
  if (intlConsole?.keyDrivers?.length) {
    return intlConsole.keyDrivers.slice(0, 6).map((kd, idx) => {
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
    { id: 'pbm-claims', name: 'PBM Claims Volume', score: 85, trend: '464.7M/Q', trendDirection: 'up', gap: '+4.7M above target', status: 'good', subDrivers: ['Caremark Commercial', 'Government Part D', 'GLP-1 Claims'] },
    { id: 'specialty-pharmacy', name: 'Specialty Rx Growth', score: 82, trend: '+18%', trendDirection: 'up', gap: '+3pp above target', status: 'good', subDrivers: ['GLP-1 Volume', 'Oncology', 'Immunology/Biosimilar'] },
    { id: 'truecost-transition', name: 'TrueCost Client Transition', score: 65, trend: '62% complete', trendDirection: 'up', gap: '-38pp to 100%', status: 'warning', subDrivers: ['Commercial Client Conversion', 'Gross Revenue Impact', 'Net AOI Neutral'] },
    { id: 'oak-street', name: 'Oak Street Health Expansion', score: 78, trend: '+15% revenue', trendDirection: 'up', gap: '-7K to 45K VBC patients', status: 'good', subDrivers: ['Clinic Count', 'VBC Patients', 'Aetna Integration'] },
    { id: 'biosimilar-conversion', name: 'Stelara Biosimilar Readiness', score: 70, trend: 'Pre-launch', trendDirection: 'up', gap: '>85% target Q3 FY26', status: 'good', subDrivers: ['Formulary Position', 'Client Communications', 'Conversion Rate Modeling'] },
    { id: 'hss-profitability', name: 'HSS Profitability (AOI)', score: 68, trend: '$1.49B Q1', trendDirection: 'up', gap: 'H2 ramp needed', status: 'warning', subDrivers: ['Volume Leverage', 'TrueCost Absorption', 'Oak Street AOI'] },
  ];
}

function buildDriverTree(data: InternationalPageData): DriverNode[] {
  const q = data.financials.latestQuarter;
  return [
    { id: 'pbm-claims', name: 'Caremark PBM Claims Volume', value: '464.7M/quarter', status: 'good',
      children: [
        { id: 'commercial-claims', name: 'Commercial PBM Claims', value: '+6% YoY', status: 'good',
          children: [
            { id: 'truecost-clients', name: 'TrueCost Client Transition', value: '62% converted', status: 'warning' },
            { id: 'client-retention', name: 'PBM Client Retention Rate', value: '>95%', status: 'good' },
          ],
        },
        { id: 'govt-claims', name: 'Government / Medicare Part D', value: '+9% YoY', status: 'good' },
        { id: 'glp1-claims', name: 'GLP-1 New Claims Volume', value: '+34% YoY', status: 'good' },
      ],
    },
    { id: 'specialty-pharmacy', name: 'Specialty Pharmacy Growth', value: '+18% YoY', status: 'good',
      children: [
        { id: 'glp1-specialty', name: 'GLP-1 / Weight Management', value: '+34% YoY', status: 'good' },
        { id: 'oncology', name: 'Oncology Claims', value: '+12% YoY', status: 'good' },
        { id: 'immunology', name: 'Immunology / Biosimilar', value: '+8% (pre-Stelara launch)', status: 'good',
          children: [
            { id: 'stelara-biosimilar', name: 'Stelara Biosimilar Launch', value: 'July 1, 2026 — >85% target', status: 'good' },
          ],
        },
      ],
    },
    { id: 'oak-street', name: 'Oak Street Health', value: '170+ clinics', status: 'good',
      children: [
        { id: 'oak-street-revenue', name: 'Oak Street Revenue Growth', value: '+15% YoY', status: 'good' },
        { id: 'vbc-patients', name: 'VBC Patient Enrollment', value: '~38,000 (tgt 45,000+)', status: 'warning' },
        { id: 'aetna-risk-share', name: 'Aetna MA Risk-Share Integration', value: 'Active — value-based care model', status: 'good' },
      ],
    },
    { id: 'hss-profitability', name: 'HSS Profitability (AOI)', value: '$1.49B Q1 FY26', status: q.operatingMargin >= 12 ? 'good' : 'warning',
      children: [
        { id: 'pbm-leverage', name: 'PBM Volume Leverage', value: '+$280M YoY benefit', status: 'good' },
        { id: 'truecost-absorption', name: 'TrueCost Transition Absorption', value: '-$195M transitional cost', status: 'warning' },
        { id: 'oak-street-aoi', name: 'Oak Street AOI Trajectory', value: 'Scaling toward positive', status: 'warning' },
      ],
    },
    { id: 'truecost-transition', name: 'TrueCost PBM Model Transition', value: '62% complete', status: 'warning',
      children: [
        { id: 'truecost-clients-converted', name: 'Commercial Clients Converted', value: '~62% (100% target YE2026)', status: 'warning' },
        { id: 'truecost-revenue-impact', name: 'Gross Revenue Headwind', value: '-$800M (net-neutral to AOI)', status: 'warning' },
        { id: 'truecost-retention', name: 'Client Retention on TrueCost', value: '>95% retention maintained', status: 'good' },
      ],
    },
  ];
}

function buildDriverDetail(id: string, data: InternationalPageData): DriverDetailData | null {
  const quarters = data.financials.quarters;

  const map: Record<string, DriverDetailData> = {
    'pbm-claims': {
      id: 'pbm-claims', name: 'Caremark PBM Claims Volume',
      description: 'Total pharmacy claims processed by Caremark PBM — the primary HSS revenue and volume driver.',
      value: '464.7M', unit: 'Q1 FY26 claims', target: '≥460M/quarter (≥1.84B FY26)', gap: '+4.7M above target',
      trend: 'up', trendValue: '+7% YoY', status: 'good',
      trendData: quarters.map((q, i) => ({ period: q.quarter, actual: [430, 440, 452, 465][i] ?? 460, target: 460 })),
      subDrivers: [
        { name: 'Commercial PBM Claims Growth', contribution: 6, unit: '% YoY' },
        { name: 'Government / Part D Claims Growth', contribution: 9, unit: '% YoY' },
        { name: 'GLP-1 New Claim Contribution', contribution: 34, unit: '% volume growth category' },
        { name: 'TrueCost Client Claim Continuity', contribution: 95, unit: '% client retention on transition' },
      ],
      variance: { actual: '464.7M', plan: '≥460M', priorYear: '434M' },
      aiInsight: 'Pharmacy claims of 464.7M exceeded the ≥460M quarterly target. Volume growth is broad-based across commercial (+6%) and government (+9%) channels. GLP-1 claim additions (Ozempic, Wegovy, Mounjaro) are the fastest-growing incremental category, driven by employer plan coverage expansion and prior authorization relaxation. TrueCost client transition is 62% complete with >95% client retention maintained.',
      crossRefs: [{ label: 'PCW Pharmacy (GLP-1 dispensing)', consoleId: 'store-operations' }],
    },
    'specialty-pharmacy': {
      id: 'specialty-pharmacy', name: 'Specialty Pharmacy Growth',
      description: 'Specialty Rx revenue growth including GLP-1, oncology, immunology, and biosimilar categories.',
      value: '+18%', target: '>15% FY26', gap: '+3pp above target',
      trend: 'up', trendValue: '+18% YoY', status: 'good',
      trendData: quarters.map((q, i) => ({ period: q.quarter, actual: [10, 12, 15, 18][i] ?? 15, target: 15 })),
      subDrivers: [
        { name: 'GLP-1 Specialty Revenue Growth', contribution: 34, unit: '% YoY (Ozempic/Wegovy/Mounjaro)' },
        { name: 'Oncology Claims Growth', contribution: 12, unit: '% YoY' },
        { name: 'Immunology / Biosimilar', contribution: 8, unit: '% YoY (pre-Stelara)' },
      ],
      variance: { actual: '+18%', plan: '>15%', priorYear: '+14%' },
      aiInsight: 'Specialty pharmacy revenue growth of +18% YoY significantly exceeds the >15% target. GLP-1 drugs are now the dominant specialty growth driver at +34%. The Stelara (ustekinumab) biosimilar formulary exclusion launches July 1, 2026 — Caremark PBM will exclude the branded $5,000+ molecule in favor of FDA-approved biosimilars targeting >85% conversion. This event could contribute $200–400M+ in annual net savings/AOI contribution to HSS.',
    },
    'truecost-transition': {
      id: 'truecost-transition', name: 'TrueCost PBM Model Transition',
      description: 'Caremark PBM transition from spread-based to transparent net-cost (TrueCost) pricing model.',
      value: '62%', unit: 'of commercial clients converted', target: '100% by YE2026', gap: '-38pp to complete',
      trend: 'up', trendValue: '+12pp progress Q1 FY26', status: 'warning',
      trendData: quarters.map((q, i) => ({ period: q.quarter, actual: [38, 48, 55, 62][i] ?? 55, target: 100 })),
      subDrivers: [
        { name: 'Clients Converted to TrueCost', contribution: 62, unit: '%' },
        { name: 'Gross Revenue Headwind', contribution: -800, unit: '$M (net-neutral to AOI)' },
        { name: 'Client Retention Rate', contribution: 95, unit: '% retained on transition' },
      ],
      variance: { actual: '62%', plan: '100% YE2026', priorYear: '38%' },
      aiInsight: 'TrueCost transition reduces Caremark\'s gross revenue (as spread revenue disappears under net-cost model) but is substantially neutral to net AOI — the economics shift from Caremark margin to client savings. >95% client retention maintained through the transition, validating the competitive positioning of transparent pricing. Full transition by YE2026 will create a cleaner, more defensible PBM revenue model.',
    },
    'oak-street': {
      id: 'oak-street', name: 'Oak Street Health Expansion',
      description: 'Oak Street primary care network expansion, patient enrollment, and value-based care economics.',
      value: '+15%', unit: 'revenue growth YoY', target: '>15% YoY; 45,000+ VBC patients', gap: '-7K patients to enrollment target',
      trend: 'up', trendValue: '+15% revenue, 170+ clinics', status: 'good',
      trendData: quarters.map((q, i) => ({ period: q.quarter, actual: [8, 10, 12, 15][i] ?? 12, target: 15 })),
      subDrivers: [
        { name: 'Oak Street Clinic Count', contribution: 170, unit: '+ clinics' },
        { name: 'VBC Patient Enrollment', contribution: 38000, unit: 'patients (tgt 45,000+)' },
        { name: 'Aetna MA Risk-Share Patients', contribution: 22, unit: '% of Oak Street patients on Aetna plans' },
      ],
      variance: { actual: '+15% revenue, 38K patients', plan: '>15% rev, 45K+ patients', priorYear: '+12% revenue' },
      aiInsight: 'Oak Street Health is scaling toward profitability as patient cohort economics mature. Value-based care capitation revenue grows as high-risk Medicare patients become better managed through primary care — reducing total cost of care and sharing savings with CMS and health plans. 22% of Oak Street patients on Aetna plans creates an integrated care flywheel: CVS manages the MA premium risk AND the primary care cost of care.',
    },
    'biosimilar-conversion': {
      id: 'biosimilar-conversion', name: 'Stelara Biosimilar Launch Readiness',
      description: 'Stelara (ustekinumab) biosimilar formulary exclusion — largest near-term specialty pharmacy catalyst.',
      value: 'Pre-launch', unit: 'July 1, 2026 formulary date', target: '>85% biosimilar conversion', gap: 'Pre-launch — tracking to plan',
      trend: 'up', trendValue: 'On track for July 2026', status: 'good',
      trendData: [
        { period: 'Q2 FY26', actual: 0, target: 0 },
        { period: 'Q3 FY26', actual: 70, target: 85 },
        { period: 'Q4 FY26', actual: 88, target: 85 },
        { period: 'Q1 FY27', actual: 92, target: 90 },
      ],
      subDrivers: [
        { name: 'Branded Stelara Price', contribution: 5000, unit: '+ $/dose (excluded July 1)' },
        { name: 'Biosimilar Target Price', contribution: 1200, unit: '+ $/dose (estimated)' },
        { name: 'Formulary Exclusion Coverage', contribution: 85, unit: '% of Caremark lives targeted' },
        { name: 'Projected Annual Net Savings/AOI', contribution: 300, unit: '$M+ estimate' },
      ],
      variance: { actual: 'Pre-launch, on track', plan: '>85% by Q3 FY26', priorYear: 'N/A' },
      aiInsight: 'Stelara biosimilar is the largest single specialty pharmacy event in HSS FY26–FY27. Caremark PBM will exclude branded ustekinumab effective July 1, 2026, driving formulary conversion to FDA-approved biosimilars at ~75–80% lower acquisition cost. >85% conversion target reflects Caremark\'s formulary management leverage. Projected HSS AOI contribution of $200–400M+ annually once fully ramped.',
    },
    'hss-profitability': {
      id: 'hss-profitability', name: 'HSS Adjusted Operating Income',
      description: 'Health Services segment AOI — the financial output of PBM claims, specialty, and Oak Street operations.',
      value: '$1.49B', unit: 'Q1 FY26', target: '≥$7.25B FY26', gap: 'Annualized run-rate ~$5.96B vs ≥$7.25B',
      trend: 'up', trendValue: '+$120M YoY', status: 'warning',
      trendData: [
        { period: 'Q1 FY25', actual: 1.37, target: 1.81 },
        { period: 'Q2 FY25', actual: 1.65, target: 1.81 },
        { period: 'Q3 FY25', actual: 1.82, target: 1.81 },
        { period: 'Q4 FY25', actual: 1.49, target: 1.81 },
      ],
      subDrivers: [
        { name: 'PBM Claims Volume Leverage', contribution: 280, unit: '$M YoY benefit' },
        { name: 'Specialty Mix Improvement', contribution: 120, unit: '$M YoY benefit' },
        { name: 'TrueCost Transition Cost', contribution: -195, unit: '$M transitional headwind' },
        { name: 'Oak Street AOI Improvement', contribution: 85, unit: '$M YoY' },
      ],
      variance: { actual: '$1.49B', plan: '≥$1.81B/quarter', priorYear: '$1.37B' },
      aiInsight: 'HSS AOI of $1.49B improved +$120M YoY, driven by PBM claims volume leverage and specialty growth. The gap to the ≥$7.25B full-year target requires strong H2 execution — particularly the Stelara biosimilar conversion launch in Q3 FY26 which is the largest single-event AOI catalyst in the HSS segment. Q2 typically the seasonally strongest HSS quarter as plan year utilization patterns and specialty refills peak.',
    },
  };

  return map[id] || null;
}

function buildBridgeItems(data: InternationalPageData): BridgeCommentary[] {
  const bridge = data.financials.revenueBridge;
  if (bridge?.length) {
    return bridge.map((b, i) => ({
      id: `bridge-${i}`,
      component: b.label,
      value: b.impact,
      percentImpact: `${((b.impact / (data.financials.latestQuarter.revenue * 1000 * 0.38)) * 100).toFixed(1)}%`,
      aiSuggestion: b.description,
      status: 'draft' as const, subItems: [],
    }));
  }
  return [
    { id: 'b1', component: 'PBM Claims Volume Growth (+7% YoY)', value: 620, percentImpact: '+1.6%', aiSuggestion: 'Caremark PBM claims volume growth to 464.7M contributed +$620M revenue and meaningful AOI leverage, as fixed PBM infrastructure cost scales favorably against volume growth.', status: 'submitted' as const, subItems: [{ name: 'Commercial PBM Claims', value: 320, description: '+6% commercial channel volume' }, { name: 'Government Part D Claims', value: 300, description: '+9% Medicare Part D volume' }] },
    { id: 'b2', component: 'Specialty Pharmacy Revenue Growth (+18%)', value: 840, percentImpact: '+2.2%', aiSuggestion: 'Specialty pharmacy revenue contribution of +$840M driven by GLP-1 volume surge (+34%), oncology growth (+12%), and immunology expansion. Specialty is the highest-margin segment within HSS.', status: 'approved' as const, subItems: [{ name: 'GLP-1 Specialty Revenue', value: 480, description: 'Ozempic/Wegovy/Mounjaro volume surge' }, { name: 'Oncology & Immunology', value: 360, description: 'Non-GLP-1 specialty growth' }] },
    { id: 'b3', component: 'TrueCost Transition Revenue Headwind', value: -800, percentImpact: '-2.1%', aiSuggestion: 'TrueCost net-cost model transition reduced Caremark gross revenue by ~$800M as spread-based revenue converts to transparent net-cost. This is substantially neutral to HSS AOI — the economics transfer to client savings. 62% of commercial clients now on TrueCost.', status: 'approved' as const, subItems: [{ name: 'Gross Revenue Reduction', value: -800, description: 'Spread revenue converting to pass-through' }] },
    { id: 'b4', component: 'Oak Street Health Revenue Growth (+15%)', value: 185, percentImpact: '+0.5%', aiSuggestion: 'Oak Street Health contributed +$185M incremental revenue from patient enrollment expansion (+15% YoY). 170+ clinic network scaling as cohort economics mature and Aetna MA risk-share integration deepens.', status: 'submitted' as const, subItems: [] },
    { id: 'b5', component: 'TrueCost Transition Implementation Costs', value: -195, percentImpact: '-0.5%', aiSuggestion: 'Transitional costs associated with client migration to TrueCost platform: system integration, client service, and margin compression on in-transition accounts. Expected to normalize as transition completes by YE2026.', status: 'draft' as const, subItems: [] },
    { id: 'b6', component: 'Stelara Biosimilar Pre-Launch Investment', value: -45, percentImpact: '-0.1%', aiSuggestion: 'Pre-launch formulary management, client communication, and contracting costs for the July 1, 2026 Stelara biosimilar exclusion. One-time cost; the launch itself will be a significant positive HSS AOI catalyst in Q3/Q4 FY26.', status: 'draft' as const, subItems: [] },
  ];
}

// =============================================================================
// Main Component
// =============================================================================

export default function InternationalClient({ data }: InternationalClientProps) {
  const heroKPIs = useMemo(() => buildHeroKPIs(data), [data]);
  const insights = useMemo(() => buildPulseInsights(data), [data]);
  const driverMatrix = useMemo(() => buildDriverMatrix(data), [data]);
  const driverTree = useMemo(() => buildDriverTree(data), [data]);
  const bridgeItems = useMemo(() => buildBridgeItems(data), [data]);
  const getDriverDetail = useCallback((id: string) => buildDriverDetail(id, data), [data]);

  const narrativeBrief = useMemo(() => ({
    title: 'Health Services & Caremark PBM Summary',
    period: data.financials.latestQuarter.quarter,
    summary: `Health Services delivered pharmacy claims of 464.7M in Q1 FY26 — above the ≥460M quarterly target — with specialty pharmacy revenue growth of +18% YoY significantly exceeding the >15% plan. GLP-1 prescription volume grew +34% vs the +22% plan, reflecting accelerating Ozempic/Wegovy/Mounjaro demand across both Caremark PBM processing and CVS Pharmacy dispensing.\n\nHSS AOI of $1.49B improved +$120M YoY, driven by PBM volume leverage and specialty mix improvement, partially offset by TrueCost model transition costs (-$195M transitional). The TrueCost transition is 62% complete — targeting 100% by YE2026 — with >95% client retention maintained.\n\nThe Stelara (ustekinumab) biosimilar formulary exclusion launching July 1, 2026 is the most significant near-term HSS catalyst: targeting >85% conversion from $5,000+/dose branded to biosimilar, with an estimated $200–400M+ annual AOI contribution once ramped. Oak Street Health revenue growing +15% YoY, with VBC patient enrollment at ~38,000 vs 45,000+ YE2026 target.`,
    keyTakeaways: data.narrative?.keyAchievements || [
      'Pharmacy claims 464.7M Q1 FY26 (+7% YoY) — above ≥460M quarterly target; GLP-1 new claims +34% vs +22% plan',
      'Specialty Rx revenue +18% YoY (>15% target) — GLP-1, oncology, and immunology driving broad-based growth',
      'HSS AOI $1.49B Q1 (+$120M YoY) — PBM volume leverage and specialty mix partially offset by TrueCost transition',
      'TrueCost transition 62% complete — $800M gross revenue headwind net-neutral to AOI; >95% client retention',
      'Stelara biosimilar July 1, 2026 launch — >85% conversion target; $200–400M+ estimated annual AOI catalyst',
    ],
    overallStatus: 'good' as const,
  }), [data]);

  const quarterLabels = data.financials.quarters.map((q) => q.quarter);
  const plData = useMemo(() => [
    { label: 'HSS Net Revenues', isCategory: true,
      quarters: data.financials.quarters.map((q) => ({ actual: `$${(q.revenue * 0.38).toFixed(1)}B`, variance: `${q.revenueYoY >= 0 ? '+' : ''}${(q.revenueYoY - 1.0).toFixed(1)}%`, varianceColor: (q.revenueYoY >= 1.5 ? 'green' : 'red') as 'green' | 'red' | 'neutral' })),
      children: [
        { label: 'Caremark PBM Revenue (Net of TrueCost Transition)', quarters: data.financials.quarters.map(() => ({ actual: 'Embedded in HSS', variance: '+7% claims vol', varianceColor: 'green' as const })) },
        { label: 'Specialty Pharmacy Revenue', quarters: data.financials.quarters.map(() => ({ actual: 'Embedded in HSS', variance: '+18% YoY', varianceColor: 'green' as const })) },
        { label: 'Oak Street Health Revenue', quarters: data.financials.quarters.map(() => ({ actual: 'Embedded in HSS', variance: '+15% YoY', varianceColor: 'green' as const })) },
      ],
    },
    { label: 'Cost of Pharmacies & Services', isCategory: true,
      quarters: data.financials.quarters.map((q) => ({ actual: `$${(q.revenue * 0.38 * 0.89).toFixed(1)}B`, variance: '+6.5%', varianceColor: 'red' as const })),
      children: [
        { label: 'Drug Acquisition Cost', quarters: data.financials.quarters.map(() => ({ actual: 'Largest component', variance: 'Specialty +18%', varianceColor: 'red' as const })) },
        { label: 'Oak Street Clinical Costs', quarters: data.financials.quarters.map(() => ({ actual: 'Scaling with enrollment', variance: 'Improving per patient', varianceColor: 'green' as const })) },
      ],
    },
    { label: 'HSS Adjusted Operating Income', isTotal: true,
      quarters: data.financials.quarters.map((q, i) => ({ actual: `$${[1.37, 1.65, 1.82, 1.49][i] ?? 1.49}B`, variance: `+${[0.09, 0.12, 0.14, 0.12][i] ?? 0.12}B YoY`, varianceColor: 'green' as 'green' | 'red' | 'neutral' })),
    },
  ], [data]);

  const driverDataForTable = useMemo(() => [
    { category: 'PBM Claims & Volume', rows: [
      { driver: 'Pharmacy Claims Volume', actual: '464.7M', plan: '≥460M', variance: '+4.7M', varianceColor: 'green' as const, trend: 'up' as const },
      { driver: 'Claims Volume Growth YoY', actual: '+7%', plan: '+4%', variance: '+3pp', varianceColor: 'green' as const, trend: 'up' as const },
      { driver: 'TrueCost Client Conversion', actual: '62%', plan: '100% YE2026', variance: '-38pp to complete', varianceColor: 'red' as const, trend: 'up' as const },
    ]},
    { category: 'Specialty Pharmacy', rows: [
      { driver: 'Specialty Rx Revenue Growth', actual: '+18%', plan: '>15%', variance: '+3pp', varianceColor: 'green' as const, trend: 'up' as const },
      { driver: 'GLP-1 Volume Growth', actual: '+34%', plan: '+22%', variance: '+12pp', varianceColor: 'green' as const, trend: 'up' as const },
      { driver: 'Stelara Biosimilar Readiness', actual: 'Pre-launch', plan: '>85% Q3 FY26', variance: 'On track', varianceColor: 'green' as const, trend: 'up' as const },
    ]},
    { category: 'Oak Street Health', rows: [
      { driver: 'Oak Street Revenue Growth', actual: '+15%', plan: '>15%', variance: 'On target', varianceColor: 'green' as const, trend: 'up' as const },
      { driver: 'VBC Patient Enrollment', actual: '~38,000', plan: '45,000+', variance: '-7,000 patients', varianceColor: 'red' as const, trend: 'up' as const },
      { driver: 'HSS AOI Q1', actual: '$1.49B', plan: '≥$1.81B', variance: '-$320M', varianceColor: 'red' as const, trend: 'up' as const },
    ]},
  ], [data]);

  const attentionItems = useMemo(() => [
    { id: 'a1', severity: 'positive' as const, title: 'Stelara biosimilar July 1, 2026 — HSS AOI catalyst', detail: '>85% conversion target from $5,000+/dose branded to biosimilar. Estimated $200–400M+ annual AOI contribution. This is the single largest HSS event in H2 FY26.', actionTab: 'drivers' },
    { id: 'a2', severity: 'warning' as const, title: 'HSS AOI run-rate below ≥$7.25B FY26 target', detail: 'Q1 $1.49B annualizes to ~$5.96B vs ≥$7.25B. Stelara launch and Q2 seasonality are the key H2 acceleration levers.', actionTab: 'bridge' },
    { id: 'a3', severity: 'warning' as const, title: 'TrueCost transition 38pp to complete — $800M gross revenue headwind persisting', detail: '62% complete with >95% client retention. $800M gross revenue headwind net-neutral to AOI. Full transition by YE2026 resolves revenue line comparison noise.', actionTab: 'drivers' },
  ], []);

  return (
    <ConsoleShell config={internationalConfig}>
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
                title="Health Services & Caremark PBM Revenue Bridge"
                periodLabel={`${data.financials.latestQuarter.quarter} vs Prior Year`}
                totalVariance="605"
                totalVariancePercent="+1.6%"
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
