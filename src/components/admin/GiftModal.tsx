'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import NextImage from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

const CATEGORY_KEYS = ['home', 'experience', 'other'] as const;

export function GiftModal({ isOpen, onClose, onSave, gift }: GiftModalProps) {
  const t = useTranslations('admin.giftModal');
  const tActions = useTranslations('admin.actions');

  const categories = CATEGORY_KEYS.map(key => ({
    value: key,
    label: t(`categories.${key}`),
  }));
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
        category: gift.category || 'home',
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
        category: 'home',
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
    <Modal isOpen={isOpen} onClose={onClose} title={gift ? t('editTitle') : t('addTitle')} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            {t('nameLabel')}
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('namePlaceholder')}
            required
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            {t('descriptionLabel')}
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t('descriptionPlaceholder')}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              {t('priceLabel')}
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
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              {t('categoryLabel')}
            </label>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
            {t('imageLabel')}
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
            {t('linkLabel')}
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
            id="priority"
            checked={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.checked })}
            className="w-4 h-4 text-[#E8B4B8] rounded focus:ring-[#E8B4B8] flex-shrink-0"
          />
          <label htmlFor="priority" className="text-xs md:text-sm font-medium text-gray-700">
            {t('priorityLabel')}
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
            {tActions('cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {gift ? t('saveChanges') : t('addGift')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
