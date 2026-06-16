import { NextRequest, NextResponse } from 'next/server';
import { kvGet } from '@/lib/kv';
import { prisma } from '@/lib/prisma';

const CATS_KEY = 'lightspeed:categories';

export async function GET() {
  try {
    const cached = await kvGet(CATS_KEY);
    if (cached) return NextResponse.json({ data: JSON.parse(cached), cached: true });

    try {
      const snapshot = await prisma.allItems.findFirst({ orderBy: { id: 'desc' } });
      if (!snapshot) return NextResponse.json({ data: [], cached: false });
      
      const snapshotData: any = snapshot.allItems;
      if (!Array.isArray(snapshotData)) {
        return NextResponse.json({ data: [], cached: false });
      }

      const map = new Map<string, { categoryID: string; name: string }>();
      snapshotData.forEach((it: any) => {
        const cat = it?.Category || it?.category;
        if (cat) {
          const id = String(cat.categoryID ?? cat.id ?? '');
          const name = String(cat.name ?? cat.description ?? '');
          if (id) map.set(id, { categoryID: id, name });
        }
      });
      const cats = Array.from(map.values());
      return NextResponse.json({ data: cats, cached: false });
    } catch (e) {
      console.warn('categories DB fallback failed:', e);
    }

    return NextResponse.json({ data: [], cached: false });
  } catch (error) {
    console.error('categories API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
