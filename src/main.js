import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleWorld } from './webgl/particles.js';
import { MENU, NOUCHI, MUSIC, local } from './data.js';
import {
  $, $$, reduceMotion, attr, img, checkVideo, arrow, ph, media, embedSlots, splitWords, splitChars,
  lenis, initScroll, scrollTo, initVideo, initPosts, postCard, postsBlock, initLightbox, initDrawer, reveal, initNav, initCursor, renderShell,
} from './ui.js';
import { LEADS, FOCUS, KEY_FACTS, TIMELINE, ITEMS, itemsOf, BASILICA_GALLERY, FEATURED_DISHES, FOOD_WORLDS, CROPS, MUSIC_TIMELINE, FEATURED_ARTISTS, FUN_FACTS } from './content.js';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* 1. Construction de la page                                          */
/* ------------------------------------------------------------------ */

// Carte cliquable qui ouvre la fiche latérale
const itemCard = (it, { light = false } = {}) => `
  <button class="card card--place" data-item="${it.id}" data-cursor="Découvrir" aria-haspopup="dialog">
    <span class="card__media">${media(it, it.name, { sizes: '(max-width: 820px) 85vw, 30vw', light, video: it.video })}</span>
    <span class="card__body">
      <span class="card__kicker">${it.kicker}</span>
      <span class="card__title">${it.name}</span>
      <span class="card__text">${it.text}</span>
      <span class="card__more">Voir plus ${arrow}</span>
    </span>
  </button>`;

// Tuile de bento : l'image occupe toute la tuile, le texte passe par-dessus
const tile = (it) => `
  <button class="tile tile--${it.tile || 'sm'}" data-item="${it.id}" data-cursor="Découvrir" aria-haspopup="dialog">
    <span class="tile__media">${media(it, it.name, { sizes: it.tile === 'lg' ? '(max-width: 820px) 100vw, 50vw' : '(max-width: 820px) 50vw, 25vw', video: it.video })}</span>
    <span class="tile__body">
      <span class="card__kicker">${it.kicker}</span>
      <span class="tile__title">${it.name}</span>
      ${it.tile === 'lg' ? `<span class="tile__text">${it.text}</span>` : ''}
      <span class="card__more">Voir plus ${arrow}</span>
    </span>
  </button>`;

// Grande tuile d'un bento : vidéo d'ambiance, publication ou emplacement réservé
const leadMedia = (lead, label) => {
  if (!lead) return ph(label, { video: true });
  if (lead.background !== 'youtube') return postCard(lead);
  const q = `autoplay=1&mute=1&loop=1&playlist=${lead.id}&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&enablejsapi=1`;
  return `<div class="bg-video"><iframe data-rate="${lead.rate || 1}" src="https://www.youtube-nocookie.com/embed/${lead.id}?${q}" title="${attr(lead.title)}" allow="autoplay; encrypted-media" tabindex="-1" aria-hidden="true"></iframe></div>`;
};

// Grande vignette de destination (rail horizontal)
const destCard = (it) => `
  <button class="dest-card" data-item="${it.id}" data-cursor="Découvrir" aria-haspopup="dialog">
    <span class="dest-card__media">${media(it, it.name, { sizes: '(max-width: 820px) 80vw, 32vw' })}</span>
    <span class="dest-card__body">
      <span class="card__kicker">${it.kicker}</span>
      <span class="dest-card__title">${it.name}</span>
    </span>
  </button>`;

// Créateur mis en avant : portrait + texte + emplacements d'embeds
const designer = (it, i) => `
  <article class="designer ${i % 2 ? 'designer--flip' : ''}">
    ${it.lead ? `<div class="designer__media designer__media--post">${postCard(it.lead)}</div>` : `<div class="designer__media frame frame--portrait">${media(it, it.name)}</div>`}
    <div class="designer__body">
      <p class="card__kicker">${it.kicker}</p>
      <h3 class="designer__name">${it.name}</h3>
      <p>${it.text}</p>
      ${embedSlots(it.embeds)}
    </div>
  </article>`;


