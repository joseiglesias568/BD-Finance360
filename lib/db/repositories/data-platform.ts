// =============================================================================
// Data Platform Repository — Layer 1 (Data Inputs) + Layer 2 (Finance Data Lake)
// =============================================================================

import { roundFinancial } from '@/lib/engines';
import prisma from '../prisma';

export interface DataSourceSummary {
  id: number;
  externalId: string;
  name: string;
  type: string;
  category: string;
  description: string;
  connectionType: string;
  refreshFrequency: string;
  lastSyncAt: string;
  status: string;
  recordCount: number;
  owner: string;
  flowCount: number;
}

export interface DataFlowSummary {
  id: number;
  sourceName: string;
  sourceType: string;
  targetLayer: string;
  targetEntity: string;
  transformations: string[];
  lastRunAt: string;
  lastRunStatus: string;
  recordsProcessed: number;
  recordsRejected: number;
  avgLatencyMs: number;
  qualityCheckCount: number;
}

export interface DQDashboard {
  overallScore: number;
  totalChecks: number;
  passed: number;
  warnings: number;
  failed: number;
  byType: Record<string, { count: number; avgScore: number }>;
  byEntity: Record<string, { count: number; avgScore: number; status: string }>;
  checks: Array<{
    checkName: string;
    checkType: string;
    targetEntity: string;
    rule: string;
    status: string;
    score: number;
    failedRecords: number;
    totalRecords: number;
    details: string;
  }>;
}

export interface MDMOverview {
  domain: string;
  entityCount: number;
  lastUpdated: string;
  steward: string;
  goldenRecordPct: number;
  duplicateCount: number;
  status: string;
}

export async function getDataSources(companyId: number): Promise<DataSourceSummary[]> {
  const sources = await prisma.dataSource.findMany({
    where: { companyId },
    include: { _count: { select: { dataFlows: true } } },
    orderBy: { name: 'asc' },
  });

  return sources.map((s) => ({
    id: s.id,
    externalId: s.externalId,
    name: s.name,
    type: s.type,
    category: s.category,
    description: s.description,
    connectionType: s.connectionType,
    refreshFrequency: s.refreshFrequency,
    lastSyncAt: s.lastSyncAt,
    status: s.status,
    recordCount: s.recordCount,
    owner: s.owner,
    flowCount: s._count.dataFlows,
  }));
}

export async function getDataFlows(companyId: number): Promise<DataFlowSummary[]> {
  const flows = await prisma.dataFlow.findMany({
    where: { companyId },
    include: {
      source: { select: { name: true, type: true } },
      _count: { select: { qualityChecks: true } },
    },
    orderBy: [{ source: { name: 'asc' } }, { targetLayer: 'asc' }],
  });

  return flows.map((f) => ({
    id: f.id,
    sourceName: f.source.name,
    sourceType: f.source.type,
    targetLayer: f.targetLayer,
    targetEntity: f.targetEntity,
    transformations: f.transformations as string[],
    lastRunAt: f.lastRunAt,
    lastRunStatus: f.lastRunStatus,
    recordsProcessed: f.recordsProcessed,
    recordsRejected: f.recordsRejected,
    avgLatencyMs: f.avgLatencyMs,
    qualityCheckCount: f._count.qualityChecks,
  }));
}

export async function getDataQualityDashboard(companyId: number): Promise<DQDashboard> {
  const checks = await prisma.dataQualityCheck.findMany({
    where: { companyId },
    orderBy: { checkName: 'asc' },
  });

  const passed = checks.filter((c) => c.status === 'pass').length;
  const warnings = checks.filter((c) => c.status === 'warn').length;
  const failed = checks.filter((c) => c.status === 'fail').length;
  const overallScore =
    checks.length > 0
      ? checks.reduce((sum, c) => sum + c.score, 0) / checks.length
      : 100;

  // Group by type
  const byType: Record<string, { count: number; avgScore: number }> = {};
  for (const c of checks) {
    if (!byType[c.checkType]) byType[c.checkType] = { count: 0, avgScore: 0 };
    byType[c.checkType].count++;
    byType[c.checkType].avgScore += c.score;
  }
  for (const key of Object.keys(byType)) {
    byType[key].avgScore = byType[key].avgScore / byType[key].count;
  }

  // Group by entity
  const byEntity: Record<string, { count: number; avgScore: number; status: string }> = {};
  for (const c of checks) {
    if (!byEntity[c.targetEntity]) byEntity[c.targetEntity] = { count: 0, avgScore: 0, status: 'pass' };
    byEntity[c.targetEntity].count++;
    byEntity[c.targetEntity].avgScore += c.score;
    if (c.status === 'fail') byEntity[c.targetEntity].status = 'fail';
    else if (c.status === 'warn' && byEntity[c.targetEntity].status !== 'fail') byEntity[c.targetEntity].status = 'warn';
  }
  for (const key of Object.keys(byEntity)) {
    byEntity[key].avgScore = byEntity[key].avgScore / byEntity[key].count;
  }

  return {
    overallScore: roundFinancial(overallScore, 1),
    totalChecks: checks.length,
    passed,
    warnings,
    failed,
    byType,
    byEntity,
    checks: checks.map((c) => ({
      checkName: c.checkName,
      checkType: c.checkType,
      targetEntity: c.targetEntity,
      rule: c.rule,
      status: c.status,
      score: c.score,
      failedRecords: c.failedRecords,
      totalRecords: c.totalRecords,
      details: c.details,
    })),
  };
}

export async function getMasterDataOverview(companyId: number): Promise<MDMOverview[]> {
  const entities = await prisma.masterDataEntity.findMany({
    where: { companyId },
    orderBy: { domain: 'asc' },
  });

  return entities.map((e) => ({
    domain: e.domain,
    entityCount: e.entityCount,
    lastUpdated: e.lastUpdated,
    steward: e.steward,
    goldenRecordPct: e.goldenRecordPct,
    duplicateCount: e.duplicateCount,
    status: e.status,
  }));
}
