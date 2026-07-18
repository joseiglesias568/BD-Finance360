import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import { getActiveCompanyId, getCommentary, searchCommentary, createCommentary } from '@/lib/db/repositories';
import { logger } from '@/lib/logger';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// GET /api/commentary — list all commentary with optional filters
export async function GET(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = checkRateLimit(`commentary:${ip}`, 60, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 60) }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? '';
    const companyId = await getActiveCompanyId();

    let items;
    if (q.trim()) {
      items = await searchCommentary(companyId, q);
    } else {
      items = await getCommentary(companyId);
    }

    // Client-side filtering is primary, but support server-side category filter
    const category = searchParams.get('category');
    if (category) {
      items = items.filter(i => i.category === category);
    }

    const priority = searchParams.get('priority');
    if (priority) {
      items = items.filter(i => i.priority === priority);
    }

    const type = searchParams.get('type');
    if (type) {
      items = items.filter(i => i.commentaryType === type);
    }

    logger.info('commentary:list', { count: items.length, query: q || undefined });
    return NextResponse.json({ commentary: items, count: items.length });
  } catch (err) {
    logger.error('commentary:list:error', { error: String(err) });
    return NextResponse.json({ error: 'Failed to fetch commentary' }, { status: 500 });
  }
}

// POST /api/commentary — create new commentary
export async function POST(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResult = checkRateLimit(`commentary-write:${ip}`, 30, 60_000);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult, 30) }
    );
  }

  try {
    const body = await request.json();
    const { title, content, category } = body;

    if (!title?.trim() || !content?.trim() || !category?.trim()) {
      return NextResponse.json(
        { error: 'title, content, and category are required' },
        { status: 400 }
      );
    }

    const companyId = await getActiveCompanyId();
    const item = await createCommentary(companyId, {
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
      authorName: body.authorName,
      authorRole: body.authorRole,
      tags: body.tags,
      relatedKPIs: body.relatedKPIs,
      relatedConsoles: body.relatedConsoles,
      relatedDrivers: body.relatedDrivers,
      linkedInsightId: body.linkedInsightId ? Number(body.linkedInsightId) : undefined,
      fiscalPeriod: body.fiscalPeriod,
      periodType: body.periodType,
      priority: body.priority,
      commentaryType: body.commentaryType,
      status: body.status,
      driverId: body.driverId ? Number(body.driverId) : undefined,
      aggregationLevel: body.aggregationLevel,
      isAiGenerated: body.isAiGenerated ?? false,
      sourceCommentaryIds: body.sourceCommentaryIds,
    });

    logger.info('commentary:create', { id: item.id, title: item.title });
    return NextResponse.json({ commentary: item }, { status: 201 });
  } catch (err) {
    logger.error('commentary:create:error', { error: String(err) });
    return NextResponse.json({ error: 'Failed to create commentary' }, { status: 500 });
  }
}
