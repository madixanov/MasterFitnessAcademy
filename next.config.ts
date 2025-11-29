import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",                  // все запросы к /api/*
        destination: "https://www.telsot.uz/:path*", // проксируем на бекенд
      },
    ];
  },
};

export default nextConfig;
