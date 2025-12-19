'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('gallery');
  const tCommon = useTranslations('common');
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
              {t('title')}
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
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
              <form onSubmit={handleUpload} className="space-y-6">
                {/* File Upload con preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('upload')} *
                  </label>
                  
                  {/* Custom file input */}
                  <div className="relative">
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                      required
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-48 px-4 transition-all duration-300 bg-white border-2 border-[var(--color-rose)]/30 border-dashed rounded-2xl cursor-pointer hover:bg-[var(--color-rose)]/5 hover:border-[var(--color-rose)]/60 group"
                    >
                      {selectedFile ? (
                        <div className="flex flex-col items-center">
                          <div className="mb-3 p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-xs text-[var(--color-rose)] mt-2">
                            Click para cambiar
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="mb-3 p-3 bg-[var(--color-rose)]/10 rounded-full group-hover:scale-110 transition-transform">
                            <Camera className="w-8 h-8 text-[var(--color-rose)]" />
                          </div>
                          <p className="mb-2 text-sm font-medium text-gray-700">
                            <span className="text-[var(--color-rose)]">Click</span> o arrastra una imagen
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, WEBP hasta 10MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Input
                  label={t('yourName')}
                  type="text"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder=""
                />

                <Input
                  label={t('caption')}
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder=""
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] hover:shadow-2xl hover:shadow-[var(--color-rose)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      {t('uploading')}
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      {t('upload')}
                    </>
                  )}
                </Button>

                {uploadSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 justify-center"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{t('pending')}</span>
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Photos Gallery - Masonry Layout Asimétrico */}
        {loading ? (
          <div className="text-center py-20">
            <Loader className="w-12 h-12 mx-auto animate-spin text-[var(--color-primary)]" />
            <p className="mt-4 text-gray-600">{tCommon('loading')}</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              {t('subtitle')}
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {photos.map((photo, index) => {
              // Crear alturas variables aleatorias para efecto asimétrico
              const randomHeight = [
                'h-48', 'h-56', 'h-64', 'h-72', 'h-80', 'h-96',
                'aspect-square', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-video'
              ];
              const heightClass = randomHeight[index % randomHeight.length];
              
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.08,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="break-inside-avoid mb-4 group"
                >
                  <Card hover className="overflow-hidden relative">
                    {/* Imagen con aspecto ratio flexible */}
                    <div className="relative bg-gray-100">
                      <NextImage
                        src={photo.url}
                        alt={photo.caption || 'Gallery photo'}
                        width={600}
                        height={600}
                        className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                        style={{ maxHeight: '600px' }}
                      />
                      
                      {/* Overlay romántico al hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {(photo.caption || photo.uploaderName) && (
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            {photo.caption && (
                              <p className="text-sm font-medium mb-1">{photo.caption}</p>
                            )}
                            {photo.uploaderName && (
                              <p className="text-xs opacity-90">— {photo.uploaderName}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Efecto de brillo romántico */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-rose)]/10 via-transparent to-[var(--color-secondary)]/10" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
