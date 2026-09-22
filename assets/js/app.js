/* ═══════════════════════════════════════════════════════════════
   ASTRO ASHWINI — APP SHELL
   Nav chrome, cart store, drawer, toasts, reveal, PWA.
   ═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

const CFG = window.ASTRO_CONFIG || {};
const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

/* ---------- helpers ---------- */
const money = n => CFG.currency + Number(n).toLocaleString('en-IN');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
  c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

/* ---------- icons ---------- */
const I = {
  home:'<path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  shop:'<path d="M3 7h18l-1.5 12.2a2 2 0 0 1-2 1.8H6.5a2 2 0 0 1-2-1.8z"/><path d="M8.5 7V5.5a3.5 3.5 0 0 1 7 0V7"/>',
  spark:'<path d="M12 2.5 14.1 9l6.4 2.1-6.4 2.1L12 19.6 9.9 13.2 3.5 11.1 9.9 9z"/>',
  user:'<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.4 11.4a1.8 1.8 0 0 0 1.8 1.4h8.3a1.8 1.8 0 0 0 1.8-1.4L21 7H6"/>',
  phone:'<path d="M21.5 16.9v2.7a1.8 1.8 0 0 1-2 1.8 17.9 17.9 0 0 1-7.8-2.8 17.6 17.6 0 0 1-5.4-5.4A17.9 17.9 0 0 1 3.5 5.3a1.8 1.8 0 0 1 1.8-2H8a1.8 1.8 0 0 1 1.8 1.6c.1 1 .3 1.9.6 2.8a1.8 1.8 0 0 1-.4 1.9L8.8 10.9a14.4 14.4 0 0 0 5.4 5.4l1.3-1.3a1.8 1.8 0 0 1 1.9-.4c.9.3 1.8.5 2.8.6a1.8 1.8 0 0 1 1.6 1.8z"/>',
  wa:'<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1.1.3-3.6-.8-3.9-3.6-4-3.8-1-1.4-1-2.6.6-1.8.9-2.1a.9.9 0 0 1 .6-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5-.3.3c-.1.2-.2.3 0 .6a9 9 0 0 0 1.6 2 7.5 7.5 0 0 0 2.1 1.3c.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2 1c.2.1.4.2.4.3s0 .3-.1.5z"/>',
  insta:'<rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.2"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/>',
  close:'<path d="M18 6 6 18M6 6l12 12"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  pin:'<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-13M9 7V4h6v3"/>'
};
const svg = (k, cls) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
    stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}"` : ''} aria-hidden="true">${I[k] || ''}</svg>`;

/* ---------- navigation model ---------- */
const NAV = [
  { href:'index.html',    label:'Home',     icon:'home'  },
  { href:'shop.html',     label:'Shop',     icon:'shop'  },
  { href:'services.html', label:'Services', icon:'spark' },
  { href:'about.html',    label:'About',    icon:'user'  },
  { href:'contact.html',  label:'Contact',  icon:'phone' }
];
const here = () => {
  const f = location.pathname.split('/').pop();
  return (!f || f === '' || f === 'index.html') ? 'index.html' : f;
};

/* ═══════════════════════════════════════════════════
   CART
   ═══════════════════════════════════════════════════ */
const KEY = 'astro_cart_v1';
const Cart = {
  items: [],
  load() {
    try { this.items = JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { this.items = []; }
    // drop lines whose product no longer exists
    const ids = new Set((window.PRODUCTS || []).map(p => p.id));
    if (ids.size) this.items = this.items.filter(l => ids.has(l.id));
    return this;
  },
  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.items)); } catch (e) {}
    document.dispatchEvent(new CustomEvent('cart:change'));
  },
  find(id) { return this.items.find(l => l.id === id); },
  add(id, qty) {
    qty = qty || 1;
    const line = this.find(id);
    if (line) line.qty += qty; else this.items.push({ id, qty });
    this.save();
  },
  setQty(id, q) {
    const line = this.find(id); if (!line) return;
    line.qty = Math.max(0, q);
    if (line.qty === 0) this.items = this.items.filter(l => l.id !== id);
    this.save();
  },
  remove(id) { this.items = this.items.filter(l => l.id !== id); this.save(); },
  clear() { this.items = []; this.save(); },
  count() { return this.items.reduce((n, l) => n + l.qty, 0); },
  /* join cart lines with the catalogue */
  detailed() {
    const byId = Object.fromEntries((window.PRODUCTS || []).map(p => [p.id, p]));
    return this.items.map(l => ({ ...byId[l.id], qty: l.qty })).filter(p => p.id);
  },
  subtotal() { return this.detailed().reduce((s, p) => s + p.price * p.qty, 0); },
  shipping() {
    const sub = this.subtotal();
    if (sub === 0) return 0;
    const s = CFG.shipping || {};
    return sub >= (s.freeAbove || 0) ? 0 : (s.flatRate || 0);
  },
  total() { return this.subtotal() + this.shipping(); }
};
window.Cart = Cart;

