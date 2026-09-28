// Extrait le contour officiel de la Côte d'Ivoire (Natural Earth 1:10m via world-atlas)
// et l'écrit dans src/webgl/civ-outline.json. Usage : npm run map
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const world = require('world-atlas/countries-10m.json');
const civ = feature(world, world.objects.countries).features.find((f) => f.id === '384');

// Plus grand polygone = territoire continental
const rings = civ.geometry.coordinates.map((poly) => poly[0]).sort((a, b) => b.length - a.length);
const main = rings[0];

// Décimation légère : on garde un point tous les ~1,5 km
const out = [];
for (const [lon, lat] of main) {
  const last = out[out.length - 1];
  if (!last || Math.hypot(lon - last[0], lat - last[1]) > 0.014) out.push([+lon.toFixed(4), +lat.toFixed(4)]);
}
fs.writeFileSync('src/webgl/civ-outline.json', JSON.stringify(out));
console.log(`✓ contour : ${main.length} → ${out.length} points`);
