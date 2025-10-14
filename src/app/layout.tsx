import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ClientGTM from "./components/ClientGTM";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { ShopDataProvider } from "./context/ShopDataContext";

export const metadata: Metadata = {
  title: "Bicycle Rentals - Waterfront Bicycle Shop Bike Rental / Repair NYC",
  description:
    "We offer on-the-spot repairs and in-depth tune-ups for your bike. Rent hybrid bikes, shop parts, and ride along the NYC waterfront.",
  icons: { icon: "/favicon.png" },
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ShopDataProvider>
        <Header />
        <ClientGTM /> {/* client-only */}
        {children}
        <Footer />
        <Analytics />
        </ShopDataProvider>
      </body>
    </html>
  );
}
