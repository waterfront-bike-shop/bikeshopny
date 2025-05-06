// app/layout.tsx

import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Script from "next/script";
import ClientAnalytics from "./components/ClientAnalytics"; // import ClientAnalytics component
import type { Metadata } from "next";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <Header />
        <ClientAnalytics />{" "}
        {/* ClientAnalytics component to track route changes */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
