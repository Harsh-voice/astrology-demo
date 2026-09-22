/* About page — courses and reviews. */
(function () {
'use strict';
window.AA.onReady(function () {
const A = window.AA, $ = A.$, $$ = A.$$;
const pad = n => String(n).padStart(2, '0');

const cg = $('#courses-grid');
if (cg) cg.innerHTML = window.COURSES.map((c, i) => `
  <article class="reveal">
    <div style="aspect-ratio:3/2;overflow:hidden;border-radius:2px;background:var(--paper-2)">
      <img src="${A.esc(c.img)}" alt="${A.esc(c.name)} course" width="900" height="600"
           style="width:100%;height:100%;object-fit:cover" loading="lazy" decoding="async">
    </div>
    <div class="item" style="margin-top:var(--sp-5)">
      <span class="item__n">${pad(i + 1)} · ${A.esc(c.level)}</span>
      <h3>${A.esc(c.name)}</h3>
      <p>${A.esc(c.desc)}</p>
      <a class="link-arrow" href="contact.html">Enquire ${A.svg('i-arrow')}</a>
    </div>
  </article>`).join('');

const rs = $('#reviews-scroll');
if (rs) rs.innerHTML = window.REVIEWS.map(r => `
  <article class="tcard">
    <p class="tcard__text">“${A.esc(r.text)}”</p>
    <div>
      <div class="tcard__name">${A.esc(r.name)}</div>
      <div class="tcard__date">${A.esc(r.date)} · Google</div>
    </div>
  </article>`).join('');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  $$('.reveal:not(.is-in)').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i % 6, 5) * 70 + 'ms'; io.observe(el);
  });
} else $$('.reveal').forEach(el => el.classList.add('is-in'));
});
})();
