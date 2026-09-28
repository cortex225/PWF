// Contenu éditorial du site : photos, destinations, architecture, saveurs, nouchi, festivals.
// Faits vérifiés (sources : UNESCO, AIP, Fraternité Matin, France 24, Jeune Afrique, BAD, Egis…).

const base = import.meta.env.BASE_URL;
export const local = (name, small = false) => `${base}media/${name}${small ? '-sm' : ''}.webp`;
const unsplash = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
// Plusieurs largeurs pour que chaque écran charge une image nette mais légère
const srcset = (id, max) => [640, 1080, 1600, 2400, 3200].filter((w) => w <= max).map((w) => `${unsplash(id, w)} ${w}w`).join(', ');

/** Une image est soit une chaîne (photo locale), soit { src, author, url }. */
export const src = (img) => (typeof img === 'string' ? img : img?.src || '');
const U = (id, author, url, w = 1600) => ({ src: unsplash(id, w), srcset: srcset(id, Math.max(w, 1600) * 1.5), author, url });

// Photos Unsplash (licence Unsplash), crédits affichés en pied de page
export const PHOTOS = {
  skyline: U('1785095617583-e408f4b451ca', 'Shane Ryan Herilalaina', 'https://unsplash.com/@alekseyryan', 2400),
  abidjanNuit: U('1528742957614-adb4b8247fa7', 'Patrick Assalé', 'https://unsplash.com/@patrickassale', 2400),
  nordAerien: U('1781466983192-6ef1a3f46f55', 'Shane Ryan Herilalaina', 'https://unsplash.com/@alekseyryan', 2000),
  enfants: U('1700934909225-072b51bae308', 'Ben White', 'https://unsplash.com/@benwhitephotography', 2400),
  piste: U('1700934956852-749efbc8c092', 'Ben White', 'https://unsplash.com/@benwhitephotography', 1600),
  bassamPlage: U('1576670073464-a8fc0b6f99d8', 'Patrick Assalé', 'https://unsplash.com/@patrickassale', 1600),
  moto: U('1663250934943-8163f1d1d4fe', 'Marou Bamba', 'https://unsplash.com/@maroubamba', 1200),
  plateau: U('1648770664367-54d43741edf1', 'Djebi Abraham Philippe', 'https://unsplash.com/@topman1', 2000),
  pirogue: U('1620358722186-6b1e7de6bb0e', 'Sangaré Amara', 'https://unsplash.com/@thumbsup225', 2000),
  korhogo: U('1780311494695-946a468ccca9', 'Shane Ryan Herilalaina', 'https://unsplash.com/@alekseyryan', 2000),
  nordVille: U('1781508202134-8cf0d8b11df3', 'Shane Ryan Herilalaina', 'https://unsplash.com/@alekseyryan', 1600),
  korhogoRocks: U('1769977225462-04bfae9ca911', 'Shane Ryan Herilalaina', 'https://unsplash.com/@alekseyryan'),
  treichville: U('1734866660928-f7cd6e1b90f9', 'Ingeborg Korme', 'https://unsplash.com/@ingeborgkorme'),
  marche: U('1734866675564-34463f5dce1e', 'Ingeborg Korme', 'https://unsplash.com/@ingeborgkorme'),
  poisson: U('1783408356251-f4953f943bb2', 'Emmanuel M', 'https://unsplash.com/@e4xtream'),
  poissonTable: U('1783408355383-db6bcee73099', 'Emmanuel M', 'https://unsplash.com/@e4xtream', 1000),
  cacao: U('1757332914733-212a7af33f0d', 'Daniel Dan', 'https://unsplash.com/@outsideclick'),
  masqueBaoule: U('1719169394887-ae904bc4418f', 'The Cleveland Museum of Art', 'https://unsplash.com/@clevelandart', 1200),
  masqueDan: U('1719169395171-e6d1aa1f1f6f', 'The Cleveland Museum of Art', 'https://unsplash.com/@clevelandart', 1200),
  masqueWe: U('1719169394843-3501ba81bdf9', 'The Cleveland Museum of Art', 'https://unsplash.com/@clevelandart', 1200),
  chimpanze: U('1742328114651-f4dbd710cd5d', 'Simone Dinoia', 'https://unsplash.com/@simonedna'),
  elephant: U('1549366021-9f761d450615', 'Geranimo', 'https://unsplash.com/@geraninmo'),
  vagues: U('1627921126825-602085d1edfd', 'Djebi Abraham Philippe', 'https://unsplash.com/@topman1'),
  cocotiers: U('1649589414700-4eef2b2d8779', 'Adams Banjo', 'https://unsplash.com/@sajitron'),
  ebimpe: U('1690394919910-3f647aced51a', 'Marou Bamba', 'https://unsplash.com/@maroubamba', 2400),
  arachide: U('1590374562254-412968e4daaa', 'Shannon Nickerson', 'https://unsplash.com/@shanriley', 900),
  tchepe: U('1665332305771-e49a5dd5ba80', 'Keesha’s Kitchen', 'https://unsplash.com/@keeshasskitchen', 900),
  fufu: U('1604329760661-e71dc83f8f26', 'Femoree', 'https://unsplash.com/@femoree', 900),
  claclo: U('1664993090321-b2caff794431', 'Keesha’s Kitchen', 'https://unsplash.com/@keeshasskitchen', 900),
  bissap: U('1713289590440-3159f2d6063c', 'Carlos Torres', 'https://unsplash.com/@elcarito', 900),
  gombo: U('1665332561290-cc6757172890', 'Keesha’s Kitchen', 'https://unsplash.com/@keeshasskitchen', 900),
  liesse1: U('1708347456810-a5c430588790', 'Yanick Folly', 'https://unsplash.com/@yanick_folly_229', 2000),
  liesse2: U('1708347456812-45eb51a3227d', 'Yanick Folly', 'https://unsplash.com/@yanick_folly_229', 1200),
  liesse3: U('1708347456876-0e94101fcf8b', 'Yanick Folly', 'https://unsplash.com/@yanick_folly_229', 1200),
  liesse4: U('1708347456805-b7f83316a8ba', 'Yanick Folly', 'https://unsplash.com/@yanick_folly_229', 1200),
  tambour: U('1751708692623-44fe44b6bcff', 'Michael Umoh', 'https://unsplash.com/@michaelumoh', 1600),
  dj: U('1738680815806-a2f7350b558d', 'Christian Agbede', 'https://unsplash.com/@chriscreations__', 1200),
  foule: U('1501386761578-eac5c94b800a', 'Nicholas Green', 'https://unsplash.com/@nickxshotz', 1200),
  sourire: U('1664629152253-4cd71d256d8c', 'Ali Drabo', 'https://unsplash.com/@draboali33'),
};

