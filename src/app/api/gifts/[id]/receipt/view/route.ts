import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || !('role' in session.user) || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const gift = await prisma.gift.findUnique({
      where: { id },
      select: {
        receiptUrl: true,
      },
    });

    if (!gift?.receiptUrl) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    return NextResponse.redirect(gift.receiptUrl);
  } catch (error) {
    console.error('Error opening receipt:', error);
    return NextResponse.json(
      { error: 'Failed to open receipt' },
      { status: 500 }
    );
  }
}
