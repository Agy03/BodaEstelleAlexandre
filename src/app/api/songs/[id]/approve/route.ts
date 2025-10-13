import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const song = await prisma.song.update({
      where: { id: params.id },
      data: { approved: true },
    });

    return NextResponse.json({ success: true, song });
  } catch (error) {
    console.error('Error approving song:', error);
    return NextResponse.json(
      { error: 'Failed to approve song' },
      { status: 500 }
    );
  }
}