/* ═══════════════════════════════════════════════════
   TOASTS
   ═══════════════════════════════════════════════════ */
function toast(msg, icon) {
  let host = $('.toasts');
  if (!host) { host = document.createElement('div'); host.className = 'toasts'; document.body.appendChild(host); }
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `<span class="toast__i">${svg(icon || 'check')}</span><span>${esc(msg)}</span>`;
  host.appendChild(el);
  setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 300); }, 2400);
}
window.toast = toast;

/* ═══════════════════════════════════════════════════
   CHROME — app bar, tab bar, cart sheet, footer
   ═══════════════════════════════════════════════════ */
function renderChrome() {
  const cur = here();
  const a = CFG.address || {};

  /* --- top app bar --- */
  const bar = document.createElement('header');
  bar.className = 'appbar';
  bar.innerHTML = `
    <div class="appbar__inner">
      <a class="brand" href="index.html" aria-label="${esc(CFG.brand)} — home">
        <img class="brand__mark" src="assets/img/logo-mark.webp" alt="" width="44" height="44" decoding="async">
        <span class="brand__text">
          <span class="brand__name">Astro Ashwini</span>
          <span class="brand__sub">Vedic Astrology · Vastu</span>
        </span>
      </a>
      <nav class="topnav" aria-label="Main">
        ${NAV.map(n => `<a href="${n.href}"${n.href === cur ? ' class="is-active" aria-current="page"' : ''}>${n.label}</a>`).join('')}
      </nav>
      <div class="appbar__actions">
        <a class="icon-btn" href="tel:${esc(CFG.phone)}" aria-label="Call ${esc(CFG.phone)}">${svg('phone')}</a>
        <button class="icon-btn" data-cart-open aria-label="Open cart">
          ${svg('cart')}<span class="badge" data-cart-badge>0</span>
        </button>
      </div>
    </div>`;
  document.body.prepend(bar);

  /* --- bottom tab bar (mobile) --- */
  const tabs = document.createElement('nav');
  tabs.className = 'tabbar';
  tabs.setAttribute('aria-label', 'Primary');
  tabs.innerHTML = `
    <div class="tabbar__inner">
      ${NAV.slice(0, 2).map(n => tabHTML(n, cur)).join('')}
      <button class="tab" data-cart-open aria-label="Open cart">
        ${svg('cart')}<span class="tab__label">Cart</span><span class="badge" data-cart-badge>0</span>
      </button>
      ${NAV.slice(2, 4).map(n => tabHTML(n, cur)).join('')}
    </div>`;
  document.body.appendChild(tabs);

  /* --- cart sheet --- */
  const scrim = document.createElement('div');
  scrim.className = 'scrim'; scrim.dataset.cartClose = '';
  document.body.appendChild(scrim);

  const sheet = document.createElement('aside');
  sheet.className = 'sheet';
  sheet.id = 'cart-sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-label', 'Shopping cart');
  sheet.hidden = true;
  sheet.innerHTML = `
    <div class="sheet__grab"></div>
    <div class="sheet__head">
      <span class="sheet__title">Your Cart</span>
      <button class="icon-btn" data-cart-close aria-label="Close cart">${svg('close')}</button>
    </div>
    <div class="sheet__body" data-cart-body></div>
    <div class="sheet__foot" data-cart-foot></div>`;
  document.body.appendChild(sheet);

  /* --- footer --- */
  const foot = document.createElement('footer');
  foot.className = 'footer';
  foot.innerHTML = `
    <div class="wrap">
      <div class="footer__grid">
        <div class="footer__brand">
          <img class="footer__logo" src="assets/img/logo-lockup.webp" alt="${esc(CFG.brand)}" width="120" height="62" loading="lazy" decoding="async">
          <p class="muted" style="font-size:var(--fs-sm);max-width:38ch">
            Vedic astrology, Vastu, numerology and gemstone guidance from
            ${esc(CFG.person)} — practising in Pune since 2015.
          </p>
          <div class="social">
            <a href="${esc(CFG.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${svg('insta')}</a>
            <a href="https://wa.me/${esc(CFG.whatsapp)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${svg('wa')}</a>
            <a href="tel:${esc(CFG.phone)}" aria-label="Call">${svg('phone')}</a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>${NAV.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li><a href="shop.html?cat=bracelet">Zodiac Bracelets</a></li>
            <li><a href="shop.html?cat=rudraksha">Rudraksha</a></li>
            <li><a href="shop.html?cat=mala">Malas</a></li>
            <li><a href="shop.html?cat=combo">Combinations</a></li>
          </ul>
        </div>
        <div>
          <h4>Visit</h4>
          <p class="muted" style="font-size:var(--fs-sm);line-height:1.8">
            ${esc(a.line1)}<br>${esc(a.line2)}<br>${esc(a.city)} ${esc(a.pin)}<br>${esc(a.state)}
          </p>
          <p style="margin-top:var(--sp-3)">
            <a href="tel:${esc(CFG.phone)}" style="color:var(--gold-lt);font-weight:600">${esc(CFG.phone)}</a>
          </p>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} ${esc(CFG.brand)}. All rights reserved.</span>
        <span>${esc(CFG.rating.score)} ★ from ${esc(CFG.rating.count)} ${esc(CFG.rating.source)}</span>
      </div>
    </div>`;
  const main = $('main');
  if (main && main.parentNode) main.parentNode.insertBefore(foot, main.nextSibling);
  else document.body.appendChild(foot);
}

