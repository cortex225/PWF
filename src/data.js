// Contenu éditorial du site : photos, destinations, saveurs, culture.

const base = import.meta.env.BASE_URL;
export const local = (name, small = false) => `${base}media/${name}${small ? '-sm' : ''}.webp`;
export const src = (img) => (typeof img === 'string' ? img : img?.src || '');
const unsplash = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;

// Photos Unsplash (licence Unsplash) — crédits affichés en pied de page
export const PHOTOS = {
  plateau: { src: unsplash('1648770664367-54d43741edf1'), author: 'Djebi Abraham Philippe', url: 'https://unsplash.com/@topman1' },
  pirogue: { src: unsplash('1620358722186-6b1e7de6bb0e'), author: 'Sangaré Amara', url: 'https://unsplash.com/@thumbsup225' },
  bassamOranges: { src: unsplash('1734866961642-6dbada168f95'), author: 'Ingeborg Korme', url: 'https://unsplash.com/@ingeborgkorme' },
  korhogo: { src: unsplash('1780311494695-946a468ccca9'), author: 'Shane Ryan Herilalaina', url: 'https://unsplash.com/@alekseyryan' },
  korhogoRocks: { src: unsplash('1769977225462-04bfae9ca911'), author: 'Shane Ryan Herilalaina', url: 'https://unsplash.com/@alekseyryan' },
  marche: { src: unsplash('1734866675564-34463f5dce1e'), author: 'Ingeborg Korme', url: 'https://unsplash.com/@ingeborgkorme' },
  poisson: { src: unsplash('1783408356251-f4953f943bb2'), author: 'Emmanuel M', url: 'https://unsplash.com/@e4xtream' },
  cacao: { src: unsplash('1757332914733-212a7af33f0d'), author: 'Daniel Dan', url: 'https://unsplash.com/@outsideclick' },
  masqueBaoule: { src: unsplash('1719169394887-ae904bc4418f', 1200), author: 'The Cleveland Museum of Art', url: 'https://unsplash.com/@clevelandart' },
  masqueDan: { src: unsplash('1719169395171-e6d1aa1f1f6f', 1200), author: 'The Cleveland Museum of Art', url: 'https://unsplash.com/@clevelandart' },
  masqueWe: { src: unsplash('1719169394843-3501ba81bdf9', 1200), author: 'The Cleveland Museum of Art', url: 'https://unsplash.com/@clevelandart' },
  wax: { src: unsplash('1784123476742-de48239d2fb0'), author: 'Barney Goodman', url: 'https://unsplash.com/@bgoodpic' },
  chimpanze: { src: unsplash('1742328114651-f4dbd710cd5d'), author: 'Simone Dinoia', url: 'https://unsplash.com/@simonedna' },
  elephant: { src: unsplash('1549366021-9f761d450615'), author: 'Geranimo', url: 'https://unsplash.com/@geraninmo' },
  vagues: { src: unsplash('1627921126825-602085d1edfd'), author: 'Djebi Abraham Philippe', url: 'https://unsplash.com/@topman1' },
  cocotiers: { src: unsplash('1649589414700-4eef2b2d8779'), author: 'Adams Banjo', url: 'https://unsplash.com/@sajitron' },
  ebimpe: { src: unsplash('1690394919910-3f647aced51a'), author: 'Marou Bamba', url: 'https://unsplash.com/@maroubamba' },
  portrait: { src: unsplash('1667657339834-f131fb08594c', 1200), author: 'Ali Drabo', url: 'https://unsplash.com/@draboali33' },
  sourire: { src: unsplash('1664629152253-4cd71d256d8c'), author: 'Ali Drabo', url: 'https://unsplash.com/@draboali33' },
};

// Panorama plein écran
export const PANORAMA = [
  { img: PHOTOS.plateau, place: 'Abidjan · Lagune Ébrié', title: 'La Perle<br /><em>des Lagunes</em>', text: 'Les tours du Plateau se reflètent dans la lagune : bienvenue dans la capitale économique.', alt: 'Le Plateau d’Abidjan vu depuis la lagune' },
  { img: local('basilique'), place: 'Yamoussoukro', title: 'Notre-Dame<br /><em>de la Paix</em>', text: 'Un dôme de 158 m au cœur de la savane.', alt: 'La Basilique Notre-Dame de la Paix' },
  { img: PHOTOS.pirogue, place: 'Grand-Bassam', title: 'Au fil<br /><em>de la lagune</em>', text: 'Première capitale, patrimoine mondial de l’UNESCO.', alt: 'Pirogue sur la lagune à Grand-Bassam' },
  { img: local('foret'), place: 'Ouest montagneux', title: 'Forêts<br /><em>de brume</em>', text: 'Les forêts de l’Ouest, royaume des chimpanzés et des masques.', alt: 'Forêt tropicale dans la brume' },
  { img: local('danse-masque'), place: 'Traditions', title: 'Le rythme<br /><em>sacré</em>', text: 'Tambours, chants et masques : chaque fête est un opéra à ciel ouvert.', alt: 'Danse masquée traditionnelle' },
];

