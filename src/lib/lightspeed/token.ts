// src/lib/lightspeed/token.ts
import { prisma } from '@/lib/prisma';

export async function getValidLightspeedToken(userId: number) {
  const connection = await prisma.lightspeedConnection.findUnique({
    where: { userId },
  });

  if (!connection || !connection.isActive) {
    throw new Error('No active Lightspeed connection found');
  }

  const now = new Date();
  let { accessToken, refreshToken, expiresAt, accountId } = connection;
  // let vs const error 'solved' below for the linter...
  accountId = accountId

  if (expiresAt > now) {
    return { accessToken, accountId };
  }

  // Token expired — attempt refresh
  console.log(`[Lightspeed] Access token expired for user ${userId} — refreshing`);

  const refreshParams = new URLSearchParams({
    client_id: process.env.LIGHTSPEED_CLIENT_ID!,
    client_secret: process.env.LIGHTSPEED_CLIENT_SECRET!,
    grant_type: 'refresh_token',
    refresh_token: refreshToken!,
  });

  const refreshResponse = await fetch('https://cloud.lightspeedapp.com/oauth/access_token.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: refreshParams,
  });

  if (!refreshResponse.ok) {
    const errorText = await refreshResponse.text();
    console.error(`[Lightspeed] Token refresh failed for user ${userId}:`, errorText);
    throw new Error(`Lightspeed token refresh failed: ${refreshResponse.status}`);
  }

  const refreshed = await refreshResponse.json();

  accessToken = refreshed.access_token;
  refreshToken = refreshed.refresh_token || refreshToken;
  expiresAt = new Date(Date.now() + (refreshed.expires_in || 3600) * 1000);

  await prisma.lightspeedConnection.update({
    where: { userId },
    data: {
      accessToken,
      refreshToken,
      expiresAt,
      lastSync: new Date(),
    },
  });

  console.log(`[Lightspeed] Token refreshed successfully for user ${userId}`);

  return { accessToken, accountId };
}
