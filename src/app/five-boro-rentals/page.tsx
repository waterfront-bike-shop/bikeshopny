// app/rentals/page.tsx
"use client";

import React from "react";

const Rentals: React.FC = () => {
  return (
    <>
      <h1 className="text-3xl p-6">5 Boro Bike Tour Rentals</h1>
      <div className="w-full min-h-screen bg-white flex justify-center items-center">
        <iframe
          src="https://us.bikerentalmanager.com/book.html?shop=waterfrontbicycleshop&event_ref=5%20Boro%20Bike%20Tour%202025"
          title="5 Boro Bike Tour Rentals - Waterfront Bicycle Shop"
          className="w-full h-[100vh] border-0"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
};

export default Rentals;
