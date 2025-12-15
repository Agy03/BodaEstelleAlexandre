import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const sampleGifts = [
  {
    id: '1',
    name: 'Luna de Miel',
    description: 'Ayuda para nuestra luna de miel soñada',
    price: null,
    link: null,
    image: null,
    reserved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Set de Vajilla',
    description: 'Vajilla elegante para nuestra nueva casa',
    price: 150,
    link: 'https://example.com/vajilla',
    image: null,
    reserved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Experiencia Gastronómica',
    description: 'Cena en un restaurante con estrella Michelin',
    price: 200,
    link: null,
    image: null,
    reserved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET() {
  try {
    const gifts = await prisma.gift.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(gifts);
  } catch (error) {
    console.error('Error fetching gifts:', error);
    console.log('Returning sample gifts instead');
    // Devolver datos de ejemplo si falla la base de datos
    return NextResponse.json(sampleGifts);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const gift = await prisma.gift.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price ? parseFloat(data.price) : null,
        image: data.image || null,
        link: data.link || null,
        reserved: false,
        purchased: false,
      },
    });

    return NextResponse.json(gift, { status: 201 });
  } catch (error) {
    console.error('Error creating gift:', error);
    return NextResponse.json(
      { error: 'Error al crear el regalo' },
      { status: 500 }
    );
  }
}
