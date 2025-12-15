'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Heart, Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Usuario o contraseña incorrectos');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5] via-white to-[#F8EDE3] -z-10" />
      
      {/* Animated floating elements */}
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-tr from-[var(--color-accent)]/20 to-transparent rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-gray-100 shadow-2xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative inline-block mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full blur-2xl opacity-40" />
                <div className="relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-4 rounded-full">
                  <Lock className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2 font-playfair">
                Panel de Administración
              </h1>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-[var(--color-primary)]" />
                Solo para los novios
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="estelle-alexandre"
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white text-lg py-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Credenciales de acceso solo para Estelle y Alexandre
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Hint (puedes eliminarlo en producción) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-center text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-lg p-4"
        >
          💡 <strong>Usuario:</strong> estelle-alexandre<br />
          🔑 <strong>Contraseña:</strong> boda2025
        </motion.div>
      </motion.div>
    </div>
  );
}
