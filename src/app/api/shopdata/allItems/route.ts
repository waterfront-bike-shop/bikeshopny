import { NextRequest, NextResponse } from 'next/server';
import { kvGet } from '@/lib/kv';
import { prisma } from '@/lib/prisma';

const ITEMS_KEY = 'lightspeed:items';

export async function GET(request: NextRequest) {
  try {
    const cached = await kvGet(ITEMS_KEY);
    if (cached) {
      return NextResponse.json({ data: JSON.parse(cached), cached: true });
    }

    // Fallback to DB snapshot
    try {
      const snapshot = await prisma.allItems.findFirst({ orderBy: { id: 'desc' } });
      if (snapshot && snapshot.allItems) {
        return NextResponse.json({ data: snapshot.allItems, cached: false });
      }
    } catch (e) {
      console.warn('DB fallback failed for allItems:', e);
    }

    return NextResponse.json({ data: [], cached: false });
  } catch (error) {
    console.error('allItems API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
