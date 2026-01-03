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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('Starting receipt upload for gift:', id);
    
    const formData = await req.formData();
    const file = formData.get('receipt') as File;
    const reservedBy = formData.get('reservedBy') as string;

    console.log('File received:', file?.name, 'Size:', file?.size);
    console.log('Reserved by:', reservedBy);

    if (!file) {
      console.error('No file provided');
      return NextResponse.json(
        { error: 'Receipt file is required' },
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

    // Verificar que el regalo esté reservado
    const gift = await prisma.gift.findUnique({ where: { id } });
    
    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      );
    }

    if (!gift.reserved || gift.reservedBy !== reservedBy) {
      return NextResponse.json(
        { error: 'You are not authorized to upload receipt for this gift' },
        { status: 403 }
      );
    }

    // Subir archivo a Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const filename = `receipts/receipt_${id}_${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload receipt' },
        { status: 500 }
      );
    }

    // Obtener la URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(filename);

    // Actualizar el regalo con la URL del recibo
    const updatedGift = await prisma.gift.update({
      where: { id },
      data: {
        receiptUrl: publicUrl,
        receiptStatus: 'pending',
      },
    });

    return NextResponse.json({ 
      success: true, 
      gift: updatedGift,
      message: 'Receipt uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading receipt:', error);
    return NextResponse.json(
      { error: 'Failed to upload receipt' },
      { status: 500 }
    );
  }
}
