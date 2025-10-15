'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import NextImage from 'next/image';
import { 
  Users, 
  Camera, 
  Music, 
  CheckCircle, 
  X, 
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [places, setPlaces] = useState<TourismPlace[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'rsvps' | 'photos' | 'songs' | 'gifts' | 'places'>('overview');
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent font-playfair">
              Panel de Administración
            </h1>
            <p className="text-lg text-gray-600">Bienvenid@s, {session?.user?.name || 'Novios'} 💝</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-3xl font-bold text-green-700">{attendingCount}</p>
              <p className="text-sm text-green-600 font-medium">Confirmados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-3xl font-bold text-blue-700">{totalGuests}</p>
              <p className="text-sm text-blue-600 font-medium">Total Invitados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <Camera className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-3xl font-bold text-purple-700">{pendingPhotos}</p>
              <p className="text-sm text-purple-600 font-medium">Fotos Pendientes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="pt-6">
              <Music className="w-8 h-8 text-pink-600 mb-2" />
              <p className="text-3xl font-bold text-pink-700">{pendingSongs}</p>
              <p className="text-sm text-pink-600 font-medium">Canciones Pendientes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <Gift className="w-8 h-8 text-orange-600 mb-2" />
              <p className="text-3xl font-bold text-orange-700">{availableGifts}</p>
              <p className="text-sm text-orange-600 font-medium">Regalos Disponibles</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="pt-6">
              <MapPin className="w-8 h-8 text-teal-600 mb-2" />
              <p className="text-3xl font-bold text-teal-700">{places.length}</p>
              <p className="text-sm text-teal-600 font-medium">Lugares Turísticos</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-md">
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

        {/* Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Estadísticas Generales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <StatRow label="Confirmaciones recibidas" value={`${attendingCount} de ${rsvps.length}`} />
                    <StatRow label="Total de invitados" value={totalGuests} />
                    <StatRow label="Regalos reservados" value={`${reservedGifts} de ${gifts.length}`} />
                    <StatRow label="Fotos subidas" value={photos.length} />
                    <StatRow label="Fotos aprobadas" value={photos.filter(p => p.approved).length} />
                    <StatRow label="Canciones sugeridas" value={songs.length} />
                    <StatRow label="Canciones aprobadas" value={songs.filter(s => s.approved).length} />
                    <StatRow label="Lugares turísticos" value={places.length} />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingPhotos > 0 && (
                      <ActivityItem 
                        icon={<Camera className="w-5 h-5 text-purple-500" />}
                        text={`${pendingPhotos} fotos esperando aprobación`}
                        action={() => setActiveTab('photos')}
                      />
                    )}
                    {pendingSongs > 0 && (
                      <ActivityItem 
                        icon={<Music className="w-5 h-5 text-pink-500" />}
                        text={`${pendingSongs} canciones esperando aprobación`}
                        action={() => setActiveTab('songs')}
                      />
                    )}
                    {availableGifts > 0 && (
                      <ActivityItem 
                        icon={<Gift className="w-5 h-5 text-orange-500" />}
                        text={`${availableGifts} regalos disponibles`}
                        info
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'rsvps' && (
            <Card>
              <CardHeader>
                <CardTitle>Confirmaciones de Asistencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Nombre</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Asiste</th>
                        <th className="text-left py-3 px-4 font-semibold">Acompañantes</th>
                        <th className="text-left py-3 px-4 font-semibold">Comentarios</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{rsvp.name}</td>
                          <td className="py-3 px-4 text-gray-600">{rsvp.email}</td>
                          <td className="py-3 px-4">
                            {rsvp.attending ? (
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                ✓ Sí
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                ✗ No
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold">{rsvp.guests}</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                            {rsvp.comments || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id}>
                <NextImage
                  src={photo.url}
                  alt={photo.caption || ''}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <CardContent className="pt-4">
                  {photo.caption && <p className="text-sm mb-2">{photo.caption}</p>}
                  {photo.uploaderName && (
                    <p className="text-xs text-gray-500 mb-3">Por: {photo.uploaderName}</p>
                  )}
                  <div className="flex gap-2">
                    {!photo.approved && (
                      <Button
                        size="sm"
                        onClick={() => approvePhoto(photo.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprobar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deletePhoto(photo.id)}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                  {photo.approved && (
                    <p className="text-xs text-green-600 mt-2 text-center">✓ Aprobada</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'songs' && (
          <Card>
            <CardHeader>
              <CardTitle>Sugerencias de Canciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold">{song.title}</h3>
                      <p className="text-sm text-gray-600">{song.artist}</p>
                      {song.suggestedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          Sugerida por: {song.suggestedBy}
                        </p>
                      )}
                      {song.approved && (
                        <p className="text-xs text-green-600 mt-1">✓ Aprobada</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!song.approved && (
                        <Button size="sm" onClick={() => approveSong(song.id)}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteSong(song.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
