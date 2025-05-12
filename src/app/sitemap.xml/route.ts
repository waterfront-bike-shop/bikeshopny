import { GetServerSideProps } from 'next';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
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
    // Switch to monthly once Develpment is complete
  ];

  // LOGIC FOR DYNAMIC LINKS WHEN USED
  /////////////////// TK ////////

  const stream = new SitemapStream({ hostname: 'https://www.bikerentalny.com' });
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then((data) => data.toString());

  res.setHeader('Content-Type', 'application/xml');
  res.write(xml);
  res.end();

  return {
    props: {},
  };
};

// // Doesn't render so you don;t need it, I think...
// export default function Sitemap() {
//   return null;
// }