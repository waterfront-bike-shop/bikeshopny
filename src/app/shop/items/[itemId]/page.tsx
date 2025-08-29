"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import { ArrowLeft } from "phosphor-react";
import { ItemWithImage } from "@/lib/lightspeed/types";

export default function ItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params?.itemId;

  const [item, setItem] = useState<ItemWithImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) return;

    async function fetchItem() {
      try {
        const res = await fetch(`/api/shop/items/${itemId}`);
        if (res.status === 404) {
          setItem(null);
        } else if (!res.ok) {
          throw new Error(res.statusText);
        } else {
          const data = await res.json();
          setItem(data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [itemId]);

  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error)
      return <p className="text-center text-red-600">Error: {error}</p>;
    if (!item)
      return <p className="text-center text-gray-500">Item not found.</p>;
    return null;
  };

  const price =
    item?.Prices?.ItemPrice?.find((p) => p.useType === "Online")?.amount ||
    item?.Prices?.ItemPrice?.[0]?.amount;

  return (
    <>
      <Head>
        <title>{item?.description || "Item Details"}</title>
        <meta
          name="description"
          content={
            item
              ? `Details for ${item.description} from our store.`
              : "Item page"
          }
        />
        {item?.imageUrl && <meta property="og:image" content={item.imageUrl} />}
      </Head>

      <div className="container mx-auto p-4 max-w-2xl min-h-[80vh] flex flex-col">
        {/* Back Button */}
        <button
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        {loading || error || !item ? (
          <div className="flex-1 flex items-center justify-center">
            {renderContent()}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1">
            <h1 className="text-3xl font-bold mb-4 p-4">{item.description}</h1>

            <div className="flex flex-col md:flex-row gap-8 p-4">
              <div className="md:flex-shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.description || "Item image"}
                    width={300}
                    height={300}
                    className="rounded-lg shadow-md object-cover"
                  />
                ) : (
                  <div className="w-[300px] h-[300px] bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    {price
                      ? `$${parseFloat(price).toFixed(2)}`
                      : "Price not available"}
                  </p>

                  {item.modelYear && item.modelYear !== "0" && (
                    <p className="text-gray-600 mb-4">
                      Model Year: {item.modelYear}
                    </p>
                  )}

                  <ul className="list-disc list-inside text-gray-600">
                    <li>
                      <strong>Item ID:</strong> {item.itemID}
                    </li>
                    <li>
                      <strong>UPC:</strong> {item.upc || "N/A"}
                    </li>
                    <li>
                      <strong>Manufacturer SKU:</strong>{" "}
                      {item.manufacturerSku || "N/A"}
                    </li>
                    <li>
                      <strong>System SKU:</strong> {item.systemSku}
                    </li>
                  </ul>
                </div>

                {/* Back to Shop */}
                <div className="mt-6">
                  <a
                    href="/shop"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Back to Shop
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
