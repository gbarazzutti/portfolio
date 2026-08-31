// Renders public/favicon.svg -> public/favicon.ico (16+32) and
// public/apple-touch-icon.png (180x180, opaque). Run once; outputs are
// committed. Re-run after editing favicon.svg:  node scripts/make-icons.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const svgPath = fileURLToPath(new URL('../public/favicon.svg', import.meta.url));
const icoPath = fileURLToPath(new URL('../public/favicon.ico', import.meta.url));
const applePath = fileURLToPath(new URL('../public/apple-touch-icon.png', import.meta.url));

const svg = await readFile(svgPath);

const png = (size) =>
  sharp(svg, { density: 384 }).resize(size, size, { fit: 'contain' }).png().toBuffer();

const ico = await pngToIco([await png(16), await png(32)]);
await writeFile(icoPath, ico);
console.log(`wrote ${icoPath}`);

// apple-touch-icon: iOS ignores alpha, so flatten onto the accent tile colour.
await sharp(svg, { density: 384 })
  .resize(180, 180, { fit: 'contain' })
  .flatten({ background: '#1D4ED8' })
  .png()
  .toFile(applePath);
console.log(`wrote ${applePath}`);
