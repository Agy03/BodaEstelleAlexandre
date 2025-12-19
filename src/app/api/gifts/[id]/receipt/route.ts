import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    // Guardar el archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear directorio si no existe
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    await mkdir(uploadsDir, { recursive: true });

    // Generar nombre único para el archivo
    const filename = `receipt_${id}_${Date.now()}${path.extname(file.name)}`;
    const filepath = path.join(uploadsDir, filename);
    
    await writeFile(filepath, buffer);

    // Actualizar el regalo con la URL del recibo
    const updatedGift = await prisma.gift.update({
      where: { id },
      data: {
        receiptUrl: `/uploads/receipts/${filename}`,
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