function renderContent() {
  // Navigation
  renderShell('home');

  // Situer & histoire
  $('.keyfacts').innerHTML = KEY_FACTS.map((f) => `<div><dt>${f.label}</dt><dd>${f.value}</dd></div>`).join('');
  $('.timeline').innerHTML = TIMELINE.map((t) => `<li><b>${t.year}</b><span>${t.text}</span></li>`).join('');

  // Cartes cliquables, rails et créateurs
  $$('[data-items]').forEach((el) => {
    const list = itemsOf(el.dataset.items);
    if (el.classList.contains('bento')) el.innerHTML = (el.dataset.lead ? `<div class="tile tile--lg tile--lead">${leadMedia(LEADS[el.dataset.items], el.dataset.lead)}</div>` : '') + list.map(tile).join('');
    else if (el.classList.contains('rail')) el.innerHTML = list.map(destCard).join('');
    else if (el.classList.contains('designers')) el.innerHTML = list.map(designer).join('');
    else el.innerHTML = list.map((it) => itemCard(it, { light: !!el.closest('.heritage') })).join('');
  });

  // Vidéo d'ouverture d'une section
  $$('[data-post]').forEach((el) => LEADS[el.dataset.post] && (el.innerHTML = leadMedia(LEADS[el.dataset.post])));

  // Yamoussoukro
  $('.mini-gallery').innerHTML = BASILICA_GALLERY.map((g) =>
    g.post
      ? `<div class="mini-gallery__post">${postCard(g.post)}</div>`
      : g.img
      ? `<button class="zoom-btn" aria-label="Agrandir : ${attr(g.caption)}">${img(g.img, g.caption, { sizes: '(max-width: 820px) 50vw, 20vw', zoom: true })}</button>`
      : `<span class="mini-gallery__ph">${ph(g.ph)}</span>`
  ).join('');

  // À table
  // une entrée = un nom de plat (repris de MENU) ou une publication { post: {...} }
  $('.dishes').innerHTML = FEATURED_DISHES.map((d) => (typeof d === 'string' ? MENU.find((m) => m.name === d) : d))
    .filter(Boolean)
    .map((m) =>
      m.post
        ? `<article class="dish dish--post">${postCard(m.post)}${m.name ? `<h3>${m.name}</h3>` : ''}${m.origin ? `<p>${m.origin}</p>` : ''}</article>`
        : dishCard(m)
    )
    .join('');
  renderRest();
}

const dishCard = (m) => `
    <article class="dish">
      <div class="dish__img">${
        m.img
          ? `<button class="zoom-btn" aria-label="Agrandir : ${attr(m.name)}">${img(m.img, m.name, { sizes: '(max-width: 820px) 50vw, 20vw', zoom: true, style: `object-position:${m.pos || 'center'}` })}</button>`
          : ph(`Photo : ${m.name}`, { light: true })
      }</div>
      <h3>${m.name}</h3>
      <p>${m.origin}</p>
    </article>`;

