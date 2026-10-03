import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
const sharp = createRequire(new URL('./qa/package.json', import.meta.url))('sharp');
const directory = new URL('./dist/assets/', import.meta.url);
await mkdir(directory, { recursive: true });
const photos = [
  ['hero', '6588379', 1000, 1200],
  ['canapes', '32192090', 700, 880],
  ['banquet', '17294729', 700, 880],
  ['intimate', '28976228', 700, 880],
];
await Promise.all(photos.map(async ([name, id, width, height]) => {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${name === 'hero' ? 1600 : 900}`;
  let input;
  if (process.argv[2]) {
    const names = { hero: 'hero-large.jpg', canapes: 'finger-large.jpg', banquet: 'banquet-large.jpg', intimate: 'celebration-large.jpg' };
    input = await readFile(join(process.argv[2], names[name]));
  } else {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${name}: ${response.status}`);
    input = Buffer.from(await response.arrayBuffer());
  }
  const buffer = await sharp(input).resize(width, height, { fit: 'cover' }).webp({ quality: 78 }).toBuffer();
  await writeFile(new URL(`${name}.webp`, directory), buffer);
  console.log(`${name}: ${buffer.length} bytes, image/webp`);
}));
const fontUrl = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400..600&family=Manrope:wght@400..700&display=swap';
const response = await fetch(fontUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' } });
if (!response.ok) throw new Error(`Fonts: ${response.status}`);
const css = await response.text();
const selected = new Map();
for (const match of css.matchAll(/\/\* (cyrillic|latin) \*\/\s*(@font-face\s*\{[^}]+\})/g)) {
  const block = match[2];
  const family = block.includes('Cormorant') ? 'cormorant' : 'manrope';
  const url = block.match(/url\(([^)]+)\)/)?.[1];
  selected.set(`${family}-${match[1]}`, url);
}
if (selected.size !== 4) throw new Error(`Expected 4 font subsets, found ${selected.size}`);
await Promise.all([...selected].map(async ([name, url]) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(new URL(`${name}.woff2`, directory), buffer);
  console.log(`${name}: ${buffer.length} bytes`);
}));
await Promise.all(['cormorantgaramond', 'manrope'].map(async family => {
  const response = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`);
  if (!response.ok) throw new Error(`License: ${family}: ${response.status}`);
  await writeFile(new URL(`${family}-OFL.txt`, directory), await response.text());
}));
