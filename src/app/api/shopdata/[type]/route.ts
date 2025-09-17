import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

enum ShopDataType {
  allItems = 'allItems',
  categories = 'categories',
  tags = 'tags',
  manufacturers = 'manufacturers',
  allImages = 'allImages',
  imageDownloadFilelist = 'imageDownloadFilelist',
}

// Type guard
function isShopDataType(value: string): value is ShopDataType {
  return Object.values(ShopDataType).includes(value as ShopDataType)
}

// ISR: revalidate every 1 day (86400 seconds)
export const revalidate = 86400;

// Correct Next.js GET handler — just use one argument
export async function GET(req: NextRequest) {
  // params are accessible via req.nextUrl.pathname or URLSearchParams
  // for dynamic route `[type]`, you can parse from the URL
  const url = new URL(req.url)
  const typeParam = url.pathname.split('/').pop() || ''

  if (!isShopDataType(typeParam)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  const data = await prisma.shopData.findFirst({
    where: { type: typeParam },
    orderBy: { timestamp: 'desc' },
  })

  if (!data) {
    return NextResponse.json({ error: 'No data found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