/* ------------------------------------------------------------------ */
/* Abidjan moderne et architecture                                     */
/* ------------------------------------------------------------------ */
export const BUILDINGS = [
  { name: 'Tour F', meta: 'Plateau, livraison prévue en 2026', text: 'Avec sa flèche, elle atteindra 421 mètres. Pierre Fakhoury l’a dessinée comme un masque africain, et elle doit devenir la plus haute tour du continent.', illu: 'tourF', tone: 'night', size: 'tall' },
  { name: 'Pont Alassane Ouattara', meta: 'Entre Cocody et le Plateau, 2023', text: 'Le premier pont à haubans du pays. Il enjambe la baie de Cocody depuis le 12 août 2023.', illu: 'haubans', tone: 'lagoon', size: 'wide' },
  { name: 'Cathédrale Saint-Paul', meta: 'Plateau, 1985, par Aldo Spirito', text: 'Regardez bien sa silhouette, c’est saint Paul qui ouvre les bras. Sa tour de près de 60 mètres tient grâce à des haubans.', img: local('cathedrale') },
  { name: 'Mosquée Mohammed VI', meta: 'Treichville, 2024', text: 'Construite par des artisans marocains et inaugurée en avril 2024. Son minaret dépasse les 69 mètres.', illu: 'mosquee', tone: 'green' },
  { name: '4e pont d’Abidjan', meta: 'De Yopougon au Plateau, 2024', text: 'Il traverse la baie du Banco sur environ 1,4 km. Il a été ouvert en janvier 2024, juste avant le coup d’envoi de la CAN.', illu: 'pont', tone: 'terracotta', size: 'wide' },
  { name: 'La Pyramide', meta: 'Plateau, 1973, par Rinaldo Olivieri', text: 'Un immeuble en gradins qui raconte les années du « miracle ivoirien ».', illu: 'pyramide', tone: 'gold' },
  { name: 'Hôtel Ivoire', meta: 'Cocody, de 1963 à 1970', text: 'Il avait une patinoire, un casino et un palais des congrès. Toute une époque, et il a rouvert ses portes en 2011.', illu: 'hotel', tone: 'night' },
  { name: 'Musée des Civilisations', meta: 'Plateau, rouvert en 2017', text: 'Plus de 15 000 objets venus de plus de 60 peuples. Le meilleur endroit pour comprendre d’où l’on vient.', illu: 'musee', tone: 'terracotta' },
];

