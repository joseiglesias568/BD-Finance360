import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed Operations data: OperationsSummary, Locations + Metrics,
// SupplyChainMetrics, DigitalMetrics, IndustryKPIs
//
// SOURCE: Becton, Dickinson and Company (BDX) — Q2 FY2026 earnings (May 2026),
// FY2025 10-K (filed Nov 2025), investor supplements.
// BD operates globally across 4 reportable segments + Corporate.
// ~72,000 total employees; manufacturing in 45+ countries; HQ: Franklin Lakes, NJ.
// BD Alaris remediation: FDA 510(k) secured 2023, return to market underway.
// Supply chain: multi-source raw materials, global distribution hubs, OTIF 93%.
// =============================================================================

interface LocationSeed {
  name: string;
  type: string;
  region: string;
  country: string;
  format: string;
  ownership: string;
  metrics: { label: string; value: string; target: string; status: string }[];
}

const locationData: LocationSeed[] = [
  {
    name: 'Medical Essentials',
    type: 'Medical Device Manufacturing & Distribution — Needles, Syringes, IV Catheters',
    region: 'Franklin Lakes, NJ (Global)',
    country: 'US',
    format: 'MedTech Manufacturing / Distribution',
    ownership: 'company-operated',
    metrics: [
      { label: 'Q2 FY26 Revenue ($M)',          value: '$1,647M',          target: '$1,650M+',              status: 'warning' },
      { label: 'FXN Organic Growth',             value: '+1.7% Q2 FY26',   target: '+2.0%',                 status: 'warning' },
      { label: 'China Revenue Trend (FXN)',       value: '-9.8% Q2 FY26',   target: '-5.0%',                 status: 'danger'  },
      { label: 'Manufacturing Productivity',     value: '+8.2% GPI',        target: '+8.0%',                 status: 'good'    },
      { label: 'OTIF Service Level',             value: '93%',              target: '95%',                   status: 'warning' },
    ],
  },
  {
    name: 'Connected Care',
    type: 'Infusion Systems, Medication Management, Patient Monitoring',
    region: 'San Diego, CA (Global)',
    country: 'US',
    format: 'MedTech / Hospital Systems',
    ownership: 'company-operated',
    metrics: [
      { label: 'Q2 FY26 Revenue ($M)',           value: '$1,120M',          target: '$1,150M+',              status: 'warning' },
      { label: 'FXN Organic Growth',             value: '+3.2% Q2 FY26',   target: '+5.0%',                 status: 'warning' },
      { label: 'BD Alaris Remediation Progress', value: '78% complete',     target: '85% complete',          status: 'warning' },
      { label: 'Alaris Installed Base Growth',   value: '+3.5% placements', target: '+5.0%',                 status: 'warning' },
      { label: 'APM Integration Synergies',      value: '$45M realized',    target: '$80M by FY27',          status: 'warning' },
    ],
  },
  {
    name: 'BioPharma Systems',
    type: 'Drug Delivery Systems, Prefillable Syringes, GLP-1 Platforms',
    region: 'Franklin Lakes, NJ (Global)',
    country: 'US',
    format: 'MedTech / Pharmaceutical Systems',
    ownership: 'company-operated',
    metrics: [
      { label: 'Q2 FY26 Revenue ($M)',           value: '$590M',            target: '$600M+',                status: 'warning' },
      { label: 'FXN Organic Growth',             value: '-1.8% Q2 FY26',   target: '+3.0%',                 status: 'danger'  },
      { label: 'GLP-1 Platform Wins',            value: '3 pharma partners', target: '5 by FY27',            status: 'warning' },
      { label: 'Prefillable Syringe Volume',     value: '+2.1% units YoY', target: '+4.0%',                  status: 'warning' },
      { label: 'New Drug Delivery NDA Support',  value: '8 active programs', target: '10 active',            status: 'warning' },
    ],
  },
  {
    name: 'Interventional',
    type: 'Surgical Instruments, Peripheral Intervention, Urology & Critical Care',
    region: 'Covington, GA (Global)',
    country: 'US',
    format: 'MedTech / Interventional',
    ownership: 'company-operated',
    metrics: [
      { label: 'Q2 FY26 Revenue ($M)',           value: '$1,357M',          target: '$1,360M+',              status: 'warning' },
      { label: 'FXN Organic Growth',             value: '+5.3% Q2 FY26',   target: '+6.0%',                 status: 'warning' },
      { label: 'New Product Revenue %',          value: '18% of revenue',   target: '20%',                   status: 'warning' },
      { label: 'Purewick Market Share',          value: '>35% U.S. UCC',    target: 'Maintain #1',           status: 'good'    },
      { label: 'Lutonix DCB Procedures (US)',    value: '+7.2% YoY',        target: '+8.0%',                 status: 'warning' },
    ],
  },
  {
    name: 'Enterprise / Corporate',
    type: 'Holding Company, Treasury, Capital Allocation & Strategy',
    region: 'Franklin Lakes, NJ',
    country: 'US',
    format: 'Corporate Headquarters',
    ownership: 'company-operated',
    metrics: [
      { label: 'Net Leverage (Q2 FY26)',         value: '2.9x',             target: '2.5x by FY27',          status: 'warning' },
      { label: 'Free Cash Flow H1 FY26 ($M)',    value: '$1,095M',          target: '$1,400M',               status: 'warning' },
      { label: 'Waters Spin-Off Debt Paydown',   value: '$2.0B applied',    target: 'Complete',              status: 'good'    },
      { label: 'Adj. Diluted EPS Q2 FY26',       value: '$2.90',            target: '$3.10',                 status: 'warning' },
      { label: 'FDA Warning Letters Active',     value: '2',                target: '0',                     status: 'danger'  },
    ],
  },
];

