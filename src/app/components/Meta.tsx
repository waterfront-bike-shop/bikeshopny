// app/components/Meta.tsx
// NOTE: This was not importing into the top level Layout.tsx, after a debug attempt, just added information directly to layout.tsx
import Head from 'next/head';

const Meta = () => {
  console.log("Server Meta component is rendering!");
  return (
    <Head>
      {/* Next.js handles this automatically */}
      <meta charSet="utf-8" />
      {/* Generally not needed for modern browsers */}
      {/* <meta httpEquiv="X-UA-Compatible" content="IE=edge" /> */}
      {/* Next.js handles viewport configuration in layout.tsx or _document.js */}
      {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
      <link rel="icon" type="image/png" href="/logos/waterfront-bicycle-shop-logo.png" />
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

    </Head>
  );
};

export default Meta;