'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Plus, CheckCircle, Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Song = {
  id: string;
  title: string;
  artist: string;
  suggestedBy?: string;
  approved: boolean;
  createdAt: string;
};

export default function MusicaPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    suggestedBy: '',
  });

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const data = await response.json();
      setSongs(data.filter((song: Song) => song.approved));
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ title: '', artist: '', suggestedBy: '' });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting song:', error);
      alert('Error al enviar la sugerencia. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5] via-white to-[#F8EDE3] -z-10" />
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-gradient-to-br from-[var(--color-secondary)]/20 to-transparent rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-gradient-to-tl from-[var(--color-primary)]/20 to-transparent rounded-full blur-3xl -z-10 animate-float" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] p-5 rounded-full">
              <Music className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Sugiere Música
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ayúdanos a crear la playlist perfecta para nuestra celebración
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Suggestion Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">
                  Añade una Canción
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Título de la canción *"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Despacito"
                  />

                  <Input
                    label="Artista *"
                    type="text"
                    required
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    placeholder="Luis Fonsi"
                  />

                  <Input
                    label="Tu nombre (opcional)"
                    type="text"
                    value={formData.suggestedBy}
                    onChange={(e) =>
                      setFormData({ ...formData, suggestedBy: e.target.value })
                    }
                    placeholder="Juan Pérez"
                  />

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Sugerir Canción
                      </>
                    )}
                  </Button>

                  {success && (
                    <div className="flex items-center gap-2 text-green-600 justify-center">
                      <CheckCircle className="w-5 h-5" />
                      <span>¡Sugerencia enviada! Será revisada pronto.</span>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Songs List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">
                  Canciones Confirmadas
                </h2>

                {loading ? (
                  <div className="text-center py-12">
                    <Loader className="w-8 h-8 mx-auto animate-spin text-[var(--color-primary)]" />
                  </div>
                ) : songs.length === 0 ? (
                  <p className="text-gray-600 text-center py-12">
                    Aún no hay canciones confirmadas. ¡Sé el primero en sugerir!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {songs.map((song) => (
                      <div
                        key={song.id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <h3 className="font-bold text-[var(--color-text)]">{song.title}</h3>
                        <p className="text-sm text-gray-600">{song.artist}</p>
                        {song.suggestedBy && (
                          <p className="text-xs text-gray-500 mt-1">
                            Sugerida por {song.suggestedBy}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
