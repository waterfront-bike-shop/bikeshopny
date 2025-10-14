"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// --- Types ---
export interface ItemPrice {
  amount: string;
  useType: string;
}

export interface Item {
  itemID: string;
  description: string;
  categoryID: string;
  manufacturerID: string;
  Prices: { ItemPrice: ItemPrice[] };

  // Optional fields for product page
  modelYear?: string;
  upc?: string;
  manufacturerSku?: string;
  systemSku?: string;
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
  imageMap: Record<string, string>;
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
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [itemsRes, categoriesRes, manufacturersRes, imagesRes] = await Promise.all([
        fetch("/api/shopdata/allItems"),
        fetch("/api/shopdata/categories"),
        fetch("/api/shopdata/manufacturers"),
        fetch("/api/shopdata/imageDownloadFilelist"),
      ]);

      const [itemsJson, categoriesJson, manufacturersJson, imagesJson] = await Promise.all([
        itemsRes.json(),
        categoriesRes.json(),
        manufacturersRes.json(),
        imagesRes.json(),
      ]);

      const imageList: { filename: string }[] = Array.isArray(imagesJson)
        ? imagesJson
        : imagesJson.data || [];

      const newImageMap: Record<string, string> = {};
      imageList.forEach((img) => {
        const itemID = img.filename.split("_")[0];
        if (!newImageMap[itemID]) newImageMap[itemID] = `/images/product/${img.filename}`;
      });

      setAllItems(itemsJson.data || []);
      setCategories(categoriesJson.data || []);
      setManufacturers(manufacturersJson.data || []);
      setImageMap(newImageMap);
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
        imageMap,
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
