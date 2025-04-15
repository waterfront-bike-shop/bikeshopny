// app/rentals/page.tsx
"use client";

import React from "react";

const Rentals: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center">
      <iframe
        src="https://us.booking.bike.rent/book?store=waterfrontbicycleshop"
        title="Waterfront Bicycle Rentals"
        className="w-full h-[100vh] border-0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Rentals;
