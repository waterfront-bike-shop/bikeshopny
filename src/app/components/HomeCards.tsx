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
              src="/images/repair-service-parts.jpg"
              alt="Repair"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Repairs</h3>
          <p>On the spot repairs and tune- ups available.</p>

          <p className="mt-2">
            We keep 1000+ Parts & Accessories in stock at all times for the
            spur-of-the-moment upgrade or repair.
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
          <h3 className="text-lg font-semibold mb-2">
            Rent a 24 Speed City Bike
          </h3>
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
          {/* Online Rentals by the day */}
          Rent
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
          <h3 className="text-lg font-semibold mb-2">
            Rent a 7 Speed Step-Through Bike
          </h3>
          <p>
            Sizes: Small (up to 5&apos;8&quot;), Large (up to 5&apos;10&quot;).
          </p>
          <ul className="text-sm mt-2">
            <li>1 hour – $15</li>
            <li>Each add. hour – $5</li>
            <li>Day rate (10am–7pm) – $35</li>
          </ul>
        </div>
        <Button variant="default" className="mt-4 bg-blue-800 text-white">
          {/* Online Rentals by the day */}
          Rent
        </Button>
      </Link>

      {/* Rental Card 3 */}
      <Link href="/rentals" className={cardStyle}>
        <div>
          <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4 bg-white">
            <Image
              src="/images/specialized-roubaix-sport-2019.webp"
              alt="Road bike"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Rent a Road Bike</h3>
          <p>Sizes: 56cm, 54cm and 52cm</p>
          <ul className="text-sm mt-2">
            <li>Day rate (10am–7pm):</li>
            <li>$65 Aluminum + Steel</li>
            <li>$100 Carbon</li>
          </ul>
        </div>
        <Button variant="default" className="mt-4 bg-blue-800 text-white">
          {/* Online Rentals by the day */}
          Rent
        </Button>
      </Link>

      {/* Parts & Accessories
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
      </Link> */}
    </section>
  );
}
