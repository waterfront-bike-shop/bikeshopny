"use client";

import React, { useEffect, useState } from "react";
import { InstagramLogo, Star } from "phosphor-react";
import KayakBadge from "./KayakBadge";
import Image from "next/image";

const Footer: React.FC = () => {
  const [ratings, setRatings] = useState<{
    tripAdvisor: number | null;
    yelp: number | null;
    google: number | null;
  } | null>(null);

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

  const fetchTripAdvisorRating = async (): Promise<number> => {
    return 4.9; // Replace with real fetch
  };

  const fetchYelpRating = async (): Promise<number> => {
    return 4.7; // Replace with real fetch
  };

  const fetchGoogleRating = async (): Promise<number> => {
    return 4.8; // Replace with real fetch
  };

  if (!ratings) return <div>Loading...</div>;

  return (
    <footer className="bg-blue-800 text-white py-10 px-6">
      <div className="max-w-screen-xl mx-auto space-y-6 sm:flex sm:justify-between sm:items-center sm:space-y-0">
        {/* Left Column: Contact Info */}
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

        {/* Right Column: Social & Ratings */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/waterfrontbicycleshop/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              <InstagramLogo size={40} />
            </a>

            {/* Google */}
            <a
              href="https://g.co/kgs/eMAUaVi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white flex items-center space-x-2 hover:text-gray-300"
            >
              <Image
                src="/logos/google_g_icon.png"
                alt="Google G Icon"
                className="h-8 w-8 rounded"
                width={512}
                height={512}
              />
              <div className="flex items-center">
                <Star size={20} weight="fill" />
                <span className="text-lg">{ratings.google}</span>
              </div>
            </a>

            {/* TripAdvisor */}
            {/* <a
              href="https://www.tripadvisor.com/Attraction_Review-g60763-d8444605-Reviews-Waterfront_Bicycle_Shop-New_York_City_New_York.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white flex items-center space-x-2 hover:text-gray-300"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Tripadvisor_logo_2019.svg"
                alt="TripAdvisor Logo"
                className="h-8 w-8"
              />
              <div className="flex items-center">
                <Star size={20} weight="fill" />
                <span className="text-lg">{ratings.tripAdvisor}</span>
              </div>
            </a> */}

            {/* Yelp */}
            {/* <a
              href="https://www.yelp.com/biz/waterfront-bicycle-shop-new-york"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white flex items-center space-x-2 hover:text-gray-300"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/84/Yelp_Logo_2019.png"
                alt="Yelp Logo"
                className="h-8 w-8"
              />
              <div className="flex items-center">
                <Star size={20} weight="fill" />
                <span className="text-lg">{ratings.yelp}</span>
              </div>
            </a> */}
          </div>

          {/* Kayak Badge */}
          <KayakBadge />
        </div>
      </div>

            {/* Copyright */}
            <div className="mt-10 text-center text-xs text-gray-300">
        &copy; {new Date().getFullYear()} Waterfront Bicycle Shop, 391 West Street NY, NY 10014<br />
        All Rights Reserved
      </div>
      
    </footer>
  );
};

export default Footer;
