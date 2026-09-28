import './style.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleWorld } from './webgl/particles.js';
import { ILLUSTRATIONS } from './illustrations.js';
import { PHOTOS, BUILDINGS, MENU, MENU_TABS, RESTAURANTS, CULTURE, NOUCHI, CAN, MUSIC, CREDITS, local, src } from './data.js';
import { REGIONS, EVENTS, MONTHS, SEASONS, ITINERARIES } from './voyage.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const attr = (str = '') => String(str).replace(/"/g, '&quot;').replace(/<[^>]+>/g, '');
// « du Centre », « de l’Est », « d’Abidjan »
const ofRegion = (r) => (r.id === 'abidjan' ? 'd’Abidjan' : r.name.startsWith('L’') ? `de l’${r.name.slice(2)}` : r.name.replace('Le ', 'du '));

/* ------------------------------------------------------------------ */
/* Images                                                               */
/* ------------------------------------------------------------------ */
// <img> avec srcset pour les photos Unsplash, et les infos pour la visionneuse
const img = (image, alt, { lazy = true, sizes = '100vw', style = '', attrs = '', zoom = false, caption = '' } = {}) =>
  `<img src="${src(image)}" ${image?.srcset ? `srcset="${image.srcset}" sizes="${sizes}"` : ''} alt="${attr(alt)}" ${
    lazy ? 'loading="lazy"' : 'fetchpriority="high"'
  } decoding="async" ${style ? `style="${style}"` : ''} ${
    zoom ? `data-zoom data-caption="${attr(caption || alt)}" ${image?.author ? `data-credit="Photo : ${attr(image.author)}"` : ''}` : ''
  } ${attrs} />`;
// Photo, ou illustration au trait quand aucune photo fiable n'existe
const visual = (item, alt, opts) =>
  item.illu ? `<div class="illu-box illu-box--${item.tone || 'night'}">${ILLUSTRATIONS[item.illu]}</div>` : img(item.img, alt, opts);

// Une vidéo YouTube supprimée renvoie une miniature grise de 120 px : on retire alors la lecture
function checkVideo(el, id) {
  const probe = new Image();
  probe.onload = () => {
    if (probe.naturalWidth <= 120) {
      el.classList.add('is-novideo');
      el.removeAttribute('data-video');
    }
  };
  probe.src = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}

const pin = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
const arrow = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* ------------------------------------------------------------------ */
/* 1. Construction de la page                                          */
/* ------------------------------------------------------------------ */
const placeCard = (p, region) => `
  <button class="card card--place" data-place="${p.id}" data-region="${region.id}" data-cursor="Découvrir" aria-haspopup="dialog">
    <span class="card__media">
      ${visual(p, p.name, { sizes: '(max-width: 820px) 85vw, 30vw' })}
      ${p.unesco ? `<span class="badge">UNESCO ${p.unesco}</span>` : ''}
    </span>
    <span class="card__body">
      <span class="card__kicker">${p.kicker}</span>
      <span class="card__title">${p.name}</span>
      <span class="card__text">${p.text}</span>
      <span class="card__more">Voir la fiche ${arrow}</span>
    </span>
  </button>`;

const cultureCard = (c) => `
  <figure class="card card--culture">
    <span class="card__media">${
      c.illu ? visual(c, c.title) : `<button class="zoom-btn" aria-label="Agrandir : ${attr(c.title)}">${img(c.img, c.alt || c.title, { sizes: '(max-width: 820px) 85vw, 30vw', zoom: true })}</button>`
    }</span>
    <figcaption class="card__body">
      <span class="card__kicker">${c.kicker}</span>
      <span class="card__title">${c.title}</span>
      <span class="card__text">${c.text}</span>
    </figcaption>
  </figure>`;

