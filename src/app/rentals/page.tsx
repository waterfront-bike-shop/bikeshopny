import { Metadata } from 'next';
import RentalsClient from './RentalsClient';
import { rentalData } from './rentalData';

export const metadata: Metadata = {
  title: 'Bike Rentals - Online Booking',
  description: 'Rent bikes online or in-store at Waterfront Bicycle Shop, NYC.',
  alternates: {
    canonical: 'https://www.bikeshopny.com/rentals',
  },
};

export default function Rentals() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(rentalData),
        }}
      />
      <RentalsClient />
    </>
  );
}