/* ------------------------------------------------------------------ */
/* Saveurs                                                              */
/* ------------------------------------------------------------------ */
export const MENU_TABS = [
  { id: 'all', label: 'Tout' },
  { id: 'plat', label: 'Plats' },
  { id: 'street-food', label: 'Street-food' },
  { id: 'boisson', label: 'Boissons' },
  { id: 'douceur', label: 'Douceurs' },
];

// La carte complète. `img: null` affiche un visuel typographique.
export const MENU = [
  { name: 'Attiéké poisson braisé', cat: 'plat', featured: true, origin: 'Peuples lagunaires du Sud', img: PHOTOS.poisson, text: 'La semoule de manioc un peu acidulée, le poisson braisé au charbon, les oignons, la tomate et le piment. Depuis 2024, le savoir-faire de l’attiéké est inscrit à l’UNESCO.' },
  { name: 'Foutou et sauce graine', cat: 'plat', featured: true, origin: 'Pays akan', img: local('foutou'), pos: 'center 75%', text: 'La banane et le manioc sont pilés au mortier puis trempés dans une sauce à la noix de palme qui a mijoté des heures.' },
  { name: 'Kedjenou', cat: 'plat', origin: 'Pays baoulé', img: null, text: 'Du poulet qui cuit sans eau dans une canari en terre, avec tomates, oignons, piment et gingembre. On secoue le pot de temps en temps.' },
  { name: 'Poulet braisé', cat: 'plat', origin: 'La star des maquis', img: local('grillade'), text: 'Mariné à l’ail, au gingembre et à la moutarde, puis braisé doucement au charbon jusqu’à ce que la peau soit bien dorée.' },
  { name: 'Sauce arachide', cat: 'plat', origin: 'Partout dans le pays', img: PHOTOS.arachide, text: 'Une sauce onctueuse à la pâte d’arachide, avec du poulet, du bœuf ou du poisson. Avec du riz, c’est parfait.' },
  { name: 'Sauce djoumblé', cat: 'plat', origin: 'Le Nord malinké', img: PHOTOS.gombo, text: 'Du gombo séché en poudre et du soumbala pour une sauce sombre et gluante, servie avec du riz ou du tô.' },
  { name: 'Tchêpe', cat: 'plat', origin: 'Abidjan', img: PHOTOS.tchepe, text: 'Du riz cuit dans un bouillon de tomate et de poisson avec des légumes, puis servi avec du poisson frit ou braisé.' },
  { name: 'Foufou', cat: 'plat', origin: 'Agni et Abron, à l’Est', img: PHOTOS.fufu, text: 'De la banane plantain pilée avec de l’huile de palme, qui donne une boule dorée à tremper dans la sauce claire.' },
  { name: 'Placali sauce kplala', cat: 'plat', origin: 'Sud et Centre', img: local('placali', true), text: 'Pâte de manioc fermenté et sauce aux feuilles de jute.' },
  { name: 'Garba', cat: 'street-food', featured: true, origin: 'La street-food préférée', img: local('garba'), text: 'De l’attiéké, du thon frit bien croustillant, du piment frais et des oignons. Pas cher et servi à toute heure.' },
  { name: 'Alloco', cat: 'street-food', featured: true, origin: 'Le goût d’Abidjan', img: local('alloco'), text: 'De la banane plantain bien mûre, frite jusqu’à ce qu’elle caramélise. Avec un peu de piment, on ne s’arrête plus.' },
  { name: 'Choukouya', cat: 'street-food', origin: 'Les grilleurs du Nord', img: local('brochettes', true), text: 'Du mouton grillé au feu de bois avec oignons et piment en poudre.' },
  { name: 'Gbofloto', cat: 'douceur', origin: 'Au petit matin', img: local('gbofloto', true), text: 'Des beignets moelleux et un peu sucrés, qu’on achète tout chauds au bord de la route.' },
  { name: 'Claclo', cat: 'douceur', origin: 'Pays akan', img: PHOTOS.claclo, text: 'Des beignets de banane très mûre, croustillants dehors et fondants dedans.' },
  { name: 'Dêguê', cat: 'douceur', origin: 'Le Nord', img: null, text: 'Du mil dans du lait caillé sucré, avec un peu de vanille. On le boit bien frais.' },
  { name: 'Gnamankoudji', cat: 'boisson', origin: 'Offert en bienvenue', img: local('gnamankoudji', true), text: 'Jus de gingembre frais, citron et ananas.' },
  { name: 'Bissap', cat: 'boisson', origin: 'Toute l’Afrique de l’Ouest', img: PHOTOS.bissap, text: 'Une infusion de fleurs d’hibiscus servie glacée, parfois avec de la menthe.' },
  { name: 'Bangui', cat: 'boisson', origin: 'Le Sud forestier', img: null, text: 'Le vin de palme. Doux et pétillant le matin, il devient bien plus fort en fin de journée.' },
  { name: 'Tchapalo', cat: 'boisson', origin: 'Le Nord', img: null, text: 'La bière traditionnelle de mil ou de sorgho, qu’on partage dans une calebasse.' },
];

