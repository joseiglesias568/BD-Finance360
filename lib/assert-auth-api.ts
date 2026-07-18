import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

/** Use at the top of API handlers (Node runtime). Replaces Edge middleware protection. */
export async function assertAuthenticatedApi(
  request: NextRequest
): Promise<NextResponse | null> {
  if (!(await validateSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