const eventCard = (e) => `
  <article class="card card--event">
    ${
      e.video
        ? `<button class="card__media" data-video="${e.video}" data-cursor="Vidéo" aria-label="Voir la vidéo : ${attr(e.name)}">
            <img src="https://i.ytimg.com/vi/${e.video}/hqdefault.jpg" alt="" loading="lazy" decoding="async" />
            <span class="play-badge" aria-hidden="true"></span>
          </button>`
        : `<span class="card__media">${img(e.img, e.name, { sizes: '(max-width: 820px) 85vw, 25vw' })}</span>`
    }
    <span class="card__body">
      <span class="card__kicker">${e.period}, ${e.place}</span>
      <span class="card__title">${e.name}</span>
      <span class="card__text">${e.text}</span>
      ${e.latest ? `<span class="card__note">${e.latest}</span>` : ''}
    </span>
  </article>`;

function useTemplate(id, region) {
  const frag = $(`#block-${id}`).content.cloneNode(true);
  $$('section', frag).forEach((sec) => {
    sec.dataset.region = region.id;
    sec.dataset.room = region.step;
    sec.dataset.roomName = region.name;
  });
  return frag;
}

function buildChapters() {
  const root = $('#chapitres');
  REGIONS.forEach((r) => {
    const shared = `data-region="${r.id}" data-room="${r.step}" data-room-name="${r.name}"`;
    root.insertAdjacentHTML(
      'beforeend',
      `
      <section class="chapter" id="${r.id}" data-shape="map" data-focus="${r.id}" ${shared} tabindex="-1">
        <div class="chapter__inner">
          <p class="chapter__step"><span>Étape ${r.step} sur ${REGIONS.length}</span><span>${r.days}</span></p>
          <h2 class="chapter__title">${r.title}</h2>
          <p class="chapter__tagline">${r.tagline}</p>
          <p class="chapter__route">${pin}${r.route}</p>
        </div>
      </section>
      <section class="postcard" data-shape="map" data-focus="${r.id}" data-hide-world ${shared}>
        <button class="postcard__media" aria-label="Agrandir : ${attr(r.hero.caption)}">
          ${img(r.hero.img, r.hero.caption, { sizes: '100vw', zoom: true })}
        </button>
        <p class="postcard__caption">${r.hero.caption}</p>
      </section>
      <section class="places" data-shape="map" data-focus="${r.id}" ${shared}>
        <div class="block-head">
          <p class="eyebrow">À voir</p>
          <h3 class="section-title">Les incontournables<br /><em>${ofRegion(r)}</em></h3>
        </div>
        <div class="cards">${r.places.map((p) => placeCard(p, r)).join('')}</div>
      </section>`
    );

    r.blocks.forEach((b) => {
      if (b === 'centreCulture' || b === 'northCulture') {
        const list = CULTURE[b === 'centreCulture' ? 'centre' : 'nord'];
        root.insertAdjacentHTML(
          'beforeend',
          `<section class="culture" data-shape="map" data-focus="${r.id}" ${shared}>
            <div class="block-head">
              <p class="eyebrow">Savoir-faire</p>
              <h3 class="section-title">${b === 'centreCulture' ? 'L’art<br /><em>du pays baoulé</em>' : 'Les mains<br /><em>du Nord</em>'}</h3>
            </div>
            <div class="cards" data-gallery="${r.id}-culture">${list.map(cultureCard).join('')}</div>
          </section>`
        );
      } else root.append(useTemplate(b, r));
    });

    if (r.events.length) {
      root.insertAdjacentHTML(
        'beforeend',
        `<section class="events" data-shape="map" data-focus="${r.id}" ${shared}>
          <div class="block-head">
            <p class="eyebrow">À vivre</p>
            <h3 class="section-title">Les fêtes<br /><em>${ofRegion(r)}</em></h3>
          </div>
          <div class="cards cards--events">${r.events.map((id) => eventCard(EVENTS[id])).join('')}</div>
        </section>`
      );
    }
  });
}

