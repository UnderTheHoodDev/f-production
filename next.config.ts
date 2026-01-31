import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;

