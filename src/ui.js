// Briques communes à toutes les pages : images, fenêtres, visionneuse,
// fiche latérale, défilement, navigation, curseur et apparitions.
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ILLUSTRATIONS } from './illustrations.js';
import { CREDITS, src } from './data.js';
import { NAV, SECTIONS, PAGES, SOURCES } from './content.js';

gsap.registerPlugin(ScrollTrigger);

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = window.matchMedia('(pointer: coarse)').matches;
export const attr = (str = '') => String(str).replace(/"/g, '&quot;').replace(/<[^>]+>/g, '');

/* ------------------------------------------------------------------ */
/* Images                                                               */
/* ------------------------------------------------------------------ */
// <img> avec srcset pour les photos Unsplash, et les infos pour la visionneuse
export const img = (image, alt, { lazy = true, sizes = '100vw', style = '', attrs = '', zoom = false, caption = '' } = {}) =>
  `<img src="${src(image)}" ${image?.srcset ? `srcset="${image.srcset}" sizes="${sizes}"` : ''} alt="${attr(alt)}" ${
    lazy ? 'loading="lazy"' : 'fetchpriority="high"'
  } decoding="async" ${style ? `style="${style}"` : ''} ${
    zoom ? `data-zoom data-caption="${attr(caption || alt)}" ${image?.author ? `data-credit="Photo : ${attr(image.author)}"` : ''}` : ''
  } ${attrs} />`;
// Photo, ou illustration au trait quand aucune photo fiable n'existe
export const visual = (item, alt, opts) =>
  item.illu ? `<div class="illu-box illu-box--${item.tone || 'night'}">${ILLUSTRATIONS[item.illu]}</div>` : img(item.img, alt, opts);

// Une vidéo YouTube supprimée renvoie une miniature grise de 120 px : on retire alors la lecture
export function checkVideo(el, id) {
  const probe = new Image();
  probe.onload = () => {
    if (probe.naturalWidth <= 120) {
      el.classList.add('is-novideo');
      el.removeAttribute('data-video');
    }
  };
  probe.src = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}

export const pin = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
export const arrow = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

// Emplacement réservé tant que la photo ou la vidéo n'est pas fournie
export const ph = (label, { light = false, video = false } = {}) =>
  `<span class="ph${light ? ' ph--light' : ''}${video ? ' ph--video' : ''}"><span class="ph__label">${label}</span></span>`;
// Photo, illustration au trait, ou emplacement réservé
export const media = (item, alt, opts = {}) => (item.img || item.illu ? visual(item, alt, opts) : ph(item.ph || alt, opts));
// Emplacements prévus pour les posts Instagram / TikTok (phase embeds)
// plus d'emplacements vides : seules les vraies publications s'affichent
export const embedSlots = () => '';

/* ------------------------------------------------------------------ */
/* 2. Découpage du texte                                               */
/* ------------------------------------------------------------------ */
export function splitWords(el) {
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

export function splitChars(el) {
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
export let lenis;
export function initScroll() {
  if (reduceMotion) return;
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

export function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6 });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  else document.querySelector(target)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

/* ------------------------------------------------------------------ */
/* 4. Fenêtres (menu, vidéo, visionneuse, fiche lieu)                  */
/* Un seul endroit gère l'arrière-plan inactif, le focus piégé,         */
/* la touche Échap et le retour du focus sur le bouton d'origine.       */
/* ------------------------------------------------------------------ */
export const BACKGROUND = ['main', '.nav', '.footer', '.to-top'];
export const modalStack = [];

export function openModal(el, { focus, onClose, keep = [] } = {}) {
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

export function closeModal(el) {
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

export function initVideo() {
  const modal = $('.video-modal');
  const frame = $('.video-modal__frame');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-video]');
    if (!b) return;
    // « ig:ID » : reel Instagram (format vertical), sinon identifiant YouTube
    const v = b.dataset.video;
    const file = v.startsWith('file:');
    const ig = v.startsWith('ig:');
    frame.innerHTML = file
      ? `<video src="${/^https?:/.test(v.slice(5)) ? v.slice(5) : import.meta.env.BASE_URL + v.slice(5)}" controls autoplay playsinline preload="metadata"></video>`
      : ig
      ? `<iframe src="https://www.instagram.com/reel/${b.dataset.video.slice(3)}/embed/" title="Vidéo Instagram" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen scrolling="no"></iframe>`
      : `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.video}?autoplay=1&rel=0" title="Vidéo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    frame.classList.toggle('video-modal__frame--vertical', ig);
    frame.classList.toggle('video-modal__frame--file', file);
    frame.querySelector('video')?.play().catch(() => {});
    openModal(modal, { focus: $('.video-modal__close'), onClose: () => (frame.innerHTML = '') });
  });
  $('.video-modal__close').addEventListener('click', () => closeModal(modal));
  // Plein écran : double-clic sur la vidéo (le bouton du lecteur reste disponible)
  const fullscreen = () => {
    const v = $('video', frame);
    if (!v) return;
    if (document.fullscreenElement) return document.exitFullscreen();
    if (v.requestFullscreen) v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.();
  };
  frame.addEventListener('dblclick', fullscreen);
  modal.addEventListener('click', (e) => e.target === modal && closeModal(modal));
}

/* Visionneuse : toute image marquée data-zoom s'ouvre en grand, avec légende et crédit */
export function initLightbox() {
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


/* ------------------------------------------------------------------ */
/* Publications Instagram / TikTok, intégrées directement dans le cadre */
/* (l'iframe ne se charge qu'à l'approche de l'écran : loading="lazy")  */
/* ------------------------------------------------------------------ */
const PLATFORMS = {
  tiktok: {
    label: 'TikTok',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z"/></svg>',
    // lecteur officiel : fonctionne à toutes les tailles, sans script tiers
    embed: (p) => `https://www.tiktok.com/player/v1/${p.id}?description=0&music_info=0&rel=0`,
  },
  instagram: {
    label: 'Instagram',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21 8.1c-.1-1.5-.4-2.8-1.5-3.9S17.1 2.8 15.6 2.7C14.1 2.6 9.9 2.6 8.4 2.7 6.9 2.8 5.6 3.1 4.5 4.2S3 6.6 2.9 8.1c-.1 1.5-.1 5.7 0 7.2.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.5.1 5.7.1 7.2 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.5.1-5.7.1-7.2zM19.2 17a3 3 0 0 1-1.7 1.7c-1.2.5-3.9.4-5.2.4s-4 .1-5.2-.4A3 3 0 0 1 5.4 17c-.5-1.2-.4-3.9-.4-5.2s-.1-4 .4-5.2a3 3 0 0 1 1.7-1.7c1.2-.5 3.9-.4 5.2-.4s4-.1 5.2.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 3.9.4 5.2s.1 4-.4 5.2z"/></svg>',
    // l'intégration Instagram fait au moins 326 px de large : on la met à l'échelle du cadre
    embed: (p) => `https://www.instagram.com/${p.kind || 'reel'}/${p.id}/embed/`,
  },
};
PLATFORMS.youtube = {
  label: 'YouTube',
  icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15.1V8.9l5.4 3.1-5.4 3.1z"/></svg>',
  embed: (p) => `https://www.youtube-nocookie.com/embed/${p.id}?rel=0&playsinline=1`,
};
const IG_WIDTH = 326;

export const postCard = (p) => {
  // photo placée dans un cadre de publication
  if (p.img)
    return `<figure class="post post--photo"><button class="post__frame zoom-btn" aria-label="Agrandir : ${attr(p.caption)}">${img(p.img, p.caption, { sizes: '260px', zoom: true })}</button>${p.caption ? `<figcaption class="post__meta">${p.caption}</figcaption>` : ''}</figure>`;
  const pf = PLATFORMS[p.platform];
  return `
  <figure class="post post--${p.platform}${p.wide ? ' post--wide' : ''}">
    <div class="post__frame">
      <iframe src="${pf.embed(p)}" title="Publication ${pf.label} de @${attr(p.author)}" loading="lazy" scrolling="no"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
    </div>
    <figcaption class="post__meta">
      <span class="post__platform">${pf.icon}@${p.author}</span>
      <a href="${p.url}" target="_blank" rel="noopener">Ouvrir</a>
    </figcaption>
  </figure>`;
};

// Publications réelles, complétées par des emplacements réservés
export const postsBlock = (list = [], extra = 0) =>
  list.length || extra ? `<div class="posts">${list.map(postCard).join('')}${Array.from({ length: extra }, (_, i) => `<span class="embed-slot">${ph(`Post Instagram / TikTok ${list.length + i + 1}`, { video: true })}</span>`).join('')}</div>` : '';

export function initPosts() {
  // Instagram ne connaît pas la taille du cadre : on dessine à 326 px puis on réduit à la largeur disponible
  const fit = (frame) => {
    const f = $('iframe', frame);
    const h = +f.dataset.h || 600;
    // dans une grande tuile, la publication tient dans la hauteur disponible
    const box = frame.closest('.tile--lead');
    const k = box ? Math.min(box.clientWidth / IG_WIDTH, (box.clientHeight - 40) / h) : frame.clientWidth / IG_WIDTH;
    if (box) frame.style.width = `${IG_WIDTH * k}px`;
    f.style.height = `${h}px`;
    f.style.transform = `scale(${k})`;
    frame.style.height = `${h * k}px`;
  };
  const ro = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target)));
  new MutationObserver(() => $$('.post--instagram .post__frame:not([data-fit])').forEach((fr) => {
    fr.dataset.fit = '';
    ro.observe(fr);
    fit(fr);
  })).observe(document.body, { childList: true, subtree: true });
  // L'intégration Instagram envoie sa hauteur réelle
  window.addEventListener('message', (e) => {
    if (!/^https:\/\/([a-z]+\.)?instagram\.com$/.test(e.origin)) return;
    let data;
    try {
      data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    } catch {
      return;
    }
    if (data?.type !== 'MEASURE' || !data.details?.height) return;
    const f = $$('.post--instagram iframe').find((x) => x.contentWindow === e.source);
    if (!f) return;
    f.dataset.h = data.details.height;
    fit(f.parentElement);
  });
}

