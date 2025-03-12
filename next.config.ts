import type { NextConfig } from "next";

const defaultDomains = ["stratagile-emailcraft.s3.ap-southeast-1.amazonaws.com"];
const envDomains = process.env.ALLOWED_DOMAINS 
  ? process.env.ALLOWED_DOMAINS.split(',').map(domain => domain.trim())
  : [];
const allDomains = [...new Set([...defaultDomains, ...envDomains])];

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_URL: process.env.API_URL,
    SHOW_GIT_VERSION: process.env.SHOW_GIT_VERSION,
    ENVIRONMENT: process.env.ENVIRONMENT,
    NEXT_PUBLIC_GIT_VERSION_ID: process.env.NEXT_PUBLIC_GIT_VERSION_ID
  },
  images: {
    remotePatterns: allDomains.map(domain => ({
      protocol: 'https',
      hostname: domain,
      port: '',
      pathname: '/**',
    }))
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
