import { cloudinary } from '../config/cloudinary';
import { env } from '../config/env';
import { logger } from '../config/logger';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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

interface ModerationResult {
  safe: boolean;
  reason?: string;
}

/**
 * Moderate image with Sightengine (nudity + violence + offensive content)
 * Fails CLOSED — if moderation fails, image is rejected
 */
export async function moderateImage(buffer: Buffer): Promise<ModerationResult> {
  try {
    const form = new FormData();
    form.append('models', 'nudity-2.0,violence,offensive');
    form.append('api_user', env.SIGHTENGINE_USER);
    form.append('api_secret', env.SIGHTENGINE_SECRET);
    form.append('media', buffer, 'image.png');

    const res = await fetch('https://api.sightengine.com/1.0/check.json', {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      logger.error({ status: res.status }, 'Sightengine API error');
      return { safe: false, reason: 'Moderation service unavailable' };
    }

    const data = await res.json() as {
      status: string;
      nudity?: { raw?: number; partial?: number };
      violence?: { prob?: number };
      offensive?: { prob?: number };
    };

    if (data.status !== 'success') {
      return { safe: false, reason: 'Moderation failed' };
    }

    if ((data.nudity?.raw ?? 0) > 0.5) {
      return { safe: false, reason: 'Nudity detected' };
    }
    if ((data.nudity?.partial ?? 0) > 0.6) {
      return { safe: false, reason: 'Suggestive content detected' };
    }
    if ((data.violence?.prob ?? 0) > 0.6) {
      return { safe: false, reason: 'Violence detected' };
    }
    if ((data.offensive?.prob ?? 0) > 0.7) {
      return { safe: false, reason: 'Offensive content detected' };
    }

    return { safe: true };
  } catch (error) {
    logger.error({ error }, 'Sightengine moderation error');
    return { safe: false, reason: 'Moderation service error' };
  }
}

export function validateImageType(mimetype: string): boolean {
  return ALLOWED_TYPES.includes(mimetype);
}

/**
 * Upload image to Cloudinary with auto-optimization and responsive variants
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'voeq',
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        quality: 'auto:good',
        fetch_format: 'auto',
        flags: 'progressive',
        eager: [
          { width: 400, height: 400, crop: 'fill', gravity: 'auto', quality: 'auto:good' },
          { width: 800, height: 800, crop: 'fill', gravity: 'auto', quality: 'auto:good' },
          { width: 1200, height: 1200, crop: 'fill', gravity: 'auto', quality: 'auto:good' },
          { width: 1920, height: 1920, crop: 'limit', quality: 'auto:good' },
        ],
        eager_async: false,
      },
      (error, result) => {
        if (error || !result) {
          logger.error({ error }, 'Cloudinary upload error');
          reject(new Error('Upload to cloud storage failed'));
          return;
        }

        const publicId = result.public_id;
        const cloudName = env.CLOUDINARY_CLOUD_NAME;
        const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

        resolve({
          publicId,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          size: result.bytes,
          variants: {
            thumbnail: `${baseUrl}/c_fill,g_auto,w_200,h_200,q_auto,f_auto/${publicId}.webp`,
            small: `${baseUrl}/c_fill,g_auto,w_400,h_400,q_auto,f_auto/${publicId}.webp`,
            medium: `${baseUrl}/c_fill,g_auto,w_800,h_800,q_auto,f_auto/${publicId}.webp`,
            large: `${baseUrl}/c_limit,w_1200,q_auto,f_auto/${publicId}.webp`,
            placeholder: `${baseUrl}/e_blur:1000,q_20,w_30/${publicId}.webp`,
          },
        });
      },
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error({ error, publicId }, 'Failed to delete from Cloudinary');
  }
}
