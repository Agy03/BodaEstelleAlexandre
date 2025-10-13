import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Datos de ejemplo para cuando no hay conexión a la base de datos
const samplePlaces = [
  {
    id: '1',
    name: 'Hotel Palace',
    type: 'hotel',
    description: 'Elegante hotel cerca del lugar de la boda con todas las comodidades.',
    image: null,
    link: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Restaurante La Terraza',
    type: 'restaurant',
    description: 'Cocina local excepcional con vistas panorámicas.',
    image: null,
    link: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Museo de Arte',
    type: 'culture',
    description: 'Colección impresionante de arte moderno y contemporáneo.',
    image: null,
    link: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Parque de Atracciones',
    type: 'leisure',
    description: 'Diversión para toda la familia con emocionantes atracciones.',
    image: null,
    link: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Hotel Boutique',
    type: 'hotel',
    description: 'Encantador hotel boutique en el centro histórico.',
    image: null,
    link: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Catedral Histórica',
    type: 'culture',
    description: 'Impresionante arquitectura gótica del siglo XV.',
    image: null,
    link: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET() {
  try {
    // Intentar obtener de la base de datos
    const places = await prisma.tourismPlace.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error('Error fetching tourism places:', error);
    console.log('Returning sample data instead');
    
    // Si falla la conexión a la base de datos, devolver datos de ejemplo
    return NextResponse.json(samplePlaces);
  }
}
