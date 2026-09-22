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
const THIN = '\u2009';  /* U+2009 thin space after \u20b9 */
const money = n => CFG.currency + THIN + Number(n).toLocaleString('en-IN');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
  c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

/* ---------- icons (from the sprite in icons.js) ---------- */
const svg = (id, cls) => window.ICONS.icon(id, cls);

/* ---------- navigation model ---------- */
const NAV = [
  { href:'index.html',    label:'Home',     icon:'i-home'  },
  { href:'shop.html',     label:'Shop',     icon:'i-shop'  },
  { href:'services.html', label:'Services', icon:'i-spark' },
  { href:'about.html',    label:'About',    icon:'i-user'  },
  { href:'contact.html',  label:'Contact',  icon:'i-phone' }
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
function toast(msg) {
  /* While the cart sheet is open the list itself is the feedback — a toast
     would sit under the sheet, so we skip it rather than reposition it. */
  if (document.body.classList.contains('cart-open')) return;
  let host = $('.toasts');
  if (!host) { host = document.createElement('div'); host.className = 'toasts'; document.body.appendChild(host); }
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 260); }, 2400);
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
        <img class="brand__mark" src="assets/img/logo-mark.webp" alt="" width="36" height="36" decoding="async">
        <span class="brand__name">Astro Ashwini</span>
      </a>
      <nav class="topnav" aria-label="Main">
        ${NAV.map(n => `<a href="${n.href}"${n.href === cur ? ' class="is-active" aria-current="page"' : ''}>${n.label}</a>`).join('')}
      </nav>
      <div class="appbar__actions">
        <a class="bar-link" href="tel:${esc(CFG.phone)}">Call</a>
        <button class="bar-link" data-cart-open aria-label="Open cart">
          Cart&nbsp;<span class="cart-count" data-cart-badge>(0)</span>
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
        ${svg('i-cart')}<span class="tab__label">Cart&nbsp;<span data-cart-badge>(0)</span></span>
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
    <div class="sheet__head">
      <span class="sheet__title">Cart</span>
      <button class="sheet__close" data-cart-close aria-label="Close cart">${svg('i-close')}</button>
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
        <div>
          <img class="footer__logo" src="assets/img/logo-lockup.webp" alt="${esc(CFG.brand)}" width="104" height="54" loading="lazy" decoding="async">
          <p style="margin-top:var(--sp-4)">
            Vedic astrology, Vastu, numerology and gemstone guidance from
            ${esc(CFG.person)} — practising in Pune.
          </p>
          <div class="social" style="margin-top:var(--sp-4)">
            <a href="${esc(CFG.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${svg('i-insta')}</a>
            <a href="https://wa.me/${esc(CFG.whatsapp)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${svg('i-wa')}</a>
            <a href="tel:${esc(CFG.phone)}" aria-label="Call">${svg('i-phone')}</a>
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
          <p style="line-height:1.9">
            ${esc(a.line1)}<br>${esc(a.line2)}<br>${esc(a.city)} ${esc(a.pin)}<br>${esc(a.state)}
          </p>
          <p style="margin-top:var(--sp-3)"><a href="tel:${esc(CFG.phone)}">${esc(CFG.phone)}</a></p>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} ${esc(CFG.brand)}. All rights reserved.</span>
        <span>${esc(CFG.rating.score)} out of 5 — ${esc(CFG.rating.count)} ${esc(CFG.rating.source)}</span>
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
  /* a toast raised just before the sheet opened would sit over the
     checkout button — clear any that are still on screen */
  $$('.toasts .toast').forEach(t => t.remove());
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
  $$('[data-cart-badge]').forEach(b => { b.textContent = '(' + (n > 99 ? '99+' : n) + ')'; });

  if (!lines.length) {
    body.innerHTML = `
      <div class="empty">
        <svg class="empty__mark" aria-hidden="true"><use href="#c-star"/></svg>
        <p class="muted" style="margin-bottom:var(--sp-6)">Your cart is empty.</p>
        <a class="btn btn--ghost" href="shop.html">Browse the collection</a>
      </div>`;
    foot.innerHTML = '';
    return;
  }

  body.innerHTML = lines.map(p => `
    <div class="cart-line">
      <span class="has-ghost" style="position:relative;width:64px;height:80px;flex:none">
        ${ghostFrame(p, true)}
        <img class="cart-line__img" src="${esc(p.img)}" alt="" loading="lazy" decoding="async"
             style="position:absolute;inset:0;z-index:1">
      </span>
      <div class="cart-line__info">
        <a class="cart-line__name" href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a>
        <span class="cart-line__price">${money(p.price * p.qty)}</span>
        <div class="row gap-3" style="margin-top:6px;gap:var(--sp-4)">
          <span class="qty">
            <button data-qty="-1" data-id="${esc(p.id)}" aria-label="Decrease quantity of ${esc(p.name)}">${svg('i-minus')}</button>
            <span class="qty__n">${p.qty}</span>
            <button data-qty="1" data-id="${esc(p.id)}" aria-label="Increase quantity of ${esc(p.name)}">${svg('i-plus')}</button>
          </span>
          <button class="line-rm" data-rm="${esc(p.id)}" aria-label="Remove ${esc(p.name)}">Remove</button>
        </div>
      </div>
    </div>`).join('');

  const ship = Cart.shipping(), sub = Cart.subtotal();
  const free = (CFG.shipping || {}).freeAbove || 0;
  foot.innerHTML = `
    <div class="sum-row"><span>Subtotal</span><span>${money(sub)}</span></div>
    <div class="sum-row"><span>Delivery</span><span>${ship === 0 ? 'Free' : money(ship)}</span></div>
    ${(ship > 0 && free) ? `<div class="sum-row" style="font-size:var(--fs-xs);color:var(--clay)">
        <span>Add ${money(free - sub)} more for free delivery</span><span></span></div>` : ''}
    <div class="sum-row sum-row--total"><span>Total</span><b>${money(Cart.total())}</b></div>
    <a class="btn btn--primary btn--block" style="margin-top:var(--sp-5)" href="checkout.html">Checkout</a>
    <button class="btn btn--ghost btn--block btn--sm" style="margin-top:var(--sp-3)" data-cart-clear>Empty cart</button>`;
}

