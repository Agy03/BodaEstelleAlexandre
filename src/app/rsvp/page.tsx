'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle, Users, Mail, User, Heart, Sparkles, Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RSVPPage() {
  const t = useTranslations('rsvp');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: true,
    guests: 0,
    comments: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Hubo un error al enviar tu confirmación. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-rose)]/10 via-[var(--color-background)] to-[var(--color-secondary)]/10" />
        <div className="absolute top-10 left-10 opacity-10">
          <Flower2 className="w-32 h-32 text-[var(--color-rose)]" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <Flower2 className="w-32 h-32 text-[var(--color-secondary)]" />
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative inline-block mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-6 rounded-full">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl font-light font-playfair mb-6 bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                {t('success')}
              </h1>
              <div className="flex justify-center items-center gap-3 mb-6">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-rose)] to-transparent" />
                <Heart className="w-5 h-5 text-[var(--color-rose)] fill-current" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-rose)] to-transparent" />
              </div>
              <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed max-w-xl mx-auto">
                {formData.attending
                  ? t('successMessageAttending')
                  : t('successMessageNotAttending')}
              </p>
              <Button onClick={() => window.location.href = '/'} size="lg">
                {t('backToHome')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-rose)]/5 via-[var(--color-background)] to-[var(--color-secondary)]/5" />
      <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-[var(--color-rose)]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-[var(--color-secondary)]/10 to-transparent rounded-full blur-3xl" />

      {/* Flores decorativas solo arriba */}
      <div className="fixed top-10 left-10 opacity-10 pointer-events-none">
        <Flower2 className="w-24 h-24 text-[var(--color-rose)]" />
      </div>
      <div className="fixed top-20 right-20 opacity-10 pointer-events-none">
        <Flower2 className="w-28 h-28 text-[var(--color-secondary)]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
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
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] p-5 rounded-full shadow-xl">
              <Users className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-6xl font-light mb-4 font-playfair">
              <span className="bg-gradient-to-r from-[var(--color-rose)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h1>

            <div className="flex justify-center items-center gap-3 mb-6">
              <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
              <Heart className="w-5 h-5 text-[var(--color-rose)] fill-current" />
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
              <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            </div>

            <p className="text-lg text-gray-600 leading-relaxed font-light">
              {t('subtitle')}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card hover className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <Input
                label={t('form.name')}
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('form.name')}
                icon={<User className="w-5 h-5" />}
              />

              {/* Email */}
              <Input
                label={t('form.email')}
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('form.email')}
                icon={<Mail className="w-5 h-5" />}
              />

              {/* Asistencia */}
              <div className="space-y-3">
                <label className="block text-sm font-light tracking-wide text-gray-700">
                  {t('form.attending')} <span className="text-[var(--color-rose)]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, attending: true })}
                    className={cn(
                      'relative py-4 px-6 rounded-xl border-2 transition-all duration-300 font-light',
                      formData.attending
                        ? 'border-[var(--color-rose)] bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-secondary)] text-white shadow-lg shadow-[var(--color-rose)]/20'
                        : 'border-[var(--color-accent)]/20 hover:border-[var(--color-rose)]/40 bg-white'
                    )}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Heart className={cn("w-5 h-5", formData.attending && "fill-current")} />
                      {t('form.yes')}
                    </span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, attending: false })}
                    className={cn(
                      'relative py-4 px-6 rounded-xl border-2 transition-all duration-300 font-light',
                      !formData.attending
                        ? 'border-gray-400 bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/20'
                        : 'border-[var(--color-accent)]/20 hover:border-gray-400/40 bg-white'
                    )}
                  >
                    {t('form.no')}
                  </motion.button>
                </div>
              </div>

              {/* Número de acompañantes */}
              {formData.attending && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Select
                    label={t('form.guests')}
                    value={formData.guests.toString()}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: parseInt(e.target.value) || 0 })
                    }
                    icon={<Users className="w-5 h-5" />}
                    options={[
                      { value: '0', label: t('form.guestsOptions.0') },
                      { value: '1', label: t('form.guestsOptions.1') },
                      { value: '2', label: t('form.guestsOptions.2') },
                      { value: '3', label: t('form.guestsOptions.3') },
                      { value: '4', label: t('form.guestsOptions.4') },
                      { value: '5', label: t('form.guestsOptions.5') },
                    ]}
                  />
                </motion.div>
              )}

              {/* Comentarios */}
              <Textarea
                label={t('form.comments')}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder={t('form.comments')}
                rows={4}
              />

              {/* Botón de envío */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  type="submit" 
                  className="w-full group relative overflow-hidden" 
                  size="lg" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      {t('form.submitting')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5 fill-current" />
                      {t('form.submit')}
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
