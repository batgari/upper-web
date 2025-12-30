import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 빌드 시 타입 에러를 무시 (개발 중에는 IDE에서 에러 확인 가능)
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 ESLint 에러를 무시
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
