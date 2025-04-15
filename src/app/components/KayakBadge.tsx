import React from "react";

const KayakBadge: React.FC = () => {
  return (
    <a
      href="https://www.kayak.com/New-York.15830.guide"
      target="_blank"
      rel="noopener noreferrer"
      className="block" // Tailwind for making the link a block-level element (optional)
    >
      <img
        height="150"
        // src="https://content.r9cdn.net/rimg/seo/badges/v1/DARK_LARGE_FEATURED_KAYAK.png" //Switch to this for the Black background
        src="https://content.r9cdn.net/rimg/seo/badges/v1/ORANGE_LARGE_FEATURED_KAYAK.png"
        alt="Kayak Featured Badge"
        className="w-auto h-36" // Tailwind for image height set to 150px (h-36 = 9rem)
      />
    </a>
  );
};

export default KayakBadge;