// Supply chain for BD — global device manufacturing, raw material sourcing,
// specialty device components, OTIF, cold chain for biologics device delivery.
const supplyChainData = [
  { label: 'Global OTIF Service Level',                  value: '93%',                             target: '>95%',              trend: 'up',   status: 'warning' },
  { label: 'Manufacturing Gross Productivity Improvement', value: '+8.2% GPI Q2 FY26',             target: '+8.0%',             trend: 'up',   status: 'good'    },
  { label: 'Raw Material Single-Source SKUs',            value: '12% of critical SKUs single-source', target: '<8%',            trend: 'down', status: 'warning' },
  { label: 'China Supply Chain Diversification',         value: '15% China-sourced → 11% target',  target: '<10% by FY28',      trend: 'down', status: 'warning' },
  { label: 'BD Distribution Center Fill Rate (US)',      value: '97.2%',                            target: '>98.0%',           trend: 'up',   status: 'warning' },
  { label: 'Active FDA Warning Letters',                 value: '2 active',                         target: '0',                trend: 'down', status: 'danger'  },
  { label: 'Inventory Days on Hand',                     value: '90 days',                          target: '<88 days',         trend: 'down', status: 'warning' },
  { label: 'Supplier On-Time Delivery Rate',             value: '94.8%',                            target: '>96.0%',           trend: 'up',   status: 'warning' },
];

const digitalMetricsData = [
  {
    label: 'BD Alaris Connected Infusion Platform',
    value: 'BD Alaris installed in 4,000+ U.S. hospitals',
    description: 'BD Alaris is the market-leading infusion pump platform in the U.S., installed across 4,000+ hospitals with ~200,000 pump units deployed. Following the 2021 FDA Warning Letter and voluntary field correction, BD secured 510(k) clearance for the Alaris System in May 2023 and resumed unrestricted sales in FY2024. The return-to-market program (78% complete as of Q2 FY26) involves software upgrades, drug library updates, and clinical specialist support at customer sites. Each 1,000 additional hospital accounts represents ~$35M annual recurring revenue from software/consumable attach rates. BD Alaris competes directly with Baxter Spectrum and ICU Medical Plum 360.',
  },
  {
    label: 'BD Medication Management Connectivity',
    value: '65% of Alaris customers using EMR integration',
    description: 'BD Medication Management connectivity — integration between BD Alaris infusion systems and hospital Electronic Medical Record (EMR) systems (Epic, Cerner, Meditech). EMR integration reduces programming errors by 74% and drives 85%+ compliance with IV-to-EMR drug library policies. Currently 65% of Alaris installed base is connected via BD Alaris System interface engine. Target: 80% connectivity by FY2027. Connected devices generate higher recurring revenue (software license + annual support) vs. non-connected devices. BD Pyxis automated dispensing cabinets (part of APM portfolio) also provide EMR connectivity at the dispensing level.',
  },
  {
    label: 'BD Rowa Pharmacy Automation Platform',
    value: '$320M annual revenue; 8,000+ pharmacy installations',
    description: 'BD Rowa is the leading global pharmacy automation platform — robotic dispensing systems for hospital and retail pharmacies. 8,000+ installations globally across Europe, Asia-Pacific, and North America. BD Rowa dispensing robots handle 85%+ of pharmacy inventory management at installed sites. Revenue model: hardware (50%) + software/service contracts (50%). Software/service recurring revenue growing at 8% annually. Rowa\'s integration with the new APM portfolio (medication dispensing cabinet + infusion + automation) creates a differentiated hospital medication management ecosystem.',
  },
  {
    label: 'BD Data Analytics & AI (BD Parata)',
    value: '1,200+ pharmacy AI analytics customers',
    description: 'BD Parata is BD\'s pharmacy automation and analytics platform for community and specialty pharmacies. 1,200+ customers using BD Parata analytics for prescription workflow optimization, adherence monitoring, and MTM (medication therapy management) services. BD Parata automated packaging systems reduce pharmacy dispensing errors by 88% and improve patient adherence by 12%. Integration with the Connected Care segment creates a full medication lifecycle data platform from prescription to patient administration. BD AI/analytics investments in 2026 focus on predictive supply chain and clinical decision support at point of care.',
  },
  {
    label: 'BD HealthSight Clinical Intelligence',
    value: 'Deployed in 180+ health systems',
    description: 'BD HealthSight is a cloud-based clinical decision support platform that aggregates data from BD Alaris infusion pumps, BD Pyxis dispensing cabinets, and BD diagnostics to surface real-time medication management intelligence. Deployed in 180+ U.S. health systems. HealthSight tracks medication waste, compliance with high-alert drug protocols, and infusion errors. The platform is a key differentiator for hospital formulary committee approvals and serves as a competitive moat — switching costs for an integrated HealthSight + Alaris + Pyxis customer are estimated at 3–5 years of system migration. Monthly HealthSight data feeds inform BD\'s product roadmap across Connected Care.',
  },
];

