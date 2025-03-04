import type { NextConfig } from "next";

const defaultDomains = ["stratagile-emailcraft.s3.ap-southeast-1.amazonaws.com"];
const envDomains = process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : [];
const allDomains = [...new Set([...defaultDomains, ...envDomains])];

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL: process.env.API_URL
  },
  images: {
    domains: allDomains
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
