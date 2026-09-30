// Contenu de l'accueil : une facette de la Côte d'Ivoire après l'autre.
// Un élément sans `img` affiche un emplacement réservé (`ph`) en attendant la photo.
// Les textes marqués « À VÉRIFIER » doivent être confirmés avant publication.

import { PHOTOS, local } from './data.js';

/* Navigation principale : ancres de l'accueil */
export const NAV = [
  { id: 'decouvrir', label: 'Découvrir' },
  { id: 'table', label: 'À table' },
  { id: 'cacao-cafe', label: 'Cacao & Café' },
  { id: 'mode', label: 'Mode' },
  { id: 'musique', label: 'Musique' },
  { id: 'nouchi', label: 'Nouchi' },
];

/* Pages dédiées */
export const PAGES = [];

/* Plan complet (menu plein écran et pied de page) */
export const SECTIONS = [
  { id: 'decouvrir', label: 'Situer & histoire' },
  { id: 'abidjan', label: 'Abidjan' },
  { id: 'patrimoine', label: 'Patrimoine' },
  { id: 'paysages', label: 'Paysages' },
  { id: 'creation', label: 'Fait main & mode' },
  { id: 'table', label: 'À table' },
  { id: 'cacao-cafe', label: 'Cacao & Café' },
  { id: 'musique', label: 'Musique & nouchi' },
  { id: 'fun-facts', label: 'Et au fait…' },
];

/* Vidéo principale d'un bento (grande tuile) */
export const LEADS = {
  table: { platform: 'instagram', id: 'DC8_GSci8n8', author: 'lesadresses__decheznous', url: 'https://www.instagram.com/reel/DC8_GSci8n8/' },
  // vidéo d'ambiance : lecture auto, sans le son, en boucle
  abidjan: { background: 'youtube', id: 'YXAP4Gcsrrs', title: 'Abidjan en vidéo', rate: 2 },
};

/* Zooms de la carte 3D (lon, lat, zoom) */
export const FOCUS = {
  abidjan: { lon: -4.02, lat: 5.35, zoom: 2.4 },
  bassam: { lon: -3.74, lat: 5.2, zoom: 2.8 },
  yamoussoukro: { lon: -5.28, lat: 6.82, zoom: 2.4 },
  ouest: { lon: -7.2, lat: 7.2, zoom: 2 },
  nord: { lon: -5.6, lat: 9.4, zoom: 2 },
};

/* 01 — Situer */
export const KEY_FACTS = [
  { label: 'Région', value: 'Afrique de l’Ouest' },
  { label: 'Façade', value: 'Océan Atlantique' },
  { label: 'Capitale politique', value: 'Yamoussoukro' },
  { label: 'Capitale économique', value: 'Abidjan' },
  { label: 'Langue officielle', value: 'Français' },
  { label: 'Monnaie', value: 'Franc CFA' },
];

/* 01 — Histoire */
export const TIMELINE = [
  { year: '1893', text: 'La Côte d’Ivoire devient une colonie française.' },
  { year: '1960', text: 'Indépendance le 7 août. Félix Houphouët-Boigny devient le premier président.' },
  { year: '1983', text: 'Yamoussoukro devient la capitale politique.' },
];

/*
 * Éléments cliquables (fiche latérale). `group` : les fiches se suivent dans le même groupe.
 * Champs facultatifs : todo, access, when, embeds (nombre d'emplacements Instagram/TikTok prévus).
 */
