// Renders scripts/og.svg -> public/og.png (1200x630). Run once; the PNG is
// committed. Re-run after editing og.svg:  node scripts/make-og.mjs
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const src = fileURLToPath(new URL('./og.svg', import.meta.url));
const out = fileURLToPath(new URL('../public/og.png', import.meta.url));

const svg = await readFile(src);

await sharp(svg, { density: 144 })
  .resize(1200, 630, { fit: 'cover' })
  .flatten({ background: '#1D4ED8' })
  .png()
  .toFile(out);

console.log(`wrote ${out}`);
