import './style.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleWorld } from './webgl/particles.js';
import { ILLUSTRATIONS } from './illustrations.js';
import { PHOTOS, PANORAMA, DESTINATIONS, BUILDINGS, DISHES, MENU, MENU_TABS, RESTAURANTS, CULTURE, NOUCHI, CAN, MUSIC, FESTIVALS, UNESCO, CREDITS, local, src } from './data.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const pad = (n) => String(n).padStart(2, '0');
// Photo, ou illustration au trait si aucune photo fiable n'existe
// <img> avec srcset pour les photos Unsplash (net sur tous les écrans)
const img = (image, alt, { lazy = true, sizes = '100vw', style = '', attrs = '' } = {}) =>
  `<img src="${src(image)}" ${image?.srcset ? `srcset="${image.srcset}" sizes="${sizes}"` : ''} alt="${alt}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async" ${style ? `style="${style}"` : ''} ${attrs} />`;
const visual = (item, alt, opts) =>
  item.illu ? `<div class="illu-box illu-box--${item.tone || 'night'}">${ILLUSTRATIONS[item.illu]}</div>` : img(item.img, alt, opts);
// Une vidéo YouTube supprimée renvoie une miniature grise de 120 px : on masque alors le bouton lecture
function checkVideo(el, id) {
  const probe = new Image();
  probe.onload = () => {
    if (probe.naturalWidth <= 120) {
      el.classList.add(el.classList[0] + '--novideo');
      el.removeAttribute('data-video');
      el.querySelector('[data-video]')?.removeAttribute('data-video');
    }
  };
  probe.src = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}