// Destinations (Salle III — défilement horizontal)
export const DESTINATIONS = [
  { name: 'Abidjan', region: 'Lagunes', tag: 'La Perle des Lagunes', img: PHOTOS.plateau.src, text: "Tours du Plateau, maquis de Treichville, nuits de Marcory et forêt du Banco en pleine ville : Abidjan ne dort jamais.", see: ['Le Plateau', 'Forêt du Banco', 'Treichville', 'Cocody'] },
  { name: 'Grand-Bassam', region: 'Sud-Comoé', tag: 'Patrimoine mondial', img: PHOTOS.pirogue.src, text: 'Quartier France aux façades coloniales, Musée national du Costume, plages de sable et fête de l’Abissa.', see: ['Quartier France', 'Musée du Costume', 'Village artisanal'] },
  { name: 'Assinie', region: 'Sud-Comoé', tag: 'Entre lagune et océan', img: local('plage'), text: 'Une langue de sable entre lagune Aby et océan. Sports nautiques, cocotiers et week-ends suspendus.', see: ['Assinie-Mafia', 'Lagune Aby', 'Îles Ehotilé'] },
  { name: 'Yamoussoukro', region: 'Lacs', tag: 'Capitale politique', img: local('basilique'), text: 'Avenues monumentales, Basilique Notre-Dame de la Paix et lac aux caïmans sacrés du palais présidentiel.', see: ['Basilique', 'Lac aux caïmans', 'Fondation Houphouët-Boigny'] },
  { name: 'Sassandra & San-Pédro', region: 'Bas-Sassandra', tag: 'La Côte sauvage', img: PHOTOS.vagues.src, text: 'Villages de pêcheurs fanti, criques secrètes, surf à Monogaga et embouchure du fleuve Sassandra.', see: ['Baie de Monogaga', 'Plage de Poly', 'Phare de Sassandra'] },
  { name: 'Man', region: 'Tonkpi', tag: 'La ville aux 18 montagnes', img: local('foret'), text: 'La Dent de Man, la cascade sacrée, les ponts de lianes et les masques dan dans les brumes de l’Ouest.', see: ['Dent de Man', 'La Cascade', 'Ponts de lianes', 'Mont Tonkpi'] },
  { name: 'Korhogo', region: 'Poro', tag: 'Le cœur sénoufo', img: PHOTOS.korhogoRocks.src, text: 'Toiles peintes de Fakaha, forgerons de Koni, potières de Katiola et sons du balafon au coucher du soleil.', see: ['Toiles de Fakaha', 'Village de Waraniéné', 'Mont Korhogo'] },
  { name: 'Parc national de Taï', region: 'Cavally', tag: 'Forêt primaire · UNESCO', img: PHOTOS.chimpanze.src, text: "Un des derniers grands massifs de forêt primaire d'Afrique de l'Ouest, royaume des chimpanzés et de l'hippopotame pygmée.", see: ['Chimpanzés', 'Mont Niénokoué', 'Écotourisme'] },
  { name: 'Parc national de la Comoé', region: 'Nord-Est', tag: 'Savanes · UNESCO', img: PHOTOS.elephant.src, text: "L'une des plus vastes aires protégées d'Afrique de l'Ouest : savanes, galeries forestières, éléphants et hippopotames.", see: ['Safari', 'Fleuve Comoé', 'Faune sauvage'] },
];

// Saveurs (Salle V)
export const DISHES = [
  { name: 'Attiéké poisson braisé', origin: 'Lagunes', img: PHOTOS.poisson.src, text: "La semoule de manioc fermentée, servie avec un poisson braisé, oignons, piment et tomate. Le plat national, star des maquis." },
  { name: 'Alloco', origin: 'Partout, à toute heure', img: local('alloco'), text: 'Banane plantain mûre frite dans l’huile rouge, piment écrasé, oignon. Le goût de la rue d’Abidjan.' },
  { name: 'Garba', origin: 'Abidjan', img: local('garba'), text: 'Attiéké et thon frit, piment frais et tomates : le repas populaire par excellence des étudiants et travailleurs.' },
  { name: 'Foutou & sauce graine', origin: 'Baoulé · Centre', img: local('foutou'), pos: 'center 75%', text: 'Banane et igname pilées jusqu’à devenir une pâte douce, trempées dans une sauce à la noix de palme.' },
  { name: 'Placali sauce kplala', origin: 'Sud & Est', img: local('placali'), text: 'Pâte de manioc fermenté accompagnée d’une sauce gluante et parfumée, au poisson fumé ou à la viande.' },
  { name: 'Gbofloto', origin: 'Au petit matin', img: local('gbofloto'), text: 'Petits beignets moelleux de farine de blé, dorés à souhait, vendus chauds au coin des rues.' },
  { name: 'Gnamankoudji', origin: 'La boisson', img: local('gnamankoudji'), pos: 'center 85%', text: 'Jus de gingembre frais, citron et ananas. Piquant, glacé, revigorant sous le soleil.' },
];

