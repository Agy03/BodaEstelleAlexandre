import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { INVITED_GUESTS } from '@/data/invitedGuests';

export async function GET() {
  try {
    const extraGuests = await prisma.invitedGuest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const names = [...INVITED_GUESTS, ...extraGuests.map((guest) => guest.name)];

    return NextResponse.json(Array.from(new Set(names)));
  } catch (error) {
    console.error('Error fetching invited guests:', error);
    return NextResponse.json(INVITED_GUESTS);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || !('role' in session.user) || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const name = typeof data.name === 'string' ? data.name.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (INVITED_GUESTS.includes(name)) {
      return NextResponse.json({ name, alreadyExists: true });
    }

    const guest = await prisma.invitedGuest.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error('Error creating invited guest:', error);
    return NextResponse.json(
      { error: 'Error al crear el invitado' },
      { status: 500 }
    );
  }
}
