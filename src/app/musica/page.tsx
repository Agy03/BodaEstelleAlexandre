'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Music, Plus, CheckCircle, Loader, Search, Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';

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
  previewUrl: string | null;
  spotifyUrl: string;
  duration: number;
};

export default function MusicaPage() {
  const t = useTranslations('music');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [songAudio, setSongAudio] = useState<HTMLAudioElement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    suggestedBy: '',
    spotifyId: '',
  });

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      if (songAudio) {
        songAudio.pause();
        songAudio.src = '';
      }
    };
  }, [audio, songAudio]);

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

  const searchSpotify = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.tracks || []);
    } catch (error) {
      console.error('Error searching Spotify:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchSpotify(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const selectTrack = (track: SpotifyTrack) => {
    setSelectedTrack(track);
    setFormData({
      ...formData,
      title: track.name,
      artist: track.artist,
      spotifyId: track.id,
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const playPreview = (previewUrl: string, trackId: string) => {
    if (audio) {
      audio.pause();
    }

    if (playingPreview === trackId) {
      setPlayingPreview(null);
      setAudio(null);
      return;
    }

    const newAudio = new Audio(previewUrl);
    newAudio.play();
    newAudio.onended = () => setPlayingPreview(null);
    setAudio(newAudio);
    setPlayingPreview(trackId);
  };

  const playSongPreview = (previewUrl: string, songId: string) => {
    if (songAudio) {
      songAudio.pause();
    }

    if (playingSongId === songId) {
      setPlayingSongId(null);
      setSongAudio(null);
      return;
    }

    const newAudio = new Audio(previewUrl);
    newAudio.volume = 0.5;
    newAudio.play();
    
    // Limitar preview a 10 segundos
    const timeout = setTimeout(() => {
      newAudio.pause();
      setPlayingSongId(null);
    }, 10000);
    
    newAudio.onended = () => {
      clearTimeout(timeout);
      setPlayingSongId(null);
    };
    
    setSongAudio(newAudio);
    setPlayingSongId(songId);
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
        setFormData({ title: '', artist: '', suggestedBy: '', spotifyId: '' });
        setSelectedTrack(null);
        setTimeout(() => setSuccess(false), 5000);
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
      {/* Enhanced Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-rose)]/5 via-[var(--color-background)] to-[var(--color-secondary)]/5" />
      <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-[var(--color-rose)]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-[var(--color-secondary)]/10 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-8"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] rounded-full blur-2xl opacity-40"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] p-6 rounded-3xl shadow-2xl">
              <Music className="w-14 h-14 text-white" />
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-light font-playfair mb-6">
            <span className="bg-gradient-to-r from-[var(--color-rose)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Suggestion Form with Spotify */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[var(--color-rose)]/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--color-rose)]/10 to-transparent rounded-full blur-2xl -z-10" />
              
              <h2 className="text-2xl font-playfair text-gray-800 mb-6 flex items-center gap-3">
                <div className="bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                {t('form.submit')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Spotify Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar en Spotify
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Nombre de la canción o artista..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-rose)] focus:ring-2 focus:ring-[var(--color-rose)]/20 transition-all"
                    />
                    {searching && (
                      <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-rose)] animate-spin" />
                    )}
                  </div>

                  {/* Search Results */}
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 bg-white border-2 border-[var(--color-rose)]/20 rounded-2xl shadow-lg max-h-80 overflow-y-auto"
                      >
                        {searchResults.map((track) => (
                          <div
                            key={track.id}
                            onClick={() => selectTrack(track)}
                            className="p-3 hover:bg-[var(--color-rose)]/5 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                          >
                            <Image 
                              src={track.image} 
                              alt={track.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate">{track.name}</p>
                              <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                            </div>
                            {track.previewUrl && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playPreview(track.previewUrl!, track.id);
                                }}
                                className="p-2 hover:bg-[var(--color-rose)]/10 rounded-full transition-colors"
                              >
                                {playingPreview === track.id ? (
                                  <Pause className="w-4 h-4 text-[var(--color-rose)]" />
                                ) : (
                                  <Play className="w-4 h-4 text-[var(--color-rose)]" />
                                )}
                              </button>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Selected Track */}
                  <AnimatePresence>
                    {selectedTrack && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mt-4 p-4 bg-gradient-to-br from-[var(--color-rose)]/5 to-[var(--color-secondary)]/5 border-2 border-[var(--color-rose)]/20 rounded-2xl"
                      >
                        <div className="flex items-center gap-4">
                          <Image 
                            src={selectedTrack.image} 
                            alt={selectedTrack.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-xl object-cover shadow-lg"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{selectedTrack.name}</p>
                            <p className="text-sm text-gray-600">{selectedTrack.artist}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedTrack(null)}
                            className="p-2 hover:bg-white/50 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Manual Input (fallback) */}
                {!selectedTrack && (
                  <div className="space-y-4">
                    <div className="text-center text-sm text-gray-500">o ingresa manualmente</div>
                    <Input
                      label={t('form.song')}
                      type="text"
                      required={!selectedTrack}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder=""
                    />

                    <Input
                      label={t('form.artist')}
                      type="text"
                      required={!selectedTrack}
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      placeholder=""
                    />
                  </div>
                )}

                <Input
                  label={t('form.yourName')}
                  type="text"
                  value={formData.suggestedBy}
                  onChange={(e) => setFormData({ ...formData, suggestedBy: e.target.value })}
                  placeholder="Opcional"
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)]" 
                  disabled={submitting || (!selectedTrack && !formData.title)}
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      {t('form.submitting')}
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      {t('form.submit')}
                    </>
                  )}
                </Button>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 justify-center"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">{t('success')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* Songs List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[var(--color-rose)]/20 h-full">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-tr from-[var(--color-rose)]/10 to-transparent rounded-full blur-2xl -z-10" />
              
              <h2 className="text-2xl font-playfair text-gray-800 mb-6 flex items-center gap-3">
                <div className="bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] p-2 rounded-lg">
                  <Music className="w-5 h-5 text-white" />
                </div>
                Canciones Confirmadas
              </h2>

              {loading ? (
                <div className="text-center py-16">
                  <Loader className="w-10 h-10 mx-auto animate-spin text-[var(--color-rose)]" />
                </div>
              ) : songs.length === 0 ? (
                <div className="text-center py-16">
                  <Music className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    {t('pending')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {songs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        {/* Album Art or Play Button */}
                        {song.albumArt ? (
                          <div className="relative flex-shrink-0">
                            <Image 
                              src={song.albumArt} 
                              alt={song.title}
                              width={64}
                              height={64}
                              className="w-16 h-16 rounded-xl object-cover shadow-md"
                            />
                            {song.previewUrl && (
                              <button
                                onClick={() => playSongPreview(song.previewUrl!, song.id)}
                                className={`absolute inset-0 flex items-center justify-center rounded-xl transition-all ${
                                  playingSongId === song.id
                                    ? 'bg-black/60'
                                    : 'bg-black/0 hover:bg-black/60'
                                } group/play`}
                              >
                                {playingSongId === song.id ? (
                                  <Pause className="w-6 h-6 text-white" />
                                ) : (
                                  <Play className="w-6 h-6 text-white opacity-0 group-hover/play:opacity-100 transition-opacity" />
                                )}
                              </button>
                            )}
                          </div>
                        ) : song.previewUrl ? (
                          <button
                            onClick={() => playSongPreview(song.previewUrl!, song.id)}
                            className={`w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${
                              playingSongId === song.id
                                ? 'bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] shadow-lg scale-110'
                                : 'bg-gradient-to-br from-[var(--color-rose)]/70 to-[var(--color-secondary)]/70 hover:from-[var(--color-rose)] hover:to-[var(--color-secondary)] hover:scale-110 shadow-md'
                            }`}
                          >
                            {playingSongId === song.id ? (
                              <Pause className="w-6 h-6 text-white" />
                            ) : (
                              <Play className="w-6 h-6 text-white" />
                            )}
                          </button>
                        ) : (
                          <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-[var(--color-rose)]/70 to-[var(--color-secondary)]/70 rounded-xl flex items-center justify-center shadow-md">
                            <Music className="w-6 h-6 text-white" />
                          </div>
                        )}

                        {/* Song Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 group-hover:text-[var(--color-rose)] transition-colors truncate">
                            {song.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 truncate">{song.artist}</p>
                          {song.album && (
                            <p className="text-xs text-gray-400 mt-1 truncate">{song.album}</p>
                          )}
                          {song.suggestedBy && (
                            <p className="text-xs text-[var(--color-rose)] mt-1">
                              Sugerida por {song.suggestedBy}
                            </p>
                          )}
                        </div>

                        {/* Spotify Link */}
                        {(song.spotifyUrl || song.spotifyId) && (
                          <a
                            href={song.spotifyUrl || `https://open.spotify.com/track/${song.spotifyId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-[var(--color-accent)]/10 rounded-lg transition-colors group/link flex-shrink-0"
                            title="Abrir en Spotify"
                          >
                            <svg className="w-5 h-5 text-gray-400 group-hover/link:text-[var(--color-accent)] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Preview Indicator */}
              <AnimatePresence>
                {playingSongId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 p-4 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] rounded-2xl shadow-lg"
                  >
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                          <Music className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Reproduciendo preview (10 seg)</p>
                          <p className="text-xs text-white/80">🎵 Escuchando desde nuestra web</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          songAudio?.pause();
                          setPlayingSongId(null);
                        }}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                      >
                        ⏸ Detener
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
