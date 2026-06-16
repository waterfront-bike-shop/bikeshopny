// src/app/api/lightspeed/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

const TOKEN_ENDPOINT = 'https://cloud.lightspeedapp.com/oauth/access_token.php';

function buildDashboardRedirect(query: string) {
  const base = process.env.NEXTAUTH_URL ?? '';
  return `${base}/dashboard?${query}`;
}

function getCookieToken(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/token=([^;]+)/);
  return match?.[1] ?? null;
}

function parseUserIdFromState(state: string | null) {
  if (!state) return null;
  const parts = state.split('_');
  if (parts.length !== 2) return null;
  const userId = parseInt(parts[1], 10);
  return Number.isNaN(userId) ? null : userId;
}

async function resolveUserId(request: NextRequest) {
  const token = getCookieToken(request);
  if (token) {
    const payload = verifyJWT(token);
    if (payload?.sub) {
      const userId = parseInt(payload.sub, 10);
      if (!Number.isNaN(userId)) return userId;
    }
  }

  const { searchParams } = new URL(request.url);
  return parseUserIdFromState(searchParams.get('state'));
}

async function exchangeCode(code: string) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.LIGHTSPEED_CLIENT_ID ?? '',
      client_secret: process.env.LIGHTSPEED_CLIENT_SECRET ?? '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.LIGHTSPEED_REDIRECT_URI ?? '',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  if (!json.access_token || !json.refresh_token) {
    throw new Error(`Invalid token response: ${JSON.stringify(json)}`);
  }

  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresIn: Number(json.expires_in || 3600),
  };
}

async function getLightspeedAccountId(accessToken: string) {
  const response = await fetch('https://api.lightspeedapp.com/API/Account.json', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Account lookup failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data?.Account?.accountID) {
    throw new Error(`Invalid account response: ${JSON.stringify(data)}`);
  }

  return String(data.Account.accountID);
}

async function persistConnection(userId: number, accessToken: string, refreshToken: string, expiresIn: number, accountId: string) {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  return prisma.lightspeedConnection.upsert({
    where: { userId },
    create: {
      userId,
      accessToken,
      refreshToken,
      accountId,
      expiresAt,
      isActive: true,
      lastSync: new Date(),
    },
    update: {
      accessToken,
      refreshToken,
      accountId,
      expiresAt,
      isActive: true,
      lastSync: new Date(),
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const code = searchParams.get('code');

    if (error) {
      return NextResponse.redirect(buildDashboardRedirect(`error=oauth_error&message=${encodeURIComponent(errorDescription || error)}`));
    }

    if (!code) {
      return NextResponse.redirect(buildDashboardRedirect('error=missing_code'));
    }

    const userId = await resolveUserId(request);
    if (!userId) {
      return NextResponse.redirect(buildDashboardRedirect('error=unauthenticated_callback'));
    }

    const tokenData = await exchangeCode(code);
    const accountId = await getLightspeedAccountId(tokenData.accessToken);
    await persistConnection(userId, tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn, accountId);

    return NextResponse.redirect(buildDashboardRedirect(`success=lightspeed_connected&account=${encodeURIComponent(accountId)}`));
  } catch (error) {
    console.error('Lightspeed callback GET error:', error);
    return NextResponse.redirect(buildDashboardRedirect(`error=callback_error&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = body?.code;
    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    const userId = await resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized callback request' }, { status: 401 });
    }

    const tokenData = await exchangeCode(code);
    const accountId = await getLightspeedAccountId(tokenData.accessToken);
    await persistConnection(userId, tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn, accountId);

    return NextResponse.json({ success: true, accountId });
  } catch (error) {
    console.error('Lightspeed callback POST error:', error);
    return NextResponse.json(
      { error: 'Callback failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
