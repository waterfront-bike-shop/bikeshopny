// app/components/HeroIcon.tsx

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// Flexible Hero image with Headline, and optional sub headline, and optional button/link.

interface HeroProps {
  headline: string;       // Add in the large headline text to layer over the image. Idea: Default to page name, i.e "About"
  subheadings?: string[]; // Optional: Use only if needed.
  href?: string;          // Optional: Use if you want a button that goes somewhere
  button_text?: string;   // Optional: Text on the button if you're using
  image: string;          // path to the background image. i.e.: "/images/storefront_west_and_christopher.jpg" in the /Public folder
}

const Hero: React.FC<HeroProps> = ({
  headline,
  subheadings,
  href,
  image,
  button_text,
}) => {
  return (
    <section
      className="relative w-full h-[60vh] md:h-[75vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          {headline}
        </h1>

        {subheadings?.map((line, idx) => (
          <h3
            key={idx}
            className="text-2xl font-medium leading-snug mb-2 text-white drop-shadow-lg"
          >
            {line}
          </h3>
        ))}

        {href && button_text && (
          <Link href={href}>
            <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3 rounded-xl shadow-md">
              {button_text}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default Hero;
