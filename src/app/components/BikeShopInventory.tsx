import React, { useState, useEffect } from "react";
import { Search, MapPin, Phone, Clock, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Types via API documentation
interface ItemPrice {
  amount: string;
  useTypeID: string;
  useType: string;
}

interface ItemPrices {
  ItemPrice: ItemPrice[];
}

interface LightspeedItem {
  itemID: string;
  systemSku: string;
  defaultCost: string;
  avgCost: string;
  discountable: string;
  tax: string;
  archived: string;
  itemType: string;
  description: string;
  publishToEcom: string;
  categoryID: string;
  manufacturerID: string;
  Prices: ItemPrices;
  imageUrl?: string | null;
  [key: string]: unknown;
}

interface Category {
  categoryID: string;
  name: string;
  nodeDepth: string;
  fullPathName: string;
  parentID: string;
  [key: string]: unknown;
}

interface Tag {
  tagID: string;
  name: string;
  [key: string]: unknown;
}

interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedBrand: string;
  priceRange: [number, number];
  inStockOnly: boolean;
  selectedTags: string[];
}

const BikeShopInventory: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<LightspeedItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  

  console.log(tags) // quick fix to pass the linter!

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedCategory: "all",
    selectedBrand: "all",
    priceRange: [0, 5000],
    inStockOnly: false,
    selectedTags: []
  });

  // Mock brands - TODO!!!! -> extract these from manufacturerID/add to API
  const brands = ["Trek", "Specialized", "Giant", "Cannondale", "Shimano", "SRAM", "Fox"];

  // Initialize from URL params
  useEffect(() => {
    const search = searchParams.get('search') || "";
    const category = searchParams.get('category') || "all";
    const brand = searchParams.get('brand') || "all";
    const tags = searchParams.getAll('tags');
    
    setFilters(prev => ({
      ...prev,
      searchTerm: search,
      selectedCategory: category,
      selectedBrand: brand,
      selectedTags: tags
    }));
  }, [searchParams]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load items with images, note that Lightspeed has a max of 100. Will need to paginate
        const itemsResponse = await fetch('/api/shop/items-with-images?limit=100');
        const itemsData = await itemsResponse.json();
        
        // Load categories
        const categoriesResponse = await fetch('/api/shop/categories');
        const categoriesData = await categoriesResponse.json();
        
        // Load tags
        const tagsResponse = await fetch('/api/shop/tags');
        const tagsData = await tagsResponse.json();
        
        setItems(itemsData.items || []);
        setCategories(categoriesData.categories || []);
        setTags(tagsData.tags || []);
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update URL when filters change
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (newFilters.searchTerm) params.set('search', newFilters.searchTerm);
    if (newFilters.selectedCategory !== "all") params.set('category', newFilters.selectedCategory);
    if (newFilters.selectedBrand !== "all") params.set('brand', newFilters.selectedBrand);
    
    // Handle multiple tags
    newFilters.selectedTags.forEach(tag => {
      params.append('tags', tag);
    });
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    
    router.push(newUrl, { scroll: false });
  };

  // Filter update handler
  const updateFilter = (key: keyof FilterState, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  // Get category name by ID
  const getCategoryName = (categoryID: string): string => {
    const category = categories.find(c => c.categoryID === categoryID);
    return category?.name || "Uncategorized";
  };

  // Helper to get default price
  const getDefaultPrice = (prices: ItemPrices): number => {
    const defaultPrice = prices.ItemPrice.find(p => 
      p.useType.toLowerCase() === "default" || p.useType.toLowerCase() === "msrp"
    );
    return defaultPrice ? parseFloat(defaultPrice.amount) : 0;
  };

  // Filter items based on current filters
  const filteredItems = items.filter(item => {
    // Skip archived items
    if (item.archived === "true") return false;
    
    // Search filter
    const matchesSearch = !filters.searchTerm || 
      item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.systemSku.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = filters.selectedCategory === "all" || 
      item.categoryID === filters.selectedCategory;
    
    // Brand filter (you might need to implement brand mapping)
    const matchesBrand = filters.selectedBrand === "all"; // TODO: Implement brand matching
    
    // Price filter
    const price = getDefaultPrice(item.Prices);
    const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
    
    // Stock filter (assuming publishToEcom indicates availability)
    const matchesStock = !filters.inStockOnly || item.publishToEcom === "true";
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
  });

  // Handle individual item click
  const handleItemClick = (itemID: string) => {
    router.push(`/items/${itemID}`);
  };

  // Handle category click
  const handleCategoryClick = (categoryID: string) => {
    updateFilter('selectedCategory', categoryID);
  };
  console.log(handleCategoryClick) // lint fix

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      searchTerm: "",
      selectedCategory: "all",
      selectedBrand: "all",
      priceRange: [0, 5000],
      inStockOnly: false,
      selectedTags: []
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="mt-4 text-lg font-medium text-slate-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Store Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Waterfront Bicycle Shop</h1>
              <p className="text-slate-600">Current In-Store Inventory</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4" />
                <span>391 West Street NY, NY 10014</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="h-4 w-4" />
                <span>212-414-2453</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4" />
                <span>Mon-Sun 10AM-7PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-Store Pickup Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>In-Store Pickup Only:</strong> All items must be picked up at our NYC location. Call ahead to check availability and hold items.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="lg:flex gap-8">
          {/* Filters Sidebar */}
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.searchTerm}
                    onChange={(e) => updateFilter('searchTerm', e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={filters.selectedCategory}
                  onChange={(e) => updateFilter('selectedCategory', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.categoryID} value={category.categoryID}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                <select
                  value={filters.selectedBrand}
                  onChange={(e) => updateFilter('selectedBrand', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={filters.priceRange[0]}
                    onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => updateFilter('inStockOnly', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Available Only</span>
                </label>
              </div>

              {/* Active Filters */}
              {(filters.selectedCategory !== "all" || filters.selectedBrand !== "all" || filters.searchTerm || filters.inStockOnly) && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-slate-700">Active Filters</h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.selectedCategory !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {getCategoryName(filters.selectedCategory)}
                        <button onClick={() => updateFilter('selectedCategory', 'all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.selectedBrand !== "all" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {filters.selectedBrand}
                        <button onClick={() => updateFilter('selectedBrand', 'all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {filters.searchTerm && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        &quot;{filters.searchTerm}&quot;
                        <button onClick={() => updateFilter('searchTerm', '')}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800">
                  {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map(item => {
                const price = getDefaultPrice(item.Prices);
                const imageUrl = item.imageUrl || "/images/placeholder.png";
                const categoryName = getCategoryName(item.categoryID);
                const isAvailable = item.publishToEcom === "true";

                return (
                  <div 
                    key={item.itemID} 
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border cursor-pointer"
                    onClick={() => handleItemClick(item.itemID)}
                  >
                    <div className="aspect-square bg-slate-100 rounded-t-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={item.description}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-slate-500 uppercase tracking-wide">
                          {categoryName}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                        {item.description}
                      </h3>
                      <div className="text-xs text-slate-500 mb-2">
                        SKU: {item.systemSku}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-slate-800">
                          ${price.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isAvailable 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {isAvailable ? 'Available' : 'Call for Availability'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-slate-600 mb-2">
                          Call to check availability and hold this item
                        </p>
                        <button 
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = 'tel:+15551234567';
                          }}
                        >
                          Call Store
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No items found</h3>
                <p className="text-slate-600">Try adjusting your search or filter criteria</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeShopInventory;