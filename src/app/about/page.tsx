import { FC } from "react";
import Hero from "../components/Hero";

const AboutPage: FC = () => {
  return (
    <>
      <Hero headline="About" image="/images/hudson_river_aerial_view.jpg" />
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-2xl mb-2 font-bold">
            About Waterfront Bike Shop
          </h1>
          <p>Come explore the Hudson River Park and beyond. We have over 100 quality hybrid bicycle for rent. We also offer tune ups, repairs, parts and accessories.</p>
          <p className="mt-4">Open since 2009 in New York City's West Village. </p>
          <h1 className="text-2xl mb-2 mt-4 font-bold">Summer Hours</h1>
          <p>Monday - Sunday 10:00 am - 7:00 pm</p>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
