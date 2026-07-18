import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import { getThread, deleteThread, renameThread, addMessage } from '@/lib/db/repositories/chat';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const thread = await getThread(id);
    if (!thread) return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    return NextResponse.json(thread);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get thread' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    await deleteThread(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete thread' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();

    // Handle rename
    if (body.title) {
      const thread = await renameThread(id, body.title);
      return NextResponse.json(thread);
    }

    // Handle adding a message
    if (body.role && body.content) {
      const message = await addMessage(id, body.role, body.content, body.metadata);
      return NextResponse.json(message, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update thread' }, { status: 500 });
  }
}
