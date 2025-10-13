import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadBlob, generateBlobKey } from '@/lib/blob';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploaderName = formData.get('uploaderName') as string;
    const caption = formData.get('caption') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate unique key and upload to blob storage
    const key = generateBlobKey(file.name);
    const url = await uploadBlob(file, key);

    // Create photo record in database (pending approval)
    const photo = await prisma.photo.create({
      data: {
        url,
        uploaderName: uploaderName || null,
        caption: caption || null,
        approved: false,
      },
    });

    return NextResponse.json({ success: true, photo }, { status: 201 });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
