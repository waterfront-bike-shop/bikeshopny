# Waterfront Bicycle Shop

Next.js frontend with Bike Rental Manager integration and (TBD) Lightspeed Integration

## Deploying site
1. First, test out on Netlify
2. For Production, trying Vercel and a Pro Account.
   1. Sign up with email
3. Neon Database - PostgreSQL


## Site SEO Optimization
- Issue: SEO has dropped since changing the site from GoDaddy site buil📚 der to Next.JS hosted on Vercel.
- Steps/Attempts to fix...
  1. Generate a Sitemap, Next style.
    - Create an app/sitemap.xml folder with route.ts -- So it becomes available at https://yoursite.com/sitemap.xml — which is what search engines expect.
     - `mkdir -p app/sitemap.xml`
     - `mv app/sitemap.ts app/sitemap.xml/route.ts`
   - Add Dynamic Routes (when they exist!)
   - Optional: Add changefreq and priority (for SEO hints)
  2. Add some JSON and aria tags onto rentals
  3. Add sitemap to Google Search Console.

## Prisma/DB

In Vercel dashboard (or vercel.json), set the Build Command to:
`npm run migrate:deploy && npm run build`

Development: Run locally on PSQL on machine access via localhost, etc.

## Auth/Admin

Argon2 for hashing password. Low number of users (admin only) so memory and time usage ok. 
DEV:
For OAuth2 with Lightspeed need to run an https server. Do that with mkcert. Install with mkcert localhost 127.0.0.1 ::1 in project dir.

Lightspeed API: `https://developers.lightspeedhq.com/retail/introduction/introduction/`

## Admin Dashboard

In Progress: 
- Check the Lightspeed Integration.
- Reconnect to Lightspeed OAuth
- Basic CMS for site

## API Design

- Lightspeed OAuth all in one folder
- Auth for internal i.e. admin access in one folder
- Shop/ for everything product related, rather than Lightspeed, in order to abstract the source, and leave it open for caching product locally OR for a different POS provider, etc. A user does not need to know that this data is from Lightspeed via an API call or client-side network traffic, etc.