// Où manger. Sources : Jeune Afrique (2025), Titans (2026), Petit Futé, Fraternité Matin
export const RESTAURANTS = [
  { name: 'Le Saakan', place: 'Plateau', type: 'Gastronomique', text: 'La cheffe Christelle Vougo y revisite la cuisine ivoirienne. Goûtez la queue de bœuf braisée ou le mérou au kankankan.' },
  { name: 'Maquis du Val', place: 'Cocody', type: 'Grand maquis', text: 'Poulet braisé, kedjenou et brochettes de mérou. On vous y accueille avec un jus de gingembre.' },
  { name: 'Chez Ambroise', place: 'Marcory', type: 'Maquis', text: 'Beaucoup disent que ce sont les meilleures brochettes d’Abidjan. Prenez-les avec de l’attiéké ou de l’alloco.' },
  { name: 'Allocodrome de Cocody', place: 'Cocody, Mermoz', type: 'Street-food', text: 'Tout a commencé dans les années 1980 avec quelques vendeuses d’alloco. Le soir, la fumée des braises et la musique remplissent la place.' },
  { name: 'Rue Princesse', place: 'Yopougon', type: 'La nuit', text: 'La rue la plus célèbre de la nuit abidjanaise, là où le coupé-décalé a pris son envol. Elle porte depuis août 2026 le nom d’avenue Adama Bictogo.' },
  { name: 'Kajazoma', place: 'Cocody, Deux-Plateaux', type: 'Restaurant galerie', text: 'Une cuisine ivoiro-camerounaise créative autour d’une piscine. Tout le décor est à vendre, même les tableaux.' },
  { name: 'Norima', place: 'Cocody, Deux-Plateaux', type: 'Fusion', text: 'La deuxième adresse de l’équipe du Saakan, pour une cuisine fusion soignée dans un cadre calme.' },
  { name: 'Les maquis du marché de Treichville', place: 'Treichville', type: 'Poisson braisé', text: 'Autour du grand marché, le poisson arrive frais et part sur la braise devant vous.' },
];

