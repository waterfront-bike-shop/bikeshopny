"use client";

import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import BikeCards from "../components/BikeCards";
import Head from "next/head";
import { X } from "phosphor-react"; // Import the X icon from Phosphor

// Helper function to check if the current date/time is within the event window
const isAlertActive = () => {
  const currentDate = new Date();

  // Define the alert start and end times
  const startDate = new Date("2025-05-12T03:00:00"); // May 17, 2025, at 7 PM
  const endDate = new Date("2025-05-18T06:45:00"); // May 18, 2025, at 6:45 PM

  // Check if current date is between start and end date
  return currentDate >= startDate && currentDate <= endDate;
};

const Rentals: React.FC = () => {
  const [mode, setMode] = useState<"online" | "inStore">("online");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleClose = () => {
    setShowAlert(false);
  };


  // Check if the alert should be shown based on the time
  useEffect(() => {
    if (isAlertActive()) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, []);

  const rentalData = {
    "@context": "https://schema.org",
    "@type": "BicycleRental",
    name: "Waterfront Bicycle Shop - Rentals",
    description:
      "Rent bikes online or in-store at Waterfront Bicycle Rentals. Choose from city/urban bikes, road bikes, and kids bikes by the day online, or hourly in person.",
    url: "https://www.bikeshopny.com/rentals",
    image: "/images/KHS-urban-xscape.jpg", 
    openingHours: "Mo-Su 10:00-19:00",
    paymentAccepted: "CreditCard",
    priceRange: "$$",
    availableAtOrFrom: {
      "@type": "Place",
      name: "Waterfront Bicycle Shop",
      address: {
        "@type": "PostalAddress",
        streetAddress: "391 West Street,",
        addressLocality: "New York",
        addressRegion: "NY",
        postalCode: "10014",
        addressCountry: "US",
      },
    },
    offers: [
      {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "35.00",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          value: "35.00",
          priceType: "Rent",
          validFrom: "2023-01-01T10:00:00Z",
          validThrough: "2023-12-31T19:00:00Z",
        },
        itemOffered: {
          "@type": "Bicycle",
          name: "City/Urban Bike",
          description:
            "Comfortable city bike with basket, lock, and helmet. Available in medium, large, and XL sizes.",
          additionalType: "https://schema.org/Bicycle",
        },
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Bike Rentals - Online Booking</title>
        <meta name="description" content="Rent bikes online or in-store with waterfront bike rental." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rentalData),
          }}
        ></script>
      </Head>

      <div className="w-full min-h-screen bg-white">
        {/* Alert Component */}
      {/* Alert Component */}
      {showAlert && (
        <div className="bg-red-600 text-white p-4 flex items-center space-x-4">
          <img
            src="https://nyc.gfny.com/logo.png"
            alt="GFNY"
            className="w-10 h-10 object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold">GFNY Bike Rental Alert</h4>
            <p>Rent a road bike for the May 18 GFNY World Championship NYC ride. Rent for May 18 and pickup the night before (between 6-7 PM) at the shop, return by 6:45 PM after the race.</p>
            <a href="https://nyc.gfny.com/" className="text-yellow-400 underline">
              Learn More
            </a>
          </div>
          {/* Close Button */}
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
                src="https://us.booking.bike.rent/book?store=waterfrontbicycleshop"
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
    </>
  );
};

export default Rentals;
