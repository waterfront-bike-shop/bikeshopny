// app/components/Meta.tsx
import Head from 'next/head';

const Meta = () => (
  <Head>
    <meta charSet="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Waterfront Bicycle Shop | NYC Rentals & Repairs</title>
    <meta
      name="description"
      content="We offer on-the-spot repairs and in-depth tune-ups for your bike. Rent hybrid bikes, shop parts, and ride along the NYC waterfront."
    />
    <meta name="author" content="Waterfront Bicycle Shop Bike Rental / Repair NYC" />

    {/* Open Graph */}
    <meta property="og:url" content="https://bikeshopny.com/" />
    <meta property="og:site_name" content="Waterfront Bicycle Shop Bike Rental / Repair NYC" />
    <meta property="og:title" content="Waterfront Bicycle Shop Bike Rental / Repair NYC" />
    <meta
      property="og:description"
      content="We offer on-the-spot repairs and in-depth tune-ups for your bike. Rent hybrid bikes, shop parts, and ride along the NYC waterfront."
    />
    <meta property="og:type" content="website" />
    <meta
      property="og:image"
      content="https://img1.wsimg.com/isteam/ip/5908d7da-7b85-40f0-a477-544892880bd5/47fb6dcb-0116-4cbc-8be8-9fa8a383e835.jpg"
    />
    <meta property="og:locale" content="en_US" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Waterfront Bicycle Shop Bike Rental / Repair NYC" />
    <meta
      name="twitter:description"
      content="We offer on-the-spot repairs and in-depth tune-ups for your bike. Rent hybrid bikes, shop parts, and ride along the NYC waterfront."
    />
    <meta
      name="twitter:image"
      content="https://img1.wsimg.com/isteam/ip/5908d7da-7b85-40f0-a477-544892880bd5/47fb6dcb-0116-4cbc-8be8-9fa8a383e835.jpg"
    />
    <meta name="twitter:image:alt" content="Waterfront Bicycle Shop Bike Rental / Repair NYC" />

    {/* Theme Color */}
    <meta name="theme-color" content="rgb(0, 117, 193)" />
  </Head>
);

export default Meta;