/* Ghost frame markup — the placeholder behind every product image.
   Shown whenever the real photograph is missing. */
function ghostFrame(p, compact) {
  const mark = window.ICONS.markFor(p);
  return `<span class="ghost">
    <svg class="ghost__mark" aria-hidden="true"><use href="#${mark}"/></svg>
    ${compact ? '' : '<span class="ghost__cap">Photography in progress</span>'}
  </span>`;
}
window.ghostFrame = ghostFrame;

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
    return;
  }

  const q = t.closest('[data-qty]');
  if (q) {
    const line = Cart.find(q.dataset.id);
    if (line) Cart.setQty(q.dataset.id, line.qty + parseInt(q.dataset.qty, 10));
    return;
  }

  const rm = t.closest('[data-rm]');
  if (rm) { Cart.remove(rm.dataset.rm); toast('Removed from cart'); return; }

  if (t.closest('[data-cart-clear]')) { Cart.clear(); toast('Cart emptied'); return; }

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
  }, { threshold: .15 });
  els.forEach((el, i) => { el.style.transitionDelay = Math.min(i % 6, 5) * 70 + 'ms'; io.observe(el); });
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

/* Product images start hidden and are revealed only once they actually
   load, so a missing photograph simply leaves the ghost frame showing —
   no broken-image icon, and no dependence on when a lazy image fetches.
   load/error do not bubble, so listen in the capture phase. */
function initGhosts() {
  const show = img => { if (img.naturalWidth > 0) img.classList.add('is-loaded'); };
  document.addEventListener('load', e => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.closest('.has-ghost')) show(t);
  }, true);
  /* catch anything already complete from cache */
  const sweep = () => $$('.has-ghost img').forEach(show);
  window.addEventListener('load', sweep);
  document.addEventListener('cards:rendered', sweep);
}

function boot() {
  window.ICONS.buildSprite();
  initGhosts();
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
window.AA = { $, $$, money, esc, stars, svg, toast, Cart, onReady, ghostFrame };
})();
