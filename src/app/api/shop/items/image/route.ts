// src/app/api/shop/items/[itemId]/image/route.ts
import { NextResponse } from "next/server";
import { getValidLightspeedToken } from "@/lib/lightspeed/token";
import { LightspeedImageResponse } from "@/lib/lightspeed/types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch the first image for a given item from Lightspeed
 */
async function fetchItemImage(
  itemId: string,
  accessToken: string,
  accountId: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${itemId}/Image.json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`Failed to fetch image for item ${itemId}: ${res.statusText}`);
      return null;
    }

    const data: LightspeedImageResponse = await res.json();
    const image = Array.isArray(data?.Image) ? data.Image[0] : data?.Image;

    if (image?.baseImageURL && image?.publicID) {
      // Build Cloudinary URL with optional settings
      return `${image.baseImageURL}/w_300,h_300,c_fill/${image.publicID}.jpg`;
    }

    return null;
  } catch (error) {
    console.error(`[Lightspeed] Error fetching image for item ${itemId}:`, error);
    return null;
  }
}

export const GET = async (
  request: Request,
  context: { params: { itemId: string } }
) => {
  const { itemId } = context.params;

  try {
    const userId = 1; // Or dynamically determine
    let tokenData;
    const maxRetries = 3;

    // Retry token fetch on cold starts
    for (let retry = 0; retry < maxRetries && !tokenData; retry++) {
      try {
        tokenData = await getValidLightspeedToken(userId);
      } catch (err) {
        console.error(`[Lightspeed] Token fetch failed (attempt ${retry + 1}):`, err);
        await sleep(2000 * (retry + 1));
      }
    }

    if (!tokenData) {
      return NextResponse.json({ error: "Failed to retrieve Lightspeed credentials." }, { status: 500 });
    }

    const { accessToken, accountId } = tokenData;
    if (!accountId) {
      return NextResponse.json({ error: "Account ID not found" }, { status: 500 });
    }

    const imageUrl = await fetchItemImage(itemId, accessToken, accountId);

    if (!imageUrl) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("[Lightspeed] Unexpected error fetching item image:", error);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 }
    );
  }
};
