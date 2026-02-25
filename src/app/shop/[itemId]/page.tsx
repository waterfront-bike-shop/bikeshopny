"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useShopData } from "@/app/context/ShopDataContext";
import ProductInventory from "@/app/components/ProductInventory";
import ProductDescription from "@/app/components/ProductDescription";

export default function ProductPage() {
  const params = useParams();
  const { allItems, loading } = useShopData();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // Get images or use placeholder
  const images = item.images.length > 0 ? item.images : ["/images/placeholder.png"];
  const currentImage = images[selectedImageIndex];

  // Get price (prefer Online, fallback to Default)
  const price =
    item.prices.find((p) => p.useType === "Online")?.amount ||
    item.prices.find((p) => p.useType === "Default")?.amount ||
    item.prices[0]?.amount;

  return (
    <div className="container mx-auto p-4 max-w-4xl min-h-[80vh] flex flex-col">
      <Link
        href="/shop"
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        ← Back to Shop
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1">
        <h1 className="text-3xl font-bold mb-4 p-4">{item.description}</h1>

        <div className="flex flex-col md:flex-row gap-8 p-4">
          {/* Product Images */}
          <div className="md:flex-shrink-0">
            {/* Main Image */}
            <div className="relative w-[400px] h-[400px] bg-white rounded-lg overflow-hidden">
              <Image
                src={currentImage}
                alt={item.description || "Product image"}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Image Thumbnails - Only show if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "border-blue-600"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${item.description} view ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Image {selectedImageIndex + 1} of {images.length}
              </p>
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
                  <li><strong>System SKU:</strong> {item.systemSku}</li>
                  {item.customSku && (
                    <li><strong>Custom SKU:</strong> {item.customSku}</li>
                  )}
                  {item.upc && <li><strong>UPC:</strong> {item.upc}</li>}
                  {item.manufacturerSku && (
                    <li><strong>Manufacturer SKU:</strong> {item.manufacturerSku}</li>
                  )}
                </ul>
              </div>
               {/* Component that pulls the Description from the Lightspeed e-commerce API endpoint */}
              <ProductDescription itemId={itemId} />

              {/* Live Inventory Component */}
              <ProductInventory itemId={itemId} />
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <a
                href="tel:+1-212-414-2453"
                className="text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Buy in Store Only<br></br>Call to Double Check Stock: (212) 414-2453
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