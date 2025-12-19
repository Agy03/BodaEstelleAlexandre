import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const file = formData.get('receipt') as File;
    const reservedBy = formData.get('reservedBy') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Receipt file is required' },
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