function renderContent() {
  // Navigation et plan du voyage
  $('.nav__links').innerHTML =
    REGIONS.map((r) => `<a href="#${r.id}" data-region-link="${r.id}">${r.name}</a>`).join('') + '<a href="#partir" data-region-link="partir">Partir</a>';
  $('.menu__list').innerHTML =
    `<li><a href="#voyage"><small>0</small>Le voyage</a></li>` +
    REGIONS.map((r) => `<li><a href="#${r.id}"><small>${r.step}</small>${r.name}<span>${r.days}</span></a></li>`).join('') +
    `<li><a href="#partir"><small>6</small>Partir</a></li>`;
  $('.route').innerHTML = REGIONS.map(
    (r) => `
    <li><a href="#${r.id}" class="route__stop">
      <span class="route__num">${r.step}</span>
      <span class="route__name">${r.name}<small>${r.days}</small></span>
      <span class="route__text">${r.places.map((p) => p.name.split(' et ')[0]).join(', ')}</span>
    </a></li>`
  ).join('');

  buildChapters();

  $$('img[data-photo]').forEach((el) => {
    const p = PHOTOS[el.dataset.photo];
    el.src = p.src;
    if (p.srcset) {
      el.srcset = p.srcset;
      el.sizes = el.closest('.can-hero') ? '100vw' : '(max-width: 820px) 100vw, 50vw';
    }
    if (el.hasAttribute('data-zoom') && p.author) el.dataset.credit = `Photo : ${p.author}`;
  });

  // Abidjan aujourd'hui
  $('.bento').innerHTML = BUILDINGS.map(
    (b) => `
    <article class="bcard ${b.size ? `bcard--${b.size}` : ''}">
      ${b.illu ? visual(b, b.name) : `<button class="zoom-btn" aria-label="Agrandir : ${attr(b.name)}">${img(b.img, b.name, { sizes: '(max-width: 820px) 100vw, 40vw', zoom: true })}</button>`}
      <div class="bcard__body">
        <p class="bcard__meta">${b.meta}</p>
        <h4>${b.name}</h4>
        <p>${b.text}</p>
      </div>
    </article>`
  ).join('');

  // À table : une seule carte, les incontournables en premier
  const menu = [...MENU].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  $('.menu-card__count span').textContent = menu.length;
  $('.tabs').innerHTML = MENU_TABS.map((t, i) => `<button class="tab" data-filter="${t.id}" aria-pressed="${i === 0}">${t.label}</button>`).join('');
  $('.menu-grid').innerHTML = menu
    .map(
      (m) => `
    <article class="mitem ${m.featured ? 'mitem--featured' : ''}" data-cat="${m.cat}">
      <div class="mitem__img">
        ${
          m.img
            ? `<button class="zoom-btn" aria-label="Agrandir : ${attr(m.name)}">${img(m.img, m.name, {
                sizes: m.featured ? '(max-width: 820px) 100vw, 50vw' : '(max-width: 820px) 50vw, 25vw',
                zoom: true,
                style: `object-position:${m.pos || 'center'}`,
              })}</button>`
            : `<span class="mitem__placeholder" aria-hidden="true">${m.name.split(' ')[0]}</span>`
        }
        <span class="mitem__cat">${MENU_TABS.find((t) => t.id === m.cat)?.label || m.cat}</span>
      </div>
      <h4>${m.name}</h4>
      <p class="mitem__origin">${m.origin}</p>
      <p>${m.text}</p>
    </article>`
    )
    .join('');
  $('.eat__list').innerHTML = RESTAURANTS.map(
    (r) => `
    <li class="eat__item">
      <h5>${r.name}</h5>
      <span class="eat__place">${r.place}</span>
      <p><span class="eat__type">${r.type}</span>${r.text}</p>
    </li>`
  ).join('');

  // Musique
  $('.story--music .story__col').innerHTML = MUSIC.eras
    .map(
      (e) => `
    <div class="story__step">
      <p class="era__year">${e.year}</p>
      <span class="era__genre">${e.genre}</span>
      <h4 class="story__h3">${e.title}</h4>
      <p>${e.text}</p>
      <div class="era__artists">${e.artists.map((a) => `<span>${a}</span>`).join('')}</div>
    </div>`
    )
    .join('');
  $('.agrid').innerHTML = MUSIC.artists
    .map(
      (a) => `
    <button class="acard" data-video="${a.video}" data-cursor="Écouter" aria-label="Écouter ${attr(a.name)}, ${attr(a.hit)}">
      <span>
        <span class="acard__genre">${a.genre}</span>
        <span class="acard__name">${a.name}</span>
        <span class="acard__text">${a.text}</span>
      </span>
      <span class="acard__hit"><i></i>${a.hit}</span>
    </button>`
    )
    .join('');
  $('.mfacts').innerHTML = MUSIC.facts.map((f) => `<li>${f}</li>`).join('');

  // Nouchi
  $('.nouchi__intro').innerHTML = NOUCHI.intro.map((p) => `<p>${p}</p>`).join('');
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
  $('.nouchi__facts').innerHTML = NOUCHI.facts.map((f) => `<li>${f}</li>`).join('');

  // CAN 2023
  $('.story--can .story__col').insertAdjacentHTML(
    'beforeend',
    CAN.path
      .map(
        (m) => `
    <div class="story__step">
      <p class="eyebrow">${m.date}</p>
      ${m.score ? `<p class="match match--${m.result}">${m.score[0]} <small>à</small> ${m.score[1]} <small>${m.against}${m.note ? `, ${m.note}` : ''}</small></p>` : ''}
      <h5 class="story__h3">${m.title}</h5>
      <p>${m.text}</p>
    </div>`
      )
      .join('')
  );
  $('.can-stats').innerHTML = CAN.stats.map((st) => `<div><b><span data-count="${st.value}">0</span>${st.suffix || ''}</b><span>${st.label}</span></div>`).join('');
  $('.vgrid').innerHTML = CAN.videos
    .map(
      (v) => `
    <button class="vcard" data-video="${v.id}" data-cursor="Vidéo" aria-label="Voir la vidéo : ${attr(v.title)}">
      ${img(v.img, '', { sizes: '(max-width: 560px) 50vw, 25vw' })}
      <span class="vcard__play" aria-hidden="true"></span>
      <span class="vcard__body">
        <span class="vcard__kind">${v.kind}</span>
        <span class="vcard__title">${v.title}</span>
        <span class="vcard__text">${v.text}</span>
      </span>
    </button>`
    )
    .join('');
  $('.pstrip').innerHTML = CAN.photos
    .map(
      (p, i) =>
        `<figure><button class="zoom-btn" aria-label="Agrandir la photo ${i + 1}">${img(p.img, 'Supporters en fête à Abidjan', {
          sizes: i ? '(max-width: 820px) 50vw, 25vw' : '(max-width: 820px) 100vw, 50vw',
          zoom: true,
          caption: `${p.caption}, la ville fête ses champions`,
        })}</button><figcaption>${p.caption}</figcaption></figure>`
    )
    .join('');

  // Masques de l'Ouest
  $('.story--culture .story__col').insertAdjacentHTML(
    'beforeend',
    CULTURE.ouest
      .map(
        (c) => `
    <div class="story__step">
      <button class="culture-step__btn" aria-label="Agrandir : ${attr(c.title)}">${img(c.img, c.title, { sizes: '180px', zoom: true, attrs: 'class="culture-step__img"' })}</button>
      <p class="eyebrow">${c.kicker}</p>
      <h4 class="story__h3">${c.title}</h4>
      <p>${c.text}</p>
    </div>`
      )
      .join('')
  );

  // Partir : calendrier et itinéraires
  $('.calendar').innerHTML = MONTHS.map((m, i) => {
    const events = Object.values(EVENTS).filter((e) => e.months.includes(i + 1));
    return `
      <div class="month month--${SEASONS[i]}" role="listitem">
        <span class="month__name">${m}</span>
        <span class="month__bar" aria-hidden="true"></span>
        ${events.map((e) => `<span class="month__event">${e.name}</span>`).join('')}
      </div>`;
  }).join('');
  $('.itins').innerHTML = ITINERARIES.map(
    (it) => `
    <article class="itin">
      <p class="itin__len">${it.name}</p>
      <h4>${it.title}</h4>
      <p class="itin__text">${it.text}</p>
      <ol class="itin__days">${it.days.map((d) => `<li><span>${d.d}</span><b>${d.place}</b><small>${d.what}</small></li>`).join('')}</ol>
    </article>`
  ).join('');

  $('.footer__steps').innerHTML =
    REGIONS.map((r) => `<li><a href="#${r.id}"><small>${r.step}</small>${r.name}</a></li>`).join('') + '<li><a href="#partir"><small>6</small>Partir</a></li>';
  $('.footer__credits').innerHTML = CREDITS.map((c) => `<a href="${c.url}" target="_blank" rel="noopener">${c.author}</a>`).join(', ');

  $$('[data-video]').forEach((el) => el.dataset.video !== '_VrWeJov7jM' && checkVideo(el, el.dataset.video));
}

