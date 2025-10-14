// FeaturedCategoriesNav.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const FeaturedCategoriesNav: React.FC<Props> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <nav className="flex gap-4 overflow-x-auto mb-6 py-2">
      {categories.map((cat) => (
        <Button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          variant={activeCategory === cat ? "default" : "outline"}
          className={`whitespace-nowrap px-4 py-2 font-medium ${
            activeCategory === cat
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {cat}
        </Button>
      ))}
    </nav>
  );
};

export default FeaturedCategoriesNav;
