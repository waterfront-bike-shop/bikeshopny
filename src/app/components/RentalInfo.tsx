// app/components/Rentals.tsx

import { Button } from "@/components/ui/button"

const RentalInfo: React.FC = () => {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold mb-6">Bicycle Rentals</h2>
      <Button className="bg-red-500 text-white hover:bg-red-600">Reserve Today </Button>  


      
      <div className="grid gap-8 md:grid-cols-2">
        {/* 24 Speed City Bike */}
        <div className="space-y-4">
          <div className="w-full h-40 bg-gray-800 rounded" /> {/* Image Placeholder */}
          <h3 className="text-xl font-semibold">24-Speed City Bike</h3>
          <p>We have 40 of these bikes available for rent. Each rental includes a basket, helmet, and lock. Available in Medium, Large, and Extra Large sizes.</p>
          
          <h4 className="text-lg font-semibold">Rates:</h4>
          <ul className="list-disc pl-5">
            <li>One hour - $15</li>
            <li>Each additional hour - $5</li>
            <li>Day rate (10am - 7pm) - $35</li>
          </ul>
        </div>

        {/* 7-Speed Step Through Bicycle */}
        <div className="space-y-4">
          <div className="w-full h-40 bg-gray-800 rounded" /> {/* Image Placeholder */}
          <h3 className="text-xl font-semibold">7-Speed Step Through Bicycle</h3>
          <p>We have 15 of these bikes for rent. These bikes are more upright and available in Small (up to 5ft 8in) and Large (up to 5ft 10in) sizes. Each rental includes a basket, helmet, and lock.</p>
          
          <h4 className="text-lg font-semibold">Rates:</h4>
          <ul className="list-disc pl-5">
            <li>One hour - $15</li>
            <li>Each additional hour - $5</li>
            <li>Day rate (10am - 7pm) - $35</li>
          </ul>
        </div>

        {/* 2025 5 Boro Bike Tour */}
        <div className="space-y-4">
          <div className="w-full h-40 bg-gray-800 rounded" /> {/* Image Placeholder */}
          <h3 className="text-xl font-semibold">2025 5 Boro Bike Tour</h3>
          <p>Join us for the 2025 5 Boro Bike Tour with Bike New York. We have bikes available for the weekend of May 03 and 04 (2-day minimum).</p>
          <p className="font-semibold">$99 per bike</p>
          <p className="text-sm text-gray-500">10 road bikes available for $200 for the weekend</p>
        </div>
      </div>
    </section>
  );
};

export default RentalInfo;