/* ------------------------------------------------------------------ */
/* Arts vivants                                                         */
/* ------------------------------------------------------------------ */
// Réparties dans les étapes du voyage
export const CULTURE = {
  centre: [
    { kicker: 'Patrimoine immatériel, UNESCO 2017', title: 'Le Zaouli', text: 'Chez les Gouro de Zuénoula, le danseur masqué bouge les pieds si vite qu’on peine à suivre. Cette danse a été créée pour honorer la beauté des femmes.', img: local('masque', true) },
    { kicker: 'Pays baoulé', title: 'L’art baoulé', text: 'Masques portraits, statuettes et poids à peser l’or. Les artistes baoulé ont un sens de l’élégance qui a inspiré les musées du monde entier.', img: PHOTOS.masqueBaoule },
  ],
  nord: [
    { kicker: 'Pays sénoufo, UNESCO 2012', title: 'Le balafon', alt: 'Collines de granit au coucher du soleil, dans le Nord', text: 'Le balafon sénoufo accompagne les fêtes, les récoltes et les funérailles. Ses pratiques sont reconnues par l’UNESCO.', img: PHOTOS.korhogoRocks },
    { kicker: 'Fakaha', title: 'Les toiles de Korhogo', alt: 'Une ville du Nord au milieu de la verdure', text: 'Sur une toile tissée à la main, les artisans peignent les animaux et les mythes du Poro. Chaque toile raconte une histoire.', img: PHOTOS.nordVille },
    { kicker: 'UNESCO 2021', title: 'Les mosquées en terre', text: 'Huit mosquées de style soudanais du nord ivoirien, dont celles de Kong et de Kaouara, sont classées au patrimoine mondial.', illu: 'soudanaise', tone: 'terracotta' },
  ],
  ouest: [
    { kicker: 'Autour de Man', title: 'Les masques dan', text: 'Chez les Dan, chaque masque porte un esprit de la forêt. Certains jugent, d’autres chantent, courent ou font rire.', img: PHOTOS.masqueDan },
    { kicker: 'Pays wè', title: 'Les masques wè', text: 'Plus spectaculaires encore, avec leurs dents, leurs cornes et leurs couleurs. Ils sortent pour les grandes occasions.', img: PHOTOS.masqueWe },
    { kicker: 'Festi-San', title: 'Les échassiers', text: 'Perchés sur des échasses de plusieurs mètres, les danseurs masqués de l’Ouest font des acrobaties à couper le souffle.', img: local('danse-masque', true) },
  ],
};

/* ------------------------------------------------------------------ */
/* Nouchi                                                               */
/* ------------------------------------------------------------------ */
export const NOUCHI = {
  intro: [
    'Le nouchi, c’est la langue de la rue à Abidjan. Du français qu’on a tordu, mélangé avec du dioula, du baoulé, du bété et un peu d’anglais.',
    'Il est né à la fin des années 1970 à Adjamé, Abobo et Yopougon. À l’époque, le « nouchi » c’était le dur du quartier. Le mot viendrait du malinké <em>nou</em> (nez) et <em>chi</em> (poil), la moustache des méchants dans les westerns.',
    'Le zouglou puis le coupé-décalé l’ont fait voyager, et aujourd’hui on le retrouve jusque dans les dictionnaires français.',
  ],
  facts: [
    '« S’enjailler », qui veut dire s’amuser, est entré dans le Petit Robert en 2017, l’année où Abidjan accueillait les Jeux de la Francophonie.',
    '« Boucantier » est arrivé dans le Petit Larousse 2020. Puis « go » et « brouteur » ont suivi dans le Petit Robert 2023.',
    'En 1999, « 1er Gaou » de Magic System, le « premier naïf » en nouchi, est resté 28 semaines dans le top 100 en France.',
  ],
  glossary: [
    { word: 'On dit quoi ?', meaning: 'La façon de dire bonjour. Quoi de neuf, comment ça va ?', example: 'Eh djo, on dit quoi ?' },
    { word: 'C’est comment ?', meaning: 'Autre façon de demander comment tu vas.', example: 'Bonjour tantie, c’est comment ce matin ?' },
    { word: 'S’enjailler', meaning: 'S’amuser, faire la fête. Ça vient de l’anglais « enjoy ».', example: 'Ce soir on part s’enjailler au maquis.' },
    { word: 'Go', meaning: 'Une fille, une jeune femme, ou ta copine.', example: 'Je vais présenter ma go à la famille.' },
    { word: 'Gaou', meaning: 'Quelqu’un de naïf, qui ne connaît pas encore les codes.', example: 'Premier gaou n’est pas gaou, c’est deuxième gaou qui est niata.' },
    { word: 'Môgô', meaning: 'Un ami, un pote, ou simplement un gars.', example: 'C’est mon môgô, on a grandi ensemble.' },
    { word: 'Djo', meaning: 'Un garçon, un ami.', example: 'Djo, tu viens au FEMUA avec nous ?' },
    { word: 'Moussô', meaning: 'Une femme. Le mot vient du bambara.', example: 'Sa moussô tient un restaurant à Treichville.' },
    { word: 'Yako', meaning: 'Ce qu’on dit pour consoler. Courage, désolé.', example: 'Tu as perdu ton téléphone ? Yako !' },
    { word: 'Gbê', meaning: 'La vérité. Le mot vient du dioula.', example: 'Gbê est mieux que drap.' },
    { word: 'C’est gâté', meaning: 'Soit l’ambiance est folle, soit ça tourne mal. Tout dépend du ton.', example: 'Quand Didi B est monté sur scène, c’était gâté !' },
    { word: 'Faroter', meaning: 'Frimer, se montrer.', example: 'Il est venu faroter avec sa nouvelle voiture.' },
    { word: 'Boucantier', meaning: 'Celui qui aime montrer son argent. Un personnage du coupé-décalé.', example: 'Les boucantiers jetaient des billets sur les danseurs.' },
    { word: 'Tchoko', meaning: 'Quelqu’un de branché, toujours bien habillé.', example: 'Elle est tchoko avec son pagne coupé.' },
    { word: 'Kpakpato', meaning: 'Celui qui rapporte tout ce qu’il entend.', example: 'Ne dis rien devant lui, c’est un kpakpato.' },
    { word: 'Wari', meaning: 'L’argent. Le mot vient du malinké.', example: 'Pas de wari, pas d’enjaillement.' },
  ],
};

