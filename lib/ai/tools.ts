import { tool } from 'ai';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';
import {
  getActiveCompanyId,
  getKPIs,
  getFinancials,
  getAlerts,
  getStrategic,
  getForecasts,
  getForecastAccuracy,
  getAnomalies,
  getInCycleEstimates,
  getRegionalPerformance,
  getProductPerformance,
  getDaypartPerformance,
  getCostDrivers,
  getVarianceExplanations,
  getWeeklySnapshots,
  getStoreClusters,
  getElasticityFactors,
  getCompetitorMetrics,
  getStrategyExecution,
  getCommodityPrices,
  getFXImpacts,
  getLaborMetrics,
  getCustomerSatisfactionData,
  getPromotionalCalendarData,
  getStoreFormatMixData,
  getStoreRenovationData,
  getMarket,
} from '@/lib/db/repositories';
import {
  allSemanticConsoles,
  SemanticEngine,
} from '@/lib/delta-business-architecture';

export const aiTools = {
  // ─── L1: Facts & Trends ──────────────────────────────────────────────────────

  searchDatabase: tool({
    description: 'Search across all Becton, Dickinson and Company financial data including KPIs, financials, insights, commentary, segments, initiatives, variance explanations, and more. Use this for any data lookup. (L1: Facts & Trends)',
    inputSchema: z.object({
      query: z.string().describe('Search query (e.g., "Missouri revenue", "rate base", "ESA contracted load", "EPS", "FFO/debt", "capex", "PISA", "IED earned ROE")'),
    }),
    execute: async ({ query }) => {
      const companyId = await getActiveCompanyId();

      const [insights, kpiDefs, financials, segments, initiatives, commentary, varExplanations] = await Promise.all([
        prisma.personalizedInsight.findMany({
          where: {
            companyId,
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { summary: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 5,
        }),
        prisma.kPIDefinition.findMany({
          where: {
            companyId,
            OR: [
              { label: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          include: {
            values: {
              where: { dataType: 'actual' },
              include: { period: true },
              orderBy: { period: { year: 'desc' } },
              take: 4,
            },
          },
          take: 8,
        }),
        prisma.financialStatement.findMany({
          where: {
            companyId,
            OR: [
              { label: { contains: query, mode: 'insensitive' } },
              { lineItem: { contains: query, mode: 'insensitive' } },
            ],
          },
          include: { period: true },
          orderBy: { period: { year: 'desc' } },
          take: 8,
        }),
        prisma.businessSegment.findMany({
          where: {
            companyId,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
            ],
          },
          include: {
            segmentResults: {
              include: { period: true },
              orderBy: { period: { year: 'desc' } },
              take: 4,
            },
          },
        }),
        prisma.strategicInitiative.findMany({
          where: {
            companyId,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 3,
        }),
        prisma.commentary.findMany({
          where: {
            companyId,
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { contentPlain: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } },
            ],
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
        }),
        prisma.varianceExplanation.findMany({
          where: {
            companyId,
            OR: [
              { metricName: { contains: query, mode: 'insensitive' } },
              { narrative: { contains: query, mode: 'insensitive' } },
            ],
          },
          include: { period: true },
          orderBy: { period: { year: 'desc' } },
          take: 3,
        }),
      ]);

      return {
        insights: insights.map(i => ({ title: i.title, summary: i.summary?.slice(0, 200), kpiValue: i.kpiValue, trend: i.trendDirection, priority: i.priority })),
        kpis: kpiDefs.map(k => ({ label: k.label, category: k.category, unit: k.unit, timeSeries: k.values.map(v => ({ period: v.period.label, value: v.value, target: v.target, status: v.status })) })),
        financials: financials.map(f => ({ lineItem: f.lineItem, label: f.label, period: f.period.label, actual: f.actual, plan: f.plan, priorYear: f.priorYear, variance: f.variance })),
        segments: segments.map(s => ({ name: s.name, revenuePercent: s.revenuePercent, results: s.segmentResults.map(r => ({ period: r.period.label, revenue: r.revenue, yoyChange: r.yoyChange, operatingMargin: r.operatingMargin })) })),
        initiatives: initiatives.map(i => ({ name: i.name, status: i.status, progress: i.progress })),
        commentary: commentary.map(c => ({ title: c.title, author: `${c.authorName}, ${c.authorRole}`, category: c.category, excerpt: c.contentPlain.slice(0, 200) })),
        varianceExplanations: varExplanations.map(v => ({ metric: v.metricName, period: v.period.label, totalVariance: v.totalVariance, unit: v.totalVarianceUnit, narrative: typeof v.narrative === 'string' ? v.narrative.slice(0, 300) : v.narrative, drivers: Array.isArray(v.driverBreakdown) ? (v.driverBreakdown as unknown[]).slice(0, 5) : v.driverBreakdown })),
      };
    },
  }),

  getKPIDashboard: tool({
    description: 'Get all current KPIs organized by category (primary, operational, digital, financial). Includes BD operating metrics (rate base CAGR, ESA contracted load, Missouri kWh growth, EPS, FFO/debt ratio), segment metrics (Missouri, IED, CVS Pharmacy, ATXI), and financial KPIs. Use this for overview questions. (L1: Facts & Trends)',
    inputSchema: z.object({}),
    execute: async () => {
      const companyId = await getActiveCompanyId();
      return getKPIs(companyId);
    },
  }),

  getFinancialPerformance: tool({
    description: 'Get detailed financial data including quarterly results, segment breakdown (Missouri: Electric Distribution + Generation; IED: Illinois Electric Distribution; CVS Pharmacy: Illinois Gas; ATXI: Transmission), P&L, revenue bridge, financial ratios, and working capital. (L1: Facts & Trends)',
    inputSchema: z.object({}),
    execute: async () => {
      const companyId = await getActiveCompanyId();
      return getFinancials(companyId);
    },
  }),

  getStrategicOverview: tool({
    description: 'Get strategic initiatives (ESA data center expansion, Missouri rate base growth, clean energy transition, IED ROE recovery, ATXI LRTP buildout), risks, forward outlook, and key opportunities for Becton, Dickinson and Company.',
    inputSchema: z.object({}),
    execute: async () => {
      const companyId = await getActiveCompanyId();
      return getStrategic(companyId);
    },
  }),

  getActiveAlerts: tool({
    description: 'Get all configured alert templates with thresholds, severity levels, and suggested actions for regulatory indicators and Becton, Dickinson and Company operational metrics.',
    inputSchema: z.object({}),
    execute: async () => {
      const companyId = await getActiveCompanyId();
      return getAlerts(companyId);
    },
  }),

  // ─── L2-L5: Advanced Analytics ─────────────────────────────────────────────

  getForecastData: tool({
    description: 'Get ML forecast results with confidence intervals and accuracy metrics for Becton, Dickinson and Company financial and operational metrics. Use for L3 (Forecast Achievement) questions. (L3: Forecast Achievement)',
    inputSchema: z.object({
      metricName: z.string().optional().describe('Filter by metric name (e.g., "Revenue", "Missouri Rate Base", "ESA Contracted Load", "EPS", "FFO/Debt")'),
      modelType: z.string().optional().describe('Filter by model type (e.g., "Ensemble", "Prophet")'),
    }),
    execute: async ({ metricName, modelType }) => {
      const companyId = await getActiveCompanyId();
      const [forecasts, accuracy] = await Promise.all([
        getForecasts(companyId, metricName, modelType),
        getForecastAccuracy(companyId),
      ]);
      return { forecasts, accuracy };
    },
  }),

  getAnomalyDetections: tool({
    description: 'Get detected anomalies in financial and operational metrics with severity, explanation, and related drivers. Monitors Missouri kWh deviations, ESA load changes, rate base tracking vs. plan, IED earned ROE gaps, and O&M/capex exceptions. (L1/L5: Facts & Root Cause)',
    inputSchema: z.object({
      severity: z.string().optional().describe('Filter by severity: "critical", "warning", "info"'),
      status: z.string().optional().describe('Filter by status: "new", "acknowledged", "resolved"'),
    }),
    execute: async ({ severity, status }) => {
      const companyId = await getActiveCompanyId();
      return getAnomalies(companyId, severity, status);
    },
  }),

  querySemanticModel: tool({
    description: 'Search the business architecture driver tree (semantic model) with 14 business consoles, 300+ drivers, and 600+ metrics. Returns computed metrics with numeric values, health scores, gaps vs target, and cross-console relationships. Use to understand relationships between BD utility metrics and find root causes. (L2/L5)',
    inputSchema: z.object({
      query: z.string().optional().describe('Search term for drivers and metrics (e.g., "rate base", "ESA load", "Missouri revenue", "earned ROE", "PISA", "capex")'),
      driverId: z.string().optional().describe('Get a specific driver by ID (returns computed metrics with health score)'),
      consoleId: z.string().optional().describe('Get all drivers for a specific console (returns computed overview)'),
    }),
    execute: async ({ query, driverId, consoleId }) => {
      const engine = SemanticEngine.getInstance();

      if (driverId) {
        const computed = engine.getDriver(driverId);
        if (!computed) return { error: `Driver "${driverId}" not found` };
        return {
          driver: {
            id: computed.id,
            name: computed.name,
            description: computed.description,
            consoleId: computed.consoleId,
            consoleName: engine.getGraph().getConsoleName(computed.consoleId),
            healthScore: computed.healthScore,
            depth: computed.depth,
            path: computed.path,
            metrics: computed.metrics.map(m => ({
              id: m.id, name: m.name, description: m.description,
              value: m.value.display, numericValue: m.value.raw, unit: m.value.unit,
              target: m.target?.display, gap: m.gap?.display, gapPercent: m.gap?.gapPercent,
              status: m.status, direction: m.direction, formula: m.formula,
            })),
            children: computed.children.map(c => ({
              id: c.id, name: c.name, healthScore: c.healthScore,
              metricCount: c.metrics.length,
            })),
            crossReferences: computed.crossReferences.map(r => ({
              targetDriverId: r.targetDriverId,
              targetDriverName: r.targetDriverName,
              targetConsoleName: r.targetConsoleName,
              relationship: r.relationship,
            })),
          },
        };
      }

      if (consoleId) {
        const computed = engine.getConsole(consoleId);
        if (!computed) return { error: `Console "${consoleId}" not found` };
        return {
          console: {
            id: computed.id,
            title: computed.title,
            category: computed.category,
            segment: computed.segment,
            objective: computed.objective,
            healthScore: computed.avgHealthScore,
            drivers: computed.drivers.map(d => ({
              id: d.id, name: d.name, healthScore: d.healthScore,
              childCount: d.children.length,
              metrics: d.metrics.map(m => ({
                id: m.id, name: m.name, value: m.value.display,
                status: m.status, gap: m.gap?.display,
              })),
            })),
          },
        };
      }

      if (query) {
        const drivers = engine.searchDrivers(query);
        const metrics = engine.searchMetrics(query);

        return {
          drivers: drivers.slice(0, 15).map(d => ({
            id: d.id, name: d.name, description: d.description,
            consoleId: d.consoleId, healthScore: d.healthScore,
            childCount: d.children.length, metricCount: d.metrics.length,
            metrics: d.metrics.slice(0, 3).map(m => ({
              id: m.id, name: m.name, value: m.value.display,
              status: m.status, gap: m.gap?.display,
            })),
            crossReferences: d.crossReferences.map(r => ({
              targetDriverName: r.targetDriverName,
              targetConsoleName: r.targetConsoleName,
            })),
          })),
          metrics: metrics.slice(0, 15).map(m => ({
            id: m.id, name: m.name, description: m.description,
            value: m.value.display, numericValue: m.value.raw, unit: m.value.unit,
            target: m.target?.display, gap: m.gap?.display, gapPercent: m.gap?.gapPercent,
            status: m.status, direction: m.direction, formula: m.formula,
          })),
        };
      }

      // Default: return console overview with health scores
      const consoles = allSemanticConsoles.map(c => {
        const computed = engine.getConsole(c.id);
        return {
          id: c.id, title: c.title, category: c.category, segment: c.segment,
          driverCount: c.drivers.length,
          healthScore: computed?.avgHealthScore ?? 50,
        };
      });
      return { consoles };
    },
  }),

  analyzeVariance: tool({
    description: 'Perform driver-based variance analysis for Becton, Dickinson and Company metrics. Includes pre-computed variance explanations with quantified driver impacts, financial trends, in-cycle estimates, and anomalies. Covers Missouri revenue, rate base growth, ESA contracted load, EPS, FFO/debt ratio, and more. (L2/L5: Variance & Root Cause)',
    inputSchema: z.object({
      metricName: z.string().describe('The metric to analyze (e.g., "Missouri revenue", "rate base", "EPS", "ESA load", "FFO/debt", "O&M", "capex")'),
    }),
    execute: async ({ metricName }) => {
      const companyId = await getActiveCompanyId();
      const q = metricName.toLowerCase();

      const [financials, inCycle, anomalies, varExplanations, elasticities] = await Promise.all([
        prisma.financialStatement.findMany({
          where: {
            companyId,
            OR: [
              { label: { contains: metricName, mode: 'insensitive' } },
              { lineItem: { contains: metricName, mode: 'insensitive' } },
            ],
          },
          include: { period: true },
          orderBy: { period: { year: 'desc' } },
          take: 6, // Last 6 periods max
        }),
        getInCycleEstimates(companyId),
        prisma.anomalyDetection.findMany({
          where: {
            companyId,
            metricName: { contains: metricName, mode: 'insensitive' },
            status: { in: ['new', 'acknowledged'] },
          },
          take: 5,
        }),
        getVarianceExplanations(companyId, metricName),
        getElasticityFactors(companyId, metricName),
      ]);

      const relevantEstimate = inCycle.find(
        (e) => e.metricName.toLowerCase().includes(q) || q.includes(e.metricName.toLowerCase())
      );

      // Get top related drivers from semantic model with computed health/gaps
      const engine = SemanticEngine.getInstance();
      const computedDrivers = engine.searchDrivers(metricName).slice(0, 5);

      return {
        metric: metricName,
        // Pre-computed variance explanations — top 3 only, trimmed
        varianceExplanations: varExplanations.slice(0, 3).map((v) => ({
          period: (v as { period: { label: string } }).period.label,
          type: v.varianceType,
          totalVariance: v.totalVariance,
          unit: v.totalVarianceUnit,
          drivers: Array.isArray(v.driverBreakdown) ? (v.driverBreakdown as unknown[]).slice(0, 5) : v.driverBreakdown,
          narrative: typeof v.narrative === 'string' ? v.narrative.slice(0, 500) : v.narrative,
          recommendations: Array.isArray(v.recommendations) ? (v.recommendations as unknown[]).slice(0, 3) : v.recommendations,
        })),
        // Top 5 sensitivity factors
        elasticities: elasticities.slice(0, 5).map((e) => ({
          driver: e.driverMetric,
          impacted: e.impactedMetric,
          elasticity: e.elasticity,
          unit: e.elasticityUnit,
          direction: e.direction,
        })),
        // Financial trend (compact)
        financialTrend: financials.map((f) => ({
          period: f.period.label, actual: f.actual, plan: f.plan,
          priorYear: f.priorYear, variance: f.variance,
        })),
        // In-cycle estimate
        inCycleEstimate: relevantEstimate ? {
          qtdActual: relevantEstimate.qtdActual,
          flashEstimate: relevantEstimate.flashEstimate,
          forecast: relevantEstimate.forecastValue,
          budget: relevantEstimate.budgetValue,
          flashVsForecast: `${relevantEstimate.flashVsForecast}%`,
          flashVsBudget: `${relevantEstimate.flashVsBudget}%`,
        } : null,
        // Driver tree context with computed health scores and metric gaps
        relatedDrivers: computedDrivers.map((d) => ({
          id: d.id, name: d.name, description: d.description,
          healthScore: d.healthScore,
          metrics: d.metrics.slice(0, 3).map(m => ({
            name: m.name, value: m.value.display, status: m.status,
            gap: m.gap?.display, gapPercent: m.gap?.gapPercent,
          })),
          subDrivers: d.children.slice(0, 4).map(c => ({
            name: c.name, healthScore: c.healthScore,
          })),
        })),
        openAnomalies: anomalies.map((a) => ({
          severity: a.severity, explanation: a.explanation?.slice(0, 200), deviationPct: a.deviationPct,
        })),
      };
    },
  }),

  forecastAchievement: tool({
    description: 'Compare current-period actuals against forecast, budget, and prior year. Shows in-cycle flash estimates and ML forecasts for BD metrics including Missouri revenue, EPS, rate base, ESA contracted load, capex, and key operating metrics. (L3: Forecast Achievement)',
    inputSchema: z.object({
      metricName: z.string().optional().describe('Optional metric filter (e.g., "Missouri Revenue", "EPS", "Rate Base", "ESA Load", "Capex")'),
    }),
    execute: async ({ metricName }) => {
      const companyId = await getActiveCompanyId();
      const inCycle = await getInCycleEstimates(companyId);
      const forecasts = await getForecasts(companyId, metricName);

      const filtered = metricName
        ? inCycle.filter((e) => e.metricName.toLowerCase().includes(metricName.toLowerCase()))
        : inCycle;

      return {
        currentPeriod: filtered.length > 0 ? filtered[0].periodLabel : 'Q2 FY26',
        pctComplete: filtered.length > 0 ? filtered[0].pctComplete : 0,
        metrics: filtered.map((e) => ({
          metricName: e.metricName, mtdActual: e.mtdActual, qtdActual: e.qtdActual,
          flashEstimate: e.flashEstimate, forecastValue: e.forecastValue,
          budgetValue: e.budgetValue, priorYearActual: e.priorYearActual,
          flashVsForecast: `${e.flashVsForecast}%`, flashVsBudget: `${e.flashVsBudget}%`,
          flashVsPriorYear: `${e.flashVsPriorYear}%`,
          status: e.flashVsForecast >= 0 ? 'on-track' : e.flashVsForecast > -2 ? 'at-risk' : 'behind',
        })),
        mlForecasts: forecasts.slice(0, 10).map((f) => ({
          metricName: f.metricName, periodLabel: f.periodLabel, modelType: f.modelType,
          forecastValue: f.forecastValue, lowerBound: f.lowerBound, upperBound: f.upperBound,
          actualValue: f.actualValue, mape: f.mape,
        })),
      };
    },
  }),

  // ─── NEW: Dimensional Analysis Tools ─────────────────────────────────────────

  analyzeRegionalPerformance: tool({
    description: 'Get service territory performance data across BD operating segments (Missouri Electric, Illinois Electric/IED, Illinois Gas/CVS Pharmacy, ATXI Transmission). Shows revenue, rate base, earned ROE, and load growth by territory. Returns latest quarter only for conciseness.',
    inputSchema: z.object({
      region: z.string().optional().describe('Optional territory filter (e.g., "Missouri", "Illinois Electric", "Illinois Gas", "ATXI", "BD Care Benefits")'),
    }),
    execute: async ({ region }) => {
      const companyId = await getActiveCompanyId();
      const data = await getRegionalPerformance(companyId, region);
      // Group by region and take only latest period per region
      const byRegion = new Map<string, typeof data[0]>();
      for (const r of data) {
        if (!byRegion.has(r.region)) byRegion.set(r.region, r);
      }
      return Array.from(byRegion.values()).slice(0, 12).map((r) => ({
        region: r.region,
        revenue: r.revenue, revenueYoY: r.revenueYoY,
        feeRevenueGrowth: r.compStoreSales,
        operatingMargin: r.operatingMargin,
        storeCount: r.storeCount,
        mobileOrderPct: r.mobileOrderPct,
      }));
    },
  }),

  analyzeProductMix: tool({
    description: 'Get revenue segment performance data across BD rate classes (Residential, Commercial, Industrial, Data Center/ESA, Agricultural). Shows revenue, mix %, load, and operating metrics by customer class and segment. Use for revenue mix and business segment questions.',
    inputSchema: z.object({
      category: z.string().optional().describe('Optional rate class filter (e.g., "Residential", "Commercial", "Industrial", "Data Center", "ESA", "Agricultural")'),
    }),
    execute: async ({ category }) => {
      const companyId = await getActiveCompanyId();
      const data = await getProductPerformance(companyId, category);
      return data.map((p) => ({
        category: p.category, segment: p.segment, period: (p as { period: { label: string } }).period.label,
        revenue: p.revenue, revenueYoY: p.revenueYoY, mixPercent: p.mixPercent,
        mixChange: p.mixChange, averageTicket: p.averageTicket,
        grossMarginPct: p.grossMarginPct, customizationRate: p.customizationRate,
      }));
    },
  }),

  analyzeDaypartPerformance: tool({
    description: 'Get seasonality and time-of-year performance data for Becton, Dickinson and Company. Analyzes performance across utility demand cycles — Q1 winter heating, Q2/Q3 summer cooling peak, Q4 capex completion and rate case activity. Shows kWh load, revenue, O&M, and margin by period.',
    inputSchema: z.object({
      daypart: z.string().optional().describe('Optional demand phase filter (e.g., "Winter Heating", "Summer Cooling Peak", "Rate Case Season", "Capex Completion")'),
    }),
    execute: async ({ daypart }) => {
      const companyId = await getActiveCompanyId();
      const data = await getDaypartPerformance(companyId, daypart);
      return data.map((d) => ({
        daypart: d.daypart, segment: d.segment, period: (d as { period: { label: string } }).period.label,
        transactionPct: d.transactionPct, revenuePct: d.revenuePct, compSales: d.compSales,
        averageTicket: d.averageTicket, laborCostPct: d.laborCostPct,
        throughputMinutes: d.throughputMinutes, foodAttachRate: d.foodAttachRate,
      }));
    },
  }),

  analyzeCostDrivers: tool({
    description: 'Get cost driver decomposition showing Fuel & Purchased Power, O&M, D&A, Taxes Other Than Income, and Interest for Becton, Dickinson and Company. Shows amount, % of revenue, YoY change, and variance to budget. Returns latest quarter only.',
    inputSchema: z.object({
      costCategory: z.string().optional().describe('Optional category filter (e.g., "Fuel & Purchased Power", "O&M", "D&A", "Taxes OTI", "Interest Expense")'),
    }),
    execute: async ({ costCategory }) => {
      const companyId = await getActiveCompanyId();
      const data = await getCostDrivers(companyId, costCategory);
      // Deduplicate by category+subcategory, keeping latest period
      const seen = new Set<string>();
      const unique = data.filter((c) => {
        const key = `${c.costCategory}|${c.costSubcategory}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return unique.slice(0, 20).map((c) => ({
        costCategory: c.costCategory, costSubcategory: c.costSubcategory,
        amount: c.amount, percentOfRevenue: c.percentOfRevenue, yoyChange: c.yoyChange,
        varianceToBudget: c.varianceToBudget,
        driver: typeof c.driver === 'string' ? c.driver.slice(0, 150) : c.driver,
      }));
    },
  }),

  getWeeklyTrends: tool({
    description: 'Get weekly KPI snapshots for the current quarter (Q2 FY26) showing week-over-week and year-over-year trends for Missouri kWh demand, capex spending rate, ESA load additions, SAIFI reliability, and rate base tracking.',
    inputSchema: z.object({
      metricName: z.string().optional().describe('Optional metric filter (e.g., "Missouri kWh Demand", "Capex Spending Rate", "ESA Load Additions", "SAIFI", "Rate Base Tracking")'),
    }),
    execute: async ({ metricName }) => {
      const companyId = await getActiveCompanyId();
      const data = await getWeeklySnapshots(companyId, metricName);
      return data.map((w) => ({
        weekLabel: w.weekLabel, weekStartDate: w.weekStartDate, metricName: w.metricName,
        value: w.value, priorWeek: w.priorWeek, weekOverWeek: w.weekOverWeek,
        yoyValue: w.yoyValue, yoyChange: w.yoyChange, status: w.status,
      }));
    },
  }),

  getStorePortfolioAnalysis: tool({
    description: 'Get customer class analysis showing performance by BD customer segment (Residential, Small Business, Large Commercial, Industrial, Data Center/Hyperscaler, Agricultural). Shows avg revenue per customer, load, rate, satisfaction, and margin by customer cohort.',
    inputSchema: z.object({}),
    execute: async () => {
      const companyId = await getActiveCompanyId();
      const data = await getStoreClusters(companyId);
      return data.map((s) => ({
        clusterName: s.clusterName, period: (s as { period: { label: string } }).period.label,
        storeCount: s.storeCount, pctOfPortfolio: s.pctOfPortfolio,
        avgRevenue: s.avgRevenue, avgTicket: s.avgTicket, avgDailyTxns: s.avgDailyTxns,
        compSales: s.compSales, operatingMargin: s.operatingMargin,
        retentionRate: s.rewardsPct, digitalAdoptionPct: s.mobileOrderPct,
        avgResponseTime: s.avgDriveThruTime, laborCostPct: s.laborCostPct, fourWallROI: s.fourWallROI,
      }));
    },
  }),

  getSensitivityAnalysis: tool({
    description: 'Get elasticity/sensitivity factors showing how changes in one metric impact another for Becton, Dickinson and Company. For example: "+1 GW ESA ≈ +$280M Missouri revenue" or "+1% Missouri kWh growth ≈ +$0.04 EPS". Use for what-if and sensitivity questions.',
    inputSchema: z.object({
      driverMetric: z.string().optional().describe('Optional driver metric filter (e.g., "Missouri kWh Growth", "ESA Contracted Load", "Rate Case Outcome", "10-yr Treasury Rate", "Equity Issuance")'),
    }),
    execute: async ({ driverMetric }) => {
      const companyId = await getActiveCompanyId();
      const data = await getElasticityFactors(companyId, driverMetric);
      return data.map((e) => ({
        driverMetric: e.driverMetric, impactedMetric: e.impactedMetric,
        elasticity: e.elasticity, unit: e.elasticityUnit, direction: e.direction,
        confidence: e.confidence, description: e.description, segment: e.segment,
      }));
    },
  }),

  getCompetitiveBenchmarking: tool({
    description: 'Get competitive benchmarking data for BD\'s Midwest utility peers (Eversource Energy, PPL Corporation, WEC Energy Group, Evergy, Xcel Energy). Shows revenue, rate base, earned ROE, and EPS CAGR by competitor by quarter where populated.',
    inputSchema: z.object({
      competitorName: z.string().optional().describe('Optional competitor filter (e.g., "Eversource Energy", "PPL Corporation", "WEC Energy Group", "Evergy", "Xcel Energy")'),
    }),
    execute: async ({ competitorName }) => {
      const companyId = await getActiveCompanyId();
      const data = await getCompetitorMetrics(companyId, competitorName);
      return data.map((c) => ({
        competitor: c.competitorName, period: (c as { period: { label: string } }).period.label,
        metricName: c.metricName, value: c.value, unit: c.unit, yoyChange: c.yoyChange,
      }));
    },
  }),

  // ─── Driver Graph Exploration ──────────────────────────────────────────────

  exploreDriverGraph: tool({
    description: 'Traverse the driver relationship graph to find upstream causes, downstream impacts, or cross-console relationships for a given driver. Returns computed metrics with numeric values, health scores, causal weights, and impact paths. Use for root-cause analysis of BD regulated utility operating and financial performance. (L5: Root Cause)',
    inputSchema: z.object({
      driverId: z.string().describe('The driver ID to explore (e.g., "missouri-rate-base-cagr", "esa-contracted-load", "missouri-rate-case", "ied-earned-roe", "pisa-deferral-rate")'),
      direction: z.enum(['upstream', 'downstream', 'related']).describe('Direction to traverse: upstream (parent chain to P&L), downstream (sub-drivers), or related (cross-console links)'),
      depth: z.number().optional().describe('Max traversal depth (default: 2)'),
    }),
    execute: async ({ driverId, direction, depth }) => {
      const engine = SemanticEngine.getInstance();
      const sourceDriver = engine.getDriver(driverId);
      if (!sourceDriver) return { error: `Driver "${driverId}" not found` };

      const maxDepth = depth ?? 2;
      let relatedDrivers;

      switch (direction) {
        case 'upstream':
          relatedDrivers = engine.getUpstream(driverId);
          break;
        case 'downstream':
          relatedDrivers = engine.getDownstream(driverId).slice(0, 20);
          break;
        case 'related':
          relatedDrivers = engine.getRelatedDrivers(driverId, maxDepth);
          break;
      }

      return {
        source: {
          id: sourceDriver.id,
          name: sourceDriver.name,
          console: engine.getGraph().getConsoleName(sourceDriver.consoleId),
          healthScore: sourceDriver.healthScore,
          metrics: sourceDriver.metrics.map(m => ({
            id: m.id,
            name: m.name,
            value: m.value.display,
            numericValue: m.value.raw,
            target: m.target?.display,
            gap: m.gap?.display,
            status: m.status,
            formula: m.formula,
          })),
          path: sourceDriver.path,
        },
        direction,
        related: relatedDrivers.map(d => ({
          id: d.id,
          name: d.name,
          console: engine.getGraph().getConsoleName(d.consoleId),
          healthScore: d.healthScore,
          causalWeight: d.causalWeight,
          impactDirection: d.impactDirection,
          depth: d.depth,
          metrics: d.metrics.slice(0, 3).map(m => ({
            id: m.id,
            name: m.name,
            value: m.value.display,
            status: m.status,
          })),
          crossReferences: d.crossReferences.map(r => ({
            targetDriver: r.targetDriverName,
            targetConsole: r.targetConsoleName,
          })),
        })),
        crossConsoleLinks: sourceDriver.crossReferences.map(r => ({
          targetDriver: r.targetDriverName,
          targetConsole: r.targetConsoleName,
          relationship: r.relationship,
        })),
      };
    },
  }),

  // ─── What-If Analysis ────────────────────────────────────────────────────

  runWhatIfAnalysis: tool({
    description: 'Run a what-if scenario by changing one or more metric values and propagating the impact through the driver tree to see effects on revenue, margin, and EPS. Use for strategic planning scenarios like interest rate changes, occupancy shifts, M&A impacts, and headcount changes. (L4: What-If)',
    inputSchema: z.object({
      assumptions: z.array(z.object({
        metricId: z.string().describe('The metric ID to change (e.g., "advisory-leasing-volume", "building-ops-sqft-managed", "investment-aum-growth")'),
        newValue: z.number().describe('The new value for the metric (e.g., 10 for +10%)'),
      })).describe('One or more metric changes to model'),
    }),
    execute: async ({ assumptions }) => {
      const engine = SemanticEngine.getInstance();

      const whatIfAssumptions = assumptions
        .map(a => engine.createAssumption(a.metricId, a.newValue))
        .filter((a): a is NonNullable<typeof a> => a !== null);

      if (whatIfAssumptions.length === 0) {
        return { error: 'No valid assumptions. Check metric IDs exist in the semantic model.' };
      }

      const scenario = engine.whatIfAnalysis(whatIfAssumptions);

      return {
        scenario: scenario.name,
        assumptions: scenario.assumptions.map(a => ({
          metricId: a.metricId,
          from: a.originalValue.display,
          to: a.newValue.display,
          changePercent: `${a.changePercent > 0 ? '+' : ''}${a.changePercent.toFixed(1)}%`,
        })),
        impacts: scenario.results.map(r => ({
          driver: r.driverName,
          metric: r.metricName,
          from: r.originalValue.display,
          to: r.projectedValue.display,
          impact: r.impact.display,
          impactPath: r.impactPath,
          confidence: `${(r.confidence * 100).toFixed(0)}%`,
        })),
        summary: {
          revenueImpact: scenario.summary.revenueImpact?.display ?? 'N/A',
          marginImpactBps: scenario.summary.marginImpactBps ?? 0,
          epsImpact: scenario.summary.epsImpact?.display ?? 'N/A',
        },
        totalImpactedMetrics: scenario.results.length,
      };
    },
  }),

  // ─── Visualization Tool ────────────────────────────────────────────────────

  generateVisualization: tool({
    description: 'Generate an inline chart or diagram to visualize financial data in the chat. Returns a spec that the frontend renders. Supports bar, line, area, pie charts via Recharts, plus Mermaid diagrams.',
    inputSchema: z.object({
      type: z.enum(['bar', 'line', 'area', 'pie', 'mermaid']).describe('Chart type'),
      title: z.string().describe('Chart title'),
      data: z.array(z.record(z.string(), z.any())).optional().describe('Array of data objects for Recharts'),
      xKey: z.string().optional().describe('Key for X-axis data field (default: "name")'),
      yKeys: z.array(z.object({
        key: z.string().describe('Data field key for this series'),
        color: z.string().optional().describe('Hex color for this series'),
        label: z.string().optional().describe('Display label for legend'),
      })).optional().describe('Y-axis series definitions'),
      mermaidCode: z.string().optional().describe('Mermaid diagram code (for type="mermaid" only)'),
    }),
    execute: async (params) => {
      return params;
    },
  }),

  // ─── Enhancement Tools ──────────────────────────────────────────────────────

  getStrategyExecutionStatus: tool({
    description: 'Get Finance360 / One Delta strategy execution progress by pillar. Shows KPI name, baseline, target, current value, and status for each tracked pillar. Use for strategy performance and initiative tracking questions.',
    inputSchema: z.object({
      pillar: z.string().optional().describe('Optional pillar filter (pillar name as configured in the strategy model)'),
    }),
    execute: async ({ pillar }) => {
      const companyId = await getActiveCompanyId();
      const data = await getStrategyExecution(companyId, pillar);
      // Group by pillar
      const byPillar = new Map<string, typeof data>();
      for (const d of data) {
        if (!byPillar.has(d.pillar)) byPillar.set(d.pillar, []);
        byPillar.get(d.pillar)!.push(d);
      }
      return Array.from(byPillar.entries()).map(([p, kpis]) => ({
        pillar: p,
        quarterLabel: kpis[0]?.quarterLabel,
        kpis: kpis.map(k => ({
          kpiName: k.kpiName, baseline: k.baseline, target: k.target,
          current: k.current, unit: k.unit, status: k.status,
          commentary: k.commentary,
        })),
        summary: {
          onTrack: kpis.filter(k => k.status === 'on-track' || k.status === 'ahead').length,
          total: kpis.length,
        },
      }));
    },
  }),

  getCommodityExposure: tool({
    description: 'Get real estate market and cost input data including interest rates (Fed Funds, SOFR, 10-Year Treasury), construction cost indices, energy prices, insurance rates, and property tax trends. Shows current rates, hedged/locked positions, coverage, and YoY changes. Use for cost input and market environment questions.',
    inputSchema: z.object({
      commodity: z.string().optional().describe('Optional filter (e.g., "Fed Funds Rate", "Construction Cost Index", "Energy Costs", "Insurance Rates", "10-Year Treasury")'),
    }),
    execute: async ({ commodity }) => {
      const companyId = await getActiveCompanyId();
      const data = await getCommodityPrices(companyId, commodity);
      return data.map(c => ({
        commodity: c.commodity, periodLabel: c.periodLabel,
        spotPrice: c.spotPrice, hedgedPrice: c.hedgedPrice,
        priorYearPrice: c.priorYearPrice, unit: c.unit,
        hedgeCoverage: c.hedgeCoverage, yoyChange: c.yoyChange,
        forecastNext: c.forecastNext,
      }));
    },
  }),

  getFXImpactAnalysis: tool({
    description: 'Get foreign exchange impact analysis showing currency pair headwinds/tailwinds on revenue and operating income. Note: Becton, Dickinson and Company is a domestic US utility with minimal FX exposure; this tool returns nominal impact data.',
    inputSchema: z.object({}),
    execute: async () => {
      const companyId = await getActiveCompanyId();
      const data = await getFXImpacts(companyId);
      const totalRevenueImpact = data.reduce((sum: number, fx: { revenueImpact: number }) => sum + fx.revenueImpact, 0);
      const totalOperatingImpact = data.reduce((sum: number, fx: { operatingImpact: number }) => sum + fx.operatingImpact, 0);
      return {
        totalRevenueImpact: `$${totalRevenueImpact}M`,
        totalOperatingImpact: `$${totalOperatingImpact}M`,
        byPair: data.map((fx: any) => ({
          currencyPair: fx.currencyPair, segment: fx.segment,
          revenueImpact: `$${fx.revenueImpact}M`,
          operatingImpact: `$${fx.operatingImpact}M`,
          avgRate: fx.avgRate, priorYearRate: fx.priorYearRate,
          hedgedRate: fx.hedgedRate,
          period: fx.period?.label,
        })),
      };
    },
  }),

  getLaborAnalytics: tool({
    description: 'Get professional workforce metrics by region including average compensation, turnover, headcount per office, utilization rate, training hours, and professional satisfaction scores. Use for talent management, workforce planning, and operational efficiency questions.',
    inputSchema: z.object({
      region: z.string().optional().describe('Optional region filter (e.g., "US - West", "UK", "Greater China", "EMEA")'),
    }),
    execute: async ({ region }) => {
      const companyId = await getActiveCompanyId();
      const data = await getLaborMetrics(companyId, region);
      // Deduplicate by region (latest period only)
      const byRegion = new Map<string, typeof data[0]>();
      for (const d of data) {
        if (!byRegion.has(d.region)) byRegion.set(d.region, d);
      }
      return Array.from(byRegion.values()).map(d => ({
        region: d.region,
        period: (d as any).period?.label,
        avgWageRate: d.avgWageRate,
        turnoverRate: d.turnoverRate,
        hoursPerStore: d.hoursPerStore,
        overtimePct: d.overtimePct,
        trainingHours: d.trainingHours,
        partnerSatisfaction: d.partnerSatisfaction,
      }));
    },
  }),

  getCustomerSatisfactionMetrics: tool({
    description: 'Get client satisfaction data including NPS score, CSAT score, service delivery satisfaction, and mandate retention rates by region. Use for client experience, service quality, and client retention questions.',
    inputSchema: z.object({
      region: z.string().optional().describe('Optional region filter (e.g., "Americas", "EMEA", "APAC")'),
    }),
    execute: async ({ region }) => {
      const companyId = await getActiveCompanyId();
      const data = await getCustomerSatisfactionData(companyId, region);
      // Deduplicate by region (latest period only)
      const byRegion = new Map<string, typeof data[0]>();
      for (const d of data) {
        if (!byRegion.has(d.region)) byRegion.set(d.region, d);
      }
      return Array.from(byRegion.values()).map(d => ({
        region: d.region,
        period: (d as any).period?.label,
        npsScore: d.npsScore,
        csatScore: d.csatScore,
        waitTimeSatisfaction: d.waitTimeSatisfaction,
        orderAccuracy: d.orderAccuracy,
        sampleSize: d.sampleSize,
      }));
    },
  }),

  getPromotionalImpact: tool({
    description: 'Get business development campaign and strategic initiative performance data. Shows initiative name, dates, category, revenue impact, mandate wins, pipeline contribution, and status. Use for BD, marketing, and strategic campaign questions.',
    inputSchema: z.object({
      status: z.enum(['active', 'completed', 'planned', 'cancelled']).optional().describe('Optional status filter'),
    }),
    execute: async ({ status }) => {
      const companyId = await getActiveCompanyId();
      const data = await getPromotionalCalendarData(companyId, status);
      return data.map(p => ({
        campaignName: p.campaignName,
        startDate: p.startDate, endDate: p.endDate,
        category: p.category, region: p.region,
        revenueImpact: p.revenueImpact ? `$${p.revenueImpact}M` : null,
        transactionLift: p.transactionLift ? `${p.transactionLift}%` : null,
        ticketLift: p.ticketLift ? `${p.ticketLift}%` : null,
        status: p.status,
      }));
    },
  }),

  getStorePortfolioMix: tool({
    description: 'Get service delivery model mix (Direct Services, Managed Services, Outsourced/Subcontracted, Technology-Enabled, Joint Ventures) and platform/system rollout progress (Digital Workplace Platform, Client Analytics Suite, Property Management System). Use for service delivery model, platform strategy, and technology adoption questions.',
    inputSchema: z.object({
      segment: z.string().optional().describe('Optional segment filter (e.g., "Domestic Mainline Revenue", "Building Operations", "Project Management")'),
    }),
    execute: async ({ segment }) => {
      const companyId = await getActiveCompanyId();
      const [formatData, renovationData] = await Promise.all([
        getStoreFormatMixData(companyId, segment),
        getStoreRenovationData(companyId),
      ]);
      // Deduplicate format data by segment+format (latest period)
      const seenFormats = new Set<string>();
      const uniqueFormats = formatData.filter(f => {
        const key = `${f.segment}|${f.format}`;
        if (seenFormats.has(key)) return false;
        seenFormats.add(key);
        return true;
      });
      return {
        formatMix: uniqueFormats.map(f => ({
          segment: f.segment, format: f.format,
          storeCount: f.storeCount, pctOfTotal: f.pctOfTotal,
          avgRevenue: `$${f.avgRevenue}K`, yoyGrowth: `${f.yoyGrowth}%`,
          compSales: f.compSales != null ? `${f.compSales}%` : null,
          period: (f as any).period?.label,
        })),
        renovations: renovationData.map(r => ({
          renovationType: r.renovationType, segment: r.segment,
          storesComplete: r.storesComplete, storesInProgress: r.storesInProgress,
          storesPlanned: r.storesPlanned, totalTarget: r.totalTarget,
          completionPct: `${r.completionPct}%`,
          avgCost: `$${r.avgCost}K`,
          avgRevenueUplift: r.avgRevenueUplift ? `${r.avgRevenueUplift}%` : null,
          avgThroughputImprovement: r.avgThroughputImprovement ? `${r.avgThroughputImprovement}%` : null,
          quarterLabel: r.quarterLabel,
        })),
      };
    },
  }),

  getCompetitorDeepDive: tool({
    description: 'Get enhanced competitive analysis combining quarterly peer metrics (revenue, margin, rate base, and other tracked items) with market overview data (regulated utility market size, share, drivers, challenges). Use for competitive positioning and share questions vs. Eversource Energy, PPL Corporation, WEC Energy Group, Evergy, and Xcel Energy.',
    inputSchema: z.object({
      competitorName: z.string().optional().describe('Optional peer filter (e.g., "United", "American", "Southwest")'),
    }),
    execute: async ({ competitorName }) => {
      const companyId = await getActiveCompanyId();
      const [competitorMetrics, marketData] = await Promise.all([
        getCompetitorMetrics(companyId, competitorName),
        getMarket(companyId),
      ]);
      // Group competitor metrics by competitor name
      const byCompetitor = new Map<string, typeof competitorMetrics>();
      for (const c of competitorMetrics) {
        if (!byCompetitor.has(c.competitorName)) byCompetitor.set(c.competitorName, []);
        byCompetitor.get(c.competitorName)!.push(c);
      }
      return {
        market: {
          totalMarketSize: marketData.totalMarketSize,
          deltaMarketShare: marketData.companyMarketShare,
          marketShareTarget: marketData.marketShareTarget,
          marketShareYoY: marketData.marketShareYoY,
          marketDrivers: marketData.marketDrivers,
          marketChallenges: marketData.marketChallenges,
        },
        competitors: Array.from(byCompetitor.entries()).map(([name, metrics]) => ({
          name,
          shareData: marketData.competitors.find((c: any) => c.name.toLowerCase().includes(name.toLowerCase())),
          quarterlyMetrics: metrics.slice(0, 8).map(m => ({
            period: (m as any).period?.label,
            metricName: m.metricName, value: m.value, unit: m.unit, yoyChange: m.yoyChange,
          })),
        })),
        regionalBreakdown: marketData.regionalBreakdown,
      };
    },
  }),
};
