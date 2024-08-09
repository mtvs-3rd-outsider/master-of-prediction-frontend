import { createRequire } from 'module';
import withPWAInit from "@ducanh2912/next-pwa";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants.js";


const require = createRequire(import.meta.url);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  compress: true,
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'], // webp와 avif 포맷 추가
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ]
  },
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.optimization.minimize = true;
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 0,
        maxSize: 200000, // 200KB
      };
    }
    if (!dev && !isServer) {
      // 프로덕션 클라이언트 빌드에서 stories 파일 제외
      config.module.rules.push({
        test: /\.stories\.tsx?$/,
        loader: 'ignore-loader',
      });
    }
    return config;
  },
});
const nextConfigFunction = async (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withPWA = (await import("@ducanh2912/next-pwa")).default({
      dest: "public",
    });
    return withPWA(nextConfig);
  }
  return nextConfig;
};

export default nextConfigFunction;


