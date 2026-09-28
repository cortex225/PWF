import './style.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleWorld } from './webgl/particles.js';
import { MuseumGallery } from './webgl/gallery.js';
import { PHOTOS, GALLERY, DESTINATIONS, DISHES, CULTURE, FESTIVALS, UNESCO, CREDITS, local } from './data.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const pad = (n) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ */
/* 1. Contenu dynamique                                                */
/* ------------------------------------------------------------------ */
function renderContent() {
  $$('img[data-photo]').forEach((img) => (img.src = PHOTOS[img.dataset.photo].src));
  $$('img[data-local]').forEach((img) => (img.src = local(img.dataset.local, true)));

  $('.dest__track').innerHTML = DESTINATIONS.map(
    (d, i) => `
    <article class="dcard" data-cursor="Découvrir">
      <div class="dcard__media">
        <span class="dcard__num">${pad(i + 1)}</span>
        <img src="${d.img}" alt="${d.name}" loading="lazy" />
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

  $('.flavors__stack').innerHTML = DISHES.map(
    (d, i) => `
    <article class="dish">
      <span class="dish__shade"></span>
      <div class="dish__media"><img src="${d.img}" alt="${d.name}" loading="lazy" style="object-position:${d.pos || 'center'}" /></div>
      <div class="dish__body">
        <p class="dish__idx">${pad(i + 1)} / ${pad(DISHES.length)}</p>
        <h3>${d.name}</h3>
        <p class="dish__origin">${d.origin}</p>
        <p>${d.text}</p>
      </div>
    </article>`
  ).join('');

  $('#culture .story__col').insertAdjacentHTML(
    'beforeend',
    CULTURE.map(
      (c) => `
    <div class="story__step">
      <img class="culture-step__img" src="${c.img}" alt="${c.title}" loading="lazy" />
      <p class="eyebrow">${c.kicker}</p>
      <h3 class="story__h3">${c.title}</h3>
      <p>${c.text}</p>
    </div>`
    ).join('')
  );

  $('.fest__grid').innerHTML = FESTIVALS.map(
    (f) => `
    <article class="fcard">
      <p class="fcard__month">${f.month}</p>
      <h3>${f.name}</h3>
      <p class="fcard__place">${f.place}</p>
      <p>${f.text}</p>
    </article>`
  ).join('');

  $('.unesco__list').innerHTML = UNESCO.map(
    (u) => `
    <li class="unesco__item" data-img="${u.img}">
      <span class="unesco__year">${u.year}</span>
      <span class="unesco__name">${u.name}</span>
      <span class="unesco__type">${u.type}</span>
    </li>`
  ).join('');

  $('.footer__credits').innerHTML = CREDITS.map((c) => `<a href="${c.url}?utm_source=ma-cote-divoire&utm_medium=referral" target="_blank" rel="noopener">${c.author}</a>`).join(', ');

  const marquee = $('.marquee__inner');
  marquee.textContent = marquee.textContent.repeat(4);
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
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
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
        els[i].style.transform = `translate(${c.x}px, ${c.y + (c.dy || 0)}px) translateY(-50%)`;
      });
    });
  }
}

/* ------------------------------------------------------------------ */
/* 5. Animations de salles                                             */
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
      opacity: 1,
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

function initGallery() {
  const canvas = $('.gallery__canvas');
  const cartel = $('.cartel');
  let gallery;
  try {
    gallery = new MuseumGallery(canvas, GALLERY, {
      onActive: (i) => {
        if (i < 0) return cartel.classList.remove('is-visible');
        const a = GALLERY[i];
        $('.cartel__idx span').textContent = pad(i + 1);
        $('.cartel__title').textContent = a.title;
        $('.cartel__place').textContent = `${a.place} — ${a.year}`;
        $('.cartel__text').textContent = a.text;
        cartel.classList.add('is-visible');
      },
    });
  } catch (e) {
    console.warn('Galerie 3D indisponible', e);
    return;
  }
  ScrollTrigger.create({
    trigger: '.gallery',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: ({ isActive }) => (isActive ? gallery.start() : gallery.stop()),
  });
  ScrollTrigger.create({
    trigger: '.gallery',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      gallery.setProgress(self.progress);
      gsap.set('.gallery__progress i', { scaleX: self.progress });
    },
  });
  gsap.to('.gallery__intro', {
    opacity: 0,
    y: -40,
    ease: 'none',
    scrollTrigger: { trigger: '.gallery', start: 'top top', end: '+=60%', scrub: true },
  });
  ScrollTrigger.addEventListener('refresh', () => gallery.resize());
  document.fonts?.ready.then(() => gallery.resize());
}

function initDestinations() {
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
  // parallaxe interne des photos
  $$('.dcard').forEach((card) => {
    gsap.fromTo(
      $('img', card),
      { xPercent: -6 },
      {
        xPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      }
    );
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
}

function initFestivals() {
  const inner = $('.marquee__inner');
  const loop = gsap.to(inner, { xPercent: -25, duration: 22, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    trigger: '.fest',
    onUpdate: (self) => {
      const v = self.getVelocity() / 600;
      gsap.to(loop, { timeScale: 1 + Math.abs(v), duration: 0.3, overwrite: true });
      gsap.to(inner, { skewX: gsap.utils.clamp(-12, 12, -v * 3), duration: 0.4, overwrite: 'auto' });
    },
  });
  gsap.from('.fcard', {
    y: 80,
    opacity: 0,
    stagger: 0.1,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.fest__grid', start: 'top 80%' },
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

  const burger = $('.nav__burger');
  const toggle = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    $('.menu').setAttribute('aria-hidden', !open);
    open ? lenis?.stop() : lenis?.start();
    if (open) gsap.from('.menu__list li', { y: 40, opacity: 0, stagger: 0.04, duration: 0.9, ease: 'expo.out', delay: 0.25 });
  };
  burger.addEventListener('click', () => toggle(!document.body.classList.contains('menu-open')));

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      e.preventDefault();
      toggle(false);
      scrollTo(href === '#top' ? 0 : href);
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
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    frame.innerHTML = '';
    lenis?.start();
  };
  $$('[data-video]').forEach((b) =>
    b.addEventListener('click', () => {
      frame.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/_VrWeJov7jM?autoplay=1&rel=0" title="Film de présentation de la Côte d\'Ivoire" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      lenis?.stop();
    })
  );
  $('.video-modal__close').addEventListener('click', close);
  modal.addEventListener('click', (e) => e.target === modal && close());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && modal.classList.contains('is-open') && close());
}

/* ------------------------------------------------------------------ */
/* 7. Préchargement & intro                                            */
/* ------------------------------------------------------------------ */
function preload() {
  const imgs = [local('plateau-aerien'), local('basilique')].map(
    (src) =>
      new Promise((res) => {
        const i = new Image();
        i.onload = i.onerror = res;
        i.src = src;
      })
  );
  const minTime = new Promise((r) => setTimeout(r, reduceMotion ? 200 : 1800));
  return Promise.all([...imgs, document.fonts?.ready, minTime]);
}

function intro() {
  const count = { v: 0 };
  const tl = gsap.timeline();
  tl.to('.loader__flag span', { scaleY: 1, stagger: 0.12, duration: 0.8, ease: 'expo.out' })
    .from('.loader__word', { yPercent: 60, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.1)
    .from('.loader__sub', { opacity: 0, duration: 1 }, 0.5)
    .to(count, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => ($('.loader__count span').textContent = Math.round(count.v)) }, 0);

  return preload().then(
    () =>
      new Promise((resolve) => {
        const out = gsap.timeline({ onComplete: resolve });
        out
          .to('.loader > *', { yPercent: -40, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'expo.in' })
          .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.2')
          .set('.loader', { display: 'none' })
          .from('.hero__title .line > span', { yPercent: 110, duration: 1.4, stagger: 0.12, ease: 'expo.out' }, '-=0.6')
          .from('.hero__eyebrow, .hero__lead, .hero__cta > *', { y: 30, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out' }, '-=1.1')
          .from('.hero__meta li, .hero__scroll', { opacity: 0, x: 20, stagger: 0.08, duration: 1 }, '-=0.9')
          .from('.nav', { yPercent: -100, opacity: 0, duration: 1, ease: 'expo.out' }, '-=1');
        world?.morphTo('map', { duration: 3 });
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
  initGallery();
  initDestinations();
  initStories();
  initCoast();
  initFlavors();
  initFestivals();
  initUnesco();
  initTravel();
  initRooms();
  ScrollTrigger.refresh();
});
