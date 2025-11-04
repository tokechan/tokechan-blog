import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  compiler: {
    styledComponents: true,
  },
  typescript: {
    // ビルド時のTypeScriptエラーを無視
    ignoreBuildErrors: true,
  },
  eslint: {
    // ビルド時のESLintエラーを無視
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; 