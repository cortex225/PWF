// Générateurs procéduraux de nuages de points.
// Chaque fonction remplit `pos` (Float32Array xyz) et `col` (Float32Array rgb) pour `n` particules.

import { Color } from 'three';
// Contour réel (Natural Earth 1:10m) — généré par `npm run map`
import CIV_OUTLINE from './civ-outline.json';
// Pays d'Afrique (Natural Earth 1:50m) — généré par `npm run map`
import AFRICA from './africa-outline.json';

const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;

export const PALETTE = {
  orange: new Color('#F77F00'),
  white: new Color('#FFF6E8'),
  green: new Color('#00A65A'),
  gold: new Color('#E8B04B'),
  amber: new Color('#FF9E3D'),
  cocoa: new Color('#7A2E12'),
  pod: new Color('#E0781C'),
  podLight: new Color('#F7C548'),
  sea: new Color('#0E7C86'),
  seaLight: new Color('#6FE3E1'),
  foam: new Color('#F4FFFD'),
  land: new Color('#8A6A4A'),
  roast: new Color('#4A2A17'),
  caramel: new Color('#B8743A'),
  cherry: new Color('#C0392B'),
};

const tmp = new Color();
const setCol = (col, i, c) => {
  col[i * 3] = c.r;
  col[i * 3 + 1] = c.g;
  col[i * 3 + 2] = c.b;
};
const setPos = (pos, i, x, y, z) => {
  pos[i * 3] = x;
  pos[i * 3 + 1] = y;
  pos[i * 3 + 2] = z;
};

/* ------------------------------------------------------------------ */
/* Carte de la Côte d'Ivoire (contour stylisé, lon/lat)                */
/* ------------------------------------------------------------------ */

export const CITIES = [
  { id: 'abidjan', name: 'Abidjan', lon: -4.02, lat: 5.35 },
  { id: 'yamoussoukro', name: 'Yamoussoukro', lon: -5.28, lat: 6.82 },
  { id: 'bouake', name: 'Bouaké', lon: -5.03, lat: 7.69 },
  { id: 'korhogo', name: 'Korhogo', lon: -5.63, lat: 9.46 },
  { id: 'man', name: 'Man', lon: -7.55, lat: 7.41 },
  { id: 'sanpedro', name: 'San-Pédro', lon: -6.64, lat: 4.75 },
  { id: 'bassam', name: 'Grand-Bassam', lon: -3.74, lat: 5.21, dy: -10 },
  { id: 'assinie', name: 'Assinie', lon: -3.3, lat: 5.14, dy: 14 },
  { id: 'sassandra', name: 'Sassandra', lon: -6.09, lat: 4.98 },
  { id: 'kong', name: 'Kong', lon: -4.61, lat: 9.15 },
  { id: 'comoe', name: 'Parc de la Comoé', lon: -3.8, lat: 8.75 },
  { id: 'tai', name: 'Parc de Taï', lon: -7.15, lat: 5.75 },
];

const MAP_K = 0.92;
const MAP_CX = -5.56;
const MAP_CY = 7.53;
export const lonLatToLocal = (lon, lat) => [(lon - MAP_CX) * MAP_K, (lat - MAP_CY) * MAP_K];

const OUTLINE_LOCAL = CIV_OUTLINE.map(([lon, lat]) => lonLatToLocal(lon, lat));

function insidePolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const perimeter = (() => {
  const segs = [];
  let total = 0;
  for (let i = 0; i < OUTLINE_LOCAL.length; i++) {
    const a = OUTLINE_LOCAL[i];
    const b = OUTLINE_LOCAL[(i + 1) % OUTLINE_LOCAL.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push({ a, b, len, start: total });
    total += len;
  }
  return { segs, total };
})();

function pointOnOutline(t) {
  const d = t * perimeter.total;
  const s = perimeter.segs.find((sg) => d >= sg.start && d <= sg.start + sg.len) || perimeter.segs[0];
  const k = (d - s.start) / s.len;
  return [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k];
}

function flagColor(x) {
  // Drapeau : orange (ouest) · blanc · vert (est)
  const minX = (-8.62 - MAP_CX) * MAP_K;
  const maxX = (-2.51 - MAP_CX) * MAP_K;
  const t = (x - minX) / (maxX - minX);
  if (t < 0.36) return PALETTE.orange;
  if (t < 0.64) return PALETTE.white;
  return PALETTE.green;
}

// Relief stylisé : montagnes de l'Ouest (Man, Nimba), plateaux du Nord
function relief(x, y) {
  const bump = (lon, lat, h, r) => {
    const [cx, cy] = lonLatToLocal(lon, lat);
    return h * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (r * r));
  };
  return bump(-7.6, 7.5, 0.34, 0.75) + bump(-8.45, 7.65, 0.3, 0.35) + bump(-5.6, 9.4, 0.12, 1.1) + bump(-4.4, 8.6, 0.08, 1.2);
}

