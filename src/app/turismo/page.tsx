'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';
import { MapPin, Hotel, Utensils, Landmark, PartyPopper, ExternalLink, Sparkles, Heart, Search, Navigation, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

type Place = {
  id: string;
  name: string;
  type: string;
  description: string;
  image?: string;
  link?: string;
  distance?: string;
  rating?: number;
  priceLevel?: number;
  recommended?: boolean;
  hours?: string;
  address?: string;
};

export default function TurismoPage() {
  const t = useTranslations('tourism');
  
  const categories = [
    { id: 'all', label: t('categories.all'), icon: Sparkles, color: 'from-[var(--color-primary)] to-[var(--color-secondary)]' },
    { id: 'hotel', label: t('categories.hotel'), icon: Hotel, color: 'from-[var(--color-secondary)] to-[var(--color-accent)]' },
    { id: 'restaurant', label: t('categories.restaurant'), icon: Utensils, color: 'from-[var(--color-primary)] to-[var(--color-accent)]' },
    { id: 'culture', label: t('categories.culture'), icon: Landmark, color: 'from-[var(--color-accent)] to-[var(--color-primary)]' },
    { id: 'leisure', label: t('categories.leisure'), icon: PartyPopper, color: 'from-[var(--color-secondary)] to-[var(--color-primary)]' },
  ];
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('tourismFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('tourismFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Filter places based on category and search
  const displayedPlaces = useMemo(() => {
    let filtered = places;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((place) => place.type === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((place) =>
        place.name.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query) ||
        place.type.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [places, selectedCategory, searchQuery]);

  // Get featured/recommended places
  const featuredPlaces = useMemo(() => {
    return places.filter((place) => place.recommended).slice(0, 3);
  }, [places]);

  const toggleFavorite = (placeId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      return newFavorites;
    });
  };

  const fetchPlaces = async () => {
    try {
      const response = await fetch('/api/tourism');
      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }
      const data = await response.json();
      // Asegurar que data es un array
      if (Array.isArray(data)) {
        setPlaces(data);
      } else {
        console.warn('API did not return an array:', data);
        setPlaces([]);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5] via-white to-[#F8EDE3] -z-10" />
      
      {/* Animated floating elements */}
      <motion.div 
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tr from-[var(--color-secondary)]/20 to-transparent rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent rounded-full blur-3xl -z-10"
        animate={{ 
          x: [-50, 50, -50],
          y: [-30, 30, -30],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="relative inline-block mb-8"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full blur-2xl opacity-40"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-6 rounded-full shadow-2xl">
              <MapPin className="w-14 h-14 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 font-playfair"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              {t('title')}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-gray-100 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all outline-none text-gray-700 placeholder:text-gray-400 shadow-lg"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Featured Section */}
        {!searchQuery && featuredPlaces.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-playfair">
                ✨ {t('mustSee')}
              </h2>
              <p className="text-gray-600">{t('mustSeeSubtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredPlaces.map((place, index) => {
                const categoryInfo = categories.find((c) => c.id === place.type);
                const Icon = categoryInfo?.icon || MapPin;
                const isFavorite = favorites.has(place.id);
                
                return (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Card hover className="h-full group overflow-hidden bg-gradient-to-br from-white via-white to-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/20">
                      {place.image && (
                        <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          <NextImage
                            src={place.image}
                            alt={place.name}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          
                          {/* Featured badge */}
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
                            <Star className="w-4 h-4 fill-current" />
                            {t('featured')}
                          </div>
                          
                          {/* Favorite button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFavorite(place.id)}
                            className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-xl"
                          >
                            <Heart
                              className={`w-5 h-5 transition-colors ${
                                isFavorite ? 'fill-[var(--color-rose)] text-[var(--color-rose)]' : 'text-gray-600'
                              }`}
                            />
                          </motion.button>

                          {/* Rating */}
                          {place.rating && (
                            <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-bold text-gray-800">{place.rating}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <CardContent className="pt-6 pb-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors flex-1">
                            {place.name}
                          </h3>
                          {place.priceLevel && (
                            <span className="text-[var(--color-accent)] font-bold text-lg ml-2">
                              {'€'.repeat(place.priceLevel)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${categoryInfo?.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                            <Icon className="w-3 h-3" />
                            {place.type}
                          </div>
                          {place.distance && (
                            <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                              <Navigation className="w-3 h-3" />
                              {place.distance}
                            </div>
                          )}
                          {place.hours && (
                            <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                              <Clock className="w-3 h-3" />
                              {place.hours}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                          {place.description}
                        </p>

                        {place.address && (
                          <p className="text-sm text-gray-500 mb-4 flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{place.address}</span>
                          </p>
                        )}
                        
                        <div className="flex gap-2">
                          {place.link && (
                            <a
                              href={place.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all group/btn"
                            >
                              <span>{t('moreInfo')}</span>
                              <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16" />
          </motion.div>
        )}

        {/* Category Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative px-8 py-4 rounded-2xl transition-all font-semibold text-base overflow-hidden group ${
                  isSelected
                    ? 'text-white shadow-xl'
                    : 'text-gray-700 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl border border-gray-100'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategory"
                    className={`absolute inset-0 bg-gradient-to-r ${category.color}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {!isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                )}
                
                <span className="relative z-10 flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {category.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Places Grid */}
        {loading ? (
          <motion.div 
            className="text-center py-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-16 h-16 text-[var(--color-primary)]" />
            </motion.div>
            <p className="mt-6 text-gray-600 text-lg">{t('discoveringPlaces')}</p>
          </motion.div>
        ) : !Array.isArray(displayedPlaces) || displayedPlaces.length === 0 ? (
          <motion.div 
            className="text-center py-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-100">
                {searchQuery ? (
                  <>
                    <Search className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('noResults')}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {t('noResultsFor')} &ldquo;{searchQuery}&rdquo;
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      {t('clearSearch')}
                    </button>
                  </>
                ) : (
                  <>
                    <MapPin className="w-20 h-20 mx-auto mb-6 text-[var(--color-primary)] opacity-50" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('comingSoon')}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {t('comingSoonMessage')}
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Results count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <p className="text-gray-600">
                {searchQuery ? (
                  <>{t('found')} <span className="font-bold text-[var(--color-primary)]">{displayedPlaces.length}</span> {displayedPlaces.length === 1 ? t('place') : t('places')}</>
                ) : (
                  <>{t('showing')} <span className="font-bold text-[var(--color-primary)]">{displayedPlaces.length}</span> {displayedPlaces.length === 1 ? t('place') : t('places')}</>
                )}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory + searchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {displayedPlaces.map((place, index) => {
                  const categoryInfo = categories.find((c) => c.id === place.type);
                  const Icon = categoryInfo?.icon || MapPin;
                  const isFavorite = favorites.has(place.id);
                  
                  return (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card hover className="h-full group overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100">
                        {place.image && (
                          <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                            <NextImage
                              src={place.image}
                              alt={place.name}
                              width={500}
                              height={300}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Favorite button */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleFavorite(place.id)}
                              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
                            >
                              <Heart
                                className={`w-4 h-4 transition-colors ${
                                  isFavorite ? 'fill-[var(--color-rose)] text-[var(--color-rose)]' : 'text-gray-600'
                                }`}
                              />
                            </motion.button>

                            {/* Category badge */}
                            <div className={`absolute top-3 left-3 bg-gradient-to-r ${categoryInfo?.color || 'from-gray-600 to-gray-700'} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5`}>
                              <Icon className="w-3 h-3" />
                              <span className="capitalize">{place.type}</span>
                            </div>

                            {/* Rating */}
                            {place.rating && (
                              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-bold text-gray-800">{place.rating}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-[var(--color-primary)] transition-colors flex-1 line-clamp-1">
                              {place.name}
                            </h3>
                            {place.priceLevel && (
                              <span className="text-[var(--color-accent)] font-bold ml-2">
                                {'€'.repeat(place.priceLevel)}
                              </span>
                            )}
                          </div>

                          {(place.distance || place.hours) && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {place.distance && (
                                <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                  <Navigation className="w-3 h-3" />
                                  {place.distance}
                                </div>
                              )}
                              {place.hours && (
                                <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                  <Clock className="w-3 h-3" />
                                  {place.hours}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 text-sm">
                            {place.description}
                          </p>
                          
                          {place.link && (
                            <a
                              href={place.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-semibold transition-colors group/link text-sm"
                            >
                              <span>{t('moreInformation')}</span>
                              <ExternalLink className="w-3 h-3 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
