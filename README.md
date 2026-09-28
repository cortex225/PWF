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

## Parcours : un voyage en cinq étapes

La carte 3D du pays sert de fil rouge : à chaque chapitre, elle zoome sur la région visitée et l'allume.

| Étape | Région | On y découvre |
| --- | --- | --- |
| | Akwaba, le voyage | Carte du pays, plan des cinq étapes |
| 1 | Abidjan | Plateau, nuit abidjanaise, Banco, architecture, cuisine et maquis, musique, nouchi, CAN 2023, FEMUA, MASA |
| 2 | L'Est | Grand-Bassam, Assinie, îles Ehotilé, littoral, Abissa, Popo Carnaval |
| 3 | Le Centre | Yamoussoukro et sa basilique, Bouaké, art baoulé, Zaouli, Paquinou |
| 4 | Le Nord | Korhogo et ses villages, Kong, Comoé, balafon, toiles, mosquées en terre |
| 5 | L'Ouest | Man, Taï, côte sauvage, masques dan et wè, route du cacao, Festi-San |
| | Partir | Calendrier des saisons et des fêtes, itinéraires 7 et 12 jours, infos pratiques |

Chaque chapitre suit le même rythme : ouverture, carte postale plein écran, incontournables (fiches détaillées), blocs thématiques, fêtes. Toutes les photos s'ouvrent dans une visionneuse.

## Structure

```
index.html              page principale
src/main.js             orchestration (Lenis, GSAP, contenu)
src/voyage.js           le voyage : régions, lieux, fêtes, calendrier, itinéraires
src/data.js             photos, cuisine, musique, nouchi, CAN, architecture
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