/* ------------------------------------------------------------------ */
/* 2. Découpage du texte                                               */
/* ------------------------------------------------------------------ */
function splitWords(el) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) return frag.append(part);
          const s = document.createElement('span');
          s.className = 'w';
          s.textContent = part;
          frag.append(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) walk(child);
    });
  };
  walk(el);
  return $$('.w', el);
}

function splitChars(el) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...child.textContent].forEach((ch) => {
          const s = document.createElement('span');
          s.className = 'c';
          s.textContent = ch === ' ' ? ' ' : ch;
          frag.append(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') walk(child);
    });
  };
  walk(el);
  return $$('.c', el);
}

/* ------------------------------------------------------------------ */
/* 3. Défilement fluide                                                */
/* ------------------------------------------------------------------ */
let lenis;
function initScroll() {
  if (reduceMotion) return;
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6 });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  else document.querySelector(target)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

/* ------------------------------------------------------------------ */
/* 4. Fenêtres (menu, vidéo, visionneuse, fiche lieu)                  */
/* Un seul endroit gère l'arrière-plan inactif, le focus piégé,         */
/* la touche Échap et le retour du focus sur le bouton d'origine.       */
/* ------------------------------------------------------------------ */
const BACKGROUND = ['main', '.nav', '.footer', '.to-top'];
const modalStack = [];

