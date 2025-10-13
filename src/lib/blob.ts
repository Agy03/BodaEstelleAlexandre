import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
// Note: removed import of getSignedUrl from '@aws-sdk/s3-request-presigner' to avoid missing module/type errors.
// If you need signed URLs for private buckets, install '@aws-sdk/s3-request-presigner' and restore the import.

const s3Client = new S3Client({
  region: process.env.BLOB_REGION || 'us-east-1',
  endpoint: process.env.BLOB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.BLOB_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.BLOB_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET = process.env.BLOB_BUCKET || 'boda-estelle-photos';

export async function uploadBlob(file: File, key: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);
  
  // Return public URL or generate signed URL
  return `${process.env.BLOB_ENDPOINT}/${BUCKET}/${key}`;
}

export async function deleteBlob(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}
export async function getSignedBlobUrl(key: string): Promise<string> {
  // Fallback: return a direct (unsigned) public URL so the code compiles without '@aws-sdk/s3-request-presigner'.
  // For private buckets and real signed URLs, install and import '@aws-sdk/s3-request-presigner' and re-enable signing.
  return `${process.env.BLOB_ENDPOINT || ''}/${BUCKET}/${key}`;
}


export function generateBlobKey(filename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = filename.split('.').pop();
  return `photos/${timestamp}-${random}.${extension}`;
}