function tabHTML(n, cur) {
  const on = n.href === cur;
  return `<a class="tab${on ? ' is-active' : ''}" href="${n.href}"${on ? ' aria-current="page"' : ''}>
    ${svg(n.icon)}<span class="tab__label">${n.label}</span></a>`;
}

/* ═══════════════════════════════════════════════════
   CART UI
   ═══════════════════════════════════════════════════ */
let lastFocus = null;

function openCart() {
  const sheet = $('#cart-sheet'); if (!sheet) return;
  lastFocus = document.activeElement;
  sheet.hidden = false;
  // force reflow so the transform transition actually runs
  void sheet.offsetWidth;
  sheet.classList.add('is-open');
  $('.scrim').classList.add('is-open');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('cart-open');
  const close = $('[data-cart-close]', sheet);
  if (close) close.focus();
}
function closeCart() {
  const sheet = $('#cart-sheet'); if (!sheet) return;
  sheet.classList.remove('is-open');
  $('.scrim').classList.remove('is-open');
  document.body.style.overflow = '';
  document.body.classList.remove('cart-open');
  setTimeout(() => { sheet.hidden = true; }, 380);
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
window.openCart = openCart;

function renderCart() {
  const body = $('[data-cart-body]'), foot = $('[data-cart-foot]');
  if (!body || !foot) return;
  const lines = Cart.detailed();

  /* badge */
  const n = Cart.count();
  $$('[data-cart-badge]').forEach(b => {
    b.textContent = n > 99 ? '99+' : n;
    b.classList.toggle('is-on', n > 0);
  });

  if (!lines.length) {
    body.innerHTML = `
      <div class="empty">
        <div class="empty__glyph">✦</div>
        <p style="margin-bottom:var(--sp-5)">Your cart is empty.</p>
        <a class="btn btn--gold" href="shop.html">Browse the collection</a>
      </div>`;
    foot.innerHTML = '';
    return;
  }

  body.innerHTML = lines.map(p => `
    <div class="cart-line">
      <img class="cart-line__img" src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy" decoding="async">
      <div class="cart-line__info">
        <a class="cart-line__name" href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a>
        <span class="cart-line__price">${money(p.price * p.qty)}</span>
        <div class="row gap-2" style="margin-top:4px">
          <div class="qty">
            <button data-qty="-1" data-id="${esc(p.id)}" aria-label="Decrease quantity of ${esc(p.name)}">−</button>
            <span class="qty__n">${p.qty}</span>
            <button data-qty="1" data-id="${esc(p.id)}" aria-label="Increase quantity of ${esc(p.name)}">+</button>
          </div>
          <button class="icon-btn" data-rm="${esc(p.id)}" aria-label="Remove ${esc(p.name)}" style="width:36px;height:36px">${svg('trash')}</button>
        </div>
      </div>
    </div>`).join('');

  const ship = Cart.shipping(), sub = Cart.subtotal();
  const free = (CFG.shipping || {}).freeAbove || 0;
  foot.innerHTML = `
    <div class="sum-row"><span>Subtotal</span><span>${money(sub)}</span></div>
    <div class="sum-row"><span>Delivery</span><span>${ship === 0 ? '<span style="color:var(--ok)">Free</span>' : money(ship)}</span></div>
    ${(ship > 0 && free) ? `<div class="sum-row" style="font-size:var(--fs-xs);color:var(--gold)">
        <span>Add ${money(free - sub)} more for free delivery</span></div>` : ''}
    <div class="sum-row sum-row--total"><span>Total</span><b>${money(Cart.total())}</b></div>
    <a class="btn btn--gold btn--block mt-4" href="checkout.html">Checkout ${svg('arrow')}</a>
    <button class="btn btn--ghost btn--block btn--sm mt-4" data-cart-clear>Empty cart</button>`;
}

/* ═══════════════════════════════════════════════════
   GLOBAL EVENT DELEGATION
   ═══════════════════════════════════════════════════ */
document.addEventListener('click', e => {
  const t = e.target;

  if (t.closest('[data-cart-open]')) { e.preventDefault(); openCart(); return; }
  if (t.closest('[data-cart-close]')) { e.preventDefault(); closeCart(); return; }

  const add = t.closest('[data-add]');
  if (add) {
    e.preventDefault(); e.stopPropagation();
    const id = add.dataset.add;
    const qty = parseInt(add.dataset.qty || '1', 10) || 1;
    Cart.add(id, qty);
    const p = (window.PRODUCTS || []).find(x => x.id === id);
    toast((p ? p.name : 'Item') + ' added to cart');
    if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) {} }
    return;
  }

  const q = t.closest('[data-qty]');
  if (q) {
    const line = Cart.find(q.dataset.id);
    if (line) Cart.setQty(q.dataset.id, line.qty + parseInt(q.dataset.qty, 10));
    return;
  }

  const rm = t.closest('[data-rm]');
  if (rm) { Cart.remove(rm.dataset.rm); toast('Removed from cart', 'trash'); return; }

  if (t.closest('[data-cart-clear]')) { Cart.clear(); toast('Cart emptied', 'trash'); return; }

  /* accordion */
  const acc = t.closest('.acc__btn');
  if (acc) {
    const item = acc.closest('.acc__item');
    const panel = $('.acc__panel', item);
    const open = item.classList.toggle('is-open');
    acc.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    return;
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const sheet = $('#cart-sheet');
    if (sheet && sheet.classList.contains('is-open')) closeCart();
  }
});

