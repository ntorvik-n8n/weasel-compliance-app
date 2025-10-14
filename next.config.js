/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Required for Azure Static Web Apps
  images: {
    unoptimized: true, // Azure SWA doesn't support Next.js Image Optimization
  },
}

module.exports = nextConfig
