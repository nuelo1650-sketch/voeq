import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { cloudinary } from '../config/cloudinary';
import { logger } from '../config/logger';
import { env } from '../config/env';

const execAsync = promisify(exec);

export async function createBackup(): Promise<{ url: string; size: number; timestamp: Date }> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `voeq-backup-${timestamp}.sql`;

  try {
    const { stdout } = await execAsync(
      `pg_dump "${env.DATABASE_URL}" --no-owner --no-acl --clean`,
      { maxBuffer: 100 * 1024 * 1024 },
    );

    const buffer = Buffer.from(stdout, 'utf-8');

    const result = await cloudinary.uploader.upload(
      `data:text/plain;base64,${buffer.toString('base64')}`,
      {
        folder: env.BACKUP_CLOUDINARY_FOLDER,
        public_id: filename.replace('.sql', ''),
        resource_type: 'raw',
        type: 'private',
      },
    );

    await cleanupOldBackups();

    return {
      url: result.secure_url,
      size: buffer.length,
      timestamp: new Date(),
    };
  } catch (error) {
    logger.error({ error }, 'Backup failed');
    throw error;
  }
}

async function cleanupOldBackups(): Promise<void> {
  try {
    const result = await cloudinary.api.resources({
      type: 'private',
      resource_type: 'raw',
      prefix: env.BACKUP_CLOUDINARY_FOLDER,
      max_results: 100,
    });

    const retentionMs = env.BACKUP_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const now = Date.now();

    for (const resource of result.resources) {
      const age = now - new Date(resource.created_at).getTime();
      if (age > retentionMs) {
        await cloudinary.uploader.destroy(resource.public_id, {
          resource_type: 'raw',
          type: 'private',
        });
      }
    }
  } catch (error) {
    logger.error({ error }, 'Cleanup failed');
  }
}
