import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const place = await prisma.tourismPlace.update({
      where: { id: params.id },
      data: {
        name: data.name,
        type: data.category || 'leisure',
        description: data.description || '',
        image: data.image || null,
        link: data.link || null,
      },
    });

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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tourismPlace.delete({
      where: { id: params.id },
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