function renderRest() {

  // Cacao & café
  CROPS.forEach((c) => {
    $(`[data-crop="${c.id}"]`).innerHTML = `
    <article class="crop">
      <div class="crop__media">${
        c.img ? `<button class="zoom-btn" aria-label="Agrandir : ${c.name}">${img(c.img, c.name, { sizes: '(max-width: 820px) 100vw, 520px', zoom: true })}</button>` : ph(c.ph)
      }</div>
      <div class="crop__body">
        <h3 class="crop__name">${c.name}</h3>
        <p class="crop__stat"><b>${c.stat.value}</b>${c.stat.label}</p>
        <ol class="crop__steps">${c.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      </div>
    </article>`;
  });

  // Musique
  $('.sound-line').innerHTML = MUSIC_TIMELINE.map(
    (t) => `<li><span>${t.years}</span><b>${t.genre}</b><p>${t.text}</p>${
      t.tracks
        ? `<div class="tracks">${t.tracks
            .map(
              (k) => `<button class="track" data-track="${k.id}" aria-pressed="false" aria-label="Écouter ${attr(k.title)}, ${attr(k.artist)}">
            <span class="track__btn" aria-hidden="true"></span>
            <span class="track__info"><b>${k.title}</b><small>${k.artist}</small></span>
            <span class="track__eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          </button>`
            )
            .join('')}</div>`
        : ''
    }</li>`
  ).join('');


  // Nouchi
  $('.nouchi__marquee-inner').innerHTML = NOUCHI.glossary.map((g) => `<span>${g.word}</span><i class="dot"></i>`).join('').repeat(2);
  $('.nouchi__grid').innerHTML = NOUCHI.glossary
    .map(
      (g) => `
    <button class="ncard" aria-pressed="false" aria-label="${attr(g.word)} : ${attr(g.meaning)}">
      <span class="ncard__face ncard__front">
        <span class="ncard__word">${g.word}</span>
        <span class="ncard__tap">Traduire</span>
      </span>
      <span class="ncard__face ncard__back">
        <strong>${g.word}</strong>
        <span class="ncard__meaning">${g.meaning}</span>
        ${g.example ? `<em>« ${g.example} »</em>` : ''}
      </span>
    </button>`
    )
    .join('');

  // Et au fait…
  $('.fbento').innerHTML = FUN_FACTS.map(
    (f) => `
    <article class="fcard fcard--${f.size} fcard--${f.id}">
      ${f.img || f.ph ? `<div class="fcard__media">${media(f, attr(f.title))}</div>` : ''}
      <div class="fcard__body">
        ${f.stamp ? `<p class="fcard__stamp">${f.stamp}</p>` : ''}
        ${f.big ? `<p class="fcard__big">${f.big}</p>` : ''}
        <h3 class="fcard__title">${f.title}</h3>
        <p class="fcard__text">${f.text}</p>
        ${f.posts ? postsBlock(f.posts) : embedSlots(f.embeds)}
        ${f.link ? `<a class="fcard__link" href="${f.link.href}" target="_blank" rel="noopener">${f.link.label} ${arrow}</a>` : ''}
      </div>
    </article>`
  ).join('');


  $$('[data-video]').forEach((el) => el.dataset.video !== '_VrWeJov7jM' && checkVideo(el, el.dataset.video));
}

/* 5. Monde 3D et sections                                             */
/* ------------------------------------------------------------------ */
let world;
function initWorld() {
  try {
    world = new ParticleWorld($('.webgl'), { count: window.innerWidth < 820 ? 9000 : 16000 });
  } catch (e) {
    console.warn('WebGL indisponible', e);
  }
}

function initRooms() {
  const labels = $('.city-labels');
  let citiesOn = false;

  $$('[data-shape]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: ({ isActive }) => {
        if (!isActive) return;
        world?.setFocus(FOCUS[sec.dataset.focus] || null);
        world?.morphTo(sec.dataset.shape);
        const hide = sec.hasAttribute('data-hide-world');
        $('.webgl').style.opacity = hide ? 0 : 1;
        hide ? world?.pause() : world?.resume();

        const current = sec.dataset.nav || '';
        $$('[data-nav-link]').forEach((a) => (a.dataset.navLink === current ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));

        citiesOn = sec.hasAttribute('data-show-cities');
        labels.classList.toggle('is-visible', citiesOn);
      },
    });
  });
  ScrollTrigger.create({
    trigger: '.footer',
    start: 'top 95%',
    onToggle: ({ isActive }) => {
      $('.webgl').style.opacity = isActive ? 0 : 1;
      $('.city-labels').classList.toggle('is-hidden', isActive);
    },
  });

  if (world) {
    const els = world.cityScreenPositions().map((c) => {
      const el = document.createElement('span');
      el.className = 'city-label';
      el.textContent = c.name;
      labels.append(el);
      return el;
    });
    gsap.ticker.add(() => {
      if (!citiesOn) return;
      world.cityScreenPositions().forEach((c, i) => {
        const flip = c.x > window.innerWidth * 0.6;
        els[i].classList.toggle('city-label--left', flip);
        els[i].style.transform = `translate(${c.x}px, ${c.y + (c.dy || 0)}px) translate(${flip ? '-100%' : '0'}, -50%)`;
      });
    });
  }
}

