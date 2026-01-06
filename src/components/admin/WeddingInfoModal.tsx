'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Info, Save, X } from 'lucide-react';

type WeddingInfo = {
  id?: string;
  weddingDate: string;
  ceremonyTime: string;
  cocktailTime: string;
  dinnerPartyTime: string;
  venueName: string;
  venueAddress: string;
  venueLink?: string;
  venueLatitude?: number;
  venueLongitude?: number;
  dressCodeTitle: string;
  dressCodeDescription: string;
  dressCodeMen: string;
  dressCodeWomen: string;
  weatherSeason: string;
  weatherAvgTemp: string;
  weatherDescription: string;
  weatherRecommendations: string;
  parkingAvailable: boolean;
  parkingDescription?: string;
  accommodationTitle?: string;
  accommodationDescription?: string;
  giftPolicy?: string;
  childrenPolicy?: string;
  photographyNote?: string;
  scheduleNote?: string;
  transportNote?: string;
};

type WeddingInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

export function WeddingInfoModal({ isOpen, onClose, onSave }: WeddingInfoModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'date' | 'location' | 'dress' | 'weather' | 'additional'>('date');
  const [formData, setFormData] = useState<WeddingInfo>({
    weddingDate: '',
    ceremonyTime: '',
    cocktailTime: '',
    dinnerPartyTime: '',
    venueName: '',
    venueAddress: '',
    venueLink: '',
    dressCodeTitle: '',
    dressCodeDescription: '',
    dressCodeMen: '',
    dressCodeWomen: '',
    weatherSeason: '',
    weatherAvgTemp: '',
    weatherDescription: '',
    weatherRecommendations: '',
    parkingAvailable: true,
    parkingDescription: '',
    accommodationTitle: '',
    accommodationDescription: '',
    giftPolicy: '',
    childrenPolicy: '',
    photographyNote: '',
    scheduleNote: '',
    transportNote: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchWeddingInfo();
    }
  }, [isOpen]);

  const fetchWeddingInfo = async () => {
    try {
      const response = await fetch('/api/wedding-info');
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching wedding info:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/wedding-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('Error updating wedding info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof WeddingInfo, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const sections = [
    { id: 'date', label: 'Fecha y Hora', icon: '📅' },
    { id: 'location', label: 'Ubicación', icon: '📍' },
    { id: 'dress', label: 'Dress Code', icon: '👔' },
    { id: 'weather', label: 'Clima', icon: '☀️' },
    { id: 'additional', label: 'Información Adicional', icon: 'ℹ️' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Información de la Boda">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id as any)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </div>

        {/* Date and Time Section */}
        {activeSection === 'date' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Input
              label="Fecha de la Boda"
              value={formData.weddingDate}
              onChange={(e) => handleChange('weddingDate', e.target.value)}
              placeholder="Saturday, June 20th, 2026"
              required
            />
            <Input
              label="Hora de Ceremonia"
              value={formData.ceremonyTime}
              onChange={(e) => handleChange('ceremonyTime', e.target.value)}
              placeholder="4:00 PM"
              required
            />
            <Input
              label="Hora de Cocktail"
              value={formData.cocktailTime}
              onChange={(e) => handleChange('cocktailTime', e.target.value)}
              placeholder="5:30 PM"
              required
            />
            <Input
              label="Hora de Cena y Fiesta"
              value={formData.dinnerPartyTime}
              onChange={(e) => handleChange('dinnerPartyTime', e.target.value)}
              placeholder="7:00 PM"
              required
            />
            <Textarea
              label="Nota de Horario"
              value={formData.scheduleNote || ''}
              onChange={(e) => handleChange('scheduleNote', e.target.value)}
              placeholder="Please arrive 15 minutes before..."
              rows={3}
            />
          </div>
        )}

        {/* Location Section */}
        {activeSection === 'location' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Input
              label="Nombre del Lugar"
              value={formData.venueName}
              onChange={(e) => handleChange('venueName', e.target.value)}
              placeholder="Château de la Belle Vue"
              required
            />
            <Textarea
              label="Dirección"
              value={formData.venueAddress}
              onChange={(e) => handleChange('venueAddress', e.target.value)}
              placeholder="123 Rue de la Paix, 75001 Paris, France"
              rows={2}
              required
            />
            <Input
              label="Link de Google Maps"
              value={formData.venueLink || ''}
              onChange={(e) => handleChange('venueLink', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Latitud"
                type="number"
                step="any"
                value={formData.venueLatitude?.toString() || ''}
                onChange={(e) => handleChange('venueLatitude', parseFloat(e.target.value))}
                placeholder="48.8566"
              />
              <Input
                label="Longitud"
                type="number"
                step="any"
                value={formData.venueLongitude?.toString() || ''}
                onChange={(e) => handleChange('venueLongitude', parseFloat(e.target.value))}
                placeholder="2.3522"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.parkingAvailable}
                  onChange={(e) => handleChange('parkingAvailable', e.target.checked)}
                  className="w-4 h-4 text-rose-500 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Parking Disponible</span>
              </label>
            </div>
            <Textarea
              label="Descripción de Parking"
              value={formData.parkingDescription || ''}
              onChange={(e) => handleChange('parkingDescription', e.target.value)}
              placeholder="Free parking available at the venue..."
              rows={2}
            />
            <Textarea
              label="Nota de Transporte"
              value={formData.transportNote || ''}
              onChange={(e) => handleChange('transportNote', e.target.value)}
              placeholder="Shuttle service available from..."
              rows={3}
            />
          </div>
        )}

        {/* Dress Code Section */}
        {activeSection === 'dress' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Input
              label="Título del Dress Code"
              value={formData.dressCodeTitle}
              onChange={(e) => handleChange('dressCodeTitle', e.target.value)}
              placeholder="Elegant & Romantic"
              required
            />
            <Textarea
              label="Descripción General"
              value={formData.dressCodeDescription}
              onChange={(e) => handleChange('dressCodeDescription', e.target.value)}
              placeholder="We want you to feel comfortable and beautiful..."
              rows={3}
              required
            />
            <Textarea
              label="Dress Code para Hombres"
              value={formData.dressCodeMen}
              onChange={(e) => handleChange('dressCodeMen', e.target.value)}
              placeholder="Suit or tuxedo in dark colors..."
              rows={3}
              required
            />
            <Textarea
              label="Dress Code para Mujeres"
              value={formData.dressCodeWomen}
              onChange={(e) => handleChange('dressCodeWomen', e.target.value)}
              placeholder="Cocktail dress or long gown..."
              rows={3}
              required
            />
          </div>
        )}

        {/* Weather Section */}
        {activeSection === 'weather' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Input
              label="Temporada"
              value={formData.weatherSeason}
              onChange={(e) => handleChange('weatherSeason', e.target.value)}
              placeholder="Early Summer"
              required
            />
            <Input
              label="Temperatura Promedio"
              value={formData.weatherAvgTemp}
              onChange={(e) => handleChange('weatherAvgTemp', e.target.value)}
              placeholder="20-25°C (68-77°F)"
              required
            />
            <Textarea
              label="Descripción del Clima"
              value={formData.weatherDescription}
              onChange={(e) => handleChange('weatherDescription', e.target.value)}
              placeholder="June in France offers mild and pleasant weather..."
              rows={3}
              required
            />
            <Textarea
              label="Recomendaciones"
              value={formData.weatherRecommendations}
              onChange={(e) => handleChange('weatherRecommendations', e.target.value)}
              placeholder="Bring a light jacket or shawl..."
              rows={3}
              required
            />
          </div>
        )}

        {/* Additional Information Section */}
        {activeSection === 'additional' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Input
              label="Título de Alojamiento"
              value={formData.accommodationTitle || ''}
              onChange={(e) => handleChange('accommodationTitle', e.target.value)}
              placeholder="Where to Stay"
            />
            <Textarea
              label="Descripción de Alojamiento"
              value={formData.accommodationDescription || ''}
              onChange={(e) => handleChange('accommodationDescription', e.target.value)}
              placeholder="We have reserved room blocks at nearby hotels..."
              rows={3}
            />
            <Textarea
              label="Política de Regalos"
              value={formData.giftPolicy || ''}
              onChange={(e) => handleChange('giftPolicy', e.target.value)}
              placeholder="Your presence is the greatest gift..."
              rows={3}
            />
            <Textarea
              label="Política de Niños"
              value={formData.childrenPolicy || ''}
              onChange={(e) => handleChange('childrenPolicy', e.target.value)}
              placeholder="We love your little ones, but..."
              rows={3}
            />
            <Textarea
              label="Nota de Fotografía"
              value={formData.photographyNote || ''}
              onChange={(e) => handleChange('photographyNote', e.target.value)}
              placeholder="We have hired a professional photographer..."
              rows={3}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="flex-1"
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
