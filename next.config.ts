import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force Turbopack to treat this folder as the root,
    // so Tailwind and other deps resolve from ai-workspace/node_modules.
    root: __dirname,
  },
};

export default nextConfig;