export const ITEMS = {
  /* 03 — Abidjan */
  plateau: {
    group: 'abidjan', tile: 'sm', name: 'Le Plateau', kicker: 'Cœur des affaires', img: PHOTOS.skyline,
    text: 'Cœur économique d’Abidjan, le Plateau concentre institutions, sièges d’entreprises et une skyline devenue l’une des signatures visuelles de la ville.',
    gallery: ['Vue de nuit'],
    posts: [
      { platform: 'tiktok', id: '7670912780714904855', author: 'jolievoyageofficial', caption: 'Les tours du Plateau', url: 'https://www.tiktok.com/@jolievoyageofficial/video/7670912780714904855' },
      { platform: 'instagram', id: 'DPexeQeDWvl', author: 'isaac.explore', caption: 'Architecture moderniste', url: 'https://www.instagram.com/reel/DPexeQeDWvl/' },
      { platform: 'tiktok', id: '7574879669464649016', author: 'skydrone55', caption: 'Le Plateau vu du ciel', url: 'https://www.tiktok.com/@skydrone55/video/7574879669464649016' },
    ],
  },
  'saint-paul': {
    group: 'abidjan', tile: 'sm', name: 'Cathédrale Saint-Paul', kicker: 'Plateau, 1985', img: local('cathedrale'),
    text: 'Sa croix inclinée domine la lagune Ébrié. À l’intérieur, les vitraux racontent l’arrivée de l’Évangile en Afrique.',
    gallery: ['Façade et croix', 'Intérieur', 'Vitraux'],
  },
  cocody: {
    group: 'abidjan', tile: 'sm', name: 'Cocody', kicker: 'Abidjan contemporaine', img: `${import.meta.env.BASE_URL}media/baie-cocody.jpg`,
    text: 'Quartiers résidentiels, hôtels, restaurants et lieux culturels : l’Abidjan d’aujourd’hui.',
    gallery: [{ img: local('hotel-ivoire'), caption: 'L’hôtel Ivoire, à Cocody' }],
    posts: [
      { platform: 'instagram', id: 'DYFWeD0NlV-', author: 'leboulevardbynoom', url: 'https://www.instagram.com/reel/DYFWeD0NlV-/' },
      { platform: 'youtube', id: 'RKPiE8KSlT4', author: 'Isaac.explore', caption: 'Architecture résidentielle', url: 'https://youtube.com/shorts/RKPiE8KSlT4' },
    ],
  },
  zone4: {
    group: 'abidjan', tile: 'sm', name: 'Marcory & Zone 4', kicker: 'Abidjan la nuit', img: PHOTOS.abidjanNuit,
    text: 'Restaurants, bars, soirées : le quartier le plus cosmopolite de la ville s’allume quand le soleil se couche.',
    embeds: 3,
    posts: [
      { platform: 'instagram', id: 'DPcMuK4DO-x', author: 'isaac.explore', url: 'https://www.instagram.com/reel/DPcMuK4DO-x/' },
      { platform: 'instagram', id: 'DGd7p3SNyuC', author: 'visitivoire', url: 'https://www.instagram.com/reel/DGd7p3SNyuC/' },
    ],
  },

  /* 04 — Grand-Bassam */
  'quartier-france': {
    group: 'bassam', tile: 'lg', name: 'Quartier France', kicker: 'Patrimoine mondial, 2012', img: `${import.meta.env.BASE_URL}media/quartier-france.jpg`,
    text: 'Maisons de commerce à vérandas et bâtiments administratifs : la première capitale de la colonie, figée entre lagune et océan.',
  },
  'musee-costume': {
    group: 'bassam', tile: 'wide', name: 'Musée national du Costume', kicker: 'Ancien palais du gouverneur', img: `${import.meta.env.BASE_URL}media/musee-costume.jpg`,
    text: 'Coiffes, parures et vêtements traditionnels des peuples du pays, dans l’un des plus beaux bâtiments coloniaux de Bassam.',
  },
  'archi-coloniale': {
    group: 'bassam', tile: 'sm', name: 'Architecture coloniale', kicker: 'Pensée pour le climat', img: `${import.meta.env.BASE_URL}media/bassam-architecture.jpg`,
    text: 'Galeries, persiennes, toitures débordantes : une architecture adaptée à la chaleur et à la pluie.',
  },
  memoire: {
    group: 'bassam', tile: 'sm', name: 'Mémoire & patrimoine', kicker: 'Archives', img: `${import.meta.env.BASE_URL}media/bassam-archive.jpg`,
    text: 'Photos anciennes, cartes et récits : ce que les murs de Bassam racontent encore.',
  },

  /* 05 — L'Atlantique */
  assinie: {
    group: 'plages', name: 'Assinie', kicker: 'Lagune & océan', img: local('plage'),
    text: 'Une langue de sable entre l’océan et la lagune Aby. Bateau, paddle, jet-ski, villas : les Abidjanais y filent le week-end.',
    todo: ['Paddle ou kitesurf sur la lagune', 'Déjeuner de poisson braisé les pieds dans le sable'], embeds: 2,
    posts: [
      { platform: 'instagram', id: 'DdyQIAyswU8', author: 'tanguy_moraux', url: 'https://www.instagram.com/reel/DdyQIAyswU8/' },
      { img: `${import.meta.env.BASE_URL}media/assinie-plage.jpg`, caption: 'Plage d’Assinie' },
    ],
  },
  sassandra: {
    group: 'plages', name: 'Sassandra', kicker: 'Océan sauvage', img: `${import.meta.env.BASE_URL}media/sassandra.jpg`,
    text: 'Une ville chargée d’histoire, des plages plus sauvages et des vagues pour le surf.',
    posts: [
      { platform: 'instagram', id: 'DMckeY5KLGt', author: 'jacques.allatin', url: 'https://www.instagram.com/reel/DMckeY5KLGt/' },
      { platform: 'instagram', id: 'DU6XSzOijEI', author: 'lancrage.sassandra', url: 'https://www.instagram.com/reel/DU6XSzOijEI/' },
    ],
  },
  'bassam-plage': {
    group: 'plages', name: 'Grand-Bassam', kicker: 'La plage d’Abidjan', img: `${import.meta.env.BASE_URL}media/bassam-plage.jpg`,
    text: 'À 45 minutes d’Abidjan, la plage où les Abidjanais filent le week-end, entre maquis les pieds dans le sable et vagues de l’Atlantique.',
  },
  'san-pedro': {
    group: 'plages', name: 'San-Pédro, Monogaga & Grand-Béréby', kicker: 'Grande façade maritime', img: PHOTOS.vagues,
    text: 'Plages, grand port et point de départ pour explorer le Sud-Ouest. Tout près, Monogaga aligne sa longue plage, ses pirogues colorées et des vagues qui attirent les surfeurs. Plus à l’ouest, Grand-Béréby cache ses criques et la baie des Sirènes.', embeds: 3,
    posts: [
      { platform: 'instagram', id: 'DIHjcsXCTdo', author: 'jacques.allatin', url: 'https://www.instagram.com/reel/DIHjcsXCTdo/' },
      { platform: 'instagram', id: 'C4Aq-RjCfOG', author: 'enotel_beach', url: 'https://www.instagram.com/reel/C4Aq-RjCfOG/' },
      { platform: 'instagram', id: 'DU-n_hhCJoq', author: 'baiedessirenes', url: 'https://www.instagram.com/reel/DU-n_hhCJoq/' },
    ],
  },

  /* 06 — De la forêt à la savane */
  man: {
    group: 'nature', tile: 'lg', name: 'Man et l’Ouest', kicker: 'Montagnes & cascades', img: `${import.meta.env.BASE_URL}media/man.jpg`,
    text: 'La Dent de Man, le mont Tonkoui, les cascades et les ponts de lianes : l’Ouest se découvre à pied.',
    todo: ['Monter à la Dent de Man', 'Voir la cascade de Man', 'Traverser un pont de lianes'],
    posts: [
      { platform: 'instagram', id: 'DUzoC6ajV_Q', author: 'yafohitravel', url: 'https://www.instagram.com/reel/DUzoC6ajV_Q/' },
    ],
  },
  savane: {
    group: 'nature', tile: 'lg', name: 'La savane du Centre', kicker: 'Autour de Bouaké · safari', img: `${import.meta.env.BASE_URL}media/nzi-lodge.jpg`,
    text: 'En remontant vers le Centre, la forêt s’ouvre et la savane prend le relais. Au N’Zi River Lodge, on part en 4x4 à la rencontre des animaux et on dort au lodge : oui, on peut faire un safari en Côte d’Ivoire.',
    embeds: 2,
    posts: [
      { platform: 'instagram', id: 'DPtVrWHCOJp', author: 'lafficheivoirienne', url: 'https://www.instagram.com/reel/DPtVrWHCOJp/' },
    ],
  },

  /* 08 — Fait main (À VÉRIFIER : Kapélé et Torgokaha) */
  katiola: {
    group: 'craft', tile: 'lg', name: 'Katiola', kicker: 'Les potières', img: `${import.meta.env.BASE_URL}media/katiola.jpg`,
    text: 'Les potières façonnent l’argile à la main et la cuisent au feu de bois, comme leurs mères avant elles.',
  },
  korhogo: {
    group: 'craft', tile: 'wide', name: 'Korhogo', kicker: 'Toiles, peinture, sculpture', img: `${import.meta.env.BASE_URL}media/toile-korhogo.jpg`,
    text: 'Sur les toiles tissées à la main, les artisans sénoufo peignent animaux et scènes de vie.',
  },

  waranienie: {
    group: 'craft', tile: 'wide', name: 'Waraniéné', kicker: 'Les tisserands', img: `${import.meta.env.BASE_URL}media/waraniene.jpg`,
    text: 'Le village des tisserands, près de Korhogo, où les bandes de coton sortent des métiers une à une.',
    posts: [
      { platform: 'instagram', id: 'CqEEH4vuxQZ', author: 'decouvrir_korhogo_', url: 'https://www.instagram.com/reel/CqEEH4vuxQZ/' },
    ],
  },

  /* 09 — Mode (À VÉRIFIER : détails Beyoncé / chiffres) */
  lafalaise: {
    group: 'mode', name: 'LaFalaise Dion', kicker: 'Cauris & coiffes', ph: 'Portrait de LaFalaise Dion',
    lead: { platform: 'instagram', kind: 'p', id: 'DKRu73NsbVR', author: 'yaledirectorsforum', url: 'https://www.instagram.com/p/DKRu73NsbVR/' },
    text: 'Créatrice ivoirienne, LaFalaise Dion transforme le cauri en bijoux, coiffes et pièces sculpturales. Beyoncé porte l’une de ses créations dans le clip <em>Spirit</em> en 2019, puis plusieurs de ses coiffes dans <em>Black Is King</em>.',
    embeds: 2,
  },
  loza: {
    group: 'mode', name: 'Loza Maléombho', kicker: 'Héritage baoulé, coupe contemporaine', ph: 'Création de Loza Maléombho',
    lead: { platform: 'instagram', kind: 'p', id: 'DRWfEv6iPPa', author: 'lozamaleombho', url: 'https://www.instagram.com/p/DRWfEv6iPPa/' },
    text: 'Son travail mêle artisanat ouest-africain, symboles baoulé et silhouettes contemporaines. Beyoncé porte l’une de ses créations dans <em>Black Is King</em>.',
    embeds: 2,
  },
};

