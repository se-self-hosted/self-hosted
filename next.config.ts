import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],
  async headers() {
    return [
      {
        // ~15 MB of RNNoise weights fetched by every participant who unmutes.
        // The file name is versioned, so a new build ships under a new name.
        source: "/rnnoise-:version.wasm",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/rnnoise-worklet-:version.js",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
