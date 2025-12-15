import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const gift = await prisma.gift.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price ? parseFloat(data.price) : null,
        image: data.image || null,
        link: data.link || null,
      },
    });

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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.gift.delete({
      where: { id: params.id },
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
