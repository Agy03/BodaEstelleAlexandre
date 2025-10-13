'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/rsvp', label: 'Confirmar' },
  { href: '/turismo', label: 'Turismo' },
  { href: '/regalos', label: 'Regalos' },
  { href: '/galeria', label: 'Galería' },
  { href: '/informacion', label: 'Info' },
  { href: '/musica', label: 'Música' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100/50'
          : 'bg-gradient-to-b from-white/60 to-transparent backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group relative"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative"
            >
              <Heart className="w-7 h-7 fill-current text-[var(--color-primary)]" />
              <motion.div 
                className="absolute inset-0 bg-[var(--color-primary)] blur-xl opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-playfair bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                Boda Estelle
              </span>
              <span className="text-[10px] tracking-widest uppercase text-gray-400 -mt-1">2025</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-all duration-300 group flex items-center gap-2",
                      isActive 
                        ? "text-[var(--color-primary)]" 
                        : "text-gray-600 hover:text-[var(--color-primary)]"
                    )}
                  >
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {/* Bottom underline on hover */}
                    <motion.div
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"
                      initial={{ width: 0, opacity: 0 }}
                      whileHover={{ width: "70%", opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200/50 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 transition-all duration-300 text-[var(--color-primary)]"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100/50"
          >
            <div className="px-6 py-8 space-y-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-6 py-4 text-base font-medium rounded-2xl transition-all duration-300 group relative",
                        isActive
                          ? "bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 text-[var(--color-primary)]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeMobileNav"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        <motion.svg
                          className="w-5 h-5 text-[var(--color-primary)] opacity-0 group-hover:opacity-100"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
