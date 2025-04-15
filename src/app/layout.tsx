import "./globals.css";
import Meta from "./components/Meta";
import Header from "./components/Header";
import Footer from "./components/Footer";

<Meta />

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
