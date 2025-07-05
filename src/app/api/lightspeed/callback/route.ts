
// src/app/api/lightspeed/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=oauth_error`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=missing_parameters`);
    }

    // Extract user ID from state
    const [stateValue, userId] = state.split('_');
    if (!userId) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=invalid_state`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://cloud.lightspeedapp.com/auth/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.LIGHTSPEED_CLIENT_ID!,
        client_secret: process.env.LIGHTSPEED_CLIENT_SECRET!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.LIGHTSPEED_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get account info to verify the connection
    const accountResponse = await fetch('https://api.lightspeedapp.com/API/Account.json', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!accountResponse.ok) {
      console.error('Account fetch failed:', await accountResponse.text());
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=account_fetch_failed`);
    }

    const accountData = await accountResponse.json();
    const accountId = accountData.Account?.accountID;

    // Store the tokens in your database
    await prisma.lightspeedConnection.upsert({
      where: { userId: parseInt(userId) },
      create: {
        userId: parseInt(userId),
        accessToken: access_token,
        refreshToken: refresh_token,
        accountId: accountId,
        expiresAt: new Date(Date.now() + expires_in * 1000),
        isActive: true,
      },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        accountId: accountId,
        expiresAt: new Date(Date.now() + expires_in * 1000),
        isActive: true,
        lastSync: new Date(),
      },
    });

    // Redirect back to dashboard with success
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?success=lightspeed_connected`);

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=callback_error`);
  }
}

