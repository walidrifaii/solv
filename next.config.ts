import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "st79068.ispot.cc",
        pathname: "/solv/**",
      },
    ],
  },
};

export default nextConfig;
