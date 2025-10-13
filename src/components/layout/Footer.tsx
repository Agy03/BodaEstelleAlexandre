'use client';

import { Heart, Instagram, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const quickLinks = [
  { href: '/rsvp', label: 'Confirmar' },
  { href: '/turismo', label: 'Turismo' },
  { href: '/regalos', label: 'Regalos' },
  { href: '/galeria', label: 'Galería' },
];

export function Footer() {
  return (
    <footer className="relative mt-40 overflow-hidden">
      {/* Elegant wave separator */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <svg className="w-full h-24 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C300,80 600,80 900,40 L1200,80 L1200,120 L0,120 Z" fill="currentColor" opacity="0.3" />
          <path d="M0,20 C300,100 600,100 900,60 L1200,100 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>
      
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
      
      {/* Subtle decorative elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-gradient-to-tl from-[var(--color-secondary)]/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left md:col-span-1"
          >
            <Link href="/" className="inline-flex flex-col items-center md:items-start group mb-6">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative"
                >
                  <Heart className="w-9 h-9 text-[var(--color-primary)] fill-current" />
                  <motion.div 
                    className="absolute inset-0 bg-[var(--color-primary)] blur-xl opacity-20"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                <h3 className="text-2xl font-bold font-playfair bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                  Boda Estelle
                </h3>
              </div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400">2025</span>
            </Link>
            <p className="text-gray-600 leading-relaxed text-sm">
              Gracias por compartir este día especial con nosotros. Vuestra presencia es el mejor regalo.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-center"
          >
            <h4 className="text-sm font-bold tracking-wider uppercase text-gray-400 mb-6">Enlaces</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-[var(--color-primary)] transition-all duration-300 inline-flex items-center gap-2 group text-sm"
                  >
                    <motion.span 
                      className="w-0 group-hover:w-6 transition-all duration-300 h-px bg-gradient-to-r from-[var(--color-primary)] to-transparent"
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-center md:text-right"
          >
            <h4 className="text-sm font-bold tracking-wider uppercase text-gray-400 mb-6">Contacto</h4>
            <div className="space-y-4 text-gray-600 text-sm">
              <motion.a
                href="mailto:contacto@bodaestelle.com"
                className="flex items-center gap-2.5 hover:text-[var(--color-primary)] transition-colors justify-center md:justify-end group"
                whileHover={{ x: -3 }}
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>contacto@bodaestelle.com</span>
              </motion.a>
              <motion.div 
                className="flex items-center gap-2.5 justify-center md:justify-end"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Lugar por confirmar</span>
              </motion.div>
              
              {/* Social Icons */}
              <div className="flex gap-3 justify-center md:justify-end mt-6 pt-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="pt-12 border-t border-gray-200/30 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-gray-500">
            <p className="flex items-center gap-1.5">
              <span>© {new Date().getFullYear()} Boda Estelle</span>
            </p>
            <span className="hidden sm:inline text-gray-300">•</span>
            <p className="flex items-center gap-1.5">
              <span>Hecho con</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-3 h-3 inline fill-current text-red-500" />
              </motion.span>
              <span>y mucha ilusión</span>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
