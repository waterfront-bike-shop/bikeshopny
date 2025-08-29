import React, { useState, useEffect } from "react";
import { Search, MapPin, Phone, Clock, Filter, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Types
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
  hasImageOnly: boolean; // Corrected: No trailing comma or syntax error
}

const DEFAULT_ITEMS_PER_PAGE = 20;
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

// Corrected: The main component function is now correctly defined
const BikeShopInventory: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<LightspeedItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  console.log("Tags: ",tags) // temp eslint workaround
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // Corrected: Initial state with `hasImageOnly` set to false
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedCategory: "all",
    selectedBrand: "all",
    priceRange: [0, 5000],
    inStockOnly: false,
    selectedTags: [],
    hasImageOnly: false // Corrected: Added to initial state
  });

  const brands = ["Trek", "Specialized", "Giant", "Cannondale", "Shimano", "SRAM", "Fox"];

  // Function to fetch and cache data
  const refreshData = async () => {
    try {
      setLoading(true);
      console.log("Fetching new data from API...");
      
      const itemsResponse = await fetch('/api/shop/items-with-images');
      const itemsData = await itemsResponse.json();
      
      const categoriesResponse = await fetch('/api/shop/categories');
      const categoriesData = await categoriesResponse.json();

      const tagsResponse = await fetch('/api/shop/tags');
      const tagsData = await tagsResponse.json();

      // Update state
      setItems(itemsData.items || []);
      setCategories(categoriesData.categories || []);
      setTags(tagsData.tags || []);

      // Save data to localStorage
      localStorage.setItem('ls_items', JSON.stringify(itemsData.items || []));
      localStorage.setItem('ls_categories', JSON.stringify(categoriesData.categories || []));
      localStorage.setItem('ls_tags', JSON.stringify(tagsData.tags || []));
      
    } catch (error) {
      console.error('Error loading or caching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear cache and trigger a refresh
  const handleRefreshClick = () => {
    console.log("Clearing localStorage cache and fetching fresh data.");
    localStorage.removeItem('ls_items');
    localStorage.removeItem('ls_categories');
    localStorage.removeItem('ls_tags');
    refreshData();
  };

  // Initialize filters from URL
  useEffect(() => {
    const search = searchParams.get('search') || "";
    const category = searchParams.get('category') || "all";
    const brand = searchParams.get('brand') || "all";
    const tags = searchParams.getAll('tags');
    // Corrected: Read the boolean value from the URL
    const hasImageOnly = searchParams.get('hasImageOnly') === 'true'; 

    setFilters(prev => ({
      ...prev,
      searchTerm: search,
      selectedCategory: category,
      selectedBrand: brand,
      selectedTags: tags,
      hasImageOnly: hasImageOnly // Corrected: Assign the parsed value
    }));
  }, [searchParams]);

  // Load initial data with caching logic
  useEffect(() => {
    const cachedItems = localStorage.getItem('ls_items');
    const cachedCategories = localStorage.getItem('ls_categories');
    const cachedTags = localStorage.getItem('ls_tags');

    if (cachedItems && cachedCategories && cachedTags) {
      setItems(JSON.parse(cachedItems));
      setCategories(JSON.parse(cachedCategories));
      setTags(JSON.parse(cachedTags));
      console.log("Using cached data from localStorage.");
      setLoading(false);
    } else {
      refreshData();
    }
  }, []);

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (newFilters.searchTerm) params.set('search', newFilters.searchTerm);
    if (newFilters.selectedCategory !== "all") params.set('category', newFilters.selectedCategory);
    if (newFilters.selectedBrand !== "all") params.set('brand', newFilters.selectedBrand);
    if (newFilters.hasImageOnly) params.set('hasImageOnly', 'true'); // Corrected: Set the URL parameter
    newFilters.selectedTags.forEach(tag => params.append('tags', tag));
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    router.push(newUrl, { scroll: false });
  };

  const updateFilter = (key: keyof FilterState, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
    setCurrentPage(1);
  };

  const getCategoryName = (categoryID: string): string => {
    const category = categories.find(c => c.categoryID === categoryID);
    return category?.name || "Uncategorized";
  };

  const getDefaultPrice = (prices: ItemPrices): number => {
    const defaultPrice = prices.ItemPrice.find(p => 
      p.useType.toLowerCase() === "default" || p.useType.toLowerCase() === "msrp"
    );
    return defaultPrice ? parseFloat(defaultPrice.amount) : 0;
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (item.archived === "true") return false;
    const matchesSearch = !filters.searchTerm || 
      item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.systemSku.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesCategory = filters.selectedCategory === "all" || item.categoryID === filters.selectedCategory;
    const matchesBrand = filters.selectedBrand === "all";
    const price = getDefaultPrice(item.Prices);
    const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
    const matchesStock = !filters.inStockOnly || item.publishToEcom === "true";
    // Corrected: The filter logic to check if an image exists
    const matchesImage = !filters.hasImageOnly || (item.imageUrl && item.imageUrl !== "/images/placeholder.png");
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock && matchesImage; // Corrected: Added the new filter check
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleItemClick = (itemID: string) => router.push(`shop/items/${itemID}`);
  const clearAllFilters = () => {
    const cleared: FilterState = {
      searchTerm: "",
      selectedCategory: "all",
      selectedBrand: "all",
      priceRange: [0, 5000],
      inStockOnly: false,
      selectedTags: [],
      hasImageOnly: false // Corrected: Reset the new filter
    };
    setFilters(cleared);
    updateURL(cleared);
    setCurrentPage(1);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        <p className="mt-4 text-lg font-medium text-slate-600">Loading inventory...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- Store Header & Info --- */}
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

      {/* --- In-Store Pickup Notice --- */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm text-blue-700">
            <strong>In-Store Pickup Only:</strong> All items must be picked up at our NYC location. Call ahead to check availability and hold items.
          </p>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="lg:flex gap-8">
          {/* --- Filters Sidebar --- */}
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
              {/* --- Search --- */}
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

              {/* --- Category --- */}
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

              {/* --- Brand --- */}
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

              {/* --- Price Range --- */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={filters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                  className="w-full mb-2"
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

              {/* --- Availability --- */}
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
              
              {/* Corrected: Added the "Items with Images" filter with correct syntax */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.hasImageOnly}
                    onChange={(e) => updateFilter('hasImageOnly', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Show Items with Images</span>
                </label>
              </div>

              {/* --- Refresh Button --- */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <button
                  onClick={handleRefreshClick}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 border rounded-lg w-full justify-center text-slate-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Inventory
                </button>
              </div>
            </div>
          </div>

          {/* --- Product Grid --- */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
              </h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-700">Items per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="p-1 border rounded"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedItems.map(item => {
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
                      <img src={imageUrl} alt={item.description} className="w-full h-full object-cover"/>
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-slate-500 uppercase tracking-wide">{categoryName}</span>
                      <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{item.description}</h3>
                      <div className="text-xs text-slate-500 mb-2">SKU: {item.systemSku}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-slate-800">${price.toFixed(2)}</div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isAvailable ? 'Available' : 'Call for Availability'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 inline"/>
                </button>
                <span className="text-sm">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4 inline"/>
                </button>
              </div>
            )}

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

// import React, { useState, useEffect } from "react";
// import { Search, MapPin, Phone, Clock, Filter, ChevronLeft, ChevronRight } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";

// // Types
// interface ItemPrice {
//   amount: string;
//   useTypeID: string;
//   useType: string;
// }

// interface ItemPrices {
//   ItemPrice: ItemPrice[];
// }

// interface LightspeedItem {
//   itemID: string;
//   systemSku: string;
//   defaultCost: string;
//   avgCost: string;
//   discountable: string;
//   tax: string;
//   archived: string;
//   itemType: string;
//   description: string;
//   publishToEcom: string;
//   categoryID: string;
//   manufacturerID: string;
//   Prices: ItemPrices;
//   imageUrl?: string | null;
//   [key: string]: unknown;
// }

// interface Category {
//   categoryID: string;
//   name: string;
//   nodeDepth: string;
//   fullPathName: string;
//   parentID: string;
//   [key: string]: unknown;
// }

// interface Tag {
//   tagID: string;
//   name: string;
//   [key: string]: unknown;
// }

// interface FilterState {
//   searchTerm: string;
//   selectedCategory: string;
//   selectedBrand: string;
//   priceRange: [number, number];
//   inStockOnly: boolean;
//   selectedTags: string[];
// }

// const DEFAULT_ITEMS_PER_PAGE = 20;
// const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

// const BikeShopInventory: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [items, setItems] = useState<LightspeedItem[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [tags, setTags] = useState<Tag[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
//   console.log(tags)

//   // Filter state
//   const [filters, setFilters] = useState<FilterState>({
//     searchTerm: "",
//     selectedCategory: "all",
//     selectedBrand: "all",
//     priceRange: [0, 5000],
//     inStockOnly: false,
//     selectedTags: []
//   });

//   const brands = ["Trek", "Specialized", "Giant", "Cannondale", "Shimano", "SRAM", "Fox"];

//   // Initialize filters from URL
//   useEffect(() => {
//     const search = searchParams.get('search') || "";
//     const category = searchParams.get('category') || "all";
//     const brand = searchParams.get('brand') || "all";
//     const tags = searchParams.getAll('tags');
//     setFilters(prev => ({
//       ...prev,
//       searchTerm: search,
//       selectedCategory: category,
//       selectedBrand: brand,
//       selectedTags: tags
//     }));
//   }, [searchParams]);

//   // Load initial data
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const itemsResponse = await fetch('/api/shop/items-with-images?limit=1000');
//         const itemsData = await itemsResponse.json();
//         const categoriesResponse = await fetch('/api/shop/categories');
//         const categoriesData = await categoriesResponse.json();
//         const tagsResponse = await fetch('/api/shop/tags');
//         const tagsData = await tagsResponse.json();
//         setItems(itemsData.items || []);
//         setCategories(categoriesData.categories || []);
//         setTags(tagsData.tags || []);
//       } catch (error) {
//         console.error('Error loading data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   const updateURL = (newFilters: FilterState) => {
//     const params = new URLSearchParams();
//     if (newFilters.searchTerm) params.set('search', newFilters.searchTerm);
//     if (newFilters.selectedCategory !== "all") params.set('category', newFilters.selectedCategory);
//     if (newFilters.selectedBrand !== "all") params.set('brand', newFilters.selectedBrand);
//     newFilters.selectedTags.forEach(tag => params.append('tags', tag));
//     const queryString = params.toString();
//     const newUrl = queryString ? `?${queryString}` : window.location.pathname;
//     router.push(newUrl, { scroll: false });
//   };

//   const updateFilter = (key: keyof FilterState, value: unknown) => {
//     const newFilters = { ...filters, [key]: value };
//     setFilters(newFilters);
//     updateURL(newFilters);
//     setCurrentPage(1); // reset page
//   };

//   const getCategoryName = (categoryID: string): string => {
//     const category = categories.find(c => c.categoryID === categoryID);
//     return category?.name || "Uncategorized";
//   };

//   const getDefaultPrice = (prices: ItemPrices): number => {
//     const defaultPrice = prices.ItemPrice.find(p => 
//       p.useType.toLowerCase() === "default" || p.useType.toLowerCase() === "msrp"
//     );
//     return defaultPrice ? parseFloat(defaultPrice.amount) : 0;
//   };

//   // Filter items
//   const filteredItems = items.filter(item => {
//     if (item.archived === "true") return false;
//     const matchesSearch = !filters.searchTerm || 
//       item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
//       item.systemSku.toLowerCase().includes(filters.searchTerm.toLowerCase());
//     const matchesCategory = filters.selectedCategory === "all" || item.categoryID === filters.selectedCategory;
//     const matchesBrand = filters.selectedBrand === "all"; // TODO: brand mapping
//     const price = getDefaultPrice(item.Prices);
//     const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
//     const matchesStock = !filters.inStockOnly || item.publishToEcom === "true";
//     return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
//   });

//   const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
//   const paginatedItems = filteredItems.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleItemClick = (itemID: string) => router.push(`/items/${itemID}`);
//   const clearAllFilters = () => {
//     const cleared: FilterState = {
//       searchTerm: "",
//       selectedCategory: "all",
//       selectedBrand: "all",
//       priceRange: [0, 5000],
//       inStockOnly: false,
//       selectedTags: []
//     };
//     setFilters(cleared);
//     updateURL(cleared);
//     setCurrentPage(1);
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
//         <p className="mt-4 text-lg font-medium text-slate-600">Loading inventory...</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* --- Store Header & Info --- */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-800">Waterfront Bicycle Shop</h1>
//               <p className="text-slate-600">Current In-Store Inventory</p>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-4 text-sm">
//               <div className="flex items-center gap-2 text-slate-600">
//                 <MapPin className="h-4 w-4" />
//                 <span>391 West Street NY, NY 10014</span>
//               </div>
//               <div className="flex items-center gap-2 text-slate-600">
//                 <Phone className="h-4 w-4" />
//                 <span>212-414-2453</span>
//               </div>
//               <div className="flex items-center gap-2 text-slate-600">
//                 <Clock className="h-4 w-4" />
//                 <span>Mon-Sun 10AM-7PM</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- In-Store Pickup Notice --- */}
//       <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
//         <div className="max-w-7xl mx-auto px-6">
//           <p className="text-sm text-blue-700">
//             <strong>In-Store Pickup Only:</strong> All items must be picked up at our NYC location. Call ahead to check availability and hold items.
//           </p>
//         </div>
//       </div>

//       {/* --- Main Content --- */}
//       <div className="max-w-7xl mx-auto px-6 py-6">
//         <div className="lg:flex gap-8">
//           {/* --- Filters Sidebar --- */}
//           <div className="lg:w-64 mb-6 lg:mb-0">
//             <div className="lg:hidden mb-4">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg w-full justify-center"
//               >
//                 <Filter className="h-4 w-4" />
//                 {showFilters ? "Hide Filters" : "Show Filters"}
//               </button>
//             </div>

//             <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
//               {/* --- Search --- */}
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={filters.searchTerm}
//                     onChange={(e) => updateFilter('searchTerm', e.target.value)}
//                     className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* --- Category --- */}
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
//                 <select
//                   value={filters.selectedCategory}
//                   onChange={(e) => updateFilter('selectedCategory', e.target.value)}
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="all">All Categories</option>
//                   {categories.map(category => (
//                     <option key={category.categoryID} value={category.categoryID}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* --- Brand --- */}
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
//                 <select
//                   value={filters.selectedBrand}
//                   onChange={(e) => updateFilter('selectedBrand', e.target.value)}
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="all">All Brands</option>
//                   {brands.map(brand => (
//                     <option key={brand} value={brand}>{brand}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* --- Price Range --- */}
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
//                 </label>
//                 <input
//                   type="range"
//                   min="0"
//                   max="5000"
//                   step="50"
//                   value={filters.priceRange[0]}
//                   onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
//                   className="w-full mb-2"
//                 />
//                 <input
//                   type="range"
//                   min="0"
//                   max="5000"
//                   step="50"
//                   value={filters.priceRange[1]}
//                   onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
//                   className="w-full"
//                 />
//               </div>

//               {/* --- Availability --- */}
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={filters.inStockOnly}
//                     onChange={(e) => updateFilter('inStockOnly', e.target.checked)}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="text-sm text-slate-700">Available Only</span>
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* --- Product Grid --- */}
//           <div className="flex-1">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-slate-800">
//                 {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
//               </h2>
//               <div className="flex items-center gap-2">
//                 <label className="text-sm text-slate-700">Items per page:</label>
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
//                   className="p-1 border rounded"
//                 >
//                   {ITEMS_PER_PAGE_OPTIONS.map(opt => (
//                     <option key={opt} value={opt}>{opt}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {paginatedItems.map(item => {
//                 const price = getDefaultPrice(item.Prices);
//                 const imageUrl = item.imageUrl || "/images/placeholder.png";
//                 const categoryName = getCategoryName(item.categoryID);
//                 const isAvailable = item.publishToEcom === "true";

//                 return (
//                   <div
//                     key={item.itemID}
//                     className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border cursor-pointer"
//                     onClick={() => handleItemClick(item.itemID)}
//                   >
//                     <div className="aspect-square bg-slate-100 rounded-t-lg overflow-hidden">
//                       <img src={imageUrl} alt={item.description} className="w-full h-full object-cover"/>
//                     </div>
//                     <div className="p-4">
//                       <span className="text-xs text-slate-500 uppercase tracking-wide">{categoryName}</span>
//                       <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{item.description}</h3>
//                       <div className="text-xs text-slate-500 mb-2">SKU: {item.systemSku}</div>
//                       <div className="flex justify-between items-center">
//                         <div className="text-2xl font-bold text-slate-800">${price.toFixed(2)}</div>
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${
//                           isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                         }`}>
//                           {isAvailable ? 'Available' : 'Call for Availability'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="flex justify-center items-center gap-4 mt-6">
//                 <button
//                   onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                   <ChevronLeft className="h-4 w-4 inline"/>
//                 </button>
//                 <span className="text-sm">{currentPage} / {totalPages}</span>
//                 <button
//                   onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                   <ChevronRight className="h-4 w-4 inline"/>
//                 </button>
//               </div>
//             )}

//             {filteredItems.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="text-4xl mb-4">🔍</div>
//                 <h3 className="text-xl font-semibold text-slate-800 mb-2">No items found</h3>
//                 <p className="text-slate-600">Try adjusting your search or filter criteria</p>
//                 <button
//                   onClick={clearAllFilters}
//                   className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Clear All Filters
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BikeShopInventory;