const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/* ------------------------------------------------------------------ */
/* 1. Contenu dynamique                                                */
/* ------------------------------------------------------------------ */
function renderContent() {
  $$('img[data-photo]').forEach((el) => {
    const p = PHOTOS[el.dataset.photo];
    el.src = p.src;
    if (p.srcset) {
      el.srcset = p.srcset;
      el.sizes = el.closest('.can-hero, .pano') ? '100vw' : '(max-width: 820px) 100vw, 50vw';
    }
  });
  $$('img[data-local]').forEach((img) => (img.src = local(img.dataset.local, true)));

  // Panorama
  $('.pano__slides').innerHTML = PANORAMA.map(
    (p, i) => `
    <figure class="pano__slide" style="z-index:${i + 1}">
      ${img(p.img, p.alt, { lazy: i > 1 })}
      <figcaption class="pano__caption">
        <p class="pano__place">${p.place}</p>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </figcaption>
      ${p.img.author ? `<span class="pano__credit">Photo : ${p.img.author}</span>` : ''}
    </figure>`
  ).join('');
  $('.pano__count em').textContent = pad(PANORAMA.length);

  $('.dest__track').innerHTML = DESTINATIONS.map(
    (d, i) => `
    <article class="dcard" data-cursor="Découvrir">
      <div class="dcard__media">
        <span class="dcard__num">${pad(i + 1)}</span>
        ${visual(d, d.name, { sizes: '(max-width: 820px) 85vw, 32vw' })}
        <span class="dcard__tag">${d.tag}</span>
      </div>
      <div class="dcard__body">
        <p class="dcard__region">${d.region}</p>
        <h3>${d.name}</h3>
        <p>${d.text}</p>
        <div class="dcard__chips">${d.see.map((s) => `<span>${s}</span>`).join('')}</div>
      </div>
    </article>`
  ).join('');

  $('.bento').innerHTML = BUILDINGS.map(
    (b) => `
    <article class="bcard ${b.size ? `bcard--${b.size}` : ''}">
      ${visual(b, b.name, { sizes: '(max-width: 820px) 100vw, 60vw' })}
      ${b.img?.author ? `<span class="bcard__credit">© ${b.img.author}</span>` : ''}
      <div class="bcard__body">
        <p class="bcard__meta">${b.meta}</p>
        <h3>${b.name}</h3>
        <p>${b.text}</p>
      </div>
    </article>`
  ).join('');

  $('.flavors__stack').innerHTML = DISHES.map(
    (d, i) => `
    <article class="dish">
      <span class="dish__shade"></span>
      <div class="dish__media">${img(d.img, d.name, { sizes: '(max-width: 820px) 100vw, 55vw', style: `object-position:${d.pos || 'center'}` })}</div>
      <div class="dish__body">
        <p class="dish__idx">${pad(i + 1)} / ${pad(DISHES.length)}</p>
        <h3>${d.name}</h3>
        <p class="dish__origin">${d.origin}</p>
        <p>${d.text}</p>
      </div>
    </article>`
  ).join('');

  $('.tabs').innerHTML = MENU_TABS.map(
    (t, i) => `<button class="tab" data-filter="${t.id}" aria-pressed="${i === 0}">${t.label}</button>`
  ).join('');
  $('.menu-grid').innerHTML = MENU.map(
    (m) => `
    <article class="mitem" data-cat="${m.cat}">
      <div class="mitem__img">
        ${m.img ? img(m.img, m.name, { sizes: '(max-width: 820px) 50vw, 25vw' }) : `<span class="mitem__placeholder">${m.name.split(' ')[0]}</span>`}
        <span class="mitem__cat">${MENU_TABS.find((t) => t.id === m.cat)?.label || m.cat}</span>
      </div>
      <h4>${m.name}</h4>
      <p class="mitem__origin">${m.origin}</p>
      <p>${m.text}</p>
    </article>`
  ).join('');

  $('.eat__list').innerHTML = RESTAURANTS.map(
    (r) => `
    <li class="eat__item">
      <h4>${r.name}</h4>
      <span class="eat__place">${r.place}</span>
      <p><span class="eat__type">${r.type}</span>${r.text}</p>
    </li>`
  ).join('');

  $('#culture .story__col').insertAdjacentHTML(
    'beforeend',
    CULTURE.map(
      (c) => `
    <div class="story__step">
      ${img(c.img, c.title, { sizes: '160px', attrs: 'class="culture-step__img"' })}
      <p class="eyebrow">${c.kicker}</p>
      <h3 class="story__h3">${c.title}</h3>
      <p>${c.text}</p>
    </div>`
    ).join('')
  );

  // Nouchi
  $('.nouchi__intro').innerHTML = NOUCHI.intro.map((p) => `<p>${p}</p>`).join('');
  $('.nouchi__marquee-inner').innerHTML = NOUCHI.glossary
    .map((g) => `<span>${g.word}</span><i class="dot"></i>`)
    .join('')
    .repeat(2);
  $('.nouchi__grid').innerHTML = NOUCHI.glossary.map(
    (g) => `
    <button class="ncard" aria-label="${g.word} : ${g.meaning}">
      <span class="ncard__face ncard__front">
        <span class="ncard__word">${g.word}</span>
        <span class="ncard__tap">Traduire ↻</span>
      </span>
      <span class="ncard__face ncard__back">
        <strong>${g.word}</strong>
        <p>${g.meaning}</p>
        ${g.example ? `<em>« ${g.example} »</em>` : ''}
      </span>
    </button>`
  ).join('');
  $('.nouchi__facts').innerHTML = NOUCHI.facts.map((f) => `<li>${f}</li>`).join('');

  // Festivals
  $('.marquee__inner').innerHTML = FESTIVALS.map((f) => `<span>${f.name}</span><i class="dot"></i>`).join('').repeat(4);

  // CAN 2023
  $('.story--can .story__col').insertAdjacentHTML(
    'beforeend',
    CAN.path.map(
      (m) => `
    <div class="story__step">
      <p class="eyebrow">${m.date}</p>
      ${m.score ? `<p class="match match--${m.result}">${m.score[0]} <small>à</small> ${m.score[1]} <small>${m.against}${m.note ? `, ${m.note}` : ''}</small></p>` : ''}
      <h3 class="story__h3">${m.title}</h3>
      <p>${m.text}</p>
    </div>`
    ).join('')
  );
  $('.can-stats').innerHTML = CAN.stats.map((st) => `<div><b><span data-count="${st.value}">0</span>${st.suffix || ''}</b><span>${st.label}</span></div>`).join('');
  $('.vgrid').innerHTML = CAN.videos.map(
    (v) => `
    <button class="vcard" data-video="${v.id}" data-cursor="Vidéo" aria-label="Voir la vidéo : ${v.title}">
      ${img(v.img, '', { sizes: '(max-width: 560px) 50vw, 25vw' })}
      <span class="vcard__play"></span>
      <span class="vcard__body">
        <span class="vcard__kind">${v.kind}</span>
        <span class="vcard__title">${v.title}</span>
        <p>${v.text}</p>
      </span>
    </button>`
  ).join('');
  $('.pstrip').innerHTML = CAN.photos.map((p, i) => `<figure>${img(p.img, 'Supporters en fête à Abidjan', { sizes: i ? '(max-width: 820px) 50vw, 25vw' : '(max-width: 820px) 100vw, 50vw' })}<figcaption>${p.caption}, photo ${p.img.author}</figcaption></figure>`).join('');

  // Musique
  $('.story--music .story__col').innerHTML = MUSIC.eras.map(
    (e) => `
    <div class="story__step">
      <p class="era__year">${e.year}</p>
      <span class="era__genre">${e.genre}</span>
      <h3 class="story__h3">${e.title}</h3>
      <p>${e.text}</p>
      <div class="era__artists">${e.artists.map((a) => `<span>${a}</span>`).join('')}</div>
    </div>`
  ).join('');
  $('.agrid').innerHTML = MUSIC.artists.map(
    (a) => `
    <button class="acard" data-video="${a.video}" data-cursor="Écouter" aria-label="Écouter ${a.name}, ${a.hit}">
      <span>
        <span class="acard__genre">${a.genre}</span>
        <span class="acard__name">${a.name}</span>
        <p>${a.text}</p>
      </span>
      <span class="acard__hit"><i></i>${a.hit}</span>
    </button>`
  ).join('');
  $('.mphotos').innerHTML = MUSIC.photos.map((p) => `<figure>${img(p.img, 'Musique et fête', { sizes: '(max-width: 820px) 50vw, 33vw' })}</figure>`).join('');
  $('.mfacts').innerHTML = MUSIC.facts.map((f) => `<li>${f}</li>`).join('');
  $$('.vcard, .acard').forEach((el) => checkVideo(el, el.dataset.video));
  $('.fest__grid').innerHTML = FESTIVALS.map(
    (f) => `
    <article class="fcard">
      <div class="fcard__media">
        <img src="${f.img ? src(f.img) : ytThumb(f.video)}" alt="${f.name}" loading="lazy" ${!f.img && f.video ? 'data-yt' : ''} />
        <span class="fcard__month">${f.period}</span>
        ${f.video ? `<button class="fcard__play" data-video="${f.video}" aria-label="Voir la vidéo : ${f.name}" data-cursor="Vidéo"><span></span></button>` : ''}
      </div>
      <div class="fcard__body">
        <h3>${f.name}</h3>
        <p class="fcard__place">${f.place}</p>
        <p>${f.text}</p>
        ${f.latest ? `<p class="fcard__latest">${f.latest}</p>` : ''}
      </div>
    </article>`
  ).join('');

  // Vidéo supprimée : YouTube renvoie une miniature grise de 120 px → on retire le bouton
  $$('img[data-yt]').forEach((img) => {
    const check = () => {
      if (img.naturalWidth && img.naturalWidth <= 120) {
        img.closest('.fcard').classList.add('fcard--novideo');
        img.closest('.fcard__media').querySelector('.fcard__play')?.remove();
        img.src = local('danse-masque', true);
      }
    };
    img.complete ? check() : img.addEventListener('load', check);
    img.addEventListener('error', () => img.remove());
  });

  $('.unesco__list').innerHTML = UNESCO.map(
    (u) => `
    <li class="unesco__item" data-img="${src(u.img)}">
      <span class="unesco__year">${u.year}</span>
      <span class="unesco__name">${u.name}</span>
      <span class="unesco__type">${u.type}</span>
    </li>`
  ).join('');

  $('.footer__credits').innerHTML = CREDITS.map((c) => (c.url ? `<a href="${c.url}" target="_blank" rel="noopener">${c.author}</a>` : c.author)).join(', ');
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
  if (lenis) lenis.scrollTo(target, { duration: 1.8 });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  else document.querySelector(target)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

/* ------------------------------------------------------------------ */
/* 4. Monde WebGL                                                      */
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
        world?.morphTo(sec.dataset.shape);
        const hide = sec.hasAttribute('data-hide-world');
        $('.webgl').style.opacity = hide ? 0 : 1;
        hide ? world?.pause() : world?.resume();
        $$('.nav__links a').forEach((a) => {
          const target = document.querySelector(a.getAttribute('href'));
          const on = target && (target === sec || target.dataset.room === sec.dataset.room);
          on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
        });
        $('.wayfinder__num').textContent = sec.dataset.room;
        $('.wayfinder__name').textContent = sec.dataset.roomName;
        wf.classList.toggle('is-visible', sec.dataset.room !== '00');
        citiesOn = sec.hasAttribute('data-show-cities');
        labels.classList.toggle('is-visible', citiesOn);
      },
    });
  });

  gsap.to('.wayfinder__bar i', { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

  // Étiquettes des villes sur la carte finale
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
        const flip = c.x > window.innerWidth * 0.6; // étiquette à gauche près du bord droit
        els[i].classList.toggle('city-label--left', flip);
        els[i].style.transform = `translate(${c.x}px, ${c.y + (c.dy || 0)}px) translate(${flip ? '-100%' : '0'}, -50%)`;
      });
    });
  }
}

