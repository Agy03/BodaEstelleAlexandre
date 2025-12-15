import { supabase } from './supabase';

const BUCKET = 'photos'; // Nombre del bucket en Supabase Storage

/**
 * Upload a file to Supabase Storage
 */
export async function uploadBlob(file: File, key: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(key, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('Error uploading to Supabase Storage:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(key);

  return publicUrl;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteBlob(key: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([key]);

  if (error) {
    console.error('Error deleting from Supabase Storage:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get a signed URL for temporary access (optional, for private buckets)
 */
export async function getSignedBlobUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(key, expiresIn);

  if (error || !data) {
    console.error('Error creating signed URL:', error);
    // Fallback to public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(key);
    return publicUrl;
  }

  return data.signedUrl;
}

/**
 * Generate a unique key for blob storage
 */
export function generateBlobKey(filename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = filename.split('.').pop();
  return `photos/${timestamp}-${random}.${extension}`;
}

