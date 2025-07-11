// src/app/api/lightspeed/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getValidLightspeedToken } from '@/lib/lightspeed/token';
import { 
  LightspeedCategory, 
  LightspeedCategoriesResponse 
} from '@/lib/lightspeed/types';

export async function GET(request: NextRequest) {
  try {
    // Use service user (userId = 1) for system-wide Lightspeed access
    const userId = 1;
    const { accessToken, accountId } = await getValidLightspeedToken(userId);
    
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    
    let apiUrl: string;
    
    if (categoryId) {
      // Fetch specific category by ID
      apiUrl = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Category/${categoryId}.json`;
    } else {
      // Fetch all categories (no limit)
      apiUrl = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Category.json`;
    }
    
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });
    
    if (!response.ok) {
      const errText = await response.text();
      console.error('[Lightspeed] Categories fetch failed:', errText);
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 502 });
    }
    
    const data: LightspeedCategoriesResponse = await response.json();
    const categories: LightspeedCategory[] = data.Category ? (Array.isArray(data.Category) ? data.Category : [data.Category]) : [];
    
    return NextResponse.json({
      categories,
      count: categories.length,
      ...(categoryId && { categoryId })
    });
  } catch (error) {
    console.error('[Lightspeed] Unexpected error (categories):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}