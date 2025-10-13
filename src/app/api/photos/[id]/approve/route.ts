import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const photo = await prisma.photo.update({
      where: { id },
      data: { approved: true },
    });

    return NextResponse.json({ success: true, photo });
  } catch (error) {
    console.error('Error approving photo:', error);
    return NextResponse.json(
      { error: 'Failed to approve photo' },
      { status: 500 }
    );
  }
}
