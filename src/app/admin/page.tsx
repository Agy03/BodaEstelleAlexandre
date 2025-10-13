'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Camera, Music, CheckCircle, X } from 'lucide-react';
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

export default function AdminPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'photos' | 'songs'>('rsvps');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rsvpRes, photoRes, songRes] = await Promise.all([
        fetch('/api/rsvp'),
        fetch('/api/photos'),
        fetch('/api/songs'),
      ]);

      setRsvps(await rsvpRes.json());
      setPhotos(await photoRes.json());
      setSongs(await songRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
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

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-600">Gestiona todas las confirmaciones y contenido</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold">{attendingCount}</p>
              <p className="text-sm text-gray-600">Confirmados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-2xl font-bold">{totalGuests}</p>
              <p className="text-sm text-gray-600">Total Invitados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Camera className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{pendingPhotos}</p>
              <p className="text-sm text-gray-600">Fotos Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Music className="w-8 h-8 text-purple-500 mb-2" />
              <p className="text-2xl font-bold">{pendingSongs}</p>
              <p className="text-sm text-gray-600">Canciones Pendientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={activeTab === 'rsvps' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('rsvps')}
          >
            <Users className="w-4 h-4 mr-2" />
            Confirmaciones ({rsvps.length})
          </Button>
          <Button
            variant={activeTab === 'photos' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('photos')}
          >
            <Camera className="w-4 h-4 mr-2" />
            Fotos ({photos.length})
          </Button>
          <Button
            variant={activeTab === 'songs' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('songs')}
          >
            <Music className="w-4 h-4 mr-2" />
            Canciones ({songs.length})
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'rsvps' && (
          <Card>
            <CardHeader>
              <CardTitle>Confirmaciones de Asistencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nombre</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Asiste</th>
                      <th className="text-left py-3 px-4">Acompañantes</th>
                      <th className="text-left py-3 px-4">Comentarios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="border-b">
                        <td className="py-3 px-4">{rsvp.name}</td>
                        <td className="py-3 px-4">{rsvp.email}</td>
                        <td className="py-3 px-4">
                          {rsvp.attending ? (
                            <span className="text-green-600 font-medium">Sí</span>
                          ) : (
                            <span className="text-red-600 font-medium">No</span>
                          )}
                        </td>
                        <td className="py-3 px-4">{rsvp.guests}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
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
                <img
                  src={photo.url}
                  alt={photo.caption || ''}
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
