import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable format conversion for images
    formats: ['image/webp'],
    // Allow remote patterns for drama cover images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.sansekai.my.id',
      },
      {
        protocol: 'https',
        hostname: '**.fizzopic.org',
      },
      {
        protocol: 'https',
        hostname: '**.netshort.com',
      },
      {
        protocol: 'https',
        hostname: '**.ibyteimg.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
