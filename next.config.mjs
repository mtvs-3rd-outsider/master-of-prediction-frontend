import { createRequire } from "module";
import withPWAInit from "@ducanh2912/next-pwa";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants.js";
import createNextIntlPlugin from 'next-intl/plugin';
const require = createRequire(import.meta.url);
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl(withBundleAnalyzer({
  compress: true,
  reactStrictMode: false,
      // styled-components 설정 추가
      compiler: {
        styledComponents: true,
        // removeConsole: true,
        
      },
  images: {
    formats: ["image/webp", "image/avif"], // webp와 avif 포맷 추가
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: 'http',
        hostname: '125.132.216.190',
      },
    ],
    domains: ["localhost"], // localhost 도메인 추가
  },
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.optimization.minimize = true;
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 0,
        maxSize: 200000, // 200KB
      };
    }
    if (!dev && !isServer) {
      // 프로덕션 클라이언트 빌드에서 stories 파일 제외
      config.module.rules.push({
        test: /\.stories\.tsx?$/,
        loader: "ignore-loader",
      });
    }
    return config;
  },


}));
const nextConfigFunction = async (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withPWA = (await import("@ducanh2912/next-pwa")).default({
      dest: "public",
      disableDevLogs: true, // 개발자 모드에서 로그 비활성화
    });
    return withPWA(nextConfig);
  }
  return nextConfig;
};

export default nextConfigFunction;
