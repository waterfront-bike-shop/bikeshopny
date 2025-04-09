// app/components/Hero.tsx
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-[750px] overflow-hidden">
      {/* Hero Image */}
      <Image
        src="/images/hudson_river_aerial_view.jpg"
        alt="Hudson River Aerial View"
        layout="intrinsic" // This ensures proper aspect ratio and scaling
        width={1920} // Set image width
        height={750} // Set image height to match the container
        objectFit="cover" // Ensures the image covers the entire area without distortion
        className="absolute top-0 left-0 z-0"
      />

      {/* Text Overlay with Transparent Black Background */}
      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Waterfront Bicycle Shop
          </h1>
          <p className="text-xl">
            Your one-stop shop for bike rentals, repairs, and accessories in New
            York City.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
