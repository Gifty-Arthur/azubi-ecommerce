import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Rule for your new local users API
      {
        source: '/users-api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      // I'm keeping the rule for the e-commerce API in case you need it later
      {
        source: '/store-api/:path*',
        destination: 'https://ecommerce-api-m68g.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;

