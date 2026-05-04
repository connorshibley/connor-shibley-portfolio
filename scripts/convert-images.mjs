import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const TARGETS = [
  'public/headshot.png',
  'public/projects/web-design',
  'public/projects/cst-dashboard',
  'public/projects/linkedin-analytics',
  'public/projects/hws-literacy',
  'public/projects/weekly-digest',
  'public/projects/ai-bootcamp',
];

async function* walk(p) {
  const s = await stat(p);
  if (s.isFile()) { yield p; return; }
  for (const ent of await readdir(p, { withFileTypes: true })) {
    const sub = path.join(p, ent.name);
    if (ent.isDirectory()) { yield* walk(sub); }
    else if (ent.isFile()) { yield sub; }
  }
}

const isConvertible = (f) => /\.(png|jpe?g)$/i.test(f);

let saved = 0;
for (const t of TARGETS) {
  try {
    for await (const f of walk(t)) {
      if (!isConvertible(f)) continue;
      const out = f.replace(/\.(png|jpe?g)$/i, '.webp');
      const before = (await stat(f)).size;
      await sharp(f).webp({ quality: 82 }).toFile(out);
      const after = (await stat(out)).size;
      saved += before - after;
      console.log(`${f}  ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`);
    }
  } catch (e) {
    console.error(`skip ${t}: ${e.message}`);
  }
}
console.log(`\nTotal saved: ${(saved/1024/1024).toFixed(2)} MB`);
