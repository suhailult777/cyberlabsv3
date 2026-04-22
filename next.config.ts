import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_EASEBUZZ_CONFIGURED: process.env.EASEBUZZ_KEY && process.env.EASEBUZZ_SALT ? 'true' : 'false',
  },
};

export default nextConfig;
