// Contenu éditorial du site : photos, destinations, architecture, saveurs, nouchi, festivals.
// Faits vérifiés (sources : UNESCO, AIP, Fraternité Matin, France 24, Jeune Afrique, BAD, Egis…).

const base = import.meta.env.BASE_URL;
export const local = (name, small = false) => `${base}media/${name}${small ? '-sm' : ''}.webp`;
const unsplash = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;

/** Une image est soit une chaîne (photo locale), soit { src, author, url }. */
export const src = (img) => (typeof img === 'string' ? img : img?.src || '');
const U = (id, author, url, w) => ({ src: unsplash(id, w), author, url });

// Photos Unsplash (licence Unsplash) — crédits affichés en pied de page
export const PHOTOS = {
  plateau: U('1648770664367-54d43741edf1', 'Djebi Abraham Philippe', 'https://unsplash.com/@topman1', 2000),
  pirogue: U('1620358722186-6b1e7de6bb0e', 'Sangaré Amara', 'https://unsplash.com/@thumbsup225', 2000),
  korhogo: U('1780311494695-946a468ccca9', 'Shane Ryan Herilalaina', 'https://unsplash.com/@alekseyryan', 2000),
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
  ebimpe: U('1690394919910-3f647aced51a', 'Marou Bamba', 'https://unsplash.com/@maroubamba'),
  arachide: U('1590374562254-412968e4daaa', 'Shannon Nickerson', 'https://unsplash.com/@shanriley', 900),
  tchepe: U('1665332305771-e49a5dd5ba80', 'Keesha’s Kitchen', 'https://unsplash.com/@keeshasskitchen', 900),
  fufu: U('1604329760661-e71dc83f8f26', 'Femoree', 'https://unsplash.com/@femoree', 900),
  claclo: U('1664993090321-b2caff794431', 'Keesha’s Kitchen', 'https://unsplash.com/@keeshasskitchen', 900),
  bissap: U('1713289590440-3159f2d6063c', 'Carlos Torres', 'https://unsplash.com/@elcarito', 900),
  gombo: U('1665332561290-cc6757172890', 'Keesha’s Kitchen', 'https://unsplash.com/@keeshasskitchen', 900),
  sourire: U('1664629152253-4cd71d256d8c', 'Ali Drabo', 'https://unsplash.com/@draboali33'),
};

/* ------------------------------------------------------------------ */
/* Panorama plein écran                                                */
/* ------------------------------------------------------------------ */
export const PANORAMA = [
  { img: PHOTOS.plateau, place: 'Abidjan · Lagune Ébrié', title: 'La Perle<br /><em>des Lagunes</em>', text: 'Les tours du Plateau se reflètent dans la lagune : bienvenue dans la capitale économique.', alt: 'Le Plateau d’Abidjan vu depuis la lagune' },
  { img: local('basilique'), place: 'Yamoussoukro', title: 'Notre-Dame<br /><em>de la Paix</em>', text: 'Un dôme de 158 mètres au cœur de la savane, consacré en 1990.', alt: 'La Basilique Notre-Dame de la Paix' },
  { img: PHOTOS.pirogue, place: 'Grand-Bassam · UNESCO', title: 'Au fil<br /><em>de la lagune</em>', text: 'Première capitale coloniale, ville historique inscrite au patrimoine mondial.', alt: 'Pirogue sur la lagune à Grand-Bassam' },
  { img: PHOTOS.korhogo, place: 'Korhogo · Pays sénoufo', title: 'Le Nord<br /><em>en majesté</em>', text: 'Toiles peintes, balafons et collines de granit sous la lumière du Sahel.', alt: 'Vue de Korhogo et de sa grande mosquée' },
  { img: local('foret'), place: 'Forêts de l’Ouest', title: 'Forêts<br /><em>de brume</em>', text: 'Parmi les dernières forêts primaires d’Afrique de l’Ouest.', alt: 'Forêt tropicale dans la brume' },
  { img: local('danse-masque'), place: 'Traditions vivantes', title: 'Le rythme<br /><em>sacré</em>', text: 'Tambours, chants et masques : chaque fête est un opéra à ciel ouvert.', alt: 'Danse masquée traditionnelle' },
];

