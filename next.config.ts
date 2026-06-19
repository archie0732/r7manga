import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    domains: ['t2.nhentai.net', 'i3.nhentai.net', 't3.nhentai.net', 't3.nhentai.net', 'i1.nhentai.net', 'zh.hentaipaw.com', 'cdn.imagedeliveries.com'],
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
      {
        protocol: 'https',
        hostname: 'i1.nhentai.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zh.hentaipaw.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.imagedeliveries.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,

  },
};

export default nextConfig;
