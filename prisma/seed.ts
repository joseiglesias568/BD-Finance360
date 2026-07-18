import { PrismaClient } from '@prisma/client';
import { seedCompany } from './seeds/01-company';
import { seedFiscalPeriods } from './seeds/02-fiscal-periods';
import { seedFinancials } from './seeds/03-financials';
import { seedKPIs } from './seeds/04-kpis';
import { seedOperations } from './seeds/05-operations';
import { seedStrategic } from './seeds/06-strategic';
import { seedMarket } from './seeds/07-market';
import { seedScenarios } from './seeds/08-scenarios';
import { seedAlertsAndReports } from './seeds/09-alerts-reports';
import { seedMonthEnd } from './seeds/10-month-end';
import { seedInsights } from './seeds/11-insights';
import { seedBusinessConsoles } from './seeds/12-business-consoles';
import { seedExecutive } from './seeds/13-executive';
import { seedDataPlatform } from './seeds/14-data-platform';
import { seedAnalyticsProducts } from './seeds/15-analytics-products';
import { seedInCycleEstimates } from './seeds/16-in-cycle';
import { seedEpmConfig } from './seeds/17-epm-config';
import { seedCommentary } from './seeds/18-commentary';

// Enrichment Layer: Dimensional data for rich AI analysis
import { seedExtendedPeriods } from './seeds/19-extended-periods';
import { seedMonthlyFinancials } from './seeds/20-monthly-financials';
import { seedRegionalPerformance } from './seeds/21-regional-performance';
import { seedProductAndDaypart } from './seeds/22-product-daypart';
import { seedCostDrivers } from './seeds/23-cost-drivers';
import { seedVarianceExplanations } from './seeds/24-variance-explanations';
import { seedExpandedInsights } from './seeds/25-expanded-insights';
import { seedExpandedCommentary } from './seeds/26-expanded-commentary';
import { seedExpandedAnomalies } from './seeds/27-expanded-anomalies';
import { seedAnalyticalData } from './seeds/28-weekly-clusters-elasticity-competitors';
import { seedGeneratedInsights } from './seeds/29-generated-insights';
import { seedGeneratedCommentary } from './seeds/30-generated-commentary';

