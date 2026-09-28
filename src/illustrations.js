// Illustrations au trait (SVG) des monuments sans photo libre de droits vérifiée.
// viewBox 400×300, sol à y=260. Le trait prend la couleur `currentColor`.

const wrap = (inner) =>
  `<svg class="illu" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <defs>
      <linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".25"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient>
    </defs>
    ${inner}
    <path d="M0 260 H400" opacity=".5"/>
    <path d="M20 272 H120 M150 272 H300 M320 272 H390" opacity=".25"/>
    <path d="M40 284 H90 M200 284 H260 M300 284 H340" opacity=".15"/>
  </svg>`;

const range = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');

export const ILLUSTRATIONS = {
  // Tour F : fût effilé façon masque, flèche
  tourF: wrap(`
    <path d="M200 8 V40" />
    <path d="M186 260 L180 120 Q178 80 200 42 Q222 80 220 120 L214 260 Z" fill="url(#w)"/>
    <path d="M200 42 V260" opacity=".6"/>
    ${range(18, (i) => `<path d="M${182 + i * 0.15} ${128 + i * 7} H${218 - i * 0.15}" opacity=".35"/>`)}
    <path d="M190 100 Q200 88 210 100" opacity=".7"/>
    <path d="M120 260 V190 H150 V260 M250 260 V170 H285 V260 M60 260 V215 H95 V260 M310 260 V205 H340 V260" opacity=".45"/>
  `),
  // Pont à haubans (pont Alassane Ouattara)
  haubans: wrap(`
    <path d="M200 60 L188 230 M200 60 L212 230" />
    <path d="M186 232 H214" />
    ${range(9, (i) => `<path d="M200 ${70 + i * 8} L${40 + i * 16} 228" opacity=".55"/>`)}
    ${range(9, (i) => `<path d="M200 ${70 + i * 8} L${360 - i * 16} 228" opacity=".55"/>`)}
    <path d="M0 228 H400 M0 236 H400" />
    ${range(6, (i) => `<path d="M${30 + i * 70} 236 V260" opacity=".5"/>`)}
    <path d="M0 250 Q50 244 100 250 T200 250 T300 250 T400 250" opacity=".3"/>
  `),
  // Pont à poutres sur la lagune
  pont: wrap(`
    <path d="M0 200 H400 M0 210 H400" />
    ${range(8, (i) => `<path d="M${25 + i * 50} 210 V260 M${35 + i * 50} 210 V260" opacity=".6"/>`)}
    ${range(7, (i) => `<path d="M${35 + i * 50} 212 Q${50 + i * 50} 232 ${75 + i * 50} 212" opacity=".35"/>`)}
    <path d="M0 246 Q50 240 100 246 T200 246 T300 246 T400 246" opacity=".3"/>
    <path d="M300 200 V120 H330 V200 M340 200 V90 H365 V200 M40 200 V150 H70 V200" opacity=".4"/>
  `),
  // Stade olympique d'Ebimpé
  stade: wrap(`
    <ellipse cx="200" cy="200" rx="170" ry="48" />
    <ellipse cx="200" cy="208" rx="120" ry="28" fill="url(#w)"/>
    <path d="M30 200 V240 Q200 290 370 240 V200" />
    ${range(15, (i) => `<path d="M${50 + i * 21} ${170 - Math.sin((i / 14) * Math.PI) * 38} L${50 + i * 21} ${235 + Math.sin((i / 14) * Math.PI) * 14}" opacity=".45"/>`)}
    <path d="M40 180 Q200 100 360 180" />
    <path d="M60 176 Q200 110 340 176" opacity=".5"/>
  `),
  // Mosquée (dôme + minaret)
  mosquee: wrap(`
    <path d="M300 260 V70 M320 260 V70 M296 70 H324 M300 70 L310 40 L320 70 M310 40 V28" />
    ${range(5, (i) => `<path d="M300 ${100 + i * 30} H320" opacity=".45"/>`)}
    <path d="M90 260 V170 H270 V260" />
    <path d="M130 170 Q130 110 180 100 Q230 110 230 170" fill="url(#w)"/>
    <path d="M180 100 V84 M176 88 Q180 80 184 88" />
    ${range(6, (i) => `<path d="M${105 + i * 28} 260 V215 Q${117 + i * 28} 198 ${129 + i * 28} 215 V260" opacity=".5"/>`)}
  `),
  // Mosquée soudanaise en terre (Kong)
  soudanaise: wrap(`
    <path d="M80 260 V170 L95 150 L110 170 L125 150 L140 170 L155 150 L170 170 V260" />
    <path d="M220 260 V110 L240 60 L260 110 V260" fill="url(#w)"/>
    <path d="M170 260 V190 H220 M260 190 H330 V260 M330 190 L340 175 L350 190 V260" />
    ${range(7, (i) => `<path d="M${212 + (i % 2) * 42} ${120 + i * 18} h${(i % 2 ? 14 : -14)}" opacity=".7"/>`)}
    ${range(5, (i) => `<path d="M${95 + i * 15} ${180 + (i % 2) * 12} h-12" opacity=".6"/>`)}
    <path d="M240 60 V44" />
  `),
  // La Pyramide du Plateau (gradins)
  pyramide: wrap(`
    ${range(9, (i) => `<path d="M${110 + i * 12} ${260 - i * 22} H${290 - i * 12}" />`)}
    ${range(9, (i) => `<path d="M${110 + i * 12} ${260 - i * 22} V${238 - i * 22} M${290 - i * 12} ${260 - i * 22} V${238 - i * 22}" opacity=".55"/>`)}
    <path d="M200 62 V40" />
    <path d="M150 260 L200 70 L250 260" fill="url(#w)" stroke-opacity=".2"/>
  `),
  // Hôtel Ivoire (tour + lagune)
  hotel: wrap(`
    <path d="M160 260 V40 H240 V260" fill="url(#w)"/>
    ${range(20, (i) => `<path d="M162 ${52 + i * 10} H238" opacity=".3"/>`)}
    <path d="M200 40 V20" />
    <path d="M60 260 V200 H160 M240 200 H340 V260" />
    <path d="M60 246 Q120 240 180 246 T300 246 T400 246" opacity=".3"/>
  `),
  // Palais de la culture / musée (toits en masque)
  musee: wrap(`
    <path d="M70 260 V160 H330 V260" />
    <path d="M60 160 L200 90 L340 160" fill="url(#w)"/>
    ${range(7, (i) => `<path d="M${95 + i * 35} 260 V175" opacity=".55"/>`)}
    <path d="M185 120 Q200 100 215 120 Q215 140 200 146 Q185 140 185 120 Z" />
    <path d="M192 122 h5 M203 122 h5" />
  `),
  // Man : la Dent de Man et les 18 montagnes
  montagnes: wrap(`
    <path d="M0 260 L60 190 L100 215 L150 150 L175 170 L205 95 Q212 80 222 96 L250 150 L290 120 L340 185 L400 150 V260" fill="url(#w)"/>
    <path d="M0 260 L40 230 L90 245 L140 215 L200 240 L260 205 L320 235 L400 215" opacity=".5"/>
    <path d="M300 150 Q303 175 306 200 Q309 225 312 250" opacity=".6"/>
    <path d="M296 150 Q300 180 302 210" opacity=".3"/>
    <path d="M30 120 Q60 110 90 120 M250 70 Q280 62 310 70" opacity=".35"/>
  `),
  // Forêt primaire
  foret: wrap(`
    ${range(9, (i) => `<path d="M${25 + i * 45} 260 V${170 - (i % 3) * 25}" /><ellipse cx="${25 + i * 45}" cy="${150 - (i % 3) * 25}" rx="${26 + (i % 2) * 8}" ry="${34 + (i % 3) * 6}" fill="url(#w)"/>`)}
    <path d="M0 200 Q100 190 200 205 T400 195" opacity=".3"/>
  `),
};
