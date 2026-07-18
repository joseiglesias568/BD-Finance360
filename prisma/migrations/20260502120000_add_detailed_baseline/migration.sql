-- AlterTable: add detailedBaseline column to scenario_baselines
-- Captures full P&L structure (segments, COGS, OpEx, tax rate, sensitivity)
-- previously synced via `prisma db push`.
ALTER TABLE "scenario_baselines" ADD COLUMN "detailedBaseline" JSONB;