function openModal(el, { focus, onClose, keep = [] } = {}) {
  modalStack.push({ el, opener: document.activeElement, onClose });
  el.classList.add('is-open');
  el.setAttribute('aria-hidden', 'false');
  el.inert = false;
  BACKGROUND.forEach((sel) => {
    if (!keep.includes(sel) && $(sel)) $(sel).inert = true;
  });
  lenis?.stop();
  requestAnimationFrame(() => (focus || $('button, a', el))?.focus({ preventScroll: true }));
}

function closeModal(el) {
  const i = modalStack.findIndex((m) => m.el === el);
  if (i < 0) return;
  const [m] = modalStack.splice(i, 1);
  el.classList.remove('is-open');
  el.setAttribute('aria-hidden', 'true');
  el.inert = true;
  if (!modalStack.length) {
    BACKGROUND.forEach((sel) => $(sel) && ($(sel).inert = false));
    lenis?.start();
  }
  m.onClose?.();
  m.opener?.focus?.({ preventScroll: true });
}

document.addEventListener('keydown', (e) => {
  const top = modalStack[modalStack.length - 1];
  if (!top) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeModal(top.el);
  } else if (e.key === 'Tab') {
    // le focus reste dans la fenêtre ouverte
    const extra = top.el.classList.contains('menu') ? [$('.nav__burger')] : [];
    const items = [...extra, ...$$('button:not([disabled]), a[href], iframe', top.el)].filter((n) => n.offsetParent !== null && !n.hidden);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

function initVideo() {
  const modal = $('.video-modal');
  const frame = $('.video-modal__frame');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-video]');
    if (!b) return;
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.video}?autoplay=1&rel=0" title="Vidéo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    openModal(modal, { focus: $('.video-modal__close'), onClose: () => (frame.innerHTML = '') });
  });
  $('.video-modal__close').addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', (e) => e.target === modal && closeModal(modal));
}

