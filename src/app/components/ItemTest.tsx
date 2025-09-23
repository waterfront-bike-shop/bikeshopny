"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FiltersPanel from "./FiltersPanel";
import FeaturedCategoriesNav from "./FeaturedCategoriesNav";

interface ItemPrice {
  amount: string;
  useType: string;
}

interface Item {
  itemID: string;
  description: string;
  categoryID: string;
  manufacturerID: string;
  Prices: { ItemPrice: ItemPrice[] };
}

interface Filters {
  searchTerm: string;
  selectedCategory: string;
  selectedManufacturer: string;
  maxPrice: number;
}

const ITEMS_PER_PAGE = 20;

const FEATURED_CATEGORIES = [
  "Show All",
  "Tires",
  "Locks",
  "Tubes",
  "Helmets",
  "Wheels",
  "Brakes",
  "Chain",
  "Tools",
  "Saddles",
  "Lights",
];

const ItemTest = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<{ categoryID: string; name: string }[]>([]);
  const [manufacturers, setManufacturers] = useState<{ manufacturerID: string; name: string }[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const initialCategoryParam = searchParams.get("category");
  const defaultCategory = initialCategoryParam
    ? initialCategoryParam.charAt(0).toUpperCase() + initialCategoryParam.slice(1)
    : "Locks";

  const [activeFeaturedCategory, setActiveFeaturedCategory] = useState<string | null>(
    defaultCategory === "Show All" ? null : defaultCategory
  );

  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    selectedCategory: "all",
    selectedManufacturer: "all",
    maxPrice: 5000,
  });

  const gridRef = useRef<HTMLDivElement>(null);

  // Smooth scroll on page change
  useEffect(() => {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  // Helper to get default price
  const getDefaultPrice = (prices: { ItemPrice: ItemPrice[] }) => {
    const defaultPrice = prices.ItemPrice.find((p) =>
      ["default", "msrp"].includes(p.useType.toLowerCase())
    );
    return defaultPrice ? parseFloat(defaultPrice.amount) : 0;
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [itemsRes, categoriesRes, manufacturersRes, imagesRes] = await Promise.all([
          fetch("/api/shopdata/allItems"),
          fetch("/api/shopdata/categories"),
          fetch("/api/shopdata/manufacturers"),
          fetch("/api/shopdata/imageDownloadFilelist"),
        ]);

        const itemsJson = await itemsRes.json();
        const categoriesJson = await categoriesRes.json();
        const manufacturersJson = await manufacturersRes.json();
        const imagesJson = await imagesRes.json();

        // Build image map
        const imageList: { filename: string }[] = Array.isArray(imagesJson) ? imagesJson : imagesJson.data || [];
        const imageMap: Record<string, string> = {};
        imageList.forEach((img) => {
          const itemID = img.filename.split("_")[0];
          if (!imageMap[itemID]) imageMap[itemID] = `/images/product/${img.filename}`;
        });

        setItems(itemsJson.data);
        setCategories(categoriesJson.data);
        setManufacturers(manufacturersJson.data);
        setImages(imageMap);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-slate-600">Loading inventory...</p>
        </div>
      </div>
    );

  // Filter items and compute price
  const filteredItems = items
    .map((item) => ({ ...item, price: getDefaultPrice(item.Prices) }))
    .filter((item) => item.price > 0)
    .filter((item) => {
      const categoryName = categories.find((c) => c.categoryID === item.categoryID)?.name;

      const matchesFeaturedCategory =
        !activeFeaturedCategory || activeFeaturedCategory === "Show All"
          ? true
          : categoryName?.toLowerCase() === activeFeaturedCategory.toLowerCase();

      const matchesSelectedCategory =
        filters.selectedCategory === "all" ? true : item.categoryID === filters.selectedCategory;

      const matchesManufacturer =
        filters.selectedManufacturer === "all" || item.manufacturerID === filters.selectedManufacturer;

      const matchesSearch =
        !filters.searchTerm || item.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesPrice = item.price <= filters.maxPrice;

      return matchesFeaturedCategory && matchesSelectedCategory && matchesManufacturer && matchesSearch && matchesPrice;
    });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    const newCategory = cat === "Show All" ? null : cat;
    setActiveFeaturedCategory(newCategory);
    setFilters((prev) => ({ ...prev, selectedCategory: "all" }));
    setCurrentPage(1);

    const url = newCategory ? `/shop?category=${newCategory.toLowerCase()}` : "/shop";
    router.replace(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      <FeaturedCategoriesNav
        categories={FEATURED_CATEGORIES}
        activeCategory={activeFeaturedCategory || "Show All"}
        onSelectCategory={handleCategoryChange}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <FiltersPanel
            filters={filters}
            categories={categories}
            manufacturers={manufacturers}
            onChange={(f) => {
              setFilters(f);
              setCurrentPage(1);

              if (f.selectedCategory !== "all") {
                setActiveFeaturedCategory(null);
                const categoryName = categories.find((c) => c.categoryID === f.selectedCategory)?.name;
                if (categoryName) router.replace(`/shop?category=${categoryName.toLowerCase()}`);
              } else {
                router.replace("/shop");
              }
            }}
          />
        </div>

        <div className="flex-1">
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6" style={{ scrollMarginTop: "80px" }}>
            {paginatedItems.map((item) => (
              <div key={item.itemID} className="border p-4 rounded shadow-sm bg-white">
                <div className="w-full aspect-square mb-2 overflow-hidden rounded flex items-center justify-center bg-white">
                  <img
                    src={images[item.itemID] || "/images/placeholder.png"}
                    alt={item.description}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-bold">{item.description}</h3>
                <p className="mt-2 font-semibold">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemTest;
