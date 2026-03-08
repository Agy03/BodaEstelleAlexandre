import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { autoTranslateEntity, getLocaleFromRequest } from '@/lib/translate';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const place = await prisma.tourismPlace.update({
      where: { id },
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

    return NextResponse.json(place);
  } catch (error) {
    console.error('Error updating tourism place:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el lugar' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete translations first
    await prisma.translation.deleteMany({
      where: { entityType: 'TourismPlace', entityId: id },
    });

    await prisma.tourismPlace.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tourism place:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el lugar' },
      { status: 500 }
    );
  }
}
