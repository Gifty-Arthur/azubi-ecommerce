import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // NEW: Add your Supabase hostname here
      // Replace 'xyzabc.supabase.co' with your actual Supabase project hostname
      {
        protocol: 'https',
        hostname: 'xyzabc.supabase.co', 
      },
    ],
  },
  async rewrites() {
    return [
      // Rule for your users API
      {
        source: '/users-api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      // Rule for your products API
      {
        source: '/products-api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      // Rule for the external e-commerce API
      {
        source: '/store-api/:path*',
        destination: 'https://ecommerce-api-m68g.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;

