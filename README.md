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
| | Akwaba | Carte réelle de la CI (Natural Earth 1:10m) en ~16 000 particules |
| 01 | Le pays | Texte révélé mot à mot, compteurs |
| 02 | Panorama | Photos plein écran (ouverture en carte puis volets au scroll) |
| 03 | Destinations | 13 lieux, défilement horizontal (bureau) ou carrousel (mobile) |
| 04 | Abidjan aujourd'hui | Tour F, ponts, stade d'Ebimpé, mosquée Mohammed VI |
| 05 | Yamoussoukro | Basilique en particules |
| 06 | Le littoral | Océan de particules animé |
| 07 | Le cacao | Cabosse 3D |
| 08 | Saveurs et maquis | Plats phares, carte filtrable, adresses |
| 09 | Masques et traditions | Masque 3D en particules |
| 10 | La musique | Vinyle 3D, histoire du balafon au rap ivoire, 12 artistes avec clips |
| 11 | Le nouchi | Glossaire en cartes à retourner |
| 12 | La CAN 2023 | Stade d'Ebimpé, score de la finale, parcours des « miraculés », vidéos, ballon 3D |
| 13 | Festivals | Éditions 2025 et 2026 avec vidéos |
| 14 | Patrimoine mondial | Aperçu photo qui suit le curseur |
| 15 | Préparer son voyage | Infos pratiques et carte finale |

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
