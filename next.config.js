const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',      // Required for GitHub Pages
  images: {
    unoptimized: true,   // Required for static export
  },
};

module.exports = withPWA(nextConfig);
