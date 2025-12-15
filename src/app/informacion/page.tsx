'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Info, Calendar, MapPin, Cloud, Shirt, Car, Clock, Palette, Sparkles, Heart, Wine, Camera, Music, Users } from 'lucide-react';

export default function InformacionPage() {
  const t = useTranslations('info');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Enhanced Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-white to-purple-50/30 -z-10" />
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-rose-200/30 via-purple-200/20 to-transparent rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-purple-300/30 via-rose-200/20 to-transparent rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-rose-100/10 to-purple-100/10 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2, 
              type: "spring", 
              stiffness: 200,
              damping: 15
            }}
            className="relative inline-block mb-8"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full blur-2xl opacity-40"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <div className="relative bg-gradient-to-br from-rose-500 via-rose-400 to-purple-500 p-6 rounded-3xl shadow-2xl">
              <Info className="w-14 h-14 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-light font-playfair mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex justify-center items-center gap-4 mb-8"
          >
            <motion.div 
              className="h-px w-20 bg-gradient-to-r from-transparent via-rose-400 to-transparent"
              animate={{ scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Sparkles className="w-5 h-5 text-rose-500" />
            <Heart className="w-6 h-6 text-rose-500 fill-current" />
            <Sparkles className="w-5 h-5 text-purple-500" />
            <motion.div 
              className="h-px w-20 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
              animate={{ scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair text-gray-800 mb-3">
              Día de la Boda
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-rose-500 to-purple-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Fecha y Hora Card - Enhanced */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-rose-100/50 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-100/50 to-transparent rounded-full blur-2xl -z-10" />
                
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-rose-500 to-rose-600 p-4 rounded-2xl shadow-lg"
                  >
                    <Calendar className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-playfair text-gray-800 mb-1">
                      {t('dateTime.title')}
                    </h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-rose-500 to-rose-300 rounded-full" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-rose-200">
                    <div className="absolute left-0 top-0 w-2 h-2 bg-rose-500 rounded-full -translate-x-[5px]" />
                    <p className="font-semibold text-rose-600 text-xl mb-1">
                      {t('dateTime.dateLabel')}
                    </p>
                    <p className="text-gray-700 text-lg">{t('dateTime.year')}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Clock className="w-5 h-5 text-rose-500" />
                      </div>
                      <span className="font-semibold text-gray-800 text-lg">{t('dateTime.schedule')}</span>
                    </div>
                    <div className="space-y-3 pl-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{t('dateTime.ceremony')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Wine className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{t('dateTime.cocktail')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Music className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{t('dateTime.dinnerParty')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ubicación Card - Enhanced */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100/50 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-full blur-2xl -z-10" />
                
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg"
                  >
                    <MapPin className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-playfair text-gray-800 mb-1">
                      {t('location.title')}
                    </h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-purple-200">
                    <div className="absolute left-0 top-0 w-2 h-2 bg-purple-500 rounded-full -translate-x-[5px]" />
                    <p className="font-semibold text-purple-600 text-xl mb-1">
                      {t('location.place')}
                    </p>
                    <p className="text-gray-700 text-lg">{t('location.city')}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-rose-50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Car className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="font-semibold text-gray-800 text-lg">{t('location.howToGet')}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed pl-4">
                      {t('location.transportInfo')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Style & Colors Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair text-gray-800 mb-3">
              Estilo & Ambiente
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-rose-500 to-purple-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Dress Code Card - Enhanced */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-rose-100/50 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-rose-100/50 to-transparent rounded-full blur-2xl -z-10" />
                
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-rose-500 to-pink-500 p-4 rounded-2xl shadow-lg"
                  >
                    <Shirt className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-playfair text-gray-800 mb-1">
                      {t('dressCode.title')}
                    </h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-rose-500 to-pink-400 rounded-full" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6">
                    <p className="text-gray-800 text-lg font-semibold mb-3">
                      {t('dressCode.etiquette')}
                    </p>
                    <div className="h-px bg-gradient-to-r from-rose-200 via-pink-200 to-transparent mb-4" />
                    <p className="text-gray-700 mb-4">{t('dressCode.recommendations')}</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{t('dressCode.suit')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{t('dressCode.shoes')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{t('dressCode.weather')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Color Palette Card - Enhanced */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100/50 overflow-hidden">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-purple-100/50 to-transparent rounded-full blur-2xl -z-10" />
                
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-purple-500 to-indigo-500 p-4 rounded-2xl shadow-lg"
                  >
                    <Palette className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-playfair text-gray-800 mb-1">
                      {t('colorPalette.title')}
                    </h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full" />
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  {t('colorPalette.description')}
                </p>

                <div className="space-y-6">
                  {/* Winter Palette */}
                  <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6">
                    <p className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      {t('colorPalette.winter')}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="group relative"
                      >
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-rose-300/80 to-rose-400/80 shadow-md cursor-pointer" />
                        <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="group relative"
                      >
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-300/80 to-orange-400/80 shadow-md cursor-pointer" />
                        <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="group relative"
                      >
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-sky-300/80 to-blue-400/80 shadow-md cursor-pointer" />
                        <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Spring Palette */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                    <p className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      {t('colorPalette.spring')}
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="group relative"
                      >
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-300/80 to-purple-400/80 shadow-md cursor-pointer" />
                        <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="group relative"
                      >
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-200/90 to-purple-300/90 shadow-md cursor-pointer" />
                        <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="group relative"
                      >
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-300/80 to-slate-400/80 shadow-md cursor-pointer" />
                        <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Weather & Additional Info */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8 max-w-6xl mx-auto"
        >
          {/* Weather Card - Enhanced */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-blue-100/50 overflow-hidden">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full blur-3xl -z-10" />
              
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-blue-500 to-cyan-500 p-5 rounded-2xl shadow-lg flex-shrink-0"
                >
                  <Cloud className="w-10 h-10 text-white" />
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-playfair text-gray-800 mb-3">
                    {t('weather.title')}
                  </h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-6" />
                  
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    {t('weather.description')}
                  </p>
                  <p className="text-gray-500 text-sm italic">
                    {t('weather.update')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Information Card - Enhanced */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-white/80 to-rose-50/50 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-rose-100/50 overflow-hidden">
              <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-t from-rose-100/50 to-transparent rounded-full blur-3xl -z-10" />
              
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="bg-gradient-to-br from-rose-500 to-purple-500 p-4 rounded-2xl shadow-lg"
                >
                  <Heart className="w-8 h-8 text-white fill-current" />
                </motion.div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-playfair text-gray-800">
                    Información Adicional
                  </h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full mt-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem 
                  icon={<MapPin className="w-5 h-5" />}
                  title="Alojamiento"
                  description="Consulta nuestra sección de turismo para ver hoteles recomendados en la zona."
                  color="rose"
                />
                <InfoItem 
                  icon={<Users className="w-5 h-5" />}
                  title="Niños"
                  description="Los niños son bienvenidos a nuestra celebración."
                  color="purple"
                />
                <InfoItem 
                  icon={<Wine className="w-5 h-5" />}
                  title="Restricciones alimentarias"
                  description="Por favor, indícanos cualquier alergia o restricción en el formulario de confirmación."
                  color="rose"
                />
                <InfoItem 
                  icon={<Camera className="w-5 h-5" />}
                  title="Fotos"
                  description="Habrá fotógrafo profesional, pero también nos encantaría que compartas tus fotos en nuestra galería."
                  color="purple"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoItem({ icon, title, description, color }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: 'rose' | 'purple';
}) {
  const colorClasses = {
    rose: 'from-rose-500 to-pink-500 text-rose-500',
    purple: 'from-purple-500 to-indigo-500 text-purple-500'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, x: 5 }}
      className="flex gap-4 p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-xl shadow-sm flex-shrink-0 h-fit`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
