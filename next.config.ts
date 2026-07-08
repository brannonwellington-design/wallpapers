import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [256, 384, 512, 640],
  },
};

export default nextConfig;
