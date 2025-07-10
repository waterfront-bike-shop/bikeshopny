// app/rentals/page.tsx
"use client";

import React from "react";
import Hero from "../components/Hero";
import ShopItemsDemoImages from "../components/ShopItemsDemoImages";
// import ShopItemsDemo from "../components/ShopItemsDemo";

const Shop: React.FC = () => {
  return (
    <>
      <Hero
        headline="Over 1,000 Parts & Accessories"
        image="/images/temp-inside-bike-shop.jpg"
      />
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-2xl mb-2 font-bold">
            We have 1000+ parts and accessories available.
          </h1>
          <p>
            We keep a large selection of product in stock at all times for the
            spur of the moment upgrade or repair.
          </p>
          <p>
            Stop in the shop to see what we have.
          </p>
        </div>
        {/* <ShopItemsDemo /> */}

        <ShopItemsDemoImages />
      </section>
    </>
    // Doesn't Work --> Lightspeed does not allow iframe embedding.
    // <div className="w-full min-h-screen bg-white flex justify-center items-center">
    //   <iframe
    //     src="https://waterfront-bicycle-shop.shoplightspeed.com/"
    //     title="Waterfront Bicycle Shop - Parts & Accessories"
    //     className="w-full h-[100vh] border-0"
    //     allowFullScreen
    //   ></iframe>
    // </div>
  );
};

export default Shop;
