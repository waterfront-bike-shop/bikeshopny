// app/page.tsx
import { FC } from "react";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Rentals from "./components/Rentals";
import Contact from "./components/Contact";
import KayakBadge from "./components/KayakBadge";
import Meta from "./components/Meta";
import BookingIframe from "./components/BookingFrame";
import Header from "./components/Header";

const HomePage: FC = () => {
  return (
    <>
      <Hero headline="Welcome to the best Bike Shop on the Hudson River!" href="/rentals" image="/images/hudson_river_aerial_view.jpg"/>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <section className="text-center py-16">
          
        </section>

        <section className="space-y-8">
          <Services />
        </section>

        <section className="space-y-8">
          <Rentals />
        </section>

        <BookingIframe />
        <footer>
          <Contact />
          <KayakBadge />
        </footer>
      </main>
    </>
  );
};

export default HomePage;
