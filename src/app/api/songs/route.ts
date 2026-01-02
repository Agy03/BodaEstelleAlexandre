import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, artist, suggestedBy, spotifyId, album, albumArt, previewUrl, spotifyUrl, approved, proposedBy } = body;

    if (!title || !artist) {
      return NextResponse.json(
        { error: 'Title and artist are required' },
        { status: 400 }
      );
    }

    const song = await prisma.song.create({
      data: {
        title,
        artist,
        suggestedBy: suggestedBy || null,
        proposedBy: proposedBy || null,
        approved: approved || false,
        spotifyId: spotifyId || null,
        album: album || null,
        albumArt: albumArt || null,
        previewUrl: previewUrl || null,
        spotifyUrl: spotifyUrl || null,
      },
    });

    return NextResponse.json({ success: true, song }, { status: 201 });
  } catch (error) {
    console.error('Error creating song:', error);
    return NextResponse.json(
      { error: 'Failed to create song' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}
