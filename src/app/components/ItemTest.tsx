// ItemTest.tsx
import { useEffect, useState } from "react";
import FiltersPanel from "./FiltersPanel";
import FeaturedCategoriesNav from "./FeaturedCategoriesNav";

interface ItemPrice {
  amount: string;
  useTypeID: string;
  useType: string;
}

interface Item {
  itemID: string;
  systemSku: string;
  description: string;
  categoryID: string;
  manufacturerID: string;
  Prices: { ItemPrice: ItemPrice[] };
}

const ITEMS_PER_PAGE = 20;

const FEATURED_CATEGORIES = [
  "Show All",
  "Tires",
  "Locks",
  "Tubes",
  "Helmets",
  "Wheels",
  "Brake Pads",
  "Chains",
  "Tools",
  "Saddles",
  "Lights",
];

const ItemTest = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<
    { categoryID: string; name: string }[]
  >([]);
  const [manufacturers, setManufacturers] = useState<
    { manufacturerID: string; name: string }[]
  >([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedCategory: "all",
    selectedManufacturer: "all",
    maxPrice: 5000,
  });

  const [activeFeaturedCategory, setActiveFeaturedCategory] = useState<
    string | null
  >("Locks");

  const getDefaultPrice = (prices: { ItemPrice: ItemPrice[] }) => {
    const defaultPrice = prices.ItemPrice.find(
      (p) =>
        p.useType.toLowerCase() === "default" ||
        p.useType.toLowerCase() === "msrp"
    );
    return defaultPrice ? parseFloat(defaultPrice.amount) : 0;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [itemsRes, categoriesRes, manufacturersRes, imagesRes] =
          await Promise.all([
            fetch("/api/shopdata/allItems"),
            fetch("/api/shopdata/categories"),
            fetch("/api/shopdata/manufacturers"),
            fetch("/api/shopdata/imageDownloadFilelist"),
          ]);

        const itemsJson = await itemsRes.json();
        const categoriesJson = await categoriesRes.json();
        const manufacturersJson = await manufacturersRes.json();
        const imagesJson = await imagesRes.json();

        setItems(itemsJson.data);
        setCategories(categoriesJson.data);
        setManufacturers(manufacturersJson.data);

        // Build image map: map itemID -> first image found
        let imageList: { filename: string }[] = [];

        if (Array.isArray(imagesJson)) {
          imageList = imagesJson;
        } else if (Array.isArray(imagesJson.data)) {
          imageList = imagesJson.data;
        } else {
          console.warn("Unexpected images response:", imagesJson);
        }

        const imageMap: Record<string, string> = {};
        imageList.forEach((img) => {
          const itemID = img.filename.split("_")[0]; // filename starts with itemID
          if (!imageMap[itemID]) {
            imageMap[itemID] = `/images/product/${img.filename}`;
          }
        });

        setImages(imageMap);
        console.log("Loaded images:", imageMap);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-slate-600">
            Loading inventory...
          </p>
        </div>
      </div>
    );

  const filteredItems = items.filter((item) => {
    const price = getDefaultPrice(item.Prices);
    if (price <= 0) return false;

    const matchesSearch =
      !filters.searchTerm ||
      item.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      item.systemSku.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const categoryName = categories.find(
      (c) => c.categoryID === item.categoryID
    )?.name;

    const matchesFeaturedCategory =
      !activeFeaturedCategory || activeFeaturedCategory === "Show All"
        ? true
        : categoryName?.toLowerCase() === activeFeaturedCategory.toLowerCase();

    const matchesSelectedCategory =
      filters.selectedCategory === "all"
        ? true
        : item.categoryID === filters.selectedCategory;

    const matchesManufacturer =
      filters.selectedManufacturer === "all" ||
      item.manufacturerID === filters.selectedManufacturer;

    const matchesPrice = price <= filters.maxPrice;

    return (
      matchesSearch &&
      matchesFeaturedCategory &&
      matchesSelectedCategory &&
      matchesManufacturer &&
      matchesPrice
    );
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* --- Featured Categories Nav --- */}
      <FeaturedCategoriesNav
        categories={FEATURED_CATEGORIES}
        activeCategory={activeFeaturedCategory || "Show All"}
        onSelectCategory={(cat) =>
          setActiveFeaturedCategory(cat === "Show All" ? null : cat)
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* --- Filters Panel --- */}
        <div className="lg:w-1/4">
          <FiltersPanel
            filters={filters}
            categories={categories}
            manufacturers={manufacturers}
            onChange={(f) => {
              setFilters(f);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* --- Product Grid --- */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedItems.map((item) => {
              const price = getDefaultPrice(item.Prices);
              const imageUrl =
                images[String(item.itemID)] || "/images/placeholder.png";

              return (
                <div
                  key={item.itemID}
                  className="border p-4 rounded shadow-sm bg-white"
                >
                  <div className="w-full h-[200px] mb-2 overflow-hidden rounded">
                    <img
                      src={imageUrl}
                      alt={item.description}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold">{item.description}</h3>
                  <p className="text-sm text-gray-500">SKU: {item.systemSku}</p>
                  <p className="mt-2 font-semibold">${price.toFixed(2)}</p>
                </div>
              );
            })}
          </div>

          {/* --- Pagination --- */}
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
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
