// FeaturedCategoriesNav.tsx
import React from "react";

interface Props {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const FeaturedCategoriesNav: React.FC<Props> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <nav className="flex gap-4 overflow-x-auto mb-6 py-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
            activeCategory === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
};

export default FeaturedCategoriesNav;
