// app/layout.tsx

import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Script from "next/script";
import ClientAnalytics from "./components/ClientAnalytics";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"; // Vercel's analytics

export const metadata: Metadata = {
  title: "Bicycle Rentals - Waterfront Bicycle Shop Bike Rental / Repair NYC",
  description:
    "We offer on-the-spot repairs and in-depth tune-ups for your bike. Rent hybrid bikes, shop parts, and ride along the NYC waterfront.",
  openGraph: {
    url: "https://bikeshopny.com/",
    siteName: "Waterfront Bicycle Shop Bike Rental / Repair NYC",
    title: "Waterfront Bicycle Shop Bike Rental / Repair NYC",
    description:
      "We offer on-the-spot repairs and in-depth tune-ups for your bike. Rent hybrid bikes, shop parts, and ride along the NYC waterfront.",
    type: "website",
    images: [
      {
        url: "https://img1.wsimg.com/isteam/ip/5908d7da-7b85-40f0-a477-544892880bd5/47fb6dcb-0116-4cbc-8be8-9fa8a383e835.jpg",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waterfront Bicycle Shop Bike Rental / Repair NYC",
    description:
      "We offer on-the-spot repairs and in-depth tune-ups for your bike. Rent hybrid bikes, shop parts, and ride along the NYC waterfront.",
    images: [
      "https://img1.wsimg.com/isteam/ip/5908d7da-7b85-40f0-a477-544892880bd5/47fb6dcb-0116-4cbc-8be8-9fa8a383e835.jpg",
    ],
    creator: "@bikeshopny",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />

        {/* --- Google Tag Manager (Head) --- */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);

              // Confirmation log
              console.log('✅ Google Tag Manager (GTM-MV33TJD8) initialized');
            })(window,document,'script','dataLayer','GTM-MV33TJD8');
          `}
        </Script>
        {/* --- End Google Tag Manager (Head) --- */}
      </head>

      <body>
        {/* --- Google Tag Manager (NoScript) --- */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MV33TJD8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* --- End Google Tag Manager (NoScript) --- */}

        <Header />
        <ClientAnalytics />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
