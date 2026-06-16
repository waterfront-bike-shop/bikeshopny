import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const TOKEN_ENDPOINT = 'https://cloud.lightspeedapp.com/oauth/access_token.php';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyJWT(token);
    if (!payload?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(payload.sub, 10);
    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user id in token' }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.LIGHTSPEED_CLIENT_ID ?? '',
        client_secret: process.env.LIGHTSPEED_CLIENT_SECRET ?? '',
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LIGHTSPEED_REDIRECT_URI ?? '',
      }),
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.error('Token exchange failed:', responseData);
      return NextResponse.json({ error: 'Token exchange failed', details: responseData }, { status: response.status });
    }

    if (!responseData.access_token || !responseData.refresh_token) {
      console.error('Invalid token exchange response:', responseData);
      return NextResponse.json({ error: 'Invalid token response', details: responseData }, { status: 500 });
    }

    const accountResponse = await fetch('https://api.lightspeedapp.com/API/Account.json', {
      headers: { Authorization: `Bearer ${responseData.access_token}` },
    });

    if (!accountResponse.ok) {
      const accountErrorText = await accountResponse.text();
      console.error('Account lookup failed:', accountResponse.status, accountErrorText);
      return NextResponse.json({ error: 'Lightspeed account lookup failed', details: accountErrorText }, { status: 502 });
    }

    const accountData = await accountResponse.json();
    if (!accountData?.Account?.accountID) {
      return NextResponse.json({ error: 'Invalid account response', details: accountData }, { status: 500 });
    }

    await prisma.lightspeedConnection.upsert({
      where: { userId },
      create: {
        userId,
        accessToken: responseData.access_token,
        refreshToken: responseData.refresh_token,
        accountId: String(accountData.Account.accountID),
        expiresAt: new Date(Date.now() + (Number(responseData.expires_in || 3600) * 1000)),
        isActive: true,
        lastSync: new Date(),
      },
      update: {
        accessToken: responseData.access_token,
        refreshToken: responseData.refresh_token,
        accountId: String(accountData.Account.accountID),
        expiresAt: new Date(Date.now() + (Number(responseData.expires_in || 3600) * 1000)),
        isActive: true,
        lastSync: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: 'Successfully connected to Lightspeed' });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