export function mapShape(pos, col, n) {
  const cityPts = Math.floor(n * 0.05);
  const edgePts = Math.floor(n * 0.22);
  let i = 0;
  // Contour lumineux (suivi précis de la frontière)
  for (; i < edgePts; i++) {
    const [x, y] = pointOnOutline(Math.random());
    setPos(pos, i, x + rand(-0.008, 0.008), y + rand(-0.008, 0.008), relief(x, y) + rand(-0.02, 0.02));
    tmp.copy(flagColor(x)).lerp(PALETTE.white, 0.3);
    setCol(col, i, tmp);
  }
  // Villes (amas brillants)
  for (let c = 0; i < edgePts + cityPts; i++, c++) {
    const city = CITIES[c % CITIES.length];
    const [cx, cy] = lonLatToLocal(city.lon, city.lat);
    const r = Math.pow(Math.random(), 2) * 0.07;
    const a = rand(0, TAU);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    setPos(pos, i, x, y, relief(x, y) + rand(0.04, 0.2));
    setCol(col, i, PALETTE.gold);
  }
  // Remplissage régulier (grille décalée) pour une densité homogène
  const fill = n - i;
  const [minX, maxX, minY, maxY] = OUTLINE_LOCAL.reduce(
    (b, [x, y]) => [Math.min(b[0], x), Math.max(b[1], x), Math.min(b[2], y), Math.max(b[3], y)],
    [Infinity, -Infinity, Infinity, -Infinity]
  );
  const cells = [];
  let step = Math.sqrt(((maxX - minX) * (maxY - minY) * 0.62) / fill);
  for (let tries = 0; tries < 6; tries++) {
    cells.length = 0;
    for (let y = minY; y < maxY; y += step) for (let x = minX; x < maxX; x += step) if (insidePolygon(x, y, OUTLINE_LOCAL)) cells.push([x, y]);
    if (cells.length >= fill) break;
    step *= 0.92;
  }
  for (let k = cells.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [cells[k], cells[j]] = [cells[j], cells[k]];
  }
  for (let k = 0; i < n; i++, k++) {
    const [gx, gy] = cells[k % cells.length];
    const x = gx + rand(-step, step) * 0.45;
    const y = gy + rand(-step, step) * 0.45;
    const h = relief(x, y);
    setPos(pos, i, x, y, h + rand(-0.03, 0.03));
    tmp.copy(flagColor(x)).multiplyScalar(0.4 + h * 1.2 + rand(0, 0.3));
    setCol(col, i, tmp);
  }
}

/* ------------------------------------------------------------------ */
/* L'Afrique, avec la Côte d'Ivoire allumée aux couleurs du drapeau    */
/* ------------------------------------------------------------------ */
const AF_K = 0.09;
const AF_CX = 17;
const AF_CY = 2;
export const africaToLocal = (lon, lat) => [(lon - AF_CX) * AF_K, (lat - AF_CY) * AF_K];

const AF_RINGS = AFRICA.filter((c) => c.id !== '384').flatMap((c) => c.rings.map((r) => r.map(([lon, lat]) => africaToLocal(lon, lat))));
const AF_CIV = CIV_OUTLINE.map(([lon, lat]) => africaToLocal(lon, lat));
const bbox = (ring) => ring.reduce((b, [x, y]) => [Math.min(b[0], x), Math.max(b[1], x), Math.min(b[2], y), Math.max(b[3], y)], [Infinity, -Infinity, Infinity, -Infinity]);
const AF_BOXES = AF_RINGS.map(bbox);
const inAfrica = (x, y) => AF_RINGS.some((r, k) => {
  const [a, b, c, d] = AF_BOXES[k];
  return x >= a && x <= b && y >= c && y <= d && insidePolygon(x, y, r);
});

