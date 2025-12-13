import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "www.telsot.uz", "master-fitness.netlify.app"]б // добавляем все нужные домены
  },
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
