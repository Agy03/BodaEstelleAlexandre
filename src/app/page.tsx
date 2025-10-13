'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, Users, Gift, Camera, Music, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: Users,
    title: 'Confirma tu Asistencia',
    description: 'Háznoslo saber para poder preparar todo perfectamente',
    href: '/rsvp',
    color: 'text-pink-500',
  },
  {
    icon: MapPin,
    title: 'Turismo Cercano',
    description: 'Descubre lugares increíbles para visitar',
    href: '/turismo',
    color: 'text-blue-500',
  },
  {
    icon: Gift,
    title: 'Lista de Regalos',
    description: 'Si deseas hacernos un regalo, aquí encontrarás ideas',
    href: '/regalos',
    color: 'text-purple-500',
  },
  {
    icon: Camera,
    title: 'Galería de Fotos',
    description: 'Comparte tus mejores momentos con nosotros',
    href: '/galeria',
    color: 'text-green-500',
  },
  {
    icon: Info,
    title: 'Información General',
    description: 'Todo lo que necesitas saber sobre el gran día',
    href: '/informacion',
    color: 'text-orange-500',
  },
  {
    icon: Music,
    title: 'Sugiere Música',
    description: 'Ayúdanos a crear la playlist perfecta',
    href: '/musica',
    color: 'text-red-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-background)] to-[var(--color-secondary)]/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Heart className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-6 text-[var(--color-primary)] fill-current" />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-[var(--color-primary)]">
            Boda Estelle
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Celebra con nosotros este día tan especial
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="font-medium">Fecha por confirmar</span>
            </div>
            <div className="hidden sm:block text-gray-400">•</div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="font-medium">Lugar por confirmar</span>
            </div>
          </div>

          <Link href="/rsvp">
            <Button size="lg" className="shadow-lg hover:shadow-xl">
              Confirmar Asistencia
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">
              Todo lo que Necesitas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explora toda la información sobre nuestra boda y participa en cada momento especial
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.href} variants={itemVariants}>
                <Link href={feature.href}>
                  <Card hover className="h-full cursor-pointer">
                    <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--color-primary)]">
              ¿Nos Acompañas?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Tu presencia es el mejor regalo que podríamos recibir. 
              Por favor, confirma tu asistencia lo antes posible.
            </p>
            <Link href="/rsvp">
              <Button size="lg" className="shadow-lg">
                Confirmar Ahora
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
