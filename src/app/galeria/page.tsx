'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { Camera, Upload, CheckCircle, Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Photo = {
  id: string;
  url: string;
  caption?: string;
  uploaderName?: string;
  createdAt: string;
  approved: boolean;
};

export default function GaleriaPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      setPhotos(data.filter((photo: Photo) => photo.approved));
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('uploaderName', uploaderName);
      formData.append('caption', caption);

      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadSuccess(true);
        setSelectedFile(null);
        setUploaderName('');
        setCaption('');
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error al subir la foto. Por favor, inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5] via-white to-[#F8EDE3] -z-10" />
      <div className="absolute top-20 right-1/3 w-96 h-96 bg-gradient-to-br from-[var(--color-secondary)]/20 to-transparent rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-40 left-1/4 w-96 h-96 bg-gradient-to-tl from-[var(--color-primary)]/20 to-transparent rounded-full blur-3xl -z-10 animate-float" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] p-5 rounded-full">
              <Camera className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Galería de Fotos
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comparte tus mejores momentos con nosotros. Las fotos serán revisadas antes de publicarse.
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona una foto *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                    required
                  />
                </div>

                <Input
                  label="Tu nombre (opcional)"
                  type="text"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="Juan Pérez"
                />

                <Input
                  label="Descripción (opcional)"
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Un momento especial..."
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Subir Foto
                    </>
                  )}
                </Button>

                {uploadSuccess && (
                  <div className="flex items-center gap-2 text-green-600 justify-center">
                    <CheckCircle className="w-5 h-5" />
                    <span>¡Foto subida! Estará visible después de ser aprobada.</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Photos Gallery */}
        {loading ? (
          <div className="text-center py-20">
            <Loader className="w-12 h-12 mx-auto animate-spin text-[var(--color-primary)]" />
            <p className="mt-4 text-gray-600">Cargando fotos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              Aún no hay fotos en la galería. ¡Sé el primero en compartir!
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="break-inside-avoid"
              >
                <Card hover className="overflow-hidden">
                  <NextImage
                    src={photo.url}
                    alt={photo.caption || 'Gallery photo'}
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                  {(photo.caption || photo.uploaderName) && (
                    <CardContent className="pt-3">
                      {photo.caption && (
                        <p className="text-gray-700 mb-1">{photo.caption}</p>
                      )}
                      {photo.uploaderName && (
                        <p className="text-sm text-gray-500">— {photo.uploaderName}</p>
                      )}
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
