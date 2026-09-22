/* About page — courses and reviews. */
(function () {
'use strict';
window.AA.onReady(function () {
const A = window.AA, $ = A.$, $$ = A.$$;

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

const rs = $('#reviews-scroll');
if (rs) rs.innerHTML = window.REVIEWS.map(r => `
  <article class="card tcard">
    <div class="tcard__stars" aria-label="${r.stars} out of 5">${'★'.repeat(r.stars)}</div>
    <p class="tcard__text">${A.esc(r.text)}</p>
    <div class="tcard__who">
      <span class="tcard__av" aria-hidden="true">${A.esc(r.name.trim()[0].toUpperCase())}</span>
      <span><span class="tcard__name">${A.esc(r.name)}</span><br>
      <span class="tcard__date">${A.esc(r.date)} · Google</span></span>
    </div>
  </article>`).join('');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -6% 0px', threshold: .05 });
  $$('.reveal:not(.is-in)').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i % 6, 5) * 55 + 'ms'; io.observe(el);
  });
} else $$('.reveal').forEach(el => el.classList.add('is-in'));
});
})();
