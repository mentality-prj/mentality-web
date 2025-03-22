import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/shop/:path*',
        destination: 'http://localhost:3001/shop/:path*', // Proxy to the Shop app
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
