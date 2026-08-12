import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_URL ?? "https://sapori-backend.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.velocidadcuchara.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "slicelife.imgix.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "snapcalorie-webflow-website.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
