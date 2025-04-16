// app/rentals/page.tsx
"use client";

import React from "react";

const Shop: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center">
      <iframe
        src="https://waterfront-bicycle-shop.shoplightspeed.com/"
        title="Waterfront Bicycle Shop - Parts & Accessories"
        className="w-full h-[100vh] border-0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Shop;
