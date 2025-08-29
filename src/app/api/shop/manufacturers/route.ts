// src/app/api/lightspeed/manufacturers/route.ts
// FYI API DOC: https://developers.lightspeedhq.com/retail/endpoints/Manufacturer/
import { NextRequest, NextResponse } from 'next/server';
import { getValidLightspeedToken } from '@/lib/lightspeed/token';

export interface LightspeedManufacturer {
  manufacturerID: string;
  name: string;
  createTime: string;
  timeStamp: string;
}

export interface LightspeedManufacturersResponse {
  Manufacturer?: LightspeedManufacturer[] | LightspeedManufacturer;
}

export async function GET(request: NextRequest) {
  try {
    const userId = 1; // system-wide Lightspeed access
    const { accessToken, accountId } = await getValidLightspeedToken(userId);

    const { searchParams } = new URL(request.url);
    const manufacturerId = searchParams.get('manufacturerId');

    let apiUrl: string;

    if (manufacturerId) {
      // Fetch single manufacturer
      apiUrl = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Manufacturer/${manufacturerId}.json`;
    } else {
      // Fetch all manufacturers
      apiUrl = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Manufacturer.json`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Lightspeed] Manufacturers fetch failed:', errText);
      return NextResponse.json({ error: 'Failed to fetch manufacturers' }, { status: 502 });
    }

    const data: LightspeedManufacturersResponse = await response.json();
    const manufacturers: LightspeedManufacturer[] = data.Manufacturer
      ? Array.isArray(data.Manufacturer)
        ? data.Manufacturer
        : [data.Manufacturer]
      : [];

    return NextResponse.json({
      manufacturers,
      count: manufacturers.length,
      ...(manufacturerId && { manufacturerId }),
    });
  } catch (error) {
    console.error('[Lightspeed] Unexpected error (manufacturers):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
