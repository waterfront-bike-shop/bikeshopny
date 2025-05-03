// app/page.tsx
import { FC } from "react";
import Hero from "./components/Hero";
import HomeCards from "./components/HomeCards";

const HomePage: FC = () => {
  return (
    <>
      {/* <Hero headline="Welcome to the best Bike Shop on the Hudson River!" href="/rentals" button_text="Rent a bike online" image="/images/hudson_river_aerial_view.jpg"/> */}
      <Hero
        headline="Bikes still available to rent for the 2025 5 Boro Bike Tour"
        subheadings={[
          "$99 per bike for Sat May 03, and Sun May 04 two day minimum",
          "(Road bikes $200)",
        ]}
        href="/five-boro-rentals"
        // button_text="Book your 5 Boro Bicycle Rental"
        button_text="Book by May 3 at 5pm"
        image="/images/5-boro-riders.jpg"
      />
      <HomeCards />
    </>
  );
};

export default HomePage;
