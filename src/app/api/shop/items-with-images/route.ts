import { NextResponse } from 'next/server';
import { getValidLightspeedToken } from '@/lib/lightspeed/token';
import {
  LightspeedItem,
  ItemWithImage,
  LightspeedImageResponse,
  LightspeedItemsResponse
} from '@/lib/lightspeed/types';

export async function GET(request: Request) {
  try {
    const userId = 1;
    const { accessToken, accountId } = await getValidLightspeedToken(userId);
    
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Cap at 100 for safety
    
    let items: LightspeedItem[] = [];
    
    if (itemId) {
      // Fetch specific item by ID
      const itemRes = await fetch(
        `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${itemId}.json`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );
      
      if (!itemRes.ok) {
        const errText = await itemRes.text();
        console.error('[Lightspeed] Single item fetch failed:', errText);
        return NextResponse.json({ error: 'Failed to fetch item' }, { status: 502 });
      }
      
      const itemData = await itemRes.json();
      items = itemData.Item ? [itemData.Item] : [];
    } else {
      // Fetch multiple items with limit
      const itemsRes = await fetch(
        `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item.json?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );
      
      if (!itemsRes.ok) {
        const errText = await itemsRes.text();
        console.error('[Lightspeed] Items fetch failed:', errText);
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 502 });
      }
      
      const itemsData: LightspeedItemsResponse = await itemsRes.json();
      items = itemsData.Item || [];
    }
    
    // Step 2: For each item, get its image
    const itemsWithImages: ItemWithImage[] = await Promise.all(
      items.map(async (item: LightspeedItem): Promise<ItemWithImage> => {
        try {
          const imageRes = await fetch(
            `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${item.itemID}/Image.json`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
              },
            }
          );
          
          if (!imageRes.ok) return { ...item, imageUrl: null };
          
          const imageJson: LightspeedImageResponse = await imageRes.json();
          const image = imageJson?.Image;
          
          // Some items may have no image
          const imageUrl =
            image?.baseImageURL && image?.publicID
              ? `${image.baseImageURL}/w_300,h_300,c_fill/${image.publicID}.jpg`
              : null;
          
          return { ...item, imageUrl };
        } catch (imageErr) {
          console.warn(`No image for item ${item.itemID}:`, imageErr);
          return { ...item, imageUrl: null };
        }
      })
    );
    
    return NextResponse.json({ 
      items: itemsWithImages,
      count: itemsWithImages.length,
      ...(itemId && { itemId })
    });
  } catch (error) {
    console.error('[Lightspeed] Unexpected error (items-with-images):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}