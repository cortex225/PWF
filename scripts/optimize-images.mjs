// Génère des versions WebP optimisées des photos locales dans public/media/
// Usage : npm run images
import sharp from 'sharp';
import fs from 'node:fs';

const SOURCES = {
  'basilique-avenue': 'img/histoire_final.jpg',
  'basilique': 'img/place/basilique.jpg',
  'cathedrale': 'img/place/cathedraleStPaul.jpg',
  'plage': 'img/place/Beach.jpg',
  'coucher-palmiers': 'img/place/CleanShot 2026-01-10 at 20.28.34@2x.png',
  'foret': 'img/nature_final.jpg',
  'masque': 'img/art_final.jpg',
  'danse-masque': 'img/cover.jpg',
  'alloco': 'img/food/alloco.JPG',
  'garba': 'img/food/garba.jpg',
  'foutou': 'img/food/foutou.jpg',
  'placali': 'img/food/placali.jpg',
  'gnamankoudji': 'img/food/gnamankoudji.jpg',
  'brochettes': 'img/food/Screenshot_20190209-103610.png',
  'grillade': 'img/food/Screenshot_20190209-103438.png',
  'marche': 'img/Art/Screenshot_20190212-203025.png',
  'gbofloto': 'img/food/Screenshot_20190209-103648.png',
};

fs.mkdirSync('public/media', { recursive: true });
for (const [name, src] of Object.entries(SOURCES)) {
  for (const [suffix, width] of [['', 2400], ['-sm', 900]]) {
    const out = `public/media/${name}${suffix}.webp`;
    await sharp(src).rotate().resize({ width, height: width, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  }
  console.log('✓', name);
}