/* Fiche latérale générique : `resolve(id)` renvoie { item, group } */
export function initDrawer(resolve) {
  const drawer = $('.drawer');
  const open = (id) => {
    const { item: p, group = [] } = resolve(id);
    const i = group.findIndex((g) => g.id === id);
    const next = group[(i + 1) % group.length];
    $('.drawer__media', drawer).innerHTML =
      p.img && !p.illu
        ? `<button class="zoom-btn" aria-label="Agrandir la photo">${img(p.img, p.name, { sizes: '(max-width: 820px) 100vw, 560px', lazy: false, zoom: true })}</button>`
        : media(p, p.name, { video: p.video });
    $('.drawer__body', drawer).innerHTML = `
      <p class="card__kicker">${p.kicker || ''}</p>
      <h2 id="drawer-title" class="drawer__title">${p.name}</h2>
      <p class="drawer__text">${p.text || ''}</p>
      ${p.facts ? `<dl class="drawer__facts">${p.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
      ${p.todo ? `<h3 class="drawer__h">${p.todoTitle || 'Ce qu’on y fait'}</h3><ul class="drawer__todo">${p.todo.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}
      ${p.steps ? `<h3 class="drawer__h">Recette</h3><ol class="drawer__steps">${p.steps.map((t) => `<li>${t}</li>`).join('')}</ol>` : ''}
      ${p.gallery?.some((g) => typeof g !== 'string') ? `<h3 class="drawer__h">Galerie</h3><div class="drawer__gallery" data-gallery>${p.gallery.filter((g) => typeof g !== 'string').map((g) => (`<button class="drawer__thumb zoom-btn" aria-label="Agrandir : ${attr(g.caption)}">${img(g.img, g.caption, { sizes: '280px', zoom: true })}</button>`)).join('')}</div>` : ''}
      ${p.posts?.length ? `<h3 class="drawer__h">Sur les réseaux</h3>${postsBlock(p.posts)}` : ''}
      ${group.length > 1 ? `<button class="btn btn--primary drawer__next" data-next="${next.id}">Suivant : ${next.name} ${arrow}</button>` : ''}`;
    $('.drawer__panel', drawer).scrollTop = 0;
    const btn = $('.drawer__next', drawer);
    btn?.addEventListener('click', () => open(btn.dataset.next));
    if (!drawer.classList.contains('is-open')) openModal(drawer, { focus: $('.drawer__close', drawer) });
    else $('.drawer__close', drawer).focus();
  };
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-item]');
    if (card) open(card.dataset.item);
    if (e.target.closest('.drawer [data-close]')) closeModal(drawer);
  });
}

