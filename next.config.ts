import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    ...(process.env.NODE_ENV === 'development'
      ? { dangerouslyAllowSVG: true }
      : {}),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
