import { NextResponse } from "next/server";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

export async function GET() {
  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'weekly', priority: 0.8 },
    { url: '/contact', changefreq: 'weekly', priority: 0.5 },
    { url: '/rentals', changefreq: 'weekly', priority: 0.5 },
    { url: '/rentals/roadbikes', changefreq: 'weekly', priority: 0.5 },
    { url: '/rentals/kidsbikes', changefreq: 'weekly', priority: 0.5 },
    { url: '/rentals/citybikes', changefreq: 'weekly', priority: 0.5 },
    { url: '/shop', changefreq: 'weekly', priority: 0.5 },
    { url: '/repairs', changefreq: 'weekly', priority: 0.5 },
    // Add dynamic links logic here if needed
  ];

  // Create the sitemap stream
  const stream = new SitemapStream({ hostname: 'https://www.bikerentalny.com' });
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) => data.toString());

  // Use new Response to send plain XML response with correct header
  return new NextResponse(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml' },
  });
}
