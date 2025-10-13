/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    unoptimized: true, // Azure SWA doesn't support Next.js Image Optimization
  },
}

module.exports = nextConfig
