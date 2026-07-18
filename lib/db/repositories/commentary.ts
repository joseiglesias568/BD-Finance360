import prisma from '../prisma';

export interface DBCommentary {
  id: number;
  externalId: string;
  title: string;
  content: string;
  contentPlain: string;
  authorName: string;
  authorRole: string;
  category: string;
  tags: string[];
  relatedKPIs: string[];
  relatedConsoles: string[];
  relatedDrivers: string[];
  linkedInsightId: number | null;
  fiscalPeriod: string;
  periodType: string;
  status: string;
  priority: string;
  commentaryType: string;
  driverId: number | null;
  aggregationLevel: string;
  isAiGenerated: boolean;
  sourceCommentaryIds: number[];
  createdAt: string;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(c: any): DBCommentary {
  return {
    id: c.id,
    externalId: c.externalId,
    title: c.title,
    content: c.content,
    contentPlain: c.contentPlain,
    authorName: c.authorName,
    authorRole: c.authorRole,
    category: c.category,
    tags: c.tags as string[],
    relatedKPIs: c.relatedKPIs as string[],
    relatedConsoles: c.relatedConsoles as string[],
    relatedDrivers: c.relatedDrivers as string[],
    linkedInsightId: c.linkedInsightId,
    fiscalPeriod: c.fiscalPeriod,
    periodType: c.periodType,
    status: c.status,
    priority: c.priority,
    commentaryType: c.commentaryType,
    driverId: c.driverId ?? null,
    aggregationLevel: c.aggregationLevel ?? 'manual',
    isAiGenerated: c.isAiGenerated ?? false,
    sourceCommentaryIds: (c.sourceCommentaryIds as number[]) ?? [],
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

/** Get all published commentary for a company */
export async function getCommentary(companyId: number): Promise<DBCommentary[]> {
  const items = await prisma.commentary.findMany({
    where: { companyId, status: { not: 'archived' } },
    orderBy: { createdAt: 'desc' },
  });
  return items.map(mapRow);
}

/** Search commentary by text query */
export async function searchCommentary(companyId: number, query: string): Promise<DBCommentary[]> {
  const items = await prisma.commentary.findMany({
    where: {
      companyId,
      status: { not: 'archived' },
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { contentPlain: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
  return items.map(mapRow);
}

/** Create a new commentary entry */
export async function createCommentary(companyId: number, data: {
  title: string;
  content: string;
  category: string;
  authorName?: string;
  authorRole?: string;
  tags?: string[];
  relatedKPIs?: string[];
  relatedConsoles?: string[];
  relatedDrivers?: string[];
  linkedInsightId?: number;
  fiscalPeriod?: string;
  periodType?: string;
  priority?: string;
  commentaryType?: string;
  status?: string;
  driverId?: number;
  aggregationLevel?: string;
  isAiGenerated?: boolean;
  sourceCommentaryIds?: number[];
}): Promise<DBCommentary> {
  const contentPlain = data.content
    .replace(/[#*_`~\[\]()>|\\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const item = await prisma.commentary.create({
    data: {
      companyId,
      title: data.title,
      content: data.content,
      contentPlain,
      authorName: data.authorName ?? 'Sarah Johnson',
      authorRole: data.authorRole ?? 'VP, Financial Planning & Analysis',
      category: data.category,
      tags: data.tags ?? [],
      relatedKPIs: data.relatedKPIs ?? [],
      relatedConsoles: data.relatedConsoles ?? [],
      relatedDrivers: data.relatedDrivers ?? [],
      linkedInsightId: data.linkedInsightId ?? null,
      fiscalPeriod: data.fiscalPeriod ?? '',
      periodType: data.periodType ?? 'quarter',
      priority: data.priority ?? 'medium',
      commentaryType: data.commentaryType ?? 'analysis',
      status: data.status ?? 'published',
      driverId: data.driverId ?? null,
      aggregationLevel: data.aggregationLevel ?? 'manual',
      isAiGenerated: data.isAiGenerated ?? false,
      sourceCommentaryIds: data.sourceCommentaryIds ?? [],
    },
  });
  return mapRow(item);
}

/** Update an existing commentary entry */
export async function updateCommentary(id: number, data: Partial<{
  title: string;
  content: string;
  category: string;
  tags: string[];
  relatedKPIs: string[];
  relatedConsoles: string[];
  relatedDrivers: string[];
  linkedInsightId: number | null;
  fiscalPeriod: string;
  periodType: string;
  priority: string;
  commentaryType: string;
  status: string;
  driverId: number | null;
  aggregationLevel: string;
  isAiGenerated: boolean;
  sourceCommentaryIds: number[];
}>): Promise<DBCommentary> {
  const updateData: Record<string, unknown> = { ...data };

  if (data.content !== undefined) {
    updateData.contentPlain = data.content
      .replace(/[#*_`~\[\]()>|\\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const item = await prisma.commentary.update({
    where: { id },
    data: updateData,
  });
  return mapRow(item);
}

/** Soft-delete a commentary entry */
export async function deleteCommentary(id: number): Promise<void> {
  await prisma.commentary.update({
    where: { id },
    data: { status: 'archived' },
  });
}

/** Recursively collect all descendant driver IDs */
async function collectChildDriverIds(parentId: number): Promise<number[]> {
  const children = await prisma.consoleDriver.findMany({
    where: { parentDriverId: parentId },
    select: { id: true },
  });
  const ids = children.map(c => c.id);
  for (const child of children) {
    ids.push(...await collectChildDriverIds(child.id));
  }
  return ids;
}

/** Get commentary for a specific driver and optionally all its descendants */
export async function getCommentaryByDriver(
  companyId: number,
  driverId: number,
  includeChildren: boolean = true
): Promise<DBCommentary[]> {
  const driverIds = [driverId];
  if (includeChildren) {
    driverIds.push(...await collectChildDriverIds(driverId));
  }

  const items = await prisma.commentary.findMany({
    where: {
      companyId,
      driverId: { in: driverIds },
      status: { not: 'archived' },
    },
    orderBy: { createdAt: 'desc' },
  });
  return items.map(mapRow);
}

/** Get all commentary linked to drivers within a specific console */
export async function getCommentaryByConsole(
  companyId: number,
  consoleId: number
): Promise<DBCommentary[]> {
  const drivers = await prisma.consoleDriver.findMany({
    where: { consoleId },
    select: { id: true },
  });
  const driverIds = drivers.map(d => d.id);

  const items = await prisma.commentary.findMany({
    where: {
      companyId,
      driverId: { in: driverIds },
      status: { not: 'archived' },
    },
    orderBy: { createdAt: 'desc' },
  });
  return items.map(mapRow);
}
