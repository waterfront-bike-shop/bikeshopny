// src/app/api/lightspeed/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=${error}`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=missing_code`);
    }

    // Verify user is authenticated via cookie
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=unauthorized`);
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=invalid_token`);
    }

    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);
    
    // Get account information
    const accountInfo = await getAccountInfo(tokenResponse.access_token);
    
    // Save/update Lightspeed integration in database
    await prisma.lightspeedIntegration.upsert({
      where: { userId: parseInt(payload.sub) },
      update: {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
        accountId: accountInfo.Account.accountID,
        isActive: true,
        lastSyncAt: new Date(),
      },
      create: {
        userId: parseInt(payload.sub),
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
        accountId: accountInfo.Account.accountID,
        isActive: true,
        lastSyncAt: new Date(),
      },
    });

    // Redirect back to dashboard with success message
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?success=lightspeed_connected`);
  } catch (error) {
    console.error('Lightspeed callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=connection_failed`);
  }
}

async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const tokenRequest = {
    client_id: process.env.LIGHTSPEED_CLIENT_ID,
    client_secret: process.env.LIGHTSPEED_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.LIGHTSPEED_REDIRECT_URI,
  };

  const response = await fetch('https://cloud.lightspeedapp.com/oauth/access_token.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tokenRequest),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${errorText}`);
  }

  return await response.json();
}

async function getAccountInfo(accessToken: string) {
  const response = await fetch('https://api.lightspeedapp.com/API/Account.json', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get account info');
  }

  return await response.json();
}