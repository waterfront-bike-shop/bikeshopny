// app/rentals/page.tsx
//////////////////////////
// RENTALS  | PAGE      //
//////////////////////////

//////////////////////////////////////////
// RENTALS | NO BRM / IN STORE ONLY     //
//////////////////////////////////////////

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
          <h1 className="text-2xl mb-2 font-bold">Waterfront Bike Rentals</h1>
          <p>
            Text or call us at 212 414 2453 or email us at
            waterfrontbikeshop@gmail.com to reserve.
          </p>
          <p>Rentals include helmets and locks.</p>
          {/* <p className="mt-4">
            Open since 2009 in New York City&apos;s West Village.
          </p> */}

          <h1 className="text-2xl mb-2 mt-4 font-bold">Hours</h1>
          <p>Monday - Sunday 10:00 am - 7:00 pm</p>
          <h1 className="text-2xl mt-4 mb-2 font-bold">Bicycles for Rent:</h1>
        </div>

      </section>
      <BikeCards />
    </>
  );
};

export default Rentals;

///////////////////////////////////
// RENTALS | ONLINE SALES        //
///////////////////////////////////

// import React from "react";

// const Rentals: React.FC = () => {
//   return (
//     <div className="w-full min-h-screen bg-white flex justify-center items-center">
//       <iframe
//         src="https://us.booking.bike.rent/book?store=waterfrontbicycleshop"
//         title="Waterfront Bicycle Rentals"
//         className="w-full h-[100vh] border-0"
//         allowFullScreen
//       ></iframe>
//     </div>
//   );
// };

// export default Rentals;
