import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://images.chesscomfiles.com/**")],
  },
};

export default nextConfig;
