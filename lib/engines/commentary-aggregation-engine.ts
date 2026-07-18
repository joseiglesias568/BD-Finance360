// =============================================================================
// Commentary Aggregation Engine
// Aggregates driver-level commentary upward using Claude Sonnet.
// Falls back to deterministic priority-ordered summary when API key is missing.
// =============================================================================

import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { MODEL_MAP } from '@/lib/ai/model-router';
import { getCommentaryByDriver, createCommentary, type DBCommentary } from '@/lib/db/repositories/commentary';
import { getActiveCompanyId } from '@/lib/db/repositories';
import prisma from '@/lib/db/prisma';
import { logger } from '@/lib/logger';

export interface AggregationResult {
  commentary: DBCommentary;
  sourceCount: number;
  driverName: string;
}

const PRIORITY_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

/**
 * Aggregate child commentary into a parent-level summary using Claude Sonnet.
 * Respects causality weights from the driver hierarchy.
 */
export async function aggregateCommentary(
  driverId: number,
  options?: {
    aggregationLevel?: 'driver' | 'console' | 'category' | 'executive';
    fiscalPeriod?: string;
  }
): Promise<AggregationResult> {
  const companyId = await getActiveCompanyId();
  const level = options?.aggregationLevel ?? 'driver';
  const fiscalPeriod = options?.fiscalPeriod ?? 'Q2 FY26';

  // 1. Get the driver with its children and weights
  const driver = await prisma.consoleDriver.findUnique({
    where: { id: driverId },
    include: {
      console: true,
      children: {
        include: { metrics: true },
        orderBy: { sortOrder: 'asc' },
      },
      metrics: true,
    },
  });

  if (!driver) throw new Error(`Driver ${driverId} not found`);

  // 2. Collect all commentary beneath this driver
  const childCommentary = await getCommentaryByDriver(companyId, driverId, true);

  if (childCommentary.length === 0) {
    throw new Error(`No child commentary found for driver "${driver.name}"`);
  }

  // 3. Build context for the LLM
  const driverContext = buildDriverContext(driver);
  const commentaryContext = buildCommentaryContext(childCommentary, driver.children);

  // 4. Graceful degradation if no API key
  if (!process.env.ANTHROPIC_API_KEY) {
    logger.warn('aggregation:no-api-key', { driverId });
    return createFallbackAggregation(companyId, driver, childCommentary, level, fiscalPeriod);
  }

  // 5. Call Claude Sonnet for synthesis
  try {
    const { text } = await generateText({
      model: anthropic(MODEL_MAP.sonnet),
      system: buildAggregationSystemPrompt(),
      prompt: buildAggregationUserPrompt(driver.name, driverContext, commentaryContext, level),
    });

    // 6. Store the aggregated commentary
    const aggregated = await createCommentary(companyId, {
      title: `${level === 'executive' ? 'Executive Summary' : `${driver.name} Summary`} — ${fiscalPeriod}`,
      content: text,
      category: driver.console.category,
      commentaryType: 'analysis',
      priority: determinePriority(childCommentary),
      fiscalPeriod,
      authorName: 'AI Commentary Engine',
      authorRole: 'Automated Aggregation',
      driverId,
      aggregationLevel: level,
      isAiGenerated: true,
      sourceCommentaryIds: childCommentary.map(c => c.id),
      relatedConsoles: [driver.console.title],
      relatedDrivers: [driver.name, ...driver.children.map(c => c.name)],
      tags: ['ai-aggregated', level, driver.name.toLowerCase().replace(/\s+/g, '-')],
    });

    logger.info('aggregation:complete', {
      driverId,
      sourceCount: childCommentary.length,
      level,
    });

    return {
      commentary: aggregated,
      sourceCount: childCommentary.length,
      driverName: driver.name,
    };
  } catch (err) {
    logger.error('aggregation:llm-error', { error: String(err), driverId });
    return createFallbackAggregation(companyId, driver, childCommentary, level, fiscalPeriod);
  }
}

function buildAggregationSystemPrompt(): string {
  return `You are a senior financial analyst at Becton, Dickinson and Company. You synthesize multiple commentary entries from across the business into executive-ready narratives.

Guidelines:
- Write in professional CFO-level language
- Reference specific metrics and percentages when available
- Use causality weights to proportionally represent driver importance
- Highlight both positive momentum and areas of concern
- Be concise: 2-4 paragraphs for driver-level, 4-6 for executive-level
- Format as markdown with bold key figures and bullet points for action items
- End with 2-3 actionable takeaways under a "Key Actions" heading`;
}

