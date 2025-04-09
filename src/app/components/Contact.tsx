// app/components/Contact.tsx
const Contact: React.FC = () => {
  return (
    <section className="py-10 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      
      <div className="space-y-6">
        <p className="text-lg">
          <span className="font-semibold">Waterfront Bicycle Shop</span>
        </p>
        <p>391 West Street, New York, NY 10014, US</p>
        
        <div>
          <h3 className="text-lg font-semibold">Call Us</h3>
          <p>212-414-2453</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Email Us</h3>
          <p>waterfrontbikeshop@gmail.com</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Text Us</h3>
          <p>212-414-2453</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
