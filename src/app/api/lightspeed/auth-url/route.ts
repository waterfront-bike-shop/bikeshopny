// src/app/api/lightspeed/auth-url/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

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

    // Check if required environment variables are set
    const clientId = process.env.LIGHTSPEED_CLIENT_ID;
    const redirectUri = process.env.LIGHTSPEED_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return NextResponse.json({ 
        error: 'Lightspeed configuration missing' 
      }, { status: 500 });
    }

    // Generate a secure random state value
    const state = crypto.randomUUID();
    
    // Build the OAuth authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'employee:all',
      state: state,
    });

    const authUrl = `https://cloud.lightspeedapp.com/oauth/authorize.php?${params.toString()}`;

    return NextResponse.json({ authUrl, state });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}