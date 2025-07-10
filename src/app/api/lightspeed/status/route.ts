// src/app/api/lightspeed/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user via JWT in cookie
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = tokenMatch[1];
    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = parseInt(payload.sub);

    // Fetch user's active Lightspeed connection
    const connection = await prisma.lightspeedConnection.findUnique({
      where: { userId },
    });

    if (!connection || !connection.isActive) {
      return NextResponse.json({ isConnected: false });
    }

    // Check if token has expired
    const now = new Date();
    const isExpired = connection.expiresAt <= now;

    if (!isExpired) {
      return NextResponse.json({
        isConnected: true,
        lastSync: connection.lastSync?.toISOString(),
        accountId: connection.accountId,
      });
    }

    console.log('Access token expired — attempting refresh');

    // Prepare the refresh request
    const refreshParams = new URLSearchParams({
      client_id: process.env.LIGHTSPEED_CLIENT_ID!,
      client_secret: process.env.LIGHTSPEED_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: connection.refreshToken!,
    });

    const refreshResponse = await fetch('https://cloud.lightspeedapp.com/oauth/access_token.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: refreshParams,
    });

    if (!refreshResponse.ok) {
      const errorText = await refreshResponse.text();
      console.error('Token refresh failed:', errorText);
      return NextResponse.json({ isConnected: false, error: 'Token refresh failed' });
    }

    const refreshed = await refreshResponse.json();

    // Compute new expiration
    const newExpiresAt = new Date(Date.now() + (refreshed.expires_in || 3600) * 1000);

    // Save updated tokens to DB
    const updatedConnection = await prisma.lightspeedConnection.update({
      where: { userId },
      data: {
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token || connection.refreshToken,
        expiresAt: newExpiresAt,
        lastSync: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('Token refreshed and saved');

    return NextResponse.json({
      isConnected: true,
      lastSync: updatedConnection.lastSync?.toISOString(),
      accountId: updatedConnection.accountId,
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