// Un point au hasard sur un ensemble de contours, proportionnellement à leur longueur
function outlineSampler(rings) {
  const segs = [];
  let total = 0;
  for (const r of rings)
    for (let i = 0; i < r.length; i++) {
      const a = r[i];
      const b = r[(i + 1) % r.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      segs.push({ a, b, start: total, len });
      total += len;
    }
  return () => {
    const d = Math.random() * total;
    let lo = 0;
    let hi = segs.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (segs[mid].start <= d) lo = mid;
      else hi = mid - 1;
    }
    const s = segs[lo];
    const k = s.len ? (d - s.start) / s.len : 0;
    return [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k];
  };
}

export function africaShape(pos, col, n) {
  const borders = outlineSampler(AF_RINGS);
  const civEdge = outlineSampler([AF_CIV]);
  const [cMinX, cMaxX, cMinY, cMaxY] = bbox(AF_CIV);
  const civFlag = (x) => {
    const t = (x - cMinX) / (cMaxX - cMinX);
    return t < 0.36 ? PALETTE.orange : t < 0.64 ? PALETTE.white : PALETTE.green;
  };
  const nBorder = Math.floor(n * 0.16);
  const nCivEdge = Math.floor(n * 0.06);
  const nCiv = Math.floor(n * 0.16);
  const nRing = Math.floor(n * 0.04);
  let i = 0;
  // Frontières des pays, discrètes
  for (; i < nBorder; i++) {
    const [x, y] = borders();
    setPos(pos, i, x + rand(-0.01, 0.01), y + rand(-0.01, 0.01), rand(-0.02, 0.02));
    tmp.copy(PALETTE.gold).multiplyScalar(rand(0.55, 0.85));
    setCol(col, i, tmp);
  }
  // Côte d'Ivoire : contour vif, légèrement soulevé
  for (let k = 0; k < nCivEdge; k++, i++) {
    const [x, y] = civEdge();
    setPos(pos, i, x, y, 0.12 + rand(-0.01, 0.01));
    tmp.copy(civFlag(x)).lerp(PALETTE.white, 0.25);
    setCol(col, i, tmp);
  }
  // Côte d'Ivoire : remplissage dense
  for (let k = 0; k < nCiv; ) {
    const x = rand(cMinX, cMaxX);
    const y = rand(cMinY, cMaxY);
    if (!insidePolygon(x, y, AF_CIV)) continue;
    setPos(pos, i, x, y, 0.1 + rand(-0.03, 0.03));
    tmp.copy(civFlag(x)).multiplyScalar(rand(0.75, 1.15));
    setCol(col, i, tmp);
    k++;
    i++;
  }
  // Halo autour du pays
  const [ccx, ccy] = africaToLocal(-5.55, 7.55);
  for (let k = 0; k < nRing; k++, i++) {
    const a = rand(0, TAU);
    const r = 0.62 + rand(-0.015, 0.015);
    setPos(pos, i, ccx + Math.cos(a) * r, ccy + Math.sin(a) * r, 0.1);
    setCol(col, i, PALETTE.gold);
  }
  // Le reste du continent, en pointillés sourds
  const [minX, maxX, minY, maxY] = AF_BOXES.reduce((b, c) => [Math.min(b[0], c[0]), Math.max(b[1], c[1]), Math.min(b[2], c[2]), Math.max(b[3], c[3])], [Infinity, -Infinity, Infinity, -Infinity]);
  while (i < n) {
    const x = rand(minX, maxX);
    const y = rand(minY, maxY);
    if (!inAfrica(x, y)) continue;
    setPos(pos, i, x, y, rand(-0.03, 0.03));
    tmp.copy(PALETTE.land).lerp(PALETTE.gold, rand(0.1, 0.45)).multiplyScalar(rand(0.5, 0.8));
    setCol(col, i, tmp);
    i++;
  }
}

