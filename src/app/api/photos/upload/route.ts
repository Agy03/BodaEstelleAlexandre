import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

// Configuración para Vercel - aumentar límite de body size
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// Configuración de tiempo máximo de ejecución en Vercel
export const maxDuration = 60; // 60 segundos

export async function POST(req: NextRequest) {
  try {
    console.log('Starting photo upload...');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploaderName = formData.get('uploaderName') as string;
    const caption = formData.get('caption') as string;

    console.log('File received:', file?.name, 'Size:', file?.size);

    if (!file) {
      console.error('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validar tamaño de archivo (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('File too large:', file.size);
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `photos/photo_${timestamp}_${random}.${extension}`;

    console.log('Uploading to Supabase:', filename);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload photo', details: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(filename);

    console.log('Photo uploaded successfully:', publicUrl);

    // Create photo record in database (pending approval)
    const photo = await prisma.photo.create({
      data: {
        url: publicUrl,
        uploaderName: uploaderName || null,
        caption: caption || null,
        approved: false,
      },
    });

    return NextResponse.json({ success: true, photo }, { status: 201 });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

