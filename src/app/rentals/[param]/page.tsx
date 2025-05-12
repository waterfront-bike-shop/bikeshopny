"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Hero from "../../components/Hero";
import BikeCards from "../../components/BikeCards";

const paramUrlDict = [
  {
    param: "roadbikes",
    brm_url: "https://us.booking.bike.rent/book?store=waterfrontbicycleshop&categories=1744660467608",
  },
  { param: "kidsbikes", brm_url: "https://us.booking.bike.rent/book?store=waterfrontbicycleshop&categories=1745418386377" },
  { param: "citybikes", brm_url: "https://us.booking.bike.rent/book?store=waterfrontbicycleshop&categories=1744656427518,1743963523549" },
];

export default function RentalsPage() {
  const { param } = useParams(); // "roadbike", "kidsbike", etc.
  const [mode, setMode] = useState<"online" | "inStore">("online");

  const selectedBike = paramUrlDict.find((bike) => bike.param === param);
  const iframeSrc = selectedBike
    ? selectedBike.brm_url
    : "https://us.booking.bike.rent/book?store=waterfrontbicycleshop";

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Toggle buttons */}
      <div className="flex justify-center space-x-4 py-3">
        <button
          onClick={() => setMode("online")}
          className={`px-4 py-2 rounded ${
            mode === "online" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          Online Booking
        </button>
        <button
          onClick={() => setMode("inStore")}
          className={`px-4 py-2 rounded ${
            mode === "inStore" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          In Store Rental
        </button>
      </div>

      <div>
        <h3 className="text-center border border-gray-800 rounded m-3">
          Note: For same-day booking call the store at 212-414-2453 to reserve a bike. Online booking ends the previous day.
        </h3>
      </div>

      <div>
        {mode === "online" ? (
          <div className="w-full min-h-screen flex justify-center items-center">
            <iframe
              src={iframeSrc}
              title="Waterfront Bicycle Rentals"
              className="w-full h-[150vh] border-0"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <>
            <Hero
              headline="Waterfront Bicycle Rentals"
              image="/images/hudson_river_aerial_view.jpg"
              subheadings={["Rent bikes in store, by phone or by email."]}
            />
            <section className="py-10">
              <div className="max-w-screen-xl mx-auto px-6">
                <h1 className="text-2xl mb-2 font-bold">Make a Bicycle Reservation</h1>
                <div className="mb-4 space-y-2 text-lg">
                  <p>
                    <span className="font-semibold text-blue-600">Call us at: 212 414 2453</span>
                  </p>
                  <p>
                    <span className="font-semibold text-blue-600">Email: waterfrontbikeshop@gmail.com</span>
                  </p>
                  <p>
                    <span className="font-semibold text-blue-600">Or stop by the store and rent in person (same day OK!)</span>
                  </p>
                  <p className="text-gray-700">Rentals include helmets and locks.</p>
                </div>

                <h1 className="text-2xl mb-2 mt-6 font-bold">Hours</h1>
                <p>Monday - Sunday 10:00 am - 7:00 pm</p>

                <h1 className="text-2xl mt-6 font-bold">Bicycles for Rent:</h1>
              </div>
            </section>
            <BikeCards />
          </>
        )}
      </div>
    </div>
  );
}
