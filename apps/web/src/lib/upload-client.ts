import imageCompression from 'browser-image-compression';

export interface UploadResult {
  publicId: string;
  url: string;
  width: number;
  height: number;
  size: number;
  variants: {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    placeholder: string;
  };
}

const MAX_SIZE_MB = 5;
const COMPRESSION_TARGET_MB = 1;
const MAX_WIDTH = 1920;

export async function compressImage(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: COMPRESSION_TARGET_MB,
    maxWidthOrHeight: MAX_WIDTH,
    useWebWorker: true,
    fileType: 'image/webp',
  });
}

export async function uploadImage(
  file: File,
  folder: 'profile' | 'listing' = 'listing',
): Promise<UploadResult> {
  const compressed = await compressImage(file);

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(compressed);
  });

  const base64Data = dataUrl.split(',')[1] ?? '';

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/image`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: base64Data,
      filename: file.name,
      mimetype: compressed.type,
      folder,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'UploadFailed' }));
    throw error;
  }

  return res.json();
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WebP allowed' };
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `Max ${MAX_SIZE_MB}MB` };
  }
  return { valid: true };
}
