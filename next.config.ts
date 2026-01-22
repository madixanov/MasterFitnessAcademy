import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Безопасный способ разрешить загрузку изображений с внешних доменов
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.telsot.uz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "telsot.uz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "master-fitness.netlify.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