/* ------------------------------------------------------------------ */
/* Grain de café : face bombée, face plate et sillon en S, cerises     */
/* ------------------------------------------------------------------ */
export function coffeeShape(pos, col, n) {
  const A = 1.05; // demi-largeur
  const L = 1.6; // demi-longueur
  const C = 0.75; // épaisseur
  const cherries = Math.floor(n * 0.12);
  for (let i = 0; i < n; i++) {
    let x, y, z;
    if (i < n - cherries) {
      const u = rand(0, TAU);
      const v = Math.acos(rand(-1, 1));
      x = A * Math.sin(v) * Math.cos(u);
      y = L * Math.cos(v);
      z = C * Math.sin(v) * Math.sin(u);
      const flat = z > 0;
      if (flat) z *= 0.35; // face plate vers la caméra
      // Sillon en S au milieu de la face plate
      const s = 0.14 * Math.sin((y / L) * Math.PI * 1.2);
      const d = Math.abs(x - s);
      const inCrease = flat && d < 0.09 && Math.abs(y) < L * 0.88;
      if (inCrease) z -= 0.22 * (1 - d / 0.09);
      const light = 0.5 + 0.5 * (x / A) * 0.6 + (flat ? 0.15 : 0);
      tmp.copy(PALETTE.roast).lerp(PALETTE.caramel, Math.max(0, Math.min(1, light)));
      if (inCrease) tmp.copy(PALETTE.roast).multiplyScalar(0.55);
    } else {
      // Cerises de café en orbite
      const b = i % 14;
      const a = (b / 14) * TAU;
      const rr = 2.2 + (b % 3) * 0.22;
      const u = rand(0, TAU);
      const v = Math.acos(rand(-1, 1));
      x = rr * Math.cos(a) + 0.15 * Math.sin(v) * Math.cos(u);
      y = Math.sin(a * 2) * 0.7 + 0.15 * Math.cos(v);
      z = rr * Math.sin(a) + 0.15 * Math.sin(v) * Math.sin(u);
      tmp.copy(PALETTE.cherry).lerp(PALETTE.orange, rand(0, 0.35));
    }
    setPos(pos, i, x, y, z);
    tmp.multiplyScalar(rand(0.75, 1.1));
    setCol(col, i, tmp);
  }
}

/* ------------------------------------------------------------------ */
/* Basilique Notre-Dame de la Paix (dôme, tambour, colonnade)          */
/* ------------------------------------------------------------------ */
export function basilicaShape(pos, col, n) {
  const S = 0.95;
  for (let i = 0; i < n; i++) {
    const r = Math.random();
    let x, y, z;
    let c = PALETTE.white;
    if (r < 0.3) {
      // Dôme (hémisphère légèrement surélevé)
      const u = rand(0, TAU);
      const v = Math.acos(rand(0, 1));
      const R = 1.25;
      x = R * Math.sin(v) * Math.cos(u);
      z = R * Math.sin(v) * Math.sin(u);
      y = 1.25 + R * 1.08 * Math.cos(v);
      // nervures du dôme
      if (Math.abs(Math.sin(u * 16)) > 0.93) c = PALETTE.gold;
    } else if (r < 0.45) {
      // Tambour à colonnes
      const u = rand(0, TAU);
      x = 1.3 * Math.cos(u);
      z = 1.3 * Math.sin(u);
      y = rand(0.35, 1.25);
      c = Math.abs(Math.sin(u * 18)) > 0.8 ? PALETTE.white : PALETTE.gold;
    } else if (r < 0.5) {
      // Lanternon + croix
      const k = Math.random();
      if (k < 0.6) {
        const u = rand(0, TAU);
        x = 0.22 * Math.cos(u);
        z = 0.22 * Math.sin(u);
        y = rand(2.6, 3.0);
      } else if (k < 0.85) {
        x = rand(-0.02, 0.02);
        z = rand(-0.02, 0.02);
        y = rand(3.0, 3.5);
      } else {
        x = rand(-0.14, 0.14);
        z = rand(-0.02, 0.02);
        y = rand(3.3, 3.34);
      }
      c = PALETTE.gold;
    } else if (r < 0.62) {
      // Corps principal (base carrée)
      const face = Math.floor(rand(0, 4));
      const t = rand(-1.6, 1.6);
      const h = rand(-0.6, 0.35);
      const e = 1.6;
      [x, z] = face === 0 ? [t, e] : face === 1 ? [t, -e] : face === 2 ? [e, t] : [-e, t];
      y = h;
    } else if (r < 0.88) {
      // Colonnade en arc (deux bras enveloppant le parvis)
      const col_ = Math.floor(rand(0, 56));
      const side = col_ % 2 === 0 ? 1 : -1;
      const a = Math.PI / 2 + side * (0.35 + (col_ / 56) * 1.25);
      const ring = Math.random() < 0.5 ? 3.2 : 3.45;
      x = ring * Math.cos(a) + rand(-0.03, 0.03);
      z = ring * Math.sin(a) * 0.9 + 0.4 + rand(-0.03, 0.03);
      y = rand(-0.6, 0.15);
      if (Math.random() < 0.15) y = 0.15 + rand(0, 0.06); // entablement
    } else {
      // Parvis
      const a = rand(0, TAU);
      const rr = Math.sqrt(Math.random()) * 3.6;
      x = rr * Math.cos(a);
      z = rr * Math.sin(a) * 0.9 + 0.4;
      y = -0.62;
      c = PALETTE.green;
    }
    setPos(pos, i, x * S, (y - 1.0) * S, z * S);
    tmp.copy(c).multiplyScalar(rand(0.6, 1));
    setCol(col, i, tmp);
  }
}

