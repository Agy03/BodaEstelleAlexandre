'use client';

import { motion } from 'framer-motion';
import { Info, Calendar, MapPin, Cloud, Shirt, Car, Clock, Palette } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function InformacionPage() {
  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5] via-white to-[#F8EDE3] -z-10" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-bl from-[var(--color-accent)]/20 to-transparent rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-[var(--color-primary)]/20 to-transparent rounded-full blur-3xl -z-10 animate-float" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] p-5 rounded-full">
              <Info className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Información General
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Todo lo que necesitas saber sobre nuestro gran día
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fecha y Hora */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-[var(--color-primary)]" />
                  <CardTitle>Fecha y Hora</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-[var(--color-primary)] text-lg">
                      Fecha por confirmar
                    </p>
                    <p className="text-gray-600">Año 2025</p>
                  </div>
                  <div className="border-t pt-3">
                    <Clock className="w-5 h-5 text-[var(--color-accent)] inline mr-2" />
                    <span className="font-medium">Horario:</span>
                    <ul className="mt-2 ml-7 space-y-1 text-gray-600">
                      <li>• Ceremonia: Por confirmar</li>
                      <li>• Cóctel: Después de la ceremonia</li>
                      <li>• Cena y fiesta: Por confirmar</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ubicación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-[var(--color-primary)]" />
                  <CardTitle>Ubicación</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-lg">Lugar por confirmar</p>
                    <p className="text-gray-600">Ciudad, País</p>
                  </div>
                  <div className="border-t pt-3">
                    <Car className="w-5 h-5 text-[var(--color-accent)] inline mr-2" />
                    <span className="font-medium">Cómo llegar:</span>
                    <p className="mt-2 text-gray-600">
                      Información de transporte y aparcamiento disponible próximamente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Código de Vestimenta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shirt className="w-8 h-8 text-[var(--color-primary)]" />
                  <CardTitle>Código de Vestimenta</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <strong>Etiqueta:</strong> Formal / Elegante
                  </p>
                  <div className="border-t pt-3">
                    <p className="font-medium mb-2">Recomendaciones:</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Traje o vestido largo para la ceremonia</li>
                      <li>• Calzado cómodo para la fiesta</li>
                      <li>• Ten en cuenta el clima de la temporada</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Paleta de Colores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Palette className="w-8 h-8 text-[var(--color-primary)]" />
                  <CardTitle>Paleta de Colores</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Si deseas coordinar tu atuendo con la decoración de la boda:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Enero - Marzo:</p>
                    <div className="flex gap-2">
                      <div className="w-16 h-16 rounded-lg bg-red-600" title="Rojo" />
                      <div className="w-16 h-16 rounded-lg bg-orange-500" title="Naranja" />
                      <div className="w-16 h-16 rounded-lg bg-blue-500" title="Azul" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Abril en adelante:</p>
                    <div className="flex gap-2">
                      <div className="w-16 h-16 rounded-lg bg-purple-500" title="Lila" />
                      <div className="w-16 h-16 rounded-lg bg-purple-400" title="Lila claro" />
                      <div className="w-16 h-16 rounded-lg bg-slate-400" title="Plata" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Clima */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Cloud className="w-8 h-8 text-[var(--color-primary)]" />
                  <CardTitle>Clima Esperado</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  El clima en la fecha del evento suele ser [descripción del clima]. 
                  Te recomendamos traer [ropa ligera/abrigo/etc.] y estar preparado para 
                  [sol/lluvia/etc.].
                </p>
                <p className="text-gray-500 mt-3 text-sm">
                  Actualizaremos esta información más cerca de la fecha del evento.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Alojamiento:</strong> Consulta nuestra sección de turismo para ver 
                  hoteles recomendados en la zona.
                </p>
                <p>
                  <strong>Niños:</strong> Los niños son bienvenidos a nuestra celebración.
                </p>
                <p>
                  <strong>Restricciones alimentarias:</strong> Por favor, indícanos cualquier 
                  alergia o restricción en el formulario de confirmación.
                </p>
                <p>
                  <strong>Fotos:</strong> Habrá fotógrafo profesional, pero también nos encantaría 
                  que compartas tus fotos en nuestra galería.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
