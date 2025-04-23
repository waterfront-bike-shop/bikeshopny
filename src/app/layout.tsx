// layout.tsx or app/layout.tsx

import "./globals.css";
// import Meta from "./components/Meta";
import Header from "./components/Header";
import Footer from "./components/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Waterfront Bicycle Shop | NYC Rentals & Repairs',
  description:
    'We offer on-the-spot repairs and in-depth tune-ups for your bike. Rent hybrid bikes, shop parts, and ride along the NYC waterfront.',
  // other metadata can be added here
  openGraph: {
    url: 'https://bikeshopny.com/',
    siteName: 'Waterfront Bicycle Shop Bike Rental / Repair NYC',
    title: 'Waterfront Bicycle Shop Bike Rental / Repair NYC',
    description:
      'We offer on-the-spot repairs and in-depth tune-ups for your bike. Rent hybrid bikes, shop parts, and ride along the NYC waterfront.',
    type: 'website',
    images: [
      {
        url: 'https://img1.wsimg.com/isteam/ip/5908d7da-7b85-40f0-a477-544892880bd5/47fb6dcb-0116-4cbc-8be8-9fa8a383e835.jpg',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waterfront Bicycle Shop Bike Rental / Repair NYC',
    description:
      'We offer on-the-spot repairs and in-depth tune-ups for your bike. Rent hybrid bikes, shop parts, and ride along the NYC waterfront.',
    images: [
      'https://img1.wsimg.com/isteam/ip/5908d7da-7b85-40f0-a477-544892880bd5/47fb6dcb-0116-4cbc-8be8-9fa8a383e835.jpg',
    ],
    creator: '@your_twitter_handle', // Replace with your Twitter handle
  },
  themeColor: '#0075c1',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      url: '/logos/waterfront-bicycle-shop-logo.png',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head>
        <Meta />
      </head> */}
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
