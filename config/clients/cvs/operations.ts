// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/operations.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q1-26] [CITED:EC-Q1-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// BD Q1 2026 earnings call, IR slides, 10-Q, and 10-K.
// CVS operates three reportable segments across ~300,000 colleagues.
// ─────────────────────────────────────────────────────────────────────
import { OperationsConfig } from '../../types';

export const operations: OperationsConfig = {
  totalLocations: 9000,               // ~9,000 CVS pharmacy locations (PCW segment) [CITED:EC-Q1-26]
  locationGrowth: 50,                 // net new locations from Rite Aid asset acquisitions [ASSUMED]
  locationGrowthPercent: 0.6,

  locations: [
    {
      name: 'Health Care Benefits (Aetna)',
      type: 'Managed Care — Medicare Advantage, Medicaid & Commercial',
      region: 'National (all 50 states)',
      metrics: [
        { label: 'Medical Membership', value: '26.0M', target: '~26.0M FY2026', status: 'good' },
        { label: 'Q1 2026 Adj. Operating Income', value: '$3.04B', target: '$4.00–$4.34B FY2026', status: 'good' },
        { label: 'Medical Benefit Ratio (MBR)', value: '84.6%', target: '90.5% ±50bps FY2026', status: 'good' },
        { label: 'Prior Auth Approval Rate (24h)', value: '>95%', target: '>97%', status: 'good' },
        { label: 'Procedures Standardized (AHIP)', value: '88%', target: '50%+ industry by year-end', status: 'good' },
        { label: 'MA Margin Target', value: 'Recovering', target: '3% by 2028', status: 'warning' },
      ],
    },
    {
      name: 'Health Services (Caremark)',
      type: 'PBM + Specialty Pharmacy + Oak Street Health (Primary Care)',
      region: 'National — 60,000+ pharmacy network',
      metrics: [
        { label: 'Pharmacy Claims Q1 2026', value: '464.7M', target: '≥1.84B FY2026', status: 'good' },
        { label: 'Q1 2026 Adj. Operating Income', value: '$1.49B', target: '≥$7.25B FY2026', status: 'good' },
        { label: 'Humira Biosimilar Conversion', value: '>90%', target: 'Maintain', status: 'good' },
        { label: 'Stelara Exclusion Date', value: 'July 1, 2026', target: '85–90% conversion', status: 'good' },
        { label: 'Oak Street Health Revenue', value: '+15% YoY', target: 'Disciplined growth', status: 'good' },
        { label: 'Rebate Guarantee Performance', value: 'Tracking to plan', target: '2026 commitments', status: 'good' },
      ],
    },
    {
      name: 'Pharmacy & Consumer Wellness',
      type: 'Retail Pharmacy + MinuteClinic + HealthHUB',
      region: 'National — ~9,000 locations',
      metrics: [
        { label: 'Prescriptions Filled Q1 2026', value: '451.2M', target: '≥1.865B FY2026', status: 'good' },
        { label: 'Q1 2026 Adj. Operating Income', value: '$1.20B', target: '≥$6.18B FY2026', status: 'good' },
        { label: 'Same-Store Total Revenue Growth', value: '~+3%', target: '4%+', status: 'good' },
        { label: 'Same-Store Pharmacy Scripts', value: '+7%', target: 'Outperform market', status: 'good' },
        { label: 'Retail Script Share', value: '>29%', target: '30%+', status: 'good' },
        { label: 'GLP-1 DTC Share Growth', value: '+200bps', target: 'Expand DTC channel', status: 'good' },
      ],
    },
    {
      name: 'Enterprise Technology & AI (Health100)',
      type: 'Digital Platform — AI-Native Consumer Engagement',
      region: 'National — any payer, PBM, pharmacy or provider can connect',
      metrics: [
        { label: 'Health100 Launch Timeline', value: 'H2 2026', target: 'On schedule', status: 'good' },
        { label: 'AI Deployment (Buckets)', value: '3 active', target: 'Cost/workflow/consumer', status: 'good' },
        { label: 'Informed Choice / Smart Compare', value: 'Live', target: 'Expand features', status: 'good' },
        { label: 'Prior Auth AI Approval Rate', value: '>80% real-time', target: '>85%', status: 'good' },
        { label: 'Insulin Access ($25/month)', value: '9,000 CVS locations', target: '60,000+ network', status: 'good' },
        { label: 'AI Academy for Colleagues', value: 'Launching 2026', target: 'Enterprise rollout', status: 'good' },
      ],
    },
  ],

  supplyChainMetrics: [
    {
      label: 'Pharmacy Network — Total Locations',
      value: 60000,
      unit: 'pharmacies',
      target: 65000,
      status: 'good',
      description: 'BD operates within a network of 60,000+ pharmacies accessible to its Caremark PBM clients and Aetna members, including ~9,000 CVS retail pharmacy locations.',
    },
    {
      label: 'Prescriptions Filled (30-day adj.)',
      value: 451.2,
      unit: 'M (Q1)',
      target: 466.0,
      status: 'good',
      description: 'Q1 2026 prescriptions filled 451.2M, +3.6% YoY. Includes adjustment to convert 90-day prescriptions to equivalent 30-day units.',
    },
    {
      label: 'Pharmacy Claims Processed (Caremark)',
      value: 464.7,
      unit: 'M (Q1)',
      target: 460.0,
      status: 'good',
      description: 'Caremark PBM claims Q1 2026: 464.7M. Volume stable YoY; revenue growth driven by drug mix shift to higher-cost specialty and branded drugs.',
    },
    {
      label: 'Biosimilar Conversion — Humira',
      value: 90,
      unit: '%',
      target: 90,
      status: 'good',
      description: 'Achieved >90% Humira biosimilar conversion — industry-leading. Majority of patients paying $0 out of pocket. Applying same playbook to Stelara (July 1, 2026 exclusion).',
    },
  ],
};
