/* Home page — renders services, zodiac picker, featured products, courses, reviews. */
(function () {
'use strict';
window.AA.onReady(function () {
const A = window.AA, $ = A.$, $$ = A.$$;

/* ---- services ---- */
const sg = $('#services-grid');
if (sg) sg.innerHTML = window.SERVICES.map(s => `
  <article class="card svc reveal">
    <div class="svc__icon">
      ${s.icon ? `<img src="${A.esc(s.icon)}" alt="" width="26" height="26" loading="lazy" decoding="async">`
               : `<span aria-hidden="true">${A.esc(s.glyph)}</span>`}
    </div>
    <h3>${A.esc(s.name)}</h3>
    <p>${A.esc(s.blurb)}</p>
    <a class="svc__link" href="services.html#${A.esc(s.key)}">Learn more ${A.svg('arrow')}</a>
  </article>`).join('');

/* ---- zodiac picker ---- */
const zg = $('#zodiac-grid');
if (zg) zg.innerHTML = window.ZODIAC.map(z => `
  <a class="zcell" href="shop.html?z=${z.key}" aria-label="${z.sign} bracelets">
    <span class="zcell__g" aria-hidden="true">${z.glyph}\uFE0E</span>
    <span class="zcell__n">${z.sign}</span>
    <span class="zcell__d">${z.dates}</span>
  </a>`).join('');

/* ---- featured products: a spread across categories ---- */
const fg = $('#featured-grid');
if (fg) {
  const pick = ids => ids.map(id => window.PRODUCTS.find(p => p.id === id)).filter(Boolean);
  let feat = pick(['bracelet-leo', 'rudraksha-5-mukhi', 'combo-seven-chakra', 'rudraksha-mala-108']);
  if (feat.length < 4) feat = window.PRODUCTS.slice(0, 4);
  fg.innerHTML = feat.map(p => window.productCard(p)).join('');
}

/* ---- courses ---- */
const cg = $('#courses-grid');
if (cg) cg.innerHTML = window.COURSES.map(c => `
  <article class="card reveal">
    <div class="p-card__media" style="aspect-ratio:16/10">
      <img src="${A.esc(c.img)}" alt="${A.esc(c.name)} course" width="900" height="560" loading="lazy" decoding="async">
    </div>
    <div class="svc" style="padding:var(--sp-5)">
      <span class="p-card__cat">${A.esc(c.level)}</span>
      <h3>${A.esc(c.name)}</h3>
      <p>${A.esc(c.desc)}</p>
      <a class="svc__link" href="contact.html">Enquire ${A.svg('arrow')}</a>
    </div>
  </article>`).join('');

/* ---- reviews ---- */
const rs = $('#reviews-scroll');
if (rs) rs.innerHTML = window.REVIEWS.map(r => `
  <article class="card tcard">
    <div class="tcard__stars" aria-label="${r.stars} out of 5">${'★'.repeat(r.stars)}</div>
    <p class="tcard__text">${A.esc(r.text)}</p>
    <div class="tcard__who">
      <span class="tcard__av" aria-hidden="true">${A.esc(r.name.trim()[0].toUpperCase())}</span>
      <span>
        <span class="tcard__name">${A.esc(r.name)}</span><br>
        <span class="tcard__date">${A.esc(r.date)} · Google</span>
      </span>
    </div>
  </article>`).join('');

/* newly injected .reveal elements need observing */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -6% 0px', threshold: .05 });
  $$('.reveal:not(.is-in)').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i % 8, 6) * 50 + 'ms';
    io.observe(el);
  });
} else {
  $$('.reveal').forEach(el => el.classList.add('is-in'));
}
});
})();