/* ------------------------------------------------------------------ */
/* Cabosse de cacao + fèves                                            */
/* ------------------------------------------------------------------ */
export function cocoaShape(pos, col, n) {
  const L = 3.9;
  const beans = Math.floor(n * 0.14);
  for (let i = 0; i < n; i++) {
    let x, y, z;
    if (i < n - beans) {
      const t = Math.random();
      const u = rand(0, TAU);
      const profile = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.85)), 0.7);
      const ridge = 1 + 0.16 * Math.pow(Math.abs(Math.cos(u * 5)), 4);
      const R = 0.82 * profile * ridge;
      x = R * Math.cos(u);
      z = R * Math.sin(u);
      y = (t - 0.5) * L;
      // courbure légère de la pointe
      x += Math.pow(Math.max(0, t - 0.7), 2) * 1.6;
      const onRidge = Math.abs(Math.cos(u * 5)) > 0.92;
      const k = 0.25 + t * 0.55 + (onRidge ? 0.35 : 0);
      tmp.copy(PALETTE.cocoa).lerp(PALETTE.pod, Math.min(1, k)).lerp(PALETTE.podLight, Math.max(0, k - 0.7) * 2);
      if (!onRidge) tmp.multiplyScalar(0.55);
    } else {
      // Fèves en orbite
      const b = i % 18;
      const a = (b / 18) * TAU;
      const rr = 2.1 + (b % 3) * 0.25;
      const cx = rr * Math.cos(a);
      const cz = rr * Math.sin(a);
      const cy = Math.sin(a * 3) * 0.6;
      const u = rand(0, TAU);
      const v = Math.acos(rand(-1, 1));
      x = cx + 0.1 * Math.sin(v) * Math.cos(u);
      y = cy + 0.17 * Math.cos(v);
      z = cz + 0.1 * Math.sin(v) * Math.sin(u);
      tmp.copy(PALETTE.cocoa).lerp(PALETTE.amber, rand(0.1, 0.4));
    }
    setPos(pos, i, x, y, z);
    tmp.multiplyScalar(rand(0.7, 1.1));
    setCol(col, i, tmp);
  }
}

