// src/app/api/lightspeed/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getValidLightspeedToken } from '@/lib/lightspeed/token';

export async function GET(request: NextRequest) {
  try {
    console.log(request) // REMOVE THIS WHEN HAVE REAL REQUESTS!
    // Use service user (userId = 1) for system-wide Lightspeed access
    const userId = 1;
    const { accessToken, accountId } = await getValidLightspeedToken(userId);

    // Fetch 10 items from Lightspeed
    const apiUrl = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item.json?limit=10`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Lightspeed] Fetch failed:', errText);
      return NextResponse.json({ error: 'Failed to fetch items' }, { status: 502 });
    }

    const data = await response.json();

    return NextResponse.json({ items: data.Item });

  } catch (error) {
    console.error('[Lightspeed] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
