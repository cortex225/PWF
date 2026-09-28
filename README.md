# Akwaba — Visite immersive de la Côte d'Ivoire

Site touristique et culturel immersif sur la Côte d'Ivoire : carte 3D, panoramas plein écran, gastronomie, nouchi et festivals, animés au scroll.

## Stack

- [Vite](https://vite.dev) — serveur de dev & build multi-pages
- [Three.js](https://threejs.org) — éléments 3D
- [GSAP + ScrollTrigger](https://gsap.com) — motion design et animations liées au scroll
- [Lenis](https://lenis.darkroom.engineering) — défilement fluide

## Lancer le projet

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # génère dist/
npm run preview   # sert dist/
npm run images    # régénère les photos WebP optimisées dans public/media/
npm run map       # régénère le contour de la Côte d'Ivoire (Natural Earth)
```

## Parcours

| # | Section | Effet |
| --- | --- | --- |
| — | Akwaba | Carte réelle de la CI (Natural Earth 1:10m) en ~16 000 particules, relief de l'Ouest |
| 01 | Le Pays | Révélation mot à mot, compteurs |
| 02 | Panorama | Photos plein écran : ouverture « keynote » puis volets au scroll |
| 03 | Destinations | 13 lieux — défilement horizontal épinglé (desktop), carrousel à glisser (mobile) |
| 04 | Abidjan moderne | Bento : Tour F, ponts, stade d'Ebimpé, mosquée Mohammed VI… |
| 05 | Yamoussoukro | Basilique en particules (scrollytelling) |
| 06 | Le Littoral | Océan de particules animé par shader |
| 07 | L'Or brun | Cabosse de cacao 3D |
| 08 | Saveurs & maquis | Cartes empilées, carte complète filtrable, adresses de restaurants |
| 09 | Arts vivants | Masque 3D en particules |
| 10 | Le Nouchi | Glossaire en cartes à retourner, bandeau défilant |
| 11 | Festivals | Éditions 2024-2026, vidéos YouTube en modale |
| 12 | Patrimoine mondial | Aperçu photo qui suit le curseur |
| → | Préparer son voyage | Infos pratiques + carte finale des villes |

## Structure

```
index.html              page principale
src/main.js             orchestration (Lenis, GSAP, contenu)
src/data.js             contenu éditorial (destinations, plats, culture…)
src/style.css           design system (Fraunces + Manrope, palette chaude)
src/webgl/particles.js  monde de particules qui se métamorphose
src/webgl/shapes.js     formes procédurales (carte, basilique, cacao, masque, océan)
src/webgl/civ-outline.json  contour réel du pays (généré par `npm run map`)
src/illustrations.js    illustrations SVG des monuments sans photo libre
public/media/           photos locales optimisées (WebP)
html/                   pages « dossiers » d'origine
```

## Crédits

Photographies : archives personnelles et [Unsplash](https://unsplash.com) (auteurs crédités dans le pied de page). Contour du pays : [Natural Earth](https://www.naturalearthdata.com) (domaine public).
Réalisé par Gouaho Déto Jean-Luc.
