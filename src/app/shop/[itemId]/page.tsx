"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useShopData } from "@/app/context/ShopDataContext"; // ✅ import context
import ProductInventory from "@/app/components/ProductInventory";

export default function ProductPage() {
  const params = useParams();
  const { allItems, imageMap, loading } = useShopData();

  // Ensure itemId is a string
  const itemId = Array.isArray(params?.itemId) ? params.itemId[0] : params?.itemId;

  if (!itemId) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-gray-500">Invalid product ID.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  const item = allItems?.find((i) => i.itemID === itemId);

  if (!item) {
    return (
      <div className="container mx-auto p-4 max-w-2xl min-h-[80vh] flex flex-col">
        <Link
          href="/shop"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Shop
        </Link>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-gray-500">Product not found.</p>
        </div>
      </div>
    );
  }

  // Safely index imageMap with string
  const imageUrl = imageMap[itemId] || null;

  const price =
    item.Prices?.ItemPrice?.find((p) => p.useType === "Online")?.amount ||
    item.Prices?.ItemPrice?.[0]?.amount;

  return (
    <div className="container mx-auto p-4 max-w-2xl min-h-[80vh] flex flex-col">
      <Link
        href="/shop"
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        ← Back to Shop
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1">
        <h1 className="text-3xl font-bold mb-4 p-4">{item.description}</h1>

        <div className="flex flex-col md:flex-row gap-8 p-4">
          {/* Product Image */}
          <div className="md:flex-shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.description || "Product image"}
                width={300}
                height={300}
                className="rounded-lg shadow-md object-cover h-auto w-auto"
                priority
              />
            ) : (
              <div className="w-[300px] h-[300px] bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                No Image Available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                {price ? `$${parseFloat(price).toFixed(2)}` : "Price not available"}
              </p>

              {item.modelYear && item.modelYear !== "0" && (
                <p className="text-gray-600 mb-4">Model Year: {item.modelYear}</p>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="font-semibold text-gray-900 mb-3">
                  Product Details
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Item ID:</strong> {item.itemID}</li>
                  <li><strong>UPC:</strong> {item.upc || "N/A"}</li>
                  <li><strong>Manufacturer SKU:</strong> {item.manufacturerSku || "N/A"}</li>
                  <li><strong>System SKU:</strong> {item.systemSku || "N/A"}</li>
                </ul>
              </div>

              <ProductInventory itemId={itemId} />
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <a
                href="tel:+1-212-414-2453"
                className="text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Call to Order
              </a>
              <Link
                href="/shop"
                className="text-center px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