/* ------------------------------------------------------------------ */
/* Masque (inspiré des masques gouro / baoulé)                         */
/* ------------------------------------------------------------------ */
export function maskShape(pos, col, n) {
  const A = 1.05;
  const B = 1.7;
  const inHole = (x, y) => {
    const eye = (ex) => ((x - ex) / 0.3) ** 2 + ((y - 0.3) / 0.075) ** 2 < 1;
    const mouth = (x / 0.2) ** 2 + ((y + 0.95) / 0.1) ** 2 < 1;
    return eye(0.4) || eye(-0.4) || mouth;
  };
  for (let i = 0; i < n; i++) {
    const r = Math.random();
    let x, y, z;
    let c = PALETTE.amber;
    if (r < 0.8) {
      // Visage : demi-ellipsoïde allongé, menton pointu
      do {
        x = rand(-A, A);
        y = rand(-B, B);
      } while ((x / (A * (y < 0 ? 1 + y / (B * 1.6) : 1))) ** 2 + (y / B) ** 2 > 1 || inHole(x, y));
      const w = A * (y < 0 ? 1 + y / (B * 1.6) : 1);
      z = 0.75 * Math.sqrt(Math.max(0, 1 - (x / w) ** 2 - (y / B) ** 2));
      // arête du nez
      z += 0.35 * Math.exp(-((x / 0.09) ** 2)) * Math.exp(-(((y + 0.25) / 0.38) ** 2));
      // front bombé, arcades
      z += 0.08 * Math.exp(-(((y - 0.55) / 0.12) ** 2));
      const shade = 0.45 + 0.55 * (z / 1.1);
      tmp.copy(PALETTE.cocoa).lerp(PALETTE.amber, shade);
      // scarifications (lignes sur les joues)
      if (Math.abs(x) > 0.45 && Math.abs(x) < 0.75 && Math.abs(Math.sin(y * 28)) > 0.9 && y < 0.1 && y > -0.6) tmp.copy(PALETTE.gold);
      c = tmp.clone();
    } else if (r < 0.95) {
      // Cornes / coiffe recourbée
      const side = Math.random() < 0.5 ? -1 : 1;
      const t = Math.random();
      const a = t * Math.PI * 0.95;
      const rr = 0.55;
      x = side * (0.35 + rr - rr * Math.cos(a) * 0.9);
      y = B * 0.85 + rr * Math.sin(a) * 1.6;
      z = 0.2 - t * 0.3 + rand(-0.05, 0.05);
      x += rand(-0.05, 0.05) * (1 - t);
      c = PALETTE.gold;
    } else {
      // Contour des yeux et de la bouche (lumineux)
      const k = Math.random();
      const a = rand(0, TAU);
      if (k < 0.7) {
        const ex = Math.random() < 0.5 ? 0.4 : -0.4;
        x = ex + 0.31 * Math.cos(a);
        y = 0.3 + 0.085 * Math.sin(a);
      } else {
        x = 0.21 * Math.cos(a);
        y = -0.95 + 0.11 * Math.sin(a);
      }
      z = 0.62;
      c = PALETTE.white;
    }
    setPos(pos, i, x, y - 0.2, z - 0.3);
    tmp.copy(c).multiplyScalar(rand(0.75, 1.05));
    setCol(col, i, tmp);
  }
}

/* ------------------------------------------------------------------ */
/* Océan (golfe de Guinée) — la houle est animée dans le shader         */
/* ------------------------------------------------------------------ */
export function oceanShape(pos, col, n) {
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) {
    const gx = (i % side) / side;
    const gz = Math.floor(i / side) / side;
    const x = (gx - 0.5) * 16 + rand(-0.02, 0.02);
    const z = -9 + gz * 12;
    setPos(pos, i, x, -1.6, z);
    const depth = gz;
    tmp.copy(PALETTE.sea).lerp(PALETTE.seaLight, depth * 0.8);
    if (Math.random() < 0.05) tmp.copy(PALETTE.foam);
    if (depth > 0.4 && Math.random() < 0.05) tmp.copy(PALETTE.gold);
    tmp.multiplyScalar(rand(0.55, 1));
    setCol(col, i, tmp);
  }
}

/* ------------------------------------------------------------------ */
/* Poussière d'or (transitions)                                         */
/* ------------------------------------------------------------------ */
export function dustShape(pos, col, n) {
  for (let i = 0; i < n; i++) {
    const u = rand(0, TAU);
    const v = Math.acos(rand(-1, 1));
    const r = rand(3.5, 11);
    setPos(pos, i, r * Math.sin(v) * Math.cos(u), r * Math.cos(v) * 0.7, r * Math.sin(v) * Math.sin(u) - 2);
    tmp.copy(Math.random() < 0.7 ? PALETTE.gold : PALETTE.orange).multiplyScalar(rand(0.25, 0.7));
    setCol(col, i, tmp);
  }
}

