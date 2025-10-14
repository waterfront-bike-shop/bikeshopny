"use client";

import { useEffect, useState } from "react";

interface ProductInventoryProps {
  itemId: string;
}

const ProductInventory = ({ itemId }: ProductInventoryProps) => {
  const [quantity, setQuantity] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(`/api/shop/items/${itemId}/inventory`);

        if (res.status === 404) {
          setError("Inventory data unavailable");
          setQuantity(null);
        } else if (!res.ok) {
          throw new Error(`Failed to fetch inventory: ${res.statusText}`);
        } else {
          const data = await res.json();
          setQuantity(data.quantityAvailable);
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Unable to load inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [itemId]);

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700">
          <strong>Stock Status:</strong> Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-700">
          <strong>Stock Status:</strong> {error}
        </p>
      </div>
    );
  }

  const inStock = quantity !== null && quantity > 0;

  return (
    <div
      className={`rounded-lg p-4 mb-6 border ${
        inStock
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <p
        className={`text-sm font-semibold ${
          inStock ? "text-green-700" : "text-red-700"
        }`}
      >
        <strong>Stock Status:</strong>{" "}
        {inStock
          ? `${quantity} in stock`
          : "Currently unavailable"}
      </p>
    </div>
  );
};

export default ProductInventory;
