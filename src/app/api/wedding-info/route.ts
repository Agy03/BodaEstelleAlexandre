import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener información de la boda
export async function GET() {
  try {
    // Obtener el primer registro (solo debe haber uno)
    let weddingInfo = await prisma.weddingInfo.findFirst();

    // Si no existe, crear uno con valores por defecto
    if (!weddingInfo) {
      weddingInfo = await prisma.weddingInfo.create({
        data: {
          weddingDate: 'Saturday, June 20th, 2026',
          ceremonyTime: '4:00 PM',
          cocktailTime: '5:30 PM',
          dinnerPartyTime: '7:00 PM',
          venueName: 'Château de la Belle Vue',
          venueAddress: '123 Rue de la Paix, 75001 Paris, France',
          venueLink: 'https://maps.google.com',
          venueLatitude: 48.8566,
          venueLongitude: 2.3522,
          dressCodeTitle: 'Elegant & Romantic',
          dressCodeDescription: 'We want you to feel comfortable and beautiful on our special day. The dress code is elegant and romantic.',
          dressCodeMen: 'Suit or tuxedo in dark colors (black, navy, or charcoal). Tie or bow tie optional.',
          dressCodeWomen: 'Cocktail dress or long gown in soft, romantic colors. Avoid white, cream, or ivory.',
          weatherSeason: 'Early Summer',
          weatherAvgTemp: '20-25°C (68-77°F)',
          weatherDescription: 'June in France offers mild and pleasant weather, perfect for an outdoor celebration.',
          weatherRecommendations: 'Bring a light jacket or shawl for the evening. Comfortable shoes recommended for outdoor areas.',
          parkingAvailable: true,
          parkingDescription: 'Free parking available at the venue. Valet service provided.',
          accommodationTitle: 'Where to Stay',
          accommodationDescription: 'We have reserved room blocks at nearby hotels. Check our Tourism section for recommendations.',
          giftPolicy: 'Your presence is the greatest gift. If you wish to honor us with a gift, we have a registry available.',
          childrenPolicy: 'We love your little ones, but we have planned an adult-only celebration.',
          photographyNote: 'We have hired a professional photographer. Please enjoy the moment unplugged during the ceremony.',
          scheduleNote: 'Please arrive 15 minutes before the ceremony to ensure everyone is seated on time.',
          transportNote: 'Shuttle service available from selected hotels. Details will be sent via email.',
        },
      });
    }

    return NextResponse.json(weddingInfo);
  } catch (error) {
    console.error('Error fetching wedding info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wedding information' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar información de la boda (solo admin)
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || !('role' in session.user) || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Buscar el registro existente
    const existingInfo = await prisma.weddingInfo.findFirst();

    let weddingInfo;
    if (existingInfo) {
      // Actualizar el registro existente
      weddingInfo = await prisma.weddingInfo.update({
        where: { id: existingInfo.id },
        data: {
          ...data,
          updatedBy: session.user.email || session.user.name || 'admin',
        },
      });
    } else {
      // Crear nuevo registro
      weddingInfo = await prisma.weddingInfo.create({
        data: {
          ...data,
          updatedBy: session.user.email || session.user.name || 'admin',
        },
      });
    }

    return NextResponse.json(weddingInfo);
  } catch (error) {
    console.error('Error updating wedding info:', error);
    return NextResponse.json(
      { error: 'Failed to update wedding information' },
      { status: 500 }
    );
  }
}
