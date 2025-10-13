import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { reservedBy } = await req.json();

    if (!reservedBy) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const gift = await prisma.gift.update({
      where: { id: params.id },
      data: {
        reserved: true,
        reservedBy,
      },
    });

    return NextResponse.json({ success: true, gift });
  } catch (error) {
    console.error('Error reserving gift:', error);
    return NextResponse.json(
      { error: 'Failed to reserve gift' },
      { status: 500 }
    );
  }
}
