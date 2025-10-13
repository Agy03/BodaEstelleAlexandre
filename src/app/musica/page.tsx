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
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Music className="w-16 h-16 text-[var(--color-primary)] mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">
            Sugiere Música
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
