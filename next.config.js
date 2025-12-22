/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ADD THIS BLOCK BELOW
  typescript: {
    ignoreBuildErrors: true,
  },
  // If you still have PWA settings, they stay here too
};

module.exports = nextConfig;
