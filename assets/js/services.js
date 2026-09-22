/* Services page — full detail list. */
(function () {
'use strict';
window.AA.onReady(function () {
const A = window.AA, $ = A.$, $$ = A.$$;
const list = $('#svc-list'); if (!list) return;

list.innerHTML = window.SERVICES.map(s => `
  <article class="card svc reveal" id="${A.esc(s.key)}" style="scroll-margin-top:calc(var(--appbar-h) + 20px)">
    <div class="svc__icon">
      ${s.icon ? `<img src="${A.esc(s.icon)}" alt="" width="26" height="26" loading="lazy" decoding="async">`
               : `<span aria-hidden="true">${A.esc(s.glyph)}</span>`}
    </div>
    <h3>${A.esc(s.name)}</h3>
    <p style="font-style:italic;color:var(--gold-lt);font-size:var(--fs-sm)">${A.esc(s.blurb)}</p>
    <p>${A.esc(s.long)}</p>
    <a class="svc__link" href="contact.html">Book this ${A.svg('arrow')}</a>
  </article>`).join('');

/* deep link: services.html#gemstone */
if (location.hash) {
  const t = document.getElementById(location.hash.slice(1));
  if (t) setTimeout(() => t.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
}

$$('.reveal').forEach((el, i) => {
  el.style.transitionDelay = Math.min(i % 6, 5) * 55 + 'ms';
  requestAnimationFrame(() => el.classList.add('is-in'));
});
});
})();
