'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CheckCircle, Users } from 'lucide-react';

export default function RSVPPage() {
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
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
              ¡Confirmación Recibida!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {formData.attending
                ? '¡Nos alegra mucho que puedas acompañarnos! Te esperamos con mucha ilusión.'
                : 'Lamentamos que no puedas asistir. ¡Esperamos celebrar contigo en otra ocasión!'}
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Volver al Inicio
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-white to-[var(--color-secondary)]/5 -z-10" />
      <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-[var(--color-secondary)]/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-2xl mx-auto relative">
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
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-5 rounded-full">
              <Users className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Confirma tu Asistencia
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Por favor, háznoslo saber lo antes posible para poder organizar todo perfectamente
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Formulario de Confirmación</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Nombre completo *"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Juan Pérez"
                />

                <Input
                  label="Email *"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="juan@ejemplo.com"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Podrás asistir? *
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: true })}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                        formData.attending
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      ✓ Sí, asistiré
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: false })}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                        !formData.attending
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      ✗ No podré asistir
                    </button>
                  </div>
                </div>

                {formData.attending && (
                  <Input
                    label="Número de acompañantes"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                )}

                <Textarea
                  label="Comentarios o restricciones alimentarias"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Alergias, intolerancias, comentarios especiales..."
                  rows={4}
                />

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Enviando...' : 'Confirmar Asistencia'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
