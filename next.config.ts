import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/global",
        destination: "/agora",
        permanent: true,
      },
      {
        source: "/global-agora",
        destination: "/agora",
        permanent: true,
      },
      {
        source: "/global-agora/feed",
        destination: "/agora/feed",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