/* Visionneuse : toute image marquée data-zoom s'ouvre en grand, avec légende et crédit */
function initLightbox() {
  const box = $('.lightbox');
  const image = $('img', box);
  let items = [];
  let index = 0;

  const largest = (el) => {
    const set = el.getAttribute('srcset');
    if (!set) return el.currentSrc || el.src;
    const parts = set.split(',').map((s) => s.trim().split(' ')[0]);
    return parts[parts.length - 1];
  };
  const show = (i) => {
    index = (i + items.length) % items.length;
    const el = items[index];
    image.src = largest(el);
    image.alt = el.alt;
    $('.lightbox__caption', box).textContent = el.dataset.caption || el.alt;
    $('.lightbox__credit', box).textContent = el.dataset.credit || '';
    $('.lightbox__count', box).textContent = items.length > 1 ? `${index + 1} / ${items.length}` : '';
    $$('.lightbox__nav', box).forEach((n) => (n.hidden = items.length < 2));
    if (!reduceMotion) gsap.fromTo(image, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.zoom-btn, .postcard__media, .culture-step__btn, .story__photo, .can-hero__bg');
    if (!trigger) return;
    const el = $('img[data-zoom]', trigger);
    if (!el) return;
    const group = trigger.closest('[data-gallery]');
    items = group ? $$('img[data-zoom]', group) : [el];
    show(items.indexOf(el));
    if (!box.classList.contains('is-open')) openModal(box, { focus: $('.lightbox__close', box) });
  });
  $('.lightbox__close', box).addEventListener('click', () => closeModal(box));
  $('.lightbox__nav--prev', box).addEventListener('click', () => show(index - 1));
  $('.lightbox__nav--next', box).addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (e) => (e.target === box || e.target.classList.contains('lightbox__figure')) && closeModal(box));
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });
  // glisser du doigt pour changer de photo
  let startX = null;
  box.addEventListener('pointerdown', (e) => (startX = e.clientX));
  box.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50 && items.length > 1) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
}

/* Fiche d'un lieu : ce qu'on y fait, comment y aller, quand y aller */
function initDrawer() {
  const drawer = $('.drawer');
  const open = (regionId, placeId) => {
    const region = REGIONS.find((r) => r.id === regionId);
    const i = region.places.findIndex((p) => p.id === placeId);
    const p = region.places[i];
    const next = region.places[(i + 1) % region.places.length];
    $('.drawer__media', drawer).innerHTML = p.illu
      ? visual(p, p.name)
      : `<button class="zoom-btn" aria-label="Agrandir la photo">${img(p.img, p.name, { sizes: '(max-width: 820px) 100vw, 560px', lazy: false, zoom: true })}</button>`;
    $('.drawer__body', drawer).innerHTML = `
      <p class="card__kicker">${region.name}, ${p.kicker}</p>
      <h2 id="drawer-title" class="drawer__title">${p.name}</h2>
      ${p.unesco ? `<p class="badge badge--inline">Patrimoine mondial de l’UNESCO depuis ${p.unesco}</p>` : ''}
      <p class="drawer__text">${p.text}</p>
      <h3 class="drawer__h">Ce qu’on y fait</h3>
      <ul class="drawer__todo">${p.todo.map((t) => `<li>${t}</li>`).join('')}</ul>
      <dl class="drawer__facts">
        <div><dt>Comment y aller</dt><dd>${p.access}</dd></div>
        <div><dt>Quand y aller</dt><dd>${p.when}</dd></div>
      </dl>
      ${region.places.length > 1 ? `<button class="btn btn--primary drawer__next" data-next="${next.id}">Lieu suivant : ${next.name} ${arrow}</button>` : ''}`;
    $('.drawer__panel', drawer).scrollTop = 0;
    const btn = $('.drawer__next', drawer);
    btn?.addEventListener('click', () => open(regionId, btn.dataset.next));
    if (!drawer.classList.contains('is-open')) openModal(drawer, { focus: $('.drawer__close', drawer) });
    else $('.drawer__close', drawer).focus();
  };
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-place]');
    if (card) open(card.dataset.region, card.dataset.place);
    if (e.target.closest('.drawer [data-close]')) closeModal(drawer);
  });
}

