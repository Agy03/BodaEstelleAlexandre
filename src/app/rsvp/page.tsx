'use client';

import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle, Users, Mail, User, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INVITED_GUESTS } from '@/data/invitedGuests';

interface GuestInfo {
  name: string;
  email: string;
}

const normalizeGuestSearch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default function RSVPPage() {
  const t = useTranslations('rsvp');
  const tErrors = useTranslations('errors');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    email: '',
    attending: true,
    guests: 0,
    comments: '',
  });
  const [guestList, setGuestList] = useState<GuestInfo[]>([]);
  const [availableGuestNames, setAvailableGuestNames] = useState<string[]>(INVITED_GUESTS);
  const [selectedGuestName, setSelectedGuestName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadSubmittedGuests = async () => {
      try {
        const [guestResponse, rsvpResponse] = await Promise.all([
          fetch('/api/invited-guests'),
          fetch('/api/rsvp'),
        ]);
        if (!guestResponse.ok || !rsvpResponse.ok) return;

        const invitedGuests: string[] = await guestResponse.json();
        const submittedRsvps: { name?: string }[] = await rsvpResponse.json();
        const submittedNames = new Set(
          submittedRsvps
            .map((rsvp) => rsvp.name)
            .filter((name): name is string => Boolean(name))
        );

        setAvailableGuestNames(invitedGuests.filter((name) => !submittedNames.has(name)));
      } catch (error) {
        console.error('Error loading submitted RSVP names:', error);
      }
    };

    loadSubmittedGuests();
  }, []);

  const selectGuest = (name: string) => {
    setSelectedGuestName(name);
    setNameInput(name);
    setAvailableGuestNames(prev => prev.filter((guest) => guest !== name));
  };

  const handleNameChange = (value: string) => {
    setNameInput(value);

    const normalizedValue = normalizeGuestSearch(value);
    const exactGuest = availableGuestNames.find((name) => normalizeGuestSearch(name) === normalizedValue);
    setSelectedGuestName(exactGuest ?? null);
  };

  const guestNameSuggestions = useMemo(() => {
    const normalizedSearchTerm = normalizeGuestSearch(nameInput);

    if (normalizedSearchTerm.length < 2 || selectedGuestName) {
      return [];
    }

    return availableGuestNames.filter((name) =>
      normalizeGuestSearch(name).includes(normalizedSearchTerm)
    ).slice(0, 6);
  }, [availableGuestNames, nameInput, selectedGuestName]);
  const searchTerm = nameInput;
  const handleSearchChange = handleNameChange;
  const filteredGuestNames = guestNameSuggestions;
  const paginatedGuestNames = guestNameSuggestions;
  const guestPage = 1;
  const guestPageCount = 1;
  const guestPageSize = Number.POSITIVE_INFINITY;
  const setGuestPage: Dispatch<SetStateAction<number>> = () => undefined;
  const clearSelectedGuest = () => {
    setNameInput('');
    setSelectedGuestName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuestName) {
      alert(t('selectYourName')); 
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedGuestName,
          ...formData,
          guests: 0,
          guestList: [],
          locale,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert(tErrors('rsvpSubmit'));
    } finally {
      setLoading(false);
    }
  };

  // Update guest list when number of guests changes
  const handleGuestsChange = (newGuestCount: number) => {
    setFormData({ ...formData, guests: newGuestCount });
    
    // Adjust guestList array to match new count
    if (newGuestCount > guestList.length) {
      // Add empty guests
      const newGuests = Array(newGuestCount - guestList.length).fill(null).map(() => ({
        name: '',
        email: '',
      }));
      setGuestList([...guestList, ...newGuests]);
    } else if (newGuestCount < guestList.length) {
      // Remove extra guests
      setGuestList(guestList.slice(0, newGuestCount));
    }
  };

  const updateGuest = (index: number, field: 'name' | 'email', value: string) => {
    const newGuestList = [...guestList];
    newGuestList[index] = { ...newGuestList[index], [field]: value };
    setGuestList(newGuestList);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Decorative background - Elegant lace pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-rose)]/5 via-[var(--color-background)] to-[var(--color-secondary)]/5" />
        
        {/* Lace pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, var(--color-rose) 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, var(--color-secondary) 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, var(--color-accent) 0.5px, transparent 0.5px),
            radial-gradient(circle at 60% 20%, var(--color-rose) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 40px 40px, 40px 40px',
          backgroundPosition: '0 0, 40px 40px, 20px 20px, 60px 60px'
        }} />
        
        {/* Soft gradient orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-[var(--color-rose)]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-tl from-[var(--color-secondary)]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[var(--color-accent)]/10 to-transparent rounded-full blur-3xl" />

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
      {/* Decorative background - Elegant lace pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-rose)]/5 via-[var(--color-background)] to-[var(--color-secondary)]/5" />
      
      {/* Lace pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, var(--color-rose) 1px, transparent 1px),
          radial-gradient(circle at 80% 70%, var(--color-secondary) 1px, transparent 1px),
          radial-gradient(circle at 40% 80%, var(--color-accent) 0.5px, transparent 0.5px),
          radial-gradient(circle at 60% 20%, var(--color-rose) 0.5px, transparent 0.5px)
        `,
        backgroundSize: '80px 80px, 80px 80px, 40px 40px, 40px 40px',
        backgroundPosition: '0 0, 40px 40px, 20px 20px, 60px 60px'
      }} />
      
      {/* Soft gradient orbs */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-[var(--color-rose)]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-[var(--color-secondary)]/10 to-transparent rounded-full blur-3xl" />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[var(--color-accent)]/10 rounded-tl-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[var(--color-accent)]/10 rounded-br-3xl" />

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
              <div className="relative">
                <Input
                  label={t('form.name')}
                  value={nameInput}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t('form.name')}
                  icon={<User className="w-5 h-5" />}
                  required
                />
                {guestNameSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-[var(--color-rose)]/20 bg-white shadow-xl">
                    {guestNameSuggestions.map((name, index) => (
                      <button
                        key={`${name}-${index}`}
                        type="button"
                        onClick={() => selectGuest(name)}
                        className="block w-full px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-[var(--color-rose)]/10"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
                {nameInput.trim().length >= 2 && !selectedGuestName && guestNameSuggestions.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">{t('noMatchingGuest')}</p>
                )}
              </div>
              {/* Selección de invitado */}
              {false && (!selectedGuestName ? (
                <div className="space-y-4">
                  <div className="rounded-3xl border border-[var(--color-accent)]/20 bg-white/80 p-5">
                    <p className="text-sm font-light text-gray-600 mb-3">
                      {t('selectYourNameDescription')}
                    </p>
                    <Input
                      label={t('searchInvite')}
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder={t('searchInvite')}
                      icon={<Users className="w-5 h-5" />}
                    />
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {filteredGuestNames.length > 0 ? (
                        paginatedGuestNames.map((name, index) => (
                          <button
                            key={`${name}-${index}`}
                            type="button"
                            onClick={() => selectGuest(name)}
                            className="rounded-2xl border border-[var(--color-rose)]/20 bg-[var(--color-rose)]/5 px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:border-[var(--color-rose)] hover:bg-[var(--color-rose)]/10"
                          >
                            {name}
                          </button>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                          {t('noMatchingGuest')}
                        </div>
                      )}
                    </div>
                    {filteredGuestNames.length > guestPageSize && (
                      <div className="mt-4 flex items-center justify-center border-t border-[var(--color-accent)]/10 pt-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setGuestPage((page) => Math.max(1, page - 1))}
                            disabled={guestPage === 1}
                            className="rounded-full border border-[var(--color-rose)]/20 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-[var(--color-rose)] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Anterior
                          </button>
                          <span className="text-xs font-medium text-gray-600">
                            {guestPage} / {guestPageCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setGuestPage((page) => Math.min(guestPageCount, page + 1))}
                            disabled={guestPage === guestPageCount}
                            className="rounded-full border border-[var(--color-rose)]/20 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-[var(--color-rose)] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-[var(--color-rose)]/20 bg-gradient-to-br from-[var(--color-rose)]/5 to-[var(--color-secondary)]/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-light text-gray-500">{t('selectedInvite')}</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{selectedGuestName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearSelectedGuest}
                      className="text-sm font-medium text-[var(--color-rose)] hover:underline"
                    >
                      {t('changeGuest')}
                    </button>
                  </div>
                </div>
              ))}

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
              {false && formData.attending && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Select
                    label={t('form.guests')}
                    value={formData.guests.toString()}
                    onChange={(e) => handleGuestsChange(parseInt(e.target.value) || 0)}
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

              {/* Información de los acompañantes */}
              {false && formData.attending && formData.guests > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-sm font-light text-gray-600 mb-3">
                    <Users className="w-4 h-4 text-[var(--color-rose)]" />
                    <span>{t('form.addGuestInfo')}</span>
                  </div>
                  
                  {guestList.map((guest, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border-2 border-[var(--color-accent)]/20 bg-gradient-to-br from-[var(--color-rose)]/5 to-[var(--color-secondary)]/5 space-y-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-700">
                          {t('form.guestDetails')} {index + 1}
                        </h3>
                      </div>
                      
                      <Input
                        label={t('form.guestName')}
                        type="text"
                        required
                        value={guest.name}
                        onChange={(e) => updateGuest(index, 'name', e.target.value)}
                        placeholder={t('form.guestName')}
                        icon={<User className="w-4 h-4" />}
                      />
                      
                      <Input
                        label={t('form.guestEmail')}
                        type="email"
                        required
                        value={guest.email}
                        onChange={(e) => updateGuest(index, 'email', e.target.value)}
                        placeholder={t('form.guestEmail')}
                        icon={<Mail className="w-4 h-4" />}
                      />
                    </motion.div>
                  ))}
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
                  disabled={loading || !selectedGuestName}
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
