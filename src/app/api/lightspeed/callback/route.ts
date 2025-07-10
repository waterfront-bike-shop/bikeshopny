// src/app/api/lightspeed/callback/route.ts - DEBUG VERSION
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // DEBUG: Log all environment variables (be careful with secrets in production)
    console.log('=== DEBUG: Environment Variables ===');
    console.log('LIGHTSPEED_CLIENT_ID:', process.env.LIGHTSPEED_CLIENT_ID ? 'SET' : 'NOT SET');
    console.log('LIGHTSPEED_CLIENT_SECRET:', process.env.LIGHTSPEED_CLIENT_SECRET ? 'SET' : 'NOT SET');
    console.log('LIGHTSPEED_REDIRECT_URI:', process.env.LIGHTSPEED_REDIRECT_URI);
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    console.log('=====================================');

    // DEBUG: Log the full request URL
    console.log('Full callback URL:', request.url);
    console.log('Code received:', code ? 'YES' : 'NO');
    console.log('State received:', state);

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      const errorDescription = searchParams.get('error_description');
      console.error('Error description:', errorDescription);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=oauth_error&message=${encodeURIComponent(errorDescription || error)}`);
    }

    if (!code || !state) {
      console.error('Missing parameters - code:', !!code, 'state:', !!state);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=missing_parameters`);
    }

    // Extract user ID from state
    const stateParts = state.split('_');
    if (stateParts.length !== 2) {
      console.error('Invalid state format:', state);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=invalid_state`);
    }
    
    const [stateValue, userId] = stateParts;
    const userIdNum = parseInt(userId);
    
    if (!userId || isNaN(userIdNum)) {
      console.error('Invalid user ID in state:', userId);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=invalid_state`);
    }

    console.log('Exchanging code for token, userId:', userIdNum);

    // DEBUG: Log the exact parameters being sent
    const tokenParams = {
      client_id: process.env.LIGHTSPEED_CLIENT_ID!,
      client_secret: process.env.LIGHTSPEED_CLIENT_SECRET!,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.LIGHTSPEED_REDIRECT_URI!,
    };

    console.log('=== TOKEN EXCHANGE PARAMETERS ===');
    console.log('client_id:', tokenParams.client_id);
    console.log('client_secret:', tokenParams.client_secret ? 'SET' : 'NOT SET');
    console.log('code:', tokenParams.code);
    console.log('grant_type:', tokenParams.grant_type);
    console.log('redirect_uri:', tokenParams.redirect_uri);
    console.log('=================================');
    console.log('state value', stateValue)

    // Exchange code for access token
    const tokenResponse = await fetch('https://cloud.lightspeedapp.com/auth/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenParams),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', tokenResponse.status, errorText);
      console.error('Response headers:', Object.fromEntries(tokenResponse.headers.entries()));
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=token_exchange_failed&status=${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token response received:', Object.keys(tokenData));

    // Validate token data structure
    if (!tokenData.access_token || !tokenData.refresh_token) {
      console.error('Invalid token data structure:', tokenData);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=invalid_token_response`);
    }

    const { access_token, refresh_token, expires_in } = tokenData;

    // Get account info to verify the connection
    const accountResponse = await fetch('https://api.lightspeedapp.com/API/Account.json', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!accountResponse.ok) {
      const errorText = await accountResponse.text();
      console.error('Account fetch failed:', accountResponse.status, errorText);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=account_fetch_failed&status=${accountResponse.status}`);
    }

    const accountData = await accountResponse.json();
    console.log('Account data received:', Object.keys(accountData));

    // Validate account data structure
    if (!accountData.Account || !accountData.Account.accountID) {
      console.error('Invalid account data structure:', accountData);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=invalid_account_response`);
    }

    const accountId = accountData.Account.accountID;

    // Calculate expiration time (default to 1 hour if not provided)
    const expiresInMs = (expires_in || 3600) * 1000;
    const expiresAt = new Date(Date.now() + expiresInMs);

    console.log('Storing tokens in database for user:', userIdNum);

    // Store the tokens in your database
    const connectionRecord = await prisma.lightspeedConnection.upsert({
      where: { userId: userIdNum },
      create: {
        userId: userIdNum,
        accessToken: access_token,
        refreshToken: refresh_token,
        accountId: accountId.toString(),
        expiresAt: expiresAt,
        isActive: true,
      },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        accountId: accountId.toString(),
        expiresAt: expiresAt,
        isActive: true,
        lastSync: new Date(),
      },
    });

    console.log('Connection record saved:', connectionRecord.id);

    // Redirect back to dashboard with success
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?success=lightspeed_connected&account=${accountId}`);

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?error=callback_error&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`);
  }
}