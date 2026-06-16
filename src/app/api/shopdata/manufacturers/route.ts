import { NextRequest, NextResponse } from 'next/server';
import { kvGet } from '@/lib/kv';
import { prisma } from '@/lib/prisma';

const MFRS_KEY = 'lightspeed:manufacturers';

export async function GET(request: NextRequest) {
  try {
    const cached = await kvGet(MFRS_KEY);
    if (cached) return NextResponse.json({ data: JSON.parse(cached), cached: true });

    try {
      const snapshot = await prisma.allItems.findFirst({ orderBy: { id: 'desc' } });
      if (!snapshot) return NextResponse.json({ data: [], cached: false });
      
      const items = (snapshot.allItems as any) || [];
      const itemArray = Array.isArray(items) ? items : [];
      
      const map = new Map<string, { manufacturerID: string; name: string }>();
      itemArray.forEach((it: any) => {
        const m = it?.Manufacturer || it?.manufacturer || null;
        if (m) {
          const id = String(m.manufacturerID ?? m.id ?? '');
          const name = String(m.name ?? m.description ?? '');
          if (id) map.set(id, { manufacturerID: id, name });
        }
      });
      const mfrs = Array.from(map.values());
      return NextResponse.json({ data: mfrs, cached: false });
    } catch (e) {
      console.warn('manufacturers DB fallback failed:', e);
    }

    return NextResponse.json({ data: [], cached: false });
  } catch (error) {
    console.error('manufacturers API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
