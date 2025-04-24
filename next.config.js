/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["assets.coingecko.com", "i.seadn.io"],
  },
  // Ensure we handle client-side only code properly
  webpack: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        },
      },
    }
  },
  // Remove exportPathMap as it's not compatible with the App Router
}

module.exports = nextConfig
