import { fileURLToPath } from 'url';
import { resolve, join } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    serverComponentsHmrCache: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  transpilePackages: ['@voeq/shared', '@voeq/ui'],
  webpack: (config) => {
    config.resolve.alias['@'] = resolve(__dirname, 'src');
    return config;
  },
  async redirects() {
    return [
      { source: '/about', destination: '/public-group/about', permanent: true },
      { source: '/for-vendors', destination: '/public-group/for-vendors', permanent: true },
      { source: '/privacy', destination: '/public-group/privacy', permanent: true },
      { source: '/terms', destination: '/public-group/terms', permanent: true },
      { source: '/vendor-agreement', destination: '/public-group/vendor-agreement', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
