import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { reservedBy } = await req.json();
    const { id } = await params;

    if (!reservedBy) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Calcular fecha de expiración (7 días desde ahora)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const gift = await prisma.gift.update({
      where: { id },
      data: {
        reserved: true,
        reservedBy,
        reservedAt: now,
        reservationExpiresAt: expiresAt,
        receiptStatus: 'pending',
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