const industryKPIData = [
  {
    label: 'OTIF (On-Time In-Full) Service Level',
    value: '93%',
    target: '>95% industry best-in-class',
    benchmark: '95% MedTech industry avg',
    description: 'BD global On-Time In-Full (OTIF) service level for medical device deliveries: 93% in Q2 FY26 — below the 95% industry best-in-class target and prior quarter. OTIF measures the percentage of orders delivered complete and on time to hospital customers. Each 1pp improvement in OTIF ≈ $15M reduction in expedited shipping and customer penalty costs. Alaris return-to-market requires higher-than-normal OTIF compliance to maintain FDA commitments. Supply chain disruption risks (China sourcing, resin pricing) are the primary OTIF headwinds. BD Excellence Unleashed "Deliver" pillar includes a supply chain transformation workstream targeting 97% OTIF by FY2028.',
  },
  {
    label: 'BD Alaris Remediation Completion',
    value: '78% complete (vs 85% target)',
    target: '100% by Q4 FY26',
    benchmark: 'FDA Consent Decree / 510(k) Compliance',
    description: 'BD Alaris System remediation program completion rate. Following FDA 510(k) clearance in May 2023, BD is executing site-by-site software upgrades, drug library validations, and clinical specialist visits across 4,000+ U.S. hospital accounts. Q2 FY26 status: 78% complete (3,120 of 4,000 accounts). Target was 85% by Q2 FY26 — behind schedule by ~7pp. Delay attributed to hospital IT scheduling constraints and staff availability. Each percentage point of remediation progress ≈ $8M incremental Alaris annual revenue recovery (software attach rate + consumables). 100% remediation completion is a prerequisite for BD Alaris system upgrades (Gen 2 planned FY2027) and is closely monitored by FDA.',
  },
  {
    label: 'New Product Revenue %',
    value: '18% of revenue from products launched in past 3 years',
    target: '>20% of revenue',
    benchmark: '20% MedTech industry innovation benchmark',
    description: 'BD new product revenue vitality index: percentage of revenue from products launched within the past 36 months. Q2 FY26: 18% — below the 20% industry benchmark and BD target. New product launches in FY2026 include: Avitene Flowable hemostatic (Interventional, Q1 FY26), HemoSphere Stream Module (Connected Care, Q2 FY26), and multiple BioPharma Systems GLP-1 delivery platform components. BD R&D investment at 5.2%–5.8% of revenue supports the innovation pipeline. BD Excellence Unleashed "Innovate" pillar targets >20% vitality index by FY2027 through pipeline acceleration and faster commercialization cycles.',
  },
  {
    label: 'China Revenue Trend (FXN)',
    value: '-9.8% Q2 FY26 FXN (target -5%)',
    target: '-5.0% FXN full-year FY26',
    benchmark: 'Peer avg: -6% to -8% China VBP impact',
    description: 'BD China revenue trend on a FXN basis. Q2 FY26: -9.8% — worse than the -5.0% target, driven by VBP (Volume-Based Procurement) pricing pressure on BD\'s core Medical Essentials products (needles, syringes, IV catheters). China VBP represents the single largest geographic headwind for BD, reducing BD China revenue by approximately $150–200M annually vs. pre-VBP trajectory. BD\'s China mitigation strategy includes: (1) offsetting Medical Essentials VBP with Interventional growth in China; (2) shifting China manufacturing to BioPharma Systems for export; (3) growing in other emerging markets (India, Southeast Asia, Middle East) to offset China. Chinese hospital capex constraints and regulatory uncertainty add to headwinds.',
  },
  {
    label: 'Emerging Markets Growth (FXN)',
    value: '+3.5% FXN Q2 FY26 (target +5%)',
    target: '>+5.0% FXN',
    benchmark: '+5% MedTech EM growth benchmark',
    description: 'BD emerging markets revenue growth on an FXN basis (ex-China). Q2 FY26: +3.5% FXN — below the +5.0% target. Emerging markets represent approximately 25% of BD total revenue (ex-China). Key growth markets: India, Brazil, Middle East (KSA, UAE), Southeast Asia. Growth drivers: hospital capex expansion, government healthcare infrastructure investment, and BD product localization (BD India manufacturing for local supply). Headwinds: currency volatility in Latin America, regulatory delays in select EM markets. BD Excellence Unleashed commercial excellence workstream includes dedicated EM sales force expansion and distributor management improvement programs.',
  },
  {
    label: 'Adjusted Operating Margin vs. Peers',
    value: '24.2% BD vs 25–26% peer median',
    target: '25.5% by FY2027',
    benchmark: '25–26% large MedTech median (MDT, SYK)',
    description: 'BD adjusted operating margin of 24.2% in Q2 FY26 remains below the large-cap MedTech peer median of 25–26%. Primary gap: amortization of APM acquisition intangibles, BD Alaris remediation costs, and China/EM segment mix headwinds. BD Excellence Unleashed "Deliver" pillar targets $200M cost-out program ($150M run-rate achieved Q2 FY26), gross productivity improvement, and SG&A efficiency. Each 50bps margin improvement ≈ $90M additional operating income annually. BD targets 25.5% adjusted operating margin by FY2027 — a 130bps improvement from current Q2 FY26 level. Key margin levers: cost-out realization, Alaris remediation completion, mix shift to higher-margin Interventional and BioPharma Systems.',
  },
];

