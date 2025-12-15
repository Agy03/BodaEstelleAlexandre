import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Especificar el directorio raíz del proyecto para evitar advertencias
  outputFileTracingRoot: path.join(__dirname),
  
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  
  // Configuraciones adicionales
  experimental: {
    // Optimizaciones
  },
};

export default withNextIntl(nextConfig);
