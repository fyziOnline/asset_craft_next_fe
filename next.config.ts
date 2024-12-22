import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL: process.env.API_URL
  },
  images: {
    domains: ["stratagile-emailcraft.s3.ap-southeast-1.amazonaws.com", "brandcentral.strat-staging.com"]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
