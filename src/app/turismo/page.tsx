'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Hotel, Utensils, Landmark, PartyPopper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const categories = [
  { id: 'all', label: 'Todo', icon: MapPin },
  { id: 'hotel', label: 'Hoteles', icon: Hotel },
  { id: 'restaurant', label: 'Restaurantes', icon: Utensils },
  { id: 'culture', label: 'Cultura', icon: Landmark },
  { id: 'leisure', label: 'Ocio', icon: PartyPopper },
];

type Place = {
  id: string;
  name: string;
  type: string;
  description: string;
  image?: string;
  link?: string;
};

export default function TurismoPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPlaces(places);
    } else {
      setFilteredPlaces(places.filter((place) => place.type === selectedCategory));
    }
  }, [selectedCategory, places]);

  const fetchPlaces = async () => {
    try {
      const response = await fetch('/api/tourism');
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
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
          <MapPin className="w-16 h-16 text-[var(--color-primary)] mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">
            Turismo Cercano
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre lugares increíbles para visitar durante tu estancia
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                selectedCategory === category.id
                  ? 'bg-[var(--color-primary)] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span className="font-medium">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Places Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando lugares...</p>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              Próximamente agregaremos lugares recomendados para visitar
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlaces.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  {place.image && (
                    <div className="w-full h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      {categories.find((c) => c.id === place.type)?.icon && (
                        <span className="text-[var(--color-primary)]">
                          {(() => {
                            const Icon = categories.find((c) => c.id === place.type)!.icon;
                            return <Icon className="w-5 h-5" />;
                          })()}
                        </span>
                      )}
                      <span className="text-sm text-gray-500 capitalize">{place.type}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[var(--color-text)]">
                      {place.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{place.description}</p>
                    {place.link && (
                      <a
                        href={place.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary)] hover:underline font-medium"
                      >
                        Más información →
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
