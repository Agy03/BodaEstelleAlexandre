import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const places = await prisma.tourismPlace.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error('Error fetching tourism places:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tourism places' },
      { status: 500 }
    );
  }
}
