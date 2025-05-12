// app/rentals/page.tsx
"use client";

import React, { useState } from "react";
import Hero from "../components/Hero";
import BikeCards from "../components/BikeCards";
import Head from "next/head";

const Rentals: React.FC = () => {
  const [mode, setMode] = useState<"online" | "inStore">("online");

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
      {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "65.00",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          value: "65.00",
          priceType: "Rent",
          validFrom: "2023-01-01T10:00:00Z",
          validThrough: "2023-12-31T19:00:00Z",
        },
        itemOffered: {
          "@type": "Bicycle",
          name: "Aluminum/Steel Road Bike",
          description: "Aluminum and Steel road bike with helmet and selectable pedals.",
          additionalType: "https://schema.org/Bicycle",
        },
      },
      {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "100.00",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          value: "100.00",
          priceType: "Rent",
          validFrom: "2023-01-01T10:00:00Z",
          validThrough: "2023-12-31T19:00:00Z",
        },
        itemOffered: {
          "@type": "Bicycle",
          name: "Carbon Road Bike",
          description: "Carbon road bike with helmet and selectable pedals.",
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
        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rentalData),
          }}
        ></script>
      </Head>
      
      
    <div className="w-full min-h-screen bg-white">
      {/* Toggle buttons */}
      <div className="flex justify-center space-x-4 py-3">
        <button
          onClick={() => setMode("online")}
          className={`px-4 py-2 rounded ${
            mode === "online"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Online Booking
        </button>
        <button
          onClick={() => setMode("inStore")}
          className={`px-4 py-2 rounded ${
            mode === "inStore"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          In Store Rental
        </button>
      </div>
      <div>
        <h3 className="text-center border border-gray-800 rounded m-3">
          Note: For same-day booking call the store at 212-414-2453 to reserve a
          bike, online-booking ends the previous day.{" "}
        </h3>
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
            {/*<h1 className="text-6xl">Online Booking Coming Soon!</h1> {/* Delete this when online booking back up! */}
            <div id="rental-description" className="sr-only">
              This iframe contains a dynamic bike rental system where users can
              book bikes, choose rental duration by the day, and pay via a Stripe connected checkout.
            </div>
            <div id="bike-rental-description" className="sr-only">
              The bike rental service allows users to select different bike
              types such as city/urban bikes, road bikes, and kids bikes, with rental
              prices available for daily bookings. Rentals include a helmet and an optional lock and basket for the city/urban bikes.
            </div>
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
                <h1 className="text-2xl mb-2 font-bold">
                  Make a Bicycle Reservation
                </h1>
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
                      Stop by the store and rent in person, including the day
                      of.
                    </span>
                  </p>
                  <p className="text-gray-700">
                    Rentals include helmets and locks.
                  </p>
                  <p className="text-sm text-gray-500">
                    {/* Online booking currently unavailable — check back soon! */}
                  </p>
                </div>

                <h1 className="text-2xl mb-2 mt-6 font-bold">Hours</h1>
                <p>Monday - Sunday 10:00 am - 7:00 pm</p>

                <h1 className="text-2xl mt-6 font-bold">Bicycles for Rent:</h1>
              </div>
            </section>
            <BikeCards />
          </>
        )}

        {/* Preloaded hidden view (off-screen, hidden from display but loaded in DOM) */}
        <div className="hidden">
          {mode === "online" ? (
            <>
              <Hero
                headline="Waterfront Bicycle Rentals"
                image="/images/hudson_river_aerial_view.jpg"
                subheadings={["Rent bikes in store, by phone or by email."]}
              />
              <section>
                <BikeCards />
              </section>
            </>
          ) : (
            <iframe
              src="https://us.booking.bike.rent/book?store=waterfrontbicycleshop"
              title="Waterfront Bicycle Rentals"
              className="w-full h-[150vh] border-0"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Rentals;
