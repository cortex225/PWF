// Extrait les contours des pays d'Afrique (Natural Earth 1:50m via world-atlas)
// et les écrit dans src/webgl/africa-outline.json. Usage : npm run map
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const world = require('world-atlas/countries-50m.json');

// Codes ISO 3166 numériques des pays du continent (+ Madagascar)
const AFRICA = new Set(
  '012 024 204 072 854 108 120 140 148 178 180 384 262 818 226 232 748 231 266 270 288 324 624 404 426 430 434 450 454 466 478 504 508 516 562 566 646 686 694 706 710 728 729 834 768 788 800 732 894 716'.split(' ')
);
const isAfrica = (f) => AFRICA.has(f.id) || ['Somaliland', 'W. Sahara'].includes(f.properties.name);

const area = (ring) => Math.abs(ring.reduce((s, [x, y], i) => { const [x2, y2] = ring[(i + 1) % ring.length]; return s + x * y2 - x2 * y; }, 0) / 2);

const countries = feature(world, world.objects.countries)
  .features.filter(isAfrica)
  .map((f) => {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const rings = polys
      .map((p) => p[0])
      .filter((r) => area(r) > 0.15) // on écarte les îlots
      .map((r) => {
        const out = [];
        for (const [lon, lat] of r) {
          const last = out[out.length - 1];
          if (!last || Math.hypot(lon - last[0], lat - last[1]) > 0.25) out.push([+lon.toFixed(2), +lat.toFixed(2)]);
        }
        return out;
      });
    return { id: f.id, rings };
  })
  .filter((c) => c.rings.length);

fs.writeFileSync('src/webgl/africa-outline.json', JSON.stringify(countries));
console.log(`✓ Afrique : ${countries.length} pays, ${countries.reduce((s, c) => s + c.rings.reduce((a, r) => a + r.length, 0), 0)} points`);
