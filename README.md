# Akwaba — Visite immersive de la Côte d'Ivoire

Site touristique et culturel présentant la Côte d'Ivoire comme un **musée à ciel ouvert** : chaque section est une « salle » que l'on traverse au scroll.

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
```

## Parcours

| Salle | Contenu | Effet |
| --- | --- | --- |
| Prologue | Akwaba | Carte de la CI en ~16 000 particules aux couleurs du drapeau |
| I — Le Pays | Texte + chiffres clés | Révélation mot à mot, compteurs |
| II — La Galerie | 8 photos encadrées | Couloir de musée 3D (Three.js) traversé au scroll, cartels |
| III — Destinations | 9 escales | Défilement horizontal épinglé + parallaxe |
| IV — Yamoussoukro | Basilique | Les particules forment la basilique (scrollytelling) |
| V — Le Littoral | Plages | Océan de particules animé par shader |
| VI — L'Or brun | Cacao | Cabosse 3D en particules |
| VII — Saveurs | 7 plats | Cartes empilées (sticky stack) |
| VIII — Arts vivants | Masques, musique | Masque 3D en particules |
| IX — Fêtes | Festivals | Marquee réactif à la vitesse de scroll |
| X — Patrimoine mondial | 5 sites UNESCO | Aperçu photo qui suit le curseur |
| Épilogue | Infos pratiques + carte | Carte finale avec les villes |

## Structure

```
index.html              page principale
src/main.js             orchestration (Lenis, GSAP, contenu)
src/data.js             contenu éditorial (destinations, plats, culture…)
src/style.css           design system (Fraunces + Manrope, palette chaude)
src/webgl/particles.js  monde de particules qui se métamorphose
src/webgl/shapes.js     formes procédurales (carte, basilique, cacao, masque, océan)
src/webgl/gallery.js    galerie de musée 3D
public/media/           photos locales optimisées (WebP)
html/                   pages « dossiers » d'origine
```

## Crédits

Photographies : archives personnelles et [Unsplash](https://unsplash.com) (auteurs crédités dans le pied de page).
Réalisé par Gouaho Déto Jean-Luc.
