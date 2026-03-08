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
    
    const gift = await prisma.gift.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price ? parseFloat(data.price) : null,
        image: data.image || null,
        link: data.link || null,
      },
    });

    // Auto-translate to other locales
    const sourceLocale = getLocaleFromRequest(request);
    autoTranslateEntity('Gift', gift.id, data, sourceLocale);

    return NextResponse.json(gift);
  } catch (error) {
    console.error('Error updating gift:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el regalo' },
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
      where: { entityType: 'Gift', entityId: id },
    });

    await prisma.gift.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gift:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el regalo' },
      { status: 500 }
    );
  }
}