/* ------------------------------------------------------------------ */
/* 5. Animations des sections                                           */
/* ------------------------------------------------------------------ */
function initHero() {
  gsap.to('.hero__inner', {
    yPercent: -25,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__meta, .hero__scroll', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '30% top', scrub: true },
  });
}

function initRevealText() {
  $$('[data-reveal-words]').forEach((el) => {
    const words = splitWords(el);
    gsap.to(words, {
      color: '#fff8ee',
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  });

  $$('[data-reveal-chars]').forEach((el) => {
    const chars = splitChars(el);
    gsap.from(chars, {
      yPercent: 110,
      opacity: 0,
      rotate: 8,
      stagger: 0.025,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });
}

function initCounters() {
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
          duration: end > 100 ? 2.4 : 1.6,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = end >= 1900 && end <= 2100 ? Math.round(obj.v) : fmt.format(Math.round(obj.v))),
        }),
    });
  });

  gsap.from('.stat', {
    y: 60,
    opacity: 0,
    stagger: 0.12,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.stats', start: 'top 85%' },
  });
}

function initPanorama() {
  const slides = $$('.pano__slide');
  const sec = $('.pano');
  sec.style.height = `${slides.length * 80 + 40}vh`;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: sec,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const i = Math.min(slides.length, Math.floor(self.progress * slides.length * 0.999) + 1);
        $('.pano__count span').textContent = pad(i);
      },
    },
  });
  slides.forEach((slide, i) => {
    const img = $('img', slide);
    const cap = $('.pano__caption', slide);
    const at = i;
    if (i === 0) {
      // la première image s'ouvre depuis une carte centrée (effet « keynote »)
      tl.fromTo(slide, { clipPath: 'inset(22% 18% 22% 18% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.6 }, 0);
      tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1 }, 0);
      tl.from(cap.children, { y: 60, opacity: 0, stagger: 0.05, duration: 0.3 }, 0.35);
    } else {
      tl.fromTo(slide, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6 }, at);
      tl.fromTo(img, { scale: 1.3, yPercent: 8 }, { scale: 1, yPercent: 0, duration: 1 }, at);
      tl.from(cap.children, { y: 80, opacity: 0, stagger: 0.05, duration: 0.3 }, at + 0.35);
      // l'image précédente recule
      tl.to($('img', slides[i - 1]), { yPercent: -12, opacity: 0.35, duration: 0.6 }, at);
    }
  });
  tl.to({}, { duration: 0.4 });
}