/* ------------------------------------------------------------------ */
/* Destinations — `illu` = illustration quand aucune photo fiable        */
/* ------------------------------------------------------------------ */
export const DESTINATIONS = [
  { name: 'Abidjan · Le Plateau', region: 'District d’Abidjan', tag: 'Capitale économique', img: PHOTOS.plateau, text: 'Gratte-ciel face à la lagune Ébrié, cathédrale Saint-Paul, la Pyramide et bientôt la Tour F. Les nouveaux ponts le relient à Cocody et Yopougon.', see: ['Cathédrale Saint-Paul', 'Baie de Cocody', 'Musée des Civilisations'] },
  { name: 'Treichville · Marcory · Yopougon', region: 'District d’Abidjan', tag: 'Abidjan by night', img: PHOTOS.treichville, text: 'Le grand marché et le Palais de la Culture à Treichville, les restos branchés de la Zone 4, et la mythique rue Princesse à Yopougon, berceau du coupé-décalé.', see: ['Marché de Treichville', 'Zone 4', 'Rue Princesse'] },
  { name: 'Grand-Bassam', region: 'Sud-Comoé', tag: 'Patrimoine mondial', img: PHOTOS.pirogue, text: 'Quartier France aux maisons à vérandas, Musée national du Costume dans l’ancien palais du gouverneur et plages de l’Atlantique.', see: ['Quartier France', 'Musée du Costume', 'Fête de l’Abissa'] },
  { name: 'Assinie-Mafia', region: 'Sud-Comoé', tag: 'Entre lagune et océan', img: local('plage'), text: 'Une longue bande de sable entre l’océan et la lagune Aby : la station balnéaire préférée des Abidjanais pour la plage, le kitesurf et les balades en pirogue.', see: ['Lagune Aby', 'Kitesurf', 'Pirogue'] },
  { name: 'Îles Ehotilé', region: 'Lagune Aby', tag: 'Parc national', img: local('coucher-palmiers'), text: 'Six îles protégées depuis 1974 près d’Assinie : mangroves, oiseaux et sites sacrés éotilé, à découvrir en pirogue depuis Étuéboué.', see: ['Mangroves', 'Sites sacrés', 'Ornithologie'] },
  { name: 'Parc national du Banco', region: 'Abidjan', tag: 'Forêt en pleine ville', img: local('foret'), text: '3 438 hectares de forêt primaire en pleine ville, parc national depuis 1953, avec sentiers, arboretum et un écomusée réhabilité.', see: ['Randonnée', 'Arboretum', 'Écomusée'] },
  { name: 'Yamoussoukro', region: 'Lacs', tag: 'Capitale politique', img: local('basilique'), text: 'Avenues monumentales, Basilique Notre-Dame de la Paix et les crocodiles du lac entourant le palais présidentiel.', see: ['Basilique', 'Lac aux caïmans', 'Fondation Houphouët-Boigny'] },
  { name: 'Sassandra · Monogaga · Grand-Béréby', region: 'Littoral Ouest', tag: 'La côte sauvage', img: PHOTOS.vagues, text: 'Criques rocheuses, plages sauvages et villages de pêcheurs, du vieux port de Sassandra à Grand-Béréby, réputée pour ses eaux calmes et ses tortues marines.', see: ['Baie de Monogaga', 'Tortues marines', 'Surf'] },
  { name: 'Man', region: 'Tonkpi', tag: 'La ville aux 18 montagnes', illu: 'montagnes', tone: 'green', text: 'La Dent de Man (881 m), le mont Tonkpi (1 223 m), la cascade et les ponts de lianes de Lieupleu, bâtis selon une tradition yacouba jalousement gardée.', see: ['Dent de Man', 'La Cascade', 'Ponts de lianes'] },
  { name: 'Korhogo · Waraniéné · Fakaha', region: 'Poro', tag: 'Le cœur sénoufo', img: PHOTOS.korhogoRocks, text: 'Tisserands de Waraniéné, peintres des toiles de Korhogo à Fakaha, forgerons et culture du Poro au pied des collines de granit.', see: ['Toiles de Fakaha', 'Waraniéné', 'Mont Korhogo'] },
  { name: 'Kong', region: 'Tchologo', tag: 'Mosquée soudanaise · UNESCO', illu: 'soudanaise', tone: 'terracotta', text: 'Ancienne capitale d’un royaume marchand dioula, Kong conserve une grande mosquée en terre, inscrite au patrimoine mondial en 2021.', see: ['Grande mosquée', 'Architecture en terre'] },
  { name: 'Parc national de Taï', region: 'Cavally', tag: 'Forêt primaire · UNESCO', img: PHOTOS.chimpanze, text: 'L’un des derniers grands massifs de forêt primaire d’Afrique de l’Ouest, où les chimpanzés utilisent des outils pour casser des noix.', see: ['Chimpanzés', 'Mont Niénokoué', 'Écotourisme'] },
  { name: 'Parc national de la Comoé', region: 'Nord-Est', tag: 'Savanes · UNESCO', img: PHOTOS.elephant, text: 'La plus grande aire protégée d’Afrique de l’Ouest (≈ 11 500 km²), retirée de la liste en péril en 2017 grâce au retour de la faune.', see: ['Safari', 'Éléphants', 'Fleuve Comoé'] },
];

