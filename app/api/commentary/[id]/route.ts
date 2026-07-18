import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import { updateCommentary, deleteCommentary } from '@/lib/db/repositories';
import { logger } from '@/lib/logger';
import prisma from '@/lib/db/prisma';

// GET /api/commentary/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const item = await prisma.commentary.findUnique({ where: { id: Number(id) } });
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ commentary: item });
  } catch (err) {
    logger.error('commentary:get:error', { error: String(err) });
    return NextResponse.json({ error: 'Failed to fetch commentary' }, { status: 500 });
  }
}

// PATCH /api/commentary/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();
    const item = await updateCommentary(Number(id), body);
    logger.info('commentary:update', { id: item.id });
    return NextResponse.json({ commentary: item });
  } catch (err) {
    logger.error('commentary:update:error', { error: String(err) });
    return NextResponse.json({ error: 'Failed to update commentary' }, { status: 500 });
  }
}

// DELETE /api/commentary/:id (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    await deleteCommentary(Number(id));
    logger.info('commentary:delete', { id });
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('commentary:delete:error', { error: String(err) });
    return NextResponse.json({ error: 'Failed to delete commentary' }, { status: 500 });
  }
}
