import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    API_URL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000/api'
      : '/api',
  },
};

export default nextConfig;
