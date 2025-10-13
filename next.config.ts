import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Especificar el directorio raíz del proyecto para evitar advertencias
  outputFileTracingRoot: path.join(__dirname),
  
  // Configuraciones adicionales
  experimental: {
    // Optimizaciones
  },
};

export default nextConfig;
