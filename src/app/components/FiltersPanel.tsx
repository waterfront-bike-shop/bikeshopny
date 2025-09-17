"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";

interface Filters {
  searchTerm: string;
  selectedCategory: string;
  selectedManufacturer: string;
  maxPrice: number;
}

interface FiltersPanelProps {
  filters: Filters;
  categories: { categoryID: string; name: string }[];
  manufacturers: { manufacturerID: string; name: string }[];
  onChange: (updated: Filters) => void;
}

export default function FiltersPanel({
  filters,
  categories,
  manufacturers,
  onChange,
}: FiltersPanelProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Use a generic type TKey to link the key and value types
  const update = <TKey extends keyof Filters>(key: TKey, value: Filters[TKey]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="lg:w-64 mb-6 lg:mb-0">
      {/* Toggle on mobile */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg w-full justify-center"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.searchTerm}
              onChange={(e) => update("searchTerm", e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
          <select
            value={filters.selectedCategory}
            onChange={(e) => update("selectedCategory", e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryID} value={c.categoryID}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manufacturer */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Manufacturer</label>
          <select
            value={filters.selectedManufacturer}
            onChange={(e) => update("selectedManufacturer", e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Manufacturers</option>
            {manufacturers.map((m) => (
              <option key={m.manufacturerID} value={m.manufacturerID}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Max Price: ${filters.maxPrice}
          </label>
          <input
            type="range"
            min="0"
            max="5000"
            step="25"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}