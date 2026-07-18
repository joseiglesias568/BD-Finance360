// v2
// SEED REFERENCE ONLY — runtime data comes from DB via lib/db/repositories/operations.ts
//
// Provenance Legend: [CITED:10K-FY25] [CITED:10Q-Q2-26] [CITED:EC-Q2-26]
// [DERIVED] = math from cited  [ASSUMED] = estimate  [CONFIG-ONLY] = UI param
//
// ─────────────────────────────────────────────────────────────────────
// SOURCES
// BD Q2 FY2026 earnings call, IR slides, 10-Q, and FY2025 Annual Report.
// BD operates 60+ manufacturing plants globally, ~75,000 employees.
// ─────────────────────────────────────────────────────────────────────
import { OperationsConfig } from '../../types';

export const operations: OperationsConfig = {
  totalLocations: 60,                  // 60+ manufacturing and distribution facilities globally [CITED:10K-FY25]
  locationGrowth: 0,
  locationGrowthPercent: 0.0,

  locations: [
    {
      name: 'Medical Essentials',
      type: 'Medication Delivery Solutions + Specimen Management',
      region: 'Global — U.S., EMEA, Asia Pacific, Latin America',
      metrics: [
        { label: 'FY2025 Revenue', value: '$6,098M', target: '$6,220M FY2026 est.', status: 'good' },
        { label: 'Q2 FY26 Organic Growth (FXN)', value: '+1.7%', target: '+2.0%', status: 'warning' },
        { label: 'China VoBP Headwind', value: '-14% FXN Q2 FY26', target: 'Mitigate via EM growth', status: 'bad' },
        { label: 'MDS Safety Injection Devices', value: 'Growing', target: 'Market share gains', status: 'good' },
        { label: 'Specimen Management Oncology', value: 'Above segment average', target: 'Double-digit growth', status: 'good' },
        { label: 'BD Alaris (MDS Adjacent)', value: '78% site remediation', target: '100% by Q4 FY26', status: 'warning' },
      ],
    },
    {
      name: 'Connected Care',
      type: 'Medication Management Solutions (Alaris, Pyxis) + Advanced Patient Monitoring',
      region: 'Global — primarily U.S., growing internationally',
      metrics: [
        { label: 'FY2025 Revenue', value: '$4,556M', target: '$4,784M FY2026 est.', status: 'good' },
        { label: 'Q2 FY26 Organic Growth (FXN)', value: '+3.2%', target: '+5.0%', status: 'warning' },
        { label: 'BD Alaris Remediation Progress', value: '78% customer sites', target: '100% Q4 FY26', status: 'warning' },
        { label: 'HemoSphere Monitoring Revenue', value: 'Growing double-digit', target: 'Expand platform', status: 'good' },
        { label: 'Pyxis Dispensing — FDA Warning Letter', value: 'Remediation active', target: 'Resolution FY26', status: 'bad' },
        { label: 'Connected Medication Mgmt Installs', value: 'Accelerating', target: 'Maintain leadership', status: 'good' },
      ],
    },
    {
      name: 'BioPharma Systems',
      type: 'Prefillable Drug Delivery Systems + Pharmaceutical Packaging',
      region: 'Global — serving biopharmaceutical manufacturers',
      metrics: [
        { label: 'FY2025 Revenue', value: '$2,324M', target: '$2,394M FY2026 est.', status: 'good' },
        { label: 'Q2 FY26 Organic Growth (FXN)', value: '-1.8%', target: '+3.0%', status: 'bad' },
        { label: 'GLP-1 Delivery Device Pipeline', value: 'In development/ramp', target: 'Meaningful FY27 contribution', status: 'warning' },
        { label: 'Customer Destocking Status', value: 'Ongoing Q2 FY26', target: 'Resolution H2 FY26', status: 'warning' },
        { label: 'Prefillable Syringe Market Share', value: 'Leading position', target: 'Maintain/grow', status: 'good' },
        { label: 'Self-Injection Systems Pipeline', value: 'Multiple platforms', target: 'Launch new platforms FY26', status: 'good' },
      ],
    },
    {
      name: 'Interventional',
      type: 'Surgery + Peripheral Intervention + Urology & Critical Care',
      region: 'Global — growing in EMEA, LatAm, and Asia Pacific',
      metrics: [
        { label: 'FY2025 Revenue', value: '$5,217M', target: '$5,535M FY2026 est.', status: 'good' },
        { label: 'Q2 FY26 Organic Growth (FXN)', value: '+5.3%', target: '+6.0%', status: 'good' },
        { label: 'Peripheral Intervention Growth', value: 'Above segment average', target: 'Mid-to-high single digit', status: 'good' },
        { label: 'Urology & Critical Care Growth', value: 'Strong momentum', target: '+6%+ FXN', status: 'good' },
        { label: 'Surgery — BD ChloraPrep', value: 'Stable growth', target: 'Market leadership', status: 'good' },
        { label: 'New Product Revenue %', value: '18% of segment rev', target: '>20%', status: 'warning' },
      ],
    },
  ],

  supplyChainMetrics: [
    {
      label: 'BD Alaris Remediation Progress — Customer Sites',
      value: 78,
      unit: '% complete',
      target: 100,
      status: 'warning',
      description:
        'BD Alaris infusion system customer site remediation 78% complete as of Q2 FY26. ' +
        'Target: 100% completion by Q4 FY26. Full commercial return will unlock additional ' +
        'Connected Care revenue as pending hospital system deployments are activated.',
    },
    {
      label: 'On-Time In-Full (OTIF) Service Level',
      value: 93,
      unit: '%',
      target: 95,
      status: 'good',
      description:
        'OTIF service level 93% — a record high for BD. ' +
        'Reflects BD Excellence supply chain initiatives and inventory optimization. ' +
        'Critical metric for hospital and IDN customer satisfaction and contract renewal.',
    },
    {
      label: 'Manufacturing Plants with >8% Gross Productivity',
      value: 85,
      unit: '%',
      target: 90,
      status: 'good',
      description:
        '85% of BD manufacturing plants achieving >8% gross productivity improvement. ' +
        'Driven by BD Excellence lean manufacturing and automation investments. ' +
        'Supports adjusted gross margin expansion toward 55.5% target.',
    },
    {
      label: 'New Product Revenue as % of Total Revenue',
      value: 18,
      unit: '% (products <3 years old)',
      target: 20,
      status: 'warning',
      description:
        '18% of revenue from products launched in the last 3 years. ' +
        'Target >20% — reflects BD\'s commitment to R&D pipeline acceleration under ' +
        '"Innovate" pillar of Excellence Unleashed. Key pipeline: GLP-1 delivery, ' +
        'HemoSphere next-gen, BD Alaris next platform.',
    },
    {
      label: 'Regulatory Submissions YTD FY26',
      value: 12,
      unit: '510(k)/PMA submissions',
      target: 20,
      status: 'warning',
      description:
        '12 FDA 510(k)/PMA submissions filed YTD FY26 (H1). ' +
        'Full-year target: ~20 submissions. ' +
        'Pipeline covers Connected Care, Interventional, and BioPharma Systems devices.',
    },
    {
      label: 'FDA Warning Letters — Active',
      value: 2,
      unit: 'active Warning Letters',
      target: 0,
      status: 'bad',
      description:
        '2 active FDA Warning Letters: (1) BD Dispensing (Pyxis medication dispensing cabinets), ' +
        '(2) BD Specimen Management. Both under active remediation programs. ' +
        'Warning Letter resolution is a key strategic priority — required for full commercial launch ' +
        'of affected product categories and hospital contract expansions.',
    },
    {
      label: 'China Revenue Headwind (VoBP)',
      value: -14,
      unit: '% FXN impact Q2 FY26',
      target: 0,
      status: 'bad',
      description:
        'China Volume-Based Procurement (VoBP) program created -14% FXN revenue headwind ' +
        'in Q2 FY26 for affected product categories. ' +
        'BD executing mitigation strategy via growth in other emerging markets ' +
        '(India, Southeast Asia, Latin America). ' +
        'VoBP impact expected to stabilize as new product categories emerge outside procurement pools.',
    },
    {
      label: 'Product Recall Rate',
      value: 0.3,
      unit: '% of SKUs',
      target: 0.5,
      status: 'good',
      description:
        '0.3% product recall rate — below the 0.5% industry benchmark. ' +
        'Reflects BD\'s quality management systems and manufacturing excellence. ' +
        'BD Excellence quality initiatives targeting continued improvement.',
    },
  ],
};
