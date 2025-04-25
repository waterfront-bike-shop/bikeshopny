// app/rentals/5bororentals.page.tsx

import React from "react";
import { Button } from "@/components/ui/button";

const FiveBoroRentals: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center py-8 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">5 Boro Bike Tour 2025 Rental</h1>
        <h2 className="text-xl font-medium mb-4">Sat 3 May 2025</h2>
        <p className="mb-4">
          Rent a bicycle for the 5 Boro Bike Tour on May 4, 2025.
        </p>
        <p className="mb-4">
          $99 per bike for Sat May 03, and Sun May 04, two-day minimum.
        </p>
        <p className="mb-4">
          <span className="font-bold">Text us at 212 414 2453</span> or{" "}
          <span className="font-bold">email us at waterfrontbikeshop@gmail.com</span> 
          (10 road bikes are available for $200 for the weekend) with any questions, or as an alternate way to reserve.
        </p>
        <h3 className="text-xl font-semibold mt-4">Bicycle Pickup and Return</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Bicycle Pickup: Saturday, May 3, 10:00 AM - 6:45 PM</li>
          <li>Bicycle Return: Sunday May 4 by 6:45 PM. Shop closes at 7 PM*</li>
          <li>* Contact us if running late at 212 414 2453.</li>
          <li>* Late returns billed an extra day ($35) unless otherwise arranged in advance by calling 212 414 2453.</li>
          <li>* Late returns to be brought back to the shop at 10 AM the following day when the store opens.</li>
        </ul>
        <h3 className="text-xl font-semibold mt-4">Deposit Information</h3>
        <p className="mb-4">
          Upon pickup, a Passport or state-issued ID is required as a deposit, and a $200 hold will be placed on your credit card.
        </p>

        <div className="mt-8 flex gap-4">
          <a href="mailto:waterfrontbikeshop@gmail.com?subject=5 Boro Bike Tour 2025 Rental">
            <Button className="bg-blue-800 text-white w-full hover:bg-blue-900">
              Email to Reserve
            </Button>
          </a>
          <a href="sms:2124142453?body=I'm interested in renting a bike for the 5 Boro Bike Tour 2025">
          <Button className="bg-blue-800 text-white w-full hover:bg-blue-900">
              Text to Reserve
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FiveBoroRentals;








// // app/rentals/page.tsx
// "use client";

// import React, { useState } from "react";
// import { cn } from "@/lib/utils";

// const Rentals: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(true);

//   return (
//     <div className="w-full min-h-screen bg-white flex justify-center items-center relative">
//       {isLoading && (
//         <div className="absolute z-10 flex justify-center items-center w-full h-full bg-white">
//           <svg
//             className="h-10 w-10 text-gray-600 animate-spin"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             ></circle>
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//             ></path>
//           </svg>
//         </div>
//       )}
//       <iframe
//         src="https://us.bikerentalmanager.com/book.html?shop=waterfrontbicycleshop&event_ref=5%20Boro%20Bike%20Tour%202025"
//         title="5 Boro Bike Tour Rentals - Waterfront Bicycle Shop"
//         className={cn("w-full h-[100vh] border-0", isLoading ? "opacity-0" : "opacity-100")}
//         onLoad={() => setIsLoading(false)}
//         allowFullScreen
//       ></iframe>
//     </div>
//   );
// };

// export default Rentals;
