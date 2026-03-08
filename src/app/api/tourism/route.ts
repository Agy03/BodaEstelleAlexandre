import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { autoTranslateEntity, getTranslatedEntities, getLocaleFromRequest } from '@/lib/translate';

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

export async function GET(request: Request) {
  try {
    const locale = getLocaleFromRequest(request);

    // Intentar obtener de la base de datos
    const places = await prisma.tourismPlace.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Apply translations
    const translated = await getTranslatedEntities(
      'TourismPlace',
      places as unknown as (Record<string, unknown> & { id: string })[],
      locale
    );

    return NextResponse.json(translated);
  } catch (error) {
    console.error('Error fetching tourism places:', error);
    console.log('Returning sample data instead');
    
    // Si falla la conexión a la base de datos, devolver datos de ejemplo
    return NextResponse.json(samplePlaces);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const place = await prisma.tourismPlace.create({
      data: {
        name: data.name,
        type: data.category || 'leisure',
        description: data.description || '',
        image: data.image || null,
        link: data.link || null,
      },
    });

    // Auto-translate to other locales
    const sourceLocale = getLocaleFromRequest(request);
    autoTranslateEntity('TourismPlace', place.id, data, sourceLocale);

    return NextResponse.json(place, { status: 201 });
  } catch (error) {
    console.error('Error creating tourism place:', error);
    return NextResponse.json(
      { error: 'Error al crear el lugar' },
      { status: 500 }
    );
  }
}
