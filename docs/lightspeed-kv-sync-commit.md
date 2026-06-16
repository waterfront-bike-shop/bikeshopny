# Lightspeed catalog sync + KV caching

Summary
-------

Added a read-heavy catalog caching system using Vercel KV with a nightly cron sync from Lightspeed, plus a manual admin "Sync now" action.

What changed
------------

- Added `/api/cron/lightspeed-sync` — scheduled endpoint that:
  - validates `CRON_SECRET`
  - fetches all items from Lightspeed (paginated)
  - extracts categories & manufacturers
  - writes JSON snapshots to Vercel KV keys: `lightspeed:items`, `lightspeed:categories`, `lightspeed:manufacturers`
  - writes a durable snapshot to `prisma.allItems` (best-effort)
  - updates `lightspeedConnection.lastSync` and attempts on-demand ISR revalidation using `REVALIDATE_SECRET`

- Added `/api/lightspeed/sync` — admin-only POST endpoint that calls the cron endpoint internally (uses `CRON_SECRET`). Verifies JWT and `user.isAdmin` before triggering.

- Updated dashboard UI `/src/app/dashboard/page.tsx`:
  - added `Sync Now` button for admins
  - loading state and user-facing messages

- Implemented KV abstraction (`src/lib/kv.ts`) with graceful in-memory fallback for local dev.

- OAuth fixes for Lightspeed callback/token flows: use correct token endpoint `https://cloud.lightspeedapp.com/oauth/access_token.php` and support GET redirect + POST programmatic flows.

Files added/modified
-------------------

- Added: `src/app/api/cron/lightspeed-sync/route.ts`
- Added: `src/app/api/lightspeed/sync/route.ts`
- Modified: `src/app/dashboard/page.tsx`
- Modified: `src/app/api/lightspeed/callback/route.ts`
- Modified: `src/app/api/lightspeed/token/route.ts`
- Added/modified: `src/app/api/shopdata/*` (KV-first read endpoints)
- Added: `src/lib/kv.ts`

Environment variables (required)
-------------------------------

- `CRON_SECRET` — required. Example generator: `openssl rand -hex 32`.
- `REVALIDATE_SECRET` — optional, used for ISR revalidation calls.
- `NEXTAUTH_URL` — must be set to your canonical site URL (used in redirects).
- Existing Lightspeed vars: `LIGHTSPEED_CLIENT_ID`, `LIGHTSPEED_CLIENT_SECRET`, `LIGHTSPEED_REDIRECT_URI`.

Vercel notes
------------

- Vercel Cron (declared in `vercel.json` or via dashboard) runs scheduled jobs for production deployments. Preview deployments do not run the scheduled cron automatically — use manual triggering for testing (see below).
- Add the above environment variables in Vercel Project Settings under the appropriate scopes (Production / Preview / Development).

Testing & manual trigger
------------------------

- Locally (dev):
  - Add secrets to `.env.local` (e.g. `CRON_SECRET=...`) and run `npm run dev` with HTTPS enabled if needed.
  - Manually trigger cron endpoint:

```bash
curl -X POST "http://localhost:3000/api/cron/lightspeed-sync?secret=$CRON_SECRET"
```

- From an authenticated admin session (manual sync endpoint):

```bash
curl -X POST "https://<your-site>/api/lightspeed/sync" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Deployment checklist
--------------------

1. Generate secrets: `CRON_SECRET`, `REVALIDATE_SECRET`.
2. Add environment variables to Vercel (Production; add to Preview if you want manual testing via preview deployments).
3. Add cron entry in `vercel.json` (or create scheduled job in Vercel UI):

```json
{
  "crons": [{ "path": "/api/cron/lightspeed-sync", "schedule": "0 0 * * *" }]
}
```

4. Deploy; confirm `/api/lightspeed/sync` works for an admin user and that `/api/cron/lightspeed-sync` runs on schedule (or trigger manually to test).

Security notes
--------------

- No secrets are logged or returned to clients.
- `CRON_SECRET` is validated server-side; the manual sync endpoint does not expose it to the client.

Contact
-------
If anything needs to be reverted or changed (e.g., KV key names, snapshot schema), ping me and I will open a targeted PR.
