-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "platformName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL DEFAULT '',
    "subtitle" TEXT NOT NULL DEFAULT '',
    "logoPath" TEXT NOT NULL DEFAULT '',
    "logoAlt" TEXT NOT NULL DEFAULT '',
    "copyrightHolder" TEXT NOT NULL DEFAULT '',
    "copyrightYear" INTEGER NOT NULL DEFAULT 2026,
    "poweredBy" TEXT NOT NULL DEFAULT '',
    "ceo" TEXT NOT NULL DEFAULT '',
    "cfo" TEXT NOT NULL DEFAULT '',
    "fiscalYearEnd" TEXT NOT NULL DEFAULT '',
    "industry" TEXT NOT NULL DEFAULT '',
    "headquarters" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_colors" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "primary" TEXT NOT NULL,
    "primaryDark" TEXT NOT NULL,
    "primaryLight" TEXT NOT NULL,
    "primaryAlt" TEXT NOT NULL,
    "navBg" TEXT NOT NULL DEFAULT '',
    "navBgLight" TEXT NOT NULL DEFAULT '',
    "accent" TEXT NOT NULL DEFAULT '',
    "success" TEXT NOT NULL DEFAULT '',
    "warning" TEXT NOT NULL DEFAULT '',
    "danger" TEXT NOT NULL DEFAULT '',
    "info" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "brand_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiscal_periods" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER,
    "startDate" TEXT NOT NULL DEFAULT '',
    "endDate" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "fiscal_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quarterly_results" (
    "id" SERIAL NOT NULL,
    "periodId" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "revenueYoY" DOUBLE PRECISION NOT NULL,
    "operatingIncome" DOUBLE PRECISION NOT NULL,
    "operatingMargin" DOUBLE PRECISION NOT NULL,
    "eps" DOUBLE PRECISION NOT NULL,
    "compStoreSales" DOUBLE PRECISION NOT NULL,
    "netNewStores" INTEGER,

    CONSTRAINT "quarterly_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_segments" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "revenuePercent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "business_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segment_results" (
    "id" SERIAL NOT NULL,
    "segmentId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "yoyChange" DOUBLE PRECISION NOT NULL,
    "operatingMargin" DOUBLE PRECISION,

    CONSTRAINT "segment_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_statements" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "lineItem" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "actual" DOUBLE PRECISION NOT NULL,
    "plan" DOUBLE PRECISION NOT NULL,
    "priorYear" DOUBLE PRECISION NOT NULL,
    "variance" DOUBLE PRECISION NOT NULL,
    "variancePercent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "financial_statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_bridge_items" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "impact" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "revenue_bridge_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_ratios" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "benchmark" DOUBLE PRECISION,

    CONSTRAINT "financial_ratios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_capital_metrics" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "actual" DOUBLE PRECISION NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "working_capital_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_definitions" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "formula" TEXT NOT NULL DEFAULT '',
    "dataSource" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "kpi_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpi_values" (
    "id" SERIAL NOT NULL,
    "kpiDefinitionId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "dataType" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "target" TEXT,
    "trend" TEXT NOT NULL,
    "trendValue" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL,

    CONSTRAINT "kpi_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operations_summary" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "totalLocations" INTEGER NOT NULL,
    "locationGrowth" INTEGER NOT NULL,
    "locationGrowthPercent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "operations_summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "format" TEXT NOT NULL DEFAULT '',
    "ownership" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_metrics" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "periodId" INTEGER,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "target" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "location_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supply_chain_metrics" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodId" INTEGER,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "trend" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "supply_chain_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_metrics" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "digital_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_kpis" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "target" TEXT,
    "benchmark" TEXT,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "industry_kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strategic_initiatives" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "spent" DOUBLE PRECISION NOT NULL,
    "progress" INTEGER NOT NULL,

    CONSTRAINT "strategic_initiatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "initiative_milestones" (
    "id" SERIAL NOT NULL,
    "initiativeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "initiative_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "initiative_kpis" (
    "id" SERIAL NOT NULL,
    "initiativeId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "actual" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "initiative_kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_items" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "severity" TEXT NOT NULL,
    "likelihood" TEXT NOT NULL,
    "impact" TEXT NOT NULL DEFAULT '',
    "mitigation" TEXT NOT NULL DEFAULT '',
    "owner" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "risk_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forward_outlook" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodId" INTEGER,
    "period" TEXT NOT NULL,
    "revenueForecast" DOUBLE PRECISION NOT NULL,
    "revenuePlan" DOUBLE PRECISION NOT NULL,
    "marginForecast" DOUBLE PRECISION NOT NULL,
    "marginPlan" DOUBLE PRECISION NOT NULL,
    "keyAssumptions" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "forward_outlook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_opportunities" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "revenueImpact" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "timeline" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "key_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_data" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodId" INTEGER,
    "totalMarketSize" TEXT NOT NULL,
    "companyMarketShare" DOUBLE PRECISION NOT NULL,
    "marketShareTarget" DOUBLE PRECISION NOT NULL,
    "marketShareYoY" DOUBLE PRECISION NOT NULL,
    "segmentGrowth" DOUBLE PRECISION NOT NULL,
    "marketDrivers" JSONB NOT NULL DEFAULT '[]',
    "marketChallenges" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "market_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitors" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "marketShare" DOUBLE PRECISION NOT NULL,
    "yoyChange" DOUBLE PRECISION NOT NULL,
    "strengths" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regional_breakdown" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodId" INTEGER,
    "region" TEXT NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "growth" DOUBLE PRECISION NOT NULL,
    "keyInsight" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "regional_breakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_baselines" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "baselineRevenue" DOUBLE PRECISION NOT NULL,
    "baselineMargin" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "scenario_baselines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_levers" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "defaultVal" DOUBLE PRECISION NOT NULL,
    "step" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "scenario_levers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_built_scenarios" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT '',
    "confidence" INTEGER NOT NULL,
    "revenueImpact" DOUBLE PRECISION NOT NULL,
    "marginImpact" DOUBLE PRECISION NOT NULL,
    "keyAssumptions" JSONB NOT NULL DEFAULT '[]',
    "leverSettings" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "pre_built_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_templates" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "metricId" TEXT NOT NULL DEFAULT '',
    "threshold" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "suggestedActions" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "alert_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_templates" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "department" TEXT NOT NULL DEFAULT '',
    "format" TEXT NOT NULL DEFAULT '',
    "lastGenerated" TEXT,

    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "close_tasks" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "owner" TEXT NOT NULL DEFAULT '',
    "dueDate" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "close_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entry_stats" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "automated" INTEGER NOT NULL,
    "manual" INTEGER NOT NULL,

    CONSTRAINT "journal_entry_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trial_balance_items" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "actual" DOUBLE PRECISION NOT NULL,
    "priorMonth" DOUBLE PRECISION NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "trial_balance_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executive_narratives" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodLabel" TEXT NOT NULL,
    "overallStatus" TEXT NOT NULL,
    "statusColor" TEXT NOT NULL,
    "narrative" TEXT NOT NULL,
    "keyAchievements" JSONB NOT NULL DEFAULT '[]',
    "concerns" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "executive_narratives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_pillars" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodLabel" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "change" DOUBLE PRECISION NOT NULL,
    "target" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "keyInsight" TEXT NOT NULL DEFAULT '',
    "actionRequired" BOOLEAN NOT NULL DEFAULT false,
    "metrics" JSONB NOT NULL DEFAULT '[]',
    "forecast" TEXT NOT NULL DEFAULT '',
    "sparkline" JSONB NOT NULL DEFAULT '[]',
    "subMetrics" JSONB NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "business_pillars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "critical_actions" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "financialImpact" TEXT NOT NULL DEFAULT '',
    "riskLevel" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "category" TEXT NOT NULL DEFAULT '',
    "businessOutcome" TEXT NOT NULL DEFAULT '',
    "impact" TEXT NOT NULL DEFAULT '',
    "riskAssessment" TEXT NOT NULL DEFAULT '',
    "stakeholders" JSONB NOT NULL DEFAULT '[]',
    "dependencies" JSONB NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "critical_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forward_insights" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "insight" TEXT NOT NULL DEFAULT '',
    "impact" TEXT NOT NULL DEFAULT '',
    "timeframe" TEXT NOT NULL DEFAULT '',
    "confidence" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "forward_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executive_briefings" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodLabel" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keyHighlights" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "executive_briefings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_insights" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "businessOutcome" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metric" TEXT NOT NULL DEFAULT '',
    "change" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'medium',
    "insight" TEXT NOT NULL DEFAULT '',
    "drivers" JSONB NOT NULL DEFAULT '[]',
    "actions" JSONB NOT NULL DEFAULT '[]',
    "relatedMetrics" JSONB NOT NULL DEFAULT '{}',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "business_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_opportunities" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "probability" TEXT NOT NULL DEFAULT '',
    "impact" TEXT NOT NULL DEFAULT '',
    "mitigation" TEXT NOT NULL DEFAULT '',
    "action" TEXT NOT NULL DEFAULT '',
    "trend" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "risk_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalized_insights" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "insightLevel" TEXT NOT NULL DEFAULT 'L1',
    "metricId" TEXT NOT NULL DEFAULT '',
    "kpiValue" TEXT NOT NULL DEFAULT '',
    "trendDirection" TEXT NOT NULL DEFAULT '',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "summary" TEXT NOT NULL DEFAULT '',
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consoleLink" TEXT NOT NULL DEFAULT '',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "relatedDrivers" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "personalized_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_consoles" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "segment" TEXT NOT NULL DEFAULT '',
    "objective" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "business_consoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "console_drivers" (
    "id" SERIAL NOT NULL,
    "consoleId" INTEGER NOT NULL,
    "parentDriverId" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "causalityWeight" DOUBLE PRECISION,
    "impactDirection" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "console_drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_metrics" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "periodId" INTEGER,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "currentValue" TEXT NOT NULL DEFAULT '',
    "target" TEXT NOT NULL DEFAULT '',
    "frequency" TEXT NOT NULL DEFAULT '',
    "direction" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "driver_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_cross_references" (
    "id" SERIAL NOT NULL,
    "sourceDriverId" INTEGER NOT NULL,
    "targetDriverId" INTEGER NOT NULL,
    "relationship" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "driver_cross_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_sources" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "connectionType" TEXT NOT NULL DEFAULT '',
    "refreshFrequency" TEXT NOT NULL DEFAULT '',
    "lastSyncAt" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'active',
    "recordCount" INTEGER NOT NULL DEFAULT 0,
    "owner" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_flows" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "targetLayer" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "transformations" JSONB NOT NULL DEFAULT '[]',
    "lastRunAt" TEXT NOT NULL DEFAULT '',
    "lastRunStatus" TEXT NOT NULL DEFAULT 'success',
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "recordsRejected" INTEGER NOT NULL DEFAULT 0,
    "avgLatencyMs" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "data_flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_quality_checks" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "flowId" INTEGER,
    "checkName" TEXT NOT NULL,
    "checkType" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "rule" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "lastRunAt" TEXT NOT NULL DEFAULT '',
    "failedRecords" INTEGER NOT NULL DEFAULT 0,
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "details" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "data_quality_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_data_entities" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "entityCount" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TEXT NOT NULL DEFAULT '',
    "steward" TEXT NOT NULL DEFAULT '',
    "goldenRecordPct" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "duplicateCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "master_data_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecast_results" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "metricName" TEXT NOT NULL,
    "periodLabel" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "forecastValue" DOUBLE PRECISION NOT NULL,
    "lowerBound" DOUBLE PRECISION NOT NULL,
    "upperBound" DOUBLE PRECISION NOT NULL,
    "actualValue" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    "mape" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forecast_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anomaly_detections" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "metricName" TEXT NOT NULL,
    "detectedAt" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "expectedValue" DOUBLE PRECISION NOT NULL,
    "actualValue" DOUBLE PRECISION NOT NULL,
    "deviationPct" DOUBLE PRECISION NOT NULL,
    "explanation" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'new',
    "relatedDrivers" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "anomaly_detections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "in_cycle_estimates" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "periodLabel" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "mtdActual" DOUBLE PRECISION NOT NULL,
    "qtdActual" DOUBLE PRECISION NOT NULL,
    "flashEstimate" DOUBLE PRECISION NOT NULL,
    "forecastValue" DOUBLE PRECISION NOT NULL,
    "budgetValue" DOUBLE PRECISION NOT NULL,
    "priorYearActual" DOUBLE PRECISION NOT NULL,
    "daysThroughPeriod" INTEGER NOT NULL,
    "totalDaysInPeriod" INTEGER NOT NULL DEFAULT 91,
    "lastUpdated" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "in_cycle_estimates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_colors_companyId_key" ON "brand_colors"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "fiscal_periods_companyId_label_key" ON "fiscal_periods"("companyId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "quarterly_results_periodId_key" ON "quarterly_results"("periodId");

-- CreateIndex
CREATE UNIQUE INDEX "business_segments_companyId_name_key" ON "business_segments"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "segment_results_segmentId_periodId_key" ON "segment_results"("segmentId", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "financial_statements_companyId_periodId_lineItem_key" ON "financial_statements"("companyId", "periodId", "lineItem");

-- CreateIndex
CREATE UNIQUE INDEX "financial_ratios_companyId_periodId_name_key" ON "financial_ratios"("companyId", "periodId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "working_capital_metrics_companyId_periodId_name_key" ON "working_capital_metrics"("companyId", "periodId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_definitions_companyId_label_key" ON "kpi_definitions"("companyId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "kpi_values_kpiDefinitionId_periodId_dataType_key" ON "kpi_values"("kpiDefinitionId", "periodId", "dataType");

-- CreateIndex
CREATE UNIQUE INDEX "operations_summary_companyId_key" ON "operations_summary"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "strategic_initiatives_companyId_externalId_key" ON "strategic_initiatives"("companyId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "risk_items_companyId_externalId_key" ON "risk_items"("companyId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "competitors_companyId_name_key" ON "competitors"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "scenario_baselines_companyId_key" ON "scenario_baselines"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "scenario_levers_companyId_externalId_key" ON "scenario_levers"("companyId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "pre_built_scenarios_companyId_externalId_key" ON "pre_built_scenarios"("companyId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "alert_templates_companyId_externalId_key" ON "alert_templates"("companyId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "report_templates_companyId_externalId_key" ON "report_templates"("companyId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "close_tasks_companyId_externalId_key" ON "close_tasks"("companyId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "journal_entry_stats_companyId_key" ON "journal_entry_stats"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "executive_narratives_companyId_periodLabel_key" ON "executive_narratives"("companyId", "periodLabel");

-- CreateIndex
CREATE UNIQUE INDEX "business_pillars_companyId_periodLabel_externalId_key" ON "business_pillars"("companyId", "periodLabel", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "executive_briefings_companyId_periodLabel_key" ON "executive_briefings"("companyId", "periodLabel");

-- CreateIndex
CREATE UNIQUE INDEX "business_consoles_companyId_title_key" ON "business_consoles"("companyId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "driver_cross_references_sourceDriverId_targetDriverId_key" ON "driver_cross_references"("sourceDriverId", "targetDriverId");

-- CreateIndex
CREATE UNIQUE INDEX "data_sources_companyId_externalId_key" ON "data_sources"("companyId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "master_data_entities_companyId_domain_key" ON "master_data_entities"("companyId", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "forecast_results_companyId_metricName_periodLabel_modelType_key" ON "forecast_results"("companyId", "metricName", "periodLabel", "modelType");

-- CreateIndex
CREATE UNIQUE INDEX "in_cycle_estimates_companyId_periodLabel_metricName_key" ON "in_cycle_estimates"("companyId", "periodLabel", "metricName");

-- AddForeignKey
ALTER TABLE "brand_colors" ADD CONSTRAINT "brand_colors_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiscal_periods" ADD CONSTRAINT "fiscal_periods_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quarterly_results" ADD CONSTRAINT "quarterly_results_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_segments" ADD CONSTRAINT "business_segments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment_results" ADD CONSTRAINT "segment_results_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "business_segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment_results" ADD CONSTRAINT "segment_results_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_statements" ADD CONSTRAINT "financial_statements_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_statements" ADD CONSTRAINT "financial_statements_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_bridge_items" ADD CONSTRAINT "revenue_bridge_items_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_bridge_items" ADD CONSTRAINT "revenue_bridge_items_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_ratios" ADD CONSTRAINT "financial_ratios_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_ratios" ADD CONSTRAINT "financial_ratios_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_capital_metrics" ADD CONSTRAINT "working_capital_metrics_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_capital_metrics" ADD CONSTRAINT "working_capital_metrics_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_definitions" ADD CONSTRAINT "kpi_definitions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_values" ADD CONSTRAINT "kpi_values_kpiDefinitionId_fkey" FOREIGN KEY ("kpiDefinitionId") REFERENCES "kpi_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpi_values" ADD CONSTRAINT "kpi_values_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations_summary" ADD CONSTRAINT "operations_summary_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_metrics" ADD CONSTRAINT "location_metrics_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_metrics" ADD CONSTRAINT "location_metrics_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supply_chain_metrics" ADD CONSTRAINT "supply_chain_metrics_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supply_chain_metrics" ADD CONSTRAINT "supply_chain_metrics_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_metrics" ADD CONSTRAINT "digital_metrics_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_kpis" ADD CONSTRAINT "industry_kpis_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strategic_initiatives" ADD CONSTRAINT "strategic_initiatives_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiative_milestones" ADD CONSTRAINT "initiative_milestones_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "strategic_initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiative_kpis" ADD CONSTRAINT "initiative_kpis_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "strategic_initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_items" ADD CONSTRAINT "risk_items_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forward_outlook" ADD CONSTRAINT "forward_outlook_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forward_outlook" ADD CONSTRAINT "forward_outlook_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key_opportunities" ADD CONSTRAINT "key_opportunities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_data" ADD CONSTRAINT "market_data_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_data" ADD CONSTRAINT "market_data_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regional_breakdown" ADD CONSTRAINT "regional_breakdown_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regional_breakdown" ADD CONSTRAINT "regional_breakdown_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_baselines" ADD CONSTRAINT "scenario_baselines_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_levers" ADD CONSTRAINT "scenario_levers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_built_scenarios" ADD CONSTRAINT "pre_built_scenarios_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_templates" ADD CONSTRAINT "alert_templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_templates" ADD CONSTRAINT "report_templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "close_tasks" ADD CONSTRAINT "close_tasks_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entry_stats" ADD CONSTRAINT "journal_entry_stats_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trial_balance_items" ADD CONSTRAINT "trial_balance_items_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executive_narratives" ADD CONSTRAINT "executive_narratives_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_pillars" ADD CONSTRAINT "business_pillars_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critical_actions" ADD CONSTRAINT "critical_actions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forward_insights" ADD CONSTRAINT "forward_insights_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executive_briefings" ADD CONSTRAINT "executive_briefings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_insights" ADD CONSTRAINT "business_insights_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_opportunities" ADD CONSTRAINT "risk_opportunities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalized_insights" ADD CONSTRAINT "personalized_insights_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_consoles" ADD CONSTRAINT "business_consoles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "console_drivers" ADD CONSTRAINT "console_drivers_consoleId_fkey" FOREIGN KEY ("consoleId") REFERENCES "business_consoles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "console_drivers" ADD CONSTRAINT "console_drivers_parentDriverId_fkey" FOREIGN KEY ("parentDriverId") REFERENCES "console_drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_metrics" ADD CONSTRAINT "driver_metrics_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "console_drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_metrics" ADD CONSTRAINT "driver_metrics_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "fiscal_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_cross_references" ADD CONSTRAINT "driver_cross_references_sourceDriverId_fkey" FOREIGN KEY ("sourceDriverId") REFERENCES "console_drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_cross_references" ADD CONSTRAINT "driver_cross_references_targetDriverId_fkey" FOREIGN KEY ("targetDriverId") REFERENCES "console_drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_sources" ADD CONSTRAINT "data_sources_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_flows" ADD CONSTRAINT "data_flows_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_flows" ADD CONSTRAINT "data_flows_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "data_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_quality_checks" ADD CONSTRAINT "data_quality_checks_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_quality_checks" ADD CONSTRAINT "data_quality_checks_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "data_flows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_data_entities" ADD CONSTRAINT "master_data_entities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecast_results" ADD CONSTRAINT "forecast_results_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomaly_detections" ADD CONSTRAINT "anomaly_detections_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "in_cycle_estimates" ADD CONSTRAINT "in_cycle_estimates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