export const itemsOf = (group) => Object.entries(ITEMS).filter(([, it]) => it.group === group).map(([id, it]) => ({ id, ...it }));

/* 07 — Yamoussoukro : galerie */
export const BASILICA_GALLERY = [
  { img: local('basilique'), caption: 'Basilique Notre-Dame de la Paix' },
  { img: local('basilique-avenue'), caption: 'Les grandes perspectives de Yamoussoukro' },
  { caption: 'Vitraux de la basilique', post: { platform: 'instagram', id: 'DbgjX_yKB6f', author: 'mrlivoirien_', url: 'https://www.instagram.com/reel/DbgjX_yKB6f/' } },
];

/* 10 — À table : plats mis en avant (noms repris de MENU dans data.js) */
export const FEATURED_DISHES = [
  'Garba',
  { name: 'Attiéké poisson braisé', origin: 'Peuples lagunaires du Sud', img: `${import.meta.env.BASE_URL}media/attieke-poisson.webp` },
  { name: 'Kedjenou', origin: 'Pays baoulé', img: `${import.meta.env.BASE_URL}media/kedjenou.jpg` }, 'Foutou et sauce graine', 'Alloco',
  { name: 'Bissap', origin: 'Jus de fleurs d’hibiscus', img: `${import.meta.env.BASE_URL}media/bissap.jpg` },
  { name: 'Gnamankoudji', origin: 'Jus de gingembre', img: `${import.meta.env.BASE_URL}media/gnamankoudji.jpg` },
];
export const FOOD_WORLDS = [
  { title: 'Cuisine ivoirienne', text: 'Sauces, féculents, braisés : les plats de la maison.' },
  { title: 'Street food', text: 'Garba, alloco, choukouya : ce qu’on mange debout, à toute heure.' },
  { title: 'Nouvelle gastronomie', text: 'Les chefs d’Abidjan qui réinventent les classiques.' },
];