// Culture vivante (Salle VI — scrollytelling avec le masque 3D)
export const CULTURE = [
  { kicker: 'Patrimoine immatériel · UNESCO 2017', title: 'Le Zaouli', text: 'Chez les Gouro de Zuénoula, le danseur masqué exécute des pas d’une vitesse vertigineuse. Né pour honorer la beauté féminine, le Zaouli est inscrit au patrimoine culturel immatériel de l’humanité.', img: local('masque') },
  { kicker: 'Ouest montagneux', title: 'Les masques Dan & Wè', text: 'Autour de Man, les masques dan et wè incarnent des esprits de la forêt : juges, chanteurs, coureurs ou échassiers géants.', img: PHOTOS.masqueDan.src },
  { kicker: 'Centre · Pays baoulé', title: 'L’art baoulé', text: 'Masques portraits mblo, statuettes « époux de l’au-delà », poids à peser l’or akan : un art de cour d’une élégance rare.', img: PHOTOS.masqueBaoule.src },
  { kicker: 'Nord · Pays sénoufo · UNESCO 2012', title: 'Le balafon & les toiles de Korhogo', text: 'Les pratiques du balafon sénoufo sont reconnues par l’UNESCO. À Fakaha, les artisans peignent sur toile tissée les mythes du Poro.', img: PHOTOS.korhogo.src },
  { kicker: 'Musique urbaine', title: 'Zouglou & Coupé-décalé', text: 'Nés dans les cités universitaires et les nuits d’Abidjan, le zouglou et le coupé-décalé font danser toute l’Afrique. Le FEMUA de Magic System en est la grande fête.', img: PHOTOS.sourire.src },
];

// Grands rendez-vous
export const FESTIVALS = [
  { month: 'Fév. / Mars', name: 'MASA', place: 'Abidjan', text: 'Marché des Arts du Spectacle d’Abidjan : théâtre, danse et musique de tout le continent.' },
  { month: 'Avril', name: 'Popo Carnaval', place: 'Bonoua', text: 'Le carnaval du peuple abouré : défilés masqués, chars et ambiance survoltée à 50 km d’Abidjan.' },
  { month: 'Avril / Mai', name: 'FEMUA', place: 'Anoumabo, Abidjan', text: 'Le festival des musiques urbaines créé par Magic System, festif et solidaire.' },
  { month: 'Oct. / Nov.', name: 'Fête des Ignames', place: 'Pays akan', text: 'Célébration des nouvelles récoltes, rites royaux et danses traditionnelles.' },
  { month: 'Oct. / Nov.', name: 'Abissa', place: 'Grand-Bassam', text: 'Fête du peuple N’zima : deux semaines de tambours, de pardon et de renouveau.' },
  { month: 'Mars / Avril', name: 'Fête du Dipri', place: 'Gomon', text: 'Nuit et journée de purification du peuple abidji, rites spectaculaires en transe.' },
];

// Patrimoine mondial
export const UNESCO = [
  { year: '1981', name: 'Réserve naturelle intégrale du Mont Nimba', type: 'Naturel', img: local('foret', true) },
  { year: '1982', name: 'Parc national de Taï', type: 'Naturel', img: PHOTOS.chimpanze.src },
  { year: '1983', name: 'Parc national de la Comoé', type: 'Naturel', img: PHOTOS.elephant.src },
  { year: '2012', name: 'Ville historique de Grand-Bassam', type: 'Culturel', img: PHOTOS.pirogue.src },
  { year: '2021', name: 'Mosquées de style soudanais du nord ivoirien', type: 'Culturel', img: PHOTOS.korhogoRocks.src },
];

export const CREDITS = Object.values(PHOTOS).reduce((acc, p) => {
  if (!acc.find((a) => a.author === p.author)) acc.push({ author: p.author, url: p.url });
  return acc;
}, []);

// --- Contenu provisoire, enrichi par la recherche ---
export const BUILDINGS = [
  { name: 'Cathédrale Saint-Paul', meta: 'Abidjan · 1985', text: 'Œuvre de l’architecte Aldo Spirito.', img: local('cathedrale'), size: 'wide' },
  { name: 'Stade olympique d’Ebimpé', meta: 'Abidjan · 2020', text: 'Théâtre de la CAN 2023.', img: PHOTOS.ebimpe },
];
export const MENU_TABS = [
  { id: 'all', label: 'Tout' },
  { id: 'plat', label: 'Plats' },
  { id: 'street-food', label: 'Street-food' },
  { id: 'boisson', label: 'Boissons' },
  { id: 'douceur', label: 'Douceurs' },
];
export const MENU = DISHES.map((d) => ({ ...d, cat: 'plat' }));
export const RESTAURANTS = [];
export const NOUCHI = { intro: ['Le nouchi est l’argot urbain d’Abidjan.'], glossary: [{ word: 'On dit quoi ?', meaning: 'Quoi de neuf ?', example: '' }], facts: [] };
