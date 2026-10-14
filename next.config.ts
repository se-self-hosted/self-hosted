import type { NextConfig } from "next";

const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];

const nextConfig: NextConfig = {
  // The production image (Dockerfile "runner" stage) ships only the traced
  // server files from .next/standalone, not the whole node_modules.
  output: "standalone",
  allowedDevOrigins: ["*.trycloudflare.com"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // The service worker must always be re-checked, or a fix to it could
        // take a day to reach installed apps.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
      {
        // ~15 MB of RNNoise weights fetched by every participant who unmutes.
        // The file name is versioned, so a new build ships under a new name.
        source: "/rnnoise-:version.wasm",
        headers: immutable,
      },
      {
        source: "/rnnoise-worklet-:version.js",
        headers: immutable,
      },
      {
        source: "/pcm-capture-worklet-:version.js",
        headers: immutable,
      },
    ];
  },
};

export default nextConfig;
