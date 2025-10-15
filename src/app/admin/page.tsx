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
                <h2 className="text-2xl font-bold">Lista de Regalos</h2>
                <Button className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white">
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
                        <Button size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
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
                <h2 className="text-2xl font-bold">Lugares Turísticos</h2>
                <Button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
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
                        <Button size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
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
    <button
      onClick={onClick}
      className={`relative px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      {children}
      {badge !== undefined && badge > 0 && (
        <span className={`absolute -top-1 -right-1 ${badgeColors[badgeColor]} text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
}

function ActivityItem({ 
  icon, 
  text, 
  action, 
  info = false 
}: { 
  icon: React.ReactNode; 
  text: string; 
  action?: () => void;
  info?: boolean;
}) {
  return (
    <div 
      onClick={action}
      className={`flex items-center gap-3 p-3 rounded-lg ${
        action ? 'bg-orange-50 hover:bg-orange-100 cursor-pointer' : 'bg-blue-50'
      } transition-colors`}
    >
      {icon}
      <span className="text-sm flex-1">{text}</span>
      {action && !info && (
        <span className="text-xs text-orange-600 font-medium">Ver →</span>
      )}
    </div>
  );
}
