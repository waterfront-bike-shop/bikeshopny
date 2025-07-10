// src/app/components/ShopItemsDemoImages.tsx
"use client";

import React from "react";

interface ItemPrice {
  amount: string;
  useType: string;
}

interface Prices {
  ItemPrice: ItemPrice[];
}

interface Item {
  itemID: string;
  description: string;
  Prices: Prices;
  imageUrl?: string;
}

const ShopItemsDemoImages: React.FC = () => {
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/shop/items-with-images")
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-screen-xl mx-auto px-6">
      {items.map(item => {
        const priceObj = item.Prices.ItemPrice.find(
          (p: ItemPrice) => p.useType.toLowerCase() === "default"
        );
        const price = priceObj ? `$${priceObj.amount}` : "N/A";

        return (
          <div key={item.itemID} className="border rounded p-4 shadow hover:shadow-lg transition">
            <img
              src={item.imageUrl || "/images/placeholder.png"}
              alt={item.description}
              className="w-full h-48 object-contain mb-3"
            />
            <h2 className="font-semibold">{item.description}</h2>
            <p className="text-green-700 font-bold">{price}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ShopItemsDemoImages;