function initDestinations() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 821px)', () => {
    const track = $('.dest__track');
    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.dest',
        pin: '.dest__sticky',
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set('.dest__progress i', { scaleX: self.progress }),
      },
    });
    $$('.dcard').forEach((card) => {
      if (!$('img', card)) return;
      gsap.fromTo(
        $('img', card),
        { xPercent: -6 },
        { xPercent: 6, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }
      );
    });
  });
  gsap.from('.dest__head > *', {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.dest', start: 'top 70%' },
  });
}

function initCity() {
  gsap.from('.city__head > *', { y: 50, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.city', start: 'top 70%' } });
  $$('.bcard').forEach((card) => {
    gsap.from(card, { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 90%' } });
    const img = $('img', card);
    if (img) gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: card, scrub: true } });
  });
}

function initCanAndMusic() {
  gsap.fromTo('.can-hero__bg', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.can-hero', scrub: true } });
  gsap.from('.can-hero__inner > *', { y: 70, opacity: 0, stagger: 0.15, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.can-hero', start: 'top 55%' } });
  gsap.from('.stars svg', { scale: 0, rotate: -90, stagger: 0.12, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: '.can-hero', start: 'top 45%' } });
  const reveal = (sel) =>
    ScrollTrigger.batch(sel, {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.from(els, { y: 70, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out' }),
    });
  reveal('.can-stats > div');
  reveal('.vcard');
  reveal('.pstrip figure');
  reveal('.acard');
  reveal('.mphotos figure');
  reveal('.mfacts li');
  gsap.from('.music-head > *', { y: 60, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.music-head', start: 'top 70%' } });
}

function initStories() {
  $$('.story__step').forEach((step) => {
    gsap.from(step.children, {
      y: 60,
      opacity: 0,
      stagger: 0.08,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: step, start: 'top 75%', toggleActions: 'play none none reverse' },
    });
  });
  $$('.story__photo img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, scrub: true } });
  });
}

function initCoast() {
  gsap.from('.coast__card', {
    y: 120,
    opacity: 0,
    stagger: 0.15,
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.coast__cards', start: 'top 85%' },
  });
  gsap.from('.coast__lead', { opacity: 0, y: 30, duration: 1.2, scrollTrigger: { trigger: '.coast__lead', start: 'top 85%' } });
}

function initFlavors() {
  const dishes = $$('.dish');
  dishes.forEach((dish, i) => {
    const next = dishes[i + 1];
    if (!next) return;
    const st = { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true };
    gsap.to(dish, { scale: 0.92, ease: 'none', scrollTrigger: st });
    gsap.to($('.dish__shade', dish), { opacity: 0.45, ease: 'none', scrollTrigger: { ...st } });
  });
  gsap.from('.flavors__head > *', {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.flavors', start: 'top 70%' },
  });

  // Filtres de la carte
  const items = $$('.mitem');
  $$('.tab').forEach((tab) =>
    tab.addEventListener('click', () => {
      $$('.tab').forEach((t) => t.setAttribute('aria-pressed', t === tab));
      const f = tab.dataset.filter;
      const shown = items.filter((it) => f === 'all' || it.dataset.cat === f);
      items.forEach((it) => (it.hidden = !shown.includes(it)));
      gsap.fromTo(shown, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.7, ease: 'expo.out' });
      ScrollTrigger.refresh();
    })
  );
  ScrollTrigger.batch(items, {
    start: 'top 92%',
    once: true,
    onEnter: (els) => gsap.from(els, { y: 50, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out' }),
  });
  gsap.from('.eat__item', { y: 40, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.eat__list', start: 'top 85%' } });
}

function initNouchi() {
  $$('.ncard').forEach((c) => {
    c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', () => c.setAttribute('aria-pressed', c.classList.toggle('is-flipped')));
  });
  ScrollTrigger.batch('.ncard', {
    start: 'top 92%',
    once: true,
    onEnter: (els) => gsap.from(els, { y: 60, rotateX: -25, opacity: 0, stagger: 0.05, duration: 1.1, ease: 'expo.out' }),
  });
  const inner = $('.nouchi__marquee-inner');
  if (!reduceMotion) gsap.to(inner, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
  gsap.from('.nouchi__intro p, .nouchi__facts li', {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 1.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.nouchi__intro', start: 'top 85%' },
  });
}

function initFestivals() {
  const inner = $('.marquee__inner');
  const loop = gsap.to(inner, { xPercent: -25, duration: 22, ease: 'none', repeat: -1, paused: reduceMotion });
  ScrollTrigger.create({
    trigger: '.fest',
    onUpdate: (self) => {
      const v = self.getVelocity() / 600;
      gsap.to(loop, { timeScale: 1 + Math.abs(v), duration: 0.3, overwrite: true });
      gsap.to(inner, { skewX: gsap.utils.clamp(-12, 12, -v * 3), duration: 0.4, overwrite: 'auto' });
    },
  });
  ScrollTrigger.batch('.fcard', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.from(els, { y: 80, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out' }),
  });
}

function initUnesco() {
  gsap.from('.unesco__item', {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.unesco__list', start: 'top 80%' },
  });
  if (isTouch) return;
  const preview = $('.unesco__preview');
  const img = $('img', preview);
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });
  window.addEventListener('pointermove', (e) => {
    xTo(e.clientX + 30);
    yTo(e.clientY - 110);
  });
  $$('.unesco__item').forEach((it) => {
    it.addEventListener('pointerenter', () => {
      img.src = it.dataset.img;
      gsap.to(preview, { opacity: 1, scale: 1, rotate: -3, duration: 0.5, ease: 'expo.out' });
    });
    it.addEventListener('pointerleave', () => gsap.to(preview, { opacity: 0, scale: 0.8, rotate: 0, duration: 0.4 }));
  });
}

function initTravel() {
  gsap.from('.tcard', {
    y: 80,
    opacity: 0,
    stagger: 0.08,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.travel__grid', start: 'top 85%' },
  });
  gsap.from('.outro__inner > *', {
    y: 60,
    opacity: 0,
    stagger: 0.12,
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.outro', start: 'top 60%' },
  });
}

/* ------------------------------------------------------------------ */
/* 6. Interface                                                        */
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
      nav.classList.toggle('is-hidden', y > last && y > 400 && !document.body.classList.contains('menu-open'));
      last = y;
    },
  });

  const toTop = $('.to-top');
  ScrollTrigger.create({
    start: () => window.innerHeight,
    end: 'max',
    onToggle: ({ isActive }) => toTop.classList.toggle('is-visible', isActive),
  });
  toTop.addEventListener('click', () => {
    scrollTo(0);
    $('.nav__logo').focus({ preventScroll: true });
  });

  // Onglet en arrière-plan : on arrête la 3D pour économiser la batterie
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) world?.pause();
    else if ($('.webgl').style.opacity !== '0') world?.resume();
  });

  const burger = $('.nav__burger');
  const menu = $('.menu');
  const toggle = (open) => {
    if (open === document.body.classList.contains('menu-open')) return;
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.setAttribute('aria-hidden', !open);
    menu.inert = !open;
    // le reste de la page devient inactif tant que le menu est ouvert
    ['main', '.footer', '.nav__logo', '.nav__links', '.to-top'].forEach((sel) => $(sel) && ($(sel).inert = open));
    open ? lenis?.stop() : lenis?.start();
    if (open) {
      gsap.from('.menu__list li', { y: 40, opacity: 0, stagger: 0.04, duration: 0.9, ease: 'expo.out', delay: 0.25 });
      setTimeout(() => $('.menu__list a')?.focus({ preventScroll: true }), 300);
    } else burger.focus({ preventScroll: true });
  };
  document.addEventListener('keydown', (e) => e.key === 'Escape' && document.body.classList.contains('menu-open') && toggle(false));
  burger.addEventListener('click', () => toggle(!document.body.classList.contains('menu-open')));

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      e.preventDefault();
      toggle(false);
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
    const t = e.target.closest('[data-cursor]');
    cursor.classList.toggle('is-big', !!t);
    label.textContent = t ? t.dataset.cursor : '';
  });

  // Boutons magnétiques
  $$('.btn').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.5, ease: 'power3' });
    });
    btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }));
  });
}

