// src/app/api/lightspeed/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                 request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user has Lightspeed integration
    const lightspeedIntegration = await prisma.lightspeedIntegration.findUnique({
      where: { userId: parseInt(payload.sub) },
      select: {
        id: true,
        accountId: true,
        isActive: true,
        lastSyncAt: true,
        createdAt: true,
      }
    });

    if (!lightspeedIntegration) {
      return NextResponse.json({
        isConnected: false,
        lastSync: null,
        accountId: null,
      });
    }

    // Check if token is still valid (basic check)
    const isConnected = lightspeedIntegration.isActive;

    return NextResponse.json({
      isConnected,
      lastSync: lightspeedIntegration.lastSyncAt,
      accountId: lightspeedIntegration.accountId,
    });
  } catch (error) {
    console.error('Error checking Lightspeed status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}