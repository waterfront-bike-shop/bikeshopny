// app/page.tsx
import { FC } from 'react';
import Head from 'next/head'; // Import Head from Next.js
import Hero from './components/Hero';
import Services from './components/Services';
import Rentals from './components/Rentals';
import Contact from './components/Contact';

const HomePage: FC = () => {
  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Bicycle Rentals - Waterfront Bicycle Shop Bike Rental / Repair NYC</title>
        <meta
          name="description"
          content="We offer on the spot repairs and in depth tune ups for your bike or bicycles. We offer hybrid bike rentals and have a bike shop full of parts and accessories"
        />
        <meta name="author" content="Waterfront Bicycle Shop Bike Rental / Repair NYC" />

        {/* PWA and Apple Touch Icons */}
        {/* <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" sizes="57x57" href="/images/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/images/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/images/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/images/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/images/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/images/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/images/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon-180x180.png" /> */}

        {/* Open Graph Meta Tags */}
        <meta property="og:url" content="https://bikeshopny.com/" />
        <meta property="og:site_name" content="Waterfront Bicycle Shop Bike Rental / Repair NYC" />
        <meta property="og:title" content="Waterfront Bicycle Shop Bike Rental / Repair NYC" />
        <meta
          property="og:description"
          content="We offer on the spot repairs and in depth tune ups for your bike or bicycles. We offer hybrid bike rentals and have a bike shop full of parts and accessories"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://img1.wsimg.com/isteam/ip/5908d7da-7b85-40f0-a477-544892880bd5/47fb6dcb-0116-4cbc-8be8-9fa8a383e835.jpg"
        />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Waterfront Bicycle Shop Bike Rental / Repair NYC" />
        <meta
          name="twitter:description"
          content="We offer on the spot repairs and in depth tune ups for your bike or bicycles. We offer hybrid bike rentals and have a bike shop full of parts and accessories"
        />
        <meta
          name="twitter:image"
          content="https://img1.wsimg.com/isteam/ip/5908d7da-7b85-40f0-a477-544892880bd5/47fb6dcb-0116-4cbc-8be8-9fa8a383e835.jpg"
        />
        <meta name="twitter:image:alt" content="Waterfront Bicycle Shop Bike Rental / Repair NYC" />

        {/* Theme Color */}
        <meta name="theme-color" content="rgb(0, 117, 193)" />
      </Head>

      <div className="container mx-auto p-4">
        <Hero />  {/* Hero component */}
        <Services />
        <Rentals />
        <Contact />
      </div>
    </>
  );
};

export default HomePage;
