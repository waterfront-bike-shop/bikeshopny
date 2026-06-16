import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/lightspeed/sync
 * 
 * Endpoint for admin users to manually trigger a Lightspeed catalog sync.
 * Verifies user is authenticated and is an admin.
 * Calls the cron sync endpoint internally with the CRON_SECRET.
 */
export async function POST(request: NextRequest) {
  try {
    // Extract and verify JWT from Authorization header or cookie
    const authHeader = request.headers.get('Authorization');
    let token: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Try to get from cookie
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(/token=([^;]+)/);
      token = match?.[1] ?? null;
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No authentication token' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload?.sub) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userId = parseInt(payload.sub, 10);
    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid user ID' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Call the cron sync endpoint internally
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      console.error('CRON_SECRET not configured');
      return NextResponse.json({ error: 'Sync not configured' }, { status: 500 });
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? 'https://localhost:3000';
    const syncUrl = `${baseUrl}/api/cron/lightspeed-sync?secret=${encodeURIComponent(cronSecret)}`;

    const syncResponse = await fetch(syncUrl, { method: 'POST' });
    if (!syncResponse.ok) {
      const errorText = await syncResponse.text();
      console.error('Cron sync failed:', syncResponse.status, errorText);
      return NextResponse.json(
        { error: 'Sync failed', details: errorText },
        { status: syncResponse.status }
      );
    }

    const syncData = await syncResponse.json();
    return NextResponse.json({ success: true, message: 'Sync completed', data: syncData });
  } catch (error) {
    console.error('Sync endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
