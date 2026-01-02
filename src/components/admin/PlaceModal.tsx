'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ExternalLink, Loader } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import NextImage from 'next/image';

type Place = {
  id?: string;
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

type SearchResult = {
  id: string;
  name: string;
  address: string;
  rating?: number;
  priceLevel?: string;
  photoUrl?: string;
  googleMapsUrl?: string;
};

type PlaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (place: Partial<Place>) => void;
  place?: Place;
};

const CATEGORIES = [
  'Restaurante',
  'Café',
  'Bar',
  'Hotel',
  'Museo',
  'Parque',
  'Monumento',
  'Playa',
  'Compras',
  'Actividad',
  'Otro',
];

const PRICE_LEVELS = ['€', '€€', '€€€', '€€€€'];

export function PlaceModal({ isOpen, onClose, onSave, place }: PlaceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Restaurante',
    address: '',
    distance: '',
    rating: '',
    priceLevel: '€€',
    hours: '',
    image: '',
    link: '',
    recommended: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (place) {
      setFormData({
        name: place.name || '',
        description: place.description || '',
        category: place.category || 'Restaurante',
        address: place.address || '',
        distance: place.distance || '',
        rating: place.rating?.toString() || '',
        priceLevel: place.priceLevel || '€€',
        hours: place.hours || '',
        image: place.image || '',
        link: place.link || '',
        recommended: place.recommended || false,
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'Restaurante',
        address: '',
        distance: '',
        rating: '',
        priceLevel: '€€',
        hours: '',
        image: '',
        link: '',
        recommended: false,
      });
      setSelectedPlace(null);
    }
  }, [place, isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Aquí integrarías con Google Places API o una alternativa gratuita
      // Por ahora simulamos una búsqueda
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Resultados simulados (en producción vendrían de la API)
      const mockResults = [
        {
          id: '1',
          name: searchQuery,
          address: 'Dirección ejemplo 123',
          rating: 4.5,
          priceLevel: '€€',
          photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          googleMapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`,
        },
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching places:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    setSelectedPlace(result);
    setFormData({
      ...formData,
      name: result.name,
      address: result.address,
      rating: result.rating?.toString() || '',
      priceLevel: result.priceLevel || '€€',
      image: result.photoUrl || '',
      link: result.googleMapsUrl || '',
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={place ? 'Editar Lugar' : 'Añadir Lugar Turístico'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Búsqueda en Google Maps */}
        {!place && (
          <div className="p-4 md:p-6 bg-gradient-to-br from-[#E8B4B8]/10 to-[#C9A7C7]/10 rounded-2xl border-2 border-dashed border-[#E8B4B8]/30">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#E8B4B8] flex-shrink-0" />
              <h3 className="text-sm md:text-base font-semibold text-gray-800">Buscar en Google Maps</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
              Busca un lugar en Google Maps para rellenar automáticamente la información
            </p>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ej: Restaurante La Terraza, Madrid"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
              />
              <Button
                type="button"
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-gradient-to-r from-[#E8B4B8] to-[#C9A7C7] text-white"
              >
                {isSearching ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Resultados de búsqueda */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white rounded-xl border border-gray-200 hover:border-[#E8B4B8] cursor-pointer transition-colors"
                    onClick={() => handleSelectSearchResult(result)}
                  >
                    <div className="flex gap-4">
                      {result.photoUrl && (
                        <NextImage
                          src={result.photoUrl}
                          alt={result.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{result.name}</h4>
                        <p className="text-sm text-gray-600">{result.address}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {result.rating && (
                            <span className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              {result.rating}
                            </span>
                          )}
                          {result.priceLevel && (
                            <span className="text-sm text-gray-600">{result.priceLevel}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedPlace && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Lugar seleccionado: <strong>{selectedPlace.name}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Nombre del Lugar *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Museo del Prado"
              required
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe el lugar y por qué lo recomiendas..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Calle Principal 123"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Distancia
            </label>
            <Input
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              placeholder="2 km del hotel"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Valoración (0-5)
            </label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              placeholder="4.5"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Precio
            </label>
            <Select
              value={formData.priceLevel}
              onChange={(e) => setFormData({ ...formData, priceLevel: e.target.value })}
            >
              {PRICE_LEVELS.map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Horario
            </label>
            <Input
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              placeholder="10:00 - 20:00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            URL de la Imagen
          </label>
          <Input
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />
          {formData.image && (
            <div className="mt-2">
              <NextImage
                src={formData.image}
                alt="Preview"
                width={200}
                height={150}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            Enlace (Google Maps, web oficial, etc.)
          </label>
          <div className="flex gap-2">
            <Input
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
            />
            {formData.link && (
              <a
                href={formData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 md:p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <input
            type="checkbox"
            id="recommended"
            checked={formData.recommended}
            onChange={(e) => setFormData({ ...formData, recommended: e.target.checked })}
            className="w-4 h-4 text-[#E8B4B8] rounded focus:ring-[#E8B4B8] flex-shrink-0"
          />
          <label htmlFor="recommended" className="text-xs md:text-sm font-medium text-gray-700">
            ⭐ Marcar como recomendado
          </label>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-100">
          <Button 
            type="button" 
            onClick={onClose} 
            variant="ghost"
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {place ? 'Guardar Cambios' : 'Añadir Lugar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
