import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  "devIndicators": false,
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript type checking during production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
