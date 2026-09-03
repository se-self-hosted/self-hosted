import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "purify-voice": "purify-voice/dist/index.js",
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "purify-voice": "purify-voice/dist/index.js",
    },
  },
};

export default nextConfig;
