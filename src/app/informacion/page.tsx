'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Info, Calendar, MapPin, Cloud, Shirt, Car, Clock, Palette, Sparkles, Heart, Wine, Camera, Music, Users, UserRound } from 'lucide-react';

type WeddingInfo = {
  id: string;
  weddingDate: string;
  ceremonyTime: string;
  cocktailTime: string;
  dinnerPartyTime: string;
  venueName: string;
  venueAddress: string;
  venueLink?: string;
  venueLatitude?: number;
  venueLongitude?: number;
  dressCodeTitle: string;
  dressCodeDescription: string;
  dressCodeMen: string;
  dressCodeWomen: string;
  weatherSeason: string;
  weatherAvgTemp: string;
  weatherDescription: string;
  weatherRecommendations: string;
  parkingAvailable: boolean;
  parkingDescription?: string;
  accommodationTitle?: string;
  accommodationDescription?: string;
  giftPolicy?: string;
  childrenPolicy?: string;
  photographyNote?: string;
  scheduleNote?: string;
  transportNote?: string;
};

export default function InformacionPage() {
  const t = useTranslations('info');
  const tErrors = useTranslations('errors');
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeddingInfo();
  }, []);

  const fetchWeddingInfo = async () => {
    try {
      const response = await fetch('/api/wedding-info');
      if (response.ok) {
        const data = await response.json();
        setWeddingInfo(data);
      }
    } catch (error) {
      console.error('Error fetching wedding info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--color-rose)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!weddingInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{tErrors('couldNotLoadInfo')}</p>
      </div>
    );
  }
  
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
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-rose)]/5 via-[var(--color-background)] to-[var(--color-secondary)]/5" />
      <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-[var(--color-rose)]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-[var(--color-secondary)]/10 to-transparent rounded-full blur-3xl" />
      
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
              className="absolute inset-0 bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] rounded-full blur-2xl opacity-40"
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
            <div className="relative bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] p-6 rounded-3xl shadow-2xl">
              <Info className="w-14 h-14 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-light font-playfair mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-[var(--color-rose)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
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
              className="h-px w-20 bg-gradient-to-r from-transparent via-[var(--color-rose)] to-transparent"
              animate={{ scaleX: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
            <Heart className="w-6 h-6 text-[var(--color-rose)] fill-current" />
            <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
            <motion.div 
              className="h-px w-20 bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent"
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
            <h2 className="text-3xl md:text-4xl font-light font-playfair text-gray-800 mb-3">
              {t('weddingDay')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Fecha y Hora Card - Enhanced */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[var(--color-rose)]/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--color-rose)]/10 to-transparent rounded-full blur-2xl -z-10" />
                
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] p-4 rounded-2xl shadow-lg"
                  >
                    <Calendar className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-light font-playfair text-gray-800 mb-1">
                      {t('dateTime.title')}
                    </h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] rounded-full" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-[var(--color-rose)]/30">
                    <div className="absolute left-0 top-0 w-2 h-2 bg-[var(--color-rose)] rounded-full -translate-x-[5px]" />
                    <p className="font-semibold text-[var(--color-rose)] text-xl mb-1">
                      {t('dateTime.dateLabel')}
                    </p>
                    <p className="text-gray-700 text-lg">{weddingInfo.weddingDate}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[var(--color-rose)]/5 to-[var(--color-secondary)]/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Clock className="w-5 h-5 text-[var(--color-rose)]" />
                      </div>
                      <span className="font-semibold text-gray-800 text-lg">{t('dateTime.schedule')}</span>
                    </div>
                    <div className="space-y-3 pl-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-[var(--color-rose)] mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{t('dateTime.ceremonyLabel')}: {weddingInfo.ceremonyTime}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Wine className="w-4 h-4 text-[var(--color-rose)] mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{t('dateTime.cocktailLabel')}: {weddingInfo.cocktailTime}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Music className="w-4 h-4 text-[var(--color-rose)] mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{t('dateTime.dinnerPartyLabel')}: {weddingInfo.dinnerPartyTime}</span>
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
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[var(--color-secondary)]/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--color-secondary)]/10 to-transparent rounded-full blur-2xl -z-10" />
                
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] p-4 rounded-2xl shadow-lg"
                  >
                    <MapPin className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-light font-playfair text-gray-800 mb-1">
                      {t('location.title')}
                    </h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] rounded-full" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-[var(--color-secondary)]/30">
                    <div className="absolute left-0 top-0 w-2 h-2 bg-[var(--color-secondary)] rounded-full -translate-x-[5px]" />
                    <p className="font-semibold text-[var(--color-secondary)] text-xl mb-1">
                      {weddingInfo.venueName}
                    </p>
                    <p className="text-gray-700 text-lg">{weddingInfo.venueAddress}</p>
                    {weddingInfo.venueLink && (
                      <a 
                        href={weddingInfo.venueLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--color-secondary)] hover:underline text-sm mt-2 inline-block"
                      >
                        {t('additional.viewOnMap')}
                      </a>
                    )}
                  </div>
                  
                  {(weddingInfo.parkingAvailable || weddingInfo.transportNote) && (
                    <div className="bg-gradient-to-br from-[var(--color-secondary)]/5 to-[var(--color-rose)]/5 rounded-2xl p-6">
                      {weddingInfo.parkingAvailable && weddingInfo.parkingDescription && (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                              <Car className="w-5 h-5 text-[var(--color-secondary)]" />
                            </div>
                            <span className="font-semibold text-gray-800 text-lg">{t('location.parking')}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pl-4 mb-4">
                            {weddingInfo.parkingDescription}
                          </p>
                        </>
                      )}
                      {weddingInfo.transportNote && (
                        <p className="text-gray-700 leading-relaxed pl-4">
                          {weddingInfo.transportNote}
                        </p>
                      )}
                    </div>
                  )}
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
            <h2 className="text-3xl md:text-4xl font-light font-playfair text-gray-800 mb-3">
              {t('styleAndAmbience')}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Dress Code Card - Enhanced */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[var(--color-rose)]/20 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[var(--color-rose)]/10 to-transparent rounded-full blur-2xl -z-10" />
                
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] p-4 rounded-2xl shadow-lg"
                  >
                    <Shirt className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-light font-playfair text-gray-800 mb-1">
                      {t('dressCode.title')}
                    </h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] rounded-full" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[var(--color-rose)]/5 to-[var(--color-secondary)]/5 rounded-2xl p-6">
                    <p className="text-gray-800 text-lg font-semibold mb-3">
                      {weddingInfo.dressCodeTitle}
                    </p>
                    <div className="h-px bg-gradient-to-r from-[var(--color-rose)]/30 via-[var(--color-secondary)]/30 to-transparent mb-4" />
                    <p className="text-gray-700 mb-4">{weddingInfo.dressCodeDescription}</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-rose)] mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800 mb-1 flex items-center gap-1.5"><Shirt className="w-4 h-4 text-[var(--color-secondary)]" /> {t('dressCode.menLabel')}</p>
                          <p className="text-gray-700 text-sm">{weddingInfo.dressCodeMen}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-rose)] mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-800 mb-1 flex items-center gap-1.5"><UserRound className="w-4 h-4 text-[var(--color-rose)]" /> {t('dressCode.womenLabel')}</p>
                          <p className="text-gray-700 text-sm">{weddingInfo.dressCodeWomen}</p>
                        </div>
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
              className="col-span-1 lg:col-span-2"
            >
              <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[var(--color-secondary)]/20 overflow-hidden">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[var(--color-secondary)]/10 to-transparent rounded-full blur-2xl -z-10" />
                
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] p-4 rounded-2xl shadow-lg"
                  >
                    <Palette className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-light font-playfair text-gray-800 mb-1">
                      {t('colorPalette.title')}
                    </h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] rounded-full" />
                  </div>
                </div>

                <p className="text-gray-700 mb-8 leading-relaxed">
                  {t('colorPalette.description')}
                </p>

                <div className="space-y-12">
                  {/* Pink & Rose Collection */}
                  <div>
                    <h4 className="text-xl font-light font-playfair text-gray-800 mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[var(--color-rose)]" />
                      {t('colorPalette.pinkAndRose')}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                      <ColorSwatch color="#F5D5E0" label="Zartrosa" />
                      <ColorSwatch color="#F0D5C8" label="Puderrosa" />
                      <ColorSwatch color="#D4A5A0" label="Altrosa" />
                      <ColorSwatch color="#E8D5C4" label="Rosettenrosa" />
                      <ColorSwatch color="#F0D0B8" label="Roségold" />
                      <ColorSwatch color="#F0C8D8" label="Englisches Rosa" />
                      <ColorSwatch color="#FF9999" label="Lachsrosa" />
                      <ColorSwatch color="#C97860" label="Antike Rose" />
                      <ColorSwatch color="#FF99DD" label="Bonbonrosa" />
                      <ColorSwatch color="#FF1493" label="Barbie™ Pink" />
                    </div>
                  </div>

                  {/* Purple & Mauve Collection */}
                  <div>
                    <h4 className="text-xl font-light font-playfair text-gray-800 mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[var(--color-secondary)]" />
                      {t('colorPalette.purpleAndMauve')}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      <ColorSwatch color="#E8D5F2" label="Lavendel" />
                      <ColorSwatch color="#D5C0E8" label="Frostiges Flieder" />
                      <ColorSwatch color="#D8B5E8" label="Flieder" />
                      <ColorSwatch color="#B8A0D8" label="Blauregen" />
                      <ColorSwatch color="#A860C8" label="Tahiti" />
                      <ColorSwatch color="#A08080" label="Vintage Mauve" />
                      <ColorSwatch color="#7860A8" label="Amethyst" />
                      <ColorSwatch color="#805858" label="Wüstenrose" />
                      <ColorSwatch color="#662055" label="Sangria" />
                      <ColorSwatch color="#4A2870" label="Traube" />
                      <ColorSwatch color="#7A3A7A" label="Pflaume" />
                    </div>
                  </div>

                  {/* Patterned & Textured Swatches */}
                  <div>
                    <h4 className="text-xl font-light font-playfair text-gray-800 mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                      {t('colorPalette.patternedAndTextured')}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
                      <ColorSwatch color="#F5E5E0" label="Rosa Farn Blumen" />
                      <ColorSwatch color="#F0D0D8" label="Blush Pink Floral Burnout" />
                      <ColorSwatch color="#F0D8E8" label="Abstraktes Aquarell Mit Blumen" />
                      <ColorSwatch color="#D8A8A0" label="Altrosa Blumen Burnout" />
                      <ColorSwatch color="#D4A878" label="Rosette Floral Burnout" />
                      <ColorSwatch color="#C8A8D8" label="Lila Blumen Burnout" />
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
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-[var(--color-accent)]/20 overflow-hidden">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-[var(--color-accent)]/10 to-transparent rounded-full blur-3xl -z-10" />
              
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] p-5 rounded-2xl shadow-lg flex-shrink-0"
                >
                  <Cloud className="w-10 h-10 text-white" />
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-light font-playfair text-gray-800 mb-3">
                    {t('weather.title')}
                  </h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] rounded-full mb-6" />
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">
                        {weddingInfo.weatherSeason} - {weddingInfo.weatherAvgTemp}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {weddingInfo.weatherDescription}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-secondary)]/10 rounded-xl p-4">
                      <p className="font-semibold text-gray-800 mb-2">💡 {t('weather.recommendations')}</p>
                      <p className="text-gray-700 text-sm">
                        {weddingInfo.weatherRecommendations}
                      </p>
                    </div>
                  </div>
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
            <div className="relative bg-gradient-to-br from-white/80 to-[var(--color-rose)]/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-[var(--color-rose)]/20 overflow-hidden">
              <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-t from-[var(--color-rose)]/10 to-transparent rounded-full blur-3xl -z-10" />
              
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] p-4 rounded-2xl shadow-lg"
                >
                  <Heart className="w-8 h-8 text-white fill-current" />
                </motion.div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-light font-playfair text-gray-800">
                    {t('additional.title')}
                  </h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] rounded-full mt-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {weddingInfo.accommodationTitle && weddingInfo.accommodationDescription && (
                  <InfoItem 
                    icon={<MapPin className="w-5 h-5" />}
                    title={weddingInfo.accommodationTitle}
                    description={weddingInfo.accommodationDescription}
                    color="rose"
                  />
                )}
                {weddingInfo.childrenPolicy && (
                  <InfoItem 
                    icon={<Users className="w-5 h-5" />}
                    title={t('additional.children.title')}
                    description={weddingInfo.childrenPolicy}
                    color="secondary"
                  />
                )}
                {weddingInfo.giftPolicy && (
                  <InfoItem 
                    icon={<Wine className="w-5 h-5" />}
                    title={t('additional.gifts.title')}
                    description={weddingInfo.giftPolicy}
                    color="rose"
                  />
                )}
                {weddingInfo.photographyNote && (
                  <InfoItem 
                    icon={<Camera className="w-5 h-5" />}
                    title={t('additional.photos.title')}
                    description={weddingInfo.photographyNote}
                    color="secondary"
                  />
                )}
                {weddingInfo.scheduleNote && (
                  <InfoItem 
                    icon={<Clock className="w-5 h-5" />}
                    title={t('additional.schedule.title')}
                    description={weddingInfo.scheduleNote}
                    color="rose"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center gap-3 cursor-pointer group"
    >
      <div 
        className="w-full aspect-square rounded-lg shadow-lg border-2 border-gray-200 transition-all group-hover:shadow-xl group-hover:border-gray-400"
        style={{ backgroundColor: color }}
      />
      <p className="text-sm font-medium text-gray-700 text-center leading-tight group-hover:text-gray-900 transition-colors">
        {label}
      </p>
    </motion.div>
  );
}

function InfoItem({ icon, title, description, color }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: 'rose' | 'secondary';
}) {
  const colorClasses = {
    rose: 'from-[var(--color-rose)] to-[var(--color-secondary)]',
    secondary: 'from-[var(--color-secondary)] to-[var(--color-accent)]'
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
