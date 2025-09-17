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

export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  const typeParam = params.type

  if (!isShopDataType(typeParam)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  // Fetch the most recent row
  const data = await prisma.shopData.findFirst({
    where: { type: typeParam },
    orderBy: { timestamp: 'desc' },
  })

  if (!data) {
    return NextResponse.json({ error: 'No data found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
