import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { autoTranslateEntity } from '@/lib/translate';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/wedding-info/translate
 * Translates all existing wedding info from the specified source language
 * Admin only - requires authentication
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || !('role' in session.user) || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sourceLanguage } = await request.json();

    if (!['en', 'es', 'fr'].includes(sourceLanguage)) {
      return NextResponse.json(
        { error: 'Invalid source language. Must be en, es, or fr.' },
        { status: 400 }
      );
    }

    // Get all wedding info
    const weddingInfo = await prisma.weddingInfo.findFirst();

    if (!weddingInfo) {
      return NextResponse.json(
        { error: 'No wedding information found' },
        { status: 404 }
      );
    }

    // Prepare data for translation
    const dataToTranslate = {
      weddingDate: weddingInfo.weddingDate,
      dressCodeTitle: weddingInfo.dressCodeTitle,
      dressCodeDescription: weddingInfo.dressCodeDescription,
      dressCodeMen: weddingInfo.dressCodeMen,
      dressCodeWomen: weddingInfo.dressCodeWomen,
      weatherSeason: weddingInfo.weatherSeason,
      weatherAvgTemp: weddingInfo.weatherAvgTemp,
      weatherDescription: weddingInfo.weatherDescription,
      weatherRecommendations: weddingInfo.weatherRecommendations,
      parkingDescription: weddingInfo.parkingDescription || '',
      accommodationTitle: weddingInfo.accommodationTitle || '',
      accommodationDescription: weddingInfo.accommodationDescription || '',
      giftPolicy: weddingInfo.giftPolicy || '',
      childrenPolicy: weddingInfo.childrenPolicy || '',
      photographyNote: weddingInfo.photographyNote || '',
      scheduleNote: weddingInfo.scheduleNote || '',
      transportNote: weddingInfo.transportNote || '',
    };

    // Run translation
    await autoTranslateEntity('WeddingInfo', weddingInfo.id, dataToTranslate, sourceLanguage);

    return NextResponse.json({
      success: true,
      message: `Wedding info translated from ${sourceLanguage} to all other languages`,
      translatedId: weddingInfo.id,
    });
  } catch (error) {
    console.error('Error translating wedding info:', error);
    return NextResponse.json(
      { error: 'Failed to translate wedding information' },
      { status: 500 }
    );
  }
}
