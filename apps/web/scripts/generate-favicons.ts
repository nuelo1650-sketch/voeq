import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const PUBLIC_DIR = join(process.cwd(), 'public');
const BRAND_DIR = join(PUBLIC_DIR, 'brand');

export async function generateFavicons(): Promise<void> {
  const markSvg = await readFile(join(BRAND_DIR, 'voeq-mark.svg'));
  const markBuffer = Buffer.from(markSvg);

  const sizes = [16, 32, 48, 64, 128, 256];
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      sharp(markBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 247, g: 245, b: 240, alpha: 0 } })
        .png()
        .toBuffer(),
    ),
  );

  const icoHeader = Buffer.from([0, 0, 1, 0, sizes.length, 0]);
  const icoDirEntries: Buffer[] = [];
  let offset = 6 + sizes.length * 16;

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i]!;
    const png = pngBuffers[i]!;
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    icoDirEntries.push(entry);
  }

  const ico = Buffer.concat([icoHeader, ...icoDirEntries, ...pngBuffers]);
  await writeFile(join(PUBLIC_DIR, 'favicon.ico'), ico);

  await writeFile(join(PUBLIC_DIR, 'icon.svg'), markSvg);

  await sharp(markBuffer)
    .resize(180, 180, { fit: 'contain', background: { r: 247, g: 245, b: 240, alpha: 0 } })
    .png()
    .toFile(join(PUBLIC_DIR, 'apple-icon.png'));

  await sharp(markBuffer)
    .resize(192, 192, { fit: 'contain', background: { r: 15, g: 61, b: 46, alpha: 1 } })
    .png()
    .toFile(join(PUBLIC_DIR, 'android-chrome-192x192.png'));

  await sharp(markBuffer)
    .resize(512, 512, { fit: 'contain', background: { r: 15, g: 61, b: 46, alpha: 1 } })
    .png()
    .toFile(join(PUBLIC_DIR, 'android-chrome-512x512.png'));

  console.log('✓ Favicon variants generated');
}

generateFavicons().catch((err) => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
