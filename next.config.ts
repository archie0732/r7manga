import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['t2.nhentai.net', 'i3.nhentai.net', 't3.nhentai.net', 't3.nhentai.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't2.nhentai.net',
        port: '',
        pathname: '/galleries/**/**',
      },
      {
        protocol: 'https',
        hostname: 't3.nhentai.net',
        port: '',
        pathname: '/galleries/**/**',
      },
      {
        protocol: 'https',
        hostname: 'i3.nhentai.net',
        port: '',
        pathname: '/galleries/**/**',
      },
      {
        protocol: 'https',
        hostname: 't4.qy0.ru',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
