// src/app/api/lightspeed/tags/route.ts

/*
TO-DO: Add in tags like this:
ux:featured	        Highlight in carousels, collections, etc.
ux:homepage	        Appear in special homepage section
ux:sale	            Temporary promotion, even if price doesn't change
ux:hide-from-web    Don't show this item in frontend UI
ux:archive	        Soft-deprecated but not technically "archived" in Lightspeed
*/ 


import { NextRequest, NextResponse } from 'next/server';
import { getValidLightspeedToken } from '@/lib/lightspeed/token';
import {
  LightspeedTag,
  LightspeedTagsResponse
} from '@/lib/lightspeed/types';

export async function GET(request: NextRequest) {
  try {
    // Use service user (userId = 1) for system-wide Lightspeed access
    const userId = 1;
    const { accessToken, accountId } = await getValidLightspeedToken(userId);

    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');
    const name = searchParams.get('name');

    let apiUrl: string;
    let tags: LightspeedTag[] = [];

    if (tagId) {
      // Fetch specific tag by ID
      apiUrl = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Tag/${tagId}.json`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[Lightspeed] Tag fetch failed:', errText);
        return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 502 });
      }

      const data: LightspeedTagsResponse = await response.json();
      tags = data.Tag
        ? Array.isArray(data.Tag)
          ? data.Tag
          : [data.Tag]
        : [];
    } else {
      // Fetch all tags
      apiUrl = `https://api.lightspeedapp.com/API/V3/Account/${accountId}/Tag.json`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[Lightspeed] Tags fetch failed:', errText);
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 502 });
      }

      const data: LightspeedTagsResponse = await response.json();
      
      // Handle the Tag property which can be either a single object or array
      let allTags: LightspeedTag[] = [];
      if (data.Tag) {
        allTags = Array.isArray(data.Tag) ? data.Tag : [data.Tag];
      }

      // Filter by name if provided
      if (name) {
        tags = allTags.filter(tag =>
          tag.name.toLowerCase().includes(name.toLowerCase())
        );
      } else {
        tags = allTags;
      }
    }

    return NextResponse.json({
      tags,
      count: tags.length,
      ...(tagId && { tagId }),
      ...(name && { searchName: name })
    });
  } catch (error) {
    console.error('[Lightspeed] Unexpected error (tags):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}