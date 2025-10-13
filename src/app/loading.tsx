'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[var(--color-background)] via-white to-[var(--color-background)]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-rose)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-secondary)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated hearts */}
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 w-32 h-32"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.div
                key={angle}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateY(-60px)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-3 h-3 text-[var(--color-accent)]" />
              </motion.div>
            ))}
          </motion.div>

          {/* Center heart */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <Heart className="w-24 h-24 text-[var(--color-rose)] fill-current" />
            <motion.div
              className="absolute inset-0 bg-[var(--color-rose)] blur-2xl opacity-40"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.2, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <motion.h2
            className="text-3xl font-light font-playfair bg-gradient-to-r from-[var(--color-rose)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Estelle & Alexandre
          </motion.h2>
          <motion.p
            className="text-sm tracking-[0.3em] uppercase text-[var(--color-accent)]"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            Cargando...
          </motion.p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)]"
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
