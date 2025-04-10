// app/page.tsx
import { FC } from "react";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Rentals from "./components/Rentals";
import Contact from "./components/Contact";
import KayakBadge from "./components/KayakBadge";
import Meta from "./components/Meta";

const HomePage: FC = () => {
  return (
    <>
      <Meta />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <section className="text-center py-16">
          <Hero />
        </section>

        <section className="space-y-8">
          <Services />
        </section>

        <section className="space-y-8">
          <Rentals />
        </section>
        <footer>
          <Contact />
          <KayakBadge />
        </footer>
      </main>
    </>
  );
};

export default HomePage;
