"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// --- Types ---
export interface Item {
  itemID: string;
  systemSku: string;
  description: string;
  categoryID: string;
  manufacturerID: string;
  modelYear?: string;
  upc?: string;
  manufacturerSku?: string;
  customSku?: string;
  qoh: number; // Total quantity on hand
  images: string[]; // Array of Cloudinary URLs
  prices: {
    amount: string;
    useType: string;
  }[];
}

export interface Category {
  categoryID: string;
  name: string;
}

export interface Manufacturer {
  manufacturerID: string;
  name: string;
}

export interface ShopDataContextType {
  allItems: Item[];
  categories: Category[];
  manufacturers: Manufacturer[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

// --- Context ---
const ShopDataContext = createContext<ShopDataContextType | undefined>(
  undefined,
);

interface ShopDataProviderProps {
  children: ReactNode;
}

export const ShopDataProvider = ({ children }: ShopDataProviderProps) => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [itemsRes, catsRes, mfrsRes] = await Promise.all([
        fetch("/api/shopdata/allItems"),
        fetch("/api/shopdata/categories"),
        fetch("/api/shopdata/manufacturers"),
      ]);

      const itemsJson = await itemsRes.json();
      const catsJson = await catsRes.json();
      const mfrsJson = await mfrsRes.json();

      setAllItems(itemsJson.data || []);
      setCategories(catsJson.data || []);

      // --- STALE-WHILE-REVALIDATE LOGIC ---
      // Step A: If we have a cached list, show it immediately
      if (mfrsJson.cached && mfrsJson.cached.length > 0) {
        setManufacturers(mfrsJson.cached);
      }

      // Step B: Update/Overwrite with the live list
      if (mfrsJson.data && mfrsJson.data.length > 0) {
        setManufacturers(mfrsJson.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ShopDataContext.Provider
      value={{
        allItems,
        categories,
        manufacturers,
        loading,
        error,
        refreshData: fetchData,
      }}
    >
      {children}
    </ShopDataContext.Provider>
  );
};

// --- Hook to consume context ---
export const useShopData = (): ShopDataContextType => {
  const context = useContext(ShopDataContext);
  if (!context) {
    throw new Error("useShopData must be used within a ShopDataProvider");
  }
  return context;
};
