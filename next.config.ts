import type { NextConfig } from "next";

const isPagesBuild = process.env.PAGES_BUILD === "true";

const nextConfig: NextConfig = isPagesBuild
  ? {
      output: "export",
      basePath: "/system",
      assetPrefix: "/system/",
      trailingSlash: true,
      images: { unoptimized: true },
      // The Pages bundle is browser-only; Cloudflare worker examples are excluded.
      typescript: { tsconfigPath: "./tsconfig.pages.json" },
    }
  : {};

export default nextConfig;
