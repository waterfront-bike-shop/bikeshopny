/*// lib/lightspeed.ts
import axios from 'axios';

const LIGHTSPEED_BASE_URL = 'https://api.lightspeedapp.com/API/V3';

export class LightspeedAPI {
  private accessToken: string;
  private accountId: string;

  constructor(accessToken: string, accountId: string) {
    this.accessToken = accessToken;
    this.accountId = accountId;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  private getBaseUrl() {
    return `${LIGHTSPEED_BASE_URL}/Account/${this.accountId}`;
  }

  // Get all items with filtering for bikes
  async getItems(params?: {
    categoryID?: string;
    load_relations?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.categoryID) queryParams.append('categoryID', params.categoryID);
      if (params?.load_relations) queryParams.append('load_relations', params.load_relations);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const response = await axios.get(
        `${this.getBaseUrl()}/Item.json?${queryParams.toString()}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  // Get categories to organize products by section
  async getCategories() {
    try {
      const response = await axios.get(
        `${this.getBaseUrl()}/Category.json`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get item images
  async getItemImages(itemId: string) {
    try {
      const response = await axios.get(
        `${this.getBaseUrl()}/Item/${itemId}/ItemImages.json`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching item images:', error);
      throw error;
    }
  }

  // Get inventory quantities
  async getItemShops(itemId: string) {
    try {
      const response = await axios.get(
        `${this.getBaseUrl()}/Item/${itemId}/ItemShops.json`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
  }
}

// OAuth helper functions
export const getAuthUrl = () => {
  const clientId = process.env.LIGHTSPEED_CLIENT_ID;
  const redirectUri = process.env.LIGHTSPEED_REDIRECT_URI;
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId!,
    redirect_uri: redirectUri!,
    scope: 'employee:inventory_read+employee:categories',
    state: 'secure_random_state_value', // You should generate this dynamically
  });

  return `https://cloud.lightspeedapp.com/auth/oauth/authorize?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string) => {
  const clientId = process.env.LIGHTSPEED_CLIENT_ID;
  const clientSecret = process.env.LIGHTSPEED_CLIENT_SECRET;

  try {
    const response = await axios.post('https://cloud.lightspeedapp.com/auth/oauth/token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    });

    return response.data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  const clientId = process.env.LIGHTSPEED_CLIENT_ID;
  const clientSecret = process.env.LIGHTSPEED_CLIENT_SECRET;

  try {
    const response = await axios.post('https://cloud.lightspeedapp.com/auth/oauth/token', {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};


// pages/api/auth/lightspeed/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { exchangeCodeForToken } from '../../../../lib/lightspeed';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    
    // In production, you'd save this to your database
    // For now, you can manually add these to your .env
    console.log('Access Token:', tokenData.access_token);
    console.log('Refresh Token:', tokenData.refresh_token);
    console.log('Expires in:', tokenData.expires_in, 'seconds');
    
    // You'll need to get the account ID from a separate API call
    res.redirect('/admin/oauth-success?message=Authorization successful! Check console for tokens.');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'OAuth exchange failed' });
  }
}

*/