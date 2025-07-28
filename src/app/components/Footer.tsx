"use client";

import React, { useEffect, useState } from "react";
import { InstagramLogo, Star } from "phosphor-react";
import KayakBadge from "./KayakBadge";
import { usePathname } from "next/navigation";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size (Tailwind's sm breakpoint is 640px)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Ratings state
  const [ratings, setRatings] = useState<{
    tripAdvisor: number | null;
    yelp: number | null;
    google: number | null;
  } | null>(null);

  // Simulated fetch functions (replace with real fetches)
  const fetchTripAdvisorRating = async (): Promise<number> => 4.9;
  const fetchYelpRating = async (): Promise<number> => 4.7;
  const fetchGoogleRating = async (): Promise<number> => 4.8;

  // Fetch ratings & cache logic
  useEffect(() => {
    const fetchRatings = async () => {
      const cachedRatings = localStorage.getItem("ratings");
      const cachedTime = localStorage.getItem("ratingsTimestamp");
      const currentTime = Date.now();

      if (
        cachedRatings &&
        cachedTime &&
        currentTime - parseInt(cachedTime) < 86400000
      ) {
        setRatings(JSON.parse(cachedRatings));
      } else {
        const tripAdvisorRating = await fetchTripAdvisorRating();
        const yelpRating = await fetchYelpRating();
        const googleRating = await fetchGoogleRating();

        const newRatings = {
          tripAdvisor: tripAdvisorRating,
          yelp: yelpRating,
          google: googleRating,
        };

        localStorage.setItem("ratings", JSON.stringify(newRatings));
        localStorage.setItem("ratingsTimestamp", currentTime.toString());
        setRatings(newRatings);
      }
    };

    fetchRatings();
  }, []);

  // Determine if footer should be hidden => MOBILE and < 40rem (640px)	aka @media (width >= 40rem)
  const shouldHideFooter = isMobile && pathname.includes("/rentals");

  // Return null if ratings not loaded yet (after hooks)
  if (!ratings) return null;

  return (
    <footer
      className={`bg-blue-800 text-white py-10 px-6 transition-opacity duration-300 ${
        shouldHideFooter ? "hidden" : "block"
      }`}
    >
      <div className="max-w-screen-xl mx-auto space-y-6 sm:flex sm:justify-between sm:items-center sm:space-y-0">
        {/* Contact Info */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Waterfront Bicycle Shop</p>
            <p>391 West Street, New York, NY 10014, US</p>
            <div>
              <h3 className="text-lg font-semibold">Call Us</h3>
              <p>212-414-2453</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Email Us</h3>
              <p>waterfrontbikeshop@gmail.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Text Us</h3>
              <p>212-414-2453</p>
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="https://www.instagram.com/waterfrontbicycleshop/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              <InstagramLogo size={40} />
            </a>

            <a
              href="https://g.co/kgs/eMAUaVi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white flex items-center space-x-2 hover:text-gray-300"
            >
              <img
                src="/logos/google_g_icon.png"
                alt="Google G Icon"
                className="h-8 w-8 rounded"
              />
              <div className="flex items-center">
                <Star size={20} weight="fill" />
                <span className="text-lg">{ratings.google}</span>
              </div>
            </a>
          </div>
          
          {/* Kayak Badge is a link exchange with Kayak, which is why we have it here. */}
          <KayakBadge />
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-300">
        &copy; {new Date().getFullYear()} Waterfront Bicycle Shop, 391 West Street
        NY, NY 10014
        <br />
        All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
