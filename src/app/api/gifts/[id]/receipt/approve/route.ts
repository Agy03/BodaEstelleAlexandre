import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar que el usuario es admin
    const session = await auth();
    
    if (!session?.user || !('role' in session.user) || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { approved } = await req.json();

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Approved status is required' },
        { status: 400 }
      );
    }

    const gift = await prisma.gift.findUnique({ where: { id } });
    
    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      );
    }

    if (!gift.reserved || !gift.receiptUrl) {
      return NextResponse.json(
        { error: 'No receipt to approve for this gift' },
        { status: 400 }
      );
    }

    // Si se aprueba, marcar como purchased y approved
    // Si se rechaza, desbloquear el regalo
    const updatedGift = await prisma.gift.update({
      where: { id },
      data: approved ? {
        receiptStatus: 'approved',
        purchased: true,
      } : {
        receiptStatus: 'rejected',
        reserved: false,
        reservedBy: null,
        reservedAt: null,
        reservationExpiresAt: null,
        receiptUrl: null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      gift: updatedGift,
      message: approved ? 'Receipt approved. Gift marked as purchased.' : 'Receipt rejected. Gift unlocked.'
    });
  } catch (error) {
    console.error('Error approving/rejecting receipt:', error);
    return NextResponse.json(
      { error: 'Failed to process receipt' },
      { status: 500 }
    );
  }
}
