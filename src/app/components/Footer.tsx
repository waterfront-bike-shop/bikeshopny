"use client";

import React, { useEffect, useState } from 'react';
import { InstagramLogo, Star } from 'phosphor-react';
import KayakBadge from './KayakBadge';

const Footer: React.FC = () => {
  const [ratings, setRatings] = useState<{ tripAdvisor: number | null; yelp: number | null } | null>(null);

  // Fetch and cache ratings
  useEffect(() => {
    const fetchRatings = async () => {
      // Check if cached data exists and is still valid
      const cachedRatings = localStorage.getItem('ratings');
      const cachedTime = localStorage.getItem('ratingsTimestamp');
      const currentTime = Date.now();

      // If cached data exists and is not older than 24 hours, use it
      if (cachedRatings && cachedTime && currentTime - parseInt(cachedTime) < 86400000) {
        setRatings(JSON.parse(cachedRatings));
      } else {
        // Fetch ratings dynamically (this is a mock URL, replace with actual API endpoint)
        const tripAdvisorRating = await fetchTripAdvisorRating();
        const yelpRating = await fetchYelpRating();

        const newRatings = { tripAdvisor: tripAdvisorRating, yelp: yelpRating };

        // Cache the fetched ratings with the current timestamp
        localStorage.setItem('ratings', JSON.stringify(newRatings));
        localStorage.setItem('ratingsTimestamp', currentTime.toString());

        setRatings(newRatings);
      }
    };

    fetchRatings();
  }, []);

  // Mock function to fetch TripAdvisor rating (replace with actual API call)
  const fetchTripAdvisorRating = async (): Promise<number> => {
    // Replace this with actual API request logic
    return 4.9; // Static for now
  };

  // Mock function to fetch Yelp rating (replace with actual API call)
  const fetchYelpRating = async (): Promise<number> => {
    // Replace this with actual API request logic
    return 4.7; // Static for now
  };

  if (!ratings) return <div>Loading...</div>; // Show loading while data is fetched

  return (
    <footer className="bg-blue-800 text-white py-10 px-6">
      <div className="max-w-screen-xl mx-auto space-y-6 sm:flex sm:justify-between sm:items-center sm:space-y-0">
        {/* Left Column: Contact Information */}
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

        {/* Right Column: Social Links & Kayak Badge */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-6">
            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/waterfrontbicycleshop/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              <InstagramLogo size={32} />
            </a>

            {/* TripAdvisor Logo and Stars */}
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g60763-d8444605-Reviews-Waterfront_Bicycle_Shop-New_York_City_New_York.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white flex items-center space-x-2 hover:text-gray-300"
            >
              {/* TripAdvisor Logo */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Tripadvisor_logo_2019.svg"
                alt="TripAdvisor Logo"
                className="h-8 w-8" // Logo size
              />
              <div className="flex items-center">
                <Star size={20} weight="fill" />
                <span className="text-lg">{ratings.tripAdvisor}</span> {/* Dynamic rating */}
              </div>
            </a>

            {/* Yelp Logo and Stars */}
            <a
              href="https://www.yelp.com/biz/waterfront-bicycle-shop-new-york"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white flex items-center space-x-2 hover:text-gray-300"
            >
              {/* Yelp Logo */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/84/Yelp_Logo_2019.png"
                alt="Yelp Logo"
                className="h-8 w-8" // Logo size
              />
              <div className="flex items-center">
                <Star size={20} weight="fill" />
                <span className="text-lg">{ratings.yelp}</span> {/* Dynamic rating */}
              </div>
            </a>
          </div>

          {/* Kayak Badge */}
          <KayakBadge />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
