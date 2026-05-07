import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sendWeddingInvitation } from '@/lib/email';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || !('role' in session.user) || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const rsvp = await prisma.rSVP.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
      },
    });

    if (!rsvp) {
      return NextResponse.json({ error: 'RSVP not found' }, { status: 404 });
    }

    if (!rsvp.email) {
      return NextResponse.json({ error: 'RSVP has no email' }, { status: 400 });
    }

    const locale = request.headers.get('Accept-Language')?.split(',')[0]?.split('-')[0] || 'es';

    await sendWeddingInvitation({
      to: rsvp.email,
      guestName: rsvp.name,
      locale,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resending invitation:', error);
    return NextResponse.json(
      { error: 'Error al reenviar la invitacion' },
      { status: 500 }
    );
  }
}
