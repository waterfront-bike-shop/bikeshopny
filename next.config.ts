import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"], // <-- add Cloudinary host here
  },
};

module.exports = nextConfig;


export default nextConfig;
