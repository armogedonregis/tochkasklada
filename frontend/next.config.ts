import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    API_URL: process.env.NODE_ENV === 'development'
      ? 'http://192.168.0.182:5000/api'
      : '/api',
  },
};

module.exports = nextConfig;

// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'google-fonts-webfonts',
//         expiration: {
//           maxEntries: 4,
//           maxAgeSeconds: 365 * 24 * 60 * 60 // 365 дней
//         }
//       }
//     }
//   ]
// });
// module.exports = withPWA(nextConfig);
