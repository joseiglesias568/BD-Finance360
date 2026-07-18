-- Add missing columns that exist in schema.prisma but were not in the initial migration

-- alert_templates missing columns
ALTER TABLE "alert_templates" ADD COLUMN IF NOT EXISTS "alertType" TEXT NOT NULL DEFAULT 'threshold';
ALTER TABLE "alert_templates" ADD COLUMN IF NOT EXISTS "frequency" TEXT NOT NULL DEFAULT 'weekly';
ALTER TABLE "alert_templates" ADD COLUMN IF NOT EXISTS "conditionPrefix" TEXT NOT NULL DEFAULT '';

-- report_templates missing columns
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "owner" TEXT NOT NULL DEFAULT '';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.0;
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "isNew" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "isTrending" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "relatedConsoleId" TEXT;
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "relatedReportIds" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "dataSource" TEXT NOT NULL DEFAULT '';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "accessLevel" TEXT NOT NULL DEFAULT 'All Finance';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "audience" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "tags" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "executiveSummary" TEXT NOT NULL DEFAULT '';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "aiInsight" TEXT NOT NULL DEFAULT '';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "recommendations" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "keyMetrics" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "chartData" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "tableData" JSONB;
ALTER TABLE "report_templates" ADD COLUMN IF NOT EXISTS "nextUpdate" TEXT NOT NULL DEFAULT '';
