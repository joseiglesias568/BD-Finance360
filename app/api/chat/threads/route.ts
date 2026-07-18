import { NextRequest, NextResponse } from 'next/server';
import { assertAuthenticatedApi } from '@/lib/assert-auth-api';
import { listThreads, createThread } from '@/lib/db/repositories/chat';

export async function GET(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  try {
    const threads = await listThreads();
    return NextResponse.json(threads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list threads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await assertAuthenticatedApi(request);
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const thread = await createThread(body.title);
    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
  }
}
