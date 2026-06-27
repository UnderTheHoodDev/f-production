import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the Vietnamese TTF fonts are traced into the serverless functions
  // that render quote PDFs (admin + public download routes).
  outputFileTracingIncludes: {
    "/api/admin/quotes/[id]/pdf": [
      "./assets/fonts/**",
      "./public/logo-name-optimized.png",
    ],
    "/api/q/[token]/pdf": [
      "./assets/fonts/**",
      "./public/logo-name-optimized.png",
    ],
  },
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

