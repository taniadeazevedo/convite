import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin el icono «N» de desarrollo en la esquina (estorba al capturar imágenes; en producción no sale)
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