/* 11 — Cacao & Café */
export const CROPS = [
  {
    id: 'cacao', name: 'Cacao', img: PHOTOS.cacao, stat: { value: 'N°1', label: 'producteur mondial, environ 40 % du cacao de la planète' },
    steps: ['Cabosse', 'Fermentation', 'Séchage', 'Transformation', 'Chocolat'],
  },
  {
    id: 'cafe', name: 'Café', img: `${import.meta.env.BASE_URL}media/cafe-robusta.jpg`, stat: { value: 'Robusta', label: 'la variété cultivée dans le pays' },
    steps: ['Cerise', 'Grain', 'Robusta', 'Tasse'],
  },
];

/* 12 — Musique : repères et artistes (noms repris de MUSIC.artists) */
export const MUSIC_TIMELINE = [
  {
    genre: 'Reggae', years: 'Années 1980', text: 'Abidjan devient la capitale du reggae africain : on y chante la paix et on dénonce les injustices.',
    tracks: [
      { id: 'WcqK9Ls7Eos', title: 'Jerusalem', artist: 'Alpha Blondy' },
    ],
  },
  {
    genre: 'Zouglou', years: 'Années 1990', text: 'Né dans les cités universitaires, il raconte la vie avec humour.',
    tracks: [
      { id: 'p3WPemOy_mI', title: 'Abidjan Farot', artist: 'Espoir 2000' },
      { id: 'KDocfe69J8k', title: '1er Gaou', artist: 'Magic System' },
      { id: 'X7Eg3binEVU', title: 'Tournoi', artist: 'Petit Denis' },
    ],
  },
  {
    genre: 'Zoblazo', years: 'Années 1990', text: 'Le mouchoir blanc de Meiway, qu’on agite à chaque fête et à chaque victoire.',
    tracks: [
      { id: 'LoL_PSDSoh0', title: '200% Zoblazo', artist: 'Meiway' },
    ],
  },
  {
    genre: 'Coupé-décalé', years: 'Années 2000', text: 'La fête, la frime et des danses reprises dans toute l’Afrique.',
    tracks: [
      { id: 'QIyFXdzfMbA', title: 'Sagacité', artist: 'Douk Saga' },
      { id: 'tbhqL14L34A', title: 'Djessimidjeka', artist: 'DJ Arafat' },
      { id: 'gEr8M4XvQWE', title: 'Okeninkpin', artist: 'Serge Beynaud' },
    ],
  },
  {
    genre: 'Afropop', years: 'Années 2010', text: 'Des voix qui mêlent pop, R&B et rythmes ivoiriens, portées par des millions de vues.',
    tracks: [
      { id: 'JZyofc0y7J8', title: 'Diplôme', artist: 'Josey' },
      { id: '3SX_b1kiURQ', title: 'Môgô Fariman', artist: 'Roseline Layo' },
      { id: 'ZBkIne1z52w', title: 'Happy Birthday', artist: 'Bebi Philip' },
    ],
  },
  {
    genre: 'Rap ivoire', years: 'Aujourd’hui', text: 'La nouvelle scène, en nouchi, qui s’exporte partout.',
    tracks: [
      { id: 'vFj2jVRtfx8', title: 'En Bri', artist: 'Didi B' },
      { id: 'tY9RYz1-0Fc', title: 'Le Repos', artist: 'Suspect 95 feat. Rosemark' },
      { id: 'KUVZaAZJyQs', title: 'Nostalgie', artist: 'Himra' },
    ],
  },
];
export const FEATURED_ARTISTS = ['Magic System', 'DJ Arafat', 'Josey', 'Didi B'];

