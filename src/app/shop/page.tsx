"use client";
export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import Hero from "../components/Hero";
import ItemTest from "../components/ItemTest";

function InventoryLoadingFallback() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Loading Inventory...
        </h3>
        <p className="text-gray-600">Fetching our latest parts and accessories</p>
      </div>
    </div>
  );
}

const Shop: React.FC = () => {
  return (
    <>
      <div className="overflow-hidden h-[10vh] md:h-[20vh]">
        <Hero
          headline="Over 1,000 Parts & Accessories"
          image="/images/temp-inside-bike-shop.jpg"
        />
      </div>

      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-2xl mb-2 font-bold">
            SHOP: We have 1000+ parts and accessories available.
          </h1>
          <p>
            We keep a large selection of product in stock at all times for the
            spur of the moment upgrade or repair.
          </p>
          <p>Stop in the shop to see what we have.</p>
        </div>

        <Suspense fallback={<InventoryLoadingFallback />}>
          <ItemTest />
        </Suspense>
      </section>
    </>
  );
};

export default Shop;
