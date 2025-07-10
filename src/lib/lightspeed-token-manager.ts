// src/lib/lightspeed-token-manager.ts
import { prisma } from '@/lib/prisma';

export interface LightspeedToken {
  accessToken: string;
  refreshToken: string;
  accountId: string;
  expiresAt: Date;
  isActive: boolean;
}

export class LightspeedTokenManager {
  /**
   * Get a valid access token for a user, refreshing if necessary
   */
  static async getValidToken(userId: number): Promise<LightspeedToken | null> {
    try {
      // Get the most recent connection record for this user
      const connection = await prisma.lightspeedConnection.findFirst({
        where: { 
          userId: userId,
          isActive: true 
        },
        orderBy: { updatedAt: 'desc' }
      });

      if (!connection) {
        console.log('No Lightspeed connection found for user:', userId);
        return null;
      }

      // Check if token is still valid (with 5 minute buffer)
      const now = new Date();
      const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
      const expiresWithBuffer = new Date(connection.expiresAt.getTime() - bufferTime);

      if (now < expiresWithBuffer) {
        // Token is still valid - validate required fields
        if (!connection.accessToken || !connection.refreshToken || !connection.accountId) {
          console.error('Invalid connection data - missing required fields');
          // Mark connection as inactive if missing critical data
          await prisma.lightspeedConnection.update({
            where: { id: connection.id },
            data: { isActive: false }
          });
          return null;
        }

        return {
          accessToken: connection.accessToken,
          refreshToken: connection.refreshToken,
          accountId: connection.accountId,
          expiresAt: connection.expiresAt,
          isActive: connection.isActive
        };
      }

      // Token has expired or is about to expire, refresh it
      console.log('Token expired or expiring soon, refreshing for user:', userId);
      if (!connection.refreshToken) {
        console.error('No refresh token available');
        return null;
      }
      return await this.refreshToken(userId, connection.refreshToken);

    } catch (error) {
      console.error('Error getting valid token:', error);
      return null;
    }
  }

  /**
   * Refresh an access token using the refresh token
   */
  static async refreshToken(userId: number, refreshToken: string): Promise<LightspeedToken | null> {
    try {
      const tokenResponse = await fetch('https://cloud.lightspeedapp.com/auth/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.LIGHTSPEED_CLIENT_ID!,
          client_secret: process.env.LIGHTSPEED_CLIENT_SECRET!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token refresh failed:', tokenResponse.status, errorText);
        
        // If refresh fails, mark the connection as inactive
        await prisma.lightspeedConnection.updateMany({
          where: { userId: userId },
          data: { isActive: false }
        });
        
        return null;
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token || !tokenData.refresh_token) {
        console.error('Invalid refresh token response:', tokenData);
        return null;
      }

      const { access_token, refresh_token, expires_in } = tokenData;

      // Calculate new expiration time
      const expiresInMs = (expires_in || 3600) * 1000;
      const expiresAt = new Date(Date.now() + expiresInMs);

      // Get the account ID from the existing connection
      const existingConnection = await prisma.lightspeedConnection.findFirst({
        where: { userId: userId },
        orderBy: { updatedAt: 'desc' }
      });

      if (!existingConnection || !existingConnection.accountId) {
        console.error('No existing connection found for refresh or missing account ID');
        return null;
      }

      // Update the connection with new tokens
      const updatedConnection = await prisma.lightspeedConnection.update({
        where: { id: existingConnection.id },
        data: {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: expiresAt,
          isActive: true,
          lastSync: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log('Token refreshed successfully for user:', userId);

      return {
        accessToken: updatedConnection.accessToken!,
        refreshToken: updatedConnection.refreshToken!,
        accountId: updatedConnection.accountId!,
        expiresAt: updatedConnection.expiresAt,
        isActive: updatedConnection.isActive
      };

    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  /**
   * Make an authenticated request to the Lightspeed API
   */
  static async makeAuthenticatedRequest(userId: number, endpoint: string, options: RequestInit = {}): Promise<Response | null> {
    try {
      const tokenData = await this.getValidToken(userId);
      
      if (!tokenData) {
        console.error('No valid token available for API request');
        return null;
      }

      const response = await fetch(`https://api.lightspeedapp.com/API/${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      return response;
    } catch (error) {
      console.error('Error making authenticated request:', error);
      return null;
    }
  }

  /**
   * Check if user has an active Lightspeed connection
   */
  static async hasActiveConnection(userId: number): Promise<boolean> {
    try {
      const connection = await prisma.lightspeedConnection.findFirst({
        where: { 
          userId: userId,
          isActive: true 
        },
        orderBy: { updatedAt: 'desc' }
      });

      return !!connection;
    } catch (error) {
      console.error('Error checking connection status:', error);
      return false;
    }
  }

  /**
   * Revoke and deactivate a user's Lightspeed connection
   */
  static async revokeConnection(userId: number): Promise<boolean> {
    try {
      // Mark all connections as inactive
      await prisma.lightspeedConnection.updateMany({
        where: { userId: userId },
        data: { isActive: false }
      });

      console.log('Connection revoked for user:', userId);
      return true;
    } catch (error) {
      console.error('Error revoking connection:', error);
      return false;
    }
  }
}