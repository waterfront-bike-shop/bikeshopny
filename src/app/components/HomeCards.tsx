// components/HomeCards.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeCards() {
  const cardStyle =
    "rounded-2xl shadow-md overflow-hidden flex flex-col justify-between p-4 bg-white";

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 py-8">
      {/* Repairs */}
      <Link href="/repairs" className={cardStyle}>
        <div>
          <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4 bg-white">
            <Image
              src="/images/repair_service.jpg"
              alt="Repair"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Repairs</h3>
          <p>
          On the spot repairs and tune- ups available.
          </p>
        </div>
        <Button variant="default" className="mt-4 bg-blue-800 text-white">
          Repairs
        </Button>
      </Link>

      {/* Rental Card 1 */}
      <Link href="/rentals" className={cardStyle}>
        <div>
          <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4 bg-white">
            <Image
              src="/images/KHS-urban-xscape.jpg"
              alt="City Bike"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">24 Speed City Bike</h3>
          <p>
            40 available. Includes basket, helmet, and lock. Medium, Large, and
            XL sizes.
          </p>
          <ul className="text-sm mt-2">
            <li>1 hour – $15</li>
            <li>Each add. hour – $5</li>
            <li>Day rate (10am–7pm) – $35</li>
          </ul>
        </div>
        <Button variant="default" className="mt-4 bg-blue-800 text-white">
          Online Rentals by the day
        </Button>
      </Link>

      {/* Rental Card 2 */}
      <Link href="/rentals" className={cardStyle}>
        <div>
          <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4 bg-white">
            <Image
              src="/images/marin_kentfield.jpg"
              alt="Step Through Bike"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">7 Speed Step-Through</h3>
          <p>
            15 upright bikes. Basket, helmet, lock included. Sizes: Small (up to
            5'8"), Large (up to 5'10").
          </p>
          <ul className="text-sm mt-2">
            <li>1 hour – $15</li>
            <li>Each add. hour – $5</li>
            <li>Day rate (10am–7pm) – $35</li>
          </ul>
        </div>
        <Button variant="default" className="mt-4 bg-blue-800 text-white">
          Online Rentals by the day
        </Button>
      </Link>

      {/* Parts & Accessories */}
      <Link href="/shop" className={cardStyle}>
        <div>
          <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4 bg-white">
            <Image
              src="/images/we_have_parts.webp"
              alt="Parts and Accessories"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            1000+ Parts & Accessories
          </h3>
          <p>
            We keep a large selection of product in stock at all times for the
            spur-of-the-moment upgrade or repair.
          </p>
        </div>
        <Button variant="default" className="mt-4 bg-blue-800 text-white">
          Parts & Accessories
        </Button>
      </Link>
    </section>
  );
}
