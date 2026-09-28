// Le voyage : cinq étapes, d'Abidjan vers l'Est, le Centre, le Nord puis l'Ouest.
// Chaque sujet n'apparaît qu'une fois, dans la région où il se vit.
// Distances et durées : ordres de grandeur par la route depuis Abidjan.

import { PHOTOS, local } from './data.js';

/* ------------------------------------------------------------------ */
/* Étapes                                                               */
/* `focus` : centre de la région sur la carte 3D (lon, lat) et zoom.    */
/* `blocks` : blocs thématiques rendus dans le chapitre, dans l'ordre.  */
/* ------------------------------------------------------------------ */
export const REGIONS = [
  {
    id: 'abidjan',
    step: 1,
    name: 'Abidjan',
    title: 'Abidjan,<br /><em>la ville qui ne dort pas</em>',
    tagline: 'Tout commence ici. On atterrit, on pose ses valises, et on se laisse embarquer par le rythme de la plus grande ville du pays.',
    route: 'Arrivée à l’aéroport Félix-Houphouët-Boigny',
    days: '3 jours',
    focus: { lon: -4.02, lat: 5.35, zoom: 2.4 },
    hero: { img: PHOTOS.skyline, caption: 'Abidjan vue de l’autre rive de la lagune Ébrié' },
    places: [
      {
        id: 'plateau', name: 'Le Plateau', kicker: 'Centre des affaires', img: PHOTOS.plateau,
        text: 'Les gratte-ciel regardent la lagune Ébrié, la cathédrale Saint-Paul ouvre les bras et la Tour F grimpe encore.',
        todo: ['Visiter la cathédrale Saint-Paul', 'Voir le musée des Civilisations', 'Marcher le long de la baie de Cocody au coucher du soleil'],
        access: 'En plein centre, à 30 minutes de l’aéroport.', when: 'Toute l’année, en fin de journée pour la lumière.',
      },
      {
        id: 'nuit', name: 'Treichville, Marcory, Yopougon', kicker: 'Abidjan la nuit', img: PHOTOS.abidjanNuit,
        text: 'Le grand marché de Treichville le jour, les restos de la Zone 4 le soir, et la rue Princesse de Yopougon quand la nuit s’allonge.',
        todo: ['Flâner au marché de Treichville', 'Dîner en Zone 4', 'Finir la soirée en maquis à Yopougon'],
        access: 'En taxi orange depuis le Plateau, 10 à 30 minutes.', when: 'Le jeudi, le vendredi et le samedi soir.',
      },
      {
        id: 'banco', name: 'Parc national du Banco', kicker: 'Une forêt en pleine ville', illu: 'foret', tone: 'green',
        text: 'Plus de 3 400 hectares de forêt primaire au milieu d’Abidjan, protégés depuis 1953.',
        todo: ['Randonner sous les arbres géants', 'Visiter l’écomusée', 'Voir les laveurs de linge du Banco à l’entrée'],
        access: 'À 15 minutes du Plateau.', when: 'Le matin, avant la chaleur.',
      },
    ],
    events: ['femua', 'masa', 'grillades', 'dipri'],
    blocks: ['city', 'food', 'music', 'nouchi', 'can'],
  },
  {
    id: 'est',
    step: 2,
    name: 'L’Est',
    title: 'L’Est,<br /><em>lagunes et océan</em>',
    tagline: 'On quitte la ville par la route côtière. En moins d’une heure, on passe des embouteillages aux cocotiers.',
    route: 'Grand-Bassam à 45 minutes d’Abidjan',
    days: '2 à 3 jours',
    focus: { lon: -3.5, lat: 5.3, zoom: 2.6 },
    hero: { img: PHOTOS.bassamPlage, caption: 'La plage de Grand-Bassam, au bord de l’Atlantique' },
    places: [
      {
        id: 'bassam', name: 'Grand-Bassam', kicker: 'Patrimoine mondial', img: PHOTOS.pirogue, unesco: 2012,
        text: 'La première capitale du pays. On se promène dans le Quartier France entre les maisons à vérandas, puis on finit les pieds dans l’Atlantique.',
        todo: ['Parcourir le Quartier France', 'Visiter le musée national du Costume', 'Acheter de l’artisanat au village de Bassam', 'Se baigner (prudemment, les vagues sont fortes)'],
        access: 'Environ 40 km, 45 minutes par l’autoroute.', when: 'De novembre à mars. En octobre pour l’Abissa.',
      },
      {
        id: 'assinie', name: 'Assinie-Mafia', kicker: 'Entre lagune et océan', img: local('plage'),
        text: 'Une longue langue de sable entre l’océan et la lagune Aby. Les Abidjanais y filent le week-end.',
        todo: ['Faire du kitesurf ou du paddle sur la lagune', 'Déjeuner de poisson braisé les pieds dans le sable', 'Passer la nuit dans un lodge au bord de l’eau'],
        access: 'Environ 80 km, 1 h 30 depuis Abidjan.', when: 'De décembre à mars, mer plus calme.',
      },
      {
        id: 'ehotile', name: 'Îles Ehotilé', kicker: 'Parc national', img: local('coucher-palmiers'),
        text: 'Six îles protégées depuis 1974, avec leurs mangroves, leurs oiseaux et les sites sacrés du peuple éotilé.',
        todo: ['Faire le tour des îles en pirogue', 'Observer les oiseaux dans les mangroves'],
        access: 'En pirogue depuis Étuéboué, près d’Assinie.', when: 'En saison sèche, de novembre à mars.',
      },
    ],
    events: ['abissa', 'popo', 'ignames'],
    blocks: ['coast'],
  },
  {
    id: 'centre',
    step: 3,
    name: 'Le Centre',
    title: 'Le Centre,<br /><em>le pays baoulé</em>',
    tagline: 'On remonte l’autoroute du Nord. La forêt laisse place à la savane, et au milieu surgit une basilique géante.',
    route: 'Yamoussoukro à 3 heures d’Abidjan',
    days: '2 jours',
    focus: { lon: -5.3, lat: 7.1, zoom: 2.2 },
    hero: { img: local('basilique'), caption: 'La basilique Notre-Dame de la Paix à Yamoussoukro' },
    places: [
      {
        id: 'yamoussoukro', name: 'Yamoussoukro', kicker: 'Capitale politique', img: local('basilique-avenue'),
        text: 'De grandes avenues, la basilique Notre-Dame de la Paix et les crocodiles du lac qui entoure le palais présidentiel.',
        todo: ['Visiter la basilique et admirer ses vitraux', 'Voir le repas des caïmans en fin d’après-midi', 'Passer devant la fondation Houphouët-Boigny'],
        access: 'Environ 230 km, 3 heures par l’autoroute du Nord.', when: 'Toute l’année, idéalement de novembre à mars.',
      },
      {
        id: 'bouake', name: 'Bouaké', kicker: 'Deuxième ville du pays', img: PHOTOS.piste,
        text: 'Le cœur du pays baoulé, avec son grand marché, ses tisserands et le stade de la Paix qui a vibré pendant la CAN.',
        todo: ['Se perdre dans le grand marché', 'Rencontrer les tisserands de pagne baoulé', 'Venir pour le Paquinou à Pâques'],
        access: 'Environ 350 km, 5 heures par la route.', when: 'À Pâques pour le Paquinou.',
      },
    ],
    events: ['paquinou'],
    blocks: ['basilica', 'centreCulture'],
  },
  {
    id: 'nord',
    step: 4,
    name: 'Le Nord',
    title: 'Le Nord,<br /><em>terre des artisans</em>',
    tagline: 'Plus on monte, plus la lumière change. Collines de granit, villages d’artisans et mosquées en terre.',
    route: 'Korhogo en vol intérieur ou en une longue journée de route',
    days: '3 jours',
    focus: { lon: -5.0, lat: 9.2, zoom: 2.1 },
    hero: { img: PHOTOS.korhogo, caption: 'Korhogo et sa grande mosquée' },
    places: [
      {
        id: 'korhogo', name: 'Korhogo et ses villages', kicker: 'Le cœur sénoufo', img: PHOTOS.nordAerien,
        text: 'Autour de Korhogo, chaque village a son art : les tisserands à Waraniéné, les peintres de toiles à Fakaha, les forgerons à Koni.',
        todo: ['Voir peindre les toiles de Korhogo à Fakaha', 'Acheter un pagne tissé à Waraniéné', 'Monter sur le mont Korhogo au coucher du soleil'],
        access: 'Environ 600 km d’Abidjan. Des vols intérieurs existent.', when: 'De novembre à février, avant les fortes chaleurs.',
      },
      {
        id: 'kong', name: 'Kong', kicker: 'Mosquée en terre', illu: 'soudanaise', tone: 'terracotta', unesco: 2021,
        text: 'L’ancienne capitale d’un royaume marchand dioula. Sa mosquée en terre, hérissée de pieux de bois, est classée au patrimoine mondial.',
        todo: ['Visiter la grande mosquée (tenue correcte demandée)', 'Voir aussi la mosquée de Kaouara, de la même famille'],
        access: 'À l’est de Korhogo, en 4x4 recommandé.', when: 'En saison sèche.',
      },
      {
        id: 'comoe', name: 'Parc national de la Comoé', kicker: 'Safari en savane', img: PHOTOS.elephant, unesco: 1983,
        text: 'La plus grande réserve d’Afrique de l’Ouest. Les animaux y sont revenus, et le parc est sorti de la liste en péril en 2017.',
        todo: ['Partir en safari avec un guide', 'Guetter les hippopotames sur le fleuve Comoé'],
        access: 'Au nord-est, par Bouna ou Kong. Guide obligatoire.', when: 'De décembre à avril, quand les animaux se regroupent près de l’eau.',
      },
    ],
    events: [],
    blocks: ['northCulture'],
  },
  {
    id: 'ouest',
    step: 5,
    name: 'L’Ouest',
    title: 'L’Ouest,<br /><em>montagnes et forêts</em>',
    tagline: 'Dernière étape, la plus sauvage. Des montagnes dans la brume, des masques qui dansent, puis la redescente vers l’océan.',
    route: 'Man en vol intérieur ou à 8 heures de route',
    days: '4 jours',
    focus: { lon: -7.0, lat: 6.3, zoom: 1.9 },
    hero: { img: local('foret'), caption: 'Forêt de l’Ouest dans la brume du matin' },
    places: [
      {
        id: 'man', name: 'Man', kicker: 'La ville aux 18 montagnes', illu: 'montagnes', tone: 'green',
        text: 'La Dent de Man et le mont Tonkpi dominent la ville. Pas loin, il y a la cascade et les ponts de lianes de Lieupleu.',
        todo: ['Grimper la Dent de Man avec un guide', 'Se baigner au pied de la cascade', 'Traverser un pont de lianes'],
        access: 'Environ 580 km. Des vols intérieurs existent.', when: 'De novembre à février, quand le ciel est dégagé.',
      },
      {
        id: 'tai', name: 'Parc national de Taï', kicker: 'Forêt primaire', img: PHOTOS.chimpanze, unesco: 1982,
        text: 'Une des dernières grandes forêts primaires d’Afrique de l’Ouest. Ses chimpanzés cassent des noix avec des outils.',
        todo: ['Suivre les chimpanzés avec les pisteurs', 'Dormir à l’écolodge au cœur de la forêt'],
        access: 'Par Guiglo ou San-Pédro, en 4x4.', when: 'De décembre à mars, pistes praticables.',
      },
      {
        id: 'cote-sauvage', name: 'San-Pédro et Grand-Béréby', kicker: 'La côte sauvage', img: PHOTOS.vagues,
        text: 'Criques rocheuses, plages désertes et villages de pêcheurs. À Grand-Béréby, les tortues marines viennent pondre.',
        todo: ['Surfer à Monogaga', 'Se poser à Grand-Béréby', 'Voir le vieux port de Sassandra'],
        access: 'Environ 350 km par la côtière. Des vols vont à San-Pédro.', when: 'De novembre à mars.',
      },
    ],
    events: ['festisan'],
    blocks: ['masks', 'cocoa'],
  },
];