/* ------------------------------------------------------------------ */
/* Abidjan moderne & architecture                                      */
/* ------------------------------------------------------------------ */
export const BUILDINGS = [
  { name: 'Tour F', meta: 'Plateau · livraison prévue en 2026', text: '421 m avec sa flèche, dessinée comme un masque africain stylisé par Pierre Fakhoury : elle doit devenir la plus haute tour d’Afrique.', illu: 'tourF', tone: 'night', size: 'tall' },
  { name: 'Pont Alassane Ouattara', meta: 'Cocody ↔ Plateau · 2023', text: 'Premier pont à haubans du pays, ouvert le 12 août 2023 au-dessus de la baie de Cocody.', illu: 'haubans', tone: 'lagoon', size: 'wide' },
  { name: 'Stade olympique d’Ebimpé', meta: 'Anyama · 2020', text: '60 012 places : il a accueilli l’ouverture et la finale de la CAN 2023, remportée par les Éléphants.', img: PHOTOS.ebimpe },
  { name: 'Cathédrale Saint-Paul', meta: 'Plateau · 1985 · Aldo Spirito', text: 'La silhouette de saint Paul, bras tendus, dont le corps forme une tour de près de 60 m retenue par des haubans.', img: local('cathedrale') },
  { name: 'Mosquée Mohammed VI', meta: 'Treichville · 2024', text: 'Œuvre d’artisans marocains, 25 000 m² et un minaret de plus de 69 m, inaugurée le 5 avril 2024.', illu: 'mosquee', tone: 'green' },
  { name: '4e pont d’Abidjan', meta: 'Yopougon ↔ Plateau · 2024', text: 'Environ 1,4 km au-dessus de la baie du Banco, ouvert le 10 janvier 2024 juste avant la CAN.', illu: 'pont', tone: 'terracotta', size: 'wide' },
  { name: 'La Pyramide', meta: 'Plateau · 1973 · Rinaldo Olivieri', text: 'Immeuble brutaliste à gradins, symbole du « miracle ivoirien » des années 1970.', illu: 'pyramide', tone: 'gold' },
  { name: 'Hôtel Ivoire', meta: 'Cocody · 1963–1970', text: 'Tour, patinoire, casino et palais des congrès : l’icône de l’Abidjan moderne, rouverte en 2011.', illu: 'hotel', tone: 'night' },
  { name: 'Musée des Civilisations', meta: 'Plateau · rouvert en 2017', text: 'Plus de 15 000 pièces issues de plus de 60 peuples : masques, statuaire, objets rituels.', illu: 'musee', tone: 'terracotta' },
];

