/*
Example response: https://localhost:3000/api/shop/items/2118/description
	
name	'Lock 12 Kryptonite Evolution Series U-Lock - 3 x 9.5", Keyed, Black'
shortDescription	"<p>This case-hardened steel mini U-lock is a great balance between security and convenience.&nbsp; It is strong enough to protect your bike in the urban jungle, and the small, lightweight design means it won't be weighing you down when you're riding.</p>"
longDescription	`<ul>\n<li>13mm hardened Kryptonium steel shackle resists bolt cutters and leverage attacks</li>\n<li>3 key-one lighted for nighttime use</li>\n<li>protective vinyl coating to help prevent paint scratches on your paint</li>\n<li>Bent Foot(tm) shackle design makes it easy to lock up</li>\n<li>includes newly designed frame mount so you don't have to worry about how you're going to carry your lock</li>\n<li>rated at level 7 of 10 on Kryptonite's security scale</li>\n<li>dimensions 3.25" x 9.5" (8.3cm x 24.1cm)</li>\n<li>weight: 2.75 lbs</li>\n</ul>`
timestamp	"2026-02-25T15:52:51.973Z"
*/

// This gets the description of a product from its ID, which is located in the Lightspeed UI under 'e-commerce'

"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

interface ProductDescriptionProps {
  itemId: string;
}

interface ProductDescription {
  name: string;
  shortDescription: string;
  longDescription: string;
  // timestamp: string; // don't actually need, but it is there.
}

const ProductDescription = ({ itemId }: ProductDescriptionProps) => {
  const [description, setDescription] = useState<ProductDescription | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Toggle for long description
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const res = await fetch(`/api/shop/items/${itemId}/description`);

        if (res.status === 404) {
          // Possible there is no description
          setDescription(null);
        } else if (!res.ok) {
          throw new Error(`Failed to fetch description: ${res.statusText}`);
        } else {
          const data = await res.json();
          setDescription({
            name: data.name,
            shortDescription: data.shortDescription ?? "",
            longDescription: data.longDescription ?? "",
          });
        }
      } catch (err) {
        console.error("Error fetching description:", err);
        setError("Unable to load description");
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [itemId]);

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700">
          <strong>Description:</strong> Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-700">
          <strong>Description:</strong> {error}
        </p>
      </div>
    );
  }

  if (
    !description ||
    (!description.shortDescription && !description.longDescription)
  ) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600">
          <strong>Description:</strong> No description available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
      {/* Short description (always visible) */}
      {description.shortDescription && (
        <div
          className="prose prose-sm max-w-none lightspeed-description"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(description.shortDescription),
          }}
        />
      )}

      {/* Long description (toggle) */}
      {showMore && description.longDescription && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Features</h4>

          <div
            className="prose prose-sm max-w-none lightspeed-features"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description.longDescription),
            }}
          />
        </div>
      )}

      {/* Toggle button */}
      {description.longDescription && (
        <button
          type="button"
          onClick={() => setShowMore((prev) => !prev)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
        >
          {showMore ? "Less" : "More"}
        </button>
      )}
    </div>
  );
};

export default ProductDescription;
