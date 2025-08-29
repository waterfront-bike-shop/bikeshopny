// src/app/api/shop/items/[itemId]/route.ts
import { NextResponse } from "next/server";
import { getValidLightspeedToken } from "@/lib/lightspeed/token";
import {
  LightspeedItem,
  ItemWithImage,
  LightspeedImageResponse,
} from "@/lib/lightspeed/types";

export const maxDuration = 300;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface ItemResponse {
  Item: LightspeedItem;
}

/**
 * Fetch a single item's details, including its image.
 */
async function fetchSingleItem(
  itemId: string,
  accessToken: string,
  accountId: string
): Promise<ItemWithImage | null> {
  try {
    // Fetch item details
    const itemRes = await fetch(
      `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${itemId}.json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        next: { revalidate: 86400 },
      }
    );

    if (!itemRes.ok) {
      if (itemRes.status === 404) return null;
      console.error(`Failed to fetch item ${itemId}: ${itemRes.statusText}`);
      return null;
    }

    const itemJson: ItemResponse = await itemRes.json();
    const item = itemJson.Item;

    // Fetch item image
    const imageRes = await fetch(
      `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${itemId}/Image.json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        next: { revalidate: 86400 },
      }
    );

    let imageUrl: string | null = null;
    if (imageRes.ok) {
      const imageJson: LightspeedImageResponse = await imageRes.json();
      const image = Array.isArray(imageJson?.Image)
        ? imageJson.Image[0]
        : imageJson?.Image;

      if (image?.baseImageURL && image?.publicID) {
        imageUrl = `${image.baseImageURL}/w_300,h_300,c_fill/${image.publicID}.jpg`;
      }
    }

    return { ...item, imageUrl } as ItemWithImage;
  } catch (error) {
    console.error(`[Lightspeed] Error fetching item ${itemId}:`, error);
    return null;
  }
}

// ------------------------
// GET Handler
// ------------------------
export const GET = async (
  request: Request,
  context: { params: Promise<{ itemId: string }> }
) => {
  // Await the params promise
  const { itemId } = await context.params;

  try {
    const userId = 1;
    let tokenData;
    const maxRetries = 3;

    for (let retry = 0; retry < maxRetries && !tokenData; retry++) {
      try {
        tokenData = await getValidLightspeedToken(userId);
      } catch (err) {
        console.error(`[Lightspeed] Token fetch failed (attempt ${retry + 1}):`, err);
        await sleep(2000 * (retry + 1));
      }
    }

    if (!tokenData) {
      return NextResponse.json(
        { error: "Failed to retrieve Lightspeed credentials." },
        { status: 500 }
      );
    }

    const { accessToken, accountId } = tokenData;

    if (!accountId) {
      return NextResponse.json({ error: "Account ID not found" }, { status: 500 });
    }

    const itemWithImage = await fetchSingleItem(itemId, accessToken, accountId);

    if (!itemWithImage) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(itemWithImage);
  } catch (error) {
    console.error("[Lightspeed] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 }
    );
  }
};