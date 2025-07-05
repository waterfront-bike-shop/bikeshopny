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

## Admin Dashboard

In Progress: 
- Check the Lightspeed Integration.
- Reconnect to Lightspeed OAuth
- Basic CMS for site

