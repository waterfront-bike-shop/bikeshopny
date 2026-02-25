import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getValidLightspeedToken } from '@/lib/lightspeed/token'

enum ShopDataType {
  allItems = 'allItems',
  categories = 'categories',
  tags = 'tags',
  manufacturers = 'manufacturers',
  allImages = 'allImages',
  imageDownloadFilelist = 'imageDownloadFilelist',
}

function isShopDataType(value: string): value is ShopDataType {
  return Object.values(ShopDataType).includes(value as ShopDataType)
}

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for Pro plan
export const revalidate = 86400; // 24 hours

// Types for Lightspeed API response
interface LightspeedImage {
  imageID: string;
  publicID: string;
  baseImageURL: string;
  filename?: string;
  ordering?: string;
}

interface LightspeedItemShop {
  itemShopID: string;
  qoh: string;
  shopID: string;
}

interface LightspeedItemPrice {
  amount: string;
  useTypeID: string;
  useType: string;
}

interface LightspeedItem {
  itemID: string;
  systemSku: string;
  description: string;
  categoryID: string;
  manufacturerID: string;
  modelYear?: string;
  upc?: string;
  manufacturerSku?: string;
  customSku?: string;
  Images?: {
    Image?: LightspeedImage | LightspeedImage[];
  };
  ItemShops: {
    ItemShop: LightspeedItemShop | LightspeedItemShop[];
  };
  Prices: {
    ItemPrice: LightspeedItemPrice[];
  };
}

// Our simplified item structure for the frontend
interface SimplifiedItem {
  itemID: string;
  systemSku: string;
  description: string;
  categoryID: string;
  manufacturerID: string;
  modelYear?: string;
  upc?: string;
  manufacturerSku?: string;
  customSku?: string;
  qoh: number; // Total quantity on hand
  images: string[]; // Array of full Cloudinary URLs
  prices: {
    amount: string;
    useType: string;
  }[];
}

// Build full Cloudinary URL from image data
function buildImageUrl(image: LightspeedImage): string {
  const { baseImageURL, publicID } = image;
  // Use w_400,h_400,c_limit for reasonable size with aspect ratio preserved
  return `${baseImageURL}w_400,h_400,c_limit/${publicID}.jpg`;
}

// Extract images from item and build URLs
function extractImages(item: LightspeedItem): string[] {
  if (!item.Images?.Image) {
    return [];
  }

  const images = Array.isArray(item.Images.Image) 
    ? item.Images.Image 
    : [item.Images.Image];

  // Sort by ordering if available, then build URLs
  return images
    .sort((a, b) => {
      const orderA = parseInt(a.ordering || '0');
      const orderB = parseInt(b.ordering || '0');
      return orderA - orderB;
    })
    .map(img => buildImageUrl(img));
}

// Calculate total QOH across all shops
function calculateTotalQoh(item: LightspeedItem): number {
  const shops = Array.isArray(item.ItemShops.ItemShop)
    ? item.ItemShops.ItemShop
    : [item.ItemShops.ItemShop];

  return shops.reduce((total, shop) => {
    return total + parseInt(shop.qoh || '0');
  }, 0);
}

// Simplify item data to only what we need
function simplifyItem(item: LightspeedItem): SimplifiedItem {
  return {
    itemID: item.itemID,
    systemSku: item.systemSku,
    description: item.description,
    categoryID: item.categoryID,
    manufacturerID: item.manufacturerID,
    modelYear: item.modelYear,
    upc: item.upc,
    manufacturerSku: item.manufacturerSku,
    customSku: item.customSku,
    qoh: calculateTotalQoh(item),
    images: extractImages(item),
    prices: item.Prices.ItemPrice.map(p => ({
      amount: p.amount,
      useType: p.useType,
    })),
  };
}

// Fetch all pages from Lightspeed with in-stock, ecom-published items
async function fetchAllLightspeedItems(): Promise<SimplifiedItem[]> {
  const userId = 1;
  const { accessToken, accountId } = await getValidLightspeedToken(userId);
  
  const limit = 100;
  const allItems: SimplifiedItem[] = [];
  // let nextUrl: string | null = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item.json?limit=${limit}&archived=false&publishToEcom=true&load_relations=["Images","ItemShops"]&ItemShops.qoh=>,0`;
  let nextUrl: string | null = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Item.json?limit=${limit}&archived=false&publishToEcom=true&load_relations=["Images","ItemShops"]`;
  let pageCount = 0;

  console.log('[Lightspeed] Starting to fetch items...');

  while (nextUrl && pageCount < 100) { // Safety limit of 100 pages
    pageCount++;
    console.log(`[Lightspeed] Fetching page ${pageCount}...`);
    
    const response: Response = await fetch(nextUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Lightspeed] Fetch failed:', errText);
      throw new Error(`Lightspeed API error: ${response.status}`);
    }

    const data = await response.json();
    // DEBUG -- leave in for easy search, for now.
    // console.log(data)
    
    // Log total count on first request
    if (pageCount === 1 && data['@attributes']) {
      const totalCount = parseInt(data['@attributes'].count) || 0;
      console.log(`[Lightspeed] Total items available: ${totalCount}`);
    }
    
    // Extract and simplify items
    const rawItems: LightspeedItem[] = data.Item 
      ? (Array.isArray(data.Item) ? data.Item : [data.Item])
      : [];
    
    const simplifiedItems = rawItems.map(item => simplifyItem(item));
    allItems.push(...simplifiedItems);

    console.log(`[Lightspeed] Fetched ${rawItems.length} items. Total collected: ${allItems.length}`);

    // Get the next URL from the response
    nextUrl = data['@attributes']?.next || null;
    
    // If there's no next URL or we got no items, we're done
    if (!nextUrl || rawItems.length === 0) {
      break;
    }
  }

  if (pageCount >= 100) {
    console.warn('[Lightspeed] Reached safety limit of 100 pages');
  }

  console.log(`[Lightspeed] Completed fetching ${allItems.length} items across ${pageCount} pages`);
  
  return allItems;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const typeParam = url.pathname.split('/').pop() || '';

  if (!isShopDataType(typeParam)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  try {
    // Fetch allItems directly from Lightspeed API
    if (typeParam === 'allItems') {
      console.log('[ShopData] Fetching allItems from Lightspeed API...');
      const items = await fetchAllLightspeedItems();
      
      // Format response to match what Context expects: { data: [...] }
      return NextResponse.json({
        data: items,
        timestamp: new Date().toISOString(),
        type: 'allItems',
      });
    }

    // For all other types, use cached data from database
    console.log(`[ShopData] Fetching ${typeParam} from cache...`);
    const data = await prisma.shopData.findFirst({
      where: { type: typeParam },
      orderBy: { timestamp: 'desc' },
    });

    if (!data) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[ShopData] Error fetching data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}