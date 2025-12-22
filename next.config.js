/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disables strict type checking during the build phase
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disables ESLint warnings from blocking the production build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Recommended for modern Next.js apps
  reactStrictMode: true,
}

module.exports = nextConfig
