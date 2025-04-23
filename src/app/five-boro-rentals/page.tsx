// app/rentals/page.tsx
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

const Rentals: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center relative">
      {isLoading && (
        <div className="absolute z-10 flex justify-center items-center w-full h-full bg-white">
          <svg
            className="h-10 w-10 text-gray-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      )}
      <iframe
        src="https://us.bikerentalmanager.com/book.html?shop=waterfrontbicycleshop&event_ref=5%20Boro%20Bike%20Tour%202025"
        title="5 Boro Bike Tour Rentals - Waterfront Bicycle Shop"
        className={cn("w-full h-[100vh] border-0", isLoading ? "opacity-0" : "opacity-100")}
        onLoad={() => setIsLoading(false)}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Rentals;
