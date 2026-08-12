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
      // Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },

      // Carbonara
      {
        protocol: "https",
        hostname: "media.velocidadcuchara.com",
        pathname: "/**",
      },

      // Linguine alle Vongole
      {
        protocol: "https",
        hostname: "slicelife.imgix.net",
        pathname: "/**",
      },

      // Ravioli
      {
        protocol: "https",
        hostname: "snapcalorie-webflow-website.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },

      // Insalata Caprese
      {
        protocol: "https",
        hostname: "www.mojegotowanie.pl",
        pathname: "/**",
      },

      // Panzanella Toscana
      {
        protocol: "https",
        hostname: "www.whatscooking.nl",
        pathname: "/**",
      },

      // Insalata Tricolore
      {
        protocol: "https",
        hostname: "placeralplato.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
