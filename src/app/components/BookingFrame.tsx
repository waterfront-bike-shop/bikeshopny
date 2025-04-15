import React from 'react';

const BookingIframe: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white shadow-lg rounded-lg overflow-hidden">
      <iframe
        src="https://us.booking.bike.rent/book?store=waterfrontbicycleshop"
        width="100%"
        height="800"
        frameBorder="0"
        className="rounded-lg"
        title="Booking Page"
      />
    </div>
  );
};

export default BookingIframe;
