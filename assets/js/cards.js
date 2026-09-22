/* Shared product-card renderer — home page and shop. */
(function () {
'use strict';
window.AA.onReady(function () {
const A = window.AA;

function discount(p) {
  if (!p.mrp || p.mrp <= p.price) return 0;
  return Math.round((1 - p.price / p.mrp) * 100);
}

window.productCard = function (p, opts) {
  opts = opts || {};
  const meta = p.category === 'bracelet'
    ? p.stone + ' · ' + p.beadSize
    : (p.tagline || p.categoryLabel);
  const href = 'product.html?id=' + encodeURIComponent(p.id);
  return `
  <article class="p-card reveal">
    <a class="p-card__media has-ghost" href="${href}" aria-label="${A.esc(p.name)}">
      ${A.ghostFrame(p)}
      <img src="${A.esc(p.img)}" alt="${A.esc(p.name)}" width="900" height="1125"
           loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async">
    </a>
    <div class="p-card__body">
      <span class="p-card__cat">${A.esc(p.categoryLabel)}</span>
      <a class="p-card__name" href="${href}">${A.esc(p.name)}</a>
      <span class="p-card__meta">${A.esc(meta)}</span>
      <div class="p-card__foot">
        <span class="price">
          <span class="price__now">${A.money(p.price)}</span>
          ${p.mrp > p.price ? `<span class="price__was">${A.money(p.mrp)}</span>` : ''}
        </span>
        <button class="p-card__add" data-add="${A.esc(p.id)}"
                aria-label="Add ${A.esc(p.name)} to cart">Add</button>
      </div>
    </div>
  </article>`;
};
window.productDiscount = discount;
});
})();
