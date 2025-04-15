// app/components/HeroIcon.tsx

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroIconProps {
  headline: string
  href: string
  image: string // path to the background image
}

const Hero: React.FC<HeroIconProps> = ({ headline, href, image }) => {
  return (
    <section
      className="relative w-full h-[60vh] md:h-[75vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          {headline}
        </h1>
        <Link href={href}>
          <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3 rounded-xl shadow-md">
            Learn More
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default Hero




// // app/components/Hero.tsx
// import Image from "next/image";

// const Hero: React.FC = () => {
//   return (
//     <section className="relative w-full h-[750px] overflow-hidden">
//       {/* Hero Image */}
//       <Image
//         src="/images/hudson_river_aerial_view.jpg"
//         alt="Hudson River Aerial View"
//         layout="intrinsic" // This ensures proper aspect ratio and scaling
//         width={1920} // Set image width
//         height={750} // Set image height to match the container
//         objectFit="cover" // Ensures the image covers the entire area without distortion
//         className="absolute top-0 left-0 z-0"
//       />

//       {/* Text Overlay with Transparent Black Background */}
//       <div
//         className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10"
//         style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//       >
//         <div className="text-center text-white px-4">
//           <h1 className="text-4xl font-bold mb-4">
//             Welcome to Waterfront Bicycle Shop
//           </h1>
//           <p className="text-xl">
//             Your one-stop shop for bike rentals, repairs, and accessories in New
//             York City.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;