function buildAggregationUserPrompt(
  driverName: string,
  driverContext: string,
  commentaryContext: string,
  level: string
): string {
  const lengthGuidance = level === 'executive'
    ? '4-6 paragraph executive summary'
    : '2-4 paragraph summary';

  return `Synthesize the following ${level}-level commentary for "${driverName}" into a single cohesive narrative.

## Driver Context
${driverContext}

## Source Commentary
${commentaryContext}

Write a ${lengthGuidance} that:
1. Leads with the most material insight
2. Weights commentary by the causality weights of their respective drivers
3. Calls out any conflicting signals across drivers
4. Ends with 2-3 bullet-point action items or areas to watch`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildDriverContext(driver: any): string {
  const lines = [`**${driver.name}** (Console: ${driver.console.title})`];
  if (driver.metrics?.length > 0) {
    lines.push('Direct metrics:');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    driver.metrics.forEach((m: any) => {
      lines.push(`  - ${m.name}: ${m.currentValue} (target: ${m.target}, ${m.direction})`);
    });
  }
  if (driver.children?.length > 0) {
    lines.push('Sub-drivers:');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    driver.children.forEach((child: any) => {
      const weight = child.causalityWeight ? ` [weight: ${child.causalityWeight}]` : '';
      lines.push(`  - ${child.name}${weight}: ${child.description}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      child.metrics?.forEach((m: any) => {
        lines.push(`    - ${m.name}: ${m.currentValue} (target: ${m.target})`);
      });
    });
  }
  return lines.join('\n');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildCommentaryContext(commentary: DBCommentary[], children: any[]): string {
  const byDriver = new Map<number | null, DBCommentary[]>();
  commentary.forEach(c => {
    const key = c.driverId;
    if (!byDriver.has(key)) byDriver.set(key, []);
    byDriver.get(key)!.push(c);
  });

  const lines: string[] = [];
  byDriver.forEach((items, dId) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child = children.find((c: any) => c.id === dId);
    const weight = child?.causalityWeight ? ` (causality weight: ${child.causalityWeight})` : '';
    const driverLabel = child?.name ?? 'Parent Driver';
    lines.push(`### ${driverLabel}${weight}`);
    items.forEach(item => {
      lines.push(`- **${item.title}** [${item.priority}]: ${item.contentPlain.slice(0, 300)}`);
    });
  });
  return lines.join('\n');
}

function determinePriority(items: DBCommentary[]): string {
  if (items.some(i => i.priority === 'critical')) return 'critical';
  if (items.some(i => i.priority === 'high')) return 'high';
  return 'medium';
}

// Fallback aggregation when LLM is not available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createFallbackAggregation(
  companyId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  driver: any,
  childCommentary: DBCommentary[],
  level: string,
  fiscalPeriod: string
): Promise<AggregationResult> {
  const summaryParts = childCommentary
    .sort((a, b) => (PRIORITY_RANK[a.priority] ?? 2) - (PRIORITY_RANK[b.priority] ?? 2))
    .slice(0, 5)
    .map(c => `**${c.title}**: ${c.contentPlain.slice(0, 150)}`);

  const content = `## ${driver.name} — Aggregated Summary\n\n` +
    `*${childCommentary.length} commentary entries aggregated (AI unavailable — showing priority-ordered summary)*\n\n` +
    summaryParts.join('\n\n');

  const aggregated = await createCommentary(companyId, {
    title: `${driver.name} Summary — ${fiscalPeriod}`,
    content,
    category: driver.console?.category ?? 'Financial Performance',
    commentaryType: 'analysis',
    priority: determinePriority(childCommentary),
    fiscalPeriod,
    authorName: 'AI Commentary Engine',
    authorRole: 'Automated Aggregation (Fallback)',
    driverId: driver.id,
    aggregationLevel: level,
    isAiGenerated: true,
    sourceCommentaryIds: childCommentary.map(c => c.id),
    tags: ['ai-aggregated', 'fallback', level],
  });

  return {
    commentary: aggregated,
    sourceCount: childCommentary.length,
    driverName: driver.name,
  };
}
