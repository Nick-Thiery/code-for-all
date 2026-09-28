import type { NextConfig } from "next";

// Each deploy gets its own id. The service worker (public/sw.js) is
// registered with it, so a new deploy installs a new worker that throws away
// the old cache: nothing stale is ever served after a deploy.
const buildId = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? Date.now().toString(36);

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_BUILD_ID: buildId },
  async headers() {
    return [
      {
        // Self-hosted fonts and icons carry a version in their name, so they can be cached for good.
        source: "/(fonts|icons)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // The browser must always check for a new service worker.
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, max-age=0, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
