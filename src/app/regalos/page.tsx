'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, ExternalLink, Check, Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type GiftItem = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  link?: string;
  reserved: boolean;
  purchased: boolean;
};

export default function RegalosPage() {
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const response = await fetch('/api/gifts');
      const data = await response.json();
      setGifts(data);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (giftId: string) => {
    const name = prompt('Por favor, introduce tu nombre para reservar este regalo:');
    if (!name) return;

    try {
      const response = await fetch(`/api/gifts/${giftId}/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservedBy: name }),
      });

      if (response.ok) {
        fetchGifts(); // Refresh list
        alert('¡Regalo reservado! Gracias por tu generosidad.');
      }
    } catch (error) {
      console.error('Error reserving gift:', error);
      alert('Error al reservar el regalo. Por favor, inténtalo de nuevo.');
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
          <Gift className="w-16 h-16 text-[var(--color-primary)] mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">
            Lista de Regalos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Si deseas hacernos un regalo, aquí encontrarás algunas ideas. 
            Tu presencia es el mejor regalo que podríamos recibir.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <Loader className="w-12 h-12 mx-auto animate-spin text-[var(--color-primary)]" />
            <p className="mt-4 text-gray-600">Cargando lista de regalos...</p>
          </div>
        ) : gifts.length === 0 ? (
          <div className="text-center py-20">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <p className="text-gray-600 text-lg mb-4">
                  Próximamente publicaremos nuestra lista de regalos.
                </p>
                <p className="text-gray-500">
                  Mientras tanto, tu compañía es el mejor regalo que podríamos recibir.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.map((gift, index) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  {gift.image && (
                    <div className="w-full h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                      <img
                        src={gift.image}
                        alt={gift.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="pt-4 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-[var(--color-text)]">
                      {gift.name}
                    </h3>
                    
                    {gift.description && (
                      <p className="text-gray-600 mb-4 flex-1">{gift.description}</p>
                    )}
                    
                    {gift.price && (
                      <p className="text-lg font-bold text-[var(--color-primary)] mb-4">
                        {gift.price.toFixed(2)} €
                      </p>
                    )}

                    <div className="space-y-2">
                      {gift.purchased ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">Ya comprado</span>
                        </div>
                      ) : gift.reserved ? (
                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">Reservado</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleReserve(gift.id)}
                          className="w-full"
                        >
                          Reservar Regalo
                        </Button>
                      )}

                      {gift.link && !gift.purchased && (
                        <a
                          href={gift.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                        >
                          Ver en tienda
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
