'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, Users, Gift, Camera, Music, Info, Flower2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: Users,
    title: 'Confirma tu Asistencia',
    description: 'Háznoslo saber para poder preparar todo perfectamente',
    href: '/rsvp',
    color: 'from-rose-300 to-pink-300',
  },
  {
    icon: MapPin,
    title: 'Turismo Cercano',
    description: 'Descubre lugares increíbles para visitar',
    href: '/turismo',
    color: 'from-purple-300 to-lavender-300',
  },
  {
    icon: Gift,
    title: 'Lista de Regalos',
    description: 'Si deseas hacernos un regalo, aquí encontrarás ideas',
    href: '/regalos',
    color: 'from-amber-300 to-yellow-200',
  },
  {
    icon: Camera,
    title: 'Galería de Fotos',
    description: 'Comparte tus mejores momentos con nosotros',
    href: '/galeria',
    color: 'from-pink-300 to-rose-200',
  },
  {
    icon: Info,
    title: 'Información General',
    description: 'Todo lo que necesitas saber sobre el gran día',
    href: '/informacion',
    color: 'from-blue-200 to-cyan-200',
  },
  {
    icon: Music,
    title: 'Sugiere Música',
    description: 'Ayúdanos a crear la playlist perfecta',
    href: '/musica',
    color: 'from-purple-200 to-pink-200',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const floatingAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Decorative floral elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Flores decorativas en las esquinas */}
        <motion.div
          className="absolute top-10 left-10 opacity-10"
          animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flower2 className="w-32 h-32 text-[var(--color-rose)]" />
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 opacity-10"
          animate={{ rotate: [0, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Flower2 className="w-40 h-40 text-[var(--color-secondary)]" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-20 opacity-10"
          animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Flower2 className="w-36 h-36 text-[var(--color-accent)]" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 opacity-10"
          animate={{ rotate: [0, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Flower2 className="w-28 h-28 text-[var(--color-rose)]" />
        </motion.div>

        {/* Gradientes suaves */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-[var(--color-rose)]/10 to-[var(--color-secondary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[var(--color-secondary)]/10 to-[var(--color-accent)]/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section - Estilo invitación de boda */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* Marco decorativo */}
        <div className="absolute inset-8 md:inset-16 border border-[var(--color-accent)]/20 rounded-3xl pointer-events-none" />
        <div className="absolute inset-12 md:inset-20 border border-[var(--color-accent)]/10 rounded-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ornamento superior */}
            <motion.div
              className="flex justify-center items-center gap-6 mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-[var(--color-accent)]" />
              </motion.div>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
            </motion.div>

            {/* Fecha romántica arriba del título */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-6"
            >
              <p className="text-sm tracking-[0.3em] uppercase text-[var(--color-accent)] font-light">
                Nuestro Día Especial
              </p>
            </motion.div>

            {/* Título con estilo caligráfico */}
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl mb-8 text-[var(--color-text)] font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              <span className="block text-5xl md:text-6xl mb-4 text-[var(--color-rose)]">La Boda de</span>
              <span className="italic">Estelle</span>
            </motion.h1>

            {/* Ornamento floral central */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <Heart className="w-16 h-16 text-[var(--color-rose)] fill-current opacity-80" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-20 h-20 border-2 border-[var(--color-rose)]/30 rounded-full" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed italic mb-12">
                "Dos almas, un corazón, una vida juntos"
              </p>

              {/* Info cards */}
              <div className="inline-block p-1 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] rounded-2xl mb-10">
                <div className="bg-white px-8 py-4 rounded-xl">
                  <div className="flex flex-col sm:flex-row gap-6 items-center text-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-[var(--color-rose)]/10 to-[var(--color-secondary)]/10 rounded-lg">
                        <Calendar className="w-6 h-6 text-[var(--color-rose)]" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-500 font-medium">Fecha</p>
                        <p className="font-semibold">Por confirmar</p>
                      </div>
                  </div>
                  <div className="hidden sm:block w-px h-10 bg-gray-200" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-lg">
                      <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500 font-medium">Lugar</p>
                      <p className="font-semibold">Por confirmar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="/rsvp">
              <Button
                size="lg"
                className="group relative overflow-hidden shadow-2xl hover:shadow-[var(--color-primary)]/50 transition-all duration-300 px-12 py-6 text-lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Confirmar Asistencia
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
    </div>

        {/* Scroll indicator */ }
  <motion.div
    className="absolute bottom-10 left-1/2 -translate-x-1/2"
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <div className="w-6 h-10 border-2 border-[var(--color-primary)] rounded-full flex items-start justify-center p-2">
      <motion.div
        className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  </motion.div>
      </section >

    {/* Features Section */ }
    < section className = "py-32 px-4 relative overflow-hidden" >
      {/* Subtle background decoration */ }
      < div className = "absolute inset-0 bg-gradient-to-b from-gray-50/50 via-transparent to-gray-50/50 -z-10" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-24"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-8"
            >
              <span className="text-sm font-medium tracking-widest text-[var(--color-primary)] uppercase">
                Todo en un lugar
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-playfair text-[var(--color-text)]">
              Descubre Todos los{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                  Detalles
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 -z-10"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Encuentra toda la información que necesitas para acompañarnos en este día tan especial
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.href}
                variants={itemVariants}
                custom={index}
              >
                <Link href={feature.href} className="block h-full group">
                  <div className="h-full relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-[var(--color-primary)]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[var(--color-primary)]/10">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/0 to-[var(--color-secondary)]/0 group-hover:from-[var(--color-primary)]/5 group-hover:to-[var(--color-secondary)]/5 transition-all duration-500" />

                    {/* Top accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

                    <div className="relative p-8 lg:p-10">
                      {/* Icon with minimal style */}
                      <div className="mb-6 flex items-center justify-between">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500`} />
                          <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color.replace('to-', 'to-white/20 ')}`}>
                            <feature.icon className="w-7 h-7 text-white" />
                          </div>
                        </div>

                        {/* Arrow indicator */}
                        <motion.div
                          className="text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </motion.div>
                      </div>

                      <h3 className="text-xl lg:text-2xl font-bold mb-3 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {feature.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section >

    {/* CTA Section */ }
    < section className = "py-24 px-4 relative overflow-hidden" >
      {/* Background decoration */ }
      < div className = "absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-secondary)]/5 to-transparent" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={floatingAnimation}
              className="inline-block mb-6"
            >
              <div className="p-6 bg-white rounded-full shadow-2xl">
                <Heart className="w-16 h-16 text-[var(--color-primary)] fill-current" />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
              ¿Nos Acompañas?
            </h2>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Tu presencia es el mejor regalo que podríamos recibir.
              Por favor, confirma tu asistencia lo antes posible para que podamos
              organizar todo perfectamente.
            </p>

            <Link href="/rsvp">
              <Button
                size="lg"
                className="group relative overflow-hidden shadow-2xl hover:shadow-[var(--color-primary)]/50 transition-all duration-300 px-12 py-6 text-lg"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  Confirmar Ahora
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section >
    </div >
  );
}