/* 14 — Et au fait… */
// Lien du dictionnaire nouchi (à remplacer si tu as une meilleure source)
export const NOUCHI_DICTIONARY_URL = 'https://fr.wikipedia.org/wiki/Nouchi';
export const FUN_FACTS = [
  {
    id: 'mj', size: 'xl', stamp: '1992 · Krindjabo', img: `${import.meta.env.BASE_URL}media/mj-krindjabo.jpg`,
    title: 'Michael Jackson,<br /><em>prince du Sanwi</em>',
    text: 'En 1992, Michael Jackson se rend à Krindjabo, capitale du royaume du Sanwi, dans le sud-est du pays. Il y est reçu comme un fils du royaume et fait prince. Ici, on raconte encore cette histoire avec fierté.',
  },
  {
    id: 'can', size: 'tall', img: `${import.meta.env.BASE_URL}media/can-elephants.jpg`, big: '3×', stamp: '1992 · 2015 · 2023',
    title: 'Les Éléphants,<br /><em>champions d’Afrique</em>',
    text: 'Pays hôte de la CAN 2023, jouée en 2024, la Côte d’Ivoire bat le Nigeria 2–1 en finale à Abidjan. De presque éliminés… à champions d’Afrique.',
    embeds: 1,
    posts: [
      { platform: 'tiktok', id: '7331493133286526214', author: 'caf_online', url: 'https://www.tiktok.com/@caf_online/video/7331493133286526214' },
      { platform: 'tiktok', id: '7334480042317122822', author: 'caf_online', url: 'https://www.tiktok.com/@caf_online/video/7334480042317122822' },
      { platform: 'youtube', id: '5zaeAcjTito', author: 'Tam Sir', caption: 'Coup du marteau', url: 'https://www.youtube.com/watch?v=5zaeAcjTito' },
      { platform: 'youtube', id: 'i_gUubxJ_hg', author: 'NCI', caption: 'Cérémonie d’ouverture de la CAN 2023', wide: true, url: 'https://www.youtube.com/watch?v=i_gUubxJ_hg' },
    ],
  },
  {
    id: 'beyonce', size: 'wide', img: `${import.meta.env.BASE_URL}media/beyonce-lafalaise.jpg`, stamp: '2019 · Spirit',
    title: 'Beyoncé ×<br /><em>LaFalaise Dion</em>',
    text: 'Dans le clip <em>Spirit</em>, Beyoncé porte un masque en cauris de la créatrice ivoirienne. D’autres coiffes suivront pour <em>Black Is King</em>.',
    embeds: 1,
  },
  { id: 'cacao', size: 'small', big: 'N°1', title: 'mondial du <em>cacao</em>', text: 'Environ 40 % du cacao de la planète vient d’ici.', link: { href: 'https://www.icco.org/', label: 'Source : ICCO' } },
  {
    id: 'nouchi', size: 'small', big: '2017', title: 'Le nouchi<br /><em>entre au Robert</em>',
    text: '« S’enjailler » fait son entrée dans le Petit Robert. Envie d’en apprendre plus ?',
    link: { href: NOUCHI_DICTIONARY_URL, label: 'Ouvrir le dictionnaire nouchi' },
  },
];
