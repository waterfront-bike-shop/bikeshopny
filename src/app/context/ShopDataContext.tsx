"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
const ShopDataContext = createContext<ShopDataContextType | undefined>(undefined);

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
    setError(null);

    try {
      const [itemsRes, categoriesRes, manufacturersRes] = await Promise.all([
        fetch("/api/shopdata/allItems"),
        fetch("/api/shopdata/categories"),
        fetch("/api/shopdata/manufacturers"),
      ]);

      const [itemsJson, categoriesJson, manufacturersJson] = await Promise.all([
        itemsRes.json(),
        categoriesRes.json(),
        manufacturersRes.json(),
      ]);

      setAllItems(itemsJson.data || []);
      setCategories(categoriesJson.data || []);
      setManufacturers(manufacturersJson.data || []);
    } catch (err) {
      console.error("Error fetching shop data:", err);
      setError("Failed to fetch shop data.");
    } finally {
      setLoading(false);
    }
  };

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