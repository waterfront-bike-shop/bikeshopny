// app/page.tsx
import { FC } from "react";
import Hero from "./components/Hero";

const HomePage: FC = () => {
  return (
    <>
      <Hero headline="Welcome to the best Bike Shop on the Hudson River!" href="/rentals" button_text="Rent a bike online" image="/images/hudson_river_aerial_view.jpg"/>
    </>
  );
};

export default HomePage;
