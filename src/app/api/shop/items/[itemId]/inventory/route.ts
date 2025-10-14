import { NextResponse } from "next/server";
import { getValidLightspeedToken } from "@/lib/lightspeed/token";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface ItemShop {
  shopID: string | number;
  qoh: string | number;
  [key: string]: unknown;
}

async function fetchItemInventory(
  itemId: string,
  accessToken: string,
  accountId: string
): Promise<number> {
  try {
    const res = await fetch(
      `https://api.lightspeedapp.com/API/V3/Account/${accountId}/ItemShop.json?itemID=${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      if (res.status === 404) return 0;
      console.error(`[Lightspeed] ItemShop fetch failed: ${res.status} ${res.statusText}`);
      return 0;
    }

    const data = await res.json();

    const shops: ItemShop[] = Array.isArray(data?.ItemShop)
      ? data.ItemShop
      : data?.ItemShop
      ? [data.ItemShop]
      : [];

    if (shops.length === 0) return 0;

    const summary = shops.find((s) => parseInt(String(s.shopID), 10) === 0) || shops[0];
    const qoh = parseInt(String(summary.qoh), 10);
    return isNaN(qoh) ? 0 : qoh;
  } catch (err) {
    console.error(`[Lightspeed] Error fetching inventory for ${itemId}:`, err);
    return 0;
  }
}

// --- GET handler ---
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/");
    const itemId = segments[segments.indexOf("items") + 1]; // reliably grab dynamic param

    if (!itemId) {
      return NextResponse.json({ error: "Missing itemId parameter." }, { status: 400 });
    }

    const userId = 1;
    let tokenData: { accessToken: string; accountId: string | null } | null = null;
    const maxRetries = 3;

    for (let retry = 0; retry < maxRetries && !tokenData; retry++) {
      try {
        tokenData = await getValidLightspeedToken(userId);
      } catch (err) {
        console.error(`[Lightspeed] Token fetch failed (attempt ${retry + 1}):`, err);
        await sleep(2000 * (retry + 1));
      }
    }

    if (!tokenData || !tokenData.accountId) {
      return NextResponse.json({ error: "Lightspeed credentials not found." }, { status: 500 });
    }

    const { accessToken, accountId } = tokenData;

    const quantityAvailable = await fetchItemInventory(itemId, accessToken, accountId);

    return NextResponse.json({ quantityAvailable });
  } catch (err) {
    console.error("[Lightspeed] Unexpected error fetching inventory:", err);
    return NextResponse.json(
      { error: "Internal server error fetching inventory." },
      { status: 500 }
    );
  }
}