/* ------------------------------------------------------------------ */
/* Événements (un seul endroit : leur région). `month` sert au calendrier */
/* ------------------------------------------------------------------ */
export const EVENTS = {
  femua: { name: 'FEMUA', place: 'Anoumabo, Abidjan', months: [4], period: 'Avril', video: 'jR1r4iQl6Ic', text: 'Le festival de musiques urbaines créé par Magic System. Concerts gratuits et une cause défendue à chaque édition.', latest: 'En 2026 : Youssou N’Dour, Fatoumata Diawara, Meiway, Didi B.' },
  masa: { name: 'MASA', place: 'Abidjan', months: [4], period: 'Avril, tous les deux ans', video: 'ZJgCegIZtaY', text: 'Le grand rendez-vous des arts de la scène africains : musique, danse, théâtre et conte.', latest: 'En 2026 : 89 groupes venus de tout le continent.' },
  grillades: { name: 'Festival des Grillades', place: 'Palais de la Culture, Abidjan', months: [9], period: 'Septembre', img: local('grillade', true), text: 'Les meilleurs grilleurs de la ville autour du poulet braisé, du poisson et de l’attiéké, avec des concerts le soir.', latest: '19e édition les 5 et 6 septembre 2026.' },
  dipri: { name: 'Fête du Dipri', place: 'Gomon, à 1 h 30 d’Abidjan', months: [3, 4], period: 'Mars ou avril', video: 'fvpbCovk6mw', text: 'La fête de purification du peuple abidji. Rites à minuit, puis transes au petit matin.', latest: 'Chaque année à la fin de la saison sèche.' },
  abissa: { name: 'Abissa', place: 'Grand-Bassam', months: [10], period: 'Octobre', video: 'xhaWaS8TIRo', text: 'Le nouvel an du peuple N’Zima. Au son du tambour sacré, on dit tout haut ce qui ne va pas, et on se pardonne.', latest: 'En 2025, du 5 au 19 octobre.' },
  popo: { name: 'Popo Carnaval', place: 'Bonoua', months: [4], period: 'Avril', video: 'KIrGJ4eX8-Y', text: 'Défilés costumés, danses et concerts, et à la fin on brûle le roi Popo géant.', latest: 'La 45e édition s’est tenue du 6 au 19 avril 2026.' },
  ignames: { name: 'Fête des Ignames', place: 'Abengourou', months: [2, 3], period: 'Février ou mars', img: PHOTOS.marche, text: 'On fête la nouvelle récolte autour du siège royal de l’Indénié.', latest: '281e édition le 6 mars 2026.' },
  paquinou: { name: 'Paquinou', place: 'Bouaké et pays baoulé', months: [3, 4], period: 'À Pâques', img: local('danse-masque', true), text: 'À Pâques, on rentre au village. On danse, on mange ensemble et on retrouve la famille.', latest: 'En 2026, du 4 au 6 avril.' },
  festisan: { name: 'Festi-San', place: 'Près de Man', months: [4], period: 'Avril', img: PHOTOS.masqueWe, text: 'Les masques dan sortent, dansent et défilent au son des rythmes de l’Ouest.', latest: 'En 2025, plus de 10 000 personnes.' },
};