function initVideo() {
  const modal = $('.video-modal');
  const frame = $('.video-modal__frame');
  let opener = null;
  const setBackground = (off) => ['main', '.nav', '.footer', '.to-top'].forEach((sel) => $(sel) && ($(sel).inert = off));
  const close = () => {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    setBackground(false);
    frame.innerHTML = '';
    lenis?.start();
    opener?.focus({ preventScroll: true });
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-video]');
    if (!b) return;
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.video}?autoplay=1&rel=0" title="Vidéo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    opener = b;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.inert = false;
    setBackground(true);
    lenis?.stop();
    $('.video-modal__close').focus({ preventScroll: true });
  });
  $('.video-modal__close').addEventListener('click', close);
  modal.addEventListener('click', (e) => e.target === modal && close());
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    // le focus boucle entre le bouton Fermer et le lecteur
    if (e.key === 'Tab') {
      e.preventDefault();
      const btn = $('.video-modal__close');
      const iframe = $('iframe', frame);
      (document.activeElement === btn && iframe ? iframe : btn).focus();
    }
  });
}

/* ------------------------------------------------------------------ */
/* 7. Préchargement & intro                                            */
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

// Attend la police et l'image du hero, mais jamais plus de 1,2 s : le contenu passe avant l'animation
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
    return preload().then(
      () =>
        new Promise((resolve) => {
          gsap.to('.loader', { opacity: 0, duration: 0.35, onComplete: () => gsap.set('.loader', { display: 'none' }) });
          world?.morphTo('map', { duration: reduceMotion ? 0.01 : 2 });
          resolve();
        })
    );
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
          .from('.hero__meta li, .hero__scroll', { opacity: 0, x: 20, stagger: 0.06, duration: 0.8 }, '-=0.8')
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
initCursor();

intro().then(() => {
  document.body.classList.remove('is-loading');
  lenis?.start();
  initNav();
  initHero();
  initRevealText();
  initCounters();
  initPanorama();
  initDestinations();
  initCity();
  initStories();
  initCanAndMusic();
  initCoast();
  initFlavors();
  initNouchi();
  initFestivals();
  initUnesco();
  initTravel();
  initRooms();
  ScrollTrigger.refresh();
});