/* ------------------------------------------------------------------ */
/* CAN 2023 (jouée en Côte d'Ivoire en janvier et février 2024)        */
/* Sources : Jeune Afrique, France 24, Olympics.com, Al Jazeera, CAF   */
/* ------------------------------------------------------------------ */
export const CAN = {
  path: [
    { date: '13 janvier 2024', title: 'La fête commence', score: ['2', '0'], against: 'Guinée-Bissau', result: 'win', text: 'Plus de 600 danseurs, Magic System, Yemi Alade, Dadju et Tayc sur la pelouse d’Ebimpé. Puis les Éléphants ouvrent leur tournoi par une victoire.' },
    { date: '22 janvier 2024', title: 'La gifle', score: ['0', '4'], against: 'Guinée équatoriale', result: 'loss', text: 'Une défaite de 0 à 4 à domicile. Le pays est sous le choc, l’équipe finit troisième de sa poule et doit attendre les autres résultats pour savoir si elle continue.' },
    { date: '24 janvier 2024', title: 'Emerse Faé prend la main', text: 'Le sélectionneur Jean-Louis Gasset est remercié. Son adjoint Emerse Faé le remplace, et la Côte d’Ivoire est repêchée parmi les meilleurs troisièmes. On commence à parler de miracle.' },
    { date: '29 janvier 2024', title: 'Le champion tombe', score: ['1', '1'], against: 'Sénégal', result: 'win', note: '5 tirs au but à 4', text: 'Face au tenant du titre, les Éléphants arrachent l’égalisation en fin de match puis gagnent aux tirs au but.' },
    { date: '3 février 2024', title: 'À la 120e minute', score: ['2', '1'], against: 'Mali', result: 'win', note: 'après prolongation', text: 'À Bouaké, réduits à dix, les Ivoiriens égalisent à la dernière minute puis marquent le but de la victoire à la toute fin de la prolongation.' },
    { date: '7 février 2024', title: 'Haller envoie le pays en finale', score: ['1', '0'], against: 'RD Congo', result: 'win', text: 'Sébastien Haller, revenu d’un cancer, marque l’unique but de la demi-finale.' },
    { date: '11 février 2024', title: 'Champions d’Afrique', score: ['2', '1'], against: 'Nigeria', result: 'win', text: 'Le Nigeria mène à la pause. Franck Kessié égalise de la tête, puis Haller reprend un centre de Simon Adingra à la 81e minute. Troisième étoile, et tout un pays dans la rue.' },
  ],
  stats: [
    { value: 57094, label: 'spectateurs pour la finale à Ebimpé' },
    { value: 6, label: 'stades dans cinq villes, d’Abidjan à Korhogo' },
    { value: 3, label: 'étoiles, après 1992 et 2015' },
    { value: 81, suffix: 'e', label: 'minute, le but de Haller qui fait basculer la finale' },
  ],
  videos: [
    { id: '87oKuumYgzM', kind: 'Ouverture', title: 'La cérémonie d’ouverture', text: 'Le 13 janvier 2024 au stade d’Ebimpé.', img: PHOTOS.ebimpe },
    { id: 'QktjMQh2cFA', kind: 'Hymne officiel', title: 'Akwaba', text: 'Magic System avec Yemi Alade et Mohamed Ramadan.', img: PHOTOS.liesse4 },
    { id: '_S9sFlf3zXU', kind: 'Finale', title: 'Nigeria et Côte d’Ivoire, le résumé', text: 'Les buts de Kessié et de Haller.', img: PHOTOS.liesse2 },
    { id: '-SefIFbmCPo', kind: 'La liesse', title: 'Abidjan en fête', text: 'La nuit où tout le pays est descendu dans la rue.', img: PHOTOS.liesse1 },
  ],
  photos: [
    { img: PHOTOS.liesse1, caption: 'Abidjan, février 2024' },
    { img: PHOTOS.liesse2, caption: 'Abidjan, février 2024' },
    { img: PHOTOS.liesse3, caption: 'Abidjan, février 2024' },
    { img: PHOTOS.liesse4, caption: 'Abidjan, février 2024' },
  ],
};