/* ------------------------------------------------------------------ */
/* Saveurs                                                              */
/* ------------------------------------------------------------------ */
// Les incontournables (cartes empilées) — photos réelles
export const DISHES = [
  { name: 'Attiéké poisson braisé', origin: 'Peuples lagunaires · Sud', img: PHOTOS.poisson, text: 'Semoule de manioc fermentée, légèrement acidulée, avec un poisson braisé au charbon, oignons, tomates et piment. Le savoir-faire de l’attiéké est inscrit à l’UNESCO depuis décembre 2024.' },
  { name: 'Alloco', origin: 'Emblème d’Abidjan', img: local('alloco'), text: 'Banane plantain bien mûre frite jusqu’à caraméliser, avec sauce piment-oignon, œuf dur ou poisson braisé. Sucré, salé et fondant.' },
  { name: 'Garba', origin: 'Street-food abidjanaise', img: local('garba'), text: 'Attiéké et thon frit croustillant, piment frais écrasé et oignons. Le roi des « garbadromes », à toute heure et à petit prix.' },
  { name: 'Foutou & sauce graine', origin: 'Akan · Centre & Est', img: local('foutou'), pos: 'center 75%', text: 'Banane plantain et manioc pilés au mortier en une pâte lisse, trempée dans une sauce onctueuse à la noix de palme.' },
  { name: 'Brochettes & choukouya', origin: 'Soirées en maquis', img: local('brochettes'), text: 'Viande grillée au feu de bois, servie avec oignons crus, tomates, piment en poudre et moutarde. L’odeur des braises, c’est l’appel du maquis.' },
  { name: 'Placali sauce kplala', origin: 'Sud & Centre', img: local('placali'), text: 'Pâte souple de manioc fermenté avec une sauce gluante aux feuilles de jute, relevée de poisson fumé ou de crabe.' },
  { name: 'Gnamankoudji', origin: 'La boisson de bienvenue', img: local('gnamankoudji'), pos: 'center 20%', text: 'Jus de gingembre frais pressé, citron, ananas et menthe. Sucré, glacé et bien piquant.' },
];

export const MENU_TABS = [
  { id: 'all', label: 'Tout' },
  { id: 'plat', label: 'Plats' },
  { id: 'street-food', label: 'Street-food' },
  { id: 'boisson', label: 'Boissons' },
  { id: 'douceur', label: 'Douceurs' },
];

