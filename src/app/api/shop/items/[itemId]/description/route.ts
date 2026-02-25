import { NextRequest, NextResponse } from 'next/server';
import { getValidLightspeedToken } from '@/lib/lightspeed/token';

export const runtime = 'nodejs';
export const maxDuration = 10; 

interface LightspeedItemDetails {
  itemId: string;
  description: string; 
  ItemECommerce?: {
    shortDescription: string;
    longDescription: string;
  };
}

/**
 * Handles GET requests for item descriptions.
 * Path: /api/shop/items/[id]/description
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  // Ensure the ID is being pulled from the dynamic route params
  const { itemId } = await params;

  if (!itemId) {
    return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
  }

  try {
    const userId = 1; 
    const { accessToken, accountId } = await getValidLightspeedToken(userId);

    // Endpoint for a single item with Ecommerce descriptions
    const url = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${itemId}.json?load_relations=["ItemECommerce"]`;

    console.log(`[Lightspeed] Fetching description for item: ${itemId}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
      // Next.js Data Cache: 1 week (604800 seconds)
      next: { revalidate: 604800 } 
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Lightspeed] Fetch failed for ${itemId}:`, errText);
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const data = await response.json();
    
    // Safety check: Lightspeed returns the item object under the "Item" key
    if (!data.Item) {
      return NextResponse.json({ error: 'Data format error from Lightspeed' }, { status: 500 });
    }

    const item: LightspeedItemDetails = data.Item;

    // Construct the clean payload
    const payload = {
      itemID: item.itemId,
      name: item.description,
      shortDescription: item.ItemECommerce?.shortDescription || '',
      longDescription: item.ItemECommerce?.longDescription || '',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: {
        // Shared Cache (Vercel Edge) for 1 week
        // stale-while-revalidate allows serving old data while fetching fresh in background
        'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
      },
    });

  } catch (error) {
    console.error('[ShopData] Error fetching item details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch item details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}