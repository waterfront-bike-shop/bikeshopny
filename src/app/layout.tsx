// layout.tsx or app/layout.tsx

import "./globals.css";
import Meta from "./components/Meta";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> Add this line */}
        <meta title="Waterfront Bicycle Shop | NYC" />
        <Meta />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}