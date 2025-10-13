'use client';

import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-[var(--color-primary)] fill-current" />
            <h3 className="text-2xl font-bold font-playfair text-[var(--color-primary)]">
              Boda Estelle
            </h3>
          </div>
          <p className="text-gray-600 mb-2">
            Gracias por compartir este día especial con nosotros
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
