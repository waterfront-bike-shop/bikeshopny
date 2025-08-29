// src/app/api/shop/items-with-images/route.ts
import { NextResponse } from "next/server";
import { getValidLightspeedToken } from "@/lib/lightspeed/token";
import {
  LightspeedItem,
  ItemWithImage,
  LightspeedImageResponse,
  LightspeedItemsResponse,
} from "@/lib/lightspeed/types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch item images in batches to avoid too many parallel requests
 */
async function fetchImagesInBatches(
  items: LightspeedItem[],
  accessToken: string,
  accountId: string,
  batchSize = 20,
  delayMs = 100
): Promise<ItemWithImage[]> {
  const result: ItemWithImage[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (item): Promise<ItemWithImage> => {
        try {
          const res = await fetch(
            `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${item.itemID}/Image.json`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
              },
            }
          );

          if (!res.ok) return { ...item, imageUrl: null };

          const imageJson: LightspeedImageResponse = await res.json();
          const image = imageJson?.Image;

          const imageUrl =
            image?.baseImageURL && image?.publicID
              ? `${image.baseImageURL}/w_300,h_300,c_fill/${image.publicID}.jpg`
              : null;

          return { ...item, imageUrl };
        } catch (err) {
          console.warn(`No image for item ${item.itemID}:`, err);
          return { ...item, imageUrl: null };
        }
      })
    );

    result.push(...batchResults);
    await sleep(delayMs);
  }

  return result;
}

export const GET = async () => {
  try {
    const userId = 1;
    const { accessToken, accountId } = await getValidLightspeedToken(userId);

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID not found" },
        { status: 500 }
      );
    }

    const allItems: LightspeedItem[] = [];
    let nextUrl: string | null = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item.json?limit=100`;

    while (nextUrl) {
      const res = await fetch(nextUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        next: { revalidate: 86400 }, // <-- server caching & revalidate once per day
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[Lightspeed] Fetch failed for URL: ${nextUrl}`, errText);
        return NextResponse.json(
          { error: `Failed to fetch items. Lightspeed API responded with status ${res.status}` },
          { status: 502 }
        );
      }

      const data: LightspeedItemsResponse & { "@attributes"?: { next?: string } } =
        await res.json();

      // Ensure data.Item is an array before pushing.
      const fetchedItems = Array.isArray(data.Item) ? data.Item : (data.Item ? [data.Item] : []);

      if (fetchedItems.length) {
        allItems.push(...fetchedItems);
      }

      // Lightspeed's `next` attribute can sometimes return a full URL or an empty string.
      // Use the URL constructor to handle both cases gracefully.
      const nextRelativeUrl = data["@attributes"]?.next;
      if (nextRelativeUrl) {
        const baseUrl = 'https://api.lightspeedapp.com';
        nextUrl = new URL(nextRelativeUrl, baseUrl).toString();
      } else {
        nextUrl = null;
      }
      
      // Add a brief delay to avoid hitting API rate limits during pagination.
      await sleep(300);
    }

    const itemsWithImages = await fetchImagesInBatches(
      allItems,
      accessToken,
      accountId,
      20,
      100
    );

    return NextResponse.json(
      { items: itemsWithImages, count: itemsWithImages.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Lightspeed] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// // BELOW: ENDPOINT EACH CALL. ABOVE CACHE RESULT DAILY

// import { NextResponse } from 'next/server';
// import { getValidLightspeedToken } from '@/lib/lightspeed/token';
// import {
//   LightspeedItem,
//   ItemWithImage,
//   LightspeedImageResponse,
//   LightspeedItemsResponse
// } from '@/lib/lightspeed/types';

// export async function GET(request: Request) {
//   try {
//     const userId = 1;
//     const { accessToken, accountId } = await getValidLightspeedToken(userId);
    
//     // Parse URL parameters
//     const { searchParams } = new URL(request.url);
//     const itemId = searchParams.get('itemId');
    
//     let allItems: LightspeedItem[] = [];
    
//     if (itemId) {
//       // Fetch specific item by ID
//       const itemRes = await fetch(
//         `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${itemId}.json`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             Accept: 'application/json',
//           },
//         }
//       );
      
//       if (!itemRes.ok) {
//         const errText = await itemRes.text();
//         // Log the specific error from the Lightspeed API
//         console.error('[Lightspeed] Single item fetch failed:', itemRes.status, errText);
//         return NextResponse.json({ error: `Failed to fetch item, Lightspeed API responded with status ${itemRes.status}` }, { status: 502 });
//       }
      
//       const itemData = await itemRes.json();
//       allItems = itemData.Item ? [itemData.Item] : [];
//     } else {
//       // Paginate through all items
//       let nextUrl = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item.json`;
//       const allFetchedItems: LightspeedItem[] = [];

//       while (nextUrl) {
//         const itemsRes = await fetch(nextUrl, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             Accept: 'application/json',
//           },
//         });
        
//         if (!itemsRes.ok) {
//           const errText = await itemsRes.text();
//           // Log the specific error from the Lightspeed API
//           console.error('[Lightspeed] Items fetch failed:', itemsRes.status, errText);
//           return NextResponse.json({ error: `Failed to fetch items, Lightspeed API responded with status ${itemsRes.status}` }, { status: 502 });
//         }
        
//         const itemsData: LightspeedItemsResponse = await itemsRes.json();
//         const currentPageItems = itemsData.Item || [];
//         allFetchedItems.push(...currentPageItems);

//         // Get the URL for the next page. If it's an empty string, the loop will terminate.
//         nextUrl = itemsData['@attributes']?.next || '';
//       }
//       allItems = allFetchedItems;
//     }
    
//     // Step 2: For each item, get its image
//     const itemsWithImages: ItemWithImage[] = await Promise.all(
//       allItems.map(async (item: LightspeedItem): Promise<ItemWithImage> => {
//         try {
//           const imageRes = await fetch(
//             `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${item.itemID}/Image.json`,
//             {
//               headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 Accept: 'application/json',
//               },
//             }
//           );
          
//           if (!imageRes.ok) return { ...item, imageUrl: null };
          
//           const imageJson: LightspeedImageResponse = await imageRes.json();
//           const image = imageJson?.Image;
          
//           // Some items may have no image
//           const imageUrl =
//             image?.baseImageURL && image?.publicID
//               ? `${image.baseImageURL}/w_300,h_300,c_fill/${image.publicID}.jpg`
//               : null;
          
//           return { ...item, imageUrl };
//         } catch (imageErr) {
//           console.warn(`No image for item ${item.itemID}:`, imageErr);
//           return { ...item, imageUrl: null };
//         }
//       })
//     );
    
//     return NextResponse.json({ 
//       items: itemsWithImages,
//       count: itemsWithImages.length,
//       ...(itemId && { itemId })
//     });
//   } catch (error) {
//     console.error('[Lightspeed] Unexpected error (items-with-images):', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }