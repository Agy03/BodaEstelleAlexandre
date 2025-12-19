'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';
import { Gift, ExternalLink, Loader, Heart, Search, Sparkles, ShoppingBag, Tag, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type GiftItem = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  link?: string;
  reserved: boolean;
  purchased: boolean;
  category?: string;
  priority?: boolean;
  reservedBy?: string;
  reservedAt?: string;
  reservationExpiresAt?: string;
  receiptUrl?: string;
  receiptStatus?: string;
};

export default function RegalosPage() {
  const t = useTranslations('gifts');
  const tCommon = useTranslations('common');
  
  const categories = [
    { id: 'all', label: t('categories.all'), icon: Sparkles, color: 'from-[var(--color-primary)] to-[var(--color-secondary)]' },
    { id: 'home', label: t('categories.home'), icon: Gift, color: 'from-[var(--color-secondary)] to-[var(--color-accent)]' },
    { id: 'experience', label: t('categories.experience'), icon: Users, color: 'from-[var(--color-primary)] to-[var(--color-accent)]' },
    { id: 'other', label: t('categories.other'), icon: Tag, color: 'from-[var(--color-accent)] to-[var(--color-primary)]' },
  ];
  
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('giftFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('giftFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    fetchGifts();
  }, []);

  // Filter gifts
  const displayedGifts = useMemo(() => {
    let filtered = gifts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((gift) => gift.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((gift) =>
        gift.name.toLowerCase().includes(query) ||
        (gift.description?.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [gifts, selectedCategory, searchQuery]);

  // Priority/Featured gifts
  const priorityGifts = useMemo(() => {
    return gifts.filter((gift) => gift.priority && !gift.purchased && !gift.reserved).slice(0, 3);
  }, [gifts]);

  // Statistics
  const stats = useMemo(() => {
    const total = gifts.length;
    const reserved = gifts.filter(g => g.reserved).length;
    const purchased = gifts.filter(g => g.purchased).length;
    const available = total - reserved - purchased;
    return { total, reserved, purchased, available };
  }, [gifts]);

  const toggleFavorite = (giftId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(giftId)) {
        newFavorites.delete(giftId);
      } else {
        newFavorites.add(giftId);
      }
      return newFavorites;
    });
  };

  const fetchGifts = async () => {
    try {
      const response = await fetch('/api/gifts');
      const data = await response.json();
      setGifts(data);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (gift: GiftItem) => {
    setSelectedGift(gift);
    setShowReserveModal(true);
  };

  const confirmReserve = async () => {
    if (!selectedGift) return;
    
    const name = prompt('Por favor, introduce tu nombre para reservar este regalo:');
    if (!name) return;

    try {
      const response = await fetch(`/api/gifts/${selectedGift.id}/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservedBy: name }),
      });

      if (response.ok) {
        // Guardar el nombre en localStorage para usarlo luego
        localStorage.setItem(`gift_${selectedGift.id}_reservedBy`, name);
        
        fetchGifts();
        setShowReserveModal(false);
        setSelectedGift(null);
        // Show success animation
        alert('¡Regalo reservado! Recuerda subir el recibo de compra en los próximos 7 días. 💝');
      }
    } catch (error) {
      console.error('Error reserving gift:', error);
      alert('Error al reservar el regalo. Por favor, inténtalo de nuevo.');
    }
  };

  const handleUploadReceipt = async (gift: GiftItem) => {
    setSelectedGift(gift);
    setShowReceiptModal(true);
  };

  const uploadReceipt = async (file: File) => {
    if (!selectedGift) return;

    const reservedBy = localStorage.getItem(`gift_${selectedGift.id}_reservedBy`);
    if (!reservedBy) {
      alert('No se encontró información de reserva. Por favor, contacta con los novios.');
      return;
    }

    setUploadingReceipt(true);

    try {
      const formData = new FormData();
      formData.append('receipt', file);
      formData.append('reservedBy', reservedBy);

      const response = await fetch(`/api/gifts/${selectedGift.id}/receipt`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchGifts();
        setShowReceiptModal(false);
        setSelectedGift(null);
        alert('¡Recibo subido con éxito! Los novios lo revisarán pronto. 💝');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al subir el recibo');
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Error al subir el recibo. Por favor, inténtalo de nuevo.');
    } finally {
      setUploadingReceipt(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5] via-white to-[#F8EDE3] -z-10" />
      
      {/* Animated floating elements */}
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-tr from-[var(--color-accent)]/20 to-transparent rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-[var(--color-secondary)]/10 to-transparent rounded-full blur-3xl -z-10"
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
              className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full blur-2xl opacity-40"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-6 rounded-full shadow-2xl">
              <Gift className="w-14 h-14 text-white" />
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

        {/* Statistics */}
        {!loading && gifts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="text-3xl font-bold text-[var(--color-primary)] mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">{t('title')}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.available}</div>
              <div className="text-sm text-gray-600">{t('stats.available')}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-1">{stats.reserved}</div>
              <div className="text-sm text-gray-600">{t('stats.reserved')}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="text-3xl font-bold text-gray-600 mb-1">{stats.purchased}</div>
              <div className="text-sm text-gray-600">{t('stats.purchased')}</div>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar regalo por nombre o descripción..."
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

        {/* Category Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
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
                    layoutId="activeGiftCategory"
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

        {/* Priority Gifts Section */}
        {!searchQuery && priorityGifts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-playfair">
                💝 Más deseados
              </h2>
              <p className="text-gray-600">Regalos que nos harían especialmente felices</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {priorityGifts.map((gift, index) => {
                const isFavorite = favorites.has(gift.id);
                
                return (
                  <motion.div
                    key={gift.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <GiftCard 
                      gift={gift} 
                      isFavorite={isFavorite}
                      onToggleFavorite={toggleFavorite}
                      onReserve={handleReserve}
                      onUploadReceipt={handleUploadReceipt}
                      isPriority
                    />
                  </motion.div>
                );
              })}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16" />
          </motion.div>
        )}

        {/* Results counter */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <p className="text-gray-600">
              Mostrando <span className="font-semibold text-[var(--color-primary)]">{displayedGifts.length}</span> {displayedGifts.length === 1 ? 'regalo' : 'regalos'}
              {searchQuery && <span className="ml-1">para &ldquo;{searchQuery}&rdquo;</span>}
            </p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-[var(--color-primary)] animate-spin mb-4" />
            <p className="text-gray-600">{tCommon('loading')}</p>
          </div>
        ) : displayedGifts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-gray-100">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {searchQuery ? 'No se encontraron regalos' : 'No hay regalos disponibles'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Pronto añadiremos más regalos'
                }
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white"
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {displayedGifts.map((gift, index) => {
                const isFavorite = favorites.has(gift.id);
                
                return (
                  <motion.div
                    key={gift.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GiftCard 
                      gift={gift} 
                      isFavorite={isFavorite}
                      onToggleFavorite={toggleFavorite}
                      onReserve={handleReserve}
                      onUploadReceipt={handleUploadReceipt}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Reserve Modal */}
      <AnimatePresence>
        {showReserveModal && selectedGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReserveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Reservar regalo</h3>
                <p className="text-gray-600">{selectedGift.name}</p>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={confirmReserve}
                  className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-lg py-4"
                >
                  Confirmar reserva
                </Button>
                <Button
                  onClick={() => setShowReserveModal(false)}
                  className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 py-4"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Upload Modal */}
      <AnimatePresence>
        {showReceiptModal && selectedGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReceiptModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Subir Recibo</h3>
                <p className="text-gray-600">{selectedGift.name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Sube el recibo de compra para confirmar tu regalo
                </p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  id="receipt-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      uploadReceipt(file);
                    }
                  }}
                  disabled={uploadingReceipt}
                />
                <label
                  htmlFor="receipt-upload"
                  className={`block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg py-4 rounded-xl text-center font-semibold cursor-pointer hover:shadow-xl transition-all ${
                    uploadingReceipt ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingReceipt ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Subiendo...
                    </span>
                  ) : (
                    'Seleccionar archivo'
                  )}
                </label>
                <Button
                  onClick={() => setShowReceiptModal(false)}
                  className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 py-4"
                  disabled={uploadingReceipt}
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Gift Card Component
function GiftCard({ 
  gift, 
  isFavorite, 
  onToggleFavorite, 
  onReserve,
  onUploadReceipt,
  isPriority = false 
}: { 
  gift: GiftItem; 
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onReserve: (gift: GiftItem) => void;
  onUploadReceipt: (gift: GiftItem) => void;
  isPriority?: boolean;
}) {
  const isAvailable = !gift.reserved && !gift.purchased;
  const canUploadReceipt = gift.reserved && !gift.receiptUrl && !gift.purchased;
  const hasReceipt = !!gift.receiptUrl;

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
      isPriority ? 'border-4 border-[var(--color-accent)]' : 'border border-gray-100'
    }`}>
      {/* Priority Badge */}
      {isPriority && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Más deseado
        </div>
      )}

      {/* Favorite Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggleFavorite(gift.id)}
        className={`absolute top-4 right-4 z-20 w-12 h-12 rounded-full backdrop-blur-sm shadow-lg transition-all flex items-center justify-center ${
          isFavorite 
            ? 'bg-red-500 text-white' 
            : 'bg-white/90 text-gray-400 hover:text-red-500'
        }`}
      >
        <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
      </motion.button>

      <CardContent className="p-0">
        {/* Image */}
        <div className={`relative overflow-hidden ${isPriority ? 'h-64' : 'h-52'} bg-gradient-to-br from-gray-100 to-gray-50`}>
          {gift.image ? (
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <NextImage
                src={gift.image}
                alt={gift.name}
                fill
                className="object-contain p-2"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Gift className="w-16 h-16 text-gray-300" />
            </div>
          )}

          {/* Status overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className={`px-6 py-3 rounded-full font-bold text-white shadow-lg ${
                gift.purchased 
                  ? 'bg-gradient-to-r from-gray-500 to-gray-700' 
                  : 'bg-gradient-to-r from-orange-500 to-orange-700'
              }`}>
                {gift.purchased ? '✓ Comprado' : '⏳ Reservado'}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
            {gift.name}
          </h3>
          
          {gift.description && (
            <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
              {gift.description}
            </p>
          )}

          {/* Price and Category */}
          <div className="flex items-center justify-between mb-4">
            {gift.price && (
              <div className="text-2xl font-bold text-[var(--color-primary)]">
                {gift.price}€
              </div>
            )}
            {gift.category && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
                gift.category === 'home' ? 'from-[var(--color-secondary)] to-[var(--color-accent)]' :
                gift.category === 'experience' ? 'from-[var(--color-primary)] to-[var(--color-accent)]' :
                'from-[var(--color-accent)] to-[var(--color-primary)]'
              } text-white`}>
                {gift.category === 'home' ? 'Hogar' : gift.category === 'experience' ? 'Experiencia' : 'Otro'}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {isAvailable ? (
              <div className="flex gap-3">
                <Button
                  onClick={() => onReserve(gift)}
                  className="flex-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white hover:shadow-xl transition-all"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Reservar
                </Button>
                {gift.link && (
                  <Button
                    onClick={() => window.open(gift.link, '_blank')}
                    className="bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                {gift.link && (
                  <Button
                    onClick={() => window.open(gift.link, '_blank')}
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver en tienda
                  </Button>
                )}
              </div>
            )}
            
            {/* Upload receipt button for reserved gifts */}
            {canUploadReceipt && (
              <Button
                onClick={() => onUploadReceipt(gift)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl transition-all"
              >
                📄 Subir Recibo
              </Button>
            )}

            {/* Receipt status */}
            {hasReceipt && (
              <div className="bg-purple-100 text-purple-800 text-xs px-3 py-2 rounded text-center font-medium">
                {gift.receiptStatus === 'pending' && '⏳ Recibo en revisión'}
                {gift.receiptStatus === 'approved' && '✓ Recibo aprobado'}
                {gift.receiptStatus === 'rejected' && '✗ Recibo rechazado'}
              </div>
            )}
          </div>

          {/* Reserved by */}
          {gift.reserved && gift.reservedBy && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Reservado por <span className="font-semibold text-gray-700">{gift.reservedBy}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