// La carte complète — `img: null` affiche un visuel typographique
export const MENU = [
  { name: 'Kedjenou', cat: 'plat', origin: 'Baoulé · Centre', img: null, text: 'Poulet mijoté à l’étouffée dans une canari en terre, sans eau, avec tomates, oignons, piment et gingembre.' },
  { name: 'Poulet braisé', cat: 'plat', origin: 'Star des maquis', img: local('grillade'), text: 'Mariné à l’ail, au gingembre et à la moutarde, puis braisé lentement au charbon jusqu’à la peau dorée.' },
  { name: 'Sauce arachide', cat: 'plat', origin: 'Tout le pays', img: PHOTOS.arachide, text: 'Sauce veloutée à la pâte d’arachide, tomate et piment, avec poulet, bœuf ou poisson. Avec du riz ou du foutou.' },
  { name: 'Sauce djoumblé', cat: 'plat', origin: 'Malinké · Nord', img: PHOTOS.gombo, text: 'Gombo séché en poudre et soumbala : une sauce sombre et gluante, avec riz ou tô.' },
  { name: 'Tchêpe', cat: 'plat', origin: 'Abidjan', img: PHOTOS.tchepe, text: 'Riz cuit dans un bouillon de tomate et de poisson avec légumes, servi avec poisson frit ou braisé.' },
  { name: 'Foufou', cat: 'plat', origin: 'Agni & Abron · Est', img: PHOTOS.fufu, text: 'Banane plantain pilée avec de l’huile de palme : une boule dorée pour la sauce claire ou la sauce graine.' },
  { name: 'Placali sauce kplala', cat: 'plat', origin: 'Sud & Centre', img: local('placali', true), text: 'Pâte de manioc fermenté et sauce aux feuilles de jute.' },
  { name: 'Garba', cat: 'street-food', origin: 'Abidjan', img: local('garba', true), text: 'Attiéké, thon frit, piment et oignons.' },
  { name: 'Alloco', cat: 'street-food', origin: 'Allocodrome de Cocody', img: local('alloco', true), text: 'Banane plantain frite, sauce piment-oignon.' },
  { name: 'Choukouya', cat: 'street-food', origin: 'Grilleurs sahéliens', img: local('brochettes', true), text: 'Mouton grillé au feu de bois, oignons et piment en poudre.' },
  { name: 'Gbofloto', cat: 'douceur', origin: 'Au petit matin', img: local('gbofloto', true), text: 'Beignets moelleux légèrement sucrés, vendus chauds au bord de la route.' },
  { name: 'Claclo', cat: 'douceur', origin: 'Pays akan', img: PHOTOS.claclo, text: 'Beignets de banane très mûre, croustillants dehors et fondants dedans.' },
  { name: 'Dêguê', cat: 'douceur', origin: 'Nord', img: null, text: 'Mil précuit dans du lait caillé sucré, parfumé à la vanille ou à la muscade.' },
  { name: 'Gnamankoudji', cat: 'boisson', origin: 'Offert en bienvenue', img: local('gnamankoudji', true), text: 'Jus de gingembre frais, citron et ananas.' },
  { name: 'Bissap', cat: 'boisson', origin: 'Toute l’Afrique de l’Ouest', img: PHOTOS.bissap, text: 'Infusion glacée de fleurs d’hibiscus, à la menthe ou à la vanille.' },
  { name: 'Bangui', cat: 'boisson', origin: 'Sud forestier', img: null, text: 'Vin de palme fermenté, doux et pétillant le matin, bien plus fort le soir.' },
  { name: 'Tchapalo', cat: 'boisson', origin: 'Nord', img: null, text: 'Bière traditionnelle de mil ou de sorgho, bue dans des calebasses.' },
];

// Où manger — sources : Jeune Afrique (2025), Titans (2026), Petit Futé, Fraternité Matin
export const RESTAURANTS = [
  { name: 'Le Saakan', place: 'Plateau', type: 'Gastronomique', text: 'La table de la cheffe Christelle Vougo : cuisine ivoirienne revisitée, queue de bœuf braisée, mérou au kankankan.' },
  { name: 'Maquis du Val', place: 'Cocody', type: 'Grand maquis', text: 'Poulet braisé, kedjenou et brochettes de mérou. On vous accueille au jus de gingembre.' },
  { name: 'Chez Ambroise', place: 'Marcory', type: 'Maquis', text: 'Réputé pour « les meilleures brochettes d’Abidjan », avec attiéké, frites d’igname ou alloco.' },
  { name: 'Allocodrome de Cocody', place: 'Cocody · Mermoz', type: 'Street-food', text: 'Né dans les années 1980 autour des vendeuses d’alloco : grillades, fumée des braises et musique le soir.' },
  { name: 'Rue Princesse', place: 'Yopougon', type: 'Nuit', text: 'Berceau de la nuit abidjanaise et du coupé-décalé, rebaptisée avenue Adama Bictogo en août 2026.' },
  { name: 'Kajazoma', place: 'Cocody · Deux-Plateaux', type: 'Restaurant-galerie', text: 'Cuisine ivoiro-camerounaise créative autour d’une piscine, dans un décor d’art… entièrement à vendre.' },
  { name: 'Norima', place: 'Cocody · Deux-Plateaux', type: 'Fusion', text: 'La seconde adresse de l’équipe du Saakan : cuisine fusion afro-contemporaine soignée.' },
  { name: 'Maquis du marché de Treichville', place: 'Treichville', type: 'Poisson braisé', text: 'Autour du grand marché, le poisson le plus frais de la ville, braisé sous vos yeux.' },
];

