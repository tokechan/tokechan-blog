import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "../out",
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