/* ------------------------------------------------------------------ */
/* 6. Animations                                                        */
/* ------------------------------------------------------------------ */

function initAnimations() {
  gsap.to('.hero__inner', { yPercent: -25, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__scroll', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '30% top', scrub: true } });

  $$('[data-reveal-words]').forEach((el) => {
    gsap.to(splitWords(el), { color: '#fff8ee', stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 55%', scrub: true } });
  });
  $$('[data-reveal-chars]').forEach((el) => {
    gsap.from(splitChars(el), { yPercent: 110, opacity: 0, rotate: 8, stagger: 0.025, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 80%' } });
  });

  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count;
    const obj = { v: 0 };
    const fmt = new Intl.NumberFormat('fr-FR');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: end,
          duration: end > 100 ? 2.2 : 1.4,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = end >= 1900 && end <= 2100 ? Math.round(obj.v) : fmt.format(Math.round(obj.v))),
        }),
    });
  });

  $$('.block-head').forEach((h) => gsap.from(h.children, { y: 50, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 80%' } }));
  reveal('.keyfacts > div', { y: 30 });
  reveal('.timeline li', { y: 30 });
  reveal('.card');
  reveal('.tile', { y: 40 });
  reveal('.dest-card', { y: 40 });
  reveal('.designer');
  reveal('.dish', { y: 40 });
  reveal('.worlds li', { y: 30 });
  reveal('.crop');
  reveal('.sound-line li', { y: 30 });
  reveal('.acard');
  reveal('.fcard');
  reveal('.ncard', { rotateX: -25 });

  $$('.story__step').forEach((step) => {
    gsap.from(step.children, { y: 60, opacity: 0, stagger: 0.08, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: step, start: 'top 75%', toggleActions: 'play none none reverse' } });
  });
  gsap.from('.history__media', { clipPath: 'inset(12% 10% 12% 10% round 24px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.history', start: 'top 60%' } });
  gsap.from('.coast__lead', { opacity: 0, y: 30, duration: 1.2, scrollTrigger: { trigger: '.coast__lead', start: 'top 85%' } });
  if (!reduceMotion) gsap.to('.nouchi__marquee-inner', { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
  gsap.from('.outro__inner > *', { y: 60, opacity: 0, stagger: 0.12, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.outro', start: 'top 60%' } });
}

function initInteractions() {
  // Cartes nouchi
  $$('.ncard').forEach((c) => c.addEventListener('click', () => c.setAttribute('aria-pressed', c.classList.toggle('is-flipped'))));
}

/* ------------------------------------------------------------------ */
/* 8. Préchargement                                                    */
/* ------------------------------------------------------------------ */
// Déjà venu pendant cette session ? On ne rejoue pas l'écran d'accueil.
const seenIntro = (() => {
  try {
    const seen = sessionStorage.getItem('akwaba-intro') === '1';
    sessionStorage.setItem('akwaba-intro', '1');
    return seen;
  } catch {
    return false;
  }
})();
const quickIntro = reduceMotion || seenIntro;

// Attend la police et une image, mais jamais plus de 1,2 s : le contenu passe avant l'animation
function preload() {
  const image = new Promise((res) => {
    const i = new Image();
    i.onload = i.onerror = res;
    i.src = local('basilique', true);
  });
  const ready = Promise.all([image, document.fonts?.ready]);
  const cap = new Promise((r) => setTimeout(r, 1200));
  const min = new Promise((r) => setTimeout(r, quickIntro ? 0 : 900));
  return Promise.all([Promise.race([ready, cap]), min]);
}

function intro() {
  if (quickIntro) {
    return preload().then(() => {
      gsap.to('.loader', { opacity: 0, duration: 0.35, onComplete: () => gsap.set('.loader', { display: 'none' }) });
      world?.morphTo('map', { duration: reduceMotion ? 0.01 : 2 });
    });
  }
  const count = { v: 0 };
  gsap
    .timeline()
    .to('.loader__flag span', { scaleY: 1, stagger: 0.1, duration: 0.6, ease: 'expo.out' })
    .from('.loader__word', { yPercent: 60, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.05)
    .from('.loader__sub', { opacity: 0, duration: 0.6 }, 0.3)
    .to(count, { v: 100, duration: 0.9, ease: 'power2.inOut', onUpdate: () => ($('.loader__count span').textContent = Math.round(count.v)) }, 0);

  return preload().then(
    () =>
      new Promise((resolve) => {
        gsap
          .timeline()
          .to('.loader > *', { yPercent: -40, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'expo.in' })
          .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' }, '-=0.15')
          .set('.loader', { display: 'none' })
          .add(resolve, '-=0.4') // la page devient utilisable pendant la fin de l'animation
          .from('.hero__title .line > span', { yPercent: 110, duration: 1.2, stagger: 0.1, ease: 'expo.out' }, '-=0.5')
          .from('.hero__eyebrow, .hero__lead, .hero__cta > *', { y: 30, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out' }, '-=1')
          .from('.hero__scroll', { opacity: 0, duration: 0.8 }, '-=0.8')
          // on anime le contenu du bandeau, pas le bandeau lui-même (sa position est gérée en CSS au scroll)
          .from('.nav > *', { y: -30, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out', clearProps: 'transform,opacity' }, '-=0.9');
        world?.morphTo('map', { duration: 2.6 });
      })
  );
}

/* ------------------------------------------------------------------ */
/* Démarrage                                                           */
/* ------------------------------------------------------------------ */
document.body.classList.add('is-loading');
renderContent();
initScroll();
initWorld();
initVideo();
initPosts();
initLightbox();
initDrawer((id) => ({ item: { id, ...ITEMS[id] }, group: itemsOf(ITEMS[id].group) }));
initCursor();

intro().then(() => {
  document.body.classList.remove('is-loading');
  lenis?.start();
  initNav({ onHide: () => world?.pause(), onShow: () => $('.webgl').style.opacity !== '0' && world?.resume() });
  initAnimations();
  initInteractions();
  initRooms();
  ScrollTrigger.refresh();
  // vidéos d'ambiance : vitesse de lecture (le lecteur YouTube la remet parfois à 1 à chaque boucle)
  const rate = () => $$('.bg-video iframe[data-rate]').forEach((f) => f.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [+f.dataset.rate] }), '*'));
  setInterval(rate, 1500);
  // Lecteur audio : le son joue sur place (lecteur YouTube invisible)
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.track');
    if (!b) return;
    const playing = b.getAttribute('aria-pressed') === 'true';
    $$('.track[aria-pressed="true"]').forEach((t) => {
      t.setAttribute('aria-pressed', 'false');
      t.querySelector('iframe')?.remove();
    });
    if (playing) return;
    b.setAttribute('aria-pressed', 'true');
    b.insertAdjacentHTML('beforeend', `<iframe class="track__audio" src="https://www.youtube-nocookie.com/embed/${b.dataset.track}?autoplay=1&playsinline=1" allow="autoplay" title="Lecteur audio" tabindex="-1" aria-hidden="true"></iframe>`);
  });
  // arrivée depuis une autre page (ex. ./#mode) : on rejoint la section demandée
  if (location.hash.length > 1 && $(location.hash)) requestAnimationFrame(() => scrollTo(location.hash));
});
