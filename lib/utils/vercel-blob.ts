import { put } from '@vercel/blob';

export interface FileUploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

export async function uploadFileToBlob(
  file: File | Buffer,
  filename: string,
  contentType?: string
): Promise<FileUploadResult> {
  try {
    const blob = await put(filename, file, {
      access: 'public',
      contentType: contentType || 'application/octet-stream',
    });

    return {
      success: true,
      url: blob.url,
      filename: blob.pathname,
    };
  } catch (error) {
    console.error('Error uploading file to Vercel Blob:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

export async function uploadMultipleFiles(
  files: File[],
  prefix: string = 'uploads'
): Promise<FileUploadResult[]> {
  const uploadPromises = files.map(async (file, index) => {
    const filename = `${prefix}/${Date.now()}-${index}-${file.name}`;
    return await uploadFileToBlob(file, filename, file.type);
  });

  return await Promise.all(uploadPromises);
}
