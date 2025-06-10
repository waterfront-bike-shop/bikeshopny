"use client";

import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import BikeCards from "../components/BikeCards";
import { X } from "phosphor-react";

// Helper function to check if the current date/time is within the event window
const isAlertActive = () => {
  const currentDate = new Date();
  const startDate = new Date("2025-05-12T03:00:00");
  const endDate = new Date("2025-05-18T06:45:00");
  return currentDate >= startDate && currentDate <= endDate;
};

const RentalsClient: React.FC = () => {
  const [mode, setMode] = useState<"online" | "inStore">("online");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleClose = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (isAlertActive()) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Alert Component */}
      {showAlert && (
        <div className="bg-red-600 text-white p-4 flex items-center space-x-4">
          <img
            src="https://nyc.gfny.com/wp-content/uploads/sites/8/2023/09/GFNY-Worlds_Michelob-02.png"
            alt="GFNY"
            className="w-10 h-10 object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold">GFNY Bike Rental Alert</h4>
            <p>Rent a road bike for the May 18 GFNY World Championship NYC ride. Rent for May 18 and pickup the night before (between 6-7 PM) at the shop, return by 6:45 PM after the race.</p>
            <a href="https://nyc.gfny.com/" className="text-lime-400 underline">
              Learn More
            </a>
          </div>
          <button
            onClick={handleClose}
            className="text-white ml-4"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
      )}

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

      {/* Content rendering */}
      <div>
        {mode === "online" ? (
          <div className="w-full min-h-screen flex justify-center items-center">
            <iframe
              src="https://us.bikerentalmanager.com/book.html?shop=waterfrontbicycleshop"
              title="Waterfront Bicycle Rentals"
              className="w-full h-[150vh] border-0"
              allowFullScreen
              aria-labelledby="rental-description"
              aria-describedby="bike-rental-description"
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
                    <span className="font-semibold text-blue-600">Email us at: waterfrontbikeshop@gmail.com</span>
                  </p>
                  <p>
                    <span className="font-semibold text-blue-600">Stop by the store and rent in person, including the day of.</span>
                  </p>
                  <p className="text-gray-700">Rentals include helmets and locks.</p>
                </div>
              </div>
              <BikeCards />
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default RentalsClient;