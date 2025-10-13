/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Azure SWA doesn't support Next.js Image Optimization
  },
}

module.exports = nextConfig
