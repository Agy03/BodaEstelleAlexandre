'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import NextImage from 'next/image';
import { ExternalLink } from 'lucide-react';

type Gift = {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  link?: string;
  category?: string;
  priority?: boolean;
};

type GiftModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gift: Partial<Gift>) => void;
  gift?: Gift;
};

const CATEGORIES = [
  'Hogar',
  'Cocina',
  'Decoración',
  'Experiencias',
  'Viaje de Novios',
  'Tecnología',
  'Jardín',
  'Otro',
];

export function GiftModal({ isOpen, onClose, onSave, gift }: GiftModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    link: '',
    category: 'Hogar',
    priority: false,
  });

  useEffect(() => {
    if (gift) {
      setFormData({
        name: gift.name || '',
        description: gift.description || '',
        price: gift.price?.toString() || '',
        image: gift.image || '',
        link: gift.link || '',
        category: gift.category || 'Hogar',
        priority: gift.priority || false,
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        link: '',
        category: 'Hogar',
        priority: false,
      });
    }
  }, [gift, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: formData.price ? parseFloat(formData.price) : undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={gift ? 'Editar Regalo' : 'Añadir Regalo'} size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Regalo *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Juego de sábanas de lujo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe el regalo..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio (€)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="99.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enlace (tienda online, Amazon, etc.)
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
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-gray-600" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="priority"
            checked={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.checked })}
            className="w-4 h-4 text-[#E8B4B8] rounded focus:ring-[#E8B4B8]"
          />
          <label htmlFor="priority" className="text-sm font-medium text-gray-700">
            ⭐ Marcar como prioritario
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-[#E8B4B8] to-[#C9A7C7] text-white hover:shadow-2xl"
          >
            {gift ? 'Guardar Cambios' : 'Añadir Regalo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