/* ------------------------------------------------------------------ */
/* Disque vinyle (section musique) : sillons, reflet, étiquette drapeau */
/* ------------------------------------------------------------------ */
export function vinylShape(pos, col, n) {
  const R = 2.6;
  const labelR = 0.85;
  const vinyl = new Color('#6a5446');
  const groove = new Color('#b89a80');
  for (let i = 0; i < n; i++) {
    const a = rand(0, TAU);
    let r;
    if (i < n * 0.18) {
      // étiquette centrale aux couleurs du drapeau
      r = Math.sqrt(Math.random()) * labelR;
      const x = r * Math.cos(a);
      tmp.copy(r < 0.09 ? PALETTE.gold : x < -labelR / 3 ? PALETTE.orange : x > labelR / 3 ? PALETTE.green : PALETTE.white);
    } else if (i < n * 0.24) {
      // bord du disque, bien net
      r = R + rand(-0.015, 0.015);
      tmp.copy(PALETTE.gold);
    } else {
      // sillons : des anneaux fins et réguliers
      r = labelR + 0.12 + Math.random() * (R - labelR - 0.14);
      r = Math.round(r * 16) / 16 + rand(-0.008, 0.008);
      tmp.copy(Math.round(r * 16) % 3 === 0 ? groove : vinyl);
      // reflet de lumière en diagonale
      const sheen = Math.pow(Math.max(0, Math.cos(a * 2 - 0.8)), 10);
      tmp.lerp(PALETTE.gold, sheen * 0.9);
    }
    // disque à plat, il tourne comme sur une platine
    setPos(pos, i, r * Math.cos(a), rand(-0.015, 0.015), r * Math.sin(a));
    tmp.multiplyScalar(rand(0.85, 1.1));
    setCol(col, i, tmp);
  }
}

/* ------------------------------------------------------------------ */
/* Ballon de football (section CAN) : 12 pentagones aux sommets d'un    */
/* icosaèdre, coutures entre les panneaux                               */
/* ------------------------------------------------------------------ */
export function ballShape(pos, col, n) {
  const R = 1.9;
  const phi = (1 + Math.sqrt(5)) / 2;
  const verts = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ].map(([x, y, z]) => {
    const l = Math.hypot(x, y, z);
    return [x / l, y / l, z / l];
  });
  const classify = (p) => {
    let best = -1;
    let second = -1;
    for (const v of verts) {
      const d = v[0] * p[0] + v[1] * p[1] + v[2] * p[2];
      if (d > best) {
        second = best;
        best = d;
      } else if (d > second) second = d;
    }
    if (best > 0.945) return 'penta';
    if (best - second < 0.018) return 'seam';
    return 'panel';
  };
  // proportions visées : pentagones pleins, coutures fines, panneaux clairsemés
  const quota = { penta: 0.5, seam: 0.3, panel: 0.2 };
  for (let i = 0; i < n; i++) {
    const want = Math.random() < quota.penta ? 'penta' : Math.random() < quota.seam / (1 - quota.penta) ? 'seam' : 'panel';
    let p;
    let kind;
    let guard = 0;
    do {
      const u = rand(-1, 1);
      const a = rand(0, TAU);
      const sq = Math.sqrt(1 - u * u);
      p = [sq * Math.cos(a), u, sq * Math.sin(a)];
      kind = classify(p);
    } while (kind !== want && ++guard < 60);
    setPos(pos, i, p[0] * R, p[1] * R, p[2] * R);
    if (kind === 'penta') tmp.copy(PALETTE.orange).multiplyScalar(rand(0.85, 1.05));
    else if (kind === 'seam') tmp.copy(PALETTE.white).multiplyScalar(0.9);
    else tmp.copy(PALETTE.white).multiplyScalar(rand(0.15, 0.3));
    setCol(col, i, tmp);
  }
}
