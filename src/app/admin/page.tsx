'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import NextImage from 'next/image';
import { 
  Users, 
  Camera, 
  Music, 
  CheckCircle, 
  Gift,
  MapPin,
  Loader,
  LogOut,
  Plus,
  Edit,
  Trash2,
  BarChart3
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PlaceModal } from '@/components/admin/PlaceModal';
import { GiftModal } from '@/components/admin/GiftModal';

type RSVP = {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  guests: number;
  comments?: string;
  createdAt: string;
};

type Photo = {
  id: string;
  url: string;
  caption?: string;
  uploaderName?: string;
  approved: boolean;
  createdAt: string;
};

type Song = {
  id: string;
  title: string;
  artist: string;
  suggestedBy?: string;
  approved: boolean;
  createdAt: string;
};

type Gift = {
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
};

type TourismPlace = {
  id: string;
  name: string;
  description?: string;
  category: string;
  address?: string;
  distance?: string;
  rating?: number;
  priceLevel?: string;
  hours?: string;
  image?: string;
  link?: string;
  recommended?: boolean;
};

export default function AdminPage() {
  const t = useTranslations('admin');
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [places, setPlaces] = useState<TourismPlace[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'rsvps' | 'photos' | 'songs' | 'gifts' | 'places'>('overview');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<TourismPlace | undefined>(undefined);
  const [editingGift, setEditingGift] = useState<Gift | undefined>(undefined);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rsvpRes, photoRes, songRes, giftRes, tourismRes] = await Promise.all([
        fetch('/api/rsvp'),
        fetch('/api/photos'),
        fetch('/api/songs'),
        fetch('/api/gifts'),
        fetch('/api/tourism'),
      ]);

      setRsvps(await rsvpRes.json());
      setPhotos(await photoRes.json());
      setSongs(await songRes.json());
      setGifts(await giftRes.json());
      setPlaces(await tourismRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approvePhoto = async (photoId: string) => {
    try {
      await fetch(`/api/photos/${photoId}/approve`, { method: 'POST' });
      fetchData();
    } catch (error) {
      console.error('Error approving photo:', error);
    }
  };

  const deletePhoto = async (photoId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta foto?')) return;
    
    try {
      await fetch(`/api/photos/${photoId}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const approveSong = async (songId: string) => {
    try {
      await fetch(`/api/songs/${songId}/approve`, { method: 'POST' });
      fetchData();
    } catch (error) {
      console.error('Error approving song:', error);
    }
  };

  const deleteSong = async (songId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta canción?')) return;
    
    try {
      await fetch(`/api/songs/${songId}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  // Gift functions
  const handleSaveGift = async (giftData: Partial<Gift>) => {
    try {
      if (editingGift) {
        // Update existing gift
        await fetch(`/api/gifts/${editingGift.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(giftData),
        });
      } else {
        // Create new gift
        await fetch('/api/gifts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(giftData),
        });
      }
      fetchData();
      setEditingGift(undefined);
    } catch (error) {
      console.error('Error saving gift:', error);
    }
  };

  const handleEditGift = (gift: Gift) => {
    setEditingGift(gift);
    setIsGiftModalOpen(true);
  };

  const handleDeleteGift = async (giftId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este regalo?')) return;
    
    try {
      await fetch(`/api/gifts/${giftId}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting gift:', error);
    }
  };

  // Place functions
  const handleSavePlace = async (placeData: Partial<TourismPlace>) => {
    try {
      if (editingPlace) {
        // Update existing place
        await fetch(`/api/tourism/${editingPlace.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(placeData),
        });
      } else {
        // Create new place
        await fetch('/api/tourism', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(placeData),
        });
      }
      fetchData();
      setEditingPlace(undefined);
    } catch (error) {
      console.error('Error saving place:', error);
    }
  };

  const handleEditPlace = (place: TourismPlace) => {
    setEditingPlace(place);
    setIsPlaceModalOpen(true);
  };

  const handleDeletePlace = async (placeId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este lugar?')) return;
    
    try {
      await fetch(`/api/tourism/${placeId}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  const attendingCount = rsvps.filter((r) => r.attending).length;
  const totalGuests = rsvps.reduce((sum, r) => sum + (r.attending ? r.guests + 1 : 0), 0);
  const pendingPhotos = photos.filter((p) => !p.approved).length;
  const pendingSongs = songs.filter((s) => !s.approved).length;
  const availableGifts = gifts.filter(g => !g.reserved && !g.purchased).length;
  const reservedGifts = gifts.filter(g => g.reserved).length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-[#FFF9F5] via-[#FCF5F1] to-[#F9F2EE] relative">
      {/* Patrón sutil de encaje de fondo */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-[#E8B4B8]/20 to-[#C9A7C7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[#C9A7C7]/10 to-[#D4AF97]/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header con degradado y sombra elegante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 relative z-10"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[#E8B4B8]/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-light mb-3 bg-gradient-to-r from-[#E8B4B8] via-[#C9A7C7] to-[#D4AF97] bg-clip-text text-transparent font-playfair">
                  {t('title')}
                </h1>
                <p className="text-xl text-gray-600 flex items-center gap-2 font-light">
                  <span>Bienvenid@s,</span>
                  <span className="font-semibold bg-gradient-to-r from-[#E8B4B8] to-[#C9A7C7] bg-clip-text text-transparent">
                    {session?.user?.name || 'Novios'}
                  </span>
                  <span className="text-2xl">💝</span>
                </p>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#E8B4B8] to-[#C9A7C7] text-white hover:shadow-2xl hover:shadow-[#E8B4B8]/50 hover:scale-105 transition-all px-8 py-4 text-lg"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview con estética romántica */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[#E8B4B8] to-[#d69da3] border-0 shadow-2xl overflow-hidden relative group hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
              <CardContent className="pt-8 pb-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <Users className="w-12 h-12 text-white/90" />
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">RSVPs</span>
                  </div>
                </div>
                <p className="text-5xl font-black text-white mb-2">{attendingCount}</p>
                <p className="text-white/90 font-semibold text-lg">Confirmados</p>
                <p className="text-white/70 text-sm mt-1">de {rsvps.length} respuestas</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-[#C9A7C7] to-[#b08db5] border-0 shadow-2xl overflow-hidden relative group hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
              <CardContent className="pt-8 pb-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <Users className="w-12 h-12 text-white/90" />
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">Total</span>
                  </div>
                </div>
                <p className="text-5xl font-black text-white mb-2">{totalGuests}</p>
                <p className="text-white/90 font-semibold text-lg">Invitados</p>
                <p className="text-white/70 text-sm mt-1">incluyendo acompañantes</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-[#D4AF97] to-[#c29d84] border-0 shadow-2xl overflow-hidden relative group hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
              <CardContent className="pt-8 pb-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <Camera className="w-12 h-12 text-white/90" />
                  {pendingPhotos > 0 && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                      <span className="text-xs font-bold">{pendingPhotos}</span>
                    </div>
                  )}
                </div>
                <p className="text-5xl font-black text-white mb-2">{photos.length}</p>
                <p className="text-white/90 font-semibold text-lg">Fotos</p>
                <p className="text-white/70 text-sm mt-1">
                  {pendingPhotos > 0 ? `${pendingPhotos} por aprobar` : 'Todas aprobadas ✓'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-[#f0c4c8] to-[#E8B4B8] border-0 shadow-2xl overflow-hidden relative group hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
              <CardContent className="pt-8 pb-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <Music className="w-12 h-12 text-white/90" />
                  {pendingSongs > 0 && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                      <span className="text-xs font-bold">{pendingSongs}</span>
                    </div>
                  )}
                </div>
                <p className="text-5xl font-black text-white mb-2">{songs.length}</p>
                <p className="text-white/90 font-semibold text-lg">Canciones</p>
                <p className="text-white/70 text-sm mt-1">
                  {pendingSongs > 0 ? `${pendingSongs} por aprobar` : 'Todas aprobadas ✓'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-[#d9c7d7] to-[#C9A7C7] border-0 shadow-2xl overflow-hidden relative group hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
              <CardContent className="pt-8 pb-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <Gift className="w-12 h-12 text-white/90" />
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">{availableGifts}</span>
                  </div>
                </div>
                <p className="text-5xl font-black text-white mb-2">{gifts.length}</p>
                <p className="text-white/90 font-semibold text-lg">Regalos</p>
                <p className="text-white/70 text-sm mt-1">
                  {availableGifts} disponibles, {reservedGifts} reservados
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-[#e4cabc] to-[#D4AF97] border-0 shadow-2xl overflow-hidden relative group hover:scale-105 transition-transform">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
              <CardContent className="pt-8 pb-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <MapPin className="w-12 h-12 text-white/90" />
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">Lugares</span>
                  </div>
                </div>
                <p className="text-5xl font-black text-white mb-2">{places.length}</p>
                <p className="text-white/90 font-semibold text-lg">Turismo</p>
                <p className="text-white/70 text-sm mt-1">lugares recomendados</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Navigation Tabs Mejoradas */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-[#E8B4B8]/20 mb-8 relative z-10">
          <div className="flex flex-wrap gap-2">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              icon={<BarChart3 className="w-4 h-4" />}
            >
              Resumen
            </TabButton>
            <TabButton
              active={activeTab === 'rsvps'}
              onClick={() => setActiveTab('rsvps')}
              icon={<Users className="w-4 h-4" />}
              badge={rsvps.length}
            >
              RSVPs
            </TabButton>
            <TabButton
              active={activeTab === 'photos'}
              onClick={() => setActiveTab('photos')}
              icon={<Camera className="w-4 h-4" />}
              badge={pendingPhotos > 0 ? pendingPhotos : undefined}
              badgeColor="purple"
            >
              Fotos
            </TabButton>
            <TabButton
              active={activeTab === 'songs'}
              onClick={() => setActiveTab('songs')}
              icon={<Music className="w-4 h-4" />}
              badge={pendingSongs > 0 ? pendingSongs : undefined}
              badgeColor="pink"
            >
              Música
            </TabButton>
            <TabButton
              active={activeTab === 'gifts'}
              onClick={() => setActiveTab('gifts')}
              icon={<Gift className="w-4 h-4" />}
              badge={gifts.length}
            >
              Regalos
            </TabButton>
            <TabButton
              active={activeTab === 'places'}
              onClick={() => setActiveTab('places')}
              icon={<MapPin className="w-4 h-4" />}
              badge={places.length}
            >
              Turismo
            </TabButton>
          </div>
        </div>

        {/* Content */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    Estadísticas Generales
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <StatRow label="Confirmaciones recibidas" value={`${attendingCount} de ${rsvps.length}`} progress={(attendingCount / Math.max(rsvps.length, 1)) * 100} />
                    <StatRow label="Total de invitados" value={totalGuests} />
                    <StatRow label="Regalos reservados" value={`${reservedGifts} de ${gifts.length}`} progress={(reservedGifts / Math.max(gifts.length, 1)) * 100} />
                    <StatRow label="Fotos subidas" value={photos.length} />
                    <StatRow label="Fotos aprobadas" value={photos.filter(p => p.approved).length} progress={(photos.filter(p => p.approved).length / Math.max(photos.length, 1)) * 100} />
                    <StatRow label="Canciones sugeridas" value={songs.length} />
                    <StatRow label="Canciones aprobadas" value={songs.filter(s => s.approved).length} progress={(songs.filter(s => s.approved).length / Math.max(songs.length, 1)) * 100} />
                    <StatRow label="Lugares turísticos" value={places.length} />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {pendingPhotos > 0 && (
                      <ActivityItem 
                        icon={<Camera className="w-5 h-5 text-purple-500" />}
                        text={`${pendingPhotos} foto${pendingPhotos > 1 ? 's' : ''} esperando aprobación`}
                        action={() => setActiveTab('photos')}
                        urgent
                      />
                    )}
                    {pendingSongs > 0 && (
                      <ActivityItem 
                        icon={<Music className="w-5 h-5 text-pink-500" />}
                        text={`${pendingSongs} canción${pendingSongs > 1 ? 'es' : ''} esperando aprobación`}
                        action={() => setActiveTab('songs')}
                        urgent
                      />
                    )}
                    {availableGifts > 0 && (
                      <ActivityItem 
                        icon={<Gift className="w-5 h-5 text-orange-500" />}
                        text={`${availableGifts} regalo${availableGifts > 1 ? 's' : ''} disponible${availableGifts > 1 ? 's' : ''}`}
                        info
                      />
                    )}
                    {rsvps.length > 0 && (
                      <ActivityItem 
                        icon={<Users className="w-5 h-5 text-green-500" />}
                        text={`${rsvps.length} confirmación${rsvps.length > 1 ? 'es' : ''} recibida${rsvps.length > 1 ? 's' : ''}`}
                        action={() => setActiveTab('rsvps')}
                        info
                      />
                    )}
                    {pendingPhotos === 0 && pendingSongs === 0 && (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-3">🎉</div>
                        <p className="text-gray-600 font-medium">¡Todo al día!</p>
                        <p className="text-gray-500 text-sm">No hay pendientes</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'rsvps' && (
            <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  Confirmaciones de Asistencia
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {attendingCount} confirmados de {rsvps.length} respuestas
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Nombre</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Email</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Asiste</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Acompañantes</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Comentarios</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvps.map((rsvp, index) => (
                        <motion.tr 
                          key={rsvp.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b hover:bg-purple-50/50 transition-colors"
                        >
                          <td className="py-4 px-4 font-semibold text-gray-800">{rsvp.name}</td>
                          <td className="py-4 px-4 text-gray-600">{rsvp.email}</td>
                          <td className="py-4 px-4">
                            {rsvp.attending ? (
                              <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg">
                                ✓ Sí asiste
                              </span>
                            ) : (
                              <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg">
                                ✗ No asiste
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-xl font-bold text-purple-600">{rsvp.guests}</span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600 max-w-xs">
                            {rsvp.comments ? (
                              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                {rsvp.comments}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'photos' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Galería de Fotos</h2>
                <span className="text-sm text-gray-600">
                  {photos.filter(p => p.approved).length} aprobadas de {photos.length} total
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <Card key={photo.id} className={photo.approved ? 'border-green-200' : 'border-orange-200'}>
                    <NextImage
                      src={photo.url}
                      alt={photo.caption || ''}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    <CardContent className="pt-4">
                      {photo.caption && <p className="text-sm mb-2 font-medium">{photo.caption}</p>}
                      {photo.uploaderName && (
                        <p className="text-xs text-gray-500 mb-3">Subida por: {photo.uploaderName}</p>
                      )}
                      <div className="flex gap-2">
                        {!photo.approved && (
                          <Button
                            size="sm"
                            onClick={() => approvePhoto(photo.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Aprobar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => deletePhoto(photo.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                      {photo.approved && (
                        <p className="text-xs text-green-600 mt-2 text-center font-medium">✓ Aprobada</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'songs' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Sugerencias Musicales</h2>
                <span className="text-sm text-gray-600">
                  {songs.filter(s => s.approved).length} aprobadas de {songs.length} total
                </span>
              </div>
              <div className="space-y-3">
                {songs.map((song) => (
                  <Card
                    key={song.id}
                    className={`${song.approved ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Music className="w-5 h-5 text-pink-500" />
                            <h3 className="font-bold text-lg">{song.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 ml-8">{song.artist}</p>
                          {song.suggestedBy && (
                            <p className="text-xs text-gray-500 ml-8 mt-1">
                              Sugerida por: <span className="font-medium">{song.suggestedBy}</span>
                            </p>
                          )}
                          {song.approved && (
                            <span className="inline-block ml-8 mt-2 px-2 py-1 text-xs font-medium bg-green-200 text-green-700 rounded-full">
                              ✓ Aprobada
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!song.approved && (
                            <Button 
                              size="sm" 
                              onClick={() => approveSong(song.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => deleteSong(song.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gifts' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-light font-playfair bg-gradient-to-r from-[#E8B4B8] to-[#C9A7C7] bg-clip-text text-transparent">Lista de Regalos</h2>
                <Button 
                  onClick={() => {
                    setEditingGift(undefined);
                    setIsGiftModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-[#E8B4B8] to-[#C9A7C7] text-white hover:shadow-2xl hover:shadow-[#E8B4B8]/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Regalo
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gifts.map((gift) => (
                  <Card key={gift.id} className="relative">
                    {gift.priority && (
                      <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ Prioritario
                      </div>
                    )}
                    {gift.image && (
                      <NextImage
                        src={gift.image}
                        alt={gift.name}
                        width={400}
                        height={192}
                        className="w-full h-40 object-cover rounded-t-xl"
                      />
                    )}
                    <CardContent className="pt-4">
                      <h3 className="font-bold mb-2">{gift.name}</h3>
                      {gift.description && (
                        <p className="text-sm text-gray-600 mb-2">{gift.description}</p>
                      )}
                      {gift.price && (
                        <p className="text-lg font-bold text-[var(--color-primary)] mb-2">
                          {gift.price}€
                        </p>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        {gift.purchased ? (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                            ✓ Comprado
                          </span>
                        ) : gift.reserved ? (
                          <span className="px-2 py-1 bg-orange-200 text-orange-700 rounded text-xs font-medium">
                            ⏳ Reservado
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-200 text-green-700 rounded text-xs font-medium">
                            ✓ Disponible
                          </span>
                        )}
                        {gift.category && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {gift.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-[#E8B4B8] to-[#C9A7C7] text-white"
                          onClick={() => handleEditGift(gift)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-red-400 hover:bg-red-500 text-white"
                          onClick={() => handleDeleteGift(gift.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'places' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-light font-playfair bg-gradient-to-r from-[#E8B4B8] to-[#C9A7C7] bg-clip-text text-transparent">Lugares Turísticos</h2>
                <Button 
                  onClick={() => {
                    setEditingPlace(undefined);
                    setIsPlaceModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-[#D4AF97] to-[#C9A7C7] text-white hover:shadow-2xl hover:shadow-[#D4AF97]/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Lugar
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {places.map((place) => (
                  <Card key={place.id} className="relative">
                    {place.recommended && (
                      <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ Recomendado
                      </div>
                    )}
                    {place.image && (
                      <NextImage
                        src={place.image}
                        alt={place.name}
                        width={400}
                        height={192}
                        className="w-full h-40 object-cover rounded-t-xl"
                      />
                    )}
                    <CardContent className="pt-4">
                      <h3 className="font-bold mb-1">{place.name}</h3>
                      {place.category && (
                        <span className="inline-block px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs mb-2">
                          {place.category}
                        </span>
                      )}
                      {place.description && (
                        <p className="text-sm text-gray-600 mb-2">{place.description}</p>
                      )}
                      <div className="space-y-1 text-xs text-gray-500 mb-3">
                        {place.distance && <p>📍 {place.distance}</p>}
                        {place.rating && <p>⭐ {place.rating}/5</p>}
                        {place.priceLevel && <p>💰 {place.priceLevel}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-[#D4AF97] to-[#C9A7C7] text-white"
                          onClick={() => handleEditPlace(place)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-red-400 hover:bg-red-500 text-white"
                          onClick={() => handleDeletePlace(place.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <PlaceModal
        isOpen={isPlaceModalOpen}
        onClose={() => {
          setIsPlaceModalOpen(false);
          setEditingPlace(undefined);
        }}
        onSave={handleSavePlace}
        place={editingPlace}
      />

      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => {
          setIsGiftModalOpen(false);
          setEditingGift(undefined);
        }}
        onSave={handleSaveGift}
        gift={editingGift}
      />
    </div>
  );
}

// Helper Components
function TabButton({ 
  children, 
  active, 
  onClick, 
  icon, 
  badge, 
  badgeColor = 'red' 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void; 
  icon?: React.ReactNode;
  badge?: number;
  badgeColor?: 'red' | 'purple' | 'pink';
}) {
  const badgeColors = {
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-[#E8B4B8] via-[#C9A7C7] to-[#D4AF97] text-white shadow-2xl'
          : 'bg-gray-50 text-gray-700 hover:bg-[#E8B4B8]/10 hover:shadow-lg'
      }`}
    >
      {icon}
      {children}
      {badge !== undefined && badge > 0 && (
        <span className={`absolute -top-2 -right-2 ${badgeColors[badgeColor]} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </motion.button>
  );
}

function StatRow({ label, value, progress }: { label: string; value: string | number; progress?: number }) {
  return (
    <div className="py-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{value}</span>
      </div>
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#E8B4B8] to-[#C9A7C7] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      )}
    </div>
  );
}

function ActivityItem({ 
  icon, 
  text, 
  action, 
  info = false,
  urgent = false
}: { 
  icon: React.ReactNode; 
  text: string; 
  action?: () => void;
  info?: boolean;
  urgent?: boolean;
}) {
  return (
    <motion.div 
      onClick={action}
      whileHover={action ? { scale: 1.02, x: 5 } : {}}
      className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
        action && !info 
          ? urgent
            ? 'bg-gradient-to-r from-[#f0c4c8] to-[#E8B4B8] hover:from-[#E8B4B8] hover:to-[#d69da3] cursor-pointer border-2 border-[#E8B4B8]'
            : 'bg-gradient-to-r from-[#E8B4B8]/20 to-[#C9A7C7]/20 hover:from-[#E8B4B8]/30 hover:to-[#C9A7C7]/30 cursor-pointer border-2 border-[#C9A7C7]/40'
          : 'bg-gradient-to-r from-[#D4AF97]/10 to-[#C9A7C7]/10 border-2 border-[#D4AF97]/30'
      } shadow-md hover:shadow-lg`}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="text-sm font-medium flex-1 text-gray-800">{text}</span>
      {action && !info && (
        <span className={`text-sm font-bold ${urgent ? 'text-[#d69da3]' : 'text-[#C9A7C7]'} flex items-center gap-1`}>
          Ver
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </motion.div>
  );
}
