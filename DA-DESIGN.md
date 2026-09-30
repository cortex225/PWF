# Akwaba — Direction artistique & design

Document de référence : ce que le site raconte, à quoi il ressemble, comment il bouge, et comment il est construit.
Sert de base pour restructurer le site (pages dédiées, embeds Instagram/TikTok).

---

## 1. Intention

**Promesse :** faire aimer la Côte d'Ivoire au point de donner envie d'y aller pour de vrai.

**Concept :** un *voyage en cinq étapes*. Le visiteur n'explore pas un catalogue, il suit un itinéraire : on atterrit à Abidjan, puis on fait le tour du pays, région par région, jusqu'aux montagnes de l'Ouest. Chaque sujet (cuisine, musique, CAN, masques…) apparaît **une seule fois, dans la région où il se vit**.

**Fil rouge visuel :** la carte réelle du pays, dessinée en particules 3D, reste présente en fond. À chaque chapitre, elle zoome sur la région visitée et l'allume, le reste du pays s'estompe.

**Ton :** chaleureux, à la première personne du pluriel (« chez nous », « on part d'Abidjan »). Phrases courtes, sans jargon touristique. On tutoie le lieu, on vouvoie le lecteur. Conseils honnêtes (vagues dangereuses, durées indicatives).

**Mots-clés d'ambiance :** nuit chaude, lumière dorée, terre, maquis, fête, hospitalité.

---

## 2. Palette

Palette chaude, construite sur le drapeau (orange, blanc, vert) plongé dans une nuit brun-noir, avec l'or comme couleur d'accent principale.

### Fonds sombres (dominante)
| Token | Hex | Usage |
| --- | --- | --- |
| `--night` | `#120b07` | Fond principal, `theme-color` |
| `--night-2` | `#1d130c` | Cartes, pied de page |
| `--night-3` | `#2a1b11` | Surfaces surélevées |

### Fonds clairs (sections « papier »)
| Token | Hex | Usage |
| --- | --- | --- |
| `--cream` | `#f6eee2` | Sections claires : À table, Nouchi (cartes), Partir |
| `--cream-2` | `#ecdfca` | Surfaces sur fond crème |
| `--ink` | `#21160f` | Texte sur crème |

### Texte
| Token | Hex | Usage |
| --- | --- | --- |
| `--white` | `#fff8ee` | Texte sur fond sombre (blanc cassé, jamais blanc pur) |
| `--muted` | `#a8927c` | Texte secondaire, légendes |
| `--reveal-dim` | `#7d6a5a` | Mots « éteints » avant révélation au scroll |

### Accents
| Token | Hex | Usage |
| --- | --- | --- |
| `--gold` | `#e8b04b` | **Accent principal** : eyebrows, mots en italique des titres, focus clavier, hover |
| `--orange` | `#f77f00` | Bouton principal, sélection de texte, drapeau |
| `--green` | `#00a65a` | Drapeau, accents nature |
| `--terracotta` | `#c4532a` | Accent terre |

### Variantes « encre » (contraste AA ≥ 4.5:1 sur crème)
| Token | Hex |
| --- | --- |
| `--terracotta-ink` | `#9e3d1a` — remplace l'or sur fond clair |
| `--green-ink` | `#006b39` |

**Règle :** sur fond sombre, l'accent est l'or ; sur fond crème, l'accent devient terracotta-ink.

---

## 3. Typographie

| Rôle | Police | Détails |
| --- | --- | --- |
| Titres, chiffres, citations | **Fraunces** (serif variable, opsz 9–144, 300–800, italique) | Poids 400, interlignage 0.92–0.98, approche -0.02 à -0.03em |
| Texte courant, UI | **Manrope** (sans, 300–700) | Interlignage 1.6 |

Chargées depuis Google Fonts (`display=swap`).

### Le motif signature : titre en deux temps
Chaque titre associe une ligne droite et une ligne *en italique dorée* :

> Akwaba / *en Côte d'Ivoire*
> Douze jours, / *cinq régions*
> Le goût / *du maquis*

En HTML : `Texte<br /><em>suite</em>`. Le `<em>` est automatiquement en Fraunces italique 300, couleur or.

### Échelle
| Élément | Taille |
| --- | --- |
| `.chapter__title` | `clamp(3rem, 7.5vw, 7rem)` |
| `.section-title` | `clamp(2.6rem, 6.5vw, 6.2rem)` |
| `.block-head .section-title` | `clamp(2.3rem, 5.2vw, 4.8rem)` |
| Chapeau (`.plan__lead`) | Fraunces `clamp(1.25rem, 2vw, 1.7rem)` |
| Texte d'intro (`.block-lead`) | `clamp(1rem, 1.2vw, 1.1rem)`, max 38rem |
| `.eyebrow` | 0.75rem, majuscules, espacement 0.22em, or, 600 |

---

## 4. Éléments graphiques

- **Drapeau miniature** (3 bandes orange/blanc/vert) : logo de la nav, loader, pied de page.
- **Grain** : bruit SVG animé en surimpression sur tout le site, pour une texture « pellicule ».
- **Pastilles arrondies** (`border-radius: 99px`) : boutons, étiquettes d'étape, légendes photo.
- **Cartes** : coins 16px, fond `--night-2`, bordure 1px à 8 % de blanc ; au survol, elles montent de 6px et la bordure devient or.
- **Icônes au trait** (SVG inline, trait 1.8, bouts arrondis) : épingle, flèche, étoile…
- **Illustrations au trait** (`src/illustrations.js`) pour les lieux sans photo libre fiable (Banco, Kong, Man).
- **Légendes en verre dépoli** : fond nuit à 55 %, `backdrop-filter: blur(8px)`.
- **Badge UNESCO** avec l'année d'inscription sur les fiches concernées.

### Boutons
| Variante | Style |
| --- | --- |
| `.btn--primary` | Fond orange, texte nuit ; survol : fond or |
| `.btn--ghost` | Bordure blanche 35 % ; survol : fond blanc, texte nuit |

Sur ordinateur, les boutons sont **magnétiques** (ils suivent légèrement le curseur, retour élastique).

---

## 5. Mouvement

Moteur : **GSAP + ScrollTrigger**, défilement fluide **Lenis**. Courbe maison : `--ease: cubic-bezier(0.22, 1, 0.36, 1)` (et `expo.out` côté GSAP) : départ vif, arrivée très douce.

| Moment | Animation |
| --- | --- |
| Chargement | Les 3 bandes du drapeau montent, « Akwaba » en italique doré, compteur 0→100 %, puis le rideau se lève vers le haut. Rejoué une seule fois par session ; plafonné à 1,2 s d'attente. |
| Hero | Le titre sort ligne par ligne d'un masque ; au scroll, le hero remonte et s'efface. |
| Paragraphes clés | `data-reveal-words` : les mots s'allument un à un au fil du scroll. |
| Grands titres | `data-reveal-chars` : lettres qui montent avec une légère rotation. |
| Chiffres | `data-count` : compteurs animés (158 m, 40 %…). |
| Ouverture de chapitre | Les éléments montent en cascade. |
| Carte postale | La photo part d'un cadre arrondi rétréci et s'ouvre en plein écran, avec un léger dézoom. |
| Cartes et listes | Apparition en cascade (montée + fondu) à l'entrée dans l'écran. |
| Scrollytelling | Colonnes de texte qui défilent devant la forme 3D (basilique, cacao, masque, vinyle, ballon). |
| Nouchi | Bandeau défilant en continu ; cartes qui se retournent pour traduire. |
| Curseur | Point personnalisé qui grossit et affiche une étiquette (« Go », « Lecture », « Agrandir »). Désactivé au tactile. |

**Accessibilité du mouvement :** `prefers-reduced-motion` coupe les animations et raccourcit l'intro.

---

## 6. Le monde 3D (Three.js)

Un seul `<canvas>` fixe en fond, un nuage de **16 000 particules** (9 000 sur mobile) qui **se métamorphose** d'une forme à l'autre selon la section visible (attribut `data-shape`).

| Forme | Où |
| --- | --- |
| `map` | Accueil et chapitres : contour réel du pays (Natural Earth), coloré aux couleurs du drapeau d'ouest en est, avec relief |
| `mapSide` | Plan du voyage, outro : carte décalée sur le côté + noms des villes |
| `basilica` | Yamoussoukro |
| `cocoa` | Route du cacao |
| `mask` | Masques de l'Ouest |
| `ocean` | Littoral (houle animée) |
| `vinyl` | Musique |
| `ball` | CAN 2023 |
| `dust` | Sections neutres |

- Transition : tourbillon pendant le morphing, « respiration » permanente, scintillement.
- `data-focus="abidjan"` : zoom et éclairage de la région.
- `data-hide-world` : masque et met en pause la 3D (sections photo plein écran ou fond crème), pour la lisibilité et la batterie.
- La 3D s'arrête aussi quand l'onglet passe en arrière-plan.

Palette 3D (`src/webgl/shapes.js`) : orange, blanc, vert, or, ambre, plus des teintes dédiées (cacao, cabosse, mer, écume).

---

## 7. Architecture de la page

Une seule longue page narrative. Les chapitres sont **générés** depuis `src/voyage.js`.

```
Loader (Akwaba)
Nav fixe : logo drapeau · liens des 5 étapes + Partir · menu burger plein écran
Wayfinder « Vous êtes ici » : n/5 · barre de progression · nom de l'étape

0. Accueil (hero)          → carte 3D, « Akwaba en Côte d'Ivoire », CTA + film YouTube
0. Le plan du voyage       → « Douze jours, cinq régions », liste des 5 étapes
1-5. Chapitres (× 5)       → voir le gabarit ci-dessous
6. Partir                  → calendrier des saisons et des fêtes, itinéraires 7 et 12 jours (fond crème)
6. Outro                   → « On dit Akwaba une fois, on revient toujours. »
Pied de page               → étapes, dossiers, crédits repliables
```

### Gabarit d'un chapitre (identique pour les 5 régions)
1. **Ouverture** : pastilles « Étape n sur 5 » + durée, grand titre en deux temps, accroche, trajet depuis Abidjan.
2. **Carte postale** : une photo plein écran avec légende.
3. **À voir, les incontournables** : 3 cartes lieu → clic = **fiche latérale** (à faire, accès, quand venir).
4. **Blocs thématiques** propres à la région (liste `blocks` dans `voyage.js`).
5. **À vivre, les fêtes** : cartes événements (période, lieu, vidéo ou photo, dernière édition).

### Contenu par étape
| Étape | Région | Blocs thématiques | Fêtes |
| --- | --- | --- | --- |
| 1 | **Abidjan**, *la ville qui ne dort pas* | Ville en chantier (bento), À table (carte filtrable + où manger), Musique, Nouchi, CAN 2023 | FEMUA, MASA, Grillades, Dipri |
| 2 | **L'Est**, *lagunes et océan* | Littoral | Abissa, Popo Carnaval, Ignames |
| 3 | **Le Centre**, *le pays baoulé* | Basilique de Yamoussoukro, Art baoulé | Paquinou |
| 4 | **Le Nord**, *terre des artisans* | Savoir-faire du Nord | — |
| 5 | **L'Ouest**, *montagnes et forêts* | Masques dan et wè, Route du cacao | Festi-San |

> Constat pour la restructuration : l'étape 1 (Abidjan) porte à elle seule 5 gros blocs (cuisine, musique, nouchi, CAN…). Ce sont les meilleurs candidats pour devenir des **pages dédiées**, qui accueilleront aussi les embeds.

### Alternance de rythme
Le scroll alterne volontairement :
- **nuit + 3D** (chapitres, scrollytelling) ;
- **photo plein écran** (cartes postales, CAN) ;
- **papier crème** (À table, Partir) : une respiration claire, la 3D est masquée.

---

## 8. Composants réutilisables

| Composant | Rôle |
| --- | --- |
| `.block-head` (eyebrow + titre + lead) | En-tête standard de tout bloc |
| `.card` | **Un seul composant** pour lieux, savoir-faire et fêtes |
| `.drawer` | Fiche lieu : panneau latéral sur ordinateur, feuille du bas sur mobile |
| `.lightbox` | Visionneuse photo (toutes les images sont cliquables, clavier + glisser au doigt) |
| `.video-modal` | Lecteur YouTube en modale ; les vidéos supprimées sont détectées et masquées |
| `.story` | Scrollytelling texte + forme 3D |
| `.bento` | Grille asymétrique (Abidjan aujourd'hui) |
| `.menu-card` + `.tabs` | Carte de restaurant filtrable |
| `.ncard` | Carte nouchi qui se retourne |
| `.calendar`, `.itin` | Calendrier des saisons, itinéraires |

Modales : pile gérée (`openModal` / `closeModal`), focus piégé, `inert` sur l'arrière-plan, fermeture par Échap.

---

## 9. Photos & médias

- Photos locales optimisées en **WebP** dans `public/media/` (`npm run images`, via sharp), versions `-sm` pour le mobile.
- Photos **Unsplash** chargées avec `srcset`, auteurs crédités dans le pied de page.
- Vidéos : **YouTube uniquement**, chargées à la demande dans la modale (rien n'est chargé tant qu'on ne clique pas).
- Images en `loading="lazy"`, sauf le hero.

---

## 10. Accessibilité & responsive

- Lien d'évitement « Aller au contenu », focus visible doré (terracotta sur fond crème).
- Contrastes AA vérifiés, variantes « encre » sur fond clair.
- Toutes les modales : rôle `dialog`, `aria-modal`, focus géré, `inert`.
- Éléments décoratifs (canvas, grain, curseur, loader) en `aria-hidden`.
- Points de rupture : 1280, 1024, 820, 560, 380 px. Gouttière fluide `clamp(20px, 5vw, 80px)`, hauteurs en `svh`, zones sûres iOS (`env(safe-area-inset-*)`).
- Bouton « revenir en haut ».

---

## 11. Stack & fichiers

| Outil | Rôle |
| --- | --- |
| Vite | Dev + build **multi-pages** (déjà configuré dans `vite.config.js`) |
| Three.js | Monde de particules |
| GSAP + ScrollTrigger | Animations |
| Lenis | Défilement fluide |

```
index.html                 page principale + <template> des blocs thématiques
src/main.js                orchestration : rendu, scroll, 3D, modales, animations
src/voyage.js              DONNÉES du voyage : régions, lieux, fêtes, calendrier, itinéraires
src/data.js                DONNÉES thématiques : photos, cuisine, musique, nouchi, CAN, architecture
src/style.css              design system complet (~2 700 lignes)
src/illustrations.js       illustrations SVG
src/webgl/particles.js     scène 3D
src/webgl/shapes.js        formes procédurales + palette 3D
public/media/              photos WebP
html/                      anciennes pages « dossiers » (Histoire, Gastronomie, Tourisme, Art)
```

> Les pages `html/` sont l'**ancienne version** du site (Poppins, fond clair, `styles/Style.css`). Elles ne suivent pas la DA actuelle : à refaire ou à remplacer par les nouvelles pages dédiées.

---

## 12. Historique des refontes

1. **Version d'origine** : site multi-pages classique (Poppins, orange/vert sur fond clair, vidéo de fond, modales d'info).
2. **Refonte immersive** : visite-musée de la Côte d'Ivoire avec Three.js, GSAP et Lenis.
3. **v2** : carte réelle (Natural Earth), panorama plein écran, gastronomie enrichie, nouchi, festivals, responsive.
4. **Textes humanisés** : ton plus naturel ; disque vinyle en particules pour la musique ; sections Musique et CAN 2023 ; photos HD.
5. **UX & accessibilité** : contrastes, clavier, chargement plafonné, navigation.
6. **Refonte narrative** : un voyage en cinq étapes, chaque sujet rangé dans sa région, images cliquables, composants unifiés (une seule carte).
7. **Pied de page** repensé (étapes du voyage, crédits repliables) ; retrait de la section « Bon à savoir ».

---

## 13. Pistes pour la suite (à restructurer)

- **Pages dédiées** pour les gros blocs (ex. Cuisine, Musique, Nouchi, CAN, Fêtes), avec un **aperçu court** sur l'accueil qui renvoie vers la page.
- Ces pages réutilisent la même DA : nav, typo, palette, `.block-head`, `.card`, grain. La 3D peut être allégée ou remplacée par un visuel fixe.
- **Embeds Instagram / TikTok** placés uniquement sur ces pages, derrière une **façade** : carte stylée (créateur, @pseudo, plateforme) qui ne charge le vrai post qu'au clic. Crédit du créateur toujours visible.
- Refaire ou retirer les anciennes pages `html/`.
