import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify user authentication
    const user = await verifyJWT(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code, state } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    // Prepare the request body to exchange the code for tokens
    const tokenRequest = {
      client_id: process.env.LIGHTSPEED_CLIENT_ID,
      client_secret: process.env.LIGHTSPEED_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.LIGHTSPEED_REDIRECT_URI,
    };

    console.log('Exchanging code for tokens...');
    console.log('State:', state);

    // POST request to Lightspeed token endpoint
  const response = await fetch('https://cloud.lightspeedapp.com/oauth/access_token.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    client_id: process.env.LIGHTSPEED_CLIENT_ID!,
    client_secret: process.env.LIGHTSPEED_CLIENT_SECRET!,
    code,
    grant_type: 'authorization_code',
    redirect_uri: process.env.LIGHTSPEED_REDIRECT_URI!,
  }),
});


    const responseData = await response.json();

    if (!response.ok) {
      console.error('Token exchange failed:', responseData);
      return NextResponse.json(
        { error: 'Token exchange failed', details: responseData },
        { status: response.status }
      );
    }

    console.log('🔑 Token exchange successful!');
    console.log('Access Token:', responseData.access_token ? 'Present' : 'Missing');

    // Here you would typically save the tokens to your database
    // For now, just return the success response
    
    // TODO: Save tokens to database
    // await saveTokensToDatabase(user.id, responseData);

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Lightspeed',
      // Don't return the actual tokens to the frontend for security
      hasAccessToken: !!responseData.access_token,
      hasRefreshToken: !!responseData.refresh_token
    });

  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}