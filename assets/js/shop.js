/* Shop page — filter, search, sort, render. */
(function () {
'use strict';
window.AA.onReady(function () {
const A = window.AA, $ = A.$, $$ = A.$$;
const grid = $('#grid'); if (!grid) return;

const state = { cat: 'all', zodiac: '', q: '', sort: 'featured' };

/* read deep-link params: shop.html?cat=rudraksha&z=leo */
const qs = new URLSearchParams(location.search);
if (qs.get('cat')) state.cat = qs.get('cat');
if (qs.get('z')) { state.zodiac = qs.get('z'); state.cat = 'bracelet'; }
if (qs.get('q')) state.q = qs.get('q');

function apply() {
  let list = window.PRODUCTS.slice();

  if (state.cat !== 'all') list = list.filter(p => p.category === state.cat);
  if (state.zodiac) list = list.filter(p => p.zodiac === state.zodiac);

  if (state.q.trim()) {
    const q = state.q.toLowerCase().trim();
    list = list.filter(p => [p.name, p.categoryLabel, p.stone, p.hindi, p.sign, p.deity, p.ruler, p.tagline]
      .filter(Boolean).join(' ').toLowerCase().includes(q));
  }

  switch (state.sort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
    case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: break; // catalogue order
  }
  return list;
}

/* the zodiac row is only meaningful while browsing bracelets */
function syncZodiacRow() {
  const wrap = $('#zwrap');
  if (wrap) wrap.hidden = !(state.cat === 'bracelet' || state.cat === 'all');
}

function render() {
  syncZodiacRow();
  const list = apply();
  const count = $('#count');

  if (!list.length) {
    grid.className = '';
    grid.innerHTML = `
      <div class="empty">
        <div class="empty__glyph">✦</div>
        <p>Nothing matches that search.</p>
        <button class="btn btn--ghost mt-6" id="reset">Clear filters</button>
      </div>`;
    if (count) count.textContent = '0 pieces';
    const r = $('#reset');
    if (r) r.addEventListener('click', () => {
      state.cat = 'all'; state.zodiac = ''; state.q = ''; state.sort = 'featured';
      const s = $('#search'); if (s) s.value = '';
      const so = $('#sort'); if (so) so.value = 'featured';
      syncChips(); render();
    });
    return;
  }

  grid.className = 'grid grid-4';
  grid.innerHTML = list.map((p, i) => window.productCard(p, { eager: i < 4 })).join('');
  if (count) count.textContent = list.length + (list.length === 1 ? ' piece' : ' pieces');

  // re-run reveal for freshly injected cards
  $$('.reveal', grid).forEach((el, i) => {
    el.style.transitionDelay = Math.min(i % 8, 6) * 45 + 'ms';
    requestAnimationFrame(() => el.classList.add('is-in'));
  });
}

function syncChips() {
  $$('[data-cat]').forEach(c => c.classList.toggle('is-active', c.dataset.cat === state.cat));
  $$('[data-z]').forEach(c => c.classList.toggle('is-active', c.dataset.z === state.zodiac));
}

/* ---- build category chips ---- */
const chips = $('#chips');
if (chips) {
  chips.innerHTML = window.CATEGORIES.map(c =>
    `<button class="chip" data-cat="${c.key}"><span aria-hidden="true">${c.icon}\uFE0E</span>${c.label}</button>`).join('');
}

/* ---- build zodiac chips ---- */
const zchips = $('#zchips');
if (zchips) {
  zchips.innerHTML = `<button class="chip" data-z="">All signs</button>` +
    window.ZODIAC.map(z => `<button class="chip" data-z="${z.key}"><span aria-hidden="true">${z.glyph}\uFE0E</span>${z.sign}</button>`).join('');
}

document.addEventListener('click', e => {
  const c = e.target.closest('[data-cat]');
  if (c) { state.cat = c.dataset.cat; if (state.cat !== 'bracelet') state.zodiac = ''; syncChips(); render(); updateURL(); return; }
  const z = e.target.closest('[data-z]');
  if (z) { state.zodiac = z.dataset.z; if (state.zodiac) state.cat = 'bracelet'; syncChips(); render(); updateURL(); return; }
});

const search = $('#search');
if (search) {
  search.value = state.q;
  let t;
  search.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = search.value; render(); }, 180);
  });
}

const sort = $('#sort');
if (sort) sort.addEventListener('change', () => { state.sort = sort.value; render(); });

function updateURL() {
  const p = new URLSearchParams();
  if (state.cat !== 'all') p.set('cat', state.cat);
  if (state.zodiac) p.set('z', state.zodiac);
  const s = p.toString();
  history.replaceState(null, '', s ? '?' + s : location.pathname);
}

syncChips();
render();
});
})();
