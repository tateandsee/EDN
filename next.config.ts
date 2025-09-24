import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  // Fix cross-origin request warning for development
  allowedDevOrigins: [
    'http://localhost:3000',
    'https://preview-chat-a20001ea-6be5-4cf5-a298-a256ef3bec0c.space.z.ai'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.fansly.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.justfor.fans',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'admireme.vip',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fancentro.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.manyvids.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.instagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tiktok.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'twitter.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.patreon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.twitch.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
