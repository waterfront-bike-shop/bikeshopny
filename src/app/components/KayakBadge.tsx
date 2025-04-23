import React from "react";

const KayakBadge: React.FC = () => {
  return (
    <div className="flex flex-col items-start">
      <a
        href="https://www.kayak.com/New-York.15830.guide"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <img
          height="150"
          // src="https://content.r9cdn.net/rimg/seo/badges/v1/DARK_LARGE_FEATURED_KAYAK.png" //Switch to this for the Black background
          src="https://content.r9cdn.net/rimg/seo/badges/v1/ORANGE_LARGE_FEATURED_KAYAK.png"
          alt="Featured on Kayak Guides badge."
          className="w-auto h-36"
        />
      </a>
      <a
        href="https://www.kayak.com/New-York.15830.guide/west-village-guide"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-200 mt-2 underline hover:text-gray-700 transition"
      >
        Check out the neighborhood via Kayak!
      </a>
    </div>
  );
};

export default KayakBadge;