import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/sistema-contabilidad-chile' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/sistema-contabilidad-chile/' : '',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
