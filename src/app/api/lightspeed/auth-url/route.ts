// src/app/api/lightspeed/auth-url/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const cookieHeader = request.headers.get('cookie');
    console.log('user is verified -- party on 🎉')
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

    // Check if required environment variables are set
    const clientId = process.env.LIGHTSPEED_CLIENT_ID;
    const redirectUri = process.env.LIGHTSPEED_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      return NextResponse.json({
        error: 'Lightspeed configuration missing'
      }, { status: 500 });
    }

    console.log('Lightspeed .env variables OK!')

    // Generate a secure random state value and store it temporarily
    const state = crypto.randomUUID();
    
    // Store state in a secure way (you might want to use Redis or database)
    // For now, we'll encode the user ID in the state for verification
    const stateWithUser = `${state}_${payload.sub}`;

    // Build the OAuth authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      // scope: 'employee:all', // would grant ALL rights, which we don't need that security concern open
      scope: 'employee:inventory_read employee:categories',
      state: stateWithUser,
    });
    console.log('params', params) // SEE PARAMS
    const authUrl = `https://cloud.lightspeedapp.com/oauth/authorize.php?${params.toString()}`;
    
    // Instead of returning JSON, redirect directly to Lightspeed
    // return NextResponse.redirect(authUrl);

    return NextResponse.json({ authUrl });
    
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}