import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/sistema-contabilidad-chile' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/sistema-contabilidad-chile/' : '',
  images: {
    unoptimized: true
  },
  // Configuración para React 19 compatibility
  experimental: {
    reactCompiler: false,
  },
  // Suprimir warnings de ref en desarrollo
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  }
};

export default nextConfig;
