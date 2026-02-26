"use client";

import { useState, useMemo } from "react";
import { Search, Filter, X } from "lucide-react"; // Added X icon

const PINNED_MANUFACTURERS = [
  "Brooks",
  "Kryptonite",
  "Park Tool",
  "Shimano",
  "Selle Royal",
  "Magic Shine",
  "Fizik",
  "Pinhead",
];

// 1. Define the "Zero" state
const DEFAULT_FILTERS: Filters = {
  searchTerm: "",
  selectedCategory: "all",
  selectedManufacturer: "all",
  maxPrice: 5000,
};

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

  // 2. Check if the user has changed anything
  const isFiltered = useMemo(() => {
    return (
      filters.searchTerm !== DEFAULT_FILTERS.searchTerm ||
      filters.selectedCategory !== DEFAULT_FILTERS.selectedCategory ||
      filters.selectedManufacturer !== DEFAULT_FILTERS.selectedManufacturer
    );
  }, [filters]);

  const sortedManufacturers = useMemo(() => {
    const allSorted = [...manufacturers].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const pinned = allSorted.filter((m) =>
      PINNED_MANUFACTURERS.some(
        (p) => p.toLowerCase() === m.name.toLowerCase(),
      ),
    );

    return { pinned, allSorted };
  }, [manufacturers]);

  const update = <TKey extends keyof Filters>(
    key: TKey,
    value: Filters[TKey],
  ) => {
    onChange({ ...filters, [key]: value });
  };

  // 3. Reset function
  const handleClearAll = () => {
    onChange(DEFAULT_FILTERS);
  };

  return (
    <div className="lg:w-64 mb-6 lg:mb-0">
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.searchTerm}
              onChange={(e) => update("searchTerm", e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            value={filters.selectedCategory}
            onChange={(e) => update("selectedCategory", e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => (
                <option key={c.categoryID} value={c.categoryID}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        {/* Manufacturer */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Manufacturer
          </label>
          <select
            value={filters.selectedManufacturer}
            onChange={(e) => update("selectedManufacturer", e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Manufacturers</option>
            {sortedManufacturers.pinned.length > 0 && (
              <>
                <optgroup label="Featured Brands">
                  {sortedManufacturers.pinned.map((m) => (
                    <option key={`pinned-${m.manufacturerID}`} value={m.manufacturerID}>
                      {m.name}
                    </option>
                  ))}
                </optgroup>
                <option disabled>──────────</option>
              </>
            )}
            {sortedManufacturers.allSorted.map((m) => (
              <option key={m.manufacturerID} value={m.manufacturerID}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Clear Filters Button */}
        {isFiltered && (
          <button
            onClick={handleClearAll}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors border border-slate-200"
          >
            <X className="h-4 w-4" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}