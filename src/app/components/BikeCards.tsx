import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function BikeCards() {
  const cardStyle =
    "rounded-2xl shadow-md overflow-hidden flex flex-col justify-between p-4 bg-white";

  const bikes = [
    {
      title: "24 Speed City Bike",
      image: "/images/KHS-urban-xscape.jpg",
      alt: "City Bike",
      desc: "40 available. Includes basket, helmet, and lock. Medium, Large, and XL sizes.",
      pricing: [
        "1 hour – $15",
        "Each add. hour – $5",
        "Day rate (10am–7pm) – $35",
      ],
    },
    {
      title: "7 Speed Step-Through Bike",
      image: "/images/marin_kentfield.jpg",
      alt: "Step Through Bike",
      desc: "Sizes: Small (up to 5'8\"), Large (up to 5'10\").",
      pricing: [
        "1 hour – $15",
        "Each add. hour – $5",
        "Day rate (10am–7pm) – $35",
      ],
    },
    {
      title: "Road Bike",
      image: "/images/specialized-roubaix-sport-2019.webp",
      alt: "Road Bike",
      desc: "Sizes: 56cm, 54cm and 52cm",
      pricing: ["Day rate (10am–7pm):", "$65 Aluminum + Steel", "$100 Carbon"],
    },
    {
      title: "Kids Bike",
      image: "/images/2024-KHS-Bicycles-Raptor-Boys-Bright-Orange-web.png",
      alt: "Kids KHS Bike",
      desc: 'Sizes: 24" KHS Syntaur and 20" KHS Raptor',
      pricing: [
        "1 hour – $15",
        "Each add. hour – $5",
        "Day rate (10am–7pm) – $35",
      ],
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 py-8">
      {bikes.map((bike, index) => {
        const mailto = `mailto:waterfrontbikeshop@gmail.com?subject=Rental: ${encodeURIComponent(
          bike.title
        )}`;
        const sms = `sms:12124142453?body=I'm interested in renting a ${encodeURIComponent(
          bike.title
        )}`;

        return (
          <div key={index} className={cardStyle}>
            <div>
              <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4 bg-white">
                <Image
                  src={bike.image}
                  alt={bike.alt}
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{bike.title}</h3>
              <p>{bike.desc}</p>
              <ul className="text-sm mt-2">
                {bike.pricing.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <a href={mailto}>
                <Button className="bg-blue-800 text-white w-full hover:bg-blue-900">
                  Email to Reserve
                </Button>
              </a>
            </div>
          </div>
        );
      })}
    </section>
  );
}