/* ------------------------------------------------------------------ */
/* 5. Monde 3D et suivi du voyage                                      */
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
  const wf = $('.wayfinder');
  const labels = $('.city-labels');
  let citiesOn = false;

  $$('[data-shape]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: ({ isActive }) => {
        if (!isActive) return;
        const region = REGIONS.find((r) => r.id === sec.dataset.focus);
        world?.setFocus(region ? region.focus : null);
        world?.morphTo(sec.dataset.shape);
        const hide = sec.hasAttribute('data-hide-world');
        $('.webgl').style.opacity = hide ? 0 : 1;
        hide ? world?.pause() : world?.resume();

        const step = +sec.dataset.room || 0;
        const inTrip = step >= 1 && step <= REGIONS.length;
        $('.wayfinder__num').textContent = inTrip ? `${step}/${REGIONS.length}` : '';
        $('.wayfinder__name').textContent = sec.dataset.roomName;
        wf.classList.toggle('is-visible', step > 0);
        const current = sec.dataset.region || (step > REGIONS.length ? 'partir' : '');
        $$('[data-region-link]').forEach((a) => (a.dataset.regionLink === current ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));

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

  gsap.to('.wayfinder__bar i', { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

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
const reveal = (sel, opts = {}) =>
  ScrollTrigger.batch(sel, {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.from(els, { y: 60, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', ...opts }),
  });

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

  // Ouverture de chapitre
  $$('.chapter').forEach((ch) => {
    gsap.from($$('.chapter__inner > *', ch), { y: 70, opacity: 0, stagger: 0.1, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: ch, start: 'top 65%' } });
  });
  // Carte postale : l'image s'ouvre en grand en arrivant à l'écran
  $$('.postcard').forEach((pc) => {
    const media = $('.postcard__media', pc);
    gsap.fromTo(media, { clipPath: 'inset(10% 8% 10% 8% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: pc, start: 'top bottom', end: 'top top', scrub: true } });
    gsap.fromTo($('img', media), { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: pc, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  $$('.block-head').forEach((h) => gsap.from(h.children, { y: 50, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 80%' } }));
  reveal('.route li');
  reveal('.card');
  reveal('.bcard');
  reveal('.mitem', { y: 40 });
  reveal('.eat__item', { y: 30 });
  reveal('.acard');
  reveal('.vcard');
  reveal('.pstrip figure');
  reveal('.can-stats > div');
  reveal('.mfacts li');
  reveal('.month', { y: 30, stagger: 0.03 });
  reveal('.itin');
  reveal('.tcard');
  reveal('.ncard', { rotateX: -25 });

  $$('.story__step').forEach((step) => {
    gsap.from(step.children, { y: 60, opacity: 0, stagger: 0.08, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: step, start: 'top 75%', toggleActions: 'play none none reverse' } });
  });
  $$('.bcard img').forEach((im) => gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: im.closest('.bcard'), scrub: true } }));

  gsap.fromTo('.can-hero__bg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.can-hero', scrub: true } });
  gsap.from('.can-hero__inner > *', { y: 70, opacity: 0, stagger: 0.15, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.can-hero', start: 'top 55%' } });
  gsap.from('.stars svg', { scale: 0, rotate: -90, stagger: 0.12, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: '.can-hero', start: 'top 45%' } });
  gsap.from('.coast__lead', { opacity: 0, y: 30, duration: 1.2, scrollTrigger: { trigger: '.coast__lead', start: 'top 85%' } });
  if (!reduceMotion) gsap.to('.nouchi__marquee-inner', { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
  gsap.from('.outro__inner > *', { y: 60, opacity: 0, stagger: 0.12, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.outro', start: 'top 60%' } });
}

function initInteractions() {
  // Filtres de la carte
  const items = $$('.mitem');
  $$('.tab').forEach((tab) =>
    tab.addEventListener('click', () => {
      $$('.tab').forEach((t) => t.setAttribute('aria-pressed', t === tab));
      const f = tab.dataset.filter;
      const shown = items.filter((it) => f === 'all' || it.dataset.cat === f);
      items.forEach((it) => (it.hidden = !shown.includes(it)));
      $('.menu-card__count span').textContent = shown.length;
      if (!reduceMotion) gsap.fromTo(shown, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.7, ease: 'expo.out' });
      ScrollTrigger.refresh();
    })
  );
  // Cartes nouchi
  $$('.ncard').forEach((c) => c.addEventListener('click', () => c.setAttribute('aria-pressed', c.classList.toggle('is-flipped'))));
}

/* ------------------------------------------------------------------ */
/* 7. Navigation                                                        */
/* ------------------------------------------------------------------ */
function initNav() {
  const nav = $('.nav');
  let last = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 60);
      nav.classList.toggle('is-hidden', y > last && y > 400 && !modalStack.length);
      last = y;
    },
  });

  const toTop = $('.to-top');
  ScrollTrigger.create({ start: () => window.innerHeight, end: 'max', onToggle: ({ isActive }) => toTop.classList.toggle('is-visible', isActive) });
  toTop.addEventListener('click', () => {
    scrollTo(0);
    $('.nav__logo').focus({ preventScroll: true });
  });

  // Onglet en arrière-plan : la 3D s'arrête pour économiser la batterie
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) world?.pause();
    else if ($('.webgl').style.opacity !== '0') world?.resume();
  });

  // Menu plein écran : le bouton reste accessible pour le refermer
  const burger = $('.nav__burger');
  const menu = $('.menu');
  const setBurger = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    $('.nav__logo').inert = open;
    $('.nav__links').inert = open;
  };
  burger.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) return closeModal(menu);
    setBurger(true);
    openModal(menu, { keep: ['.nav'], focus: $('.menu__list a', menu), onClose: () => setBurger(false) });
    gsap.from('.menu__list li', { y: 40, opacity: 0, stagger: 0.04, duration: 0.9, ease: 'expo.out', delay: 0.2 });
  });

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      e.preventDefault();
      if (menu.classList.contains('is-open')) closeModal(menu);
      scrollTo(href === '#top' ? 0 : href);
      const target = href === '#top' ? $('main') : $(href);
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    })
  );
}

function initCursor() {
  if (isTouch) return;
  const cursor = $('.cursor');
  const label = $('.cursor__label');
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], .zoom-btn, .postcard__media, .culture-step__btn');
    cursor.classList.toggle('is-big', !!t);
    label.textContent = t ? t.dataset.cursor || 'Agrandir' : '';
  });
  $$('.btn').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.5, ease: 'power3' });
    });
    btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }));
  });
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
initLightbox();
initDrawer();
initCursor();

intro().then(() => {
  document.body.classList.remove('is-loading');
  lenis?.start();
  initNav();
  initAnimations();
  initInteractions();
  initRooms();
  ScrollTrigger.refresh();
});
