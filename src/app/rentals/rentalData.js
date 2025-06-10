// Rental Data to be appended to the page's metadata to help explain what is in the iFrame from Bike Rental Manager.

export const rentalData = {
  "@context": "https://schema.org",
  "@type": "BicycleRental",
  name: "Waterfront Bicycle Shop - Rentals",
  description:
    "Rent bikes online or in-store at Waterfront Bicycle Rentals. Choose from city/urban bikes, road bikes, and kids bikes by the day online, or hourly in person.",
  url: "https://www.bikeshopny.com/rentals",
  image: "/images/KHS-urban-xscape.jpg",
  openingHours: "Mo-Su 10:00-19:00",
  paymentAccepted: "CreditCard",
  priceRange: "$$",
  availableAtOrFrom: {
    "@type": "Place",
    name: "Waterfront Bicycle Shop",
    address: {
      "@type": "PostalAddress",
      streetAddress: "391 West Street,",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10014",
      addressCountry: "US",
    },
  },
  offers: [
    {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "35.00",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        value: "35.00",
        priceType: "Rent",
        validFrom: "2023-01-01T10:00:00Z",
        validThrough: "2023-12-31T19:00:00Z",
      },
      itemOffered: {
        "@type": "Bicycle",
        name: "City/Urban Bike",
        description:
          "Comfortable city bike with basket, lock, and helmet. Available in medium, large, and XL sizes.",
        additionalType: "https://schema.org/Bicycle",
      },
    },
  ],
};
