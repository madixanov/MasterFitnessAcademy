import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "www.telsot.uz", "master-fitness.netlify.app", "telsot.uz", "185.183.242.15"], // добавляем все нужные домены
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",                  // все запросы к /api/*
        destination: "https://185.183.242.15:path*", // проксируем на бекенд
      },
    ];
  },
};

export default nextConfig;