document.addEventListener('cart:change', renderCart);

/* ═══════════════════════════════════════════════════
   SCROLL + REVEAL
   ═══════════════════════════════════════════════════ */
function initScroll() {
  const bar = $('.appbar');
  let tick = false;
  const onScroll = () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      if (bar) bar.classList.toggle('is-scrolled', window.scrollY > 12);
      tick = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
  els.forEach((el, i) => { el.style.transitionDelay = Math.min(i % 8, 6) * 55 + 'ms'; io.observe(el); });
}

/* ═══════════════════════════════════════════════════
   VIEWPORT UNIT FIX (older mobile browsers w/o dvh)
   ═══════════════════════════════════════════════════ */
function initVH() {
  if (CSS && CSS.supports && CSS.supports('height', '100dvh')) return;
  const set = () => document.documentElement.style.setProperty('--vh-fallback', window.innerHeight + 'px');
  set();
  window.addEventListener('resize', set, { passive: true });
}

/* ═══════════════════════════════════════════════════
   PWA
   ═══════════════════════════════════════════════════ */
function initPWA() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

/* ═══════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════ */
let booted = false;
const readyQueue = [];
function onReady(fn) {
  if (booted) { fn(); return; }
  readyQueue.push(fn);
}

function boot() {
  renderChrome();
  Cart.load();
  renderCart();
  initScroll();
  initReveal();
  initVH();
  initPWA();
  document.documentElement.classList.add('js-ready');
  booted = true;
  readyQueue.splice(0).forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
  document.dispatchEvent(new CustomEvent('app:ready'));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

/* shared helpers for page scripts */
window.AA = { $, $$, money, esc, stars, svg, I, toast, Cart, onReady };
})();
