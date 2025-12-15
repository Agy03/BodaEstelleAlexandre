'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, Users, Gift, Camera, Music, Info, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScrollVine } from '@/components/ui/ScrollVine';

const getFeatures = (t: (key: string) => string) => [
  {
    icon: Users,
    title: t('home.features.rsvp.title'),
    description: t('home.features.rsvp.description'),
    href: '/rsvp',
    color: 'from-rose-300 to-pink-300',
  },
  {
    icon: MapPin,
    title: t('home.features.tourism.title'),
    description: t('home.features.tourism.description'),
    href: '/turismo',
    color: 'from-purple-300 to-lavender-300',
  },
  {
    icon: Gift,
    title: t('home.features.gifts.title'),
    description: t('home.features.gifts.description'),
    href: '/regalos',
    color: 'from-amber-300 to-yellow-200',
  },
  {
    icon: Camera,
    title: t('home.features.gallery.title'),
    description: t('home.features.gallery.description'),
    href: '/galeria',
    color: 'from-pink-300 to-rose-200',
  },
  {
    icon: Info,
    title: t('home.features.info.title'),
    description: t('home.features.info.description'),
    href: '/informacion',
    color: 'from-blue-200 to-cyan-200',
  },
  {
    icon: Music,
    title: t('home.features.music.title'),
    description: t('home.features.music.description'),
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
  const t = useTranslations();
  const features = getFeatures(t);
  
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Enredadera que crece con el scroll */}
      <ScrollVine />

      {/* Gradientes suaves de fondo */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-[var(--color-rose)]/10 to-[var(--color-secondary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[var(--color-secondary)]/10 to-[var(--color-accent)]/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section - Estilo invitación de boda */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Marco decorativo que cubre toda la sección */}
        <div className="absolute inset-6 md:inset-12 border border-[var(--color-accent)]/20 rounded-3xl pointer-events-none" />
        <div className="absolute inset-10 md:inset-16 border border-[var(--color-accent)]/10 rounded-3xl pointer-events-none" />

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
              className="text-5xl md:text-7xl lg:text-8xl mb-8 text-[var(--color-text)] font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              <span className="block text-4xl md:text-5xl mb-4 text-[var(--color-rose)] font-light">La Boda de</span>
              <span className="italic bg-gradient-to-r from-[var(--color-rose)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">Estelle & Alexandre</span>
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
                &ldquo;Dos almas, un corazón, una vida juntos&rdquo;
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

        {/* Scroll indicator */}
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

      {/* Features Section */}
      < section className="py-32 px-4 relative overflow-hidden" >
        {/* Subtle background decoration */}
        < div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-transparent to-gray-50/50 -z-10" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                <span className="text-sm font-light tracking-[0.3em] text-[var(--color-accent)] uppercase">
                  Todo en un lugar
                </span>
                <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 font-playfair text-[var(--color-text)]">
              Descubre Todos los{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] bg-clip-text text-transparent italic">
                  Detalles
                </span>
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Encuentra toda la información que necesitas para acompañarnos en este día tan especial
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.href}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <Link href={feature.href} className="block h-full group">
                  <Card hover className="h-full relative overflow-hidden">
                    {/* Gradient overlay alegre */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-all duration-500`} />

                    <div className="relative space-y-6 text-center">
                      {/* Icon circular alegre */}
                      <div className="flex justify-center">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="relative"
                        >
                          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                            <feature.icon className="w-9 h-9 text-white" />
                          </div>
                          <motion.div
                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${feature.color} blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </motion.div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-light text-[var(--color-text)] group-hover:text-[var(--color-rose)] transition-colors duration-300">
                          {feature.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed text-sm font-light">
                          {feature.description}
                        </p>
                      </div>

                      {/* Decorative bottom */}
                      <div className="flex justify-center items-center gap-2 pt-4">
                        <motion.div
                          className="h-px w-8 bg-gradient-to-r from-transparent via-[var(--color-rose)] to-transparent"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                        />
                        <Heart className="w-3 h-3 text-[var(--color-rose)] fill-current opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                        <motion.div
                          className="h-px w-8 bg-gradient-to-r from-transparent via-[var(--color-rose)] to-transparent"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="py-24 px-4 relative overflow-hidden" >
        {/* Background decoration */}
        < div className="absolute inset-0 bg-gradient-to-br from-[var(--color-rose)]/10 via-[var(--color-secondary)]/5 to-transparent" />

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
              <div className="p-6 bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] rounded-full shadow-2xl shadow-[var(--color-rose)]/30">
                <Heart className="w-16 h-16 text-white fill-current" />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-light mb-6 font-playfair bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              ¿Nos Acompañas?
            </h2>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
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
