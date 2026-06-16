import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LightspeedTokenManager } from '@/lib/lightspeed-token-manager';
import { kvSet } from '@/lib/kv';

const ITEMS_KEY = 'lightspeed:items';
const CATS_KEY = 'lightspeed:categories';
const MFRS_KEY = 'lightspeed:manufacturers';

async function fetchAllItems(accountId: string, accessToken: string) {
  const limit = 100;
  let offset = 0;
  const all: any[] = [];

  while (true) {
    const url = `https://api.lightspeedapp.com/API/Account/${accountId}/Item.json?limit=${limit}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Lightspeed items fetch failed: ${res.status} ${text}`);
    }

    const json = await res.json();
    const items = json?.Item || json || [];
    if (!items || items.length === 0) break;

    all.push(...items);
    offset += limit;
    // small safety — break if insane
    if (offset > 10000) break;
  }

  return all;
}

function extractCategories(items: any[]) {
  const map = new Map<string, { categoryID: string; name: string }>();
  for (const it of items) {
    const cat = it?.Category || it?.category || null;
    if (cat) {
      const id = String(cat.categoryID ?? cat.id ?? cat.categoryId ?? '');
      const name = String(cat.name ?? cat.description ?? '');
      if (id) map.set(id, { categoryID: id, name });
    }
  }
  return Array.from(map.values());
}

function extractManufacturers(items: any[]) {
  const map = new Map<string, { manufacturerID: string; name: string }>();
  for (const it of items) {
    const m = it?.Manufacturer || it?.manufacturer || null;
    if (m) {
      const id = String(m.manufacturerID ?? m.id ?? '');
      const name = String(m.name ?? m.description ?? '');
      if (id) map.set(id, { manufacturerID: id, name });
    }
  }
  return Array.from(map.values());
}

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const secretHeader = request.headers.get('x-cron-secret') || '';
    const url = new URL(request.url);
    const secretQuery = url.searchParams.get('secret') || '';
    const secret = process.env.CRON_SECRET || '';

    if (!secret || (secretHeader !== secret && secretQuery !== secret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find any active Lightspeed connection
    const connection = await prisma.lightspeedConnection.findFirst({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } });
    if (!connection) {
      return NextResponse.json({ error: 'No active Lightspeed connection found' }, { status: 404 });
    }

    const userId = connection.userId;
    const tokenData = await LightspeedTokenManager.getValidToken(userId);
    if (!tokenData) {
      return NextResponse.json({ error: 'Unable to resolve valid Lightspeed token' }, { status: 500 });
    }

    const items = await fetchAllItems(tokenData.accountId, tokenData.accessToken);

    // persist to KV
    await kvSet(ITEMS_KEY, JSON.stringify(items));

    const cats = extractCategories(items);
    const mfrs = extractManufacturers(items);

    await kvSet(CATS_KEY, JSON.stringify(cats));
    await kvSet(MFRS_KEY, JSON.stringify(mfrs));

    // persist snapshot to DB for durable history (best-effort; schema may vary)
    try {
      await prisma.allItems.create({ data: { allItems: items as any } });
    } catch (e) {
      console.warn('Failed to persist AllItems snapshot to DB:', e);
    }

    // update lastSync on connection
    await prisma.lightspeedConnection.update({ where: { id: connection.id }, data: { lastSync: new Date() } });

    // Optionally revalidate pages — call on-demand revalidation for catalog routes
    try {
      // Vercel Next.js on-demand revalidate requires calling internal route; we attempt to hit it if available
      const revalidateRes = await fetch(`${process.env.NEXTAUTH_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=/catalog`, { method: 'POST' });
      if (!revalidateRes.ok) {
        console.warn('Revalidate call failed', await revalidateRes.text());
      }
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, itemsCount: items.length });
  } catch (error) {
    console.error('Cron sync error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