/* ------------------------------------------------------------------ */
/* Arts vivants                                                         */
/* ------------------------------------------------------------------ */
export const CULTURE = [
  { kicker: 'Patrimoine immatériel · UNESCO 2017', title: 'Le Zaouli', text: 'Chez les Gouro de Zuénoula, le danseur masqué exécute des pas d’une vitesse vertigineuse. Né pour honorer la beauté féminine, le Zaouli est inscrit au patrimoine culturel immatériel de l’humanité.', img: local('masque', true) },
  { kicker: 'Ouest montagneux', title: 'Les masques Dan & Wè', text: 'Autour de Man, les masques dan et wè incarnent des esprits de la forêt : juges, chanteurs, coureurs ou échassiers géants.', img: PHOTOS.masqueDan },
  { kicker: 'Centre · Pays baoulé', title: 'L’art baoulé', text: 'Masques portraits mblo, statuettes « époux de l’au-delà », poids à peser l’or akan : un art de cour d’une élégance rare.', img: PHOTOS.masqueBaoule },
  { kicker: 'Nord · Pays sénoufo · UNESCO 2012', title: 'Le balafon & les toiles de Korhogo', text: 'Les pratiques du balafon sénoufo sont reconnues par l’UNESCO. À Fakaha, les artisans peignent sur toile tissée les mythes du Poro.', img: PHOTOS.korhogo },
  { kicker: 'Musique urbaine', title: 'Zouglou & Coupé-décalé', text: 'Nés dans les cités universitaires et les nuits d’Abidjan, le zouglou et le coupé-décalé font danser toute l’Afrique. Le FEMUA de Magic System en est la grande fête.', img: PHOTOS.sourire },
];

