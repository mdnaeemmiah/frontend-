import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence the warning
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.10.7.68',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
