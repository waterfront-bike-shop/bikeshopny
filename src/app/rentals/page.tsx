import { FC } from "react";
import Hero from "../components/Hero";
import BikeCards from "../components/BikeCards";

const Rentals: FC = () => {
  return (
    <>
      <Hero
        headline="Waterfront Bicycle Rentals"
        image="/images/hudson_river_aerial_view.jpg"
        subheadings={[
          "Rent bikes in store, by text or by email.",
          "Online booking coming soon!",
        ]}
      />
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-2xl mb-2 font-bold">Make a Bicycle Reservation</h1>
          <div className="mb-4 space-y-2 text-lg">
            <p>
              <span className="font-semibold text-blue-600">
                Call us at: 212 414 2453
              </span>
            </p>
            <p>
              <span className="font-semibold text-blue-600">
                Email us at: waterfrontbikeshop@gmail.com
              </span>
            </p>
            <p>
              <span className="font-semibold text-blue-600">
                Stop by the store and rent in person, inluding the day of
              </span>
            </p>

            <p className="text-gray-700">Rentals include helmets and locks.</p>
            <p className="text-sm text-gray-500">
              Online booking currently unavailable — check back soon!
            </p>
          </div>

          <h1 className="text-2xl mb-2 mt-6 font-bold">Hours</h1>
          <p>Monday - Sunday 10:00 am - 7:00 pm</p>

          <h1 className="text-2xl mt-6  font-bold">Bicycles for Rent:</h1>
        </div>
      </section>
      <BikeCards />
    </>
  );
};

export default Rentals;
