// src/app/api/lightspeed/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getValidLightspeedToken } from '@/lib/lightspeed/token';

export async function GET(request: NextRequest) {
  try {
    console.log(request) // REMOVE THIS WHEN HAVE REAL REQUESTS!
    
    // Use service user (userId = 1) for system-wide Lightspeed access
    const userId = 1;
    const { accessToken, accountId } = await getValidLightspeedToken(userId);
    
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Cap at 100 for safety
    
    let apiUrl: string;
    
    if (itemId) {
      // Fetch specific item by ID
      apiUrl = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${itemId}.json`;
    } else {
      // Fetch multiple items with limit
      apiUrl = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item.json?limit=${limit}`;
    }
    
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
    const items = data.Item ? (Array.isArray(data.Item) ? data.Item : [data.Item]) : [];
    
    return NextResponse.json({ 
      items,
      count: items.length,
      ...(itemId && { itemId })
    });
  } catch (error) {
    console.error('[Lightspeed] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}