/* ------------------------------------------------------------------ */
/* Nouchi                                                               */
/* ------------------------------------------------------------------ */
export const NOUCHI = {
  intro: [
    'Le nouchi, c’est l’argot d’Abidjan : un français réinventé dans la rue, mêlé de dioula, de baoulé, de bété et d’anglais.',
    'Il naît à la fin des années 1970 dans les quartiers populaires d’Adjamé, Abobo et Yopougon, où le « nouchi » désignait le dur, le caïd. Le mot viendrait du malinké <em>nou</em> (nez) et <em>chi</em> (poil) : la moustache des méchants des westerns.',
    'Porté par le zouglou puis le coupé-décalé, il s’exporte aujourd’hui jusque dans les dictionnaires français.',
  ],
  facts: [
    '« S’enjailler » (s’amuser, de l’anglais <em>enjoy</em>) entre dans le Petit Robert en 2017, l’année des Jeux de la Francophonie à Abidjan.',
    '« Boucantier » fait son entrée dans le Petit Larousse illustré 2020, puis « go » et « brouteur » dans le Petit Robert 2023.',
    '« 1er Gaou » de Magic System (1999), « premier naïf » en nouchi, est resté 28 semaines dans le top 100 français.',
  ],
  glossary: [
    { word: 'On dit quoi\u00a0?', meaning: 'Salutation : « Quoi de neuf ? Comment ça va ? »', example: 'Eh djo, on dit quoi ?' },
    { word: 'C’est comment\u00a0?', meaning: 'Salutation : « Comment vas-tu ? »', example: 'Bonjour tantie, c’est comment ce matin ?' },
    { word: 'S’enjailler', meaning: 'S’amuser, faire la fête (de l’anglais « enjoy »).', example: 'Ce soir on part s’enjailler au maquis.' },
    { word: 'Go', meaning: 'Fille, jeune femme, petite amie.', example: 'Je vais présenter ma go à la famille.' },
    { word: 'Gaou', meaning: 'Personne naïve, qui ne connaît pas les codes.', example: 'Premier gaou n’est pas gaou, c’est deuxième gaou qui est niata.' },
    { word: 'Môgô', meaning: 'Ami, copain ; par extension, un gars.', example: 'C’est mon môgô, on a grandi ensemble.' },
    { word: 'Djo', meaning: 'Garçon, pote, ami.', example: 'Djo, tu viens au FEMUA avec nous ?' },
    { word: 'Moussô', meaning: 'Femme (du bambara « mousso »).', example: 'Sa moussô tient un restaurant à Treichville.' },
    { word: 'Yako', meaning: '« Courage », « désolé », « mes condoléances ».', example: 'Tu as perdu ton téléphone ? Yako !' },
    { word: 'Gbê', meaning: 'La vérité (du dioula « clair, propre »).', example: 'Gbê est mieux que drap.' },
    { word: 'C’est gâté', meaning: 'L’ambiance devient folle… ou la situation se dégrade.', example: 'Quand Didi B est monté sur scène, c’était gâté !' },
    { word: 'Faroter', meaning: 'Frimer, se la raconter.', example: 'Il est venu faroter avec sa nouvelle voiture.' },
    { word: 'Boucantier', meaning: 'Celui qui étale sa richesse, figure du coupé-décalé.', example: 'Les boucantiers jetaient des billets sur les danseurs.' },
    { word: 'Tchoko', meaning: 'Branché, à la mode, raffiné.', example: 'Elle est tchoko avec son pagne coupé.' },
    { word: 'Kpakpato', meaning: 'Commère, personne qui rapporte tout.', example: 'Ne dis rien devant lui, c’est un kpakpato.' },
    { word: 'Wari', meaning: 'Argent (du malinké).', example: 'Pas de wari, pas d’enjaillement.' },
  ],
};

