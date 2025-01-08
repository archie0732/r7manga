import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't3.nhentai.net',
        port: '',
        pathname: '/galleries/**',
        search: '',
      }, {
        protocol: 'https',
        hostname: 'i3.nhentai.net',
        port: '',
        pathname: '/galleries/**',
        search: '',
      }, {
        protocol: 'https',
        hostname: 't4.qy0.ru',
        port: '',
        pathname: '/**',
        search: '',
      }, {
        protocol: 'https',
        hostname: 't4.qy0.ru',
        port: '',
        pathname: '/**',
        search: '',
      }],
  },
};

export default nextConfig;