export async function seedOperations(
  prisma: PrismaClient,
  companyId: number,
  periodMap: Record<string, { id: number }>
) {
  const q2Fy26Id = periodMap['Q2 FY26'].id;

  // BD operates globally: 4 reportable segments + corporate.
  // ~72,000 employees, manufacturing in 45+ countries, sales in 190+ countries.
  await prisma.operationsSummary.create({
    data: {
      companyId,
      totalLocations: 4,         // Four reportable segments
      locationGrowth: 0,          // Stable segment structure post-Waters spin-off
      locationGrowthPercent: 0.0, // Waters spun off Feb 2026; 4 continuing segments
    },
  });

  console.log('Seeded operations summary');

  let locationCount = 0;
  let metricCount = 0;

  for (const loc of locationData) {
    const location = await prisma.location.create({
      data: {
        companyId,
        name: loc.name,
        type: loc.type,
        region: loc.region,
      },
    });
    locationCount++;

    for (const metric of loc.metrics) {
      await prisma.locationMetric.create({
        data: {
          locationId: location.id,
          periodId: q2Fy26Id,
          label: metric.label,
          value: metric.value,
          target: metric.target,
          status: metric.status,
        },
      });
      metricCount++;
    }
  }

  console.log(`Seeded ${locationCount} locations with ${metricCount} location metrics`);

  for (const metric of supplyChainData) {
    await prisma.supplyChainMetric.create({
      data: {
        companyId,
        periodId: q2Fy26Id,
        label: metric.label,
        value: metric.value,
        target: metric.target,
        trend: metric.trend,
        status: metric.status,
      },
    });
  }

  console.log(`Seeded ${supplyChainData.length} supply chain metrics`);

  for (const metric of digitalMetricsData) {
    await prisma.digitalMetric.create({
      data: {
        companyId,
        label: metric.label,
        value: metric.value,
        description: metric.description,
      },
    });
  }

  console.log(`Seeded ${digitalMetricsData.length} digital metrics`);

  for (const kpi of industryKPIData) {
    await prisma.industryKPI.create({
      data: {
        companyId,
        label: kpi.label,
        value: kpi.value,
        target: kpi.target,
        benchmark: kpi.benchmark,
        description: kpi.description,
      },
    });
  }

  console.log(`Seeded ${industryKPIData.length} industry KPIs`);
}