/* ------------------------------------------------------------------ */
/* Festivals & événements (éditions récentes)                          */
/* `video` : identifiant YouTube ; l'image par défaut est sa miniature  */
/* ------------------------------------------------------------------ */
export const FESTIVALS = [
  { name: 'FEMUA', place: 'Anoumabo, Abidjan', period: 'Avril – mai', video: 'jR1r4iQl6Ic', text: 'Le festival des musiques urbaines créé par Magic System dans son quartier d’Anoumabo : concerts gratuits et une cause sociale à chaque édition.', latest: '18e édition du 28 avril au 3 mai 2026 (Abidjan & Dimbokro) avec Youssou N’Dour, Fatoumata Diawara, Black M, Meiway, Didi B.' },
  { name: 'MASA', place: 'Abidjan', period: 'Avril · biennal', video: 'ZJgCegIZtaY', text: 'Le grand marché panafricain des arts vivants : musique, danse, théâtre et conte devant les programmateurs du monde entier.', latest: '14e édition du 11 au 18 avril 2026 : 89 formations sélectionnées parmi plus de 2 250 candidatures de 103 pays.' },
  { name: 'Popo Carnaval', place: 'Bonoua', period: 'Avril', video: 'KIrGJ4eX8-Y', text: '« Popo » signifie masque en abouré : défilés costumés, danses, concerts, puis la Danse des esprits et l’incinération du roi Popo géant.', latest: '45e édition du 6 au 19 avril 2026, pour la première fois réunie au Village Popo.' },
  { name: 'Abissa', place: 'Grand-Bassam', period: 'Oct. – nov.', video: 'xhaWaS8TIRo', text: 'Le nouvel an du peuple N’Zima : au rythme du tambour sacré, on fait le bilan de l’année, on dénonce les injustices et l’on se pardonne.', latest: 'Édition 2025 du 5 au 19 octobre : phase rituelle (Siédou) puis phase populaire (Gouazo).' },
  { name: 'Fête du Dipri', place: 'Gomon · Sikensi', period: 'Avril', video: 'fvpbCovk6mw', text: 'Rite de purification du peuple abidji : rites nocturnes, bain à la source sacrée puis transes collectives spectaculaires.', latest: 'Célébré chaque année à la fin de la saison sèche, souvent autour de Pâques.' },
  { name: 'CAN 2023', place: 'Stade d’Ebimpé, Abidjan', period: 'Janv. – fév. 2024', video: '8ONhbpFzKdg', img: PHOTOS.ebimpe, text: 'Pays hôte, la Côte d’Ivoire remporte sa 3e Coupe d’Afrique en renversant le Nigeria en finale. Abidjan explose de joie.', latest: 'Finale le 11 février 2024 : Côte d’Ivoire 2-1 Nigeria (Kessié 62e, Haller 81e).' },
  { name: 'Festival des Grillades', place: 'Palais de la Culture, Abidjan', period: 'Septembre', img: local('grillade', true), text: 'Maîtres grilleurs, chefs et restaurateurs autour du poulet braisé, du poisson grillé et de l’attiéké, avec des concerts en soirée.', latest: '19e édition les 5 et 6 septembre 2026, en tournée à Cotonou, Dakar, Paris…' },
  { name: 'Festi-San', place: 'Sandougou-Soba, près de Man', period: 'Avril', img: PHOTOS.masqueWe, text: 'Sorties et parades des masques dan, danses et rythmes traditionnels de l’Ouest montagneux.', latest: '5e édition du 18 au 20 avril 2025 : plus de 10 000 festivaliers.' },
  { name: 'Fête des Ignames', place: 'Abengourou & pays akan', period: 'Selon les peuples', img: PHOTOS.marche, text: 'Le nouvel an et la nouvelle récolte chez les Agni, Baoulé, Abron… À Abengourou, adoration du siège royal de l’Indénié.', latest: '281e édition ouverte le 6 mars 2026 au palais royal d’Abengourou.' },
  { name: 'Paquinou', place: 'Bouaké & pays baoulé', period: 'Pâques', img: local('danse-masque', true), text: 'La grande fête des retrouvailles : des milliers de ressortissants rentrent au village pour danser, partager et se retrouver.', latest: 'Édition 2026 du 4 au 6 avril, temps forts à Bouaké.' },
];

/* ------------------------------------------------------------------ */
/* Patrimoine mondial                                                   */
/* ------------------------------------------------------------------ */
export const UNESCO = [
  { year: '1981', name: 'Réserve naturelle intégrale du Mont Nimba', type: 'Naturel', img: local('foret', true) },
  { year: '1982', name: 'Parc national de Taï', type: 'Naturel', img: PHOTOS.chimpanze },
  { year: '1983', name: 'Parc national de la Comoé', type: 'Naturel', img: PHOTOS.elephant },
  { year: '2012', name: 'Ville historique de Grand-Bassam', type: 'Culturel', img: PHOTOS.pirogue },
  { year: '2021', name: 'Mosquées de style soudanais du nord ivoirien', type: 'Culturel', img: PHOTOS.korhogoRocks },
];

export const CREDITS = Object.values(PHOTOS).reduce((acc, p) => {
  if (!acc.find((a) => a.author === p.author)) acc.push({ author: p.author, url: `${p.url}?utm_source=ma-cote-divoire&utm_medium=referral` });
  return acc;
}, []);