/* ------------------------------------------------------------------ */
/* Quand venir : saisons dans le Sud (Abidjan), mois par mois           */
/* ------------------------------------------------------------------ */
export const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
// dry = saison sèche (idéal), short = petite saison sèche, rain = saison des pluies
export const SEASONS = ['dry', 'dry', 'dry', 'rain', 'rain', 'rain', 'rain', 'short', 'short', 'rain', 'dry', 'dry'];

/* ------------------------------------------------------------------ */
/* Itinéraires prêts à partir                                          */
/* ------------------------------------------------------------------ */
export const ITINERARIES = [
  {
    id: 'sept',
    name: '7 jours',
    title: 'L’essentiel',
    text: 'Abidjan, la côte et la basilique. Parfait pour un premier voyage.',
    days: [
      { d: 'J1 à J3', place: 'Abidjan', what: 'Plateau, Banco, maquis et soirée à Yopougon' },
      { d: 'J4', place: 'Grand-Bassam', what: 'Quartier France et plage' },
      { d: 'J5', place: 'Assinie', what: 'Lagune, kitesurf et poisson braisé' },
      { d: 'J6', place: 'Yamoussoukro', what: 'Basilique et lac aux caïmans' },
      { d: 'J7', place: 'Abidjan', what: 'Derniers achats au marché, retour' },
    ],
  },
  {
    id: 'douze',
    name: '12 jours',
    title: 'Le grand tour',
    text: 'Les cinq étapes du site, avec deux vols intérieurs pour gagner du temps.',
    days: [
      { d: 'J1 à J3', place: 'Abidjan', what: 'La ville, la cuisine, la musique' },
      { d: 'J4 et J5', place: 'Grand-Bassam et Assinie', what: 'Patrimoine et plages' },
      { d: 'J6', place: 'Yamoussoukro', what: 'Basilique, puis route vers Bouaké' },
      { d: 'J7 et J8', place: 'Korhogo', what: 'Villages d’artisans, toiles et balafon' },
      { d: 'J9 et J10', place: 'Man', what: 'Dent de Man, cascade, ponts de lianes' },
      { d: 'J11', place: 'San-Pédro', what: 'Côte sauvage et Grand-Béréby' },
      { d: 'J12', place: 'Abidjan', what: 'Retour et dernière soirée en maquis' },
    ],
  },
];
