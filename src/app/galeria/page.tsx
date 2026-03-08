'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import NextImage from 'next/image';
import { Camera, Upload, CheckCircle, Loader, X, ChevronLeft, ChevronRight, Download, BookOpen } from 'lucide-react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
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
  width?: number;
  height?: number;
};

type PhotoSize = 'small' | 'medium' | 'large';

export default function GaleriaPage() {
  const t = useTranslations('gallery');
  const tCommon = useTranslations('common');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [photosWithSizes, setPhotosWithSizes] = useState<(Photo & { size: PhotoSize })[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{[key: number]: number}>({});
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

  // Función para obtener dimensiones de una imagen
  const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        resolve({ width: 800, height: 600 }); // Fallback
      };
      img.src = url;
    });
  };

  // Función para clasificar el tamaño de la foto de forma más variada
  const classifyPhotoSize = (width: number, height: number, index: number): PhotoSize => {
    const aspectRatio = width / height;
    
    // Usar el índice para variar los tamaños de forma semi-aleatoria pero consistente
    const pattern = index % 7;
    
    // Fotos verticales (retratos)
    if (aspectRatio < 0.75) {
      return pattern < 2 ? 'large' : pattern < 5 ? 'medium' : 'small';
    }
    
    // Fotos horizontales (paisajes)
    if (aspectRatio > 1.3) {
      return pattern < 3 ? 'large' : pattern < 6 ? 'medium' : 'small';
    }
    
    // Fotos cuadradas
    return pattern < 2 ? 'large' : pattern < 4 ? 'medium' : 'small';
  };

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      const approvedPhotos = data.filter((photo: Photo) => photo.approved);
      
      // Obtener dimensiones y clasificar cada foto
      const photosWithSizeData = await Promise.all(
        approvedPhotos.map(async (photo: Photo, index: number) => {
          const dimensions = await getImageDimensions(photo.url);
          const size = classifyPhotoSize(dimensions.width, dimensions.height, index);
          return { ...photo, ...dimensions, size };
        })
      );
      
      setPhotosWithSizes(photosWithSizeData);
      setPhotos(approvedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Manejar teclas para navegación en lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => 
          prev === null || prev === 0 ? photosWithSizes.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => 
          prev === null || prev === photosWithSizes.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, photosWithSizes.length]);

  // Función para comprimir imagen antes de subir
  const compressImage = (file: File, maxWidth = 3000, quality = 0.92): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;

              // Redimensionar si es necesario
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }

              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('No se pudo obtener el contexto del canvas'));
                return;
              }
              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    console.log(`Imagen comprimida: ${file.name}, tamaño original: ${(file.size / 1024 / 1024).toFixed(2)}MB, comprimido: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
                    resolve(blob);
                  } else {
                    reject(new Error('Error al comprimir imagen: blob null'));
                  }
                },
                'image/jpeg',
                quality
              );
            } catch (err) {
              reject(new Error(`Error en canvas: ${err instanceof Error ? err.message : 'unknown'}`));
            }
          };
          img.onerror = (err) => reject(new Error(`Error al cargar imagen: ${err}`));
        };
        reader.onerror = (err) => reject(new Error(`Error al leer archivo: ${err}`));
      } catch (err) {
        reject(new Error(`Error general: ${err instanceof Error ? err.message : 'unknown'}`));
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
      setUploadProgress({});
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadSuccess(false);
    setUploadProgress({});

    try {
      // Subir cada archivo individualmente con compresión
      const uploadPromises = selectedFiles.map(async (file, index) => {
        try {
          console.log(`Iniciando carga de ${file.name}...`);
          setUploadProgress(prev => ({ ...prev, [index]: 10 }));
          
          // Comprimir la imagen
          const compressedBlob = await compressImage(file);
          setUploadProgress(prev => ({ ...prev, [index]: 40 }));
          
          // Crear un nuevo File desde el Blob comprimido
          const compressedFile = new File(
            [compressedBlob], 
            file.name.replace(/\.[^/.]+$/, '.jpg'),
            { type: 'image/jpeg' }
          );

          const formData = new FormData();
          formData.append('file', compressedFile);
          formData.append('uploaderName', uploaderName);
          formData.append('caption', caption);

          setUploadProgress(prev => ({ ...prev, [index]: 60 }));

          const response = await fetch('/api/photos/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error(`Error en respuesta del servidor para ${file.name}:`, errorData);
            throw new Error(errorData.error || `Error HTTP ${response.status}`);
          }

          setUploadProgress(prev => ({ ...prev, [index]: 100 }));
          console.log(`${file.name} subido exitosamente`);
          return { success: true, file: file.name };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          console.error(`Error uploading file ${file.name}:`, errorMessage, error);
          setUploadProgress(prev => ({ ...prev, [index]: -1 }));
          return { success: false, file: file.name, error: errorMessage };
        }
      });

      // Usar allSettled para que no se cancelen las demás si una falla
      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));

      console.log(`Subidas: ${successful} exitosas, ${failed.length} fallidas`);

      if (successful > 0) {
        setUploadSuccess(true);
        setSelectedFiles([]);
        setUploaderName('');
        setCaption('');
        setUploadProgress({});
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        if (failed.length > 0) {
          setTimeout(() => {
            alert(`Se subieron ${successful} de ${selectedFiles.length} fotos. ${failed.length} fallaron. Revisa la consola para más detalles.`);
          }, 500);
        }
        
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        // Todas fallaron
        const failedDetails = failed.map((r, i) => {
          if (r.status === 'fulfilled') {
            return `${r.value.file}: ${r.value.error}`;
          }
          return `Archivo ${i + 1}: Error general`;
        }).join('\n');
        
        console.error('Todas las fotos fallaron:', failedDetails);
        alert(`No se pudo subir ninguna foto. Errores:\n${failedDetails}`);
      }
    } catch (error) {
      console.error('Error general al subir fotos:', error);
      alert(`Error al subir las fotos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploading(false);
      // No limpiar uploadProgress aquí para ver el estado final
      setTimeout(() => setUploadProgress({}), 3000);
    }
  };

  const handleDownloadAlbum = async () => {
    if (photosWithSizes.length === 0) return;
    setDownloading(true);
    setDownloadProgress(0);

    try {
      const zip = new JSZip();
      const folder = zip.folder('Boda-Estelle-Alexandre');

      for (let i = 0; i < photosWithSizes.length; i++) {
        const photo = photosWithSizes[i];
        try {
          const response = await fetch(photo.url);
          const blob = await response.blob();
          const ext = photo.url.match(/\.(jpe?g|png|webp|gif)/i)?.[1] || 'jpg';
          const name = photo.caption
            ? `${String(i + 1).padStart(3, '0')}_${photo.caption.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').slice(0, 40)}.${ext}`
            : `${String(i + 1).padStart(3, '0')}_photo.${ext}`;
          folder!.file(name, blob);
        } catch {
          // Skip failed photos
        }
        setDownloadProgress(Math.round(((i + 1) / photosWithSizes.length) * 100));
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Boda-Estelle-Alexandre-Album.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating album:', error);
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const loadImageAsDataUrl = (url: string): Promise<{ dataUrl: string; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('No canvas context')); return; }
        ctx.drawImage(img, 0, 0);
        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.85), width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  };

  const handleGeneratePdfAlbum = async () => {
    if (photosWithSizes.length === 0) return;
    setGeneratingPdf(true);
    setPdfProgress(0);

    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = 210;
      const pageH = 297;
      const margin = 15;
      const contentW = pageW - margin * 2;

      // Wedding colors
      const rose = { r: 232, g: 180, b: 184 };      // #E8B4B8
      const lavender = { r: 201, g: 167, b: 199 };   // #C9A7C7
      const champagne = { r: 212, g: 175, b: 151 };   // #D4AF97

      // Helper: draw decorative corner ornaments
      const drawCornerOrnaments = (pdf: jsPDF) => {
        pdf.setDrawColor(rose.r, rose.g, rose.b);
        pdf.setLineWidth(0.3);
        const s = 20;
        const o = 10;
        // Top-left
        pdf.line(o, o, o + s, o);
        pdf.line(o, o, o, o + s);
        // Top-right
        pdf.line(pageW - o, o, pageW - o - s, o);
        pdf.line(pageW - o, o, pageW - o, o + s);
        // Bottom-left
        pdf.line(o, pageH - o, o + s, pageH - o);
        pdf.line(o, pageH - o, o, pageH - o - s);
        // Bottom-right
        pdf.line(pageW - o, pageH - o, pageW - o - s, pageH - o);
        pdf.line(pageW - o, pageH - o, pageW - o, pageH - o - s);
      };

      // Helper: draw decorative line separator
      const drawSeparator = (pdf: jsPDF, y: number) => {
        const sepW = 60;
        const cx = pageW / 2;
        pdf.setDrawColor(champagne.r, champagne.g, champagne.b);
        pdf.setLineWidth(0.4);
        pdf.line(cx - sepW / 2, y, cx - 6, y);
        pdf.line(cx + 6, y, cx + sepW / 2, y);
        // Small diamond in center
        pdf.setFillColor(champagne.r, champagne.g, champagne.b);
        pdf.circle(cx, y, 1.5, 'F');
      };

      // Helper: draw page footer
      const drawFooter = (pdf: jsPDF, pageNum: number, totalPages: number) => {
        pdf.setFontSize(8);
        pdf.setTextColor(180, 180, 180);
        pdf.text(`${pageNum} / ${totalPages}`, pageW / 2, pageH - 8, { align: 'center' });
        pdf.setDrawColor(rose.r, rose.g, rose.b);
        pdf.setLineWidth(0.2);
        pdf.line(margin, pageH - 12, pageW - margin, pageH - 12);
      };

      // ===== COVER PAGE =====
      // Soft background gradient effect (simulated with rectangles)
      for (let i = 0; i < 30; i++) {
        const alpha = 0.02;
        pdf.setFillColor(
          Math.round(255 - (255 - rose.r) * alpha * i),
          Math.round(255 - (255 - rose.g) * alpha * i),
          Math.round(255 - (255 - rose.b) * alpha * i)
        );
        pdf.rect(0, i * (pageH / 30), pageW, pageH / 30, 'F');
      }

      drawCornerOrnaments(pdf);

      // Decorative top border
      pdf.setDrawColor(champagne.r, champagne.g, champagne.b);
      pdf.setLineWidth(0.5);
      pdf.line(40, 50, pageW - 40, 50);

      // Title
      pdf.setFontSize(14);
      pdf.setTextColor(champagne.r, champagne.g, champagne.b);
      pdf.text(t('pdfAlbum.coverSubtitle'), pageW / 2, 65, { align: 'center' });

      pdf.setFontSize(42);
      pdf.setTextColor(rose.r, rose.g, rose.b);
      pdf.text('Estelle', pageW / 2, 100, { align: 'center' });

      // Ampersand
      pdf.setFontSize(24);
      pdf.setTextColor(champagne.r, champagne.g, champagne.b);
      pdf.text('&', pageW / 2, 115, { align: 'center' });

      pdf.setFontSize(42);
      pdf.setTextColor(lavender.r, lavender.g, lavender.b);
      pdf.text('Alexandre', pageW / 2, 135, { align: 'center' });

      drawSeparator(pdf, 150);

      // Heart symbol
      pdf.setFontSize(20);
      pdf.setTextColor(rose.r, rose.g, rose.b);
      pdf.text('\u2665', pageW / 2, 165, { align: 'center' });

      // Album label
      pdf.setFontSize(16);
      pdf.setTextColor(120, 120, 120);
      pdf.text(t('pdfAlbum.albumTitle'), pageW / 2, 185, { align: 'center' });

      // Photo count
      pdf.setFontSize(11);
      pdf.setTextColor(160, 160, 160);
      pdf.text(
        `${photosWithSizes.length} ${photosWithSizes.length === 1 ? t('photoSelected') : t('photosSelected')}`,
        pageW / 2, 200,
        { align: 'center' }
      );

      // Date
      pdf.setFontSize(10);
      pdf.setTextColor(champagne.r, champagne.g, champagne.b);
      const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      pdf.text(dateStr, pageW / 2, 220, { align: 'center' });

      // Bottom border
      pdf.setDrawColor(champagne.r, champagne.g, champagne.b);
      pdf.setLineWidth(0.5);
      pdf.line(40, pageH - 50, pageW - 40, pageH - 50);

      // ===== PHOTO PAGES =====
      // Layout: 2 photos per page, each centered with caption
      const photosPerPage = 2;
      const totalPhotoPages = Math.ceil(photosWithSizes.length / photosPerPage);
      const totalPages = 1 + totalPhotoPages; // cover + photo pages

      for (let i = 0; i < photosWithSizes.length; i++) {
        const photo = photosWithSizes[i];
        const positionOnPage = i % photosPerPage; // 0 or 1

        if (positionOnPage === 0) {
          pdf.addPage();
          // Page background
          pdf.setFillColor(255, 252, 249);
          pdf.rect(0, 0, pageW, pageH, 'F');
          drawCornerOrnaments(pdf);
          const pageNum = Math.floor(i / photosPerPage) + 2;
          drawFooter(pdf, pageNum, totalPages);
        }

        try {
          const { dataUrl, width, height } = await loadImageAsDataUrl(photo.url);

          // Calculate position: top half or bottom half
          const slotY = positionOnPage === 0 ? margin + 5 : pageH / 2 + 5;
          const slotH = (pageH / 2) - margin - 10;
          const captionSpace = (photo.caption || photo.uploaderName) ? 14 : 4;
          const imgMaxH = slotH - captionSpace;
          const imgMaxW = contentW - 10;

          // Scale image to fit
          const scale = Math.min(imgMaxW / width, imgMaxH / (height * (imgMaxW / width) > imgMaxH ? 1 : width / width));
          let imgW = width * (imgMaxW / width);
          let imgH = height * (imgMaxW / width);
          if (imgH > imgMaxH) {
            const ratio = imgMaxH / imgH;
            imgW *= ratio;
            imgH *= ratio;
          }

          const imgX = (pageW - imgW) / 2;
          const imgY = slotY + (imgMaxH - imgH) / 2;

          // Soft shadow effect behind image
          pdf.setFillColor(240, 235, 230);
          pdf.roundedRect(imgX - 1, imgY - 1, imgW + 2, imgH + 2, 1, 1, 'F');

          // Thin rose border
          pdf.setDrawColor(rose.r, rose.g, rose.b);
          pdf.setLineWidth(0.3);
          pdf.roundedRect(imgX - 0.5, imgY - 0.5, imgW + 1, imgH + 1, 0.5, 0.5, 'S');

          pdf.addImage(dataUrl, 'JPEG', imgX, imgY, imgW, imgH);

          // Caption text below photo
          const captionY = imgY + imgH + 5;
          if (photo.caption) {
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 100);
            const captionText = photo.caption.length > 80 ? photo.caption.slice(0, 80) + '...' : photo.caption;
            pdf.text(captionText, pageW / 2, captionY, { align: 'center' });
          }
          if (photo.uploaderName) {
            pdf.setFontSize(7);
            pdf.setTextColor(160, 160, 160);
            pdf.text(`— ${photo.uploaderName}`, pageW / 2, captionY + (photo.caption ? 4 : 0), { align: 'center' });
          }
        } catch {
          // Skip failed photos
        }

        setPdfProgress(Math.round(((i + 1) / photosWithSizes.length) * 100));
      }

      // ===== BACK COVER =====
      pdf.addPage();
      pdf.setFillColor(255, 252, 249);
      pdf.rect(0, 0, pageW, pageH, 'F');
      drawCornerOrnaments(pdf);

      drawSeparator(pdf, pageH / 2 - 30);

      pdf.setFontSize(18);
      pdf.setTextColor(rose.r, rose.g, rose.b);
      pdf.text(t('pdfAlbum.thanksTitle'), pageW / 2, pageH / 2 - 10, { align: 'center' });

      pdf.setFontSize(11);
      pdf.setTextColor(150, 150, 150);
      pdf.text(t('pdfAlbum.thanksSubtitle'), pageW / 2, pageH / 2 + 5, { align: 'center' });

      pdf.setFontSize(16);
      pdf.setTextColor(champagne.r, champagne.g, champagne.b);
      pdf.text('\u2665', pageW / 2, pageH / 2 + 20, { align: 'center' });

      drawSeparator(pdf, pageH / 2 + 30);

      pdf.save('Album-Boda-Estelle-Alexandre.pdf');
    } catch (error) {
      console.error('Error generating PDF album:', error);
    } finally {
      setGeneratingPdf(false);
      setPdfProgress(0);
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
                      multiple
                      onChange={handleFileChange}
                      className="sr-only"
                      required
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full min-h-48 px-4 py-4 transition-all duration-300 bg-white border-2 border-[var(--color-rose)]/30 border-dashed rounded-2xl cursor-pointer hover:bg-[var(--color-rose)]/5 hover:border-[var(--color-rose)]/60 group"
                    >
                      {selectedFiles.length > 0 ? (
                        <div className="flex flex-col items-center w-full">
                          <div className="mb-3 p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            {selectedFiles.length} {selectedFiles.length === 1 ? t('photoSelected') : t('photosSelected')}
                          </p>
                          <div className="w-full max-h-32 overflow-y-auto space-y-2 mb-2">
                            {selectedFiles.map((file, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                                  <span className="truncate flex-1">{file.name}</span>
                                  <span className="text-gray-500 ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                                {uploading && uploadProgress[idx] !== undefined && (
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full transition-all duration-300 ${
                                        uploadProgress[idx] === -1 
                                          ? 'bg-red-500' 
                                          : uploadProgress[idx] === 100 
                                          ? 'bg-green-500' 
                                          : 'bg-[var(--color-rose)]'
                                      }`}
                                      style={{ width: `${uploadProgress[idx] === -1 ? 100 : uploadProgress[idx]}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-[var(--color-rose)] mt-2">
                            {t('clickToChange')}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="mb-3 p-3 bg-[var(--color-rose)]/10 rounded-full group-hover:scale-110 transition-transform">
                            <Camera className="w-8 h-8 text-[var(--color-rose)]" />
                          </div>
                          <p className="mb-2 text-sm font-medium text-gray-700">
                            <span className="text-[var(--color-rose)]">Click</span> {t('dragAndDrop')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t('fileFormat')}
                          </p>
                          <p className="text-xs text-[var(--color-rose)] mt-2 font-medium">
                            {t('multiplePhotos')}
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
                  disabled={uploading || selectedFiles.length === 0}
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      {t('uploading')} {selectedFiles.length > 1 && `(${Object.keys(uploadProgress).filter(k => uploadProgress[parseInt(k)] === 100).length}/${selectedFiles.length})`}
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
                    <span className="font-medium">{t('uploadSuccess')} {t('pending')}</span>
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Download Album Buttons */}
        {!loading && photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-10"
          >
            <Button
              onClick={handleDownloadAlbum}
              disabled={downloading || generatingPdf}
              className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] hover:shadow-2xl hover:shadow-[var(--color-secondary)]/30 px-8 py-3 text-base"
            >
              {downloading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  {t('downloadingAlbum')} ({downloadProgress}%)
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  {t('downloadAlbum')} ({photos.length} {photos.length === 1 ? t('photoSelected') : t('photosSelected')})
                </>
              )}
            </Button>
            <Button
              onClick={handleGeneratePdfAlbum}
              disabled={generatingPdf || downloading}
              className="bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-primary)] hover:shadow-2xl hover:shadow-[var(--color-rose)]/30 px-8 py-3 text-base"
            >
              {generatingPdf ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  {t('pdfAlbum.generating')} ({pdfProgress}%)
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5 mr-2" />
                  {t('pdfAlbum.button')}
                </>
              )}
            </Button>
          </motion.div>
        )}

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
            {photosWithSizes.map((photo, index) => {
              const aspectRatio = photo.width && photo.height ? photo.width / photo.height : 1;
              
              // Calcular altura basada en el tamaño y aspect ratio real
              let minHeight = '200px';
              if (photo.size === 'large') {
                minHeight = aspectRatio > 1.3 ? '400px' : aspectRatio < 0.75 ? '500px' : '450px';
              } else if (photo.size === 'medium') {
                minHeight = aspectRatio > 1.3 ? '300px' : aspectRatio < 0.75 ? '380px' : '320px';
              } else {
                minHeight = aspectRatio > 1.3 ? '220px' : aspectRatio < 0.75 ? '280px' : '240px';
              }
              
              const hasInfo = photo.caption || photo.uploaderName;
              
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="break-inside-avoid mb-4 group cursor-pointer"
                  style={{ minHeight }}
                  onClick={() => setSelectedPhotoIndex(index)}
                >
                  <Card hover className="overflow-hidden relative h-full">
                    {/* Imagen manteniendo aspect ratio natural */}
                    <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100">
                      <NextImage
                        src={photo.url}
                        alt={photo.caption || 'Gallery photo'}
                        width={photo.width || 800}
                        height={photo.height || 600}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{
                          aspectRatio: `${photo.width}/${photo.height}`,
                          minHeight
                        }}
                      />
                      
                      {/* Overlay romántico al hover - solo si hay info */}
                      {hasInfo && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            {photo.caption && (
                              <p className="text-sm font-medium mb-1">{photo.caption}</p>
                            )}
                            {photo.uploaderName && (
                              <p className="text-xs opacity-90">— {photo.uploaderName}</p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Efecto de brillo romántico sutil */}
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

        {/* Lightbox para ver foto en grande */}
        <AnimatePresence>
          {selectedPhotoIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={() => setSelectedPhotoIndex(null)}
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Botón anterior */}
              {photosWithSizes.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) => 
                      prev === null || prev === 0 ? photosWithSizes.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
              )}

              {/* Botón siguiente */}
              {photosWithSizes.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) => 
                      prev === null || prev === photosWithSizes.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              )}

              {/* Imagen en grande */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-7xl max-h-[90vh] w-full"
              >
                <NextImage
                  src={photosWithSizes[selectedPhotoIndex].url}
                  alt={photosWithSizes[selectedPhotoIndex].caption || 'Gallery photo'}
                  width={photosWithSizes[selectedPhotoIndex].width || 1920}
                  height={photosWithSizes[selectedPhotoIndex].height || 1080}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '90vh' }}
                  priority
                />

                {/* Info de la foto */}
                {(photosWithSizes[selectedPhotoIndex].caption || photosWithSizes[selectedPhotoIndex].uploaderName) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white"
                  >
                    {photosWithSizes[selectedPhotoIndex].caption && (
                      <p className="text-lg font-medium mb-2">
                        {photosWithSizes[selectedPhotoIndex].caption}
                      </p>
                    )}
                    {photosWithSizes[selectedPhotoIndex].uploaderName && (
                      <p className="text-sm opacity-90">
                        — {photosWithSizes[selectedPhotoIndex].uploaderName}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Contador de fotos */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
                {selectedPhotoIndex + 1} / {photosWithSizes.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