export const reveal = (sel, opts = {}) =>
  ScrollTrigger.batch(sel, {
    start: 'top 90%',
    once: true,
    onEnter: (els) => {
      gsap.set(els, { transition: 'none' });
      gsap.from(els, { y: 60, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', ...opts, clearProps: 'transform,opacity,transition' });
    },
  });

/* ------------------------------------------------------------------ */
/* 7. Navigation                                                        */
/* ------------------------------------------------------------------ */
export function initNav({ onHide, onShow } = {}) {
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
    if (document.hidden) onHide?.();
    else onShow?.();
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


export function initCursor() {
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
/* Habillage commun : navigation, menu plein écran, pied de page        */
/* `page` : 'home' sur l'accueil, sinon l'id de la page courante         */
/* ------------------------------------------------------------------ */
export function renderShell(page = 'home') {
  const home = page === 'home';
  const href = (n) => (n.page ? n.page : home ? `#${n.id}` : `./#${n.id}`);
  $('.nav__links').innerHTML = NAV.map(
    (n) => `<a href="${href(n)}" data-nav-link="${n.id}" ${!home && n.id === page ? 'aria-current="page"' : ''}>${n.label}</a>`
  ).join('');
  const sections = SECTIONS.map((s) => ({ ...s, href: home ? `#${s.id}` : `./#${s.id}` }));
  const list = [...sections, ...PAGES.map((p) => ({ label: `${p.label} <em>page</em>`, href: p.page }))];
  const items = list.map((s, i) => `<li><a href="${s.href}"><small>${String(i + 1).padStart(2, '0')}</small>${s.label}</a></li>`).join('');
  $('.menu__list').innerHTML = items;
  $('.footer__steps').innerHTML = items;
  const credit = (c) => (c.url ? `<a href="${c.url}" target="_blank" rel="noopener">${c.author}</a>` : c.author);
  $('.footer__credits').innerHTML = `<b>Unsplash :</b> ${CREDITS.map(credit).join(', ')}<br /><b>Autres sources :</b> ${SOURCES.filter((c) => !c.author.startsWith('Source à préciser')).map(credit).join(' · ')}`;
}
