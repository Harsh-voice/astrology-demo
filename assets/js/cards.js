/* Shared product-card renderer — used by the home page and the shop. */
(function () {
'use strict';
const A = window.AA;

function discount(p) {
  if (!p.mrp || p.mrp <= p.price) return 0;
  return Math.round((1 - p.price / p.mrp) * 100);
}

window.productCard = function (p, opts) {
  opts = opts || {};
  const off = discount(p);
  const meta = p.category === 'bracelet'
    ? `${p.stone} · ${p.beadSize} · ${p.ruler}`
    : (p.tagline || p.categoryLabel);
  return `
  <article class="card p-card reveal">
    <a class="p-card__media" href="product.html?id=${encodeURIComponent(p.id)}" aria-label="${A.esc(p.name)}">
      ${off ? `<span class="chip-off">${off}% off</span>` : ''}
      <span class="chip-glyph" aria-hidden="true">${A.esc(p.glyph || '✦')}\uFE0E</span>
      <img src="${A.esc(p.img)}" alt="${A.esc(p.name)}" width="900" height="900"
           loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async">
    </a>
    <div class="p-card__body">
      <span class="p-card__cat">${A.esc(p.categoryLabel)}</span>
      <a class="p-card__name" href="product.html?id=${encodeURIComponent(p.id)}">${A.esc(p.name)}</a>
      <span class="p-card__meta">${A.esc(meta)}</span>
      <span class="rating"><span class="rating__stars">${A.stars(p.rating)}</span> ${p.rating.toFixed(1)} (${p.reviews})</span>
      <div class="p-card__foot">
        <span class="price">
          <span class="price__now">${A.money(p.price)}</span>
          ${p.mrp > p.price ? `<span class="price__was">${A.money(p.mrp)}</span>` : ''}
        </span>
        <button class="p-card__add" data-add="${A.esc(p.id)}" aria-label="Add ${A.esc(p.name)} to cart">
          ${A.svg('plus')}
        </button>
      </div>
    </div>
  </article>`;
};
window.productDiscount = discount;
})();