/* ------------------------------------------------------------------ */
/* Musique                                                              */
/* Sources : UNESCO, Music In Africa, Grammy.com, Africanews, FEMUA,    */
/* franceinfo                                                           */
/* ------------------------------------------------------------------ */
export const MUSIC = {
  eras: [
    { year: 'Avant tout', genre: 'Tradition', title: 'Le balafon et les tambours qui parlent', text: 'Bien avant les studios, il y avait le balafon sénoufo, reconnu par l’UNESCO, et l’attoungblan, le tambour parleur akan qu’on joue en couple pour annoncer les mariages et les deuils. À Afounkaha, six trompes « parlent » et les femmes traduisent leurs mots en chantant.', artists: ['Balafon sénoufo', 'Attoungblan', 'Gbofé d’Afounkaha'] },
    { year: '1977', genre: 'Ziglibithy', title: 'Ernesto Djédjé invente un rythme', text: 'Le chanteur de Daloa mélange les chants bété avec le funk et le makossa. Son tube « Zadie Bobo » fait danser toute l’Afrique de l’Ouest. Il meurt en 1983, à 35 ans, et devient une légende.', artists: ['Ernesto Djédjé'] },
    { year: 'Années 80', genre: 'L’âge d’or', title: 'Les grandes voix', text: 'Amédée Pierre chante le folk bété, Aïcha Koné porte les langues du Nord sur toutes les scènes du continent et Nayanka Bell fait danser Abidjan sur de l’afro-pop.', artists: ['Amédée Pierre', 'Aïcha Koné', 'Nayanka Bell'] },
    { year: '1982', genre: 'Reggae', title: 'Abidjan, capitale du reggae africain', text: 'Alpha Blondy arrive avec « Jah Glory » et chante la paix en dioula, en français et en anglais. Plus tard, Tiken Jah Fakoly fera du reggae une voix pour dénoncer les injustices.', artists: ['Alpha Blondy', 'Tiken Jah Fakoly'] },
    { year: '1990', genre: 'Zouglou', title: 'Le zouglou naît sur le campus', text: 'À la cité universitaire de Yopougon, des étudiants chantent leur galère avec humour. Didier Bilé et Les Parents du Campus lancent le mouvement, puis Espoir 2000, Yodé et Siro et Magic System prennent le relais.', artists: ['Les Parents du Campus', 'Espoir 2000', 'Yodé & Siro', 'Magic System'] },
    { year: '1991', genre: 'Zoblazo', title: 'Le mouchoir blanc de Meiway', text: 'Meiway puise dans les rythmes du Sud-Est et invente le zoblazo, qu’on danse en agitant un mouchoir blanc. Son « 200% Zoblazo » est encore chanté à chaque victoire.', artists: ['Meiway'] },
    { year: '2002', genre: 'Coupé-décalé', title: 'De Paris à Abidjan', text: 'Douk Saga et sa bande, la Jet Set, lancent le coupé-décalé dans les boîtes parisiennes avant que « Sagacité » ne mette le feu à Abidjan. DJ Arafat, Serge Beynaud et Debordo en feront la musique de toute l’Afrique.', artists: ['Douk Saga', 'DJ Arafat', 'Serge Beynaud', 'Debordo Leekunfa', 'DJ Kerozen'] },
    { year: 'Aujourd’hui', genre: 'Rap ivoire', title: 'La nouvelle vague', text: 'Didi B, Suspect 95, Himra et Black K mélangent rap, nouchi et énergie coupé-décalé. Josey remplit les salles et le son d’Abidjan tourne sur les plateformes du monde entier.', artists: ['Didi B', 'Suspect 95', 'Himra', 'Black K', 'Josey'] },
  ],
  artists: [
    { name: 'Alpha Blondy', genre: 'Reggae', text: 'La légende du reggae africain, nommée aux Grammy Awards en 2003.', hit: 'Jerusalem', video: 'WcqK9Ls7Eos' },
    { name: 'Magic System', genre: 'Zouglou', text: 'Les quatre gars d’Anoumabo qui ont fait découvrir le zouglou à l’Europe.', hit: '1er Gaou', video: 'KDocfe69J8k' },
    { name: 'DJ Arafat', genre: 'Coupé-décalé', text: 'Le « Yorobo », icône d’une génération, parti trop tôt en 2019.', hit: 'Maplôrly', video: '0sXPoHL5dEc' },
    { name: 'Meiway', genre: 'Zoblazo', text: 'Le roi du mouchoir blanc, présent sur toutes les fêtes depuis trente ans.', hit: '200% Zoblazo', video: 'LoL_PSDSoh0' },
    { name: 'Tiken Jah Fakoly', genre: 'Reggae', text: 'Le reggae qui réveille les consciences.', hit: 'Africain à Paris', video: '1UZs5kD5-Mg' },
    { name: 'Ernesto Djédjé', genre: 'Ziglibithy', text: 'Le père du ziglibithy, toujours écouté quarante ans après.', hit: 'Zadie Bobo', video: 'Egy4MgevSag' },
    { name: 'Yodé & Siro', genre: 'Zouglou', text: 'Le duo qui raconte la société ivoirienne avec humour et colère.', hit: 'Coco', video: 'NmA0BMmlv3U' },
    { name: 'Douk Saga', genre: 'Coupé-décalé', text: 'Le « Président » de la Jet Set, celui qui a tout lancé.', hit: 'Sagacité', video: 'QIyFXdzfMbA' },
    { name: 'Serge Beynaud', genre: 'Coupé-décalé', text: 'Le maître des danses que tout le monde reprend au maquis.', hit: 'Okeninkpin', video: 'gEr8M4XvQWE' },
    { name: 'Debordo Leekunfa', genre: 'Coupé-décalé', text: 'Une énergie de scène qui ne redescend jamais.', hit: 'Spécialité Ivoirienne', video: 'xssovCcUAak' },
    { name: 'Josey', genre: 'Afropop', text: 'La voix de sa génération, des dizaines de millions de vues pour « Diplôme ».', hit: 'Diplôme', video: 'JZyofc0y7J8' },
    { name: 'Didi B', genre: 'Rap ivoire', text: 'L’ancien leader de Kiff No Beat, tête d’affiche du rap ivoire.', hit: 'En Bri', video: 'vFj2jVRtfx8' },
  ],
  facts: [
    'En août 2019, des dizaines de milliers de personnes ont rendu hommage à DJ Arafat au stade Félix-Houphouët-Boigny.',
    'Le Djidji Ayôkwé, tambour parleur sacré des Ébrié emporté en 1916, est revenu à Abidjan en mars 2026 après 110 ans d’absence.',
    'Enregistré en 1999, « 1er Gaou » de Magic System est devenu un succès en France en 2002, puis son remix a été certifié disque de platine.',
  ],
  photos: [
    { img: PHOTOS.tambour, caption: '' },
    { img: PHOTOS.dj, caption: '' },
    { img: PHOTOS.foule, caption: '' },
  ],
};

export const CREDITS = Object.values(PHOTOS).reduce((acc, p) => {
  if (!acc.find((a) => a.author === p.author)) acc.push({ author: p.author, url: `${p.url}?utm_source=ma-cote-divoire&utm_medium=referral` });
  return acc;
}, []);
