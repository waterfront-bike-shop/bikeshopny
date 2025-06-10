import { NextResponse } from "next/server";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

export async function GET() {
  // Get the current date in the format YYYY-MM-DD
  const currentDate = new Date().toISOString().split('T')[0];

  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0, lastmod: currentDate },
    { url: '/about', changefreq: 'weekly', priority: 0.8, lastmod: currentDate },
    { url: '/rentals', changefreq: 'weekly', priority: 0.5, lastmod: currentDate },
    // Remove links below because of 'Duplicate without user-selected canonical' error with Google Search Console, i.e. similar content!
    // { url: '/rentals/roadbikes', changefreq: 'weekly', priority: 0.5, lastmod: currentDate },
    // { url: '/rentals/kidsbikes', changefreq: 'weekly', priority: 0.5, lastmod: currentDate },
    // { url: '/rentals/citybikes', changefreq: 'weekly', priority: 0.5, lastmod: currentDate },
    { url: '/shop', changefreq: 'weekly', priority: 0.5, lastmod: currentDate },
    { url: '/repairs', changefreq: 'weekly', priority: 0.5, lastmod: currentDate },
    // Add dynamic links logic here if needed
  ];

  // Create the sitemap stream
  const stream = new SitemapStream({ hostname: 'https://www.bikeshopny.com' });
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) => data.toString());

  // Use new Response to send plain XML response with correct header
  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  });
}
