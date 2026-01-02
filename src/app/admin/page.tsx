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
  spotifyId?: string;
  album?: string;
  albumArt?: string;
  previewUrl?: string;
  spotifyUrl?: string;
};

type SpotifyTrack = {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  previewUrl?: string;
  spotifyUrl: string;
  duration: number;
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
  reservedBy?: string;
  reservedAt?: string;
  reservationExpiresAt?: string;
  receiptUrl?: string;
  receiptStatus?: string;
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

  // Spotify search states
  const [spotifySearchQuery, setSpotifySearchQuery] = useState('');
  const [spotifyResults, setSpotifyResults] = useState<SpotifyTrack[]>([]);
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const [selectedSpotifyTrack, setSelectedSpotifyTrack] = useState<SpotifyTrack | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  // Spotify search with debounce
  useEffect(() => {
    if (!spotifySearchQuery.trim()) {
      setSpotifyResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSpotifyLoading(true);
      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(spotifySearchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSpotifyResults(data.tracks || []);
        }
      } catch (error) {
        console.error('Error searching Spotify:', error);
      } finally {
        setSpotifyLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [spotifySearchQuery]);

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
    if (!confirm(t('photos.deleteConfirm'))) return;
    
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

  const addSpotifySong = async () => {
    if (!selectedSpotifyTrack) return;

    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedSpotifyTrack.name,
          artist: selectedSpotifyTrack.artist,
          spotifyId: selectedSpotifyTrack.id,
          album: selectedSpotifyTrack.album,
          albumArt: selectedSpotifyTrack.image,
          previewUrl: selectedSpotifyTrack.previewUrl,
          spotifyUrl: selectedSpotifyTrack.spotifyUrl,
          suggestedBy: 'Admin',
          approved: true,
        }),
      });

      if (response.ok) {
        setSelectedSpotifyTrack(null);
        setSpotifySearchQuery('');
        setSpotifyResults([]);
        fetchData();
      }
    } catch (error) {
      console.error('Error adding song from Spotify:', error);
    }
  };

  const playPreview = (previewUrl: string) => {
    if (audioElement) {
      audioElement.pause();
    }

    if (currentAudioUrl === previewUrl && isPlaying) {
      audioElement?.pause();
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(previewUrl);
    audio.volume = 0.5;
    audio.play();
    
    // Limitar preview a 10 segundos
    const timeout = setTimeout(() => {
      audio.pause();
      setIsPlaying(false);
    }, 10000);
    
    audio.onended = () => {
      clearTimeout(timeout);
      setIsPlaying(false);
    };
    
    setAudioElement(audio);
    setCurrentAudioUrl(previewUrl);
    setIsPlaying(true);
  };

  const deleteSong = async (songId: string) => {
    if (!confirm(t('songs.deleteConfirm'))) return;
    
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
    if (!confirm(t('gifts.deleteConfirm'))) return;
    
    try {
      await fetch(`/api/gifts/${giftId}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting gift:', error);
    }
  };

  const handleApproveReceipt = async (giftId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/gifts/${giftId}/receipt/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al procesar el recibo');
      }
    } catch (error) {
      console.error('Error processing receipt:', error);
      alert('Error al procesar el recibo');
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
    if (!confirm(t('places.deleteConfirm'))) return;
    
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
    <div className="min-h-screen py-8 md:py-12 px-4 relative">
      {/* Fondo con degradados suaves */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-[var(--color-rose)]/15 to-[var(--color-secondary)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[var(--color-secondary)]/10 to-[var(--color-accent)]/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header elegante y responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12 relative z-10"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-[var(--color-rose)]/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="w-full md:w-auto">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-light mb-2 md:mb-3 bg-gradient-to-r from-[var(--color-rose)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                  {t('title')}
                </h1>
                <p className="text-base md:text-xl text-gray-600 flex flex-wrap items-center gap-2 font-light">
                  <span>{t('welcome')},</span>
                  <span className="font-medium bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                    {session?.user?.name || t('couple')}
                  </span>
                  <span className="text-xl md:text-2xl">💝</span>
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="primary"
                size="md"
                className="w-full md:w-auto whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview - Mejorado para responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[var(--color-rose)] to-[#d69da3] border-0 shadow-lg overflow-hidden relative group hover:scale-105 transition-transform">
              <CardContent className="pt-6 pb-5">
                <div className="flex items-start justify-between mb-3">
                  <Users className="w-10 h-10 md:w-12 md:h-12 text-white/90" />
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">RSVPs</span>
                  </div>
                </div>
                <p className="text-4xl md:text-5xl font-black text-white mb-1">{attendingCount}</p>
                <p className="text-white/90 font-semibold text-base md:text-lg">{t('stats.confirmed')}</p>
                <p className="text-white/70 text-xs md:text-sm mt-1">{t('stats.of')} {rsvps.length} {t('stats.responses')}</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-[var(--color-secondary)] to-[#b08db5] border-0 shadow-lg overflow-hidden relative group hover:scale-105 transition-transform">
              <CardContent className="pt-6 pb-5">
                <div className="flex items-start justify-between mb-3">
                  <Users className="w-10 h-10 md:w-12 md:h-12 text-white/90" />
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">Total</span>
                  </div>
                </div>
                <p className="text-4xl md:text-5xl font-black text-white mb-1">{totalGuests}</p>
                <p className="text-white/90 font-semibold text-base md:text-lg">{t('stats.guests')}</p>
                <p className="text-white/70 text-xs md:text-sm mt-1">{t('stats.includingGuests')}</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-[var(--color-accent)] to-[#c29d84] border-0 shadow-lg overflow-hidden relative group hover:scale-105 transition-transform">
              <CardContent className="pt-6 pb-5">
                <div className="flex items-start justify-between mb-3">
                  <Camera className="w-10 h-10 md:w-12 md:h-12 text-white/90" />
                  {pendingPhotos > 0 && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                      <span className="text-xs font-bold">{pendingPhotos}</span>
                    </div>
                  )}
                </div>
                <p className="text-4xl md:text-5xl font-black text-white mb-1">{photos.length}</p>
                <p className="text-white/90 font-semibold text-base md:text-lg">{t('stats.photos')}</p>
                <p className="text-white/70 text-xs md:text-sm mt-1">
                  {pendingPhotos > 0 ? `${pendingPhotos} ${t('stats.toApprove')}` : t('stats.allApproved')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-[#f0c4c8] to-[var(--color-rose)] border-0 shadow-lg overflow-hidden relative group hover:scale-105 transition-transform">
              <CardContent className="pt-6 pb-5">
                <div className="flex items-start justify-between mb-3">
                  <Music className="w-10 h-10 md:w-12 md:h-12 text-white/90" />
                  {pendingSongs > 0 && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                      <span className="text-xs font-bold">{pendingSongs}</span>
                    </div>
                  )}
                </div>
                <p className="text-4xl md:text-5xl font-black text-white mb-1">{songs.length}</p>
                <p className="text-white/90 font-semibold text-base md:text-lg">{t('stats.songs')}</p>
                <p className="text-white/70 text-xs md:text-sm mt-1">
                  {pendingSongs > 0 ? `${pendingSongs} ${t('stats.toApprove')}` : t('stats.allApproved')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-[#d9c7d7] to-[var(--color-secondary)] border-0 shadow-lg overflow-hidden relative group hover:scale-105 transition-transform">
              <CardContent className="pt-6 pb-5">
                <div className="flex items-start justify-between mb-3">
                  <Gift className="w-10 h-10 md:w-12 md:h-12 text-white/90" />
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">{availableGifts}</span>
                  </div>
                </div>
                <p className="text-4xl md:text-5xl font-black text-white mb-1">{gifts.length}</p>
                <p className="text-white/90 font-semibold text-base md:text-lg">{t('stats.gifts')}</p>
                <p className="text-white/70 text-xs md:text-sm mt-1">
                  {availableGifts} {t('stats.available')}, {reservedGifts} {t('stats.reserved')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-[#e4cabc] to-[var(--color-accent)] border-0 shadow-lg overflow-hidden relative group hover:scale-105 transition-transform">
              <CardContent className="pt-6 pb-5">
                <div className="flex items-start justify-between mb-3">
                  <MapPin className="w-10 h-10 md:w-12 md:h-12 text-white/90" />
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">Lugares</span>
                  </div>
                </div>
                <p className="text-4xl md:text-5xl font-black text-white mb-1">{places.length}</p>
                <p className="text-white/90 font-semibold text-base md:text-lg">{t('stats.tourism')}</p>
                <p className="text-white/70 text-xs md:text-sm mt-1">{t('stats.recommendedPlaces')}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Navigation Tabs - Completamente responsive con scroll horizontal */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-2 md:p-3 shadow-lg border border-[var(--color-rose)]/20 mb-6 md:mb-8 relative z-10">
          <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-[var(--color-rose)]/30 scrollbar-track-transparent hover:scrollbar-thumb-[var(--color-rose)]/50 -mx-2 md:mx-0 px-2 md:px-0">
            <div className="flex gap-2 min-w-max lg:min-w-0 lg:flex-wrap lg:justify-center pb-1">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={<BarChart3 className="w-4 h-4" />}
              >
                {t('tabs.overview')}
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
                {t('tabs.photos')}
              </TabButton>
              <TabButton
                active={activeTab === 'songs'}
                onClick={() => setActiveTab('songs')}
                icon={<Music className="w-4 h-4" />}
                badge={pendingSongs > 0 ? pendingSongs : undefined}
                badgeColor="pink"
              >
                {t('tabs.songs')}
              </TabButton>
              <TabButton
                active={activeTab === 'gifts'}
                onClick={() => setActiveTab('gifts')}
                icon={<Gift className="w-4 h-4" />}
                badge={gifts.length}
              >
                {t('tabs.gifts')}
              </TabButton>
              <TabButton
                active={activeTab === 'places'}
                onClick={() => setActiveTab('places')}
                icon={<MapPin className="w-4 h-4" />}
                badge={places.length}
              >
                {t('tabs.places')}
              </TabButton>
            </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Quick Stats */}
              <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-2xl font-playfair">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 md:p-3 rounded-xl">
                      <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    {t('stats.generalStats')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 md:pt-6">
                  <div className="space-y-3 md:space-y-4">
                    <StatRow label={t('stats.confirmationsReceived')} value={`${attendingCount} ${t('stats.of')} ${rsvps.length}`} progress={(attendingCount / Math.max(rsvps.length, 1)) * 100} />
                    <StatRow label={t('stats.totalGuests')} value={totalGuests} />
                    <StatRow label={t('stats.reservedGifts')} value={`${reservedGifts} ${t('stats.of')} ${gifts.length}`} progress={(reservedGifts / Math.max(gifts.length, 1)) * 100} />
                    <StatRow label={t('stats.uploadedPhotos')} value={photos.length} />
                    <StatRow label={t('stats.approvedPhotos')} value={photos.filter(p => p.approved).length} progress={(photos.filter(p => p.approved).length / Math.max(photos.length, 1)) * 100} />
                    <StatRow label={t('stats.suggestedSongs')} value={songs.length} />
                    <StatRow label={t('stats.approvedSongs')} value={songs.filter(s => s.approved).length} progress={(songs.filter(s => s.approved).length / Math.max(songs.length, 1)) * 100} />
                    <StatRow label={t('stats.touristPlaces')} value={places.length} />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-2xl font-playfair">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 md:p-3 rounded-xl">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    {t('stats.recentActivity')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 md:pt-6">
                  <div className="space-y-2 md:space-y-3">
                    {pendingPhotos > 0 && (
                      <ActivityItem 
                        icon={<Camera className="w-5 h-5 text-purple-500" />}
                        text={`${pendingPhotos} ${pendingPhotos > 1 ? t('stats.photosWaiting') : t('stats.photoWaiting')}`}
                        action={() => setActiveTab('photos')}
                        urgent
                      />
                    )}
                    {pendingSongs > 0 && (
                      <ActivityItem 
                        icon={<Music className="w-5 h-5 text-pink-500" />}
                        text={`${pendingSongs} ${pendingSongs > 1 ? t('stats.songsWaiting') : t('stats.songWaiting')}`}
                        action={() => setActiveTab('songs')}
                        urgent
                      />
                    )}
                    {availableGifts > 0 && (
                      <ActivityItem 
                        icon={<Gift className="w-5 h-5 text-orange-500" />}
                        text={`${availableGifts} ${availableGifts > 1 ? t('stats.giftsAvailable') : t('stats.giftAvailable')}`}
                        info
                      />
                    )}
                    {rsvps.length > 0 && (
                      <ActivityItem 
                        icon={<Users className="w-5 h-5 text-green-500" />}
                        text={`${rsvps.length} ${rsvps.length > 1 ? t('stats.confirmationsReceivedCount') : t('stats.confirmationReceived')}`}
                        action={() => setActiveTab('rsvps')}
                        info
                      />
                    )}
                    {pendingPhotos === 0 && pendingSongs === 0 && (
                      <div className="text-center py-6 md:py-8">
                        <div className="text-5xl md:text-6xl mb-3">🎉</div>
                        <p className="text-gray-600 font-medium">{t('stats.allUpToDate')}</p>
                        <p className="text-gray-500 text-sm">{t('stats.noPending')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'rsvps' && (
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 text-lg md:text-2xl font-playfair">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 md:p-3 rounded-xl">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    {t('rsvp.title')}
                  </div>
                  <span className="text-xs md:text-sm font-normal text-gray-500 md:ml-auto">
                    {attendingCount} {t('rsvp.confirmedOf')} {rsvps.length} {t('stats.responses')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 md:pt-6">
                <div className="overflow-x-auto -mx-4 md:mx-0 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent hover:scrollbar-thumb-purple-400">
                  <div className="inline-block min-w-full align-middle px-4 md:px-0">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 md:py-4 px-2 md:px-4 font-bold text-gray-700 text-xs md:text-base sticky left-0 bg-white/90 backdrop-blur-sm z-10">{t('rsvp.name')}</th>
                          <th className="text-left py-3 md:py-4 px-2 md:px-4 font-bold text-gray-700 text-xs md:text-base">{t('rsvp.email')}</th>
                          <th className="text-left py-3 md:py-4 px-2 md:px-4 font-bold text-gray-700 text-xs md:text-base">{t('rsvp.attends')}</th>
                          <th className="text-left py-3 md:py-4 px-2 md:px-4 font-bold text-gray-700 text-xs md:text-base">{t('rsvp.guests')}</th>
                          <th className="text-left py-3 md:py-4 px-2 md:px-4 font-bold text-gray-700 text-xs md:text-base min-w-[200px]">{t('rsvp.comments')}</th>
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
                            <td className="py-3 md:py-4 px-2 md:px-4 sticky left-0 bg-white/90 backdrop-blur-sm z-10 min-w-[150px]">
                              <div className="font-semibold text-gray-800 text-xs md:text-base">{rsvp.name}</div>
                            </td>
                            <td className="py-3 md:py-4 px-2 md:px-4 text-gray-600 text-xs md:text-sm min-w-[200px]">{rsvp.email}</td>
                            <td className="py-3 md:py-4 px-2 md:px-4">
                              {rsvp.attending ? (
                                <span className="inline-flex px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md whitespace-nowrap">
                                  ✓ {t('rsvp.yes')}
                                </span>
                              ) : (
                                <span className="inline-flex px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold bg-gradient-to-r from-red-400 to-red-500 text-white shadow-md whitespace-nowrap">
                                  ✗ {t('rsvp.no')}
                                </span>
                              )}
                            </td>
                            <td className="py-3 md:py-4 px-2 md:px-4">
                              <span className="text-base md:text-xl font-bold text-purple-600">{rsvp.guests}</span>
                            </td>
                            <td className="py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm text-gray-600">
                              {rsvp.comments ? (
                                <div className="bg-gray-50 px-3 py-2 rounded-lg max-w-[300px]">
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
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'photos' && (
            <div>
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-xl md:text-2xl font-playfair font-light bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                  {t('photos.title')}
                </h2>
                <span className="text-sm text-gray-600">
                  {photos.filter(p => p.approved).length} {t('photos.approvedOf')} {photos.length} {t('photos.total')}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <Card key={photo.id} className={`${photo.approved ? 'border-green-200' : 'border-orange-200'} overflow-hidden`}>
                    <NextImage
                      src={photo.url}
                      alt={photo.caption || ''}
                      width={400}
                      height={192}
                      className="w-full h-48 object-contain bg-gray-100"
                    />
                    <CardContent className="pt-4">
                      {photo.caption && <p className="text-sm mb-2 font-medium">{photo.caption}</p>}
                      {photo.uploaderName && (
                        <p className="text-xs text-gray-500 mb-3">{t('photos.uploadedBy')}: {photo.uploaderName}</p>
                      )}
                      <div className="flex gap-2">
                        {!photo.approved && (
                          <Button
                            size="sm"
                            onClick={() => approvePhoto(photo.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">{t('actions.approve')}</span>
                            <span className="sm:hidden">✓</span>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => deletePhoto(photo.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">{t('actions.delete')}</span>
                          <span className="sm:hidden">✗</span>
                        </Button>
                      </div>
                      {photo.approved && (
                        <p className="text-xs text-green-600 mt-2 text-center font-medium">✓ {t('photos.approved')}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'songs' && (
            <div>
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-playfair font-light bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-4">
                  {t('songs.title')}
                </h2>
                
                {/* Spotify Search Section */}
                <Card className="mb-4 md:mb-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="pt-4 md:pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Music className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                      <h3 className="text-base md:text-lg font-bold text-green-900">{t('songs.addFromSpotify')}</h3>
                    </div>
                    
                    <div className="relative mb-4">
                      <input
                        type="text"
                        value={spotifySearchQuery}
                        onChange={(e) => setSpotifySearchQuery(e.target.value)}
                        placeholder={t('songs.searchSpotify')}
                        className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm md:text-base"
                      />
                      {spotifyLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader className="w-5 h-5 animate-spin text-green-600" />
                        </div>
                      )}
                    </div>

                    {/* Spotify Results */}
                    {spotifyResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2 max-h-96 overflow-y-auto"
                      >
                        {spotifyResults.map((track) => (
                          <motion.div
                            key={track.id}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setSelectedSpotifyTrack(track)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedSpotifyTrack?.id === track.id
                                ? 'border-green-500 bg-green-100 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <NextImage
                                src={track.image}
                                alt={track.name}
                                width={64}
                                height={64}
                                className="rounded-lg shadow-md"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 truncate">{track.name}</h4>
                                <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                                <p className="text-xs text-gray-500 truncate">{track.album}</p>
                              </div>
                              {track.previewUrl && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playPreview(track.previewUrl!);
                                  }}
                                  className={`${
                                    currentAudioUrl === track.previewUrl && isPlaying
                                      ? 'bg-red-500 hover:bg-red-600'
                                      : 'bg-green-500 hover:bg-green-600'
                                  } text-white`}
                                >
                                  {currentAudioUrl === track.previewUrl && isPlaying ? `⏸ ${t('songs.pause')}` : `▶ ${t('songs.preview')}`}
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* Selected Track & Add Button */}
                    {selectedSpotifyTrack && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-green-100 rounded-xl border-2 border-green-500"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <NextImage
                              src={selectedSpotifyTrack.image}
                              alt={selectedSpotifyTrack.name}
                              width={48}
                              height={48}
                              className="rounded-lg shadow-md"
                            />
                            <div>
                              <p className="font-bold text-green-900">{selectedSpotifyTrack.name}</p>
                              <p className="text-sm text-green-700">{selectedSpotifyTrack.artist}</p>
                            </div>
                          </div>
                          <Button
                            onClick={addSpotifySong}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('songs.addSong')}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Stats */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    {songs.filter(s => s.approved).length} {t('songs.approvedOf')} {songs.length} {t('songs.total')}
                  </span>
                </div>
              </div>

              {/* Songs Playlist */}
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-6 shadow-xl border border-purple-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{t('songs.weddingPlaylist')}</h3>
                      <p className="text-sm text-gray-600">{songs.length} {t('songs.songCount')} • {songs.filter(s => s.approved).length} {t('songs.approvedCount')}</p>
                    </div>
                  </div>
                  {songs.some(s => !s.approved) && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          songs.filter(s => !s.approved).forEach(song => approveSong(song.id));
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t('songs.approveAll')}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Playlist Header - Mejorado para móvil */}
                <div className="hidden md:grid grid-cols-[auto_1fr_auto_80px] gap-4 px-4 py-2 border-b border-purple-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <div className="w-12">#</div>
                  <div>{t('songs.song')}</div>
                  <div className="text-center">{t('songs.status')}</div>
                  <div className="text-center">{t('songs.actions')}</div>
                </div>

                {/* Songs - Layout responsive */}
                <div className="mt-2">
                  {songs.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Music className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg">{t('songs.noSuggestions')}</p>
                      <p className="text-sm mt-2">{t('songs.useSpotifySearch')}</p>
                    </div>
                  ) : (
                    songs.map((song, index) => (
                      <motion.div
                        key={song.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`grid grid-cols-1 md:grid-cols-[auto_1fr_auto_80px] gap-3 md:gap-4 items-start md:items-center px-3 md:px-4 py-3 rounded-xl hover:bg-white/80 transition-all group ${
                          !song.approved ? 'bg-orange-100/50' : ''
                        }`}
                      >
                        {/* Layout móvil y desktop */}
                        <div className="flex items-center gap-3 md:contents">
                        {/* Number & Play Button */}
                        <div className="w-10 md:w-12 flex items-center justify-center flex-shrink-0">
                          {song.previewUrl ? (
                            <button
                              onClick={() => playPreview(song.previewUrl!)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                currentAudioUrl === song.previewUrl && isPlaying
                                  ? 'bg-green-500 text-white shadow-lg scale-110'
                                  : 'bg-white text-gray-700 group-hover:bg-purple-500 group-hover:text-white shadow-md hover:scale-110'
                              }`}
                            >
                              {currentAudioUrl === song.previewUrl && isPlaying ? (
                                <span className="text-xl">⏸</span>
                              ) : (
                                <span className="text-xl">▶</span>
                              )}
                            </button>
                          ) : (
                            <span className="text-gray-400 font-semibold">{index + 1}</span>
                          )}
                        </div>

                        {/* Song Info with Album Art */}
                        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                          {song.albumArt ? (
                            <NextImage
                              src={song.albumArt}
                              alt={song.title}
                              width={56}
                              height={56}
                              className="w-12 h-12 md:w-14 md:h-14 rounded-lg shadow-md flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                              <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 truncate">{song.title}</h4>
                              {song.spotifyUrl && (
                                <button
                                  onClick={() => window.open(song.spotifyUrl, '_blank')}
                                  className="text-green-600 hover:text-green-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Abrir en Spotify"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                  </svg>
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{song.artist}</p>
                            {song.album && (
                              <p className="text-xs text-gray-500 truncate">{song.album}</p>
                            )}
                            {song.suggestedBy && (
                              <p className="text-xs text-purple-600 mt-1">
                                {t('songs.suggestedBy')} <span className="font-medium">{song.suggestedBy}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        </div>
                        
                        {/* Status Badge & Actions - Layout responsive */}
                        <div className="flex items-center justify-between md:contents gap-2">
                        {/* Status Badge */}
                        <div className="flex justify-center md:justify-center">
                          {song.approved ? (
                            <span className="inline-flex items-center gap-1 px-2 md:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <CheckCircle className="w-3 h-3" />
                              <span className="hidden sm:inline">{t('songs.approved')}</span>
                              <span className="sm:hidden">✓</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 md:px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium animate-pulse">
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                              <span className="hidden sm:inline">{t('songs.pending')}</span>
                              <span className="sm:hidden">⏳</span>
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-1 justify-end">
                          {!song.approved ? (
                            <>
                              <button
                                onClick={() => approveSong(song.id)}
                                className="w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md"
                                title="Aprobar"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteSong(song.id)}
                                className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md"
                                title="Rechazar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => deleteSong(song.id)}
                              className="w-8 h-8 rounded-lg bg-gray-400 hover:bg-red-500 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md opacity-0 group-hover:opacity-100"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Preview Info */}
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                          <Music className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{t('songs.playingPreview')}</p>
                          <p className="text-xs text-white/80">{t('songs.listeningFromAPI')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          audioElement?.pause();
                          setIsPlaying(false);
                        }}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        ⏸ {t('songs.stop')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gifts' && (
            <div>
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-xl md:text-2xl font-playfair font-light bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                  {t('gifts.title')}
                </h2>
                <Button 
                  onClick={() => {
                    setEditingGift(undefined);
                    setIsGiftModalOpen(true);
                  }}
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('gifts.addGift')}
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gifts.map((gift) => (
                  <Card key={gift.id} className="relative overflow-hidden">
                    {gift.priority && (
                      <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ {t('gifts.priority')}
                      </div>
                    )}
                    {gift.image && (
                      <NextImage
                        src={gift.image}
                        alt={gift.name}
                        width={400}
                        height={192}
                        className="w-full h-40 object-contain bg-gray-100"
                      />
                    )}
                    <CardContent className="pt-4">
                      <h3 className="font-bold mb-2 font-playfair">{gift.name}</h3>
                      {gift.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{gift.description}</p>
                      )}
                      {gift.price && (
                        <p className="text-lg font-bold text-[var(--color-primary)] mb-2">
                          {gift.price}€
                        </p>
                      )}
                      
                      {/* Estado de reserva y recibo */}
                      <div className="mb-3 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {gift.purchased ? (
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                              ✓ {t('gifts.purchased')}
                            </span>
                          ) : gift.reserved ? (
                            <span className="px-2 py-1 bg-orange-200 text-orange-700 rounded text-xs font-medium">
                              ⏳ {t('gifts.reserved')}
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-200 text-green-700 rounded text-xs font-medium">
                              ✓ {t('gifts.available')}
                            </span>
                          )}
                          {gift.category && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {gift.category}
                            </span>
                          )}
                        </div>

                        {/* Información de reserva */}
                        {gift.reserved && gift.reservedBy && (
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                                {gift.reservedBy.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-blue-600 font-medium">{t('gifts.reservedBy')}</p>
                                <p className="font-bold text-blue-900">{gift.reservedBy}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200">
                              {gift.reservedAt && (
                                <div className="flex items-start gap-1.5">
                                  <span className="text-blue-500 mt-0.5">📅</span>
                                  <div>
                                    <p className="text-xs text-blue-600">{t('gifts.date')}</p>
                                    <p className="text-xs font-semibold text-blue-900">
                                      {new Date(gift.reservedAt).toLocaleDateString('es-ES', { 
                                        day: '2-digit', 
                                        month: 'short'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {gift.reservationExpiresAt && !gift.receiptUrl && (
                                <div className="flex items-start gap-1.5">
                                  <span className="text-orange-500 mt-0.5">⏰</span>
                                  <div>
                                    <p className="text-xs text-orange-600">{t('gifts.expires')}</p>
                                    <p className="text-xs font-semibold text-orange-900">
                                      {new Date(gift.reservationExpiresAt).toLocaleDateString('es-ES', { 
                                        day: '2-digit', 
                                        month: 'short'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Estado del recibo */}
                        {gift.receiptUrl && (
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                  <span className="text-white text-sm">📄</span>
                                </div>
                                <div>
                                  <p className="text-xs text-purple-600 font-medium">{t('gifts.receipt')}</p>
                                  <p className="text-xs font-bold text-purple-900">
                                    {gift.receiptStatus === 'pending' && t('gifts.pendingReview')}
                                    {gift.receiptStatus === 'approved' && t('gifts.approvedReceipt')}
                                    {gift.receiptStatus === 'rejected' && t('gifts.rejected')}
                                  </p>
                                </div>
                              </div>
                              <a 
                                href={gift.receiptUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg text-xs font-medium transition-colors"
                              >
                                {t('gifts.view')}
                              </a>
                            </div>
                            {gift.receiptStatus === 'pending' && (
                              <div className="flex gap-2 pt-2 border-t border-purple-200">
                                <button
                                  onClick={() => handleApproveReceipt(gift.id, true)}
                                  className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow"
                                >
                                  ✓ {t('gifts.approve')}
                                </button>
                                <button
                                  onClick={() => handleApproveReceipt(gift.id, false)}
                                  className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow"
                                >
                                  ✗ {t('gifts.reject')}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="primary"
                          className="flex-1"
                          onClick={() => handleEditGift(gift)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">{t('actions.edit')}</span>
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
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-xl md:text-2xl font-playfair font-light bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                  {t('places.title')}
                </h2>
                <Button 
                  onClick={() => {
                    setEditingPlace(undefined);
                    setIsPlaceModalOpen(true);
                  }}
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('places.addPlace')}
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {places.map((place) => (
                  <Card key={place.id} className="relative overflow-hidden">
                    {place.recommended && (
                      <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ {t('places.recommended')}
                      </div>
                    )}
                    {place.image && (
                      <NextImage
                        src={place.image}
                        alt={place.name}
                        width={400}
                        height={192}
                        className="w-full h-40 object-contain bg-gray-100"
                      />
                    )}
                    <CardContent className="pt-4">
                      <h3 className="font-bold mb-1 font-playfair">{place.name}</h3>
                      {place.category && (
                        <span className="inline-block px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs mb-2">
                          {place.category}
                        </span>
                      )}
                      {place.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{place.description}</p>
                      )}
                      <div className="space-y-1 text-xs text-gray-500 mb-3">
                        {place.distance && <p>📍 {place.distance}</p>}
                        {place.rating && <p>⭐ {place.rating}/5</p>}
                        {place.priceLevel && <p>💰 {place.priceLevel}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="primary"
                          className="flex-1"
                          onClick={() => handleEditPlace(place)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">{t('actions.edit')}</span>
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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-medium transition-all flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0 ${
        active
          ? 'bg-gradient-to-r from-[var(--color-rose)] via-[var(--color-secondary)] to-[var(--color-accent)] text-white shadow-lg'
          : 'bg-gray-50 text-gray-700 hover:bg-[var(--color-rose)]/10 hover:shadow-md'
      }`}
    >
      {icon}
      {children}
      {badge !== undefined && badge > 0 && (
        <span className={`absolute -top-1 -right-1 md:-top-2 md:-right-2 ${badgeColors[badgeColor]} text-white text-[10px] md:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center shadow-lg animate-pulse`}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </motion.button>
  );
}

function StatRow({ label, value, progress }: { label: string; value: string | number; progress?: number }) {
  return (
    <div className="py-2 md:py-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
        <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{value}</span>
      </div>
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] rounded-full"
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
  const t = useTranslations('admin');
  
  return (
    <motion.div 
      onClick={action}
      whileHover={action ? { scale: 1.01, x: 5 } : {}}
      className={`flex items-center gap-3 p-3 md:p-4 rounded-xl transition-all ${
        action && !info 
          ? urgent
            ? 'bg-gradient-to-r from-[#f0c4c8] to-[var(--color-rose)] hover:from-[var(--color-rose)] hover:to-[#d69da3] cursor-pointer border-2 border-[var(--color-rose)]'
            : 'bg-gradient-to-r from-[var(--color-rose)]/20 to-[var(--color-secondary)]/20 hover:from-[var(--color-rose)]/30 hover:to-[var(--color-secondary)]/30 cursor-pointer border-2 border-[var(--color-secondary)]/40'
          : 'bg-gradient-to-r from-[var(--color-accent)]/10 to-[var(--color-secondary)]/10 border-2 border-[var(--color-accent)]/30'
      } shadow-md hover:shadow-lg`}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="text-xs md:text-sm font-medium flex-1 text-gray-800">{text}</span>
      {action && !info && (
        <span className={`text-xs md:text-sm font-bold ${urgent ? 'text-[#d69da3]' : 'text-[var(--color-secondary)]'} flex items-center gap-1`}>
          {t('stats.see')}
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </motion.div>
  );
}
