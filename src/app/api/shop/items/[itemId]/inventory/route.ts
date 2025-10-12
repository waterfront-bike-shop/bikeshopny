// src/app/api/shop/items/[itemId]/inventory/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getValidLightspeedToken } from "@/lib/lightspeed/token";

// helper: backoff sleep
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- fetch inventory for a given item ---
async function fetchItemInventory(
  itemId: string,
  accessToken: string,
  accountId: string
): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item/${itemId}.json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        // inventory is more volatile, so don’t cache long
        next: { revalidate: 60 }, // revalidate every 1 min
      }
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(`[Lightspeed] inventory fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();

    // Item → ItemShops → [ { qoh: "12" } ]
    const shopData = Array.isArray(data?.Item?.ItemShops?.ItemShop)
      ? data.Item.ItemShops.ItemShop[0]
      : data?.Item?.ItemShops?.ItemShop;

    if (!shopData) return null;

    const qoh = parseInt(shopData.qoh, 10);
    return isNaN(qoh) ? null : qoh;
  } catch (err) {
    console.error(`[Lightspeed] error fetching inventory for ${itemId}:`, err);
    return null;
  }
}

// --- GET handler ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;

  try {
    const userId = 1; // replace with real user/account selection if needed
    let tokenData;
    const maxRetries = 3;

    for (let retry = 0; retry < maxRetries && !tokenData; retry++) {
      try {
        tokenData = await getValidLightspeedToken(userId);
      } catch (err) {
        console.error(`[Lightspeed] token fetch failed (attempt ${retry + 1}):`, err);
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

    const qoh = await fetchItemInventory(itemId, accessToken, accountId);

    if (qoh === null) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    return NextResponse.json({ quantityAvailable: qoh });
  } catch (err) {
    console.error("[Lightspeed] unexpected error fetching inventory:", err);
    return NextResponse.json(
      { error: "Internal server error fetching inventory." },
      { status: 500 }
    );
  }
}