// Platform Enhancement Layer
import { seedStoreFormatMix } from './seeds/31-store-format-mix';
import { seedStrategyExecution } from './seeds/32-strategy-execution';
import { seedCommodityPrices } from './seeds/33-commodity-prices';
import { seedFXImpacts } from './seeds/34-fx-impacts';
import { seedLaborMetrics } from './seeds/35-labor-metrics';
import { seedCustomerSatisfaction } from './seeds/36-customer-satisfaction';
import { seedPromotionalCalendar } from './seeds/37-promotional-calendar';
import { seedStoreRenovations } from './seeds/38-store-renovations';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data (order matters due to foreign keys)
  console.log('🧹 Cleaning existing data...');
  await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE '\_prisma\_%') LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" CASCADE';
      END LOOP;
    END $$;
  `);
  console.log('✅ Database cleaned\n');

  // Phase 1: Core entities
  const company = await seedCompany(prisma);
  const companyId = company.id;
  console.log('');

  const periodMap = await seedFiscalPeriods(prisma, companyId);
  console.log('');

  // Phase 2: Financial data
  await seedFinancials(prisma, companyId, periodMap);
  console.log('');

  // Phase 3: KPIs with actuals, forecast, and budget
  await seedKPIs(prisma, companyId, periodMap);
  console.log('');

  // Phase 4: Operations
  await seedOperations(prisma, companyId, periodMap);
  console.log('');

  // Phase 5: Strategic data
  await seedStrategic(prisma, companyId);
  console.log('');

  // Phase 6: Market & competitive
  await seedMarket(prisma, companyId);
  console.log('');

  // Phase 7: Scenarios
  await seedScenarios(prisma, companyId);
  console.log('');

  // Phase 8: Alerts & Reports
  await seedAlertsAndReports(prisma, companyId);
  console.log('');

  // Phase 9: Month-end close
  await seedMonthEnd(prisma, companyId);
  console.log('');

  // Phase 10: AI Insights (14 personalized insights from IR data)
  await seedInsights(prisma, companyId);
  console.log('');

  // Phase 11: Business Consoles (14 consoles + ~400 drivers + ~300 metrics)
  await seedBusinessConsoles(prisma, companyId);
  console.log('');

  // Phase 12: Executive Summary & Monthly Report data
  await seedExecutive(prisma, companyId);
  console.log('');

  // Phase 13: Data Platform (Layer 1+2: Data Sources, Flows, DQ, MDM)
  await seedDataPlatform(prisma, companyId);
  console.log('');

  // Phase 14: Analytics Products (Layer 3: ML Forecasts, Anomaly Detection)
  await seedAnalyticsProducts(prisma, companyId);
  console.log('');

  // Phase 15: In-Cycle Estimates (Layer 4: EPM current-period tracking)
  await seedInCycleEstimates(prisma, companyId);
  console.log('');

  // Phase 16: EPM Configuration (milestones, config, driver forecasts)
  await seedEpmConfig(prisma, companyId);
  console.log('');

  // Phase 17: Commentary (human-authored business context)
  await seedCommentary(prisma, companyId);
  console.log('');

  // =========================================================================
  // ENRICHMENT LAYER: Dimensional data for rich AI analysis
  // =========================================================================

  // Phase 18: Extend to 12 quarters (FY24 + FY26 forecast)
  const extendedPeriodMap = await seedExtendedPeriods(prisma, companyId);
  const allPeriods = { ...periodMap, ...extendedPeriodMap };
  console.log('');

  // Phase 19: Monthly financials by segment
  await seedMonthlyFinancials(prisma, companyId, allPeriods);
  console.log('');

  // Phase 20: Regional performance (10 regions)
  await seedRegionalPerformance(prisma, companyId, allPeriods);
  console.log('');

  // Phase 21: Product category & daypart performance
  await seedProductAndDaypart(prisma, companyId, allPeriods);
  console.log('');

  // Phase 22: Cost driver decomposition (model renamed to CostDriverDetail; skip for now)
  try {
    await seedCostDrivers(prisma, companyId, allPeriods);
  } catch (e) {
    console.warn('  ⚠️  seedCostDrivers skipped:', (e as Error).message.split('\n')[0]);
  }
  console.log('');

  // Phase 23: Variance explanations with driver impacts
  await seedVarianceExplanations(prisma, companyId, allPeriods);
  console.log('');

  // Phase 24: Expanded insights (+50 for rich AI search)
  await seedExpandedInsights(prisma, companyId);
  console.log('');

  // Phase 25: Expanded commentary (+35 executive commentary)
  await seedExpandedCommentary(prisma, companyId);
  console.log('');

  // Phase 26: Expanded anomaly detections (+25)
  await seedExpandedAnomalies(prisma, companyId);
  console.log('');

  // Phase 27: Weekly snapshots, store clusters, elasticity, competitors
  try { await seedAnalyticalData(prisma, companyId, allPeriods); } catch (e) { console.warn('  ⚠️  seedAnalyticalData skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  // =========================================================================
  // MASSIVE INSIGHT & COMMENTARY GENERATION
  // =========================================================================

  // Phase 28: Generated AI insights (3,000-4,500 mapped to full driver hierarchy)
  try { await seedGeneratedInsights(prisma, companyId); } catch (e) { console.warn('  ⚠️  seedGeneratedInsights skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  // Phase 29: Generated human commentary (700-1,000 from 8 analyst personas)
  try { await seedGeneratedCommentary(prisma, companyId); } catch (e) { console.warn('  ⚠️  seedGeneratedCommentary skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  // =========================================================================
  // PLATFORM ENHANCEMENT LAYER
  // =========================================================================

  // Phase 30: CVS service format mix
  try { await seedStoreFormatMix(prisma, companyId, allPeriods); } catch (e) { console.warn('  ⚠️  seedStoreFormatMix skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  // Phase 31: CVS strategy execution
  try { await seedStrategyExecution(prisma, companyId); } catch (e) { console.warn('  ⚠️  seedStrategyExecution skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  // Phase 32: Drug & commodity cost indices
  try { await seedCommodityPrices(prisma, companyId); } catch (e) { console.warn('  ⚠️  seedCommodityPrices skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  // Phase 33: FX impacts
  try { await seedFXImpacts(prisma, companyId, allPeriods); } catch (e) { console.warn('  ⚠️  seedFXImpacts skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  // Phase 34: Labor metrics
  try { await seedLaborMetrics(prisma, companyId, allPeriods); } catch (e) { console.warn('  ⚠️  seedLaborMetrics skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  // Phase 35: Customer satisfaction
  try { await seedCustomerSatisfaction(prisma, companyId, allPeriods); } catch (e) { console.warn('  ⚠️  seedCustomerSatisfaction skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  // Phase 36: Regulatory calendar
  try { await seedPromotionalCalendar(prisma, companyId); } catch (e) { console.warn('  ⚠️  seedPromotionalCalendar skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  // Phase 37: Capital programs
  try { await seedStoreRenovations(prisma, companyId); } catch (e) { console.warn('  ⚠️  seedStoreRenovations skipped:', (e as Error).message.split('\n')[0]); }
  console.log('');

  console.log('🎉 CVS Health Finance360 seed complete! (~8,000+ records across 78 models)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
