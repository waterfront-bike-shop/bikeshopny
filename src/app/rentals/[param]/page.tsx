import { Metadata } from 'next';
import RentalsParamClient from './RentalsParamClient';
import { rentalData } from '../rentalData';

// This will make ALL sub-pages point to the main rentals page as canonical
export const metadata: Metadata = {
  title: 'Bike Rentals - Online Booking',
  description: 'Rent bikes online or in-store at Waterfront Bicycle Shop, NYC.',
  alternates: {
    canonical: 'https://www.bikeshopny.com/rentals', // Points to main rentals page
  },
};

export default function RentalsParamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(rentalData),
        }}
      />
      <RentalsParamClient />
    </>
  );
}