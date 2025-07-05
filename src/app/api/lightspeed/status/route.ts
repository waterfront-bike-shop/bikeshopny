// src/app/api/lightspeed/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
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

    // Check if user has a Lightspeed connection
    const connection = await prisma.lightspeedConnection.findUnique({
      where: { 
        userId: parseInt(payload.sub),
        isActive: true,
      },
    });

    if (!connection) {
      return NextResponse.json({
        isConnected: false,
      });
    }

    // Check if token is still valid (not expired)
    const isExpired = connection.expiresAt < new Date();
    
    return NextResponse.json({
      isConnected: !isExpired,
      lastSync: connection.lastSync?.toISOString(),
      accountId: connection.accountId,
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}