/* Product detail page — renders from ?id= */
(function () {
'use strict';
window.AA.onReady(function () {
const A = window.AA, $ = A.$, $$ = A.$$;
const root = $('#pd'); if (!root) return;

const id = new URLSearchParams(location.search).get('id');
const p = (window.PRODUCTS || []).find(x => x.id === id);

if (!p) {
  root.innerHTML = `
    <div class="empty" style="grid-column:1/-1">
      <div class="empty__glyph">✦</div>
      <h2 style="margin-bottom:var(--sp-3)">Piece not found</h2>
      <p style="margin-bottom:var(--sp-6)">That item is no longer listed.</p>
      <a class="btn btn--gold" href="shop.html">Back to the shop</a>
    </div>`;
  return;
}

document.title = p.name + ' — Astro Ashwini';
const md = $('meta[name="description"]');
if (md) md.setAttribute('content', p.desc.slice(0, 155));

/* breadcrumb */
const crumbs = $('#crumbs');
if (crumbs) crumbs.innerHTML =
  `<a href="index.html">Home</a><span>›</span><a href="shop.html">Shop</a><span>›</span>
   <a href="shop.html?cat=${encodeURIComponent(p.category)}">${A.esc(p.categoryLabel)}</a>
   <span>›</span><span>${A.esc(p.name)}</span>`;

const off = window.productDiscount(p);

/* spec table differs by product type */
const specs = p.category === 'bracelet'
  ? [['Sign', p.sign + ' (' + p.hindi + ')'], ['Stone', p.stone],
     ['Ruling planet', p.ruler], ['Element', p.element],
     ['Bead size', p.beadSize], ['Dates', p.dates]]
  : p.category === 'rudraksha'
    ? [['Faces', p.mukhi + ' Mukhi'], ['Also called', p.hindi],
       ['Deity', p.deity], ['Planet', p.ruler],
       ['Origin', p.origin], ['Certified', 'Yes']]
    : [['Type', p.categoryLabel], ['Also called', p.hindi],
       ['Associated', p.ruler], ['Suits', 'All signs']];

root.innerHTML = `
  <div class="pd__media">
    <img src="${A.esc(p.img)}" alt="${A.esc(p.name)}" width="900" height="900" fetchpriority="high" decoding="async">
  </div>
  <div>
    <span class="p-card__cat">${A.esc(p.categoryLabel)}</span>
    <h1 class="pd__title">${A.esc(p.name)}</h1>
    <p class="muted" style="font-size:var(--fs-sm)">${A.esc(p.tagline)}</p>

    <div class="row gap-3 mt-4" style="flex-wrap:wrap">
      <span class="rating"><span class="rating__stars">${A.stars(p.rating)}</span>
        ${p.rating.toFixed(1)} · ${p.reviews} reviews</span>
      ${p.inStock ? '<span class="rating" style="color:var(--ok)">● In stock</span>'
                  : '<span class="rating" style="color:var(--warn)">● Made to order</span>'}
    </div>

    <div class="pd__price">
      <span class="price__now">${A.money(p.price)}</span>
      ${p.mrp > p.price ? `<span class="price__was">${A.money(p.mrp)}</span>` : ''}
      ${off ? `<span class="pd__save">Save ${off}%</span>` : ''}
    </div>

    <div class="row gap-3" style="flex-wrap:wrap">
      <div class="qty" aria-label="Quantity">
        <button id="qm" aria-label="Decrease quantity">−</button>
        <span class="qty__n" id="qn">1</span>
        <button id="qp" aria-label="Increase quantity">+</button>
      </div>
      <span class="muted" style="font-size:var(--fs-xs)">
        Free delivery above ${A.money((window.ASTRO_CONFIG.shipping || {}).freeAbove || 0)}
      </span>
    </div>

    <div class="pd__actions">
      <button class="btn btn--gold" id="addbtn">${A.svg('cart')} Add to cart</button>
      <a class="btn btn--ghost" id="buynow" href="checkout.html">Buy now</a>
    </div>

    <p style="font-size:var(--fs-sm);color:var(--text-2);line-height:1.8">${A.esc(p.desc)}</p>

    <div class="spec">
      ${specs.map(([k, v]) => `<div class="spec__item">
        <div class="spec__k">${A.esc(k)}</div><div class="spec__v">${A.esc(v)}</div></div>`).join('')}
    </div>

    <h3 style="font-size:var(--fs-lg);margin-bottom:var(--sp-4)">Why this piece</h3>
    <ul class="bullets">${p.benefits.map(b => `<li>${A.esc(b)}</li>`).join('')}</ul>

    <div class="acc mt-6">
      <div class="acc__item">
        <button class="acc__btn" aria-expanded="false">How to wear it ${A.svg('plus')}</button>
        <div class="acc__panel"><p>${A.esc(p.wearing)}</p></div>
      </div>
      <div class="acc__item">
        <button class="acc__btn" aria-expanded="false">Care ${A.svg('plus')}</button>
        <div class="acc__panel"><p>${A.esc(p.care)}</p></div>
      </div>
      <div class="acc__item">
        <button class="acc__btn" aria-expanded="false">Delivery &amp; returns ${A.svg('plus')}</button>
        <div class="acc__panel"><p>Dispatched from Pune within 2 working days; 4–7 days across India.
          Free delivery above ${A.money((window.ASTRO_CONFIG.shipping || {}).freeAbove || 0)}.
          Unworn pieces can be returned within 7 days of delivery — energised items are checked on return.</p></div>
      </div>
      <div class="acc__item">
        <button class="acc__btn" aria-expanded="false">Not sure which to choose? ${A.svg('plus')}</button>
        <div class="acc__panel"><p>Ashwini reads your chart before recommending a stone or bead —
          the wrong one simply does nothing. Book a consultation and she will tell you what your chart asks for.
          <a href="contact.html" style="color:var(--gold-lt);font-weight:600">Book a consultation →</a></p></div>
      </div>
    </div>
  </div>`;

/* ---- quantity ---- */
let qty = 1;
const qn = $('#qn');
$('#qp').addEventListener('click', () => { qty = Math.min(99, qty + 1); qn.textContent = qty; syncBtns(); });
$('#qm').addEventListener('click', () => { qty = Math.max(1, qty - 1); qn.textContent = qty; syncBtns(); });

function syncBtns() {
  $('#addbtn').dataset.add = p.id;
  $('#addbtn').dataset.qty = qty;
  const bb = $('#bb-add'); if (bb) { bb.dataset.add = p.id; bb.dataset.qty = qty; }
}
syncBtns();

/* Buy now = add then go to checkout */
$('#buynow').addEventListener('click', e => {
  e.preventDefault();
  window.Cart.add(p.id, qty);
  location.href = 'checkout.html';
});

/* ---- sticky buy bar on mobile ---- */
const bar = document.createElement('div');
bar.className = 'buybar';
bar.innerHTML = `
  <span class="buybar__p"><small>Total</small><b id="bb-price">${A.money(p.price)}</b></span>
  <button class="btn btn--gold" id="bb-add" data-add="${A.esc(p.id)}" data-qty="1">Add to cart</button>`;
document.body.appendChild(bar);

const addBtn = $('#addbtn');
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => bar.classList.toggle('is-on', !e.isIntersecting), { threshold: 0 })
    .observe(addBtn);
}
const bbPrice = $('#bb-price');
const updatePrice = () => { bbPrice.textContent = A.money(p.price * qty); };
$('#qp').addEventListener('click', updatePrice);
$('#qm').addEventListener('click', updatePrice);

/* ---- related pieces ---- */
const rel = $('#related');
if (rel) {
  const pool = window.PRODUCTS.filter(x => x.id !== p.id && x.category === p.category);
  const list = (pool.length >= 4 ? pool : window.PRODUCTS.filter(x => x.id !== p.id)).slice(0, 4);
  rel.innerHTML = list.map(x => window.productCard(x)).join('');
  $$('.reveal', rel).forEach(el => el.classList.add('is-in'));
}
});
})();
