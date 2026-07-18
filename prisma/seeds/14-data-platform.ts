import { PrismaClient } from '@prisma/client';

// =============================================================================
// Seed Data Platform: Data Sources, Data Flows, DQ Checks, MDM Entities
// Layer 1 (Data Inputs) + Layer 2 (Finance Data Lake)
// Becton, Dickinson and Company (BDX) — Finance360 platform
// FY ends September 30. BD operates 4 segments post-Waters spin-off (Feb 2026):
//   Medical Essentials | Connected Care | BioPharma Systems | Interventional
// =============================================================================

export async function seedDataPlatform(prisma: PrismaClient, companyId: number) {
  // Delete existing records before creating new ones
  await prisma.masterDataEntity.deleteMany({ where: { companyId } });
  await prisma.dataQualityCheck.deleteMany({ where: { companyId } });

  console.log('  Seeding BD data sources...');

  const sources = await Promise.all([
    prisma.dataSource.create({
      data: {
        companyId,
        externalId:       'sap-s4hana',
        name:             'SAP S/4HANA (Finance & Accounting)',
        type:             'ERP',
        category:         'Financial',
        description:
          'Core financial ERP for BD global operations. Covers ~$18B annual revenue across Medical Essentials, Connected Care, BioPharma Systems, and Interventional segments. Manages product revenue recognition (ASC 606), COGS by segment, SG&A allocation, R&D expenses, Alaris remediation accruals (~$300M FY26), goodwill and intangible amortization (~$2,462M FY25 D&A), intercompany transfer pricing, interest expense (~$620M annually on ~$18.8B LTD), and income tax provision. Source of record for consolidated P&L, balance sheet (~$40B total assets), and FCF tracking vs ~$3.0B plan.',
        connectionType:   'Direct API',
        refreshFrequency: 'Daily',
        lastSyncAt:       '2026-05-15T06:00:00Z',
        status:           'active',
        recordCount:       8500000,
        owner:            'BD Finance IT',
      },
    }),
    prisma.dataSource.create({
      data: {
        companyId,
        externalId:       'bd-order-management',
        name:             'BD Order Management System (OMS)',
        type:             'Operational',
        category:         'Operational',
        description:
          'BD global order management system tracking customer orders across Medical Essentials (syringe, blood collection, IV catheter consumables), Connected Care (Alaris pump and Pyxis capital orders), BioPharma Systems (PFS and drug delivery supply agreements), and Interventional (vascular, oncology device orders). Processes Alaris backlog (~32K deferred units), BioPharma Systems PFS long-term supply agreement delivery schedules (Novo Nordisk, Eli Lilly), and GPO contract orders. Key source for revenue recognition cutoff controls and channel inventory management.',
        connectionType:   'Real-time Streaming',
        refreshFrequency: 'Real-time',
        lastSyncAt:       '2026-05-15T08:00:00Z',
        status:           'active',
        recordCount:      52000000,
        owner:            'BD Commercial IT',
      },
    }),
    prisma.dataSource.create({
      data: {
        companyId,
        externalId:       'bd-manufacturing-mes',
        name:             'Manufacturing Execution System (BD MES)',
        type:             'Operational',
        category:         'Operational',
        description:
          'BD global manufacturing execution and quality management system across 50+ manufacturing sites. Tracks BioPharma Systems PFS capacity utilization (currently 88% at Franklin Lakes NJ and Pont-de-Claix France), production batch records, quality system non-conformances, and BD Excellence program efficiency metrics. Critical for Alaris FDA consent decree compliance monitoring (zero 483 observations Q1–Q2 FY26), GLP-1 PFS production scheduling vs Novo Nordisk and Eli Lilly supply agreements, and capacity planning for FY2027 expansion authorization.',
        connectionType:   'Batch ETL',
        refreshFrequency: 'Daily',
        lastSyncAt:       '2026-05-15T04:30:00Z',
        status:           'active',
        recordCount:      38000000,
        owner:            'BD Manufacturing IT / Quality',
      },
    }),
    prisma.dataSource.create({
      data: {
        companyId,
        externalId:       'bd-salesforce-crm',
        name:             'Salesforce CRM (BD Commercial)',
        type:             'CRM',
        category:         'Operational',
        description:
          'BD global customer relationship management platform for hospital, lab, and pharmaceutical customers. Tracks Alaris pump pipeline (hospital capital orders, evaluation units, deferred order backlog ~32K units), BioPharma Systems pharma customer supply agreement renewals (Novo Nordisk through 2030, Eli Lilly through 2029), GPO contract opportunities (U.S. Medical Essentials), Pyxis MedStation sales pipeline (1,840 annualized placements), and Interventional device opportunity pipeline. Provides commercial productivity and win rate metrics by segment.',
        connectionType:   'API',
        refreshFrequency: 'Daily',
        lastSyncAt:       '2026-05-15T05:00:00Z',
        status:           'active',
        recordCount:      18500000,
        owner:            'BD Commercial IT',
      },
    }),
    prisma.dataSource.create({
      data: {
        companyId,
        externalId:       'bd-treasury',
        name:             'BD Treasury & Debt Management System',
        type:             'Financial',
        category:         'Financial',
        description:
          'BD treasury management system for debt portfolio, FX hedging, and cash flow. Manages ~$18.8B long-term debt portfolio (weighted avg rate ~3.8%), FX forward contract positions (EUR, CNY, JPY, BRL hedges — net benefit ~$65M annually), cash pooling across 70+ countries, and debt maturity schedule. Feeds leverage ratio calculation (2.9x net debt/adj. EBITDA Q2 FY26), interest expense accrual (~$155M/quarter), FCF conversion tracking (96% H1 FY26), and annual debt reduction progress ($750M H1 vs $1,500M FY plan).',
        connectionType:   'Direct API',
        refreshFrequency: 'Daily',
        lastSyncAt:       '2026-05-15T06:30:00Z',
        status:           'active',
        recordCount:       2800000,
        owner:            'BD Treasury',
      },
    }),
    prisma.dataSource.create({
      data: {
        companyId,
        externalId:       'bd-regulatory-tracking',
        name:             'BD Regulatory Affairs & FDA Compliance System',
        type:             'Regulatory',
        category:         'Compliance',
        description:
          'BD regulatory affairs database tracking FDA submissions, 510(k) clearances, PMA applications, and consent decree compliance monitoring for Alaris. Tracks Alaris consent decree remediation progress (zero 483 observations Q1–Q2 FY26), FDA communication logs for BD Diagnostics and BD Medical devices, and global regulatory filing status across CE Mark, PMDA (Japan), NMPA (China) submissions. Critical for Alaris market re-entry tracking and BioPharma Systems pharma customer regulatory requirements for drug-device combination products.',
        connectionType:   'Batch ETL',
        refreshFrequency: 'Weekly',
        lastSyncAt:       '2026-05-12T10:00:00Z',
        status:           'active',
        recordCount:        850000,
        owner:            'BD Regulatory Affairs',
      },
    }),
    prisma.dataSource.create({
      data: {
        companyId,
        externalId:       'china-nhsa-vobp',
        name:             'China NHSA VoBP Tender Database',
        type:             'External',
        category:         'Competitive Intelligence',
        description:
          'External data feed tracking China National Healthcare Security Administration (NHSA) Volume-Based Procurement tender notices, awarded pricing, and pipeline product categories. Critical for BD Medical Essentials and Connected Care exposure management. Current coverage: syringe VoBP rounds 1–8 ($160M FY26 headwind), blood collection, IV therapy consumables. Monitors pipeline categories: insulin syringes (35% probability Q4 FY26 wave), infusion sets, diagnostics consumables. Feeds China revenue exposure models and VoBP contingency planning analytics.',
        connectionType:   'Third-party Feed',
        refreshFrequency: 'Weekly',
        lastSyncAt:       '2026-05-10T09:00:00Z',
        status:           'active',
        recordCount:        420000,
        owner:            'BD China Finance / FP&A',
      },
    }),
    prisma.dataSource.create({
      data: {
        companyId,
        externalId:       'bd-reval-fx',
        name:             'Reval FX Hedging & Rate System',
        type:             'Financial',
        category:         'Financial',
        description:
          'BD FX risk management and hedge accounting system (Reval / ION). Manages EUR/USD (~18% revenue, ~$800M/quarter exposure), CNY/USD (~10%, ~$470M/quarter), JPY/USD (~4%), BRL/USD (~3%) forward contract portfolios. Tracks net hedge benefit ($65M annual plan, $32M H1 FY26 actuals), mark-to-market valuation of derivative positions, and constant currency vs reported revenue bridge. Feeds FX translation headwind calculation ($230M FY26 plan, $116M H1 actual) and earnings sensitivity analysis for FX scenarios.',
        connectionType:   'API',
        refreshFrequency: 'Daily',
        lastSyncAt:       '2026-05-15T07:00:00Z',
        status:           'active',
        recordCount:        1200000,
        owner:            'BD Treasury',
      },
    }),
    prisma.dataSource.create({
      data: {
        companyId,
        externalId:       'bd-workday-hr',
        name:             'Workday HR & Workforce Analytics',
        type:             'HR',
        category:         'Operational',
        description:
          'BD global HR and workforce management system for ~75,000 employees post-Waters spin-off. Tracks headcount by segment and geography, BD Excellence quality training completion rates, compensation and benefits for segment SG&A cost allocation, restructuring and severance accruals, and executive compensation benchmarking. Feeds segment SG&A per revenue metrics, revenue per FTE tracking (~$240K/FTE), and BD BD Excellence quality training compliance for FDA consent decree documentation requirements.',
        connectionType:   'Batch ETL',
        refreshFrequency: 'Weekly',
        lastSyncAt:       '2026-05-14T06:00:00Z',
        status:           'active',
        recordCount:        7500000,
        owner:            'BD HR IT',
      },
    }),
    prisma.dataSource.create({
      data: {
        companyId,
        externalId:       'gartner-medtech-market',
        name:             'Gartner / IQVIA MedTech Market Intelligence',
        type:             'Market Intelligence',
        category:         'Competitive Intelligence',
        description:
          'External market intelligence feeds from Gartner Health, IQVIA, and Evaluate MedTech covering BD\'s competitive markets. Tracks infusion pump market share data (Alaris vs ICU Medical, Baxter), GLP-1 drug supply and demand forecasts (affecting BioPharma Systems PFS demand), peripheral vascular procedure volume trends (Lutonix DCB vs Medtronic IN.PACT market share), and U.S. medical device market growth rates by segment. Feeds competitive benchmarking dashboards, Alaris market share recovery tracking, and BioPharma Systems addressable market sizing for GLP-1 capacity investment decisions.',
        connectionType:   'Third-party Feed',
        refreshFrequency: 'Monthly',
        lastSyncAt:       '2026-05-01T12:00:00Z',
        status:           'active',
        recordCount:        3800000,
        owner:            'BD Corporate Strategy',
      },
    }),
  ]);

  console.log(`  Seeded ${sources.length} BD data sources`);

  // ── Data Flows ─────────────────────────────────────────────────────────────

  console.log('  Seeding BD data flows...');

  const sapIdx    = 0;  // sap-s4hana
  const omsIdx    = 1;  // bd-order-management
  const mesIdx    = 2;  // bd-manufacturing-mes
  const crmIdx    = 3;  // bd-salesforce-crm
  const treasIdx  = 4;  // bd-treasury
  const regIdx    = 5;  // bd-regulatory-tracking
  const vobpIdx   = 6;  // china-nhsa-vobp
  const revalIdx  = 7;  // bd-reval-fx
  const hrIdx     = 8;  // bd-workday-hr
  const mktIdx    = 9;  // gartner-medtech-market

  const flowData = [
    // SAP → Finance360 core flows
    { sourceId: sources[sapIdx].id,   targetLayer: 'gold',   targetEntity: 'financial_statements', transformations: ['currency_convert','segment_rollup','budget_variance'], lastRunAt: '2026-05-15T06:00:00Z', lastRunStatus: 'success', recordsProcessed: 2800000, recordsRejected: 0, avgLatencyMs: 45000 },
    { sourceId: sources[sapIdx].id,   targetLayer: 'silver', targetEntity: 'trial_balance',        transformations: ['accrual_aggregate','da_schedule_join'],               lastRunAt: '2026-05-15T06:30:00Z', lastRunStatus: 'success', recordsProcessed: 620000,  recordsRejected: 0, avgLatencyMs: 30000 },
    // OMS → Finance360
    { sourceId: sources[omsIdx].id,   targetLayer: 'gold',   targetEntity: 'segment_results',      transformations: ['revenue_recognition','cc_conversion'],                lastRunAt: '2026-05-15T07:00:00Z', lastRunStatus: 'success', recordsProcessed: 180000,  recordsRejected: 0, avgLatencyMs: 22000 },
    { sourceId: sources[omsIdx].id,   targetLayer: 'silver', targetEntity: 'kpi_values',           transformations: ['backlog_aggregate','pipeline_score'],                 lastRunAt: '2026-05-15T07:15:00Z', lastRunStatus: 'success', recordsProcessed: 45000,   recordsRejected: 0, avgLatencyMs: 18000 },
    // MES → Finance360
    { sourceId: sources[mesIdx].id,   targetLayer: 'gold',   targetEntity: 'kpi_values',           transformations: ['capacity_utilization_calc','pfs_unit_normalize'],     lastRunAt: '2026-05-15T04:30:00Z', lastRunStatus: 'success', recordsProcessed: 28000,   recordsRejected: 0, avgLatencyMs: 35000 },
    { sourceId: sources[mesIdx].id,   targetLayer: 'silver', targetEntity: 'kpi_values',           transformations: ['483_observation_flag','compliance_status_map'],       lastRunAt: '2026-05-15T04:45:00Z', lastRunStatus: 'success', recordsProcessed: 12000,   recordsRejected: 0, avgLatencyMs: 60000 },
    // CRM → Finance360
    { sourceId: sources[crmIdx].id,   targetLayer: 'gold',   targetEntity: 'kpi_values',           transformations: ['pipeline_stage_rollup','win_rate_calc'],              lastRunAt: '2026-05-15T05:00:00Z', lastRunStatus: 'success', recordsProcessed: 65000,   recordsRejected: 0, avgLatencyMs: 28000 },
    // Treasury → Finance360
    { sourceId: sources[treasIdx].id, targetLayer: 'gold',   targetEntity: 'financial_ratios',     transformations: ['leverage_calc','fcf_conversion_rate'],                lastRunAt: '2026-05-15T07:00:00Z', lastRunStatus: 'success', recordsProcessed: 8500,    recordsRejected: 0, avgLatencyMs: 15000 },
    // Regulatory → Finance360
    { sourceId: sources[regIdx].id,   targetLayer: 'bronze', targetEntity: 'kpi_values',           transformations: ['consent_decree_status_map','483_log_normalize'],      lastRunAt: '2026-05-12T10:00:00Z', lastRunStatus: 'success', recordsProcessed: 1200,    recordsRejected: 0, avgLatencyMs: 120000 },
    // VoBP → Finance360
    { sourceId: sources[vobpIdx].id,  targetLayer: 'silver', targetEntity: 'kpi_values',           transformations: ['tender_price_normalize','vobp_headwind_calc'],        lastRunAt: '2026-05-12T09:00:00Z', lastRunStatus: 'success', recordsProcessed: 3500,    recordsRejected: 0, avgLatencyMs: 90000 },
    // Reval FX → Finance360
    { sourceId: sources[revalIdx].id, targetLayer: 'gold',   targetEntity: 'financial_ratios',     transformations: ['fx_rate_apply','hedge_benefit_calc','cc_to_reported'], lastRunAt: '2026-05-15T03:00:00Z', lastRunStatus: 'success', recordsProcessed: 48000,   recordsRejected: 0, avgLatencyMs: 12000 },
    // Market Intel → Finance360
    { sourceId: sources[mktIdx].id,   targetLayer: 'bronze', targetEntity: 'kpi_values',           transformations: ['market_share_normalize','glp1_demand_index'],         lastRunAt: '2026-05-01T12:00:00Z', lastRunStatus: 'success', recordsProcessed: 280000,  recordsRejected: 0, avgLatencyMs: 240000 },
  ];

  await Promise.all(
    flowData.map((f) => prisma.dataFlow.create({ data: { companyId, ...f } })),
  );
  console.log(`  Seeded ${flowData.length} BD data flows`);

  // ── Data Quality Checks ────────────────────────────────────────────────────

  console.log('  Seeding BD data quality checks...');

  await prisma.dataQualityCheck.createMany({
    data: [
      { companyId, checkName: 'BD Segment P&L Completeness',      checkType: 'completeness', targetEntity: 'financial_statements', rule: 'All four BD segments have full P&L close data loaded',                        status: 'pass', score: 100.0, lastRunAt: '2026-05-15T06:30:00Z', totalRecords: 2800000, failedRecords: 0,    details: '' },
      { companyId, checkName: 'Alaris Accrual Reconciliation',     checkType: 'accuracy',     targetEntity: 'financial_statements', rule: 'Monthly Alaris remediation accrual matches legal cost tracking system',        status: 'pass', score: 100.0, lastRunAt: '2026-05-15T06:45:00Z', totalRecords: 1,       failedRecords: 0,    details: '' },
      { companyId, checkName: 'BD D&A Schedule Accuracy',          checkType: 'accuracy',     targetEntity: 'financial_statements', rule: 'D&A per segment matches amortization schedule ($615M/quarter target)',         status: 'pass', score: 99.8,  lastRunAt: '2026-05-15T07:00:00Z', totalRecords: 18500,   failedRecords: 37,   details: '37 rounding variances <$1K each' },
      { companyId, checkName: 'Alaris Shipment Cutoff',            checkType: 'timeliness',   targetEntity: 'segment_results',      rule: 'All Alaris pump shipments recorded within 24h of FOB shipping point',         status: 'pass', score: 99.6,  lastRunAt: '2026-05-15T08:15:00Z', totalRecords: 4500,    failedRecords: 18,   details: '18 late-day shipments; non-material' },
      { companyId, checkName: 'BioPharma PFS Revenue Recognition', checkType: 'accuracy',     targetEntity: 'segment_results',      rule: 'PFS supply agreement revenue recognized per ASC 606 delivery milestones',      status: 'pass', score: 100.0, lastRunAt: '2026-05-15T08:30:00Z', totalRecords: 12800,   failedRecords: 0,    details: '' },
      { companyId, checkName: 'PFS Capacity Utilization Reporting',checkType: 'accuracy',     targetEntity: 'kpi_values',           rule: 'Daily PFS utilization (88%) reconciles to production batch records',            status: 'pass', score: 99.9,  lastRunAt: '2026-05-15T04:45:00Z', totalRecords: 28000,   failedRecords: 28,   details: '28 batch records pending manual confirmation' },
      { companyId, checkName: 'Alaris Manufacturing 483 Tracking', checkType: 'completeness', targetEntity: 'kpi_values',           rule: 'All FDA 483 observations logged and disposition documented',                    status: 'pass', score: 100.0, lastRunAt: '2026-05-12T10:30:00Z', totalRecords: 0,       failedRecords: 0,    details: 'Zero 483 observations Q1–Q2 FY26' },
      { companyId, checkName: 'Leverage Ratio Calculation',        checkType: 'accuracy',     targetEntity: 'financial_ratios',     rule: 'Net debt / adj. EBITDA reconciles to 2.9x Q2 FY26 published figure',           status: 'pass', score: 100.0, lastRunAt: '2026-05-15T07:15:00Z', totalRecords: 1,       failedRecords: 0,    details: '' },
      { companyId, checkName: 'FX Hedge Portfolio Valuation',      checkType: 'accuracy',     targetEntity: 'financial_ratios',     rule: 'Reval FX hedge mark-to-market positions reconcile to treasury ledger <0.1%',   status: 'pass', score: 99.7,  lastRunAt: '2026-05-15T07:30:00Z', totalRecords: 48000,   failedRecords: 144,  details: '144 micro-lot positions pending end-of-day revaluation' },
      { companyId, checkName: 'China VoBP Tender Coverage',        checkType: 'completeness', targetEntity: 'kpi_values',           rule: 'All active NHSA tender categories affecting BD products are tracked',           status: 'pass', score: 98.5,  lastRunAt: '2026-05-12T09:15:00Z', totalRecords: 420000,  failedRecords: 6300, details: '6,300 records pending NHSA category classification update' },
    ],
  });
  console.log('  Seeded 10 BD data quality checks');

  // ── Master Data Entities ───────────────────────────────────────────────────

  console.log('  Seeding BD master data entities...');

  await prisma.masterDataEntity.createMany({
    data: [
      { companyId, domain: 'BD Segment Hierarchy',           entityCount: 4,       lastUpdated: '2026-05-15', steward: 'Corporate Finance',         goldenRecordPct: 100.0, duplicateCount: 0,   status: 'active' },
      { companyId, domain: 'Chart of Accounts',              entityCount: 4200,    lastUpdated: '2026-05-15', steward: 'Finance Ops',               goldenRecordPct: 99.8,  duplicateCount: 8,   status: 'active' },
      { companyId, domain: 'Customer Master',                entityCount: 22200,   lastUpdated: '2026-05-14', steward: 'Commercial Ops',            goldenRecordPct: 97.4,  duplicateCount: 580, status: 'active' },
      { companyId, domain: 'Product Hierarchy',              entityCount: 48000,   lastUpdated: '2026-05-15', steward: 'R&D / Product Management',  goldenRecordPct: 98.1,  duplicateCount: 912, status: 'active' },
      { companyId, domain: 'Cost Center Hierarchy',          entityCount: 1850,    lastUpdated: '2026-05-15', steward: 'Finance Ops',               goldenRecordPct: 100.0, duplicateCount: 0,   status: 'active' },
      { companyId, domain: 'Supplier Master',                entityCount: 6200,    lastUpdated: '2026-05-10', steward: 'Supply Chain',              goldenRecordPct: 96.2,  duplicateCount: 235, status: 'active' },
      { companyId, domain: 'Geographic Hierarchy',           entityCount: 180,     lastUpdated: '2026-05-01', steward: 'Corporate Strategy',        goldenRecordPct: 100.0, duplicateCount: 0,   status: 'active' },
      { companyId, domain: 'Regulatory Submission Registry', entityCount: 1850,    lastUpdated: '2026-05-12', steward: 'BD Regulatory Affairs',     goldenRecordPct: 100.0, duplicateCount: 0,   status: 'active' },
      { companyId, domain: 'Fixed Asset Register',           entityCount: 28400,   lastUpdated: '2026-04-30', steward: 'Finance Ops',               goldenRecordPct: 99.3,  duplicateCount: 198, status: 'active' },
      { companyId, domain: 'China VoBP Tender Master',       entityCount: 420000,  lastUpdated: '2026-05-10', steward: 'Medical Essentials China',  goldenRecordPct: 98.5,  duplicateCount: 6300,status: 'active' },
      { companyId, domain: 'FX Hedge Contract Registry',     entityCount: 48000,   lastUpdated: '2026-05-15', steward: 'Treasury',                  goldenRecordPct: 99.7,  duplicateCount: 144, status: 'active' },
      { companyId, domain: 'PFS Supply Agreement Master',    entityCount: 12800,   lastUpdated: '2026-05-14', steward: 'BioPharma Systems Finance', goldenRecordPct: 100.0, duplicateCount: 0,   status: 'active' },
    ],
  });
  console.log('  Seeded 12 BD master data entities');

  console.log('BD Data Platform seed complete');
}
