import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['t2.nhentai.net'], // 如果您想使用较简单的配置方式
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
