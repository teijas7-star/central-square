import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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